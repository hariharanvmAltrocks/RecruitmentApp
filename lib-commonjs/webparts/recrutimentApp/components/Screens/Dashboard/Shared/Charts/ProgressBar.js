"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Charts_module_scss_1 = tslib_1.__importDefault(require("./Charts.module.scss"));
var ProgressBar = function (_a) {
    var value = _a.value, label = _a.label, color = _a.color, _b = _a.showLabel, showLabel = _b === void 0 ? true : _b;
    var boundedValue = Math.min(Math.max(value, 0), 100);
    // Default color logic if not specified
    var barColor = color;
    if (!barColor) {
        if (boundedValue >= 75)
            barColor = "#10b981"; // success green
        else if (boundedValue >= 40)
            barColor = "#3b82f6"; // primary blue
        else if (boundedValue >= 15)
            barColor = "#f59e0b"; // warning yellow
        else
            barColor = "#ef4444"; // danger red
    }
    return (react_1.default.createElement("div", { className: Charts_module_scss_1.default.progressBarWrapper },
        showLabel && (label || showLabel) && (react_1.default.createElement("div", { className: Charts_module_scss_1.default.progressLabel },
            react_1.default.createElement("span", null, label),
            react_1.default.createElement("span", null,
                boundedValue,
                "%"))),
        react_1.default.createElement("div", { className: Charts_module_scss_1.default.progressBarBg },
            react_1.default.createElement("div", { className: Charts_module_scss_1.default.progressBarFill, style: {
                    width: "".concat(boundedValue, "%"),
                    backgroundColor: barColor
                } }))));
};
exports.ProgressBar = ProgressBar;
exports.default = exports.ProgressBar;
//# sourceMappingURL=ProgressBar.js.map