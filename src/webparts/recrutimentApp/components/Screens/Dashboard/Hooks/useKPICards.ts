import { useState, useEffect, useCallback } from "react";
import { KPIMetrics } from "../Types";
import { DashboardService } from "../Services/dashboard.service";

export const useKPICards = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<KPIMetrics | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await DashboardService.getKPIMetrics();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { loading, data, error, refresh };
};
export default useKPICards;
