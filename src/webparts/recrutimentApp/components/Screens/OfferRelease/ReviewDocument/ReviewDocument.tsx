// ReviewDocument.tsx — conditions moved to config
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileCheck, Loader2, Send, X } from "lucide-react";
import { useSignatureDetails } from "../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails";
import "./ReviewDocument.scss";
import { ReviewCommentSignature } from "../../RecruitmentTable/Components/ReviewCommentSignature";
import { UploadDocument, UploadedFile } from "../../RecruitmentTable/Components/UploadDocument";
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
import { SubmitWorkflowDeps, useSubmitWorkflow } from "./saveHooks/Usesubmitworkflow";
import { ButtonAction } from "../../../../utilities/ConditionConfig";
import { useWorkPermitUpload } from "./Hooks/Useworkpermitupload";
import { useReviewConditions } from "./Hooks/ConditionalHooks/Usereviewconditions";
import { WorkPermitUploadBox } from "./Component/Workpermituploadbox/Workpermituploadbox";



export interface ReviewDocumentProps {
  drawerOpen              : boolean;
  selectedJobId           : number | null;
  CandidateID             : number;
  selectedcandidateID     : number;
  jobrequestID            : string;
  reviewerComments        : string;
  acknowledgementCheckbox : boolean;
  loadingState            : boolean;
  onClose                 : () => void;
  onCommentsChange        : (value: string) => void;
  onToggleAcknowledgement : () => void;
  setLoadingState         : (value: boolean) => void;
  refreshKey              : () => void;
}

const CONSULT_OPTIONS = [
  { value: "hr-manager",   label: "HR Manager" },
  { value: "legal",        label: "Legal Department" },
  { value: "line-manager", label: "Line Manager" },
  { value: "ceo",          label: "CEO / Executive" },
];

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => (
  <div className="review-document__skeleton" style={{ width, height }} />
);

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

