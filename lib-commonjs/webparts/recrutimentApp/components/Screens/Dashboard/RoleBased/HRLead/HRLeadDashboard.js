"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRLeadDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var SummaryCards_1 = tslib_1.__importDefault(require("../../DashboardComman/SummaryCards"));
var PositionStatusChart_1 = tslib_1.__importDefault(require("../../DashboardComman/PositionStatusChart/PositionStatusChart"));
var HRWorkflowOverview_1 = tslib_1.__importDefault(require("../../DashboardComman/HRWorkflowOverview/HRWorkflowOverview"));
var UpcomingPositionsTable_1 = tslib_1.__importDefault(require("../../DashboardComman/UpcomingPositionsTable/UpcomingPositionsTable"));
var Dashboard_module_scss_1 = tslib_1.__importDefault(require("../../Dashboard.module.scss"));
var framer_motion_1 = require("framer-motion");
var matric_1 = tslib_1.__importDefault(require("../../../../Comman/MatricBox/matric"));
var useHRLeadDashboardData_1 = require("../../Hooks/useHRLeadDashboardData");
var Lucide = tslib_1.__importStar(require("lucide-react"));
var Dashboard_1 = require("../../Dashboard");
var DepartmentChart_1 = tslib_1.__importDefault(require("../../Charts/DepartmentChart"));
var ModalPopup_1 = tslib_1.__importDefault(require("../../../../Comman/ModalPopup/ModalPopup"));
var useModalPopup_1 = require("../../../../Comman/ModalPopup/useModalPopup");
var HRLeadDashboard = function (_a) {
    var userName = _a.userName, metrics = _a.metrics, onCardClick = _a.onCardClick, loading = _a.loading, handleRefresh = _a.handleRefresh, active = _a.active;
    var _b = (0, useHRLeadDashboardData_1.useHRLeadDashboardData)(), hrLeadData = _b.data, hrLeadLoading = _b.loading, refreshHRLead = _b.refresh;
    var _c = (0, useModalPopup_1.useModalPopup)(), modalState = _c.modalState, showModal = _c.showModal, closeModal = _c.closeModal;
    var handleSuccessChangeHR = function () {
        showModal({
            type: "success",
            title: "Success",
            message: "HR reassigned successfully.",
            confirmLabel: "OK",
            onConfirm: closeModal,
        });
    };
    return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer, "aria-label": "HR Lead Dashboard" },
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(framer_motion_1.motion.div, { className: "metrics-grid", variants: Dashboard_1.metricsContainer, initial: "hidden", animate: "visible" },
                react_1.default.createElement(matric_1.default, { metrics: metrics, onCardClick: function (metric) { return onCardClick(metric); }, loading: loading, handleRefresh: handleRefresh, active: active })),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.refreshToolbar },
                react_1.default.createElement("button", { type: "button", className: Dashboard_module_scss_1.default.refreshBtn, onClick: function () {
                        handleRefresh();
                        refreshHRLead();
                    }, disabled: loading || hrLeadLoading, "aria-label": "Refresh Dashboard" },
                    react_1.default.createElement(Lucide.RefreshCw, { size: 13, className: (hrLeadLoading) ? Dashboard_module_scss_1.default.spin : undefined }),
                    react_1.default.createElement("span", null, "Refresh Dashboard Data"))),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.topDashboardGrid },
                react_1.default.createElement(SummaryCards_1.default, { data: hrLeadData === null || hrLeadData === void 0 ? void 0 : hrLeadData.HRLeadSummary, loading: hrLeadLoading }),
                react_1.default.createElement(PositionStatusChart_1.default, { data: hrLeadData === null || hrLeadData === void 0 ? void 0 : hrLeadData.PositionByStatus, loading: hrLeadLoading })),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.chartsGrid2 },
                react_1.default.createElement(HRWorkflowOverview_1.default, { data: hrLeadData === null || hrLeadData === void 0 ? void 0 : hrLeadData.PositionSource, loading: hrLeadLoading }),
                react_1.default.createElement(DepartmentChart_1.default, { data: hrLeadData === null || hrLeadData === void 0 ? void 0 : hrLeadData.departmentPositions, loading: hrLeadLoading })),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.tableSection },
                react_1.default.createElement(UpcomingPositionsTable_1.default, { data: hrLeadData === null || hrLeadData === void 0 ? void 0 : hrLeadData.positionDetails, onRefresh: refreshHRLead, loading: hrLeadLoading, onSuccessChangeHR: handleSuccessChangeHR }))),
        react_1.default.createElement(ModalPopup_1.default, tslib_1.__assign({}, modalState, { onClose: closeModal }))));
};
exports.HRLeadDashboard = HRLeadDashboard;
exports.default = exports.HRLeadDashboard;
//# sourceMappingURL=HRLeadDashboard.js.map