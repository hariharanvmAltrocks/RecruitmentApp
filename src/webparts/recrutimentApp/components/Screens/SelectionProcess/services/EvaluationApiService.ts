import moment from "moment";
import { EvalQueryConfig, InterviewLevels, WorkflowAction } from "../config/EvaluationConfig";
import {
  TooltipEntry, ScoreSheetResult, EvaluationCandidate,
  RawScorecard, CommentEntry, PositionOption,
  ScorecardJobRow, ScorecardCandidateRow,
} from "./IEvaluationService";
import { ListNames, StatusId } from "../../../../utilities/Config";

import SPServices    from "../../../../services/SPService/spservice";
import CommonService from "../CommonServices/CommonServices";
import GetPortalJobs from "./QuestionnaireApi/QuestionnaireApi";
import { getProfileData } from "../../../../services/AxiosService/CareerPortalAPI";

const commonServiceInstance = new CommonService();
const questionnaireService  = new GetPortalJobs();

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
        Select:   EvalQueryConfig.InterviewPanel.Select,
        Expand:   EvalQueryConfig.InterviewPanel.Expand,
        Filter:   [{ FilterKey: "InterviewPanelId", Operator: "eq", FilterValue: userGuid }],
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
        Listname:        ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:          EvalQueryConfig.CandidateDetails.Select,
        Expand:          EvalQueryConfig.CandidateDetails.Expand,
        FilterCondition: "and",
        Filter: [
          { FilterKey: "StatusId",    Operator: "in", FilterValue: [StatusId.InterviewScheduled, StatusId.InterviewScheduledforLevel2] },
          { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
          { FilterKey: "ID",          Operator: "in", FilterValue: candidateIDs },
        ],
        Topcount: 5000,
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
        Select:   "*,JobCodeId,JobCode/ID",
        Expand:   "JobCode",
        Filter:   [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }],
      });
      jobCodeID = dptRes?.[0]?.JobCodeId || dptRes?.[0]?.JobCode?.ID || 0;

      const posRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentPositionDetails,
        Select:   "*,PatersonGrade/PatersonGrade",
        Expand:   "PatersonGrade",
        Filter:   [{ FilterKey: "RecruitmentID", Operator: "eq", FilterValue: recruitmentID }],
      });
      grade = posRes?.[0]?.PatersonGrade?.PatersonGrade || posRes?.[0]?.PatersonGrade || "";

      if (grade) {
        await SPServices.SPReadItems({
          Listname: ListNames.HRMSGradeMaster,
          Select:   "*",
          Filter:   [{ FilterKey: "PatersonGrade", Operator: "eq", FilterValue: grade }],
        }).then((data: any) => {
          if (data && data.length > 0) level = data[0]?.Levels || "";
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
        Listname:        ListNames.HRMSInterviewPanelDetails,
        Select:          "InterviewPanel/Title,IsScoreSheetUploaded",
        Expand:          "InterviewPanel",
        FilterCondition: "and",
        Filter: [
          { FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID },
          { FilterKey: "InterviewLevel",  Operator: "eq", FilterValue: interviewLevel },
        ],
      });
      return listItems.map((item: any) => ({
        Key:   item.InterviewPanel?.Title || "Unknown",
        Value: item.IsScoreSheetUploaded === "Yes" ? "Completed" : "Pending",
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
        Select:   "InterviewPanel/Id,InterviewLevel,IsScoreSheetUploaded",
        Expand:   "InterviewPanel",
        Filter:   [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }],
      });

      const userPanels = candidatePanels.filter(
        (p: any) => p.InterviewPanel?.Id?.toString() === currentUserKey
      );
      if (!userPanels.length) return { canProceed: true };

      if (statusId === StatusId.InterviewScheduled) {
        const already = userPanels
          .filter((p: any) => p.InterviewLevel === InterviewLevels.Level1)
          .some((p: any) => p.IsScoreSheetUploaded === "Yes");
        return already ? { canProceed: false, level: InterviewLevels.Level1 } : { canProceed: true };
      }
      if (statusId === StatusId.InterviewScheduledforLevel2) {
        const already = userPanels
          .filter((p: any) => p.InterviewLevel === InterviewLevels.Level2)
          .some((p: any) => p.IsScoreSheetUploaded === "Yes");
        return already ? { canProceed: false, level: InterviewLevels.Level2 } : { canProceed: true };
      }
      return { canProceed: true };
    } catch (e) {
      return { canProceed: true };
    }
  },

  async getEvaluationFormData(
    candidateId: number,
    recruitmentId: number,
    currentUserEmail: string
  ): Promise<{
    success: boolean;
    candidateData: any;
    panelMembers: string[];
    currentUserPanelId: number | null;
    questions: any[];
    currentUserGuid: string | null;
    reviewerName: string;
    jobTitleEn: string;
    jobTitleFr: string;
  }> {
    try {
      const candidateRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:   "*",
        Filter:   [{ FilterKey: "ID", Operator: "eq", FilterValue: candidateId }],
      });
      const candidate: any = candidateRes[0] || {};

      const panelRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:   "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded",
        Expand:   "InterviewPanel",
        Filter:   [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
      });

      const currentUserGuid  = await this.getCurrentUserGuid(currentUserEmail);
      const currentUserPanel = panelRes.find(
        (p: any) => String(p.InterviewPanel?.Id) === String(currentUserGuid)
      );

      const panelEmails   = panelRes.map((p: any) => p.InterviewPanel?.EMail).filter(Boolean);
      const uniqueEmails  = panelEmails.filter(
        (value: any, index: number, self: any[]) => self.indexOf(value) === index
      );
      let emailToNameMap: Record<string, string> = {};

      if (uniqueEmails.length > 0) {
        try {
          await Promise.all(
            uniqueEmails.map(async (email: string) => {
              const sageRes = await SPServices.SPReadItems({
                Listname: ListNames.HRMSSageList,
                Select:   "EmailId, FirstName, LastName, MiddleName",
                Filter:   [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
              });
              if (sageRes && sageRes.length > 0) {
                const item: any = sageRes[0];
                const fullName = (
                  (item.FirstName || "") + " " +
                  (item.MiddleName || "") + " " +
                  (item.LastName || "")
                ).trim();
                if (fullName) emailToNameMap[email.toLowerCase()] = fullName;
              }
            })
          );
        } catch (err) {
          console.warn("Could not fetch panel details from Sage List", err);
        }
      }

      const formattedPanelMembers = panelRes
        .map((p: any) => {
          const email = p.InterviewPanel?.EMail?.toLowerCase() || "";
          return emailToNameMap[email] || p.InterviewPanel?.Title || "Unknown";
        })
        .filter(Boolean);

      let reviewerName = "";
      let jobTitleEn   = "";
      let jobTitleFr   = "";
      try {
        const sageRes: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSSageList,
          Select:   "*,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench",
          Expand:   "JobTitleInEnglish,JobTitleInFrench",
        });
        if (sageRes && sageRes.length > 0) {
          const sageUser: any = sageRes[0];
          reviewerName = (
            (sageUser.FirstName  || "") + " " +
            (sageUser.MiddleName || "") + " " +
            (sageUser.LastName   || "")
          ).trim();
          jobTitleEn = sageUser.JobTitleInEnglish?.JobTitleInEnglish ||"" ;
          jobTitleFr = sageUser.JobTitleInFrench?.JobTitleInFrench   || "";
        }
      } catch (err) {
        console.warn("Could not fetch reviewer details from Sage List", err);
      }

      const dptRes: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        Select:   "*,JobCode/JobCode,JobCode/ID",
        Expand:   "JobCode",
        Filter:   [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentId }],
      });
      const jobCodeId = dptRes?.[0]?.JobCodeId ?? dptRes?.[0]?.JobCode?.ID ?? 0;

      let jobUniqueKey = "";
      if (jobCodeId) {
        try {
          const integrationRes: any[] = await SPServices.SPReadItems({
            Listname:        ListNames.RecruitAppCareerPortalIntegration,
            Select:          "*",
            FilterCondition: "and",
            Filter: [
              { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeId },
              { FilterKey: "IsActive",  Operator: "eq", FilterValue: 1 },
            ],
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
        success:            true,
        candidateData:      candidate,
        panelMembers:       formattedPanelMembers,
        currentUserPanelId: currentUserPanel?.ID || null,
        questions,
        currentUserGuid,
        reviewerName,
        jobTitleEn,
        jobTitleFr,
      };
    } catch (error) {
        return {
        success: false, candidateData: null, panelMembers: [],
        currentUserPanelId: null, questions: [],
        currentUserGuid: null, reviewerName: "", jobTitleEn: "", jobTitleFr: ""
      };
    }
  },

  async submitScorecard(
    payload: any,
    panelId: number,
    roleId: number,
    interviewPersonNameId: string
  ) {
    try {
      const spPayload = {
        RelevantQualification:             String(payload.Qualifications  || ""),
        ReleventExperience:                String(payload.Experience      || ""),
        Knowledge:                         String(payload.Knowledge       || ""),
        EnergyLevel:                       String(payload.EnergyLevel     || ""),
        MeetJobRequirement:                String(payload.JobRequirements || ""),
        ContributeTowardsCultureRequried:  String(payload.CultureFit      || ""),
        Experience:                        String(payload.ExpatLocal       || ""),
        OtherCriteriaScore:                String(payload.OtherCriteria   || ""),
        ConsiderForEmployment:
          payload.Recommendation === "Consider for Employment" ? "Yes" : "No",
        OverAllEvaluationFeedback: payload.OverallFeedback || "",
        RecruitmentIDId:           payload.RecruitmentIDId,
        InterviewPanelIDId:        panelId,
        QuestionJson:              payload.QuestionScores || "[]",
        RoleId:                    roleId ? Number(roleId) : null,
        InterviewPersonNameId:     interviewPersonNameId ? Number(interviewPersonNameId) : null,
      };

      const scoreCardResponse: any = await SPServices.SPAddItem({
        Listname:    ListNames.HRMSCandidateScoreCard,
        RequestJSON: spPayload,
      });

      const newItemId =
        scoreCardResponse?.ID ||
        scoreCardResponse?.Id ||
        scoreCardResponse?.data?.ID ||
        scoreCardResponse?.data?.Id;

      if (newItemId) {
        await SPServices.SPUpdateItem({
          Listname:    ListNames.HRMSInterviewPanelDetails,
          RequestJSON: { IsScoreSheetUploaded: "Yes" },
          ID:          panelId,
        });
        return { success: true, message: "Scorecard submitted successfully!" };
      }
      return { success: false, message: "Failed to submit scorecard." };
    } catch (error) {
      console.error("submitScorecard error:", error);
      return { success: false, message: "An error occurred while submitting." };
    }
  },

  async updateCandidateStatus(
    candidateId: number,
    statusId: number,
    positionId: number | null,
    hodDecision: string,
    comments: string,
    updatedByEmail: string,
    gpa: string = ""
  ) {
    try {
      if (candidateId == null || statusId == null || !hodDecision?.trim() || !comments?.trim()) {
        return { success: false, message: "Required fields: candidateId, statusId, hodDecision, comments" };
      }

      let actionId = 0;
      switch (hodDecision.trim().toLowerCase()) {
        case "yes":     actionId = 1;  break;
        case "no":      actionId = 2;  break;
        case "on hold": actionId = 10; break;
        default: throw new Error(`Invalid HOD decision: ${hodDecision}`);
      }

      const payload: any = {
        StatusId:          statusId,
        ActionId:          actionId,
        ItemCreated:       "Yes",
        Comments:          String(comments || "").trim(),
        GPA:               String(gpa || ""),
        OthersInterviewed: "No",
      };
      if (updatedByEmail) payload.HOD = updatedByEmail;
      if (positionId)     payload.PositionIDId = positionId;

      const updateResponse = await SPServices.SPUpdateItem({
        Listname:    ListNames.HRMSRecruitmentCandidatePersonalDetails,
        ID:          candidateId,
        RequestJSON: payload,
      });

      if (!updateResponse) throw new Error("SPUpdateItem returned empty response");

      return { success: true, message: "Candidate status updated successfully.", data: { candidateId, statusId } };
    } catch (error: any) {
      return { success: false, message: `Error updating candidate status: ${error?.message}` };
    }
  },

  async fetchExistingHODDecision(
    candidateId: number,
    roleId:      number,
    isLevel2:    boolean
  ): Promise<{
    comments:      string;
    positionId:    number | null;
    positionText:  string;
  } | null> {
    try {
      const listName = isLevel2
        ? ListNames.HRMSCandidateLevel2ScoreCard
        : ListNames.HRMSRecruitmentCandidateComments;

      const filter = [
        { FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateId },
      ];

      const items: any[] = await SPServices.SPReadItems({
        Listname: listName,
        Select:   "*",
        Filter:   filter,
      });
      const match = items.find(
        (item: any) => item.RoleId === roleId
      ) || items[0]; 

      const comments = match?.Comments || "";

      let positionId:   number | null = null;
      let positionText: string        = "";
      try {
        const posList: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSSelectedCandidateDetailsByHOD,
          Select:   "*,PositionID/PositionID,PositionID/ID",
          Expand:   "PositionID",
          Filter:   [{ FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateId }],
        });
        if (posList && posList.length > 0) {
          const posItem = posList[0];
          positionId   = posItem.PositionIDId || posItem.PositionID?.ID || null;
          positionText = posItem.PositionID?.PositionID || posItem.PositionIDText || "";
        }
      } catch (_) {}

      return { comments, positionId, positionText };
    } catch (e) {
      console.warn("[fetchExistingHODDecision] error:", e);
      return null;
    }
  },
  async updateCandidateStatusFull(params: {
    candidateId:     number;
    hodDecision:     "Yes" | "No" | "On Hold" | "";
    comments:        string;
    currentUserEmail: string;
    currentRoleId:   number;
    gpa:             string;
    positionId:      number | null;
    isLevel2:        boolean;
    jobCodeID:       number;
    recruitmentID:   number;
    statusId:        number;
  }): Promise<{ success: boolean; message: string }> {
    const {
      candidateId, hodDecision, comments, currentUserEmail,
      currentRoleId, gpa, positionId, isLevel2, jobCodeID, recruitmentID, statusId
    } = params;

    try {
      const currentUserGuid = await this.getCurrentUserGuid(currentUserEmail);
      if (statusId === StatusId.InterviewScheduledforLevel2) {
        let interviewLevel2 = "";
        try {
          const { level } = await evaluationService.getGradeAndLevel(recruitmentID);
          interviewLevel2 = level || "";
        } catch (_) {}
        await _insertOrUpdateLevel2Comment(candidateId, currentRoleId, comments, interviewLevel2);
        if (currentUserGuid) {
          const matchingPanels: any[] = await SPServices.SPReadItems({
            Listname: ListNames.HRMSInterviewPanelDetails,
            Select:   "ID,InterviewPanel/Id,InterviewLevel,CandidateID/ID",
            Expand:   "InterviewPanel,CandidateID",
            Filter:   [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
          });

          const userPanels = matchingPanels.filter(
            (p: any) =>
              p.InterviewPanel?.Id?.toString() === currentUserGuid &&
              (p.CandidateID?.ID ?? p.CandidateID?.Id ?? p.CandidateIDId) === candidateId
          );

          for (const panel of userPanels) {
            await SPServices.SPUpdateItem({
              Listname:    ListNames.HRMSInterviewPanelDetails,
              RequestJSON: { IsScoreSheetUploaded: "Yes" },
              ID:          panel.ID,
            });
          }
        }
        const allPanels: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select:   "ID,InterviewLevel,IsScoreSheetUploaded,CandidateID/Id",
          Expand:   "CandidateID",
          Filter:   [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
        });

        const level2Panels  = allPanels.filter(
          (p: any) => p.InterviewLevel === InterviewLevels.Level2
        );
        const uploadedCount = level2Panels.filter(
          (p: any) => p.IsScoreSheetUploaded === "Yes"
        ).length;

        if (uploadedCount === level2Panels.length && level2Panels.length > 0) {
          await SPServices.SPUpdateItem({
            Listname:    ListNames.HRMSRecruitmentCandidatePersonalDetails,
            RequestJSON: {
              ScoreCardLevelItemCreated: "Yes",
              ActionId:                 WorkflowAction.Approved,
              ItemCreated:              "Yes",
            },
            ID: candidateId,
          });
        }

        return { success: true, message: "Level 2 scorecard comment submitted successfully." };
      }
      let interviewLevel = "";
      try {
        const { level } = await evaluationService.getGradeAndLevel(recruitmentID);
        interviewLevel = level || "";
      } catch (_) {}
      await _insertOrUpdateLevel1Comment(candidateId, currentRoleId, comments, interviewLevel);

      if (positionId) {
        await _assignPositionID({
          positionId,
          candidateId,
          recruitmentID,
        });
      }
      let workflowStatus = "";
      switch (hodDecision) {
        case "Yes":     workflowStatus = "Selected";  break;
        case "No":      workflowStatus = "Rejected";  break;
        case "On Hold": workflowStatus = "OnHold";    break;
      }

      try {
        await getProfileData.UpdateCandidateStatus({
          workflowStatus,
          jobRequestId: recruitmentID,
          comments,
          actionBy:     "HOD",
        });
      } catch (wfErr) {
        console.warn("[updateCandidateStatusFull] WorkflowApi call failed (non-fatal):", wfErr);
      }
      let actionId = 0;
      let newStatusId = statusId;
      switch (hodDecision) {
        case "Yes":
          actionId    = WorkflowAction.Approved;  
          if (
            statusId === StatusId.PendingwithHODtoselectthecandidate ||
            statusId === StatusId.CandidateOnHoldbyHODLevel1
          ) {
            newStatusId = StatusId.PendingwithHODtoAssignPositionID; 
          } else {
            newStatusId = StatusId.Selected;
          }
          break;
        case "No":
          actionId    = WorkflowAction.Reject; 
          if (statusId === StatusId.PendingwithHODtoselectthecandidate) {
            newStatusId = StatusId.CandidateRejectedbyHODLevel1; 
          } else if (statusId === StatusId.PendingwithHODtoselectthecandidateLevel2) {
            newStatusId = StatusId.CandidateRejectedbyHODLevel2; 
          } else {
            newStatusId = StatusId.RejectedbyHOD; 
          }
          break;
        case "On Hold":
          actionId    = WorkflowAction.OnHold; 
          if (statusId === StatusId.PendingwithHODtoselectthecandidate) {
            newStatusId = StatusId.CandidateOnHoldbyHODLevel1; 
          } else if (statusId === StatusId.PendingwithHODtoselectthecandidateLevel2) {
            newStatusId = StatusId.CandidateOnHoldbyHODLevel2; 
          } else {
            newStatusId = StatusId.OnHoldbyHOD; 
          }
          break;
      }

      await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        ID:       candidateId,
        RequestJSON: {
          ActionId:          actionId,
          ItemCreated:       "Yes",
          GPA:               String(gpa || ""),
          OthersInterviewed: "No",
        },
      });

      return { success: true, message: "Candidate status updated successfully." };

    } catch (error: any) {
      console.error("[updateCandidateStatusFull] error:", error);
      return { success: false, message: error?.message || "An error occurred." };
    }
  },
  async fetchScorecardJobList(currentUserEmail: string = ""): Promise<ScorecardJobRow[]> {
    try {
      const filterOpts: any[] = [
        { FilterKey: "StatusId",    Operator: "eq", FilterValue: 28 },
        { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
      ];

      if (currentUserEmail) {
        filterOpts.push({ FilterKey: "HOD", Operator: "eq", FilterValue: currentUserEmail });
      }

      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentDptDetails,
        Select: `*,Department/DepartmentName,Department/ID,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title`,
        Expand: `Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode`,
        FilterCondition: "and",
        Filter: filterOpts,
        Topcount: 1000,
        Orderby: "ID",
        Orderbydecorasc: true,
      });

      if (!res || res.length === 0) return [];

      return res.map((item: any) => ({
        id:              String(item.ID),
        recruitmentID:   item.ID,
        jobCode:         item.JobCode?.JobCode || "",
        jobCodeID:       item.JobCode?.ID      || item.JobCodeId || 0,
        jobTitle:        item.JobTitleEnglish  || item.JobTitle || item.PositionTitle || item.Title || "N/A",
        department:      item.Department?.DepartmentName || "",
        nationality:     item.Nationality || "",
        statusId:        item.StatusId   || 0,
        status:          item.Status?.StatusDescription || "",
        grade:           "",
        noOfPositions:   item.NumberOfPersonNeeded || 1,
        businessUnitCode: item.BusinessUnitCode?.BusineesUnitCode || item.BusinessUnitCode?.Title || item.BusinessUnitCode || "",
        positionRequest: item.Type || item.PositionRequest || "New Position Request",
      }));
    } catch (e) {
      console.error("fetchScorecardJobList error:", e);
      return [];
    }
  },

  async fetchScorecardCandidates(
    recruitmentID:   number,
    jobCodeID:       number,
    currentUserEmail: string = "",
    candidateFilter: any[]   = []
  ): Promise<ScorecardCandidateRow[]> {
    try {
      const filter: any[] = candidateFilter && candidateFilter.length
        ? [...candidateFilter]
        : [
            { FilterKey: "RecruitmentIDId", Operator: "eq", FilterValue: recruitmentID },
            { FilterKey: "ItemCreated",     Operator: "eq", FilterValue: "No" },
            { FilterKey: "JobCodeId",       Operator: "eq", FilterValue: jobCodeID },
            {
              FilterKey: "StatusId",
              Operator: "in",
              FilterValue: [121, 122, 123, 15, 130, 127, 165, 166, 167, 168],
            },
          ];

      const res: any[] = await SPServices.SPReadItems({
        Listname:        ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:          "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
        Expand:          "JobCode,AssignByInterviewPanel,RecruitmentID,Status",
        FilterCondition: "and",
        Filter:          filter,
        Topcount:        1000,
      });

      // Prefer explicit candidate job grade; fallback to recruitment-level Paterson grade.
      const { grade: defaultGrade } = await this.getGradeAndLevel(recruitmentID);

      const enrichedWithGPA = await Promise.all(
        (res || []).map(async (item: any) => {
          let gpa: number | null = null;
          try {
            const panels: any[] = await SPServices.SPReadItems({
              Listname: ListNames.HRMSInterviewPanelDetails,
              Select:   "ID,InterviewLevel,CandidateID/ID",
              Expand:   "CandidateID",
              Filter:   [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: item.ID }],
            });

            const level1Count    = panels.filter(p => p.InterviewLevel === "Level 1").length;
            const maxOverallScore = level1Count * 40;
            let sumOverall = 0; let sumQuestion = 0; let maxQuestion = 0;

            for (const panel of panels) {
              const scorecards: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSCandidateScoreCard,
                Select:   "*",
                Filter:   [{ FilterKey: "InterviewPanelIDId", Operator: "eq", FilterValue: panel.ID }],
              });
              if (scorecards.length > 0) {
                const sc = scorecards[0];
                sumOverall +=
                  (Number(sc.RelevantQualification) || 0) +
                  (Number(sc.ReleventExperience)    || 0) +
                  (Number(sc.Knowledge)             || 0) +
                  (Number(sc.EnergyLevel)           || 0) +
                  (Number(sc.MeetJobRequirement)    || 0) +
                  (Number(sc.ContributeTowardsCultureRequried) || 0) +
                  (Number(sc.Experience)            || 0) +
                  (Number(sc.OtherCriteriaScore)    || 0);

                const questionData: any[] = _parseJson(sc.QuestionJson);
                const questionScore       = questionData.reduce((sum: number, q: any) => sum + (Number(Object.values(q)[0]) || 0), 0);
                sumQuestion += questionScore;
                maxQuestion += questionData.length * 3;
              }
            }

            const combined    = sumOverall + sumQuestion;
            const maxPossible = maxOverallScore + maxQuestion;
            if (maxPossible > 0) gpa = Math.floor((combined / maxPossible) * 5 * 100) / 100;
          } catch (e) {
            console.warn("GPA calc error for candidate", item.ID, e);
          }

          const candidateGrade = item.JobGrade || item.PatersonGrade || defaultGrade || "";
          console.log("[fetchScorecardCandidates] candidate", item.ID, "grade resolve", {
            jobGrade: item.JobGrade,
            patersonGrade: item.PatersonGrade,
            defaultGrade,
            resolvedGrade: candidateGrade,
          });

          return {
            id:             item.ID,
            recruitmentID:  item.RecruitmentID?.ID || recruitmentID,
            jobCode:        item.JobCode?.JobCode || "",
            jobCodeID:      item.JobCodeId        || jobCodeID,
            fullName:       [item.FristName, item.MiddleName, item.LastName].filter(Boolean).join(" ").trim(),
            nationality:    item.Nationality    || "",
            gender:         item.Gender         || "",
            status:         item.Status?.StatusDescription || item.Status || "",
            statusId:       item.StatusId       || item.Status?.ID || 0,
            interviewDate:  item.InterviewDate  || "",
            interviewLevel: item.InterviewLevel || "",
            grade:          defaultGrade,
            department:     item.Department     || "",
            gpa:            gpa !== null ? String(gpa) : "",
            positionTitle:  item.PositionTitle  || "",
            disability:     item.Disability     || "",
            jobTitle:       item.JobTitle        || "",
          } as ScorecardCandidateRow;
        })
      );

      return enrichedWithGPA;
    } catch (e) {
      console.error("fetchScorecardCandidates error", e);
      return [];
    }
  },

  async fetchScoreData(candidateID: number): Promise<RawScorecard[]> {
    try {
      const panels: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:   "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewLevel",
        Expand:   "InterviewPanel",
        Filter:   [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }],
      });

      const results: RawScorecard[] = [];
      for (const p of (panels || [])) {
        const sc: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSCandidateScoreCard,
          Select:   "*",
          Filter:   [{ FilterKey: "InterviewPanelIDId", Operator: "eq", FilterValue: p.ID }],
        });
        if (sc?.length) {
          const s = sc[0];
          console.log("[fetchScoreData] candidateID:", candidateID, "panelID:", p.ID, "panelName:", p.InterviewPanel?.Title);
          console.log("[fetchScoreData] raw scorecard response:", s);
          console.log("[fetchScoreData] mapped score values:", {
            RelevantQualification:            s.RelevantQualification || "0",
            ReleventExperience:               s.ReleventExperience || "0",
            Knowledge:                        s.Knowledge || "0",
            EnergyLevel:                      s.EnergyLevel || "0",
            MeetJobRequirement:               s.MeetJobRequirement || "0",
            ContributeTowardsCultureRequried: s.ContributeTowardsCultureRequried || "0",
            Experience:                       s.Experience || "0",
            OtherCriteriaScore:               s.OtherCriteriaScore || "0",
          });

          results.push({
            InterviewPanelID:                 p.ID,
            RelevantQualification:            s.RelevantQualification            || "0",
            ReleventExperience:               s.ReleventExperience               || "0",
            Knowledge:                        s.Knowledge                        || "0",
            EnergyLevel:                      s.EnergyLevel                      || "0",
            MeetJobRequirement:               s.MeetJobRequirement               || "0",
            ContributeTowardsCultureRequried: s.ContributeTowardsCultureRequried || "0",
            Experience:                       s.Experience                       || "0",
            OtherCriteriaScore:               s.OtherCriteriaScore               || "0",
            ConsiderForEmployment:            s.ConsiderForEmployment            || "",
            OverAllEvaluationFeedback:        s.OverAllEvaluationFeedback        || "",
            QuestionJson:                     _parseJson(s.QuestionJson),
            InterviewPersonName:              p.InterviewPanel?.Title            || "",
            CreatedDate:                      s.Created                          || "",
          });
        }
      }
      return results;
    } catch (e) {
      console.error(`[fetchScoreData] error`, e);
      return [];
    }
  },

  async fetchPanelByLevel(candidateID: number): Promise<Record<string, string[]>> {
    try {
      const panels: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:   "InterviewLevel,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail",
        Expand:   "InterviewPanel",
        Filter:   [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }],
      });

      const uniqueEmails: string[] = Array.from(new Set(
        (panels || []).map((p: any) => p.InterviewPanel?.EMail).filter(Boolean)
      )) as string[];

      const emailToName: Record<string, string> = {};
      await Promise.all(
        uniqueEmails.map(async (email: string) => {
          try {
            const sage: any[] = await SPServices.SPReadItems({
              Listname: ListNames.HRMSSageList,
              Select:   "EmailId,FirstName,LastName,MiddleName",
              Filter:   [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
            });
            if (sage?.length) {
              const u    = sage[0];
              const name = [u.FirstName, u.MiddleName, u.LastName].filter(Boolean).join(" ").trim();
              if (name) emailToName[email.toLowerCase()] = name;
            }
          } catch {}
        })
      );

      const grouped: Record<string, string[]> = {};
      for (const p of (panels || [])) {
        const lvl  = p.InterviewLevel || "Level 1";
        const name = emailToName[p.InterviewPanel?.EMail?.toLowerCase() || ""] || p.InterviewPanel?.Title || "";
        if (!grouped[lvl]) grouped[lvl] = [];
        if (name && !grouped[lvl].includes(name)) grouped[lvl].push(name);
      }
      return grouped;
    } catch (e) {
      return {};
    }
  },

  async fetchComments(candidateID: number): Promise<{ level1: CommentEntry[]; level2: CommentEntry[] }> {
    try {

      const panelItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:   "ID, CandidateID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail",
        Expand:   "InterviewPanel, CandidateID",
        Filter:   [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }],
      }).catch((): any[] => []);
      
      const scoreItems: any[] = await SPServices.SPReadItems({
        
        Listname: ListNames.HRMSCandidateScoreCard,
        Select:   "InterviewPanelID/ID, Feedback, OverAllEvaluationFeedback, Role/RoleTitle, InterviewPersonName/Title, Author/Title, Author/EMail, Created, QuestionJson, RecruitmentID/ID",
        Expand:   "InterviewPanelID, Role, InterviewPersonName, Author, RecruitmentID",
        FilterCondition: "and",
        Filter: [
          {
            FilterKey: "InterviewPanelID/CandidateID/ID",
            Operator:  "eq",
            FilterValue: candidateID,
          },
        ],
      }).catch((): any[] => []);
      const scorecardMap = new Map<number, any>();
      (scoreItems || []).forEach((sc: any) => {
        const pid = sc.InterviewPanelID?.ID || 0;
        if (pid) scorecardMap.set(pid, sc);
      });
      const authorEmails: string[] = Array.from(new Set(
        (scoreItems || [])
          .map((sc: any) => sc.Author?.EMail)
          .filter(Boolean)
      ));

      const emailToEmployee: Record<string, any> = {};
      if (authorEmails.length > 0) {
        try {
          await Promise.all(
            authorEmails.map(async (email: string) => {
              const sage: any[] = await SPServices.SPReadItems({
                Listname: ListNames.HRMSSageList,
                Select:   "EmailId, FirstName, MiddleName, LastName, JobTitle, JobTitleInEnglish, JobTitleInFrench, Department, DepartmentName",
                Filter:   [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
              });
              if (sage?.length) emailToEmployee[email.toLowerCase()] = sage[0];
            })
          );
        } catch (_) {}
      }
      const level1: CommentEntry[] = [];
      const seen = new Set<number>();
      for (const panel of (panelItems || [])) {
        const panelID  = panel.ID;
        const scoreCard = scorecardMap.get(panelID);
        if (!scoreCard) continue;
        if (seen.has(panelID)) continue;
        seen.add(panelID);

        const authorEmail  = (scoreCard.Author?.EMail || "").toLowerCase();
        const employee     = emailToEmployee[authorEmail];

        const firstName    = employee?.FirstName  || "";
        const middleName   = employee?.MiddleName || "";
        const lastName     = employee?.LastName   || "";
        const fullName     = [firstName, middleName, lastName].filter(Boolean).join(" ").trim()
                              || scoreCard.Author?.Title || "";

        const jobTitleEn   = employee?.JobTitleInEnglish || employee?.JobTitle || "";
        const jobTitleFr   = employee?.JobTitleInFrench  || "";
        const department   = employee?.DepartmentName    || employee?.Department || "";

        level1.push({
          Id:                       panelID,
          Name:                     fullName,
          JobTitleInEnglish:        jobTitleEn,
          JobTitleInFrench:         jobTitleFr,
          Department:               department,
          Date:                     scoreCard.Created || null,
          RoleName:                 scoreCard.Role?.RoleTitle || "",

          comments:                 scoreCard.Feedback || "",
          OverAllEvaluationFeedback: scoreCard.OverAllEvaluationFeedback || "",
          Level:                    "Level 1",
        });
      }

      const l2Items: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateLevel2ScoreCard,
        Select:   "ID, CandidateID/ID, CandidateID/Title, Comments, Role/ID, Role/RoleTitle, Level, Author/Title, Author/EMail, Created",
        Expand:   "CandidateID, Role, Author",
        Filter:   [{ FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateID }],
      }).catch((): any[] => []);


      const l2AuthorEmails: string[] = Array.from(new Set(
        (l2Items || []).map((i: any) => i.Author?.EMail).filter(Boolean)
      ));
      const l2EmailToEmployee: Record<string, any> = { ...emailToEmployee };
      if (l2AuthorEmails.length > 0) {
        try {
          await Promise.all(
            l2AuthorEmails
              .filter((e: string) => !l2EmailToEmployee[e.toLowerCase()])
              .map(async (email: string) => {
                const sage: any[] = await SPServices.SPReadItems({
                  Listname: ListNames.HRMSSageList,
                  Select:   "EmailId, FirstName, MiddleName, LastName, JobTitle, JobTitleInEnglish, JobTitleInFrench, Department, DepartmentName",
                  Filter:   [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
                });
                if (sage?.length) l2EmailToEmployee[email.toLowerCase()] = sage[0];
              })
          );
        } catch (_) {}
      }

      const level2: CommentEntry[] = (l2Items || []).map((item: any) => {
        const authorEmail = (item.Author?.EMail || "").toLowerCase();
        const employee    = l2EmailToEmployee[authorEmail];

        const firstName   = employee?.FirstName  || "";
        const middleName  = employee?.MiddleName || "";
        const lastName    = employee?.LastName   || "";
        const fullName    = [firstName, middleName, lastName].filter(Boolean).join(" ").trim()
                             || item.Author?.Title || "";

        return {
          Id:                       item.ID,
          Name:                     fullName,
          JobTitleInEnglish:        employee?.JobTitleInEnglish || employee?.JobTitle || "",
          JobTitleInFrench:         employee?.JobTitleInFrench  || "",
          Department:               employee?.DepartmentName    || employee?.Department || "",
          Date:                     item.Created || null,
          RoleName:                 item.Role?.RoleTitle || "",
          comments:                 item.Comments || "",
          OverAllEvaluationFeedback: "",
          Level:                    "Level 2",
        };
      });

      console.log("[fetchComments] candidateID:", candidateID,
        "level1 count:", level1.length, "level2 count:", level2.length,
        "level1:", level1, "level2:", level2);

      return { level1, level2 };
    } catch (e) {
      console.error("[fetchComments] error:", e);
      return { level1: [], level2: [] };
    }
  },

  async fetchPositionOptions(jobCodeID: number | string, department: string): Promise<PositionOption[]> {
    try {
      const filterConditions = [
        { FilterKey: "JobCode",        Operator: "eq", FilterValue: jobCodeID },
        { FilterKey: "Department",     Operator: "eq", FilterValue: department },
        { FilterKey: "PositionIDStatus", Operator: "eq", FilterValue: "Recruitment Initiator" },
      ];

      const res: any[] = await SPServices.SPReadItems({
        Listname:        ListNames.HRMSPositionIDMaster,
        Select:          "*,JobCode/JobCode",
        Expand:          "JobCode",
        FilterCondition: "and",
        Filter:          filterConditions,
        Topcount:        100,
      });

      if (res && res.length > 0) {
        return res.map((item: any) => ({
          key:  item.ID,
          text: item.PositionID || item.Title || `#${item.ID}`,
        }));
      }
      const fallback: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSPositionIDMaster,
        Select:   "*",
        Filter:   [
          { FilterKey: "Department",     Operator: "eq", FilterValue: department },
          { FilterKey: "PositionIDStatus", Operator: "eq", FilterValue: "Recruitment Initiator" },
        ],
        Topcount: 100,
      });

      return (fallback || []).map((item: any) => ({
        key:  item.ID,
        text: item.PositionID || item.Title || `#${item.ID}`,
      }));
    } catch (e) {
      console.error("[fetchPositionOptions] error:", e);
      return [];
    }
  },
};


