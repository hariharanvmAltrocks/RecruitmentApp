"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Badge_module_scss_1 = tslib_1.__importDefault(require("./Badge.module.scss"));
var Badge = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? "neutral" : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    return (react_1.default.createElement("span", { className: "".concat(Badge_module_scss_1.default.badge, " ").concat(Badge_module_scss_1.default["badge--".concat(variant)], " ").concat(className) }, children));
};
exports.Badge = Badge;
exports.default = exports.Badge;
//# sourceMappingURL=Badge.js.map