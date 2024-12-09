import { InterviewPanelCandidateDetails } from "../../Models/RecuritmentVRR";
import { DocumentLibraray, ListNames, WorkflowAction, count } from "../../utilities/Config";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import { IRecruitmentService } from "./IRecruitmentProcessService";
export default class RecruitmentService implements IRecruitmentService {

    async GetVacancyDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>> {
        try {
            let positionrequestresult: any = [];
            let positionIDResult: any[] = [];
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

                const filter = [{ FilterKey: "VRRID", Operator: "eq", FilterValue: item.Id }];
                let positionresult: any = await this.GetVacancyPositionDetails(filter, "");
                let positionId: any = await this.GetPositionDetails(filter, "").then((returnitem: any) => {
                    console.log("formattedItems returnitem positionresult", returnitem);
                    if (returnitem?.data && returnitem?.data?.length > 0) {
                        positionIDResult = positionIDResult.concat(returnitem.data);
                    }
                    return positionIDResult;
                });

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
                data: [formattedItems, positionIDResult],
                status: 200,
                message: "GetVacancyDetails fetched successfully",
            };
        } catch (error) {
            console.error("Error fetching data GetVacancyDetailsdd:", error);
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
            console.error("Error fetching data GetVacancyDetailsww:", error);
            return {
                data: [],
                status: 500,
                message: "Error fetching data from GetVacancyDetails",
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
    //         console.error("Error fetching data GetVacancyDetailddfs:", error);
    //         return {
    //             data: [],
    //             status: 500,
    //             message: "Error fetching data from GetVacancyDetails",
    //         };
    //     }
    // }

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

            console.log("GetPositionDetails HRMSVRRToPositionIDMapping", listItems);

            const formattedItems = listItems.map(async (item) => {
                return {
                    VRRID: item?.VRRIDId ? item?.VRRIDId : 0,
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


    async GetRecruitmentDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>> {
        try {
            const listItems: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSRecruitmentDptDetails,
                Select: "*,VRRID/ID",
                Filter: filterParam,
                FilterCondition: filterConditions,
                Expand: "VRRID",
                Topcount: count.Topcount
            });

            console.log("GetRecruitmentDetails", listItems);

            const formattedItems = listItems.map(async (item) => {
                return {
                    VRRID: item?.VRRIDId ? item?.VRRIDId : 0,
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

    async InsertRecruitmentDpt(Table1: any, Table2: any): Promise<ApiResponse<any | null>> {
        try {
            let Table1Insert = {
                VRRIDId: Table1.VRRID,
                ActionId: WorkflowAction.Submitted,
                Nationality: Table1.Nationality,
                EmploymentCategory: Table1.EmploymentCategory,
                DepartmentId: Table1.Department,
                SubDepartmentId: Table1.SubDepartment,
                SectionId: Table1.Section,
                DepartmentCodeId: Table1.DepartmentCode,
                StatusId: Table1.Status,
                NumberOfPersonNeeded: Table1.NumberOfPersonNeeded,
                EnterNumberOfMonths: Table1.EnterNumberOfMonths,
                TypeOfContract: Table1.TypeOfContract,
                DateRequried: Table1.DateRequried,
                IsRevert: Table1.IsRevert,
                ReasonForVacancy: Table1.ReasonForVacancy,
                AreaofWork: Table1.AreaofWork,
                JobCodeId: Table1.JobCode,
                VacancyConfirmed: Table1.VacancyConfirmed,
                RecruitmentAuthorised: Table1.RecruitmentAuthorised,
                IsPayrollEmailed: Table1.IsPayrollEmailed,
                AssignedHRId: Table1.AssignedHR, // Person or Group field requires an ID
                AssignLineManagerId: Table1.AssignLineManager, // Person or Group field requires an ID
                BusinessUnitCodeId: Table1.BusinessUnitCode,
            };

            await SPServices.SPAddItem({
                Listname: ListNames.HRMSRecruitmentDptDetails,
                RequestJSON: Table1Insert,
            }).then(async (data: any) => {
                console.log("Insert successful:", data);
            });

            return {
                data: [],
                status: 200,
                message: "GetVacancyDetails fetched successfully",
            };
        } catch (error) {
            console.error("Error inserting data into HRMSRecruitmentDptDetails:", error);
            return {
                data: [],
                status: 500,
                message: "Error inserting data into HRMSRecruitmentDptDetails",
            };
        }
    }

    async GetCandidateDetails(filterParam: any, filterConditions: any) {
        try {
            const CandidateDetails: InterviewPanelCandidateDetails[] = [];

            const listItems: any[] = await SPServices.SPReadItems({
                Listname: ListNames.InterviewPanelCandidateDetails,
                Select: "*,JobCode/JobCode",
                // Filter: filterParam,
                Expand: "JobCode",
                Topcount: count.Topcount,
            });

            const formattedItems = listItems.map(async (item) => {
                console.log("InterviewPanelCandidateDetails ", item);
                const candidateCV = (await SPServices.getDocLibFiles({
                    FilePath: `${DocumentLibraray.InterviewPanelCandidateCV}/${item.JobCode?.JobCode}/${item?.PassportID}`, //${"ASD9870J"}
                })) as IDocFiles[];
                console.log(candidateCV, "candidateCV");

                return {
                    ID: item.ID,
                    JobCode: item.JobCode?.JobCode,
                    PassportID: item?.PassportID,
                    FristName: item?.FristName,
                    MiddleName: item?.MiddleName,
                    LastName: item?.LastName,
                    CandidateCVDoc: candidateCV,
                };
            });

            const resolvedItems = await Promise.all(formattedItems);

            CandidateDetails.push(...resolvedItems);
            console.log(CandidateDetails, "CandidateDetails");


            return {
                data: CandidateDetails,
                status: 200,
                message: "InterviewPanelCandidateDetails fetched successfully",
            };
        } catch (error) {
            console.error("Error fetching data InterviewPanelCandidateDetails:", error);
            return {
                data: [],
                status: 500,
                message: "Error fetching data from InterviewPanelCandidateDetails",
            };
        }
    }

    async AssignCandidateRecuritmentHR(ID: number, param: any) {
        try {
            let message = "InterviewPanelCandidateDetails Not Updated";
            let StatusCode = 400;
            await SPServices.SPUpdateItem({
                Listname: ListNames.InterviewPanelCandidateDetails,
                RequestJSON: param,
                ID: ID,
            }).then(async (items) => {
                StatusCode = 200;
                message = "InterviewPanelCandidateDetails Updated";
            });

            return {
                data: ID,
                status: StatusCode,
                message: message,
            };
        }
        catch (error) {
            console.error("Error UpdateHeadCount_WL:", error);
            throw error;

        }
    }
}