"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineAreaChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var recharts_1 = require("recharts");
var Charts_module_scss_1 = tslib_1.__importDefault(require("./Charts.module.scss"));
var MOCK_TIME_DATA = [
    { name: "May '25", onTrack: 10, atRisk: 3, overdue: 1 },
    { name: "Jun '25", onTrack: 12, atRisk: 4, overdue: 2 },
    { name: "Jul '25", onTrack: 11, atRisk: 3, overdue: 2 },
    { name: "Aug '25", onTrack: 14, atRisk: 5, overdue: 3 },
    { name: "Sep '25", onTrack: 15, atRisk: 4, overdue: 3 },
    { name: "Oct '25", onTrack: 18, atRisk: 6, overdue: 3 }
];
var LineAreaChart = function () {
    return (react_1.default.createElement("div", { className: Charts_module_scss_1.default.lineChartContainer },
        react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
            react_1.default.createElement(recharts_1.AreaChart, { data: MOCK_TIME_DATA, margin: { top: 10, right: 10, left: -25, bottom: 0 } },
                react_1.default.createElement("defs", null,
                    react_1.default.createElement("linearGradient", { id: "colorOnTrack", x1: "0", y1: "0", x2: "0", y2: "1" },
                        react_1.default.createElement("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.2 }),
                        react_1.default.createElement("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })),
                    react_1.default.createElement("linearGradient", { id: "colorAtRisk", x1: "0", y1: "0", x2: "0", y2: "1" },
                        react_1.default.createElement("stop", { offset: "5%", stopColor: "#f59e0b", stopOpacity: 0.2 }),
                        react_1.default.createElement("stop", { offset: "95%", stopColor: "#f59e0b", stopOpacity: 0 })),
                    react_1.default.createElement("linearGradient", { id: "colorOverdue", x1: "0", y1: "0", x2: "0", y2: "1" },
                        react_1.default.createElement("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.2 }),
                        react_1.default.createElement("stop", { offset: "95%", stopColor: "#ef4444", stopOpacity: 0 }))),
                react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
                react_1.default.createElement(recharts_1.XAxis, { dataKey: "name", tickLine: false, axisLine: false, tick: { fill: "#64748b", fontSize: 11 } }),
                react_1.default.createElement(recharts_1.YAxis, { tickLine: false, axisLine: false, tick: { fill: "#64748b", fontSize: 11 } }),
                react_1.default.createElement(recharts_1.Tooltip, { content: function (_a) {
                        var active = _a.active, payload = _a.payload, label = _a.label;
                        if (active && payload && payload.length) {
                            return (react_1.default.createElement("div", { className: Charts_module_scss_1.default.lineChartTooltip },
                                react_1.default.createElement("div", { className: Charts_module_scss_1.default.tooltipTitle }, label),
                                payload.map(function (p, index) { return (react_1.default.createElement("div", { key: index, className: Charts_module_scss_1.default.tooltipItem },
                                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.tooltipDot, style: { backgroundColor: p.color } }),
                                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.tooltipLabel },
                                        p.name,
                                        ":"),
                                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.tooltipValue }, p.value))); })));
                        }
                        return null;
                    } }),
                react_1.default.createElement(recharts_1.Area, { type: "monotone", dataKey: "onTrack", name: "On Track", stroke: "#10b981", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorOnTrack)" }),
                react_1.default.createElement(recharts_1.Area, { type: "monotone", dataKey: "atRisk", name: "At Risk", stroke: "#f59e0b", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorAtRisk)" }),
                react_1.default.createElement(recharts_1.Area, { type: "monotone", dataKey: "overdue", name: "Overdue", stroke: "#ef4444", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorOverdue)" })))));
};
exports.LineAreaChart = LineAreaChart;
exports.default = exports.LineAreaChart;
//# sourceMappingURL=LineAreaChart.js.map