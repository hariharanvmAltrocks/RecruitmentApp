import moment from "moment";
import { EvalUIConfig, EvalQueryConfig, InterviewLevels } from "../config/EvaluationConfig";
import { TooltipEntry, ScoreSheetResult, EvaluationCandidate } from "./IEvaluationService";
import { ListNames, StatusId } from "../../../../utilities/Config"; 

import SPServices from "../../../../services/SPService/spservice";
import CommonService from "../CommonServices/CommonServices";
import GetPortalJobs from "./QuestionnaireApi/QuestionnaireApi";

const commonServiceInstance = new CommonService();
const questionnaireService = new GetPortalJobs();

export const evaluationService = {

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
      return listItems || [];
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
      return listItems || [];
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
      jobCodeID = dptRes?.[0]?.JobCodeId || dptRes?.[0]?.JobCode?.ID || 0;
      
      const posRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails, 
        Select: "*,PatersonGrade/PatersonGrade",
        Expand: "PatersonGrade",
        Filter: [{ FilterKey: "RecruitmentID", Operator: "eq", FilterValue: recruitmentID }]
      });
      
      grade = posRes?.[0]?.PatersonGrade?.PatersonGrade || posRes?.[0]?.PatersonGrade || "";

      if (grade) {
        await SPServices.SPReadItems({
          Listname: ListNames.HRMSGradeMaster,
          Select: "*",
          Filter: [{ FilterKey: "PatersonGrade", Operator: "eq", FilterValue: grade }],
        }).then((data: any) => {
          if (data && data.length > 0) {
            level = data[0]?.Levels || "";
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

  async getEvaluationFormData(candidateId: number, recruitmentId: number, currentUserEmail: string) {
    try {
      const candidateRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: "*", 
        Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: candidateId }],
      });
      const candidate: any = candidateRes[0] || {};
      const panelRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select: "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded",
        Expand: "InterviewPanel",
        Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
      });

      const currentUserGuid = await this.getCurrentUserGuid(currentUserEmail);
      const currentUserPanel: any = panelRes.find((p: any) => String(p.InterviewPanel?.Id) === String(currentUserGuid));
      const panelEmails = panelRes.map((p: any) => p.InterviewPanel?.EMail).filter(Boolean);
      const uniqueEmails = panelEmails.filter((value: any, index: number, self: any[]) => self.indexOf(value) === index);
      let emailToNameMap: Record<string, string> = {};

      if (uniqueEmails.length > 0) {
        try {
          await Promise.all(uniqueEmails.map(async (email: string) => {
            const sageRes = await SPServices.SPReadItems({
              Listname: ListNames.HRMSSageList,
              Select: "EmailId, FirstName, LastName, MiddleName",
              Filter: [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }]
            });
            if (sageRes && sageRes.length > 0) {
              const item: any = sageRes[0];
              const fName = item.FirstName || "";
              const mName = item.MiddleName || "";
              const lName = item.LastName || "";
              const fullName = (fName + " " + mName + " " + lName).trim();
              if (fullName) {
                emailToNameMap[email.toLowerCase()] = fullName;
              }
            }
          }));
        } catch (err) {
          console.warn("Could not fetch panel details from Sage List", err);
        }
      }
      const formattedPanelMembers = panelRes.map((p: any) => {
        const email = p.InterviewPanel?.EMail?.toLowerCase() || "";
        return emailToNameMap[email] || p.InterviewPanel?.Title || "Unknown";
      }).filter(Boolean);

      console.log("====== EVALUATION FORM: INTERVIEW PANEL TITLES (Fetched from Sage List) ======");
      console.log(formattedPanelMembers);
      let reviewerName = "";
      let jobTitleEn = "—";
      let jobTitleFr = "—";
      try {
        const sageRes: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSSageList,
          Select: "*,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench",
          Expand: "JobTitleInEnglish,JobTitleInFrench",
          Filter: [{ FilterKey: "EmailId", Operator: "eq", FilterValue: currentUserEmail }],
        });
        if (sageRes && sageRes.length > 0) {
          const sageUser: any = sageRes[0];
          const fName = sageUser.FirstName || "";
          const mName = sageUser.MiddleName || "";
          const lName = sageUser.LastName || "";
          reviewerName = (fName + " " + mName + " " + lName).trim();
          jobTitleEn = sageUser.JobTitleInEnglish?.JobTitleInEnglish || "—";
          jobTitleFr = sageUser.JobTitleInFrench?.JobTitleInFrench || "—";
        }
      } catch (err) {
        console.warn("Could not fetch reviewer details from Sage List", err);
      }
      const dptRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails, 
        Select: "*,JobCode/JobCode,JobCode/ID",
        Expand: "JobCode",
        Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentId }]
      });
      const jobCodeId = dptRes?.[0]?.JobCodeId ?? dptRes?.[0]?.JobCode?.ID ?? 0;

      let jobUniqueKey = "";
      if (jobCodeId) {
        try {
          const integrationRes: any[] = await SPServices.SPReadItems({
            Listname: ListNames.RecruitAppCareerPortalIntegration,
            Select: "*",
            Filter: [
              { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeId },
              { FilterKey: "IsActive",  Operator: "eq", FilterValue: 1 },
            ],
            FilterCondition: "and",
          });
          jobUniqueKey = integrationRes?.[0]?.JobUniqueKey || "";
        } catch (err) {}
      }

      let questions: any[] = [];
      if (jobUniqueKey) {
        try {
          const qResponse = await questionnaireService.getQuestionnaire(jobUniqueKey);
          if (qResponse?.data) questions = qResponse.data; 
        } catch (err) {}
      }

      return {
        success: true,
        candidateData: candidate,
        panelMembers: formattedPanelMembers,
        currentUserPanelId: currentUserPanel?.ID || null,
        questions: questions,
        currentUserGuid: currentUserGuid,
        reviewerName: reviewerName,
        jobTitleEn: jobTitleEn,
        jobTitleFr: jobTitleFr,
      };
    } catch (error) {
      return { success: false, candidateData: null, panelMembers: [], currentUserPanelId: null, questions: [] };
    }
  },

  async submitScorecard(payload: any, panelId: number, roleId: number, interviewPersonNameId: string) {
    try {
      const spPayload = {
        RelevantQualification:          String(payload.Qualifications  || ""),
        ReleventExperience:             String(payload.Experience      || ""),
        Knowledge:                      String(payload.Knowledge       || ""),
        EnergyLevel:                    String(payload.EnergyLevel     || ""),
        MeetJobRequirement:             String(payload.JobRequirements || ""),
        ContributeTowardsCultureRequried: String(payload.CultureFit      || ""),
        Experience:                     String(payload.ExpatLocal      || ""),
        OtherCriteriaScore:             String(payload.OtherCriteria   || ""),
        ConsiderForEmployment:          payload.Recommendation === "Consider for Employment" ? "Yes" : "No",
        OverAllEvaluationFeedback:      payload.OverallFeedback || "",
        RecruitmentIDId:                payload.RecruitmentIDId,
        InterviewPanelIDId:             panelId,
        QuestionJson:                   payload.QuestionScores || "[]",
        RoleId:                         roleId ? Number(roleId) : null,
        InterviewPersonNameId:          interviewPersonNameId ? Number(interviewPersonNameId) : null,
      };

      console.log("====== SUBMIT DEBUG: PAYLOAD SENT TO SP ======");
      console.log("Payload mapped to SP columns:", spPayload);

      const scoreCardResponse: any = await SPServices.SPAddItem({
        Listname: ListNames.HRMSCandidateScoreCard,
        RequestJSON: spPayload,
      });

      const newItemId = scoreCardResponse?.ID || scoreCardResponse?.Id || scoreCardResponse?.data?.ID || scoreCardResponse?.data?.Id;

      if (newItemId) {
        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSInterviewPanelDetails,
          RequestJSON: { IsScoreSheetUploaded: "Yes" },
          ID: panelId,
        });
        return { success: true, message: "Scorecard submitted successfully!" };
      } else {
        return { success: false, message: "Failed to submit scorecard." };
      }
    } catch (error) {
      console.error("====== SUBMIT DEBUG: CATCH ERROR ======", error);
      return { success: false, message: "An error occurred while submitting." };
    }
  }
};

export const EvaluationServiceHelper = {
  buildRow(candidate: any, grade: string, level: string, jobCodeID: number): EvaluationCandidate {
    const rawDate = candidate?.InterviewDateLevel2 || candidate?.InterviewDate || "";
    const formattedLevel = level === InterviewLevels.Level2 ? InterviewLevels.Levels2 : level;
    const interviewDateTime = rawDate ? moment(rawDate).format("DD/MM/YYYY") : "";
    
    const fName = candidate.FristName || "";
    const lName = candidate.LastName || "";

    return {
      id: candidate.ID,
      applicantName: (fName + " " + lName).trim(),
      positionTitle: candidate.PositionTitle || "",
      interviewDate: interviewDateTime, 
      interviewDateTime: rawDate,      
      interviewLevel: formattedLevel,
      grade,
      gradeLabel: "",
      attachments: candidate.CandidateCVDoc?.length || 0,
      status: candidate.Status?.StatusDescription || candidate.Status || "",
      statusId: candidate.StatusId || candidate.Status?.ID || candidate.Status?.Id || "", 
      recruitmentID: candidate.RecruitmentID?.ID || candidate.RecruitmentID || "",
      jobCodeID,
    };
  }
};