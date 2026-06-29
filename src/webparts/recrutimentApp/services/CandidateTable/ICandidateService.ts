import { PanelMember } from "../../components/Screens/CandidateTable/Hooks/fetchPanelMembers";
import { ApiResponse } from "../../models/apimodels";
import {
  CandidateProfile,
  COIType,
  GetProfileByJobCode,
  sendEmail,
  WorkflowJson,
} from "../../models/Icareerportal";
import { COIAttach } from "../CareerPortal/ICareerPortal";
import { CommonServices } from "../ServiceExport";
import { IDocFiles } from "../SPService/Ispservice";

export type GetProfileByFilter = {
  filterValue: string;
  sortBy: string;
  sortOrder: number;
  pageSize: number;
  currentPage: number;
  totalItems: number;
};
export type FilterItem = {
  jobCode: string;
  workflowStausId: string[];
  pagination: GetProfileByFilter;
};

export type panelMember = {
  Level1: PanelEntry[];
  Level2?: PanelEntry[];
};

export interface FetchInterviewPanelOptions {
  BUCodeID: number;
  assignHREmail: string;
  candidateID: string | number;
  statusID: string;
}

export type PanelEntry = {
  value: number;
  label: string;
  Email: string;
  Role?: string;
  Levels?: string;
};

export type CandidateDetails = {
  RecruitmentIDId: number;
  JobCodeId: number;
  FristName: string;
  MiddleName: string;
  LastName: string;
  ResidentialAddress: string;
  DOB: string;
  ContactNumber: string;
  Email: string;
  Gender: string;
  TotalYearOfExperiance: string;
  ReleventExperience: string;
  Qualification: string;
  JobRequestID: string;
  ProfileID: string;
  PositionTitle: string;
  JobGrade: string;
  ExternalAgentDetails: string;
  InterviewDate: string;
  InterviewTime: string;
  InterviewLink: string;
  CandidateResumeLink: string;
  ActionId: number;
  Nationality: string;
  DisabilityDetails: string;
  Disability: string;
  ConflictsOfInterest: string;
  IdentityNumber: string;
  ProofOfIdentity: string;

  LastOrCurrentPosition?: string;
  LastOrCurrentEmployer?: string;
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
};

export type RescheduledCandidate = {
  ID: number;
  InterviewDate: Date | undefined;
  InterviewTime: string;
  InterviewLink: string;
};

export function dedupe<T extends { value: any }>(arr: T[]): T[] {
  const seen = new Set<any>();
  return arr.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
}

export async function resolveName(email: string): Promise<string> {
  try {
    const res = await CommonServices.GetUserName(email);
    return String(res.data ?? email);
  } catch {
    return email;
  }
}

export async function toPanelEntry(
  item: any,
  levelFilter?: string,
): Promise<PanelEntry | null> {
  if (!item?.InterviewPanel?.EMail) return null;
  const label = await resolveName(item.InterviewPanel.EMail);
  return {
    value: item.InterviewPanel.Id,
    label,
    Email: item.InterviewPanel.EMail,
    Levels: item.InterviewLevel,
    ...(levelFilter ? { Levels: levelFilter } : {}),
  };
}

type L2Panel = {
  RecruitmentIDId: number;
  InterviewLevel: string;
  InterviewPanelId: number;
  CandidateIDId: number;
};

export type InterviewscheduleL2 = {
  candidateUpdate: {
    ID: number;
    StatusId: number;
    InterviewDateLevel2: string;
    InterviewTimeLevel2: string;
    InterviewLinkLevel2: string;
  };
  interviewPanelL2: L2Panel[];
};

export type ICandidateService = {
  getCandidateDetailsInJobCode(
    FilterValue: FilterItem,
  ): Promise<ApiResponse<GetProfileByJobCode[] | null>>;
  GetDashboardDetailsL2(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<GetProfileByJobCode[]>>;
  fetchCandidateDetails(
    CandidateID: string,
  ): Promise<ApiResponse<CandidateProfile[] | null>>;
  getCandidateDetailsL2(
    CandidateID: number,
  ): Promise<ApiResponse<CandidateProfile[]>>;
  fetchInterviewPanelDetails({
    BUCodeID,
    assignHREmail,
    candidateID,
    statusID,
  }: FetchInterviewPanelOptions): Promise<ApiResponse<panelMember | null>>;
  UpdateCandidateStatus(data: WorkflowJson): Promise<ApiResponse<any | null>>;
  SendEmailNotification(data: sendEmail): Promise<ApiResponse<any | null>>;
  UploadCOIAttachment(
    DocumentName: COIAttach,
    AttachFile: IDocFiles[],
  ): Promise<ApiResponse<any>>;
  GetUpsertCOI(data: COIType): Promise<ApiResponse<any | null>>;
  InsertCandidateDetailsInList(
    CandidateDetails: CandidateDetails,
    InterviewPanel: any,
  ): Promise<ApiResponse<any | null>>;
  InsertInterviewPanel(
    InterviewPanel: any[],
    CandidateId: number,
  ): Promise<ApiResponse<any | null>>;
  RescheduledInterview(
    obj: RescheduledCandidate,
    ListName: string,
  ): Promise<ApiResponse<null>>;
  fetchCOIAttachment(DocumentName: COIAttach): Promise<ApiResponse<any>>;
  InterviewScheduleLevel2(
    payloads: InterviewscheduleL2,
  ): Promise<ApiResponse<any[]>>;
};
