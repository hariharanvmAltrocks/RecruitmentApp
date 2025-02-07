import { DocumentLibraray, ListNames, count } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";
import {
  CommentsData,
  InsertComments,
  IRecruitmentService,
} from "./IRecruitmentProcessService";
import { CandidateData } from "../../Models/RecuritmentVRR";
import { sp } from "@pnp/sp/presets/all";
import { CommonServices } from "../ServiceExport";
import { IDocFiles } from "../SPService/ISPServicesProps";

interface IAttachmentExampleState {
  file: File | any;
  fileName: string;
  fileContent: string | ArrayBuffer | null;
  serverRelativeUrl: string;
  ID: string;
}

export default class RecruitmentService implements IRecruitmentService {
  //APIExternalAgents

  async GetVacancyDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>> {
    try {
      let positionrequestresult: any = [];
      let positionIDResult: any[] = [];
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSVacancyReplacementRequest,
        Select:
          "*, Department/DepartmentName, SubDepartment/SubDepTitle, Section/SectionName, DepartmentCode/DptCode, Status/StatusDescription, Action/Action, BusinessUnitCode/BusineesUnitCode, JobCode/JobCode",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand:
          "Department, SubDepartment, Section, DepartmentCode, Status, Action, BusinessUnitCode, JobCode",
        Orderby: "ID",
        Orderbydecorasc: false,
      });

      const formattedItems: any[] = [];

      for (const item of listItems) {
        console.log(item, "GetVacancyDetails Item");

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

        const filter = [
          { FilterKey: "VRRID", Operator: "eq", FilterValue: item.Id },
        ];
        let positionresult: any = await this.GetVacancyPositionDetails(
          filter,
          ""
        );
        let positionId: any = await this.GetPositionDetails(filter, "").then(
          (returnitem: any) => {
            console.log("formattedItems returnitem positionresult", returnitem);
            if (returnitem?.data && returnitem?.data?.length > 0) {
              positionIDResult = positionIDResult.concat(returnitem.data);
            }
            return positionIDResult;
          }
        );

        console.log("formattedItems positionresult", positionresult);
        console.log("formattedItems positionId", positionId);
        if (positionresult?.data?.length > 0) {
          positionrequestresult.push(positionresult.data[0]);
        }

        formattedItems.push({ ...VRR, ...(positionresult?.data[0] || {}) });
      }

      console.log("Formatted Items", formattedItems);

