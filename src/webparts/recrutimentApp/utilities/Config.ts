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

  RecruitAppCareerPortalIntegration: "RecruitAppCareerPortalIntegration",
  RecruitmentCareerPortalLink: "RecruitmentCareerPortalLink",

  //Resi
  HRMSRESIDRCDetails: "HRMSRESIDRCDetails",
  HRMSRESIExpatDetails: "HRMSRESIExpatDetails",

};

export const DocumentLibraray = {
  InterviewPanelCandidateCV: "HRMSRecruitmentCandidateCV",
  HRMSRecruitment: "HRMSRecruitment",
  HRMSRoleProfile: "HRMS_Role_Profile",
  RecruitmentAdvertisementDocument: "HRMSRecruitmentAdvertDocument",
  ONAMSignedStampDocuments: "HRMSRecruitmentOnamStampedDocuments",
  RoleProfileMaster: "RoleProfileMaster",
  HRMSCareerPortalCandidateCV: "HRMSCareerPortalCandidateCV",
  HRMSCandidateDocs: "HRMSCandidateDocs",
  DOTAfricaConsentForm: "DOTAfricaConsentForm"
};

export const RoleID = {
  RecruitmentHRLead: 1,
  RecruitmentHR: 2,
  HOD: 3,
  LineManager: 4,
  InterviewPanel: 5,
  RecruitmentAppExternalAgency: 6,
  RecruitmentLineManager: 7,
  FinanceDepartment: 8
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
  Rescheduled: 159,

  // BackGorund Verification
  PendingHRBGVInitiation: 134,
  PendingBGdocuploadedbycandidate: 163,
  PendingHRReviewBGCheck: 135,
  PendingDOTAficaVerification: 172,
  //Medical Screening
  PendingwithTAforMedicalScreening: 144,
  // Post Recruitment
  PendingHROfferInitiate: 132,
  // KCSA
  PendingCandidateOfferLetterUpload: 133,
  PendingHRReviewOfferWorkPermitInit: 136,
  PendingCandidateWorkPermitreleatedDoc: 164,
  PendingHRReviewWorkpermitDocs: 137,
  WorkPermitAcknowledgedContractUploaded: 138,
  PendingCandidateEmploymentContractUpload: 161,
  PendingHREmploymentContractVerification: 142,
  PendingHRpreonboardingchecklist: 162,
  //Labor Hire
  PendingLabourHireOfferRelease: 170,
  PendingHROfferReview: 171,//184,//171,
  PendingLabourhireWPPayment: 173,
  PendingFinancePaymentReview: 174,
  PendingLHWorkPermitProcess: 175,
  PendingHRReviewOfferuploadEmploymentInit: 176,
  PendingHREmploymentContractInit: 177,
  PendingLHECRelease: 178,
  PendingHREmploymentContractReview: 179,

  RESIProcessInitiatedforDRC: 42,
  RESIProcessInitiatedforExpatriate: 75,

  PendingHRReviewOfferanduploadEmployementContract: 169,//183,//169

  // PendingHRReviewOfferWorkPermit: 136,
  // WorkPermitHRReview: 137,
  // WorkPermitAcknowledgedContractUploaded: 138,
  // HRReviewContractSigned: 161,
  // PendingHRPreOnboardingChecklist: 162,
  // PendingWorkPermituploadedbycandidate: 164,

  // PendingwithRecruitmentHRtoUploadtheOfferLetter: 132,
  // PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter: 142,
  // PendingwithCandidatetoSignOfferLetter: 133,
  // PendingwithRecruitmentHRtoReviewtheSignedOfferLetterandInitiateforOtherDocuments: 134,
  // PendingwithCandidatetoUploadOtherDocuments: 135,
  // PendingwithRecruitmentHRtoReviewtheCandidatePersonalDocs: 136,
  // PendingwithRecruitmentHRtoUploadtheEmploymentContract: 137,
  // PendingwithCandidatetoSignEmploymentContract: 138,
  // pendingwithRecruitmentHRtoReviewtheEmploymentContractForm: 139,
  OnboardingProcessinitiatedforDRC: 23,
  OnboardingProcessinitiatedforExpat: 24,

  //Revert Post Recrutiment
  RevertedBacktoCandidateforReuploadOfferLetter: 149,
  RevertedBacktoCandidateforReuploadDocs: 150,
  RevertedBacktoCandidateforReuploadEmploymentContract: 151,

  Pending: 89,
  PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract: 152,

  CandidateOnHoldbyHODLevel1: 165,
  CandidateOnHoldbyHODLevel2: 166,//182,//166,
  CandidateRejectedbyHODLevel1: 167,
  CandidateRejectedbyHODLevel2: 168,

  BackgroundCheckVerificationFailed: 180,
  RESProcessInitiated: 143,
  FailedmedicalscreeningUnfit: 156
};