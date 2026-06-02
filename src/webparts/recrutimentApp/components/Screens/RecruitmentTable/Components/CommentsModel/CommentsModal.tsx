
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";
import  moment from "moment";
import { CommentsData } from "../../../../../services/RecruitmentTable/IRecruitmentService";
import styles from "./CommentsModal.module.scss";

interface Props {
  open:     boolean;
  loading:  boolean;
  Comments: CommentsData[];
  onClose:  () => void;
}

const CustomComments: React.FC<Props> = ({ open, loading, Comments, onClose }) => {
  const allComments = React.useMemo(() => [
    ...(Comments || []).map(c => ({ ...c, _level: "Level 1" })),
  ].sort((a, b) => {
    const d1 = a.Date ? new Date(a.Date).getTime() : 0;
    const d2 = b.Date ? new Date(b.Date).getTime() : 0;
    return d1 - d2;
  }), [Comments]);

  return (
    <AnimatePresence>
      {open && (
        <div className={styles.mCommentsModalOverlay} onClick={onClose}>
          <motion.div
            className={styles.mCommentsModalWindow}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.mCommentsHeader}>
              <h3><FileText size={20} color="#2563eb" /> View Justification</h3>
              <button onClick={onClose} aria-label="Close comments modal"><X size={20} /></button>
            </div>

            <div className={styles.mCommentsBody}>
              {loading ? (
                <div className={styles.mCommentsLoading}>Loading comments...</div>
              ) : allComments.length === 0 ? (
                <div className={styles.mCommentsNoData}>No Comments Found</div>
              ) : allComments.map((c, i) => (
                <div key={i} className={c._level === "Level 1" ? styles.mCommentItemL1 : styles.mCommentItemL2}>
                  <div className={styles.mCommentRole}>
                    Submitted by {c.RoleName || c.Name || ""} ({c._level})
                  </div>
                  {c.comments && (
                    <div className={styles.mCommentText}>
                      <strong>Comments:</strong><br />{c.comments}
                    </div>
                  )}
                  {c.Date && (
                    <div className={styles.mCommentDate}>
                      Date: {moment(c.Date).format("M/D/YYYY, h:mm:ss A")}
                    </div>
                  )}
                  {c.Name && (
                    <div className={styles.mCommentAuthor}>
                      {c.Name}
                      {c.JobTitleInEnglish ? ` — ${c.JobTitleInEnglish}` : ""}
                      {c.JobTitleInFrench  ? ` (${c.JobTitleInFrench})` : ""}
                    </div>
                  )}
                  {c.Department && <div className={styles.mCommentAuthor}>{c.Department}</div>}
                </div>
              ))}
            </div>

            <div className={styles.mCommentsFooter}>
              <button onClick={onClose} className={styles.closeBtn}>CLOSE</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomComments;