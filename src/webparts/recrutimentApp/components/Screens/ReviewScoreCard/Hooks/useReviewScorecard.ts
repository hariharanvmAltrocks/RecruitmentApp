// Hooks/useReviewScorecard.ts
// FIXES:
//  1. GPA calculated from scorecards (overall + question scores combined)
//  2. level1Comments / level2Comments always initialized as []
//  3. Comments fetched when openComments called — safe arrays passed to modal

import * as React from "react";
import {
  ScorecardCandidateRow,
  CandidateReviewData,
  CommentEntry,
  PositionOption,
  HODDecision,
} from "../State/types";
import ReviewScoreCardServicesInstance from "../ReviewScoreCardServies/ReviewScoreCardServices";

// ── Status helpers (exported for use in components) ───────────────────────────
export const EDITABLE_STATUS_IDS  = [121, 123, 127, 130, 165, 166];
export const VIEW_ONLY_STATUS_IDS = [122, 15, 167, 168];

export const canEdit  = (statusId: number) => EDITABLE_STATUS_IDS.includes(statusId);
export const canView  = (statusId: number) => VIEW_ONLY_STATUS_IDS.includes(statusId);
export const isLevel2 = (statusId: number) => [130, 129, 127, 166].includes(statusId);

// ── GPA calculation helper ────────────────────────────────────────────────────
// Formula (mirrors old code):
//   sumOverall   = sum of 8 criteria scores (each 0-5) across Level 1 panels
//   sumQuestion  = sum of all question scores (each 0-3) across Level 1 panels
//   maxOverall   = (number of Level 1 panels) × 40
//   maxQuestion  = (number of questions) × 3 × (number of Level 1 panels)
//   combined     = sumOverall + sumQuestion
//   maxPossible  = maxOverall + maxQuestion
//   GPA          = floor((combined / maxPossible) × 5 × 100) / 100   → 2 decimal places
function _parseQJson(raw: any): Record<string, number>[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
}

