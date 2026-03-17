
export const EvalListNames = {
  HRMSInterviewPanelDetails:       "HRMSInterviewPanelDetails",
  HRMSCandidatePersonalDetails:    "HRMSRecruitmentCandidatePersonalDetails",
  HRMSRecruitmentDptDetails:       "HRMSRecruitmentDptDetails",
  HRMSGradeMaster:                 "HRMSGradeMaster",
  HRMSCandidateScoreCard:          "HRMSCandidateScoreCard",
} as const;

export const EvalStatusId = {
  InterviewScheduled:          40,   
  InterviewScheduledforLevel2: 129,  
} as const;

export const InterviewLevels = {
  Level1:  "Level 1",
  Level2:  "Level 2",
  Level3:  "Level 3",
  Levels2: "Level 1 & 2",
} as const;

export const EvalRoleID = {
  RecruitmentHRLead:  1,
  RecruitmentHR:      2,
  HOD:                3,
  LineManager:        4,
  InterviewPanel:     5,
} as const;

export const EvalNavigationPaths = {
  HODLevel1:      "/RecurimentProcess/InterviewPanelList/InterviewPanelEdit",
  PanelLevel1:    "InterviewPanelList/InterviewPanelEdit",
  DefaultLevel1:  "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit",
  HODLevel2:      "/RecurimentProcess/HodViewScorecard",
  PanelLevel2:    "/InterviewPanelList/HodViewScorecard",
  DefaultLevel2:  "/ReviewProfileList/HodViewScorecard",
} as const;

export const EvalAlertOptions = {
  Error:   "Error",
  Success: "Success",
} as const;

export const EvalMessages = {
  InterviewScoredAlready:        "The scorecard for the candidate has already been submitted.",
  InterviewScoreCommentsAlready: "The scorecard for the candidate comments has already been submitted.",
} as const;

export const EvalUIConfig = {
  SkeletonRowCount:             5,
  DefaultSortKey:               "applicantName" as const,
  DefaultSortDir:               "asc" as const,
  InterviewDateDisplayFormat:   "DD-MMM-YYYY hh:mm A",
  InterviewDateParseFormat:     "YYYY-MM-DD HH:mm",
  CompareDateFormat:            "YYYY-MM-DD",
  ScoreSheetUploadedValue:      "Yes",
  ItemCreatedNo:                "No",
} as const;

export const EvalQueryConfig = {
  InterviewPanel: {
    Select: "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail, IsScoreSheetUploaded",
    Expand: "InterviewPanel,RecruitmentID,CandidateID",
  },
  CandidateDetails: {
    Select: "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
    Expand: "JobCode,AssignByInterviewPanel,RecruitmentID,Status",
  },
} as const;