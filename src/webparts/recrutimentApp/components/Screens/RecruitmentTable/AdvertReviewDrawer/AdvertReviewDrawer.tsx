import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileCheck,
  Loader2,
  Send,
  X,
  Network,
  ChevronRight,
  FileSearch,
  ClipboardCheck,
  Play,
  Filter,
  Calendar,
  UserCheck,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Check,
} from "lucide-react";
import {
  PositionDetails,
  usePositionDetails,
} from "./Hooks/getPositionDetails";
import { useAdvertismentDetails } from "./Hooks/getAdvertismentDetails";
import { useAttachmentDetails } from "./Hooks/getAttachmentDetails";
import { useSignatureDetails } from "./Hooks/getSignatureDetails";
import { AdvertLanguage } from "./StateManage/useStateFromManage";
import "./AdvertReviewDrawer.scss";
import { PositionFramework } from "../Components/PositionFramework";
import { AdvertLanguageToggle } from "../Components/AdvertLanguageToggle";
import { RequiredAttachments } from "../Components/RequiredAttachments";
import { ReviewCommentSignature } from "../Components/ReviewCommentSignature";
import { UploadDocument, UploadedFile } from "../Components/UploadDocument";
import {
  CheckboxContent,
  MatricID,
  Nationality,
  RecuritmentHRMsg,
} from "../../../../utilities/ConditionConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import BGVerification from "../Components/BGVerification/BGVerification";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { RoleID } from "../../../../utilities/Config";
import { useUpdateMainRecord } from "./Hooks/SaveHooks/useUpdateMainRecord";
import { useHRLeadProcess } from "./Hooks/SaveHooks/useHRLeadProcess";
import { useHRProcess } from "./Hooks/SaveHooks/useHRProcess";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { IDptData } from "../../../../services/RecruitmentTable/IRecruitmentService";
import { useNavigate } from "react-router-dom";
import { ModalPopup } from "../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import Loading from "../../../Comman/Loading/loading";
import {
  getStageIndex,
  stages,
} from "../../../../utilities/PositionStatusConfig";
import { CandidateProgress } from "./Components/CandidateProgress/CandidateProgress";

export interface AdvertReviewDrawerProps {
  drawerOpen: boolean;
  selectedJobId: number | null;
  selectedJobCode: string;
  selectedType: string;
  advertLanguage: AdvertLanguage;
  reviewerComments: string;
  acknowledgementCheckbox: boolean;
  loadingState: boolean;
  onClose: () => void;
  onLanguageChange: (language: AdvertLanguage) => void;
  onCommentsChange: (value: string) => void;
  onToggleAcknowledgement: () => void;
  setLoadingState: (value: boolean) => void;
  refreshKey: () => void;
}

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

const toDocFiles = (files: UploadedFile[]): IDocFiles[] =>
  files.map((item) => ({
    name: item.name,
    content: item.fileContent,
    type: "New",
  }));

const toPositionDetails = (
  p: NonNullable<ReturnType<typeof usePositionDetails>["data"]>,
): PositionDetails => ({
  jobId: p.RecordID,
  jobTitle: p.JobTitleEnglish,
  jobCode: p.JobCode,
  department: p.Department,
  buCode: p.BusinessUnitCode,
  buName: "", // TODO: wire real value
  subDepartment: p.SubDepartment,
  section: p.Section,
  deptCode: p.DepartmentCode,
  areaOfWork: p.AreaofWork,
  nationality: p.Nationality,
  patersonGrade: p.PatersonGrade,
  drcGrade: p.DRCGrade,
  employmentCategory: p.EmploymentCategory,
  contractType: p.TypeOfContract,
  numberOfPersons: Number(p.NumberOfPersonNeeded),
  dateRequired: String(p.DateRequried),
  JobCodeID: p.JobCodeId,
});

