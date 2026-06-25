import { useState, useEffect, useCallback } from "react";
import { ContractService } from "../Services/contract.service";

export interface ContractsByStatus {
  onTrack: number;
  dueSoon: number;
  overdue: number;
  completed: number;
  notStarted: number;
  total: number;
  expiring7: number;
  expiring30: number;
  percentages: {
    onTrack: number;
    dueSoon: number;
    overdue: number;
    completed: number;
    notStarted: number;
    expiring7: number;
    expiring30: number;
  };
}

export const useContractsByEndDate = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ContractsByStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const contracts = await ContractService.getContracts();
      
      let onTrack = 0;
      let dueSoon = 0;
      let overdue = 0;
      let completed = 0;
      let notStarted = 0;
      let expiring7 = 0;
      let expiring30 = 0;

      contracts.forEach((c) => {
        if (c.status === "Completed") {
          completed++;
        } else if (c.status === "Pending") {
          notStarted++;
        } else if (c.status === "Active" || c.status === "Suspended") {
          if (c.slaStatus === "On Track") onTrack++;
          else if (c.slaStatus === "At Risk") dueSoon++;
          else if (c.slaStatus === "Overdue") overdue++;
        }

        if (c.status !== "Completed" && c.remainingDays !== undefined) {
          if (c.remainingDays <= 7) {
            expiring7++;
          }
          if (c.remainingDays <= 30) {
            expiring30++;
          }
        }
      });

      const total = contracts.length;
      const pct = (val: number) => total > 0 ? Math.round((val / total) * 100) : 0;

      setData({
        onTrack,
        dueSoon,
        overdue,
        completed,
        notStarted,
        total,
        expiring7,
        expiring30,
        percentages: {
          onTrack: pct(onTrack),
          dueSoon: pct(dueSoon),
          overdue: pct(overdue),
          completed: pct(completed),
          notStarted: pct(notStarted),
          expiring7: pct(expiring7),
          expiring30: pct(expiring30)
        }
      });
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
export default useContractsByEndDate;
