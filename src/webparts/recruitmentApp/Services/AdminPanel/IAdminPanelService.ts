import { AdminCreateUser, AdminPItem, UpsertExternalUser } from "../../Models/AdminPanel";

export type IAdminPanelService = {
    getAdminPanelDashboard(FilterValue: AdminPItem): Promise<ApiResponse<AdminPItem[] | null>>;
    UpsertExternalUser(UpsetUserValue: UpsertExternalUser): Promise<ApiResponse<any>>;
    InsertExternalUser(UpsetUserValue: AdminCreateUser, IsEdit: boolean): Promise<ApiResponse<any>>;
    ResetPassword(UserEmail: string): Promise<ApiResponse<any>>;
}