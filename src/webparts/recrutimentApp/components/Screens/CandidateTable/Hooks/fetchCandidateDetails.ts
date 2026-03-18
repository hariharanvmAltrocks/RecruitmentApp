import { useEffect, useMemo, useState } from "react";

export interface CandidateQuestionnaire {
  id: string;
  question: string;
  rating: "Excellent" | "Acceptable" | "Poor";
  score: number;
  maxScore: number;
}

export interface CandidateScore {
  label: string;
  score: number;
  maxScore: number;
}

export interface CandidateDetails {
  applicantName: string;
  classification: "EXPAT" | "LOCAL";
  nationality: string;
  gender: string;
  qualification: string;
  miningExp: string;
  relatedExp: string;
  interviewDate: string;
  interviewLevels: string;
  conflicts: string;
  disability: string;
  panel: string[];
  questionnaires: CandidateQuestionnaire[];
  scores: CandidateScore[];
  recommendation: "Consider for Employment" | "Do Not Consider";
  panelFeedback: string;
  gpa: number;
  jobCode: string;
  jobTitle: string;
}

interface CandidateDetailsState {
  data: CandidateDetails | null;
  loading: boolean;
  error: string | null;
}

const mockDetails: CandidateDetails = {
  applicantName: "Alyse E",
  classification: "EXPAT",
  nationality: "Malian (Mali)",
  gender: "Female",
  qualification: "BSc Mining Engineering",
  miningExp: "8 Years",
  relatedExp: "5-10 Years",
  interviewDate: "2026-03-05",
  interviewLevels: "Level 1",
  conflicts: "No",
  disability: "No",
  panel: ["Michael Lopez", "Amina Kone", "Ravi Sharma"],
  questionnaires: [
    {
      id: "q1",
      question: "What are the three main financial statements, and how are they connected?",
      rating: "Excellent",
      score: 3,
      maxScore: 3
    },
    {
      id: "q2",
      question: "How would you evaluate a company's financial health using financial ratios?",
      rating: "Excellent",
      score: 3,
      maxScore: 3
    }
  ],
  scores: [
    { label: "Requirements", score: 5, maxScore: 5 },
    { label: "Culture", score: 5, maxScore: 5 },
    { label: "Expat", score: 5, maxScore: 5 },
    { label: "Other", score: 5, maxScore: 5 }
  ],
  recommendation: "Consider for Employment",
  panelFeedback: "Exceptional candidate with deep technical knowledge and strong leadership potential.",
  gpa: 5.0,
  jobCode: "FIN003",
  jobTitle: "Senior Mining Engineer"
};

export const useFetchCandidateDetails = (candidateId?: string | null): CandidateDetailsState => {
  const [state, setState] = useState<CandidateDetailsState>({
    data: null,
    loading: false,
    error: null
  });

  const details = useMemo(() => mockDetails, []);

  useEffect(() => {
    if (!candidateId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let isMounted = true;
    setState({ data: null, loading: true, error: null });

    const timer = setTimeout(() => {
      if (!isMounted) {
        return;
      }
      setState({ data: details, loading: false, error: null });
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [candidateId, details]);

  return state;
};
