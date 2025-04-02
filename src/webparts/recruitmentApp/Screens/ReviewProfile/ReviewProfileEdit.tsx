import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";

import {
  DocumentLibraray,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  RoleID,
  RoleProfileMaster,
  StatusId,
  TabName,
  WorkflowAction,
} from "../../utilities/Config";

import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomLabel from "../../components/CustomLabel";
import CustomTextArea from "../../components/CustomTextArea";
import { AdvDetails, RecuritmentData } from "../../Models/RecuritmentVRR";
import IsValid from "../../components/Validation";
import ReuseButton from "../../components/ReuseButton";
import CommanComments from "../../components/CommanComments";
import {
  CommentsData,
  InsertComments,
} from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomViewDocument from "../../components/CustomViewDocument";

import SPServices from "../../Services/SPService/SPServices";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import CustomSignature from "../../components/CustomSignature";
import SignatureCheckbox from "../../components/SignatureCheckbox";

import CustomPreviewScreen from "../RecuritmentProcess/CustomPreviewScreen";
type formValidation = {
  Comments: boolean;
  Checkboxalidation: boolean;
};

const ReviewProfileEdit: React.FC = (props: any) => {
  const todaydate = new Date();
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [advDetails, setAdvDetails] = useState<AdvDetails>({
    MinQualificationOption: [],
    PrefeQualificationOption: [],
    RoleSpeKnowledgeoption: [],
    RequiredLeveloption: [],
    TechnicalSkillsOption: [],
    LevelProficiencyOption: [],
    RolePurpose: "",
    JobDescription: "",
    addMasterQualification: "",
    TotalExperience: { key: 0, text: "" },
    ExperienceinMiningIndustry: { key: 0, text: "" },
    TotalExperienceOption: [],
    ExperienceinMiningIndustryOption: [],
    YearofExperience: " ",
    PreferredExperience: "",
    ValidFrom: todaydate,
    ValidTo: undefined,
    FunctionType: "",
    JobFunctionalType: { key: 0, text: "" },
    JobFunctionalTypeOption: [],
    addMasterMinimumQualification: "",
  });
  const [formState, setFormState] = useState<RecuritmentData>({
    VRRID: 0,
    BusinessUnitCodeID: 0,
    DepartmentID: 0,
    SubDepartmentID: 0,
    SectionID: 0,
    DepartmentCodeID: 0,
    JobNameInEnglishID: 0,
    JobNameInFrenchID: 0,
    PatersonGradeID: 0,
    DRCGradeID: 0,
    JobCodeID: 0,
    BusinessUnitCode: "",
    BusinessUnitName: "",
    BusinessUnitDescription: "",
    Department: "",
    SubDepartment: "",
    Section: "",
    DepartmentCode: "",
    Nationality: "",
    JobNameInEnglish: "",
    JobNameInFrench: "",
    NoofPositionAssigned: "",
    PatersonGrade: "",
    DRCGrade: "",
    EmployementCategory: "",
    ContractType: "",
    JobCode: "",
    AreaOfWork: "",
    ReasonForVacancy: "",
    RecruitmentAuthorised: "",
    IsPayrollEmailed: "",
    EnterNumberOfMonths: 0,
    DateRequried: "",
    IsRevert: "",
    VacancyConfirmed: "",
    AdvertisementAttachement: [],
    PositionDetails: [],
    RoleProfileDocument: [],
    GradingDocument: [],
    AdvertisementDocument: [],
    AssignRecruitmentHR: { key: 0, text: "" },
    AssignRecruitmentHROption: [],
    OnamSignedStampsAttchment: [],
    OnamSignedStampsDocument: [],
    AssignAgencies: { key: 0, text: "" },
    AssignAgenciesOption: [],
    CandidateCVAttachment: [],
    Comments: "",
    SignDate: new Date(
      todaydate.getFullYear(),
      todaydate.getMonth(),
      todaydate.getDate(),
      todaydate.getHours(),
      todaydate.getMinutes(),
      todaydate.getSeconds()
    ),
  });
  const [validationErrors, setValidationError] = React.useState<formValidation>(
    {
      Comments: false,

      Checkboxalidation: false,
    }
  );
  const [MainComponent, setMainComponent] = useState<boolean>(true);
  const [CommentData, setCommentsData] = useState<CommentsData[] | undefined>();
  const [activeTab, setactiveTab] = useState<string>("tab1");
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [Checkbox, setCheckbox] = useState<boolean>(false);
  const [prevActiveTab, setPrevActiveTab] = React.useState<string | null>(null);
  const [Preview, setPreview] = useState<boolean>(false);
  const [isViewed, setIsViewed] = useState(false);

  const fetchDataRole = async (JobCodeId: any) => {
    try {
      let filterConditions = [
        {
          FilterKey: "JobCode",
          Operator: "eq",
          FilterValue: JobCodeId,
        },
      ];
      await getVRRDetails
        .GetHRMSRecruitmentRoleProfileDetails(filterConditions, "")
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
  
            if (data && data.length > 0) {
              const rawData = data[0];
              const roleSpecificKnowledge = Array.isArray(
                rawData.RoleSpecificKnowledge
              )
                ? rawData.RoleSpecificKnowledge
                : [];
  
              const RoleSpeKnowledgeValues = roleSpecificKnowledge.map(
                (item: any) => item.RoleSpecificKnowledge
              );
              const RequiredLevelValues = roleSpecificKnowledge.map(
                (item: any) => item.RequiredLevel
              );
              const technicalSkillsKnowledge = Array.isArray(
                rawData.TechnicalSkillsKnowledge
              )
                ? rawData.TechnicalSkillsKnowledge
                : [];
  
              const TechnicalSkillsOption = technicalSkillsKnowledge.map(
                (item: any, index: number) => ({
                  key: index,
                  text: item.TechnicalSkills,
                })
              );
  
              const LevelProficiencyOption = technicalSkillsKnowledge.map(
                (item: any, index: number) => ({
                  key: index,
                  text: item.LevelProficiency,
                })
              );
  
              const MinQualificationOption = rawData.Qualification
                ? [{ key: 0, text: rawData.Qualification }]
                : [];
  
              const PrefeQualificationOption = rawData.PreferredQualification
                ? [{ key: 0, text: rawData.PreferredQualification }]
                : [];
  
              const mappedData: AdvDetails = {
                RolePurpose: rawData.RoleProfile || "",
                JobDescription: rawData.JobDescription || "",
                RoleSpeKnowledgeoption: RoleSpeKnowledgeValues,
                RequiredLeveloption: RequiredLevelValues,
                MinQualificationOption,
                PrefeQualificationOption,
                TotalExperience: rawData.YearofExperience || "",
                ExperienceinMiningIndustry: rawData.PreferredExperience || "",
                TechnicalSkillsOption,
                LevelProficiencyOption,
                addMasterQualification: "",
                YearofExperience: rawData.YearofExperience || "",
                PreferredExperience: rawData.PreferredExperience || "",
                ValidFrom: rawData.ValidFrom,
                ValidTo: rawData.ValidTo,
                FunctionType: rawData.FunctionType,
                TotalExperienceOption: [],
                ExperienceinMiningIndustryOption: [],
                JobFunctionalType: {
                  key: 0,
                  text: "",
                },
                JobFunctionalTypeOption: [],
                addMasterMinimumQualification: "",
              };
  
              setAdvDetails(mappedData);
            } 
          } else {
            console.error( response.message);
          }
        })
        .catch((error) => {
          console.error( error);
        });
    } catch (error) {
      console.error( error);
    }
  };
  
  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      debugger;
      const filterConditionsVRR = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.ID,
        },
      ];
      const Conditions = "";

      const response = await getVRRDetails.GetRecruitmentDetails(
        filterConditionsVRR,
        Conditions
      );

      if (response.data) {
        const op = response.data[0];
        // const NoofPositionAssigned = response.data[1];

        const BUName =
          props?.BusinessUnitCodeAllColumn.find(
            (item: any) => item.key === op.BusinessUnitCodeId
          ) || {};
        const JobtitleFrench =
          props?.JobInFrenchList.find(
            (item: any) => item.key === op.JobTitleInFrenchId
          ) || {};

        const [
          RoleProfileDocment,
          GradingDocument,
          AdvertismentDocment,
          OnamSignedStampsDocment,
        ] = await Promise.all([
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RoleProfileMaster,
            op.JobCode,
            RoleProfileMaster.RoleProfile
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RoleProfileMaster,
            op.JobCode,
            RoleProfileMaster.Grading
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RecruitmentAdvertisementDocument,
            op.JobCode
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.ONAMSignedStampDocuments,
            op.JobCode
          ),
        ]);

        if (
          RoleProfileDocment.status === 200 ||
          AdvertismentDocment.status === 200
        ) {
          const RoleProfileDoc = RoleProfileDocment.data || [];
          const AdvertismentDocPromises = AdvertismentDocment.data || [];
          const ONAMSignedStampDoc = OnamSignedStampsDocment.data || [];
          const GradingDoc = GradingDocument.data || [];

          setFormState((prevState) => ({
            ...prevState,
            VRRID: op.VRRID,
            BusinessUnitCodeID: op.BusinessUnitCodeId,
            DepartmentID: op.DepartmentId,
            SubDepartmentID: op.SubDepartmentId,
            SectionID: op.SectionId,
            DepartmentCodeID: op.DepartmentCodeId,
            JobNameInEnglishID: op.JobTitleInEnglishId,
            JobNameInFrenchID: op.JobTitleInFrenchId,
            PatersonGradeID: op.PayrollGradeId,
            DRCGradeID: op.DRCGradeId,
            JobCodeID: op.JobCodeId,
            BusinessUnitCode: op.BusinessUnitCode || "",
            BusinessUnitName: BUName.Name || "",
            BusinessUnitDescription: BUName.Description || "",
            Department: op.Department || "",
            SubDepartment: op.SubDepartment || "",
            Section: op.Section || "",
            DepartmentCode: op.DepartmentCode || "",
            Nationality: op.Nationality || "",
            JobNameInEnglish: op.JobTitleInEnglish || "",
            JobNameInFrench: JobtitleFrench.text || "",
            PatersonGrade: op.PayrollGrade || "",
            DRCGrade: op.DRCGrade || "",
            EmployementCategory: op.EmploymentCategory || "",
            ContractType: op.TypeOfContract || "",
            JobCode: op.JobCode || "",
            AreaOfWork: op.AreaofWork || "",
            NoofPositionAssigned: op.NumberOfPersonNeeded || 0,
            ReasonForVacancy: op.ReasonForVacancy || "",
            RecruitmentAuthorised: op.RecruitmentAuthorised || "",
            IsPayrollEmailed: op.IsPayrollEmailed || "",
            EnterNumberOfMonths: op.EnterNumberOfMonths || 0,
            DateRequried: op.DateRequried || null,
            IsRevert: op.IsRevert || "",
            VacancyConfirmed: op.VacancyConfirmed || "",
            RoleProfileDocument: RoleProfileDoc,
            GradingDocument: GradingDoc,
            AdvertisementDocument: AdvertismentDocPromises,
            OnamSignedStampsDocument: ONAMSignedStampDoc,
          }));
         

          await fetchDataRole(op.JobCodeId);
        } else {
          console.error( response);
        }
      }
    } catch (error) {
      console.error( error);
    } finally {
      setIsLoading(false);
    }
  };

  const Validation = (): boolean => {
    const { Comments } = formState;

    let errors = {
      Comments: false,

      Checkboxalidation: false,
    };

    switch (props.CurrentRoleID) {
      case RoleID.LineManager: {
        if (props.stateValue?.tab === "tab1") {
          errors.Comments = !IsValid(Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
        }
        break;
      }
    }

    setValidationError((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  const resetForm = () => {
    setFormState((prevState) => ({
      ...prevState,
      Comments: "",
    }));
  };

  const SaveRecruitment = async () => {
    try {
      setIsLoading(true);
      const isValid = !Validation();

      if (isValid) {
        const obj: any = {
          ActionId: WorkflowAction.Approved,
          ItemCreated: "Yes",
        };

        if (formState.Comments) {
          const commentsData: InsertComments = {
            RoleId: props.CurrentRoleID,
            RecruitmentIDId: props.stateValue?.ID,
            Comments: formState.Comments,
          };

          await getVRRDetails.InsertCommentsList(commentsData);
        }

        switch (props.CurrentRoleID) {
          case RoleID.LineManager: {
            await SPServices.SPUpdateItem({
              Listname: ListNames.HRMSRecruitmentDptDetails,
              RequestJSON: obj,
              ID: props.stateValue?.ID,
            });
            resetForm();

            let approveAlert = {
              Message: RecuritmentHRMsg.ApprovedMsg,
              Type: HRMSAlertOptions.Success,
              visible: true,
              ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                  props.navigation("/RecurimentProcess");
                  setAlertPopupOpen(false);
                }
              },
            };

            setAlertPopupOpen(true);
            setalertProps(approveAlert);
            setIsLoading(false);
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchData();
    };

    void initialize();
  }, []);

  const handleInputChangeTextArea = (
    value: string | any,
    StateValue: string
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationError((prevState) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const OpenComments = async () => {
    setMainComponent(false);
    let filterConditions = [];
    let Conditions = "";

    filterConditions.push({
      FilterKey: "RecruitmentID",
      Operator: "eq",
      FilterValue: props.stateValue.ID,
    });
    const CommentsList = await getVRRDetails.GetCommentsData(
      props.EmployeeList,
      Conditions,
      filterConditions
    );
    if (CommentsList.status === 200) {
      setCommentsData(CommentsList.data);
    }
  };

  const tabs = [
    {
      label: TabName.PositionDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 7px 4px 3px #d3d3d3",
            borderRadius: "10px",
            marginTop: "2%",
          }}
        >
          <CardContent>
            <div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg6">
                  <LabelHeaderComponents
                    value={`Job Title - ${formState.JobNameInEnglish} (${formState.JobCode})`}
                  >
                    {" "}
                  </LabelHeaderComponents>
                </div>
                <div className="ms-Grid-col ms-lg6">
                  <LabelHeaderComponents
                    value={`Status - ${props.stateValue?.Status}`}
                  >
                    {" "}
                  </LabelHeaderComponents>
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Business Unit Code"
                    value={formState.BusinessUnitCode}
                    error={false}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        BusinessUnitCode: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Business Unit Name"
                    value={formState.BusinessUnitName}
                    disabled={true}
                    error={false}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        BusinessUnitName: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Business Unit Description"
                    value={formState.BusinessUnitDescription}
                    error={false}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        BusinessUnitDescription: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Department"
                    value={formState.Department}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        Department: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Sub-Department"
                    value={formState.SubDepartment}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        SubDepartment: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Section"
                    value={formState.Section}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        Section: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Department Code"
                    value={formState.DepartmentCode}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        DepartmentCode: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Nationality"
                    value={formState.Nationality}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        Nationality: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Paterson Grade"
                    value={formState.PatersonGrade}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        PatersonGrade: value,
                      }))
                    }
                  />
                </div>

                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="DRC Grade"
                    value={formState.DRCGrade}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        DRCGrade: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Employment Category"
                    value={formState.EmployementCategory}
                    disabled={true}
                    error={false}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        EmployementCategory: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Type of Contract"
                    value={formState.ContractType}
                    disabled={true}
                    error={false}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        ContractType: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Area of Work"
                    value={formState.AreaOfWork}
                    disabled={true}
                    error={false}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        AreaOfWork: value,
                      }))
                    }
                  />
                </div>

                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="No of Position Assigned"
                    value={formState.NoofPositionAssigned}
                    disabled={true}
                    error={false}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        NoofPositionAssigned: value,
                      }))
                    }
                  />
                </div>

                <div className="ms-Grid-col ms-lg3">
                  <CustomInput
                    label="Date When Position Is Required"
                    value={
                      formState.DateRequried
                        ? new Date(formState.DateRequried)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-")
                        : ""
                    }
                    disabled={true}
                    error={false}
                    mandatory={false}
                    onChange={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        DateRequried: value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                <LabelHeaderComponents value={"Attachments"} />
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg3 custom-document-column">
                  <CustomLabel value={"RoleProfile Documents"} />
                  <div
                    className="document-wrapper"
                    title={
                      Array.isArray(formState.RoleProfileDocument)
                        ? formState.RoleProfileDocument.join(", ")
                        : formState.RoleProfileDocument
                    }
                  >
                    <CustomViewDocument
                      Attachment={formState.RoleProfileDocument}
                    />
                  </div>
                </div>
                <div className="ms-Grid-col ms-lg3 custom-document-column">
                  <CustomLabel value={"Grading Documents"} />
                  <div
                    className="document-wrapper"
                    title={
                      Array.isArray(formState.GradingDocument)
                        ? formState.GradingDocument.join(", ")
                        : formState.GradingDocument
                    }
                  >
                    <CustomViewDocument
                      Attachment={formState.GradingDocument}
                    />
                  </div>
                </div>

                {props.CurrentRoleID === RoleID.LineManager &&
                  props.stateValue?.StatusId ===
                    StatusId.PendingwithHODtoreviewAdv && (
                    <>
                      <div className="ms-Grid-col ms-lg3 custom-document-column">
                        <CustomLabel value={"Advertisement Documents"} />
                        <div
                          className="document-wrapper"
                          title={
                            Array.isArray(formState.AdvertisementDocument)
                              ? formState.AdvertisementDocument.join(", ")
                              : formState.AdvertisementDocument
                          }
                        >
                          <CustomViewDocument
                            Attachment={formState.AdvertisementDocument}
                          />
                        </div>
                      </div>
                    </>
                  )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
                  <>
                    <div className="ms-Grid-col ms-lg3">
                      <CustomLabel value={"Advertisement Documents"} />
                      <CustomViewDocument
                        Attachment={formState.AdvertisementDocument}
                      />
                    </div>
                  </>
                )}
              </div>

              {props.CurrentRoleID === RoleID.RecruitmentHR &&
              props.stateValue?.StatusId ===
                StatusId.PendingwithRecruitmentHRtouploadAdv ? (
                <></>
              ) : (
                <>
                  {props.CurrentRoleID === RoleID.LineManager &&
                    props.stateValue?.StatusId ===
                      StatusId.PendingwithHODtoreviewAdv && (
                      <div className="ms-Grid-row">
                        <div
                          className="ms-Grid-col ms-lg2"
                          style={{ position: "relative", right: "1px" }}
                        >
                          <div>
                            <CustomLabel
                              value={"View Advertisement"}
                              // mandatory={true}
                            />
                            <ReuseButton
                              Style={{
                                minWidth: "117px",
                                fontSize: "13px",
                                paddingBottom: "24px",
                                display: "flex",
                                flexDirection: "column",
                                height: "41px",
                                paddingTop: "23px",
                                backgroundColor: "#EF3340",
                                color: "white",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              label="VIEW"
                              imgSrc={require("../../assets/viewSubmision-white.svg")}
                              imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                              imgAlt="View"
                              imgAltHover="Hovered View"
                              onClick={async () => {
                                setPreview(true);
                                setMainComponent(false);
                                setIsViewed(true);
                              }}
                              spacing={4}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  {(props.stateValue?.StatusId ===
                    StatusId.PendingwithHRLeadtouploadONEMsigneddoc ||
                    props.stateValue?.StatusId ===
                      StatusId.PendingwithHODtoreviewAdv) && (
                    <>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg12">
                          <div
                            className="ms-Grid-col ms-lg4"
                            style={{ marginLeft: "-5px" }}
                          >
                            <CustomLabel value={"View Justifications"} />
                            <ReuseButton
                              Style={{
                                minWidth: "117px",
                                fontSize: "13px",
                                paddingBottom: "24px",
                                display: "flex",
                                flexDirection: "column",
                                height: "41px",
                                paddingTop: "23px",
                                backgroundColor: "#EF3340",
                                color: "white",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              label="VIEW"
                              imgSrc={require("../../assets/viewSubmision-white.svg")}
                              imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                              imgAlt="View"
                              imgAltHover="Hovered View"
                              onClick={OpenComments}
                              spacing={4}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {(props.stateValue?.StatusId ===
                    StatusId.PendingwithHRLeadtouploadONEMsigneddoc ||
                    props.stateValue?.StatusId ===
                      StatusId.PendingwithHODtoreviewAdv) && (
                    <>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg12">
                          <CustomTextArea
                            label="Justification"
                            value={formState.Comments}
                            error={validationErrors.Comments}
                            onChange={(value) =>
                              handleInputChangeTextArea(value, "Comments")
                            }
                            mandatory={true}
                          />
                        </div>
                      </div>

                      <div
                        className="ms-Grid-row"
                        style={{
                          padding: "3px",
                          marginTop: "20px",
                          marginBottom: "-33px",
                        }}
                      >
                        <div className="ms-Grid-col ms-lg12">
                          <SignatureCheckbox
                            label={TabName.CheckboxContent}
                            checked={Checkbox}
                            error={validationErrors.Checkboxalidation}
                            onChange={(value: boolean) => {
                              setCheckbox(value);
                              setValidationError((prevState) => ({
                                ...prevState,
                                Checkboxalidation: false,
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg12">
                          <CustomSignature
                            Name={
                              (props.userDetails[0].FirstName ?? "") +
                              " " +
                              (props.userDetails[0]?.MiddleName ?? "") +
                              " " +
                              (props.userDetails[0]?.LastName ?? "")
                            }
                            JobTitleInEnglish={
                              props.userDetails[0].JopTitleEnglish
                            }
                            JobTitleInFrench={
                              props.userDetails[0].JopTitleFrench
                            }
                            Department={props.userDetails[0].DepartmentName}
                            Date={formState.SignDate.toString()}
                            TermsAndCondition={Checkbox}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);
    const prevTabObj = tabs.find((item) => item.value === prevActiveTab);
    if (activeTab === "tab1") {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
        return newTabNames;
      });
    } else {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: prevTabObj?.label },
          { tabName: activeTabObj?.label },
        ];

        const uniqueTabNames = newTabNames.filter(
          (item, index, self) =>
            item.tabName &&
            self.findIndex((t) => t.tabName === item.tabName) === index
        );

        return uniqueTabNames;
      });
    }

    if (activeTab !== prevActiveTab) {
      setPrevActiveTab(activeTab);
    }
  }, [activeTab]);

  const handleCancel = () => {
    setIsLoading(true);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          props.navigation("/ReviewProfileList", {
            state: {
              activeTab: "tab1",
            },
          });
          setAlertPopupOpen(false);
        } else {
          setAlertPopupOpen(false);
        }
      },
    };

    setAlertPopupOpen(true);
    setalertProps(CancelAlert);
    setIsLoading(false);
  };

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  return (
    <>
      {MainComponent ? (
        <>
          <CustomLoader isLoading={isLoading}>
            <div className="menu-card">
              <BreadcrumbsComponent
                items={tabs}
                initialItem={activeTab}
                TabName={TabNameData}
                handleCancel={handleCancel}
                onBreadcrumbChange={handleBreadcrumbChange}
                additionalButtons={
                  props.CurrentRoleID === RoleID.LineManager &&
                  props.stateValue?.StatusId ===
                    StatusId.PendingwithHODtoreviewAdv &&
                  isViewed
                    ? [
                        {
                          label: "Approve",
                          onClick: async () => {
                            await SaveRecruitment();
                          },
                        },
                      ]
                    : []
                }
              />
            </div>
          </CustomLoader>
        </>
      ) : Preview ? (
        <CustomPreviewScreen
          data={advDetails}
          onclose={() => {
            setPreview(false);
            setMainComponent(true);
          }}
          Ok_btnfn={() => {
            setPreview(false);
            setMainComponent(true);
          }}
          JobTitle={formState.JobNameInEnglish}
        />
      ) : (
        <>
          <CommanComments
            onClose={() => {
              setMainComponent(true);
              setactiveTab(activeTab);
            }}
            Comments={CommentData}
          />
        </>
      )}
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
    </>
  );
};

export default ReviewProfileEdit;
