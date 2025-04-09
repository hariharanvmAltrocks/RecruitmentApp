import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {
  GetPortalJobsService,
  getVRRDetails,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  
  RoleID,
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

  const columnConfig = (
    tab: string,
    ButtonAction: string,
    TabNamed: string
  ) => [
    {
      field: "CandidateID",
      header: "Request ID",
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
      field: "JobGrade",
      header: "Job Code",
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
      field: "",
      header: "Action",
      sortable: false,
      style: { width: "7%" },
      body: (rowData: any) => {
        function handleRedirectView(
          rowData: any,
          tab: string,
          TabNamed: string,
          ButtonAction: string,
          ActionBtn: string
        ): void {
          props.navigation(
            "/ReviewProfileList/ReviewCandidateList/ViewCandidateDetails",
            {
              state: {
                ID: rowData?.CandidateID,
                RecruitmentID: RecruitmentDetails[0].ID,
                tab: tab,
                ButtonAction: ButtonAction,
                TabNamed: TabNamed,
                initialTab: props.stateValue?.TabName,
                ActionBtn: ActionBtn,
              },
            }
          );
        }

        return (
          <div>
            <span>
              {rowData.workflowStatusId === workflowStatusApi.HRRejected ||
              rowData.workflowStatusId ===
                workflowStatusApi.LineManagerLevel1Rejected ||
              rowData.workflowStatusId ===
                workflowStatusApi.LineManagerLevel2Rejected ||
              (props.CurrentRoleID === RoleID.RecruitmentHR &&
                rowData.workflowStatusId ===
                  workflowStatusApi.LineManagerL1Pending) ||
              (props.CurrentRoleID === RoleID.RecruitmentHR &&
                rowData.workflowStatusId ===
                  workflowStatusApi.LineManagerL2Pending) ||
              (props.CurrentRoleID === RoleID.LineManager &&
                rowData.workflowStatusId ===
                  workflowStatusApi.PendingRecruitmentHRscheduleInterview) ||
              (props.CurrentRoleID === RoleID.RecruitmentHR &&
                tab === "tab2") ? (
                <>
                  <img
                    src={require("../../assets/Viewicon.svg")}
                    alt="Stamp Icon"
                    onClick={() =>
                      handleRedirectView(
                        rowData,
                        tab,
                        TabNamed,
                        ButtonAction,
                        "View"
                      )
                    }
                    style={{
                      width: "60%",
                      height: "60%",
                    }}
                  />
                </>
              ) : (
                <>
                  <img
                    src={require("../../assets/Editbutton.svg")}
                    alt="Stamp Icon"
                    onClick={() =>
                      handleRedirectView(
                        rowData,
                        tab,
                        TabNamed,
                        ButtonAction,
                        "Edit"
                      )
                    }
                    style={{
                      width: "60%",
                      height: "60%",
                    }}
                  />
                </>
              )}
            </span>
          </div>
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

  const fetchCandidateData = async (tabs: string) => {
    setIsLoading(true);
    try {
      let FilterValueData: GetProfileByFilter = {
        filterValue: "",
        sortBy: "",
        sortOrder: 0,
        pageSize: rows,
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
          if (props.stateValue?.TabName === TabName.AssignInterviewPanel) {
            FilterValue = createFilter([
              workflowStatusApi.PendingRecruitmentHRscheduleInterview,
            ]);
          } else if (props.CurrentRoleID === RoleID.LineManager) {
            FilterValue = createFilter([
              workflowStatusApi.LineManagerL1Pending,
            ]);
          } else {
            FilterValue = createFilter([workflowStatusApi.HRPending]);
          }
          break;

        case "tab2":
          if (props.CurrentRoleID === RoleID.LineManager) {
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
            ]);
          }
          break;

        case "tab2 - Level 2":
          if (props.CurrentRoleID === RoleID.LineManager) {
            FilterValue = createFilter([
              workflowStatusApi.LineManagerL2Pending,
            ]);
          }
          break;

        case "tab3":
          if (props.CurrentRoleID === RoleID.LineManager) {
            FilterValue = createFilter([
              workflowStatusApi.LineManagerLevel1OnHold,
              workflowStatusApi.LineManagerLevel2OnHold,
            ]);
          } else {
            FilterValue = createFilter([workflowStatusApi.HROnHold]);
          }
          break;

        case "tab4":
          if (props.CurrentRoleID === RoleID.LineManager) {
            FilterValue = createFilter([
              workflowStatusApi.LineManagerLevel1Rejected,
              workflowStatusApi.LineManagerLevel2Rejected,
            ]);
          } else {
            FilterValue = createFilter([workflowStatusApi.HRRejected]);
          }
          //   FilterValue = createFilter(workflowStatusApi.Rejected);
          break;

        default:
          FilterValue = createFilter([]);
      }

      await GetPortalJobsService.getCandidateDetailsInJobCode(FilterValue)
        .then((res) => {
          setCandidateData(res.data);
        })
        .catch((error) => {
          console.log("Candidate details doesn't fetch the data", error);
        });
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
      await fetchRecuritmentData();
      await fetchCandidateData(breadcrumbTab);
    };
    void fetchData();
  }, [rows, breadcrumbTab]);

  const onPageChange = (event: any) => {
    // setFirst(event.first);
    setRows(event.rows);
  };

  const handleRefresh = (tab: string) => {
    setBreadcrumbTab(tab);
    void fetchCandidateData(tab);
  };

  const tabs = (tab: string) => [
    {
      label: TabName.ViewCandidateDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <ReviewProfileDatatable
              data={CandidateData ?? []}
              columns={columnConfig(tab, "View", TabName.ReviewProfile)}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh(tab)}
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
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
        return newTabNames;
      });
    } else {
      setTabNameData(() => {
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

  const breadcrumbs = [
    ...(props.CurrentRoleID === RoleID.LineManager
      ? [
          {
            label: TabName.ReviewLevel1,
            value: "tab1",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab1")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
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
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab2 - Level 2")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
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
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab2")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: TabName.onHold,
            value: "tab3",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab3")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: TabName.Rejected,
            value: "tab4",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab4")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
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
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab1")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
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
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <BreadcrumbsComponent
                    items={tabs("tab2")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
                  />
                </CardContent>
              </Card>
            ),
          },
        ]),
  ];
  const handleTabChange = (newTab: string) => {
    setBreadcrumbTab(newTab);
  };
  return (
    <>
      <>
        <CustomLoader isLoading={isLoading}>
          <div className="menu-card">
            <React.Fragment>
              {props.stateValue?.TabName === TabName.AssignInterviewPanel ? (
                <>
                  <BreadcrumbsComponent
                    items={tabs("tab1")}
                    initialItem={activeTab}
                    TabName={TabNameData}
                    onBreadcrumbChange={handleBreadcrumbChange}
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
