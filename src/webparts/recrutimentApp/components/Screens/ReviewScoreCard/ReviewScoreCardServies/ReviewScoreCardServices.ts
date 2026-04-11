import SPServices from "../../../../services/SPService/spservice";
import MasterService from "../../../../services/MasterService/MasterService";
import CommonService from "../../SelectionProcess/CommonServices/CommonServices";
import QuestionnaireApi from "../../Evalution/Evaluationservice/QuestionnaireApi/QuestionnaireApi";
import CareerPortalService from "../../../../services/CareerPortal/CareerPortalService";
import {
  ListNames,
  WorkflowAction,
  StatusId,
  workflowStatusApi,
} from "../../../../utilities/Config";
import {
  ButtonAction,
  EmployeementCategory,
  NationalityCode,
  RecuritmentHRMsg,
  RoleName,
} from "../../../../utilities/ConditionConfig";
import { WorkflowCandidateListConfig } from "../../../Hooks/WorkflowConfig";
import {
  DashboardServices,
  RecruitmentServices,
} from "../../../../services/ServiceExport";
const _common = new CommonService();
const _master = new MasterService();
const _questApi = new QuestionnaireApi();
const _careerPortal = new CareerPortalService();
export const HOD_SCORECARD_STATUS_IDS = [
  121, 122, 123, 15, 127, 130, 165, 166, 167, 168,
];
export const EDITABLE_STATUS_IDS = [121, 123, 127, 130, 165, 166];
export const VIEW_ONLY_STATUS_IDS = [122, 15, 167, 168];

export const canEdit = (statusId: number) =>
  EDITABLE_STATUS_IDS.includes(statusId);
export const canView = (statusId: number) =>
  VIEW_ONLY_STATUS_IDS.includes(statusId);
export const isLevel2 = (statusId: number) => statusId === 129;
export type HODDecision = "Yes" | "No" | "On Hold" | "";
export interface CandidateListItem {
  id: number;
  recruitmentID: number;
  fullName: string;
  positionTitle: string;
  interviewLevel: string;
  grade: string;
  gpa: string;
  status: string;
  statusId: number;
  nationality: string;
  gender: string;
  jobCodeID: number;
  jobCode: string;
  department: string;
  interviewDate: string;
  disability: string;
  jobTitle: string;
}

export interface CommentEntry {
  Id: number | null;
  Name: string;
  JobTitleInEnglish: string;
  JobTitleInFrench: string;
  Department: string;
  Date: any;
  RoleName: string;
  comments: string;
  OverAllEvaluationFeedback?: string;
  Level?: string;
}

export interface PositionOption {
  key: number;
  text: string;
}

export interface PanelMember {
  name: string;
  jobTitle: string;
  department: string;
  email: string;
}

export interface ReviewScoreCardQuestion {
  id: number;
  question: string;
  answer: string;
  rating?: number | null;
}

export interface ReviewScoreCardResult {
  success: boolean;
  candidateId: number;
  applicantName: string;
  nationality: string;
  gender: string;
  qualification: string;
  miningExp: string;
  relevantExp: string;
  interviewDate: string;
  interviewLevel: string;
  disability: string;
  conflictsOfInterest: string;
  positionTitle: string;
  grade: string;
  recruitmentId: number;
  jobCodeId: number;
  jobCode: string;
  department: string;
  panelMembers: PanelMember[];
  currentUserPanelId: number | null;
  currentUserGuid: string | null;
  reviewerName: string;
  jobTitleEn: string;
  jobTitleFr: string;
  questions: ReviewScoreCardQuestion[];
  scorecard: any[] | null;
  level2Scorecard: any | null;
  hodDecision: any | null;
  positionOptions: PositionOption[];
  level1Comments: CommentEntry[];
  level2Comments: CommentEntry[];
  statusId: number;
  jobRequestId: number | null;
}

export interface HODSubmitParams {
  candidateId: number;
  hodDecision: HODDecision;
  comments: string;
  currentUserEmail: string;
  currentRoleId: number;
  gpa: string;
  positionId: number | null;
  isLevel2: boolean;
  jobCodeID: number;
  recruitmentID: number;
  statusId: number;
  scoreCardId?: number | null;
  othersInterviewed?: string;
  jobRequestId?: number; // Added for portal workflow update
  isExapt: boolean;
}

