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
  Check,
  FileText,
  Plus,
  Target,
  Zap,
  UserCheck,
  BookOpen,
  FilePlus2,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  Globe,
} from "lucide-react";
import {
  PositionDetails,
  usePositionDetails,
} from "./Hooks/getPositionDetails";
import { useAdvertismentDetails, AdvertismentDetails } from "./Hooks/getAdvertismentDetails";
import { useAttachmentDetails } from "./Hooks/getAttachmentDetails";
import { useSignatureDetails } from "./Hooks/getSignatureDetails";
import { AdvertLanguage } from "./StateManage/useStateFromManage";
import { CreateAdvert, SubmitAdvert } from "./Components/CreateAdvert/CreateAdvert";
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
import * as strings from 'RecrutimentAppWebPartStrings';
import CustomComments from "../Components/CommentsModel/CommentsModal";
import { useCommentsDetails } from "./Hooks/getCommentsDetails";
import { PositionRoadmap } from "./Components/PositionRoadmap";

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
  buName: "",
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
  const [commentsflag, setCommentsflag] = useState(false);



  const { data: positionDetails, loading: positionLoading } =
    usePositionDetails(selectedJobId, selectedType);

  const { data: commentsData, loading: commentsLoading } = useCommentsDetails(selectedJobId);
  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();

  const jobCodeId = positionDetails?.JobCodeId ?? 0;
  const jobCode = positionDetails?.JobCode ?? selectedJobCode;
  const statusID = positionDetails?.StatusId ?? 0;
  const selectedNationality = positionDetails?.Nationality ?? ""

  const {
    data: advertDetails,
    BGVValue: BGVData,
    handleBvgToggle,
    loading: advertLoading,
    AdvertFlag
  } = useAdvertismentDetails(jobCodeId, statusID, selectedNationality, { enabled: !!jobCodeId });

  const { data: attachments, loading: attachmentLoading } =
    useAttachmentDetails(jobCode, { enabled: !!jobCode });

  const isLoading =
    positionLoading || advertLoading || attachmentLoading || signatureLoading;

  const [uploadDocument, setUploadDocument] = useState<UploadedFile[]>([]);

  // Local states for custom Empty State & Create Modal
  const [localAdvertDetails, setLocalAdvertDetails] = useState<AdvertismentDetails | null>(null);
  const [createAdvert, setCreateAdvert] = useState<SubmitAdvert | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  
  // useEffect(() => {
  //   setLocalAdvertDetails(advertDetails);
  // }, [advertDetails]);


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

    const localadvertContent = useMemo(
    () =>
      localAdvertDetails
        ? advertLanguage === "EN"
          ? localAdvertDetails.english
          : localAdvertDetails.french
        : null,
    [localAdvertDetails, advertLanguage],
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
    createAdvert,
  );

  const showSuccessModal = useCallback(
    (msg: string) => {
      showModal({
        type: "success",
        title: strings.SubmittedSuccessfully,
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
        title: strings.RequiredFieldsMissing,
        message:
          strings.OneOrMoreFieldsAreRequiredPleaseComplete,
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
        console.warn(strings.NoMatchingRoleFound, roleIDs);
      }
    } catch (error) {
      console.error(error);
      showModal({
        type: "error",
        title: strings.SomethingWentWrong,
        message: strings.AnUnexpectedErrorOccurredPleaseTryAgain,
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
      message: strings.AreYouSureYouWantToCancel,
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
                    {strings.PositionStatus}<ChevronRight
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
                            {strings.RecruitmentLifecycleRoadmap}</h3>
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

                {!isLoading && AdvertFlag ? (
                  <AdvertLanguageToggle
                    advertLanguage={advertLanguage}
                    advertContent={advertContent}
                    isLoading={isLoading}
                    onLanguageChange={onLanguageChange}
                  />
                ) : !isLoading && !AdvertFlag && !localAdvertDetails ? (
                  <div className="advert-empty-state-card">
                    <div className="advert-empty-state-card__icon-wrapper">
                      <FilePlus2 size={28} />
                    </div>
                    <h3 className="advert-empty-state-card__title">
                      No Advertisement Created
                    </h3>
                    <p className="advert-empty-state-card__description">
                      Create a job advertisement to attract qualified candidates for this position.
                    </p>
                    <div className="advert-empty-state-card__actions">
                      <button
                        type="button"
                        className="advert-empty-state-card__cta-btn"
                        onClick={() => setShowCreateModal(true)}
                      >
                        <Plus size={16} />
                        Create Advertisement
                      </button>
                      <a
                        href="#"
                        className="advert-empty-state-card__guide-link"
                        onClick={(e) => {
                          e.preventDefault();
                          showModal({
                            type: "info",
                            title: "Job Advertisement Guide",
                            message: "A guide to creating high-impact job advertisements will be displayed here.",
                            confirmLabel: "Understood",
                            onConfirm: closeModal
                          });
                        }}
                      >
                        <BookOpen size={14} />
                        View Advertisement Guide
                      </a>
                    </div>
                  </div>
                ) : localAdvertDetails ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", flexShrink: 0 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      {/* <button
                        type="button"
                        className="advert-success-card__action-btn"
                        onClick={() => {
                          showModal({
                            type: "info",
                            title: "Export Advertisement",
                            message: "Exporting advertisement details to PDF...",
                            confirmLabel: "OK",
                            onConfirm: closeModal
                          });
                        }}
                      >
                        Export to PDF
                      </button> */}
                      <button
                        type="button"
                        className="advert-success-card__action-btn advert-success-card__action-btn--primary"
                        onClick={() => setShowCreateModal(true)}
                      >
                        Edit Advertisement
                      </button>
                      <button
                        type="button"
                        className="advert-success-card__action-btn"
                        onClick={() => {
                          setLocalAdvertDetails(null);
                        }}
                        style={{ color: "#ef4444", borderColor: "#fca5a5" }}
                      >
                        Delete
                      </button>
                    </div>
                    <AdvertLanguageToggle
                      advertLanguage={advertLanguage}
                      advertContent={localadvertContent}
                      isLoading={isLoading}
                      onLanguageChange={onLanguageChange}
                    />
                  </div>
                ) : (<></>)}

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
                        ? strings.OnemSignedAndStampedDocumentOnlyPdf
                        : strings.DraftOnemAdvertdocFrenchOnlyPdf
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

                {showReviewFooter && (
                  <>
                    <ReviewCommentSignature
                      reviewerComments={reviewerComments}
                      acknowledgementCheckbox={acknowledgementCheckbox}
                      signatureDetails={signatureDetails}
                      isLoading={isLoading}
                      onCommentsChange={onCommentsChange}
                      onToggleAcknowledgement={onToggleAcknowledgement}
                      // commentError={commentError}
                      // checkboxError={checkboxError}
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
                          {strings.Cancel}</button>

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
                              {strings.Sending}</>
                          ) : (
                            <>
                              <Send size={16} style={{ marginRight: 8 }} />
                              {strings.Submit}</>
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
          
          <CustomComments
        open={commentsflag}
        loading={commentsLoading}
        Comments={commentsData || []}
        onClose={() => setCommentsflag(false)}
      />

          <CreateAdvert
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            jobCodeId={jobCodeId}
            SubmitKey={(advert) => setCreateAdvert(advert)}
            onPublish={(advert) => {
              setLocalAdvertDetails(advert);
              setShowCreateModal(false);
              showModal({
                type: "success",
                title: "Create Advertisement ",
                message: "The job advertisement has been Created successfully.",
                confirmLabel: "OK",
                onConfirm: closeModal
              });
            }}
            showModal={showModal}
            closeModal={closeModal}
          />
        </>
      )}
    </AnimatePresence>
  );
};