function _parseJson(raw: any): Record<string, number>[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

async function _insertOrUpdateLevel1Comment(
  candidateId:  number,
  roleId:       number,
  comments:     string,
  level:        string = ""
): Promise<void> {
  try {
    const existing: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSRecruitmentCandidateComments,
      Select:   "*",
      Filter:   [{ FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateId }],
    });
    const match = existing.find(
      (item: any) =>
        (item.CandidateIDId === candidateId ||
          item.CandidateID?.ID === candidateId ||
          item.CandidateID === candidateId) &&
        item.RoleId === roleId
    );

    if (match) {
      await SPServices.SPUpdateItem({
        Listname:    ListNames.HRMSRecruitmentCandidateComments,
        RequestJSON: { Comments: comments, Level: level },
        ID:          match.ID,
      });
    } else {
      await SPServices.SPAddItem({
        Listname:    ListNames.HRMSRecruitmentCandidateComments,
        RequestJSON: {
          CandidateIDId: candidateId,
          Comments:      comments,
          RoleId:        roleId,
          Level:         level,
        },
      });
    }
  } catch (e) {
    console.error("[_insertOrUpdateLevel1Comment] error:", e);
  }
}

async function _insertOrUpdateLevel2Comment(
  candidateId: number,
  roleId:      number,
  comments:    string,
  level:       string = ""
): Promise<void> {
  try {
    const existing: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSCandidateLevel2ScoreCard,
      Select:   "*",
      Filter:   [{ FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateId }],
    });

    const match = existing.find(
      (item: any) => item.CandidateID?.ID === candidateId && item.RoleId === roleId
    );

    if (match) {
      await SPServices.SPUpdateItem({
        Listname:    ListNames.HRMSCandidateLevel2ScoreCard,
        RequestJSON: { Comments: comments, Level: level },
        ID:          match.ID,
      });
    } else {
      await SPServices.SPAddItem({
        Listname:    ListNames.HRMSCandidateLevel2ScoreCard,
        RequestJSON: {
          CandidateIDId: candidateId,
          Comments:      comments,
          RoleId:        roleId,
          Level:         level,
        },
      });
    }
  } catch (e) {
    console.error("[_insertOrUpdateLevel2Comment] error:", e);
  }
}

