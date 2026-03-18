"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
require("./Button.scss");
var Button = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? "default" : _b, _c = _a.size, size = _c === void 0 ? "md" : _c, icon = _a.icon, _d = _a.iconPosition, iconPosition = _d === void 0 ? "left" : _d, _e = _a.loading, loading = _e === void 0 ? false : _e, disabled = _a.disabled, children = _a.children, _f = _a.className, className = _f === void 0 ? "" : _f, rest = tslib_1.__rest(_a, ["variant", "size", "icon", "iconPosition", "loading", "disabled", "children", "className"]);
    var classes = [
        "btn",
        "btn--".concat(variant),
        "btn--".concat(size),
        disabled || loading ? "btn--disabled" : "",
        loading ? "btn--loading" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (react_1.default.createElement("button", tslib_1.__assign({ type: "button", className: classes, disabled: disabled || loading }, rest),
        icon && iconPosition === "left" && (react_1.default.createElement("span", { className: "btn__icon" }, icon)),
        children && react_1.default.createElement("span", { className: "btn__label" }, children),
        icon && iconPosition === "right" && (react_1.default.createElement("span", { className: "btn__icon" }, icon))));
};
exports.Button = Button;
exports.default = exports.Button;
//# sourceMappingURL=Button.js.map