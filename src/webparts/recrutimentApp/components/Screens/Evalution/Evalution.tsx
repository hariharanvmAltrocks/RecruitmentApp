import * as React from 'react';
import { useCandidateDetails } from './Hooks/fetchCandidateDetails';
import { useQuestionBank } from './Hooks/fetchQuestionBank';
import { useScoreCard } from './Hooks/fetchScoreCard';
import {
  EvaluationProvider,
  useEvaluationState,
  type Answer,
  type EvaluationPayload
} from './State/CommonStateManagement';
import CandidateInfo from './Components/CandidateInfo';
import InterviewQuestionList from './Components/InterviewQuestion';
import ScorecardDetails from './Components/ScorecardDetails';
import { handleSubmitEvaluation } from './SaveForm/handleSubmitEvaluation';
import styles from './Evalution.module.scss';

export default function Evalution(): JSX.Element {
  return (
    <EvaluationProvider>
      <EvalutionContent />
    </EvaluationProvider>
  );
}

function EvalutionContent(): JSX.Element {
  const { data: candidate, loading: candidateLoading, error: candidateError, reload: reloadCandidate } = useCandidateDetails();
  const { data: questions, loading: questionsLoading, error: questionsError, reload: reloadQuestions } = useQuestionBank();
  const { data: scoreCard, loading: scoreCardLoading, error: scoreCardError, reload: reloadScoreCard } = useScoreCard();

  const {
    selectedCandidate,
    setSelectedCandidate,
    answers,
    initializeAnswers,
    updateAnswer,
    scoreSummary
  } = useEvaluationState();

  const [submitState, setSubmitState] = React.useState<{ loading: boolean; error?: string; success?: string }>({ loading: false });

  React.useEffect(() => {
    if (candidate) {
      setSelectedCandidate(candidate);
    }
  }, [candidate, setSelectedCandidate]);

  React.useEffect(() => {
    if (questions && questions.length > 0) {
      initializeAnswers(questions, scoreCard?.answers);
    }
  }, [questions, scoreCard?.answers, initializeAnswers]);

  const isLoading = candidateLoading || questionsLoading || scoreCardLoading;
  const hasError = candidateError || questionsError || scoreCardError;

  const handleRetry = React.useCallback(() => {
    reloadCandidate();
    reloadQuestions();
    reloadScoreCard();
  }, [reloadCandidate, reloadQuestions, reloadScoreCard]);

  const handleAnswerChange = React.useCallback(
    (questionId: string, patch: Partial<Answer>) => {
      updateAnswer(questionId, patch);
    },
    [updateAnswer]
  );

  const onSubmit = React.useCallback(async () => {
    if (!selectedCandidate) {
      setSubmitState({ loading: false, error: 'Please select a candidate before submitting.' });
      return;
    }

    setSubmitState({ loading: true });

    const payload: EvaluationPayload = {
      candidate: selectedCandidate,
      answers,
      scoreSummary
    };

    try {
      const result = await handleSubmitEvaluation(payload);
      if (result.success) {
        setSubmitState({ loading: false, success: result.message });
      } else {
        setSubmitState({ loading: false, error: result.message });
      }
    } catch (error) {
      setSubmitState({ loading: false, error: error instanceof Error ? error.message : 'Failed to submit evaluation.' });
    }
  }, [answers, scoreSummary, selectedCandidate]);

  return (
    <div className={`min-h-screen bg-slate-50 ${styles.pageRoot}`}>
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Candidate Evaluation</h2>
          <p className="text-sm text-slate-500">Complete the assessment to record interview feedback and scoring.</p>
        </header>

        {hasError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700 flex items-center justify-between">
            <span>We could not load all evaluation data. Please try again.</span>
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-lg bg-white border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
            <div>
              <div className="text-sm font-semibold text-slate-700">Loading evaluation data</div>
              <div className="text-xs text-slate-500">Fetching candidate details, questions, and scorecard.</div>
            </div>
          </div>
        )}

        {!isLoading && !hasError && (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <CandidateInfo candidate={candidate} />

            <div className="flex flex-col gap-6">
              <InterviewQuestionList
                questions={questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
              />

              <ScorecardDetails summary={scoreSummary} />

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm text-slate-500">
                  {submitState.error && <span className="text-rose-600 font-semibold">{submitState.error}</span>}
                  {submitState.success && <span className="text-emerald-600 font-semibold">{submitState.success}</span>}
                </div>
                <button
                  onClick={onSubmit}
                  disabled={submitState.loading}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitState.loading ? 'Submitting...' : 'Submit Evaluation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
