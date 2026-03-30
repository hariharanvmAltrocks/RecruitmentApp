// ReviewScoreCardServies/ReviewScoreCardServices.ts
// All API calls for the ReviewScoreCard feature.
// GPA calculation mirrors old EvaluationApiService.fetchScorecardCandidates exactly:
//   sumOverall  = 8 criteria scores (each 0-5) — Level 1 panels only
//   sumQuestion = question scores (each 0-3)
//   maxOverall  = level1Count × 40
//   maxQuestion = questionCount × 3
//   GPA         = floor((sumOverall + sumQuestion) / (maxOverall + maxQuestion) × 5 × 100) / 100

import SPServices    from '../../../../services/SPService/spservice';
import MasterService from '../../../../services/MasterService/MasterService';
import CommonService from '../../SelectionProcess/CommonServices/CommonServices';
import QuestionnaireApi from '../../Evalution/Evaluationservice/QuestionnaireApi/QuestionnaireApi';
import { ListNames, WorkflowAction, StatusId } from '../../../../utilities/Config';

const _common   = new CommonService();
const _master   = new MasterService();
const _questApi = new QuestionnaireApi();

// ── Status constants ──────────────────────────────────────────────────────────
export const HOD_SCORECARD_STATUS_IDS = [
  121, 122, 123, 15, 127, 130, 165, 166, 167, 168,
];
export const EDITABLE_STATUS_IDS  = [121, 123, 127, 130, 165, 166];
export const VIEW_ONLY_STATUS_IDS = [122, 15, 167, 168];

export const canEdit  = (statusId: number) => EDITABLE_STATUS_IDS.includes(statusId);
export const canView  = (statusId: number) => VIEW_ONLY_STATUS_IDS.includes(statusId);
export const isLevel2 = (statusId: number) => [130, 129, 127, 166].includes(statusId);

export type HODDecision = "Yes" | "No" | "On Hold" | "";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CandidateListItem {
  id:             number;
  recruitmentID:  number;
  fullName:       string;
  positionTitle:  string;
  interviewLevel: string;
  grade:          string;
  gpa:            string;
  status:         string;
  statusId:       number;
  nationality:    string;
  gender:         string;
  jobCodeID:      number;
  jobCode:        string;
  department:     string;
  interviewDate:  string;
  disability:     string;
  jobTitle:       string;
}

export interface CommentEntry {
  Id:                         number | null;
  Name:                       string;
  JobTitleInEnglish:          string;
  JobTitleInFrench:           string;
  Department:                 string;
  Date:                       any;
  RoleName:                   string;
  comments:                   string;
  OverAllEvaluationFeedback?: string;
  Level?:                     string;
}

export interface PositionOption {
  key:  number;
  text: string;
}

export interface PanelMember {
  name:       string;
  jobTitle:   string;
  department: string;
  email:      string;
}

export interface ReviewScoreCardQuestion {
  id:       number;
  question: string;
  answer:   string;
  rating?:  number | null;
}

export interface ReviewScoreCardResult {
  success:              boolean;
  candidateId:          number;
  applicantName:        string;
  nationality:          string;
  gender:               string;
  qualification:        string;
  miningExp:            string;
  relevantExp:          string;
  interviewDate:        string;
  interviewLevel:       string;
  disability:           string;
  conflictsOfInterest:  string;
  positionTitle:        string;
  grade:                string;
  recruitmentId:        number;
  jobCodeId:            number;
  jobCode:              string;
  department:           string;
  panelMembers:         PanelMember[];
  currentUserPanelId:   number | null;
  currentUserGuid:      string | null;
  reviewerName:         string;
  jobTitleEn:           string;
  jobTitleFr:           string;
  questions:            ReviewScoreCardQuestion[];
  scorecard:            any[] | null;
  level2Scorecard:      any | null;
  hodDecision:          any | null;
  positionOptions:      PositionOption[];
  level1Comments:       CommentEntry[];
  level2Comments:       CommentEntry[];
  statusId:             number;
}

