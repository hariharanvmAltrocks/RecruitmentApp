"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
var Sidebar_1 = require("./SideBar/Sidebar");
var menu_1 = require("../models/menu");
var RecrutimentApp = function (props) {
    var _a = (0, react_1.useState)(undefined), user = _a[0], setUser = _a[1];
    var _b = (0, react_1.useState)("/RecurimentProcess"), activePath = _b[0], setActivePath = _b[1];
    var _c = (0, react_1.useState)(30), activeChildId = _c[0], setActiveChildId = _c[1];
    (0, react_1.useEffect)(function () {
    }, []);
    return (React.createElement("div", null,
        React.createElement(Sidebar_1.DynamicSidebar, { menuData: menu_1.mockMenuData, activePath: activePath, activeChildId: activeChildId, onMenuClick: function (path, item) {
                setActivePath(path);
                setActiveChildId(null);
            }, onChildClick: function (path, child) {
                setActivePath(path);
                setActiveChildId(child.Id);
            } })));
};
exports.default = RecrutimentApp;
//# sourceMappingURL=RecrutimentApp.js.map