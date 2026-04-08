import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Users, Calendar, AlertTriangle, Accessibility, CheckCircle, XCircle, Clock, Upload, ChevronDown, FileText, Trash2, Zap, Globe, User, Activity, Check, ChevronRight } from "lucide-react";
import { useFetchCandidateDetails } from "../Hooks/fetchCandidateDetails";
import { RequiredAttachments } from "../../RecruitmentTable/Components/RequiredAttachments";
import { ConflictOfInterestForm, DecisionType, InterviewScheduleForm, useSubmitCandidateReview } from "../Hooks/Usesubmitcandidatereview";
import { useFetchPanelMembers } from "../Hooks/fetchPanelMembers";
import { StatusId, workflowStatusApi } from "../../../../utilities/Config";
import { DocumentFolderName, RoleName } from "../../../../utilities/ConditionConfig";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { DataSyncToRecruitmentResponse } from "../../../../services/RecruitmentTable/IRecruitmentService";
import styles from "./ShowCandidateDetailsPopup.module.scss";
import { ModalPopup } from "../../../Comman/ModalPopup/ModalPopup";
import { backdropVariants, cardVariants, InfoItem, InterviewScheduleInput, QuestionCard, SectionHeader, sectionVariants } from "./reuseUI";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import { CandidateTable } from "../../../../services/ServiceExport";
import { isSharePointUrl, buildWopiUrl, isPdfUrl, buildOfficeViewerUrl } from "../../../Hooks/reusehooks";

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


