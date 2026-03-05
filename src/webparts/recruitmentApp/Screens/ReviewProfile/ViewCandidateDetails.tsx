import { Card, CardContent } from "@mui/material";
import { Label } from "office-ui-fabric-react";
import * as React from "react";
import CommanComments from "../../components/CommanComments";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import BreadcrumbsComponent from "../../components/CustomBreadcrumps";
import CustomLabel from "../../components/CustomLabel";
import CustomTextArea from "../../components/CustomTextArea";
import CustomViewDocument from "../../components/CustomViewDocument";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { TabName, InterviewLevels, Choices } from "../../utilities/Config";
import { Attachment, labelNames, ValidationAction } from "../../utilities/LabelName";
import EmployeeDetailsTooltip from "../ScreenComponent/EmployeeDetailsTooltip";
import ToolTipTable from "../ScreenComponent/ToolTipTable";
import ActionSection from "./hooks/Actionsection";
import CandidateInfoFields from "./hooks/Candidateinfofields";
import { ViewCandidateDetailsProps } from "./hooks/Candidatetypes";
import COISection from "./hooks/Coisection";
import { useViewCandidateDetails } from "./hooks/Useviewcandidatedetails";
import { InterviewScheduleCard } from "./InterviewScheduleCard";

const ViewCandidateDetails: React.FC<ViewCandidateDetailsProps> = (props) => {
  const h = useViewCandidateDetails(props);

  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 7px 4px 3px #d3d3d3", borderRadius: "10px", marginTop: "2%" }}
        >
          <CardContent>
            {/* ── Basic info grid ─────────────────────────────────── */}
            <CandidateInfoFields
              candidateProfile={h.candidateProfile}
              initialTab={props.stateValue?.initialTab}
              interviewLevels={h.interviewedLevel.Levels}
              interviewGrade={h.interviewedLevel.Grade}
            />

            {/* ── Willing to relocate / family / business links ──── */}
            {h.isReviewProfileTab && (
              <div style={{ padding: "1%" }}>
                <div className="ms-Grid-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Label style={{ marginTop: 10 }}>{labelNames.CandidateDetails.Willingrelocate}</Label>
                    <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "bold", fontSize: "17px", marginTop: "1%" }}>
                      {" "}- {h.candidateProfile.WillingToRelocate}
                    </span>
                  </div>
                </div>

                {h.candidateProfile.previouslyworkedMine && (
                  <div className="ms-Grid-row">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Label style={{ marginTop: 10 }}>{labelNames.CandidateDetails.previouslyworked}</Label>
                      <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "bold", fontSize: "17px", marginTop: "1%" }}>
                        {" "}- {h.candidateProfile.previouslyworkedMine}
                      </span>
                    </div>
                  </div>
                )}

                {/* Family links */}
                <div className="ms-Grid-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Label style={{ marginTop: 10 }}>{labelNames.CandidateDetails.existingemployees}</Label>
                    <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "bold", fontSize: "17px", marginTop: "1%" }}>
                      {" "}- {h.candidateProfile.familylinks}
                    </span>
                    {h.candidateProfile.familylinks === ValidationAction.Yes && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "124px", marginTop: "4%" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "default", fontWeight: "600" }}>
                          {Attachment.Attachments}
                          <EmployeeDetailsTooltip data={h.candidateProfile.employeeReferenceDetails} />:
                        </label>
                        <CustomViewDocument Attachment={h.candidateProfile.familyDocuments} webUrl={props.webURL} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Business links */}
                <div className="ms-Grid-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Label style={{ marginTop: 10 }}>{labelNames.CandidateDetails.businesslinks}</Label>
                    <span style={{ fontFamily: '"Roboto", sans-serif', fontWeight: "bold", fontSize: "17px", marginTop: "1%" }}>
                      {" "}- {h.candidateProfile.businesslinks}
                    </span>
                    {h.candidateProfile.businesslinks === ValidationAction.Yes && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "322px", marginTop: "12%" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "default", fontWeight: "600" }}>
                          {Attachment.Attachments}
                          <ToolTipTable
                            Title={labelNames.CandidateDetails.CompanyName}
                            dataValue={h.candidateProfile.businesslinkscompany}
                            headers={[]}
                            data={[]}
                          />
                        </label>
                        <CustomViewDocument Attachment={h.candidateProfile.businessDocuments} webUrl={props.webURL} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Interview schedule cards ─────────────────────────── */}
            {h.isAssignInterviewTab && (
              <div className="ms-Grid-row" style={{ marginTop: "2%" }}>
                <div className="ms-Grid-col ms-lg12">
                  <InterviewScheduleCard
                    label="Interview Level 1"
                    start={h.dateState.startDateL1}
                    end={h.dateState.endDateL1}
                    minDate={h.minDateInterview}
                    maxDate={h.maxDateInterview}
                    onDateChange={(s: any, e: any) => h.handleDateChange(s, e, InterviewLevels.Level1)}
                    DateValidationError={h.validationErrors.startDateL1}
                    panelValue={h.interviewedLevel.AssignInterviewLevel1}
                    panelOptions={h.interviewedLevel.AssignInterviewedLevel1Option}
                    onPanelChange={(val: any) => h.handleMultiSelect(val)}
                    panelError={h.validationErrors.AssignInterviewLevel1}
                    PanelDisabled={h.storedNoOfInterviewPanel.current}
                    DateDisable={h.level2Date}
                    CurrentNotes={!h.level2Date}
                  />
                </div>
              </div>
            )}

            {h.level2Date && (
              <div className="ms-Grid-row" style={{ marginTop: "2%", marginBottom: "2%" }}>
                <div className="ms-Grid-col ms-lg12">
                  <InterviewScheduleCard
                    label="Interview Level 2"
                    start={h.dateState.startDateL2}
                    end={h.dateState.endDateL2}
                    minDate={h.minDateInterview}
                    maxDate={h.maxDateInterview}
                    onDateChange={(s: any, e: any) => h.handleDateChange(s, e, InterviewLevels.Level2)}
                    DateValidationError={h.validationErrors.startDateL2}
                    panelValue={h.interviewedLevel.AssignInterviewedLevel2}
                    panelOptions={h.interviewedLevel.AssignInterviewedLevel1Option}
                    onPanelChange={(val: any) => h.handleMultiSelect(val)}
                    panelError={h.validationErrors.AssignInterviewLevel1}
                    PanelDisabled={h.storedNoOfInterviewPanel.current}
                    DateDisable={h.isViewMode}
                    CurrentNotes={!h.isViewMode}
                  />
                </div>
              </div>
            )}

            {/* ── Disability details ───────────────────────────────── */}
            {h.candidateProfile.disabilityReason && h.candidateProfile.disability === Choices.Yes && (
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg12">
                  <CustomTextArea
                    label={labelNames.CandidateDetails.DisabilityDetails}
                    value={h.candidateProfile.disabilityReason}
                    disabled mandatory={false} error={false}
                  />
                </div>
              </div>
            )}

            {/* ── Attachments ─────────────────────────────────────── */}
            <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
              <span style={{ fontWeight: "bold" }}>{Attachment.Attachments}</span>
            </div>
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg4">
                <CustomLabel value={Attachment.PositionDocument.CandidateResume} />
                <CustomViewDocument Attachment={h.candidateProfile.CandidateResume} webUrl={props.webURL} />
              </div>
            </div>

            {/* ── COI section ─────────────────────────────────────── */}
            {h.candidateProfile.ConflictsOfInterest === ValidationAction.Yes && h.isReviewProfileTab && (
              <COISection
                conflictsOfInterest={h.candidateProfile.ConflictsOfInterest}
                COIReason={h.interviewedLevel.COIReason}
                COIProfileLabel={h.interviewedLevel.COIProfileLabel}
                COIProfileLabelOption={h.interviewedLevel.COIProfileLabelOption}
                COIAttachment={h.interviewedLevel.COIAttachment}
                COIComments={h.interviewedLevel.COIComments}
                statusId={props.stateValue?.StatusId}
                validationErrors={{
                  COIProfileLabel: h.validationErrors.COIProfileLabel,
                  COIAttachment: h.validationErrors.COIAttachment,
                  COIComments: h.validationErrors.COIComments,
                }}
                webURL={props.webURL}
                onAutoComplete={h.handleAutoComplete}
                onDocumentUpload={h.handleDocument}
                onDelete={h.handleDelete}
                onCommentsChange={h.handleCOICommentsChange}
              />
            )}

            {/* ── Action section ───────────────────────────────────── */}
            <ActionSection
              candidateProfile={h.candidateProfile}
              interviewedLevel={h.interviewedLevel}
              actionValue={h.validationErrors}
              validationErrors={h.validationErrors}
              checkbox={h.checkbox}
              signDate={h.signDate}
              userDetails={props.userDetails}
              currentRoleID={props.CurrentRoleID}
              initialTab={props.stateValue?.initialTab}
              statusId={props.stateValue?.StatusId}
              buttonAction={props.stateValue?.ButtonAction}
              onRadioChange={h.handleRadioChange}
              onCommentsChange={h.handleCommentsChange}
              onCheckboxChange={h.handleCheckboxChange}
              onAutoComplete={h.handleAutoComplete}
              onViewComments={() => h.setMainComponent(false)}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <>
      {h.mainComponent ? (
        <CustomLoader isLoading={h.isLoading}>
          <div className="menu-card">
            <BreadcrumbsComponent
              items={tabs}
              initialItem={h.activeTab}
              TabName={h.tabNameData}
              onBreadcrumbChange={h.setActiveTab}
              handleCancel={h.handleCancel}
              JobValue={{
                JobTitle: h.candidateProfile.JobTitle ?? "",
                JobCode: h.candidateProfile.JobCode,
                Status: h.candidateProfile.Status,
              }}
              Agencies={h.candidateProfile.Agencies}
              additionalButtons={h.getAdditionalButtons()}
            />
          </div>
        </CustomLoader>
      ) : (
        <CommanComments
          onClose={() => {
            h.setMainComponent(true);
            h.setActiveTab(h.activeTab);
          }}
          Comments={h.candidateProfile.Comments}
        />
      )}

      {h.alertPopupOpen && (
        <CustomAlert
          {...h.alertProps}
          onClose={() => h.setAlertPopupOpen(false)}
          ButtonAction={h.alertProps.ButtonAction || (() => {})}
        />
      )}
    </>
  );
};

export default ViewCandidateDetails;