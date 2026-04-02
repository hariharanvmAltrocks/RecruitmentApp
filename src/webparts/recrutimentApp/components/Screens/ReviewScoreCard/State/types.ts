// State/types.ts
// All shared types for the ReviewScoreCard feature

export interface ScorecardCandidateRow {
  id:             number;
  recruitmentID:  number;
  jobCode:        string;
  jobCodeID:      number;
  fullName:       string;
  nationality:    string;
  gender:         string;
  status:         string;
  statusId:       number;
  interviewDate:  string;
  interviewLevel: string;
  grade:          string;
  department:     string;
  gpa:            string;
  positionTitle?: string;
  disability?:    string;
  jobTitle?:      string;
}

export interface RawScorecard {
  InterviewPanelID:                 number;
  RelevantQualification:            string;
  ReleventExperience:               string;
  Knowledge:                        string;
  EnergyLevel:                      string;
  MeetJobRequirement:               string;
  ContributeTowardsCultureRequried: string;
  Experience:                       string;
  OtherCriteriaScore:               string;
  ConsiderForEmployment:            string;
  OverAllEvaluationFeedback:        string;
  QuestionJson:                     Record<string, number>[] | string;
  InterviewPersonName:              string;
  CreatedDate:                      string;
}

export interface CommentEntry {
  Id:                         number | null;
  Name:                       string;
  JobTitleInEnglish:          string;
  JobTitleInFrench:           string;
  Department:                 string;
  Date:                       any;
  RoleName:                   string;
  comments:                   string;
  OverAllEvaluationFeedback?: string;
  Level?:                     string;
}

export interface PositionOption {
  key:  number;
  text: string;
}

export type HODDecision = "Yes" | "No" | "On Hold" | "";

export interface CandidateReviewData {
  candidateData: any;
  panelMembers:  string[];
  questions:     any[];
  reviewerName:  string;
  jobTitleEn:    string;
  jobTitleFr:    string;
  level2Scorecard?: any;
}

export interface SubmitParams {
  candidateId:      number;
  hodDecision:      HODDecision;
  comments:         string;
  currentUserEmail: string;
  currentRoleId:    number;
  gpa:              string;
  positionId:       number | null;
  isLevel2:         boolean;
  jobCodeID:        number;
  recruitmentID:    number;
  statusId:         number;
}

export type ErrorsType = {
  decision: boolean;
  comment:  boolean;
  checkbox: boolean;
  position: boolean;
};