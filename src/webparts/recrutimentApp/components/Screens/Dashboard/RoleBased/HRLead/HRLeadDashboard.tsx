import React from "react";
import SummaryCards from "../../DashboardComman/SummaryCards";
import PositionStatusChart from "../../DashboardComman/PositionStatusChart/PositionStatusChart";
import HRWorkflowOverview from "../../DashboardComman/HRWorkflowOverview/HRWorkflowOverview";
import UpcomingPositionsTable from "../../DashboardComman/UpcomingPositionsTable/UpcomingPositionsTable";
import styles from "../../Dashboard.module.scss";
import { motion } from "framer-motion";
import MetricDashboard from "../../../../Comman/MatricBox/matric";
import { Metric } from "../../../../../models/IDashboard";
import { useHRLeadDashboardData } from "../../Hooks/useHRLeadDashboardData";
import * as Lucide from "lucide-react";
import { metricsContainer } from "../../Dashboard";
import DepartmentChart from "../../Charts/DepartmentChart";
import ModalPopup from "../../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../../Comman/ModalPopup/useModalPopup";

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
  const { modalState, showModal, closeModal } = useModalPopup();

  const handleSuccessChangeHR = (): void => {
    showModal({
      type: "success",
      title: "Success",
      message: "HR reassigned successfully.",
      confirmLabel: "OK",
      onConfirm: closeModal,
    });
  };

  return (
    <div className={styles.dashboardContainer} aria-label="HR Lead Dashboard">
      <>
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
            <Lucide.RefreshCw size={13} className={(hrLeadLoading) ? styles.spin : undefined} />
            <span>Refresh Dashboard Data</span>
          </button>
        </div>

        <div className={styles.topDashboardGrid}>
          <SummaryCards data={hrLeadData?.HRLeadSummary} loading={hrLeadLoading} />
          <PositionStatusChart data={hrLeadData?.PositionByStatus} loading={hrLeadLoading} />
          {/* <SLADashboard /> */}
        </div>

        <div className={styles.chartsGrid2}>
          <HRWorkflowOverview data={hrLeadData?.PositionSource} loading={hrLeadLoading} />
          <DepartmentChart data={hrLeadData?.departmentPositions} loading={hrLeadLoading} />
        </div>

        <div className={styles.tableSection}>
          <UpcomingPositionsTable
            data={hrLeadData?.positionDetails}
            onRefresh={refreshHRLead}
            loading={hrLeadLoading}
            onSuccessChangeHR={handleSuccessChangeHR}
          />
        </div>
      </>
      <ModalPopup {...modalState} onClose={closeModal} />
    </div>

  );
};

export default HRLeadDashboard;
