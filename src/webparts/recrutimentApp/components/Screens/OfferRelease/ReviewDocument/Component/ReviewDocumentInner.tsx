import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, FileCheck, Network, ChevronRight, X } from "lucide-react";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import strings, {  } from "RecrutimentAppWebPartStrings";
import { OfferServices } from "../../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../../utilities/ApiConfig";
import { NationalityCode, ActionName, RecuritmentHRMsg, ButtonAction, DocumentFolderName, CheckboxContent } from "../../../../../utilities/ConditionConfig";
import { ViewCommentsModal } from "../../../../Comman/CommentsPopup/commentsPopup";
import StatusBadge from "../../../../Comman/Statusbadge/Statusbadge";
import { WorkflowHODConfig } from "../../../../Hooks/WorkflowConfig";
import { useSignatureDetails } from "../../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails";
import { ReviewCommentSignature } from "../../../RecruitmentTable/Components/ReviewCommentSignature";
import { useReviewConditions } from "../Hooks/ConditionalHooks/Usereviewconditions";
import { usePreChecklist } from "../Hooks/fetchPreChecklist";
import { useRequiredDocuments } from "../Hooks/Userequireddocuments";
import { useBGVStatusDetails } from "../Hooks/useStatusDetails";
import { IselectedPosition, PositionFrame } from "../PositionFrame";
import { ReviewDocumentProps } from "../ReviewDocument";
import { SubmitWorkflowDeps, useSubmitWorkflow, makeDocData } from "../saveHooks/Usesubmitworkflow";
import { useStateOfferRelease } from "../StateManage/useReviewDocumentManage";
import COICard from "./Coicard/Coicard";
import ConsentFormSection from "./ConsentForm/consentform";
import PreChecklist from "./Prechecklist/Prechecklist";
import { VerificationToggle } from "./ResueComponent";
import { WorkPermitUploadBox } from "./Workpermituploadbox/Workpermituploadbox";
import "../ReviewDocument.scss";
import { CandidateRoadmap } from "./CandidateRoadmap";
import { UploadDocument } from "../../../RecruitmentTable/Components/UploadDocument";
import CandidateDocumentsRepository from "../../Component/CandidateDocumentsRepository";
import { OfferrelaeseNational } from "./OfferrelaeseNational/OfferrelaeseNational";
import { StatusId } from "../../../../../utilities/Config";

interface ReviewDocumentInnerProps extends ReviewDocumentProps {
  positionDetails: IselectedPosition;
  pageloading: boolean;
  setPageLoading: (value: boolean) => void;
  showModal: (config: any) => void;
  closeModal: () => void;
}

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
  { value: "hr-manager", label: strings.LouisBarendVanWyk },
  { value: "legal", label: strings.EvodieMushiyaKadima },
];

