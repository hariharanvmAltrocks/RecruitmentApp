import { sp } from "@pnp/sp";
import { ListNames, WorkflowAction, count } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";
import { IRecruitmentService } from "./IRecruitmentProcessService";

interface IAttachmentExampleState {
    file: File | any,
    fileName: string;
    fileContent: string | ArrayBuffer | null;
    serverRelativeUrl: string;
    ID: string;
 }
 
export default class RecruitmentService implements IRecruitmentService {

    async GetVacancyDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<any | null>> {
        try {
            let positionrequestresult: any = [];
            let positionIDResult:any[]=[];
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
                        positionIDResult =positionIDResult.concat(returnitem.data);
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
                data: [formattedItems,positionIDResult],
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
                Select: `
                    *, 
                    VRRID/ID, 
                    Department/DepartmentName, 
                    SubDepartment/SubDepTitle, 
                    Section/SectionName, 
                    DepartmentCode/DptCode, 
                    Status/StatusDescription, 
                    Action/Action, 
                    JobCode/JobCode, 
                    BusinessUnitCode/BusineesUnitCode
                `,
                Filter: filterParam,
                FilterCondition: filterConditions,
                Expand: `
                    VRRID, 
                    Department, 
                    SubDepartment, 
                    Section, 
                    DepartmentCode, 
                    Status, 
                    Action, 
                    JobCode, 
                    BusinessUnitCode
                `,
                Topcount: count.Topcount,
            });
    
            console.log("GetRecruitmentDetails:", listItems);
    
