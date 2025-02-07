import { InterviewPanaldata } from "../../Models/Screens";

export type IInterviewProcessService = {
  GetInterviewPanelDetails(
    filterConditions: any[]
  ): Promise<ApiResponse<InterviewPanaldata[]>>;
};
