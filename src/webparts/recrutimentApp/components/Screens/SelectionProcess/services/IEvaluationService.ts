export interface EvaluationCandidate {
  id: number;
  applicantName: string;
  positionTitle: string;
  interviewDate: string;
  interviewDateTime: string;
  interviewLevel: string;
  grade: string;
  gradeLabel: string;
  attachments: number;
  status: string;
  statusId: number | string;
  recruitmentID: number;
  jobCodeID: number;
}

export interface ScoreSheetResult {
  canProceed: boolean;
  level?: string;
}

export interface TooltipEntry {
  Key: string;
  Value: string;
}