            const formattedItems = listItems.map((item) => ({
                VRRID: item?.VRRIDId || 0,
                Nationality: item?.Nationality || "",
                EmploymentCategory: item?.EmploymentCategory || "",
                
                // Department Details
                Department: item?.Department?.DepartmentName || "",
                DepartmentId: item?.DepartmentId || 0,
            
                // Sub-Department Details
                SubDepartment: item?.SubDepartment?.SubDepTitle || "",
                SubDepartmentId: item?.SubDepartmentId || 0,
            
                // Section Details
                Section: item?.Section?.SectionName || "",
                SectionId: item?.SectionId || 0,
            
                // Department Code
                DepartmentCode: item?.DepartmentCode?.DptCode || "",
                DepartmentCodeId: item?.DepartmentCodeId || 0,
            
                // Status Details
                Status: item?.Status?.StatusDescription || "",
                StatusId: item?.StatusId || 0,
            
                // Action Details
                Action: item?.Action?.Action || "",
                ActionId: item?.ActionId || 0,
            
                // Recruitment Details
                NumberOfPersonNeeded: item?.NumberOfPersonNeeded || 0,
                EnterNumberOfMonths: item?.EnterNumberOfMonths || "",
                TypeOfContract: item?.TypeOfContract || "",
                DateRequried: item?.DateRequried || "",
                IsRevert: item?.IsRevert || "",
                ReasonForVacancy: item?.ReasonForVacancy || "",
                AreaofWork: item?.AreaofWork || "",
                JobCode: item?.JobCode?.JobCode || "",
                JobCodeId: item?.JobCodeId || 0,
            
                // Confirmation & Authorisation
                VacancyConfirmed: item?.VacancyConfirmed || "",
                RecruitmentAuthorised: item?.RecruitmentAuthorised || "",
                IsPayrollEmailed: item?.IsPayrollEmailed || "",
            
                // Assigned Personnel
                AssignedHR: item?.AssignedHR?.Title || "",
                AssignedHRId: item?.AssignedHRId || 0,
                AssignLineManager: item?.AssignLineManager?.Title || "",
                AssignLineManagerId: item?.AssignLineManagerId || 0,
            
                // Business Unit Details
                BusinessUnitCode: item?.BusinessUnitCode?.BusineesUnitCode || "",
                BusinessUnitCodeId: item?.BusinessUnitCodeId || 0,
            }));
            
    
            return {
                data: formattedItems,
                status: 200,
                message: "GetRecruitmentDetails fetched successfully",
            };
        } catch (error) {
            console.error("Error fetching data in GetRecruitmentDetails:", error);
            return {
                data: [],
                status: 500,
                message: "Error fetching data from GetRecruitmentDetails",
            };
        }
    }
    

    // async InsertRecruitmentDpt(Table1: any, Table2: any): Promise<ApiResponse<any | null>> {
    //     try {
    //         let response:any[]=[];
    //         let Table1Insert = {
    //             VRRIDId: Table1.VRRID,
    //             ActionId: WorkflowAction.Submitted,
    //             Nationality: Table1.Nationality,
    //             EmploymentCategory: Table1.EmploymentCategory,
    //             DepartmentId: Table1.Department,
    //             SubDepartmentId: Table1.SubDepartment,
    //             SectionId: Table1.Section,
    //             DepartmentCodeId: Table1.DepartmentCode,
    //             StatusId: WorkflowAction.Submitted,
    //             NumberOfPersonNeeded: Table1.NumberOfPersonNeeded,
    //             EnterNumberOfMonths: Table1.EnterNumberOfMonths,
    //             TypeOfContract: Table1.TypeOfContract,
    //            // DateRequried: Table1.DateRequried,
    //             ReasonForVacancy: Table1.ReasonForVacancy,
    //             AreaofWork: Table1.AreaofWork,
    //             JobCodeId: Table1.JobCode,
    //             VacancyConfirmed: Table1.VacancyConfirmed,                
    //             BusinessUnitCodeId: Table1.BusinessUnitCode,
    //         };
    // console.log("Table1Insert",Table1Insert);
    //         await SPServices.SPAddItem({
    //             Listname: ListNames.HRMSRecruitmentDptDetails,
    //             RequestJSON: Table1Insert,
    //         }).then(async (data: any) => {
    //             console.log("Insert successful:", data);
    //             response=data;
    //         });
    
    //         return {
    //             data: response,
    //             status: 200,
    //             message: "GetVacancyDetails fetched successfully",
    //         };
    //     } catch (error) {
    //         console.error("Error inserting data into HRMSRecruitmentDptDetails:", error);
    //         return {
    //             data: [],
    //             status: 500,
    //             message: "Error inserting data into HRMSRecruitmentDptDetails",
    //         };
    //     }
    // }

    async InsertRecruitmentDpt(Table1: any, Table2: any): Promise<ApiResponse<any | null>> {
        try {
            let response: any = await SPServices.SPAddItem({
                Listname: ListNames.HRMSRecruitmentDptDetails,
                RequestJSON: {
                    VRRIDId: Table1.VRRID,
                    ActionId: WorkflowAction.Submitted,
                    Nationality: Table1.Nationality,
                    EmploymentCategory: Table1.EmploymentCategory,
                    DepartmentId: Table1.Department,
                    SubDepartmentId: Table1.SubDepartment,
                    SectionId: Table1.Section,
                    DepartmentCodeId: Table1.DepartmentCode,
                    StatusId: WorkflowAction.Submitted,
                    NumberOfPersonNeeded: Table1.NumberOfPersonNeeded,
                    EnterNumberOfMonths: Table1.EnterNumberOfMonths,
                    TypeOfContract: Table1.TypeOfContract,
                    ReasonForVacancy: Table1.ReasonForVacancy,
                    AreaofWork: Table1.AreaofWork,
                    JobCodeId: Table1.JobCode,
                    VacancyConfirmed: Table1.VacancyConfirmed,
                    BusinessUnitCodeId: Table1.BusinessUnitCode,
                },
            });
    
            console.log("RecruitmentDptDetails Inserted:", response);
            console.log("RecruitmentDptDetails InsertedID:", response?.data?.ID);
            if (response?.data?.ID) {
                const jobDetailsResponse = await this.InsertJobDetails(Table2, parseInt(response?.data?.ID));
                return {
                    data: jobDetailsResponse.data,
                    status: jobDetailsResponse.status,
                    message: jobDetailsResponse.message,
                };
            }
    
            return {
                data: [],
                status: 400,
                message: "Failed to insert RecruitmentDptDetails",
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
    


    async InsertJobDetails(Table2: any[], RecruitmentId: number): Promise<ApiResponse<any | null>> {
        try {
            let insertedRecords: any[] = [];
    
            // Insert each row from Table2
            for (const row of Table2) {
                const JobDetailsInsert = {
                    JobTitleEnglishId: row.JobTitleEnglish,
                    PatersonGradeId: row.PatersonGradeID,
                    DRCGradeId: row.DRCGradeID,
                    RecruitmentIDId: RecruitmentId,
                    PositionIDId: row.PositionID,
                    //AssignLineManagerId: row.AssignLineManager,
                };
    
                console.log("JobDetailsInsert", JobDetailsInsert);
    
                const response = await SPServices.SPAddItem({
                    Listname: ListNames.HRMSRecruitmentPositionDetails,
                    RequestJSON: JobDetailsInsert,
                });
    
                console.log("Insert successful:", response);
                insertedRecords.push(response);
            }
    
            return {
                data: insertedRecords,
                status: 200,
                message: "Job details inserted successfully",
            };
        } catch (error) {
            console.error("Error inserting job details:", error);
            return {
                data: [],
                status: 500,
                message: "Error inserting job details",
            };
        }
    }
    

    GetAttachedRoleProfile = async (indexID: any, DocLibrarayName: string): Promise<IAttachmentExampleState[]> => {
        try {
            const DocItems = sp.web.lists.getByTitle(DocLibrarayName);
            const folder = DocItems.rootFolder.folders.getByName(indexID.toString());
            const folderExists = await folder.select("Exists").get();
            if (!folderExists.Exists) {
                console.warn(`Folder with ID ${indexID} does not exist.`);
                return []; // Return an empty array if folder doesn't exist
            }
            const files = await folder.files.get().then(async (files: any) => {
                const Documents: IAttachmentExampleState[] = await files.map(
                    (file: any) => ({
                        ServerRelativeUrl: file.ServerRelativeUrl,
                        fileName: file.Name,
                    })
                );

                return Documents;
            });

            return files;
        }
        catch (error) {
            console.error("Error fetching attachments:", error);
            return []; // Return an empty array on error
        }
    };
    
    
}