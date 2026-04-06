import { ApiResponse } from "../../models/apimodels";
import { GetAllMaster, GetMasterByCountry } from "../../models/Icareerportal";
import { CareerPortalLink, IBUCodeEmailIDs, IJobGrade, ITabdetails, IUniqueJobCode, IUserDetails, UserRoleResponseDetails } from "../../models/master";

export type IMasterService = {
    userRole(): Promise<UserRoleResponseDetails>;
    // MasterData(EmailId: string, RoleID: number[], UserName: string, UserRole: string[]): Promise<MasterDataResponseDetails>;
    GetCareerPortalIntergLink(filterParam: any, filterConditions: any): Promise<ApiResponse<CareerPortalLink>>;
    GetTabDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<ITabdetails>>;
    GetUserDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<IUserDetails>>;
    GetGradeLevel(gradeId: string): Promise<ApiResponse<IJobGrade>>;
    GetJobUniqueDataValue(JobCodeId: number): Promise<ApiResponse<IUniqueJobCode>>;
    GetAllMaster(id: number): Promise<ApiResponse<GetAllMaster[] | null>>;
    GetCountryMaster(): Promise<ApiResponse<GetMasterByCountry[] | null>>;
    fetchJDEEmailIDs(BUCodeID: number): Promise<ApiResponse<IBUCodeEmailIDs>>;
};