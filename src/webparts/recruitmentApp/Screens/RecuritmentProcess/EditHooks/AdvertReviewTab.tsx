import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {  useMemo } from "react";
import PositionDetailsTab from "./PositionDetailsTab";
import { ColorCode, Nationality, Notes, RoleID, StatusId } from "../../../utilities/Config";
import CustomDatePicker from "../../../components/CustomDatePicker";
import { Attachment, CheckboxContent, labelNames } from "../../../utilities/LabelName";
import LabelHeaderComponents from "../../../components/TitleHeader";
import CustomViewDocument from "../../../components/CustomViewDocument";
import CustomLabel from "../../../components/CustomLabel";
import CustomTextArea from "../../../components/CustomTextArea";
import SignatureCheckbox from "../../../components/SignatureCheckbox";
import CustomSignature from "../../../components/CustomSignature";
import AttachmentButton from "../../../components/AttachmentButton";
import CustomViewAttachment from "../../../components/CustomViewAttachment";
import ReuseButton from "../../../components/ReuseButton";
import VerificationCard from "../VerificationCard/VerificationCard";
import { VrrFormHook } from "./useVrrFormState";

interface AdvertReviewTabProps {
  form: VrrFormHook;
  currentRoleID: number;
  stateValue: any;
  webURL: string;
  userDetails: any;
  props: any; 
  handleComments: () => void;
  handleAdvertClick: () => void;
}

const styles = {
  errorNote: {
    color: "red",
    marginTop: "8px",
    display: "block",
    fontFamily: "sans-serif",
    fontSize: "13px",
  },
  viewButton: {
     minWidth: "117px",
                              fontSize: "13px",
                              paddingBottom: "24px",
                              display: "flex",
                              flexDirection: "column",
                              height: "41px",
                              paddingTop: "23px",
                              backgroundColor:
                                ColorCode.ButtonColorCode.ButtonColor,
                              color: "white",
                              justifyContent: "center",
                              alignItems: "center",
  },
} as const;

