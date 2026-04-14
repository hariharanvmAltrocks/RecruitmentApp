// ReviewDocument.tsx — conditions moved to config
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileCheck, Loader2, Send, X } from "lucide-react";
import { useSignatureDetails } from "../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails";
import "./ReviewDocument.scss";
import { ReviewCommentSignature } from "../../RecruitmentTable/Components/ReviewCommentSignature";
import {
  UploadDocument,
  UploadedFile,
} from "../../RecruitmentTable/Components/UploadDocument";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { useNavigate } from "react-router-dom";
import { ModalPopup } from "../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import { PositionFrame } from "./PositionFrame";
import { useCandidatDetails } from "./Hooks/getCandidateDetails";
import { useRequiredDocuments } from "./Hooks/Userequireddocuments";
import CandidateDocumentsRepository from "../Component/CandidateDocumentsRepository";
import { useStateOfferRelease } from "./StateManage/useReviewDocumentManage";
import { VerificationToggle } from "./Component/ResueComponent";
import ConsentFormSection from "./Component/ConsentForm/consentform";
import COICard from "./Component/Coicard/Coicard";
import StatusBadge from "../../../Comman/Statusbadge/Statusbadge";
import { useBGVStatusDetails } from "./Hooks/useStatusDetails";
import {
  makeDocData,
  SubmitWorkflowDeps,
  useSubmitWorkflow,
} from "./saveHooks/Usesubmitworkflow";
import {
  ActionName,
  ButtonAction,
  CheckboxContent,
  DocumentFolderName,
  NationalityCode,
  RecuritmentHRMsg,
} from "../../../../utilities/ConditionConfig";
import { useWorkPermitUpload } from "./Hooks/Useworkpermitupload";
import { useReviewConditions } from "./Hooks/ConditionalHooks/Usereviewconditions";
import { WorkPermitUploadBox } from "./Component/Workpermituploadbox/Workpermituploadbox";
import {
  masterService,
  OfferServices,
} from "../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../utilities/ApiConfig";
import { ViewCommentsModal } from "../../../Comman/CommentsPopup/commentsPopup";
import { StatusId } from "../../../../utilities/Config";
import { WorkflowHODConfig } from "../../../Hooks/WorkflowConfig";
import { usePreChecklist } from "./Hooks/fetchPreChecklist";
import PreChecklist from "./Component/Prechecklist/Prechecklist";
import Loading from "../../../Comman/Loading/loading";

export interface ReviewDocumentProps {
  drawerOpen: boolean;
  selectedJobId: number | null;
  CandidateID: number;
  selectedcandidateID: number;
  IsExpat: boolean;
  jobrequestID: string;
  reviewerComments: string;
  acknowledgementCheckbox: boolean;
  loadingState: boolean;
  onClose: () => void;
  onCommentsChange: (value: string) => void;
  onToggleAcknowledgement: () => void;
  setLoadingState: (value: boolean) => void;
  refreshKey: () => void;
}

// ─── Button action types ───────────────────────────────────────────────────────
// Tracks WHICH button is currently submitting so each button shows its own spinner
type ActiveButton =
  | "approve"
  | "reinitiate"
  | "rejectCheck"
  | "saveAsDraft"
  | null;

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => <div className="review-document__skeleton" style={{ width, height }} />;

const PositionSkeleton = () => (
  <div className="review-document__skeleton-wrapper">
    <SkeletonBlock height="24px" width="250px" />
    <SkeletonBlock height="14px" width="180px" />
    <div style={{ marginTop: 16 }}>
      <SkeletonBlock height="100px" />
    </div>
    <div style={{ marginTop: 16 }}>
      <SkeletonBlock height="60px" />
    </div>
    <div style={{ marginTop: 16 }}>
      <SkeletonBlock height="40px" />
    </div>
  </div>
);

const CONSULT_OPTIONS = [
  { value: "hr-manager", label: "Louis Barend Van Wyk" },
  { value: "legal", label: "Evodie Mushiya Kadima" },
];

