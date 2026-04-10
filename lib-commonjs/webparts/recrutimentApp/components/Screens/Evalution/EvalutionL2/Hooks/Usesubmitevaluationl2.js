"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubmitEvaluationL2 = useSubmitEvaluationL2;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var RoleContext_1 = require("../../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../../utilities/Config");
function useSubmitEvaluationL2(deps) {
    var _this = this;
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    // FIX 3: destructure panelId here so it's stable in dep arrays
    var candidateId = deps.candidateId, panelId = deps.panelId, onSuccess = deps.onSuccess;
    var _a = (0, react_1.useState)(""), comments = _a[0], setComments = _a[1];
    var _b = (0, react_1.useState)(false), acknowledgementCheckbox = _b[0], setAcknowledgementCheckbox = _b[1];
    var _c = (0, react_1.useState)(false), commentError = _c[0], setCommentError = _c[1];
    var _d = (0, react_1.useState)(false), checkboxError = _d[0], setCheckboxError = _d[1];
    // FIX 4: dedicated error state for API/submit failures — never pollutes field errors
    var _e = (0, react_1.useState)(""), submitError = _e[0], setSubmitError = _e[1];
    var _f = (0, react_1.useState)(false), submitting = _f[0], setSubmitting = _f[1];
    var isSubmittingRef = (0, react_1.useRef)(false);
    var onCommentsChange = (0, react_1.useCallback)(function (value) {
        setComments(value);
        if (value.trim())
            setCommentError(false);
    }, []);
    var onToggleAcknowledgement = (0, react_1.useCallback)(function (checked) {
        setAcknowledgementCheckbox(checked);
        if (checked)
            setCheckboxError(false);
    }, []);
    var handleSubmitClick = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var valid, isLineManagerOrHOD, roleId, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    valid = true;
                    if (!comments.trim()) {
                        setCommentError(true);
                        valid = false;
                    }
                    else {
                        setCommentError(false);
                    }
                    if (!acknowledgementCheckbox) {
                        setCheckboxError(true);
                        valid = false;
                    }
                    else {
                        setCheckboxError(false);
                    }
                    if (!valid)
                        return [2 /*return*/];
                    if (isSubmittingRef.current)
                        return [2 /*return*/];
                    isSubmittingRef.current = true;
                    setSubmitting(true);
                    setSubmitError("");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    isLineManagerOrHOD = roleIDs.includes(Config_1.RoleID.LineManager) || roleIDs.includes(Config_1.RoleID.HOD);
                    roleId = isLineManagerOrHOD ? Config_1.RoleID.LineManager : roleIDs[0];
                    return [4 /*yield*/, ServiceExport_1.EvaluationserviceL2.submitEvaluationL2({
                            candidateId: candidateId,
                            panelId: deps.panelId,
                            comments: {
                                Comments: comments.trim(),
                                CandidateIDId: candidateId,
                                RoleId: roleId,
                                level: "Level 2",
                            },
                        })];
                case 2:
                    _a.sent();
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("[useSubmitEvaluationL2] submit error:", error_1);
                    // FIX 4: use submitError — never set commentError on API failure
                    setSubmitError("Submission failed. Please try again or contact support.");
                    return [3 /*break*/, 5];
                case 4:
                    isSubmittingRef.current = false;
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        comments,
        acknowledgementCheckbox,
        candidateId,
        panelId,
        roleIDs,
        onSuccess,
    ]);
    var handleCancelClick = (0, react_1.useCallback)(function () {
        if (isSubmittingRef.current)
            return;
        setComments("");
        setAcknowledgementCheckbox(false);
        setCommentError(false);
        setCheckboxError(false);
        setSubmitError("");
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    }, [onSuccess]);
    return {
        comments: comments,
        acknowledgementCheckbox: acknowledgementCheckbox,
        commentError: commentError,
        checkboxError: checkboxError,
        submitError: submitError,
        submitting: submitting,
        isSubmittingRef: isSubmittingRef,
        onCommentsChange: onCommentsChange,
        onToggleAcknowledgement: onToggleAcknowledgement,
        handleSubmitClick: handleSubmitClick,
        handleCancelClick: handleCancelClick,
    };
}
//# sourceMappingURL=Usesubmitevaluationl2.js.map