import React, { useState } from "react";
import styles from "./CandidatePipelineChart.module.scss";
import Card from "../../Common/Card";
import { ICandidatePipelineStage } from "../../Types";

interface CandidatePipelineChartProps {
  data: ICandidatePipelineStage[] | undefined;
  loading?: boolean;
}

export const CandidatePipelineChart: React.FC<CandidatePipelineChartProps> = ({ data, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  if (loading || !data) {
    return (
      <Card className={styles.container}>
        <div className={styles.header}>
          <div className="dashboard-skeleton__bar" style={{ width: "180px", height: "14px" }} />
        </div>
        <div className={styles.tablePlaceholder}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className={styles.loadingRow} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div className="dashboard-skeleton__bar" style={{ width: "100%", height: "12px", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const displayedData = data.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );
  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>My Candidate Pipeline</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLeft}>Stage</th>
              <th>Count</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((stage, index) => (
              <tr key={index}>
                <td className={styles.tdStage}>{stage.stage}</td>
                <td className={styles.tdCount}>{stage.count}</td>
                <td className={styles.tdPercent}>{stage.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageArrow}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={safeCurrentPage === 1}
            aria-label="Previous Page"
          >
            ‹
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.pageNumber} ${p === safeCurrentPage ? styles.active : ""}`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageArrow}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safeCurrentPage === totalPages}
            aria-label="Next Page"
          >
            ›
          </button>
        </div>
      )}
    </Card>
  );
};

export default CandidatePipelineChart;
