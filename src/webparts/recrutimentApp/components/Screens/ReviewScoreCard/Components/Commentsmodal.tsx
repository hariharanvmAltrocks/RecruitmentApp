// Components/Commentsmodal.tsx
// FIX: level1 / level2 undefined-ஆக வந்தால் crash ஆகாமல்
//      default [] கொடுத்து safe-ஆக handle பண்றோம்.

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";
import moment from "moment";
import styles from "../ReviewScorecard.module.scss";
import { CommentEntry } from "../State/types";

interface Props {
  open:    boolean;
  loading: boolean;
  level1?: CommentEntry[];   // optional — safe against undefined
  level2?: CommentEntry[];   // optional — safe against undefined
  onClose: () => void;
}

const CommentsModal: React.FC<Props> = ({
  open,
  loading,
  level1 = [],   // ← default empty array — fixes "Cannot read properties of undefined (reading 'map')"
  level2 = [],   // ← default empty array
  onClose,
}) => {
  // Merge Level1 + Level2 sorted by date ascending
  const allComments = React.useMemo(() => {
    const safe1 = Array.isArray(level1) ? level1 : [];
    const safe2 = Array.isArray(level2) ? level2 : [];
    return [
      ...safe1.map(c => ({ ...c, _level: "Level 1" as const })),
      ...safe2.map(c => ({ ...c, _level: "Level 2" as const })),
    ].sort((a, b) => {
      const d1 = a.Date ? new Date(a.Date).getTime() : 0;
      const d2 = b.Date ? new Date(b.Date).getTime() : 0;
      return d1 - d2;
    });
  }, [level1, level2]);

  return (
    <AnimatePresence>
      {open && (
        <div className={styles.mCommentsModalOverlay} onClick={onClose}>
          <motion.div
            className={styles.mCommentsModalWindow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className={styles.mCommentsHeader}>
              <h3>
                <FileText size={20} color="#2563eb" /> View Justification
              </h3>
              <button
                onClick={onClose}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className={styles.mCommentsBody}>
              {loading ? (
                <div className={styles.mCommentsLoading}>Loading comments...</div>
              ) : allComments.length === 0 ? (
                <div className={styles.mCommentsNoData}>No Comments Found</div>
              ) : (
                allComments.map((c, i) => (
                  <div
                    key={i}
                    className={
                      c._level === "Level 1"
                        ? styles.mCommentItemL1
                        : styles.mCommentItemL2
                    }
                  >
                    {/* Submitted by */}
                    <div className={styles.mCommentRole}>
                      Submitted by {c.RoleName || c.Name || ""} ({c._level})
                    </div>

                    {/* Feedback comment */}
                    {c.comments && (
                      <div className={styles.mCommentText}>
                        <strong>Feedback {c._level}:</strong>
                        <br />
                        {c.comments}
                      </div>
                    )}

                    {/* Overall feedback */}
                    {c.OverAllEvaluationFeedback && (
                      <div className={styles.mCommentText}>
                        <strong>Overall Feedback {c._level}:</strong>
                        <br />
                        {c.OverAllEvaluationFeedback}
                      </div>
                    )}

                    {/* Date */}
                    {c.Date && (
                      <div className={styles.mCommentDate}>
                        Date: {moment(c.Date).format("M/D/YYYY, h:mm:ss A")}
                      </div>
                    )}

                    {/* Author */}
                    {c.Name && (
                      <div className={styles.mCommentAuthor}>
                        {c.Name}
                        {c.JobTitleInEnglish ? ` — ${c.JobTitleInEnglish}` : ""}
                        {c.JobTitleInFrench  ? ` (${c.JobTitleInFrench})` : ""}
                      </div>
                    )}

                    {/* Department */}
                    {c.Department && (
                      <div className={styles.mCommentAuthor}>{c.Department}</div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* ── Footer ── */}
            <div className={styles.mCommentsFooter}>
              <button onClick={onClose} className={styles.closeBtn}>
                CLOSE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommentsModal;