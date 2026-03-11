import { useState, useEffect, useCallback } from "react";
import { TrackerRow } from "../../../../models";
import { StatusId } from "../../../../utilities/Config";
import { DashboardServices } from "../../../../services/ServiceExport";
import { Choices } from "../../../../utilities/ApiConfig";
import { DataSyncToRecruitmentResponse } from "../../../../services/Dashboard/IDashboard";

export const useTrackerData = (MatricID: string) => {

    const [trackerData, setTrackerData] = useState<DataSyncToRecruitmentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchtrackerData = useCallback(async () => {
        try {
            setLoading(true);

            const Filter: any[] = [];
            const condition = "and";

            switch (MatricID) {
                case "hod-review":
                    Filter.push({
                        FilterKey: "StatusId",
                        Operator: "eq",
                        FilterValue: StatusId.PendingwithHODtoreviewAdv,
                    });
                    break;

                default:
                    Filter.push({
                        FilterKey: "ItemCreated",
                        Operator: "eq",
                        FilterValue: Choices.No,
                    });
            }
            Filter.push({
                FilterKey: "ItemCreated",
                Operator: "eq",
                FilterValue: Choices.No,
            });
            debugger;
            const res = await DashboardServices.GetRecruitmentDetails(Filter, condition);
            setTrackerData(res.data || []);

        } catch (error) {
            console.error("Dashboard metrics error", error);
        } finally {
            setLoading(false);
        }

    }, [MatricID]);

    useEffect(() => {
        if (!MatricID) return;
        fetchtrackerData();
    }, [fetchtrackerData]);

    return {
        trackerData,
        loading,
        refresh: fetchtrackerData
    };
};