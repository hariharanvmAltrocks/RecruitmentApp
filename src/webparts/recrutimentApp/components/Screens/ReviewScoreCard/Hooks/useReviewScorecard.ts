
import * as React from 'react';
import {
  ScorecardCandidateRow,
  CandidateReviewData,
  CommentEntry,
  PositionOption,
  HODDecision,
  ErrorsType,
} from '../State/types';
import ReviewScoreCardServicesInstance from '../ReviewScoreCardServies/ReviewScoreCardServices';
import { StatusId } from '../../../../utilities/Config';
import { useSubmitReviewScoreCard } from '../Components/useSubmitReviewScoreCard';
export const EDITABLE_STATUS_IDS  = [121, 123, 127, 130, 165, 166];
export const VIEW_ONLY_STATUS_IDS = [122, 15, 167, 168];
export const canEdit  = (statusId: number) => EDITABLE_STATUS_IDS.includes(statusId);
export const canView  = (statusId: number) => VIEW_ONLY_STATUS_IDS.includes(statusId);
export const isLevel2 = (statusId: number) => statusId === 129;
function _parseQJson(raw: any): Record<string, number>[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

function calculateGPA(scorecards: any[]): string {
  if (!scorecards || scorecards.length === 0) return '';
  try {
    const level1Panels = scorecards.filter(
      s => !s.InterviewLevel || /level\s*1/i.test(s.InterviewLevel || ''),
    );
    const panels       = level1Panels.length > 0 ? level1Panels : scorecards;
    const maxOverall   = panels.length * 40;
    let sumOverall = 0, sumQuestion = 0, maxQuestion = 0;
    for (const sc of panels) {
      sumOverall +=
        (Number(sc.RelevantQualification)            || 0) +
        (Number(sc.ReleventExperience)               || 0) +
        (Number(sc.Knowledge)                        || 0) +
        (Number(sc.EnergyLevel)                      || 0) +
        (Number(sc.MeetJobRequirement)               || 0) +
        (Number(sc.ContributeTowardsCultureRequried) || 0) +
        (Number(sc.Experience)                       || 0) +
        (Number(sc.OtherCriteriaScore)               || 0);
      const qJson  = _parseQJson(sc.QuestionJson);
      const qScore = qJson.reduce(
        (sum: number, q: any) => sum + (Number(Object.values(q)[0]) || 0), 0,
      );
      sumQuestion += qScore;
      maxQuestion += qJson.length * 3;
    }
    const combined    = sumOverall + sumQuestion;
    const maxPossible = maxOverall  + maxQuestion;
    if (maxPossible <= 0) return '';
    return String(Math.floor((combined / maxPossible) * 5 * 100) / 100);
  } catch (e) { console.warn('[calculateGPA]', e); return ''; }
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useReviewScorecard(
  recruitmentId:      number,
  currentUserEmail:   string,
  departmentFromRoute?: string,
) {
  // ── Candidate list ────────────────────────────────────────────────────────
  const [candidates,        setCandidates]        = React.useState<ScorecardCandidateRow[]>([]);
  const [candidatesLoading, setCandidatesLoading] = React.useState(true);
  const [drawerOpen]                              = React.useState(true);
  const [currentPage,       setCurrentPage]       = React.useState(1);
  const [pageSize,          setPageSize]          = React.useState(10);
  const [searchTerm,        setSearchTerm]        = React.useState('');

  // ── Review modal ──────────────────────────────────────────────────────────
  const [reviewingCandidate, setReviewingCandidate] = React.useState<ScorecardCandidateRow | null>(null);
  const [reviewData,         setReviewData]         = React.useState<CandidateReviewData | null>(null);
  const [reviewLoading,      setReviewLoading]      = React.useState(false);
  const [scoreData,          setScoreData]          = React.useState<any[]>([]);
  const [scoreLoading,       setScoreLoading]       = React.useState(false);
  const [positionOptions,    setPositionOptions]    = React.useState<PositionOption[]>([]);

  // ── Comments ──────────────────────────────────────────────────────────────
  const [showComments,    setShowComments]    = React.useState(false);
  const [level1Comments,  setLevel1Comments]  = React.useState<CommentEntry[]>([]);
  const [level2Comments,  setLevel2Comments]  = React.useState<CommentEntry[]>([]);
  const [commentsLoading, setCommentsLoading] = React.useState(false);

  // ── HOD decision form ─────────────────────────────────────────────────────
  const [hodDecision,          setHodDecision]          = React.useState<HODDecision>('');
  const [decisionComment,      setDecisionComment]      = React.useState('');
  const [confirmed,            setConfirmed]            = React.useState(false);
  const [selectedPositionId,   setSelectedPositionId]   = React.useState<number | null>(null);
  const [selectedPositionText, setSelectedPositionText] = React.useState('');

  // ── shouldShowPositionId helper ───────────────────────────────────────────
  const shouldShowPositionId = React.useCallback(
    (statusId: number, decision: HODDecision): boolean => {
      if (statusId === StatusId.Selected) return true;
      if (
        decision === 'Yes' &&
        statusId !== StatusId.PendingwithHODtoselectthecandidateLevel2 &&
        statusId !== StatusId.CandidateOnHoldbyHODLevel1 &&
        statusId !== StatusId.Selected
      ) return true;
      return false;
    },
    [],
  );

  // ── Load / refresh candidates ─────────────────────────────────────────────
  const loadCandidates = React.useCallback(async () => {
    if (!recruitmentId) return;
    setCandidatesLoading(true);
    try {
      const list = await ReviewScoreCardServicesInstance.getCandidatesByRecruitmentId(recruitmentId);
      const mapped: ScorecardCandidateRow[] = list.map((c: any) => ({
        id:             c.id,
        recruitmentID:  c.recruitmentID,
        jobCode:        c.jobCode        || '',
        jobCodeID:      c.jobCodeID      || 0,
        fullName:       c.fullName       || '',
        nationality:    c.nationality    || '',
        gender:         c.gender         || '',
        status:         c.status         || '',
        statusId:       c.statusId       || 0,
        interviewDate:  c.interviewDate  || '',
        interviewLevel: c.interviewLevel || '',
        grade:          c.grade          || '',
        department:     c.department     || '',
        gpa:            c.gpa            || '',
        positionTitle:  c.positionTitle  || '',
        disability:     c.disability     || '',
        jobTitle:       c.jobTitle       || '',
      }));
      setCandidates(mapped);
    } catch (e) {
      console.error('[useReviewScorecard] loadCandidates error:', e);
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  }, [recruitmentId]);

  React.useEffect(() => { void loadCandidates(); }, [loadCandidates]);

  const refreshCandidates = React.useCallback(async () => {
    await loadCandidates();
  }, [loadCandidates]);

  // ── Filter + paginate ─────────────────────────────────────────────────────
  const filteredCandidates = React.useMemo(() =>
    candidates.filter(c =>
      searchTerm === '' ||
      Object.values(c).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase())),
    ),
    [candidates, searchTerm],
  );

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));

  const paginatedCandidates = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCandidates.slice(start, start + pageSize);
  }, [filteredCandidates, currentPage, pageSize]);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // ── closeReview ───────────────────────────────────────────────────────────
  const closeReview = React.useCallback(() => {
    setReviewingCandidate(null);
    setReviewData(null);
    setScoreData([]);
    setShowComments(false);
    setLevel1Comments([]);
    setLevel2Comments([]);
  }, []);

  // ── onSuccess callback → passed into submit hook ──────────────────────────
  const handleSubmitSuccess = React.useCallback(async () => {
    closeReview();
    await refreshCandidates();
  }, [closeReview, refreshCandidates]);

  // ── 🔑 Delegate submit logic to standalone hook ───────────────────────────
  const submitHook = useSubmitReviewScoreCard({
    reviewingCandidate,
    reviewData,
    hodDecision,
    decisionComment,
    confirmed,
    selectedPositionId,
    currentUserEmail,
    shouldShowPositionId,
    onSuccess: handleSubmitSuccess,
  });

  // ── openReview ────────────────────────────────────────────────────────────
  const openReview = React.useCallback(async (candidate: ScorecardCandidateRow) => {
    const department = departmentFromRoute || candidate.department || '';
    setReviewingCandidate({ ...candidate, department });
    setReviewData(null);
    setScoreData([]);
    setHodDecision('');
    setDecisionComment('');
    setConfirmed(false);
    setSelectedPositionId(null);
    setSelectedPositionText('');
    setShowComments(false);
    setLevel1Comments([]);
    setLevel2Comments([]);

    // ← Reset submit state whenever a fresh candidate opens
    submitHook.resetSubmit();

    setReviewLoading(true);
    setScoreLoading(true);
    try {
      const result = await ReviewScoreCardServicesInstance.getReviewScoreCardData(
        candidate.id, currentUserEmail, { ...candidate, department },
      );

      setReviewData({
        candidateData: {
          Nationality:           result.nationality,
          Gender:                result.gender,
          Qualification:         result.qualification,
          TotalYearOfExperiance: result.miningExp,
          ReleventExperience:    result.relevantExp,
          InterviewDate:         result.interviewDate,
          ConflictsOfInterest:   result.conflictsOfInterest,
          Disability:            result.disability,
          PositionTitle:         result.positionTitle,
          level2ScorecardId:     result.level2Scorecard?.ID ?? null,
          jobRequestId:          result.jobRequestId ?? null,
        },
        panelMembers: (result.panelMembers || []).map((m: any) =>
          typeof m === 'string' ? m : m.name || '',
        ),
        questions:    result.questions    || [],
        reviewerName: result.reviewerName || '',
        jobTitleEn:   result.jobTitleEn   || '',
        jobTitleFr:   result.jobTitleFr   || '',
      });

      const scorecardArr = Array.isArray(result.scorecard)
        ? result.scorecard
        : result.scorecard ? [result.scorecard] : [];
      setScoreData(scorecardArr);

      if (!candidate.gpa && scorecardArr.length > 0) {
        const calculatedGPA = calculateGPA(scorecardArr);
        if (calculatedGPA) {
          setReviewingCandidate(prev => prev ? { ...prev, gpa: calculatedGPA } : prev);
        }
      }

      if (result.hodDecision) {
        const hod = result.hodDecision;
        if (hod.Comments) setDecisionComment(hod.Comments);
        const posId = hod.PositionID?.ID || hod.PositionIDId || null;
        if (posId) {
          setSelectedPositionId(posId);
          setSelectedPositionText(hod.PositionID?.PositionID || hod.PositionText || '');
        }
      }

      const sid = candidate.statusId;
      if (sid === StatusId.Selected) {
        setHodDecision('Yes');
      } else if ([
        StatusId.OnHoldbyHOD,
        StatusId.CandidateOnHoldbyHODLevel1,
        StatusId.CandidateOnHoldbyHODLevel2,
      ].includes(sid)) {
        setHodDecision('On Hold');
      } else if ([
        StatusId.RejectedbyHOD,
        StatusId.CandidateRejectedbyHODLevel1,
        StatusId.CandidateRejectedbyHODLevel2,
      ].includes(sid)) {
        setHodDecision('No');
      }

      const _shouldFetchPosition = (s: number, dept: string | undefined): boolean => {
        if (!dept) return false;
        const n = Number(s);
        return (
          n === Number(StatusId.PendingwithHODtoAssignPositionID)        ||
          n === Number(StatusId.PendingwithHODtoselectthecandidate)      ||
          n === Number(StatusId.Selected)                                 ||
          n === Number(StatusId.OnHoldbyHOD)                             ||
          n === Number(StatusId.CandidateOnHoldbyHODLevel2)
        );
      };

      if (result.positionOptions && result.positionOptions.length > 0) {
        setPositionOptions(result.positionOptions);
      } else if (_shouldFetchPosition(candidate.statusId, department) && candidate.jobCodeID && department) {
        ReviewScoreCardServicesInstance
          .fetchPositionOptions(candidate.jobCodeID, department)
          .then(opts => setPositionOptions(opts))
          .catch(() => setPositionOptions([]));
      } else {
        setPositionOptions([]);
      }
    } catch (e) {
      console.error('[useReviewScorecard] openReview error:', e);
    } finally {
      setReviewLoading(false);
      setScoreLoading(false);
    }
  }, [currentUserEmail, departmentFromRoute, submitHook.resetSubmit]);

  // ── openComments ──────────────────────────────────────────────────────────
  const openComments = React.useCallback(async () => {
    if (!reviewingCandidate) return;
    setShowComments(true);
    setCommentsLoading(true);
    setLevel1Comments([]);
    setLevel2Comments([]);
    try {
      const { level1, level2 } = await ReviewScoreCardServicesInstance.fetchComments(
        reviewingCandidate.id,
      );
      setLevel1Comments(Array.isArray(level1) ? level1 : []);
      setLevel2Comments(Array.isArray(level2) ? level2 : []);
    } catch (e) {
      console.error('[useReviewScorecard] openComments error:', e);
    } finally {
      setCommentsLoading(false);
    }
  }, [reviewingCandidate]);

  // ── Return ────────────────────────────────────────────────────────────────
  return {
    // list
    candidates, candidatesLoading, filteredCandidates, paginatedCandidates,
    currentPage, setCurrentPage, pageSize, setPageSize,
    searchTerm, setSearchTerm, totalPages, drawerOpen,
    loadCandidates, refreshCandidates,

    // review modal
    reviewingCandidate, reviewData, reviewLoading,
    scoreData, scoreLoading, openReview, closeReview,

    // comments
    showComments, setShowComments, level1Comments, level2Comments,
    commentsLoading, openComments,

    // HOD form fields (controlled from this hook)
    hodDecision,          setHodDecision,
    decisionComment,      setDecisionComment,
    confirmed,            setConfirmed,
    selectedPositionId,   setSelectedPositionId,
    selectedPositionText, setSelectedPositionText,
    positionOptions,

    // submit state + action (all from useSubmitReviewScoreCard)
    submitting:     submitHook.submitting,
    submitError:    submitHook.submitError,
    successMessage: submitHook.successMessage,
    errors:         submitHook.errors,
    setErrors:      submitHook.setErrors,
    submitDecision: submitHook.submitDecision,

    // helpers
    shouldShowPositionId,
    isLevel2,
  };
}