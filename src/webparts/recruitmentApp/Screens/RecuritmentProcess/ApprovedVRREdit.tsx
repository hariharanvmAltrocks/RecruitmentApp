import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import AttachmentButton from "../../components/AttachmentButton";
import {
  Choices,
  ColorCode,
  DataFrom,
  DocumentLibraray,
  HRMSAlertOptions,
  labelName,
  ListNames,
  Notes,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleDescription,
  RoleID,
  RoleProfileMaster,
  StatusId,
  TabName,
  WorkflowAction,
} from "../../utilities/Config";

import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomLabel from "../../components/CustomLabel";
import CustomTextArea from "../../components/CustomTextArea";
import {
  AdvDetails,
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
  DataSyncToRecruitmentResponse,
  InsertComments,
} from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomViewDocument from "../../components/CustomViewDocument";
import PreviewScreen from "./PreviewScreen";
import SPServices from "../../Services/SPService/SPServices";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import CustomSignature from "../../components/CustomSignature";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import CustomPreviewScreen from "./CustomPreviewScreen";
import CustomDatePicker from "../../components/CustomDatePicker";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
//import * as moment from "moment";
import { UploadAdvertisement } from "../ScreenComponent/UploadAdvertisement";
import CustomViewAttachment from "../../components/CustomViewAttachment";
// import { AdvertisementDetails, Descriptions, MinAndPreferedQualifications, RoleAndTechSkills } from "../../Models/ApIInterface";

export type roleSpeKnowledgeValidationErrors = {
  RoleSpeKnowledge: boolean;
  RequiredLevel: boolean;
};
export type technicalSkillsKnowledge = {
  TechnicalSkills: boolean;
  LevelProficiency: boolean;
};
export type formValidationEdit = {
  AssignRecruitmentHR: boolean;
  AssignAgencies: boolean;
  Comments: boolean;
  AdvertisementAttachement: boolean;
  OnamSignedStampsAttchment: boolean;
  MinQualification: boolean;
  PrefeQualification: boolean;
  RoleSpeKnowledgeValidation: roleSpeKnowledgeValidationErrors[];
  technicalSkillsKnowledge: technicalSkillsKnowledge[];
  RolePurpose: boolean;
  JobDescription: boolean;
  TotalExperience: boolean;
  ExperienceinMiningIndustry: boolean;
  addMasterQualification: boolean;
  Checkboxalidation: boolean;
  ValidFrom: boolean;
  ValidTo: boolean;
  JobFunctionalType: boolean;
  addMasterMinimumQualification: boolean;
  RoleProfile: boolean;
  Grading: boolean;
};

export type masterLibrary = {
  RoleProfile: IDocFiles[] | null;
  Grading: IDocFiles[] | null;
};

