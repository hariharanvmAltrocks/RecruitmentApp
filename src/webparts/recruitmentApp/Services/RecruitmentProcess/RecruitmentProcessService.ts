import { ADGroupID, DataFrom, DocumentLibraray, InOperator, InterviewLevels, ListNames, Nationality, ResponeStatus, RoleName, StatusId, count, workflowStatusApi } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";
import {
  CommentsData,
  DataSyncToRecruitmentResponse,
  InsertComments,
  IRecruitmentService,
  JobCodeData,
  PostRecuritmentData,
} from "./IRecruitmentProcessService";
import { CandidateData } from "../../Models/RecuritmentVRR";
import { sp } from "@pnp/sp/presets/all";
import { CommonServices, GetPortalJobsService } from "../ServiceExport";
import { IDocFiles } from "../SPService/ISPServicesProps";
import * as moment from "moment";
import { AdvertisementDetails, Descriptions, MinAndPreferedQualifications, RoleAndTechSkills } from "../../Models/ApIInterface";
import { AutoCompleteItem, InterviewPanelItem, InterviewPanelMember } from "../../Models/Screens";

interface IAttachmentExampleState {
  file: File | any;
  fileName: string;
  fileContent: string | ArrayBuffer | null;
  serverRelativeUrl: string;
  ID: string;
}

const GetUserName = async (
  email: string
): Promise<ApiResponse<any | null>> => {
  try {
    const listItems: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSSageList,
      Select: "*",
      Filter: [{
        FilterKey: "EmailId",
        FilterValue: "eq",
        Operator: email
      }]
    });
    let UserName = listItems.find((emp: any) => {
      return emp.EmailId?.toLowerCase() === email?.toLowerCase();
    });
    let UserRoleName = `${UserName?.FirstName || ""} ${UserName?.MiddleName || ""} ${UserName?.LastName || ""}`
    return {
      data: UserRoleName,
      status: 200,
      message: "ADGroups retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching user ID by email: ", error);
    // Return null in case of an error
    return {
      data: null,
      status: 500,
      message: "Error getting ADGroups",
    };
  }
};

const GetInterviewPanel = async (
  filterConditions: any[] = []
): Promise<ApiResponse<any | null>> => {
  try {
    const listItems: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSInterviewPanelDetails,
      Select: "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail,IsScoreSheetUploaded",
      Expand: "InterviewPanel,RecruitmentID,CandidateID",
      Filter: filterConditions,
    });

    return {
      data: listItems,
      status: 200,
      message: "ADGroups retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching user ID by email: ", error);
    // Return null in case of an error
    return {
      data: null,
      status: 500,
      message: "Error getting ADGroups",
    };
  }
};

export default class RecruitmentService implements IRecruitmentService {

  async GetJobTitleInNPEP(
    Filter: any[],
    Conditions: any,
    ModalDropDown: any
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
    try {
      const [newPositionRes, additionalPositionRes] = await Promise.all([
        this.fetchNewPositionRequest(Filter, Conditions, ModalDropDown),
        this.GetAdditionalExistingPositionEditView(Filter, Conditions, ModalDropDown),
      ]);
      const combinedData = [
        ...(newPositionRes.data ?? []).map(item => ({ ...item })),
        ...(additionalPositionRes.data ?? []).map(item => ({ ...item })),
      ];

      return {
        data: combinedData,
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

  async GetAdditionalExistingPositionEditView(
    Filter: any[],
    Conditions: any,
    ModalDropDown: any
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
    let GridResult: DataSyncToRecruitmentResponse[] = [];

    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.HRMSAdditionalHeadCountForExisitingPosition,
        Select:
          "*,Action/Action,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,BusinessUnitCode/BusineesUnitCode,Status/StatusDescription,Author/EMail",
        Filter: Filter,
        Expand:
          "Action,Department,SubDepartment,Section,DepartmentCode,BusinessUnitCode,Status,Author",
        FilterCondition: Conditions,
        Orderby: "ID",
        Orderbydecorasc: false,
        Topcount: count.Topcount,
      });

      let ISBudgetOrUnBudgeted: string = ""
      if (res.length > 0) {
        GridResult = await Promise.all(
          res.map(async (objresult: any, index: number) => {
            ISBudgetOrUnBudgeted = objresult.ISBudgetOrUnBudgeted
            const item: DataSyncToRecruitmentResponse = {
              ID: objresult.ID,
              BusinessUnitCode: objresult.BusinessUnitCode ? objresult.BusinessUnitCode.BusineesUnitCode : "",
              BusinessUnitCodeId: objresult.BusinessUnitCodeId,
              BusinessUnitName: "",
              BusinessUnitDescription: "",
              Nationality: objresult.Nationality,
              Department: objresult.Department?.DepartmentName || "",
              DepartmentId: objresult.DepartmentId,
              SubDepartment: objresult.SubDepartment?.SubDepTitle || "",
              SubDepartmentId: objresult.SubDepartmentId,
              Section: objresult.Section?.SectionName || "",
              SectionId: objresult.SectionId,
              DepartmentCodeId: objresult.DepartmentCodeId,
              DepartmentCode: objresult.DepartmentCode?.DptCode || "",
              EmploymentCategory: objresult.EmploymentCategory,
              TypeOfContract: objresult.TypeOfContract,
              NumberOfPersonNeeded: "",
              EnterNumberOfMonths: objresult?.EnterNumberOfMonths,
              AreaofWork: objresult.AreaofWork,
              DateRequried: objresult.DatePositionIsRequired,
              Type: DataFrom.ExistingPosition,
              Status: objresult.Status ? objresult.Status.StatusDescription : "",
              StatusId: objresult?.StatusId,
              Action: objresult.Action?.Action ? objresult.Action?.Action : "",
              ActionTypeId: objresult.ActionId ? objresult.ActionId : "",
              Location: objresult?.Location || "",

              JobCodeId: 0,
              JobCode: "",
              JobTitleEnglish: "",
              JobTitleFrench: "",
              PatersonGrade: "",
              DRCGrade: "",
              JobTitleEnglishId: 0,
              JobTitleFrenchId: 0,
              PatersonGradeId: 0,
              DRCGradeId: 0,

              Checked: false,

              VacancyConfirmed: "",
              RecruitmentAuthorised: "",
              IsPayrollEmailed: "",
              AssignedHR: "",
              AssignedHRId: 0,
              AssignLineManager: "",
              AssignLineManagerId: 0,
              ReasonForVacancy: "",

              JobPostingStartDate: undefined,
              JobPostingEndDate: undefined,
              JobPostingFirstExtensionEndDate: undefined,
              JobPostingSecondExtensionEndDate: undefined,

              AssignEMail: ""
            };
            return item;
          })
        );

        const ids = GridResult.map((item) => item.ID).filter((id) => id);
        const Arrayofarray = SPServices.ArraySpiltInOperator(
          ids,
          InOperator.arraysize
        );

        // For each set of IDs, fetch additional headcount data
        for (const itemId of Arrayofarray) {
          const filterConditions = [
            {
              FilterKey: "LookupIDId",
              Operator: "in",
              FilterValue: itemId,
            },
          ];

          const resdata = await SPServices.SPReadItems({
            Listname: ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails,
            Select: "*,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleEnglish/JobTitleInEnglish,JobTitleFrench/JobTitleInFrench",
            Filter: filterConditions,
            Expand: "DRCGrade,PatersonGrade,JobTitleEnglish,JobTitleFrench",
            Topcount: count.Topcount,
          });

          // Update GridResult based on matching items
          for (const item of GridResult) {
            const filteredResults = resdata.filter(
              (obj: any) => obj.LookupIDId === item.ID
            );
            if (filteredResults.length > 0) {
              const filtered = filteredResults[0];
              const filterConditions = [
                {
                  FilterKey: "JobTitleInEnglish",
                  Operator: "in",
                  FilterValue: filtered.JobTitleEnglish?.JobTitleInEnglish,
                },
              ];
              const JobCode = await this.fetchJobCodeDetails(filterConditions, "");
              // console.log(JobCode.data, "JobCode");
              item.JobCodeId = JobCode.data?.JobCodeID ? JobCode.data?.JobCodeID : 0;
              item.JobCode = JobCode.data?.JobCode ? JobCode.data?.JobCode : "";
              item.JobTitleEnglishId = filtered.JobTitleEnglishId ?? 0;
              item.JobTitleEnglish = filtered.JobTitleEnglish?.JobTitleInEnglish || "";
              item.JobTitleFrenchId = filtered.JobTitleFrenchId ?? 0;
              item.JobTitleFrench = filtered.JobTitleFrench?.JobTitleInFrench || "";
              item.DRCGradeId = filtered.DRCGradeId ?? 0;
              item.DRCGrade = filtered.DRCGrade?.DRCGrade || "";
              item.PatersonGradeId = filtered.PatersonGradeId ?? 0;
              item.PatersonGrade = filtered.PatersonGrade?.PatersonGrade || "";
              // item.JobCodeId = filtered.ApprovedHeadCountInLP;
              item.NumberOfPersonNeeded = ISBudgetOrUnBudgeted === "Budgeted Position" ? filtered?.ActualPosition : filtered?.AdditionalHeadCountRequried;
            }
          }
        }
      }

      return {
        data: GridResult,
        status: 200,
        message: "GetApproverLaborPlanPositionDetails fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  async fetchNewPositionRequest(filterParam: any, filterConditions: any, ModalDropDown: any): Promise<ApiResponse<DataSyncToRecruitmentResponse[] | null>> {
    let GridResult: DataSyncToRecruitmentResponse[] = []
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.HRMSNewPositionRequest,
        Select: "*,Action/Action,BusinessUnitCode/BusineesUnitCode,Status/StatusDescription,Author/EMail,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Role/RoleTitle",
        Expand: "Action,BusinessUnitCode,Status,Author,Department,SubDepartment,Section,DepartmentCode,Role",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Orderby: "Id",
        Orderbydecorasc: false
      });

      if (res.length > 0) {
        GridResult = await Promise.all(
          res.map(async (item: any) => {
            const NPData: DataSyncToRecruitmentResponse = {
              ID: item.ID,
              BusinessUnitCode: item.BusinessUnitCode ? item.BusinessUnitCode.BusineesUnitCode : "",
              BusinessUnitCodeId: item.BusinessUnitCodeId ? item.BusinessUnitCodeId : "",
              BusinessUnitName: "",
              BusinessUnitDescription: "",
              Nationality: item.Nationality,
              Department: item.Department?.DepartmentName || "",
              DepartmentId: item.DepartmentId,
              SubDepartment: item.SubDepartment?.SubDepTitle || "",
              SubDepartmentId: item.SubDepartmentId,
              Section: item.Section?.SectionName || "",
              SectionId: item.SectionId,
              DepartmentCodeId: item.DepartmentCodeId,
              DepartmentCode: item.DepartmentCode?.DptCode || "",
              EmploymentCategory: item.EmploymentCategory,
              TypeOfContract: item.TypeOfContract,
              NumberOfPersonNeeded: item?.NumberOfPersonNeeded,
              EnterNumberOfMonths: item?.EnterNumberOfMonths,
              AreaofWork: item.AreaofWork,
              DateRequried: item.DateRequried ? item?.DateRequried : null,
              Type: DataFrom.NewPosition,
              Status: item.Status ? item.Status.StatusDescription : "",
              StatusId: item?.StatusId,
              Action: item.Action?.Action ? item.Action?.Action : "",
              ActionTypeId: item.ActionId ? item.ActionId : "",
              Location: item?.Location || "",

              JobCodeId: 0,
              JobCode: "",
              JobTitleEnglish: "",
              JobTitleFrench: "",
              PatersonGrade: "",
              DRCGrade: "",
              JobTitleEnglishId: 0,
              JobTitleFrenchId: 0,
              PatersonGradeId: 0,
              DRCGradeId: 0,

              Checked: false,

              VacancyConfirmed: "",
              RecruitmentAuthorised: "",
              IsPayrollEmailed: "",
              AssignedHR: "",
              AssignedHRId: 0,
              AssignLineManager: "",
              AssignLineManagerId: 0,
              ReasonForVacancy: "",

              JobPostingStartDate: undefined,
              JobPostingEndDate: undefined,
              JobPostingFirstExtensionEndDate: undefined,
              JobPostingSecondExtensionEndDate: undefined,

              AssignEMail: ""
            };
            return NPData;
          })
        );
        const ids = GridResult.map((item) => item.ID).filter((id => id));
        const Arrayofarray = SPServices.ArraySpiltInOperator(
          ids,
          InOperator.arraysize
        );
        for (const itemId of Arrayofarray) {
          const filterConditions = [
            {
              FilterKey: "PositionRequestID",
              Operator: "in",
              FilterValue: itemId,
            },
          ];

          const resdata = await SPServices.SPReadItems({
            Listname: ListNames.HRMSNewPositionRequestPositionDetails,
            Select: "*,JobTitleEnglish/JobTitleInEnglish,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,ExisitingJobTitle/JobTitleInEnglish,JobTitleFrench/JobTitleInFrench",
            Expand: "JobTitleEnglish,PatersonGrade,DRCGrade,ExisitingJobTitle,JobTitleFrench",
            Filter: filterConditions,
            // FilterCondition: filterConditions
          });

          for (const item of GridResult) {
            const filteredResults = resdata.filter(
              (obj: any) => obj.PositionRequestIDId === item.ID
            );

            if (filteredResults.length > 0) {
              const filtered = filteredResults[0];
              const filterConditions = [
                {
                  FilterKey: "JobTitleInEnglish",
                  Operator: "in",
                  FilterValue: filtered.JobTitleEnglish?.JobTitleInEnglish,
                },
              ];
              const JobCode = await this.fetchJobCodeDetails(filterConditions, "");
              // console.log(JobCode.data, "JobCode");
              item.JobCodeId = JobCode.data?.JobCodeID ? JobCode.data?.JobCodeID : 0;
              item.JobCode = JobCode.data?.JobCode ? JobCode.data?.JobCode : "";
              item.JobTitleEnglish = filtered.JobTitleEnglish?.JobTitleInEnglish ? filtered.JobTitleEnglish?.JobTitleInEnglish : "";
              item.JobTitleEnglishId = filtered.JobTitleEnglishId ? filtered.JobTitleEnglishId : 0;
              item.JobTitleFrench = filtered.JobTitleFrench?.JobTitleInFrench ? filtered.JobTitleFrench?.JobTitleInFrench : "";
              item.JobTitleFrenchId = filtered.JobTitleFrenchId ? filtered.JobTitleFrenchId : 0;
              item.PatersonGrade = filtered.PatersonGrade?.PatersonGrade ? filtered.PatersonGrade?.PatersonGrade : "";
              item.PatersonGradeId = filtered.PatersonGradeId ? filtered.PatersonGradeId : 0;
              item.DRCGradeId = filtered.DRCGradeId ? filtered.DRCGradeId : 0;
              item.DRCGrade = filtered.DRCGrade?.DRCGrade ? filtered.DRCGrade?.DRCGrade : "";
            }
          }
        }
      }
      // console.log(" fetchNewPositionRequest response op", GridResult);
      return {
        data: GridResult,
        status: 200,
        message: "fetchNewPositionRequest Fetched successfully",
      };
    } catch (error) {
      console.error("Error fetchNewPositionRequest:", error);
      throw error;
    }
  }

  async fetchJobCodeDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<JobCodeData | null>> {
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.HRMSJobTitleMaster,
        Select: "*,JobTitleInFrench/JobTitleInFrench,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade ",
        Expand: "JobTitleInFrench,PatersonGrade,DRCGrade",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Orderby: "Id",
        Orderbydecorasc: false
      });

      const JobCode: JobCodeData = {
        JobCode: res[0]?.JobCode,
        JobCodeID: res[0]?.ID,

      };
      return {
        data: JobCode,
        status: 200,
        message: "fetchJobCodeDetails Fetched successfully",
      };
    } catch (error) {
      console.error("Error fetchJobCodeDetails :", error);
      throw error;
    }
  }

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
        Orderbydecorasc: true,
      });

      const formattedItems: any[] = [];

      for (const item of listItems) {
        // console.log("item", item);
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
          DateRequired: moment(item.DateRequired).format("DD/MM/YYYY") || null,
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
        await this.GetPositionDetails(filter, "").then((returnitem: any) => {
          if (returnitem?.data && returnitem?.data?.length > 0) {
            positionIDResult = positionIDResult.concat(returnitem.data);
          }
          return positionIDResult;
        });

        if (positionresult?.data?.length > 0) {
          positionrequestresult.push(positionresult.data[0]);
        }

        formattedItems.push({ ...VRR, ...(positionresult?.data[0] || {}) });
      }

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

      const formattedItems = listItems.map(async (item) => {
        return {
          LookupId: item?.ID,
          JobTitleInEnglishId: item?.JobTitleEnglishId || 0,
          JobTitleInEnglish: item?.JobTitleEnglish?.JobTitleInEnglish || "",
          JobTitleInFrenchId: item?.JobTitleFrenchId || 0,
          JobTitleInFrench: item?.JobTitleFrench?.JobTitleInFrench || "",
          DRCGradeId: item?.DRCGradeId,
          DRCGrade: item?.DRCGrade?.DRCGrade || "",
          PayrollGradeId: item?.PatersonGradeId,
          PayrollGrade: item?.PatersonGrade?.PatersonGrade || "",
          //   PositionList :(await this.GetPositionID(item.JobTitleEnglishId, item.DepartmentId)).data
        };
      });

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
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
    let GridResult: DataSyncToRecruitmentResponse[] = []
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        Select: `*,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title`,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: `Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: true,
      });

      if (res.length > 0) {
        GridResult = await Promise.all(
          res.map((item) => {
            let Recruitment: DataSyncToRecruitmentResponse = {
              ID: item.ID,
              BusinessUnitCode: item?.BusinessUnitCode ? item?.BusinessUnitCode?.BusineesUnitCode : "",
              BusinessUnitCodeId: item?.BusinessUnitCodeId ? item?.BusinessUnitCodeId : "",
              BusinessUnitName: "",
              BusinessUnitDescription: "",
              Nationality: item?.Nationality,
              Department: item?.Department?.DepartmentName || "",
              DepartmentId: item?.DepartmentId,
              SubDepartment: item?.SubDepartment?.SubDepTitle || "",
              SubDepartmentId: item?.SubDepartmentId,
              Section: item?.Section?.SectionName || "",
              SectionId: item?.SectionId,
              DepartmentCodeId: item?.DepartmentCodeId,
              DepartmentCode: item?.DepartmentCode?.DptCode || "",
              EmploymentCategory: item?.EmploymentCategory,
              TypeOfContract: item?.TypeOfContract,
              NumberOfPersonNeeded: item?.NumberOfPersonNeeded,
              EnterNumberOfMonths: item?.EnterNumberOfMonths,
              AreaofWork: item?.AreaofWork,
              DateRequried: item?.DateRequried ? item?.DateRequried : "",
              Type: DataFrom?.NewPosition,
              Status: item?.Status ? item?.Status?.StatusDescription : "",
              StatusId: item?.StatusId,
              Action: item?.Action?.Action ? item?.Action?.Action : "",
              ActionTypeId: item?.ActionId ? item?.ActionId : "",
              Location: item?.Location || "",

              JobCodeId: item?.JobCodeId ? item?.JobCodeId : 0,
              JobCode: item?.JobCode?.JobCode ? item?.JobCode?.JobCode : "",
              JobTitleEnglish: "",
              JobTitleFrench: "",
              PatersonGrade: "",
              DRCGrade: "",
              JobTitleEnglishId: 0,
              JobTitleFrenchId: 0,
              PatersonGradeId: 0,
              DRCGradeId: 0,

              Checked: false,

              VacancyConfirmed: item?.VacancyConfirmed || "",
              RecruitmentAuthorised: item?.RecruitmentAuthorised || "",
              IsPayrollEmailed: item?.IsPayrollEmailed || "",
              AssignedHR: " ",// item?.AssignedHR?.Title || "",
              AssignedHRId: 0, //item?.AssignedHRId || 0,
              AssignLineManager: item?.AssignLineManager?.Title || "",
              AssignLineManagerId: item?.AssignLineManagerId || 0,
              ReasonForVacancy: item?.ReasonForVacancy || "",

              JobPostingStartDate: item?.JobPostingStartDate || undefined,
              JobPostingEndDate: item?.JobPostingEndDate || undefined,
              JobPostingFirstExtensionEndDate: item?.JobPostingFirstExtensionEndDate || undefined,
              JobPostingSecondExtensionEndDate: item?.JobPostingSecondExtensionEndDate || undefined,

              AssignEMail: item?.AssignedHR
            };
            return Recruitment;

          })
        );
        const ids = GridResult.map((item) => item.ID).filter((id => id));
        const Arrayofarray = SPServices.ArraySpiltInOperator(
          ids,
          InOperator.arraysize
        );
        for (const itemId of Arrayofarray) {
          const filterConditions = [
            {
              FilterKey: "RecruitmentID",
              Operator: "in",
              FilterValue: itemId,
            },
          ];

          const resdata = await SPServices.SPReadItems({
            Listname: ListNames.HRMSRecruitmentPositionDetails,
            Select:
              "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
            Filter: filterConditions,
            Expand: "JobTitleEnglish,DRCGrade,PatersonGrade,JobTitleFrench",
            Topcount: count.Topcount,
          });

          for (const item of GridResult) {
            const filteredResults = resdata.filter(
              (obj: any) => obj.RecruitmentIDId === item.ID
            );

            if (filteredResults.length > 0) {
              const filtered = filteredResults[0];
              item.JobTitleEnglish = filtered.JobTitleEnglish?.JobTitleInEnglish ? filtered.JobTitleEnglish?.JobTitleInEnglish : "";
              item.JobTitleEnglishId = filtered.JobTitleEnglishId ? filtered.JobTitleEnglishId : "";
              item.JobTitleFrench = filtered.JobTitleFrench?.JobTitleInFrench ? filtered.JobTitleFrench?.JobTitleInFrench : "";
              item.JobTitleFrenchId = filtered.JobTitleFrenchId ? filtered.JobTitleFrenchId : "";
              item.PatersonGrade = filtered.PatersonGrade?.PatersonGrade ? filtered.PatersonGrade?.PatersonGrade : "";
              item.PatersonGradeId = filtered.PatersonGradeId ? filtered.PatersonGradeId : 0;
              item.DRCGradeId = filtered.DRCGradeId ? filtered.DRCGradeId : 0;
              item.DRCGrade = filtered.DRCGrade?.DRCGrade ? filtered.DRCGrade?.DRCGrade : "";
            }
          }
        }
      }
      return {
        data: GridResult,
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

  async InsertRecruitmentDpt(RecruitmentValue: PostRecuritmentData): Promise<ApiResponse<any | null>> {
    try {
      let InsertResponse: any
      let response: any = await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        RequestJSON: RecruitmentValue.Data,
      });

      if (response?.data?.ID) {
        const PositionData = {
          JobTitleEnglishId: RecruitmentValue.PositionData.JobTitleEnglishId,
          JobTitleFrenchId: RecruitmentValue.PositionData.JobTitleFrenchId,
          PatersonGradeId: RecruitmentValue.PositionData.PatersonGradeId,
          DRCGradeId: RecruitmentValue.PositionData.DRCGradeId,
          RecruitmentIDId: response?.data?.ID,
        };

        const Positionresponse = await SPServices.SPAddItem({
          Listname: ListNames.HRMSRecruitmentPositionDetails,
          RequestJSON: PositionData,
        });
        if (Positionresponse?.data?.ID) {
          const CommentsData = {
            RoleId: RecruitmentValue.CommentsList.RoleId,
            RecruitmentIDId: response?.data?.ID,
            Comments: RecruitmentValue.CommentsList.Comments
          };
          const CommentsList = await SPServices.SPAddItem({
            Listname: ListNames.HRMSRecruitmentComments,
            RequestJSON: CommentsData,
          });

          if (CommentsList.data.ID) {
            const UpadateState = {
              ActionId: RecruitmentValue.updatePreList.ActionId,
              ItemCreated: RecruitmentValue.updatePreList.ItemCreated,
              IsDataSyncToRecruitment: RecruitmentValue.updatePreList.IsDataSyncToRecruitment,
            }
            const UpdateList = await SPServices.SPUpdateItem({
              Listname: RecruitmentValue.Data.DataFrom === DataFrom.NewPosition ? ListNames.HRMSNewPositionRequest : ListNames.HRMSAdditionalHeadCountForExisitingPosition,
              RequestJSON: UpadateState,
              ID: RecruitmentValue.updatePreList.ID,
            });
            InsertResponse = UpdateList
          }
        }
      }
      return {
        data: InsertResponse,
        status: 200,
        message: InsertResponse.message,
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
      // console.log(response);
      return {
        data: response,
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
        const response = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.InterviewPanelCandidateCV,
          item.JobCode?.JobCode,
          item?.PassportID
        );
        let candidateCV: IDocFiles[] = [];
        if (response.status === 200 && response.data) {
          candidateCV = response.data;
        } else {
          console.error("Error retrieving attachments:", response.message);
        }
        let roleprofileDoc: IDocFiles[] = [];
        if (response.status === 200 && response.data) {
          roleprofileDoc = response.data;
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
          FullName: `${item.FristName || ""} ${item.MiddleName || ""} ${item.LastName || ""
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
          AdvertisementDocument: [],
          ShortlistedValue: "",
        };
      });

      const resolvedItems = await Promise.all(formattedItems);

      CandidateDetails.push(...resolvedItems);

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

      const resolvedItems = await Promise.all(
        listItems.map(async (item) => {
          let candidateCV: IDocFiles[] = [];

          const jobCode = item?.JobCode?.JobCode ?? "";
          const profileID = item?.ProfileID ?? "";

          if (jobCode && profileID) {
            const filePath = `${DocumentLibraray.HRMSCareerPortalCandidateCV}/${profileID}/CV`;

            const response = (await SPServices.getDocLibFiles({
              FilePath: filePath,
            })) as IDocFiles[];
            candidateCV = response.filter((file) =>
              file.name.includes(jobCode)
            );

            if (candidateCV.length === 0) {
              console.log(
                `No CV found for ProfileID: ${profileID}, JobCode: ${jobCode}`
              );
            }
          } else {
            console.log(
              "No JobCode or ProfileID provided, skipping attachment fetch."
            );
          }

          return {
            ID: item.ID,
            RecruitmentID: item?.RecruitmentID?.ID,
            JobCode: jobCode,
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
            RoleProfileDocument: [],
            AdvertisementDocument: [],
            ShortlistedValue: "",
            InterviewDate: item?.InterviewDate,
            JobRequestID: item?.JobRequestID,
            ProfileID: profileID,
          };
        })
      );

      CandidateDetails.push(...resolvedItems);

      // console.log("Fetched Candidate Details:", CandidateDetails);

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
        Orderby: "ID",
        Orderbydecorasc: false,
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
      await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentComments,
        RequestJSON: obj,
      });

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
      const response = await SPServices.SPAddItem({
        Listname: ListName,
        RequestJSON: obj,
      });

      return {
        data: response.data,
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
      const roleKnowledgeMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRoleSpecificKnowlegeMaster,
        Select: "RoleSpecificKnowledge, Code",
      });

      const levelProficiencyMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSLevelOfProficiency,
        Select: "Levels, Code",
      });

      const technicalSkillsMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSTechnicalSkills,
        Select: "TechnicalSkills, Code",
      });

      const experienceMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSExperienceMaster,
        Select: "ID,ExperienceInYearRange",
      });

      const qualificationMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSQualification,
        Select: "Qualification, QualificationCode",
      });
      // console.log("Qualification", qualificationMaster);
      const functionTypeMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSJobTitleFunctionType,
        Select: "ID,FunctionType",
      });

      const roleKnowledgeMap = roleKnowledgeMaster.reduce((acc, item) => {
        acc[item.Code] = item.RoleSpecificKnowledge;
        return acc;
      }, {} as Record<string, string>);

      const levelProficiencyMap = levelProficiencyMaster.reduce((acc, item) => {
        acc[item.Code] = item.Levels;
        return acc;
      }, {} as Record<string, string>);

      const technicalSkillsMap = technicalSkillsMaster.reduce((acc, item) => {
        acc[item.Code] = item.TechnicalSkills;
        return acc;
      }, {} as Record<string, string>);

      const qualificationMap = qualificationMaster.reduce((acc, item) => {
        acc[item.QualificationCode] = item.Qualification;
        return acc;
      }, {} as Record<string, string>);

      const experienceMap = new Map(
        experienceMaster.map((exp) => [exp.ID, exp.ExperienceInYearRange])
      );

      const functionTypeMap = new Map(
        functionTypeMaster.map((exp) => [exp.ID, exp.FunctionType])
      );

      // console.log("qualificationMap", qualificationMap);
      console.log("functionTypeMap", functionTypeMap);
      // console.log("experienceMap", experienceMap);

      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentRoleProfileDetails,
        Select:
          "*,JobDescription,RoleProfile,RoleSpecificKnowledgeJson,TechnicalSkillsKnowledgeJson,YearofExperience,PreferredExperience/ID,PreferredExperience/ExperienceInYearRange,Qualification,PreferredQualification,TotalPreferredExperience/ID,TotalPreferredExperience/ExperienceInYearRange,FunctionType/FunctionType,JobCode/JobCode",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: "PreferredExperience,TotalPreferredExperience,FunctionType,JobCode",
        Orderby: "ID",
        Orderbydecorasc: false,
      });
      // console.log("listItems", listItems);
      const formattedItems = listItems.map((item) => {
        const roleKnowledgeArray = JSON.parse(
          item.RoleSpecificKnowledgeJson || "[]"
        );
        const techSkillsArray = JSON.parse(
          item.TechnicalSkillsKnowledgeJson || "[]"
        );
        let qualificationArray: any[] = [];
        let preferredQualificationArray: any[] = [];

        if (item.Qualification) {
          try {
            const parsedQ = JSON.parse(item.Qualification);
            qualificationArray = Array.isArray(parsedQ) ? parsedQ : [parsedQ];
          } catch (error) {
            console.error("Error parsing Qualification:", error);
          }
        }
        // console.log("item.Qualification", item.Qualification);
        if (item.PreferredQualification) {
          try {
            const parsedPQ = JSON.parse(item.PreferredQualification);
            preferredQualificationArray = Array.isArray(parsedPQ)
              ? parsedPQ
              : [parsedPQ];
          } catch (error) {
            console.error("Error parsing Preferred Qualification:", error);
          }
        }
        // console.log("item.Qualification", item.Qualification);
        // console.log("listItems", listItems);
        const functionType = item.FunctionType;

        return {
          RecruitmentID: item?.RecruitmentID?.ID || "",
          JobDescription: item.JobDescription || "",
          RoleProfile: item.RoleProfile || "",
          RoleSpecificKnowledge: roleKnowledgeArray.map((rk: any) => ({
            RoleSpecificKnowledge:
              roleKnowledgeMap[rk.RoleSpeKnowledge] || rk.RoleSpeKnowledge,
            RequiredLevel:
              levelProficiencyMap[rk.RequiredLevel] || rk.RequiredLevel,
          })),
          TechnicalSkillsKnowledge: techSkillsArray.map((ts: any) => ({
            TechnicalSkills:
              technicalSkillsMap[ts.TechnicalSkills] || ts.TechnicalSkills,
            LevelProficiency:
              levelProficiencyMap[ts.LevelProficiency] || ts.LevelProficiency,
          })),

          // Qualification: qualificationArray.map((q) => ({
          //   text:
          //     qualificationMap[q.MinQualification] ||
          //     q.MinQualification ||
          //     "N/A",
          // })),
          // Converting multiple values into comma-separated strings
          Qualification: qualificationArray
            .map(
              (q) =>
                qualificationMap[q.MinQualification] ||
                q.MinQualification ||
                "N/A"
            )
            .join(", "),

          // PreferredQualification: preferredQualificationArray.map((pq) => ({
          //   text:
          //     qualificationMap[pq.PrefeQualification] ||
          //     pq.PrefeQualification ||
          //     "N/A",
          // })),

          PreferredQualification: preferredQualificationArray
            .map(
              (pq) =>
                qualificationMap[pq.PrefeQualification] ||
                pq.PrefeQualification ||
                "N/A"
            )
            .join(", "),
          YearofExperience:
            experienceMap.get(item.TotalPreferredExperience?.ID) || "N/A",
          PreferredExperience:
            experienceMap.get(item.PreferredExperience?.ID) || "N/A",
          TotalPreferredExperience:
            experienceMap.get(item.TotalPreferredExperience?.ID) || "N/A",

          // FunctionType:
          //   functionTypeMap.get(Number(item.FunctionType?.ID)) || "N/A",
          FunctionType: functionType ? functionType.FunctionType : "N/A",
        };
      });

      // console.log("Formatted Items:", formattedItems);
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
        const response = await SPServices.SPAddItem({
          Listname: ListNames.HRMSExternalAgentsDetailsForRecruitment,
          RequestJSON: AgencyInsert,
        });

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
      // console.log("candidateScoreCardItems", candidateScoreCardItems);
      // console.log("interviewPanelItems", interviewPanelItems);
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
      // console.log("formattedItems", formattedItems);
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

  async GetDataInList(
    ListName: string,
    filterParam: any[],
    filterConditions: any,
    Select: string,
    Expand: string
  ): Promise<ApiResponse<any | null>> {
    try {
      let GetItem: any;
      await SPServices.SPReadItems({
        Listname: ListName,
        Select: Select,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: Expand,
        Orderby: "ID",
        Orderbydecorasc: true,
      })
        .then((res) => {
          // console.log(res, "res");
          GetItem = res;
        })
        .catch((error) => {
          console.log(
            "Error fetching data GetHRMSRecruitmentRoleProfileDetails:",
            error
          );
        });
      return {
        data: GetItem,
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

  GetFilterInCategory = async (
    filterConditions: any
  ): Promise<ApiResponse<any[]>> => {
    try {
      const Category: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCategoryMaster,
        Select: "*",
        Filter: filterConditions,
      });
      return {
        data: Category,
        status: 200,
        message: "fetched Category successfully",
      };
    } catch (error) {
      console.error("Error fetching data Category:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching data from Category",
      };
    }
  };

  async UploadAdvertisementInPortal(
    Filter: any[],
    Condition: string,
    RecuritmentDetails: any,
    AdvertisementValue: any,
    MasterData: any,
    IsActive: number,
  ): Promise<ApiResponse<null>> {
    try {
      const res = await SPServices.SPGetItems({
        Listname: ListNames.HRMSRecruitmentRoleProfileDetails,
        Filter: Filter,
        FilterCondition: Condition,
        Select: "*,JobDescription,RoleProfile,TotalPreferredExperience/ExperienceInYearRange,PreferredExperience/ExperienceInYearRange,FunctionType/Code,JobCode/JobCode",
        Expand: "PreferredExperience,TotalPreferredExperience,FunctionType,JobCode",
      });

      if (!res || res.length === 0) {
        // console.log("No data found in GetHRMSRecruitmentRoleProfileDetails");
        return { data: null, status: 400, message: "No data found" };
      }

      const data = res[0];
      const roleSpecificKnowledge = data.RoleSpecificKnowledgeJson
        ? JSON.parse(data.RoleSpecificKnowledgeJson)
        : [];
      const technicalSkill = data.TechnicalSkillsKnowledgeJson
        ? JSON.parse(data.TechnicalSkillsKnowledgeJson)
        : [];

      const roleSpecificSkills: RoleAndTechSkills[] = roleSpecificKnowledge.map(
        (item: any) => ({
          skillId: String(item.RoleSpeKnowledge || ""),
          levelId: String(item.RequiredLevel || ""),
        })
      );

      const technicalSkills: RoleAndTechSkills[] = technicalSkill.map(
        (item: any) => ({
          skillId: String(item.TechnicalSkills || ""),
          levelId: String(item.LevelProficiency || ""),
        })
      );

      const Roleandtechnical: RoleAndTechSkills[] = [
        ...roleSpecificSkills,
        ...technicalSkills,
      ];

      const minQualifications: MinAndPreferedQualifications[] = data.Qualification
        ? JSON.parse(data.Qualification).map((item: any) => ({
          qualification: item.MinQualification,
          type: 0,
        }))
        : [];

      const preferredQualifications: MinAndPreferedQualifications[] =
        data.PreferredQualification
          ? JSON.parse(data.PreferredQualification).map((item: any) => ({
            qualification: item.PrefeQualification,
            type: 1,
          }))
          : [];

      const MinAndPreferedQualification: MinAndPreferedQualifications[] = [
        ...minQualifications,
        ...preferredQualifications,
      ];
      const decodeBase64 = (str: string): string => {
        const utf8Bytes: any = new TextEncoder().encode(str);
        const binary = String.fromCharCode(...utf8Bytes);
        return btoa(binary);
      };

      const Description: Descriptions = {
        jobTitle: RecuritmentDetails.JobNameInEnglish === undefined ? RecuritmentDetails.JobTitleEnglish : RecuritmentDetails.JobNameInEnglish,
        jobShortSummary: decodeBase64(data.RoleProfile || ""),
        jobSummary: decodeBase64(data.JobDescription || ""),
      };

      const onamdocpathfile = await CommonServices.GetAttachmentLink(
        RecuritmentDetails.JobCode,
        DocumentLibraray.ONAMSignedStampDocuments
      );

      const onemdocPath = String(onamdocpathfile.data);

      const DepartmentCode = MasterData.Department.find(
        (item: { text: string }) =>
          item.text === RecuritmentDetails.Department
      );

      const NationalityValue =
        RecuritmentDetails.Nationality === Nationality.Nationals
          ? "Congolese"
          : RecuritmentDetails.Nationality;

      const AdvertisementDetails: AdvertisementDetails = {
        jobCode: RecuritmentDetails.JobCode,
        isActive: IsActive,
        noOfPositions: String(RecuritmentDetails?.NoofPositionAssigned === undefined ? RecuritmentDetails?.NumberOfPersonNeeded : RecuritmentDetails?.NoofPositionAssigned),
        validFrom: AdvertisementValue.ValidFrom ?? null,
        validTo: AdvertisementValue.ValidTo ?? null,
        employmentType: "Full Time",
        departmentId: DepartmentCode?.code || "",
        role: null,
        functionId: String(data.FunctionType?.Code || ""),
        onemdocPath: onemdocPath ?? "",
        experience: String(
          data.TotalPreferredExperience?.ExperienceInYearRange || ""
        ),
        nationality: NationalityValue,
        Descriptions_en: Description,
        Descriptions_fr: Description,
        RoleAndTechSkills: Roleandtechnical,
        MinAndPreferedQualifications: MinAndPreferedQualification,
      };

      const response = await GetPortalJobsService.UpsertJobs(
        AdvertisementDetails
      );

      if (response.status === ResponeStatus.SUCCESS) {
        return {
          data: null,
          status: 200,
          message: "Error while posting advertisement details",
        };
      } else {
        return {
          data: null,
          status: 500,
          message: "Data submitted successfully",
        };
      }
    } catch (error) {
      console.error("Error posting user data:", error);
      return {
        data: null,
        status: 400,
        message: "Error On Posting Data",
      };
    }
  }

  async GetInterviewPanelDetails(
    filterParam: any[],
    filterConditions: any,
    AssignHR: AutoCompleteItem,
    CandidateID: number,
    levels: string[],
    StatusID: number,
  ): Promise<ApiResponse<InterviewPanelMember | null>> {
    let GetItem: InterviewPanelMember | null = null;
    try {
      await SPServices.SPReadItems({
        Listname: ListNames.JDEDataMapping,
        Select: "*,BUC/BusineesUnitCode,LineManager/EMail,HOD/EMail,HR/EMail,EXCO/EMail",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: "BUC,LineManager,HOD,HR,EXCO",
        Orderby: "ID",
        Orderbydecorasc: true,
      })
        .then(async (res) => {
          // console.log(res, "res");
          const interviewpanelOption = await CommonServices.GetADgruopsEmailIDs(
            ADGroupID.HRMSInterviewPanel
          );
          let panelMembers: InterviewPanelItem[] = [];
          let Filter = [
            {
              FilterKey: "CandidateID",
              Operator: "eq",
              FilterValue: CandidateID
            },
            {
              FilterKey: "InterviewLevel",
              Operator: "in",
              FilterValue: levels
            }
          ]
          let InterviewPanelDetails = await GetInterviewPanel(Filter)
          // console.log((InterviewPanelDetails).data, "InterviewPanelDetails");

          for (const item of res) {
            if (item?.LineManagerId && item?.LineManager?.EMail) {
              let UserName = await GetUserName(item.LineManager.EMail);
              panelMembers.push({
                key: item.LineManagerId,
                Role: RoleName.LineManager,
                text: String(UserName.data),
              });
            }
            if (item?.HODId && item?.HOD?.EMail) {
              let UserName = await GetUserName(item?.HOD?.EMail);
              panelMembers.push({
                key: item.HODId,
                Role: RoleName.HOD,
                text: String(UserName.data),
              });
            }
            if (item?.EXCOId && item?.EXCO?.EMail) {
              let UserName = await GetUserName(item?.EXCO?.EMail);
              panelMembers.push({
                key: item.EXCOId,
                Role: RoleName.EXCO,
                text: String(UserName.data),
              });
            }
            if (AssignHR) {
              let UserName = await GetUserName(AssignHR.text);
              panelMembers.push({
                key: AssignHR.key,
                Role: RoleName.RecruitmentHR,
                text: String(UserName.data),
              });
            }
          }
          let Get_InterviewPanel = await Promise.all(
            InterviewPanelDetails.data.map(async (item: any) => {
              let UserName = await GetUserName(item.InterviewPanel?.EMail);
              return {
                key: item?.InterviewPanel?.Id,
                Role: RoleName.InterviewPanel,
                text: String(UserName.data),
                Levels: item?.InterviewLevel
              }
            }));

          if (Array.isArray(interviewpanelOption?.data)) {
            panelMembers.push(...interviewpanelOption.data);
          }
          let MembersLevel1: AutoCompleteItem[] = [];
          let MemberLevel2: AutoCompleteItem[] = [];
          let OptionMember: AutoCompleteItem[] = []
          if (String(StatusID) === workflowStatusApi.PendingRecruitmentHRscheduleInterview) {
            MembersLevel1 = panelMembers.filter(
              (item) =>
                item.Role === RoleName.LineManager ||
                item.Role === RoleName.HOD ||
                item.Role === RoleName.RecruitmentHR
            );
            OptionMember = panelMembers.map((item) => {
              return {
                key: item?.key,
                text: item?.text,
              };
            });
          } else if (StatusID === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
            MembersLevel1 = Get_InterviewPanel.filter(
              (item) => item.Levels === InterviewLevels.Level1
            );
            MemberLevel2 = panelMembers.filter(
              (item) =>
                item.Role === RoleName.EXCO ||
                item.Role === RoleName.HOD ||
                item.Role === RoleName.RecruitmentHR
            );
            OptionMember = panelMembers.map((item) => {
              return {
                key: item?.key,
                text: item?.text,
              };
            });
          } else if (StatusID === StatusId.InterviewScheduled || StatusID === StatusId.InterviewScheduledforLevel2) {
            MembersLevel1 = Get_InterviewPanel.filter(
              (item) => item.Levels === InterviewLevels.Level1
            );
            MemberLevel2 = Get_InterviewPanel.filter(
              (item) => item.Levels === InterviewLevels.Level2
            );
          }
          function removeDuplicatesByKey<T extends { key: any }>(arr: T[]): T[] {
            const seen = new Set();
            return arr.filter(item => {
              if (seen.has(item.key)) return false;
              seen.add(item.key);
              return true;
            });
          }

          MembersLevel1 = removeDuplicatesByKey(MembersLevel1);
          MemberLevel2 = removeDuplicatesByKey(MemberLevel2);
          OptionMember = removeDuplicatesByKey(OptionMember);

          const InterviewPanelData: InterviewPanelMember = {
            Level1Panel: MembersLevel1,
            Level2Panel: MemberLevel2,
            InterviewPanel: OptionMember
          };
          GetItem = InterviewPanelData
        })
        .catch((error) => {
          console.log(
            "Error fetching data GetHRMSRecruitmentRoleProfileDetails:",
            error
          );
        });
      return {
        data: GetItem,
        status: 200,
        message: "GetHRMSRecruitmentRoleProfileDetails fetched successfully",
      };
    } catch (error) {
      console.error(
        "Error fetching data GetHRMSRecruitmentRoleProfileDetails:",
        error
      );
      return {
        data: GetItem,
        status: 500,
        message:
          "Error fetching data from GetHRMSRecruitmentRoleProfileDetails",
      };
    }
  }
}