export interface HODSubmitParams {
  candidateId:      number;
  hodDecision:      HODDecision;
  comments:         string;
  currentUserEmail: string;
  currentRoleId:    number;
  gpa:              string;
  positionId:       number | null;
  isLevel2:         boolean;
  jobCodeID:        number;
  recruitmentID:    number;
  statusId:         number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse QuestionJson — handles string or array */
function _parseJson(raw: any): Record<string, number>[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

/**
 * GPA calculation — exact mirror of old fetchScorecardCandidates logic:
 *   - Only Level 1 panels counted for maxOverall
 *   - sumOverall  = 8 criteria scores per Level1 panel
 *   - sumQuestion = question scores across ALL panels
 *   - maxOverall  = level1Count × 40
 *   - maxQuestion = total questions × 3
 *   - GPA = floor((combined / maxPossible) × 5 × 100) / 100
 */
async function _calculateGPA(candidateId: number): Promise<string> {
  console.log('[ReviewScoreCardServices] _calculateGPA called with candidateId:', candidateId);
  try {
    // Fetch all interview panels for this candidate
    const panels: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSInterviewPanelDetails,
      Select:   'ID,InterviewLevel,CandidateID/ID',
      Expand:   'CandidateID',
      Filter:   [{ FilterKey: 'CandidateID/Id', Operator: 'eq', FilterValue: candidateId }],
    });

    if (!panels || panels.length === 0) return '';

    // Count Level 1 panels only (for maxOverall)
    const level1Count    = panels.filter(p => p.InterviewLevel === 'Level 1').length;
    const maxOverallScore = level1Count * 40;

    let sumOverall  = 0;
    let sumQuestion = 0;
    let maxQuestion = 0;

    for (const panel of panels) {
      // Fetch scorecard for this panel member
      const scorecards: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateScoreCard,
        Select:   '*',
        Filter:   [{ FilterKey: 'InterviewPanelIDId', Operator: 'eq', FilterValue: panel.ID }],
      });

      if (scorecards.length > 0) {
        const sc = scorecards[0];

        // Sum 8 criteria scores (each 0-5) — old code exact
        sumOverall +=
          (Number(sc.RelevantQualification)            || 0) +
          (Number(sc.ReleventExperience)               || 0) +
          (Number(sc.Knowledge)                        || 0) +
          (Number(sc.EnergyLevel)                      || 0) +
          (Number(sc.MeetJobRequirement)               || 0) +
          (Number(sc.ContributeTowardsCultureRequried) || 0) +
          (Number(sc.Experience)                       || 0) +
          (Number(sc.OtherCriteriaScore)               || 0);

        // Sum question scores (each 0-3)
        const questionData: Record<string, number>[] = _parseJson(sc.QuestionJson);
        const questionScore = questionData.reduce(
          (sum: number, q: any) => sum + (Number(Object.values(q)[0]) || 0),
          0
        );
        sumQuestion += questionScore;
        maxQuestion += questionData.length * 3;
      }
    }

    const combined    = sumOverall + sumQuestion;
    const maxPossible = maxOverallScore + maxQuestion;

    if (maxPossible <= 0) return '';

    // Old code formula: floor((combined / maxPossible) × 5 × 100) / 100
    const gpa = Math.floor((combined / maxPossible) * 5 * 100) / 100;
    console.log('[ReviewScoreCardServices] _calculateGPA returning GPA:', gpa, 'for candidateId:', candidateId);
    return String(gpa);
  } catch (e) {
    console.warn('[_calculateGPA] error for candidate', candidateId, e);
    return '';
  }
}

const EMPTY = (id: number): ReviewScoreCardResult => ({
  success: false, candidateId: id, applicantName: '', nationality: '', gender: '',
  qualification: '', miningExp: '', relevantExp: '', interviewDate: '',
  interviewLevel: '', disability: '', conflictsOfInterest: '', positionTitle: '',
  grade: '', recruitmentId: 0, jobCodeId: 0, jobCode: '', department: '',
  panelMembers: [], currentUserPanelId: null, currentUserGuid: null,
  reviewerName: '', jobTitleEn: '', jobTitleFr: '', questions: [],
  scorecard: null, level2Scorecard: null, hodDecision: null,
  positionOptions: [], level1Comments: [], level2Comments: [], statusId: 0,
});

