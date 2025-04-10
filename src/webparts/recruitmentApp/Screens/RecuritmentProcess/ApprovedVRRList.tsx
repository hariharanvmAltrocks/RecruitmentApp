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
import CheckboxDataTable from "../../components/CheckboxDataTable";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { alertPropsData } from "../../Models/Screens";
import { jobsXAgents, profileXagent } from "../../Models/ApIInterface";
import CustomDialogbox from "../../components/CustomDialogbox";
import { DateExtension } from "../../components/DateExtension";
import LabelHeaderComponents from "../../components/TitleHeader";
import InterviewPanelList from "../InterviewPanel/InterviewPanelList";
import {
  AssignHRData,
  AssignRecuritmentHR,
} from "../ScreenComponent/AssignRecuritmentHR";

export type formValidation = {
  Comments: boolean;
  AssignRecruitmentHR: boolean;
  AssignRecruitmentAgencies: boolean;
};

const RecruitmentProcess = (props: any) => {
  // console.log(props, "ApprovedVRR");

  const [data, setData] = React.useState<DataSyncToRecruitmentResponse[]>([]);
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
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [DatePopup, setDatePopup] = React.useState<boolean>(false);
  const [assignedCandidates, setAssignedCandidates] =
    React.useState<boolean>(false);

  const [validationErrors, setValidationErrors] =
    React.useState<formValidation>({
      Comments: false,
      AssignRecruitmentHR: false,
      AssignRecruitmentAgencies: false,
    });

  const columnConfig = (
    tab: string,
    ButtonAction: string,
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
        return (
          <span
           
          >
            {rowData.Status}
          </span>
        );
      },
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
      style: { width: "8%" },
      body: (rowData: any) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {ButtonAction === "Edit" ? (
              <>
                {/* <Button
                    
                    className="table_btn"
                    style={{
                      width: "30px",
                      marginRight: "7px",
                      padding: "3px",
                    }}
                  >
                  </Button> */}
                <img
                  src={require("../../assets/Editbutton.svg")}
                  alt="Stamp Icon"
                  onClick={() =>
                    handleRedirectView(rowData, tab, TabNames, ButtonAction)
                  }
                  style={{
                    width: "70%",
                    height: "60%",
                  }}
                />
              </>
            ) : ButtonAction === "Upload" ? (
              <>
                {/* <Button
                    
                    className="table_btn"
                    // icon="pi pi-eye"
                    style={{
                      width: "30px",
                      marginRight: "7px",
                      padding: "3px",
                    }}
                  >
                    
                  </Button> */}
                <img
                  src={require("../../assets/UploadIcon.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "60%",
                    height: "60%",
                  }}
                  onClick={() =>
                    handleRedirectView(rowData, tab, TabNames, ButtonAction)
                  }
                />
              </>
            ) : (
              <>
                {/* <Button
                    onClick={() =>
                      handleRedirectView(rowData, tab, TabName, ButtonAction)
                    }
                    className="table_btn"
                    // icon="pi pi-eye"
                    style={{
                      width: "30px",
                      marginRight: "7px",
                      padding: "3px",
                    }}
                  >
                   
                  </Button> */}
                <img
                  src={require("../../assets/Viewicon.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "70%",
                    height: "60%",
                  }}
                  onClick={() =>
                    handleRedirectView(rowData, tab, TabNames, ButtonAction)
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
                    width: "70%",
                    height: "60%",
                  }}
                  onClick={() =>
                    handleRedirectView(rowData, tab, TabNames, ButtonAction)
                  }
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
    TabName: string,
    ButtonAction: string
  ) {
    switch (props.CurrentRoleID) {
      case RoleID.RecruitmentHRLead:
        {
          if (tab === "tab1") {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", {
              state: {
                type: rowData?.Type,
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab2") {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", {
              state: {
                ID: rowData?.ID,
                AssignedHRId: rowData?.AssignedHRId,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else {
            props.navigation("/RecurimentProcess/ApprovedVRRView", {
              state: {
                ID: rowData?.ID,
                AssignedHR: rowData?.AssignedHR,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          }
        }
        break;

      case RoleID.RecruitmentHR:
        {
          if (tab === "tab1" || tab === "tab2") {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab4") {
            props.navigation("/RecurimentProcess/ApprovedVRRView", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab3") {
            props.navigation("/RecurimentProcess/ReviewProfile", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab5") {
            props.navigation("/RecurimentProcess/AssignInterviewPanel", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          }
        }
        break;

      case RoleID.HOD:
        {
          if (tab === "tab1") {
            props.navigation("/RecurimentProcess/ApprovedVRREdit", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          } else if (tab === "tab2") {
            props.navigation("/RecurimentProcess/HodScoreCard/CandidateList", {
              state: {
                ID: rowData?.ID.toString().trim(),
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
                JobCode: rowData?.JobCode?.toString().trim(),
                JobCodeId: rowData?.JobCodeId,
                Department: rowData?.DepartmentId,
              },
            });
          } else if (tab === "tab3") {
            setDatePopup(true);
          }
        }
        break;
      case RoleID.LineManager:
        {
          if (tab === "tab1") {
            props.navigation("/RecurimentProcess/ReviewProfile", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName: TabName,
                ButtonAction,
              },
            });
          }
        }
        break;
    }
  }

  const fetchData = async () => {
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
      switch (props.CurrentRoleID) {
        case RoleID.RecruitmentHRLead: {
          if (activeTab === "tab2") {
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
          } else {
            filterConditionsRecuritment = [];
            RecuritmentConditions = "";
          }
          break;
        }
        case RoleID.RecruitmentHR: {
          if (activeTab === "tab1") {
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
          } else if (activeTab === "tab2") {
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
          }
          break;
        }
        case RoleID.HOD: {
          if (activeTab === "tab1") {
            filterConditionsRecuritment.push({
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.PendingwithHODtoreviewAdv,
            });
            filterConditionsRecuritment.push({
              FilterKey: "ItemCreated",
              Operator: "eq",
              FilterValue: Choices.No,
            });
          } else if (activeTab === "tab2") {
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
          }
          break;
        }
        default: {
          filterConditionsRecuritment = [];
          RecuritmentConditions = "and";
        }
      }
      const response =
        props.CurrentRoleID === RoleID.RecruitmentHRLead && activeTab === "tab1"
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

  const fetchCandidateData = async (CurrentUserID: any) => {
    setIsLoading(true);
    try {
      const interviewPanelResponse = await CommonServices.GetMasterData(
        ListNames.HRMSInterviewPanelDetails
      );

      if (
        !interviewPanelResponse.data ||
        interviewPanelResponse.data.length === 0
      ) {
        setIsLoading(false);
        return;
      }

      const filteredPanels = interviewPanelResponse.data.filter(
        (panel) => panel.InterviewPanelId === CurrentUserID
      );

      if (filteredPanels.length === 0) {
        setAssignedCandidates(false);
        setIsLoading(false);
        return;
      }

      const candidateIDs = filteredPanels.map((panel) => panel.CandidateIDId);

      const candidateDetailsResponse = await CommonServices.GetMasterData(
        ListNames.HRMSRecruitmentCandidatePersonalDetails
      );

      if (
        !candidateDetailsResponse.data ||
        candidateDetailsResponse.data.length === 0
      ) {
        setIsLoading(false);
        return;
      }

      const matchedCandidates = candidateDetailsResponse.data.filter(
        (candidate) => candidateIDs.includes(candidate.ID)
      );

      const matchedCandidate = matchedCandidates.length > 0;
      setAssignedCandidates(matchedCandidate);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchDataAndGetADGroupsOption = async () => {
      try {
        await fetchData();
        const getCurrentUserEmailID = await CommonServices.getUserGuidByEmail(
          props.CurrentUserEmailId
        );

        if (
          getCurrentUserEmailID.status === 200 &&
          getCurrentUserEmailID.data
        ) {
          const userGUID = getCurrentUserEmailID.data.key;

          await fetchCandidateData(userGUID);
        }

        if (props.stateValue?.activeTab) {
          setActiveTab(props.stateValue.activeTab);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void fetchDataAndGetADGroupsOption();
  }, [AssignHR, activeTab]);

  const onPageChange = (event: any, Type: string) => {
    // setFirst(event.first);
    setRows(event.rows);
  };

  const handleCancel = () => {
    setIsLoading(false);
    setAssignHR(false);
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
    setSelectAll(false);

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      AssignRecruitmentHR: false,
      AssignRecruitmentAgencies: false,
      Comments: false,
    }));
  };

  const handleRefresh = (tab: string) => {
    void fetchData();
    // setActiveTab(tab);
  };

  const handleAutoComplete = async (value: AutoCompleteItem | null) => {
    const defaultValue = { key: 0, text: "" };

    if (props.CurrentRoleID === RoleID.RecruitmentHR) {
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

  const handleCheckbox = (value: boolean, item: any) => {
    const itemIdentifier = item.ID;
    console.log("Checkbox Clicked | Value:", value, "| Item:", item);

    const updatedDataset = data.map((currentItem) => {
      const currentItemIdentifier = currentItem.ID;
      if (currentItemIdentifier === itemIdentifier) {
        return { ...currentItem, Checked: value };
      }

      return currentItem;
    });

    const selectedJobCodes = updatedDataset
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

    setData(updatedDataset);

    setSelectedJobCodes(selectedJobCodes);

    setSelectAll(
      selectedJobCodes.length > 0 &&
        selectedJobCodes.length === updatedDataset.length
    );
  };

  const onSelectAllChange = (value: boolean) => {
    const updatedDataset = data.map((item) => ({
      ...item,
      Checked: value,
    }));

    const selectedJobCodes = updatedDataset
      .filter((item) => item.Checked)
      .map((item) => {
        const JobTitle = props.JobInEnglishList.find(
          (job: { JobCode: string; text: string }) =>
            job.JobCode === item.JobCode
        );

        return {
          ID: item.JobCodeId,
          JobCode: item.JobCode,
          JobCodeId: item.JobCodeId,
          JobTitle: JobTitle ? JobTitle.text : "",
        };
      });

    setData(updatedDataset);

    setSelectedJobCodes(selectedJobCodes);

    setSelectAll(
      selectedJobCodes.length > 0 &&
        selectedJobCodes.length === updatedDataset.length
    );
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
        Message:
          props.CurrentRoleID === RoleID.RecruitmentHR
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

  const handleSubmit = async () => {
    try {
      console.log("selectedJobCodes", selectedJobCodes);
      if (selectedJobCodes.length > 0) {
        for (const selectedJob of selectedJobCodes) {
          const correspondingJob = data.find(
            (item: any) => item.ID === selectedJob.ID
          );
          console.log("Corresponding Job:", correspondingJob);

          if (correspondingJob) {
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
                AssignedHRId: AssignHRData.AssignRecruitmentHR.key,
                DataFrom: correspondingJob.Type ?? "",
              },
              PositionData: {
                PatersonGradeId: correspondingJob.PatersonGradeId ?? 0,
                DRCGradeId: correspondingJob.DRCGradeId ?? 0,
                JobTitleEnglishId: correspondingJob.JobTitleEnglishId ?? 0,
                JobTitleFrenchId: correspondingJob.JobTitleFrenchId ?? 0,
              },
              CommentsList: {
                RoleId: props.CurrentRoleID,
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
              let SuccessAlert = {
                Message: RecuritmentHRMsg.HRSuccess,
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
            } else {
              let APIErrorAlert = {
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
              setalertProps(APIErrorAlert);
            }
          }
        }
      }
    } catch (error) {
      console.log("failed Insert Recruitment Data ", error);
    } finally {
      setAssignHR(false);
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
      setSelectAll(false);
    }
  };

  const handleAgencySubmit = async () => {
    try {
      if (selectedJobCodes.length > 0) {
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
              if (res.status === 200) {
                if (correspondingJob) {
                  const recruitmentID: number = correspondingJob.ID;

                  const agencyIDs = AssignHRData.AssignRecruitmentAgencies.map(
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

                  if (response.status === 200) {
                    const commentsData: InsertComments = {
                      RoleId: props.CurrentRoleID,
                      RecruitmentIDId: recruitmentID,
                      Comments: AssignHRData.Comments,
                    };

                    await getVRRDetails.InsertCommentsList(commentsData);

                    try {
                      // await SPServices.SPUpdateItem({
                      //   Listname: ListNames.HRMSRecruitmentDptDetails,
                      //   RequestJSON: { Action: WorkflowAction.Approved },
                      //   ID: recruitmentID,
                      // });
                    } catch (updateError) {
                      console.error(updateError);
                    }

                    let CancelAlert = {
                      Message: RecuritmentHRMsg.AgencySucess,
                      Type: HRMSAlertOptions.Success,
                      visible: true,
                      ButtonAction: async (userClickedOK: boolean) => {
                        if (userClickedOK) {
                          setAlertPopupOpen(false);
                        }
                      },
                    };

                    setAlertPopupOpen(true);
                    setalertProps(CancelAlert);
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
                    }
                  },
                };

                setAlertPopupOpen(true);
                setalertProps(ApiErrorMsg);
              }
            })
            .catch((error) => {
              console.log("Candidate details doesn't fetch the data", error);
            });
        }
      } else {
      }
    } catch (error) {
    } finally {
      setAssignHR(false);
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
      setSelectAll(false);
    }
  };

  async function AssignHRSubmit() {
    try {
      setIsLoading(true);
      setValidationErrors({
        AssignRecruitmentHR: false,
        Comments: false,
        AssignRecruitmentAgencies: false,
      });

      let errors: any = {};

      if (props.CurrentRoleID === RoleID.RecruitmentHR) {
        if (!AssignHRData.AssignRecruitmentAgencies[0]?.key) {
          errors.AssignRecruitmentAgencies = true;
        }
      } else {
        if (!AssignHRData.AssignRecruitmentHR.key) {
          errors.AssignRecruitmentHR = true;
        }
      }

      if (!AssignHRData.Comments.trim()) {
        errors.Comments = true;
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
      const updatedRowData = data.map((item: any) => {
        const selectedJob = allJobData.find((job) => job.ID === item.ID);

        if (selectedJob) {
          return {
            ...item,
            AssignHR: AssignHRData.AssignRecruitmentHR.key,
            AssignAgencies: AssignHRData.AssignRecruitmentAgencies[0]?.key,
          };
        }
        return item;
      });

      setData(updatedRowData);

      for (const job of allJobData) {
        const itemToUpdate = data.find((item: any) => item.ID === job.ID);

        if (!itemToUpdate) {
          continue;
        }
      }

      if (props.CurrentRoleID === RoleID.RecruitmentHRLead) {
        await handleSubmit();
      } else if (props.CurrentRoleID === RoleID.RecruitmentHR) {
        await handleAgencySubmit();
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const tabs = [
    ...(props.CurrentRoleID === RoleID.RecruitmentHRLead
      ? [
          {
            label: TabName.AssignRecuritmentHR, //"Assign Recuritment HR",
            value: "tab1",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  {/* <SearchableDataTable
                                data={data}
                                columns={columnConfig("tab1", "view", TabName.AssignRecuritmentHR,)}
                                rows={rows}
                                onPageChange={(event) => onPageChange(event, "Recruitment")}
                                handleRefresh={() => handleRefresh("tab1")}
                            /> */}
                  <CheckboxDataTable //AssignHR
                    data={data}
                    columns={columnConfig(
                      "tab1",
                      "View",
                      TabName.AssignRecuritmentHR
                    )}
                    rows={rows}
                    onPageChange={(event) => onPageChange(event, "Recruitment")}
                    handleRefresh={() => handleRefresh("tab1")}
                    handleAssignBtn={AssignBtn_fn}
                    AssignBtnValidation={false}
                    handleCheckbox={handleCheckbox}
                    selectAll={selectAll}
                    onSelectAllChange={onSelectAllChange}
                    assignLabel={
                      props.CurrentRoleID === RoleID.RecruitmentHR
                        ? "Assign Agencies"
                        : "Assign HR"
                    }
                    MasterData={props || {}}
                    //checkedValue={}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: TabName.UploadONEMDoc, //"upload Signed Doc",
            value: "tab2",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <SearchableDataTable
                    data={data}
                    columns={columnConfig(
                      "tab2",
                      "Upload",
                      TabName.UploadONEMDoc
                    )}
                    rows={rows}
                    onPageChange={(event) => onPageChange(event, "VRR")}
                    handleRefresh={() => handleRefresh("tab2")}
                    MasterData={props}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: TabName.MySubmission, //"My Submission",
            value: "tab3",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <SearchableDataTable
                    data={data}
                    columns={columnConfig("tab3", "View", TabName.MySubmission)}
                    rows={rows}
                    onPageChange={(event) => onPageChange(event, "VRR")}
                    handleRefresh={() => handleRefresh("tab3")}
                    MasterData={props}
                  />
                </CardContent>
              </Card>
            ),
          },
        ]
      : [
          ...(props.CurrentRoleID === RoleID.RecruitmentHR
            ? [
                {
                  label: TabName.UploadAdvertisement, //"Upload Advertisement",
                  value: "tab1",
                  content: (
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 2px 4px 3px #d3d3d3",
                        marginTop: "2%",
                      }}
                    >
                      <CardContent>
                        <SearchableDataTable
                          data={data}
                          columns={columnConfig(
                            "tab1",
                            "Upload",
                            TabName.UploadAdvertisement
                          )}
                          rows={rows}
                          onPageChange={(event) => onPageChange(event, "VRR")}
                          handleRefresh={() => handleRefresh("tab1")}
                          MasterData={props}
                        />
                      </CardContent>
                    </Card>
                  ),
                },
                {
                  label: TabName.AssignAgencies, //"Assigne Agencies",
                  value: "tab2",
                  content: (
                    <Card
                      variant="outlined"
                      sx={{
                        boxShadow: "0px 2px 4px 3px #d3d3d3",
                        marginTop: "2%",
                      }}
                    >
                      <CardContent>
                        {/* <SearchableDataTable
                                    data={RecruitmentDetails}
                                    columns={columnConfig("tab2", "view", TabName.AssignAgencies)}
                                    rows={rows}
                                    onPageChange={(event) => onPageChange(event, "VRR")}
                                    handleRefresh={() => handleRefresh("tab2")}
                                /> */}
                        <CheckboxDataTable //AssignAgency
                          data={data}
                          columns={columnConfig(
                            "tab2",
                            "View",
                            TabName.AssignAgencies
                          )}
                          rows={rows}
                          onPageChange={(event) => onPageChange(event, "VRR")}
                          handleRefresh={() => handleRefresh("tab2")}
                          handleAssignBtn={AssignBtn_fn}
                          AssignBtnValidation={false}
                          handleCheckbox={handleCheckbox}
                          selectAll={selectAll}
                          onSelectAllChange={onSelectAllChange}
                          assignLabel={
                            props.CurrentRoleID === RoleID.RecruitmentHR
                              ? "Assign Agencies"
                              : "Assign HR"
                          }
                          MasterData={props}
                          //checkedValue={}
                        />
                      </CardContent>
                    </Card>
                  ),
                },
              ]
            : [
                ...(props.CurrentRoleID === RoleID.HOD
                  ? [
                      {
                        label: TabName.ReviewONEMAdvertisement,
                        value: "tab1",
                        content: (
                          <Card
                            variant="outlined"
                            sx={{
                              boxShadow: "0px 2px 4px 3px #d3d3d3",
                              marginTop: "2%",
                            }}
                          >
                            <CardContent>
                              <SearchableDataTable
                                data={data}
                                columns={columnConfig(
                                  "tab1",
                                  "Edit",
                                  TabName.ReviewONEMAdvertisement
                                )}
                                rows={rows}
                                onPageChange={(event) =>
                                  onPageChange(event, "VRR")
                                }
                                handleRefresh={() => handleRefresh("tab1")}
                                MasterData={props}
                              />
                            </CardContent>
                          </Card>
                        ),
                      },
                      {
                        label: TabName.ScorecardDetails,
                        value: "tab2",
                        content: (
                          <Card
                            variant="outlined"
                            sx={{
                              boxShadow: "0px 2px 4px 3px #d3d3d3",
                              marginTop: "2%",
                            }}
                          >
                            <CardContent>
                              <SearchableDataTable
                                data={data}
                                columns={columnConfig(
                                  "tab2",
                                  "View Position Details",
                                  TabName.ScorecardDetails
                                )}
                                rows={rows}
                                onPageChange={(event) =>
                                  onPageChange(event, "VRR")
                                }
                                handleRefresh={() => handleRefresh("tab2")}
                                MasterData={props}
                              />
                            </CardContent>
                          </Card>
                        ),
                      },
                      // {
                      //   label: TabName.AdvertExtension,
                      //   value: "tab3",
                      //   content: (
                      //     <Card
                      //       variant="outlined"
                      //       sx={{
                      //         boxShadow: "0px 2px 4px 3px #d3d3d3",
                      //         marginTop: "2%",
                      //       }}
                      //     >
                      //       <CardContent>
                      //         <SearchableDataTable
                      //           data={RecruitmentDetails}
                      //           columns={columnConfig(
                      //             "tab3",
                      //             "View",
                      //             TabName.AdvertExtension
                      //           )}
                      //           rows={rows}
                      //           onPageChange={(event) =>
                      //             onPageChange(event, "Rec")
                      //           }
                      //           handleRefresh={() => handleRefresh("tab3")}
                      //           MasterData={props}
                      //         />
                      //       </CardContent>
                      //     </Card>
                      //   ),
                      // },
                      ...(assignedCandidates
                        ? [
                            {
                              label: TabName.Evaluation, //"EvaluationTab for HR",
                              value: "tab3",
                              content: <InterviewPanelList {...props} />,
                            },
                          ]
                        : []),
                    ]
                  : [
                      ...(props.CurrentRoleID === RoleID.LineManager
                        ? [
                            {
                              label: TabName.ReviewProfile,
                              value: "tab1",
                              content: (
                                <Card
                                  variant="outlined"
                                  sx={{
                                    boxShadow: "0px 2px 4px 3px #d3d3d3",
                                    marginTop: "2%",
                                  }}
                                >
                                  <CardContent>
                                    <SearchableDataTable
                                      data={data}
                                      columns={columnConfig(
                                        "tab1",
                                        "Edit",
                                        TabName.ReviewProfile
                                      )}
                                      rows={rows}
                                      onPageChange={(event) =>
                                        onPageChange(event, "VRR")
                                      }
                                      handleRefresh={() =>
                                        handleRefresh("tab1")
                                      }
                                      MasterData={props}
                                    />
                                  </CardContent>
                                </Card>
                              ),
                            },
                          ]
                        : []),
                    ]),
              ]),
        ]),
  ];

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
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
            Style={{ width: "40vw" }}
            visible={DatePopup}
            children={
              <DateExtension
                JobTitle={""}
                RecuritmentID={450}
                onClose={() => setDatePopup(false)}
              />
            }
            onClose={() => setDatePopup(false)}
            header={
              <div className="ms-Grid-row" style={{ textAlign: "center" }}>
                <LabelHeaderComponents value={"Advertisement Extension"} />
              </div>
            }
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
                onSelectAllChange={onSelectAllChange}
                onRowChange={handleCheckbox}
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
                AssignHRSubmit={() => AssignHRSubmit()}
              />
            }
            onClose={() => setAssignHR(false)}
            header={
              <div style={{ textAlign: "center", width: "100%" }}>
                <h2
                  style={{
                    color:ColorCode.LabelStyleColorCode.LabelStyleColor,
                    fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", 
                    -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                  }}
                >
                  {props.CurrentRoleID === RoleID.RecruitmentHR
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
