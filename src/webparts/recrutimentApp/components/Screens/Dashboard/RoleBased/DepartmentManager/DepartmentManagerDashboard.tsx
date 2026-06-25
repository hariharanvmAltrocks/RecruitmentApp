import React, { useMemo } from "react";
import useContractAllocation from "../../Hooks/useContractAllocation";
import KPICard from "../../Shared/Cards/KPICard";
import GaugeChart from "../../Shared/Charts/GaugeChart";
import ContractAllocationTable from "../../Shared/Tables/ContractAllocationTable";
import styles from "../../Dashboard.module.scss";
import * as Lucide from "lucide-react";

interface DepartmentManagerDashboardProps {
  userName: string;
  roleSwitcher?: React.ReactNode;
  notificationCenter?: React.ReactNode;
}

export const DepartmentManagerDashboard: React.FC<DepartmentManagerDashboardProps> = ({ 
  userName,
  roleSwitcher,
  notificationCenter
}) => {
  const { data: allContracts, loading } = useContractAllocation();

  // Contextual department matching (Louis Barend belongs to Technology in the screenshots)
  const departmentName = "TECHNOLOGY";

  // Filter department contracts
  const deptContracts = useMemo(() => {
    if (!allContracts) return [];
    return allContracts.filter(c => c.department.toLowerCase() === departmentName.toLowerCase());
  }, [allContracts]);

  // Aggregate metrics
  const stats = useMemo(() => {
    let req = 0;
    let filled = 0;
    let candidates = 0;
    let slaSum = 0;

    deptContracts.forEach(c => {
      req += c.requiredPositions;
      filled += c.filledPositions;
      candidates += c.candidateCount;
      slaSum += c.slaProgress;
    });

    const avgSla = deptContracts.length > 0 ? Math.round(slaSum / deptContracts.length) : 0;

    return {
      requestsCount: deptContracts.length,
      required: req,
      filled,
      balance: req - filled,
      candidates,
      avgSla,
      pendingApprovals: 2
    };
  }, [deptContracts]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, <span>{userName}</span></h1>
          <p>Department Manager Dashboard • <span>{departmentName}</span> Division</p>
        </div>
        <div className={styles.actionsSection}>
          {roleSwitcher}
          {notificationCenter}
          <button className={styles.actionButton}>
            <Lucide.FilePlus size={14} />
            Raise Headcount request
          </button>
        </div>
      </div>

      {/* Approvals Warning Bar */}
      {stats.pendingApprovals > 0 && (
        <div className={styles.alertBar} style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a", color: "#b45309" }}>
          <span className={styles.alertBadge} style={{ backgroundColor: "#f59e0b" }}>Approvals</span>
          <span>PENDING: You have {stats.pendingApprovals} recruitment requisition requests awaiting your HOD approval signature.</span>
          <Lucide.FileSignature size={14} style={{ marginLeft: "auto" }} />
        </div>
      )}

      {/* Dept KPIs */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Department Requests"
          value={loading ? "..." : stats.requestsCount}
          iconName="FileSpreadsheet"
          iconTheme="blue"
        />
        <KPICard
          title="Pending HOD Approval"
          value={loading ? "..." : stats.pendingApprovals}
          iconName="FileCheck"
          iconTheme="orange"
        />
        <KPICard
          title="Total Vacancies"
          value={loading ? "..." : stats.required}
          iconName="Briefcase"
          iconTheme="purple"
        />
        <KPICard
          title="Filled Positions"
          value={loading ? "..." : stats.filled}
          iconName="CheckCircle"
          iconTheme="green"
        />
        <KPICard
          title="Open Headcount"
          value={loading ? "..." : stats.balance}
          iconName="HelpCircle"
          iconTheme="gray"
        />
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid2}>
        {/* Dept SLA Gauge */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.Gauge size={16} style={{ color: "#ea580c" }} />
              Department SLA Status
            </h2>
          </div>
          {loading ? (
            <div style={{ height: "220px", display: "flex", alignItems: "center", justifyItems: "center" }}>Loading SLA...</div>
          ) : (
            <GaugeChart value={stats.avgSla} label={`${departmentName} SLA`} />
          )}
        </div>

        {/* Dept Recruitment Progress */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.ListTodo size={16} style={{ color: "#10b981" }} />
              Recruitment Progress Summary
            </h2>
          </div>
          <div className={styles.candidateMetaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Required Requisitions</span>
              <span className={styles.metaVal}>{stats.required} Positions</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Filled (Onboarded)</span>
              <span className={styles.metaVal}>{stats.filled} Candidates</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Recruitment Progress</span>
              <span className={styles.metaVal}>
                {stats.required > 0 ? Math.round((stats.filled / stats.required) * 100) : 0}% Completed
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Assigned Candidates</span>
              <span className={styles.metaVal}>{stats.candidates} Applicants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table */}
      <div className={styles.tableSection}>
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.TableProperties size={16} style={{ color: "#2563eb" }} />
              Department Vacancy Summary
            </h2>
          </div>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading department database...</div>
          ) : (
            <ContractAllocationTable contracts={deptContracts} />
          )}
        </div>
      </div>
    </div>
  );
};
export default DepartmentManagerDashboard;
