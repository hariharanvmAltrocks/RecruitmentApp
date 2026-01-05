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
  CategoryID,
  ColorCode,
  DocumentFolderName,
  DocumentLibraray,
  HRMSAlertOptions,
  Nationality,
  NationalityCode,
  PostRecrutimentCheckboxContent,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleID,
  RoleName,
  StatusId,
  TabName,
  tabType,
  WorkflowAction,
  workflowStatusApi,
} from "../../utilities/Config";
import { alertPropsData, OnboardingChecklisttype } from "../../Models/Screens";
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
  GetDOTAfricaCF,
} from "../../Services/InitiateOfferLetter/IOfferLetterService";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import ReuseButton from "../../components/ReuseButton";
import { ViewCandidateDocument } from "../ScreenComponent/ViewCandidateDocument";
import {
  ActionName,
  Attachment,
  ButtonAction,
  CheckboxContent,
  ChecklistStatus,
  DisplayFolderName,
  DotAfricaStatus,
  EmployeementCategory,
  labelNames,
  onboardingData,
  RadioBtnLabel,
  StatusBarValue,
} from "../../utilities/LabelName";
import CustomTextArea from "../../components/CustomTextArea";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import CustomSignature from "../../components/CustomSignature";
import { Box, Typography } from "@mui/material";
import { convertToList, SpiltDateOnly } from "../../components/TabMerge";
import "./Checklist.css";
import CustomViewDocument from "../../components/CustomViewDocument";
import ToolTipButton from "../../components/Tooltip";
import TabsComponent from "../../components/TabsComponent ";
import CustomDialogbox from "../../components/CustomDialogbox";
import Labelheader from "../../components/LabelHeader";
import BGVComments, { BGVComment } from "../../components/BGVComments";

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
  PaymentDocs: boolean;
  WorkpermitDoc: boolean;
  BGVStatusProcess: boolean;
  BGVComments: boolean;
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
    WorkpermitDoc: [],
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
    PaymentDocs: [],
    DotAfricaCF: [],
    NationalityCode: "",
    EmployeeName: "",
    EmployeeDesignation: "",
    EmployeeEmail: "",
    EmployeeCN: "",
    EmployeeCompany: "",
    Gender: "",
    LabourHire: "",
    BGVStatusProcess: { key: 0, text: "" },
    BGVStatusProcessOption: [],
    BGVProofAttachment: [],
    BGVComments: "",
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
      PaymentDocs: false,
      WorkpermitDoc: false,
      BGVStatusProcess: false,
      BGVComments: false,
    });
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [WorkflowStatus, setWorkflowStatus] = React.useState<string>("");
  const [btnEnable, setBtnEnable] = React.useState<boolean>(false);
  const [documentPopup, setDocumentPopup] = React.useState<boolean>(false);
  const [checklistStatus, setChecklistStatus] = useState<any>(ChecklistStatus);
  const [BGVerifiedStatus, setBGVerifiedStatus] = useState<any>({});
  const [OBCheckListTab, setOBCheckListTab] = React.useState<string>("tab1");
  const [MainComponent, setMainComponent] = useState<boolean>(true);
  const [DotAfricaComments, setDotAfricaComments] = useState<
    BGVComment[] | undefined
  >([]);

  const fetchBGVStatus = async () => {
    setIsLoading(true);
    try {
      // let FilterValue: BGVStatus = {
      //   hrUserId: String(props.userDetails[0]?.ID),
      //   pagination: {
      //     filterValue: ,
      //     sortBy: "",
      //     sortOrder: 0,
      //     pageSize: 5,
      //     currentPage: 1,
      //     totalItems: 0,
      //   },
      // };
      await laborHireService
        .CheckBGVerification(
          props.stateValue.rowData?.CandidateDetails?.JobRequestID
        )
        .then(async (res) => {
          const mappedObj: { [key: string]: string } =
            res.data[0]?.bgVerification
              ?.filter((item: any) => item.bgType)
              ?.reduce((acc: { [key: string]: string }, item: any) => {
                acc[item.bgType] =
                  item.status?.trim().toLowerCase() ===
                    DotAfricaStatus.Completed.trim().toLowerCase() &&
                  item.result?.trim().toLowerCase() ===
                    DotAfricaStatus.Confirmed.trim().toLowerCase()
                    ? StatusBarValue.Completed
                    : item.status?.trim().toLowerCase() ===
                      DotAfricaStatus.skipped.trim().toLowerCase()
                    ? StatusBarValue.Failed
                    : StatusBarValue.Pending;
                return acc;
              }, {});
          let BGVRemarks = res.data[0]?.bgVerification
            .filter(
              (item: any) =>
                item.status?.trim().toLowerCase() ===
                DotAfricaStatus.skipped.trim().toLowerCase()
            )
            .map((item: any) => ({
              BGVType: item.bgType,
              Remarks: item.remarks,
            }));

          setDotAfricaComments(BGVRemarks);
          setBGVerifiedStatus(mappedObj);
        })
        .catch((error) => {
          console.log("Candidate details doesn't fetch the data", error);
        });
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    } finally {
      setIsLoading(false);
    }
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
        const VerificationType = await GetPortalJobsService.GetAllMaster(
          CategoryID.VerificationType
        );
        const existingData = VerificationType.data || [];
        const lastId = existingData[existingData.length - 1]?.id ?? 0;

        VerificationType.data = [
          ...existingData,
          {
            id: lastId + 1,
            value: "ConsentForm",
            displayText: "Consent Form",
            displayTextFr: "",
          },
        ];
        let VerificationCode: string[] =
          VerificationType.data?.map((item) => String(item.value)) ?? [];
        let BGVDocument: GetBGVDocument = {
          ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
          ProfileID: item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID, //"13", //item?.CandidateDetails?.ProfileID,
          DocumentType: DocumentFolderName.BackgroundVerification,
          DocumentName: VerificationCode,
          // CandidateDetails?.data?.[0]?.NatioCode ===
          // NationalityCode.SouthAfrica //"N154"
          //   ? SADocs
          //   : NSADocs,
          RequestID: item?.CandidateDetails?.JobRequestID,
          VerificationName: VerificationType.data,
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
      let DOtObj: GetDOTAfricaCF = {
        ListName: DocumentLibraray.DOTAfricaConsentForm,
        Natioality:
          item?.CandidateDetails?.NationalityCode ===
          NationalityCode.SouthAfrica
            ? "SA"
            : "NSA",
      };
      const getDotAfricaCF =
        await OfferLetterServices.FetchDotAfricaConsentForm(DOtObj);
      const ResiData = await OfferLetterServices.FetchResiDetails(
        response.data[0].ID,
        response.data[0].IsExpat
      );
      let WorkflowStatusId = CandidateDetails?.data?.[0]?.workflowStatusId;
      setWorkflowStatus(WorkflowStatusId ?? "");
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
        Gender: item?.CandidateDetails?.Gender,
        // PersonalDocs: PersonalDocs.data,
        // MedicalDocs: MedicalDocs.data,
        JoiningDate: CandidateDetails?.data?.[0]?.joiningDate ?? "",
        NoticePeriod: CandidateDetails?.data?.[0]?.noticePeriod ?? "",
        EmployeeName:
          CandidateDetails?.data?.[0]?.PreviousEmployerDetails?.name ?? "",
        EmployeeDesignation:
          CandidateDetails?.data?.[0]?.PreviousEmployerDetails?.Designation ??
          "",
        EmployeeEmail:
          CandidateDetails?.data?.[0]?.PreviousEmployerDetails?.Email ?? "",
        EmployeeCN:
          CandidateDetails?.data?.[0]?.PreviousEmployerDetails
            ?.ContractNumber ?? "",
        EmployeeCompany:
          CandidateDetails?.data?.[0]?.PreviousEmployerDetails?.CompanyName ??
          "",
        BGVRadioBtnlabel:
          props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation &&
          item.RecruitmentDetails?.Nationality === Nationality.Nationals
            ? RadioBtnLabel.BGVExpatriatesLabel
            : props.stateValue?.StatusId === StatusId.PendingHROfferInitiate &&
              item?.RecruitmentDetails?.EmploymentCategory ===
                EmployeementCategory.LaborhireContractor
            ? RadioBtnLabel.OfferInitiationLabel
            : RadioBtnLabel.BGVExpatriatesLabel,
        DotAfricaCF: getDotAfricaCF.data,
        NationalityCode: CandidateDetails?.data?.[0]?.NatioCode
          ? CandidateDetails?.data?.[0]?.NatioCode
          : "",
        LabourHire: ResiData.data?.lhCode ?? "",
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
      if (props.stateValue?.StatusId === StatusId.PendingDOTAficaVerification) {
        let BGVProcessOption = props.EmployeeList.map((item: any) => ({
          key: item.Email,
          text: `${item?.FirstName || ""} ${item?.MiddleName || ""} ${
            item?.LastName || ""
          }`,
        }));
        setData((prev) => ({
          ...prev,
          BGVStatusProcessOption: BGVProcessOption,
        }));
        await fetchBGVStatus();
      }
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
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
      ["Background Checks"]: checklistData.DocumentComplianceChecks
        .DocumentComplianceChecks.BackgroundChecks.value
        ? StatusBarValue.Completed
        : StatusBarValue.Pending,
      ["Signed Offer Letter"]: checklistData.DocumentComplianceChecks
        .DocumentComplianceChecks.SignedOfferLetter.value
        ? StatusBarValue.Completed
        : StatusBarValue.Pending,
      ["Employment Contract"]: checklistData.DocumentComplianceChecks
        .DocumentComplianceChecks.SignedEmploymentContract.value
        ? StatusBarValue.Completed
        : StatusBarValue.Pending,
      ["Work Permit Approved"]: checklistData.DocumentComplianceChecks
        .DocumentComplianceChecks.WorkPermitApproved.value
        ? StatusBarValue.Completed
        : StatusBarValue.Pending,
      ["Visa Process"]: checklistData.LogisticsEmployeeSupport
        .LogisticsEmployeeSupport.VisaProcess.value
        ? StatusBarValue.Completed
        : StatusBarValue.Pending,
      ["Accommodation Booked"]: checklistData.LogisticsEmployeeSupport
        .LogisticsEmployeeSupport.AccommodationBooked.value
        ? StatusBarValue.Completed
        : StatusBarValue.Pending,
      ["Travel Process"]: checklistData.LogisticsEmployeeSupport
        .LogisticsEmployeeSupport.TravelProcess.value
        ? StatusBarValue.Completed
        : StatusBarValue.Pending,
      ["Ready for Onboarding"]: checklistData.FinalStatus.FinalStatus
        .ReadyforOnboarding.value
        ? StatusBarValue.Completed
        : StatusBarValue.Pending,
    });
  }, [checklistData]);

  React.useEffect(() => {
    const allCompleted = Object.values(checklistStatus).every(
      (value) => value === StatusBarValue.Completed
    );
    setBtnEnable(allCompleted);
  }, [checklistStatus]);

  const categoryList = [
    {
      label: checklistData.DocumentComplianceChecks.label,
      section: "DocumentComplianceChecks",
      items: convertToList(
        checklistData.DocumentComplianceChecks.DocumentComplianceChecks
      ),
    },
    {
      label: checklistData.LogisticsEmployeeSupport.label,
      section: "LogisticsEmployeeSupport",
      items: convertToList(
        checklistData.LogisticsEmployeeSupport.LogisticsEmployeeSupport
      ),
    },
    {
      label: checklistData.FinalStatus.label,
      section: "FinalStatus",
      items: convertToList(checklistData.FinalStatus.FinalStatus),
    },
  ];

  const handleTabChange = (newTab: string) => {
    setOBCheckListTab(newTab);
  };

  // const handleAutoComplete = async (
  //   value: AutoCompleteItem | null,
  //   item: string
  // ) => {
  //   setData((prevState) => ({
  //     ...prevState,
  //     [item]: value || { key: 0, text: "" },
  //   }));
  //   setValidationErrors((prevState) => ({
  //     ...prevState,
  //     [item]: false,
  //   }));
  // };

  // const handleInputChange = async (value: string | null, item: string) => {
  //   setData((prevState) => ({
  //     ...prevState,
  //     [item]: value || { key: 0, text: "" },
  //   }));
  //   setValidationErrors((prevState) => ({
  //     ...prevState,
  //     [item]: false,
  //   }));
  // };

  const OnboardingChecklist = [
    {
      label: TabName.OnboardingChecklist,
      value: "tab1",
      content: (
        <>
          <div className="ms-Grid-row" style={{ marginTop: "3%" }}>
            {categoryList.map((cat) =>
              cat.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#F7F9FB",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* LEFT: Avatar + Name + ID */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        background: "#16355B",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </Box>

                    <Box>
                      <Typography fontWeight="600" fontSize={15}>
                        {item.label}
                      </Typography>
                      <Typography fontSize={13} color="gray">
                        ID: {item.id}
                      </Typography>
                    </Box>
                  </Box>

                  {/* RIGHT: Yes / No */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <label
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <input
                        type="radio"
                        checked={item.value === true}
                        onChange={() =>
                          handleToggle(cat.section, item.label, true, item.id)
                        }
                      />
                      Yes
                    </label>

                    <label
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <input
                        type="radio"
                        checked={item.value === false}
                        onChange={() =>
                          handleToggle(cat.section, item.label, false, item.id)
                        }
                      />
                      No
                    </label>
                  </Box>
                </Box>
              ))
            )}
          </div>

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
                onChange={(value: boolean) => handleCheckboxchanges(value)}
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
        </>
      ),
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
                  {/* <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.ApplicantSurname}
                      value={data.ApplicantSurName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div> */}
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.Nationality}
                      value={data.Nationalty}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.CandidateDetails.Gender}
                      value={data.Gender}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
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
                      label={labelNames.PositionDetails.Location}
                      value={data?.Location}
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
                {data.EmploymentCategory ===
                  EmployeementCategory.LaborhireContractor &&
                  ![
                    StatusId.PendingHRBGVInitiation,
                    StatusId.PendingHRReviewBGCheck,
                    StatusId.PendingBGdocuploadedbycandidate,
                    StatusId.PendingDOTAficaVerification,
                    StatusId.PendingwithTAforMedicalScreening,
                    StatusId.RESIProcessInitiatedforDRC,
                    StatusId.RESIProcessInitiatedforExpatriate,
                  ].includes(props.stateValue?.StatusId) && (
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <CustomInput
                          label={labelNames.PositionDetails.LabourHire}
                          value={data?.LabourHire}
                          disabled={true}
                          mandatory={false}
                        />
                      </div>
                    </div>
                  )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingHRReviewBGCheck &&
                dataValue[0]?.CandidateDetails.Agencies === "Candidate" ? (
                  <>
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 7px 4px 3px #d3d3d3",
                        borderRadius: "10px",
                        marginTop: "2%",
                      }}
                    >
                      <CardContent>
                        <div className="ms-Grid-row">
                          <Labelheader
                            value={labelNames.CandidateDetails.PreviousEmployee}
                          />
                        </div>
                        <div className="ms-Grid-row">
                          <div className="ms-Grid-col ms-lg3">
                            <CustomInput
                              label={labelNames.CandidateDetails.EmployeeName}
                              value={data?.EmployeeName}
                              disabled={true}
                              mandatory={false}
                            />
                          </div>
                          <div className="ms-Grid-col ms-lg3">
                            <CustomInput
                              label={labelNames.CandidateDetails.EmployeeDesi}
                              value={data?.EmployeeDesignation}
                              disabled={true}
                              mandatory={false}
                            />
                          </div>
                          <div className="ms-Grid-col ms-lg3">
                            <CustomInput
                              label={labelNames.CandidateDetails.EmployeeEmail}
                              value={data?.EmployeeEmail}
                              disabled={true}
                              mandatory={false}
                            />
                          </div>
                          <div className="ms-Grid-col ms-lg3">
                            <CustomInput
                              label={labelNames.CandidateDetails.EmployeeCN}
                              value={data?.EmployeeCN}
                              disabled={true}
                              mandatory={false}
                            />
                          </div>

                          <div className="ms-Grid-col ms-lg3">
                            <CustomInput
                              label={
                                labelNames.CandidateDetails.EmployeeCompanyN
                              }
                              value={data?.EmployeeCompany}
                              disabled={true}
                              mandatory={false}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <></>
                )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingHRBGVInitiation ||
                props.stateValue?.StatusId ===
                  StatusId.PendingBGdocuploadedbycandidate ||
                props.stateValue?.StatusId ===
                  StatusId.PendingHRReviewBGCheck ||
                props.stateValue?.StatusId ===
                  StatusId.PendingDOTAficaVerification ||
                props.stateValue?.StatusId ===
                  StatusId.PendingwithTAforMedicalScreening ||
                props.stateValue?.StatusId ===
                  StatusId.PendingHROfferInitiate ||
                props.stateValue?.StatusId ===
                  StatusId.PendingCandidateOfferLetterUpload ||
                props.stateValue?.StatusId ===
                  StatusId.PendingLabourHireOfferRelease ||
                props.stateValue?.StatusId === StatusId.PendingHROfferReview ||
                props.stateValue?.StatusId ===
                  StatusId.RESIProcessInitiatedforDRC ||
                props.stateValue?.StatusId ===
                  StatusId.RESIProcessInitiatedforExpatriate ? (
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
                )}

                {/* {props.stateValue?.StatusId ===
                  StatusId.PendingDOTAficaVerification && (
                  <>
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 7px 4px 3px #d3d3d3",
                        borderRadius: "10px",
                        marginTop: "2%",
                        overflow: "visible",
                      }}
                    >
                      <CardContent>
                        <>
                          <div className="ms-Grid-row">
                            <div
                              style={{
                                display: "flex",
                                marginTop: "1% ",
                                marginLeft: "1%",
                              }}
                            >
                              <div
                                style={{
                                  minWidth: 85,
                                  fontWeight: "bold",
                                  fontFamily: '"Roboto", sans-serif',
                                  fontSize: "17px",
                                }}
                              >
                                {labelNames.BGVLabels.BGVConsultedLabel}
                              </div>
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg4">
                              <CustomAutoComplete
                                label={
                                  labelNames.CandidateDetails.ConsultedWith
                                }
                                options={data.BGVStatusProcessOption}
                                value={data.BGVStatusProcess}
                                disabled={false}
                                mandatory={true}
                                onChange={(item) =>
                                  handleAutoComplete(item, "BGVStatusProcess")
                                }
                                error={validationErrors.BGVStatusProcess}
                              />
                            </div>
                            <div className="ms-Grid-col ms-lg2">
                              <div
                                className="ms-Grid-row"
                                style={{ marginLeft: "2px" }}
                              >
                                <CustomLabel
                                  value={
                                    labelNames.CandidateDetails.ProofDiscussion
                                  }
                                  // mandatory={true}
                                />
                                <AttachmentButton
                                  label="Upload"
                                  iconName="CloudUpload"
                                  iconNameHover="CloudUpload"
                                  allowMultiple={false}
                                  AttachState={(newAttachment: any) => {
                                    let attachment: IDocFiles[] =
                                      newAttachment.map((item: any) => {
                                        return {
                                          name: item.name,
                                          content: item.file,
                                          type: "New",
                                          url: item.Url,
                                        };
                                      });
                                    // const attachments = [
                                    //   ...(InterviewedLevel.COIAttachment ||
                                    //     []),
                                    //   ...attachment,
                                    // ];
                                    handleDocument(
                                      "BGVProofAttachment",
                                      attachment
                                    );
                                  }}
                                  // mandatory={true}
                                  // error={validationErrors.COIAttachment}
                                  Style={{
                                    backgroundColor:
                                      ColorCode.ButtonColorCode.ButtonColor,
                                    color: "white",
                                  }}
                                  fileformat=".doc,.pdf,.docx,.png"
                                />
                              </div>
                            </div>
                            <div
                              className="ms-Grid-col ms-lg4"
                              style={{ marginTop: "2%" }}
                            >
                              <CustomViewAttachment
                                Attachment={data.BGVProofAttachment ?? []}
                                StateValue={"BGVProofAttachment"}
                                handleDelete={(index, fileState) =>
                                  handleDelete(index, fileState)
                                }
                                webUrl={props.webURL}
                              />
                            </div>
                          </div>

                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12">
                              <CustomTextArea
                                label={labelNames.CommanLabel.Comments}
                                value={data.BGVComments}
                                error={validationErrors.BGVComments}
                                onChange={(value) =>
                                  handleInputChange("BGVComments", value)
                                }
                                disabled={false}
                                mandatory={true}
                              />
                            </div>
                          </div>
                        </>
                      </CardContent>
                    </Card>

                   
                  </>
                )} */}

                {props.stateValue?.ButtonAction === ButtonAction.Initiated ||
                props.stateValue?.StatusId ===
                  StatusId.PendingBGdocuploadedbycandidate ? (
                  <></>
                ) : (
                  <>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <div className="custom-document-column">
                          <CustomLabel
                            value={
                              Attachment.PositionDocument.CandidateDocuments
                            }
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
                      {props.stateValue?.StatusId ===
                        StatusId.PendingDOTAficaVerification &&
                        DotAfricaComments &&
                        DotAfricaComments.length > 0 && (
                          <>
                            <div className="ms-Grid-col ms-lg4">
                              <CustomLabel
                                value={Attachment.PositionDocument.BGVComments}
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
                                onClick={() => setMainComponent(false)}
                                spacing={4}
                              />
                            </div>
                          </>
                        )}
                    </div>
                  </>
                )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingHRBGVInitiation &&
                data.NationalityCode != NationalityCode.Nationals ? (
                  <>
                    <div className="ms-Grid-row">
                      <div
                        className="ms-Grid-col ms-lg2"
                        style={{ marginTop: "2%" }}
                      >
                        <CustomLabel
                          value={
                            Attachment.PositionDocument.DownloadConsentForm
                          }
                        />
                      </div>
                      <div
                        className="ms-Grid-col ms-lg6"
                        style={{ display: "flex", marginTop: "3%" }}
                      >
                        <ToolTipButton
                          ApproverData={Attachment.PositionDocument.DOTAficaCFD}
                        />
                        <CustomViewDocument
                          Attachment={data.DotAfricaCF}
                          webUrl={props.webURL}
                        />
                      </div>
                    </div>
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

                {props.stateValue.StatusId ===
                  StatusId.PendingHRReviewOfferanduploadEmployementContract && (
                  <>
                    <div className="ms-Grid-col ms-lg4">
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
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
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
                  </>
                )}

                {props.stateValue?.StatusId ===
                  StatusId.WorkPermitAcknowledgedContractUploaded && (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg3">
                      <CustomLabel
                        value={Attachment.PositionDocument.WorkpermitDocs}
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
                          handleDocument("WorkpermitDoc", attachment);
                        }}
                        mandatory={true}
                        error={validationErrors.WorkpermitDoc}
                        Style={{
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
                          color: "white",
                        }}
                        fileformat=".pdf"
                      />
                      <CustomViewAttachment
                        Attachment={data.WorkpermitDoc ?? []}
                        StateValue={"WorkpermitDoc"}
                        handleDelete={(index, fileState) =>
                          handleDelete(index, fileState)
                        }
                      />
                    </div>
                    <div className="ms-Grid-col ms-lg4">
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
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
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
                  </div>
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

                {props.stateValue?.StatusId ===
                  StatusId.PendingFinancePaymentReview &&
                data.PaymentReview === "Yes" ? (
                  <>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg3">
                        <>
                          <CustomLabel
                            value={Attachment.PositionDocument.ProofOfPayment}
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
                              //   ...(data.ConsentDocs || []),
                              //   ...attachment,
                              // ];
                              handleDocument("PaymentDocs", attachment);
                            }}
                            mandatory={true}
                            error={validationErrors.PaymentDocs}
                            Style={{
                              backgroundColor:
                                ColorCode.ButtonColorCode.ButtonColor,
                              color: "white",
                            }}
                            fileformat=".doc,.pdf,.docx"
                          />
                          <CustomViewAttachment
                            Attachment={data.PaymentDocs ?? []}
                            StateValue={"PaymentDocs"}
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

                {/* {(props.stateValue?.StatusId ===
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
                )} */}

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
                          data.NationalityCode === NationalityCode.Nationals
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
    ...(props.stateValue?.StatusId === StatusId.PendingHRpreonboardingchecklist
      ? [
          {
            label: TabName.OnboardingChecklist,
            value: "tab2",
            content: (
              <>
                <Card sx={{ marginTop: "2%" }}>
                  <CardContent>
                    <div>
                      <TabsComponent
                        tabs={OnboardingChecklist}
                        initialTab={OBCheckListTab}
                        tabtype={tabType.Dashboard}
                        onTabChange={handleTabChange}
                        tabClassName="TabStatus"
                        Statuslist={checklistStatus}
                      />
                      {/* <div
                        className="ms-Grid-row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className="ms-Grid-col ms-lg8">
                          <h2
                            style={{
                              color: ColorCode.ButtonColorCode.ButtonColor,
                              fontSize: "18px",
                            }}
                          >
                            Onboarding Checklist
                          </h2>
                        </div>

                        <div
                          className="ms-Grid-col ms-lg4"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <StatusBar checklist={checklistStatus} />
                        </div>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </>
            ),
          },
        ]
      : []),
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
      PaymentDocs: false,
      WorkpermitDoc: false,
    };
    if (
      props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation &&
      data.NationalityCode != NationalityCode.Nationals
    ) {
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
      errors.WorkpermitDoc = !IsValid(data.WorkpermitDoc);
    } else if (
      props.stateValue?.StatusId ===
      StatusId.PendingHRReviewOfferanduploadEmployementContract
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
    if (
      props.stateValue?.StatusId === StatusId.PendingFinancePaymentReview &&
      data.PaymentReview === "Yes"
    ) {
      errors.PaymentDocs = !IsValid(data.PaymentDocs);
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
  const SaveAsDraft = async (BtnAction: string) => {
    setIsLoading(true);
    try {
      const isValid = !Validation();
      if (isValid) {
        let ChecklistValue = {
          BackgroundChecks:
            checklistStatus["Background Checks"] === StatusBarValue.Completed
              ? ActionName.Completed
              : ActionName.Pending,
          SignedOfferLetterVerified:
            checklistStatus["Signed Offer Letter"] === StatusBarValue.Completed
              ? ActionName.Completed
              : ActionName.Pending,
          SignedEmploymentContract:
            checklistStatus["Employment Contract"] === StatusBarValue.Completed
              ? ActionName.Completed
              : ActionName.Pending,
          WorkPermitApproved:
            checklistStatus["Work Permit Approved"] === StatusBarValue.Completed
              ? ActionName.Completed
              : ActionName.Pending,
          VisaProcess:
            checklistStatus["Visa Process"] === StatusBarValue.Completed
              ? ActionName.Completed
              : ActionName.Pending,
          AccommodationBooked:
            checklistStatus["Accommodation Booked"] === StatusBarValue.Completed
              ? ActionName.Completed
              : ActionName.Pending,
          TravelProcess:
            checklistStatus["Travel Process"] === StatusBarValue.Completed
              ? ActionName.Completed
              : ActionName.Pending,
          ReadyforOnboarding:
            checklistStatus["Ready for Onboarding"] === StatusBarValue.Completed
              ? ActionName.Completed
              : ActionName.Pending,
          ID: data.CandidateID,
        };
        const UpdateStatusCandidateList =
          await OfferLetterServices.UpdateStatusCandidatelist(ChecklistValue);
        if (UpdateStatusCandidateList.status === ResponeStatus.SUCCESS) {
          let response: any;
          if (BtnAction === ButtonAction.Submit) {
            let Obj = [
              {
                ID: props.stateValue.ID,
                ActionId: WorkflowAction.Approved,
                ItemCreated: "Yes",
              },
            ];
            response = await OfferLetterServices.UpdateStatusInSpfxlist(Obj);
          } else {
            response = {
              status: ResponeStatus.SUCCESS,
            };
          }
          if (response.status === ResponeStatus.SUCCESS) {
            const SuccessAlert = {
              Message:
                BtnAction === ButtonAction.SaveAsDraft
                  ? RecuritmentHRMsg.ChecklistSaveAsDraftMsg
                  : RecuritmentHRMsg.OnboardingMsg,
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
            // }s
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
        let WorkPermitDocs: any;
        let workflowStatusValue: string = "";
        let SuccessMsg: string = "";
        let ActionID: number = WorkflowAction.Approved;
        switch (props.stateValue?.StatusId) {
          case StatusId.PendingHRBGVInitiation:
            {
              if (btnAction === ButtonAction.Initiated) {
                if (
                  props.stateValue?.StatusId ===
                    StatusId.PendingHRBGVInitiation &&
                  data.NationalityCode != NationalityCode.Nationals
                ) {
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
                } else {
                  DocumentResponse = {
                    status: ResponeStatus.SUCCESS,
                  };
                }

                workflowStatusValue =
                  workflowStatusApi.PendingCandidateUploadBGVDocs;
                SuccessMsg = RecuritmentHRMsg.BGverificationMsg;
                ActionID = WorkflowAction.Approved;
              }
            }
            break;
          case StatusId.PendingHRReviewBGCheck:
            {
              if (btnAction === ButtonAction.Review) {
                if (
                  WorkflowStatus === workflowStatusApi.initiatetheBGVProcess
                ) {
                  DocumentResponse = {
                    status: ResponeStatus.SUCCESS,
                  };
                } else {
                  DocumentResponse = await laborHireService.InitiateBGVProcess(
                    Number(data?.jobRequestID)
                  );
                }

                workflowStatusValue = workflowStatusApi.initiatetheBGVProcess;
                SuccessMsg =
                  props.stateValue?.StatusId ===
                    StatusId.PendingHRReviewBGCheck &&
                  data.NationalityCode === NationalityCode.Nationals
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
              DocumentData = {
                ProfileID: data?.ProfileID,
                RequestID: data?.jobRequestID,
                DocumentName: DocumentFolderName.ProofOfDocument,
                UnsignedDoc: "",
              };
              let PaymentProofDocs = [...data.PaymentDocs];
              DocumentResponse =
                await OfferLetterServices.UploadCandidateDocument(
                  DocumentData,
                  PaymentProofDocs
                );
              workflowStatusValue =
                workflowStatusApi.PendingFinancePaymentReview;
              SuccessMsg = RecuritmentHRMsg.FinancePaymentReviewMsg;
              ActionID = WorkflowAction.Approved;
            } else if (btnAction === ButtonAction.Revert) {
              // workflowStatusValue =
              //   workflowStatusApi.RevertedBacktopaymentReview;
              SuccessMsg = RecuritmentHRMsg.RevertedFinancePaymentMsg;
              ActionID = WorkflowAction.Revert;
              DocumentResponse = {
                status: ResponeStatus.SUCCESS,
              };
            }

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
              const WPData = {
                ProfileID: data?.ProfileID,
                RequestID: data?.jobRequestID,
                DocumentName: DocumentFolderName.WorkPermit,
                UnsignedDoc: "",
              };
              WorkPermitDocs =
                await OfferLetterServices.UploadCandidateDocument(
                  WPData,
                  data.WorkpermitDoc
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
              let JoiningDate = SpiltDateOnly(new Date(data.JoiningDate));
              let datas = {
                JoiningDate: JoiningDate,
                NoticePeriod: String(data.NoticePeriod),
                ID: data.CandidateID,
              };
              DocumentResponse =
                await getVRRDetails.InsertRecruitmentCandidateDetails(datas);
              break;
            } else if (btnAction === ButtonAction.Revert) {
              workflowStatusValue =
                workflowStatusApi.RevertedBacktoCandidateforreuploadEmploymentContract;
              SuccessMsg = RecuritmentHRMsg.RevertedEmploymentContractMsg;
              ActionID = WorkflowAction.Revert;
              DocumentResponse = {
                status: ResponeStatus.SUCCESS,
              };
            }
          }
          case StatusId.PendingHRReviewOfferanduploadEmployementContract:
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
            StatusId.WorkPermitAcknowledgedContractUploaded
          ) {
            CandidateDatas.EmpContractLatterPath =
              DocumentResponse.data[0]?.content;
            CandidateDatas.signedWorkPermitPath =
              WorkPermitDocs.data[0]?.content;
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
            props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation &&
            data.NationalityCode != NationalityCode.Nationals
          ) {
            CandidateDatas.ConsentFormPath = DocumentResponse.data[0]?.content;
          } else if (
            props.stateValue?.StatusId === StatusId.PendingFinancePaymentReview
          ) {
            CandidateDatas.proofOfPaymentPath =
              DocumentResponse.data[0]?.content;
          } else if (
            props.stateValue?.StatusId ===
            StatusId.PendingHREmploymentContractInit
          ) {
            let WorkPermitDocs = documentview.filter(
              (item) => item.Title === DisplayFolderName.WorkPermitDocument
            );
            CandidateDatas.signedWorkPermitPath =
              WorkPermitDocs[0]?.data[0]?.content;
          } else if (
            props.stateValue?.StatusId ===
            StatusId.PendingHRReviewOfferanduploadEmployementContract
          ) {
            CandidateDatas.EmpContractLatterPath =
              DocumentResponse.data[0]?.content;
          }

          let WorkflowStatus: any;
          if (
            props.stateValue?.StatusId ===
              StatusId.PendingHRReviewWorkpermitDocs &&
            data.RadioAction === "Yes"
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

            if (UpdateStatus.status === ResponeStatus.SUCCESS) {
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

  const Initiate_fn = () => {
    const isValid = !Validation();
    if (isValid) {
      let InitiateBGV = {
        Message:
          props.stateValue?.StatusId === StatusId.PendingHRBGVInitiation
            ? RadioBtnLabel.BGVExpatriatesLabel
            : props.stateValue?.StatusId === StatusId.PendingHROfferInitiate &&
              data?.EmploymentCategory ===
                EmployeementCategory.LaborhireContractor
            ? RadioBtnLabel.OfferInitiationLabel
            : RadioBtnLabel.BGVExpatriatesLabel,
        Type: HRMSAlertOptions.Confirmation,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            void Submit_fn(ButtonAction.Initiated);
            setAlertPopupOpen(false);
          } else {
            setAlertPopupOpen(false);
          }
        },
      };
      setAlertPopupOpen(true);
      setalertProps(InitiateBGV);
      setIsLoading(false);
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
      {MainComponent ? (
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
                Statuslist={
                  props.stateValue?.StatusId ===
                  StatusId.PendingDOTAficaVerification
                    ? BGVerifiedStatus
                    : null
                }
                Agencies={
                  (dataValue && dataValue[0]?.CandidateDetails.Agencies) ?? ""
                }
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
                    : props.stateValue?.ButtonAction === ButtonAction.Initiated
                    ? // data.BGVRadioBtn === "Yes"
                      [
                        {
                          label: ButtonAction.Initiated,
                          onClick: async () => {
                            void Initiate_fn();
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
                                data.NationalityCode ===
                                  NationalityCode.Nationals
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
                        if (
                          props.stateValue?.StatusId ===
                          StatusId.PendingHRpreonboardingchecklist
                        ) {
                          if (btnEnable) {
                            return [
                              {
                                label: ButtonAction.Submit,
                                onClick: async () =>
                                  await SaveAsDraft(ButtonAction.Submit),
                              },
                            ];
                          } else {
                            return [
                              {
                                label: ButtonAction.SaveAsDraft,
                                onClick: async () =>
                                  await SaveAsDraft(ButtonAction.SaveAsDraft),
                              },
                            ];
                          }
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
                        return [];
                      })()
                }
              />
            </div>
          </CustomLoader>
        </>
      ) : (
        <>
          <BGVComments
            onClose={() => {
              setMainComponent(true);
              setactiveTab(activeTab);
            }}
            Comments={DotAfricaComments}
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

      {documentPopup ? (
        <>
          <CustomDialogbox
            // className="document-viewer"
            Style={{
              width: "50vw",
              height: "auto",
              padding: "0px",
              overflowX: "hidden",
            }}
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
                  {labelNames.CandidateDocument}
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
