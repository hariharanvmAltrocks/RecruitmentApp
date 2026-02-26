import * as React from "react";
import { Card, CardContent, Box, Tabs, Tab } from "@mui/material";
import { a11yProps, CustomTabPanel } from "../../../components/TabMerge";
import { UploadAdvertisement } from "../../ScreenComponent/UploadAdvertisement";
import { MasterData } from "../../../Models/Master";
import { VrrFormHook } from "./useVrrFormState";
import CustomTextArea from "../../../components/CustomTextArea";
import {
  Attachment,
  CheckboxContent,
  labelNames,
} from "../../../utilities/LabelName";
import SignatureCheckbox from "../../../components/SignatureCheckbox";
import { ColorCode, Notes, RoleID, StatusId } from "../../../utilities/Config";
import CustomLabel from "../../../components/CustomLabel";
import ReuseButton from "../../../components/ReuseButton";
import CustomSignature from "../../../components/CustomSignature";

interface AdvertisementDetailsTabProps {
  form: VrrFormHook;
  MasterData: MasterData;
  advTab: number;
  setAdvTab: React.Dispatch<React.SetStateAction<number>>;
  currentRoleID: number;
  stateValue: any;
  webURL: string;
  userDetails: any;
  handleComments: () => void;
}

const AdvertisementDetailsTab: React.FC<AdvertisementDetailsTabProps> = ({
  form,
  MasterData,
  advTab,
  setAdvTab,
  currentRoleID,
  stateValue,
  webURL,
  userDetails,
  handleComments,
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setAdvTab(newValue);
  };

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
    validationErrors,
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
        marginTop: "2%",
      }}
    >
      <CardContent>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={advTab}
              onChange={handleChange}
              aria-label="language tabs"
              TabIndicatorProps={{ style: { display: "none" } }}
            >
              <Tab label="English" {...a11yProps(0)} />
              <Tab label="French" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={advTab} index={0}>
            <UploadAdvertisement
              advDetails={form.advDetails}
              validationErrors={form.validationErrors}
              IsEnglish={true}
              handleFileAttachment={form.handleFileAttachment}
              handleRichTextEditor={(value, field) =>
                form.handleRichTextEditor(value, field, advTab)
              }
              handleAutoComplete={(item, field) =>
                form.handleAutoComplete(item, field, advTab)
              }
              handleDeleteRow={(index, type) =>
                form.handleDeleteRow(type as "role" | "skill", index)
              }
              handleMulitiSelect={form.handleMulitiSelect}
              handleInputChange={form.handleInputChange}
              handleDelete={form.handleDelete}
              handleAutoCompleterow={form.handleAutoCompleterow}
              handleAddRow={form.handleAddRow}
              InvaildSelection={false}
              qualificationValue={form.qualificationValue}
              TechnicalSkillValue={form.technicalSkillValue}
              RoleSpeKnowledgeValue={form.roleSpeKnowledgeValue}
              setAdvDetails={setAdvTab}
              MasterData={MasterData}
            />
          </CustomTabPanel>
          <CustomTabPanel value={advTab} index={1}>
            <UploadAdvertisement
              advDetails={form.advDetails}
              validationErrors={form.validationErrors}
              IsEnglish={true}
              handleFileAttachment={form.handleFileAttachment}
              handleRichTextEditor={(value, field) =>
                form.handleRichTextEditor(value, field, advTab)
              }
              handleAutoComplete={(item, field) =>
                form.handleAutoComplete(item, field, advTab)
              }
              handleDeleteRow={(index, type) =>
                form.handleDeleteRow(type as "role" | "skill", index)
              }
              handleMulitiSelect={form.handleMulitiSelect}
              handleInputChange={form.handleInputChange}
              handleDelete={form.handleDelete}
              handleAutoCompleterow={form.handleAutoCompleterow}
              handleAddRow={form.handleAddRow}
              InvaildSelection={false}
              qualificationValue={form.qualificationValue}
              TechnicalSkillValue={form.technicalSkillValue}
              RoleSpeKnowledgeValue={form.roleSpeKnowledgeValue}
              setAdvDetails={setAdvTab}
              MasterData={MasterData}
            />
          </CustomTabPanel>
        </Box>
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
          imgSrc={require("../../assets/viewSubmision-white.svg")}
          imgSrcHover={require("../../assets/viewSubmision-white.svg")}
          imgAlt="View"
          imgAltHover="Hovered View"
          onClick={() => handleComments()}
          spacing={4}
        />

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

export default AdvertisementDetailsTab;
