"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeVars = exports.useTheme = exports.ThemeProvider = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ThemeConfig_1 = require("./ThemeConfig");
var ThemeContext = React.createContext(ThemeConfig_1.defaultTheme);
var ThemeProvider = function (_a) {
    var theme = _a.theme, children = _a.children;
    var mergedTheme = React.useMemo(function () {
        return tslib_1.__assign(tslib_1.__assign({}, ThemeConfig_1.defaultTheme), theme);
    }, [theme]);
    return (React.createElement(ThemeContext.Provider, { value: mergedTheme }, children));
};
exports.ThemeProvider = ThemeProvider;
var useTheme = function () {
    return React.useContext(ThemeContext);
};
exports.useTheme = useTheme;
var useThemeVars = function () {
    var theme = (0, exports.useTheme)();
    return React.useMemo(function () {
        return {
            "--app-primary-color": theme.primaryColor,
            "--app-secondary-color": theme.secondaryColor,
            "--app-button-color": theme.buttonColor,
            "--app-sidenav-color": theme.sideNavColor,
            "--app-header-color": theme.headerColor,
            "--app-font-family": theme.fontFamily
        };
    }, [theme]);
};
exports.useThemeVars = useThemeVars;
//# sourceMappingURL=ThemeContext.js.map