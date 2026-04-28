import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./SideNavigation.module.scss";
import { useUIState } from "../RecrutimentApp/UIStateContext";

type MenuItem = {
  Id: number;
  DisplayName: string;
  Path: string;
  Icon?: string | null;
  ActiveIcon?: string | null;
  Children?: MenuItem[];
};

type SidebarItemProps = {
  item: MenuItem;
  activeMenuID: number;
  onSelectCallback: (id: number, path: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isCollapsed?: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  activeMenuID,
  onSelectCallback,
  isExpanded,
  onToggleExpand,
  isCollapsed = false,
}) => {
  const hasChildren = item.Children && item.Children.length > 0;
  const isActive = activeMenuID === item.Id;
  const isParentOfActive = item.Children?.some(
    (child) => child.Id === activeMenuID,
  );

  const shouldHighlight = isActive || isParentOfActive;

  const currentIcon =
    shouldHighlight && item.ActiveIcon ? item.ActiveIcon : item.Icon;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && onToggleExpand) {
      onToggleExpand();
    } else {
      onSelectCallback(item.Id, item.Path);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`${styles.sidebarItem} ${shouldHighlight ? styles.active : ""}`}
        title={isCollapsed ? item.DisplayName : undefined}
      >
        {/* Icon from DB — falls back to dot if no URL */}
        {currentIcon ? (
          <img
            src={currentIcon}
            alt={item.DisplayName}
            className={styles.icon}
          />
        ) : (
          <span className={styles.iconFallback} />
        )}

        {/* Label + floating tooltip (shown in collapsed mode) */}
        <span className={styles.labelWrap}>
          <span className={styles.label}>{item.DisplayName}</span>
          <span className={styles.labelTooltip} role="tooltip">
            {item.DisplayName}
          </span>
        </span>

        {/* ChevronUp when open, ChevronDown when closed */}
        {hasChildren &&
          (isExpanded ? (
            <ChevronUp className={styles.chevron} />
          ) : (
            <ChevronDown className={styles.chevron} />
          ))}
      </div>

      {/* Submenu children */}
      {hasChildren && isExpanded && (
        <div className={styles.submenu}>
          {item.Children!.map((child) => (
            <SidebarItem
              key={child.Id}
              item={child}
              activeMenuID={activeMenuID}
              onSelectCallback={onSelectCallback}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </>
  );
};

interface SideNavigationProps {
  menuData: any[];
  activeMenuID: number;
  setactiveMenuID: (id: number) => void;
  isCollapsed?: boolean;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  menuData,
  activeMenuID,
  setactiveMenuID,
  isCollapsed = false,
}) => {
  const navigate = useNavigate();
  const { setSideNavflag } = useUIState();
  const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

  const sortedMenu: MenuItem[] = [...menuData].sort((a, b) => a.Id - b.Id);

  // Set default active menu on first load
  useEffect(() => {
    if ((!activeMenuID || activeMenuID === 0) && sortedMenu.length > 0) {
      const firstItem = sortedMenu[0];
      setactiveMenuID(firstItem.Id);
      navigate(firstItem.Path, { replace: true });
    }
  }, [sortedMenu, activeMenuID]);

  // Auto-expand parent if a child is currently active
  useEffect(() => {
    sortedMenu.forEach((parent) => {
      if (parent.Children?.some((child) => child.Id === activeMenuID)) {
        if (!expandedMenus.includes(parent.Id)) {
          setExpandedMenus((prev) => [...prev, parent.Id]);
        }
      }
    });
  }, [activeMenuID]);

  const toggleExpand = (id: number) => {
    setExpandedMenus((prev) =>
      prev.includes(id)
        ? prev.filter((menuId) => menuId !== id)
        : [...prev, id],
    );
  };

  const handleSelect = (id: number, path: string) => {
    setactiveMenuID(id);
    setSideNavflag(true);
    navigate(path);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      {/* ── Logo Section ── */}
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>
          <img
            src={require("../../assets/getsitelogo.png")}
            alt="Kamoa Logo"
            className={styles.logoImg}
          />
        </div>
        {/* Two-line logo text: bold title + muted subtitle */}
        {/* <div className={styles.logoTextWrap}>
          <div className={styles.logoTitle}>Kamoa Copper</div>
          <div className={styles.logoSubtitle}>SA</div>
        </div> */}
      </div>

      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        {/* "MAIN MENU" section label — matches screenshot */}
        {!isCollapsed && <div className={styles.sectionLabel}>Main Menu</div>}

        {sortedMenu.map((parent) => (
          <SidebarItem
            key={parent.Id}
            item={parent}
            activeMenuID={activeMenuID}
            onSelectCallback={handleSelect}
            isExpanded={expandedMenus.includes(parent.Id)}
            onToggleExpand={() => toggleExpand(parent.Id)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className={styles.sidebarFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerVersion}>v-1.1</div>
          <div className={styles.footerLabel}>Kamoa Copper SA</div>
        </div>
      </div>
    </aside>
  );
};

export default SideNavigation;
