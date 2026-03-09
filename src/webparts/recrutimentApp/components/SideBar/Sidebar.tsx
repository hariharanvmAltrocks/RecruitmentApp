import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, Briefcase, FileText, Settings, Circle, LayoutDashboard } from 'lucide-react';
import { cn } from '../../utilities/cn';
import styles from "./SideNavigation.module.scss";


type SidebarItemProps = {
  icon: React.ElementType | string;
  label: string;
  active?: boolean;
  onClick?: () => void;
};


const SidebarItem = ({ icon, label, active = false, onClick }: SidebarItemProps) => {

  const isImage = typeof icon === "string";

  return (
    <div
      onClick={onClick}
      className={`${styles.sidebarItem} ${active ? styles.active : ""}`}
    >
      {isImage ? (
        <img src={icon} className={styles.icon} />
      ) : (
        React.createElement(icon, { size: 20, className: styles.icon })
      )}

      <span className={styles.label}>{label}</span>
    </div>
  );
};

const SideNavigation: React.FC<{ menuData: any[]; activeMenuID: number; setactiveMenuID: (id: number) => void }> = ({ menuData, activeMenuID, setactiveMenuID }) => {
  const navigate = useNavigate();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>

        <div className={styles.logoIcon}>
          <img
            src={require("../../assets/komoa-logo.png")}
            alt="Kamoa Logo"
            className={styles.logoImg}
          />
        </div>

        <div className={styles.logoTitle}>
          Kamoa Copper SA
        </div>

      </div>
      <SidebarItem
        icon={LayoutDashboard}
        label="Dashboard"
        active={activeMenuID === 0}
        onClick={() => {
          setactiveMenuID(0);
          navigate("/Dashboard");
        }}
      />
      <nav className={styles.nav}>
        {menuData.map((item) => (
          <SidebarItem
            key={item.Id}
            icon={item.Icon}
            label={item.DisplayName}
            active={activeMenuID === item.Id}
            onClick={() => {
              setactiveMenuID(item.Id);
              navigate(item.path);
            }}
          />
        ))}
      </nav>
    </aside>
  );
};

export default SideNavigation;