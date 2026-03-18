import { useEffect, useState } from "react";

export interface CandidateDashboardItem {
  id: string;
  applicantName: string;
  jobCode: string;
  jobTitle: string;
  businessUnitCode: string;
  positionRequest: string;
  nationality: string;
  statusLabel: string;
  statusTone: "warning" | "success" | "danger";
}

interface CandidateDashboardState {
  data: CandidateDashboardItem[];
  loading: boolean;
  error: string | null;
}

const mockCandidates: CandidateDashboardItem[] = [
  {
    id: "c1",
    applicantName: "Alyse E",
    jobCode: "SEN-100",
    jobTitle: "Senior Mining Engineer",
    businessUnitCode: "MIN-01",
    positionRequest: "Level 1",
    nationality: "Malian (Mali)",
    statusLabel: "Pending with LM to select the candidate",
    statusTone: "warning"
  },
  {
    id: "c2",
    applicantName: "John Smith",
    jobCode: "SEN-100",
    jobTitle: "Senior Mining Engineer",
    businessUnitCode: "MIN-01",
    positionRequest: "Level 1",
    nationality: "British",
    statusLabel: "Pending with LM to select the candidate",
    statusTone: "warning"
  },
  {
    id: "c3",
    applicantName: "Sarah Johnson",
    jobCode: "SEN-100",
    jobTitle: "Senior Mining Engineer",
    businessUnitCode: "MIN-01",
    positionRequest: "Level 1",
    nationality: "Canadian",
    statusLabel: "Reviewed - Ready",
    statusTone: "success"
  }
];

export const useFetchCandidateDashboardDetails = (): CandidateDashboardState => {
  const [state, setState] = useState<CandidateDashboardState>({
    data: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      if (!isMounted) {
        return;
      }
      setState({ data: mockCandidates, loading: false, error: null });
    }, 450);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return state;
};
