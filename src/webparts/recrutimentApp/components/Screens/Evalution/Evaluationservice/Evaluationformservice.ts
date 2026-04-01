import SPServices from '../../../../services/SPService/spservice';
import MasterService from '../../../../services/MasterService/MasterService';
import {
  ListNames,
  workflowStatusApi,
  WorkflowAction,
} from '../../../../utilities/Config';
import CommonService from '../../SelectionProcess/CommonServices/CommonServices';
import GetPortalJobs from './QuestionnaireApi/QuestionnaireApi';
import { InterviewLevels, RoleName } from '../../../../utilities/ConditionConfig';

const _common   = new CommonService();
const _master   = new MasterService();
const _questApi = new GetPortalJobs();

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EvaluationFormQuestion {
  id:       number;
  question: string;
  answer:   string;
}

export interface EvaluationFormResult {
  success:             boolean;
  candidateId:         number;
  applicantName:       string;
  nationality:         string;
  nationalityCode:     string;
  gender:              string;
  qualification:       string;
  miningExp:           string;
  relevantExp:         string;
  interviewDate:       string;
  interviewLevel:      string;
  disability:          string;
  conflictsOfInterest: string;
  positionTitle:       string;
  grade:               string;
  recruitmentId:       number;
  jobCodeId:           number;
  panelMembers:        string[];
  currentUserPanelId:  number | null;
  currentUserGuid:     string | null;
  reviewerName:        string;
  jobTitleEn:          string;
  jobTitleFr:          string;
  questions:           EvaluationFormQuestion[];
}

export interface SubmitScorecardParams {
  recruitmentId:         number;
  panelId:               number;
  roleId:                number;
  interviewPersonNameId: string;      // SP user numeric ID as string
  qualifications:        number | null;
  experience:            number | null;
  knowledge:             number | null;
  energyLevel:           number | null;
  jobRequirements:       number | null;
  cultureFit:            number | null;
  expatLocal:            number | null;
  otherCriteria:         number | null;
  recommendation:        'consider' | 'doNotConsider';
  evaluationFeedback:    string;      // conditional (shown when any rating ≤ 2)
  overallFeedback:       string;
  /** Formatted as [{"Q1":3},{"Q2":1},...] — old code format */
  questionScores:        Record<string, number>[];
  candidateId:           number;
  jobRequestId:          string;      // for portal UpdateCandidateStatus
}

// ── Empty result ──────────────────────────────────────────────────────────────

const EMPTY = (candidateId: number): EvaluationFormResult => ({
  success: false, candidateId, applicantName: '', nationality: '', nationalityCode: '',
  gender: '', qualification: '', miningExp: '', relevantExp: '', interviewDate: '',
  interviewLevel: '', disability: '', conflictsOfInterest: '', positionTitle: '',
  grade: '', recruitmentId: 0, jobCodeId: 0, panelMembers: [],
  currentUserPanelId: null, currentUserGuid: null,
  reviewerName: '', jobTitleEn: '', jobTitleFr: '', questions: [],
});

// ── getEvaluationFormData ─────────────────────────────────────────────────────

