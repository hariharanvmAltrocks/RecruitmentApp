import * as React from "react";
import { Card, CardContent } from "@mui/material";
//import { Link } from "@mui/material";
import { CommonServices, getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import {
  GridStatusBackgroundcolor,
  ListNames,
  RoleID,
  StatusId,
  TabName,
  tabType,
} from "../../utilities/Config";
import SearchableDataTable from "../../components/CustomDataTable";
import InterviewPanelList from "../InterviewPanel/InterviewPanelList";

const ReviewProfileList = (props: any) => {
  const [RecuritmentData, setRecuritmentData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  // const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [assignedCandidates, setAssignedCandidates] =
    React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("");

  const columnConfig = (tab: string, ButtonAction: string, TabName: string) => [
    {
      field: "JobCode",
      header: "Job Code",
      sortable: true,
    },
    {
      field: "JobTitleInEnglish",
      header: "Job Title",
      sortable: true,
    },
    {
      field: "BusinessUnitCode",
      header: "Business Unit Code",
      sortable: true,
    },
    {
      field: "Status",
      header: "Status",
      fieldName: "Status",
      sortable: false,
      body: (rowData: any) => {
        return (
          <span
            style={{
              backgroundColor:
                rowData.Status.includes("Pending") === true // "Pending"
                  ? GridStatusBackgroundcolor.Pending
                  : rowData.Status.includes("Completed") === true
                  ? GridStatusBackgroundcolor.CompletedOrApproved
                  : rowData.Status.includes("Rejected") === true
                  ? GridStatusBackgroundcolor.Rejected
                  : rowData.Status.includes("InProgress") === true
                  ? GridStatusBackgroundcolor.Reverted
                  : rowData.Status.includes("Resubmitted") === true
                  ? GridStatusBackgroundcolor.ReSubmitted
                  : rowData.Status.includes("Draft") === true
                  ? GridStatusBackgroundcolor.Draft
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
      field: "",
      header: "Action",
      style: { width: "8%" },
      sortable: false,
      body: (rowData: any) => {
        const handleRedirectView = (
          rowData: any,
          tab: string,
          TabName: string,
          ButtonAction: string
        ): void => {
          if (tab === "tab2") {
            props.navigation("/ReviewProfileList/InterviewQuesEdit", {
              state: {
                ID: rowData?.ID,
                AssignedHRId: rowData?.AssignedHRId,
                tab: "tab2",
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                JobTitleInEnglish: rowData.JobTitleInEnglish,
                JobCode: rowData.JobCode,
                TabName,
                ButtonAction,
              },
            });
          } else {
            props.navigation("/ReviewProfileList/ReviewCandidateList", {
              state: {
                ID: rowData?.ID,
                JobCode: rowData?.JobCode,
                tab: "tab1",
                StatusId: rowData?.StatusId,
                Status: rowData?.Status,
                TabName,
                ButtonAction,
              },
            });
          }
        };

        return (
          <div style={{ display: "flex", gap: "10px" }}>
            {rowData.StatusId ===
              StatusId.PendingInterviewQuestionwithLineManagerandHR ||
            tab === "tab2" ? (
              <img
                src={require("../../assets/Editbutton.svg")}
                alt="Edit Icon"
                style={{ width: "70%", height: "60%", cursor: "pointer" }}
                onClick={() =>
                  handleRedirectView(rowData, "tab2", TabName, ButtonAction)
                }
              />
            ) : (
              <img
                src={require("../../assets/Viewicon.svg")}
                alt="View Icon"
                style={{ width: "70%", height: "60%", cursor: "pointer" }}
                onClick={() =>
                  handleRedirectView(rowData, "tab1", TabName, ButtonAction)
                }
              />
            )}
          </div>
        );
      },
    },
  ];

  const fetchRecuritmentData = async () => {
    setIsLoading(true);
    try {
      let filterConditionsRecuritment = [];
      let RecuritmentConditions = "";
      filterConditionsRecuritment.push({
        FilterKey: "StatusId",
        Operator: "eq",
        FilterValue: StatusId.RecruitmentInProgress,
      });
      const data = await getVRRDetails.GetRecruitmentDetails(
        filterConditionsRecuritment,
        RecuritmentConditions
      );
      if (data.status === 200 && data.data !== null) {
        setRecuritmentData(data.data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

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
        (panel) => panel.InterviewPanelId === CurrentUserID
      );

      if (filteredPanels.length === 0) {
        setAssignedCandidates(false);
        setIsLoading(false);
        return;
      }

      const candidateIDs = filteredPanels.map((panel) => panel.CandidateIDId);

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
        (candidate) => candidateIDs.includes(candidate.ID)
      );

      const matchedCandidate = matchedCandidates.length > 0;
      setAssignedCandidates(matchedCandidate);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchRecuritmentData();

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
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    void fetchData();
    setActiveTab(props.stateValue?.activeTab ?? "tab1");
  }, []);

  const onPageChange = (event: any) => {
    setRows(event.rows);
  };

  const handleRefresh = (tab: string) => {
    void fetchRecuritmentData();
    setActiveTab(tab);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const tabs = [
    ...(props.CurrentRoleID === RoleID.RecruitmentHR
      ? [
          {
            label: TabName.ReviewProfile,
            value: "tab1",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <SearchableDataTable
                    data={RecuritmentData}
                    columns={columnConfig(
                      "tab1",
                      TabName.ViewPositionDetails,
                      TabName.ReviewProfile
                    )}
                    rows={rows}
                    onPageChange={onPageChange}
                    handleRefresh={() => handleRefresh("tab1")}
                    MasterData={props}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: TabName.AssignInterviewPanel,
            value: "tab2",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <SearchableDataTable
                    data={RecuritmentData}
                    columns={columnConfig(
                      "tab1",
                      "View",
                      TabName.AssignInterviewPanel
                    )}
                    rows={rows}
                    onPageChange={onPageChange}
                    handleRefresh={() => handleRefresh("tab2")}
                    MasterData={props}
                  />
                </CardContent>
              </Card>
            ),
          },
          ...(assignedCandidates
            ? [
                {
                  label: TabName.Evaluation,
                  value: "tab3",
                  content: <InterviewPanelList {...props} />,
                },
              ]
            : []),
        ]
      : [
          {
            label: TabName.ReviewProfile,
            value: "tab1",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <SearchableDataTable
                    data={RecuritmentData}
                    columns={columnConfig(
                      "tab1",
                      TabName.ViewPositionDetails,
                      TabName.ReviewProfile
                    )}
                    rows={rows}
                    onPageChange={onPageChange}
                    handleRefresh={() => handleRefresh("tab1")}
                    MasterData={props}
                  />
                </CardContent>
              </Card>
            ),
          },
          {
            label: TabName.InterviewQuestion,
            value: "tab2",
            content: (
              <Card
                variant="outlined"
                sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
              >
                <CardContent>
                  <SearchableDataTable
                    data={RecuritmentData}
                    columns={columnConfig(
                      "tab2",
                      "Edit",
                      TabName.InterviewQuestion
                    )}
                    rows={rows}
                    onPageChange={onPageChange}
                    handleRefresh={() => handleRefresh("tab2")}
                    MasterData={props}
                  />
                </CardContent>
              </Card>
            ),
          },
          ...(assignedCandidates
            ? [
                {
                  label: TabName.Evaluation,
                  value: "tab3",
                  content: <InterviewPanelList {...props} />,
                },
              ]
            : []),
        ]),
  ];

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <React.Fragment>
            <TabsComponent
              tabs={tabs}
              initialTab={activeTab}
              tabtype={tabType.Dashboard}
              onTabChange={handleTabChange}
              tabClassName={"Tab"}
            />
          </React.Fragment>
        </div>
      </CustomLoader>
    </>
  );
};
export default ReviewProfileList;
