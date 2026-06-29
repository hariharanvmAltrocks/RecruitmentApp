
export interface ScorecardJobRow {
  id: string;
  recruitmentID: number;
  jobCode: string;
  jobCodeID: number;
  jobTitle: string;
  department: string;
  nationality: string;
  statusId: number;
  status: string;
  grade: string;
  noOfPositions: number;
  businessUnitCode?: string;
  positionRequest?: string;
}

export interface ScorecardCandidateRow {
  id: number;
  recruitmentID: number;
  jobCode: string;
  jobCodeID: number;
  fullName: string;
  nationality: string;
  gender: string;
  status: string;
  statusId: number;
  interviewDate: string;
  interviewLevel: string;
  grade: string;
  department: string;
  gpa: string;
  positionTitle?: string;
  disability?: string;
  jobTitle?: string;
}

export interface RawScorecard {
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
  OverAllEvaluationFeedback: string;
  QuestionJson: Record<string, number>[];
  InterviewPersonName: string;
  CreatedDate: string;
}

export interface CommentEntry {
  Id: number | null;
  Name: string;
  JobTitleInEnglish: string;
  JobTitleInFrench: string;
  Department: string;
  Date: any;
  RoleName: string;
  comments: string;
  OverAllEvaluationFeedback?: string;
  Level?: string;
}

export interface PositionOption {
  key: number;
  text: string;
}

export type HODDecision = "Yes" | "No" | "On Hold" | "";

export interface CandidateReviewData {
  candidateData: any;
  panelMembers: string[];
  questions: any[];
  reviewerName: string;
  jobTitleEn: string;
  jobTitleFr: string;
}

export interface SubmitParams {
  candidateId: number;
  hodDecision: HODDecision;
  comments: string;
  currentUserEmail: string;
  currentRoleId: number;
  gpa: string;
  positionId: number | null;
  isLevel2: boolean;
  jobCodeID: number;
  recruitmentID: number;
  statusId: number;
}