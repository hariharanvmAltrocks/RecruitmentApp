"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HODashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var HODashboard_module_scss_1 = tslib_1.__importDefault(require("./HODashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var framer_motion_1 = require("framer-motion");
var Dashboard_1 = require("../../Dashboard");
var matric_1 = tslib_1.__importDefault(require("../../../../Comman/MatricBox/matric"));
var useHODahboard_1 = tslib_1.__importDefault(require("../../Hooks/useHODahboard"));
var CommonSummaryCards_1 = tslib_1.__importDefault(require("../../DashboardComman/CommonSummaryCards"));
var HODComponents_1 = require("../../DashboardComman/HODComponenet/HODComponents");
var PositionStatusChart_1 = tslib_1.__importDefault(require("../../DashboardComman/PositionStatusChart/PositionStatusChart"));
var TaskTable_1 = tslib_1.__importDefault(require("../../DashboardComman/Tables/TaskTable"));
var PositionTrackerChart_1 = require("../../Charts/PositionTrackerChart");
var HODashboard = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var userName = _a.userName, metrics = _a.metrics, onCardClick = _a.onCardClick, loading = _a.loading, handleRefresh = _a.handleRefresh, active = _a.active;
    var _h = (0, useHODahboard_1.default)(), data = _h.data, hodLoading = _h.loading, hodRefresh = _h.refresh;
    var isDashboardLoading = loading || hodLoading;
    return (react_1.default.createElement("div", { className: HODashboard_module_scss_1.default.dashboardContainer, "aria-label": "HOD Dashboard" },
        react_1.default.createElement(framer_motion_1.motion.div, { className: "metrics-grid", variants: Dashboard_1.metricsContainer, initial: "hidden", animate: "visible" },
            react_1.default.createElement(matric_1.default, { metrics: metrics, onCardClick: function (metric) { return onCardClick(metric); }, loading: loading, handleRefresh: handleRefresh, active: active })),
        react_1.default.createElement("div", { className: HODashboard_module_scss_1.default.refreshToolbar },
            react_1.default.createElement("button", { type: "button", className: HODashboard_module_scss_1.default.refreshBtn, onClick: function () {
                    handleRefresh();
                    hodRefresh();
                }, disabled: loading || hodLoading, "aria-label": "Refresh Dashboard Data" },
                react_1.default.createElement(Lucide.RefreshCw, { size: 13, className: (loading || hodLoading) ? HODashboard_module_scss_1.default.spin : undefined }),
                react_1.default.createElement("span", null, "Refresh Dashboard Data"))),
        react_1.default.createElement(CommonSummaryCards_1.default, { cards: (_b = data === null || data === void 0 ? void 0 : data.summary) !== null && _b !== void 0 ? _b : [], loading: isDashboardLoading }),
        react_1.default.createElement("div", { className: HODashboard_module_scss_1.default.grid2 },
            react_1.default.createElement(PositionTrackerChart_1.PositionTrackerChart, { data: (_c = data === null || data === void 0 ? void 0 : data.monthlyTracker) !== null && _c !== void 0 ? _c : [], loading: isDashboardLoading }),
            react_1.default.createElement(HODComponents_1.PositionsJobRole, { data: (_d = data === null || data === void 0 ? void 0 : data.positionsJobRole) !== null && _d !== void 0 ? _d : [], loading: isDashboardLoading })),
        react_1.default.createElement("div", { className: HODashboard_module_scss_1.default.grid3 },
            react_1.default.createElement(HODComponents_1.TeamSummary, { data: (_e = data === null || data === void 0 ? void 0 : data.HRSummary) !== null && _e !== void 0 ? _e : [], loading: isDashboardLoading }),
            react_1.default.createElement(PositionStatusChart_1.default, { data: (_f = data === null || data === void 0 ? void 0 : data.PositionStatus) !== null && _f !== void 0 ? _f : null, loading: isDashboardLoading }),
            react_1.default.createElement(HODComponents_1.MyApprovals, { data: (_g = data === null || data === void 0 ? void 0 : data.MyApprovals) !== null && _g !== void 0 ? _g : [], loading: isDashboardLoading })),
        react_1.default.createElement("div", { className: HODashboard_module_scss_1.default.myTasksSection },
            react_1.default.createElement(TaskTable_1.default, { data: data === null || data === void 0 ? void 0 : data.tasks, loading: loading }))));
};
exports.HODashboard = HODashboard;
exports.default = exports.HODashboard;
//# sourceMappingURL=HODashboard.js.map