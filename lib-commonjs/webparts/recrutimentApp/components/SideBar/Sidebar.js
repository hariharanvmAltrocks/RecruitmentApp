"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var SideNavigation_module_scss_1 = tslib_1.__importDefault(require("./SideNavigation.module.scss"));
var SidebarItem = function (_a) {
    var icon = _a.icon, label = _a.label, _b = _a.active, active = _b === void 0 ? false : _b, onClick = _a.onClick;
    var isImage = typeof icon === "string";
    return (react_1.default.createElement("div", { onClick: onClick, className: "".concat(SideNavigation_module_scss_1.default.sidebarItem, " ").concat(active ? SideNavigation_module_scss_1.default.active : "") },
        isImage ? (react_1.default.createElement("img", { src: icon, className: SideNavigation_module_scss_1.default.icon })) : (react_1.default.createElement(icon, { size: 20, className: SideNavigation_module_scss_1.default.icon })),
        react_1.default.createElement("span", { className: SideNavigation_module_scss_1.default.label }, label)));
};
var SideNavigation = function (_a) {
    var menuData = _a.menuData, activeMenuID = _a.activeMenuID, setactiveMenuID = _a.setactiveMenuID;
    var navigate = (0, react_router_dom_1.useNavigate)();
    return (react_1.default.createElement("aside", { className: SideNavigation_module_scss_1.default.sidebar },
        react_1.default.createElement("div", { className: SideNavigation_module_scss_1.default.logoSection },
            react_1.default.createElement("div", { className: SideNavigation_module_scss_1.default.logoIcon },
                react_1.default.createElement("img", { src: require("../../assets/komoa-logo.png"), alt: "Kamoa Logo", className: SideNavigation_module_scss_1.default.logoImg })),
            react_1.default.createElement("div", { className: SideNavigation_module_scss_1.default.logoTitle }, "Kamoa Copper SA")),
        react_1.default.createElement(SidebarItem, { icon: lucide_react_1.LayoutDashboard, label: "Dashboard", active: activeMenuID === 0, onClick: function () {
                setactiveMenuID(0);
                navigate("/Dashboard");
            } }),
        react_1.default.createElement("nav", { className: SideNavigation_module_scss_1.default.nav }, menuData.map(function (item) { return (react_1.default.createElement(SidebarItem, { key: item.Id, icon: item.Icon, label: item.DisplayName, active: activeMenuID === item.Id, onClick: function () {
                setactiveMenuID(item.Id);
                navigate(item.path);
            } })); }))));
};
exports.default = SideNavigation;
//# sourceMappingURL=Sidebar.js.map