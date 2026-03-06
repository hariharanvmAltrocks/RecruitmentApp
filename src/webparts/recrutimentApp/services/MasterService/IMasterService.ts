import { ApiResponse } from "../../models/apimodels";
import { CareerPortalLink, MasterDataResponseDetails, UserRoleResponseDetails } from "../../models/master";

export type IMasterService = {
    userRole(): Promise<UserRoleResponseDetails>;
    // MasterData(EmailId: string, RoleID: number[], UserName: string, UserRole: string[]): Promise<MasterDataResponseDetails>;
    GetCareerPortalIntergLink(filterParam: any,filterConditions: any): Promise<ApiResponse<CareerPortalLink>>;
};