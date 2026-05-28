import * as React from "react";
import {
  Zap,
  CheckCircle2,
  Activity,
  Eye,
  FileText,
  X,
  ChevronDown,
} from "lucide-react";
import styles from "../ReviewScorecard.module.scss";
import { HODDecision, PositionOption, ErrorsType } from "../State/types";
import { SubmitHookDeps } from "./useSubmitReviewScoreCard";
import SubmitReviewScoreCard from "./Submitreviewscorecard";
import { AnimatePresence, motion } from "framer-motion";
import {
  SectionHeader,
  sectionVariants,
} from "../../CandidateTable/Components/reuseUI";
import { ReviewCommentSignature } from "../../RecruitmentTable/Components/ReviewCommentSignature";
import { useSignatureDetails } from "../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails";
import { canView } from "../ReviewScoreCardServies/ReviewScoreCardServices";
import { CheckboxContent } from "../../../../utilities/ConditionConfig";
import * as strings from 'RecrutimentAppWebPartStrings';
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
  errors: ErrorsType;
  shouldShowPositionId: (statusId: number, decision: HODDecision) => boolean;
  onDecisionChange: (d: HODDecision) => void;
  onCommentChange: (v: string) => void;
  onConfirmChange: (v: boolean) => void;
  onPositionChange: (id: number | null, text: string) => void;
  onViewComments: () => void;
  onClose: () => void;
  submitDeps: SubmitHookDeps;
  roleId: number;
}

