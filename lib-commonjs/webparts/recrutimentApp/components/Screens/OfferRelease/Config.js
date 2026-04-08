"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDIT_STATUSES = exports.REVIEW_STATUSES = exports.Initiate_STAUES = void 0;
var EvaluationConfig_1 = require("../SelectionProcess/config/EvaluationConfig");
exports.Initiate_STAUES = new Set([
    EvaluationConfig_1.StatusId.PendingHRBGVInitiation,
    EvaluationConfig_1.StatusId.PendingHROfferInitiate,
    EvaluationConfig_1.StatusId.PendingHREmploymentContractInit,
]);
exports.REVIEW_STATUSES = new Set([
    EvaluationConfig_1.StatusId.PendingHRReviewBGCheck,
    EvaluationConfig_1.StatusId.PendingHROfferReview,
    EvaluationConfig_1.StatusId.PendingHRReviewOfferWorkPermitInit,
    EvaluationConfig_1.StatusId.PendingHRReviewOfferanduploadEmployementContract,
    EvaluationConfig_1.StatusId.PendingHRReviewWorkpermitDocs,
    EvaluationConfig_1.StatusId.PendingHREmploymentContractVerification,
    EvaluationConfig_1.StatusId.PendingHREmploymentContractReview,
]);
exports.EDIT_STATUSES = new Set([
    EvaluationConfig_1.StatusId.PendingHRBGVInitiation,
    EvaluationConfig_1.StatusId.PendingHROfferInitiate,
]);
//# sourceMappingURL=Config.js.map