import React from "react";
import SummaryCards from "../../Shared/SummaryCards/SummaryCards";
import PositionStatusChart from "../../Shared/PositionStatusChart/PositionStatusChart";
import SLADashboard from "../../Shared/SLADashboard/SLADashboard";
import HRWorkflowOverview from "../../Shared/HRWorkflowOverview/HRWorkflowOverview";
import UpcomingPositionsTable from "../../Shared/UpcomingPositionsTable/UpcomingPositionsTable";
import styles from "../../Dashboard.module.scss";
import { motion } from "framer-motion";
import MetricDashboard from "../../../../Comman/MatricBox/matric";
import { Metric } from "../../../../../models/IDashboard";
import { useHRLeadDashboardData } from "../../Hooks/useHRLeadDashboardData";
import * as Lucide from "lucide-react";
import { metricsContainer } from "../../Dashboard";

interface HRLeadDashboardProps {
  userName: string;
   metrics: Metric[];
    onCardClick: (metric: Metric) => void;
    loading: boolean;
    handleRefresh: () => void;
    active: number | string | null;
}

export const HRLeadDashboard: React.FC<HRLeadDashboardProps> = ({ 
    userName,
    metrics,
    onCardClick,
    loading,
    handleRefresh,
    active
}) => {
  const { data: hrLeadData, loading: hrLeadLoading, refresh: refreshHRLead } = useHRLeadDashboardData();

  return (
    <div className={styles.dashboardContainer} aria-label="HR Lead Dashboard">
      {/* <div className={styles.headerRow}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, <span>{userName || "altkamoa03"}</span></h1>
          <p>HR Lead Dashboard &bull; Recruitment Workflow Management</p>
        </div>
      </div> */}
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
            refreshHRLead();
          }}
          disabled={loading || hrLeadLoading}
          aria-label="Refresh Dashboard"
        >
          <Lucide.RefreshCw size={13} className={(loading || hrLeadLoading) ? styles.spin : undefined} />
          <span>Refresh Dashboard Data</span>
        </button>
      </div>

      <div className={styles.topDashboardGrid}>
        <SummaryCards data={hrLeadData} loading={hrLeadLoading} />
        <PositionStatusChart data={hrLeadData?.PositionByStatus} loading={hrLeadLoading} />
        {/* <SLADashboard /> */}
      </div>

      

      <HRWorkflowOverview data={hrLeadData?.PositionSource} loading={hrLeadLoading} />

      <div className={styles.tableSection}>
        <UpcomingPositionsTable data={hrLeadData?.positionDetails} onRefresh={refreshHRLead} loading={hrLeadLoading} />
      </div>
    </div>
  );
};

export default HRLeadDashboard;
