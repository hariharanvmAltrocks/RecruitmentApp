import * as React from "react";
import {
  AdvDetails,
  QualificationValue,
  RoleSpecKnowledge,
  TechnicalSkills,
} from "../../Models/RecuritmentVRR";
import CustomLabel from "../../components/CustomLabel";
import AttachmentButton from "../../components/AttachmentButton";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import { formValidationEdit } from "../RecuritmentProcess/ApprovedVRREdit";
import RichTextEditor from "../../components/CustomRichTextEditor";
import { Icon, Label } from "office-ui-fabric-react";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import CustomButton from "../../components/CustomButton";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomInput from "../../components/CustomInput";
import ReuseButton from "../../components/ReuseButton";
import {
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  RoleDescription,
  RoleDescriptionData,
} from "../../utilities/Config";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
} from "../../Services/ServiceExport";
import { category, UpsertMasters } from "../../Models/ApIInterface";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomLoader from "../../Services/Loader/CustomLoader";
import LabelHeaderComponents from "../../components/TitleHeader";
import CustomDialogbox from "../../components/CustomDialogbox";
import IsValid from "../../components/Validation";

type ValidationErrors = {
  QualificationValue: boolean;
  MasterDataValue: boolean;
};
interface AssignPositionDialogProps {
  advDetails: AdvDetails;
  validationErrors: formValidationEdit;
  handleFileAttachment: (type: string, item: IDocFiles[]) => void;
  handleRichTextEditor: (item: string, type: string) => void;
  handleAutoComplete: (item: AutoCompleteItem | null, type: string) => void;
  handleMulitiSelect: (item: AutoCompleteItem[], type: string) => void;
  handleDelete: (index: number, type: string) => void;
  handleAutoCompleterow: (
    item: AutoCompleteItem | null,
    key: string,
    index: number,
    type: string
  ) => void;
  handleAddRow: (type: string, index: number) => void;
  handleDeleteRow: (index: number, type: string) => void;
  InvaildSelection: boolean;
  qualificationValue: QualificationValue;
  TechnicalSkillValue: TechnicalSkills[];
  RoleSpeKnowledgeValue: RoleSpecKnowledge[];
  setAdvDetails: React.Dispatch<React.SetStateAction<AdvDetails>>;
}

