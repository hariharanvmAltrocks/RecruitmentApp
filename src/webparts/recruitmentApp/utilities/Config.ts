import { AutoCompleteItem } from "../Models/Screens";

export const APIURL = "https://altrocks1.sharepoint.com/sites/HRMSDEV2";
export const ListNames = {
  HRMSSageList: "HRMS_Sage_List",
  HRMSGradeMaster: "HRMS_Grade_Master",
  HRMSRecruitmentUserRole: "HRMSRecruitmentUserRole",
  // HRMSUserRole: "HRMS_User_Role",
  HRMSStatus: "HRMS-Master-Status",
  BusinessUnitMaster: "BusinessUnitMaster",
  HRMSDepartment: "HRMS-Department",
  HRMSSubDepartment: "HRMS-SubDepartment",
  HRMSJobTitleMaster: "HRMS_JobTitle_Master",
  HRMSSectionMaster: "HRMS_Section_Master",
  HRMSBUCToDepartmentMapping: "HRMSBUCToDepartmentMapping",
  HRMSMenuAccess: "HRMSRecruitmentMenuAccessRole",
  HRMSSectionToDptCodeMapping: "HRMS_SectionToDptCodeMapping",
  HRMSMenuTable: "HRMS_Menu_Table",
  HRMSVacancyReplacementRequest: "HRMSVacancyReplacementRequest",
  HRMSVRRPositionDetails: "HRMSVRRPositionDetails",
  HRMSCompanyCodeDetails: "HRMSCompanyCodeDetails",
  JDEDataMapping: "JDEDataMapping",
  HRMSRecruitmentDptDetails: "HRMSRecruitmentDptDetails",
  HRMSRecruitmentPositionDetails: "HRMSRecruitmentPositionDetails",
  HRMSVRRToPositionIDMapping: "HRMSVRRToPositionIDMapping",
  InterviewPanelCandidateDetails: "InterviewPanelCandidateDetails",
  HRMSRecruitmentCandidateDetails: "HRMSRecruitmentCandidateDetails",
  HRMSRecruitmentCandidatePersonalDetails:
    "HRMSRecruitmentCandidatePersonalDetails",
  HRMSRecruitmentComments: "HRMSRecruitmentComments",
  HRMSCandidateScoreCard: "HRMSCandidateScoreCard",

  HRMSRecruitmentRoleProfileDetails: "HRMSRecruitmentRoleProfileDetails",
  HRMSSelectedCandidateDetailsByHOD: "HRMSSelectedCandidateDetailsByHOD",

  //Master List
  HRMSQualification: "HRMSQualification",
  HRMSRoleSpecificKnowlegeMaster: "HRMSRoleSpecificKnowlegeMaster",
  HRMSTechnicalSkills: "HRMSTechnicalSkills",
  HRMSLevelOfProficiency: "HRMSLevelOfProficiency",
  HRMSExperienceMaster: "HRMSExperienceMaster",
  HRMSJobTitleFunctionType: "HRMSJobTitleFunctionType",
  HRMSExternalAgents: "HRMSExternalAgents",
  HRMSExternalAgentsDetailsForRecruitment:
    "HRMSExternalAgentsDetailsForRecruitment",
  HRMSInterviewPanelDetails: "HRMSInterviewPanelDetails",
  HRMSRecruitmentWorkFlowMasterStatus: "HRMSRecruitmentWorkFlowMasterStatus",
  HRMSPositionIDMaster: "HRMSPositionIDMaster",
  HRMSCategoryMaster: "HRMSCategoryMaster",

  //Additional Exisiting
  HRMSAdditionalHeadCountForExisitingPosition: "HRMSAdditionalHeadCountForExisitingPosition",
  HRMSAdditionalHCForExisitingPositionWithHeadCountDetails: "HRMSAdditionalHCForExisitingPositionWithHeadCountDetails",

  //New Position
  HRMSNewPositionRequest: "HRMSNewPositionRequest",
  HRMSNewPositionRequestPositionDetails: "HRMSNewPositionRequestPositionDetails",
  HRMSRecruitmentCandidateComments: "HRMSRecruitmentCandidateComments",
  HRMSCandidateLevel2ScoreCard: "HRMSCandidateLevel2ScoreCard",

  //Menu Merge
  HRMSRecruitmentSwitchUserMatrix: "HRMSRecruitmentSwitchUserMatrix",

  //Region Zone
  HRMSRegion: "HRMSRegion", //Region
  HRMSZone: "HRMSZone",

  //TCS Integration
  TCSInductionMeetings: "TCSInductionMeetings",
  TrainerAndFacilityDetails: "TrainerAndFacilityDetails",

  RecruitAppCareerPortalIntegration: "RecruitAppCareerPortalIntegration"
};

