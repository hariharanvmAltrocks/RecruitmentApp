import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import { Icon, Label, PrimaryButton } from "office-ui-fabric-react";
import AttachmentButton from "../../components/AttachmentButton";
import {
  ADGroupID,
  DocumentLibraray,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  RoleDescription,
  RoleDescriptionData,
  RoleID,
  RoleProfileMaster,
  StatusId,
  TabName,
  WorkflowAction,
} from "../../utilities/Config";
import Labelheader from "../../components/LabelHeader";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomLabel from "../../components/CustomLabel";
import CustomTextArea from "../../components/CustomTextArea";
import {
  AdvDetails,
  IAttachmentExampleState,
  QualificationValue,
  RecuritmentData,
  RoleSpecKnowledge,
  TechnicalSkills,
} from "../../Models/RecuritmentVRR";
import IsValid from "../../components/Validation";
import ReuseButton from "../../components/ReuseButton";
import CommanComments from "../../components/CommanComments";
import {
  CommentsData,
  InsertComments,
} from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomViewDocument from "../../components/CustomViewDocument";
import RichTextEditor from "../../components/CustomRichTextEditor";
import PreviewScreen from "./PreviewScreen";
import { Dialog } from "primereact/dialog";
import SPServices from "../../Services/SPService/SPServices";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import CustomSignature from "../../components/CustomSignature";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import CustomPreviewScreen from "./CustomPreviewScreen";

interface Item {
  name: string;
  fileContent: ArrayBuffer;
  file?: File | any;
  serverRelativeUrl?: string;
  ID?: string;
}

type formValidation = {
  AssignRecruitmentHR: boolean;
  AssignAgencies: boolean;
  Comments: boolean;
  AdvertisementDocument: boolean;
  OnamSignedStampsDocument: boolean;
  MinQualification: boolean;
  PrefeQualification: boolean;
  RoleSpeKnowledge: boolean;
  RequiredLevel: boolean;
  TechnicalSkills: boolean;
  LevelProficiency: boolean;
  RolePurpose: boolean;
  JobDescription: boolean;
  TotalExperience: boolean;
  ExperienceinMiningIndustry: boolean;
  addMasterQualification: boolean;
  Checkboxalidation: boolean;
};

