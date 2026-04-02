"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var _FEEDBACK_LEVEL2_STATUS_IDS = [130, 129];
var HODDecisionPanel = function (_a) {
    var canEdit = _a.canEdit, isLevel2Status = _a.isLevel2Status, statusId = _a.statusId, hodDecision = _a.hodDecision, decisionComment = _a.decisionComment, confirmed = _a.confirmed, selectedPositionId = _a.selectedPositionId, selectedPositionText = _a.selectedPositionText, positionOptions = _a.positionOptions, submitting = _a.submitting, submitError = _a.submitError, successMessage = _a.successMessage, reviewerName = _a.reviewerName, jobTitleEn = _a.jobTitleEn, jobTitleFr = _a.jobTitleFr, userInitial = _a.userInitial, errors = _a.errors, shouldShowPositionId = _a.shouldShowPositionId, onDecisionChange = _a.onDecisionChange, onCommentChange = _a.onCommentChange, onConfirmChange = _a.onConfirmChange, onPositionChange = _a.onPositionChange, onViewComments = _a.onViewComments, onSubmit = _a.onSubmit, onClose = _a.onClose;
    var feedbackLabel = _FEEDBACK_LEVEL2_STATUS_IDS.includes(statusId)
        ? "Feedback — Level 2"
        : "Feedback — Level 1";
    if (!canEdit) {
        return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionCard, style: { borderColor: "#e2e8f0", background: "#f8fafc" } },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionHeader },
                React.createElement(lucide_react_1.Eye, { size: 22, color: "#2563eb" }),
                React.createElement("div", null,
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionTitle }, "HOD Decision (Submitted)"),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionSub }, "This candidate has already been reviewed."))),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
                React.createElement("button", { onClick: onViewComments, className: ReviewScorecard_module_scss_1.default.mActionBtn },
                    React.createElement(lucide_react_1.FileText, { size: 16 }),
                    " VIEW COMMENTS")),
            hodDecision && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
                React.createElement("label", { className: ReviewScorecard_module_scss_1.default.mFormLabel }, "Decision"),
                React.createElement("div", { style: {
                        padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: 700,
                        fontSize: "0.875rem", display: "inline-block",
                        background: hodDecision === "Yes" ? "#f0fdf4" : hodDecision === "No" ? "#fef2f2" : "#fffbeb",
                        color: hodDecision === "Yes" ? "#16a34a" : hodDecision === "No" ? "#dc2626" : "#d97706",
                    } }, hodDecision === "Yes" ? "✓ SELECTED" : hodDecision === "No" ? "✗ REJECTED" : "⏸ ON HOLD"))),
            selectedPositionText && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
                React.createElement("label", { className: ReviewScorecard_module_scss_1.default.mFormLabel }, "Assigned Position ID"),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mfValue }, selectedPositionText))),
            decisionComment && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
                React.createElement("label", { className: ReviewScorecard_module_scss_1.default.mFormLabel }, feedbackLabel),
                React.createElement("div", { style: {
                        background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "0.5rem",
                        padding: "0.75rem", fontSize: "0.875rem", color: "#334155",
                    } }, decisionComment))),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFooter },
                React.createElement("button", { onClick: onClose, className: ReviewScorecard_module_scss_1.default.mCancelBtn }, "CLOSE"))));
    }
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionCard },
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionHeader },
            React.createElement(lucide_react_1.Zap, { size: 22, color: "#f59e0b", fill: "#f59e0b" }),
            React.createElement("div", null,
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionTitle }, "Do you wish to select this candidate?"),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionSub }, "As HOD, review the evaluation and provide your decision."))),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mDecisionGrid }, ([
            { val: "Yes", cls: ReviewScorecard_module_scss_1.default.mDCardYes, Icon: lucide_react_1.CheckCircle2, label: "YES, SELECT" },
            { val: "No", cls: ReviewScorecard_module_scss_1.default.mDCardNo, Icon: lucide_react_1.X, label: "NO, REJECT" },
            { val: "On Hold", cls: ReviewScorecard_module_scss_1.default.mDCardHold, Icon: lucide_react_1.Activity, label: "ON HOLD" },
        ]).map(function (_a) {
            var val = _a.val, cls = _a.cls, Icon = _a.Icon, label = _a.label;
            return (React.createElement("button", { key: val, className: "".concat(ReviewScorecard_module_scss_1.default.mDCard, " ").concat(hodDecision === val ? cls : "", " ").concat(errors.decision ? ReviewScorecard_module_scss_1.default.mInputErr : ""), onClick: function () { return onDecisionChange(val); } },
                React.createElement(Icon, { size: 28 }),
                React.createElement("span", null, label)));
        })),
        errors.decision && (React.createElement("div", { style: { color: "#ef4444", fontSize: "0.75rem", marginBottom: "0.5rem" } }, "\u26A0 Please select a decision.")),
        successMessage && (React.createElement("div", { style: {
                background: "#dcfce7", border: "1px solid #22c55e", color: "#166534",
                padding: "0.6rem 0.8rem", borderRadius: "0.45rem", marginBottom: "0.75rem", fontWeight: 600,
            } }, successMessage)),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
            React.createElement("button", { onClick: onViewComments, className: ReviewScorecard_module_scss_1.default.mActionBtn },
                React.createElement(lucide_react_1.FileText, { size: 16 }),
                " VIEW COMMENTS")),
        shouldShowPositionId(statusId, hodDecision) && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
            React.createElement("label", { className: "".concat(ReviewScorecard_module_scss_1.default.mFormLabel, " ").concat(errors.position ? ReviewScorecard_module_scss_1.default.mErrLabel : "") },
                "Assign Position ID ",
                React.createElement("span", { style: { color: "#ef4444" } }, "*"),
                errors.position && React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mErrText }, " \u2014 Required")),
            React.createElement("select", { className: "".concat(ReviewScorecard_module_scss_1.default.mSelect, " ").concat(errors.position ? ReviewScorecard_module_scss_1.default.mInputErr : ""), value: selectedPositionId !== null && selectedPositionId !== void 0 ? selectedPositionId : "", onChange: function (e) {
                    var v = Number(e.target.value) || null;
                    var opt = positionOptions.find(function (o) { return o.key === v; });
                    onPositionChange(v, (opt === null || opt === void 0 ? void 0 : opt.text) || "");
                } },
                React.createElement("option", { value: "" }, "Select a position\u2026"),
                positionOptions.map(function (opt) { return (React.createElement("option", { key: opt.key, value: opt.key }, opt.text || "#".concat(opt.key))); })),
            positionOptions.length === 0 && (React.createElement("p", { className: ReviewScorecard_module_scss_1.default.mNoData, style: { marginTop: 6 } }, "No positions available.")))),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
            React.createElement("label", { className: "".concat(ReviewScorecard_module_scss_1.default.mFormLabel, " ").concat(errors.comment ? ReviewScorecard_module_scss_1.default.mErrLabel : "") },
                feedbackLabel,
                " ",
                React.createElement("span", { style: { color: "#ef4444" } }, "*"),
                errors.comment && React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mErrText }, " \u2014 Required")),
            React.createElement("textarea", { className: "".concat(ReviewScorecard_module_scss_1.default.mTextarea, " ").concat(errors.comment ? ReviewScorecard_module_scss_1.default.mInputErr : ""), placeholder: "Provide your final decision rationale...", value: decisionComment, onChange: function (e) { return onCommentChange(e.target.value); } })),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
            React.createElement("label", { className: ReviewScorecard_module_scss_1.default.mCheckboxRow },
                React.createElement("input", { type: "checkbox", checked: confirmed, onChange: function (e) { return onConfirmChange(e.target.checked); } }),
                React.createElement("span", null, "I confirm that the above decision is accurate and in line with the evaluation of the candidate's scorecard details.")),
            errors.checkbox && (React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mCheckboxErrText }, "\u26A0 You must confirm before submitting."))),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.reviewerCard },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.reviewerAvatar }, userInitial || ""),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.reviewerInfo },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.reviewerCol },
                        React.createElement("p", { className: ReviewScorecard_module_scss_1.default.reviewerMeta }, "REVIEWER NAME"),
                        React.createElement("p", { className: ReviewScorecard_module_scss_1.default.reviewerVal }, reviewerName || "")),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.reviewerCol },
                        React.createElement("p", { className: ReviewScorecard_module_scss_1.default.reviewerMeta }, "JOB TITLE (EN)"),
                        React.createElement("p", { className: ReviewScorecard_module_scss_1.default.reviewerVal }, jobTitleEn || ""),
                        React.createElement("p", { className: ReviewScorecard_module_scss_1.default.reviewerMeta, style: { marginTop: 12 } }, "JOB TITLE (FR)"),
                        React.createElement("p", { className: ReviewScorecard_module_scss_1.default.reviewerVal }, jobTitleFr || ""))))),
        submitError && React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSubmitError }, submitError),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFooter },
            React.createElement("button", { onClick: onClose, className: ReviewScorecard_module_scss_1.default.mCancelBtn, disabled: submitting }, "CANCEL"),
            React.createElement("button", { className: ReviewScorecard_module_scss_1.default.mSubmitBtn, onClick: onSubmit, disabled: submitting || !hodDecision }, submitting
                ? "Submitting…"
                : React.createElement(React.Fragment, null,
                    React.createElement(lucide_react_1.CheckCircle2, { size: 15, style: { marginRight: 6 } }),
                    " SUBMIT ACTION")))));
};
exports.default = HODDecisionPanel;
//# sourceMappingURL=HODDecisionPanel.js.map