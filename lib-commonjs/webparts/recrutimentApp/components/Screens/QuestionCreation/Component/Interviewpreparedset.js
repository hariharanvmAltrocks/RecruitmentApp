"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewPreparedSet = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
require("./Interviewmode.scss");
require("../Questioncreation.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var InterviewPreparedSet = function (_a) {
    var questions = _a.questions, onRemove = _a.onRemove, onEdit = _a.onEdit, EditFlag = _a.EditFlag;
    return (react_1.default.createElement("div", { className: "iq-prepared" },
        react_1.default.createElement("div", { className: "iq-prepared__header" },
            react_1.default.createElement("div", { className: "iq-prepared__header-left" },
                react_1.default.createElement("div", { className: "iq-prepared__icon" },
                    react_1.default.createElement(lucide_react_1.ClipboardList, { size: 26 })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h3", { className: "iq-prepared__title" }, strings.PreparedInterviewSet),
                    react_1.default.createElement("p", { className: "iq-prepared__subtitle" }, strings.ReviewAndOrganizeYourSelectedQuestions))),
            react_1.default.createElement("div", { className: "iq-prepared__count-badge" },
                react_1.default.createElement("span", { className: "iq-prepared__count-dot" }),
                questions.length,
                " ",
                strings.QuestionsSelected)),
        react_1.default.createElement("div", { className: "iq-prepared__body" }, questions.length === 0 ? (react_1.default.createElement("div", { className: "iq-prepared__empty" },
            react_1.default.createElement("div", { className: "iq-prepared__empty-icon" },
                react_1.default.createElement(lucide_react_1.Plus, { size: 36 })),
            react_1.default.createElement("p", { className: "iq-prepared__empty-title" }, strings.NoQuestionsAddedToTheSetYet),
            react_1.default.createElement("p", { className: "iq-prepared__empty-sub" }, strings.AddFromTheLibraryOrCreateACustomOneAbove))) : (react_1.default.createElement(framer_motion_1.AnimatePresence, null, questions.map(function (q, idx) { return (react_1.default.createElement(framer_motion_1.motion.div, { key: q.id, layout: true, className: "iq-prepared__card", initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, x: 50 }, transition: { duration: 0.25, ease: "easeOut" } },
            react_1.default.createElement("div", { className: "iq-prepared__card-inner" },
                react_1.default.createElement("div", { className: "iq-prepared__card-meta" },
                    react_1.default.createElement("span", { className: "iq-prepared__num" }, idx + 1),
                    react_1.default.createElement("span", { className: "iq-prepared__source-badge ".concat(q.fromBank ? "iq-prepared__source-badge--library" : "iq-prepared__source-badge--custom") }, q.fromBank ? strings.LibraryAsset : strings.CustomDraft)),
                react_1.default.createElement("div", { className: "iq-prepared__card-content" },
                    react_1.default.createElement("div", { className: "iq-prepared__lang-block" },
                        react_1.default.createElement("div", { className: "iq-prepared__lang-indicator" },
                            react_1.default.createElement("span", { className: "iq-prepared__lang-dot iq-prepared__lang-dot--en" }),
                            react_1.default.createElement("span", { className: "iq-prepared__lang-label" }, strings.EnglishVersion)),
                        react_1.default.createElement("p", { className: "iq-prepared__question-text" }, q.questionEn),
                        q.answerEn && (react_1.default.createElement("div", { className: "iq-prepared__answer-block" },
                            react_1.default.createElement("span", { className: "iq-prepared__answer-label iq-prepared__answer-label--en" }, strings.ExpectedAnswer),
                            react_1.default.createElement("p", { className: "iq-prepared__answer-text" }, q.answerEn)))),
                    react_1.default.createElement("div", { className: "iq-prepared__lang-block" },
                        react_1.default.createElement("div", { className: "iq-prepared__lang-indicator" },
                            react_1.default.createElement("span", { className: "iq-prepared__lang-dot iq-prepared__lang-dot--fr" }),
                            react_1.default.createElement("span", { className: "iq-prepared__lang-label" }, strings.VersionFranAise)),
                        react_1.default.createElement("p", { className: "iq-prepared__question-text iq-prepared__question-text--italic" }, q.questionFr),
                        q.answerFr && (react_1.default.createElement("div", { className: "iq-prepared__answer-block" },
                            react_1.default.createElement("span", { className: "iq-prepared__answer-label iq-prepared__answer-label--fr" }, strings.RPonseAttendue),
                            react_1.default.createElement("p", { className: "iq-prepared__answer-text iq-prepared__answer-text--italic" }, q.answerFr)))))),
            !q.fromBank && EditFlag && (react_1.default.createElement("button", { className: "iq-prepared__remove", onClick: function () { return onEdit(q.id); }, title: strings.Edit },
                react_1.default.createElement(lucide_react_1.Pencil, { size: 16 }))),
            react_1.default.createElement("button", { className: "iq-prepared__remove", onClick: function () { return onRemove(q.id); }, title: strings.Remove },
                react_1.default.createElement(lucide_react_1.X, { size: 16 })))); }))))));
};
exports.InterviewPreparedSet = InterviewPreparedSet;
//# sourceMappingURL=Interviewpreparedset.js.map