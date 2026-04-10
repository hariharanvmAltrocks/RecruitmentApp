"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var useReviewScorecard_1 = require("../Hooks/useReviewScorecard");
var CandidateTable_1 = require("../../CandidateTable/CandidateTable");
var react_1 = require("react");
var DataTable_1 = require("../../../Comman/DataTable/DataTable");
var EvaluationConfig_1 = require("../../SelectionProcess/config/EvaluationConfig");
require("../../CandidateTable/CandidateTable.scss");
var CandidateReviewModal_1 = tslib_1.__importDefault(require("./CandidateReviewModal"));
var react_dom_1 = tslib_1.__importDefault(require("react-dom"));
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
function resolveStatusTone(status) {
    var _a;
    var s = (_a = status === null || status === void 0 ? void 0 : status.toLowerCase()) !== null && _a !== void 0 ? _a : "";
    if (s.includes("pending"))
        return "warning";
    if (s.includes("reviewed") || s.includes("ready") || s.includes("approved"))
        return "success";
    return "danger";
}
var CandidateDrawer = function (_a) {
    var candidates = _a.candidates, loading = _a.loading, onClose = _a.onClose, onReview = _a.onReview, recruitmentId = _a.recruitmentId, hook = _a.hook, currentRoleId = _a.currentRoleId;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleClose = function () {
        navigate("/RecruitmentTable");
    };
    var headerMeta = (0, react_1.useMemo)(function () {
        var _a, _b;
        if (!candidates)
            return { code: "—", title: "—" };
        return { code: (_a = candidates[0]) === null || _a === void 0 ? void 0 : _a.jobCode, title: (_b = candidates[0]) === null || _b === void 0 ? void 0 : _b.jobTitle };
    }, [candidates]);
    // ✅ Local refresh state
    var _b = React.useState(false), isRefreshing = _b[0], setIsRefreshing = _b[1];
    // ✅ Local pagination state
    var _c = React.useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: candidates.length,
    }), pagination = _c[0], setPagination = _c[1];
    // Sync totalItems when candidates change
    React.useEffect(function () {
        setPagination(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { totalItems: candidates.length })); });
    }, [candidates]);
    var handleRefresh = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsRefreshing(true);
                    // If you need to trigger a parent refetch, add an `onRefresh` prop
                    // or do local logic here
                    return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 800); })];
                case 1:
                    // If you need to trigger a parent refetch, add an `onRefresh` prop
                    // or do local logic here
                    _a.sent(); // simulate
                    setIsRefreshing(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handlePageChange = function (page) {
        setPagination(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { currentPage: page })); });
    };
    var handlePageSizeChange = function (size) {
        setPagination(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { pageSize: size, currentPage: 1 })); });
    };
    var getActionConfig = function (item) {
        if (item.statusId === EvaluationConfig_1.StatusId.OnHoldbyHOD ||
            item.statusId === EvaluationConfig_1.StatusId.CandidateOnHoldbyHODLevel1 ||
            item.statusId === EvaluationConfig_1.StatusId.CandidateOnHoldbyHODLevel2) {
            return {
                label: "On Hold",
                icon: React.createElement(lucide_react_1.PauseCircle, { size: 14 }),
            };
        }
        if (item.statusId === EvaluationConfig_1.StatusId.PendingwithHODtoAssignPositionID ||
            item.statusId === EvaluationConfig_1.StatusId.PendingwithHODtoselectthecandidateLevel2) {
            return {
                label: "Review",
                icon: React.createElement(lucide_react_1.Eye, { size: 14 }),
            };
        }
        return {
            label: "View",
            icon: React.createElement(lucide_react_1.CheckCircle, { size: 14 }),
        };
    };
    var columns = (0, react_1.useMemo)(function () { return [
        {
            id: "ApplicantName",
            header: "Applicant Name",
            render: function (item) { return (React.createElement("span", { className: "candidate-table__code" }, item.fullName)); },
        },
        {
            id: "PositionTitle",
            header: "Position Title",
            render: function (item) { return (React.createElement("div", null,
                React.createElement("div", { className: "candidate-table__name" }, item.positionTitle),
                React.createElement("div", { className: "candidate-table__subtext" }, item.department))); },
        },
        {
            id: "interviewLevel",
            header: "Interview Level",
            accessor: "interviewLevel",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "grade",
            header: "Grade",
            accessor: "grade",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "Status",
            header: "Status",
            render: function (item) { return (React.createElement("span", { className: "candidate-table__status candidate-table__status--".concat(resolveStatusTone(item.status)) }, item.status)); },
        },
        {
            id: "actions",
            header: "Action",
            align: "right",
            render: function (item) {
                var _a = getActionConfig(item), label = _a.label, icon = _a.icon;
                return (React.createElement(framer_motion_1.motion.button, { type: "button", className: "candidate-table__review", whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, onClick: function () { return onReview(item); } },
                    React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } },
                        icon,
                        label)));
            },
        },
    ]; }, []);
    return (React.createElement(framer_motion_1.AnimatePresence, null,
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: "candidate-table" },
                React.createElement(framer_motion_1.motion.div, { className: "candidate-table__backdrop", style: { zIndex: 200 }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleClose }),
                React.createElement(framer_motion_1.motion.div, { className: "candidate-table__panel", style: { zIndex: 201 }, variants: CandidateTable_1.panelVariants, initial: "hidden", animate: "visible", exit: "exit" },
                    React.createElement("div", { className: "candidate-table__header" },
                        React.createElement("div", { className: "candidate-table__header-left" },
                            React.createElement("div", { className: "candidate-table__header-icon" },
                                React.createElement(lucide_react_1.Users, { size: 20 })),
                            React.createElement("div", null,
                                React.createElement("h2", { className: "candidate-table__title" }, "Review Scorecard Profiles"),
                                React.createElement("div", { className: "candidate-table__meta" },
                                    React.createElement("span", { className: "candidate-table__badge" }, headerMeta.code),
                                    React.createElement("span", { className: "candidate-table__dot" }),
                                    React.createElement("span", { className: "candidate-table__meta-text" }, headerMeta.title)))),
                        React.createElement("div", { className: "candidate-table__header-right" },
                            React.createElement("button", { type: "button", className: "candidate-table__refresh", onClick: handleRefresh, disabled: isRefreshing },
                                React.createElement(lucide_react_1.RefreshCw, { size: 14, className: isRefreshing ? "spin" : "" }),
                                "Refresh"),
                            React.createElement("button", { type: "button", className: "candidate-table__close", onClick: handleClose },
                                React.createElement(lucide_react_1.X, { size: 18 })))),
                    React.createElement("div", { className: "candidate-table__content" },
                        React.createElement("div", { className: "candidate-table__card" },
                            React.createElement(DataTable_1.DataTable, { columns: columns, data: candidates, loading: loading, 
                                // error={error ?? undefined}
                                pageSize: pagination.pageSize, currentPage: pagination.currentPage, totalCount: pagination.totalItems, onPageChange: handlePageChange, onPageSizeChange: handlePageSizeChange, pageSizeOptions: [5, 10, 20, 50], emptyMessage: "No candidates found for this job." }))))),
            hook.reviewingCandidate &&
                react_dom_1.default.createPortal(React.createElement(framer_motion_1.AnimatePresence, null,
                    React.createElement(React.Fragment, null,
                        React.createElement(framer_motion_1.motion.div, { style: {
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0, 0, 0, 0.55)",
                                zIndex: 9998,
                            }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: hook.closeReview }),
                        React.createElement(framer_motion_1.motion.div, { style: {
                                position: "fixed",
                                inset: 0,
                                zIndex: 9999,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "24px",
                                pointerEvents: "none", // let backdrop handle clicks
                            }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
                            React.createElement(framer_motion_1.motion.div, { style: {
                                    width: "1080px",
                                    height: "90vh",
                                    background: "#fff",
                                    borderRadius: "16px",
                                    overflowY: "auto",
                                    boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
                                    pointerEvents: "all",
                                }, initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, transition: { type: "spring", damping: 28, stiffness: 320 }, onClick: function (e) { return e.stopPropagation(); } },
                                React.createElement(CandidateReviewModal_1.default, { candidate: hook.reviewingCandidate, reviewData: hook.reviewData, reviewLoading: hook.reviewLoading, scoreData: hook.scoreData, scoreLoading: hook.scoreLoading, showComments: hook.showComments, level1Comments: hook.level1Comments, level2Comments: hook.level2Comments, commentsLoading: hook.commentsLoading, onViewComments: hook.openComments, onCloseComments: function () { return hook.setShowComments(false); }, hodDecision: hook.hodDecision, decisionComment: hook.decisionComment, confirmed: hook.confirmed, selectedPositionId: hook.selectedPositionId, selectedPositionText: hook.selectedPositionText, positionOptions: hook.positionOptions, submitting: hook.submitting, submitError: hook.submitError, successMessage: hook.successMessage, errors: hook.errors, shouldShowPositionId: hook.shouldShowPositionId, onDecisionChange: hook.setHodDecision, onCommentChange: hook.setDecisionComment, onConfirmChange: hook.setConfirmed, onPositionChange: function (id, text) {
                                        hook.setSelectedPositionId(id);
                                        hook.setSelectedPositionText(text);
                                        hook.setErrors(tslib_1.__assign(tslib_1.__assign({}, hook.errors), { position: false }));
                                    }, onClose: hook.closeReview, currentRoleId: currentRoleId, isLevel2Status: hook.isLevel2(hook.reviewingCandidate.statusId), submitDeps: hook.submitDeps }))))), document.body))));
};
exports.default = CandidateDrawer;
//# sourceMappingURL=CandidateDrawer.js.map