async function _assignPositionID(params: {
  positionId:    number;
  candidateId:   number;
  recruitmentID: number;
}): Promise<void> {
  try {
    const { positionId, candidateId, recruitmentID } = params;
    const posRes: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSPositionIDMaster,
      Select:   "*",
      Filter:   [{ FilterKey: "ID", Operator: "eq", FilterValue: positionId }],
    });

    if (!posRes || posRes.length === 0) return;
    const selectedPos = posRes[0];


    await SPServices.SPAddItem({
      Listname:    ListNames.HRMSSelectedCandidateDetailsByHOD,
      RequestJSON: {
        PositionIDId:    selectedPos.ID,
        CandidateIDId:   candidateId,
        RecruitmentIDId: recruitmentID,
        ItemCreated:     "Yes",
        ActionId:        WorkflowAction.Submitted,
        StatusId:        StatusId.Pending,
      },
    });
    await SPServices.SPUpdateItem({
      Listname:    ListNames.HRMSPositionIDMaster,
      RequestJSON: { PositionIDStatus: "Recruitment In Progress" },
      ID:          selectedPos.ID,
    });
  } catch (e) {
    console.error("[_assignPositionID] error:", e);
  }
}

export const EvaluationServiceHelper = {
  buildRow(
    candidate: any,
    grade:     string,
    level:     string,
    jobCodeID: number
  ): EvaluationCandidate {
    const rawDate        = candidate?.InterviewDateLevel2 || candidate?.InterviewDate || "";
    const formattedLevel = level === InterviewLevels.Level2 ? InterviewLevels.Levels2 : level;
    const interviewDateTime = rawDate ? moment(rawDate).format("DD/MM/YYYY") : "";

    const fName = candidate.FristName || "";
    const lName = candidate.LastName  || "";

    return {
      id:               candidate.ID,
      applicantName:    (fName + " " + lName).trim(),
      positionTitle:    candidate.PositionTitle || "",
      interviewDate:    interviewDateTime,
      interviewDateTime: rawDate,
      interviewLevel:   formattedLevel,
      grade,
      gradeLabel:       "",
      attachments:      candidate.CandidateCVDoc?.length || 0,
      status:           candidate.Status?.StatusDescription || candidate.Status || "",
      statusId:         candidate.StatusId || candidate.Status?.ID || candidate.Status?.Id || "",
      recruitmentID:    candidate.RecruitmentID?.ID || candidate.RecruitmentID || "",
      jobCodeID,
    };
  },
};