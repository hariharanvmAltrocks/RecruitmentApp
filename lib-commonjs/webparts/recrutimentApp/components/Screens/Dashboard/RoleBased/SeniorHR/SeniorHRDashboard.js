"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeniorHRDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var SeniorHRDashboard_module_scss_1 = tslib_1.__importDefault(require("./SeniorHRDashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var framer_motion_1 = require("framer-motion");
var Dashboard_1 = require("../../Dashboard");
var matric_1 = tslib_1.__importDefault(require("../../../../Comman/MatricBox/matric"));
var useSeniorHRDashboard_1 = tslib_1.__importDefault(require("../../Hooks/useSeniorHRDashboard"));
var CommonSummaryCards_1 = tslib_1.__importDefault(require("../../DashboardComman/CommonSummaryCards"));
var SeniorHRComponents_1 = require("../../DashboardComman/SeniorHRComponenet/SeniorHRComponents");
var SeniorHRDashboard = function (_a) {
    var _b;
    var userName = _a.userName, metrics = _a.metrics, onCardClick = _a.onCardClick, loading = _a.loading, handleRefresh = _a.handleRefresh, active = _a.active;
    var _c = (0, useSeniorHRDashboard_1.default)(), data = _c.data, shrLoading = _c.loading, shrRefresh = _c.refresh;
    var isDashboardLoading = shrLoading;
    return (react_1.default.createElement("div", { className: SeniorHRDashboard_module_scss_1.default.dashboardContainer, "aria-label": "Senior HR Dashboard" },
        react_1.default.createElement(framer_motion_1.motion.div, { className: "metrics-grid", variants: Dashboard_1.metricsContainer, initial: "hidden", animate: "visible" },
            react_1.default.createElement(matric_1.default, { metrics: metrics, onCardClick: function (metric) { return onCardClick(metric); }, loading: loading, handleRefresh: handleRefresh, active: active })),
        react_1.default.createElement("div", { className: SeniorHRDashboard_module_scss_1.default.refreshToolbar },
            react_1.default.createElement("button", { type: "button", className: SeniorHRDashboard_module_scss_1.default.refreshBtn, onClick: function () {
                    handleRefresh();
                    shrRefresh();
                }, disabled: loading || shrLoading, "aria-label": "Refresh Dashboard Data" },
                react_1.default.createElement(Lucide.RefreshCw, { size: 13, className: (loading || shrLoading) ? SeniorHRDashboard_module_scss_1.default.spin : undefined }),
                react_1.default.createElement("span", null, "Refresh Dashboard Data"))),
        react_1.default.createElement(CommonSummaryCards_1.default, { cards: (_b = data === null || data === void 0 ? void 0 : data.summary) !== null && _b !== void 0 ? _b : [], loading: isDashboardLoading }),
        react_1.default.createElement("div", { className: SeniorHRDashboard_module_scss_1.default.grid2 },
            react_1.default.createElement(SeniorHRComponents_1.PositionsOverviewChart, { data: (data === null || data === void 0 ? void 0 : data.monthlyTracker) || [], loading: isDashboardLoading }),
            react_1.default.createElement(SeniorHRComponents_1.DepartmentDemandOverview, { data: (data === null || data === void 0 ? void 0 : data.departmentPositions) || [], loading: isDashboardLoading })),
        react_1.default.createElement("div", { className: SeniorHRDashboard_module_scss_1.default.grid2 },
            react_1.default.createElement(SeniorHRComponents_1.HRLeadsPerformance, { data: (data === null || data === void 0 ? void 0 : data.HrLeadPerformance) || [], loading: isDashboardLoading }),
            react_1.default.createElement(SeniorHRComponents_1.ConflictOfInterestAlerts, { data: (data === null || data === void 0 ? void 0 : data.conflictOfInterestAlerts) || [], loading: isDashboardLoading })),
        react_1.default.createElement("div", { className: SeniorHRDashboard_module_scss_1.default.myTasksSection },
            react_1.default.createElement(SeniorHRComponents_1.SeniorHRTaskTable, { data: data === null || data === void 0 ? void 0 : data.tasks, loading: isDashboardLoading }))));
};
exports.SeniorHRDashboard = SeniorHRDashboard;
exports.default = exports.SeniorHRDashboard;
//# sourceMappingURL=SeniorHRDashboard.js.map