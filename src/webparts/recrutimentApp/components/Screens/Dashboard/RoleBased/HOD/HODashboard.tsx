import React, { useMemo } from "react";
import styles from "./HODashboard.module.scss";
import * as Lucide from "lucide-react";
import { motion } from "framer-motion";
import { Metric } from "../../../../../models/IDashboard";
import { metricsContainer } from "../../Dashboard";
import MetricDashboard from "../../../../Comman/MatricBox/matric";
import useHODashboard from "../../Hooks/useHODahboard";
import CommonSummaryCards from "../../DashboardComman/CommonSummaryCards";
import {
  DepartmentPositionsTrend,
  PositionsJobRole,
  TeamSummary,
  TeamStatus,
  MyApprovals
} from "../../DashboardComman/HODComponenet/HODComponents";
import PositionStatusChart from "../../DashboardComman/PositionStatusChart/PositionStatusChart";
import TaskTable from "../../DashboardComman/Tables/TaskTable";
import { PositionTrackerChart } from "../../Charts/PositionTrackerChart";

interface HODashboardProps {
  userName: string;
  metrics: Metric[];
  onCardClick: (metric: Metric) => void;
  loading: boolean;
  handleRefresh: () => void;
  active: number | string | null;
}

export const HODashboard: React.FC<HODashboardProps> = ({ 
  userName,
  metrics,
  onCardClick,
  loading,
  handleRefresh,
  active
}) => {
  const { data, loading: hodLoading, refresh: hodRefresh } = useHODashboard();

  const isDashboardLoading = loading || hodLoading;

  return (
    <div className={styles.dashboardContainer} aria-label="HOD Dashboard">
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
            hodRefresh();
          }}
          disabled={loading || hodLoading}
          aria-label="Refresh Dashboard Data"
        >
          <Lucide.RefreshCw size={13} className={(loading || hodLoading) ? styles.spin : undefined} />
          <span>Refresh Dashboard Data</span>
        </button>
      </div>

      <CommonSummaryCards cards={data?.summary ?? []} loading={isDashboardLoading} />

      <div className={styles.grid2}>
        <PositionTrackerChart data={data?.monthlyTracker ?? []} loading={isDashboardLoading} />
        <PositionsJobRole data={data?.positionsJobRole ?? []} loading={isDashboardLoading} />
      </div>

      <div className={styles.grid3}>
        <TeamSummary data={data?.HRSummary ?? []} loading={isDashboardLoading} />
        <PositionStatusChart data={data?.PositionStatus ?? null} loading={isDashboardLoading} />
        <MyApprovals data={data?.MyApprovals ?? []} loading={isDashboardLoading} />
      </div>
       <div className={styles.myTasksSection}>
          <TaskTable data={data?.tasks} loading={loading} />
        </div>
    </div>
  );
};

export default HODashboard;
