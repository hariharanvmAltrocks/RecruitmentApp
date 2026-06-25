import React, { useMemo } from "react";
import useContractAllocation from "../../Hooks/useContractAllocation";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import styles from "./HRDashboard.module.scss";
import * as Lucide from "lucide-react";

interface HRDashboardProps {
  userName: string;
  roleSwitcher?: React.ReactNode;
  notificationCenter?: React.ReactNode;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({ 
  userName,
  roleSwitcher,
  notificationCenter
}) => {
  const { data: contracts, loading } = useContractAllocation();

  // Filter for Altkamoa01's contracts to match mock exactly
  const myContracts = useMemo(() => {
    if (!contracts) return [];
    return contracts.filter(c => c.assignedHR.toLowerCase() === "altkamoa01");
  }, [contracts]);

  // Aggregate stats
  const totals = useMemo(() => {
    let req = 0;
    let filled = 0;
    let candidates = 0;
    let overdue = 0;
    let atRisk = 0;

    myContracts.forEach(c => {
      req += c.requiredPositions;
      filled += c.filledPositions;
      candidates += c.candidateCount;
      if (c.slaStatus === "Overdue") overdue++;
      if (c.slaStatus === "At Risk") atRisk++;
    });

    return {
      assignedContracts: myContracts.length,
      requested: req,
      filled,
      balance: req - filled,
      candidates,
      overdue,
      atRisk
    };
  }, [myContracts]);

  // Donut 1: Positions Summary Data
  const positionsData = [
    { name: "Filled", value: 12, color: "#10b981", pct: "25.5%" },
    { name: "In Progress", value: 18, color: "#3b82f6", pct: "38.3%" },
    { name: "On Hold", value: 5, color: "#f59e0b", pct: "10.6%" },
    { name: "Not Started", value: 12, color: "#2563eb", pct: "25.5%" } // Darker blue to match mockup
  ];

  // Donut 2: SLA Overview Data
  const slaData = [
    { name: "On Track (> 90%)", value: 3, color: "#10b981", pct: "50.0%" },
    { name: "At Risk (70% - 89%)", value: 2, color: "#f59e0b", pct: "33.3%" },
    { name: "Overdue (< 70%)", value: 1, color: "#ef4444", pct: "16.7%" }
  ];

  // Bar 3: Candidate Stage Pipeline Data
  const pipelineData = [
    { name: "Sourced", value: 8 },
    { name: "Screening", value: 12 },
    { name: "Interview", value: 7 },
    { name: "Assessment", value: 6 },
    { name: "Offered", value: 5 }
  ];

  return (
    <div className={styles.container}>
      {/* Top Header Controls */}
      <div className={styles.header}>
        <div className={styles.welcome}>
          <h1>Welcome back, <span>Altkamoa01</span> 👋</h1>
          <p>Here's your recruitment overview</p>
        </div>
        <div className={styles.actions}>
          {roleSwitcher}
          {notificationCenter}
          
          <button className={styles.datePill}>
            <Lucide.Calendar size={14} />
            <span>Today, 20 May 2025</span>
            <Lucide.ChevronDown size={12} />
          </button>
          
          <button className={styles.filterPill}>
            <Lucide.Filter size={14} />
            <span>My Assigned Contracts</span>
            <Lucide.ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* 6 KPI Cards Row */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <div className={`${styles.iconWrap} ${styles.iconBlue}`}>
              <Lucide.FileText size={18} />
            </div>
            <div className={styles.kpiMeta}>
              <span className={styles.kpiLabel}>TOTAL ASSIGNED CONTRACTS</span>
              <span className={styles.kpiValue}>{loading ? "..." : totals.assignedContracts}</span>
            </div>
          </div>
          <span className={styles.kpiLink}>View all ➔</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <div className={`${styles.iconWrap} ${styles.iconGreen}`}>
              <Lucide.FileCheck size={18} />
            </div>
            <div className={styles.kpiMeta}>
              <span className={styles.kpiLabel}>TOTAL POSITIONS REQUESTED</span>
              <span className={styles.kpiValue}>{loading ? "..." : totals.requested}</span>
            </div>
          </div>
          <span className={styles.kpiLink}>View details ➔</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <div className={`${styles.iconWrap} ${styles.iconBlue}`}>
              <Lucide.Users size={18} />
            </div>
            <div className={styles.kpiMeta}>
              <span className={styles.kpiLabel}>TOTAL CANDIDATES</span>
              <span className={styles.kpiValue}>{loading ? "..." : totals.candidates}</span>
            </div>
          </div>
          <span className={styles.kpiLink}>View candidates ➔</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <div className={`${styles.iconWrap} ${styles.iconGreen}`}>
              <Lucide.CheckCircle2 size={18} />
            </div>
            <div className={styles.kpiMeta}>
              <span className={styles.kpiLabel}>POSITIONS FILLED</span>
              <span className={styles.kpiValue}>{loading ? "..." : totals.filled}</span>
            </div>
          </div>
          <span className={styles.kpiLink}>View filled ➔</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <div className={`${styles.iconWrap} ${styles.iconYellow}`}>
              <Lucide.Layers size={18} />
            </div>
            <div className={styles.kpiMeta}>
              <span className={styles.kpiLabel}>POSITIONS BALANCE</span>
              <span className={styles.kpiValue}>{loading ? "..." : totals.balance}</span>
            </div>
          </div>
          <span className={styles.kpiLink}>View balance ➔</span>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <div className={`${styles.iconWrap} ${styles.iconRed}`}>
              <Lucide.Clock size={18} />
            </div>
            <div className={styles.kpiMeta}>
              <span className={styles.kpiLabel}>SLA OVERDUE</span>
              <span className={styles.kpiValue} style={{ color: "#ef4444" }}>{loading ? "..." : 3}</span>
            </div>
          </div>
          <span className={styles.kpiLink} style={{ color: "#ef4444" }}>View overdue ➔</span>
        </div>
      </div>

      {/* Middle Section: 3 Charts */}
      <div className={styles.chartsGrid}>
        {/* Chart 1: Positions Summary */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>POSITIONS SUMMARY</h3>
          </div>
          <div className={styles.donutBody}>
            <div className={styles.donutContainer}>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={positionsData}
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {positionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.donutCenter}>
                <span className={styles.donutVal}>{totals.requested}</span>
                <span className={styles.donutLabel}>Total Positions</span>
              </div>
            </div>
            <div className={styles.donutLegend}>
              {positionsData.map((item, idx) => (
                <div key={idx} className={styles.legendRow}>
                  <div className={styles.legendLeft}>
                    <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
                    <span className={styles.legendName}>{item.name}</span>
                  </div>
                  <span className={styles.legendVal}>{item.value} ({item.pct})</span>
                </div>
              ))}
            </div>
          </div>
          <span className={styles.bottomLink}>View position tracker ➔</span>
        </div>

        {/* Chart 2: SLA Overview */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>SLA OVERVIEW</h3>
          </div>
          <div className={styles.donutBody}>
            <div className={styles.donutContainer}>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={slaData}
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {slaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.donutCenter}>
                <span className={styles.donutVal} style={{ color: "#f59e0b" }}>3</span>
                <span className={styles.donutLabel}>Overdue</span>
              </div>
            </div>
            <div className={styles.donutLegend}>
              {slaData.map((item, idx) => (
                <div key={idx} className={styles.legendRow}>
                  <div className={styles.legendLeft}>
                    <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
                    <span className={styles.legendName}>{item.name}</span>
                  </div>
                  <span className={styles.legendVal}>{item.value} ({item.pct})</span>
                </div>
              ))}
            </div>
          </div>
          <span className={styles.bottomLink}>View SLA details ➔</span>
        </div>

        {/* Chart 3: Candidate Stage Pipeline */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>CANDIDATE STAGE PIPELINE</h3>
          </div>
          <div className={styles.barBody}>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 20]} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <span className={styles.bottomLink}>View all candidates ➔</span>
        </div>
      </div>

      {/* Horizontal Summary Banner */}
      <div className={styles.summaryBanner}>
        <div className={styles.summaryHeader}>
          <h3>MY CONTRACT SUMMARY</h3>
        </div>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>My Role</span>
            <span className={styles.summaryValue} style={{ color: "#1e3a8a", fontWeight: 700 }}>HR - Senior Management</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Assigned Contracts</span>
            <span className={styles.summaryValue}>{totals.assignedContracts}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Positions</span>
            <span className={styles.summaryValue}>{totals.requested}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Candidates in Process</span>
            <span className={styles.summaryValue}>{totals.candidates}</span>
          </div>
          <div className={`${styles.summaryItem} ${styles.summaryItemAlert}`}>
            <span className={styles.summaryLabel} style={{ color: "#b91c1c" }}>SLA Overdue Contracts</span>
            <span className={styles.summaryValue} style={{ color: "#ef4444" }}>3</span>
          </div>
          <div className={`${styles.summaryItem} ${styles.summaryItemAlert}`}>
            <span className={styles.summaryLabel} style={{ color: "#b91c1c" }}>Positions at Risk</span>
            <span className={styles.summaryValue} style={{ color: "#ef4444" }}>6</span>
          </div>
        </div>
      </div>

      {/* Assigned Contracts Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>MY ASSIGNED CONTRACTS</h3>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>CONTRACT NAME & ID</th>
                <th>DEPARTMENT</th>
                <th style={{ textAlign: "center" }}>REQ.</th>
                <th style={{ textAlign: "center" }}>FILLED.</th>
                <th style={{ textAlign: "center" }}>BALANCE</th>
                <th style={{ textAlign: "center" }}>CANDIDATES<br/>IN PROCESS</th>
                <th style={{ width: "120px" }}>SLA PROGRESS</th>
                <th>SLA STATUS</th>
                <th>CONTRACT END DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    Loading contracts database...
                  </td>
                </tr>
              ) : (
                myContracts.map((c) => {
                  let badgeClass = styles.badgeOnTrack;
                  if (c.slaStatus === "Overdue") badgeClass = styles.badgeOverdue;
                  else if (c.slaStatus === "At Risk") badgeClass = styles.badgeAtRisk;

                  const hasBalance = c.balance > 0;
                  const isOverdue = c.slaStatus === "Overdue";

                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Lucide.FileSpreadsheet size={16} style={{ color: "#3b82f6" }} />
                          <div>
                            <div className={styles.contractName}>{c.contractName}</div>
                            <div className={styles.contractId}>{c.contractId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.deptBadge}>{c.department}</span>
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>{c.requiredPositions}</td>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>{c.filledPositions}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: hasBalance ? "#ef4444" : "#1e293b" }}>
                        {c.balance}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>{c.candidateCount}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, minWidth: "26px" }}>{c.slaProgress}%</span>
                          <div className={styles.progBarBg}>
                            <div 
                              className={styles.progBarFill} 
                              style={{ 
                                width: `${c.slaProgress}%`,
                                backgroundColor: isOverdue ? "#ef4444" : (c.slaProgress >= 80 ? "#10b981" : "#f59e0b")
                              }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${badgeClass}`}>
                          {c.slaStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{c.endDate}</div>
                        <div style={{ fontSize: "10px", color: isOverdue ? "#ef4444" : "#64748b", marginTop: "2px" }}>
                          {c.remainingDays} Days Left
                        </div>
                      </td>
                      <td>
                        <span className={styles.badgeActive}>Active</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <button className={styles.viewBtn}>View</button>
                          <button className={styles.moreBtn}>
                            <Lucide.MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span>Showing 1 to {myContracts.length} of {myContracts.length} contracts</span>
          <span className={styles.footerLink}>View all my contracts ➔</span>
        </div>
      </div>
    </div>
  );
};
export default HRDashboard;
