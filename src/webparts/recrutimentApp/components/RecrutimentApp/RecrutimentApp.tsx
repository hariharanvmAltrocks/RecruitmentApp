import * as React from "react";
import { useCallback, useState } from "react";
import { Sidebar } from "../SideBar/Sidebar";
import { Header } from "../SideBar/Header";
import { IRecrutimentAppProps } from "../../models/recruitmentapp";
import { ChildMenuItem, MOCK_MENU } from "../../models/sidebar";

export default function RecrutimentApp(props:IRecrutimentAppProps) {
  // ── Sidebar state ──────────────────────────────────────────────────────────
  const [isExpanded,   setIsExpanded]   = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ── Navigation state ───────────────────────────────────────────────────────
  const [activePath,    setActivePath]    = useState("/RecurimentProcess");
  const [activeChildId, setActiveChildId] = useState<number | null>(30);

  const handleToggleSidebar = useCallback(() => setIsExpanded((p) => !p), []);
  const handleMobileOpen    = useCallback(() => setIsMobileOpen(true), []);
  const handleMobileClose   = useCallback(() => setIsMobileOpen(false), []);

  const handleMenuClick = useCallback((path: string) => {
    setActivePath(path);
    setActiveChildId(null);
    setIsMobileOpen(false);
  }, []);

  const handleChildClick = useCallback((path: string, child: ChildMenuItem) => {
    setActivePath(path);
    setActiveChildId(child.Id);
    setIsMobileOpen(false);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">

      <Sidebar
        menuData={MOCK_MENU}
        activePath={activePath}
        activeChildId={activeChildId}
        isExpanded={isExpanded}
        isMobileOpen={isMobileOpen}
        onMenuClick={handleMenuClick}
        onChildClick={handleChildClick}
        onMobileClose={handleMobileClose}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          activePath={activePath}
          userName="Sarah Jenkins"
          userRole="Recruitment Lead"
          department="Human Resources"
          isExpanded={isExpanded}
          onToggleSidebar={handleToggleSidebar}
          onMobileMenuOpen={handleMobileOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="max-w-5xl mx-auto space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Active Route
              </p>
              <p className="text-lg font-bold text-[#2c5170]">{activePath}</p>
              {activeChildId !== null && (
                <p className="text-xs text-slate-400 mt-0.5">Child ID: {activeChildId}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Background Verification", "Offer Letter", "Interview Panel"].map((label) => (
                <div key={label}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-bold text-slate-700">{label}</p>
                    <span className="text-[9px] font-bold bg-[#597b98]/10 text-[#597b98] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#597b98] to-[#4a90c4] rounded-full"
                      style={{ width: `${Math.random() * 60 + 30}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">3 pending actions</p>
                </div>
              ))}
            </div>

            {/* Table placeholder */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[12px] font-bold text-slate-700">Recent Applications</p>
                <span className="text-[9px] font-bold text-[#597b98] cursor-pointer hover:underline">
                  View all
                </span>
              </div>
              {["Alice Mwamba", "John Kabila", "Grace Mutombo", "David Ilunga"].map((name, i) => (
                <div key={name}
                  className={`flex items-center gap-3 px-5 py-3 border-b border-slate-50 last:border-0
                    ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#597b98]/60 to-[#4a90c4]/60
                    flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
                    {name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <p className="flex-1 text-[11px] font-semibold text-slate-700">{name}</p>
                  <span className="text-[9px] text-slate-400">Applied today</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}