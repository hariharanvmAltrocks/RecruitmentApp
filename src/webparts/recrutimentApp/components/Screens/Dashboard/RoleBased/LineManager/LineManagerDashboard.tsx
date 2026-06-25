import React, { useMemo } from "react";
import useContractAllocation from "../../Hooks/useContractAllocation";
import KPICard from "../../Shared/Cards/KPICard";
import ContractAllocationTable from "../../Shared/Tables/ContractAllocationTable";
import styles from "../../Dashboard.module.scss";
import * as Lucide from "lucide-react";

interface LineManagerDashboardProps {
  userName: string;
  roleSwitcher?: React.ReactNode;
  notificationCenter?: React.ReactNode;
}

export const LineManagerDashboard: React.FC<LineManagerDashboardProps> = ({ 
  userName,
  roleSwitcher,
  notificationCenter
}) => {
  const { data: contracts, loading } = useContractAllocation();

  // Filter department contracts for LM context
  const lmContracts = useMemo(() => {
    if (!contracts) return [];
    return contracts.filter(c => c.department === "TECHNOLOGY" || c.department === "MINING OPERATIONS");
  }, [contracts]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, <span>{userName}</span></h1>
          <p>Line Manager Console • Interview Evaluations & Approvals</p>
        </div>
        <div className={styles.actionsSection}>
          {roleSwitcher}
          {notificationCenter}
          <button className={styles.actionButton}>
            <Lucide.CalendarClock size={14} />
            My Calendar
          </button>
        </div>
      </div>

      {/* Urgent actions bar */}
      <div className={styles.alertBar} style={{ backgroundColor: "#fef3c7", borderColor: "#fde68a", color: "#92400e" }}>
        <span className={styles.alertBadge} style={{ backgroundColor: "#d97706" }}>Action</span>
        <span>INTERVIEW FEEDBACK DUE: You have 2 candidate scorecards pending your technical review for Underground Shift Supervisor.</span>
        <Lucide.ArrowRight size={14} style={{ marginLeft: "auto" }} />
      </div>

      {/* KPIs Row */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Pending Interviews"
          value="3"
          iconName="Calendar"
          iconTheme="blue"
          footerText="View schedule"
        />
        <KPICard
          title="Candidate Reviews"
          value="4"
          iconName="FileCheck"
          iconTheme="purple"
          footerText="Open evaluations"
        />
        <KPICard
          title="Offer Approvals"
          value="1"
          iconName="PenTool"
          iconTheme="orange"
          footerText="Review offers"
        />
        <KPICard
          title="Open Requisitions"
          value="2"
          iconName="Briefcase"
          iconTheme="green"
          footerText="View details"
        />
      </div>

      {/* Middle Layout */}
      <div className={styles.chartsGrid2}>
        {/* Interview Calendar */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.CalendarDays size={16} style={{ color: "#3b82f6" }} />
              Interview Calendar
            </h2>
          </div>
          <div className={styles.timelineContainer}>
            <div className={`${styles.timelineItem} ${styles.timelineActive}`}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <div>
                  <span className={styles.timelineTitle}>Level 1 Interview: Marie-Claire Mwamba</span>
                  <p className={styles.timelineDesc}>Position: Underground Shift Supervisor (UND-101)</p>
                </div>
                <span className={styles.timelineDate}>Today, 02:30 PM</span>
              </div>
            </div>
            <div className={`${styles.timelineItem} ${styles.timelineOnhold}`}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <div>
                  <span className={styles.timelineTitle}>Level 2 Panel Assessment: John Doe</span>
                  <p className={styles.timelineDesc}>Position: Mobile App Specialist (1013-CT-14-016)</p>
                </div>
                <span className={styles.timelineDate}>June 28, 10:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.History size={16} style={{ color: "#10b981" }} />
              Recent Activities
            </h2>
          </div>
          <div className={styles.timelineContainer}>
            <div className={`${styles.timelineItem} ${styles.timelineCompleted}`}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <div>
                  <span className={styles.timelineTitle}>Submitted Scorecard: Jean Kabongo</span>
                  <p className={styles.timelineDesc}>Gave 82% score for Safety Officer L1 interview.</p>
                </div>
                <span className={styles.timelineDate}>Yesterday</span>
              </div>
            </div>
            <div className={`${styles.timelineItem} ${styles.timelineCompleted}`}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <div>
                  <span className={styles.timelineTitle}>Approved Job Advert Requisition</span>
                  <p className={styles.timelineDesc}>Approved job specs for IT Support Services Phase II.</p>
                </div>
                <span className={styles.timelineDate}>3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Requisitions Table */}
      <div className={styles.tableSection}>
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.Layers size={16} style={{ color: "#2563eb" }} />
              My Department Vacancies
            </h2>
          </div>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading requisitions...</div>
          ) : (
            <ContractAllocationTable contracts={lmContracts} />
          )}
        </div>
      </div>
    </div>
  );
};
export default LineManagerDashboard;
