"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var useSubmitReviewScoreCard_1 = require("./useSubmitReviewScoreCard");
var SubmitReviewScoreCard = function (_a) {
    var roleId = _a.roleId, _b = _a.compact, compact = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? '' : _c, hookDeps = tslib_1.__rest(_a, ["roleId", "compact", "className"]);
    var _d = (0, useSubmitReviewScoreCard_1.useSubmitReviewScoreCard)(hookDeps), submitting = _d.submitting, submitError = _d.submitError, successMessage = _d.successMessage, errors = _d.errors, submitDecision = _d.submitDecision;
    var handleClick = React.useCallback(function () {
        void submitDecision(roleId);
    }, [submitDecision, roleId]);
    return (React.createElement("div", { className: className, style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' } },
        successMessage && (React.createElement("div", { style: {
                background: '#dcfce7',
                border: '1px solid #22c55e',
                color: '#166534',
                padding: '0.6rem 0.8rem',
                borderRadius: '0.45rem',
                fontWeight: 600,
                fontSize: '0.875rem',
            } }, successMessage)),
        submitError && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSubmitError }, submitError)),
        (errors.decision || errors.comment || errors.checkbox || errors.position) && (React.createElement("ul", { style: { margin: 0, padding: '0 0 0 1.1rem', color: '#ef4444', fontSize: '0.75rem' } },
            errors.decision && React.createElement("li", null, "Please select a decision (Yes / No / On Hold)."),
            errors.comment && React.createElement("li", null, "Feedback / comment is required."),
            errors.checkbox && React.createElement("li", null, "Please confirm the decision by checking the checkbox."),
            errors.position && React.createElement("li", null, "Please assign a Position ID for the selected candidate."))),
        React.createElement("button", { className: ReviewScorecard_module_scss_1.default.mSubmitBtn, onClick: handleClick, disabled: submitting || !hookDeps.hodDecision, style: { alignSelf: 'flex-end' } }, submitting ? ('Submitting…') : compact ? (React.createElement(lucide_react_1.CheckCircle2, { size: 15 })) : (React.createElement(React.Fragment, null,
            React.createElement(lucide_react_1.CheckCircle2, { size: 15, style: { marginRight: 6 } }),
            "SUBMIT ACTION")))));
};
exports.default = SubmitReviewScoreCard;
//# sourceMappingURL=Submitreviewscorecard.js.map