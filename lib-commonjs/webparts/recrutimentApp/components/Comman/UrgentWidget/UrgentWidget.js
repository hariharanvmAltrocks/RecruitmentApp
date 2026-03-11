"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
require("./urgent-widget.scss");
var lucide_react_1 = require("lucide-react");
var UrgentWidget = function (_a) {
    var tasks = _a.tasks;
    return (react_1.default.createElement("div", { className: "urgent-widget" },
        react_1.default.createElement("div", { className: "urgent-widget__header" },
            react_1.default.createElement("div", { className: "urgent-widget__title" },
                react_1.default.createElement(lucide_react_1.AlertCircle, { size: 16, className: "urgent-widget__icon" }),
                react_1.default.createElement("span", null, "Urgent")),
            react_1.default.createElement("span", { className: "urgent-widget__count" },
                tasks.length,
                " TASK",
                tasks.length > 1 ? "S" : "")),
        react_1.default.createElement("div", { className: "urgent-widget__list" }, tasks.map(function (task, index) { return (react_1.default.createElement("div", { key: index, className: "urgent-widget__task" },
            react_1.default.createElement("div", { className: "urgent-widget__task-header" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "urgent-widget__task-title" }, task.title),
                    react_1.default.createElement("div", { className: "urgent-widget__task-subtitle" }, task.subtitle)),
                react_1.default.createElement("span", { className: "urgent-widget__badge ".concat(task.type === "error"
                        ? "urgent-widget__badge--error"
                        : "urgent-widget__badge--warning") }, task.overdue)))); }))));
};
exports.default = UrgentWidget;
//# sourceMappingURL=UrgentWidget.js.map