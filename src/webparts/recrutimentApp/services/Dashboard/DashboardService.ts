import moment from "moment";
import { ApiResponse } from "../../models/apimodels";
import { Choices, count, InOperator } from "../../utilities/ApiConfig";
import {
  DataFrom,
  ListNames,
  RoleID,
  StatusId,
  workflowStatusApi,
} from "../../utilities/Config";
import SPServices from "../SPService/spservice";
import {
  DashboardData,
  DataSyncToRecruitmentResponse,
  IDashboard,
  IDashboardDepartment,
  IEvaluValidate,
  IInterviewPanel,
  IJDEDataMapping,
  IPortalItem,
  ITooltipData,
  tooltipData,
  tooltipInterviewPanel,
} from "./IDashboard";
import { BatchQuery } from "../SPService/Ispservice";
import { getProfileData } from "../AxiosService/CareerPortalAPI";
import {
  ExternalApiCountItem,
  ExternalApiParams,
  Metric,
  MetricConfig,
} from "../../models/IDashboard";
import { MatricColums } from "../../components/Screens/Dashboard/metricColumns.config";
import {
  InterviewLevel,
  MatricID,
  Nationality,
  NationalityCode,
  RoleName,
} from "../../utilities/ConditionConfig";
import { CommonServices, masterService } from "../ServiceExport";
import { EvalQueryConfig } from "../../components/Screens/SelectionProcess/config/EvaluationConfig";
import { IJobGrade } from "../../models/master";

export default class DashboardService implements IDashboard {
  async GetDashboardCount(
    queries: BatchQuery[],
    currentRoleID: number[],
    EmailID?: string,
  ): Promise<ApiResponse<Metric[]>> {
    try {
      const metricConfigs = MatricColums(currentRoleID);
      if (!metricConfigs?.length) {
        return {
          data: [],
          status: 200,
          message: "No metrics configured for this role",
        };
      }

      // const [spCounts, portalJobCodeMap] = await Promise.all([
      //     SPServices.batchGet(queries),
      //     this._fetchPortalJobCodeMap(queries),
      // ]);

      if (currentRoleID.includes(RoleID.FinanceDepartment)) {
        queries = queries.map((item: any) => {
          if (item.StateValue === MatricID.LabourHire) {
            return {
              ...item,
              Filter: item.Filter.filter(
                (f: any) => f.FilterKey !== "RecruitmentHR",
              ).map((f: any) => {
                if (
                  f.FilterKey === "StatusId" &&
                  Array.isArray(f.FilterValue)
                ) {
                  return {
                    ...f,
                    FilterValue: f.FilterValue.filter(
                      (status: number) =>
                        status !== StatusId.PendingHROfferInitiate &&
                        status !== StatusId.PendingHROfferReview &&
                        status !==
                        StatusId.PendingHRReviewOfferWorkPermitInit &&
                        status !==
                        StatusId.PendingHRReviewOfferuploadEmploymentInit &&
                        status !== StatusId.PendingHREmploymentContractInit &&
                        status !== StatusId.PendingHREmploymentContractReview &&
                        status !==
                        StatusId.PendingHREmploymentContractVerification &&
                        status !== StatusId.PendingHRpreonboardingchecklist,
                    ),
                  };
                }
                return f;
              }),
            };
          }
          return item;
        });
      }

      if (currentRoleID.includes(RoleID.RecruitmentHR)) {
        queries = queries.map((item: any) => {
          if (item.StateValue === MatricID.LabourHire) {
            return {
              ...item,
              Filter: item.Filter.map((f: any) => {
                if (
                  f.FilterKey === "StatusId" &&
                  Array.isArray(f.FilterValue)
                ) {
                  return {
                    ...f,
                    FilterValue: f.FilterValue.filter(
                      (status: number) =>
                        status !== StatusId.PendingFinancePaymentReview,
                    ),
                  };
                }
                return f;
              }),
            };
          }
          return item;
        });
      }

      let EvalutionFilter = queries.filter(
        (item: any) =>
          item.StateValue === MatricID.EvalutionHR ||
          item.StateValue === MatricID.EvalutionHOD ||
          item.StateValue === MatricID.EvalutionLM ||
          item.StateValue === MatricID.EvalutionEXCO,
      );

      if (EvalutionFilter.length > 0) {
        const UserID = await CommonServices.getUserGuidByEmail(EmailID ?? "");

        const listItems: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select: EvalQueryConfig.InterviewPanel.Select,
          Expand: EvalQueryConfig.InterviewPanel.Expand,
          Filter: [
            {
              FilterKey: "InterviewPanelId",
              Operator: "eq",
              FilterValue: UserID.data?.key ?? "",
            },
            {
              FilterKey: "IsScoreSheetUploaded",
              Operator: "eq",
              FilterValue: Choices.No,
            },
          ],
        });

        const CandidateIds = listItems
          .map((item) => item.CandidateID?.ID)
          .filter(Boolean);

        if (CandidateIds.length > 0) {
          let filterParam = [
            {
              FilterKey: "ID",
              Operator: "in",
              FilterValue: CandidateIds,
            },
          ];

          queries = queries.map((item: any) => {
            if (
              item.StateValue === MatricID.EvalutionHR ||
              item.StateValue === MatricID.EvalutionHOD ||
              item.StateValue === MatricID.EvalutionLM ||
              item.StateValue === MatricID.EvalutionEXCO
            ) {
              return {
                ...item,
                Filter: [...item.Filter, ...filterParam],
              };
            }
            return item;
          });
        } else {
          let filterParam = [
            {
              FilterKey: "ItemCreated",
              Operator: "eq",
              FilterValue: Choices.Yes,
            },
          ];
          queries = queries.map((item: any) => {
            if (
              item.StateValue === MatricID.EvalutionHR ||
              item.StateValue === MatricID.EvalutionHOD ||
              item.StateValue === MatricID.EvalutionLM ||
              item.StateValue === MatricID.EvalutionEXCO
            ) {
              return {
                ...item,
                Filter: [...item.Filter, ...filterParam],
              };
            }
            return item;
          });
        }
      }