// ── Service ───────────────────────────────────────────────────────────────────
class ReviewScoreCardServices {
  [x: string]: any;

  /**
   * STEP 1 — Candidate list for the drawer by RecruitmentID
   * GPA calculated per candidate using old fetchScorecardCandidates logic
   */
  async getCandidatesByRecruitmentId(recruitmentID: number): Promise<CandidateListItem[]> {
    console.log('[ReviewScoreCardServices] getCandidatesByRecruitmentId called with recruitmentID:', recruitmentID);
    try {
      // Fetch all candidates for this recruitment
      const res: any[] = await SPServices.SPReadItems({
        Listname:        ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:          '*,JobCode/JobCode,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID',
        Expand:          'JobCode,RecruitmentID,Status',
        FilterCondition: 'and',
        Filter: [
          { FilterKey: 'RecruitmentIDId', Operator: 'eq', FilterValue: recruitmentID },
          { FilterKey: 'ItemCreated',     Operator: 'eq', FilterValue: 'No' },
          { FilterKey: 'StatusId',        Operator:  'in', FilterValue: HOD_SCORECARD_STATUS_IDS },
        ],
        Topcount: 1000,
      });

      // Fetch default grade + level for this recruitment (non-fatal)
      let defaultGrade = '';
      let defaultLevel = '';
      try {
        const posRes: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSRecruitmentPositionDetails,
          Select:   '*,PatersonGrade/PatersonGrade',
          Expand:   'PatersonGrade',
          Filter:   [{ FilterKey: 'RecruitmentID', Operator: 'eq', FilterValue: recruitmentID }],
        });
        defaultGrade = posRes?.[0]?.PatersonGrade?.PatersonGrade || posRes?.[0]?.PatersonGrade || '';
        if (defaultGrade) {
          const gradeRes: any[] = await SPServices.SPReadItems({
            Listname: ListNames.HRMSGradeMaster,
            Select:   '*',
            Filter:   [{ FilterKey: 'PatersonGrade', Operator: 'eq', FilterValue: defaultGrade }],
          });
          defaultLevel = gradeRes?.[0]?.Levels || '';
        }
      } catch (_) { /* non-fatal — grade/level defaults to '' */ }

      // ── GPA calculation per candidate (mirrors old fetchScorecardCandidates) ──
      // Run in parallel for all candidates
      const enrichedWithGPA = await Promise.all(
        (res || []).map(async (item: any) => {
          const candidateId = item.ID;

          // Resolve candidate grade
          const candidateGrade = item.JobGrade || item.PatersonGrade || defaultGrade || '';

          console.log('[getCandidatesByRecruitmentId] candidate', candidateId, 'grade resolve:', {
            jobGrade:      item.JobGrade,
            patersonGrade: item.PatersonGrade,
            defaultGrade,
            resolvedGrade: candidateGrade,
          });

          // Calculate GPA from scorecards — exact old code logic
          const gpa = await _calculateGPA(candidateId);

          return {
            id:             candidateId,
            recruitmentID:  item.RecruitmentID?.ID || recruitmentID,
            fullName:       [item.FristName, item.MiddleName, item.LastName]
                              .filter(Boolean).join(' ').trim(),
            positionTitle:  item.PositionTitle   || '',
            interviewLevel: item.InterviewLevel  || defaultLevel,
            grade:          candidateGrade,
            gpa,                                    // ← calculated GPA (not from SP field)
            status:         item.Status?.StatusDescription || item.Status || '',
            statusId:       item.StatusId || item.Status?.ID || 0,
            nationality:    item.Nationality || '',
            gender:         item.Gender      || '',
            jobCodeID:      item.JobCodeId   || 0,
            jobCode:        item.JobCode?.JobCode || '',
            department:     item.Department  || '',
            interviewDate:  (item.InterviewDateLevel2 || item.InterviewDate || '').split('T')[0],
            disability:     item.Disability  || '',
            jobTitle:       item.PositionTitle || '',
          } as CandidateListItem;
        })
      );

