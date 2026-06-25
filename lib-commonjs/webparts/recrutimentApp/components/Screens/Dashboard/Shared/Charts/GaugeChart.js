"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaugeChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var recharts_1 = require("recharts");
var Charts_module_scss_1 = tslib_1.__importDefault(require("./Charts.module.scss"));
var GaugeChart = function (_a) {
    var value = _a.value, _b = _a.label, label = _b === void 0 ? "SLA Compliance" : _b;
    // Map value to gauge segments (half donut is 180 degrees)
    var chartData = [
        { value: value },
        { value: 100 - value }
    ];
    // Colors based on performance thresholds
    var activeColor = "#ef4444"; // Red < 70%
    if (value >= 90) {
        activeColor = "#10b981"; // Green >= 90%
    }
    else if (value >= 70) {
        activeColor = "#f59e0b"; // Orange 70-89%
    }
    var COLORS = [activeColor, "#e2e8f0"];
    return (react_1.default.createElement("div", { className: Charts_module_scss_1.default.gaugeContainer },
        react_1.default.createElement("div", { className: Charts_module_scss_1.default.gaugeWrapper },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 150 },
                react_1.default.createElement(recharts_1.PieChart, { margin: { top: 10, bottom: 0 } },
                    react_1.default.createElement(recharts_1.Pie, { data: chartData, cx: "50%", cy: "90%", startAngle: 180, endAngle: 0, innerRadius: 70, outerRadius: 95, dataKey: "value", stroke: "none" },
                        react_1.default.createElement(recharts_1.Cell, { fill: COLORS[0] }),
                        react_1.default.createElement(recharts_1.Cell, { fill: COLORS[1] })))),
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.gaugeTextCenter },
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.gaugeValue },
                    value,
                    "%"),
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.gaugeLabel }, label))),
        react_1.default.createElement("div", { className: Charts_module_scss_1.default.gaugeLegend },
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.legendRow, style: { borderBottom: "none" } },
                react_1.default.createElement("div", { className: Charts_module_scss_1.default.legendLeft },
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.legendDot, style: { backgroundColor: "#10b981" } }),
                    react_1.default.createElement("span", null, "On Track (\u2265 90%)"))),
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.legendRow, style: { borderBottom: "none" } },
                react_1.default.createElement("div", { className: Charts_module_scss_1.default.legendLeft },
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.legendDot, style: { backgroundColor: "#f59e0b" } }),
                    react_1.default.createElement("span", null, "At Risk (70-89%)"))),
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.legendRow, style: { borderBottom: "none" } },
                react_1.default.createElement("div", { className: Charts_module_scss_1.default.legendLeft },
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.legendDot, style: { backgroundColor: "#ef4444" } }),
                    react_1.default.createElement("span", null, "Below SLA (< 70%)"))))));
};
exports.GaugeChart = GaugeChart;
exports.default = exports.GaugeChart;
//# sourceMappingURL=GaugeChart.js.map