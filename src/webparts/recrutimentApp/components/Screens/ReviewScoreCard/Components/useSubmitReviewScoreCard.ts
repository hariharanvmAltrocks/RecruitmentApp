import * as React from 'react';
import ReviewScoreCardServicesInstance from '../ReviewScoreCardServies/ReviewScoreCardServices';
import { HODDecision, ScorecardCandidateRow, CandidateReviewData, ErrorsType } from '../State/types';
import { ValidationError } from '../Confirmationpopup';
import { isLevel2 } from '../Hooks/useReviewScorecard';
import { RecuritmentHRMsg } from '../../../../utilities/ConditionConfig';
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
  const resetSubmit = React.useCallback(() => {
    setSubmitting(false);
    setSubmitError('');
    setSuccessMessage('');
    setValidationErrors([]);
    setErrors({ decision: false, comment: false, checkbox: false, position: false });
  }, []);
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
    if (newErrors.decision) list.push({ field: 'decision', message: 'HOD Decision (Yes / No / On Hold) is required.' });
    if (newErrors.comment)  list.push({ field: 'comment',  message: 'Feedback Comment is required.' });
    if (newErrors.position) list.push({ field: 'position', message: 'Position ID assignment is required.' });
    if (newErrors.checkbox) list.push({ field: 'checkbox', message: 'Confirmation checkbox must be checked.' });

    setValidationErrors(list);
    return list.length === 0;
  }, [
    reviewingCandidate, hodDecision, decisionComment,
    confirmed, selectedPositionId, shouldShowPositionId,
  ]);

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

      setSuccessMessage(result.message || '');
      // onSuccess called by the component after user closes the success popup
    } catch (e) {
      console.error('[useSubmitReviewScoreCard] submitDecision error:', e);
      setSubmitError(e instanceof Error ? e.message : RecuritmentHRMsg.APIErrorMsg);
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