export const ShowCandidateDetailsPopup: React.FC<ShowCandidateDetailsPopupProps> = ({
  isOpen,
  onClose,
  candidateId,
  panelParams,
  positionDetails,
  handleRefresh
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
  const isReadOnly = !ReviewHRFlag;

  const { data: paneloptions, loading: panelloading, error } = useFetchPanelMembers(
    positionDetails?.BusinessUnitCodeId ?? 0,
    positionDetails?.AssignEMail ?? "",
    panelParams?.candidateId ?? 0,
    panelParams?.statusId ?? "",
    isEnabled
  );
  const { data, loading } = useFetchCandidateDetails(candidateId, panelParams?.RecruitmentID ?? 0);

  // const { submitting, submit, modalState, closeModal } = useSubmitCandidateReview(onClose, handleRefresh);
  const {
    submitting,
    submit,
    modalState: submitModalState,
    closeModal: submitCloseModal
  } = useSubmitCandidateReview(onClose, handleRefresh);
  const { modalState, showModal, closeModal } = useModalPopup();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [decision, setDecision] = useState<DecisionType | null>(null);
  const [decisionComments, setDecisionComments] = useState("");
  const [consultoptions, setConsultOptions] = useState<{ value: string; label: string }[]>([]);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

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

  const handlePreview = useCallback((file: IDocFiles) => {
    const rawUrl = file.content as string;

    // const resolveUrl = (url: string): string => {
    //   if (isSharePointUrl(url)) return buildWopiUrl(url);
    //   if (isPdfUrl(url)) return url;
    //   return buildOfficeViewerUrl(url);
    // };

    // const previewUrl = resolveUrl(rawUrl);

    setPreviewFile({ url: rawUrl, name: file.name });
  }, []);

  const getViewerUrl = (url: string) => {
  if (isSharePointUrl(url)) {
    return buildWopiUrl(url);
  }
  if (isPdfUrl(url)) {
    return url;
  }
  return buildOfficeViewerUrl(url);
};

  const panelValue = useMemo(() => {
    if (!paneloptions) return null;

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
        consultOption.push({ value: String(item.label), label: item.label });
      }
    });

    const level2Members =
      Level2?.length > 0
        ? Level2.filter((item) => item.Role !== RoleName.InterviewPanel)
          .map((item) => String(item.value))
        : [];

    return { level1Members, level2Members, consultOption };
  }, [paneloptions]);


  useEffect(() => {
    if (!isOpen) return;

    if (panelValue && (PanelMember || ReviewHRFlag)) {
      setConsultOptions(panelValue.consultOption);
      setLevel1({ panelMembers: panelValue.level1Members, startDate: data?.InterviewStartDate, endDate: data?.InterviewEndDate });
      setLevel2({ panelMembers: panelValue.level2Members, startDate: "", endDate: "" });
    }

    if (!data) return;

    const loadCOI = async () => {
      const COIAttchObj = {
        RequestID: String(data.profileID),
        DocumentName: DocumentFolderName.COIAttach,
      };
      const COIAttachRes = await CandidateTable.fetchCOIAttachment(COIAttchObj);
      let COIOptions = [{ value: String(data.COIAppreve), label: data.COIAppreve }];
      setConsultOptions(COIOptions);
      if(panelParams?.statusId != workflowStatusApi.HRPending){
        setCoi({
          consultedWith: data.COIAppreve ?? "",
          attachment: COIAttachRes.data,
          comments: data.COIComments ?? "",
        });
      }
      setHRReview(data.hrComments ?? "");

      // setCoi({
      //   consultedWith: data.COIAppreve ?? "",
      //   attachment: COIAttachRes.data,
      //   comments: data.COIComments ?? "",
      // });
    };

    void loadCOI();
  }, [isOpen, panelValue, data]);

    const showCOI = data?.ConflictsOfInterest === "Yes";
  const showDisability = data?.disability === "Yes";

  const canSubmit = useMemo(() => {
    // decisionComments is always required for any status across the forms
    if (!decisionComments?.trim()) return false;

    if (ReviewHRFlag) {
      if (!HRReview?.trim()) return false;
      if (showCOI) {
        if (!coi.consultedWith?.trim() || !coi.comments?.trim() || coi.attachment.length === 0) return false;
      }
    }

    if (ReviewLML1 || ReviewLML2) {
      if (!decision) return false;
    }

    if (PanelMember) {
      if (panelParams?.statusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview) {
        if (level1.panelMembers.length < 3 || !level1.startDate || !level1.endDate) return false;
      }
      if (Number(panelParams?.statusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
        if (level2.panelMembers.length < 3 || !level2.startDate || !level2.endDate) return false;
      }
    }

    return true;
  }, [
    ReviewHRFlag,
    ReviewLML1,
    ReviewLML2,
    PanelMember,
    decision,
    decisionComments,
    HRReview,
    showCOI,
    coi,
    level1,
    level2,
    panelParams?.statusId
  ]);

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



  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      showModal({
        type: "warning",
        title: "Required Fields Missing",
        message:
          "One or more fields are required. Please complete all highlighted fields before submitting.",
        confirmLabel: "OK",
        onConfirm: closeModal,
      });
      return;
    }


    const L1Panel = level1?.panelMembers?.map((item) => ({ key: Number(item), text: item })) ?? [];
    const L2Panel = level2?.panelMembers?.map((item) => ({ key: Number(item), text: item })) ?? [];

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
    <>
      {/* ── Document Preview Modal ── */}
      <AnimatePresence>
        <AnimatePresence>
          <motion.div
            className={styles.backdrop}
            // style={{ zIndex: 2147483647 }}
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

                   {data?.hasIvanhoeZijinExperience && <InfoItem label="Group / partner companies" value={data?.hasIvanhoeZijinExperience} />} 
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
                                disabled={isReadOnly}
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
                            {!isReadOnly ? (
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
                              )
                            ) : (
                              coi.attachment.length > 0 ? (
                                <div className={styles.filePreview}>
                                  <div
                                    className={styles.filePreviewLeft}
                                    onClick={() => handlePreview(coi.attachment[0])}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div className={styles.fileIconWrap}>
                                      <FileText size={18} />
                                    </div>
                                    <div className={styles.fileInfo}>
                                      <span className={styles.fileName}>{coi.attachment[0].name}</span>
                                      <span className={styles.fileReady}>
                                        <CheckCircle size={12} />
                                        {isReadOnly ? "Click to preview" : "Ready to submit"}
                                      </span>
                                    </div>
                                  </div>
                                  {!isReadOnly && (
                                    <button
                                      type="button"
                                      className={styles.clearFileBtn}
                                      onClick={handleClearFile}
                                      aria-label="Remove file"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className={styles.fieldLabel}>No attachment</span>
                              )
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
                              readOnly={isReadOnly}
                            />
                            <span className={styles.charCount}>{coi.comments.length}/256</span>
                          </div>
                        </div>
                      </div>
                    </motion.section>
                  )}


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
                            className={`${styles.customDropdownTrigger}${open ? ` ${styles.dropdownOpen}` : ""}
              ${isReadOnly ? styles.dropdownDisabled : ""}`}
                            onClick={() => !isReadOnly && setOpen(!open)}
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

                  {PanelMember && (
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
                          Disable = {Number(panelParams?.statusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel}
                          
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
                          Disable = {false}
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
                          disabled = {submitting}
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
              <ModalPopup
                {...submitModalState}
                onClose={submitCloseModal}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {previewFile && (
          <motion.div
            className={styles.previewBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              className={styles.previewModal}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Header */}
              <div className={styles.previewHeader}>
                <div className={styles.previewHeaderLeft}>
                  <FileText size={18} />
                  <span className={styles.previewFileName}>{previewFile.name}</span>
                </div>
                <button
                  type="button"
                  className={styles.previewClose}
                  onClick={() => setPreviewFile(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* iframe */}
              <div className={styles.previewBody}>
                <iframe
                  src={getViewerUrl(previewFile.url)}
                  title={previewFile.name}
                  className={styles.previewIframe}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>


  );
};
