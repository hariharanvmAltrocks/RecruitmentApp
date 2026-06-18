import { DepartmentDataItem } from "../../components/Screens/Dashboard/Hooks/Usedepartmentchart";
import { Metric } from "../../models/IDashboard";
import { IUserDetails } from "../../models/master";

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
  userDetails: IUserDetails;
}

export type ADGroupData = {
  roleIDs: number[];
  userName: string;
  userRole: string[];
  ADGroupIDs: string[];
  RoleDetails: ResolvedRole[];
  EmailId: string[];
  userDetails: IUserDetails[];
}

export type ApiUrls = {
  CareerPortalLink: string;
  MeetingCode: string;
  MeetingUrl: string;
  HRMSAppLink: string;
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
  MatricData: Metric[];
  DepartmentData: DepartmentDataItem[];
  refreshMetrics: () => Promise<void>;
}

