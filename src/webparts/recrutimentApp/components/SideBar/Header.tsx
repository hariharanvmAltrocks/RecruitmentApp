import * as React from "react";
import { useState } from "react";
import { Icons } from "./Sidebar";
import { getPageTitle } from "../../models/sidebar";

interface HeaderProps {
  activePath: string;
  userName?: string;
  userRole?: string;
  department?: string;
  isExpanded: boolean;
  onToggleSidebar: () => void;
  onMobileMenuOpen: () => void;
}
export const Header: React.FC<HeaderProps> = ({
  activePath,
  userName = "Sarah Jenkins",
  userRole = "Recruitment Lead",
  department,
  isExpanded,
  onToggleSidebar,
  onMobileMenuOpen,
}) => {
  const [showNotif, setShowNotif] = useState(false);

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const crumbs = activePath
    .split("/")
    .filter(Boolean)
    .map((seg) => seg.replace(/([A-Z])/g, " $1").trim());

  const pageTitle = getPageTitle(activePath);

  return (
    <header className="
      h-12 bg-white border-b border-slate-200
      flex items-center justify-between
      px-4 sm:px-5
      flex-shrink-0 relative z-30
    ">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-1.5 rounded-lg text-slate-400
            hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Open navigation"
        >
          {Icons.menu}
        </button>

        {/* Desktop collapse/expand toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400
            hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? Icons.collapseLeft : Icons.expandRight}
        </button>

        {/* Divider */}
        <div className="hidden sm:block h-4 w-px bg-slate-200" />

        {/* Page title + breadcrumb */}
        <div className="hidden sm:flex flex-col">
          <h2 className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-none">
            {pageTitle}
          </h2>
          {crumbs.length > 0 && (
            <nav className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] text-slate-400">Home</span>
              {crumbs.map((c, i) => (
                <React.Fragment key={i}>
                  <span className="text-[9px] text-slate-300">/</span>
                  <span className={`text-[9px] ${i === crumbs.length - 1
                    ? "text-slate-600 font-bold"
                    : "text-slate-400"}`}>
                    {c}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        {/* Mobile: just show page title */}
        <span className="sm:hidden text-[13px] font-bold text-slate-800">
          {pageTitle}
        </span>
      </div>

      {/* ── Right ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif((p) => !p)}
            className="relative p-1.5 rounded-full text-slate-400
              hover:text-[#597b98] hover:bg-slate-50 transition-colors"
            aria-label="Notifications"
          >
            {Icons.bell}
            {/* Unread dot */}
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
          </button>

          {/* Notification dropdown */}
          {showNotif && (
            <div className="
              absolute right-0 top-full mt-2 w-64
              bg-white rounded-xl shadow-xl border border-slate-100
              py-2 z-50
            ">
              <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase
                border-b border-slate-100">
                Notifications
              </p>
              {[
                { title: "New CV uploaded",       time: "2 min ago",  dot: "bg-blue-400"  },
                { title: "Interview scheduled",   time: "1 hr ago",   dot: "bg-green-400" },
                { title: "Offer letter approved", time: "3 hrs ago",  dot: "bg-amber-400" },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer">
                  <span className={`w-1.5 h-1.5 rounded-full ${n.dot} mt-1.5 flex-shrink-0`} />
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">{n.title}</p>
                    <p className="text-[9px] text-slate-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200" />

        {/* User info + avatar */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-[11px] font-bold text-slate-900 leading-none mb-0.5">
              {userName}
            </p>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              {userRole}
            </p>
            {department && (
              <p className="text-[8px] text-slate-400 truncate max-w-[120px]">{department}</p>
            )}
          </div>
          <div className="
            w-7 h-7 rounded-full
            bg-gradient-to-tr from-[#597b98] to-[#4a90c4]
            flex items-center justify-center
            text-white text-[9px] font-bold
            border border-white shadow-sm
            transition-transform duration-150 group-hover:scale-105
            flex-shrink-0
          ">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};