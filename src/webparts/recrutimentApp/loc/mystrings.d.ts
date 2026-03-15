declare interface IRecrutimentAppWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  AppTitle: string;
  HomeLabel: string;
  LogoutLabel: string;
  LoadingLabel: string;
}

declare module 'RecrutimentAppWebPartStrings' {
  const strings: IRecrutimentAppWebPartStrings;
  export = strings;
}
