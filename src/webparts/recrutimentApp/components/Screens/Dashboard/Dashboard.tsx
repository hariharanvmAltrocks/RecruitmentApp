import React, { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Dashboard.scss";
import { useRoleContext } from "../../../utilities/hooks/RoleContext";
import Loading from "../../Comman/Loading/loading";

import HRLeadDashboard from "./RoleBased/HRLead/HRLeadDashboard";
import HRDashboard from "./RoleBased/HR/HRDashboard";
import LineManagerDashboard from "./RoleBased/LineManager/LineManagerDashboard";

import NotificationCenter from "./Common/NotificationCenter";
import { RoleID } from "../../../utilities/Config";
import { MetricConfig } from "../../../models/IDashboard";
import { menuID } from "../../../utilities/ConditionConfig";
import { useNavigate } from "react-router-dom";
import { useUIState } from "../../RecrutimentApp/UIStateContext";

interface DashboardProps {
  props: any;
}
  export const metricsContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };


const Dashboard: React.FC<DashboardProps> = (props) => {
  const { userRole, userName, isLoading, ADGroupData, roleIDs } = useRoleContext();
 
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


  
  const initialRole = useMemo(() => {
    if (!roleIDs || roleIDs.length === 0) return RoleID.RecruitmentHRLead;
    if (roleIDs.includes(RoleID.RecruitmentHRLead)) return RoleID.RecruitmentHRLead;
    if (roleIDs.includes(RoleID.RecruitmentHR)) return RoleID.RecruitmentHR;
    if (roleIDs.includes(RoleID.HOD))  return RoleID.HOD;
    if (roleIDs.includes(RoleID.LineManager)) return RoleID.LineManager;
    return  RoleID.RecruitmentHRLead;
  }, [userRole]);

  const [activeRole, setActiveRole] = useState<number>(initialRole);

  // const userEmail = useMemo(() => {
  //   return ADGroupData?.EmailId?.[0] || `${userName.toLowerCase().replace(/\s+/g, ".")}@kamoacopper.com`;
  // }, [ADGroupData, userName]);

  if (isLoading) {
    return <Loading />;
  }

  const renderActiveDashboard = () => {
    switch (activeRole) {
      // case "Admin":
      //   return (
      //     <AdminDashboard 
      //       userName={userName} 
      //       roleSwitcher={renderRoleSwitcher} 
      //       notificationCenter={renderNotificationCenter} 
      //     />
      //   );
      case RoleID.RecruitmentHRLead:
        return (
          <HRLeadDashboard 
            userName={userName} 
             metrics={MatricData}
                    onCardClick={(metric) => onMetricChange(metric)}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    active={activeMetric}
          />
        );
      case RoleID.RecruitmentHR:
        return (
          <HRDashboard 
            userName={userName} 
             metrics={MatricData}
                    onCardClick={(metric) => onMetricChange(metric)}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    active={activeMetric}
          />
        );
      case RoleID.HOD:
        return (
          <LineManagerDashboard 
            userName={userName} 
          />
        );
      case RoleID.LineManager:
        return (
          <LineManagerDashboard 
            userName={userName} 
          />
        );
      
      default:
        return (
         <HRLeadDashboard 
             userName={userName} 
             metrics={MatricData}
                    onCardClick={(metric) => onMetricChange(metric)}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    active={activeMetric}
          />
        );
    }
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
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          {renderActiveDashboard()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
