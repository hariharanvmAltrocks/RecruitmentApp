"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionTrackerChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var recharts_1 = require("recharts");
var PositionTrackerChart_module_scss_1 = tslib_1.__importDefault(require("./PositionTrackerChart.module.scss"));
var Card_1 = tslib_1.__importDefault(require("../Common/Card"));
var PositionTrackerChart = function (_a) {
    var data = _a.data, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var chartData = (0, react_1.useMemo)(function () { return data || []; }, [data]);
    var memoizedOptions = (0, react_1.useMemo)(function () {
        return {
            tooltipCursor: { fill: "rgba(0, 0, 0, 0.02)" },
            barRadius: [4, 4, 0, 0],
        };
    }, []);
    if (loading || !data) {
        return (react_1.default.createElement(Card_1.default, { className: PositionTrackerChart_module_scss_1.default.chartCard },
            react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.header },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "180px", height: "14px" } })),
            react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.chartPlaceholder, style: { padding: "20px 0" } },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "100%", height: "200px", borderRadius: "8px" } }))));
    }
    return (react_1.default.createElement(Card_1.default, { className: PositionTrackerChart_module_scss_1.default.chartCard },
        react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.header },
            react_1.default.createElement("h3", { className: PositionTrackerChart_module_scss_1.default.title }, "My Positions Tracker (Monthly)")),
        react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.chartContainer },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 220 },
                react_1.default.createElement(recharts_1.ComposedChart, { data: chartData, margin: { top: 10, right: 10, left: 15, bottom: 0 } },
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
                    react_1.default.createElement(recharts_1.XAxis, { dataKey: "month", tickLine: false, axisLine: false, tick: { fill: "#94a3b8", fontSize: 10, fontWeight: 600 } }),
                    react_1.default.createElement(recharts_1.YAxis, { tickLine: false, axisLine: false, tick: { fill: "#94a3b8", fontSize: 10, fontWeight: 600 } }),
                    react_1.default.createElement(recharts_1.Tooltip, { cursor: memoizedOptions.tooltipCursor }),
                    react_1.default.createElement(recharts_1.Legend, { verticalAlign: "top", align: "left", iconType: "circle", iconSize: 8, wrapperStyle: { paddingBottom: 15, fontSize: 11, fontWeight: 700, color: "#64748b" } }),
                    react_1.default.createElement(recharts_1.Bar, { name: "Total Positions", dataKey: "totalPositions", fill: "#3b82f6", radius: memoizedOptions.barRadius, barSize: 12 }),
                    react_1.default.createElement(recharts_1.Bar, { name: "Positions Filled", dataKey: "positionsFilled", fill: "#10b981", radius: memoizedOptions.barRadius, barSize: 12 }),
                    react_1.default.createElement(recharts_1.Line, { name: "Open Positions", type: "monotone", dataKey: "openPositions", stroke: "#f59e0b", strokeWidth: 2, dot: { r: 4, strokeWidth: 1, fill: "#fff" }, activeDot: { r: 6 } }))))));
};
exports.PositionTrackerChart = PositionTrackerChart;
exports.default = exports.PositionTrackerChart;
//# sourceMappingURL=PositionTrackerChart.js.map