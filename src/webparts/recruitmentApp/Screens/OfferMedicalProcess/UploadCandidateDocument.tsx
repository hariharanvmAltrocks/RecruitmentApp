import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomInput from "../../components/CustomInput";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import {
  ColorCode,
  DocumentFolderName,
  DocumentLibraray,
  HRMSAlertOptions,
  Nationality,
  PostRecrutimentCheckboxContent,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleID,
  RoleName,
  StatusId,
  TabName,
  WorkflowAction,
  workflowStatusApi,
} from "../../utilities/Config";
import {
  alertPropsData,
  ChecklistStatus,
  OnboardingChecklisttype,
} from "../../Models/Screens";
import { UploadDocument, WorkflowJson } from "../../Models/ApIInterface";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomLabel from "../../components/CustomLabel";
import AttachmentButton from "../../components/AttachmentButton";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import CustomViewAttachment from "../../components/CustomViewAttachment";
import IsValid from "../../components/Validation";
import {
  GetPortalJobsService,
  getVRRDetails,
  laborHireService,
  OfferLetterServices,
} from "../../Services/ServiceExport";
import {
  DataSyncToResiProcess,
  DocumentName,
  GetBGVDocument,
  GetCandidateDocument,
} from "../../Services/InitiateOfferLetter/IOfferLetterService";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import ReuseButton from "../../components/ReuseButton";
import { ViewCandidateDocument } from "../ScreenComponent/ViewCandidateDocument";
import {
  ActionName,
  Attachment,
  ButtonAction,
  CheckboxContent,
  DisplayFolderName,
  EmployeementCategory,
  labelNames,
  NSADocs,
  onboardingData,
  RadioBtnLabel,
  SADocs,
} from "../../utilities/LabelName";
import AlertDialogbox from "../../components/CustomAlert/AlertDialogbox";
import CustomTextArea from "../../components/CustomTextArea";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import CustomSignature from "../../components/CustomSignature";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { convertToList } from "../../components/TabMerge";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Checklist.css";
import StatusBar from "./ChecklistStatus";

type ValidationError = {
  OfferLetterDoc: boolean;
  ConsentDocs: boolean;
  EmployementDoc: boolean;
  MedicalDocs: boolean;
  RadioAction: boolean;
  comments: boolean;
  checkbox: boolean;
  ITRequired: boolean;
  BGVRadioBtn: boolean;
  PaymentReview: boolean;
};

export type viewDocument = {
  ReviewOfferDoc: IDocFiles[];
  ReviewEmployDocs: IDocFiles[];
  ReviewOthersDoc: IDocFiles[];
  ViewFolderPath: string;
};

export type CustomViewDocument = {
  data: any;
  Title: string;
  DocumentName: string;
  DocumentContent: any;
};

// type optionValue = {
//   InductionTypeOption: AutoCompleteItem[];
//   RegionOption: AutoCompleteItem[];
//   ZoneOption: AutoCompleteItem[];
//   HarewareOption: AutoCompleteItem[];
// };

