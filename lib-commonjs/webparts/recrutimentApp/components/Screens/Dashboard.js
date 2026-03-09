"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var data_1 = require("../MockData/data");
var framer_motion_1 = require("framer-motion");
var matric_1 = tslib_1.__importDefault(require("./matric"));
var TrackerTable_1 = tslib_1.__importDefault(require("./TrackerTable"));
var PriorityWidget_1 = tslib_1.__importDefault(require("./PriorityWidget"));
var UrgentWidget_1 = tslib_1.__importDefault(require("./UrgentWidget"));
var Dashboard = function (_a) {
    var activeMetric = _a.activeMetric, onMetricChange = _a.onMetricChange, onRowClick = _a.onRowClick;
    var selectedMetric = data_1.METRICS.find(function (m) { return m.id === activeMetric; }) || data_1.METRICS[0];
    return (react_1.default.createElement(framer_motion_1.motion.div, { key: "dashboard", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
        react_1.default.createElement("div", { className: "flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm" },
            react_1.default.createElement("div", { className: "flex items-center gap-6" },
                react_1.default.createElement("div", { className: "flex items-center gap-3" },
                    react_1.default.createElement("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest" }, "Dept."),
                    react_1.default.createElement("select", { className: "bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none" },
                        react_1.default.createElement("option", null, "All Departments"),
                        react_1.default.createElement("option", null, "Mining"),
                        react_1.default.createElement("option", null, "Engineering"))),
                react_1.default.createElement("div", { className: "w-px h-6 bg-slate-200" }),
                react_1.default.createElement("div", { className: "flex items-center gap-3" },
                    react_1.default.createElement("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest" }, "Nationality"),
                    react_1.default.createElement("select", { className: "bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none" },
                        react_1.default.createElement("option", null, "All Nationalities"),
                        react_1.default.createElement("option", null, "Local"),
                        react_1.default.createElement("option", null, "Expat")))),
            react_1.default.createElement("button", { className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider transition-colors" },
                react_1.default.createElement(lucide_react_1.RotateCcw, { size: 14 }),
                " Reset")),
        react_1.default.createElement("div", { className: "flex grid-cols-4 lg:grid-cols-8 gap-4 mb-8" }, data_1.METRICS.map(function (metric) { return (react_1.default.createElement(matric_1.default, { key: metric.id, metric: metric, active: activeMetric === metric.id, onClick: function () { return onMetricChange(metric.id); } })); })),
        react_1.default.createElement("div", { className: "flex gap-8" },
            react_1.default.createElement("div", { className: "flex-[2] flex flex-col gap-6" },
                react_1.default.createElement(TrackerTable_1.default, { data: data_1.TRACKER_DATA, activeMetric: activeMetric, selectedMetric: selectedMetric, onRowClick: onRowClick })),
            react_1.default.createElement("div", { className: "flex-1 flex flex-col gap-6" },
                react_1.default.createElement(PriorityWidget_1.default, { data: data_1.PRIORITY_DATA }),
                react_1.default.createElement(UrgentWidget_1.default, { tasks: data_1.URGENT_TASKS })))));
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map