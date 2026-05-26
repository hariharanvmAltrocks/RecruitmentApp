"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var departmentChart_module_scss_1 = tslib_1.__importDefault(require("./departmentChart.module.scss"));
var Usedepartmentchart_1 = tslib_1.__importDefault(require("../../Screens/Dashboard/Hooks/Usedepartmentchart"));
var ThemeContext_1 = require("../../../theme/ThemeContext");
var CustomTooltip = function (_a) {
    var active = _a.active, payload = _a.payload, _b = _a.tooltipValueLabel, tooltipValueLabel = _b === void 0 ? "Openings" : _b;
    if (!active || !(payload === null || payload === void 0 ? void 0 : payload.length))
        return null;
    var _c = payload[0].payload, name = _c.name, value = _c.value;
    return (react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.tooltip },
        react_1.default.createElement("p", { className: departmentChart_module_scss_1.default.tooltipLabel }, name),
        react_1.default.createElement("p", { className: departmentChart_module_scss_1.default.tooltipValue }, value),
        react_1.default.createElement("p", { className: departmentChart_module_scss_1.default.tooltipSub }, tooltipValueLabel)));
};
var DepartmentChart = function (_a) {
    var data = _a.data, _b = _a.itemsPerPage, itemsPerPage = _b === void 0 ? 7 : _b, _c = _a.title, title = _c === void 0 ? "Departmental Demand" : _c, _d = _a.subtitle, subtitle = _d === void 0 ? "Pending recruitment lifecycle status" : _d, _e = _a.tooltipValueLabel, tooltipValueLabel = _e === void 0 ? "Openings" : _e, _f = _a.refreshKey, refreshKey = _f === void 0 ? 0 : _f;
    var theme = (0, ThemeContext_1.useTheme)();
    var resolvedGradientStart = theme.primaryColor;
    var resolvedGradientEnd = theme.secondaryColor;
    var _g = (0, Usedepartmentchart_1.default)({ itemsPerPage: itemsPerPage, refreshKey: refreshKey }), visibleData = _g.visibleData, currentPage = _g.currentPage, totalPages = _g.totalPages, hasPrev = _g.hasPrev, hasNext = _g.hasNext, handleNext = _g.handleNext, handlePrev = _g.handlePrev;
    var gradientId = "deptBarGradient";
    return (react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.card },
        react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.header },
            react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.titleGroup },
                react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.titleRow },
                    react_1.default.createElement("span", { className: departmentChart_module_scss_1.default.dot, "aria-hidden": "true" }),
                    react_1.default.createElement("h2", { className: departmentChart_module_scss_1.default.title }, title)),
                react_1.default.createElement("p", { className: departmentChart_module_scss_1.default.subtitle }, subtitle)),
            visibleData && visibleData.length > 0 && (react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.pagination, role: "navigation", "aria-label": "Chart pages" },
                react_1.default.createElement("button", { className: "".concat(departmentChart_module_scss_1.default.pageBtn, " ").concat(hasPrev ? departmentChart_module_scss_1.default.active : departmentChart_module_scss_1.default.disabled), onClick: handlePrev, disabled: !hasPrev, "aria-label": "Previous page" },
                    react_1.default.createElement(lucide_react_1.ChevronLeft, { size: 20 })),
                react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.pageInfo, "aria-live": "polite" },
                    react_1.default.createElement("span", { className: departmentChart_module_scss_1.default.pageNumbers },
                        currentPage,
                        " / ",
                        totalPages),
                    react_1.default.createElement("span", { className: departmentChart_module_scss_1.default.pageLabel }, "Pages")),
                react_1.default.createElement("button", { className: "".concat(departmentChart_module_scss_1.default.pageBtn, " ").concat(hasNext ? departmentChart_module_scss_1.default.active : departmentChart_module_scss_1.default.disabled), onClick: handleNext, disabled: !hasNext, "aria-label": "Next page" },
                    react_1.default.createElement(lucide_react_1.ChevronRight, { size: 20 }))))),
        react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.chartArea }, !visibleData || visibleData.length === 0 ? (react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.emptyState },
            react_1.default.createElement("div", { className: departmentChart_module_scss_1.default.emptyIconContainer },
                react_1.default.createElement(lucide_react_1.Building2, { size: 40, className: departmentChart_module_scss_1.default.emptyIcon })),
            react_1.default.createElement("p", { className: departmentChart_module_scss_1.default.emptyTitle }, "No Department in request for position"),
            react_1.default.createElement("p", { className: departmentChart_module_scss_1.default.emptySubtitle }, "There are currently no active position requests for any department."))) : (react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
            react_1.default.createElement(recharts_1.BarChart, { data: visibleData, margin: { top: 10, right: 20, left: 0, bottom: 20 } },
                react_1.default.createElement("defs", null,
                    react_1.default.createElement("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1" },
                        react_1.default.createElement("stop", { offset: "0%", stopColor: resolvedGradientStart, stopOpacity: 1 }),
                        react_1.default.createElement("stop", { offset: "100%", stopColor: resolvedGradientEnd, stopOpacity: 0.9 }))),
                react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "var(--app-sidenav-border, #f1f5f9)" }),
                react_1.default.createElement(recharts_1.XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fill: "var(--app-text-color, #64748b)", fontSize: 10, fontWeight: 900 }, interval: 0, height: 50, padding: { left: 20, right: 20 } }),
                react_1.default.createElement(recharts_1.YAxis, { axisLine: false, tickLine: false, tick: { fill: "var(--app-text-color, #94a3b8)", fontSize: 10, fontWeight: 900 } }),
                react_1.default.createElement(recharts_1.Tooltip, { cursor: { fill: "var(--app-secondary-color, #f8fafc)", radius: [12, 12, 0, 0] }, content: react_1.default.createElement(CustomTooltip, { tooltipValueLabel: tooltipValueLabel }) }),
                react_1.default.createElement(recharts_1.Bar, { dataKey: "value", fill: "url(#".concat(gradientId, ")"), radius: [12, 12, 4, 4], maxBarSize: 45, animationDuration: 800, animationEasing: "ease-out" }, visibleData.map(function (_, index) { return (react_1.default.createElement(recharts_1.Cell, { key: "cell-".concat(index), fillOpacity: 1 - index * 0.05 })); }))))))));
};
exports.default = DepartmentChart;
//# sourceMappingURL=Departmentchart.js.map