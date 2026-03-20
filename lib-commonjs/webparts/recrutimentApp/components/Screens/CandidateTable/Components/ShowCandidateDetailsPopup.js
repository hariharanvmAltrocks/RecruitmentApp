"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowCandidateDetailsPopup = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var fetchCandidateDetails_1 = require("../Hooks/fetchCandidateDetails");
require("./ShowCandidateDetailsPopup.scss");
var modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
};
var cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }
};
var ShowCandidateDetailsPopup = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    var isOpen = _a.isOpen, onClose = _a.onClose, candidateId = _a.candidateId;
    var _x = (0, fetchCandidateDetails_1.useFetchCandidateDetails)(candidateId), data = _x.data, loading = _x.loading;
    var _y = (0, react_1.useState)(null), decision = _y[0], setDecision = _y[1];
    var _z = (0, react_1.useState)(""), comments = _z[0], setComments = _z[1];
    (0, react_1.useEffect)(function () {
        if (!isOpen) {
            setDecision(null);
            setComments("");
        }
    }, [isOpen]);
    var decisionDisabled = (0, react_1.useMemo)(function () { return !decision || comments.trim().length === 0; }, [decision, comments]);
    if (!isOpen) {
        return null;
    }
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "candidate-modal", variants: modalVariants, initial: "hidden", animate: "visible", exit: "exit" },
        react_1.default.createElement(framer_motion_1.motion.div, { className: "candidate-modal__card", variants: cardVariants },
            react_1.default.createElement("header", { className: "candidate-modal__header" },
                react_1.default.createElement("div", { className: "candidate-modal__title" },
                    react_1.default.createElement("div", { className: "candidate-modal__title-icon" }, "CR"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "candidate-modal__breadcrumb" }, "Review Profile / Candidate Details"),
                        react_1.default.createElement("h2", null, "Candidate Profile Review"),
                        react_1.default.createElement("div", { className: "candidate-modal__meta" },
                            react_1.default.createElement("span", { className: "candidate-modal__chip" }, (_b = data === null || data === void 0 ? void 0 : data.jobCode) !== null && _b !== void 0 ? _b : "FIN003"),
                            react_1.default.createElement("span", null, (_c = data === null || data === void 0 ? void 0 : data.jobTitle) !== null && _c !== void 0 ? _c : "Senior Mining Engineer")))),
                react_1.default.createElement("div", { className: "candidate-modal__gpa" },
                    react_1.default.createElement("span", null, "Overall GPA"),
                    react_1.default.createElement("strong", null, (_e = (_d = data === null || data === void 0 ? void 0 : data.gpa) === null || _d === void 0 ? void 0 : _d.toFixed(1)) !== null && _e !== void 0 ? _e : "5.0")),
                react_1.default.createElement("button", { className: "candidate-modal__close", type: "button", onClick: onClose }, "?")),
            react_1.default.createElement("div", { className: "candidate-modal__body" },
                react_1.default.createElement("aside", { className: "candidate-modal__sidebar" },
                    react_1.default.createElement("div", { className: "candidate-modal__profile" },
                        react_1.default.createElement("h3", null, (_f = data === null || data === void 0 ? void 0 : data.applicantName) !== null && _f !== void 0 ? _f : "Alyse E"),
                        react_1.default.createElement("span", { className: "candidate-modal__badge" }, (_g = data === null || data === void 0 ? void 0 : data.classification) !== null && _g !== void 0 ? _g : "EXPAT")),
                    react_1.default.createElement("div", { className: "candidate-modal__sidebar-section" },
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Nationality"),
                            react_1.default.createElement("strong", null, (_h = data === null || data === void 0 ? void 0 : data.nationality) !== null && _h !== void 0 ? _h : "Malian (Mali)")),
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Gender"),
                            react_1.default.createElement("strong", null, (_j = data === null || data === void 0 ? void 0 : data.gender) !== null && _j !== void 0 ? _j : "Female")),
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Qualification"),
                            react_1.default.createElement("strong", null, (_k = data === null || data === void 0 ? void 0 : data.qualification) !== null && _k !== void 0 ? _k : "BSc Mining Engineering")),
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Mining Experience"),
                            react_1.default.createElement("strong", null, (_l = data === null || data === void 0 ? void 0 : data.miningExp) !== null && _l !== void 0 ? _l : "8 Years")),
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Related Experience"),
                            react_1.default.createElement("strong", null, (_m = data === null || data === void 0 ? void 0 : data.relatedExp) !== null && _m !== void 0 ? _m : "5-10 Years")),
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Interview Date"),
                            react_1.default.createElement("strong", null, (_o = data === null || data === void 0 ? void 0 : data.interviewDate) !== null && _o !== void 0 ? _o : "2026-03-05")),
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Levels"),
                            react_1.default.createElement("strong", null, (_p = data === null || data === void 0 ? void 0 : data.interviewLevels) !== null && _p !== void 0 ? _p : "Level 1")),
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Conflicts"),
                            react_1.default.createElement("strong", null, (_q = data === null || data === void 0 ? void 0 : data.conflicts) !== null && _q !== void 0 ? _q : "No")),
                        react_1.default.createElement("div", { className: "candidate-modal__item" },
                            react_1.default.createElement("span", null, "Disability"),
                            react_1.default.createElement("strong", null, (_r = data === null || data === void 0 ? void 0 : data.disability) !== null && _r !== void 0 ? _r : "No"))),
                    react_1.default.createElement("div", { className: "candidate-modal__panel" },
                        react_1.default.createElement("h4", null, "Interview Panel"),
                        react_1.default.createElement("ul", null, ((_s = data === null || data === void 0 ? void 0 : data.panel) !== null && _s !== void 0 ? _s : ["Michael Lopez", "Amina Kone", "Ravi Sharma"]).map(function (member) { return (react_1.default.createElement("li", { key: member }, member)); })))),
                react_1.default.createElement("div", { className: "candidate-modal__content" },
                    react_1.default.createElement(framer_motion_1.motion.section, { className: "candidate-modal__section", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } },
                        react_1.default.createElement("div", { className: "candidate-modal__section-title" },
                            react_1.default.createElement("span", { className: "candidate-modal__section-accent" }),
                            "Interview Questionnaires"),
                        react_1.default.createElement("p", { className: "candidate-modal__section-subtitle" }, "Panel Assessment Results"),
                        react_1.default.createElement("div", { className: "candidate-modal__questions" }, ((_t = data === null || data === void 0 ? void 0 : data.questionnaires) !== null && _t !== void 0 ? _t : []).map(function (question, index) { return (react_1.default.createElement(framer_motion_1.motion.div, { key: question.id, className: "candidate-modal__question-card", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.08, duration: 0.25 } },
                            react_1.default.createElement("div", { className: "candidate-modal__question-index" },
                                "Q",
                                index + 1),
                            react_1.default.createElement("div", { className: "candidate-modal__question-body" },
                                react_1.default.createElement("h5", null, question.question),
                                react_1.default.createElement("div", { className: "candidate-modal__rating" },
                                    react_1.default.createElement("span", null, "Rating:"),
                                    react_1.default.createElement("span", { className: "candidate-modal__rating-badge" },
                                        question.score,
                                        " - ",
                                        question.rating))),
                            react_1.default.createElement("div", { className: "candidate-modal__score" },
                                react_1.default.createElement("span", null, "Score"),
                                react_1.default.createElement("strong", null,
                                    question.score,
                                    "/",
                                    question.maxScore)))); }))),
                    react_1.default.createElement(framer_motion_1.motion.section, { className: "candidate-modal__section", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, delay: 0.05 } },
                        react_1.default.createElement("div", { className: "candidate-modal__section-title" },
                            react_1.default.createElement("span", { className: "candidate-modal__section-accent candidate-modal__section-accent--green" }),
                            "Scorecard Details"),
                        react_1.default.createElement("p", { className: "candidate-modal__section-subtitle" }, "Core Competency Assessment (1-5 Scale)"),
                        react_1.default.createElement("div", { className: "candidate-modal__scores" }, ((_u = data === null || data === void 0 ? void 0 : data.scores) !== null && _u !== void 0 ? _u : []).map(function (score) {
                            var percent = Math.min(100, (score.score / score.maxScore) * 100);
                            return (react_1.default.createElement("div", { key: score.label, className: "candidate-modal__score-row" },
                                react_1.default.createElement("div", { className: "candidate-modal__score-header" },
                                    react_1.default.createElement("span", null, score.label),
                                    react_1.default.createElement("strong", null,
                                        score.score,
                                        "/",
                                        score.maxScore)),
                                react_1.default.createElement("div", { className: "candidate-modal__progress" },
                                    react_1.default.createElement(framer_motion_1.motion.div, { className: "candidate-modal__progress-fill", initial: { width: 0 }, animate: { width: "".concat(percent, "%") }, transition: { duration: 0.5 } }))));
                        })),
                        react_1.default.createElement("div", { className: "candidate-modal__recommendation" },
                            react_1.default.createElement("div", { className: "candidate-modal__recommendation-badge ".concat((data === null || data === void 0 ? void 0 : data.recommendation) === "Do Not Consider"
                                    ? "candidate-modal__recommendation-badge--danger"
                                    : "candidate-modal__recommendation-badge--success") }, (_v = data === null || data === void 0 ? void 0 : data.recommendation) !== null && _v !== void 0 ? _v : "Consider for Employment"),
                            react_1.default.createElement("div", { className: "candidate-modal__feedback" },
                                react_1.default.createElement("p", null,
                                    "\"", (_w = data === null || data === void 0 ? void 0 : data.panelFeedback) !== null && _w !== void 0 ? _w : "Exceptional candidate with deep technical knowledge and strong leadership potential.",
                                    "\"")))),
                    react_1.default.createElement(framer_motion_1.motion.section, { className: "candidate-modal__section", initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, delay: 0.1 } },
                        react_1.default.createElement("div", { className: "candidate-modal__decision" },
                            react_1.default.createElement("h4", null, "Do you wish to select this candidate?"),
                            react_1.default.createElement("p", null, "As LM, please review the evaluation above and provide your final decision."),
                            react_1.default.createElement("div", { className: "candidate-modal__decision-grid" }, [
                                { key: "YES", label: "Yes, Select", tone: "success" },
                                { key: "NO", label: "No, Reject", tone: "danger" },
                                { key: "HOLD", label: "On Hold", tone: "warning" }
                            ].map(function (option) { return (react_1.default.createElement(framer_motion_1.motion.button, { key: option.key, type: "button", className: "candidate-modal__decision-card candidate-modal__decision-card--".concat(option.tone, " ").concat(decision === option.key ? "candidate-modal__decision-card--active" : ""), whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: function () { return setDecision(option.key); } }, option.label)); })),
                            react_1.default.createElement("label", { className: "candidate-modal__comment" },
                                react_1.default.createElement("span", null, "LM Decision Justification / Comments *"),
                                react_1.default.createElement("textarea", { placeholder: "Provide your final decision rationale...", value: comments, onChange: function (event) { return setComments(event.target.value); } })))))),
            react_1.default.createElement("footer", { className: "candidate-modal__footer" },
                react_1.default.createElement("button", { type: "button", className: "candidate-modal__footer-btn candidate-modal__footer-btn--ghost", onClick: onClose }, "Cancel"),
                react_1.default.createElement("button", { type: "button", className: "candidate-modal__footer-btn candidate-modal__footer-btn--primary", disabled: decisionDisabled }, "Submit Action")),
            loading && react_1.default.createElement("div", { className: "candidate-modal__loading" }, "Loading details..."))));
};
exports.ShowCandidateDetailsPopup = ShowCandidateDetailsPopup;
//# sourceMappingURL=ShowCandidateDetailsPopup.js.map