import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import SearchableDataTable from "../../components/CustomDataTable";
import "../../App.css";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
} from "../../Services/ServiceExport";
import {
  RoleID,
  StatusId,
  TabName,
  tabType,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  WorkflowAction,
  Choices,
  ResponeStatus,
  ColorCode,
  ActionIcon,
  ButtonAction,
} from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Card, CardContent } from "@mui/material";
import { AutoCompleteItem } from "../../Models/Screens";
import { JobCodeTilte } from "../../Models/RecuritmentVRR";
import {
  DataSyncToRecruitmentResponse,
  InsertComments,
  PostRecuritmentData,
} from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { alertPropsData } from "../../Models/Screens";
import { jobsXAgents, profileXagent } from "../../Models/ApIInterface";
import CustomDialogbox from "../../components/CustomDialogbox";
import { DateExtension } from "../../components/DateExtension";
import {
  AssignHRData,
  AssignRecuritmentHR,
} from "../ScreenComponent/AssignRecuritmentHR";
import IsValid from "../../components/Validation";
import { StatusDetails, TabDetails } from "../../Models/Master";
import CheckboxDataTable from "../../components/CheckboxDataTable";
import InterviewPanelList from "../InterviewPanel/InterviewPanelList";

export type formValidation = {
  Comments: boolean;
  AssignRecruitmentHR: boolean;
  AssignRecruitmentAgencies: boolean;
};

