import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileCheck, Loader2, Send, X } from "lucide-react";
import { PositionDetails, usePositionDetails } from "./Hooks/getPositionDetails";
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
import { MatricID, Nationality, RecuritmentHRMsg } from "../../../../utilities/ConditionConfig";
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

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build IDocFiles array from uploaded files */
const toDocFiles = (files: UploadedFile[]): IDocFiles[] =>
  files.map((item) => ({
    name: item.name,
    content: item.fileContent,
    type: "New",
  }));

/** Map raw position API response → PositionDetails shape */
const toPositionDetails = (p: NonNullable<ReturnType<typeof usePositionDetails>["data"]>): PositionDetails => ({
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

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ─── Data hooks ─────────────────────────────────────────────────────────────
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

  const isLoading = positionLoading || advertLoading || attachmentLoading || signatureLoading;

  // ─── Local state (only what must cause re-renders) ───────────────────────
  const [uploadDocument, setUploadDocument] = useState<UploadedFile[]>([]);

  // useRef — these only gate logic/styling, they don't need to re-render the tree
  const showValidationRef = useRef(false);
  const isSubmittingRef = useRef(false);

  // ─── Sync loading state to parent ───────────────────────────────────────
  useEffect(() => {
    if (loadingState !== isLoading) {
      setLoadingState(isLoading);
    }
  }, [isLoading, loadingState, setLoadingState]);

  // ─── Derived / memoized values ───────────────────────────────────────────

  /** Role used for update calls — LM takes priority over HOD */
  const roleID = useMemo(
    () =>
      roleIDs.includes(RoleID.LineManager) || roleIDs.includes(RoleID.HOD)
        ? RoleID.LineManager
        : roleIDs[0],
    [roleIDs]
  );

  /**
   * formData is memoized so hooks that receive it only re-run
   * when positionDetails actually changes, not on every render.
   */
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
      reviewerComments,   // keep in sync with live prop
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positionDetails, reviewerComments]
  );

  /** Doc files memoized — only rebuilds when upload list changes */
  const docFiles: IDocFiles[] = useMemo(
    () => toDocFiles(uploadDocument),
    [uploadDocument]
  );

  /** Mapped position details for PositionFramework */
  const mappedData: PositionDetails | null = useMemo(
    () => (positionDetails ? toPositionDetails(positionDetails) : null),
    [positionDetails]
  );

  /** Advert content switches on language toggle */
  const advertContent = useMemo(
    () =>
      advertDetails
        ? advertLanguage === "EN"
          ? advertDetails.english
          : advertDetails.french
        : null,
    [advertDetails, advertLanguage]
  );

  /** Header meta for title / badge / department */
  const headerMeta = useMemo(
    () => ({
      title: positionDetails?.JobTitleEnglish ?? "",
      code: positionDetails?.JobCode ?? "",
      department: positionDetails?.Department ?? "",
    }),
    [positionDetails]
  );

  // ─── Validation flags ────────────────────────────────────────────────────

  const commentValid = reviewerComments.trim().length > 0;
  const uploadValid = uploadDocument.length > 0;
  const checkboxValid = acknowledgementCheckbox;

  const optionValid =
    Array.isArray(BGVData?.checkboxBGVOption) &&
    BGVData.checkboxBGVOption.some((o) => o.checked);

  const bgvValid = optionValid;

  /**
   * Validation rules per role — memoized so canApprove doesn't
   * recalculate unless role IDs or field values change.
   */
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
        rule.roles.some((role) => roleIDs.includes(role)) && rule.validate()
    );
  }, [commentValid, uploadValid, checkboxValid, bgvValid, positionDetails?.Nationality, roleIDs]);


  const { updateMainRecord } = useUpdateMainRecord(formData, roleID);
  const { handleHRLeadProcess } = useHRLeadProcess(
    formData,
    RoleID.RecruitmentHRLead,
    docFiles,
    BGVData?.checkboxBGVOption ?? []
  );
  const { handleHRProcess } = useHRProcess(formData, RoleID.RecruitmentHR, docFiles);


  const showSuccessModal = useCallback(
    (msg: string) => {
      showModal({
        type: "success",
        title: "Submitted Successfully",
        message: msg,
        confirmLabel: "Go to Dashboard",
        onConfirm: () => {
          closeModal();
          onClose();
          navigate("/RecruitmentTable");
          refreshKey();
        },
      });
    },
    [showModal, closeModal, onClose, navigate, refreshKey]
  );

  const handleApprove = useCallback(async () => {
    // Gate: mark validation visible (ref — no re-render needed here
    // because error classes are recalculated on next natural render)
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

    if (isSubmittingRef.current) return; // prevent double-submit
    isSubmittingRef.current = true;

    try {
      const isHRLead = roleIDs.includes(RoleID.RecruitmentHRLead);
      const isHR = roleIDs.includes(RoleID.RecruitmentHR);
      const isHODorLM = [RoleID.HOD, RoleID.LineManager].some((role) =>
        roleIDs.includes(role)
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
      isSubmittingRef.current = false;
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

  // ─── Error flags (driven by ref — evaluated at render time) ──────────────

  const sv = showValidationRef.current;
  const uploadError = sv && !uploadValid;
  const commentError = sv && !commentValid;
  const checkboxError = sv && !checkboxValid;
  const bgvError = sv && !optionValid;

  // ─── Render ──────────────────────────────────────────────────────────────

  const showUploadONEMSection =
    [MatricID.UploadONEM, MatricID.JobAdvert].includes(metricId);

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

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
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
                      {isLoading ? <SkeletonBlock width="220px" /> : headerMeta.title}
                    </h2>
                    <div className="advert-review-drawer__meta">
                      {isLoading ? (
                        <SkeletonBlock width="160px" />
                      ) : (
                        <>
                          <span className="advert-review-drawer__badge">{headerMeta.code}</span>
                          <span className="advert-review-drawer__dot" />
                          <span className="advert-review-drawer__meta-text">{headerMeta.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="advert-review-drawer__close"
                  onClick={onClose}
                >
                  <X size={18} />
                </button>
              </div>

              {/* ── Content ── */}
              <div className="advert-review-drawer__content">
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

                <RequiredAttachments attachments={attachments} isLoading={isLoading} />

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
                  />
                )}

                {showBGVSection && (
                  <div style={{ marginTop: "20px" }}>
                    <BGVerification
                      mandatoryChecks={BGVData.mantoryChecks}
                      VerificationChecks={BGVData.checkboxBGVOption}
                      onToggleOption={handleBvgToggle}
                      hasError={bgvError}
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
                    />

                    <div className="advert-review-drawer__footer">
                      <div className="advert-review-drawer__footer-actions">
                        <button
                          type="button"
                          className="advert-review-drawer__button"
                          onClick={onClose}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          className="advert-review-drawer__button advert-review-drawer__button--primary"
                          disabled={isLoading || isSubmittingRef.current}
                          onClick={handleApprove}
                        >
                          {isSubmittingRef.current ? (
                            <>
                              <Loader2 size={16} className="modal-popup__spinner" />
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