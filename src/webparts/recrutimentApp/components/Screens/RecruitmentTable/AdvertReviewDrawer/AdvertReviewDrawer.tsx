import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileCheck, History, X } from "lucide-react";
import { usePositionDetails } from "./Hooks/getPositionDetails";
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
import { ValidationSummary } from "../Components/ValidationSummary";
import { MatricID, Nationality } from "../../../../utilities/ConditionConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import BGVerification from "../Components/BGVerification/BGVerification";

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
}

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({ width = "100%", height = "14px" }) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

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
}) => {

  const {MatricID} = useUIState();
  const { data: positionDetails,  loading: positionLoading } = usePositionDetails(selectedJobId, selectedType);
  const { data: signatureDetails, loading: signatureLoading } = useSignatureDetails();

  const jobCodeId = positionDetails?.JobCodeID ?? 0;
  const jobCode = positionDetails?.jobCode ?? selectedJobCode;

  const { data: advertDetails,BGVValue: BGVData,handleBvgToggle: handleBvgToggle, loading: advertLoading } = useAdvertismentDetails(jobCodeId, { enabled: !!jobCodeId });
  const { data: attachments, loading: attachmentLoading } = useAttachmentDetails(jobCode, { enabled: !!jobCode });

  const isLoading = positionLoading || advertLoading || attachmentLoading || signatureLoading;

  const [uploadDocument, setUploadDocument] = useState<UploadedFile[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const commentValid = reviewerComments.trim().length > 0;
  const uploadValid = uploadDocument.length > 0;
  const checkboxValid = acknowledgementCheckbox;
  const canApprove = commentValid && uploadValid && checkboxValid;


  const mandatoryValid =
  Array.isArray(BGVData.mantoryChecks) &&
  BGVData.mantoryChecks.length > 0 &&
  BGVData.mantoryChecks.every((c) => c.checked);

const optionValid =
  Array.isArray(BGVData.checkboxBGVOption) &&
  BGVData.checkboxBGVOption.some((o) => o.checked);

const bgvValid = mandatoryValid && optionValid; 


  useEffect(() => {
    if (loadingState !== isLoading) {
      setLoadingState(isLoading);
    }
  }, [isLoading, loadingState, setLoadingState]);

  const advertContent = useMemo(() => {
    if (!advertDetails) {
      return null;
    }

    return advertLanguage === "EN" ? advertDetails.english : advertDetails.french;
  }, [advertDetails, advertLanguage]);

  const headerMeta = useMemo(
    () => ({
      title: positionDetails?.jobTitle ?? "",
      code: positionDetails?.jobCode ?? "",
      department: positionDetails?.department ?? "",
    }),
    [positionDetails]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleApprove = useCallback(() => {
    setShowValidation(true);
    if (!canApprove && !bgvValid ) {
      return;
    }

    // TODO: Add approve action here
  }, [canApprove]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="advert-review-drawer">
          <motion.div
            className="advert-review-drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="advert-review-drawer__panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
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

              <button type="button" className="advert-review-drawer__close" onClick={handleClose}>
                <X size={18} />
              </button>
            </div>

            <div className="advert-review-drawer__content">
              <PositionFramework positionDetails={positionDetails} isLoading={isLoading} headerCode={headerMeta.code} />

              <AdvertLanguageToggle
                advertLanguage={advertLanguage}
                advertContent={advertContent}
                isLoading={isLoading}
                onLanguageChange={onLanguageChange}
              />

              <RequiredAttachments attachments={attachments} isLoading={isLoading} />

              <UploadDocument
                multiple={false}
                acceptedFormats={".pdf"}
                label={"Upload JobAdvert"}
                required={true}
                onChange={(file: UploadedFile[]) => setUploadDocument(file)}
              />

               {MatricID == 2 && positionDetails?.nationality === Nationality.Expatriate && (
          <div style={{ marginTop: "20px" }}>
            <BGVerification
              mandatoryChecks={BGVData.mantoryChecks}
              VerificationChecks={BGVData.checkboxBGVOption}
              onToggleOption={handleBvgToggle}
            />
          </div>
        )}

              <ReviewCommentSignature
                reviewerComments={reviewerComments}
                acknowledgementCheckbox={acknowledgementCheckbox}
                signatureDetails={signatureDetails}
                isLoading={isLoading}
                onCommentsChange={onCommentsChange}
                onToggleAcknowledgement={onToggleAcknowledgement}
              />
            </div>

             <ValidationSummary
              show={showValidation && !canApprove}
              messages={[
                { key: "upload", text: "Upload document is required.", valid: uploadValid },
                { key: "comment", text: "Reviewer comment is required.", valid: commentValid },
                { key: "checkbox", text: "Please acknowledge before approving.", valid: checkboxValid },
                { key: "BGVVerification", text: "Please Choose the BGV Verification", valid: optionValid }
              ]}
            />


            <div className="advert-review-drawer__footer">
              <button type="button" className="advert-review-drawer__history" title="View History">
                <History size={18} />
              </button>
              <div className="advert-review-drawer__footer-actions">
                <button type="button" className="advert-review-drawer__button" onClick={handleClose}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={`advert-review-drawer__button advert-review-drawer__button--primary ${canApprove ? "" : "is-disabled"}`.trim()}
                  disabled={isLoading}
                  onClick={handleApprove}
                >
                  <CheckCircle2 size={16} />
                  Approve Advert
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