export const AdvertReviewDrawer: React.FC<AdvertReviewDrawerProps> = ({
  drawerOpen,
  selectedJobId,
  selectedJobCode,
  selectedType,
  advertLanguage,
  reviewerComments,
  acknowledgementCheckbox,
  loadingState,
  onClose,
  onLanguageChange,
  onCommentsChange,
  onToggleAcknowledgement,
  setLoadingState,
  refreshKey,
}) => {
  const { MatricID: metricId } = useUIState();
  const { roleIDs } = userInfo();
  const navigate = useNavigate();
  const { modalState, showModal, closeModal } = useModalPopup();

  const [loading, setLoading] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const { data: positionDetails, loading: positionLoading } =
    usePositionDetails(selectedJobId, selectedType);
  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();

  const jobCodeId = positionDetails?.JobCodeId ?? 0;
  const jobCode = positionDetails?.JobCode ?? selectedJobCode;

  const {
    data: advertDetails,
    BGVValue: BGVData,
    handleBvgToggle,
    loading: advertLoading,
  } = useAdvertismentDetails(jobCodeId, { enabled: !!jobCodeId });

  const { data: attachments, loading: attachmentLoading } =
    useAttachmentDetails(jobCode, { enabled: !!jobCode });

  const isLoading =
    positionLoading || advertLoading || attachmentLoading || signatureLoading;

  const [uploadDocument, setUploadDocument] = useState<UploadedFile[]>([]);

  const showValidationRef = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (loadingState !== isLoading) {
      setLoadingState(isLoading);
    }
  }, [isLoading, loadingState, setLoadingState]);

  const roleID = useMemo(
    () =>
      roleIDs.includes(RoleID.LineManager) || roleIDs.includes(RoleID.HOD)
        ? RoleID.LineManager
        : roleIDs[0],
    [roleIDs],
  );

  const formData: IDptData = useMemo(
    () => ({
      ID: positionDetails?.ID ?? 0,
      JobCodeId: positionDetails?.JobCodeId ?? 0,
      JobCode: positionDetails?.JobCode ?? "",
      JobTitleEnglish: positionDetails?.JobTitleEnglish ?? "",
      JobTitleFrench: positionDetails?.JobTitleFrench ?? "",
      DepartmentID: positionDetails?.DepartmentId ?? 0,
      Nationality: positionDetails?.Nationality ?? "",
      NumberOfPersonNeeded: positionDetails?.NumberOfPersonNeeded ?? "",
      Dptcode: positionDetails?.DeptCode ?? "",
      reviewerComments,
      StatusId: positionDetails?.StatusId ?? 0,
    }),
    [positionDetails, reviewerComments],
  );

  const docFiles: IDocFiles[] = useMemo(
    () => toDocFiles(uploadDocument),
    [uploadDocument],
  );

  const mappedData: PositionDetails | null = useMemo(
    () => (positionDetails ? toPositionDetails(positionDetails) : null),
    [positionDetails],
  );
  const advertContent = useMemo(
    () =>
      advertDetails
        ? advertLanguage === "EN"
          ? advertDetails.english
          : advertDetails.french
        : null,
    [advertDetails, advertLanguage],
  );

  const headerMeta = useMemo(
    () => ({
      title: positionDetails?.JobTitleEnglish ?? "",
      code: positionDetails?.JobCode ?? "",
      department: positionDetails?.Department ?? "",
    }),
    [positionDetails],
  );

  const commentValid = reviewerComments.trim().length > 0;
  const uploadValid = uploadDocument.length > 0;
  const checkboxValid = acknowledgementCheckbox;

  const optionValid =
    Array.isArray(BGVData?.checkboxBGVOption) &&
    BGVData.checkboxBGVOption.some((o) => o.checked);

  const bgvValid = optionValid;

  const canApprove = useMemo(() => {
    const rules: { roles: number[]; validate: () => boolean }[] = [
      {
        roles: [RoleID.RecruitmentHR],
        validate: () => commentValid && uploadValid && checkboxValid,
      },
      {
        roles: [RoleID.HOD, RoleID.LineManager],
        validate: () => commentValid && checkboxValid,
      },
      {
        roles: [RoleID.RecruitmentHRLead],
        validate: () =>
          commentValid &&
          uploadValid &&
          checkboxValid &&
          (positionDetails?.Nationality === Nationality.Expatriate
            ? bgvValid
            : true),
      },
    ];

    return rules.some(
      (rule) =>
        rule.roles.some((role) => roleIDs.includes(role)) && rule.validate(),
    );
  }, [
    commentValid,
    uploadValid,
    checkboxValid,
    bgvValid,
    positionDetails?.Nationality,
    roleIDs,
  ]);

  const { updateMainRecord } = useUpdateMainRecord(formData, roleID);
  const { handleHRLeadProcess } = useHRLeadProcess(
    formData,
    RoleID.RecruitmentHRLead,
    docFiles,
    BGVData?.checkboxBGVOption ?? [],
  );
  const { handleHRProcess } = useHRProcess(
    formData,
    RoleID.RecruitmentHR,
    docFiles,
  );

  const showSuccessModal = useCallback(
    (msg: string) => {
      showModal({
        type: "success",
        title: "Submitted Successfully",
        message: msg,
        confirmLabel: "OK",
        onConfirm: () => {
          closeModal();
          onClose();
          navigate("/MyTracker");
          refreshKey();
        },
      });
    },
    [showModal, closeModal, onClose, navigate, refreshKey],
  );

  const handleApprove = useCallback(async () => {
    showValidationRef.current = true;

    if (!canApprove) {
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

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      setLoading(true);
      const isHRLead = roleIDs.includes(RoleID.RecruitmentHRLead);
      const isHR = roleIDs.includes(RoleID.RecruitmentHR);
      const isHODorLM = [RoleID.HOD, RoleID.LineManager].some((role) =>
        roleIDs.includes(role),
      );

      if (isHRLead && metricId === MatricID.UploadONEM) {
        await handleHRLeadProcess(showSuccessModal);
      } else if (isHR) {
        await handleHRProcess(showSuccessModal);
      } else if (isHODorLM) {
        await updateMainRecord();
        showSuccessModal(RecuritmentHRMsg.AdvertisementReveiwMsg);
      } else {
        console.warn("No matching role found", roleIDs);
      }
    } catch (error) {
      console.error(error);
      showModal({
        type: "error",
        title: "Something Went Wrong",
        message: "An unexpected error occurred. Please try again.",
        confirmLabel: "Close",
        onConfirm: closeModal,
      });
    } finally {
      if (isSubmittingRef.current) {
        isSubmittingRef.current = false;
      }
      setLoading(false);
    }
  }, [
    canApprove,
    roleIDs,
    metricId,
    handleHRLeadProcess,
    handleHRProcess,
    updateMainRecord,
    showSuccessModal,
    showModal,
    closeModal,
  ]);

  const sv = showValidationRef.current;
  const uploadError = sv && !uploadValid;
  const commentError = sv && !commentValid;
  const checkboxError = sv && !checkboxValid;
  const bgvError = sv && !optionValid;

  const showUploadONEMSection = [
    MatricID.UploadONEM,
    MatricID.JobAdvert,
  ].includes(metricId);

  const showBGVSection =
    metricId === MatricID.UploadONEM &&
    positionDetails?.Nationality === Nationality.Expatriate;

  const showReviewFooter =
    metricId !== 0 &&
    [
      MatricID.UploadONEM,
      MatricID.JobAdvert,
      MatricID.AdvertReviewHOD,
      MatricID.AdvertReviewLM,
    ].includes(metricId);

  const handleCancel = () => {
    showModal({
      type: "confirmation",
      title: "Cancel",
      message: "Are you sure you want to cancel?",
      confirmLabel: "Yes",
      cancelLabel: "No",
      onConfirm: () => {
        onClose();
        closeModal();
        navigate("/MyTracker");
      },
      onCancel: closeModal,
    });
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {loading && <Loading />}
          <div className="advert-review-drawer">
            <motion.div
              className="advert-review-drawer__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              className="advert-review-drawer__panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* ── Header ── */}
              <div className="advert-review-drawer__header">
                <div className="advert-review-drawer__header-left">
                  <div className="advert-review-drawer__header-icon">
                    <FileCheck size={22} />
                  </div>
                  <div>
                    <h2 className="advert-review-drawer__title">
                      {isLoading ? (
                        <SkeletonBlock width="220px" />
                      ) : (
                        headerMeta.title
                      )}
                    </h2>
                    <div className="advert-review-drawer__meta">
                      {isLoading ? (
                        <SkeletonBlock width="160px" />
                      ) : (
                        <>
                          <span className="advert-review-drawer__badge">
                            {headerMeta.code}
                          </span>
                          <span className="advert-review-drawer__dot" />
                          <span className="advert-review-drawer__meta-text">
                            {headerMeta.department}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="advert-review-drawer__header-right"
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <button
                    onClick={() => setShowRoadmap(!showRoadmap)}
                    className={`advert-roadmap__toggle-btn ${showRoadmap ? "advert-roadmap__toggle-btn--active" : "advert-roadmap__toggle-btn--inactive"}`}
                  >
                    <Network size={14} />
                    Position Status
                    <ChevronRight
                      size={14}
                      className="advert-roadmap__toggle-icon"
                    />
                  </button>
                  <button
                    type="button"
                    className="advert-review-drawer__close"
                    onClick={onClose}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="advert-review-drawer__content">
                <AnimatePresence>
                  {showRoadmap && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      // style={{ overflow: "hidden" }}
                    >
                      <div className="advert-roadmap-wrapper">
                        <div className="advert-roadmap__header-top">
                          <h3 className="advert-roadmap__header-title">
                            <div className="advert-roadmap__header-title-bar"></div>
                            Recruitment Lifecycle Roadmap
                          </h3>
                          {/* <div className="advert-roadmap__header-status">
                            <div className="advert-roadmap__header-status-dot" />
                            <span className="advert-roadmap__header-status-text">
                              Active Status: Advert Review
                            </span>
                          </div> */}
                        </div>
                        <PositionRoadmap
                          statusId={positionDetails?.StatusId || 0}
                          recId={positionDetails?.ID || selectedJobId || 0}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <PositionFramework
                  positionDetails={mappedData}
                  isLoading={isLoading}
                  headerCode={headerMeta.code}
                />

                <AdvertLanguageToggle
                  advertLanguage={advertLanguage}
                  advertContent={advertContent}
                  isLoading={isLoading}
                  onLanguageChange={onLanguageChange}
                />

                <RequiredAttachments
                  attachments={attachments}
                  isLoading={isLoading}
                />

                {showUploadONEMSection && (
                  <UploadDocument
                    multiple={false}
                    acceptedFormats=".pdf"
                    label={
                      metricId === MatricID.UploadONEM
                        ? "ONEM Signed and Stamped Document (Only PDF)"
                        : "Draft ONEM AdvertDoc French (Only PDF)"
                    }
                    required
                    onChange={setUploadDocument}
                    hasError={uploadError}
                    disabled={isSubmittingRef.current}
                  />
                )}

                {showBGVSection && (
                  <div style={{ marginTop: "20px" }}>
                    <BGVerification
                      mandatoryChecks={BGVData.mantoryChecks}
                      VerificationChecks={BGVData.checkboxBGVOption}
                      onToggleOption={handleBvgToggle}
                      hasError={bgvError}
                      disabled={isSubmittingRef.current}
                    />
                  </div>
                )}

                {showReviewFooter && (
                  <>
                    <ReviewCommentSignature
                      reviewerComments={reviewerComments}
                      acknowledgementCheckbox={acknowledgementCheckbox}
                      signatureDetails={signatureDetails}
                      isLoading={isLoading}
                      onCommentsChange={onCommentsChange}
                      onToggleAcknowledgement={onToggleAcknowledgement}
                      commentError={commentError}
                      checkboxError={checkboxError}
                      disabled={isSubmittingRef.current}
                      acknowledgementLabel={
                        metricId === MatricID.UploadONEM
                          ? CheckboxContent.UploadOnemDocument
                          : CheckboxContent.ApprovalCheckbox
                      }
                    />

                    <div className="advert-review-drawer__footer">
                      <div className="advert-review-drawer__footer-actions">
                        <button
                          type="button"
                          className="advert-review-drawer__button"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          className={
                            !canApprove
                              ? "advert-review-drawer__button advert-review-drawer__button--primary__is-disabled"
                              : "advert-review-drawer__button advert-review-drawer__button--primary"
                          }
                          disabled={!canApprove || isSubmittingRef.current}
                          onClick={handleApprove}
                        >
                          {isSubmittingRef.current ? (
                            <>
                              <Loader2
                                size={16}
                                className="modal-popup__spinner"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={16} style={{ marginRight: 8 }} />
                              Submit
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <ModalPopup {...modalState} onClose={closeModal} />
        </>
      )}
    </AnimatePresence>
  );
};

const PositionRoadmap = ({ statusId, recId }: { statusId: number; recId: number }) => {
  const currentStage = getStageIndex(statusId);

  return (
    <div className="advert-roadmap">
      <div className="advert-roadmap__container">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentStage;
          const isCurrent = index === currentStage;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="advert-roadmap__stage"
            >
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="advert-roadmap__connector">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    className="advert-roadmap__connector-fill"
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              )}

              {/* Node */}
              <div className="advert-roadmap__node-wrapper">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`advert-roadmap__node ${
                    isCompleted
                      ? "advert-roadmap__node--completed"
                      : isCurrent
                        ? "advert-roadmap__node--current"
                        : "advert-roadmap__node--pending"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <Icon size={18} strokeWidth={2} />
                  )}
                </motion.div>

                {isCurrent && (
                  <div className="advert-roadmap__ping-wrapper">
                    <span className="advert-roadmap__ping" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="advert-roadmap__label-wrapper">
                <span
                  className={`advert-roadmap__label ${
                    isCompleted
                      ? "advert-roadmap__label--completed"
                      : isCurrent
                        ? "advert-roadmap__label--current"
                        : "advert-roadmap__label--pending"
                  }`}
                >
                  {stage.label}
                </span>

                {isCompleted && (
                  <span className="advert-roadmap__status-done">Done</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <CandidateProgress RecID={recId} />
    </div>
  );
};
