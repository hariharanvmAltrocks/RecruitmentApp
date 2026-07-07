import React from "react";
import * as Lucide from "lucide-react";
import styles from "./HRDashboard.module.scss";
import useHRDashboard from "../../Hooks/useHRDashboard"
import PositionTrackerChart from "../../Charts/PositionTrackerChart";
import DepartmentChart from "../../Charts/DepartmentChart";
import CandidatePipelineChart from "../../Charts/CandidatePipelineChart";
import { motion } from "framer-motion";
import MetricDashboard from "../../../../Comman/MatricBox/matric";
import { metricsContainer } from "../../Dashboard";
import { Metric } from "../../../../../models/IDashboard";
import HRSummaryCards from "../../DashboardComman/HRSummaryCards";
import TaskTable from "../../DashboardComman/Tables/TaskTable";
import CommonSummaryCards from "../../DashboardComman/CommonSummaryCards";

interface HRDashboardProps {
  userName: string;
     metrics: Metric[];
      onCardClick: (metric: Metric) => void;
      loading: boolean;
      handleRefresh: () => void;
      active: number | string | null;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({ 
   userName,
    metrics,
    onCardClick,
    loading,
    handleRefresh,
    active
}) => {
  const { data, loading:HRLoading, error, refresh:hrRefresh } = useHRDashboard();

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Lucide.AlertCircle size={40} className={styles.errorIcon} />
        <h2>Failed to load HR Dashboard</h2>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button className={styles.retryBtn} onClick={hrRefresh}>
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
        <motion.div
                  className="metrics-grid"
                  variants={metricsContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <MetricDashboard
                    metrics={metrics}
                    onCardClick={(metric) => onCardClick(metric)}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    active={active}
                  />
                </motion.div>

                <div className={styles.refreshToolbar}>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={() => {
            handleRefresh();
            hrRefresh();
          }}
          disabled={loading || HRLoading}
          aria-label="Refresh Dashboard"
        >
          <Lucide.RefreshCw size={13} className={(loading || HRLoading) ? styles.spin : undefined} />
          <span>Refresh Dashboard Data</span>
        </button>
      </div>

      <div className={styles.summarySection}>
        {/* <HRSummaryCards summary={data?.summary} loading={loading} /> */}
        <CommonSummaryCards cards={data?.summary ?? []} loading={HRLoading} />
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.gridItem}>
          <PositionTrackerChart data={data?.monthlyTracker} loading={HRLoading} />
        </div>
        <div className={styles.gridItem}>
          <DepartmentChart data={data?.departmentPositions} loading={HRLoading} />
        </div>
        <div className={styles.gridItem}>
          <CandidatePipelineChart data={data?.candidatePipeline} loading={HRLoading} />
        </div>
       
      </div>
       <div className={styles.myTasksSection}>
          <TaskTable data={data?.tasks} loading={HRLoading} />
        </div>
    </div>
  );
};

export default HRDashboard;
