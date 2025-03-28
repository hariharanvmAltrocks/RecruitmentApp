import { IADGroupID } from "../Models/MainPage";
import { QuestionItem } from "../Models/RecuritmentVRR";
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
  //sneka
  PendingwithHRandLMtocreateinterviewQuestion :124
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
};

export const viewLabelcolor = {
  Labelcolor: "#9A5E5E",
};

export const RecuritmentHRMsg = {
  AdvertisementSubmitMsg:
    "Advertisement for the Job Title Submitted Successfully.",
  ScoreCardSubmitMsg:
    "The Candidate has been Interviewed and Scorecard Submitted for Final Selection.",
  ONEMDocumentMsg: "Signed and Stamped ONEM Document Uploaded Sucessfully.",
  RecuritmentSubmitMsg: "Submitted Successfully.",
  ApprovedMsg:
    "Advertisement Reviewed Sucessfully. Ready for ONEM Process (Offline).",
  RecuritmentHRMsgCancel:
    "Are you sure want to cancel? Any unsaved changes will be lost.",
  BackMsg: "Are you sure want go back to Home Page ?",
  ValidationErrorMsg:
    "One or more mandatory field are missing.Please do the needful and submit again.",
  RecruitmentErrorMsg: "Please choose the Job Code to assign Recruitment HR.",
  AgencySucess: "Agencies Assigned for the Selected Job Titles.",
  HRSuccess: "Recruitment HR Assigned for the Selected Job Titles.",
  AgenciesErrorMsg: "Please choose the Job Code to Assign Agencies.",
  ProfileReviewed:
    "Candidate Profile for the Job Title Reviewed and Shortlisted.",
  ProfileReviewedNo:
    "Candidate Profile for the Job Title Reviewed and Rejected.",
  ProfileReviewedWaitingList:
    "Candidate Profile for the Job Title Reviewed and On - Hold.",
  InterviewPanalAssignedSuccessfully: "Interview Panel Assigned Successfully.",
  CandidateSelected: "Candidate Selected",
  CandidateRejected: "Candidate Rejected",
  PositionIDassigned: "Position ID assigned for the selected Candidate.",
  InterviewScoredAlready:
    "The scorecard for the candidate has already been submitted.",
  APIErrorMsg: "Network Issue Please try again",
  InterviewQues:
    "Are you sure you want to change the option? Changing this will clear your current question, and you will need to start a new one",
};

export const ADGroupID: IADGroupID = {
  HRMSHOD: "86374c2a-511d-4c6d-9eb8-f6b64a44eb97",
  HRMSRecruitmentLineManager: "e46c5079-6a7d-40bf-a8cb-c7fbfa10f220",
  HRMSRecruitmentHR: "fe43382e-002e-4879-8710-a4ac546d48e7",
  HRMSRecruitmentHRLead: "df686473-5454-4afe-ad60-1ba93037c772",
  HRMSInterviewPanel: "60c676c0-692d-4c48-b101-a6398fc99493",
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

export const EmploymentOption = ["Yes", "No"];

export const TabName = {
  AssignRecuritmentHR: "Assign Recuritment HR",
  UploadONEMDoc: "Upload ONEM Doc",
  MySubmission: "My Submission",
  UploadAdvertisement: "Upload Advertisement",
  AssignAgencies: "Assign Agencies",
  ReviewProfile: "Review Profile",
  AssignInterviewPanel: "Assign Interview Panel",
  ReviewAdvertisement: "Review Advertisement",
  ReviewScorecard: "Review Scorecard",
  Evaluation: "Evaluation",
  CandidateDetails: "View Candidate Details",
  PositionDetails: "Position Details",
  AdvertisementDetails: "Advertisement Details",
  AdvertisementViewDetails: "View Advertisement ",
  ScorecardDetails: " Review Scorecard ",
  ViewCandiadteDetails: "View Candidate Details",
  Scorecard: "Scorecard",
  ReviewONEMAdvertisement: "Review ONEM Advertisement",
  ViewPositionDetails: "View Position Details",
  ViewCandidateDetails: "View Candidate Details",
  ViewJustification: "View Justification",
  EvaluationTab: "Candidate Details",
  InterviewQuestion: "Interview Questions",
  AdvertExtension: "Advert Extension",
  CheckboxContent: "I hereby agree for submitting this request.",
  ReviewLevel1: "Review Profile - Level 1",
  ReviewLevel2: "Review Profile - Level 2",
  Shortlisted: "Shortlisted",
  onHold: "On Hold",
  Rejected: "Rejected"
};

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
  WaitingList: "Waiting List",
};

export const InterviewLevels = {
  Level1: "Level 1",
  Level2: "Level 2",
  Level3: "Level 3",
};

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

export const QuestionnaireData: QuestionItem[] = [
  {
    id: 1,
    question: "What are some key regulations that govern mining operations?",
    answer:
      "Expected Answer:- By using sustainable mining practices, proper waste management, land reclamation, reducing water and air pollution, and implementing renewable energy sources.",
    rating: null,
  },
  {
    id: 2,
    question:
      "What strategies can be used to attract skilled professionals to remote mining locations?",
    answer:
      "Expected Answer:- Providing relocation assistance, offering rotational work schedules, housing facilities, competitive benefits, and care.",
    rating: null,
  },
];
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
// sneka
export const CatogryOptionCode = {
  CareerPortalCandidate: "Career Portal - Candidate",
  InterviewPanel: "Interview Panel",
};
export const displayTextOptionCode = {
  SingleAnswer: "Single Answer",
  MultiAnswer: "Multi Answer",
  CustomAnswer:"Custom Answer",
};
