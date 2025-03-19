import { InterviewPanaldata } from "../../Models/Screens";
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

export type IInterviewProcessService = {
  GetInterviewPanelDetails(
    filterConditions: any[]
  ): Promise<ApiResponse<InterviewPanaldata[]>>;
  HRMSCandidateScoreCard(
    filterParam: any,
    filterConditions: any,
    candidateID: number
  ): Promise<ApiResponse<any | null>>;

  GetCombinedCandidatePositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<any | null>;
  GetCandidateDetailsInterviewPanalDashboard(
    filterParam: any,
    filterConditions: any
  ): Promise<any | null>;

  CandidateSeletionApi(
    obj: ActionUpdate,
    ListName: string
  ): Promise<ApiResponse<null>>;
  AssignPositionID(
    obj: AssignPositionID,
    ListName: string
  ): Promise<ApiResponse<null>>;

  GetPositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<any | null>;
};
