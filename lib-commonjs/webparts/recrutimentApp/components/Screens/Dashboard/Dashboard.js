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
var Dashboard = function (_a) {
    var _b, _c, _d;
    var onRowClick = _a.onRowClick;
    var _e = (0, react_1.useState)(""), activeMetric = _e[0], setActiveMetric = _e[1];
    var _f = (0, react_1.useState)([]), trackerRowData = _f[0], setTrackerRowData = _f[1];
    var martics = (0, useDashboardMetrics_1.useDashboardMetrics)();
    console.log(martics);
    var trackdata = (0, usetrackerdata_1.useTrackerData)((_b = martics.metrics[0]) === null || _b === void 0 ? void 0 : _b.id);
    console.log(trackdata, "trackdata");
    (0, react_1.useEffect)(function () {
        if (martics.metrics.length > 0 && !activeMetric) {
            setActiveMetric(martics.metrics[0].id);
        }
        if (trackdata.trackerData.length > 0) {
            setTrackerRowData(trackdata.trackerData);
        }
    }, [martics.metrics, trackdata.trackerData]);
    var urgentTasks = (0, useUrgentTasks_1.useUrgentTasks)().urgentTasks;
    console.log(activeMetric, "Active");
    var onMetricChange = function (id) {
        setActiveMetric(id);
    };
    var selectedMetric = martics.metrics.find(function (m) { return m.id === activeMetric; }) || martics.metrics[0];
    var hodReviewsValue = ((_c = martics.metrics.find(function (m) { return m.id === 'hod-review'; })) === null || _c === void 0 ? void 0 : _c.value) || 0;
    var posMappingValue = ((_d = martics.metrics.find(function (m) { return m.id === 'pos-mapping'; })) === null || _d === void 0 ? void 0 : _d.value) || 0;
    var totalPriority = hodReviewsValue + posMappingValue;
    var priorityData = [
        {
            name: 'HOD Reviews',
            value: hodReviewsValue,
            percent: totalPriority > 0 ? Math.round((hodReviewsValue / totalPriority) * 100) : 0,
            color: '#3B82F6'
        },
        {
            name: 'Position Mapping',
            value: posMappingValue,
            percent: totalPriority > 0 ? Math.round((posMappingValue / totalPriority) * 100) : 0,
            color: '#F59E0B'
        }
    ];
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
        react_1.default.createElement("div", { className: "metrics-grid" }, martics.metrics.map(function (metric) { return (react_1.default.createElement(matric_1.default, { key: metric.id, metric: metric, active: activeMetric === metric.id, onClick: function () { return onMetricChange(metric.id); } })); })),
        react_1.default.createElement("div", { className: "dashboard-layout" },
            react_1.default.createElement("div", { className: "tracker-panel" },
                react_1.default.createElement(Tracker_1.default, { rows: trackerRowData, selectedMetric: selectedMetric, activeMetric: activeMetric })),
            react_1.default.createElement("div", { className: "priority-panel" },
                react_1.default.createElement(PriorityWidget_1.default, { data: priorityData, total: totalPriority })),
            react_1.default.createElement("div", { className: "urgent-panel" },
                react_1.default.createElement(UrgentWidget_1.default, { tasks: urgentTasks })))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map