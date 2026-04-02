
import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from '../ReviewScorecard.module.scss';
import { useSubmitReviewScoreCard, SubmitHookDeps } from './useSubmitReviewScoreCard';


interface SubmitReviewScoreCardProps extends SubmitHookDeps {
  roleId:     number;
  compact?:   boolean;
  className?: string;
}

const SubmitReviewScoreCard: React.FC<SubmitReviewScoreCardProps> = ({
  roleId,
  compact   = false,
  className = '',
  ...hookDeps
}) => {
  const {
    submitting,
    submitError,
    successMessage,
    errors,
    submitDecision,
  } = useSubmitReviewScoreCard(hookDeps);

  const handleClick = React.useCallback(() => {
    void submitDecision(roleId);
  }, [submitDecision, roleId]);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

      {successMessage && (
        <div style={{
          background:   '#dcfce7',
          border:       '1px solid #22c55e',
          color:        '#166534',
          padding:      '0.6rem 0.8rem',
          borderRadius: '0.45rem',
          fontWeight:   600,
          fontSize:     '0.875rem',
        }}>
          {successMessage}
        </div>
      )}

      {submitError && (
        <div className={styles.mSubmitError}>{submitError}</div>
      )}
      {(errors.decision || errors.comment || errors.checkbox || errors.position) && (
        <ul style={{ margin: 0, padding: '0 0 0 1.1rem', color: '#ef4444', fontSize: '0.75rem' }}>
          {errors.decision && <li>Please select a decision (Yes / No / On Hold).</li>}
          {errors.comment  && <li>Feedback / comment is required.</li>}
          {errors.checkbox && <li>Please confirm the decision by checking the checkbox.</li>}
          {errors.position && <li>Please assign a Position ID for the selected candidate.</li>}
        </ul>
      )}

      <button
        className={styles.mSubmitBtn}
        onClick={handleClick}
        disabled={submitting || !hookDeps.hodDecision}
        style={{ alignSelf: 'flex-end' }}
      >
        {submitting ? (
          'Submitting…'
        ) : compact ? (
          <CheckCircle2 size={15} />
        ) : (
          <>
            <CheckCircle2 size={15} style={{ marginRight: 6 }} />
            SUBMIT ACTION
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitReviewScoreCard;