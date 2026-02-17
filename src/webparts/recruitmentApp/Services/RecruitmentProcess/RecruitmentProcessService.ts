import { Choices, DataFrom, DocumentLibraray, InOperator, InterviewLevels, ListNames, Nationality, ResponeStatus, RoleID, RoleName, StatusId, count, workflowStatusApi } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";
import {
  CommentsData,
  DataSyncToRecruitmentResponse,
  GetJobUniqueKey,
  InsertComments,
  IRecruitmentService,
  JobCodeData,
  PostRecuritmentData,
} from "./IRecruitmentProcessService";
import { CandidateData, QualificationValue, RoleSpecKnowledge, tabCount } from "../../Models/RecuritmentVRR";
import { sp } from "@pnp/sp/presets/all";
import { CommonServices, GetPortalJobsService, getVRRDetails, InterviewServices } from "../ServiceExport";
import { IDocFiles, IFilter } from "../SPService/ISPServicesProps";
import * as moment from "moment";
import { AdvertisementDetails, Descriptions, FilterItem, MinAndPreferedQualifications, RoleAndTechSkills } from "../../Models/ApIInterface";
import { AutoCompleteItem, InterviewPanelItem, InterviewPanelMember, tooltipInterviewPanel } from "../../Models/Screens";
import { ActionName } from "../../utilities/LabelName";
import { getScoreCardCount, getTotalAppliedCount } from "../../Screens/RecuritmentProcess/CommanFilter";

