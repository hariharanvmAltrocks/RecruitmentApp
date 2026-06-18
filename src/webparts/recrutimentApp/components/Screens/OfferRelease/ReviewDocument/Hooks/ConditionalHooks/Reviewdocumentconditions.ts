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
  PendingHREmploymentContractReview: boolean;
  isKCSAEmployee: boolean;
  isLabourHire: boolean;
  isVerified: boolean;
  ViewFlag: boolean;
  PreOnboardingChecklist: boolean;
  isExpat: boolean;
  PendingHRReviewOfferuploadEmploymentInit: boolean;
  PendingHRReviewOfferanduploadEmployementContract: boolean;
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
  PreOnboardingChecklist: boolean;
}

export const buildStatusFlags = (
  statusID: number | undefined,
  empCat: string | undefined,
  consentVerification: string | null,
  isExpat: boolean,
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
  PendingHRReviewOfferuploadEmploymentInit:
    statusID === StatusId.PendingHRReviewOfferuploadEmploymentInit,
  wpAckContractUploaded:
    statusID === StatusId.WorkPermitAcknowledgedContractUploaded,
  pendingFinancePayment: statusID === StatusId.PendingFinancePaymentReview,
  isKCSAEmployee: empCat === EmployeementCategory.KCSAEmployee,
  isLabourHire: empCat === EmployeementCategory.LaborhireContractor,
  isVerified: consentVerification === "verified",
  ViewFlag:
    statusID === StatusId.PendingBGdocuploadedbycandidate ||
    statusID === StatusId.PendingDOTAficaVerification ||
    statusID === StatusId.PendingCandidateOfferLetterUpload ||
    statusID === StatusId.PendingCandidateWorkPermitreleatedDoc ||
    statusID === StatusId.PendingCandidateEmploymentContractUpload ||
    statusID === StatusId.PendingLabourHireOfferRelease ||
    statusID === StatusId.PendingLabourhireWPPayment ||
    statusID === StatusId.PendingLHECRelease ||
    statusID === StatusId.RESIProcessInitiatedforDRC ||
    statusID === StatusId.RESIProcessInitiatedforExpatriate ||
    statusID === StatusId.RESProcessInitiated ||
    statusID === StatusId.OnboardingProcessinitiatedforDRC ||
    statusID === StatusId.OnboardingProcessinitiatedforExpat||
    statusID === StatusId.FailedmedicalscreeningUnfit ||
    statusID === StatusId.BackgroundCheckVerificationFailed,
  // statusID === StatusId.PendingHRpreonboardingchecklist,
  PendingHREmploymentContractReview:
    statusID === StatusId.PendingHREmploymentContractReview,
  PreOnboardingChecklist: statusID === StatusId.PendingHRpreonboardingchecklist,
  isExpat: isExpat === true,
  PendingHRReviewOfferanduploadEmployementContract: statusID === StatusId.PendingHRReviewOfferanduploadEmployementContract,
});

const resolveVerificationToggle = (is: ReviewStatusFlags): boolean =>
  is.pendingHRReviewBGCheck ||
  is.pendingHROfferReview ||
  is.pendingHRReviewWPInit ||
  is.pendingHRReviewOfferEC ||
  is.pendingHRReviewWPDocs ||
  is.pendingFinancePayment ||
  is.PendingHREmploymentContractReview ||
  is.PendingHRReviewOfferuploadEmploymentInit ||
  is.PendingHRReviewOfferanduploadEmployementContract ||
  is.pendingHRECVerification;

const resolveUploadLabel = (is: ReviewStatusFlags): string => {
  if (is.pendingHROfferInitiate && is.isKCSAEmployee)
    return "Upload Offer Letter";
  if (is.wpAckContractUploaded) return "Upload Employment Contract";
  if (is.pendingFinancePayment && is.isLabourHire) return "Proof Of Document";
  if(is.PendingHRReviewOfferanduploadEmployementContract && is.isVerified) return "Upload Employment Contract";
  return "";
};

export const buildVisibilityFlags = (
  is: ReviewStatusFlags,
  hasDetails: boolean,
  rejectFlag: boolean,
  revertFlag: boolean,
): ReviewVisibilityFlags => {
  const showUploadDocument =
    (is.pendingHROfferInitiate && is.isKCSAEmployee) ||
    is.wpAckContractUploaded ||
    (is.pendingFinancePayment && is.isVerified && is.isLabourHire) ||
    (is.PendingHRReviewOfferanduploadEmployementContract && is.isVerified);

  const uploadDocLabel = resolveUploadLabel(is);

  return {
    showCandidateDocs: hasDetails && !is.pendingHRBGVInit,
    showVerificationToggle: resolveVerificationToggle(is),
    showConsentForm: is.pendingHRReviewBGCheck && is.isVerified && is.isExpat,
    showCOICard: is.pendingDOTAficaVerify && rejectFlag && !revertFlag,
    showWorkPermitUpload: is.wpAckContractUploaded,
    showUploadDocument,
    showDOTAficaBadge: is.pendingDOTAficaVerify,
    uploadDocLabel,
    ViewFlag: is.ViewFlag,
    PreOnboardingChecklist: is.PreOnboardingChecklist,
  };
};