export const ReviewDocument: React.FC<ReviewDocumentProps> = ({
  drawerOpen,
  selectedJobId,
  CandidateID,
  selectedcandidateID,
  jobrequestID,
  IsExpat,
  loadingState,
  onClose,
  setLoadingState,
  refreshKey,
}) => {
  const navigate = useNavigate();
  const { modalState, showModal, closeModal } = useModalPopup();

  // ── Full-page loader (blocks entire panel during API call) ──────────────────
  const [pageloading, setPageLoading] = useState(false);

  // ── Which button is currently active (drives per-button spinner icon) ───────
  // Unlike isSubmittingRef, this IS a state so React re-renders and shows spinner
  const [activeButton, setActiveButton] = useState<ActiveButton>(null);

  // True when ANY button is submitting — used to disable all buttons at once
  const isAnySubmitting = activeButton !== null;

  const {
    consentVerification,
    consentFile,
    showConsentErrors,
    handleConsentVerification,
    handleConsentFile,
    coiState,
    handleCoiChange,
    fileInputRef,
    selectedFile,
    isReading,
    handleUploadClick,
    handleFileChange,
    clearFile,
    uploadDocs,
    handleDocumnetUpload,
    reviewerComments,
    acknowledgementCheckbox,
    onCommentsChange,
    onToggleAcknowledgement,
    validateAll,
    validationError,
  } = useStateOfferRelease();

  const [showComments, setshowComments] = useState(false);

  const { data: positionDetails, loading: positionLoading } =
    useCandidatDetails(
      selectedJobId,
      CandidateID,
      selectedcandidateID,
      jobrequestID,
      IsExpat,
    );

  const isPendingDOTAfrica =
    positionDetails?.StatusID === StatusId.PendingDOTAficaVerification;

  const {
    data: bgvStatusDetails,
    bgvStatus,
    loading: bgvStatusLoading,
    bgvComments,
    allCompleted,
    rejectFlag,
    revertFLag,
  } = useBGVStatusDetails(jobrequestID, isPendingDOTAfrica);

  const isConsentVerified = consentVerification === "verified";

  const submitDeps: SubmitWorkflowDeps = {
    data: positionDetails!,
    uploadDocs,
    BGVerifiedStatus: bgvStatusDetails!,
    rejectflag: rejectFlag!,
    consentFile,
    coiState,
    consentVerification: isConsentVerified,
    reviewerComments,
  };

  const {
    isLoading: SubmitLoading,
    modalState: SubmitModalState,
    closeModal: SubmitCloseModal,
    submit,
  } = useSubmitWorkflow(submitDeps);

  const { data: docData } = useRequiredDocuments(
    positionDetails?.ProfileID ?? "",
    positionDetails?.JobRequestID ?? "",
  );

  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();

  const isExpat =
    positionDetails?.NationalityCode !== NationalityCode.Nationals;

  const isPreOnboarding =
    positionDetails?.StatusID === StatusId.PendingHRpreonboardingchecklist;

  const { checklist, allChecked, loading, updateCheckItem } = usePreChecklist(
    isExpat,
    positionDetails?.PreChecklist ?? undefined,
    isPreOnboarding,
  );

  const isLoading = signatureLoading;
  const isPageLoading = positionLoading || signatureLoading || bgvStatusLoading;

  useEffect(() => {
    if (loadingState !== isLoading) setLoadingState(isLoading);
  }, [isLoading, loadingState, setLoadingState]);

  const { is, vis } = useReviewConditions({
    statusID: positionDetails?.StatusID,
    empCat: positionDetails?.EmploymentCategory,
    consentVerification,
    hasDetails: !!positionDetails,
    rejectFlag: !!rejectFlag,
    revertFlag: !!revertFLag,
  });

  const headerMeta = useMemo(
    () => ({
      title: positionDetails?.JobTiltle ?? "",
      code: positionDetails?.JobCode ?? "",
      department: positionDetails?.Department ?? "",
    }),
    [positionDetails],
  );

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const handleError = useCallback(() => {
    showModal({
      type: "error",
      title: "Something Went Wrong",
      message: "An unexpected error occurred. Please try again.",
      confirmLabel: "Close",
      onConfirm: closeModal,
    });
  }, [showModal, closeModal]);

  const ensureValid = useCallback(() => {
    if (!validateAll(vis)) {
      showModal({
        type: "warning",
        title: "Required Fields Missing",
        message: "Please complete all highlighted fields before submitting.",
        confirmLabel: "OK",
        onConfirm: closeModal,
      });
      return false;
    }
    return true;
  }, [validateAll, vis, showModal, closeModal]);

  const getCheckStatus = (title: string) =>
    checklist.find((item) => item.Title === title)?.value
      ? ActionName.Completed
      : ActionName.Pending;

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
          navigate("/Dashboard");
          refreshKey();
        },
      });
    },
    [showModal, closeModal, onClose, navigate, refreshKey],
  );

  // ─── Render button content ────────────────────────────────────────────────────
  // Shows spinner icon when THIS specific button is active, normal icon otherwise

  const renderBtnContent = (
    text: string,
    buttonKey: ActiveButton,
    loadingText: string = "Sending...",
  ) => {
    const isThisButtonLoading = activeButton === buttonKey;
    return isThisButtonLoading ? (
      <>
        <Loader2 size={16} className="modal-popup__spinner" />
        {loadingText}
      </>
    ) : (
      <>
        <Send size={16} />
        {text}
      </>
    );
  };

  // ─── handleReinitiate ─────────────────────────────────────────────────────────
  // Loader: pageloading=true → API → pageloading=false
  // Button: activeButton="reinitiate" shows spinner on Re Initiate button only

  const handleReinitiate = useCallback(() => {
    showModal({
      type: "confirmation",
      title: "Reinitiate BGV",
      message: RecuritmentHRMsg.ReinitiateBGVWarningMsg,
      confirmLabel: "Yes",
      cancelLabel: "No",
      onConfirm: async () => {
        setActiveButton("reinitiate"); // ✅ Show spinner on Re Initiate button
        setPageLoading(true); // ✅ Show full-page loader
        try {
          const UpdateBGV = await OfferServices.PerformCriminalRecordCheck(
            Number(jobrequestID),
          );
          if (UpdateBGV.status === ResponeStatus.SUCCESS) {
            showSuccessModal(RecuritmentHRMsg.ReinitiateBGVProcess);
          } else {
            handleError();
          }
        } catch {
          handleError();
        } finally {
          setActiveButton(null); // ✅ Remove button spinner
          setPageLoading(false); // ✅ Hide full-page loader
        }
      },
    });
  }, [jobrequestID, showSuccessModal, handleError, showModal]);

  // ─── handleApprove ────────────────────────────────────────────────────────────
  // Loader: pageloading=true → API → pageloading=false
  // Button: activeButton="approve" shows spinner on Submit/Reviewed/Revert button

  const handleApprove = useCallback(async () => {
    if (!ensureValid()) return;
    if (isAnySubmitting) return; // Guard: prevent double-click
    setActiveButton("approve"); // ✅ Show spinner on approve button
    setPageLoading(true); // ✅ Show full-page loader
    try {
      const action =
        consentVerification === "verified"
          ? ButtonAction.Review
          : consentVerification === "rejected"
            ? ButtonAction.Revert
            : ButtonAction.Initiated;
      await submit(action);
    } catch (error) {
      console.error(error);
      handleError();
    } finally {
      setActiveButton(null); // ✅ Remove button spinner
      setPageLoading(false); // ✅ Hide full-page loader
    }
  }, [ensureValid, consentVerification, submit, handleError, isAnySubmitting]);

  // ─── handleRejectCheck ────────────────────────────────────────────────────────
  // Loader: pageloading=true → API inside modal confirm → pageloading=false
  // Button: activeButton="rejectCheck" shows spinner on Approve/Reject button

  const handleRejectCheck = useCallback(
    async (btn: "Reject" | "Approve") => {
      if (!ensureValid()) return;

      const isExpat =
        positionDetails?.NationalityCode !== NationalityCode.Nationals;
      const workflowStatus = WorkflowHODConfig(
        positionDetails?.StatusID ?? 0,
        false,
        isExpat,
        positionDetails?.EmploymentCategory,
      );

      const isReject = btn === "Reject";
      const config = {
        title: isReject ? "Reject BGV" : "Approve BGV",
        message: isReject
          ? RecuritmentHRMsg.RejectBGVCheckMsg
          : RecuritmentHRMsg.ApprvedBGVCheckMsg,
        statusId: isReject
          ? StatusId.BackgroundCheckVerificationFailed
          : workflowStatus,
      };

      showModal({
        type: "confirmation",
        title: config.title,
        message: config.message,
        confirmLabel: "Yes",
        cancelLabel: "No",
        onCancel: closeModal,
        onConfirm: async () => {
          setActiveButton("rejectCheck"); // ✅ Show spinner on Approve/Reject button
          setPageLoading(true); // ✅ Show full-page loader
          try {
            const bgvDocData = makeDocData(
              positionDetails?.ProfileID ?? "",
              positionDetails?.JobRequestID ?? "",
              DocumentFolderName.BGVProofOfDocument,
            );

            await Promise.all([
              OfferServices.UploadCandidateDocument(
                bgvDocData,
                coiState.attachment,
              ),
              OfferServices.InsertRecruitmentCandidateDetails({
                ID: CandidateID,
                BackgroundChecksResults: JSON.stringify(bgvStatusDetails) ?? [],
                BGVConsultedWith: coiState.consultedWith,
                BGVComments: coiState.comments,
              }),
            ]);

            const response = await OfferServices.UpdateStatusSelectedHOD([
              { ID: selectedcandidateID, StatusId: config.statusId },
            ]);

            if (response.status === ResponeStatus.SUCCESS) {
              closeModal();
              showSuccessModal(RecuritmentHRMsg.ReinitiateBGVProcess);
              onClose();
              refreshKey();
            } else {
              throw new Error("Unexpected status");
            }
          } catch {
            handleError();
          } finally {
            setActiveButton(null); // ✅ Remove button spinner
            setPageLoading(false); // ✅ Hide full-page loader
          }
        },
      });
    },
    [
      positionDetails,
      coiState,
      bgvStatusDetails,
      CandidateID,
      selectedcandidateID,
      showModal,
      closeModal,
      onClose,
      refreshKey,
      showSuccessModal,
      ensureValid,
      handleError,
    ],
  );

  // ─── handleSaveAsDraft ────────────────────────────────────────────────────────
  // Loader: pageloading=true → API → pageloading=false
  // Button: activeButton="saveAsDraft" shows spinner on Save As Draft / Submit button

  const handleSaveAsDraft = useCallback(async () => {
    const BtnAction = !allChecked
      ? ButtonAction.SaveAsDraft
      : ButtonAction.Submit;

    if (BtnAction === ButtonAction.Submit) {
      if (!ensureValid()) return;
    }

    setActiveButton("saveAsDraft"); // ✅ Show spinner on Save As Draft / Submit button
    setPageLoading(true); // ✅ Show full-page loader

    try {
      const ChecklistValue = {
        BackgroundChecks: getCheckStatus("Background Checks"),
        SignedOfferLetterVerified: getCheckStatus("Signed Offer Letter"),
        SignedEmploymentContract: getCheckStatus("Employment Contract"),
        WorkPermitApproved: getCheckStatus("Work Permit Approved"),
        VisaProcess: getCheckStatus("Visa Process"),
        AccommodationBooked: getCheckStatus("Accommodation Booked"),
        TravelProcess: getCheckStatus("Travel Process"),
        ReadyforOnboarding: getCheckStatus("Ready for Onboarding"),
        MedicalChecks: getCheckStatus("Medical Checks"),
        ID: CandidateID,
      };

      const UpdateStatusCandidateList =
        await OfferServices.UpdateStatusCandidatelist(ChecklistValue);

      if (UpdateStatusCandidateList.status === ResponeStatus.SUCCESS) {
        if (BtnAction === ButtonAction.Submit) {
          const Obj = [
            {
              ID: selectedcandidateID,
              StatusId: isExpat
                ? StatusId.OnboardingProcessinitiatedforExpat
                : StatusId.OnboardingProcessinitiatedforDRC,
            },
          ];
          await OfferServices.UpdateStatusSelectedHOD(Obj);
        }
        showSuccessModal(
          BtnAction === ButtonAction.SaveAsDraft
            ? RecuritmentHRMsg.ChecklistSaveAsDraftMsg
            : RecuritmentHRMsg.OnboardingMsg,
        );
      } else {
        handleError();
      }
    } catch {
      handleError();
    } finally {
      setActiveButton(null); // ✅ Remove button spinner
      setPageLoading(false); // ✅ Hide full-page loader
    }
  }, [
    allChecked,
    ensureValid,
    CandidateID,
    selectedcandidateID,
    isExpat,
    showSuccessModal,
    handleError,
    checklist,
  ]);

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <div className="review-document">
            <motion.div
              className="review-document__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              className="review-document__panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.3,
              }}
            >
              <div className="review-document__header">
                <div className="review-document__header-left">
                  <div className="review-document__header-icon">
                    <FileCheck size={22} />
                  </div>
                  <div>
                    <h2 className="review-document__title">
                      {isLoading ? (
                        <SkeletonBlock width="220px" />
                      ) : (
                        headerMeta.title
                      )}
                    </h2>
                    <div className="review-document__meta">
                      {isLoading ? (
                        <SkeletonBlock width="160px" />
                      ) : (
                        <>
                          <span className="review-document__badge">
                            {headerMeta.code}
                          </span>
                          <span className="review-document__dot" />
                          <span className="review-document__meta-text">
                            {headerMeta.department}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {vis.showDOTAficaBadge && (
                  <div className="review-document__header-right">
                    <StatusBadge steps={bgvStatus ?? []} />
                  </div>
                )}

                <button
                  type="button"
                  className="review-document__close"
                  onClick={onClose}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="review-document__content">
                {isPageLoading ? (
                  <PositionSkeleton />
                ) : (
                  <>
                    <PositionFrame
                      positionDetails={positionDetails}
                      isLoading={positionLoading}
                      headerCode={headerMeta.code}
                    />

                    {vis.showCandidateDocs && (
                      <CandidateDocumentsRepository data={docData ?? null} />
                    )}

                    {vis.showVerificationToggle && (
                      <VerificationToggle
                        value={consentVerification}
                        onChange={handleConsentVerification}
                        hasError={validationError.verification}
                      />
                    )}

                    {vis.showConsentForm && (
                      <ConsentFormSection
                        onFileChange={handleConsentFile}
                        downloadUrl={positionDetails?.DotAfricaCF?.downloadUrl}
                        disabled={isAnySubmitting}
                        hasFileError={validationError.showConsentErrors}
                        consentform={positionDetails?.DotAfricaCF}
                      />
                    )}

                    {vis.showCOICard && (
                      <COICard
                        consultOptions={CONSULT_OPTIONS}
                        isReadOnly={isAnySubmitting}
                        hasError={validationError.showCoiErrors}
                        onChange={handleCoiChange}
                      />
                    )}

                    {vis.showWorkPermitUpload && (
                      <WorkPermitUploadBox
                        fileInputRef={fileInputRef}
                        selectedFile={selectedFile}
                        isReading={isReading}
                        hasFileError={validationError.workPermit}
                        disabled={isAnySubmitting}
                        onUploadClick={handleUploadClick}
                        onFileChange={handleFileChange}
                        onClearFile={clearFile}
                      />
                    )}

                    {vis.showUploadDocument && (
                      <UploadDocument
                        multiple={false}
                        acceptedFormats=".pdf"
                        label={vis.uploadDocLabel}
                        required
                        onChange={handleDocumnetUpload}
                        disabled={isAnySubmitting}
                        hasError={validationError.uploadError}
                      />
                    )}

                    {positionDetails?.StatusID ===
                      StatusId.PendingHRpreonboardingchecklist && (
                      <PreChecklist
                        nationalItems={checklist}
                        expatItems={[]}
                        isExpat={isExpat}
                        onToggle={(id: number, value: boolean) =>
                          updateCheckItem(id, value)
                        }
                        allChecked={allChecked}
                      />
                    )}

                    {!vis.ViewFlag && (
                      <ReviewCommentSignature
                        reviewerComments={reviewerComments}
                        acknowledgementCheckbox={acknowledgementCheckbox}
                        signatureDetails={signatureDetails}
                        isLoading={isLoading}
                        onCommentsChange={onCommentsChange}
                        onToggleAcknowledgement={onToggleAcknowledgement}
                        disabled={isAnySubmitting}
                        commentError={validationError.comments}
                        checkboxError={validationError.acknowledgement}
                        acknowledgementLabel={
                          CheckboxContent.PostRecrutimentCheckboxContent
                        }
                      />
                    )}

                    {allChecked &&
                      positionDetails?.StatusID ===
                        StatusId.PendingHRpreonboardingchecklist && (
                        <ReviewCommentSignature
                          reviewerComments={reviewerComments}
                          acknowledgementCheckbox={acknowledgementCheckbox}
                          signatureDetails={signatureDetails}
                          isLoading={isLoading}
                          onCommentsChange={onCommentsChange}
                          onToggleAcknowledgement={onToggleAcknowledgement}
                          disabled={isAnySubmitting}
                          commentError={validationError.comments}
                          checkboxError={validationError.acknowledgement}
                        />
                      )}

                    {bgvComments.length > 0 &&
                      positionDetails?.StatusID ===
                        StatusId.PendingDOTAficaVerification && (
                        <div className="review-documnet__BGVCommentBtn">
                          <button
                            type="button"
                            className="review-document__button review-document__button--primary"
                            onClick={() => setshowComments(true)}
                          >
                            View BGV Comments
                          </button>
                        </div>
                      )}

                    <div className="review-document__footer">
                      <div className="review-document__footer-actions">
                        {/* Back / Cancel button — always shown, never disabled */}
                        <button
                          type="button"
                          className="review-document__button"
                          onClick={onClose}
                        >
                          {vis.ViewFlag
                            ? "Back"
                            : revertFLag || rejectFlag
                              ? "Back"
                              : "Cancel"}
                        </button>

                        {/* ── DOT Africa buttons ── */}
                        {positionDetails?.StatusID ===
                          StatusId.PendingDOTAficaVerification && (
                          <>
                            {revertFLag && (
                              <button
                                type="button"
                                className="review-document__button review-document__button--primary"
                                disabled={isAnySubmitting} // ✅ disabled when any button is loading
                                onClick={handleReinitiate}
                              >
                                {/* ✅ Spinner shows only on THIS button */}
                                {renderBtnContent(
                                  "Re Initiate",
                                  "reinitiate",
                                  "Processing...",
                                )}
                              </button>
                            )}

                            {rejectFlag && coiState.wishesToProceed && (
                              <button
                                type="button"
                                className="review-document__button review-document__button--primary"
                                disabled={isAnySubmitting} // ✅ disabled when any button is loading
                                onClick={() =>
                                  handleRejectCheck(
                                    coiState.wishesToProceed === "Yes"
                                      ? "Approve"
                                      : "Reject",
                                  )
                                }
                              >
                                {/* ✅ Spinner shows only on THIS button */}
                                {renderBtnContent(
                                  coiState.wishesToProceed === "Yes"
                                    ? "Approve"
                                    : "Reject",
                                  "rejectCheck",
                                  coiState.wishesToProceed === "Yes"
                                    ? "Approving..."
                                    : "Rejecting...",
                                )}
                              </button>
                            )}
                          </>
                        )}

                        {/* ── Pre-onboarding checklist button ── */}
                        {positionDetails?.StatusID ===
                          StatusId.PendingHRpreonboardingchecklist && (
                          <button
                            type="button"
                            className="review-document__button review-document__button--primary"
                            disabled={isAnySubmitting} // ✅ disabled when any button is loading
                            onClick={handleSaveAsDraft}
                          >
                            {/* ✅ Spinner shows only on THIS button */}
                            {renderBtnContent(
                              !allChecked ? "Save As Draft" : "Submit",
                              "saveAsDraft",
                              !allChecked ? "Saving..." : "Submitting...",
                            )}
                          </button>
                        )}

                        {/* ── Main approve/submit button ── */}
                        {!vis.ViewFlag &&
                          positionDetails?.StatusID !=
                            StatusId.PendingHRpreonboardingchecklist && (
                            <button
                              type="button"
                              className="review-document__button review-document__button--primary"
                              disabled={isAnySubmitting} // ✅ disabled when any button is loading
                              onClick={handleApprove}
                            >
                              {/* ✅ Spinner shows only on THIS button */}
                              {renderBtnContent(
                                consentVerification === "verified"
                                  ? "Reviewed"
                                  : consentVerification === "rejected"
                                    ? "Revert"
                                    : "Submit",
                                "approve",
                                consentVerification === "verified"
                                  ? "Reviewing..."
                                  : consentVerification === "rejected"
                                    ? "Reverting..."
                                    : "Submitting...",
                              )}
                            </button>
                          )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* ✅ Full-page loader — shows during any API call */}
          {pageloading && <Loading />}

          <ModalPopup {...modalState} onClose={closeModal} />
          <ModalPopup {...SubmitModalState} onClose={SubmitCloseModal} />
          <ViewCommentsModal
            isOpen={showComments}
            onClose={() => setshowComments(false)}
            comments={bgvComments}
            title="View BGV Comments"
            isLoading={false}
          />
        </>
      )}
    </AnimatePresence>
  );
};
