import React, { FC } from "react";
import "./Prechecklist.modules.scss";
import { IChecklistItem } from "../../Hooks/fetchPreChecklist";

// ── Icons ────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2.5,8.5 6,12 13.5,4.5" />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="4" y1="4" x2="12" y2="12" />
    <line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const PlaneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChecklistSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: IChecklistItem[];
  onToggle: (
    // type: "national" | "expat" | "common",
    id: number,
    value: boolean,
  ) => void;
}

interface PreChecklistProps {
  nationalItems: IChecklistItem[];
  expatItems: IChecklistItem[];
  isExpat: boolean;
  onToggle: (id: number, value: boolean) => void;
  allChecked: boolean;
}

// ── ChecklistSection ──────────────────────────────────────────────────────────

const ChecklistSection: FC<ChecklistSectionProps> = ({
  title,
  subtitle,
  icon,
  items,
  onToggle,
}) => {
  const checkedCount = items.filter((i) => i.value === true).length;
  const total = items.length;
  const allDone = checkedCount === total && total > 0;
  const progressWidth = total > 0 ? `${(checkedCount / total) * 100}%` : "0%";

  return (
    <div className="prechecklist__section">
      {/* Header */}
      <div className="prechecklist__section-header">
        <div className="prechecklist__section-icon">{icon}</div>
        <div className="prechecklist__section-info">
          <p className="prechecklist__section-title">{title}</p>
          <p className="prechecklist__section-subtitle">{subtitle}</p>
        </div>
        <div
          className={`prechecklist__section-badge${allDone ? " prechecklist__section-badge--complete" : ""}`}
        >
          {checkedCount}/{total} done
        </div>
      </div>

      {/* Progress bar */}
      <div className="prechecklist__progress-bar">
        <div
          className="prechecklist__progress-bar-fill"
          style={
            {
              width: progressWidth,
              "--progress-width": progressWidth,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Items */}
      <div className="prechecklist__list">
        {items.map((item) => (
          <div
            key={item.ID}
            className={`prechecklist__item${
              item.value === true
                ? " prechecklist__item--yes"
                : item.value === false
                  ? " prechecklist__item--no"
                  : ""
            }`}
          >
            {/* Avatar */}
            <div className="prechecklist__avatar">
              <span>{item.Initials}</span>
            </div>

            {/* Label */}
            <div className="prechecklist__item-body">
              <span className="prechecklist__item-label">{item.Title}</span>
              <span className="prechecklist__item-id">ID: {item.ID}</span>
            </div>

            {/* Toggle buttons */}
            <div className="prechecklist__toggle-group">
              <button
                className={`prechecklist__toggle-btn prechecklist__toggle-btn--yes${
                  item.value === true ? " prechecklist__toggle-btn--active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(item.ID, true);
                }}
                type="button"
                aria-pressed={item.value === true}
              >
                <span className="prechecklist__toggle-icon">
                  <CheckIcon />
                </span>
                Yes
              </button>

              <button
                className={`prechecklist__toggle-btn prechecklist__toggle-btn--no${
                  item.value === false
                    ? " prechecklist__toggle-btn--active"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(item.ID, false);
                }}
                type="button"
                aria-pressed={item.value === false}
              >
                <span className="prechecklist__toggle-icon">
                  <XIcon />
                </span>
                No
              </button>
            </div>

            {/* Status dot */}
            <div
              className={`prechecklist__status-dot${
                item.value === true
                  ? " prechecklist__status-dot--yes"
                  : item.value === false
                    ? " prechecklist__status-dot--no"
                    : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── PreChecklist (main export) ────────────────────────────────────────────────

const PreChecklist: FC<PreChecklistProps> = ({
  nationalItems,
  expatItems,
  isExpat,
  onToggle,
  allChecked,
}) => {
  const allItems = isExpat ? [...nationalItems, ...expatItems] : nationalItems;
  const totalChecked = allItems.filter((i) => i.value === true).length;
  const total = allItems.length;

  return (
    <div className="prechecklist">
      {/* National section — always shown */}
      <ChecklistSection
        title="Onboarding Prechecklist"
        subtitle="Mandatory pre-hire checks"
        icon={<ShieldIcon />}
        items={nationalItems}
        onToggle={onToggle}
      />

      {/* Expat section — only for expat candidates */}
      {/* {isExpat && (
        <ChecklistSection
          title="Expat Requirements"
          subtitle="International relocation tasks"
          icon={<PlaneIcon />}
          items={expatItems}
          onToggle={onToggle}
        />
      )} */}

      {/* Summary */}
      <div className="prechecklist__summary">
        <div
          className={`prechecklist__summary-icon${allChecked ? " prechecklist__summary-icon--complete" : ""}`}
        >
          {allChecked ? <CheckIcon /> : <ClipboardIcon />}
        </div>
        <div className="prechecklist__summary-text">
          <span className="prechecklist__summary-label">
            {allChecked ? "All requirements met!" : "Checklist in progress"}
          </span>
          <span className="prechecklist__summary-desc">
            {allChecked
              ? "You can now submit this candidate for review."
              : "Complete all items above to enable submission."}
          </span>
        </div>
        <div
          className={`prechecklist__summary-count${allChecked ? " prechecklist__summary-count--complete" : ""}`}
        >
          {totalChecked}
          <span>/{total}</span>
        </div>
      </div>
    </div>
  );
};

export default PreChecklist;