export const UploadAdvertisement = ({
  advDetails,
  validationErrors,
  handleFileAttachment,
  handleRichTextEditor,
  handleAutoComplete,
  handleMulitiSelect,
  InvaildSelection,
  handleDelete,
  handleAutoCompleterow,
  handleAddRow,
  qualificationValue,
  TechnicalSkillValue,
  RoleSpeKnowledgeValue,
  handleDeleteRow,
  setAdvDetails,
}: AssignPositionDialogProps) => {
  const [showQualificationInput, setShowQualificationInput] =
    React.useState(false);
  //   const todaydate = new Date();
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [AddQualifbtn, setAddQualifbtn] = React.useState<boolean>(false);
  const [HeaderValue, setHeaderValue] = React.useState<string>("");
  const [LabelValue, setLabelValue] = React.useState<string>("");
  const [masterAddQuali, setMasterAddQuali] = React.useState<string>("");
  const [masterdataValue, setmasterdataValue] = React.useState<string>("");
  const [validationError, setValidationErrors] =
    React.useState<ValidationErrors>({
      QualificationValue: false,
      MasterDataValue: false,
    });

  React.useEffect(() => {
    const MasterDataOption = async () => {
      // Fetch Qualification data
      const Qualification = await CommonServices.GetMasterData(
        ListNames.HRMSQualification
      );
      // const QualificationOption: AutoCompleteItem[] = Qualification.data.map((item: any) => ({
      //     key: item.Code,
      //     text: item.Qualification,
      // }));
      const QualificationOption = Qualification.data
        .filter(
          (qualItem) =>
            !qualificationValue.MinQualification.some(
              (minQual) => minQual.key === qualItem.QualificationCode
            )
        )
        .map((item) => ({
          key: item.QualificationCode,
          text: item.Qualification,
        }));
      const PrefeQualificationOption: AutoCompleteItem[] = Qualification.data
        .filter(
          (Qualitem) =>
            // !QualificationValue.some((item) => item.MinQualification.key === Qualitem.QualificationCode)
            !qualificationValue.MinQualification.some(
              (item) => item.key === Qualitem.QualificationCode
            )
        )
        .map((item: any) => ({
          key: item.QualificationCode,
          text: item.Qualification,
        }));

      // Fetch RoleSpecificKnowledge data
      const RoleSpecificKnowlege = await CommonServices.GetMasterData(
        ListNames.HRMSRoleSpecificKnowlegeMaster
      );
      const RoleSpecificKnowlegeOption: AutoCompleteItem[] =
        RoleSpecificKnowlege.data.map((item: any) => ({
          key: item.Code,
          text: item.RoleSpecificKnowledge,
        }));

      // Fetch TechnicalSkills data
      const TechnicalSkills = await CommonServices.GetMasterData(
        ListNames.HRMSTechnicalSkills
      );
      const TechnicalSkillsOption: AutoCompleteItem[] =
        TechnicalSkills.data.map((item: any) => ({
          key: item.Code,
          text: item.TechnicalSkills,
        }));

      // Fetch LevelOfProficiency data
      const LevelOfProficiency = await CommonServices.GetMasterData(
        ListNames.HRMSLevelOfProficiency
      );
      const LevelOfProficiencyOption: AutoCompleteItem[] =
        LevelOfProficiency.data.map((item: any) => ({
          key: item.Code,
          text: item.Levels,
        }));

      const YearofExperiance = await CommonServices.GetMasterData(
        ListNames.HRMSExperienceMaster
      );
      const YearofExperianceOption: AutoCompleteItem[] =
        YearofExperiance.data.map((item: any) => ({
          key: item.Id,
          text: item.ExperienceInYearRange,
        }));

      const ExperienceinMiningOption: AutoCompleteItem[] =
        YearofExperiance.data.map((item: any) => ({
          key: item.Id,
          text: item.ExperienceInYearRange,
        }));

      const JobTitleFunctionType = await CommonServices.GetMasterData(
        ListNames.HRMSJobTitleFunctionType
      );
      const JobTitleFunctionTypeOption: AutoCompleteItem[] =
        JobTitleFunctionType.data.map((item: any) => ({
          key: item.Id,
          text: item.FunctionType,
        }));

      setAdvDetails((prevState: any) => ({
        ...prevState,
        MinQualificationOption: QualificationOption,
        PrefeQualificationOption: PrefeQualificationOption,
        RoleSpeKnowledgeoption: RoleSpecificKnowlegeOption,
        TechnicalSkillsOption: TechnicalSkillsOption,
        LevelProficiencyOption: LevelOfProficiencyOption,
        RequiredLeveloption: LevelOfProficiencyOption,
        TotalExperienceOption: YearofExperianceOption,
        ExperienceinMiningIndustryOption: ExperienceinMiningOption,
        JobFunctionalTypeOption: JobTitleFunctionTypeOption,
      }));
    };

    void MasterDataOption();
  }, [AddQualifbtn, masterAddQuali, masterdataValue]);

  const AddMasterData_fn = (Header: string, LabelValue: string) => {
    setAddQualifbtn(true);
    setHeaderValue(Header);
    setLabelValue(LabelValue);
  };

  const handlemasterValue = (value: string, type: string) => {
    if (type === "masterdataValue") {
      setmasterdataValue(value);
      setValidationErrors((prevState) => ({
        ...prevState,
        MasterDataValue: false,
      }));
    } else {
      setMasterAddQuali(value);
      setValidationErrors((prevState) => ({
        ...prevState,
        QualificationValue: false,
      }));
    }
  };

  const onclickClose = () => {
    setValidationErrors((prevState) => ({
      ...prevState,
      MasterDataValue: false,
    }));
    setAddQualifbtn(false);
    setmasterdataValue("");
    setValidationErrors((prevState) => ({
      ...prevState,
      MasterDataValue: false,
    }));
  };

  async function InsertMasterData(Value: string) {
    let IsVaild;
    if (Value === RoleDescriptionData.Qualification) {
      const Vaildation = IsValid(masterAddQuali);
      // const Valid = !Vaildation;
      setValidationErrors((prevState) => ({
        ...prevState,
        QualificationValue: !Vaildation,
      }));
      IsVaild = Vaildation;
    } else {
      const Vaildation = IsValid(masterdataValue);
      // const Valid = !isValids;
      setValidationErrors((prevState) => ({
        ...prevState,
        MasterDataValue: !Vaildation,
      }));
      IsVaild = Vaildation;
    }
    if (IsVaild) {
      let MasterData;
      switch (Value) {
        case RoleDescriptionData.Qualification:
          {
            let filterConditions = [
              {
                FilterKey: "Category",
                Operator: "eq",
                FilterValue: RoleDescriptionData.Qualification,
              },
            ];
            const CategoryData = await getVRRDetails.GetFilterInCategory(
              filterConditions
            );
            let category: category = {
              id: Number(CategoryData.data[0]?.CategoryCode),
              name: CategoryData.data[0]?.Category,
            };
            let AgentDetailsList: UpsertMasters[] = [
              {
                displayText: masterAddQuali,
                displayText_fr: masterAddQuali,
                category: category,
              },
            ];

            console.log(AgentDetailsList, "AgentDetailsList");

            await GetPortalJobsService.UpsertMaster(AgentDetailsList).then(
              async (res) => {
                console.log(res, "res");
                if (res.status === 200) {
                  MasterData = {
                    Qualification: res.data.data[0].displayText,
                    QualificationCode: res.data.data[0].value,
                  };
                  await getVRRDetails.InsertList(
                    MasterData,
                    ListNames.HRMSQualification
                  );
                  let SuccessMsg = {
                    Message: RecuritmentHRMsg.AddedMsg,
                    Type: HRMSAlertOptions.Success,
                    visible: true,
                    ButtonAction: async (userClickedOK: boolean) => {
                      if (userClickedOK) {
                        setAlertPopupOpen(false);
                      } else {
                        setAlertPopupOpen(false);
                      }
                    },
                  };

                  setAlertPopupOpen(true);
                  setalertProps(SuccessMsg);
                  setIsLoading(false);
                } else {
                  let APIError = {
                    Message: RecuritmentHRMsg.APIErrorMsg,
                    Type: HRMSAlertOptions.Error,
                    visible: true,
                    ButtonAction: async (userClickedOK: boolean) => {
                      if (userClickedOK) {
                        setAlertPopupOpen(false);
                      } else {
                        setAlertPopupOpen(false);
                      }
                    },
                  };

                  setAlertPopupOpen(true);
                  setalertProps(APIError);
                  setIsLoading(false);
                }
              }
            );
          }
          break;
        case RoleDescriptionData.RoleSpeKnowledge:
          {
            let filterConditions = [
              {
                FilterKey: "Category",
                Operator: "eq",
                FilterValue: RoleDescriptionData.Qualification,
              },
            ];
            const CategoryData = await getVRRDetails.GetFilterInCategory(
              filterConditions
            );
            let category: category = {
              id: Number(CategoryData.data[0]?.CategoryCode),
              name: CategoryData.data[0]?.Category,
            };
            let AgentDetailsList: UpsertMasters[] = [
              {
                displayText: masterdataValue,
                displayText_fr: masterdataValue,
                category: category,
              },
            ];

            console.log(AgentDetailsList, "AgentDetailsList");

            await GetPortalJobsService.UpsertMaster(AgentDetailsList).then(
              async (res) => {
                console.log(res, "res");
                if (res.status === 200) {
                  MasterData = {
                    RoleSpecificKnowledge: res.data.data[0].displayText,
                    Code: res.data.data[0].value,
                  };
                  await getVRRDetails.InsertList(
                    MasterData,
                    ListNames.HRMSRoleSpecificKnowlegeMaster
                  );
                  let SuccessMsg = {
                    Message: RecuritmentHRMsg.AddedMsg,
                    Type: HRMSAlertOptions.Success,
                    visible: true,
                    ButtonAction: async (userClickedOK: boolean) => {
                      if (userClickedOK) {
                        setAlertPopupOpen(false);
                      } else {
                        setAlertPopupOpen(false);
                      }
                    },
                  };
                  setAlertPopupOpen(true);
                  setalertProps(SuccessMsg);
                  setIsLoading(false);
                } else {
                  let APIError = {
                    Message: RecuritmentHRMsg.APIErrorMsg,
                    Type: HRMSAlertOptions.Error,
                    visible: true,
                    ButtonAction: async (userClickedOK: boolean) => {
                      if (userClickedOK) {
                        setAlertPopupOpen(false);
                      } else {
                        setAlertPopupOpen(false);
                      }
                    },
                  };

                  setAlertPopupOpen(true);
                  setalertProps(APIError);
                  setIsLoading(false);
                }
              }
            );
          }
          break;
        case RoleDescriptionData.TechnicalSkill:
          {
            let filterConditions = [
              {
                FilterKey: "Category",
                Operator: "eq",
                FilterValue: RoleDescriptionData.Qualification,
              },
            ];
            const CategoryData = await getVRRDetails.GetFilterInCategory(
              filterConditions
            );
            let category: category = {
              id: Number(CategoryData.data[0]?.CategoryCode),
              name: CategoryData.data[0]?.Category,
            };
            let AgentDetailsList: UpsertMasters[] = [
              {
                displayText: masterdataValue,
                displayText_fr: masterdataValue,
                category: category,
              },
            ];

            console.log(AgentDetailsList, "AgentDetailsList");

            await GetPortalJobsService.UpsertMaster(AgentDetailsList).then(
              async (res) => {
                console.log(res, "res");
                if (res.status === 200) {
                  MasterData = {
                    TechnicalSkills: res.data.data[0].displayText,
                    Code: res.data.data[0].value,
                  };
                  await getVRRDetails.InsertList(
                    MasterData,
                    ListNames.HRMSTechnicalSkills
                  );
                  let SuccessMsg = {
                    Message: RecuritmentHRMsg.AddedMsg,
                    Type: HRMSAlertOptions.Success,
                    visible: true,
                    ButtonAction: async (userClickedOK: boolean) => {
                      if (userClickedOK) {
                        setAlertPopupOpen(false);
                      } else {
                        setAlertPopupOpen(false);
                      }
                    },
                  };
                  setAlertPopupOpen(true);
                  setalertProps(SuccessMsg);
                  setIsLoading(false);
                } else {
                  let APIError = {
                    Message: RecuritmentHRMsg.APIErrorMsg,
                    Type: HRMSAlertOptions.Error,
                    visible: true,
                    ButtonAction: async (userClickedOK: boolean) => {
                      if (userClickedOK) {
                        setAlertPopupOpen(false);
                      } else {
                        setAlertPopupOpen(false);
                      }
                    },
                  };

                  setAlertPopupOpen(true);
                  setalertProps(APIError);
                  setIsLoading(false);
                }
              }
            );
          }
          break;
      }
      setAddQualifbtn(false);
      setmasterdataValue("");
      setMasterAddQuali("");
      setShowQualificationInput(false);
    }
  }

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12">
              <CustomLabel value={"Advertisement"} mandatory={true} />
              <AttachmentButton
                label="Upload"
                iconName="CloudUpload"
                iconNameHover="CloudUpload"
                AttachState={(newAttachment: any) => {
                  let attachment: IDocFiles[] = newAttachment.map(
                    (item: any) => {
                      return {
                        name: item.name,
                        content: item.file,
                        type: "New",
                      };
                    }
                  );
                  const attachments = [
                    ...(advDetails.AdvertisementAttachement || []),
                    ...attachment,
                  ];
                  handleFileAttachment("AdvertisementAttachement", attachments);
                }}
                mandatory={true}
                error={validationErrors.AdvertisementAttachement}
                Style={{
                  backgroundColor: "rgb(239, 51, 64)",
                  color: "white",
                }}
              />
            </div>
            <div
              className="ms-Grid-col ms-lg6"
              //   style={{ marginTop: "4%" }}
            >
              {advDetails.AdvertisementAttachement?.map(
                (file: any, index: number) => {
                  const fileName = file.fileName || file.name; // Ensure proper name display
                  return (
                    <div key={index} className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <Label style={{ color: "blue" }}>
                          {fileName}
                          <span>
                            <Icon
                              iconName="Delete"
                              style={{
                                marginLeft: "8px",
                                fontSize: "16px",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleDelete(index, "AdvertisementAttachement")
                              } // Call the delete function
                            />
                          </span>
                        </Label>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12">
              <RichTextEditor
                label="Role Purpose"
                value={advDetails.RolePurpose}
                mandatory={true}
                onChange={(value) => handleRichTextEditor(value, "RolePurpose")}
                error={validationErrors.RolePurpose}
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12">
              <RichTextEditor
                label="Job Description"
                value={advDetails.JobDescription}
                mandatory={true}
                onChange={(value) =>
                  handleRichTextEditor(value, "JobDescription")
                }
                error={validationErrors.JobDescription}
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg10">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg5">
                  <CustomAutoComplete
                    label="Preferred Total Experience"
                    options={advDetails.TotalExperienceOption}
                    value={advDetails.TotalExperience}
                    disabled={false}
                    mandatory={true}
                    onChange={(item) =>
                      handleAutoComplete(item, "TotalExperience")
                    }
                    error={validationErrors.TotalExperience}
                  />
                </div>
                <div className="ms-Grid-col ms-lg5">
                  <CustomAutoComplete
                    label="Preferred Experience in Mining Industry (Years)"
                    options={advDetails.ExperienceinMiningIndustryOption}
                    value={advDetails.ExperienceinMiningIndustry}
                    disabled={false}
                    mandatory={true}
                    onChange={(item) =>
                      handleAutoComplete(item, "ExperienceinMiningIndustry")
                    }
                    error={validationErrors.ExperienceinMiningIndustry}
                  />
                  {InvaildSelection && (
                    <>
                      <p
                        style={{
                          marginTop: 5,
                          color: "red",
                          fontSize: 12,
                          marginLeft: 0,
                        }}
                      >
                        Invalid Selection
                      </p>
                    </>
                  )}
                </div>

                <div
                  className="ms-Grid-col ms-lg2"
                  style={{ textAlign: "right", marginTop: "45px" }}
                ></div>
              </div>
            </div>
            <div className="ms-Grid-col ms-lg2"></div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg10">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg5">
                  <CustomMultiSelect
                    label="Minimum Qualification"
                    value={qualificationValue.MinQualification}
                    options={advDetails.MinQualificationOption}
                    onChange={(value) =>
                      handleMulitiSelect(value, "MinQualification")
                    }
                    disabled={false}
                    mandatory={true}
                    error={validationErrors.MinQualification}
                  />
                </div>
                <div className="ms-Grid-col ms-lg5">
                  <CustomMultiSelect
                    label="Preferred Qualification"
                    value={qualificationValue.PrefeQualification}
                    options={advDetails.MinQualificationOption}
                    onChange={(value) =>
                      handleMulitiSelect(value, "PrefeQualification")
                    }
                    disabled={false}
                    // mandatory={true}
                    error={validationErrors.PrefeQualification}
                  />
                </div>
                <div
                  className="ms-Grid-col ms-lg2"
                  style={{ textAlign: "right", marginTop: "45px" }}
                ></div>
              </div>
            </div>
            <div
              className="ms-Grid-col ms-lg2"
              style={{
                marginTop: "45px",
              }}
            >
              {/* <CustomButton
                            text="Add New Qualification"
                            onClick={() =>
                              AddMasterData_fn(
                                RoleDescriptionData.Qualification,
                                "Add Qualification"
                              )
                            }
                              
                          /> */}
              <CustomButton
                text="Add New Qualification"
                onClick={() => setShowQualificationInput(true)}
              />
            </div>
          </div>
          {showQualificationInput && (
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg10">
                <div
                  className="ms-Grid-col ms-lg5"
                  style={{ marginLeft: "-6px", width: "336px" }}
                >
                  <CustomInput
                    label="Add New Qualification"
                    value={masterAddQuali}
                    disabled={false}
                    mandatory={true}
                    onChange={(value) =>
                      handlemasterValue(value, "addMasterMinimumQualification")
                    }
                    error={validationError.QualificationValue}
                  />
                </div>
                <div
                  className="ms-Grid-col ms-lg1"
                  style={{ marginTop: "39px", marginRight: "24px" }}
                >
                  <ReuseButton
                    label="Add"
                    onClick={async () => {
                      void InsertMasterData(RoleDescriptionData.Qualification);
                    }}
                    spacing={4}
                  />
                </div>
                <div
                  className="ms-Grid-col ms-lg1"
                  style={{ marginTop: "39px" }}
                >
                  <ReuseButton
                    label="Remove"
                    onClick={() => {
                      setShowQualificationInput(false);
                      setMasterAddQuali("");
                      setValidationErrors((prevState) => ({
                        ...prevState,
                        QualificationValue: false,
                      }));
                    }}
                    spacing={4}
                  />
                </div>
                <div className="ms-Grid-col ms-lg3"></div>
              </div>
            </div>
          )}

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg10">
              {RoleSpeKnowledgeValue.map((row, index) => (
                <div className="ms-Grid-row" key={index}>
                  <div className="ms-Grid-col ms-lg5">
                    <CustomAutoComplete
                      label="Role Specific Knowledge"
                      options={advDetails.RoleSpeKnowledgeoption}
                      value={row.RoleSpeKnowledge}
                      disabled={false}
                      mandatory={true}
                      onChange={(item) =>
                        handleAutoCompleterow(
                          item,
                          "RoleSpeKnowledge",
                          index,
                          "RoleSpeKnowledgeValue"
                        )
                      }
                      error={
                        validationErrors.RoleSpeKnowledgeValidation[index]
                          ?.RoleSpeKnowledge
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg5">
                    <CustomAutoComplete
                      label="Required Level"
                      options={advDetails.RequiredLeveloption}
                      value={row.RequiredLevel}
                      disabled={false}
                      mandatory={true}
                      onChange={(item) =>
                        handleAutoCompleterow(
                          item,
                          "RequiredLevel",
                          index,
                          "RoleSpeKnowledgeValue"
                        )
                      }
                      error={
                        validationErrors.RoleSpeKnowledgeValidation[index]
                          ?.RequiredLevel
                      }
                    />
                  </div>
                  <div
                    className="ms-Grid-col ms-lg2"
                    style={{
                      textAlign: "right",
                      marginTop: "42px",
                      display: "flex",
                      gap: "15px",
                    }}
                  >
                    {index > 0 ? (
                      <>
                        <CustomButton
                          onClick={() =>
                            handleDeleteRow(
                              index,
                              RoleDescription.RoleSpeKnowledgeValue
                            )
                          }
                          iconName="Delete"
                          style={{ marginRight: "4%" }}
                        />
                        <CustomButton
                          onClick={() =>
                            handleAddRow(
                              RoleDescription.RoleSpeKnowledgeValue,
                              index
                            )
                          }
                          iconName="Add"
                        />
                      </>
                    ) : (
                      <CustomButton
                        onClick={() =>
                          handleAddRow(
                            RoleDescription.RoleSpeKnowledgeValue,
                            index
                          )
                        }
                        iconName="Add"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="ms-Grid-col ms-lg2" style={{ marginTop: "42px" }}>
              <CustomButton
                text="Add New Role Specific Knowledge"
                onClick={() =>
                  AddMasterData_fn(
                    RoleDescriptionData.RoleSpeKnowledge,
                    "Add Role Specific Knowledge"
                  )
                }
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg10">
              {TechnicalSkillValue.map((row, index) => (
                <div className="ms-Grid-row" key={index}>
                  <div className="ms-Grid-col ms-lg5">
                    <CustomAutoComplete
                      label="Technical Skills - Ability to apply Knowledge"
                      options={advDetails.TechnicalSkillsOption}
                      value={row.TechnicalSkills}
                      disabled={false}
                      mandatory={true}
                      onChange={(item) =>
                        handleAutoCompleterow(
                          item,
                          "TechnicalSkills",
                          index,
                          "TechnicalSkillValue"
                        )
                      }
                      error={
                        validationErrors.technicalSkillsKnowledge[index]
                          ?.TechnicalSkills
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg5">
                    <CustomAutoComplete
                      label="Level of Proficiency"
                      options={advDetails.LevelProficiencyOption}
                      value={row.LevelProficiency}
                      disabled={false}
                      mandatory={true}
                      onChange={(item) =>
                        handleAutoCompleterow(
                          item,
                          "LevelProficiency",
                          index,
                          "TechnicalSkillValue"
                        )
                      }
                      error={
                        validationErrors.technicalSkillsKnowledge[index]
                          ?.LevelProficiency
                      }
                    />
                  </div>
                  <div
                    className="ms-Grid-col ms-lg2"
                    style={{
                      textAlign: "right",
                      marginTop: "42px",
                      display: "flex",
                      gap: "15px",
                    }}
                  >
                    {index > 0 ? (
                      <>
                        <CustomButton
                          onClick={() =>
                            handleDeleteRow(
                              index,
                              RoleDescription.TechnicalSkillValue
                            )
                          }
                          iconName="Delete"
                          style={{
                            borderRadius: "5px",
                            marginRight: "4%",
                            minWidth: "60px",
                          }}
                        />
                        <CustomButton
                          onClick={() =>
                            handleAddRow(
                              RoleDescription.TechnicalSkillValue,
                              index
                            )
                          }
                          iconName="Add"
                          style={{
                            borderRadius: "5px",
                            minWidth: "60px",
                          }}
                        />
                      </>
                    ) : (
                      <CustomButton
                        onClick={() =>
                          handleAddRow(
                            RoleDescription.TechnicalSkillValue,
                            index
                          )
                        }
                        iconName="Add"
                        style={{
                          borderRadius: "5px",
                          minWidth: "60px",
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="ms-Grid-col ms-lg2"
              style={{
                marginTop: "42px",
              }}
            >
              <CustomButton
                text="Add New Technical Skills"
                onClick={() =>
                  AddMasterData_fn(
                    RoleDescriptionData.TechnicalSkill,
                    "Add Technical Skills"
                  )
                }
                // iconName="Add"
                // style={{
                //   borderRadius: "10px",
                // }}
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg5" style={{ width: "34.9%" }}>
              <CustomAutoComplete
                label="Job Functional Type"
                options={advDetails.JobFunctionalTypeOption}
                value={advDetails.JobFunctionalType}
                disabled={false}
                mandatory={true}
                onChange={(item) =>
                  handleAutoComplete(item, "JobFunctionalType")
                }
                error={validationErrors.JobFunctionalType}
              />
            </div>
          </div>
        </div>
      </CustomLoader>

      {AlertPopupOpen ? (
        <>
          <CustomAlert
            {...alertProps}
            onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
          />
        </>
      ) : (
        <></>
      )}

      {AddQualifbtn && (
        <>
          <CustomDialogbox
            Style={{ width: "28vw", height: "37vh" }}
            visible={AddQualifbtn}
            children={
              <div className="ms-Grid-row" style={{ marginLeft: "6%" }}>
                <div className="ms-Grid-col ms-lg9">
                  <CustomInput
                    label={LabelValue}
                    value={masterdataValue}
                    disabled={false}
                    mandatory={true}
                    onChange={(value) =>
                      handlemasterValue(value, "masterdataValue")
                    }
                    error={validationError.MasterDataValue}
                  />
                </div>
              </div>
            }
            onClose={() => setAddQualifbtn(false)}
            header={
              <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                <div className="ms-Grid-col ms-lg12">
                  <LabelHeaderComponents value={HeaderValue} />
                </div>
              </div>
            }
            footer={
              <div
                className="ms-Grid-row"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "11%",
                }}
              >
                <ReuseButton
                  label="Close"
                  onClick={() => onclickClose()}
                  spacing={4}
                  Style={{
                    marginRight: "14px",
                  }}
                />

                <ReuseButton
                  label="Add"
                  onClick={() => InsertMasterData(HeaderValue)}
                  spacing={4}
                />
              </div>
            }
          />
        </>
      )}
    </>
  );
};
