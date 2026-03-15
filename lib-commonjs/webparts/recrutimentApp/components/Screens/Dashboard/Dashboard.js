"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var matric_1 = tslib_1.__importDefault(require("../../Comman/MatricBox/matric"));
require("./Dashboard.scss");
var useDashboardMetrics_1 = require("./Hooks/useDashboardMetrics");
var usetrackerdata_1 = require("./Hooks/usetrackerdata");
var Tracker_1 = tslib_1.__importDefault(require("../../Comman/Tracker/Tracker"));
var PriorityWidget_1 = tslib_1.__importDefault(require("../../Comman/PriorityWidget/PriorityWidget"));
var UrgentWidget_1 = tslib_1.__importDefault(require("../../Comman/UrgentWidget/UrgentWidget"));
var useUrgentTasks_1 = require("./Hooks/useUrgentTasks");
var metricColumns_config_1 = require("./metricColumns.config");
var react_router_1 = require("react-router");
var useStateHooks_1 = require("../../RecrutimentApp/useStateHooks");
var Dashboard = function (props) {
    var _a;
    var _b = (0, react_1.useState)(0), activeMetric = _b[0], setActiveMetric = _b[1];
    var navigate = (0, react_router_1.useNavigate)();
    var martics = (0, useDashboardMetrics_1.useDashboardMetrics)();
    var _c = (0, useStateHooks_1.useStateHooks)(), setactiveMenuID = _c.setactiveMenuID, setNavigationPath = _c.setNavigationPath, setActiveTab = _c.setActiveTab, navigationPath = _c.navigationPath;
    var trackerData = (0, usetrackerdata_1.useTrackerData)(activeMetric).trackerData;
    (0, react_1.useEffect)(function () {
        if (martics.metrics.length > 0 && !activeMetric) {
            setActiveMetric(martics.metrics[0].id);
        }
    }, [martics.metrics]);
    var urgentTasks = (0, useUrgentTasks_1.useUrgentTasks)().urgentTasks;
    var onMetricChange = function (data) {
        setActiveMetric(data.id);
        setNavigationPath(data.path);
        setactiveMenuID(data.menuId);
        setActiveTab(data.TabValue);
    };
    var onTrackerChange = function (row) {
        navigate(navigationPath);
    };
    var selectedMetric = (_a = martics.metrics.find(function (m) { return m.id === activeMetric; })) !== null && _a !== void 0 ? _a : martics.metrics[0];
    var priorityData = (0, metricColumns_config_1.priorityValues)(martics.metrics);
    var total = (0, metricColumns_config_1.totalPriority)(martics.metrics);
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
        react_1.default.createElement("div", { className: "metrics-grid" }, martics.metrics.map(function (metric) { return (react_1.default.createElement(matric_1.default, { key: metric.id, metric: metric, active: activeMetric === metric.id, onClick: function () { return onMetricChange(metric); } })); })),
        react_1.default.createElement("div", { className: "dashboard-layout" },
            react_1.default.createElement("div", { className: "tracker-panel" },
                react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
                    react_1.default.createElement(Tracker_1.default, { rows: trackerData, selectedMetric: selectedMetric, activeMetric: activeMetric, onRowClick: function (row) { return onTrackerChange(row); } }))),
            react_1.default.createElement("div", { className: "priority-panel" },
                react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
                    react_1.default.createElement(PriorityWidget_1.default, { data: priorityData, total: total }))),
            react_1.default.createElement("div", { className: "urgent-panel" },
                react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
                    react_1.default.createElement(UrgentWidget_1.default, { tasks: urgentTasks }))))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map