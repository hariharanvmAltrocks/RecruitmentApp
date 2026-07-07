import { useState, useEffect, useCallback } from "react";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";
import { IHODDashbaord } from "../Types";

export const useHODashboard = () => {
  const [data, setData] = useState<IHODDashbaord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { ADGroupData } = useRoleContext();

  const fetchHODDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const email = ADGroupData?.EmailId[0] ?? "";
      const res = await DashboardServices.GetHODDashboardData(email);
      if (res.status === ResponeStatus.SUCCESS) {
        setData(res.data);
      } else {
        throw new Error(res.message || "Failed to fetch HOD dashboard data");
      }
    } catch (err) {
      console.error("HOD Dashboard fetch error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [ADGroupData?.EmailId]);

  useEffect(() => {
    void fetchHODDashboardData();
  }, [fetchHODDashboardData]);

  return {
    data,
    loading,
    error,
    refresh: fetchHODDashboardData,
  };
};

export default useHODashboard;
