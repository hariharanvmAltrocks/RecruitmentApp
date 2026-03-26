// ReviewScorecard/hooks/useReviewScorecard.ts
// Central hook — owns all state and API calls.
// Components stay pure (props only). No duplicate fetches.

import * as React from "react";

import {
  ScorecardJobRow,
  ScorecardCandidateRow,
  CandidateReviewData,
  CommentEntry,
  PositionOption,
  HODDecision,
} from "../types";
import { evaluationService } from "../../../../services/EvaluationApiService";

// ─── Status helpers (single definition, imported by components) ──────────────
export const EDITABLE_STATUS_IDS = [
  121, // PendingwithHODtoselectthecandidate
  123, // OnHoldbyHOD
  127, // PendingwithHODtoselectthecandidateLevel2
  130, // PendingwithHODtoAssignPositionID
  165, // CandidateOnHoldbyHODLevel1
  166, // CandidateOnHoldbyHODLevel2
];

export const VIEW_ONLY_STATUS_IDS = [
  122, // Selected
  15,  // RejectedbyHOD
  167, // CandidateRejectedbyHODLevel1
  168, // CandidateRejectedbyHODLevel2
];

export const canEdit  = (statusId: number) => EDITABLE_STATUS_IDS.includes(statusId);
export const canView  = (statusId: number) => VIEW_ONLY_STATUS_IDS.includes(statusId);
export const isLevel2 = (statusId: number) =>
  [130, 129, 127, 166].includes(statusId); // PendingwithHODtoAssignPositionID | InterviewScheduledforLevel2 | Level2 variants

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useReviewScorecard(currentUserEmail: string) {
  // ── Job list state ─────────────────────────────────────────────────────────
  const [jobRows,   setJobRows]   = React.useState<ScorecardJobRow[]>([]);
  const [jobsLoading, setJobsLoading] = React.useState(true);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize,    setPageSize]    = React.useState(5);
  const [searchTerm,  setSearchTerm]  = React.useState("");

  // ── Selected job + candidates ──────────────────────────────────────────────
  const [selectedJob,       setSelectedJob]       = React.useState<ScorecardJobRow | null>(null);
  const [candidates,        setCandidates]        = React.useState<ScorecardCandidateRow[]>([]);
  const [candidatesLoading, setCandidatesLoading] = React.useState(false);
  const [drawerOpen,        setDrawerOpen]        = React.useState(false);

  // ── Reviewing a candidate ──────────────────────────────────────────────────
  const [reviewingCandidate, setReviewingCandidate] = React.useState<ScorecardCandidateRow | null>(null);
  const [reviewData,         setReviewData]         = React.useState<CandidateReviewData | null>(null);
  const [reviewLoading,      setReviewLoading]      = React.useState(false);

  // ── Score data (fetched once per candidateId) ──────────────────────────────
  const [scoreData,    setScoreData]    = React.useState<any[]>([]);
  const [scoreLoading, setScoreLoading] = React.useState(false);

  // ── Position options (fetched once per job) ────────────────────────────────
  const [positionOptions, setPositionOptions] = React.useState<PositionOption[]>([]);

  // ── Comments modal ─────────────────────────────────────────────────────────
  const [showComments,   setShowComments]   = React.useState(false);
  const [level1Comments, setLevel1Comments] = React.useState<CommentEntry[]>([]);
  const [level2Comments, setLevel2Comments] = React.useState<CommentEntry[]>([]);
  const [commentsLoading, setCommentsLoading] = React.useState(false);

  // ── HOD Decision form state ────────────────────────────────────────────────
  const [hodDecision,          setHodDecision]          = React.useState<HODDecision>("");
  const [decisionComment,      setDecisionComment]      = React.useState("");
  const [confirmed,            setConfirmed]            = React.useState(false);
  const [selectedPositionId,   setSelectedPositionId]   = React.useState<number | null>(null);
  const [selectedPositionText, setSelectedPositionText] = React.useState("");
  const [submitting,           setSubmitting]           = React.useState(false);
  const [submitError,          setSubmitError]          = React.useState("");
  const [successMessage,       setSuccessMessage]       = React.useState("");

  // ── Validation errors ──────────────────────────────────────────────────────
  const [errors, setErrors] = React.useState({
    decision: false,
    comment: false,
    checkbox: false,
    position: false,
  });

  // ── FETCH: Job list ────────────────────────────────────────────────────────
  const loadJobs = React.useCallback(async () => {
    setJobsLoading(true);
    try {
      const data = await evaluationService.fetchScorecardJobList(currentUserEmail);
      setJobRows(data);
    } finally {
      setJobsLoading(false);
    }
  }, [currentUserEmail]);

  React.useEffect(() => { void loadJobs(); }, [loadJobs]);

  // ── Filtered + paginated jobs ──────────────────────────────────────────────
  const filteredJobs = React.useMemo(() =>
    jobRows.filter(job =>
      searchTerm === "" ||
      Object.values(job).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    ), [jobRows, searchTerm]);

  const totalPages    = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const paginatedJobs = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  // Keep page in range when filter changes
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // ── FETCH: Candidates for selected job ────────────────────────────────────
  const openJob = React.useCallback(async (job: ScorecardJobRow) => {
    setSelectedJob(job);
    setDrawerOpen(true);
    setCandidatesLoading(true);
    try {
      const raw = await evaluationService.fetchScorecardCandidates(job.recruitmentID, job.jobCodeID);
      const { grade, level } = await evaluationService.getGradeAndLevel(job.recruitmentID);
      setCandidates(raw.map((c: any) => ({
        ...c,
        grade:          c.grade          || grade,
        interviewLevel: c.interviewLevel || level,
      })));
    } finally {
      setCandidatesLoading(false);
    }
  }, []);

  const closeJob = React.useCallback(() => {
    setDrawerOpen(false);
    setSelectedJob(null);
    setCandidates([]);
  }, []);

  const refreshCandidates = React.useCallback(async () => {
    if (!selectedJob) return;
    setCandidatesLoading(true);
    try {
      const raw = await evaluationService.fetchScorecardCandidates(
        selectedJob.recruitmentID, selectedJob.jobCodeID
      );
      const { grade, level } = await evaluationService.getGradeAndLevel(selectedJob.recruitmentID);
      setCandidates(raw.map((c: any) => ({
        ...c,
        grade:          c.grade          || grade,
        interviewLevel: c.interviewLevel || level,
      })));
    } finally {
      setCandidatesLoading(false);
    }
  }, [selectedJob]);

  // ── FETCH: Review data + score data for a candidate ───────────────────────
  // Single call — fetches candidateData, panelMembers, questions, scoreData all at once
  const openReview = React.useCallback(async (candidate: ScorecardCandidateRow) => {
    setReviewingCandidate(candidate);
    setReviewData(null);
    setScoreData([]);

    // Reset form
    setHodDecision("");
    setDecisionComment("");
    setConfirmed(false);
    setSelectedPositionId(null);
    setSelectedPositionText("");
    setSubmitError("");
    setSuccessMessage("");
    setErrors({ decision: false, comment: false, checkbox: false, position: false });
    setShowComments(false);

    setReviewLoading(true);
    setScoreLoading(true);

    try {
      // Parallel fetch: review form data + score data
      const [evalResult, scoreResult] = await Promise.all([
        evaluationService.getEvaluationFormData(candidate.id, candidate.recruitmentID, currentUserEmail),
        evaluationService.fetchScoreData(candidate.id),
      ]);

      setReviewData({
        candidateData: evalResult.candidateData || {},
        panelMembers:  evalResult.panelMembers  || [],
        questions:     evalResult.questions      || [],
        reviewerName:  evalResult.reviewerName   || "",
        jobTitleEn:    evalResult.jobTitleEn     || "—",
        jobTitleFr:    evalResult.jobTitleFr     || "—",
      });
      setScoreData(scoreResult || []);

      // Prepopulate HOD decision from saved comment
      try {
        const existing = await evaluationService.fetchExistingHODDecision(
          candidate.id,
          0, // roleId — service falls back to first match
          isLevel2(candidate.statusId)
        );
        if (existing?.comments) setDecisionComment(existing.comments);
        if (existing?.positionId) { setSelectedPositionId(existing.positionId); setSelectedPositionText(existing.positionText || ""); }

        const sid = candidate.statusId;
        if ([122, 130, 165].includes(sid)) setHodDecision("Yes");
        else if ([123, 166].includes(sid)) setHodDecision("On Hold");
        else if ([15, 167, 168].includes(sid)) setHodDecision("No");
      } catch (_) {}

      // Fetch position options (only when needed)
      if (selectedJob?.jobCodeID && selectedJob?.department) {
        evaluationService.fetchPositionOptions(selectedJob.jobCodeID, selectedJob.department)
          .then(setPositionOptions).catch(() => setPositionOptions([]));
      }
    } finally {
      setReviewLoading(false);
      setScoreLoading(false);
    }
  }, [currentUserEmail, selectedJob]);

  const closeReview = React.useCallback(() => {
    setReviewingCandidate(null);
    setReviewData(null);
    setScoreData([]);
    setShowComments(false);
  }, []);

  // ── FETCH: Comments (lazy — only when user clicks VIEW COMMENTS) ──────────
  const openComments = React.useCallback(async () => {
    if (!reviewingCandidate) return;
    setShowComments(true);
    setCommentsLoading(true);
    try {
      const { level1, level2 } = await evaluationService.fetchComments(reviewingCandidate.id);
      setLevel1Comments(level1);
      setLevel2Comments(level2);
    } finally {
      setCommentsLoading(false);
    }
  }, [reviewingCandidate]);

  // ── SUBMIT: HOD decision ───────────────────────────────────────────────────
  const shouldShowPositionId = React.useCallback((statusId: number, decision: HODDecision) => {
    if (statusId === 130) return true; // PendingwithHODtoAssignPositionID
    if (statusId === 122) return true; // Selected
    if (decision === "Yes" && statusId !== 127 && statusId !== 165) return true;
    return false;
  }, []);

  const validate = React.useCallback((statusId: number, decision: HODDecision): boolean => {
    const newErrors = {
      decision: !decision,
      comment:  !decisionComment.trim(),
      checkbox: !confirmed,
      position: decision === "Yes" && shouldShowPositionId(statusId, decision) && !selectedPositionId,
    };
    setErrors(newErrors);
    if (newErrors.decision) setSubmitError("Please select a decision.");
    else if (Object.values(newErrors).some(Boolean)) setSubmitError("Please fill in all required fields.");
    return Object.values(newErrors).every(v => !v);
  }, [decisionComment, confirmed, selectedPositionId, shouldShowPositionId]);

  const submitDecision = React.useCallback(async (roleId: number) => {
    if (!reviewingCandidate) return;
    setSubmitError("");
    if (!validate(reviewingCandidate.statusId, hodDecision)) return;

    setSubmitting(true);
    try {
      const result = await evaluationService.updateCandidateStatusFull({
        candidateId:      reviewingCandidate.id,
        hodDecision,
        comments:         decisionComment,
        currentUserEmail,
        currentRoleId:    roleId,
        gpa:              reviewingCandidate.gpa || "",
        positionId:       selectedPositionId,
        isLevel2:         false, // HOD always uses Branch 2
        jobCodeID:        reviewingCandidate.jobCodeID || selectedJob?.jobCodeID || 0,
        recruitmentID:    reviewingCandidate.recruitmentID,
        statusId:         reviewingCandidate.statusId,
      });

      if (!result.success) {
        setSubmitError(result.message || "Submission failed.");
        setSubmitting(false);
        return;
      }

      const msg =
        hodDecision === "Yes"     ? "✓ Candidate SELECTED successfully" :
        hodDecision === "No"      ? "✓ Candidate REJECTED successfully" :
                                    "✓ Candidate put ON HOLD successfully";
      setSuccessMessage(msg);
      setTimeout(async () => {
        setSuccessMessage("");
        closeReview();
        await refreshCandidates();
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  }, [reviewingCandidate, hodDecision, decisionComment, currentUserEmail,
      selectedPositionId, selectedJob, validate, closeReview, refreshCandidates]);

  return {
    // Job list
    jobRows, jobsLoading, paginatedJobs, filteredJobs,
    currentPage, setCurrentPage, pageSize, setPageSize,
    searchTerm, setSearchTerm, totalPages,
    loadJobs,

    // Job drawer
    selectedJob, candidates, candidatesLoading, drawerOpen,
    openJob, closeJob, refreshCandidates,

    // Review modal
    reviewingCandidate, reviewData, reviewLoading,
    scoreData, scoreLoading,
    openReview, closeReview,

    // Comments
    showComments, level1Comments, level2Comments, commentsLoading,
    openComments, setShowComments,

    // HOD decision
    hodDecision, setHodDecision,
    decisionComment, setDecisionComment,
    confirmed, setConfirmed,
    selectedPositionId, setSelectedPositionId,
    selectedPositionText, setSelectedPositionText,
    positionOptions,
    submitting, submitError, successMessage,
    errors, setErrors,
    shouldShowPositionId,
    submitDecision,

    // Helpers
    isLevel2,
  };
}