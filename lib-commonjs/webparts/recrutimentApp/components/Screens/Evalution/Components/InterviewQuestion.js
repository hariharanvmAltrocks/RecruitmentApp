"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var InterviewQuestion_module_scss_1 = tslib_1.__importDefault(require("./InterviewQuestion.module.scss"));
var ScoreRating = [
    { key: 1, text: 'Not Acceptable' },
    { key: 2, text: 'Acceptable' },
    { key: 3, text: 'Excellent' },
];
function cleanHTML(text) {
    if (text === void 0) { text = ''; }
    return text
        .replace(/<p>/gi, '')
        .replace(/<\/p>/gi, '')
        .replace(/<br\s*\/?>/gi, '')
        .trim();
}
function InterviewQuestionList(_a) {
    var questions = _a.questions, answers = _a.answers, ratingErrors = _a.ratingErrors, onAnswerChange = _a.onAnswerChange;
    if (!questions.length)
        return React.createElement(React.Fragment, null);
    return (React.createElement("section", null,
        React.createElement("div", { className: InterviewQuestion_module_scss_1.default.sectionTitle },
            React.createElement("div", { className: InterviewQuestion_module_scss_1.default.sectionAccentOrange }),
            React.createElement("div", null,
                React.createElement("h2", { className: InterviewQuestion_module_scss_1.default.sectionH2 }, "INTERVIEW QUESTIONNAIRES"),
                React.createElement("p", { className: InterviewQuestion_module_scss_1.default.sectionSub }, "Technical & Behavioral Assessment")),
            React.createElement("div", { className: InterviewQuestion_module_scss_1.default.ratingGuide },
                React.createElement("span", { className: InterviewQuestion_module_scss_1.default.ratingGuideLabel }, "RATING GUIDE:"),
                React.createElement("span", { className: "".concat(InterviewQuestion_module_scss_1.default.dot, " ").concat(InterviewQuestion_module_scss_1.default.dotGreen) }),
                React.createElement("span", { className: InterviewQuestion_module_scss_1.default.guideItem },
                    "3 - ",
                    React.createElement("b", null, "Excellent")),
                React.createElement("span", { className: "".concat(InterviewQuestion_module_scss_1.default.dot, " ").concat(InterviewQuestion_module_scss_1.default.dotBlue) }),
                React.createElement("span", { className: InterviewQuestion_module_scss_1.default.guideItem },
                    "2 - ",
                    React.createElement("b", null, "Acceptable")),
                React.createElement("span", { className: "".concat(InterviewQuestion_module_scss_1.default.dot, " ").concat(InterviewQuestion_module_scss_1.default.dotRed) }),
                React.createElement("span", { className: InterviewQuestion_module_scss_1.default.guideItem },
                    "1 - ",
                    React.createElement("b", null, "Not Acceptable")))),
        questions.map(function (question, idx) {
            var _a;
            var answer = answers[question.id];
            var questionHasError = (answer === null || answer === void 0 ? void 0 : answer.rating) === null || (answer === null || answer === void 0 ? void 0 : answer.rating) === undefined;
            var showError = (ratingErrors === null || ratingErrors === void 0 ? void 0 : ratingErrors[question.id]) || (questionHasError && Object.keys(ratingErrors || {}).length > 0);
            return (React.createElement("div", { key: question.id, className: [InterviewQuestion_module_scss_1.default.qCard, showError ? InterviewQuestion_module_scss_1.default.qCardError : ''].filter(Boolean).join(' ') },
                React.createElement("div", { className: InterviewQuestion_module_scss_1.default.qTop },
                    React.createElement("span", { className: InterviewQuestion_module_scss_1.default.qBadge },
                        "Q",
                        idx + 1),
                    React.createElement("p", { className: InterviewQuestion_module_scss_1.default.qText, dangerouslySetInnerHTML: { __html: cleanHTML(question.text) } })),
                question.expectedResponse && (React.createElement("div", { className: InterviewQuestion_module_scss_1.default.guideBox },
                    React.createElement("div", { className: InterviewQuestion_module_scss_1.default.guideBoxHeader },
                        React.createElement("span", { className: InterviewQuestion_module_scss_1.default.guideCheck }, "\u2705"),
                        React.createElement("span", { className: InterviewQuestion_module_scss_1.default.guideBoxLabel }, "EXPECTED RESPONSE GUIDE"),
                        React.createElement("span", { className: InterviewQuestion_module_scss_1.default.guideBoxIcon }, "\uD83D\uDCCB")),
                    React.createElement("p", { className: InterviewQuestion_module_scss_1.default.guideBoxText, dangerouslySetInnerHTML: { __html: cleanHTML(question.expectedResponse) } }))),
                React.createElement("div", { className: InterviewQuestion_module_scss_1.default.qBottom },
                    React.createElement("div", null,
                        React.createElement("p", { className: InterviewQuestion_module_scss_1.default.panelRatingLabel },
                            "PANEL RATING ",
                            React.createElement("span", { className: InterviewQuestion_module_scss_1.default.req }, "*")),
                        React.createElement("div", { className: InterviewQuestion_module_scss_1.default.ratingBtnRow }, ScoreRating.map(function (_a) {
                            var key = _a.key, text = _a.text;
                            var active = (answer === null || answer === void 0 ? void 0 : answer.rating) === key;
                            var btnClass = [
                                InterviewQuestion_module_scss_1.default.ratingBtn,
                                active && key === 3 ? InterviewQuestion_module_scss_1.default.ratingExcellent : '',
                                active && key === 2 ? InterviewQuestion_module_scss_1.default.ratingAcceptable : '',
                                active && key === 1 ? InterviewQuestion_module_scss_1.default.ratingNotAcceptable : '',
                            ].filter(Boolean).join(' ');
                            return (React.createElement("button", { key: key, className: btnClass, onClick: function () { return onAnswerChange(question.id, { rating: key }); } }, text));
                        }))),
                    React.createElement("div", { className: InterviewQuestion_module_scss_1.default.scoreDisplay },
                        React.createElement("span", { className: InterviewQuestion_module_scss_1.default.scoreLabel }, "SCORE"),
                        React.createElement("span", { className: InterviewQuestion_module_scss_1.default.scoreNum }, (_a = answer === null || answer === void 0 ? void 0 : answer.rating) !== null && _a !== void 0 ? _a : 0,
                            React.createElement("span", { className: InterviewQuestion_module_scss_1.default.scoreMax }, "/3"))))));
        })));
}
exports.default = InterviewQuestionList;
//# sourceMappingURL=InterviewQuestion.js.map