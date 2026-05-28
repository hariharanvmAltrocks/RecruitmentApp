import * as React from "react";
import { motion } from "framer-motion";
import {
  X,
  Users,
  ChevronRight,
  FileText,
  CheckCircle2,
  Loader2,
  User,
  Globe,
  Zap,
  AlertTriangle,
  Accessibility,
} from "lucide-react";
import styles from "../../ReviewScoreCard/ReviewScorecard.module.scss";
import QuestionnaireTab from "../../ReviewScoreCard/Components/QuestionnaireTab";
import ScoreTable from "../../ReviewScoreCard/Components/ScoreTable";
import CommentsModal from "../../ReviewScoreCard/Components/Commentsmodal";
import { useNavigate } from "react-router-dom";
import { fetchCandidateValue } from "./Hooks/fetchCandidateValue";
import { ReviewCommentSignature } from "../../RecruitmentTable/Components/ReviewCommentSignature";
import { useSignatureDetails } from "../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails";
import { useSubmitEvaluationL2 } from "./Hooks/Usesubmitevaluationl2";
import { ModalPopup } from "../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import { RecuritmentHRMsg } from "../../../../utilities/ConditionConfig";
import { InfoItem } from "../../CandidateTable/Components/reuseUI";
import Loading from "../../../Comman/Loading/loading";
import * as strings from 'RecrutimentAppWebPartStrings';
import { Text } from '@microsoft/sp-core-library';

const SCORE_CRITERIA = [
  { field: "RelevantQualification", label: strings.QualificationRelevant },
  { field: "ReleventExperience", label: strings.ExperienceRelevant1 },
  { field: "Knowledge", label: "Knowledge" },
  { field: "EnergyLevel", label: strings.EnergyLevel1 },
  { field: "MeetJobRequirement", label: strings.MeetsAllJobRequirements },
  {
    field: "ContributeTowardsCultureRequried",
    label: strings.WillContributeToCultureRequired,
  },
  { field: "Experience", label: "Experience" },
  { field: "OtherCriteriaScore", label: strings.OtherCriteriaRecognizedByPanel },
];

const MAX_OVERALL_PER_PANEL = 40;

const MField = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.mfField}>
    <span className={styles.mfLabel}>{label}</span>
    <div className={styles.mfValue}>{value || "—"}</div>
  </div>
);

const PageLoader = () => <Loading text={strings.LoadingData} />;

type ScorecardTabKey = "questions" | "qEval" | "overall";

