import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  EvaluationProvider,
  useEvaluationState,
  type EvaluationPayload,
  type ScorecardField,
} from './State/CommonStateManagement';

import { useCandidateDetails }  from './Hooks/fetchCandidateDetails';
import { useScoreCard }          from './Hooks/fetchScoreCard';

import CandidateInfo          from './Components/CandidateInfo';
import InterviewQuestionList  from './Components/InterviewQuestion';
import ScorecardDetails       from './Components/ScorecardDetails';


import styles from './Evalution.module.scss';
import { submitScorecard } from './Evaluationservice/Evaluationformservice';



export interface EvalutionProps {
  candidateId: number;
  onBack?: () => void;
}

export const Evalution = (props: any) => {
  const location = useLocation();
  const stateCandidateId = location.state?.ID;
  const candidateId = Number(stateCandidateId || props.ID || 0);

  console.log("Evalution router props", { stateCandidateId, propsID: props.ID, candidateId });

  return (
    <EvaluationProvider>
      <EvalutionContent candidateId={candidateId} onBack={props.onBack} />
    </EvaluationProvider>
  );
}

function EvalutionContent({
  candidateId,
  onBack,
}: EvalutionProps): JSX.Element {
  const navigate = useNavigate();

  const handleCancel = React.useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate('/RecruitmentTable');
    }
  }, [navigate, onBack]);

  console.log('[EvalutionContent] render', { candidateId });

  // ── Data fetching ─────────────────────────────────────────────────────────
  // useCandidateDetails now fetches candidate + questions in one service call
  const {
    candidate,
    questions,
    loading:  candidateLoading,
    error:    candidateError,
    reload:   reloadCandidate,
  } = useCandidateDetails({ candidateId, });

  const {
    data:    scoreCardData,
    loading: scoreCardLoading,
    error:   scoreCardError,
    reload:  reloadScoreCard,
  } = useScoreCard(candidateId);

  // ── Context state ─────────────────────────────────────────────────────────
  const {
    answers, initializeAnswers, updateAnswer,
    scorecard, updateScorecard,
    recommendation, setRecommendation,
    overallFeedback, setOverallFeedback,
    acknowledged, setAcknowledged,
  } = useEvaluationState();

  // ── Validation errors ─────────────────────────────────────────────────────
  const [ratingErrors,    setRatingErrors]    = React.useState<Record<number, boolean>>({});
  const [scorecardErrors, setScorecardErrors] = React.useState<Record<string, boolean>>({});
  const [recError,        setRecError]        = React.useState(false);
  const [feedbackError,   setFeedbackError]   = React.useState(false);
  const [ackError,        setAckError]        = React.useState(false);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [alertMsg,   setAlertMsg]   = React.useState('');
  const [alertType,  setAlertType]  = React.useState<'success' | 'error' | ''>('');
  const [submitting, setSubmitting] = React.useState(false);

  // ── Seed answers when questions arrive ───────────────────────────────────
  React.useEffect(() => {
    if (questions.length > 0) {
      initializeAnswers(questions, scoreCardData?.answers);
    }
  }, [questions, scoreCardData?.answers, initializeAnswers]);

  const isLoading = candidateLoading || scoreCardLoading;
  const hasError  = !!(candidateError || scoreCardError);

  const handleRetry = React.useCallback(() => {
    reloadCandidate();
    reloadScoreCard();
  }, [reloadCandidate, reloadScoreCard]);

  const handleAnswerChange = React.useCallback(
    (questionId: number, patch: Parameters<typeof updateAnswer>[1]) => {
      updateAnswer(questionId, patch);
      if (patch.rating !== undefined)
        setRatingErrors((prev) => ({ ...prev, [questionId]: false }));
    },
    [updateAnswer]
  );

  const handleScorecardChange = React.useCallback(
    (key: keyof ScorecardField, value: number) => {
      updateScorecard(key, value);
      setScorecardErrors((prev) => ({ ...prev, [key]: false }));
    },
    [updateScorecard]
  );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = React.useCallback(async () => {
    console.log('[Evalution] handleSubmit start', { candidate, answers, scorecard, recommendation, overallFeedback });
    let valid = true;

    const newRatingErrors: Record<number, boolean> = {};
    questions.forEach((q) => {
      if (answers[q.id]?.rating == null) { newRatingErrors[q.id] = true; valid = false; }
    });
    setRatingErrors(newRatingErrors);

    const newScorecardErrors: Record<string, boolean> = {};
    (Object.keys(scorecard) as (keyof ScorecardField)[]).forEach((key) => {
      if (scorecard[key] === null) { newScorecardErrors[key] = true; valid = false; }
    });
    setScorecardErrors(newScorecardErrors);

    if (!recommendation)         { setRecError(true);      valid = false; } else setRecError(false);
    if (!overallFeedback.trim()) { setFeedbackError(true); valid = false; } else setFeedbackError(false);
    if (!acknowledged)           { setAckError(true);      valid = false; } else setAckError(false);

    if (!valid) {
      setAlertMsg('Please complete all required fields before submitting.');
      setAlertType('error');
      return;
    }
    if (!candidate?.currentUserPanelId) {
      setAlertMsg('Could not identify your panel entry. Please contact HR.');
      setAlertType('error');
      return;
    }

    setSubmitting(true);
  
    try {
      const currentRoleIDs = candidate.currentRoleIDs || [4];
      const roleId = currentRoleIDs.includes(4) ? 4 : (currentRoleIDs[0] || 0);
      console.log('[Evalution] selected roleId for submit', roleId);

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
        overallFeedback,
        questionScores: Object.values(answers).map((a) => ({
          id:     a.questionId,
          rating: a.rating,
        })),
      });

      if (result.success) {
        setAlertMsg(result.message);
        setAlertType('success');
        console.log('[Evalution] submit success', result);
        setTimeout(() => {
          navigate('/RecruitmentTable');
        }, 700);
      } else {
        setAlertMsg(result.message);
        setAlertType('error');
        console.warn('[Evalution] submit failed', result);
      }
    } catch (err) {
      console.error('[Evalution] submit exception', err);
      setAlertMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setAlertType('error');
    } finally {
      setSubmitting(false);
    }
  }, [
    questions, answers, scorecard, recommendation, overallFeedback,
    acknowledged, candidate,
  ]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading evaluation form…</p>
      </div>
    );
  }

  const alertClass = [
    styles.alert,
    alertType === 'error'   ? styles.alertError   : '',
    alertType === 'success' ? styles.alertSuccess : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.root}>

      {alertMsg && (
        <div className={alertClass}>
          <span>{alertMsg}</span>
          <button className={styles.alertClose} onClick={() => { setAlertMsg(''); setAlertType(''); }}>✕</button>
        </div>
      )}

      {hasError && (
        <div className={styles.errorBanner}>
          <span>We could not load all evaluation data. Please try again.</span>
          <button className={styles.retryBtn} onClick={handleRetry}>Retry</button>
        </div>
      )}

      <div className={styles.layout}>
        <CandidateInfo candidate={candidate} />

        <main className={styles.rightPanel}>
          <InterviewQuestionList
            questions={questions}
            answers={answers}
            ratingErrors={ratingErrors}
            onAnswerChange={handleAnswerChange}
          />

          <div className={questions.length > 0 ? styles.scorecardMargin : ''}>
            <ScorecardDetails
              scorecard={scorecard}
              scorecardErrors={scorecardErrors}
              onScorecardChange={handleScorecardChange}
              recommendation={recommendation}
              recError={recError}
              onRecommendationChange={(r) => { setRecommendation(r); setRecError(false); }}
              overallFeedback={overallFeedback}
              feedbackError={feedbackError}
              onFeedbackChange={(v) => { setOverallFeedback(v); if (v.trim()) setFeedbackError(false); }}
              acknowledged={acknowledged}
              ackError={ackError}
              onAcknowledgedChange={(b) => { setAcknowledged(b); if (b) setAckError(false); }}
              candidate={candidate}
            />
          </div>

          <div className={styles.footer}>
            <button className={styles.cancelBtn} onClick={handleCancel} disabled={submitting}>Cancel</button>
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitting || !acknowledged}
            >
              {submitting ? 'Submitting…' : '+ Submit Evaluation'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}