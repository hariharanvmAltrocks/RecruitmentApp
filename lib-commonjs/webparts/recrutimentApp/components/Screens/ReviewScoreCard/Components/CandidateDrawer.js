"use strict";
// Components/CandidateDrawer.tsx
// FIXES:
//   1. Action column icons — always visible, properly right-aligned
//   2. Pagination — rows per page selector + prev/next controls (mirrors Image 2)
//   3. onClose (X button + CLOSE button) → navigate('/RecruitmentTable')
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var useReviewScorecard_1 = require("../Hooks/useReviewScorecard");
var PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
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
    var navigate = (0, react_router_dom_1.useNavigate)();
    // ── Pagination state ────────────────────────────────────────────────────────
    var _b = React.useState(1), currentPage = _b[0], setCurrentPage = _b[1];
    var _c = React.useState(5), pageSize = _c[0], setPageSize = _c[1];
    // Reset page to 1 when candidates list changes
    React.useEffect(function () { setCurrentPage(1); }, [candidates.length]);
    var totalRecords = candidates.length;
    var totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize, totalRecords);
    var pageRows = candidates.slice(startIndex, endIndex);
    var pendingCount = candidates.filter(function (c) { return useReviewScorecard_1.EDITABLE_STATUS_IDS.includes(c.statusId); }).length;
    var handleClose = function () {
        navigate('/RecruitmentTable');
    };
    var handlePageSize = function (e) {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };
    return (React.createElement(framer_motion_1.AnimatePresence, null,
        React.createElement(React.Fragment, null,
            React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: ReviewScorecard_module_scss_1.default.drawerOverlay, onClick: handleClose }),
            React.createElement(framer_motion_1.motion.div, { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 25, stiffness: 200 }, className: ReviewScorecard_module_scss_1.default.drawer, onClick: function (e) { return e.stopPropagation(); } },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerHeader },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.headerContent },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.iconBox },
                            React.createElement(lucide_react_1.Users, { size: 24 })),
                        React.createElement("div", null,
                            React.createElement("h2", null,
                                "Candidate Selection",
                                " ",
                                pendingCount > 0 && (React.createElement("span", { className: ReviewScorecard_module_scss_1.default.badge }, pendingCount))))),
                    React.createElement("button", { onClick: handleClose, className: ReviewScorecard_module_scss_1.default.closeButton },
                        React.createElement(lucide_react_1.X, { size: 24 }))),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerBody },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.innerCard },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.tableScroll },
                            React.createElement("table", { className: ReviewScorecard_module_scss_1.default.styledTable },
                                React.createElement("thead", null,
                                    React.createElement("tr", null,
                                        React.createElement("th", null, "S.NO"),
                                        React.createElement("th", null, "Applicant Name"),
                                        React.createElement("th", null, "Position Title"),
                                        React.createElement("th", null, "Interview Level"),
                                        React.createElement("th", null, "Grade"),
                                        React.createElement("th", { style: { textAlign: "center" } }, "GPA"),
                                        React.createElement("th", null, "Status"),
                                        React.createElement("th", { style: { textAlign: "center", minWidth: "80px" } }, "Action"))),
                                React.createElement("tbody", null, loading ? (React.createElement("tr", null,
                                    React.createElement("td", { colSpan: 8, className: ReviewScorecard_module_scss_1.default.noData }, "Loading candidates..."))) : pageRows.length === 0 ? (React.createElement("tr", null,
                                    React.createElement("td", { colSpan: 8, className: ReviewScorecard_module_scss_1.default.noData }, "No candidates found."))) : (pageRows.map(function (c, idx) {
                                    var edit = useReviewScorecard_1.EDITABLE_STATUS_IDS.includes(c.statusId);
                                    var view = useReviewScorecard_1.VIEW_ONLY_STATUS_IDS.includes(c.statusId);
                                    return (React.createElement("tr", { key: c.id },
                                        React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted, style: { fontWeight: "bold" } }, startIndex + idx + 1),
                                        React.createElement("td", { className: ReviewScorecard_module_scss_1.default.jobTitle }, c.fullName),
                                        React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, c.positionTitle || ""),
                                        React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, getInterviewLevelLabel(c.interviewLevel)),
                                        React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, c.grade || ""),
                                        React.createElement("td", { style: { textAlign: "center" } },
                                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.gpaBadge }, c.gpa || "")),
                                        React.createElement("td", null,
                                            React.createElement("span", { className: "".concat(ReviewScorecard_module_scss_1.default.statusBadgeText, " ").concat(getStatusClass(c.statusId)) }, c.status || "")),
                                        React.createElement("td", { style: { textAlign: "center", verticalAlign: "middle" } }, edit ? (React.createElement("button", { onClick: function () { return onReview(c); }, className: ReviewScorecard_module_scss_1.default.iconButton, title: "Edit / Review", style: { display: "inline-flex", alignItems: "center", justifyContent: "center" } },
                                            React.createElement(lucide_react_1.Pencil, { size: 16 }))) : view ? (React.createElement("button", { onClick: function () { return onReview(c); }, className: ReviewScorecard_module_scss_1.default.iconButton, title: "View", style: { display: "inline-flex", alignItems: "center", justifyContent: "center" } },
                                            React.createElement(lucide_react_1.Eye, { size: 16 }))) : (React.createElement("span", { style: { color: "#94a3b8", fontSize: "0.75rem" } }, "\u2014")))));
                                })))))),
                    !loading && totalRecords > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.paginationBar },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.paginationInfo },
                            "Showing ",
                            React.createElement("strong", null, startIndex + 1),
                            " to",
                            " ",
                            React.createElement("strong", null, endIndex),
                            " of",
                            " ",
                            React.createElement("strong", null, totalRecords),
                            " results"),
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" } },
                            React.createElement("span", { style: { fontSize: "0.8rem", color: "#64748b" } }, "Rows per page"),
                            PAGE_SIZE_OPTIONS.map(function (size) { return (React.createElement("button", { key: size, onClick: function () { setPageSize(size); setCurrentPage(1); }, style: {
                                    minWidth: "2rem",
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: "0.4rem",
                                    border: "1px solid #e2e8f0",
                                    background: pageSize === size ? "#2563eb" : "#f8fafc",
                                    color: pageSize === size ? "#fff" : "#334155",
                                    fontWeight: pageSize === size ? 700 : 400,
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                } }, size)); })),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.paginationControls },
                            React.createElement("button", { className: ReviewScorecard_module_scss_1.default.pageBtn, onClick: function () { return setCurrentPage(function (p) { return Math.max(1, p - 1); }); }, disabled: currentPage === 1, title: "Previous" },
                                React.createElement(lucide_react_1.ChevronLeft, { size: 16 })),
                            Array.from({ length: totalPages }, function (_, i) { return i + 1; })
                                .filter(function (pg) {
                                return pg === 1 ||
                                    pg === totalPages ||
                                    Math.abs(pg - currentPage) <= 1;
                            })
                                .reduce(function (acc, pg, i, arr) {
                                if (i > 0 && pg - arr[i - 1] > 1)
                                    acc.push("…");
                                acc.push(pg);
                                return acc;
                            }, [])
                                .map(function (pg, i) {
                                return pg === "…" ? (React.createElement("span", { key: "ellipsis-".concat(i), style: { padding: "0 0.25rem", color: "#94a3b8" } }, "\u2026")) : (React.createElement("button", { key: pg, className: "".concat(ReviewScorecard_module_scss_1.default.pageBtn, " ").concat(currentPage === pg ? ReviewScorecard_module_scss_1.default.pageBtnActive : ""), onClick: function () { return setCurrentPage(pg); } }, pg));
                            }),
                            React.createElement("button", { className: ReviewScorecard_module_scss_1.default.pageBtn, onClick: function () {
                                    return setCurrentPage(function (p) { return Math.min(totalPages, p + 1); });
                                }, disabled: currentPage === totalPages, title: "Next" },
                                React.createElement(lucide_react_1.ChevronRight, { size: 16 })))))),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerFooter },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.footerHint },
                        React.createElement(lucide_react_1.AlertCircle, { size: 16 }),
                        React.createElement("span", null, "Click a candidate to review their scorecard")),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.footerActions },
                        React.createElement("button", { onClick: handleClose, className: ReviewScorecard_module_scss_1.default.cancelBtn }, "CLOSE")))))));
};
exports.default = CandidateDrawer;
//# sourceMappingURL=CandidateDrawer.js.map