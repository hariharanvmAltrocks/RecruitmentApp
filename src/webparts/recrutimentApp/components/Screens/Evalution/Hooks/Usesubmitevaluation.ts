// Components/useSubmitEvaluation.ts
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors useSubmitReviewScoreCard pattern exactly.
// Validation → returns ValidationError[] for popup display.
// submit / reset / validate logic is self-contained.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react';
import { submitScorecard } from '../Evaluationservice/Evaluationformservice';
import type {
  ScorecardField,
  Recommendation,
  Candidate,
  Answer,
  InterviewQuestion,
} from '../State/CommonStateManagement';
import { ValidationError } from '../../ReviewScoreCard/Confirmationpopup';
// ── Deps shape ────────────────────────────────────────────────────────────────

export interface SubmitEvalDeps {
  candidateId:        number;
  candidate:          Candidate | null;
  questions:          InterviewQuestion[];
  answers:            Record<number, Answer>;
  scorecard:          ScorecardField;
  recommendation:     Recommendation;
  overallFeedback:    string;
  evaluationFeedback: string;
  shouldShowTextArea: boolean;
  acknowledged:       boolean;
  /** Called after success popup closes → navigate away / refresh */
  onSuccess: () => void;
}

// ── Return shape ──────────────────────────────────────────────────────────────

export interface UseSubmitEvaluationReturn {
  submitting:        boolean;
  submitError:       string;
  successMessage:    string;
  validationErrors:  ValidationError[];

  // field-level error maps → passed to InterviewQuestionList / ScorecardDetails
  ratingErrors:      Record<number, boolean>;
  scorecardErrors:   Record<string, boolean>;
  recError:          boolean;
  feedbackError:     boolean;
  evalFeedbackError: boolean;
  ackError:          boolean;

