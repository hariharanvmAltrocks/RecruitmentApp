"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvaluationState = exports.EvaluationProvider = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var initialScorecard = {
    Qualifications: null, Experience: null, Knowledge: null, EnergyLevel: null,
    JobRequirements: null, CultureFit: null, ExpatLocal: null, OtherCriteria: null,
};
var initialSummary = { total: 0, average: 0, status: 'Pending' };
var EvaluationContext = React.createContext(undefined);
function EvaluationProvider(_a) {
    var children = _a.children;
    var _b = React.useState(null), selectedCandidate = _b[0], setSelectedCandidate = _b[1];
    var _c = React.useState({}), answers = _c[0], setAnswers = _c[1];
    var _d = React.useState(initialScorecard), scorecard = _d[0], setScorecard = _d[1];
    var _e = React.useState(null), recommendation = _e[0], setRecommendation = _e[1];
    var _f = React.useState(''), overallFeedback = _f[0], setOverallFeedback = _f[1];
    var _g = React.useState(''), evaluationFeedback = _g[0], setEvaluationFeedback = _g[1];
    var _h = React.useState(false), acknowledged = _h[0], setAcknowledged = _h[1];
    var _j = React.useState(initialSummary), scoreSummary = _j[0], setScoreSummary = _j[1];
    var initializeAnswers = React.useCallback(function (questions, existingAnswers) {
        var prepared = {};
        questions.forEach(function (q) {
            var _a, _b;
            var existing = existingAnswers === null || existingAnswers === void 0 ? void 0 : existingAnswers[q.id];
            prepared[q.id] = { questionId: q.id, rating: (_a = existing === null || existing === void 0 ? void 0 : existing.rating) !== null && _a !== void 0 ? _a : null, remarks: (_b = existing === null || existing === void 0 ? void 0 : existing.remarks) !== null && _b !== void 0 ? _b : '' };
        });
        setAnswers(prepared);
    }, []);
    var updateAnswer = React.useCallback(function (questionId, patch) {
        setAnswers(function (prev) {
            var _a;
            var _b, _c, _d, _e;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[questionId] = {
                questionId: questionId,
                rating: patch.rating !== undefined ? patch.rating : (_c = (_b = prev[questionId]) === null || _b === void 0 ? void 0 : _b.rating) !== null && _c !== void 0 ? _c : null,
                remarks: patch.remarks !== undefined ? patch.remarks : (_e = (_d = prev[questionId]) === null || _d === void 0 ? void 0 : _d.remarks) !== null && _e !== void 0 ? _e : '',
            }, _a)));
        });
    }, []);
    var updateScorecard = React.useCallback(function (key, value) {
        setScorecard(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
    }, []);
    var resetState = React.useCallback(function () {
        setSelectedCandidate(null);
        setAnswers({});
        setScorecard(initialScorecard);
        setRecommendation(null);
        setOverallFeedback('');
        setEvaluationFeedback('');
        setAcknowledged(false);
        setScoreSummary(initialSummary);
    }, []);
    React.useEffect(function () {
        var ratings = Object.values(answers).map(function (a) { return a.rating; }).filter(function (r) { return r !== null; });
        if (ratings.length === 0) {
            setScoreSummary(initialSummary);
            return;
        }
        var total = ratings.reduce(function (s, r) { return s + r; }, 0);
        var average = parseFloat((total / ratings.length).toFixed(2));
        var status = average >= 4 ? 'Pass' : average >= 3 ? 'Borderline' : 'Fail';
        setScoreSummary({ total: total, average: average, status: status });
    }, [answers]);
    var value = React.useMemo(function () { return ({
        selectedCandidate: selectedCandidate,
        setSelectedCandidate: setSelectedCandidate,
        answers: answers,
        initializeAnswers: initializeAnswers,
        updateAnswer: updateAnswer,
        scorecard: scorecard,
        updateScorecard: updateScorecard,
        recommendation: recommendation,
        setRecommendation: setRecommendation,
        overallFeedback: overallFeedback,
        setOverallFeedback: setOverallFeedback,
        evaluationFeedback: evaluationFeedback,
        setEvaluationFeedback: setEvaluationFeedback,
        acknowledged: acknowledged,
        setAcknowledged: setAcknowledged,
        scoreSummary: scoreSummary,
        resetState: resetState,
    }); }, [
        selectedCandidate, answers, scorecard, recommendation,
        overallFeedback, evaluationFeedback, acknowledged, scoreSummary,
        initializeAnswers, updateAnswer, updateScorecard, resetState,
    ]);
    return React.createElement(EvaluationContext.Provider, { value: value }, children);
}
exports.EvaluationProvider = EvaluationProvider;
function useEvaluationState() {
    var ctx = React.useContext(EvaluationContext);
    if (!ctx)
        throw new Error('useEvaluationState must be used within EvaluationProvider');
    return ctx;
}
exports.useEvaluationState = useEvaluationState;
//# sourceMappingURL=CommonStateManagement.js.map