const ApprovedVRREdit: React.FC = (props: any) => {
  const todaydate = new Date();
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
    AdvertisementAttachement: [],
    JobcodeChecked: false,
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
  const [validationErrors, setValidationError] =
    React.useState<formValidationEdit>({
      AssignRecruitmentHR: false,
      AssignAgencies: false,
      Comments: false,
      AdvertisementAttachement: false,
      OnamSignedStampsAttchment: false,
      MinQualification: false,
      PrefeQualification: false,
      RoleSpeKnowledgeValidation: [],
      technicalSkillsKnowledge: [],
      RolePurpose: false,
      JobDescription: false,
      TotalExperience: false,
      ExperienceinMiningIndustry: false,
      addMasterQualification: false,
      Checkboxalidation: false,
      ValidFrom: false,
      ValidTo: false,
      JobFunctionalType: false,
      addMasterMinimumQualification: false,
      RoleProfile: false,
      Grading: false,
    });
  const [MainComponent, setMainComponent] = useState<boolean>(true);
  const [CommentData, setCommentsData] = useState<CommentsData[] | undefined>();
  const [PreviewBtn, setPreviewBtn] = useState<boolean>(false);
  const [activeTab, setactiveTab] = useState<string>("tab1");
  const [RoleSpeKnowledgeValue, setRoleSpeKnowledgeValue] = useState<
    RoleSpecKnowledge[]
  >([
    {
      RoleSpeKnowledge: { key: 0, text: "" },
      RequiredLevel: { key: 0, text: "" },
    },
  ]);
  const [qualificationValue, setQualificationValue] =
    useState<QualificationValue>({
      MinQualification: [],
      PrefeQualification: [],
    });
  const [TechnicalSkillValue, setTechnicalSkillValue] = useState<
    TechnicalSkills[]
  >([
    {
      TechnicalSkills: { key: 0, text: "" },
      LevelProficiency: { key: 0, text: "" },
    },
  ]);
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [Checkbox, setCheckbox] = useState<boolean>(false);
  const [prevActiveTab, setPrevActiveTab] = React.useState<string | null>(null);
  const [Preview, setPreview] = useState<boolean>(false);
  const [isViewed, setIsViewed] = useState(false);
  const [experValidation, setExperValidation] = useState<boolean>(false);
  const [masterLibrary, setMasterLibrary] = useState<masterLibrary>({
    RoleProfile: [],
    Grading: [],
  });

  const handleAddRow = (stateValue: string, index: number) => {
    switch (stateValue) {
      case RoleDescription.RoleSpeKnowledgeValue:
        {
          const currentItem = RoleSpeKnowledgeValue[index];
          const isRoleKnowledgeValid = IsValid(
            currentItem?.RoleSpeKnowledge.text
          );
          const isRequiredLevelValid = IsValid(currentItem?.RequiredLevel.text);

          setValidationError((prevErrors) => {
            const updatedErrors = [...prevErrors.RoleSpeKnowledgeValidation];
            updatedErrors[index] = {
              RoleSpeKnowledge: !isRoleKnowledgeValid,
              RequiredLevel: !isRequiredLevelValid,
            };
            return {
              ...prevErrors,
              RoleSpeKnowledgeValidation: updatedErrors,
            };
          });

          if (isRoleKnowledgeValid && isRequiredLevelValid) {
            setRoleSpeKnowledgeValue((prevState) => [
              ...prevState,
              {
                RoleSpeKnowledge: { key: 0, text: "" },
                RequiredLevel: { key: 0, text: "" },
              },
            ]);

            setValidationError((prevErrors) => ({
              ...prevErrors,
              RoleSpeKnowledgeValidation: [
                ...prevErrors.RoleSpeKnowledgeValidation,
                { RoleSpeKnowledge: false, RequiredLevel: false },
              ],
            }));
          }
        }
        break;
      case RoleDescription.TechnicalSkillValue: {
        const currentItem = TechnicalSkillValue[index];
        const isTechnicalSkillValid = IsValid(
          currentItem?.TechnicalSkills.text
        );
        const isLevelProficiencyValid = IsValid(
          currentItem?.LevelProficiency.text
        );

        setValidationError((prevErrors) => {
          const updatedErrors = [...prevErrors.technicalSkillsKnowledge];
          updatedErrors[index] = updatedErrors[index] || {
            TechnicalSkills: false,
            LevelProficiency: false,
          };
          updatedErrors[index] = {
            TechnicalSkills: !isTechnicalSkillValid,
            LevelProficiency: !isLevelProficiencyValid,
          };
          return {
            ...prevErrors,
            technicalSkillsKnowledge: updatedErrors,
          };
        });

        if (isTechnicalSkillValid && isLevelProficiencyValid) {
          setTechnicalSkillValue((prevState) => [
            ...prevState,
            {
              TechnicalSkills: { key: 0, text: "" },
              LevelProficiency: { key: 0, text: "" },
            },
          ]);

          setValidationError((prevErrors) => ({
            ...prevErrors,
            technicalSkillsKnowledge: [
              ...prevErrors.technicalSkillsKnowledge,
              { TechnicalSkills: false, LevelProficiency: false },
            ],
          }));
        }
        break;
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
      case RoleDescription.TechnicalSkillValue: {
        setTechnicalSkillValue((prevState) =>
          prevState.filter((_, i) => i !== index)
        );
      }
    }
  };

  const handleAutoComplete = (
    item: AutoCompleteItem | null,
    StateValue: string
  ) => {
    setAdvDetails((prevState) => ({
      ...prevState,
      [StateValue]: item,
    }));
    setValidationError((prevState) => ({
      ...prevState,
      [StateValue]: false,
    }));
    if (StateValue === "ExperienceinMiningIndustry") {
      const parseRange = (text: string): [number, number] => {
        const numbers = text.match(/\d+/g)?.map(Number) ?? [];
        if (text.includes("+")) {
          return [numbers[0], Infinity];
        } else if (numbers.length === 2) {
          return [numbers[0], numbers[1]];
        } else if (numbers.length === 1) {
          return [numbers[0], numbers[0]];
        }
        return [0, 0];
      };

      const experienceRange = parseRange(item?.text || "");
      const totalRange = parseRange(advDetails.TotalExperience.text || "");

      if (experienceRange[1] > totalRange[1]) {
        setExperValidation(true);
        setAdvDetails((prevState) => ({
          ...prevState,
          ExperienceinMiningIndustry: { key: 0, text: "" },
        }));
      } else {
        setExperValidation(false);
      }
      // console.log(experienceRange, "experienceRange");
    }
  };

  const handleAutoCompleterow = (
    item: AutoCompleteItem | null,
    key: string,
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

      setValidationError((prevErrors) => {
        const updatedErrors = [...prevErrors.RoleSpeKnowledgeValidation];
        updatedErrors[index] = updatedErrors[index] || {
          RoleSpeKnowledge: false,
          RequiredLevel: false,
        };

        if (key === "RoleSpeKnowledge") {
          updatedErrors[index].RoleSpeKnowledge = false;
        } else if (key === "RequiredLevel") {
          updatedErrors[index].RequiredLevel = false;
        }

        return {
          ...prevErrors,
          RoleSpeKnowledgeValidation: updatedErrors,
        };
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

      setValidationError((prevErrors) => {
        const updatedErrors = [...prevErrors.technicalSkillsKnowledge];
        updatedErrors[index] = updatedErrors[index] || {
          TechnicalSkills: false,
          LevelProficiency: false,
        };

        if (key === "TechnicalSkills") {
          updatedErrors[index].TechnicalSkills = false;
        } else if (key === "LevelProficiency") {
          updatedErrors[index].LevelProficiency = false;
        }

        return {
          ...prevErrors,
          technicalSkillsKnowledge: updatedErrors,
        };
      });
    }
  };

  const fetchRoleProfileData = async (JobCodeID: number) => {
    try {
      let filterConditions = [
        {
          FilterKey: "JobCode",
          Operator: "eq",
          FilterValue: JobCodeID,
        },
      ];
      const response = await getVRRDetails.GetHRMSRecruitmentRoleProfileDetails(
        filterConditions,
        ""
      );

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

          // Set Preferred Qualification as comma-separated values
          const PrefeQualificationOption = rawData.PreferredQualification
            ? [{ key: 0, text: rawData.PreferredQualification }]
            : [];

          setAdvDetails((prevState) => ({
            ...prevState,
            RolePurpose: rawData.RoleProfile || "",
            JobDescription: rawData.JobDescription || "",
            MinQualificationOption: MinQualificationOption,
            PrefeQualificationOption: PrefeQualificationOption,
            TechnicalSkillsOption: TechnicalSkillsOption,
            LevelProficiencyOption: LevelProficiencyOption,
            RoleSpeKnowledgeoption: RoleSpeKnowledgeValues,
            RequiredLeveloption: RequiredLevelValues,
            TotalExperience: rawData.YearofExperience || "",
            ExperienceinMiningIndustry: rawData.PreferredExperience || "",
            YearofExperience: rawData.YearofExperience || "",
            PreferredExperience: rawData.PreferredExperience || "",
            FunctionType: rawData.FunctionType,
            JobcodeChecked: true,
          }));
        } else {
          setAdvDetails((prev) => ({
            ...prev,
            JobcodeChecked: false,
          }));
          console.warn("No data found for the given filter.");
        }
      } else {
        console.error("Error fetching data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const filterConditionsRecuritment = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.ID,
        },
      ];
      const RecuritmentConditions = "";
      let filterConditions = [];
      let Conditions = "and";
      filterConditions.push({
        FilterKey: "StatusId",
        Operator: "eq",
        FilterValue: StatusId.Completed,
      });
      filterConditions.push({
        FilterKey: "IsDataSyncToRecruitment",
        Operator: "eq",
        FilterValue: Choices.Yes,
      });
      filterConditions.push({
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: Choices.No,
      });

      const response =
        props.CurrentRoleID === RoleID.RecruitmentHRLead &&
        props.stateValue?.StatusId === StatusId.Completed
          ? props.stateValue?.type === DataFrom.NewPosition
            ? await getVRRDetails.fetchNewPositionRequest(
                filterConditions,
                Conditions,
                props
              )
            : await getVRRDetails.GetAdditionalExistingPositionEditView(
                filterConditions,
                Conditions,
                props
              )
          : await getVRRDetails.GetRecruitmentDetails(
              filterConditionsRecuritment,
              RecuritmentConditions
            );

      if (response.data) {
        const NewpositionData =
          response?.data?.filter((item) => item.ID === props.stateValue?.ID) ||
          [];

        // Ensure `op` is always a single object
        const op: DataSyncToRecruitmentResponse =
          props.CurrentRoleID === RoleID.RecruitmentHRLead &&
          props.stateValue?.StatusId === StatusId.Completed
            ? NewpositionData.length > 0
              ? NewpositionData[0]
              : response?.data?.[0] || ({} as DataSyncToRecruitmentResponse)
            : response?.data?.[0] || ({} as DataSyncToRecruitmentResponse);

        const BUName =
          props?.BusinessUnitCodeAllColumn.find(
            (item: any) => item.key === op?.BusinessUnitCodeId
          ) || {};

        const JobtitleFrench =
          props?.JobInFrenchList.find(
            (item: any) => item.key === op?.JobTitleFrenchId
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
            ID: op.ID,
            BusinessUnitCodeID: op.BusinessUnitCodeId,
            DepartmentID: op.DepartmentId,
            SubDepartmentID: op.SubDepartmentId,
            SectionID: op.SectionId,
            DepartmentCodeID: op.DepartmentCodeId,
            JobNameInEnglishID: op.JobTitleEnglishId,
            JobNameInFrenchID: op.JobTitleFrenchId,
            PatersonGradeID: op.PatersonGradeId,
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
            JobNameInEnglish: op.JobTitleEnglish || "",
            JobNameInFrench: JobtitleFrench.text || "",
            PatersonGrade: op.PatersonGrade || "",
            DRCGrade: op.DRCGrade || "",
            EmployementCategory: op.EmploymentCategory || "",
            ContractType: op.TypeOfContract || "",
            JobCode: op.JobCode || "",
            AreaOfWork: op.AreaofWork || "",
            NoofPositionAssigned: op.NumberOfPersonNeeded || "",
            ReasonForVacancy: op.ReasonForVacancy || "",
            RecruitmentAuthorised: op.RecruitmentAuthorised || "",
            IsPayrollEmailed: op.IsPayrollEmailed || "",
            EnterNumberOfMonths: Number(op.EnterNumberOfMonths) || 0,
            DateRequried: String(op.DateRequried) || "",
            VacancyConfirmed: op.VacancyConfirmed || "",
            RoleProfileDocument: RoleProfileDoc,
            GradingDocument: GradingDoc,
            AdvertisementDocument: AdvertismentDocPromises,
            OnamSignedStampsDocument: ONAMSignedStampDoc,
          }));
          await fetchRoleProfileData(op.JobCodeId);
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

  const Validation = (): boolean => {
    const { AssignRecruitmentHR, Comments, OnamSignedStampsAttchment } =
      formState;

    let errors = {
      AssignRecruitmentHR: false,
      Comments: false,
      AdvertisementAttachement: false,
      OnamSignedStampsAttchment: false,
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
      Checkboxalidation: false,
      ValidFrom: false,
      ValidTo: false,
      JobFunctionalType: false,
      RoleProfile: false,
      Grading: false,
    };

    switch (props.CurrentRoleID) {
      case RoleID.RecruitmentHRLead: {
        if (props.stateValue?.tab === "tab1") {
          errors.AssignRecruitmentHR = !IsValid(AssignRecruitmentHR.text);
          errors.Comments = !IsValid(Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
        } else if (props.stateValue?.tab === "tab2") {
          errors.OnamSignedStampsAttchment = !IsValid(
            OnamSignedStampsAttchment
          );
          errors.Comments = !IsValid(Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
          // errors.ValidFrom = !IsValid(advDetails.ValidFrom);  // ONEM Page Validition for Valid from and Valid To Changes
          // errors.ValidTo = !IsValid(advDetails.ValidTo);
        }
        break;
      }

      case RoleID.RecruitmentHR: {
        if (
          props.stateValue?.StatusId ===
          StatusId.PendingwithRecruitmentHRtouploadAdv
        ) {
          if (advDetails.JobcodeChecked === true) {
            errors.Comments = !IsValid(Comments);
            errors.Checkboxalidation = !IsValid(Checkbox);
            if (formState.RoleProfileDocument.length === 0) {
              errors.RoleProfile = !IsValid(masterLibrary.RoleProfile);
            }
            if (formState.GradingDocument.length === 0) {
              errors.Grading = !IsValid(masterLibrary.Grading);
            }
          } else {
            if (formState.RoleProfileDocument.length === 0) {
              errors.RoleProfile = !IsValid(masterLibrary.RoleProfile);
            }
            if (formState.GradingDocument.length === 0) {
              errors.Grading = !IsValid(masterLibrary.Grading);
            }
            if (formState.AdvertisementDocument.length === 0) {
              errors.AdvertisementAttachement = !IsValid(
                advDetails.AdvertisementAttachement
              );
            }
            errors.Comments = !IsValid(Comments);
            errors.MinQualification = !IsValid(
              qualificationValue.MinQualification[0]?.text
            );
            errors.PrefeQualification = !IsValid(
              qualificationValue.PrefeQualification[0]?.text
            );
            errors.RoleSpeKnowledge = !IsValid(
              RoleSpeKnowledgeValue[0]?.RoleSpeKnowledge.text
            );
            errors.RequiredLevel = !IsValid(
              RoleSpeKnowledgeValue[0]?.RequiredLevel.text
            );
            errors.TechnicalSkills = !IsValid(
              TechnicalSkillValue[0]?.TechnicalSkills.text
            );
            errors.LevelProficiency = !IsValid(
              TechnicalSkillValue[0]?.LevelProficiency.text
            );
            errors.RolePurpose = !IsValid(advDetails.RolePurpose);
            errors.JobDescription = !IsValid(advDetails.JobDescription);
            errors.ExperienceinMiningIndustry = !IsValid(
              advDetails.ExperienceinMiningIndustry.text
            );
            errors.TotalExperience = !IsValid(advDetails.TotalExperience.text);
            errors.Checkboxalidation = !IsValid(Checkbox);
            // errors.ValidFrom = !IsValid(advDetails.ValidFrom);
            // errors.ValidTo = !IsValid(advDetails.ValidTo);
            errors.JobFunctionalType = !IsValid(
              advDetails.JobFunctionalType.text
            );
          }
        }

        break;
      }

      case RoleID.HOD: {
        if (props.stateValue?.tab === "tab1") {
          errors.Comments = !IsValid(Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
        }
        break;
      }
    }
    setValidationError((prevErrors) => ({
      ...prevErrors,
      RoleSpeKnowledgeValidation: [
        ...prevErrors.RoleSpeKnowledgeValidation,
        {
          RoleSpeKnowledge: errors.RoleSpeKnowledge,
          RequiredLevel: errors.RoleSpeKnowledge,
        },
      ],
    }));
    setValidationError((prevErrors) => ({
      ...prevErrors,
      technicalSkillsKnowledge: [
        ...prevErrors.technicalSkillsKnowledge,
        {
          TechnicalSkills: errors.TechnicalSkills,
          LevelProficiency: errors.LevelProficiency,
        },
      ],
    }));

    setValidationError((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  const NextValidation = (tab: string): boolean => {
    let errors = {
      AdvertisementAttachement: false,
      RoleProfile: false,
      Grading: false,
    };
    if (tab === "tab1") {
      if (formState.RoleProfileDocument.length === 0) {
        errors.RoleProfile = !IsValid(masterLibrary.RoleProfile);
      }
      if (formState.GradingDocument.length === 0) {
        errors.Grading = !IsValid(masterLibrary.Grading);
      }
      if (formState.AdvertisementDocument.length === 0) {
        errors.AdvertisementAttachement = !IsValid(
          advDetails.AdvertisementAttachement
        );
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

  function previewBtn_Fn() {
    const isValid = !Validation();
    if (isValid) {
      setPreviewBtn(true);
      setMainComponent(false);
    }
  }

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
          case RoleID.RecruitmentHRLead: {
            if (
              props.stateValue?.StatusId ===
              StatusId.PendingwithHRLeadtouploadONEMsigneddoc
            ) {
              const filterConditions = [
                {
                  FilterKey: "JobCode",
                  Operator: "eq",
                  FilterValue: formState.JobCodeID,
                },
              ];
              const Conditions = "";
              const result = await getVRRDetails.UploadAdvertisementInPortal(
                filterConditions,
                Conditions,
                formState,
                advDetails,
                props,
                1
              );

              if (result?.status === 200) {
                await CommonServices.uploadAttachmentToLibrary(
                  formState.JobCode,
                  formState.OnamSignedStampsAttchment ?? [],
                  DocumentLibraray.ONAMSignedStampDocuments
                );
                const obj: any = {
                  ActionId: WorkflowAction.Approved,
                  ItemCreated: "Yes",
                  JobPostingStartDate: advDetails.ValidFrom,
                  JobPostingEndDate: advDetails.ValidTo,
                };
                await SPServices.SPUpdateItem({
                  Listname: ListNames.HRMSRecruitmentDptDetails,
                  RequestJSON: obj,
                  ID: props.stateValue?.ID,
                });
                resetForm();
                let SuccessAlert = {
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
                setalertProps(SuccessAlert);
                setIsLoading(false);
              } else {
                let APIFailed = {
                  Message: RecuritmentHRMsg.APIErrorMsg,
                  Type: HRMSAlertOptions.Error,
                  visible: true,
                  ButtonAction: async (userClickedOK: boolean) => {
                    if (userClickedOK) {
                      props.navigation("/RecurimentProcess");
                      setAlertPopupOpen(false);
                    }
                  },
                };
                setAlertPopupOpen(true);
                setalertProps(APIFailed);
                setIsLoading(false);
              }
            }
            break;
          }
          case RoleID.RecruitmentHR: {
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
                TechnicalSkills: String(item.TechnicalSkills.key),
                LevelProficiency: String(item.LevelProficiency.key),
              };
              TechnicalSkillsKnowledgeJson.push(TechnicalSkillsData);
            });

            RoleSpeKnowledgeValue.forEach((item) => {
              let details = {
                RoleSpeKnowledge: String(item.RoleSpeKnowledge.key),
                RequiredLevel: String(item.RequiredLevel.key),
              };
              RoleSpecificKnowledgeJson.push(details);
            });

            qualificationValue.MinQualification.forEach((item) => {
              const details = {
                MinQualification: String(item.key),
              };
              QualificatioDetails.push(details);
            });
            qualificationValue.PrefeQualification.forEach((item) => {
              const details = {
                PrefeQualification: String(item.key),
              };
              PrefeQualification.push(details);
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
                TechnicalSkillsKnowledgeJson
              ),
              JobCodeId: formState.JobCodeID,
              TotalPreferredExperienceId: Number(
                advDetails.TotalExperience.key
              ),
              PreferredExperienceId: Number(
                advDetails.ExperienceinMiningIndustry.key
              ),
              FunctionTypeId: advDetails.JobFunctionalType.key,
            };
            let AdvDetailsResponse;
            if (advDetails.JobcodeChecked === false) {
              AdvDetailsResponse = await getVRRDetails.InsertList(
                AdvData,
                ListNames.HRMSRecruitmentRoleProfileDetails
              );
              // console.log(AdvDetailsResponse.data, "AdvDetailsResponse");
            }
            if (
              advDetails.JobcodeChecked === false
                ? AdvDetailsResponse?.status === ResponeStatus.SUCCESS
                : true
            ) {
              const filterConditions = [
                {
                  FilterKey: "JobCode",
                  Operator: "eq",
                  FilterValue: formState.JobCodeID,
                },
              ];
              let Conditions = "";
              const result = await getVRRDetails.UploadAdvertisementInPortal(
                filterConditions,
                Conditions,
                formState,
                advDetails,
                props,
                0
              );
              resetForm();
              if (result.status === ResponeStatus.SUCCESS) {
                await CommonServices.uploadAttachmentToLibrary(
                  formState.JobCode,
                  advDetails?.AdvertisementAttachement ?? [],
                  DocumentLibraray.RecruitmentAdvertisementDocument
                );
                await CommonServices.uploadRoleProfileMaster(
                  formState.JobCode,
                  RoleProfileMaster.RoleProfile,
                  masterLibrary?.RoleProfile ?? [],
                  DocumentLibraray.RoleProfileMaster
                );
                await CommonServices.uploadRoleProfileMaster(
                  formState.JobCode,
                  RoleProfileMaster.Grading,
                  masterLibrary?.Grading ?? [],
                  DocumentLibraray.RoleProfileMaster
                );
                await SPServices.SPUpdateItem({
                  Listname: ListNames.HRMSRecruitmentDptDetails,
                  RequestJSON: obj,
                  ID: props.stateValue?.ID,
                });
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
              } else {
                let APIError = {
                  Message: RecuritmentHRMsg.APIErrorMsg,
                  Type: HRMSAlertOptions.Error,
                  visible: true,
                  ButtonAction: async (userClickedOK: boolean) => {
                    if (userClickedOK) {
                      // props.navigation("/RecurimentProcess");
                      setAlertPopupOpen(false);
                    }
                  },
                };

                setAlertPopupOpen(true);
                setalertProps(APIError);
                setIsLoading(false);
              }
            }
            break;
          }
          case RoleID.HOD: {
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
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateValidTo = (startDate: Date, daysToAdd: number): Date => {
    let validToDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      validToDate.setDate(validToDate.getDate() + 1);

      if (validToDate.getDay() === 0) {
        continue;
      }

      addedDays++;
    }

    if (validToDate.getDay() === 0) {
      validToDate.setDate(validToDate.getDate() + 1);
    }

    return validToDate;
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchData();
      if (
        props.stateValue?.StatusId ===
          StatusId.PendingwithHRLeadtouploadONEMsigneddoc ||
        props.stateValue?.StatusId ===
          StatusId.PendingwithRecruitmentHRtouploadAdv
      ) {
        const newValidTo = calculateValidTo(todaydate, 13);
        setAdvDetails((prevState) => ({
          ...prevState,
          ValidTo: newValidTo,
        }));
      }
    };

    void initialize();
  }, []);

  const handleDelete = (index: number, attachmentType: string) => {
    if (attachmentType === "AdvertisementAttachement") {
      setAdvDetails((prevState) => {
        const updatedAttachments = [...(prevState[attachmentType] ?? [])];
        updatedAttachments.splice(index, 1);

        return {
          ...prevState,
          [attachmentType]: updatedAttachments,
        };
      });
    } else {
      setFormState((prevState) => {
        const updatedAttachments = [
          ...(prevState[attachmentType as keyof RecuritmentData] ?? []),
        ];

        updatedAttachments.splice(index, 1);

        return {
          ...prevState,
          [attachmentType]: updatedAttachments,
        };
      });
    }
  };

  const handleRoleprofileDelete = (index: number, attachmentType: string) => {
    setMasterLibrary((prevState) => {
      const updatedAttachments = [
        ...(prevState[attachmentType as keyof masterLibrary] ?? []),
      ];

      updatedAttachments.splice(index, 1);

      return {
        ...prevState,
        [attachmentType]: updatedAttachments,
      };
    });
  };

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
  // const handleCustomInputChange = (value: string | any, StateValue: string) => {
  //   setAdvDetails((prevState) => ({
  //     ...prevState,
  //     [StateValue]: value,
  //   }));

  //   setValidationError((prevState) => ({
  //     ...prevState,
  //     [StateValue]: false,
  //   }));
  // };

  const handleMulitiSelect = (
    value: AutoCompleteItem[],
    StateValue: string
  ) => {
    setQualificationValue((prevState: any) => ({
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

  const handleDateChange = (value: Date | null, stateKey: string) => {
    setAdvDetails((prevState) => {
      const updatedState = { ...prevState, [stateKey]: value };

      if (stateKey === "ValidFrom" && value) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const newValidTo = calculateValidTo(value, 13);
        updatedState.ValidTo = newValidTo;
      }

      return updatedState;
    });

    setValidationError((prevState) => ({
      ...prevState,
      [stateKey]: false,
    }));
  };

  const handleCheckbox = (value: boolean) => {
    setCheckbox(value);
    setValidationError((prevState) => ({
      ...prevState,
      Checkboxalidation: false,
    }));
  };

  const handleFileAttachment = (StateValue: string, value: IDocFiles[]) => {
    if (StateValue === "AdvertisementAttachement") {
      setAdvDetails((prevState) => ({
        ...prevState,
        [StateValue]: value,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [StateValue]: value,
      }));
    }
    setValidationError((prevState: any) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const handleRoleprofileDocument = (
    StateValue: string,
    value: IDocFiles[]
  ) => {
    setMasterLibrary((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationError((prevState: any) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const tabs = [
    {
      label:
        props.CurrentRoleID === RoleID.RecruitmentHRLead &&
        props.stateValue?.StatusId ===
          StatusId.PendingwithHRLeadtouploadONEMsigneddoc
          ? TabName.AdvertisementDetails
          : TabName.PositionDetails,
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
                {props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                props.stateValue?.StatusId === StatusId.Completed ? (
                  <></>
                ) : (
                  <div
                    className="ms-Grid-col ms-lg6"
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <LabelHeaderComponents
                      value={`Status - ${props.stateValue?.Status}`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                )}
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
                    label="No of Personnel Required"
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

              {props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                props.stateValue?.StatusId ===
                  StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
                  <>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <CustomDatePicker
                          selectedDate={advDetails.ValidFrom}
                          label="Valid From"
                          error={validationErrors.ValidFrom}
                          minDate={todaydate}
                          // mandatory={true}
                          disabled={true}
                          onChange={(date) =>
                            handleDateChange(date, "ValidFrom")
                          }
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomDatePicker
                          selectedDate={advDetails.ValidTo}
                          label="Valid To"
                          error={false}
                          // minDate={
                          //   advDetails.ValidFrom
                          //     ? new Date(
                          //         advDetails.ValidFrom.getTime() +
                          //           13 * 24 * 60 * 60 * 1000
                          //       )
                          //     : undefined
                          // }
                          disabled={true}
                          mandatory={false}
                          onChange={(date) => handleDateChange(date, "ValidTo")}
                        />
                      </div>
                    </div>
                  </>
                )}

              <div className="ms-Grid-row" style={{ marginLeft: "0px" }}>
                <LabelHeaderComponents value={"Attachments"} />
              </div>

              <div className="ms-Grid-row" style={{ margin: "0%" }}>
                {formState.RoleProfileDocument.length > 0 ? (
                  <></>
                ) : (
                  <>
                    <p>
                      <span
                        style={{
                          color: "red",
                          marginTop: "8px",
                          display: "block",
                          fontFamily: "sans-serif",
                          // fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI",
                          // -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                          fontSize: "13px",
                        }}
                      >
                        Note:- {Notes.Roleprofile}
                      </span>
                    </p>
                  </>
                )}
                {formState.GradingDocument.length > 0 ? (
                  <></>
                ) : (
                  <>
                    <span
                      style={{
                        color: "red",
                        marginTop: "8px",
                        display: "block",
                        fontFamily: "sans-serif",
                        // fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI",
                        // -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                        fontSize: "13px",
                      }}
                    >
                      Note:- {Notes.Grding}
                    </span>
                  </>
                )}
              </div>

              {formState.RoleProfileDocument.length === 0 &&
              formState.GradingDocument.length === 0 &&
              props.CurrentRoleID === RoleID.RecruitmentHRLead &&
              props.stateValue?.StatusId === StatusId.Completed ? (
                <></>
              ) : (
                <>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg3">
                      {formState.RoleProfileDocument.length > 0 ? (
                        <div className="custom-document-column">
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
                      ) : (
                        <>
                          {props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                          props.stateValue?.StatusId === StatusId.Completed ? (
                            <></>
                          ) : (
                            <>
                              <CustomLabel
                                value={"RoleProfile Documents (Only Word)"}
                                mandatory={true}
                              />
                              <AttachmentButton
                                label="Upload"
                                iconName="CloudUpload"
                                iconNameHover="CloudUpload"
                                AttachState={(newAttachment: any) => {
                                  let attachment: IDocFiles[] =
                                    newAttachment.map((item: any) => {
                                      return {
                                        name: item.name,
                                        content: item.file,
                                        type: "New",
                                      };
                                    });
                                  const attachments = [
                                    ...(masterLibrary.RoleProfile || []),
                                    ...attachment,
                                  ];
                                  handleRoleprofileDocument(
                                    "RoleProfile",
                                    attachments
                                  );
                                }}
                                mandatory={true}
                                error={validationErrors.RoleProfile}
                                Style={{
                                  backgroundColor:
                                    ColorCode.ButtonColorCode.ButtonColor,
                                  color: "white",
                                }}
                                fileformat=".doc, .docx"
                              />
                              <CustomViewAttachment
                                Attachment={masterLibrary.RoleProfile ?? []}
                                StateValue={"RoleProfile"}
                                handleDelete={(index, fileState) =>
                                  handleRoleprofileDelete(index, fileState)
                                }
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <div className="ms-Grid-col ms-lg3">
                      {formState.GradingDocument.length > 0 ? (
                        <div className="custom-document-column">
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
                      ) : (
                        <>
                          {props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                          props.stateValue?.StatusId === StatusId.Completed ? (
                            <></>
                          ) : (
                            <>
                              <CustomLabel
                                value={"Grading Documents (Only Word)"}
                                mandatory={true}
                              />
                              <AttachmentButton
                                label="Upload"
                                iconName="CloudUpload"
                                iconNameHover="CloudUpload"
                                AttachState={(newAttachment: any) => {
                                  let attachment: IDocFiles[] =
                                    newAttachment.map((item: any) => {
                                      return {
                                        name: item.name,
                                        content: item.file,
                                        type: "New",
                                      };
                                    });
                                  const attachments = [
                                    ...(masterLibrary.Grading || []),
                                    ...attachment,
                                  ];
                                  handleRoleprofileDocument(
                                    "Grading",
                                    attachments
                                  );
                                }}
                                mandatory={true}
                                error={validationErrors.Grading}
                                Style={{
                                  backgroundColor:
                                    ColorCode.ButtonColorCode.ButtonColor,
                                  color: "white",
                                }}
                                fileformat=".doc, .docx"
                              />
                              <CustomViewAttachment
                                Attachment={masterLibrary.Grading ?? []}
                                StateValue={"Grading"}
                                handleDelete={(index, fileState) =>
                                  handleRoleprofileDelete(index, fileState)
                                }
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                    props.stateValue?.StatusId === StatusId.Completed ? (
                      <></>
                    ) : (
                      <>
                        {formState.AdvertisementDocument.length > 0 ? (
                          <div className="ms-Grid-col ms-lg3 custom-document-column ">
                            <CustomLabel
                              value={"Advertisement Documents(French)"}
                            />
                            <CustomViewDocument
                              Attachment={formState.AdvertisementDocument}
                            />
                          </div>
                        ) : (
                          <div className="ms-Grid-col ms-lg4">
                            <CustomLabel
                              value={"Advertisement Document (Only PDF)"}
                              mandatory={true}
                            />
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
                                  ...(advDetails.AdvertisementAttachement ||
                                    []),
                                  ...attachment,
                                ];
                                handleFileAttachment(
                                  "AdvertisementAttachement",
                                  attachments
                                );
                              }}
                              mandatory={true}
                              error={validationErrors.AdvertisementAttachement}
                              Style={{
                                backgroundColor:
                                  ColorCode.ButtonColorCode.ButtonColor,
                                color: "white",
                              }}
                              fileformat=".pdf"
                            />
                            <CustomViewAttachment
                              Attachment={
                                advDetails.AdvertisementAttachement ?? []
                              }
                              StateValue={"AdvertisementAttachement"}
                              handleDelete={(index, fileState) =>
                                handleDelete(index, fileState)
                              }
                            />
                          </div>
                        )}
                        {/* <div className="ms-Grid-col ms-lg3 custom-document-column">
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
                        </div> */}
                      </>
                    )}
                  </div>
                </>
              )}

              {/* {((props.CurrentRoleID === RoleID.HOD &&
                props.stateValue?.StatusId ===
                  StatusId.PendingwithHODtoreviewAdv) ||
                (props.CurrentRoleID === RoleID.RecruitmentHR &&
                  props.stateValue?.StatusId ===
                    StatusId.PendingwithRecruitmentHRtouploadAdv &&
                  advDetails.JobcodeChecked === true)) && (
               
              )} */}

              <div className="ms-Grid-row">
                {props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                props.stateValue?.StatusId === StatusId.Completed ? (
                  <></>
                ) : (
                  <>
                    {advDetails.JobcodeChecked === true ? (
                      <>
                        <div
                          className="ms-Grid-col ms-lg3"
                          style={{ position: "relative", right: "1px" }}
                        >
                          <CustomLabel
                            value={labelName.ViewJobAdvetisement}
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
                              backgroundColor:
                                ColorCode.ButtonColorCode.ButtonColor,
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
                        <div
                          className="ms-Grid-col ms-lg3"
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
                              backgroundColor:
                                ColorCode.ButtonColorCode.ButtonColor,
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
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingwithHRLeadtouploadONEMsigneddoc && (
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel
                      value={"ONEM Signed and Stamped Document(Only Pdf)"}
                      mandatory={true}
                    />
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
                          ...(formState.OnamSignedStampsAttchment || []),
                          ...attachment,
                        ];
                        handleFileAttachment(
                          "OnamSignedStampsAttchment",
                          attachments
                        );
                      }}
                      mandatory={true}
                      error={validationErrors.OnamSignedStampsAttchment}
                      Style={{
                        backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                        color: "white",
                      }}
                      fileformat=".pdf"
                    />
                    <CustomViewAttachment
                      Attachment={formState.OnamSignedStampsAttchment ?? []}
                      StateValue={"OnamSignedStampsAttchment"}
                      handleDelete={(index, fileState) =>
                        handleDelete(index, fileState)
                      }
                    />
                  </div>
                )}
              </div>

              {((props.CurrentRoleID === RoleID.HOD &&
                props.stateValue?.StatusId ===
                  StatusId.PendingwithHODtoreviewAdv) ||
                props.stateValue?.StatusId ===
                  StatusId.PendingwithHRLeadtouploadONEMsigneddoc ||
                (props.CurrentRoleID === RoleID.RecruitmentHR &&
                  props.stateValue?.StatusId ===
                    StatusId.PendingwithRecruitmentHRtouploadAdv &&
                  advDetails.JobcodeChecked === true)) && (
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
                      margin: "0%",
                      marginTop: "1%",
                      marginBottom: "-1%",
                    }}
                  >
                    <p>
                      <span
                        style={{
                          color: "red",
                          marginTop: "8px",
                          display: "block",
                          fontFamily: "sans-serif",

                          fontSize: "13px",
                        }}
                      >
                        Note:- {Notes.ReviewRolePurpose}
                      </span>
                    </p>
                  </div>

                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg12">
                      <SignatureCheckbox
                        label={
                          (props.CurrentRoleID === RoleID.RecruitmentHR &&
                            advDetails.JobcodeChecked === true) ||
                          props.CurrentRoleID === RoleID.HOD
                            ? TabName.ApprovalCheckbox
                            : TabName.CheckboxContent
                        }
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
                        JobTitleInEnglish={props.userDetails[0].JopTitleEnglish}
                        JobTitleInFrench={props.userDetails[0].JopTitleFrench}
                        Department={props.userDetails[0].DepartmentName}
                        Date={formState.SignDate.toString()}
                        TermsAndCondition={Checkbox}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ),
    },
    ...(props.CurrentRoleID === RoleID.RecruitmentHR &&
    props.stateValue?.StatusId ===
      StatusId.PendingwithRecruitmentHRtouploadAdv &&
    advDetails.JobcodeChecked === false
      ? [
          {
            label: TabName.AdvertisementDetails, //"Advertisement Details",
            value: "tab2",
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
                  <>
                    <div>
                      {advDetails.JobcodeChecked ? (
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
                                  backgroundColor:
                                    ColorCode.ButtonColorCode.ButtonColor,
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
                      ) : (
                        <UploadAdvertisement
                          advDetails={advDetails}
                          validationErrors={validationErrors}
                          handleFileAttachment={handleFileAttachment}
                          handleRichTextEditor={handleRichTextEditor}
                          handleAutoComplete={handleAutoComplete}
                          handleMulitiSelect={handleMulitiSelect}
                          handleDelete={handleDelete}
                          handleAutoCompleterow={handleAutoCompleterow}
                          handleAddRow={handleAddRow}
                          handleDeleteRow={handleDeleteRow}
                          InvaildSelection={experValidation}
                          qualificationValue={qualificationValue}
                          TechnicalSkillValue={TechnicalSkillValue}
                          RoleSpeKnowledgeValue={RoleSpeKnowledgeValue}
                          setAdvDetails={setAdvDetails}
                        />
                      )}

                      <CustomLabel value={" View Justifications"} />
                      <ReuseButton
                        Style={{
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
                        }}
                        label="VIEW"
                        imgSrc={require("../../assets/viewSubmision-white.svg")}
                        imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                        imgAlt="View"
                        imgAltHover="Hovered View"
                        onClick={OpenComments}
                        spacing={4}
                      />

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
                            onChange={(value: boolean) => handleCheckbox(value)}
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
                    </div>
                  </>
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
    if (
      props.CurrentRoleID === RoleID.RecruitmentHRLead &&
      props.stateValue?.StatusId ===
        StatusId.PendingwithHRLeadtouploadONEMsigneddoc
    ) {
      const newValidTo = calculateValidTo(todaydate, 13);
      setAdvDetails((prevState) => ({
        ...prevState,
        ValidTo: newValidTo,
      }));
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
                ValidationError={() => NextValidation(activeTab)}
                handleCancel={handleCancel}
                onBreadcrumbChange={handleBreadcrumbChange}
                additionalButtons={
                  (props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                    props.stateValue?.StatusId === StatusId.Completed) ||
                  (props.CurrentRoleID === RoleID.RecruitmentHR &&
                    props.stateValue?.StatusId ===
                      StatusId.PendingwithRecruitmentHRtoAssignExternalAgency)
                    ? [
                        {
                          label: "Close",
                          onClick: async () => {
                            props.navigation("/RecurimentProcess");
                          },
                        },
                      ]
                    : props.CurrentRoleID === RoleID.RecruitmentHRLead &&
                      props.stateValue?.StatusId ===
                        StatusId.PendingwithHRLeadtouploadONEMsigneddoc
                    ? [
                        {
                          label: "Upload",
                          onClick: async () => {
                            await SaveRecruitment();
                          },
                        },
                      ]
                    : props.CurrentRoleID === RoleID.RecruitmentHR &&
                      props.stateValue?.StatusId ===
                        StatusId.PendingwithRecruitmentHRtouploadAdv
                    ? [
                        ...(advDetails.JobcodeChecked === false
                          ? [
                              {
                                label: "Preview",
                                onClick: async () => {
                                  previewBtn_Fn();
                                },
                              },
                            ]
                          : []),

                        ...(isViewed
                          ? [
                              {
                                label: "Submit",
                                onClick: async () => {
                                  await SaveRecruitment();
                                },
                              },
                            ]
                          : []),
                      ]
                    : props.CurrentRoleID === RoleID.HOD &&
                      props.stateValue?.StatusId ===
                        StatusId.PendingwithHODtoreviewAdv
                    ? isViewed
                      ? [
                          {
                            label: "Reviewed",
                            onClick: async () => {
                              await SaveRecruitment();
                            },
                          },
                        ]
                      : []
                    : props.stateValue?.TabName === TabName.AssignAgencies
                    ? [
                        {
                          label: "Close",
                          onClick: async () => {
                            props.navigation("/RecurimentProcess");
                          },
                        },
                      ]
                    : []
                }
              />
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
              setIsViewed(false);
            }}
            Ok_btnfn={() => {
              // setSubmitBtn(false);
              setPreviewBtn(false);
              setMainComponent(true);
              setactiveTab("tab2");
              setIsViewed(true);
            }}
            RoleSpec={RoleSpeKnowledgeValue}
            Qualification={qualificationValue}
            TechinicalSkills={TechnicalSkillValue}
            JobTitle={formState.JobNameInEnglish}
          />
        </>
      ) : Preview ? (
        <CustomPreviewScreen
          data={advDetails}
          onclose={() => {
            setPreview(false);
            setMainComponent(true);
            // setactiveTab("tab2");
          }}
          Ok_btnfn={() => {
            setPreview(false);
            //setSubmitBtn(false);
            setMainComponent(true);
            // setactiveTab("tab2");
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

export default ApprovedVRREdit;
