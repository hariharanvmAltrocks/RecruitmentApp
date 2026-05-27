"use strict";
// Components/useSubmitEvaluation.ts
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors useSubmitReviewScoreCard pattern exactly.
// Validation → returns ValidationError[] for popup display.
// submit / reset / validate logic is self-contained.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubmitEvaluation = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Evaluationformservice_1 = require("../Evaluationservice/Evaluationformservice");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
// ── Hook ──────────────────────────────────────────────────────────────────────
function useSubmitEvaluation(deps) {
    var _this = this;
    var candidateId = deps.candidateId, candidate = deps.candidate, questions = deps.questions, answers = deps.answers, scorecard = deps.scorecard, recommendation = deps.recommendation, overallFeedback = deps.overallFeedback, evaluationFeedback = deps.evaluationFeedback, shouldShowTextArea = deps.shouldShowTextArea, acknowledged = deps.acknowledged, onSuccess = deps.onSuccess;
    var _a = React.useState(false), submitting = _a[0], setSubmitting = _a[1];
    var _b = React.useState(""), submitError = _b[0], setSubmitError = _b[1];
    var _c = React.useState(""), successMessage = _c[0], setSuccessMessage = _c[1];
    var _d = React.useState([]), validationErrors = _d[0], setValidationErrors = _d[1];
    var _e = React.useState({}), ratingErrors = _e[0], setRatingErrors = _e[1];
    var _f = React.useState({}), scorecardErrors = _f[0], setScorecardErrors = _f[1];
    var _g = React.useState(false), recError = _g[0], setRecError = _g[1];
    var _h = React.useState(false), feedbackError = _h[0], setFeedbackError = _h[1];
    var _j = React.useState(false), evalFeedbackError = _j[0], setEvalFeedbackError = _j[1];
    var _k = React.useState(false), ackError = _k[0], setAckError = _k[1];
    // ── Reset ─────────────────────────────────────────────────────────────────
    var resetSubmit = React.useCallback(function () {
        setSubmitting(false);
        setSubmitError("");
        setSuccessMessage("");
        setValidationErrors([]);
        setRatingErrors({});
        setScorecardErrors({});
        setRecError(false);
        setFeedbackError(false);
        setEvalFeedbackError(false);
        setAckError(false);
    }, []);
    // ── Validate → build ValidationError list ────────────────────────────────
    var runValidation = React.useCallback(function () {
        var errors = [];
        // 1. Per-question ratings
        var newRatingErrors = {};
        questions.forEach(function (q, idx) {
            var _a;
            if (((_a = answers[q.id]) === null || _a === void 0 ? void 0 : _a.rating) == null) {
                newRatingErrors[q.id] = true;
                errors.push({
                    field: "Q".concat(idx + 1),
                    message: "Question ".concat(idx + 1, ": Rating is required"),
                });
            }
        });
        setRatingErrors(newRatingErrors);
        // 2. Scorecard fields
        var newScorecardErrors = {};
        Object.keys(scorecard).forEach(function (key) {
            if (scorecard[key] === null) {
                newScorecardErrors[key] = true;
                errors.push({
                    field: key,
                    message: "Scorecard \u2014 ".concat(key.replace(/([A-Z])/g, " $1").trim(), " is required"),
                });
            }
        });
        setScorecardErrors(newScorecardErrors);
        // 3. Recommendation
        if (!recommendation) {
            setRecError(true);
            errors.push({
                field: "recommendation",
                message: "Consider for Employment: selection is required",
            });
        }
        else {
            setRecError(false);
        }
        // 4. Conditional eval feedback (shown when any scorecard score ≤ 2)
        if (shouldShowTextArea && !evaluationFeedback.trim()) {
            setEvalFeedbackError(true);
            errors.push({
                field: "evaluationFeedback",
                message: "Feedback for ratings below 3 is required",
            });
        }
        else {
            setEvalFeedbackError(false);
        }
        // 5. Overall feedback
        if (!overallFeedback.trim()) {
            setFeedbackError(true);
            errors.push({
                field: "overallFeedback",
                message: "Overall Evaluation Feedback is required",
            });
        }
        else {
            setFeedbackError(false);
        }
        // 6. Acknowledgement checkbox
        if (!acknowledged) {
            setAckError(true);
            errors.push({
                field: "acknowledged",
                message: "Please tick the acknowledgement checkbox",
            });
        }
        else {
            setAckError(false);
        }
        setValidationErrors(errors);
        return errors.length === 0;
    }, [
        questions,
        answers,
        scorecard,
        recommendation,
        shouldShowTextArea,
        evaluationFeedback,
        overallFeedback,
        acknowledged,
    ]);
    // ── Submit ───────────────────────────────────────────────────────────────
    var submitEval = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentRoleIDs, roleId, questionScoresFormatted, result, err_1;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(candidate === null || candidate === void 0 ? void 0 : candidate.currentUserPanelId)) {
                        setSubmitError("Could not identify your panel entry. Please contact HR.");
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    setSubmitError("");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    currentRoleIDs = candidate.currentRoleIDs || [4];
                    roleId = currentRoleIDs.includes(4) ? 4 : currentRoleIDs[0] || 0;
                    questionScoresFormatted = questions.map(function (q, idx) {
                        var _a;
                        var _b, _c;
                        return (_a = {},
                            _a["Q".concat(idx + 1)] = (_c = (_b = answers[q.id]) === null || _b === void 0 ? void 0 : _b.rating) !== null && _c !== void 0 ? _c : 0,
                            _a);
                    });
                    return [4 /*yield*/, (0, Evaluationformservice_1.submitScorecard)({
                            recruitmentId: candidate.recruitmentId,
                            panelId: candidate.currentUserPanelId,
                            roleId: roleId,
                            interviewPersonNameId: (_a = candidate.currentUserGuid) !== null && _a !== void 0 ? _a : "",
                            qualifications: scorecard.Qualifications,
                            experience: scorecard.Experience,
                            knowledge: scorecard.Knowledge,
                            energyLevel: scorecard.EnergyLevel,
                            jobRequirements: scorecard.JobRequirements,
                            cultureFit: scorecard.CultureFit,
                            expatLocal: scorecard.ExpatLocal,
                            otherCriteria: scorecard.OtherCriteria,
                            recommendation: recommendation,
                            evaluationFeedback: shouldShowTextArea ? evaluationFeedback : "",
                            overallFeedback: overallFeedback,
                            questionScores: questionScoresFormatted,
                            candidateId: candidateId,
                            jobRequestId: (_b = candidate.jobRequestId) !== null && _b !== void 0 ? _b : "",
                            level: (_c = candidate.interviewLevel) !== null && _c !== void 0 ? _c : "",
                        })];
                case 2:
                    result = _d.sent();
                    if (!result.success) {
                        setSubmitError(result.message || "Submission failed. Please try again.");
                        return [2 /*return*/];
                    }
                    setSuccessMessage(result.message || ConditionConfig_1.RecuritmentHRMsg.RecuritmentHRMsgCancel);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _d.sent();
                    console.error("[useSubmitEvaluation] submitEval error:", err_1);
                    setSubmitError(err_1 instanceof Error ? err_1.message : ConditionConfig_1.RecuritmentHRMsg.APIErrorMsg);
                    return [3 /*break*/, 5];
                case 4:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        candidate,
        candidateId,
        questions,
        answers,
        scorecard,
        recommendation,
        overallFeedback,
        evaluationFeedback,
        shouldShowTextArea,
    ]);
    return {
        submitting: submitting,
        submitError: submitError,
        successMessage: successMessage,
        validationErrors: validationErrors,
        ratingErrors: ratingErrors,
        scorecardErrors: scorecardErrors,
        recError: recError,
        feedbackError: feedbackError,
        evalFeedbackError: evalFeedbackError,
        ackError: ackError,
        runValidation: runValidation,
        submitEval: submitEval,
        resetSubmit: resetSubmit,
        onSuccess: onSuccess,
    };
}
exports.useSubmitEvaluation = useSubmitEvaluation;
//# sourceMappingURL=Usesubmitevaluation.js.map