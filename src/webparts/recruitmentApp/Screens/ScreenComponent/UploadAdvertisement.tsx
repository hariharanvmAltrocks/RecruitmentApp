import * as React from "react";
import {
  AdvDetails,
  QualificationValue,
  RoleSpecKnowledge,
  TechnicalSkills,
} from "../../Models/RecuritmentVRR";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import { formValidationEdit } from "../RecuritmentProcess/ApprovedVRREdit";
import RichTextEditor from "../../components/CustomRichTextEditor";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import CustomButton from "../../components/CustomButton";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomInput from "../../components/CustomInput";
import ReuseButton from "../../components/ReuseButton";
import {
  CategoryID,
  HRMSAlertOptions,
  ListNames,
  masterFieldMap,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleDescription,
  RoleDescriptionData,
} from "../../utilities/Config";
import {
  GetPortalJobsService,
  getVRRDetails,
} from "../../Services/ServiceExport";
import { category, UpsertMasters } from "../../Models/ApIInterface";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomDialogbox from "../../components/CustomDialogbox";
import IsValid from "../../components/Validation";
import { MasterData } from "../../Models/Master";
import { labelNames } from "../../utilities/LabelName";

type ValidationErrors = {
  masterdata_En: boolean;
  masterdata_fr: boolean;
};

type masterdata = {
  masterdata_En: string;
  masterdata_fr: string;
};
interface AssignPositionDialogProps {
  advDetails: AdvDetails;
  validationErrors: formValidationEdit;
  handleFileAttachment: (type: string, item: IDocFiles[]) => void;
  handleRichTextEditor: (item: string, type: string) => void;
  handleAutoComplete: (item: AutoCompleteItem | null, type: string) => void;
  handleMulitiSelect: (item: AutoCompleteItem[], type: string) => void;
  handleInputChange: (item: string, type: string) => void;
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
  setAdvDetails: React.Dispatch<React.SetStateAction<number>>;
  MasterData: MasterData;
  IsEnglish: boolean;
}

