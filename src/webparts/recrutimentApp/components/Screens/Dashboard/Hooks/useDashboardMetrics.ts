import { useState, useEffect, useCallback, useMemo } from "react";
import { Metric } from "../../../../models";
import SPServices from "../../../../services/SPService/spservice";
import { getRoleBasedFilters } from "./useFilterMatricCard";
import { METRICS } from "../../../MockData/data";
import { RoleID } from "../../../../utilities/Config";

export const useDashboardMetrics = () => {

    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // ✅ Build queries once
    const queries = useMemo(() => {
        return getRoleBasedFilters(RoleID.LineManager);
    }, []);

    const mergeMetrics = useCallback(
        (dbData: Record<string, number> = {}): Metric[] => {

            return METRICS.map((metric) => ({
                ...metric,
                value: Number(dbData?.[metric.id] ?? 0)
            }));

        },
        []
    );

    const fetchMetrics = useCallback(async () => {

        try {

            setLoading(true);

            const data = await SPServices.batchGet(queries);

            console.log("DB Data:", data);

            const mergedMetrics = mergeMetrics(data);

            setMetrics(mergedMetrics);

        } catch (error) {

            console.error("Dashboard metrics error", error);

        } finally {

            setLoading(false);

        }

    }, [queries, mergeMetrics]);

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