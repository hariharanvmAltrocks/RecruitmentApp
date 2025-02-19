import { AdvertisementDetails, CandidateProfile, GetProfileByFilter, GetProfileByJobCode, WorkflowJson } from "../../Models/ApIInterface";

export type IGetPortalJobs = {
    UpsertJobs(data: AdvertisementDetails): Promise<ApiResponse<any | null>>;
    getCandidateDetailsInJobCode(JobCode: string, FilterValue: GetProfileByFilter): Promise<ApiResponse<GetProfileByJobCode[] | null>>;
    getCandidateProfile(CandidateID: string,): Promise<ApiResponse<CandidateProfile[] | null>>;
    UpdateCandidateStatus(data: WorkflowJson): Promise<ApiResponse<any | null>>;
    InsertCandidateDetailsInList(CandidateDetails: any, InterviewPanel: any): Promise<ApiResponse<any | null>>
}