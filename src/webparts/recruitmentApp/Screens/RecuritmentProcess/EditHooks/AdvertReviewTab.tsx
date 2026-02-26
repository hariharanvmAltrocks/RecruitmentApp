import * as React from "react";
import { Card, CardContent } from "@mui/material";
import PositionDetailsTab from "./PositionDetailsTab";
import { Notes, RoleID, StatusId } from "../../../utilities/Config";
import CustomDatePicker from "../../../components/CustomDatePicker";
import {
  Attachment,
  CheckboxContent,
  labelNames,
} from "../../../utilities/LabelName";
import LabelHeaderComponents from "../../../components/TitleHeader";
import CustomViewDocument from "../../../components/CustomViewDocument";
import CustomLabel from "../../../components/CustomLabel";
import CustomTextArea from "../../../components/CustomTextArea";
import SignatureCheckbox from "../../../components/SignatureCheckbox";
import CustomSignature from "../../../components/CustomSignature";
import { VrrFormHook } from "./useVrrFormState";

interface AdvertReviewTabProps {
  form: VrrFormHook;
  currentRoleID: number;
  stateValue: any;
  webURL: string;
  userDetails: any;
}

const AdvertReviewTab: React.FC<AdvertReviewTabProps> = ({
  form,
  currentRoleID,
  stateValue,
  webURL,
  userDetails,
}) => {
  const user = userDetails?.[0] || {};
  const fullName =
    `${user.FirstName ?? ""} ${user.MiddleName ?? ""} ${user.LastName ?? ""}`.trim();

  const isHRLeadUploadState = React.useMemo(
    () =>
      currentRoleID === RoleID.RecruitmentHRLead &&
      stateValue?.StatusId === StatusId.PendingwithHRLeadtouploadONEMsigneddoc,
    [currentRoleID, stateValue?.StatusId],
  );
  const {
    formState,
    advDetails,
    validationErrors,
    handleDateChange,
    handleFormStateChange,
    isSignatureChecked,
    setSignatureChecked,
    handleInputChangeTextArea,
  } = form;
  return (
    <Card
      variant="outlined"
      sx={{
        boxShadow: "0px 7px 4px 3px #d3d3d3",
        borderRadius: "10px",
        mt: 2,
      }}
    >
      <CardContent>
        <PositionDetailsTab
          formState={formState}
          handleFormStateChange={handleFormStateChange}
        />

        {/* Date Section */}
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
        </div>

        <div className="ms-Grid-row" style={{ margin: "0%" }}>
          {formState.RoleProfileDocument.length === 0 && (
            <p style={styles.errorNote}>Note:- {Notes.Roleprofile}</p>
          )}
          {formState.GradingDocument.length === 0 && (
            <span style={styles.errorNote}>Note:- {Notes.Grding}</span>
          )}
        </div>

        <div className="ms-Grid-row">
          {[
            {
              list: formState.RoleProfileDocument,
              label: Attachment.PositionDocument.RoleProfileDocuments,
            },
            {
              list: formState.RoleProfileDocument_fr,
              label: Attachment.PositionDocument.RoleProfileDocuments_fr,
            },
            {
              list: formState.GradingDocument,
              label: Attachment.PositionDocument.GradingDocuments,
            },
            {
              list: formState.GradingDocument_fr,
              label: Attachment.PositionDocument.GradingDocuments_fr,
            },
          ].map(
            (doc, idx) =>
              doc.list.length > 0 && (
                <div key={idx} className="ms-Grid-col ms-lg3">
                  <div className="custom-document-column">
                    <CustomLabel value={doc.label} />
                    <div
                      className="document-wrapper"
                      title={
                        Array.isArray(doc.list) ? doc.list.join(", ") : doc.list
                      }
                    >
                      <CustomViewDocument
                        Attachment={doc.list}
                        webUrl={webURL}
                      />
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>

        {(isHRLeadUploadState ||
          (currentRoleID === RoleID.HOD &&
            stateValue?.StatusId === StatusId.PendingwithHODtoreviewAdv) ||
          (currentRoleID === RoleID.LineManager &&
            stateValue?.StatusId ===
              StatusId.PendingwithLineManagereviewAdv)) && (
          <>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12">
                <CustomTextArea
                  label={labelNames.CommanLabel.Comments}
                  value={formState.Comments}
                  error={validationErrors.Comments}
                  onChange={(v) => handleInputChangeTextArea(v, "Comments")}
                  mandatory={true}
                />
              </div>
            </div>
            <p style={styles.errorNote}>Note:- {Notes.ReviewRolePurpose}</p>

            <SignatureCheckbox
              label={
                isHRLeadUploadState
                  ? CheckboxContent.UploadOnemDocument
                  : CheckboxContent.ApprovalCheckbox
              }
              checked={isSignatureChecked}
              error={validationErrors.Checkboxalidation}
              onChange={(val) => setSignatureChecked(val)}
            />

            <CustomSignature
              Name={fullName}
              JobTitleInEnglish={user.JopTitleEnglish}
              JobTitleInFrench={user.JopTitleFrench}
              Department={user.DepartmentName}
              Date={formState.SignDate.toString()}
              TermsAndCondition={isSignatureChecked}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

const styles = {
  errorNote: {
    color: "red",
    marginTop: "8px",
    display: "block",
    fontFamily: "sans-serif",
    fontSize: "13px",
  },
} as const;

export default AdvertReviewTab;