function _parseJson(raw: any): Record<string, number>[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function _calculateGPA(candidateId: number): Promise<string> {
  try {
    const panels: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSInterviewPanelDetails,
      Select: "ID,InterviewLevel,CandidateID/ID",
      Expand: "CandidateID",
      Filter: [
        {
          FilterKey: "CandidateID/Id",
          Operator: "eq",
          FilterValue: candidateId,
        },
      ],
    });
    if (!panels?.length) return "";
    const level1Count = panels.filter(
      (p) => p.InterviewLevel === "Level 1",
    ).length;
    const maxOverallScore = level1Count * 40;
    let sumOverall = 0,
      sumQuestion = 0,
      maxQuestion = 0;
    for (const panel of panels) {
      const sc: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateScoreCard,
        Select: "*",
        Filter: [
          {
            FilterKey: "InterviewPanelIDId",
            Operator: "eq",
            FilterValue: panel.ID,
          },
        ],
      });
      if (sc.length > 0) {
        const s = sc[0];
        sumOverall +=
          (Number(s.RelevantQualification) || 0) +
          (Number(s.ReleventExperience) || 0) +
          (Number(s.Knowledge) || 0) +
          (Number(s.EnergyLevel) || 0) +
          (Number(s.MeetJobRequirement) || 0) +
          (Number(s.ContributeTowardsCultureRequried) || 0) +
          (Number(s.Experience) || 0) +
          (Number(s.OtherCriteriaScore) || 0);
        const qData = _parseJson(s.QuestionJson);
        const qScore = qData.reduce(
          (acc: number, q: any) => acc + (Number(Object.values(q)[0]) || 0),
          0,
        );
        sumQuestion += qScore;
        maxQuestion += qData.length * 3;
      }
    }
    const combined = sumOverall + sumQuestion,
      maxPossible = maxOverallScore + maxQuestion;
    if (maxPossible <= 0) return "";
    return String(Math.floor((combined / maxPossible) * 5 * 100) / 100);
  } catch (e) {
    console.warn("[_calculateGPA]", candidateId, e);
    return "";
  }
}

export async function _getUserGuid(email: string): Promise<string | null> {
  try {
    if (!email) return null;
    const res = await _common.getUserGuidByEmail(email);
    if (res?.status === 200 && res?.data?.key) return String(res.data.key);
    return null;
  } catch {
    return null;
  }
}
async function _getOthersInterviewed(jobCodeID: number): Promise<string> {
  try {
    const rows: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
      Select: "ID",
      Filter: [
        { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeID },
      ],
      Topcount: 100,
    });
    return rows.length > 1 ? "Yes" : "No";
  } catch {
    return "No";
  }
}
async function _insertOrUpdateLevel1Comment(
  candidateId: number,
  roleId: number,
  comments: string,
  level?: string,
): Promise<void> {
  try {
    const existing: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSRecruitmentCandidateComments,
      Select: "*",
      Filter: [
        {
          FilterKey: "CandidateIDId",
          Operator: "eq",
          FilterValue: candidateId,
        },
      ],
    });
    const match = existing.find((i: any) => i.RoleId === roleId);
    if (match) {
      await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentCandidateComments,
        RequestJSON: { Comments: comments, ...(level ? { Level: level } : {}) },
        ID: match.ID,
      });
    } else {
      await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentCandidateComments,
        RequestJSON: {
          CandidateIDId: candidateId,
          Comments: comments,
          RoleId: roleId,
          ...(level ? { Level: level } : {}),
        },
      });
    }
  } catch (e) {
    console.error("[_insertOrUpdateLevel1Comment]", e);
  }
}
async function _insertOrUpdateLevel2Comment(
  candidateId: number,
  roleId: number,
  comments: string,
  level?: string,
): Promise<void> {
  try {
    const existing: any[] = await SPServices.SPReadItems({
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
    const match = existing.find((i: any) => i.RoleId === roleId);
    if (match) {
      await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSCandidateLevel2ScoreCard,
        RequestJSON: { Comments: comments, ...(level ? { Level: level } : {}) },
        ID: match.ID,
      });
    } else {
      await SPServices.SPAddItem({
        Listname: ListNames.HRMSCandidateLevel2ScoreCard,
        RequestJSON: {
          CandidateIDId: candidateId,
          Comments: comments,
          RoleId: roleId,
          ...(level ? { Level: level } : {}),
        },
      });
    }
  } catch (e) {
    console.error("[_insertOrUpdateLevel2Comment]", e);
  }
}
async function _assignPositionID(p: {
  positionId: number;
  candidateId: number;
  recruitmentID: number;
  isExpat: boolean;
}): Promise<void> {
  try {
    const posRes: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSPositionIDMaster,
      Select: "*",
      Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: p.positionId }],
    });
    if (!posRes?.length) return;
    const pos = posRes[0];
    const Filter = [
      {
        FilterKey: "ID",
        Operator: "eq",
        FilterValue: p.recruitmentID,
      },
    ];
    let RecrutimentData = await RecruitmentServices.GetRecruitmentDetails(
      Filter,
      "",
    );
    console.log(RecrutimentData, "RecrutimentData");

    await SPServices.SPAddItem({
      Listname: ListNames.HRMSSelectedCandidateDetailsByHOD,
      RequestJSON: {
        PositionIDId: pos.ID,
        CandidateIDId: p.candidateId,
        RecruitmentIDId: p.recruitmentID,
        ItemCreated: "No",
        // ActionId: WorkflowAction.Submitted,
        StatusId: StatusId.PendingHRBGVInitiation,
        IsExpat: p.isExpat ? "Yes" : "No",
        RecruitmentHR: RecrutimentData.data[0]?.AssignEMail,
        RecruitmentHRLead: RecrutimentData.data[0]?.AssignHRLead,
        IsLabourHire:
          RecrutimentData.data[0]?.EmploymentCategory ===
          EmployeementCategory.LaborhireContractor
            ? "Yes"
            : "No",
      },
    });
    await SPServices.SPUpdateItem({
      Listname: ListNames.HRMSPositionIDMaster,
      RequestJSON: { PositionIDStatus: "Recruitment In Progress" },
      ID: pos.ID,
    });
  } catch (e) {
    console.error("[_assignPositionID]", e);
  }
}
async function _updatePortalWorkflowStatus(
  workflowStatus: string,
  jobRequestId: number,
  comments: string,
): Promise<void> {
  try {
    const data = {
      workflowStatus,
      jobRequestId: Number(jobRequestId),
      comments,
      actionBy: RoleName.HOD,
    };
    console.log("[_updatePortalWorkflowStatus] Sending data:", data);
    await _careerPortal.UpdateCandidateStatus(data);
  } catch (e) {
    console.error("[_updatePortalWorkflowStatus]", e);
  }
}

