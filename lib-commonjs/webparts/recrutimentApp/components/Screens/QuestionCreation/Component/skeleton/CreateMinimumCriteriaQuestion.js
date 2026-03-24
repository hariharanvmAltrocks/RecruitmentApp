"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreparedCriteriaSet = exports.CreateMinimumCriteriaQuestion = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
require("../../Questioncreation.scss");
var CreateMinimumCriteriaQuestion = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var newQuestion = _a.newQuestion, onChange = _a.onChange, onAdd = _a.onAdd, onClear = _a.onClear, isCareerPortal = _a.isCareerPortal;
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
        var newId = String(Date.now());
        onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { options: tslib_1.__spreadArray(tslib_1.__spreadArray([], newQuestion.options, true), [
                { id: newId, textEn: "", textFr: "", isCorrect: false },
            ], false) }));
    };
    var removeOption = function (id) {
        if (!newQuestion.options || newQuestion.options.length <= 2)
            return;
        onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { options: newQuestion.options.filter(function (o) { return o.id !== id; }) }));
    };
    var canAdd = (!!newQuestion.questionEn || !!newQuestion.questionFr) &&
        ((_b = newQuestion.options) === null || _b === void 0 ? void 0 : _b.some(function (o) { return o.isCorrect; }));
    return (react_1.default.createElement("div", { className: "qc-composer" },
        react_1.default.createElement("div", { className: "qc-composer__header" },
            react_1.default.createElement("h3", { className: "qc-composer__title" },
                react_1.default.createElement("span", { className: "qc-composer__title-bar" }),
                isCareerPortal ? "Create Minimum Criteria" : "Create Interview Question"),
            isCareerPortal && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "qc-composer__type-toggle" },
                    react_1.default.createElement("button", { className: "qc-composer__type-btn ".concat(newQuestion.type === "single" ? "qc-composer__type-btn--active" : ""), onClick: function () { return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { type: "single" })); } }, "Single Choice"),
                    react_1.default.createElement("button", { className: "qc-composer__type-btn ".concat(newQuestion.type === "multiple" ? "qc-composer__type-btn--active" : ""), onClick: function () { return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { type: "multiple" })); } }, "Multiple Choice"))))),
        react_1.default.createElement("div", { className: "qc-composer__body" },
            react_1.default.createElement("div", { className: "qc-composer__questions-grid" },
                react_1.default.createElement("div", { className: "qc-composer__field" },
                    react_1.default.createElement("label", { className: "qc-composer__label qc-composer__label--en" },
                        react_1.default.createElement(lucide_react_1.Globe, { size: 11 }),
                        " English Question"),
                    react_1.default.createElement("textarea", { className: "qc-composer__textarea", placeholder: "Enter question in English...", value: (_c = newQuestion.questionEn) !== null && _c !== void 0 ? _c : "", onChange: function (e) { return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { questionEn: e.target.value })); } })),
                react_1.default.createElement("div", { className: "qc-composer__field" },
                    react_1.default.createElement("label", { className: "qc-composer__label qc-composer__label--fr" },
                        react_1.default.createElement(lucide_react_1.Globe, { size: 11 }),
                        " French Question"),
                    react_1.default.createElement("textarea", { className: "qc-composer__textarea qc-composer__textarea--italic", placeholder: "Saisir la question en fran\u00E7ais...", value: (_d = newQuestion.questionFr) !== null && _d !== void 0 ? _d : "", onChange: function (e) { return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { questionFr: e.target.value })); } }))),
            isCareerPortal ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "qc-composer__options-section" },
                    react_1.default.createElement("div", { className: "qc-composer__options-header" },
                        react_1.default.createElement("span", { className: "qc-composer__options-label" }, "Answer Options"),
                        react_1.default.createElement("button", { className: "qc-composer__add-option", onClick: addOption },
                            react_1.default.createElement(lucide_react_1.Plus, { size: 11 }),
                            " Add Option")),
                    react_1.default.createElement(framer_motion_1.AnimatePresence, null, (_e = newQuestion.options) === null || _e === void 0 ? void 0 : _e.map(function (opt) { return (react_1.default.createElement(framer_motion_1.motion.div, { key: opt.id, className: "qc-composer__option-row", initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.2 } },
                        react_1.default.createElement("button", { className: "qc-composer__option-check ".concat(opt.isCorrect ? "qc-composer__option-check--active" : ""), onClick: function () { return toggleOptionCorrect(opt.id); } }, newQuestion.type === "single" ? (opt.isCorrect ? react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 22 }) : react_1.default.createElement(lucide_react_1.Circle, { size: 22 })) : (opt.isCorrect ? react_1.default.createElement(lucide_react_1.CheckSquare, { size: 22 }) : react_1.default.createElement(lucide_react_1.Square, { size: 22 }))),
                        react_1.default.createElement("div", { className: "qc-composer__option-inputs" },
                            react_1.default.createElement("input", { type: "text", className: "qc-composer__option-input", placeholder: "Option (English)", value: opt.textEn, onChange: function (e) { return updateOptionText(opt.id, "textEn", e.target.value); } }),
                            react_1.default.createElement("input", { type: "text", className: "qc-composer__option-input qc-composer__option-input--italic", placeholder: "Option (Fran\u00E7ais)", value: opt.textFr, onChange: function (e) { return updateOptionText(opt.id, "textFr", e.target.value); } })),
                        react_1.default.createElement("button", { className: "qc-composer__option-remove", onClick: function () { return removeOption(opt.id); }, title: "Remove option" },
                            react_1.default.createElement(lucide_react_1.X, { size: 14 })))); }))),
                react_1.default.createElement("div", { className: "qc-composer__footer" },
                    react_1.default.createElement("button", { className: "qc-composer__clear-btn", onClick: onClear }, "Clear All"),
                    react_1.default.createElement("button", { className: "qc-composer__submit-btn ".concat(!canAdd ? "qc-composer__submit-btn--disabled" : ""), onClick: onAdd, disabled: !canAdd },
                        react_1.default.createElement(lucide_react_1.Plus, { size: 13 }),
                        " Add to Criteria Set")))) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "qc-composer__questions-grid" },
                    react_1.default.createElement("div", { className: "qc-composer__field" },
                        react_1.default.createElement("label", { className: "qc-composer__label qc-composer__label--en" },
                            react_1.default.createElement(lucide_react_1.Globe, { size: 11 }),
                            " English Answer"),
                        react_1.default.createElement("textarea", { className: "qc-composer__textarea", placeholder: "Enter question in English...", value: (_f = newQuestion.interviewQu) !== null && _f !== void 0 ? _f : "", onChange: function (e) { return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { interviewQu: e.target.value })); } })),
                    react_1.default.createElement("div", { className: "qc-composer__field" },
                        react_1.default.createElement("label", { className: "qc-composer__label qc-composer__label--fr" },
                            react_1.default.createElement(lucide_react_1.Globe, { size: 11 }),
                            " French Answer"),
                        react_1.default.createElement("textarea", { className: "qc-composer__textarea qc-composer__textarea--italic", placeholder: "Saisir la question en fran\u00E7ais...", value: (_g = newQuestion.interviewFr) !== null && _g !== void 0 ? _g : "", onChange: function (e) { return onChange(tslib_1.__assign(tslib_1.__assign({}, newQuestion), { interviewFr: e.target.value })); } }))))))));
};
exports.CreateMinimumCriteriaQuestion = CreateMinimumCriteriaQuestion;
var PreparedCriteriaSet = function (_a) {
    var questions = _a.questions, onRemove = _a.onRemove;
    return (react_1.default.createElement("div", { className: "qc-prepared" },
        react_1.default.createElement("div", { className: "qc-prepared__header" },
            react_1.default.createElement("h3", { className: "qc-prepared__title" },
                react_1.default.createElement("span", { className: "qc-prepared__title-bar" }),
                "Prepared Minimum Criteria"),
            react_1.default.createElement("span", { className: "qc-prepared__count" },
                questions.length,
                " Items")),
        react_1.default.createElement("div", { className: "qc-prepared__body" }, questions.length === 0 ? (react_1.default.createElement("div", { className: "qc-prepared__empty" },
            react_1.default.createElement("div", { className: "qc-prepared__empty-icon" },
                react_1.default.createElement(lucide_react_1.ClipboardList, { size: 30 })),
            react_1.default.createElement("p", { className: "qc-prepared__empty-title" }, "No criteria added yet"),
            react_1.default.createElement("p", { className: "qc-prepared__empty-sub" }, "Select from bank or create new"))) : (react_1.default.createElement(framer_motion_1.AnimatePresence, null, questions.map(function (q, idx) { return (react_1.default.createElement(framer_motion_1.motion.div, { key: q.id, className: "qc-prepared__card", initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }, transition: { duration: 0.28, ease: "easeOut" } },
            react_1.default.createElement("div", { className: "qc-prepared__meta" },
                react_1.default.createElement("span", { className: "qc-prepared__num" }, idx + 1),
                q.fromBank && (react_1.default.createElement("span", { className: "qc-prepared__from-bank", title: "From Bank" },
                    react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 11 })))),
            react_1.default.createElement("div", { className: "qc-prepared__content" },
                react_1.default.createElement("div", { className: "qc-prepared__lang-header" },
                    react_1.default.createElement("span", { className: "qc-prepared__lang-tag qc-prepared__lang-tag--en" }, "English"),
                    react_1.default.createElement("span", { className: "qc-prepared__type-tag qc-prepared__type-tag--".concat(q.type) }, q.type === "single" ? "Single" : "Multiple")),
                react_1.default.createElement("p", { className: "qc-prepared__question" }, q.questionEn),
                react_1.default.createElement("div", { className: "qc-prepared__sep" }),
                react_1.default.createElement("span", { className: "qc-prepared__lang-tag qc-prepared__lang-tag--fr" }, "Fran\u00E7ais"),
                react_1.default.createElement("p", { className: "qc-prepared__question qc-prepared__question--italic" }, q.questionFr),
                react_1.default.createElement("div", { className: "qc-prepared__options" }, q.options.map(function (opt) { return (react_1.default.createElement("span", { key: opt.id, className: "qc-prepared__option ".concat(opt.isCorrect ? "qc-prepared__option--correct" : "") },
                    opt.isCorrect && react_1.default.createElement(lucide_react_1.Check, { size: 9 }),
                    opt.textEn,
                    " / ",
                    opt.textFr)); }))),
            react_1.default.createElement("button", { className: "qc-prepared__remove", onClick: function () { return onRemove(q.id); }, title: "Remove" },
                react_1.default.createElement(lucide_react_1.X, { size: 16 })))); }))))));
};
exports.PreparedCriteriaSet = PreparedCriteriaSet;
//# sourceMappingURL=CreateMinimumCriteriaQuestion.js.map