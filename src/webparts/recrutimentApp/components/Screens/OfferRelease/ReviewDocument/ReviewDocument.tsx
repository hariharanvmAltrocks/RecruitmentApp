// ReviewDocument.tsx — fixed, optimized, COI card integrated
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
import { StatusId } from "../../../../utilities/Config";
import CandidateDocumentsRepository from "../Component/CandidateDocumentsRepository";
import { useStateOfferRelease } from "./StateManage/useReviewDocumentManage";
import { VerificationToggle } from "./Component/ResueComponent";
import ConsentFormSection from "./Component/ConsentForm/consentform";
import COICard from "./Component/Coicard/Coicard";
import StatusBadge from "../../../Comman/Statusbadge/Statusbadge";
import { useBGVStatusDetails } from "./Hooks/useStatusDetails";
import { SubmitWorkflowDeps, useSubmitWorkflow } from "./saveHooks/Usesubmitworkflow";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { ButtonAction } from "../../../../utilities/ConditionConfig";


export interface ReviewDocumentProps {
  drawerOpen: boolean;
  selectedJobId: number | null;
  CandidateID: number;
  selectedcandidateID: number;
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


const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => (
  <div className="review-document__skeleton" style={{ width, height }} />
);


const CONSULT_OPTIONS = [
  { value: "hr-manager",   label: "HR Manager" },
  { value: "legal",        label: "Legal Department" },
  { value: "line-manager", label: "Line Manager" },
  { value: "ceo",          label: "CEO / Executive" },
];


export const ReviewDocument: React.FC<ReviewDocumentProps> = ({
  drawerOpen,
  selectedJobId,
  CandidateID,
  selectedcandidateID,
  jobrequestID,
  reviewerComments,
  acknowledgementCheckbox,
  loadingState,
  onClose,
  onCommentsChange,
  onToggleAcknowledgement,
  setLoadingState,
  refreshKey,
}) => {
  const { MatricID: metricId } = useUIState();
  const { roleIDs }            = userInfo();
  const navigate               = useNavigate();
  const { modalState, showModal, closeModal } = useModalPopup();

  const [uploadDocs, setUploadDocs] = useState<UploadedFile[]>([]);

  const {
    consentVerification,
    consentFile,
    showConsentErrors,
    handleConsentVerification,
    handleConsentFile,
    coiState,
    showCoiErrors,
    handleCoiChange,
    validateAll,
  } = useStateOfferRelease();

  const { data: positionDetails, loading: positionLoading } =
    useCandidatDetails(selectedJobId, CandidateID, selectedcandidateID, jobrequestID);

  const { data: bgvStatusDetails, loading: bgvStatusLoading, allCompleted, rejectFlag } = useBGVStatusDetails(jobrequestID);

  let data: SubmitWorkflowDeps = {
      data: positionDetails!,
      uploadDocs: uploadDocs,
      BGVerifiedStatus: bgvStatusDetails!,
      rejectflag: rejectFlag!,
  }

  const {  isLoading:SubmitLoading , modalState:SubmitModalState, closeModal:SubmitCloseModal, submit } = useSubmitWorkflow( data );

  const { data: docData } = useRequiredDocuments(
    positionDetails?.ProfileID   ?? "",
    positionDetails?.JobRequestID ?? ""
  );

  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();

  const isLoading       = signatureLoading;
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (loadingState !== isLoading) setLoadingState(isLoading);
  }, [isLoading, loadingState, setLoadingState]);

  const headerMeta = useMemo(
    () => ({
      title:      positionDetails?.JobTiltle  ?? "",
      code:       positionDetails?.JobCode    ?? "",
      department: positionDetails?.Department ?? "",
    }),
    [positionDetails]
  );

  const showUploadONEM =
    (positionDetails?.StatusID === StatusId.PendingHROfferInitiate &&
      positionDetails?.EmploymentCategory === "KCSA") ||
    positionDetails?.StatusID === StatusId.WorkPermitAcknowledgedContractUploaded ||
    positionDetails?.StatusID === StatusId.PendingFinancePaymentReview ||
    positionDetails?.StatusID === StatusId.PendingHRReviewOfferanduploadEmployementContract;


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
    const isValid = validateAll();

    if (!isValid) {
      showModal({
        type: "warning",
        title: "Required Fields Missing",
        message:
          "Please complete all highlighted fields before submitting.",
        confirmLabel: "OK",
        onConfirm: closeModal,
      });
      return;
    }

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {

      submit(ButtonAction.Initiated);
      
      showSuccessModal("Your review has been submitted successfully.");
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
  }, [validateAll, showModal, closeModal, showSuccessModal]);

  
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="review-document__header">
                <div className="review-document__header-left">
                  <div className="review-document__header-icon">
                    <FileCheck size={22} />
                  </div>
                  <div>
                    <h2 className="review-document__title">
                      {isLoading
                        ? <SkeletonBlock width="220px" />
                        : headerMeta.title}
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
                
                <div>
                <StatusBadge steps={bgvStatusDetails ?? []} />

                </div>

                <button
                  type="button"
                  className="review-document__close"
                  onClick={onClose}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="review-document__content">

                <PositionFrame
                  positionDetails={positionDetails}
                  isLoading={positionLoading}
                  headerCode={headerMeta.code}
                />

                {positionDetails && (
                  <CandidateDocumentsRepository data={docData ?? null} />
                )}

                <VerificationToggle
                  value={consentVerification}
                  onChange={handleConsentVerification}
                  hasError={showConsentErrors && consentVerification === null}
                />

                <ConsentFormSection
                  onFileChange={handleConsentFile}
                  downloadUrl={positionDetails?.DotAfricaCF?.downloadUrl}
                  disabled={isSubmittingRef.current}
                  hasFileError={showConsentErrors && consentFile === null}
                  consentform={positionDetails?.DotAfricaCF}
                />

                 <COICard
                    consultOptions={CONSULT_OPTIONS}
                    isReadOnly={isSubmittingRef.current}
                    hasError={showCoiErrors}
                    onChange={handleCoiChange}
                  />

                  <UploadDocument
                    multiple={false}
                    acceptedFormats=".pdf"
                    label="Draft ONEM AdvertDoc French (Only PDF)"
                    required
                    onChange={(files) => {
                      setUploadDocs(files);
                    }}
                    disabled={isSubmittingRef.current}
                  />

                <ReviewCommentSignature
                  reviewerComments={reviewerComments}
                  acknowledgementCheckbox={acknowledgementCheckbox}
                  signatureDetails={signatureDetails}
                  isLoading={isLoading}
                  onCommentsChange={onCommentsChange}
                  onToggleAcknowledgement={onToggleAcknowledgement}
                  disabled={isSubmittingRef.current}
                  // hasError={showCommentsErrors}
                />

                <div className="review-document__footer">
                  <div className="review-document__footer-actions">
                    <button
                      type="button"
                      className="review-document__button"
                      onClick={onClose}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="review-document__button review-document__button--primary"
                      disabled={isSubmittingRef.current}
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

              </div>
            </motion.div>
          </div>

          <ModalPopup {...modalState} onClose={closeModal} />
          <ModalPopup {...SubmitModalState} onClose={SubmitCloseModal} />
        </>
      )}
    </AnimatePresence>
  );
};