import React, { useMemo } from "react";
import useContractAllocation from "../../Hooks/useContractAllocation";
import styles from "../../Dashboard.module.scss";
import * as Lucide from "lucide-react";

interface LineManagerDashboardProps {
  userName: string;
  roleSwitcher?: React.ReactNode;
  notificationCenter?: React.ReactNode;
}

export const LineManagerDashboard: React.FC<LineManagerDashboardProps> = ({ 
  userName,
}) => {

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.headerRow}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, <span>{userName}</span></h1>
          <p>Line Manager Console • Interview Evaluations & Approvals</p>
        </div>
        <div className={styles.actionsSection}>
          <button className={styles.actionButton}>
            <Lucide.CalendarClock size={14} />
            My Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
export default LineManagerDashboard;
