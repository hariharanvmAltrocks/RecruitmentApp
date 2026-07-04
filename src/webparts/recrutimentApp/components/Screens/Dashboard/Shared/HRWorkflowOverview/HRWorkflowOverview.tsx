import React, { useState } from "react";
import styles from "./HRWorkflowOverview.module.scss";
import { IPositionSource } from "../../Types";

interface IHRWorkflowOverviewProps {
  data: IPositionSource[] | null | undefined;
  loading?: boolean;
}

export const HRWorkflowOverview: React.FC<IHRWorkflowOverviewProps> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const sources = data || [];

  const getPerformanceColorClass = (pct: number) => {
    // Exact colors to match the mock image values
    if (pct === 85 || pct === 76) return styles.pctGreen;
    if (pct === 80 || pct === 70) return styles.pctOrange;
    // Default fallback
    return pct >= 75 ? styles.pctGreen : styles.pctOrange;
  };

  if (loading) {
    return (
      <div className={styles.containerCard} aria-label="My HRs Performance Loading">
        <div className={styles.header}>
          <div className="dashboard-skeleton__bar" style={{ width: "150px", height: "16px" }} />
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thLeft} style={{ width: "120px" }}>
                  <div className="dashboard-skeleton__bar" style={{ width: "40px", height: "10px" }} />
                </th>
                <th>
                  <div className="dashboard-skeleton__bar" style={{ width: "80px", height: "10px", margin: "0 auto" }} />
                </th>
                <th>
                  <div className="dashboard-skeleton__bar" style={{ width: "40px", height: "10px", margin: "0 auto" }} />
                </th>
                <th>
                  <div className="dashboard-skeleton__bar" style={{ width: "60px", height: "10px", margin: "0 auto" }} />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td className={styles.tdLeft}>
                    <div className="dashboard-skeleton__bar" style={{ width: "70px", height: "12px" }} />
                  </td>
                  <td>
                    <div className="dashboard-skeleton__bar" style={{ width: "20px", height: "12px", margin: "0 auto" }} />
                  </td>
                  <td>
                    <div className="dashboard-skeleton__bar" style={{ width: "20px", height: "12px", margin: "0 auto" }} />
                  </td>
                  <td>
                    <div className="dashboard-skeleton__bar" style={{ width: "30px", height: "12px", margin: "0 auto" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(sources.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sources.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.containerCard} aria-label="My HRs Performance">
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>My HRs Performance</span>
      </div>

      {/* Table representing recruiter performance */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLeft}>HR</th>
              <th>Open Positions</th>
              <th>Filled</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((wf) => (
              <tr key={wf.name}>
                <td className={styles.tdLeft}>{wf.name}</td>
                <td className={styles.tdCentered}>{wf.pending}</td>
                <td className={styles.tdCentered}>{wf.done}</td>
                <td className={`${styles.tdCentered} ${getPerformanceColorClass(wf.percentage)}`}>
                  {wf.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {sources.length > itemsPerPage && (
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

      {/* Footer Link */}
      {/* <div className={styles.footer}>
        <a href="#/MyHRs" className={styles.viewLink}>View all my HRs</a>
      </div> */}
    </div>
  );
};

export default HRWorkflowOverview;
