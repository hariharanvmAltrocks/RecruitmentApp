"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationProvider = EvaluationProvider;
exports.useEvaluationState = useEvaluationState;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var initialSummary = {
    total: 0,
    average: 0,
    status: 'Pending'
};
var EvaluationContext = React.createContext(undefined);
function EvaluationProvider(_a) {
    var children = _a.children;
    var _b = React.useState(null), selectedCandidate = _b[0], setSelectedCandidate = _b[1];
    var _c = React.useState({}), answers = _c[0], setAnswers = _c[1];
    var _d = React.useState(initialSummary), scoreSummary = _d[0], setScoreSummary = _d[1];
    var initializeAnswers = React.useCallback(function (questions, existingAnswers) {
        var prepared = {};
        questions.forEach(function (question) {
            var _a, _b;
            var existing = existingAnswers === null || existingAnswers === void 0 ? void 0 : existingAnswers[question.id];
            prepared[question.id] = {
                questionId: question.id,
                rating: (_a = existing === null || existing === void 0 ? void 0 : existing.rating) !== null && _a !== void 0 ? _a : null,
                remarks: (_b = existing === null || existing === void 0 ? void 0 : existing.remarks) !== null && _b !== void 0 ? _b : ''
            };
        });
        setAnswers(prepared);
    }, []);
    var updateAnswer = React.useCallback(function (questionId, patch) {
        setAnswers(function (prev) {
            var _a;
            var _b, _c, _d, _e, _f, _g;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[questionId] = {
                questionId: questionId,
                rating: (_d = (_b = patch.rating) !== null && _b !== void 0 ? _b : (_c = prev[questionId]) === null || _c === void 0 ? void 0 : _c.rating) !== null && _d !== void 0 ? _d : null,
                remarks: (_g = (_e = patch.remarks) !== null && _e !== void 0 ? _e : (_f = prev[questionId]) === null || _f === void 0 ? void 0 : _f.remarks) !== null && _g !== void 0 ? _g : ''
            }, _a)));
        });
    }, []);
    var resetState = React.useCallback(function () {
        setSelectedCandidate(null);
        setAnswers({});
        setScoreSummary(initialSummary);
    }, []);
    React.useEffect(function () {
        var computed = computeSummary(answers);
        setScoreSummary(computed);
    }, [answers]);
    var value = React.useMemo(function () { return ({
        selectedCandidate: selectedCandidate,
        setSelectedCandidate: setSelectedCandidate,
        answers: answers,
        initializeAnswers: initializeAnswers,
        updateAnswer: updateAnswer,
        scoreSummary: scoreSummary,
        setScoreSummary: setScoreSummary,
        resetState: resetState
    }); }, [selectedCandidate, setSelectedCandidate, answers, initializeAnswers, updateAnswer, scoreSummary, setScoreSummary, resetState]);
    return React.createElement(EvaluationContext.Provider, { value: value }, children);
}
function useEvaluationState() {
    var context = React.useContext(EvaluationContext);
    if (!context) {
        throw new Error('useEvaluationState must be used within EvaluationProvider');
    }
    return context;
}
function computeSummary(answers) {
    var ratings = Object.values(answers)
        .map(function (answer) { return answer.rating; })
        .filter(function (rating) { return rating !== null; });
    if (ratings.length === 0) {
        return initialSummary;
    }
    var total = ratings.reduce(function (sum, rating) { return sum + rating; }, 0);
    var average = parseFloat((total / ratings.length).toFixed(2));
    var status = 'Fail';
    if (average >= 4) {
        status = 'Pass';
    }
    else if (average >= 3) {
        status = 'Borderline';
    }
    return { total: total, average: average, status: status };
}
//# sourceMappingURL=CommonStateManagement.js.map