
import * as React from "react";
import { motion } from "framer-motion";
import { X, Users, AlertCircle, Pencil, Eye } from "lucide-react";
import styles from "../Reviewscorecardtab.module.scss";
import { ScorecardJobRow, ScorecardCandidateRow } from "../types";
import { EDITABLE_STATUS_IDS, VIEW_ONLY_STATUS_IDS } from "../hooks/UseReviewScorecard";


interface Props {
  job:        ScorecardJobRow;
  candidates: ScorecardCandidateRow[];
  loading:    boolean;
  onClose:    () => void;
  onReview:   (c: ScorecardCandidateRow) => void;
}

const getStatusClass = (statusId: number) => {
  if (statusId === 122) return styles.statusSelected;
  if (VIEW_ONLY_STATUS_IDS.includes(statusId)) return styles.statusRejected;
  return styles.statusPending;
};

const getInterviewLevelLabel = (interviewLevel?: string) => {
  const lvl = (interviewLevel || "").trim();
  const isLevel1 = /level\s*1/i.test(lvl);
  const isLevel2 = /level\s*2/i.test(lvl);

  if (isLevel2) {
    // For level 2 candidates, display both level 1 and level 2
    return "Level 1 of 1 & Level 2 of 2";
  }

  if (isLevel1) {
    return "Level 1 of 1";
  }

  return lvl || " ";
};

const CandidateDrawer: React.FC<Props> = ({ job, candidates, loading, onClose, onReview }) => {
  const pendingCount = candidates.filter(c => EDITABLE_STATUS_IDS.includes(c.statusId)).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className={styles.drawerOverlay}
      />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className={styles.drawer}
      >
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerContent}>
            <div className={styles.iconBox}><Users size={24} /></div>
            <div>
              <h2>
                Candidate Selection{" "}
                {pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
              </h2>
              <p>{job.jobCode} · <span>{job.jobTitle}</span></p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton}><X size={24} /></button>
        </div>

        {/* Body */}
        <div className={styles.drawerBody}>
          <div className={styles.innerCard}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Applicant Name</th>
                  <th>Position Title</th>
                  <th>Interview Level</th>
                  <th>Grade</th>
                  <th className={styles.center}>GPA</th>
                  <th>Status</th>
                  <th className={styles.center}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className={styles.noData}>Loading candidates...</td></tr>
                ) : candidates.length === 0 ? (
                  <tr><td colSpan={8} className={styles.noData}>No candidates found.</td></tr>
                ) : candidates.map((c, idx) => {
                  const edit = EDITABLE_STATUS_IDS.includes(c.statusId);
                  const view = VIEW_ONLY_STATUS_IDS.includes(c.statusId);
                  return (
                    <tr key={c.id}>
                      <td className={styles.textMuted} style={{ fontWeight: "bold" }}>{idx + 1}</td>
                      <td className={styles.jobTitle}>{c.fullName}</td>
                      <td className={styles.textMuted}>{c.positionTitle || ""}</td>
                      <td className={styles.textMuted}>{getInterviewLevelLabel(c.interviewLevel)}</td>
                      <td className={styles.textMuted}>{c.grade || ""}</td>
                      <td className={styles.center}>
                        <div className={styles.gpaBadge}>{c.gpa || ""}</div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadgeText} ${getStatusClass(c.statusId)}`}>
                          {c.status || ""}
                        </span>
                      </td>
                      <td className={styles.center}>
                        {edit && (
                          <button onClick={() => onReview(c)} className={styles.iconButton} title="Edit">
                            <Pencil size={16} />
                          </button>
                        )}
                        {view && (
                          <button onClick={() => onReview(c)} className={styles.iconButton} title="View">
                            <Eye size={16} />
                          </button>
                        )}
                        {!edit && !view && <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.drawerFooter}>
          <div className={styles.footerHint}>
            <AlertCircle size={16} /><span>Click a candidate to review their scorecard</span>
          </div>
          <div className={styles.footerActions}>
            <button onClick={onClose} className={styles.cancelBtn}>CLOSE</button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CandidateDrawer;