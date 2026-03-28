import * as React from 'react';

// ── Domain types ──────────────────────────────────────────────────────────────

export interface Candidate {
  id: number;
  applicantName: string;
  jobTitle: string;
  grade: string;
  nationality: string;
  gender?: string;
  qualification?: string;
  miningExp?: string;
  relevantExp?: string;
  interviewDate?: string;
  interviewLevel?: string;
  disability?: string;
  conflictsOfInterest?: string;
  panelMembers?: string[];
  reviewerName?: string;
  jobTitleEn?: string;
  jobTitleFr?: string;
  currentUserPanelId?: number | null;
  currentUserGuid?: string | null;
  recruitmentId?: number;
  jobCodeID?: number;
  currentRoleIDs?: number[];
}

export interface InterviewQuestion {
  id: number;
  text: string;
  expectedResponse?: string;
}

export interface Answer {
  questionId: number;
  rating: number | null;
  remarks: string;
}

export interface ScorecardField {
  Qualifications: number | null;
  Experience: number | null;
  Knowledge: number | null;
  EnergyLevel: number | null;
  JobRequirements: number | null;
  CultureFit: number | null;
  ExpatLocal: number | null;
  OtherCriteria: number | null;
}

export interface ScoreSummary {
  total: number;
  average: number;
  status: 'Pass' | 'Borderline' | 'Fail' | 'Pending';
}

export type Recommendation = 'consider' | 'doNotConsider' | null;

export interface EvaluationPayload {
  candidate: Candidate;
  answers: Record<number, Answer>;
  scorecard: ScorecardField;
  recommendation: Recommendation;
  overallFeedback: string;
}

// ── Context value ─────────────────────────────────────────────────────────────

interface EvaluationContextValue {
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (candidate: Candidate | null) => void;

  answers: Record<number, Answer>;
  initializeAnswers: (
    questions: InterviewQuestion[],
    existingAnswers?: Record<number, Answer>
  ) => void;
  updateAnswer: (questionId: number, patch: Partial<Answer>) => void;

  scorecard: ScorecardField;
  updateScorecard: (key: keyof ScorecardField, value: number) => void;

  recommendation: Recommendation;
  setRecommendation: (r: Recommendation) => void;

  overallFeedback: string;
  setOverallFeedback: (s: string) => void;

  acknowledged: boolean;
  setAcknowledged: (b: boolean) => void;

  scoreSummary: ScoreSummary;

  resetState: () => void;
}

// ── Initial values ────────────────────────────────────────────────────────────

const initialScorecard: ScorecardField = {
  Qualifications: null,
  Experience: null,
  Knowledge: null,
  EnergyLevel: null,
  JobRequirements: null,
  CultureFit: null,
  ExpatLocal: null,
  OtherCriteria: null,
};

const initialSummary: ScoreSummary = {
  total: 0,
  average: 0,
  status: 'Pending',
};

// ── Context ───────────────────────────────────────────────────────────────────

const EvaluationContext = React.createContext<EvaluationContextValue | undefined>(undefined);

export function EvaluationProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [answers, setAnswers] = React.useState<Record<number, Answer>>({});
  const [scorecard, setScorecard] = React.useState<ScorecardField>(initialScorecard);
  const [recommendation, setRecommendation] = React.useState<Recommendation>(null);
  const [overallFeedback, setOverallFeedback] = React.useState('');
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [scoreSummary, setScoreSummary] = React.useState<ScoreSummary>(initialSummary);

  const initializeAnswers = React.useCallback(
    (questions: InterviewQuestion[], existingAnswers?: Record<number, Answer>) => {
      const prepared: Record<number, Answer> = {};
      questions.forEach((q) => {
        const existing = existingAnswers?.[q.id];
        prepared[q.id] = {
          questionId: q.id,
          rating: existing?.rating ?? null,
          remarks: existing?.remarks ?? '',
        };
      });
      setAnswers(prepared);
    },
    []
  );

  const updateAnswer = React.useCallback((questionId: number, patch: Partial<Answer>) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        rating: patch.rating !== undefined ? patch.rating : prev[questionId]?.rating ?? null,
        remarks: patch.remarks !== undefined ? patch.remarks : prev[questionId]?.remarks ?? '',
      },
    }));
  }, []);

  const updateScorecard = React.useCallback((key: keyof ScorecardField, value: number) => {
    setScorecard((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetState = React.useCallback(() => {
    setSelectedCandidate(null);
    setAnswers({});
    setScorecard(initialScorecard);
    setRecommendation(null);
    setOverallFeedback('');
    setAcknowledged(false);
    setScoreSummary(initialSummary);
  }, []);

  // Auto-compute score summary from question answers
  React.useEffect(() => {
    const ratings = Object.values(answers)
      .map((a) => a.rating)
      .filter((r): r is number => r !== null);

    if (ratings.length === 0) {
      setScoreSummary(initialSummary);
      return;
    }

    const total = ratings.reduce((s, r) => s + r, 0);
    const average = parseFloat((total / ratings.length).toFixed(2));
    let status: ScoreSummary['status'] = 'Fail';
    if (average >= 4) status = 'Pass';
    else if (average >= 3) status = 'Borderline';

    setScoreSummary({ total, average, status });
  }, [answers]);

  const value = React.useMemo(
    () => ({
      selectedCandidate,
      setSelectedCandidate,
      answers,
      initializeAnswers,
      updateAnswer,
      scorecard,
      updateScorecard,
      recommendation,
      setRecommendation,
      overallFeedback,
      setOverallFeedback,
      acknowledged,
      setAcknowledged,
      scoreSummary,
      resetState,
    }),
    [
      selectedCandidate, answers, scorecard, recommendation,
      overallFeedback, acknowledged, scoreSummary,
      initializeAnswers, updateAnswer, updateScorecard, resetState,
    ]
  );

  return React.createElement(EvaluationContext.Provider, { value }, children);
}

export function useEvaluationState(): EvaluationContextValue {
  const ctx = React.useContext(EvaluationContext);
  if (!ctx) throw new Error('useEvaluationState must be used within EvaluationProvider');
  return ctx;
}