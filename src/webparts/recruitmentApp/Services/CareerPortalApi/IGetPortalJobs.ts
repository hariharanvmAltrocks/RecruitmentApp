import { AdvertisementDetails, CandidateProfile, CheckMyCandidate, COIType, FilterItem, GetAllMaster, GetMasterByCountry, GetProfileByFilter, GetProfileByJobCode, getQuestionById, profileXagent, sendEmail, UpsertMasters, UpsertProfile, UpsertQuestions, WorkflowJson } from "../../Models/ApIInterface";
import { CommanQuestion, QuestionItem } from "../../Models/RecuritmentVRR";
import { ViewQuestion } from "../../Screens/ScreenComponent/ViewQuestionCheckbox";
import { DataSyncToRecruitmentResponse } from "../RecruitmentProcess/IRecruitmentProcessService";
import { IDocFiles } from "../SPService/ISPServicesProps";

export type CandidateDetails = {
    RecruitmentIDId: number,
    JobCodeId: number
    FristName: string,
    MiddleName: string,
    LastName: string,
    ResidentialAddress: string,
    DOB: string,
    ContactNumber: string
    Email: string,
    Gender: string,
    TotalYearOfExperiance: string,
    ReleventExperience: string,
    Qualification: string,
    JobRequestID: string,
    ProfileID: string,
    PositionTitle: string,
    JobGrade: string,
    ExternalAgentDetails: string,
    InterviewDate: string,
    InterviewTime: string,
    InterviewLink: string,
    CandidateResumeLink: string,
    ActionId: number,
    Nationality: string,
    DisabilityDetails: string,
    Disability: string,
    ConflictsOfInterest: string,
    IdentityNumber: string,
    ProofOfIdentity: string,

    LastOrCurrentPosition?: string,
    LastOrCurrentEmployer?: string,
    PreviouslyWorkedInIvanhoeMines?: string;
    NumberOfTaxDependents?: number;
    Age?: number;
    Citizenship?: string;
    AnyFamilyorOtherLinks?: string;
    AnyBusinessLinksToDeclare?: string;
    WillingToRelocate?: string;
    CountryofOrgin?: string;
    OthersInterviewed?: string;

    FamilyLink?: string;
    BusinessLink?: string;
    GPA?: number;

    COIComments?: string;
    COIEmail?: string;
    COIReason?: string;

    countryOfResidency?: string;
    ResidencyStatus?: string;
    MaritalStatus?: string;
    ChildrenDetails?: string;
    ReferenceEmployeeDetails?: string;
    // CandidateOnboardingDate: string;
    // EngagementDate: string;
    hasIvanhoeZijinExperience?: string;
    OperationRoleRegion?: string;
    NationalityCode?: string;
    LanguageKnown?: string;
}
export type RescheduledCandidate = {
    ID: number
    InterviewDate: Date | undefined,
    InterviewTime: string,
    InterviewLink: string
}

export type UpsertDocument = {
    CandidateCV: IDocFiles[];
    familyLink: IDocFiles[];
    businessLink: IDocFiles[];
}

export type DocumentValue = {
    DocumentTypeEnum: string;
    DocumentTypeName: string;
    JobCode: string;
    File: any;
    FileName: string;
    ProfileId: string;
}

export type COIAttach = {
    RequestID: string;
    DocumentName: string;
}

export type IGetPortalJobs = {
    UpsertJobs(data: AdvertisementDetails): Promise<ApiResponse<any | null>>;
    getCandidateDetailsInJobCode(FilterValue: FilterItem): Promise<ApiResponse<GetProfileByJobCode[] | null>>;
    getCandidateProfile(CandidateID: string, EmployeeList?: any[], RecrutimentData?: DataSyncToRecruitmentResponse): Promise<ApiResponse<CandidateProfile[] | null>>;
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
    GetCountryMaster(): Promise<ApiResponse<GetMasterByCountry[] | null>>;
    GetStateByCountry(code: string): Promise<ApiResponse<GetMasterByCountry[] | null>>;
    GetCitiesByState(code: string): Promise<ApiResponse<GetMasterByCountry[] | null>>;
    UpsertProfile(data: UpsertProfile, Document: UpsertDocument, jobCode: string): Promise<ApiResponse<any | null>>;
    CheckMyCandidateAppliedJobs(data: CheckMyCandidate): Promise<ApiResponse<any | null>>;
    GetCandiateForJobs(JobCode: string, FilterValue: GetProfileByFilter): Promise<ApiResponse<GetProfileByJobCode[] | null>>;
    GetJobRequestData(data: any[]): Promise<ApiResponse<any | null>>;
    GetQuestionByJobCode(jobCode: string): Promise<ApiResponse<CommanQuestion[] | null>>;
    UpsertDocumentUpload(DocumentDetails: DocumentValue): Promise<ApiResponse<any | null>>;
    UploadCOIAttachment(DocumentName: COIAttach, AttachFile: IDocFiles[]): Promise<ApiResponse<any>>;
    fetchCOIAttachment(DocumentName: COIAttach): Promise<ApiResponse<any>>;
    GetUpsertCOI(data: COIType): Promise<ApiResponse<any | null>>;
    SendEmailNotification(data: sendEmail): Promise<ApiResponse<any | null>>;
}