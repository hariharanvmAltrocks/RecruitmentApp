import { AdvertisementDetails, CandidateProfile, FilterItem, GetProfileByJobCode, profileXagent, WorkflowJson } from "../../Models/ApIInterface";

export type IGetPortalJobs = {
    UpsertJobs(data: AdvertisementDetails): Promise<ApiResponse<any | null>>;
    getCandidateDetailsInJobCode(FilterValue: FilterItem): Promise<ApiResponse<GetProfileByJobCode[] | null>>;
    getCandidateProfile(CandidateID: string,): Promise<ApiResponse<CandidateProfile[] | null>>;
    UpdateCandidateStatus(data: WorkflowJson): Promise<ApiResponse<any | null>>;
    InsertCandidateDetailsInList(CandidateDetails: any, InterviewPanel: any): Promise<ApiResponse<any | null>>;
    UpsertAgenciesJobs(data: profileXagent): Promise<ApiResponse<any | null>>;
}