import * as React from "react";
import { Card, CardContent } from "@mui/material";
import {
  CommonServices,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import {
  GridStatusBackgroundcolor,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  RoleID,
} from "../../utilities/Config";
import { TabName } from "../../utilities/Config";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import { alertPropsData } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import SearchableDataTable from "../../components/CustomDataTable";

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

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string
  ) {
    if (tab === "tab1") {
      props.navigation("/InterviewPanelList/InterviewPanelEdit", {
        state: {
          ID: rowData?.ID,
          tab,
          StatusId: rowData?.StatusId,
          Status: rowData?.Status,
          TabName: TabName,
          ButtonAction,
        },
      });
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
      field: "FristName",
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

    {
      field: "Status",
      header: "Status",
      sortable: false,
      body: (rowData: any) => {
        return (
          <span
            style={{
              backgroundColor:
                rowData.Status.includes("Interview Scheduled") === true
                  ? GridStatusBackgroundcolor.CompletedOrApproved
                  : "",
              borderRadius: "5px",
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
              handleRedirectView(rowData, "tab1", "Evaluation", "Edit");
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
              src={require("../../assets/Editbutton.svg")}
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
      const interviewPanelResponse = await CommonServices.GetMasterData(
        ListNames.HRMSInterviewPanelDetails
      );

      if (
        !interviewPanelResponse.data ||
        interviewPanelResponse.data.length === 0
      ) {
        setIsLoading(false);
        return;
      }

      const filteredPanels = interviewPanelResponse.data.filter(
        (panel: any) =>
          panel.InterviewPanelId && panel.InterviewPanelId === CurrentUserID
      );

      if (filteredPanels.length === 0) {
        setCandidateData([]);
        setIsLoading(false);
        return;
      }

      const candidateIDs = filteredPanels.map(
        (panel: any) => panel.CandidateIDId
      );

      if (candidateIDs.length === 0) {
        setCandidateData([]);
        setIsLoading(false);
        return;
      }

      const candidateDetailsResponse = await CommonServices.GetMasterData(
        ListNames.HRMSRecruitmentCandidatePersonalDetails
      );

      if (
        !candidateDetailsResponse.data ||
        candidateDetailsResponse.data.length === 0
      ) {
        setIsLoading(false);
        return;
      }

      const matchedCandidates = candidateDetailsResponse.data.filter(
        (candidate: any) => candidateIDs.includes(candidate.ID)
      );

      if (matchedCandidates.length === 0) {
        setCandidateData([]);
        setIsLoading(false);
        return;
      }

      const filterCondition = candidateIDs
        .map((id) => `ID eq ${id}`)
        .join(" or ");

      const statusResponse =
        await InterviewServices.GetCandidateDetailsInterviewPanalDashboard(
          `(${filterCondition}) and Status/StatusDescription eq 'Interview Scheduled'`,
          ""
        );

      const statusMap = new Map(
        statusResponse.data?.map((status: any) => [
          status.ID,
          status.Status || "",
        ])
      );

      const candidateNames = matchedCandidates
        .filter(
          (candidate: any) =>
            statusMap.get(candidate.ID) === "Interview Scheduled"
        )
        .map((candidate: any) => ({
          ID: candidate.ID,
          FristName: candidate.FristName || "",
          PositionTitle: candidate.PositionTitle || "",
          JobGrade: candidate.JobGrade || "",
          Status: statusMap.get(candidate.ID) || "",
        }));

      setCandidateData(candidateNames);
    } catch (error) {
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
    } catch (error) {}
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
              columns={columnConfig("tab1", "Edit", TabName.Evaluation)}
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
        <div className="menu-card">
          {props.CurrentRoleID === RoleID.InterviewPanel ? (
            <TabsComponent tabs={tabs} initialTab="tab1" tabClassName={"Tab"} />
          ) : (
            <SearchableDataTable
              data={CandidateData}
              columns={columnConfig("tab1", "Edit", TabName.Evaluation)}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh("tab1")}
              MasterData={props}
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
