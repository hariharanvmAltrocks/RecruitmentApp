import React from "react";
import SummaryCards from "../../Shared/SummaryCards/SummaryCards";
import PositionStatusChart from "../../Shared/PositionStatusChart/PositionStatusChart";
import SLADashboard from "../../Shared/SLADashboard/SLADashboard";
import HRWorkflowOverview from "../../Shared/HRWorkflowOverview/HRWorkflowOverview";
import UpcomingPositionsTable from "../../Shared/UpcomingPositionsTable/UpcomingPositionsTable";
import styles from "../../Dashboard.module.scss";

interface HRLeadDashboardProps {
  userName: string;
  roleSwitcher?: React.ReactNode;
  notificationCenter?: React.ReactNode;
}

export const HRLeadDashboard: React.FC<HRLeadDashboardProps> = ({ 
  userName,
  roleSwitcher,
  notificationCenter
}) => {
  return (
    <div className={styles.dashboardContainer} aria-label="HR Lead Dashboard">
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, <span>{userName || "altkamoa03"}</span></h1>
          <p>HR Lead Dashboard &bull; Recruitment Workflow Management</p>
        </div>
      </div>

      {/* Row 1: Unified grid containing Overview, Due, Overdue, Status, SLA */}
      <div className={styles.topDashboardGrid}>
        <SummaryCards />
        <PositionStatusChart />
        {/* <SLADashboard /> */}
      </div>

      {/* Row 2: Recruiter sources */}
      <HRWorkflowOverview />

      {/* Row 3: Positions table */}
      <div className={styles.tableSection}>
        <UpcomingPositionsTable />
      </div>
    </div>
  );
};

export default HRLeadDashboard;
