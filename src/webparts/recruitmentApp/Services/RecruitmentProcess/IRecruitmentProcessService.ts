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
  Date: Date | null;
  JobTitle: string;
  RoleName: string;
};

export type InsertComments = {
  RoleId: number | null;
  RecruitmentIDId: string;
  Comments: string;
};

export type IRecruitmentService = {
  GetVacancyDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>>;
  InsertRecruitmentDpt(
    Tabl1: any,
    Table2: any
  ): Promise<ApiResponse<any | null>>;
  GetPositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>>;
  GetRecruitmentDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>>;
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
  InsertExternalAgencyDetails(
    selectedAgencies: { key: number; text: string }[],
    RecruitmentId: number
  ): Promise<ApiResponse<any>>;
};
