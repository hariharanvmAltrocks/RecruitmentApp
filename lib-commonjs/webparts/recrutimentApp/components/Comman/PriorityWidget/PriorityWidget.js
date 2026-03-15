"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
require("./priority-widget.scss");
var PriorityWidget = function (_a) {
    var data = _a.data, total = _a.total;
    return (react_1.default.createElement("div", { className: "priority-widget" },
        react_1.default.createElement("div", { className: "header" },
            react_1.default.createElement("div", { className: "title-group" },
                react_1.default.createElement("span", { className: "dot" }),
                react_1.default.createElement("h3", null, "PRIORITY TASKS")),
            react_1.default.createElement("button", { className: "manage-btn" }, "Manage")),
        react_1.default.createElement("div", { className: "widget-body" },
            react_1.default.createElement("div", { className: "chart-section" },
                react_1.default.createElement("svg", { viewBox: "0 0 100 100", className: "circular-chart" },
                    react_1.default.createElement("circle", { className: "circle-bg", cx: "50", cy: "50", r: "40" }),
                    data.map(function (item, i) {
                        // Calculating offset for the donut segments
                        // 251.2 is the circumference for r=40 (2 * pi * 40)
                        var circumference = 251.2;
                        var dashArray = (item.percent / 100) * circumference;
                        // We calculate offset. Note: SVG circles start at 3 o'clock. 
                        // We adjust to match the visual start point.
                        var offset = 0;
                        if (i > 0) {
                            var prevPercent = data.slice(0, i).reduce(function (acc, curr) { return acc + curr.percent; }, 0);
                            offset = (prevPercent / 100) * circumference;
                        }
                        return (react_1.default.createElement("circle", { key: i, className: "circle-segment", cx: "50", cy: "50", r: "40", stroke: item.color, strokeDasharray: "".concat(dashArray, " ").concat(circumference), strokeDashoffset: -offset, transform: "rotate(-90 50 50)" // Start from top
                         }));
                    })),
                react_1.default.createElement("div", { className: "chart-center-text" },
                    react_1.default.createElement("span", { className: "total-number" }, total),
                    react_1.default.createElement("span", { className: "total-label" }, "PENDINGS"))),
            react_1.default.createElement("div", { className: "task-list" }, data.map(function (item, i) { return (react_1.default.createElement("div", { key: i, className: "task-item" },
                react_1.default.createElement("div", { className: "item-row" },
                    react_1.default.createElement("div", { className: "icon-box", style: { backgroundColor: "".concat(item.color, "15") } }, item.iconType === 'hr' ? (react_1.default.createElement(lucide_react_1.ClipboardList, { size: 16, color: item.color })) : (
                    // <CloudUpload size={16} color={item.color} />
                    react_1.default.createElement(react_1.default.Fragment, null))),
                    react_1.default.createElement("div", { className: "text-content" },
                        react_1.default.createElement("div", { className: "stats" },
                            react_1.default.createElement("span", { className: "count" },
                                item.value,
                                " Tasks"),
                            react_1.default.createElement("span", { className: "percent" },
                                item.percent,
                                "%")),
                        react_1.default.createElement("div", { className: "name" }, item.name))),
                react_1.default.createElement("div", { className: "progress-container" },
                    react_1.default.createElement("div", { className: "progress-bg" },
                        react_1.default.createElement("div", { className: "progress-fill", style: { width: "".concat(item.percent, "%"), backgroundColor: item.color } }))))); }))),
        react_1.default.createElement("button", { className: "process-all-btn" },
            react_1.default.createElement(lucide_react_1.Zap, { size: 18, fill: "white" }),
            "Process All Pendings")));
};
exports.default = PriorityWidget;
//# sourceMappingURL=PriorityWidget.js.map