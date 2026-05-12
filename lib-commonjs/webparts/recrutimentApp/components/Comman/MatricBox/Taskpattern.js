"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var taskPattern_module_scss_1 = tslib_1.__importDefault(require("./taskPattern.module.scss"));
var TaskPattern = function (_a) {
    var metrics = _a.metrics, onStepClick = _a.onStepClick, activeId = _a.activeId;
    return (react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.roadmapWrapper },
        react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.roadmapHeader },
            react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.roadmapHeaderLeft },
                react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.roadmapHeaderInner },
                    react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.roadmapDot }),
                    react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.roadmapTitle }, "Lifecycle Roadmap"))),
            react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.roadmapSubtitle }, "Operational Sequence")),
        react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.chevronTrack }, metrics.map(function (metric, index) {
            var Icon = metric.icon;
            var isActive = metric.id === activeId;
            var isLast = index === metrics.length - 1;
            return (react_1.default.createElement("div", { key: metric.id, className: "".concat(taskPattern_module_scss_1.default.chevronItem).concat(isActive ? " ".concat(taskPattern_module_scss_1.default.active) : ""), style: {
                    zIndex: metrics.length - index,
                    "--step-from": metric.bgColor,
                    "--step-to": metric.color,
                }, onClick: function () { return onStepClick === null || onStepClick === void 0 ? void 0 : onStepClick(metric); }, role: "button", tabIndex: 0, onKeyDown: function (e) { return e.key === "Enter" && (onStepClick === null || onStepClick === void 0 ? void 0 : onStepClick(metric)); }, "aria-label": "Step ".concat(String(index + 1).padStart(2, "0"), ": ").concat(metric.label) },
                react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.chevronBody },
                    react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.iconBox },
                        react_1.default.createElement(Icon, { size: 16, strokeWidth: 1.8, color: "#fff" })),
                    react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.stepText },
                        react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.stepNum },
                            "STEP ",
                            String(index + 1).padStart(2, "0")),
                        react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.stepLabel }, metric.label)),
                    metric.status && (react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.statusBadge, style: {
                            background: metric.statusBg,
                            color: metric.statusColor,
                        } }, metric.status)),
                    metric.value > 0 && (react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.valueBubble }, metric.value)),
                    !isLast && react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.separator }))));
        }))));
};
exports.default = TaskPattern;
//# sourceMappingURL=Taskpattern.js.map