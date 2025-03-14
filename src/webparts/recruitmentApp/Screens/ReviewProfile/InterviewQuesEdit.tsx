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
  CatogryOption,
  HRMSAlertOptions,
  RecuritmentHRMsg,
  RoleID,
} from "../../utilities/Config";
import LabelHeaderComponents from "../../components/TitleHeader";

type ValidationError = {
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
  Disqualification: boolean;
}

const InterviewQuesEdit: React.FC = (props: any) => {
  const [InterviewQuesData, setInterviewQuesData] = useState<InterviewQues>({
    Disciplines: { key: 0, text: "" },
    QuestionNumber: { key: 0, text: "" },
    QuestionType: { key: 0, text: "" },
    Question: "",
    ExpectedAnswer: "",
    Catogry: "",
    Disqualification: "",
  });

  const [OptionsType, setOptionsType] = useState<OptionRow[]>([
    { key: 0, text: "", isCorrect: false },
  ]);

  const [ValidationError, setValidationError] = useState<ValidationError>({
    QuestionType: false,
    QuestionNumber: false,
    Disciplines: false,
    Question: false,
    ExpectedAnswer: false,
    OptionsType: false,
    Catogry: false,
    Disqualification: false,
  });
  const JobTitleInEnglish = props?.stateValue?.JobTitleInEnglish;

  const JobCode = props?.stateValue?.JobCode;

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
  const [categorySelected, setCategorySelected] = useState(false);
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = useState("tab1");

  const selectedCategory = InterviewQuesData.Catogry || "Interview Panel";

  const questionTypeOptions =
    InterviewQuesData.Catogry === "Interview Panel"
      ? [
          { key: 0, text: "Short Answer" },
          { key: 1, text: "Long Answer" },
        ]
      : InterviewQuesData.Catogry === "Recruitment Process (Portal)"
      ? [
          { key: 0, text: "Single Choice" },
          { key: 2, text: "Multiple Choice" },
        ]
      : [];

  // Category

  const handleCategoryChange = (val: string) => {
    if (categorySelected) {
      const CancelAlert = {
        Message: RecuritmentHRMsg.InterviewQues,
        Type: HRMSAlertOptions.Confirmation,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
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
            setQuestions([]);
            setAlertPopupOpen(false);
          } else {
            setAlertPopupOpen(false);
          }
        },
      };

      setalertProps(CancelAlert);
      setAlertPopupOpen(true);
    } else {
      setInterviewQuesData((prev) => ({
        ...prev,
        Catogry: val,
        QuestionType: { key: 0, text: "" },
      }));

      setValidationError((prev) => ({
        ...prev,
        Catogry: false,
      }));

      setCategorySelected(true);
    }
  };

  //Create the Ques  Add Question in Multiple and single choices

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

    console.log("Expected Answer:", selectedAnswers);
  };

  const handleSelectCorrectAnswer = (index: number) => {
    setOptionsType((prev) => {
      const updatedOptions = prev.map((opt, i) =>
        i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );

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

      updateExpectedAnswer(updatedOptions);
      return updatedOptions;
    });
  };

  const handleAnswerSelections = (index: number) => {
    if (InterviewQuesData.QuestionType.text === "Multiple Choice") {
      handleSelectCorrectAnswer(index);
    } else {
      handleSingleAnswer(index);
    }
  };

  const handleAnswerSelection = (qIndex: number, optIndex: number) => {
    console.log(
      `Toggling correct answer for option ${optIndex} in question ${qIndex}`
    );

    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };

      if (!question.options) question.options = [];

      let updatedOptions = [...question.options];

      if (question.questionType.text === "Single Choice") {
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

      console.log("Updated options list:", updatedOptions);

      question.options = updatedOptions;
      question.expectedAnswer = updatedOptions.filter((opt) => opt.isCorrect);

      console.log("Updated expected answer:", question.expectedAnswer);

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

      console.log("Updated Expected Answer:", updatedCorrectAnswers);
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
    console.log(`handleAutoComplete: field=${field}, value=`, value);

    setInterviewQuesData((prev) => {
      let updatedData = { ...prev, [field]: value };
      if (field === "QuestionType" && value?.text === "Single Choice") {
        console.log("Single Choice Selected: Ensuring at least one option");
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

  // Add save  and vaidation :

  const Validation = (): boolean => {
    const {
      QuestionType,
      Disciplines,
      Question,
      ExpectedAnswer,
      Catogry,
      Disqualification,
    } = InterviewQuesData;

    let errors: Partial<ValidationError> = {};

    if (!Disciplines.text) errors.Disciplines = true;
    if (!QuestionType.text) errors.QuestionType = true;
    if (!Question) errors.Question = true;
    if (!Catogry) errors.Catogry = true;
    if (!Disqualification) errors.Disqualification = true;
    if (
      QuestionType.text === "Multiple Choice" ||
      QuestionType.text === "Single Choice"
    ) {
      const anyOptionFilled = OptionsType.some((opt) => opt.text.trim() !== "");
      if (!anyOptionFilled) {
        errors.OptionsType = true;
        console.error("Validation Error: At least one option is required.");
      }
    } else {
      if (!ExpectedAnswer) errors.ExpectedAnswer = true;
    }

    setValidationError((prev) => ({ ...prev, ...errors }));

    console.log("Validation Errors:", errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveQuestion = () => {
    console.log("OptionsType before validation:", OptionsType);

    if (!Validation()) {
      console.error("Validation failed! Stopping execution.");
      return;
    }

    console.log("OptionsType after validation:", OptionsType);

    const correctAnswers = OptionsType.filter((opt) => opt.isCorrect) // Keep only correct answers
      .map((opt, i) => ({ key: i, text: opt.text }));

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
        InterviewQuesData.QuestionType.text === "Multiple Choice" ||
        InterviewQuesData.QuestionType.text === "Single Choice"
          ? JSON.stringify(correctAnswers) // Ensure storing previous correct answers
          : InterviewQuesData.ExpectedAnswer,
      options:
        InterviewQuesData.QuestionType.text === "Multiple Choice" ||
        InterviewQuesData.QuestionType.text === "Single Choice"
          ? [...OptionsType]
          : undefined,
      Disqualification: InterviewQuesData.Disqualification === "YES",
    };

    console.log("Question data before saving:", questionData);

    if (editingQuestionIndex !== null) {
      const updated = [...questions];
      updated[editingQuestionIndex] = questionData;
      setQuestions(updated);
      setEditingQuestionIndex(null);
    } else {
      setQuestions((prev) => [...prev, questionData]);
    }

    console.log("Updated Questions List:", questions);

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
    console.log("OptionsType after reset:", OptionsType);

    setValidationError({} as ValidationError);
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
                (value?.text === "Multiple Choice" ||
                  value?.text === "Single Choice")
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
    console.log(
      `Updating option text at index ${optIndex} in question ${qIndex}`
    );

    setQuestions((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };
      if (!question.options) question.options = [];
      let updatedOptions = [...question.options];
      updatedOptions[optIndex] = {
        ...updatedOptions[optIndex],
        text: newVal,
      };

      console.log("Updated Options List:", updatedOptions);

      question.options = updatedOptions;
      question.expectedAnswer = updatedOptions;

      console.log("Updated expected answer1:", question.expectedAnswer);

      updated[qIndex] = question;
      return updated;
    });
  };

  const handleQuestionAddRow = (qIndex: number) => {
    console.log(`Adding new option for question ${qIndex}`);

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

      console.log("All options after addition:", question.options);

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

      console.log("Deleted Option Index:", optIndex);
      console.log("Remaining Options:", question.options);
      console.log("Updated Expected Answer:", question.expectedAnswer);

      return updated;
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
          if (props.CurrentRoleID === RoleID.RecruitmentHR) {
            props.navigation("/ReviewProfileList", {
              state: { activeTab: "tab3" },
            });
          } else if (props.CurrentRoleID === RoleID.HOD) {
            props.navigation("/RecurimentProcess", {
              state: { activeTab: "tab3" },
            });
          } else if (props.CurrentRoleID === RoleID.LineManager) {
            props.navigation("/ReviewProfileList", {
              state: { activeTab: "tab2" },
            });
          } else {
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
  // in Option type changes
  useEffect(() => {
    if (
      ["multiple choice", "single choice"].includes(
        InterviewQuesData.QuestionType?.text?.trim().toLowerCase() || ""
      ) &&
      OptionsType.length === 0
    ) {
      setOptionsType([
        {
          key: 0,
          text: "",
          isCorrect: false,
        },
      ]);
    }
  }, [InterviewQuesData]);

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
                  value={`Job Title - ${JobTitleInEnglish} (${JobCode})`}
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
                    options={CatogryOption}
                    error={ValidationError.Catogry}
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
                {selectedCategory === "Interview Panel" && (
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

                {selectedCategory === "Recruitment Process (Portal)" && (
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
                        options={[
                          { key: 0, text: "Scope" },
                          { key: 1, text: "Technical" },
                          { key: 2, text: "Behavioral" },
                        ]}
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
                                              options={questionTypeOptions}
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
                                        "Multiple Choice" ||
                                      q?.questionType?.text ===
                                        "Single Choice" ? (
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
                                          key={
                                            q.Disqualification ? "yes" : "no"
                                          }
                                          label="Disqualification Question?"
                                          value={
                                            q.Disqualification ? "YES" : "NO"
                                          }
                                          onChange={(val) =>
                                            handleQuestionFieldChange(
                                              index,
                                              "isDisqualification",
                                              val === "YES"
                                            )
                                          }
                                          mandatory={true}
                                          options={["YES", "NO"]}
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
                            options={questionTypeOptions}
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

                    {["multiple choice", "single choice"].includes(
                      InterviewQuesData.QuestionType?.text
                        ?.trim()
                        .toLowerCase() || ""
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
                        value={InterviewQuesData.Disqualification}
                        options={["YES", "NO"]}
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
    alert("Submitted!");

    setInterviewQuesData((prev) => ({
      ...prev,
      Catogry: "",
    }));
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
