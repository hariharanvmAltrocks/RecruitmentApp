import { InterviewPanaldata } from "../../Models/Screens";

// export type CommentsDatas = {
//   Id: number | null;
//   Name: string;
//   JobTitleInEnglish: string;
//   JobTitleInFrench: string;
//   comments: string;
//   Department: string;
//   Date: Date | null;
//   JobTitle: string;
//   Role: any;
// };
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

export type IInterviewProcessService = {
  GetInterviewPanelDetails(
    filterConditions: any[]
  ): Promise<ApiResponse<InterviewPanaldata[]>>;
  HRMSCandidateScoreCard(
    filterParam: any,
    filterConditions: any,
    candidateID: number
  ): Promise<ApiResponse<any | null>>;

  GetMergedData(
    EmployeeList: any[],
    Conditions: string,
    filterConditions: any,
    filterParam: any,
    candidateID: number
  ): Promise<ApiResponse<any>>;
  GetInterviewPanelCandidateDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<any | null>;
  GetPositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<any | null>;

  GetCombinedCandidatePositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<any | null>;
};
