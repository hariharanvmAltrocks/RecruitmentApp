import { GetAllMaster, ITSystem, TASystem, TrainingSystem, UploadDocument } from "../../Models/ApIInterface";
import { DataSyncToRecruitmentResponse } from "../RecruitmentProcess/IRecruitmentProcessService";
import { IDocFiles } from "../SPService/ISPServicesProps";

export type DocumentName = {
    ProfileID: string;
    RequestID: string;
    DocumentName: string;
    UnsignedDoc: string;
}
export type DocumentStrucDocs = {
    [category: string]: IDocFiles[];
}

export type GetCandidateDocument = {
    ListName: string;
    ProfileID: string;
    RequestID?: string;
    DocumentType?: string;
    DocumentName?: string;
    UnsignedDoc?: string;
    // EmployDOcs?: any[];
}

export type UpdateCandidateData = {
    InductionType: string
    TCSStartDate?: Date | any;
    TCSEndDate?: Date | any;
    TCSZone?: string;
    TCSRegion?: string;
    TCSComments?: string;

    PermanentBadgeStartDate: Date | any;
    PermanentBadgeEndDate: Date | any;
    PermanentBadgeRegion: string;
    PermanentBadgeZone: string;
    PermanentBadgeComments: string;


    ITStartDate: Date | any;
    Hardware: any;
    ITZone: string;
    ITRegion: string;
    ITComments: string;

    ITStatus: string
    IsIntegratedPowerAutomatrTrigger: string
}

export type DataSyncToResiProcess = {
    ID: number,
    BusinessUnitCode: string,
    Department: string,
    JobTitle: string,
    ApplicantName: string,
    PositionID: string,
    RecruitmentIDId: number,
    RecruitmentDetails: DataSyncToRecruitmentResponse,
    CandidateDetails: ICandidateDetails,
    StatusID: number,
    Status: string,
    IsExpat: string,
    ActionID: number
}

export type ICandidateDetails = {
    CandidateID: number;
    ApplicantName: string;
    FristName: string,
    MiddleName: string,
    LastName: string,
    Email: string,
    JobRequestID: string,
    ProfileID: string,
    Nationality: string,
    IdentityNumber: string,
    ProofOfIdentity: string,
    Location: string;
    Agencies: string;
    // DocumentFolderPath: string;
    TrainingSystem: TrainingSystem;
    TASystem: TASystem;
    ITSystem: ITSystem;
    BackgroundChecks: string;
    SignedOfferLetterVerified: string;
    SignedEmploymentContract: string;
    WorkPermitApproved: string;
    VisaProcess: string;
    AccommodationBooked: string;
    TravelProcess: string;
    ReadyforOnboarding: string;
    MedicalCheckStatus: string;
    Gender: string;
    NationalityCode: string;
}

export type GetBGVDocument = {
    ListName: string;
    ProfileID: string;
    RequestID: string;
    DocumentType: string;
    DocumentName: string[];
    VerificationName: GetAllMaster[] | null
}
export type GetDOTAfricaCF = {
    ListName: string;
    Natioality: string;
}

export type IOfferLetterService = {
    UploadCandidateDocument(
        DocumentName: DocumentName,
        AttachFile: IDocFiles[],
    ): Promise<ApiResponse<any>>;
    fetchResiCandidateDetails(
        Filter: any[],
        Conditions: any,
    ): Promise<ApiResponse<DataSyncToResiProcess[]>>;
    fetchHODSelectedCandidate(
        Filter: any[],
        Conditions: any,
    ): Promise<ApiResponse<any[]>>;
    FetchCandidateDocument(
        DocumentName: GetCandidateDocument,
    ): Promise<ApiResponse<any>>;
    UpdateStatusInSpfxlist(
        UpdateParams: any,
    ): Promise<ApiResponse<any>>;
    FilterZoneInRegion(
        Filter: any[],
        Conditions: any,
    ): Promise<ApiResponse<any>>;
    UpdateCandidateOnboardDate(
        UpdateData: UpdateCandidateData,
        CandidateID: number
    ): Promise<ApiResponse<UpdateCandidateData>>;
    InitiateLabouHireOfferRelease(
        data: UploadDocument,
        HODData: DataSyncToResiProcess,
        CurrentUserEmail: string
    ): Promise<ApiResponse<null>>;
    FetchBGVerificationDOcs(
        DocumentName: GetBGVDocument,
    ): Promise<ApiResponse<any>>;
    UpdateStatusCandidatelist(
        UpdateParams: any,
    ): Promise<ApiResponse<any>>;
    FetchDotAfricaConsentForm(
        DocumentName: GetDOTAfricaCF,
    ): Promise<ApiResponse<any>>;
    FetchResiDetails(ID: number, IsExpat: string
    ): Promise<ApiResponse<{ netPay: string, lhCode: string } | null>>;
};