export const UploadAdvertisement = ({
  advDetails,
  validationErrors,
  handleFileAttachment,
  handleRichTextEditor,
  handleAutoComplete,
  handleMulitiSelect,
  handleInputChange,
  InvaildSelection,
  handleDelete,
  handleAutoCompleterow,
  handleAddRow,
  qualificationValue,
  TechnicalSkillValue,
  RoleSpeKnowledgeValue,
  handleDeleteRow,
  setAdvDetails,
  MasterData,
  IsEnglish,
}: AssignPositionDialogProps) => {
  console.log(MasterData, "MasterData");

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
  const [addmasterBtn, setaddmasterBtn] = React.useState<boolean>(false);
  const [HeaderValue, setHeaderValue] = React.useState<string>("");
  const [LabelValue, setLabelValue] = React.useState<string>("");
  const [addMasterData, setAddMasterData] = React.useState<masterdata>({
    masterdata_En: "",
    masterdata_fr: "",
  });
  // const [masterdataValue, setmasterdataValue] = React.useState<string>("");
  const [validationError, setValidationErrors] =
    React.useState<ValidationErrors>({
      masterdata_En: false,
      masterdata_fr: false,
    });

  React.useEffect(() => {
    // setAdvDetails((prev) => ({
    //   ...prev,
    //   IsMasterData: true,
    // }));
    if (addmasterBtn) {
      setShowQualificationInput(!addmasterBtn);
    }
  }, [addmasterBtn, addMasterData, qualificationValue, advDetails]);

  const AddMasterData_fn = (Header: string, LabelValue: string) => {
    setaddmasterBtn(true);
    setHeaderValue(Header);
    setLabelValue(LabelValue);
    setAddMasterData((prev) => ({
      ...prev,
      masterdata_En: "",
      masterdata_fr: "",
    }));
    // setValidationErrors((prev) => ({
    //   ...prev,
    //   masterdata_En: false,
    //   masterdata_fr: false,
    // }));
  };

  const handlemasterValue = (value: string, type: string) => {
    setAddMasterData((prev) => ({
      ...prev,
      [type]: value,
    }));
    // setMasterAddQuali(value);
    setValidationErrors((prevState) => ({
      ...prevState,
      [type]: false,
    }));
  };

  const onclickClose = () => {
    setValidationErrors((prevState) => ({
      ...prevState,
      masterdata_En: false,
      masterdata_fr: false,
    }));
    setaddmasterBtn(false);
    setAddMasterData((prev) => ({
      ...prev,
      masterdata_En: "",
      masterdata_fr: "",
    }));
  };

  async function InsertMasterData(Value: string) {
    let IsVaild;
    validationError.masterdata_En = !IsValid(addMasterData.masterdata_En);
    validationError.masterdata_fr = !IsValid(addMasterData.masterdata_fr);
    setValidationErrors((prev) => ({
      ...prev,
      masterdata_En: !IsValid(addMasterData.masterdata_En),
      masterdata_fr: !IsValid(addMasterData.masterdata_fr),
    }));
    IsVaild = !(validationError.masterdata_En && validationError.masterdata_fr);
    if (IsVaild) {
      let MasterData;
      let category: category = {
        id: 0,
        name: "",
      };
      let ListName: string = "";
      ListName =
        Value === RoleDescriptionData.Qualification
          ? ListNames.HRMSQualification
          : Value === RoleDescriptionData.RoleSpeKnowledge
          ? ListNames.HRMSRoleSpecificKnowlegeMaster
          : Value === RoleDescriptionData.TechnicalSkill
          ? ListNames.HRMSTechnicalSkills
          : "";
      category = {
        id: Number(
          CategoryID[masterFieldMap[Value]?.label as keyof typeof CategoryID]
        ),
        name: Value,
      };
      const { label, codeLabel, label_fr } = masterFieldMap[Value];
      let AgentDetailsList: UpsertMasters[] = [
        {
          displayText: addMasterData.masterdata_En,
          displayText_fr: addMasterData.masterdata_fr,
          category: category,
        },
      ];
      await GetPortalJobsService.UpsertMaster(AgentDetailsList).then(
        async (res) => {
          if (res.status === 200) {
            // MasterData = {
            //   Qualification: res.data.data[0].displayText,
            //   QualificationCode: res.data.data[0].value,
            // };
            MasterData = {
              [label]: res.data.data[0].displayText,
              [codeLabel]: res.data.data[0].value,
              [label_fr]: res.data.data[0].displayText_fr,
            };
            let response = await getVRRDetails.InsertList(MasterData, ListName);
            if (response.status === ResponeStatus.SUCCESS) {
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
            }
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

      setaddmasterBtn(false);
      setAddMasterData((prev) => ({
        ...prev,
        masterdata_En: "",
        masterdata_fr: "",
      }));
      setShowQualificationInput(false);
      setAdvDetails(1);
    }
  }

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12">
              <RichTextEditor
                label={
                  IsEnglish
                    ? labelNames.AdvertisementLabel.RolePurpose
                    : labelNames.Advertisement_fr.RolePurpose
                }
                value={
                  IsEnglish ? advDetails.RolePurpose : advDetails.RolePurpose_fr
                }
                mandatory={true}
                onChange={(value) => handleRichTextEditor(value, "RolePurpose")}
                error={
                  IsEnglish
                    ? validationErrors.RolePurpose
                    : validationErrors.RolePurpose_fr
                }
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12">
              <RichTextEditor
                label={
                  IsEnglish
                    ? labelNames.AdvertisementLabel.JobDescription
                    : labelNames.Advertisement_fr.JobDescription
                }
                value={
                  IsEnglish
                    ? advDetails.JobDescription
                    : advDetails.JobDescription_fr
                }
                mandatory={true}
                onChange={(value) =>
                  handleRichTextEditor(value, "JobDescription")
                }
                error={
                  IsEnglish
                    ? validationErrors.JobDescription
                    : validationErrors.JobDescription_fr
                }
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg10">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg5">
                  <CustomAutoComplete
                    label={
                      IsEnglish
                        ? labelNames.AdvertisementLabel.PreferredTotalExperience
                        : labelNames.Advertisement_fr.PreferredTotalExperience
                    }
                    options={advDetails.TotalExperienceOption}
                    value={advDetails.TotalExperience}
                    disabled={!IsEnglish}
                    mandatory={IsEnglish}
                    onChange={(item) =>
                      handleAutoComplete(item, "TotalExperience")
                    }
                    error={validationErrors.TotalExperience}
                  />
                </div>
                <div className="ms-Grid-col ms-lg5">
                  <CustomAutoComplete
                    label={
                      IsEnglish
                        ? labelNames.AdvertisementLabel
                            .PreferredExperienceMining
                        : labelNames.Advertisement_fr.PreferredExperienceMining
                    }
                    options={advDetails.ExperienceinMiningIndustryOption}
                    value={advDetails.ExperienceinMiningIndustry}
                    disabled={!IsEnglish}
                    mandatory={IsEnglish}
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
                    label={
                      IsEnglish
                        ? labelNames.AdvertisementLabel.MinimumQualification
                        : labelNames.Advertisement_fr.MinimumQualification
                    }
                    value={
                      IsEnglish
                        ? qualificationValue.MinQualification
                        : qualificationValue.MinQualification_fr
                    }
                    options={advDetails.MinQualificationOption}
                    onChange={(value) =>
                      handleMulitiSelect(value, "MinQualification")
                    }
                    disabled={!IsEnglish}
                    mandatory={IsEnglish}
                    error={validationErrors.MinQualification}
                  />
                </div>
                <div className="ms-Grid-col ms-lg5">
                  <CustomMultiSelect
                    label={
                      IsEnglish
                        ? labelNames.AdvertisementLabel.PreferredQualification
                        : labelNames.Advertisement_fr.PreferredQualification
                    }
                    value={
                      IsEnglish
                        ? qualificationValue.PrefeQualification
                        : qualificationValue.PrefeQualification_fr
                    }
                    options={advDetails.MinQualificationOption}
                    onChange={(value) =>
                      handleMulitiSelect(value, "PrefeQualification")
                    }
                    disabled={!IsEnglish}
                    mandatory={IsEnglish}
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
              {IsEnglish && (
                <>
                  <CustomButton
                    text="Add New Qualification"
                    onClick={() => setShowQualificationInput(true)}
                    disabled={!IsEnglish}
                  />
                </>
              )}
            </div>
          </div>
          {IsEnglish && (
            <>
              {showQualificationInput && (
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg10">
                    <div
                      className="ms-Grid-col ms-lg5"
                      style={{ marginLeft: "-6px", width: "336px" }}
                    >
                      <CustomInput
                        label="Add New Qualification English"
                        value={addMasterData.masterdata_En}
                        disabled={!IsEnglish}
                        mandatory={IsEnglish}
                        onChange={(value) =>
                          handlemasterValue(value, "masterdata_En")
                        }
                        error={validationError.masterdata_En}
                      />
                    </div>
                    <div
                      className="ms-Grid-col ms-lg5"
                      style={{ marginLeft: "-6px", width: "336px" }}
                    >
                      <CustomInput
                        label="Add New Qualification French"
                        value={addMasterData.masterdata_fr}
                        disabled={!IsEnglish}
                        mandatory={IsEnglish}
                        onChange={(value) =>
                          handlemasterValue(value, "masterdata_fr")
                        }
                        error={validationError.masterdata_fr}
                      />
                    </div>
                    <div
                      className="ms-Grid-col ms-lg1"
                      style={{ marginTop: "39px", marginRight: "24px" }}
                    >
                      <ReuseButton
                        label="Add"
                        onClick={async () => {
                          void InsertMasterData(
                            RoleDescriptionData.Qualification
                          );
                        }}
                        spacing={4}
                        disabled={!IsEnglish}
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
                          setAddMasterData((prev) => ({
                            ...prev,
                            masterdata_En: "",
                            masterdata_fr: "",
                          }));
                          setValidationErrors((prevState) => ({
                            ...prevState,
                            masterdata_En: false,
                            masterdata_fr: false,
                          }));
                        }}
                        spacing={4}
                        disabled={!IsEnglish}
                      />
                    </div>
                    <div className="ms-Grid-col ms-lg3"></div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg10">
              {RoleSpeKnowledgeValue.map((row, index) => (
                <div className="ms-Grid-row" key={index}>
                  <div className="ms-Grid-col ms-lg5">
                    <CustomAutoComplete
                      label={
                        IsEnglish
                          ? labelNames.AdvertisementLabel.RoleSpecificKnowledge
                          : labelNames.Advertisement_fr.RoleSpecificKnowledge
                      }
                      options={advDetails.RoleSpeKnowledgeoption}
                      value={
                        IsEnglish
                          ? row.RoleSpeKnowledge
                          : row.RoleSpeKnowledge_fr
                      }
                      disabled={!IsEnglish}
                      mandatory={IsEnglish}
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
                      label={
                        IsEnglish
                          ? labelNames.AdvertisementLabel.RequiredLevel
                          : labelNames.Advertisement_fr.RequiredLevel
                      }
                      options={advDetails.RequiredLeveloption}
                      value={
                        IsEnglish ? row.RequiredLevel : row.RequiredLevel_fr
                      }
                      disabled={!IsEnglish}
                      mandatory={IsEnglish}
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
                  {IsEnglish && (
                    <>
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
                              disabled={!IsEnglish}
                            />
                            <CustomButton
                              onClick={() =>
                                handleAddRow(
                                  RoleDescription.RoleSpeKnowledgeValue,
                                  index
                                )
                              }
                              iconName="Add"
                              disabled={!IsEnglish}
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
                            disabled={!IsEnglish}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {IsEnglish && (
              <>
                <div
                  className="ms-Grid-col ms-lg2"
                  style={{ marginTop: "42px" }}
                >
                  <CustomButton
                    text="Add New Role Specific Knowledge"
                    onClick={() =>
                      AddMasterData_fn(
                        RoleDescriptionData.RoleSpeKnowledge,
                        "Role Knowledge"
                      )
                    }
                    disabled={!IsEnglish}
                  />
                </div>
              </>
            )}
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg10">
              {TechnicalSkillValue.map((row, index) => (
                <div className="ms-Grid-row" key={index}>
                  <div className="ms-Grid-col ms-lg5">
                    <CustomAutoComplete
                      label={
                        IsEnglish
                          ? labelNames.AdvertisementLabel.TechnicalSkills
                          : labelNames.Advertisement_fr.TechnicalSkills
                      }
                      options={advDetails.TechnicalSkillsOption}
                      value={
                        IsEnglish ? row.TechnicalSkills : row.TechnicalSkills_fr
                      }
                      disabled={!IsEnglish}
                      mandatory={IsEnglish}
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
                      label={
                        IsEnglish
                          ? labelNames.AdvertisementLabel.LevelProficiency
                          : labelNames.Advertisement_fr.LevelProficiency
                      }
                      options={advDetails.LevelProficiencyOption}
                      value={
                        IsEnglish
                          ? row.LevelProficiency
                          : row.LevelProficiency_fr
                      }
                      disabled={!IsEnglish}
                      mandatory={IsEnglish}
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
                  {IsEnglish && (
                    <>
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
                              disabled={!IsEnglish}
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
                              disabled={!IsEnglish}
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
                            disabled={!IsEnglish}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {IsEnglish && (
              <>
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
                        "Technical Skills"
                      )
                    }
                    disabled={!IsEnglish}
                    // iconName="Add"
                    // style={{
                    //   borderRadius: "10px",
                    // }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg5" style={{ width: "34.9%" }}>
              {}
              <CustomAutoComplete
                label={
                  IsEnglish
                    ? labelNames.AdvertisementLabel.JobTitleFunctionalManager
                    : labelNames.Advertisement_fr.JobTitleFunctionalManager
                }
                options={advDetails.JobTitleofFunctionalManagerOption}
                value={
                  IsEnglish
                    ? advDetails.JobTitleofFunctionalManager
                    : advDetails.JobTilteFunctionalManager_fr
                }
                disabled={
                  !IsEnglish &&
                  advDetails.JobTitleofFunctionalManagerOption.length < 2
                }
                mandatory={
                  IsEnglish
                    ? true
                    : advDetails.JobTitleofFunctionalManagerOption.length > 1
                }
                onChange={(item) =>
                  handleAutoComplete(item, "JobTitleofFunctionalManager")
                }
                error={validationErrors.JobTitleofFunctionalManager}
              />
            </div>
            <div className="ms-Grid-col ms-lg5" style={{ width: "34.9%" }}>
              <CustomAutoComplete
                label={
                  IsEnglish
                    ? labelNames.AdvertisementLabel.FunctionalManagerName
                    : labelNames.Advertisement_fr.FunctionalManagerName
                }
                options={MasterData.EmployeeList.filter(
                  (item) =>
                    item?.JobTitle ===
                    advDetails?.JobTitleofFunctionalManager?.text
                ).map((item) => ({
                  key: item.key,
                  text:
                    item.FirstName +
                    " " +
                    item.MiddleName +
                    " " +
                    item.LastName,
                }))}
                value={advDetails.FunctionalManagerName}
                disabled={!IsEnglish}
                mandatory={IsEnglish}
                onChange={(item) =>
                  handleAutoComplete(item, "FunctionalManagerName")
                }
                error={validationErrors.FunctionalManagerName}
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg5" style={{ width: "34.9%" }}>
              <CustomAutoComplete
                label={
                  IsEnglish
                    ? labelNames.AdvertisementLabel
                        .JobTitleLineManagerSupervisor
                    : labelNames.Advertisement_fr.JobTitleLineManagerSupervisor
                }
                options={advDetails.JobTitleofLineManagerSupervisorOption}
                value={
                  IsEnglish
                    ? advDetails.JobTitleofLineManagerSupervisor
                    : advDetails.JobTitleofLineManagerSupervisor_fr
                }
                disabled={
                  !IsEnglish &&
                  advDetails.JobTitleofLineManagerSupervisorOption.length < 2
                }
                mandatory={
                  IsEnglish
                    ? true
                    : advDetails.JobTitleofLineManagerSupervisorOption.length >
                      1
                }
                onChange={(item) =>
                  handleAutoComplete(item, "JobTitleofLineManagerSupervisor")
                }
                error={validationErrors.JobTitleofLineManagerSupervisor}
              />
            </div>
            <div className="ms-Grid-col ms-lg5" style={{ width: "34.9%" }}>
              <CustomAutoComplete
                label={
                  IsEnglish
                    ? labelNames.AdvertisementLabel.LineManagerSupervisorName
                    : labelNames.Advertisement_fr.LineManagerSupervisorName
                }
                options={MasterData.EmployeeList.filter(
                  (item) =>
                    item?.JobTitle ===
                    advDetails?.JobTitleofLineManagerSupervisor?.text
                ).map((item) => ({
                  key: item.key,
                  text:
                    item.FirstName +
                    " " +
                    item.MiddleName +
                    " " +
                    item.LastName,
                }))}
                value={advDetails.LineManagerSupervisorName}
                disabled={!IsEnglish}
                mandatory={IsEnglish}
                onChange={(item) =>
                  handleAutoComplete(item, "LineManagerSupervisorName")
                }
                error={validationErrors.LineManagerSupervisorName}
              />
            </div>
          </div>

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg5" style={{ width: "34.9%" }}>
              <CustomAutoComplete
                label={
                  IsEnglish
                    ? labelNames.AdvertisementLabel.JobFunctionalType
                    : labelNames.Advertisement_fr.JobFunctionalType
                }
                options={advDetails.JobFunctionalTypeOption}
                value={
                  IsEnglish
                    ? advDetails.JobFunctionalType
                    : advDetails.JobFunctionalType_fr
                }
                disabled={!IsEnglish}
                mandatory={IsEnglish}
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

      {addmasterBtn && (
        <>
          <CustomDialogbox
            Style={{
              width: "28vh",
              height: "38vh",
              padding: "0px",
              overflowX: "hidden",
            }}
            visible={addmasterBtn}
            children={
              <div className="ms-Grid-row" style={{ marginLeft: "6%" }}>
                <div className="ms-Grid-col ms-lg5">
                  <CustomInput
                    label={LabelValue + " " + "English"}
                    value={addMasterData.masterdata_En}
                    disabled={false}
                    mandatory={true}
                    onChange={(value) =>
                      handlemasterValue(value, "masterdata_En")
                    }
                    error={validationError.masterdata_En}
                  />
                </div>
                <div className="ms-Grid-col ms-lg5">
                  <CustomInput
                    label={LabelValue + " " + "French"}
                    value={addMasterData.masterdata_fr}
                    disabled={false}
                    mandatory={true}
                    onChange={(value) =>
                      handlemasterValue(value, "masterdata_fr")
                    }
                    error={validationError.masterdata_fr}
                  />
                </div>
              </div>
            }
            onClose={() => setaddmasterBtn(false)}
            header={
              <div
                style={{
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <h2
                  style={{
                    color: "white",
                    fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", 
                                  -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                    // textDecoration: "underline",
                    // textUnderlineOffset: "6px",
                  }}
                >
                  {HeaderValue}
                </h2>
              </div>
            }
            footer={
              <div
                className="ms-Grid-row"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1%",
                  marginBottom: "1%",
                }}
              >
                <ReuseButton
                  label="Add"
                  onClick={() => InsertMasterData(HeaderValue)}
                  spacing={4}
                  Style={{
                    marginRight: "14px",
                  }}
                />
                <ReuseButton
                  label="Close"
                  onClick={() => onclickClose()}
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
