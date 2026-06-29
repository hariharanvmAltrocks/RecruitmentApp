import React, { useEffect, useRef, useState } from "react";
import styles from "./Statusbadge.module.scss";

export type VerificationState = "done" | "pending" | "warning";

export interface VerificationStep {
  id: string;
  name: string;
  sub: string;
  state: VerificationState;
}

interface StatusBadgeProps {
  steps: VerificationStep[];
}

const DoneIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 8 6.5 11.5 13 4.5" />
  </svg>
);

const PendingIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.7"
    strokeLinecap="round"
  >
    <circle cx="8" cy="8" r="5.5" />
    <path d="M8 5.5v3l1.5 1.5" />
  </svg>
);

const WarningIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke={color}
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2.5L14 13H2L8 2.5z" />
    <path d="M8 7v3M8 11.5v.5" />
  </svg>
);

const ICON_MAP: Record<VerificationState, React.ReactNode> = {
  done: <DoneIcon color="#1D9E75" />,
  pending: <PendingIcon color="#7C8BAA" />,
  warning: <WarningIcon color="#BA7517" />,
};

const BADGE_LABEL: Record<VerificationState, string> = {
  done: "Verified",
  pending: "Pending",
  warning: "Rejected",
};

const INFO_ICON = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    stroke="#7C8BAA"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 5v4M8 11v.5" />
  </svg>
);

const CIRCUMFERENCE = 113;

const StatusBadge: React.FC<StatusBadgeProps> = ({ steps }) => {
  const [open, setOpen] = useState(false);
  const [animated, setAnimated] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const doneCount = steps.filter((s) => s.state === "done").length;
  const total = steps.length;
  const ringOffset = CIRCUMFERENCE - (doneCount / total) * CIRCUMFERENCE;

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !animated) setAnimated(true);
  };

  return (
    <div className={styles.root} ref={panelRef}>
      {/* ── Trigger button ── */}
      <button
        className={styles.triggerBtn}
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* animated ring */}
        <div className={styles.ringWrap}>
          <svg className={styles.ringSvg} viewBox="0 0 44 44">
            <circle className={styles.ringBg} cx="22" cy="22" r="18" />
            <circle
              className={`${styles.ringFill} ${animated ? styles.ringAnimated : ""}`}
              cx="22"
              cy="22"
              r="18"
              style={{
                strokeDashoffset: animated ? ringOffset : CIRCUMFERENCE,
              }}
            />
          </svg>
          <span className={styles.ringCount}>
            {doneCount}/{total}
          </span>
        </div>

        <div className={styles.triggerText}>
          <span className={styles.triggerLabel}>Verification Status</span>
          <span className={styles.triggerSub}>
            {doneCount} of {total} complete
          </span>
        </div>

        {/* chevron */}
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Drop-down panel ── */}
      <div
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-label="Verification checklist"
      >
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Verification checklist</span>
          <span className={styles.panelCountPill}>
            {doneCount} / {total} done
          </span>
        </div>

        <div className={styles.stepList}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              {/* connector line between steps */}
              {idx > 0 && (
                <div
                  className={`${styles.connector} ${steps[idx - 1].state === "done" ? styles.connectorDone : ""}`}
                />
              )}

              <div className={styles.stepItem}>
                {/* icon bubble */}
                <div
                  className={`${styles.stepIcon} ${styles[`stepIcon_${step.state}`]} ${animated ? styles.stepIconAnimate : ""}`}
                  style={{ animationDelay: `${idx * 0.08 + 0.1}s` }}
                >
                  {ICON_MAP[step.state]}
                </div>

                <div className={styles.stepInfo}>
                  <div className={styles.stepName}>{step.name}</div>
                  <div className={styles.stepSub}>{step.sub}</div>
                </div>

                <span
                  className={`${styles.stepBadge} ${styles[`badge_${step.state}`]}`}
                >
                  {BADGE_LABEL[step.state]}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className={styles.panelFooter}>
          {INFO_ICON}
          Pending steps require document upload
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;
