// Components/useSubmitReviewScoreCard.ts
// Validation → returns ValidationError[] for popup display.
// submit / reset / validate logic unchanged.

import * as React from 'react';
import ReviewScoreCardServicesInstance from '../ReviewScoreCardServies/ReviewScoreCardServices';
import { HODDecision, ScorecardCandidateRow, CandidateReviewData, ErrorsType } from '../State/types';
import { isLevel2 } from '../Hooks/useReviewScorecard';
import { ValidationError } from '../Confirmationpopup';

export interface SubmitHookDeps {
  reviewingCandidate:   ScorecardCandidateRow | null;
  reviewData:           CandidateReviewData | null;
  hodDecision:          HODDecision;
  decisionComment:      string;
  confirmed:            boolean;
  selectedPositionId:   number | null;
  currentUserEmail:     string;
  shouldShowPositionId: (statusId: number, decision: HODDecision) => boolean;
  onSuccess:            () => Promise<void>;
}

export interface UseSubmitReviewScoreCardReturn {
  submitting:        boolean;
  submitError:       string;
  successMessage:    string;
  errors:            ErrorsType;
  validationErrors:  ValidationError[];   // ← for popup list
  setErrors:         React.Dispatch<React.SetStateAction<ErrorsType>>;
  submitDecision:    (roleId: number) => Promise<void>;
  resetSubmit:       () => void;
  /** Returns true if valid, false + sets validationErrors if not */
  runValidation:     () => boolean;
}

export function useSubmitReviewScoreCard(deps: SubmitHookDeps): UseSubmitReviewScoreCardReturn {
  const {
    reviewingCandidate, reviewData, hodDecision, decisionComment,
    confirmed, selectedPositionId, currentUserEmail,
    shouldShowPositionId, onSuccess,
  } = deps;

  const [submitting,       setSubmitting]       = React.useState(false);
  const [submitError,      setSubmitError]       = React.useState('');
  const [successMessage,   setSuccessMessage]    = React.useState('');
  const [validationErrors, setValidationErrors]  = React.useState<ValidationError[]>([]);
  const [errors, setErrors] = React.useState<ErrorsType>({
    decision: false, comment: false, checkbox: false, position: false,
  });

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetSubmit = React.useCallback(() => {
    setSubmitting(false);
    setSubmitError('');
    setSuccessMessage('');
    setValidationErrors([]);
    setErrors({ decision: false, comment: false, checkbox: false, position: false });
  }, []);

  // ── Validate → build ValidationError list ─────────────────────────────────
  const runValidation = React.useCallback((): boolean => {
    if (!reviewingCandidate) return false;
    const lv2      = isLevel2(reviewingCandidate.statusId);
    const sid      = reviewingCandidate.statusId;
    const decision = hodDecision;

    const newErrors: ErrorsType = {
      decision: lv2 ? false : !decision,
      comment:  !decisionComment.trim(),
      checkbox: !confirmed,
      position:
        !lv2 &&
        decision === 'Yes' &&
        shouldShowPositionId(sid, decision) &&
        !selectedPositionId,
    };
    setErrors(newErrors);

    const list: ValidationError[] = [];
    if (newErrors.decision) list.push({ field: 'decision', message: 'Decision is required — please select Yes, No, or On Hold.' });
    if (newErrors.comment)  list.push({ field: 'comment',  message: 'Feedback / comment is required.' });
    if (newErrors.checkbox) list.push({ field: 'checkbox', message: 'Please confirm the decision by checking the checkbox.' });
    if (newErrors.position) list.push({ field: 'position', message: 'Please assign a Position ID for the selected candidate.' });

    setValidationErrors(list);
    return list.length === 0;
  }, [
    reviewingCandidate, hodDecision, decisionComment,
    confirmed, selectedPositionId, shouldShowPositionId,
  ]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const submitDecision = React.useCallback(async (roleId: number) => {
    if (!reviewingCandidate) return;
    setSubmitError('');

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

      setSuccessMessage(result.message || '✓ Decision submitted successfully.');
      // onSuccess called by the component after user closes the success popup
    } catch (e) {
      console.error('[useSubmitReviewScoreCard] submitDecision error:', e);
      setSubmitError(e instanceof Error ? e.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [
    reviewingCandidate, reviewData, hodDecision, decisionComment,
    currentUserEmail, selectedPositionId, onSuccess,
  ]);

  return {
    submitting, submitError, successMessage, errors, validationErrors,
    setErrors, submitDecision, resetSubmit, runValidation,
  };
}