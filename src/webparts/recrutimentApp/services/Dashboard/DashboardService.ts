import moment from "moment";
import { ApiResponse } from "../../models/apimodels";
import { count, InOperator } from "../../utilities/ApiConfig";
import { DataFrom, ListNames } from "../../utilities/Config";
import SPServices from "../SPService/spservice";
import { DashboardData, DataSyncToRecruitmentResponse, IDashboard } from "./IDashboard";
import { BatchQuery } from "../SPService/Ispservice";
import { getProfileData } from "../AxiosService/CareerPortalAPI";
import { ExternalApiCountItem, ExternalApiParams, Metric, MetricConfig } from "../../models/IDashboard";
import { MatricColums } from "../../components/Screens/Dashboard/metricColumns.config";

export default class DashboardService implements IDashboard {

    async GetDashboardCount(
        queries: BatchQuery[],
        currentRoleID: number[]
    ): Promise<ApiResponse<Metric[]>> {

        try {
            const metricConfigs = MatricColums(currentRoleID);
            if (!metricConfigs?.length) {
                return { data: [], status: 200, message: "No metrics configured for this role" };
            }

            // const [spCounts, portalJobCodeMap] = await Promise.all([
            //     SPServices.batchGet(queries),
            //     this._fetchPortalJobCodeMap(queries),
            // ]);

            const spCounts = await SPServices.batchGet(queries);

            const externalMetrics = metricConfigs.filter((m: any) => m.externalApi);

            const externalCountMap = await this._fetchExternalCounts(
                externalMetrics,
                spCounts,
                new Map()
            );

            const metrics: Metric[] = metricConfigs.map((config) => {
                const hasExternalCount = externalCountMap.has(String(config.id));
                const spCount = (spCounts[config.id] as any[])?.length ?? 0;

                const value = hasExternalCount
                    ? (externalCountMap.get(String(config.id)) ?? 0) + spCount
                    : spCount;

                return {
                    ...config,
                    value,
                    showArrow: config.showArrow || hasExternalCount,
                };
            });

            return { data: metrics, status: 200, message: "Dashboard counts fetched successfully" };

        } catch (error) {
            console.error("GetDashboardCount error:", error);
            return { data: [], status: 500, message: "Error fetching dashboard counts" };
        }
    }

    private async _fetchExternalCounts(
        externalMetrics: MetricConfig[],
        spCounts: Record<string, any[]>,
        _portalJobCodeMap: Map<number, string>
    ): Promise<Map<string, number>> {

        const result = new Map<string, number>();
        if (!externalMetrics.length) return result;

        const allJobCodeIds = Array.from(
            new Set(
                externalMetrics.flatMap((m) =>
                    (spCounts[m.id] ?? []).map((item: any) => item.JobCodeId).filter(Boolean)
                )
            )
        );

        if (!allJobCodeIds.length) return result;

        const portalItems = await SPServices.SPReadItems({
            Listname: ListNames.RecruitAppCareerPortalIntegration,
            Select: `*,JobCode/JobCode`,
            Filter: [{ FilterKey: "JobCodeId", Operator: "in", FilterValue: allJobCodeIds }],
            FilterCondition: "and",
            Expand: `JobCode`,
            Topcount: count.Topcount,
            Orderby: "ID",
            Orderbydecorasc: true,
        });

        const jobCodeIdToUniqueKey = new Map<number, string>(
            portalItems.map((item: any) => [item.JobCodeId, item.JobUniqueKey])
        );

        await Promise.all(
            externalMetrics.map(async (metric) => {
                const jobCodeIds: number[] = (spCounts[metric.id] ?? [])
                    .map((item: any) => item.JobCodeId)
                    .filter(Boolean);

                const jobUniqueKeys = jobCodeIds
                    .map((id) => jobCodeIdToUniqueKey.get(id))
                    .filter((key): key is string => !!key);

                if (!jobUniqueKeys.length) {
                    result.set(String(metric.id), 0);
                    return;
                }

                const params: ExternalApiParams = {
                    jobCode: jobUniqueKeys,
                    workflowStausId: metric.externalApi!.workflowStatuses,
                };
                try {
                    const response = await getProfileData.GetJobAppliedCount(params);
                    const total: number = (response?.data ?? []).reduce(
                        (sum: number, item: ExternalApiCountItem) => sum + (item.count ?? 0),
                        0
                    );

                    result.set(String(metric.id), total);
                } catch { // eslint-disable-line
                    result.set(String(metric.id), 0);
                }
            })
        );

        return result;
    }

async GetRecruitmentDetails(
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DashboardData[]>> {
  try {
    const res: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSRecruitmentDptDetails,
      Select: `*,Status/StatusDescription,JobCode/JobCode,JobCode/ID,JobCode/JobTitleInEnglish,BusinessUnitCode/BusineesUnitCode`,
      Filter: filterParam,
      FilterCondition: filterConditions,
      Expand: `Status,JobCode,BusinessUnitCode`,
      Topcount: count.Topcount,
      Orderby: "ID",
      Orderbydecorasc: true,
    });

    if (!res.length) {
      return { data: [], status: 200, message: "No records found" };
    }

    const GridResult: DashboardData[] = res.map((item: any, index: number) => ({
      ID: item.ID,
      RecordID: index + 1,
      BusinessUnitCode: item?.BusinessUnitCode?.BusineesUnitCode ?? "",
      Nationality: item?.Nationality,
      NumberOfPersonNeeded: item?.NumberOfPersonNeeded,
      Type: item?.DataFrom ?? "",
      Status: item?.Status?.StatusDescription ?? "",
      StatusId: item?.StatusId,
      JobCodeId: item?.JobCode?.ID ?? 0,
      JobCode: item?.JobCode?.JobCode ?? "",
      JobTitleEnglish: item?.JobCode?.JobTitleInEnglish ?? "",
      ModifiedDate: item?.Modified
        ? moment(item.Modified).format("YYYY-MM-DD")
        : undefined,
      CreatedDate: item?.Created
        ? moment(item.Created).format("YYYY-MM-DD")
        : undefined,
    }));

    return {
      data: GridResult,
      status: 200,
      message: "GetRecruitmentDetails fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching GetRecruitmentDetails:", error);
    return { data: [], status: 500, message: "Error fetching data" };
  }
}

