import { AdvertisementDetails, CandidateProfile, FilterItem, GetAllMaster, GetProfileByJobCode, getQuestionById, profileXagent, UpsertMasters, UpsertQuestions, WorkflowJson } from "../../Models/ApIInterface";
import { QuestionItem } from "../../Models/RecuritmentVRR";
import { ViewQuestion } from "../../Screens/ScreenComponent/ViewQuestionCheckbox";

export type CandidateDetails = {
    RecruitmentIDId: number,
    JobCodeId: number
    FristName: string,
    MiddleName: string,
    LastName: string,
    ResidentialAddress: string,
    DOB: Date | undefined
    ContactNumber: number
    Email: string,
    Gender: string,
    TotalYearOfExperiance: string,
    ReleventExperience: number,
    Qualification: string,
    JobRequestID: string,
    ProfileID: string,
    PositionTitle: string,
    JobGrade: string,
    ExternalAgentDetailsId: number,
    InterviewDate: Date | undefined,
    InterviewTime: string,
    InterviewLink: string,
    CandidateResumeLink: string,
    ActionId: number,
    Nationality: string,
    DisabilityDetails: string,
    Disability: string,
    ConflictsOfInterest: string,
}
export type RescheduledCandidate = {
    ID: number
    InterviewDate: Date | undefined,
    InterviewTime: string,
    InterviewLink: string
}

export type IGetPortalJobs = {
    UpsertJobs(data: AdvertisementDetails): Promise<ApiResponse<any | null>>;
    getCandidateDetailsInJobCode(FilterValue: FilterItem): Promise<ApiResponse<GetProfileByJobCode[] | null>>;
    getCandidateProfile(CandidateID: string,): Promise<ApiResponse<CandidateProfile[] | null>>;
    UpdateCandidateStatus(data: WorkflowJson): Promise<ApiResponse<any | null>>;
    InsertCandidateDetailsInList(CandidateDetails: CandidateDetails, InterviewPanel: any): Promise<ApiResponse<any | null>>;
    UpsertAgenciesJobs(data: profileXagent): Promise<ApiResponse<any | null>>;
    UpsertMaster(data: UpsertMasters[]): Promise<ApiResponse<any | null>>;
    UpsertQuestions(data: UpsertQuestions[]): Promise<ApiResponse<any | null>>;
    GetAllMaster(id: number): Promise<ApiResponse<GetAllMaster[] | null>>;
    getQuestionnaire(JobCode: string): Promise<ApiResponse<QuestionItem[] | null>>;
    RescheduledInterview(obj: RescheduledCandidate, ListName: string): Promise<ApiResponse<null>>;
    GetQuestionaireByScope(GetExistingQuestion: getQuestionById): Promise<ApiResponse<ViewQuestion[] | null>>;
    InsertInterviewPanel(InterviewPanel: any[], CandidateId: number): Promise<ApiResponse<any | null>>;
}