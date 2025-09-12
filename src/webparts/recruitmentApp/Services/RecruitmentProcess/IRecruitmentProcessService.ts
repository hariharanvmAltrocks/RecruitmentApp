import { AutoCompleteItem, InterviewPanelMember, tooltipInterviewPanel } from "../../Models/Screens";


export interface IAttachmentExampleState {
  file: File | any;
  fileName: string;
  fileContent: string | ArrayBuffer | null;
  serverRelativeUrl: string;
  ID: string;
}

export type CommentsData = {
  Id: number | null;
  Name: string;
  JobTitleInEnglish: string;
  JobTitleInFrench: string;
  comments: string;
  Department: string;
  Date: any | null;
  JobTitle: string;
  RoleName: string;
  CandidateID?: any;
  RoleId?: number;
  RoleTitle?: string;
  Level?: string;
  OverAllEvaluationFeedback?: string;

};

export type InsertComments = {
  RoleId: number | null;
  RecruitmentIDId: number;
  Comments: string;
};

export type IAdditionalHeadCountResponse = {
  Id: number;
  Sl: number;
  Activity: string;
  HeadCountId: number;
  ISBudgetOrUnBudgeted: string;
  PositionType: string;
  ReasonForAdditionalPosition: string;
  BusinessUnitCodeId: number;
  Businessunitcode: string;
  BusinessUnitName: string;
  BusinessUnitDescription: string;
  DepartmentId: number;
  Department: string;
  SubDepartmentId: number;
  SubDepartment: string;
  SectionId: number;
  Section: string;
  DepartmentCodeId: number;
  DepartmentCode: string;
  Nationality: string;
  JobTitleEnglishId: number;
  JobTitleEnglish: string;
  JobTitleFrenchId: number;
  JobTitleFrench: string;
  PatersonGradeId: number;
  PatersonGrade: string;
  DRCGradeId: number;
  DRCGrade: string;
  DatePositionIsRequired: Date | any;
  ApprovedHeadCountInLP: number;
  ActualPosition: number;
  VacantPosition: number;
  AdditionalHeadCountRequried: number;
  FinalPositionCount: number;
  ActualVacantPosition: number;
  IsHRBudgetPlan: any;
  IsHRConformBudgetPlan: any;
  IsCEORequried: any;
  AreaofWork: string;
  EmployementCategory: string;
  NoOfMonth: string;
  TypeOfContract: string;
  Location: string;
  StatusOrder: number;
  StatusId: number;
  Status: string;
  CreatedBy: string;
}

export type DataSyncToRecruitmentResponse = {
  ID: number,
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

  JobPostingStartDate: Date | undefined,
  JobPostingEndDate: Date | undefined,
  JobPostingFirstExtensionEndDate: Date | undefined,
  JobPostingSecondExtensionEndDate: Date | undefined,

  AssignEMail: string,
  AssignHRLead?: string;
  QuestionByHR: string;
  QuestionByLM: string;
}

export type JobCodeData = {
  JobCode: string;
  JobCodeID: number;
}

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

export type GetJobUniqueKey = {
  JobCode: string;
  JobUniqueKey: string;
  IsActive: string;
}
export type IRecruitmentService = {
  GetJobTitleInNPEP(
    Filter: any[],
    Conditions: any,
    ModalDropDown: any
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
  GetAdditionalExistingPositionEditView(
    Filter: any[],
    Conditions: any,
    ModalDropDown: any
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
  fetchNewPositionRequest(filterParam: any, filterConditions: any, ModalDropDown: any): Promise<ApiResponse<DataSyncToRecruitmentResponse[] | null>>;
  GetVacancyDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>>;
  InsertRecruitmentDpt(RecruitmentValue: PostRecuritmentData): Promise<ApiResponse<any | null>>;
  GetPositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>>;
  GetRecruitmentDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>>;
  GetCandidateDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>>;
  AssignCandidateRecuritmentHR(
    ID: number,
    param: any,
    listName: string
  ): Promise<ApiResponse<any | null>>;
  GetAttachedRoleProfile(
    indexID: any,
    DocLibrarayName: string
  ): Promise<IAttachmentExampleState[]>;
  InsertRecruitmentCandidateDetails(param: any): Promise<any | null>;
  GetInterviewPanelCandidateDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<any | null>;
  GetCommentsData(
    EmployeeList: any[],
    Conditions: string,
    filterConditions: any
  ): Promise<ApiResponse<CommentsData[]>>;
  InsertCommentsList(
    obj: InsertComments
  ): Promise<ApiResponse<InsertComments | null>>;
  InsertList(obj: {}, ListName: string): Promise<ApiResponse<null>>;
  GetHRMSRecruitmentRoleProfileDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>>;
  InsertExternalAgencyDetails(
    selectedAgencies: { key: number; text: string }[],
    RecruitmentId: number
  ): Promise<ApiResponse<any>>;
  HRMSCandidateScoreCard(
    filterParam: any,
    filterConditions: any,
    candidateID: number
  ): Promise<ApiResponse<any | null>>;
  GetDataInList(
    ListName: string,
    filterParam: any[],
    filterConditions: any,
    Select: string,
    Expand: string,
  ): Promise<ApiResponse<any | null>>;
  GetFilterInCategory(filterConditions: any): Promise<ApiResponse<any[]>>;
  UploadAdvertisementInPortal(
    Filter: any[],
    Condition: string,
    RecuritmentDetails: any,
    AdvertisementValue: any,
    MasterData: any,
    IsActive: number,
    IsExtened: number,
  ): Promise<ApiResponse<null>>;
  GetInterviewPanelDetails(
    filterParam: any[],
    filterConditions: any,
    AssignHR: AutoCompleteItem,
    CandidateID: number,
    levels: string[],
    StatusID: number,
  ): Promise<ApiResponse<InterviewPanelMember | null>>;
  GetcountInEvalution(
    CurrentUser: string,
  ): Promise<ApiResponse<any>>;
  GetADGroupUsers(
    ADGroupID: string,
    Role: string
  ): Promise<ApiResponse<{ Key: string; Value: string }>>;
  GetInterviewPanelTooltiData(
    data: DataSyncToRecruitmentResponse,
  ): Promise<ApiResponse<tooltipInterviewPanel[] | null>>;
  GetEvalutionActionData(filterConditions: any): Promise<ApiResponse<any[]>>;
  GetJobUniqueDataValue(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<GetJobUniqueKey[]>>;
  GetPositionIDData(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any[]>>;
};
