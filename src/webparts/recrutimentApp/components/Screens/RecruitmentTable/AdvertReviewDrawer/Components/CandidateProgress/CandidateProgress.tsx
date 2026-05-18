import React from "react";
import { Filter, Search, Calendar, MoreHorizontal, Check } from "lucide-react";
import styles from "./CandidateProgress.module.scss";

const PROGRESS_STEPS = [
  "Candidate Status",
  "Interview Schedules",
  "Assign Position ID",
  "Background Check",
  "Resi Process",
  "Offer Release",
  "Workpermit Process",
  "Employment Contract",
  "Onboarding",
];

const DUMMY_CANDIDATES = [
  {
    id: "1",
    initials: "AR",
    name: "Aarav Rao",
    role: "Software Engineer",
    appliedDate: "12 May 2024",
    avatarClass: "avatar--blue",
    currentStepIndex: 3,
  },
  {
    id: "2",
    initials: "PS",
    name: "Priya Singh",
    role: "HR Executive",
    appliedDate: "14 May 2024",
    avatarClass: "avatar--purple",
    currentStepIndex: 5,
  },
  {
    id: "3",
    initials: "MJ",
    name: "Michael Johnson",
    role: "Data Analyst",
    appliedDate: "16 May 2024",
    avatarClass: "avatar--yellow",
    currentStepIndex: 1,
  },
];

export const CandidateProgress: React.FC = () => {
  return (
    <div className={styles.candidateProgress}>
      <div className={styles.candidateProgress__header}>
        <div className={styles.candidateProgress__title}>
          <h3>Candidate Progress</h3>
          <p>
            Track progress for each candidate through the recruitment process
          </p>
        </div>
        {/* <div className={styles.candidateProgress__actions}>
          <div className={styles.candidateProgress__search}>
            <Search size={16} />
            <input type="text" placeholder="Search candidate..." />
          </div>
          <button className={styles.candidateProgress__filterBtn}>
            <Filter size={16} />
            Filter
          </button>
        </div> */}
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
          {DUMMY_CANDIDATES.map((candidate) => (
            <tr key={candidate.id}>
              {/* Candidate Info */}
              <td>
                <div className={styles.candidateProgress__candidateInfo}>
                  <div className={`${styles.avatar} ${candidate.avatarClass}`}>
                    {candidate.initials}
                  </div>
                  <div className={styles.details}>
                    <span className={styles.name}>{candidate.name}</span>
                    <span className={styles.role}>{candidate.role}</span>
                    <span className={styles.date}>
                      <Calendar size={12} /> Applied on {candidate.appliedDate}
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
                      <div key={idx} className={`${styles.node} ${nodeClass}`}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
