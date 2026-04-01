import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileCheck, Loader2, Send, X } from "lucide-react";
import { useSignatureDetails } from "../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails";
import "./ReviewDocument.scss";
import { ReviewCommentSignature } from "../../RecruitmentTable/Components/ReviewCommentSignature";
import { UploadDocument, UploadedFile } from "../../RecruitmentTable/Components/UploadDocument";
import { MatricID } from "../../../../utilities/ConditionConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { useNavigate } from "react-router-dom";
import { ModalPopup } from "../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import { PositionFrame } from "./PositionFrame";
import { useCandidatDetails } from "./Hooks/getCandidateDetails";

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

const toDocFiles = (files: UploadedFile[]): IDocFiles[] =>
  files.map((item) => ({
    name: item.name,
    content: item.fileContent,
    type: "New",
  }));


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
  const { roleIDs } = userInfo();
  const navigate = useNavigate();
  const { modalState, showModal, closeModal } = useModalPopup();

  const { data: positionDetails, loading: positionLoading } =
    useCandidatDetails(selectedJobId, CandidateID, selectedcandidateID, jobrequestID);

  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();


  const isLoading =  signatureLoading;

  const [uploadDocument, setUploadDocument] = useState<UploadedFile[]>([]);

  const showValidationRef = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (loadingState !== isLoading) {
      setLoadingState(isLoading);
    }
  }, [isLoading, loadingState, setLoadingState]);


  const headerMeta = useMemo(
    () => ({
      title: positionDetails?.JobTiltle ?? "",
      code: positionDetails?.JobCode ?? "",
      department: positionDetails?.Department ?? "",
    }),
    [positionDetails]
  );


  // const canApprove = useMemo(() => {
  //   const rules: { roles: number[]; validate: () => boolean }[] = [
  //     {
  //       roles: [RoleID.RecruitmentHR],
  //       validate: () => commentValid && uploadValid && checkboxValid,
  //     },
  //     {
  //       roles: [RoleID.HOD, RoleID.LineManager],
  //       validate: () => commentValid && checkboxValid,
  //     },
  //     {
  //       roles: [RoleID.RecruitmentHRLead],
  //       validate: () =>
  //         commentValid &&
  //         uploadValid &&
  //         checkboxValid &&
  //         (positionDetails?.Nationality === Nationality.Expatriate
  //           ? bgvValid
  //           : true),
  //     },
  //   ];

  //   return rules.some(
  //     (rule) =>
  //       rule.roles.some((role) => roleIDs.includes(role)) && rule.validate()
  //   );
  // }, [commentValid, uploadValid, checkboxValid, bgvValid, positionDetails?.Nationality, roleIDs]);

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
    showValidationRef.current = true;

    // if (true) {
    //   showModal({
    //     type: "warning",
    //     title: "Required Fields Missing",
    //     message:
    //       "One or more fields are required. Please complete all highlighted fields before submitting.",
    //     confirmLabel: "OK",
    //     onConfirm: closeModal,
    //   });
    //   return;
    // }

    // if (isSubmittingRef.current) return;
    // isSubmittingRef.current = true;

    // try {
     
    // } catch (error) {
    //   console.error(error);
    //   showModal({
    //     type: "error",
    //     title: "Something Went Wrong",
    //     message: "An unexpected error occurred. Please try again.",
    //     confirmLabel: "Close",
    //     onConfirm: closeModal,
    //   });
    // } finally {
    //   if (isSubmittingRef.current) {
    //     isSubmittingRef.current = false;
    //   }
    // }
  }, [
    roleIDs,
    metricId,
    showSuccessModal,
    showModal,
    closeModal,
  ]);


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
                  isLoading={isLoading}
                  headerCode={headerMeta.code}
                />


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
                    // hasError={uploadError}
                    disabled={isSubmittingRef.current}
                  />


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
                          className="review-document__button review-document__button--primary"    //{!canApprove ? "review-document__button review-document__button--primary__is-disabled" : "review-document__button review-document__button--primary"}
                          // disabled={!canApprove || isSubmittingRef.current}
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
        </>
      )}
    </AnimatePresence>
  );
};
