import moment from "moment";
import { EvalUIConfig, EvalQueryConfig, InterviewLevels } from "../config/EvaluationConfig";
import { TooltipEntry, ScoreSheetResult, EvaluationCandidate } from "./IEvaluationService";
import { ListNames, StatusId } from "../../../../utilities/Config"; 

import SPServices from "../../../../services/SPService/spservice";
import CommonService from "../CommonServices/CommonServices";

// Import the GetPortalJobs class from your QuestionnaireApi file
import GetPortalJobs from "./QuestionnaireApi/QuestionnaireApi";

const commonServiceInstance = new CommonService();

// Instantiate the class so you can use its methods!
const questionnaireService = new GetPortalJobs();

export const evaluationService = {

  // ==========================================
  // DASHBOARD METHODS
  // ==========================================

  async getCurrentUserGuid(email: string): Promise<string | null> {
    try {
      if (!email) return null;
      const response = await commonServiceInstance.getUserGuidByEmail(email);
      if (response?.status === 200 && response?.data?.key) {
        return String(response.data.key);
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  async getInterviewPanelsByUser(userGuid: string): Promise<any[]> {
    try {
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select: EvalQueryConfig.InterviewPanel.Select,
        Expand: EvalQueryConfig.InterviewPanel.Expand,
        Filter: [{ FilterKey: "InterviewPanelId", Operator: "eq", FilterValue: userGuid }],
      });
      return listItems ?? [];
    } catch (e) {
      return [];
    }
  },

  async getCombinedCandidates(candidateIDs: number[], employeeList: any[]): Promise<any[]> {
    try {
      if (!candidateIDs || candidateIDs.length === 0) return [];
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: EvalQueryConfig.CandidateDetails.Select,
        Expand: EvalQueryConfig.CandidateDetails.Expand,
        FilterCondition: "and",
        Filter: [
          { FilterKey: "StatusId", Operator: "in", FilterValue: [StatusId.InterviewScheduled, StatusId.InterviewScheduledforLevel2] },
          { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
          { FilterKey: "ID", Operator: "in", FilterValue: candidateIDs },
        ],
        Topcount: 5000 
      });
      return listItems ?? [];
    } catch (e) {
      return [];
    }
  },

  async getGradeAndLevel(recruitmentID: number): Promise<{ grade: string; level: string; jobCodeID: number }> {
    let grade = ""; let level = ""; let jobCodeID = 0;
    try {
      const dptRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails, 
        Select: "*,JobCodeId,JobCode/ID",
        Expand: "JobCode",
        Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }]
      });
      jobCodeID = dptRes?.[0]?.JobCodeId ?? dptRes?.[0]?.JobCode?.ID ?? 0;
      
      const posRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails, 
        Select: "*,PatersonGrade/PatersonGrade",
        Expand: "PatersonGrade",
        Filter: [{ FilterKey: "RecruitmentID", Operator: "eq", FilterValue: recruitmentID }]
      });
      
      grade = posRes?.[0]?.PatersonGrade?.PatersonGrade ?? posRes?.[0]?.PatersonGrade ?? "";

      if (grade) {
        await SPServices.SPReadItems({
          Listname: ListNames.HRMSGradeMaster,
          Select: "*",
          Filter: [{ FilterKey: "PatersonGrade", Operator: "eq", FilterValue: grade }],
        }).then((data: any) => {
          if (data && data.length > 0) {
            level = data[0]?.Levels ?? "";
          }
        });
      }
    } catch (e) {
      console.error("[getGradeAndLevel] Error fetching grade/level:", e);
    }
    return { grade, level, jobCodeID };
  },

  async getTooltipData(candidateID: number, interviewLevel: string): Promise<TooltipEntry[]> {
    try {
      const listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select: "InterviewPanel/Title,IsScoreSheetUploaded",
        Expand: "InterviewPanel",
        FilterCondition: "and",
        Filter: [
          { FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID },
          { FilterKey: "InterviewLevel", Operator: "eq", FilterValue: interviewLevel },
        ],
      });
      return listItems.map((item: any) => ({
        Key: item.InterviewPanel?.Title || "Unknown",
        Value: item.IsScoreSheetUploaded === "Yes" ? "Completed" : "Pending"
      }));
    } catch (e) {
      return [];
    }
  },

  async checkScoreSheet(candidateID: number, statusId: number | string, userEmail: string): Promise<ScoreSheetResult> {
    try {
      const currentUserKey = await this.getCurrentUserGuid(userEmail);
      if (!currentUserKey) return { canProceed: true };

      const candidatePanels: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select: "InterviewPanel/Id,InterviewLevel,IsScoreSheetUploaded",
        Expand: "InterviewPanel",
        Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }]
      });

      const userPanels = candidatePanels.filter((p: any) => p.InterviewPanel?.Id?.toString() === currentUserKey);
      if (!userPanels.length) return { canProceed: true };

      if (statusId === StatusId.InterviewScheduled) {
        const already = userPanels.filter((p: any) => p.InterviewLevel === InterviewLevels.Level1).some((p: any) => p.IsScoreSheetUploaded === "Yes");
        return already ? { canProceed: false, level: InterviewLevels.Level1 } : { canProceed: true };
      }
      if (statusId === StatusId.InterviewScheduledforLevel2) {
        const already = userPanels.filter((p: any) => p.InterviewLevel === InterviewLevels.Level2).some((p: any) => p.IsScoreSheetUploaded === "Yes");
        return already ? { canProceed: false, level: InterviewLevels.Level2 } : { canProceed: true };
      }
      return { canProceed: true };
    } catch (e) {
      return { canProceed: true };
    }
  },

  // ==========================================
  // EVALUATION FORM METHODS (Scorecard View)
  // ==========================================

 async getEvaluationFormData(candidateId: number, recruitmentId: number, currentUserEmail: string) {
    try {
      // 1. Fetch Candidate Details - Added : any[]
      const candidateRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: "*", 
        Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: candidateId }],
      });
      
      // ADDED : any to bypass the '{}' type error
      const candidate: any = candidateRes[0] || {};

      // 2. Fetch Interview Panel Members - Added : any[]
      const panelRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select: "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewLevel,IsScoreSheetUploaded",
        Expand: "InterviewPanel",
        Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
      });

      const currentUserGuid = await this.getCurrentUserGuid(currentUserEmail);
      
      // ADDED : any to prevent TypeScript from complaining about the properties
      const currentUserPanel: any = panelRes.find((p: any) => String(p.InterviewPanel?.Id) === String(currentUserGuid));

      // 3. Fetch JobCode string to use in Questionnaire API - Added : any[]
      const dptRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails, 
        Select: "*,JobCode/JobCode",
        Expand: "JobCode",
        Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentId }]
      });
      const jobCodeString = dptRes?.[0]?.JobCode?.JobCode ?? "";

      // 4. Fetch Questions using your imported class instance
      let questions: any[] = [];
      if (jobCodeString) {
        try {
          // Calling the method from the instantiated class
          const qResponse = await questionnaireService.getQuestionnaire(jobCodeString);
          if (qResponse?.data) {
            questions = qResponse.data; 
          }
        } catch (err) {
          console.error("Error fetching questionnaires from API:", err);
        }
      }

      return {
        success: true,
        candidateData: candidate,
        panelMembers: panelRes.map((p: any) => p.InterviewPanel?.Title).filter(Boolean),
        currentUserPanelId: currentUserPanel?.ID || null,
        questions: questions,
      };
    } catch (error) {
      console.error("Error fetching evaluation form data:", error);
      return { success: false, candidateData: null, panelMembers: [], currentUserPanelId: null, questions: [] };
    }
  },

  async submitScorecard(payload: any, panelId: number) {
    try {
      const scoreCardResponse = await SPServices.SPAddItem({
        Listname: ListNames.HRMSCandidateScoreCard,
        RequestJSON: payload,
      });

      if (scoreCardResponse?.data?.ID) {
        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSInterviewPanelDetails,
          RequestJSON: { IsScoreSheetUploaded: "Yes" },
          ID: panelId,
        });
        return { success: true, message: "Scorecard submitted successfully!" };
      }
      return { success: false, message: "Failed to submit scorecard." };
    } catch (error) {
      console.error("Error submitting scorecard:", error);
      return { success: false, message: "An error occurred while submitting." };
    }
  }
};

