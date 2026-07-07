import { useState, useEffect, useCallback } from "react";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";
import { ISeniorHRSummary } from "../Types";

export const useSeniorHRDashboard = () => {
  const [data, setData] = useState<ISeniorHRSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { ADGroupData } = useRoleContext();

  const fetchSeniorHRDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const email = ADGroupData?.EmailId[0] ?? "";
      const res = await DashboardServices.GetSeniorHRDashboardData(email);
      if (res.status === ResponeStatus.SUCCESS) {
        setData(res.data);
      } else {
        throw new Error(res.message || "Failed to fetch Senior HR dashboard data");
      }
    } catch (err) {
      console.error("Senior HR Dashboard fetch error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [ADGroupData?.EmailId]);

  useEffect(() => {
    void fetchSeniorHRDashboardData();
  }, [fetchSeniorHRDashboardData]);

  return {
    data,
    loading,
    error,
    refresh: fetchSeniorHRDashboardData,
  };
};

export default useSeniorHRDashboard;
