import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Dashboard.scss";
import { useRoleContext } from "../../../utilities/hooks/RoleContext";
import Loading from "../../Comman/Loading/loading";

// Sub-dashboards
import AdminDashboard from "./RoleBased/Admin/AdminDashboard";
import HRLeadDashboard from "./RoleBased/HRLead/HRLeadDashboard";
import HRDashboard from "./RoleBased/HR/HRDashboard";
import DepartmentManagerDashboard from "./RoleBased/DepartmentManager/DepartmentManagerDashboard";
import LineManagerDashboard from "./RoleBased/LineManager/LineManagerDashboard";
import CandidateDashboard from "./RoleBased/Candidate/CandidateDashboard";

// Helpers
import RoleSwitcher from "./Common/RoleSwitcher";
import NotificationCenter from "./Common/NotificationCenter";
import { RoleID } from "../../../utilities/Config";

interface DashboardProps {
  props: any;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { userRole, userName, isLoading, ADGroupData, roleIDs } = useRoleContext();

  const initialRole = useMemo(() => {
    if (!roleIDs || roleIDs.length === 0) return RoleID.RecruitmentHRLead;
    if (roleIDs.includes(RoleID.RecruitmentHRLead)) return RoleID.RecruitmentHRLead;
    if (roleIDs.includes(RoleID.RecruitmentHR)) return RoleID.RecruitmentHR;
    if (roleIDs.includes(RoleID.HOD))  return RoleID.HOD;
    if (roleIDs.includes(RoleID.LineManager)) return RoleID.LineManager;
    return  RoleID.RecruitmentHRLead;
  }, [userRole]);

  const [activeRole, setActiveRole] = useState<number>(initialRole);

  const userEmail = useMemo(() => {
    return ADGroupData?.EmailId?.[0] || `${userName.toLowerCase().replace(/\s+/g, ".")}@kamoacopper.com`;
  }, [ADGroupData, userName]);

  if (isLoading) {
    return <Loading />;
  }

  // const renderRoleSwitcher = (
  //   <RoleSwitcher currentRole={activeRole} onRoleChange={setActiveRole} />
  // );

  const renderNotificationCenter = (
    <NotificationCenter />
  );

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
            notificationCenter={renderNotificationCenter} 
          />
        );
      case RoleID.RecruitmentHR:
        return (
          <HRDashboard 
            userName={userName} 
            notificationCenter={renderNotificationCenter} 
          />
        );
      case RoleID.HOD:
        return (
          <DepartmentManagerDashboard 
            userName={userName} 
            notificationCenter={renderNotificationCenter} 
          />
        );
      case RoleID.LineManager:
        return (
          <LineManagerDashboard 
            userName={userName} 
            notificationCenter={renderNotificationCenter} 
          />
        );
      
      default:
        return (
          <AdminDashboard 
            userName={userName} 
            notificationCenter={renderNotificationCenter} 
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
