import { AutoCompleteItem, InterviewPanaldata } from "../../Models/Screens";
import { CommentsData } from "../RecruitmentProcess/IRecruitmentProcessService";

export interface CommentsDatas {
  Id: string;
  JobTitleInEnglish: string;
  JobTitleInFrench: string;
  comments: string;
  Department: string;
  Date: Date | null;
  JobTitle: string;
  Name: string;
  ID: number;
  RecruitmentID: number;
  InterviewLevel: string;
  InterviewPanelTitle: string[];
  CandidateID: number;
  CandidateScoreCard: Array<any>;
  Role: string;
}

export interface ActionUpdate {
  ActionId: number;
  Id: number;
  ItemCreated?: string;
  ScoreCardLevelItemCreated?: string;
  GPA: string;
}

export type AssignPositionID = {
  PositionIDId: number;
  CandidateIDId: number;
  RecruitmentIDId: number;
  Coomments?: string;
  ItemCreated: string;
  ActionId: number;
  StatusId: number;
};
export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

export type Question = {
  question: string;
  score: number;
  comment?: string;
};

export type ScoreCard = {
  InterviewPanelID: number;
  RelevantQualification: string;
  ReleventExperience: string;
  Knowledge: string;
  EnergyLevel: string;
  MeetJobRequirement: string;
  ContributeTowardsCultureRequried: string;
  Experience: string;
  OtherCriteriaScore: string;
  ConsiderForEmployment: string;
  Feedback: string;
  RecruitmentID: number;
  Role: string;
  InterviewPersonName: string;
  OverAllEvaluationFeedback: string;
  CreatedDate: string;
  QuestionJson: Question[];
  RelatedScores?: {
    QuestionJson: string;
  }[];
  Author?: {
    Title: string;
    EMail: string;
  };
}

export type Employee = {
  JobTitleInEnglish: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Email: string;
  Department: string;
  JobTitle: string;
  JobTitleInFrench: string;
};

export type InterviewPanelItem = {
  ID: number;
  RecruitmentID: number;
  InterviewLevel: string;
  InterviewPanelTitle: string[];
  CandidateID: number;
  ScoreCard: ScoreCard | null;
  SumOverallScores: number;
  SumQuestionScores: number;
  MaxOverallScore: number;
  MaxQuestionScore: number;
  GPA: number;
  TotalScore: number;
  QuestionScore: number;
  RelevantQualification: string;
  ReleventExperience: string;
  Knowledge: string;
  EnergyLevel: string;
  MeetJobRequirement: string;
  ContributeTowardsCultureRequried: string;
  Experience: string;
  OtherCriteriaScore: string;
};


export type CandidateDetails = {
  Position: any;
  ID: number;
  BusinessUnitCode: string;
  DateRequried: string;
  AreaofWork: string;
  PositionID: string;
  Status: string;
  FirstName: string;
  LastName: string;
  MiddleName: string;
  ExpatriatePosition: string;
  Location: string;
  LineManager: string;
  LineManagerEmail: string;
  PassportNumber: string;
  RecuritmentHR: string;
  LineManagerAction: string;
  JobCode: string;
  AssignBy: string;
  AssignByEmail: string;
  CandidateID: number;
  RecruitmentID: number;
};
export type PostCommentsData = {
  Id: number;
  Comments?: string;
};

export type InterviewPanelDetails = {
  ID?: number;
  CandidateIDId?: number;
  Level: string;
  RoleId: number;
  Comments: string;
};
export interface CandidateLevel2ScoreCard {
  ID: number;
  CandidateID: number;
  CandidateName: string;
  RoleId: number;
  RoleTitle: string;
  Comments: string;
  Level: string;
}
export interface CandidateComment {
  ID: number;
  CandidateID: number;
  CandidateName: string;
  RoleId: number;
  RoleTitle: string;
  Comments: string;
  Level: string;
}

export type IInterviewProcessService = {
  GetInterviewPanelDetails(
    filterConditions: any[]
  ): Promise<ApiResponse<InterviewPanaldata[]>>;
  GetCandidateDetailsInterviewPanalDashboard(
    filterParam: any,
    filterConditions: any
  ): Promise<any | null>;
  GetCombinedCandidatePositionDetails(
    filterParam: any,
    filterConditions: any,
    EmployeeList: any[]
  ): Promise<any | null>;
  getInterviewPanelDetails(
    filterParam: any,
    filterConditions: any,
    candidateID: number,
    EmployeeList: any[]
  ): Promise<ApiResponse<any[]>>;
  getCandidateScoreCard(candidateID: number): Promise<ApiResponse<any[]>>;
  CandidateSeletionApi(
    obj: ActionUpdate,
    ListName: string
  ): Promise<ApiResponse<null>>;
  AssignPositionID(
    obj: AssignPositionID,
    ListName: string
  ): Promise<ApiResponse<null>>;
  GetHRMSPositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<AutoCompleteItem[]>>;

  GetSelectedCandidateDetailsByHOD(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<CandidateDetails[]>>;
  CandidateSeletionApiData(
    obj: PostCommentsData,
    ListName: string
  ): Promise<ApiResponse<null>>;

  SubmitCandidateCommentsApi(
    obj: InterviewPanelDetails,
    ListName: string
  ): Promise<ApiResponse<null>>;
  getCandidateLevel2ScoreCard(
    filterConditions: any
  ): Promise<ApiResponse<InterviewPanelDetails[]>>
  getCandidateLevel1ScoreCard(
    filterConditions: any,
  ): Promise<ApiResponse<CandidateComment[]>>

  getCandidateLevel2ScoreCardData(
    filterParam: any,
    filterConditions: any,
    candidateID: number,
    EmployeeList: any[]
  ): Promise<ApiResponse<CommentsData[]>>;
  GetPanelLeveldata(
    filterConditions: any[],
    EmployeeList: any[]
  ): Promise<ApiResponse<Record<string, string[]>>>
};
