import React from "react";
import styles from "./taskPattern.module.scss";
import { Metric } from "../../../models/IDashboard";

interface TaskPatternProps {
  metrics: Metric[];
  onStepClick: (metric: Metric) => void;
  activeId: number;
}

const TaskPattern: React.FC<TaskPatternProps> = ({
  metrics,
  onStepClick,
  activeId,
}) => {
  return (
    <div className={styles.roadmapWrapper}>
      {/* ── Header — static, never scrolls ──────────────────────────── */}
      <div className={styles.roadmapHeader}>
        <div className={styles.roadmapHeaderLeft}>
          <div className={styles.roadmapHeaderInner}>
            <span className={styles.roadmapDot} />
            <span className={styles.roadmapTitle}>Lifecycle Roadmap</span>
          </div>
        </div>
        <span className={styles.roadmapSubtitle}>Operational Sequence</span>
      </div>

      {/* ── Chevron track — only this scrolls ───────────────────────── */}
      <div className={styles.chevronTrack}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isActive = metric.id === activeId;
          const isLast = index === metrics.length - 1;

          return (
            <div
              key={metric.id}
              className={`${styles.chevronItem}${isActive ? ` ${styles.active}` : ""}`}
              style={
                {
                  zIndex: metrics.length - index,
                  "--step-from": metric.bgColor,
                  "--step-to": metric.color,
                } as React.CSSProperties
              }
              onClick={() => onStepClick?.(metric)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onStepClick?.(metric)}
              aria-label={`Step ${String(index + 1).padStart(2, "0")}: ${metric.label}`}
            >
              <div className={styles.chevronBody}>
                {/* Icon */}
                <div className={styles.iconBox}>
                  <Icon size={16} strokeWidth={1.8} color="#fff" />
                </div>

                {/* Text */}
                <div className={styles.stepText}>
                  <span className={styles.stepNum}>
                    STEP {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.stepLabel}>{metric.label}</span>
                </div>

                {/* Optional status badge */}
                {metric.status && (
                  <span
                    className={styles.statusBadge}
                    style={{
                      background: metric.statusBg,
                      color: metric.statusColor,
                    }}
                  >
                    {metric.status}
                  </span>
                )}

                {/* Optional value bubble */}
                {metric.value > 0 && (
                  <span className={styles.valueBubble}>{metric.value}</span>
                )}

                {/* Separator (not on last item) */}
                {!isLast && <div className={styles.separator} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskPattern;
