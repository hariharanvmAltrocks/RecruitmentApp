// Hooks/useSubmitReviewScoreCard.ts
// ─────────────────────────────────────────────────────────────────────────────
// Standalone submit hook — submit logic மட்டும் இங்கே இருக்கும்.
// useReviewScorecard-இல் இருந்து தனியாக பிரிக்கப்பட்டது.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react';
import ReviewScoreCardServicesInstance from '../ReviewScoreCardServies/ReviewScoreCardServices';
import { HODDecision, ScorecardCandidateRow, CandidateReviewData, ErrorsType } from '../State/types';
import { isLevel2 } from '../Hooks/useReviewScorecard';

// ── Input deps ────────────────────────────────────────────────────────────────

export interface SubmitHookDeps {
  reviewingCandidate:   ScorecardCandidateRow | null;
  reviewData:           CandidateReviewData | null;
  hodDecision:          HODDecision;
  decisionComment:      string;
  confirmed:            boolean;
  selectedPositionId:   number | null;
  currentUserEmail:     string;
  shouldShowPositionId: (statusId: number, decision: HODDecision) => boolean;
  /** Called after a successful submit — e.g. closeReview() + refreshCandidates() */
  onSuccess:            () => Promise<void>;
}

// ── Return ────────────────────────────────────────────────────────────────────

export interface UseSubmitReviewScoreCardReturn {
  submitting:     boolean;
  submitError:    string;
  successMessage: string;
  errors:         ErrorsType;
  setErrors:      React.Dispatch<React.SetStateAction<ErrorsType>>;
  submitDecision: (roleId: number) => Promise<void>;
  resetSubmit:    () => void;
}

export function useSubmitReviewScoreCard(deps: SubmitHookDeps): UseSubmitReviewScoreCardReturn {
  const {
    reviewingCandidate,
    reviewData,
    hodDecision,
    decisionComment,
    confirmed,
    selectedPositionId,
    currentUserEmail,
    shouldShowPositionId,
    onSuccess,
  } = deps;

  const [submitting,     setSubmitting]     = React.useState(false);
  const [submitError,    setSubmitError]    = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errors, setErrors] = React.useState<ErrorsType>({
    decision: false,
    comment:  false,
    checkbox: false,
    position: false,
  });
  const resetSubmit = React.useCallback(() => {
    setSubmitting(false);
    setSubmitError('');
    setSuccessMessage('');
    setErrors({ decision: false, comment: false, checkbox: false, position: false });
  }, []);
  const validate = React.useCallback(
    (statusId: number, decision: HODDecision): boolean => {
      const lv2 = isLevel2(statusId);
      const newErrors: ErrorsType = {
        decision: lv2 ? false : !decision,
        comment:  !decisionComment.trim(),
        checkbox: !confirmed,
        position:
          !lv2 &&
          decision === 'Yes' &&
          shouldShowPositionId(statusId, decision) &&
          !selectedPositionId,
      };
      setErrors(newErrors);
      if (!lv2 && newErrors.decision) {
        setSubmitError('Please select a decision.');
      } else if (Object.values(newErrors).some(Boolean)) {
        setSubmitError('Please fill in all required fields.');
      } else {
        setSubmitError('');
      }
      return Object.values(newErrors).every(v => !v);
    },
    [decisionComment, confirmed, selectedPositionId, shouldShowPositionId],
  );
  const submitDecision = React.useCallback(
    async (roleId: number) => {
      if (!reviewingCandidate) return;
      setSubmitError('');

      if (!validate(reviewingCandidate.statusId, hodDecision)) return;

      setSubmitting(true);
      try {
        const jobRequestId = (reviewData?.candidateData as any)?.jobRequestId ?? null;

        const result = await ReviewScoreCardServicesInstance.submitHODDecision({
          candidateId:      reviewingCandidate.id,
          hodDecision,
          comments:         decisionComment,
          currentUserEmail,
          currentRoleId:    roleId,
          gpa:              reviewingCandidate.gpa || '',
          positionId:       selectedPositionId,
          isLevel2:         isLevel2(reviewingCandidate.statusId),
          jobCodeID:        reviewingCandidate.jobCodeID || 0,
          recruitmentID:    reviewingCandidate.recruitmentID,
          statusId:         reviewingCandidate.statusId,
          scoreCardId:      (reviewData?.candidateData as any)?.level2ScorecardId ?? null,
          jobRequestId,
        });

        if (!result.success) {
          setSubmitError(result.message || 'Submission failed.');
          return;
        }

        setSuccessMessage(result.message);
        setTimeout(async () => {
          setSuccessMessage('');
          await onSuccess();
        }, 1200);
      } catch (e) {
        console.error('[useSubmitReviewScoreCard] submitDecision error:', e);
        setSubmitError(
          e instanceof Error ? e.message : 'Submission failed. Please try again.',
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      reviewingCandidate, reviewData, hodDecision, decisionComment,
      currentUserEmail, selectedPositionId, validate, onSuccess,
    ],
  );

  return { submitting, submitError, successMessage, errors, setErrors, submitDecision, resetSubmit };
}