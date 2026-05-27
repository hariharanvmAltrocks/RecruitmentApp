"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStageIndexinCandidate = exports.getStageCandidateindex = exports.PROGRESS_STEPS = exports.getStageIndex = exports.CandidateStages = exports.stages = void 0;
var lucide_react_1 = require("lucide-react");
var Config_1 = require("./Config");
exports.stages = [
    { label: "Assign HR", icon: lucide_react_1.FileSearch },
    { label: "Upload Advert", icon: lucide_react_1.ClipboardCheck },
    { label: "Review Advert LM", icon: lucide_react_1.Send },
    { label: "Create Minimum Criteria Question", icon: lucide_react_1.Play },
    { label: "Review Advert HOD", icon: lucide_react_1.Filter },
    { label: "Upload ONEM Signed and Stamped", icon: lucide_react_1.ShieldCheck },
    { label: "Recruitment In Process", icon: lucide_react_1.Network },
    { label: "Onboarded", icon: lucide_react_1.CheckCircle2 },
];
exports.CandidateStages = [
    { label: "Background Check", icon: lucide_react_1.FileSearch },
    { label: "Dot's Africa Verification", icon: lucide_react_1.CheckCircle2 },
    { label: "Resi Process", icon: lucide_react_1.ShieldCheck },
    { label: "Offer Release", icon: lucide_react_1.Briefcase },
    { label: "Work Permit Process", icon: lucide_react_1.ClipboardCheck },
    { label: "Employment Contract", icon: lucide_react_1.Send },
    { label: "Pre-Onboarding", icon: lucide_react_1.Play },
    { label: "Onboarding", icon: lucide_react_1.Filter },
];
var getStageIndex = function (statusId) {
    if (!statusId)
        return 0;
    if (statusId == Config_1.StatusId.PendingAssignHR)
        return 0;
    if (statusId == Config_1.StatusId.PendingUploadAdvert)
        return 1;
    if (statusId == Config_1.StatusId.PendingwithLineManagereviewAdv)
        return 2;
    if (statusId == Config_1.StatusId.CareerPortalQuestions)
        return 3;
    if (statusId == Config_1.StatusId.PendingReviewAdvertHOD)
        return 4;
    if (statusId == Config_1.StatusId.PendingUploadONEM)
        return 5;
    if (statusId == Config_1.StatusId.RecruitmentInProgress)
        return 6;
    if (statusId == Config_1.StatusId.RESProcessInitiated)
        return 7;
    if (statusId == Config_1.StatusId.Onboarded)
        return 8;
    return 0;
};
exports.getStageIndex = getStageIndex;
exports.PROGRESS_STEPS = [
    "Interview Schedules",
    "Assign Position ID",
    "Background Check",
    "Resi Process",
    "Offer Release",
    "Workpermit Process",
    "Employment Contract",
    "Onboarding In Progress",
    "Onboarded",
];
var getStageCandidateindex = function (statusId) {
    if (!statusId)
        return 0;
    if (statusId == Config_1.StatusId.InterviewScheduled ||
        statusId == Config_1.StatusId.InterviewLevel1InProgress ||
        statusId == Config_1.StatusId.InterviewLevel2InProgress ||
        statusId == Config_1.StatusId.InterviewScheduledforLevel2)
        return 0;
    if (statusId == Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD ||
        statusId == Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
        statusId == Config_1.StatusId.OnHoldbyHOD ||
        statusId == Config_1.StatusId.RejectedbyHOD ||
        statusId == Config_1.StatusId.CandidateOnHoldbyHODLevel1 ||
        statusId == Config_1.StatusId.CandidateOnHoldbyHODLevel2 ||
        statusId == Config_1.StatusId.CandidateRejectedbyHODLevel1 ||
        statusId == Config_1.StatusId.CandidateRejectedbyHODLevel2 ||
        statusId == Config_1.StatusId.Selected)
        return 1;
    if (statusId == Config_1.StatusId.PendingHRBGVInitiation ||
        statusId == Config_1.StatusId.PendingBGdocuploadedbycandidate ||
        statusId == Config_1.StatusId.PendingHRReviewBGCheck ||
        statusId == Config_1.StatusId.PendingDOTAficaVerification)
        return 2;
    if (statusId == Config_1.StatusId.RESIProcessInitiatedforDRC ||
        statusId == Config_1.StatusId.RESIProcessInitiatedforExpatriate ||
        statusId == Config_1.StatusId.RESProcessInitiated)
        return 3;
    if (statusId == Config_1.StatusId.PendingHROfferInitiate ||
        statusId == Config_1.StatusId.PendingCandidateOfferLetterUpload ||
        statusId == Config_1.StatusId.PendingHRReviewOfferWorkPermitInit ||
        statusId == Config_1.StatusId.PendingLabourHireOfferRelease ||
        statusId == Config_1.StatusId.PendingHROfferReview)
        return 4;
    if (statusId == Config_1.StatusId.PendingCandidateWorkPermitreleatedDoc ||
        statusId == Config_1.StatusId.PendingHRReviewWorkpermitDocs ||
        statusId == Config_1.StatusId.WorkPermitAcknowledgedContractUploaded ||
        statusId == Config_1.StatusId.PendingLabourhireWPPayment ||
        statusId == Config_1.StatusId.PendingFinancePaymentReview ||
        statusId == Config_1.StatusId.PendingLHWorkPermitProcess ||
        statusId ==
            Config_1.StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract)
        return 5;
    if (statusId == Config_1.StatusId.WorkPermitAcknowledgedContractUploaded ||
        statusId == Config_1.StatusId.PendingCandidateEmploymentContractUpload ||
        statusId == Config_1.StatusId.PendingHREmploymentContractVerification ||
        statusId == Config_1.StatusId.PendingHRReviewOfferuploadEmploymentInit ||
        statusId == Config_1.StatusId.PendingHREmploymentContractInit ||
        statusId == Config_1.StatusId.PendingLHECRelease ||
        statusId == Config_1.StatusId.PendingHREmploymentContractReview ||
        statusId ==
            Config_1.StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract)
        return 6;
    if (statusId == Config_1.StatusId.OnboardingProcessinitiatedforDRC ||
        statusId == Config_1.StatusId.OnboardingProcessinitiatedforExpat ||
        statusId == Config_1.StatusId.PendingHRpreonboardingchecklist ||
        statusId == Config_1.StatusId.onboardingInProcess)
        return 7;
    if (statusId == Config_1.StatusId.Onboarded) {
        return 8;
    }
    return 0;
};
exports.getStageCandidateindex = getStageCandidateindex;
var getStageIndexinCandidate = function (statusId) {
    if (statusId == Config_1.StatusId.PendingHRBGVInitiation ||
        statusId == Config_1.StatusId.PendingBGdocuploadedbycandidate ||
        statusId == Config_1.StatusId.PendingHRReviewBGCheck)
        return 0;
    if (statusId == Config_1.StatusId.PendingDOTAficaVerification)
        return 1;
    if (statusId == Config_1.StatusId.RESIProcessInitiatedforDRC ||
        statusId == Config_1.StatusId.RESIProcessInitiatedforExpatriate ||
        statusId == Config_1.StatusId.RESProcessInitiated)
        return 2;
    if (statusId == Config_1.StatusId.PendingHROfferInitiate ||
        statusId == Config_1.StatusId.PendingCandidateOfferLetterUpload ||
        statusId == Config_1.StatusId.PendingHRReviewOfferWorkPermitInit ||
        statusId == Config_1.StatusId.PendingLabourHireOfferRelease ||
        statusId == Config_1.StatusId.PendingHROfferReview)
        return 3;
    if (statusId == Config_1.StatusId.PendingCandidateWorkPermitreleatedDoc ||
        statusId == Config_1.StatusId.PendingHRReviewWorkpermitDocs ||
        statusId == Config_1.StatusId.WorkPermitAcknowledgedContractUploaded ||
        statusId == Config_1.StatusId.PendingLabourhireWPPayment ||
        statusId == Config_1.StatusId.PendingFinancePaymentReview ||
        statusId == Config_1.StatusId.PendingLHWorkPermitProcess ||
        statusId ==
            Config_1.StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract ||
        statusId == Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract)
        return 4;
    if (statusId == Config_1.StatusId.PendingHRpreonboardingchecklist)
        return 5;
    if (statusId == Config_1.StatusId.OnboardingProcessinitiatedforDRC ||
        statusId == Config_1.StatusId.OnboardingProcessinitiatedforExpat ||
        statusId == Config_1.StatusId.onboardingInProcess)
        return 6;
    if (statusId == Config_1.StatusId.Onboarded) {
        return 7;
    }
    return 0;
};
exports.getStageIndexinCandidate = getStageIndexinCandidate;
//# sourceMappingURL=PositionStatusConfig.js.map