      console.log('[ReviewScoreCardServices] getCandidatesByRecruitmentId returning:', enrichedWithGPA.length, 'candidates');
      return enrichedWithGPA;
    } catch (e) {
      console.error('[getCandidatesByRecruitmentId] error:', e);
      return [];
    }
  }

  /** STEP 2 — Full detail: panel members, questions, scorecard[], HOD decision, comments, positions */
  async getReviewScoreCardData(
    candidateId:      number,
    currentUserEmail: string,
    candidate?:       any,
  ): Promise<ReviewScoreCardResult> {
    console.log('[ReviewScoreCardServices] getReviewScoreCardData called with candidateId:', candidateId, 'currentUserEmail:', currentUserEmail, 'candidate:', candidate);
    try {
      const [candidateRows, currentUserGuid] = await Promise.all([
        SPServices.SPReadItems({
          Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
          Select: [
            'ID', 'FristName', 'MiddleName', 'LastName',
            'Nationality', 'Gender', 'Qualification',
            'TotalYearOfExperiance', 'ReleventExperience',
            'InterviewDate', 'InterviewDateLevel2',
            'Disability', 'ConflictsOfInterest', 'PositionTitle',
            'JobGrade', 'JobCodeId', 'StatusId',
            'RecruitmentID/ID', 'JobCode/JobCode', 'JobCode/ID',
          ].join(','),
          Expand: 'RecruitmentID,JobCode',
          Filter: [{ FilterKey: 'ID', Operator: 'eq', FilterValue: candidateId }],
        }),
        _getUserGuid(currentUserEmail),
      ]);

      const raw           = (candidateRows as any[])?.[0] ?? {};
      const recruitmentId = raw.RecruitmentID?.ID ?? raw.RecruitmentIDId ?? 0;
      const jobCodeId     = raw.JobCodeId ?? raw.JobCode?.ID ?? candidate?.jobCodeID ?? 0;
      const jobCodeStr    = raw.JobCode?.JobCode ?? candidate?.jobCode ?? '';
      const department    = raw.Department ?? candidate?.department ?? '';
      const statusId      = raw.StatusId ?? candidate?.statusId ?? 0;
      const fullName      = [raw.FristName, raw.MiddleName, raw.LastName]
                              .filter(Boolean).join(' ').trim();
      const interviewDate = (raw.InterviewDateLevel2 || raw.InterviewDate || '').split('T')[0];

      const [panelRows, reviewerRes] = await Promise.all([
        SPServices.SPReadItems({
          Listname: ListNames.HRMSInterviewPanelDetails,
          Select:   'ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded',
          Expand:   'InterviewPanel',
          Filter:   [{ FilterKey: 'CandidateID/Id', Operator: 'eq', FilterValue: candidateId }],
        }),
        _master.GetUserDetails(
          [{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: currentUserEmail }], 'and'
        ),
      ]);

      const currentUserPanel = (panelRows as any[]).find(
        (p: any) => String(p.InterviewPanel?.Id) === String(currentUserGuid)
      );

      // Resolve panel member names via MasterService
      const uniqueEmails: string[] = Array.from(new Set(
        (panelRows as any[]).map((p: any) => p.InterviewPanel?.EMail).filter(Boolean)
      ));
      const emailToDetails: Record<string, { name: string; jobTitle: string; department: string }> = {};
      await Promise.all(uniqueEmails.map(async (email: string) => {
        try {
          const res = await _master.GetUserDetails(
            [{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: email }], 'and'
          );
          if (res?.data) {
            const name = [res.data.FirstName, res.data.MiddleName, res.data.LastName]
                           .filter(Boolean).join(' ').trim();
            if (name) {
              emailToDetails[email.toLowerCase()] = {
                name,
                jobTitle:   res.data.JopTitleEnglish ?? '',
                department: res.data.DepartmentName  ?? '',
              };
            }
          }
        } catch { /* non-fatal */ }
      }));

      const panelMembers: PanelMember[] = (panelRows as any[])
        .map((p: any) => {
          const email = (p.InterviewPanel?.EMail ?? '').toLowerCase();
          const d = emailToDetails[email];
          return d
            ? { name: d.name, jobTitle: d.jobTitle, department: d.department, email: p.InterviewPanel?.EMail ?? '' }
            : { name: p.InterviewPanel?.Title || '', jobTitle: '', department: '', email: p.InterviewPanel?.EMail ?? '' };
        })
        .filter((m) => !!m.name);

      const reviewer     = reviewerRes?.data;
      const reviewerName = reviewer
        ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName]
            .filter(Boolean).join(' ').trim()
        : '';
      const jobTitleEn = reviewer?.JopTitleEnglish ?? '';
      const jobTitleFr = reviewer?.JopTitleFrench  ?? '';

      let grade          = raw.JobGrade ?? candidate?.grade ?? '';
      let interviewLevel = raw.InterviewLevel ?? candidate?.interviewLevel ?? '';

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
          ? _master.GetJobUniqueDataValue(jobCodeId)
              .then(async (res: any) => {
                const key = res?.data?.JobCode ?? '';
                if (!key) return [];
                const qRes = await _questApi.getQuestionnaire(key);
                return (qRes?.data ?? []).map((q: any) => ({
                  id:       q.id,
                  question: q.question,
                  answer:   q.answer ?? '',
                  rating:   null,
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

      if (!grade && gradeRes?.data) grade = (gradeRes.data as any)?.GradeLevel ?? '';
      if (!interviewLevel) {
        interviewLevel =
          raw.InterviewLevel ||
          String(raw.JobGrade || '').match(/Level\s*\d+/i)?.[0] ||
          String((gradeRes?.data as any)?.GradeLevel || '').match(/Level\s*\d+/i)?.[0] ||
          '';
      }

      console.log('[ReviewScoreCardServices] getReviewScoreCardData returning success:', true, 'for candidateId:', candidateId);
      return {
        success: true,
        candidateId,
        applicantName:        fullName,
        nationality:          raw.Nationality            ?? '',
        gender:               raw.Gender                 ?? '',
        qualification:        raw.Qualification          ?? '',
        miningExp:            raw.TotalYearOfExperiance  ?? '',
        relevantExp:          raw.ReleventExperience      ?? '',
        interviewDate,
        interviewLevel,
        disability:           raw.Disability ?? raw.disability ?? '',
        conflictsOfInterest:  raw.ConflictsOfInterest    ?? '',
        positionTitle:        raw.PositionTitle           ?? '',
        grade,
        recruitmentId,
        jobCodeId,
        jobCode:              jobCodeStr,
        department,
        panelMembers,
        currentUserPanelId:   currentUserPanel?.ID ?? null,
        currentUserGuid,
        reviewerName,
        jobTitleEn,
        jobTitleFr,
        questions:            questionsResult as ReviewScoreCardQuestion[],
        scorecard:            scorecardData,
        level2Scorecard:      level2ScorecardData,
        hodDecision:          hodDecisionData,
        positionOptions:      positionOptionsData,
        level1Comments:       commentsData.level1,
        level2Comments:       commentsData.level2,
        statusId,
      };
    } catch (error) {
      console.error('[getReviewScoreCardData] error:', error);
      return EMPTY(candidateId);
    }
  }

  /** All panel scorecards for a candidate (one per panel member) */
  async _getCandidateScorecard(candidateId: number): Promise<any[] | null> {
    console.log('[ReviewScoreCardServices] _getCandidateScorecard called with candidateId:', candidateId);
    try {
      const panels: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:   'ID,InterviewPanel/Title,InterviewLevel',
        Expand:   'InterviewPanel',
        Filter:   [{ FilterKey: 'CandidateID/Id', Operator: 'eq', FilterValue: candidateId }],
      });

      const allScores: any[] = [];
      for (const p of panels) {
        const sc: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSCandidateScoreCard,
          Select:   '*',
          Filter:   [{ FilterKey: 'InterviewPanelIDId', Operator: 'eq', FilterValue: p.ID }],
        });
        if (sc?.length) {
          allScores.push({
            ...sc[0],
            InterviewPersonName: p.InterviewPanel?.Title || '',
            InterviewLevel:      p.InterviewLevel        || '',
          });
        }
      }
      console.log('[ReviewScoreCardServices] _getCandidateScorecard returning:', allScores.length, 'scorecards');
      return allScores.length > 0 ? allScores : null;
    } catch (e) {
      console.error('[_getCandidateScorecard]', e);
      return null;
    }
  }

  async _getLevel2Scorecard(candidateId: number): Promise<any> {
    console.log('[ReviewScoreCardServices] _getLevel2Scorecard called with candidateId:', candidateId);
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateLevel2ScoreCard,
        Select:   '*',
        Filter:   [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
      });
      console.log('[ReviewScoreCardServices] _getLevel2Scorecard returning:', res?.[0] ? 'found' : 'null');
      return res?.[0] ?? null;
    } catch (e) {
      console.error('[_getLevel2Scorecard]', e);
      return null;
    }
  }

  async _getHODDecision(candidateId: number): Promise<any> {
    console.log('[ReviewScoreCardServices] _getHODDecision called with candidateId:', candidateId);
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSSelectedCandidateDetailsByHOD,
        Select:   '*,PositionID/PositionID,PositionID/ID',
        Expand:   'PositionID',
        Filter:   [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
      });
      console.log('[ReviewScoreCardServices] _getHODDecision returning:', res?.[0] ? 'found' : 'null');
      return res?.[0] ?? null;
    } catch (e) {
      console.error('[_getHODDecision]', e);
      return null;
    }
  }

  /** Fetch level1 + level2 comments */
  async fetchComments(
    candidateId: number,
  ): Promise<{ level1: CommentEntry[]; level2: CommentEntry[] }> {
    console.log('[ReviewScoreCardServices] fetchComments called with candidateId:', candidateId);
    try {
      const [l1, l2] = await Promise.all([
        SPServices.SPReadItems({
          Listname: ListNames.HRMSRecruitmentCandidateComments,
          Select:   '*,CandidateID/ID,AddedBy/Title,AddedBy/JobTitle,AddedBy/Department',
          Expand:   'CandidateID,AddedBy',
          Filter:   [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
        }).catch(() => []),
        SPServices.SPReadItems({
          Listname: ListNames.HRMSCandidateLevel2ScoreCard,
          Select:   '*',
          Filter:   [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
        }).catch(() => []),
      ]);

      const mapL1 = (i: any): CommentEntry => ({
        Id:                        i.ID ?? null,
        Name:                      i.AddedBy?.Title || i.Name || '',
        JobTitleInEnglish:         i.JobTitleInEnglish || i.AddedBy?.JobTitle || '',
        JobTitleInFrench:          i.JobTitleInFrench  || '',
        Department:                i.Department || i.AddedBy?.Department || '',
        Date:                      i.Modified || i.Created || null,
        RoleName:                  i.RoleName || '',
        comments:                  i.Comments || i.comments || '',
        OverAllEvaluationFeedback: i.OverAllEvaluationFeedback || '',
        Level:                     'Level 1',
      });

      const mapL2 = (i: any): CommentEntry => ({
        Id:                        i.ID ?? null,
        Name:                      i.Name || '',
        JobTitleInEnglish:         i.JobTitleInEnglish || '',
        JobTitleInFrench:          i.JobTitleInFrench  || '',
        Department:                i.Department || '',
        Date:                      i.Modified || i.Created || null,
        RoleName:                  i.RoleName || '',
        comments:                  i.Comments || i.comments || '',
        OverAllEvaluationFeedback: i.OverAllEvaluationFeedback || '',
        Level:                     'Level 2',
      });

      const level1: CommentEntry[] = (l1 as any[]).map(mapL1);
      const level2: CommentEntry[] = (l2 as any[]).map(mapL2);

      console.log('[ReviewScoreCardServices] fetchComments returning level1:', level1.length, 'level2:', level2.length);
      return { level1, level2 };
    } catch (e) {
      console.error('[fetchComments]', e);
      return { level1: [], level2: [] };
    }
  }

  /** Position dropdown options for HOD panel */
  async fetchPositionOptions(
    jobCodeID:  number | string,
    department: string,
  ): Promise<PositionOption[]> {
    console.log('[ReviewScoreCardServices] fetchPositionOptions called with jobCodeID:', jobCodeID, 'department:', department);
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname:        ListNames.HRMSPositionIDMaster,
        Select:          '*,JobCode/JobCode',
        Expand:          'JobCode',
        FilterCondition: 'and',
        Filter: [
          { FilterKey: 'JobCode',          Operator: 'eq', FilterValue: jobCodeID  },
          { FilterKey: 'Department',       Operator: 'eq', FilterValue: department },
          { FilterKey: 'PositionIDStatus', Operator: 'eq', FilterValue: 'Recruitment Initiator' },
        ],
        Topcount: 100,
      });
      if (res?.length) {
        return res.map((i: any) => ({
          key:  i.ID,
          text: i.PositionID || i.Title || `#${i.ID}`,
        }));
      }
      // Fallback: department only
      const fb: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSPositionIDMaster,
        Select:   '*',
        Filter: [
          { FilterKey: 'Department',       Operator: 'eq', FilterValue: department },
          { FilterKey: 'PositionIDStatus', Operator: 'eq', FilterValue: 'Recruitment Initiator' },
        ],
        Topcount: 100,
      });
      console.log('[ReviewScoreCardServices] fetchPositionOptions returning:', (fb || []).length, 'options');
      return (fb || []).map((i: any) => ({
        key:  i.ID,
        text: i.PositionID || i.Title || `#${i.ID}`,
      }));
    } catch (e) {
      console.error('[fetchPositionOptions]', e);
      return [];
    }
  }

  /**
   * HOD submit — select / reject / on-hold
   * Mirrors old updateCandidateStatusFull:
   *   1. Update candidate StatusId
   *   2. Insert/update Level1 or Level2 comment
   *   3. Assign PositionID if Yes
   */
  async submitHODDecision(
    params: HODSubmitParams,
  ): Promise<{ success: boolean; message: string }> {
    console.log('[ReviewScoreCardServices] submitHODDecision called with params:', params);
    try {
      const {
        candidateId, hodDecision, comments,
        currentRoleId, positionId,
        isLevel2: lv2, recruitmentID,
      } = params;

      // Next status mirrors old code
      let nextStatusId: number;
      if (lv2) {
        nextStatusId = hodDecision === 'Yes' ? 130
                     : hodDecision === 'No'  ? 168
                     :                         166;
      } else {
        nextStatusId = hodDecision === 'Yes' ? 122
                     : hodDecision === 'No'  ? 167
                     :                         165;
      }

      // 1. Update candidate status
      await SPServices.SPUpdateItem({
        Listname:    ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: { StatusId: nextStatusId },
        ID:          candidateId,
      });

      // 2. Save comment (Level1 or Level2)
      if (lv2) {
        await _insertOrUpdateLevel2Comment(candidateId, currentRoleId, comments);
      } else {
        await _insertOrUpdateLevel1Comment(candidateId, currentRoleId, comments);
      }

      // 3. Assign PositionID if decision is Yes
      if (hodDecision === 'Yes' && positionId) {
        await _assignPositionID({ positionId, candidateId, recruitmentID });
      }

      const msg =
        hodDecision === 'Yes' ? 'Candidate SELECTED successfully.'
        : hodDecision === 'No'  ? 'Candidate REJECTED successfully.'
        :                         'Candidate put ON HOLD successfully.';

      console.log('[ReviewScoreCardServices] submitHODDecision returning success:', true, 'message:', msg);
      return { success: true, message: `✓ ${msg}` };
    } catch (e) {
      console.error('[submitHODDecision]', e);
      return { success: false, message: 'Submission failed. Please try again.' };
    }
  }
}

