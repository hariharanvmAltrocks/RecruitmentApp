import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  EvaluationProvider,
  useEvaluationState,
  type ScorecardField,
} from "./State/CommonStateManagement";
import { useCandidateDetails } from "./Hooks/fetchCandidateDetails";
import { useScoreCard } from "./Hooks/fetchScoreCard";
import CandidateInfo from "./Components/CandidateInfo";
import InterviewQuestionList from "./Components/InterviewQuestion";
import ScorecardDetails from "./Components/ScorecardDetails";

import styles from "./Evalution.module.scss";
import { useSubmitEvaluation } from "./Hooks/Usesubmitevaluation";
import SubmitEvaluation from "./Components/Submitevaluation";
import { StatusId } from "../../../utilities/Config";
import Loading from "../../Comman/Loading/loading";

export interface EvalutionProps {
  candidateId: number;
  onBack?: () => void;
  StatusID?: number;
  InterviewLevels?: string;
}
export const Evalution = (props: any) => {
  const location = useLocation();
  const stateCandidateId = location.state?.ID;
  const candidateId = Number(stateCandidateId || props.ID || 0);

  console.log(
    "[Evalution] candidateId:",
    candidateId,
    "from state:",
    stateCandidateId,
    "props:",
    props.ID,
  );

  return (
    <EvaluationProvider>
      <EvalutionContent
        candidateId={candidateId}
        onBack={props.onBack}
        StatusID={props.StatusID}
        InterviewLevels={props.InterviewLevels}
      />
    </EvaluationProvider>
  );
};

function EvalutionContent({
  candidateId,
  onBack,
  StatusID,
  InterviewLevels,
}: EvalutionProps): JSX.Element {
  const navigate = useNavigate();

  const goBack = React.useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate("/RecruitmentTable");
    }
  }, [navigate, onBack]);

  const {
    candidate,
    questions,
    loading: candidateLoading,
    error: candidateError,
    reload: reloadCandidate,
  } = useCandidateDetails({ candidateId, InterviewLevels });

  const {
    data: scoreCardData,
    loading: scoreCardLoading,
    error: scoreCardError,
    reload: reloadScoreCard,
  } = useScoreCard(candidateId);

  const {
    answers,
    initializeAnswers,
    updateAnswer,
    scorecard,
    updateScorecard,
    recommendation,
    setRecommendation,
    overallFeedback,
    setOverallFeedback,
    evaluationFeedback,
    setEvaluationFeedback,
    acknowledged,
    setAcknowledged,
  } = useEvaluationState();
  React.useEffect(() => {
    if (questions.length > 0)
      initializeAnswers(questions, scoreCardData?.answers);
  }, [questions, scoreCardData?.answers, initializeAnswers]);

  const shouldShowTextArea = React.useMemo(
    () => Object.values(scorecard).some((v) => v !== null && Number(v) <= 2),
    [scorecard],
  );

  const isLoading = candidateLoading || scoreCardLoading;
  const hasError =
    !!(candidateError || scoreCardError) || questions.length === 0;

  const handleRetry = React.useCallback(() => {
    reloadCandidate();
    reloadScoreCard();
  }, [reloadCandidate, reloadScoreCard]);
  const handleSuccess = React.useCallback(async () => {
    goBack();
  }, [goBack]);
  const submitHook = useSubmitEvaluation({
    candidateId,
    candidate,
    questions,
    answers,
    scorecard,
    recommendation,
    overallFeedback,
    evaluationFeedback,
    shouldShowTextArea,
    acknowledged,
    onSuccess: handleSuccess,
  });

  if (isLoading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading evaluation form…</p>
      </div>
    );
  }
  return (
    <div className={styles.root}>
      {hasError && (
        <div className={styles.errorBanner}>
          <span>We could not load all evaluation data. Please try again.</span>
          <button className={styles.retryBtn} onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}
      {submitHook.submitting && <Loading />}

      <div className={styles.layout}>
        <CandidateInfo candidate={candidate} />

        <main className={styles.rightPanel}>
          <InterviewQuestionList
            questions={questions}
            answers={answers}
            ratingErrors={submitHook.ratingErrors}
            onAnswerChange={(qId, patch) => updateAnswer(qId, patch)}
          />
          <div className={questions.length > 0 ? styles.scorecardMargin : ""}>
            <ScorecardDetails
              scorecard={scorecard}
              scorecardErrors={submitHook.scorecardErrors}
              onScorecardChange={(key, val) => updateScorecard(key, val)}
              recommendation={recommendation}
              recError={submitHook.recError}
              onRecommendationChange={setRecommendation}
              overallFeedback={overallFeedback}
              feedbackError={submitHook.feedbackError}
              onFeedbackChange={setOverallFeedback}
              evaluationFeedback={evaluationFeedback}
              evalFeedbackError={submitHook.evalFeedbackError}
              onEvalFeedbackChange={setEvaluationFeedback}
              acknowledged={acknowledged}
              ackError={submitHook.ackError}
              onAcknowledgedChange={setAcknowledged}
              candidate={candidate}
            />
          </div>
          <SubmitEvaluation
            submitHook={submitHook}
            acknowledged={acknowledged}
            onCancel={goBack}
          />
        </main>
      </div>
    </div>
  );
}
