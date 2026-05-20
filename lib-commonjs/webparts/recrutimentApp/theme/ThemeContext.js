"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeVars = exports.useTheme = exports.ThemeProvider = void 0;
exports.normalizeHex = normalizeHex;
exports.isDarkColor = isDarkColor;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ThemeConfig_1 = require("./ThemeConfig");
// Function to normalize hex color (handles 3-digit hex shorthand)
function normalizeHex(hex) {
    var cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split("").map(function (c) { return c + c; }).join("");
    }
    return "#" + cleanHex;
}
// Helper to determine if a hex color is dark
function isDarkColor(hexColor) {
    if (!hexColor)
        return false;
    var hex = hexColor.replace("#", "");
    if (hex.length === 3) {
        hex = hex.split("").map(function (c) { return c + c; }).join("");
    }
    if (hex.length < 6)
        return false;
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 140;
}
var ThemeContext = React.createContext(tslib_1.__assign(tslib_1.__assign({}, ThemeConfig_1.defaultTheme), { setTheme: function () { } }));
var ThemeProvider = function (_a) {
    var theme = _a.theme, children = _a.children;
    var _b = React.useState(function () {
        try {
            var saved = localStorage.getItem("kamoa-app-theme");
            if (saved) {
                return JSON.parse(saved);
            }
        }
        catch (e) {
            console.error("Failed to load theme from localStorage", e);
        }
        return tslib_1.__assign(tslib_1.__assign({}, ThemeConfig_1.defaultTheme), theme);
    }), currentTheme = _b[0], setCurrentTheme = _b[1];
    var setTheme = React.useCallback(function (newTheme) {
        setCurrentTheme(newTheme);
        try {
            localStorage.setItem("kamoa-app-theme", JSON.stringify(newTheme));
        }
        catch (e) {
            console.error("Failed to save theme to localStorage", e);
        }
    }, []);
    React.useEffect(function () {
        var root = document.documentElement;
        var isDark = isDarkColor(currentTheme.sideNavColor);
        // Apply main theme variables to :root
        root.style.setProperty("--app-primary-color", currentTheme.primaryColor);
        root.style.setProperty("--app-secondary-color", currentTheme.secondaryColor);
        root.style.setProperty("--app-button-color", currentTheme.buttonColor);
        root.style.setProperty("--app-sidenav-color", currentTheme.sideNavColor);
        root.style.setProperty("--app-header-color", currentTheme.headerColor);
        root.style.setProperty("--app-text-color", currentTheme.textColor);
        root.style.setProperty("--app-card-color", currentTheme.cardColor);
        root.style.setProperty("--app-font-family", currentTheme.fontFamily);
        // Apply derived sidebar variables
        if (isDark) {
            root.style.setProperty("--app-sidenav-bg-hover", "rgba(255, 255, 255, 0.08)");
            root.style.setProperty("--app-sidenav-text", "rgba(255, 255, 255, 0.65)");
            root.style.setProperty("--app-sidenav-text-active", "#ffffff");
            root.style.setProperty("--app-sidenav-icon-muted", "rgba(255, 255, 255, 0.4)");
            root.style.setProperty("--app-sidenav-section-label", "rgba(255, 255, 255, 0.8)");
            root.style.setProperty("--app-sidenav-border", "rgba(255, 255, 255, 0.1)");
            root.style.setProperty("--app-sidenav-footer-bg", "rgba(0, 0, 0, 0.2)");
            root.style.setProperty("--app-sidenav-tooltip-bg", "rgba(15, 14, 46, 0.95)");
            root.style.setProperty("--app-sidenav-chevron", "rgba(255, 255, 255, 0.5)");
        }
        else {
            root.style.setProperty("--app-sidenav-bg-hover", "rgba(0, 0, 0, 0.05)");
            root.style.setProperty("--app-sidenav-text", "#475569");
            root.style.setProperty("--app-sidenav-text-active", "#0f172a");
            root.style.setProperty("--app-sidenav-icon-muted", "#94a3b8");
            root.style.setProperty("--app-sidenav-section-label", "#334155");
            root.style.setProperty("--app-sidenav-border", "rgba(0, 0, 0, 0.06)");
            root.style.setProperty("--app-sidenav-footer-bg", "rgba(0, 0, 0, 0.03)");
            root.style.setProperty("--app-sidenav-tooltip-bg", "#1e293b");
            root.style.setProperty("--app-sidenav-chevron", "#64748b");
        }
    }, [currentTheme]);
    var contextValue = React.useMemo(function () {
        return tslib_1.__assign(tslib_1.__assign({}, currentTheme), { setTheme: setTheme });
    }, [currentTheme, setTheme]);
    return (React.createElement(ThemeContext.Provider, { value: contextValue }, children));
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
            "--app-text-color": theme.textColor,
            "--app-card-color": theme.cardColor,
            "--app-font-family": theme.fontFamily
        };
    }, [theme]);
};
exports.useThemeVars = useThemeVars;
//# sourceMappingURL=ThemeContext.js.map