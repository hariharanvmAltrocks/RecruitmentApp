import { ITSystem, TASystem, TrainingSystem } from "../../Models/ApIInterface";
import { DataSyncToRecruitmentResponse } from "../RecruitmentProcess/IRecruitmentProcessService";
import { IDocFiles } from "../SPService/ISPServicesProps";

export type DocumentName = {
    RequestID: string;
    DocumentName: string;
    UnsignedDoc: string;
}
export type DocumentStrucDocs = {
    [category: string]: IDocFiles[];
}

export type GetCandidateDocument = {
    ListName: string;
    RequestID: string;
    DocumentType: string;
    DocumentName: string;
    UnsignedDoc: string;
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
    DocumentFolderPath: string;
    TrainingSystem: TrainingSystem;
    TASystem: TASystem;
    ITSystem: ITSystem;
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
};