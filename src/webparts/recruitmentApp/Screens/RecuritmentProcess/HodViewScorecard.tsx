import * as React from "react";
import {
  CommonServices,
  GetPortalJobsService,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import {
  CheckboxContent,
  Choices,
  ColorCode,
  DocumentLibraray,
  HRMSAlertOptions,
  InterviewLevels,
  // labelName,
  ListNames,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleID,
  RoleProfileMaster,
  StatusId,
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
  AssignPositionID,
} from "../../Services/InterviewProcess/IInterviewProcessService";
import "../../App.css";
import ReuseButton from "../../components/ReuseButton";
import { WorkflowJson } from "../../Models/ApIInterface";
import IsValid from "../../components/Validation";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HODQuestionsView from "./HODQuestionsView";
import { Chip } from "@mui/material";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import SPServices from "../../Services/SPService/SPServices";
import { useMediaQuery } from "@mui/material";
import { CommentsData } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";

type ValidationError = {
  Comments: boolean;
  Checkboxalidation: boolean;
  CandidateStatus: boolean;
  PositionID: boolean; // Added PositionID to the type
};

type ActionValue = {
  CandidateStatus: string;
  Comments: string;
};
type FieldsEditableType = {
  radioGroup: boolean;
  comments: boolean;
  visibleButtons: string[];
};
type InterviewedLevelValue = {
  Levels: string;
  Grade: string;
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
    ExternalAgentName: "",
    JobGrade: "",
    InterviewLevels: [],
    GPA: "",
    ConflictsOfInterest: "",
    disability: "",
    disabilityReason: "",
  });

  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [MainComponent, setMainComponent] = React.useState<boolean>(true);
  const [CommentData, setCommentsData] = React.useState({
    level1: [] as CommentsData[],
    level2: [] as CommentsData[],
  });
  const [validationErrors, setValidationError] =
    React.useState<ValidationError>({
      Comments: false,
      Checkboxalidation: false,
      CandidateStatus: false,
      PositionID: false,
    });
  const [scoreData, setScoreData] = React.useState<any[]>([]);

  const candidateID: number = props.stateValue?.ID;
  const [Checkbox, setCheckbox] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [ViewQABtn, setViewQABtn] = React.useState<boolean>(false);
  const [transformedDataforQuestions, setTransformedDataforQuestions] =
    React.useState([]);
  const [questionnaire, setquestionnaire] = React.useState<QuestionItem[]>([]);

  const [InterviewedLevel, setInterviewedLevel] =
    React.useState<InterviewedLevelValue>({
      Levels: "",
      Grade: "",
    });
  const [actionValue, setActionValue] = React.useState<ActionValue>({
    CandidateStatus: "",
    Comments: "",
  });
  const [positionOptions, setPositionOptions] = React.useState<
    AutoCompleteItem[]
  >([]);

  const [selectedPosition, setSelectedPosition] =
    React.useState<AutoCompleteItem | null>(null);

  const [fieldsEditable, setFieldsEditable] =
    React.useState<FieldsEditableType>({
      radioGroup: true,
      comments: true,
      visibleButtons: [],
    });
  const [interviewPanelTitlesLevel1, setInterviewPanelTitlesLevel1] =
    React.useState<string[]>([]);
  const [interviewPanelTitlesLevel2, setInterviewPanelTitlesLevel2] =
    React.useState<string[]>([]);

  const [currentRoleID, setCurrentRoleID] = React.useState<number>(0);

  React.useEffect(() => {
    let userRole = props.CurrentRoleID.filter(
      (role: number) =>
        role === RoleID.RecruitmentHR ||
        role === RoleID.LineManager ||
        role === RoleID.HOD ||
        role === RoleID.InterviewPanel
    );
    setCurrentRoleID(userRole[0] ?? 0);
  }, [props.stateValue?.StatusId]);

  const handleAutoComplete = (item: AutoCompleteItem | null) => {
    setSelectedPosition(item);
    setValidationError((prevState) => ({
      ...prevState,
      PositionID: false,
    }));
  };

  const fetchInterviewPanelDetails = () => {
    setIsLoading(true);
    const filterConditions = [
      {
        FilterKey: "CandidateID/Id",
        Operator: "eq",
        FilterValue: candidateID,
      },
    ];

    InterviewServices.getInterviewPanelDetails(
      "",
      filterConditions,
      candidateID,
      props.EmployeeList
    )
      .then((scoreResponse) => {
        if (scoreResponse?.status === 200) {
          const candidatePanels = scoreResponse?.data.filter(
            (candidate: any) => candidate.CandidateID === candidateID
          );
          // setInterviewPanelTitles(
          //   Array.from(
          //     new Set(
          //       candidatePanels
          //         .map((panel: any) => panel.Name?.trim())
          //         .filter((name: string | undefined) => name && name.length > 0)
          //     )
          //   )
          // );

          const filteredScores = candidatePanels
            .map((candidate: any) => {
              const score = candidate.ScoreCard;
              return score && candidate.ID === score.InterviewPanelID
                ? [score]
                : [];
            })
            .reduce((acc: any[], val: any[]) => acc.concat(val), []);
          setScoreData(filteredScores);
          let questionScores: any = {};
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
          });

          setTransformedDataforQuestions(Object.values(questionScores));
        } else {
          setScoreData([]);
          // setInterviewPanelTitles([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching panel/score data:", error);
        setScoreData([]);
        // setInterviewPanelTitles([]);
        setTransformedDataforQuestions([]);
      });
  };

  const fetchInterviewPanel = () => {
    const candidateID: number = props.stateValue?.ID;
    setIsLoading(true);

    const filterConditions = [
      {
        FilterKey: "CandidateID/Id",
        Operator: "eq",
        FilterValue: candidateID,
      },
    ];

    InterviewServices.GetPanelLeveldata(filterConditions, props.EmployeeList)
      .then((scoreResponse) => {
        if (scoreResponse?.status === 200) {
          const groupedPanelData = scoreResponse.data as Record<
            string,
            string[]
          >;

          // Set titles by level
          setInterviewPanelTitlesLevel1(groupedPanelData["Level 1"] || []);
          setInterviewPanelTitlesLevel2(groupedPanelData["Level 2"] || []);
        } else {
          setInterviewPanelTitlesLevel1([]);
          setInterviewPanelTitlesLevel2([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching panel data:", error);
        setInterviewPanelTitlesLevel1([]);
        setInterviewPanelTitlesLevel2([]);
      });
  };

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
  // const GPA: any = props?.stateValue?.GPA
  //   ? props?.stateValue?.GPA
  //   : CandidateData?.GPA;
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
    const CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          if (props.stateValue?.TabName === TabName.Evaluation) {
            if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
              props.navigation("/ReviewProfileList", {
                // state: {
                //   activeTab: "tab3",
                // },
              });
            } else if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
              props.navigation("/InterviewPanelList", {
                // state: {
                //   activeTab: "tab3",
                // },
              });
            } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
              props.navigation("/RecurimentProcess", {
                // state: {
                //   activeTab: "tab3",
                // },
              });
            }
          } else {
            props.navigation("/RecurimentProcess/HodScoreCard/CandidateList", {
              state: {
                ID: CandidateData?.RecruitmentID,
                Status: props.stateValue?.Status,
                TabName: props.stateValue?.TabName,
                ButtonAction: props.stateValue?.PreviousTabName,
                JobCode: CandidateData?.JobCode,
                StatusId: props.stateValue?.StatusId,
                NoOfPosition: props.stateValue.NoOfPosition,
                JobCodeId: props.stateValue.JobCodeId,
                Department: props.stateValue.Department,
              },
            });
          }
          setAlertPopupOpen(false);
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
    try {
      setMainComponent(false);
      let filterConditions = [
        {
          FilterKey: "CandidateID/Id",
          Operator: "eq",
          FilterValue: candidateID,
        },
      ];
      let Conditions = "";
      const level1Response = await InterviewServices.getInterviewPanelDetails(
        filterConditions,
        Conditions,
        candidateID,
        props.EmployeeList
      );
      let level1Comments: any[] = [];
      if (level1Response?.status === 200) {
        level1Comments = level1Response.data.filter(
          (item: any) => item.CandidateID === candidateID
        );
      }
      const level2Response =
        await InterviewServices.getCandidateLevel2ScoreCardData(
          Conditions,
          filterConditions,
          candidateID,
          props.EmployeeList
        );

      let level2Comments: any[] = [];
      if (level2Response?.status === 200) {
        level2Comments = level2Response.data.filter(
          (item: any) => item.CandidateID === candidateID
        );
      }
      setCommentsData({
        level1: level1Comments,
        level2: level2Comments,
      });
    } catch (error) {
      console.error("Error in OpenComments:", error);
      setCommentsData({
        level1: [],
        level2: [],
      });
    }
  };

  const handleRadioChange = (value: string) => {
    setActionValue((prev) => ({ ...prev, CandidateStatus: value }));
    let visibleButtons: string[] = [];
    if (value === "Yes") {
      visibleButtons = ["Selected"];
    } else if (value === "No") {
      visibleButtons = ["Rejected"];
    } else if (value === "On Hold") {
      visibleButtons = ["OnHold"];
    }
    const statusId = props.stateValue?.StatusId;

    if (statusId === StatusId.Selected) {
      visibleButtons = value === "Yes" ? [] : visibleButtons;
    }
    if (statusId === StatusId.OnHoldbyHOD) {
      visibleButtons = value === "On Hold" ? [] : visibleButtons;
    }

    setFieldsEditable((prev) => ({
      ...prev,
      visibleButtons,
    }));
  };

  React.useEffect(() => {
    const statusId = props.stateValue?.StatusId;
    const comments = CandidateData.Comments || "";

    switch (statusId) {
      case StatusId.RejectedbyHOD:
        setActionValue({ CandidateStatus: "No", Comments: comments });
        setFieldsEditable({
          radioGroup: false,
          comments: false,
          visibleButtons: [],
        });
        break;

      case StatusId.Selected:
        setActionValue({ CandidateStatus: "Yes", Comments: comments });
        setFieldsEditable({
          radioGroup: true,
          comments: true,
          visibleButtons: [],
        });
        break;

      case StatusId.OnHoldbyHOD:
        setActionValue({ CandidateStatus: "On Hold", Comments: comments });
        setFieldsEditable({
          radioGroup: true,
          comments: true,
          visibleButtons: [],
        });
        break;

      default:
        break;
    }
  }, [props.stateValue?.StatusId]);

  const View_Btnfn = async () => {
    setIsLoading(true);
    const getQuestion = await GetPortalJobsService.getQuestionnaire(
      CandidateData.JobCode
    );
    if (getQuestion.status === ResponeStatus.SUCCESS) {
      setquestionnaire(getQuestion?.data ?? []);
      setViewQABtn(true);
      setMainComponent(false);
      setIsLoading(false);
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

  React.useEffect(() => {
    const getRecruitmentGradeLevel = async () => {
      const filterConditions = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.RecruitmentID,
        },
      ];

      const response = await getVRRDetails.GetRecruitmentDetails(
        filterConditions,
        ""
      );

      const grade = response.data[0]?.PatersonGrade;
      const gradeLevelResponse = await CommonServices.GetGradeLevel(grade);

      setInterviewedLevel((prevState: any) => ({
        ...prevState,
        Grade: grade,
        Levels: gradeLevelResponse.data[0]?.Level,
      }));
    };

    void getRecruitmentGradeLevel();
  }, []);

  const isMobile = useMediaQuery("(max-width:600px)");
  const tabs = [
    {
      label: TabName.ViewCandidateDetails,
      value: "tab1",
      content: (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "-4%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: isMobile ? "flex-start" : "center",
                backgroundColor: "white",
                borderRadius: "20px",
                padding: isMobile ? "10px" : "5px 10px",
                boxShadow: "0px 5px 10px 0px #0F4B8426",
                margin: isMobile ? "10px auto" : "0",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#EF3340",
                    fontWeight: "400",
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    <LabelHeaderComponents
                      value={`Profile from ${
                        CandidateData.ExternalAgentName
                          ? CandidateData.ExternalAgentName + " Agencies"
                          : "Candidate"
                      }`}
                    />
                  </span>
                </p>
              </div>
            </div>
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
                        value={`Job Title - ${CandidateData.PositionTitle} (${CandidateData.JobCode})`}
                      >
                        {" "}
                      </LabelHeaderComponents>
                    </div>
                    <div
                      className="ms-Grid-col ms-lg6"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <LabelHeaderComponents
                        value={`Status - ${props.stateValue?.Status}`}
                      >
                        {" "}
                      </LabelHeaderComponents>
                    </div>
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
                      label="Gender"
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
                      label="No of Interview Level's"
                      value={InterviewedLevel.Levels}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Grade"
                      value={InterviewedLevel.Grade}
                      disabled={true}
                      mandatory={false}
                    />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  {CandidateData?.ConflictsOfInterest && (
                    <div className="ms-Grid-col ms-lg4">
                      <CustomInput
                        label="Conflicts Of Interest"
                        value={CandidateData?.ConflictsOfInterest}
                        disabled={true}
                        mandatory={false}
                      />
                    </div>
                  )}
                  {CandidateData?.disability && (
                    <div className="ms-Grid-col ms-lg4">
                      <CustomInput
                        label="Disability"
                        value={CandidateData?.disability}
                        disabled={true}
                        mandatory={false}
                      />
                    </div>
                  )}
                </div>

                {CandidateData?.disabilityReason &&
                  CandidateData?.disability === Choices.Yes && (
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <CustomTextArea
                          label="Disability Details"
                          value={CandidateData?.disabilityReason}
                          disabled={true}
                          mandatory={false}
                          error={false}
                        />
                      </div>
                    </div>
                  )}

                <div className="ms-Grid-row">
                  <div
                    className="ms-Grid-col ms-lg12"
                    style={{ position: "relative", top: "14px" }}
                  >
                    <label
                      style={{
                        fontWeight: 600,
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Interview Panel Level 1
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        minHeight: "38px",
                        background: "none",
                        backgroundColor: "rgb(243, 242, 241)",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "rgb(243, 242, 241)",
                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px 4px",
                      }}
                    >
                      {interviewPanelTitlesLevel1 &&
                      interviewPanelTitlesLevel1.length > 0
                        ? interviewPanelTitlesLevel1.map((title, index) => (
                            <Chip
                              key={index}
                              label={`${index + 1}. ${title}`}
                              size="small"
                              sx={{
                                backgroundColor: "rgb(243, 242, 241)",
                                fontWeight: 500,
                                color: "rgb(85, 82, 79)",
                                cursor: "not-allowed",
                                // opacity: 0.6,
                              }}
                            />
                          ))
                        : null}
                    </div>
                  </div>
                  {props.stateValue?.InterviewLevel ===
                    InterviewLevels.Levels2 &&
                  interviewPanelTitlesLevel2.length > 0 ? (
                    <div
                      className="ms-Grid-col ms-lg12"
                      style={{
                        position: "relative",
                        top: "14px",
                        marginTop: "2%",
                      }}
                    >
                      <label
                        style={{
                          fontWeight: 600,
                          marginBottom: "4px",
                          display: "block",
                        }}
                      >
                        Interview Panel Level 2
                      </label>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          minHeight: "38px",
                          background: "none",
                          backgroundColor: "rgb(243, 242, 241)",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "rgb(243, 242, 241)",
                          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px 4px",
                        }}
                      >
                        {interviewPanelTitlesLevel2 &&
                        interviewPanelTitlesLevel2.length > 0
                          ? interviewPanelTitlesLevel2.map((title, index) => (
                              <Chip
                                key={index}
                                label={`${index + 1}. ${title}`}
                                size="small"
                                sx={{
                                  backgroundColor: "rgb(243, 242, 241)",
                                  fontWeight: 500,
                                  color: "rgb(85, 82, 79)",
                                  cursor: "not-allowed",
                                  // opacity: 0.6,
                                }}
                              />
                            ))
                          : null}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="ms-Grid-row" style={{ marginTop: "22px" }}>
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents value={"Attachments"} />
                  </div>
                </div>

                <div className="ms-Grid-row">
                  {/* <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"RoleProfile Documents"} />
                    <CustomViewDocument
                      Attachment={CandidateData.RoleProfileDocument}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"Advertisement Documents (French)"} />
                    <CustomViewDocument
                      Attachment={CandidateData.AdvertisementDocument}
                    />
                  </div> */}
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"Candidate Resume"} />
                    <CustomViewDocument
                      Attachment={CandidateData.CandidateCVDoc}
                    />
                  </div>
                </div>
                {/* <div className="ms-Grid-row">
                  <div
                    className="ms-Grid-col ms-lg2"
                    style={{ position: "relative", right: "1px" }}
                  >
                    <div>
                      <CustomLabel
                        value={labelName.ViewJobAdvetisement}
                        // mandatory={true}
                      />
                      <ReuseButton
                        Style={{
                          minWidth: "117px",
                          fontSize: "13px",
                          paddingBottom: "24px",
                          display: "flex",
                          flexDirection: "column",
                          height: "41px",
                          paddingTop: "23px",
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
                          color: "white",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        label="VIEW"
                        imgSrc={require("../../assets/viewSubmision-white.svg")}
                        imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                        imgAlt="View"
                        imgAltHover="Hovered View"
                        onClick={async () => {
                          setPreview(true);
                          setMainComponent(false);
                        }}
                        spacing={4}
                      />
                    </div>
                  </div>
                </div> */}
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
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "-4%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: isMobile ? "flex-start" : "center",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: isMobile ? "10px" : "5px 10px",
                  boxShadow: "0px 5px 10px 0px #0F4B8426",
                  margin: isMobile ? "10px auto" : "0",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#EF3340",
                      fontWeight: "400",
                      fontSize: isMobile ? "12px" : "14px",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      <LabelHeaderComponents
                        value={`Profile from ${
                          CandidateData.ExternalAgentName
                            ? CandidateData.ExternalAgentName + " Agencies"
                            : "Candidate"
                        }`}
                      />
                    </span>
                  </p>
                </div>
              </div>
            </div>

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
                    {props.stateValue?.TabName === TabName.Evaluation ||
                    props.stateValue?.StatusId ===
                      StatusId.PendingwithHODtoAssignPositionID
                      ? "Scorecard Details - Level 1"
                      : "Scorecard Details"}
                  </h2>
                </div>
                {/* <div
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
              </div> */}

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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "-3%",
                  }}
                >
                  <h2
                    style={{
                      color: ColorCode.ButtonColorCode.ButtonColor,
                      fontSize: "18px",
                    }}
                  >{`OVERALL GRADE POINT AVERAGE (GPA) - ${CandidateData.GPA} /5.0`}</h2>
                </div>
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
                          {/* {Array.from({ length: interviewerCount }).map(
                          (_, index) => (
                            <Column
                              key={index}
                              field={`interviewer_${index + 1}`}
                              header={`Interviewer ${index + 1}`}
                            />
                          )
                        )} */}
                          {interviewPanelTitlesLevel1.map((name, index) => (
                            <Column
                              key={index}
                              field={`interviewer_${index + 1}`}
                              header={
                                <>
                                  <div style={{ fontSize: "12px" }}>
                                    Interviewer {index + 1}
                                  </div>
                                  <div style={{ fontSize: "14px" }}>
                                    ({name})
                                  </div>
                                </>
                              }
                            />
                          ))}
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
                          {interviewPanelTitlesLevel1.map((name, index) => (
                            <Column
                              key={index}
                              field={`interviewer_${index + 1}`}
                              header={
                                <>
                                  <div style={{ fontSize: "12px" }}>
                                    Interviewer {index + 1}
                                  </div>
                                  <div style={{ fontSize: "14px" }}>
                                    ({name})
                                  </div>
                                </>
                              }
                            />
                          ))}
                        </DataTable>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
                {props.stateValue?.TabName !== TabName.Evaluation && (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg5">
                      <CustomRadioGroup
                        label={"Do you wish to select this candidate?"}
                        value={actionValue.CandidateStatus}
                        options={["Yes", "No", "On Hold"]}
                        error={validationErrors.CandidateStatus}
                        mandatory={true}
                        onChange={(item) => handleRadioChange(item)}
                        disabled={!fieldsEditable.radioGroup}
                      />
                    </div>
                  </div>
                )}

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
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
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

                {props?.stateValue?.StatusId === StatusId.Selected && (
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg12">
                      <div
                        className="ms-Grid-col ms-lg4"
                        style={{ marginLeft: "-5px" }}
                      >
                        <CustomAutoComplete
                          label="Assign PositionID"
                          options={positionOptions}
                          value={selectedPosition}
                          onChange={(item: AutoCompleteItem | null) =>
                            handleAutoComplete(item)
                          }
                          error={validationErrors.PositionID}
                          disabled={true}
                          mandatory={true}
                          placeholder="Select a position"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {(props?.stateValue?.StatusId ===
                  StatusId.PendingwithHODtoselectthecandidate ||
                  props?.stateValue?.StatusId === StatusId.OnHoldbyHOD ||
                  props?.stateValue?.StatusId ===
                    StatusId.PendingwithHODtoAssignPositionID) &&
                  actionValue.CandidateStatus === "Yes" && (
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-lg12">
                        <div
                          className="ms-Grid-col ms-lg4"
                          style={{ marginLeft: "-5px" }}
                        >
                          <CustomAutoComplete
                            label="Assign PositionID"
                            options={positionOptions}
                            value={selectedPosition}
                            onChange={(item: AutoCompleteItem | null) =>
                              handleAutoComplete(item)
                            }
                            error={validationErrors.PositionID}
                            disabled={false}
                            mandatory={true}
                            placeholder="Select a position"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg12">
                    <CustomTextArea
                      label={
                        props?.stateValue?.StatusId ===
                          StatusId.PendingwithHODtoAssignPositionID ||
                        props?.stateValue?.StatusId ===
                          StatusId.InterviewScheduledforLevel2
                          ? "Feedback - Level 2"
                          : "Feedback - Level 1"
                      }
                      value={CandidateData.Comments}
                      error={validationErrors.Comments}
                      onChange={(value) =>
                        handleInputChangeTextArea(value, "Comments")
                      }
                      mandatory={true}
                      disabled={!fieldsEditable.comments}
                    />
                  </div>
                </div>
                <div className="ms-Grid-col ms-lg12">
                  <SignatureCheckbox
                    label={CheckboxContent.HODscorecarddetails}
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
          </>
        </div>
      ),
    },
  ];

  const fetchCandidateData = async (ID: number) => {
    setIsLoading(true);
    try {
      const filterConditions = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: ID,
        },
      ];

      const data = await InterviewServices.GetCombinedCandidatePositionDetails(
        filterConditions,
        "",
        props.EmployeeList
      );

      if (data?.status === 200) {
        const op = data?.data[0];
        const agentName = op.ExternalAgentDetails?.AgentName;

        const interviewLevels = Array.from(
          new Set(
            (op?.HRMSCandidateScoreCard as { InterviewLevel: any }[])?.map(
              (item) => item.InterviewLevel
            )
          )
        );

        // Fetch advertisement documents
        const response = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RecruitmentAdvertisementDocument,
          op?.JobCode
        );
        const advertisementDocuments =
          response?.status === 200
            ? response.data.map((doc: any) => ({
                name: doc.name,
                content: doc.content,
              }))
            : [];

        // Fetch role profile documents
        const roleProfileResponse = await CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RoleProfileMaster,
          op?.JobCode,
          RoleProfileMaster.RoleProfile
        );
        const roleProfileDocuments =
          roleProfileResponse?.status === 200
            ? roleProfileResponse.data.map((doc: any) => ({
                name: doc.name,
                content: doc.content,
              }))
            : [];

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
          ExternalAgentName: agentName,
          JobGrade: op?.JobGrade,
          InterviewLevels: interviewLevels,
          HRMSCandidateScoreCard: op?.HRMSCandidateScoreCard || [],
          GPA: op?.GPA,
          ConflictsOfInterest: op?.ConflictsOfInterest,
          disability: op?.disability,
          disabilityReason: op?.disabilityReason,
          // Comments:
          //   props.stateValue?.TabName !== "Evaluation" &&
          //   Array.isArray(op?.CandidateComments?.[op.ID]) &&
          //   op?.CandidateComments?.[op.ID].length > 0
          //     ? op.CandidateComments[op.ID][0].Comments
          //     : "",
        }));
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSelectedCandidateDetails = async () => {
    try {
      const filterConditions = [
        {
          FilterKey: "CandidateID/Id",
          Operator: "eq",
          FilterValue: candidateID,
        },
      ];
      let Conditions = "";

      const response = await InterviewServices.GetSelectedCandidateDetailsByHOD(
        filterConditions,
        Conditions
      );

      if (response.status === 200) {
        const candidateDetails = response.data[0];

        if (props.stateValue?.StatusId === StatusId?.Selected) {
          const positionId = candidateDetails.PositionID;
          const positionValue = candidateDetails.Position; // 6
          setSelectedPosition({
            key: positionValue,
            text: positionId,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching selected candidate details:", error);
    }
  };
  React.useEffect(() => {
    if (candidateID && props.stateValue?.StatusId === StatusId?.Selected) {
      void fetchSelectedCandidateDetails();
    }
  }, [candidateID, props?.stateValue?.Status]);

  const PositionData = async () => {
    const filterConditions = [
      {
        FilterKey: "JobCode",
        Operator: "eq",
        FilterValue: props.stateValue.JobCodeId,
      },
      {
        FilterKey: "Department",
        Operator: "eq",
        FilterValue: props.stateValue.Department,
      },
      {
        FilterKey: "PositionIDStatus",
        Operator: "eq",
        FilterValue: "Vacant",
      },
    ];
    const response = await InterviewServices.GetHRMSPositionDetails(
      filterConditions,
      "and"
    );
    setPositionOptions(response?.data || []);
  };

  React.useEffect(() => {
    if (
      props.stateValue?.StatusId ===
        StatusId.PendingwithHODtoAssignPositionID ||
      props.stateValue?.StatusId ===
        StatusId.PendingwithHODtoselectthecandidate ||
      props.stateValue?.StatusId === StatusId.Selected ||
      props.stateValue?.StatusId === StatusId.OnHoldbyHOD
    ) {
      void PositionData();
    }
  }, []);
  React.useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);

    const isEvaluationTab = props.stateValue?.TabName === "Evaluation";

    if (isEvaluationTab) {
      const evaluationTabNames = [
        { tabName: props.stateValue?.TabName },
        { tabName: "View" },
        { tabName: activeTabObj?.label },
      ];
      setTabNameData(evaluationTabNames);
    } else if (activeTab === "tab1") {
      const newTabNames = [
        { tabName: props.stateValue?.TabName },
        { tabName: "View" },
        { tabName: props.stateValue?.PreviousTabName },
        { tabName: props.stateValue?.ButtonAction },
        { tabName: activeTabObj?.label },
      ];
      setTabNameData(newTabNames);
    } else {
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

      setTabNameData(uniqueTabNames);
    }

    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        await fetchCandidateData(props.stateValue?.ID);
      } catch (err) {
        console.error("Error in fetching candidate data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAllData();
    void fetchInterviewPanelDetails();
    void fetchInterviewPanel();
    // void PositionData();
  }, [props.stateValue?.ID, activeTab]);

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };
  const Validation = (Action: string): boolean => {
    const { Comments } = CandidateData;

    let errors = {
      Comments: false,
      Checkboxalidation: false,
      CandidateStatus: false,
      PositionID: false,
    };

    if (props.CurrentRoleID.includes(RoleID.HOD)) {
      if (props.stateValue?.tab === "tab1") {
        errors.Comments = !IsValid(Comments);
        errors.Checkboxalidation = !IsValid(Checkbox);
        if (props.stateValue?.TabName !== TabName.Evaluation) {
          errors.CandidateStatus = !IsValid(actionValue.CandidateStatus);
        }
        if (
          props.stateValue.StatusId ===
            StatusId.PendingwithHODtoAssignPositionID ||
          props.stateValue.StatusId ===
            StatusId.PendingwithHODtoselectthecandidate ||
          props.stateValue.StatusId === StatusId.OnHoldbyHOD
        ) {
          if (Action === "Selected") {
            errors.PositionID = !IsValid(selectedPosition?.text);
          }
        }
      }
    }
    if (props.stateValue.StatusId === StatusId.InterviewScheduledforLevel2) {
      errors.Comments = !IsValid(Comments);
      errors.Checkboxalidation = !IsValid(Checkbox);
    }
    setValidationError((prevState) => ({
      ...prevState,
      ...errors,
    }));
    return Object.values(errors).some((error) => error);
  };

  const handleAssignPosition = async (data: {
    positionId: AutoCompleteItem | null;
    Reasons: string;
  }) => {
    if (!data.positionId) {
      console.error("Position ID is not provided");
      return;
    }

    const positionIdString =
      typeof data.positionId === "string"
        ? data.positionId
        : (data.positionId as any).key || (data.positionId as any).text;

    if (!positionIdString) {
      console.error("Position ID string is invalid");
      return;
    }

    setIsLoading(true);
    try {
      const filterConditions = [
        {
          FilterKey: "PositionID",
          Operator: "eq",
          FilterValue: data.positionId.text,
        },
      ];

      const GetPositionID = await getVRRDetails.GetDataInList(
        ListNames.HRMSPositionIDMaster,
        filterConditions,
        "",
        "*,JobCode/JobCode",
        "JobCode"
      );

      if (!GetPositionID.data || GetPositionID.data.length === 0) {
        console.error("No matching Position ID found");
        setIsLoading(false);
        return;
      }

      const selectedPosition = GetPositionID.data[0];
      const assignPositionPayload: AssignPositionID = {
        PositionIDId: selectedPosition.ID,
        CandidateIDId: candidateID,
        RecruitmentIDId: props.stateValue.ID,
      };
      const res = await InterviewServices.AssignPositionID(
        assignPositionPayload,
        ListNames.HRMSSelectedCandidateDetailsByHOD
      );

      if (res.status === 200) {
        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSPositionIDMaster,
          RequestJSON: { PositionIDStatus: "Recruitment InProgress" },
          ID: selectedPosition.ID,
        });
      }
    } catch (error) {
      console.error("Error in handleAssignPosition:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const insertOrUpdateCandidateCommentLevel1 = async () => {
    try {
      const filterConditions = [
        {
          FilterKey: "CandidateIDId",
          Operator: "eq",
          FilterValue: CandidateData.CandidateID,
        },
      ];

      const response = await InterviewServices.getCandidateLevel1ScoreCard(
        filterConditions
      );

      if (response?.status === 200 && response.data?.length > 0) {
        const matchingComment = response.data.find(
          (comment) =>
            comment.CandidateID === CandidateData.CandidateID &&
            comment.RoleId === currentRoleID
        );

        if (matchingComment) {
          const updatePayload = {
            Comments: CandidateData.Comments,
            Level: InterviewedLevel.Levels,
          };

          const updateResponse = await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSRecruitmentCandidateComments,
            RequestJSON: updatePayload,
            ID: matchingComment.ID || 0,
          });
          if (updateResponse?.data?.ID) {
            console.log("", CandidateData.CandidateID);
          } else {
            console.error("Failed to update comment");
          }
        } else {
          await SPServices.SPAddItem({
            Listname: ListNames.HRMSRecruitmentCandidateComments,
            RequestJSON: {
              CandidateIDId: CandidateData.CandidateID,
              Comments: CandidateData.Comments,
              RoleId: currentRoleID,
              Level: InterviewedLevel.Levels,
            },
          });
        }
      } else {
        await SPServices.SPAddItem({
          Listname: ListNames.HRMSRecruitmentCandidateComments,
          RequestJSON: {
            CandidateIDId: CandidateData.CandidateID,
            Comments: CandidateData.Comments,
            RoleId: currentRoleID,
            Level: InterviewedLevel.Levels,
          },
        });
      }
    } catch (error) {
      console.error("Error in insertOrUpdateCandidateCommentLevel1:", error);
    }
  };

  const insertOrUpdateLevel2ScorecardComment = async () => {
    try {
      const filterConditions = [
        {
          FilterKey: "CandidateIDId",
          Operator: "eq",
          FilterValue: CandidateData.CandidateID,
        },
      ];

      const response = await InterviewServices.getCandidateLevel2ScoreCard(
        filterConditions
      );

      if (response?.status === 200 && response.data?.length > 0) {
        const matchingComment = response.data.find(
          (comment: any) =>
            comment.CandidateID?.ID === CandidateData.CandidateID &&
            comment.RoleId === currentRoleID
        );

        if (matchingComment) {
          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSCandidateLevel2ScoreCard,
            RequestJSON: {
              Comments: CandidateData.Comments,
              Level: InterviewedLevel.Levels,
            },
            ID: matchingComment.ID || 0,
          });
        } else {
          await SPServices.SPAddItem({
            Listname: ListNames.HRMSCandidateLevel2ScoreCard,
            RequestJSON: {
              CandidateIDId: CandidateData.CandidateID,
              Comments: CandidateData.Comments,
              RoleId: currentRoleID,
              Level: InterviewedLevel.Levels,
            },
          });
        }
      } else {
        await SPServices.SPAddItem({
          Listname: ListNames.HRMSCandidateLevel2ScoreCard,
          RequestJSON: {
            CandidateIDId: CandidateData.CandidateID,
            Comments: CandidateData.Comments,
            RoleId: currentRoleID,
            Level: InterviewedLevel.Levels,
          },
        });
      }
    } catch (error) {
      console.error("Error in insertOrUpdateLevel2ScorecardComment:", error);
    }
  };

  // const hasMinimumComments = async (candidateID: number): Promise<boolean> => {
  //   try {
  //     const filterConditions = [
  //       {
  //         FilterKey: "CandidateIDId",
  //         Operator: "eq",
  //         FilterValue: candidateID,
  //       },
  //     ];

  //     const response = await InterviewServices.getCandidateLevel2ScoreCard(
  //       filterConditions
  //     );
  //     const uniqueRoles = new Set(response.data.map((item) => item.RoleId));

  //     return uniqueRoles.size >= 3;
  //   } catch (error) {
  //     console.error("Error checking minimum comments:", error);
  //     return false;
  //   }
  // };

  const Submit_fn = async (Action: string) => {
    const isValid = !Validation(Action);
    if (!isValid) {
      console.error("Validation failed");
      return;
    }
    setIsLoading(true);
    if (props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2) {
      await insertOrUpdateLevel2ScorecardComment();
      const CurrentUserResponse = await CommonServices.getUserGuidByEmail(
        props.CurrentUserEmailId
      );
      const currentUserKey = CurrentUserResponse.data?.key?.toString();

      const InterviewPanelResponse =
        await InterviewServices.GetInterviewPanelDetails([
          {
            FilterKey: "CandidateIDId",
            Operator: "eq",
            FilterValue: props.stateValue?.ID,
          },
        ]);

      if (!InterviewPanelResponse.data) {
        return;
      }

      const matchingPanels = InterviewPanelResponse.data.filter(
        (panel: any) => props.stateValue?.ID === panel.CandidateID
      );

      if (matchingPanels.length === 0) {
        return;
      }
      const userPanels = matchingPanels.filter(
        (panel: any) => panel.InterviewPanel === Number(currentUserKey)
      );
      if (userPanels.length === 0) {
        return;
      }
      for (const panel of userPanels) {
        const InterviewPanelID = panel.ID;
        await SPServices.SPUpdateItem({
          Listname: ListNames.HRMSInterviewPanelDetails,
          RequestJSON: { IsScoreSheetUploaded: "Yes" },
          ID: InterviewPanelID,
        });
      }
      let filterConditions = [
        {
          FilterKey: "CandidateID/Id",
          Operator: "eq",
          FilterValue: candidateID,
        },
      ];
      const level1Response = await InterviewServices.GetInterviewPanelDetails(
        filterConditions
      );
      let InterviewCandidate: any[] = [];
      if (level1Response?.status === 200) {
        InterviewCandidate = level1Response.data.filter(
          (item: any) => item.CandidateID === candidateID
        );
        const level1Panels = InterviewCandidate.filter(
          (p) => p.InterviewLevel === InterviewLevels.Level2
        );
        const uploadedCount = level1Panels.filter(
          (p: { IsScoreSheetUploaded: string }) =>
            p.IsScoreSheetUploaded === "Yes"
        ).length;

        if (uploadedCount === level1Panels.length) {
          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
            RequestJSON: {
              ScoreCardLevelItemCreated: "Yes",
              ActionId: WorkflowAction.Approved,
              ItemCreated: "Yes",
            },
            ID: CandidateData.CandidateID,
          });
        }
      }
      setAlertPopupOpen(true);
      setalertProps({
        Message: RecuritmentHRMsg.ScoreCardMsgLevel2,
        Type: HRMSAlertOptions.Success,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
              props.navigation("/ReviewProfileList", {
                // state: {
                //   activeTab: "tab3",
                // },
              });
            } else if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
              props.navigation("/InterviewPanelList", {
                // state: {
                //   activeTab: "tab3",
                // },
              });
            } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
              props.navigation("/RecurimentProcess", {
                // state: {
                //   activeTab: "tab3",
                // },
              });
            }
            setAlertPopupOpen(false);
          } else {
            setAlertPopupOpen(false);
          }
        },
      });
    } else {
      const createFilter = (workflowStatus: string): WorkflowJson => ({
        workflowStatus,
        jobRequestId: Number(CandidateData.JobRequestID),
        comments: CandidateData.Comments,
        actionBy: props.CurrentUserRole,
      });

      let obj: ActionUpdate = {
        ActionId: 0,
        Id: 0,
        ItemCreated: "",
      };

      let CandidateDatas: WorkflowJson = {
        workflowStatus: "",
        jobRequestId: 0,
        comments: "",
        actionBy: "",
      };

      let SuccessMessage: string = "";
      const isNotEvaluationTab = props.stateValue?.TabName !== "Evaluation";
      switch (Action) {
        case "Selected":
          obj = {
            ActionId: WorkflowAction.Approved,
            Id: props.stateValue.ID,
            ItemCreated: isNotEvaluationTab ? "Yes" : "No",
          };
          CandidateDatas = createFilter(
            workflowStatusApi.CandidateSelectedIPanel
          );
          SuccessMessage =
            props?.stateValue?.StatusId ===
            StatusId.PendingwithHODtoselectthecandidateLevel2
              ? RecuritmentHRMsg.CandidateSelectedLevel2
              : props.stateValue?.TabName === TabName.Evaluation
              ? RecuritmentHRMsg.ScoreCardMsgLevel2
              : RecuritmentHRMsg.CandidateSelected;
          break;

        case "Rejected":
          obj = {
            ActionId: WorkflowAction.Reject,
            Id: props.stateValue.ID,
            ItemCreated: isNotEvaluationTab ? "Yes" : "No",
          };
          CandidateDatas = createFilter(
            workflowStatusApi.CandidateRejectedIPanel
          );
          SuccessMessage = RecuritmentHRMsg.CandidateRejected;

          if (selectedPosition) {
            await SPServices.SPUpdateItem({
              Listname: ListNames.HRMSPositionIDMaster,
              RequestJSON: { PositionIDStatus: "Vacant" },
              ID: selectedPosition.key,
            });
          }
          break;

        case "OnHold":
          obj = {
            ActionId: WorkflowAction.OnHold,
            Id: props.stateValue.ID,
            ItemCreated: isNotEvaluationTab ? "Yes" : "No",
          };
          CandidateDatas = createFilter(
            workflowStatusApi.CandidateOnHoldIPanel
          );
          SuccessMessage = RecuritmentHRMsg.CandidateOnHold;
          if (selectedPosition) {
            await SPServices.SPUpdateItem({
              Listname: ListNames.HRMSPositionIDMaster,
              RequestJSON: { PositionIDStatus: "Vacant" },
              ID: selectedPosition.key,
            });
          }
          break;

        default:
          return;
      }
      try {
        setIsLoading(true);
        if (Action === "Selected" && selectedPosition) {
          await handleAssignPosition({
            positionId: selectedPosition,
            Reasons: CandidateData.Comments,
          });
        }
        if (props.stateValue?.PreviousTabName === TabName.ViewCandidateList) {
          await insertOrUpdateCandidateCommentLevel1();
        }
        console.log("", CandidateDatas);

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
                if (props.stateValue?.TabName === TabName.Evaluation) {
                  if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
                    props.navigation("/ReviewProfileList", {
                      // state: {
                      //   activeTab: "tab3",
                      // },
                    });
                  } else if (
                    props.CurrentRoleID.includes(RoleID.InterviewPanel)
                  ) {
                    props.navigation("/InterviewPanelList", {
                      // state: {
                      //   activeTab: "tab3",
                      // },
                    });
                  } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
                    props.navigation("/RecurimentProcess", {
                      // state: {
                      //   activeTab: "tab3",
                      // },
                    });
                  }
                } else {
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
                        JobCodeId: props.stateValue.JobCodeId,
                        Department: props.stateValue.Department,
                        NoOfPosition: props.stateValue.NoOfPosition,
                      },
                    }
                  );
                }
                setAlertPopupOpen(false);
              } else {
                setAlertPopupOpen(false);
              }
            },
          });
        }
      } catch (error) {
        console.error("Error in Submit_fn:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
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
                ...(fieldsEditable.visibleButtons.includes("Selected")
                  ? [
                      {
                        label: "Selected",
                        onClick: async () => await Submit_fn("Selected"),
                      },
                    ]
                  : []),
                ...(fieldsEditable.visibleButtons.includes("Rejected")
                  ? [
                      {
                        label: "Rejected",
                        onClick: async () => await Submit_fn("Rejected"),
                      },
                    ]
                  : []),
                ...(fieldsEditable.visibleButtons.includes("OnHold")
                  ? [
                      {
                        label: "OnHold",
                        onClick: async () => await Submit_fn("OnHold"),
                      },
                    ]
                  : []),
                ...(props.stateValue?.TabName === TabName.Evaluation
                  ? [
                      {
                        label: "Submit",
                        onClick: async () => await Submit_fn("Selected"),
                      },
                    ]
                  : []),
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
            level1={CommentData.level1}
            level2={CommentData.level2}
          />
        </>
      )}
    </>
  );
};
export default HodViewScorecard;
