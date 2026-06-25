import React from "react";
import useKPICards from "../../Hooks/useKPICards";
import useContractsByEndDate from "../../Hooks/useContractsByEndDate";
import useContractAllocation from "../../Hooks/useContractAllocation";
import KPICard from "../../Shared/Cards/KPICard";
import DonutChart from "../../Shared/Charts/DonutChart";
import LineAreaChart from "../../Shared/Charts/LineAreaChart";
import HRPerformanceCard from "../../Shared/Cards/HRPerformanceCard";
import ContractAllocationTable from "../../Shared/Tables/ContractAllocationTable";
import styles from "../../Dashboard.module.scss";
import * as Lucide from "lucide-react";

interface AdminDashboardProps {
  userName: string;
  roleSwitcher?: React.ReactNode;
  notificationCenter?: React.ReactNode;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  userName,
  roleSwitcher,
  notificationCenter
}) => {
  const { data: kpis, loading: loadingKpi } = useKPICards();
  const { data: donutData, loading: loadingDonut } = useContractsByEndDate();
  const { data: contracts, loading: loadingContracts } = useContractAllocation();

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, <span>{userName}</span></h1>
          <p>System Administrator Dashboard • Kamoa Copper HRMS Portal</p>
        </div>
        <div className={styles.actionsSection}>
          {roleSwitcher}
          {notificationCenter}
          <button className={styles.actionButton}>
            <Lucide.RefreshCw size={14} />
            Sync System
          </button>
        </div>
      </div>

      {/* Urgent Action Bar */}
      <div className={styles.alertBar}>
        <span className={styles.alertBadge}>Urgent</span>
        <span>SYSTEM UPDATE: 1 approval request is pending in department mining operations. Click here to process.</span>
        <Lucide.ArrowRight size={14} style={{ marginLeft: "auto" }} />
      </div>

      {/* KPI Cards Row */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Total Positions"
          value={loadingKpi ? "..." : kpis?.assignedContracts || 92}
          iconName="FileText"
          iconTheme="purple"
          footerText="View all contracts"
        />
        <KPICard
          title="Active Positions"
          value={loadingKpi ? "..." : 68}
          iconName="ClipboardCheck"
          iconTheme="blue"
          footerText="View active"
        />
        <KPICard
          title="Due This Month"
          value={loadingKpi ? "..." : kpis?.upcomingSLA || 11}
          iconName="Calendar"
          iconTheme="orange"
          footerText="View upcoming"
        />
        <KPICard
          title="Overdue Positions"
          value={loadingKpi ? "..." : kpis?.overdueContracts || 8}
          iconName="AlertCircle"
          iconTheme="red"
          footerText="View overdue"
        />
        <KPICard
          title="Completed"
          value={loadingKpi ? "..." : 16}
          iconName="CheckCircle2"
          iconTheme="green"
          footerText="View completed"
        />
        <KPICard
          title="Total Recrutiment HR"
          value={loadingKpi ? "..." : 14}
          iconName="Users"
          iconTheme="gray"
          footerText="View all HRs"
        />
      </div>

      {/* Charts section */}
      <div className={styles.chartsGrid3}>
        {/* Contracts by End Date Status */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.PieChart size={16} style={{ color: "#3b82f6" }} />
              Positions By End Date Status
            </h2>
            {/* <span className={styles.viewAllLink}>View full report</span> */}
          </div>
          {loadingDonut || !donutData ? (
            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8125rem", color: "#64748b" }}>Loading chart data...</div>
          ) : (
            <DonutChart data={donutData} />
          )}
        </div>

        {/* Contracts ending over time */}
        {/* <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.AreaChart size={16} style={{ color: "#10b981" }} />
              Contracts Ending Over Time
            </h2>
            <span className={styles.viewAllLink}>View timeline</span>
          </div>
          <LineAreaChart />
        </div> */}

      </div>

      {/* HR Workflow Overview */}
      <HRPerformanceCard />

      {/* Bottom allocation grid */}
      <div className={styles.tableSection}>
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.LayoutGrid size={16} style={{ color: "#2563eb" }} />
              Positions Allocation Table
            </h2>
          </div>
          {loadingContracts || !contracts ? (
            <div style={{ padding: "40px", textAlign: "center", fontSize: "0.8125rem", color: "#64748b" }}>Loading allocation database...</div>
          ) : (
            <ContractAllocationTable contracts={contracts} />
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
