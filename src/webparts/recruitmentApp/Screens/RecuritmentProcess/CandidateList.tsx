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
  ListNames,
  RecuritmentHRMsg,
  RoleID,
  StatusId,
  TabName,
  WorkflowAction,
  workflowStatusApi,
} from "../../utilities/Config";
import BreadcrumbsComponent, {
  type TabNameData,
} from "../../components/CustomBreadcrumps";
import {
  alertPropsData,
  AutoCompleteItem,
} from "../../Models/Screens";
import CandidateDataTable from "../../components/CandidateDataTable";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

const CandidateList = (props: any) => {
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
  const [positionData, setPositionData] = React.useState<AutoCompleteItem[]>([]);

  const fetchPositionData = async () => {
    setIsLoading(true);
    const filterConditions = [
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
      {
        FilterKey: "PositionIDStatus",
        Operator: "eq",
        FilterValue: "Vacant",
      },
    ];
    try {
      const response = await InterviewServices.GetHRMSPositionDetails(filterConditions, "and");
      setPositionData(response?.data || []);
    } catch {
      setPositionData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      if (!props?.stateValue?.JobCode || !props?.stateValue?.ID) return;

      const vrrResponse = await getVRRDetails.GetRecruitmentDetails([
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.ID,
        },
      ], "");

      const grade = vrrResponse.data[0]?.PatersonGrade;
      const gradeLevelResponse = await CommonServices.GetGradeLevel(grade);
      const level = gradeLevelResponse.data[0]?.Level;

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

      const response = await InterviewServices.GetCombinedCandidatePositionDetails(
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
    void fetchAllData();
    if (props.stateValue.StatusId === StatusId.Selected) {
      void fetchPositionData();
    }
  }, [props?.stateValue?.JobCode, props?.stateValue?.ID]);

  const handleRedirectView = (
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string,
    previousTabName: string
  ) => {
    if (props.CurrentRoleID === RoleID.HOD && tab === "tab1") {
      props.navigation("/RecurimentProcess/HodViewScorecard", {
        state: {
          ID: rowData?.ID,
          tab,
          StatusId: rowData?.StatusId,
          Status: rowData?.Status,
          PreviousTabName: previousTabName,
          TabName,
          ButtonAction,
          positionData,
          InterviewLevel: rowData?.InterviewLevel,
          RecruitmentID: rowData?.RecruitmentID,
        },
      });
    }
  };

  const columnConfig = (
    tab: string,
    ButtonAction: string,
    TabName: string,
    previousTabName: string
  ) => [
    { field: "Checkbox", header: "", sortable: false },
    { field: "ID", header: "Candidate ID", sortable: true },
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
          <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
            {canEdit && (
              <img
                src={require("../../assets/Editbutton.svg")}
                alt="Edit Icon"
                onClick={() =>
                  handleRedirectView(rowData, tab, TabName, ButtonAction, previousTabName)
                }
                style={{ width: "70%", height: "60%", cursor: "pointer" }}
              />
            )}
            {canView && (
              <img
                src={require("../../assets/Viewicon.svg")}
                alt="View Icon"
                onClick={() =>
                  handleRedirectView(rowData, tab, TabName, ButtonAction, previousTabName)
                }
                style={{ width: "70%", height: "60%", cursor: "pointer" }}
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
    let updateSuccess = false;

    for (const candidate of selectedCandidates) {
      const rejectionPayload = {
        workflowStatus: workflowStatusApi.CandidateRejectedIPanel,
        jobRequestId: Number(candidate.JobRequestID),
        comments: candidate.Comments || "",
        actionBy: props.CurrentUserRole,
      };

      const actionPayload = {
        ActionId: WorkflowAction.Reject,
        Id: candidate.ID,
        ItemCreated: "Yes",
        Comments: candidate.Comments || "",
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
  };

  const tabs = [
    {
      label: TabName.ViewCandidateList,
      value: "tab1",
      content: (
        <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", mt: 2 }}>
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
              handleRefresh={fetchAllData}
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
      {AlertPopupOpen && (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      )}
    </CustomLoader>
  );
};

export default CandidateList;