export const DocumentLibraray = {
  InterviewPanelCandidateCV: "HRMSRecruitmentCandidateCV",
  HRMSRecruitment: "HRMSRecruitment",
  HRMSRoleProfile: "HRMS_Role_Profile",
  RecruitmentAdvertisementDocument: "HRMSRecruitmentAdvertDocument",
  ONAMSignedStampDocuments: "HRMSRecruitmentOnamStampedDocuments",
  RoleProfileMaster: "RoleProfileMaster",
  HRMSCareerPortalCandidateCV: "HRMSCareerPortalCandidateCV",
  HRMSCandidateDocs: "HRMSCandidateDocs"
};

export const StatusId = {
  PendingwithHRLeadtoAssignRecruitmentHR: 68,
  PendingwithRecruitmentHRtouploadAdv: 2,
  PendingwithHODtoreviewAdv: 26,
  PendingwithHRLeadtouploadONEMsigneddoc: 118,
  PendingwithRecruitmentHRtoAssignExternalAgency: 119,
  RecruitmentInProgress: 28,
  PendingwithHODtoselectthecandidate: 121,
  Selected: 122,
  PendingInterviewQuestionwithLineManagerandHR: 39,
  InterviewScheduled: 40,
  Completed: 13,
  ReadyforRecruitmentProcess: 155,
  PendingwithHRandLMtocreateinterviewQuestion: 124,
  PendingwithLineManagereviewAdv: 125,
  PendingwithLMcreateDisqualificationQuestion: 126,
  OnHoldbyHOD: 123,
  RejectedbyHOD: 15,
  PendingwithHODtoselectthecandidateLevel2: 127,
  PendingwithRecruitmentHRtoassignLevel2InterviewPanel: 128,
  InterviewScheduledforLevel2: 129,
  PendingwithHODtoAssignPositionID: 130,

  // Post Recruitment
  PendingwithRecruitmentHRtoUploadtheOfferLetter: 132,
  PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter: 142,
  PendingwithCandidatetoSignOfferLetter: 133,
  PendingwithRecruitmentHRtoReviewtheSignedOfferLetterandInitiateforOtherDocuments: 134,
  PendingwithCandidatetoUploadOtherDocuments: 135,
  PendingwithRecruitmentHRtoReviewtheCandidatePersonalDocs: 136,
  PendingwithRecruitmentHRtoUploadtheEmploymentContract: 137,
  PendingwithCandidatetoSignEmploymentContract: 138,
  pendingwithRecruitmentHRtoReviewtheEmploymentContractForm: 139,
  OnboardingProcessinitiatedforDRC: 23,
  OnboardingProcessinitiatedforExpat: 24,

  //Revert Post Recrutiment
  RevertedBacktoCandidateforReuploadOfferLetter: 149,
  RevertedBacktoCandidateforReuploadDocs: 150,
  RevertedBacktoCandidateforReuploadEmploymentContract: 151,

  Pending: 89,
  PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract: 152
};

export const RoleID = {
  RecruitmentHRLead: 1,
  RecruitmentHR: 2,
  HOD: 3,
  LineManager: 4,
  InterviewPanel: 5,
  RecruitmentAppExternalAgency: 6,
  RecruitmentLineManager: 7,
};

