import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Users, Calendar, AlertTriangle, Accessibility, CheckCircle, XCircle, Clock, Upload, ChevronDown, FileText, Trash2, Zap, Globe, User, Activity, Check, ChevronRight } from "lucide-react";
import { useFetchCandidateDetails } from "../Hooks/fetchCandidateDetails";
import { RequiredAttachments } from "../../RecruitmentTable/Components/RequiredAttachments";
import { ConflictOfInterestForm, DecisionType, InterviewScheduleForm, useSubmitCandidateReview } from "../Hooks/Usesubmitcandidatereview";
import { useFetchPanelMembers } from "../Hooks/fetchPanelMembers";
import { RoleID, StatusId, workflowStatusApi } from "../../../../utilities/Config";
import { RoleName } from "../../../../utilities/ConditionConfig";
import { useToast } from "../../../Hooks/useToast";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { DataSyncToRecruitmentResponse } from "../../../../services/RecruitmentTable/IRecruitmentService";
import styles from "./ShowCandidateDetailsPopup.module.scss";
import { ModalPopup } from "../../../Comman/ModalPopup/ModalPopup";

export interface panelvalues {
  bucodeId: number;
  candidateId: number;
  assignHR: string;
  statusId: string;
  actionID: number;
}

interface ShowCandidateDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  panelParams: panelvalues | null;
  positionDetails: DataSyncToRecruitmentResponse | null;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" },
  }),
};

