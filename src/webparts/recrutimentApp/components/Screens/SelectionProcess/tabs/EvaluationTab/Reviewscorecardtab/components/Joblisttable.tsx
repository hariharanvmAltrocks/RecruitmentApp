// ReviewScorecard/components/JobListTable.tsx
import * as React from "react";
import { RotateCcw, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "../Reviewscorecardtab.module.scss";
import { ScorecardJobRow } from "../types";

interface Props {
  jobRows:     ScorecardJobRow[];
  totalItems:  number;
  currentPage: number;
  totalPages:  number;
  pageSize:    number;
  onPageChange:     (p: number) => void;
  onPageSizeChange: (s: number) => void;
  searchTerm:  string;
  onSearch:    (v: string) => void;
  onSelectJob: (job: ScorecardJobRow) => void;
  loading:     boolean;
}

const JobListTable: React.FC<Props> = ({
  jobRows, totalItems, currentPage, totalPages, pageSize,
  onPageChange, onPageSizeChange, searchTerm, onSearch, onSelectJob, loading,
}) => {
  const navigate = useNavigate();

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Review Scorecards</h2>
        <button onClick={() => navigate("/Dashboard")} className={styles.backButton}>
          <RotateCcw size={14} /> BACK TO DASHBOARD
        </button>
      </div>

      {/* Search */}
      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={e => { onSearch(e.target.value); onPageChange(1); }}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.styledTable}>
          <thead>
            <tr>
              {["Job Code", "Job Title", "Business Unit", "Position Request", "Nationality", "Status"].map(h => (
                <th key={h}>{h} <ArrowUpDown size={10} /></th>
              ))}
              <th className={styles.center}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className={styles.noData}>Loading...</td></tr>
            ) : jobRows.length === 0 ? (
              <tr><td colSpan={7} className={styles.noData}>No jobs found.</td></tr>
            ) : jobRows.map(job => (
              <tr key={job.id} onClick={() => onSelectJob(job)}>
                <td className={styles.jobCode}>{job.jobCode}</td>
                <td className={styles.jobTitle}>{job.jobTitle}</td>
                <td className={styles.textMuted}>{job.businessUnitCode || "—"}</td>
                <td className={styles.textMuted}>{job.positionRequest || "—"}</td>
                <td className={styles.textMuted}>{job.nationality || "—"}</td>
                <td>
                  <div className={styles.statusBadge}>
                    <div className={styles.dot} />
                    {job.status || "Recruitment In Progress"}
                  </div>
                </td>
                <td className={styles.center}>
                  <button
                    onClick={e => { e.stopPropagation(); onSelectJob(job); }}
                    className={styles.actionButton}
                  >
                    REVIEW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationBar}>
        <div className={styles.paginationInfo}>
          Showing{" "}
          <strong>{totalItems === 0 ? 0 : Math.min((currentPage - 1) * pageSize + 1, totalItems)}</strong>
          {" "}to{" "}
          <strong>{Math.min(currentPage * pageSize, totalItems)}</strong>
          {" "}of <strong>{totalItems}</strong> results&nbsp;
          <span className={styles.showEntries}>
            SHOW{" "}
            <select value={pageSize} onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}>
              {[5, 10, 20, 50].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {" "}ENTRIES
          </span>
        </div>
        <div className={styles.paginationControls}>
          <button className={`${styles.pageBtn} ${currentPage <= 1 ? styles.disabled : ""}`}
            disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
          {pageNumbers.map(page => (
            <button key={page}
              className={`${styles.pageBtn} ${page === currentPage ? styles.activePage : ""}`}
              onClick={() => onPageChange(page)}>{page}</button>
          ))}
          <button className={`${styles.pageBtn} ${currentPage >= totalPages ? styles.disabled : ""}`}
            disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>›</button>
        </div>
      </div>
    </div>
  );
};

export default JobListTable;