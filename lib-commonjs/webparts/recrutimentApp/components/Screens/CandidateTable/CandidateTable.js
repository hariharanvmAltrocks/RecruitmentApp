"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var fetchCandidateDashboardDetails_1 = require("./Hooks/fetchCandidateDashboardDetails");
var ShowCandidateDetailsPopup_1 = require("./Components/ShowCandidateDetailsPopup");
var DataTable_1 = require("../../Comman/DataTable/DataTable");
require("../RecruitmentTable/AdvertReviewDrawer/AdvertReviewDrawer.scss");
require("./CandidateTable.scss");
var getPositionDetails_1 = require("../RecruitmentTable/AdvertReviewDrawer/Hooks/getPositionDetails");
var Config_1 = require("../../../utilities/Config");
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var panelVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { x: "100%" },
};
// interface CandidateTableProps {
//   jobId: number;
// }
var CandidateTable = function (props) {
    var _a;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(null), activeCandidateId = _b[0], setActiveCandidateId = _b[1];
    var _c = (0, react_1.useState)(null), paneldata = _c[0], setPanelData = _c[1];
    var _d = (0, getPositionDetails_1.usePositionDetails)(props.ID, ""), positionDetails = _d.data, positionLoading = _d.loading;
    var jobId = (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId) !== null && _a !== void 0 ? _a : 0;
    var _e = (0, fetchCandidateDashboardDetails_1.useFetchCandidateDashboardDetails)({ jobId: jobId, initialPageSize: 10, enable: !positionLoading }), data = _e.data, loading = _e.loading, error = _e.error, pagination = _e.pagination, fetchPage = _e.fetchPage, setPageSize = _e.setPageSize;
    var headerMeta = (0, react_1.useMemo)(function () {
        if (!data.length)
            return { code: "—", title: "—" };
        return { code: data[0].JobCode, title: data[0].PositionTitle };
    }, [data]);
    var handleClose = (0, react_1.useCallback)(function () { return navigate("/RecruitmentTable"); }, [navigate]);
    var handlePageChange = (0, react_1.useCallback)(function (page) { return fetchPage(page); }, [fetchPage]);
    var handlePageSizeChange = (0, react_1.useCallback)(function (size) { return setPageSize(size); }, [setPageSize]);
    console.log("positionDetails:", positionDetails);
    console.log("positionLoading:", positionLoading);
    var BUCodeID = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCodeId;
    var AssignHR = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.AssignedHR;
    var handleAction = (0, react_1.useCallback)(function (item) {
        var _a;
        setActiveCandidateId(item.CandidateID);
        var Action;
        if (item.workflowStatusId === Config_1.workflowStatusApi.HRPending ||
            item.workflowStatusId === Config_1.workflowStatusApi.LineManagerL1Pending ||
            item.workflowStatusId === Config_1.workflowStatusApi.LineManagerL2Pending) {
            Action = ConditionConfig_1.ActionID.Review;
        }
        else if (item.workflowStatusId === Config_1.workflowStatusApi.LineManagerLevel1OnHold ||
            item.workflowStatusId === Config_1.workflowStatusApi.LineManagerLevel2OnHold) {
            Action = ConditionConfig_1.ActionID.onHold;
        }
        else if (item.workflowStatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
            Number(item.workflowStatusId) === Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
            Action = ConditionConfig_1.ActionID.schedule;
        }
        else {
            Action = ConditionConfig_1.ActionID.View;
        }
        setPanelData({
            bucodeId: BUCodeID !== null && BUCodeID !== void 0 ? BUCodeID : 0,
            candidateId: item.CandidateID,
            assignHR: AssignHR !== null && AssignHR !== void 0 ? AssignHR : "",
            statusId: (_a = item.workflowStatusId) !== null && _a !== void 0 ? _a : item.statusID,
            actionID: Action
        });
    }, [positionDetails]);
    var getActionConfig = function (item) {
        if (item.workflowStatusId === Config_1.workflowStatusApi.HRPending ||
            item.workflowStatusId === Config_1.workflowStatusApi.LineManagerL1Pending ||
            item.workflowStatusId === Config_1.workflowStatusApi.LineManagerL2Pending) {
            return {
                label: "Review",
                icon: react_1.default.createElement(lucide_react_1.Eye, { size: 14 }),
            };
        }
        if (item.workflowStatusId === Config_1.workflowStatusApi.LineManagerLevel1OnHold ||
            item.workflowStatusId === Config_1.workflowStatusApi.LineManagerLevel2OnHold) {
            return {
                label: "On Hold",
                icon: react_1.default.createElement(lucide_react_1.PauseCircle, { size: 14 }),
            };
        }
        if (item.workflowStatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
            Number(item.workflowStatusId) === Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
            return {
                label: "Schedule",
                icon: react_1.default.createElement(lucide_react_1.Calendar, { size: 14 }),
            };
        }
        return {
            label: "View",
            icon: react_1.default.createElement(lucide_react_1.CheckCircle, { size: 14 }),
        };
    };
    var columns = (0, react_1.useMemo)(function () { return [
        {
            id: "ApplicantName",
            header: "Applicant Name",
            render: function (item) { return (react_1.default.createElement("span", { className: "candidate-table__code" }, item.ApplicantName)); },
        },
        {
            id: "PositionTitle",
            header: "Position Title",
            render: function (item) { return (react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: "candidate-table__name" }, item.PositionTitle),
                react_1.default.createElement("div", { className: "candidate-table__subtext" }, item.JobCode))); },
        },
        {
            id: "createdBy",
            header: "Profile From",
            accessor: "createdBy",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "createdOn",
            header: "Profile Received Date",
            accessor: "createdOn",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "Status",
            header: "Status",
            render: function (item) { return (react_1.default.createElement("span", { className: "candidate-table__status candidate-table__status--".concat(resolveStatusTone(item.Status)) }, item.Status)); },
        },
        {
            id: "actions",
            header: "Action",
            align: "right",
            render: function (item) {
                var _a = getActionConfig(item), label = _a.label, icon = _a.icon;
                return (react_1.default.createElement(framer_motion_1.motion.button, { type: "button", className: "candidate-table__review", whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, onClick: function () { return handleAction(item); } },
                    react_1.default.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } },
                        icon,
                        label)));
            },
        }
    ]; }, []);
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null,
        react_1.default.createElement("div", { className: "advert-review-drawer" },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "advert-review-drawer__backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleClose }),
            react_1.default.createElement(framer_motion_1.motion.div, { className: "advert-review-drawer__panel", variants: panelVariants, initial: "hidden", animate: "visible", exit: "exit" },
                react_1.default.createElement("div", { className: "advert-review-drawer__header" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__header-left" },
                        react_1.default.createElement("div", { className: "advert-review-drawer__header-icon" },
                            react_1.default.createElement(lucide_react_1.Users, { size: 20 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h2", { className: "advert-review-drawer__title" }, "Review Candidate Profiles"),
                            react_1.default.createElement("div", { className: "advert-review-drawer__meta" },
                                react_1.default.createElement("span", { className: "advert-review-drawer__badge" }, headerMeta.code),
                                react_1.default.createElement("span", { className: "advert-review-drawer__dot" }),
                                react_1.default.createElement("span", { className: "advert-review-drawer__meta-text" }, headerMeta.title)))),
                    react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__close", onClick: handleClose },
                        react_1.default.createElement(lucide_react_1.X, { size: 18 }))),
                react_1.default.createElement("div", { className: "advert-review-drawer__content" },
                    react_1.default.createElement("div", { className: "candidate-table" },
                        react_1.default.createElement("div", { className: "candidate-table__card" },
                            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: data, loading: loading !== null && loading !== void 0 ? loading : positionLoading, 
                                // error={error ?? undefined}
                                pageSize: pagination.pageSize, currentPage: pagination.currentPage, totalCount: pagination.totalItems, onPageChange: handlePageChange, onPageSizeChange: handlePageSizeChange, pageSizeOptions: [5, 10, 20, 50], emptyMessage: "No candidates found for this job." }),
                            react_1.default.createElement("div", { className: "candidate-table__footer" },
                                react_1.default.createElement("button", { type: "button", className: "candidate-table__footer-btn candidate-table__footer-btn--ghost", onClick: handleClose }, "Cancel"),
                                react_1.default.createElement("button", { type: "button", className: "candidate-table__footer-btn candidate-table__footer-btn--primary" }, "Submit Review"))))))),
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, activeCandidateId && (react_1.default.createElement(ShowCandidateDetailsPopup_1.ShowCandidateDetailsPopup, { isOpen: true, candidateId: activeCandidateId, onClose: function () { return setActiveCandidateId(null); }, panelParams: paneldata !== null && paneldata !== void 0 ? paneldata : null, positionDetails: positionDetails !== null && positionDetails !== void 0 ? positionDetails : null })))));
};
exports.CandidateTable = CandidateTable;
function resolveStatusTone(status) {
    var _a;
    var s = (_a = status === null || status === void 0 ? void 0 : status.toLowerCase()) !== null && _a !== void 0 ? _a : "";
    if (s.includes("pending"))
        return "warning";
    if (s.includes("reviewed") || s.includes("ready") || s.includes("approved"))
        return "success";
    return "danger";
}
//# sourceMappingURL=CandidateTable.js.map