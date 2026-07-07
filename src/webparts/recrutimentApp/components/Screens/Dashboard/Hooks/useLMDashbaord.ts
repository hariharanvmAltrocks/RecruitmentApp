import { useState, useEffect, useCallback } from "react";
import { IHRDashboardData } from "../Types";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";

export const useLMDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { ADGroupData } = useRoleContext();

  const fetchLMDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const email = ADGroupData?.EmailId[0] ?? "";
      const res = await DashboardServices.GetLMDashboardData(email);
      if (res.status === ResponeStatus.SUCCESS) {
        setData(res.data);
      } else {
        throw new Error(res.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("HR Dashboard fetch error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [ADGroupData?.EmailId]);

  useEffect(() => {
    void fetchLMDashboardData();
  }, [fetchLMDashboardData]);

  return {
    data,
    loading,
    error,
    refresh: fetchLMDashboardData,
  };
};

export const useDashboard = useLMDashboard;

export default useLMDashboard;
