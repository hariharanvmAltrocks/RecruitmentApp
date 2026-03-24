import * as React from 'react';

export interface Candidate {
  id: string;
  applicantName: string;
  jobTitle: string;
  grade: string;
  nationality: string;
  interviewDate?: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
}

export interface Answer {
  questionId: string;
  rating: number | null;
  remarks: string;
}

export interface ScoreSummary {
  total: number;
  average: number;
  status: 'Pass' | 'Borderline' | 'Fail' | 'Pending';
}

export interface EvaluationPayload {
  candidate: Candidate;
  answers: Record<string, Answer>;
  scoreSummary: ScoreSummary;
}

interface EvaluationContextValue {
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  answers: Record<string, Answer>;
  initializeAnswers: (questions: InterviewQuestion[], existingAnswers?: Record<string, Answer>) => void;
  updateAnswer: (questionId: string, patch: Partial<Answer>) => void;
  scoreSummary: ScoreSummary;
  setScoreSummary: (summary: ScoreSummary) => void;
  resetState: () => void;
}

const initialSummary: ScoreSummary = {
  total: 0,
  average: 0,
  status: 'Pending'
};

const EvaluationContext = React.createContext<EvaluationContextValue | undefined>(undefined);

export function EvaluationProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, Answer>>({});
  const [scoreSummary, setScoreSummary] = React.useState<ScoreSummary>(initialSummary);

  const initializeAnswers = React.useCallback((questions: InterviewQuestion[], existingAnswers?: Record<string, Answer>) => {
    const prepared: Record<string, Answer> = {};

    questions.forEach((question) => {
      const existing = existingAnswers?.[question.id];
      prepared[question.id] = {
        questionId: question.id,
        rating: existing?.rating ?? null,
        remarks: existing?.remarks ?? ''
      };
    });

    setAnswers(prepared);
  }, []);

  const updateAnswer = React.useCallback((questionId: string, patch: Partial<Answer>) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        rating: patch.rating ?? prev[questionId]?.rating ?? null,
        remarks: patch.remarks ?? prev[questionId]?.remarks ?? ''
      }
    }));
  }, []);

  const resetState = React.useCallback(() => {
    setSelectedCandidate(null);
    setAnswers({});
    setScoreSummary(initialSummary);
  }, []);

  React.useEffect(() => {
    const computed = computeSummary(answers);
    setScoreSummary(computed);
  }, [answers]);

  const value = React.useMemo(
    () => ({
      selectedCandidate,
      setSelectedCandidate,
      answers,
      initializeAnswers,
      updateAnswer,
      scoreSummary,
      setScoreSummary,
      resetState
    }),
    [selectedCandidate, setSelectedCandidate, answers, initializeAnswers, updateAnswer, scoreSummary, setScoreSummary, resetState]
  );

  return React.createElement(EvaluationContext.Provider, { value }, children);
}

export function useEvaluationState(): EvaluationContextValue {
  const context = React.useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluationState must be used within EvaluationProvider');
  }
  return context;
}

function computeSummary(answers: Record<string, Answer>): ScoreSummary {
  const ratings = Object.values(answers)
    .map((answer) => answer.rating)
    .filter((rating): rating is number => rating !== null);

  if (ratings.length === 0) {
    return initialSummary;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  const average = parseFloat((total / ratings.length).toFixed(2));

  let status: ScoreSummary['status'] = 'Fail';
  if (average >= 4) {
    status = 'Pass';
  } else if (average >= 3) {
    status = 'Borderline';
  }

  return { total, average, status };
}
