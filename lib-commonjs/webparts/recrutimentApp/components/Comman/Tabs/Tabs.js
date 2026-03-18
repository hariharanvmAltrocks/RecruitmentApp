"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tabs = Tabs;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
require("./Tabs.scss");
function SkeletonTab() {
    return react_1.default.createElement("span", { className: "tabs__skeleton", "aria-hidden": "true" });
}
function Tabs(_a) {
    var tabs = _a.tabs, activeKey = _a.activeKey, onChange = _a.onChange, _b = _a.loading, loading = _b === void 0 ? false : _b, _c = _a.loadingCount, loadingCount = _c === void 0 ? 3 : _c, _d = _a.variant, variant = _d === void 0 ? "underline" : _d, _e = _a.className, className = _e === void 0 ? "" : _e;
    return (react_1.default.createElement("div", { className: "tabs tabs--".concat(variant, " ").concat(className).trim(), role: "tablist", "aria-busy": loading }, loading
        ? Array.from({ length: loadingCount }).map(function (_, i) { return (react_1.default.createElement(SkeletonTab, { key: i })); })
        : tabs.map(function (tab) { return (react_1.default.createElement("button", { key: tab.key, role: "tab", type: "button", "aria-selected": tab.key === activeKey, "aria-disabled": tab.disabled, disabled: tab.disabled, className: [
                "tabs__tab",
                tab.key === activeKey ? "tabs__tab--active" : "",
                tab.disabled ? "tabs__tab--disabled" : "",
            ]
                .filter(Boolean)
                .join(" "), onClick: function () { return !tab.disabled && onChange(tab); } },
            tab.label,
            tab.badge !== undefined && (react_1.default.createElement("span", { className: "tabs__badge" }, tab.badge)))); })));
}
exports.default = Tabs;
//# sourceMappingURL=Tabs.js.map