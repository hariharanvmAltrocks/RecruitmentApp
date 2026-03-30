// services/IEvaluationService.ts
// Original interfaces — untouched + HOD scorecard types appended at bottom

// ── Original interfaces ───────────────────────────────────────

export interface EvaluationCandidate {
  id:              number;
  applicantName:   string;
  positionTitle:   string;
  interviewDate:   string;
  interviewDateTime: string;
  interviewLevel:  string;
  grade:           string;
  gradeLabel:      string;
  attachments:     number;
  status:          string;
  statusId:        number | string;
  recruitmentID:   number;
  jobCodeID:       number;
}

export interface ScoreSheetResult {
  canProceed: boolean;
  level?: string;
}

export interface TooltipEntry {
  Key:   string;
  Value: string;
}

// ─────────────────────────────────────────────────────────────
// HOD SCORECARD TYPES — added for ReviewScorecardTab
// ─────────────────────────────────────────────────────────────

// Raw scorecard submitted by one panel member (from HRMSCandidateScoreCard)
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
  QuestionJson:                     Record<string, number>[];
  InterviewPersonName:              string;
  CreatedDate:                      string;
}

// One row in the score table (one criterion, N interviewers + total)
export interface ScoreRow {
  criteria: string;
  total:    number | string;
  [key: string]: any; // interviewer_1, interviewer_2 …
}

// Comment entry from HRMSRecruitmentCandidateComments or HRMSCandidateLevel2ScoreCard
export interface CommentEntry {
  Id:                       number | null;
  Name:                     string;
  JobTitleInEnglish:        string;
  JobTitleInFrench:         string;
  Department:               string;
  Date:                     any;
  RoleName:                 string;
  comments:                 string;
  OverAllEvaluationFeedback?: string;
  Level?:                   string;  // "Level 1" | "Level 2" — used by comment view
}

// Position ID option for the HOD "Assign Position ID" dropdown
export interface PositionOption {
  key:  number;
  text: string;
}

// HOD radio decision value
export type HODDecision = "Yes" | "No" | "On Hold" | "";

// Job row on the scorecard list screen (Level 1 — list of jobs pending HOD review)
export interface ScorecardJobRow {
  id:            string;
  recruitmentID: number;
  jobCode:       string;
  jobCodeID:     number;
  jobTitle:      string;
  department:    string;
  nationality:   string;
  statusId:      number;
  status:        string;
  grade:         string;
  noOfPositions: number;
  businessUnitCode?: string;
  positionRequest?: string;
}

// Candidate row on the scorecard list screen (Level 2 — candidates inside a job)
export interface ScorecardCandidateRow {
  disability: any;
  jobTitle: string;
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
}