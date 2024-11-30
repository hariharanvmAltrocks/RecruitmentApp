import { ListNames, WorkflowAction, count } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";
import { IRecruitmentService } from "./IRecruitmentProcessService";
export default class RecruitmentService implements IRecruitmentService {

    async GetVacancyDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>> {
        try {
            let positionrequestresult: any = [];
            const listItems: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSVacancyReplacementRequest,
                Select: "*, Department/DepartmentName, SubDepartment/SubDepTitle, Section/SectionName, DepartmentCode/DptCode, Status/StatusDescription, Action/Action, BusinessUnitCode/BusineesUnitCode, JobCode/JobCode",
                Filter: filterParam,
                FilterCondition: filterConditions,
                Expand: "Department, SubDepartment, Section, DepartmentCode, Status, Action, BusinessUnitCode, JobCode",
            });

            console.log("GetVacancyDetails", listItems);

            const formattedItems: any[] = [];

            for (const item of listItems) {
                let VRR: any = {
                    VRRID: item.Id,
                    Nationality: item.Nationality || "",
                    EmploymentCategory: item.EmploymentCategory || "",
                    DepartmentId: item.DepartmentId || 0,
                    Department: item.Department?.DepartmentName || "",
                    SubDepartmentId: item.SubDepartmentId || 0,
                    SubDepartment: item.SubDepartment?.SubDepTitle || "",
                    SectionId: item.SectionId || 0,
                    Section: item.Section?.SectionName || "",
                    DepartmentCodeId: item.DepartmentCodeId || 0,
                    DepartmentCode: item.DepartmentCode?.DptCode || "",
                    StatusId: item.StatusId || 0,
                    Status: item.Status?.StatusDescription || "",
                    ActionId: item.ActionId || 0,
                    Action: item.Action?.Action || "",
                    NumberOfPersonNeeded: item.NumberOfPersonNeeded || 0,
                    EnterNumberOfMonths: item.EnterNumberOfMonths || "",
                    TypeOfContract: item.TypeOfContract || "",
                    BusinessUnitCodeId: item.BusinessUnitCodeId || 0,
                    BusinessUnitCode: item.BusinessUnitCode?.BusineesUnitCode || "",
                    DateRequired: item.DateRequired || null,
                    IsRevert: item.IsRevert || "",
                    ReasonForVacancy: item.ReasonForVacancy || "",
                    AreaofWork: item.AreaofWork || "",
                    JobCodeId: item.JobCodeId || 0,
                    JobCode: item.JobCode?.JobCode || "",
                    VacancyConfirmed: item.VacancyConfirmed || "",
                    RecruitmentAuthorised: item.RecruitmentAuthorised || "",
                    IsPayrollEmailed: item.IsPayrollEmailed || "",
                };

                const filter = [{ FilterKey: "VRRIDId", Operator: "eq", FilterValue: item.Id }];
                let positionresult: any = await this.GetVacancyPositionDetails(filter, "");
                let positionId: any = await this.GetPositionDetails(filter, "");
                console.log("formattedItems positionresult", positionresult);
                console.log("formattedItems positionId", positionId);
                if (positionresult?.data?.length > 0) {
                    positionrequestresult.push(positionresult.data[0]);
                }

                formattedItems.push({ ...VRR, ...(positionresult?.data[0] || {}) });
            }

            console.log("Formatted Items", formattedItems);

