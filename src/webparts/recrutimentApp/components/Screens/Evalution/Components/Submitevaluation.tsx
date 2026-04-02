// Components/SubmitEvaluation.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors Submitreviewscorecard.tsx exactly.
// Receives the already-instantiated submitHook from EvalutionContent so that
// error maps (ratingErrors, scorecardErrors, etc.) can flow up to form fields.
//
// Popup flows:
//  SUBMIT click → validate
//    ├─ FAIL  → Validation popup   → "Got it" → closes, form stays
//    └─ PASS  → Submit confirm     → "Yes, Submit" → API
//                  ├─ FAIL    → inline error below buttons
//                  └─ SUCCESS → Success popup → "Close" → onSuccess()
//
//  CANCEL click → Leave confirm popup
//    ├─ "Stay Here"  → closes, form stays
//    └─ "Yes, Leave" → onCancel()
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react';
import type { UseSubmitEvaluationReturn } from '../Hooks/Usesubmitevaluation';
import styles from '../Evalution.module.scss';
import ConfirmationPopup from '../../ReviewScoreCard/Confirmationpopup';

interface SubmitEvaluationProps {
  /** Pre-instantiated hook from EvalutionContent */
  submitHook:   UseSubmitEvaluationReturn;
  /** Passed directly so the submit button can be disabled when unchecked */
  acknowledged: boolean;
  /** Called when the user confirms "Yes, Leave" */
  onCancel:     () => void;
}

const SubmitEvaluation: React.FC<SubmitEvaluationProps> = ({
  submitHook,
  acknowledged,
  onCancel,
}) => {
  const {
    submitting,
    submitError,
    successMessage,
    validationErrors,
    runValidation,
    submitEval,
    resetSubmit,
    onSuccess,
  } = submitHook;

  // ── Popup visibility ──────────────────────────────────────────────────────
  const [showSubmitConfirm, setShowSubmitConfirm] = React.useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [showValidation,    setShowValidation]    = React.useState(false);
  const [showSuccess,       setShowSuccess]       = React.useState(false);

  // Open success popup when hook sets successMessage
  React.useEffect(() => {
    if (successMessage) setShowSuccess(true);
  }, [successMessage]);

  // ── SUBMIT button click: validate first, then show confirm popup ──────────
  const handleSubmitClick = React.useCallback(() => {
    const valid = runValidation();
    if (!valid) {
      setShowValidation(true);   // show validation popup
      return;
    }
    setShowSubmitConfirm(true);  // show submit confirm popup
  }, [runValidation]);

  // ── User confirmed submit ─────────────────────────────────────────────────
  const handleSubmitConfirmed = React.useCallback(async () => {
    setShowSubmitConfirm(false);
    await submitEval();
    // success popup opens via the useEffect above when successMessage is set
  }, [submitEval]);

  // ── Success popup closed → resetSubmit + navigate away ───────────────────
  const handleSuccessClose = React.useCallback(() => {
    setShowSuccess(false);
    resetSubmit();
    onSuccess(); // goBack() in EvalutionContent
  }, [resetSubmit, onSuccess]);

  // ── CANCEL button click → show leave confirmation ─────────────────────────
  const handleCancelClick = React.useCallback(() => {
    setShowCancelConfirm(true);
  }, []);

  // ── User confirmed leave ──────────────────────────────────────────────────
  const handleLeaveConfirmed = React.useCallback(() => {
    setShowCancelConfirm(false);
    onCancel();
  }, [onCancel]);

  return (
    <>
      {/* ── Footer buttons ── */}
      <div className={styles.footer}>
        {/* Inline API error shown between buttons when submit fails */}
        {submitError && (
          <span className={styles.inlineError}>{submitError}</span>
        )}

        <button
          className={styles.cancelBtn}
          onClick={handleCancelClick}
          disabled={submitting}
          type="button"
        >
          Cancel
        </button>

        <button
          className={styles.submitBtn}
          onClick={handleSubmitClick}
          disabled={submitting || !acknowledged}
          type="button"
        >
          {submitting ? 'Submitting…' : '+ Submit Evaluation'}
        </button>
      </div>

      {/* ── 1. Submit Confirmation Popup ── */}
      <ConfirmationPopup
        type="submit"
        open={showSubmitConfirm}
        onConfirm={handleSubmitConfirmed}
        onClose={() => setShowSubmitConfirm(false)}
      />

      {/* ── 2. Cancel / Leave Confirmation Popup ── */}
      <ConfirmationPopup
        type="cancel"
        open={showCancelConfirm}
        onConfirm={handleLeaveConfirmed}
        onClose={() => setShowCancelConfirm(false)}
      />

      {/* ── 3. Validation Error Popup ── */}
      <ConfirmationPopup
        type="validation"
        open={showValidation}
        validationErrors={validationErrors}
        onClose={() => setShowValidation(false)}
      />

      {/* ── 4. Success Popup ── */}
      <ConfirmationPopup
        type="success"
        open={showSuccess}
        successMessage={successMessage}
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default SubmitEvaluation;