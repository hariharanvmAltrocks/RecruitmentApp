export type UserRoleData = {
  ID: number;
  RoleTitle: string;
  ADGroupID: string;
  EmailId?: string;
}

export type ResolvedRole = {
  ID: number;
  RoleTitle: string;
  ADGroupID: string;
  EmailId: string;
}

export type ADGroupData = {
  roleIDs: number[];
  userName: string;
  userRole: string[];
  ADGroupIDs: string[];
  RoleDetails: ResolvedRole[];
  EmailId:string[]
}

export type ApiUrls = {
  CareerPortalLink: string;
  MeetingCode: string;
  MeetingUrl: string;
}

export type RoleContextType = {
  roleIDs: number[];
  userName: string;
  userRole: string[];
  ADGroupData: ADGroupData;
  isLoading: boolean;
  error: Error | null;
  showRoleSelector: boolean;
  setShowRoleSelector: React.Dispatch<React.SetStateAction<boolean>>;
}