export const GridStatusBackgroundcolor = {
  Pending: "#FDF414",
  CompletedOrApproved: "#D7FDD7",
  Rejected: "#ff8a8a",
  Draft: "#5CD7FB",
  Reverted: "#afb4b6",
  ReSubmitted: "#87caff",
  Initiated: "#e6eef2",
  Selected: "90ee90",
  InterviewScheduled: "D7FDD7",
};

export const HRMSAlertOptions = {
  Success: "Success",
  Confirmation: "Confirmation",
  Error: "Error",
  Warning: "Warning",
};

export const UserRole = {
  HOD: "1",
  HR: "2",
};

export const ResponeStatus = {
  SUCCESS: 200,
  FAILED: 500,
};

export const InOperator = {
  arraysize: 30,
  CamelQuery: 200,
};
export const count = {
  Topcount: 1000,
  CamelQuery: 5000,
};

export const WorkflowAction = {
  Approved: 1,
  Reject: 2,
  Revert: 3,
  Transfer: 4,
  Submitted: 5,
  Closed: 6,
  ReSubmitted: 7,
  OnHold: 10,
};

export const viewLabelcolor = {
  Labelcolor: "#9A5E5E",
};

export const RecuritmentHRMsg = {
  HRSuccess: "Recruitment HR Assigned for the Selected Job Titles.",
  SingleHRSuccessMsg: "Recruitment HR Assigned for the Selected Job Title.",

  ONEMDocumentMsg: "Signed and Stamped ONEM Document Uploaded Successfully.",

  AdvertisementSubmitMsg:
    "Advertisement Document Uploaded Successfully.",
  AdvertisementReveiwMsg: "Advertisement Reviewed Successfully.",

  AgencySucess: "Agencies Assigned for the Selected Job Titles.",
  SingleAgencyMsg: "Agencies Assigned for the Selected Job Title.",

  InterviewPanalAssignedSuccessfully: "Interview Panel Assigned Successfully.",
  InterviewPanalLevel1: "Interview Panel members for Level 1 have been Assigned Successfully.",
  InterviewPanalLevel2: "Interview Panel members for Level 2 have been Assigned Successfully.",

  RescheduleSuccessMsg: "Interview Rescheduled Successfully.",
  AdvertExtendsionSuccessMsg: "Advertisement Extension Submitted Successfully.",

  ScoreCardSubmitMsg:
    "The Candidate has been Interviewed and Scorecard Submitted for successfully ",
  ScoreCardMsgLevel2: "The candidate has successfully completed the Level 2 interview.",

  InterviewQuestionSuccessMsg: "Interview Panel  questionnaires has been created successfully.",
  CareerportalSuccessMsg: "Career Portal questionnaires has been created successfully.",

  ProfileReviewed:
    "Candidate Profile for the Job Title Reviewed and Shortlisted.",
  ProfileReviewedNo:
    "Candidate Profile for the Job Title Reviewed and Rejected.",
  ProfileReviewedWaitingList:
    "Candidate Profile for the Job Title Reviewed and On - Hold.",
  HRReviewCandidate: "Candidate Profile Reviewed Successfully.",

  CandidateSelected: "Candidate Selected.",
  CandidateSelectedLevel2: "Candidate Level 1 Selected Successfully",
  CandidateRejected: "Candidate Rejected.",
  CandidateOnHold: "Candidate On Hold.",
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
  deleteMsg: "Are you sure you want to delete this? Any unsaved changes will be lost",

  SelectedErrorMsg: "Please Choose the Disciplines.",
  WarningMsg: "Are you sure want to Change the Disciplines? Any unsaved changes will be lost",
  ClearWarning: "Are you sure you want to close? Unsaved changes will be lost.",
  SelectedCandidateValidation: "The requested headcount for the position has already been selected.",
  QuestionAlertMsg: "Interview questions are not available. Kindly reschedule the interview date.",

  UploadMsg: "Candidate CV Upload Successfully",
  ValidationMsg: "This Candidate Already Exists",

  OfferLetterMsg: "The offer letter has been uploaded successfully.",
  ReviewOfferLetterMsg: "The offer letter has been reviewed successfully",
  RevertedOfferLetter: "The offer letter has been reverted to candidate successfully..",

  ReviewOtherDocsMsg: "Candidate documents has been reviewed successfully",
  RevertOtherDocsMsg: "Candidate documents have been reverted successfully.",

  EmploymentContractMsg: "The employment contract has been uploaded successfully.",
  ReviewEmploymentContractMsg: "The employment contract has been reviewed successful, Please proceed with onboarding process",
  RevertedEmploymentContractMsg: "The employment contract has been reverted successfully.",

  NationalityErrorMsg: "Please select the Nationality filter before proceeding.",

  QuestionValiErrorMsg: "Please add at least 5 questions before proceeding.",
  COIWarningMsg: "This is the COI profile. Are you sure you're ready to proceed?"
};