interface IAttachmentExampleState {
  file: File | any;
  fileName: string;
  fileContent: string | ArrayBuffer | null;
  serverRelativeUrl: string;
  ID: string;
}

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

  async GetCountApprovedList(
    FilterData: IFilter[],
    CurrentUserID: string,
    AssignHRFlag: boolean,
    EvalutionFlag: boolean,
    ReviewProfileFlag: boolean,
    ReviewScoreCardFlag: boolean
  ): Promise<ApiResponse<tabCount>> {
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        Select:
          "*,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title",
        Filter: FilterData,
        FilterCondition: "and",
        Expand:
          "Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode",
        Orderby: "ID",
        Orderbydecorasc: true,
        Topcount: count.Topcount,
      });

      let AssignHRCount = 0;
      let EvaluationCount = 0;
      let ReviewProfileCount = 0;
      let ScoreCardCount = 0;
      if (AssignHRFlag) {
        const commonFilter = [
          { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.ReadyforRecruitmentProcess },
          { FilterKey: "IsDataSyncToRecruitment", Operator: "eq", FilterValue: Choices.Yes },
          { FilterKey: "ItemCreated", Operator: "eq", FilterValue: Choices.No },
        ];

        const [additional, newPosition, vacancy] = await Promise.all([
          SPServices.SPReadItems({
            Listname: ListNames.HRMSAdditionalHeadCountForExisitingPosition,
            Select: "ID",
            Filter: commonFilter,
            FilterCondition: "and",
          }),
          SPServices.SPReadItems({
            Listname: ListNames.HRMSNewPositionRequest,
            Select: "ID",
            Filter: commonFilter,
            FilterCondition: "and",
          }),
          SPServices.SPReadItems({
            Listname: ListNames.HRMSVacancyReplacementRequest,
            Select: "ID",
            Filter: commonFilter,
            FilterCondition: "and",
          }),
        ]);

        AssignHRCount = additional.length + newPosition.length + vacancy.length;
      }

      if (EvalutionFlag) {
        const userResponse = await CommonServices.getUserGuidByEmail(CurrentUserID);
        const panelUserId = userResponse?.data?.key;

        const candidates = await SPServices.SPReadItems({
          Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
          Select: "ID",
          Filter: [
            {
              FilterKey: "StatusId",
              Operator: "in",
              FilterValue: [
                StatusId.InterviewScheduled,
                StatusId.InterviewScheduledforLevel2,
              ],
            },
            {
              FilterKey: "ItemCreated",
              Operator: "eq",
              FilterValue: Choices.No,
            },
          ],
          FilterCondition: "and",
        });

        const candidateIds = candidates.map((c: any) => c.ID);

        const panelItems = await SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select: "ID,CandidateID/ID",
          Expand: "CandidateID",
          Filter: [
            {
              FilterKey: "InterviewPanelId",
              Operator: "eq",
              FilterValue: panelUserId,
            },
            {
              FilterKey: "CandidateID",
              Operator: "in",
              FilterValue: candidateIds,
            },
          ],
          FilterCondition: "and",
        });
        EvaluationCount = panelItems.length;
      }

      if (ReviewProfileFlag) {
        const getReviewProfileCount = res.filter(
          (item) =>
            item.StatusId === StatusId.RecruitmentInProgress &&
            item.AssignLineManager === CurrentUserID,
        );

        const ReviewProfile = await getTotalAppliedCount(
          getReviewProfileCount,
          [
            workflowStatusApi.LineManagerL1Pending,
            workflowStatusApi.LineManagerL2Pending,
            workflowStatusApi.LineManagerLevel1OnHold,
            workflowStatusApi.LineManagerLevel2OnHold,
          ],
        );
        ReviewProfileCount = ReviewProfile
      }

      if (ReviewScoreCardFlag) {
        const userEmail = CurrentUserID;

        const getScoreCount = res.filter(
          (item) =>
            item.StatusId === StatusId.RecruitmentInProgress &&
            item.AssignHOD === userEmail,
        );

        const ScoreCard = await getScoreCardCount(getScoreCount);
        ScoreCardCount = ScoreCard
      }


      const data: tabCount = {
        AssignHRCount,
        UploadONEMCount: res.filter(
          i => i.StatusId === StatusId.PendingwithHRLeadtouploadONEMsigneddoc
        ).length,

        UploadAdvertisementCount: res.filter(
          i => i.StatusId === StatusId.PendingwithRecruitmentHRtouploadAdv &&
            i.AssignedHR === CurrentUserID
        ).length,

        lineManagerInterviewCount: res.filter(
          i => i.StatusId === StatusId.PendingwithHRandLMtocreateinterviewQuestion ||
            (i.StatusId === StatusId.PendingwithLMcreateDisqualificationQuestion &&
              i.LineManager === CurrentUserID)
        ).length,

        ReviewLineManagerCount: res.filter(
          i => i.StatusId === StatusId.PendingwithLineManagereviewAdv &&
            i.LineManager === CurrentUserID
        ).length,

        ReviewHODCount: res.filter(
          i => i.StatusId === StatusId.PendingwithHODtoreviewAdv &&
            i.HOD === CurrentUserID
        ).length,

        AssignAgencyCount: res.filter(
          i => i.StatusId === StatusId.RecruitmentInProgress &&
            i.AssignedHR === CurrentUserID
        ).length,

        EvaluationCount: EvaluationCount,
        ReviewProfileCount: ReviewProfileCount,
        ReviewScoreCardCount: ScoreCardCount,
        HODReviewScoreCount: 0,
        advertExtensionCount: 0,
      };

      return {
        data,
        status: 200,
        message: "Counts fetched successfully",
      };
    } catch (error) {
      console.error("GetCountApprovedList error:", error);
      return {
        data: {} as tabCount,
        status: 500,
        message: "Error fetching count details",
      };
    }
  }

  async GetJobTitleInNPEP(
    Filter: any[],
    Conditions: any,
    ModalDropDown: any
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
    try {
      const [newPositionRes, additionalPositionRes, VacantPosition] = await Promise.all([
        this.fetchNewPositionRequest(Filter, Conditions, ModalDropDown),
        this.GetAdditionalExistingPositionEditView(Filter, Conditions, ModalDropDown),
        this.GetVacancyDetails(Filter, Conditions, ModalDropDown),
      ]);

      const combinedData = [
        ...(newPositionRes.data ?? []),
        ...(additionalPositionRes.data ?? []),
        ...(VacantPosition.data ?? [])
      ].map((item, index) => ({
        ...item,
        RecordID: index + 1,
      }));
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

      // let ISBudgetOrUnBudgeted: string = ""
      if (res.length > 0) {
        GridResult = await Promise.all(
          res.map(async (objresult: any, index: number) => {
            // ISBudgetOrUnBudgeted = objresult.ISBudgetOrUnBudgeted
            const item: DataSyncToRecruitmentResponse = {
              ID: objresult.ID,
              RecordID: index + 1,
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

              AssignEMail: "",
              AssignHOD: "",

              QuestionByHR: "",
              QuestionByLM: "",
              JobAppliedCount: ""
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
              item.NumberOfPersonNeeded = filtered?.ActualVacantPosition;
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
          res.map(async (item: any, index: number) => {
            const NPData: DataSyncToRecruitmentResponse = {
              ID: item.ID,
              RecordID: index + 1,
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

              AssignEMail: "",
              AssignHOD: " ",

              QuestionByHR: "",
              QuestionByLM: "",
              JobAppliedCount: ""
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


  async GetVacancyDetails(filterParam: any, filterConditions: any, ModalDropDown: any): Promise<ApiResponse<DataSyncToRecruitmentResponse[] | null>> {
    let GridResult: DataSyncToRecruitmentResponse[] = []
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.HRMSVacancyReplacementRequest,
        Select: "*,Department/DepartmentName,BusinessUnitCode/BusineesUnitCode,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode, Status/StatusDescription,Author/EMail,JobCode/JobCode,JobCode/JobTitleInEnglish,JobTitleFrench/JobTitleInFrench,PatersonGrade/PatersonGrade,PatersonGrade/DRCGrade",
        Filter: filterParam,
        Expand: "Department,BusinessUnitCode,SubDepartment,Section,DepartmentCode,Status,Author,JobCode,JobTitleFrench,PatersonGrade",
        FilterCondition: filterConditions,
        Orderby: "ID",
        Orderbydecorasc: false
      });

      if (res.length > 0) {
        GridResult = await Promise.all(
          res.map(async (item: any, index: number) => {
            const VRRData: DataSyncToRecruitmentResponse = {
              ID: item.ID,
              RecordID: index + 1,
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
              Type: DataFrom.VacancyRecruitmentProcess,
              Status: item.Status ? item.Status.StatusDescription : "",
              StatusId: item?.StatusId,
              Action: item.Action?.Action ? item.Action?.Action : "",
              ActionTypeId: item.ActionId ? item.ActionId : "",
              Location: "DRC",

              JobTitleEnglishId: item?.JobCodeId || 0,
              JobTitleEnglish: item?.JobCode?.JobTitleInEnglish ?? "",
              JobTitleFrenchId: item?.JobTitleFrenchId || 0,
              JobTitleFrench: item?.JobTitleFrench?.JobTitleInFrench || "",
              DRCGradeId: item?.PatersonGradeId || 0,
              DRCGrade: item?.PatersonGrade?.DRCGrade || "",
              JobCode: item?.JobCode?.JobCode || "",
              JobCodeId: item?.JobCodeId || 0,
              PatersonGradeId: item?.PatersonGradeId || 0,
              PatersonGrade: item?.PatersonGrade?.PatersonGrade || "",

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

              AssignEMail: "",
              AssignHOD: " ",

              QuestionByHR: "",
              QuestionByLM: "",
              JobAppliedCount: ""
            };
            return VRRData;
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
              FilterKey: "VRRID",
              Operator: "in",
              FilterValue: itemId,
            },
          ];

          const resdata = await SPServices.SPReadItems({
            Listname: ListNames.HRMSVRRPositionDetails,
            Select:
              "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
            Filter: filterConditions,
            Expand: "JobTitleEnglish,DRCGrade,JobTitleFrench,PatersonGrade",
            Topcount: count.Topcount,
          });

          for (const item of GridResult) {
            const filteredResults = resdata.filter(
              (obj: any) => obj.VRRIDId === item.ID
            );

            if (filteredResults.length > 0) {
              const filtered = filteredResults[0];
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
      return {
        data: GridResult,
        status: 200,
        message: "fetchVacancyRecruitmentProcess Fetched successfully",
      };
    } catch (error) {
      console.error("Error fetchNewPositionRequest:", error);
      throw error;
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
    filterConditions: any,
    JobAppliedCountFilter?: string[],
    CurrentUser?: number[]
  ): Promise<ApiResponse<DataSyncToRecruitmentResponse[]>> {
    let GridResult: DataSyncToRecruitmentResponse[] = []
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        Select: `*,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title`,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: `Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: true,
      });

      if (res.length > 0) {
        GridResult = await Promise.all(
          res.map(async (item, index) => {
            let JobAppliedCount
            if (JobAppliedCountFilter) {
              let JobCodeFilter = [
                {
                  FilterKey: "JobCodeId",
                  Operator: "eq",
                  FilterValue: String(item?.JobCode?.ID),
                },
                { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
              ];
              let JobUniqueValue = await getVRRDetails.GetJobUniqueDataValue(
                JobCodeFilter,
                "and",
              );
              let FilterValue: FilterItem = {
                jobCode: JobUniqueValue?.data[0]?.JobUniqueKey,
                workflowStausId: JobAppliedCountFilter || [],
                pagination: {
                  filterValue: "",
                  sortBy: "",
                  sortOrder: 0,
                  pageSize: 10000,
                  currentPage: 0,
                  totalItems: 0,
                },
              };
              JobAppliedCount = await GetPortalJobsService.getCandidateDetailsInJobCode(FilterValue)

              if (JobAppliedCountFilter?.includes(workflowStatusApi.PendingRecruitmentHRscheduleInterview)) {
                const InterviewFilter = [
                  {
                    FilterKey: "RecruitmentIDId",
                    Operator: "eq",
                    FilterValue: String(item?.ID),
                  },
                  {
                    FilterKey: "JobCodeId",
                    Operator: "eq",
                    FilterValue: String(item?.JobCodeId),
                  },
                  {
                    FilterKey: "StatusId",
                    Operator: "in",
                    FilterValue: [
                      StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
                    ],
                  },
                  {
                    FilterKey: "ItemCreated",
                    Operator: "eq",
                    FilterValue: "No",
                  },
                ];

                const scorecardValue = await getVRRDetails.getReviewScoreCardCount(
                  InterviewFilter,
                  "and",
                );
                let InterviewPanel1 = Number(JobAppliedCount.data?.length)
                let InterviewPanel2 = Number(scorecardValue?.data)
                JobAppliedCount = InterviewPanel1 + InterviewPanel2
              } else {
                JobAppliedCount = JobAppliedCount.data?.length
              }
            }
            let scorecardValue: any
            if (CurrentUser && CurrentUser.includes(RoleID.HOD)) {
              const jobCodeFilter = [
                {
                  FilterKey: "RecruitmentIDId",
                  Operator: "eq",
                  FilterValue: String(item?.ID),
                },
                {
                  FilterKey: "JobCodeId",
                  Operator: "eq",
                  FilterValue: String(item?.JobCodeId),
                },
                {
                  FilterKey: "StatusId",
                  Operator: "in",
                  FilterValue: [
                    StatusId.PendingwithHODtoselectthecandidate,
                    StatusId.OnHoldbyHOD,
                    StatusId.PendingwithHODtoAssignPositionID,
                    StatusId.PendingwithHODtoselectthecandidateLevel2,
                    StatusId.CandidateOnHoldbyHODLevel1,
                    StatusId.CandidateOnHoldbyHODLevel2,
                  ],
                },
                {
                  FilterKey: "ItemCreated",
                  Operator: "eq",
                  FilterValue: "No",
                },
              ];

              let scoreValue = await getVRRDetails.getReviewScoreCardCount(
                jobCodeFilter,
                "and",
              );
              scorecardValue = scoreValue.data
            }



            let Recruitment: DataSyncToRecruitmentResponse = {
              ID: item.ID,
              RecordID: index + 1,
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
              Type: item?.DataFrom ?? "",
              Status: item?.Status ? item?.Status?.StatusDescription : "",
              StatusId: item?.StatusId,
              Action: item?.Action?.Action ? item?.Action?.Action : "",
              ActionTypeId: item?.ActionId ? item?.ActionId : "",
              Location: item?.Location || "",

              JobCodeId: item?.JobCode?.ID ? item?.JobCode?.ID : 0,
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
              AssignLineManager: item?.LineManager || "",
              AssignLineManagerId: item?.AssignLineManagerId || 0,
              ReasonForVacancy: item?.ReasonForVacancy || "",

              JobPostingStartDate: item?.JobPostingStartDate ? moment(item?.JobPostingStartDate).format("YYYY-MM-DD") : undefined,
              JobPostingEndDate: item?.JobPostingEndDate ? moment(item?.JobPostingEndDate).format("YYYY-MM-DD") : undefined,
              JobPostingFirstExtensionEndDate: item?.JobPostingFirstExtensionEndDate ? moment(item?.JobPostingFirstExtensionEndDate).format("YYYY-MM-DD") : undefined,
              JobPostingSecondExtensionEndDate: item?.JobPostingSecondExtensionEndDate ? moment(item?.JobPostingSecondExtensionEndDate).format("YYYY-MM-DD") : undefined,

              AssignEMail: item?.AssignedHR,
              AssignHOD: item?.HOD,
              AssignHRLead: item?.RecruitmentHRLead || "",

              QuestionByHR: item?.QuestionByHR || "",
              QuestionByLM: item?.QuestionByLM || "",
              JobAppliedCount: String(JobAppliedCount),
              ReviewScoreCount: scorecardValue
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
            const IntegretionData = {
              JobCodeId: RecruitmentValue.Data.JobCodeId,
              RecruitmentIDId: response?.data?.ID,
            };
            await SPServices.SPAddItem({
              Listname: ListNames.RecruitAppCareerPortalIntegration,
              RequestJSON: IntegretionData,
            });
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
      let Obj = {
        JoiningDate: param.JoiningDate,
        NoticePeriod: param.NoticePeriod,
      }
      let response: any = await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: Obj,
        ID: param.ID,
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
        Select: "*",
      });

      const levelProficiencyMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSLevelOfProficiency,
        Select: "*",
      });

      const technicalSkillsMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSTechnicalSkills,
        Select: "*",
      });

      const experienceMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSExperienceMaster,
        Select: "*",
      });

      const qualificationMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSQualification,
        Select: "*",
      });
      // console.log("Qualification", qualificationMaster);
      const functionTypeMaster: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSJobTitleFunctionType,
        Select: "*",
      });

      const roleKnowledgeMap = roleKnowledgeMaster.reduce((acc, item) => {
        acc[item.Code] = {
          en: item.RoleSpecificKnowledge,
          fr: item.RoleSpecificKnowledgeFrench,
        };
        return acc;
      }, {} as Record<string, string>);

      const levelProficiencyMap = levelProficiencyMaster.reduce((acc, item) => {
        acc[item.Code] = {
          en: item.Levels,
          fr: item.LevelsFrench,
        };
        return acc;
      }, {} as Record<string, string>);

      const technicalSkillsMap = technicalSkillsMaster.reduce((acc, item) => {
        acc[item.Code] = {
          en: item.TechnicalSkills,
          fr: item.TechnicalSkillsfrench,
        };
        return acc;
      }, {} as Record<string, string>);

      const qualificationMap = qualificationMaster.reduce((acc, item) => {
        acc[item.QualificationCode] = {
          en: item.Qualification,
          fr: item.QualificationFrench,
        };
        return acc;
      }, {} as Record<string, string>);

      const experienceMap = new Map(
        experienceMaster.map((exp) => [exp.ID, exp.ExperienceInYearRange])
      );

      const functionTypeMap = functionTypeMaster.reduce((acc, item) => {
        acc[item.ID] = {
          en: item.FunctionType,
          fr: item.FunctionTypeFrench
        }
        return acc;
      }, {} as Record<string, string>);

      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentRoleProfileDetails,
        Select:
          "*,JobDescription,RoleProfile,RoleSpecificKnowledgeJson,TechnicalSkillsKnowledgeJson,YearofExperience,PreferredExperience/ID,PreferredExperience/ExperienceInYearRange,Qualification,PreferredQualification,TotalPreferredExperience/ID,TotalPreferredExperience/ExperienceInYearRange,FunctionType/FunctionType, FunctionType/ID,FunctionType/FunctionTypeFrench,JobCode/JobCode",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: "PreferredExperience,TotalPreferredExperience,FunctionType,JobCode",
        Orderby: "ID",
        Orderbydecorasc: false,
      });
      const formattedItems = listItems.map((item) => {
        const roleKnowledgeArray: RoleSpecKnowledge[] = JSON.parse(
          item.RoleSpecificKnowledgeJson || "[]"
        );
        const techSkillsArray = JSON.parse(
          item.TechnicalSkillsKnowledgeJson || "[]"
        );
        let qualificationArray = JSON.parse(
          item.Qualification || "[]"
        );
        let PrefeQualification = JSON.parse(
          item.PreferredQualification || "[]"
        );

        const mergedQualifications = [
          ...qualificationArray,
          ...PrefeQualification,
        ];


        const RoleSpeKnowledge = roleKnowledgeArray.map((rk: any) => {
          const knowledge = roleKnowledgeMap[rk.RoleSpeKnowledge]; // RSK2 → { en, fr }
          const Level = levelProficiencyMap[rk.RequiredLevel];

          return {
            RoleSpeKnowledge: {
              key: rk.RoleSpeKnowledge,
              text: knowledge?.en ?? "",
            },
            RoleSpeKnowledge_fr: {
              key: rk.RoleSpeKnowledge,
              text: knowledge?.fr ?? "",
            },
            RequiredLevel: {
              key: rk.RequiredLevel,
              text: Level?.en ?? ""
            },
            RequiredLevel_fr: {
              key: rk.RequiredLevel,
              text: Level?.fr ?? ""
            },
          };
        });

        const TechnicalSkills = techSkillsArray.map((ts: any) => {
          const technical = technicalSkillsMap[ts.TechnicalSkills];
          const Level = levelProficiencyMap[ts.LevelProficiency];

          return {
            TechnicalSkills: {
              key: ts.TechnicalSkills,
              text: technical?.en ?? "",
            },
            TechnicalSkills_fr: {
              key: ts.TechnicalSkills,
              text: technical?.fr ?? "",
            },
            LevelProficiency: {
              key: ts.LevelProficiency,
              text: Level?.en ?? ""
            },
            LevelProficiency_fr: {
              key: ts.LevelProficiency,
              text: Level?.fr ?? ""
            },
          };
        });
        const Qualification = mergedQualifications.map((qu) => {
          const qualificationKey = qu.MinQualification ?? qu.PrefeQualification;
          const qualiValue = qualificationMap[qualificationKey ?? ""];

          if (qu.PrefeQualification) {
            return {
              PrefeQualification: {
                key: qualificationKey,
                text: qualiValue?.en ?? "",
              },
              PrefeQualification_fr: {
                key: qualificationKey,
                text: qualiValue?.fr ?? "",
              },
            };
          }

          return {
            MinQualification: {
              key: qualificationKey,
              text: qualiValue?.en ?? "",
            },
            MinQualification_fr: {
              key: qualificationKey,
              text: qualiValue?.fr ?? "",
            },
          };
        });
        const qualificationValue: QualificationValue = Qualification.reduce(
          (acc, item) => {
            if (item.MinQualification) {
              acc.MinQualification.push(item.MinQualification);
            }

            if (item.PrefeQualification) {
              acc.PrefeQualification.push(item.PrefeQualification);
            }

            if (item.MinQualification_fr) {
              acc.MinQualification_fr.push(item.MinQualification_fr);
            }

            if (item.PrefeQualification_fr) {
              acc.PrefeQualification_fr.push(item.PrefeQualification_fr);
            }

            return acc;
          },
          {
            MinQualification: [],
            PrefeQualification: [],
            MinQualification_fr: [],
            PrefeQualification_fr: [],
          } as QualificationValue
        );


        let functionType = functionTypeMap[item.FunctionType?.ID ?? ""];
        const AdvData = {
          ID: item.ID,
          RecruitmentID: item?.RecruitmentID?.ID || "",
          RolePurpose: item.RoleProfile || "",
          JobDescription: item.JobDescription || "",
          RolePurpose_fr: item.RoleProfileFrench || "",
          JobDescription_fr: item.JobDescriptionFrench || "",
          TotalExperience: { key: item.TotalPreferredExperience?.ID, text: experienceMap.get(item.TotalPreferredExperience?.ID) || "" },
          ExperienceinMiningIndustry: { key: item.PreferredExperience?.ID, text: experienceMap.get(item.PreferredExperience?.ID) || "" },
          RoleSpeKnowledgeValue: RoleSpeKnowledge,
          TechnicalSkillValue: TechnicalSkills,
          qualificationValue: qualificationValue,
          JobFunctionalType: { key: item.FunctionType?.ID, text: functionType?.en },
          JobFunctionalType_fr: { key: item.FunctionType?.ID, text: functionType?.fr },
          JobBasedBGVVerification: JSON.parse(item.JobBasedBGVVerification)
        }
        return AdvData;
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
    IsExtened: number,
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
        return { data: null, status: 400, message: "No data found" };
      }

      const data = res[0];
      const roleSpecificKnowledge = data.RoleSpecificKnowledgeJson
        ? JSON.parse(data.RoleSpecificKnowledgeJson)
        : [];
      const technicalSkill = data.TechnicalSkillsKnowledgeJson
        ? JSON.parse(data.TechnicalSkillsKnowledgeJson)
        : [];
      let JobCodeFilter = [
        { FilterKey: "JobCodeId", Operator: "eq", FilterValue: RecuritmentDetails.JobCodeId },
        { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
      ];

      let JobUniqueData = await SPServices.SPReadItems({
        Listname: ListNames.RecruitAppCareerPortalIntegration,
        Select: "*",
        Filter: JobCodeFilter,
        FilterCondition: "and",
        Orderby: "ID",
        Orderbydecorasc: true,
      })
      // console.log("JobUniqueKey", JobUniqueData);


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

      const DescriptionFr: Descriptions = {
        jobTitle: RecuritmentDetails.JobNameInFrench === undefined ? RecuritmentDetails.JobTitleFrench : RecuritmentDetails.JobNameInFrench,
        jobShortSummary: decodeBase64(data.RoleProfileFrench || ""),
        jobSummary: decodeBase64(data.JobDescriptionFrench || ""),
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
        jobCode: JobUniqueData[0].JobUniqueKey,   //RecuritmentDetails.JobCode,
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
        Descriptions_fr: DescriptionFr,
        RoleAndTechSkills: Roleandtechnical,
        MinAndPreferedQualifications: MinAndPreferedQualification,
        IsExtened: IsExtened
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
          const GetADGruopUserID = await CommonServices.GetMasterData(
            ListNames.HRMSRecruitmentUserRole
          );
          // console.log(GetADGruopUserID, "GetADGruopUserID");
          let ADGroupIDs = GetADGruopUserID.data?.filter(
            (item: any) => item.ID === RoleID.InterviewPanel
          );
          const interviewpanelOption = await CommonServices.GetADgruopsEmailIDs(
            ADGroupIDs[0]?.ADGroupID
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
              let UserName = await CommonServices.GetUserName(item.LineManager.EMail);
              panelMembers.push({
                key: item.LineManagerId,
                Role: RoleName.LineManager,
                text: String(UserName.data),
              });
            }
            if (item?.HODId && item?.HOD?.EMail) {
              let UserName = await CommonServices.GetUserName(item?.HOD?.EMail);
              panelMembers.push({
                key: item.HODId,
                Role: RoleName.HOD,
                text: String(UserName.data),
              });
            }
            if (item?.EXCOId && item?.EXCO?.EMail) {
              let UserName = await CommonServices.GetUserName(item?.EXCO?.EMail);
              panelMembers.push({
                key: item.EXCOId,
                Role: RoleName.EXCO,
                text: String(UserName.data),
              });
            }
            if (AssignHR) {
              let UserName = await CommonServices.GetUserName(AssignHR.text);
              panelMembers.push({
                key: AssignHR.key,
                Role: RoleName.RecruitmentHR,
                text: String(UserName.data),
              });
            }
          }
          let Get_InterviewPanel = await Promise.all(
            InterviewPanelDetails.data.map(async (item: any) => {
              let UserName = await CommonServices.GetUserName(item.InterviewPanel?.EMail);
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

  async GetcountInEvalution(
    CurrentUser: string,
    EmployeeList: any[]
  ): Promise<ApiResponse<any[]>> {

    let result: any[] = [];

    try {

      if (!CurrentUser) {
        return {
          data: [],
          status: 400,
          message: "Current user is required",
        };
      }

      if (!Array.isArray(EmployeeList)) {
        return {
          data: [],
          status: 400,
          message: "Employee list must be an array",
        };
      }

      const userResponse = await CommonServices.getUserGuidByEmail(CurrentUser);

      const panelUserId = userResponse?.data?.key;

      if (!panelUserId) {
        return {
          data: [],
          status: 404,
          message: "Current user panel ID not found",
        };
      }


      const statusFilters: any[] = [
        {
          FilterKey: "StatusId",
          Operator: "in",
          FilterValue: [
            StatusId.InterviewScheduled,
            StatusId.InterviewScheduledforLevel2,
          ],
        },
        {
          FilterKey: "ItemCreated",
          Operator: "eq",
          FilterValue: "No",
        },
      ];


      const statusResponse =
        await InterviewServices.GetCombinedCandidatePositionDetails(
          statusFilters,
          "and",
          EmployeeList
        );

      const candidates = Array.isArray(statusResponse?.data)
        ? statusResponse.data
        : [];

      if (candidates.length === 0) {
        return {
          data: [],
          status: 200,
          message: "No candidates found",
        };
      }

      const candidateIDs = candidates
        .map((c: any) => c?.ID)
        .filter(Boolean);


      const panelFilters: any[] = [
        {
          FilterKey: "InterviewPanelId",
          Operator: "eq",
          FilterValue: panelUserId,
        },
      ];

      if (candidateIDs.length > 0) {
        panelFilters.push({
          FilterKey: "CandidateID",
          Operator: "in",
          FilterValue: candidateIDs,
        });
      }


      const panelItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail, IsScoreSheetUploaded",
        Expand: "InterviewPanel,RecruitmentID,CandidateID",
        Filter: panelFilters,
      });


      const enrichedCandidates = await Promise.all(
        candidates.map(async (candidate: any) => {

          let grade = "";
          let level = "";
          let jobCodeId = 0;

          try {
            if (candidate?.RecruitmentID) {
              const vrrResponse =
                await getVRRDetails.GetRecruitmentDetails(
                  [
                    {
                      FilterKey: "ID",
                      Operator: "eq",
                      FilterValue: candidate.RecruitmentID,
                    },
                  ],
                  ""
                );

              const vrrData = vrrResponse?.data?.[0];

              if (vrrData) {
                grade = vrrData?.PatersonGrade || "";
                jobCodeId = vrrData?.JobCodeId || 0;

                if (grade) {
                  const gradeLevelResponse =
                    await CommonServices.GetGradeLevel(grade);
                  level = gradeLevelResponse?.data?.[0]?.Level || "";
                }
              }
            }
          } catch (err) {
            console.warn(
              "Grade/Level fetch failed for candidate:",
              candidate?.ID,
              err
            );
          }


          const interviewDate =
            candidate?.InterviewDateLevel2 || candidate?.InterviewDate || "";

          // const interviewTime =
          //   candidate?.InterviewTimeLevel2 || candidate?.InterviewTime || "";

          // const interviewDateTime =
          //   interviewDate && interviewTime
          //     ? moment(
          //       `${interviewDate} ${interviewTime}`,
          //       "YYYY-MM-DD HH:mm"
          //     ).format("DD-MMM-YYYY hh:mm A")
          //     : "";

          const interviewDateTime = moment(interviewDate).format("YYYY-MM-DD");


          return {
            SNO: candidate?.SNO ?? "",
            ID: candidate?.ID ?? 0,
            FirstName: candidate?.FristName ?? "",
            LastName: candidate?.LastName ?? "",
            ApplicantName: `${candidate?.FristName ?? ""} ${candidate?.LastName ?? ""}`.trim(),
            PositionTitle: candidate?.PositionTitle ?? "",
            JobGrade: candidate?.JobGrade ?? "",
            Grade: grade,
            InterviewLevel:
              level === InterviewLevels.Level2
                ? InterviewLevels.Levels2
                : level,
            Status: candidate?.Status ?? "",
            StatusId: candidate?.StatusId ?? "",
            RecruitmentID: candidate?.RecruitmentID ?? 0,
            InterviewDateTime: interviewDateTime,
            JobCodeID: jobCodeId,
          };
        })
      );


      result = enrichedCandidates.filter((candidate) => {
        return panelItems.some((panel) => {
          if (
            candidate.StatusId === StatusId.InterviewScheduled &&
            panel.InterviewLevel === InterviewLevels.Level1
          ) {
            return true;
          }

          if (
            candidate.StatusId === StatusId.InterviewScheduledforLevel2 &&
            panel.InterviewLevel === InterviewLevels.Level2
          ) {
            return true;
          }

          return false;
        });
      });


      return {
        data: result,
        status: 200,
        message: "Evaluation count fetched successfully",
      };

    } catch (error) {
      console.error("GetcountInEvalution failed:", error);

      return {
        data: [],
        status: 500,
        message: "Failed to fetch evaluation count",
      };
    }
  }


  async GetADGroupUsers(
    RoleEmail: string,
    Role: string
  ): Promise<ApiResponse<{ Key: string; Value: string }>> {
    try {
      let AdGroupUser = await CommonServices.GetUserName(RoleEmail);
      return {
        data: {
          Key: Role,
          Value: AdGroupUser.data || "No users found"
        },
        status: 200,
        message: "GetADGroupUsers Fetched successfully"
      };
    } catch (err) {
      console.log("Error in GetADGroupUsers:", err);
      return {
        data: {
          Key: Role,
          Value: "Unable to fetch users"
        },
        status: 500,
        message: "Error occurred while fetching user list"
      };
    }
  }

  async GetInterviewPanelTooltiData(
    data: DataSyncToRecruitmentResponse,
  ): Promise<ApiResponse<tooltipInterviewPanel[] | null>> {
    let GetItem: tooltipInterviewPanel[] = [{} as tooltipInterviewPanel];
    try {
      await SPServices.SPReadItems({
        Listname: ListNames.JDEDataMapping,
        Select: "*,BUC/BusineesUnitCode,LineManager/EMail,HOD/EMail,HR/EMail,EXCO/EMail",
        Filter: [{
          FilterKey: "BUC",
          Operator: "eq",
          FilterValue: data.BusinessUnitCodeId
        }],
        Expand: "BUC,LineManager,HOD,HR,EXCO",
        Orderby: "ID",
        Orderbydecorasc: true,
      })
        .then(async (res) => {
          // console.log(res, "res");
          for (const item of res) {
            if (item?.LineManagerId && item?.LineManager?.EMail) {
              let UserName = await CommonServices.GetUserName(item.LineManager.EMail);
              let LineManager = {
                Role: RoleName.LineManager,
                Name: String(UserName.data)
              }
              GetItem[0].LineManager = LineManager;
            }
            if (item?.HODId && item?.HOD?.EMail) {
              let UserName = await CommonServices.GetUserName(item?.HOD?.EMail);
              let HOD = {
                Role: RoleName.HOD,
                Name: String(UserName.data)
              }
              GetItem[0].HOD = HOD;
            }
            if (item?.EXCOId && item?.EXCO?.EMail) {
              // let UserName = await GetUserName(item?.EXCO?.EMail);
              // panelMembers.push({
              //   key: item.EXCOId,
              //   Role: RoleName.EXCO,
              //   text: String(UserName.data),
              // });
              let UserName = await CommonServices.GetUserName(item?.EXCO?.EMail);
              let EXCO = {
                Role: RoleName.EXCO,
                Name: String(UserName.data)
              }
              GetItem[0].Exco = EXCO;
            }
            if (data.AssignEMail) {
              let UserName = await CommonServices.GetUserName(data.AssignEMail);
              let HR = {
                Role: RoleName.RecruitmentHR,
                Name: String(UserName.data)
              }
              GetItem[0].HR = HR;
            }
          }
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

  async GetEvalutionActionData(
    filterConditions: any,
  ): Promise<ApiResponse<any[]>> {
    let GetItem: any[] = []
    try {
      await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail,IsScoreSheetUploaded",
        Expand: "InterviewPanel,RecruitmentID,CandidateID",
        Filter: filterConditions,
        FilterCondition: "and"
      }).then(async (res) => {
        for (const item of res) {
          let UserName = await CommonServices.GetUserName(item.InterviewPanel.EMail)
          let ActionValues = {
            Key: String(UserName.data),
            Value: item?.IsScoreSheetUploaded === "Yes" ? ActionName.Completed : ActionName.Pending
          }
          GetItem.push(ActionValues)
        }
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
      console.error("Error fetching interview panel details:", error);
      return {
        data: [],
        status: 400,
        message: "Error fetching data",
      };
    }
  }

  async GetJobUniqueDataValue(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<GetJobUniqueKey[]>> {
    let GridResult: GetJobUniqueKey[] = []
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.RecruitAppCareerPortalIntegration,
        Select: `*,JobCode/JobCode`,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: `JobCode`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: true,
      });
      if (res.length > 0) {
        GridResult = await Promise.all(
          res.map((item) => {
            let JobUniqueData: GetJobUniqueKey = {
              JobCode: item?.JobCode?.JobCode || "",
              JobUniqueKey: item?.JobUniqueKey || "",
              IsActive: item?.IsActive || "",
            };
            return JobUniqueData;

          })
        );
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

  async GetPositionIDData(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any[]>> {
    let GetItem: any[] = []
    try {
      await SPServices.SPReadItems({
        Listname: ListNames.HRMSPositionIDMaster,
        Select: "*,JobCode/JobCode,Department/DepartmentName",
        Expand: "JobCode,Department",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: 100,
      })
        .then((res: any[]) => {
          for (const item of res) {
            let ActionValues = {
              Key: String(item.PositionID),
              Value: item.PositionIDStatus //=== PositionStatus.Vacant ? ActionName.Pending : ActionName.Completed
            }
            GetItem.push(ActionValues)
          }
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
      console.error("Error fetching interview panel details:", error);
      return {
        data: [],
        status: 400,
        message: "Error fetching data",
      };
    }
  }

  async GetAssignAgentDetail(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<any[]>> {
    let GetItem: any[] = []
    try {
      await SPServices.SPReadItems({
        Listname: ListNames.HRMSExternalAgentsDetailsForRecruitment,
        Select: "*,ExternalAgentDetails/ID,RecruitmentID/ID,ExternalAgentDetails/AgentCode,ExternalAgentDetails/AgentName",
        Expand: "ExternalAgentDetails,RecruitmentID",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: 100,
      })
        .then((res: any[]) => {
          for (const item of res) {
            let ActionValues = {
              RecrutimentID: item.RecruitmentID?.ID,
              AgentName: item.ExternalAgentDetails?.AgentName,
              AgentCode: item.ExternalAgentDetails?.AgentCode,
            }
            GetItem.push(ActionValues)
          }
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
      console.error("Error fetching interview panel details:", error);
      return {
        data: [],
        status: 400,
        message: "Error fetching data",
      };
    }
  }

  async GetCareerPortalIntergLink(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<string>> {
    let GridResult: string = ""
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.RecruitmentCareerPortalLink,
        Select: `*`,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });
      if (res.length > 0) {
        //  = await Promise.all(
        res.map((item) => {
          GridResult = item?.CareerPortalLink;
          return item?.CareerPortalLink;
        })
        // );
      }
      return {
        data: GridResult,
        status: 200,
        message: "GetRecruitmentDetails fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching data in GetRecruitmentDetails:", error);
      return {
        data: "",
        status: 500,
        message: "Error fetching data from GetRecruitmentDetails",
      };
    }
  }

  async getReviewScoreCardCount(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<string>> {
    let GridResult: string = "0"
    try {
      const res = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: `*`,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });
      if (res.length > 0) {
        //  = await Promise.all(
        GridResult = String(res.length);

        // );
      }
      return {
        data: GridResult,
        status: 200,
        message: "GetRecruitmentDetails fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching data in GetRecruitmentDetails:", error);
      return {
        data: "",
        status: 500,
        message: "Error fetching data from GetRecruitmentDetails",
      };
    }
  }
}