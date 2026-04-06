import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import * as strings from "RecrutimentAppWebPartStrings";
import { IRecrutimentAppProps } from "./components/IRecrutimentAppProps";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import App from "./App";
import { initSP } from "./services/SPService/spservice";
import GraphService from "./services/GraphService/GraphService";
import "./External/style.css";
import "./External/tailwind.css";

export interface IRecrutimentAppWebPartProps {
  description: string;
}

export default class RecrutimentAppWebPart extends BaseClientSideWebPart<IRecrutimentAppWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IRecrutimentAppProps> =
      React.createElement(App, {
        sp: this._sp,
        description: this.properties.description,
        webURL: this.context.pageContext.web.absoluteUrl,
        context: this.context,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
      });

    ReactDom.render(element, this.domElement);
  }

  private _sp: SPFI = new SPFI();

  protected async onInit(): Promise<void> {
    await super.onInit();

    initSP(this.context);
    const graphClient = await this.context.msGraphClientFactory.getClient("3");
    GraphService.setGraphClient(graphClient);
  }

  // protected onInit(): Promise<void> {
  //   return this._getEnvironmentMessage().then(message => {
  //     this._environmentMessage = message;
  //   });
  // }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
            case "TeamsModern":
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment,
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null,
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null,
      );
      this.domElement.style.setProperty("--primaryColor", "#0078d4");
      this.domElement.style.setProperty("--secondaryColor", "#ff8c00");
      this.domElement.style.fontFamily = '"Inter", "Segoe UI", sans-serif';
      this.domElement.style.setProperty(
        "--fontFamily",
        '"Inter", "Segoe UI", sans-serif',
      );

      const styleId = "kamoa-global-font";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
        * {
          font-family: "Inter", "Segoe UI", sans-serif !important;
        }
      `;
        document.head.appendChild(style);
      }
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
