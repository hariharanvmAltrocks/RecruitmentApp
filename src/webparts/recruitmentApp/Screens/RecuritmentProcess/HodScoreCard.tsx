import * as React from "react";
import { Tab, Checkbox, Button, Card, CardContent } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { AssignPositionDialog } from "./AssignPositionDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomTextArea from "../../components/CustomTextArea";

const scoreData = [
  {
    criteria: "Qualification (Relevant)",
    interviewer1: 5,
    interviewer2: 5,
    interviewer3: 5,
  },
  {
    criteria: "Experience (Relevant)",
    interviewer1: 4,
    interviewer2: 5,
    interviewer3: 4,
  },
  { criteria: "Knowledge", interviewer1: 4, interviewer2: 4, interviewer3: 4 },
  {
    criteria: "Energy Level",
    interviewer1: 4,
    interviewer2: 4,
    interviewer3: 4,
  },
  {
    criteria: "Meets All Job Requirements",
    interviewer1: 3,
    interviewer2: 4,
    interviewer3: 4,
  },
  {
    criteria: "Will Contribute to the Culture Required",
    interviewer1: 4,
    interviewer2: 4,
    interviewer3: 4,
  },
  {
    criteria: "Equal Experience/ Other Criteria",
    interviewer1: 4,
    interviewer2: 4,
    interviewer3: 4,
  },
  {
    criteria: "Other Criteria Recognized by Panel",
    interviewer1: 3,
    interviewer2: 4,
    interviewer3: 3,
  },
  {
    criteria: "To Consider for Employment (Yes/No)",
    interviewer1: "No",
    interviewer2: "Yes",
    interviewer3: "Yes",
  },
  {
    criteria: "Total",
    interviewer1: "31/40",
    interviewer2: "34/40",
    interviewer3: "32/40",
  },
];

const HodScoreCard = (props: any) => {
  const [tabValue, setTabValue] = React.useState("1");
  const [isAgreed, setIsAgreed] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [justification, setJustification] = React.useState("");
  const [isError] = React.useState(false);

  const handleCancel = () => {
    // Add your cancel logic here
  };

  const handleReject = () => {
    console.log("Rejected clicked");
    // Add your reject logic here
  };

  const handleSelect = () => {
    console.log("Selected clicked");
    // Add your select logic here
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ padding: "20px" }}>
      <TabContext value={tabValue}>
        <TabList
          onChange={handleChange}
          aria-label="scorecard tabs"
          sx={{
            backgroundColor: "#EF3340",
            borderRadius: "6px",
            padding: "16px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginTop: "60px",
          }}
        >
          <Tab label="Review Scorecard" value="1" />
        </TabList>
        <TabPanel value="1">
          <Card sx={{ marginBottom: "20px", boxShadow: 3 }}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  color: "red",
                }}
              >
                <h2>Scorecard Details</h2>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "10px 20px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <span style={{ color: "#EF3340" }}>
                    Profile from XYZ Agencies
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span>Interview Panel member: 3</span>
                <span style={{ marginLeft: "20px" }}>Interviewer 1 - Sam</span>
                <span style={{ marginLeft: "20px" }}>Interviewer 2 - Jack</span>
                <span style={{ marginLeft: "20px" }}>Interviewer 3 - Alan</span>
              </div>

              <DataTable value={scoreData} rows={5}>
                <Column
                  field="criteria"
                  header="Criteria"
                  style={{ width: "30%" }}
                />
                <Column
                  field="interviewer1"
                  header="Interviewer 1"
                  align="center"
                  alignHeader="center"
                  style={{ width: "20%" }}
                />
                <Column
                  field="interviewer2"
                  header="Interviewer 2"
                  align="center"
                  alignHeader="center"
                  style={{ width: "20%" }}
                />
                <Column
                  field="interviewer3"
                  header="Interviewer 3"
                  align="center"
                  alignHeader="center"
                  style={{ width: "20%" }}
                />
              </DataTable>
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

              <Checkbox
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <span>I hereby agree for submitting this request</span>
              <div>
                <p style={{ fontWeight: "500" }}>Mathew</p>
                <p style={{ color: "#EF3340" }}>Head of Department</p>
                <p style={{ color: "#EF3340" }}>Chef de département</p>
                <p>HR Department</p>
                <p>21-01-2023</p>
              </div>
            </CardContent>
          </Card>
          {isAgreed && (
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
        </TabPanel>
      </TabContext>
      <AssignPositionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        jobTitle="Superintendent II, HR (SUP 001)"
        candidateName="Winston Yusak Hegemur"
      />
    </div>
  );
};

export default HodScoreCard;
