import React from "react";
import useKPICards from "../../Hooks/useKPICards";
import useContractsByEndDate from "../../Hooks/useContractsByEndDate";
import useUpcomingContracts from "../../Hooks/useUpcomingContracts";
import useSLACompliance from "../../Hooks/useSLACompliance";
import KPICard from "../../Shared/Cards/KPICard";
import DonutChart from "../../Shared/Charts/DonutChart";
import GaugeChart from "../../Shared/Charts/GaugeChart";
import HRPerformanceCard from "../../Shared/Cards/HRPerformanceCard";
import UpcomingContractsTable from "../../Shared/Tables/UpcomingContractsTable";
import styles from "../../Dashboard.module.scss";
import * as Lucide from "lucide-react";
import DepartmentChart from "../../../../Comman/Departmentchart/Departmentchart";
import strings from "RecrutimentAppWebPartStrings";

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
  const { data: kpis } = useKPICards();
  const { data: donutData, loading: loadingDonut } = useContractsByEndDate();
  const { data: upcomingContracts, loading: loadingUpcoming } = useUpcomingContracts();
  const { data: slaStats, loading: loadingSla } = useSLACompliance();

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, <span>{userName}</span></h1>
          <p>HR Lead Dashboard • Recruitment Workflow Management</p>
        </div>
        {/* <div className={styles.actionsSection}>
          {roleSwitcher}
          {notificationCenter}
          <button className={styles.actionButton}>
            <Lucide.FileSpreadsheet size={14} />
            Export SLA Report
          </button>
        </div> */}
      </div>

      {/* Urgent Action Bar */}
      {/* <div className={styles.alertBar}>
        <span className={styles.alertBadge}>Review</span>
        <span>OVERDUE ACTION: 3 contracts are overdue by assigned HR team members. Click to view SLA escalations.</span>
        <Lucide.ArrowRight size={14} style={{ marginLeft: "auto" }} />
      </div> */}

      {/* KPIs Row */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Total Positions"
          value="64"
          iconName="TrendingUp"
          iconTheme="blue"
          // footerText="View HR breakdown"
        />
        <KPICard
          title="Active Positions"
          value={kpis?.assignedContracts || 92}
          iconName="FileText"
          iconTheme="purple"
          // footerText="View assignments"
        />
        <KPICard
          title="Due This Month"
          value="25 / 92"
          iconName="CheckCircle2"
          iconTheme="green"
          // footerText="View SLA status"
        />
        <KPICard
          title="Overdue Positions"
          value={kpis?.overdueContracts || 8}
          iconName="AlertCircle"
          iconTheme="red"
          // footerText="View escalations"
        />
        <KPICard
          title="Complete Position"
          value={kpis?.candidates || 184}
          iconName="Users"
          iconTheme="gray"
          // footerText="View candidate tracker"
        />
         <KPICard
          title="Total Recrutiment HR"
          value={kpis?.candidates || 184}
          iconName="Users"
          iconTheme="gray"
          // footerText="View candidate tracker"
        />
      </div>

      {/* Charts section */}
      <div className={styles.chartsGrid3}>

         {/* Department Chart */}
        <DepartmentChart
                    itemsPerPage={6}
                    title={strings.DepartmentalDemand}
                    subtitle={strings.PendingLifecycle}
                    tooltipValueLabel="Openings"
                  />

               
                  
        {/* End Date Status */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.CalendarClock size={16} style={{ color: "#3b82f6" }} />
              Contracts by End Date Status
            </h2>
          </div>
          {loadingDonut || !donutData ? (
            <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading chart...</div>
          ) : (
            <DonutChart data={donutData} />
          )}
        </div>

        {/* SLA gauge */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.Gauge size={16} style={{ color: "#ea580c" }} />
              SLA Dashboard
            </h2>
          </div>
          {loadingSla || !slaStats ? (
            <div style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading SLA gauge...</div>
          ) : (
            <GaugeChart value={slaStats.overallSla} />
          )}
        </div>
      </div>

      {/* HR Workflow Overview */}
      <HRPerformanceCard />
      

      {/* Upcoming & Overdue Table */}
      <div className={styles.tableSection}>
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.AlertTriangle size={16} style={{ color: "#ef4444" }} />
              Upcoming & Overdue Contracts
            </h2>
          </div>
          {loadingUpcoming || !upcomingContracts ? (
            <div style={{ padding: "30px", textAlign: "center" }}>Loading alert database...</div>
          ) : (
            <UpcomingContractsTable contracts={upcomingContracts} />
          )}
        </div>
      </div>
    </div>
  );
};
export default HRLeadDashboard;
