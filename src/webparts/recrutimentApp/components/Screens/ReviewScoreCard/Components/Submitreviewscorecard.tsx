// Components/Submitreviewscorecard.tsx
// Popup flows:
//  SUBMIT click  → Confirm popup → OK → API → Success popup → close+refresh
//  SUBMIT click  → Confirm popup → OK → Validation fails → Validation popup
//  CANCEL click  → "Are you sure to leave?" popup → OK → onClose()

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from '../ReviewScorecard.module.scss';
import { useSubmitReviewScoreCard, SubmitHookDeps } from './useSubmitReviewScoreCard';
import ConfirmationPopup from '../Confirmationpopup';
import * as strings from 'RecrutimentAppWebPartStrings';

interface SubmitReviewScoreCardProps extends SubmitHookDeps {
  roleId:     number;
  compact?:   boolean;
  className?: string;
  /** The modal's close handler — triggered after cancel confirm */
  onClose:    () => void;
}

const SubmitReviewScoreCard: React.FC<SubmitReviewScoreCardProps> = ({
  roleId,
  compact   = false,
  className = '',
  onClose,
  ...hookDeps
}) => {
  const {
    submitting,
    submitError,
    successMessage,
    errors,
    validationErrors,
    submitDecision,
    resetSubmit,
    runValidation,
  } = useSubmitReviewScoreCard(hookDeps);

  // ── Popup visibility state ────────────────────────────────────────────────
  const [showSubmitConfirm,  setShowSubmitConfirm]  = React.useState(false);
  const [showCancelConfirm,  setShowCancelConfirm]  = React.useState(false);
  const [showValidation,     setShowValidation]     = React.useState(false);
  const [showSuccess,        setShowSuccess]        = React.useState(false);

  // Show success popup when hook sets successMessage
  React.useEffect(() => {
    if (successMessage) setShowSuccess(true);
  }, [successMessage]);

  // ── SUBMIT button clicked → validate first, then show confirm popup ───────
  const handleSubmitClick = React.useCallback(() => {
    const valid = runValidation();
    if (!valid) {
      setShowValidation(true);   // show validation popup
      return;
    }
    setShowSubmitConfirm(true);  // show confirm popup
  }, [runValidation]);

  // ── User confirmed submit ─────────────────────────────────────────────────
  const handleSubmitConfirmed = React.useCallback(async () => {
    setShowSubmitConfirm(false);
    await submitDecision(roleId);
    // success popup opens via the useEffect above when successMessage is set
  }, [submitDecision, roleId]);

  // ── Success popup closed → run onSuccess (close modal + refresh) ──────────
  const handleSuccessClose = React.useCallback(async () => {
    setShowSuccess(false);
    resetSubmit();
    await hookDeps.onSuccess();
  }, [hookDeps, resetSubmit]);

  // ── CANCEL button clicked → show leave confirmation ───────────────────────
  const handleCancelClick = React.useCallback(() => {
    setShowCancelConfirm(true);
  }, []);

  // ── User confirmed leave ──────────────────────────────────────────────────
  const handleLeaveConfirmed = React.useCallback(() => {
    setShowCancelConfirm(false);
    onClose();
  }, [onClose]);

  return (
    <>
      {/* ── Footer buttons ── */}
      <div className={className} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>

        {/* CANCEL button */}
        <button
          className={styles.mCancelBtn}
          onClick={handleCancelClick}
          disabled={submitting}
          type="button"
        >
          {strings.Cancel1}</button>

        {/* SUBMIT button */}
        <button
          className={styles.mSubmitBtn}
          onClick={handleSubmitClick}
          disabled={submitting || !hookDeps.hodDecision}
          type="button"
          style={{ alignSelf: 'flex-end' }}
        >
          {submitting ? (
            'Submitting…'
          ) : compact ? (
            <CheckCircle2 size={15} />
          ) : (
            <>
              <CheckCircle2 size={15} style={{ marginRight: 6 }} />
              {strings.SubmitAction1}</>
          )}
        </button>
      </div>

      {/* API error (shown inline below buttons if submit fails) */}
      {submitError && (
        <div className={styles.mSubmitError} style={{ marginTop: '0.5rem' }}>
          {submitError}
        </div>
      )}

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

export default SubmitReviewScoreCard;