private async fetchRecruitmentByLookup(
  listName: string,
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DashboardData[]>> {
  try {
    const res: any[] = await SPServices.SPReadItems({
      Listname: listName,
      Select: `*,RecruitmentID/Id`,
      Filter: filterParam,
      FilterCondition: filterConditions,
      Expand: `RecruitmentID`,
      Topcount: count.Topcount,
      Orderby: "ID",
      Orderbydecorasc: true,
    });

    if (!res.length) {
      return { data: [], status: 200, message: "No records found" };
    }

    const ids: number[] = res
      .map((item: any) => item.RecruitmentID?.Id)
      .filter(Boolean);

    if (!ids.length) {
      return { data: [], status: 200, message: "No linked recruitment records found" };
    }

    const recruitmentFilter = [
      { FilterKey: "ID", Operator: "in", FilterValue: ids },
    ];

    return await this.GetRecruitmentDetails(recruitmentFilter, filterConditions);

  } catch (error) {
    console.error(`Error fetching from ${listName}:`, error);
    return { data: [], status: 500, message: "Error fetching data" };
  }
}

async GetCandidateDetails(
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DashboardData[]>> {
  return this.fetchRecruitmentByLookup(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    filterParam,
    filterConditions
  );
}

async GetSelectedCandidate(
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DashboardData[]>> {
  return this.fetchRecruitmentByLookup(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    filterParam,
    filterConditions
  );
}

async GetNPAEPVRRDetails(
  filterParam: any,
  filterConditions: any
): Promise<ApiResponse<DashboardData[]>> {
  try {
    const queries: BatchQuery[] = [
      {
        StateValue: 1,
        ListName: ListNames.HRMSAdditionalHeadCountForExisitingPosition,
        Filter: filterParam,
        FilterCondition: filterConditions,
        select: ["*", "Status/StatusDescription", "BusinessUnitCode/BusineesUnitCode"],
        expand: ["Status", "BusinessUnitCode"],
      },
      {
        StateValue: 2,
        ListName: ListNames.HRMSNewPositionRequest,
        Filter: filterParam,
        FilterCondition: filterConditions,
        select: ["*", "BusinessUnitCode/BusineesUnitCode", "Status/StatusDescription"],
        expand: ["Status", "BusinessUnitCode"],
      },
      {
        StateValue: 3,
        ListName: ListNames.HRMSVacancyReplacementRequest,
        Filter: filterParam,
        FilterCondition: filterConditions,
        select: [
          "*",
          "BusinessUnitCode/BusineesUnitCode",
          "Status/StatusDescription",
          "JobCode/JobCode",
          "JobCode/JobTitleInEnglish",
          "JobCode/ID",
        ],
        expand: ["Status", "JobCode", "BusinessUnitCode"],
      },
    ];

    const batchRes: Record<number, any[]> = await SPServices.batchGet(queries);

    if (!batchRes || !Object.keys(batchRes).length) {
      return { data: [], status: 200, message: "No records found" };
    }

    const additionalExistingItems: any[] = batchRes[1] || [];
    const newPositionItems: any[]        = batchRes[2] || [];
    const vacancyItems: any[]            = batchRes[3] || [];

    const additionalIds  = additionalExistingItems.map((i: any) => i.ID).filter(Boolean);
    const newPositionIds = newPositionItems.map((i: any) => i.ID).filter(Boolean);

    const [additionalPositionRes, newPositionRes] = await Promise.all([
      additionalIds.length > 0
        ? this.GetPositionDetails(
            [{ FilterKey: "LookupIDId", Operator: "in", FilterValue: additionalIds }],
            undefined,
            ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails
          )
        : Promise.resolve({ data: [], status: 200, message: "" }),

      newPositionIds.length > 0
        ? this.GetPositionDetails(
            [{ FilterKey: "PositionRequestID", Operator: "in", FilterValue: newPositionIds }],
            undefined,
            ListNames.HRMSNewPositionRequestPositionDetails
          )
        : Promise.resolve({ data: [], status: 200, message: "" }),
    ]);

    const additionalPositionMap = new Map<number, any>(
      (additionalPositionRes.data ?? []).map((d: any) => [d.parentId, d])
    );
    const newPositionMap = new Map<number, any>(
      (newPositionRes.data ?? []).map((d: any) => [d.parentId, d])
    );

    const mapCommonFields = (item: any, index: number): Partial<DashboardData> => ({
      ID: item.ID,
      RecordID: index + 1,
      BusinessUnitCode: item?.BusinessUnitCode?.BusineesUnitCode ?? "",
      NumberOfPersonNeeded: item?.NumberOfPersonNeeded,
      Status: item?.Status?.StatusDescription ?? "",
      ModifiedDate: item?.Modified
        ? moment(item.Modified).format("YYYY-MM-DD")
        : undefined,
      CreatedDate: item?.Created
        ? moment(item.Created).format("YYYY-MM-DD")
        : undefined,
    });

    const additionalExistingResult: DashboardData[] = additionalExistingItems.map(
      (item: any, index: number) => {
        const pos = additionalPositionMap.get(item.ID);
        return {
          ...mapCommonFields(item, index),
          Type: DataFrom.ExistingPosition,
          JobCode: pos?.jobCode ?? "",
          JobTitleEnglish: pos?.title ?? "",
          JobTitleFrench: pos?.JobTitleFrench ?? "",
          PatersonGrade: pos?.PatersonGrade ?? "",
          DRCGrade: pos?.DRCGrade ?? "",
        } as DashboardData;
      }
    );

    const newPositionResult: DashboardData[] = newPositionItems.map(
      (item: any, index: number) => {
        const pos = newPositionMap.get(item.ID);
        return {
          ...mapCommonFields(item, index),
          Type: DataFrom.NewPosition,
          JobCode: pos?.jobCode ?? "",
          JobTitleEnglish: pos?.title ?? "",
          JobTitleFrench: pos?.JobTitleFrench ?? "",
          PatersonGrade: pos?.PatersonGrade ?? "",
          DRCGrade: pos?.DRCGrade ?? "",
        } as DashboardData;
      }
    );

    const vacancyResult: DashboardData[] = vacancyItems.map(
      (item: any, index: number) => ({
        ...mapCommonFields(item, index),
        Type: DataFrom.VacancyRecruitmentProcess,
        JobCodeId: item?.JobCode?.ID ?? 0,
        JobCode: item?.JobCode?.JobCode ?? "",
        JobTitleEnglish: item?.JobCode?.JobTitleInEnglish ?? "",
      } as DashboardData)
    );

    const GridResult: DashboardData[] = [
      ...additionalExistingResult,
      ...newPositionResult,
      ...vacancyResult,
    ].map((item, index) => ({ ...item, RecordID: index + 1 }));

    return {
      data: GridResult,
      status: 200,
      message: "GetNPAEPVRRDetails fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching GetNPAEPVRRDetails:", error);
    return { data: [], status: 500, message: "Error fetching data" };
  }
}

async GetPositionDetails(
  Filter: any[],
  filterConditions: any,
  ListName: string
): Promise<ApiResponse<any[]>> {
  try {
    const resdata = await SPServices.SPReadItems({
      Listname: ListName,
      Select:
        "*,JobTitleEnglish/JobTitleInEnglish,JobTitleEnglish/JobCode,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
      Filter: Filter,
      FilterCondition: filterConditions,
      Expand: "JobTitleEnglish,DRCGrade,JobTitleFrench,PatersonGrade",
      Topcount: count.Topcount,
    });

    const result = resdata.map((item: any, index: number) => ({
      parentId: item?.LookupIDId ?? item?.PositionRequestIDId ?? 0,
      id: index + 1,
      title: item?.JobTitleEnglish?.JobTitleInEnglish ?? "",
      jobCode: item?.JobTitleEnglish?.JobCode ?? "",
      DRCGrade: item?.DRCGrade?.DRCGrade ?? "",
      PatersonGrade: item?.PatersonGrade?.PatersonGrade ?? "",
      JobTitleFrench: item?.JobTitleFrench?.JobTitleInFrench ?? "",
    }));

    return { data: result, status: 200, message: "GetPositionDetails fetched successfully" };
  } catch (error) {
    console.error("GetPositionDetails error:", error);
    return { data: [], status: 500, message: "Error fetching position details" };
  }
}
}