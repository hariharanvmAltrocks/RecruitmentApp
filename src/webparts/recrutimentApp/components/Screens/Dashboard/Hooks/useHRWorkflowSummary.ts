import { useState, useEffect, useCallback } from "react";
import { HRWorkflow } from "../Types";
import { ContractService } from "../Services/contract.service";

export const useHRWorkflowSummary = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<HRWorkflow[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ContractService.getHRWorkflows();
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
export default useHRWorkflowSummary;
