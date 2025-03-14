import { CandidateData } from "../../Models/RecuritmentVRR";
import { AutoCompleteItem, InterviewPanaldata } from "../../Models/Screens";
import { count, DocumentLibraray, ListNames } from "../../utilities/Config";
import { CommonServices } from "../ServiceExport";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import {
  ActionUpdate,
  AssignPositionID,
  CommentsDatas,
  IInterviewProcessService,
} from "./IInterviewProcessService";

export default class InterviewProcessService
  implements IInterviewProcessService
{
  async GetInterviewPanelDetails(
    filterConditions: any[] = []
  ): Promise<ApiResponse<InterviewPanaldata[]>> {
    let InterviewPanelDetails: InterviewPanaldata[] = [];

    try {
      let listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID, CandidateIDId, RecruitmentIDId, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail",
        Expand: "InterviewPanel",
        Filter: filterConditions,
      });

      const panelEmails = listItems
        .map((interview) => interview.InterviewPanel?.EMail)
        .filter((email) => email);

      let emailToAuthorMap: Record<string, string> = {};

      if (panelEmails.length > 0) {
        const sageListItems: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSSageList,
          Select: "EmailId,FirstName,LastName",
          FilterCondition: [
            {
              FilterKey: "EmailId",
              Operator: "in",
              FilterValue: panelEmails.join(","),
            },
          ],
        });

        emailToAuthorMap = sageListItems.reduce((acc, item) => {
          acc[item.EmailId] = `${item.FirstName} `;
          return acc;
        }, {});
      }
      InterviewPanelDetails = listItems.map((objresult: any) => {
        const panelEmail = objresult.InterviewPanel?.EMail || "N/A";
        const authorName = emailToAuthorMap[panelEmail] || "Unknown";

        return {
          ID: objresult.ID,
          CandidateID: objresult.CandidateIDId,
          RecruitmentID: objresult.RecruitmentIDId,
          InterviewLevel: objresult.InterviewLevel,
          InterviewPanel: objresult.InterviewPanel
            ? objresult.InterviewPanel.Id
            : 0,
          InterviewPanelTitle: authorName,
          InterviewPanalNames: objresult.InterviewPanel
            ? [objresult.InterviewPanel.Title]
            : [],
        };
      });

      return {
        data: InterviewPanelDetails,
        status: 200,
        message: "Interview Panel Details fetched successfully",
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
  async GetCandidateDetailsInterviewPanalDashboard(
    filterParam: any,
    filterConditions: any
  ) {
    try {
      const CandidateDetails: CandidateData[] = [];

      const candidateItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: "*,Status/ID,Status/StatusDescription",
        Expand: "Status",
        Filter: `${filterParam} and Status/StatusDescription eq 'Interview Scheduled'`,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      const formattedItems: CandidateData[] = candidateItems.map((item) => ({
        ID: item.ID,
        JobCode: item?.JobCode?.JobCode || "",
        JobCodeId: item?.JobCodeId || "",
        PassportID: item?.PassportID || "",
        FristName: item?.FristName || "",
        MiddleName: item?.MiddleName || "",
        LastName: item?.LastName || "",
        FullName: `${item?.FristName ?? ""} ${item?.MiddleName ?? ""} ${
          item?.LastName ?? ""
        }`.trim(),
        PositionTitle: item?.PositionTitle || "",
        JobGrade: item?.JobGrade || "",
        Status: item?.Status?.StatusDescription || "",
        ContactNumber: item?.ContactNumber || "",
        Email: item?.Email || "",
        ResidentialAddress: item?.ResidentialAddress || "",
        DOB: item?.DOB || "",
        Nationality: item?.Nationality || "",
        Gender: item?.Gender || "",
        TotalYearOfExperiance: item?.TotalYearOfExperiance || "",
        Skills: item?.Skills || "",
        LanguageKnown: item?.LanguageKnown || "",
        ReleventExperience: item?.ReleventExperience || "",
        Qualification: item?.Qualification || "",
        RecuritmentHR: item?.RecuritmentHR || "",
        AssignByInterviewPanel: item?.AssignByInterviewPanel?.EMail || "",
        CandidateCVDoc: [],
        RoleProfileDocument: [],
        AdvertisementDocument: [],
        ShortlistedValue: "",
        ExternalAgentDetails: item?.ExternalAgentDetails
          ? { AgentName: item?.ExternalAgentDetails?.AgentName }
          : null,
      }));

      CandidateDetails.push(...formattedItems);

      return {
        data: CandidateDetails,
        status: 200,
        message:
          "Filtered Candidates with Interview Scheduled status fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching candidate details",
      };
    }
  }

  async HRMSCandidateScoreCard(
    filterParam: any,
    filterConditions: any,
    candidateID: number
  ): Promise<ApiResponse<any | null>> {
    try {
      let CommentsData: CommentsDatas[] = [];

      const interviewPanelItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Title,InterviewPanel/ID,CandidateID/ID,InterviewPanel/EMail",
        Expand: "RecruitmentID,InterviewPanel,CandidateID",
        Orderby: "ID",
        Orderbydecorasc: false,
        Filter: filterParam,
        FilterCondition: filterConditions,
      });

      const candidateScoreCardItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateScoreCard,
        Select:
          "InterviewPanelID/ID,RelevantQualification,ReleventExperience,Knowledge,EnergyLevel,MeetJobRequirement,ContributeTowardsCultureRequried,Experience,OtherCriteriaScore,ConsiderForEmployment,Feedback,RecruitmentID/ID,Role/RoleTitle,InterviewPersonName/Title,OverAllEvaluationFeedback,Created",
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

      const panelEmails = interviewPanelItems
        .map((interview) => interview.InterviewPanel?.EMail)
        .filter((email) => email);

      let emailToAuthorMap: Record<string, any> = {};

      if (panelEmails.length > 0) {
        const sageListItems: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSSageList,
          Select:
            "EmailId,FirstName,LastName,MiddleName,Title,HomeAddress,ContactNumber,Department/DepartmentName,BusinessUnit/Title,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench,DRCGrade/Title,PatersonGrade/Title",
          Expand:
            "Department,BusinessUnit,JobTitleInEnglish,JobTitleInFrench,DRCGrade,PatersonGrade",
          FilterCondition: [
            {
              FilterKey: "EmailId",
              Operator: "in",
              FilterValue: panelEmails.join(","),
            },
          ],
        });

        emailToAuthorMap = sageListItems.reduce((acc, item) => {
          acc[item.EmailId] = {
            FullName: `${item.FirstName}`.trim(),
            Department: item.Department?.DepartmentName || "",
            JobTitleInEnglish: item.JobTitleInEnglish || "",
            JobTitleInFrench: item.JobTitleInFrench || "",
          };
          return acc;
        }, {});
      }

      const formattedItems = interviewPanelItems.map((interview) => {
        const relatedScores = candidateScoreCardItems.filter(
          (score) => score?.InterviewPanelID?.ID === interview?.ID
        );

        const panelEmail = interview.InterviewPanel?.EMail || "N/A";
        const panelDetails = emailToAuthorMap[panelEmail] || {
          FullName: "Unknown",
          Title: "",
          Department: "",
          JobTitleInEnglish: "",
          JobTitleInFrench: "",
        };

        const formattedItem: CommentsDatas = {
          Id: interview.ID.toString(),
          JobTitleInEnglish: panelDetails.JobTitleInEnglish || "",
          JobTitleInFrench: panelDetails.JobTitleInFrench || "",
          comments: "",
          Department: panelDetails.Department || "",
          Date: panelDetails.CreatedDate,
          JobTitle: panelDetails.Title || "",
          Name: panelDetails.FullName,
          ID: interview.ID,
          RecruitmentID: interview?.RecruitmentID?.ID || 0,
          InterviewLevel: interview.InterviewLevel || "",
          InterviewPanelTitle: [panelDetails.FullName],
          CandidateID: interview.CandidateID?.ID || 0,
          CandidateScoreCard: relatedScores.map((score) => ({
            InterviewPanelID: score.InterviewPanelID?.ID || 0,
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
            RecruitmentID: score.RecruitmentID?.ID || 0,
            Role: score.Role?.Title || "",
            InterviewPersonName: score.InterviewPersonName?.Title || "",
            OverAllEvaluationFeedback: score.OverAllEvaluationFeedback || "",
            CreatedDate: score.Created
              ? new Date(score.Created).toLocaleString()
              : "N/A",
          })),

          Role:
            relatedScores.length > 0
              ? relatedScores[0].Role?.RoleTitle || "No Role"
              : "No Role",
        };

        CommentsData.push(formattedItem);
        return formattedItem;
      });
      console.log("formattedItemsHOD", formattedItems);
      return {
        data: formattedItems,
        status: 200,
        message:
          "HRMSInterviewPanelDetails and HRMSCandidateScoreCard fetched successfully",
      };
    } catch (error) {
      console.error("", error);
      return {
        data: [],
        status: 500,
        message:
          "Error fetching data from HRMSInterviewPanelDetails and HRMSCandidateScoreCard",
      };
    }
  }

  async GetCombinedCandidatePositionDetails(
    filterParam: any,
    filterConditions: any
  ) {
    try {
      const CandidateDetails: CandidateData[] = [];
      const candidateItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:
          "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,ExternalAgentDetails/AgentCode,ExternalAgentDetails/AgentName,Status/ID,Status/StatusDescription,ID",
        Expand:
          "JobCode,AssignByInterviewPanel,RecruitmentID,ExternalAgentDetails,Status",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      const positionItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails,
        Select:
          "ID,IsPositionIDAssigned,JobTitleEnglish/JobTitleInEnglish,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,RecruitmentID/ID,PositionID/PositionID,AssignLineManager/EMail,JobTitleFrench/JobTitleInFrench,AssignHOD/EMail",
        Expand:
          "JobTitleEnglish,PatersonGrade,DRCGrade,RecruitmentID,PositionID,AssignLineManager,JobTitleFrench,AssignHOD",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      const positionsByRecruitment = positionItems.reduce(
        (acc: any, position) => {
          const recruitmentID = position?.RecruitmentID?.ID;
          if (!acc[recruitmentID]) {
            acc[recruitmentID] = [];
          }
          acc[recruitmentID].push(position);
          return acc;
        },
        {}
      );

      const formattedItems = await Promise.all(
        candidateItems.map(async (item) => {
          const response = await CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.InterviewPanelCandidateCV,
            item.JobCode?.JobCode,
            item?.PassportID
          );
          let candidateCV: IDocFiles[] = [];
          if (response.status === 200 && response.data) {
            candidateCV = response.data;
          } else {
            console.error("", response.message);
          }

          const positionData =
            positionsByRecruitment[item?.RecruitmentID?.ID] || [];

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
            Status: item?.Status?.StatusDescription || "",
            PositionData: positionData.map(
              (position: {
                ID: number;
                PositionID: { PositionID: any };
                JobTitleEnglish: { JobTitleInEnglish: any };
                PatersonGrade: { PatersonGrade: any };
                DRCGrade: { DRCGrade: any };
                JobTitleFrench: { JobTitleInFrench: any };
                AssignLineManager: { EMail: any };
                AssignHOD: { EMail: any };
                RecruitmentID: { ID: any };
                IsPositionIDAssigned: { IsPositionIDAssigned: any };
              }) => ({
                ID: position?.ID ?? "N/A", //
                IsPositionIDAssigned: position?.IsPositionIDAssigned ?? "",
                PositionID: position?.PositionID?.PositionID || "",
                RecruitmentID: position?.RecruitmentID?.ID || "",
                PositionTitles:
                  position?.JobTitleEnglish?.JobTitleInEnglish || "",
                JobGrade: position?.PatersonGrade?.PatersonGrade || "",
                DRCGrade: position?.DRCGrade?.DRCGrade || "",
                JobTitleFrench:
                  position?.JobTitleFrench?.JobTitleInFrench || "",
                AssignLineManagerEmail:
                  position?.AssignLineManager?.EMail || "",
                AssignHODEmail: position?.AssignHOD?.EMail || "",
              })
            ),
            RoleProfileDocument: [],
            AdvertisementDocument: [],
            ShortlistedValue: "",
            PositionTitle: item.PositionTitle,
            JobGrade: item.JobGrade,
            ExternalAgentDetails: item?.ExternalAgentDetails
              ? {
                  AgentName: item?.ExternalAgentDetails?.AgentName,
                }
              : null,
          };
        })
      );

      CandidateDetails.push(...formattedItems);
      console.log("CandidateDetails", CandidateDetails);
      return {
        data: CandidateDetails,
        status: 200,
        message:
          "Combined Candidate, Position, and External Agent Details fetched successfully",
      };
    } catch (error) {
      console.error("", error);
      return {
        data: [],
        status: 500,
        message:
          "Error fetching combined data from Candidate, Position, and External Agent Details",
      };
    }
  }

  async GetPositionDetails(filterParam: any, filterConditions: any) {
    try {
      const positionItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails,
        Select: [
          "ID",
          "PositionID/PositionID",
          "RecruitmentID/ID",
          "IsPositionIDAssigned",
        ].join(","),
        Expand: "RecruitmentID,PositionID",
        Filter: filterParam,
        FilterCondition: [
          ...filterConditions,
          {
            FilterKey: "IsPositionIDAssigned",
            Operator: "eq",
            FilterValue: "No",
          },
        ],
        Topcount: count.Topcount,
      });

      if (!positionItems.length) {
        return [];
      }

      const formattedData = positionItems.map((item) => ({
        ID: item.ID,
        PositionID: item.PositionID?.PositionID || "",

        RecruitmentID: item.RecruitmentID?.ID || "",

        IsPositionIDAssigned: item.IsPositionIDAssigned || "",
      }));

      console.log("PositionDataAPI:", formattedData);

      const positionOptions: AutoCompleteItem[] = formattedData.map(
        (pos: any) => ({
          key: pos.ID,
          text: pos.PositionID,
        })
      );
      return positionOptions;
    } catch (error) {
      console.error("Error in GetPositionDetails:", error);
      return [];
    }
  }

  async CandidateSeletionApi(
    obj: ActionUpdate,
    ListName: string
  ): Promise<ApiResponse<null>> {
    try {
      await SPServices.SPUpdateItem({
        Listname: ListName,
        RequestJSON: obj,
        ID: obj.Id,
      });

      return {
        data: null,
        status: 200,
        message: "Data Submitted successfully",
      };
    } catch (error) {
      console.error("", error);
      return {
        data: null,
        status: 400,
        message: "Error On Posting Data",
      };
    }
  }

  async AssignPositionID(
    obj: AssignPositionID,
    ListName: string
  ): Promise<ApiResponse<null>> {
    try {
      await SPServices.SPAddItem({
        Listname: ListName,
        RequestJSON: obj,
      });

      return {
        data: null,
        status: 200,
        message: "Data Submitted successfully",
      };
    } catch (error) {
      console.error("", error);
      return {
        data: null,
        status: 400,
        message: "Error On Posting Data",
      };
    }
  }
}
