"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InterviewQuestionList;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var InterviewQuestion_module_scss_1 = tslib_1.__importDefault(require("./InterviewQuestion.module.scss"));
var ratingScale = [1, 2, 3, 4, 5];
function InterviewQuestionList(_a) {
    var questions = _a.questions, answers = _a.answers, onAnswerChange = _a.onAnswerChange;
    return (React.createElement("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" },
        React.createElement("div", { className: "flex items-start justify-between mb-6" },
            React.createElement("div", null,
                React.createElement("h3", { className: "text-sm font-bold text-slate-800" }, "Interview Questions"),
                React.createElement("p", { className: "text-xs text-slate-500" }, "Rate each response and capture remarks")),
            React.createElement("div", { className: "text-[10px] text-slate-400 uppercase tracking-widest" }, "1-5 Scale")),
        React.createElement("div", { className: "flex flex-col gap-5" }, questions.map(function (question, index) {
            var _a;
            var answer = answers[question.id];
            return (React.createElement("div", { key: question.id, className: "rounded-2xl border border-slate-100 p-5 bg-slate-50 ".concat(InterviewQuestion_module_scss_1.default.questionCard) },
                React.createElement("div", { className: "flex items-start gap-3" },
                    React.createElement("div", { className: "h-8 w-8 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center" }, index + 1),
                    React.createElement("div", { className: "flex-1" },
                        React.createElement("p", { className: "text-sm font-semibold text-slate-800" }, question.text),
                        React.createElement("div", { className: "mt-4 flex flex-wrap gap-2" }, ratingScale.map(function (rating) { return (React.createElement("button", { key: rating, type: "button", onClick: function () { return onAnswerChange(question.id, { rating: rating }); }, className: rating === (answer === null || answer === void 0 ? void 0 : answer.rating)
                                ? 'px-3 py-1.5 rounded-lg bg-white text-blue-600 text-xs font-bold shadow-sm border border-blue-200'
                                : 'px-3 py-1.5 rounded-lg bg-white text-slate-400 text-xs font-bold border border-slate-200 hover:border-blue-200 hover:text-blue-500 transition-colors' }, rating)); })),
                        React.createElement("textarea", { value: (_a = answer === null || answer === void 0 ? void 0 : answer.remarks) !== null && _a !== void 0 ? _a : '', onChange: function (event) { return onAnswerChange(question.id, { remarks: event.target.value }); }, placeholder: "Add interviewer remarks", className: "mt-4 w-full min-h-[90px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200" })))));
        }))));
}
//# sourceMappingURL=InterviewQuestion.js.map