const RecruitmentProcess = (props: any) => {
  console.log(props, "ApprovedVRR");

  const [data, setData] = React.useState<DataSyncToRecruitmentResponse[]>([]);
  const [selectedrowdata, setSelectedrowdata] = React.useState<
    DataSyncToRecruitmentResponse[]
  >([]);
  // const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [AssignHR, setAssignHR] = React.useState<boolean>(false);
  const [AssignHRData, setAssignHRData] = React.useState<AssignHRData>({
    AssignRecruitmentHR: { key: 0, text: "" },
    AssignRecruitmentAgencies: [],
    Comments: "",
  });
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>([]);
  // const [isCurrectTab, setIsCurrectTab] = React.useState<string>("");
  const [allJobData, setJobCodeTitle] = React.useState<JobCodeTilte[]>([
    {
      JobTitle: "",
      JobCode: " ",
      ID: 0,
    },
  ]);
  const [selectedJobCodes, setSelectedJobCodes] = React.useState<
    JobCodeTilte[]
  >([]);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [DatePopup, setDatePopup] = React.useState<boolean>(false);
  const [validationErrors, setValidationErrors] =
    React.useState<formValidation>({
      Comments: false,
      AssignRecruitmentHR: false,
      AssignRecruitmentAgencies: false,
    });

  const storedStringRef = React.useRef("");

  const columnConfig = (
    tab: string,
    ButtonActions: number,
    TabNames: string
  ) => [
    {
      field: "Checkbox",
      header: "",
      sortable: false,
    },
    {
      field: "JobCode",
      header: "Job Code",
      sortable: true,
    },
    {
      field: "JobTitleEnglish",
      header: "Job Title",
      sortable: true,
    },
    {
      field: "BusinessUnitCode",
      header: "BusinessUnit Code",
      sortable: true,
    },
    {
      field: "Status",
      header: "Status",
      fieldName: "Status",
      sortable: false,
      body: (rowData: any) => {
        return <span>{rowData.Status}</span>;
      },
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
      style:
        TabNames === TabName.AdvertExtension
          ? { width: "13%" }
          : { width: "8%" },
      body: (rowData: any) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px", // slightly more space for small screens
              flexWrap: "wrap", // allow wrapping on smaller screens
            }}
          >
            {ButtonActions === ActionIcon.Edit ? (
              <>
                <img
                  src={require("../../assets/Editbutton.svg")}
                  alt="Stamp Icon"
                  onClick={() =>
                    handleRedirectView(
                      rowData,
                      tab,
                      TabNames,
                      ButtonAction.Edit
                    )
                  }
                  style={{
                    width: "2rem", // scales with font size
                    height: "auto",
                    maxWidth: "40px", // limit maximum size
                    cursor: "pointer",
                  }}
                />
              </>
            ) : ButtonActions === ActionIcon.Upload ? (
              <>
                <img
                  src={require("../../assets/UploadIcon.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "2rem", // scales with font size
                    height: "auto",
                    maxWidth: "40px", // limit maximum size
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRedirectView(
                      rowData,
                      tab,
                      TabNames,
                      ButtonAction.Upload
                    )
                  }
                />
              </>
            ) : (
              <>
                <img
                  src={require("../../assets/Viewicon.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "2rem", // scales with font size
                    height: "auto",
                    maxWidth: "40px", // limit maximum size
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRedirectView(
                      rowData,
                      tab,
                      TabNames,
                      ButtonAction.View
                    )
                  }
                />
              </>
            )}
            {TabNames === TabName.AdvertExtension && (
              <>
                <img
                  src={require("../../assets/AddDate.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "2rem", // scales with font size
                    height: "auto",
                    maxWidth: "40px", // limit maximum size
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    let selectedData = [rowData];
                    setSelectedrowdata(selectedData);
                    setDatePopup(true);
                  }}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  async function handleRedirectView(
    rowData: any,
    tab: string,
    TabNames: string,
    ButtonAction: string
  ) {
    switch (TabNames) {
      case TabName.AssignRecuritmentHR:
      case TabName.UploadONEMDoc:
      case TabName.UploadAdvertisement:
      case TabName.AssignAgencies:
      case TabName.ReviewJobAdvertisement:
        props.navigation("/RecurimentProcess/ApprovedVRREdit", {
          state: {
            type: rowData?.Type,
            ID: rowData?.ID,
            AssignedHRId: rowData?.AssignedHRId,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabNames,
            ButtonAction,
          },
        });
        break;

      case TabName.MySubmission:
      case TabName.AdvertExtension:
        props.navigation("/RecurimentProcess/ApprovedVRRView", {
          state: {
            ID: rowData?.ID,
            AssignedHR: rowData?.AssignedHR,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabNames,
            ButtonAction,
          },
        });
        break;

      case TabName.ReviewScorecard:
        props.navigation("/RecurimentProcess/HodScoreCard/CandidateList", {
          state: {
            ID: rowData?.ID.toString().trim(),
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabNames,
            ButtonAction,
            JobCode: rowData?.JobCode?.toString().trim(),
            JobCodeId: rowData?.JobCodeId,
            Department: rowData?.DepartmentId,
            NoOfPosition: rowData?.NumberOfPersonNeeded,
          },
        });
        break;

      case TabName.InterviewQuestion:
        props.navigation("/RecurimentProcess/InterviewQuesEdit", {
          state: {
            ID: rowData?.ID,
            AssignedHRId: rowData?.AssignedHRId,
            tab: "tab2",
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            JobTitleInEnglish: rowData.JobTitleEnglish,
            JobCode: rowData.JobCode,
            TabNames,
            ButtonAction,
          },
        });
        break;

      case TabName.ReviewProfile:
        props.navigation("/RecurimentProcess/ReviewCandidateList", {
          state: {
            ID: rowData?.ID,
            JobCode: rowData?.JobCode,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabNames,
            ButtonAction,
          },
        });
        break;

      default:
        // optional: handle unknown TabName
        console.warn("Unknown TabName:", TabNames);
        break;
    }
  }

  const fetchData = async (tabName: any[]) => {
    setIsLoading(true);
    try {
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

      let filterConditionsRecuritment = [];
      let RecuritmentConditions = "and";
      let CurrentTab;
      if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        CurrentTab = TabName.UploadAdvertisement;
      } else if (
        props.CurrentRoleID.includes(RoleID.HOD) ||
        props.CurrentRoleID.includes(RoleID.LineManager)
      ) {
        CurrentTab = TabName.ReviewJobAdvertisement;
      } else {
        CurrentTab = storedStringRef.current;
      }
      let TabValue = storedStringRef.current
        ? storedStringRef.current
        : CurrentTab;
      //tabName[0]?.TabName;
      switch (TabValue) {
        case TabName.UploadONEMDoc:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.PendingwithHRLeadtouploadONEMsigneddoc,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          break;
        case TabName.UploadAdvertisement:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.PendingwithRecruitmentHRtouploadAdv,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          break;
        case TabName.AssignAgencies:
        case TabName.ReviewProfile:
        case TabName.ReviewScorecard:
        case TabName.AdvertExtension:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          break;
        case TabName.ReviewJobAdvertisement:
          if (props.CurrentRoleID.includes(RoleID.LineManager)) {
            filterConditionsRecuritment.push({
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.PendingwithLineManagereviewAdv,
            });
          } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
            filterConditionsRecuritment.push({
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.PendingwithHODtoreviewAdv,
            });
          }

          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: Choices.No,
          });
          break;
        case TabName.InterviewQuestion:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: [
              StatusId.PendingwithHRandLMtocreateinterviewQuestion,
              StatusId.PendingwithLMcreateDisqualificationQuestion,
            ],
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
          break;
        default:
          filterConditionsRecuritment = [];
          RecuritmentConditions = "and";
          break;
      }
      if (props.CurrentRoleID.includes(RoleID.LineManager)) {
        filterConditionsRecuritment.push({
          FilterKey: "LineManager",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
        filterConditionsRecuritment.push({
          FilterKey: "HOD",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      } else if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        filterConditionsRecuritment.push({
          FilterKey: "AssignedHR",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      }

      const response =
        props.CurrentRoleID.includes(RoleID.RecruitmentHRLead) &&
        activeTab === "tab1"
          ? await getVRRDetails.GetJobTitleInNPEP(
              filterConditions,
              Conditions,
              props
            )
          : await getVRRDetails.GetRecruitmentDetails(
              filterConditionsRecuritment,
              RecuritmentConditions
            );
      if (response.status === 200) {
        setData(response.data);
        const JobCode = response.data.map((item) => ({
          ID: item.ID,
          JobCode: item.JobCode,
          JobTitle: item.JobTitleEnglish,
        }));
        const uniqueJobData = JobCode.filter(
          (job, index, self) =>
            index === self.findIndex((item) => item.ID === job.ID)
        );
        setJobCodeTitle(uniqueJobData);
      }
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    const fetchDataAndGetADGroupsOption = async () => {
      try {
        await fetchData(props.TabDetails[0]);
        // if (props.stateValue?.activeTab) {
        //   setActiveTab(props.stateValue.activeTab);
        // }
        let TabDetails: any;
        if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
          TabDetails = (props.TabDetails[0] ?? []).filter(
            (tab: any) => tab.TabName !== TabName.Evaluation
          );
        } else {
          TabDetails = props.TabDetails[0] ?? [];
        }
        setTabNameData(TabDetails);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchDataAndGetADGroupsOption();
  }, [activeTab]);

  const handleRefresh = (tab: string) => {
    void fetchData(props.TabDetails[0]?.[0]?.Value);
  };

  React.useEffect(() => {
    if (props.stateValue) {
      storedStringRef.current = props.stateValue?.TabName;
      setActiveTab(props.stateValue?.tab);
    } else {
      if (!storedStringRef.current) {
        if (props.TabDetails[0]) {
          storedStringRef.current = props.TabDetails[0]?.[0]?.Value ?? "";
        }
      }
      setActiveTab("tab1");
    }
    // handleRefresh(props.TabDetails[0]?.[0]?.Value);
  }, []);

  const onPageChange = (event: any) => {
    // setFirst(event.first);
    setRows(event.rows);
  };

  const handleCancel = () => {
    setIsLoading(false);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          setAssignHR(false);
          setAssignHRData((prevState) => ({
            ...prevState,
            AssignRecruitmentHR: { key: 0, text: "" },
            AssignRecruitmentAgencies: [],
            Comments: "",
          }));
          setData((prevData) =>
            prevData.map((item) => ({
              ...item,
              Checked: false,
            }))
          );

          setSelectedJobCodes([]);

          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            AssignRecruitmentHR: false,
            AssignRecruitmentAgencies: false,
            Comments: false,
          }));
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

  const handleAutoComplete = async (value: AutoCompleteItem | null) => {
    const defaultValue = { key: 0, text: "" };

    if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
      setAssignHRData((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: value ? [value] : [defaultValue],
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: false,
      }));
    } else {
      setAssignHRData((prevState) => ({
        ...prevState,
        AssignRecruitmentHR: value || defaultValue,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentHR: false,
      }));
    }
  };

  const handleAgencyChange = (value: AutoCompleteItem[]) => {
    if (value.length > 0) {
      setAssignHRData((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: value,
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: false,
      }));
    } else {
      setAssignHRData((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: [],
      }));
      setValidationErrors((prevState) => ({
        ...prevState,
        AssignRecruitmentAgencies: true,
      }));
    }
  };

  const handleCheckbox = (item: any[]) => {
    const selectedJobCodes = item
      .filter((currentItem) => currentItem.Checked)
      .map((currentItem) => {
        const JobTitle = props.JobInEnglishList.find(
          (job: { JobCode: string; text: string }) =>
            job.JobCode === currentItem.JobCode
        );

        return {
          ID: currentItem.ID,
          JobCode: currentItem.JobCode,
          JobCodeId: currentItem.JobCodeId,
          JobTitle: JobTitle ? JobTitle.text : "",
        };
      });
    setSelectedJobCodes(selectedJobCodes);
  };

  const onSelectAllChange = (item: any[]) => {
    const selectedJobCodes = item
      .filter((item) => item.Checked)
      .map((item) => {
        const JobTitle = props.JobInEnglishList.find(
          (job: { JobCode: string; text: string }) =>
            job.JobCode === item.JobCode
        );

        return {
          ID: item.ID,
          JobCode: item.JobCode,
          JobCodeId: item.JobCodeId,
          JobTitle: JobTitle ? JobTitle.text : "",
        };
      });
    setSelectedJobCodes(selectedJobCodes);
  };

  const handleInputChangeTextArea = (value: string) => {
    setAssignHRData((prevState) => ({
      ...prevState,
      Comments: value,
    }));
    setValidationErrors((prevState) => ({
      ...prevState,
      Comments: false,
    }));
  };

  //AssignButton function for AssignHR
  const AssignBtn_fn = () => {
    const isItemSelected = selectedJobCodes.length > 0;

    if (isItemSelected) {
      setAssignHR(true);
    } else {
      let CancelAlert = {
        // Message: RecuritmentHRMsg.RecruitmentErrorMsg,
        Message: props.CurrentRoleID.includes(RoleID.RecruitmentHR)
          ? RecuritmentHRMsg.AgenciesErrorMsg
          : RecuritmentHRMsg.RecruitmentErrorMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(CancelAlert);
      setIsLoading(false);
    }
  };

  const Validation = (): boolean => {
    let errors = {
      AssignRecruitmentHR: false,
      Comments: false,
      AssignRecruitmentAgencies: false,
    };
    if (props.CurrentRoleID.includes(RoleID.RecruitmentHRLead)) {
      errors.AssignRecruitmentHR = !IsValid(
        AssignHRData.AssignRecruitmentHR.text
      );
      errors.Comments = !IsValid(AssignHRData.Comments);
    } else if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
      errors.AssignRecruitmentAgencies = !IsValid(
        AssignHRData.AssignRecruitmentAgencies[0]?.text
      );
      errors.Comments = !IsValid(AssignHRData.Comments);
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };

  const handleSubmit = async () => {
    try {
      const IsVaild = !Validation();
      if (IsVaild) {
        setAssignHR(false);
        setIsLoading(true);
        console.log("selectedJobCodes", selectedJobCodes);
        if (selectedJobCodes.length > 0) {
          for (const selectedJob of selectedJobCodes) {
            const correspondingJob = data.find(
              (item: any) => item.ID === selectedJob.ID
            );
            console.log("Corresponding Job:", correspondingJob);
            if (correspondingJob) {
              let UserIDbyEmail = await CommonServices.getUserIDByEmail(
                AssignHRData.AssignRecruitmentHR.key
              );
              console.log(UserIDbyEmail.data, "UserIDbyEmail");

              const RecruitmentValue: PostRecuritmentData = {
                Data: {
                  BusinessUnitCodeId: correspondingJob.BusinessUnitCodeId,
                  Nationality: correspondingJob.Nationality,
                  EmploymentCategory: correspondingJob.EmploymentCategory,
                  DepartmentId: correspondingJob.DepartmentId,
                  SubDepartmentId: correspondingJob.SubDepartmentId,
                  SectionId: correspondingJob.SectionId,
                  DepartmentCodeId: correspondingJob.DepartmentCodeId,
                  NumberOfPersonNeeded: Number(
                    correspondingJob.NumberOfPersonNeeded
                  ),
                  EnterNumberOfMonths:
                    correspondingJob.EnterNumberOfMonths ?? "0",
                  TypeOfContract: correspondingJob.TypeOfContract,
                  DateRequried: correspondingJob?.DateRequried ?? null,
                  StatusId: StatusId.PendingwithHRLeadtoAssignRecruitmentHR,
                  ActionId: WorkflowAction.Approved,
                  JobCodeId: correspondingJob.JobCodeId,
                  AreaofWork: correspondingJob.AreaofWork,
                  AssignedHR: UserIDbyEmail.data,
                  DataFrom: correspondingJob.Type ?? "",
                },
                PositionData: {
                  PatersonGradeId: correspondingJob.PatersonGradeId ?? 0,
                  DRCGradeId: correspondingJob.DRCGradeId ?? 0,
                  JobTitleEnglishId: correspondingJob.JobTitleEnglishId ?? 0,
                  JobTitleFrenchId: correspondingJob.JobTitleFrenchId ?? 0,
                },
                CommentsList: {
                  RoleId:
                    storedStringRef.current === TabName.AssignRecuritmentHR
                      ? RoleID.RecruitmentHRLead
                      : RoleID.RecruitmentHR,
                  RecruitmentIDId: 0,
                  Comments: AssignHRData.Comments,
                },
                updatePreList: {
                  ID: selectedJob.ID ?? 0,
                  ActionId: WorkflowAction.Approved,
                  ItemCreated: "Yes",
                  IsDataSyncToRecruitment: "No",
                },
              };

              const response = await getVRRDetails.InsertRecruitmentDpt(
                RecruitmentValue
              );
              if (response.status === ResponeStatus.SUCCESS) {
                setAssignHRData((prevState) => ({
                  ...prevState,
                  AssignRecruitmentHR: { key: 0, text: "" },
                  Comments: "",
                }));
                setData((prevData) =>
                  prevData.map((item) => ({
                    ...item,
                    Checked: false,
                  }))
                );
                setSelectedJobCodes([]);
                let SuccessAlert = {
                  Message:
                    selectedJobCodes.length === 1
                      ? RecuritmentHRMsg.SingleHRSuccessMsg
                      : RecuritmentHRMsg.HRSuccess,
                  Type: HRMSAlertOptions.Success,
                  visible: true,
                  ButtonAction: async (userClickedOK: boolean) => {
                    if (userClickedOK) {
                      setAlertPopupOpen(false);
                      setIsLoading(false);
                      await fetchData(props.TabDetails[0]?.[0]?.Value);
                    }
                  },
                };
                setAlertPopupOpen(true);
                setIsLoading(true);
                setalertProps(SuccessAlert);
                setAssignHRData((prevState) => ({
                  ...prevState,
                  AssignRecruitmentAgencies: [],
                  Comments: "",
                }));
                setData((prevData) =>
                  prevData.map((item) => ({
                    ...item,
                    Checked: false,
                  }))
                );
                setSelectedJobCodes([]);
              } else {
                let APIErrorAlert = {
                  Message: RecuritmentHRMsg.APIErrorMsg,
                  Type: HRMSAlertOptions.Error,
                  visible: true,
                  ButtonAction: async (userClickedOK: boolean) => {
                    if (userClickedOK) {
                      setAlertPopupOpen(false);
                      setIsLoading(false);
                    }
                  },
                };
                setAlertPopupOpen(true);
                setIsLoading(true);
                setalertProps(APIErrorAlert);
              }
            }
          }
        }
      }
    } catch (error) {
      console.log("failed Insert Recruitment Data ", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleAgencySubmit = async () => {
    try {
      const IsVaild = !Validation();
      if (IsVaild) {
        setAssignHR(false);
        setIsLoading(true);
        if (selectedJobCodes.length > 0) {
          let ResponseStatusCode;
          for (const selectedJob of selectedJobCodes) {
            const correspondingJob = data.find(
              (item) => item.ID === selectedJob.ID
            );
            const HRMSExternalAgents = await CommonServices.GetMasterData(
              ListNames.HRMSExternalAgents
            );
            let matchedAgents = HRMSExternalAgents.data.filter(
              (data: { Id: number }) =>
                AssignHRData.AssignRecruitmentAgencies.some(
                  (item) => item.key === data.Id
                )
            );

            let agentDetails: jobsXAgents[] = matchedAgents.map((item: any) => {
              AssignHRData.AssignRecruitmentAgencies.filter(
                (data) => data.key === item.Id
              );
              return {
                agentId: item.AgentCode,
                // isSuspended: 1,
              };
            });
            const AgentDetails: profileXagent = {
              jobCode: selectedJob.JobCode,
              jobsXAgents: agentDetails,
            };
            await GetPortalJobsService.UpsertAgenciesJobs(AgentDetails)
              .then(async (res) => {
                if (res.status === ResponeStatus.SUCCESS) {
                  ResponseStatusCode = res.status;
                  if (correspondingJob) {
                    const recruitmentID: number = correspondingJob.ID;

                    const agencyIDs =
                      AssignHRData.AssignRecruitmentAgencies.map(
                        (agency) => agency.key
                      );

                    if (agencyIDs.length === 0) {
                      return;
                    }
                    const agencyData = agencyIDs.map((agencyID) => ({
                      key: agencyID,
                      text:
                        AssignHRData.AssignRecruitmentAgencies.find(
                          (agency) => agency.key === agencyID
                        )?.text || AssignHRData.AssignRecruitmentHR.text,
                      RecruitmentID: recruitmentID,
                    }));

                    const response =
                      await getVRRDetails.InsertExternalAgencyDetails(
                        agencyData,
                        recruitmentID
                      );

                    if (response.status === ResponeStatus.SUCCESS) {
                      const commentsData: InsertComments = {
                        RoleId:
                          storedStringRef.current ===
                          TabName.AssignRecuritmentHR
                            ? RoleID.RecruitmentHRLead
                            : RoleID.RecruitmentHR,
                        RecruitmentIDId: recruitmentID,
                        Comments: AssignHRData.Comments,
                      };

                      await getVRRDetails.InsertCommentsList(commentsData);
                      ResponseStatusCode = response.status;
                      try {
                        // await SPServices.SPUpdateItem({
                        //   Listname: ListNames.HRMSRecruitmentDptDetails,
                        //   RequestJSON: { Action: WorkflowAction.Approved },
                        //   ID: recruitmentID,
                        // });
                      } catch (updateError) {
                        console.error(updateError);
                      }

                      setAssignHRData((prevState) => ({
                        ...prevState,
                        AssignRecruitmentAgencies: [],
                        Comments: "",
                      }));
                      setData((prevData) =>
                        prevData.map((item) => ({
                          ...item,
                          Checked: false,
                        }))
                      );
                      setSelectedJobCodes([]);
                    }
                  } else {
                    console.log(
                      `No corresponding job found for RecruitmentID/VRRId: ${selectedJob.ID}`
                    );
                  }
                } else {
                  let ApiErrorMsg = {
                    Message: RecuritmentHRMsg.APIErrorMsg,
                    Type: HRMSAlertOptions.Error,
                    visible: true,
                    ButtonAction: async (userClickedOK: boolean) => {
                      if (userClickedOK) {
                        setAlertPopupOpen(false);
                        setIsLoading(false);
                      }
                    },
                  };
                  setIsLoading(true);
                  setAlertPopupOpen(true);
                  setalertProps(ApiErrorMsg);
                }
              })
              .catch((error) => {
                console.log("Candidate details doesn't fetch the data", error);
              });
          }
          if (ResponseStatusCode === ResponeStatus.SUCCESS) {
            let CancelAlert = {
              Message:
                selectedJobCodes.length === 1
                  ? RecuritmentHRMsg.SingleAgencyMsg
                  : RecuritmentHRMsg.AgencySucess,
              Type: HRMSAlertOptions.Success,
              visible: true,
              ButtonAction: async (userClickedOK: boolean) => {
                if (userClickedOK) {
                  setAlertPopupOpen(false);
                  setIsLoading(false);
                  await fetchData(props.TabDetails[0]?.[0]?.Value);
                }
              },
            };
            setIsLoading(true);
            setAlertPopupOpen(true);
            setalertProps(CancelAlert);
          } else {
          }
        }
      }
    } catch (error) {
      console.log("failed Insert Agency Data ", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const renderTable = (
    TabNames: string,
    TabValue: string,
    StatusData: StatusDetails[]
  ) => {
    if (TabValue === activeTab) {
      storedStringRef.current = TabNames;
    }
    let Action: any;
    let StatusID: any;
    if (StatusData) {
      Action = StatusData.filter((item) => item.Action);
      StatusID = StatusData.filter((item) => item.StatusId);
      console.log(StatusID, "StatusID");
    }

    switch (TabNames) {
      case TabName.AssignRecuritmentHR:
      case TabName.AssignAgencies:
        return (
          <CheckboxDataTable
            data={data}
            columns={columnConfig(
              TabValue,
              Number(Action[0]?.Action?.[0]),
              TabNames
            )}
            rows={rows}
            onPageChange={(event) => onPageChange(event)}
            handleRefresh={() => handleRefresh(TabValue)}
            handleSelectedRow={handleCheckbox}
            onSelectAllRow={onSelectAllChange}
            handleAssignBtn={AssignBtn_fn}
            AssignBtnValidation={false}
            MasterData={props || {}}
            assignLabel={
              props.CurrentRoleID.includes(RoleID.RecruitmentHR)
                ? "Assign Agencies"
                : "Assign HR"
            }
          />
        );

      case TabName.UploadONEMDoc:
      case TabName.MySubmission:
      case TabName.UploadAdvertisement:
      case TabName.ReviewJobAdvertisement:
      case TabName.ReviewScorecard:
      case TabName.InterviewQuestion:
      case TabName.ReviewProfile:
      case TabName.AdvertExtension:
        return (
          <SearchableDataTable
            data={data}
            columns={columnConfig(TabValue, Action[0]?.ActionId?.[0], TabNames)}
            rows={rows}
            onPageChange={(event) => onPageChange(event)}
            handleRefresh={() => handleRefresh(TabValue)}
            MasterData={props}
          />
        );
      case TabName.Evaluation:
        if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
        } else {
          return <InterviewPanelList {...props} TabValue={activeTab} />;
        }
        break;
      default:
        return null;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: tab.TabName,
    value: tab.Value,
    content: (
      <Card
        variant="outlined"
        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
      >
        <CardContent>
          <div>{renderTable(tab.TabName, tab.Value, tab.StatusDetails)}</div>
        </CardContent>
      </Card>
    ),
  }));

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const AlertpopupSuccess = () => {
    setDatePopup(false);
    setIsLoading(true);
    if (HRMSAlertOptions.Success) {
      let SuccessAlert = {
        Message: RecuritmentHRMsg.AdvertExtendsionSuccessMsg,
        Type: HRMSAlertOptions.Success,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(SuccessAlert);
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
    setIsLoading(false);
  };

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <React.Fragment>
          <div className="menu-card">
            <TabsComponent
              tabs={tabs}
              initialTab={activeTab}
              tabtype={tabType.Dashboard}
              onTabChange={handleTabChange}
            />
          </div>
        </React.Fragment>
      </CustomLoader>
      {AlertPopupOpen ? (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      ) : null}
      {DatePopup && (
        <>
          <CustomDialogbox
            Style={{ width: "40vw", height: "28vw" }}
            visible={DatePopup}
            children={
              <DateExtension
                RecuritmentData={selectedrowdata[0]}
                onClose={() => setDatePopup(false)}
                ModelDropDown={props}
                AlertpopupSuccess={() => AlertpopupSuccess()}
                setIsLoading={setIsLoading}
              />
            }
            onClose={() => setDatePopup(false)}
          />
        </>
      )}
      {AssignHR ? (
        <>
          <CustomDialogbox
            Style={{ width: "45vw", height: "35vw" }}
            visible={AssignHR}
            children={
              <AssignRecuritmentHR
                jobCodes={allJobData}
                selectedJobCodes={selectedJobCodes}
                onSelectAllChange={() => onSelectAllChange}
                onRowChange={() => handleCheckbox}
                CurrentRole={props.CurrentRoleID}
                onClose={handleCancel}
                AssignedHRId={props.stateValue?.AssignedHRId}
                validationErrors={validationErrors}
                ValueData={AssignHRData}
                handleAutoComplete={(item) => handleAutoComplete(item)}
                handleAgencyChange={(item: AutoCompleteItem[]) =>
                  handleAgencyChange(item)
                }
                handleInputChangeTextArea={(item: string) =>
                  handleInputChangeTextArea(item)
                }
                AssignHRSubmit={
                  props.CurrentRoleID.includes(RoleID.RecruitmentHRLead)
                    ? () => handleSubmit()
                    : () => handleAgencySubmit()
                }
              />
            }
            onClose={() => setAssignHR(false)}
            header={
              <div style={{ textAlign: "center", width: "100%" }}>
                <h2
                  style={{
                    color: ColorCode.LabelStyleColorCode.LabelStyleColor,
                    fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", 
                    -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                  }}
                >
                  {props.CurrentRoleID.includes(RoleID.RecruitmentHR)
                    ? "Assign Agencies"
                    : "Assign Recruitment HR"}
                </h2>
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
export default RecruitmentProcess;
