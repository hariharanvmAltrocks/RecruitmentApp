import { StatusId } from "../SelectionProcess/config/EvaluationConfig";

export const Initiate_STAUES = new Set([
  StatusId.PendingHRBGVInitiation,
  StatusId.PendingHROfferInitiate,
  StatusId.PendingHREmploymentContractInit,
]);

export const REVIEW_STATUSES = new Set([
  StatusId.PendingHRReviewBGCheck,
  StatusId.PendingHROfferReview,
  StatusId.PendingHRReviewOfferWorkPermitInit,
  StatusId.PendingHRReviewOfferanduploadEmployementContract,
  StatusId.PendingHRReviewWorkpermitDocs,
  StatusId.PendingHREmploymentContractVerification,
  StatusId.PendingHREmploymentContractReview,
]);

export const EDIT_STATUSES = new Set([
  StatusId.PendingHRBGVInitiation,
  StatusId.PendingHROfferInitiate,
]);
