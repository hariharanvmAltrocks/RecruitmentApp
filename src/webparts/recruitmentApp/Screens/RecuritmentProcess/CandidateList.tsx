import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  HRMSAlertOptions,
  InterviewLevels,
  ListNames,
  RecuritmentHRMsg,
  RoleID,
  RoleName,
  StatusId,
  TabName,
  tabType,
  WorkflowAction,
  workflowStatusApi,
} from "../../utilities/Config";
import BreadcrumbsComponent, {
  type TabNameData,
} from "../../components/CustomBreadcrumps";
import { alertPropsData } from "../../Models/Screens";
import CandidateDataTable from "../../components/CandidateDataTable";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import TabsComponent from "../../components/TabsComponent ";
import { tabStyle } from "../../components/TabMerge";
import { ButtonAction } from "../../utilities/LabelName";

const CandidateList = (props: any) => {
  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [breadcrumbTab, setBreadcrumbTab] = React.useState<string>("tab1");
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      if (!props?.stateValue?.JobCode || !props?.stateValue?.ID) return;

      const vrrResponse = await getVRRDetails.GetRecruitmentDetails(
        [
          {
            FilterKey: "ID",
            Operator: "eq",
            FilterValue: props.stateValue?.ID,
          },
        ],
        ""
      );

      const grade = vrrResponse.data[0]?.PatersonGrade;
      const gradeLevelResponse = await CommonServices.GetGradeLevel(grade);
      const level =
        gradeLevelResponse.data[0]?.Level === InterviewLevels.Level2
          ? InterviewLevels.Levels2
          : gradeLevelResponse.data[0]?.Level;

      const candidateFilter = [
        {
          FilterKey: "RecruitmentIDId",
          Operator: "eq",
          FilterValue: props?.stateValue?.ID,
        },
        {
          FilterKey: "StatusId",
          Operator: "in",
          FilterValue: [
            StatusId.PendingwithHODtoselectthecandidate,
            StatusId.Selected,
            StatusId.OnHoldbyHOD,
            StatusId.RejectedbyHOD,
            StatusId.PendingwithHODtoAssignPositionID,
            StatusId.PendingwithHODtoselectthecandidateLevel2,
          ],
        },
        {
          FilterKey: "ItemCreated",
          Operator: "eq",
          FilterValue: "No",
        },
      ];

      const response =
        await InterviewServices.GetCombinedCandidatePositionDetails(
          candidateFilter,
          "and",
          props.EmployeeList
        );

      if (response?.status === 200) {
        const enrichedData = response.data.map((item: any) => ({
          ...item,
          Grade: grade,
          InterviewLevel: level,
        }));
        setCandidateData(enrichedData);
      } else {
        setCandidateData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCandidateData([]);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    if (props?.stateValue?.JobCode && props?.stateValue?.ID) {
      void fetchAllData();
    }
  }, [props?.stateValue?.JobCode, props?.stateValue?.ID]);

  const handleRedirectView = (
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string,
    previousTabName: string
  ) => {
    let SelectedCandidate = CandidateData.filter(
      (item) => item.StatusId === StatusId.Selected
    );
    const canView = rowData.StatusId === StatusId.RejectedbyHOD;
    if (
      props.stateValue.NoOfPosition <= SelectedCandidate?.length &&
      rowData.StatusId !== StatusId.Selected &&
      !canView
    ) {
      let ErrorMsg = {
        Message: RecuritmentHRMsg.SelectedCandidateValidation,
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
      setalertProps(ErrorMsg);
      setIsLoading(false);
    } else {
      if (props.CurrentRoleID.includes(RoleID.HOD) && tab === "tab1") {
        props.navigation("/RecurimentProcess/HodViewScorecard", {
          state: {
            ID: rowData?.ID,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            PreviousTabName: previousTabName,
            TabName,
            ButtonAction,
            InterviewLevel: rowData?.InterviewLevel,
            RecruitmentID: rowData?.RecruitmentID,
            JobCodeID: props.stateValue.JobCodeID,
            Department: props.stateValue.Department,
            GPA: rowData.GPA,
            NoOfPosition: props.stateValue.NoOfPosition,
          },
        });
      }
    }
  };

  const columnConfig = (
    tab: string,
    ButtonAction: string,
    TabName: string,
    previousTabName: string
  ) => [
    { field: "Checkbox", header: "", sortable: false },
    { field: "SNO", header: "S.NO", sortable: true },
    { field: "FullName", header: "Applicant Name", sortable: true },
    { field: "PositionTitle", header: "Position Title", sortable: true },
    { field: "InterviewLevel", header: "Interview Levels", sortable: true },
    { field: "Grade", header: "Grade", sortable: true },
    { field: "GPA", header: "GPA", sortable: true },
    {
      field: "Status",
      header: "Status",
      sortable: false,
      body: (rowData: any) => <span>{rowData.Status}</span>,
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
      body: (rowData: any) => {
        const canEdit = [
          StatusId.Selected,
          StatusId.OnHoldbyHOD,
          StatusId.PendingwithHODtoselectthecandidate,
          StatusId.PendingwithHODtoselectthecandidateLevel2,
          StatusId.PendingwithHODtoAssignPositionID,
        ].includes(rowData.StatusId);

        const canView = rowData.StatusId === StatusId.RejectedbyHOD;

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
            {canEdit && (
              <img
                src={require("../../assets/Editbutton.svg")}
                alt="Edit Icon"
                onClick={() =>
                  handleRedirectView(
                    rowData,
                    tab,
                    TabName,
                    ButtonAction,
                    previousTabName
                  )
                }
                style={{
                  width: "50%",
                  height: "auto",
                  maxWidth: "40px",
                  cursor: "pointer",
                }}
              />
            )}
            {canView && (
              <img
                src={require("../../assets/Viewicon.svg")}
                alt="View Icon"
                onClick={() =>
                  handleRedirectView(
                    rowData,
                    tab,
                    TabName,
                    ButtonAction,
                    previousTabName
                  )
                }
                style={{
                  width: "50%",
                  height: "auto",
                  maxWidth: "40px",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const onPageChange = (event: any) => {
    setRows(event.rows);
  };

  const handleStatusChange = async (selectedCandidates: any[]) => {
    setIsLoading(true);
    let updateSuccess = false;
    let InterviewedCount =
      await InterviewServices.GetCandidateDetailsInterviewPanalDashboard(
        [
          {
            FilterKey: "JobCode",
            Operator: "eq",
            FilterValue: props?.stateValue?.JobCodeID,
          },
        ],
        ""
      );
    for (const candidate of selectedCandidates) {
      const rejectionPayload = {
        workflowStatus: workflowStatusApi.CandidateRejectedIPanel,
        jobRequestId: Number(candidate.JobRequestID),
        comments: candidate.Comments || "",
        actionBy: RoleName.HOD,
      };

      const actionPayload = {
        ActionId: WorkflowAction.Reject,
        Id: candidate.ID,
        ItemCreated: "Yes",
        Comments: candidate.Comments || "",
        GPA: candidate.GPA,
        OthersInterviewed: InterviewedCount?.length > 1 ? "Yes" : "No",
      };

      try {
        await GetPortalJobsService.UpdateCandidateStatus(rejectionPayload);
        const response = await InterviewServices.CandidateSeletionApi(
          actionPayload,
          ListNames.HRMSRecruitmentCandidatePersonalDetails
        );
        if (response.status === 200) {
          updateSuccess = true;
        }
      } catch (err) {
        console.error(`Error rejecting candidate ID: ${candidate.ID}`, err);
      }
    }

    if (updateSuccess) {
      setalertProps({
        Message: RecuritmentHRMsg.PositionIDassigned,
        Type: HRMSAlertOptions.Success,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
            await fetchAllData();
          }
        },
      });
      setAlertPopupOpen(true);
    } else {
      await fetchAllData();
    }

    setIsLoading(false); // Stop loader
  };

  const handleBreadcrumbChange = (newItem: string) => {
    setBreadcrumbTab(newItem);
  };

  const tab = (tab: string) => [
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
            <CandidateDataTable
              data={CandidateData}
              columns={columnConfig(
                "tab1",
                ButtonAction.Edit,
                props.stateValue?.TabName,
                TabName.ViewCandidateList
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={fetchAllData}
              onStatusChange={handleStatusChange}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  const getTabLabel = (tab: any) => {
    const PendingCount = CandidateData.filter(
      (item) =>
        // item.StatusId === StatusId.Selected ||
        item.StatusId === StatusId.OnHoldbyHOD ||
        item.StatusId === StatusId.PendingwithHODtoAssignPositionID ||
        item.StatusId === StatusId.PendingwithHODtoselectthecandidateLevel2 ||
        item.StatusId === StatusId.PendingwithHODtoselectthecandidate
    );
    switch (tab) {
      case TabName.ReviewScorecard:
        return tabStyle(tab, PendingCount.length);
      default:
        return tab;
    }
  };

  const tabs = [
    {
      label: getTabLabel(TabName.ReviewScorecard), //TabName.ReviewScorecard,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", mt: 2 }}
        >
          <CardContent>
            <BreadcrumbsComponent
              items={tab("tab1")}
              initialItem={breadcrumbTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              additionalButtons={[
                {
                  label: ButtonAction.Back,
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

  React.useEffect(() => {
    // const activeTabObj = tabs.find((item) => item.value === activeTab);
    const newTabNames = [
      { tabName: props.stateValue?.TabName },
      // { tabName: props.stateValue?.ButtonAction },
      { tabName: TabName.ViewCandidateList }, //activeTabObj?.label },
    ];
    if (JSON.stringify(TabNameData) !== JSON.stringify(newTabNames)) {
      setTabNameData(newTabNames);
    }
  }, [activeTab, tabs, props.stateValue, TabNameData]);

  function back_fn() {
    props.navigation("/RecurimentProcess", {
      state: {
        TabName: props.stateValue?.TabName,
        tab: props.stateValue?.tab,
      },
    });
  }

  const handleTabChange = async (newTab: string) => {
    setActiveTab(newTab);
    // await fetchCandidateData(newTab);
    // await pendingcountTabs();
  };

  return (
    <CustomLoader isLoading={isLoading}>
      <div className="menu-card">
        <TabsComponent
          tabs={tabs}
          initialTab={activeTab}
          // tabClassName={"Tab"}
          tabtype={tabType.Dashboard}
          onTabChange={handleTabChange}
          IsNotscroll={true}
        />
      </div>
      {AlertPopupOpen && (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      )}
    </CustomLoader>
  );
};

export default CandidateList;
