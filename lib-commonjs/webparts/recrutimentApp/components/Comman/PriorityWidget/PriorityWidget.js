"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var recharts_1 = require("recharts");
require("./priority-widget.scss");
var PriorityWidget = function (_a) {
    var data = _a.data, total = _a.total;
    var _b = (0, react_1.useState)(false), isExpanded = _b[0], setIsExpanded = _b[1];
    // const filteredData = data.filter(item => item.value > 0);
    var displayData = isExpanded ? data : data.slice(0, 3);
    var safeTotal = total || data.reduce(function (acc, curr) { return acc + curr.value; }, 0);
    var hasMore = data.length > 3;
    return (react_1.default.createElement("div", { className: "priority-widget-dark" },
        react_1.default.createElement("div", { className: "priority-widget-dark__header" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("h3", { className: "title" }, "Analytics"),
                react_1.default.createElement("p", { className: "subtitle" }, "SUMMARY")),
            react_1.default.createElement("div", { className: "icon-wrapper" },
                react_1.default.createElement(lucide_react_1.Activity, { size: 20, className: "activity-icon" }))),
        react_1.default.createElement("div", { className: "priority-widget-dark__body" },
            react_1.default.createElement("div", { className: "chart-container" },
                react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                    react_1.default.createElement(recharts_1.PieChart, null,
                        react_1.default.createElement(recharts_1.Pie, { data: data, cx: "50%", cy: "50%", innerRadius: 30, outerRadius: 45, paddingAngle: 4, dataKey: "value", stroke: "none", cornerRadius: 2 }, data.map(function (entry, index) { return (react_1.default.createElement(recharts_1.Cell, { key: index, fill: entry.color })); })),
                        react_1.default.createElement(recharts_1.Tooltip, { contentStyle: {
                                backgroundColor: "var(--app-card-color, #131622)",
                                borderColor: "var(--app-sidenav-border, #202538)",
                                borderRadius: "8px",
                                color: "var(--app-text-color, #fff)",
                            }, itemStyle: {
                                color: "var(--app-text-color, #fff)",
                                fontSize: "12px",
                                fontWeight: "bold",
                            } }))),
                react_1.default.createElement("div", { className: "chart-center" },
                    react_1.default.createElement("span", { className: "total" }, safeTotal))),
            react_1.default.createElement("div", { className: "list-container" },
                displayData.map(function (item, idx) {
                    var percentage = item.percent ||
                        (safeTotal > 0 ? Math.round((item.value / safeTotal) * 100) : 0);
                    return (react_1.default.createElement("div", { key: idx, className: "list-item" },
                        react_1.default.createElement("div", { className: "item-header" },
                            react_1.default.createElement("span", { className: "item-name" }, item.name),
                            react_1.default.createElement("span", { className: "item-percent" },
                                percentage,
                                "%")),
                        react_1.default.createElement("div", { className: "progress-track" },
                            react_1.default.createElement("div", { className: "progress-fill", style: {
                                    width: "".concat(percentage, "%"),
                                    backgroundColor: item.color,
                                } }))));
                }),
                hasMore && (react_1.default.createElement("button", { className: "view-more-btn", onClick: function () { return setIsExpanded(!isExpanded); } },
                    isExpanded ? "VIEW LESS" : "VIEW MORE",
                    isExpanded ? (react_1.default.createElement(lucide_react_1.ChevronUp, { size: 12, strokeWidth: 3 })) : (react_1.default.createElement(lucide_react_1.ChevronDown, { size: 12, strokeWidth: 3 }))))))));
};
exports.default = PriorityWidget;
//# sourceMappingURL=PriorityWidget.js.map