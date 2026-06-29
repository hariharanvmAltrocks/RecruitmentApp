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
var Usesubmitevaluation_1 = require("./Hooks/Usesubmitevaluation");
var Submitevaluation_1 = tslib_1.__importDefault(require("./Components/Submitevaluation"));
var loading_1 = tslib_1.__importDefault(require("../../Comman/Loading/loading"));
var Evalution = function (props) {
    var _a;
    var location = (0, react_router_dom_1.useLocation)();
    var stateCandidateId = (_a = location.state) === null || _a === void 0 ? void 0 : _a.ID;
    var candidateId = Number(stateCandidateId || props.ID || 0);
    console.log("[Evalution] candidateId:", candidateId, "from state:", stateCandidateId, "props:", props.ID);
    return (React.createElement(CommonStateManagement_1.EvaluationProvider, null,
        React.createElement(EvalutionContent, { candidateId: candidateId, onBack: props.onBack, StatusID: props.StatusID, InterviewLevels: props.InterviewLevels })));
};
exports.Evalution = Evalution;
function EvalutionContent(_a) {
    var _this = this;
    var candidateId = _a.candidateId, onBack = _a.onBack, StatusID = _a.StatusID, InterviewLevels = _a.InterviewLevels;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var goBack = React.useCallback(function () {
        if (onBack) {
            onBack();
        }
        else {
            navigate("/RecruitmentTable");
        }
    }, [navigate, onBack]);
    var _b = (0, fetchCandidateDetails_1.useCandidateDetails)({ candidateId: candidateId, InterviewLevels: InterviewLevels }), candidate = _b.candidate, questions = _b.questions, candidateLoading = _b.loading, candidateError = _b.error, reloadCandidate = _b.reload;
    var _c = (0, fetchScoreCard_1.useScoreCard)(candidateId), scoreCardData = _c.data, scoreCardLoading = _c.loading, scoreCardError = _c.error, reloadScoreCard = _c.reload;
    var _d = (0, CommonStateManagement_1.useEvaluationState)(), answers = _d.answers, initializeAnswers = _d.initializeAnswers, updateAnswer = _d.updateAnswer, scorecard = _d.scorecard, updateScorecard = _d.updateScorecard, recommendation = _d.recommendation, setRecommendation = _d.setRecommendation, overallFeedback = _d.overallFeedback, setOverallFeedback = _d.setOverallFeedback, evaluationFeedback = _d.evaluationFeedback, setEvaluationFeedback = _d.setEvaluationFeedback, acknowledged = _d.acknowledged, setAcknowledged = _d.setAcknowledged;
    React.useEffect(function () {
        if (questions.length > 0)
            initializeAnswers(questions, scoreCardData === null || scoreCardData === void 0 ? void 0 : scoreCardData.answers);
    }, [questions, scoreCardData === null || scoreCardData === void 0 ? void 0 : scoreCardData.answers, initializeAnswers]);
    var shouldShowTextArea = React.useMemo(function () { return Object.values(scorecard).some(function (v) { return v !== null && Number(v) <= 2; }); }, [scorecard]);
    var isLoading = candidateLoading || scoreCardLoading;
    var hasError = !!(candidateError || scoreCardError) || questions.length === 0;
    var handleRetry = React.useCallback(function () {
        reloadCandidate();
        reloadScoreCard();
    }, [reloadCandidate, reloadScoreCard]);
    var handleSuccess = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            goBack();
            return [2 /*return*/];
        });
    }); }, [goBack]);
    var submitHook = (0, Usesubmitevaluation_1.useSubmitEvaluation)({
        candidateId: candidateId,
        candidate: candidate,
        questions: questions,
        answers: answers,
        scorecard: scorecard,
        recommendation: recommendation,
        overallFeedback: overallFeedback,
        evaluationFeedback: evaluationFeedback,
        shouldShowTextArea: shouldShowTextArea,
        acknowledged: acknowledged,
        onSuccess: handleSuccess,
    });
    if (isLoading) {
        return (React.createElement("div", { className: Evalution_module_scss_1.default.loadingPage },
            React.createElement("div", { className: Evalution_module_scss_1.default.spinner }),
            React.createElement("p", { className: Evalution_module_scss_1.default.loadingText }, "Loading evaluation form\u2026")));
    }
    return (React.createElement("div", { className: Evalution_module_scss_1.default.root },
        hasError && (React.createElement("div", { className: Evalution_module_scss_1.default.errorBanner },
            React.createElement("span", null, "We could not load all evaluation data. Please try again."),
            React.createElement("button", { className: Evalution_module_scss_1.default.retryBtn, onClick: handleRetry }, "Retry"))),
        submitHook.submitting && React.createElement(loading_1.default, null),
        React.createElement("div", { className: Evalution_module_scss_1.default.layout },
            React.createElement(CandidateInfo_1.default, { candidate: candidate }),
            React.createElement("main", { className: Evalution_module_scss_1.default.rightPanel },
                React.createElement(InterviewQuestion_1.default, { questions: questions, answers: answers, ratingErrors: submitHook.ratingErrors, onAnswerChange: function (qId, patch) { return updateAnswer(qId, patch); } }),
                React.createElement("div", { className: questions.length > 0 ? Evalution_module_scss_1.default.scorecardMargin : "" },
                    React.createElement(ScorecardDetails_1.default, { scorecard: scorecard, scorecardErrors: submitHook.scorecardErrors, onScorecardChange: function (key, val) { return updateScorecard(key, val); }, recommendation: recommendation, recError: submitHook.recError, onRecommendationChange: setRecommendation, overallFeedback: overallFeedback, feedbackError: submitHook.feedbackError, onFeedbackChange: setOverallFeedback, evaluationFeedback: evaluationFeedback, evalFeedbackError: submitHook.evalFeedbackError, onEvalFeedbackChange: setEvaluationFeedback, acknowledged: acknowledged, ackError: submitHook.ackError, onAcknowledgedChange: setAcknowledged, candidate: candidate })),
                React.createElement(Submitevaluation_1.default, { submitHook: submitHook, acknowledged: acknowledged, onCancel: goBack })))));
}
//# sourceMappingURL=Evalution.js.map