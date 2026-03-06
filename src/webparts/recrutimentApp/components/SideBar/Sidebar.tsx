import * as React from "react";
import { useCallback, useState } from "react";
import { ChildMenuItem, MenuItem } from "../../models/sidebar";



export const Icons = {
  building: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  search: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
    </svg>
  ),
  person: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  document: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
    </svg>
  ),
  chart: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  ),
  menu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  close: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  collapseLeft: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  ),
  expandRight: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
};

const MENU_ICON_MAP: Record<string, React.ReactNode> = {
  "Selection Process":   Icons.search,
  "Recruitment Process": Icons.person,
  "Onboarding":          Icons.document,
  "Reports":             Icons.chart,
};

const getMenuIcon = (name: string) => MENU_ICON_MAP[name] ?? Icons.document;

const ChildItem: React.FC<{
  child: ChildMenuItem;
  parent: MenuItem;
  isActive: boolean;
  isLast: boolean;
  isExpanded: boolean;
  onClick: (path: string, child: ChildMenuItem, parent: MenuItem) => void;
}> = ({ child, parent, isActive, isLast, isExpanded, onClick }) => {
  if (!isExpanded) return null;
  return (
    <div className="flex items-stretch">
      {/* Tree connector lines */}
      <div className="flex flex-col items-center mr-2 ml-1 flex-shrink-0" style={{ minWidth: 14 }}>
        <div className={`w-px bg-slate-200 ${isLast ? "h-3" : "flex-1"}`} style={{ minHeight: 12 }} />
        <div className="w-2.5 h-px bg-slate-200" />
        {!isLast && <div className="w-px flex-1 bg-slate-200" />}
      </div>

      <button
        onClick={() => onClick(child.Path, child, parent)}
        className={`
          flex items-center gap-2 flex-1 py-1.5 px-2 my-0.5 rounded-lg
          text-left text-xs font-medium transition-all duration-150 border border-transparent
          ${isActive
            ? "bg-[#597b98]/12 text-[#2c5170] font-semibold border-[#597b98]/15"
            : "text-slate-500 hover:bg-slate-50 hover:text-[#3a6080]"
          }
        `}
      >
        <span className={`
          w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-150
          ${isActive ? "bg-[#597b98]" : "bg-slate-300"}
        `} />
        <span className="flex-1 leading-snug truncate">{child.DisplayName}</span>
        {child.TabDetails?.length > 0 && (
          <span className={`
            text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
            ${isActive ? "bg-[#597b98] text-white" : "bg-slate-100 text-slate-400"}
          `}>
            {child.TabDetails.length}
          </span>
        )}
      </button>
    </div>
  );
};

// ─── Top-level menu item ──────────────────────────────────────────────────────

