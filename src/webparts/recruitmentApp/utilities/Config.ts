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

  //Master List
  HRMSQualification: "HRMSQualification",
  HRMSRoleSpecificKnowlegeMaster: "HRMSRoleSpecificKnowlegeMaster",
  HRMSTechnicalSkills: "HRMSTechnicalSkills",
  HRMSLevelOfProficiency: "HRMSLevelOfProficiency",
  HRMSExternalAgents: "HRMSExternalAgents",
  HRMSExternalAgentsDetailsForRecruitment:
    "HRMSExternalAgentsDetailsForRecruitment",
  HRMSInterviewPanelDetails: "HRMSInterviewPanelDetails",
};

export const DocumentLibraray = {
  InterviewPanelCandidateCV: "InterviewPanelCandidateCV",
  HRMSRecruitment: "HRMSRecruitment",
  HRMSRoleProfile: "HRMS_Role_Profile",
  RecruitmentAdvertisementDocument: "RecruitmentAdvertisementDocument",
  ONAMSignedStampDocuments: "ONAMSignedStampDocuments",
  RoleProfileMaster: "RoleProfileMaster",
};

export const StatusId = {
  PendingwithHRLeadtoAssignRecruitmentHR: 68,
  PendingwithRecruitmentHRtouploadAdv: 2,
  PendingwithHODtoreviewAdv: 26,
  PendingwithHRLeadtouploadONEMsigneddoc: 118,
  PendingwithRecruitmentHRtoAssignExternalAgency: 119,
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
  AdvertisementSubmitMsg: "Advertisement Uploaded Successfully",
  ScoreCardSubmitMsg: "ScoreCard Uploaded Successfully",
  ONEMDocumentMsg: "ONEM Document Uploaded Successfully",
  RecuritmentSubmitMsg: "Submitted Successfully",
  ApprovedMsg: "Approved Successfully",
  RecuritmentHRMsgCancel:
    "Are you sure you want to cancel? Any unsaved changes will be lost.",
  BackMsg: "Are you sure you want go to Home Page ?",
  ValidationErrorMsg: "One or more required actions are missing",
  RecruitmentErrorMsg: "Please select the Job Code",
  AgencySucess: "Agencies Assigned Successfully",
  HRSuccess: "HR Assigned Successfully",
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
  TechnicalSkill: "Technical Skills",
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
  CandidateDetails: "Candidate Details",
  PositionDetails: "Position Details",
  AdvertisementDetails: "Advertisement Details",
  ScorecardDetails: "Scorecard Details",
  ReviewONEMAdvertisement: "Review ONEM Advertisement",
};