const HODDecisionPanel: React.FC<Props> = ({
  canEdit,
  isLevel2Status,
  statusId,
  hodDecision,
  decisionComment,
  confirmed,
  selectedPositionId,
  selectedPositionText,
  positionOptions,
  submitting,
  submitError,
  successMessage,
  reviewerName,
  jobTitleEn,
  jobTitleFr,
  userInitial,
  errors,
  shouldShowPositionId,
  onDecisionChange,
  onCommentChange,
  onConfirmChange,
  onPositionChange,
  onViewComments,
  onClose,
  submitDeps,
  roleId,
}) => {
  const feedbackLabel = _FEEDBACK_LEVEL2_STATUS_IDS.includes(statusId)
    ? strings.FeedbackLevel2
    : strings.FeedbackLevel1;
  const [openPosition, setOpenPosition] = React.useState(false);
  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();
  // ── VIEW-ONLY mode ────────────────────────────────────────────────────────
  // ── EDITABLE mode ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Header ── */}

      {/* ── View Comments ── */}
      <div className={styles.mFormGroup}>
        <button
          onClick={onViewComments}
          className={styles.mSubmitBtn}
          type="button"
          // disabled={submitHook.submitting}
        >
          <FileText size={16} />
          {strings.ViewComments}</button>
      </div>

      <div className={styles.lmDecisionCard} style={{ marginBottom: "4%" }}>
        <div className={styles.lmDecisionHeader}>
          <div className={styles.lmDecisionZap}>
            <Zap size={28} fill="currentColor" />
          </div>
          <div className={styles.lmDecisionTitleWrap}>
            <h3 className={styles.lmDecisionTitle}>
              {strings.DoYouWishToSelectThisCandidate}</h3>
            <p className={styles.lmDecisionSubtitle}>
              {strings.AsHodReviewTheEvaluationAndProvideYourDe}</p>
          </div>
        </div>

        {/* ── YES / NO / ON HOLD buttons (new UI, same values) ── */}
        <div className={styles.decisionBtnsRow}>
          <button
            type="button"
            className={`${styles.decisionBtn} ${
              hodDecision === "Yes"
                ? styles.decisionBtnYesActive
                : styles.decisionBtnYesInactive
            } ${errors.decision ? styles.mInputErr : ""}`}
            onClick={() => onDecisionChange("Yes")}
          >
            <CheckCircle2
              size={36}
              strokeWidth={2}
              className={
                hodDecision === "Yes" ? styles.iconWhite : styles.iconGreen
              }
            />
            <span className={styles.decisionBtnLabel}>{strings.YesSelect}</span>
          </button>

          <button
            type="button"
            className={`${styles.decisionBtn} ${
              hodDecision === "No"
                ? styles.decisionBtnNoActive
                : styles.decisionBtnNoInactive
            } ${errors.decision ? styles.mInputErr : ""}`}
            onClick={() => onDecisionChange("No")}
          >
            <X
              size={36}
              strokeWidth={2}
              className={
                hodDecision === "No" ? styles.iconWhite : styles.iconRed
              }
            />
            <span className={styles.decisionBtnLabel}>{strings.NoReject}</span>
          </button>

          <button
            type="button"
            className={`${styles.decisionBtn} ${
              hodDecision === "On Hold"
                ? styles.decisionBtnHoldActive
                : styles.decisionBtnHoldInactive
            } ${errors.decision ? styles.mInputErr : ""}`}
            onClick={() => onDecisionChange("On Hold")}
          >
            <Activity
              size={36}
              strokeWidth={2}
              className={
                hodDecision === "On Hold" ? styles.iconWhite : styles.iconAmber
              }
            />
            <span className={styles.decisionBtnLabel}>{strings.OnHold1}</span>
          </button>
        </div>

        {/* Decision validation error */}
        {errors.decision && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "0.75rem",
              marginTop: "0.4rem",
            }}
          >
            {strings.PleaseSelectADecision}</div>
        )}

        {!canEdit && (
          <motion.section
            className={styles.section}
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.hrFeedbackCard} style={{ marginTop: "5%" }}>
              <SectionHeader title={strings.AssignPositionId} accent="green" />

              <div className={styles.hrFeedbackFieldWrap}>
                <label
                  className={`${styles.fieldLabel} ${
                    errors.position ? styles.mErrLabel : ""
                  }`}
                >
                  Assign Position ID{" "}
                </label>

                <div className={`${styles.dropdownWrapper} dropdown`}>
                  <div
                    className={`${styles.customDropdownTrigger}
      ${openPosition ? ` ${styles.dropdownOpen}` : ""}
    `}
                  >
                    <span
                      className={
                        selectedPositionText
                          ? styles.dropdownSelected
                          : styles.dropdownPlaceholder
                      }
                    >
                      {selectedPositionText}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`${styles.dropdownChevron} ${openPosition ? styles.open : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
        {canEdit && shouldShowPositionId(statusId, hodDecision) && (
          <motion.section
            className={styles.section}
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.hrFeedbackCard} style={{ marginTop: "5%" }}>
              <SectionHeader title="Assign Position ID" accent="green" />

              <div className={styles.hrFeedbackFieldWrap}>
                <label
                  className={`${styles.fieldLabel} ${
                    errors.position ? styles.mErrLabel : ""
                  }`}
                >
                  Assign Position ID{" "}
                  <span className={styles.fieldRequired}>*</span>
                  {errors.position && (
                    <span className={styles.mErrText}> {strings.Required1}</span>
                  )}
                </label>

                <div className={`${styles.dropdownWrapper} dropdown`}>
                  <div
                    className={`${styles.customDropdownTrigger}
      ${openPosition ? ` ${styles.dropdownOpen}` : ""}
    `}
                    onClick={() => setOpenPosition(!openPosition)}
                  >
                    <span
                      className={
                        selectedPositionText
                          ? styles.dropdownSelected
                          : styles.dropdownPlaceholder
                      }
                    >
                      {selectedPositionText
                        ? selectedPositionText
                        : strings.SelectAPosition}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`${styles.dropdownChevron} ${openPosition ? styles.open : ""}`}
                    />
                  </div>

                  {/* ✅ Controlled only by openPosition, not selectedPositionText */}
                  <AnimatePresence>
                    {openPosition && positionOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={styles.dropdownMenu}
                      >
                        {positionOptions.length > 0 ? (
                          positionOptions.map((opt) => (
                            <div
                              key={opt.key}
                              onClick={() => {
                                onPositionChange(opt.key, opt.text || "");
                                setOpenPosition(false); // ✅ closes after selection
                              }}
                              className={`${styles.dropdownOption} ${
                                selectedPositionId === opt.key
                                  ? styles.dropdownOptionActive
                                  : ""
                              }`}
                            >
                              {opt.text}
                            </div>
                          ))
                        ) : (
                          <div className={styles.mNoData}>
                            {strings.NoPositionsAvailable}</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {canEdit && (
        <>
          <ReviewCommentSignature
            reviewerComments={decisionComment}
            acknowledgementCheckbox={confirmed}
            signatureDetails={signatureDetails}
            isLoading={signatureLoading}
            onCommentsChange={(value) => onCommentChange(value)}
            onToggleAcknowledgement={(value) => onConfirmChange(value)}
            ReviewLabel={"FEEDBACK - LEVEL 2"}
            acknowledgementLabel={CheckboxContent.HODscorecarddetails}
            // disabled={isSubmittingRef.current}
          />

          {/* ── Footer: CANCEL + SUBMIT (unchanged) ── */}
          <div className={styles.mFooter}>
            <SubmitReviewScoreCard
              roleId={roleId}
              onClose={onClose}
              {...submitDeps}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default HODDecisionPanel;
