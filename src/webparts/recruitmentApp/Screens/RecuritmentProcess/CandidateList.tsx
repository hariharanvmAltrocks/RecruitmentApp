import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { getVRRDetails, InterviewServices } from "../../Services/ServiceExport";
// import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  GridStatusBackgroundcolor,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  RoleID,
  TabName,
} from "../../utilities/Config";

import BreadcrumbsComponent, {
  type TabNameData,
} from "../../components/CustomBreadcrumps";
import { AssignPositionDialog } from "./AssignPositionDialog";
import { AssignPositionID } from "../../Services/InterviewProcess/IInterviewProcessService";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { alertPropsData } from "../../Models/Screens";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";

const CandidateList = (props: any) => {
  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState(null);
  const [candidateID, setCandidateID] = React.useState<number>(0);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  const jobCode = props?.stateValue?.JobCode?.toString().trim();
  const ID = props?.stateValue?.ID?.toString().trim();
  const Status = props?.stateValue?.Status;
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string,
    previousTabName: string
  ) {
    switch (props.CurrentRoleID) {
      case RoleID.HOD:
        // eslint-disable-next-line no-lone-blocks
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
    // { field: "JobCode", header: "Job Code", sortable: true },
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
                  console.log(rowData.RequirementID);
                  console.log("rowData3", rowData);
                  setCandidateID(rowData.ID);
                  const positionOptions =
                    rowData.PositionData?.map((pos: any) => ({
                      id: pos.PositionID,
                      label: pos.PositionID,
                    })) || [];

                  setSelectedCandidate({
                    ...rowData,
                    positionOptions,
                  });

                  setShowAssignModal(true);
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
  const fetchCandidateData = async () => {
    if (!jobCode || !ID) {
      console.error("JobCode or ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const filterConditions = [
        { FilterKey: "JobCode", Operator: "eq", FilterValue: jobCode },
        { FilterKey: "ID", Operator: "eq", FilterValue: ID }, // Filtering by ID
      ];

      const response =
        await InterviewServices.GetCombinedCandidatePositionDetails(
          " ",
          filterConditions
        );

      if (response?.status === 200 && response?.data?.length) {
        const filteredCandidates = response.data
          .filter(
            (candidate: any) =>
              candidate.JobCode?.toString().trim() === jobCode &&
              candidate.RecruitmentID?.toString().trim() === ID &&
              (candidate.Status ===
                "Pending with HOD to select the candidate" ||
                candidate.Status === "Selected")
          )
          .map((candidate: any) => ({
            ...candidate,
            // Status: Status || candidate.Status,
          }));

        setCandidateData(filteredCandidates);
      } else {
        setCandidateData([]);
        console.warn("No matching candidates found.");
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      setCandidateData([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (jobCode) {
      fetchCandidateData().catch((error) =>
        console.error("Error in fetching candidate data:", error)
      );
    }
  }, [jobCode, Status]);

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
    positionId: string;
    justification: string;
  }) => {
    console.log("Assigned Position Data:", data);
    let filterConditions = [];
    let Conditions = "";
    filterConditions.push({
      FilterKey: "PositionID",
      Operator: "eq",
      FilterValue: data.positionId,
    });
    const GetPositionID = await getVRRDetails.GetDataInList(
      ListNames.HRMSPositionIDMaster,
      filterConditions,
      Conditions,
      "*,JobCode/JobCode",
      "JobCode"
    );
    console.log(GetPositionID, "GetPositionID");

    let obj: AssignPositionID = {
      PositionIDId: GetPositionID.data[0].ID,
      CandidateIDId: candidateID,
      RecruitmentIDId: props.stateValue.ID,
    };
    await InterviewServices.AssignPositionID(
      obj,
      ListNames.HRMSSelectedCandidateDetailsByHOD
    )
      .then((res) => {
        console.log(res, "PositionID Assign Candidate");
        if (res.status === 200) {
          setIsLoading(true);
          let CancelAlert = {
            Message: RecuritmentHRMsg.PositionIDassigned,
            Type: HRMSAlertOptions.Success,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                setShowAssignModal(false);
                setAlertPopupOpen(false);
              }
            },
          };

          setAlertPopupOpen(true);
          setalertProps(CancelAlert);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("Error in Post the Candidate Assign Api", error);
      });
    setShowAssignModal(false);
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
        onAssign={handleAssignPosition} // Ensure this is passed correctly
      />
      {AlertPopupOpen ? (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      ) : null}
    </CustomLoader>
  );
};

export default CandidateList;
