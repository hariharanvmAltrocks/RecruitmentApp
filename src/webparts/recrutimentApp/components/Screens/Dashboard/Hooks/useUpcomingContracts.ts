import { useState, useEffect, useCallback } from "react";
import { Contract } from "../Types";
import { ContractService } from "../Services/contract.service";

export const useUpcomingContracts = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Contract[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const all = await ContractService.getContracts();
      // Filter or sort by proximity to deadlines
      // We want to highlight overdue (remainingDays < 0) and due-soon (remainingDays <= 30)
      const sorted = [...all].sort((a, b) => {
        // Overdue first, then due-soon, then by remaining days ascending
        if (a.remainingDays < 0 && b.remainingDays >= 0) return -1;
        if (b.remainingDays < 0 && a.remainingDays >= 0) return 1;
        return a.remainingDays - b.remainingDays;
      });
      setData(sorted);
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
export default useUpcomingContracts;
