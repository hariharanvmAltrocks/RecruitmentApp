import {
  CandidateListItem,
  CommentEntry,
  ReviewScoreCardResult,
} from "../../components/Screens/ReviewScoreCard/ReviewScoreCardServies/ReviewScoreCardServices";

export interface CommentsLevel2 {
  Comments: string;
  CandidateIDId: number;
  RoleId: number;
  level: string;
}

export interface SubmitEvaluationL2Payload {
  candidateId: number;
  panelId: number;
  comments: CommentsLevel2;
}

export interface SubmitEvaluationL2Result {
  success: boolean;
  hodWorkflowTriggered: boolean;
}

export type IEvalutionL2 = {
  getCandidatesByRecruitmentId(
    candidateID: number,
    recruitmentID: number,
  ): Promise<CandidateListItem[]>;
  getReviewScoreCardData(
    candidateId: number,
    currentUserEmail: string,
    candidate?: any,
  ): Promise<ReviewScoreCardResult>;
  _getCandidateScorecard(candidateId: number): Promise<any[] | null>;
  _getLevel2Scorecard(candidateId: number): Promise<any>;
  fetchComments(
    candidateId: number,
  ): Promise<{ level1: CommentEntry[]; level2: CommentEntry[] }>;
  submitEvaluationL2(
    payload: SubmitEvaluationL2Payload,
  ): Promise<SubmitEvaluationL2Result>;
};
