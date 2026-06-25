import { useState, useEffect, useCallback } from "react";
import { CandidateDashboardData } from "../Types";
import { CandidateService } from "../Services/candidate.service";

export const useCandidateDashboardData = (email: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<CandidateDashboardData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await CandidateService.getCandidateDashboard(email);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { loading, data, error, refresh };
};
export default useCandidateDashboardData;
