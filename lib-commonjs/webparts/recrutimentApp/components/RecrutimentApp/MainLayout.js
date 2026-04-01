"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var Header_1 = tslib_1.__importDefault(require("../SideBar/Header/Header"));
var Sidebar_1 = tslib_1.__importDefault(require("../SideBar/Sidebar"));
require("./MainLayout.scss");
var MenuDataContext_1 = require("../../utilities/hooks/MenuDataContext");
var MainLayout = function (_a) {
    var RoleID = _a.RoleID, activeMenuID = _a.activeMenuID, setactiveMenuID = _a.setactiveMenuID, children = _a.children;
    var _b = (0, react_1.useState)(false), isSidebarOpen = _b[0], setSidebarOpen = _b[1];
    var menuData = (0, MenuDataContext_1.useMenuData)().menuData;
    return (React.createElement("div", { className: "main-layout" },
        React.createElement("div", { className: "sidebar ".concat(isSidebarOpen ? "open" : "") },
            React.createElement(Sidebar_1.default, { menuData: menuData, activeMenuID: activeMenuID, setactiveMenuID: setactiveMenuID })),
        React.createElement("div", { className: "layout-content" },
            React.createElement(Header_1.default, { menuData: menuData, onToggleSidebar: function () { return setSidebarOpen(!isSidebarOpen); }, onLogout: function () { return setSidebarOpen(false); } }),
            React.createElement("main", { className: "layout-main" },
                React.createElement(framer_motion_1.AnimatePresence, null, children)))));
};
exports.default = MainLayout;
//# sourceMappingURL=MainLayout.js.map