import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {
  CommonServices,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import {
  // GridStatusBackgroundcolor,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  RoleID,
  StatusId,
} from "../../utilities/Config";
import { TabName } from "../../utilities/Config";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

const InterviewPanelList = (props: any) => {
  console.log("props", props);
  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  // function handleRedirectView(
  //   rowData: any,
  //   tab: string,
  //   TabName: string,
  //   ButtonAction: string
  // ) {
  //   if (tab === "tab1") {
  //     if (props.CurrentRoleID === RoleID.RecruitmentHR) {
  //       props.navigation(
  //         "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit",
  //         {
  //           state: {
  //             ID: rowData?.ID,
  //             tab,
  //             StatusId: rowData?.StatusId,
  //             Status: rowData?.Status,
  //             TabName: TabName,
  //             ButtonAction,
  //           },
  //         }
  //       );
  //     } else if (props.CurrentRoleID === RoleID.HOD) {
  //       props.navigation(
  //         "/RecurimentProcess/InterviewPanelList/InterviewPanelEdit",
  //         {
  //           state: {
  //             ID: rowData?.ID,
  //             tab,
  //             StatusId: rowData?.StatusId,
  //             Status: rowData?.Status,
  //             TabName: TabName,
  //             ButtonAction,
  //           },
  //         }
  //       );
  //     } else if (props.CurrentRoleID === RoleID.LineManager) {
  //       props.navigation(
  //         "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit",
  //         {
  //           state: {
  //             ID: rowData?.ID,
  //             tab,
  //             StatusId: rowData?.StatusId,
  //             Status: rowData?.Status,
  //             TabName: TabName,
  //             ButtonAction,
  //           },
  //         }
  //       );
  //     } else {
  //       props.navigation("InterviewPanelList/InterviewPanelEdit", {
  //         state: {
  //           ID: rowData?.ID,
  //           tab,
  //           StatusId: rowData?.StatusId,
  //           Status: rowData?.Status,
  //           TabName: TabName,
  //           ButtonAction,
  //         },
  //       });
  //       props.navigation("/InterviewPanelList");
  //     }
  //   }
  // }

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string
  ) {
    console.log("rowData", rowData);
    console.log("tab", tab);
    console.log("TabName", TabName);
    console.log("ButtonAction", ButtonAction);

    debugger
    if (tab !== "tab1") return;
  
    const statusId = rowData?.StatusId;
    const { CurrentRoleID } = props;
  
    let navigationPath = "";
  
    if (
      (statusId === StatusId.InterviewScheduled ||
       statusId === StatusId.InterviewScheduledforLevel2) &&
      (CurrentRoleID === RoleID.RecruitmentHR ||
       CurrentRoleID === RoleID.LineManager ||
       CurrentRoleID === RoleID.HOD)
    ) {
      navigationPath = "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit";
    }else if (
      statusId === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel &&
      (CurrentRoleID === RoleID.HOD ||
       CurrentRoleID === RoleID.LineManager ||
       CurrentRoleID === RoleID.RecruitmentHR)
    ) {
      navigationPath = "/RecurimentProcess/HodViewScorecard";
    }
  
    if (navigationPath) {
      props.navigation(navigationPath, {
        state: {
          ID: rowData?.ID,
          tab,
          StatusId: statusId,
          Status: rowData?.Status,
          TabName,
          ButtonAction,
        },
      });
    } else {
      // fallback (optional)
      console.warn("No matching navigation rule for role & status.");
    }
  }
  
  function handleAlert() {
    let CancelAlert = {
      Message: RecuritmentHRMsg.InterviewScoredAlready,
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

  const columnConfig = (tab: string, ButtonAction: string, TabName: string) => [
    {
      field: "ID",
      header: "Candidate ID",
      sortable: true,
    },
    {
      field: "ApplicantName",
      header: "ApplicantName",
      sortable: true,
    },
    {
      field: "PositionTitle",
      header: "Position Title",
      sortable: true,
    },
    {
      field: "JobGrade",
      header: "JobGrade",
      sortable: true,
    },
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
      style: { width: "8%" },
      body: (rowData: any) => {
        const checkIsScoreSheetUploaded = async () => {
          try {
            const [interviewPanelResponse, currentUserResponse] =
              await Promise.all([
                CommonServices.GetMasterData(
                  ListNames.HRMSInterviewPanelDetails
                ),
                CommonServices.getUserGuidByEmail(props.CurrentUserEmailId),
              ]);

            const currentUserKey = currentUserResponse.data?.key?.toString();
            if (!currentUserKey) {
              return;
            }

            if (
              !interviewPanelResponse?.data ||
              interviewPanelResponse.data.length === 0
            ) {
              return;
            }

            const candidatePanels = interviewPanelResponse.data.filter(
              (panel) =>
                panel.CandidateIDId?.toString() === rowData.ID?.toString()
            );

            if (candidatePanels.length === 0) {
              return;
            }

            const userPanels = candidatePanels.filter((panel) =>
              panel.InterviewPanelStringId?.includes(currentUserKey)
            );

            if (userPanels.length === 0) {
              return;
            }

            const isScoreSheetUploaded = userPanels.some(
              (panel) => panel.IsScoreSheetUploaded === "Yes"
            );

            if (isScoreSheetUploaded) {
              handleAlert();
            } else {
              handleRedirectView(rowData, "tab1", "Evaluation", "View");
            }
          } catch (error) {}
        };

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
            <img
              src={require("../../assets/Viewicon.svg")}
              alt="Edit Icon"
              onClick={checkIsScoreSheetUploaded}
              style={{
                width: "70%",
                height: "60%",
                cursor: "pointer",
              }}
            />
          </div>
        );
      },
    },
  ];

  const fetchCandidateData = async (CurrentUserID: any) => {
    setIsLoading(true);
    try {
      const interviewPanelResponse =
        await InterviewServices.GetInterviewPanelDetails([
          {
            FilterKey: "InterviewPanelId",
            Operator: "eq",
            FilterValue: CurrentUserID,
          },
        ]);

      if (
        !interviewPanelResponse.data ||
        interviewPanelResponse.data.length === 0
      ) {
        setIsLoading(false);
        return;
      }

      const candidateIDs = interviewPanelResponse.data.map(
        (panel: any) => panel.CandidateID
      );

      if (candidateIDs.length === 0) {
        setCandidateData([]);
        setIsLoading(false);
        return;
      }

      let filterConditionsRecuritment = [];
      let RecuritmentConditions = "and";
      filterConditionsRecuritment.push({
        FilterKey: "StatusId",
        Operator: "in", 
        FilterValue: [
          StatusId.InterviewScheduled,
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel, 
          StatusId.InterviewScheduledforLevel2
        ],
      });
      filterConditionsRecuritment.push({
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: "No",
      });
      filterConditionsRecuritment.push({
        FilterKey: "ID",
        Operator: "in",
        FilterValue: candidateIDs,
      });

      const statusResponse =
        await InterviewServices.GetCombinedCandidatePositionDetails(
          filterConditionsRecuritment,
          RecuritmentConditions,
          props.EmployeeList
        );

      const candidateNames = statusResponse.data.map((candidate: any) => ({
        ID: candidate.ID,
        FristName: candidate.FristName || "",
        LastName: candidate.LastName || "",
        ApplicantName: `${candidate.FristName || ""} ${
          candidate.LastName || ""
        }`.trim(),
        PositionTitle: candidate.PositionTitle || "",
        JobGrade: candidate.JobGrade || "",
        Status: candidate.Status || "",
        StatusId: candidate.StatusId || "",
        InterviewLevel: candidate.InterviewLevel || "",
      }));

      setCandidateData(candidateNames);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setIsLoading(false);
    }
};


  const fetchData = async () => {
    try {
      const getCurrentUserEmailID = await CommonServices.getUserGuidByEmail(
        props.CurrentUserEmailId
      );

      if (getCurrentUserEmailID.status === 200 && getCurrentUserEmailID.data) {
        const userGUID = getCurrentUserEmailID.data.key;
        await fetchCandidateData(userGUID);
      }
    } catch (error) {
      console.error("Error fetching current user details:", error);
    }
  };

  const handleRefresh = (tab: string) => {
    void fetchData();
  };

  React.useEffect(() => {
    void fetchData();
  }, []);

  const onPageChange = (event: any) => {
    setRows(event.rows);
  };

  const tabs = [
    {
      label: "Evaluation",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <ReviewProfileDatatable
              data={CandidateData}
              columns={columnConfig("tab1", "View", TabName.Evaluation)}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh("tab1")}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="sub-menu-card ">
          {props.CurrentRoleID === RoleID.InterviewPanel ? (
            <TabsComponent
              tabs={tabs}
              initialTab="tab1"
              //  tabClassName={"Tab"}
            />
          ) : (
            <ReviewProfileDatatable
              data={CandidateData}
              columns={columnConfig("tab1", "View", TabName.Evaluation)}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh("tab1")}
              // MasterData={props}
            />
          )}
        </div>
      </CustomLoader>
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
    </>
  );
};
export default InterviewPanelList;
