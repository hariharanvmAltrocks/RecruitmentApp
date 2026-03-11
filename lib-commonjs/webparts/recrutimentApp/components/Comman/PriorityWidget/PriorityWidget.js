"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
require("./priority-widget.scss");
var PriorityWidget = function (_a) {
    var data = _a.data, total = _a.total;
    return (react_1.default.createElement("div", { className: "priority-widget" },
        react_1.default.createElement("div", { className: "header" },
            react_1.default.createElement("h3", null, "Priority Tasks"),
            react_1.default.createElement("button", { className: "manage-btn" }, "Manage")),
        react_1.default.createElement("div", { className: "priority-circle-wrapper" },
            react_1.default.createElement("div", { className: "circular-chart-container" },
                react_1.default.createElement("svg", { viewBox: "0 0 36 36", className: "circular-chart" },
                    react_1.default.createElement("path", { className: "circle-bg", d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" }),
                    data.map(function (item, i) {
                        var offset = i === 0 ? 0 : data.slice(0, i).reduce(function (acc, curr) { return acc + curr.percent; }, 0);
                        return (react_1.default.createElement("path", { key: i, className: "circle", strokeDasharray: "".concat(item.percent, ", 100"), strokeDashoffset: -(offset), style: { stroke: item.color }, d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" }));
                    })),
                react_1.default.createElement("div", { className: "total-count" },
                    react_1.default.createElement("span", { className: "count" }, total.toString().padStart(2, "0")),
                    react_1.default.createElement("span", { className: "label" }, "PENDINGS"))),
            react_1.default.createElement("div", { className: "list" }, data.map(function (item, i) { return (react_1.default.createElement("div", { key: i, className: "item" },
                react_1.default.createElement("div", { className: "top" },
                    react_1.default.createElement("span", { className: "item-name" },
                        react_1.default.createElement("span", { className: "icon-bolt", style: { color: item.color } }, "\u26A1"),
                        " ",
                        item.value,
                        " Tasks"),
                    react_1.default.createElement("span", { className: "item-percent" },
                        item.percent,
                        "%")),
                react_1.default.createElement("div", { className: "label" }, item.name.toUpperCase()),
                react_1.default.createElement("div", { className: "bar" },
                    react_1.default.createElement("div", { className: "fill", style: { width: "".concat(item.percent, "%"), background: item.color } })))); }))),
        react_1.default.createElement("button", { className: "process-btn" }, "Process All Pendings")));
};
exports.default = PriorityWidget;
//# sourceMappingURL=PriorityWidget.js.map