export async function getEvaluationFormData(
  candidateId:      number,
  currentUserEmail: string
): Promise<EvaluationFormResult> {
  console.log('[getEvaluationFormData] START — candidateId:', candidateId, 'email:', currentUserEmail);

  try {
    // ── Step 1: Get current user SP Id + candidate data ───────────────────────
    const [candidateRows, currentUserGuid] = await Promise.all([
      SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: [
          'ID', 'FristName', 'MiddleName', 'LastName',
          'Nationality', 'NationalityCode', 'Gender', 'Qualification',
          'TotalYearOfExperiance', 'ReleventExperience',
          'InterviewDate', 'InterviewDateLevel2',
          'Disability', 'ConflictsOfInterest', 'PositionTitle',
          'JobGrade', 'JobCodeId', 'JobRequestID',
          'RecruitmentID/ID', 'JobCode/JobCode', 'JobCode/ID',
        ].join(','),
        Expand: 'RecruitmentID,JobCode',
        Filter: [{ FilterKey: 'ID', Operator: 'eq', FilterValue: candidateId }],
      }),
      _getUserGuid(currentUserEmail),
    ]);

    const raw           = (candidateRows as any[])?.[0] ?? {};
    const recruitmentId = raw.RecruitmentID?.ID ?? raw.RecruitmentIDId ?? 0;
    const jobCodeId     = raw.JobCodeId ?? raw.JobCode?.ID ?? 0;
    const jobCodeStr    = raw.JobCode?.JobCode ?? '';
    const fullName      = [raw.FristName, raw.MiddleName, raw.LastName].filter(Boolean).join(' ').trim();
    const interviewDateRaw = raw.InterviewDateLevel2 || raw.InterviewDate || '';
    const interviewDate    = interviewDateRaw ? interviewDateRaw.split('T')[0] : '';
    const jobRequestId     = raw.JobRequestID ?? '';

    console.log('[getEvaluationFormData] candidateRaw:', {
      ID: raw.ID, fullName, recruitmentId, jobCodeId, jobCodeStr, jobRequestId,
      NationalityCode: raw.NationalityCode,
    });
    console.log('[getEvaluationFormData] currentUserGuid (SP user Id):', currentUserGuid);

    // ── Step 2: Fetch HRMSInterviewPanelDetails ───────────────────────────────
    // OLD CODE FILTER: FilterKey: "CandidateIDId" (NOT "CandidateID/Id")
    // OLD CODE SELECT: does NOT expand InterviewPanel, stores InterviewPanel as Id number
    //
    // InterviewServices.GetInterviewPanelDetails uses:
    //   Select: "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id,
    //            InterviewPanel/Title, InterviewPanel/EMail, IsScoreSheetUploaded"
    //   Expand: "InterviewPanel, RecruitmentID, CandidateID"
    //   Filter: [{ FilterKey: "CandidateIDId", ... }]   ← CandidateIDId (NOT CandidateID/Id)

    const [panelRows, reviewerRes] = await Promise.all([
      SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:   'ID,CandidateID/ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,IsScoreSheetUploaded',
        Expand:   'InterviewPanel,RecruitmentID,CandidateID',
        // ✅ OLD CODE EXACT FILTER KEY: "CandidateIDId" (not "CandidateID/Id")
        Filter:   [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
      }),
      _master.GetUserDetails(
        [{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: currentUserEmail }], 'and'
      ),
    ]);

    console.log('[getEvaluationFormData] panelRows count:', (panelRows as any[]).length);
    console.log('[getEvaluationFormData] panelRows detail:', JSON.stringify(
      (panelRows as any[]).map((p: any) => ({
        ID:               p.ID,
        InterviewPanelId: p.InterviewPanel?.Id,    // SP user Id (numeric)
        Email:            p.InterviewPanel?.EMail,
        Level:            p.InterviewLevel,
        Uploaded:         p.IsScoreSheetUploaded,
        CandidateID:      p.CandidateID?.ID,
        RecruitmentID:    p.RecruitmentID?.ID,
      }))
    ));

    // ── Step 3: Find current user's panel entry ────────────────────────────────
    // OLD CODE: panel.InterviewPanel === Number(currentUserKey)
    // InterviewPanel field after expand = { Id, Title, EMail }
    // So compare: InterviewPanel.Id (number) === Number(currentUserGuid)

    let currentUserPanel: any = null;

    if (currentUserGuid) {
      // Primary: match by InterviewPanel.Id (SP user numeric Id)
      currentUserPanel = (panelRows as any[]).find(
        (p: any) => Number(p.InterviewPanel?.Id) === Number(currentUserGuid)
      );
      console.log('[getEvaluationFormData] Panel match by Id:', currentUserPanel?.ID ?? 'NOT FOUND',
        '| comparing panelIds:', (panelRows as any[]).map((p: any) => p.InterviewPanel?.Id),
        'vs currentUserGuid:', currentUserGuid
      );
    }

    // Fallback: match by email (in case SP Id resolution differs)
    if (!currentUserPanel && currentUserEmail) {
      currentUserPanel = (panelRows as any[]).find(
        (p: any) =>
          (p.InterviewPanel?.EMail || '').toLowerCase() === currentUserEmail.toLowerCase()
      );
      console.log('[getEvaluationFormData] Panel match by Email fallback:', currentUserPanel?.ID ?? 'NOT FOUND');
    }

    // Fallback 2: match by recruitmentId too (old code also checks RecruitmentID)
    if (!currentUserPanel && currentUserGuid && recruitmentId) {
      // Old code: matchingPanels filters by CandidateID AND RecruitmentID
      const matchingByRecruit = (panelRows as any[]).filter(
        (p: any) => p.RecruitmentID?.ID === recruitmentId
      );
      currentUserPanel = matchingByRecruit.find(
        (p: any) => Number(p.InterviewPanel?.Id) === Number(currentUserGuid)
      );
      console.log('[getEvaluationFormData] Panel match with RecruitmentID filter:', currentUserPanel?.ID ?? 'NOT FOUND');
    }

    console.log('[getEvaluationFormData] FINAL currentUserPanel:',
      currentUserPanel
        ? { ID: currentUserPanel.ID, Level: currentUserPanel.InterviewLevel, Email: currentUserPanel.InterviewPanel?.EMail }
        : 'NULL — current user is NOT in HRMSInterviewPanelDetails for candidateId=' + candidateId
    );

    if (!currentUserPanel) {
      console.warn('[getEvaluationFormData] Panel emails list:', (panelRows as any[]).map((p: any) => p.InterviewPanel?.EMail));
      console.warn('[getEvaluationFormData] Panel Ids list:', (panelRows as any[]).map((p: any) => p.InterviewPanel?.Id));
      console.warn('[getEvaluationFormData] Expected currentUserGuid:', currentUserGuid, '(type:', typeof currentUserGuid, ')');
    }

    // ── Step 4: Build panel member display names ───────────────────────────────
    const uniqueEmails: string[] = Array.from(new Set(
      (panelRows as any[]).map((p: any) => p.InterviewPanel?.EMail).filter(Boolean)
    ));
    console.log('[getEvaluationFormData] Panel emails to resolve names:', uniqueEmails);

    const emailToName: Record<string, string> = {};
    await Promise.all(
      uniqueEmails.map(async (email: string) => {
        try {
          const res = await _master.GetUserDetails(
            [{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: email }], 'and'
          );
          if (res?.data) {
            const name = [res.data.FirstName, res.data.MiddleName, res.data.LastName]
              .filter(Boolean).join(' ').trim();
            if (name) emailToName[email.toLowerCase()] = name;
          }
        } catch { /* non-fatal */ }
      })
    );

    const panelMembers = (panelRows as any[])
      .map((p: any) => {
        const email = (p.InterviewPanel?.EMail ?? '').toLowerCase();
        return emailToName[email] || p.InterviewPanel?.Title || '';
      })
      .filter(Boolean);

    const reviewer     = reviewerRes?.data;
    const reviewerName = reviewer
      ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName].filter(Boolean).join(' ').trim()
      : '';
    const jobTitleEn = reviewer?.JopTitleEnglish ?? '';
    const jobTitleFr = reviewer?.JopTitleFrench  ?? '';

    console.log('[getEvaluationFormData] reviewerName:', reviewerName);
    console.log('[getEvaluationFormData] panelMembers:', panelMembers);

    // ── Step 5: Grade + questions ──────────────────────────────────────────────
    let grade          = raw.JobGrade ?? '';
    let interviewLevel = raw.InterviewLevel ?? '';
    let questions: EvaluationFormQuestion[] = [];

    const [gradeRes, questionsResult] = await Promise.all([
      grade
        ? Promise.resolve(null)
        : _master.GetGradeLevel(raw.JobGrade || jobCodeStr).catch(() => null),
      jobCodeId
        ? _master.GetJobUniqueDataValue(jobCodeId)
            .then(async (res: any) => {
              const key = res?.data?.JobCode ?? '';
              console.log('[getEvaluationFormData] JobUniqueKey:', key);
              if (!key) return [];
              const qRes = await _questApi.getQuestionnaire(key);
              console.log('[getEvaluationFormData] questions count:', qRes?.data?.length ?? 0);
              return (qRes?.data ?? []).map((q: any) => ({
                id:       q.id,
                question: q.question,
                answer:   q.answer ?? '',
              }));
            })
            .catch((e: any) => {
              console.warn('[getEvaluationFormData] questions fetch failed:', e);
              return [];
            })
        : Promise.resolve([]),
    ]);

    if (!grade && gradeRes?.data) grade = (gradeRes.data as any)?.GradeLevel ?? '';
    if (!interviewLevel) {
      interviewLevel =
        raw.InterviewLevel ||
        String(raw.JobGrade || '').match(/Level\s*\d+/i)?.[0] ||
        '';
    }
    questions = questionsResult as EvaluationFormQuestion[];

    const result: EvaluationFormResult = {
      success:             true,
      candidateId,
      applicantName:       fullName,
      nationality:         raw.Nationality     ?? '',
      nationalityCode:     raw.NationalityCode ?? '',
      gender:              raw.Gender          ?? '',
      qualification:       raw.Qualification   ?? '',
      miningExp:           raw.TotalYearOfExperiance ?? '',
      relevantExp:         raw.ReleventExperience    ?? '',
      interviewDate,
      interviewLevel,
      disability:          raw.Disability         ?? raw.disability ?? '',
      conflictsOfInterest: raw.ConflictsOfInterest ?? '',
      positionTitle:       raw.PositionTitle       ?? '',
      grade,
      recruitmentId,
      jobCodeId,
      panelMembers,
      currentUserPanelId:  currentUserPanel?.ID ?? null,
      currentUserGuid,
      reviewerName,
      jobTitleEn,
      jobTitleFr,
      questions,
    };

    console.log('[getEvaluationFormData] RESULT:', {
      success:            result.success,
      candidateId:        result.candidateId,
      currentUserGuid:    result.currentUserGuid,
      currentUserPanelId: result.currentUserPanelId,
      panelMembersCount:  result.panelMembers.length,
      questionsCount:     result.questions.length,
      recruitmentId:      result.recruitmentId,
      jobRequestId,
    });

    // Store jobRequestId on result for submit use
    (result as any)._jobRequestId = jobRequestId;

    return result;
  } catch (error) {
    console.error('[getEvaluationFormData] FATAL error:', error);
    return EMPTY(candidateId);
  }
}
export async function submitScorecard(
  params: SubmitScorecardParams
): Promise<{ success: boolean; message: string }> {
  console.log('[submitScorecard] START —', {
    candidateId:           params.candidateId,
    panelId:               params.panelId,
    recruitmentId:         params.recruitmentId,
    roleId:                params.roleId,
    interviewPersonNameId: params.interviewPersonNameId,
    recommendation:        params.recommendation,
    jobRequestId:          params.jobRequestId,
    qualifications:        params.qualifications,
    experience:            params.experience,
    knowledge:             params.knowledge,
    energyLevel:           params.energyLevel,
    jobRequirements:       params.jobRequirements,
    cultureFit:            params.cultureFit,
    expatLocal:            params.expatLocal,
    otherCriteria:         params.otherCriteria,
    questionScoresCount:   params.questionScores.length,
    questionScores:        params.questionScores,
    hasEvalFeedback:       !!params.evaluationFeedback,
    overallFeedbackLen:    params.overallFeedback.length,
  });

  try {
    // ── Step 1: Build scorecard payload — exact old code column names ──────────
    // List: HRMSCandidateScoreCard
    const scorecardObj: Record<string, any> = {
      RelevantQualification:            String(params.qualifications  ?? ''),
      ReleventExperience:               String(params.experience      ?? ''),
      Knowledge:                        String(params.knowledge       ?? ''),
      EnergyLevel:                      String(params.energyLevel     ?? ''),
      MeetJobRequirement:               String(params.jobRequirements ?? ''),
      ContributeTowardsCultureRequried: String(params.cultureFit      ?? ''),
      Experience:                       String(params.expatLocal      ?? ''),  // Expat/Congolese column
      OtherCriteriaScore:               String(params.otherCriteria   ?? ''),
      ConsiderForEmployment:            params.recommendation === 'consider' ? 'Yes' : 'No',
      OverAllEvaluationFeedback:        params.overallFeedback,
      // Conditional feedback — only when any rating ≤ 2 (old code: shouldShowTextArea)
      ...(params.evaluationFeedback ? { Feedback: params.evaluationFeedback } : {}),
      // Relation columns
      RecruitmentIDId:       params.recruitmentId,
      InterviewPanelIDId:    params.panelId,
      RoleId:                params.roleId      ? Number(params.roleId)               : null,
      InterviewPersonNameId: params.interviewPersonNameId
        ? Number(params.interviewPersonNameId)
        : null,
      // QuestionJson: [{"Q1":3},{"Q2":1},...] — old code exact format
      QuestionJson: JSON.stringify(params.questionScores),
    };

    console.log('[submitScorecard] Inserting into HRMSCandidateScoreCard:', scorecardObj);

    // ── Step 2: Insert scorecard ───────────────────────────────────────────────
    const insertResponse: any = await SPServices.SPAddItem({
      Listname:    ListNames.HRMSCandidateScoreCard,
      RequestJSON: scorecardObj,
    });

    const newId =
      insertResponse?.ID ?? insertResponse?.Id ??
      insertResponse?.data?.ID ?? insertResponse?.data?.Id;

    console.log('[submitScorecard] HRMSCandidateScoreCard insert — newId:', newId);

    if (!newId) {
      console.error('[submitScorecard] Insert returned no ID — insert failed');
      return { success: false, message: 'Failed to submit scorecard.' };
    }

    // ── Step 3: Mark panel IsScoreSheetUploaded = 'Yes' ───────────────────────
    // List: HRMSInterviewPanelDetails
    console.log('[submitScorecard] Updating HRMSInterviewPanelDetails ID:', params.panelId, '→ IsScoreSheetUploaded: Yes');
    await SPServices.SPUpdateItem({
      Listname:    ListNames.HRMSInterviewPanelDetails,
      RequestJSON: { IsScoreSheetUploaded: 'Yes' },
      ID:          params.panelId,
    });

    // ── Step 4: Re-fetch all panels for this candidate, count Level 1 uploaded ─
    // OLD CODE: FilterKey: "CandidateID" (not CandidateIDId — different from fetch above!)
    console.log('[submitScorecard] Re-fetching panels for candidateId:', params.candidateId);
    const updatedPanelRows: any[] = await SPServices.SPReadItems({
      Listname: ListNames.HRMSInterviewPanelDetails,
      Select:   'ID,InterviewLevel,IsScoreSheetUploaded',
      // OLD CODE uses: FilterKey: "CandidateID" in updatedInterviewPanelResponse
      Filter:   [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: params.candidateId }],
    });

    const level1Panels  = updatedPanelRows.filter((p: any) => p.InterviewLevel === InterviewLevels.Level1);
    const uploadedCount = level1Panels.filter((p: any) => p.IsScoreSheetUploaded === 'Yes').length;

    console.log('[submitScorecard] Level1 panels total:', level1Panels.length, '| uploaded:', uploadedCount);

    // ── Step 5: If ALL Level 1 panels submitted → trigger HOD workflow ─────────
    if (level1Panels.length > 0 && uploadedCount === level1Panels.length) {
      console.log('[submitScorecard] ALL Level1 submitted → triggering HOD workflow');

      // ── Step 5a: Portal API — UpdateCandidateStatus(pendingHODSelection) ──────
      // OLD CODE: uses CandidateData.JobRequestID (from SP candidate record)
      if (params.jobRequestId) {
        try {
          const portalPayload = {
            workflowStatus: workflowStatusApi.pendingHODSelection,
            jobRequestId:   Number(params.jobRequestId),
            comments:       '',
            actionBy:       RoleName.HOD,
          };
          console.log('[submitScorecard] Portal UpdateCandidateStatus payload:', portalPayload);
          await _questApi.UpdateCandidateStatus(portalPayload);
          console.log('[submitScorecard] Portal UpdateCandidateStatus SUCCESS');
        } catch (apiErr) {
          console.warn('[submitScorecard] Portal UpdateCandidateStatus failed (non-fatal):', apiErr);
        }
      } else {
        console.warn('[submitScorecard] No jobRequestId — skipping portal API call');
      }

      // ── Step 5b: SP update candidate record ────────────────────────────────
      // List: HRMSRecruitmentCandidatePersonalDetails
      //   IsScoreSheetUploaded = 'Yes'
      //   ActionId = 1 (WorkflowAction.Approved)
      //   ItemCreated = 'Yes'
      // OLD CODE: ID = props.stateValue?.ID (candidateId)
      console.log('[submitScorecard] Updating HRMSRecruitmentCandidatePersonalDetails ID:', params.candidateId);
      await SPServices.SPUpdateItem({
        Listname:    ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: {
          IsScoreSheetUploaded: 'Yes',
          ActionId:    WorkflowAction.Approved,  // 1
          ItemCreated: 'Yes',
        },
        ID: params.candidateId,
      });
      console.log('[submitScorecard] Candidate SP record updated — HOD workflow complete');
    } else {
      console.log('[submitScorecard] Not all Level1 panels submitted yet — HOD workflow NOT triggered');
    }

    console.log('[submitScorecard] SUCCESS');
    return {
      success: true,
      message: 'The Candidate has been Interviewed and Scorecard Submitted successfully.',
    };
  } catch (error) {
    console.error('[submitScorecard] FATAL error:', error);
    return { success: false, message: 'An error occurred while submitting. Please try again.' };
  }
}

// ── Helper — SP user Id by email ──────────────────────────────────────────────

async function _getUserGuid(email: string): Promise<string | null> {
  console.log('[_getUserGuid] email:', email);
  try {
    if (!email) return null;
    const res = await _common.getUserGuidByEmail(email);
    console.log('[_getUserGuid] result key:', res?.data?.key, '| text:', res?.data?.text);
    if (res?.status === 200 && res?.data?.key) return String(res.data.key);
    return null;
  } catch (e) {
    console.error('[_getUserGuid] error:', e);
    return null;
  }
}