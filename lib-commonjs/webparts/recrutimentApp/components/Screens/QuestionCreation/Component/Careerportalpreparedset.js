"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerPortalPreparedSet = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
require("./Interviewmode.scss");
require("../Questioncreation.scss");
var CareerPortalPreparedSet = function (_a) {
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
exports.CareerPortalPreparedSet = CareerPortalPreparedSet;
//# sourceMappingURL=Careerportalpreparedset.js.map