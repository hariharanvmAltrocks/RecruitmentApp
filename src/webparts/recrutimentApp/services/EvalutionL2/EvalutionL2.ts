import QuestionnaireApi from "../../components/Screens/Evalution/Evaluationservice/QuestionnaireApi/QuestionnaireApi";
import {
  CandidateListItem,
  HOD_SCORECARD_STATUS_IDS,
  ReviewScoreCardResult,
  ReviewScoreCardQuestion,
  _calculateGPA,
  _getUserGuid,
  PanelMember,
  CommentEntry,
  EMPTY,
} from "../../components/Screens/ReviewScoreCard/ReviewScoreCardServies/ReviewScoreCardServices";
import { InterviewLevels } from "../../utilities/ConditionConfig";
import { ListNames, StatusId } from "../../utilities/Config";
import { masterService } from "../ServiceExport";
import SPServices from "../SPService/spservice";
import {
  IEvalutionL2,
  SubmitEvaluationL2Payload,
  SubmitEvaluationL2Result,
} from "./IEvalutionL2";

export default class EvalutionL2Service implements IEvalutionL2 {
  async getCandidatesByRecruitmentId(
    candidateID: number,
    recruitmentID: number,
  ): Promise<CandidateListItem[]> {
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:
          "*,JobCode/JobCode,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
        Expand: "JobCode,RecruitmentID,Status",
        FilterCondition: "and",
        Filter: [
          {
            FilterKey: "ID",
            Operator: "eq",
            FilterValue: candidateID,
          },
          { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
          {
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: StatusId.InterviewLevel2InProgress,
          },
        ],
        Topcount: 1000,
      });
      let defaultGrade = "",
        defaultLevel = "";
      try {
        const posRes: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSRecruitmentPositionDetails,
          Select: "*,PatersonGrade/PatersonGrade",
          Expand: "PatersonGrade",
          Filter: [
            {
              FilterKey: "RecruitmentID",
              Operator: "eq",
              FilterValue: recruitmentID,
            },
          ],
        });
        defaultGrade =
          posRes?.[0]?.PatersonGrade?.PatersonGrade ||
          posRes?.[0]?.PatersonGrade ||
          "";
        if (defaultGrade) {
          const gr: any[] = await SPServices.SPReadItems({
            Listname: ListNames.HRMSGradeMaster,
            Select: "*",
            Filter: [
              {
                FilterKey: "PatersonGrade",
                Operator: "eq",
                FilterValue: defaultGrade,
              },
            ],
          });
          defaultLevel = gr?.[0]?.Levels || "";
        }
      } catch (_) {}
      const enriched = await Promise.all(
        (res || []).map(async (item: any) => {
          const candidateId = item.ID;
          const gpa = await _calculateGPA(candidateId);
          return {
            id: candidateId,
            recruitmentID: item.RecruitmentID?.ID || recruitmentID,
            fullName: [item.FristName, item.MiddleName, item.LastName]
              .filter(Boolean)
              .join(" ")
              .trim(),
            positionTitle: item.PositionTitle || "",
            interviewLevel: item.InterviewLevel || defaultLevel,
            grade: item.JobGrade || item.PatersonGrade || defaultGrade || "",
            gpa,
            status: item.Status?.StatusDescription || item.Status || "",
            statusId: item.StatusId || item.Status?.ID || 0,
            nationality: item.Nationality || "",
            gender: item.Gender || "",
            jobCodeID: item.JobCodeId || 0,
            jobCode: item.JobCode?.JobCode || "",
            department: item.Department || "",
            interviewDate: (
              item.InterviewDateLevel2 ||
              item.InterviewDate ||
              ""
            ).split("T")[0],
            disability: item.Disability || "",
            jobTitle: item.PositionTitle || "",
          } as CandidateListItem;
        }),
      );
      return enriched;
    } catch (e) {
      console.error("[getCandidatesByRecruitmentId]", e);
      return [];
    }
  }

  async getReviewScoreCardData(
    candidateId: number,
    currentUserEmail: string,
    candidate?: any,
  ): Promise<ReviewScoreCardResult> {
    try {
      const _questApi = new QuestionnaireApi();
      const [candidateRows, currentUserGuid] = await Promise.all([
        SPServices.SPReadItems({
          Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
          Select: [
            "ID",
            "FristName",
            "MiddleName",
            "LastName",
            "Nationality",
            "Gender",
            "Qualification",
            "TotalYearOfExperiance",
            "ReleventExperience",
            "InterviewDate",
            "InterviewDateLevel2",
            "Disability",
            "ConflictsOfInterest",
            "PositionTitle",
            "JobGrade",
            "JobCodeId",
            "StatusId",
            "Comments",
            "JobRequestID",
            "RecruitmentID/ID",
            "JobCode/JobCode",
            "JobCode/ID",
          ].join(","),
          Expand: "RecruitmentID,JobCode",
          Filter: [
            { FilterKey: "ID", Operator: "eq", FilterValue: candidateId },
          ],
        }),
        _getUserGuid(currentUserEmail),
      ]);
      const raw = (candidateRows as any[])?.[0] ?? {};
      const recruitmentId = raw.RecruitmentID?.ID ?? raw.RecruitmentIDId ?? 0;
      const jobCodeId =
        raw.JobCodeId ?? raw.JobCode?.ID ?? candidate?.jobCodeID ?? 0;
      const jobCodeStr = raw.JobCode?.JobCode ?? candidate?.jobCode ?? "";
      const department = raw.Department ?? candidate?.department ?? "";
      const statusId = raw.StatusId ?? candidate?.statusId ?? 0;
      const fullName = [raw.FristName, raw.MiddleName, raw.LastName]
        .filter(Boolean)
        .join(" ")
        .trim();
      const interviewDate = (
        raw.InterviewDateLevel2 ||
        raw.InterviewDate ||
        ""
      ).split("T")[0];
      const existingComment = raw.Comments || "";
      const jobRequestId = raw.JobRequestID ?? raw.JobRequestId ?? null;

      const [panelRows, reviewerRes] = await Promise.all([
        SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select:
            "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded",
          Expand: "InterviewPanel",
          Filter: [
            {
              FilterKey: "CandidateID/Id",
              Operator: "eq",
              FilterValue: candidateId,
            },
            {
              FilterKey: "InterviewLevel",
              Operator: "eq",
              FilterValue: InterviewLevels.Level2,
            },
          ],
        }),
        masterService.GetUserDetails(
          [
            {
              FilterKey: "EmailId",
              Operator: "eq",
              FilterValue: currentUserEmail,
            },
          ],
          "and",
        ),
      ]);

      const currentUserPanel = (panelRows as any[]).find(
        (p: any) => String(p.InterviewPanel?.Id) === String(currentUserGuid),
      );
      const uniqueEmails: string[] = Array.from(
        new Set(
          (panelRows as any[])
            .map((p: any) => p.InterviewPanel?.EMail)
            .filter(Boolean),
        ),
      );
      const emailToDetails: Record<
        string,
        { name: string; jobTitle: string; department: string }
      > = {};
      await Promise.all(
        uniqueEmails.map(async (email: string) => {
          try {
            const r = await masterService.GetUserDetails(
              [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
              "and",
            );
            if (r?.data) {
              const name = [
                r.data.FirstName,
                r.data.MiddleName,
                r.data.LastName,
              ]
                .filter(Boolean)
                .join(" ")
                .trim();
              if (name)
                emailToDetails[email.toLowerCase()] = {
                  name,
                  jobTitle: r.data.JopTitleEnglish ?? "",
                  department: r.data.DepartmentName ?? "",
                };
            }
          } catch {}
        }),
      );
      const panelMembers: PanelMember[] = (panelRows as any[])
        .map((p: any) => {
          const email = (p.InterviewPanel?.EMail ?? "").toLowerCase();
          const d = emailToDetails[email];
          return d
            ? {
                name: d.name,
                jobTitle: d.jobTitle,
                department: d.department,
                email: p.InterviewPanel?.EMail ?? "",
              }
            : {
                name: p.InterviewPanel?.Title || "",
                jobTitle: "",
                department: "",
                email: p.InterviewPanel?.EMail ?? "",
              };
        })
        .filter((m) => !!m.name);

      const reviewer = reviewerRes?.data;
      const reviewerName = reviewer
        ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName]
            .filter(Boolean)
            .join(" ")
            .trim()
        : "";
      const jobTitleEn = reviewer?.JopTitleEnglish ?? "";
      const jobTitleFr = reviewer?.JopTitleFrench ?? "";
      let grade = raw.JobGrade ?? candidate?.grade ?? "";
      let interviewLevel =
        raw.InterviewLevel ?? candidate?.interviewLevel ?? "";

      const [
        gradeRes,
        questionsResult,
        scorecardData,
        level2ScorecardData,
        commentsData,
      ] = await Promise.all([
        grade
          ? Promise.resolve(null)
          : masterService
              .GetGradeLevel(raw.JobGrade || jobCodeStr)
              .catch(() => null),
        jobCodeId
          ? masterService
              .GetJobUniqueDataValue(jobCodeId)
              .then(async (r: any) => {
                const key = r?.data?.JobCode ?? "";
                if (!key) return [];
                const qRes = await _questApi.getQuestionnaire(key);
                return (qRes?.data ?? []).map((q: any) => ({
                  id: q.id,
                  question: q.question,
                  answer: q.answer ?? "",
                  rating: null,
                }));
              })
              .catch(() => [])
          : Promise.resolve([]),
        this._getCandidateScorecard(candidateId),
        this._getLevel2Scorecard(candidateId),
        this.fetchComments(candidateId),
      ]);

      if (!grade && gradeRes?.data)
        grade = (gradeRes.data as any)?.GradeLevel ?? "";
      if (!interviewLevel)
        interviewLevel =
          raw.InterviewLevel ||
          String(raw.JobGrade || "").match(/Level\s*\d+/i)?.[0] ||
          "";

      return {
        success: true,
        candidateId,
        applicantName: fullName,
        nationality: raw.Nationality ?? "",
        gender: raw.Gender ?? "",
        qualification: raw.Qualification ?? "",
        miningExp: raw.TotalYearOfExperiance ?? "",
        relevantExp: raw.ReleventExperience ?? "",
        interviewDate,
        interviewLevel,
        disability: raw.Disability ?? raw.disability ?? "",
        conflictsOfInterest: raw.ConflictsOfInterest ?? "",
        positionTitle: raw.PositionTitle ?? "",
        grade,
        recruitmentId,
        jobCodeId,
        jobCode: jobCodeStr,
        department,
        panelMembers,
        currentUserPanelId: currentUserPanel?.ID ?? null,
        currentUserGuid,
        reviewerName,
        jobTitleEn,
        jobTitleFr,
        questions: questionsResult as ReviewScoreCardQuestion[],
        scorecard: scorecardData,
        level2Scorecard: level2ScorecardData,
        level1Comments: commentsData.level1,
        level2Comments: commentsData.level2,
        statusId,
        jobRequestId,
        hodDecision: null,
        positionOptions: [],
      };
    } catch (error) {
      console.error("[getReviewScoreCardData]", error);
      return EMPTY(candidateId);
    }
  }

  async _getCandidateScorecard(candidateId: number): Promise<any[] | null> {
    try {
      const panels: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select: "ID,InterviewPanel/Title,InterviewLevel",
        Expand: "InterviewPanel",
        Filter: [
          {
            FilterKey: "CandidateID/Id",
            Operator: "eq",
            FilterValue: candidateId,
          },
        ],
      });
      const allScores: any[] = [];
      for (const p of panels) {
        const sc: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSCandidateScoreCard,
          Select: "*",
          Filter: [
            {
              FilterKey: "InterviewPanelIDId",
              Operator: "eq",
              FilterValue: p.ID,
            },
          ],
        });
        if (sc?.length)
          allScores.push({
            ...sc[0],
            InterviewPersonName: p.InterviewPanel?.Title || "",
            InterviewLevel: p.InterviewLevel || "",
          });
      }
      return allScores.length > 0 ? allScores : null;
    } catch (e) {
      console.error("[_getCandidateScorecard]", e);
      return null;
    }
  }

  async _getLevel2Scorecard(candidateId: number): Promise<any> {
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateLevel2ScoreCard,
        Select: "*",
        Filter: [
          {
            FilterKey: "CandidateIDId",
            Operator: "eq",
            FilterValue: candidateId,
          },
        ],
      });
      return res?.[0] ?? null;
    } catch {
      return null;
    }
  }

  async fetchComments(
    candidateId: number,
  ): Promise<{ level1: CommentEntry[]; level2: CommentEntry[] }> {
    try {
      const [panelItems, level2Items] = await Promise.all([
        SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select:
            "ID,CandidateID/ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,IsScoreSheetUploaded",
          Expand: "InterviewPanel,RecruitmentID,CandidateID",
          Filter: [
            {
              FilterKey: "CandidateID/Id",
              Operator: "eq",
              FilterValue: candidateId,
            },
          ],
        }).catch(() => []),
        SPServices.SPReadItems({
          Listname: ListNames.HRMSCandidateLevel2ScoreCard,
          Select:
            "*,ID,CandidateID/ID,CandidateID/Title,Comments,Role/ID,Role/RoleTitle,Level,Author/EMail,Author/Title",
          Expand: "CandidateID,Role,Author",
          Filter: [
            {
              FilterKey: "CandidateIDId",
              Operator: "eq",
              FilterValue: candidateId,
            },
          ],
        }).catch(() => []),
      ]);

      const panelEmails: string[] = Array.from(
        new Set(
          (panelItems as any[])
            .map((p: any) => p.InterviewPanel?.EMail)
            .filter(Boolean),
        ),
      );
      const empMap: Record<
        string,
        {
          name: string;
          jobTitle: string;
          jobTitleFr: string;
          department: string;
        }
      > = {};
      await Promise.all(
        panelEmails.map(async (email: string) => {
          try {
            const r = await masterService.GetUserDetails(
              [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
              "and",
            );
            if (r?.data) {
              const d = r.data;
              const name = [d.FirstName, d.MiddleName, d.LastName]
                .filter(Boolean)
                .join(" ")
                .trim();
              empMap[email.toLowerCase()] = {
                name,
                jobTitle: d.JopTitleEnglish || "",
                jobTitleFr: d.JopTitleFrench || "",
                department: d.DepartmentName || "",
              };
            }
          } catch {}
        }),
      );

      const level1: CommentEntry[] = [];
      for (const panel of panelItems as any[]) {
        if (panel.CandidateID?.ID !== candidateId) continue;
        const panelEmail = (panel.InterviewPanel?.EMail ?? "").toLowerCase();
        const emp = empMap[panelEmail];
        let scorecard: any = null;
        try {
          const scRows: any[] = await SPServices.SPReadItems({
            Listname: ListNames.HRMSCandidateScoreCard,
            Select:
              "ID,Feedback,OverAllEvaluationFeedback,Created,Role/RoleTitle,Author/EMail,Author/Title",
            Expand: "Role,Author",
            Filter: [
              {
                FilterKey: "InterviewPanelIDId",
                Operator: "eq",
                FilterValue: panel.ID,
              },
            ],
          });
          scorecard = scRows?.[0] ?? null;
        } catch {}
        const feedbackComment = scorecard?.Feedback || "";
        const overallFeedback = scorecard?.OverAllEvaluationFeedback || "";
        if (!feedbackComment && !overallFeedback) continue;
        level1.push({
          Id: panel.ID,
          Name:
            emp?.name ||
            scorecard?.Author?.Title ||
            panel.InterviewPanel?.Title ||
            "",
          JobTitleInEnglish: emp?.jobTitle || "",
          JobTitleInFrench: emp?.jobTitleFr || "",
          Department: emp?.department || "",
          Date: scorecard?.Created ? new Date(scorecard.Created) : null,
          RoleName: scorecard?.Role?.RoleTitle || "",
          comments: feedbackComment,
          OverAllEvaluationFeedback: overallFeedback,
          Level: "Level 1",
        });
      }

      const l2Emails: string[] = Array.from(
        new Set(
          (level2Items as any[])
            .map((i: any) => i.Author?.EMail)
            .filter(Boolean),
        ),
      );
      const l2EmpMap: Record<
        string,
        {
          name: string;
          jobTitle: string;
          jobTitleFr: string;
          department: string;
        }
      > = {};
      await Promise.all(
        l2Emails.map(async (email: string) => {
          try {
            const r = await masterService.GetUserDetails(
              [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
              "and",
            );
            if (r?.data) {
              const d = r.data;
              const name = [d.FirstName, d.MiddleName, d.LastName]
                .filter(Boolean)
                .join(" ")
                .trim();
              l2EmpMap[email.toLowerCase()] = {
                name,
                jobTitle: d.JopTitleEnglish || "",
                jobTitleFr: d.JopTitleFrench || "",
                department: d.DepartmentName || "",
              };
            }
          } catch {}
        }),
      );

      const level2: CommentEntry[] = (level2Items as any[])
        .filter(
          (i: any) =>
            i.CandidateID?.ID === candidateId ||
            i.CandidateIDId === candidateId,
        )
        .map((i: any): CommentEntry => {
          const email = (i.Author?.EMail ?? "").toLowerCase();
          const emp = l2EmpMap[email];
          return {
            Id: i.ID ?? null,
            Name: emp?.name || i.Author?.Title || "",
            JobTitleInEnglish: emp?.jobTitle || i.JobTitleInEnglish || "",
            JobTitleInFrench: emp?.jobTitleFr || i.JobTitleInFrench || "",
            Department: emp?.department || i.Department || "",
            Date: i.Created ? new Date(i.Created) : null,
            RoleName: i.Role?.RoleTitle || i.RoleName || "",
            comments: i.Comments || i.comments || "",
            OverAllEvaluationFeedback: i.OverAllEvaluationFeedback || "",
            Level: "Level 2",
          };
        });

      return { level1, level2 };
    } catch (e) {
      console.error("[fetchComments]", e);
      return { level1: [], level2: [] };
    }
  }

  async submitEvaluationL2(
    payload: SubmitEvaluationL2Payload,
  ): Promise<SubmitEvaluationL2Result> {
    const { candidateId, panelId, comments } = payload;

    await SPServices.SPUpdateItem({
      Listname: ListNames.HRMSInterviewPanelDetails,
      RequestJSON: {
        IsScoreSheetUploaded: "Yes",
      },
      ID: panelId,
    });

    await SPServices.SPAddItem({
      Listname: ListNames.HRMSCandidateLevel2ScoreCard,
      RequestJSON: {
        Comments: comments.Comments,
        CandidateIDId: comments.CandidateIDId,
        RoleId: comments.RoleId,
        Level: comments.level,
      },
    });

    const updatedPanelRows: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSInterviewPanelDetails,
      Select: "ID,InterviewLevel,IsScoreSheetUploaded",
      Filter: [
        {
          FilterKey: "CandidateIDId",
          Operator: "eq",
          FilterValue: candidateId,
        },
      ],
    });

    const level2Panels = updatedPanelRows.filter(
      (p: any) => p.InterviewLevel === InterviewLevels.Level2,
    );
    const submittedCount = level2Panels.filter(
      (p: any) => p.IsScoreSheetUploaded === "Yes",
    ).length;


    let hodWorkflowTriggered = false;

    if (level2Panels.length > 0 && submittedCount === level2Panels.length) {

      await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: {
          IsScoreSheetUploaded: "Yes",
          StatusId: StatusId.PendingwithpositionIDAssignmentWithHOD,
        },
        ID: candidateId,
      });

      hodWorkflowTriggered = true;
      console.log(
        "[submitEvaluationL2] Candidate SP record updated — HOD workflow triggered ✅",
      );
    } else {
      console.log(
        `[submitEvaluationL2] HOD workflow NOT triggered — ${level2Panels.length - submittedCount} panel(s) still pending`,
      );
    }

    return { success: true, hodWorkflowTriggered };
  }
}
