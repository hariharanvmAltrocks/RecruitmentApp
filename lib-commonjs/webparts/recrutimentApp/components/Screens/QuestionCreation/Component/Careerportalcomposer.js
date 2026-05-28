"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerPortalComposer = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
require("./Interviewmode.scss");
require("../Questioncreation.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var CareerPortalComposer = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var newQuestion = _a.newQuestion, onChange = _a.onChange, onAdd = _a.onAdd, onClear = _a.onClear;
    var toggleOptionCorrect = function (optionId) {
        if (!newQuestion.options)
            return;
        var updated = newQuestion.options.map(function (opt) {
            if (newQuestion.type === "single") {
                return tslib_1.__assign(tslib_1.__assign({}, opt), { isCorrect: opt.id === optionId });
            }
            return opt.id === optionId ? tslib_1.__assign(tslib_1.__assign({}, opt), { isCorrect: !opt.isCorrect }) : opt;
        });
        onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { options: updated }));
    };
    var updateOptionText = function (optionId, field, value) {
        if (!newQuestion.options)
            return;
        var updated = newQuestion.options.map(function (opt) {
            var _a;
            return opt.id === optionId ? tslib_1.__assign(tslib_1.__assign({}, opt), (_a = {}, _a[field] = value, _a)) : opt;
        });
        onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { options: updated }));
    };
    var addOption = function () {
        if (!newQuestion.options)
            return;
        onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { options: tslib_1.__spreadArray(tslib_1.__spreadArray([], newQuestion.options, true), [
                { id: String(Date.now()), textEn: "", textFr: "", isCorrect: false },
            ], false) }));
    };
    var removeOption = function (id) {
        if (!newQuestion.options || newQuestion.options.length <= 2)
            return;
        onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { options: newQuestion.options.filter(function (o) { return o.id !== id; }) }));
    };
    var canAdd = !!newQuestion.questionEn &&
        !!newQuestion.questionFr &&
        ((_b = newQuestion.options) === null || _b === void 0 ? void 0 : _b.some(function (o) { return o.isCorrect; })) &&
        ((_c = newQuestion.options) === null || _c === void 0 ? void 0 : _c.every(function (o) { return o.textEn && o.textFr; })) &&
        (newQuestion.type === "multiple"
            ? ((_d = newQuestion.options) === null || _d === void 0 ? void 0 : _d.filter(function (o) { return o.isCorrect; }).length) >= 2
            : true);
    return (react_1.default.createElement("div", { className: "qc-composer" },
        react_1.default.createElement("div", { className: "qc-composer__header" },
            react_1.default.createElement("h3", { className: "qc-composer__title" },
                react_1.default.createElement("span", { className: "qc-composer__title-bar" }),
                strings.CreateMinimumCriteria),
            react_1.default.createElement("div", { className: "qc-composer__type-toggle" },
                react_1.default.createElement("button", { className: "qc-composer__type-btn ".concat(newQuestion.type === "single" ? "qc-composer__type-btn--active" : ""), onClick: function () { return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { type: "single" })); } }, strings.SingleChoice),
                react_1.default.createElement("button", { className: "qc-composer__type-btn ".concat(newQuestion.type === "multiple" ? "qc-composer__type-btn--active" : ""), onClick: function () { return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { type: "multiple" })); } }, strings.MultipleChoice))),
        react_1.default.createElement("div", { className: "qc-composer__body" },
            react_1.default.createElement("div", { className: "qc-composer__questions-grid" },
                react_1.default.createElement("div", { className: "qc-composer__field" },
                    react_1.default.createElement("label", { className: "qc-composer__label qc-composer__label--en" },
                        react_1.default.createElement(lucide_react_1.Globe, { size: 11 }),
                        " ",
                        strings.EnglishQuestion),
                    react_1.default.createElement("textarea", { className: "qc-composer__textarea", placeholder: strings.EnterQuestionInEnglish, value: (_e = newQuestion.questionEn) !== null && _e !== void 0 ? _e : "", onChange: function (e) {
                            return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { questionEn: e.target.value }));
                        } })),
                react_1.default.createElement("div", { className: "qc-composer__field" },
                    react_1.default.createElement("label", { className: "qc-composer__label qc-composer__label--fr" },
                        react_1.default.createElement(lucide_react_1.Globe, { size: 11 }),
                        " ",
                        strings.FrenchQuestion),
                    react_1.default.createElement("textarea", { className: "qc-composer__textarea qc-composer__textarea--italic", placeholder: strings.SaisirLaQuestionEnFranAis, value: (_f = newQuestion.questionFr) !== null && _f !== void 0 ? _f : "", onChange: function (e) {
                            return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { questionFr: e.target.value }));
                        } }))),
            react_1.default.createElement("div", { className: "qc-composer__options-section" },
                react_1.default.createElement("div", { className: "qc-composer__options-header" },
                    react_1.default.createElement("span", { className: "qc-composer__options-label" }, strings.AnswerOptions),
                    react_1.default.createElement("button", { className: "qc-composer__add-option", onClick: addOption },
                        react_1.default.createElement(lucide_react_1.Plus, { size: 11 }),
                        " ",
                        strings.AddOption)),
                react_1.default.createElement(framer_motion_1.AnimatePresence, null, (_g = newQuestion.options) === null || _g === void 0 ? void 0 : _g.map(function (opt) { return (react_1.default.createElement(framer_motion_1.motion.div, { key: opt.id, className: "qc-composer__option-row", initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.2 } },
                    react_1.default.createElement("button", { className: "qc-composer__option-check ".concat(opt.isCorrect ? "qc-composer__option-check--active" : ""), onClick: function () { return toggleOptionCorrect(opt.id); } }, newQuestion.type === "single" ? (opt.isCorrect ? (react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 22 })) : (react_1.default.createElement(lucide_react_1.Circle, { size: 22 }))) : opt.isCorrect ? (react_1.default.createElement(lucide_react_1.CheckSquare, { size: 22 })) : (react_1.default.createElement(lucide_react_1.Square, { size: 22 }))),
                    react_1.default.createElement("div", { className: "qc-composer__option-inputs" },
                        react_1.default.createElement("input", { type: "text", className: "qc-composer__option-input", placeholder: strings.OptionEnglish, value: opt.textEn, onChange: function (e) {
                                return updateOptionText(opt.id, "textEn", e.target.value);
                            } }),
                        react_1.default.createElement("input", { type: "text", className: "qc-composer__option-input qc-composer__option-input--italic", placeholder: strings.OptionFranAis, value: opt.textFr, onChange: function (e) {
                                return updateOptionText(opt.id, "textFr", e.target.value);
                            } })),
                    react_1.default.createElement("button", { className: "qc-composer__option-remove", onClick: function () { return removeOption(opt.id); }, title: strings.RemoveOption },
                        react_1.default.createElement(lucide_react_1.X, { size: 14 })))); }))),
            react_1.default.createElement("div", { className: "qc-composer__footer" },
                react_1.default.createElement("button", { className: "qc-composer__clear-btn", onClick: onClear }, strings.ClearAll1),
                react_1.default.createElement("button", { className: "qc-composer__submit-btn ".concat(!canAdd ? "qc-composer__submit-btn--disabled" : ""), onClick: onAdd, disabled: !canAdd },
                    react_1.default.createElement(lucide_react_1.Plus, { size: 13 }),
                    " ",
                    strings.AddToCriteriaSet)))));
};
exports.CareerPortalComposer = CareerPortalComposer;
//# sourceMappingURL=Careerportalcomposer.js.map