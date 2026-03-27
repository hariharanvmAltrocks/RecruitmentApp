"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBank = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
require("../Questioncreation.scss");
var framer_motion_1 = require("framer-motion");
require("./Interviewmode.scss");
require("../Questioncreation.scss");
var QuestionTypeBadge = function (_a) {
    var type = _a.type;
    return (react_1.default.createElement("span", { className: "qc-badge qc-badge--".concat(type) }, type === "single" ? "Single Choice" : "Multiple Choice"));
};
var SkeletonCard = function () { return (react_1.default.createElement("div", { className: "qc-bank__skeleton" },
    react_1.default.createElement("div", { className: "qc-bank__skeleton-header" }),
    react_1.default.createElement("div", { className: "qc-bank__skeleton-line qc-bank__skeleton-line--long" }),
    react_1.default.createElement("div", { className: "qc-bank__skeleton-line qc-bank__skeleton-line--short" }),
    react_1.default.createElement("div", { className: "qc-bank__skeleton-line qc-bank__skeleton-line--medium" }))); };
var QuestionBankCareerPortal = function (_a) {
    var questionBank = _a.questionBank, loading = _a.loading, preparedQuestionIds = _a.preparedQuestionIds, searchQuery = _a.searchQuery, onAddFromBank = _a.onAddFromBank;
    var filtered = questionBank.filter(function (q) {
        return q.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.questionFr.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return (react_1.default.createElement("div", { className: "qc-bank" },
        react_1.default.createElement("div", { className: "qc-bank__header" },
            react_1.default.createElement("div", { className: "qc-bank__title-row" },
                react_1.default.createElement("h3", { className: "qc-bank__title" },
                    react_1.default.createElement("span", { className: "qc-bank__title-bar" }),
                    "Question Bank"),
                react_1.default.createElement("span", { className: "qc-bank__count" },
                    questionBank.length,
                    " Templates"))),
        react_1.default.createElement("div", { className: "qc-bank__list" }, loading ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(SkeletonCard, null),
            react_1.default.createElement(SkeletonCard, null),
            react_1.default.createElement(SkeletonCard, null))) : filtered.length === 0 ? (react_1.default.createElement("div", { className: "qc-bank__empty" },
            react_1.default.createElement("p", { className: "qc-bank__empty-text" }, "No questions found"))) : (react_1.default.createElement(framer_motion_1.AnimatePresence, null, filtered.map(function (q, i) {
            var isAdded = preparedQuestionIds.includes(q.id);
            return (react_1.default.createElement(framer_motion_1.motion.div, { key: q.id, className: "qc-bank__card ".concat(isAdded ? "qc-bank__card--added" : ""), initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" }, whileHover: { scale: 1.01, transition: { duration: 0.15 } } },
                react_1.default.createElement("div", { className: "qc-bank__card-header" },
                    react_1.default.createElement(QuestionTypeBadge, { type: q.type }),
                    react_1.default.createElement("button", { className: "qc-bank__add-btn ".concat(isAdded ? "qc-bank__add-btn--added" : ""), onClick: function () { return onAddFromBank(q); }, title: isAdded ? "Already added" : "Add to criteria" }, isAdded ? react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 16 }) : react_1.default.createElement(lucide_react_1.Plus, { size: 16 }))),
                react_1.default.createElement("div", { className: "qc-bank__card-body" },
                    react_1.default.createElement("div", { className: "qc-bank__lang-block" },
                        react_1.default.createElement("span", { className: "qc-bank__lang-label qc-bank__lang-label--en" }, "English"),
                        react_1.default.createElement("p", { className: "qc-bank__question-text" }, q.questionEn)),
                    react_1.default.createElement("div", { className: "qc-bank__divider" }),
                    react_1.default.createElement("div", { className: "qc-bank__lang-block" },
                        react_1.default.createElement("span", { className: "qc-bank__lang-label qc-bank__lang-label--fr" }, "Fran\u00E7ais"),
                        react_1.default.createElement("p", { className: "qc-bank__question-text qc-bank__question-text--italic" }, q.questionFr)),
                    react_1.default.createElement("div", { className: "qc-bank__options" }, q.options.map(function (opt) { return (react_1.default.createElement("span", { key: opt.id, className: "qc-bank__option ".concat(opt.isCorrect ? "qc-bank__option--correct" : "") },
                        opt.isCorrect && react_1.default.createElement(lucide_react_1.Check, { size: 9 }),
                        opt.textEn)); })))));
        }))))));
};
var QuestionBankInterview = function (_a) {
    var newQuestion = _a.newQuestion, setNewQuestion = _a.setNewQuestion, handleAddNew = _a.handleAddNew;
    return (react_1.default.createElement("div", { className: "bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-blue-900/5 overflow-hidden" },
        react_1.default.createElement("div", { className: "p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-blue-50/30" },
            react_1.default.createElement("div", { className: "flex items-center gap-5" },
                react_1.default.createElement("div", { className: "w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200" },
                    react_1.default.createElement(lucide_react_1.Plus, { size: 24 })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h3", { className: "text-lg font-black text-slate-900 tracking-tight" }, "Create New Question"),
                    react_1.default.createElement("p", { className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1" }, "Draft custom bilingual content"))),
            react_1.default.createElement("div", { className: "flex items-center gap-3" },
                react_1.default.createElement("button", { onClick: function () { return setNewQuestion({ questionEn: '', questionFr: '', answerEn: '', answerFr: '' }); }, className: "px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all hover:bg-slate-50 rounded-xl" }, "Clear All"),
                react_1.default.createElement("button", { onClick: handleAddNew, disabled: !newQuestion.questionEn && !newQuestion.questionFr, className: "px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-3 disabled:opacity-50 disabled:grayscale active:scale-95" },
                    react_1.default.createElement(lucide_react_1.Plus, { size: 16 }),
                    "Add to Interview Set"))),
        react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-100" },
            react_1.default.createElement("div", { className: "p-8 space-y-8" },
                react_1.default.createElement("div", { className: "flex items-center gap-3" },
                    react_1.default.createElement("div", { className: "w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-[11px] shadow-lg shadow-blue-100" }, "EN"),
                    react_1.default.createElement("span", { className: "text-[10px] font-black text-slate-900 uppercase tracking-widest" }, "English Version")),
                react_1.default.createElement("div", { className: "space-y-4" },
                    react_1.default.createElement("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2" },
                        react_1.default.createElement(lucide_react_1.MessageSquare, { size: 12, className: "text-blue-500" }),
                        "Question Prompt"),
                    react_1.default.createElement("textarea", { value: newQuestion.questionEn, onChange: function (e) { return setNewQuestion(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { questionEn: e.target.value })); }, placeholder: "Enter the question in English...", className: "w-full p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-medium min-h-[120px] outline-none resize-none shadow-inner" })),
                react_1.default.createElement("div", { className: "space-y-4" },
                    react_1.default.createElement("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2" },
                        react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 12, className: "text-blue-500" }),
                        "Expected Answer"),
                    react_1.default.createElement("textarea", { value: newQuestion.answerEn, onChange: function (e) { return setNewQuestion(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { answerEn: e.target.value })); }, placeholder: "What are the key points for a good answer?", className: "w-full p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-medium min-h-[120px] outline-none resize-none shadow-inner" }))),
            react_1.default.createElement("div", { className: "p-8 space-y-8" },
                react_1.default.createElement("div", { className: "flex items-center gap-3" },
                    react_1.default.createElement("div", { className: "w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center font-black text-[11px] shadow-lg shadow-red-100" }, "FR"),
                    react_1.default.createElement("span", { className: "text-[10px] font-black text-slate-900 uppercase tracking-widest" }, "Version Fran\u00E7aise")),
                react_1.default.createElement("div", { className: "space-y-4" },
                    react_1.default.createElement("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2" },
                        react_1.default.createElement(lucide_react_1.MessageSquare, { size: 12, className: "text-red-500" }),
                        "Prompt de la Question"),
                    react_1.default.createElement("textarea", { value: newQuestion.questionFr, onChange: function (e) { return setNewQuestion(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { questionFr: e.target.value })); }, placeholder: "Saisissez la question en fran\u00E7ais...", className: "w-full p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-red-500 focus:ring-8 focus:ring-red-500/5 transition-all text-sm font-medium min-h-[120px] outline-none resize-none shadow-inner" })),
                react_1.default.createElement("div", { className: "space-y-4" },
                    react_1.default.createElement("label", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2" },
                        react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 12, className: "text-red-500" }),
                        "R\u00E9ponse Attendue"),
                    react_1.default.createElement("textarea", { value: newQuestion.answerFr, onChange: function (e) { return setNewQuestion(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { answerFr: e.target.value })); }, placeholder: "Quels sont les points cl\u00E9s d'une bonne r\u00E9ponse ?", className: "w-full p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-red-500 focus:ring-8 focus:ring-red-500/5 transition-all text-sm font-medium min-h-[120px] outline-none resize-none shadow-inner" }))))));
};
var QuestionBank = function (props) {
    if (props.isCareerPortal) {
        var isCareerPortal_1 = props.isCareerPortal, careerProps = tslib_1.__rest(props, ["isCareerPortal"]);
        return react_1.default.createElement(QuestionBankCareerPortal, tslib_1.__assign({}, careerProps));
    }
    var isCareerPortal = props.isCareerPortal, interviewProps = tslib_1.__rest(props, ["isCareerPortal"]);
    return react_1.default.createElement(QuestionBankInterview, tslib_1.__assign({}, interviewProps));
};
exports.QuestionBank = QuestionBank;
//# sourceMappingURL=InterviewQuestion.js.map