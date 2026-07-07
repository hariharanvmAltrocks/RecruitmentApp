import React, { useMemo, useState } from "react";
import * as Lucide from "lucide-react";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import styles from "./SeniorHRComponents.module.scss";
import { IConflictOfInterestAlert, IHRLeadPerformance, IHRTask, IMonthlyTrackerItem, ISeniorHRMonthlyTracker, ISeniorHRTask } from "../../Types";
import { DataTableColumn, DataTable } from "../../../../Comman/DataTable/DataTable";
import Card from "../../Common/Card";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Positions Overview Chart Component (Monthly)
// ─────────────────────────────────────────────────────────────────────────────
interface IOverviewProps {
  data: ISeniorHRMonthlyTracker[];
  loading?: boolean;
}

export const PositionsOverviewChart: React.FC<IOverviewProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.TrendingUp size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Positions Overview (Monthly)</h3>
        </div>
        <div className={styles.skeletonChart} />
      </div>
    );
  }

  const TotalColor = "var(--app-primary-color, #7c3aed)";
  const filledColor = "var(--app-text-color, #0f172a)";
  const OpenColor = "var(--app-sidenav-color, #ffffff)";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.TrendingUp size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Positions Overview (Monthly)</h3>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="total" fill={TotalColor} radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="filled" fill={filledColor} radius={[4, 4, 0, 0]} barSize={16} />
            <Line type="monotone" dataKey="open" stroke={OpenColor} strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Department Demand Overview Component
// ─────────────────────────────────────────────────────────────────────────────
interface IDemandProps {
  data: any[];
  loading?: boolean;
}

export const DepartmentDemandOverview: React.FC<IDemandProps> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.Building2 size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Department Demand Overview</h3>
        </div>
        <div className={styles.skeletonTable}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton__bar" style={{ width: "100%", height: "14px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  const list = data || [];
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentItems = list.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.Building2 size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Department Demand Overview</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Department</th>
              <th>Total Demand</th>
              <th>Filled</th>
              <th>Open</th>
              <th>% Filled</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "left", fontWeight: 600 }}>{item.department}</td>
                <td>{item.total}</td>
                <td>{item.filled}</td>
                <td>{item.open}</td>
                <td>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${item.percentage}%` }} />
                    <span className={styles.progressText}>{item.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <button
            type="button"
            className={styles.paginationBtn}
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            aria-label="Previous Page"
          >
            <Lucide.ChevronLeft size={16} />
          </button>
          <span className={styles.paginationText}>
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            type="button"
            className={styles.paginationBtn}
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            aria-label="Next Page"
          >
            <Lucide.ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* <div className={styles.cardFooter}>
        <a href="#/departments" className={styles.link}>View all departments</a>
      </div> */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. HR Leads Performance Component
// ─────────────────────────────────────────────────────────────────────────────
interface ILeadsProps {
  data: IHRLeadPerformance[];
  loading?: boolean;
}

export const HRLeadsPerformance: React.FC<ILeadsProps> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.UserCheck size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>HR Leads Performance</h3>
        </div>
        <div className={styles.skeletonTable}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton__bar" style={{ width: "100%", height: "14px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  const list = data || [];
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentItems = list.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const avatarThemes = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.UserCheck size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>HR Leads Performance</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>HR Lead</th>
              <th>HRs Managed</th>
              <th>Positions Filled</th>
              <th>Open Positions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => {
              const letter = item.hrLeadName.charAt(0).toUpperCase();
              const globalIdx = startIndex + idx;
              const color = avatarThemes[globalIdx % avatarThemes.length];

              return (
                <tr key={idx}>
                  <td style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div className={styles.avatar} style={{ backgroundColor: color }}>
                        {letter}
                      </div>
                      <span style={{ fontWeight: 600 }}>{item.hrLeadName}</span>
                    </div>
                  </td>
                  <td>{item.hrsManaged}</td>
                  <td>{item.filled}</td>
                  <td>{item.open}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <button
            type="button"
            className={styles.paginationBtn}
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            aria-label="Previous Page"
          >
            <Lucide.ChevronLeft size={16} />
          </button>
          <span className={styles.paginationText}>
            Page {safeCurrentPage} of {totalPages}
          </span>
          <button
            type="button"
            className={styles.paginationBtn}
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            aria-label="Next Page"
          >
            <Lucide.ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* <div className={styles.cardFooter}>
        <a href="#/leads" className={styles.link}>View all HR leads</a>
      </div> */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Conflict of Interest Alerts Component
// ─────────────────────────────────────────────────────────────────────────────
interface ICOIProps {
  data: IConflictOfInterestAlert[];
  loading?: boolean;
}

export const ConflictOfInterestAlerts: React.FC<ICOIProps> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.ShieldAlert size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Conflict of Interest Alerts</h3>
        </div>
        <div className={styles.skeletonTable}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton__bar" style={{ width: "100%", height: "14px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.ShieldAlert size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Conflict of Interest Alerts</h3>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Candidate Name</th>
              <th style={{ textAlign: "left" }}>Job Title</th>
              <th style={{ textAlign: "left" }}>COI Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                  No Conflict of Interest candidates found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "left", fontWeight: 600 }}>{item.name}</td>
                  <td style={{ textAlign: "left" }}>{item.JobTitle}</td>
                  <td style={{ textAlign: "left" }}>{item.coiReason}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeWarning}`}>
                      {item.currentstatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <button
            type="button"
            className={styles.paginationBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <Lucide.ChevronLeft size={16} />
          </button>
          <span className={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className={styles.paginationBtn}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            <Lucide.ChevronRight size={16} />
          </button>
        </div>
      )}
      
      {/* <div className={styles.cardFooter}>
        <a href="#/alerts" className={styles.link}>View all alerts</a>
      </div> */}
    </div>
  );
};

interface TaskTableProps {
  data: ISeniorHRTask[] | undefined;
  loading?: boolean;
}

export const SeniorHRTaskTable: React.FC<TaskTableProps> = ({ data, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

   const columns = useMemo<DataTableColumn<ISeniorHRTask>[]>(() => [
      {
        id: "jobTitle",
        header: "Job Title",
        render: (row: ISeniorHRTask) => (
          <div className="data-table__job-title">
              <span>{row.Jobtitle}</span>
              <span className="data-table__job-dept">{row.JobCode}</span>
            </div>
        ),
        sortable: true
      },
      {
          id: "department",
          header: "Department",
          render: (item: ISeniorHRTask) => (
            <div className="data-table__job-title">
              <span>{item.department}</span>
              {/* <span className="data-table__job-dept">{item.department}</span> */}
            </div>
          ),
          sortable: true
        },
       {
          id: "dateRequired",
          header: "Date Required",
          accessor: "dateRequired",
          cellClassName: "data-table__cell--muted",
          hideOnMobile: true,
          sortable: true
        },
         {
          id: "RecruitmentHRlead",
          header: "RecruitmentHR Lead",
          accessor: "RecruitmentHRlead",
          cellClassName: "data-table__cell--muted",
          hideOnMobile: true,
          sortable: true
        },
         {
          id: "RecruitmentHR",
          header: "Recruitment HR",
          accessor: "RecruitmentHR",
          cellClassName: "data-table__cell--muted",
          hideOnMobile: true,
          sortable: true
        },
      {
        id: "headcount",
        header: "Headcount (Req)",
        accessor: "headcount",
        sortable: true,
        align: "center"
      },
      {
        id: "filledcount",
        header: "Filled",
        accessor: "filledcount",
        sortable: true,
        align: "center"
      },
      {
        id: "vacant",
        header: "Vacant (Bal)",
        accessor: "vacant",
        sortable: true,
        align: "center",
        cellClassName: styles.weight600
      },
      {
        id: "daysLeft",
        header: "Days Left",
        render: (row: IHRTask) => <span>{row.dayaLeft} days</span>,
        sortable: true,
        cellClassName: styles.weight600
      },
      {
        id: "status",
        header: "Status",
        render: (row: IHRTask) => {
          let statusClass = styles.statusOnTrack;
          if (row.Positionstatus === "Overdue") statusClass = styles.statusOverdue;
          else if (row.Positionstatus === "At Risk") statusClass = styles.statusAtRisk;
          return (
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {row.Positionstatus}
            </span>
          );
        },
        sortable: true
      },
    ], []);

  const getRowId = (row: IHRTask) => String(row.id);

  const tasksList = data || [];

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <Lucide.CheckSquare size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Position Details</h3>
      </div>
      <div className={styles.tableWrapper}>
        <DataTable
          columns={columns}
          data={tasksList}
          getRowId={getRowId}
          pageSize={pageSize}
          currentPage={currentPage}
          totalCount={tasksList.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          loading={loading}
        />
      </div>
      {/* <div className={styles.footer}>
        <a href="#/Tasks" className={styles.viewLink}>View all tasks</a>
      </div> */}
    </Card>
  );
};
