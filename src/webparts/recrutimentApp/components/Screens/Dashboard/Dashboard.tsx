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
import { menuID } from "../../../utilities/ConditionConfig";
import DepartmentChart from "../../Comman/Departmentchart/Departmentchart";
import useDepartmentChart from "./Hooks/Usedepartmentchart";
import * as strings from 'RecrutimentAppWebPartStrings';
import { useRoleContext } from "../../../utilities/hooks/RoleContext";

interface DashboardProps {
  props: any;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [activeMetric, setActiveMetric] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const { MatricData } = useRoleContext();
   
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
    if (MatricData.length > 0 && !activeMetric) {
      setActiveMetric(MatricData[0].id);
      setNavigationPath(MatricData[0].path);
      ref.current = MatricData[0].menuId;
      // setActiveMenuID(MatricData[0].menuId);
      setActiveTab(MatricData[0].TabValue);
      setCurrentTabName(MatricData[0].TabName);
      setMatricID(MatricData[0].id);
    }
  }, [MatricData]);

  const onMetricChange = (data: MetricConfig) => {
    setActiveMetric(data.id);
    setNavigationPath(data.path);
    setActiveMenuID(menuID.Mytracker);
    ref.current = data.menuId;
    setActiveTab(data.TabValue);
    setCurrentTabName(data.TabName);
    setMatricID(data.id);
    navigate("/MyTracker");
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveMetric(0);
  };

  const loading =
    MatricData.length === 0;
  const hasMetrics = MatricData && MatricData.length > 0;

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
                  {strings.NoDashboardMetricsAvailable}</div>
                <div className="dashboard-empty__subtitle">
                  {strings.PleaseCheckYourPermissionsOrTryAgainLate}</div>
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
                    metrics={MatricData}
                    onCardClick={(metric) => onMetricChange(metric)}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    active={activeMetric}
                  />
                </motion.div>

                <div className="dashboard-layout">
                  <DepartmentChart
                    itemsPerPage={7}
                    title={strings.DepartmentalDemand}
                    subtitle={strings.PendingLifecycle}
                    tooltipValueLabel="Openings"
                  />
                  {/* <div className="tracker-panel">
                    <Tracker
                      rows={trackerData}
                      selectedMetric={selectedMetric}
                      activeMetric={activeMetric}
                      onRowClick={(row: any) => onTrackerChange(row)}
                    />
                  </div>

                  <div className="priority-panel">
                    <PriorityWidget data={priorityData} total={total} />
                  </div> */}

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