const ApprovedVRREdit: React.FC = (props: any) => {
  console.log(props, "propsApprovedVRREdit");

  const todaydate = new Date();
  const [tabVisibility, setTabVisibility] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
  });
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  // const [ButtonLabel, setButtonLabel] = useState<string>("Submit");
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
    TotalExperience: "",
    ExperienceinMiningIndustry: "",
    YearofExperience: " ",
    PreferredExperience: "",
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
      AssignRecruitmentHR: false,
      AssignAgencies: false,
      Comments: false,
      AdvertisementDocument: false,
      OnamSignedStampsDocument: false,
      MinQualification: false,
      PrefeQualification: false,
      RoleSpeKnowledge: false,
      RequiredLevel: false,
      TechnicalSkills: false,
      LevelProficiency: false,
      RolePurpose: false,
      JobDescription: false,
      TotalExperience: false,
      ExperienceinMiningIndustry: false,
      addMasterQualification: false,
      Checkboxalidation: false,
    }
  );
  const [MainComponent, setMainComponent] = useState<boolean>(true);
  const [CommentData, setCommentsData] = useState<CommentsData[] | undefined>();
  const [PreviewBtn, setPreviewBtn] = useState<boolean>(false);
  const [Preview, setPreview] = useState<boolean>(false);
  const [SubmitBtn, setSubmitBtn] = useState<boolean>(true);
  const [AddQualifbtn, setAddQualifbtn] = useState<boolean>(false);
  const [activeTab, setactiveTab] = useState<string>("tab1");
  const [RoleSpeKnowledgeValue, setRoleSpeKnowledgeValue] = useState<
    RoleSpecKnowledge[]
  >([
    {
      RoleSpeKnowledge: { key: 0, text: "" },
      RequiredLevel: { key: 0, text: "" },
    },
  ]);
  const [QualificationValue, setQualificationValue] = useState<
    QualificationValue[]
  >([
    {
      MinQualification: { key: 0, text: "" },
      PrefeQualification: { key: 0, text: "" },
    },
  ]);
  const [TechnicalSkillValue, setTechnicalSkillValue] = useState<
    TechnicalSkills[]
  >([
    {
      TechnicalSkills: { key: 0, text: "" },
      LevelProficiency: { key: 0, text: "" },
    },
  ]);
  const [HeaderValue, setHeaderValue] = useState<string>("");
  const [LabelValue, setLabelValue] = useState<string>("");
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [Checkbox, setCheckbox] = useState<boolean>(false);
  const [prevActiveTab, setPrevActiveTab] = React.useState<string | null>(null);

  const handleAddRow = (stateValue: string) => {
    switch (stateValue) {
      case RoleDescription.RoleSpeKnowledgeValue:
        {
          setRoleSpeKnowledgeValue((prevState) => [
            ...prevState,
            {
              RoleSpeKnowledge: { key: 0, text: "" },
              RequiredLevel: { key: 0, text: "" },
            },
          ]);
        }
        break;
      case RoleDescription.QualificationValue:
        {
          setQualificationValue((prevState) => [
            ...prevState,
            {
              MinQualification: { key: 0, text: "" },
              PrefeQualification: { key: 0, text: "" },
            },
          ]);
        }
        break;
      case RoleDescription.TechnicalSkillValue: {
        setTechnicalSkillValue((prevState) => [
          ...prevState,
          {
            TechnicalSkills: { key: 0, text: "" },
            LevelProficiency: { key: 0, text: "" },
          },
        ]);
      }
    }
  };

  const handleDeleteRow = (index: number, stateValue: string) => {
    switch (stateValue) {
      case RoleDescription.RoleSpeKnowledgeValue:
        {
          setRoleSpeKnowledgeValue((prevState) =>
            prevState.filter((_, i) => i !== index)
          );
        }
        break;
      case RoleDescription.QualificationValue:
        {
          setQualificationValue((prevState) =>
            prevState.filter((_, i) => i !== index)
          );
        }
        break;
      case RoleDescription.TechnicalSkillValue: {
        setTechnicalSkillValue((prevState) =>
          prevState.filter((_, i) => i !== index)
        );
      }
    }
  };

  const handleAutoCompleterow = (
    item: AutoCompleteItem | null,
    key: string, // Generalized key
    index: number,
    stateKey:
      | "RoleSpeKnowledgeValue"
      | "QualificationValue"
      | "TechnicalSkillValue"
  ) => {
    if (stateKey === "RoleSpeKnowledgeValue") {
      setRoleSpeKnowledgeValue((prevState) => {
        const updatedRows = [...prevState];
        if (key === "RoleSpeKnowledge" || key === "RequiredLevel") {
          updatedRows[index][key] = item || { key: 0, text: "" };
        }
        return updatedRows;
      });
    }

    if (stateKey === "QualificationValue") {
      setQualificationValue((prevState) => {
        const updatedRows = [...prevState];
        if (key === "MinQualification" || key === "PrefeQualification") {
          updatedRows[index][key] = item || { key: 0, text: "" };
        }
        return updatedRows;
      });
    }

    if (stateKey === "TechnicalSkillValue") {
      setTechnicalSkillValue((prevState) => {
        const updatedRows = [...prevState];
        if (key === "TechnicalSkills" || key === "LevelProficiency") {
          updatedRows[index][key] = item || { key: 0, text: "" };
        }
        return updatedRows;
      });
    }
  };

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const filterConditionsVRR = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.ID,
        },
      ];
      const Conditions = "";

      const response =
        props.stateValue?.type === "VRR"
          ? await getVRRDetails.GetVacancyDetails(
              filterConditionsVRR,
              Conditions
            )
          : await getVRRDetails.GetRecruitmentDetails(
              filterConditionsVRR,
              Conditions
            );

      console.log(response, "responseresponse");

      if (response.data) {
        const op =
          props.stateValue?.type === "VRR"
            ? response.data[0][0]
            : response.data[0];
        const NoofPositionAssigned = response.data[1];

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
            props.stateValue?.ID,
            op.JobCode
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.ONAMSignedStampDocuments,
            props.stateValue?.ID,
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

          if (NoofPositionAssigned?.length > 0) {
            const updatedPositions = NoofPositionAssigned.map(
              (position: any) => ({
                ...position,
                PatersonGradeID: op.PayrollGradeId,
                DRCGradeID: op.DRCGradeId,
              })
            );
            console.log(updatedPositions, "updatedPositions");

            setFormState((prevState) => ({
              ...prevState,
              PositionDetails: updatedPositions,
            }));
          }
        } else {
          console.error("Error retrieving attachments:", response);
        }
      }
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachement = async (
    ID: any,
    PositionID: number,
    ParentFolder: string,
    Attachment: IAttachmentExampleState[]
  ) => {
    try {
      console.log("IDID", ID);
      if (ID && PositionID && Attachment && Attachment.length > 0) {
        for (const attachment of Attachment) {
          await CommonServices.uploadAttachmentToLibrary(
            ID,
            PositionID,
            attachment.file,
            ParentFolder
          );
        }
      }
    } catch (error) {
      console.error("Error handling form submission:", error);
    } finally {
      console.log("Attachments upload process completed");
    }
  };

  const Validation = (): boolean => {
    const {
      AssignRecruitmentHR,
      AssignAgencies,
      Comments,
      AdvertisementAttachement,
      OnamSignedStampsAttchment,
    } = formState;

    let errors = {
      AssignRecruitmentHR: false,
      AssignAgencies: false,
      Comments: false,
      AdvertisementDocument: false,
      OnamSignedStampsDocument: false,
      MinQualification: false,
      PrefeQualification: false,
      RoleSpeKnowledge: false,
      RequiredLevel: false,
      TechnicalSkills: false,
      LevelProficiency: false,
      RolePurpose: false,
      JobDescription: false,
      ExperienceinMiningIndustry: false,
      TotalExperience: false,
    };

    switch (props.CurrentRoleID) {
      case RoleID.RecruitmentHRLead: {
        if (props.stateValue?.tab === "tab1") {
          errors.AssignRecruitmentHR = !IsValid(AssignRecruitmentHR.text);
          errors.Comments = !IsValid(Comments);
        } else if (props.stateValue?.tab === "tab2") {
          errors.OnamSignedStampsDocument = !IsValid(OnamSignedStampsAttchment);
          errors.Comments = !IsValid(Comments);
        }
        break;
      }

      case RoleID.RecruitmentHR: {
        if (formState.AdvertisementDocument.length > 0) {
          errors.AssignAgencies = !IsValid(AssignAgencies.text);
          errors.Comments = !IsValid(Comments);
        } else {
          if (props.stateValue?.tab === "tab1") {
            errors.AdvertisementDocument = !IsValid(AdvertisementAttachement);
            errors.Comments = !IsValid(Comments);
            errors.MinQualification = !IsValid(
              QualificationValue[0].MinQualification
            );
            errors.PrefeQualification = !IsValid(
              QualificationValue[0].PrefeQualification
            );
            errors.RoleSpeKnowledge = !IsValid(
              RoleSpeKnowledgeValue[0].RoleSpeKnowledge
            );
            errors.RequiredLevel = !IsValid(
              RoleSpeKnowledgeValue[0].RequiredLevel.text
            );
            errors.TechnicalSkills = !IsValid(
              TechnicalSkillValue[0].TechnicalSkills.text
            );
            errors.LevelProficiency = !IsValid(
              TechnicalSkillValue[0].LevelProficiency.text
            );
            errors.RolePurpose = !IsValid(advDetails.RolePurpose);
            errors.JobDescription = !IsValid(advDetails.JobDescription);
            errors.ExperienceinMiningIndustry = !IsValid(
              advDetails.ExperienceinMiningIndustry
            );
            errors.TotalExperience = !IsValid(advDetails.TotalExperience);
          }
        }

        break;
      }

      case RoleID.HOD: {
        if (props.stateValue?.tab === "tab1") {
          errors.Comments = !IsValid(Comments);
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

  const MasterDataValidation = (): boolean => {
    const { addMasterQualification } = advDetails;

    let errors = {
      addMasterQualification: false,
    };

    errors.addMasterQualification = !IsValid(addMasterQualification);

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
      let QualificatioDetails: {
        MinQualification: string;
      }[] = [];
      let PrefeQualification: {
        PrefeQualification: string;
      }[] = [];
      let RoleSpecificKnowledgeJson: {
        RoleSpeKnowledge: string;
        RequiredLevel: string;
      }[] = [];

      let TechnicalSkillsKnowledgeJson: {
        TechnicalSkills: string;
        LevelProficiency: string;
      }[] = [];

      TechnicalSkillValue.forEach((item) => {
        let TechnicalSkillsData = {
          TechnicalSkills: item.TechnicalSkills.text,
          LevelProficiency: item.LevelProficiency.text,
        };
        TechnicalSkillsKnowledgeJson.push(TechnicalSkillsData);
      });

      RoleSpeKnowledgeValue.forEach((item) => {
        let details = {
          RoleSpeKnowledge: item.RoleSpeKnowledge.text,
          RequiredLevel: item.RequiredLevel.text,
        };
        RoleSpecificKnowledgeJson.push(details);
      });

      QualificationValue.forEach((item) => {
        let details = {
          MinQualification: item.MinQualification.text,
        };
        QualificatioDetails.push(details);
      });
      QualificationValue.forEach((item) => {
        let details = {
          PrefeQualification: item.PrefeQualification.text,
        };
        PrefeQualification.push(details);
      });

      const isValid = !Validation();

      if (isValid) {
        let Table1: any = {
          // VRRID: formState.VRRID,
          BusinessUnitCodeId: formState.BusinessUnitCodeID,
          Nationality: formState.Nationality,
          EmploymentCategory: formState.EmployementCategory,
          DepartmentId: formState.DepartmentID,
          SubDepartmentId: formState.SubDepartmentID,
          SectionId: formState.SectionID,
          DepartmentCodeId: formState.DepartmentCodeID,
          NumberOfPersonNeeded: formState.NoofPositionAssigned,
          EnterNumberOfMonths: formState.EnterNumberOfMonths,
          TypeOfContract: formState.ContractType,
          DateRequried: formState.DateRequried,
          IsRevert: formState.IsRevert,
          ReasonForVacancy: formState.ReasonForVacancy,
          AreaofWork: formState.AreaOfWork,
          JobCodeId: formState.JobCodeID,
          VacancyConfirmed: formState.VacancyConfirmed,
          RecruitmentAuthorised: formState.RecruitmentAuthorised,
          IsPayrollEmailed: formState.IsPayrollEmailed,
          AssignedHRId: formState.AssignRecruitmentHR.key,
          ActionId: WorkflowAction.Approved,
        };

        console.log(Table1, "Table1");
        const obj: any = {
          ActionId: WorkflowAction.Approved,
        };
        if (formState.Comments) {
          const commentsData: InsertComments = {
            RoleId: props.CurrentRoleID,
            RecruitmentIDId: props.stateValue?.ID,
            Comments: formState.Comments,
          };
          console.log(commentsData, "commentsData");

          const InsertCommentsData = await getVRRDetails.InsertCommentsList(
            commentsData
          );
          console.log(InsertCommentsData, "InsertCommentsData");
        }

        switch (props.CurrentRoleID) {
          case RoleID.RecruitmentHRLead: {
            if (formState.OnamSignedStampsAttchment.length > 0) {
              await handleAttachement(
                formState.JobCode,
                props.stateValue?.ID,
                DocumentLibraray.ONAMSignedStampDocuments,
                formState.OnamSignedStampsAttchment
              );
              const UpdateVRRDetails = await SPServices.SPUpdateItem({
                Listname: ListNames.HRMSRecruitmentDptDetails,
                RequestJSON: obj,
                ID: props.stateValue?.ID,
              });
              console.log(UpdateVRRDetails);
              resetForm();
              let CancelAlert = {
                Message: RecuritmentHRMsg.ONEMDocumentMsg,
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
              setalertProps(CancelAlert);
              setIsLoading(false);
            } else {
              try {
                const response = await getVRRDetails.InsertRecruitmentDpt(
                  Table1,
                  formState.PositionDetails
                );
                const commentsData: InsertComments = {
                  RoleId: props.CurrentRoleID,
                  RecruitmentIDId: response.data?.[0]?.data?.RecruitmentIDId,
                  Comments: formState.Comments,
                };
                console.log(commentsData, "commentsData");

                const InsertCommentsData =
                  await getVRRDetails.InsertCommentsList(commentsData);
                console.log(InsertCommentsData, "InsertCommentsData");

                const UpdateVRRDetails = await SPServices.SPUpdateItem({
                  Listname: ListNames.HRMSVacancyReplacementRequest,
                  RequestJSON: obj,
                  ID: formState?.VRRID,
                });
                console.log(UpdateVRRDetails, "UpdateVRRDetails");

                if (response.status == 200) {
                  resetForm();

                  let CancelAlert = {
                    Message: RecuritmentHRMsg.RecuritmentSubmitMsg,
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
                  setalertProps(CancelAlert);
                  setIsLoading(false);
                }

                console.log(response);
              } catch (error) {
                console.error("An error occurred:", error.message || error);
              }
            }
            setIsLoading(true);

            break;
          }
          case RoleID.RecruitmentHR: {
            const AttachDocument = await handleAttachement(
              formState.JobCode,
              props.stateValue?.ID,
              DocumentLibraray.RecruitmentAdvertisementDocument,
              formState.AdvertisementAttachement
            );
            const UpdateVRRDetails = await SPServices.SPUpdateItem({
              Listname: ListNames.HRMSRecruitmentDptDetails,
              RequestJSON: obj,
              ID: props.stateValue?.ID,
            });
            let AdvData: any = {
              Qualification: JSON.stringify(QualificatioDetails),
              PreferredQualification: JSON.stringify(PrefeQualification),
              JobDescription: advDetails.JobDescription,
              RoleProfile: advDetails.RolePurpose,
              RoleSpecificKnowledgeJson: JSON.stringify(
                RoleSpecificKnowledgeJson
              ),
              TechnicalSkillsKnowledgeJson: JSON.stringify(
                RoleSpecificKnowledgeJson
              ),
              RecruitmentIDId: props.stateValue?.ID,
              YearofExperience: Number(advDetails.TotalExperience),
              PreferredExperience: Number(
                advDetails.ExperienceinMiningIndustry
              ),
            };
            console.log(AdvData, "AdvData");
            const InsertAdveData = await getVRRDetails.InsertList(
              AdvData,
              ListNames.HRMSRecruitmentRoleProfileDetails
            );
            console.log(InsertAdveData, "InsertAdveData");

            console.log(UpdateVRRDetails, "UpdateVRRDetails");
            resetForm();

            let UpdateAlert = {
              Message: RecuritmentHRMsg.AdvertisementSubmitMsg,
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
            setalertProps(UpdateAlert);
            setIsLoading(false);
            console.log(AttachDocument, "AttachDocument");

            break;
          }
          case RoleID.HOD: {
            const UpdateVRRDetails = await SPServices.SPUpdateItem({
              Listname: ListNames.HRMSRecruitmentDptDetails,
              RequestJSON: obj,
              ID: props.stateValue?.ID,
            });
            console.log(UpdateVRRDetails, "UpdateVRRDetails");
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
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInitialized = useRef(false);

  useEffect(() => {
    const initialize = async () => {
      if (isInitialized.current) return; // Skip if already initialized
      isInitialized.current = true;

      setTabVisibility({
        tab1: true,
        tab2: false,
        tab3: false,
      });
      // if (props.CurrentRoleID === RoleID.HOD) {
      //     setButtonLabel("Approve")
      // } else if ((props.CurrentRoleID === RoleID.RecruitmentHR)) {
      //     setButtonLabel("Submit")
      // }

      await fetchData();
    };

    void initialize();
  }, []);

  useEffect(() => {
    const getADGroupsOption = async () => {
      try {
        const AssignRecurtimentHROption =
          await CommonServices.GetADgruopsEmailIDs(ADGroupID.HRMSRecruitmentHR);
        const AssignAgenciesOption = await CommonServices.GetADgruopsEmailIDs(
          ADGroupID.HRMSHOD
        );

        if (
          (AssignRecurtimentHROption.status === 200 &&
            AssignRecurtimentHROption.data) ||
          (AssignAgenciesOption.status === 200 && AssignAgenciesOption.data)
        ) {
          const AssignRecrutiment = AssignRecurtimentHROption.data.filter(
            (item: { key: any }) => item.key === props.stateValue?.AssignedHRId
          );
          console.log(AssignRecrutiment, "AssignRecrutiment");

          const AssignRecrutimentObject = AssignRecrutiment.reduce(
            (acc: { [key: string]: any }, item: { key: any }) => {
              return item;
            },
            {}
          );
          // const AssignAgencies = AssignAgenciesOption.data.filter(
          //     (item: { key: any }) => item.key === props.stateValue?.rowData?.AssignedHRId
          // );
          // console.log(AssignAgencies, "AssignAgencies");

          // const AssignAgenciesObject = AssignAgencies.reduce(
          //     (acc: { [key: string]: any }, item: { key: any }) => {
          //         return item;
          //     },
          //     {}
          // );

          console.log(AssignRecrutimentObject, "AssignRecrutimentObject");
          setFormState((prevState: any) => ({
            ...prevState,
            AssignRecruitmentHROption: AssignRecurtimentHROption.data,
            AssignRecruitmentHR: AssignRecrutimentObject,
            AssignAgenciesOption: AssignAgenciesOption.data,
            // AssignAgencies: AssignAgenciesObject
          }));
        } else {
          console.error(
            "Error retrieving attachments:",
            AssignRecurtimentHROption.data.message
          );
        }
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    };

    void getADGroupsOption();
  }, []);

  useEffect(() => {
    const validationAttachment = async () => {
      if (formState.OnamSignedStampsAttchment.length > 0) {
        setValidationError((prevState: any) => ({
          ...prevState,
          OnamSignedStampsDocument: false,
        }));
      }
      if (formState.AdvertisementAttachement.length > 0) {
        setValidationError((prevState: any) => ({
          ...prevState,
          AdvertisementDocument: false,
        }));
      }
    };

    void validationAttachment();
  }, [formState.OnamSignedStampsAttchment, formState.AdvertisementAttachement]);

  useEffect(() => {
    if (
      props.CurrentRoleID === RoleID.RecruitmentHR &&
      props.stateValue?.StatusId ===
        StatusId.PendingwithRecruitmentHRtouploadAdv
    ) {
      const MasterDataOption = async () => {
        // Fetch Qualification data
        const Qualification = await CommonServices.GetMasterData(
          ListNames.HRMSQualification
        );
        console.log(Qualification, "Qualification");
        const QualificationOption: AutoCompleteItem[] = Qualification.data.map(
          (item: any) => ({
            key: item.Id,
            text: item.Qualification,
          })
        );

        // Fetch RoleSpecificKnowledge data
        const RoleSpecificKnowlege = await CommonServices.GetMasterData(
          ListNames.HRMSRoleSpecificKnowlegeMaster
        );
        console.log(RoleSpecificKnowlege, "RoleSpecificKnowlege");
        const RoleSpecificKnowlegeOption: AutoCompleteItem[] =
          RoleSpecificKnowlege.data.map((item: any) => ({
            key: item.Id,
            text: item.RoleSpecificKnowledge,
          }));

        // Fetch TechnicalSkills data
        const TechnicalSkills = await CommonServices.GetMasterData(
          ListNames.HRMSTechnicalSkills
        );
        console.log(TechnicalSkills, "TechnicalSkills");
        const TechnicalSkillsOption: AutoCompleteItem[] =
          TechnicalSkills.data.map((item: any) => ({
            key: item.Id,
            text: item.TechnicalSkills,
          }));

        // Fetch LevelOfProficiency data
        const LevelOfProficiency = await CommonServices.GetMasterData(
          ListNames.HRMSLevelOfProficiency
        );
        console.log(LevelOfProficiency, "HRMSLevelOfProficiency");
        const LevelOfProficiencyOption: AutoCompleteItem[] =
          LevelOfProficiency.data.map((item: any) => ({
            key: item.Id,
            text: item.Levels,
          }));

        setAdvDetails((prevState) => ({
          ...prevState,
          MinQualificationOption: QualificationOption,
          PrefeQualificationOption: QualificationOption,
          RoleSpeKnowledgeoption: RoleSpecificKnowlegeOption,
          TechnicalSkillsOption: TechnicalSkillsOption,
          LevelProficiencyOption: LevelOfProficiencyOption,
          RequiredLeveloption: LevelOfProficiencyOption,
        }));

        console.log(QualificationOption, "QualificationOption");
      };

      void MasterDataOption();
    }
  }, [AddQualifbtn]);
  useEffect(() => {
    if (
      props.CurrentRoleID === RoleID.HOD &&
      props.stateValue?.StatusId === StatusId.PendingwithHODtoreviewAdv
    ) {
      const fetchData = async () => {
        try {
          let filterConditions = [
            {
              FilterKey: "RecruitmentIDId",
              Operator: "eq",
              FilterValue: props.stateValue.ID,
            },
          ];
          const response =
            await getVRRDetails.GetHRMSRecruitmentRoleProfileDetails(
              filterConditions,
              ""
            );

          if (response.status === 200) {
            const data = response.data;
            if (data && data.length > 0) {
              const rawData = data[0];
              const roleSpecificKnowledge = rawData.RoleSpecificKnowledgeJson
                ? JSON.parse(rawData.RoleSpecificKnowledgeJson)
                : [];

              console.log("roleSpecificKnowledge", roleSpecificKnowledge);
              const RoleSpeKnowledgeValues = roleSpecificKnowledge.map(
                (item: any) => item.RoleSpeKnowledge
              );
              console.log("RoleSpeKnowledgeValues1", RoleSpeKnowledgeValues);
              const RequiredLevelValues = roleSpecificKnowledge.map(
                (item: any) => item.RequiredLevel
              );
              console.log("RequiredLevelValues2", RequiredLevelValues);
              const mappedData: AdvDetails = {
                RolePurpose: rawData.RoleProfile || "",
                JobDescription: rawData.JobDescription || "",
                RoleSpeKnowledgeoption: RoleSpeKnowledgeValues,
                RequiredLeveloption: RequiredLevelValues,
                MinQualificationOption: rawData.Qualification
                  ? JSON.parse(rawData.Qualification).map((item: any) => ({
                      text: item.MinQualification,
                    }))
                  : [],
                PrefeQualificationOption: rawData.PreferredQualification
                  ? JSON.parse(rawData.PreferredQualification).map(
                      (item: any) => ({
                        text: item.PrefeQualification,
                      })
                    )
                  : [],
                TotalExperience: rawData.YearofExperience || "",
                ExperienceinMiningIndustry: rawData.PreferredExperience || "",
                TechnicalSkillsOption: rawData.TechnicalSkillsKnowledgeJson
                  ? JSON.parse(rawData.TechnicalSkillsKnowledgeJson).map(
                      (item: any) => ({
                        text: item.RoleSpeKnowledge,
                      })
                    )
                  : [],
                LevelProficiencyOption: rawData.TechnicalSkillsKnowledgeJson
                  ? JSON.parse(rawData.TechnicalSkillsKnowledgeJson).map(
                      (item: any) => ({
                        text: item.RequiredLevel,
                      })
                    )
                  : [],
                addMasterQualification: "",
                YearofExperience: rawData.YearofExperience || "",
                PreferredExperience: rawData.PreferredExperience || "",
              };

              setAdvDetails(mappedData);
              console.log("Updated AdvDetails State:", mappedData);
            } else {
              console.warn("No data found for the given filter");
            }
          } else {
            console.error("Error fetching data: ", response.message);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      void fetchData();
    }
  }, [props.CurrentRoleID, props.stateValue?.StatusId]);
  const handleDelete = (
    index: number,
    attachmentType:
      | "AdvertisementAttachement"
      | "OnamSignedStampsAttchment"
      | "CandidateCVAttachment"
  ) => {
    console.log("Deleting attachment at index:", index, "from", attachmentType);

    setFormState((prevState) => {
      const updatedAttachments = [...prevState[attachmentType]];
      updatedAttachments.splice(index, 1);

      return {
        ...prevState,
        [attachmentType]: updatedAttachments,
      };
    });
  };

  // const handleAutoComplete = async (
  //     item: AutoCompleteItem | null,
  //     StateValue: string,
  //     tab: string
  // ) => {
  //     if (item) {
  //         if (tab === 'tab2') {
  //             setAdvDetails((prevState) => ({
  //                 ...prevState,
  //                 [StateValue]: item
  //             }))
  //             setValidationError((prevState) => ({
  //                 ...prevState,
  //                 [StateValue]: false
  //             }))
  //         } else {
  //             setFormState((prevState) => ({
  //                 ...prevState,
  //                 [StateValue]: item
  //             }))
  //             setValidationError((prevState) => ({
  //                 ...prevState,
  //                 [StateValue]: false
  //             }))
  //         }

  //     }
  // };

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
      console.log(CommentsList.data);
      setCommentsData(CommentsList.data);
    }
  };

  const AddMasterData_fn = (Header: string, LabelValue: string) => {
    setAddQualifbtn(true);
    setHeaderValue(Header);
    setLabelValue(LabelValue);
  };

  const handleRichTextEditor = (value: string | any, StateValue: string) => {
    setAdvDetails((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationError((prevState) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const handleInputChange = (value: string | any, StateValue: string) => {
    debugger;
    setAdvDetails((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationError((prevState) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const tabs = [
    {
      label: TabName.PositionDetails, //"Position Details",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 7px 4px 3px #d3d3d3",
            border: "0px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "30px",
            marginTop: "2%",
          }}
        >
          <CardContent>
            {tabVisibility.tab1 && (
              <div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Job Title - ${formState.JobNameInEnglish}" " +" "(${formState.JobCode})`}
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
                  {/*                                    
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Position Name (English)"
                                            value={formState.JobNameInEnglish}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, JobNameInEnglish: value }))
                                            }
                                        />
                                    </div>
                                    <div className="ms-Grid-col ms-lg3">
                                        <CustomInput
                                            label="Position Name (French)"
                                            value={formState.JobNameInFrench}
                                            disabled={true}
                                            mandatory={false}
                                            onChange={(value) =>
                                                setFormState((prevState) => ({ ...prevState, JobNameInFrench: value }))
                                            }
                                        />
                                    </div> */}
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
                    <CustomViewDocument
                      Attachment={formState.RoleProfileDocument}
                      Label={"Role Profile Documents"}
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg3">
                    <CustomViewDocument
                      Attachment={formState.GradingDocument}
                      Label={"Grading Documents"}
                    />
                  </div>
                </div>

                {props.CurrentRoleID === RoleID.RecruitmentHR &&
                props.stateValue?.StatusId ===
                  StatusId.PendingwithRecruitmentHRtouploadAdv ? (
                  <></>
                ) : (
                  <>
                    {/* {props.stateValue?.StatusId ===
                      StatusId.PendingwithHODtoreviewAdv && (
                      <>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg6">
                            <CustomViewDocument
                              Attachment={formState.AdvertisementDocument}
                              Label={"Advertisement Documents"}
                            />
                          </div>
                        </div>
                      </>
                    )} */}

                    {props.stateValue?.StatusId ===
                      StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
                      <>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg6">
                            <CustomViewDocument
                              Attachment={formState.AdvertisementDocument}
                              Label={"Advertisement Documents"}
                            />
                          </div>
                        </div>

                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg3">
                            <CustomLabel value={"ONEM Signed Doc"} />
                            <AttachmentButton
                              label="Upload"
                              // iconName="CloudUpload"
                              // iconNameHover="CloudUpload"
                              AttachState={(newAttachments: Item[]) => {
                                // Directly update state here
                                setFormState((prevState: any) => ({
                                  ...prevState,
                                  OnamSignedStampsAttchment: [
                                    ...prevState.OnamSignedStampsAttchment,
                                    ...newAttachments,
                                  ],
                                }));
                              }}
                              mandatory={true}
                              error={validationErrors.OnamSignedStampsDocument}
                              Style={{ padding: "2%" }}
                            />
                          </div>
                          <div
                            className="ms-Grid-col ms-lg6"
                            style={{ marginTop: "4%" }}
                          >
                            {console.log(
                              "OnamSignedStampsAttchment",
                              formState.OnamSignedStampsAttchment
                            )}
                            {formState.OnamSignedStampsAttchment?.map(
                              (file: any, index: number) => {
                                const fileName = file.fileName || file.name; // Ensure proper name display
                                console.log("Rendering file:", fileName);

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
                                              handleDelete(
                                                index,
                                                "OnamSignedStampsAttchment"
                                              )
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
                      </>
                    )}

                    {props.stateValue?.StatusId ===
                      StatusId.PendingwithRecruitmentHRtoAssignExternalAgency && (
                      <>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg6">
                            <CustomViewDocument
                              Attachment={formState.AdvertisementDocument}
                              Label={"Advertisement Documents"}
                            />
                          </div>
                        </div>

                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg6">
                            <CustomViewDocument
                              Attachment={formState.OnamSignedStampsDocument}
                              Label={"ONEM Signed&Stamps Documents"}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {props.stateValue?.type === "VRR" ? (
                      <></>
                    ) : (
                      <>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg12">
                            <div
                              className="ms-Grid-col ms-lg4"
                              style={{ marginLeft: "-5px" }}
                            >
                              <CustomLabel value={" View Justifications"} />
                              <PrimaryButton
                                style={{
                                  borderColor: "rgb(205, 45, 45)",
                                  backgroundColor: "#EF3340",
                                  color: "white",
                                  borderRadius: "10px",
                                }}
                                onClick={OpenComments}
                              >
                                {" "}
                                View
                              </PrimaryButton>
                              {/* <ReuseButton
                                                                label="VIEW"
                                                                onClick={OpenComments}
                                                                spacing={4}
                                                            // imgSrc={require("../../assets/Viewicon.svg")}
                                                            // imgAlt="ViewIcon"
                                                            // imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                                            // imgAltHover="Image"
                                                            /> */}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {props.stateValue?.StatusId ===
                      StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
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
                              label={
                                "I hereby agree for submitted this request"
                              }
                              checked={Checkbox}
                              error={validationErrors.Checkboxalidation}
                              onChange={(value: boolean) => setCheckbox(value)}
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
            )}
          </CardContent>
        </Card>
      ),
    },
    ...((props.CurrentRoleID === RoleID.RecruitmentHR &&
      props.stateValue?.StatusId ===
        StatusId.PendingwithRecruitmentHRtouploadAdv) ||
    (props.CurrentRoleID === RoleID.HOD &&
      props.stateValue?.StatusId === StatusId.PendingwithHODtoreviewAdv)
      ? [
          {
            label:
              props.CurrentRoleID === RoleID.HOD
                ? TabName.AdvertisementViewDetails
                : TabName.AdvertisementDetails,
            value: "tab2",
            content: (
              <Card
                variant="outlined"
                sx={{
                  boxShadow: "0px 7px 4px 3px #d3d3d3",
                  border: "0px solid rgba(0, 0, 0, 0.12)",
                  marginTop: "2%",
                }}
              >
                <CardContent>
                  <div>
                    <>
                      {props.CurrentRoleID === RoleID.RecruitmentHR &&
                        props.stateValue?.StatusId ===
                          StatusId.PendingwithRecruitmentHRtouploadAdv && (
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg3">
                              <Labelheader value={"Advertisement"}>
                                {" "}
                              </Labelheader>
                              <AttachmentButton
                                label="Upload"
                                // iconName="CloudUpload"
                                // iconNameHover="CloudUpload"
                                AttachState={(newAttachments: Item[]) => {
                                  setFormState((prevState: any) => ({
                                    ...prevState,
                                    AdvertisementAttachement: [
                                      ...prevState.AdvertisementAttachement,
                                      ...newAttachments,
                                    ],
                                  }));
                                  setValidationError((prevState: any) => ({
                                    ...prevState,
                                    AdvertisementDocument: false,
                                  }));
                                }}
                                mandatory={true}
                                error={validationErrors.AdvertisementDocument}
                              />
                            </div>
                            <div
                              className="ms-Grid-col ms-lg6"
                              style={{ marginTop: "4%" }}
                            >
                              {console.log(
                                "checking",
                                formState.AdvertisementAttachement
                              )}
                              {formState.AdvertisementAttachement?.map(
                                (file: any, index: number) => {
                                  const fileName = file.fileName || file.name; // Ensure proper name display
                                  console.log("Rendering file:", fileName);

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
                                                handleDelete(
                                                  index,
                                                  "AdvertisementAttachement"
                                                )
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
                        )}
                      <div>
                        {props.CurrentRoleID === RoleID.HOD &&
                          props.stateValue?.StatusId ===
                            StatusId.PendingwithHODtoreviewAdv && (
                            <>
                              <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg6">
                                  <CustomViewDocument
                                    Attachment={formState.AdvertisementDocument}
                                    Label={"Advertisement Documents"}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                      </div>
                      {props.CurrentRoleID === RoleID.HOD &&
                        props.stateValue?.StatusId ===
                          StatusId.PendingwithHODtoreviewAdv && (
                          <div className="ms-Grid-row">
                            <div
                              className="ms-Grid-col ms-lg2"
                              style={{ position: "relative", right: "1px" }}
                            >
                              <div>
                                <Label>View Advertisement</Label>
                                <ReuseButton
                                  Style={{
                                    minWidth: "117px",
                                    fontSize: "13px",
                                    paddingBottom: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "41px",
                                    paddingTop: "22px",
                                  }}
                                  label="VIEW"
                                  imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                                  onClick={async () => {
                                    setPreview(true);
                                    setMainComponent(false);
                                    console.log("Preview", Preview);
                                  }}
                                  imgAltHover="Image"
                                  spacing={4}
                                  imgSrc={require("../../assets/Viewicon.svg")}
                                  imgAlt="ssss"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      {props.CurrentRoleID === RoleID.RecruitmentHR &&
                        props.stateValue?.StatusId ===
                          StatusId.PendingwithRecruitmentHRtouploadAdv && (
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12">
                              <RichTextEditor
                                label="Role Purpose"
                                value={advDetails.RolePurpose}
                                mandatory={true}
                                onChange={(value) =>
                                  handleRichTextEditor(value, "RolePurpose")
                                }
                                error={validationErrors.RolePurpose}
                              />
                            </div>
                          </div>
                        )}

                      {props.CurrentRoleID === RoleID.RecruitmentHR &&
                        props.stateValue?.StatusId ===
                          StatusId.PendingwithRecruitmentHRtouploadAdv && (
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
                        )}
                      {props.CurrentRoleID === RoleID.RecruitmentHR &&
                        props.stateValue?.StatusId ===
                          StatusId.PendingwithRecruitmentHRtouploadAdv && (
                          <div className="ms-Grid-col ms-lg10">
                            <div className="ms-Grid-row">
                              <div className="ms-Grid-col ms-lg5">
                                <CustomInput
                                  label="Total Experience"
                                  value={advDetails.TotalExperience}
                                  disabled={false}
                                  error={false}
                                  mandatory={true}
                                  onChange={(value) =>
                                    handleInputChange(value, "TotalExperience")
                                  }
                                />
                              </div>
                              <div className="ms-Grid-col ms-lg5">
                                <CustomInput
                                  label="Experience in Mining Industry (Years)"
                                  value={advDetails.ExperienceinMiningIndustry}
                                  disabled={false}
                                  error={false}
                                  mandatory={true}
                                  onChange={(value) =>
                                    handleInputChange(
                                      value,
                                      "ExperienceinMiningIndustry"
                                    )
                                  }
                                />
                              </div>
                              <div
                                className="ms-Grid-col ms-lg2"
                                style={{
                                  textAlign: "right",
                                  marginTop: "45px",
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                      {props.CurrentRoleID === RoleID.RecruitmentHR &&
                        props.stateValue?.StatusId ===
                          StatusId.PendingwithRecruitmentHRtouploadAdv && (
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg10">
                              {QualificationValue.map((row, index) => (
                                <div className="ms-Grid-row" key={index}>
                                  <div className="ms-Grid-col ms-lg5">
                                    <CustomAutoComplete
                                      label="Minimum Qualification"
                                      options={
                                        advDetails.MinQualificationOption
                                      }
                                      value={row.MinQualification}
                                      disabled={false}
                                      mandatory={true}
                                      onChange={(item) =>
                                        handleAutoCompleterow(
                                          item,
                                          "MinQualification",
                                          index,
                                          "QualificationValue"
                                        )
                                      }
                                      error={false}
                                    />
                                  </div>
                                  <div className="ms-Grid-col ms-lg5">
                                    <CustomAutoComplete
                                      label="Preferred Qualification"
                                      options={
                                        advDetails.PrefeQualificationOption
                                      }
                                      value={row.PrefeQualification}
                                      disabled={false}
                                      mandatory={true}
                                      onChange={(item) =>
                                        handleAutoCompleterow(
                                          item,
                                          "PrefeQualification",
                                          index,
                                          "QualificationValue"
                                        )
                                      }
                                      error={false}
                                    />
                                  </div>
                                  <div
                                    className="ms-Grid-col ms-lg2"
                                    style={{
                                      textAlign: "right",
                                      marginTop: "45px",
                                    }}
                                  >
                                    {index > 0 ? (
                                      <>
                                        <PrimaryButton
                                          style={{
                                            borderColor: "rgb(205, 45, 45)",
                                            backgroundColor: "#EF3340",
                                            color: "white",
                                            borderRadius: "10px",
                                            marginRight: "4%",
                                            minWidth: "60px",
                                          }}
                                          onClick={() =>
                                            handleDeleteRow(
                                              index,
                                              RoleDescription.QualificationValue
                                            )
                                          }
                                          iconProps={{
                                            iconName: "Delete",
                                            style: { color: "white" },
                                          }}
                                        ></PrimaryButton>
                                        <PrimaryButton
                                          style={{
                                            borderColor: "rgb(205, 45, 45)",
                                            backgroundColor: "#EF3340",
                                            color: "white",
                                            borderRadius: "10px",
                                            minWidth: "60px",
                                          }}
                                          onClick={() =>
                                            handleAddRow(
                                              RoleDescription.QualificationValue
                                            )
                                          }
                                          iconProps={{
                                            iconName: "Add",
                                            style: { color: "white" },
                                          }}
                                        ></PrimaryButton>
                                      </>
                                    ) : (
                                      <PrimaryButton
                                        style={{
                                          borderColor: "rgb(205, 45, 45)",
                                          backgroundColor: "#EF3340",
                                          color: "white",
                                          borderRadius: "10px",
                                          minWidth: "60px",
                                        }}
                                        onClick={() =>
                                          handleAddRow(
                                            RoleDescription.QualificationValue
                                          )
                                        }
                                        iconProps={{
                                          iconName: "Add",
                                          style: { color: "white" },
                                        }}
                                      ></PrimaryButton>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div
                              className="ms-Grid-col ms-lg2"
                              style={{
                                marginTop: "45px",
                              }}
                            >
                              <PrimaryButton
                                style={{
                                  borderColor: "rgb(205, 45, 45)",
                                  backgroundColor: "#EF3340",
                                  color: "white",
                                  borderRadius: "10px",
                                }}
                                onClick={() =>
                                  AddMasterData_fn(
                                    RoleDescriptionData.Qualification,
                                    "Add Qualification"
                                  )
                                }
                                iconProps={{
                                  iconName: "Add",
                                  style: { color: "white" },
                                }}
                              >
                                {" "}
                                Add New Item
                              </PrimaryButton>
                            </div>
                          </div>
                        )}

                      {props.CurrentRoleID === RoleID.RecruitmentHR &&
                        props.stateValue?.StatusId ===
                          StatusId.PendingwithRecruitmentHRtouploadAdv && (
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg10">
                              {RoleSpeKnowledgeValue.map((row, index) => (
                                <div className="ms-Grid-row" key={index}>
                                  <div className="ms-Grid-col ms-lg5">
                                    <CustomAutoComplete
                                      label="Role Specific Knowledge"
                                      options={
                                        advDetails.RoleSpeKnowledgeoption
                                      }
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
                                      error={false}
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
                                      error={false}
                                    />
                                  </div>
                                  <div
                                    className="ms-Grid-col ms-lg2"
                                    style={{
                                      textAlign: "right",
                                      marginTop: "45px",
                                    }}
                                  >
                                    {index > 0 ? (
                                      <>
                                        <PrimaryButton
                                          style={{
                                            borderColor: "rgb(205, 45, 45)",
                                            backgroundColor: "#EF3340",
                                            color: "white",
                                            borderRadius: "10px",
                                            marginRight: "4%",
                                            minWidth: "60px",
                                          }}
                                          onClick={() =>
                                            handleDeleteRow(
                                              index,
                                              RoleDescription.RoleSpeKnowledgeValue
                                            )
                                          }
                                          iconProps={{
                                            iconName: "Delete",
                                            style: { color: "white" },
                                          }}
                                        ></PrimaryButton>
                                        <PrimaryButton
                                          style={{
                                            borderColor: "rgb(205, 45, 45)",
                                            backgroundColor: "#EF3340",
                                            color: "white",
                                            borderRadius: "10px",
                                            minWidth: "60px",
                                          }}
                                          onClick={() =>
                                            handleAddRow(
                                              RoleDescription.RoleSpeKnowledgeValue
                                            )
                                          }
                                          iconProps={{
                                            iconName: "Add",
                                            style: { color: "white" },
                                          }}
                                        ></PrimaryButton>
                                      </>
                                    ) : (
                                      <PrimaryButton
                                        style={{
                                          borderColor: "rgb(205, 45, 45)",
                                          backgroundColor: "#EF3340",
                                          color: "white",
                                          borderRadius: "10px",
                                          minWidth: "60px",
                                        }}
                                        onClick={() =>
                                          handleAddRow(
                                            RoleDescription.RoleSpeKnowledgeValue
                                          )
                                        }
                                        iconProps={{
                                          iconName: "Add",
                                          style: { color: "white" },
                                        }}
                                      ></PrimaryButton>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div
                              className="ms-Grid-col ms-lg2"
                              style={{
                                marginTop: "45px",
                              }}
                            >
                              <PrimaryButton
                                style={{
                                  borderColor: "rgb(205, 45, 45)",
                                  backgroundColor: "#EF3340",
                                  color: "white",
                                  borderRadius: "10px",
                                }}
                                onClick={() =>
                                  AddMasterData_fn(
                                    RoleDescriptionData.RoleSpeKnowledge,
                                    "Add Role Specific Knowledge"
                                  )
                                }
                                iconProps={{
                                  iconName: "Add",
                                  style: { color: "white" },
                                }}
                              >
                                {" "}
                                Add New Item
                              </PrimaryButton>
                            </div>
                          </div>
                        )}

                      {props.CurrentRoleID === RoleID.RecruitmentHR &&
                        props.stateValue?.StatusId ===
                          StatusId.PendingwithRecruitmentHRtouploadAdv && (
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
                                        validationErrors.AssignRecruitmentHR
                                      }
                                    />
                                  </div>
                                  <div className="ms-Grid-col ms-lg5">
                                    <CustomAutoComplete
                                      label="Level of Proficiency"
                                      options={
                                        advDetails.LevelProficiencyOption
                                      }
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
                                        validationErrors.AssignRecruitmentHR
                                      }
                                    />
                                  </div>
                                  <div
                                    className="ms-Grid-col ms-lg2"
                                    style={{
                                      textAlign: "right",
                                      marginTop: "45px",
                                    }}
                                  >
                                    {index > 0 ? (
                                      <>
                                        <PrimaryButton
                                          style={{
                                            borderColor: "rgb(205, 45, 45)",
                                            backgroundColor: "#EF3340",
                                            color: "white",
                                            borderRadius: "10px",
                                            marginRight: "4%",
                                            minWidth: "60px",
                                          }}
                                          onClick={() =>
                                            handleDeleteRow(
                                              index,
                                              RoleDescription.TechnicalSkillValue
                                            )
                                          }
                                          iconProps={{
                                            iconName: "Delete",
                                            style: { color: "white" },
                                          }}
                                        ></PrimaryButton>
                                        <PrimaryButton
                                          style={{
                                            borderColor: "rgb(205, 45, 45)",
                                            backgroundColor: "#EF3340",
                                            color: "white",
                                            borderRadius: "10px",
                                            minWidth: "60px",
                                          }}
                                          onClick={() =>
                                            handleAddRow(
                                              RoleDescription.TechnicalSkillValue
                                            )
                                          }
                                          iconProps={{
                                            iconName: "Add",
                                            style: { color: "white" },
                                          }}
                                        ></PrimaryButton>
                                      </>
                                    ) : (
                                      <PrimaryButton
                                        style={{
                                          borderColor: "rgb(205, 45, 45)",
                                          backgroundColor: "#EF3340",
                                          color: "white",
                                          borderRadius: "10px",
                                          minWidth: "60px",
                                        }}
                                        onClick={() =>
                                          handleAddRow(
                                            RoleDescription.TechnicalSkillValue
                                          )
                                        }
                                        iconProps={{
                                          iconName: "Add",
                                          style: { color: "white" },
                                        }}
                                      ></PrimaryButton>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div
                              className="ms-Grid-col ms-lg2"
                              style={{
                                marginTop: "45px",
                              }}
                            >
                              <PrimaryButton
                                style={{
                                  borderColor: "rgb(205, 45, 45)",
                                  backgroundColor: "#EF3340",
                                  color: "white",
                                  borderRadius: "10px",
                                }}
                                onClick={() =>
                                  AddMasterData_fn(
                                    RoleDescriptionData.TechnicalSkill,
                                    "Add Technical Skills"
                                  )
                                }
                                iconProps={{
                                  iconName: "Add",
                                  style: { color: "white" },
                                }}
                              >
                                {" "}
                                Add New Item
                              </PrimaryButton>
                            </div>
                          </div>
                        )}

                      <CustomLabel value={" View Justifications"} />
                      <PrimaryButton
                        style={{
                          borderColor: "rgb(205, 45, 45)",
                          backgroundColor: "#EF3340",
                          color: "white",
                          borderRadius: "10px",
                        }}
                        onClick={OpenComments}
                      >
                        {" "}
                        View
                      </PrimaryButton>

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
                            label={"I hereby agree for submitted this request"}
                            checked={Checkbox}
                            error={validationErrors.Checkboxalidation}
                            onChange={(value: boolean) => setCheckbox(value)}
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
                  </div>
                </CardContent>
              </Card>
            ),
          },
        ]
      : []),
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
          props.navigation("/RecurimentProcess");
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

  async function InsertMasterData(Value: string) {
    debugger;
    const isValid = !MasterDataValidation();
    if (isValid) {
      let MasterData;
      switch (Value) {
        case RoleDescriptionData.Qualification:
          {
            MasterData = {
              Qualification: advDetails.addMasterQualification,
            };
            const InsertMasterData = await getVRRDetails.InsertList(
              MasterData,
              ListNames.HRMSQualification
            );
            console.log(InsertMasterData, "InsertMasterData");
          }
          break;
        case RoleDescriptionData.RoleSpeKnowledge:
          {
            MasterData = {
              RoleSpecificKnowledge: advDetails.addMasterQualification,
            };
            const InsertMasterData = await getVRRDetails.InsertList(
              MasterData,
              ListNames.HRMSRoleSpecificKnowlegeMaster
            );
            console.log(InsertMasterData, "InsertMasterData");
          }
          break;
        case RoleDescriptionData.TechnicalSkill:
          {
            MasterData = {
              TechnicalSkills: advDetails.addMasterQualification,
            };
            const InsertMasterData = await getVRRDetails.InsertList(
              MasterData,
              ListNames.HRMSTechnicalSkills
            );
            console.log(InsertMasterData, "InsertMasterData");
          }
          break;
      }
      console.log(MasterData, "MasterData");
      setAddQualifbtn(false);
    }
  }

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
    console.log("Breadcrumb changed to:", newItem);
  };

  console.log(SubmitBtn);

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
                onBreadcrumbChange={handleBreadcrumbChange}
                additionalButtons={
                  props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                  props.stateValue?.StatusId ===
                    StatusId.PendingwithHRLeadtoAssignRecruitmentHR
                    ? [
                        {
                          label: "Close",
                          onClick: async () => {
                            handleCancel();
                          },
                        },
                        // {
                        //     label: "Cancel",
                        //     onClick: async () => {
                        //         handleCancel();
                        //     },
                        // },
                        // {
                        //     label: "Preview",
                        //     onClick: async () => {
                        //         setPreviewBtn(true);
                        //         setMainComponent(false);
                        //     },
                        // },
                        // {
                        //     label: ButtonLabel,
                        //     onClick: async () => {
                        //         await SaveRecruitment();
                        //     },
                        //     disable: SubmitBtn
                        // },
                      ]
                    : props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                      props.stateValue?.StatusId ===
                        StatusId.PendingwithHRLeadtouploadONEMsigneddoc
                    ? [
                        {
                          label: "Cancel",
                          onClick: async () => {
                            handleCancel();
                          },
                          // disable: SubmitBtn
                        },
                        {
                          label: "Upload",
                          onClick: async () => {
                            await SaveRecruitment();
                          },
                          // disable: SubmitBtn
                        },
                      ]
                    : props.CurrentRoleID === RoleID.RecruitmentHR &&
                      props.stateValue?.StatusId ===
                        StatusId.PendingwithRecruitmentHRtouploadAdv
                    ? [
                        {
                          label: "Cancel",
                          onClick: async () => {
                            handleCancel();
                          },
                          // disable: SubmitBtn
                        },
                        {
                          label: "Preview",
                          onClick: async () => {
                            setPreviewBtn(true);
                            setMainComponent(false);
                          },
                          // disable: SubmitBtn
                        },
                        {
                          label: "Submit",
                          onClick: async () => {
                            await SaveRecruitment();
                          },
                          disable: SubmitBtn,
                        },
                      ]
                    : props.CurrentRoleID === RoleID.HOD &&
                      props.stateValue?.StatusId ===
                        StatusId.PendingwithHODtoreviewAdv
                    ? [
                        {
                          label: "Cancel",
                          onClick: async () => {
                            handleCancel();
                          },
                          // disable: SubmitBtn
                        },
                        {
                          label: "Approved",
                          onClick: async () => {
                            await SaveRecruitment();
                          },
                        },
                      ]
                    : []
                }
              />
              {/* <TabsComponent
                                tabs={tabs}
                                initialTab={activeTab}
                                handleCancel={handleCancel}
                                additionalButtons={
                                    advDetails.RolePurpose
                                        ? [
                                            {
                                                label: "Preview",
                                                onClick: async () => {
                                                    setPreviewBtn(true);
                                                    setMainComponent(false);
                                                },
                                            },
                                            {
                                                label: ButtonLabel,
                                                onClick: async () => {
                                                    await SaveRecruitment();
                                                },
                                                disable: SubmitBtn
                                            },
                                        ]
                                        : [
                                            {
                                                label: ButtonLabel,
                                                onClick: async () => {
                                                    await SaveRecruitment();
                                                },
                                                // disable: SubmitBtn
                                            },
                                        ]
                                }
                            /> */}
            </div>
          </CustomLoader>
        </>
      ) : PreviewBtn ? (
        <>
          <PreviewScreen
            data={advDetails}
            onclose={() => {
              setPreviewBtn(false);
              setMainComponent(true);
              setactiveTab("tab2");
            }}
            Ok_btnfn={() => {
              setSubmitBtn(false);
              setPreviewBtn(false);
              setMainComponent(true);
              setactiveTab("tab2");
            }}
            RoleSpec={RoleSpeKnowledgeValue}
            Qualification={QualificationValue}
            TechinicalSkills={TechnicalSkillValue}
          />
        </>
      ) : Preview ? (
        <CustomPreviewScreen
          data={advDetails}
          onclose={() => {
            setPreview(false);
            setMainComponent(true);
            setactiveTab("tab2");
          }}
          Ok_btnfn={() => {
            setPreview(false);
            setSubmitBtn(false);
            setMainComponent(true);
            setactiveTab("tab2");
          }}
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

      {AddQualifbtn && (
        <>
          <Dialog
            header={
              <>
                <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                  <div className="ms-Grid-col ms-lg12">
                    <LabelHeaderComponents value={HeaderValue} />
                  </div>
                </div>
              </>
            }
            visible={AddQualifbtn}
            style={{
              width: "26vw",
              backgroundColor: "white",
              borderRadius: "26px",
              padding: "20px",
            }}
            onHide={() => setAddQualifbtn(false)}
          >
            <div className="ms-Grid-row" style={{ marginLeft: "6%" }}>
              <div className="ms-Grid-col ms-lg8">
                <CustomInput
                  label={LabelValue}
                  value={advDetails.addMasterQualification}
                  disabled={false}
                  mandatory={true}
                  onChange={(value) =>
                    setAdvDetails((prevState) => ({
                      ...prevState,
                      addMasterQualification: value,
                    }))
                  }
                />
              </div>
            </div>

            <div
              className="ms-Grid-row"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5%",
              }}
            >
              <ReuseButton
                label="Add"
                onClick={() => InsertMasterData(HeaderValue)}
                spacing={4}
              />
            </div>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ApprovedVRREdit;
