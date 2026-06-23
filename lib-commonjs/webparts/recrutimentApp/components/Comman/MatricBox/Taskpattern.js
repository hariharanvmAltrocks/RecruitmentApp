"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var taskPattern_module_scss_1 = tslib_1.__importDefault(require("./taskPattern.module.scss"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var framer_motion_1 = require("framer-motion");
var TaskPattern = function (_a) {
    var metrics = _a.metrics, onStepClick = _a.onStepClick, activeId = _a.activeId;
    return (react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.roadmapWrapper },
        react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.roadmapHeader },
            react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.roadmapHeaderLeft },
                react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.roadmapHeaderInner },
                    react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.roadmapDot }),
                    react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.roadmapTitle }, strings.LifecycleRoadmap)))),
        react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.chevronTrack, style: {
                "--metrics-count": metrics.length,
            } }, metrics.map(function (metric, index) {
            var _a, _b;
            var slug = (_b = (_a = metric.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : metric.label.toLowerCase().replace(/\s+/g, "_");
            var Icon = metric.icon;
            var color = metric.color;
            return (react_1.default.createElement(framer_motion_1.motion.div, { className: taskPattern_module_scss_1.default.oversightStat, initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.06, duration: 0.2 }, onClick: function () { return onStepClick(metric); } },
                react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.oversightStatTop },
                    react_1.default.createElement("div", { className: taskPattern_module_scss_1.default.oversightStatIconWrap },
                        react_1.default.createElement(Icon, { size: 16, style: { color: color }, strokeWidth: 2.5 })),
                    react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.oversightStatNum }, metric.value.toString().padStart(2, "0"))),
                react_1.default.createElement("span", { className: taskPattern_module_scss_1.default.oversightStatLabel }, metric.label.toUpperCase())));
        }))));
};
exports.default = TaskPattern;
//# sourceMappingURL=Taskpattern.js.map