"use strict";
// Components/Submitreviewscorecard.tsx
// Popup flows:
//  SUBMIT click  → Confirm popup → OK → API → Success popup → close+refresh
//  SUBMIT click  → Confirm popup → OK → Validation fails → Validation popup
//  CANCEL click  → "Are you sure to leave?" popup → OK → onClose()
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var useSubmitReviewScoreCard_1 = require("./useSubmitReviewScoreCard");
var Confirmationpopup_1 = tslib_1.__importDefault(require("../Confirmationpopup"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var SubmitReviewScoreCard = function (_a) {
    var roleId = _a.roleId, _b = _a.compact, compact = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? '' : _c, onClose = _a.onClose, hookDeps = tslib_1.__rest(_a, ["roleId", "compact", "className", "onClose"]);
    var _d = (0, useSubmitReviewScoreCard_1.useSubmitReviewScoreCard)(hookDeps), submitting = _d.submitting, submitError = _d.submitError, successMessage = _d.successMessage, errors = _d.errors, validationErrors = _d.validationErrors, submitDecision = _d.submitDecision, resetSubmit = _d.resetSubmit, runValidation = _d.runValidation;
    // ── Popup visibility state ────────────────────────────────────────────────
    var _e = React.useState(false), showSubmitConfirm = _e[0], setShowSubmitConfirm = _e[1];
    var _f = React.useState(false), showCancelConfirm = _f[0], setShowCancelConfirm = _f[1];
    var _g = React.useState(false), showValidation = _g[0], setShowValidation = _g[1];
    var _h = React.useState(false), showSuccess = _h[0], setShowSuccess = _h[1];
    // Show success popup when hook sets successMessage
    React.useEffect(function () {
        if (successMessage)
            setShowSuccess(true);
    }, [successMessage]);
    // ── SUBMIT button clicked → validate first, then show confirm popup ───────
    var handleSubmitClick = React.useCallback(function () {
        var valid = runValidation();
        if (!valid) {
            setShowValidation(true); // show validation popup
            return;
        }
        setShowSubmitConfirm(true); // show confirm popup
    }, [runValidation]);
    // ── User confirmed submit ─────────────────────────────────────────────────
    var handleSubmitConfirmed = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setShowSubmitConfirm(false);
                    return [4 /*yield*/, submitDecision(roleId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [submitDecision, roleId]);
    // ── Success popup closed → run onSuccess (close modal + refresh) ──────────
    var handleSuccessClose = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setShowSuccess(false);
                    resetSubmit();
                    return [4 /*yield*/, hookDeps.onSuccess()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [hookDeps, resetSubmit]);
    // ── CANCEL button clicked → show leave confirmation ───────────────────────
    var handleCancelClick = React.useCallback(function () {
        setShowCancelConfirm(true);
    }, []);
    // ── User confirmed leave ──────────────────────────────────────────────────
    var handleLeaveConfirmed = React.useCallback(function () {
        setShowCancelConfirm(false);
        onClose();
    }, [onClose]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: className, style: { display: 'flex', gap: '0.75rem', alignItems: 'center' } },
            React.createElement("button", { className: ReviewScorecard_module_scss_1.default.mCancelBtn, onClick: handleCancelClick, disabled: submitting, type: "button" }, strings.Cancel1),
            React.createElement("button", { className: ReviewScorecard_module_scss_1.default.mSubmitBtn, onClick: handleSubmitClick, disabled: submitting || !hookDeps.hodDecision, type: "button", style: { alignSelf: 'flex-end' } }, submitting ? ('Submitting…') : compact ? (React.createElement(lucide_react_1.CheckCircle2, { size: 15 })) : (React.createElement(React.Fragment, null,
                React.createElement(lucide_react_1.CheckCircle2, { size: 15, style: { marginRight: 6 } }),
                strings.SubmitAction1)))),
        submitError && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSubmitError, style: { marginTop: '0.5rem' } }, submitError)),
        React.createElement(Confirmationpopup_1.default, { type: "submit", open: showSubmitConfirm, onConfirm: handleSubmitConfirmed, onClose: function () { return setShowSubmitConfirm(false); } }),
        React.createElement(Confirmationpopup_1.default, { type: "cancel", open: showCancelConfirm, onConfirm: handleLeaveConfirmed, onClose: function () { return setShowCancelConfirm(false); } }),
        React.createElement(Confirmationpopup_1.default, { type: "validation", open: showValidation, validationErrors: validationErrors, onClose: function () { return setShowValidation(false); } }),
        React.createElement(Confirmationpopup_1.default, { type: "success", open: showSuccess, successMessage: successMessage, onClose: handleSuccessClose })));
};
exports.default = SubmitReviewScoreCard;
//# sourceMappingURL=Submitreviewscorecard.js.map