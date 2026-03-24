import { ApiResponse } from "../../models/apimodels";
import { AutoCompleteItem } from "../../models/fieldmodels";
import { AdvertisementDetails, FilterItem, GetProfileByJobCode, CandidateProfile, WorkflowJson, profileXagent, UpsertMasters, UpsertQuestions, GetAllMaster, getQuestionById, GetMasterByCountry, UpsertProfile, CheckMyCandidate, GetProfileByFilter, COIType, sendEmail } from "../../models/Icareerportal";
import { DataSyncToRecruitmentResponse } from "../Dashboard/IDashboard";
import { IDocFiles } from "../SPService/Ispservice";


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

export type QuestionItem = {
};

export type CommanQuestion = {
};
export type answerContent = {
    optContentId: string;
    contentEn: string,
    contentFr: string,
}

export type optContent = {
    optContentId: string;
    optContent: string;
}

export interface OptionRow {
    key: number;
    text: string;
    textFr?: string;
    isCorrect?: boolean;
    textvalidation?: boolean;
    textvalidationFr?: boolean;
    fieldValidation?: boolean;
    fieldValidationFr?: boolean;
}

export interface ViewQuestion {
    id: number;
    discipline: AutoCompleteItem | string;
    questionType: AutoCompleteItem | string;
    question: string;
    questionFr?: string;
    expectedAnswer: string;
    expectedAnswerFr?: string;
    CareerportalAnswer: OptionRow[];
    options?: OptionRow[];
    Disqualification: string;
    Type?: string;
    Checked?: boolean;
    HeaderLabel?: string;
    header?: string;
    scope?: string;
    questionNumber?: { key: number; text: string };
    createdBy?: string
}

export type Icareerportal = {
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
    GetJobAppliedCount(data: string[]): Promise<ApiResponse<any | null>>;
    GetCOIProfileOption(data: DataSyncToRecruitmentResponse): Promise<ApiResponse<AutoCompleteItem[] | null>>
}