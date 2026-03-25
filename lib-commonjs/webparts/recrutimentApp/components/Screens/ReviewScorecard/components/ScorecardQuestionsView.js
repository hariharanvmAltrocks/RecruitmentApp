"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ScorecardQuestionsView_module_scss_1 = tslib_1.__importDefault(require("./ScorecardQuestionsView.module.scss"));
var ScorecardQuestionsView = function (_a) {
    var questionnaire = _a.questionnaire, onClose = _a.onClose;
    return (React.createElement("div", { className: ScorecardQuestionsView_module_scss_1.default.qaContainer },
        React.createElement("div", { className: ScorecardQuestionsView_module_scss_1.default.qaHeader },
            React.createElement("h3", null, "Questions and Answers")),
        React.createElement("div", { className: ScorecardQuestionsView_module_scss_1.default.qaBody }, questionnaire && questionnaire.length > 0 ? (questionnaire.map(function (q, index) {
            var _a;
            return (React.createElement("div", { key: q.id || index, className: ScorecardQuestionsView_module_scss_1.default.questionCard },
                React.createElement("div", { className: ScorecardQuestionsView_module_scss_1.default.questionTitle },
                    React.createElement("span", { className: ScorecardQuestionsView_module_scss_1.default.qNumber },
                        "Q",
                        index + 1),
                    React.createElement("p", { dangerouslySetInnerHTML: {
                            __html: (_a = q.question) === null || _a === void 0 ? void 0 : _a.replace(/<p>/gi, "").replace(/<\/p>/gi, "").replace(/<br\s*\/?>/gi, "").trim(),
                        } })),
                React.createElement("div", { className: ScorecardQuestionsView_module_scss_1.default.answerBox },
                    React.createElement("strong", null, "Expected Answer:"),
                    React.createElement("p", { dangerouslySetInnerHTML: { __html: q.answer || "No answer provided" } }))));
        })) : (React.createElement("div", { className: ScorecardQuestionsView_module_scss_1.default.noData },
            React.createElement("p", null, "No Questions and Answers found for this candidate.")))),
        React.createElement("div", { className: ScorecardQuestionsView_module_scss_1.default.qaFooter },
            React.createElement("button", { className: ScorecardQuestionsView_module_scss_1.default.closeBtn, onClick: onClose }, "Close View"))));
};
exports.default = ScorecardQuestionsView;
//# sourceMappingURL=ScorecardQuestionsView.js.map