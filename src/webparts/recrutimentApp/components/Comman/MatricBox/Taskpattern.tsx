import React from "react";
import styles from "./taskPattern.module.scss";
import { Metric } from "../../../models/IDashboard";
import * as strings from 'RecrutimentAppWebPartStrings';
import { motion } from "framer-motion";

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
            <span className={styles.roadmapTitle}>{strings.LifecycleRoadmap}</span>
          </div>
        </div>
        {/* <span className={styles.roadmapSubtitle}>{strings.OperationalSequence}</span> */}
      </div>

      {/* ── Chevron track — only this scrolls ───────────────────────── */}
      <div
        className={styles.chevronTrack}
        style={
          {
            "--metrics-count": metrics.length,
          } as React.CSSProperties
        }
      >
        {metrics.map((metric, index) => {
          const slug =
    metric.id?.toString() ?? metric.label.toLowerCase().replace(/\s+/g, "_");
  const Icon = metric.icon 
  const color = metric.color 

  return (
    <motion.div
      className={styles.oversightStat}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2 }}
      onClick={() => onStepClick(metric)}
    >
      <div className={styles.oversightStatTop}>
        <div className={styles.oversightStatIconWrap}>
          <Icon size={16} style={{ color }} strokeWidth={2.5} />
        </div>
        <span className={styles.oversightStatNum}>
          {metric.value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className={styles.oversightStatLabel}>
        {metric.label.toUpperCase()}
      </span>
    </motion.div>
  );
        })}
      </div>
    </div>
  );
};

export default TaskPattern;
