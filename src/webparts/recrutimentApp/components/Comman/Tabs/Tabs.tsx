
import React from "react";
import "./Tabs.scss";

export interface Tab<K extends string = string> {
  key: K;
  label: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface TabsProps<K extends string = string> {
  tabs: Tab<K>[];
  activeKey: K;
  onChange: (tab: Tab<K>) => void;
  loading?: boolean;
  loadingCount?: number;
  variant?: "underline" | "pill" | "boxed";
  className?: string;
}

function SkeletonTab() {
  return <span className="tabs__skeleton" aria-hidden="true" />;
}

export function Tabs<K extends string = string>({
  tabs,
  activeKey,
  onChange,
  loading = false,
  loadingCount = 3,
  variant = "underline",
  className = "",
}: TabsProps<K>) {
  return (
    <div
      className={`tabs tabs--${variant} ${className}`.trim()}
      role="tablist"
      aria-busy={loading}
    >
      {loading
        ? Array.from({ length: loadingCount }).map((_, i) => (
            <SkeletonTab key={i} />
          ))
        : tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              type="button"
              aria-selected={tab.key === activeKey}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              className={[
                "tabs__tab",
                tab.key === activeKey ? "tabs__tab--active" : "",
                tab.disabled ? "tabs__tab--disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => !tab.disabled && onChange(tab)}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span className="tabs__badge">{tab.badge}</span>
              )}
            </button>
          ))}
    </div>
  );
}

export default Tabs;