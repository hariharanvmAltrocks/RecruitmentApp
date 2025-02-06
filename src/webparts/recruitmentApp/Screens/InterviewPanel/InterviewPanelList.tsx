import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { CommonServices } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import { ListNames, RoleID } from "../../utilities/Config";
import { Button } from "primereact/button";
import { TabName } from "../../utilities/Config";
import SearchableDataTable from "../../components/CustomDataTable";

const InterviewPanelList = (props: any) => {
  console.log(props, "ReviewProfile");

  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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
      field: "",
      header: "Status",
      sortable: true,
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
            {ButtonAction === "view" ? (
              <Button
                onClick={() =>
                  handleRedirectView(rowData, tab, TabName, ButtonAction)
                }
                className="table_btn"
                icon="pi pi-eye"
                style={{
                  width: "30px",
                  marginRight: "7px",
                  padding: "3px",
                }}
              />
            ) : (
              <Button
                onClick={() =>
                  handleRedirectView(rowData, tab, TabName, ButtonAction)
                }
                className="table_btn"
                style={{
                  width: "30px",
                  marginRight: "7px",
                  padding: "3px",
                }}
              >
                <img
                  src={require("../../assets/edit_icon.png")}
                  alt="Edit Icon"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  //oldCode
  // const fetchCandidateData = async (CurrentUserID: any) => {
  //   setIsLoading(true);
  //   try {
  //     console.log(CurrentUserID, "CurrentUserID");

  //     let filterConditions = [];
  //     let Conditions = "";
  //     filterConditions.push({
  //       FilterKey: "AssignByInterviewPanel",
  //       Operator: "eq",
  //       FilterValue: CurrentUserID,
  //     });
  //     const data = await getVRRDetails.GetInterviewPanelCandidateDetails(
  //       filterConditions,
  //       Conditions
  //     );
  //     if (data.status === 200 && data.data !== null) {
  //       console.log(data.data, "GetVacancyDetails");
  //       setCandidateData(data.data);
  //     }
  //   } catch (error) {
  //     console.log("GetVacancyDetails doesn't fetch the data", error);
  //   }
  //   setIsLoading(false);
  // };
  //11.19 --4.02.2025
  // const fetchCandidateData = async (CurrentUserID: any) => {
  //   setIsLoading(true);

  //   try {
  //     console.log("Fetching data for User:", CurrentUserID);

  //     const interviewPanelResponse = await CommonServices.GetMasterData(
  //       ListNames.HRMSInterviewPanelDetails
  //     );
  //     console.log("interviewPanelResponse", interviewPanelResponse);

  //     if (
  //       !interviewPanelResponse.data ||
  //       interviewPanelResponse.data.length === 0
  //     ) {
  //       console.error("No interview panel data available");
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log("Interview Panel Data:", interviewPanelResponse.data);

  //     const filteredPanels = interviewPanelResponse.data.filter(
  //       (panel: any) =>
  //         panel.InterviewPanelId &&
  //         Array.isArray(panel.InterviewPanelId) &&
  //         panel.InterviewPanelId.includes(CurrentUserID)
  //     );

  //     if (filteredPanels.length === 0) {
  //       console.log("No panels found for the current user");
  //       setCandidateData([]);
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log("Filtered Panels for User:", filteredPanels);

  //     const candidateIDs = filteredPanels.map(
  //       (panel: any) => panel.CandidateIDId
  //     );

  //     if (candidateIDs.length === 0) {
  //       console.log("No candidate IDs found for this user");
  //       setCandidateData([]);
  //       setIsLoading(false);
  //       return;
  //     }

  //     const candidateDetailsResponse = await CommonServices.GetMasterData(
  //       ListNames.HRMSRecruitmentCandidatePersonalDetails
  //     );

  //     if (
  //       !candidateDetailsResponse.data ||
  //       candidateDetailsResponse.data.length === 0
  //     ) {
  //       console.error("No candidate details data available");
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log("Candidate Details Data:", candidateDetailsResponse.data);

  //     const matchedCandidates = candidateDetailsResponse.data.filter(
  //       (candidate: any) => candidateIDs.includes(candidate.ID)
  //     );

  //     if (matchedCandidates.length === 0) {
  //       console.log("No candidates matched for the user");
  //       setCandidateData([]);
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log("Matched Candidates for User:", matchedCandidates);

  //     const candidateNames = matchedCandidates.map((candidate: any) => ({
  //       ID: candidate.ID,
  //       FristName: candidate.FristName || "",
  //     }));

  //     setCandidateData(candidateNames);
  //   } catch (error) {
  //     console.error("Error fetching candidate data:", error);
  //   }

  //   setIsLoading(false);

  // const fetchCandidateData = async (CurrentUserID: any) => {
  //   setIsLoading(true);

  //   try {
  //     console.log("Fetching data for User:", CurrentUserID);

  //     // 1. Retrieve all interview panel details.
  //     const interviewPanelResponse = await CommonServices.GetMasterData(
  //       ListNames.HRMSInterviewPanelDetails
  //     );
  //     console.log("interviewPanelResponse", interviewPanelResponse);

  //     if (
  //       !interviewPanelResponse.data ||
  //       interviewPanelResponse.data.length === 0
  //     ) {
  //       console.error("No interview panel data available");
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log("Interview Panel Data:", interviewPanelResponse.data);

  //     // 2. Filter interview panels where InterviewPanelId includes the current user ID.
  //     const filteredPanels = interviewPanelResponse.data.filter(
  //       (panel: any) =>
  //         panel.InterviewPanelId &&
  //         Array.isArray(panel.InterviewPanelId) &&
  //         panel.InterviewPanelId.includes(CurrentUserID)
  //     );

  //     if (filteredPanels.length === 0) {
  //       console.log("No panels found for the current user");
  //       setCandidateData([]);
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log("Filtered Panels for User:", filteredPanels);

  //     // 3. Retrieve candidate personal details.
  //     const candidateDetailsResponse = await CommonServices.GetMasterData(
  //       ListNames.HRMSRecruitmentCandidatePersonalDetails
  //     );

  //     if (
  //       !candidateDetailsResponse.data ||
  //       candidateDetailsResponse.data.length === 0
  //     ) {
  //       console.error("No candidate details data available");
  //       setIsLoading(false);
  //       return;
  //     }

  //     console.log("Candidate Details Data:", candidateDetailsResponse.data);

  //     // 4. Create a separate dashboard item for each panel record.
  //     const candidateDataWithPanels = filteredPanels
  //       .map((panel: any) => {
  //         // Find candidate details for this panel's candidate.
  //         const candidate = candidateDetailsResponse.data.find(
  //           (c: any) => c.ID === panel.CandidateIDId
  //         );

  //         if (!candidate) {
  //           return null; // Skip this panel if no candidate found.
  //         }

  //         return {
  //           CandidateID: candidate.ID,
  //           FristName: candidate.FristName || "",
  //           InterviewLevel: panel.InterviewLevel,
  //           InterviewPanelID: panel.Id,
  //         };
  //       })
  //       .filter((item) => item !== null); // Remove null items.

  //     console.log(
  //       "Candidate Data with Separate Dashboard Items:",
  //       candidateDataWithPanels
  //     );

  //     // 5. Save the resulting data to state.
  //     setCandidateData(candidateDataWithPanels);
  //   } catch (error) {
  //     console.error("Error fetching candidate data:", error);
  //   }

  //   setIsLoading(false);
  // };
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
          panel.InterviewPanelId &&
          Array.isArray(panel.InterviewPanelId) &&
          panel.InterviewPanelId.includes(CurrentUserID)
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

      const candidateNames = matchedCandidates.map((candidate: any) => ({
        ID: candidate.ID,
        FristName: candidate.FristName || "",
        PositionTitle: candidate.PositionTitle || "",
        JobGrade: candidate.JobGrade || "",
      }));

      setCandidateData(candidateNames);
    } catch (error) { }

    setIsLoading(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const getCurrentUserEmailID = await CommonServices.getUserGuidByEmail(
          props.CurrentUserEmailId
        );

        if (
          getCurrentUserEmailID.status === 200 &&
          getCurrentUserEmailID.data
        ) {
          const userGUID = getCurrentUserEmailID.data.key;

          await fetchCandidateData(userGUID);
        }
      } catch (error) { }
    };

    void fetchData();
  }, []);

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleRefresh = (tab: string) => {
    // void fetchData();
    // setActiveTab(tab);
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
            <SearchableDataTable
              data={CandidateData}
              columns={columnConfig("tab1", "Edit", TabName.Evaluation)}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh("tab1")}
              MasterData={props}
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
            {console.log(props.masterData, "masterDataDetails")}
            {console.log(first, "first")}
          </React.Fragment>
        </div>
      </CustomLoader>
    </>
  );
};
export default InterviewPanelList;
