"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var ProgressBar_module_scss_1 = tslib_1.__importDefault(require("./ProgressBar.module.scss"));
var ProgressBar = function (_a) {
    var value = _a.value, color = _a.color, _b = _a.className, className = _b === void 0 ? "" : _b;
    var clampedValue = Math.min(Math.max(value, 0), 100);
    return (react_1.default.createElement("div", { className: "".concat(ProgressBar_module_scss_1.default.container, " ").concat(className) },
        react_1.default.createElement("div", { className: ProgressBar_module_scss_1.default.fill, style: {
                width: "".concat(clampedValue, "%"),
                backgroundColor: color,
            } })));
};
exports.ProgressBar = ProgressBar;
exports.default = exports.ProgressBar;
//# sourceMappingURL=ProgressBar.js.map