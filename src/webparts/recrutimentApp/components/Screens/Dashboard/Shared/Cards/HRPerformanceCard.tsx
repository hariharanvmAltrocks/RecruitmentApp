import React, { useMemo } from "react";
import * as Lucide from "lucide-react";
import styles from "./Cards.module.scss";
import useContractsByHR from "../../Hooks/useContractsByHR";
import { HRWorkflow } from "../../Types";

// ─── Single Memoized HR Performance Card Component ─────────────────────────────
interface SingleHRCardProps {
  workflow: HRWorkflow;
}

export const SingleHRCard: React.FC<SingleHRCardProps> = React.memo(({ workflow }) => {
  const avatarText = useMemo(() => {
    return workflow.hrAvatar || workflow.hrName.substring(0, 2).toUpperCase();
  }, [workflow.hrAvatar, workflow.hrName]);

  return (
    <div className={styles.hrWorkflowCardItem}>
      {/* Top Row: Avatar, Name & Completion % */}
      <div className={styles.hrCardHeaderRow}>
        <div className={styles.hrCardInfo}>
          <div className={styles.hrCardAvatar}>
            {avatarText}
          </div>
          <div className={styles.hrCardMeta}>
            <span className={styles.hrCardName}>{workflow.hrName}</span>
            <span className={styles.hrCardContractsCount}>
              {workflow.assignedContracts} Contracts
            </span>
          </div>
        </div>
        <span className={styles.hrCardCompletionPercentage}>
          {workflow.completionPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className={styles.hrCardProgressBarBg}>
        <div 
          className={styles.hrCardProgressBarFill} 
          style={{ width: `${workflow.completionPercentage}%` }}
        />
      </div>

      {/* Metrics Row: Pending, Done, Total */}
      <div className={styles.hrCardMetricsRow}>
        {/* Pending */}
        <div className={styles.hrCardMetricBox}>
          <span className={`${styles.hrCardMetricVal} ${styles.valOrange}`}>
            {workflow.balance}
          </span>
          <span className={styles.hrCardMetricLabel}>Pending</span>
        </div>

        {/* Done */}
        <div className={styles.hrCardMetricBox}>
          <span className={`${styles.hrCardMetricVal} ${styles.valGreen}`}>
            {workflow.filledPositions}
          </span>
          <span className={styles.hrCardMetricLabel}>Done</span>
        </div>

        {/* Total */}
        <div className={styles.hrCardMetricBox}>
          <span className={`${styles.hrCardMetricVal} ${styles.valBlue}`}>
            {workflow.requiredPositions}
          </span>
          <span className={styles.hrCardMetricLabel}>Total</span>
        </div>
      </div>
    </div>
  );
});

// ─── Skeleton Loading Component ──────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className={`${styles.hrWorkflowCardItem} ${styles.skeletonCard}`}>
    <div className={styles.hrCardHeaderRow}>
      <div className={styles.hrCardInfo}>
        <div className={`${styles.hrCardAvatar} ${styles.skeletonPulse}`} />
        <div className={styles.hrCardMeta} style={{ width: "80px" }}>
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ height: "12px", width: "100%" }} />
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ height: "8px", width: "60%", marginTop: "4px" }} />
        </div>
      </div>
      <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ height: "14px", width: "30px" }} />
    </div>
    <div className={`${styles.hrCardProgressBarBg} ${styles.skeletonPulse}`} style={{ marginTop: "16px", height: "6px" }} />
    <div className={styles.hrCardMetricsRow} style={{ marginTop: "16px" }}>
      <div className={styles.hrCardMetricBox}><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ height: "16px", width: "20px", margin: "0 auto" }} /></div>
      <div className={styles.hrCardMetricBox}><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ height: "16px", width: "20px", margin: "0 auto" }} /></div>
      <div className={styles.hrCardMetricBox}><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ height: "16px", width: "20px", margin: "0 auto" }} /></div>
    </div>
  </div>
);

// ─── Props Interface ─────────────────────────────────────────────────────────
interface HRPerformanceCardProps {
  workflow?: HRWorkflow;
}

// ─── Main Component Export ───────────────────────────────────────────────────
export const HRPerformanceCard: React.FC<HRPerformanceCardProps> = ({ workflow }) => {
  // If workflow is passed directly, act as a single card (backwards compatibility)
  if (workflow) {
    return <SingleHRCard workflow={workflow} />;
  }

  // Otherwise, render the entire HR Workflow Overview grid container
  const { data: workflows, loading, error, refresh } = useContractsByHR();

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.hrWorkflowGrid}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.hrWorkflowErrorState}>
          <Lucide.AlertCircle size={40} className={styles.errorIcon} />
          <p className={styles.errorText}>Failed to load HR performance workflows.</p>
          <button className={styles.retryBtn} onClick={refresh}>
            <Lucide.RotateCw size={12} style={{ marginRight: "4px" }} /> Retry
          </button>
        </div>
      );
    }

    if (!workflows || workflows.length === 0) {
      return (
        <div className={styles.hrWorkflowEmptyState}>
          <Lucide.Users size={48} className={styles.emptyIcon} />
          <p className={styles.emptyText}>No HR assignments available.</p>
        </div>
      );
    }

    return (
      <div className={styles.hrWorkflowGrid}>
        {workflows.map((wf, idx) => (
          <SingleHRCard key={wf.hrName || idx} workflow={wf} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.hrWorkflowContainerCard}>
      {/* Card Header */}
      <div className={styles.hrWorkflowHeader}>
        <div className={styles.hrWorkflowTitleGroup}>
          <div className={styles.hrWorkflowTitleRow}>
            <span className={styles.hrWorkflowDot} aria-hidden="true" />
            <h2 className={styles.hrWorkflowTitle}>HR Workflow Overview</h2>
          </div>
          <p className={styles.hrWorkflowSubtitle}>Track HR contract assignments</p>
        </div>
      </div>

      {/* Card Body */}
      <div className={styles.hrWorkflowBody}>
        {renderContent()}
      </div>

      {/* Card Footer */}
      <div className={styles.hrWorkflowFooter}>
        <span className={styles.viewAllLink}>
          View all HR assignments <Lucide.ArrowRight size={14} style={{ marginLeft: "4px" }} />
        </span>
      </div>
    </div>
  );
};

export default HRPerformanceCard;
