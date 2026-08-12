import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Users,
  Calendar,
  AlertTriangle,
  Accessibility,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  ChevronDown,
  FileText,
  Trash2,
  Zap,
  Globe,
  User,
  Activity,
  Check,
  ChevronRight,
} from "lucide-react";
import { useFetchCandidateDetails } from "../Hooks/fetchCandidateDetails";
import { RequiredAttachments } from "../../RecruitmentTable/Components/RequiredAttachments";
import {
  ConflictOfInterestForm,
  DecisionType,
  InterviewScheduleForm,
  panelmembers,
  useSubmitCandidateReview,
} from "../Hooks/Usesubmitcandidatereview";
import { useFetchPanelMembers } from "../Hooks/fetchPanelMembers";
import { StatusId, workflowStatusApi } from "../../../../utilities/Config";
import {
  DocumentFolderName,
  RoleName,
} from "../../../../utilities/ConditionConfig";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { DataSyncToRecruitmentResponse } from "../../../../services/RecruitmentTable/IRecruitmentService";
import styles from "./ShowCandidateDetailsPopup.module.scss";
import { ModalPopup } from "../../../Comman/ModalPopup/ModalPopup";
import {
  backdropVariants,
  cardVariants,
  getViewerUrl,
  InfoItem,
  QuestionCard,
  SectionHeader,
  sectionVariants,
} from "./reuseUI";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import { CandidateTable } from "../../../../services/ServiceExport";
import Loading from "../../../Comman/Loading/loading";
import {
  InterviewScheduleInput,
  ScheduleForm,
} from "./InterviewSchedule/InterviewScheduleInput";
import * as strings from 'RecrutimentAppWebPartStrings';
import CustomComments from "../../RecruitmentTable/Components/CommentsModel/CommentsModal";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface panelvalues {
  bucodeId: number;
  candidateId: number;
  assignHR: string;
  RecruitmentID: number;
  statusId: string;
  actionID: number;
}

interface ShowCandidateDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  panelParams: panelvalues | null;
  positionDetails: DataSyncToRecruitmentResponse | null;
  handleRefresh: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FEEDBACK_OPTIONS = [
  "Excellent",
  "Good",
  "Average",
  strings.BelowAverage,
  "Poor",
] as const;

const EMPTY_COI: ConflictOfInterestForm = {
  consultedWith: "",
  attachment: [],
  comments: "",
};

