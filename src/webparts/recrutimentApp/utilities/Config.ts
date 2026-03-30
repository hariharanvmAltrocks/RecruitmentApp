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

  HRMSRecruitmentTabMaster: "HRMSRecruitmentTabMaster"

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
  HRLeadtoAssignRecruitmentHR: 68,
  PendingAssignHR: 68,
  PendingUploadAdvert: 2,
  PendingReviewAdvertHOD: 26,
  PendingUploadONEM: 118,
  PendingAssignAgencies: 119,
  RecruitmentInProgress: 28,
  PendingwithHODtoselectthecandidate: 121,
  Selected: 122,
  InterviewQustionHRLM: 39,

  Completed: 13,
  ReadyforRecruitmentProcess: 155,
  PendingInterviewquestion: 124,
  PendingwithLineManagereviewAdv: 125,
  CareerPortalQuestions: 126,
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
  FailedmedicalscreeningUnfit: 156,
  offerdecline: 27,
  onboardingInProcess: 46,
  Onboarded: 157,

  InterviewScheduled: 40,
  InterviewInProcess: 39
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

  // post Recrutiment
  PendingCandidateUploadBGVDocs: "WS37",
  UploadedtheCandidateBGVDocs: "WS38",
  initiatetheBGVProcess: "WS39",

  Offerdecline: "WS25",
  SysytmeDecline: "WS26",
  // KCSA
  Pendingwithcandidatetosignofferletter: "WS16",
  CandidateuploadedtheSignedOfferLetter: "WS17",
  PendingwithCandidatetouploadotherDocuments: "WS18",
  CandidateUploadedcandidatepersonalDocs: "WS19",
  PendingwithCandidatetosignEmployementContract: "WS20",
  UploadedthesignedEmployementcontractform: "WS21",
  // Labor Hire
  PendingHROfferInitiate: "WS27",
  PendingLabourHireOfferRelease: "WS28",
  PendingLabourhireWPPayment: "WS29",
  PendingFinancePaymentReview: "WS30",
  PendingLHWorkPermitProcess: "WS31",
  PendingHREmploymentContractInit: "WS32",
  PendingLHECRelease: "WS33",
  OnboardingInprogress: "WS36",


  RevertedBacktoCandidateforreuploadofferLetter: "WS22",
  RevertedBacktoCandidateforreuploadDocs: "WS23",
  RevertedBacktoCandidateforreuploadEmploymentContract: "WS24",
  RevertedtheLabourHireOfferRelease: "WS34",
  RevertedtheLabourHireEmployementContract: "WS35",
  RevetedBacktoBGVDocuments: "WS40"

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

export const DataFrom = {
  NewPosition: "New Position",
  ExistingPosition: "Existing Position",
  VacancyRecruitmentProcess: "Vacancy Requirement Process"
}

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

export const ExternalUserType = {
  Agent: "Agent",
  LabourHire: "Labour Hire",
}

export const PendingCandidateAlertMsg = (pendingcount: number): string => {
  return `
          <div style="text-align: center;">
            <h3>⚠️ Pending Candidate Review.</h3>
            <p>There is ${pendingcount} pending candidate currently on hold</p>
            <p>Please review the candidate and take the necessary action to proceed with interview scheduling.</p>
          </div>`
}

export const JobAdvertAlertMsg = (Dateformat: any): string => {
  return `
              <div style="text-align: center;">
                <h3>⚠️ Action cannot be performed.</h3>
                <p>This job advert is still active and open for recruitment.</p>
                <p><strong>Expiry Date:</strong> ${Dateformat}</p>
                <p>Please try again after it expires.</p>
              </div>`
}