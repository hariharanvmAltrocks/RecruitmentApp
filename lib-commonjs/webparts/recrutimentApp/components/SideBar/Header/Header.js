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
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var Header = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var menuData = _a.menuData, onToggleSidebar = _a.onToggleSidebar, onLogout = _a.onLogout;
    var pathname = (0, react_router_dom_1.useLocation)().pathname;
    var theme = (0, ThemeContext_1.useTheme)();
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    console.log(ADGroupData, "ADGroupData");
    var breadcrumbs = (0, react_1.useMemo)(function () { return (0, menuUtils_1.findBreadcrumbPath)(menuData, pathname); }, [menuData, pathname]);
    var UserName = ((_b = ADGroupData.userDetails[0]) === null || _b === void 0 ? void 0 : _b.FirstName) + " " + ((_c = ADGroupData.userDetails[0]) === null || _c === void 0 ? void 0 : _c.MiddleName) + " " + ((_d = ADGroupData.userDetails[0]) === null || _d === void 0 ? void 0 : _d.LastName);
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
                        react_1.default.createElement("p", { className: "user-name" }, UserName),
                        react_1.default.createElement("p", { className: "user-role" }, (_e = ADGroupData.userDetails[0]) === null || _e === void 0 ? void 0 : _e.DepartmentName)),
                    react_1.default.createElement("div", { className: "avatar-wrapper" },
                        react_1.default.createElement("div", { className: "avatar" }, ((_h = (_g = (_f = ADGroupData.userDetails) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.LastName) === null || _h === void 0 ? void 0 : _h[0]) || "S"),
                        react_1.default.createElement("button", { onClick: onLogout, className: "logout-btn" },
                            react_1.default.createElement(lucide_react_1.LogOut, { size: 14 }),
                            " ",
                            strings.LogoutLabel)))))));
};
exports.default = Header;
//# sourceMappingURL=Header.js.map