// ── Private helpers ───────────────────────────────────────────────────────────

async function _getUserGuid(email: string): Promise<string | null> {
  console.log('[ReviewScoreCardServices] _getUserGuid called with email:', email);
  try {
    if (!email) return null;
    const res = await _common.getUserGuidByEmail(email);
    if (res?.status === 200 && res?.data?.key) return String(res.data.key);
    console.log('[ReviewScoreCardServices] _getUserGuid returning:', res?.data?.key ? 'guid found' : 'null');
    return null;
  } catch { return null; }
}

async function _insertOrUpdateLevel1Comment(
  candidateId: number,
  roleId:      number,
  comments:    string,
): Promise<void> {
  console.log('[ReviewScoreCardServices] _insertOrUpdateLevel1Comment called with candidateId:', candidateId, 'roleId:', roleId, 'comments length:', comments.length);
  try {
    const existing: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSRecruitmentCandidateComments,
      Select:   '*',
      Filter:   [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
    });
    const match = existing.find((i: any) => i.RoleId === roleId);
    if (match) {
      await SPServices.SPUpdateItem({
        Listname:    ListNames.HRMSRecruitmentCandidateComments,
        RequestJSON: { Comments: comments },
        ID:          match.ID,
      });
    } else {
      await SPServices.SPAddItem({
        Listname:    ListNames.HRMSRecruitmentCandidateComments,
        RequestJSON: { CandidateIDId: candidateId, Comments: comments, RoleId: roleId },
      });
    }    console.log('[ReviewScoreCardServices] _insertOrUpdateLevel1Comment completed for candidateId:', candidateId);  } catch (e) { console.error('[_insertOrUpdateLevel1Comment]', e); }
}