const UploadCandidateDocument = (props: any) => {
  const todaydate = new Date();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<UploadDocument>({
    CandidateID: 0,
    ApplicantName: "",
    ApplicantSurName: "",
    Nationalty: "",
    BusinessUnitCode: "",
    Department: "",
    SubDepartment: "",
    Section: "",
    DepartmentCode: "",
    EmploymentCategory: "",
    TypeOfCOntract: "",
    AreaOfWork: "",
    Location: "",
    positionID: "",
    Email: "",
    ProofOfIdentity: "",
    IdentityNumber: "",
    comments: "",
    Checkbox: false,
    SignDate: undefined,
    jobRequestID: "",
    OfferLetterDoc: [],
    EmployementDoc: [],
    PersonalDocs: [],
    MedicalDocs: [],
    RadioAction: "",
    CheckboxContent: "",
    ConsentDocs: [],
    JoiningDate: "",
    NoticePeriod: "",
    ProfileID: "",
    PaymentReview: "",
    RecNationality: "",

    TrainingSystem: {
      Inductiontype: { key: 0, text: "" },
      StartDate: undefined,
      EndDate: undefined,
      Region: [],
      Zone: [],
      Comments: "",
    },
    TASystem: {
      StartDate: undefined,
      EndDate: undefined,
      Region: [],
      Zone: [],
      Comments: "",
    },
    ITSystem: {
      StartDate: undefined,
      Hardware: [],
      Region: [],
      Zone: [],
      Comments: "",
      ITStatus: "",
    },
    MedicalSystem: {
      StartDate: undefined,
      EndDate: undefined,
      Region: [],
      Zone: [],
      Comments: "",
      MedicalStatus: "",
    },
    ITRequired: "",
    BGVRadioBtn: "",
    BGVRadioBtnlabel: "",
  });
  // const [checkdata,setCheckdata] = useState<>
  // const [viewDocument, setViewDocument] = React.useState<viewDocument>({
  //   ReviewOfferDoc: [],
  //   ReviewOthersDoc: [],
  //   ReviewEmployDocs: [],
  //   ViewFolderPath: "",
  // });
  const [dataValue, setdataValue] = React.useState<DataSyncToResiProcess[]>([]);
  const [documentview, setdocumentview] = React.useState<CustomViewDocument[]>(
    []
  );
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [checklistData, setchecklistData] =
    React.useState<OnboardingChecklisttype>(onboardingData);
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [validationErrors, setValidationErrors] =
    React.useState<ValidationError>({
      OfferLetterDoc: false,
      ConsentDocs: false,
      EmployementDoc: false,
      MedicalDocs: false,
      RadioAction: false,
      comments: false,
      checkbox: false,
      ITRequired: false,
      BGVRadioBtn: false,
      PaymentReview: false,
    });
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [btnEnable, setBtnEnable] = React.useState<boolean>(false);
  const [documentPopup, setDocumentPopup] = React.useState<boolean>(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [checklistStatus, setChecklistStatus] = useState<ChecklistStatus>({
    BackgroundChecks: false,
    SignedOfferLetter: false,
    EmploymentContract: false,
    WorkPermitApproved: false,
    VisaProcess: false,
    AccommodationBooked: false,
    TravelProcess: false,
    ReadyforOnboarding: false,
  });

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let filterConditions: any[] = [];
      let Conditions = "and";
      filterConditions.push({
        FilterKey: "ID",
        Operator: "eq",
        FilterValue: props.stateValue.ID,
      });
      const response = await OfferLetterServices.fetchResiCandidateDetails(
        filterConditions,
        Conditions
      );
      let item = response.data[0];
      setdataValue(response.data);
      let CandidateDetails = await GetPortalJobsService.getCandidateProfile(
        item?.CandidateDetails?.JobRequestID
      );
      let docs: any[] = [];
      if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        let BGVDocument: GetBGVDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID,
          DocumentType: DocumentFolderName.BackgroundVerification,
          DocumentName:
            CandidateDetails?.data?.[0]?.NatioCode === "N154"
              ? SADocs
              : NSADocs,
          RequestID: item?.CandidateDetails?.JobRequestID,
        };
        let BGVDocs = await OfferLetterServices.FetchBGVerificationDOcs(
          BGVDocument
        );
        let OfferDocument: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", // item?.CandidateDetails?.ProfileID, //item?.CandidateDetails?.ProfileID,
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID, //item?.CandidateDetails?.JobRequestID,
          DocumentType: DocumentFolderName.Offerletter,
          UnsignedDoc: DocumentFolderName.SignedDoc,
        };
        let OfferDoc = await OfferLetterServices.FetchCandidateDocument(
          OfferDocument
        );
        let unSignedOfferDocument: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, // "13", //item?.CandidateDetails?.ProfileID,
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID,
          DocumentType: DocumentFolderName.Offerletter,
          UnsignedDoc: DocumentFolderName.UnsignedDoc,
        };
        let unSignedOfferDocs =
          await OfferLetterServices.FetchCandidateDocument(
            unSignedOfferDocument
          );
        let PoliceClearanceCertificate: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID,
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID,
          DocumentType: DocumentFolderName.PoliceClearanceCertificate,
        };
        let PoliceDocs = await OfferLetterServices.FetchCandidateDocument(
          PoliceClearanceCertificate
        );
        let CovidVaccinationCertificate: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID,
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID,
          DocumentType: DocumentFolderName.CovidVaccinationCertificate,
          // UnsignedDoc: DocumentFolderName.SignedDoc,
          // EmployDOcs: [
          //   DocumentFolderName.PoliceClearanceCertificate,
          //   DocumentFolderName.CovidVaccinationCertificate,
          //   DocumentFolderName.YellowFeverVaccinationCertificate,
          // ],
        };
        let CovidVaccinationDocs =
          await OfferLetterServices.FetchCandidateDocument(
            CovidVaccinationCertificate
          );
        let YellowFeverVaccinationCertificate: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID,
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID,
          DocumentType: DocumentFolderName.YellowFeverVaccinationCertificate,
        };
        let YellowFeverDocs = await OfferLetterServices.FetchCandidateDocument(
          YellowFeverVaccinationCertificate
        );

        let EmployeeContractDocument: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID, //"13",
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID, //"1075",
          DocumentType: DocumentFolderName.EmploymentContractForm,
          UnsignedDoc: DocumentFolderName.SignedDoc,
        };
        let ECDocs = await OfferLetterServices.FetchCandidateDocument(
          EmployeeContractDocument
        );
        let UnsignedEmployeeContractDocument: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13",
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075",
          DocumentType: DocumentFolderName.EmploymentContractForm,
          UnsignedDoc: DocumentFolderName.UnsignedDoc,
        };
        let UnsignedECDocs = await OfferLetterServices.FetchCandidateDocument(
          UnsignedEmployeeContractDocument
        );
        let unSignedECDOcs = [
          {
            Title: DisplayFolderName.LabourHireEC,
            data: UnsignedECDocs.data,
          },
        ];
        let EmployeeDocs = [
          {
            Title: DocumentFolderName.EmploymentContractForm,
            data: ECDocs.data,
          },
        ];
        // let WPDocs = [
        //   {
        //     Title: DisplayFolderName.WorkPermitDocument,
        //     data: WorkPermitDoc.data,
        //   },
        // ];
        let OfferDocs = [
          {
            Title: DisplayFolderName.Offerletter,
            data: OfferDoc.data,
          },
        ];
        let unSignedDocs = [
          {
            Title: DisplayFolderName.LabourHireOffer,
            data: unSignedOfferDocs.data,
          },
        ];
        BGVDocs.data = BGVDocs.data.filter((item: any) => item !== undefined);

        let BGVDoc = [
          {
            Title: DisplayFolderName.BackgroundVerification,
            data: BGVDocs.data,
          },
        ];
        let policecleDocs = [
          {
            Title: DisplayFolderName.PoliceClearanceCertificate,
            data: PoliceDocs.data,
          },
        ];
        let CovidVaccDocs = [
          {
            Title: DisplayFolderName.CovidVaccinationCertificate,
            data: CovidVaccinationDocs.data,
          },
        ];
        let YellowDocs = [
          {
            Title: DisplayFolderName.YellowFeverVaccinationCertificate,
            data: YellowFeverDocs.data,
          },
        ];

        docs.push(...BGVDoc);
        if (
          item?.RecruitmentDetails?.EmploymentCategory ===
          EmployeementCategory.LaborhireContractor
        ) {
          docs.push(...unSignedDocs);
        }
        docs.push(...OfferDocs);
        // docs.push(...WPDocs);
        docs.push(...policecleDocs);
        docs.push(...CovidVaccDocs);
        docs.push(...YellowDocs);
        if (
          item?.RecruitmentDetails?.EmploymentCategory ===
          EmployeementCategory.LaborhireContractor
        ) {
          docs.push(...unSignedECDOcs);
        }
        docs.push(...EmployeeDocs);
        let WorkPermitDocs: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID,
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID,
          DocumentType: DocumentFolderName.WorkPermit,
        };
        let WorkPermitDocument =
          await OfferLetterServices.FetchCandidateDocument(WorkPermitDocs);
        let WPDocs = [
          {
            Title: DisplayFolderName.WorkPermitDocument,
            data: WorkPermitDocument.data,
          },
        ];
        docs.push(...WPDocs);

        let PaymentbillDocs: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID,
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID,
          DocumentType: DocumentFolderName.PaymentBill,
        };
        let PaymentDocs = await OfferLetterServices.FetchCandidateDocument(
          PaymentbillDocs
        );
        let PBDocs = [
          {
            Title: DisplayFolderName.PaymentBill,
            data: PaymentDocs.data,
          },
        ];
        docs.push(...PBDocs);
      } else {
        let WorkPermitDocument: GetCandidateDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID,
          RequestID: item?.CandidateDetails?.JobRequestID, //"1075", //item?.CandidateDetails?.JobRequestID,
          DocumentType: DocumentFolderName.PaymentBill,
        };
        let WorkPermitDoc = await OfferLetterServices.FetchCandidateDocument(
          WorkPermitDocument
        );
        let WPDocs = [
          {
            Title: DisplayFolderName.PaymentBill,
            data: WorkPermitDoc.data,
          },
        ];
        docs.push(...WPDocs);
      }

      setdocumentview(docs);

      setData((prev) => ({
        ...prev,
        CandidateID: item?.CandidateDetails.CandidateID,
        ProfileID: item?.CandidateDetails?.ProfileID,
        ApplicantName: item.ApplicantName,
        ApplicantSurName: item.CandidateDetails?.LastName,
        positionID: item?.PositionID,
        BusinessUnitCode: item?.BusinessUnitCode,
        Department: item?.Department,
        SubDepartment: item?.RecruitmentDetails?.SubDepartment,
        Section: item?.RecruitmentDetails?.Section,
        DepartmentCode: item?.RecruitmentDetails?.DepartmentCode,
        EmploymentCategory: item?.RecruitmentDetails?.EmploymentCategory,
        TypeOfCOntract: item?.RecruitmentDetails?.TypeOfContract,
        Nationalty: item.CandidateDetails?.Nationality,
        RecNationality: item.RecruitmentDetails?.Nationality,
        AreaOfWork: item?.RecruitmentDetails?.AreaofWork,
        Location: item?.CandidateDetails?.Location,
        jobRequestID: item?.CandidateDetails?.JobRequestID,
        Email: item?.CandidateDetails?.Email,
        IdentityNumber: item?.CandidateDetails?.IdentityNumber,
        ProofOfIdentity: item?.CandidateDetails?.ProofOfIdentity,
        // PersonalDocs: PersonalDocs.data,
        // MedicalDocs: MedicalDocs.data,
        JoiningDate: CandidateDetails?.data?.[0]?.joiningDate ?? "",
        NoticePeriod: CandidateDetails?.data?.[0]?.noticePeriod ?? "",
        BGVRadioBtnlabel:
          props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation &&
          item.RecruitmentDetails?.Nationality === Nationality.Nationals
            ? RadioBtnLabel.BGVNationalsLabel
            : props.stateValue?.StatusId === StatusId.PendingHROfferInitiate &&
              item?.RecruitmentDetails?.EmploymentCategory ===
                EmployeementCategory.LaborhireContractor
            ? RadioBtnLabel.OfferInitiationLabel
            : RadioBtnLabel.BGVExpatriatesLabel,
      }));

      setchecklistData((prev) => ({
        ...prev,
        DocumentComplianceChecks: {
          ...prev.DocumentComplianceChecks,
          DocumentComplianceChecks: {
            ...prev.DocumentComplianceChecks.DocumentComplianceChecks,
            BackgroundChecks: {
              ...prev.DocumentComplianceChecks.DocumentComplianceChecks
                .BackgroundChecks,
              value:
                item?.CandidateDetails?.BackgroundChecks ===
                ActionName.Completed
                  ? true
                  : false,
            },
            SignedOfferLetter: {
              ...prev.DocumentComplianceChecks.DocumentComplianceChecks
                .SignedOfferLetter,
              value:
                item?.CandidateDetails?.SignedOfferLetterVerified ===
                ActionName.Completed
                  ? true
                  : false,
            },
            SignedEmploymentContract: {
              ...prev.DocumentComplianceChecks.DocumentComplianceChecks
                .SignedEmploymentContract,
              value:
                item?.CandidateDetails?.SignedEmploymentContract ===
                ActionName.Completed
                  ? true
                  : false,
            },
            WorkPermitApproved: {
              ...prev.DocumentComplianceChecks.DocumentComplianceChecks
                .WorkPermitApproved,
              value:
                item?.CandidateDetails?.WorkPermitApproved ===
                ActionName.Completed
                  ? true
                  : false,
            },
          },
        },
        LogisticsEmployeeSupport: {
          ...prev.LogisticsEmployeeSupport,
          LogisticsEmployeeSupport: {
            ...prev.LogisticsEmployeeSupport.LogisticsEmployeeSupport,
            VisaProcess: {
              ...prev.LogisticsEmployeeSupport.LogisticsEmployeeSupport
                .VisaProcess,
              value:
                item?.CandidateDetails?.VisaProcess === ActionName.Completed
                  ? true
                  : false,
            },
            AccommodationBooked: {
              ...prev.LogisticsEmployeeSupport.LogisticsEmployeeSupport
                .AccommodationBooked,
              value:
                item?.CandidateDetails?.AccommodationBooked ===
                ActionName.Completed
                  ? true
                  : false,
            },
            TravelProcess: {
              ...prev.LogisticsEmployeeSupport.LogisticsEmployeeSupport
                .TravelProcess,
              value:
                item?.CandidateDetails?.TravelProcess === ActionName.Completed
                  ? true
                  : false,
            },
          },
        },
        FinalStatus: {
          ...prev.FinalStatus,
          FinalStatus: {
            ...prev.FinalStatus.FinalStatus,
            ReadyforOnboarding: {
              ...prev.FinalStatus.FinalStatus.ReadyforOnboarding,
              value:
                item?.CandidateDetails?.ReadyforOnboarding ===
                ActionName.Completed
                  ? true
                  : false,
            },
          },
        },
      }));

      // setViewDocument((prev) => ({
      //   ...prev,
      //   ReviewOfferDoc: OfferLetter.data,
      //   ReviewEmployDocs: EmployementContract.data,
      //   ViewFolderPath: item?.CandidateDetails?.DocumentFolderPath,
      // }));

      if (
        props.stateValue?.StatusId ===
          StatusId.OnboardingProcessinitiatedforDRC ||
        props.stateValue?.StatusId ===
          StatusId.OnboardingProcessinitiatedforExpat
      ) {
        setData((prev) => ({
          ...prev,
          TrainingSystem: item?.CandidateDetails?.TrainingSystem,
          TASystem: item?.CandidateDetails?.TASystem,
          ITSystem: item?.CandidateDetails?.ITSystem,
          ITRequired:
            item?.CandidateDetails?.ITSystem.ITStatus === "Not Applicable"
              ? "No"
              : item?.CandidateDetails?.ITSystem.ITStatus === "Pending"
              ? "Yes"
              : "Yes",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    console.log(props.userDetails[0]?.ID, "UserId");
    void fetchData();
    setchecklistData(onboardingData);
    const newTabNames = [
      { tabName: props.stateValue?.TabName },
      // { tabName: props.stateValue?.ButtonAction },
      { tabName: TabName.ViewCandidateDetails },
    ];
    setTabNameData(newTabNames);
    let CurrentDate = new Date(
      todaydate.getFullYear(),
      todaydate.getMonth(),
      todaydate.getDate(),
      todaydate.getHours(),
      todaydate.getMinutes(),
      todaydate.getSeconds()
    );
    let CheckboxLabel: string = "";
    // switch (props.stateValue?.StatusId) {
    //   case StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter:
    //     CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterDRC;
    //     break;
    //   case StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter:
    //     CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterExpat;
    //     break;
    //   case StatusId.PendingwithCandidatetoSignOfferLetter:
    //     CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterExpat;
    //     break;
    //   // case StatusId.PendingwithCandidatetoUploadOtherDocuments:
    //   //   CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterExpat;
    //   //   break;
    // }
    CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterExpat;
    setData((prev) => ({
      ...prev,
      SignDate: CurrentDate,
      CheckboxContent: CheckboxLabel,
    }));
  }, []);

  const handleInputChangeTextArea = (
    stateValue: string,
    tab?: keyof UploadDocument,
    value?: string | any
  ) => {
    if (tab) {
      setData((prevState) => ({
        ...prevState,
        [tab]: {
          ...prevState[tab],
          [stateValue]: value,
        },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [stateValue]: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        [stateValue]: false,
      }));
    }
  };

  console.log(checklistData, "checklistDatachecklistData");

  const handleCheckboxchanges = (value: string | any) => {
    setData((prev) => ({
      ...prev,
      Checkbox: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      checkbox: false,
    }));
  };

  const handleDocument = (StateValue: string, value: IDocFiles[]) => {
    setData((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationErrors((prevState: any) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const handleRadioChange = (StateValue: string, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationErrors((prevState: any) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  const handleDelete = (index: number, attachmentType: string) => {
    setData((prevState) => {
      const currentValue = prevState[attachmentType as keyof UploadDocument];
      const updatedAttachments = Array.isArray(currentValue)
        ? [...currentValue]
        : [];

      updatedAttachments.splice(index, 1);

      return {
        ...prevState,
        [attachmentType]: updatedAttachments,
      };
    });
  };

  // const handleAutoComplete = async (
  //   tab: keyof UploadDocument,
  //   key: string,
  //   item: AutoCompleteItem | null
  // ) => {
  //   if (item) {
  //     setData((prevState) => ({
  //       ...prevState,
  //       [tab]: {
  //         ...prevState[tab],
  //         [key]: item,
  //       },
  //     }));
  //     // setValidationError((prevState: any) => ({
  //     //   ...prevState,
  //     //   [key]: false,
  //     // }));
  //   }
  //   if (key === "Region") {
  //     let filterConditions: any[] = [];
  //     let Conditions = "and";
  //     filterConditions.push({
  //       FilterKey: "Region",
  //       Operator: "eq",
  //       FilterValue: item?.key,
  //     });
  //     const zoneOptions = await OfferLetterServices.FilterZoneInRegion(
  //       filterConditions,
  //       Conditions
  //     );
  //     if (zoneOptions.status === ResponeStatus.SUCCESS) {
  //       const ZoneOpt: AutoCompleteItem[] = (zoneOptions.data ?? []).map(
  //         (opt: any) => ({
  //           key: opt.ID,
  //           text: opt.Zone,
  //         })
  //       );
  //       // setOptionValue((prevState) => ({
  //       //   ...prevState,
  //       //   ZoneOption: ZoneOpt,
  //       // }));
  //       setData((prevState) => ({
  //         ...prevState,
  //         [tab]: {
  //           ...prevState[tab],
  //           Zone: { key: 0, text: "" },
  //         },
  //       }));
  //     }
  //   }
  // };

  // const handleDateChange = async (
  //   tab: keyof UploadDocument,
  //   key: string,
  //   item: Date | undefined
  // ) => {
  //   if (item) {
  //     const now = new Date();
  //     const updatedDate = new Date(item);

  //     updatedDate.setHours(now.getHours());
  //     updatedDate.setMinutes(now.getMinutes());
  //     updatedDate.setSeconds(now.getSeconds());
  //     updatedDate.setMilliseconds(now.getMilliseconds());

  //     setData((prevState) => ({
  //       ...prevState,
  //       [tab]: {
  //         ...prevState[tab],
  //         [key]: updatedDate,
  //       },
  //     }));

  //     if (key === "StartDate") {
  //       setData((prevState) => ({
  //         ...prevState,
  //         [tab]: {
  //           ...prevState[tab],
  //           EndDate:
  //             updatedDate < data[tab]?.EndDate ? data[tab]?.EndDate : undefined,
  //         },
  //       }));
  //     }
  //     if (key === "EndDate") {
  //       setData((prevState) => ({
  //         ...prevState,
  //         [tab]: {
  //           ...prevState[tab],
  //           EndDate:
  //             updatedDate > data[tab]?.StartDate ? updatedDate : undefined,
  //         },
  //       }));
  //     }
  //     // setValidationError((prevState: any) => ({
  //     //   ...prevState,
  //     //   [key]: false,
  //     // }));
  //   }
  // };

  // const handleMulitiSelect = async (
  //   tab: keyof UploadDocument,
  //   key: string,
  //   item: AutoCompleteItem[] | null
  // ) => {
  //   if (item) {
  //     setData((prevState) => ({
  //       ...prevState,
  //       [tab]: {
  //         ...prevState[tab],
  //         [key]: item,
  //       },
  //     }));
  //   }
  // };

  // function handleFileDownload(documentUrl: string) {
  //   const viewUrl = documentUrl.includes("?")
  //     ? `${documentUrl}&web=1`
  //     : `${documentUrl}?web=1`;

  //   window.open(viewUrl, "_blank");
  // }

  const handleToggle = (
    section: string,
    field: string,
    value: boolean,
    id: number
  ) => {
    if (
      section !== "DocumentComplianceChecks" &&
      section !== "LogisticsEmployeeSupport" &&
      section !== "FinalStatus"
    ) {
      console.error("Invalid section:", section);
      return;
    }

    const subKey =
      section === "FinalStatus"
        ? "FinalStatus"
        : section === "LogisticsEmployeeSupport"
        ? "LogisticsEmployeeSupport"
        : "DocumentComplianceChecks";

    setchecklistData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subKey]: Object.fromEntries(
          Object.entries(prev[section][subKey]).map(([key, item]: any) => {
            if (item.id === id) {
              return [key, { ...item, value }];
            }
            return [key, item];
          })
        ),
      },
    }));
  };

  React.useEffect(() => {
    if (!checklistData) return;

    setChecklistStatus({
      BackgroundChecks:
        checklistData.DocumentComplianceChecks.DocumentComplianceChecks
          .BackgroundChecks.value,
      SignedOfferLetter:
        checklistData.DocumentComplianceChecks.DocumentComplianceChecks
          .SignedOfferLetter.value,
      EmploymentContract:
        checklistData.DocumentComplianceChecks.DocumentComplianceChecks
          .SignedEmploymentContract.value,
      WorkPermitApproved:
        checklistData.DocumentComplianceChecks.DocumentComplianceChecks
          .WorkPermitApproved.value,
      VisaProcess:
        checklistData.LogisticsEmployeeSupport.LogisticsEmployeeSupport
          .VisaProcess.value,
      AccommodationBooked:
        checklistData.LogisticsEmployeeSupport.LogisticsEmployeeSupport
          .AccommodationBooked.value,
      TravelProcess:
        checklistData.LogisticsEmployeeSupport.LogisticsEmployeeSupport
          .TravelProcess.value,
      ReadyforOnboarding:
        checklistData.FinalStatus.FinalStatus.ReadyforOnboarding.value,
    });
  }, [checklistData]);

  React.useEffect(() => {
    const allCompleted = Object.values(checklistStatus).every(
      (value) => value === true
    );

    setBtnEnable(allCompleted);
  }, [checklistStatus]);

  const categoryList = [
    {
      label: checklistData?.DocumentComplianceChecks.label,
      section: "DocumentComplianceChecks",
      items: convertToList(
        checklistData?.DocumentComplianceChecks.DocumentComplianceChecks
      ),
    },
    {
      label: checklistData?.LogisticsEmployeeSupport.label,
      section: "LogisticsEmployeeSupport",
      items: convertToList(
        checklistData?.LogisticsEmployeeSupport.LogisticsEmployeeSupport
      ),
    },
    {
      label: checklistData?.FinalStatus.label,
      section: "FinalStatus",
      items: convertToList(checklistData?.FinalStatus.FinalStatus),
    },
  ];

  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
        <>
          {/* <div className="sub-menu-card"> */}
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
                {/* <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Job Title - ${props.stateValue.JobTitle} (${props.stateValue.JobCode})`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                  <div
                    className="ms-Grid-col ms-lg6"
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <LabelHeaderComponents
                      value={`Status - ${props.stateValue.Status}`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                </div> */}
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.PositionID}
                      value={data?.positionID}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.ApplicantName}
                      value={data.ApplicantName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.ApplicantSurname}
                      value={data.ApplicantSurName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.Nationality}
                      value={data.Nationalty}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.BusinessUnitCode}
                      value={data.BusinessUnitCode}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Department}
                      value={data?.Department}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.SubDepartment}
                      value={data?.SubDepartment}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Section}
                      value={data?.Section}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.DepartmentCode}
                      value={data?.DepartmentCode}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.EmploymentCategory}
                      value={data?.EmploymentCategory}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.TypeofContract}
                      value={data?.TypeOfCOntract}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.AreaofWork}
                      value={data?.AreaOfWork}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Location}
                      value={data?.Location}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.Email}
                      value={data?.Email}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.ProofOfIdentity}
                      value={data?.ProofOfIdentity}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.IdentityNumber}
                      value={data?.IdentityNumber}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                {/* {props.stateValue?.StatusId ===
                  StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter ||
                props.stateValue?.StatusId ===
                  StatusId.PendingwithTAforMedicalScreening ? (
                  <></>
                ) : (
                  <>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelNames.CandidateDetails.JoiningDate}
                          value={data?.JoiningDate}
                          disabled={true}
                          mandatory={false}
                        />
                      </div>
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelNames.CandidateDetails.NoticePeriod}
                          value={data?.NoticePeriod}
                          disabled={true}
                          mandatory={false}
                        />
                      </div>
                    </div>
                  </>
                )} */}

                {props.stateValue?.StatusId ===
                StatusId.PendingHRBGVInitiation ? (
                  <>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <>
                          <CustomLabel
                            value={Attachment.PositionDocument.ConsentDoc}
                            mandatory={true}
                          />
                          <AttachmentButton
                            label="Upload"
                            iconName="CloudUpload"
                            iconNameHover="CloudUpload"
                            allowMultiple={false}
                            AttachState={(newAttachment: any) => {
                              let attachment: IDocFiles[] = newAttachment.map(
                                (item: any) => {
                                  return {
                                    name: "ConsentForm- " + item.name,
                                    content: item.file,
                                    type: "New",
                                    url: item.Url,
                                  };
                                }
                              );
                              // const attachments = [
                              //   ...(data.ConsentDocs || []),
                              //   ...attachment,
                              // ];
                              handleDocument("ConsentDocs", attachment);
                            }}
                            mandatory={true}
                            error={validationErrors.ConsentDocs}
                            Style={{
                              backgroundColor:
                                ColorCode.ButtonColorCode.ButtonColor,
                              color: "white",
                            }}
                            fileformat=".doc,.pdf,.docx"
                          />
                          <CustomViewAttachment
                            Attachment={data.ConsentDocs ?? []}
                            StateValue={"ConsentDocs"}
                            handleDelete={(index, fileState) =>
                              handleDelete(index, fileState)
                            }
                          />
                        </>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingHROfferInitiate &&
                data.EmploymentCategory ===
                  EmployeementCategory.KCSAEmployee ? (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg3">
                      <>
                        <CustomLabel
                          value={Attachment.PositionDocument.OfferLetter}
                          mandatory={true}
                        />
                        <AttachmentButton
                          label="Upload"
                          iconName="CloudUpload"
                          iconNameHover="CloudUpload"
                          allowMultiple={false}
                          AttachState={(newAttachment: any) => {
                            let attachment: IDocFiles[] = newAttachment.map(
                              (item: any) => {
                                return {
                                  name: "OfferLetterEnglish-" + item.name,
                                  content: item.file,
                                  type: "New",
                                  url: item.Url,
                                };
                              }
                            );
                            // const attachments = [
                            //   ...(data.OfferLetterDoc || []),
                            //   ...attachment,
                            // ];
                            handleDocument("OfferLetterDoc", attachment);
                          }}
                          mandatory={true}
                          error={validationErrors.OfferLetterDoc}
                          Style={{
                            backgroundColor:
                              ColorCode.ButtonColorCode.ButtonColor,
                            color: "white",
                          }}
                          fileformat=".pdf"
                        />
                        <CustomViewAttachment
                          Attachment={data.OfferLetterDoc ?? []}
                          StateValue={"OfferLetterDoc"}
                          handleDelete={(index, fileState) =>
                            handleDelete(index, fileState)
                          }
                        />
                      </>
                    </div>

                    {/* <div className="ms-Grid-col ms-lg3">
                      <>
                        <CustomLabel
                          value={Attachment.PositionDocument.OfferLetterFre}
                          mandatory={true}
                        />
                        <AttachmentButton
                          label="Upload"
                          iconName="CloudUpload"
                          iconNameHover="CloudUpload"
                          allowMultiple={false}
                          AttachState={(newAttachment: any) => {
                            let attachment: IDocFiles[] = newAttachment.map(
                              (item: any) => {
                                return {
                                  name: "OfferLetterFrench- " + item.name,
                                  content: item.file,
                                  type: "New",
                                  url: item.Url,
                                };
                              }
                            );
                            // const attachments = [
                            //   ...(data.ConsentDocs || []),
                            //   ...attachment,
                            // ];
                            handleDocument("ConsentDocs", attachment);
                          }}
                          mandatory={true}
                          error={validationErrors.ConsentDocs}
                          Style={{
                            backgroundColor:
                              ColorCode.ButtonColorCode.ButtonColor,
                            color: "white",
                          }}
                          fileformat=".doc,.pdf,.docx"
                        />
                        <CustomViewAttachment
                          Attachment={data.ConsentDocs ?? []}
                          StateValue={"ConsentDocs"}
                          handleDelete={(index, fileState) =>
                            handleDelete(index, fileState)
                          }
                        />
                      </>
                    </div> */}
                  </div>
                ) : (
                  <></>
                )}

                {props.stateValue?.StatusId ===
                  StatusId.WorkPermitAcknowledgedContractUploaded && (
                  <div className="ms-Grid-row" style={{ marginLeft: "2px" }}>
                    <CustomLabel
                      value={Attachment.PositionDocument.EmployementDoc}
                      mandatory={true}
                    />
                    <AttachmentButton
                      label="Upload"
                      iconName="CloudUpload"
                      iconNameHover="CloudUpload"
                      allowMultiple={false}
                      AttachState={(newAttachment: any) => {
                        let attachment: IDocFiles[] = newAttachment.map(
                          (item: any) => {
                            return {
                              name: item.name,
                              content: item.file,
                              type: "New",
                              url: item.Url,
                            };
                          }
                        );
                        // const attachments = [
                        //   ...(data.EmployementDoc || []),
                        //   ...attachment,
                        // ];
                        handleDocument("EmployementDoc", attachment);
                      }}
                      mandatory={true}
                      error={validationErrors.EmployementDoc}
                      Style={{
                        backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                        color: "white",
                      }}
                      fileformat=".pdf"
                    />
                    <CustomViewAttachment
                      Attachment={data.EmployementDoc ?? []}
                      StateValue={"EmployementDoc"}
                      handleDelete={(index, fileState) =>
                        handleDelete(index, fileState)
                      }
                    />
                  </div>
                )}

                {props.stateValue?.ButtonAction === ButtonAction.Initiated ||
                props.stateValue?.StatusId ===
                  StatusId.PendingBGdocuploadedbycandidate ? (
                  <></>
                ) : (
                  <>
                    <div className="ms-Grid-row" style={{ marginLeft: "2px" }}>
                      <div className="custom-document-column">
                        <CustomLabel
                          value={Attachment.PositionDocument.CandidateDocuments}
                        />
                        <div className="document-wrapper">
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
                            onClick={() => {
                              setDocumentPopup(true);
                            }}
                            spacing={4}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {props.CurrentRoleID.includes(RoleID.FinanceDepartment) &&
                props.stateValue?.StatusId ===
                  StatusId.PendingFinancePaymentReview ? (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg5">
                      <CustomRadioGroup
                        label={RadioBtnLabel.PaymentReview}
                        value={data.PaymentReview}
                        options={["Yes", "No"]}
                        error={validationErrors.PaymentReview}
                        mandatory={true}
                        onChange={(item) =>
                          handleRadioChange("PaymentReview", item)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {(props.stateValue?.StatusId ===
                  StatusId.PendingHRBGVInitiation ||
                  (props.stateValue?.StatusId ===
                    StatusId.PendingHROfferInitiate &&
                    data.EmploymentCategory ===
                      EmployeementCategory.LaborhireContractor)) && (
                  <div className="ms-Grid-row" style={{ marginTop: "2%" }}>
                    <div className="ms-Grid-col ms-lg6">
                      <CustomRadioGroup
                        label={data.BGVRadioBtnlabel}
                        value={data.BGVRadioBtn}
                        options={["Yes", "No"]}
                        error={validationErrors.BGVRadioBtn}
                        mandatory={true}
                        onChange={(item) =>
                          handleRadioChange("BGVRadioBtn", item)
                        }
                      />
                    </div>
                  </div>
                )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingHRReviewBGCheck ||
                props.stateValue?.StatusId ===
                  StatusId.PendingHRReviewOfferWorkPermitInit ||
                props.stateValue?.StatusId ===
                  StatusId.PendingHRReviewWorkpermitDocs ||
                props.stateValue?.StatusId ===
                  StatusId.PendingHREmploymentContractVerification ||
                props.stateValue?.StatusId === StatusId.PendingHROfferReview ||
                props.stateValue?.StatusId ===
                  StatusId.PendingHREmploymentContractReview ? (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg5">
                      <CustomRadioGroup
                        label={
                          props.stateValue?.StatusId ===
                            StatusId.PendingHRReviewBGCheck &&
                          data.RecNationality === Nationality.Nationals
                            ? RadioBtnLabel.BGVNational
                            : RadioBtnLabel.DocumentVerification
                        }
                        value={data.RadioAction}
                        options={["Yes", "No"]}
                        error={validationErrors.RadioAction}
                        mandatory={true}
                        onChange={(item) =>
                          handleRadioChange("RadioAction", item)
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {props.stateValue?.ButtonAction === ButtonAction.View ||
                props.stateValue?.StatusId ===
                  StatusId.PendingHRpreonboardingchecklist ? (
                  <></>
                ) : (
                  <>
                    <div className="ms-Grid-row">
                      <div
                        className="ms-Grid-col ms-lg12"
                        style={{ marginBottom: "7px" }}
                      >
                        <CustomTextArea
                          label={labelNames.CommanLabel.Comments}
                          value={data.comments}
                          error={validationErrors.comments}
                          onChange={(value) =>
                            handleInputChangeTextArea(
                              "comments",
                              undefined,
                              value
                            )
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
                          label={CheckboxContent.PostRecrutimentCheckboxContent}
                          checked={data.Checkbox}
                          error={validationErrors.checkbox}
                          onChange={(value: boolean) =>
                            handleCheckboxchanges(value)
                          }
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
                          JobTitleInFrench={props.userDetails[0].JopTitleFrench}
                          Department={props.userDetails[0].DepartmentName}
                          Date={data.SignDate}
                          TermsAndCondition={data.Checkbox}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ),
    },
    {
      label: TabName.OnboardingChecklist,
      value: "tab2",
      content: (
        <>
          <Card sx={{ marginTop: "2%" }}>
            <CardContent>
              <div>
                <div className="ms-Grid-row">
                  <div
                    className="ms-Grid-col ms-lg8"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      // marginBottom: "20px",
                      marginBottom: "12px",
                    }}
                  >
                    <h2
                      style={{
                        color: ColorCode.ButtonColorCode.ButtonColor,
                        fontSize: "18px",
                      }}
                    >
                      OnboardingChecklist
                    </h2>
                  </div>
                  <div
                    className="ms-Grid-col ms-lg4"
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginTop: "-2%",
                    }}
                  >
                    <StatusBar checklist={checklistStatus} />
                  </div>
                </div>

                {categoryList.map((cat, index) => (
                  <Accordion
                    key={index}
                    expanded={expandedIndex === index}
                    onChange={() => handleExpand(index)}
                    sx={{ marginBottom: 2 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontSize={16} fontWeight="bold">
                        {cat.label}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      {cat.items.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                            padding: "12px",
                            marginBottom: "12px",
                          }}
                        >
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg6">
                              <Typography>{item.label}</Typography>
                            </div>

                            <div
                              className="ms-Grid-col ms-lg6"
                              style={{ display: "flex", gap: "12px" }}
                            >
                              {/* YES BUTTON */}
                              <ReuseButton
                                label="Yes"
                                Style={{
                                  height: "32px",
                                  width: "60px",
                                  backgroundColor:
                                    item.value === true ? "green" : "#eaeaea",
                                  color:
                                    item.value === true ? "white" : "black",
                                  border: "1px solid #ccc",
                                  borderRadius: "5px",
                                }}
                                onClick={() =>
                                  handleToggle(
                                    cat.section,
                                    item.label,
                                    true,
                                    item.id
                                  )
                                }
                              />

                              {/* NO BUTTON */}
                              <ReuseButton
                                label="No"
                                Style={{
                                  height: "32px",
                                  width: "60px",
                                  backgroundColor:
                                    item.value === false ? "red" : "#eaeaea",
                                  color:
                                    item.value === false ? "white" : "black",
                                  border: "1px solid #ccc",
                                  borderRadius: "5px",
                                }}
                                onClick={() =>
                                  handleToggle(
                                    cat.section,
                                    item.label,
                                    false,
                                    item.id
                                  )
                                }
                              />
                            </div>
                          </div>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}

                <div className="ms-Grid-row">
                  <div
                    className="ms-Grid-col ms-lg12"
                    style={{ marginBottom: "7px" }}
                  >
                    <CustomTextArea
                      label={labelNames.CommanLabel.Comments}
                      value={data.comments}
                      error={validationErrors.comments}
                      onChange={(value) =>
                        handleInputChangeTextArea("comments", undefined, value)
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
                      label={CheckboxContent.PostRecrutimentCheckboxContent}
                      checked={data.Checkbox}
                      error={validationErrors.checkbox}
                      onChange={(value: boolean) =>
                        handleCheckboxchanges(value)
                      }
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
                      Date={data.SignDate}
                      TermsAndCondition={data.Checkbox}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ),
    },
  ];

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  const Validation = (): boolean => {
    let errors = {
      OfferLetterDoc: false,
      ConsentDocs: false,
      EmployementDoc: false,
      comments: false,
      checkbox: false,
      RadioAction: false,
      ITRequired: false,
      PaymentReview: false,
    };
    if (props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation) {
      errors.ConsentDocs = !IsValid(data.ConsentDocs);
    }
    if (
      props.stateValue?.StatusId === StatusId.PendingHROfferInitiate &&
      data.EmploymentCategory === EmployeementCategory.KCSAEmployee
    ) {
      errors.OfferLetterDoc = !IsValid(data.OfferLetterDoc);
      // errors.ConsentDocs = !IsValid(data.ConsentDocs);
    } else if (
      props.stateValue?.StatusId ===
      StatusId.WorkPermitAcknowledgedContractUploaded
      // props.stateValue?.StatusId === StatusId.PendingHREmploymentContractInit
    ) {
      errors.EmployementDoc = !IsValid(data.EmployementDoc);
    }
    if (
      props.stateValue?.StatusId === StatusId.PendingHRReviewBGCheck ||
      props.stateValue?.StatusId ===
        StatusId.PendingHRReviewOfferWorkPermitInit ||
      props.stateValue?.StatusId === StatusId.PendingHRReviewWorkpermitDocs ||
      props.stateValue?.StatusId ===
        StatusId.PendingHREmploymentContractVerification ||
      props.stateValue?.StatusId === StatusId.PendingHROfferReview ||
      props.stateValue?.StatusId === StatusId.PendingHREmploymentContractReview
    ) {
      errors.RadioAction = !IsValid(data.RadioAction);
    }
    errors.comments = !IsValid(data.comments);
    errors.checkbox = !IsValid(data.Checkbox);

    if (
      props.CurrentRoleID.includes(RoleID.FinanceDepartment) &&
      props.stateValue?.StatusId === StatusId.PendingFinancePaymentReview
    ) {
      errors.PaymentReview = !IsValid(data.PaymentReview);
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };
  // const SpiltDateOnly = (date: Date) => {
  //   const updatedDate = date;
  //   const year = updatedDate?.getFullYear();
  //   const month = String(updatedDate?.getMonth() + 1).padStart(2, "0");
  //   const day = String(updatedDate?.getDate()).padStart(2, "0");

  //   const dateOnly = new Date(
  //     Date.UTC(Number(year), Number(month) - 1, Number(day))
  //   ); //`${year}-${month}-${day}`;
  //   return dateOnly.toISOString();
  // };
  const SaveAsDraft = async () => {
    setIsLoading(true);
    try {
      const isValid = !Validation();
      if (isValid) {
        let ChecklistValue = {
          BackgroundChecks: checklistStatus.BackgroundChecks
            ? ActionName.Completed
            : ActionName.Pending,
          SignedOfferLetterVerified: checklistStatus.SignedOfferLetter
            ? ActionName.Completed
            : ActionName.Pending,
          SignedEmploymentContract: checklistStatus.EmploymentContract
            ? ActionName.Completed
            : ActionName.Pending,
          WorkPermitApproved: checklistStatus.WorkPermitApproved
            ? ActionName.Completed
            : ActionName.Pending,
          VisaProcess: checklistStatus.VisaProcess
            ? ActionName.Completed
            : ActionName.Pending,
          AccommodationBooked: checklistStatus.AccommodationBooked
            ? ActionName.Completed
            : ActionName.Pending,
          TravelProcess: checklistStatus.TravelProcess
            ? ActionName.Completed
            : ActionName.Pending,
          ReadyforOnboarding: checklistStatus.ReadyforOnboarding
            ? ActionName.Completed
            : ActionName.Pending,
          ID: data.CandidateID,
        };
        const UpdateStatusCandidateList =
          await OfferLetterServices.UpdateStatusCandidatelist(ChecklistValue);
        if (UpdateStatusCandidateList.status === ResponeStatus.SUCCESS) {
          const SuccessAlert = {
            Message: RecuritmentHRMsg.ChecklistSaveAsDraftMsg,
            Type: HRMSAlertOptions.Success,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                props.navigation("/UploadOfferDocumentList", {
                  state: {
                    ID: props.stateValue?.ID,
                    TabNames: props.stateValue?.TabName,
                    ButtonAction: ButtonAction.View,
                    JobCode: props.stateValue?.JobCode,
                    tab: props.stateValue?.tab,
                    JobCodeID: props.stateValue?.JobCodeId,
                  },
                });
                setAlertPopupOpen(false);
              } else {
                setAlertPopupOpen(false);
              }
            },
          };

          setAlertPopupOpen(true);
          setalertProps(SuccessAlert);
          setIsLoading(false);
          // }
        } else {
          const ApiErrorMsg = {
            Message: RecuritmentHRMsg.APIErrorMsg,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                props.navigation("/UploadOfferDocumentList", {
                  state: {
                    ID: props.stateValue?.ID,
                    TabNames: props.stateValue?.TabName,
                    ButtonAction: ButtonAction.View,
                    JobCode: props.stateValue?.JobCode,
                    tab: props.stateValue?.tab,
                    JobCodeID: props.stateValue?.JobCodeId,
                  },
                });
                setAlertPopupOpen(false);
              } else {
                setAlertPopupOpen(false);
              }
            },
          };

          setAlertPopupOpen(true);
          setalertProps(ApiErrorMsg);
          setIsLoading(false);
        }
      } else {
        let FormFieldFailed = {
          Message: RecuritmentHRMsg.FormValidationMsg,
          Type: HRMSAlertOptions.Error,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              setAlertPopupOpen(false);
            }
          },
        };
        setAlertPopupOpen(true);
        setalertProps(FormFieldFailed);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting candidate details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Submit_fn = async (btnAction: string) => {
    setIsLoading(true);
    try {
      const isValid = !Validation();
      if (isValid) {
        let DocumentData: DocumentName;
        let DocumentResponse: any;
        let workflowStatusValue: string = "";
        let SuccessMsg: string = "";
        let ActionID: number = WorkflowAction.Approved;
        switch (props.stateValue?.StatusId) {
          case StatusId.PendingHRBGVInitiation:
            {
              if (btnAction === ButtonAction.Initiated) {
                DocumentData = {
                  ProfileID: data?.ProfileID,
                  RequestID: data?.jobRequestID,
                  DocumentName: DocumentFolderName.BGVConsentform,
                  UnsignedDoc: "",
                };
                let BGVConsentDocs = [...data.ConsentDocs];
                DocumentResponse =
                  await OfferLetterServices.UploadCandidateDocument(
                    DocumentData,
                    BGVConsentDocs
                  );

                workflowStatusValue =
                  workflowStatusApi.PendingCandidateUploadBGVDocs;
                SuccessMsg = RecuritmentHRMsg.BGverificationMsg;
                ActionID = WorkflowAction.Approved;
                // DocumentResponse = {
                //   status: ResponeStatus.SUCCESS,
                // };
              }
            }
            break;
          case StatusId.PendingHRReviewBGCheck:
            {
              if (btnAction === ButtonAction.Review) {
                DocumentResponse = await laborHireService.InitiateBGVProcess(
                  Number(data?.jobRequestID)
                );
                workflowStatusValue = workflowStatusApi.initiatetheBGVProcess;
                SuccessMsg =
                  props.stateValue?.StatusId ===
                    StatusId.PendingHRReviewBGCheck &&
                  data.RecNationality === Nationality.Nationals
                    ? RecuritmentHRMsg.BGReviewedMsg
                    : RecuritmentHRMsg.BGReviewinitBGV;
                ActionID = WorkflowAction.Approved;
              } else if (btnAction === ButtonAction.Revert) {
                workflowStatusValue =
                  workflowStatusApi.RevetedBacktoBGVDocuments;
                SuccessMsg = RecuritmentHRMsg.RevertWGDocs;
                ActionID = WorkflowAction.Revert;
                DocumentResponse = {
                  status: ResponeStatus.SUCCESS,
                };
              }
            }
            break;
          case StatusId.PendingHROfferInitiate:
            {
              if (
                data.EmploymentCategory === EmployeementCategory.KCSAEmployee
              ) {
                DocumentData = {
                  ProfileID: data?.ProfileID,
                  RequestID: data?.jobRequestID,
                  DocumentName: DocumentFolderName.Offerletter,
                  UnsignedDoc: DocumentFolderName.UnsignedDoc,
                };
                let offerLetterDocs = [
                  ...data.OfferLetterDoc,
                  ...data.ConsentDocs,
                ];
                DocumentResponse =
                  await OfferLetterServices.UploadCandidateDocument(
                    DocumentData,
                    offerLetterDocs
                  );

                workflowStatusValue =
                  workflowStatusApi.Pendingwithcandidatetosignofferletter;
                SuccessMsg = RecuritmentHRMsg.OfferLetterMsg;
                ActionID = WorkflowAction.Approved;
              } else {
                let response =
                  OfferLetterServices.InitiateLabouHireOfferRelease(
                    data,
                    dataValue[0],
                    props.userDetails[0]?.EmailId
                  );
                if ((await response).status === 200) {
                  DocumentResponse = {
                    status: ResponeStatus.SUCCESS,
                  };
                } else {
                  DocumentResponse = {
                    status: ResponeStatus.FAILED,
                  };
                }
                // console.log(dataValue);

                workflowStatusValue = workflowStatusApi.PendingHROfferInitiate;
                SuccessMsg = RecuritmentHRMsg.OfferLetterinit;
                ActionID = WorkflowAction.Approved;
                // DocumentResponse = {
                //   status: ResponeStatus.SUCCESS,
                // };
              }
            }
            break;
          case StatusId.PendingHROfferReview: {
            {
              if (btnAction === ButtonAction.Review) {
                workflowStatusValue =
                  workflowStatusApi.Pendingwithcandidatetosignofferletter;
                SuccessMsg = RecuritmentHRMsg.ReviewLaborHireOffer;
                ActionID = WorkflowAction.Approved;
              } else if (btnAction === ButtonAction.Revert) {
                workflowStatusValue =
                  workflowStatusApi.RevertedtheLabourHireOfferRelease;
                SuccessMsg = RecuritmentHRMsg.RevertLabourOffer;
                ActionID = WorkflowAction.Revert;
              }
              DocumentResponse = {
                status: ResponeStatus.SUCCESS,
              };
            }
            break;
          }
          case StatusId.PendingHRReviewOfferWorkPermitInit: {
            if (btnAction === ButtonAction.Review) {
              workflowStatusValue =
                workflowStatusApi.PendingwithCandidatetouploadotherDocuments;
              SuccessMsg = RecuritmentHRMsg.ReviewOfferLetterMsg;
              ActionID = WorkflowAction.Approved;
            } else if (btnAction === ButtonAction.Revert) {
              workflowStatusValue =
                workflowStatusApi.RevertedBacktoCandidateforreuploadofferLetter;
              SuccessMsg = RecuritmentHRMsg.RevertedOfferLetter;
              ActionID = WorkflowAction.Revert;
            }
            DocumentResponse = {
              status: ResponeStatus.SUCCESS,
            };
            break;
          }
          case StatusId.PendingHRReviewWorkpermitDocs: {
            {
              if (btnAction === ButtonAction.Review) {
                // workflowStatusValue =
                //   workflowStatusApi.PendingwithCandidatetosignEmployementContract;
                SuccessMsg = RecuritmentHRMsg.WorkPermitDocs;
                ActionID = WorkflowAction.Approved;
              } else if (btnAction === ButtonAction.Revert) {
                workflowStatusValue =
                  workflowStatusApi.RevertedBacktoCandidateforreuploadDocs;
                SuccessMsg = RecuritmentHRMsg.RevertWorkPermitDocs;
                ActionID = WorkflowAction.Revert;
              }
              DocumentResponse = {
                status: ResponeStatus.SUCCESS,
              };
            }
            break;
          }
          case StatusId.PendingFinancePaymentReview: {
            if (btnAction === ButtonAction.Review) {
              workflowStatusValue =
                workflowStatusApi.PendingFinancePaymentReview;
              SuccessMsg = RecuritmentHRMsg.FinancePaymentReviewMsg;
              ActionID = WorkflowAction.Approved;
            } else if (btnAction === ButtonAction.Revert) {
              // workflowStatusValue =
              //   workflowStatusApi.RevertedBacktopaymentReview;
              SuccessMsg = RecuritmentHRMsg.RevertedFinancePaymentMsg;
              ActionID = WorkflowAction.Revert;
            }
            DocumentResponse = {
              status: ResponeStatus.SUCCESS,
            };
            break;
          }
          case StatusId.PendingHREmploymentContractInit:
            {
              workflowStatusValue =
                workflowStatusApi.PendingHREmploymentContractInit;
              SuccessMsg = RecuritmentHRMsg.EmployeementInit;
              ActionID = WorkflowAction.Approved;
              DocumentResponse = {
                status: ResponeStatus.SUCCESS,
              };
            }
            break;
          case StatusId.WorkPermitAcknowledgedContractUploaded:
            {
              DocumentData = {
                ProfileID: data?.ProfileID,
                RequestID: data?.jobRequestID,
                DocumentName: DocumentFolderName.EmploymentContractForm,
                UnsignedDoc: DocumentFolderName.UnsignedDoc,
              };
              DocumentResponse =
                await OfferLetterServices.UploadCandidateDocument(
                  DocumentData,
                  data.EmployementDoc
                );
              workflowStatusValue =
                workflowStatusApi.PendingwithCandidatetosignEmployementContract;
              SuccessMsg = RecuritmentHRMsg.EmploymentContractMsg;
              ActionID = WorkflowAction.Approved;
            }
            break;
          case StatusId.PendingHREmploymentContractReview: {
            if (btnAction === ButtonAction.Review) {
              workflowStatusValue =
                workflowStatusApi.PendingwithCandidatetosignEmployementContract;
              SuccessMsg = RecuritmentHRMsg.ReviewEmploymentContractMsg;
              ActionID = WorkflowAction.Approved;
            } else if (btnAction === ButtonAction.Revert) {
              workflowStatusValue =
                workflowStatusApi.RevertedtheLabourHireEmployementContract;
              SuccessMsg = RecuritmentHRMsg.RevertECCocs;
              ActionID = WorkflowAction.Revert;
            }
            DocumentResponse = {
              status: ResponeStatus.SUCCESS,
            };
            break;
          }
          case StatusId.PendingHREmploymentContractVerification: {
            if (btnAction === ButtonAction.Review) {
              workflowStatusValue = workflowStatusApi.OnboardingInprogress;
              SuccessMsg = RecuritmentHRMsg.ReviewECMsg;
              ActionID = WorkflowAction.Approved;
            } else if (btnAction === ButtonAction.Revert) {
              workflowStatusValue =
                workflowStatusApi.RevertedBacktoCandidateforreuploadEmploymentContract;
              SuccessMsg = RecuritmentHRMsg.RevertedEmploymentContractMsg;
              ActionID = WorkflowAction.Revert;
            }
            DocumentResponse = {
              status: ResponeStatus.SUCCESS,
            };
            break;
          }
          case StatusId.PendingHRpreonboardingchecklist: {
            void SaveAsDraft();
            workflowStatusValue = workflowStatusApi.OnboardingInprogress;
            SuccessMsg = RecuritmentHRMsg.OnboardingMsg;
            ActionID = WorkflowAction.Approved;
            DocumentResponse = {
              status: ResponeStatus.SUCCESS,
            };
            break;
          }
          default:
            workflowStatusValue = "";
            SuccessMsg = "";
            break;
        }
        if (DocumentResponse.status === ResponeStatus.SUCCESS) {
          let CandidateDatas: WorkflowJson = {
            workflowStatus: workflowStatusValue,
            jobRequestId: Number(data?.jobRequestID),
            comments: data.comments,
            actionBy: RoleName.RecruitmentHR,
            HrUserId:
              props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation ||
              props.stateValue?.StatusId === StatusId.PendingHRReviewBGCheck
                ? String(props.userDetails[0]?.ID)
                : "",
            HrUserEmail:
              props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation ||
              props.stateValue?.StatusId === StatusId.PendingHRReviewBGCheck
                ? props.userDetails[0]?.EmailId
                : "",
            // OfferReleasedOn: Dateformatted,
            // OfferLatterPath: DocumentResponse.data[0]?.content,
          };
          if (
            props.stateValue?.StatusId === StatusId.PendingHROfferInitiate &&
            data.EmploymentCategory === EmployeementCategory.KCSAEmployee
          ) {
            let getOfferLetterPath = DocumentResponse.data.filter((item: any) =>
              item.name.includes("OfferLetter")
            );
            // let getConsentFormPath = DocumentResponse.data.filter((item: any) =>
            //   item.name.includes("ConsentForm")
            // );
            CandidateDatas.OfferLatterPath = getOfferLetterPath?.[0]?.content;
          } else if (
            props.stateValue?.StatusId ===
              StatusId.WorkPermitAcknowledgedContractUploaded &&
            data.RadioAction === "Yes"
          ) {
            CandidateDatas.EmpContractLatterPath =
              DocumentResponse.data[0]?.content;
          } else if (
            props.stateValue?.StatusId === StatusId.PendingHROfferReview
          ) {
            let LabourOffer = documentview.filter(
              (item) => item.Title === DisplayFolderName.LabourHireOffer
            );
            CandidateDatas.OfferLatterPath = LabourOffer[0]?.data[0]?.content;
          } else if (
            props.stateValue?.StatusId ===
            StatusId.PendingHREmploymentContractReview
          ) {
            let LabourEC = documentview.filter(
              (item) => item.Title === DisplayFolderName.LabourHireEC
            );
            CandidateDatas.EmpContractLatterPath =
              LabourEC[0]?.data[0]?.content;
          } else if (
            props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation
          ) {
            CandidateDatas.ConsentFormPath = DocumentResponse.data[0]?.content;
          }

          let WorkflowStatus: any;
          if (
            props.stateValue?.StatusId ===
            StatusId.PendingHRReviewWorkpermitDocs
          ) {
            WorkflowStatus = {
              status: ResponeStatus.SUCCESS,
            };
          } else {
            WorkflowStatus = await GetPortalJobsService.UpdateCandidateStatus(
              CandidateDatas
            );
          }

          if (WorkflowStatus.status === ResponeStatus.SUCCESS) {
            let Obj = [
              {
                ID: props.stateValue.ID,
                ActionId: ActionID,
                // ItemCreated: "Yes",
              },
            ];
            let UpdateStatus = await OfferLetterServices.UpdateStatusInSpfxlist(
              Obj
            );
            if (
              props.stateValue?.StatusId ===
              StatusId.PendingHREmploymentContractVerification
            ) {
              let datas = {
                JoiningDate: data.JoiningDate,
                NoticePeriod: data.NoticePeriod,
                ID: data.CandidateID,
              };
              await getVRRDetails.InsertRecruitmentCandidateDetails({ datas });
            }
            if (UpdateStatus.status === ResponeStatus.SUCCESS) {
              // if (
              //   props.stateValue?.StatusId ===
              //     StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm &&
              //   data.RadioAction === "Yes"
              // ) {
              //   let HardwareChiose =
              //     data.ITRequired === "No"
              //       ? []
              //       : data.ITSystem?.Hardware.map((item) => item.text);
              //   let Hardwaredata: string[] = HardwareChiose;
              //   let Hardwarevalue = {
              //     results: Hardwaredata,
              //   };
              //   // console.log(Hardwaredata, "Hardwaredata");
              //   const hasTrainingSystem =
              //     !!data.TrainingSystem &&
              //     Object.values(data.TrainingSystem).some(
              //       (v) => !!v && v !== "" && v !== 0
              //     );
              //   const hasTASystem =
              //     !!data.TASystem &&
              //     Object.values(data.TASystem).some(
              //       (v) => !!v && v !== "" && v !== 0
              //     );
              //   const hasITSystem =
              //     !!data.ITSystem &&
              //     Object.values(data.ITSystem).some(
              //       (v) => !!v && v !== "" && v !== 0
              //     );

              //   let obj: UpdateCandidateData = {
              //     InductionType: data.TrainingSystem?.Inductiontype.text,
              //     // TCSStartDate: SpiltDateOnly(data.TrainingSystem?.StartDate),
              //     // TCSEndDate: SpiltDateOnly(data.TrainingSystem?.EndDate),
              //     // TCSZone: data.TrainingSystem?.Zone.text,
              //     // TCSRegion: data.TrainingSystem?.Region.text,
              //     TCSComments: data.TrainingSystem?.Comments,
              //     PermanentBadgeStartDate: SpiltDateOnly(
              //       data.TASystem?.StartDate
              //     ),
              //     PermanentBadgeEndDate: SpiltDateOnly(data.TASystem?.EndDate),
              //     PermanentBadgeRegion: "", //data.TASystem?.Region.text,
              //     PermanentBadgeZone: "", //data.TASystem?.Zone.text,
              //     PermanentBadgeComments: data.TASystem?.Comments,
              //     ITStartDate:
              //       data.ITRequired === "No"
              //         ? null
              //         : SpiltDateOnly(data.ITSystem?.StartDate),
              //     Hardware: Hardwarevalue,
              //     ITZone: data.ITRequired === "No" ? "" : "", //data.ITSystem?.Zone,
              //     ITRegion: data.ITRequired === "No" ? "" : "", //data.ITSystem?.Region.text,
              //     ITComments:
              //       data.ITRequired === "No" ? "" : data.ITSystem?.Comments,
              //     ITStatus:
              //       data.ITRequired === "Yes" ? "Pending" : "Not Applicable",
              //     IsIntegratedPowerAutomatrTrigger:
              //       hasTrainingSystem || hasTASystem || hasITSystem
              //         ? "Yes"
              //         : "No",
              //   };
              //   await OfferLetterServices.UpdateCandidateOnboardDate(
              //     obj,
              //     data.CandidateID
              //   );
              // }

              const SuccessAlert = {
                Message: SuccessMsg,
                Type: HRMSAlertOptions.Success,
                visible: true,
                ButtonAction: async (userClickedOK: boolean) => {
                  if (userClickedOK) {
                    props.navigation("/UploadOfferDocumentList", {
                      state: {
                        ID: props.stateValue?.ID,
                        TabNames: props.stateValue?.TabName,
                        ButtonAction: ButtonAction.View,
                        JobCode: props.stateValue?.JobCode,
                        tab: props.stateValue?.tab,
                        JobCodeID: props.stateValue?.JobCodeId,
                      },
                    });
                    setAlertPopupOpen(false);
                  } else {
                    setAlertPopupOpen(false);
                  }
                },
              };

              setAlertPopupOpen(true);
              setalertProps(SuccessAlert);
              setIsLoading(false);
              // }
            } else {
              const ApiErrorMsg = {
                Message: RecuritmentHRMsg.APIErrorMsg,
                Type: HRMSAlertOptions.Error,
                visible: true,
                ButtonAction: async (userClickedOK: boolean) => {
                  if (userClickedOK) {
                    props.navigation("/UploadOfferDocumentList", {
                      state: {
                        ID: props.stateValue?.ID,
                        TabNames: props.stateValue?.TabName,
                        ButtonAction: ButtonAction.View,
                        JobCode: props.stateValue?.JobCode,
                        tab: props.stateValue?.tab,
                        JobCodeID: props.stateValue?.JobCodeId,
                      },
                    });
                    setAlertPopupOpen(false);
                  } else {
                    setAlertPopupOpen(false);
                  }
                },
              };

              setAlertPopupOpen(true);
              setalertProps(ApiErrorMsg);
              setIsLoading(false);
            }
          } else {
            const ApiErrorMsg = {
              Message: RecuritmentHRMsg.APIErrorMsg,
              Type: HRMSAlertOptions.Error,
              visible: true,
              ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                  props.navigation("/UploadOfferDocumentList", {
                    state: {
                      ID: props.stateValue?.ID,
                      TabNames: props.stateValue?.TabName,
                      ButtonAction: ButtonAction.View,
                      JobCode: props.stateValue?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeId,
                    },
                  });
                  setAlertPopupOpen(false);
                } else {
                  setAlertPopupOpen(false);
                }
              },
            };

            setAlertPopupOpen(true);
            setalertProps(ApiErrorMsg);
            setIsLoading(false);
          }
        } else {
          let FormFieldFailed = {
            Message: RecuritmentHRMsg.APIErrorMsg,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                setAlertPopupOpen(false);
              }
            },
          };
          setAlertPopupOpen(true);
          setalertProps(FormFieldFailed);
          setIsLoading(false);
        }
      } else {
        let FormFieldFailed = {
          Message: RecuritmentHRMsg.FormValidationMsg,
          Type: HRMSAlertOptions.Error,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              setAlertPopupOpen(false);
            }
          },
        };
        setAlertPopupOpen(true);
        setalertProps(FormFieldFailed);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting candidate details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsLoading(true);

    const CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          props.navigation("/UploadOfferDocumentList", {
            state: {
              ID: props.stateValue?.ID,
              TabNames: props.stateValue?.TabName,
              ButtonAction: ButtonAction.View,
              JobCode: props.stateValue?.JobCode,
              tab: props.stateValue?.tab,
              JobCodeID: props.stateValue?.JobCodeId,
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

  const back_fn = () => {
    props.navigation("/UploadOfferDocumentList", {
      state: {
        ID: props.stateValue?.ID,
        TabNames: props.stateValue?.TabName,
        ButtonAction: ButtonAction.View,
        JobCode: props.stateValue?.JobCode,
        tab: props.stateValue?.tab,
        JobCodeID: props.stateValue?.JobCodeId,
      },
    });
  };

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <BreadcrumbsComponent
            items={tabs}
            initialItem={activeTab}
            TabName={TabNameData}
            onBreadcrumbChange={handleBreadcrumbChange}
            handleCancel={handleCancel}
            JobValue={{
              JobTitle: props.stateValue.JobTitle,
              JobCode: props.stateValue.JobCode,
              Status: props.stateValue.Status,
            }}
            additionalButtons={
              props.stateValue?.ButtonAction === ButtonAction.View
                ? [
                    {
                      label: ButtonAction.Back,
                      onClick: async () => {
                        back_fn();
                      },
                    },
                  ]
                : props.stateValue?.ButtonAction === ButtonAction.Initiated &&
                  data.BGVRadioBtn === "Yes"
                ? [
                    {
                      label: ButtonAction.Initiated,
                      onClick: async () => {
                        await Submit_fn(ButtonAction.Initiated);
                      },
                    },
                  ]
                : (() => {
                    if (data.RadioAction) {
                      const action =
                        data.RadioAction === "Yes"
                          ? ButtonAction.Review
                          : ButtonAction.Revert;
                      return [
                        {
                          label: action,
                          onClick: async () => await Submit_fn(action),
                        },
                      ];
                    }
                    if (
                      props.stateValue?.ButtonAction === ButtonAction.Upload
                    ) {
                      return [
                        {
                          label: ButtonAction.Upload,
                          onClick: async () =>
                            await Submit_fn(ButtonAction.Upload),
                        },
                      ];
                    }
                    if (data.PaymentReview) {
                      const action =
                        data.PaymentReview === "Yes"
                          ? ButtonAction.Review
                          : props.stateValue?.StatusId ===
                              StatusId.PendingHRReviewBGCheck &&
                            data.RecNationality === Nationality.Nationals
                          ? ButtonAction.Reject
                          : ButtonAction.Revert;
                      return [
                        {
                          label: action,
                          onClick: async () => await Submit_fn(action),
                        },
                      ];
                    }
                    if (
                      props.stateValue?.StatusId ===
                      StatusId.PendingHREmploymentContractInit
                    ) {
                      return [
                        {
                          label: ButtonAction.Initiated,
                          onClick: async () =>
                            await Submit_fn(ButtonAction.Initiated),
                        },
                      ];
                    }
                    if (btnEnable) {
                      return [
                        {
                          label: ButtonAction.Submit,
                          onClick: async () =>
                            await Submit_fn(ButtonAction.Submit),
                        },
                      ];
                    }
                    if (btnEnable) {
                      return [
                        {
                          label: ButtonAction.Submit,
                          onClick: async () =>
                            await Submit_fn(ButtonAction.Submit),
                        },
                      ];
                    } else {
                      return [
                        {
                          label: ButtonAction.SaveAsDraft,
                          onClick: async () => await SaveAsDraft(),
                        },
                      ];
                    }
                    return [];
                  })()
            }
          />
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

      {documentPopup ? (
        <>
          <AlertDialogbox
            Style={{ width: "75vw", height: "41vw" }}
            visible={documentPopup}
            children={
              <ViewCandidateDocument
                data={documentview}
                webUrl={props.webURL}
                onClose={() => setDocumentPopup(false)}
              />
            }
            onClose={() => setDocumentPopup(false)}
            header={
              <div style={{ textAlign: "center", width: "100%" }}>
                <h2
                  style={{
                    color: ColorCode.LabelStyleColorCode.LabelStyleColor,
                    fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", 
                          -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                  }}
                >
                  {" "}
                  Candidate Documents
                </h2>
              </div>
            }
            footer={
              <div
                className="ms-Grid-row"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px 0",
                  gap: "33px",
                }}
              >
                <ReuseButton
                  label="Close"
                  onClick={() => setDocumentPopup(false)}
                  Style={{
                    backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                    color: "white",
                    width: "50%",
                  }}
                />
              </div>
            }
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default UploadCandidateDocument;
