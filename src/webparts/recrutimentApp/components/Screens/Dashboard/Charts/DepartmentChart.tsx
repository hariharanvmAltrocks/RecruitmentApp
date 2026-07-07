import React, { useState } from "react";
import * as Lucide from "lucide-react";
import styles from "./DepartmentChart.module.scss";
import Card from "../Common/Card";
import ProgressBar from "../Common/ProgressBar";
import { IDepartmentPosition } from "../Types";

interface DepartmentChartProps {
  data: IDepartmentPosition[] | undefined;
  loading?: boolean;
}

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ data, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const deptList = data || [];

  if (loading || !data) {
    return (
      <Card className={styles.container}>
        <div className={styles.header}>
          <div className="dashboard-skeleton__bar" style={{ width: "180px", height: "14px" }} />
        </div>
        <div className={styles.tablePlaceholder}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className={styles.loadingRow} style={{ padding: "16px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div className="dashboard-skeleton__bar" style={{ width: "120px", height: "12px", marginBottom: "8px" }} />
              <div className="dashboard-skeleton__bar" style={{ width: "100%", height: "8px", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const totalPages = Math.ceil(deptList.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = deptList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <Lucide.Building2 size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Positions by Department</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLeft}>Department</th>
              <th>Total</th>
              <th>Filled</th>
              <th>Open</th>
              <th className={styles.thPercent}>% Filled</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((dept, index) => (
              <tr key={index}>
                <td className={styles.tdDeptName}>{dept.department}</td>
                <td className={styles.tdCount}>{dept.total}</td>
                <td className={styles.tdCount}>{dept.filled}</td>
                <td className={styles.tdCountOpen}>{dept.open}</td>
                <td className={styles.tdProgress}>
                  <div className={styles.progressWrap}>
                    <ProgressBar value={dept.filledPercentage} color="#10b981" />
                    <span className={styles.progressText}>{dept.filledPercentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {deptList.length > itemsPerPage && (
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
    </Card>
  );
};

export default DepartmentChart;
