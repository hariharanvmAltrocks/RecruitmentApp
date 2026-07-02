// config/EvaluationConfig.ts
// Original file — untouched + HOD scorecard constants appended at bottom

// ── Original constants ────────────────────────────────────────

export const EvalListNames = {
  HRMSInterviewPanelDetails:    "HRMSInterviewPanelDetails",
  HRMSCandidatePersonalDetails: "HRMSRecruitmentCandidatePersonalDetails",
  HRMSRecruitmentDptDetails:    "HRMSRecruitmentDptDetails",
  HRMSGradeMaster:              "HRMSGradeMaster",
  HRMSCandidateScoreCard:       "HRMSCandidateScoreCard",
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
  RecruitmentHRLead: 1,
  RecruitmentHR:     2,
  HOD:               3,
  LineManager:       4,
  InterviewPanel:    5,
} as const;

export const EvalNavigationPaths = {
  HODLevel1:     "/RecurimentProcess/InterviewPanelList/InterviewPanelEdit",
  PanelLevel1:   "InterviewPanelList/InterviewPanelEdit",
  DefaultLevel1: "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit",
  HODLevel2:     "/RecurimentProcess/HodViewScorecard",
  PanelLevel2:   "/InterviewPanelList/HodViewScorecard",
  DefaultLevel2: "/ReviewProfileList/HodViewScorecard",
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
  SkeletonRowCount:           5,
  DefaultSortKey:             "applicantName" as const,
  DefaultSortDir:             "asc" as const,
  InterviewDateDisplayFormat: "DD-MMM-YYYY hh:mm A",
  InterviewDateParseFormat:   "YYYY-MM-DD HH:mm",
  CompareDateFormat:          "YYYY-MM-DD",
  ScoreSheetUploadedValue:    "Yes",
  ItemCreatedNo:              "No",
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

// ─────────────────────────────────────────────────────────────
// HOD SCORECARD — added for ReviewScorecardTab
// ─────────────────────────────────────────────────────────────

// All statusId values that appear in the HOD scorecard candidate list.
// Mirrors the filter used in old CandidateList.tsx
export const HOD_SCORECARD_STATUSES: number[] = [
  121,  // PendingwithHODtoselectthecandidate
  122,  // Selected
  123,  // OnHoldbyHOD
  15,   // RejectedbyHOD
  127,  // PendingwithHODtoselectthecandidateLevel2
  130,  // PendingwithHODtoAssignPositionID
  165,  // CandidateOnHoldbyHODLevel1
  166,  // CandidateOnHoldbyHODLevel2
  167,  // CandidateRejectedbyHODLevel1
  168,  // CandidateRejectedbyHODLevel2
];
// export const StatusId = {
//   PendingwithHRLeadtoAssignRecruitmentHR: 68,
//   PendingwithRecruitmentHRtouploadAdv: 2,
//   PendingwithHODtoreviewAdv: 26,
//   PendingwithHRLeadtouploadONEMsigneddoc: 118,
//   PendingwithRecruitmentHRtoAssignExternalAgency: 119,
//   RecruitmentInProgress: 28,
//   PendingwithHODtoselectthecandidate: 121,
//   Selected: 122,
//   PendingInterviewQuestionwithLineManagerandHR: 39,
//   InterviewScheduled: 40,
//   Completed: 13,
//   ReadyforRecruitmentProcess: 155,
//   PendingwithHRandLMtocreateinterviewQuestion: 124,
//   PendingwithLineManagereviewAdv: 125,
//   PendingwithLMcreateDisqualificationQuestion: 126,
//   OnHoldbyHOD: 123,
//   RejectedbyHOD: 15,
//   PendingwithHODtoselectthecandidateLevel2: 127,
//   PendingwithRecruitmentHRtoassignLevel2InterviewPanel: 128,
//   InterviewScheduledforLevel2: 129,
//   PendingwithHODtoAssignPositionID: 130,
//   Rescheduled: 159,

//   // BackGorund Verification
//   PendingHRBGVInitiation: 134,
//   PendingBGdocuploadedbycandidate: 163,
//   PendingHRReviewBGCheck: 135,
//   PendingDOTAficaVerification: 172,
//   //Medical Screening
//   PendingwithTAforMedicalScreening: 144,
//   // Post Recruitment
//   PendingHROfferInitiate: 132,
//   // KCSA
//   PendingCandidateOfferLetterUpload: 133,
//   PendingHRReviewOfferWorkPermitInit: 136,
//   PendingCandidateWorkPermitreleatedDoc: 164,
//   PendingHRReviewWorkpermitDocs: 137,
//   WorkPermitAcknowledgedContractUploaded: 138,
//   PendingCandidateEmploymentContractUpload: 161,
//   PendingHREmploymentContractVerification: 142,
//   PendingHRpreonboardingchecklist: 162,
//   //Labor Hire
//   PendingLabourHireOfferRelease: 170,
//   PendingHROfferReview: 171,//184,//171,
//   PendingLabourhireWPPayment: 173,
//   PendingFinancePaymentReview: 174,
//   PendingLHWorkPermitProcess: 175,
//   PendingHRReviewOfferuploadEmploymentInit: 176,
//   PendingHREmploymentContractInit: 177,
//   PendingLHECRelease: 178,
//   PendingHREmploymentContractReview: 179,

//   RESIProcessInitiatedforDRC: 42,
//   RESIProcessInitiatedforExpatriate: 75,

//   PendingHRReviewOfferanduploadEmployementContract: 169,//183,//169

//   // PendingHRReviewOfferWorkPermit: 136,
//   // WorkPermitHRReview: 137,
//   // WorkPermitAcknowledgedContractUploaded: 138,
//   // HRReviewContractSigned: 161,
//   // PendingHRPreOnboardingChecklist: 162,
//   // PendingWorkPermituploadedbycandidate: 164,

//   // PendingwithRecruitmentHRtoUploadtheOfferLetter: 132,
//   // PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter: 142,
//   // PendingwithCandidatetoSignOfferLetter: 133,
//   // PendingwithRecruitmentHRtoReviewtheSignedOfferLetterandInitiateforOtherDocuments: 134,
//   // PendingwithCandidatetoUploadOtherDocuments: 135,
//   // PendingwithRecruitmentHRtoReviewtheCandidatePersonalDocs: 136,
//   // PendingwithRecruitmentHRtoUploadtheEmploymentContract: 137,
//   // PendingwithCandidatetoSignEmploymentContract: 138,
//   // pendingwithRecruitmentHRtoReviewtheEmploymentContractForm: 139,
//   OnboardingProcessinitiatedforDRC: 23,
//   OnboardingProcessinitiatedforExpat: 24,

//   //Revert Post Recrutiment
//   RevertedBacktoCandidateforReuploadOfferLetter: 149,
//   RevertedBacktoCandidateforReuploadDocs: 150,
//   RevertedBacktoCandidateforReuploadEmploymentContract: 151,

//   Pending: 89,
//   PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract: 152,

//   CandidateOnHoldbyHODLevel1: 165,
//   CandidateOnHoldbyHODLevel2: 166,//182,//166,
//   CandidateRejectedbyHODLevel1: 167,
//   CandidateRejectedbyHODLevel2: 168,

//   BackgroundCheckVerificationFailed: 180,
//   RESProcessInitiated: 143,
//   FailedmedicalscreeningUnfit: 156
// };

// Score criteria definitions — used by transformScoreData in both
// the old HodViewScorecard and new ScorecardDetail component
export const HOD_SCORE_CRITERIA = [
  { field: "RelevantQualification",            label: "Qualification (Relevant)" },
  { field: "ReleventExperience",               label: "Experience (Relevant)" },
  { field: "Knowledge",                        label: "Knowledge" },
  { field: "EnergyLevel",                      label: "Energy Level" },
  { field: "MeetJobRequirement",               label: "Meets All Job Requirements" },
  { field: "ContributeTowardsCultureRequried", label: "Will Contribute to the Culture Required" },
  { field: "Experience",                       label: "Experience" },
  { field: "OtherCriteriaScore",               label: "Other Criteria Recognized by Panel" },
  { field: "ConsiderForEmployment",            label: "To Consider for Employment (Yes/No)" },
] as const;

// Success messages — mirrors old RecuritmentHRMsg from Config.ts
export const HODMessages = {
  ScoreCardMsgLevel2:        "The candidate has successfully completed the Level 2 interview.",
  CandidateSelected:         "Candidate Selected and send for background verification.",
  CandidateSelectedLevel2:   "Candidate Level 1 Selected Successfully",
  CandidateRejected:         "Candidate Rejected.",
  CandidateRejectedLevel2:   "Candidate Level 1 Rejected Successfully",
  CandidateOnHold:           "Candidate On Hold.",
  CandidateonholdLevel2:     "Candidate Level 1 On-Hold Successfully",
} as const;

export const WorkflowAction = {
  Approved: 1,
  Reject: 2,
  Revert: 3,
  Transfer: 4,
  Submitted: 5,
  Closed: 6,
  ReSubmitted: 7,
  OnHold: 10,
  Decline: 12
};