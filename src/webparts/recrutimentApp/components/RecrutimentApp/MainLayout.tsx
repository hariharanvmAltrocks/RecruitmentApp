import * as React from "react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "../SideBar/Header/Header";
import SideNavigation from "../SideBar/Sidebar";
import "./mainlayout.scss";
import { useMenuData } from "../../utilities/hooks/MenuDataContext";
import { userInfo } from "../../utilities/hooks/RoleContext";

interface MainLayoutProps {
  RoleID: number[];
  activeMenuID: number;
  setactiveMenuID: (id: number) => void;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  RoleID,
  activeMenuID,
  setactiveMenuID,
  children,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { menuData } = useMenuData();

  return (
    <div className="main-layout">
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <SideNavigation
          menuData={menuData}
          activeMenuID={activeMenuID}
          setactiveMenuID={setactiveMenuID}
          isCollapsed={isSidebarOpen}
        />
      </div>

      <div className="layout-content">
        <Header
          menuData={menuData}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          onLogout={() => setSidebarOpen(false)}
        />

        <main className="layout-main">
          <AnimatePresence>{children}</AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