const EMPTY_SCHEDULE: ScheduleForm = {
  panelMembers: [],
  startDate: "",
  startTime: "",
  endTime: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// FilePreviewModal  (isolated, self-contained)
// ─────────────────────────────────────────────────────────────────────────────

interface PreviewFile {
  url: string;
  name: string;
}

interface FilePreviewModalProps {
  file: PreviewFile | null;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
}) => {
  const resolved = useMemo(
    () => (file ? getViewerUrl(file.url) : null),
    [file],
  );

  return (
    <AnimatePresence>
      {file && resolved && (
        <motion.div
          className={styles.previewBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.previewModal}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.previewHeader}>
              <div className={styles.previewHeaderLeft}>
                <FileText size={18} />
                <span className={styles.previewFileName}>{file.name}</span>
              </div>
              <button
                type="button"
                className={styles.previewClose}
                onClick={onClose}
                aria-label={strings.ClosePreview}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className={styles.previewBody}>
              {resolved.type === "blob" || resolved.type === "direct" ? (
                // Native PDF / image rendering via <object> gives better UX than iframe
                <object
                  data={resolved.url}
                  type="application/pdf"
                  className={styles.previewIframe}
                  aria-label={file.name}
                >
                  {/* Fallback for non-PDF blobs */}
                  <iframe
                    src={resolved.url}
                    title={file.name}
                    className={styles.previewIframe}
                  />
                </object>
              ) : (
                <iframe
                  src={resolved.url}
                  title={file.name}
                  className={styles.previewIframe}
                  allow="fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export const ShowCandidateDetailsPopup: React.FC<
  ShowCandidateDetailsPopupProps
> = ({
  isOpen,
  onClose,
  candidateId,
  panelParams,
  positionDetails,
  handleRefresh,
}) => {
  // ── Derived flags ──────────────────────────────────────────────────────────

  const statusId = panelParams?.statusId ?? "";

  const ReviewHRFlag = statusId === workflowStatusApi.HRPending;

  const ReviewLML1 =
    statusId === workflowStatusApi.LineManagerL1Pending ||
    statusId === workflowStatusApi.LineManagerLevel1OnHold;

  const ReviewLML2 =
    statusId === workflowStatusApi.LineManagerL2Pending ||
    statusId === workflowStatusApi.LineManagerLevel2OnHold;

  const PanelMember =
    statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
    Number(statusId) ===
      StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;

  const isLevel2Panel =
    Number(statusId) ===
    StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;

  const panelOptionFlag =
    statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
    isLevel2Panel ||
    statusId === workflowStatusApi.HRPending;

  const isEnabled = !!panelOptionFlag;
  const isReadOnly = !ReviewHRFlag;

  const rejectedFlag =
    statusId === workflowStatusApi.HRRejected ||
    statusId === workflowStatusApi.LineManagerLevel1Rejected ||
    statusId === workflowStatusApi.LineManagerLevel2Rejected;

  // ── Data hooks ─────────────────────────────────────────────────────────────

  const { data: paneloptions, loading: panelLoading } = useFetchPanelMembers(
    positionDetails?.BusinessUnitCodeId ?? 0,
    positionDetails?.AssignEMail ?? "",
    panelParams?.candidateId ?? 0,
    statusId,
    isEnabled,
  );

  const { data, loading: recordLoading } = useFetchCandidateDetails(
    candidateId,
    statusId,
  );

  const {
    submitting,
    submit,
    pageLoading,
    modalState: submitModalState,
    closeModal: submitCloseModal,
  } = useSubmitCandidateReview(onClose, handleRefresh);

  const { modalState, showModal, closeModal } = useModalPopup();

  // ── Local state ────────────────────────────────────────────────────────────

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [decision, setDecision] = useState<DecisionType | null>(null);
  const [decisionComments, setDecisionComments] = useState("");
  const [consultoptions, setConsultOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const [HRReview, setHRReview] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coi, setCoi] = useState<ConflictOfInterestForm>(EMPTY_COI);
  const [level1, setLevel1] = useState<ScheduleForm>(EMPTY_SCHEDULE);
  const [level2, setLevel2] = useState<ScheduleForm>(EMPTY_SCHEDULE);
  const [commentsflag, setCommentsflag] = useState(false);
  const [imageError, setImageError] = useState(false);

  const profileImgUrl = useMemo(() => {
    if (!data?.ProfileImage) return undefined;
    return (
      data.ProfileImage.downloadUrl ||
      (typeof data.ProfileImage.content === "string" && data.ProfileImage.content
        ? data.ProfileImage.content
        : undefined)
    );
  }, [data?.ProfileImage]);

  useEffect(() => {
    setImageError(false);
  }, [data?.ProfileImage]);

  const loading = recordLoading || panelLoading;

  // ── Memoised panel values ──────────────────────────────────────────────────

  const panelValue = useMemo(() => {
    if (!paneloptions) return null;
    const { Level1 = [], Level2 = [] } = paneloptions;

    const level1Members: string[] = [];
    const consultOption: { value: string; label: string }[] = [];

    Level1.forEach((item) => {
      if (item.Role !== RoleName.InterviewPanel)
        level1Members.push(String(item.value));

      if (
        item.Role === RoleName.LineManager ||
        item.Role === RoleName.HOD ||
        item.Role === RoleName.RecruitmentHR
      )
        consultOption.push({ value: String(item.label), label: item.label });
    });

    const level2Members = Level2.filter(
      (item) => item.Role !== RoleName.InterviewPanel,
    ).map((item) => String(item.value));

    return { level1Members, level2Members, consultOption };
  }, [paneloptions]);

  const level1PanelOptions = useMemo(() => {
    return (paneloptions?.Level1 ?? []).map((item) => ({
      value: String(item.value),
      label: item.label,
    }));
  }, [paneloptions?.Level1]);

  const level2PanelOptions = useMemo(() => {
    return (paneloptions?.Level2 ?? []).map((item) => ({
      value: String(item.value),
      label: item.label,
    }));
  }, [paneloptions?.Level2]);

  // ── Effects ────────────────────────────────────────────────────────────────

  // Reset all state when popup closes
  useEffect(() => {
    if (!isOpen) {
      setDecision(null);
      setDecisionComments("");
      setHRReview("");
      setCoi(EMPTY_COI);
      setLevel1(EMPTY_SCHEDULE);
      setLevel2(EMPTY_SCHEDULE);
      setPreviewFile(null);
      setDropdownOpen(false);
    }
  }, [isOpen]);

  // Load panel members + COI data when popup opens
  useEffect(() => {
    if (!isOpen) return;

    if (panelValue && (PanelMember || ReviewHRFlag)) {
      setConsultOptions(panelValue.consultOption);
      const start = data?.InterviewStartDate
        ? new Date(data.InterviewStartDate)
        : null;
      setLevel1({
        panelMembers: panelValue.level1Members,
        startDate: start ? start.toISOString().split("T")[0] : "",
        startTime: data?.InterviewStartTime ?? "",
        endTime: data?.InterviewEndTime ?? "",
      });
      setLevel2({
        panelMembers: panelValue.level2Members,
        startDate: "",
        startTime: "",
        endTime: "",
      });
    }

    if (!data) return;

    const loadCOI = async () => {
      const COIAttachRes = await CandidateTable.fetchCOIAttachment({
        RequestID: String(data.profileID),
        DocumentName: DocumentFolderName.COIAttach,
      });

      if (statusId !== workflowStatusApi.HRPending) {
        setCoi({
          consultedWith: data.COIAppreve ?? "",
          attachment: COIAttachRes.data,
          comments: data.COIComments ?? "",
        });

         setConsultOptions([
        { value: String(data.COIAppreve), label: data.COIAppreve },
      ]);
      }

      setHRReview(data.hrComments ?? "");
    };

    void loadCOI();
  }, [isOpen, panelValue, data]);

  // ── Derived visibility ─────────────────────────────────────────────────────

  const showCOI = data?.ConflictsOfInterest === "Yes";
  const showDisability = data?.disability === "Yes";

  // ── Validation ─────────────────────────────────────────────────────────────

  const canSubmit = useMemo(() => {
    if (!decisionComments?.trim()) return false;

    if (ReviewHRFlag) {
      if (!HRReview?.trim()) return false;
      if (showCOI) {
        if (
          !coi.consultedWith?.trim() ||
          !coi.comments?.trim() ||
          coi.attachment.length === 0
        )
          return false;
      }
    }

    if ((ReviewLML1 || ReviewLML2) && !decision) return false;

    if (PanelMember) {
      if (
        statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview &&
        (level1.panelMembers.length < 3 ||
          !level1.startDate ||
          !level1.startTime ||
          !level1.endTime)
      )
        return false;

      if (
        isLevel2Panel &&
        (level2.panelMembers.length < 3 ||
          !level2.startDate ||
          !level2.startTime ||
          !level2.endTime)
      )
        return false;
    }

    return true;
  }, [
    ReviewHRFlag,
    ReviewLML1,
    ReviewLML2,
    PanelMember,
    isLevel2Panel,
    decision,
    decisionComments,
    HRReview,
    showCOI,
    coi,
    level1,
    level2,
    statusId,
  ]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handlePreview = useCallback((file: IDocFiles) => {
    setPreviewFile({ url: file.content as string, name: file.name });
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const newFile: IDocFiles = {
          name: file.name,
          content: reader.result!,
          type: "New",
        };
        setCoi((prev) => ({ ...prev, attachment: [newFile] }));
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleClearFile = useCallback(() => {
    setCoi((prev) => ({ ...prev, attachment: [] }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleToggleLevel1Member = useCallback((val: string) => {
    setLevel1((p) => ({
      ...p,
      panelMembers: p.panelMembers.includes(val)
        ? p.panelMembers.filter((v) => v !== val)
        : [...p.panelMembers, val],
    }));
  }, []);

  const handleToggleLevel2Member = useCallback((val: string) => {
    setLevel2((p) => ({
      ...p,
      panelMembers: p.panelMembers.includes(val)
        ? p.panelMembers.filter((v) => v !== val)
        : [...p.panelMembers, val],
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      showModal({
        type: "warning",
        title: strings.RequiredFieldsMissing,
        message:
          strings.OneOrMoreFieldsAreRequiredPleaseComplete,
        confirmLabel: "OK",
        onConfirm: closeModal,
      });
      return;
    }

const emailMap = new Map(
  paneloptions?.Level1.map((item) => [item.value, item.Email])
);

const toPanel = (members: string[]): panelmembers[] =>
  members
    .map((id) => {
      const key = Number(id);
      const email = emailMap.get(key);

      return email
        ? {
            key,
            text: email,
          }
        : null;
    })
    .filter((item): item is panelmembers => item !== null);

    await submit(
      {
        candidateId,
        CandidateDetails: data,
        decision: decision ?? "YES",
        decisionComments,
        interviewLevel1: level1,
        interviewLevel2: level2,
        recrutimentData: positionDetails,
        interviewPanelL1: toPanel(level1.panelMembers),
        interviewPanelL2: toPanel(level2.panelMembers),
        HRReviewComents: HRReview,
        COIFlag: showCOI,
        COIDetails: coi,
        StatusId: statusId,
      },
      decision ?? "YES",
    );
  }, [
    canSubmit,
    candidateId,
    data,
    decision,
    decisionComments,
    coi,
    level1,
    level2,
    HRReview,
    showCOI,
    statusId,
    positionDetails,
    submit,
    showModal,
    closeModal,
  ]);

  // ── Early exit ─────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <AnimatePresence>
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className={styles.modalCard}
            variants={cardVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <header className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.headerIcon}>
                  <User size={24} />
                </div>
                <div className={styles.headerMeta}>
                  <div className={styles.breadcrumb}>
                    <span>{strings.CandidateSelection}</span>
                    <ChevronRight
                      size={12}
                      className={styles.breadcrumbChevron}
                    />
                    <span className={styles.breadcrumbActive}>
                      {strings.ReviewProfile}</span>
                  </div>
                  <h2 className={styles.headerTitle}>
                    {strings.CandidateProfileReview}</h2>
                  <div className={styles.headerSubtitle}>
                    <span className={styles.jobCodeBadge}>
                      {data?.JobCode || "---"}
                    </span>
                    <span className={styles.headerDot} />
                    <span className={styles.headerJobTitle}>
                      {data?.JobTitle || "---"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={styles.closeBtn}
                type="button"
                onClick={onClose}
                aria-label={strings.Close}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </header>

            {/* ── Body ── */}
            <div className={styles.body}>
              {/* ── Sidebar ── */}
              <aside className={styles.sidebar}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatar}>
                    {profileImgUrl && !imageError ? (
                      <img
                        src={profileImgUrl}
                        alt={data?.ApplicantName ?? "Candidate Profile"}
                        className={styles.avatarImg}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      (data?.ApplicantName ?? "A").charAt(0)
                    )}
                  </div>
                  <h3 className={styles.avatarName}>
                    {data?.ApplicantName ?? "--"}
                  </h3>
                  <span className={styles.avatarNationality}>
                    {data?.NationalityShort ?? "--"}
                  </span>
                </div>

                <div className={styles.infoGrid}>
                  <InfoItem
                    icon={<Globe size={14} />}
                    label={strings.Nationality}
                    value={data?.Nationality}
                  />
                  <InfoItem
                    icon={<Users size={14} />}
                    label={strings.Gender}
                    value={data?.Gender}
                  />
                  <InfoItem
                    icon={<FileText size={14} />}
                    label={strings.Qualification}
                    value={data?.HighestQualification}
                  />

                  <div className={styles.infoRow}>
                    <div className={styles.infoRowItem}>
                      <InfoItem
                        icon={<Zap size={14} />}
                        label={strings.MiningExp}
                        value={data?.ExperienceMining}
                      />
                    </div>
                    <div className={styles.infoRowItem}>
                      <InfoItem
                        icon={<Zap size={14} />}
                        label={strings.RelatedExp}
                        value={String(data?.ExperRelatedfield ?? "")}
                      />
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoRowItem}>
                      <InfoItem
                        icon={<AlertTriangle size={14} />}
                        label={strings.Conflicts}
                        value={data?.ConflictsOfInterest ?? "No"}
                      />
                    </div>
                    <div className={styles.infoRowItem}>
                      <InfoItem
                        icon={<Accessibility size={14} />}
                        label={strings.Disability}
                        value={data?.disability ?? "No"}
                      />
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoRowItem}>
                      <InfoItem
                        label={strings.TaxDependents}
                        value={String(data?.NumberOftax ?? "")}
                      />
                    </div>
                    <div className={styles.infoRowItem}>
                      <InfoItem
                        label={strings.CurrentPosition}
                        value={data?.CurrentPosition}
                      />
                    </div>
                  </div>

                  {data?.hasIvanhoeZijinExperience && (
                    <InfoItem
                      label={strings.GroupPartnerCompanies}
                      value={data.hasIvanhoeZijinExperience}
                    />
                  )}
                </div>

                <div className={styles.attachmentsSection}>
                  <div className={styles.attachmentsLabel}>
                    <FileText
                      size={14}
                      className={styles.attachmentsLabelIcon}
                    />{" "}
                    {strings.Attachments}</div>
                  <div className={styles.attachmentsBox}>
                    <RequiredAttachments
                      attachments={data?.OverallAtttachment ?? []}
                      isLoading={loading}
                    />
                  </div>
                </div>
              </aside>

              {/* ── Main content ── */}
              <div className={styles.mainContent}>
                {/* Screening Questions */}
                {!PanelMember && (
                  <motion.section
                    className={styles.section}
                    custom={0}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SectionHeader
                      title={strings.ScreeningQuestions}
                      subtitle={strings.CandidateResponses}
                      accent="orange"
                    />
                    <div className={styles.questionsCard}>
                      <QuestionCard
                        index={1}
                        question="Willing to relocate if not currently living close to the relevant project site/office?"
                        answer={data?.WillingToRelocate}
                      />
                      {data?.previouslyworkedMine && (
                        <QuestionCard
                          index={2}
                          question="Has the person previously worked within the Ivanhoe Mines Group?"
                          answer={data.previouslyworkedMine}
                        />
                      )}
                      <QuestionCard
                        index={3}
                        question="Any family or other links with existing employees to declare? (If so, who? Attach detail)"
                        answer={data?.familylinks}
                      />
                      <QuestionCard
                        index={4}
                        question="Any business links to declare? (If so, who? Attach detail)"
                        answer={data?.businesslinks}
                      />
                    </div>
                  </motion.section>
                )}

                {/* Conflict of Interest */}
                {showCOI && (
                  <motion.section
                    className={styles.section}
                    custom={1}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SectionHeader title={strings.ConflictOfInterest} accent="red" />
                    <div className={styles.coiCard}>
                      <div className={styles.coiAlert}>
                        <AlertTriangle
                          className={styles.coiAlertIcon}
                          size={20}
                        />
                        <div className={styles.coiAlertContent}>
                          <span className={styles.coiAlertTitle}>
                            {strings.ConflictOfInterestDeclared}</span>
                          {data?.COIReason && (
                            <span className={styles.coiAlertReason}>
                              {data.COIReason}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.coiFields}>
                        {/* Consulted with */}
                        <div className={styles.coiField}>
                          <label className={styles.fieldLabel}>
                            {strings.ConsultedWith}{" "}
                            <span className={styles.fieldRequired}>*</span>
                          </label>
                          <div className={styles.selectWrapper}>
                            <select
                              className={styles.selectInput}
                              value={coi.consultedWith}
                              onChange={(e) =>
                                setCoi((p) => ({
                                  ...p,
                                  consultedWith: e.target.value,
                                }))
                              }
                              disabled={isReadOnly}
                            >
                              <option value="">{strings.Select}</option>
                              {consultoptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={18}
                              className={styles.selectChevron}
                            />
                          </div>
                        </div>

                        {/* Proof of discussion */}
                        <div className={styles.coiField}>
                          <label className={styles.fieldLabel}>
                            {strings.ProofOfDiscussion}{" "}
                            <span className={styles.fieldRequired}>*</span>
                          </label>

                          {!isReadOnly ? (
                            // ── Editable mode ──
                            coi.attachment.length === 0 ? (
                              <button
                                type="button"
                                className={styles.uploadBtn}
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <div className={styles.uploadIconWrap}>
                                  <Upload size={18} />
                                </div>
                                <div className={styles.uploadText}>
                                  <span className={styles.uploadTitle}>
                                    {strings.ClickToUpload}</span>
                                  <span className={styles.uploadSub}>
                                    {strings.PdfDocDocxPngJpg}</span>
                                </div>
                              </button>
                            ) : (
                              <AttachmentRow
                                file={coi.attachment[0]}
                                isReadOnly={false}
                                onPreview={handlePreview}
                                onClear={handleClearFile}
                              />
                            )
                          ) : coi.attachment.length > 0 ? (
                            // ── Read-only mode with file ──
                            <AttachmentRow
                              file={coi.attachment[0]}
                              isReadOnly
                              onPreview={handlePreview}
                            />
                          ) : (
                            <span className={styles.fieldLabel}>
                              {strings.NoAttachment}</span>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>

                      {/* COI Comments */}
                      <div className={styles.coiTextareaWrap}>
                        <label className={styles.fieldLabel}>
                          {strings.ReasonComments}{" "}
                          <span className={styles.fieldRequired}>*</span>
                        </label>
                        <div className={styles.coiTextareaRelative}>
                          <textarea
                            className={styles.coiTextarea}
                            maxLength={256}
                            placeholder={strings.EnterYourCommentsMax256Characters}
                            value={coi.comments}
                            onChange={(e) =>
                              setCoi((p) => ({
                                ...p,
                                comments: e.target.value,
                              }))
                            }
                            readOnly={isReadOnly}
                          />
                          <span className={styles.charCount}>
                            {coi.comments.length}/256
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* Disability */}
                {showDisability && (
                  <motion.section
                    className={styles.section}
                    custom={2}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SectionHeader title="Disability" accent="blue" />
                    <div className={styles.disabilityCard}>
                      <div className={styles.disabilityField}>
                        <span className={styles.disabilityFieldLabel}>
                          {strings.DisabilityStatus}</span>
                        <span className={styles.disabilityFieldValue}>
                          {data?.disability ?? "--"}
                        </span>
                      </div>
                      {data?.disability && (
                        <div className={styles.disabilityDivider}>
                          <span className={styles.disabilityFieldLabel}>
                            {strings.Comments}</span>
                          <span className={styles.disabilityReason}>
                            {data.disabilityReason}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}

                {!isLevel2Panel && (
                  <>
                    <motion.section
                      className={styles.section}
                      custom={4}
                      variants={sectionVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className={styles.hrFeedbackCard}>
                        <SectionHeader
                          title={strings.HrReviewFeedback}
                          accent="green"
                        />
                        <div className={styles.hrFeedbackFieldWrap}>
                          <label className={styles.fieldLabel}>
                            {strings.ReviewProfileFeedbackHr}{" "}
                            <span className={styles.fieldRequired}>*</span>
                          </label>
                          <div className={`${styles.dropdownWrapper} dropdown`}>
                            <div
                              className={[
                                styles.customDropdownTrigger,
                                dropdownOpen ? styles.dropdownOpen : "",
                                isReadOnly ? styles.dropdownDisabled : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              onClick={() =>
                                !isReadOnly && setDropdownOpen((v) => !v)
                              }
                            >
                              <span
                                className={
                                  HRReview
                                    ? styles.dropdownSelected
                                    : styles.dropdownPlaceholder
                                }
                              >
                                {HRReview || strings.SelectFeedback}
                              </span>
                              <ChevronDown
                                size={18}
                                className={[
                                  styles.dropdownChevron,
                                  dropdownOpen ? styles.open : "",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              />
                            </div>

                            <AnimatePresence>
                              {dropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className={styles.dropdownMenu}
                                >
                                  {FEEDBACK_OPTIONS.map((option) => (
                                    <div
                                      key={option}
                                      onClick={() => {
                                        setHRReview(option);
                                        setDropdownOpen(false);
                                      }}
                                      className={[
                                        styles.dropdownOption,
                                        HRReview === option
                                          ? styles.dropdownOptionActive
                                          : "",
                                      ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    >
                                      {option}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </motion.section>
                  </>
                )}

                {/* Level 1 Interview Schedule */}
                {PanelMember && (
                  <motion.section
                    className={styles.section}
                    custom={3}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SectionHeader
                      title={strings.InterviewScheduleLevel1}
                      accent="blue"
                    />
                    <InterviewScheduleInput
                      form={level1}
                      onChange={setLevel1}
                      panelOptions={level1PanelOptions}
                      onToggleMember={handleToggleLevel1Member}
                      minPanelCount={3}
                      Disable={isLevel2Panel}
                    />
                  </motion.section>
                )}

                {/* Level 2 Interview Schedule */}
                {isLevel2Panel && (
                  <motion.section
                    className={styles.section}
                    custom={4}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SectionHeader
                      title={strings.InterviewScheduleLevel2}
                      accent="green"
                    />
                    <InterviewScheduleInput
                      form={level2}
                      onChange={setLevel2}
                      panelOptions={level2PanelOptions}
                      onToggleMember={handleToggleLevel2Member}
                      minPanelCount={3}
                      Disable={false}
                    />
                  </motion.section>
                )}

                {/* LM Decision */}
                {!ReviewHRFlag && !PanelMember && !rejectedFlag && (
                  <motion.section
                    className={styles.section}
                    custom={5}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className={styles.lmDecisionCard}>
                      <div className={styles.lmDecisionHeader}>
                        <div className={styles.lmDecisionZap}>
                          <Zap size={28} fill="currentColor" />
                        </div>
                        <div className={styles.lmDecisionTitleWrap}>
                          <h3 className={styles.lmDecisionTitle}>
                            {strings.DoYouWishToSelectThisCandidate}</h3>
                          <p className={styles.lmDecisionSubtitle}>
                            {strings.PleaseReviewTheCandidateAndProvideYourFi}</p>
                        </div>
                      </div>

                      <div className={styles.decisionBtnsRow}>
                        {(
                          [
                            {
                              value: "YES",
                              label: strings.YesSelect,
                              Icon: CheckCircle,
                              activeStyle: styles.decisionBtnYesActive,
                              inactiveStyle: styles.decisionBtnYesInactive,
                              activeIcon: styles.iconWhite,
                              inactiveIcon: styles.iconGreen,
                            },
                            {
                              value: "NO",
                              label: strings.NoReject,
                              Icon: XCircle,
                              activeStyle: styles.decisionBtnNoActive,
                              inactiveStyle: styles.decisionBtnNoInactive,
                              activeIcon: styles.iconWhite,
                              inactiveIcon: styles.iconRed,
                            },
                            {
                              value: "HOLD",
                              label: strings.OnHold1,
                              Icon: Activity,
                              activeStyle: styles.decisionBtnHoldActive,
                              inactiveStyle: styles.decisionBtnHoldInactive,
                              activeIcon: styles.iconWhite,
                              inactiveIcon: styles.iconAmber,
                            },
                          ] as const
                        ).map(
                          ({
                            value,
                            label,
                            Icon,
                            activeStyle,
                            inactiveStyle,
                            activeIcon,
                            inactiveIcon,
                          }) => (
                            <button
                              key={value}
                              type="button"
                              className={`${styles.decisionBtn} ${
                                decision === value ? activeStyle : inactiveStyle
                              }`}
                              onClick={() => setDecision(value as DecisionType)}
                            >
                              <Icon
                                size={36}
                                strokeWidth={2}
                                className={
                                  decision === value ? activeIcon : inactiveIcon
                                }
                              />
                              <span className={styles.decisionBtnLabel}>
                                {label}
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </motion.section>
                )}

                {!ReviewHRFlag && (
<div className="mFormGroup">
              <button
                onClick={() => setCommentsflag(true)}
                className="mSubmitBtn"
                type="button"
                // disabled={submitHook.submitting}
              >
                <FileText size={16} />
                {strings.ViewComments}</button>
            </div>
                )}

                 

                {!rejectedFlag && (
                  <motion.section
                    custom={6}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className={styles.lmCommentsCard}>
                      <SectionHeader title="Comments" accent="blue" />
                      <div className={styles.lmCommentsFieldWrap}>
                        <label className={styles.lmCommentsLabel}>
                          <span className={styles.lmCommentsLabelText}>
                            {strings.DecisionJustificationComments}</span>{" "}
                          <span className={styles.lmCommentsRequired}>*</span>
                        </label>
                        <textarea
                          className={styles.lmCommentsTextarea}
                          placeholder={strings.ProvideYourFinalDecisionRationale}
                          value={decisionComments}
                          onChange={(e) => setDecisionComments(e.target.value)}
                          disabled={submitting}
                        />
                      </div>
                    </div>
                  </motion.section>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            {!rejectedFlag && (
              <footer className={styles.footer}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={onClose}
                >
                  {strings.Cancel}</button>
                <button
                  type="button"
                  className={`${styles.submitBtn} ${
                    canSubmit && !submitting
                      ? styles.submitBtnActive
                      : styles.submitBtnDisabled
                  }`}
                  disabled={!canSubmit || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      {PanelMember ? strings.ScheduleInterview : strings.SubmitAction}
                    </>
                  )}
                </button>
              </footer>
            )}

            {/* ── Overlays ── */}
            {loading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner} />
                <div className={styles.loadingText}>{strings.LoadingDetails}</div>
              </div>
            )}
            {pageLoading && <Loading />}

            <ModalPopup {...modalState} onClose={closeModal} />
            <ModalPopup {...submitModalState} onClose={submitCloseModal} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── File Preview Modal (own AnimatePresence) ── */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
       <CustomComments
        open={commentsflag}
        loading={recordLoading}
        Comments={data?.Comments || []}
        onClose={() => setCommentsflag(false)}
      />
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AttachmentRow  –  reusable file pill (preview + optional clear)
// ─────────────────────────────────────────────────────────────────────────────

interface AttachmentRowProps {
  file: IDocFiles;
  isReadOnly: boolean;
  onPreview: (file: IDocFiles) => void;
  onClear?: () => void;
}

const AttachmentRow: React.FC<AttachmentRowProps> = React.memo(
  ({ file, isReadOnly, onPreview, onClear }) => (
    <div className={styles.filePreview}>
      <div
        className={styles.filePreviewLeft}
        onClick={() => onPreview(file)}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onPreview(file)}
        aria-label={`Preview ${file.name}`}
      >
        <div className={styles.fileIconWrap}>
          <FileText size={18} />
        </div>
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileReady}>
            <CheckCircle size={12} />
            {isReadOnly ? strings.ClickToPreview : strings.ReadyToSubmit}
          </span>
        </div>
      </div>

      {!isReadOnly && onClear && (
        <button
          type="button"
          className={styles.clearFileBtn}
          onClick={onClear}
          aria-label={strings.RemoveFile}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  ),
);
AttachmentRow.displayName = "AttachmentRow";
