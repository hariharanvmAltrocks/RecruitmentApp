"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVisibilityFlags = exports.buildStatusFlags = void 0;
var ConditionConfig_1 = require("../../../../../../utilities/ConditionConfig");
var Config_1 = require("../../../../../../utilities/Config");
var buildStatusFlags = function (statusID, empCat, consentVerification, isExpat) { return ({
    pendingHRBGVInit: statusID === Config_1.StatusId.PendingHRBGVInitiation,
    pendingHRReviewBGCheck: statusID === Config_1.StatusId.PendingHRReviewBGCheck,
    pendingHROfferReview: statusID === Config_1.StatusId.PendingHROfferReview,
    pendingHRReviewWPInit: statusID === Config_1.StatusId.PendingHRReviewOfferWorkPermitInit,
    pendingHRReviewOfferEC: statusID === Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract,
    pendingHRReviewWPDocs: statusID === Config_1.StatusId.PendingHRReviewWorkpermitDocs,
    pendingHRECVerification: statusID === Config_1.StatusId.PendingHREmploymentContractVerification,
    pendingDOTAficaVerify: statusID === Config_1.StatusId.PendingDOTAficaVerification,
    pendingHROfferInitiate: statusID === Config_1.StatusId.PendingHROfferInitiate,
    PendingHRReviewOfferuploadEmploymentInit: statusID === Config_1.StatusId.PendingHRReviewOfferuploadEmploymentInit,
    wpAckContractUploaded: statusID === Config_1.StatusId.WorkPermitAcknowledgedContractUploaded,
    pendingFinancePayment: statusID === Config_1.StatusId.PendingFinancePaymentReview,
    isKCSAEmployee: empCat === ConditionConfig_1.EmployeementCategory.KCSAEmployee,
    isLabourHire: empCat === ConditionConfig_1.EmployeementCategory.LaborhireContractor,
    isVerified: consentVerification === "verified",
    ViewFlag: statusID === Config_1.StatusId.PendingBGdocuploadedbycandidate ||
        statusID === Config_1.StatusId.PendingDOTAficaVerification ||
        statusID === Config_1.StatusId.PendingCandidateOfferLetterUpload ||
        statusID === Config_1.StatusId.PendingCandidateWorkPermitreleatedDoc ||
        statusID === Config_1.StatusId.PendingCandidateEmploymentContractUpload ||
        statusID === Config_1.StatusId.PendingLabourHireOfferRelease ||
        statusID === Config_1.StatusId.PendingLabourhireWPPayment ||
        statusID === Config_1.StatusId.PendingLHECRelease ||
        statusID === Config_1.StatusId.RESIProcessInitiatedforDRC ||
        statusID === Config_1.StatusId.RESIProcessInitiatedforExpatriate ||
        statusID === Config_1.StatusId.RESProcessInitiated ||
        statusID === Config_1.StatusId.OnboardingProcessinitiatedforDRC ||
        statusID === Config_1.StatusId.OnboardingProcessinitiatedforExpat ||
        statusID === Config_1.StatusId.FailedmedicalscreeningUnfit ||
        statusID === Config_1.StatusId.BackgroundCheckVerificationFailed,
    // statusID === StatusId.PendingHRpreonboardingchecklist,
    PendingHREmploymentContractReview: statusID === Config_1.StatusId.PendingHREmploymentContractReview,
    PreOnboardingChecklist: statusID === Config_1.StatusId.PendingHRpreonboardingchecklist,
    isExpat: isExpat === true,
    PendingHRReviewOfferanduploadEmployementContract: statusID === Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract,
    NationalOfferLetter: (statusID === Config_1.StatusId.HROfferLetterProgress || statusID === Config_1.StatusId.HREmploymentContractProgress) && !isExpat,
    NationalEmploymentContract: statusID === Config_1.StatusId.HREmploymentContractProgress && !isExpat,
    NationalOffer: statusID === Config_1.StatusId.HROfferLetterProgress && !isExpat,
}); };
exports.buildStatusFlags = buildStatusFlags;
var resolveVerificationToggle = function (is) {
    return is.pendingHRReviewBGCheck ||
        is.pendingHROfferReview ||
        is.pendingHRReviewWPInit ||
        is.pendingHRReviewOfferEC ||
        is.pendingHRReviewWPDocs ||
        is.pendingFinancePayment ||
        is.PendingHREmploymentContractReview ||
        is.PendingHRReviewOfferuploadEmploymentInit ||
        is.PendingHRReviewOfferanduploadEmployementContract ||
        is.pendingHRECVerification;
};
var resolveUploadLabel = function (is) {
    if (is.pendingHROfferInitiate && is.isKCSAEmployee)
        return "Upload Offer Letter";
    if (is.wpAckContractUploaded)
        return "Upload Employment Contract";
    if (is.pendingFinancePayment && is.isLabourHire)
        return "Proof Of Document";
    if (is.PendingHRReviewOfferanduploadEmployementContract && is.isVerified)
        return "Upload Employment Contract";
    return "";
};
var buildVisibilityFlags = function (is, hasDetails, rejectFlag, revertFlag) {
    var showUploadDocument = (is.pendingHROfferInitiate && is.isKCSAEmployee && is.isExpat) ||
        is.wpAckContractUploaded ||
        (is.pendingFinancePayment && is.isVerified && is.isLabourHire) ||
        (is.PendingHRReviewOfferanduploadEmployementContract && is.isVerified);
    var uploadDocLabel = resolveUploadLabel(is);
    return {
        showCandidateDocs: hasDetails && !is.pendingHRBGVInit,
        showVerificationToggle: resolveVerificationToggle(is),
        showConsentForm: is.pendingHRReviewBGCheck && is.isVerified && is.isExpat,
        showCOICard: is.pendingDOTAficaVerify && rejectFlag && !revertFlag,
        showWorkPermitUpload: is.wpAckContractUploaded,
        showUploadDocument: showUploadDocument,
        showDOTAficaBadge: is.pendingDOTAficaVerify,
        uploadDocLabel: uploadDocLabel,
        ViewFlag: is.ViewFlag,
        PreOnboardingChecklist: is.PreOnboardingChecklist,
        NationalOfferLetter: is.NationalOfferLetter,
        NationalEmploymentContract: is.NationalEmploymentContract,
        NationalOffer: is.NationalOffer
    };
};
exports.buildVisibilityFlags = buildVisibilityFlags;
//# sourceMappingURL=Reviewdocumentconditions.js.map