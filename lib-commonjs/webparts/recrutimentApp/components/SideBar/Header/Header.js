"use strict";
// import React, { useMemo } from 'react';
// import { Bell, ChevronRight, Menu, LogOut } from 'lucide-react';
// import { useLocation, Link } from 'react-router-dom';
// import './Header.scss';
// import { findBreadcrumbPath } from '../menuUtils';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// interface HeaderProps {
//   user: any;
//   menuData: any[];
//   onToggleSidebar: () => void;
//   onLogout: () => void;
// }
// const Header: React.FC<HeaderProps> = ({ user, menuData, onToggleSidebar, onLogout }) => {
//   const { pathname } = useLocation();
//   const breadcrumbs = useMemo(() => findBreadcrumbPath(menuData, pathname), [menuData, pathname]);
//   return (
//     <header className="header">
//       <div className="header-container">
//         <div className="header-left">
//           <button onClick={onToggleSidebar} className="menu-btn">
//             <Menu size={22} />
//           </button>
//           <div className="breadcrumb-section">
//             <h1 className="page-title">
//               {breadcrumbs[breadcrumbs.length - 1]?.DisplayName || "Recruitment Process"}
//             </h1>
//             <nav className="breadcrumbs">
//               <Link to="/">Home</Link>
//               {breadcrumbs.map((crumb, idx) => (
//                 <React.Fragment key={crumb.Id}>
//                   <ChevronRight size={10} strokeWidth={3} className="crumb-icon" />
//                   <Link
//                     to={crumb.Path}
//                     className={idx === breadcrumbs.length - 1 ? "active" : ""}
//                   >
//                     {crumb.DisplayName}
//                   </Link>
//                 </React.Fragment>
//               ))}
//             </nav>
//           </div>
//         </div>
//         <div className="header-right">
//           <button className="notification-btn">
//             <Bell size={20} />
//             <span className="notification-dot"></span>
//           </button>
//           <div className="divider"></div>
//           <div className="user-profile">
//             <div className="user-info">
//               <p className="user-name">{user || "Jackson"}</p>
//               <p className="user-role">{user?.role || "HOD - Mining"}</p>
//             </div>
//             <div className="avatar-wrapper">
//               <div className="avatar">
//                 {user?.name?.charAt(0) || "J"}
//               </div>
//               <button onClick={onLogout} className="logout-btn">
//                 <LogOut size={14} /> Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
// export default Header;
//============
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
require("./Header.scss");
var menuUtils_1 = require("../menuUtils");
var Header = function (_a) {
    var _b, _c;
    var user = _a.user, menuData = _a.menuData, onToggleSidebar = _a.onToggleSidebar, onLogout = _a.onLogout, isFormOpen = _a.isFormOpen;
    var pathname = (0, react_router_dom_1.useLocation)().pathname;
    var breadcrumbs = (0, react_1.useMemo)(function () { return (0, menuUtils_1.findBreadcrumbPath)(menuData, pathname); }, [menuData, pathname]);
    var handleCloseForm = function (e) {
        e.preventDefault();
        window.dispatchEvent(new Event("close-evaluation-form"));
    };
    return (react_1.default.createElement("header", { className: "header" },
        react_1.default.createElement("div", { className: "header-container" },
            react_1.default.createElement("div", { className: "header-left" },
                react_1.default.createElement("button", { onClick: onToggleSidebar, className: "menu-btn" },
                    react_1.default.createElement(lucide_react_1.Menu, { size: 22 })),
                react_1.default.createElement("div", { className: "breadcrumb-section" },
                    react_1.default.createElement("h1", { className: "page-title" }, ((_b = breadcrumbs[breadcrumbs.length - 1]) === null || _b === void 0 ? void 0 : _b.DisplayName) || "Selection Process"),
                    isFormOpen ? (react_1.default.createElement("nav", { className: "breadcrumbs" },
                        react_1.default.createElement(react_router_dom_1.Link, { to: "/" }, "HOME"),
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 10, strokeWidth: 3, className: "crumb-icon" }),
                        react_1.default.createElement(react_router_dom_1.Link, { to: "/Dashboard" }, "DASHBOARD"),
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 10, strokeWidth: 3, className: "crumb-icon" }),
                        react_1.default.createElement(react_router_dom_1.Link, { to: "#", onClick: handleCloseForm }, "CANDIDATE EVALUATIONS"),
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 10, strokeWidth: 3, className: "crumb-icon" }),
                        react_1.default.createElement("span", { className: "active", style: { fontWeight: 800, fontSize: "11px" } }, "EVALUATION FORM"))) : (react_1.default.createElement("nav", { className: "breadcrumbs" },
                        react_1.default.createElement(react_router_dom_1.Link, { to: "/" }, "HOME"),
                        breadcrumbs.map(function (crumb, idx) { return (react_1.default.createElement(react_1.default.Fragment, { key: crumb.Id },
                            react_1.default.createElement(lucide_react_1.ChevronRight, { size: 10, strokeWidth: 3, className: "crumb-icon" }),
                            react_1.default.createElement(react_router_dom_1.Link, { to: crumb.Path, className: idx === breadcrumbs.length - 1 ? "active" : "" }, crumb.DisplayName))); }))))),
            react_1.default.createElement("div", { className: "header-right" },
                react_1.default.createElement("button", { className: "notification-btn" },
                    react_1.default.createElement(lucide_react_1.Bell, { size: 20 }),
                    react_1.default.createElement("span", { className: "notification-dot" })),
                react_1.default.createElement("div", { className: "divider" }),
                react_1.default.createElement("div", { className: "user-profile" },
                    react_1.default.createElement("div", { className: "user-info" },
                        react_1.default.createElement("p", { className: "user-name" }, user || "Jackson"),
                        react_1.default.createElement("p", { className: "user-role" }, (user === null || user === void 0 ? void 0 : user.role) || "HOD - Mining")),
                    react_1.default.createElement("div", { className: "avatar-wrapper" },
                        react_1.default.createElement("div", { className: "avatar" }, ((_c = user === null || user === void 0 ? void 0 : user.name) === null || _c === void 0 ? void 0 : _c.charAt(0)) || "J"),
                        react_1.default.createElement("button", { onClick: onLogout, className: "logout-btn" },
                            react_1.default.createElement(lucide_react_1.LogOut, { size: 14 }),
                            " Logout")))))));
};
exports.default = Header;
//# sourceMappingURL=Header.js.map