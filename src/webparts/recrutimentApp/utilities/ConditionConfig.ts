export const MatricID = {
  AssignHr: 1,
  UploadONEM: 2,
  JobAdvert: 3,
  ReviewProfileHR: 4,
  AssignInterviewPanel: 5,
  InterviewQuestionHR: 6,
  EvalutionHR: 7,
  EvalutionHOD: 18,
  EvalutionLM: 19,
  EvalutionEXCO: 20,
  ReviewScoreCard: 8,
  OfferRelease: 9,
  OfferAccepted: 10,
  OfferRejected: 11,
  Onbording: 12,
  interviewSchedule: 13,
  interviewTracker: 14,
  AdvertReviewLM: 15,
  AdvertReviewHOD: 16,
  InterviewQuestionLM: 17,
  ReviewProfileLM: 21,
  MySubmission: 22,
  AssignAgencies: 23,

  BackgroundCheck: 24,
  LabourHire: 25,
  Kcsa: 26, 

  ReviewScoredHOD: 27
};

export const RoleName = {
  LineManager: "Line Manager",
  RecruitmentHR: "RecruitmentHR",
  HOD: "HOD",
  EXCO: "EXCO",
  InterviewPanel: "InterviewPanel",
};

export const CategoryID = {
  Department: 1,
  Function: 2,
  Level: 3,
  RoleSpecificKnowledge: 4,
  TechnicalSkills: 5,
  Qualification: 6,
  Nationality: 7,
  Experience: 8,
  WorkflowStatus: 9,
  ApplicationStatus: 10,
  LanguageProficiency: 11,
  EducationLevels: 12,
  QuestionScopes: 13,
  QuestionCategory: 14,
  QuestionType: 15,
  Empty: 16,
  IvanhoeZijinExperience: 17,
  ReferralSource: 18,
  RaceEthicity: 19,
  CitizenshipStatus: 20,
  GenderIndentity: 21,
  Disciplines: 22,
  ProofofIdentity: 23,
  TitleforProfile: 24,
  DocumentType: 26,
  VerificationType: 41,
};

export const agentCode = {
  RecruitmentHR: "HRMS001",
};

export const quesContentId = {
  WillingRelocate: "FD889B9C1B51F13738596ACFB206E881EAC9",
};

export const DataType = {
  New: "New",
  Existing: "Existing",
};

export const ListEmailName = {
  HR: "AssignedHR",
  LM: "LineManager",
  HOD: "HOD",
  HRLead: "RecruitmentHRLead",
};

export const menuID = {
  Dashboard: 1,
  SelectionProcess: 27,
  PreSelectionProcess: 30,
  PostSelectionProcess: 31,
  ReviewProfile: 32,
  RecruitmentProcess: 28,
};

export const Nationality = {
  Nationals: "Nationals (Congolese)",
  Expatriate: "Expatriate",
};

export const NationalityCode = {
  Nationals: "N0",
  SouthAfrica: "N154",
};

export const TabNames = {
  ReviewProfile: "Review Profile",
  AssignInterviewPanel: "Assign Interview Panel",
  ReviewScorecard: "Review Score card",
  MySubmission: "My Submission",
  AssignAgencies: "Assign Agencies",
};

export const InterviewLevel = {
  Level1: "Level 1",
  Level2: "Level 2",
  Level3: "Level 3",
};

export const QuestionCreatedBy = {
  LM: "LM",
  HR: "HR",
};

export const InterviewLevels = {
  Level1: "Level 1",
  Level2: "Level 2",
  Level3: "Level 3",
  Levels2: "Level 1 & 2",
};

export const ActionID = {
  Review: 1,
  View: 2,
  Approve: 3,
  onHold: 4,
  schedule: 5,
};

