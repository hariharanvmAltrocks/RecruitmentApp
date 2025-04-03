import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { getVRRDetails, InterviewServices } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  GridStatusBackgroundcolor,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  RoleID,
  StatusId,
  TabName,
} from "../../utilities/Config";

import BreadcrumbsComponent, {
  type TabNameData,
} from "../../components/CustomBreadcrumps";
import { AssignPositionDialog } from "./AssignPositionDialog";
import { AssignPositionID } from "../../Services/InterviewProcess/IInterviewProcessService";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import {
  alertPropsData,
  AutoCompleteItem,
  SelectedCandidateData,
} from "../../Models/Screens";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import SPServices from "../../Services/SPService/SPServices";

const CandidateList = (props: any) => {
  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [showAssignModal, setShowAssignModal] = React.useState(false);

  const [selectedCandidate, setSelectedCandidate] =
    React.useState<SelectedCandidateData>({
      FullName: "",
      PositionTitle: "",
      JobCode: "",
      Comments: "",
    });

  const [candidateID, setCandidateID] = React.useState<number>(0);
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
        if (response && response.data) {
          setPositionData(response.data);
        } else {
          setPositionData([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setPositionData([]);
      });
  };

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
          Conditions
        );

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
              },
            });
          }
        }
        break;
    }
  }

  const handleAssignClick = async (rowData: any) => {
    setIsLoading(true);
    try {
      await fetchPositionData();
      setCandidateID(rowData.ID);
      setSelectedCandidate({ ...rowData });
      setShowAssignModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    {
      field: "Status",
      header: "Status",
      sortable: false,
      body: (rowData: any) => {
        return (
          <span
            style={{
              backgroundColor:
                rowData.Status.includes("Pending") === true
                  ? GridStatusBackgroundcolor.Pending
                  : rowData.Status.includes("Selected") === true
                  ? GridStatusBackgroundcolor.CompletedOrApproved
                  : "",
            }}
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
            {rowData.Status === "Selected" ? (
              <img
                src={require("../../assets/AssignPositionID.svg")}
                alt="Stamp Icon"
                onClick={() => {
                  void handleAssignClick(rowData);
                }}
                style={{
                  width: "70%",
                  height: "60%",
                }}
              />
            ) : (
              <>
                <img
                  src={require("../../assets/Editbutton.svg")}
                  alt="Stamp Icon"
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
                  }}
                />
              </>
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

  const tabs = [
    {
      label: TabName.ViewCandiadteDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <ReviewProfileDatatable
              data={CandidateData}
              columns={columnConfig(
                "tab1",
                "Edit",
                props.stateValue?.TabName,
                TabName.ViewCandiadteDetails
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={fetchCandidateData}
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

  const handleAssignPosition = async (data: {
    positionId: AutoCompleteItem | null;
    Reasons: string;
  }) => {
    if (!data.positionId) {
      return;
    }
    const positionIdString =
      typeof data.positionId === "string"
        ? data.positionId
        : (data.positionId as any).key || (data.positionId as any).text;
    if (!positionIdString) {
      return;
    }
    setIsLoading(true);
    try {
      const filterConditions = [
        {
          FilterKey: "PositionID",
          Operator: "eq",
          FilterValue: data.positionId.text,
        },
      ];

      const GetPositionID = await getVRRDetails.GetDataInList(
        ListNames.HRMSPositionIDMaster,
        filterConditions,
        "",
        "*,JobCode/JobCode",
        "JobCode"
      );
      if (!GetPositionID.data || GetPositionID.data.length === 0) {
        setIsLoading(false);
        return;
      }
      const selectedPosition = GetPositionID.data[0];

      let assignPositionPayload: AssignPositionID = {
        PositionIDId: selectedPosition.ID,
        CandidateIDId: candidateID,
        RecruitmentIDId: props.stateValue.ID,
      };

      const res = await InterviewServices.AssignPositionID(
        assignPositionPayload,
        ListNames.HRMSSelectedCandidateDetailsByHOD
      );

      if (res.status === 200) {
        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSPositionIDMaster,
          RequestJSON: { PositionIDStatus: "Recruitment InProgress" },
          ID: selectedPosition.ID,
        });

        setalertProps({
          Message: RecuritmentHRMsg.PositionIDassigned,
          Type: HRMSAlertOptions.Success,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              setShowAssignModal(false);
              setAlertPopupOpen(false);
              await fetchCandidateData();
            }
          },
        });

        setAlertPopupOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <AssignPositionDialog
        visible={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        candidateData={selectedCandidate}
        AssignOption={positionData}
        onAssign={handleAssignPosition}
      />
      {AlertPopupOpen ? (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      ) : null}
    </CustomLoader>
  );
};

export default CandidateList;
