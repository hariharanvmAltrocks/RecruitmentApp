"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
var Sidebar_1 = require("./Sidebar");
var sidebar_1 = require("../../models/sidebar");
var Header = function (_a) {
    var activePath = _a.activePath, _b = _a.userName, userName = _b === void 0 ? "Sarah Jenkins" : _b, _c = _a.userRole, userRole = _c === void 0 ? "Recruitment Lead" : _c, department = _a.department, isExpanded = _a.isExpanded, onToggleSidebar = _a.onToggleSidebar, onMobileMenuOpen = _a.onMobileMenuOpen;
    var _d = (0, react_1.useState)(false), showNotif = _d[0], setShowNotif = _d[1];
    var initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(function (w) { return w[0].toUpperCase(); })
        .join("");
    var crumbs = activePath
        .split("/")
        .filter(Boolean)
        .map(function (seg) { return seg.replace(/([A-Z])/g, " $1").trim(); });
    var pageTitle = (0, sidebar_1.getPageTitle)(activePath);
    return (React.createElement("header", { className: "\r\n      h-12 bg-white border-b border-slate-200\r\n      flex items-center justify-between\r\n      px-4 sm:px-5\r\n      flex-shrink-0 relative z-30\r\n    " },
        React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement("button", { onClick: onMobileMenuOpen, className: "md:hidden p-1.5 rounded-lg text-slate-400\r\n            hover:bg-slate-100 hover:text-slate-600 transition-colors", "aria-label": "Open navigation" }, Sidebar_1.Icons.menu),
            React.createElement("button", { onClick: onToggleSidebar, className: "hidden md:flex p-1.5 rounded-lg text-slate-400\r\n            hover:bg-slate-100 hover:text-slate-600 transition-colors", "aria-label": isExpanded ? "Collapse sidebar" : "Expand sidebar" }, isExpanded ? Sidebar_1.Icons.collapseLeft : Sidebar_1.Icons.expandRight),
            React.createElement("div", { className: "hidden sm:block h-4 w-px bg-slate-200" }),
            React.createElement("div", { className: "hidden sm:flex flex-col" },
                React.createElement("h2", { className: "text-[13px] font-extrabold text-slate-900 tracking-tight leading-none" }, pageTitle),
                crumbs.length > 0 && (React.createElement("nav", { className: "flex items-center gap-1 mt-0.5" },
                    React.createElement("span", { className: "text-[9px] text-slate-400" }, "Home"),
                    crumbs.map(function (c, i) { return (React.createElement(React.Fragment, { key: i },
                        React.createElement("span", { className: "text-[9px] text-slate-300" }, "/"),
                        React.createElement("span", { className: "text-[9px] ".concat(i === crumbs.length - 1
                                ? "text-slate-600 font-bold"
                                : "text-slate-400") }, c))); })))),
            React.createElement("span", { className: "sm:hidden text-[13px] font-bold text-slate-800" }, pageTitle)),
        React.createElement("div", { className: "flex items-center gap-2 sm:gap-3" },
            React.createElement("div", { className: "relative" },
                React.createElement("button", { onClick: function () { return setShowNotif(function (p) { return !p; }); }, className: "relative p-1.5 rounded-full text-slate-400\r\n              hover:text-[#597b98] hover:bg-slate-50 transition-colors", "aria-label": "Notifications" },
                    Sidebar_1.Icons.bell,
                    React.createElement("span", { className: "absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" })),
                showNotif && (React.createElement("div", { className: "\r\n              absolute right-0 top-full mt-2 w-64\r\n              bg-white rounded-xl shadow-xl border border-slate-100\r\n              py-2 z-50\r\n            " },
                    React.createElement("p", { className: "px-3 pb-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase\r\n                border-b border-slate-100" }, "Notifications"),
                    [
                        { title: "New CV uploaded", time: "2 min ago", dot: "bg-blue-400" },
                        { title: "Interview scheduled", time: "1 hr ago", dot: "bg-green-400" },
                        { title: "Offer letter approved", time: "3 hrs ago", dot: "bg-amber-400" },
                    ].map(function (n, i) { return (React.createElement("div", { key: i, className: "flex items-start gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer" },
                        React.createElement("span", { className: "w-1.5 h-1.5 rounded-full ".concat(n.dot, " mt-1.5 flex-shrink-0") }),
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-[11px] font-semibold text-slate-700" }, n.title),
                            React.createElement("p", { className: "text-[9px] text-slate-400" }, n.time)))); })))),
            React.createElement("div", { className: "h-5 w-px bg-slate-200" }),
            React.createElement("div", { className: "flex items-center gap-2 cursor-pointer group" },
                React.createElement("div", { className: "hidden sm:flex flex-col items-end" },
                    React.createElement("p", { className: "text-[11px] font-bold text-slate-900 leading-none mb-0.5" }, userName),
                    React.createElement("p", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-wider" }, userRole),
                    department && (React.createElement("p", { className: "text-[8px] text-slate-400 truncate max-w-[120px]" }, department))),
                React.createElement("div", { className: "\r\n            w-7 h-7 rounded-full\r\n            bg-gradient-to-tr from-[#597b98] to-[#4a90c4]\r\n            flex items-center justify-center\r\n            text-white text-[9px] font-bold\r\n            border border-white shadow-sm\r\n            transition-transform duration-150 group-hover:scale-105\r\n            flex-shrink-0\r\n          " }, initials)))));
};
exports.Header = Header;
//# sourceMappingURL=Header.js.map