const TopMenuItem: React.FC<{
  item: MenuItem;
  activePath: string;
  activeChildId: number | null;
  isExpanded: boolean;
  onMenuClick: (path: string, item: MenuItem) => void;
  onChildClick: (path: string, child: ChildMenuItem, parent: MenuItem) => void;
}> = ({ item, activePath, activeChildId, isExpanded, onMenuClick, onChildClick }) => {
  const hasChildren   = item.Children?.length > 0;
  const isParentActive =
    activePath === item.Path ||
    item.Children?.some((c) => c.Id === activeChildId);

  const [open, setOpen] = useState(isParentActive);

  const handleClick = useCallback(() => {
    if (hasChildren) setOpen((p) => !p);
    onMenuClick(item.Path, item);
  }, [hasChildren, item, onMenuClick]);

  return (
    <div className="mb-0.5">
      <button
        onClick={handleClick}
        title={!isExpanded ? item.DisplayName : undefined}
        className={`
          relative flex items-center w-full rounded-xl
          transition-all duration-150 group
          ${isExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5"}
          ${isParentActive
            ? "bg-[#597b98]/15 text-[#2c5170]"
            : "text-slate-500 hover:bg-slate-50 hover:text-[#2c5170]"
          }
        `}
      >
        {/* Active left stripe */}
        {isParentActive && (
          <span className="absolute left-0 top-[20%] h-[60%] w-0.5 rounded-r bg-[#597b98]" />
        )}

        {/* Icon */}
        <span className={`
          flex-shrink-0 transition-colors duration-150
          ${isParentActive ? "text-[#597b98]" : "text-slate-400 group-hover:text-[#597b98]"}
        `}>
          {item.ActiveIcon && isParentActive
            ? <img src={item.ActiveIcon} alt="" className="w-4 h-4 object-contain" />
            : item.Icon
              ? <img src={item.Icon} alt="" className="w-4 h-4 object-contain opacity-60" />
              : getMenuIcon(item.DisplayName)
          }
        </span>

        {/* Label */}
        {isExpanded && (
          <span className="flex-1 text-left text-[13px] font-semibold tracking-tight leading-tight truncate">
            {item.DisplayName}
          </span>
        )}

        {/* Chevron */}
        {isExpanded && hasChildren && (
          <span className={`
            flex-shrink-0 text-slate-300 transition-transform duration-200
            ${open ? "rotate-90" : "rotate-0"}
          `}>
            {Icons.chevronRight}
          </span>
        )}

        {/* Collapsed active dot */}
        {!isExpanded && isParentActive && (
          <span className="absolute right-1.5 top-1.5 w-1 h-1 rounded-full bg-[#597b98]" />
        )}
      </button>

      {/* Children */}
      {hasChildren && open && isExpanded && (
        <div className="pl-3 pt-0.5 pb-1">
          {[...item.Children]
            .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0))
            .map((child, idx) => (
              <ChildItem
                key={child.Id}
                child={child}
                parent={item}
                isActive={activeChildId === child.Id}
                isLast={idx === item.Children.length - 1}
                isExpanded={isExpanded}
                onClick={onChildClick}
              />
            ))}
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarInternalProps {
  menuData: MenuItem[];
  activePath: string;
  activeChildId: number | null;
  isExpanded: boolean;
  isMobileOpen: boolean;
  onMenuClick: (path: string, item: MenuItem) => void;
  onChildClick: (path: string, child: ChildMenuItem, parent: MenuItem) => void;
  onMobileClose: () => void;
}

const SidebarPanel: React.FC<{ isExpanded: boolean; children: React.ReactNode }> = ({ isExpanded, children }) => (
  <div className={`
    flex flex-col h-full bg-white border-r border-slate-100
    transition-all duration-300 ease-in-out overflow-hidden
    ${isExpanded ? "w-60" : "w-16"}
  `}>
    {children}
  </div>
);

const SidebarContent: React.FC<{
  menuData: MenuItem[];
  activePath: string;
  activeChildId: number | null;
  isExpanded: boolean;
  onMenuClick: (path: string, item: MenuItem) => void;
  onChildClick: (path: string, child: ChildMenuItem, parent: MenuItem) => void;
}> = ({ menuData, activePath, activeChildId, isExpanded, onMenuClick, onChildClick }) => {
  const sorted = [...menuData].sort((a, b) => a.Sort - b.Sort);

  return (
    <>
      {/* Brand */}
      <div className={`
        flex items-center border-b border-slate-100 flex-shrink-0
        ${isExpanded ? "gap-3 px-4 py-4" : "justify-center px-0 py-4"}
      `}>
        <div className="w-8 h-8 rounded-lg bg-[#597b98] flex items-center justify-center flex-shrink-0 shadow-sm">
          {Icons.building}
          {/* override icon color to white */}
          <style>{`.sidebar-logo svg { color: white !important; }`}</style>
        </div>
        {isExpanded && (
          <div className="min-w-0 overflow-hidden">
            <p className="text-[13px] font-bold text-slate-800 leading-tight truncate">Kamoa Copper SA</p>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide truncate">HRMS Portal</p>
          </div>
        )}
      </div>

      {/* Section label */}
      {isExpanded && (
        <div className="px-4 pt-3.5 pb-1.5 flex-shrink-0">
          <span className="text-[9px] font-bold text-slate-400 tracking-[1.5px] uppercase">
            Navigation
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-px">
        {sorted.map((item) => (
          <TopMenuItem
            key={item.Id}
            item={item}
            activePath={activePath}
            activeChildId={activeChildId}
            isExpanded={isExpanded}
            onMenuClick={onMenuClick}
            onChildClick={onChildClick}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className={`
        border-t border-slate-100 py-3 flex-shrink-0
        ${isExpanded ? "px-4" : "flex justify-center"}
      `}>
        {isExpanded
          ? <p className="text-[10px] text-slate-400 font-medium">Version 1.3</p>
          : <span className="w-1.5 h-1.5 rounded-full bg-slate-300 block" />
        }
      </div>
    </>
  );
};

export const Sidebar: React.FC<SidebarInternalProps> = ({
  menuData, activePath, activeChildId, isExpanded,
  isMobileOpen, onMenuClick, onChildClick, onMobileClose,
}) => (
  <>
    {/* Mobile backdrop */}
    <div
      onClick={onMobileClose}
      className={`
        fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden
        ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    />

    {/* Mobile drawer */}
    <aside className={`
      fixed top-0 left-0 h-full z-50 w-64 shadow-2xl transition-transform duration-300 md:hidden
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      <div className="flex flex-col h-full bg-white">
        {/* Close button */}
        <button
          onClick={onMobileClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center
            rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          {Icons.close}
        </button>
        <SidebarContent
          menuData={menuData} activePath={activePath} activeChildId={activeChildId}
          isExpanded={true} onMenuClick={onMenuClick} onChildClick={onChildClick}
        />
      </div>
    </aside>

    {/* Desktop sticky sidebar */}
    <aside className="hidden md:block h-screen sticky top-0 flex-shrink-0">
      <SidebarPanel isExpanded={isExpanded}>
        <SidebarContent
          menuData={menuData} activePath={activePath} activeChildId={activeChildId}
          isExpanded={isExpanded} onMenuClick={onMenuClick} onChildClick={onChildClick}
        />
      </SidebarPanel>
    </aside>
  </>
);