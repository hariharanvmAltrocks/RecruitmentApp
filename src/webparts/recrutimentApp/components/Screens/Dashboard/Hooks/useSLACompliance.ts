import { useState, useEffect, useCallback } from "react";
import { SLAStats } from "../Types";
import { SlaService } from "../Services/sla.service";

export const useSLACompliance = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<SLAStats | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await SlaService.getSlaStats();
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
export default useSLACompliance;
