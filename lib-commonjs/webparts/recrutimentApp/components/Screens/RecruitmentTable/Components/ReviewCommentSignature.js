"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewCommentSignature = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
require("../AdvertReviewDrawer/AdvertReviewDrawer.scss");
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var ReviewCommentSignature = function (_a) {
    var _b;
    var reviewerComments = _a.reviewerComments, acknowledgementCheckbox = _a.acknowledgementCheckbox, signatureDetails = _a.signatureDetails, isLoading = _a.isLoading, onCommentsChange = _a.onCommentsChange, onToggleAcknowledgement = _a.onToggleAcknowledgement, _c = _a.commentError, commentError = _c === void 0 ? false : _c, _d = _a.checkboxError, checkboxError = _d === void 0 ? false : _d, _e = _a.disabled, disabled = _e === void 0 ? false : _e;
    return (react_1.default.createElement("section", { className: "advert-review-drawer__section advert-review-drawer__section--comments" },
        react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
            react_1.default.createElement(lucide_react_1.MessageSquare, { size: 12 }),
            "Reviewer Comments"),
        react_1.default.createElement("textarea", { className: [
                "advert-review-drawer__textarea",
                commentError ? "advert-review-drawer__textarea--error" : "",
            ]
                .filter(Boolean)
                .join(" "), placeholder: "Add your feedback or notes here...", value: reviewerComments, onChange: function (e) { return onCommentsChange(e.target.value); }, rows: 4, disabled: disabled }),
        commentError && (react_1.default.createElement("span", { className: "advert-review-drawer__field-error" }, "Reviewer comment is required.")),
        react_1.default.createElement("div", { className: "advert-review-drawer__signature" },
            react_1.default.createElement("label", { className: [
                    "advert-review-drawer__acknowledge",
                    checkboxError ? "advert-review-drawer__acknowledge--error" : "",
                ]
                    .filter(Boolean)
                    .join(" ") },
                react_1.default.createElement("span", { className: [
                        "advert-review-drawer__checkbox",
                        acknowledgementCheckbox ? "is-checked" : "",
                    ]
                        .filter(Boolean)
                        .join(" ") },
                    react_1.default.createElement("input", { type: "checkbox", checked: acknowledgementCheckbox, onChange: function (e) { return onToggleAcknowledgement(e.target.checked); }, disabled: disabled }),
                    react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 12 })),
                react_1.default.createElement("span", null, "I hereby acknowledge that I have reviewed the job advertisement details and attachments, and I confirm that the information is accurate and ready for publication.")),
            checkboxError && (react_1.default.createElement("span", { className: "advert-review-drawer__field-error" }, "Please acknowledge before approving.")),
            react_1.default.createElement("div", { className: "advert-review-drawer__signature-details" },
                react_1.default.createElement("div", { className: "advert-review-drawer__avatar" }, isLoading ? "" : ((_b = signatureDetails === null || signatureDetails === void 0 ? void 0 : signatureDetails.reviewerInitial) !== null && _b !== void 0 ? _b : "JD")),
                react_1.default.createElement("div", { className: "advert-review-drawer__signature-meta" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "advert-review-drawer__signature-label" }, "Reviewer Name"),
                        react_1.default.createElement("div", { className: "advert-review-drawer__signature-value" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "120px" })) : (signatureDetails === null || signatureDetails === void 0 ? void 0 : signatureDetails.reviewerName))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "advert-review-drawer__signature-label" }, "Job Title (EN)"),
                        react_1.default.createElement("div", { className: "advert-review-drawer__signature-value" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "140px" })) : (signatureDetails === null || signatureDetails === void 0 ? void 0 : signatureDetails.jobTitleEN))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "advert-review-drawer__signature-label" }, "Job Title (FR)"),
                        react_1.default.createElement("div", { className: "advert-review-drawer__signature-value" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "160px" })) : (signatureDetails === null || signatureDetails === void 0 ? void 0 : signatureDetails.jobTitleFR))))))));
};
exports.ReviewCommentSignature = ReviewCommentSignature;
//# sourceMappingURL=ReviewCommentSignature.js.map