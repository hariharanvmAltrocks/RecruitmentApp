import { InterviewPanaldata } from "../../Models/Screens";
import { ListNames } from "../../utilities/Config";
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
}
