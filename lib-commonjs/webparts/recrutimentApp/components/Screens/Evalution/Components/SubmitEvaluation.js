"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Evalution_module_scss_1 = tslib_1.__importDefault(require("../Evalution.module.scss"));
var Confirmationpopup_1 = tslib_1.__importDefault(require("../../ReviewScoreCard/Confirmationpopup"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var SubmitEvaluation = function (_a) {
    var submitHook = _a.submitHook, acknowledged = _a.acknowledged, onCancel = _a.onCancel;
    var submitting = submitHook.submitting, submitError = submitHook.submitError, successMessage = submitHook.successMessage, validationErrors = submitHook.validationErrors, runValidation = submitHook.runValidation, submitEval = submitHook.submitEval, resetSubmit = submitHook.resetSubmit, onSuccess = submitHook.onSuccess;
    var _b = React.useState(false), showSubmitConfirm = _b[0], setShowSubmitConfirm = _b[1];
    var _c = React.useState(false), showCancelConfirm = _c[0], setShowCancelConfirm = _c[1];
    var _d = React.useState(false), showValidation = _d[0], setShowValidation = _d[1];
    var _e = React.useState(false), showSuccess = _e[0], setShowSuccess = _e[1];
    React.useEffect(function () {
        if (successMessage)
            setShowSuccess(true);
    }, [successMessage]);
    var handleSubmitClick = React.useCallback(function () {
        var valid = runValidation();
        if (!valid) {
            setShowValidation(true);
            return;
        }
        setShowSubmitConfirm(true);
    }, [runValidation]);
    var handleSubmitConfirmed = React.useCallback(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setShowSubmitConfirm(false);
                    return [4 /*yield*/, submitEval()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [submitEval]);
    var handleSuccessClose = React.useCallback(function () {
        setShowSuccess(false);
        resetSubmit();
        onSuccess();
    }, [resetSubmit, onSuccess]);
    var handleCancelClick = React.useCallback(function () {
        setShowCancelConfirm(true);
    }, []);
    var handleLeaveConfirmed = React.useCallback(function () {
        setShowCancelConfirm(false);
        onCancel();
    }, [onCancel]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: Evalution_module_scss_1.default.footer },
            submitError && (React.createElement("span", { className: Evalution_module_scss_1.default.inlineError }, submitError)),
            React.createElement("button", { className: Evalution_module_scss_1.default.cancelBtn, onClick: handleCancelClick, disabled: submitting, type: "button" }, strings.Cancel),
            React.createElement("button", { className: Evalution_module_scss_1.default.submitBtn, onClick: handleSubmitClick, disabled: submitting || !acknowledged, type: "button" }, submitting ? "Submitting…" : strings.SubmitEvaluation)),
        React.createElement(Confirmationpopup_1.default, { type: "submit", open: showSubmitConfirm, onConfirm: handleSubmitConfirmed, onClose: function () { return setShowSubmitConfirm(false); } }),
        React.createElement(Confirmationpopup_1.default, { type: "cancel", open: showCancelConfirm, onConfirm: handleLeaveConfirmed, onClose: function () { return setShowCancelConfirm(false); } }),
        React.createElement(Confirmationpopup_1.default, { type: "validation", open: showValidation, validationErrors: validationErrors, onClose: function () { return setShowValidation(false); } }),
        React.createElement(Confirmationpopup_1.default, { type: "success", open: showSuccess, successMessage: successMessage, onClose: handleSuccessClose })));
};
exports.default = SubmitEvaluation;
//# sourceMappingURL=Submitevaluation.js.map