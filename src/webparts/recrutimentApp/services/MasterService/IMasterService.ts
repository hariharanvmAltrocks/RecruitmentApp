import { ApiResponse } from "../../models/apimodels";
import { CareerPortalLink, IJobGrade, ITabdetails, IUserDetails, UserRoleResponseDetails } from "../../models/master";

export type IMasterService = {
    userRole(): Promise<UserRoleResponseDetails>;
    // MasterData(EmailId: string, RoleID: number[], UserName: string, UserRole: string[]): Promise<MasterDataResponseDetails>;
    GetCareerPortalIntergLink(filterParam: any, filterConditions: any): Promise<ApiResponse<CareerPortalLink>>;
    GetTabDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<ITabdetails>>;
    GetUserDetails(filterParam: any, filterConditions: any ): Promise<ApiResponse<IUserDetails>>;
    GetGradeLevel(gradeId: string): Promise<ApiResponse<IJobGrade>>;
};