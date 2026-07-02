import { useState, useEffect, useCallback } from "react";
import { IHRLeadDashboard } from "../Types";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";

export const useHRLeadDashboardData = (refreshKey?: number) => {
  const [data, setData] = useState<IHRLeadDashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
   const { roleIDs, ADGroupData } = useRoleContext();
   // console.log(ADGroupData.EmailId, "EmailId");

  const fetchHRLeadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await DashboardServices.GetHRLeadDashboard(ADGroupData?.EmailId[0] ?? "");
      if (res.status === ResponeStatus.SUCCESS) {
        setData(res.data);
      }
    } catch (error) {
      console.error("HR Lead Dashboard data error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHRLeadData();
  }, [fetchHRLeadData, refreshKey]);

  return {
    data,
    loading,
    refresh: fetchHRLeadData,
  };
};
