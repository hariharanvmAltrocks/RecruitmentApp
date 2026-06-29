import { ApiResponse } from "../../models/apimodels";
import { AutoCompleteItem } from "../../models/fieldmodels";
import { profileXagent, UpsertBGV } from "../../models/Icareerportal";
import { IDocFiles } from "../SPService/Ispservice";

export type DataSyncToRecruitmentResponse = {
  ID: number;
  RecordID: number;
  BusinessUnitCode: string;
  BusinessUnitCodeId: number;
  BusinessUnitName: string;
  BusinessUnitDescription: string;
  Nationality: string;
  DepartmentId: number;
  Department: string;
  SubDepartment: string;
  SubDepartmentId: number;
  Section: string;
  SectionId: number;
  DepartmentCodeId: number;
  DepartmentCode: string;
  DeptCode: string;
  EmploymentCategory: string;
  TypeOfContract: string;
  NumberOfPersonNeeded: string;
  EnterNumberOfMonths: string;
  AreaofWork: string;
  DateRequried: Date | undefined;
  Type: string;
  Status: string;
  StatusId: number;
  Action: string;
  ActionTypeId: number;
  Location: string;

  JobCodeId: number;
  JobCode: string;
  JobTitleEnglish: string;
  JobTitleFrench: string;
  PatersonGrade: string;
  DRCGrade: string;
  JobTitleEnglishId: number;
  JobTitleFrenchId: number;
  PatersonGradeId: number;
  DRCGradeId: number;

  Checked: boolean;

  VacancyConfirmed: string;
  RecruitmentAuthorised: string;
  IsPayrollEmailed: string;
  AssignedHR: string;
  AssignedHRId: number;
  AssignLineManager: string;
  AssignLineManagerId: number;
  AssignHOD: string;
  ReasonForVacancy: string;

  JobPostingStartDate: string | undefined;
  JobPostingEndDate: string | undefined;
  JobPostingFirstExtensionEndDate: string | undefined;
  JobPostingSecondExtensionEndDate: string | undefined;

  AssignEMail: string;
  AssignHRLead?: string;
  QuestionByHR: string;
  QuestionByLM: string;
  ModifiedDate: string | undefined;
  CreatedDate: string | undefined;
};

export type InsertComments = {
  RoleId: number | null;
  RecruitmentIDId: number;
  Comments: string;
};

export type PostRecuritmentData = {
  Data: {
    BusinessUnitCodeId: number;
    Nationality: string;
    DepartmentId: number;
    SubDepartmentId: number;
    SectionId: number;
    DepartmentCodeId: number;
    EmploymentCategory: string;
    TypeOfContract: string;
    NumberOfPersonNeeded: number;
    EnterNumberOfMonths: string;
    AreaofWork: string;
    DateRequried: Date | null;
    DataFrom: string;
    StatusId: number;
    // ActionId: number,
    JobCodeId: number;
    AssignedHR: string;
    RecruitmentHRLead: string;
    Location: string;
    LineManager?: string;
    HOD?: string;
  };
  PositionData: {
    JobTitleEnglishId: number;
    JobTitleFrenchId: number;
    PatersonGradeId: number;
    DRCGradeId: number;
  };
  CommentsList: InsertComments;
  updatePreList: {
    ID: number;
    ActionId: number;
    ItemCreated: string;
    IsDataSyncToRecruitment: string;
  };
  CareerPortalIntegration?: {
    JobCode: string;
    JobUniqueKey: string;
  };
};

export type PostAgentData = {
  Data: {
    AgentId: number;
    JobCodeId: number;
    RecrutimentId: number;
  };
  AgentProfileData: profileXagent;
  CommentsList: InsertComments;
};

export type QualificationValue = {
  MinQualification: AutoCompleteItem[];
  PrefeQualification: AutoCompleteItem[];
  MinQualification_fr: AutoCompleteItem[];
  PrefeQualification_fr: AutoCompleteItem[];
};

export type RoleSpecKnowledge = {
  RoleSpeKnowledge: AutoCompleteItem;
  RequiredLevel: AutoCompleteItem;
  RoleSpeKnowledge_fr: AutoCompleteItem;
  RequiredLevel_fr: AutoCompleteItem;
};

export type TechnicalSkills = {
  TechnicalSkills: AutoCompleteItem;
  LevelProficiency: AutoCompleteItem;
  TechnicalSkills_fr: AutoCompleteItem;
  LevelProficiency_fr: AutoCompleteItem;
};

export type IDptData = {
  ID: number;
  JobCodeId: number;
  JobCode: string;
  JobTitleEnglish: string;
  JobTitleFrench: string;
  DepartmentID: number;
  Nationality: string;
  NumberOfPersonNeeded: string;
  Dptcode?: string;
  reviewerComments?: string;
  StatusId: number;
};

export type IRecruitmentService = {
  GetRecruitmentDetails(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
  GetNPAEPVRRDetails(
    filterParam: any,
    filterConditions: any,
    Type: string,
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
  GetCandidateDetails(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
  GetSelectedCandidate(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;

  InsertRecruitmentDptBatch(
    payload: PostRecuritmentData[],
  ): Promise<ApiResponse<any>>;
  GetHRMSRecruitmentRoleProfileDetails(
    filterParam: any[],
    filterConditions: any,
  ): Promise<ApiResponse<any | null>>;
  GetBGVerificationType(): Promise<ApiResponse<any | null>>;
  PostCommentsData(
    obj: InsertComments,
  ): Promise<ApiResponse<InsertComments | null>>;
  UploadAdvertisementInPortal(
    Filter: any[],
    Condition: string,
    RecuritmentDetails: IDptData,
    IsActive: number,
    IsExtened: number,
    JobBasedBGVVerification?: string,
    onemDocs?: IDocFiles[],
    extendStartDate?: Date,
    extendEndDate?: Date,
  ): Promise<ApiResponse<null>>;
  UpsertBGVJobMaster(UpsertData: UpsertBGV[]): Promise<ApiResponse<any | null>>;
  InsertExternalAgencyDetails(
    payloads: PostAgentData[],
  ): Promise<ApiResponse<any[]>>;
};

export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent?.trim() ?? "";
};