export const validationMsg = {
  MaxOptions: "You must fill at least 2 options.",
  CorrectAns: "Please select a correct answer.",
};

// DEV/SIT
// export const ADGroupID: IADGroupID = {
//   HRMSHOD: "86374c2a-511d-4c6d-9eb8-f6b64a44eb97",
//   HRMSRecruitmentLineManager: "e46c5079-6a7d-40bf-a8cb-c7fbfa10f220",
//   HRMSRecruitmentHR: "fe43382e-002e-4879-8710-a4ac546d48e7",
//   HRMSRecruitmentHRLead: "df686473-5454-4afe-ad60-1ba93037c772",
//   HRMSInterviewPanel: "60c676c0-692d-4c48-b101-a6398fc99493",
//   LineManager: "2dec2073-031c-4505-a2a2-6720e513da0a",
//   RecruitmentAppExternalAgency: "d59a35bf-524e-4951-9eb1-aeca407d73d0",
// };

//UAT
// export const ADGroupID: IADGroupID = {
//   HRMSHOD: "166e7062-6d48-4eeb-b8b9-5d4c1c24d245",
//   HRMSRecruitmentLineManager: "e46c5079-6a7d-40bf-a8cb-c7fbfa10f220",
//   HRMSRecruitmentHR: "f5017ec6-5c87-4461-8e42-e1316909f2c5",
//   HRMSRecruitmentHRLead: "35d68e0f-b77e-47a4-b504-1ca65f71b070",
//   HRMSInterviewPanel: "b6562870-0b24-49ad-9ada-2dc40774e9ce",
//   LineManager: "79c343ae-666f-42a0-bf27-0f58adcb1fee",
//   RecruitmentAppExternalAgency: "2d03b531-d87e-4a9e-907d-fb6db73bdb38",
// };

//Production
// export const ADGroupID: IADGroupID = {
//   HRMSHOD: "fe3dfeea-5423-4272-85fa-27bfa0c0378d",
//   HRMSRecruitmentLineManager: "d9115164-acf9-4224-90af-a6aa2d6e87d5",
//   HRMSRecruitmentHR: "2c2fd526-ed9a-4106-9047-ea85e5d6a65c",
//   HRMSRecruitmentHRLead: "47513cdf-0b60-45f5-8a0e-f94bdae73769",
//   HRMSInterviewPanel: "1331ae84-4c88-40f6-b7b5-dcc71faaa378",
//   LineManager: "d9115164-acf9-4224-90af-a6aa2d6e87d5",
//   RecruitmentAppExternalAgency: "a7c1bac2-faf3-41b3-adb8-6b80dc0fbae7",
// };


export const tabType = {
  Dashboard: "Dashboard",
};

export const ActionStatus = {
  Shortlists: "Shortlists",
  Rejected: "Rejected",
};

export const RoleProfileMaster = {
  Grading: "Grading",
  RoleProfile: "RoleProfile",
};

export const RoleDescription = {
  RoleSpeKnowledgeValue: "RoleSpeKnowledgeValue",
  QualificationValue: "QualificationValue",
  TechnicalSkillValue: "TechnicalSkillValue",
};

