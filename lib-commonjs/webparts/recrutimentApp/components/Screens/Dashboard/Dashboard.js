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
var UIStateContext_1 = require("../../RecrutimentApp/UIStateContext");
var DashboardSkeleton_1 = require("./DashboardSkeleton");
var Dashboard = function (props) {
    var _a;
    var _b = (0, react_1.useState)(0), activeMetric = _b[0], setActiveMetric = _b[1];
    var navigate = (0, react_router_1.useNavigate)();
    var martics = (0, useDashboardMetrics_1.useDashboardMetrics)();
    var _c = (0, UIStateContext_1.useUIState)(), setActiveMenuID = _c.setActiveMenuID, setNavigationPath = _c.setNavigationPath, setActiveTab = _c.setActiveTab, navigationPath = _c.navigationPath, setMatricID = _c.setMatricID;
    var _d = (0, usetrackerdata_1.useTrackerData)(activeMetric), trackerData = _d.trackerData, trackerLoading = _d.loading;
    var ref = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () {
        if (martics.metrics.length > 0 && !activeMetric) {
            setActiveMetric(martics.metrics[0].id);
            setNavigationPath(martics.metrics[0].path);
            ref.current = martics.metrics[0].menuId;
            // setActiveMenuID(martics.metrics[0].menuId);
            setActiveTab(martics.metrics[0].TabValue);
            setMatricID(martics.metrics[0].id);
        }
    }, [martics.metrics]);
    var _e = (0, useUrgentTasks_1.useUrgentTasks)(), urgentTasks = _e.urgentTasks, urgentLoading = _e.loading;
    var onMetricChange = function (data) {
        setActiveMetric(data.id);
        setNavigationPath(data.path);
        // setActiveMenuID(data.menuId);
        ref.current = data.menuId;
        setActiveTab(data.TabValue);
        setMatricID(data.id);
    };
    var onTrackerChange = function (row) {
        setActiveMenuID(ref.current);
        navigate(navigationPath);
    };
    var selectedMetric = (_a = martics.metrics.find(function (m) { return m.id === activeMetric; })) !== null && _a !== void 0 ? _a : martics.metrics[0];
    var priorityData = (0, metricColumns_config_1.priorityValues)(martics.metrics);
    var total = (0, metricColumns_config_1.totalPriority)(martics.metrics);
    var loading = martics.loading || trackerLoading || urgentLoading;
    var hasMetrics = martics.metrics && martics.metrics.length > 0;
    var metricsContainer = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
    };
    var metricItem = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.3 } },
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, loading ? (react_1.default.createElement(DashboardSkeleton_1.DashboardSkeleton, { key: "dashboard-skeleton" })) : (react_1.default.createElement(framer_motion_1.motion.div, { key: "dashboard-content", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }, !hasMetrics ? (react_1.default.createElement("div", { className: "dashboard-empty" },
            react_1.default.createElement("div", { className: "dashboard-empty__title" }, "No dashboard metrics available"),
            react_1.default.createElement("div", { className: "dashboard-empty__subtitle" }, "Please check your permissions or try again later."))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(framer_motion_1.motion.div, { className: "metrics-grid", variants: metricsContainer, initial: "hidden", animate: "visible" }, martics.metrics.map(function (metric) { return (react_1.default.createElement(framer_motion_1.motion.div, { key: metric.id, variants: metricItem },
                react_1.default.createElement(matric_1.default, { metric: metric, active: activeMetric === metric.id, onClick: function () { return onMetricChange(metric); } }))); })),
            react_1.default.createElement("div", { className: "dashboard-layout" },
                react_1.default.createElement("div", { className: "tracker-panel" },
                    react_1.default.createElement(Tracker_1.default, { rows: trackerData, selectedMetric: selectedMetric, activeMetric: activeMetric, onRowClick: function (row) { return onTrackerChange(row); } })),
                react_1.default.createElement("div", { className: "priority-panel" },
                    react_1.default.createElement(PriorityWidget_1.default, { data: priorityData, total: total })),
                react_1.default.createElement("div", { className: "urgent-panel" },
                    react_1.default.createElement(UrgentWidget_1.default, { tasks: urgentTasks }))))))))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map