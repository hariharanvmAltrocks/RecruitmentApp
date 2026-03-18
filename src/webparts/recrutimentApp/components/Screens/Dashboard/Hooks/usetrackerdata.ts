import { useState, useEffect, useCallback } from "react";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { DataSyncToRecruitmentResponse } from "../../../../services/Dashboard/IDashboard";
import { MetricQueryConfig } from "../metricColumns.config";
import { ListNames } from "../../../../utilities/Config";
import { Nationality } from "../../../../utilities/ConditionConfig";

export const useTrackerData = (MatricID: number) => {

    const [trackerData, setTrackerData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchtrackerData = useCallback(async () => {
        try {
            setLoading(true);

            const condition = "and";
            const Filter = MetricQueryConfig[MatricID];
            console.log(Filter);
            let response: any;
            let mappedData: any[] = [];

            const filterObj = Array.isArray(Filter) ? Filter[0] : Filter;

            switch (filterObj.ListName) {
                case ListNames.HRMSNewPositionRequest:
                    response = await DashboardServices.GetNPAEPVRRDetails(
                        filterObj.Filter,
                        condition
                    );

                    mappedData = response?.data?.map((item: any) => ({
                        JobCode: item.JobCode,
                        JobTitle: item.JobTitleEnglish,
                        BusinessUnitCode: item.BusinessUnitCode,
                        PositionRequest: item.Type,
                        Nationality: item.Nationality,
                        Status: item.Status,
                    })) || [];
                    break;

                case ListNames.HRMSRecruitmentDptDetails:
                    response = await DashboardServices.GetRecruitmentDetails(
                        filterObj.Filter[0],
                        condition
                    );

                    mappedData = response?.data?.map((item: any) => ({
                        JobCode: item.JobCode,
                        JobTitle: item.JobTitleEnglish,
                        BusinessUnitCode: item.BusinessUnitCode,
                        PositionRequest: item.Type,
                        Nationality: item.Nationality,
                        Status: item.Status,
                    })) || [];
                    break;

                case ListNames.HRMSRecruitmentCandidatePersonalDetails:
                    response = await DashboardServices.GetCandidateDetails(
                        filterObj.Filter[0],
                        condition
                    );

                    mappedData = response?.data?.map((item: any) => ({
                        ApplicantName: item.ApplicantName,
                        PositionTitle: item.PositionTitle,
                        Nationality: item.Nationality,
                        InterviewDate: item.InterviewDate,
                        JobGrade: item.JobGrade,
                        Status: item.Status,
                    })) || [];
                    break;

                case ListNames.HRMSSelectedCandidateDetailsByHOD:
                    response = await DashboardServices.GetSelectedCandidate(
                        filterObj.Filter[0],
                        condition
                    );

                    mappedData = response?.data?.map((item: any) => ({
                        ApplicantName: item.ApplicantName,
                        PositionTitle: item.PositionTitle,
                        Nationality: item.Nationality,
                        PositionID: item.PositionID,
                        JobGrade: item.JobGrade,
                        Status: item.Status,
                    })) || [];
                    break;
            }

            if (response && response.status === ResponeStatus.SUCCESS) {
                setTrackerData(mappedData);
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