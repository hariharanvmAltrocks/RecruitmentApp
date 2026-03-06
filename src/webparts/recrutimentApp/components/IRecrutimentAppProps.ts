import { SPFI } from "@pnp/sp";

export interface IRecrutimentAppProps {
  sp: SPFI;
  description: string;
  webURL: string;
  context: any;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
