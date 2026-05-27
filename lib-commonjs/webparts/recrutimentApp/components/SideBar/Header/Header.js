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
    var _b, _c, _d, _e, _f;
    var menuData = _a.menuData, onToggleSidebar = _a.onToggleSidebar, onLogout = _a.onLogout;
    var pathname = (0, react_router_dom_1.useLocation)().pathname;
    var theme = (0, ThemeContext_1.useTheme)();
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var breadcrumbs = (0, react_1.useMemo)(function () { return (0, menuUtils_1.findBreadcrumbPath)(menuData, pathname); }, [menuData, pathname]);
    var user = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.userDetails) === null || _b === void 0 ? void 0 : _b[0];
    var UserName = [user === null || user === void 0 ? void 0 : user.FirstName, user === null || user === void 0 ? void 0 : user.MiddleName, user === null || user === void 0 ? void 0 : user.LastName]
        .filter(Boolean)
        .join(" ");
    return (react_1.default.createElement("header", { className: "header", style: { background: theme.headerColor } },
        react_1.default.createElement("div", { className: "header-container" },
            react_1.default.createElement("div", { className: "header-left" },
                react_1.default.createElement("button", { onClick: onToggleSidebar, className: "menu-btn" },
                    react_1.default.createElement(lucide_react_1.Menu, { size: 22 })),
                react_1.default.createElement("div", { className: "breadcrumb-section" },
                    react_1.default.createElement("h1", { className: "page-title" }, strings.AppTitle),
                    react_1.default.createElement("nav", { className: "breadcrumbs" }, breadcrumbs.map(function (crumb, idx) { return (react_1.default.createElement(react_1.default.Fragment, { key: crumb.Id },
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 10, strokeWidth: 3, className: "crumb-icon" }),
                        react_1.default.createElement(react_router_dom_1.Link, { to: crumb.Path, className: idx === breadcrumbs.length - 1 ? "active" : "" }, crumb.DisplayName))); })))),
            react_1.default.createElement("div", { className: "header-right" },
                react_1.default.createElement("div", { className: "divider" }),
                react_1.default.createElement("div", { className: "user-profile" },
                    react_1.default.createElement("div", { className: "user-info" },
                        react_1.default.createElement("p", { className: "user-name" }, UserName),
                        react_1.default.createElement("p", { className: "user-role" }, (_c = ADGroupData.userDetails[0]) === null || _c === void 0 ? void 0 : _c.DepartmentName)),
                    react_1.default.createElement("div", { className: "avatar-wrapper" },
                        react_1.default.createElement("div", { className: "avatar" }, ((_f = (_e = (_d = ADGroupData.userDetails) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.LastName) === null || _f === void 0 ? void 0 : _f[0]) || "S")))))));
};
exports.default = Header;
//# sourceMappingURL=Header.js.map