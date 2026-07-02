"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDIT_STATUSES = exports.REVIEW_STATUSES = exports.Initiate_STAUES = void 0;
var Config_1 = require("../../../utilities/Config");
exports.Initiate_STAUES = new Set([
    Config_1.StatusId.PendingHRBGVInitiation,
    Config_1.StatusId.PendingHROfferInitiate,
    Config_1.StatusId.PendingHREmploymentContractInit,
]);
exports.REVIEW_STATUSES = new Set([
    Config_1.StatusId.PendingHRReviewBGCheck,
    Config_1.StatusId.PendingHROfferReview,
    Config_1.StatusId.PendingHRReviewOfferWorkPermitInit,
    Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract,
    Config_1.StatusId.PendingHRReviewWorkpermitDocs,
    Config_1.StatusId.PendingHREmploymentContractVerification,
    Config_1.StatusId.PendingHREmploymentContractReview,
]);
exports.EDIT_STATUSES = new Set([
    Config_1.StatusId.PendingHRBGVInitiation,
    Config_1.StatusId.PendingHROfferInitiate,
]);
//# sourceMappingURL=Config.js.map