export const ReviewDocument: React.FC<ReviewDocumentProps> = ({
  drawerOpen,
  selectedJobId,
  CandidateID,
  selectedcandidateID,
  jobrequestID,
  loadingState,
  onClose,
  setLoadingState,
  refreshKey,
}) => {
  const navigate               = useNavigate();
  const { modalState, showModal, closeModal } = useModalPopup();


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
    validationError
  } = useStateOfferRelease();


  const { data: positionDetails, loading: positionLoading } =
    useCandidatDetails(selectedJobId, CandidateID, selectedcandidateID, jobrequestID);

  const {
    data: bgvStatusDetails,
    loading: bgvStatusLoading,
    allCompleted,
    rejectFlag,
  } = useBGVStatusDetails(jobrequestID);

  const isConsentVerified = consentVerification === "verified";

  const submitDeps: SubmitWorkflowDeps = {
    data             : positionDetails!,
    uploadDocs,
    BGVerifiedStatus : bgvStatusDetails!,
    rejectflag       : rejectFlag!,
    consentFile,
    coiState,
    consentVerification:isConsentVerified,
    reviewerComments,
  };

  const {
    isLoading  : SubmitLoading,
    modalState : SubmitModalState,
    closeModal : SubmitCloseModal,
    submit,
  } = useSubmitWorkflow(submitDeps);


  const { data: docData } = useRequiredDocuments(
    positionDetails?.ProfileID    ?? "",
    positionDetails?.JobRequestID ?? ""
  );

  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();

  const isLoading       = signatureLoading;
  const isSubmittingRef = useRef(false);

  const isPageLoading = positionLoading || signatureLoading || bgvStatusLoading;


  useEffect(() => {
    if (loadingState !== isLoading) setLoadingState(isLoading);
  }, [isLoading, loadingState, setLoadingState]);

  const { is, vis } = useReviewConditions({
    statusID            : positionDetails?.StatusID,
    empCat              : positionDetails?.EmploymentCategory,
    consentVerification,
    hasDetails          : !!positionDetails,
    rejectFlag          : !!rejectFlag,
  });

  const headerMeta = useMemo(
    () => ({
      title      : positionDetails?.JobTiltle  ?? "",
      code       : positionDetails?.JobCode    ?? "",
      department : positionDetails?.Department ?? "",
    }),
    [positionDetails]
  );

  const showSuccessModal = useCallback(
    (msg: string) => {
      showModal({
        type         : "success",
        title        : "Submitted Successfully",
        message      : msg,
        confirmLabel : "Go to Dashboard",
        onConfirm    : () => {
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
    const isValid = validateAll(vis);

    if (!isValid) {
      showModal({
        type         : "warning",
        title        : "Required Fields Missing",
        message      : "Please complete all highlighted fields before submitting.",
        confirmLabel : "OK",
        onConfirm    : closeModal,
      });
      return;
    }

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      submit(ButtonAction.Initiated);
      // showSuccessModal("Your review has been submitted successfully.");
    } catch (error) {
      console.error(error);
      showModal({
        type         : "error",
        title        : "Something Went Wrong",
        message      : "An unexpected error occurred. Please try again.",
        confirmLabel : "Close",
        onConfirm    : closeModal,
      });
    } finally {
      isSubmittingRef.current = false;
    }
  }, [validateAll, showModal, closeModal, showSuccessModal, submit]);

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
              transition={{ type: "spring", damping: 25, stiffness: 200, duration: 0.3  }}
            >
              <div className="review-document__header">
                <div className="review-document__header-left">
                  <div className="review-document__header-icon">
                    <FileCheck size={22} />
                  </div>
                  <div>
                    <h2 className="review-document__title">
                      {isLoading ? <SkeletonBlock width="220px" /> : headerMeta.title}
                    </h2>
                    <div className="review-document__meta">
                      {isLoading ? (
                        <SkeletonBlock width="160px" />
                      ) : (
                        <>
                          <span className="review-document__badge">{headerMeta.code}</span>
                          <span className="review-document__dot" />
                          <span className="review-document__meta-text">{headerMeta.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {vis.showDOTAficaBadge && (
                  <div className="review-document__header-right">
                    <StatusBadge steps={bgvStatusDetails ?? []} />
                  </div>
                )}

                <button type="button" className="review-document__close" onClick={onClose}>
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
                    disabled={isSubmittingRef.current}
                    hasFileError={validationError.showConsentErrors}
                    consentform={positionDetails?.DotAfricaCF}
                  />
                )}

                {vis.showCOICard && (
                  <COICard
                    consultOptions={CONSULT_OPTIONS}
                    isReadOnly={isSubmittingRef.current}
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
                    disabled={isSubmittingRef.current}
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
                    disabled={isSubmittingRef.current}
                    hasError={validationError.uploadError}
                  />
                )}
                

                <ReviewCommentSignature
                  reviewerComments={reviewerComments}
                  acknowledgementCheckbox={acknowledgementCheckbox}
                  signatureDetails={signatureDetails}
                  isLoading={isLoading}
                  onCommentsChange={onCommentsChange}
                  onToggleAcknowledgement={onToggleAcknowledgement}
                  disabled={isSubmittingRef.current}
                  commentError={validationError.comments}
                  checkboxError={validationError.acknowledgement}
                />
                  </>
                )}
                <div className="review-document__footer">
                  <div className="review-document__footer-actions">
                    <button type="button" className="review-document__button" onClick={onClose}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="review-document__button review-document__button--primary"
                      disabled={isSubmittingRef.current}
                      onClick={handleApprove}
                    >
                      {isSubmittingRef.current ? (
                        <><Loader2 size={16} className="modal-popup__spinner" /> Sending...</>
                      ) : (
                        <><Send size={16} /> Submit</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <ModalPopup {...modalState}       onClose={closeModal} />
          <ModalPopup {...SubmitModalState} onClose={SubmitCloseModal} />
        </>
      )}
    </AnimatePresence>
  );
};