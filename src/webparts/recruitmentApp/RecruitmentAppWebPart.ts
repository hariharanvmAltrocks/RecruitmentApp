import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'RecruitmentAppWebPartStrings';
import App from './App';
// import { MSGraphClientV3 } from "@microsoft/sp-http";
import { sp } from '@pnp/sp';
import GraphService from './Services/GraphService/GraphService';

export interface IRecruitmentAppWebPartProps {
  description: string;
}

export default class RecruitmentAppWebPart extends BaseClientSideWebPart<IRecruitmentAppWebPartProps> {
  // private graph: MSGraphClientV3;
  public async onInit(): Promise<void> {
    await super.onInit();
    sp.setup({ spfxContext: this.context as unknown as undefined });
    const graphClient = await this.context.msGraphClientFactory.getClient("3");
    GraphService.setGraphClient(graphClient);
  }

  public render(): void {
    const element: React.ReactElement<any> = React.createElement(App);

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