export const RoleDescriptionData = {
  RoleSpeKnowledge: "Role Specific Knowledge",
  Qualification: "Qualification",
  TechnicalSkill: "Technical Skill",
};

export const ScoreRanking: AutoCompleteItem[] = [
  // { key: 1, text: "Poor" },
  // { key: 2, text: "Below Average" },
  // { key: 3, text: "Average" },
  // { key: 4, text: "Good" },
  // { key: 5, text: "Excellent" },
  { key: 1, text: "1" },
  { key: 2, text: "2" },
  { key: 3, text: "3" },
  { key: 4, text: "4" },
  { key: 5, text: "5" },
];

export const ReviewProfileScore: AutoCompleteItem[] = [
  { key: 1, text: "Excellent" },
  { key: 2, text: "Good" },
  { key: 3, text: "Average" },
  { key: 4, text: "Below Average" },
  { key: 5, text: "Poor" },
];

export const EmploymentOption = ["Yes", "No"];

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
  CandidateDocuments: "Candidate Documents",
  // HOD
  ReviewJobAdvertisement: "Review Job Advertistment",
  ReviewScorecard: "Review Score card",
  Evaluation: "Evaluation",
  // line Manager
  InterviewQuestions: "Interview Questions",

  CandidateDetails: "Applicants Details",
  PositionDetails: "Position Details",
  AdvertisementDetails: "Advertisement Details",
  AdvertisementViewDetails: "View Advertisement ",
  ViewCandidateDetails: "View Applicants Details",
  Scorecard: "Scorecard",
  ViewPositionDetails: "View Position Details",
  ViewCandidateList: "View Applicants List",
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

};

export const CheckboxContent = {
  CheckboxContent: "I hereby agree to submit this request for approval.",
  ApprovalCheckbox: "I hereby acknowledge that I have reviewed the job advertisement.",

  UploadOnemDocument: "I hereby agree to post the advert on the portal.",

  ReviewedCandidate: "I hereby acknowledge that I have reviewed the candidate details.",
  InterviewPanel: "I hereby reviewed candidate details and assigning interview panel.",
  RescheduleInterview: "I hereby acknowledge that I have reschedule the interview.",

  ScorecardEntry: "I hereby acknowledge completion of the scorecard entry.",
  HODscorecarddetails: "I hereby acknowledge that I have reviewed the candidate scorecard details."
}

export const ProfileStatus = {
  HR: "Pending with HR - Review Profile",
  LM: "Pending with LM - Review Profile",
};

export const Nationality = {
  Nationals: "Nationals (Congolese)",
  Expatriate: "Expatriate",
};

export const CandidateStatus = {
  Yes: "Yes",
  No: "No",
  OnHold: "On Hold",
};

export const InterviewLevels = {
  Level1: "Level 1",
  Level2: "Level 2",
  Level3: "Level 3",
  Levels2: "Level 1 & 2"
};

export const DataFrom = {
  NewPosition: "New Position Request",
  ExistingPosition: "Additional Headcount for Existing Position"
}

export const workflowStatusApi = {
  HRPending: "WS01",
  LineManagerL1Pending: "WS02",
  LineManagerL2Pending: "WS03",
  InterviewScheduled: "WS04",
  pendingHODSelection: "WS05",
  CandidateSelectedIPanel: "WS06",
  CandidateOnHoldIPanel: "WS07",
  CandidateRejectedIPanel: "WS08",
  PendingRecruitmentHRscheduleInterview: "WS09",
  HRRejected: "WS10",
  HROnHold: "WS11",
  LineManagerLevel1OnHold: "WS12",
  LineManagerLevel2OnHold: "WS13",
  LineManagerLevel1Rejected: "WS14",
  LineManagerLevel2Rejected: "WS15",

  // post Recrutiment
  Pendingwithcandidatetosignofferletter: "WS16",
  CandidateuploadedtheSignedOfferLetter: "WS17",
  PendingwithCandidatetouploadotherDocuments: "WS18",
  CandidateUploadedcandidatepersonalDocs: "WS19",
  PendingwithCandidatetosignEmployementContract: "WS20",
  UploadedthesignedEmployementcontractform: "WS21",

  RevertedBacktoCandidateforreuploadofferLetter: "WS22",
  RevertedBacktoCandidateforreuploadDocs: "WS23",
  RevertedBacktoCandidateforreuploadEmploymentContract: "WS24"
};

