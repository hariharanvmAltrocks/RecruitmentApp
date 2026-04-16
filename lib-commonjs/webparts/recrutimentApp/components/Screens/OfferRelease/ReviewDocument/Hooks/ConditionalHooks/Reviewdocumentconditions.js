"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVisibilityFlags = exports.buildStatusFlags = void 0;
var ConditionConfig_1 = require("../../../../../../utilities/ConditionConfig");
var EvaluationConfig_1 = require("../../../../SelectionProcess/config/EvaluationConfig");
var buildStatusFlags = function (statusID, empCat, consentVerification, isExpat) { return ({
    pendingHRBGVInit: statusID === EvaluationConfig_1.StatusId.PendingHRBGVInitiation,
    pendingHRReviewBGCheck: statusID === EvaluationConfig_1.StatusId.PendingHRReviewBGCheck,
    pendingHROfferReview: statusID === EvaluationConfig_1.StatusId.PendingHROfferReview,
    pendingHRReviewWPInit: statusID === EvaluationConfig_1.StatusId.PendingHRReviewOfferWorkPermitInit,
    pendingHRReviewOfferEC: statusID === EvaluationConfig_1.StatusId.PendingHRReviewOfferanduploadEmployementContract,
    pendingHRReviewWPDocs: statusID === EvaluationConfig_1.StatusId.PendingHRReviewWorkpermitDocs,
    pendingHRECVerification: statusID === EvaluationConfig_1.StatusId.PendingHREmploymentContractVerification,
    pendingDOTAficaVerify: statusID === EvaluationConfig_1.StatusId.PendingDOTAficaVerification,
    pendingHROfferInitiate: statusID === EvaluationConfig_1.StatusId.PendingHROfferInitiate,
    wpAckContractUploaded: statusID === EvaluationConfig_1.StatusId.WorkPermitAcknowledgedContractUploaded,
    pendingFinancePayment: statusID === EvaluationConfig_1.StatusId.PendingFinancePaymentReview,
    isKCSAEmployee: empCat === ConditionConfig_1.EmployeementCategory.KCSAEmployee,
    isLabourHire: empCat === ConditionConfig_1.EmployeementCategory.LaborhireContractor,
    isVerified: consentVerification === "verified",
    ViewFlag: statusID === EvaluationConfig_1.StatusId.PendingBGdocuploadedbycandidate ||
        statusID === EvaluationConfig_1.StatusId.PendingDOTAficaVerification ||
        statusID === EvaluationConfig_1.StatusId.PendingCandidateOfferLetterUpload ||
        statusID === EvaluationConfig_1.StatusId.PendingCandidateWorkPermitreleatedDoc ||
        statusID === EvaluationConfig_1.StatusId.PendingCandidateEmploymentContractUpload ||
        statusID === EvaluationConfig_1.StatusId.PendingLabourHireOfferRelease ||
        statusID === EvaluationConfig_1.StatusId.PendingLabourhireWPPayment ||
        statusID === EvaluationConfig_1.StatusId.PendingLHECRelease,
    // statusID === StatusId.PendingHRpreonboardingchecklist,
    PendingHREmploymentContractReview: statusID === EvaluationConfig_1.StatusId.PendingHREmploymentContractReview,
    PreOnboardingChecklist: statusID === EvaluationConfig_1.StatusId.PendingHRpreonboardingchecklist,
    isExpat: isExpat === true,
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
        is.pendingHRECVerification;
};
var resolveUploadLabel = function (is) {
    if (is.pendingHROfferInitiate && is.isKCSAEmployee)
        return "Upload Offer Letter";
    if (is.wpAckContractUploaded)
        return "Upload Employment Contract";
    if (is.pendingFinancePayment && is.isLabourHire)
        return "Proof Of Document";
    return "";
};
var buildVisibilityFlags = function (is, hasDetails, rejectFlag, revertFlag) {
    var showUploadDocument = (is.pendingHROfferInitiate && is.isKCSAEmployee) ||
        (is.wpAckContractUploaded && is.isVerified) ||
        (is.pendingFinancePayment && is.isVerified && is.isLabourHire);
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
    };
};
exports.buildVisibilityFlags = buildVisibilityFlags;
//# sourceMappingURL=Reviewdocumentconditions.js.map