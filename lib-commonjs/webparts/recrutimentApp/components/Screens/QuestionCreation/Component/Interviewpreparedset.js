"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewPreparedSet = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
require("./Interviewmode.scss");
require("../Questioncreation.scss");
var InterviewPreparedSet = function (_a) {
    var questions = _a.questions, onRemove = _a.onRemove, onEdit = _a.onEdit;
    return (react_1.default.createElement("div", { className: "iq-prepared" },
        react_1.default.createElement("div", { className: "iq-prepared__header" },
            react_1.default.createElement("div", { className: "iq-prepared__header-left" },
                react_1.default.createElement("div", { className: "iq-prepared__icon" },
                    react_1.default.createElement(lucide_react_1.ClipboardList, { size: 26 })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h3", { className: "iq-prepared__title" }, "Prepared Interview Set"),
                    react_1.default.createElement("p", { className: "iq-prepared__subtitle" }, "Review and organize your selected questions"))),
            react_1.default.createElement("div", { className: "iq-prepared__count-badge" },
                react_1.default.createElement("span", { className: "iq-prepared__count-dot" }),
                questions.length,
                " Questions Selected")),
        react_1.default.createElement("div", { className: "iq-prepared__body" }, questions.length === 0 ? (react_1.default.createElement("div", { className: "iq-prepared__empty" },
            react_1.default.createElement("div", { className: "iq-prepared__empty-icon" },
                react_1.default.createElement(lucide_react_1.Plus, { size: 36 })),
            react_1.default.createElement("p", { className: "iq-prepared__empty-title" }, "No questions added to the set yet"),
            react_1.default.createElement("p", { className: "iq-prepared__empty-sub" }, "Add from the library or create a custom one above"))) : (react_1.default.createElement(framer_motion_1.AnimatePresence, null, questions.map(function (q, idx) { return (react_1.default.createElement(framer_motion_1.motion.div, { key: q.id, layout: true, className: "iq-prepared__card", initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, x: 50 }, transition: { duration: 0.25, ease: "easeOut" } },
            react_1.default.createElement("div", { className: "iq-prepared__card-inner" },
                react_1.default.createElement("div", { className: "iq-prepared__card-meta" },
                    react_1.default.createElement("span", { className: "iq-prepared__num" }, idx + 1),
                    react_1.default.createElement("span", { className: "iq-prepared__source-badge ".concat(q.fromBank ? "iq-prepared__source-badge--library" : "iq-prepared__source-badge--custom") }, q.fromBank ? "Library Asset" : "Custom Draft")),
                react_1.default.createElement("div", { className: "iq-prepared__card-content" },
                    react_1.default.createElement("div", { className: "iq-prepared__lang-block" },
                        react_1.default.createElement("div", { className: "iq-prepared__lang-indicator" },
                            react_1.default.createElement("span", { className: "iq-prepared__lang-dot iq-prepared__lang-dot--en" }),
                            react_1.default.createElement("span", { className: "iq-prepared__lang-label" }, "English Version")),
                        react_1.default.createElement("p", { className: "iq-prepared__question-text" }, q.questionEn),
                        q.answerEn && (react_1.default.createElement("div", { className: "iq-prepared__answer-block" },
                            react_1.default.createElement("span", { className: "iq-prepared__answer-label iq-prepared__answer-label--en" }, "Expected Answer"),
                            react_1.default.createElement("p", { className: "iq-prepared__answer-text" }, q.answerEn)))),
                    react_1.default.createElement("div", { className: "iq-prepared__lang-block" },
                        react_1.default.createElement("div", { className: "iq-prepared__lang-indicator" },
                            react_1.default.createElement("span", { className: "iq-prepared__lang-dot iq-prepared__lang-dot--fr" }),
                            react_1.default.createElement("span", { className: "iq-prepared__lang-label" }, "Version Fran\u00E7aise")),
                        react_1.default.createElement("p", { className: "iq-prepared__question-text iq-prepared__question-text--italic" }, q.questionFr),
                        q.answerFr && (react_1.default.createElement("div", { className: "iq-prepared__answer-block" },
                            react_1.default.createElement("span", { className: "iq-prepared__answer-label iq-prepared__answer-label--fr" }, "R\u00E9ponse Attendue"),
                            react_1.default.createElement("p", { className: "iq-prepared__answer-text iq-prepared__answer-text--italic" }, q.answerFr)))))),
            react_1.default.createElement("button", { className: "iq-prepared__remove", onClick: function () { return onEdit(q.id); }, title: "Edit" },
                react_1.default.createElement(lucide_react_1.Pencil, { size: 16 })),
            react_1.default.createElement("button", { className: "iq-prepared__remove", onClick: function () { return onRemove(q.id); }, title: "Remove" },
                react_1.default.createElement(lucide_react_1.X, { size: 16 })))); }))))));
};
exports.InterviewPreparedSet = InterviewPreparedSet;
//# sourceMappingURL=Interviewpreparedset.js.map