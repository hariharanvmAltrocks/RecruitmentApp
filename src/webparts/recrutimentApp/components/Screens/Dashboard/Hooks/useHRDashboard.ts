import { useState, useEffect, useCallback } from "react";
import { IHRDashboardData } from "../Types";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";

export const useHRDashboard = () => {
  const [data, setData] = useState<IHRDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { ADGroupData } = useRoleContext();

  const fetchHRDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const email = ADGroupData?.EmailId[0] ?? "";
      const res = await DashboardServices.GetHRDashboardData(email);
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
    void fetchHRDashboardData();
  }, [fetchHRDashboardData]);

  return {
    data,
    loading,
    error,
    refresh: fetchHRDashboardData,
  };
};

export const useDashboard = useHRDashboard;

export default useHRDashboard;
