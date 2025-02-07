import { InterviewPanaldata } from "../../Models/Screens";
import { ListNames } from "../../utilities/Config";
import SPServices from "../SPService/SPServices";
import { IInterviewProcessService } from "./IInterviewProcessService";

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

      console.log("Raw Interview Panel Data:", listItems);

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

      console.log("Formatted Interview Panel Data:", InterviewPanelDetails);

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
}
