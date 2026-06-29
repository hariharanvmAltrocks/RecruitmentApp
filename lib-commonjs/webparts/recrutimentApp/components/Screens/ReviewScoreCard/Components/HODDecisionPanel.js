"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var Submitreviewscorecard_1 = tslib_1.__importDefault(require("./Submitreviewscorecard"));
var framer_motion_1 = require("framer-motion");
var reuseUI_1 = require("../../CandidateTable/Components/reuseUI");
var ReviewCommentSignature_1 = require("../../RecruitmentTable/Components/ReviewCommentSignature");
var getSignatureDetails_1 = require("../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var _FEEDBACK_LEVEL2_STATUS_IDS = [130, 129];
var HODDecisionPanel = function (_a) {
    var canEdit = _a.canEdit, isLevel2Status = _a.isLevel2Status, statusId = _a.statusId, hodDecision = _a.hodDecision, decisionComment = _a.decisionComment, confirmed = _a.confirmed, selectedPositionId = _a.selectedPositionId, selectedPositionText = _a.selectedPositionText, positionOptions = _a.positionOptions, submitting = _a.submitting, submitError = _a.submitError, successMessage = _a.successMessage, reviewerName = _a.reviewerName, jobTitleEn = _a.jobTitleEn, jobTitleFr = _a.jobTitleFr, userInitial = _a.userInitial, errors = _a.errors, shouldShowPositionId = _a.shouldShowPositionId, onDecisionChange = _a.onDecisionChange, onCommentChange = _a.onCommentChange, onConfirmChange = _a.onConfirmChange, onPositionChange = _a.onPositionChange, onViewComments = _a.onViewComments, onClose = _a.onClose, submitDeps = _a.submitDeps, roleId = _a.roleId;
    var feedbackLabel = _FEEDBACK_LEVEL2_STATUS_IDS.includes(statusId)
        ? "Feedback — Level 2"
        : "Feedback — Level 1";
    var _b = React.useState(false), openPosition = _b[0], setOpenPosition = _b[1];
    var _c = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _c.data, signatureLoading = _c.loading;
    // ── VIEW-ONLY mode ────────────────────────────────────────────────────────
    // ── EDITABLE mode ─────────────────────────────────────────────────────────
    return (React.createElement("div", null,
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
            React.createElement("button", { onClick: onViewComments, className: ReviewScorecard_module_scss_1.default.mSubmitBtn, type: "button" },
                React.createElement(lucide_react_1.FileText, { size: 16 }),
                "VIEW COMMENTS")),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.lmDecisionCard, style: { marginBottom: "4%" } },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.lmDecisionHeader },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.lmDecisionZap },
                    React.createElement(lucide_react_1.Zap, { size: 28, fill: "currentColor" })),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.lmDecisionTitleWrap },
                    React.createElement("h3", { className: ReviewScorecard_module_scss_1.default.lmDecisionTitle }, "Do you wish to select this candidate?"),
                    React.createElement("p", { className: ReviewScorecard_module_scss_1.default.lmDecisionSubtitle }, "As HOD, review the evaluation and provide your decision."))),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.decisionBtnsRow },
                React.createElement("button", { type: "button", className: "".concat(ReviewScorecard_module_scss_1.default.decisionBtn, " ").concat(hodDecision === "Yes"
                        ? ReviewScorecard_module_scss_1.default.decisionBtnYesActive
                        : ReviewScorecard_module_scss_1.default.decisionBtnYesInactive, " ").concat(errors.decision ? ReviewScorecard_module_scss_1.default.mInputErr : ""), onClick: function () { return onDecisionChange("Yes"); } },
                    React.createElement(lucide_react_1.CheckCircle2, { size: 36, strokeWidth: 2, className: hodDecision === "Yes" ? ReviewScorecard_module_scss_1.default.iconWhite : ReviewScorecard_module_scss_1.default.iconGreen }),
                    React.createElement("span", { className: ReviewScorecard_module_scss_1.default.decisionBtnLabel }, "YES, SELECT")),
                React.createElement("button", { type: "button", className: "".concat(ReviewScorecard_module_scss_1.default.decisionBtn, " ").concat(hodDecision === "No"
                        ? ReviewScorecard_module_scss_1.default.decisionBtnNoActive
                        : ReviewScorecard_module_scss_1.default.decisionBtnNoInactive, " ").concat(errors.decision ? ReviewScorecard_module_scss_1.default.mInputErr : ""), onClick: function () { return onDecisionChange("No"); } },
                    React.createElement(lucide_react_1.X, { size: 36, strokeWidth: 2, className: hodDecision === "No" ? ReviewScorecard_module_scss_1.default.iconWhite : ReviewScorecard_module_scss_1.default.iconRed }),
                    React.createElement("span", { className: ReviewScorecard_module_scss_1.default.decisionBtnLabel }, "NO, REJECT")),
                React.createElement("button", { type: "button", className: "".concat(ReviewScorecard_module_scss_1.default.decisionBtn, " ").concat(hodDecision === "On Hold"
                        ? ReviewScorecard_module_scss_1.default.decisionBtnHoldActive
                        : ReviewScorecard_module_scss_1.default.decisionBtnHoldInactive, " ").concat(errors.decision ? ReviewScorecard_module_scss_1.default.mInputErr : ""), onClick: function () { return onDecisionChange("On Hold"); } },
                    React.createElement(lucide_react_1.Activity, { size: 36, strokeWidth: 2, className: hodDecision === "On Hold" ? ReviewScorecard_module_scss_1.default.iconWhite : ReviewScorecard_module_scss_1.default.iconAmber }),
                    React.createElement("span", { className: ReviewScorecard_module_scss_1.default.decisionBtnLabel }, "ON HOLD"))),
            errors.decision && (React.createElement("div", { style: {
                    color: "#ef4444",
                    fontSize: "0.75rem",
                    marginTop: "0.4rem",
                } }, "\u26A0 Please select a decision.")),
            !canEdit && (React.createElement(framer_motion_1.motion.section, { className: ReviewScorecard_module_scss_1.default.section, custom: 4, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.hrFeedbackCard, style: { marginTop: "5%" } },
                    React.createElement(reuseUI_1.SectionHeader, { title: "Assign Position ID", accent: "green" }),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.hrFeedbackFieldWrap },
                        React.createElement("label", { className: "".concat(ReviewScorecard_module_scss_1.default.fieldLabel, " ").concat(errors.position ? ReviewScorecard_module_scss_1.default.mErrLabel : "") },
                            "Assign Position ID",
                            " "),
                        React.createElement("div", { className: "".concat(ReviewScorecard_module_scss_1.default.dropdownWrapper, " dropdown") },
                            React.createElement("div", { className: "".concat(ReviewScorecard_module_scss_1.default.customDropdownTrigger, "\n      ").concat(openPosition ? " ".concat(ReviewScorecard_module_scss_1.default.dropdownOpen) : "", "\n    ") },
                                React.createElement("span", { className: selectedPositionText
                                        ? ReviewScorecard_module_scss_1.default.dropdownSelected
                                        : ReviewScorecard_module_scss_1.default.dropdownPlaceholder }, selectedPositionText),
                                React.createElement(lucide_react_1.ChevronDown, { size: 18, className: "".concat(ReviewScorecard_module_scss_1.default.dropdownChevron, " ").concat(openPosition ? ReviewScorecard_module_scss_1.default.open : "") }))))))),
            canEdit && shouldShowPositionId(statusId, hodDecision) && (React.createElement(framer_motion_1.motion.section, { className: ReviewScorecard_module_scss_1.default.section, custom: 4, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.hrFeedbackCard, style: { marginTop: "5%" } },
                    React.createElement(reuseUI_1.SectionHeader, { title: "Assign Position ID", accent: "green" }),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.hrFeedbackFieldWrap },
                        React.createElement("label", { className: "".concat(ReviewScorecard_module_scss_1.default.fieldLabel, " ").concat(errors.position ? ReviewScorecard_module_scss_1.default.mErrLabel : "") },
                            "Assign Position ID",
                            " ",
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.fieldRequired }, "*"),
                            errors.position && (React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mErrText }, " \u2014 Required"))),
                        React.createElement("div", { className: "".concat(ReviewScorecard_module_scss_1.default.dropdownWrapper, " dropdown") },
                            React.createElement("div", { className: "".concat(ReviewScorecard_module_scss_1.default.customDropdownTrigger, "\n      ").concat(openPosition ? " ".concat(ReviewScorecard_module_scss_1.default.dropdownOpen) : "", "\n    "), onClick: function () { return setOpenPosition(!openPosition); } },
                                React.createElement("span", { className: selectedPositionText
                                        ? ReviewScorecard_module_scss_1.default.dropdownSelected
                                        : ReviewScorecard_module_scss_1.default.dropdownPlaceholder }, selectedPositionText
                                    ? selectedPositionText
                                    : "Select a position…"),
                                React.createElement(lucide_react_1.ChevronDown, { size: 18, className: "".concat(ReviewScorecard_module_scss_1.default.dropdownChevron, " ").concat(openPosition ? ReviewScorecard_module_scss_1.default.open : "") })),
                            React.createElement(framer_motion_1.AnimatePresence, null, openPosition && positionOptions && (React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: ReviewScorecard_module_scss_1.default.dropdownMenu }, positionOptions.length > 0 ? (positionOptions.map(function (opt) { return (React.createElement("div", { key: opt.key, onClick: function () {
                                    onPositionChange(opt.key, opt.text || "");
                                    setOpenPosition(false); // ✅ closes after selection
                                }, className: "".concat(ReviewScorecard_module_scss_1.default.dropdownOption, " ").concat(selectedPositionId === opt.key
                                    ? ReviewScorecard_module_scss_1.default.dropdownOptionActive
                                    : "") }, opt.text)); })) : (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mNoData }, "No positions available."))))))))))),
        canEdit && (React.createElement(React.Fragment, null,
            React.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: decisionComment, acknowledgementCheckbox: confirmed, signatureDetails: signatureDetails, isLoading: signatureLoading, onCommentsChange: function (value) { return onCommentChange(value); }, onToggleAcknowledgement: function (value) { return onConfirmChange(value); }, ReviewLabel: "FEEDBACK - LEVEL 2", acknowledgementLabel: ConditionConfig_1.CheckboxContent.HODscorecarddetails }),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFooter },
                React.createElement(Submitreviewscorecard_1.default, tslib_1.__assign({ roleId: roleId, onClose: onClose }, submitDeps)))))));
};
exports.default = HODDecisionPanel;
//# sourceMappingURL=HODDecisionPanel.js.map