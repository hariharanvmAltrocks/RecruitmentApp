import * as React from "react";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { alertPropsData, InterviewPanaldata } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import {
  ColorCode,
  DocumentLibraray,
  HRMSAlertOptions,
  ListNames,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleID,
  RoleProfileMaster,
  TabName,
  WorkflowAction,
  workflowStatusApi,
} from "../../utilities/Config";
import { QuestionItem, ScoreCardData } from "../../Models/RecuritmentVRR";
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
import CommentView from "./CommentView";
import {
  ActionUpdate,
  CommentsDatas,
} from "../../Services/InterviewProcess/IInterviewProcessService";
import "../../App.css";
import ReuseButton from "../../components/ReuseButton";
import { WorkflowJson } from "../../Models/ApIInterface";
import IsValid from "../../components/Validation";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HODQuestionsView from "./HODQuestionsView";

type ValidationError = {
  Comments: boolean;
  Checkboxalidation: boolean;
};

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
    JobRequestID: "",
    Comments: "",
  });

  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [MainComponent, setMainComponent] = React.useState<boolean>(true);
  const [CommentData, setCommentsData] = React.useState<
    CommentsDatas[] | undefined
  >();
  const [validationErrors, setValidationError] =
    React.useState<ValidationError>({
      Comments: false,
      Checkboxalidation: false,
    });
  const [scoreData, setScoreData] = React.useState<any[]>([]);
  const [interviewPanelTitles, setInterviewPanelTitles] = React.useState<
    string[]
  >([]);
  const candidateID = props.stateValue?.ID;
  const [Checkbox, setCheckbox] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [agentName, setIagentName] = React.useState<"">("");
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
      IsScoreSheetUploaded: "",
    },
  ]);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [ViewQABtn, setViewQABtn] = React.useState<boolean>(false);
  const [transformedDataforQuestions, setTransformedDataforQuestions] =
    React.useState([]);
  const [interviewerCount, setInterviewerCount] = React.useState(0);
  const [questionnaire, setquestionnaire] = React.useState<QuestionItem[]>([]);

  const fetchCandidateDatas = React.useCallback(
    async (idParam: number) => {
      try {
        setIsLoading(true);

        const filterConditions = [
          {
            FilterKey: "CandidateID/Id",
            Operator: "eq",
            FilterValue: idParam,
          },
        ];

        const [scoreResponse, positionResponse] = await Promise.all([
          InterviewServices.HRMSCandidateScoreCard(
            "",
            filterConditions,
            idParam
          ),
          InterviewServices.GetCombinedCandidatePositionDetails(
            " ",
            filterConditions
          ),
        ]);

        if (scoreResponse?.status === 200 && scoreResponse?.data?.length) {
          const candidateData = scoreResponse.data.filter(
            (candidate: any) => candidate.CandidateID === idParam
          );

          const filteredScores = candidateData.flatMap(
            (candidate: any) =>
              candidate.CandidateScoreCard?.filter(
                (score: any) => candidate.ID === score.InterviewPanelID
              ) || []
          );

          setInterviewPanelTitles(
            candidateData.map((panel: any) => panel.InterviewPanelTitle)
          );
          setScoreData(filteredScores);

          let questionScores: any = {};
          let interviewerCount = 0;
          filteredScores.forEach((score: any, interviewerIndex: number) => {
            if (score.QuestionJson) {
              score.QuestionJson.forEach((q: any) => {
                const key = Object.keys(q)[0];
                if (!questionScores[key]) {
                  questionScores[key] = { criteria: key };
                }
                questionScores[key][`interviewer_${interviewerIndex + 1}`] =
                  q[key];
              });
            }
            interviewerCount++;
          });

          setTransformedDataforQuestions(Object.values(questionScores));
          setInterviewerCount(interviewerCount);
        } else {
          setScoreData([]);
          setInterviewPanelTitles([]);
          setTransformedDataforQuestions([]);
          setInterviewerCount(0);
        }

        if (positionResponse?.status === 200 && positionResponse?.data) {
          const candidate = positionResponse.data.find(
            (c: any) => c.ID === idParam
          );
          setIagentName(candidate?.ExternalAgentDetails?.AgentName || "");
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
        setScoreData([]);
        setInterviewPanelTitles([]);
        setTransformedDataforQuestions([]);
        setInterviewerCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [candidateID]
  );

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

  const handleInputChangeTextArea = (
    value: string | any,
    StateValue: string
  ) => {
    setCandidateData((prevState) => ({
      ...prevState,
      [StateValue]: value,
    }));
    setValidationError((prevState) => ({
      ...prevState,
      [StateValue]: false,
    }));
  };

  //Questionnaries
  const handleAccordionChange =
    (accordion: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? accordion : null);
    };

  const handleCancel = () => {
    setIsLoading(true);
    let CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          props.navigation("/RecurimentProcess/HodScoreCard/CandidateList", {
            state: {
              ID: CandidateData?.RecruitmentID,
              Status: props.stateValue?.Status,
              TabName: props.stateValue?.TabName,
              ButtonAction: props.stateValue?.PreviousTabName,
              JobCode: CandidateData?.JobCode,
              StatusId: props.stateValue?.StatusId,
            },
          });
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

  const OpenComments = () => {
    setMainComponent(false);

    if (scoreData.length === 0) {
      return;
    }

    const recruitmentID = scoreData[0].RecruitmentID;

    let filterConditions = [
      {
        FilterKey: "CandidateID/Id",
        Operator: "eq",
        FilterValue: candidateID,
      },
    ];
    let Conditions = "";

    InterviewServices.HRMSCandidateScoreCard(
      filterConditions,
      Conditions,
      candidateID
    )
      .then((CommentsList) => {
        if (CommentsList?.status === 200 && CommentsList?.data?.length) {
          const candidateData = CommentsList.data.filter(
            (candidate: any) =>
              candidate.CandidateID === candidateID &&
              candidate.RecruitmentID === recruitmentID
          );

          setCommentsData(candidateData);
        } else {
          setCommentsData([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setCommentsData([]);
      });
  };

  const View_Btnfn = async () => {
    const getQuestion = await GetPortalJobsService.getQuestionnaire(
      CandidateData.JobCode
    );
    console.log(getQuestion, "getQuestion");

    if (getQuestion.status === ResponeStatus.SUCCESS) {
      setquestionnaire(getQuestion?.data ?? []);
      setViewQABtn(true);
      setMainComponent(false);
    } else {
      let APIErrorMsg = {
        Message: RecuritmentHRMsg.APIErrorMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          } else {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(APIErrorMsg);
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      label: TabName.ViewCandidateDetails,
      value: "tab1",
      content: (
        <>
          <div className="agencies_card ">
            <LabelHeaderComponents
              value={`Profile from ${
                agentName ? agentName + " Agencies" : "Candidate"
              }`}
            />
          </div>
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
                      <LabelHeaderComponents
                        value={`Status - ${props.stateValue?.Status}`}
                      >
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
                      value={
                        CandidateData.InterviewDate
                          ? new Date(CandidateData.InterviewDate)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")
                          : ""
                      }
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setCandidateData((prevState) => ({
                          ...prevState,
                          InterviewDate: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Interviewed by"
                      value={
                        CandidateData.interviewPanelTitles?.join(", ") || ""
                      }
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
                    <CustomLabel value={"RoleProfile Documents"} />
                    <CustomViewDocument
                      Attachment={CandidateData.RoleProfileDocument}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"Advertisement Documents"} />
                    <CustomViewDocument
                      Attachment={CandidateData.AdvertisementDocument}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"Candidate Resume"} />
                    <CustomViewDocument
                      Attachment={CandidateData.CandidateCVDoc}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ),
    },
    {
      label: TabName.ViewScoreDetails,
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
                  // marginBottom: "20px",
                  marginBottom: "12px",
                }}
              >
                <h2
                  style={{
                    color: ColorCode.ButtonColorCode.ButtonColor,
                    fontSize: "18px",
                  }}
                >
                  Scorecard Details
                </h2>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "10px 20px",
                    borderRadius: "7px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <span
                    style={{
                      color: ColorCode.LabelStyleColorCode.LabelStyleColor,
                      position: "relative",
                      fontSize: "18px",
                      fontWeight: 700,
                      top: "7px",
                    }}
                  >
                    {`Profile from ${
                      agentName ? agentName + " Agencies" : "Candidate"
                    }`}
                  </span>
                </div>
              </div>

              <div
                style={{
                  // backgroundColor: "#f8f8f8",
                  padding: "15px",
                  marginBottom: "0px",
                  fontSize: "14px",
                  color: "-moz-initial",
                  fontWeight: "600",
                }}
              >
                <span style={{ marginRight: "20px" }}>
                  Interview Panel member: {interviewPanelTitles.length}
                </span>
                {interviewPanelTitles.map((interviewer, index) => (
                  <span key={index} style={{ marginRight: "20px" }}>
                    Interviewer {index + 1} - {interviewer}
                  </span>
                ))}
              </div>

              {/* <div style={{ overflowX: "auto" }}>
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
              </div> */}

              <div>
                <Accordion
                  sx={{
                    marginBottom: "16px",
                    border: "1px solid rgb(191, 182, 182)",
                    borderRadius: "4px",
                  }}
                  expanded={expanded === "accordion1"}
                  onChange={handleAccordionChange("accordion1")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Question Evaluation Scorecard
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ overflowX: "auto" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          position: "relative",
                          right: "10px",
                        }}
                      >
                        <ReuseButton
                          Style={{
                            minWidth: "158px",
                            fontSize: "13px",
                            paddingBottom: "10px",
                            display: "flex",
                            flexDirection: "column",
                            height: "35px",
                            paddingTop: "10px",
                            backgroundColor:
                              ColorCode.ButtonColorCode.ButtonColor,
                            color: "white",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: "5px",
                          }}
                          onClick={() => View_Btnfn()}
                          label="VIEW Q & A"
                          spacing={4}
                        />
                      </div>

                      <DataTable
                        value={transformedDataforQuestions}
                        responsiveLayout="scroll"
                        stripedRows
                      >
                        <Column field="criteria" header="Criteria" />
                        {Array.from({ length: interviewerCount }).map(
                          (_, index) => (
                            <Column
                              key={index}
                              field={`interviewer_${index + 1}`}
                              header={`Interviewer ${index + 1}`}
                            />
                          )
                        )}
                      </DataTable>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  sx={{
                    marginBottom: "16px",
                    border: "1px solid rgb(191, 182, 182)",
                    borderRadius: "4px",
                  }}
                  expanded={expanded === "accordion2"}
                  onChange={handleAccordionChange("accordion2")}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Overall Evaluation Scorecard
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ overflowX: "auto" }}>
                      <DataTable
                        value={transformedData}
                        responsiveLayout="scroll"
                        stripedRows
                      >
                        <Column field="criteria" header="Criteria" />
                        {Array.from({ length: interviewerCount }).map(
                          (_, index) => (
                            <Column
                              key={index}
                              field={`interviewer_${index + 1}`}
                              header={`Interviewer ${index + 1}`}
                            />
                          )
                        )}
                      </DataTable>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg12">
                  <div
                    className="ms-Grid-col ms-lg4"
                    style={{ marginLeft: "-5px" }}
                  >
                    <CustomLabel value={" View Justifications"} />
                    <ReuseButton
                      Style={{
                        minWidth: "117px",
                        fontSize: "13px",
                        paddingBottom: "24px",
                        display: "flex",
                        flexDirection: "column",
                        height: "41px",
                        paddingTop: "23px",
                        backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                        color: "white",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      label="VIEW"
                      imgSrc={require("../../assets/viewSubmision-white.svg")}
                      imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                      imgAlt="View"
                      imgAltHover="Hovered View"
                      onClick={OpenComments}
                      spacing={4}
                    />
                  </div>
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg12">
                  <CustomTextArea
                    label="HOD Feedback"
                    value={CandidateData.Comments}
                    error={validationErrors.Comments}
                    onChange={(value) =>
                      handleInputChangeTextArea(value, "Comments")
                    }
                    mandatory={true}
                  />
                </div>
              </div>
              <div className="ms-Grid-col ms-lg12">
                <SignatureCheckbox
                  label={TabName.CheckboxContent}
                  checked={Checkbox}
                  error={validationErrors.Checkboxalidation}
                  onChange={(value: boolean) => {
                    setCheckbox(value);
                    setValidationError((prevState) => ({
                      ...prevState,
                      Checkboxalidation: false,
                    }));
                  }}
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
                    TermsAndCondition={Checkbox}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

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
          op?.JobCode
        );

        let advertisementDocuments: any[] = [];
        if (response.status === 200 && response.data?.length > 0) {
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
          RoleProfileresponse.data?.length > 0
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
          InterviewDate: op?.InterviewDate,
          JobRequestID: op?.JobRequestID,
        }));

        await fetchCandidateDatas(ID);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);
    if (activeTab === "tab1") {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: "View" },
          { tabName: props.stateValue?.PreviousTabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
        return newTabNames;
      });
    } else {
      setTabNameData((prevTabNames) => {
        const newTabNames = [
          { tabName: props.stateValue?.TabName },
          { tabName: "View" },
          { tabName: props.stateValue?.PreviousTabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: TabName.ViewCandidateDetails },
          { tabName: TabName.ViewScoreDetails },
        ];

        const uniqueTabNames = newTabNames.filter(
          (item, index, self) =>
            item.tabName &&
            self.findIndex((t) => t.tabName === item.tabName) === index
        );

        return uniqueTabNames;
      });
    }

    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        await fetchCandidateData(props.stateValue?.ID);

        const filterConditions = [
          {
            FilterKey: "CandidateIDId",
            Operator: "eq",
            FilterValue: props.stateValue?.ID,
          },
        ];

        const panelResponse = await InterviewServices.GetInterviewPanelDetails(
          filterConditions
        );

        if (
          panelResponse?.data &&
          Array.isArray(panelResponse.data) &&
          panelResponse.data.length > 0
        ) {
          const filteredPanels = panelResponse.data.filter(
            (item) => item.CandidateID === props.stateValue?.ID
          );

          const interviewPanelTitles = filteredPanels.map(
            (panel) => panel.InterviewPanelTitle
          );
          console.log(InterviewPanelData);
          setInterviewPanelData((prev) => ({
            ...prev,
            interviewPanelTitles: interviewPanelTitles || [],
          }));

          setCandidateData((prev) => ({
            ...prev,
            interviewPanelTitles: interviewPanelTitles || [],
          }));
        }
      } catch (err) {
        console.error("Error in fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAllData();
  }, [props.stateValue?.ID, activeTab]);

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };
  const Validation = (): boolean => {
    const { Comments } = CandidateData;

    let errors = {
      Comments: false,
      Checkboxalidation: false,
    };
    switch (props.CurrentRoleID) {
      case RoleID.HOD: {
        if (props.stateValue?.tab === "tab1") {
          errors.Comments = !IsValid(Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
        }
        break;
      }
    }

    setValidationError((prevState) => ({
      ...prevState,
      ...errors,
    }));

    return Object.values(errors).some((error) => error);
  };
  const Submit_fn = async (Action: string) => {
    if (!CandidateData.Comments.trim()) {
      setValidationError((prevState) => ({
        ...prevState,
        Comments: true,
        Checkboxalidation: true,
      }));
      return;
    }
    const isValid = !Validation();
    if (!isValid) return;

    const createFilter = (workflowStatus: string): WorkflowJson => ({
      workflowStatus,
      jobRequestId: Number(CandidateData.JobRequestID),
      comments: CandidateData.Comments,
      actionBy: props.CurrentUserRole,
    });

    let obj: ActionUpdate = { ActionId: 0, Id: 0, ItemCreated: "" };
    let CandidateDatas: WorkflowJson = {
      workflowStatus: "",
      jobRequestId: 0,
      comments: "",
      actionBy: "",
    };
    let SuccessMessage: string = "";
    switch (Action) {
      case "Selected":
        obj = {
          ActionId: WorkflowAction.Approved,
          Id: props.stateValue.ID,
          ItemCreated: "Yes",
        };
        CandidateDatas = createFilter(
          workflowStatusApi.CandidateSelectedIPanel
        );
        SuccessMessage = RecuritmentHRMsg.CandidateSelected;
        break;

      case "Rejected":
        obj = {
          ActionId: WorkflowAction.Reject,
          Id: props.stateValue.ID,
          ItemCreated: "Yes",
        };
        CandidateDatas = createFilter(
          workflowStatusApi.CandidateRejectedIPanel
        );
        SuccessMessage = RecuritmentHRMsg.CandidateRejected;
        break;

      default:
        console.error(Action);
        return;
    }

    try {
      setIsLoading(true);

      await GetPortalJobsService.UpdateCandidateStatus(CandidateDatas);
      const selectionResponse = await InterviewServices.CandidateSeletionApi(
        obj,
        ListNames.HRMSRecruitmentCandidatePersonalDetails
      );

      if (selectionResponse.status === 200) {
        setAlertPopupOpen(true);
        setalertProps({
          Message: SuccessMessage,
          Type: HRMSAlertOptions.Success,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              props.navigation(
                "/RecurimentProcess/HodScoreCard/CandidateList",
                {
                  state: {
                    ID: CandidateData?.RecruitmentID,
                    Status: props.stateValue?.Status,
                    TabName: props.stateValue?.TabName,
                    ButtonAction: props.stateValue?.PreviousTabName,
                    JobCode: CandidateData?.JobCode,
                    StatusId: props.stateValue?.StatusId,
                  },
                }
              );
            }
            setAlertPopupOpen(false);
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
              additionalButtons={[
                {
                  label: "Selected",
                  onClick: async () => {
                    await Submit_fn("Selected");
                  },
                },
                {
                  label: "Rejected",
                  onClick: async () => {
                    await Submit_fn("Rejected");
                  },
                },
              ]}
            />
          </div>

          {AlertPopupOpen ? (
            <CustomAlert
              {...alertProps}
              onClose={() => setAlertPopupOpen(false)}
            />
          ) : null}
        </CustomLoader>
      ) : ViewQABtn ? (
        <HODQuestionsView
          questionnaire={questionnaire}
          Ok_btnfn={() => {
            setViewQABtn(false);
            setMainComponent(true);
          }}
        />
      ) : (
        <>
          <CommentView
            onClose={() => {
              setMainComponent(true);
              setactiveTab(activeTab);
            }}
            comments={CommentData}
          />
        </>
      )}
    </>
  );
};
export default HodViewScorecard;
