"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonutChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var recharts_1 = require("recharts");
var Charts_module_scss_1 = tslib_1.__importDefault(require("./Charts.module.scss"));
var DonutChart = function (_a) {
    var _b;
    var data = _a.data;
    var total = data.total || 0;
    var expiring7Val = data.expiring7 !== undefined ? data.expiring7 : Math.min(data.dueSoon, Math.round(data.dueSoon * 0.3));
    var expiring30Val = data.expiring30 !== undefined ? data.expiring30 : data.dueSoon;
    var pct = function (val) { return total > 0 ? Math.round((val / total) * 100) : 0; };
    var expiring7Pct = data.percentages.expiring7 !== undefined ? data.percentages.expiring7 : pct(expiring7Val);
    var expiring30Pct = data.percentages.expiring30 !== undefined ? data.percentages.expiring30 : pct(expiring30Val);
    var pieChartData = [
        { name: "On Track", value: data.onTrack, color: "#10b981" },
        { name: "At Risk", value: data.dueSoon, color: "#f59e0b" },
        { name: "Overdue", value: data.overdue, color: "#ef4444" },
    ].filter(function (item) { return item.value > 0; });
    if (pieChartData.length === 0) {
        pieChartData.push({ name: "Empty", value: 1, color: "#e2e8f0" });
    }
    return (react_1.default.createElement("div", { className: Charts_module_scss_1.default.splitDonutBody },
        react_1.default.createElement("div", { className: Charts_module_scss_1.default.donutHalf },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                react_1.default.createElement(recharts_1.PieChart, { margin: { top: 0, right: 0, left: 0, bottom: 0 } },
                    react_1.default.createElement(recharts_1.Pie, { data: pieChartData, innerRadius: 45, outerRadius: 62, paddingAngle: ((_b = pieChartData[0]) === null || _b === void 0 ? void 0 : _b.name) === "Empty" ? 0 : 3, dataKey: "value" }, pieChartData.map(function (entry, index) { return (react_1.default.createElement(recharts_1.Cell, { key: "cell-".concat(index), fill: entry.color })); })))),
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.donutCenter },
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.donutVal }, total),
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.donutLabel }, "Positions"))),
        react_1.default.createElement("div", { className: Charts_module_scss_1.default.splitDetailsHalf },
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailRow },
                react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailLeft },
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailDot, style: { backgroundColor: "#10b981" } }),
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailName }, "On Track")),
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailVal },
                    data.onTrack,
                    " (",
                    data.percentages.onTrack,
                    "%)")),
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailRow },
                react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailLeft },
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailDot, style: { backgroundColor: "#f59e0b" } }),
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailName }, "At Risk")),
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailVal },
                    data.dueSoon,
                    " (",
                    data.percentages.dueSoon,
                    "%)")),
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailRow },
                react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailLeft },
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailDot, style: { backgroundColor: "#ef4444" } }),
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailName }, "Overdue")),
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailVal },
                    data.overdue,
                    " (",
                    data.percentages.overdue,
                    "%)")),
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailRow },
                react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailLeft },
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailDot, style: { backgroundColor: "#ea580c" } }),
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailName }, "Expiring in 7 Days")),
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailVal, style: { color: "#ea580c", fontWeight: 700 } },
                    expiring7Val,
                    " (",
                    expiring7Pct,
                    "%)")),
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailRow },
                react_1.default.createElement("div", { className: Charts_module_scss_1.default.detailLeft },
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailDot, style: { backgroundColor: "#3b82f6" } }),
                    react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailName }, "Expiring in 30 Days")),
                react_1.default.createElement("span", { className: Charts_module_scss_1.default.detailVal },
                    expiring30Val,
                    " (",
                    expiring30Pct,
                    "%)")))));
};
exports.DonutChart = DonutChart;
exports.default = exports.DonutChart;
//# sourceMappingURL=DonutChart.js.map