export const EMPTY = (id: number): ReviewScoreCardResult => ({
  success: false,
  candidateId: id,
  applicantName: "",
  nationality: "",
  gender: "",
  qualification: "",
  miningExp: "",
  relevantExp: "",
  interviewDate: "",
  interviewLevel: "",
  disability: "",
  conflictsOfInterest: "",
  positionTitle: "",
  grade: "",
  recruitmentId: 0,
  jobCodeId: 0,
  jobCode: "",
  department: "",
  panelMembers: [],
  currentUserPanelId: null,
  currentUserGuid: null,
  reviewerName: "",
  jobTitleEn: "",
  jobTitleFr: "",
  questions: [],
  scorecard: null,
  level2Scorecard: null,
  hodDecision: null,
  positionOptions: [],
  level1Comments: [],
  level2Comments: [],
  statusId: 0,
  jobRequestId: null,
});
class ReviewScoreCardServices {
  [x: string]: any;

  async getCandidatesByRecruitmentId(
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
            FilterKey: "RecruitmentIDId",
            Operator: "eq",
            FilterValue: recruitmentID,
          },
          { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
          {
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: HOD_SCORECARD_STATUS_IDS,
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
            isExapt:
              item?.NationalityCode === NationalityCode.Nationals
                ? false
                : true,
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
          ],
        }),
        _master.GetUserDetails(
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
            const r = await _master.GetUserDetails(
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
        hodDecisionData,
        positionOptionsData,
        commentsData,
      ] = await Promise.all([
        grade
          ? Promise.resolve(null)
          : _master.GetGradeLevel(raw.JobGrade || jobCodeStr).catch(() => null),
        jobCodeId
          ? _master
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
        this._getHODDecision(candidateId),
        this.fetchPositionOptions(jobCodeId, department),
        this.fetchComments(candidateId),
      ]);

      if (!grade && gradeRes?.data)
        grade = (gradeRes.data as any)?.GradeLevel ?? "";
      if (!interviewLevel)
        interviewLevel =
          raw.InterviewLevel ||
          String(raw.JobGrade || "").match(/Level\s*\d+/i)?.[0] ||
          "";

      const hodDecisionMerged = hodDecisionData
        ? {
            ...hodDecisionData,
            Comments: hodDecisionData.Comments || existingComment,
          }
        : existingComment
          ? { Comments: existingComment }
          : null;

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
        hodDecision: hodDecisionMerged,
        positionOptions: positionOptionsData,
        level1Comments: commentsData.level1,
        level2Comments: commentsData.level2,
        statusId,
        jobRequestId,
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
  async _getHODDecision(candidateId: number): Promise<any> {
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSSelectedCandidateDetailsByHOD,
        Select: "*,PositionID/PositionID,PositionID/ID",
        Expand: "PositionID",
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
            const r = await _master.GetUserDetails(
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
            const r = await _master.GetUserDetails(
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

  async fetchPositionOptions(
    jobCodeID: number | string,
    department: string,
  ): Promise<PositionOption[]> {
    try {
      console.log("jobCodeID:", jobCodeID);
      console.log("department:", department);

      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSPositionIDMaster,
        Select: "*,JobCode/JobCode,Department/DepartmentName",
        Expand: "JobCode,Department",
        FilterCondition: "and",
        Filter: [
          {
            FilterKey: "JobCode",
            Operator: "eq",
            FilterValue: jobCodeID,
          },
          {
            FilterKey: "Department/DepartmentName",
            Operator: "eq",
            FilterValue: department,
          },
          {
            FilterKey: "PositionIDStatus",
            Operator: "eq",
            FilterValue: "Recruitment Initiated",
          },
        ],
        Topcount: 100,
      });

      console.log("Position raw response:", res);

      const mapped = (res || []).map((item: any) => ({
        key: item.ID,
        text: item.PositionID || item.Title || `#${item.ID}`,
      }));

      console.log("Mapped position options:", mapped);

      return mapped;
    } catch (e) {
      console.error("[fetchPositionOptions]", e);
      return [];
    }
  }
  async submitHODDecision(
    params: HODSubmitParams,
  ): Promise<{ success: boolean; message: string }> {
    console.log("[ReviewScoreCardServices] submitHODDecision params:", params);
    try {
      const {
        candidateId,
        hodDecision,
        comments,
        currentUserEmail,
        currentRoleId,
        gpa,
        positionId,
        isLevel2: lv2,
        jobCodeID,
        recruitmentID,
        statusId,
        jobRequestId,
        isExapt,
      } = params;

      console.log(
        "[ReviewScoreCardServices] submitHODDecision branch: isLevel2 =",
        lv2,
      );
      if (lv2) {
        console.log("Branch 1 Step 1: Saving Level 2 comment");
        await _insertOrUpdateLevel2Comment(
          candidateId,
          currentRoleId,
          comments,
        );
        console.log("Branch 1 Step 1: Level 2 comment saved");
        console.log("Branch 1 Step 2: Marking user panel as uploaded");
        const currentUserGuid = await _getUserGuid(currentUserEmail);
        const allPanels: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select:
            "ID,CandidateID/ID,InterviewLevel,InterviewPanel/Id,IsScoreSheetUploaded",
          Expand: "InterviewPanel,CandidateID",
          Filter: [
            {
              FilterKey: "CandidateID/Id",
              Operator: "eq",
              FilterValue: candidateId,
            },
          ],
        });
        const matchingPanels = allPanels.filter(
          (p: any) => p.CandidateID?.ID === candidateId,
        );
        const userPanels = matchingPanels.filter(
          (p: any) => String(p.InterviewPanel?.Id) === String(currentUserGuid),
        );
        for (const panel of userPanels) {
          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSInterviewPanelDetails,
            RequestJSON: { IsScoreSheetUploaded: "Yes" },
            ID: panel.ID,
          });
        }

        console.log("Branch 1 Step 2: User panels marked as uploaded");
        console.log("Branch 1 Step 3: Checking if all Level 2 panels uploaded");
        const refreshed: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select: "ID,CandidateID/ID,InterviewLevel,IsScoreSheetUploaded",
          Expand: "CandidateID",
          Filter: [
            {
              FilterKey: "CandidateID/Id",
              Operator: "eq",
              FilterValue: candidateId,
            },
          ],
        });
        console.log(
          "Branch 1 Step 3: Refreshed panels details:",
          refreshed.map((p) => ({
            id: p.ID,
            interviewLevel: p.InterviewLevel,
          })),
        );
        const level2Panels = refreshed.filter(
          (p: any) => p.InterviewLevel === "Level 2",
        ); // 'Level 2' matches HRMSInterviewPanelDetails.InterviewLevel
        const uploadedCount = level2Panels.filter(
          (p: any) => p.IsScoreSheetUploaded === "Yes",
        ).length;
        console.log(
          "Branch 1 Step 3: Level 2 panels found =",
          level2Panels.length,
          "uploadedCount =",
          uploadedCount,
        );
        if (uploadedCount === level2Panels.length && level2Panels.length > 0) {
          let BtnAction =
            params.hodDecision === "Yes"
              ? ButtonAction.Approve
              : params.hodDecision === "On Hold"
                ? ButtonAction.OnHold
                : ButtonAction.Reject;
          const StatusID = WorkflowCandidateListConfig(
            statusId,
            params.isLevel2,
            BtnAction,
          );
          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
            RequestJSON: {
              ScoreCardLevelItemCreated: "Yes",
              // ActionId: WorkflowAction.Approved,
              // ItemCreated: "Yes",
              StatusId: StatusID,
            },
            ID: candidateId,
          });
        }
        console.log(
          "Branch 1 Step 3: Checked panels, uploadedCount =",
          uploadedCount,
          "total =",
          level2Panels.length,
        );
        return {
          success: true,
          message: "✓ Level 2 scorecard submitted successfully.",
        };
      }
      console.log("Branch 2 Step 1: Calculating OthersInterviewed");
      const othersInterviewed = await _getOthersInterviewed(jobCodeID);
      console.log("Branch 2 Step 1: OthersInterviewed =", othersInterviewed);
      const isLevel2StatusId =
        statusId === StatusId.pendingL2shorlistingwithHOD ||
        statusId === StatusId.CandidateOnHoldbyHODLevel1;

      let actionId: number, workflowStatus: string, successMsg: string;
      let ActionID =
        hodDecision === "Yes"
          ? ButtonAction.Approve
          : hodDecision === "No"
            ? ButtonAction.Reject
            : ButtonAction.OnHold;
      let StatusID = WorkflowCandidateListConfig(
        statusId,
        params.isLevel2,
        ActionID,
      );
      switch (hodDecision) {
        case "Yes":
          actionId = WorkflowAction.Approved;
          workflowStatus = workflowStatusApi.CandidateSelectedIPanel;
          successMsg = isLevel2StatusId
            ? RecuritmentHRMsg.CandidateSelectedLevel2
            : RecuritmentHRMsg.CandidateSelected;
          break;
        case "No":
          actionId = WorkflowAction.Reject;
          workflowStatus = workflowStatusApi.CandidateRejectedIPanel;
          successMsg = isLevel2StatusId
            ? RecuritmentHRMsg.CandidateRejectedLevel2
            : RecuritmentHRMsg.CandidateRejected;
          break;
        case "On Hold":
          actionId = WorkflowAction.OnHold;
          workflowStatus = workflowStatusApi.CandidateOnHoldIPanel;
          successMsg = isLevel2StatusId
            ? RecuritmentHRMsg.CandidateonholdLevel2
            : RecuritmentHRMsg.CandidateOnHold;
          break;
        default:
          return { success: false, message: "Invalid decision." };
      }

      console.log(
        "Branch 2 Step 2: Mapped decision",
        hodDecision,
        "to actionId =",
        actionId,
        "workflowStatus =",
        workflowStatus,
      );
      await SPServices.SPUpdateItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: {
          // ActionId: actionId,
          StatusId: StatusID,
          // ItemCreated: "Yes",
          GPA: gpa || "",
          OthersInterviewed: othersInterviewed,
        },
        ID: candidateId,
      });

      console.log(
        "Branch 2 Step 3: Candidate updated with actionId =",
        actionId,
        "GPA =",
        gpa,
        "OthersInterviewed =",
        othersInterviewed,
      );
      await _updatePortalWorkflowStatus(
        workflowStatus,
        Number(jobRequestId),
        comments,
      );
      console.log(
        "Branch 2 Step 4: Portal workflow updated to",
        workflowStatus,
      );
      await _insertOrUpdateLevel1Comment(
        candidateId,
        currentRoleId,
        comments,
        "Level 1",
      );
      console.log("Branch 2 Step 5: Level 1 comment saved (Level 1)");
      if (hodDecision === "Yes" && positionId) {
        console.log("Branch 2 Step 6: Assigning position ID", positionId);
        await _assignPositionID({
          positionId,
          candidateId,
          recruitmentID,
          isExpat: params.isExapt,
        });
        console.log("Branch 2 Step 6: Position assigned");
      }
      if ((hodDecision === "No" || hodDecision === "On Hold") && positionId) {
        console.log(
          "Branch 2 Step 7: Reverting position status for ID",
          positionId,
        );
        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSPositionIDMaster,
          RequestJSON: { PositionIDStatus: "Recruitment Initiated" },
          ID: positionId,
        });
        console.log("Branch 2 Step 7: Position status reverted");
      }

      console.log(
        "[ReviewScoreCardServices] submitHODDecision success:",
        successMsg,
      );
      return { success: true, message: successMsg };
    } catch (e) {
      console.error("[submitHODDecision]", e);
      return { success: false, message: RecuritmentHRMsg.APIErrorMsg };
    }
  }
}

export default new ReviewScoreCardServices();