const AdvertReviewTab: React.FC<AdvertReviewTabProps> = ({
  form,
  currentRoleID,
  stateValue,
  webURL,
  userDetails,
  props,
  handleComments,
  handleAdvertClick
}) => {
  
  const {
    formState,
    advDetails,
    validationErrors,
    handleDateChange,
    handleFormStateChange,
    isSignatureChecked,
    handlecheckChanges,
    // setSignatureChecked,
    handleInputChangeTextArea,
    handleFileAttachment, // Ensure these exist in useVrrFormState
    handleDelete,
    handleBvgToggle,
    bvgVerification,
  } = form;

  const user = userDetails?.[0] || {};
  const fullName = `${user.FirstName ?? ""} ${user.MiddleName ?? ""} ${user.LastName ?? ""}`.trim();

  const isHRLeadUploadState = useMemo(
    () =>
      currentRoleID === RoleID.RecruitmentHRLead &&
      stateValue?.StatusId === StatusId.PendingwithHRLeadtouploadONEMsigneddoc,
    [currentRoleID, stateValue?.StatusId]
  );

  const isReviewerRole = useMemo(() => {
    const status = stateValue?.StatusId;
    return (
      isHRLeadUploadState ||
      (currentRoleID === RoleID.HOD && status === StatusId.PendingwithHODtoreviewAdv) ||
      (currentRoleID === RoleID.LineManager && status === StatusId.PendingwithLineManagereviewAdv) || 
      (form.advDetails.JobcodeChecked && status === StatusId.PendingwithRecruitmentHRtouploadAdv)
    );
  }, [currentRoleID, stateValue?.StatusId, isHRLeadUploadState]);

  // useEffect(() => {
  //   if (!advDetails?.ValidFrom) {
  //     const today = new Date();
  //     const validTo = new Date();
  //     validTo.setDate(today.getDate() + 30);
  //     handleDateChange(today, "ValidFrom");
  //     handleDateChange(validTo, "ValidTo");
  //   }
  // }, [advDetails]);

  return (
    <Card variant="outlined" sx={{ boxShadow: "0px 7px 4px 3px #d3d3d3", borderRadius: "10px", mt: 2 }}>
      <CardContent>
        <PositionDetailsTab formState={formState} handleFormStateChange={handleFormStateChange} />

        {isHRLeadUploadState && (
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg3">
              <CustomDatePicker
                selectedDate={advDetails.ValidFrom}
                label={labelNames.PositionDetails.AdvertValidFrom}
                error={validationErrors.ValidFrom}
                disabled={true}
                onChange={(date) => handleDateChange(date, "ValidFrom")}
              />
            </div>
            <div className="ms-Grid-col ms-lg3">
              <CustomDatePicker
                selectedDate={advDetails.ValidTo}
                label={labelNames.PositionDetails.AdvertValidTo}
                disabled={true}
                onChange={(date) => handleDateChange(date, "ValidTo")}
                error={validationErrors.ValidTo}
              />
            </div>
          </div>
        )}

        <div className="ms-Grid-row" style={{ marginLeft: "0px" }}>
          <LabelHeaderComponents value={Attachment.Attachments} />
          {formState.RoleProfileDocument?.length === 0 && <p style={styles.errorNote}>Note:- {Notes.Roleprofile}</p>}
          {formState.GradingDocument?.length === 0 && <span style={styles.errorNote}>Note:- {Notes.Grding}</span>}
        </div>

        <div className="ms-Grid-row">
          {[
            { list: formState.RoleProfileDocument, label: Attachment.PositionDocument.RoleProfileDocuments },
            { list: formState.RoleProfileDocument_fr, label: Attachment.PositionDocument.RoleProfileDocuments_fr },
            { list: formState.GradingDocument, label: Attachment.PositionDocument.GradingDocuments },
            { list: formState.GradingDocument_fr, label: Attachment.PositionDocument.GradingDocuments_fr },
          ].map(
            (doc, idx) =>
              doc.list?.length > 0 && (
                <div key={idx} className="ms-Grid-col ms-lg3">
                  <CustomLabel value={doc.label} />
                  <CustomViewDocument Attachment={doc.list} webUrl={webURL} />
                </div>
              )
          )}
        </div>

        {!(currentRoleID === RoleID.RecruitmentHRLead && stateValue?.StatusId === StatusId.ReadyforRecruitmentProcess) && (
          <div className="ms-Grid-row">
            {/* Draft Advert Upload */}
            <div className="ms-Grid-col ms-lg4">
              <CustomLabel value={Attachment.PositionDocument.DraftONEMAdvertDocFrench} mandatory />
              {formState.AdvertisementDocument?.length > 0 ? (
                <CustomViewDocument Attachment={formState.AdvertisementDocument} webUrl={webURL} />
              ) : (
                <>
                  <AttachmentButton
                    label="Upload"
                    iconName="CloudUpload"
                     iconNameHover="CloudUpload"
                    allowMultiple={false}
                    AttachState={(newFiles: any) => {
                      const attachment = newFiles.map((item: any) => ({
                        name: item.name,
                        content: item.file,
                        type: "New",
                        url: item.Url,
                      }));
                      handleFileAttachment("AdvertisementAttachement", attachment);
                    }}
                    mandatory
                    error={validationErrors.AdvertisementAttachement}
                    fileformat=".pdf"
                     Style={{
                                backgroundColor:
                                  ColorCode.ButtonColorCode.ButtonColor,
                                color: "white",
                              }}
                  />
                  <CustomViewAttachment
                    Attachment={advDetails.AdvertisementAttachement ?? []}
                    StateValue="AdvertisementAttachement"
                    handleDelete={handleDelete}
                    webUrl={webURL}
                  />
                </>
              )}
            </div>

            {isHRLeadUploadState && (
              <div className="ms-Grid-col ms-lg4">
                <CustomLabel value={Attachment.PositionDocument.ONEMSignedStampedDocuments} mandatory />
                <AttachmentButton
                  label="Upload"
                  iconName="CloudUpload"
                   iconNameHover="CloudUpload"
                  allowMultiple={false}
                  AttachState={(newFiles: any) => {
                    const attachment = newFiles.map((item: any) => ({
                      name: item.name,
                      content: item.file,
                      type: "New",
                      url: item.Url,
                    }));
                    handleFileAttachment("OnamSignedStampsAttchment", attachment);
                  }}
                  mandatory
                  error={validationErrors.OnamSignedStampsAttchment}
                  fileformat=".pdf"
                   Style={{
                                backgroundColor:
                                  ColorCode.ButtonColorCode.ButtonColor,
                                color: "white",
                              }}
                />
                <CustomViewAttachment
                  Attachment={formState.OnamSignedStampsAttchment ?? []}
                  StateValue="OnamSignedStampsAttchment"
                  handleDelete={handleDelete}
                  webUrl={webURL}
                />
              </div>
            )}
          </div>
        )}

        {advDetails.JobcodeChecked && (
          <div className="ms-Grid-row" style={{ marginTop: "10px" }}>
            <div className="ms-Grid-col ms-lg3">
              <CustomLabel value={Attachment.PositionDocument.ViewJobAdvertisement} />
              <ReuseButton
                 Style={styles.viewButton}
                            label="VIEW"
                            imgSrc={require("../../../assets/viewSubmision-white.svg")}
                            imgSrcHover={require("../../../assets/viewSubmision-white.svg")}
                            imgAlt="View"
                            imgAltHover="Hovered View"
                            spacing={4}
                onClick={() => handleAdvertClick()}
              />
            </div>
            <div className="ms-Grid-col ms-lg3">
              <CustomLabel value={Attachment.PositionDocument.ViewComments} />
              <ReuseButton 
              
                            label="VIEW"
                            imgSrc={require("../../../assets/viewSubmision-white.svg")}
                            imgSrcHover={require("../../../assets/viewSubmision-white.svg")}
                            imgAlt="View"
                            imgAltHover="Hovered View"
                            Style={styles.viewButton}
                             spacing={4}
               onClick={() => handleComments()} 
               />
            </div>
          </div>
        )}

        {isHRLeadUploadState && formState.Nationality === Nationality.Expatriate && (
          <div style={{ marginTop: "20px" }}>
            <VerificationCard
              mandatoryChecks={bvgVerification.mantoryChecks}
              VerificationChecks={bvgVerification.checkboxBGVOption}
              onToggleOption={handleBvgToggle}
            />
            {validationErrors.BVGVerification && <p style={styles.errorNote}>Field is Required</p>}
          </div>
        )}

        {isReviewerRole && (
          <div style={{ marginTop: "20px" }}>
            <CustomTextArea
              label={labelNames.CommanLabel.Comments}
              value={formState.Comments}
              error={validationErrors.Comments}
              onChange={(v) => handleInputChangeTextArea(v, "Comments")}
              mandatory
            />
            <p style={styles.errorNote}>Note:- {Notes.ReviewRolePurpose}</p>

            <SignatureCheckbox
              label={isHRLeadUploadState ? CheckboxContent.UploadOnemDocument : CheckboxContent.ApprovalCheckbox}
              checked={isSignatureChecked}
              error={validationErrors.isSignatureChecked}
              onChange={(value) => handlecheckChanges(value,"isSignatureChecked")}
            />

            <CustomSignature
              Name={fullName}
              JobTitleInEnglish={user.JopTitleEnglish}
              JobTitleInFrench={user.JopTitleFrench}
              Department={user.DepartmentName}
              Date={formState.SignDate?.toString()}
              TermsAndCondition={isSignatureChecked}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvertReviewTab;