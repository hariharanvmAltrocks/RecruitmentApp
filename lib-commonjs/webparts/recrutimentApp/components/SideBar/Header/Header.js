"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
require("./Header.scss");
var menuUtils_1 = require("../menuUtils");
var ThemeContext_1 = require("../../../theme/ThemeContext");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var Header = function (_a) {
    var _b;
    var user = _a.user, menuData = _a.menuData, onToggleSidebar = _a.onToggleSidebar, onLogout = _a.onLogout;
    var pathname = (0, react_router_dom_1.useLocation)().pathname;
    var theme = (0, ThemeContext_1.useTheme)();
    var breadcrumbs = (0, react_1.useMemo)(function () { return (0, menuUtils_1.findBreadcrumbPath)(menuData, pathname); }, [menuData, pathname]);
    return (react_1.default.createElement("header", { className: "header", style: { background: theme.headerColor } },
        react_1.default.createElement("div", { className: "header-container" },
            react_1.default.createElement("div", { className: "header-left" },
                react_1.default.createElement("button", { onClick: onToggleSidebar, className: "menu-btn" },
                    react_1.default.createElement(lucide_react_1.Menu, { size: 22 })),
                react_1.default.createElement("div", { className: "breadcrumb-section" },
                    react_1.default.createElement("h1", { className: "page-title" }, strings.AppTitle),
                    react_1.default.createElement("nav", { className: "breadcrumbs" },
                        react_1.default.createElement(react_router_dom_1.Link, { to: "/" }, strings.HomeLabel),
                        breadcrumbs.map(function (crumb, idx) { return (react_1.default.createElement(react_1.default.Fragment, { key: crumb.Id },
                            react_1.default.createElement(lucide_react_1.ChevronRight, { size: 10, strokeWidth: 3, className: "crumb-icon" }),
                            react_1.default.createElement(react_router_dom_1.Link, { to: crumb.Path, className: idx === breadcrumbs.length - 1 ? "active" : "" }, crumb.DisplayName))); })))),
            react_1.default.createElement("div", { className: "header-right" },
                react_1.default.createElement("button", { className: "notification-btn" },
                    react_1.default.createElement(lucide_react_1.Bell, { size: 20 }),
                    react_1.default.createElement("span", { className: "notification-dot" })),
                react_1.default.createElement("div", { className: "divider" }),
                react_1.default.createElement("div", { className: "user-profile" },
                    react_1.default.createElement("div", { className: "user-info" },
                        react_1.default.createElement("p", { className: "user-name" }, user || "Jackson"),
                        react_1.default.createElement("p", { className: "user-role" }, (user === null || user === void 0 ? void 0 : user.role) || "HOD - Mining")),
                    react_1.default.createElement("div", { className: "avatar-wrapper" },
                        react_1.default.createElement("div", { className: "avatar" }, ((_b = user === null || user === void 0 ? void 0 : user.name) === null || _b === void 0 ? void 0 : _b.charAt(0)) || "J"),
                        react_1.default.createElement("button", { onClick: onLogout, className: "logout-btn" },
                            react_1.default.createElement(lucide_react_1.LogOut, { size: 14 }),
                            " ",
                            strings.LogoutLabel)))))));
};
exports.default = Header;
//# sourceMappingURL=Header.js.map