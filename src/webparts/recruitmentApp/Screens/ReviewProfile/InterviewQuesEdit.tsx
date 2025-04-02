import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import { Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CloseIcon from "@mui/icons-material/Close";

import CustomLoader from "../../Services/Loader/CustomLoader";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import RichTextEditor from "../../components/CustomRichTextEditor";
import CustomRadioGroup from "../../components/CustomRadioGroup";
import CustomInput from "../../components/CustomInput";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { InterviewQues } from "../../Models/RecuritmentVRR";
import type { alertPropsData, AutoCompleteItem } from "../../Models/Screens";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import {
  CategoryID,
  CatogryOptionCode,
  displayTextOptionCode,
  HRMSAlertOptions,
  isDisqualificationOption,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleID,
  StatusId,
} from "../../utilities/Config";
import LabelHeaderComponents from "../../components/TitleHeader";
import {
  answersValue,
  optionsValue,
  UpsertQuestions,
} from "../../Models/ApIInterface";
import { GetPortalJobsService } from "../../Services/ServiceExport";

type InterviewQuesValidationError = {
  QuestionType: boolean;
  QuestionNumber: boolean;
  Disciplines: boolean;
  Question: boolean;
  ExpectedAnswer: boolean;
  OptionsType: boolean;
  Catogry: boolean;
  Disqualification: boolean;
};

interface OptionRow {
  key: number;
  text: string;
  isCorrect?: boolean;
}

export type MasterOption = {
  category: AutoCompleteItem[];
  categoryOption: string[];
  ScopeOption: AutoCompleteItem[];
  QueType: AutoCompleteItem[];
};
interface QuestionItem {
  id: number;
  discipline: AutoCompleteItem;
  questionNumber: {
    key: number;
    text: string;
  };
  questionType: AutoCompleteItem;
  question: string;
  expectedAnswer?: any;
  options?: OptionRow[];
  Disqualification: string;
}

const InterviewQuesEdit: React.FC = (props: any) => {

  const [InterviewQuesData, setInterviewQuesData] = useState<InterviewQues>({
    Disciplines: { key: 0, text: "" },
    QuestionNumber: { key: 0, text: "" },
    QuestionType: { key: 0, text: "" },
    Question: "",
    ExpectedAnswer: "",
    Catogry:
      props?.stateValue?.StatusId ===
      StatusId?.PendingInterviewQuestionwithLineManagerandHR
        ? CatogryOptionCode.InterviewPanel
        : CatogryOptionCode.CareerPortalCandidate,
    Disqualification: "",
  });

  const [OptionsType, setOptionsType] = useState<OptionRow[]>([
    { key: 0, text: "", isCorrect: false },
  ]);

  const [ValidationError, setValidationError] =
    useState<InterviewQuesValidationError>({
      QuestionType: false,
      QuestionNumber: false,
      Disciplines: false,
      Question: false,
      ExpectedAnswer: false,
      OptionsType: false,
      Catogry: false,
      Disqualification: false,
    });

  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);

  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<
    number | null
  >(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [AlertPopupOpen, setAlertPopupOpen] = useState<boolean>(false);
  const [alertProps, setalertProps] = useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = useState("tab1");
  const [getMasterData, setGetMasterData] = useState<MasterOption>({
    category: [],
    categoryOption: [],
    ScopeOption: [],
    QueType: [],
  });
  const selectedCategory =
    InterviewQuesData.Catogry || CatogryOptionCode.InterviewPanel;

  const handleCategoryChange = (val: string) => {
    setInterviewQuesData((prev) => ({
      ...prev,
      Catogry: val,
      Disciplines: { key: 0, text: "" },
      QuestionNumber: { key: 0, text: "" },
      QuestionType: { key: 0, text: "" },
      Question: "",
      ExpectedAnswer: "",
      Disqualification: "",
    }));

    setValidationError((prev) => ({
      ...prev,
      Catogry: false,
    }));
  };

  const handleOptionChange = (index: number, newVal: string) => {
    setOptionsType((prev) => {
      const updated = [...prev];
      updated[index].text = newVal;
      return updated;
    });
  };

  const updateExpectedAnswer = (options: OptionRow[]) => {
    const selectedAnswers = options
      .map((opt, index) => ({
        key: index,
        text: opt.text,
        isCorrect: opt.isCorrect,
      }))
      .filter((opt) => opt.isCorrect);

    setInterviewQuesData((prev) => ({
      ...prev,
      ExpectedAnswer: JSON.stringify(selectedAnswers),
    }));
  };
  const removeValidationIfNeeded = (updatedOptions: typeof OptionsType) => {
    const hasCorrectAnswer = updatedOptions.some(
      (opt) => opt.isCorrect && opt.text.trim() !== ""
    );

    setValidationError((prev) => ({
      ...prev,
      OptionsType: hasCorrectAnswer ? false : prev.OptionsType,
    }));
  };

  const handleSelectCorrectAnswer = (index: number) => {
    setOptionsType((prev) => {
      const updatedOptions = prev.map((opt, i) =>
        i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );

      removeValidationIfNeeded(updatedOptions);
      updateExpectedAnswer(updatedOptions);
      return updatedOptions;
    });
  };

  const handleSingleAnswer = (index: number) => {
    setOptionsType((prev) => {
      const updatedOptions = prev.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }));

      removeValidationIfNeeded(updatedOptions);
      updateExpectedAnswer(updatedOptions);
      return updatedOptions;
    });
  };

  const handleAnswerSelections = (index: number) => {
    if (
      InterviewQuesData.QuestionType.text === displayTextOptionCode.MultiAnswer
    ) {
      handleSelectCorrectAnswer(index);
    } else {
      handleSingleAnswer(index);
    }
  };

  const handleAnswerSelection = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };

      if (!question.options) question.options = [];

      let updatedOptions = [...question.options];

      if (question.questionType.text === displayTextOptionCode.SingleAnswer) {
        updatedOptions = updatedOptions.map((opt, index) => ({
          ...opt,
          isCorrect: index === optIndex,
        }));
      } else {
        updatedOptions[optIndex] = {
          ...updatedOptions[optIndex],
          isCorrect: !updatedOptions[optIndex].isCorrect,
        };
      }

      question.options = updatedOptions;
      question.expectedAnswer = updatedOptions.filter((opt) => opt.isCorrect);

      updated[qIndex] = question;
      return updated;
    });
  };

  const handleAddRow = () => {
    setOptionsType((prev) => [
      ...prev,
      { key: prev.length, text: "", isCorrect: false },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    setOptionsType((prev) => {
      const updatedOptions = prev.filter((_, i) => i !== index);

      const updatedCorrectAnswers = updatedOptions
        .map((opt, newIndex) => ({
          key: newIndex,
          text: opt.text,
          isCorrect: opt.isCorrect,
        }))
        .filter((opt) => opt.isCorrect);

      setInterviewQuesData((prevData) => ({
        ...prevData,
        ExpectedAnswer: JSON.stringify(updatedCorrectAnswers),
      }));
      return updatedOptions;
    });
  };

  // buuton delete
  const handleDelete = (index: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.filter((_, i) => i !== index);

      const reorderedQuestions = updatedQuestions.map((q, i) => ({
        ...q,
        id: i + 1,
        questionNumber: { key: i + 1, text: `Question ${i + 1}` },
      }));

      return reorderedQuestions;
    });
  };

  // Drop down
  const handleAutoComplete = (
    field: string,
    value: { key: number; text: string } | null
  ) => {
    setInterviewQuesData((prev) => {
      let updatedData = { ...prev, [field]: value };
      if (
        field === "QuestionType" &&
        value?.text === displayTextOptionCode.SingleAnswer
      ) {
        setOptionsType([
          {
            key: 0,
            text: "",
            isCorrect: false,
          },
        ]);
      } else if (field === "QuestionType") {
        setOptionsType([]);
      }

      return updatedData;
    });
    if (value) {
      setValidationError((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Ritch text
  const handleRichTextEditor = (value: string, stateKey: string) => {
    setInterviewQuesData((prev) => ({
      ...prev,
      [stateKey]: value,
    }));
    setValidationError((prev) => ({ ...prev, [stateKey]: false }));
  };

  const handleToggleExpand = (index: number) => {
    setExpandedQuestionIndex((prev) => (prev === index ? null : index));
  };

  const Validation = (): boolean => {
    const {
      QuestionType,
      Disciplines,
      Question,
      ExpectedAnswer,
      Catogry,
      Disqualification,
    } = InterviewQuesData;

    let errors: Partial<InterviewQuesValidationError> = {};

    if (!Disciplines.text) errors.Disciplines = true;
    if (!QuestionType.text) errors.QuestionType = true;
    if (!Question) errors.Question = true;
    if (!Catogry) errors.Catogry = true;
    if (!Disqualification) errors.Disqualification = true;

    if (
      [
        displayTextOptionCode.MultiAnswer,
        displayTextOptionCode.SingleAnswer,
      ].includes(QuestionType.text)
    ) {
      const selectedOptions = OptionsType.filter(
        (opt) => opt.isCorrect && opt.text.trim() !== ""
      );
      const anyOptionFilled = OptionsType.some((opt) => opt.text.trim() !== "");

      if (!anyOptionFilled) {
        errors.OptionsType = true;
      }

      if (QuestionType.text === displayTextOptionCode.MultiAnswer) {
        if (selectedOptions.length === 0) {
          errors.OptionsType = true;
        } else {
          delete errors.OptionsType;
        }
      } else if (QuestionType.text === displayTextOptionCode.SingleAnswer) {
        if (selectedOptions.length !== 1) {
          errors.OptionsType = true;
        } else {
          delete errors.OptionsType;
        }
      }
    } else {
      if (!ExpectedAnswer) errors.ExpectedAnswer = true;
    }

    setValidationError((prev) => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  const handleSaveQuestion = () => {
    if (!Validation()) {
      return;
    }
    const correctAnswers = OptionsType.filter((opt) => opt.isCorrect).map(
      (opt, i) => ({ key: i, text: opt.text })
    );

    const questionData: QuestionItem = {
      id:
        editingQuestionIndex !== null
          ? questions[editingQuestionIndex].id
          : questions.length + 1,
      discipline: InterviewQuesData.Disciplines,
      questionNumber: {
        key: questions.length + 1,
        text:
          editingQuestionIndex !== null
            ? `Question ${editingQuestionIndex + 1}`
            : `Question ${questions.length + 1}`,
      },
      questionType: InterviewQuesData.QuestionType,
      question: InterviewQuesData.Question,
      expectedAnswer:
        InterviewQuesData.QuestionType.text ===
          displayTextOptionCode.MultiAnswer ||
        InterviewQuesData.QuestionType.text ===
          displayTextOptionCode.SingleAnswer
          ? JSON.stringify(correctAnswers)
          : InterviewQuesData.ExpectedAnswer,
      options:
        InterviewQuesData.QuestionType.text ===
          displayTextOptionCode.MultiAnswer ||
        InterviewQuesData.QuestionType.text ===
          displayTextOptionCode.SingleAnswer
          ? [...OptionsType]
          : undefined,
      Disqualification: InterviewQuesData.Disqualification || "",
    };

    if (editingQuestionIndex !== null) {
      
      setQuestions((prev) => {
        const updated = [...prev];
        updated[editingQuestionIndex] = questionData;
        return updated;
      });
      setEditingQuestionIndex(null);
    } else {
      
      setQuestions((prev) => [...prev, questionData]);
    }

    setInterviewQuesData((prev) => ({
      Disciplines: prev.Disciplines,
      QuestionNumber: { key: 0, text: "" },
      QuestionType: { key: 0, text: "" },
      Question: "",
      ExpectedAnswer: "",
      Disqualification: "", 
      Catogry: prev.Catogry,
    }));

    setOptionsType([{ key: 0, text: "", isCorrect: false }]);
    setValidationError({} as InterviewQuesValidationError);
  };

  // Display the Accordion
  const handleQuestionFieldChange = (
    qIndex: number,
    field: string,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              [field]: value,
              options:
                field === "questionType" &&
                (value?.text === displayTextOptionCode.MultiAnswer ||
                  value?.text === displayTextOptionCode.SingleAnswer)
                  ? [{ key: 0, text: "", isCorrect: false }]
                  : field === "questionType"
                  ? []
                  : q.options,
            }
          : q
      )
    );
  };

  const handleQuestionOptionChange = (
    qIndex: number,
    optIndex: number,
    newVal: string
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };
      if (!question.options) question.options = [];
      let updatedOptions = [...question.options];
      updatedOptions[optIndex] = {
        ...updatedOptions[optIndex],
        text: newVal,
      };
      question.options = updatedOptions;
      question.expectedAnswer = updatedOptions;
      updated[qIndex] = question;
      return updated;
    });
  };

  const handleQuestionAddRow = (qIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };

      if (!question.options) {
        question.options = [];
      }

      const newOption = {
        key: question.options.length,
        text: "",
        isCorrect: false,
      };

      question.options = [...question.options, newOption];
      updated[qIndex] = question;
      return updated;
    });
  };

  const handleQuestionDeleteRow = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };
      if (!question.options) {
        question.options = [];
      }
      question.options.splice(optIndex, 1);
      question.options = question.options.map((opt, i) => ({ ...opt, key: i }));
      const selectedAnswers = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt, i) => ({ key: i, text: opt.text }));

      question.expectedAnswer = JSON.stringify(selectedAnswers);

      updated[qIndex] = question;
      return updated;
    });
  };

  const handleCommonRadioChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      );

      return updatedQuestions;
    });
  };

  // breadCrumb

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  // Cancel

  const handleCancel = () => {
    setIsLoading(true);

    const CancelAlert = {
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          switch (props.CurrentRoleID) {
            case RoleID.RecruitmentHR:
              props.navigation("/ReviewProfileList", {
                state: { activeTab: "tab3" },
              });
              break;
            case RoleID.HOD:
              props.navigation("/RecurimentProcess", {
                state: { activeTab: "tab3" },
              });
              break;
            case RoleID.LineManager:
              props.navigation("/ReviewProfileList", {
                state: { activeTab: "tab2" },
              });
              break;
            default:
              props.navigation("/InterviewPanelList");
          }
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

  // DisQualification
  const handleIsDisqualificationChange = async (
    key: keyof InterviewQues,
    value: string
  ) => {
    if (value) {
      setInterviewQuesData((prevState) => ({
        ...prevState,
        [key]: value,
      }));
      setValidationError((prevState) => ({
        ...prevState,
        [key]: false,
      }));
    }
  };
  useEffect(() => {
    if (props?.stateValue?.StatusId) {
      setInterviewQuesData((prev) => ({
        ...prev,
        Catogry:
          props.stateValue.StatusId ===
          StatusId?.PendingInterviewQuestionwithLineManagerandHR
            ? CatogryOptionCode.InterviewPanel
            : CatogryOptionCode.CareerPortalCandidate,
      }));
    }
  }, [props?.stateValue?.StatusId]);
  useEffect(() => {
    if (
      [
        displayTextOptionCode.MultiAnswer,
        displayTextOptionCode.SingleAnswer,
      ].includes(InterviewQuesData.QuestionType?.text?.trim() || "")
    ) {
      setOptionsType([{ key: 1, text: "", isCorrect: false }]);
    } else {
      setOptionsType([]);
    }
  }, [InterviewQuesData.QuestionType]);

  useEffect(() => {
    async function fetchMaster() {
      const CategoryData = await GetPortalJobsService.GetAllMaster(
        CategoryID.QuestionCategory
      );
      const ScopeData = await GetPortalJobsService.GetAllMaster(
        CategoryID.QuestionScopes
      );
      const QuestionType = await GetPortalJobsService.GetAllMaster(
        CategoryID.QuestionType
      );

      const CategoryOption: AutoCompleteItem[] = (CategoryData.data ?? []).map(
        (opt: any) => ({
          key: opt.value,
          text: opt.displayText,
        })
      );
      let categoryOptionVal: string[] = CategoryOption.map((item) => item.text);

      const ScopeOption: AutoCompleteItem[] = (ScopeData.data ?? []).map(
        (opt: any) => ({
          key: opt.value,
          text: opt.displayText,
        })
      );

      const QuestionTypeOption: AutoCompleteItem[] = (QuestionType.data ?? [])
        .filter((opt: any) => {
          if (InterviewQuesData.Catogry === CatogryOptionCode.InterviewPanel) {
            return opt.displayText === displayTextOptionCode.CustomAnswer;
          } else if (
            InterviewQuesData.Catogry === CatogryOptionCode.CareerPortalCandidate
          ) {
            return (
              opt.displayText === displayTextOptionCode.MultiAnswer ||
              opt.displayText === displayTextOptionCode.SingleAnswer
            );
          }
          return false;
        })
        .map((opt: any) => ({
          key: opt.value,
          text: opt.displayText,
        }));

      setGetMasterData((prevState) => ({
        ...prevState,
        category: CategoryOption,
        categoryOption: categoryOptionVal,
        ScopeOption: ScopeOption,
        QueType: QuestionTypeOption,
      }));
    }
    void fetchMaster();
  }, [InterviewQuesData.Catogry]);
  // tabs

  const tabs = [
    {
      label: "Interview Questions",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 7px 4px 3px #d3d3d3",
            borderRadius: "10px",
            marginTop: "2%",
          }}
        >
          <CardContent>
            <div className="ms-Grid-row" style={{ marginBottom: "2px" }}>
              <div className="ms-Grid-col ms-lg6">
                <LabelHeaderComponents
                  value={`Job Title - ${props?.stateValue?.JobTitleInEnglish} (${props?.stateValue?.JobCode})`}
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

            <Card
              sx={{
                mb: 2,
                borderRadius: "10px",
                borderColor: "#5f5f5f",
                boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
              }}
            >
              <CardContent>
                <>
                  <CustomRadioGroup
                    label="Do you want to prepare the questionnaires for?"
                    value={InterviewQuesData.Catogry}
                    onChange={handleCategoryChange}
                    mandatory={true}
                    options={getMasterData.categoryOption}
                    error={ValidationError.Catogry}
                    disabled={true}
                  />

                  {AlertPopupOpen && (
                    <CustomAlert
                      {...alertProps}
                      onClose={() => setAlertPopupOpen(false)}
                    />
                  )}
                </>
              </CardContent>
            </Card>
            {/* Left side  Image */}
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box
                sx={{
                  position: "relative",
                  top: "262px",
                  width: "30%",
                  pr: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {selectedCategory === CatogryOptionCode.InterviewPanel && (
                  <>
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <img
                        src={require("../../assets/interview.svg")}
                        alt="Interview Panel"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </Box>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#d32f2f",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          mt: 1,
                        }}
                      >
                        Interview Panel Questions
                      </Typography>
                    </Box>
                  </>
                )}

                {selectedCategory ===
                  CatogryOptionCode.CareerPortalCandidate && (
                  <>
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <img
                        src={require("../../assets/online-test.svg")}
                        alt="Recruitment Process"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </Box>
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#d32f2f",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          mt: 1,
                        }}
                      >
                        Recruitment Process (Portal) Questions
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>

              {/*  right side Card and box  */}

              <Box sx={{ width: "70%" }}>
                <Box sx={{ mb: 2 }}>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg5">
                      <CustomAutoComplete
                        label="Disciplines"
                        options={getMasterData.ScopeOption}
                        value={InterviewQuesData.Disciplines}
                        onChange={(val) =>
                          handleAutoComplete("Disciplines", val)
                        }
                        disabled={false}
                        mandatory={true}
                        error={ValidationError.Disciplines}
                      />
                    </div>
                  </div>
                </Box>
                {/*  Add the question show  UI  */}
                {questions.length > 0 && (
                  <Card
                    sx={{
                      mb: 2,
                      borderRadius: "4px",
                      borderColor: "#5f5f5f",
                      boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                      height: expandedQuestionIndex !== null ? "auto" : "150px",
                      transition: "height 0.3s ease-in-out",
                      overflow: "hidden",
                    }}
                  >
                    <CardContent
                      sx={{
                        maxHeight:
                          expandedQuestionIndex !== null ? "none" : 100,
                        overflowY:
                          expandedQuestionIndex !== null ? "visible" : "auto",
                        pr: 1,
                      }}
                    >
                      {questions.map((q, index) => {
                        const isExpanded = expandedQuestionIndex === index;
                        return (
                          <>
                            <Box
                              sx={{
                                boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                                borderRadius: "4px",
                                borderColor: "#5f5f5f",
                              }}
                            >
                              <Accordion
                                key={q.id}
                                expanded={isExpanded}
                                onChange={() => handleToggleExpand(index)}
                                sx={{
                                  boxShadow: "none",
                                  borderBottom: "1px solid #ddd",
                                  "&:last-of-type": { borderBottom: "none" },
                                  mb: 2,
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  sx={{
                                    color: "rgb(50, 49, 48)",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                                      fontSize: "14px",
                                      flexGrow: 1,
                                    }}
                                  >
                                    {q.questionNumber.text}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {isExpanded && (
                                    <>
                                      <Box sx={{ marginTop: "-25px" }}>
                                        <div className="ms-Grid-row">
                                          <div className="ms-Grid-col ms-lg5">
                                            <CustomAutoComplete
                                              label="Type of Question"
                                              options={getMasterData.QueType}
                                              value={q.questionType}
                                              onChange={(val) =>
                                                handleQuestionFieldChange(
                                                  index,
                                                  "questionType",
                                                  val
                                                )
                                              }
                                              disabled={false}
                                              mandatory={true}
                                            />
                                          </div>
                                        </div>
                                      </Box>

                                      <Box sx={{ mb: 2 }}>
                                        <RichTextEditor
                                          label="Question"
                                          value={q.question}
                                          onChange={(val) =>
                                            handleQuestionFieldChange(
                                              index,
                                              "question",
                                              val
                                            )
                                          }
                                          mandatory={true}
                                        />
                                      </Box>

                                      {q?.questionType?.text ===
                                        displayTextOptionCode.MultiAnswer ||
                                      q?.questionType?.text ===
                                        displayTextOptionCode.SingleAnswer ? (
                                        <Box sx={{ mb: 2 }}>
                                          {q.options?.map(
                                            (option, optIndex) => {
                                              const isSelected =
                                                option.isCorrect;
                                              return (
                                                <Box
                                                  key={optIndex}
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mb: 2,
                                                    gap: 1,
                                                  }}
                                                >
                                                  <Typography
                                                    variant="body1"
                                                    sx={{
                                                      width: "80px",
                                                      fontSize: "14px",
                                                      fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                                                    }}
                                                  >
                                                    Option {optIndex + 1} *
                                                  </Typography>

                                                  <CustomInput
                                                    label=""
                                                    value={option.text}
                                                    onChange={(val) =>
                                                      handleQuestionOptionChange(
                                                        index,
                                                        optIndex,
                                                        val
                                                      )
                                                    }
                                                  />

                                                  <Box
                                                    sx={{
                                                      backgroundColor:
                                                        isSelected
                                                          ? "#4CAF50"
                                                          : "#D3D3D3",
                                                      borderRadius: "50%",
                                                      width: 30,
                                                      height: 30,
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent: "center",
                                                      cursor: "pointer",
                                                      boxShadow: isSelected
                                                        ? "0px 0px 5px rgba(0, 128, 0, 0.5)"
                                                        : "0px 0px 5px rgba(0, 0, 0, 0.2)",
                                                      transition:
                                                        "all 0.3s ease-in-out",
                                                    }}
                                                    onClick={() =>
                                                      handleAnswerSelection(
                                                        index,
                                                        optIndex
                                                      )
                                                    }
                                                  >
                                                    <CheckCircleOutlineIcon
                                                      sx={{
                                                        color: isSelected
                                                          ? "white"
                                                          : "black",
                                                        fontSize: 24,
                                                      }}
                                                    />
                                                  </Box>

                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      gap: 1,
                                                    }}
                                                  >
                                                    {q.options!.length > 1 && (
                                                      <Button
                                                        variant="contained"
                                                        sx={{
                                                          backgroundColor:
                                                            "red",
                                                          color: "white",
                                                          minWidth: 40,
                                                          "&:hover": {
                                                            backgroundColor:
                                                              "#b71c1c",
                                                          },
                                                        }}
                                                        onClick={() =>
                                                          handleQuestionDeleteRow(
                                                            index,
                                                            optIndex
                                                          )
                                                        }
                                                      >
                                                        <CloseIcon
                                                          sx={{ fontSize: 20 }}
                                                        />
                                                      </Button>
                                                    )}
                                                    {optIndex ===
                                                      q.options!.length - 1 && (
                                                      <Button
                                                        variant="contained"
                                                        sx={{
                                                          backgroundColor:
                                                            "red",
                                                          color: "white",
                                                          minWidth: 40,
                                                          "&:hover": {
                                                            backgroundColor:
                                                              "#b71c1c",
                                                          },
                                                        }}
                                                        onClick={() =>
                                                          handleQuestionAddRow(
                                                            index
                                                          )
                                                        }
                                                      >
                                                        <AddIcon />
                                                      </Button>
                                                    )}
                                                  </Box>
                                                </Box>
                                              );
                                            }
                                          )}
                                        </Box>
                                      ) : (
                                        <Box sx={{ mb: 2 }}>
                                          <RichTextEditor
                                            label="Expected Answer"
                                            value={q.expectedAnswer || []}
                                            onChange={(val) =>
                                              handleQuestionFieldChange(
                                                index,
                                                "expectedAnswer",
                                                val
                                              )
                                            }
                                            mandatory={true}
                                          />
                                        </Box>
                                      )}

                                      <Box sx={{ mb: 2 }}>
                                        <CustomRadioGroup
                                          label="Disqualification Question?"
                                          value={q.Disqualification ?? "NO"} 
                                          onChange={(val) =>
                                            handleCommonRadioChange(
                                              index,
                                              "Disqualification",
                                              val
                                            )
                                          }
                                          mandatory={true}
                                          options={isDisqualificationOption}
                                        />
                                      </Box>

                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "flex-start",
                                        }}
                                      >
                                        <Button
                                          variant="contained"
                                          sx={{
                                            backgroundColor: "#d32f2f",
                                            color: "white",
                                            "&:hover": {
                                              backgroundColor: "#b71c1c",
                                            },
                                            textTransform: "none",
                                            borderRadius: "4px",
                                            px: 3,
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(index);
                                          }}
                                        >
                                          Delete
                                        </Button>
                                      </Box>
                                    </>
                                  )}
                                </AccordionDetails>
                              </Accordion>
                            </Box>
                          </>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
                {/*Create the Ques   */}
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                    borderRadius: "4px",
                    borderColor: "#5f5f5f",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      sx={{
                        color: " rgb(50, 49, 48)",
                        fontSize: "14x",
                        fontFamily: `"Segoe UI", "Segoe UI Web (West European)", 
                        "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                      }}
                    >
                      Add Questions
                    </Typography>
                  </Box>

                  <>
                    <Box>
                      <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-lg5">
                          <CustomAutoComplete
                            label="Type of Question"
                            options={getMasterData.QueType}
                            value={InterviewQuesData.QuestionType}
                            onChange={(val) => {
                              handleAutoComplete("QuestionType", val);
                              setExpandedQuestionIndex(null);
                            }}
                            disabled={false}
                            mandatory={true}
                            error={ValidationError.QuestionType}
                          />
                        </div>
                      </div>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <RichTextEditor
                        label="Question"
                        value={InterviewQuesData.Question}
                        onChange={(val) =>
                          handleRichTextEditor(val, "Question")
                        }
                        mandatory={true}
                        error={ValidationError.Question}
                      />
                    </Box>

                    {[
                      displayTextOptionCode.MultiAnswer,
                      displayTextOptionCode.SingleAnswer,
                    ].includes(
                      InterviewQuesData.QuestionType?.text?.trim() || ""
                    ) ? (
                      <Box sx={{ mb: 2 }}>
                        {OptionsType && OptionsType.length > 0 ? (
                          OptionsType.map((option, index) => {
                            const isSelected = option.isCorrect;
                            return (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{ width: "80px" }}
                                >
                                  Option {index + 1} *
                                </Typography>

                                <CustomInput
                                  label=""
                                  value={option.text}
                                  onChange={(val) =>
                                    handleOptionChange(index, val)
                                  }
                                />

                                <Box
                                  sx={{
                                    backgroundColor: isSelected
                                      ? "#4CAF50"
                                      : "#D3D3D3",
                                    borderRadius: "50%",
                                    width: 30,
                                    height: 30,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    boxShadow: isSelected
                                      ? "0px 0px 5px rgba(0, 128, 0, 0.5)"
                                      : "0px 0px 5px rgba(0, 0, 0, 0.2)",
                                    transition: "all 0.3s ease-in-out",
                                  }}
                                  onClick={() => handleAnswerSelections(index)}
                                >
                                  <CheckCircleOutlineIcon
                                    sx={{
                                      color: isSelected ? "white" : "black",
                                      fontSize: 24,
                                    }}
                                  />
                                </Box>

                                <Box sx={{ display: "flex", gap: 1 }}>
                                  {OptionsType.length > 1 && (
                                    <Button
                                      variant="contained"
                                      sx={{
                                        backgroundColor: "red",
                                        color: "white",
                                        minWidth: 40,
                                        "&:hover": {
                                          backgroundColor: "#b71c1c",
                                        },
                                      }}
                                      onClick={() => handleDeleteRow(index)}
                                    >
                                      <CloseIcon sx={{ fontSize: 20 }} />
                                    </Button>
                                  )}

                                  {index === OptionsType.length - 1 && (
                                    <Button
                                      variant="contained"
                                      sx={{
                                        backgroundColor: "red",
                                        color: "white",
                                        minWidth: 40,
                                        "&:hover": {
                                          backgroundColor: "#b71c1c",
                                        },
                                      }}
                                      onClick={handleAddRow}
                                    >
                                      <AddIcon />
                                    </Button>
                                  )}
                                </Box>
                              </Box>
                            );
                          })
                        ) : (
                          <Typography color="error">
                            No options available.
                          </Typography>
                        )}

                        {ValidationError.OptionsType && (
                          <Typography color="error">
                            Please select at least one correct answer.
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ mb: 2 }}>
                        <RichTextEditor
                          label="Expected Answer"
                          value={InterviewQuesData.ExpectedAnswer}
                          onChange={(val) =>
                            handleRichTextEditor(val, "ExpectedAnswer")
                          }
                          mandatory={true}
                          error={ValidationError.ExpectedAnswer}
                        />
                      </Box>
                    )}

                    <Box sx={{ mb: 2 }}>
                      <CustomRadioGroup
                        label="Disqualification Question?"
                        value={InterviewQuesData?.Disqualification ?? ""}
                        options={isDisqualificationOption}
                        error={ValidationError.Disqualification}
                        mandatory={true}
                        onChange={(value) =>
                          handleIsDisqualificationChange(
                            "Disqualification",
                            value
                          )
                        }
                      />
                    </Box>
                  </>

                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleSaveQuestion}
                      sx={{
                        backgroundColor: "#d32f2f",
                        color: "white",
                        "&:hover": { backgroundColor: "#b71c1c" },
                        textTransform: "none",
                        borderRadius: "4px",
                        px: 3,
                      }}
                    >
                      {editingQuestionIndex !== null ? "Update" : "Add"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ),
    },
  ];
  useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);
    if (activeTab === "tab1") {
      setTabNameData(() => {
        return [
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
          { tabName: activeTabObj?.label },
        ];
      });
    }
  }, [
    props.stateValue?.ID,
    activeTab,
    props.stateValue?.TabName,
    props.stateValue?.ButtonAction,
  ]);

  async function Submit_fn() {
    

    let QuestionValue: UpsertQuestions[] = questions.map((item) => {
      const OptionsValue: optionsValue[] =
        item.options?.map((opt) => ({
          optionEn: opt.text,
          optionFr: opt.text,
          sequence: opt.key,
        })) || [];

      const answerVal = JSON.parse(item.expectedAnswer || "[]");
      const answerValue: answersValue[] =
        answerVal?.map((opt: any) => ({
          optionEn: opt.text,
          optionFr: opt.text,
        })) || [];
      const category = getMasterData.category.filter(
        (item) => item.text === InterviewQuesData.Catogry
      );
      return {
        questionEn: item.question,
        questionFr: item.question,
        scopeId: String(item.discipline.key),
        categoryId: String(category[0].key),
        questionTypeId: String(item.questionType.key),
        isQualifier:
          InterviewQuesData.Catogry === CatogryOptionCode.CareerPortalCandidate
            ? 1
            : 0,
        isAnswerValidate: item.Disqualification === "" ? 0 : 1, // item.Disqualification === "No" ? 0 : 1
        sequence: item.id,
        jobCode: props.stateValue.JobCode,
        options: OptionsValue,
        answers: answerValue,
      };
    });
    
    const response = await GetPortalJobsService.UpsertQuestions(QuestionValue);
    console.log(response,);
    if (response.status === ResponeStatus.SUCCESS) {
      const SuccessAlert = {
        Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
        Type: HRMSAlertOptions.Success,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            props.navigation("/RecurimentProcess", {
              state: { activeTab: "tab3" },
            });
            setAlertPopupOpen(false);
          } else {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(SuccessAlert);
      setIsLoading(false);
      setInterviewQuesData((prev) => ({
        ...prev,
        Catogry: "",
      }));
    } else {
      const APIError = {
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
      setalertProps(APIError);
      setIsLoading(false);
    }
  }

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <React.Fragment>
            <BreadcrumbsComponent
              items={tabs}
              initialItem={activeTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              handleCancel={handleCancel}
              additionalButtons={[
                {
                  label: "Close",
                  onClick: async () => {
                    props.navigation("/ReviewProfileList", {
                      state: { activeTab: "tab2" },
                    });
                  },
                },
                {
                  label: "Submit",
                  onClick: async () => {
                    await Submit_fn();
                  },
                },
              ]}
            />
          </React.Fragment>
        </div>
      </CustomLoader>

      {AlertPopupOpen && (
        <CustomAlert
          {...alertProps}
          onClose={() => setAlertPopupOpen(!AlertPopupOpen)}
        />
      )}
    </>
  );
};

export default InterviewQuesEdit;
