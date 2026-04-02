import * as React from "react";
import { Zap, CheckCircle2, Activity, Eye, FileText, X } from "lucide-react";
import styles from "../ReviewScorecard.module.scss";
import { HODDecision, PositionOption } from "../State/types";
const _FEEDBACK_LEVEL2_STATUS_IDS = [130, 129];
interface Props {
  canEdit: boolean;
  isLevel2Status: boolean;
  statusId: number;
  hodDecision: HODDecision;
  decisionComment: string;
  confirmed: boolean;
  selectedPositionId: number | null;
  selectedPositionText: string;
  positionOptions: PositionOption[];
  submitting: boolean;
  submitError: string;
  successMessage: string;
  reviewerName: string;
  jobTitleEn: string;
  jobTitleFr: string;
  userInitial: string;
  errors: { decision: boolean; comment: boolean; checkbox: boolean; position: boolean };

  shouldShowPositionId: (statusId: number, decision: HODDecision) => boolean;
  onDecisionChange: (d: HODDecision) => void;
  onCommentChange: (v: string) => void;
  onConfirmChange: (v: boolean) => void;
  onPositionChange: (id: number | null, text: string) => void;
  onViewComments: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

const HODDecisionPanel: React.FC<Props> = ({
  canEdit, isLevel2Status, statusId, hodDecision, decisionComment,
  confirmed, selectedPositionId, selectedPositionText, positionOptions,
  submitting, submitError, successMessage,
  reviewerName, jobTitleEn, jobTitleFr, userInitial,
  errors, shouldShowPositionId,
  onDecisionChange, onCommentChange, onConfirmChange, onPositionChange,
  onViewComments, onSubmit, onClose,
}) => {
  const feedbackLabel = _FEEDBACK_LEVEL2_STATUS_IDS.includes(statusId)
    ? "Feedback — Level 2"
    : "Feedback — Level 1";
  if (!canEdit) {
    return (
      <div className={styles.mDecisionCard} style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
        <div className={styles.mDecisionHeader}>
          <Eye size={22} color="#2563eb" />
          <div>
            <div className={styles.mDecisionTitle}>HOD Decision (Submitted)</div>
            <div className={styles.mDecisionSub}>This candidate has already been reviewed.</div>
          </div>
        </div>

        {/* View Comments button */}
        <div className={styles.mFormGroup}>
          <button onClick={onViewComments} className={styles.mActionBtn}>
            <FileText size={16} /> VIEW COMMENTS
          </button>
        </div>

        {/* Decision badge */}
        {hodDecision && (
          <div className={styles.mFormGroup}>
            <label className={styles.mFormLabel}>Decision</label>
            <div style={{
              padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: 700,
              fontSize: "0.875rem", display: "inline-block",
              background: hodDecision === "Yes" ? "#f0fdf4" : hodDecision === "No" ? "#fef2f2" : "#fffbeb",
              color: hodDecision === "Yes" ? "#16a34a" : hodDecision === "No" ? "#dc2626" : "#d97706",
            }}>
              {hodDecision === "Yes" ? "✓ SELECTED" : hodDecision === "No" ? "✗ REJECTED" : "⏸ ON HOLD"}
            </div>
          </div>
        )}

        {/* Assigned Position ID */}
        {selectedPositionText && (
          <div className={styles.mFormGroup}>
            <label className={styles.mFormLabel}>Assigned Position ID</label>
            <div className={styles.mfValue}>{selectedPositionText}</div>
          </div>
        )}

        {/* Existing comment */}
        {decisionComment && (
          <div className={styles.mFormGroup}>
            <label className={styles.mFormLabel}>{feedbackLabel}</label>
            <div style={{
              background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "0.5rem",
              padding: "0.75rem", fontSize: "0.875rem", color: "#334155",
            }}>
              {decisionComment}
            </div>
          </div>
        )}

        <div className={styles.mFooter}>
          <button onClick={onClose} className={styles.mCancelBtn}>CLOSE</button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.mDecisionCard}>
      {/* Header */}
      <div className={styles.mDecisionHeader}>
        <Zap size={22} color="#f59e0b" fill="#f59e0b" />
        <div>
          <div className={styles.mDecisionTitle}>Do you wish to select this candidate?</div>
          <div className={styles.mDecisionSub}>As HOD, review the evaluation and provide your decision.</div>
        </div>
      </div>

      {/* YES / NO / ON HOLD buttons */}
      <div className={styles.mDecisionGrid}>
        {([
          { val: "Yes" as HODDecision, cls: styles.mDCardYes, Icon: CheckCircle2, label: "YES, SELECT" },
          { val: "No" as HODDecision, cls: styles.mDCardNo, Icon: X, label: "NO, REJECT" },
          { val: "On Hold" as HODDecision, cls: styles.mDCardHold, Icon: Activity, label: "ON HOLD" },
        ]).map(({ val, cls, Icon, label }) => (
          <button
            key={val}
            className={`${styles.mDCard} ${hodDecision === val ? cls : ""} ${errors.decision ? styles.mInputErr : ""}`}
            onClick={() => onDecisionChange(val)}
          >
            <Icon size={28} /><span>{label}</span>
          </button>
        ))}
      </div>
      {errors.decision && (
        <div style={{ color: "#ef4444", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
          ⚠ Please select a decision.
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div style={{
          background: "#dcfce7", border: "1px solid #22c55e", color: "#166534",
          padding: "0.6rem 0.8rem", borderRadius: "0.45rem", marginBottom: "0.75rem", fontWeight: 600,
        }}>
          {successMessage}
        </div>
      )}

      {/* View Comments button */}
      <div className={styles.mFormGroup}>
        <button onClick={onViewComments} className={styles.mActionBtn}>
          <FileText size={16} /> VIEW COMMENTS
        </button>
      </div>

      {/* Position ID dropdown */}
      {shouldShowPositionId(statusId, hodDecision) && (
        <div className={styles.mFormGroup}>
          <label className={`${styles.mFormLabel} ${errors.position ? styles.mErrLabel : ""}`}>
            Assign Position ID <span style={{ color: "#ef4444" }}>*</span>
            {errors.position && <span className={styles.mErrText}> — Required</span>}
          </label>
          <select
            className={`${styles.mSelect} ${errors.position ? styles.mInputErr : ""}`}
            value={selectedPositionId ?? ""}
            onChange={e => {
              const v = Number(e.target.value) || null;
              const opt = positionOptions.find(o => o.key === v);
              onPositionChange(v, opt?.text || "");
            }}
          >
            <option value="">Select a position…</option>
            {positionOptions.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.text || `#${opt.key}`}</option>
            ))}
          </select>
          {positionOptions.length === 0 && (
            <p className={styles.mNoData} style={{ marginTop: 6 }}>No positions available.</p>
          )}
        </div>
      )}

      {/* Comment / Feedback textarea */}
      <div className={styles.mFormGroup}>
        <label className={`${styles.mFormLabel} ${errors.comment ? styles.mErrLabel : ""}`}>
          {feedbackLabel} <span style={{ color: "#ef4444" }}>*</span>
          {errors.comment && <span className={styles.mErrText}> — Required</span>}
        </label>
        <textarea
          className={`${styles.mTextarea} ${errors.comment ? styles.mInputErr : ""}`}
          placeholder="Provide your final decision rationale..."
          value={decisionComment}
          onChange={e => onCommentChange(e.target.value)}
        />
      </div>

      {/* Confirmation checkbox */}
      <div className={styles.mFormGroup}>
        <label className={styles.mCheckboxRow}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={e => onConfirmChange(e.target.checked)}
          />
          <span>
            I confirm that the above decision is accurate and in line with the evaluation
            of the candidate's scorecard details.
          </span>
        </label>
        {errors.checkbox && (
          <span className={styles.mCheckboxErrText}>⚠ You must confirm before submitting.</span>
        )}
      </div>

      {/* Reviewer card (signature block) */}
      <div className={styles.mFormGroup}>
        <div className={styles.reviewerCard}>
          <div className={styles.reviewerAvatar}>{userInitial || ""}</div>
          <div className={styles.reviewerInfo}>
            <div className={styles.reviewerCol}>
              <p className={styles.reviewerMeta}>REVIEWER NAME</p>
              <p className={styles.reviewerVal}>{reviewerName || ""}</p>
            </div>
            <div className={styles.reviewerCol}>
              <p className={styles.reviewerMeta}>JOB TITLE (EN)</p>
              <p className={styles.reviewerVal}>{jobTitleEn || ""}</p>
              <p className={styles.reviewerMeta} style={{ marginTop: 12 }}>JOB TITLE (FR)</p>
              <p className={styles.reviewerVal}>{jobTitleFr || ""}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit error */}
      {submitError && <div className={styles.mSubmitError}>{submitError}</div>}

      {/* Footer — CANCEL + SUBMIT ACTION */}
      <div className={styles.mFooter}>
        <button onClick={onClose} className={styles.mCancelBtn} disabled={submitting}>
          CANCEL
        </button>
        <button
          className={styles.mSubmitBtn}
          onClick={onSubmit}
          disabled={submitting || !hodDecision}
        >
          {submitting
            ? "Submitting…"
            : <><CheckCircle2 size={15} style={{ marginRight: 6 }} /> SUBMIT ACTION</>
          }
        </button>
      </div>
    </div>
  );
};

export default HODDecisionPanel;