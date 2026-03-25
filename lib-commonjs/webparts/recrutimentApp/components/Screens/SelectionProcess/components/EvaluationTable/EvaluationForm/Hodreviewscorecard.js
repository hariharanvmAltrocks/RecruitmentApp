"use strict";
// ─────────────────────────────────────────────────────────────────────────────
//  HodReviewScorecard.tsx  — pure UI, zero SP calls
//  All logic in useHodReview hook.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var HodReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("./HodReviewScorecard.module.scss"));
var useHodReview_1 = require("../../../hooks/useHodReview");
// ── Reusable left-panel field ─────────────────────────────────────────────────
var InfoField = function (_a) {
    var icon = _a.icon, label = _a.label, value = _a.value;
    return (React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.infoField },
        React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.infoLabel },
            icon,
            " ",
            label),
        React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.infoValue }, value || "—")));
};
// ── Decision card ─────────────────────────────────────────────────────────────
var DecisionCard = function (_a) {
    var variant = _a.variant, label = _a.label, icon = _a.icon, active = _a.active, onClick = _a.onClick;
    return (React.createElement("button", { type: "button", className: [
            HodReviewScorecard_module_scss_1.default.decCard,
            HodReviewScorecard_module_scss_1.default["decCard_".concat(variant)],
            active ? HodReviewScorecard_module_scss_1.default["decCard_".concat(variant, "_on")] : "",
        ].filter(Boolean).join(" "), onClick: onClick },
        React.createElement("span", { className: HodReviewScorecard_module_scss_1.default.decCardIcon }, icon),
        React.createElement("span", { className: HodReviewScorecard_module_scss_1.default.decCardLabel }, label)));
};
// ── SVG icons ─────────────────────────────────────────────────────────────────
var I = {
    user: React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
        React.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
        React.createElement("circle", { cx: "12", cy: "7", r: "4" })),
    close: React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" },
        React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })),
    chev: React.createElement("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round" },
        React.createElement("polyline", { points: "9 18 15 12 9 6" })),
    gen: React.createElement("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5" },
        React.createElement("circle", { cx: "12", cy: "8", r: "4" }),
        React.createElement("path", { d: "M6 20v-2a6 6 0 0 1 12 0v2" })),
    book: React.createElement("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5" },
        React.createElement("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }),
        React.createElement("path", { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" })),
    wave: React.createElement("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5" },
        React.createElement("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" })),
    cal: React.createElement("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5" },
        React.createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }),
        React.createElement("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
        React.createElement("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
        React.createElement("line", { x1: "3", y1: "10", x2: "21", y2: "10" })),
    grid: React.createElement("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5" },
        React.createElement("rect", { x: "3", y: "3", width: "7", height: "7" }),
        React.createElement("rect", { x: "14", y: "3", width: "7", height: "7" }),
        React.createElement("rect", { x: "3", y: "14", width: "7", height: "7" })),
    warn: React.createElement("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5" },
        React.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
        React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" })),
    info: React.createElement("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5" },
        React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
        React.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "12" })),
    panel: React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
        React.createElement("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
        React.createElement("circle", { cx: "9", cy: "7", r: "4" }),
        React.createElement("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
        React.createElement("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })),
    check: React.createElement("svg", { width: "34", height: "34", viewBox: "0 0 24 24", fill: "none", stroke: "#22c55e", strokeWidth: "2.2", strokeLinecap: "round" },
        React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
        React.createElement("polyline", { points: "9 12 11 14 15 10" })),
    cross: React.createElement("svg", { width: "34", height: "34", viewBox: "0 0 24 24", fill: "none", stroke: "#ef4444", strokeWidth: "2.2", strokeLinecap: "round" },
        React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
        React.createElement("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
        React.createElement("line", { x1: "9", y1: "9", x2: "15", y2: "15" })),
    hold: React.createElement("svg", { width: "34", height: "34", viewBox: "0 0 24 24", fill: "none", stroke: "#f59e0b", strokeWidth: "2.2", strokeLinecap: "round" },
        React.createElement("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" })),
    ok: React.createElement("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" },
        React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
        React.createElement("polyline", { points: "9 12 11 14 15 10" })),
};
// ─────────────────────────────────────────────────────────────────────────────
var HodReviewScorecard = function (_a) {
    var candidateId = _a.candidateId, employeeList = _a.employeeList, onBack = _a.onBack;
    var _b = (0, useHodReview_1.useHodReview)(candidateId, employeeList, onBack), decision = _b.decision, handleSetDecision = _b.handleSetDecision, comments = _b.comments, handleSetComments = _b.handleSetComments, commentsError = _b.commentsError, decisionError = _b.decisionError, submitting = _b.submitting, alertMsg = _b.alertMsg, alertType = _b.alertType, handleSubmit = _b.handleSubmit, hideAlert = _b.hideAlert;
    return (React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.overlay },
        React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.modal },
            alertMsg && (React.createElement("div", { className: [HodReviewScorecard_module_scss_1.default.alert, alertType === "error" ? HodReviewScorecard_module_scss_1.default.alertErr : HodReviewScorecard_module_scss_1.default.alertOk].join(" ") },
                React.createElement("span", null, alertMsg),
                React.createElement("button", { className: HodReviewScorecard_module_scss_1.default.alertClose, onClick: hideAlert }, I.close))),
            React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.header },
                React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.headerLeft },
                    React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.avatar }, I.user),
                    React.createElement("div", null,
                        React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.breadcrumb },
                            React.createElement("span", null, "CANDIDATE SELECTION"),
                            React.createElement("span", { className: HodReviewScorecard_module_scss_1.default.bChev }, I.chev),
                            React.createElement("span", { className: HodReviewScorecard_module_scss_1.default.bActive }, "EVALUATION PREVIEW")),
                        React.createElement("h1", { className: HodReviewScorecard_module_scss_1.default.title }, "Candidate Evaluation Review"))),
                React.createElement("button", { className: HodReviewScorecard_module_scss_1.default.closeBtn, onClick: onBack }, I.close)),
            React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.body },
                React.createElement("main", { className: HodReviewScorecard_module_scss_1.default.rightPanel },
                    React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.panelScroll },
                        React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.decSection },
                            React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.decHeader },
                                React.createElement("span", { className: HodReviewScorecard_module_scss_1.default.lightning }, "\u26A1"),
                                React.createElement("div", null,
                                    React.createElement("h2", { className: HodReviewScorecard_module_scss_1.default.decTitle }, "Do you wish to select this candidate?"),
                                    React.createElement("p", { className: HodReviewScorecard_module_scss_1.default.decSub }, "As HOD, please review the evaluation above and provide your final decision."))),
                            React.createElement("div", { className: [HodReviewScorecard_module_scss_1.default.decGrid, decisionError ? HodReviewScorecard_module_scss_1.default.decGridErr : ""].filter(Boolean).join(" ") },
                                React.createElement(DecisionCard, { variant: "select", label: "YES, SELECT", icon: I.check, active: decision === "select", onClick: function () { return handleSetDecision("select"); } }),
                                React.createElement(DecisionCard, { variant: "reject", label: "NO, REJECT", icon: I.cross, active: decision === "reject", onClick: function () { return handleSetDecision("reject"); } }),
                                React.createElement(DecisionCard, { variant: "hold", label: "ON HOLD", icon: I.hold, active: decision === "hold", onClick: function () { return handleSetDecision("hold"); } })),
                            decisionError && React.createElement("p", { className: HodReviewScorecard_module_scss_1.default.errMsg }, "Please select a decision."),
                            React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.commentsWrap },
                                React.createElement("label", { className: [HodReviewScorecard_module_scss_1.default.commentsLabel, commentsError ? HodReviewScorecard_module_scss_1.default.commentsLabelErr : ""].filter(Boolean).join(" ") },
                                    "HOD DECISION JUSTIFICATION / COMMENTS ",
                                    React.createElement("span", { className: HodReviewScorecard_module_scss_1.default.req }, "*"),
                                    commentsError && React.createElement("span", { className: HodReviewScorecard_module_scss_1.default.errInline }, " \u2014 Required")),
                                React.createElement("textarea", { className: [HodReviewScorecard_module_scss_1.default.commentsArea, commentsError ? HodReviewScorecard_module_scss_1.default.commentsAreaErr : ""].filter(Boolean).join(" "), rows: 5, placeholder: "Provide your final decision rationale\u2026", value: comments, onChange: function (e) { return handleSetComments(e.target.value); } })))))),
            React.createElement("div", { className: HodReviewScorecard_module_scss_1.default.footer },
                React.createElement("button", { className: HodReviewScorecard_module_scss_1.default.cancelBtn, onClick: onBack, disabled: submitting, type: "button" }, "CANCEL"),
                React.createElement("button", { className: [HodReviewScorecard_module_scss_1.default.submitBtn, !decision ? HodReviewScorecard_module_scss_1.default.submitOff : ""].filter(Boolean).join(" "), onClick: handleSubmit, disabled: submitting || !decision, type: "button" }, submitting
                    ? React.createElement(React.Fragment, null,
                        React.createElement("span", { className: HodReviewScorecard_module_scss_1.default.btnSpinner }),
                        " SUBMITTING\u2026")
                    : React.createElement(React.Fragment, null,
                        I.ok,
                        " SUBMIT ACTION"))))));
};
exports.default = HodReviewScorecard;
//# sourceMappingURL=Hodreviewscorecard.js.map