      console.log(
        "formattedItems formattedItems GetVacancyDetails",
        await Promise.all(formattedItems)
      );
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
        Select:
          "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
        Filter: filterParam,
        Expand: "JobTitleEnglish,DRCGrade,JobTitleFrench,PatersonGrade",
        Topcount: count.Topcount,
      });

      console.log("GetVacancyPositionDetails ", listItems);

      const formattedItems = listItems.map(async (item) => {
        return {
          LookupId: item.ID,
          JobTitleInEnglishId: item.JobTitleEnglishId || 0,
          JobTitleInEnglish: item.JobTitleEnglish?.JobTitleInEnglish || "",
          JobTitleInFrenchId: item.JobTitleFrenchId || 0,
          JobTitleInFrench: item.JobTitleFrench?.JobTitleInFrench || "",
          DRCGradeId: item.DRCGradeId,
          DRCGrade: item.DRCGrade?.DRCGrade || "",
          PayrollGradeId: item.PatersonGradeId,
          PayrollGrade: item.PatersonGrade?.PatersonGrade || "",
          //   PositionList :(await this.GetPositionID(item.JobTitleEnglishId, item.DepartmentId)).data
        };
      });
      console.log(
        "formattedItems GetVacancyPositionDetails",
        await Promise.all(formattedItems)
      );
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

  async GetPositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>> {
    try {
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSVRRToPositionIDMapping,
        Select: "*,PositionID/PositionID",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: "PositionID",
        Topcount: count.Topcount,
      });

      console.log("GetPositionDetails HRMSVRRToPositionIDMapping", listItems);

      const formattedItems = listItems.map(async (item) => {
        return {
          // VRRID: item?.VRRIDId ? item?.VRRIDId : 0,
          PositionName: item.PositionID?.PositionID
            ? item.PositionID?.PositionID
            : "",
          PositionID: item.PositionIDId ? item.PositionIDId : 0,
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

  async GetRecruitmentDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any | null>> {
    try {
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        Select: `
                    *, 
                    Department/DepartmentName, 
                    SubDepartment/SubDepTitle, 
                    Section/SectionName, 
                    DepartmentCode/DptCode, 
                    Status/StatusDescription, 
                    Action/Action, 
                    JobCode/JobCode, 
                    BusinessUnitCode/BusineesUnitCode,
                    AssignedHR/Title
                `,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: `
                    Department, 
                    SubDepartment, 
                    Section, 
                    DepartmentCode, 
                    Status, 
                    Action, 
                    JobCode, 
                    BusinessUnitCode,
                    AssignedHR
                `,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: false,
      });

      console.log("GetRecruitmentDetails:", listItems);
      const formattedItems: any[] = [];
      let positionrequestresult: any = [];
      for (const item of listItems) {
        console.log(item, "GetVacancyDetails Item");

        let Recruitment: any = {
          ID: item?.ID,
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
        };

        const filter = [
          { FilterKey: "RecruitmentID", Operator: "eq", FilterValue: item.ID },
        ];
        let positionresult: any = await this.GetRecrutimentPositionDetails(
          filter,
          ""
        );

        console.log("formattedItems positionresult", positionresult);
        if (positionresult?.data?.length > 0) {
          positionrequestresult.push(positionresult.data);
        }

        formattedItems.push({
          ...Recruitment,
          ...(positionresult?.data || {}),
        });
      }
      console.log(formattedItems, "formattedItems");

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

  async GetRecrutimentPositionDetails(filterParam: any, filterConditions: any) {
    try {
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails,
        Select:
          "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
        Filter: filterParam,
        Expand: "JobTitleEnglish,DRCGrade,PatersonGrade,JobTitleFrench",
        Topcount: count.Topcount,
      });

      console.log("GetRecrutimentPositionDetails ", listItems);

      const formattedItems = {
        LookupId: listItems[0].ID,
        JobTitleInEnglishId: listItems[0].JobTitleEnglishId || 0,
        JobTitleInEnglish:
          listItems[0].JobTitleEnglish?.JobTitleInEnglish || "",
        JobTitleInFrench: listItems[0].JobTitleFrench?.JobTitleInFrench || 0,
        DRCGradeId: listItems[0].DRCGradeId,
        DRCGrade: listItems[0].DRCGrade?.DRCGrade || "",
        PayrollGradeId: listItems[0].PatersonGradeId,
        PayrollGrade: listItems[0].PatersonGrade?.PatersonGrade || "",
        //   PositionList :(await this.GetPositionID(item.JobTitleEnglishId, item.DepartmentId)).data
      };

      console.log(
        "formattedItems GetRecrutimentPositionDetails",
        formattedItems
      );
      return {
        data: formattedItems,
        status: 200,
        message: "GetRecrutimentPositionDetails fetched successfully",
      };
    } catch (error) {
      console.error(
        "Error fetching data GetRecrutimentPositionDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error fetching data from GetRecrutimentPositionDetails",
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

  async InsertRecruitmentDpt(
    Table1: any,
    Table2: any
  ): Promise<ApiResponse<any | null>> {
    try {
      let response: any = await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        RequestJSON: Table1,
      });

      console.log("RecruitmentDptDetails Inserted:", response);
      console.log("RecruitmentDptDetails InsertedID:", response?.data?.ID);
      if (response?.data?.ID) {
        const jobDetailsResponse = await this.InsertJobDetails(
          Table2,
          parseInt(response?.data?.ID)
        );
        return {
          data: jobDetailsResponse.data,
          status: jobDetailsResponse.status,
          message: jobDetailsResponse.message,
        };
      }

      return {
        data: [],
        status: 200,
        message: "Failed to insert RecruitmentDptDetails",
      };
    } catch (error) {
      console.error(
        "Error inserting data into HRMSRecruitmentDptDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into HRMSRecruitmentDptDetails",
      };
    }
  }

  async InsertJobDetails(
    Table2: any[],
    RecruitmentId: number
  ): Promise<ApiResponse<any | null>> {
    try {
      let insertedRecords: any[] = [];

      // Insert each row from Table2
      for (const row of Table2) {
        const JobDetailsInsert = {
          //JobTitleEnglishId: row.JobTitleEnglish,
          JobTitleEnglishId: row.JobNameInEnglishID,
          JobTitleFrenchId: row.JobNameInFrenchID,
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

  GetAttachedRoleProfile = async (
    indexID: any,
    DocLibrarayName: string
  ): Promise<IAttachmentExampleState[]> => {
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
    } catch (error) {
      console.error("Error fetching attachments:", error);
      return []; // Return an empty array on error
    }
  };

  async InsertRecruitmentCandidateDetails(
    param: any
  ): Promise<ApiResponse<any | null>> {
    try {
      let response: any = await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: param,
      });
      console.log(response);
      return {
        data: [],
        status: 200,
        message: "insert RecruitmentCandidateDetails",
      };
    } catch (error) {
      console.error(
        "Error inserting data into RecruitmentCandidateDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into RecruitmentCandidateDetails",
      };
    }
  }

  async GetCandidateDetails(filterParam: any, filterConditions: any) {
    try {
      const CandidateDetails: CandidateData[] = [];

      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.InterviewPanelCandidateDetails,
        Select: "*,JobCode/JobCode",
        Expand: "JobCode",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      const formattedItems = listItems.map(async (item) => {
        console.log("InterviewPanelCandidateDetails ", item);

        const response = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.InterviewPanelCandidateCV,
          item.JobCode?.JobCode,
          item?.PassportID
        );
        let candidateCV: IDocFiles[] = [];
        if (response.status === 200 && response.data) {
          candidateCV = response.data;
          console.log(candidateCV, "candidateCV");
        } else {
          console.error("Error retrieving attachments:", response.message);
        }
        let roleprofileDoc: IDocFiles[] = [];
        if (response.status === 200 && response.data) {
          roleprofileDoc = response.data;
          console.log(roleprofileDoc, "roleprofileDoc");
        } else {
          console.error(
            "Error retrieving  roleprofileDoc attachments:",
            response.message
          );
        }

        return {
          ID: item.ID,
          JobCode: item?.JobCode?.JobCode,
          JobCodeId: item?.JobCodeId,
          PassportID: item?.PassportID,
          FristName: item.FristName,
          MiddleName: item.MiddleName,
          LastName: item.LastName,
          FullName: `${item.FristName || ""} ${item.MiddleName || ""} ${
            item.LastName || ""
          }`,
          ResidentialAddress: item?.ResidentialAddress,
          DOB: item?.DOB,
          ContactNumber: item?.ContactNumber,
          Email: item?.Email,
          Nationality: item?.Nationality,
          Gender: item?.Gender,
          TotalYearOfExperiance: item?.TotalYearOfExperiance,
          Skills: item?.Skills,
          LanguageKnown: item?.LanguageKnown,
          ReleventExperience: item?.ReleventExperience,
          Qualification: item?.Qualification,
          CandidateCVDoc: candidateCV,
          RoleProfileDocument: roleprofileDoc,
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
      console.error(
        "Error fetching data InterviewPanelCandidateDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error fetching data from InterviewPanelCandidateDetails",
      };
    }
  }

  async GetInterviewPanelCandidateDetails(
    filterParam: any,
    filterConditions: any
  ) {
    try {
      const CandidateDetails: CandidateData[] = [];
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:
          "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID",
        Expand: "JobCode,AssignByInterviewPanel,RecruitmentID",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      const formattedItems = listItems.map(async (item) => {
        console.log("HRMSRecruitmentCandidateDetails ", item);
        const response = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.InterviewPanelCandidateCV,
          item.JobCode?.JobCode,
          item?.PassportID
        );
        let candidateCV: IDocFiles[] = [];
        if (response.status === 200 && response.data) {
          candidateCV = response.data;
          console.log(candidateCV, "candidateCV");
        } else {
          console.error("Error retrieving attachments:", response.message);
        }

        return {
          ID: item.ID,
          RecruitmentID: item?.RecruitmentID?.ID,
          JobCode: item?.JobCode?.JobCode,
          JobCodeId: item?.JobCodeId,
          PassportID: item?.PassportID,
          FristName: item?.FristName,
          MiddleName: item?.MiddleName,
          LastName: item?.LastName,
          FullName:
            (item?.FristName ?? "") +
            " " +
            (item?.MiddleName ?? "") +
            " " +
            (item?.LastName ?? ""),
          ResidentialAddress: item?.ResidentialAddress,
          DOB: item?.DOB,
          ContactNumber: item?.ContactNumber,
          Email: item?.Email,
          Nationality: item?.Nationality,
          Gender: item?.Gender,
          TotalYearOfExperiance: item?.TotalYearOfExperiance,
          Skills: item?.Skills,
          LanguageKnown: item?.LanguageKnown,
          ReleventExperience: item?.ReleventExperience,
          Qualification: item?.Qualification,
          RecuritmentHR: item?.RecuritmentHR,
          AssignByInterviewPanel: item?.AssignByInterviewPanel?.EMail,
          CandidateCVDoc: candidateCV,
          PositionTitle: item.PositionTitle,
          JobGrade: item.JobGrade,
        };
      });

      const resolvedItems = await Promise.all(formattedItems);

      CandidateDetails.push(...resolvedItems);
      console.log(CandidateDetails, "CandidateDetails");

      return {
        data: CandidateDetails,
        status: 200,
        message: "HRMSRecruitmentCandidateDetails fetched successfully",
      };
    } catch (error) {
      console.error(
        "Error fetching data HRMSRecruitmentCandidateDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error fetching data from HRMSRecruitmentCandidateDetails",
      };
    }
  }

  async AssignCandidateRecuritmentHR(ID: number, param: any, listName: string) {
    try {
      let message = "InterviewPanelCandidateDetails Not Updated";
      let StatusCode = 400;

      await SPServices.SPUpdateItem({
        Listname: listName,
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
    } catch (error) {
      console.error("Error UpdateHeadCount_WL:", error);
      throw error;
    }
  }

  async GetCommentsData(
    EmployeeList: any[],
    Conditions: string,
    filterConditions: any
  ): Promise<ApiResponse<CommentsData[]>> {
    let CommentsData: CommentsData[] = [];
    try {
      let listItems: any;
      listItems = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentComments,
        Select: "*, Author/EMail,Author/Title,Role/RoleTitle,RecruitmentID/ID",
        Expand: "Author,Role,RecruitmentID",
        Filter: filterConditions,
      });
      listItems.forEach((objresult: any) => {
        const Email = objresult.Author?.EMail.toLowerCase();
        const Employee = EmployeeList.find((options: any) => {
          return options.Email?.toLowerCase() === Email;
        });
        let d: CommentsData = {
          Id: objresult.ApprovedID ? objresult.ApprovedID.ID : "",
          JobTitleInEnglish: Employee ? Employee.JobTitle : "",
          JobTitleInFrench: Employee ? Employee.JobTitleInFrench : "",
          comments: objresult.Comments || "",
          Department: objresult.Department
            ? objresult.Department.DepartmentName
            : "",
          Date: objresult.Created ? new Date(objresult.Created) : null,
          JobTitle: objresult.JobTitle || "",
          RoleName: objresult.Role ? objresult.Role.RoleTitle : "",
          Name: Employee
            ? (Employee.FirstName ?? "") +
              " " +
              (Employee.MiddleName ?? "") +
              " " +
              (Employee.LastName ?? "")
            : "",
          // Name: Employee ? Employee.FirstName + " " + Employee.MiddleName + " " + Employee.LastName : "",
        };
        CommentsData.push(d);
      });

      return {
        data: CommentsData,
        status: 200,
        message: "Data fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {
        data: [],
        status: 400,
        message: "Error fetching data",
      };
    }
  }

  async InsertCommentsList(
    obj: InsertComments
  ): Promise<ApiResponse<InsertComments | null>> {
    try {
      let response: any = await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentComments,
        RequestJSON: obj,
      });
      console.log("CommentsResponse", response);

      return {
        data: null,
        status: 200,
        message: "Data Submitted successfully",
      };
    } catch (error) {
      console.error("Error posting user data:", error);
      return {
        data: null,
        status: 400,
        message: "Error On Posting Data",
      };
    }
  }

  async InsertList(
    obj: InsertComments,
    ListName: string
  ): Promise<ApiResponse<null>> {
    try {
      let response: any = await SPServices.SPAddItem({
        Listname: ListName,
        RequestJSON: obj,
      });
      console.log("CommentsResponse", response);

      return {
        data: null,
        status: 200,
        message: "Data Submitted successfully",
      };
    } catch (error) {
      console.error("Error posting user data:", error);
      return {
        data: null,
        status: 400,
        message: "Error On Posting Data",
      };
    }
  }
  async GetHRMSRecruitmentRoleProfileDetails(
    filterParam: any[],
    filterConditions: any
  ): Promise<ApiResponse<any | null>> {
    try {
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentRoleProfileDetails,
        Select:
          "RecruitmentID/ID,JobDescription,RoleProfile,RoleSpecificKnowledgeJson,TechnicalSkillsKnowledgeJson,YearofExperience,Qualification,PreferredQualification,PreferredExperience",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: "RecruitmentID",
        Orderby: "ID",
        Orderbydecorasc: false,
      });
      const formattedItems = listItems.map((item) => ({
        RecruitmentID: item?.RecruitmentID?.ID || "",
        JobDescription: item.JobDescription || "",
        RoleProfile: item.RoleProfile || "",
        RoleSpecificKnowledgeJson: item.RoleSpecificKnowledgeJson || "",
        TechnicalSkillsKnowledgeJson: item.TechnicalSkillsKnowledgeJson || "",
        YearofExperience: item.YearofExperience || 0,
        Qualification: item.Qualification || "",
        PreferredQualification: item.PreferredQualification || "",
        PreferredExperience: item.PreferredExperience || 0,
      }));
      return {
        data: formattedItems,
        status: 200,
        message: "GetHRMSRecruitmentRoleProfileDetails fetched successfully",
      };
    } catch (error) {
      console.error(
        "Error fetching data GetHRMSRecruitmentRoleProfileDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message:
          "Error fetching data from GetHRMSRecruitmentRoleProfileDetails",
      };
    }
  }

  async InsertExternalAgencyDetails(
    selectedAgencies: { key: number; text: string }[],
    RecruitmentId: number
  ): Promise<ApiResponse<any | null>> {
    try {
      let insertedRecords: any[] = [];

      for (const agency of selectedAgencies) {
        const AgencyInsert = {
          RecruitmentIDId: RecruitmentId,
          ExternalAgentDetailsId: agency.key,
        };

        console.log("AgencyInsert", AgencyInsert);

        const response = await SPServices.SPAddItem({
          Listname: ListNames.HRMSExternalAgentsDetailsForRecruitment,
          RequestJSON: AgencyInsert,
        });

        console.log("Insert successful:", response);
        insertedRecords.push(response);
      }

      return {
        data: insertedRecords,
        status: 200,
        message: "Agency details inserted successfully",
      };
    } catch (error) {
      console.error("Error inserting external agency details:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting external agency details",
      };
    }
  }
  // sneka
  async HRMSCandidateScoreCard(
    filterParam: any,
    filterConditions: any,
    candidateID: number
  ): Promise<ApiResponse<any | null>> {
    try {
      const interviewPanelItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Title,InterviewPanel/ID,CandidateID/ID",
        Expand: "RecruitmentID,InterviewPanel,CandidateID",
        Orderby: "ID",
        Orderbydecorasc: false,
        Filter: filterParam,
        FilterCondition: filterConditions,
      });
      const candidateScoreCardItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateScoreCard,
        Select:
          "InterviewPanelID/ID,RelevantQualification,ReleventExperience,Knowledge,EnergyLevel,MeetJobRequirement,ContributeTowardsCultureRequried,Experience,OtherCriteriaScore,ConsiderForEmployment,Feedback,RecruitmentID/ID,Role/Title,InterviewPersonName/Title,OverAllEvaluationFeedback",
        Expand: "InterviewPanelID,RecruitmentID,Role,InterviewPersonName",
        Orderby: "ID",
        Orderbydecorasc: false,
        FilterCondition: [
          {
            FilterKey: "InterviewPanelID/CandidateID/ID",
            Operator: "eq",
            FilterValue: candidateID,
          },
        ],
      });
      console.log("candidateScoreCardItems", candidateScoreCardItems);
      console.log("interviewPanelItems", interviewPanelItems);
      const formattedItems = interviewPanelItems.map((interview) => {
        const relatedScores = candidateScoreCardItems.filter(
          (score) => score?.InterviewPanelID?.ID === interview?.ID
        );

        return {
          ID: interview.ID,
          RecruitmentID: interview?.RecruitmentID?.ID || "",
          InterviewLevel: interview.InterviewLevel || "",
          // InterviewPanel: interview?.InterviewPanel?.Title || "",
          InterviewPanelTitle:
            interview.InterviewPanel && interview.InterviewPanel.length > 0
              ? interview.InterviewPanel.map((panel: any) => panel.Title)
              : "N/A",
          CandidateID: interview.CandidateID?.ID || "",
          CandidateScoreCard: relatedScores.map((score) => ({
            InterviewPanelID: score.InterviewPanelID?.ID || "",
            RelevantQualification: score.RelevantQualification || "",
            ReleventExperience: score.ReleventExperience || "",
            Knowledge: score.Knowledge || "",
            EnergyLevel: score.EnergyLevel || "",
            MeetJobRequirement: score.MeetJobRequirement || "",
            ContributeTowardsCultureRequried:
              score.ContributeTowardsCultureRequried || "",
            Experience: score.Experience || "",
            OtherCriteriaScore: score.OtherCriteriaScore || "",
            ConsiderForEmployment: score.ConsiderForEmployment || "",
            Feedback: score.Feedback || "",
            RecruitmentID: score.RecruitmentID?.ID || "",
            Role: score.Role?.Title || "",
            InterviewPersonName: score.InterviewPersonName?.Title || "",
            OverAllEvaluationFeedback: score.OverAllEvaluationFeedback || "",
          })),
        };
      });
      console.log("formattedItems", formattedItems);
      return {
        data: formattedItems,
        status: 200,
        message:
          "HRMSInterviewPanelDetails and HRMSCandidateScoreCard fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        data: [],
        status: 500,
        message:
          "Error fetching data from HRMSInterviewPanelDetails and HRMSCandidateScoreCard",
      };
    }
  }
}
