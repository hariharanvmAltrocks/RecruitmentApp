import { ApiResponse } from "../../models/apimodels";
import { AutoCompleteItem } from "../../models/fieldmodels";

export type DataSyncToRecruitmentResponse = {
ID: number,
RecordID: number,
BusinessUnitCode: string,
BusinessUnitCodeId: number,
BusinessUnitName: string;
BusinessUnitDescription: string;
Nationality: string,
DepartmentId: number;
Department: string,
SubDepartment: string,
SubDepartmentId: number,
Section: string,
SectionId: number,
DepartmentCodeId: number,
DepartmentCode: string,
EmploymentCategory: string,
TypeOfContract: string,
NumberOfPersonNeeded: string,
EnterNumberOfMonths: string,
AreaofWork: string,
DateRequried: Date | undefined,
Type: string,
Status: string,
StatusId: number,
Action: string,
ActionTypeId: number,
Location: string,

JobCodeId: number,
JobCode: string,
JobTitleEnglish: string,
JobTitleFrench: string,
PatersonGrade: string,
DRCGrade: string,
JobTitleEnglishId: number,
JobTitleFrenchId: number,
PatersonGradeId: number,
DRCGradeId: number,

Checked: boolean,

VacancyConfirmed: string;
RecruitmentAuthorised: string;
IsPayrollEmailed: string;
AssignedHR: string;
AssignedHRId: number;
AssignLineManager: string;
AssignLineManagerId: number;
AssignHOD: string;
ReasonForVacancy: string;

JobPostingStartDate: string | undefined,
JobPostingEndDate: string | undefined,
JobPostingFirstExtensionEndDate: string | undefined,
JobPostingSecondExtensionEndDate: string | undefined,

AssignEMail: string,
AssignHRLead?: string;
QuestionByHR: string;
QuestionByLM: string;
ModifiedDate: string | undefined;
CreatedDate: string | undefined
}

export type InsertComments = {
  RoleId: number | null;
  RecruitmentIDId: number;
  Comments: string;
};

export type PostRecuritmentData = {
  Data: {
    BusinessUnitCodeId: number,
    Nationality: string,
    DepartmentId: number;
    SubDepartmentId: number,
    SectionId: number,
    DepartmentCodeId: number,
    EmploymentCategory: string,
    TypeOfContract: string,
    NumberOfPersonNeeded: number,
    EnterNumberOfMonths: string,
    AreaofWork: string,
    DateRequried: Date | null,
    DataFrom: string,
    StatusId: number,
    ActionId: number,
    JobCodeId: number,
    AssignedHR: string,
    RecruitmentHRLead: string
    Location: string;
  },
  PositionData: {
    JobTitleEnglishId: number,
    JobTitleFrenchId: number,
    PatersonGradeId: number,
    DRCGradeId: number,
  },
  CommentsList: InsertComments,
  updatePreList: {
    ID: number
    ActionId: number,
    ItemCreated: string,
    IsDataSyncToRecruitment: string,
  }
}

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

export type IRecruitmentService = {
GetRecruitmentDetails(
filterParam: any,
filterConditions: any,
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
GetNPAEPVRRDetails(
filterParam: any,
filterConditions: any,
Type: string
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
GetCandidateDetails(
filterParam: any,
filterConditions: any
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
GetSelectedCandidate(
filterParam: any,
filterConditions: any
): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> ;

InsertRecruitmentDptBatch(
payload: PostRecuritmentData[]
): Promise<ApiResponse<any>>;
GetHRMSRecruitmentRoleProfileDetails(
  filterParam: any[],
  filterConditions: any
): Promise<ApiResponse<any | null>> ;
};