export const ReviewDocumentInner: React.FC<ReviewDocumentInnerProps> = ({
  selectedJobId,
  CandidateID,
  selectedcandidateID,
  jobrequestID,
  IsExpat,
  loadingState,
  onClose,
  setLoadingState,
  refreshKey,
  positionDetails,
  pageloading,
  setPageLoading,
  showModal,
  closeModal,
}) => {
  const navigate = useNavigate();

  const [activeButton, setActiveButton] = useState<ActiveButton>(null);
  const isAnySubmitting = activeButton !== null;
  const [showRoadmap, setShowRoadmap] = useState(false);

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

    // National Offer Release & PPE
    nationalOfferReleased,
    // nationalOfferAccepted,
    nationalNoticePeriod,
    nationalJoiningDate,
    nationalPantsSize,
    nationalTopSize,
    nationalShoesSize,
    nationalContractReleased,
    // nationalContractAccepted,
    setNationalOfferReleased,
    // setNationalOfferAccepted,
    setNationalNoticePeriod,
    setNationalJoiningDate,
    setNationalPantsSize,
    setNationalTopSize,
    setNationalShoesSize,
    setNationalContractReleased,
    // setNationalContractAccepted,
  } = useStateOfferRelease();

  const [showComments, setshowComments] = useState(false);

  const isPendingDOTAfrica =
    positionDetails.StatusID === StatusId.PendingDOTAficaVerification;

  const {
    data: bgvStatusDetails,
    bgvStatus,
    loading: bgvStatusLoading,
    bgvComments,
    allCompleted,
    rejectFlag,
    revertFLag,
  } = useBGVStatusDetails(jobrequestID, selectedcandidateID ?? 0, CandidateID ?? 0, isPendingDOTAfrica);

  const isConsentVerified = consentVerification === "verified";

  const { data: docData } = useRequiredDocuments(
    positionDetails.ProfileID ?? "",
    positionDetails.JobRequestID ?? "",
  );

  const submitDeps: SubmitWorkflowDeps = {
    data: positionDetails,
    BGVerifiedStatus: docData?.categories ?? [],
    rejectflag: rejectFlag!,
    consentFile,
    coiState,
    consentVerification: isConsentVerified,
    reviewerComments,
    uploadDocs,
    selectedFile: selectedFile,
    showModal,
    closeModal,
    onClose,
    refreshKey,

    // National Offer Release & PPE
    nationalOfferReleased,
    // nationalOfferAccepted,
    nationalNoticePeriod,
    nationalJoiningDate,
    nationalPantsSize,
    nationalTopSize,
    nationalShoesSize,
    nationalContractReleased,
    // nationalContractAccepted,
  };

  const {
    isLoading: SubmitLoading,
    submit,
  } = useSubmitWorkflow(submitDeps);

  const { data: signatureDetails, loading: signatureLoading } =
    useSignatureDetails();

  const isExpat =
    positionDetails.NationalityCode !== NationalityCode.Nationals;

  const isPreOnboarding =
    positionDetails.StatusID === StatusId.PendingHRpreonboardingchecklist;

  const { checklist, allChecked, loading, updateCheckItem } = usePreChecklist(
    isExpat,
    positionDetails.PreChecklist ?? undefined,
    isPreOnboarding,
  );

  const handleChecklistToggle = useCallback(
    (id: number, value: boolean) => {
      updateCheckItem(id, value);
    },
    [updateCheckItem],
  );

  const isLoading = signatureLoading;
  const isPageLoading = signatureLoading || bgvStatusLoading;

  useEffect(() => {
    if (loadingState !== isLoading) setLoadingState(isLoading);
  }, [isLoading, loadingState, setLoadingState]);

  const { is, vis } = useReviewConditions({
    statusID: positionDetails.StatusID,
    empCat: positionDetails.EmploymentCategory,
    consentVerification,
    hasDetails: !!positionDetails,
    rejectFlag: !!rejectFlag,
    revertFlag: !!revertFLag,
    isExpat: isExpat,
  });

  const headerMeta = useMemo(
    () => ({
      title: positionDetails.JobTiltle ?? "",
      code: positionDetails.JobCode ?? "",
      department: positionDetails.Department ?? "",
    }),
    [positionDetails],
  );

  const handleError = useCallback(() => {
    showModal({
      type: "error",
      title: strings.SomethingWentWrong,
      message: strings.AnUnexpectedErrorOccurredPleaseTryAgain,
      confirmLabel: "Close",
      onConfirm: closeModal,
    });
  }, [showModal, closeModal]);

  const ensureValid = useCallback(() => {
    if (!validateAll(vis)) {
      showModal({
        type: "warning",
        title: strings.RequiredFieldsMissing,
        message: strings.PleaseCompleteAllHighlightedFieldsBefore,
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

  const handleReinitiate = useCallback(() => {
    showModal({
      type: "confirmation",
      title: strings.ReinitiateBgv,
      message: RecuritmentHRMsg.ReinitiateBGVWarningMsg,
      confirmLabel: "Yes",
      cancelLabel: "No",
      onConfirm: async () => {
        setActiveButton("reinitiate"); 
        setPageLoading(true);
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
          setActiveButton(null); 
          setPageLoading(false); 
        }
      },
    });
  }, [jobrequestID, showSuccessModal, handleError, showModal]);

  const handleApprove = useCallback(async () => {
    if (!ensureValid()) return;
    if (isAnySubmitting) return; 
    setActiveButton("approve"); 
    setPageLoading(true); 
    try {
      const action =
        consentVerification === "verified"
          ? ButtonAction.Review
          : consentVerification === "rejected"
            ? ButtonAction.Revert
            :  ButtonAction.Initiated;
      await submit(action);
    } catch (error) {
      console.error(error);
      handleError();
    } finally {
      setActiveButton(null); 
      setPageLoading(false); 
    }
  }, [ensureValid, consentVerification, submit, handleError, isAnySubmitting]);

  const handleRejectCheck = useCallback(
    async (btn: "Reject" | "Approve") => {
      if (!ensureValid()) return;

      const workflowStatus = WorkflowHODConfig(
        positionDetails.StatusID ?? 0,
        false,
        isExpat,
        positionDetails.EmploymentCategory,
      );

      const isReject = btn === "Reject";
      const config = {
        title: isReject ? strings.RejectBgv : strings.ApproveBgv,
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
          setActiveButton("rejectCheck"); 
          setPageLoading(true); 
          try {
            const bgvDocData = makeDocData(
              positionDetails.ProfileID ?? "",
              positionDetails.JobRequestID ?? "",
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
              throw new Error(strings.UnexpectedStatus);
            }
          } catch {
            handleError();
          } finally {
            setActiveButton(null); 
            setPageLoading(false); 
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
      isExpat,
    ],
  );

  const handleSaveAsDraft = useCallback(async () => {
    const BtnAction = !allChecked
      ? ButtonAction.SaveAsDraft
      : ButtonAction.Submit;

    if (BtnAction === ButtonAction.Submit) {
      if (!ensureValid()) return;
    }

    setActiveButton("saveAsDraft"); 
    setPageLoading(true); 
    try {
      const ChecklistValue = {
        BackgroundChecks: getCheckStatus(strings.BackgroundChecks),
        SignedOfferLetterVerified: getCheckStatus(strings.SignedOfferLetter),
        SignedEmploymentContract: getCheckStatus(strings.EmploymentContract),
        WorkPermitApproved: getCheckStatus(strings.WorkPermitApproved),
        VisaProcess: getCheckStatus(strings.VisaProcess),
        AccommodationBooked: getCheckStatus(strings.AccommodationBooked),
        TravelProcess: getCheckStatus(strings.TravelProcess),
        ReadyforOnboarding: getCheckStatus(strings.ReadyForOnboarding),
        MedicalChecks: getCheckStatus(strings.MedicalChecks),
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
      setActiveButton(null); 
      setPageLoading(false); 
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

  return (
    <>
      <div className="review-document__header">
        <div className="review-document__header-left">
          <div className="review-document__header-icon">
            <FileCheck size={22} />
          </div>
          <div>
            <h2 className="review-document__title">
              {headerMeta.title}
            </h2>
            <div className="review-document__meta">
              <span className="review-document__badge">
                {headerMeta.code}
              </span>
              <span className="review-document__dot" />
              <span className="review-document__meta-text">
                {headerMeta.department}
              </span>
            </div>
          </div>
        </div>

        {vis.showDOTAficaBadge && (
          <div className="review-document__header-right">
            <StatusBadge steps={bgvStatus ?? []} />
          </div>
        )}

        <div
          className="review-document__header-right"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <button
            onClick={() => setShowRoadmap(!showRoadmap)}
            className={`review-document__toggle-btn ${showRoadmap ? "review-document__toggle-btn--active" : "review-document__toggle-btn--inactive"}`}
          >
            <Network size={14} />
            {strings.CandidateStatus}
            <ChevronRight
              size={14}
              className="review-document__toggle-icon"
            />
          </button>
          <button
            type="button"
            className="review-document__close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="review-document__content">
        {isPageLoading ? (
          <PositionSkeleton />
        ) : (
          <>
            <AnimatePresence>
              {showRoadmap && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="advert-roadmap-wrapper">
                    <div className="advert-roadmap__header-top">
                      <h3 className="advert-roadmap__header-title">
                        <div className="advert-roadmap__header-title-bar"></div>
                        {strings.CandidateLifecycleRoadmap}
                      </h3>
                    </div>
                    <CandidateRoadmap
                      statusId={positionDetails.StatusID}
                      Nationality={positionDetails.NationalityCode}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <PositionFrame
              positionDetails={positionDetails}
              isLoading={false}
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
                downloadUrl={positionDetails.DotAfricaCF?.downloadUrl}
                disabled={isAnySubmitting}
                hasFileError={validationError.showConsentErrors}
                consentform={positionDetails.DotAfricaCF}
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

            {vis.NationalOfferLetter && (
              <OfferrelaeseNational
                  offerReleased={nationalOfferReleased}
                  // offerAccepted={nationalOfferAccepted}
                  noticePeriod={nationalNoticePeriod}
                  joiningDate={nationalJoiningDate}
                  pantsSize={nationalPantsSize}
                  topSize={nationalTopSize}
                  shoesSize={nationalShoesSize}
                  contractReleased={nationalContractReleased}
                  // contractAccepted={nationalContractAccepted}
                  validationError={validationError}
                  isReadOnly={isAnySubmitting}
                  StatusID={positionDetails.StatusID}
                  onChangeOfferReleased={setNationalOfferReleased}
                  // onChangeOfferAccepted={setNationalOfferAccepted}
                  onChangeNoticePeriod={setNationalNoticePeriod}
                  onChangeJoiningDate={setNationalJoiningDate}
                  onChangePantsSize={setNationalPantsSize}
                  onChangeTopSize={setNationalTopSize}
                  onChangeShoesSize={setNationalShoesSize}
                  onChangeContractReleased={setNationalContractReleased} 
                  // onChangeContractAccepted={setNationalContractAccepted}
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

            {positionDetails.StatusID ===
              StatusId.PendingHRpreonboardingchecklist && (
              <PreChecklist
                nationalItems={checklist}
                expatItems={[]}
                isExpat={isExpat}
                onToggle={handleChecklistToggle}
                allChecked={allChecked}
              />
            )}

            {!vis.ViewFlag &&
              positionDetails.StatusID !=
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
                  acknowledgementLabel={
                    CheckboxContent.PostRecrutimentCheckboxContent
                  }
                />
              )}

            {allChecked &&
              positionDetails.StatusID ===
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
              positionDetails.StatusID ===
                StatusId.PendingDOTAficaVerification && (
                <div className="review-documnet__BGVCommentBtn">
                  <button
                    type="button"
                    className="review-document__button review-document__button--primary"
                    onClick={() => setshowComments(true)}
                  >
                    {strings.ViewBgvComments}
                  </button>
                </div>
              )}

            <div className="review-document__footer">
              <div className="review-document__footer-actions">
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

                {positionDetails.StatusID ===
                  StatusId.PendingDOTAficaVerification && (
                  <>
                    {revertFLag && (
                      <button
                        type="button"
                        className="review-document__button review-document__button--primary"
                        disabled={isAnySubmitting}
                        onClick={handleReinitiate}
                      >
                        {renderBtnContent(
                          strings.ReInitiate,
                          "reinitiate",
                          "Processing...",
                        )}
                      </button>
                    )}

                    {rejectFlag && coiState.wishesToProceed && (
                      <button
                        type="button"
                        className="review-document__button review-document__button--primary"
                        disabled={isAnySubmitting}
                        onClick={() =>
                          handleRejectCheck(
                            coiState.wishesToProceed === "Yes"
                              ? "Approve"
                              : "Reject",
                          )
                        }
                      >
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

                {positionDetails.StatusID ===
                  StatusId.PendingHRpreonboardingchecklist && (
                  <button
                    type="button"
                    className="review-document__button review-document__button--primary"
                    disabled={isAnySubmitting}
                    onClick={handleSaveAsDraft}
                  >
                    {renderBtnContent(
                      !allChecked ? strings.SaveAsDraft : "Submit",
                      "saveAsDraft",
                      !allChecked ? "Saving..." : "Submitting...",
                    )}
                  </button>
                )}

                {!vis.ViewFlag &&
                  positionDetails.StatusID !=
                    StatusId.PendingHRpreonboardingchecklist && (
                    <button
                      type="button"
                      className="review-document__button review-document__button--primary"
                      disabled={isAnySubmitting}
                      onClick={handleApprove}
                    >
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

      <ViewCommentsModal
        isOpen={showComments}
        onClose={() => setshowComments(false)}
        comments={bgvComments}
        title="View BGV Comments"
        isLoading={false}
      />
    </>
  );
};