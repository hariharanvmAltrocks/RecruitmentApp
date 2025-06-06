import { IADGroupID } from "../Models/MainPage";
import { AutoCompleteItem } from "../Models/Screens";

export const APIURL = "https://altrocks1.sharepoint.com/sites/HRMSDEV2";
export const ListNames = {
  HRMSSageList: "HRMS_Sage_List",
  HRMSGradeMaster: "HRMS_Grade_Master",
  HRMSUserRole: "HRMS_User_Role",
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
};

export const DocumentLibraray = {
  InterviewPanelCandidateCV: "HRMSRecruitmentCandidateCV",
  HRMSRecruitment: "HRMSRecruitment",
  HRMSRoleProfile: "HRMS_Role_Profile",
  RecruitmentAdvertisementDocument: "HRMSRecruitmentAdvertDocument",
  ONAMSignedStampDocuments: "HRMSRecruitmentOnamStampedDocuments",
  RoleProfileMaster: "RoleProfileMaster",
  HRMSCareerPortalCandidateCV: "HRMSCareerPortalCandidateCV",
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
  PendingwithHRandLMtocreateinterviewQuestion: 124,
  PendingwithLineManagereviewAdv: 125,
  PendingwithLMcreateDisqualificationQuestion: 126,
  OnHoldbyHOD: 123,
  RejectedbyHOD: 15,
  PendingwithHODtoselectthecandidateLevel2: 127,
  PendingwithRecruitmentHRtoassignLevel2InterviewPanel: 128,
  InterviewScheduledforLevel2: 129,
  PendingwithHODtoAssignPositionID: 130
};

export const RoleID = {
  HOD: 1,
  User: 2,
  BudgetHolder: 4,
  LineManager: 5,
  HR: 6,
  EXCO: 7,
  EXCO_Service_Department_Executive: 8,
  EXCO_Operations_Department_ED: 9,
  EXCO_Service_Department_CEC: 10,
  EXCO_Service_Department_MD: 11,
  EXCO_Operations_Department_Executive: 12,
  EXCO_Operations_Department_MD: 13,
  EXCO_Service_Department_CEF: 14,
  Payroll: 15,
  HR_SeniorSuperintendentII_Effectiveness: 16,
  Emergence: 17,
  BIOS: 18,
  Superintendent: 19,
  Legal: 20,
  Transformation: 21,
  MAD: 22,
  EXCOCEO: 23,
  EXCOCFOFinance: 24,
  EXCOCFOCommerical: 25,
  EXCOExecutive: 26,
  HeadOfDivision: 27,
  RecruitmentHRLead: 28,
  RecruitmentHR: 32,
  RecruitmentLineManager: 33,
  RecruitmentAppExternalAgency: 34,
  InterviewPanel: 35,
  EXCOMD: 31,
  TitleforProfile: 24,
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
  APIErrorMsg: "Server is temporarily unavailable.",
  InterviewQues:
    "Are you sure you want to change the option? Changing this will clear your current question, and you will need to start a new one",
  AddedMsg: "Added Successfully",
  deleteMsg: "Are you sure you want to delete this? Any unsaved changes will be lost",

  SelectedErrorMsg: "Please Choose the Disciplines.",
  WarningMsg: "Are you sure want to Change the Disciolines? Any unsaved changes will be lost",
  ClearWarning: "Are you sure you want to close? Unsaved changes will be lost.",
};
// In your validation messages config file
export const validationMsg = {
  MaxOptions: "You must fill at least 2 options.",
  CorrectAns: "Please select a correct answer.",
};

// export const ADGroupID: IADGroupID = {
//   HRMSHOD: "86374c2a-511d-4c6d-9eb8-f6b64a44eb97",
//   HRMSRecruitmentLineManager: "e46c5079-6a7d-40bf-a8cb-c7fbfa10f220",
//   HRMSRecruitmentHR: "fe43382e-002e-4879-8710-a4ac546d48e7",
//   HRMSRecruitmentHRLead: "df686473-5454-4afe-ad60-1ba93037c772",
//   HRMSInterviewPanel: "60c676c0-692d-4c48-b101-a6398fc99493",
// };

