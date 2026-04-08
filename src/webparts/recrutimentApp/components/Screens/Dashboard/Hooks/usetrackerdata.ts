import { useState, useEffect, useCallback } from "react";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { DataSyncToRecruitmentResponse } from "../../../../services/Dashboard/IDashboard";
import { MetricQueryConfig } from "../metricColumns.config";
import { ListNames, RoleID } from "../../../../utilities/Config";
import { Nationality } from "../../../../utilities/ConditionConfig";
import { userInfo } from "../../../../utilities/hooks/RoleContext";

export const callServiceByListName = async (
  listName: string,
  filter: any[],
  condition?: any,
  roleIDs?: number[],
) => {
  if (roleIDs?.includes(RoleID.FinanceDepartment)) {
    filter = filter.filter((f: any) => f.FilterKey !== "RecruitmentHR");
  }
  switch (listName) {
    case ListNames.HRMSNewPositionRequest:
      return await DashboardServices.GetNPAEPVRRDetails(filter, condition);

    case ListNames.HRMSRecruitmentDptDetails:
      return await DashboardServices.GetRecruitmentDetails(filter, condition);

    case ListNames.HRMSRecruitmentCandidatePersonalDetails:
      return await DashboardServices.GetCandidateDetails(filter, condition);

    case ListNames.HRMSSelectedCandidateDetailsByHOD:
      return await DashboardServices.GetSelectedCandidate(filter, condition);

    default:
      return await DashboardServices.GetRecruitmentDetails(filter, condition);
  }
};

export const mapResponseByListName = (listName: string, data: any[]) => {
  if (!data) return [];

  switch (listName) {
    case ListNames.HRMSNewPositionRequest:
    case ListNames.HRMSRecruitmentDptDetails:
      return data.map((item: any) => ({
        JobCode: item.JobCode,
        JobTitle: item.JobTitleEnglish,
        BusinessUnitCode: item.BusinessUnitCode,
        PositionRequest: item.Type,
        Nationality: item.Nationality,
        Status: item.Status,
      }));

    case ListNames.HRMSRecruitmentCandidatePersonalDetails:
      return data.map((item: any) => ({
        ApplicantName: item.ApplicantName,
        PositionTitle: item.PositionTitle,
        Nationality: item.Nationality,
        InterviewDate: item.InterviewDate,
        JobGrade: item.JobGrade,
        Status: item.Status,
      }));

    case ListNames.HRMSSelectedCandidateDetailsByHOD:
      return data.map((item: any) => ({
        ApplicantName: item.ApplicantName,
        PositionTitle: item.PositionTitle,
        Nationality: item.Nationality,
        PositionID: item.PositionID,
        JobGrade: item.JobGrade,
        Status: item.Status,
      }));

    default:
      return [];
  }
};

export const useTrackerData = (MatricID: number) => {
  const { ADGroupData, roleIDs } = userInfo();

  const [trackerData, setTrackerData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchtrackerData = useCallback(async () => {
    try {
      setLoading(true);
      const configMap = MetricQueryConfig(ADGroupData.EmailId[0]);
      const config = configMap[MatricID];

      if (!config) {
        console.warn("No config found for MatricID:", MatricID);
        return;
      }

      const configs = Array.isArray(config) ? config : [config];

      const responses = await Promise.all(
        configs.map((cfg) =>
          callServiceByListName(cfg.ListName, cfg.Filter, "and", roleIDs),
        ),
      );

      let allData: any[] = [];

      responses.forEach((response, index) => {
        if (response?.status === ResponeStatus.SUCCESS) {
          const mapped = mapResponseByListName(
            configs[index].ListName,
            response.data,
          );
          allData.push(...mapped);
        }
      });

      setTrackerData(allData);
    } catch (error) {
      console.error("Error fetching tracker data:", error);
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
    refresh: fetchtrackerData,
  };
};
