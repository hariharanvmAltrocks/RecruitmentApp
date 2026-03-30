"use strict";
// Components/CandidateDrawer.tsx
// Exact old-code UI:
//   - Spring-animated slide-in drawer from right
//   - Candidate table with S.NO, Applicant Name, Position Title, Interview Level, Grade, GPA, Status, Action
//   - Pencil (edit) / Eye (view) icon buttons based on statusId
//   - Pending count badge in header
//   - Footer with "Click a candidate to review their scorecard" hint + CLOSE button
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var useReviewScorecard_1 = require("../Hooks/useReviewScorecard");
var getStatusClass = function (statusId) {
    if (statusId === 122)
        return ReviewScorecard_module_scss_1.default.statusSelected;
    if (useReviewScorecard_1.VIEW_ONLY_STATUS_IDS.includes(statusId))
        return ReviewScorecard_module_scss_1.default.statusRejected;
    return ReviewScorecard_module_scss_1.default.statusPending;
};
var getInterviewLevelLabel = function (interviewLevel) {
    var lvl = (interviewLevel || "").trim();
    if (/level\s*2/i.test(lvl))
        return "Level 1 of 1 & Level 2 of 2";
    if (/level\s*1/i.test(lvl))
        return "Level 1 of 1";
    return lvl || " ";
};
var CandidateDrawer = function (_a) {
    var candidates = _a.candidates, loading = _a.loading, onClose = _a.onClose, onReview = _a.onReview, recruitmentId = _a.recruitmentId;
    var pendingCount = candidates.filter(function (c) { return useReviewScorecard_1.EDITABLE_STATUS_IDS.includes(c.statusId); }).length;
    return (React.createElement(framer_motion_1.AnimatePresence, null,
        React.createElement(React.Fragment, null,
            React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: ReviewScorecard_module_scss_1.default.drawerOverlay, onClick: onClose }),
            React.createElement(framer_motion_1.motion.div, { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 25, stiffness: 200 }, className: ReviewScorecard_module_scss_1.default.drawer, onClick: function (e) { return e.stopPropagation(); } },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerHeader },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.headerContent },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.iconBox },
                            React.createElement(lucide_react_1.Users, { size: 24 })),
                        React.createElement("div", null,
                            React.createElement("h2", null,
                                "Candidate Selection",
                                " ",
                                pendingCount > 0 && React.createElement("span", { className: ReviewScorecard_module_scss_1.default.badge }, pendingCount)))),
                    React.createElement("button", { onClick: onClose, className: ReviewScorecard_module_scss_1.default.closeButton },
                        React.createElement(lucide_react_1.X, { size: 24 }))),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerBody },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.innerCard },
                        React.createElement("table", { className: ReviewScorecard_module_scss_1.default.styledTable },
                            React.createElement("thead", null,
                                React.createElement("tr", null,
                                    React.createElement("th", null, "S.NO"),
                                    React.createElement("th", null, "Applicant Name"),
                                    React.createElement("th", null, "Position Title"),
                                    React.createElement("th", null, "Interview Level"),
                                    React.createElement("th", null, "Grade"),
                                    React.createElement("th", { className: ReviewScorecard_module_scss_1.default.center }, "GPA"),
                                    React.createElement("th", null, "Status"),
                                    React.createElement("th", { className: ReviewScorecard_module_scss_1.default.center }, "Action"))),
                            React.createElement("tbody", null, loading ? (React.createElement("tr", null,
                                React.createElement("td", { colSpan: 8, className: ReviewScorecard_module_scss_1.default.noData }, "Loading candidates..."))) : candidates.length === 0 ? (React.createElement("tr", null,
                                React.createElement("td", { colSpan: 8, className: ReviewScorecard_module_scss_1.default.noData }, "No candidates found."))) : candidates.map(function (c, idx) {
                                var edit = useReviewScorecard_1.EDITABLE_STATUS_IDS.includes(c.statusId);
                                var view = useReviewScorecard_1.VIEW_ONLY_STATUS_IDS.includes(c.statusId);
                                return (React.createElement("tr", { key: c.id },
                                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted, style: { fontWeight: "bold" } }, idx + 1),
                                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.jobTitle }, c.fullName),
                                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, c.positionTitle || ""),
                                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, getInterviewLevelLabel(c.interviewLevel)),
                                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, c.grade || ""),
                                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.center },
                                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.gpaBadge }, c.gpa || "")),
                                    React.createElement("td", null,
                                        React.createElement("span", { className: "".concat(ReviewScorecard_module_scss_1.default.statusBadgeText, " ").concat(getStatusClass(c.statusId)) }, c.status || "")),
                                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.center },
                                        edit && (React.createElement("button", { onClick: function () { return onReview(c); }, className: ReviewScorecard_module_scss_1.default.iconButton, title: "Edit" },
                                            React.createElement(lucide_react_1.Pencil, { size: 16 }))),
                                        view && (React.createElement("button", { onClick: function () { return onReview(c); }, className: ReviewScorecard_module_scss_1.default.iconButton, title: "View" },
                                            React.createElement(lucide_react_1.Eye, { size: 16 }))),
                                        !edit && !view && (React.createElement("span", { style: { color: "#94a3b8", fontSize: "0.75rem" } }, "\u2014")))));
                            }))))),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerFooter },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.footerHint },
                        React.createElement(lucide_react_1.AlertCircle, { size: 16 }),
                        React.createElement("span", null, "Click a candidate to review their scorecard")),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.footerActions },
                        React.createElement("button", { onClick: onClose, className: ReviewScorecard_module_scss_1.default.cancelBtn }, "CLOSE")))))));
};
exports.default = CandidateDrawer;
//# sourceMappingURL=CandidateDrawer.js.map