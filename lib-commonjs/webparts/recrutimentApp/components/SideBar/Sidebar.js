"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var SideNavigation_module_scss_1 = tslib_1.__importDefault(require("./SideNavigation.module.scss"));
var SidebarItem = function (_a) {
    var _b;
    var item = _a.item, activeMenuID = _a.activeMenuID, onSelectCallback = _a.onSelectCallback, isExpanded = _a.isExpanded, onToggleExpand = _a.onToggleExpand;
    var hasChildren = item.Children && item.Children.length > 0;
    var isActive = activeMenuID === item.Id;
    var isParentOfActive = (_b = item.Children) === null || _b === void 0 ? void 0 : _b.some(function (child) { return child.Id === activeMenuID; });
    var shouldHighlight = isActive || isParentOfActive;
    var currentIcon = shouldHighlight && item.ActiveIcon ? item.ActiveIcon : item.Icon;
    var handleClick = function (e) {
        e.stopPropagation();
        if (hasChildren && onToggleExpand) {
            onToggleExpand();
        }
        else {
            onSelectCallback(item.Id, item.Path);
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { onClick: handleClick, className: "".concat(SideNavigation_module_scss_1.default.sidebarItem, " ").concat(shouldHighlight ? SideNavigation_module_scss_1.default.active : "") },
            currentIcon && (react_1.default.createElement("img", { src: currentIcon, alt: item.DisplayName, className: SideNavigation_module_scss_1.default.icon })),
            react_1.default.createElement("span", { className: SideNavigation_module_scss_1.default.labelWrap },
                react_1.default.createElement("span", { className: SideNavigation_module_scss_1.default.label, title: item.DisplayName }, item.DisplayName),
                react_1.default.createElement("span", { className: SideNavigation_module_scss_1.default.labelTooltip, role: "tooltip" }, item.DisplayName)),
            hasChildren && (react_1.default.createElement(lucide_react_1.ChevronDown, { className: "".concat(SideNavigation_module_scss_1.default.chevron, " ").concat(isExpanded ? SideNavigation_module_scss_1.default.open : "") }))),
        hasChildren && isExpanded && (react_1.default.createElement("div", { className: SideNavigation_module_scss_1.default.submenu }, item.Children.map(function (child) { return (react_1.default.createElement(SidebarItem, { key: child.Id, item: child, activeMenuID: activeMenuID, onSelectCallback: onSelectCallback })); })))));
};
var SideNavigation = function (_a) {
    var menuData = _a.menuData, activeMenuID = _a.activeMenuID, setactiveMenuID = _a.setactiveMenuID, _b = _a.isCollapsed, isCollapsed = _b === void 0 ? false : _b;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _c = (0, react_1.useState)([]), expandedMenus = _c[0], setExpandedMenus = _c[1];
    // Sort and format the raw menu data
    var sortedMenu = tslib_1.__spreadArray([], menuData, true).sort(function (a, b) { return a.Id - b.Id; });
    // Set default active if 0 or empty initially
    (0, react_1.useEffect)(function () {
        if ((!activeMenuID || activeMenuID === 0) && sortedMenu.length > 0) {
            var firstItem = sortedMenu[0];
            setactiveMenuID(firstItem.Id);
            navigate(firstItem.Path, { replace: true });
        }
    }, [sortedMenu, activeMenuID]);
    // Expand parent initially if child is active
    (0, react_1.useEffect)(function () {
        sortedMenu.forEach(function (parent) {
            var _a;
            if ((_a = parent.Children) === null || _a === void 0 ? void 0 : _a.some(function (child) { return child.Id === activeMenuID; })) {
                if (!expandedMenus.includes(parent.Id)) {
                    setExpandedMenus(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [parent.Id], false); });
                }
            }
        });
    }, [activeMenuID]);
    var toggleExpand = function (id) {
        setExpandedMenus(function (prev) {
            return prev.includes(id)
                ? prev.filter(function (menuId) { return menuId !== id; })
                : tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [id], false);
        });
    };
    var handleSelect = function (id, path) {
        setactiveMenuID(id);
        navigate(path);
    };
    console.log(sortedMenu, "sortedMenu");
    return (react_1.default.createElement("aside", { className: "".concat(SideNavigation_module_scss_1.default.sidebar, " ").concat(isCollapsed ? SideNavigation_module_scss_1.default.collapsed : "") },
        react_1.default.createElement("div", { className: SideNavigation_module_scss_1.default.logoSection },
            react_1.default.createElement("div", { className: SideNavigation_module_scss_1.default.logoIcon },
                react_1.default.createElement("img", { src: require("../../assets/komoa-logo.png"), alt: "Kamoa Logo", className: SideNavigation_module_scss_1.default.logoImg })),
            react_1.default.createElement("div", { className: SideNavigation_module_scss_1.default.logoTitle }, "Kamoa Copper SA")),
        react_1.default.createElement("nav", { className: SideNavigation_module_scss_1.default.nav }, sortedMenu.map(function (parent) { return (react_1.default.createElement(SidebarItem, { key: parent.Id, item: parent, activeMenuID: activeMenuID, onSelectCallback: handleSelect, isExpanded: expandedMenus.includes(parent.Id), onToggleExpand: function () { return toggleExpand(parent.Id); } })); }))));
};
exports.default = SideNavigation;
//# sourceMappingURL=Sidebar.js.map