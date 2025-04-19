import { AutoCompleteItem, InterviewPanaldata } from "../../Models/Screens";

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

export type ActionUpdate = {
  ActionId: number;
  Id: number;
  ItemCreated: string;
};

export type AssignPositionID = {
  PositionIDId: number;
  CandidateIDId: number;
  RecruitmentIDId: number;
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
};

export type Employee = {
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

  PanelFullName: string;
  Department: string;
  JobTitleInEnglish: string;
  JobTitleInFrench: string;
  PanelEmail: string;
};

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
};
