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
require("./CandidateTable.scss");
var getPositionDetails_1 = require("../RecruitmentTable/AdvertReviewDrawer/Hooks/getPositionDetails");
var Config_1 = require("../../../utilities/Config");
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var useModalPopup_1 = require("../../Comman/ModalPopup/useModalPopup");
var moment_1 = tslib_1.__importDefault(require("moment"));
var ModalPopup_1 = require("../../Comman/ModalPopup/ModalPopup");
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
    var positionDetailsRef = (0, react_1.useRef)(positionDetails);
    (0, react_1.useEffect)(function () {
        positionDetailsRef.current = positionDetails;
    }, [positionDetails]);
    var _e = (0, react_1.useState)(false), isRefreshing = _e[0], setIsRefreshing = _e[1];
    var jobId = (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId) !== null && _a !== void 0 ? _a : 0;
    var _f = (0, fetchCandidateDashboardDetails_1.useFetchCandidateDashboardDetails)({ jobId: jobId, initialPageSize: 10, enable: !positionLoading }), data = _f.data, loading = _f.loading, error = _f.error, pagination = _f.pagination, fetchPage = _f.fetchPage, setPageSize = _f.setPageSize, refresh = _f.refresh;
    var handleRefresh = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            setIsRefreshing(true);
            refresh();
            setTimeout(function () { return setIsRefreshing(false); }, 600);
            return [2 /*return*/];
        });
    }); }, [refresh]);
    var onHoldRef = (0, react_1.useRef)(data);
    (0, react_1.useEffect)(function () {
        onHoldRef.current = data;
    }, [data]);
    var headerMeta = (0, react_1.useMemo)(function () {
        if (!positionDetails)
            return { code: "—", title: "—" };
        return { code: positionDetails.JobCode, title: positionDetails.JobTitleEnglish };
    }, [positionDetails]);
    var _g = (0, useModalPopup_1.useModalPopup)(), modalState = _g.modalState, showModal = _g.showModal, closeModal = _g.closeModal;
    var handleClose = (0, react_1.useCallback)(function () { return navigate("/RecruitmentTable"); }, [navigate]);
    var handlePageChange = (0, react_1.useCallback)(function (page) { return fetchPage(page); }, [fetchPage]);
    var handlePageSizeChange = (0, react_1.useCallback)(function (size) { return setPageSize(size); }, [setPageSize]);
    var handleAction = (0, react_1.useCallback)(function (item) {
        var _a, _b, _c;
        if (!positionDetailsRef.current)
            return;
        var BUCodeID = (_a = positionDetailsRef.current) === null || _a === void 0 ? void 0 : _a.BusinessUnitCodeId;
        var AssignHR = (_b = positionDetailsRef.current) === null || _b === void 0 ? void 0 : _b.AssignEMail;
        var _d = positionDetailsRef.current, JobPostingEndDate = _d.JobPostingEndDate, JobPostingFirstExtensionEndDate = _d.JobPostingFirstExtensionEndDate, JobPostingSecondExtensionEndDate = _d.JobPostingSecondExtensionEndDate;
        var getLatestDate = function () {
            return (JobPostingSecondExtensionEndDate ||
                JobPostingFirstExtensionEndDate ||
                JobPostingEndDate);
        };
        var latestDate = getLatestDate();
        var isJobExpired = false;
        if (latestDate) {
            var today = new Date();
            today.setDate(today.getDate() + 1);
            var compareDate = new Date(latestDate);
            compareDate.setHours(0, 0, 0, 0);
            isJobExpired = today <= compareDate;
        }
        var pendingCount = onHoldRef.current.filter(function (d) {
            return d.workflowStatusId === Config_1.workflowStatusApi.LineManagerLevel1OnHold ||
                d.workflowStatusId === Config_1.workflowStatusApi.LineManagerLevel2OnHold;
        }).length;
        if (item.workflowStatusId === Config_1.workflowStatusApi.LineManagerL2Pending) {
            if (pendingCount > 0) {
                showModal({
                    type: "error",
                    title: "Pending Candidate Alert",
                    message: (0, Config_1.PendingCandidateAlertMsg)(pendingCount),
                    confirmLabel: "OK",
                    onConfirm: closeModal,
                });
                return;
            }
            var formattedDate = (0, moment_1.default)(latestDate).format("DD/MM/YYYY");
            if (isJobExpired) {
                showModal({
                    type: "error",
                    title: "Job Expired",
                    message: (0, Config_1.JobAdvertAlertMsg)(formattedDate),
                    confirmLabel: "OK",
                    onConfirm: closeModal,
                });
                return;
            }
        }
        setActiveCandidateId(item.CandidateID);
        var getAction = function (status) {
            var reviewStatuses = [
                Config_1.workflowStatusApi.HRPending,
                Config_1.workflowStatusApi.LineManagerL1Pending,
                Config_1.workflowStatusApi.LineManagerL2Pending,
            ];
            var holdStatuses = [
                Config_1.workflowStatusApi.LineManagerLevel1OnHold,
                Config_1.workflowStatusApi.LineManagerLevel2OnHold,
            ];
            var scheduleStatuses = [
                Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview,
                Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
            ];
            if (reviewStatuses.includes(item.workflowStatusId))
                return ConditionConfig_1.ActionID.Review;
            if (holdStatuses.includes(item.workflowStatusId))
                return ConditionConfig_1.ActionID.onHold;
            if (scheduleStatuses.includes(Number(item.workflowStatusId)))
                return ConditionConfig_1.ActionID.schedule;
            return ConditionConfig_1.ActionID.View;
        };
        var actionID = getAction(item.workflowStatusId);
        setPanelData({
            bucodeId: BUCodeID !== null && BUCodeID !== void 0 ? BUCodeID : 0,
            candidateId: item.CandidateID,
            assignHR: AssignHR !== null && AssignHR !== void 0 ? AssignHR : "",
            statusId: (_c = item.workflowStatusId) !== null && _c !== void 0 ? _c : item.statusID,
            actionID: actionID,
        });
    }, [data]);
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
        react_1.default.createElement("div", { className: "candidate-table" },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "candidate-table__backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleClose }),
            react_1.default.createElement(framer_motion_1.motion.div, { className: "candidate-table__panel", variants: panelVariants, initial: "hidden", animate: "visible", exit: "exit" },
                react_1.default.createElement("div", { className: "candidate-table__header" },
                    react_1.default.createElement("div", { className: "candidate-table__header-left" },
                        react_1.default.createElement("div", { className: "candidate-table__header-icon" },
                            react_1.default.createElement(lucide_react_1.Users, { size: 20 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h2", { className: "candidate-table__title" }, "Review Candidate Profiles"),
                            react_1.default.createElement("div", { className: "candidate-table__meta" },
                                react_1.default.createElement("span", { className: "candidate-table__badge" }, headerMeta.code),
                                react_1.default.createElement("span", { className: "candidate-table__dot" }),
                                react_1.default.createElement("span", { className: "candidate-table__meta-text" }, headerMeta.title)))),
                    react_1.default.createElement("div", { className: "candidate-table__header-right" },
                        react_1.default.createElement("button", { type: "button", className: "candidate-table__refresh", onClick: handleRefresh, disabled: isRefreshing },
                            react_1.default.createElement(lucide_react_1.RefreshCw, { size: 14, className: isRefreshing ? "spin" : "" }),
                            "Refresh"),
                        react_1.default.createElement("button", { type: "button", className: "candidate-table__close", onClick: handleClose },
                            react_1.default.createElement(lucide_react_1.X, { size: 18 })))),
                react_1.default.createElement("div", { className: "candidate-table__content" },
                    react_1.default.createElement("div", { className: "candidate-table__card" },
                        react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: data, loading: loading !== null && loading !== void 0 ? loading : positionLoading, 
                            // error={error ?? undefined}
                            pageSize: pagination.pageSize, currentPage: pagination.currentPage, totalCount: pagination.totalItems, onPageChange: handlePageChange, onPageSizeChange: handlePageSizeChange, pageSizeOptions: [5, 10, 20, 50], emptyMessage: "No candidates found for this job." }))))),
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, activeCandidateId && (react_1.default.createElement(ShowCandidateDetailsPopup_1.ShowCandidateDetailsPopup, { isOpen: true, candidateId: activeCandidateId, onClose: function () { return setActiveCandidateId(null); }, panelParams: paneldata !== null && paneldata !== void 0 ? paneldata : null, positionDetails: positionDetails !== null && positionDetails !== void 0 ? positionDetails : null, handleRefresh: handleRefresh }))),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))));
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