export const EvaluationServiceHelper = {
  buildRow(candidate: any, grade: string, level: string, jobCodeID: number): EvaluationCandidate {
    const rawDate = candidate?.InterviewDateLevel2 || candidate?.InterviewDate || "";
    const formattedLevel = level === InterviewLevels.Level2 ? InterviewLevels.Levels2 : level;
    
    // Formatting the date to DD/MM/YYYY for the UI
    const interviewDateTime = rawDate ? moment(rawDate).format("DD/MM/YYYY") : "";
    
    return {
      id: candidate.ID,
      applicantName: `${candidate.FristName ?? ""} ${candidate.LastName ?? ""}`.trim(),
      positionTitle: candidate.PositionTitle ?? "",
      // Display format
      interviewDate: interviewDateTime, 
      // Raw string format for Logic sorting/comparing
      interviewDateTime: rawDate,       
      interviewLevel: formattedLevel,
      grade,
      gradeLabel: "",
      attachments: candidate.CandidateCVDoc?.length ?? 0,
      status: candidate.Status?.StatusDescription ?? candidate.Status ?? "",
      statusId: candidate.StatusId ?? candidate.Status?.ID ?? candidate.Status?.Id ?? "", 
      recruitmentID: candidate.RecruitmentID?.ID ?? candidate.RecruitmentID ?? "",
      jobCodeID,
    };
  }
};