            console.log("formattedItems formattedItems GetVacancyDetails", await Promise.all(formattedItems));
            return {
                data: formattedItems,
                status: 200,
                message: "GetVacancyDetails fetched successfully",
            };
        } catch (error) {
            console.error("Error fetching data GetVacancyDetails:", error);
            return {
                data: [],
                status: 500,
                message: "Error fetching data from GetVacancyDetails",
            };
        }
    }


    async GetVacancyPositionDetails(filterParam: any, filterConditions: any) {
        try {
            const listItems: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSVRRPositionDetails,
                Select: "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade",
                Filter: filterParam,
                Expand: "JobTitleEnglish,DRCGrade,PatersonGrade",
                Topcount: count.Topcount
            });

            console.log("GetVacancyPositionDetails ", listItems);

            const formattedItems = listItems.map(async (item) => {

                return {
                    LookupId: item.ID,
                    JobTitleInEnglishId: item.JobTitleEnglishId || 0,
                    JobTitleInEnglish: item.JobTitleEnglish?.JobTitleInEnglish || "",
                    JobTitleInFrenchId: item.JobTitleEnglishId || 0,
                    DRCGradeId: item.DRCGradeId,
                    DRCGrade: item.DRCGrade?.DRCGrade || "",
                    PayrollGradeId: item.PatersonGradeId,
                    PayrollGrade: item.PatersonGrade?.PatersonGrade || "",
                    //   PositionList :(await this.GetPositionID(item.JobTitleEnglishId, item.DepartmentId)).data

                };
            });
            console.log("formattedItems GetVacancyPositionDetails", await Promise.all(formattedItems));
            return {
                data: await Promise.all(formattedItems),
                status: 200,
                message: "GetVacancyDetails fetched successfully",
            };
        } catch (error) {
            console.error("Error fetching data GetVacancyDetails:", error);
            return {
                data: [],
                status: 500,
                message: "Error fetching data from GetVacancyDetails",
            };
        }
    }

    async InsertRecruitmentDpt(Table1: any, Table2: any): Promise<ApiResponse<any | null>> {
        try {
            let Table1Insert = {
                VRRIDId: Table1.VRRID,
                ActionId: WorkflowAction.Submitted
            }
            await SPServices.SPAddItem({
                Listname: ListNames.HRMSRecruitmentDptDetails,
                RequestJSON: Table1Insert,
            }).then(async (data: any) => {

            });
            return {
                data: [],
                status: 200,
                message: "GetVacancyDetails fetched successfully",
            };

        } catch (error) {
            console.error("Error fetching data GetVacancyDetails:", error);
            return {
                data: [],
                status: 500,
                message: "Error fetching data from GetVacancyDetails",
            };
        }
    }

    async GetPositionDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>> {
        try {
            const listItems: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSVRRToPositionIDMapping,
                Select: "*,PositionID/PositionID",
                Filter: filterParam,
                FilterCondition: filterConditions,
                Expand: "PositionID",
                Topcount: count.Topcount
            });

            console.log("GetPositionDetails", listItems);

            const formattedItems = listItems.map(async (item) => {
                return {
                    VRRID: item.VRRIDId ? item.VRRIDId : 0,
                    PositionName: item.PositionID?.PositionID ? item.PositionID?.PositionID : "",
                    PositionID: item.PositionIDId ? item.PositionIDId : 0

                };
            });

            return {
                data: await Promise.all(formattedItems),
                status: 200,
                message: "GetPositionDetails fetched successfully",
            };
        } catch (error) {
            console.error("Error fetching data GetPositionDetails:", error);
            return {
                data: [],
                status: 500,
                message: "Error fetching data from GetPositionDetails",
            };
        }
    }

    // async InsertRecruitmentDpt(Table1: any, Table2: any): Promise<ApiResponse<any | null>> {
    //     try {
    //         let Table1Insert = {
    //             VRRIDId: Table1.VRRID,
    //             ActionId: WorkflowAction.Submitted
    //         }
    //         await SPServices.SPAddItem({
    //             Listname: ListNames.HRMSRecruitmentDptDetails,
    //             RequestJSON: Table1Insert,
    //         }).then(async (data: any) => {

    //         });
    //         return {
    //             data: [],
    //             status: 200,
    //             message: "GetVacancyDetails fetched successfully",
    //         };

    //     } catch (error) {
    //         console.error("Error fetching data GetVacancyDetails:", error);
    //         return {
    //             data: [],
    //             status: 500,
    //             message: "Error fetching data from GetVacancyDetails",
    //         };
    //     }
    // }
}