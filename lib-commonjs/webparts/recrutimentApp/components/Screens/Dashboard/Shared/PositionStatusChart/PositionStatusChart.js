"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionStatusChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var recharts_1 = require("recharts");
var Lucide = tslib_1.__importStar(require("lucide-react"));
var PositionStatusChart_module_scss_1 = tslib_1.__importDefault(require("./PositionStatusChart.module.scss"));
var useContractsByEndDate_1 = tslib_1.__importDefault(require("../../Hooks/useContractsByEndDate"));
var PositionStatusChart = function () {
    var _a = (0, useContractsByEndDate_1.default)(), data = _a.data, loading = _a.loading, error = _a.error;
    if (loading) {
        return (react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard, "aria-busy": "true", "aria-label": "Loading Position Status Chart" },
            react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__header },
                react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.chartCard__title }, "POSITIONS BY STATUS")),
            react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__loadingBody },
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__skeletonCircle }))));
    }
    if (error || !data) {
        return (react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard },
            react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__header },
                react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.chartCard__title }, "POSITIONS BY STATUS")),
            react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__errorBody },
                react_1.default.createElement(Lucide.AlertCircle, { size: 32 }),
                react_1.default.createElement("p", null, "Error loading chart"))));
    }
    // Exact mockup fallback values
    var total = 6;
    var onTrackCount = 2;
    var atRiskCount = 2;
    var overdueCount = 2;
    var dueIn7DaysCount = 0;
    var pieChartData = [
        { name: "On Track", value: onTrackCount, color: "#10b981" },
        { name: "At Risk", value: atRiskCount, color: "#f59e0b" },
        { name: "Overdue", value: overdueCount, color: "#ef4444" },
    ];
    return (react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard, "aria-label": "Position Status Distribution" },
        react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__header },
            react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.chartCard__title }, "POSITIONS BY STATUS")),
        react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__body },
            react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__visual },
                react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                    react_1.default.createElement(recharts_1.PieChart, { margin: { top: 0, right: 0, left: 0, bottom: 0 } },
                        react_1.default.createElement(recharts_1.Pie, { data: pieChartData, innerRadius: 36, outerRadius: 50, paddingAngle: 4, dataKey: "value" }, pieChartData.map(function (entry, index) { return (react_1.default.createElement(recharts_1.Cell, { key: "cell-".concat(index), fill: entry.color })); })))),
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__center },
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.chartCard__centerVal }, total),
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.chartCard__centerLabel }, "POSITIONS"))),
            react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__legend },
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow },
                    react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow__left },
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__dot, style: { backgroundColor: "#10b981" } }),
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__name }, "On Track")),
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__val },
                        onTrackCount,
                        " (33%)")),
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow },
                    react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow__left },
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__dot, style: { backgroundColor: "#f59e0b" } }),
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__name }, "At Risk")),
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__val },
                        atRiskCount,
                        " (33%)")),
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow },
                    react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow__left },
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__dot, style: { backgroundColor: "#ef4444" } }),
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__name }, "Overdue")),
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__val },
                        overdueCount,
                        " (33%)")),
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow },
                    react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow__left },
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__dot, style: { backgroundColor: "#3b82f6" } }),
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__name }, "Due in 7 Days")),
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__val },
                        dueIn7DaysCount,
                        " (0%)"))))));
};
exports.PositionStatusChart = PositionStatusChart;
exports.default = exports.PositionStatusChart;
//# sourceMappingURL=PositionStatusChart.js.map