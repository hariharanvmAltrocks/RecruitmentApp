import * as React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  X, Pencil, Eye, RotateCcw, ArrowUpDown,
  Users, CheckCircle2, AlertCircle, Zap, Activity, Globe, FileText,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import styles from "./Reviewscorecardtab.module.scss";
import { evaluationService } from "../../../services/EvaluationApiService";
import { useRoleContext } from "../../../../../../utilities/hooks/RoleContext";
import { ScorecardJobRow, ScorecardCandidateRow, PositionOption } from "../../../services/IEvaluationService";
import { StatusId } from "../../../../../../utilities/Config";
import QuestionnaireApi from "../../../services/QuestionnaireApi/QuestionnaireApi";

const questionnaireService = new QuestionnaireApi();

// ─── canEdit / canView helpers (mirrors old CandidateList.tsx) ────────────────
const EDITABLE_STATUS_IDS = [
  StatusId.OnHoldbyHOD,
  StatusId.PendingwithHODtoselectthecandidate,
  StatusId.PendingwithHODtoselectthecandidateLevel2,
  StatusId.PendingwithHODtoAssignPositionID,
  StatusId.CandidateOnHoldbyHODLevel1,
  StatusId.CandidateOnHoldbyHODLevel2,
];

const VIEW_ONLY_STATUS_IDS = [
  StatusId.Selected,
  StatusId.RejectedbyHOD,
  StatusId.CandidateRejectedbyHODLevel1,
  StatusId.CandidateRejectedbyHODLevel2,
];

// Whether Position ID field should be visible (mirrors old HodViewScorecard condition)
const shouldShowPositionId = (statusId: number, hodDecision: string) => {
  const level2Pending = statusId === StatusId.PendingwithHODtoselectthecandidateLevel2;
  const alreadyOnHoldL1 = statusId === StatusId.CandidateOnHoldbyHODLevel1;
  const alreadySelected = statusId === StatusId.Selected;

  // Mirrors old: actionValue.CandidateStatus === "Yes" &&
  //   statusId != PendingwithHODtoselectthecandidateLevel2 &&
  //   statusId != CandidateOnHoldbyHODLevel1 &&
  //   statusId != Selected
  if (hodDecision === "Yes" && !level2Pending && !alreadyOnHoldL1 && !alreadySelected) return true;

  // Mirrors old: statusId === Selected (show even when already selected)
  if (statusId === StatusId.PendingwithHODtoAssignPositionID) return true;

  return false;
};

// ─── isLevel2 helper ─────────────────────────────────────────────────────────
const isLevel2Status = (statusId: number) =>
  statusId === StatusId.PendingwithHODtoAssignPositionID ||
  statusId === StatusId.InterviewScheduledforLevel2 ||
  statusId === StatusId.PendingwithHODtoselectthecandidateLevel2 ||
  statusId === StatusId.CandidateOnHoldbyHODLevel2;