export const EmailTemplateCodes = {
  LineManagerEmail: "CANDIDATE_PROFILE_SHORTLISTED",
  CandidateRejected: "INTERVIEW_REJECTED",
  InterviewSchedule: "INTERVIEW_PROCESS",
  HODSelection: "INTERVIEW_SELECTED",
  HODSelectionLevel1: "HOD1_SelectCandidate",
  InterviewScheduleLevel1: "RecuritmentHR_ScheduleInterview_Level1",
};

export const RecuritmentHRMsg = {
  HRSuccess: "Recruitment HR Assigned for the Selected Job Titles.",
  SingleHRSuccessMsg: "Recruitment HR Assigned for the Selected Job Title.",

  ONEMDocumentMsg: "Signed and Stamped ONEM Document Uploaded Successfully.",

  AdvertisementSubmitMsg: "Advertisement Document Uploaded Successfully.",
  AdvertisementReveiwMsg: "Advertisement Reviewed Successfully.",

  AgencySucess: "Agencies Assigned for the Selected Job Titles.",
  SingleAgencyMsg: "Agencies Assigned for the Selected Job Title.",

  InterviewPanalAssignedSuccessfully: "Interview Panel Assigned Successfully.",
  InterviewPanalLevel1:
    "Interview Panel members for Level 1 have been Assigned Successfully.",
  InterviewPanalLevel2:
    "Interview Panel members for Level 2 have been Assigned Successfully.",

  RescheduleSuccessMsg: "Interview Rescheduled Successfully.",
  AdvertExtendsionSuccessMsg: "Advertisement Extension Submitted Successfully.",
  ConfirmMsg: "Are you sure you want to extension the advetisement",

  ScoreCardSubmitMsg:
    "The Candidate has been Interviewed and Scorecard Submitted for successfully ",
  ScoreCardMsgLevel2:
    "The candidate has successfully completed the Level 2 interview.",

  InterviewQuestionSuccessMsg:
    "Interview Panel  questionnaires has been created successfully.",
  CareerportalSuccessMsg:
    "Career Portal questionnaires has been created successfully.",

  ProfileReviewed:
    "Candidate Profile for the Job Title Reviewed and Shortlisted.",
  ProfileReviewedNo:
    "Candidate Profile for the Job Title Reviewed and Rejected.",
  ProfileReviewedWaitingList:
    "Candidate Profile for the Job Title Reviewed and On - Hold.",
  HRReviewCandidate: "Candidate Profile Reviewed Successfully.",

  CandidateSelected: "Candidate Selected and send for background verification.",
  CandidateSelectedLevel2: "Candidate Level 1 Selected Successfully",
  CandidateRejected: "Candidate Rejected.",
  CandidateOnHold: "Candidate On Hold.",
  CandidateRejectedLevel2: "Candidate Level 1 Rejected Successfully",
  CandidateonholdLevel2: "Candidate Level 1 On-Hold Successfully",
  RecuritmentSubmitMsg: "Submitted Successfully.",

  ApprovedMsg:
    "Advertisement Reviewed Successfully. Ready for ONEM Process (Offline).",
  RecuritmentHRMsgCancel:
    "Are you sure want to cancel? Any unsaved changes will be lost.",
  BackMsg: "Are you sure want go back to Home Page ?",
  ValidationErrorMsg:
    "One or more mandatory field are missing.Please do the needful and submit again.",
  RecruitmentErrorMsg: "Please choose the Job Code to assign Recruitment HR.",
  AgenciesErrorMsg: "Please choose the Job Code to Assign Agencies.",
  PositionIDassigned: "Selected candidate has been rejected successfully.",
  InterviewScoredAlready:
    "The scorecard for the candidate has already been submitted.",
  InterviewScoreCommentsAlready:
    "The scorecard for the candidate comments has already been submitted.",
  APIErrorMsg: "Server is temporarily unavailable. Please try again later.",
  InterviewQues:
    "Are you sure you want to change the option? Changing this will clear your current question, and you will need to start a new one",
  AddedMsg: "Added Successfully",
  deleteMsg: "Are you sure you want to delete this Question?",

  SelectedErrorMsg: "Please Choose the Disciplines.",
  WarningMsg:
    "Are you sure want to Change the Disciplines? Any unsaved changes will be lost",
  ClearWarning: "Are you sure you want to close? Unsaved changes will be lost.",
  SelectedCandidateValidation:
    "The requested headcount for the position has already been selected.",
  QuestionAlertMsg:
    "Interview questions are not available. Kindly reschedule the interview date.",

  UploadMsg: "Candidate CV Upload Successfully",
  ValidationMsg: "This Candidate Already Exists",

  BGverificationMsg: "Background Verification has been initiated successfully.",
  BGReviewedMsg: "Background Verification has been completed successfully.",
  BGReviewinitBGV:
    "Verified the background documents and initiated the Dot's Africa verification process.",

  RevertWGDocs: "The Background Document Reverted successfully.",

  OfferLetterMsg: "The offer letter has been uploaded successfully.",
  OfferLetterinit:
    "The Offer Letter process has been successfully initiated to the Labour Hire.",
  ReviewLaborHireOffer:
    "The Labour Hire offer has been reviewed successfully and forwarded to the candidate.",
  ReviewOfferLetterMsg:
    "The offer letter has been reviewed successfully and initiated the WorkPermit Document ",

  RevertedOfferLetter:
    "The offer letter has been reverted to candidate successfully.",
  RevertLabourOffer:
    "The Labour Hire Offer Release has been successfully reverted",

  WorkPermitDocs: "The WorkPermit Documents has been reviewed successfully",
  WPacknowledgeUploadContract:
    "WorkPermit acknowledge and Employee contract Document Upload Successfully",

  RevertWorkPermitDocs:
    "The Work Permit Document has been successfully reverted",

  EmploymentContractMsg:
    "The employment contract has been uploaded successfully.",
  EmployeementInit:
    "The Employment Contract process has been successfully initiated to the Labour Hire",
  ReviewEmploymentContractMsg:
    "The Labour Hire Employment Contract has been reviewed successfully and forwarded to the candidate.",
  ReviewECMsg: "The Employement Contract Reviewed Successfully",
  ReviewOfferLetterInitEC:
    "The offer letter has been reviewed successfully and initiated the Employment Contract ",

  RevertedEmploymentContractMsg:
    "The employment contract has been reverted successfully.",
  RevertECCocs:
    "The Labour Hire Employment Contract has been successfully reverted",

  FinancePaymentReviewMsg:
    "Finance Payment Review has been completed successfully.",
  RevertedFinancePaymentMsg:
    "Payment Review has been reverted to LaborHire successfully..",

  ReviewOtherDocsMsg: "Candidate documents has been reviewed successfully",
  RevertOtherDocsMsg: "Candidate documents have been reverted successfully.",

  OnboardingMsg: "Onboarding has been initiated successfully.",

  NationalityErrorMsg:
    "Please select the Nationality filter before proceeding.",
  QuestionValiErrorMsg: "Please add at least 5 questions before proceeding.",
  COIWarningMsg:
    "This is the COI profile. Are you sure you're ready to proceed?",
  FormValidationMsg: "One or more required actions are missing.",
  NationalityMsgError: "Please select the any one Nationality",

  ChecklistSaveAsDraftMsg: "Your changes are saved as a draft",
  AddLabourHireSuccessMsg: "Labour Hire details added successfully.",
  UpdateLabourHireMsg: "Labour Hire details Updated successfully.",
  AddAgentSuccessMsg: "Agent details added successfully.",
  UpdateagentMsg: "Agent details Updated Successfully.",
  NoOfUserLimitMsg:
    "User limit reached. Kindly upgrade or extend your user limit.",
  ResetPassword: "Are you sure you want to reset the password?",
  ResetPasswordMsg:
    "A password reset link has been sent to your registered email. Please check your inbox to proceed.",

  duplicatedquestionMsg:
    "Duplicate questions are not allowed. Please modify the question and try again.",
  ReinitiateBGVProcess: "The BGV process has been re-initiated successfully.",
  ReinitiateBGVWarningMsg:
    "Are you sure you want to re-initiate the Criminal Check (Fingerprint Search) as part of the BGV process for this candidate?",
};