export const ADGroupID: IADGroupID = {
  HRMSHOD: "86374c2a-511d-4c6d-9eb8-f6b64a44eb97",
  HRMSRecruitmentLineManager: "e46c5079-6a7d-40bf-a8cb-c7fbfa10f220",
  HRMSRecruitmentHR: "fe43382e-002e-4879-8710-a4ac546d48e7",
  HRMSRecruitmentHRLead: "df686473-5454-4afe-ad60-1ba93037c772",
  HRMSInterviewPanel: "60c676c0-692d-4c48-b101-a6398fc99493",
  BudgetHolder: "68e84692-cc82-4871-926a-010e4d4715da",
  LineManager: "2dec2073-031c-4505-a2a2-6720e513da0a",
  HR: "b20259ec-7f60-49d6-ba0f-c48d8c8d44ea",
  EXCO_REMCO: "23c6870c-1986-4f19-81ec-6b72e199f6e6",
  EXCOServiceDepartmentExecutive: "172bc793-eba9-4418-873e-d05b20b9a476",
  EXCOOperationsDepartmentED: "53f5a070-238a-4e33-ac7d-f0395d2aa2d1",
  EXCOServiceDepartmentCEC: "cacacafc-8c6d-4b9b-95c5-0f8f851d31c4",
  EXCOServiceDepartmentMD: "327cc015-8239-407c-be8f-0b8b8f9142ad",
  EXCOOperationsDepartmentExecutive: "a1810fd6-7f04-43b3-a36e-a0a610f897a0",
  EXCOOperationsDepartmentMD: "afd77c38-918a-4bc6-8d3f-19fe5a84aefa",
  EXCOServiceDepartmentCEF: "7ddd3f09-5bb7-47c7-b05b-c9d6b32e502e",
  Payroll: "1784bc0a-23f7-441f-a415-4a257618e04b",
  SeniorSuperintendentII_HREffectiveness: "b5dc635a-90b3-4ba0-a029-4a5d03841e62",
  GradingCommittee: "47078d89-ab24-446d-a210-9367c9dac599",
  BIOS: "70547f09-b044-431b-bdcd-edad94b23a87",
  Superintendent: "7e62e9bb-a18a-49be-8d16-9220eb9cd003",
  Legal: "91f43caf-1943-46f3-8610-ab2c99ff0143",
  Transformation: "f064729a-9770-48fc-9ddd-0820785698bf",
  MAD: "926decfd-1390-4158-b760-e4a4c14d1950",
  EXCOCEO: "3271e934-c70e-47fa-b1f2-29a64ddd6455",
  EXCOCFOFinance: "74a577bd-976e-48fc-ab6b-967df315a396",
  EXCOCFOCommerical: "82fd7f93-24e3-4879-a88f-c09bc86f8067",
  EXCOExecutive: "6372d5b0-b610-4399-962c-99cf7ff3a10f",
  HeadofDivision: "6c791d7a-ac5d-4da0-9dcb-d6a49c744cff",
  SeniorHRManager: "91eac229-45d1-402c-beb7-cd06bc1d024c",
  EXCOED: "e09e27e4-4d93-4979-848f-a5ce13cf76ac",
  EXCOMD: "f436a318-89eb-45bb-b68f-0f6905379032",
  RecruitmentAppExternalAgency: "d59a35bf-524e-4951-9eb1-aeca407d73d0",
};

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
  AssignRecuritmentHR: "Assign Recuritment HR",
  UploadONEMDoc: "Upload ONEM Doc",
  MySubmission: "My Submission",
  UploadAdvertisement: "Job Advertisement",
  AssignAgencies: "Assign Agencies",
  ReviewProfile: "Review Profile",
  AssignInterviewPanel: "Assign Interview Panel",
  InterviewpanelL1: "Interview Panel Level-1",
  InterviewpanelL2: "Interview Panel Level-2",
  ReviewAdvertisement: "Review Advertisement",
  ReviewScorecard: "Review Scorecard",
  Evaluation: "Evaluation",
  CandidateDetails: "Applicants Details",
  PositionDetails: "Position Details",
  AdvertisementDetails: "Advertisement Details",
  AdvertisementViewDetails: "View Advertisement ",
  ScorecardDetails: "Review Scorecard",
  ViewCandidateDetails: "View Applicants Details",
  Scorecard: "Scorecard",
  ReviewONEMAdvertisement: "Review Job Advertisement",
  ViewPositionDetails: "View Position Details",
  ViewCandidateList: "View Applicants List",
  ViewJustification: "View Justification",
  EvaluationTab: "Candidate Details",
  InterviewQuestion: "Interview Questions",
  AdvertExtension: "Advert Extension",

  ReviewLevel1: "Review Profile - Level 1",
  ReviewLevel2: "Review Profile - Level 2",
  Shortlisted: "Shortlisted",
  onHold: "On Hold",
  Rejected: "Rejected",
  OnHoldRejected: "On Hold & Rejected",

  InterviewQuestions: "Interview Questions",
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
};
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
  ViewJobAdvetisement: "View Job Advertisement"
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
}

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