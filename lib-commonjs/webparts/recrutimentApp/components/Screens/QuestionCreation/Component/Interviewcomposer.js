"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewComposer = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
require("./Interviewmode.scss");
require("../Questioncreation.scss");
var InterviewComposer = function (_a) {
    var _b, _c, _d, _e;
    var newQuestion = _a.newQuestion, onChange = _a.onChange, onAdd = _a.onAdd, onClear = _a.onClear;
    var canAdd = !!(newQuestion.questionEn && newQuestion.questionFr) &&
        newQuestion.answerEn &&
        newQuestion.answerFr;
    return (react_1.default.createElement("div", { className: "iq-composer" },
        react_1.default.createElement("div", { className: "iq-composer__header" },
            react_1.default.createElement("div", { className: "iq-composer__header-left" },
                react_1.default.createElement("div", { className: "iq-composer__icon" },
                    react_1.default.createElement(lucide_react_1.Plus, { size: 22 })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h3", { className: "iq-composer__title" }, "Create New Question"),
                    react_1.default.createElement("p", { className: "iq-composer__subtitle" }, "Draft custom bilingual content"))),
            react_1.default.createElement("div", { className: "iq-composer__header-actions" },
                react_1.default.createElement("button", { className: "iq-composer__clear-btn", onClick: onClear }, "Clear All"),
                react_1.default.createElement("button", { className: "iq-composer__add-btn ".concat(!canAdd ? "iq-composer__add-btn--disabled" : ""), onClick: onAdd, disabled: !canAdd },
                    react_1.default.createElement(lucide_react_1.Plus, { size: 15 }),
                    "Add to Interview Set"))),
        react_1.default.createElement("div", { className: "iq-composer__body" },
            react_1.default.createElement("div", { className: "iq-composer__col" },
                react_1.default.createElement("div", { className: "iq-composer__lang-header" },
                    react_1.default.createElement("span", { className: "iq-composer__lang-badge iq-composer__lang-badge--en" }, "EN"),
                    react_1.default.createElement("span", { className: "iq-composer__lang-title" }, "English Version")),
                react_1.default.createElement("div", { className: "iq-composer__field" },
                    react_1.default.createElement("label", { className: "iq-composer__label iq-composer__label--en" },
                        react_1.default.createElement(lucide_react_1.MessageSquare, { size: 11 }),
                        " Question Prompt"),
                    react_1.default.createElement("textarea", { className: "iq-composer__textarea", placeholder: "Enter the question in English...", value: (_b = newQuestion.questionEn) !== null && _b !== void 0 ? _b : "", onChange: function (e) {
                            return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { questionEn: e.target.value }));
                        } })),
                react_1.default.createElement("div", { className: "iq-composer__field" },
                    react_1.default.createElement("label", { className: "iq-composer__label iq-composer__label--en" },
                        react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 11 }),
                        " Expected Answer"),
                    react_1.default.createElement("textarea", { className: "iq-composer__textarea", placeholder: "What are the key points for a good answer?", value: (_c = newQuestion.answerEn) !== null && _c !== void 0 ? _c : "", onChange: function (e) {
                            return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { answerEn: e.target.value }));
                        } }))),
            react_1.default.createElement("div", { className: "iq-composer__col iq-composer__col--fr" },
                react_1.default.createElement("div", { className: "iq-composer__lang-header" },
                    react_1.default.createElement("span", { className: "iq-composer__lang-badge iq-composer__lang-badge--fr" }, "FR"),
                    react_1.default.createElement("span", { className: "iq-composer__lang-title" }, "Version Fran\u00E7aise")),
                react_1.default.createElement("div", { className: "iq-composer__field" },
                    react_1.default.createElement("label", { className: "iq-composer__label iq-composer__label--fr" },
                        react_1.default.createElement(lucide_react_1.MessageSquare, { size: 11 }),
                        " Prompt de la Question"),
                    react_1.default.createElement("textarea", { className: "iq-composer__textarea iq-composer__textarea--italic", placeholder: "Saisissez la question en fran\u00E7ais...", value: (_d = newQuestion.questionFr) !== null && _d !== void 0 ? _d : "", onChange: function (e) {
                            return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { questionFr: e.target.value }));
                        } })),
                react_1.default.createElement("div", { className: "iq-composer__field" },
                    react_1.default.createElement("label", { className: "iq-composer__label iq-composer__label--fr" },
                        react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 11 }),
                        " R\u00E9ponse Attendue"),
                    react_1.default.createElement("textarea", { className: "iq-composer__textarea iq-composer__textarea--italic", placeholder: "Quels sont les points cl\u00E9s d'une bonne r\u00E9ponse ?", value: (_e = newQuestion.answerFr) !== null && _e !== void 0 ? _e : "", onChange: function (e) {
                            return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { answerFr: e.target.value }));
                        } }))))));
};
exports.InterviewComposer = InterviewComposer;
//# sourceMappingURL=Interviewcomposer.js.map