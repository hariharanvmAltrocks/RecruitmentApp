import { IselectedPosition } from "../../components/Screens/OfferRelease/ReviewDocument/PositionFrame";
import { ApiResponse } from "../../models/apimodels";
import { GetAllMaster } from "../../models/Icareerportal";
import { IDocFiles } from "../SPService/Ispservice";

export type DocumentName = {
  ProfileID: string;
  RequestID: string;
  DocumentName: string;
  UnsignedDoc: string;
};
export type DocumentStrucDocs = {
  [category: string]: IDocFiles[];
};

export type GetCandidateDocument = {
  ListName: string;
  ProfileID: string;
  RequestID?: string;
  DocumentType?: string;
  DocumentName?: string;
  UnsignedDoc?: string;
  // EmployDOcs?: any[];
};

export type UpdateCandidateData = {
  InductionType: string;
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

  ITStatus: string;
  IsIntegratedPowerAutomatrTrigger: string;
};

export type GetBGVDocument = {
  ListName: string;
  ProfileID: string;
  RequestID: string;
  DocumentType: string;
  DocumentName: string[];
  VerificationName: GetAllMaster[] | null;
};
export type GetDOTAfricaCF = {
  ListName: string;
  Natioality?: string;
  ProfileID: string;
  RequestID: string;
  DocumentType?: string;
  DocumentName?: string[];
};

export type InitiateLaborHire = {
  ID: number;
  IsExpat: boolean;
  jobRequestID: number;
  positionId: string;
  location: string;
  businessUnit: string;
  department: string;
  section: string;
  patersonGrade: string;
  drcGrade: string;
  reportingManager: string;
  dateOfJoining?: Date | null;
  typeOfContract: string;
  noOfMonths?: string;
  createdOn: Date;
  createdBy: string;
  createrEmail: string;
};

export type IUpdateCandidate = {
  ID: number;
  JoiningDate?: string;
  NoticePeriod?: string;
  BackgroundChecksResults?: string;
  BGVConsultedWith?: string;
  BGVComments?: string;
  PPEKit?: string;
  payslipVerification?: string;
  bankStatementVerified?: string;
};

export type IUpdateStatusSelectedHOD = {
  ID: number;
  StatusId: number;
  // ActionId: number;
  // ItemCreated: string;
};

export type IOfferService = {
  GetSelectedCandidate(
    RecID: number,
    CandidateID: number,
    SelectedCandidateID: number,
    JobRequestID: string,
    isExpat: boolean,
  ): Promise<ApiResponse<IselectedPosition | null>>;
  InitiateLabouHireOfferRelease(
    data: InitiateLaborHire,
    CurrentUserEmail: string,
  ): Promise<ApiResponse<null>>;
  FetchBGVerificationDOcs(
    DocumentName: GetBGVDocument,
  ): Promise<ApiResponse<any>>;
  UploadCandidateDocument(
    DocumentName: DocumentName,
    AttachFile: IDocFiles[],
  ): Promise<ApiResponse<any>>;
  FetchCandidateDocument(
    DocumentName: GetCandidateDocument,
  ): Promise<ApiResponse<IDocFiles[] | null>>;
  CheckBGVerification(JobRequestId: number): Promise<ApiResponse<any | null>>;
  InsertRecruitmentCandidateDetails(
    data: IUpdateCandidate,
  ): Promise<ApiResponse<any | null>>;
  UpdateStatusSelectedHOD(
    UpdateParams: IUpdateStatusSelectedHOD[],
  ): Promise<ApiResponse<any>>;
  GetJobRequestData(data: any[]): Promise<ApiResponse<any | null>>;
  PerformCriminalRecordCheck(id: number): Promise<ApiResponse<any | null>>;
  UpdateStatusCandidatelist(UpdateParams: any): Promise<ApiResponse<any>>;
};
