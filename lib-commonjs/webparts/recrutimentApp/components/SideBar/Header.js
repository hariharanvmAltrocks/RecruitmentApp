"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var menuUtils_1 = require("./menuUtils");
var Header = function (_a) {
    var _b, _c;
    var user = _a.user, menuData = _a.menuData, onToggleSidebar = _a.onToggleSidebar, onLogout = _a.onLogout;
    var pathname = (0, react_router_dom_1.useLocation)().pathname;
    var breadcrumbs = (0, react_1.useMemo)(function () { return (0, menuUtils_1.findBreadcrumbPath)(menuData, pathname); }, [menuData, pathname]);
    return (react_1.default.createElement("header", { className: "bg-white border-b border-slate-200 px-4 md:px-8 py-4 sticky top-0 z-30" },
        react_1.default.createElement("div", { className: "flex items-center justify-between max-w-[1600px] mx-auto" },
            react_1.default.createElement("div", { className: "flex items-center gap-4" },
                react_1.default.createElement("button", { onClick: onToggleSidebar, className: "md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" },
                    react_1.default.createElement(lucide_react_1.Menu, { size: 22 })),
                react_1.default.createElement("div", { className: "flex flex-col" },
                    react_1.default.createElement("h1", { className: "text-xl md:text-2xl font-bold text-slate-800 leading-tight" }, ((_b = breadcrumbs[breadcrumbs.length - 1]) === null || _b === void 0 ? void 0 : _b.DisplayName) || "Recruitment Process"),
                    react_1.default.createElement("nav", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5" },
                        react_1.default.createElement(react_router_dom_1.Link, { to: "/", className: "hover:text-blue-600 transition-colors" }, "Home"),
                        breadcrumbs.map(function (crumb, idx) { return (react_1.default.createElement(react_1.default.Fragment, { key: crumb.Id },
                            react_1.default.createElement(lucide_react_1.ChevronRight, { size: 10, strokeWidth: 3, className: "text-slate-300" }),
                            react_1.default.createElement(react_router_dom_1.Link, { to: crumb.Path, className: idx === breadcrumbs.length - 1 ? "text-blue-600" : "hover:text-blue-600" }, crumb.DisplayName))); })))),
            react_1.default.createElement("div", { className: "flex items-center gap-3 md:gap-6" },
                react_1.default.createElement("button", { className: "relative p-2 text-slate-400 hover:text-blue-600 transition-colors hidden sm:block" },
                    react_1.default.createElement(lucide_react_1.Bell, { size: 20 }),
                    react_1.default.createElement("span", { className: "absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" })),
                react_1.default.createElement("div", { className: "w-px h-8 bg-slate-200 hidden sm:block" }),
                react_1.default.createElement("div", { className: "flex items-center gap-3 group" },
                    react_1.default.createElement("div", { className: "text-right hidden sm:block" },
                        react_1.default.createElement("p", { className: "text-sm font-bold text-slate-700 leading-none" }, (user === null || user === void 0 ? void 0 : user.name) || "Jackson"),
                        react_1.default.createElement("p", { className: "text-[10px] text-slate-400 uppercase font-bold mt-1" }, (user === null || user === void 0 ? void 0 : user.role) || "HOD - Mining")),
                    react_1.default.createElement("div", { className: "relative group" },
                        react_1.default.createElement("div", { className: "w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm cursor-pointer" }, ((_c = user === null || user === void 0 ? void 0 : user.name) === null || _c === void 0 ? void 0 : _c.charAt(0)) || "J"),
                        react_1.default.createElement("button", { onClick: onLogout, className: "absolute -bottom-10 right-0 bg-white shadow-xl border border-slate-100 py-2 px-4 rounded-lg flex items-center gap-2 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" },
                            react_1.default.createElement(lucide_react_1.LogOut, { size: 14 }),
                            " Logout")))))));
};
exports.default = Header;
//# sourceMappingURL=Header.js.map