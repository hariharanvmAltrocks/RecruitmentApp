import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {
  GetPortalJobsService,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  ButtonAction,
  HRMSAlertOptions,
  RoleID,
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
  const [pagination, setPagination] = React.useState({
    first: 0,
    rows: rows,
    totalPages: 1,
  });

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabNamed: string,
    ButtonAction: string,
    PreActionBtn: string
  ): void {
    console.log("RecruitmentDetails", RecruitmentDetails);

    const today = new Date();
    today.setDate(today.getDate() + 1);
    const todayDateStr = today.toDateString();

    const {
      JobPostingEndDate,
      JobPostingFirstExtensionEndDate,
      JobPostingSecondExtensionEndDate,
      ID: RecruitmentID,
    } = RecruitmentDetails[0] || {};

    let JobValidation = false;

    if (JobPostingSecondExtensionEndDate) {
      JobValidation =
        new Date(JobPostingSecondExtensionEndDate).toDateString() ===
        todayDateStr;
    } else if (JobPostingFirstExtensionEndDate) {
      JobValidation =
        new Date(JobPostingFirstExtensionEndDate).toDateString() ===
        todayDateStr;
    } else if (JobPostingEndDate) {
      JobValidation =
        new Date(JobPostingEndDate).toDateString() === todayDateStr;
    }
    let ScreenNavigation = props.CurrentRoleID.includes(RoleID.LineManager)
      ? "/RecurimentProcess/ReviewCandidateList/ViewCandidateDetails"
      : "/ReviewProfileList/ReviewCandidateList/ViewCandidateDetails";
    if (tab === "tab2 - Level 2") {
      if (JobValidation) {
        props.navigation(ScreenNavigation, {
          state: {
            ID: rowData?.CandidateID,
            StatusId: rowData?.workflowStatusId,
            RecruitmentID,
            tab,
            ButtonAction,
            TabNamed,
            JobCodeID: props.stateValue?.JobCodeID,
            initialTab: props.stateValue?.TabNames,
            PreActionBtn,
          },
        });
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
          ButtonAction,
          TabNamed,
          initialTab: props.stateValue?.TabNames,
          PreActionBtn,
        },
      });
    }
  }

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
        return <span>{rowData.Status}</span>;
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
                  workflowStatusApi.PendingRecruitmentHRscheduleInterview) ? (
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
                      width: "2rem", // scales with font size
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

  const fetchCandidateData = async (tabs: string, row?: number) => {
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
          jobCode: props.stateValue?.JobCode, //"JC0005",
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
      await fetchRecuritmentData();
      await fetchCandidateData(breadcrumbTab);
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
    void fetchCandidateData(breadcrumbTab, PageItem);
  };
  const handleRefresh = (tab: string) => {
    setBreadcrumbTab(tab);
    void fetchCandidateData(tab);
    void fetchRecuritmentData();
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

  const breadcrumbs = [
    ...(props.CurrentRoleID.includes(RoleID.LineManager)
      ? [
          {
            label: TabName.ReviewLevel1,
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
            label: TabName.ReviewLevel2,
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
            label: TabName.Shortlisted,
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
            label: TabName.OnHoldRejected,
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
            label: TabName.ReviewProfile,
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
            label: TabName.MySubmission,
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
      label: TabName.InterviewpanelL1,
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
      label: TabName.InterviewpanelL2,
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
      label: TabName.ReschedulInterview,
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
    await fetchCandidateData(newTab);
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
