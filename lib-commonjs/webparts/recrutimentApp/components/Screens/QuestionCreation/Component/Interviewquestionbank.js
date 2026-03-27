"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewQuestionBank = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
require("./Interviewmode.scss");
require("../Questioncreation.scss");
var SkeletonCard = function () { return (react_1.default.createElement("div", { className: "iq-bank__skeleton" },
    react_1.default.createElement("div", { className: "iq-bank__skeleton-header" }),
    react_1.default.createElement("div", { className: "iq-bank__skeleton-line iq-bank__skeleton-line--long" }),
    react_1.default.createElement("div", { className: "iq-bank__skeleton-line iq-bank__skeleton-line--short" }))); };
var InterviewQuestionBank = function (_a) {
    var questionBank = _a.questionBank, loading = _a.loading, preparedQuestionIds = _a.preparedQuestionIds, onAddFromBank = _a.onAddFromBank;
    return (react_1.default.createElement("div", { className: "iq-bank" },
        react_1.default.createElement("div", { className: "iq-bank__header" },
            react_1.default.createElement("div", { className: "iq-bank__icon" },
                react_1.default.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5" },
                    react_1.default.createElement("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }),
                    react_1.default.createElement("path", { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" }))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("h3", { className: "iq-bank__title" }, "Question Bank"),
                react_1.default.createElement("p", { className: "iq-bank__subtitle" }, "Reuse Standard Questions"))),
        react_1.default.createElement("div", { className: "iq-bank__list" }, loading ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(SkeletonCard, null),
            react_1.default.createElement(SkeletonCard, null),
            react_1.default.createElement(SkeletonCard, null))) : questionBank.length === 0 ? (react_1.default.createElement("div", { className: "iq-bank__empty" },
            react_1.default.createElement("p", { className: "iq-bank__empty-text" }, "No templates available"))) : (react_1.default.createElement(framer_motion_1.AnimatePresence, null, questionBank.map(function (q, i) {
            var isAdded = preparedQuestionIds.includes(q.id);
            return (react_1.default.createElement(framer_motion_1.motion.div, { key: q.id, className: "iq-bank__card ".concat(isAdded ? "iq-bank__card--added" : ""), initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.04, duration: 0.28, ease: "easeOut" } },
                react_1.default.createElement("div", { className: "iq-bank__card-top" },
                    react_1.default.createElement("span", { className: "iq-bank__template-label" },
                        i + 1,
                        "\u00A0\u00A0Standard Template"),
                    react_1.default.createElement("button", { className: "iq-bank__add-btn ".concat(isAdded ? "iq-bank__add-btn--added" : ""), onClick: function () { return !isAdded && onAddFromBank(q); }, title: isAdded ? "Already added" : "Add to interview set" }, isAdded ? react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 15 }) : react_1.default.createElement(lucide_react_1.Plus, { size: 15 }))),
                react_1.default.createElement("div", { className: "iq-bank__card-body" },
                    react_1.default.createElement("div", { className: "iq-bank__lang-row" },
                        react_1.default.createElement("span", { className: "iq-bank__lang-pill iq-bank__lang-pill--en" }, "EN"),
                        react_1.default.createElement("p", { className: "iq-bank__question-text" }, q.questionEn)),
                    react_1.default.createElement("div", { className: "iq-bank__lang-row" },
                        react_1.default.createElement("span", { className: "iq-bank__lang-pill iq-bank__lang-pill--fr" }, "FR"),
                        react_1.default.createElement("p", { className: "iq-bank__question-text iq-bank__question-text--italic" }, q.questionFr)))));
        }))))));
};
exports.InterviewQuestionBank = InterviewQuestionBank;
//# sourceMappingURL=Interviewquestionbank.js.map