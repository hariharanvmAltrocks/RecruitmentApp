import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {
  CommonServices,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import {
  ButtonAction,
  // GridStatusBackgroundcolor,
  HRMSAlertOptions,
  InterviewLevels,
  ListNames,
  RecuritmentHRMsg,
  RoleID,
  StatusId,
} from "../../utilities/Config";
import { TabName } from "../../utilities/Config";
import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import * as moment from "moment";
import InterviewPanelDataTable from "../../components/InterviewPanelDataTable";
import { StatusDetails, TabDetails } from "../../Models/Master";

const InterviewPanelList = (props: any) => {
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
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>(
    props.TabDetails
  );
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const storedStringRef = React.useRef("");

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string
  ) {
    let navigationPath =
      rowData?.StatusId === StatusId.InterviewScheduled
        ? props.CurrentRoleID.includes(RoleID.HOD) ||
          props.CurrentRoleID.includes(RoleID.LineManager)
          ? "/RecurimentProcess/InterviewPanelList/InterviewPanelEdit"
          : props.CurrentRoleID.includes(RoleID.InterviewPanel)
          ? "InterviewPanelList/InterviewPanelEdit"
          : "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit"
        : rowData.StatusId === StatusId.InterviewScheduledforLevel2
        ? props.CurrentRoleID.includes(RoleID.HOD) ||
          props.CurrentRoleID.includes(RoleID.LineManager)
          ? "/RecurimentProcess/HodViewScorecard"
          : props.CurrentRoleID.includes(RoleID.InterviewPanel)
          ? "/InterviewPanelList/HodViewScorecard"
          : "/ReviewProfileList/HodViewScorecard"
        : "";
    const today = new Date();
    // const todayDateStr = today.toISOString().split("T")[0];
    const interviewDateStr = moment(
      rowData.InterviewDateTime,
      "DD-MMM-YYYY hh:mm A"
    ).format("YYYY-MM-DD");
    const todayDateStr = moment(today).format("YYYY-MM-DD");
    // const InterviewDate = new Date(rowData.InterviewDateTime)
    //   .toISOString()
    //   .split("T")[0];
    if (todayDateStr >= interviewDateStr) {
      if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        props.navigation(navigationPath, {
          state: {
            ID: rowData?.ID,
            tab: props?.TabValue,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabName,
            ButtonAction,
            RecruitmentID: rowData?.RecruitmentID,
            InterviewLevel: rowData?.InterviewLevel,
          },
        });
      } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
        props.navigation(navigationPath, {
          state: {
            ID: rowData?.ID,
            tab: props?.TabValue,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabName,
            ButtonAction,
            RecruitmentID: rowData?.RecruitmentID,
            InterviewLevel: rowData?.InterviewLevel,
          },
        });
      } else if (props.CurrentRoleID.includes(RoleID.LineManager)) {
        props.navigation(navigationPath, {
          state: {
            ID: rowData?.ID,
            tab: props?.TabValue,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabName,
            ButtonAction,
            RecruitmentID: rowData?.RecruitmentID,
            InterviewLevel: rowData?.InterviewLevel,
          },
        });
      } else {
        props.navigation(navigationPath, {
          state: {
            ID: rowData?.ID,
            tab: props?.TabValue,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabName: TabName,
            ButtonAction,
            RecruitmentID: rowData?.RecruitmentID,
            InterviewLevel: rowData?.InterviewLevel,
          },
        });
      }
    } else {
      const formattedDate = moment(
        `${interviewDateStr}`,
        "YYYY-MM-DD HH:mm"
      ).format("DD-MMM-YYYY hh:mm A");

      const ValidationMsg = `
      <div style="text-align: center;">
        <h3>⚠️ Action cannot be performed.</h3>
        <p><strong>Interview Open Date:</strong> ${formattedDate}</p>
        <p>Please try again on the Interview Date.</p>
      </div>`;
      let ValidationError = {
        Message: ValidationMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };
      setAlertPopupOpen(true);
      setalertProps(ValidationError);
      setIsLoading(false);
    }
  }

  function handleAlert(Level: string) {
    let CancelAlert = {
      Message:
        Level === InterviewLevels.Level1
          ? RecuritmentHRMsg.InterviewScoredAlready
          : RecuritmentHRMsg.InterviewScoreCommentsAlready,
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

  const columnConfig = (
    tab: string,
    ButtonActions: number,
    TabName: string
  ) => [
    {
      field: "SNO",
      header: "S.No",
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
      field: "InterviewDateTime",
      header: "Interview Date & Time",
      sortable: true,
    },
    // {
    //   field: "JobGrade",
    //   header: "JobGrade",
    //   sortable: true,
    // },
    { field: "InterviewLevel", header: "Interview Levels", sortable: true },
    { field: "Grade", header: "Grade", sortable: true },
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
            if (rowData.StatusId === StatusId.InterviewScheduled) {
              const isLevelbasedFiltered = userPanels.filter(
                (item) => item.InterviewLevel === InterviewLevels.Level1
              );

              const isScoreSheetUploaded = isLevelbasedFiltered.some(
                (panel) => panel.IsScoreSheetUploaded === "Yes"
              );
              if (isScoreSheetUploaded) {
                handleAlert(InterviewLevels.Level1);
                return;
              }
              handleRedirectView(
                {
                  ...rowData,
                  InterviewLevel: rowData?.InterviewLevel,
                  RecruitmentID: rowData?.RecruitmentID,
                },
                tab,
                TabName,
                ButtonAction.View
              );
              return;
            } else if (
              rowData.StatusId === StatusId.InterviewScheduledforLevel2
            ) {
              const isLevelbasedFiltered = userPanels.filter(
                (item) => item.InterviewLevel === InterviewLevels.Level2
              );

              const isScoreSheetUploaded = isLevelbasedFiltered.some(
                (panel) => panel.IsScoreSheetUploaded === "Yes"
              );
              if (isScoreSheetUploaded) {
                handleAlert(InterviewLevels.Level2);
                return;
              }
              handleRedirectView(
                {
                  ...rowData,
                  InterviewLevel: rowData?.InterviewLevel,
                  RecruitmentID: rowData?.RecruitmentID,
                },
                tab,
                TabName,
                ButtonAction.View
              );
              return;
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
              gap: "10px", // slightly more space for small screens
              flexWrap: "wrap", // allow wrapping on smaller screens
            }}
          >
            <img
              src={require("../../assets/Viewicon.svg")}
              alt="Stamp Icon"
              style={{
                width: "50%", // scales with font size
                height: "auto",
                maxWidth: "40px", // limit maximum size
                cursor: "pointer",
              }}
              onClick={checkIsScoreSheetUploaded}
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

      // let statusIdsToFilter: number[] = [];

      // if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
      //   statusIdsToFilter = [StatusId.InterviewScheduledforLevel2];
      // } else if (
      //   props.CurrentRoleID.includes(RoleID.HOD) ||
      //   props.CurrentRoleID.includes(RoleID.RecruitmentHR)
      // ) {
      //   statusIdsToFilter = [
      //     StatusId.InterviewScheduled,
      //     StatusId.InterviewScheduledforLevel2,
      //   ];
      // } else {
      //   statusIdsToFilter = [StatusId.InterviewScheduled];
      // }

      filterConditionsRecuritment.push({
        FilterKey: "StatusId",
        Operator: "in",
        FilterValue: [
          StatusId.InterviewScheduled,
          StatusId.InterviewScheduledforLevel2,
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

      const enrichedCandidates = await Promise.all(
        statusResponse.data.map(async (candidate: any) => {
          let grade = "";
          let level = "";

          try {
            const vrrResponse = await getVRRDetails.GetRecruitmentDetails(
              [
                {
                  FilterKey: "ID",
                  Operator: "eq",
                  FilterValue: candidate.RecruitmentID,
                },
              ],
              ""
            );

            grade = vrrResponse?.data?.[0]?.PatersonGrade || "";

            if (grade) {
              const gradeLevelResponse = await CommonServices.GetGradeLevel(
                grade
              );
              level = gradeLevelResponse?.data?.[0]?.Level || "";
            }
          } catch (err) {
            console.warn(
              "Failed to fetch grade or level for candidate:",
              candidate.ID,
              err
            );
          }
          const InterviewDate = candidate?.InterviewDateLevel2
            ? candidate?.InterviewDateLevel2
            : candidate?.InterviewDate;
          const InterviewTime = candidate?.InterviewTimeLevel2
            ? candidate?.InterviewTimeLevel2
            : candidate?.InterviewTime;
          const InterviewDateTime = moment(
            `${InterviewDate} ${InterviewTime}`,
            "YYYY-MM-DD HH:mm"
          ).format("DD-MMM-YYYY hh:mm A");

          return {
            SNO: candidate.SNO,
            ID: candidate.ID,
            FristName: candidate.FristName || "",
            LastName: candidate.LastName || "",
            ApplicantName: `${candidate.FristName || ""} ${
              candidate.LastName || ""
            }`.trim(),
            PositionTitle: candidate.PositionTitle || "",
            JobGrade: candidate.JobGrade || "",
            Grade: grade,
            InterviewLevel:
              level === InterviewLevels.Level2
                ? InterviewLevels.Levels2
                : level,
            Status: candidate.Status || "",
            StatusId: candidate.StatusId || "",
            RecruitmentID: candidate.RecruitmentID || "",
            InterviewDate: candidate?.InterviewDate,
            InterviewDateLevel2: candidate?.InterviewDateLevel2,
            InterviewDateTime: InterviewDateTime,
          };
        })
      );
      const finalValue = enrichedCandidates.filter((candidate) => {
        const matchingPanel = interviewPanelResponse.data.find((item) => {
          if (candidate.ID !== item.CandidateID) return false;
          if (
            candidate.StatusId === StatusId.InterviewScheduled &&
            item.InterviewLevel === InterviewLevels.Level1
          ) {
            return true;
          }

          if (
            candidate.StatusId === StatusId.InterviewScheduledforLevel2 &&
            item.InterviewLevel === InterviewLevels.Level2
          ) {
            return true;
          }

          return false;
        });

        return !!matchingPanel;
      });
      setCandidateData(finalValue);
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
    setTabNameData(props?.TabDetails[0] ?? []);
    void fetchData();
  }, [activeTab, TabNameData]);

  const onPageChange = (event: any) => {
    setRows(event.rows);
    // void fetchData();
  };

  const renderTable = (
    TabNames: string,
    TabValue: string,
    StatusData: StatusDetails[]
  ) => {
    if (TabValue === activeTab) {
      storedStringRef.current = TabNames;
    }
    let Action: any;
    let StatusID: any;
    if (StatusData) {
      Action = StatusData.filter((item) => item.Action);
      StatusID = StatusData.filter((item) => item.StatusId);
    }
    console.log(StatusID);

    switch (TabNames) {
      case TabName.Evaluation:
        return (
          <InterviewPanelDataTable
            data={CandidateData}
            columns={columnConfig(
              TabValue,
              Number(Action[0]?.Action?.[0]),
              TabNames
            )}
            rows={rows}
            onPageChange={onPageChange}
            handleRefresh={() => handleRefresh(TabValue)}
          />
        );
      default:
        return null;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: tab.TabName,
    value: tab.Value,
    content: (
      <Card
        variant="outlined"
        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
      >
        <CardContent>
          <div>{renderTable(tab.TabName, tab.Value, tab.StatusDetails)}</div>
        </CardContent>
      </Card>
    ),
  }));

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="sub-menu-card ">
          {props.CurrentRoleID.includes(RoleID.InterviewPanel) ? (
            <TabsComponent
              tabs={tabs}
              initialTab={activeTab}
              onTabChange={(newTab) => setActiveTab(newTab)}
            />
          ) : (
            <InterviewPanelDataTable
              data={CandidateData}
              columns={columnConfig(
                props.TabValue,
                props?.Action,
                TabName.Evaluation
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh(props.TabValue)}
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
