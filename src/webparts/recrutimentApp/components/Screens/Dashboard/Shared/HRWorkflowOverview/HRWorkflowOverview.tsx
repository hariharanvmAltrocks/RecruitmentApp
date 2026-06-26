import React from "react";
import * as Lucide from "lucide-react";
import styles from "./HRWorkflowOverview.module.scss";

interface RecruiterSourceData {
  name: string;
  avatarText: string;
  avatarTheme: string;
  positionsCount: number;
  percentage: number;
  pending: number;
  done: number;
  total: number;
}

const MOCK_SOURCES: RecruiterSourceData[] = [
  {
    name: "Jiressa Positions",
    avatarText: "J",
    avatarTheme: "blue",
    positionsCount: 5,
    percentage: 36,
    pending: 5,
    done: 0,
    total: 14
  },
  {
    name: "Evoide Positions",
    avatarText: "E",
    avatarTheme: "green",
    positionsCount: 0,
    percentage: 0,
    pending: 0,
    done: 0,
    total: 14
  },
  {
    name: "Altkamoa02",
    avatarText: "A",
    avatarTheme: "purple",
    positionsCount: 0,
    percentage: 0,
    pending: 0,
    done: 0,
    total: 14
  },
  {
    name: "Altkamoa04",
    avatarText: "B",
    avatarTheme: "orange",
    positionsCount: 0,
    percentage: 0,
    pending: 0,
    done: 0,
    total: 14
  },
  {
    name: "Altkamoa09",
    avatarText: "C",
    avatarTheme: "teal",
    positionsCount: 0,
    percentage: 0,
    pending: 0,
    done: 0,
    total: 14
  }
];

export const HRWorkflowOverview: React.FC = () => {
  return (
    <div className={styles.containerCard} aria-label="Positions by Source Overview">
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>POSITIONS BY SOURCE</span>
      </div>

      {/* Grid containing the 5 cards */}
      <div className={styles.bodyGrid}>
        {MOCK_SOURCES.map((wf) => {
          const avatarClass = (styles as any)[`avatar--${wf.avatarTheme}`] || (styles as any)["avatar--blue"];
          const pctClass = (styles as any)[`pct--${wf.avatarTheme}`] || (styles as any)["pct--blue"];

          return (
            <div key={wf.name} className={styles.sourceCard}>
              {/* Header row: Avatar, metadata, percentage */}
              <div className={styles.sourceCard__header}>
                <div className={styles.sourceCard__info}>
                  <div className={`${styles.sourceCard__avatar} ${avatarClass}`}>
                    {wf.avatarText}
                  </div>
                  <div className={styles.sourceCard__meta}>
                    <span className={styles.sourceCard__name}>{wf.name}</span>
                    <span className={styles.sourceCard__subtext}>
                      {wf.positionsCount} Positions
                    </span>
                  </div>
                </div>
                <div className={`${styles.sourceCard__pct} ${pctClass}`}>
                  {wf.percentage}%
                </div>
              </div>

              {/* Metrics Grid at bottom */}
              <div className={styles.sourceCard__metrics}>
                <div className={styles.metricBox}>
                  <span className={`${styles.metricBox__val} ${styles["metricBox__val--pending"]}`}>
                    {wf.pending}
                  </span>
                  <span className={styles.metricBox__label}>Pending</span>
                </div>

                <div className={styles.metricBox}>
                  <span className={`${styles.metricBox__val} ${styles["metricBox__val--done"]}`}>
                    {wf.done}
                  </span>
                  <span className={styles.metricBox__label}>Done</span>
                </div>

                <div className={styles.metricBox}>
                  <span className={`${styles.metricBox__val} ${styles["metricBox__val--total"]}`}>
                    {wf.total}
                  </span>
                  <span className={styles.metricBox__label}>Total</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className={styles.footer}>
        <span className={styles.footerLink}>
          View all sources <Lucide.ChevronRight size={14} style={{ marginLeft: "4px" }} />
        </span>
      </div>
    </div>
  );
};

export default HRWorkflowOverview;
