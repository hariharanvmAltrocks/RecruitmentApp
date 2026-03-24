"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Evalution;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var fetchCandidateDetails_1 = require("./Hooks/fetchCandidateDetails");
var fetchQuestionBank_1 = require("./Hooks/fetchQuestionBank");
var fetchScoreCard_1 = require("./Hooks/fetchScoreCard");
var CommonStateManagement_1 = require("./State/CommonStateManagement");
var CandidateInfo_1 = tslib_1.__importDefault(require("./Components/CandidateInfo"));
var InterviewQuestion_1 = tslib_1.__importDefault(require("./Components/InterviewQuestion"));
var ScorecardDetails_1 = tslib_1.__importDefault(require("./Components/ScorecardDetails"));
var handleSubmitEvaluation_1 = require("./SaveForm/handleSubmitEvaluation");
var Evalution_module_scss_1 = tslib_1.__importDefault(require("./Evalution.module.scss"));
function Evalution() {
    return (React.createElement(CommonStateManagement_1.EvaluationProvider, null,
        React.createElement(EvalutionContent, null)));
}
function EvalutionContent() {
    var _this = this;
    var _a = (0, fetchCandidateDetails_1.useCandidateDetails)(), candidate = _a.data, candidateLoading = _a.loading, candidateError = _a.error, reloadCandidate = _a.reload;
    var _b = (0, fetchQuestionBank_1.useQuestionBank)(), questions = _b.data, questionsLoading = _b.loading, questionsError = _b.error, reloadQuestions = _b.reload;
    var _c = (0, fetchScoreCard_1.useScoreCard)(), scoreCard = _c.data, scoreCardLoading = _c.loading, scoreCardError = _c.error, reloadScoreCard = _c.reload;
    var _d = (0, CommonStateManagement_1.useEvaluationState)(), selectedCandidate = _d.selectedCandidate, setSelectedCandidate = _d.setSelectedCandidate, answers = _d.answers, initializeAnswers = _d.initializeAnswers, updateAnswer = _d.updateAnswer, scoreSummary = _d.scoreSummary;
    var _e = React.useState({ loading: false }), submitState = _e[0], setSubmitState = _e[1];
    React.useEffect(function () {
        if (candidate) {
            setSelectedCandidate(candidate);
        }
    }, [candidate, setSelectedCandidate]);
    React.useEffect(function () {
        if (questions && questions.length > 0) {
            initializeAnswers(questions, scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.answers);
        }
    }, [questions, scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.answers, initializeAnswers]);
    var isLoading = candidateLoading || questionsLoading || scoreCardLoading;
    var hasError = candidateError || questionsError || scoreCardError;
    var handleRetry = React.useCallback(function () {
        reloadCandidate();
        reloadQuestions();
        reloadScoreCard();
    }, [reloadCandidate, reloadQuestions, reloadScoreCard]);
    var handleAnswerChange = React.useCallback(function (questionId, patch) {
        updateAnswer(questionId, patch);
    }, [updateAnswer]);
    var onSubmit = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var payload, result, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedCandidate) {
                        setSubmitState({ loading: false, error: 'Please select a candidate before submitting.' });
                        return [2 /*return*/];
                    }
                    setSubmitState({ loading: true });
                    payload = {
                        candidate: selectedCandidate,
                        answers: answers,
                        scoreSummary: scoreSummary
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, handleSubmitEvaluation_1.handleSubmitEvaluation)(payload)];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        setSubmitState({ loading: false, success: result.message });
                    }
                    else {
                        setSubmitState({ loading: false, error: result.message });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    setSubmitState({ loading: false, error: error_1 instanceof Error ? error_1.message : 'Failed to submit evaluation.' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [answers, scoreSummary, selectedCandidate]);
    return (React.createElement("div", { className: "min-h-screen bg-slate-50 ".concat(Evalution_module_scss_1.default.pageRoot) },
        React.createElement("div", { className: "max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6" },
            React.createElement("header", { className: "flex flex-col gap-2" },
                React.createElement("h2", { className: "text-xl font-bold text-slate-800 tracking-tight" }, "Candidate Evaluation"),
                React.createElement("p", { className: "text-sm text-slate-500" }, "Complete the assessment to record interview feedback and scoring.")),
            hasError && (React.createElement("div", { className: "rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700 flex items-center justify-between" },
                React.createElement("span", null, "We could not load all evaluation data. Please try again."),
                React.createElement("button", { onClick: handleRetry, className: "px-4 py-2 rounded-lg bg-white border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100 transition-colors" }, "Retry"))),
            isLoading && (React.createElement("div", { className: "rounded-2xl border border-slate-200 bg-white p-8 flex items-center gap-4" },
                React.createElement("div", { className: "h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" }),
                React.createElement("div", null,
                    React.createElement("div", { className: "text-sm font-semibold text-slate-700" }, "Loading evaluation data"),
                    React.createElement("div", { className: "text-xs text-slate-500" }, "Fetching candidate details, questions, and scorecard.")))),
            !isLoading && !hasError && (React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6" },
                React.createElement(CandidateInfo_1.default, { candidate: candidate }),
                React.createElement("div", { className: "flex flex-col gap-6" },
                    React.createElement(InterviewQuestion_1.default, { questions: questions, answers: answers, onAnswerChange: handleAnswerChange }),
                    React.createElement(ScorecardDetails_1.default, { summary: scoreSummary }),
                    React.createElement("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4" },
                        React.createElement("div", { className: "text-sm text-slate-500" },
                            submitState.error && React.createElement("span", { className: "text-rose-600 font-semibold" }, submitState.error),
                            submitState.success && React.createElement("span", { className: "text-emerald-600 font-semibold" }, submitState.success)),
                        React.createElement("button", { onClick: onSubmit, disabled: submitState.loading, className: "px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed" }, submitState.loading ? 'Submitting...' : 'Submit Evaluation'))))))));
}
//# sourceMappingURL=Evalution.js.map