// Hooks/useReviewScorecard.ts
// FIXES vs previous version:
//  1. openReview: pre-populate decisionComment from hodDecision.Comments
//     (which now includes HRMSRecruitmentCandidatePersonalDetails.Comments)
//  2. validate: Level2 path only needs comment + checkbox (no decision radio)
//  3. submitDecision: passes all required params including scoreCardId from reviewData
//  4. isLevel2 exported and used consistently

import * as React from "react";
import {
  ScorecardCandidateRow,
  CandidateReviewData,
  CommentEntry,
  PositionOption,
  HODDecision,
} from "../State/types";
import ReviewScoreCardServicesInstance from "../ReviewScoreCardServies/ReviewScoreCardServices";
import { StatusId } from "../../../../utilities/Config";

// ── Status helpers (exported for use in components) ───────────────────────────
export const EDITABLE_STATUS_IDS  = [121, 123, 127, 130, 165, 166];
export const VIEW_ONLY_STATUS_IDS = [122, 15, 167, 168];

export const canEdit  = (statusId: number) => EDITABLE_STATUS_IDS.includes(statusId);
export const canView  = (statusId: number) => VIEW_ONLY_STATUS_IDS.includes(statusId);
// isLevel2 — ONLY 129 (InterviewScheduledforLevel2) triggers Branch 1 (panel scorecard submit)
// 127 (PendingwithHODtoselectthecandidateLevel2) → HOD selection Branch 2
export const isLevel2 = (statusId: number) => statusId === 129;

