import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomTextArea from "../../components/CustomTextArea";
import CustomInput from "../../components/CustomInput";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import {
  ButtonAction,
  ColorCode,
  DocumentFolderName,
  DocumentLibraray,
  HardwareoptValue,
  HRMSAlertOptions,
  Inductiontype,
  ITSystemReq,
  labelName,
  ListNames,
  PostRecrutimentCheckboxContent,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleName,
  StatusId,
  TabName,
  WorkflowAction,
  workflowStatusApi,
} from "../../utilities/Config";
import LabelHeaderComponents from "../../components/TitleHeader";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import { UploadDocument, WorkflowJson } from "../../Models/ApIInterface";
import CustomSignature from "../../components/CustomSignature";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomLabel from "../../components/CustomLabel";
import AttachmentButton from "../../components/AttachmentButton";
import { IDocFiles } from "../../Services/SPService/ISPServicesProps";
import CustomViewAttachment from "../../components/CustomViewAttachment";
import IsValid from "../../components/Validation";
import {
  CommonServices,
  GetPortalJobsService,
  OfferLetterServices,
} from "../../Services/ServiceExport";
import {
  DocumentName,
  GetCandidateDocument,
  UpdateCandidateData,
} from "../../Services/InitiateOfferLetter/IOfferLetterService";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import { Link, Tooltip } from "@mui/material";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import CustomDatePicker from "../../components/CustomDatePicker";
import ReuseButton from "../../components/ReuseButton";

type ValidationError = {
  OfferLetterDoc: boolean;
  EmployementDoc: boolean;
  MedicalDocs: boolean;
  RadioAction: boolean;
  comments: boolean;
  checkbox: boolean;
};

type viewDocument = {
  ReviewOfferDoc: IDocFiles[];
  ReviewEmployDocs: IDocFiles[];
  ViewFolderPath: string;
};

