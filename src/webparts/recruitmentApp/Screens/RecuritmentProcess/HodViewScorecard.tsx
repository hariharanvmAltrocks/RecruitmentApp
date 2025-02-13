import * as React from "react";
import {
  CommonServices,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { alertPropsData, InterviewPanaldata } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import {
  DocumentLibraray,
  HRMSAlertOptions,
  RecuritmentHRMsg,
  RoleProfileMaster,
  TabName,
} from "../../utilities/Config";
import { ScoreCardData } from "../../Models/RecuritmentVRR";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";

import { Card, CardContent } from "@mui/material";

import CustomViewDocument from "../../components/CustomViewDocument";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomTextArea from "../../components/CustomTextArea";
import CustomSignature from "../../components/CustomSignature";
import SignatureCheckbox from "../../components/SignatureCheckbox";
import CustomLabel from "../../components/CustomLabel";
import { PrimaryButton } from "office-ui-fabric-react";
import CommentView from "./CommentView";
import { CommentsDatas } from "../../Services/InterviewProcess/IInterviewProcessService";

const HodViewScorecard = (props: any) => {
  const todaydate = new Date();
  const [CandidateData, setCandidateData] = React.useState<ScoreCardData>({
    CandidateID: 0,
    RecruitmentID: 0,
    JobCode: "",
    JobCodeId: 0,
    PassportID: "",
    FristName: "",
    MiddleName: "",
    LastName: "",
    FullName: "",
    ResidentialAddress: "",
    DOB: "",
    ContactNumber: "",
    Email: "",
    Nationality: "",
    Gender: "",
    TotalYearOfExperiance: "",
    Skills: "",
    LanguageKnown: "",
    ReleventExperience: "",
    Qualification: "",
    Qualifications: { key: 0, text: "" },
    Experience: { key: 0, text: "" },
    Knowledge: { key: 0, text: "" },
    Energylevel: { key: 0, text: "" },
    Requirements: { key: 0, text: "" },
    contributeculture: { key: 0, text: "" },
    ExpatExperienceCongolese: { key: 0, text: "" },
    CriteriaRecognised: { key: 0, text: "" },
    CandidateCVDoc: [],
    Employment: "",
    EvaluationFeedback: "",
    OverAllEvaluationFeedback: "",
    SignDate: new Date(
      todaydate.getFullYear(),
      todaydate.getMonth(),
      todaydate.getDate(),
      todaydate.getHours(),
      todaydate.getMinutes(),
      todaydate.getSeconds()
    ),
    AdvertisementDocument: [],
    RoleProfileDocument: [],
    PositionTitle: "",
    interviewPanelTitles: [] as string[],
  });
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [MainComponent, setMainComponent] = React.useState<boolean>(true);
  const [CommentData, setCommentsData] = React.useState<
    CommentsDatas[] | undefined
  >();
  const [justification, setJustification] = React.useState("");
  const [isError] = React.useState(false);
  const [scoreData, setScoreData] = React.useState<any[]>([]);
  const [interviewPanelTitles, setInterviewPanelTitles] = React.useState<
    string[]
  >([]);
  const candidateID = props.stateValue?.ID;
  const [Checkboxs, setCheckbox] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [InterviewPanelData, setInterviewPanelData] = React.useState<
    InterviewPanaldata[]
  >([
    {
      ID: 0,
      CandidateID: 0,
      RecruitmentID: 0,
      InterviewLevel: "",
      InterviewPanel: 0,
      InterviewPanalNames: [],
      InterviewPanelTitle: "",
    },
  ]);

  const fetchCandidateData = async (ID: number) => {
    setIsLoading(true);
    try {
      let filterConditions = [];
      let Conditions = "";
      filterConditions.push({
        FilterKey: "ID",
        Operator: "eq",
        FilterValue: ID,
      });

      const data = await getVRRDetails.GetInterviewPanelCandidateDetails(
        filterConditions,
        Conditions
      );

      if (data.status === 200 && data.data !== null) {
        const op = data.data[0];

        const response = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RecruitmentAdvertisementDocument,
          String(op?.RecruitmentID),
          op?.JobCode
        );

        let advertisementDocuments: any[] = [];
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          advertisementDocuments = response.data.map((doc: any) => ({
            name: doc.name,
            content: doc.content,
          }));
        }

        const RoleProfileresponse = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RoleProfileMaster,
          op?.JobCode,
          RoleProfileMaster.RoleProfile
        );

        let roleProfileDocuments: any[] = [];
        if (
          RoleProfileresponse.status === 200 &&
          RoleProfileresponse.data &&
          RoleProfileresponse.data.length > 0
        ) {
          roleProfileDocuments = RoleProfileresponse.data.map((doc: any) => ({
            name: doc.name,
            content: doc.content,
          }));
        }

        setCandidateData((prevState) => ({
          ...prevState,
          CandidateID: op?.ID,
          RecruitmentID: op?.RecruitmentID,
          JobCode: op?.JobCode,
          JobCodeId: op?.JobCodeId,
          PassportID: op?.PassportID,
          FullName: op?.FullName,
          ResidentialAddress: op?.ResidentialAddress,
          DOB: op?.DOB,
          ContactNumber: op?.ContactNumber,
          Email: op?.Email,
          Nationality: op?.Nationality,
          Gender: op?.Gender,
          TotalYearOfExperiance: op?.TotalYearOfExperiance,
          Skills: op?.Skills,
          LanguageKnown: op?.LanguageKnown,
          ReleventExperience: op?.ReleventExperience,
          Qualification: op?.Qualification,
          CandidateCVDoc: op?.CandidateCVDoc,
          AdvertisementDocument: advertisementDocuments,
          RoleProfileDocument: roleProfileDocuments,
          PositionTitle: op?.PositionTitle,
        }));
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

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

  const fetchCandidateDatas = React.useCallback(
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
        const scoreResponse = await InterviewServices.HRMSCandidateScoreCard(
          "",
          filterConditions,
          candidateID
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
        void fetchCandidateDatas(interviewPanels);
      });
    }
  }, [candidateID, fetchCandidateDatas]);

  // const transformScoreData = (rawData: any[]) => {
  //   const criteria = [
  //     { field: "RelevantQualification", label: "Relevant Qualification" },
  //     { field: "ReleventExperience", label: "Relevant Experience" },
  //     { field: "Knowledge", label: "Knowledge" },
  //     { field: "EnergyLevel", label: "Energy Level" },
  //     { field: "MeetJobRequirement", label: "Meet Job Requirement" },
  //     {
  //       field: "ContributeTowardsCultureRequried",
  //       label: "Culture Contribution",
  //     },
  //     { field: "OtherCriteriaScore", label: "Other Criteria Score" },
  //     { field: "ConsiderForEmployment", label: "Consider for Employment" },
  //     { field: "Feedback", label: "Feedback" },
  //   ];

  //   const transformed = criteria.map((criterion) => {
  //     const row: any = { criteria: criterion.label, total: 0 };
  //     rawData.forEach((score, index) => {
  //       const value = Number(score[criterion.field]) || 0;
  //       row[`interviewer_${index + 1}`] = value;
  //       row.total += value;
  //     });
  //     return row;
  //   });

  //   const totalRow: any = { criteria: "Total", total: 0 };
  //   rawData.forEach((_, index) => {
  //     const totalScore = transformed.reduce(
  //       (sum, row) => sum + (row[`interviewer_${index + 1}`] || 0),
  //       0
  //     );
  //     totalRow[`interviewer_${index + 1}`] = totalScore;
  //     totalRow.total += totalScore;
  //   });

  //   transformed.push(totalRow);
  //   return transformed;
  // };
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

  // const handleReject = () => {
  //   console.log("Rejected clicked");
  // };

  // const handleSelect = () => {
  //   console.log("Selected clicked");
  // };

  const handleCancel = () => {
    setIsLoading(true);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          props.navigation("/RecurimentProcess");
          setAlertPopupOpen(false);
        } else {
          setAlertPopupOpen(false);
        }
      },
    };

    setAlertPopupOpen(true);
    setalertProps(CancelAlert);
    setIsLoading(false);
  };

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
      console.log("Comments", candidateData);
    } else {
      console.warn("No comments found for RecruitmentID:", recruitmentID);
      setCommentsData([]);
    }
    console.log("setCommentsData", CommentsList.data);
  };
  const tabs = [
    {
      label: TabName.CandidateDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Job Title - ${CandidateData.PositionTitle}`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents value={`Status - ${""}`}>
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Job Grade"
                    value={CandidateData.JobCode}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Candidate ID"
                    value={CandidateData.CandidateID}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        TotalYearOfExperiance: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Applicant Name"
                    value={CandidateData.FullName}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Applicant Surname"
                    value={CandidateData.LastName}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Nationality"
                    value={CandidateData.Nationality}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        TotalYearOfExperiance: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Gender and Age"
                    value={CandidateData.Gender}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Highest Relevant Qualification"
                    value={CandidateData.Qualification}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Experiance in Mining Industry (Years)"
                    value={CandidateData.TotalYearOfExperiance}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        TotalYearOfExperiance: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Experiance in Related Field (Years)"
                    value={CandidateData.ReleventExperience}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Date of Interview"
                    //value={CandidateData.DOB}
                    value={new Date(CandidateData.DOB)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                        ContactNumber: value,
                      }))
                    }
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomInput
                    label="Interviewed by"
                    value={CandidateData.interviewPanelTitles?.join(", ") || ""}
                    disabled={true}
                    mandatory={false}
                    onChange={(value) =>
                      setCandidateData((prevState) => ({
                        ...prevState,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                <LabelHeaderComponents value={"Attachments"} />
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg4">
                  <CustomViewDocument
                    Attachment={CandidateData.RoleProfileDocument}
                    Label={"Role Profile Documents"}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomViewDocument
                    Attachment={CandidateData.AdvertisementDocument}
                    Label={"Advertisement Documents"}
                  />
                </div>
                <div className="ms-Grid-col ms-lg4">
                  <CustomViewDocument
                    Attachment={CandidateData.CandidateCVDoc}
                    Label={"Candidate Resume"}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
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
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg12">
                <div
                  className="ms-Grid-col ms-lg4"
                  style={{ marginLeft: "-5px" }}
                >
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
                </div>
              </div>
            </div>
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
                  Date={CandidateData.SignDate.toString()}
                  TermsAndCondition={Checkboxs}
                />
              </div>
            </div>
          </CardContent>
          {/* {Checkboxs && (
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
            )} */}
        </Card>
      ),
    },
  ];
  React.useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);

    if (activeTab === "tab1") {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
        return newTabNames;
      });
    }

    const fetchData = () => {
      setIsLoading(true);

      fetchCandidateData(props.stateValue?.ID)
        .then(() => {
          const filterConditions = [
            {
              FilterKey: "CandidateIDId",
              Operator: "eq",
              FilterValue: props.stateValue?.ID,
            },
          ];

          return InterviewServices.GetInterviewPanelDetails(filterConditions);
        })
        .then((response) => {
          if (
            response?.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            const filteredPanels = response.data.filter(
              (item) => item.CandidateID === props.stateValue?.ID
            );

            if (filteredPanels.length > 0) {
              const interviewPanelTitles = filteredPanels.map(
                (panel) => panel.InterviewPanelTitle
              );
              console.log("InterviewPanelData", InterviewPanelData);
              setInterviewPanelData((prevState) => ({
                ...prevState,
                interviewPanelTitles: interviewPanelTitles || [],
              }));

              setCandidateData((prevState) => ({
                ...prevState,
                interviewPanelTitles: interviewPanelTitles || [],
              }));
            }
          }
        })
        .catch((error) => {});
    };

    fetchData();
  }, [props.stateValue?.ID, activeTab]);

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
    console.log("", newItem);
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

          {AlertPopupOpen ? (
            <CustomAlert
              {...alertProps}
              onClose={() => setAlertPopupOpen(false)}
            />
          ) : null}
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
export default HodViewScorecard;