      const spCounts = await SPServices.batchGet(queries);

      const externalMetrics = metricConfigs.filter((m: any) => m.externalApi);

      const externalCountMap = await this._fetchExternalCounts(
        externalMetrics,
        spCounts,
        new Map(),
      );

      const metrics: Metric[] = metricConfigs
        .map((config) => {
          const hasExternalCount = externalCountMap.has(String(config.id));
          const spCount = (spCounts[config.id] as any[])?.length ?? 0;

          const value = hasExternalCount
            ? (externalCountMap.get(String(config.id)) ?? 0)
            : spCount;

          return {
            ...config,
            value,
            showArrow: config.showArrow || hasExternalCount,
          };
        })
        .sort((a, b) => Number(b.showArrow) - Number(a.showArrow));

      return {
        data: metrics,
        status: 200,
        message: "Dashboard counts fetched successfully",
      };
    } catch (error) {
      console.error("GetDashboardCount error:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching dashboard counts",
      };
    }
  }

  private async _fetchExternalCounts(
    externalMetrics: MetricConfig[],
    spCounts: Record<string, any[]>,
    _portalJobCodeMap: Map<number, string>,
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    if (!externalMetrics.length) return result;

    const allJobCodeIds = externalMetrics
      .flatMap((m) =>
        (spCounts[m.id] ?? [])
          .map((item: any) => item.JobCodeId)
          .filter(Boolean),
      )
      .filter((value, index, self) => self.indexOf(value) === index);

    if (!allJobCodeIds.length) return result;

    const portalItems = await SPServices.SPReadItems({
      Listname: ListNames.RecruitAppCareerPortalIntegration,
      Select: `*,JobCode/JobCode`,
      Filter: [
        { FilterKey: "JobCodeId", Operator: "in", FilterValue: allJobCodeIds },
      ],
      FilterCondition: "and",
      Expand: `JobCode`,
      Topcount: count.Topcount,
      Orderby: "ID",
      Orderbydecorasc: true,
    });

    const jobCodeIdToUniqueKey = new Map<number, string>(
      portalItems.map((item: any) => [item.JobCodeId, item.JobUniqueKey]),
    );

    await Promise.all(
      externalMetrics.map(async (metric) => {
        const jobCodeIds: number[] = (spCounts[metric.id] ?? [])
          .map((item: any) => item.JobCodeId)
          .filter(Boolean);

        if (metric.id === MatricID.ReviewScoreCard) {

          const uniqueJobCodeCount = (spCounts[metric.id] ?? [])
            .map((item: any) => item.JobCodeId)
            .filter(Boolean)
            .filter(
              (jobCodeId: number, index: number, arr: number[]) =>
                arr.indexOf(jobCodeId) === index
            ).length;
          return result.set(String(metric.id), uniqueJobCodeCount);
        } else {


          const jobUniqueKeys = jobCodeIds
            .map((id) => jobCodeIdToUniqueKey.get(id))
            .filter((key): key is string => !!key);

          if (!jobUniqueKeys.length) {
            result.set(String(metric.id), 0);
            return;
          }

          const params: ExternalApiParams = {
            jobCodes: jobUniqueKeys,
            workflowStatus: metric.externalApi!.workflowStatuses,
          };
          try {
            const response = await getProfileData.GetJobAppliedCount(params);
            // let total: number = Array.isArray(response?.data?.data)
            //   ? response?.data?.data?.reduce(
            //       (sum: number, item: ExternalApiCountItem) =>
            //         sum + (item.count ?? 0),
            //       0,
            //     )
            //   : (response?.data?.data?.count ?? 0);

            let total = Array.isArray(response?.data?.data)
              ? response.data.data.filter(
                (item: ExternalApiCountItem) => (item.count ?? 0) > 0
              ).length
              : (response?.data?.data?.count ?? 0) > 0
                ? 1
                : 0;


            if (metric.id === MatricID.AssignInterviewPanel) {
              const level2Filter = [
                {
                  FilterKey: "StatusId",
                  Operator: "eq",
                  FilterValue:
                    StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
                },
                {
                  FilterKey: "JobCodeId",
                  Operator: "in",
                  FilterValue: jobCodeIds,
                },
              ];
              const level2 = await this.GetCandidateDetails(level2Filter, "and");
              const uniqueLevel2JobCodes = new Set(
                (level2?.data ?? [])
                  .map((item: any) => item.ID)
                  .filter(Boolean)
              );

              total += uniqueLevel2JobCodes.size;
            }

            result.set(String(metric.id), total);
          } catch {
            // eslint-disable-line
            result.set(String(metric.id), 0);
          }


        }
      }),
    );

    return result;
  }

  private async _fetchCandidateCounts(
    jobCodeId: number,
    workflowStatusId: string[],
  ): Promise<number> {
    if (!jobCodeId) return 0;

    try {
      const portalItems = (await SPServices.SPReadItems({
        Listname: ListNames.RecruitAppCareerPortalIntegration,
        Select: `*,JobCode/JobCode`,
        Filter: [
          { FilterKey: "JobCodeId", Operator: "in", FilterValue: jobCodeId },
        ],
        FilterCondition: "and",
        Expand: `JobCode`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: false,
      })) as IPortalItem[];

      // Guard: no portal items found
      const jobUniqueKey = portalItems?.[0]?.JobUniqueKey;
      if (!jobUniqueKey) return 0;

      const params: ExternalApiParams = {
        jobCodes: [jobUniqueKey],
        workflowStatus: workflowStatusId,
      };

      const response = await getProfileData.GetJobAppliedCount(params);

      // Safe access with fallback to 0
      return response?.data?.data[0]?.count ?? 0;
    } catch (error) {
      console.error(
        `[_fetchCandidateCounts] Failed for JobCodeId ${jobCodeId}:`,
        error,
      );
      return 0;
    }
  }

  private async _getCandidateCountByMatric(
    jobCodeId: number,
    MatricId: number,
    RecID: number,
  ): Promise<number> {
    try {
      if (MatricId === MatricID.ReviewProfileHR) {
        return this._fetchCandidateCounts(jobCodeId, [
          workflowStatusApi.HRPending,
        ]);
      }

      if (MatricId === MatricID.ReviewProfileLM) {
        return this._fetchCandidateCounts(jobCodeId, [
          workflowStatusApi.LineManagerL1Pending,
          workflowStatusApi.LineManagerL2Pending,
          workflowStatusApi.LineManagerLevel1OnHold,
          workflowStatusApi.LineManagerLevel2OnHold,
        ]);
      }

      if (MatricId === MatricID.AssignInterviewPanel) {
        const level1Promise = this._fetchCandidateCounts(jobCodeId, [
          workflowStatusApi.PendingRecruitmentHRscheduleInterview,
        ]);

        const level2Promise = this.GetCandidateDetails(
          [
            {
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue:
                StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
            },
            {
              FilterKey: "RecruitmentID/ID",
              Operator: "eq",
              FilterValue: RecID,
            },
          ],
          "and",
        );

        const [level1, level2] = await Promise.all([
          level1Promise,
          level2Promise,
        ]);

        return level1 + (level2?.data?.length ?? 0);
      }

      if (MatricId === MatricID.ReviewScoreCard) {
        const ReviewScoreCard = await this.GetCandidateDetails(
          [
            {
              FilterKey: "StatusId",
              Operator: "in",
              FilterValue:
                [
                  StatusId.PendingwithpositionIDAssignmentWithHOD,
                  StatusId.pendingL2shorlistingwithHOD,
                  StatusId.CandidateOnHoldbyHODLevel1,
                  StatusId.CandidateOnHoldbyHODLevel2,
                  StatusId.OnHoldbyHOD
                ],
            },
            {
              FilterKey: "RecruitmentID/ID",
              Operator: "eq",
              FilterValue: RecID,
            },
          ],
          "and",
        );
        return ReviewScoreCard?.data?.length ?? 0;
      }

      return 0;
    } catch (error) {
      console.error("_getCandidateCountByMatric Error:", error);
      return 0;
    }
  }

  async GetRecruitmentDetails(
    filterParam: any,
    filterConditions: any,
    MatricId?: number,
  ): Promise<ApiResponse<DashboardData[]>> {
    try {
      const recruitmentResponse: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        Select: `
        *,
        Status/StatusDescription,
        JobCode/JobCode,
        JobCode/ID,
        JobCode/JobTitleInEnglish,
        BusinessUnitCode/BusineesUnitCode,
        Department/DepartmentName
      `,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: `Status,JobCode,BusinessUnitCode,Department`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: false,
      });
      if (!recruitmentResponse.length) {
        return {
          data: [],
          status: 200,
          message: "No records found",
        };
      }
      const uniqueBusinessUnitIds = Array.from(
        new Set(
          recruitmentResponse
            .map((item) => item.BusinessUnitCodeId)
            .filter(Boolean),
        ),
      );
      const jdeResponse: any[] = await SPServices.SPReadItems({
        Listname: ListNames.JDEDataMapping,
        Select: `
        *,
        BUC/BusineesUnitCode,
        LineManager/Title,
        LineManager/EMail,
        HOD/Title,
        HOD/EMail,
        HR/Title,
        HR/EMail,
        EXCO/Title,
        EXCO/EMail
      `,
        Filter: uniqueBusinessUnitIds.map((id) => ({
          FilterKey: "BUC",
          Operator: "eq",
          FilterValue: id,
        })),
        FilterCondition: "or",
        Expand: "BUC,LineManager,HOD,HR,EXCO",
        Topcount: 5000,
        Orderby: "ID",
        Orderbydecorasc: true,
      });
      const jdeMap = new Map<number, any>();
      jdeResponse.forEach((item: any) => {
        if (item?.BUCId) {
          jdeMap.set(item.BUCId, item);
        }
      });
      const userCache = new Map<string, string>();
      const getCachedUserName = async (
        email?: string,
        title?: string,
      ): Promise<string> => {
        try {
          if (title) {
            return title;
          }
          if (!email) {
            return "";
          }
          if (userCache.has(email)) {
            return userCache.get(email) || "";
          }
          const response = await CommonServices.GetUserName(email);
          const userName = String(response?.data || "");
          userCache.set(email, userName);
          return userName;
        } catch (error) {
          console.error("getCachedUserName Error:", error);
          return "";
        }
      };
      const shouldCheckCandidateCount =
        MatricId === MatricID.ReviewProfileHR ||
        MatricId === MatricID.AssignInterviewPanel ||
        MatricId === MatricID.ReviewProfileLM ||
        MatricId === MatricID.ReviewScoreCard;
      const filteredResponse = [];
      for (const item of recruitmentResponse) {
        if (shouldCheckCandidateCount) {
          const candidateCount = await this._getCandidateCountByMatric(
            item.JobCodeId,
            MatricId ?? 0,
            item.ID
          );

          if (candidateCount === 0) {
            continue;
          }

          item.candidateCount = candidateCount;
        }
        filteredResponse.push(item);
      }
      const GridResult: DashboardData[] = await Promise.all(
        filteredResponse.map(async (item: any, index: number) => {

          const jdeData = jdeMap.get(item.BusinessUnitCodeId);
          const [LineManager, HOD, Exco, HR, HRLead] = await Promise.all([
            getCachedUserName(
              jdeData?.LineManager?.EMail,
              jdeData?.LineManager?.Title,
            ),
            getCachedUserName(jdeData?.HOD?.EMail, jdeData?.HOD?.Title),
            getCachedUserName(jdeData?.EXCO?.EMail, jdeData?.EXCO?.Title),
            getCachedUserName(item?.AssignedHR),
            getCachedUserName(item?.RecruitmentHRLead),
          ]);

          const StatusTooltip: tooltipInterviewPanel = {
            LineManager: LineManager
              ? {
                Role: RoleName.LineManager,
                Name: LineManager,
              }
              : ({} as tooltipData),
            HOD: HOD
              ? {
                Role: RoleName.HOD,
                Name: HOD,
              }
              : ({} as tooltipData),
            Exco: Exco
              ? {
                Role: RoleName.EXCO,
                Name: Exco,
              }
              : ({} as tooltipData),
            HR: HR
              ? {
                Role: RoleName.RecruitmentHR,
                Name: HR,
              }
              : ({} as tooltipData),
            HRLead: HRLead
              ? {
                Role: RoleName.RecruitmentHRLead,
                Name: HRLead,
              }
              : ({} as tooltipData),
          };
          return {
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
            Department: item?.Department?.DepartmentName ?? "",
            EmploymentCategory: item?.EmploymentCategory,
            StatusTooltip,
            CandidateCount: item?.candidateCount ?? 0,
          };
        })
      )
      return {
        data: GridResult,
        status: 200,
        message: "GetRecruitmentDetails fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching GetRecruitmentDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching data",
      };
    }
  }

  async GetDepartmentDetails(): Promise<ApiResponse<IDashboardDepartment[]>> {
    try {
      const recruitmentResponse: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDeptOpenings,
        Select: `
        *,
        Department/DepartmentName
      `,
        Expand: `Department`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: true,
      });
      if (!recruitmentResponse.length) {
        return {
          data: [],
          status: 200,
          message: "No records found",
        };
      }
      const departmentCountMap: Record<string, number> = {};
      recruitmentResponse.forEach((item: any) => {
        const departmentName = item?.Department?.DepartmentName ?? "Unknown";
        departmentCountMap[departmentName] = (departmentCountMap[departmentName] || 0) + 1;
      });
      const GridResult: IDashboardDepartment[] = Object.entries(departmentCountMap).map(([name, value]) => ({
        name,
        value,
      }));


      return {
        data: GridResult,
        status: 200,
        message: "GetRecruitmentDetails fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching GetRecruitmentDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching data",
      };
    }
  }

  // async GetCareerPortalCandidate(
  //   JobCodeID: number,
  //   WorkflowStatusID: string[];
  // ): Promise<ApiResponse<GetProfileByJobCode[]>> {
  //    try {
  //        let FilterValue: FilterItem = {
  //           jobCode: "",
  //           workflowStausId: [],
  //           pagination: {
  //             filterValue: "",
  //             sortBy: "",
  //             sortOrder: 0,
  //             pageSize: 0,
  //             currentPage: 0,
  //             totalItems: 0,
  //           },
  //         };
  //       const res = await getProfileData.GetProfileByJobCode(FilterValue);

  //       if (!res?.data?.data) {
  //         return {
  //           data: [],
  //           status: 200,
  //           message: "No candidate data",
  //         };
  //       }

  //       const totalItems = res.data.pagination?.totalItems || 0;

  //       const mappedData: GetProfileByJobCode[] = res.data.data.map(
  //         (item: any, index: number) => {
  //           const JobCode = item?.jobCode?.split("-")[0];

  //           return {
  //             SNO: index + 1,
  //             CandidateID: item?.jobRequestId,
  //             ApplicantName: item?.applicantName,
  //             PositionTitle: item?.jobTitle?.displayText,
  //             JobCode: JobCode,
  //             Status: item?.workflowStatus?.displayText,
  //             workflowStatusId: item?.workflowStatusId,
  //             createdOn: moment(item?.createdOn).format("DD/MM/YYYY"),
  //             TotalItems: totalItems,
  //             applicationStatusId: item?.applicationStatusId,
  //             applicationStatus: item?.applicationStatus?.displayText,
  //             createdBy: item?.createdBy,
  //             tblProfilesKcsas: item?.tblProfilesKcsas || [],
  //           };
  //         }
  //       );
  //       // console.log("Mapped Candidate Data:", mappedData);
  //       return {
  //         data: mappedData,
  //         status: 200,
  //         message: "Get Candidate details",
  //       };
  //     } catch (error) {
  //       console.error("Error Get Candidate details:", error);

  //       return {
  //         data: [],
  //         status: 500,
  //         message: "Error Get Candidate details",
  //       };
  //     }
  // }

  // private async fetchRecruitmentByLookup(
  //   listName: string,
  //   filterParam: any,
  //   filterConditions: any
  // ): Promise<ApiResponse<any[]>> {
  //   try {
  //     let GridResult: any[] = [];

  //     const res: any[] = await SPServices.SPReadItems({
  //       Listname: listName,
  //       Select: `*,Status/StatusDescription,RecruitmentID/Id`,
  //       Filter: filterParam,
  //       FilterCondition: filterConditions,
  //       Expand: `RecruitmentID,Status`,
  //       Topcount: count.Topcount,
  //       Orderby: "ID",
  //       Orderbydecorasc: true,
  //     });

  //     if (!res.length) {
  //       return { data: [], status: 200, message: "No records found" };
  //     }

  //     const ids: number[] = res
  //       .map((item: any) => item.RecruitmentID?.Id)
  //       .filter(Boolean);

  //     if (!ids.length) {
  //       return { data: [], status: 200, message: "No linked recruitment records found" };
  //     }

  //     const recruitmentFilter = [
  //       { FilterKey: "ID", Operator: "in", FilterValue: ids },
  //     ];

  //     let DeptDetails = await this.GetRecruitmentDetails(
  //       recruitmentFilter,
  //       filterConditions
  //     );

  //     if (listName === ListNames.HRMSRecruitmentCandidatePersonalDetails) {
  //       GridResult = res.map((item) => {
  //         const deptDetails = DeptDetails.data.filter(
  //           (dpt) => dpt.ID === item.RecruitmentID?.Id
  //         );

  //         return {
  //           ApplicantName:
  //             `${item.FirstName || ""} ${item.MiddleName || ""} ${item.LastName || ""}`.trim(),

  //           PositionTitle: item?.PositionTitle,
  //           JobGrade: item?.JobGrade,
  //           Nationality: item?.Nationality,

  //           Status: item?.Status?.StatusDescription ?? "",
  //           StatusId: item?.StatusId,

  //           InterviewDate: item?.InterviewDate
  //             ? moment(item.InterviewDate).format("YYYY-MM-DD")
  //             : undefined,

  //           ModifiedDate: item?.Modified
  //             ? moment(item.Modified).format("YYYY-MM-DD")
  //             : undefined,

  //           CreatedDate: item?.Created
  //             ? moment(item.Created).format("YYYY-MM-DD")
  //             : undefined,

  //           DeptDetails: deptDetails, // optional if needed
  //         };
  //       });
  //     }else if(listName === ListNames.HRMSRecruitmentCandidatePersonalDetails){}

  //     return { data: GridResult, status: 200, message: "Success" };

  //   } catch (error) {
  //     console.error(`Error fetching from ${listName}:`, error);
  //     return { data: [], status: 500, message: "Error fetching data" };
  //   }
  // }

  async GetCandidateDetails(
    filterParam: any,
    filterConditions: any,
    MatricId?: number,
    EmailID?: string,
  ): Promise<ApiResponse<any[]>> {
    try {
      const isEvaluationFlow =
        MatricId === MatricID.EvalutionHR ||
        MatricId === MatricID.EvalutionLM ||
        MatricId === MatricID.EvalutionHOD ||
        MatricId === MatricID.EvalutionEXCO;

      if (EmailID && isEvaluationFlow) {
        const UserID = await CommonServices.getUserGuidByEmail(EmailID);

        const listItems: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select: EvalQueryConfig.InterviewPanel.Select,
          Expand: EvalQueryConfig.InterviewPanel.Expand,
          Filter: [
            {
              FilterKey: "InterviewPanelId",
              Operator: "eq",
              FilterValue: UserID.data?.key ?? "",
            },
            {
              FilterKey: "IsScoreSheetUploaded",
              Operator: "eq",
              FilterValue: Choices.No,
            },
          ],
        });

        const recruitmentIds = listItems
          .map((item) => item.CandidateID?.ID)
          .filter(Boolean); // ← also filter falsy IDs

        if (recruitmentIds.length === 0) {
          return { data: [], status: 200, message: "No records found" };
        }

        filterParam.push({
          FilterKey: "ID",
          Operator: "in",
          FilterValue: recruitmentIds,
        });
      }

      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: `*,Status/StatusDescription,RecruitmentID/Id`,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: `RecruitmentID,Status`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: true,
      });

      if (!res.length) {
        return { data: [], status: 200, message: "No records found" };
      }

      const recruitmentIds: number[] = res
        .map((item: any) => item.RecruitmentID?.Id)
        .filter(Boolean);

      if (!recruitmentIds.length) {
        return {
          data: [],
          status: 200,
          message: "No linked recruitment records found",
        };
      }

      const uniqueGrades = Array.from(
        new Set(res.map((item) => item?.JobGrade).filter(Boolean)),
      );

      const recruitmentFilter = [
        { FilterKey: "ID", Operator: "in", FilterValue: recruitmentIds },
      ];

      const [deptResult, ...gradeResults] = await Promise.all([
        this.GetRecruitmentDetails(recruitmentFilter, filterConditions),
        ...uniqueGrades.map((grade) =>
          masterService.GetGradeLevel(grade).catch((err) => {
            console.error(`GradeLevel API failed for grade "${grade}":`, err);
            return { data: [] };
          }),
        ),
      ]);

      const gradeLevelMap = new Map<string, IJobGrade | any[]>(
        uniqueGrades.map((grade, i): [string, IJobGrade | any[]] => [
          grade,
          gradeResults[i]?.data ?? [],
        ]),
      );

      const deptMap = new Map<number, any[]>();
      for (const dept of deptResult.data ?? []) {
        const existing = deptMap.get(dept.ID) ?? [];
        existing.push(dept);
        deptMap.set(dept.ID, existing);
      }

      const GridResult = res.map((item, index) => {
        const InterviewDate = item?.InterviewDateLevel2 ?? item?.InterviewDate;

        return {
          ID: item.ID,
          RecordID: index + 1,
          RecID: item.RecruitmentID?.Id,
          ApplicantName:
            `${item.FristName ?? ""} ${item.MiddleName ?? ""} ${item.LastName ?? ""}`.trim(),

          PositionTitle: item?.PositionTitle,
          JobGrade: item?.JobGrade,
          Nationality: item?.Nationality,

          interviewLevels: (gradeLevelMap.get(item?.JobGrade) as any[]) ?? [],
          jobrequestID: item?.JobRequestID,

          Status: item?.Status?.StatusDescription ?? "",
          StatusId: item?.StatusId,

          InterviewDate: InterviewDate
            ? moment(InterviewDate).format("DD-MM-YYYY")
            : undefined,

          ModifiedDate: item?.Modified
            ? moment(item.Modified).format("DD-MM-YYYY")
            : undefined,

          CreatedDate: item?.Created
            ? moment(item.Created).format("DD-MM-YYYY")
            : undefined,

          isExpat: item?.NationalityCode !== NationalityCode.Nationals,

          DeptDetails: deptMap.get(item.RecruitmentID?.Id) ?? [],
        };
      });

      return { data: GridResult, status: 200, message: "Success" };
    } catch (error) {
      console.error(`Error fetching from Candidate details:`, error);
      return { data: [], status: 500, message: "Error fetching data" };
    }
  }

  async GetSelectedCandidate(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<DashboardData[]>> {
    try {
      let GridResult: any[] = [];
      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSSelectedCandidateDetailsByHOD,
        Select: `*,Status/StatusDescription,RecruitmentID/Id,CandidateID/ID,PositionID/PositionID`,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: `RecruitmentID,Status,CandidateID,PositionID`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: true,
      });

      if (!res.length) {
        return { data: [], status: 200, message: "No records found" };
      }

      const ids: number[] = res
        .map((item) => item.RecruitmentID?.Id)
        .filter(Boolean);

      const candidateIds: number[] = res
        .map((item) => item.CandidateID?.ID)
        .filter(Boolean);

      if (!ids.length) {
        return {
          data: [],
          status: 200,
          message: "No linked recruitment records found",
        };
      }

      const recruitmentFilter = [
        { FilterKey: "ID", Operator: "in", FilterValue: ids },
      ];

      const candidateFilter = [
        { FilterKey: "ID", Operator: "in", FilterValue: candidateIds },
      ];

      const DeptDetails = await this.GetRecruitmentDetails(
        recruitmentFilter,
        filterConditions,
      );

      const getCandidateDetails = await this.GetCandidateDetails(
        candidateFilter,
        filterConditions,
      );

      // ✅ Convert to Map (FAST lookup)
      const deptMap = new Map(DeptDetails.data.map((d) => [d.ID, d]));

      const candidateMap = new Map(
        getCandidateDetails.data.map((c) => [c.ID, c]),
      );

      // ✅ Main mapping
      GridResult = res.map((item, index) => {
        const deptDetails = deptMap.get(item.RecruitmentID?.Id);
        const candidate = candidateMap.get(item.CandidateID?.ID);

        return {
          ID: index + 1,
          ItemID: item?.ID,
          ApplicantName: candidate?.ApplicantName ?? "",
          PositionTitle: candidate?.PositionTitle,
          JobGrade: candidate?.JobGrade,
          Nationality: candidate?.Nationality,

          Status: item?.Status?.StatusDescription ?? "",
          StatusId: item?.StatusId,
          PositionID: item?.PositionID?.PositionID,

          ModifiedDate: item?.Modified
            ? moment(item.Modified).format("DD-MM-YYYY")
            : undefined,

          CreatedDate: item?.Created
            ? moment(item.Created).format("DD-MM-YYYY")
            : undefined,

          DeptDetails: deptDetails ?? null,
          candiDetails: candidate ?? null,
        };
      });

      return { data: GridResult, status: 200, message: "Success" };
    } catch (error) {
      console.error(`Error fetching from Candidate details:`, error);
      return { data: [], status: 500, message: "Error fetching data" };
    }
  }

  async GetNPAEPVRRDetails(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<DashboardData[]>> {
    try {
      const queries: BatchQuery[] = [
        {
          StateValue: 1,
          ListName: ListNames.HRMSAdditionalHeadCountForExisitingPosition,
          Filter: filterParam,
          FilterCondition: filterConditions,
          select: [
            "*",
            "Status/StatusDescription",
            "BusinessUnitCode/BusineesUnitCode",
            "Department/DepartmentName",
            "JobTitleEnglish/JobTitleInEnglish",
            "JobTitleFrench/JobTitleInFrench",
            "JobTitleEnglish/JobCode",
          ],
          expand: [
            "Status",
            "BusinessUnitCode",
            "Department",
            "JobTitleEnglish",
            "JobTitleFrench",
          ],
        },
        {
          StateValue: 2,
          ListName: ListNames.HRMSNewPositionRequest,
          Filter: filterParam,
          FilterCondition: filterConditions,
          select: [
            "*",
            "BusinessUnitCode/BusineesUnitCode",
            "Status/StatusDescription",
            "Department/DepartmentName",
          ],
          expand: ["Status", "BusinessUnitCode", "Department"],
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
            "Department/DepartmentName",
          ],
          expand: ["Status", "JobCode", "BusinessUnitCode", "Department"],
        },
      ];

      const batchRes: Record<number, any[]> =
        await SPServices.batchGet(queries);

      if (!batchRes || !Object.keys(batchRes).length) {
        return { data: [], status: 200, message: "No records found" };
      }

      const additionalExistingItems: any[] = batchRes[1] || [];
      const newPositionItems: any[] = batchRes[2] || [];
      const vacancyItems: any[] = batchRes[3] || [];

      const additionalIds = additionalExistingItems
        .map((i: any) => i.ID)
        .filter(Boolean);
      const newPositionIds = newPositionItems
        .map((i: any) => i.ID)
        .filter(Boolean);

      const [additionalPositionRes, newPositionRes] = await Promise.all([
        additionalIds.length > 0
          ? this.GetAdditionalPosition(
            [
              {
                FilterKey: "LookupIDId",
                Operator: "in",
                FilterValue: additionalIds,
              },
            ],
            undefined,
            ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails,
          )
          : Promise.resolve({ data: [], status: 200, message: "" }),

        newPositionIds.length > 0
          ? this.GetPositionDetails(
            [
              {
                FilterKey: "PositionRequestID",
                Operator: "in",
                FilterValue: newPositionIds,
              },
            ],
            undefined,
            ListNames.HRMSNewPositionRequestPositionDetails,
          )
          : Promise.resolve({ data: [], status: 200, message: "" }),
      ]);

      const additionalPositionMap = new Map<number, any>(
        (additionalPositionRes.data ?? []).map((d: any) => [d.parentId, d]),
      );
      const newPositionMap = new Map<number, any>(
        (newPositionRes.data ?? []).map((d: any) => [d.parentId, d]),
      );

      const mapCommonFields = (
        item: any,
        index: number,
      ): Partial<DashboardData> => ({
        ID: item.ID,
        RecordID: index + 1,
        BusinessUnitCode: item?.BusinessUnitCode?.BusineesUnitCode ?? "",
        NumberOfPersonNeeded: item?.NumberOfPersonNeeded,
        Status: item?.Status?.StatusDescription ?? "",
        StatusId: item?.StatusId ?? 0,
        Nationality: item?.Nationality,
        ModifiedDate: item?.Modified
          ? moment(item.Modified).format("YYYY-MM-DD")
          : undefined,
        CreatedDate: item?.Created
          ? moment(item.Created).format("YYYY-MM-DD")
          : undefined,
        Department: item?.Department?.DepartmentName ?? "",
      });

      const additionalExistingResult: DashboardData[] =
        additionalExistingItems.map((item: any, index: number) => {
          const pos = additionalPositionMap.get(item.ID);
          return {
            ...mapCommonFields(item, index),
            Type: DataFrom.ExistingPosition,
            JobCodeId: item?.JobTitleEnglish?.ID ?? 0,
            JobCode: item?.JobTitleEnglish?.JobCode ?? "",
            JobTitleEnglish: item?.JobTitleEnglish?.JobTitleInEnglish ?? "",
            JobTitleFrench: item?.JobTitleFrench?.JobTitleInFrench ?? "",
            PatersonGrade: pos?.PatersonGrade ?? "",
            DRCGrade: pos?.DRCGrade ?? "",
            NumberOfPersonNeeded: pos?.NumberOfPersonNeeded,
          } as DashboardData;
        });

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
        },
      );

      const vacancyResult: DashboardData[] = vacancyItems.map(
        (item: any, index: number) =>
          ({
            ...mapCommonFields(item, index),
            Type: DataFrom.VacancyRecruitmentProcess,
            JobCodeId: item?.JobCode?.ID ?? 0,
            JobCode: item?.JobCode?.JobCode ?? "",
            JobTitleEnglish: item?.JobCode?.JobTitleInEnglish ?? "",
          }) as DashboardData,
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

  async GetAdditionalPosition(
    Filter: any[],
    filterConditions: any,
    ListName: string,
  ): Promise<ApiResponse<any[]>> {
    try {
      const resdata = await SPServices.SPReadItems({
        Listname: ListName,
        Select: "*,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade",
        Filter: Filter,
        FilterCondition: filterConditions,
        Expand: "DRCGrade,PatersonGrade",
        Topcount: count.CamelQuery,
      });

      const result = resdata.map((item: any, index: number) => ({
        parentId: item?.LookupIDId ?? item?.PositionRequestIDId ?? 0,
        id: index + 1,
        DRCGrade: item?.DRCGrade?.DRCGrade ?? "",
        PatersonGrade: item?.PatersonGrade?.PatersonGrade ?? "",
        NumberOfPersonNeeded: item?.ActualVacantPosition,
      }));

      return {
        data: result,
        status: 200,
        message: "GetPositionDetails fetched successfully",
      };
    } catch (error) {
      console.error("GetPositionDetails error:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching position details",
      };
    }
  }

  async GetPositionDetails(
    Filter: any[],
    filterConditions: any,
    ListName: string,
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
        title:
          item?.JobTitleEnglish?.JobTitleInEnglish ??
          item?.UnBudgetedJobTitleEnglish ??
          "",
        jobCode: item?.JobTitleEnglish?.JobCode ?? "",
        DRCGrade: item?.DRCGrade?.DRCGrade ?? "",
        PatersonGrade: item?.PatersonGrade?.PatersonGrade ?? "",
        JobTitleFrench:
          item?.JobTitleFrench?.JobTitleInFrench ??
          item?.UnBudgetedJobTitleInFrench ??
          "",
      }));

      return {
        data: result,
        status: 200,
        message: "GetPositionDetails fetched successfully",
      };
    } catch (error) {
      console.error("GetPositionDetails error:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching position details",
      };
    }
  }

  async EvalutionValidation(
    data: IEvaluValidate,
  ): Promise<ApiResponse<boolean>> {
    try {
      const getCurrentUserId = await CommonServices.getUserGuidByEmail(
        data.currentEmailID,
      );

      const levelFilter =
        data.statusId === StatusId.InterviewScheduled
          ? InterviewLevel.Level1
          : InterviewLevel.Level2;

      const resdata = (await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select: "IsScoreSheetUploaded",
        Filter: [
          {
            FilterKey: "CandidateIDId",
            Operator: "eq",
            FilterValue: data.ID,
          },
          {
            FilterKey: "InterviewPanelId",
            Operator: "eq",
            FilterValue: Number(getCurrentUserId.data?.key),
          },
          {
            FilterKey: "InterviewLevel",
            Operator: "eq",
            FilterValue: levelFilter,
          },
        ],
        Topcount: 1,
      })) as IInterviewPanel[];

      //  const [firstItem] = resdata;
      // const IsSubmitted = firstItem?.IsScoreSheetUploaded === "Yes";
      const IsSubmitted = true;
      return {
        data: IsSubmitted,
        status: 200,
        message: "Validation success",
      };
    } catch (error) {
      console.error("EvalutionValidation error:", error);

      return {
        data: false,
        status: 500,
        message: "Error fetching validation",
      };
    }
  }
}