type optionValue = {
  InductionTypeOption: AutoCompleteItem[];
  RegionOption: AutoCompleteItem[];
  ZoneOption: AutoCompleteItem[];
  HarewareOption: AutoCompleteItem[];
};

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

    TrainingSystem: {
      Inductiontype: { key: 0, text: "" },
      StartDate: undefined,
      EndDate: undefined,
      Region: { key: 0, text: "" },
      Zone: { key: 0, text: "" },
      Comments: "",
    },
    TASystem: {
      StartDate: undefined,
      EndDate: undefined,
      Region: { key: 0, text: "" },
      Zone: { key: 0, text: "" },
      Comments: "",
    },
    ITSystem: {
      StartDate: undefined,
      Hardware: [],
      Region: { key: 0, text: "" },
      Zone: { key: 0, text: "" },
      Comments: "",
      ITStatus: "",
    },
  });
  const [viewDocument, setViewDocument] = React.useState<viewDocument>({
    ReviewOfferDoc: [],
    ReviewEmployDocs: [],
    ViewFolderPath: "",
  });
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [validationErrors, setValidationErrors] =
    React.useState<ValidationError>({
      OfferLetterDoc: false,
      EmployementDoc: false,
      MedicalDocs: false,
      RadioAction: false,
      comments: false,
      checkbox: false,
    });
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [optionValue, setOptionValue] = React.useState<optionValue>({
    InductionTypeOption: [],
    RegionOption: [],
    ZoneOption: [],
    HarewareOption: [],
  });
  const [requiredBtn, setRequiredBtn] = React.useState<string>(
    ITSystemReq.Required
  );

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
      console.log(response.data, "ResiProcess Data");
      let item = response.data[0];
      let OfferDocument: GetCandidateDocument = {
        ListName: DocumentLibraray.HRMSCandidateDocs,
        RequestID: item?.CandidateDetails?.JobRequestID,
        DocumentType: DocumentFolderName?.Offerletter,
        DocumentName: DocumentFolderName?.Offerletter,
        UnsignedDoc: DocumentFolderName?.UnsignedDoc,
      };
      let OfferLetter = await OfferLetterServices.FetchCandidateDocument(
        OfferDocument
      );
      let EmployementContractDocument: GetCandidateDocument = {
        ListName: DocumentLibraray.HRMSCandidateDocs,
        RequestID: item?.CandidateDetails?.JobRequestID,
        DocumentType: DocumentFolderName?.EmploymentContractForm,
        DocumentName: DocumentFolderName?.EmploymentContractForm,
        UnsignedDoc: DocumentFolderName?.UnsignedDoc,
      };
      let EmployementContract =
        await OfferLetterServices.FetchCandidateDocument(
          EmployementContractDocument
        );
      console.log(OfferLetter.data, "OfferLetter");
      let PersonalDocument: GetCandidateDocument = {
        ListName: DocumentLibraray.HRMSCandidateDocs,
        RequestID: "1089", //item?.CandidateDetails?.JobRequestID,
        DocumentType: DocumentFolderName?.PersonalDocs,
        DocumentName: DocumentFolderName?.PersonalDocs,
        UnsignedDoc: DocumentFolderName?.UnsignedDoc,
      };
      let PersonalDocs = await OfferLetterServices.FetchCandidateDocument(
        PersonalDocument
      );
      let MedicalDocument: GetCandidateDocument = {
        ListName: DocumentLibraray.HRMSCandidateDocs,
        RequestID: "1089", //item?.CandidateDetails?.JobRequestID,
        DocumentType: DocumentFolderName?.Medical,
        DocumentName: DocumentFolderName?.Medical,
        UnsignedDoc: DocumentFolderName?.UnsignedDoc,
      };
      let MedicalDocs = await OfferLetterServices.FetchCandidateDocument(
        MedicalDocument
      );

      setData((prev) => ({
        ...prev,
        CandidateID: item?.CandidateDetails.CandidateID,
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
        AreaOfWork: item?.RecruitmentDetails?.AreaofWork,
        Location: item?.CandidateDetails?.Location,
        jobRequestID: item?.CandidateDetails?.JobRequestID,
        Email: item?.CandidateDetails?.Email,
        IdentityNumber: item?.CandidateDetails?.IdentityNumber,
        ProofOfIdentity: item?.CandidateDetails?.ProofOfIdentity,
        PersonalDocs: PersonalDocs.data,
        MedicalDocs: MedicalDocs.data,
      }));
      setViewDocument((prev) => ({
        ...prev,
        ReviewOfferDoc: OfferLetter.data,
        ReviewEmployDocs: EmployementContract.data,
        ViewFolderPath: item?.CandidateDetails?.DocumentFolderPath,
      }));
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
        }));
        setRequiredBtn(
          item?.CandidateDetails?.ITSystem.ITStatus === "Not Applicable"
            ? ITSystemReq.NotRequired
            : item?.CandidateDetails?.ITSystem.ITStatus === "Pending"
            ? ITSystemReq.Required
            : ITSystemReq.Required
        );
      }
    } catch (error) {
      console.error("Failed to fetch Vacancy Details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const getMasterValue = await CommonServices.GetMasterData(
        ListNames.HRMSRegion
      );
      if (getMasterValue.status === ResponeStatus.SUCCESS) {
        const RegionOpt: AutoCompleteItem[] = (getMasterValue.data ?? []).map(
          (opt: any) => ({
            key: opt.ID,
            text: opt.Region,
          })
        );

        setOptionValue((prevState) => ({
          ...prevState,
          InductionTypeOption: Inductiontype,
          RegionOption: RegionOpt,
          HarewareOption: HardwareoptValue,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch master data:", error);
    }
  };

  React.useEffect(() => {
    void fetchData();

    const newTabNames = [
      { tabName: props.stateValue?.TabName },
      { tabName: props.stateValue?.ButtonAction },
      { tabName: TabName.ViewCandidateList },
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
    switch (props.stateValue?.StatusId) {
      case StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter:
        CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterDRC;
        break;
      case StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter:
        CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterExpat;
        break;
      case StatusId.PendingwithCandidatetoSignOfferLetter:
        CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterExpat;
        break;
      case StatusId.PendingwithCandidatetoUploadOtherDocuments:
        CheckboxLabel = PostRecrutimentCheckboxContent.OfferLetterExpat;
        break;
    }
    setData((prev) => ({
      ...prev,
      SignDate: CurrentDate,
      CheckboxContent: CheckboxLabel,
    }));
    if (
      props.stateValue?.StatusId ===
      StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm
    ) {
      void fetchMasterData();
    }
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

  const handleAutoComplete = async (
    tab: keyof UploadDocument,
    key: string,
    item: AutoCompleteItem | null
  ) => {
    if (item) {
      setData((prevState) => ({
        ...prevState,
        [tab]: {
          ...prevState[tab],
          [key]: item,
        },
      }));
      // setValidationError((prevState: any) => ({
      //   ...prevState,
      //   [key]: false,
      // }));
    }
    if (key === "Region") {
      let filterConditions: any[] = [];
      let Conditions = "and";
      filterConditions.push({
        FilterKey: "Region",
        Operator: "eq",
        FilterValue: item?.key,
      });
      const zoneOptions = await OfferLetterServices.FilterZoneInRegion(
        filterConditions,
        Conditions
      );
      if (zoneOptions.status === ResponeStatus.SUCCESS) {
        const ZoneOpt: AutoCompleteItem[] = (zoneOptions.data ?? []).map(
          (opt: any) => ({
            key: opt.ID,
            text: opt.Zone,
          })
        );
        setOptionValue((prevState) => ({
          ...prevState,
          ZoneOption: ZoneOpt,
        }));
        setData((prevState) => ({
          ...prevState,
          [tab]: {
            ...prevState[tab],
            Zone: { key: 0, text: "" },
          },
        }));
      }
    }
  };

  const handleDateChange = async (
    tab: keyof UploadDocument,
    key: string,
    item: Date | undefined
  ) => {
    if (item) {
      const now = new Date();
      const updatedDate = new Date(item);

      updatedDate.setHours(now.getHours());
      updatedDate.setMinutes(now.getMinutes());
      updatedDate.setSeconds(now.getSeconds());
      updatedDate.setMilliseconds(now.getMilliseconds());

      setData((prevState) => ({
        ...prevState,
        [tab]: {
          ...prevState[tab],
          [key]: updatedDate,
        },
      }));

      if (key === "StartDate") {
        setData((prevState) => ({
          ...prevState,
          [tab]: {
            ...prevState[tab],
            EndDate:
              updatedDate < data[tab]?.EndDate ? data[tab]?.EndDate : undefined,
          },
        }));
      }
      if (key === "EndDate") {
        setData((prevState) => ({
          ...prevState,
          [tab]: {
            ...prevState[tab],
            EndDate:
              updatedDate > data[tab]?.StartDate ? updatedDate : undefined,
          },
        }));
      }
      // setValidationError((prevState: any) => ({
      //   ...prevState,
      //   [key]: false,
      // }));
    }
  };

  const handleMulitiSelect = async (
    tab: keyof UploadDocument,
    key: string,
    item: AutoCompleteItem[] | null
  ) => {
    if (item) {
      setData((prevState) => ({
        ...prevState,
        [tab]: {
          ...prevState[tab],
          [key]: item,
        },
      }));
    }
  };

  function handleFileDownload(documentUrl: string) {
    const viewUrl = documentUrl.includes("?")
      ? `${documentUrl}&web=1`
      : `${documentUrl}?web=1`;

    window.open(viewUrl, "_blank");
  }

  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
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
              <div>
                <div className="ms-Grid-row">
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
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="PositionID"
                      value={data?.positionID}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Applicant Name"
                      value={data.ApplicantName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Applicant Surname"
                      value={data.ApplicantSurName}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Nationality"
                      value={data.Nationalty}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="BusinessUnitCode"
                      value={data.BusinessUnitCode}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Department"
                      value={data?.Department}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="SubDepartment"
                      value={data?.SubDepartment}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Section"
                      value={data?.Section}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Department Code"
                      value={data?.DepartmentCode}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Employment Category"
                      value={data?.EmploymentCategory}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Type Of Contract"
                      value={data?.TypeOfCOntract}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Area Of Work"
                      value={data?.AreaOfWork}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Location"
                      value={data?.Location}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Email"
                      value={data?.Email}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Proof Of Identity"
                      value={data?.ProofOfIdentity}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label="Identity Number"
                      value={data?.IdentityNumber}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                {/* {data.MedicalDocs.length > 0 && (
                  <div className="ms-Grid-row" style={{ marginLeft: "2px" }}>
                    <div className="custom-document-column">
                      <CustomLabel value={"Medical Document"} />
                      <div
                        className="document-wrapper"
                        title={
                          Array.isArray(data.MedicalDocs)
                            ? data.MedicalDocs.join(", ")
                            : data.MedicalDocs
                        }
                      >
                        <CustomViewDocument Attachment={data.MedicalDocs} />
                      </div>
                    </div>
                  </div>
                )} */}
                {props.stateValue?.StatusId !=
                  StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter && (
                  <div className="ms-Grid-row" style={{ marginLeft: "2px" }}>
                    <div className="custom-document-column">
                      <CustomLabel value={"Candidate Documents"} />
                      <div className="document-wrapper">
                        <Tooltip title={"Documents"} arrow>
                          <Link
                            // href={}
                            onClick={(e) => {
                              e.preventDefault();
                              handleFileDownload(viewDocument.ViewFolderPath);
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "blue",
                              fontWeight: "bold",
                              display: "inline-block",
                              maxWidth: "100%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {"Documents"}
                          </Link>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter ||
                props.stateValue?.StatusId ===
                  StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter ? (
                  <div className="ms-Grid-row" style={{ marginLeft: "2px" }}>
                    <CustomLabel
                      value={labelName.OfferLetter}
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
                          ...(data.OfferLetterDoc || []),
                          ...attachment,
                        ];
                        handleDocument("OfferLetterDoc", attachments);
                      }}
                      mandatory={true}
                      error={validationErrors.OfferLetterDoc}
                      Style={{
                        backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                        color: "white",
                      }}
                      fileformat=".doc,.pdf,.docx"
                    />
                    <CustomViewAttachment
                      Attachment={data.OfferLetterDoc ?? []}
                      StateValue={"OfferLetterDoc"}
                      handleDelete={(index, fileState) =>
                        handleDelete(index, fileState)
                      }
                    />
                  </div>
                ) : (
                  <></>
                )}

                {/* {props.stateValue?.StatusId ===
                  StatusId.PendingwithRecruitmentHRtoReviewtheCandidatePersonalDocs && (
                  <div className="ms-Grid-row" style={{ marginLeft: "2px" }}>
                    <LabelHeaderComponents value={"Candidate Documents"} />
                    {data.PersonalDocs.map((item, idx) => (
                      <div className="ms-Grid-col ms-lg3">
                        <div className="custom-document-column">
                          <CustomLabel value={item.category} />{" "}
                          <div className="document-wrapper">
                            <CustomViewDocument Attachment={item.documents} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )} */}

                {props.stateValue?.StatusId ===
                  StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract &&
                  data.RadioAction === "Yes" && (
                    <div className="ms-Grid-row" style={{ marginLeft: "2px" }}>
                      <CustomLabel
                        value={labelName.EmployementDoc}
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
                            ...(data.EmployementDoc || []),
                            ...attachment,
                          ];
                          handleDocument("EmployementDoc", attachments);
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
                  )}

                {props.stateValue?.StatusId ===
                  StatusId.PendingwithRecruitmentHRtoReviewtheSignedOfferLetterandInitiateforOtherDocuments ||
                props.stateValue?.StatusId ===
                  StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract ||
                props.stateValue?.StatusId ===
                  StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm ? (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg5">
                      <CustomRadioGroup
                        label={"Is the document verified?"}
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

                {(props.stateValue?.StatusId ===
                  StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm &&
                  data.RadioAction === "Yes") ||
                props.stateValue?.StatusId ===
                  StatusId.OnboardingProcessinitiatedforDRC ||
                props.stateValue?.StatusId ===
                  StatusId.OnboardingProcessinitiatedforExpat ? (
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
                        <div>
                          <div
                            className="ms-Grid-row"
                            style={{ marginLeft: "0%" }}
                          >
                            <LabelHeaderComponents
                              value={labelName.TrainingCenterSystem}
                            />
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg3">
                              <CustomAutoComplete
                                label={"Induction Type"}
                                options={optionValue.InductionTypeOption}
                                value={data.TrainingSystem?.Inductiontype}
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                                mandatory={false}
                                onChange={(item) =>
                                  handleAutoComplete(
                                    "TrainingSystem",
                                    "Inductiontype",
                                    item
                                  )
                                }
                                error={false}
                              />
                            </div>
                            <div className="ms-Grid-col ms-lg3">
                              <CustomDatePicker
                                label="Start Date"
                                selectedDate={data.TrainingSystem?.StartDate}
                                error={false}
                                minDate={todaydate}
                                mandatory={false}
                                onChange={(date) =>
                                  handleDateChange(
                                    "TrainingSystem",
                                    "StartDate",
                                    date ?? undefined
                                  )
                                }
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                              />
                            </div>
                            <div className="ms-Grid-col ms-lg3">
                              <CustomDatePicker
                                label="End Date"
                                selectedDate={data.TrainingSystem?.EndDate}
                                error={false}
                                minDate={todaydate}
                                mandatory={false}
                                onChange={(date) =>
                                  handleDateChange(
                                    "TrainingSystem",
                                    "EndDate",
                                    date ?? undefined
                                  )
                                }
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                              />
                            </div>
                            <div className="ms-Grid-col ms-lg3">
                              <CustomAutoComplete
                                label={"Region"}
                                options={optionValue.RegionOption}
                                value={data.TrainingSystem?.Region}
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                                mandatory={false}
                                onChange={(item) =>
                                  handleAutoComplete(
                                    "TrainingSystem",
                                    "Region",
                                    item
                                  )
                                }
                                error={false}
                              />
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg3">
                              <CustomAutoComplete
                                label={"Zone"}
                                options={optionValue.ZoneOption}
                                value={data.TrainingSystem?.Zone}
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                                mandatory={false}
                                onChange={(item) =>
                                  handleAutoComplete(
                                    "TrainingSystem",
                                    "Zone",
                                    item
                                  )
                                }
                                error={false}
                              />
                            </div>
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12">
                              <CustomTextArea
                                label="Comments"
                                value={data.TrainingSystem.Comments}
                                error={false}
                                onChange={(value) =>
                                  handleInputChangeTextArea(
                                    "Comments",
                                    "TrainingSystem",
                                    value
                                  )
                                }
                                mandatory={false}
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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
                          <div
                            className="ms-Grid-row"
                            style={{ marginLeft: "0%" }}
                          >
                            <LabelHeaderComponents value={labelName.TASystem} />
                          </div>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg3">
                              <CustomDatePicker
                                label="Start Date"
                                selectedDate={data.TASystem?.StartDate}
                                error={false}
                                minDate={todaydate}
                                mandatory={false}
                                onChange={(date) =>
                                  handleDateChange(
                                    "TASystem",
                                    "StartDate",
                                    date ?? undefined
                                  )
                                }
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                              />
                            </div>
                            <div className="ms-Grid-col ms-lg3">
                              <CustomDatePicker
                                label="End Date"
                                selectedDate={data.TASystem?.EndDate}
                                error={false}
                                minDate={todaydate}
                                mandatory={false}
                                onChange={(date) =>
                                  handleDateChange(
                                    "TASystem",
                                    "EndDate",
                                    date ?? undefined
                                  )
                                }
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                              />
                            </div>
                            <div className="ms-Grid-col ms-lg3">
                              <CustomAutoComplete
                                label={"Region"}
                                options={optionValue.RegionOption}
                                value={data.TASystem?.Region}
                                mandatory={false}
                                onChange={(item) =>
                                  handleAutoComplete("TASystem", "Region", item)
                                }
                                error={false}
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                              />
                            </div>
                            <div className="ms-Grid-col ms-lg3">
                              <CustomAutoComplete
                                label={"Zone"}
                                options={optionValue.ZoneOption}
                                value={data.TASystem?.Zone}
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                                mandatory={false}
                                onChange={(item) =>
                                  handleAutoComplete("TASystem", "Zone", item)
                                }
                                error={false}
                              />
                            </div>
                          </div>

                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg12">
                              <CustomTextArea
                                label="Comments"
                                value={data.TASystem.Comments}
                                error={false}
                                onChange={(value) =>
                                  handleInputChangeTextArea(
                                    "Comments",
                                    "TASystem",
                                    value
                                  )
                                }
                                mandatory={false}
                                disabled={
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforDRC ||
                                  props.stateValue?.StatusId ===
                                    StatusId.OnboardingProcessinitiatedforExpat
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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
                          <div
                            className="ms-Grid-row"
                            style={{ marginLeft: "0%" }}
                          >
                            <div className="ms-Grid-col ms-lg6">
                              <LabelHeaderComponents
                                value={labelName.ITSystem}
                              />
                            </div>
                            <div className="ms-Grid-col ms-lg6">
                              <div
                                className="ms-Grid-row"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: "7%",
                                }}
                              >
                                <div className="ms-Grid-col ms-lg3">
                                  <ReuseButton
                                    label={ITSystemReq.Required}
                                    onClick={() => {
                                      setRequiredBtn(ITSystemReq.Required);
                                    }}
                                    spacing={4}
                                    height="42px"
                                    width="120px"
                                    Style={{
                                      minWidth: "150px",
                                      height: "42px",
                                      color:
                                        requiredBtn === ITSystemReq.Required
                                          ? "white"
                                          : "#0e0f0f",
                                      background:
                                        requiredBtn === ITSystemReq.Required
                                          ? "#1976d2"
                                          : "#d2c6c6",
                                      fontWeight:
                                        requiredBtn === ITSystemReq.Required
                                          ? "bold"
                                          : "800",
                                    }}
                                    disabled={
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforDRC ||
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforExpat
                                    }
                                  />
                                </div>

                                <div className="ms-Grid-col ms-lg3">
                                  <ReuseButton
                                    label={ITSystemReq.NotRequired}
                                    onClick={() => {
                                      setRequiredBtn(ITSystemReq.NotRequired);
                                    }}
                                    spacing={4}
                                    height="42px"
                                    width="120px"
                                    Style={{
                                      minWidth: "150px",
                                      height: "42px",
                                      color:
                                        requiredBtn === ITSystemReq.NotRequired
                                          ? "white"
                                          : "#0e0f0f",
                                      background:
                                        requiredBtn === ITSystemReq.NotRequired
                                          ? "#1976d2"
                                          : "#d2c6c6",
                                      fontWeight:
                                        requiredBtn === ITSystemReq.NotRequired
                                          ? "bold"
                                          : "800",
                                    }}
                                    disabled={
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforDRC ||
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforExpat
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {requiredBtn === ITSystemReq.NotRequired ? (
                            <></>
                          ) : (
                            <>
                              <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg3">
                                  <CustomDatePicker
                                    label="Start Date"
                                    selectedDate={data.ITSystem?.StartDate}
                                    error={false}
                                    minDate={todaydate}
                                    mandatory={false}
                                    onChange={(date) =>
                                      handleDateChange(
                                        "ITSystem",
                                        "StartDate",
                                        date ?? undefined
                                      )
                                    }
                                    disabled={
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforDRC ||
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforExpat
                                    }
                                  />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                  <CustomMultiSelect
                                    label="Hardware"
                                    value={data.ITSystem?.Hardware}
                                    options={optionValue.HarewareOption}
                                    onChange={(value) =>
                                      handleMulitiSelect(
                                        "ITSystem",
                                        "Hardware",
                                        value
                                      )
                                    }
                                    disabled={
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforDRC ||
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforExpat
                                    }
                                    mandatory={false}
                                    error={false}
                                  />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                  <CustomAutoComplete
                                    label={"Region"}
                                    options={optionValue.RegionOption}
                                    value={data.ITSystem?.Region}
                                    disabled={
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforDRC ||
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforExpat
                                    }
                                    mandatory={false}
                                    onChange={(item) =>
                                      handleAutoComplete(
                                        "ITSystem",
                                        "Region",
                                        item
                                      )
                                    }
                                    error={false}
                                  />
                                </div>
                                <div className="ms-Grid-col ms-lg3">
                                  <CustomAutoComplete
                                    label={"Zone"}
                                    options={optionValue.ZoneOption}
                                    value={data.ITSystem?.Zone}
                                    disabled={
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforDRC ||
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforExpat
                                    }
                                    mandatory={false}
                                    onChange={(item) =>
                                      handleAutoComplete(
                                        "ITSystem",
                                        "Zone",
                                        item
                                      )
                                    }
                                    error={false}
                                  />
                                </div>
                              </div>

                              <div className="ms-Grid-row">
                                <div className="ms-Grid-col ms-lg12">
                                  <CustomTextArea
                                    label="Comments"
                                    value={data.ITSystem.Comments}
                                    error={false}
                                    onChange={(value) =>
                                      handleInputChangeTextArea(
                                        "Comments",
                                        "ITSystem",
                                        value
                                      )
                                    }
                                    mandatory={false}
                                    disabled={
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforDRC ||
                                      props.stateValue?.StatusId ===
                                        StatusId.OnboardingProcessinitiatedforExpat
                                    }
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <></>
                )}

                {props.stateValue?.ButtonAction === ButtonAction.View ? (
                  <></>
                ) : (
                  <>
                    <div className="ms-Grid-row">
                      <div
                        className="ms-Grid-col ms-lg12"
                        style={{ marginBottom: "7px" }}
                      >
                        <CustomTextArea
                          label="Justification"
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
                          label="I confirm that I have carefully reviewed the contents and will take necessary action based on my expertise."
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
  ];

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  const Validation = (): boolean => {
    let errors = {
      OfferLetterDoc: false,
      EmployementDoc: false,
      comments: false,
      checkbox: false,
      RadioAction: false,
    };
    if (
      props.stateValue?.StatusId ===
        StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter ||
      props.stateValue?.StatusId ===
        StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter
    ) {
      errors.OfferLetterDoc = !IsValid(data.OfferLetterDoc);
    } else if (
      props.stateValue?.StatusId ===
        StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract &&
      data.RadioAction === "Yes"
    ) {
      errors.EmployementDoc = !IsValid(data.EmployementDoc);
    } else if (
      props.stateValue?.StatusId ===
        StatusId.PendingwithRecruitmentHRtoReviewtheSignedOfferLetterandInitiateforOtherDocuments ||
      props.stateValue?.StatusId ===
        StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract ||
      props.stateValue?.StatusId ===
        StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm
    ) {
      errors.RadioAction = !IsValid(data.RadioAction);
    }

    errors.comments = !IsValid(data.comments);
    errors.checkbox = !IsValid(data.Checkbox);

    setValidationErrors((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  const Submit_fn = async (btnAction: string) => {
    setIsLoading(true);
    try {
      const isValid = !Validation();
      if (!isValid) {
        return;
      }
      let DocumentData: DocumentName;
      let DocumentResponse: any;
      let workflowStatusValue: string = "";
      let SuccessMsg: string = "";
      let ActionID: number = WorkflowAction.Approved;
      switch (props.stateValue?.StatusId) {
        case StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter:
        case StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter:
          {
            DocumentData = {
              RequestID: data?.jobRequestID,
              DocumentName: DocumentFolderName.Offerletter,
              UnsignedDoc: DocumentFolderName.UnsignedDoc,
            };
            DocumentResponse =
              await OfferLetterServices.UploadCandidateDocument(
                DocumentData,
                data.OfferLetterDoc
              );

            workflowStatusValue =
              workflowStatusApi.Pendingwithcandidatetosignofferletter;
            SuccessMsg = RecuritmentHRMsg.OfferLetterMsg;
            ActionID = WorkflowAction.Approved;
          }
          break;
        case StatusId.PendingwithRecruitmentHRtoReviewtheSignedOfferLetterandInitiateforOtherDocuments:
          {
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
          }
          break;
        case StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract:
          {
            if (btnAction === ButtonAction.Review) {
              DocumentData = {
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
              SuccessMsg = RecuritmentHRMsg.ReviewOtherDocsMsg;
              ActionID = WorkflowAction.Approved;
            } else if (btnAction === ButtonAction.Revert) {
              workflowStatusValue =
                workflowStatusApi.RevertedBacktoCandidateforreuploadDocs;
              SuccessMsg = RecuritmentHRMsg.RevertOtherDocsMsg;
              ActionID = WorkflowAction.Revert;
              DocumentResponse = {
                status: ResponeStatus.SUCCESS,
              };
            }
          }
          break;
        case StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm:
          {
            if (btnAction === ButtonAction.Review) {
              workflowStatusValue =
                workflowStatusApi.UploadedthesignedEmployementcontractform;
              SuccessMsg = RecuritmentHRMsg.ReviewEmploymentContractMsg;
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
          }
          break;
        default:
          workflowStatusValue = "";
          SuccessMsg = "";
      }
      if (DocumentResponse.status === ResponeStatus.SUCCESS) {
        let CandidateDatas: WorkflowJson = {
          workflowStatus: workflowStatusValue,
          jobRequestId: Number(data?.jobRequestID),
          comments: data.comments,
          actionBy: RoleName.RecruitmentHR,
          // OfferReleasedOn: Dateformatted,
          // OfferLatterPath: DocumentResponse.data[0]?.content,
        };
        if (
          props.stateValue?.StatusId ===
            StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter ||
          props.stateValue?.StatusId ===
            StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter
        ) {
          CandidateDatas.OfferLatterPath = DocumentResponse.data[0]?.content;
        } else if (
          props.stateValue?.StatusId ===
            StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract &&
          data.RadioAction === "Yes"
        ) {
          CandidateDatas.EmpContractLatterPath =
            DocumentResponse.data[0]?.content;
        }

        const WorkflowStatus = await GetPortalJobsService.UpdateCandidateStatus(
          CandidateDatas
        );

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
            if (
              props.stateValue?.StatusId ===
                StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm &&
              data.RadioAction === "Yes"
            ) {
              let HardwareChiose = data.ITSystem?.Hardware.map(
                (item) => item.text
              );
              let Hardwaredata: string[] = HardwareChiose;
              let Hardwarevalue = {
                results: Hardwaredata,
              };
              console.log(Hardwaredata, "Hardwaredata");
              const hasTrainingSystem =
                !!data.TrainingSystem &&
                Object.values(data.TrainingSystem).some(
                  (v) => !!v && v !== "" && v !== 0
                );
              const hasTASystem =
                !!data.TASystem &&
                Object.values(data.TASystem).some(
                  (v) => !!v && v !== "" && v !== 0
                );
              const hasITSystem =
                !!data.ITSystem &&
                Object.values(data.ITSystem).some(
                  (v) => !!v && v !== "" && v !== 0
                );

              let obj: UpdateCandidateData = {
                InductionType: data.TrainingSystem?.Inductiontype.text,
                TCSStartDate: data.TrainingSystem?.StartDate,
                TCSEndDate: data.TrainingSystem?.EndDate,
                TCSZone: data.TrainingSystem?.Zone.text,
                TCSRegion: data.TrainingSystem?.Region.text,
                TCSComments: data.TrainingSystem?.Comments,
                PermanentBadgeStartDate: data.TASystem?.StartDate,
                PermanentBadgeEndDate: data.TASystem?.EndDate,
                PermanentBadgeRegion: data.TASystem?.Region.text,
                PermanentBadgeZone: data.TASystem?.Zone.text,
                PermanentBadgeComments: data.TASystem?.Comments,
                ITStartDate: data.ITSystem?.StartDate,
                Hardware: Hardwarevalue,
                ITZone: data.ITSystem?.Zone.text,
                ITRegion: data.ITSystem?.Region.text,
                ITComments: data.ITSystem?.Comments,
                ITStatus:
                  requiredBtn === ITSystemReq.NotRequired
                    ? "Not Applicable"
                    : "Pending",
                IsIntegratedPowerAutomatrTrigger:
                  hasTrainingSystem || hasTASystem || hasITSystem
                    ? "Yes"
                    : "No",
              };
              await OfferLetterServices.UpdateCandidateOnboardDate(
                obj,
                data.CandidateID
              );
            }

            const SuccessAlert = {
              Message: SuccessMsg,
              Type: HRMSAlertOptions.Success,
              visible: true,
              ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                  props.navigation("/UploadOfferDocumentList", {
                    state: {
                      ID: props.stateValue?.RecruitmentID,
                      TabNames: props.stateValue?.initialTab,
                      ButtonAction: ButtonAction.View,
                      JobCode: props.stateValue?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeID,
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
                      ID: props.stateValue?.RecruitmentID,
                      TabNames: props.stateValue?.initialTab,
                      ButtonAction: ButtonAction.View,
                      JobCode: props.stateValue?.JobCode,
                      tab: props.stateValue?.tab,
                      JobCodeID: props.stateValue?.JobCodeID,
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
                    ID: props.stateValue?.RecruitmentID,
                    TabNames: props.stateValue?.initialTab,
                    ButtonAction: ButtonAction.View,
                    JobCode: props.stateValue?.JobCode,
                    tab: props.stateValue?.tab,
                    JobCodeID: props.stateValue?.JobCodeID,
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
              ID: props.stateValue?.RecruitmentID,
              TabNames: props.stateValue?.initialTab,
              ButtonAction: ButtonAction.View,
              JobCode: props.stateValue?.JobCode,
              tab: props.stateValue?.tab,
              JobCodeID: props.stateValue?.JobCodeID,
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
        ID: props.stateValue?.RecruitmentID,
        TabNames: props.stateValue?.initialTab,
        ButtonAction: ButtonAction.View,
        JobCode: props.stateValue?.JobCode,
        tab: props.stateValue?.tab,
        JobCodeID: props.stateValue?.JobCodeID,
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
            additionalButtons={
              props.stateValue?.ButtonAction === ButtonAction.View
                ? [
                    {
                      label: "Back",
                      onClick: async () => {
                        back_fn();
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
    </>
  );
};

export default UploadCandidateDocument;
