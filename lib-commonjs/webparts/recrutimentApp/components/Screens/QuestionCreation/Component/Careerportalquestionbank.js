"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerPortalQuestionBank = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
require("./Interviewmode.scss");
require("../Questioncreation.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var QuestionTypeBadge = function (_a) {
    var type = _a.type;
    return (react_1.default.createElement("span", { className: "qc-badge qc-badge--".concat(type) }, type === "single" ? strings.SingleChoice : strings.MultipleChoice));
};
var SkeletonCard = function () { return (react_1.default.createElement("div", { className: "qc-bank__skeleton" },
    react_1.default.createElement("div", { className: "qc-bank__skeleton-header" }),
    react_1.default.createElement("div", { className: "qc-bank__skeleton-line qc-bank__skeleton-line--long" }),
    react_1.default.createElement("div", { className: "qc-bank__skeleton-line qc-bank__skeleton-line--short" }),
    react_1.default.createElement("div", { className: "qc-bank__skeleton-line qc-bank__skeleton-line--medium" }))); };
var CareerPortalQuestionBank = function (_a) {
    var questionBank = _a.questionBank, loading = _a.loading, preparedQuestionIds = _a.preparedQuestionIds, searchQuery = _a.searchQuery, onSearchChange = _a.onSearchChange, onAddFromBank = _a.onAddFromBank;
    var filtered = (0, react_1.useMemo)(function () {
        return questionBank.filter(function (q) {
            return q.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.questionFr.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [questionBank, searchQuery]);
    return (react_1.default.createElement("div", { className: "qc-bank" },
        react_1.default.createElement("div", { className: "qc-bank__header" },
            react_1.default.createElement("div", { className: "qc-bank__title-row" },
                react_1.default.createElement("h3", { className: "qc-bank__title" },
                    react_1.default.createElement("span", { className: "qc-bank__title-bar" }),
                    strings.QuestionBank),
                react_1.default.createElement("span", { className: "qc-bank__count" },
                    questionBank.length,
                    " ",
                    strings.Templates))),
        react_1.default.createElement("div", { className: "qc-bank__list" }, loading ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(SkeletonCard, null),
            react_1.default.createElement(SkeletonCard, null),
            react_1.default.createElement(SkeletonCard, null))) : filtered.length === 0 ? (react_1.default.createElement("div", { className: "qc-bank__empty" },
            react_1.default.createElement("p", { className: "qc-bank__empty-text" }, strings.NoQuestionsFound))) : (react_1.default.createElement(framer_motion_1.AnimatePresence, null, filtered.map(function (q, i) {
            var isAdded = preparedQuestionIds.includes(q.id);
            return (react_1.default.createElement(framer_motion_1.motion.div, { key: q.id, className: "qc-bank__card ".concat(isAdded ? "qc-bank__card--added" : ""), initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: {
                    delay: i * 0.05,
                    duration: 0.3,
                    ease: "easeOut",
                }, whileHover: { scale: 1.01, transition: { duration: 0.15 } } },
                react_1.default.createElement("div", { className: "qc-bank__card-header" },
                    react_1.default.createElement(QuestionTypeBadge, { type: q.type }),
                    react_1.default.createElement("button", { className: "qc-bank__add-btn ".concat(isAdded ? "qc-bank__add-btn--added" : ""), onClick: function () { return !isAdded && onAddFromBank(q); }, title: isAdded ? strings.AlreadyAdded : strings.AddToCriteria }, isAdded ? (react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 16 })) : (react_1.default.createElement(lucide_react_1.Plus, { size: 16 })))),
                react_1.default.createElement("div", { className: "qc-bank__card-body" },
                    react_1.default.createElement("div", { className: "qc-bank__lang-block" },
                        react_1.default.createElement("span", { className: "qc-bank__lang-label qc-bank__lang-label--en" }, strings.English),
                        react_1.default.createElement("p", { className: "qc-bank__question-text" }, q.questionEn)),
                    react_1.default.createElement("div", { className: "qc-bank__divider" }),
                    react_1.default.createElement("div", { className: "qc-bank__lang-block" },
                        react_1.default.createElement("span", { className: "qc-bank__lang-label qc-bank__lang-label--fr" }, strings.FranAis),
                        react_1.default.createElement("p", { className: "qc-bank__question-text qc-bank__question-text--italic" }, q.questionFr)))));
        }))))));
};
exports.CareerPortalQuestionBank = CareerPortalQuestionBank;
//# sourceMappingURL=Careerportalquestionbank.js.map