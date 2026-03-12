import { useState, useEffect, useCallback, useMemo } from "react";
import SPServices from "../../../../services/SPService/spservice";
import { RoleID } from "../../../../utilities/Config";
import { getRoleBasedFilters } from "../metricColumns.config";
import { Metric } from "../../../../models/IDashboard";
import { DashboardServices } from "../../../../services/ServiceExport";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";
import { ResponeStatus } from "../../../../utilities/ApiConfig";

export const useDashboardMetrics = () => {
    const { roleIDs, ADGroupData } = useRoleContext();
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    console.log(ADGroupData.EmailId, "EmailId");


    const queries = useMemo(() => {
        return getRoleBasedFilters(roleIDs);
    }, [roleIDs]);


    const fetchMetrics = useCallback(async () => {

        try {

            setLoading(true);
            let data = await DashboardServices.GetDashboardCount(queries, roleIDs)
            if (data.status == ResponeStatus.SUCCESS) {
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

        fetchMetrics();

    }, [fetchMetrics, queries]);

    const memoizedMetrics = useMemo(() => metrics, [metrics]);

    return {
        metrics: memoizedMetrics,
        loading,
        refresh: fetchMetrics
    };

};