// ── GPA calculation helper ────────────────────────────────────────────────────
function _parseQJson(raw: any): Record<string, number>[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

function calculateGPA(scorecards: any[]): string {
  if (!scorecards || scorecards.length === 0) return "";
  try {
    const level1Panels = scorecards.filter(
      s => !s.InterviewLevel || /level\s*1/i.test(s.InterviewLevel || "")
    );
    const panels    = level1Panels.length > 0 ? level1Panels : scorecards;
    const maxOverall = panels.length * 40;
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
      const qScore = qJson.reduce((sum: number, q: any) => sum + (Number(Object.values(q)[0]) || 0), 0);
      sumQuestion += qScore; maxQuestion += qJson.length * 3;
    }
    const combined = sumOverall + sumQuestion, maxPossible = maxOverall + maxQuestion;
    if (maxPossible <= 0) return "";
    return String(Math.floor((combined / maxPossible) * 5 * 100) / 100);
  } catch (e) { console.warn("[calculateGPA]", e); return ""; }
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useReviewScorecard(
  recruitmentId: number, currentUserEmail: string, departmentFromRoute?: string,
) {
  // ── Candidate list ──────────────────────────────────────────────────────────
  const [candidates,        setCandidates]        = React.useState<ScorecardCandidateRow[]>([]);
  const [candidatesLoading, setCandidatesLoading] = React.useState(true);
  const [drawerOpen,        setDrawerOpen]        = React.useState(true);

  // ── Pagination / search ─────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize,    setPageSize]    = React.useState(10);
  const [searchTerm,  setSearchTerm]  = React.useState("");

  // ── Review modal ────────────────────────────────────────────────────────────
  const [reviewingCandidate, setReviewingCandidate] = React.useState<ScorecardCandidateRow | null>(null);
  const [reviewData,         setReviewData]         = React.useState<CandidateReviewData | null>(null);
  const [reviewLoading,      setReviewLoading]      = React.useState(false);
  const [scoreData,          setScoreData]          = React.useState<any[]>([]);
  const [scoreLoading,       setScoreLoading]       = React.useState(false);

  // ── Position options ────────────────────────────────────────────────────────
  const [positionOptions, setPositionOptions] = React.useState<PositionOption[]>([]);

  // ── Comments ────────────────────────────────────────────────────────────────
  const [showComments,    setShowComments]    = React.useState(false);
  const [level1Comments,  setLevel1Comments]  = React.useState<CommentEntry[]>([]);
  const [level2Comments,  setLevel2Comments]  = React.useState<CommentEntry[]>([]);
  const [commentsLoading, setCommentsLoading] = React.useState(false);

  // ── HOD decision state ──────────────────────────────────────────────────────
  const [hodDecision,          setHodDecision]          = React.useState<HODDecision>("");
  const [decisionComment,      setDecisionComment]      = React.useState("");
  const [confirmed,            setConfirmed]            = React.useState(false);
  const [selectedPositionId,   setSelectedPositionId]   = React.useState<number | null>(null);
  const [selectedPositionText, setSelectedPositionText] = React.useState("");
  const [submitting,           setSubmitting]           = React.useState(false);
  const [submitError,          setSubmitError]          = React.useState("");
  const [successMessage,       setSuccessMessage]       = React.useState("");

  const [errors, setErrors] = React.useState({
    decision: false, comment: false, checkbox: false, position: false,
  });

  // ── Load candidates ─────────────────────────────────────────────────────────
  const loadCandidates = React.useCallback(async () => {
    if (!recruitmentId) return;
    setCandidatesLoading(true);
    try {
      const list = await ReviewScoreCardServicesInstance.getCandidatesByRecruitmentId(recruitmentId);
      const mapped: ScorecardCandidateRow[] = list.map((c: any) => ({
        id:             c.id,
        recruitmentID:  c.recruitmentID,
        jobCode:        c.jobCode        || "",
        jobCodeID:      c.jobCodeID      || 0,
        fullName:       c.fullName       || "",
        nationality:    c.nationality    || "",
        gender:         c.gender         || "",
        status:         c.status         || "",
        statusId:       c.statusId       || 0,
        interviewDate:  c.interviewDate  || "",
        interviewLevel: c.interviewLevel || "",
        grade:          c.grade          || "",
        department:     c.department     || "",
        gpa:            c.gpa            || "",
        positionTitle:  c.positionTitle  || "",
        disability:     c.disability     || "",
        jobTitle:       c.jobTitle       || "",
      }));
      setCandidates(mapped);
    } catch (e) {
      console.error("[useReviewScorecard] loadCandidates error:", e);
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  }, [recruitmentId]);

  React.useEffect(() => { void loadCandidates(); }, [loadCandidates]);

  // ── Filtered + paginated ────────────────────────────────────────────────────
  const filteredCandidates = React.useMemo(() =>
    candidates.filter(c =>
      searchTerm === "" ||
      Object.values(c).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [candidates, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));

  const paginatedCandidates = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCandidates.slice(start, start + pageSize);
  }, [filteredCandidates, currentPage, pageSize]);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const refreshCandidates = React.useCallback(async () => {
    await loadCandidates();
  }, [loadCandidates]);

  // ── Open review modal ───────────────────────────────────────────────────────
  const openReview = React.useCallback(async (candidate: ScorecardCandidateRow) => {
    const department = candidate.department || departmentFromRoute || '';
    setReviewingCandidate({ ...candidate, department });
    setReviewData(null);
    setScoreData([]);

    // Reset HOD state
    setHodDecision("");
    setDecisionComment("");
    setConfirmed(false);
    setSelectedPositionId(null);
    setSelectedPositionText("");
    setSubmitError("");
    setSuccessMessage("");
    setErrors({ decision: false, comment: false, checkbox: false, position: false });
    setShowComments(false);
    setLevel1Comments([]);
    setLevel2Comments([]);

    setReviewLoading(true);
    setScoreLoading(true);

    try {
      const result = await ReviewScoreCardServicesInstance.getReviewScoreCardData(
        candidate.id, currentUserEmail, { ...candidate, department }
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
          // expose level2Scorecard ID for Level2 submit
          level2ScorecardId:     result.level2Scorecard?.ID ?? null,
        },
        panelMembers: (result.panelMembers || []).map((m: any) =>
          typeof m === "string" ? m : m.name || ""
        ),
        questions:    result.questions   || [],
        reviewerName: result.reviewerName || "",
        jobTitleEn:   result.jobTitleEn  || "",
        jobTitleFr:   result.jobTitleFr  || "",
      });

      // Scorecard
      const scorecardArr = Array.isArray(result.scorecard)
        ? result.scorecard
        : result.scorecard ? [result.scorecard] : [];
      setScoreData(scorecardArr);

      // GPA fallback calculation
      if (!candidate.gpa && scorecardArr.length > 0) {
        const calculatedGPA = calculateGPA(scorecardArr);
        if (calculatedGPA) {
          setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, gpa: calculatedGPA } : c));
          setReviewingCandidate(prev => prev ? { ...prev, gpa: calculatedGPA } : prev);
        }
      }

      // ── Pre-fill HOD decision + comment from stored data ──────────────────
      // Comment: from hodDecision.Comments (which includes HRMSRecruitmentCandidatePersonalDetails.Comments)
      if (result.hodDecision) {
        const hod = result.hodDecision;
        if (hod.Comments) setDecisionComment(hod.Comments);
        // positionId from HRMSSelectedCandidateDetailsByHOD
        const posId = hod.PositionID?.ID || hod.PositionIDId || null;
        if (posId) {
          setSelectedPositionId(posId);
          setSelectedPositionText(hod.PositionID?.PositionID || hod.PositionText || "");
        }
      }

      // ── Pre-fill decision radio from statusId ─────────────────────────────
      // mirrors old code useEffect on StatusId:
      //   Selected / Level2 Selected → "Yes"
      //   OnHold / Level1OnHold / Level2OnHold → "On Hold"
      //   Rejected / Level1Rejected / Level2Rejected → "No"
      // Pre-fill decision radio — mirrors old code useEffect on StatusId
      // Old code:
      //   RejectedbyHOD / CandidateRejectedbyHODLevel1 / CandidateRejectedbyHODLevel2 → "No"
      //   Selected → "Yes"
      //   OnHoldbyHOD / CandidateOnHoldbyHODLevel1 / CandidateOnHoldbyHODLevel2 → "On Hold"
      //   PendingwithHODtoselectthecandidateLevel2 (127) → no pre-fill (pending, HOD must choose)
      const sid = candidate.statusId;
      if (sid === StatusId.Selected) {
        setHodDecision("Yes");
      } else if ([
        StatusId.OnHoldbyHOD,
        StatusId.CandidateOnHoldbyHODLevel1,
        StatusId.CandidateOnHoldbyHODLevel2,
      ].includes(sid)) {
        setHodDecision("On Hold");
      } else if ([
        StatusId.RejectedbyHOD,
        StatusId.CandidateRejectedbyHODLevel1,
        StatusId.CandidateRejectedbyHODLevel2,
      ].includes(sid)) {
        setHodDecision("No");
      }
      // 121 / 127 / 130 / 165 / 166 → pending decision, leave blank for HOD to choose

      // ── Position options ──────────────────────────────────────────────────
      // Mirror old code: fetch for these 5 statuses only
      // Only fetch for statuses where department is available and needed
      const _shouldFetchPosition = (s: number, dept: string | undefined): boolean => {
        if (!dept) return false;
        return (
          s === StatusId.PendingwithHODtoAssignPositionID   ||
          s === StatusId.PendingwithHODtoselectthecandidate ||
          s === StatusId.Selected                           ||
          s === StatusId.OnHoldbyHOD                        ||
          s === StatusId.CandidateOnHoldbyHODLevel2
        );
      };


      if (result.positionOptions && result.positionOptions.length > 0) {
        setPositionOptions(result.positionOptions);
      } else if (_shouldFetchPosition(candidate.statusId, department) && candidate.jobCodeID && department) {
        console.log("Calling fetchPositionOptions with jobCodeID:", candidate.jobCodeID, "department:", department);
        ReviewScoreCardServicesInstance
          .fetchPositionOptions(candidate.jobCodeID, department)
          .then((options) => setPositionOptions(options))
          .catch(() => setPositionOptions([]));
      } else {
        setPositionOptions([]);
      }

    } catch (e) {
      console.error("[useReviewScorecard] openReview error:", e);
    } finally {
      setReviewLoading(false);
      setScoreLoading(false);
    }
  }, [currentUserEmail]);

  const closeReview = React.useCallback(() => {
    setReviewingCandidate(null);
    setReviewData(null);
    setScoreData([]);
    setShowComments(false);
    setLevel1Comments([]);
    setLevel2Comments([]);
  }, []);

  // ── Open comments modal ─────────────────────────────────────────────────────
  const openComments = React.useCallback(async () => {
    if (!reviewingCandidate) return;
    setShowComments(true);
    setCommentsLoading(true);
    setLevel1Comments([]);
    setLevel2Comments([]);
    try {
      const { level1, level2 } = await ReviewScoreCardServicesInstance.fetchComments(
        reviewingCandidate.id
      );
      setLevel1Comments(Array.isArray(level1) ? level1 : []);
      setLevel2Comments(Array.isArray(level2) ? level2 : []);
    } catch (e) {
      console.error("[useReviewScorecard] openComments error:", e);
      setLevel1Comments([]);
      setLevel2Comments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [reviewingCandidate]);

  // ── shouldShowPositionId ────────────────────────────────────────────────────
  // Mirrors old code exactly (two blocks)
  const shouldShowPositionId = React.useCallback(
    (statusId: number, decision: HODDecision): boolean => {
      // Block 2: always show when already Selected (prefill/view mode)
      if (statusId === StatusId.Selected) return true;
      // Block 1: show when Yes AND NOT excluded statuses
      if (
        decision === "Yes" &&
        statusId !== StatusId.PendingwithHODtoselectthecandidateLevel2 &&
        statusId !== StatusId.CandidateOnHoldbyHODLevel1 &&
        statusId !== StatusId.Selected
      ) return true;
      return false;
    },
    []
  );

  // ── Validation ──────────────────────────────────────────────────────────────
  // Level2 (isLevel2 statusId): only comment + checkbox required (no decision radio)
  // Level1 (HOD): decision + comment + checkbox + positionId if applicable
  const validate = React.useCallback(
    (statusId: number, decision: HODDecision): boolean => {
      const lv2 = isLevel2(statusId);
      const newErrors = {
        // Level2 path: no decision radio needed
        decision: lv2 ? false : !decision,
        comment:  !decisionComment.trim(),
        checkbox: !confirmed,
        position:
          !lv2 &&
          decision === "Yes" &&
          shouldShowPositionId(statusId, decision) &&
          !selectedPositionId,
      };
      setErrors(newErrors);
      if (!lv2 && newErrors.decision) {
        setSubmitError("Please select a decision.");
      } else if (Object.values(newErrors).some(Boolean)) {
        setSubmitError("Please fill in all required fields.");
      }
      return Object.values(newErrors).every(v => !v);
    },
    [decisionComment, confirmed, selectedPositionId, shouldShowPositionId]
  );

  // ── Submit HOD decision ─────────────────────────────────────────────────────
  const submitDecision = React.useCallback(async (roleId: number) => {
    if (!reviewingCandidate) return;
    setSubmitError("");

    if (!validate(reviewingCandidate.statusId, hodDecision)) return;

    setSubmitting(true);
    try {
      const result = await ReviewScoreCardServicesInstance.submitHODDecision({
        candidateId:      reviewingCandidate.id,
        hodDecision,
        comments:         decisionComment,
        currentUserEmail,
        currentRoleId:    roleId,
        gpa:              reviewingCandidate.gpa || "",
        positionId:       selectedPositionId,
        isLevel2:         isLevel2(reviewingCandidate.statusId),
        jobCodeID:        reviewingCandidate.jobCodeID || 0,
        recruitmentID:    reviewingCandidate.recruitmentID,
        statusId:         reviewingCandidate.statusId,
        // Level2 scorecard ID (from reviewData.candidateData.level2ScorecardId)
        scoreCardId:      (reviewData?.candidateData as any)?.level2ScorecardId ?? null,
      });

      if (!result.success) {
        setSubmitError(result.message || "Submission failed.");
        setSubmitting(false);
        return;
      }

      setSuccessMessage(result.message);
      setTimeout(async () => {
        setSuccessMessage("");
        closeReview();
        await refreshCandidates();
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  }, [
    reviewingCandidate, hodDecision, decisionComment,
    currentUserEmail, selectedPositionId, reviewData,
    validate, closeReview, refreshCandidates,
  ]);

  // ── Return ──────────────────────────────────────────────────────────────────
  return {
    candidates, candidatesLoading, filteredCandidates, paginatedCandidates,
    currentPage, setCurrentPage, pageSize, setPageSize, searchTerm, setSearchTerm,
    totalPages, drawerOpen, loadCandidates, refreshCandidates,

    reviewingCandidate, reviewData, reviewLoading, scoreData, scoreLoading,
    openReview, closeReview,

    showComments, setShowComments, level1Comments, level2Comments, commentsLoading, openComments,

    hodDecision, setHodDecision, decisionComment, setDecisionComment,
    confirmed, setConfirmed, selectedPositionId, setSelectedPositionId,
    selectedPositionText, setSelectedPositionText, positionOptions,
    submitting, submitError, successMessage, errors, setErrors,
    shouldShowPositionId, submitDecision, isLevel2,
  };
}