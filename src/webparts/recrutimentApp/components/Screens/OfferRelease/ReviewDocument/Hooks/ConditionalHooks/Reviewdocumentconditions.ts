import { EmployeementCategory } from "../../../../../../utilities/ConditionConfig";
import { StatusId } from "../../../../SelectionProcess/config/EvaluationConfig";

export interface ReviewStatusFlags {
  pendingHRBGVInit: boolean;
  pendingHRReviewBGCheck: boolean;
  pendingHROfferReview: boolean;
  pendingHRReviewWPInit: boolean;
  pendingHRReviewOfferEC: boolean;
  pendingHRReviewWPDocs: boolean;
  pendingHRECVerification: boolean;
  pendingDOTAficaVerify: boolean;
  pendingHROfferInitiate: boolean;
  wpAckContractUploaded: boolean;
  pendingFinancePayment: boolean;
  isKCSAEmployee: boolean;
  isLabourHire: boolean;
  isVerified: boolean;
  ViewFlag: boolean;
}

export interface ReviewVisibilityFlags {
  showCandidateDocs: boolean;
  showVerificationToggle: boolean;
  showConsentForm: boolean;
  showCOICard: boolean;
  showWorkPermitUpload: boolean;
  showUploadDocument: boolean;
  showDOTAficaBadge: boolean;
  uploadDocLabel: string;
  ViewFlag: boolean;
}

export const buildStatusFlags = (
  statusID: number | undefined,
  empCat: string | undefined,
  consentVerification: string | null,
): ReviewStatusFlags => ({
  pendingHRBGVInit: statusID === StatusId.PendingHRBGVInitiation,
  pendingHRReviewBGCheck: statusID === StatusId.PendingHRReviewBGCheck,
  pendingHROfferReview: statusID === StatusId.PendingHROfferReview,
  pendingHRReviewWPInit:
    statusID === StatusId.PendingHRReviewOfferWorkPermitInit,
  pendingHRReviewOfferEC:
    statusID === StatusId.PendingHRReviewOfferanduploadEmployementContract,
  pendingHRReviewWPDocs: statusID === StatusId.PendingHRReviewWorkpermitDocs,
  pendingHRECVerification:
    statusID === StatusId.PendingHREmploymentContractVerification,
  pendingDOTAficaVerify: statusID === StatusId.PendingDOTAficaVerification,
  pendingHROfferInitiate: statusID === StatusId.PendingHROfferInitiate,
  wpAckContractUploaded:
    statusID === StatusId.WorkPermitAcknowledgedContractUploaded,
  pendingFinancePayment: statusID === StatusId.PendingFinancePaymentReview,
  isKCSAEmployee: empCat === EmployeementCategory.KCSAEmployee,
  isLabourHire: empCat === EmployeementCategory.LaborhireContractor,
  isVerified: consentVerification === "verified",
  ViewFlag:
    statusID === StatusId.PendingBGdocuploadedbycandidate ||
    statusID === StatusId.PendingCandidateOfferLetterUpload ||
    statusID === StatusId.PendingCandidateWorkPermitreleatedDoc ||
    statusID === StatusId.PendingCandidateEmploymentContractUpload ||
    statusID === StatusId.PendingLabourHireOfferRelease ||
    statusID === StatusId.PendingLabourhireWPPayment ||
    statusID === StatusId.PendingLHECRelease,
});

// ─── Visibility flag builder ──────────────────────────────────────────────────

export const buildVisibilityFlags = (
  is: ReviewStatusFlags,
  hasDetails: boolean,
  rejectFlag: boolean,
): ReviewVisibilityFlags => {
  const showUploadDocument =
    (is.pendingHROfferInitiate && is.isKCSAEmployee) ||
    (is.wpAckContractUploaded && is.isVerified) ||
    (is.pendingFinancePayment && is.isVerified && is.isLabourHire);

  const uploadDocLabel = resolveUploadLabel(is);

  return {
    showCandidateDocs: hasDetails && !is.pendingHRBGVInit,
    showVerificationToggle: resolveVerificationToggle(is),
    showConsentForm: is.pendingHRReviewBGCheck && is.isVerified,
    showCOICard: is.pendingDOTAficaVerify && rejectFlag,
    showWorkPermitUpload: is.wpAckContractUploaded,
    showUploadDocument,
    showDOTAficaBadge: is.pendingDOTAficaVerify,
    uploadDocLabel,
    ViewFlag: is.isVerified,
  };
};

const resolveVerificationToggle = (is: ReviewStatusFlags): boolean =>
  is.pendingHRReviewBGCheck ||
  is.pendingHROfferReview ||
  is.pendingHRReviewWPInit ||
  is.pendingHRReviewOfferEC ||
  is.pendingHRReviewWPDocs ||
  is.pendingHRECVerification;

const resolveUploadLabel = (is: ReviewStatusFlags): string => {
  if (is.pendingHROfferInitiate && is.isKCSAEmployee)
    return "Upload Offer Letter";
  if (is.wpAckContractUploaded) return "Upload Employment Contract";
  if (is.pendingFinancePayment && is.isLabourHire) return "Proof Of Document";
  return "";
};
