"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSwitcher = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var ThemeContext_1 = require("../../theme/ThemeContext");
var ThemeConfig_1 = require("../../theme/ThemeConfig");
var ThemeSwitcher_module_scss_1 = tslib_1.__importDefault(require("./ThemeSwitcher.module.scss"));
var ThemeSwitcher = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, ThemeContext_1.useTheme)(), setTheme = _b.setTheme, currentTheme = tslib_1.__rest(_b, ["setTheme"]);
    // If switcher is not open, render nothing
    if (!isOpen)
        return null;
    // Helper to safely cast currentTheme as AppTheme
    var getThemeConfig = function () {
        return {
            primaryColor: currentTheme.primaryColor,
            secondaryColor: currentTheme.secondaryColor,
            buttonColor: currentTheme.buttonColor,
            sideNavColor: currentTheme.sideNavColor,
            headerColor: currentTheme.headerColor,
            textColor: currentTheme.textColor,
            cardColor: currentTheme.cardColor,
            fontFamily: currentTheme.fontFamily,
            name: currentTheme.name,
            isCustom: currentTheme.isCustom
        };
    };
    var themeConfig = getThemeConfig();
    // Check if current theme matches a predefined theme
    var getActiveThemeKey = function () {
        for (var _i = 0, _a = Object.entries(ThemeConfig_1.predefinedThemes); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value.primaryColor.toLowerCase() === themeConfig.primaryColor.toLowerCase() &&
                value.secondaryColor.toLowerCase() === themeConfig.secondaryColor.toLowerCase() &&
                value.buttonColor.toLowerCase() === themeConfig.buttonColor.toLowerCase() &&
                value.sideNavColor.toLowerCase() === themeConfig.sideNavColor.toLowerCase() &&
                value.headerColor.toLowerCase() === themeConfig.headerColor.toLowerCase() &&
                value.textColor.toLowerCase() === themeConfig.textColor.toLowerCase() &&
                value.cardColor.toLowerCase() === themeConfig.cardColor.toLowerCase()) {
                return key;
            }
        }
        return "custom";
    };
    var activeKey = getActiveThemeKey();
    var handlePredefinedSelect = function (key) {
        setTheme(ThemeConfig_1.predefinedThemes[key]);
    };
    var handleCustomColorChange = function (key, color) {
        var _a;
        var updatedTheme = tslib_1.__assign(tslib_1.__assign({}, themeConfig), (_a = {}, _a[key] = color, _a.isCustom = true, _a.name = "Custom Theme", _a));
        setTheme(updatedTheme);
    };
    var handleReset = function () {
        setTheme(ThemeConfig_1.predefinedThemes.classic);
    };
    return (React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.overlay, onClick: onClose },
        React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.modal, onClick: function (e) { return e.stopPropagation(); } },
            React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.header },
                React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.titleArea },
                    React.createElement(lucide_react_1.Palette, { className: ThemeSwitcher_module_scss_1.default.titleIcon, size: 22 }),
                    React.createElement("h2", null, "Theme Customizer")),
                React.createElement("button", { className: ThemeSwitcher_module_scss_1.default.closeBtn, onClick: onClose, "aria-label": "Close customizer" },
                    React.createElement(lucide_react_1.X, { size: 20 }))),
            React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.content },
                React.createElement("section", { className: ThemeSwitcher_module_scss_1.default.section },
                    React.createElement("h3", null, "Predefined Themes"),
                    React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.themesGrid }, Object.entries(ThemeConfig_1.predefinedThemes).map(function (_a) {
                        var key = _a[0], theme = _a[1];
                        var isActive = activeKey === key;
                        return (React.createElement("div", { key: key, className: "".concat(ThemeSwitcher_module_scss_1.default.themeCard, " ").concat(isActive ? ThemeSwitcher_module_scss_1.default.active : ""), onClick: function () { return handlePredefinedSelect(key); } },
                            React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.previewContainer },
                                React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.miniSidebar, style: { background: theme.sideNavColor } }),
                                React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.miniMain },
                                    React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.miniHeader, style: { background: theme.headerColor } }),
                                    React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.miniBody, style: { background: theme.secondaryColor } },
                                        React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.miniCard, style: { background: theme.cardColor } }),
                                        React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.miniButton, style: { background: theme.buttonColor } })))),
                            React.createElement("span", { className: ThemeSwitcher_module_scss_1.default.themeName }, theme.name)));
                    })))),
            React.createElement("div", { className: ThemeSwitcher_module_scss_1.default.footer },
                React.createElement("button", { className: ThemeSwitcher_module_scss_1.default.applyBtn, onClick: onClose }, "Done")))));
};
exports.ThemeSwitcher = ThemeSwitcher;
exports.default = exports.ThemeSwitcher;
//# sourceMappingURL=ThemeSwitcher.js.map