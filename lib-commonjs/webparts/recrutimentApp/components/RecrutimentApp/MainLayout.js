"use strict";
// import * as React from "react";
// import { useState } from "react";
// import { AnimatePresence } from "framer-motion";
// import Header from "../SideBar/Header/Header";
// import SideNavigation from "../SideBar/Sidebar";
// import "./MainLayout.scss";
// import { useMenuData } from "../../utilities/hooks/MenuDataContext";
// import { userInfo } from "../../utilities/hooks/RoleContext";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// interface MainLayoutProps {
//   RoleID: number[];
//   activeMenuID: number;
//   setactiveMenuID: (id: number) => void;
//   children: React.ReactNode;
// }
// const MainLayout: React.FC<MainLayoutProps> = ({
//   RoleID,
//   activeMenuID,
//   setactiveMenuID,
//   children,
// }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const { menuData } = useMenuData();
//   const { userName } = userInfo();
//   return (
//     <div className="main-layout">
//       <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
//         <SideNavigation
//           menuData={menuData}
//           activeMenuID={activeMenuID}
//           setactiveMenuID={setactiveMenuID}
//         />
//       </div>
//       <div className="layout-content">
//         <Header
//           user={userName}
//           menuData={menuData}
//           onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
//           onLogout={() => setSidebarOpen(false)}
//         />
//         <main className="layout-main">
//           <AnimatePresence>{children}</AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// };
// export default MainLayout;
//=======================
var React = tslib_1.__importStar(require("react"));
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var Header_1 = tslib_1.__importDefault(require("../SideBar/Header/Header"));
var Sidebar_1 = tslib_1.__importDefault(require("../SideBar/Sidebar"));
require("./mainlayout.scss");
var MenuDataContext_1 = require("../../utilities/hooks/MenuDataContext");
var MainLayout = function (_a) {
    var RoleID = _a.RoleID, activeMenuID = _a.activeMenuID, setactiveMenuID = _a.setactiveMenuID, children = _a.children, _b = _a.isFormOpen, isFormOpen = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(false), isSidebarOpen = _c[0], setSidebarOpen = _c[1];
    var menuData = (0, MenuDataContext_1.useMenuData)().menuData;
    return (React.createElement("div", { className: "main-layout" },
        React.createElement("div", { className: "sidebar ".concat(isSidebarOpen ? "open" : "") },
            React.createElement(Sidebar_1.default, { menuData: menuData, activeMenuID: activeMenuID, setactiveMenuID: setactiveMenuID, isCollapsed: isSidebarOpen })),
        React.createElement("div", { className: "layout-content" },
            React.createElement(Header_1.default, { user: userName, menuData: menuData, onToggleSidebar: function () { return setSidebarOpen(!isSidebarOpen); }, onLogout: function () { return setSidebarOpen(false); } }),
            React.createElement("main", { className: "layout-main" },
                React.createElement(framer_motion_1.AnimatePresence, null, children)))));
};
exports.default = MainLayout;
//# sourceMappingURL=MainLayout.js.map