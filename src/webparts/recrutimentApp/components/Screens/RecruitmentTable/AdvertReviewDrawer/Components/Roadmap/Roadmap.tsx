import React from "react";
import { Check } from "lucide-react";
import styles from "./Roadmap.module.scss";
import { CandidateProgress } from "../CandidateProgress/CandidateProgress";
import {
  getStageIndex,
  stages,
} from "../../../../../../utilities/PositionStatusConfig";

interface RoadmapProps {
  statusId: number;
}

export const Roadmap: React.FC<RoadmapProps> = ({ statusId }) => {
  const currentStageIndex = getStageIndex(statusId);
  const activeStatusLabel =
    stages[currentStageIndex]?.label || "Unknown Status";

  return (
    <div className={styles.roadmapContainer}>
      {/* 1. Recruitment Lifecycle Roadmap (Top Section) */}
      <div className={styles.lifecycleCard}>
        <div className={styles.headerRow}>
          <div className={styles.title}>
            <div className={styles.accentBar} />
            Recruitment Lifecycle Roadmap
          </div>
          <div className={styles.statusBadge}>
            <div className={styles.dot} />
            Active Status: {activeStatusLabel}
          </div>
        </div>

        <div className={styles.stepperContainer}>
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index < currentStageIndex;
            const isActive = index === currentStageIndex;

            let iconClass = styles.iconContainer;
            if (isCompleted)
              iconClass += ` ${styles["iconContainer--completed"]}`;
            else if (isActive)
              iconClass += ` ${styles["iconContainer--active"]}`;

            // Prevent green line extending past the last completed node if next is active
            const isLastCompletedBeforeActive =
              isCompleted && index === currentStageIndex - 1;
            if (isLastCompletedBeforeActive) {
              iconClass += ` ${styles["no-line"]}`;
            }

            let nameClass = styles.stageName;
            if (isCompleted) nameClass += ` ${styles["stageName--completed"]}`;
            else if (isActive) nameClass += ` ${styles["stageName--active"]}`;

            return (
              <div key={index} className={styles.stageWrapper}>
                <div className={iconClass}>
                  {isActive && <div className={styles.ripple} />}
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} />
                  ) : (
                    <Icon size={20} strokeWidth={2.5} />
                  )}
                </div>

                <div className={styles.labelContainer}>
                  <span className={nameClass}>{stage.label}</span>
                  {isCompleted && (
                    <span className={styles.statusText}>Done</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Candidate Progress Table (Bottom Section) */}
      {/* <CandidateProgress /> */}
    </div>
  );
};
