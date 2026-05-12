"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
require("./MyTracker.module.scss");
var react_router_1 = require("react-router");
var usetrackerdata_1 = require("../Hooks/usetrackerdata");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var loading_1 = tslib_1.__importDefault(require("../../../Comman/Loading/loading"));
var matric_1 = tslib_1.__importDefault(require("../../../Comman/MatricBox/matric"));
var Tracker_1 = tslib_1.__importDefault(require("../../../Comman/Tracker/Tracker"));
var useDashboardMetrics_1 = require("../Hooks/useDashboardMetrics");
var Mytracker = function (props) {
    var _a;
    var activeMetric = (0, UIStateContext_1.useUIState)().MatricID;
    var _b = (0, react_1.useState)(0), refreshKey = _b[0], setRefreshKey = _b[1];
    var _c = (0, usetrackerdata_1.useTrackerData)(activeMetric, refreshKey), trackerData = _c.trackerData, trackerLoading = _c.loading;
    var martics = (0, useDashboardMetrics_1.useDashboardMetrics)(refreshKey);
    var navigate = (0, react_router_1.useNavigate)();
    var _d = (0, UIStateContext_1.useUIState)(), setActiveMenuID = _d.setActiveMenuID, setNavigationPath = _d.setNavigationPath, setActiveTab = _d.setActiveTab, navigationPath = _d.navigationPath, setMatricID = _d.setMatricID, setCurrentTabName = _d.setCurrentTabName;
    var ref = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () {
        if (martics.metrics.length > 0 && !activeMetric) {
            // setActiveMetric(martics.metrics[0].id);
            setNavigationPath(martics.metrics[0].path);
            ref.current = martics.metrics[0].menuId;
            // setActiveMenuID(martics.metrics[0].menuId);
            setActiveTab(martics.metrics[0].TabValue);
            setCurrentTabName(martics.metrics[0].TabName);
            setMatricID(martics.metrics[0].id);
        }
    }, [martics.metrics]);
    var onMetricChange = function (data) {
        // setActiveMetric(data.id);
        setNavigationPath(data.path);
        // setActiveMenuID(data.menuId);
        ref.current = data.menuId;
        setActiveTab(data.TabValue);
        setCurrentTabName(data.TabName);
        setMatricID(data.id);
    };
    var handleRefresh = function () {
        setRefreshKey(function (prev) { return prev + 1; });
        // setActiveMetric(0);
    };
    var selectedMetric = (_a = martics.metrics.find(function (m) { return m.id === activeMetric; })) !== null && _a !== void 0 ? _a : martics.metrics[0];
    var loading = martics.loading || trackerLoading || martics.metrics.length === 0;
    var hasMetrics = martics.metrics && martics.metrics.length > 0;
    var onTrackerChange = function (row) {
        if (selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.showArrow) {
            setActiveMenuID(ref.current);
            navigate(navigationPath);
        }
    };
    var metricsContainer = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };
    var metricItem = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.3 } },
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, loading ? (react_1.default.createElement(loading_1.default, null)) : (react_1.default.createElement(framer_motion_1.motion.div, { key: "dashboard-content", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }, !hasMetrics ? (react_1.default.createElement("div", { className: "dashboard-empty" },
            react_1.default.createElement("div", { className: "dashboard-empty__title" }, "No dashboard metrics available"),
            react_1.default.createElement("div", { className: "dashboard-empty__subtitle" }, "Please check your permissions or try again later."))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(framer_motion_1.motion.div, { className: "metrics-grid", variants: metricsContainer, initial: "hidden", animate: "visible" },
                react_1.default.createElement(matric_1.default, { metrics: martics.metrics, onCardClick: function (metric) { return onMetricChange(metric); }, loading: loading, handleRefresh: handleRefresh, active: activeMetric })),
            react_1.default.createElement("div", { className: "dashboard-layout" },
                react_1.default.createElement("div", { className: "tracker-panel" },
                    react_1.default.createElement(Tracker_1.default, { rows: trackerData, selectedMetric: selectedMetric, activeMetric: activeMetric, onRowClick: function (row) { return onTrackerChange(row); } }))))))))));
};
exports.default = Mytracker;
//# sourceMappingURL=Mytracker.js.map