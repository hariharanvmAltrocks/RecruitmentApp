"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = exports.Icons = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
exports.Icons = {
    building: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }))),
    search: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" }))),
    person: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }))),
    document: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" }))),
    chart: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }))),
    chevronRight: (React.createElement("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M9 5l7 7-7 7" }))),
    menu: (React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }))),
    close: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }))),
    collapseLeft: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 19l-7-7 7-7m8 14l-7-7 7-7" }))),
    expandRight: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 5l7 7-7 7M5 5l7 7-7 7" }))),
    bell: (React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }))),
};
var MENU_ICON_MAP = {
    "Selection Process": exports.Icons.search,
    "Recruitment Process": exports.Icons.person,
    "Onboarding": exports.Icons.document,
    "Reports": exports.Icons.chart,
};
var getMenuIcon = function (name) { var _a; return (_a = MENU_ICON_MAP[name]) !== null && _a !== void 0 ? _a : exports.Icons.document; };
var ChildItem = function (_a) {
    var _b;
    var child = _a.child, parent = _a.parent, isActive = _a.isActive, isLast = _a.isLast, isExpanded = _a.isExpanded, onClick = _a.onClick;
    if (!isExpanded)
        return null;
    return (React.createElement("div", { className: "flex items-stretch" },
        React.createElement("div", { className: "flex flex-col items-center mr-2 ml-1 flex-shrink-0", style: { minWidth: 14 } },
            React.createElement("div", { className: "w-px bg-slate-200 ".concat(isLast ? "h-3" : "flex-1"), style: { minHeight: 12 } }),
            React.createElement("div", { className: "w-2.5 h-px bg-slate-200" }),
            !isLast && React.createElement("div", { className: "w-px flex-1 bg-slate-200" })),
        React.createElement("button", { onClick: function () { return onClick(child.Path, child, parent); }, className: "\n          flex items-center gap-2 flex-1 py-1.5 px-2 my-0.5 rounded-lg\n          text-left text-xs font-medium transition-all duration-150 border border-transparent\n          ".concat(isActive
                ? "bg-[#597b98]/12 text-[#2c5170] font-semibold border-[#597b98]/15"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#3a6080]", "\n        ") },
            React.createElement("span", { className: "\n          w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-150\n          ".concat(isActive ? "bg-[#597b98]" : "bg-slate-300", "\n        ") }),
            React.createElement("span", { className: "flex-1 leading-snug truncate" }, child.DisplayName),
            ((_b = child.TabDetails) === null || _b === void 0 ? void 0 : _b.length) > 0 && (React.createElement("span", { className: "\n            text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0\n            ".concat(isActive ? "bg-[#597b98] text-white" : "bg-slate-100 text-slate-400", "\n          ") }, child.TabDetails.length)))));
};
// ─── Top-level menu item ──────────────────────────────────────────────────────
var TopMenuItem = function (_a) {
    var _b, _c;
    var item = _a.item, activePath = _a.activePath, activeChildId = _a.activeChildId, isExpanded = _a.isExpanded, onMenuClick = _a.onMenuClick, onChildClick = _a.onChildClick;
    var hasChildren = ((_b = item.Children) === null || _b === void 0 ? void 0 : _b.length) > 0;
    var isParentActive = activePath === item.Path ||
        ((_c = item.Children) === null || _c === void 0 ? void 0 : _c.some(function (c) { return c.Id === activeChildId; }));
    var _d = (0, react_1.useState)(isParentActive), open = _d[0], setOpen = _d[1];
    var handleClick = (0, react_1.useCallback)(function () {
        if (hasChildren)
            setOpen(function (p) { return !p; });
        onMenuClick(item.Path, item);
    }, [hasChildren, item, onMenuClick]);
    return (React.createElement("div", { className: "mb-0.5" },
        React.createElement("button", { onClick: handleClick, title: !isExpanded ? item.DisplayName : undefined, className: "\n          relative flex items-center w-full rounded-xl\n          transition-all duration-150 group\n          ".concat(isExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5", "\n          ").concat(isParentActive
                ? "bg-[#597b98]/15 text-[#2c5170]"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#2c5170]", "\n        ") },
            isParentActive && (React.createElement("span", { className: "absolute left-0 top-[20%] h-[60%] w-0.5 rounded-r bg-[#597b98]" })),
            React.createElement("span", { className: "\n          flex-shrink-0 transition-colors duration-150\n          ".concat(isParentActive ? "text-[#597b98]" : "text-slate-400 group-hover:text-[#597b98]", "\n        ") }, item.ActiveIcon && isParentActive
                ? React.createElement("img", { src: item.ActiveIcon, alt: "", className: "w-4 h-4 object-contain" })
                : item.Icon
                    ? React.createElement("img", { src: item.Icon, alt: "", className: "w-4 h-4 object-contain opacity-60" })
                    : getMenuIcon(item.DisplayName)),
            isExpanded && (React.createElement("span", { className: "flex-1 text-left text-[13px] font-semibold tracking-tight leading-tight truncate" }, item.DisplayName)),
            isExpanded && hasChildren && (React.createElement("span", { className: "\n            flex-shrink-0 text-slate-300 transition-transform duration-200\n            ".concat(open ? "rotate-90" : "rotate-0", "\n          ") }, exports.Icons.chevronRight)),
            !isExpanded && isParentActive && (React.createElement("span", { className: "absolute right-1.5 top-1.5 w-1 h-1 rounded-full bg-[#597b98]" }))),
        hasChildren && open && isExpanded && (React.createElement("div", { className: "pl-3 pt-0.5 pb-1" }, tslib_1.__spreadArray([], item.Children, true).sort(function (a, b) { var _a, _b; return ((_a = a.Sort) !== null && _a !== void 0 ? _a : 0) - ((_b = b.Sort) !== null && _b !== void 0 ? _b : 0); })
            .map(function (child, idx) { return (React.createElement(ChildItem, { key: child.Id, child: child, parent: item, isActive: activeChildId === child.Id, isLast: idx === item.Children.length - 1, isExpanded: isExpanded, onClick: onChildClick })); })))));
};
var SidebarPanel = function (_a) {
    var isExpanded = _a.isExpanded, children = _a.children;
    return (React.createElement("div", { className: "\n    flex flex-col h-full bg-white border-r border-slate-100\n    transition-all duration-300 ease-in-out overflow-hidden\n    ".concat(isExpanded ? "w-60" : "w-16", "\n  ") }, children));
};
var SidebarContent = function (_a) {
    var menuData = _a.menuData, activePath = _a.activePath, activeChildId = _a.activeChildId, isExpanded = _a.isExpanded, onMenuClick = _a.onMenuClick, onChildClick = _a.onChildClick;
    var sorted = tslib_1.__spreadArray([], menuData, true).sort(function (a, b) { return a.Sort - b.Sort; });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "\n        flex items-center border-b border-slate-100 flex-shrink-0\n        ".concat(isExpanded ? "gap-3 px-4 py-4" : "justify-center px-0 py-4", "\n      ") },
            React.createElement("div", { className: "w-8 h-8 rounded-lg bg-[#597b98] flex items-center justify-center flex-shrink-0 shadow-sm" },
                exports.Icons.building,
                React.createElement("style", null, ".sidebar-logo svg { color: white !important; }")),
            isExpanded && (React.createElement("div", { className: "min-w-0 overflow-hidden" },
                React.createElement("p", { className: "text-[13px] font-bold text-slate-800 leading-tight truncate" }, "Kamoa Copper SA"),
                React.createElement("p", { className: "text-[10px] text-slate-400 font-medium tracking-wide truncate" }, "HRMS Portal")))),
        isExpanded && (React.createElement("div", { className: "px-4 pt-3.5 pb-1.5 flex-shrink-0" },
            React.createElement("span", { className: "text-[9px] font-bold text-slate-400 tracking-[1.5px] uppercase" }, "Navigation"))),
        React.createElement("nav", { className: "flex-1 overflow-y-auto px-2 py-2 space-y-px" }, sorted.map(function (item) { return (React.createElement(TopMenuItem, { key: item.Id, item: item, activePath: activePath, activeChildId: activeChildId, isExpanded: isExpanded, onMenuClick: onMenuClick, onChildClick: onChildClick })); })),
        React.createElement("div", { className: "\n        border-t border-slate-100 py-3 flex-shrink-0\n        ".concat(isExpanded ? "px-4" : "flex justify-center", "\n      ") }, isExpanded
            ? React.createElement("p", { className: "text-[10px] text-slate-400 font-medium" }, "Version 1.3")
            : React.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-300 block" }))));
};
var Sidebar = function (_a) {
    var menuData = _a.menuData, activePath = _a.activePath, activeChildId = _a.activeChildId, isExpanded = _a.isExpanded, isMobileOpen = _a.isMobileOpen, onMenuClick = _a.onMenuClick, onChildClick = _a.onChildClick, onMobileClose = _a.onMobileClose;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { onClick: onMobileClose, className: "\n        fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden\n        ".concat(isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none", "\n      ") }),
        React.createElement("aside", { className: "\n      fixed top-0 left-0 h-full z-50 w-64 shadow-2xl transition-transform duration-300 md:hidden\n      ".concat(isMobileOpen ? "translate-x-0" : "-translate-x-full", "\n    ") },
            React.createElement("div", { className: "flex flex-col h-full bg-white" },
                React.createElement("button", { onClick: onMobileClose, className: "absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center\r\n            rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors" }, exports.Icons.close),
                React.createElement(SidebarContent, { menuData: menuData, activePath: activePath, activeChildId: activeChildId, isExpanded: true, onMenuClick: onMenuClick, onChildClick: onChildClick }))),
        React.createElement("aside", { className: "hidden md:block h-screen sticky top-0 flex-shrink-0" },
            React.createElement(SidebarPanel, { isExpanded: isExpanded },
                React.createElement(SidebarContent, { menuData: menuData, activePath: activePath, activeChildId: activeChildId, isExpanded: isExpanded, onMenuClick: onMenuClick, onChildClick: onChildClick })))));
};
exports.Sidebar = Sidebar;
//# sourceMappingURL=Sidebar.js.map