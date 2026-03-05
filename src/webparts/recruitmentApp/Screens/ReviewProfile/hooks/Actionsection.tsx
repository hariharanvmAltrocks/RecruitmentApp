import * as React from "react";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import CustomInput from "../../../components/CustomInput";
import CustomLabel from "../../../components/CustomLabel";
import CustomRadioGroup from "../../../components/CustomRadioGroup";
import CustomSignature from "../../../components/CustomSignature";
import CustomTextArea from "../../../components/CustomTextArea";
import ReuseButton from "../../../components/ReuseButton";
import SignatureCheckbox from "../../../components/SignatureCheckbox";
import { TabName, RoleID, workflowStatusApi, StatusId, ProfileReviewl2, ProfileReview, ColorCode } from "../../../utilities/Config";
import { Attachment, ButtonAction, CheckboxContent, labelNames } from "../../../utilities/LabelName";
import { ValidationErrorState, AutoCompleteItem } from "./Candidatetypes";

interface Props {
  candidateProfile: any;
  interviewedLevel: any;
  actionValue: any;
  validationErrors: ValidationErrorState;
  checkbox: boolean;
  signDate: Date;
  userDetails: any[];
  currentRoleID: number[];
  initialTab: string;
  statusId: string | number;
  buttonAction: string;
  onRadioChange: (val: string) => void;
  onCommentsChange: (val: string) => void;
  onCheckboxChange: (val: boolean) => void;
  onAutoComplete: (val: AutoCompleteItem | null, field: string) => void;
  onViewComments: () => void;
}

const ActionSection: React.FC<Props> = React.memo(
  ({
    candidateProfile,
    interviewedLevel,
    actionValue,
    validationErrors,
    checkbox,
    signDate,
    userDetails,
    currentRoleID,
    initialTab,
    statusId,
    buttonAction,
    onRadioChange,
    onCommentsChange,
    onCheckboxChange,
    onAutoComplete,
    onViewComments,
  }) => {
    const isReviewProfile = initialTab === TabName.ReviewProfile;
    const isViewMode = buttonAction === ButtonAction.View;
    const isHR = currentRoleID.includes(RoleID.RecruitmentHR);
    const isLM = currentRoleID.includes(RoleID.LineManager);

    const isLevel2Status = statusId === workflowStatusApi.LineManagerL2Pending;

    const checkboxLabel =
      isReviewProfile
        ? CheckboxContent.ReviewedCandidate
        : statusId === StatusId.InterviewScheduledforLevel2
          ? CheckboxContent.RescheduleInterview
          : CheckboxContent.InterviewPanel;

    const userName = [
      userDetails[0]?.FirstName ?? "",
      userDetails[0]?.MiddleName ?? "",
      userDetails[0]?.LastName ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <>
        {/* LM: Candidate fit radio (edit mode only) */}
        {isReviewProfile && buttonAction === ButtonAction.Edit && isLM && (
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg5">
              <CustomRadioGroup
                label={
                  isLevel2Status
                    ? labelNames.CandidateDetails.Level2CandidateLabel
                    : labelNames.CandidateDetails.Level1CandidateLabel
                }
                value={actionValue.CandidateStatus}
                options={isLevel2Status ? ProfileReviewl2 : ProfileReview}
                error={validationErrors.CandidateStatus}
                mandatory={true}
                onChange={onRadioChange}
                disabled={isViewMode}
              />
            </div>
          </div>
        )}

        {/* HR: Review profile feedback dropdown (edit mode) */}
        {isReviewProfile && isHR && !isViewMode && (
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg4">
              <CustomAutoComplete
                label={labelNames.CandidateDetails.ReviewProfileFeedback}
                options={interviewedLevel.CandidateScoreOption}
                value={interviewedLevel.CandidateScoreValue}
                disabled={isViewMode}
                mandatory={true}
                onChange={(item) => onAutoComplete(item, "CandidateScoreValue")}
                error={validationErrors.CandidateScoreValue}
              />
            </div>
          </div>
        )}

        {/* HR: Review profile feedback (view mode) */}
        {isReviewProfile && isHR && isViewMode && (
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg4">
              <CustomInput
                label={labelNames.CandidateDetails.ReviewProfileFeedback}
                value={candidateProfile.hrComments}
                disabled
              />
            </div>
          </div>
        )}

        {/* LM: HR feedback read-only */}
        {isReviewProfile && isLM && candidateProfile.Agencies !== "RecruitmentHR" && (
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg4">
              <CustomInput
                label={labelNames.CandidateDetails.ReviewProfileFeedback}
                value={candidateProfile.hrComments}
                disabled
              />
            </div>
          </div>
        )}

        {/* View Comments button */}
        {candidateProfile.Comments.length > 0 && (
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg4">
              <CustomLabel value={Attachment.PositionDocument.ViewComments} />
              <ReuseButton
                Style={{
                  minWidth: "117px",
                  fontSize: "13px",
                  paddingBottom: "24px",
                  display: "flex",
                  flexDirection: "column",
                  height: "41px",
                  paddingTop: "23px",
                  backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                label="VIEW"
                imgSrc={require("../../../assets/viewSubmision-white.svg")}
                imgSrcHover={require("../../../assets/viewSubmision-white.svg")}
                imgAlt="View"
                imgAltHover="Hovered View"
                onClick={onViewComments}
                spacing={4}
              />
            </div>
          </div>
        )}

        {/* Edit mode: comments + checkbox + signature */}
        {!isViewMode && (
          <>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12" style={{ marginBottom: "7px" }}>
                <CustomTextArea
                  label={labelNames.CommanLabel.Comments}
                  value={actionValue.Comments}
                  error={validationErrors.Comments}
                  onChange={onCommentsChange}
                  mandatory={true}
                />
              </div>
            </div>

            <div className="ms-Grid-row" style={{ padding: "3px", marginTop: "20px", marginBottom: "-33px" }}>
              <div className="ms-Grid-col ms-lg12">
                <SignatureCheckbox
                  label={checkboxLabel}
                  checked={checkbox}
                  error={validationErrors.Checkboxalidation}
                  onChange={onCheckboxChange}
                />
              </div>
            </div>

            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12">
                <CustomSignature
                  Name={userName}
                  JobTitleInEnglish={userDetails[0]?.JopTitleEnglish}
                  JobTitleInFrench={userDetails[0]?.JopTitleFrench}
                  Department={userDetails[0]?.DepartmentName}
                  Date={String(signDate)}
                  TermsAndCondition={checkbox}
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  },
);

ActionSection.displayName = "ActionSection";
export default ActionSection;