import React, { useState } from "react";

import * as Lucide from "lucide-react";
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import styles from "./HODComponents.module.scss";
import { IHRSummary, IMonthlyTrackerItem, IMyApprovals, IPositionsJobRole } from "../../Types";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Department Positions Trend Component
// ─────────────────────────────────────────────────────────────────────────────
interface ITrendProps {
  data: IMonthlyTrackerItem[];
  loading?: boolean;
}

export const DepartmentPositionsTrend: React.FC<ITrendProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.TrendingUp size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Department Positions Trend (Monthly)</h3>
        </div>
        <div className={styles.skeletonChart} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.TrendingUp size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Department Positions Trend (Monthly)</h3>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="filled" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Positions by Job Role Component
// ─────────────────────────────────────────────────────────────────────────────
interface IJobRoleProps {
  data: IPositionsJobRole[];
  loading?: boolean;
}

export const PositionsJobRole: React.FC<IJobRoleProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.Briefcase size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Positions by Job Role</h3>
        </div>
        <div className={styles.skeletonTable}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton__bar" style={{ width: "100%", height: "14px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.Briefcase size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Positions by Job Role</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Job Role</th>
              <th>Total</th>
              <th>Filled</th>
              <th>Open</th>
              <th>% Filled</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "left", fontWeight: 600 }}>{item.jobRole}</td>
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
      {/* <div className={styles.cardFooter}>
        <a href="#/roles" className={styles.link}>View all roles</a>
      </div> */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Team Summary Component
// ─────────────────────────────────────────────────────────────────────────────
interface ITeamSummaryProps {
  data: IHRSummary[];
  loading?: boolean;
}

export const TeamSummary: React.FC<ITeamSummaryProps> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.Users size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Team Summary</h3>
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
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.Users size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>HR Summary</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Job Title</th>
              <th>HR Name</th>
              <th>Open</th>
              <th>Filled</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "left", fontWeight: 600 }}>{item.JobTitle}</td>
                <td>{item.HRName}</td>
                <td>{item.openPositions}</td>
                <td>{item.filledPositions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {list.length > itemsPerPage && (
        <div className={styles.pagination} role="navigation" aria-label="Pagination">
          <button
            className={styles.pageArrow}
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={safeCurrentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                type="button"
                className={`${styles.pageNumber} ${safeCurrentPage === pageNum ? styles.active : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className={styles.pageArrow}
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safeCurrentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}

      {/* <div className={styles.cardFooter}>
        <a href="#/team" className={styles.link}>View team</a>
      </div> */}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Team Status Component
// ─────────────────────────────────────────────────────────────────────────────
interface ITeamStatusProps {
  data: any[];
  loading?: boolean;
}

export const TeamStatus: React.FC<ITeamStatusProps> = ({ data, loading }) => {
  const total = React.useMemo(() => {
    return data ? data.reduce((sum, item) => sum + item.count, 0) : 0;
  }, [data]);

  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.PieChart size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Team Status</h3>
        </div>
        <div className={styles.skeletonDonut} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.PieChart size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Team Status</h3>
      </div>
      <div className={styles.donutBody}>
        <div className={styles.donutVisual}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                innerRadius={36}
                outerRadius={50}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.donutCenter}>
            <span className={styles.donutCenterVal}>{total}</span>
            <span className={styles.donutCenterLabel}>TOTAL</span>
          </div>
        </div>
        <div className={styles.donutLegend}>
          {data.map((item, index) => (
            <div key={index} className={styles.legendRow}>
              <div className={styles.legendLeft}>
                <span className={styles.dot} style={{ backgroundColor: item.color }} />
                <span className={styles.legendName}>{item.name}</span>
              </div>
              <span className={styles.legendCount}>
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <a href="#/team-details" className={styles.link}>View team details</a>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. My Approvals Component
// ─────────────────────────────────────────────────────────────────────────────
interface IApprovalsProps {
  data: IMyApprovals[];
  loading?: boolean;
}

export const MyApprovals: React.FC<IApprovalsProps> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.FileCheck size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>My Approvals</h3>
        </div>
        <div className={styles.skeletonTable}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton__bar" style={{ width: "100%", height: "14px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  const list = data || [];
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.FileCheck size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>My Approvals</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Request Type</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td style={{ textAlign: "left", fontWeight: 600 }}>{item.requestType}</td>
                <td>
                  <span className={styles.approvalCount}>{item.count}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {list.length > itemsPerPage && (
        <div className={styles.pagination} role="navigation" aria-label="Pagination">
          <button
            className={styles.pageArrow}
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={safeCurrentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                type="button"
                className={`${styles.pageNumber} ${safeCurrentPage === pageNum ? styles.active : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className={styles.pageArrow}
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safeCurrentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}

      {/* <div className={styles.cardFooter}>
        <a href="#/approvals" className={styles.link}>View all approvals</a>
      </div> */}
    </div>
  );
};
