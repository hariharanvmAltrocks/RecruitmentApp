import { CandidateData } from "../../Models/RecuritmentVRR";
import { InterviewPanaldata } from "../../Models/Screens";
import { count, DocumentLibraray, ListNames } from "../../utilities/Config";
import { CommonServices } from "../ServiceExport";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import {
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
      let listItems: any = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID, CandidateIDId, RecruitmentIDId, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title",
        Expand: "InterviewPanel",
        Filter: filterConditions,
      });

      InterviewPanelDetails = listItems.map((objresult: any) => ({
        ID: objresult.ID,
        CandidateID: objresult.CandidateIDId,
        RecruitmentID: objresult.RecruitmentIDId,
        InterviewLevel: objresult.InterviewLevel,
        InterviewPanel:
          objresult.InterviewPanel && objresult.InterviewPanel.length > 0
            ? objresult.InterviewPanel.map((panel: any) => panel.Id)
            : [],
        InterviewPanelTitle:
          objresult.InterviewPanel && objresult.InterviewPanel.length > 0
            ? objresult.InterviewPanel.map((panel: any) => panel.Title).join(
                ", "
              )
            : "N/A",
        InterviewPanalNames:
          objresult.InterviewPanel && objresult.InterviewPanel.length > 0
            ? objresult.InterviewPanel.map((panel: any) => panel.Title)
            : [],
      }));

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

  async GetMergedData(
    EmployeeList: any[],
    Conditions: string,
    filterConditions: any,
    filterParam: any,
    candidateID: number
  ): Promise<ApiResponse<any>> {
    try {
      let CommentsData: CommentsDatas[] = [];
      const interviewPanelItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Title,InterviewPanel/ID,CandidateID/ID,Author/EMail,Author/Title",
        Expand: "RecruitmentID,InterviewPanel,CandidateID,Author",
        Orderby: "ID",
        Orderbydecorasc: false,
        Filter: filterParam,
        FilterCondition: filterConditions,
      });

      // Fetch candidate scorecard details
      const candidateScoreCardItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateScoreCard,
        Select:
          "InterviewPanelID/ID,RelevantQualification,ReleventExperience,Knowledge,EnergyLevel,MeetJobRequirement,ContributeTowardsCultureRequried,Experience,OtherCriteriaScore,ConsiderForEmployment,Feedback,RecruitmentID/ID,Role/RoleTitle,InterviewPersonName/Title,OverAllEvaluationFeedback",
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

      const formattedItems = interviewPanelItems.map((interview) => {
        const Email = interview.Author?.EMail.toLowerCase();
        const Employee = EmployeeList.find(
          (options: any) => options.Email?.toLowerCase() === Email
        );

        const relatedScores = candidateScoreCardItems.filter(
          (score) => score?.InterviewPanelID?.ID === interview?.ID
        );

        const formattedItem = {
          Id: interview.ApprovedID ? interview.ApprovedID.ID : "",
          JobTitleInEnglish: Employee ? Employee.JobTitle : "",
          JobTitleInFrench: Employee ? Employee.JobTitleInFrench : "",
          comments: interview.Comments || "",
          Department: interview.Department
            ? interview.Department.DepartmentName
            : "",
          Date: interview.Created ? new Date(interview.Created) : null,
          JobTitle: interview.JobTitle || "",
          Name: Employee
            ? `${Employee.FirstName ?? ""} ${Employee.MiddleName ?? ""} ${
                Employee.LastName ?? ""
              }`.trim()
            : "",
          ID: interview.ID,
          RecruitmentID: interview?.RecruitmentID?.ID || "",
          InterviewLevel: interview.InterviewLevel || "",
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
            Role: score.Role?.RoleTitle || "",
            RoleName:
              relatedScores.length > 0
                ? relatedScores[0].Role?.RoleTitle
                : "No Role",
            InterviewPersonName: score.InterviewPersonName?.Title || "",
            OverAllEvaluationFeedback: score.OverAllEvaluationFeedback || "",
          })),
          Role:
            relatedScores.length > 0
              ? relatedScores[0].Role?.RoleTitle || "No Role"
              : "No Role",
        };

        CommentsData.push(formattedItem);
        return formattedItem;
      });

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

  //
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
          RoleProfileDocument: [],
          AdvertisementDocument: [],
          ShortlistedValue: "",
        };
      });

      const resolvedItems = await Promise.all(formattedItems);

      CandidateDetails.push(...resolvedItems);

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
  async GetRecrutimentPositionDetails(filterParam: any, filterConditions: any) {
    try {
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails,
        Select:
          "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench,RecruitmentID/ID,PositionID/PositionID",
        Filter: filterParam,
        Expand: "JobTitleEnglish,DRCGrade,PatersonGrade,JobTitleFrench",
        Topcount: count.Topcount,
      });

      const formattedItems = {
        LookupId: listItems[0]?.ID,
        JobTitleInEnglishId: listItems[0]?.JobTitleEnglishId || 0,
        JobTitleInEnglish:
          listItems[0]?.JobTitleEnglish?.JobTitleInEnglish || "",
        JobTitleInFrench: listItems[0]?.JobTitleFrench?.JobTitleInFrench || 0,
        DRCGradeId: listItems[0]?.DRCGradeId,
        DRCGrade: listItems[0]?.DRCGrade?.DRCGrade || "",
        PayrollGradeId: listItems[0]?.PatersonGradeId,
        PayrollGrade: listItems[0]?.PatersonGrade?.PatersonGrade || "",
        RecruitmentIDId: listItems[0]?.RecruitmentID,
        PositionIDId: listItems[0]?.PositionID,
      };

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

  async GetPositionDetails(filterParam: any, filterConditions: any) {
    try {
      const positionDetails: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails,
        Select:
          "JobTitleEnglish/JobTitleInEnglish,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,RecruitmentID/ID,PositionID/PositionID,AssignLineManager/EMail,JobTitleFrench/JobTitleInFrench,AssignHOD/EMail",
        Expand:
          "JobTitleEnglish,PatersonGrade,DRCGrade,RecruitmentID,PositionID,AssignLineManager,JobTitleFrench,AssignHOD",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      const formattedItems = positionDetails.map((position) => {
        return {
          RecruitmentID: position?.RecruitmentID?.ID,
          PositionID: position?.PositionID?.ID,
          JobTitleInEnglish: position?.JobTitleEnglish?.JobTitleInEnglish || "",
          PatersonGrade: position?.PatersonGrade?.PatersonGrade || "",
          DRCGrade: position?.DRCGrade?.DRCGrade || "",
          JobTitleInFrench: position?.JobTitleFrench?.JobTitleInFrench || "",
          AssignLineManagerEmail: position?.AssignLineManager?.EMail || "",
          AssignHODEmail: position?.AssignHOD?.EMail || "",
        };
      });

      return {
        data: formattedItems,
        status: 200,
        message: "Position Details fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching position details:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching data from Position Details",
      };
    }
  }

  // async GetCombinedCandidatePositionDetails(
  //   filterParam: any,
  //   filterConditions: any
  // ) {
  //   try {
  //     // Step 1: Fetching Candidate Details
  //     const CandidateDetails: CandidateData[] = [];
  //     const candidateItems: any[] = await SPServices.SPReadItems({
  //       Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
  //       Select:
  //         "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID",
  //       Expand: "JobCode,AssignByInterviewPanel,RecruitmentID",
  //       Filter: filterParam,
  //       FilterCondition: filterConditions,
  //       Topcount: count.Topcount,
  //     });

  //     // Step 2: Fetching Position Details
  //     const positionItems: any[] = await SPServices.SPReadItems({
  //       Listname: ListNames.HRMSRecruitmentPositionDetails,
  //       Select:
  //         "JobTitleEnglish/JobTitleInEnglish,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,RecruitmentID/ID,PositionID/PositionID,AssignLineManager/EMail,JobTitleFrench/JobTitleInFrench,AssignHOD/EMail",
  //       Expand:
  //         "JobTitleEnglish,PatersonGrade,DRCGrade,RecruitmentID,PositionID,AssignLineManager,JobTitleFrench,AssignHOD",
  //       Filter: filterParam,
  //       FilterCondition: filterConditions,
  //       Topcount: count.Topcount,
  //     });
  //     console.log("positionItems", positionItems);
  //     // Step 3: Combining Candidate and Position Data
  //     const formattedItems = await Promise.all(
  //       candidateItems.map(async (item) => {
  //         // Fetching attachments (CV) for candidate
  //         const response = await CommonServices.GetAttachmentToLibrary(
  //           DocumentLibraray.InterviewPanelCandidateCV,
  //           item.JobCode?.JobCode,
  //           item?.PassportID
  //         );
  //         let candidateCV: IDocFiles[] = [];
  //         if (response.status === 200 && response.data) {
  //           candidateCV = response.data;
  //         } else {
  //           console.error("Error retrieving attachments:", response.message);
  //         }

  //         // Fetching position data for the candidate
  //         const positionData = positionItems.find(
  //           (position) =>
  //             position?.RecruitmentID?.ID === item?.RecruitmentID?.ID
  //         );

  //         // Returning the combined data with missing properties
  //         return {
  //           ID: item.ID,
  //           RecruitmentID: item?.RecruitmentID?.ID,
  //           JobCode: item?.JobCode?.JobCode,
  //           JobCodeId: item?.JobCodeId,
  //           PassportID: item?.PassportID,
  //           FristName: item?.FristName,
  //           MiddleName: item?.MiddleName,
  //           LastName: item?.LastName,
  //           FullName:
  //             (item?.FristName ?? "") +
  //             " " +
  //             (item?.MiddleName ?? "") +
  //             " " +
  //             (item?.LastName ?? ""),
  //           ResidentialAddress: item?.ResidentialAddress,
  //           DOB: item?.DOB,
  //           ContactNumber: item?.ContactNumber,
  //           Email: item?.Email,
  //           Nationality: item?.Nationality,
  //           Gender: item?.Gender,
  //           TotalYearOfExperiance: item?.TotalYearOfExperiance,
  //           Skills: item?.Skills,
  //           LanguageKnown: item?.LanguageKnown,
  //           ReleventExperience: item?.ReleventExperience,
  //           Qualification: item?.Qualification,
  //           RecuritmentHR: item?.RecuritmentHR,
  //           AssignByInterviewPanel: item?.AssignByInterviewPanel?.EMail,
  //           CandidateCVDoc: candidateCV,
  //           PositionTitle:
  //             positionData?.JobTitleEnglish?.JobTitleInEnglish || "",
  //           JobGrade: positionData?.PatersonGrade?.PatersonGrade || "",
  //           DRCGrade: positionData?.DRCGrade?.DRCGrade || "",
  //           JobTitleFrench:
  //             positionData?.JobTitleFrench?.JobTitleInFrench || "",
  //           AssignLineManagerEmail:
  //             positionData?.AssignLineManager?.EMail || "",
  //           AssignHODEmail: positionData?.AssignHOD?.EMail || "",
  //           PositionID: positionData?.PositionID?.ID || "",
  //           RoleProfileDocument: [], // Default empty array or fetch if necessary
  //           AdvertisementDocument: [], // Default empty array or fetch if necessary
  //           ShortlistedValue: "", // Adjust according to your logic, default value or fetch if needed
  //         };
  //       })
  //     );

  //     CandidateDetails.push(...formattedItems);
  //     console.log("CandidateDetails", CandidateDetails);
  //     return {
  //       data: CandidateDetails,
  //       status: 200,
  //       message: "Combined Candidate and Position Details fetched successfully",
  //     };
  //   } catch (error) {
  //     console.error("Error fetching combined data:", error);
  //     return {
  //       data: [],
  //       status: 500,
  //       message:
  //         "Error fetching combined data from Candidate and Position Details",
  //     };
  //   }
  // }

  // async GetCombinedCandidatePositionDetails(
  //   filterParam: any,
  //   filterConditions: any
  // ) {
  //   try {
  //     // Step 1: Fetching Candidate Details
  //     const CandidateDetails: CandidateData[] = [];
  //     const candidateItems: any[] = await SPServices.SPReadItems({
  //       Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
  //       Select:
  //         "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID",
  //       Expand: "JobCode,AssignByInterviewPanel,RecruitmentID",
  //       Filter: filterParam,
  //       FilterCondition: filterConditions,
  //       Topcount: count.Topcount,
  //     });

  //     // Step 2: Fetching Position Details
  //     const positionItems: any[] = await SPServices.SPReadItems({
  //       Listname: ListNames.HRMSRecruitmentPositionDetails,
  //       Select:
  //         "JobTitleEnglish/JobTitleInEnglish,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,RecruitmentID/ID,PositionID/PositionID,AssignLineManager/EMail,JobTitleFrench/JobTitleInFrench,AssignHOD/EMail",
  //       Expand:
  //         "JobTitleEnglish,PatersonGrade,DRCGrade,RecruitmentID,PositionID,AssignLineManager,JobTitleFrench,AssignHOD",
  //       Filter: filterParam,
  //       FilterCondition: filterConditions,
  //       Topcount: count.Topcount,
  //     });
  //     console.log("positionItems", positionItems);

  //     const positionsByRecruitment = positionItems.reduce(
  //       (acc: any, position) => {
  //         const recruitmentID = position?.RecruitmentID?.ID;
  //         if (!acc[recruitmentID]) {
  //           acc[recruitmentID] = [];
  //         }
  //         // Push only PositionID to the recruitment group
  //         acc[recruitmentID].push(position?.PositionID?.PositionID);
  //         return acc;
  //       },
  //       {}
  //     );

  //     console.log("positionsByRecruitment", positionsByRecruitment);

  //     // Step 3: Combining Candidate and Position Data
  //     const formattedItems = await Promise.all(
  //       candidateItems.map(async (item) => {
  //         // Fetching attachments (CV) for candidate
  //         const response = await CommonServices.GetAttachmentToLibrary(
  //           DocumentLibraray.InterviewPanelCandidateCV,
  //           item.JobCode?.JobCode,
  //           item?.PassportID
  //         );
  //         let candidateCV: IDocFiles[] = [];
  //         if (response.status === 200 && response.data) {
  //           candidateCV = response.data;
  //         } else {
  //           console.error("Error retrieving attachments:", response.message);
  //         }

  //         // Fetching PositionID using the RecruitmentID from positionsByRecruitment
  //         const positionIDs =
  //           positionsByRecruitment[item?.RecruitmentID?.ID] || [];
  //         console.log("Position IDs for this candidate:", positionIDs);

  //         // Returning the combined data with missing properties
  //         return {
  //           ID: item.ID,
  //           RecruitmentID: item?.RecruitmentID?.ID,
  //           JobCode: item?.JobCode?.JobCode,
  //           JobCodeId: item?.JobCodeId,
  //           PassportID: item?.PassportID,
  //           FristName: item?.FristName,
  //           MiddleName: item?.MiddleName,
  //           LastName: item?.LastName,
  //           FullName: `${item?.FristName ?? ""} ${item?.MiddleName ?? ""} ${
  //             item?.LastName ?? ""
  //           }`,
  //           ResidentialAddress: item?.ResidentialAddress,
  //           DOB: item?.DOB,
  //           ContactNumber: item?.ContactNumber,
  //           Email: item?.Email,
  //           Nationality: item?.Nationality,
  //           Gender: item?.Gender,
  //           TotalYearOfExperiance: item?.TotalYearOfExperiance,
  //           Skills: item?.Skills,
  //           LanguageKnown: item?.LanguageKnown,
  //           ReleventExperience: item?.ReleventExperience,
  //           Qualification: item?.Qualification,
  //           RecuritmentHR: item?.RecuritmentHR,
  //           AssignByInterviewPanel: item?.AssignByInterviewPanel?.EMail,
  //           CandidateCVDoc: candidateCV,
  //           PositionIDs: positionIDs, // Here, positionIDs are mapped to the candidate
  //           RoleProfileDocument: [], // Default empty array or fetch if necessary
  //           AdvertisementDocument: [], // Default empty array or fetch if necessary
  //           ShortlistedValue: "",

  //           PositionTitle: item.PositionTitle,
  //           JobGrade: item.JobGrade,
  //           // // Adjust according to your logic, default value or fetch if needed
  //         };
  //       })
  //     );

  //     CandidateDetails.push(...formattedItems);
  //     console.log("CandidateDetails", CandidateDetails);

  //     return {
  //       data: CandidateDetails,
  //       status: 200,
  //       message: "Combined Candidate and Position Details fetched successfully",
  //     };
  //   } catch (error) {
  //     console.error("Error fetching combined data:", error);
  //     return {
  //       data: [],
  //       status: 500,
  //       message:
  //         "Error fetching combined data from Candidate and Position Details",
  //     };
  //   }
  // }

  async GetCombinedCandidatePositionDetails(
    filterParam: any,
    filterConditions: any
  ) {
    try {
      // Step 1: Fetch Candidate Details
      const CandidateDetails: CandidateData[] = [];
      const candidateItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:
          "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID",
        Expand: "JobCode,AssignByInterviewPanel,RecruitmentID",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      // Step 2: Fetch Position Details
      const positionItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails,
        Select:
          "JobTitleEnglish/JobTitleInEnglish,PatersonGrade/PatersonGrade,DRCGrade/DRCGrade,RecruitmentID/ID,PositionID/PositionID,AssignLineManager/EMail,JobTitleFrench/JobTitleInFrench,AssignHOD/EMail",
        Expand:
          "JobTitleEnglish,PatersonGrade,DRCGrade,RecruitmentID,PositionID,AssignLineManager,JobTitleFrench,AssignHOD",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      // Step 3: Group Position Items by RecruitmentID
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

      // Step 4: Combine Candidate and Position Data
      const formattedItems = await Promise.all(
        candidateItems.map(async (item) => {
          // Fetching attachments (CV) for candidate
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

          // Fetching position data for the candidate (Ensure it's an array)
          const positionData =
            positionsByRecruitment[item?.RecruitmentID?.ID] || [];

          // Returning the combined data with missing properties
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
            // PositionData: positionData.map(
            //   (position: {
            //     PositionID: { PositionID: any };
            //     JobTitleEnglish: { JobTitleInEnglish: any };
            //     PatersonGrade: { PatersonGrade: any };
            //     DRCGrade: { DRCGrade: any };
            //     JobTitleFrench: { JobTitleInFrench: any };
            //     AssignLineManager: { EMail: any };
            //     AssignHOD: { EMail: any };
            //     RecruitmentID: { RecruitmentID: any };
            //   }) => ({
            //     PositionID: position?.PositionID?.PositionID || "",
            //     RecruitmentID: position?.RecruitmentID?.RecruitmentID?.ID || "",
            //     PositionTitles:
            //       position?.JobTitleEnglish?.JobTitleInEnglish || "",
            //     JobGrade: position?.PatersonGrade?.PatersonGrade || "",
            //     DRCGrade: position?.DRCGrade?.DRCGrade || "",
            //     JobTitleFrench:
            //       position?.JobTitleFrench?.JobTitleInFrench || "",
            //     AssignLineManagerEmail:
            //       position?.AssignLineManager?.EMail || "",
            //     AssignHODEmail: position?.AssignHOD?.EMail || "",
            //   })
            // ),
            PositionData: positionData.map(
              (position: {
                PositionID: { PositionID: any };
                JobTitleEnglish: { JobTitleInEnglish: any };
                PatersonGrade: { PatersonGrade: any };
                DRCGrade: { DRCGrade: any };
                JobTitleFrench: { JobTitleInFrench: any };
                AssignLineManager: { EMail: any };
                AssignHOD: { EMail: any };
                RecruitmentID: { ID: any }; // Ensure correct structure
              }) => ({
                PositionID: position?.PositionID?.PositionID || "",
                RecruitmentID: position?.RecruitmentID?.ID || "", // Corrected access
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
          };
        })
      );

      CandidateDetails.push(...formattedItems);
      console.log("CandidateDetails", CandidateDetails);
      return {
        data: CandidateDetails,
        status: 200,
        message: "Combined Candidate and Position Details fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching combined data:", error);
      return {
        data: [],
        status: 500,
        message:
          "Error fetching combined data from Candidate and Position Details",
      };
    }
  }
}