  /** Returns true if valid, false + populates validationErrors if not */
  runValidation: () => boolean;
  /** Fire after runValidation() returns true */
  submitEval:    () => Promise<void>;
  resetSubmit:   () => void;
  /** Stable ref to onSuccess — call after success popup closes */
  onSuccess:     () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSubmitEvaluation(deps: SubmitEvalDeps): UseSubmitEvaluationReturn {
  const {
    candidateId, candidate, questions, answers, scorecard,
    recommendation, overallFeedback, evaluationFeedback,
    shouldShowTextArea, acknowledged, onSuccess,
  } = deps;

  const [submitting,        setSubmitting]       = React.useState(false);
  const [submitError,       setSubmitError]      = React.useState('');
  const [successMessage,    setSuccessMessage]   = React.useState('');
  const [validationErrors,  setValidationErrors] = React.useState<ValidationError[]>([]);

  const [ratingErrors,      setRatingErrors]      = React.useState<Record<number, boolean>>({});
  const [scorecardErrors,   setScorecardErrors]   = React.useState<Record<string, boolean>>({});
  const [recError,          setRecError]          = React.useState(false);
  const [feedbackError,     setFeedbackError]     = React.useState(false);
  const [evalFeedbackError, setEvalFeedbackError] = React.useState(false);
  const [ackError,          setAckError]          = React.useState(false);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetSubmit = React.useCallback(() => {
    setSubmitting(false);
    setSubmitError('');
    setSuccessMessage('');
    setValidationErrors([]);
    setRatingErrors({});
    setScorecardErrors({});
    setRecError(false);
    setFeedbackError(false);
    setEvalFeedbackError(false);
    setAckError(false);
  }, []);

  // ── Validate → build ValidationError list ────────────────────────────────
  const runValidation = React.useCallback((): boolean => {
    const errors: ValidationError[] = [];

    // 1. Per-question ratings
    const newRatingErrors: Record<number, boolean> = {};
    questions.forEach((q, idx) => {
      if (answers[q.id]?.rating == null) {
        newRatingErrors[q.id] = true;
        errors.push({ field: `Q${idx + 1}`, message: `Question ${idx + 1}: Rating is required` });
      }
    });
    setRatingErrors(newRatingErrors);

    // 2. Scorecard fields
    const newScorecardErrors: Record<string, boolean> = {};
    (Object.keys(scorecard) as (keyof ScorecardField)[]).forEach((key) => {
      if (scorecard[key] === null) {
        newScorecardErrors[key] = true;
        errors.push({
          field:   key,
          message: `Scorecard — ${key.replace(/([A-Z])/g, ' $1').trim()} is required`,
        });
      }
    });
    setScorecardErrors(newScorecardErrors);

    // 3. Recommendation
    if (!recommendation) {
      setRecError(true);
      errors.push({ field: 'recommendation', message: 'Consider for Employment: selection is required' });
    } else {
      setRecError(false);
    }

    // 4. Conditional eval feedback (shown when any scorecard score ≤ 2)
    if (shouldShowTextArea && !evaluationFeedback.trim()) {
      setEvalFeedbackError(true);
      errors.push({ field: 'evaluationFeedback', message: 'Feedback for ratings below 3 is required' });
    } else {
      setEvalFeedbackError(false);
    }

    // 5. Overall feedback
    if (!overallFeedback.trim()) {
      setFeedbackError(true);
      errors.push({ field: 'overallFeedback', message: 'Overall Evaluation Feedback is required' });
    } else {
      setFeedbackError(false);
    }

    // 6. Acknowledgement checkbox
    if (!acknowledged) {
      setAckError(true);
      errors.push({ field: 'acknowledged', message: 'Please tick the acknowledgement checkbox' });
    } else {
      setAckError(false);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [
    questions, answers, scorecard, recommendation,
    shouldShowTextArea, evaluationFeedback, overallFeedback, acknowledged,
  ]);

  // ── Submit ───────────────────────────────────────────────────────────────
  const submitEval = React.useCallback(async () => {
    if (!candidate?.currentUserPanelId) {
      setSubmitError('Could not identify your panel entry. Please contact HR.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const currentRoleIDs          = candidate.currentRoleIDs || [4];
      const roleId                  = currentRoleIDs.includes(4) ? 4 : (currentRoleIDs[0] || 0);
      const questionScoresFormatted = questions.map((q, idx) => ({
        [`Q${idx + 1}`]: answers[q.id]?.rating ?? 0,
      }));

      const result = await submitScorecard({
        recruitmentId:         candidate.recruitmentId!,
        panelId:               candidate.currentUserPanelId,
        roleId,
        interviewPersonNameId: candidate.currentUserGuid ?? '',
        qualifications:        scorecard.Qualifications,
        experience:            scorecard.Experience,
        knowledge:             scorecard.Knowledge,
        energyLevel:           scorecard.EnergyLevel,
        jobRequirements:       scorecard.JobRequirements,
        cultureFit:            scorecard.CultureFit,
        expatLocal:            scorecard.ExpatLocal,
        otherCriteria:         scorecard.OtherCriteria,
        recommendation:        recommendation!,
        evaluationFeedback:    shouldShowTextArea ? evaluationFeedback : '',
        overallFeedback,
        questionScores:        questionScoresFormatted,
        candidateId,
        jobRequestId:          candidate.jobRequestId ?? '',
      });

      if (!result.success) {
        setSubmitError(result.message || 'Submission failed. Please try again.');
        return;
      }

      setSuccessMessage(result.message || 'Evaluation submitted successfully!');
      // onSuccess called by SubmitEvaluation component after user closes success popup
    } catch (err) {
      console.error('[useSubmitEvaluation] submitEval error:', err);
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [
    candidate, candidateId, questions, answers, scorecard,
    recommendation, overallFeedback, evaluationFeedback, shouldShowTextArea,
  ]);

  return {
    submitting, submitError, successMessage, validationErrors,
    ratingErrors, scorecardErrors, recError, feedbackError, evalFeedbackError, ackError,
    runValidation, submitEval, resetSubmit,
    onSuccess,   
  };
}