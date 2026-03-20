import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileCheck, History, Loader2, Send, X } from "lucide-react";
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
import { ValidationSummary } from "../Components/ValidationSummary";
import { MatricID, Nationality } from "../../../../utilities/ConditionConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import BGVerification from "../Components/BGVerification/BGVerification";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { RoleID } from "../../../../utilities/Config";
import { useUpdateMainRecord } from "./Hooks/SaveHooks/useUpdateMainRecord";
import { useHRLeadProcess } from "./Hooks/SaveHooks/useHRLeadProcess";
import { useHRProcess } from "./Hooks/SaveHooks/useHRProcess";
import { useToast } from "../../../Hooks/useToast";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { IDptData } from "../../../../services/RecruitmentTable/IRecruitmentService";
import { useNavigate } from "react-router-dom";

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
 const { toast, closeToast, showSuccess,showError,showWarning, showConfirm} = useToast();
  const { MatricID: metricId } = useUIState();
  const { roleIDs } = userInfo();
    const navigate = useNavigate();
  const { data: positionDetails, loading: positionLoading } = usePositionDetails(selectedJobId, selectedType);
  const { data: signatureDetails, loading: signatureLoading } = useSignatureDetails();

  const jobCodeId = positionDetails?.JobCodeId ?? 0;
  const jobCode = positionDetails?.JobCode ?? selectedJobCode;

  const { data: advertDetails, BGVValue: BGVData, handleBvgToggle: handleBvgToggle, loading: advertLoading } = useAdvertismentDetails(jobCodeId, { enabled: !!jobCodeId });
  const { data: attachments, loading: attachmentLoading } = useAttachmentDetails(jobCode, { enabled: !!jobCode });

  const isLoading = positionLoading || advertLoading || attachmentLoading || signatureLoading;

  const [uploadDocument, setUploadDocument] = useState<UploadedFile[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentValid = reviewerComments.trim().length > 0;
  const uploadValid = uploadDocument.length > 0;
  const checkboxValid = acknowledgementCheckbox;
  const canApprove = commentValid && uploadValid && checkboxValid;
 const roleID = roleIDs.includes(RoleID.LineManager,RoleID.HOD)? RoleID.LineManager : roleIDs[0]
 const document : IDocFiles[] = uploadDocument.map((item)=> {
  return {
     name: item.name,
  content: item.fileContent,
  type: "New"
  }
 })
 const formData:IDptData ={
  ID: positionDetails?.RecordID ?? 0,
  JobCodeId: positionDetails?.JobCodeId ?? 0,
  JobCode: positionDetails?.JobCode ?? "",
  JobTitleEnglish: positionDetails?.JobTitleEnglish ?? "",
  JobTitleFrench: positionDetails?.JobTitleFrench ?? "",
  DepartmentID: positionDetails?.DepartmentId ?? 0,
  Nationality: positionDetails?.Nationality ?? "",
  NumberOfPersonNeeded: positionDetails?.NumberOfPersonNeeded ?? "",
  Dptcode:positionDetails?.DepartmentCode ?? ""
 }
  const { updateMainRecord }    = useUpdateMainRecord(formData, roleID);
const { handleHRLeadProcess } = useHRLeadProcess(formData, RoleID.RecruitmentHRLead,document,BGVData.checkboxBGVOption);
const { handleHRProcess }     = useHRProcess(formData, RoleID.RecruitmentHR,document);


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
      title: positionDetails?.JobTitleEnglish ?? "",
      code: positionDetails?.JobCode ?? "",
      department: positionDetails?.Department ?? "",
    }),
    [positionDetails]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleApprove = useCallback(async () => {
    setShowValidation(true);
     if (isSubmitting) {
      return;
    }
    if (!canApprove && !bgvValid) {
      return;
    }
      setIsSubmitting(true);
    const finalize = (msg: string) => {
      showSuccess(msg);
       navigate("/RecruitmentTable");
    }
    if(roleIDs.includes(RoleID.RecruitmentHRLead)){
       if(metricId === MatricID.UploadONEM){
         await handleHRLeadProcess(finalize);
       }
     }else if(roleIDs.includes(RoleID.RecruitmentHR)){
      await handleHRProcess(finalize);

     } else if (roleIDs.includes(RoleID.HOD,RoleID.LineManager)){
        await updateMainRecord();
     }
       setIsSubmitting(false);
     
  }, [canApprove, bgvValid]);

    let mappedData: PositionDetails | null = null;
    if (positionDetails) {
      mappedData = {
        jobId: positionDetails.RecordID,
        jobTitle: positionDetails.JobTitleEnglish,
        jobCode: positionDetails.JobCode,
        department: positionDetails.Department,
        buCode: positionDetails.BusinessUnitCode,
        buName:  "sadasdasdasd",//data.BusinessUnitName,
        subDepartment: positionDetails.SubDepartment,
        section: positionDetails.Section,
        deptCode: positionDetails.DepartmentCode,
        // reportsTo: data.ReportsTo,
        areaOfWork: positionDetails.AreaofWork,
        nationality: positionDetails.Nationality,
        patersonGrade: positionDetails.PatersonGrade,
        drcGrade: positionDetails.DRCGrade,
        employmentCategory: positionDetails.EmploymentCategory,
        contractType: positionDetails.TypeOfContract,
        numberOfPersons: Number(positionDetails.NumberOfPersonNeeded),
        dateRequired: String(positionDetails.DateRequried),
        JobCodeID: positionDetails.JobCodeId,
      };
    }

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
              <PositionFramework positionDetails={mappedData} isLoading={isLoading} headerCode={headerMeta.code} />

              <AdvertLanguageToggle
                advertLanguage={advertLanguage}
                advertContent={advertContent}
                isLoading={isLoading}
                onLanguageChange={onLanguageChange}
              />

              <RequiredAttachments attachments={attachments} isLoading={isLoading} />

              {[
                MatricID.UploadONEM,
                MatricID.JobAdvert,
              ].includes(metricId)
                && (
                  <UploadDocument
                    multiple={false}
                    acceptedFormats={".pdf"}
                    label={metricId == MatricID.UploadONEM ? "Upload JobAdvert" : "Upload Advert"}
                    required={true}
                    onChange={(file: UploadedFile[]) => setUploadDocument(file)}
                  />
                )}


              {metricId == MatricID.UploadONEM && positionDetails?.Nationality === Nationality.Expatriate && (
                <div style={{ marginTop: "20px" }}>
                  <BGVerification
                    mandatoryChecks={BGVData.mantoryChecks}
                    VerificationChecks={BGVData.checkboxBGVOption}
                    onToggleOption={handleBvgToggle}
                  />
                </div>
              )}

              {metricId !== 0 &&
                [
                  MatricID.UploadONEM,
                  MatricID.JobAdvert,
                  MatricID.AdvertReviewHOD,
                  MatricID.AdvertReviewLM,
                ].includes(metricId) && (<>
                  <ReviewCommentSignature
                    reviewerComments={reviewerComments}
                    acknowledgementCheckbox={acknowledgementCheckbox}
                    signatureDetails={signatureDetails}
                    isLoading={isLoading}
                    onCommentsChange={onCommentsChange}
                    onToggleAcknowledgement={onToggleAcknowledgement}
                  />

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
                         {isSubmitting ? (
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
      )}
    </AnimatePresence>
  );
};
