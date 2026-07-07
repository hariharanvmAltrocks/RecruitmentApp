"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var HRDashboard_module_scss_1 = tslib_1.__importDefault(require("./HRDashboard.module.scss"));
var useHRDashboard_1 = tslib_1.__importDefault(require("../../Hooks/useHRDashboard"));
var PositionTrackerChart_1 = tslib_1.__importDefault(require("../../Charts/PositionTrackerChart"));
var DepartmentChart_1 = tslib_1.__importDefault(require("../../Charts/DepartmentChart"));
var CandidatePipelineChart_1 = tslib_1.__importDefault(require("../../Charts/CandidatePipelineChart"));
var framer_motion_1 = require("framer-motion");
var matric_1 = tslib_1.__importDefault(require("../../../../Comman/MatricBox/matric"));
var Dashboard_1 = require("../../Dashboard");
var TaskTable_1 = tslib_1.__importDefault(require("../../DashboardComman/Tables/TaskTable"));
var CommonSummaryCards_1 = tslib_1.__importDefault(require("../../DashboardComman/CommonSummaryCards"));
var HRDashboard = function (_a) {
    var _b;
    var userName = _a.userName, metrics = _a.metrics, onCardClick = _a.onCardClick, loading = _a.loading, handleRefresh = _a.handleRefresh, active = _a.active;
    var _c = (0, useHRDashboard_1.default)(), data = _c.data, HRLoading = _c.loading, error = _c.error, hrRefresh = _c.refresh;
    if (error) {
        return (react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.errorContainer },
            react_1.default.createElement(Lucide.AlertCircle, { size: 40, className: HRDashboard_module_scss_1.default.errorIcon }),
            react_1.default.createElement("h2", null, "Failed to load HR Dashboard"),
            react_1.default.createElement("p", null, error.message || "An unexpected error occurred."),
            react_1.default.createElement("button", { className: HRDashboard_module_scss_1.default.retryBtn, onClick: hrRefresh }, "Retry Load")));
    }
    return (react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.container },
        react_1.default.createElement(framer_motion_1.motion.div, { className: "metrics-grid", variants: Dashboard_1.metricsContainer, initial: "hidden", animate: "visible" },
            react_1.default.createElement(matric_1.default, { metrics: metrics, onCardClick: function (metric) { return onCardClick(metric); }, loading: loading, handleRefresh: handleRefresh, active: active })),
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.refreshToolbar },
            react_1.default.createElement("button", { type: "button", className: HRDashboard_module_scss_1.default.refreshBtn, onClick: function () {
                    handleRefresh();
                    hrRefresh();
                }, disabled: loading || HRLoading, "aria-label": "Refresh Dashboard" },
                react_1.default.createElement(Lucide.RefreshCw, { size: 13, className: (loading || HRLoading) ? HRDashboard_module_scss_1.default.spin : undefined }),
                react_1.default.createElement("span", null, "Refresh Dashboard Data"))),
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.summarySection },
            react_1.default.createElement(CommonSummaryCards_1.default, { cards: (_b = data === null || data === void 0 ? void 0 : data.summary) !== null && _b !== void 0 ? _b : [], loading: HRLoading })),
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.dashboardGrid },
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.gridItem },
                react_1.default.createElement(PositionTrackerChart_1.default, { data: data === null || data === void 0 ? void 0 : data.monthlyTracker, loading: HRLoading })),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.gridItem },
                react_1.default.createElement(DepartmentChart_1.default, { data: data === null || data === void 0 ? void 0 : data.departmentPositions, loading: HRLoading })),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.gridItem },
                react_1.default.createElement(CandidatePipelineChart_1.default, { data: data === null || data === void 0 ? void 0 : data.candidatePipeline, loading: HRLoading }))),
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.myTasksSection },
            react_1.default.createElement(TaskTable_1.default, { data: data === null || data === void 0 ? void 0 : data.tasks, loading: HRLoading }))));
};
exports.HRDashboard = HRDashboard;
exports.default = exports.HRDashboard;
//# sourceMappingURL=HRDashboard.js.map