export const ApplicationStatusId = {
  ApplicationSubmitted: "AS01",
  ApplicationInProgress: "AS02",
  InterviewScheduled: "AS03",
  InterviewCompleted: "AS04",
  Selected: "AS05",
  ApplicationRejected: "AS06",
  ApplicationSuspended: "AS00"
}

export const Notes = {
  Roleprofile: "Role Profile is not available for the Job Title.",
  Grding: "Grading Report is not available for the Job Title.",
  ReviewRolePurpose: "Please review the 'View Job Advertisement' details prior to approving this submission."
}
// sneka
export const CatogryOption = [
  "Interview Panel",
  "Recruitment Process (Portal)",
];
export const DisciplinesOption = [
  { key: 0, text: "Scope" },
  { key: 1, text: "Technical" },
  { key: 2, text: "Behavioral" },
];
export const Choices = {
  Yes: "Yes",
  No: "No"
}
export const DataType = {
  New: "New",
  Existing: "Existing"
}
export const isDisqualificationOption = ["Yes", "No"];
export const CategoryID = {
  Department: 1,
  Function: 2,
  Level: 3,
  RoleSpecificKnowledge: 4,
  TechnicalSkill: 5,
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
}

export const CatogryOptionCode = {
  CareerPortalCandidate: "Career Portal - Candidate",
  InterviewPanel: "Interview Panel",
};
export const displayTextOptionCode = {
  SingleAnswer: "Single Choice",
  MultiAnswer: "Multi Choice",
  CustomAnswer: "Custom Answer",
};
export const categoryOption = [
  "Career Portal - Candidate",
  "Interview Panel"
];

export const labelName = {
  Level1CandidateLabel: "Does the candidate fit for the vacant position ? (Level 1)",
  Level2CandidateLabel: "Does the candidate fit for the vacant position ? (Level 2)",
  ViewJobAdvetisement: "View Job Advertisement",
  Candidate: "Candidate",

  //IT
  TrainingCenterSystem: "Training Center System",
  TASystem: "T&A System",
  ITSystem: "IT System",
  TrainingDetails: "Training Details",
  MedicalSystem: "Medical System",

  //Upload CV 
  Title: "Title",
  FirstName: "First Name ",
  MiddleName: " Middle Name",
  LastName: " Last Name",
  DOB: "DOB ",
  PhoneNumber: "Phone Number ",
  AlternativePhoneNumber: "Alternative Phone Number",
  Nationality: "Nationality ",
  ProofofIdentity: "Proof of Identity ",
  IdentityNumber: "Identity Number",
  Gender: "Gender",
  Email: "Email ",
  HighestEducation: "Highest Education ",
  WorkExperience: "Work Experience",
  RelevantExperience: "Relevant Experience",

  AddressLine1: "Address Line 1 ",
  Country: "Country ",
  State: "State ",
  City: "City ",
  PostalCode: "Postal Code ",
  ResumeCV: "Resume/CV and Cover Letter",

  OfferLetter: "Upload Offer Letter",
  ConsentDoc: "Upload Code of Business Content",
  EmployementDoc: "Upload Employement Contract",

  Attachment: "Attachment",
  UploadAttachment: "Upload Attachment",
  CurrentEmployer: "Current Employer",
  CurrentPosition: "Current Position",
  NumberOftax: "Number of tax dependents (specify number)",
  WillingToRelocate: "Willing to relocate if not currently living close to the relevant project site/office?",
  previouslyworkedMine: "Have you previously worked at Ivanhoe Mines and its subsidiaries or Zijin Mines and its subsidiaries?",
  familylinks: "Any family or other links with existing employees to declare? (If so, who? Attach detail)",
  businesslinks: "Any business links to declare? (If so, who? Attach detail)",

  whichOperation: "For which Operation?",
  YourRole: "What was your role?",
  RegionProvince: "Region / Province",
  Comment: "Comments",
  ViewComments: "View Comments",

  ReviewProfileFeedback: "Review Profile Feedback - HR",

  Firstextensiondate: "First Extension Date",
  Secondextensiondate: "Second Extension Date",
  Thirdextensiondate: "Third Extension Date",
  COIAttach: "Proof of Discussion",
  COIProfileLabel: "Consulted With"

};
export const ButtonAction = {
  Update: "Update",
  Submit: "Submit",
  Approve: "Approve",
  Reject: "Reject",
  Revert: "Revert",
  Cancel: "Cancel",
  Back: "Back",
  Save: "Save",
  Add: "Add",
  Delete: "Delete",
  Edit: "Edit",
  View: "View",
  Download: "Download",
  Upload: "Upload",
  Reschedule: "Reschedule",
  Assign: "Assign",
  Remove: "Remove",
  close: "Close",
  Review: "Reviewed",
}

