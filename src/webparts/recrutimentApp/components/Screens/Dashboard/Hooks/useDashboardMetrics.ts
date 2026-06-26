import { useState, useEffect, useCallback, useMemo } from "react";
import { getRoleBasedFilters } from "../metricColumns.config";
import { Metric } from "../../../../models/IDashboard";
import { DashboardServices } from "../../../../services/ServiceExport";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";  
import { ResponeStatus } from "../../../../utilities/ApiConfig";

export const useDashboardMetrics = (roleIDs: number[], EmailID: string, refreshKey?: number) => {
  // const { roleIDs, ADGroupData } = useRoleContext();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // console.log(ADGroupData.EmailId, "EmailId");

  const queries = useMemo(() => {
    return getRoleBasedFilters(roleIDs, EmailID);
  }, [roleIDs, EmailID]);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DashboardServices.GetDashboardCount(
        queries,
        roleIDs,
        EmailID,
      );
      if (data.status === ResponeStatus.SUCCESS) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error("Dashboard metrics error", error);
    } finally {
      setLoading(false);
    }
  }, [queries]);

  useEffect(() => {
    if (!queries.length) return;

    void fetchMetrics();
  }, [fetchMetrics, queries, refreshKey]);

  const memoizedMetrics = useMemo(() => metrics, [metrics]);

  return {
    metrics: memoizedMetrics,
    loading,
    refresh: fetchMetrics,
  };
};
