import { useEffect, useMemo, useState } from "react";

export interface SignatureDetails {
  reviewerName: string;
  reviewerInitial: string;
  jobTitleEN: string;
  jobTitleFR: string;
}

export const useSignatureDetails = (jobId: string | null) => {
  const [data, setData] = useState<SignatureDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mockMap = useMemo(() => ({
    "JOB-001": {
      reviewerName: "Jackson Mulenga",
      reviewerInitial: "JM",
      jobTitleEN: "HOD - Mining",
      jobTitleFR: "Chef de département - Mines",
    },
    "JOB-002": {
      reviewerName: "Alisha Nsimba",
      reviewerInitial: "AN",
      jobTitleEN: "Senior Geologist",
      jobTitleFR: "Géologue principal",
    },
  }), []);

  useEffect(() => {
    if (!jobId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setData(mockMap[jobId] ?? mockMap["JOB-001"]);
      setLoading(false);
    }, 550);

    return () => clearTimeout(timer);
  }, [jobId, mockMap]);

  return { data, loading };
};