// ─── SectionHeader ────────────────────────────────────────────────────────────
const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  accent?: "orange" | "blue" | "green" | "red";
}> = ({ title, subtitle, accent = "orange" }) => {
  const accentClass = {
    orange: styles.accentOrange,
    blue: styles.accentBlue,
    green: styles.accentGreen,
    red: styles.accentRed,
  }[accent];

  return (
    <div className={styles.sectionHeader}>
      <div className={styles.sectionHeaderRow}>
        <div className={`${styles.sectionAccentBar} ${accentClass}`} />
        <h3 className={styles.sectionTitle}>{title}</h3>
      </div>
      {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
    </div>
  );
};

// ─── InfoItem ─────────────────────────────────────────────────────────────────
const InfoItem: React.FC<{ label: string; value?: string | null; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className={styles.infoItem}>
    <div className={styles.infoLabel}>
      {icon && <span className={styles.infoLabelIcon}>{icon}</span>}
      {label}
    </div>
    <div className={styles.infoValue}>{value ?? "--"}</div>
  </div>
);

// ─── QuestionCard ─────────────────────────────────────────────────────────────
const QuestionCard: React.FC<{ index: number; question: string; answer?: string | null }> = ({
  index,
  question,
  answer,
}) => {
  const isYes = answer?.toLowerCase() === "yes";
  const isNo = answer?.toLowerCase() === "no";
  const badgeClass = isYes
    ? styles.answerYes
    : isNo
      ? styles.answerNo
      : styles.answerNeutral;

  return (
    <div className={styles.questionRow}>
      <div className={styles.questionInner}>
        <div className={styles.questionPill}>
          <span>Q{index}</span>
        </div>
        <div className={styles.questionBody}>
          <h4 className={styles.questionText}>{question}</h4>
          <div className={styles.answerRow}>
            <span className={styles.answerLabel}>Answer:</span>
            <span className={`${styles.answerBadge} ${badgeClass}`}>{answer ?? "--"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ShowCandidateDetailsPopup: React.FC<ShowCandidateDetailsPopupProps> = ({
  isOpen,
  onClose,
  candidateId,
  panelParams,
  positionDetails,
}) => {
  const ReviewHRFlag = panelParams?.statusId === workflowStatusApi.HRPending;
  const ReviewLML1 =
    panelParams?.statusId === workflowStatusApi.LineManagerL1Pending ||
    panelParams?.statusId === workflowStatusApi.LineManagerLevel1OnHold;
  const ReviewLML2 =
    panelParams?.statusId === workflowStatusApi.LineManagerL2Pending ||
    panelParams?.statusId === workflowStatusApi.LineManagerLevel2OnHold;
  const PanelMember =
    panelParams?.statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
    Number(panelParams?.statusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;

  const panelOptionFlag =
    panelParams?.statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
    Number(panelParams?.statusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
    panelParams?.statusId === workflowStatusApi.HRPending;

  const isEnabled = !!(panelOptionFlag);

  const { data: paneloptions, loading: panelloading, error } = useFetchPanelMembers(
    positionDetails?.BusinessUnitCodeId ?? 0,
    positionDetails?.AssignEMail ?? "",
    panelParams?.candidateId ?? 0,
    panelParams?.statusId ?? "",
    isEnabled
  );
  const { data, loading } = useFetchCandidateDetails(candidateId);
  console.log(data, "Datatatatata");


  const { submitting, submit, modalState, closeModal } = useSubmitCandidateReview(onClose);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [decision, setDecision] = useState<DecisionType | null>(null);
  const [decisionComments, setDecisionComments] = useState("");
  const [consultoptions, setConsultOptions] = useState<{ value: string; label: string }[]>([]);

  const feedbackOptions = ["Excellent", "Good", "Average", "Below Average", "Poor"];

  const [HRReview, setHRReview] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [coi, setCoi] = useState<ConflictOfInterestForm>({
    consultedWith: "",
    attachment: [],
    comments: "",
  });

  const [level1, setLevel1] = useState<InterviewScheduleForm>({
    panelMembers: [],
    startDate: "",
    endDate: "",
  });

  const [level2, setLevel2] = useState<InterviewScheduleForm>({
    panelMembers: [],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!isOpen || !paneloptions) return;

    const { Level1 = [], Level2 = [] } = paneloptions;

    const level1Members: string[] = [];
    const consultOption: { value: string; label: string }[] = [];

    Level1.forEach((item) => {
      if (item.Role !== RoleName.InterviewPanel) {
        level1Members.push(String(item.value));
      }

      if (
        item.Role === RoleName.LineManager ||
        item.Role === RoleName.HOD ||
        item.Role === RoleName.RecruitmentHR
      ) {
        consultOption.push({
          value: String(item.value),
          label: item.label,
        });
      }
    });

    const level2Members =
      Level2?.length > 0
        ? Level2
          .filter((item) => item.Role !== RoleName.InterviewPanel)
          .map((item) => String(item.value))
        : [];

    setConsultOptions(consultOption);

    setLevel1({
      panelMembers: level1Members,
      startDate: "",
      endDate: "",
    });

    setLevel2({
      panelMembers: level2Members,
      startDate: "",
      endDate: "",
    });
  }, [paneloptions, isOpen]);

  const canSubmit = useMemo(() => {
    if (ReviewHRFlag) {
      if (!HRReview && !decisionComments.trim()) return false;
    }
    if (ReviewLML1) {
      if (!decision || !decisionComments.trim()) return false;
    }
    if (ReviewLML2) {
      if (!decision || !decisionComments.trim()) return false;
    }
    if (PanelMember) {
      if (!decisionComments.trim()) return false;
      if (level1.panelMembers.length < 3 || !level1.startDate || !level1.endDate) return false;
      if (Number(panelParams?.statusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
        if (level2.panelMembers.length < 3 || !level2.startDate || !level2.endDate) return false;
      }
    }
    return true;
  }, [decision, decisionComments, coi, level1, data]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const handleClearFile = () => {
    setCoi((prev) => ({ ...prev, attachment: [] }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePanelToggle = useCallback(
    (setter: React.Dispatch<React.SetStateAction<InterviewScheduleForm>>, val: string) => {
      setter((prev) => ({
        ...prev,
        panelMembers: prev.panelMembers.includes(val)
          ? prev.panelMembers.filter((v) => v !== val)
          : [...prev.panelMembers, val],
      }));
      console.log(val, "valll");

    },
    []
  );

  const showCOI = data?.ConflictsOfInterest === "Yes";
  const showDisability = data?.disability === "Yes";

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const L1Panel = paneloptions?.Level1?.map((item) => ({ key: Number(item.value), text: item.Email })) ?? [];
    const L2Panel = paneloptions?.Level2?.map((item) => ({ key: Number(item.value), text: item.Email })) ?? [];

    await submit({
      candidateId: candidateId,
      CandidateDetails: data,
      decision: decision ?? "YES",
      decisionComments: decisionComments,
      interviewLevel1: level1,
      interviewLevel2: level2,
      recrutimentData: positionDetails,
      interviewPanelL1: L1Panel,
      interviewPanelL2: L2Panel,
      HRReviewComents: HRReview,
      COIFlag: showCOI,
      COIDetails: coi,
      StatusId: panelParams?.statusId ?? "",
    });
  }, [data, candidateId, decision, decisionComments, coi, level1, level2, submit, canSubmit]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        style={{ zIndex: 2147483647 }}
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
                  <span>Candidate selection</span>
                  <ChevronRight size={12} className={styles.breadcrumbChevron} />
                  <span className={styles.breadcrumbActive}>Review Profile</span>
                </div>
                <h2 className={styles.headerTitle}>Candidate Profile Review</h2>
                <div className={styles.headerSubtitle}>
                  <span className={styles.jobCodeBadge}>{data?.JobCode || "---"}</span>
                  <span className={styles.headerDot} />
                  <span className={styles.headerJobTitle}>{data?.JobTitle || "---"}</span>
                </div>
              </div>
            </div>
            <div>
              <button
                className={styles.closeBtn}
                type="button"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
          </header>

          {/* ── Body ── */}
          <div className={styles.body}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  {(data?.ApplicantName ?? "A").charAt(0)}
                </div>
                <h3 className={styles.avatarName}>{data?.ApplicantName ?? "--"}</h3>
                <span className={styles.avatarNationality}>{data?.Nationality ?? "--"}</span>
              </div>

              <div className={styles.infoGrid}>
                <InfoItem icon={<Globe size={14} />} label="Nationality" value={data?.Nationality} />
                <InfoItem icon={<Users size={14} />} label="Gender" value={data?.Gender} />
                <InfoItem icon={<FileText size={14} />} label="Qualification" value={data?.HighestQualification} />

                <div className={styles.infoRow}>
                  <div className={styles.infoRowItem}>
                    <InfoItem icon={<Zap size={14} />} label="Mining exp." value={data?.ExperienceMining} />
                  </div>
                  <div className={styles.infoRowItem}>
                    <InfoItem icon={<Zap size={14} />} label="Related exp." value={String(data?.ExperRelatedfield)} />
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoRowItem}>
                    <InfoItem icon={<AlertTriangle size={14} />} label="Conflicts" value={data?.ConflictsOfInterest ?? "No"} />
                  </div>
                  <div className={styles.infoRowItem}>
                    <InfoItem icon={<Accessibility size={14} />} label="Disability" value={data?.disability ?? "No"} />
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoRowItem}>
                    <InfoItem label="Tax dependents" value={String(data?.NumberOftax)} />
                  </div>
                  <div className={styles.infoRowItem}>
                    <InfoItem label="Current position" value={data?.CurrentPosition} />
                  </div>
                </div>

                <InfoItem label="Group / partner companies" value={data?.hasIvanhoeZijinExperience} />
              </div>

              <div className={styles.attachmentsSection}>
                <div className={styles.attachmentsLabel}>
                  <FileText size={14} className={styles.attachmentsLabelIcon} /> Attachments
                </div>
                <div className={styles.attachmentsBox}>
                  <RequiredAttachments attachments={data?.OverallAtttachment ?? []} isLoading={loading} />
                </div>
              </div>
            </aside>


            <div className={styles.mainContent}>

              {!PanelMember && (
                <>
                  <motion.section
                    className={styles.section}
                    custom={0}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SectionHeader title="Screening Questions" subtitle="Candidate responses" accent="orange" />
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
                          answer={data?.previouslyworkedMine}
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
                </>
              )}


              {showCOI && (
                <motion.section
                  className={styles.section}
                  custom={1}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <SectionHeader title="Conflict of interest" accent="red" />
                  <div className={styles.coiCard}>
                    <div className={styles.coiAlert}>
                      <AlertTriangle className={styles.coiAlertIcon} size={20} />
                      <div className={styles.coiAlertContent}>
                        <span className={styles.coiAlertTitle}>Conflict of Interest Declared</span>
                        {data?.COIReason && (
                          <span className={styles.coiAlertReason}>{data.COIReason}</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.coiFields}>
                      <div className={styles.coiField}>
                        <label className={styles.fieldLabel}>
                          Consulted with <span className={styles.fieldRequired}>*</span>
                        </label>
                        <div className={styles.selectWrapper}>
                          <select
                            className={styles.selectInput}
                            value={coi.consultedWith}
                            onChange={(e) => setCoi((p) => ({ ...p, consultedWith: e.target.value }))}
                          >
                            <option value="">Select...</option>
                            {consultoptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={18} className={styles.selectChevron} />
                        </div>
                      </div>

                      <div className={styles.coiField}>
                        <label className={styles.fieldLabel}>
                          Proof of discussion <span className={styles.fieldRequired}>*</span>
                        </label>
                        {coi.attachment.length === 0 ? (
                          <button
                            type="button"
                            className={styles.uploadBtn}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className={styles.uploadIconWrap}>
                              <Upload size={18} />
                            </div>
                            <div className={styles.uploadText}>
                              <span className={styles.uploadTitle}>Click to upload</span>
                              <span className={styles.uploadSub}>PDF, DOC, DOCX, PNG, JPG</span>
                            </div>
                          </button>
                        ) : (
                          <div className={styles.filePreview}>
                            <div className={styles.filePreviewLeft}>
                              <div className={styles.fileIconWrap}>
                                <FileText size={18} />
                              </div>
                              <div className={styles.fileInfo}>
                                <span className={styles.fileName}>{coi.attachment[0].name}</span>
                                <span className={styles.fileReady}>
                                  <CheckCircle size={12} /> Ready to submit
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className={styles.clearFileBtn}
                              onClick={handleClearFile}
                              aria-label="Remove file"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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

                    <div className={styles.coiTextareaWrap}>
                      <label className={styles.fieldLabel}>
                        Reason / Comments <span className={styles.fieldRequired}>*</span>
                      </label>
                      <div className={styles.coiTextareaRelative}>
                        <textarea
                          className={styles.coiTextarea}
                          maxLength={256}
                          placeholder="Enter your comments (max 256 characters)..."
                          value={coi.comments}
                          onChange={(e) => setCoi((p) => ({ ...p, comments: e.target.value }))}
                        />
                        <span className={styles.charCount}>{coi.comments.length}/256</span>
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
                      <span className={styles.disabilityFieldLabel}>Disability status</span>
                      <span className={styles.disabilityFieldValue}>{data?.disability ?? "--"}</span>
                    </div>
                    {data?.disability && (
                      <div className={styles.disabilityDivider}>
                        <span className={styles.disabilityFieldLabel}>Comments</span>
                        <span className={styles.disabilityReason}>{data.disabilityReason}</span>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}

              {ReviewHRFlag && (
                <motion.section
                  className={styles.section}
                  custom={4}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className={styles.hrFeedbackCard}>
                    <SectionHeader title="HR Review Feedback" accent="green" />
                    <div className={styles.hrFeedbackFieldWrap}>
                      <label className={styles.fieldLabel}>
                        Review Profile Feedback - HR <span className={styles.fieldRequired}>*</span>
                      </label>
                      <div className={`${styles.dropdownWrapper} dropdown`}>
                        <div
                          className={`${styles.customDropdownTrigger}${open ? ` ${styles.dropdownOpen}` : ""}`}
                          onClick={() => setOpen(!open)}
                        >
                          <span className={HRReview ? styles.dropdownSelected : styles.dropdownPlaceholder}>
                            {HRReview || "Select feedback"}
                          </span>
                          <ChevronDown
                            size={18}
                            className={`${styles.dropdownChevron}${open ? ` ${styles.open}` : ""}`}
                          />
                        </div>
                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={styles.dropdownMenu}
                            >
                              {feedbackOptions.map((option, index) => (
                                <div
                                  key={index}
                                  onClick={() => { setHRReview(option); setOpen(false); }}
                                  className={`${styles.dropdownOption}${HRReview === option ? ` ${styles.dropdownOptionActive}` : ""}`}
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
              )}

              {panelParams?.statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview && (
                <>
                  <motion.section
                    className={styles.section}
                    custom={3}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SectionHeader title="Interview schedule - Level 1" accent="blue" />
                    <InterviewScheduleInput
                      form={level1}
                      onChange={setLevel1}
                      panelOptions={(paneloptions?.Level1 ?? []).map((item) => ({
                        value: String(item.value),
                        label: item.label,
                      }))}
                      onToggleMember={(val) => handlePanelToggle(setLevel1, val)}
                      minPanelCount={3}
                    />
                  </motion.section>
                </>
              )}
              {Number(panelParams?.statusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel && (
                <>
                  <motion.section
                    className={styles.section}
                    custom={4}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <SectionHeader title="Interview schedule - Level 2" accent="green" />
                    <InterviewScheduleInput
                      form={level2}
                      onChange={setLevel2}
                      panelOptions={(paneloptions?.Level2 ?? []).map((item) => ({
                        value: String(item.value),
                        label: item.label,
                      }))}
                      onToggleMember={(val) => handlePanelToggle(setLevel2, val)}
                      minPanelCount={3}
                    />
                  </motion.section>
                </>
              )}

              {!ReviewHRFlag && !PanelMember ? (
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
                        <h3 className={styles.lmDecisionTitle}>Do you wish to select this candidate?</h3>
                        <p className={styles.lmDecisionSubtitle}>
                          Please review the candidate and provide your final decision.
                        </p>
                      </div>
                    </div>

                    <div className={styles.decisionBtnsRow}>
                      <button
                        type="button"
                        className={`${styles.decisionBtn} ${decision === "YES" ? styles.decisionBtnYesActive : styles.decisionBtnYesInactive
                          }`}
                        onClick={() => setDecision("YES")}
                      >
                        <CheckCircle
                          size={36}
                          strokeWidth={2}
                          className={decision === "YES" ? styles.iconWhite : styles.iconGreen}
                        />
                        <span className={styles.decisionBtnLabel}>YES, SELECT</span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.decisionBtn} ${decision === "NO" ? styles.decisionBtnNoActive : styles.decisionBtnNoInactive
                          }`}
                        onClick={() => setDecision("NO")}
                      >
                        <XCircle
                          size={36}
                          strokeWidth={2}
                          className={decision === "NO" ? styles.iconWhite : styles.iconRed}
                        />
                        <span className={styles.decisionBtnLabel}>NO, REJECT</span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.decisionBtn} ${decision === "HOLD" ? styles.decisionBtnHoldActive : styles.decisionBtnHoldInactive
                          }`}
                        onClick={() => setDecision("HOLD")}
                      >
                        <Activity
                          size={36}
                          strokeWidth={2}
                          className={decision === "HOLD" ? styles.iconWhite : styles.iconAmber}
                        />
                        <span className={styles.decisionBtnLabel}>ON HOLD</span>
                      </button>
                    </div>
                  </div>
                </motion.section>
              ) : (
                <></>
              )}

              <hr className={styles.sectionDivider} />
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
                      <span className={styles.lmCommentsLabelText}> decision justification / comments</span>{" "}
                      <span className={styles.lmCommentsRequired}>*</span>
                    </label>
                    <textarea
                      className={styles.lmCommentsTextarea}
                      placeholder="Provide your final decision rationale..."
                      value={decisionComments}
                      onChange={(e) => setDecisionComments(e.target.value)}
                    />
                  </div>
                </div>
              </motion.section>
            </div>
          </div>

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className={`${styles.submitBtn} ${canSubmit && !submitting ? styles.submitBtnActive : styles.submitBtnDisabled
                }`}
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  <CheckCircle size={16} />
                  {PanelMember ? "Interview Schedule" : "Submit action"}
                </>
              )}
            </button>
          </footer>

          {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
              <div className={styles.loadingText}>Loading details...</div>
            </div>
          )}

          <ModalPopup
            {...modalState}
            onClose={closeModal}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface InterviewScheduleInputProps {
  form: InterviewScheduleForm;
  onChange: React.Dispatch<React.SetStateAction<InterviewScheduleForm>>;
  panelOptions: { value: string; label: string }[];
  onToggleMember: (val: string) => void;
  minPanelCount?: number;
}

const InterviewScheduleInput: React.FC<InterviewScheduleInputProps> = ({
  form,
  onChange,
  panelOptions,
  onToggleMember,
  minPanelCount = 3,
}) => {
  const needsMore = form.panelMembers.length < minPanelCount;

  return (
    <div className={styles.scheduleCard}>
      <div className={styles.panelMembersWrap}>
        <label className={styles.fieldLabel}>
          Interview panel members <span className={styles.fieldRequired}>*</span>
        </label>
        <div className={styles.panelTagsWrap}>
          {panelOptions.map((opt) => {
            const selected = form.panelMembers.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`${styles.panelTag} ${selected ? styles.panelTagSelected : styles.panelTagUnselected}`}
                onClick={() => onToggleMember(opt.value)}
              >
                {selected && <CheckCircle size={16} className={styles.panelTagIcon} />}
                {opt.label}
              </button>
            );
          })}
        </div>
        {needsMore && (
          <span className={styles.panelWarning}>
            Please select at least {minPanelCount} panel members • {form.panelMembers.length} selected
          </span>
        )}
      </div>

      <div className={styles.dateRow}>
        <div className={styles.dateField}>
          <label className={styles.fieldLabel}>
            Start date & time <span className={styles.fieldRequired}>*</span>
          </label>
          <input
            type="datetime-local"
            className={styles.dateInput}
            value={form.startDate}
            onChange={(e) => onChange((p) => ({ ...p, startDate: e.target.value }))}
          />
        </div>
        <div className={styles.dateField}>
          <label className={styles.fieldLabel}>
            End date & time <span className={styles.fieldRequired}>*</span>
          </label>
          <input
            type="datetime-local"
            className={styles.dateInput}
            value={form.endDate}
            min={form.startDate}
            onChange={(e) => onChange((p) => ({ ...p, endDate: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
};