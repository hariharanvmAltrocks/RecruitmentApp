import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./MyTracker.module.scss";
import { useNavigate } from "react-router";
import { useTrackerData } from "../Hooks/usetrackerdata";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import Loading from "../../../Comman/Loading/loading";
import MetricDashboard from "../../../Comman/MatricBox/matric";
import Tracker from "../../../Comman/Tracker/Tracker";
import { useDashboardMetrics } from "../Hooks/useDashboardMetrics";
import { DashboardData } from "../../../../services/Dashboard/IDashboard";
import { MetricConfig } from "../../../../models/IDashboard";

interface DashboardProps {
  props: any;
}

const Mytracker: React.FC<DashboardProps> = (props) => {
  const { MatricID: activeMetric } = useUIState();
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const { trackerData, loading: trackerLoading } = useTrackerData(
    activeMetric,
    refreshKey,
  );

  const martics = useDashboardMetrics(refreshKey);

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
      // setActiveMetric(martics.metrics[0].id);
      setNavigationPath(martics.metrics[0].path);
      ref.current = martics.metrics[0].menuId;
      // setActiveMenuID(martics.metrics[0].menuId);
      setActiveTab(martics.metrics[0].TabValue);
      setCurrentTabName(martics.metrics[0].TabName);
      setMatricID(martics.metrics[0].id);
    }
  }, [martics.metrics]);

  const onMetricChange = (data: MetricConfig) => {
    // setActiveMetric(data.id);
    setNavigationPath(data.path);
    // setActiveMenuID(data.menuId);
    ref.current = data.menuId;
    setActiveTab(data.TabValue);
    setCurrentTabName(data.TabName);
    setMatricID(data.id);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    // setActiveMetric(0);
  };

  const selectedMetric =
    martics.metrics.find((m) => m.id === activeMetric) ?? martics.metrics[0];

  const loading =
    martics.loading || trackerLoading || martics.metrics.length === 0;
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
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Mytracker;
