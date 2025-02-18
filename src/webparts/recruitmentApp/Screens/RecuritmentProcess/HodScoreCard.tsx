import * as React from "react";
import { Button, Card, CardContent } from "@mui/material";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomTextArea from "../../components/CustomTextArea";
import { InterviewServices } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import { TabName } from "../../utilities/Config";
import CustomSignature from "../../components/CustomSignature";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import { ScoreData } from "../../Models/RecuritmentVRR";
import CustomLabel from "../../components/CustomLabel";
import { PrimaryButton } from "office-ui-fabric-react";
import "../../App.css";
import { CommentsDatas } from "../../Services/InterviewProcess/IInterviewProcessService";
import CommentView from "./CommentView";
const HodScoreCard = (props: any) => {
  const [justification, setJustification] = React.useState("");
  const [isError] = React.useState(false);
  const [scoreData, setScoreData] = React.useState<any[]>([]);
  const [interviewPanelTitles, setInterviewPanelTitles] = React.useState<
    string[]
  >([]);
  const [agentName, setIagentName] = React.useState<"">("");
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = React.useState<string>("tab2");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const candidateID = props.stateValue?.ID;
  const [Checkboxs, setCheckbox] = React.useState<boolean>(false);
  // const [Comment, setComments] = React.useState<any[]>();
  const [CommentData, setCommentsData] = React.useState<
    CommentsDatas[] | undefined
  >();
  const todaydate = new Date();
  const [formState] = React.useState<ScoreData>({
    SignDate: new Date(
      todaydate.getFullYear(),
      todaydate.getMonth(),
      todaydate.getDate(),
      todaydate.getHours(),
      todaydate.getMinutes(),
      todaydate.getSeconds()
    ),
  });
  const [MainComponent, setMainComponent] = React.useState<boolean>(true);
  const fetchInterviewPanelData = async () => {
    try {
      setIsLoading(true);
      const filterConditions = [
        {
          FilterKey: "CandidateID/Id",
          Operator: "eq",
          FilterValue: candidateID,
        },
      ];
      const interviewResponse = await InterviewServices.HRMSCandidateScoreCard(
        "",
        filterConditions,
        candidateID
      );

      if (
        interviewResponse?.status === 200 &&
        interviewResponse?.data?.length
      ) {
        return interviewResponse.data;
      } else {
        console.warn("No interview panels found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching interview panel data:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchCandidateData = React.useCallback(
  //   async (interviewPanels: any[]) => {
  //     try {
  //       setIsLoading(true);
  //       const filterConditions = [
  //         {
  //           FilterKey: "CandidateID/Id",
  //           Operator: "eq",
  //           FilterValue: candidateID,
  //         },
  //       ];
  //       const scoreResponse = await InterviewServices.HRMSCandidateScoreCard(
  //         "",
  //         filterConditions,
  //         candidateID
  //       );

  //       if (scoreResponse?.status === 200 && scoreResponse?.data?.length) {
  //         const candidateData = scoreResponse.data.filter(
  //           (candidate: any) => candidate.CandidateID === candidateID
  //         );
  //         const filteredScores = candidateData.flatMap(
  //           (candidate: any) =>
  //             candidate.CandidateScoreCard?.filter(
  //               (score: any) => candidate.ID === score.InterviewPanelID
  //             ) || []
  //         );
  //         if (candidateData.length > 0) {
  //           const panelTitles = candidateData.map(
  //             (panel: any) => panel.InterviewPanelTitle
  //           );
  //           setInterviewPanelTitles(panelTitles);
  //           setScoreData(filteredScores);
  //           console.log("scoreData", scoreData);
  //         } else {
  //           setScoreData([]);
  //           setInterviewPanelTitles([]);
  //           console.warn("No scores found.");
  //         }
  //       } else {
  //         setScoreData([]);
  //         setInterviewPanelTitles([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching candidate data:", error);
  //       setScoreData([]);
  //       setInterviewPanelTitles([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [candidateID]
  // );
  // const fetchCandidateData = React.useCallback(
  //   async (interviewPanels: any[]) => {
  //     try {
  //       setIsLoading(true);
  //       const filterConditions = [
  //         {
  //           FilterKey: "CandidateID/Id",
  //           Operator: "eq",
  //           FilterValue: candidateID,
  //         },
  //       ];

  //       // Fetch candidate scorecard data
  //       const scoreResponse = await InterviewServices.HRMSCandidateScoreCard(
  //         "",
  //         filterConditions,
  //         candidateID
  //       );

  //       // Fetch combined candidate position details
  //       const response =
  //         await InterviewServices.GetCombinedCandidatePositionDetails(
  //           " ",
  //           filterConditions
  //         );

  //       if (scoreResponse?.status === 200 && scoreResponse?.data?.length) {
  //         const candidateData = scoreResponse.data.filter(
  //           (candidate: any) => candidate.CandidateID === candidateID
  //         );

  //         const filteredScores = candidateData.flatMap(
  //           (candidate: any) =>
  //             candidate.CandidateScoreCard?.filter(
  //               (score: any) => candidate.ID === score.InterviewPanelID
  //             ) || []
  //         );

  //         if (candidateData.length > 0) {
  //           const panelTitles = candidateData.map(
  //             (panel: any) => panel.InterviewPanelTitle
  //           );
  //           setInterviewPanelTitles(panelTitles);
  //           setScoreData(filteredScores);
  //           console.log("scoreData", scoreData);
  //         } else {
  //           setScoreData([]);
  //           setInterviewPanelTitles([]);
  //           console.warn("No scores found.");
  //         }
  //       } else {
  //         setScoreData([]);
  //         setInterviewPanelTitles([]);
  //       }

  //       // Handle response from GetCombinedCandidatePositionDetails (if needed)
  //       // if (response?.status === 200 && response?.data) {
  //       //   console.log("Combined Candidate Position Details:", response.data);
  //       //   // Process and use response.data as needed
  //       // }
  //       if (response?.status === 200 && response?.data) {
  //         console.log("Combined Candidate Position Details:", response.data);

  //         // Assuming response.data is an array
  //         response.data.forEach((candidate: any) => {
  //           const agentNames = candidate?.ExternalAgentDetails?.AgentName;

  //           if (agentNames) {
  //             console.log("External Agent Name:", agentNames);
  //             setIagentName(agentNames);
  //           } else {
  //             console.log("No External Agent Name Found");
  //           }
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching candidate data:", error);
  //       setScoreData([]);
  //       setInterviewPanelTitles([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [candidateID]
  // );
  const fetchCandidateData = React.useCallback(
    async (interviewPanels: any[]) => {
      try {
        setIsLoading(true);
        const filterConditions = [
          {
            FilterKey: "CandidateID/Id",
            Operator: "eq",
            FilterValue: candidateID,
          },
        ];

        // Fetch candidate scorecard data
        const scoreResponse = await InterviewServices.HRMSCandidateScoreCard(
          "",
          filterConditions,
          candidateID
        );
        console.log("scoreResponse", scoreResponse);
        // Fetch combined candidate position details
        const response =
          await InterviewServices.GetCombinedCandidatePositionDetails(
            " ",
            filterConditions
          );

        if (scoreResponse?.status === 200 && scoreResponse?.data?.length) {
          const candidateData = scoreResponse.data.filter(
            (candidate: any) => candidate.CandidateID === candidateID
          );

          const filteredScores = candidateData.flatMap(
            (candidate: any) =>
              candidate.CandidateScoreCard?.filter(
                (score: any) => candidate.ID === score.InterviewPanelID
              ) || []
          );

          if (candidateData.length > 0) {
            const panelTitles = candidateData.map(
              (panel: any) => panel.InterviewPanelTitle
            );
            setInterviewPanelTitles(panelTitles);
            setScoreData(filteredScores);
            console.log("scoreData", scoreData);
          } else {
            setScoreData([]);
            setInterviewPanelTitles([]);
            console.warn("No scores found.");
          }
        } else {
          setScoreData([]);
          setInterviewPanelTitles([]);
        }
        if (response?.status === 200 && response?.data) {
          console.log("Combined Candidate Position Details:", response.data);

          // Assuming response.data is an array
          response.data.forEach((candidate: any) => {
            const agentNames = candidate?.ExternalAgentDetails?.AgentName;

            if (agentNames && candidate?.ID === candidateID) {
              console.log("External Agent Name:", agentNames);
              setIagentName(agentNames);
            } else if (!agentNames) {
              console.log("No External Agent Name Found");
            }
          });
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
        setScoreData([]);
        setInterviewPanelTitles([]);
      } finally {
        setIsLoading(false);
      }
    },
    [candidateID]
  );

  const OpenComments = async () => {
    setMainComponent(false);
    if (scoreData.length === 0) {
      console.warn("No score data available to fetch RecruitmentID.");
      return;
    }

    const recruitmentID = scoreData[0].RecruitmentID;

    let filterConditions = [];
    let Conditions = "";

    filterConditions.push({
      FilterKey: "CandidateID/Id",
      Operator: "eq",
      FilterValue: candidateID,
    });

    const CommentsList = await InterviewServices.GetMergedData(
      props.EmployeeList,
      Conditions,
      filterConditions,
      "",
      candidateID
    );
    if (CommentsList?.status === 200 && CommentsList?.data?.length) {
      const candidateData = CommentsList.data.filter(
        (candidate: any) => candidate.CandidateID === candidateID
      );
      setCommentsData(candidateData);
    } else {
      console.warn("No comments found for RecruitmentID:", recruitmentID);
      setCommentsData([]);
    }
    console.log("setCommentsData", CommentsList.data);
  };
  React.useEffect(() => {
    if (candidateID) {
      void fetchInterviewPanelData().then((interviewPanels) => {
        void fetchCandidateData(interviewPanels);
      });
    }
  }, [candidateID, fetchCandidateData]);

  const transformScoreData = (rawData: any[]) => {
    const criteria = [
      { field: "RelevantQualification", label: "Qualification (Relevant)" },
      { field: "ReleventExperience", label: "Experience (Relevant)" },
      { field: "Knowledge", label: "Knowledge" },
      { field: "EnergyLevel", label: "Energy Level" },
      { field: "MeetJobRequirement", label: "Meets All Job Requirements" },
      {
        field: "ContributeTowardsCultureRequried",
        label: "Will Contribute to the Culture Required",
      },
      {
        field: "Experience",
        label: "Experience",
      },
      {
        field: "OtherCriteriaScore",
        label: "Other Criteria Recognized by Panel",
      },
      {
        field: "ConsiderForEmployment",
        label: "To Consider for Employment (Yes/No)",
      },
    ];

    const transformed = criteria.map((criterion) => {
      const row: any = { criteria: criterion.label, total: 0 };
      rawData.forEach((score, index) => {
        let value;
        if (criterion.field === "ConsiderForEmployment") {
          value = score.ConsiderForEmployment
            ? score.ConsiderForEmployment
            : score.ConsiderForEmployment;
        } else {
          value = Number(score[criterion.field]) || 0;
          row.total += value;
        }
        row[`interviewer_${index + 1}`] = value;
      });

      return row;
    });

    const totalRow: any = { criteria: "Total", total: 0 };
    rawData.forEach((_, index) => {
      const totalScore = transformed.reduce((sum, row) => {
        if (typeof row[`interviewer_${index + 1}`] === "number") {
          return sum + row[`interviewer_${index + 1}`];
        }
        return `${sum} / ${40}`;
      }, 0);

      totalRow[`interviewer_${index + 1}`] = totalScore;
      totalRow.total += totalScore;
    });

    transformed.push(totalRow);

    return transformed;
  };

  const transformedData = transformScoreData(scoreData);
  const interviewerCount = scoreData.length;

  const handleCancel = () => {
    console.log("Cancel clicked");
  };

  const handleReject = () => {
    console.log("Rejected clicked");
  };

  const handleSelect = () => {
    console.log("Selected clicked");
  };

  const tabs = [
    {
      label: TabName.Scorecard,
      value: "tab2",
      content: (
        <div
          style={{
            fontFamily:
              "Segoe UI, Segoe UI Web (West European), Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif",
          }}
        >
          <Card
            variant="outlined"
            sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
          >
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ color: "#EF3340", fontSize: "18px" }}>
                  Scorecard Details
                </h2>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "10px 20px",
                    borderRadius: "4px",
                  }}
                >
                  <span style={{ color: "#EF3340", fontSize: "16px" }}>
                    {`Profile from ${agentName} Agencies`}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f8f8",
                  padding: "15px",
                  marginBottom: "20px",
                  fontSize: "15px",
                  color: "-moz-initial",
                  fontWeight: "600",
                }}
              >
                <span style={{ marginRight: "20px" }}>
                  Interview Panel member: {scoreData.length}
                </span>
                {interviewPanelTitles.map((interviewer, index) => (
                  <span key={index} style={{ marginRight: "20px" }}>
                    Interviewer {index + 1} - {interviewer}
                  </span>
                ))}
              </div>
              <div style={{ overflowX: "auto" }}>
                <DataTable
                  value={transformedData}
                  responsiveLayout="scroll"
                  stripedRows
                >
                  <Column field="criteria" header="Criteria" />
                  {Array.from({ length: interviewerCount }).map((_, index) => (
                    <Column
                      key={index}
                      field={`interviewer_${index + 1}`}
                      header={`Interviewer ${index + 1}`}
                    />
                  ))}
                </DataTable>
              </div>
              <CustomLabel value={" View Justifications"} />
              <PrimaryButton
                style={{
                  borderColor: "rgb(205, 45, 45)",
                  backgroundColor: "#EF3340",
                  color: "white",
                  borderRadius: "10px",
                }}
                onClick={OpenComments}
              >
                {" "}
                View
              </PrimaryButton>

              <CustomTextArea
                label="HOD Feedback"
                value={justification}
                onChange={setJustification}
                error={isError}
                placeholder="Enter justification"
                mandatory={true}
              />
              <div className="ms-Grid-col ms-lg12">
                <SignatureCheckbox
                  label={"I hereby agree for submitted this request"}
                  checked={Checkboxs}
                  error={false}
                  onChange={(value: boolean) => setCheckbox(value)}
                />
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg12">
                  <CustomSignature
                    Name={
                      (props.userDetails[0].FirstName ?? "") +
                      " " +
                      (props.userDetails[0]?.MiddleName ?? "") +
                      " " +
                      (props.userDetails[0]?.LastName ?? "")
                    }
                    JobTitleInEnglish={props.userDetails[0].JopTitleEnglish}
                    JobTitleInFrench={props.userDetails[0].JopTitleFrench}
                    Department={props.userDetails[0].DepartmentName}
                    Date={formState.SignDate.toString()}
                    TermsAndCondition={Checkboxs}
                  />
                </div>
              </div>
            </CardContent>
            {Checkboxs && (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleCancel}
                  sx={{
                    bgcolor: "#EF3340",
                    color: "white",
                    "&:hover": { bgcolor: "#d42130" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleReject}
                  sx={{
                    bgcolor: "#EF3340",
                    color: "white",
                    "&:hover": { bgcolor: "#d42130" },
                  }}
                >
                  Rejected
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSelect}
                  sx={{
                    bgcolor: "#EF3340",
                    color: "white",
                    "&:hover": { bgcolor: "#d42130" },
                  }}
                >
                  Selected
                </Button>
              </div>
            )}
          </Card>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);
    const newTabNames = [
      { tabName: props.stateValue?.TabName },
      { tabName: props.stateValue?.ButtonAction },
      { tabName: activeTabObj?.label },
    ];

    if (JSON.stringify(TabNameData) !== JSON.stringify(newTabNames)) {
      setTabNameData(newTabNames);
    }
  }, [activeTab, tabs, props.stateValue, TabNameData]);

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  return (
    <>
      {MainComponent ? (
        <CustomLoader isLoading={isLoading}>
          <div className="menu-card">
            <BreadcrumbsComponent
              items={tabs}
              initialItem={activeTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              handleCancel={handleCancel}
            />
          </div>
        </CustomLoader>
      ) : (
        <CommentView
          onClose={() => {
            setMainComponent(true);
            setactiveTab(activeTab);
          }}
          comments={CommentData}
        />
      )}
    </>
  );
};

export default HodScoreCard;
