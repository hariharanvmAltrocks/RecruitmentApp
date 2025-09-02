import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {
  GetPortalJobsService,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  ApplicationStatusId,
  ButtonAction,
  HRMSAlertOptions,
  ResponeStatus,
  RoleID,
  RoleName,
  StatusId,
  TabName,
  tabType,
  workflowStatusApi,
} from "../../utilities/Config";
import CommentsPopup from "../../components/CommentsPopup";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import {
  FilterItem,
  GetProfileByFilter,
  GetProfileByJobCode,
} from "../../Models/ApIInterface";
import TabsComponent from "../../components/TabsComponent ";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { alertPropsData } from "../../Models/Screens";
import * as moment from "moment";
import { tabStyle } from "../../components/TabMerge";
import ToolTipButton from "../../components/Tooltip";

type tabCount = {
  ReviewProfileCount: number;
  Level1Count: number;
  Level2Count: number;
  ONHoldRejectedCount: number;
  InterviewPanelCount: number;
  InterviewPanel2Count: number;
  RescheduleCount: number;
};

const ReviewCandidateList = (props: any) => {
  const [CandidateData, setCandidateData] = React.useState<
    GetProfileByJobCode[] | null
  >([]);
  const [rows, setRows] = React.useState<number>(5);
  // const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [RecruitmentDetails, setRecruitmentDetails] = React.useState<any[]>([]);
  const [CommentsPopups, setCommentsPopup] = React.useState<boolean>(false);
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [breadcrumbTab, setBreadcrumbTab] = React.useState<string>("tab1");
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [prevActiveTab, setPrevActiveTab] = React.useState<string | null>(null);
  // const [JobVaildDate, setJobVaildDate] = React.useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [JobUniqueValue, setJobUniqueValue] = React.useState<string>("");
  const [pagination, setPagination] = React.useState({
    first: 0,
    rows: rows,
    totalPages: 1,
  });
  const [pendingcount, setPendingCount] = React.useState<tabCount>({
    ReviewProfileCount: 0,
    Level1Count: 0,
    Level2Count: 0,
    ONHoldRejectedCount: 0,
    InterviewPanelCount: 0,
    InterviewPanel2Count: 0,
    RescheduleCount: 0,
  });
  const [pendingInfo, setPendingInfo] = React.useState<any>(null);

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabNamed: string,
    ButtonAction: string,
    PreActionBtn: string
  ): void {
    // console.log("RecruitmentDetails", RecruitmentDetails);

    const today = new Date();
    today.setDate(today.getDate() + 1);
    // const todayDateStr = today.toDateString();

    const {
      JobPostingEndDate,
      JobPostingFirstExtensionEndDate,
      JobPostingSecondExtensionEndDate,
      ID: RecruitmentID,
    } = RecruitmentDetails[0] || {};

    let JobValidation = false;

    let comparisonDate = null;

    if (JobPostingSecondExtensionEndDate) {
      comparisonDate = new Date(JobPostingSecondExtensionEndDate);
    } else if (JobPostingFirstExtensionEndDate) {
      comparisonDate = new Date(JobPostingFirstExtensionEndDate);
    } else if (JobPostingEndDate) {
      comparisonDate = new Date(JobPostingEndDate);
    }

    if (comparisonDate) {
      comparisonDate.setHours(0, 0, 0, 0); // Normalize time
      JobValidation = today >= comparisonDate; // <-- reversed comparison
    }

    let ScreenNavigation = props.CurrentRoleID.includes(RoleID.LineManager)
      ? "/RecurimentProcess/ReviewCandidateList/ViewCandidateDetails"
      : "/ReviewProfileList/ReviewCandidateList/ViewCandidateDetails";
    if (tab === "tab2 - Level 2") {
      if (JobValidation && pendingcount.ONHoldRejectedCount === 0) {
        props.navigation(ScreenNavigation, {
          state: {
            ID: rowData?.CandidateID,
            StatusId: rowData?.workflowStatusId,
            RecruitmentID,
            tab,
            ButtonAction,
            TabNamed,
            JobCodeID: props.stateValue?.JobCodeID,
            JobCode: props.stateValue?.JobCode,
            initialTab: props.stateValue?.TabNames,
            PreActionBtn,
          },
        });
      } else if (pendingcount.ONHoldRejectedCount > 0) {
        // const JobExpiredMsg = `There are ${pendingcount.ONHoldRejectedCount} pending candidate is there so please review the candidate after the processed .`;
        const JobExpiredMsg = `
          <div style="text-align: center;">
            <h3>⚠️ Pending Candidate Review.</h3>
            <p>There is ${pendingcount.ONHoldRejectedCount} pending candidate currently on hold</p>
            <p>Please review the candidate and take the necessary action to proceed with interview scheduling.</p>
          </div>`;
        const SuccessAlert = {
          Message: JobExpiredMsg,
          Type: HRMSAlertOptions.Error,
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
        const Dateformat = JobPostingSecondExtensionEndDate
          ? moment(JobPostingSecondExtensionEndDate).format("DD/MM/YYYY")
          : JobPostingFirstExtensionEndDate
          ? moment(JobPostingFirstExtensionEndDate).format("DD/MM/YYYY")
          : moment(JobPostingEndDate).format("DD/MM/YYYY");
        const JobExpiredMsg = `
          <div style="text-align: center;">
            <h3>⚠️ Action cannot be performed.</h3>
            <p>This job advert is still active and open for recruitment.</p>
            <p><strong>Expiry Date:</strong> ${Dateformat}</p>
            <p>Please try again after it expires.</p>
          </div>`;
        const SuccessAlert = {
          Message: JobExpiredMsg,
          Type: HRMSAlertOptions.Error,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              setAlertPopupOpen(false);
            }
          },
        };

        setAlertPopupOpen(true);
        setalertProps(SuccessAlert);
      }
    } else {
      props.navigation(ScreenNavigation, {
        state: {
          ID: rowData?.CandidateID,
          StatusId: rowData?.workflowStatusId,
          RecruitmentID,
          tab,
          JobCodeID: props.stateValue?.JobCodeID,
          JobCode: props.stateValue?.JobCode,
          ButtonAction,
          TabNamed,
          initialTab: props.stateValue?.TabNames,
          PreActionBtn,
        },
      });
    }
  }

  const handleHover = async (workflowStatusId: string, rowData: any) => {
    let pendingName: any[] = [];
    let RecrutimentHR = RecruitmentDetails[0]?.AssignEMail;
    let LineManager = RecruitmentDetails[0]?.AssignLineManager;
    let HOD = RecruitmentDetails[0]?.AssignHOD;
    switch (workflowStatusId) {
      case workflowStatusApi.HRPending:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              RecrutimentHR,
              RoleName.RecruitmentHR
            )
          ).data,
        ];
        break;
      case workflowStatusApi.LineManagerL1Pending:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              LineManager,
              RoleName.LineManager
            )
          ).data,
        ];
        break;
      case workflowStatusApi.LineManagerL2Pending:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              LineManager,
              RoleName.LineManager
            )
          ).data,
        ];
        break;
      case workflowStatusApi.LineManagerLevel1OnHold:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              LineManager,
              RoleName.LineManager
            )
          ).data,
        ];
        break;
      case workflowStatusApi.LineManagerLevel2OnHold:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              LineManager,
              RoleName.LineManager
            )
          ).data,
        ];
        break;
      case workflowStatusApi.PendingRecruitmentHRscheduleInterview:
        pendingName = [
          (
            await getVRRDetails.GetADGroupUsers(
              RecrutimentHR,
              RoleName.RecruitmentHR
            )
          ).data,
        ];
        break;
      case workflowStatusApi.pendingHODSelection:
        pendingName = [
          (await getVRRDetails.GetADGroupUsers(HOD, RoleName.HOD)).data,
        ];
        break;
      case workflowStatusApi.CandidateOnHoldIPanel:
        pendingName = [
          (await getVRRDetails.GetADGroupUsers(HOD, RoleName.HOD)).data,
        ];
        break;
      default:
        pendingName = [{ Key: "N/A", Value: "No matching group" }];
        break;
    }
    setPendingInfo(pendingName);
  };

  const columnConfig = (
    tab: string,
    ButtonActions: string,
    TabNames: string
  ) => [
    {
      field: "SNO",
      header: "S.No",
      sortable: true,
    },
    {
      field: "ApplicantName",
      header: "Applicant Name",
      sortable: true,
    },
    {
      field: "PositionTitle",
      header: "Position Title",
      sortable: true,
    },
    {
      field: "JobCode",
      header: "Job Code",
      sortable: true,
    },
    ...(tab === "tab1"
      ? [
          {
            field: "createdOn",
            header: "Profile Received Date",
            sortable: true,
          },
        ]
      : []),
    {
      field: "Status",
      header: "Status",
      fieldName: "Status",
      sortable: false,
      body: (rowData: any) => {
        const isTooltipStatus = [
          workflowStatusApi.CandidateRejectedIPanel,
          workflowStatusApi.LineManagerLevel1Rejected,
          workflowStatusApi.LineManagerLevel2Rejected,
          workflowStatusApi.HRRejected,
        ].includes(rowData.workflowStatusId);
        if (
          !isTooltipStatus &&
          breadcrumbTab === "tab2" &&
          props.stateValue?.TabNames === TabName.ReviewProfile &&
          props.CurrentRoleID.includes(RoleID.RecruitmentHR)
        ) {
          return (
            <div>
              <ToolTipButton
                Title=""
                CurrentMenuId={props.ModalDropDown?.CurrentMenuId}
                Rowdata={rowData}
                ApproverData={pendingInfo}
                onHover={() => handleHover(rowData.workflowStatusId, rowData)}
              />
              <span>{rowData.Status}</span>
            </div>
          );
        }
        return (
          <span>
            {rowData.applicationStatusId ===
            ApplicationStatusId.ApplicationSuspended ? (
              <span style={{ color: "red" }}>{rowData.applicationStatus}</span>
            ) : (
              <span> {rowData.Status}</span>
            )}
          </span>
        );
      },
    },
    {
      field: "",
      header: "Action",
      sortable: false,
      style: { width: "7%" },
      body: (rowData: any) => {
        return (
          <>
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
              {(props.CurrentRoleID.includes(RoleID.RecruitmentHR) &&
                tab === "tab2" &&
                rowData.workflowStatusId !=
                  StatusId?.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) ||
              (props.CurrentRoleID.includes(RoleID.LineManager) &&
                rowData.workflowStatusId ===
                  workflowStatusApi.LineManagerLevel1Rejected) ||
              (props.CurrentRoleID.includes(RoleID.LineManager) &&
                rowData.workflowStatusId ===
                  workflowStatusApi.LineManagerLevel2Rejected) ||
              (props.CurrentRoleID.includes(RoleID.LineManager) &&
                rowData.workflowStatusId ===
                  workflowStatusApi.PendingRecruitmentHRscheduleInterview) ||
              rowData.applicationStatusId ===
                ApplicationStatusId.ApplicationSuspended ? (
                <>
                  <img
                    src={require("../../assets/Viewicon.svg")}
                    alt="Stamp Icon"
                    onClick={() =>
                      handleRedirectView(
                        rowData,
                        tab,
                        TabNames,
                        ButtonAction.View,
                        ButtonAction.View
                      )
                    }
                    style={{
                      width: "50%", // scales with font size
                      height: "auto",
                      maxWidth: "40px", // limit maximum size
                      cursor: "pointer",
                    }}
                  />
                </>
              ) : (
                <>
                  <img
                    src={require("../../assets/Editbutton.svg")}
                    alt="Stamp Icon"
                    style={{
                      width: "50%", // scales with font size
                      height: "auto",
                      maxWidth: "40px", // limit maximum size
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleRedirectView(
                        rowData,
                        tab,
                        TabNames,
                        ButtonAction.Edit,
                        ButtonAction.Edit
                      )
                    }
                  />
                </>
              )}
            </div>
          </>
        );
      },
    },
  ];

  // React.useEffect(() => {
  //   const getMasterData = async () => {
  //     const StatusMaster = await CommonServices.GetMasterData(
  //       ListNames.HRMSRecruitmentWorkFlowMasterStatus
  //     );
  //     let MasterStatusData = StatusMaster.data.map((item) => ({
  //       key: item.Code,
  //       text: item.Status,
  //     }));
  //   };
  //   void getMasterData();
  // }, [activeTab]);

  const fetchCandidateData = async (
    tabs: string,
    row: number,
    JobUniqueValues: string
  ) => {
    setIsLoading(true);
    try {
      if (
        (tabs === "tab2" || tabs === "tab3") &&
        props.stateValue?.TabNames === TabName.AssignInterviewPanel
      ) {
        let filterConditionsRecuritment = [];
        let RecuritmentConditions = "and";
        if (tabs === "tab3") {
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: [
              StatusId.InterviewScheduledforLevel2,
              StatusId.InterviewScheduled,
            ],
          });
          filterConditionsRecuritment.push({
            FilterKey: "JobCode",
            Operator: "eq",
            FilterValue: props?.stateValue?.JobCodeID,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
        } else {
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue:
              StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
          filterConditionsRecuritment.push({
            FilterKey: "JobCode",
            Operator: "eq",
            FilterValue: props?.stateValue?.JobCodeID,
          });
        }
        const ReschedulData =
          await InterviewServices.GetCandidateDetailsInterviewPanalDashboard(
            filterConditionsRecuritment,
            RecuritmentConditions
          );
        if (ReschedulData.status === 200 && ReschedulData.data !== null) {
          let ReschedulDataFilter = ReschedulData.data.map((item: any) => {
            return {
              SNO: item.SNO,
              CandidateID: item?.ID,
              ApplicantName: `${item?.FristName || ""} ${item?.LastName || ""}`,
              PositionTitle: item?.PositionTitle,
              JobCode: item?.JobCode,
              Status: item?.Status,
              workflowStatusId: item?.StatusId,
            };
          });
          setCandidateData(ReschedulDataFilter);
        }
      } else {
        let FilterValueData: GetProfileByFilter = {
          filterValue: "",
          sortBy: "",
          sortOrder: 0,
          pageSize: row ? row : rows,
          currentPage: 0,
          totalItems: 0,
        };
        let createFilter = (workflowStausId: string[]): FilterItem => ({
          jobCode: JobUniqueValues, //props.stateValue?.JobCode, //"JC0005",
          workflowStausId: workflowStausId,
          pagination: FilterValueData,
        });

        let FilterValue: FilterItem = {
          jobCode: "",
          workflowStausId: [],
          pagination: {
            filterValue: "",
            sortBy: "",
            sortOrder: 0,
            pageSize: 0,
            currentPage: 0,
            totalItems: 0,
          },
        };

        switch (tabs) {
          case "tab1":
            if (props.stateValue?.TabNames === TabName.AssignInterviewPanel) {
              FilterValue = createFilter([
                workflowStatusApi.PendingRecruitmentHRscheduleInterview,
              ]);
            } else if (props.CurrentRoleID.includes(RoleID.LineManager)) {
              FilterValue = createFilter([
                workflowStatusApi.LineManagerL1Pending,
              ]);
            } else {
              FilterValue = createFilter([workflowStatusApi.HRPending]);
            }
            break;

          case "tab2":
            if (props.CurrentRoleID.includes(RoleID.LineManager)) {
              FilterValue = createFilter([
                workflowStatusApi.PendingRecruitmentHRscheduleInterview,
              ]);
            } else {
              FilterValue = createFilter([
                workflowStatusApi.HRRejected,
                workflowStatusApi.LineManagerL1Pending,
                workflowStatusApi.LineManagerL2Pending,
                workflowStatusApi.LineManagerLevel1OnHold,
                workflowStatusApi.LineManagerLevel2OnHold,
                workflowStatusApi.LineManagerLevel1Rejected,
                workflowStatusApi.LineManagerLevel2Rejected,
                workflowStatusApi.pendingHODSelection,
                workflowStatusApi.CandidateSelectedIPanel,
                workflowStatusApi.CandidateRejectedIPanel,
                workflowStatusApi.PendingRecruitmentHRscheduleInterview,
              ]);
            }
            break;

          case "tab2 - Level 2":
            if (props.CurrentRoleID.includes(RoleID.LineManager)) {
              FilterValue = createFilter([
                workflowStatusApi.LineManagerL2Pending,
              ]);
            }
            break;

          case "tab3":
            if (props.CurrentRoleID.includes(RoleID.LineManager)) {
              FilterValue = createFilter([
                workflowStatusApi.LineManagerLevel1OnHold,
                workflowStatusApi.LineManagerLevel2OnHold,
                workflowStatusApi.LineManagerLevel1Rejected,
                workflowStatusApi.LineManagerLevel2Rejected,
              ]);
            } else {
              FilterValue = createFilter([
                workflowStatusApi.HROnHold,
                workflowStatusApi.HRRejected,
              ]);
            }
            break;

          case "tab4":
            //   FilterValue = createFilter(workflowStatusApi.Rejected);
            break;

          default:
            FilterValue = createFilter([]);
        }

        await GetPortalJobsService.getCandidateDetailsInJobCode(FilterValue)
          .then(async (res) => {
            setCandidateData(res.data);
          })
          .catch((error) => {
            console.log("Candidate details doesn't fetch the data", error);
          });
      }
    } catch (error) {
      console.log("Candidate Api failed", error);
    }
    setIsLoading(false);
  };

  const pendingcountTabs = async (JobUniqueValue: string) => {
    setIsLoading(true);
    try {
      let FilterValueData: GetProfileByFilter = {
        filterValue: "",
        sortBy: "",
        sortOrder: 0,
        pageSize: 10000,
        currentPage: 0,
        totalItems: 0,
      };

      let createFilter = (workflowStausId: string[]): FilterItem => ({
        jobCode: JobUniqueValue, //props.stateValue?.JobCode, //"JC0005",
        workflowStausId: workflowStausId,
        pagination: FilterValueData,
      });
      let FilterValue: FilterItem = {
        jobCode: "",
        workflowStausId: [],
        pagination: {
          filterValue: "",
          sortBy: "",
          sortOrder: 0,
          pageSize: 0,
          currentPage: 0,
          totalItems: 0,
        },
      };

      FilterValue = createFilter([
        workflowStatusApi.LineManagerL1Pending,
        workflowStatusApi.LineManagerL2Pending,
        workflowStatusApi.LineManagerLevel1OnHold,
        workflowStatusApi.LineManagerLevel2OnHold,
        workflowStatusApi.LineManagerLevel1Rejected,
        workflowStatusApi.LineManagerLevel2Rejected,
        workflowStatusApi.pendingHODSelection,
        workflowStatusApi.CandidateSelectedIPanel,
        workflowStatusApi.CandidateRejectedIPanel,
        workflowStatusApi.PendingRecruitmentHRscheduleInterview,
        workflowStatusApi.HRPending,
      ]);

      await GetPortalJobsService.getCandidateDetailsInJobCode(FilterValue)
        .then(async (res) => {
          console.log(res, "res");
          console.log(pendingcount, "pendingcount");
          let ReviewProfileCount = res.data?.filter(
            (item) => item.workflowStatusId === workflowStatusApi.HRPending
          );
          let InterviewLevel1 = res.data?.filter(
            (item) =>
              item.workflowStatusId === workflowStatusApi.LineManagerL1Pending
          );
          let InterviewLevel2 = res.data?.filter(
            (item) =>
              item.workflowStatusId === workflowStatusApi.LineManagerL2Pending
          );

          const RejectedOnHold = res.data?.filter(
            (item) =>
              item.workflowStatusId ===
                workflowStatusApi.LineManagerLevel1OnHold ||
              // item.workflowStatusId ===
              //   workflowStatusApi.LineManagerLevel1Rejected ||
              item.workflowStatusId ===
                workflowStatusApi.LineManagerLevel2OnHold
            // item.workflowStatusId ===
            //   workflowStatusApi.LineManagerLevel2Rejected
          );

          const InterviewScheduledLevel1 = res.data?.filter(
            (item) =>
              item.workflowStatusId ===
              workflowStatusApi.PendingRecruitmentHRscheduleInterview
          );

          setPendingCount((prev) => ({
            ...prev,
            ReviewProfileCount:
              typeof ReviewProfileCount?.length === "number"
                ? ReviewProfileCount?.length
                : 0,
            Level1Count:
              typeof InterviewLevel1?.length === "number"
                ? InterviewLevel1?.length
                : 0,
            Level2Count:
              typeof InterviewLevel2?.length === "number"
                ? InterviewLevel2?.length
                : 0,
            ONHoldRejectedCount:
              typeof RejectedOnHold?.length === "number"
                ? RejectedOnHold?.length
                : 0,
            InterviewPanelCount:
              typeof InterviewScheduledLevel1?.length === "number"
                ? InterviewScheduledLevel1?.length
                : 0,
          }));
        })
        .catch((error) => {
          console.log("Candidate details doesn't fetch the data", error);
        });
      await InterviewServices.GetCandidateDetailsInterviewPanalDashboard(
        [
          {
            FilterKey: "JobCode",
            Operator: "eq",
            FilterValue: props?.stateValue?.JobCodeID,
          },
        ],
        ""
      ).then(async (res) => {
        let InterviewScheduledLevel2 = res.data?.filter(
          (item: any) =>
            item.StatusId ===
            StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
        );

        let RescheduledCount = res.data?.filter(
          (item: any) =>
            item.StatusId === StatusId.InterviewScheduled ||
            item.StatusId === StatusId.InterviewScheduledforLevel2
        );
        setPendingCount((prev) => ({
          ...prev,
          InterviewPanel2Count: InterviewScheduledLevel2?.length ?? 0,
          RescheduleCount: RescheduledCount?.length ?? 0,
          // typeof res.data?.length === "number" ? res.data.length : 0,
        }));
      });
    } catch (error) {
      console.log("Error in pendingcountTabs", error);
    }
    setIsLoading(false);
  };

  const fetchRecuritmentData = async () => {
    const filterConditions = [];
    const Conditions = "";
    filterConditions.push({
      FilterKey: "ID",
      Operator: "eq",
      FilterValue: props.stateValue.ID,
    });
    const RecruitmentDetails = await getVRRDetails.GetRecruitmentDetails(
      filterConditions,
      Conditions
    );
    if (RecruitmentDetails.status === 200 && RecruitmentDetails.data !== null) {
      setRecruitmentDetails(RecruitmentDetails.data);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let JobCodeFilter = [
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: props.stateValue?.JobCodeID,
        },
        { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
      ];
      let JobUniqueValue = await getVRRDetails.GetJobUniqueDataValue(
        JobCodeFilter,
        "and"
      );
      console.log("JobUniqueValue", JobUniqueValue);
      if (
        JobUniqueValue.status === ResponeStatus.SUCCESS &&
        JobUniqueValue.data.length > 0
      ) {
        setJobUniqueValue(JobUniqueValue.data[0]?.JobUniqueKey);
        await fetchRecuritmentData();
        await fetchCandidateData(
          breadcrumbTab,
          5,
          JobUniqueValue.data[0]?.JobUniqueKey
        );
        await pendingcountTabs(JobUniqueValue.data[0]?.JobUniqueKey);
      }
    };
    void fetchData();
  }, []);

  const onPageChange = (event: any) => {
    // setFirst(event.first);
    setPagination({
      first: event.first,
      rows: event.rows,
      totalPages: event.totalPages,
    });
    setRows(event.rows);
    let PageItem = event.rows * event.totalPages;
    void fetchCandidateData(breadcrumbTab, PageItem, JobUniqueValue);
    void pendingcountTabs(JobUniqueValue);
  };
  const handleRefresh = (tab: string) => {
    setBreadcrumbTab(tab);
    void fetchCandidateData(tab, 5, JobUniqueValue);
    void fetchRecuritmentData();
    void pendingcountTabs(JobUniqueValue);
  };

  const tabs = (tab: string) => [
    {
      label: TabName.ViewCandidateList,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            "& .MuiPaper-root-MuiCard-root": {
              overflow: "visible",
            },
          }}
        >
          <CardContent>
            <ReviewProfileDatatable
              data={CandidateData ?? []}
              columns={columnConfig(
                tab,
                ButtonAction.Edit,
                TabName.ReviewProfile
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh(tab)}
              pagination={pagination}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  React.useEffect(() => {
    const currentTabs = tabs("someValue"); // Provide your actual tab value here.
    const activeTabObj = currentTabs.find((item) => item.value === activeTab);
    const prevTabObj = currentTabs.find((item) => item.value === prevActiveTab);

    if (activeTab === "tab1") {
      setTabNameData(() => {
        const newTabNames = [
          { tabName: props.stateValue?.TabNames },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
        return newTabNames;
      });
    } else {
      setTabNameData(() => {
        const newTabNames = [
          { tabName: props.stateValue?.TabNames },
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

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case TabName.ReviewProfile:
        return tabStyle(tab, pendingcount.ReviewProfileCount);
      case TabName.ReviewLevel1:
        return tabStyle(tab, pendingcount.Level1Count);
      case TabName.ReviewLevel2:
        return tabStyle(tab, pendingcount.Level2Count);
        break;
      case TabName.InterviewpanelL1:
        return tabStyle(tab, pendingcount.InterviewPanelCount);
        break;
      case TabName.InterviewpanelL2:
        return tabStyle(tab, pendingcount.InterviewPanel2Count);
        break;
      case TabName.OnHoldRejected:
        return tabStyle(tab, pendingcount.ONHoldRejectedCount);
      case TabName.ReschedulInterview:
        return tabStyle(tab, pendingcount.RescheduleCount);
        break;
      default:
        return tab;
    }
  };

  const breadcrumbs = [
    ...(props.CurrentRoleID.includes(RoleID.LineManager)
      ? [
          {
            label: getTabLabel(TabName.ReviewLevel1), //TabName.ReviewLevel1,
            value: "tab1",
            content: (
              <Card
                variant="outlined"
                sx={{
                  boxShadow: "0px 2px 4px 3px #d3d3d3",
                  marginTop: "2%",
                  "& .MuiPaper-root-MuiCard-root": {
                    overflow: "visible", // make card content allow overflow
                  },
                }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab1")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                    MainTable={true}
                    additionalButtons={[
                      {
                        label: "Back",
                        onClick: async () => {
                          back_fn();
                        },
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: getTabLabel(TabName.ReviewLevel2), //TabName.ReviewLevel2,
            value: "tab2 - Level 2",
            content: (
              <Card
                variant="outlined"
                sx={{
                  boxShadow: "0px 2px 4px 3px #d3d3d3",
                  marginTop: "2%",
                  "& .MuiPaper-root-MuiCard-root": {
                    overflow: "visible", // make card content allow overflow
                  },
                }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab2 - Level 2")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                    MainTable={true}
                    additionalButtons={[
                      {
                        label: "Back",
                        onClick: async () => {
                          back_fn();
                        },
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: getTabLabel(TabName.Shortlisted), //TabName.Shortlisted,
            value: "tab2",
            content: (
              <Card
                variant="outlined"
                sx={{
                  boxShadow: "0px 2px 4px 3px #d3d3d3",
                  marginTop: "2%",
                  "& .MuiPaper-root-MuiCard-root": {
                    overflow: "visible", // make card content allow overflow
                  },
                }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab2")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                    MainTable={true}
                    additionalButtons={[
                      {
                        label: "Back",
                        onClick: async () => {
                          back_fn();
                        },
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: getTabLabel(TabName.OnHoldRejected), // TabName.OnHoldRejected,
            value: "tab3",
            content: (
              <Card
                variant="outlined"
                sx={{
                  boxShadow: "0px 2px 4px 3px #d3d3d3",
                  marginTop: "2%",
                  "& .MuiPaper-root-MuiCard-root": {
                    overflow: "visible", // make card content allow overflow
                  },
                }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab3")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                    MainTable={true}
                    additionalButtons={[
                      {
                        label: "Back",
                        onClick: async () => {
                          back_fn();
                        },
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            ),
          },
        ]
      : [
          {
            label: getTabLabel(TabName.ReviewProfile),
            value: "tab1",
            content: (
              <Card
                variant="outlined"
                sx={{
                  boxShadow: "0px 2px 4px 3px #d3d3d3",
                  marginTop: "2%",
                  "& .MuiPaper-root-MuiCard-root": {
                    overflow: "visible", // make card content allow overflow
                  },
                }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab1")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                    MainTable={true}
                    additionalButtons={[
                      {
                        label: "Back",
                        onClick: async () => {
                          back_fn();
                        },
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: getTabLabel(TabName.MySubmission), // TabName.MySubmission,
            value: "tab2",
            content: (
              <Card
                variant="outlined"
                sx={{
                  boxShadow: "0px 2px 4px 3px #d3d3d3",
                  marginTop: "2%",
                  "& .MuiPaper-root-MuiCard-root": {
                    overflow: "visible", // make card content allow overflow
                  },
                }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab2")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                    MainTable={true}
                    additionalButtons={[
                      {
                        label: "Back",
                        onClick: async () => {
                          back_fn();
                        },
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            ),
          },
        ]),
  ];

  const AssignInterviewPanel = [
    {
      label: getTabLabel(TabName.InterviewpanelL1), //TabName.InterviewpanelL1,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            "& .MuiPaper-root-MuiCard-root": {
              overflow: "visible", // make card content allow overflow
            },
          }}
        >
          <CardContent>
            <BreadcrumbsComponent
              items={tabs("tab1")}
              initialItem={activeTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              MainTable={true}
              additionalButtons={[
                {
                  label: "Back",
                  onClick: async () => {
                    back_fn();
                  },
                },
              ]}
            />
          </CardContent>
        </Card>
      ),
    },
    {
      label: getTabLabel(TabName.InterviewpanelL2), // TabName.InterviewpanelL2,
      value: "tab2",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            "& .MuiPaper-root-MuiCard-root": {
              overflow: "visible", // make card content allow overflow
            },
          }}
        >
          <CardContent>
            <BreadcrumbsComponent
              items={tabs("tab2")}
              initialItem={activeTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              MainTable={true}
              additionalButtons={[
                {
                  label: "Back",
                  onClick: async () => {
                    back_fn();
                  },
                },
              ]}
            />
          </CardContent>
        </Card>
      ),
    },
    {
      label: getTabLabel(TabName.ReschedulInterview), //TabName.ReschedulInterview,
      value: "tab3",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            "& .MuiPaper-root-MuiCard-root": {
              overflow: "visible", // make card content allow overflow
            },
          }}
        >
          <CardContent>
            <BreadcrumbsComponent
              items={tabs("tab3")}
              initialItem={activeTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              MainTable={true}
              additionalButtons={[
                {
                  label: "Back",
                  onClick: async () => {
                    back_fn();
                  },
                },
              ]}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleTabChange = async (newTab: string) => {
    setBreadcrumbTab(newTab);
    await fetchCandidateData(newTab, 5, JobUniqueValue);
    await pendingcountTabs(JobUniqueValue);
  };

  function back_fn() {
    if (props.CurrentRoleID.includes(RoleID.LineManager)) {
      props.navigation("/RecurimentProcess", {
        state: {
          TabName: props.stateValue?.TabNames,
          tab: props.stateValue?.tab,
        },
      });
    } else {
      props.navigation("/ReviewProfileList", {
        state: {
          TabName: props.stateValue?.TabNames,
          tab: props.stateValue?.tab,
        },
      });
    }
  }

  return (
    <>
      <>
        <CustomLoader isLoading={isLoading}>
          <div className="menu-card">
            <React.Fragment>
              {props.stateValue?.TabNames === TabName.AssignInterviewPanel ? (
                <>
                  <TabsComponent
                    tabs={AssignInterviewPanel}
                    initialTab={breadcrumbTab}
                    // tabClassName={"Tab"}
                    tabtype={tabType.Dashboard}
                    onTabChange={handleTabChange}
                    IsNotscroll={true}
                  />
                </>
              ) : (
                <>
                  <TabsComponent
                    tabs={breadcrumbs}
                    initialTab={breadcrumbTab}
                    // tabClassName={"Tab"}
                    tabtype={tabType.Dashboard}
                    onTabChange={handleTabChange}
                    IsNotscroll={true}
                  />
                </>
              )}
            </React.Fragment>
          </div>
        </CustomLoader>
      </>

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

      {CommentsPopups ? (
        <>
          <CommentsPopup
            onClose={() => setCommentsPopup(false)}
            visible={CommentsPopups}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default ReviewCandidateList;
