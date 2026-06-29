import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Dashboard.scss";
import { useDashboardMetrics } from "./Hooks/useDashboardMetrics";
import { useTrackerData } from "./Hooks/usetrackerdata";
import Tracker from "../../Comman/Tracker/Tracker";
import PriorityWidget from "../../Comman/PriorityWidget/PriorityWidget";
import UrgentWidget from "../../Comman/UrgentWidget/UrgentWidget";
import { useUrgentTasks } from "./Hooks/useUrgentTasks";
import { priorityValues, totalPriority } from "./metricColumns.config";
import { useNavigate } from "react-router";
import { DashboardData } from "../../../services/Dashboard/IDashboard";
import { MetricConfig } from "../../../models/IDashboard";
import { useUIState } from "../../RecrutimentApp/UIStateContext";
import MetricDashboard from "../../Comman/MatricBox/matric";
import Loading from "../../Comman/Loading/loading";

interface DashboardProps {
  props: any;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [activeMetric, setActiveMetric] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const martics = useDashboardMetrics(refreshKey);
  const { trackerData, loading: trackerLoading } = useTrackerData(
    activeMetric,
    refreshKey,
  );
  const { urgentTasks, loading: urgentLoading } = useUrgentTasks(refreshKey);

  const navigate = useNavigate();
  const {
    setActiveMenuID,
    setNavigationPath,
    setActiveTab,
    navigationPath,
    setMatricID,
    setCurrentTabName,
  } = useUIState();

  const ref = useRef(0);

  useEffect(() => {
    if (martics.metrics.length > 0 && !activeMetric) {
      setActiveMetric(martics.metrics[0].id);
      setNavigationPath(martics.metrics[0].path);
      ref.current = martics.metrics[0].menuId;
      // setActiveMenuID(martics.metrics[0].menuId);
      setActiveTab(martics.metrics[0].TabValue);
      setCurrentTabName(martics.metrics[0].TabName);
      setMatricID(martics.metrics[0].id);
    }
  }, [martics.metrics]);

  const onMetricChange = (data: MetricConfig) => {
    setActiveMetric(data.id);
    setNavigationPath(data.path);
    // setActiveMenuID(data.menuId);
    ref.current = data.menuId;
    setActiveTab(data.TabValue);
    setCurrentTabName(data.TabName);
    setMatricID(data.id);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveMetric(0);
  };

  const selectedMetric =
    martics.metrics.find((m) => m.id === activeMetric) ?? martics.metrics[0];
  const priorityData = priorityValues(martics.metrics);
  const total = totalPriority(martics.metrics);
  const loading =
    martics.loading ||
    trackerLoading ||
    urgentLoading ||
    martics.metrics.length === 0;
  const hasMetrics = martics.metrics && martics.metrics.length > 0;

  const onTrackerChange = (row: DashboardData) => {
    if (selectedMetric?.showArrow) {
      setActiveMenuID(ref.current);
      navigate(navigationPath);
    }
  };

  const metricsContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const metricItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      className="dashboard"
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {loading ? (
          // <DashboardSkeleton key="dashboard-skeleton" />
          <Loading />
        ) : (
          <motion.div
            key="dashboard-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!hasMetrics ? (
              <div className="dashboard-empty">
                <div className="dashboard-empty__title">
                  No dashboard metrics available
                </div>
                <div className="dashboard-empty__subtitle">
                  Please check your permissions or try again later.
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  className="metrics-grid"
                  variants={metricsContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <MetricDashboard
                    metrics={martics.metrics}
                    onCardClick={(metric) => onMetricChange(metric)}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    active={activeMetric}
                  />
                </motion.div>

                <div className="dashboard-layout">
                  <div className="tracker-panel">
                    <Tracker
                      rows={trackerData}
                      selectedMetric={selectedMetric}
                      activeMetric={activeMetric}
                      onRowClick={(row: any) => onTrackerChange(row)}
                    />
                  </div>

                  <div className="priority-panel">
                    <PriorityWidget data={priorityData} total={total} />
                  </div>

                  {/* <div className="urgent-panel">
                    <UrgentWidget tasks={urgentTasks} />
                  </div> */}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
