import React, { useState, useEffect } from "react";
import { Filter, Search, Calendar, MoreHorizontal, Check } from "lucide-react";
import styles from "./CandidateProgress.module.scss";
import { PROGRESS_STEPS } from "../../../../../../utilities/PositionStatusConfig";
import { getStatusRoadMap } from "../../Hooks/getStatusRoadMap";

interface ICandidateProgressProps {
  RecID: number;
}

export const CandidateProgress: React.FC<ICandidateProgressProps> = ({
  RecID,
}) => {
  const { data, loading } = getStatusRoadMap(RecID);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const validData = data || [];
  const totalPages = Math.max(1, Math.ceil(validData.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentData = validData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className={styles.candidateProgress}>
      {data && data.length > 0 && ( 
        <>
         <div className={styles.candidateProgress__header}>
        <div className={styles.candidateProgress__title}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "4px",
            }}
          >
            <h3 style={{ margin: 0 }}>Candidate Progress</h3>
            {!loading && (
              <span className={styles.totalCountBadge}>
                {validData.length} Total
              </span>
            )}
          </div>
          <p>
            Track progress for each candidate through the recruitment process
          </p>
        </div>
      </div>

      <div className={styles.candidateProgress__timelineHeader}>
        {PROGRESS_STEPS.map((step, idx) => (
          <div key={idx} className={styles.candidateProgress__stepHeader}>
            <div className={styles.stepNum}>{idx + 1}</div>
            <div className={styles.stepLabel}>{step}</div>
          </div>
        ))}
      </div>

      <table className={styles.candidateProgress__table}>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Current Step</th>
            <th>Progress</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px 20px",
                    color: "#64748b",
                  }}
                >
                  Loading candidates...
                </div>
              </td>
            </tr>
          ) : currentData && currentData.length > 0 ? (
            currentData.map((candidate) => (
              <tr key={candidate.id}>
                {/* Candidate Info */}
                <td>
                  <div className={styles.candidateProgress__candidateInfo}>
                    {/* <div
                      className={`${styles.avatar} ${candidate.avatarClass}`}
                    >
                      {candidate.initials}
                    </div> */}
                    <div className={styles.details}>
                      <span className={styles.name}>{candidate.name}</span>
                      <span className={styles.role}>{candidate.role}</span>
                      <span className={styles.date}>
                        {/* <Calendar size={12} /> Applied on{" "}
                        {candidate.appliedDate} */}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Current Step Box */}
                <td>
                  <div className={styles.candidateProgress__currentStepBox}>
                    <div className={styles.stepBadge}>
                      {candidate.currentStepIndex + 1}
                    </div>
                    <div className={styles.stepInfo}>
                      <span className={styles.stepName}>
                        {PROGRESS_STEPS[candidate.currentStepIndex]}
                      </span>
                      <span className={styles.stepStatus}>
                        In Progress <span className={styles.dot} />
                      </span>
                    </div>
                  </div>
                </td>

                {/* Progress Line */}
                <td style={{ width: "40%" }}>
                  <div className={styles.candidateProgress__progressRow}>
                    {PROGRESS_STEPS.map((_, idx) => {
                      const isCompleted = idx < candidate.currentStepIndex;
                      const isActive = idx === candidate.currentStepIndex;
                      const hideLine =
                        isCompleted && idx === candidate.currentStepIndex - 1;

                      let nodeClass = styles["node--pending"];
                      if (isCompleted) nodeClass = styles["node--completed"];
                      else if (isActive) nodeClass = styles["node--active"];

                      if (hideLine) nodeClass += ` ${styles["hide-line"]}`;

                      return (
                        <div
                          key={idx}
                          className={`${styles.node} ${nodeClass}`}
                        >
                          {isCompleted ? (
                            <Check size={12} strokeWidth={3} />
                          ) : (
                            idx + 1
                          )}
                        </div>
                      );
                    })}
                  </div>
                </td>

                {/* Actions */}
                {/* <td style={{ textAlign: "right" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                    }}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px 20px",
                    color: "#64748b",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    No candidates are currently scheduled for an interview.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {validData.length > itemsPerPage && (
        <div className={styles.candidateProgress__pagination}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={styles.paginationBtn}
          >
            Previous
          </button>
          <span className={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.paginationBtn}
          >
            Next
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
};
