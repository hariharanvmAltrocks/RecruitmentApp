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

  // const HRFileHandle = (serverUrl: string, fileName: string) => {
  //   console.log(serverUrl, "ServerUrl");
  //   try {
  //     if (serverUrl) {
  //       if (
  //         fileName
  //           .split(".")
  //           [fileName.split(".").length - 1].toLocaleLowerCase() == "pdf"
  //       ) {
  //         window.open(serverUrl);
  //       } else {
  //         window.open(serverUrl + "?web=1");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error setting up SharePoint:", error);
  //   }
  // };

  // const handleAttachmentState = (newAttachments: Item[], rowData: any) => {
  //     const updatedRowAttachment = CandidateData.map((item: any) => {
  //         if (item.ID === rowData.ID) {
  //             if (item.Checked === true) {
  //                 return item;
  //             }
  //             return {
  //                 ...item,
  //                 ScoreCardAttch: [...(item.ScoreCardAttch || []), ...newAttachments],
  //             };
  //         }
  //         return item;
  //     });
  //     setCandidateData(updatedRowAttachment);
  // };

  // const handleDelete = (index: number, rowData: any) => {
  //     console.log("Deleting attachment at index:", index);
  //     const updatedCandidateData = CandidateData.map((item: any) => {
  //         if (item.ID === rowData.ID) {
  //             const updatedAttachments = item.ScoreCardAttch.filter((_: any, i: number) => i !== index);
  //             return {
  //                 ...item,
  //                 ScoreCardAttch: updatedAttachments,
  //             };
  //         }
  //         return item;
  //     });

  //     setCandidateData(updatedCandidateData);
  // };
  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string
  ) {
    switch (props.CurrentRoleID) {
      case RoleID.InterviewPanel:
        {
          if (tab === "tab1") {
            props.navigation("/InterviewPanelList/InterviewPanelEdit", {
              state: {
                //type: "VRR",
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
        break;
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
    // {
    //   field: "InterviewLevel",
    //   header: "Level",
    //   sortable: true,
    // },
    // {
    //   field: "JobCode",
    //   header: "JobCode",
    //   sortable: true,
    // },
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

    // {
    //   field: "Nationality",
    //   header: "Nationality",
    //   sortable: true,
    // },
    // {
    //   field: "PassportID",
    //   header: "PassportID",
    //   sortable: true,
    // },
    // {
    //   field: "",
    //   header: "Name",
    //   sortable: true,
    // },
    // {
    //   field: "",
    //   header: "CV",
    //   sortable: false,
    //   body: (rowData: any) => {
    //     if (
    //       rowData?.CandidateCVDoc?.[0] &&
    //       rowData?.CandidateCVDoc?.[0]?.name
    //     ) {
    //       return (
    //         <div>
    //           <Link
    //             onClick={() =>
    //               HRFileHandle(
    //                 rowData?.CandidateCVDoc[0]?.content || "",
    //                 rowData?.CandidateCVDoc[0]?.name || ""
    //               )
    //             }
    //           >
    //             {rowData?.CandidateCVDoc?.[0]?.name}
    //           </Link>
    //         </div>
    //       );
    //     } else {
    //       return <span>No CV available</span>;
    //     }
    //   },
    // },
    // {
    //   field: "Interviewed",
    //   header: "Interviewed",
    //   sortable: false,
    // },

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
            {props.stateValue?.AlreadySubmitted === "Yes" ? (
              <>
                <img
                  src={require("../../assets/Editbutton.svg")}
                  alt="Stamp Icon"
                  onClick={() => handleAlert()}
                  style={{
                    width: "70%",
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
                    handleRedirectView(rowData, tab, TabName, ButtonAction)
                  }
                  style={{
                    width: "70%",
                    height: "60%",
                  }}
                />
              </>
            )}
            {/* <img
              src={require("../../assets/Editbutton.svg")}
              alt="Stamp Icon"
              onClick={() =>
                handleRedirectView(rowData, tab, TabName, ButtonAction)
              }
              style={{
                width: "70%",
                height: "60%",
              }}
            /> */}
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
        // console.log("No data found in HRMSInterviewPanelDetails");
        setIsLoading(false);
        return;
      }

      const filteredPanels = interviewPanelResponse.data.filter(
        (panel: any) =>
          panel.InterviewPanelId && panel.InterviewPanelId === CurrentUserID
      );

      if (filteredPanels.length === 0) {
        // console.log("No matching InterviewPanelId found");
        setCandidateData([]);
        setIsLoading(false);
        return;
      }

      const candidateIDs = filteredPanels.map(
        (panel: any) => panel.CandidateIDId
      );
      //console.log("Filtered Candidate IDs:", candidateIDs);

      if (candidateIDs.length === 0) {
        //console.log("No Candidate IDs found for this panel");
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
        // console.log(
        //   "No candidates found in HRMSRecruitmentCandidatePersonalDetails"
        // );
        setIsLoading(false);
        return;
      }

      const matchedCandidates = candidateDetailsResponse.data.filter(
        (candidate: any) => candidateIDs.includes(candidate.ID)
      );

      if (matchedCandidates.length === 0) {
        //  console.log("No matched candidates found");
        setCandidateData([]);
        setIsLoading(false);
        return;
      }

      const filterCondition = candidateIDs
        .map((id) => `ID eq ${id}`)
        .join(" or ");
      // console.log("Generated Filter Condition:", `(${filterCondition})`);

      const statusResponse =
        await InterviewServices.GetCandidateDetailsInterviewPanal(
          `(${filterCondition}) and Status/StatusDescription eq 'Interview Scheduled'`,
          ""
        );

      const statusMap = new Map(
        statusResponse.data?.map((status: any) => [
          status.ID,
          status.Status || "",
        ])
      );

      // console.log("Status Data:", statusMap);

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

      // console.log(
      //   "Final Candidate Data (Only 'Interview Scheduled'):",
      //   candidateNames
      // );

      setCandidateData(candidateNames);
    } catch (error) {
      // console.error("Error fetching candidate data:", error);
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
          <React.Fragment>
            <TabsComponent tabs={tabs} initialTab="tab1" tabClassName={"Tab"} />
          </React.Fragment>
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
