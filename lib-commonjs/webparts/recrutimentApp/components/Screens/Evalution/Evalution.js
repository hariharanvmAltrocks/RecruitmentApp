"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evalution = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var CommonStateManagement_1 = require("./State/CommonStateManagement");
var fetchCandidateDetails_1 = require("./Hooks/fetchCandidateDetails");
var fetchScoreCard_1 = require("./Hooks/fetchScoreCard");
var CandidateInfo_1 = tslib_1.__importDefault(require("./Components/CandidateInfo"));
var InterviewQuestion_1 = tslib_1.__importDefault(require("./Components/InterviewQuestion"));
var ScorecardDetails_1 = tslib_1.__importDefault(require("./Components/ScorecardDetails"));
var Evalution_module_scss_1 = tslib_1.__importDefault(require("./Evalution.module.scss"));
var Evaluationformservice_1 = require("./Evaluationservice/Evaluationformservice");
var Evalution = function (props) {
    var _a;
    var location = (0, react_router_dom_1.useLocation)();
    var stateCandidateId = (_a = location.state) === null || _a === void 0 ? void 0 : _a.ID;
    var candidateId = Number(stateCandidateId || props.ID || 0);
    console.log("Evalution router props", { stateCandidateId: stateCandidateId, propsID: props.ID, candidateId: candidateId });
    return (React.createElement(CommonStateManagement_1.EvaluationProvider, null,
        React.createElement(EvalutionContent, { candidateId: candidateId, onBack: props.onBack })));
};
exports.Evalution = Evalution;
function EvalutionContent(_a) {
    var _this = this;
    var candidateId = _a.candidateId, onBack = _a.onBack;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleCancel = React.useCallback(function () {
        if (onBack) {
            onBack();
        }
        else {
            navigate('/RecruitmentTable');
        }
    }, [navigate, onBack]);
    console.log('[EvalutionContent] render', { candidateId: candidateId });
    // ── Data fetching ─────────────────────────────────────────────────────────
    // useCandidateDetails now fetches candidate + questions in one service call
    var _b = (0, fetchCandidateDetails_1.useCandidateDetails)({ candidateId: candidateId, }), candidate = _b.candidate, questions = _b.questions, candidateLoading = _b.loading, candidateError = _b.error, reloadCandidate = _b.reload;
    var _c = (0, fetchScoreCard_1.useScoreCard)(candidateId), scoreCardData = _c.data, scoreCardLoading = _c.loading, scoreCardError = _c.error, reloadScoreCard = _c.reload;
    // ── Context state ─────────────────────────────────────────────────────────
    var _d = (0, CommonStateManagement_1.useEvaluationState)(), answers = _d.answers, initializeAnswers = _d.initializeAnswers, updateAnswer = _d.updateAnswer, scorecard = _d.scorecard, updateScorecard = _d.updateScorecard, recommendation = _d.recommendation, setRecommendation = _d.setRecommendation, overallFeedback = _d.overallFeedback, setOverallFeedback = _d.setOverallFeedback, acknowledged = _d.acknowledged, setAcknowledged = _d.setAcknowledged;
    // ── Validation errors ─────────────────────────────────────────────────────
    var _e = React.useState({}), ratingErrors = _e[0], setRatingErrors = _e[1];
    var _f = React.useState({}), scorecardErrors = _f[0], setScorecardErrors = _f[1];
    var _g = React.useState(false), recError = _g[0], setRecError = _g[1];
    var _h = React.useState(false), feedbackError = _h[0], setFeedbackError = _h[1];
    var _j = React.useState(false), ackError = _j[0], setAckError = _j[1];
    // ── UI state ──────────────────────────────────────────────────────────────
    var _k = React.useState(''), alertMsg = _k[0], setAlertMsg = _k[1];
    var _l = React.useState(''), alertType = _l[0], setAlertType = _l[1];
    var _m = React.useState(false), submitting = _m[0], setSubmitting = _m[1];
    // ── Seed answers when questions arrive ───────────────────────────────────
    React.useEffect(function () {
        if (questions.length > 0) {
            initializeAnswers(questions, scoreCardData === null || scoreCardData === void 0 ? void 0 : scoreCardData.answers);
        }
    }, [questions, scoreCardData === null || scoreCardData === void 0 ? void 0 : scoreCardData.answers, initializeAnswers]);
    var isLoading = candidateLoading || scoreCardLoading;
    var hasError = !!(candidateError || scoreCardError);
    var handleRetry = React.useCallback(function () {
        reloadCandidate();
        reloadScoreCard();
    }, [reloadCandidate, reloadScoreCard]);
    var handleAnswerChange = React.useCallback(function (questionId, patch) {
        updateAnswer(questionId, patch);
        if (patch.rating !== undefined)
            setRatingErrors(function (prev) {
                var _a;
                return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[questionId] = false, _a)));
            });
    }, [updateAnswer]);
    var handleScorecardChange = React.useCallback(function (key, value) {
        updateScorecard(key, value);
        setScorecardErrors(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[key] = false, _a)));
        });
    }, [updateScorecard]);
    // ── Submit ────────────────────────────────────────────────────────────────
    var handleSubmit = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var valid, newRatingErrors, newScorecardErrors, currentRoleIDs, roleId, result, err_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('[Evalution] handleSubmit start', { candidate: candidate, answers: answers, scorecard: scorecard, recommendation: recommendation, overallFeedback: overallFeedback });
                    valid = true;
                    newRatingErrors = {};
                    questions.forEach(function (q) {
                        var _a;
                        if (((_a = answers[q.id]) === null || _a === void 0 ? void 0 : _a.rating) == null) {
                            newRatingErrors[q.id] = true;
                            valid = false;
                        }
                    });
                    setRatingErrors(newRatingErrors);
                    newScorecardErrors = {};
                    Object.keys(scorecard).forEach(function (key) {
                        if (scorecard[key] === null) {
                            newScorecardErrors[key] = true;
                            valid = false;
                        }
                    });
                    setScorecardErrors(newScorecardErrors);
                    if (!recommendation) {
                        setRecError(true);
                        valid = false;
                    }
                    else
                        setRecError(false);
                    if (!overallFeedback.trim()) {
                        setFeedbackError(true);
                        valid = false;
                    }
                    else
                        setFeedbackError(false);
                    if (!acknowledged) {
                        setAckError(true);
                        valid = false;
                    }
                    else
                        setAckError(false);
                    if (!valid) {
                        setAlertMsg('Please complete all required fields before submitting.');
                        setAlertType('error');
                        return [2 /*return*/];
                    }
                    if (!(candidate === null || candidate === void 0 ? void 0 : candidate.currentUserPanelId)) {
                        setAlertMsg('Could not identify your panel entry. Please contact HR.');
                        setAlertType('error');
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    currentRoleIDs = candidate.currentRoleIDs || [4];
                    roleId = currentRoleIDs.includes(4) ? 4 : (currentRoleIDs[0] || 0);
                    console.log('[Evalution] selected roleId for submit', roleId);
                    return [4 /*yield*/, (0, Evaluationformservice_1.submitScorecard)({
                            recruitmentId: candidate.recruitmentId,
                            panelId: candidate.currentUserPanelId,
                            roleId: roleId,
                            interviewPersonNameId: (_a = candidate.currentUserGuid) !== null && _a !== void 0 ? _a : '',
                            qualifications: scorecard.Qualifications,
                            experience: scorecard.Experience,
                            knowledge: scorecard.Knowledge,
                            energyLevel: scorecard.EnergyLevel,
                            jobRequirements: scorecard.JobRequirements,
                            cultureFit: scorecard.CultureFit,
                            expatLocal: scorecard.ExpatLocal,
                            otherCriteria: scorecard.OtherCriteria,
                            recommendation: recommendation,
                            overallFeedback: overallFeedback,
                            questionScores: Object.values(answers).map(function (a) { return ({
                                id: a.questionId,
                                rating: a.rating,
                            }); }),
                        })];
                case 2:
                    result = _b.sent();
                    if (result.success) {
                        setAlertMsg(result.message);
                        setAlertType('success');
                        console.log('[Evalution] submit success', result);
                        setTimeout(function () {
                            navigate('/RecruitmentTable');
                        }, 700);
                    }
                    else {
                        setAlertMsg(result.message);
                        setAlertType('error');
                        console.warn('[Evalution] submit failed', result);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _b.sent();
                    console.error('[Evalution] submit exception', err_1);
                    setAlertMsg(err_1 instanceof Error ? err_1.message : 'Submission failed. Please try again.');
                    setAlertType('error');
                    return [3 /*break*/, 5];
                case 4:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        questions, answers, scorecard, recommendation, overallFeedback,
        acknowledged, candidate,
    ]);
    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) {
        return (React.createElement("div", { className: Evalution_module_scss_1.default.loadingPage },
            React.createElement("div", { className: Evalution_module_scss_1.default.spinner }),
            React.createElement("p", { className: Evalution_module_scss_1.default.loadingText }, "Loading evaluation form\u2026")));
    }
    var alertClass = [
        Evalution_module_scss_1.default.alert,
        alertType === 'error' ? Evalution_module_scss_1.default.alertError : '',
        alertType === 'success' ? Evalution_module_scss_1.default.alertSuccess : '',
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: Evalution_module_scss_1.default.root },
        alertMsg && (React.createElement("div", { className: alertClass },
            React.createElement("span", null, alertMsg),
            React.createElement("button", { className: Evalution_module_scss_1.default.alertClose, onClick: function () { setAlertMsg(''); setAlertType(''); } }, "\u2715"))),
        hasError && (React.createElement("div", { className: Evalution_module_scss_1.default.errorBanner },
            React.createElement("span", null, "We could not load all evaluation data. Please try again."),
            React.createElement("button", { className: Evalution_module_scss_1.default.retryBtn, onClick: handleRetry }, "Retry"))),
        React.createElement("div", { className: Evalution_module_scss_1.default.layout },
            React.createElement(CandidateInfo_1.default, { candidate: candidate }),
            React.createElement("main", { className: Evalution_module_scss_1.default.rightPanel },
                React.createElement(InterviewQuestion_1.default, { questions: questions, answers: answers, ratingErrors: ratingErrors, onAnswerChange: handleAnswerChange }),
                React.createElement("div", { className: questions.length > 0 ? Evalution_module_scss_1.default.scorecardMargin : '' },
                    React.createElement(ScorecardDetails_1.default, { scorecard: scorecard, scorecardErrors: scorecardErrors, onScorecardChange: handleScorecardChange, recommendation: recommendation, recError: recError, onRecommendationChange: function (r) { setRecommendation(r); setRecError(false); }, overallFeedback: overallFeedback, feedbackError: feedbackError, onFeedbackChange: function (v) { setOverallFeedback(v); if (v.trim())
                            setFeedbackError(false); }, acknowledged: acknowledged, ackError: ackError, onAcknowledgedChange: function (b) { setAcknowledged(b); if (b)
                            setAckError(false); }, candidate: candidate })),
                React.createElement("div", { className: Evalution_module_scss_1.default.footer },
                    React.createElement("button", { className: Evalution_module_scss_1.default.cancelBtn, onClick: handleCancel, disabled: submitting }, "Cancel"),
                    React.createElement("button", { className: Evalution_module_scss_1.default.submitBtn, onClick: handleSubmit, disabled: submitting || !acknowledged }, submitting ? 'Submitting…' : '+ Submit Evaluation'))))));
}
//# sourceMappingURL=Evalution.js.map