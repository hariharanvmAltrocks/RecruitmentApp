"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecrutimentApp;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
var Sidebar_1 = require("../SideBar/Sidebar");
var Header_1 = require("../SideBar/Header");
var sidebar_1 = require("../../models/sidebar");
function RecrutimentApp(props) {
    // ── Sidebar state ──────────────────────────────────────────────────────────
    var _a = (0, react_1.useState)(true), isExpanded = _a[0], setIsExpanded = _a[1];
    var _b = (0, react_1.useState)(false), isMobileOpen = _b[0], setIsMobileOpen = _b[1];
    // ── Navigation state ───────────────────────────────────────────────────────
    var _c = (0, react_1.useState)("/RecurimentProcess"), activePath = _c[0], setActivePath = _c[1];
    var _d = (0, react_1.useState)(30), activeChildId = _d[0], setActiveChildId = _d[1];
    var handleToggleSidebar = (0, react_1.useCallback)(function () { return setIsExpanded(function (p) { return !p; }); }, []);
    var handleMobileOpen = (0, react_1.useCallback)(function () { return setIsMobileOpen(true); }, []);
    var handleMobileClose = (0, react_1.useCallback)(function () { return setIsMobileOpen(false); }, []);
    var handleMenuClick = (0, react_1.useCallback)(function (path) {
        setActivePath(path);
        setActiveChildId(null);
        setIsMobileOpen(false);
    }, []);
    var handleChildClick = (0, react_1.useCallback)(function (path, child) {
        setActivePath(path);
        setActiveChildId(child.Id);
        setIsMobileOpen(false);
    }, []);
    return (React.createElement("div", { className: "flex h-screen w-full overflow-hidden bg-slate-50 font-sans" },
        React.createElement(Sidebar_1.Sidebar, { menuData: sidebar_1.MOCK_MENU, activePath: activePath, activeChildId: activeChildId, isExpanded: isExpanded, isMobileOpen: isMobileOpen, onMenuClick: handleMenuClick, onChildClick: handleChildClick, onMobileClose: handleMobileClose }),
        React.createElement("div", { className: "flex flex-col flex-1 min-w-0 overflow-hidden" },
            React.createElement(Header_1.Header, { activePath: activePath, userName: "Sarah Jenkins", userRole: "Recruitment Lead", department: "Human Resources", isExpanded: isExpanded, onToggleSidebar: handleToggleSidebar, onMobileMenuOpen: handleMobileOpen }),
            React.createElement("main", { className: "flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6" },
                React.createElement("div", { className: "max-w-5xl mx-auto space-y-5" },
                    React.createElement("div", { className: "bg-white rounded-2xl border border-slate-100 shadow-sm p-5" },
                        React.createElement("p", { className: "text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1" }, "Active Route"),
                        React.createElement("p", { className: "text-lg font-bold text-[#2c5170]" }, activePath),
                        activeChildId !== null && (React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" },
                            "Child ID: ",
                            activeChildId))),
                    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, ["Background Verification", "Offer Letter", "Interview Panel"].map(function (label) { return (React.createElement("div", { key: label, className: "bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3" },
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement("p", { className: "text-[12px] font-bold text-slate-700" }, label),
                            React.createElement("span", { className: "text-[9px] font-bold bg-[#597b98]/10 text-[#597b98] px-2 py-0.5 rounded-full" }, "Active")),
                        React.createElement("div", { className: "h-1.5 w-full bg-slate-100 rounded-full overflow-hidden" },
                            React.createElement("div", { className: "h-full bg-gradient-to-r from-[#597b98] to-[#4a90c4] rounded-full", style: { width: "".concat(Math.random() * 60 + 30, "%") } })),
                        React.createElement("p", { className: "text-[10px] text-slate-400" }, "3 pending actions"))); })),
                    React.createElement("div", { className: "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" },
                        React.createElement("div", { className: "px-5 py-3 border-b border-slate-100 flex items-center justify-between" },
                            React.createElement("p", { className: "text-[12px] font-bold text-slate-700" }, "Recent Applications"),
                            React.createElement("span", { className: "text-[9px] font-bold text-[#597b98] cursor-pointer hover:underline" }, "View all")),
                        ["Alice Mwamba", "John Kabila", "Grace Mutombo", "David Ilunga"].map(function (name, i) { return (React.createElement("div", { key: name, className: "flex items-center gap-3 px-5 py-3 border-b border-slate-50 last:border-0\n                    ".concat(i % 2 === 0 ? "bg-white" : "bg-slate-50/50") },
                            React.createElement("div", { className: "w-6 h-6 rounded-full bg-gradient-to-tr from-[#597b98]/60 to-[#4a90c4]/60\n                    flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0" }, name.split(" ").map(function (w) { return w[0]; }).join("")),
                            React.createElement("p", { className: "flex-1 text-[11px] font-semibold text-slate-700" }, name),
                            React.createElement("span", { className: "text-[9px] text-slate-400" }, "Applied today"),
                            React.createElement("span", { className: "text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600" }, "Pending"))); })))))));
}
//# sourceMappingURL=RecrutimentApp.js.map