async function _insertOrUpdateLevel2Comment(
  candidateId: number,
  roleId:      number,
  comments:    string,
): Promise<void> {
  console.log('[ReviewScoreCardServices] _insertOrUpdateLevel2Comment called with candidateId:', candidateId, 'roleId:', roleId, 'comments length:', comments.length);
  try {
    const existing: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSCandidateLevel2ScoreCard,
      Select:   '*',
      Filter:   [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
    });
    const match = existing.find((i: any) => i.RoleId === roleId);
    if (match) {
      await SPServices.SPUpdateItem({
        Listname:    ListNames.HRMSCandidateLevel2ScoreCard,
        RequestJSON: { Comments: comments },
        ID:          match.ID,
      });
    } else {
      await SPServices.SPAddItem({
        Listname:    ListNames.HRMSCandidateLevel2ScoreCard,
        RequestJSON: { CandidateIDId: candidateId, Comments: comments, RoleId: roleId },
      });
    }    console.log('[ReviewScoreCardServices] _insertOrUpdateLevel2Comment completed for candidateId:', candidateId);  } catch (e) { console.error('[_insertOrUpdateLevel2Comment]', e); }
}

async function _assignPositionID(p: {
  positionId:    number;
  candidateId:   number;
  recruitmentID: number;
}): Promise<void> {
  console.log('[ReviewScoreCardServices] _assignPositionID called with positionId:', p.positionId, 'candidateId:', p.candidateId, 'recruitmentID:', p.recruitmentID);
  try {
    const posRes: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSPositionIDMaster,
      Select:   '*',
      Filter:   [{ FilterKey: 'ID', Operator: 'eq', FilterValue: p.positionId }],
    });
    if (!posRes?.length) return;
    const pos = posRes[0];
    await SPServices.SPAddItem({
      Listname:    ListNames.HRMSSelectedCandidateDetailsByHOD,
      RequestJSON: {
        PositionIDId:    pos.ID,
        CandidateIDId:   p.candidateId,
        RecruitmentIDId: p.recruitmentID,
        ItemCreated:     'Yes',
        ActionId:        WorkflowAction.Submitted,
        StatusId:        StatusId.Pending,
      },
    });
    await SPServices.SPUpdateItem({
      Listname:    ListNames.HRMSPositionIDMaster,
      RequestJSON: { PositionIDStatus: 'Recruitment In Progress' },
      ID:          pos.ID,
    });
    console.log('[ReviewScoreCardServices] _assignPositionID completed for positionId:', p.positionId);
  } catch (e) { console.error('[_assignPositionID]', e); }
}

export default new ReviewScoreCardServices();