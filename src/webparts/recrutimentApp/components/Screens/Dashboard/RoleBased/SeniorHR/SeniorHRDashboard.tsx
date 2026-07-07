import React, { useMemo } from "react";
import styles from "./SeniorHRDashboard.module.scss";
import * as Lucide from "lucide-react";
import { motion } from "framer-motion";
import { Metric } from "../../../../../models/IDashboard";
import { metricsContainer } from "../../Dashboard";
import MetricDashboard from "../../../../Comman/MatricBox/matric";
import useSeniorHRDashboard from "../../Hooks/useSeniorHRDashboard";
import CommonSummaryCards from "../../DashboardComman/CommonSummaryCards";
import {
  PositionsOverviewChart,
  DepartmentDemandOverview,
  HRLeadsPerformance,
  ConflictOfInterestAlerts,
  SeniorHRTaskTable
} from "../../DashboardComman/SeniorHRComponenet/SeniorHRComponents";
import TaskTable from "../../DashboardComman/Tables/TaskTable";

interface SeniorHRDashboardProps {
  userName: string;
  metrics: Metric[];
  onCardClick: (metric: Metric) => void;
  loading: boolean;
  handleRefresh: () => void;
  active: number | string | null;
}

export const SeniorHRDashboard: React.FC<SeniorHRDashboardProps> = ({ 
  userName,
  metrics,
  onCardClick,
  loading,
  handleRefresh,
  active
}) => {
  const { data, loading: shrLoading, refresh: shrRefresh } = useSeniorHRDashboard();

  const isDashboardLoading = shrLoading;

  return (
    <div className={styles.dashboardContainer} aria-label="Senior HR Dashboard">
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
            shrRefresh();
          }}
          disabled={loading || shrLoading}
          aria-label="Refresh Dashboard Data"
        >
          <Lucide.RefreshCw size={13} className={(loading || shrLoading) ? styles.spin : undefined} />
          <span>Refresh Dashboard Data</span>
        </button>
      </div>

      <CommonSummaryCards cards={data?.summary ?? []} loading={isDashboardLoading} />

      <div className={styles.grid2}>
        <PositionsOverviewChart data={data?.monthlyTracker || []} loading={isDashboardLoading} />
        <DepartmentDemandOverview data={data?.departmentPositions || []} loading={isDashboardLoading} />
      </div>

      <div className={styles.grid2}>
        <HRLeadsPerformance data={data?.HrLeadPerformance || []} loading={isDashboardLoading} />
        <ConflictOfInterestAlerts data={data?.conflictOfInterestAlerts || []} loading={isDashboardLoading} />
      </div>
       <div className={styles.myTasksSection}>
          <SeniorHRTaskTable data={data?.tasks} loading={isDashboardLoading} />
        </div>
    </div>
  );
};

export default SeniorHRDashboard;
