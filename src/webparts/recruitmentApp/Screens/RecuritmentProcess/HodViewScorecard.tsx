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
  ColorCode,
  DocumentLibraray,
  HRMSAlertOptions,
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
import {
  AdvDetails,
  QuestionItem,
  ScoreCardData,
} from "../../Models/RecuritmentVRR";
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
  CommentsDatas,
} from "../../Services/InterviewProcess/IInterviewProcessService";
import "../../App.css";
import ReuseButton from "../../components/ReuseButton";
import { WorkflowJson } from "../../Models/ApIInterface";
import IsValid from "../../components/Validation";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HODQuestionsView from "./HODQuestionsView";
import CustomPreviewScreen from "./CustomPreviewScreen";
import { Chip } from "@mui/material";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import SPServices from "../../Services/SPService/SPServices";
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

const HodViewScorecard = (props: any) => {
  console.log("props", props.stateValue);
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
      CandidateStatus: false,
      PositionID: false,
    });
  const [scoreData, setScoreData] = React.useState<any[]>([]);
  const [interviewPanelTitles, setInterviewPanelTitles] = React.useState<
    string[]
  >([]);
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
  // const [interviewerCount, setInterviewerCount] = React.useState(0);
  const [questionnaire, setquestionnaire] = React.useState<QuestionItem[]>([]);
  const [advDetails, setAdvDetails] = React.useState<AdvDetails>({
    MinQualificationOption: [],
    PrefeQualificationOption: [],
    RoleSpeKnowledgeoption: [],
    RequiredLeveloption: [],
    TechnicalSkillsOption: [],
    LevelProficiencyOption: [],
    RolePurpose: "",
    JobDescription: "",
    addMasterQualification: "",
    TotalExperience: { key: 0, text: "" },
    ExperienceinMiningIndustry: { key: 0, text: "" },
    TotalExperienceOption: [],
    ExperienceinMiningIndustryOption: [],
    YearofExperience: " ",
    PreferredExperience: "",
    ValidFrom: todaydate,
    ValidTo: undefined,
    FunctionType: "",
    JobFunctionalType: { key: 0, text: "" },
    JobFunctionalTypeOption: [],
    addMasterMinimumQualification: "",
    AdvertisementAttachement: [],
    JobcodeChecked: false,
  });
  const [Preview, setPreview] = React.useState<boolean>(false);
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
  const handleAutoComplete = (item: AutoCompleteItem | null) => {
    setSelectedPosition(item);
    setValidationError((prevState) => ({
      ...prevState,
      PositionID: false,
    }));
  };
  React.useEffect(() => {
    if (props.stateValue?.positionData) {
      setPositionOptions(props.stateValue.positionData);
    }
  }, []);
  const fetchRoleProfileData = async (JobCodeID: number) => {
    try {
      const filterConditions = [
        {
          FilterKey: "JobCode",
          Operator: "eq",
          FilterValue: JobCodeID,
        },
      ];

      const response = await getVRRDetails.GetHRMSRecruitmentRoleProfileDetails(
        filterConditions,
        ""
      );

      if (response.status === 200) {
        const data = response.data;

        if (data && data.length > 0) {
          const rawData = data[0];

          const roleSpecificKnowledge = Array.isArray(
            rawData.RoleSpecificKnowledge
          )
            ? rawData.RoleSpecificKnowledge
            : [];

          const RoleSpeKnowledgeValues = roleSpecificKnowledge.map(
            (item: { RoleSpecificKnowledge: any }) => item.RoleSpecificKnowledge
          );
          const RequiredLevelValues = roleSpecificKnowledge.map(
            (item: { RequiredLevel: any }) => item.RequiredLevel
          );

          const technicalSkillsKnowledge = Array.isArray(
            rawData.TechnicalSkillsKnowledge
          )
            ? rawData.TechnicalSkillsKnowledge
            : [];

          const TechnicalSkillsOption = technicalSkillsKnowledge.map(
            (item: { TechnicalSkills: any }, index: any) => ({
              key: index,
              text: item.TechnicalSkills,
            })
          );

          const LevelProficiencyOption = technicalSkillsKnowledge.map(
            (item: { LevelProficiency: any }, index: any) => ({
              key: index,
              text: item.LevelProficiency,
            })
          );

          const MinQualificationOption = rawData.Qualification
            ? [{ key: 0, text: rawData.Qualification }]
            : [];

          const PrefeQualificationOption = rawData.PreferredQualification
            ? [{ key: 0, text: rawData.PreferredQualification }]
            : [];

          setAdvDetails((prev: any) => {
            const updatedDetails = {
              ...prev,
              RolePurpose: rawData.RoleProfile || "",
              JobDescription: rawData.JobDescription || "",
              RoleSpeKnowledgeoption: RoleSpeKnowledgeValues,
              RequiredLeveloption: RequiredLevelValues,
              TechnicalSkillsOption,
              LevelProficiencyOption,
              MinQualificationOption,
              PrefeQualificationOption,
              YearofExperience: rawData.YearofExperience || "",
              PreferredExperience: rawData.PreferredExperience || "",
              TotalExperience: rawData.TotalPreferredExperience || "",
              FunctionType: rawData.FunctionType || "",
              JobcodeChecked: true,
              FullDataResponse: rawData,
            };

            return updatedDetails;
          });
        } else {
          setAdvDetails((prev: any) => ({
            ...prev,
            JobcodeChecked: false,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching role profile data:", error);
    }
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
          setInterviewPanelTitles(
            candidatePanels.map((panel: any) => panel.PanelFullName)
          );
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
          // let interviewerCount = 0;
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
            // interviewerCount++;
          });

          setTransformedDataforQuestions(Object.values(questionScores));
          // setInterviewerCount(interviewerCount);
        } else {
          setScoreData([]);
          setInterviewPanelTitles([]);
          // setTransformedDataforQuestions([]);
          // setInterviewerCount(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching panel/score data:", error);
        setScoreData([]);
        setInterviewPanelTitles([]);
        setTransformedDataforQuestions([]);
        // setInterviewerCount(0);
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
    let filterConditions = [
      {
        FilterKey: "CandidateID/Id",
        Operator: "eq",
        FilterValue: candidateID,
      },
    ];
    let Conditions = "";

    InterviewServices.getInterviewPanelDetails(
      filterConditions,
      Conditions,
      candidateID,
      props.EmployeeList
    )
      .then((CommentsList) => {
        if (CommentsList?.status === 200) {
          const candidateData = CommentsList?.data.filter(
            (candidate: any) => candidate.CandidateID === candidateID
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
    const getQuestion = await GetPortalJobsService.getQuestionnaire(
      CandidateData.JobCode
    );
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
                CandidateData.ExternalAgentName
                  ? CandidateData.ExternalAgentName + " Agencies"
                  : "Candidate"
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
                  {/* <div className="ms-Grid-col ms-lg4">
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
                  </div> */}
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
                </div>
                <div className="ms-Grid-row">
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
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Interview Levels"
                      value={CandidateData.InterviewLevels}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setCandidateData((prevState) => ({
                          ...prevState,
                          InterviewLevels: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg4">
                    <CustomInput
                      label="Grade"
                      value={CandidateData.JobGrade}
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
                <div className="ms-Grid-row" style={{ marginBottom: "20px" }}>
                  <div
                    className="ms-Grid-col ms-lg4"
                    style={{ position: "relative", top: "14px" }}
                  >
                    <label
                      style={{
                        fontWeight: 600,
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Interview Panel
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        minHeight: "38px",
                        // border: "none",
                        background: "none",
                        backgroundColor: "rgb(243, 242, 241)",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "rgb(243, 242, 241)",
                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px 4px",
                      }}
                    >
                      {interviewPanelTitles && interviewPanelTitles.length > 0
                        ? interviewPanelTitles.map((title, index) => (
                            <Chip
                              key={index}
                              label={title}
                              size="small"
                              sx={{
                                backgroundColor: "rgb(243, 242, 241)",
                                fontWeight: 500,
                              }}
                            />
                          ))
                        : null}
                    </div>
                  </div>
                </div>
                <div className="ms-Grid-row" style={{ marginLeft: "1%" }}>
                  <LabelHeaderComponents value={"Attachments"} />
                </div>

                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg4">
                    <CustomLabel value={"Candidate Resume"} />
                    <CustomViewDocument
                      Attachment={CandidateData.CandidateCVDoc}
                    />
                  </div>
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
                      CandidateData.ExternalAgentName
                        ? CandidateData.ExternalAgentName + " Agencies"
                        : "Candidate"
                    }`}
                  </span>
                </div>
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
                        {interviewPanelTitles.map((name, index) => (
                          <Column
                            key={index}
                            field={`interviewer_${index + 1}`}
                            header={
                              <>
                                <div style={{ fontSize: "12px" }}>
                                  Interviewer {index + 1}
                                </div>
                                <div style={{ fontSize: "14px" }}>({name})</div>
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
                        {interviewPanelTitles.map((name, index) => (
                          <Column
                            key={index}
                            field={`interviewer_${index + 1}`}
                            header={
                              <>
                                <div style={{ fontSize: "12px" }}>
                                  Interviewer {index + 1}
                                </div>
                                <div style={{ fontSize: "14px" }}>({name})</div>
                              </>
                            }
                          />
                        ))}
                      </DataTable>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
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
                    label="Feedback"
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

      InterviewServices.GetCombinedCandidatePositionDetails(
        filterConditions,
        Conditions,
        props.EmployeeList
      )
        .then(async (data) => {
          if (data?.status === 200) {
            const op = data?.data[0];
            console.log("Candidate details (op):", op);
            const agentName = op.ExternalAgentDetails?.AgentName;

            const interviewLevels = Array.from(
              new Set(
                (op?.HRMSCandidateScoreCard as { InterviewLevel: any }[])?.map(
                  (item) => item.InterviewLevel
                )
              )
            );
            console.log("Interview levels:", interviewLevels);
            try {
              const response = await CommonServices.GetAttachmentToLibrary(
                DocumentLibraray.RecruitmentAdvertisementDocument,
                op?.JobCode
              );

              let advertisementDocuments: any[] = [];
              if (response?.status === 200) {
                advertisementDocuments = response?.data.map((doc: any) => ({
                  name: doc.name,
                  content: doc.content,
                }));
              }

              const RoleProfileresponse =
                await CommonServices.GetAttachmentToLibrary(
                  DocumentLibraray.RoleProfileMaster,
                  op?.JobCode,
                  RoleProfileMaster.RoleProfile
                );

              let roleProfileDocuments: any[] = [];
              if (RoleProfileresponse?.status === 200) {
                roleProfileDocuments = RoleProfileresponse?.data.map(
                  (doc: any) => ({
                    name: doc.name,
                    content: doc.content,
                  })
                );
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
                ExternalAgentName: agentName,
                JobGrade: op?.JobGrade,
                InterviewLevels: interviewLevels,
                HRMSCandidateScoreCard: op?.HRMSCandidateScoreCard || [],
                Comments:
                  Array.isArray(op?.CandidateComments?.[op.ID]) &&
                  op?.CandidateComments?.[op.ID].length > 0
                    ? op.CandidateComments[op.ID][0].Comments
                    : "",
              }));

              await fetchRoleProfileData(op.JobCodeId);
            } catch (error) {
              console.error("Error fetching documents:", error);
            } finally {
              setIsLoading(false);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching candidate data:", error);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error in initial try block:", error);
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

        if (props.stateValue.StatusId === StatusId.Selected) {
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
    if (candidateID && props.stateValue.StatusId === StatusId.Selected) {
      void fetchSelectedCandidateDetails();
    }
  }, [candidateID, props?.stateValue?.Status]);

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
      } catch (err) {
        console.error("Error in fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAllData();
    void fetchInterviewPanelDetails();
  }, [props.stateValue?.ID, activeTab]);

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };
  const Validation = (): boolean => {
    const { Comments } = CandidateData;

    let errors = {
      Comments: false,
      Checkboxalidation: false,
      CandidateStatus: false,
    };

    switch (props.CurrentRoleID) {
      case RoleID.HOD: {
        if (props.stateValue?.tab === "tab1") {
          errors.Comments = !IsValid(Comments);
          errors.Checkboxalidation = !IsValid(Checkbox);
          errors.CandidateStatus = !IsValid(actionValue.CandidateStatus);
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
      console.log("Fetching Position ID details for:", positionIdString);

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
      } else {
        console.error("Failed to assign position");
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
            comment.RoleId === props.CurrentRoleID
        );

        if (matchingComment) {
          const updatePayload = {
            Comments: CandidateData.Comments,
            Level: CandidateData.InterviewLevels.join(","),
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
              RoleId: props.CurrentRoleID,
              Level: CandidateData.InterviewLevels.join(","),
            },
          });
        }
      } else {
        await SPServices.SPAddItem({
          Listname: ListNames.HRMSRecruitmentCandidateComments,
          RequestJSON: {
            CandidateIDId: CandidateData.CandidateID,
            Comments: CandidateData.Comments,
            RoleId: props.CurrentRoleID,
            Level: CandidateData.InterviewLevels.join(","),
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
        console.log("Fetched Level 2 ScoreCard data:", response.data);

        // Check if a comment already exists for the same CandidateID and RoleId
        const matchingComment = response.data.find(
          (comment: any) =>
            comment.CandidateID?.ID === CandidateData.CandidateID &&
            comment.RoleId === props.CurrentRoleID
        );

        if (matchingComment) {
          // Update existing comment
          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSCandidateLevel2ScoreCard,
            RequestJSON: {
              Comments: CandidateData.Comments,
              Level: "Level 2",
            },
            ID: matchingComment.ID || 0,
          });

          console.log(
            "Level 2 comment updated for CandidateID:",
            CandidateData.CandidateID
          );
        } else {
          // If no comment exists, insert a new one
          await SPServices.SPAddItem({
            Listname: ListNames.HRMSCandidateLevel2ScoreCard,
            RequestJSON: {
              CandidateIDId: CandidateData.CandidateID,
              Comments: CandidateData.Comments,
              RoleId: props.CurrentRoleID,
              Level: "Level 2",
            },
          });

          console.log(
            "Level 2 comment inserted for CandidateID:",
            CandidateData.CandidateID
          );
        }
      } else {
        // No previous comments, so just insert a new one
        await SPServices.SPAddItem({
          Listname: ListNames.HRMSCandidateLevel2ScoreCard,
          RequestJSON: {
            CandidateIDId: CandidateData.CandidateID,
            Comments: CandidateData.Comments,
            RoleId: props.CurrentRoleID,
            Level: "Level 2",
          },
        });

        console.log(
          "Level 2 comment inserted (no existing data):",
          CandidateData.CandidateID
        );
      }
    } catch (error) {
      console.error("Error in insertOrUpdateLevel2ScorecardComment:", error);
    }
  };

  // const insertOrUpdateLevel2ScorecardComment = async () => {
  //   try {
  //     const filterConditions = [
  //       {
  //         FilterKey: "CandidateIDId",
  //         Operator: "eq",
  //         FilterValue: CandidateData.CandidateID, // Assuming CandidateID is a number
  //       },
  //     ];

  //     const response = await InterviewServices.getCandidateLevel2ScoreCard(
  //       filterConditions
  //     );

  //     if (response?.status === 200 && response.data?.length > 0) {
  //       console.log("Fetched Level 2 ScoreCard data:", response.data);

  //       const matchingComment = response.data.find(
  //         (comment: any) =>
  //           comment.CandidateID?.ID === CandidateData.CandidateID &&
  //           comment.RoleId === props.CurrentRoleID
  //       );

  //       if (matchingComment) {
  //         await SPServices.SPUpdateItem({
  //           Listname: ListNames.HRMSCandidateLevel2ScoreCard,
  //           RequestJSON: {
  //             Comments: CandidateData.Comments,
  //             Level: "Level 2",
  //           },
  //           ID: matchingComment.ID || 0,
  //         });

  //         console.log(
  //           "Level 2 comment updated for CandidateID:",
  //           CandidateData.CandidateID
  //         );
  //       } else {
  //         await SPServices.SPAddItem({
  //           Listname: ListNames.HRMSCandidateLevel2ScoreCard,
  //           RequestJSON: {
  //             CandidateIDId: CandidateData.CandidateID,
  //             Comments: CandidateData.Comments,
  //             RoleId: props.CurrentRoleID,
  //             Level: "Level 2",
  //           },
  //         });

  //         console.log(
  //           "Level 2 comment inserted for CandidateID:",
  //           CandidateData.CandidateID
  //         );
  //       }
  //     } else {
  //       // No previous comments, so just insert
  //       await SPServices.SPAddItem({
  //         Listname: ListNames.HRMSCandidateLevel2ScoreCard,
  //         RequestJSON: {
  //           CandidateIDId: CandidateData.CandidateID,
  //           Comments: CandidateData.Comments,
  //           RoleId: props.CurrentRoleID,
  //           Level: "Level 2",
  //         },
  //       });

  //       console.log(
  //         "Level 2 comment inserted for CandidateID (no existing data):",
  //         CandidateData.CandidateID
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error in insertOrUpdateLevel2ScorecardComment:", error);
  //   }
  // };
  const hasMinimumComments = async (candidateID: number): Promise<boolean> => {
    try {
      const filterConditions = [
        {
          FilterKey: "CandidateIDId",
          Operator: "eq",
          FilterValue: candidateID,
        },
      ];

      const response = await InterviewServices.getCandidateLevel2ScoreCard(
        filterConditions
      );
      const uniqueRoles = new Set(response.data.map((item) => item.RoleId));

      return uniqueRoles.size >= 3;
    } catch (error) {
      console.error("Error checking minimum comments:", error);
      return false;
    }
  };

  const Submit_fn = async (Action: string) => {
    const isValid = !Validation();
    if (!isValid) {
      console.error("Validation failed");
      return;
    }

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
        SuccessMessage = RecuritmentHRMsg.CandidateSelected;
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
        CandidateDatas = createFilter(workflowStatusApi.CandidateOnHoldIPanel);
        SuccessMessage = RecuritmentHRMsg.CandidateOnHold;
        break;

      default:
        console.error("Invalid Action:", Action);
        return;
    }
    // switch (Action) {
    //   case "Selected":
    //     obj = {
    //       ActionId: WorkflowAction.Approved,
    //       Id: props.stateValue.ID,
    //       ItemCreated: "Yes",
    //     };
    //     CandidateDatas = createFilter(
    //       workflowStatusApi.CandidateSelectedIPanel
    //     );
    //     SuccessMessage = RecuritmentHRMsg.CandidateSelected;
    //     break;

    //   case "Rejected":
    //     obj = {
    //       ActionId: WorkflowAction.Reject,
    //       Id: props.stateValue.ID,
    //       ItemCreated: "Yes",
    //     };
    //     CandidateDatas = createFilter(
    //       workflowStatusApi.CandidateRejectedIPanel
    //     );
    //     SuccessMessage = RecuritmentHRMsg.CandidateRejected;
    //     if (selectedPosition) {
    //       await SPServices.SPUpdateItem({
    //         Listname: ListNames.HRMSPositionIDMaster,
    //         RequestJSON: { PositionIDStatus: "Vacant" },
    //         ID: selectedPosition.key,
    //       });
    //     }
    //     break;

    //   case "OnHold":
    //     obj = {
    //       ActionId: WorkflowAction.OnHold,
    //       Id: props.stateValue.ID,
    //       ItemCreated: "Yes",
    //     };
    //     CandidateDatas = createFilter(workflowStatusApi.CandidateOnHoldIPanel);
    //     SuccessMessage = RecuritmentHRMsg.CandidateOnHold;
    //     break;

    //   default:
    //     console.error("Invalid Action:", Action);
    //     return;
    // }

    try {
      setIsLoading(true);

      console.log("Selected Position:", selectedPosition);

      // Assign PositionID if Selected
      if (Action === "Selected" && selectedPosition) {
        await handleAssignPosition({
          positionId: selectedPosition,
          Reasons: CandidateData.Comments,
        });
      }
      if (props.stateValue?.PreviousTabName === TabName.ViewCandidateList) {
        await insertOrUpdateCandidateCommentLevel1();
      }
      console.log("CandidateDatas Payload:", CandidateDatas);

      if (props.stateValue?.StatusId === StatusId.InterviewScheduledforLevel2) {
        await insertOrUpdateLevel2ScorecardComment();

        const hasThreeComments = await hasMinimumComments(
          CandidateData.CandidateID
        );
        if (hasThreeComments) {
          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
            RequestJSON: {
              ScoreCardLevelItemCreated: "Yes",
            },
            ID: CandidateData.CandidateID,
          });
        }
      }

      const selectionResponse = await InterviewServices.CandidateSeletionApi(
        obj,
        ListNames.HRMSRecruitmentCandidatePersonalDetails
      );

      if (selectionResponse.status === 200) {
        console.log("Candidate action submitted successfully");

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
      } else {
        console.error("Failed to submit candidate action");
      }
    } catch (error) {
      console.error("Error in Submit_fn:", error);
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
      ) : Preview ? (
        <CustomPreviewScreen
          data={advDetails}
          onclose={() => {
            setPreview(false);
            setMainComponent(true);
          }}
          Ok_btnfn={() => {
            setPreview(false);
            setMainComponent(true);
          }}
          JobTitle={CandidateData.PositionTitle || ""}
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
