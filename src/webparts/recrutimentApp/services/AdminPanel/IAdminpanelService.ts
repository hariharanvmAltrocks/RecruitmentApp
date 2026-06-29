import { AdminCreateUser } from "../../models/adminpanel";
import { ApiResponse } from "../../models/apimodels";
import { AdminPItem, UpsertExternalUser } from "../../models/Icareerportal";

export interface AdminDashboard {
  ID: number;
  SNO: number;
  TotalItems: string;
  exUserCode: string;
  name: string;
  email: string;
  userId: string;
  ExternalUsersAccounts: string;
  contractStartDate: string;
  contractEndDate: string;
  designation: string;
  isExpat: string;
  noOfUsers: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  hrUserId: string;
}

export type IAdminPanelService = {
  getAdminPanelDashboard(
    FilterValue: AdminPItem,
  ): Promise<ApiResponse<AdminDashboard[] | null>>;
  UpsertExternalUser(
    UpsetUserValue: UpsertExternalUser,
  ): Promise<ApiResponse<any>>;
  InsertExternalUser(
    UpsetUserValue: AdminCreateUser,
    IsEdit: boolean,
  ): Promise<ApiResponse<any>>;
  ResetPassword(UserEmail: string): Promise<ApiResponse<any>>;
};