const EvalutionL2: React.FC<any> = (props) => {
  const ID: number = props.ID;
  const RecrutimentID: number = props.RecruitmentID;

  const hook = fetchCandidateValue(ID, RecrutimentID);
  const navigate = useNavigate();
  const { modalState, showModal, closeModal } = useModalPopup();

  // ── tab state ────────────────────────────────────────────────────────────────
  const [activePanelTab, setActivePanelTab] = React.useState(0);
  const [activeScorecardTab, setActiveScorecardTab] =
    React.useState<ScorecardTabKey>("questions");

  // ── signature ────────────────────────────────────────────────────────────────
  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();

  // ── navigation callback ──────────────────────────────────────────────────────
  const onClose = React.useCallback(() => navigate("/MyTracker"), [navigate]);

  const successModel = () => {
    showModal({
      type: "success",
      title: "Success",
      message: RecuritmentHRMsg.ScoreCardMsgLevel2,
      confirmLabel: strings.GoToDashboard,
      onConfirm: () => {
        closeModal();
        navigate("/Dashboard");
      },
    });
  };

  const submitHook = useSubmitEvaluationL2({
    candidateId: ID,
    panelId: hook.reviewData?.currentUserPanelId ?? 0,
    onSuccess: successModel,
  });

  const panelMembers: string[] = React.useMemo(() => {
    const fromReview = hook.reviewData?.panelMembers || [];
    if (fromReview.length > 0) return fromReview;
    return (hook.scoreData || []).map(
      (s: any, i: number) => s.InterviewPersonName || `Interviewer ${i + 1}`,
    );
  }, [hook.reviewData, hook.scoreData]);

  const activeScore: any = (hook.scoreData || [])[activePanelTab] || null;

  const activeQJson: any[] = React.useMemo(() => {
    if (!activeScore?.QuestionJson) return [];
    if (Array.isArray(activeScore.QuestionJson))
      return activeScore.QuestionJson;
    try {
      return JSON.parse(activeScore.QuestionJson);
    } catch {
      return [];
    }
  }, [activeScore]);

  const questionTableRows = React.useMemo(() => {
    const qMap: Record<string, any> = {};
    (hook.scoreData || []).forEach((s: any, i: number) => {
      const qJson: any[] = Array.isArray(s.QuestionJson)
        ? s.QuestionJson
        : (() => {
            try {
              return JSON.parse(s.QuestionJson || "[]");
            } catch {
              return [];
            }
          })();
      qJson.forEach((q: any) => {
        const key = Object.keys(q)[0];
        if (!qMap[key]) qMap[key] = { criteria: key };
        qMap[key][Text.format(strings.Panel, )] = q[key];
      });
    });
    return Object.values(qMap);
  }, [hook.scoreData]);

  const overallTableRows = React.useMemo(() => {
    const rows = SCORE_CRITERIA.map(({ field, label }) => {
      const row: any = { criteria: label, total: 0 };
      (hook.scoreData || []).forEach((s: any, i: number) => {
        const val = Number(s[field]) || 0;
        row[`panel_${i}`] = val;
        row.total += val;
      });
      return row;
    });
    const totalRow: any = { criteria: "Total", total: 0 };
    (hook.scoreData || []).forEach((_: any, i: number) => {
      const sum = rows.reduce((acc, r) => {
        const v = r[`panel_${i}`];
        return typeof v === "number" ? acc + v : acc;
      }, 0);
      totalRow[`panel_${i}`] = `${sum} / ${MAX_OVERALL_PER_PANEL}`;
    });
    totalRow.total = rows.reduce(
      (acc, r) => acc + (typeof r.total === "number" ? r.total : 0),
      0,
    );
    rows.push(totalRow);
    return rows;
  }, [hook.scoreData]);

  const raw = hook.reviewData?.candidateData || {};
  const formattedDate =
    (
      raw.InterviewDate ||
      raw.InterviewDateLevel2 ||
      hook.reviewingCandidate?.interviewDate ||
      ""
    ).split("T")[0] || "";

  const nationLabel = (() => {
    const n = (hook.reviewingCandidate?.nationality || "").toLowerCase();
    if (n.includes("expat")) return "EXPAT";
    if (
      n.includes("national") ||
      n.includes("congolese") ||
      n.includes("local")
    )
      return "LOCAL";
    return (hook.reviewingCandidate?.nationality || "").toUpperCase() || "";
  })();

  const safeLevel1 = Array.isArray(hook.level1Comments)
    ? hook.level1Comments
    : [];
  const safeLevel2 = Array.isArray(hook.level2Comments)
    ? hook.level2Comments
    : [];

  if (hook.candidatesLoading || hook.scoreLoading || hook.reviewLoading) {
    return <PageLoader />;
  }

  const loading =
    !hook.candidates ||
    hook.reviewLoading || // covers reviewData?.questions + candidateData
    hook.scoreLoading || // covers scoreData
    !hook.scoreData;

  return (
    <div className={styles.modalOverlay}>
      {submitHook.submitting && <Loading />}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={styles.modalWindow}
      >
        {/* ══ HEADER ══ */}
        {loading && <Loading text={strings.LoadingDetails} />}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <User size={24} />
            </div>
            <div className={styles.headerMeta}>
              <div className={styles.breadcrumb}>
                <span>{strings.CandidateSelection}</span>
                <ChevronRight size={12} className={styles.breadcrumbChevron} />
                <span className={styles.breadcrumbActive}>
                  {strings.ReviewScorecard}</span>
              </div>
              <h2 className={styles.headerTitle}>{strings.CandidateScorecardReview}</h2>
              <div className={styles.headerSubtitle}>
                <span className={styles.jobCodeBadge}>
                  {hook.reviewingCandidate?.jobCode || "---"}
                </span>
                <span className={styles.headerDot} />
                <span className={styles.headerJobTitle}>
                  {hook.reviewingCandidate?.positionTitle || "---"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.mHeaderRight}>
              <div className={styles.mGpa}>
                <span className={styles.mGpaLabel}>{strings.OverallGpa}</span>
                <span className={styles.mGpaValue}>
                  {hook.reviewingCandidate?.gpa || "—"}
                </span>
              </div>
              <button
                className={styles.closeBtn}
                type="button"
                onClick={onClose}
                aria-label={strings.Close}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </header>

        {/* ══ BODY ══ */}
        <div className={styles.mBody}>
          {/* ── LEFT SIDEBAR ── */}
          <aside className={styles.sidebar}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {(hook.reviewingCandidate?.fullName ?? "A").charAt(0)}
              </div>
              <h3 className={styles.avatarName}>
                {hook.reviewingCandidate?.fullName ?? "--"}
              </h3>
              <span className={styles.avatarNationality}>
                {nationLabel ?? "--"}
              </span>
            </div>

            <div className={styles.infoGrid}>
              <InfoItem
                icon={<Globe size={14} />}
                label={strings.Nationality}
                value={
                  raw.Nationality || hook.reviewingCandidate?.nationality || ""
                }
              />
              <InfoItem
                icon={<Users size={14} />}
                label={strings.Gender}
                value={raw.Gender || hook.reviewingCandidate?.gender || ""}
              />
              <InfoItem
                icon={<FileText size={14} />}
                label={strings.Qualification}
                value={raw.Qualification || ""}
              />

              <div className={styles.infoRow}>
                <div className={styles.infoRowItem}>
                  <InfoItem
                    icon={<Zap size={14} />}
                    label={strings.MiningExp}
                    value={raw.TotalYearOfExperiance || ""}
                  />
                </div>
                <div className={styles.infoRowItem}>
                  <InfoItem
                    icon={<Zap size={14} />}
                    label={strings.RelatedExp}
                    value={raw.ReleventExperience || ""}
                  />
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoRowItem}>
                  <InfoItem
                    icon={<AlertTriangle size={14} />}
                    label={strings.Conflicts}
                    value={raw.ConflictsOfInterest || ""}
                  />
                </div>
                <div className={styles.infoRowItem}>
                  <InfoItem
                    icon={<Accessibility size={14} />}
                    label={strings.Disability}
                    value={raw.Disability || raw.disability || ""}
                  />
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoRowItem}>
                  <InfoItem
                    label={strings.Levels}
                    value={hook.reviewingCandidate?.interviewLevel || ""}
                  />
                </div>
                <div className={styles.infoRowItem}>
                  <InfoItem label={strings.InterviewDate} value={formattedDate} />
                </div>
              </div>

              <InfoItem
                label={strings.Grade}
                value={hook.reviewingCandidate?.grade || ""}
              />
            </div>

            {panelMembers.length > 0 && (
              <div className={styles.mPanelSection}>
                <div className={styles.mPanelHeader}>
                  <Users size={12} color="#2563eb" />
                  <span>{strings.InterviewPanel}</span>
                </div>
                <div className={styles.mPanelList}>
                  {panelMembers.map((name, i) => (
                    <div key={i} className={styles.mPanelRow}>
                      <span className={styles.mPanelBadge}>{i + 1}</span>
                      <span className={styles.mPanelName}>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ── RIGHT MAIN ── */}
          <main className={styles.mRight}>
            {/* Panel tab switcher */}
            {(hook.scoreData || []).length > 0 && (
              <div className={styles.panelTabBar}>
                {(hook.scoreData || []).map((s: any, i: number) => (
                  <button
                    key={i}
                    className={`${styles.panelTab} ${activePanelTab === i ? styles.panelTabActive : ""}`}
                    onClick={() => setActivePanelTab(i)}
                    type="button"
                  >
                    <span className={styles.panelTabNum}>{i + 1}</span>
                    <span className={styles.panelTabName}>
                      {panelMembers[i] ||
                        s.InterviewPersonName ||
                        `Interviewer ${i + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Scorecard tab content */}
            {activeScorecardTab === "questions" && (
              <QuestionnaireTab
                questions={hook.reviewData?.questions || []}
                activeScore={activeScore}
                activeQJson={activeQJson}
                panelMemberName={panelMembers[activePanelTab] || ""}
                fetchingQuestions={hook.reviewLoading}
              />
            )}
            {activeScorecardTab === "qEval" && (
              <ScoreTable
                title={strings.QuestionEvaluationScorecard}
                subtitle={strings.PanelWiseQuestionScoresAllInterviewers}
                accentColor="#6366f1"
                rows={questionTableRows}
                panelMembers={panelMembers}
                showTotal={false}
                emptyText="No question data available."
              />
            )}
            {activeScorecardTab === "overall" && (
              <ScoreTable
                title={strings.OverallEvaluationScorecard}
                subtitle={strings.CoreCriteriaScoresAllInterviewersMax5Per}
                accentColor="#22c55e"
                rows={overallTableRows}
                panelMembers={panelMembers}
                showTotal={true}
                emptyText="No scorecard data available."
              />
            )}

            {/* View Comments button */}
            <div className={styles.mFormGroup}>
              <button
                onClick={hook.openComments}
                className={styles.mSubmitBtn}
                type="button"
                // disabled={submitHook.submitting}
              >
                <FileText size={16} />
                {strings.ViewComments}</button>
            </div>

            <ReviewCommentSignature
              reviewerComments={submitHook.comments}
              acknowledgementCheckbox={submitHook.acknowledgementCheckbox}
              signatureDetails={signatureDetails}
              isLoading={signatureLoading}
              onCommentsChange={submitHook.onCommentsChange}
              onToggleAcknowledgement={submitHook.onToggleAcknowledgement}
              commentError={submitHook.commentError}
              checkboxError={submitHook.checkboxError}
              disabled={submitHook.isSubmittingRef.current}
            />

            {/* ── Action buttons row ── */}
            <div
              className={styles.mActionBtn}
              style={{ background: "white", justifyContent: "flex-end" }}
            >
              <button
                className={styles.mCancelBtn}
                onClick={onClose}
                disabled={submitHook.submitting}
                type="button"
              >
                {strings.Cancel1}</button>

              <button
                className={styles.mSubmitBtn}
                onClick={submitHook.handleSubmitClick}
                disabled={submitHook.submitting}
                type="button"
              >
                {submitHook.submitting ? (
                  <>
                    <Loader2
                      size={15}
                      style={{
                        marginRight: 6,
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    {strings.Submitting}</>
                ) : (
                  <>
                    <CheckCircle2 size={15} style={{ marginRight: 6 }} />
                    {strings.SubmitAction1}</>
                )}
              </button>
            </div>
          </main>
        </div>
      </motion.div>

      {/* Spinner keyframe */}
      <style>{strings.KeyframesSpinFromTransformRotate0degToTr}</style>

      <CommentsModal
        open={hook?.showComments}
        loading={hook.commentsLoading}
        level1={safeLevel1}
        level2={safeLevel2}
        onClose={hook.closeReview}
      />
      <ModalPopup {...modalState} onClose={closeModal} />
    </div>
  );
};

export default EvalutionL2;
