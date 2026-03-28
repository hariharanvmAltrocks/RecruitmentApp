"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var QuestionnaireTab = function (_a) {
    var questions = _a.questions;
    if (!questions || questions.length === 0) {
        return (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.questionnaireSection },
            react_1.default.createElement("h3", null, "Panel Questions"),
            react_1.default.createElement("p", null, "No questions available for this position.")));
    }
    return (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.questionnaireSection },
        react_1.default.createElement("h3", null, "Panel Questions"),
        react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.questionsList }, questions.map(function (question, index) { return (react_1.default.createElement("div", { key: question.id, className: ReviewScorecard_module_scss_1.default.questionItem },
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.questionHeader },
                react_1.default.createElement("span", { className: ReviewScorecard_module_scss_1.default.questionNumber },
                    "Q",
                    index + 1),
                react_1.default.createElement("span", { className: ReviewScorecard_module_scss_1.default.questionText }, question.question)),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.questionAnswer },
                react_1.default.createElement("strong", null, "Expected Answer:"),
                " ",
                question.answer),
            question.rating !== null && (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.questionRating },
                react_1.default.createElement("strong", null, "Rating:"),
                " ",
                question.rating,
                "/5")))); }))));
};
exports.default = QuestionnaireTab;
//# sourceMappingURL=QuestionnaireTab.js.map