export const ActionIcon = {
  Add: 1,
  View: 2,
  ViewSubmission: 3,
  Edit: 4,
  Delete: 5,
  Stamp: 6,
  Upload: 7
};

export const RoleName = {
  LineManager: "Line Manager",
  RecruitmentHR: "RecruitmentHR",
  HOD: "HOD",
  EXCO: "EXCO",
  InterviewPanel: "InterviewPanel"
};

export const DocumentFolderName = {
  Offerletter: "OfferLetter",
  EmploymentContractForm: "EmploymentContractForm",
  UnsignedDoc: "UnsignedDoc",
  PersonalDocs: "PersonalDocs",
  Medical: "Medical",
  COIAttach: "COIAttch",
  ConsentForm: "ConsentForm"
}

export const PostRecrutimentCheckboxContent = {
  OfferLetterDRC: "I hereby confirm that I have reviewed and verified the medical document, and I consent to the release of the offer letter.",
  OfferLetterExpat: "I hereby confirm  I consent to the release of the offer letter.",
  ReviewOfferLetter: "I hereby confirm that I have reviewed the signed offer letter and request the candidate to provide the necessary supporting documents.",

}

export const agentCode = {
  RecruitmentHR: "HRMS001",
}

export const Inductiontype = [
  { key: 1, text: "General Surface Induction" },
  { key: 2, text: "Underground Induction" },
  { key: 3, text: "Concentrator Induction" },
  { key: 4, text: "Smelter Induction" },
];

export const HardwareoptValue = [
  { key: 1, text: "Laptop" },
  { key: 2, text: "Cellular Phone" },
  // { key: 3, text: "Mouse" },
  // { key: 4, text: "Keyboard" },
  // { key: 5, text: "Speaker" },
  // { key: 6, text: "Mobile Phone" },
];

export const ITSystemReq = {
  NotRequired: "Not Required",
  Required: "Required"
}

export const NationalityOption = [
  { key: 1, text: "Nationals (Congolese)" },
  { key: 2, text: "Expatriate" },
];

export const ProfileReview = ["Yes", "No", "On Hold"]
export const ProfileReviewl2 = ["Yes", "No"]

export const ColorCode = {
  TabColorCode: {
    Tabcolor: "#a8b8c6",
    TabboxShadow: "#93a6b7",
  },
  SideNavColorCode: {
    SideNavColor: "#f5f5f5",
  },
  LabelStyleColorCode: {
    LabelStyleColor: "#597b98",
    boxShadow: "rgba(239, 51, 64, 0.2)",
  },
  ButtonColorCode: {
    ButtonColor: "#0D547B",
    boxShadowRed: "rgba(239, 51, 64, 0.2)",
    color: "white !important",
    backgroundColor: "white",
    ButtonbordeColor: "rgba(239, 51, 64)",
    ButtonHoverColor: "white !important",
  },
  ProfileColorCode: {
    colorCode: "#597b98"
  }
}
