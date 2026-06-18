import React, { useState, useEffect } from "react";
import { Filter, Search, Calendar, MoreHorizontal, Check, Pause, X } from "lucide-react";
import styles from "./CandidateProgress.module.scss";
import { PROGRESS_STEPS } from "../../../../../../utilities/PositionStatusConfig";
import { getStatusRoadMap } from "../../Hooks/getStatusRoadMap";
import * as strings from 'RecrutimentAppWebPartStrings';
import { StatusId } from "../../../../../../utilities/Config";

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

  const isOnHoldStatus = (statusId: number) => {
    return (
      statusId === StatusId.OnHoldbyHOD ||
      statusId === StatusId.CandidateOnHoldbyHODLevel1 ||
      statusId === StatusId.CandidateOnHoldbyHODLevel2
    );
  };

  const isRejectedStatus = (statusId: number) => {
    return (
      statusId === StatusId.RejectedbyHOD ||
      statusId === StatusId.CandidateRejectedbyHODLevel1 ||
      statusId === StatusId.CandidateRejectedbyHODLevel2
    );
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
            <h3 style={{ margin: 0 }}>{strings.CandidateProgress}</h3>
            {!loading && (
              <span className={styles.totalCountBadge}>
                {validData.length} {strings.Total}</span>
            )}
          </div>
          <p>
            {strings.TrackProgressForEachCandidateThroughTheR}</p>
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
            <th>{strings.Candidate}</th>
            <th>{strings.CurrentStep}</th>
            <th>{strings.Progress}</th>
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
                  {strings.LoadingCandidates}</div>
              </td>
            </tr>
          ) : currentData && currentData.length > 0 ? (
            currentData.map((candidate) => (
              <tr key={candidate.id}>
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

                <td>
                  {(() => {
                    const isCandidateOnHold = candidate.StatusId ? isOnHoldStatus(candidate.StatusId) : false;
                    const isCandidateRejected = candidate.StatusId ? isRejectedStatus(candidate.StatusId) : false;
                    
                    let badgeClass = styles.stepBadge;
                    if (isCandidateOnHold) {
                      badgeClass = `${styles.stepBadge} ${styles["stepBadge--onhold"]}`;
                    } else if (isCandidateRejected) {
                      badgeClass = `${styles.stepBadge} ${styles["stepBadge--rejected"]}`;
                    }
                    
                    let statusText = strings.InProgress;
                    let dotClass = styles.dot;
                    if (isCandidateOnHold) {
                      statusText = strings.OnHold;
                      dotClass = `${styles.dot} ${styles["dot--onhold"]}`;
                    } else if (isCandidateRejected) {
                      statusText = strings.Rejected;
                      dotClass = `${styles.dot} ${styles["dot--rejected"]}`;
                    }

                    return (
                      <div className={styles.candidateProgress__currentStepBox}>
                        <div className={badgeClass}>
                          {isCandidateOnHold ? (
                            <Pause size={12} strokeWidth={3} />
                          ) : isCandidateRejected ? (
                            <X size={12} strokeWidth={3} />
                          ) : (
                            candidate.currentStepIndex + 1
                          )}
                        </div>
                        <div className={styles.stepInfo}>
                          <span className={styles.stepName}>
                            {PROGRESS_STEPS[candidate.currentStepIndex]}
                          </span>
                          <span className={styles.stepStatus}>
                            {statusText}<span className={dotClass} />
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </td>

                {/* Progress Line */}
                <td style={{ width: "40%" }}>
                  <div className={styles.candidateProgress__progressRow}>
                    {PROGRESS_STEPS.map((_, idx) => {
                      const isCompleted = idx < candidate.currentStepIndex;
                      const isActive = idx === candidate.currentStepIndex;
                      const hideLine =
                        isCompleted && idx === candidate.currentStepIndex - 1;

                      const isCandidateOnHold = candidate.StatusId ? isOnHoldStatus(candidate.StatusId) : false;
                      const isCandidateRejected = candidate.StatusId ? isRejectedStatus(candidate.StatusId) : false;

                      let nodeClass = styles["node--pending"];
                      if (isCompleted) {
                        nodeClass = styles["node--completed"];
                      } else if (isActive) {
                        if (isCandidateOnHold) {
                          nodeClass = styles["node--onhold"];
                        } else if (isCandidateRejected) {
                          nodeClass = styles["node--rejected"];
                        } else {
                          nodeClass = styles["node--active"];
                        }
                      }

                      if (hideLine) nodeClass += ` ${styles["hide-line"]}`;

                      return (
                        <div
                          key={idx}
                          className={`${styles.node} ${nodeClass}`}
                        >
                          {isCompleted ? (
                            <Check size={12} strokeWidth={3} />
                          ) : isActive && isCandidateOnHold ? (
                            <Pause size={12} strokeWidth={3} />
                          ) : isActive && isCandidateRejected ? (
                            <X size={12} strokeWidth={3} />
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
                    {strings.NoCandidatesAreCurrentlyScheduledForAnIn}</p>
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
            {strings.Previous}</button>
          <span className={styles.paginationText}>
            {strings.Page}{currentPage} {strings.Of}{totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.paginationBtn}
          >
            {strings.Next}</button>
        </div>
      )}
        </>
      )}
    </div>
  );
};