export const DocumentFolderName = {
  Offerletter: "OfferLetter",
  EmploymentContractForm: "Employment contract",
  UnsignedDoc: "UnSignedDoc",
  SignedDoc: "SignedDoc",
  PersonalDocs: "PersonalDocs",
  Medical: "Medical",
  COIAttach: "COIAttch",
  ConsentForm: "ConsentForm",
  BackgroundVerification: "BackgroundVerification",
  WorkPermit: "Work Permit",
  Vaccination: "Vaccination",
  PaymentBill: "Payment Bill",
  PoliceClearanceCertificate: "Police Clearance Certificate",
  CovidVaccinationCertificate: "Covid Vaccination Certificate",
  YellowFeverVaccinationCertificate: "Yellow Fever Vaccination Certificate",
  CV: "CV",
  BGVConsentform: "BGVConsentForm",
  ProofOfDocument: "ProofOfPaymentDocument",
  BGVProofOfDocument: "BGVProofOfDocument",
};

export const TabName = {
  //HR Lead
  AssignRecuritmentHR: "Assign Recruitment HR",
  UploadONEMDoc: "Upload ONEM Doc",
  MySubmission: "My Submission",
  // Recruitment HR(PreSelection)
  UploadAdvertisement: "Job Advertisement",
  AssignAgencies: "Assign Agencies",
  UploadCV: "Upload CV",
  // Recruitment HR(PostSelection)
  ReviewProfile: "Review Profile",
  AssignInterviewPanel: "Assign Interview Panel",
  InterviewpanelL1: "Interview Panel Level-1",
  InterviewpanelL2: "Interview Panel Level-2",
  InterviewQuestion: "Interview Questions",
  // Candidate Articles
  // UploadDocuments: "Upload Documents",
  // ViewDocuments: "View Documents",
  // CandidateDocuments: "Candidate Documents",
  BackgroundVerification: "Background Verification",
  OfferLetterLabourHire: "Offer Letter - Labour Hire",
  OfferLetterKSCA: "Offer Letter - KCSA",
  // HOD
  ReviewJobAdvertisement: "Review Job Advertistment",
  ReviewScorecard: "Review Score card",
  Evaluation: "Evaluation",
  // line Manager
  // InterviewQuestions: "Interview Questions",

  CandidateDetails: "Applicants Details",
  PositionDetails: "Job Details",
  AdvertisementDetails: "Advertisement Details",
  AdvertisementViewDetails: "View Advertisement ",
  ViewCandidateDetails: "Applicants Details",
  Scorecard: "ScoreCard",
  ViewCandidateList: "Applicants List",
  ViewJustification: "View Comments",
  EvaluationTab: "Candidate Details",
  AdvertExtension: "Advert Extension",
  ReviewLevel1: "Review Profile - Level 1",
  ReviewLevel2: "Review Profile - Level 2",
  Shortlisted: "Shortlisted",
  onHold: "On Hold",
  Rejected: "Rejected",
  OnHoldRejected: "On Hold & Rejected",
  CareerPortal: "Career Portal",
  InterviewPanel: "Interview Panel",
  ViewScoreDetails: " View ScoreCard Details",
  ReschedulInterview: "Reschedule Interview",
  OnboardingChecklist: "Pre Onboarding Checklist",

  LabourHire: "Labour Hire",
  Agent: "Agent",
  CreateAdminPage: "Create Admin Page",

  EnglishAdvertisment: "English", //"Job Advertisement",
  FrenchAdvertisement: "French", //"Offre d'emploi"
};
