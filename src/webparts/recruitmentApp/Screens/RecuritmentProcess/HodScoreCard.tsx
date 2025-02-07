"use client";
import * as React from "react";
import { Button, Card, CardContent } from "@mui/material";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomTextArea from "../../components/CustomTextArea";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import { TabName } from "../../utilities/Config";
import { AssignPositionDialog } from "./AssignPositionDialog";
import CustomSignature from "../../components/CustomSignature";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import { ScoreData } from "../../Models/RecuritmentVRR";

const HodScoreCard = (props: any) => {
  console.log("Props", props);
  const [justification, setJustification] = React.useState("");
  const [isError] = React.useState(false);
  const [scoreData, setScoreData] = React.useState<any[]>([]);
  const [interviewPanelTitles, setInterviewPanelTitles] = React.useState<
    string[]
  >([]);
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("tab2");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const candidateID = props.stateValue?.ID;
  const [Checkboxs, setCheckbox] = React.useState<boolean>(false);
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
      const interviewResponse = await getVRRDetails.HRMSCandidateScoreCard(
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
        const scoreResponse = await getVRRDetails.HRMSCandidateScoreCard(
          "",
          filterConditions,
          candidateID
        );
        console.log("scoreResponse", scoreResponse);
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
          } else {
            setScoreData([]);
            setInterviewPanelTitles([]);
            console.warn("No scores found.");
          }
        } else {
          setScoreData([]);
          setInterviewPanelTitles([]);
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

  React.useEffect(() => {
    if (candidateID) {
      void fetchInterviewPanelData().then((interviewPanels) => {
        void fetchCandidateData(interviewPanels);
      });
    }
  }, [candidateID, fetchCandidateData]);

  const transformScoreData = (rawData: any[]) => {
    const criteria = [
      { field: "RelevantQualification", label: "Relevant Qualification" },
      { field: "ReleventExperience", label: "Relevant Experience" },
      { field: "Knowledge", label: "Knowledge" },
      { field: "EnergyLevel", label: "Energy Level" },
      { field: "MeetJobRequirement", label: "Meet Job Requirement" },
      {
        field: "ContributeTowardsCultureRequried",
        label: "Culture Contribution",
      },
      { field: "OtherCriteriaScore", label: "Other Criteria Score" },
      { field: "ConsiderForEmployment", label: "Consider for Employment" },
      { field: "Feedback", label: "Feedback" },
    ];

    const transformed = criteria.map((criterion) => {
      const row: any = { criteria: criterion.label, total: 0 };
      rawData.forEach((score, index) => {
        const value = Number(score[criterion.field]) || 0;
        row[`interviewer_${index + 1}`] = value;
        row.total += value;
      });
      return row;
    });

    const totalRow: any = { criteria: "Total", total: 0 };
    rawData.forEach((_, index) => {
      const totalScore = transformed.reduce(
        (sum, row) => sum + (row[`interviewer_${index + 1}`] || 0),
        0
      );
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
              <h2 style={{ color: "#EF3340" }}>Scorecard Details</h2>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "10px 20px",
                  borderRadius: "4px",
                }}
              >
                <span style={{ color: "#EF3340" }}>
                  Profile from XYZ Agencies
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f8f8f8",
                padding: "15px",
                marginBottom: "20px",
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
              <DataTable value={transformedData} responsiveLayout="scroll">
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

            <div style={{ position: "relative", top: "14px" }}>
              View Justification
            </div>
            <Button
              variant="outlined"
              sx={{
                marginTop: "20px",
                bgcolor: "#EF3340",
                color: "white",
                "&:hover": { bgcolor: "#EF3340", color: "white" },
              }}
              onClick={() => setIsDialogOpen(true)}
            >
              View
            </Button>
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
          <AssignPositionDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            jobTitle="Superintendent II, HR (SUP 001)"
            candidateName="Winston Yusak Hegemur"
          />
        </Card>
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
    setActiveTab(newItem);
    console.log("Breadcrumb changed to:", newItem);
  };

  return (
    <CustomLoader isLoading={isLoading}>
      <div className="menu-card">
        <React.Fragment>
          <BreadcrumbsComponent
            items={tabs}
            initialItem={activeTab}
            TabName={TabNameData}
            onBreadcrumbChange={handleBreadcrumbChange}
          />
        </React.Fragment>
      </div>
    </CustomLoader>
  );
};

export default HodScoreCard;
