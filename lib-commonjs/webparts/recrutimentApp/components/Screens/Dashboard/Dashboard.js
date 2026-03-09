"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var data_1 = require("../../MockData/data");
var framer_motion_1 = require("framer-motion");
var matric_1 = tslib_1.__importDefault(require("../../Comman/MatricBox/matric"));
var TrackerTable_1 = tslib_1.__importDefault(require("../TrackerTable"));
var PriorityWidget_1 = tslib_1.__importDefault(require("../PriorityWidget"));
var UrgentWidget_1 = tslib_1.__importDefault(require("../UrgentWidget"));
require("./Dashboard.scss");
var Dashboard = function (_a) {
    var activeMetric = _a.activeMetric, onMetricChange = _a.onMetricChange, onRowClick = _a.onRowClick;
    var selectedMetric = data_1.METRICS.find(function (m) { return m.id === activeMetric; }) || data_1.METRICS[0];
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard", key: "dashboard", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
        react_1.default.createElement("div", { className: "metrics-grid" }, data_1.METRICS.map(function (metric) { return (react_1.default.createElement(matric_1.default, { key: metric.id, metric: metric, active: activeMetric === metric.id, onClick: function () { return onMetricChange(metric.id); } })); })),
        react_1.default.createElement("div", { className: "dashboard-layout" },
            react_1.default.createElement("div", { className: "dashboard-main" },
                react_1.default.createElement(TrackerTable_1.default, { data: data_1.TRACKER_DATA, activeMetric: activeMetric, selectedMetric: selectedMetric, onRowClick: onRowClick })),
            react_1.default.createElement("div", { className: "dashboard-sidebar" },
                react_1.default.createElement(PriorityWidget_1.default, { data: data_1.PRIORITY_DATA }),
                react_1.default.createElement(UrgentWidget_1.default, { tasks: data_1.URGENT_TASKS })))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map