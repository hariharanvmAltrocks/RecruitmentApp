"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionStatusChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var recharts_1 = require("recharts");
var PositionStatusChart_module_scss_1 = tslib_1.__importDefault(require("./PositionStatusChart.module.scss"));
var PositionStatusChart = function (_a) {
    var _b, _c, _d, _e, _f;
    var data = _a.data, loading = _a.loading;
    var onTrackCount = (_b = data === null || data === void 0 ? void 0 : data.OnTrack) !== null && _b !== void 0 ? _b : 0;
    var atRiskCount = (_c = data === null || data === void 0 ? void 0 : data.atRisk) !== null && _c !== void 0 ? _c : 0;
    var overdueCount = (_d = data === null || data === void 0 ? void 0 : data.overduecount) !== null && _d !== void 0 ? _d : 0;
    var dueIn7DaysCount = (_e = data === null || data === void 0 ? void 0 : data.dueLast7days) !== null && _e !== void 0 ? _e : 0;
    var total = (_f = data === null || data === void 0 ? void 0 : data.total) !== null && _f !== void 0 ? _f : 0;
    var getPercentageStr = function (count) {
        if (total === 0)
            return "0%";
        return "".concat(Math.round((count / total) * 100), "%");
    };
    var pieChartData = [
        { name: "On Track", value: onTrackCount, color: "#10b981" },
        { name: "At Risk", value: atRiskCount, color: "#f59e0b" },
        { name: "Overdue", value: overdueCount, color: "#ef4444" },
    ];
    if (loading) {
        return (react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard, "aria-label": "Position Status Distribution Loading" },
            react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__header },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "130px", height: "14px" } })),
            react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__body },
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__visual, style: { display: "flex", alignItems: "center", justifyContent: "center" } },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "90px", height: "90px", borderRadius: "50%" } })),
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.chartCard__legend, style: { display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" } }, Array.from({ length: 4 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: idx, className: PositionStatusChart_module_scss_1.default.legendRow },
                    react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow__left },
                        react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "10px", height: "10px", borderRadius: "50%", marginRight: "8px" } }),
                        react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "70px", height: "10px" } })),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "40px", height: "10px" } }))); })))));
    }
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
                        " (",
                        getPercentageStr(onTrackCount),
                        ")")),
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow },
                    react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow__left },
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__dot, style: { backgroundColor: "#f59e0b" } }),
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__name }, "At Risk")),
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__val },
                        atRiskCount,
                        " (",
                        getPercentageStr(atRiskCount),
                        ")")),
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow },
                    react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow__left },
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__dot, style: { backgroundColor: "#ef4444" } }),
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__name }, "Overdue")),
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__val },
                        overdueCount,
                        " (",
                        getPercentageStr(overdueCount),
                        ")")),
                react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow },
                    react_1.default.createElement("div", { className: PositionStatusChart_module_scss_1.default.legendRow__left },
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__dot, style: { backgroundColor: "#3b82f6" } }),
                        react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__name }, "Due in 7 Days")),
                    react_1.default.createElement("span", { className: PositionStatusChart_module_scss_1.default.legendRow__val },
                        dueIn7DaysCount,
                        " (",
                        getPercentageStr(dueIn7DaysCount),
                        ")"))))));
};
exports.PositionStatusChart = PositionStatusChart;
exports.default = exports.PositionStatusChart;
//# sourceMappingURL=PositionStatusChart.js.map