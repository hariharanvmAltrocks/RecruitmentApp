import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import styles from "./SideNavigation.module.scss";

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
};

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  activeMenuID, 
  onSelectCallback,
  isExpanded,
  onToggleExpand
}) => {
  const hasChildren = item.Children && item.Children.length > 0;
  const isActive = activeMenuID === item.Id;
  const isParentOfActive = item.Children?.some(child => child.Id === activeMenuID);
  
  // Highlight if the item itself is active OR if any of its children are active
  const shouldHighlight = isActive || isParentOfActive;
  
  // Determine icon source based on highlighting
  const currentIcon = shouldHighlight && item.ActiveIcon ? item.ActiveIcon : item.Icon;

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
      >
        {currentIcon && (
          <img src={currentIcon} alt={item.DisplayName} className={styles.icon} />
        )}

        <span className={styles.label}>{item.DisplayName}</span>

        {hasChildren && (
          <ChevronDown 
            className={`${styles.chevron} ${isExpanded ? styles.open : ""}`} 
          />
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className={styles.submenu}>
          {item.Children!.map(child => (
            <SidebarItem
              key={child.Id}
              item={child}
              activeMenuID={activeMenuID}
              onSelectCallback={onSelectCallback}
            />
          ))}
        </div>
      )}
    </>
  );
};

interface SideNavigationProps {
  menuData: any[]; // The raw JSON injected from parent/DB
  activeMenuID: number;
  setactiveMenuID: (id: number) => void;
  isCollapsed?: boolean; // Prop from MainLayout toggle
}

const SideNavigation: React.FC<SideNavigationProps> = ({ 
  menuData, 
  activeMenuID, 
  setactiveMenuID,
  isCollapsed = false
}) => {
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

  // Sort and format the raw menu data
  const sortedMenu: MenuItem[] = [...menuData].sort((a, b) => a.Id - b.Id);

  // Set default active if 0 or empty initially
  useEffect(() => {
    if ((!activeMenuID || activeMenuID === 0) && sortedMenu.length > 0) {
      const firstItem = sortedMenu[0];
      setactiveMenuID(firstItem.Id);
      navigate(firstItem.Path, { replace: true });
    }
  }, [sortedMenu, activeMenuID]);

  // Expand parent initially if child is active
  useEffect(() => {
    sortedMenu.forEach(parent => {
      if (parent.Children?.some(child => child.Id === activeMenuID)) {
        if (!expandedMenus.includes(parent.Id)) {
          setExpandedMenus(prev => [...prev, parent.Id]);
        }
      }
    });
  }, [activeMenuID]);

  const toggleExpand = (id: number) => {
    setExpandedMenus(prev => 
      prev.includes(id) 
        ? prev.filter(menuId => menuId !== id)
        : [...prev, id]
    );
  };

  const handleSelect = (id: number, path: string) => {
    setactiveMenuID(id);
    navigate(path);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
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

      <nav className={styles.nav}>
        {sortedMenu.map((parent) => (
          <SidebarItem
            key={parent.Id}
            item={parent}
            activeMenuID={activeMenuID}
            onSelectCallback={handleSelect}
            isExpanded={expandedMenus.includes(parent.Id)}
            onToggleExpand={() => toggleExpand(parent.Id)}
          />
        ))}
      </nav>
    </aside>
  );
};

export default SideNavigation;