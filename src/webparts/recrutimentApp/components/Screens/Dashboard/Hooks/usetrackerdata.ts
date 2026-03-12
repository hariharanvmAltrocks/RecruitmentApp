import { useState, useEffect, useCallback } from "react";
import { TrackerRow } from "../../../../models";
import { StatusId } from "../../../../utilities/Config";
import { DashboardServices } from "../../../../services/ServiceExport";
import { Choices, ResponeStatus } from "../../../../utilities/ApiConfig";
import { DataSyncToRecruitmentResponse } from "../../../../services/Dashboard/IDashboard";
import { MetricQueryConfig } from "../metricColumns.config";

export const useTrackerData = (MatricID: number) => {

    const [trackerData, setTrackerData] = useState<DataSyncToRecruitmentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchtrackerData = useCallback(async () => {
        try {
            setLoading(true);

            const condition = "and";
            const Filter = MetricQueryConfig[MatricID]
            const res = await DashboardServices.GetRecruitmentDetails(Filter.Filter[0], condition);
            if (res.status == ResponeStatus.SUCCESS) {
                setTrackerData(res.data || []);
            }

        } catch (error) {
            console.error("Dashboard metrics error", error);
        } finally {
            setLoading(false);
        }

    }, [MatricID]);

    useEffect(() => {
        if (!MatricID) return;
        fetchtrackerData();
    }, [MatricID, fetchtrackerData]);

    return {
        trackerData,
        loading,
        refresh: fetchtrackerData
    };
};