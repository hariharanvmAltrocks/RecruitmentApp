import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {
  GetPortalJobsService,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  // ListNames,
  RoleID,
  StatusId,
  TabName,
  WorkflowAction,
  workflowStatusApi,
  // WorkflowAction,
  // workflowStatusApi,
} from "../../utilities/Config";
import BreadcrumbsComponent, {
  type TabNameData,
} from "../../components/CustomBreadcrumps";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CandidateDataTable from "../../components/CandidateDataTable";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
const CandidateList = (props: any) => {
  console.log("CandidateList props:", props);
  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [positionData, setPositionData] = React.useState<AutoCompleteItem[]>(
    []
  );

  const fetchPositionData = () => {
    setIsLoading(true);

    let filterConditions = [
      {
        FilterKey: "JobCode",
        Operator: "eq",
        FilterValue: props.stateValue.JobCodeId,
      },
      {
        FilterKey: "Department",
        Operator: "eq",
        FilterValue: props.stateValue.Department,
      },
    ];

    filterConditions.push({
      FilterKey: "PositionIDStatus",
      Operator: "eq",
      FilterValue: "Vacant",
    });

    let Conditions = "and";

    InterviewServices.GetHRMSPositionDetails(filterConditions, Conditions)
      .then((response) => {
        console.log("Fetched position data:", response.data);
        if (response && response.data) {
          setPositionData(response.data);
          console.log("Fetched position data:", positionData);
        } else {
          setPositionData([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setPositionData([]);
      });
  };
  React.useEffect(() => {
    if (props.stateValue.JobCodeId && props.stateValue.Department) {
      fetchPositionData();
    }
  }, [props.stateValue.JobCodeId, props.stateValue.Department]);
  const fetchCandidateData = async () => {
    setIsLoading(true);
    try {
      let filterConditions = [];
      const Conditions = "and";
      filterConditions.push({
        FilterKey: "RecruitmentIDId",
        Operator: "eq",
        FilterValue: props?.stateValue?.ID,
      });

      filterConditions.push({
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
      });
      filterConditions.push({
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: "No",
      });
      const response =
        await InterviewServices.GetCombinedCandidatePositionDetails(
          filterConditions,
          Conditions,
          props.EmployeeList
        );
      console.log(response);
      if (response?.status === 200 && Array.isArray(response.data)) {
        setCandidateData(response.data);
      } else {
        setCandidateData([]);
      }
    } catch (error) {
      console.error(error);
      setCandidateData([]);
    } finally {
      setIsLoading(false);
    }
  };

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string,
    previousTabName: string
  ) {
    switch (props.CurrentRoleID) {
      case RoleID.HOD:
        {
          if (tab === "tab1") {
            props.navigation("/RecurimentProcess/HodViewScorecard", {
              state: {
                ID: rowData?.ID,
                tab,
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                PreviousTabName: previousTabName,
                TabName: TabName,
                ButtonAction,
                positionData,
                InterviewLevel: rowData?.InterviewLevel,
              },
            });
          }
        }
        break;
    }
  }
  React.useEffect(() => {
    if (props.stateValue.StatusId === StatusId.Selected) {
      void fetchPositionData();
    }
  }, [props.stateValue?.StatusId]);

  const columnConfig = (
    tab: string,
    ButtonAction: string,
    TabName: string,
    previousTabName: string
  ) => [
    {
      field: "Checkbox",
      header: "",
      sortable: false,
    },
    { field: "ID", header: "Candidate ID", sortable: true },
    { field: "FullName", header: "Applicant Name", sortable: true },
    { field: "PositionTitle", header: "Position Title", sortable: true },
    { field: "JobGrade", header: "Job Grade", sortable: true },
    { field: "GPA", header: "GPA", sortable: true },
    { field: "InterviewLevel", header: "InterviewLevels", sortable: true },
    {
      field: "Status",
      header: "Status",
      sortable: false,
      body: (rowData: any) => {
        return <span>{rowData.Status}</span>;
      },
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
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
            {(rowData.StatusId === StatusId.Selected ||
              rowData.StatusId === StatusId.OnHoldbyHOD ||
              rowData.StatusId ===
                StatusId.PendingwithHODtoselectthecandidate ||
              rowData.StatusId ===
                StatusId.PendingwithHODtoselectthecandidateLevel2 ||
              rowData.StatusId ===
                StatusId.PendingwithHODtoAssignPositionID) && (
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
                  width: "70%",
                  height: "60%",
                  cursor: "pointer",
                }}
              />
            )}
            {rowData.StatusId === StatusId.RejectedbyHOD && (
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
                  width: "70%",
                  height: "60%",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (props?.stateValue?.JobCode) {
          await fetchCandidateData();
        }
      } catch (error) {
        console.error(error);
      }
    };

    void fetchData();
  }, [props?.stateValue?.JobCode, props?.stateValue?.ID]);

  const onPageChange = (event: any) => {
    setRows(event.rows);
  };

  const handleStatusChange = async (selectedCandidates: any[]) => {
    let updateSuccess = false;

    for (const candidate of selectedCandidates) {
      const rejectionPayload = {
        workflowStatus: workflowStatusApi.CandidateRejectedIPanel,
        jobRequestId: Number(candidate.JobRequestID),
        comments: candidate.Comments || "", // Include comments here
        actionBy: props.CurrentUserRole,
      };

      const actionPayload = {
        ActionId: WorkflowAction.Reject,
        Id: candidate.ID,
        ItemCreated: "Yes",
        Comments: candidate.Comments || "", // Include comments in the action payload
      };

      try {
        // Update the candidate status with comments
        await GetPortalJobsService.UpdateCandidateStatus(rejectionPayload);

        // Update the list item in HRMSRecruitmentCandidatePersonalDetails
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
            await fetchCandidateData();
          }
        },
      });
      setAlertPopupOpen(true);
    } else {
      await fetchCandidateData();
    }
  };
  const tabs = [
    {
      label: TabName.ViewCandidateList,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <CandidateDataTable
              data={CandidateData}
              columns={columnConfig(
                "tab1",
                "Edit",
                props.stateValue?.TabName,
                TabName.ViewCandidateList
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={fetchCandidateData}
              onStatusChange={handleStatusChange}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleBreadcrumbChange = (newItem: string) => {
    setActiveTab(newItem);
  };

  React.useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);

    if (activeTab === "tab1") {
      const newTabNames = [
        { tabName: props.stateValue?.TabName },
        { tabName: props.stateValue?.ButtonAction },
        { tabName: activeTabObj?.label },
      ];

      if (JSON.stringify(TabNameData) !== JSON.stringify(newTabNames)) {
        setTabNameData(newTabNames);
      }
    }
  }, [activeTab, tabs, props.stateValue, TabNameData]);
  return (
    <CustomLoader isLoading={isLoading}>
      <div className="menu-card">
        <BreadcrumbsComponent
          items={tabs}
          initialItem={activeTab}
          TabName={TabNameData}
          onBreadcrumbChange={handleBreadcrumbChange}
        />
      </div>

      {AlertPopupOpen ? (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      ) : null}
    </CustomLoader>
  );
};

export default CandidateList;
