"use strict";
// Hooks/useSubmitReviewScoreCard.ts
// ─────────────────────────────────────────────────────────────────────────────
// Standalone submit hook — submit logic மட்டும் இங்கே இருக்கும்.
// useReviewScorecard-இல் இருந்து தனியாக பிரிக்கப்பட்டது.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubmitReviewScoreCard = useSubmitReviewScoreCard;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReviewScoreCardServices_1 = tslib_1.__importDefault(require("../ReviewScoreCardServies/ReviewScoreCardServices"));
var useReviewScorecard_1 = require("../Hooks/useReviewScorecard");
function useSubmitReviewScoreCard(deps) {
    var _this = this;
    var reviewingCandidate = deps.reviewingCandidate, reviewData = deps.reviewData, hodDecision = deps.hodDecision, decisionComment = deps.decisionComment, confirmed = deps.confirmed, selectedPositionId = deps.selectedPositionId, currentUserEmail = deps.currentUserEmail, shouldShowPositionId = deps.shouldShowPositionId, onSuccess = deps.onSuccess;
    var _a = React.useState(false), submitting = _a[0], setSubmitting = _a[1];
    var _b = React.useState(''), submitError = _b[0], setSubmitError = _b[1];
    var _c = React.useState(''), successMessage = _c[0], setSuccessMessage = _c[1];
    var _d = React.useState({
        decision: false,
        comment: false,
        checkbox: false,
        position: false,
    }), errors = _d[0], setErrors = _d[1];
    var resetSubmit = React.useCallback(function () {
        setSubmitting(false);
        setSubmitError('');
        setSuccessMessage('');
        setErrors({ decision: false, comment: false, checkbox: false, position: false });
    }, []);
    var validate = React.useCallback(function (statusId, decision) {
        var lv2 = (0, useReviewScorecard_1.isLevel2)(statusId);
        var newErrors = {
            decision: lv2 ? false : !decision,
            comment: !decisionComment.trim(),
            checkbox: !confirmed,
            position: !lv2 &&
                decision === 'Yes' &&
                shouldShowPositionId(statusId, decision) &&
                !selectedPositionId,
        };
        setErrors(newErrors);
        if (!lv2 && newErrors.decision) {
            setSubmitError('Please select a decision.');
        }
        else if (Object.values(newErrors).some(Boolean)) {
            setSubmitError('Please fill in all required fields.');
        }
        else {
            setSubmitError('');
        }
        return Object.values(newErrors).every(function (v) { return !v; });
    }, [decisionComment, confirmed, selectedPositionId, shouldShowPositionId]);
    var submitDecision = React.useCallback(function (roleId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var jobRequestId, result, e_1;
        var _this = this;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!reviewingCandidate)
                        return [2 /*return*/];
                    setSubmitError('');
                    if (!validate(reviewingCandidate.statusId, hodDecision))
                        return [2 /*return*/];
                    setSubmitting(true);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    jobRequestId = (_b = (_a = reviewData === null || reviewData === void 0 ? void 0 : reviewData.candidateData) === null || _a === void 0 ? void 0 : _a.jobRequestId) !== null && _b !== void 0 ? _b : null;
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.submitHODDecision({
                            candidateId: reviewingCandidate.id,
                            hodDecision: hodDecision,
                            comments: decisionComment,
                            currentUserEmail: currentUserEmail,
                            currentRoleId: roleId,
                            gpa: reviewingCandidate.gpa || '',
                            positionId: selectedPositionId,
                            isLevel2: (0, useReviewScorecard_1.isLevel2)(reviewingCandidate.statusId),
                            jobCodeID: reviewingCandidate.jobCodeID || 0,
                            recruitmentID: reviewingCandidate.recruitmentID,
                            statusId: reviewingCandidate.statusId,
                            scoreCardId: (_d = (_c = reviewData === null || reviewData === void 0 ? void 0 : reviewData.candidateData) === null || _c === void 0 ? void 0 : _c.level2ScorecardId) !== null && _d !== void 0 ? _d : null,
                            jobRequestId: jobRequestId,
                        })];
                case 2:
                    result = _e.sent();
                    if (!result.success) {
                        setSubmitError(result.message || 'Submission failed.');
                        return [2 /*return*/];
                    }
                    setSuccessMessage(result.message);
                    setTimeout(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setSuccessMessage('');
                                    return [4 /*yield*/, onSuccess()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 1200);
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _e.sent();
                    console.error('[useSubmitReviewScoreCard] submitDecision error:', e_1);
                    setSubmitError(e_1 instanceof Error ? e_1.message : 'Submission failed. Please try again.');
                    return [3 /*break*/, 5];
                case 4:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        reviewingCandidate, reviewData, hodDecision, decisionComment,
        currentUserEmail, selectedPositionId, validate, onSuccess,
    ]);
    return { submitting: submitting, submitError: submitError, successMessage: successMessage, errors: errors, setErrors: setErrors, submitDecision: submitDecision, resetSubmit: resetSubmit };
}
//# sourceMappingURL=useSubmitReviewScoreCard.js.map