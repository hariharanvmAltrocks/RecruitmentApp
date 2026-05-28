import * as React from "react";

import styles from "../Evalution.module.scss";
import ConfirmationPopup from "../../ReviewScoreCard/Confirmationpopup";
import { UseSubmitEvaluationReturn } from "../Hooks/Usesubmitevaluation";
import * as strings from 'RecrutimentAppWebPartStrings';

interface SubmitEvaluationProps {
  submitHook: UseSubmitEvaluationReturn;
  acknowledged: boolean;
  onCancel: () => void;
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
  const [showSubmitConfirm, setShowSubmitConfirm] = React.useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [showValidation, setShowValidation] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  React.useEffect(() => {
    if (successMessage) setShowSuccess(true);
  }, [successMessage]);
  const handleSubmitClick = React.useCallback(() => {
    const valid = runValidation();
    if (!valid) {
      setShowValidation(true);
      return;
    }
    setShowSubmitConfirm(true);
  }, [runValidation]);
  const handleSubmitConfirmed = React.useCallback(async () => {
    setShowSubmitConfirm(false);
    await submitEval();
  }, [submitEval]);
  const handleSuccessClose = React.useCallback(() => {
    setShowSuccess(false);
    resetSubmit();
    onSuccess();
  }, [resetSubmit, onSuccess]);
  const handleCancelClick = React.useCallback(() => {
    setShowCancelConfirm(true);
  }, []);
  const handleLeaveConfirmed = React.useCallback(() => {
    setShowCancelConfirm(false);
    onCancel();
  }, [onCancel]);

  return (
    <>
      <div className={styles.footer}>
        {submitError && (
          <span className={styles.inlineError}>{submitError}</span>
        )}

        <button
          className={styles.cancelBtn}
          onClick={handleCancelClick}
          disabled={submitting}
          type="button"
        >
          {strings.Cancel}</button>

        <button
          className={styles.submitBtn}
          onClick={handleSubmitClick}
          disabled={submitting || !acknowledged}
          type="button"
        >
          {submitting ? "Submitting…" : strings.SubmitEvaluation}
        </button>
      </div>
      <ConfirmationPopup
        type="submit"
        open={showSubmitConfirm}
        onConfirm={handleSubmitConfirmed}
        onClose={() => setShowSubmitConfirm(false)}
      />
      <ConfirmationPopup
        type="cancel"
        open={showCancelConfirm}
        onConfirm={handleLeaveConfirmed}
        onClose={() => setShowCancelConfirm(false)}
      />
      <ConfirmationPopup
        type="validation"
        open={showValidation}
        validationErrors={validationErrors}
        onClose={() => setShowValidation(false)}
      />
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