function calculateGPA(scorecards: any[]): string {
  if (!scorecards || scorecards.length === 0) return "";
  try {
    // Only Level 1 panels counted for overall score
    // (If InterviewLevel field is missing, count all)
    const level1Panels = scorecards.filter(
      s => !s.InterviewLevel || /level\s*1/i.test(s.InterviewLevel || "")
    );
    const panels = level1Panels.length > 0 ? level1Panels : scorecards;

    const maxOverall = panels.length * 40;
    let sumOverall   = 0;
    let sumQuestion  = 0;
    let maxQuestion  = 0;

    for (const sc of panels) {
      // Overall criteria sum (8 fields × max 5)
      sumOverall +=
        (Number(sc.RelevantQualification)            || 0) +
        (Number(sc.ReleventExperience)               || 0) +
        (Number(sc.Knowledge)                        || 0) +
        (Number(sc.EnergyLevel)                      || 0) +
        (Number(sc.MeetJobRequirement)               || 0) +
        (Number(sc.ContributeTowardsCultureRequried) || 0) +
        (Number(sc.Experience)                       || 0) +
        (Number(sc.OtherCriteriaScore)               || 0);

      // Question scores (each 0-3)
      const qJson = _parseQJson(sc.QuestionJson);
      const qScore = qJson.reduce(
        (sum: number, q: any) => sum + (Number(Object.values(q)[0]) || 0),
        0
      );
      sumQuestion += qScore;
      maxQuestion += qJson.length * 3;
    }

    const combined    = sumOverall + sumQuestion;
    const maxPossible = maxOverall + maxQuestion;

    if (maxPossible <= 0) return "";

    const gpa = Math.floor((combined / maxPossible) * 5 * 100) / 100;
    return String(gpa);
  } catch (e) {
    console.warn("[calculateGPA] error:", e);
    return "";
  }
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useReviewScorecard(recruitmentId: number, currentUserEmail: string) {

  // ── Candidate list ─────────────────────────────────────────────────────────
  const [candidates,        setCandidates]        = React.useState<ScorecardCandidateRow[]>([]);
  const [candidatesLoading, setCandidatesLoading] = React.useState(true);
  const [drawerOpen,        setDrawerOpen]        = React.useState(true);

  // ── Pagination / search ────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize,    setPageSize]    = React.useState(10);
  const [searchTerm,  setSearchTerm]  = React.useState("");

  // ── Review modal ───────────────────────────────────────────────────────────
  const [reviewingCandidate, setReviewingCandidate] = React.useState<ScorecardCandidateRow | null>(null);
  const [reviewData,         setReviewData]         = React.useState<CandidateReviewData | null>(null);
  const [reviewLoading,      setReviewLoading]      = React.useState(false);

  // ── Scorecard data ─────────────────────────────────────────────────────────
  const [scoreData,    setScoreData]    = React.useState<any[]>([]);
  const [scoreLoading, setScoreLoading] = React.useState(false);

  // ── Position options ───────────────────────────────────────────────────────
  const [positionOptions, setPositionOptions] = React.useState<PositionOption[]>([]);

  // ── Comments — always initialized as [] to prevent .map() crash ────────────
  const [showComments,    setShowComments]    = React.useState(false);
  const [level1Comments,  setLevel1Comments]  = React.useState<CommentEntry[]>([]);
  const [level2Comments,  setLevel2Comments]  = React.useState<CommentEntry[]>([]);
  const [commentsLoading, setCommentsLoading] = React.useState(false);

  // ── HOD decision ───────────────────────────────────────────────────────────
  const [hodDecision,          setHodDecision]          = React.useState<HODDecision>("");
  const [decisionComment,      setDecisionComment]      = React.useState("");
  const [confirmed,            setConfirmed]            = React.useState(false);
  const [selectedPositionId,   setSelectedPositionId]   = React.useState<number | null>(null);
  const [selectedPositionText, setSelectedPositionText] = React.useState("");
  const [submitting,           setSubmitting]           = React.useState(false);
  const [submitError,          setSubmitError]          = React.useState("");
  const [successMessage,       setSuccessMessage]       = React.useState("");

  const [errors, setErrors] = React.useState({
    decision: false,
    comment:  false,
    checkbox: false,
    position: false,
  });

  // ── Load candidates ────────────────────────────────────────────────────────
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
        gpa:            c.gpa            || "",  // GPA from service (already calculated)
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

  // ── Filtered + paginated candidates ───────────────────────────────────────
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

  // ── Open review modal ──────────────────────────────────────────────────────
  const openReview = React.useCallback(async (candidate: ScorecardCandidateRow) => {
    setReviewingCandidate(candidate);
    setReviewData(null);
    setScoreData([]);

    // Reset all HOD + error state
    setHodDecision("");
    setDecisionComment("");
    setConfirmed(false);
    setSelectedPositionId(null);
    setSelectedPositionText("");
    setSubmitError("");
    setSuccessMessage("");
    setErrors({ decision: false, comment: false, checkbox: false, position: false });

    // Reset comments — always []
    setShowComments(false);
    setLevel1Comments([]);
    setLevel2Comments([]);

    setReviewLoading(true);
    setScoreLoading(true);

    try {
      const result = await ReviewScoreCardServicesInstance.getReviewScoreCardData(
        candidate.id,
        currentUserEmail,
        { ...candidate }
      );

      // Map to CandidateReviewData shape
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
        },
        panelMembers: (result.panelMembers || []).map((m: any) =>
          typeof m === "string" ? m : m.name || ""
        ),
        questions:    result.questions   || [],
        reviewerName: result.reviewerName || "",
        jobTitleEn:   result.jobTitleEn  || "",
        jobTitleFr:   result.jobTitleFr  || "",
      });

      // Scorecard array
      const scorecardArr = Array.isArray(result.scorecard)
        ? result.scorecard
        : result.scorecard ? [result.scorecard] : [];
      setScoreData(scorecardArr);

      // ── GPA calculation from scorecard ──────────────────────────────────
      // If service didn't return GPA, calculate it now and update candidate in list
      if (!candidate.gpa && scorecardArr.length > 0) {
        const calculatedGPA = calculateGPA(scorecardArr);
        if (calculatedGPA) {
          // Update candidate in list with calculated GPA
          setCandidates(prev =>
            prev.map(c =>
              c.id === candidate.id ? { ...c, gpa: calculatedGPA } : c
            )
          );
          // Update reviewingCandidate too so header shows GPA immediately
          setReviewingCandidate(prev =>
            prev ? { ...prev, gpa: calculatedGPA } : prev
          );
        }
      }

      // Pre-fill existing HOD decision fields
      if (result.hodDecision) {
        const hod = result.hodDecision;
        if (hod.Comments) setDecisionComment(hod.Comments);
        const posId = hod.PositionID?.ID || hod.PositionIDId || null;
        if (posId) {
          setSelectedPositionId(posId);
          setSelectedPositionText(hod.PositionID?.PositionID || hod.PositionText || "");
        }
      }

      // Pre-fill decision radio from statusId
      const sid = candidate.statusId;
      if ([122, 130].includes(sid))          setHodDecision("Yes");
      else if ([123, 165, 166].includes(sid)) setHodDecision("On Hold");
      else if ([15, 167, 168].includes(sid)) setHodDecision("No");

      // Position options
      if (result.positionOptions && result.positionOptions.length > 0) {
        setPositionOptions(result.positionOptions);
      } else if (candidate.jobCodeID && candidate.department) {
        ReviewScoreCardServicesInstance
          .fetchPositionOptions(candidate.jobCodeID, candidate.department)
          .then(setPositionOptions)
          .catch(() => setPositionOptions([]));
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
    // Reset comments arrays to [] on close
    setLevel1Comments([]);
    setLevel2Comments([]);
  }, []);

  // ── Open comments modal ────────────────────────────────────────────────────
  const openComments = React.useCallback(async () => {
    if (!reviewingCandidate) return;
    setShowComments(true);
    setCommentsLoading(true);
    // Always reset to [] before fetching — prevents stale data crash
    setLevel1Comments([]);
    setLevel2Comments([]);
    try {
      const { level1, level2 } = await ReviewScoreCardServicesInstance.fetchComments(
        reviewingCandidate.id
      );
      // Always set arrays (never undefined/null)
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

  // ── shouldShowPositionId ───────────────────────────────────────────────────
  const shouldShowPositionId = React.useCallback(
    (statusId: number, decision: HODDecision): boolean => {
      if (statusId === 130) return true;
      if (statusId === 122) return true;
      if (decision === "Yes" && statusId !== 127 && statusId !== 165) return true;
      return false;
    },
    []
  );

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = React.useCallback(
    (statusId: number, decision: HODDecision): boolean => {
      const newErrors = {
        decision: !decision,
        comment:  !decisionComment.trim(),
        checkbox: !confirmed,
        position:
          decision === "Yes" &&
          shouldShowPositionId(statusId, decision) &&
          !selectedPositionId,
      };
      setErrors(newErrors);
      if (newErrors.decision) {
        setSubmitError("Please select a decision.");
      } else if (Object.values(newErrors).some(Boolean)) {
        setSubmitError("Please fill in all required fields.");
      }
      return Object.values(newErrors).every(v => !v);
    },
    [decisionComment, confirmed, selectedPositionId, shouldShowPositionId]
  );

  // ── Submit HOD decision ────────────────────────────────────────────────────
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
      });

      if (!result.success) {
        setSubmitError(result.message || "Submission failed.");
        setSubmitting(false);
        return;
      }

      const msg =
        hodDecision === "Yes"
          ? "✓ Candidate SELECTED successfully"
          : hodDecision === "No"
          ? "✓ Candidate REJECTED successfully"
          : "✓ Candidate put ON HOLD successfully";

      setSuccessMessage(msg);
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
    currentUserEmail, selectedPositionId,
    validate, closeReview, refreshCandidates,
  ]);

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    // Candidate list
    candidates,
    candidatesLoading,
    filteredCandidates,
    paginatedCandidates,
    currentPage, setCurrentPage,
    pageSize,    setPageSize,
    searchTerm,  setSearchTerm,
    totalPages,
    drawerOpen,
    loadCandidates,
    refreshCandidates,

    // Review modal
    reviewingCandidate,
    reviewData,
    reviewLoading,
    scoreData,
    scoreLoading,
    openReview,
    closeReview,

    // Comments — always [] by default
    showComments,    setShowComments,
    level1Comments,
    level2Comments,
    commentsLoading,
    openComments,

    // HOD decision
    hodDecision,          setHodDecision,
    decisionComment,      setDecisionComment,
    confirmed,            setConfirmed,
    selectedPositionId,   setSelectedPositionId,
    selectedPositionText, setSelectedPositionText,
    positionOptions,
    submitting,
    submitError,
    successMessage,
    errors, setErrors,
    shouldShowPositionId,
    submitDecision,

    // Helpers
    isLevel2,
  };
}