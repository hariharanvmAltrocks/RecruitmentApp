import moment from "moment";
import { ApiResponse } from "../../models/apimodels";
import { count, InOperator } from "../../utilities/ApiConfig";
import { ListNames, RoleID, workflowStatusApi } from "../../utilities/Config";
import SPServices from "../SPService/spservice";
import { DataSyncToRecruitmentResponse, IDashboard } from "./IDashboard";
import { BatchQuery } from "../SPService/Ispservice";
import { getProfileData } from "../AxiosService/CareerPortalAPI";
import { ExternalApiCountItem, ExternalApiParams, Metric, MetricConfig } from "../../models/IDashboard";
import { MatricColums } from "../../components/Screens/Dashboard/metricColumns.config";

export default class DashboardService implements IDashboard {

    async GetRecruitmentDetails(
        filterParam: any,
        filterConditions: any
    ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {

        try {

            const res: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSRecruitmentDptDetails,
                Select: `*,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title`,
                Filter: filterParam,
                FilterCondition: filterConditions,
                Expand: `Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode`,
                Topcount: count.Topcount,
                Orderby: "ID",
                Orderbydecorasc: true
            });

            if (!res.length) {
                return {
                    data: [],
                    status: 200,
                    message: "No records found"
                };
            }

            const GridResult: DataSyncToRecruitmentResponse[] = res.map((item: any, index: number) => ({
                ID: item.ID,
                RecordID: index + 1,

                BusinessUnitCode: item?.BusinessUnitCode?.BusineesUnitCode ?? "",
                BusinessUnitCodeId: item?.BusinessUnitCodeId ?? "",

                BusinessUnitName: "",
                BusinessUnitDescription: "",

                Nationality: item?.Nationality,
                Department: item?.Department?.DepartmentName ?? "",
                DepartmentId: item?.DepartmentId,

                SubDepartment: item?.SubDepartment?.SubDepTitle ?? "",
                SubDepartmentId: item?.SubDepartmentId,

                Section: item?.Section?.SectionName ?? "",
                SectionId: item?.SectionId,

                DepartmentCodeId: item?.DepartmentCodeId,
                DepartmentCode: item?.DepartmentCode?.DptCode ?? "",

                EmploymentCategory: item?.EmploymentCategory,
                TypeOfContract: item?.TypeOfContract,

                NumberOfPersonNeeded: item?.NumberOfPersonNeeded,
                EnterNumberOfMonths: item?.EnterNumberOfMonths,

                AreaofWork: item?.AreaofWork,

                DateRequried: item?.DateRequried ?? "",

                Type: item?.DataFrom ?? "",

                Status: item?.Status?.StatusDescription ?? "",
                StatusId: item?.StatusId,

                Action: item?.Action?.Action ?? "",
                ActionTypeId: item?.ActionId ?? "",

                Location: item?.Location ?? "",

                JobCodeId: item?.JobCode?.ID ?? 0,
                JobCode: item?.JobCode?.JobCode ?? "",

                JobTitleEnglish: "",
                JobTitleFrench: "",
                PatersonGrade: "",
                DRCGrade: "",

                JobTitleEnglishId: 0,
                JobTitleFrenchId: 0,
                PatersonGradeId: 0,
                DRCGradeId: 0,

                Checked: false,

                VacancyConfirmed: item?.VacancyConfirmed ?? "",
                RecruitmentAuthorised: item?.RecruitmentAuthorised ?? "",
                IsPayrollEmailed: item?.IsPayrollEmailed ?? "",

                AssignedHR: "",
                AssignedHRId: 0,

                AssignLineManager: item?.LineManager ?? "",
                AssignLineManagerId: item?.AssignLineManagerId ?? 0,

                ReasonForVacancy: item?.ReasonForVacancy ?? "",

                JobPostingStartDate: item?.JobPostingStartDate ? moment(item.JobPostingStartDate).format("YYYY-MM-DD") : undefined,
                JobPostingEndDate: item?.JobPostingEndDate ? moment(item.JobPostingEndDate).format("YYYY-MM-DD") : undefined,
                JobPostingFirstExtensionEndDate: item?.JobPostingFirstExtensionEndDate ? moment(item.JobPostingFirstExtensionEndDate).format("YYYY-MM-DD") : undefined,
                JobPostingSecondExtensionEndDate: item?.JobPostingSecondExtensionEndDate ? moment(item.JobPostingSecondExtensionEndDate).format("YYYY-MM-DD") : undefined,

                AssignEMail: item?.AssignedHR,
                AssignHOD: item?.HOD,

                AssignHRLead: item?.RecruitmentHRLead ?? "",

                QuestionByHR: item?.QuestionByHR ?? "",
                QuestionByLM: item?.QuestionByLM ?? "",

                JobAppliedCount: "0",
                ReviewScoreCount: "0",

                ModifiedDate: item?.Modified ? moment(item.Modified).format("YYYY-MM-DD") : undefined,
                CreatedDate: item?.Created ? moment(item.Created).format("YYYY-MM-DD") : undefined
            }));


            /* -------------------------
               STEP 2 : Get Position Details
            --------------------------*/

            const ids = GridResult.map(x => x.ID);

            const idChunks = SPServices.ArraySpiltInOperator(ids, InOperator.arraysize);

            for (const chunk of idChunks) {

                const resdata: any[] = await SPServices.SPReadItems({
                    Listname: ListNames.HRMSRecruitmentPositionDetails,
                    Select: "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
                    Expand: "JobTitleEnglish,DRCGrade,PatersonGrade,JobTitleFrench",
                    Filter: [{ FilterKey: "RecruitmentID", Operator: "in", FilterValue: chunk }],
                    Topcount: count.Topcount
                });


                /* -------------------------
                   STEP 3 : Create lookup map
                --------------------------*/

                const positionMap = new Map<number, any>();

                resdata.forEach((r: any) => {
                    positionMap.set(r.RecruitmentIDId, r);
                });


                /* -------------------------
                   STEP 4 : Merge data
                --------------------------*/

                GridResult.forEach(item => {

                    const pos = positionMap.get(item.ID);

                    if (!pos) return;

                    item.JobTitleEnglish = pos?.JobTitleEnglish?.JobTitleInEnglish ?? "";
                    item.JobTitleEnglishId = pos?.JobTitleEnglishId ?? 0;

                    item.JobTitleFrench = pos?.JobTitleFrench?.JobTitleInFrench ?? "";
                    item.JobTitleFrenchId = pos?.JobTitleFrenchId ?? 0;

                    item.PatersonGrade = pos?.PatersonGrade?.PatersonGrade ?? "";
                    item.PatersonGradeId = pos?.PatersonGradeId ?? 0;

                    item.DRCGrade = pos?.DRCGrade?.DRCGrade ?? "";
                    item.DRCGradeId = pos?.DRCGradeId ?? 0;

                });

            }

            return {
                data: GridResult,
                status: 200,
                message: "GetRecruitmentDetails fetched successfully"
            };

        } catch (error) {

            console.error("Error fetching data:", error);

            return {
                data: [],
                status: 500,
                message: "Error fetching data"
            };

        }
    }


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


    private async _fetchPortalJobCodeMap(
        queries: BatchQuery[]
    ): Promise<Map<number, string>> {

        return new Map();
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
                } catch (error) {
                    result.set(String(metric.id), 0);
                }
            })
        );

        return result;
    }

};