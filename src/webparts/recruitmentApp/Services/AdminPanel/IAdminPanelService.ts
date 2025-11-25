import { AdminPItem, UpsertExternalUser } from "../../Models/AdminPanel";

export type IAdminPanelService = {
    getAdminPanelDashboard(FilterValue: AdminPItem): Promise<ApiResponse<AdminPItem[] | null>>;
    UpsertExternalUser(UpsetUserValue: UpsertExternalUser): Promise<ApiResponse<any>>;
}