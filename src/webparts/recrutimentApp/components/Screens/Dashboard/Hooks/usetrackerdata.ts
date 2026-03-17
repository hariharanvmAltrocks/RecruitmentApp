import { useState, useEffect, useCallback } from "react";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { DataSyncToRecruitmentResponse } from "../../../../services/Dashboard/IDashboard";
import { MetricQueryConfig } from "../metricColumns.config";
import { ListNames } from "../../../../utilities/Config";

export const useTrackerData = (MatricID: number) => {

    const [trackerData, setTrackerData] = useState<DataSyncToRecruitmentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchtrackerData = useCallback(async () => {
        try {
            setLoading(true);

            const condition = "and";
            const Filter = MetricQueryConfig[MatricID];
            console.log(Filter);
            let response: any;

            // Handle Filter being an array or object
            const filterObj = Array.isArray(Filter) ? Filter[0] : Filter;

            switch (filterObj.ListName) {
                case ListNames.HRMSNewPositionRequest:
                    response = await DashboardServices.GetNPAEPVRRDetails(filterObj.Filter, condition);
                    break;
                case ListNames.HRMSRecruitmentDptDetails:
                    response = await DashboardServices.GetRecruitmentDetails(filterObj.Filter[0], condition);
                    break;
                case ListNames.HRMSRecruitmentCandidatePersonalDetails:
                    response = await DashboardServices.GetCandidateDetails(filterObj.Filter[0], condition);
                    break;
                case ListNames.HRMSSelectedCandidateDetailsByHOD:
                    response = await DashboardServices.GetSelectedCandidate(filterObj.Filter[0], condition);
                    break;
            }

            if (response && response.status === ResponeStatus.SUCCESS) {
                setTrackerData(response.data);
            }

        } catch (error) {
            console.error("Dashboard metrics error", error);
        } finally {
            setLoading(false);
        }
    }, [MatricID]);

    useEffect(() => {
        if (!MatricID) return;
        void fetchtrackerData();
    }, [MatricID, fetchtrackerData]);

    return {
        trackerData,
        loading,
        refresh: fetchtrackerData
    };
};