// ─────────────────────────────────────────────────────────────────────────────
// ReviewScorecardTab
// ─────────────────────────────────────────────────────────────────────────────
const ReviewScorecardTab: React.FC<any> = ({ employeeList, onFormStateChange, CurrentUserEmailId, ...props }) => {
  const navigate = useNavigate();
  const { ADGroupData } = useRoleContext();
  const effectiveUserEmail = CurrentUserEmailId || ADGroupData?.EmailId?.[0] || "";
  const roleId = ADGroupData?.roleIDs?.[0] || 0;

  const [loading, setLoading] = React.useState(true);
  const [jobRows, setJobRows] = React.useState<ScorecardJobRow[]>([]);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [positionRequestFilter, setPositionRequestFilter] = React.useState("");
  const [nationalityFilter, setNationalityFilter] = React.useState("");
  const [jobCodeFilter, setJobCodeFilter] = React.useState("");

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);

  const [isSelectionOpen, setIsSelectionOpen] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<ScorecardJobRow | null>(null);
  const [candidates, setCandidates] = React.useState<ScorecardCandidateRow[]>([]);

  const [reviewingCandidate, setReviewingCandidate] = React.useState<ScorecardCandidateRow | null>(null);
  const [reviewingCandidateData, setReviewingCandidateData] = React.useState<any>(null);
  const [interviewQuestions, setInterviewQuestions] = React.useState<any[]>([]);
  const [fetchingQuestions, setFetchingQuestions] = React.useState(false);

  const userInitial = (reviewingCandidateData?.reviewerName || "").charAt(0).toUpperCase();

  React.useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    setLoading(true);
    const data = await evaluationService.fetchScorecardJobList(effectiveUserEmail);
    setJobRows(data);
    setLoading(false);
  };

  const handleReviewCandidate = async (candidate: ScorecardCandidateRow) => {
    setReviewingCandidate(candidate);
    setFetchingQuestions(true);

    try {
      const evalData = await evaluationService.getEvaluationFormData(
        candidate.id, candidate.recruitmentID, effectiveUserEmail,
      );

      setInterviewQuestions(evalData.questions || []);
      const source = evalData.candidateData || {};
      const getField = (keys: string[]) =>
        keys.reduce((acc: any, key: string) => {
          if (acc) return acc;
          const rawValue = source[key] ?? source[key.toLowerCase()] ?? source[key.toUpperCase()];
          return rawValue !== undefined && rawValue !== null ? rawValue : "";
        }, "");

      const normalizeDate = (value: any) => {
        if (!value) return "";
        const parsed = moment(value);
        return parsed.isValid() ? parsed.format("YYYY-MM-DD") : (typeof value === "string" ? value : "");
      };

      const candidateWithData = {
        ...candidate,
        nationality:        candidate.nationality || getField(["Nationality"]) || "—",
        gender:             candidate.gender      || getField(["Gender"])      || "—",
        qualification:      getField(["HighestRelevantQualification", "Qualification"]) || "—",
        totalWorkExperience: getField(["TotalYearOfExperiance", "TotalWorkExperience"]) || "—",
        relevantExperience:  getField(["ReleventExperience", "RelevantExperience"])     || "—",
        interviewDate:
          candidate.interviewDate ||
          normalizeDate(getField(["InterviewDate", "InterviewDateLevel2"])) || "—",
        interviewLevel: candidate.interviewLevel || getField(["InterviewLevel"]) || "—",
        grade:          getField(["Grade", "JobGrade"])           || "—",
        conflicts:      getField(["ConflictsOfInterest"])         || "—",
        disability:     getField(["Disability", "disability"])    || "—",
        panelMembers:   evalData.panelMembers  || [],
        reviewerName:   evalData.reviewerName  || effectiveUserEmail || "",
        jobTitleEn:     evalData.jobTitleEn    || candidate.jobTitle || candidate.positionTitle || source.JobTitle || source.PositionTitle || "—",
        jobTitleFr:     evalData.jobTitleFr    || source.JobTitleFr || candidate.positionTitle || "—",
        // Pass raw candidateData so modal can reference SP columns directly
        _raw: source,
      };

      console.log("[TAB] handleReviewCandidate debug", {
        currentUserEmail: effectiveUserEmail,
        candidateId: candidate.id,
        candidateName: candidate.fullName,
        candidateFirstName: candidate.firstName || (candidate.fullName || "").split(" ")[0] || "—",
        candidateLastName: candidate.lastName || (candidate.fullName || "").split(" ").slice(1).join(" ") || "—",
        jobTitleEn: candidateWithData.jobTitleEn,
        jobTitleFr: candidateWithData.jobTitleFr,
        sourceFields: {
          candidateData: source,
          evalData: {
            reviewerName: evalData.reviewerName,
            panelMembers: evalData.panelMembers,
            jobTitleEn: evalData.jobTitleEn,
            jobTitleFr: evalData.jobTitleFr,
          }
        }
      });

      setReviewingCandidateData(candidateWithData);
    } catch (err) {
      console.error("Fetch Error:", err);
      setInterviewQuestions([]);
      setReviewingCandidateData({ ...candidate, panelMembers: [] });
    } finally {
      setFetchingQuestions(false);
    }
  };

  const filteredJobRows = React.useMemo(() => {
    return jobRows.filter(job => {
      const matchSearch = searchTerm === "" ||
        Object.values(job).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
      const matchPos = positionRequestFilter === "" || job.positionRequest === positionRequestFilter;
      const matchNat = nationalityFilter    === "" || job.nationality     === nationalityFilter;
      const matchJob = jobCodeFilter        === "" || job.jobCode         === jobCodeFilter;
      return matchSearch && matchPos && matchNat && matchJob;
    });
  }, [jobRows, searchTerm, positionRequestFilter, nationalityFilter, jobCodeFilter]);

  const totalPages = React.useMemo(() =>
    Math.max(1, Math.ceil(filteredJobRows.length / pageSize)),
    [filteredJobRows.length, pageSize]
  );

  const paginatedJobRows = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobRows.slice(start, start + pageSize);
  }, [filteredJobRows, currentPage, pageSize]);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const openSelection = async (job: ScorecardJobRow) => {
    setSelectedJob(job);
    setIsSelectionOpen(true);
    onFormStateChange?.(true);

    const cands = await evaluationService.fetchScorecardCandidates(
      job.recruitmentID, job.jobCodeID
    );
    const { grade, level } = await evaluationService.getGradeAndLevel(job.recruitmentID);
    const enriched = cands.map(c => ({
      ...c,
      grade:          c.grade          || grade,
      interviewLevel: c.interviewLevel || level,
    }));
    setCandidates(enriched);
  };

  const closeSelection = () => {
    setIsSelectionOpen(false);
    onFormStateChange?.(false);
  };

  const handleRefreshCandidates = async () => {
    if (!selectedJob) return;
    const refreshed = await evaluationService.fetchScorecardCandidates(
      selectedJob.recruitmentID, selectedJob.jobCodeID
    );
    const { grade, level } = await evaluationService.getGradeAndLevel(selectedJob.recruitmentID);
    setCandidates(refreshed.map(c => ({
      ...c,
      grade:          c.grade          || grade,
      interviewLevel: c.interviewLevel || level,
    })));
  };

  return (
    <div className={styles.container}>
      <JobListTable
        jobRows={paginatedJobRows}
        totalItems={filteredJobRows.length}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size: number) => { setPageSize(size); setCurrentPage(1); }}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        positionRequestFilter={positionRequestFilter}
        onPositionRequestFilter={setPositionRequestFilter}
        nationalityFilter={nationalityFilter}
        onNationalityFilter={setNationalityFilter}
        jobCodeFilter={jobCodeFilter}
        onJobCodeFilter={setJobCodeFilter}
        onSelectJob={openSelection}
        onBack={() => navigate("/Dashboard")}
        loading={loading}
      />

      <AnimatePresence>
        {isSelectionOpen && selectedJob && (
          <CandidateSelectionDrawer
            job={selectedJob}
            candidates={candidates}
            onClose={closeSelection}
            onReviewCandidate={handleReviewCandidate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewingCandidate && (
          <CandidateReviewModal
            candidate={reviewingCandidate}
            candidateData={reviewingCandidateData}
            job={selectedJob}
            interviewQuestions={interviewQuestions}
            fetchingQuestions={fetchingQuestions}
            currentUserEmail={effectiveUserEmail}
            currentRoleId={roleId}
            reviewingCandidateData={reviewingCandidateData}
            userInitial={userInitial}
            onClose={() => {
              setReviewingCandidate(null);
              setReviewingCandidateData(null);
              setInterviewQuestions([]);
            }}
            onSubmit={async () => {
              await handleRefreshCandidates();
              setReviewingCandidate(null);
              setReviewingCandidateData(null);
              setInterviewQuestions([]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// JobListTable
// ─────────────────────────────────────────────────────────────────────────────
const JobListTable: React.FC<{
  jobRows: ScorecardJobRow[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchTerm: string;
  onSearch: (value: string) => void;
  positionRequestFilter: string;
  onPositionRequestFilter: (value: string) => void;
  nationalityFilter: string;
  onNationalityFilter: (value: string) => void;
  jobCodeFilter: string;
  onJobCodeFilter: (value: string) => void;
  onSelectJob: (job: ScorecardJobRow) => void;
  onBack: () => void;
  loading: boolean;
}> = ({
  jobRows, totalItems, currentPage, totalPages, pageSize,
  onPageChange, onPageSizeChange, searchTerm, onSearch,
  positionRequestFilter, onPositionRequestFilter,
  nationalityFilter, onNationalityFilter,
  jobCodeFilter, onJobCodeFilter,
  onSelectJob, onBack, loading,
}) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h2>Review Scorecards</h2>
      <button onClick={onBack} className={styles.backButton}>
        <RotateCcw size={14} /> BACK TO DASHBOARD
      </button>
    </div>

    <div className={styles.tableContainer}>
      <table className={styles.styledTable}>
        <thead>
          <tr>
            {["Job Code", "Job Title", "Business Unit Code", "Position Request", "Nationality", "Status"].map(h => (
              <th key={h}>{h} <ArrowUpDown size={10} className="inline ml-1" /></th>
            ))}
            <th className={styles.center}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} className={styles.noData}>Loading...</td></tr>
          ) : jobRows.length === 0 ? (
            <tr><td colSpan={7} className={styles.noData}>No jobs found for the current user.</td></tr>
          ) : (
            jobRows.map(job => (
              <tr key={job.id} onClick={() => onSelectJob(job)}>
                <td className={styles.jobCode}>{job.jobCode}</td>
                <td className={styles.jobTitle}>{job.jobTitle}</td>
                <td className={styles.textMuted}>{job.businessUnitCode}</td>
                <td className={styles.textMuted}>{job.positionRequest}</td>
                <td className={styles.textMuted}>{job.nationality}</td>
                <td>
                  <div className={styles.statusBadge}>
                    <div className={styles.dot}></div>
                    {job.status || "Recruitment In Progress"}
                  </div>
                </td>
                <td className={styles.center}>
                  <button
                    onClick={e => { e.stopPropagation(); onSelectJob(job); }}
                    className={styles.actionButton}
                  >
                    REVIEW
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className={styles.paginationBar}>
      <div className={styles.paginationInfo}>
        Showing <strong>{totalItems === 0 ? 0 : Math.min((currentPage - 1) * pageSize + 1, totalItems)}</strong> to{" "}
        <strong>{Math.min(currentPage * pageSize, totalItems)}</strong> of{" "}
        <strong>{totalItems}</strong> results &nbsp;
        <span className={styles.showEntries}>
          SHOW{" "}
          <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
            {[5, 10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
          </select>{" "}
          ENTRIES
        </span>
      </div>
      <div className={styles.paginationControls}>
        <button className={`${styles.pageBtn} ${currentPage <= 1 ? styles.disabled : ""}`}
          disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page}
            className={`${styles.pageBtn} ${page === currentPage ? styles.activePage : ""}`}
            onClick={() => onPageChange(page)}>{page}</button>
        ))}
        <button className={`${styles.pageBtn} ${currentPage >= totalPages ? styles.disabled : ""}`}
          disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>›</button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CandidateSelectionDrawer
// ─────────────────────────────────────────────────────────────────────────────
const CandidateSelectionDrawer: React.FC<{
  job: ScorecardJobRow;
  candidates: ScorecardCandidateRow[];
  onClose: () => void;
  onReviewCandidate: (candidate: ScorecardCandidateRow) => void;
}> = ({ job, candidates, onClose, onReviewCandidate }) => {

  const pendingCount = candidates.filter(c => EDITABLE_STATUS_IDS.includes(c.statusId)).length;

  const getStatusBadgeClass = (statusId: number) => {
    if (statusId === StatusId.Selected) return styles.statusSelected;
    if (VIEW_ONLY_STATUS_IDS.includes(statusId)) return styles.statusRejected;
    return styles.statusPending;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className={styles.drawerOverlay}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        className={styles.drawer}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.headerContent}>
            <div className={styles.iconBox}><Users size={24} /></div>
            <div>
              <h2>
                Candidate Selection
                {pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
              </h2>
              <p>{job.jobCode} · <span>{job.jobTitle}</span></p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton}><X size={24} /></button>
        </div>

        <div className={styles.drawerBody}>
          <div className={styles.innerCard}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Applicant Name</th>
                  <th>Position Title</th>
                  <th>Interview Levels</th>
                  <th>Grade</th>
                  <th className={styles.center}>GPA</th>
                  <th>Status</th>
                  <th className={styles.center}>Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr><td colSpan={8} className={styles.noData}>No candidates found.</td></tr>
                ) : (
                  candidates.map((cand, idx) => {
                    const canEdit = EDITABLE_STATUS_IDS.includes(cand.statusId);
                    const canView = VIEW_ONLY_STATUS_IDS.includes(cand.statusId);
                    return (
                      <tr key={cand.id}>
                        <td className={styles.textMuted} style={{ fontWeight: 'bold' }}>{idx + 1}</td>
                        <td className={styles.jobTitle}>{cand.fullName}</td>
                        <td className={styles.textMuted}>{cand.positionTitle || "—"}</td>
                        <td className={styles.textMuted}>{cand.interviewLevel || "—"}</td>
                        <td className={styles.textMuted}>{cand.grade || "—"}</td>
                        <td className={styles.center}>
                          <div className={styles.gpaBadge}>{cand.gpa || "—"}</div>
                        </td>
                        <td>
                          <span className={`${styles.statusBadgeText} ${getStatusBadgeClass(cand.statusId)}`}>
                            {cand.status || "—"}
                          </span>
                        </td>
                        <td className={styles.center}>
                          {canEdit && (
                            <button onClick={() => onReviewCandidate(cand)} className={styles.iconButton} title="Edit">
                              <Pencil size={16} />
                            </button>
                          )}
                          {canView && (
                            <button onClick={() => onReviewCandidate(cand)} className={styles.iconButton} title="View">
                              <Eye size={16} />
                            </button>
                          )}
                          {!canEdit && !canView && (
                            <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.drawerFooter}>
          <div className={styles.footerHint}>
            <AlertCircle size={16} />
            <span>Please select a candidate to proceed</span>
          </div>
          <div className={styles.footerActions}>
            <button onClick={onClose} className={styles.cancelBtn}>CANCEL</button>
            <button className={styles.confirmBtn} disabled>CONFIRM SELECTION</button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CandidateReviewModal
// ─────────────────────────────────────────────────────────────────────────────
const CandidateReviewModal: React.FC<{
  candidate: ScorecardCandidateRow;
  candidateData: any;
  job: ScorecardJobRow | null;
  interviewQuestions: any[];
  fetchingQuestions: boolean;
  currentUserEmail: string;
  currentRoleId: number;
  reviewingCandidateData: any;
  userInitial: string;
  onClose: () => void;
  onSubmit: () => void;
}> = ({
  candidate, candidateData, job, interviewQuestions, fetchingQuestions,
  currentUserEmail, currentRoleId, reviewingCandidateData, userInitial,
  onClose, onSubmit
}) => {

  // ── State ──────────────────────────────────────────────────────────────────
  const [scoreData,          setScoreData]         = React.useState<any[]>([]);
  const [loadingScore,       setLoadingScore]       = React.useState(true);

  // HOD Decision state
  const [hodDecision,        setHodDecision]        = React.useState<"Yes" | "No" | "On Hold" | "">("");
  const [decisionComment,    setDecisionComment]    = React.useState("");
  const [confirmed,          setConfirmed]          = React.useState(false);  // checkbox

  // Position ID
  const [positionOptions,    setPositionOptions]    = React.useState<PositionOption[]>([]);
  const [selectedPositionId, setSelectedPositionId] = React.useState<number | null>(null);
  const [selectedPositionText, setSelectedPositionText] = React.useState<string>("");

  // Submission state
  const [submitError,        setSubmitError]        = React.useState("");
  const [submitting,         setSubmitting]         = React.useState(false);
  const [successMessage,     setSuccessMessage]     = React.useState("");

  // Validation errors
  const [posErr,             setPosErr]             = React.useState(false);
  const [commentErr,         setCommentErr]         = React.useState(false);
  const [decisionErr,        setDecisionErr]        = React.useState(false);
  const [checkboxErr,        setCheckboxErr]        = React.useState(false);

  // Comments modal
  const [showComments,       setShowComments]       = React.useState(false);
  const [level1Comments,     setLevel1Comments]     = React.useState<any[]>([]);
  const [level2Comments,     setLevel2Comments]     = React.useState<any[]>([]);
  const [loadingComments,    setLoadingComments]    = React.useState(false);

  // ── Derived flags ──────────────────────────────────────────────────────────
  const canEdit = EDITABLE_STATUS_IDS.includes(candidate.statusId);
  const isLevel2 = isLevel2Status(candidate.statusId);
  const feedbackLabel = isLevel2 ? "Feedback - Level 2" : "Feedback - Level 1";

  React.useEffect(() => {
    console.log("[MODAL] CandidateReviewModal open", {
      currentUserEmail,
      currentRoleId,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      candidateFirstName: candidate.fullName?.split(" ")[0] || "—",
      candidateLastName: candidate.fullName?.split(" ").slice(1).join(" ") || "—",
      jobTitleEn: reviewingCandidateData?.jobTitleEn || "—",
      jobTitleFr: reviewingCandidateData?.jobTitleFr || "—",
      fetchedCandidateData: candidateData,
    });
  }, [candidate.id, currentUserEmail, currentRoleId, candidate.fullName, reviewingCandidateData, candidateData]);

  // ── Load score data ────────────────────────────────────────────────────────
  React.useEffect(() => {
    setLoadingScore(true);
    evaluationService.fetchScoreData(candidate.id)
      .then(d => { setScoreData(d); setLoadingScore(false); });
  }, [candidate.id]);

  // ── Load position options ──────────────────────────────────────────────────
  React.useEffect(() => {
    if (!job?.jobCodeID || !job?.department) { setPositionOptions([]); return; }
    evaluationService.fetchPositionOptions(job.jobCodeID, job.department)
      .then(setPositionOptions).catch(() => setPositionOptions([]));
  }, [job?.jobCodeID, job?.department]);

  // ── PREPOPULATE on View (already submitted values) ─────────────────────────
  // When canEdit=false (view mode) OR canEdit=true with existing submission
  React.useEffect(() => {
    const prepopulate = async () => {
      try {
        const existing = await evaluationService.fetchExistingHODDecision(
          candidate.id, currentRoleId, isLevel2
        );
        if (existing) {
          // Prepopulate comment
          if (existing.comments) setDecisionComment(existing.comments);

          // Prepopulate decision from statusId
          const sid = candidate.statusId;
          if (
            sid === StatusId.Selected ||
            sid === StatusId.PendingwithHODtoAssignPositionID ||
            sid === StatusId.CandidateOnHoldbyHODLevel1
          ) {
            setHodDecision("Yes");
          } else if (
            sid === StatusId.OnHoldbyHOD ||
            sid === StatusId.CandidateOnHoldbyHODLevel2
          ) {
            setHodDecision("On Hold");
          } else if (
            sid === StatusId.RejectedbyHOD ||
            sid === StatusId.CandidateRejectedbyHODLevel1 ||
            sid === StatusId.CandidateRejectedbyHODLevel2
          ) {
            setHodDecision("No");
          }

          // Prepopulate position (if stored)
          if (existing.positionId) {
            setSelectedPositionId(existing.positionId);
          }
          if (existing.positionText) {
            setSelectedPositionText(existing.positionText);
          }
        }
      } catch (e) {
        console.warn("Prepopulate failed:", e);
      }
    };
    prepopulate();
  }, [candidate.id, candidate.statusId, currentRoleId, isLevel2]);

  // ── View comments ──────────────────────────────────────────────────────────
  const handleViewComments = async () => {
    setShowComments(true);
    setLoadingComments(true);
    try {
      const data = await evaluationService.fetchComments(candidate.id);
      setLevel1Comments(data.level1 || []);
      setLevel2Comments(data.level2 || []);
    } catch (e) {
      console.error(e);
    }
    setLoadingComments(false);
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    let valid = true;

    // Decision is always required when canEdit
    if (!hodDecision) {
      setDecisionErr(true);
      setSubmitError("Please select a decision (Yes / No / On Hold).");
      valid = false;
    } else {
      setDecisionErr(false);
    }

    // Comment is always required
    if (!decisionComment.trim()) {
      setCommentErr(true);
      valid = false;
    } else {
      setCommentErr(false);
    }

    // Checkbox confirmation required
    if (!confirmed) {
      setCheckboxErr(true);
      valid = false;
    } else {
      setCheckboxErr(false);
    }

    // Position ID required when decision=Yes and conditions match
    if (hodDecision === "Yes" && shouldShowPositionId(candidate.statusId, "Yes")) {
      if (!selectedPositionId) {
        setPosErr(true);
        valid = false;
      } else {
        setPosErr(false);
      }
    } else {
      setPosErr(false);
    }

    if (!valid && !submitError) {
      setSubmitError("Please fill in all required fields.");
    }

    return valid;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleDecisionSubmit = async () => {
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await evaluationService.updateCandidateStatusFull({
        candidateId:     candidate.id,
        hodDecision,
        comments:        decisionComment,
        currentUserEmail,
        currentRoleId,
        gpa:             candidate.gpa || "",
        positionId:      selectedPositionId,
        isLevel2,
        jobCodeID:       candidate.jobCodeID || job?.jobCodeID || 0,
        recruitmentID:   candidate.recruitmentID,
        statusId:        candidate.statusId,
      });

      if (!result.success) {
        setSubmitError(result.message || "Submission failed.");
        setSubmitting(false);
        return;
      }

      const decisionMsg =
        hodDecision === "Yes"     ? "✓ Candidate SELECTED successfully"   :
        hodDecision === "No"      ? "✓ Candidate REJECTED successfully"   :
                                    "✓ Candidate put ON HOLD successfully";

      setSuccessMessage(decisionMsg);
      setSubmitError("");

      setTimeout(() => {
        setSuccessMessage("");
        onSubmit();
      }, 1200);
    } catch (e: any) {
      setSubmitError(e?.message || "An error occurred.");
      setSubmitting(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const primaryScore = scoreData.length > 0 ? scoreData[0] : null;

  const ratingLabel = (score: number) => {
    if (score >= 3) return { text: `${score} - EXCELLENT`,     color: "#16a34a", bg: "#f0fdf4" };
    if (score === 2) return { text: `${score} - ACCEPTABLE`,   color: "#2563eb", bg: "#eff6ff" };
    return               { text: `${score} - NOT ACCEPTABLE`, color: "#ef4444", bg: "#fef2f2" };
  };

  const SCORECARD_LABELS = [
    { key: "RelevantQualification",            label: "QUALIFICATIONS" },
    { key: "ReleventExperience",               label: "EXPERIENCE" },
    { key: "Knowledge",                        label: "KNOWLEDGE" },
    { key: "EnergyLevel",                      label: "ENERGY" },
    { key: "MeetJobRequirement",               label: "REQUIREMENTS" },
    { key: "ContributeTowardsCultureRequried", label: "CULTURE" },
    { key: "Experience",                       label: "EXPAT" },
    { key: "OtherCriteriaScore",               label: "OTHER" },
  ];

  const formattedDate = (() => {
    const d = candidateData?.InterviewDate || candidateData?.InterviewDateLevel2 || candidate.interviewDate || "";
    return d ? d.split("T")[0] : "—";
  })();

  const nationLabel = (() => {
    const n = (candidate.nationality || "").toLowerCase();
    if (n.includes("expat"))                                          return "EXPAT";
    if (n.includes("national") || n.includes("congolese") || n.includes("local")) return "LOCAL";
    return (candidate.nationality || "").toUpperCase() || "—";
  })();

  const panelMembers = reviewingCandidateData?.panelMembers?.length > 0
    ? reviewingCandidateData.panelMembers
    : candidateData?.panelMembers?.length > 0
      ? candidateData.panelMembers
      : [];

  const interviewerNames = panelMembers.length > 0
    ? panelMembers
    : scoreData.map((s: any, i: number) => s.InterviewPersonName || `Interviewer ${i + 1}`);

  const MField = ({ label, value }: { label: string; value: string }) => (
    <div className={styles.mfField}>
      <span className={styles.mfLabel}>{label}</span>
      <div className={styles.mfValue}>{value || "—"}</div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.modalOverlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}
        className={styles.modalWindow}
      >
        {/* HEADER */}
        <div className={styles.mHeader}>
          <div className={styles.mHeaderLeft}>
            <div className={styles.mBreadcrumb}>
              <span>CANDIDATE SELECTION</span>
              <ChevronRight size={11} />
              <span className={styles.mBreadcrumbActive}>EVALUATION PREVIEW</span>
            </div>
            <div className={styles.mTitleRow}>
              <div className={styles.mIconBox}><Users size={20} /></div>
              <div>
                <h2 className={styles.mTitle}>Candidate Evaluation Review</h2>
                <p className={styles.mSubtitle}>
                  <span className={styles.mJobCode}>{job?.jobCode || "—"}</span>
                  <span className={styles.mDot}>›</span>
                  <span>{reviewingCandidateData?.jobTitleEn || candidate.positionTitle || "—"}</span>
                </p>
                <p className={styles.mSubtitle}>
                  <span className={styles.mJobCode}>FR:</span>
                  <span className={styles.mDot}>›</span>
                  <span>{reviewingCandidateData?.jobTitleFr || candidate.positionTitle || "—"}</span>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.mHeaderRight}>
            <div className={styles.mGpa}>
              <span className={styles.mGpaLabel}>OVERALL GPA</span>
              <span className={styles.mGpaValue}>{candidate.gpa || "N/A"}</span>
            </div>
            <button onClick={onClose} className={styles.mCloseBtn}><X size={20} /></button>
          </div>
        </div>

        {/* BODY */}
        <div className={styles.mBody}>

          {/* LEFT PANEL */}
          <aside className={styles.mLeft}>
            <div className={styles.mCandidateName}>{candidate.fullName}</div>
            <div className={styles.mCandidateType}>{nationLabel}</div>
            <div className={styles.mFieldList}>
              <MField label="NATIONALITY"    value={candidateData?._raw?.Nationality || candidate.nationality || "—"} />
              <MField label="GENDER"         value={candidateData?._raw?.Gender      || candidate.gender      || "—"} />
              <MField label="QUALIFICATION"  value={candidateData?._raw?.Qualification || "—"} />
              <div className={styles.mTwoCol}>
                <MField label="MINING EXP."  value={candidateData?._raw?.TotalYearOfExperiance || "—"} />
                <MField label="RELATED EXP." value={candidateData?._raw?.ReleventExperience    || "—"} />
              </div>
              <div className={styles.mTwoCol}>
                <MField label="INTERVIEW DATE" value={formattedDate} />
                <MField label="LEVELS"         value={candidate.interviewLevel || "—"} />
              </div>
              <div className={styles.mTwoCol}>
                <MField label="GRADE"     value={candidate.grade || "—"} />
                <MField label="CONFLICTS" value={candidateData?._raw?.ConflictsOfInterest || "—"} />
              </div>
              <MField label="DISABILITY" value={candidateData?._raw?.Disability || "—"} />
            </div>
            {candidateData?.panelMembers && candidateData.panelMembers.length > 0 && (
              <div className={styles.mPanelSection}>
                <div className={styles.mPanelHeader}>
                  <Users size={12} color="#2563eb" /><span>INTERVIEW PANEL</span>
                </div>
                {candidateData.panelMembers.map((name: string, i: number) => (
                  <div key={i} className={styles.mPanelRow}>
                    <span className={styles.mPanelBadge}>{i + 1}</span>
                    <span className={styles.mPanelName}>{name}</span>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* RIGHT PANEL */}
          <main className={styles.mRight}>

            {/* SECTION 1: QUESTIONNAIRES */}
            <div className={styles.mSection}>
              <div className={styles.mSectionHeader}>
                <div className={styles.mSectionBar} style={{ background: "#f97316" }} />
                <div>
                  <div className={styles.mSectionTitle}>INTERVIEW QUESTIONNAIRES</div>
                  <div className={styles.mSectionSub}>Panel Assessment Results</div>
                </div>
              </div>
              {fetchingQuestions ? (
                <div className={styles.mNoData}>Loading questions…</div>
              ) : interviewQuestions && interviewQuestions.length > 0 ? (
                interviewQuestions.map((q: any, idx: number) => {
                  const qScore = primaryScore?.QuestionJson?.[idx]
                    ? Number(Object.values(primaryScore.QuestionJson[idx])[0] || 0) : 0;
                  const rl = ratingLabel(qScore);
                  const answerText = (q.answer || q.response || q.value || q.selectedOption || "")
                    .replace(/<p>|<\/p>|<br\s*\/?\>/gi, "")
                    .trim();

                  return (
                    <div key={idx} className={styles.mQCard}>
                      <div className={styles.mQTop}>
                        <div className={styles.mQBadge}>Q{idx + 1}</div>
                        <div>
                          <p className={styles.mQText} dangerouslySetInnerHTML={{
                            __html: (q.question || "").replace(/<p>|<\/p>|<br\s*\/?\>/gi, "").trim()
                          }} />
                          {answerText ? <p className={styles.mQAnswer}><strong>Answer:</strong> {answerText}</p> : null}
                        </div>
                      </div>
                      <div className={styles.mQBottom}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className={styles.mRatingLabel}>RATING:</span>
                          <span className={styles.mRatingBadge} style={{ color: rl.color, background: rl.bg, border: `1px solid ${rl.color}33` }}>{rl.text}</span>
                        </div>
                        <div className={styles.mScoreDisplay}>
                          <span className={styles.mScoreLabel}>SCORE</span>
                          <span className={styles.mScoreNum}>{qScore}<span className={styles.mScoreMax}>/3</span></span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.mNoData}>No questions found for this job.</div>
              )}
            </div>

            {/* SECTION 2: SCORECARD DETAILS */}
            {!loadingScore && (
              <div className={styles.mSection}>
                <div className={styles.mSectionHeader}>
                  <div className={styles.mSectionBar} style={{ background: "#22c55e" }} />
                  <div>
                    <div className={styles.mSectionTitle}>SCORECARD DETAILS</div>
                    <div className={styles.mSectionSub}>Core Competency Assessment (1–5 Scale)</div>
                  </div>
                </div>
                {primaryScore ? (
                  <div className={styles.mScoreCard}>
                    <div className={styles.mScoreGrid}>
                      {SCORECARD_LABELS.map(({ key, label }) => {
                        const val = Number((primaryScore as any)[key] || 0);
                        return (
                          <div key={key} className={styles.mScoreItem}>
                            <div className={styles.mScoreRow}>
                              <span className={styles.mScoreFieldLabel}>{label}</span>
                              <span className={styles.mScoreFieldVal}>{val}/5</span>
                            </div>
                            <div className={styles.mProgressBar}>
                              <div className={styles.mProgressFill} style={{ width: `${(val / 5) * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.mRecFeedbackRow}>
                      <div className={styles.mRecCol}>
                        <div className={styles.mRecLabel}>PANEL RECOMMENDATION</div>
                        {primaryScore.ConsiderForEmployment === "Yes" ? (
                          <div className={styles.mRecBadgeYes}><CheckCircle2 size={14} /> Consider for Employment</div>
                        ) : (
                          <div className={styles.mRecBadgeNo}><X size={14} /> Do Not Consider</div>
                        )}
                      </div>
                      {primaryScore.OverAllEvaluationFeedback && (
                        <div className={styles.mFeedbackCol}>
                          <div className={styles.mRecLabel}>OVERALL EVALUATION FEEDBACK</div>
                          <div className={styles.mFeedbackText}>"{primaryScore.OverAllEvaluationFeedback}"</div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.mNoData}>No scorecard data available.</div>
                )}
              </div>
            )}

            {/* SECTION 3: QUESTION EVALUATION SCORECARD TABLE */}
            <div className={styles.mSection}>
              <div className={styles.mSectionHeader}>
                <div className={styles.mSectionBar} style={{ background: "#6366f1" }} />
                <div>
                  <div className={styles.mSectionTitle}>QUESTION EVALUATION SCORECARD</div>
                  <div className={styles.mSectionSub}>Panel-wise Question Scores</div>
                </div>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.scoreTable}>
                  <thead>
                    <tr>
                      <th>Criteria</th>
                      {interviewerNames.map((name: string, i: number) => (
                        <th key={i}>
                          {`Interviewer ${i + 1} (${name && name.trim() ? name : "—"})`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const qMap: any = {};
                      scoreData.forEach((score: any, i: number) => {
                        if (score.QuestionJson) {
                          score.QuestionJson.forEach((q: any) => {
                            const key = Object.keys(q)[0];
                            if (!qMap[key]) qMap[key] = { criteria: key };
                            qMap[key][`i${i}`] = q[key];
                          });
                        }
                      });
                      return Object.values(qMap).map((row: any, idx: number) => (
                        <tr key={idx}>
                          <td>{row.criteria}</td>
                          {scoreData.map((_: any, j: number) => (
                            <td key={j}>{row[`i${j}`] ?? "—"}</td>
                          ))}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 4: OVERALL EVALUATION SCORECARD TABLE */}
            <div className={styles.mSection}>
              <div className={styles.mSectionHeader}>
                <div className={styles.mSectionBar} style={{ background: "#22c55e" }} />
                <div>
                  <div className={styles.mSectionTitle}>OVERALL EVALUATION SCORECARD</div>
                  <div className={styles.mSectionSub}>Core Criteria Scores</div>
                </div>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.scoreTable}>
                  <thead>
                    <tr>
                      <th>Criteria</th>
                      {interviewerNames.map((name: string, i: number) => (
                        <th key={i}>
                          {`Interviewer ${i + 1} (${name && name.trim() ? name : "—"})`}
                        </th>
                      ))}
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const criteriaList = [
                        { field: "RelevantQualification",            label: "Qualification (Relevant)" },
                        { field: "ReleventExperience",               label: "Experience (Relevant)" },
                        { field: "Knowledge",                        label: "Knowledge" },
                        { field: "EnergyLevel",                      label: "Energy Level" },
                        { field: "MeetJobRequirement",               label: "Meets All Job Requirements" },
                        { field: "ContributeTowardsCultureRequried", label: "Will Contribute to Culture" },
                        { field: "Experience",                       label: "Experience" },
                        { field: "OtherCriteriaScore",               label: "Other Criteria" },
                      ];
                      const rows = criteriaList.map(({ field, label }, idx) => {
                        const row: any = { criteria: label, total: 0 };
                        scoreData.forEach((s: any, j: number) => {
                          const val = Number(s[field]) || 0;
                          row[`interviewer_${j + 1}`] = val;
                          row.total += val;
                        });
                        return row;
                      });
                      // Total row
                      const totalRow: any = { criteria: "Total", total: 0 };
                      scoreData.forEach((_, i: number) => {
                        const sum = rows.reduce((acc: number, row: any) => {
                          const v = row[`interviewer_${i + 1}`];
                          return typeof v === "number" ? acc + v : acc;
                        }, 0);
                        totalRow[`interviewer_${i + 1}`] = `${sum} / 40`;
                      });
                      totalRow.total = rows.reduce((acc, row) => acc + (row.total || 0), 0);
                      rows.push(totalRow);
                      return rows.map((row, idx) => (
                        <tr key={idx} className={row.criteria === "Total" ? styles.totalRow : idx % 2 === 0 ? styles.stripedRow : ""}>
                          <td><strong>{row.criteria}</strong></td>
                          {scoreData.map((_, j) => (
                            <td key={j}>{row[`interviewer_${j + 1}`] ?? "—"}</td>
                          ))}
                          <td>{row.total}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── SECTION 5: HOD DECISION (edit mode) ── */}
            {canEdit && (
              <div className={styles.mDecisionCard}>
                <div className={styles.mDecisionHeader}>
                  <Zap size={22} color="#f59e0b" fill="#f59e0b" />
                  <div>
                    <div className={styles.mDecisionTitle}>Do you wish to select this candidate?</div>
                    <div className={styles.mDecisionSub}>
                      As HOD, please review the evaluation above and provide your final decision.
                    </div>
                  </div>
                </div>

                {/* Decision buttons */}
                <div className={styles.mDecisionGrid}>
                  <button
                    className={`${styles.mDCard} ${hodDecision === "Yes" ? styles.mDCardYes : ""} ${decisionErr ? styles.mInputErr : ""}`}
                    onClick={() => { setHodDecision("Yes"); setDecisionErr(false); setSubmitError(""); }}
                  >
                    <CheckCircle2 size={28} /><span>YES, SELECT</span>
                  </button>
                  <button
                    className={`${styles.mDCard} ${hodDecision === "No" ? styles.mDCardNo : ""} ${decisionErr ? styles.mInputErr : ""}`}
                    onClick={() => { setHodDecision("No"); setDecisionErr(false); setSubmitError(""); }}
                  >
                    <X size={28} /><span>NO, REJECT</span>
                  </button>
                  <button
                    className={`${styles.mDCard} ${hodDecision === "On Hold" ? styles.mDCardHold : ""} ${decisionErr ? styles.mInputErr : ""}`}
                    onClick={() => { setHodDecision("On Hold"); setDecisionErr(false); setSubmitError(""); }}
                  >
                    <Activity size={28} /><span>ON HOLD</span>
                  </button>
                </div>
                {decisionErr && (
                  <div style={{ color: "#ef4444", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                    ⚠ Please select a decision above.
                  </div>
                )}

                {successMessage && (
                  <div style={{
                    background: "#dcfce7",
                    border: "1px solid #22c55e",
                    color: "#166534",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "0.45rem",
                    marginBottom: "0.75rem",
                    fontWeight: 600,
                  }}>
                    {successMessage}
                  </div>
                )}

                {/* VIEW COMMENTS button */}
                <div className={styles.mFormGroup} style={{ marginTop: 16 }}>
                  <button onClick={handleViewComments} className={styles.mActionBtn}>
                    <FileText size={16} /> VIEW COMMENTS
                  </button>
                </div>

                {/* Position ID — only for applicable statuses */}
                {shouldShowPositionId(candidate.statusId, hodDecision) && (
                  <div className={styles.mFormGroup}>
                    <label className={`${styles.mFormLabel} ${posErr ? styles.mErrLabel : ""}`}>
                      Assign Position ID <span style={{ color: "#ef4444" }}>*</span>
                      {posErr && <span className={styles.mErrText}> — Required</span>}
                    </label>
                    <select
                      className={`${styles.mSelect} ${posErr ? styles.mInputErr : ""}`}
                      value={selectedPositionId ?? ""}
                      onChange={e => {
                        const val = Number(e.target.value) || null;
                        setSelectedPositionId(val);
                        const opt = positionOptions.find(o => o.key === val);
                        setSelectedPositionText(opt?.text || "");
                        setPosErr(false);
                      }}
                    >
                      <option value="">Select a position…</option>
                      {positionOptions.map(opt => (
                        <option key={opt.key} value={opt.key}>{opt.text || `#${opt.key}`}</option>
                      ))}
                    </select>
                    {positionOptions.length === 0 && (
                      <p className={styles.mNoData} style={{ marginTop: 6 }}>No positions available.</p>
                    )}
                  </div>
                )}

                {/* Feedback / Comment */}
                <div className={styles.mFormGroup}>
                  <label className={`${styles.mFormLabel} ${commentErr ? styles.mErrLabel : ""}`}>
                    {feedbackLabel} <span style={{ color: "#ef4444" }}>*</span>
                    {commentErr && <span className={styles.mErrText}> — Required</span>}
                  </label>
                  <textarea
                    className={`${styles.mTextarea} ${commentErr ? styles.mInputErr : ""}`}
                    placeholder="Provide your final decision rationale..."
                    value={decisionComment}
                    onChange={e => {
                      setDecisionComment(e.target.value);
                      if (e.target.value.trim()) setCommentErr(false);
                    }}
                  />
                </div>

                {/* Confirmation Checkbox (mirrors old SignatureCheckbox) */}
                <div className={styles.mFormGroup}>
                  <label className={styles.mCheckboxRow}>
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={e => {
                        setConfirmed(e.target.checked);
                        if (e.target.checked) setCheckboxErr(false);
                      }}
                    />
                    <span>
                      I confirm that the above decision is accurate and in line with the evaluation
                      of the candidate's scorecard details.
                    </span>
                  </label>
                  {checkboxErr && (
                    <span className={styles.mCheckboxErrText}>
                      ⚠ You must confirm before submitting.
                    </span>
                  )}
                </div>

                {/* Reviewer Card */}
                <div className={styles.mFormGroup} style={{ marginTop: 20 }}>
                  <div className={styles.reviewerCard}>
                    <div className={styles.reviewerAvatar}>{userInitial}</div>
                    <div className={styles.reviewerInfo}>
                      <div className={styles.reviewerCol}>
                        <p className={styles.reviewerMeta}>REVIEWER NAME</p>
                        <p className={styles.reviewerVal}>{reviewingCandidateData?.reviewerName || "—"}</p>
                      </div>
                      <div className={styles.reviewerCol}>
                        <p className={styles.reviewerMeta}>JOB TITLE (EN)</p>
                        <p className={styles.reviewerVal}>{reviewingCandidateData?.jobTitleEn || "—"}</p>
                        <p className={styles.reviewerMeta} style={{ marginTop: 12 }}>JOB TITLE (FR)</p>
                        <p className={styles.reviewerVal}>{reviewingCandidateData?.jobTitleFr || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {submitError && <div className={styles.mSubmitError}>{submitError}</div>}

                <div className={styles.mFooter}>
                  <button onClick={onClose} className={styles.mCancelBtn} disabled={submitting}>CANCEL</button>
                  <button
                    className={styles.mSubmitBtn}
                    onClick={handleDecisionSubmit}
                    disabled={submitting || !hodDecision}
                  >
                    {submitting
                      ? "Submitting…"
                      : <><CheckCircle2 size={15} style={{ marginRight: 6 }} /> SUBMIT ACTION</>
                    }
                  </button>
                </div>
              </div>
            )}

            {/* ── VIEW MODE: Show submitted values (canEdit=false) ── */}
            {!canEdit && (
              <div className={styles.mDecisionCard} style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
                <div className={styles.mDecisionHeader}>
                  <Eye size={22} color="#2563eb" />
                  <div>
                    <div className={styles.mDecisionTitle}>HOD Decision (Submitted)</div>
                    <div className={styles.mDecisionSub}>This candidate has already been reviewed.</div>
                  </div>
                </div>

                {/* VIEW COMMENTS button (available in view mode too) */}
                <div className={styles.mFormGroup}>
                  <button onClick={handleViewComments} className={styles.mActionBtn}>
                    <FileText size={16} /> VIEW COMMENTS
                  </button>
                </div>

                {/* Show decision */}
                {hodDecision && (
                  <div className={styles.mFormGroup}>
                    <label className={styles.mFormLabel}>Decision</label>
                    <div style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      background: hodDecision === "Yes" ? "#f0fdf4" : hodDecision === "No" ? "#fef2f2" : "#fffbeb",
                      color: hodDecision === "Yes" ? "#16a34a" : hodDecision === "No" ? "#dc2626" : "#d97706",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      display: "inline-block",
                    }}>
                      {hodDecision === "Yes" ? "✓ SELECTED" : hodDecision === "No" ? "✗ REJECTED" : "⏸ ON HOLD"}
                    </div>
                  </div>
                )}

                {/* Show position ID if applicable */}
                {selectedPositionText && (
                  <div className={styles.mFormGroup}>
                    <label className={styles.mFormLabel}>Assigned Position ID</label>
                    <div className={styles.mfValue}>{selectedPositionText}</div>
                  </div>
                )}

                {/* Show feedback */}
                {decisionComment && (
                  <div className={styles.mFormGroup}>
                    <label className={styles.mFormLabel}>{feedbackLabel}</label>
                    <div style={{
                      background: "#fff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      color: "#334155",
                    }}>
                      {decisionComment}
                    </div>
                  </div>
                )}

                <div className={styles.mFooter}>
                  <button onClick={onClose} className={styles.mCancelBtn}>CLOSE</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </motion.div>

      {/* COMMENTS MODAL */}
      <AnimatePresence>
        {showComments && (
          <div className={styles.mCommentsModalOverlay} onClick={() => setShowComments(false)}>
            <motion.div
              className={styles.mCommentsModalWindow}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.mCommentsHeader}>
                <h3><FileText size={20} color="#2563eb" /> View Justification</h3>
                <button onClick={() => setShowComments(false)}><X size={20} /></button>
              </div>
              <div className={styles.mCommentsBody}>
                {loadingComments ? (
                  <div className={styles.mCommentsLoading}>Loading comments...</div>
                ) : level1Comments.length === 0 && level2Comments.length === 0 ? (
                  <div className={styles.mCommentsNoData}>No Comments Found</div>
                ) : (
                  <>
                    {level1Comments.map((c, i) => (
                      <div key={`l1-${i}`} className={styles.mCommentItemL1}>
                        <div className={styles.mCommentRole}>Submitted by {c.RoleName || "Unknown"} (Level 1)</div>
                        {c.comments && <div className={styles.mCommentText}><strong>Feedback Level 1:</strong><br />{c.comments}</div>}
                        {c.OverAllEvaluationFeedback && <div className={styles.mCommentText}><strong>Overall Feedback Level 1:</strong><br />{c.OverAllEvaluationFeedback}</div>}
                        {c.Date && <div className={styles.mCommentDate}>Date: {moment(c.Date).format("M/D/YYYY, h:mm:ss A")}</div>}
                        {c.Name && <div className={styles.mCommentAuthor}>{c.Name}</div>}
                      </div>
                    ))}
                    {level2Comments.map((c, i) => (
                      <div key={`l2-${i}`} className={styles.mCommentItemL2}>
                        <div className={styles.mCommentRole}>Submitted by {c.RoleName || "Unknown"} (Level 2)</div>
                        {c.comments && <div className={styles.mCommentText}><strong>Feedback Level 2:</strong><br />{c.comments}</div>}
                        {c.Date && <div className={styles.mCommentDate}>Date: {moment(c.Date).format("M/D/YYYY, h:mm:ss A")}</div>}
                        {c.Name && <div className={styles.mCommentAuthor}>{c.Name}</div>}
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className={styles.mCommentsFooter}>
                <button onClick={() => setShowComments(false)} className={styles.closeBtn}>CLOSE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewScorecardTab;