import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import { Typography, Button, Box, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
// import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import {
  CategoryID,
  CatogryOptionCode,
  ColorCode,
  DataType,
  displayTextOptionCode,
  HRMSAlertOptions,
  isDisqualificationOption,
  ListNames,
  RecuritmentHRMsg,
  ResponeStatus,
  RoleID,
  StatusId,
  TabName,
  validationMsg,
  WorkflowAction,
} from "../../utilities/Config";
import {
  answersValue,
  getQuestionById,
  optionsValue,
  UpsertQuestions,
} from "../../Models/ApIInterface";
import {
  GetPortalJobsService,
  getVRRDetails,
} from "../../Services/ServiceExport";
import SPServices from "../../Services/SPService/SPServices";
import ViewQuestionCheckbox, {
  ViewQuestion,
} from "../ScreenComponent/ViewQuestionCheckbox";
import CustomLabel from "../../components/CustomLabel";
import { Label } from "@fluentui/react";
import {
  ButtonAction,
  QuestionCreatedBy,
  ValidationAction,
} from "../../utilities/LabelName";
import { normalizeQuestion } from "../../components/TabMerge";

type InterviewQuesValidationError = {
  QuestionType: boolean;
  QuestionNumber: boolean;
  Disciplines: boolean;
  Question: boolean;
  ExpectedAnswer: boolean;
  OptionsType: string | boolean;
  Catogry: boolean;
  Disqualification: boolean;
  ExpectedAnswerFr: boolean;
};

export type OptionRow = {
  key: number;
  text: string;
  textFr?: string;
  isCorrect?: boolean;
  textvalidation?: boolean;
  textvalidationFr?: boolean;
  fieldValidation?: boolean;
  fieldValidationFr?: boolean;
};

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
  questionFr: string;
  expectedAnswer: string;
  expectedAnswerFr?: string;
  CareerportalAnswer: OptionRow[];
  options?: OptionRow[];
  Disqualification: string;
  Type?: string;
}

const InterviewQuesEdit: React.FC = (props: any) => {
  // console.log(props, "InterviewQuesEditProps.");

  const [InterviewQuesData, setInterviewQuesData] = useState<InterviewQues>({
    Disciplines: { key: 0, text: "" },
    QuestionNumber: { key: 0, text: "" },
    QuestionType: { key: 0, text: "" },
    Question: "",
    ExpectedAnswer: "",
    Catogry:
      props?.stateValue?.StatusId ===
      StatusId?.PendingwithHRandLMtocreateinterviewQuestion
        ? CatogryOptionCode.InterviewPanel
        : CatogryOptionCode.CareerPortalCandidate,
    Disqualification: "",
    CareerportalAnswer: [],
    ExpectedAnswerFr: "",
  });

  // Separate state for English and French questions
  const [EnglishQuestion, setEnglishQuestion] = useState<string>("");
  const [FrenchQuestion, setFrenchQuestion] = useState<string>("");

  const [OptionsType, setOptionsType] = useState<OptionRow[]>([
    {
      key: 0,
      text: "",
      isCorrect: false,
      textvalidation: false,
      fieldValidation: false,
    },
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
      ExpectedAnswerFr: false,
    });

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [viewQA, setViewQA] = useState<boolean>(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);

  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<
    number | null
  >(null);
  const [expandedExistingQuestion, setExpandedExistingQuestion] = useState<
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
  const [questionnaire, setQuestionnaire] = React.useState<ViewQuestion[]>([]);
  const [resuequestionnaire, setresuequestionnaire] = React.useState<
    ViewQuestion[]
  >([]);
  const [showCreateQuestionBox, setShowCreateQuestionBox] = useState(false);
  const [newquestionnaire, setNewquestionnaire] = React.useState<
    ViewQuestion[]
  >([]);
  const [existingquestionnaire, setExistingquestionnaire] = React.useState<
    ViewQuestion[]
  >([]);

  // const [currentRoleID, setCurrentRoleID] = useState<number>(0);

  // const handleCategoryChange = (val: string) => {
  //   setInterviewQuesData((prev) => ({
  //     ...prev,
  //     Catogry: val,
  //     Disciplines: { key: 0, text: "" },
  //     QuestionNumber: { key: 0, text: "" },
  //     QuestionType: { key: 0, text: "" },
  //     Question: "",
  //     ExpectedAnswer: "",
  //     Disqualification: "",
  //   }));

  //   setValidationError((prev) => ({
  //     ...prev,
  //     Catogry: false,
  //   }));
  // };

  const handleOptionChange = (
    index: number,
    newVal: string,
    lang: "en" | "fr" = "en",
  ) => {
    if (newVal.length > 155) {
      setOptionsType((prev) => {
        const updated = [...prev];
        if (lang === "en") updated[index].textvalidation = true;
        else updated[index].textvalidationFr = true;
        return updated;
      });
      console.warn("Input exceeds 155 characters");
      return;
    }

    setOptionsType((prev) => {
      const updated = [...prev];
      if (lang === "en") {
        updated[index].text = newVal;
        updated[index].textvalidation = false;
      } else {
        updated[index].textFr = newVal;
        updated[index].textvalidationFr = false;
      }
      return updated;
    });
  };

  const updateExpectedAnswer = (options: OptionRow[]) => {
    const selectedAnswers: OptionRow[] = options
      .map((opt, index) => ({
        key: index,
        text: opt.text,
        textFr: opt.textFr,
        isCorrect: opt.isCorrect,
      }))
      .filter((opt) => opt.isCorrect);
    setInterviewQuesData((prev) => ({
      ...prev,
      CareerportalAnswer: selectedAnswers, //JSON.stringify(selectedAnswers),
    }));
  };
  const removeValidationIfNeeded = (updatedOptions: typeof OptionsType) => {
    const hasCorrectAnswer = updatedOptions.some(
      (opt) => opt.isCorrect && opt.text.trim() !== "",
    );

    setValidationError((prev) => ({
      ...prev,
      OptionsType: hasCorrectAnswer ? false : prev.OptionsType,
    }));
  };

  const handleSelectCorrectAnswer = (index: number) => {
    setOptionsType((prev) => {
      const updatedOptions = prev.map((opt, i) =>
        i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt,
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
    setresuequestionnaire((prev) => {
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
        if (updatedOptions[optIndex]) {
          updatedOptions[optIndex] = {
            ...updatedOptions[optIndex],
            isCorrect: !updatedOptions[optIndex].isCorrect,
          };
        } else {
          console.warn(`Option at index ${optIndex} is undefined.`);
        }
      }

      question.options = updatedOptions;
      question.CareerportalAnswer = updatedOptions.filter(
        (opt) => opt.isCorrect,
      );

      updated[qIndex] = question;
      return updated;
    });
  };

  // const handleAddRow = () => {
  //   setOptionsType((prev) => [
  //     ...prev,
  //     { key: prev.length, text: "", isCorrect: false },
  //   ]);
  // };

  const handleDeleteRow = (index: number) => {
    setOptionsType((prev) => {
      const updatedOptions = prev.filter((_, i) => i !== index);

      const updatedCorrectAnswers = updatedOptions
        .map((opt, newIndex) => ({
          key: newIndex,
          text: opt.text,
          textFr: opt.textFr,
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

  // Drop down
  const handleAutoComplete = async (
    field: string,
    value: { key: number; text: string } | null,
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

    if (field === "Disciplines") {
      try {
        if (
          InterviewQuesData?.Disciplines?.text !== value?.text &&
          InterviewQuesData?.Disciplines?.text !== ""
        ) {
          const WarningMsg = {
            Message: RecuritmentHRMsg.WarningMsg,
            Type: HRMSAlertOptions.Confirmation,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                setresuequestionnaire([]);
                setQuestions([]);
                setAlertPopupOpen(false);
              } else {
                setInterviewQuesData((prev) => ({
                  ...prev,
                  Disciplines: InterviewQuesData?.Disciplines,
                }));
                setAlertPopupOpen(false);
              }
            },
          };

          setAlertPopupOpen(true);
          setalertProps(WarningMsg);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch questionnaire:", error);
      }
    }

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

  // Language-specific handlers for English question
  const handleEnglishQuestion = (value: string) => {
    setEnglishQuestion(value);
    setValidationError((prev) => ({ ...prev, Question: false }));
  };

  // Language-specific handler for French question
  const handleFrenchQuestion = (value: string) => {
    setFrenchQuestion(value);
    setValidationError((prev) => ({ ...prev, Question: false }));
  };

  const handleToggleExpand = (index: number) => {
    setExpandedQuestionIndex((prev) => (prev === index ? null : index));
  };

  const handleExpand = (index: number) => {
    setExpandedExistingQuestion((prev) => (prev === index ? null : index));
  };
  const handleCloseCreateQuestion = () => {
    setShowCreateQuestionBox(false);
    setValidationError({} as InterviewQuesValidationError);
    setEditingQuestionIndex(null);

    setInterviewQuesData((prev) => ({
      ...prev,
      QuestionNumber: { key: 0, text: "" },
      QuestionType: { key: 0, text: "" },
      Question: "",
      ExpectedAnswer: "",
      Disqualification: "",
      Catogry: prev.Catogry,
      CareerportalAnswer: [],
    }));

    setOptionsType([
      {
        key: 0,
        text: "",
        textFr: "",
        isCorrect: false,
        textvalidation: false,
        textvalidationFr: false,
      },
    ]); // reset options
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
    const shouldValidateQuestionType =
      props?.stateValue?.StatusId ===
      StatusId.PendingwithLMcreateDisqualificationQuestion;

    if (!Disciplines?.text) errors.Disciplines = true;
    if (shouldValidateQuestionType && !QuestionType?.text)
      errors.QuestionType = true;
    const activeQuestion = EnglishQuestion || Question;
    if (!activeQuestion) errors.Question = true;
    if (!Catogry) errors.Catogry = true;

    const isMCQ =
      QuestionType?.text === displayTextOptionCode.MultiAnswer ||
      QuestionType?.text === displayTextOptionCode.SingleAnswer;

    if (isMCQ) {
      const filledOptions = OptionsType.filter((opt) => opt.text.trim() !== "");
      const selectedOptions = filledOptions.filter((opt) => opt.isCorrect);

      if (filledOptions.length < 2) {
        errors.OptionsType = validationMsg.MaxOptions;
      } else if (
        (QuestionType.text === displayTextOptionCode.MultiAnswer &&
          selectedOptions.length === 0) ||
        (QuestionType.text === displayTextOptionCode.SingleAnswer &&
          selectedOptions.length !== 1)
      ) {
        errors.OptionsType = validationMsg.CorrectAns;
      }
    } else {
      if (!ExpectedAnswer) errors.ExpectedAnswer = true;
      if (!InterviewQuesData.ExpectedAnswerFr) errors.ExpectedAnswerFr = true;
    }

    if (shouldValidateQuestionType && !Disqualification) {
      errors.Disqualification = true;
    }
    setValidationError((prev) => ({ ...prev, ...errors }));

    return Object.keys(errors).length === 0;
  };

  const handleAddRow = () => {
    setOptionsType((prev) => {
      const newOptions = [
        ...prev,
        {
          key: prev.length,
          text: "",
          textFr: "",
          isCorrect: false,
          textvalidation: false,
          textvalidationFr: false,
        },
      ];
      // Validation();
      return newOptions;
    });
  };

  const handleSaveQuestion = (index: number, OptionIndex: number) => {
    const currentQuestion = normalizeQuestion(InterviewQuesData.Question);

    const duplicatedInReuse = resuequestionnaire.some(
      (qs) => normalizeQuestion(qs.question) === currentQuestion,
    );

    const duplicatedInNew = newquestionnaire.some(
      (qs) => normalizeQuestion(qs.question) === currentQuestion,
    );

    if (currentQuestion !== "" && duplicatedInReuse && duplicatedInNew) {
      const DuplicatedQu = {
        Message: RecuritmentHRMsg.duplicatedquestionMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(DuplicatedQu);
      setIsLoading(false);
      return;
    }

    const shouldValidateQuestionType =
      props?.stateValue?.StatusId ===
      StatusId.PendingwithLMcreateDisqualificationQuestion;

    const customAnswerType = getMasterData.QueType.find(
      (q) => q.text === displayTextOptionCode.CustomAnswer,
    );
    const questionType: AutoCompleteItem = shouldValidateQuestionType
      ? InterviewQuesData.QuestionType
      : customAnswerType || { key: 0, text: "" };

    // setOptionsType((prev) => {
    //   const updated = [...prev];
    //   if (updated[OptionIndex].text === "") {
    //     updated[OptionIndex - 1].fieldValidation = true;
    //   } else {
    //     updated[OptionIndex - 1].fieldValidation = false;
    //   }
    //   return updated;
    // });

    if (!Validation()) {
      console.warn("Validation failed. Exiting save function.");
      return;
    }

    const correctAnswers = OptionsType.filter((opt) => opt.isCorrect).map(
      (opt, i) => ({ key: i, text: opt.text, textFr: opt.textFr }),
    );
    const questionData: ViewQuestion = {
      id:
        editingQuestionIndex !== null
          ? questions[editingQuestionIndex].id
          : index,
      discipline: InterviewQuesData.Disciplines,
      questionType: questionType,
      question: EnglishQuestion || InterviewQuesData.Question,
      questionFr: FrenchQuestion || InterviewQuesData.Question,
      expectedAnswer: InterviewQuesData.ExpectedAnswer,
      expectedAnswerFr: InterviewQuesData.ExpectedAnswerFr,
      CareerportalAnswer: correctAnswers,
      options:
        questionType.text === displayTextOptionCode.MultiAnswer ||
        questionType.text === displayTextOptionCode.SingleAnswer
          ? [...OptionsType]
          : undefined,
      Disqualification: InterviewQuesData.Disqualification || "",
      Type: DataType.New,
      Checked: false,
      HeaderLabel:
        editingQuestionIndex !== null
          ? `Question ${editingQuestionIndex + 1}`
          : `Question ${index}`,
    };
    console.log("Saving question:", {
      questionData,
      EnglishQuestion,
      FrenchQuestion,
      OptionsType,
    });
    if (editingQuestionIndex !== null) {
      setresuequestionnaire((prev) => {
        const updated = [...prev];
        updated[editingQuestionIndex] = { ...questionData };
        return updated;
      });
      setEditingQuestionIndex(null);
    } else {
      setresuequestionnaire((prev) => [
        ...prev,
        { ...questionData, Checked: false } as ViewQuestion,
      ]);
    }

    setInterviewQuesData((prev) => ({
      Disciplines: prev.Disciplines,
      QuestionNumber: { key: 0, text: "" },
      QuestionType: { key: 0, text: "" },
      Question: "",
      ExpectedAnswer: "",
      ExpectedAnswerFr: "",
      Disqualification: "",
      Catogry: prev.Catogry,
      CareerportalAnswer: [],
    }));
    setEnglishQuestion("");
    setFrenchQuestion("");
    setOptionsType([
      {
        key: 0,
        text: "",
        textFr: "",
        isCorrect: false,
        textvalidation: false,
        textvalidationFr: false,
      },
    ]);
    setValidationError({} as InterviewQuesValidationError);
  };

  const handleQuestionFieldChange = (
    qIndex: number,
    field: string,
    value: any,
  ) => {
    setresuequestionnaire((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              [field]: value,
              options:
                field === "questionType" &&
                (value?.text === displayTextOptionCode.MultiAnswer ||
                  value?.text === displayTextOptionCode.SingleAnswer)
                  ? [
                      {
                        key: 0,
                        text: "",
                        textFr: "",
                        isCorrect: false,
                        textvalidation: false,
                        textvalidationFr: false,
                      },
                    ]
                  : field === "questionType"
                    ? []
                    : q.options,
            }
          : q,
      ),
    );
  };

  const handleQuestionOptionChange = (
    qIndex: number,
    optIndex: number,
    newVal: string,
    lang: "en" | "fr" = "en",
  ) => {
    setresuequestionnaire((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };
      if (!question.options) question.options = [];
      let updatedOptions = [...question.options];
      updatedOptions[optIndex] = {
        ...updatedOptions[optIndex],
        ...(lang === "en" ? { text: newVal } : { textFr: newVal }),
      };
      question.options = updatedOptions;
      question.CareerportalAnswer = updatedOptions;
      updated[qIndex] = question;
      return updated;
    });
  };

  const handleQuestionAddRow = (qIndex: number) => {
    setresuequestionnaire((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };

      if (!question.options) {
        question.options = [];
      }

      const newOption = {
        key: question.options.length,
        text: "",
        textFr: "",
        isCorrect: false,
        textvalidation: false,
        textvalidationFr: false,
      };

      question.options = [...question.options, newOption];
      updated[qIndex] = question;
      return updated;
    });
  };

  const handleQuestionDeleteRow = (qIndex: number, optIndex: number) => {
    setresuequestionnaire((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };
      if (!question.options) {
        question.options = [];
      }
      question.options.splice(optIndex, 1);
      question.options = question.options.map((opt, i) => ({ ...opt, key: i }));
      const selectedAnswers = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt, i) => ({ key: i, text: opt.text, textFr: opt.textFr }));

      question.expectedAnswer = JSON.stringify(selectedAnswers);

      updated[qIndex] = question;
      return updated;
    });
  };

  const handleCommonRadioChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setresuequestionnaire((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q,
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
          if (
            props.CurrentRoleID &&
            props.CurrentRoleID.includes &&
            props.CurrentRoleID.includes(RoleID.RecruitmentHR)
          ) {
            props.navigation("/ReviewProfileList", {
              state: {
                TabName: props.stateValue?.TabNames,
                tab: props.stateValue?.tab,
              },
            });
          } else if (
            props.CurrentRoleID &&
            props.CurrentRoleID.includes &&
            props.CurrentRoleID.includes(RoleID.LineManager)
          ) {
            props.navigation("/RecurimentProcess", {
              state: {
                TabName: props.stateValue?.TabNames,
                tab: props.stateValue?.tab,
              },
            });
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
    value: string,
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
          StatusId?.PendingwithHRandLMtocreateinterviewQuestion
            ? CatogryOptionCode.InterviewPanel
            : CatogryOptionCode.CareerPortalCandidate,
      }));
    }
    // let userRole = GetStatusIdRoles(props.stateValue?.StatusId);
    // setCurrentRoleID(userRole ?? 0);
  }, [props?.stateValue?.StatusId]);

  useEffect(() => {
    if (
      [
        displayTextOptionCode.MultiAnswer,
        displayTextOptionCode.SingleAnswer,
      ].includes(InterviewQuesData.QuestionType?.text?.trim() || "")
    ) {
      setOptionsType([
        {
          key: 0,
          text: "",
          textFr: "",
          isCorrect: false,
          textvalidation: false,
          textvalidationFr: false,
        },
      ]);
    } else {
      setOptionsType([]);
    }
  }, [InterviewQuesData.QuestionType]);

  useEffect(() => {
    async function fetchMaster() {
      setIsLoading(true);
      const CategoryData = await GetPortalJobsService.GetAllMaster(
        CategoryID.QuestionCategory,
      );
      // const ScopeData = await GetPortalJobsService.GetAllMaster(
      //   CategoryID.QuestionScopes
      // );
      const QuestionType = await GetPortalJobsService.GetAllMaster(
        CategoryID.QuestionType,
      );
      if (
        CategoryData.status === ResponeStatus.SUCCESS
        // ScopeData.status === ResponeStatus.SUCCESS &&
        // QuestionType.status === ResponeStatus.SUCCESS
      ) {
        const CategoryOption: AutoCompleteItem[] = (
          CategoryData.data ?? []
        ).map((opt: any) => ({
          key: opt.value,
          text: opt.displayText,
        }));
        let categoryOptionVal: string[] = CategoryOption.map(
          (item) => item.text,
        );

        const ScopeOption: AutoCompleteItem[] = (props.Department ?? [])
          // .filter((item: any) => item.value !== "S6" && item.value !== "S7")
          .map((opt: any) => ({
            key: opt.code,
            text: opt.text,
          }));

        const QuestionTypeOption: AutoCompleteItem[] = (QuestionType.data ?? [])
          .filter((opt: any) => {
            if (
              InterviewQuesData.Catogry === CatogryOptionCode.InterviewPanel
            ) {
              return opt.displayText === displayTextOptionCode.CustomAnswer;
            } else if (
              InterviewQuesData.Catogry ===
              CatogryOptionCode.CareerPortalCandidate
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

        const Departments = ScopeOption.filter(
          (item) => item.text === props.stateValue?.Department,
        );
        const DepartmentCode = props.Department.filter(
          (item: any) => item.text === props.stateValue?.Department,
        );
        debugger;
        const category = CategoryOption.find(
          (cat) => cat.text === InterviewQuesData.Catogry,
        );
        const obj: getQuestionById = {
          discipline: String(DepartmentCode[0]?.code || ""),
          category: String(category?.key),
          createdBy: props.CurrentRoleID.includes(RoleID.LineManager)
            ? QuestionCreatedBy.LM
            : QuestionCreatedBy.HR,
        };
        const res = await GetPortalJobsService.GetQuestionaireByScope(obj);
        if (res.status === ResponeStatus.SUCCESS) {
          setQuestionnaire(res.data ?? []); // fallback to [] if null
        } else {
          const ApiFailedMsg = {
            Message: RecuritmentHRMsg.APIErrorMsg,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              if (userClickedOK) {
                setAlertPopupOpen(false);
              }
            },
          };

          setAlertPopupOpen(true);
          setalertProps(ApiFailedMsg);
          setIsLoading(false);
        }

        setInterviewQuesData((prev) => ({
          ...prev,
          Disciplines: Departments[0],
        }));
        setGetMasterData((prevState) => ({
          ...prevState,
          category: CategoryOption,
          categoryOption: categoryOptionVal,
          ScopeOption: ScopeOption,
          QueType: QuestionTypeOption,
        }));
        setIsLoading(false);
      } else {
        setIsLoading(false);
        const APIError = {
          Message: RecuritmentHRMsg.APIErrorMsg,
          Type: HRMSAlertOptions.Error,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              if (
                props.CurrentRoleID &&
                props.CurrentRoleID.includes &&
                props.CurrentRoleID.includes(RoleID.RecruitmentHR)
              ) {
                props.navigation("/ReviewProfileList", {
                  state: {
                    TabName: props.stateValue?.TabNames,
                    tab: props.stateValue?.tab,
                  },
                });
              } else if (
                props.CurrentRoleID &&
                props.CurrentRoleID.includes &&
                props.CurrentRoleID.includes(RoleID.LineManager)
              ) {
                props.navigation("/RecurimentProcess", {
                  state: {
                    TabName: props.stateValue?.TabNames,
                    tab: props.stateValue?.tab,
                  },
                });
              }
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
    void fetchMaster();
  }, [InterviewQuesData.Catogry]);

  useEffect(() => {
    const existingQuestions = resuequestionnaire.filter(
      (q) => q.Type === DataType.Existing,
    ); // Example property
    const newQuestions = resuequestionnaire.filter(
      (q) => q.Type === DataType.New,
    );
    setNewquestionnaire(newQuestions);
    setExistingquestionnaire(existingQuestions);
  }, [resuequestionnaire]);
  // tabs
  const getFetchQuestion = () => {
    if (InterviewQuesData?.Disciplines?.text) {
      setViewQA(true);
    } else {
      const SelectedMag = {
        Message: RecuritmentHRMsg.SelectedErrorMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(SelectedMag);
      setIsLoading(false);
    }
  };

  const handleNewQuestion = () => {
    if (InterviewQuesData?.Disciplines?.text) {
      if (showCreateQuestionBox) {
        handleCloseCreateQuestion();
      } else {
        setShowCreateQuestionBox(true);
      }
    } else {
      const SelectedMag = {
        Message: RecuritmentHRMsg.SelectedErrorMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(SelectedMag);
      setIsLoading(false);
    }
  };

  const handleRemoveQuestionnaire = (id: number, Type: string) => {
    const DeleteConfirmationMsg = {
      Message: RecuritmentHRMsg.deleteMsg,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonLebel: ValidationAction.Yes,
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          let updatedQuestionnaire: ViewQuestion[] = [];
          if (Type === DataType.Existing) {
            updatedQuestionnaire = resuequestionnaire.filter(
              (item) => item.id !== id,
            );
          } else if (Type === DataType.New) {
            const existingCount = resuequestionnaire.filter(
              (item) => item.Type === DataType.Existing,
            ).length;

            const nextQuestionId = existingCount + id;
            updatedQuestionnaire = resuequestionnaire.filter(
              (item) => item.id !== nextQuestionId,
            );
          }
          // const updatedQuestionnaire = resuequestionnaire.filter(
          //   (item) => item.id !== id
          // );

          const questionList: ViewQuestion[] = updatedQuestionnaire.map(
            (item, idx) => {
              const incrementedIndex = idx + 1;
              return {
                ...item,
                id: idx,
                header: "Q" + incrementedIndex,
                HeaderLabel: `Question ${incrementedIndex}`,
              };
            },
          );

          setresuequestionnaire(questionList);

          setAlertPopupOpen(false);
        } else {
          setAlertPopupOpen(false);
        }
      },
    };
    setAlertPopupOpen(true);
    setalertProps(DeleteConfirmationMsg);
    setIsLoading(false);
  };

  const tabs = [
    {
      label: TabName.InterviewQuestion,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            position: "relative", // Ensure z-index works
            overflow: "visible", // Allow dropdown to escape
            zIndex: 1, // Raise above background
          }}
        >
          <CardContent>
            <div className="ms-Grid-row" style={{ marginBottom: "2px" }}>
              {/* <div className="ms-Grid-col ms-lg7">
                <LabelHeaderComponents
                  value={`Job Title - ${props?.stateValue?.JobTitleInEnglish} (${props?.stateValue?.JobCode})`}
                >
                  {" "}
                </LabelHeaderComponents>
              </div>
              <div
                className="ms-Grid-col ms-lg5"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <LabelHeaderComponents
                  value={`Status - ${props.stateValue?.Status}`}
                />
              </div> */}
            </div>

            {/* <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Label
                style={{
                  fontSize: "18px",
                  color: "black",
                  fontFamily: "Roboto,sans-serif",
                  fontStyle: "normal",
                  fontWeight: "600",
                  marginTop: "1%",
                }}
              >
                {props?.stateValue?.StatusId ===
                StatusId.PendingwithLMcreateDisqualificationQuestion
                  ? `Career Portal Candidate Questionnaires `
                  : `Interview Questionnaires `}
              </Label>
            </div> */}
            {/* <Card
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
            </Card> */}
            {/* Left side  Image */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                overflow: "visible",
              }}
            >
              <Box sx={{ width: "100%", overflow: "visible" }}>
                {/* <Box sx={{ mb: 2 }}>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg5">
                      <CustomAutoComplete
                        label="Disciplines"
                        options={getMasterData.ScopeOption}
                        value={InterviewQuesData.Disciplines}
                        onChange={(val) =>
                          handleAutoComplete("Disciplines", val)
                        }
                        disabled={true}
                        mandatory={true}
                        error={ValidationError.Disciplines}
                      />
                    </div>
                    <div className="ms-Grid-col ms-lg2.5 ">
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
                          position: "relative",
                          top: "39px",
                          color: "white",
                          textTransform: "none",
                          borderRadius: "4px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                        onClick={() => getFetchQuestion()}
                      >
                        View Questions
                      </Button>
                    </div>
                    <div className="ms-Grid-col ms-lg2.5">
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
                          position: "relative",
                          top: "39px",
                          color: "white",
                          textTransform: "none",
                          borderRadius: "4px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                        onClick={() => handleNewQuestion()}
                      >
                        New Question
                      </Button>
                    </div>
                  </div>
                </Box> */}
                <Box sx={{ mb: 2 }}>
                  <Card
                    sx={{
                      borderRadius: "4px",
                      borderColor: "#5f5f5f",
                      boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          flexWrap: "nowrap", // single line
                        }}
                      >
                        {/* LEFT : TITLE (DYNAMIC) */}
                        <Label
                          style={{
                            fontSize: "18px",
                            color: "black",
                            fontFamily: "Roboto, sans-serif",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {props?.stateValue?.StatusId ===
                          StatusId.PendingwithLMcreateDisqualificationQuestion
                            ? "Career Portal Candidate Questionnaires"
                            : "Interview Questionnaires"}
                        </Label>

                        {/* CENTER : DISCIPLINES (DYNAMIC) */}
                        <Box
                          sx={{
                            backgroundColor: "#eef6ff",
                            borderRadius: "10px",
                            px: 3,
                            py: 1,
                            minWidth: "280px",
                            textAlign: "center",
                            flexShrink: 0, // prevent shrinking
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#2563eb",
                              letterSpacing: "0.5px",
                            }}
                          >
                            DISCIPLINES
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#0f172a",
                            }}
                          >
                            {InterviewQuesData?.Disciplines?.text || "-"}
                          </Typography>
                        </Box>

                        {/* RIGHT : BUTTONS (DYNAMIC ACTIONS) */}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            flexShrink: 0,
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor:
                                ColorCode.ButtonColorCode.ButtonColor,
                              textTransform: "none",
                              borderRadius: "4px",
                              fontSize: "14px",
                              fontWeight: 500,
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor:
                                  ColorCode.ButtonColorCode.ButtonColor,
                              },
                            }}
                            onClick={getFetchQuestion}
                          >
                            View Questions
                          </Button>

                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor:
                                ColorCode.ButtonColorCode.ButtonColor,
                              textTransform: "none",
                              borderRadius: "4px",
                              fontSize: "14px",
                              fontWeight: 500,
                              boxShadow: "none",
                              "&:hover": {
                                backgroundColor:
                                  ColorCode.ButtonColorCode.ButtonColor,
                              },
                            }}
                            onClick={handleNewQuestion}
                          >
                            New Question
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {existingquestionnaire.length > 0 && (
                  <>
                    <CustomLabel value={"Reuse Question"} />
                    <Card
                      sx={{
                        mb: 2,
                        borderRadius: "4px",
                        borderColor: "#5f5f5f",
                        boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                        height:
                          expandedExistingQuestion !== null ? "auto" : "auto",
                        transition: "height 0.3s ease-in-out",
                        overflow: "hidden",
                      }}
                    >
                      <CardContent
                        sx={{
                          maxHeight:
                            expandedExistingQuestion !== null ? "none" : 250,
                          overflowY:
                            expandedExistingQuestion !== null
                              ? "visible"
                              : "auto",
                          pr: 1,
                        }}
                      >
                        {existingquestionnaire.map((q, index) => {
                          const isExpanded = expandedExistingQuestion === index;
                          return (
                            <Box
                              key={q.id}
                              sx={{
                                boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                                borderRadius: "4px",
                                borderColor: "#5f5f5f",
                                marginTop: "1%",
                              }}
                            >
                              <Accordion
                                expanded={isExpanded}
                                onChange={() => handleExpand(index)}
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
                                      // fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                                      fontSize: "14px",
                                      flexGrow: 1,
                                    }}
                                  >
                                    {q.HeaderLabel}
                                  </Typography>
                                </AccordionSummary>
                                {/* <AccordionDetails
                                  style={{
                                    position: "relative",
                                    bottom: "24px",
                                  }}
                                >
                                  {isExpanded && (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <div>
                                          <span>Q{index + 1}:</span>
                                          <span
                                            style={{
                                              display: "inline-block",
                                            }}
                                            dangerouslySetInnerHTML={{
                                              __html: `${
                                                q.question
                                                  ? q?.question
                                                      .replace(/<p>/gi, "")
                                                      .replace(/<\/p>/gi, "")
                                                      .replace(
                                                        /<br\s*\/?>/gi,
                                                        ""
                                                      )
                                                      .trim()
                                                  : ""
                                              }`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <p
                                        style={{
                                          marginTop: "5px",
                                        }}
                                      >
                                        <strong>Expected Answer:</strong>{" "}
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: Array.isArray(q.expectedAnswer)
                                              ? q.expectedAnswer.join(", ")
                                              : q.expectedAnswer || "",
                                          }}
                                        />
                                      </p>

                                      {q.questionFr && (
                                        <div style={{ marginTop: "8px" }}>
                                          <span style={{ fontWeight: 600 }}>
                                            QUESTION (FR):
                                          </span>
                                          <div
                                            style={{ display: "inline-block", marginLeft: 8 }}
                                            dangerouslySetInnerHTML={{
                                              __html: q.questionFr
                                                ? q.questionFr
                                                    .replace(/<p>/gi, "")
                                                    .replace(/<\/p>/gi, "")
                                                    .replace(/<br\s*\/?/gi, "")
                                                    .trim()
                                                : "",
                                            }}
                                          />

                                          <p style={{ marginTop: "5px" }}>
                                            <strong>Expected Answer (FR):</strong>{" "}
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: Array.isArray(q.expectedAnswerFr)
                                                  ? q.expectedAnswerFr.join(", ")
                                                  : q.expectedAnswerFr || "",
                                              }}
                                            />
                                          </p>
                                        </div>
                                      )}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "end",
                                        }}
                                      >
                                        <Button
                                          variant="contained"
                                          sx={{
                                            backgroundColor:
                                              ColorCode.ButtonColorCode
                                                .ButtonColor,
                                            color: "white",
                                            "&:hover": {
                                              backgroundColor:
                                                ColorCode.ButtonColorCode
                                                  .ButtonColor,
                                            },
                                            textTransform: "none",
                                            borderRadius: "4px",
                                            px: 3,
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveQuestionnaire(
                                              index,
                                              DataType.Existing
                                            );
                                          }}
                                        >
                                          Remove
                                        </Button>
                                      </Box>
                                    </>
                                  )}
                                </AccordionDetails> */}
                                <AccordionDetails sx={{ pt: 0 }}>
                                  {isExpanded && (
                                    <>
                                      {/* SCOPE BADGE */}
                                      {q.scope && (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            mb: 1,
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              backgroundColor: "#e8f0fe",
                                              color: "#1a73e8",
                                              px: 1.5,
                                              py: 0.5,
                                              borderRadius: "4px",
                                              fontSize: "12px",
                                              fontWeight: 600,
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {q.scope}
                                          </Box>
                                        </Box>
                                      )}
                                      <Box
                                        sx={{
                                          display: "grid",
                                          gridTemplateColumns: "1fr 1fr",
                                          gap: "32px",
                                          mt: 1,
                                        }}
                                      >
                                        <Box>
                                          <Typography
                                            sx={{
                                              fontSize: 12,
                                              color: "#6b7280",
                                              mb: 0.5,
                                            }}
                                          >
                                            QUESTION ENGLISH
                                          </Typography>

                                          <Typography
                                            sx={{ fontWeight: 600 }}
                                            dangerouslySetInnerHTML={{
                                              __html: q.question
                                                ?.replace(
                                                  /<p>|<\/p>|<br\s*\/?>/gi,
                                                  "",
                                                )
                                                .trim(),
                                            }}
                                          />

                                          <Box
                                            sx={{
                                              mt: 1,
                                              backgroundColor: "#f8fafc",
                                              p: 1.5,
                                              borderRadius: "4px",
                                            }}
                                          >
                                            <strong>Expected Answer</strong>
                                            <Typography>
                                              {Array.isArray(q.expectedAnswer)
                                                ? q.expectedAnswer.join(", ")
                                                : q.expectedAnswer}
                                            </Typography>
                                          </Box>
                                        </Box>

                                        {/* FRENCH */}
                                        {q.questionFr && (
                                          <Box>
                                            <Typography
                                              sx={{
                                                fontSize: 12,
                                                color: "#6b7280",
                                                mb: 0.5,
                                              }}
                                            >
                                              QUESTION FRANÇAISE
                                            </Typography>

                                            <Typography
                                              sx={{ fontWeight: 600 }}
                                              dangerouslySetInnerHTML={{
                                                __html: q.questionFr
                                                  ?.replace(
                                                    /<p>|<\/p>|<br\s*\/?>/gi,
                                                    "",
                                                  )
                                                  .trim(),
                                              }}
                                            />

                                            <Box
                                              sx={{
                                                mt: 1,
                                                backgroundColor: "#f8fafc",
                                                p: 1.5,
                                                borderRadius: "4px",
                                              }}
                                            >
                                              <strong>Expected Answer</strong>
                                              <Typography>
                                                {Array.isArray(
                                                  q.expectedAnswerFr,
                                                )
                                                  ? q.expectedAnswerFr.join(
                                                      ", ",
                                                    )
                                                  : q.expectedAnswerFr}
                                              </Typography>
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>

                                      {/* REMOVE BUTTON */}
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                          mt: 2,
                                        }}
                                      >
                                        <Button
                                          variant="contained"
                                          sx={{
                                            backgroundColor:
                                              ColorCode.ButtonColorCode
                                                .ButtonColor,
                                            textTransform: "none",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveQuestionnaire(
                                              index,
                                              DataType.Existing,
                                            );
                                          }}
                                        >
                                          Remove
                                        </Button>
                                      </Box>
                                    </>
                                  )}
                                </AccordionDetails>
                              </Accordion>
                            </Box>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </>
                )}

                {/*  Add the question show  UI  */}
                {newquestionnaire.length > 0 && (
                  <>
                    <CustomLabel value={"New Question"} />
                    <Card
                      sx={{
                        mb: 2,
                        borderRadius: "4px",
                        borderColor: "#5f5f5f",
                        boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                        height:
                          expandedQuestionIndex !== null ? "auto" : "auto",
                        transition: "height 0.3s ease-in-out",
                        overflow: "hidden",
                      }}
                    >
                      <CardContent
                        sx={{
                          maxHeight:
                            expandedQuestionIndex !== null ? "none" : 250,
                          overflowY:
                            expandedQuestionIndex !== null ? "visible" : "auto",
                          pr: 1,
                        }}
                      >
                        {newquestionnaire.map((q, index) => {
                          const isExpanded = expandedQuestionIndex === index;
                          // const IsIndex =
                          //   existingquestionnaire.length + (index + 1);
                          const str = q.HeaderLabel || "";
                          const number = str.split(" ")[1]; // returns "6"
                          const Totalindex = parseInt(number);
                          return (
                            <>
                              <Box
                                sx={{
                                  boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                                  borderRadius: "4px",
                                  borderColor: "#5f5f5f",
                                  marginTop: "1%",
                                }}
                              >
                                <Accordion
                                  key={q.id}
                                  expanded={isExpanded}
                                  onChange={() => handleToggleExpand(index)}
                                  sx={{
                                    boxShadow: "none",
                                    borderBottom: "1px solid #ddd",
                                    "&:last-of-type": {
                                      borderBottom: "none",
                                    },
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
                                      {q.HeaderLabel}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {isExpanded && (
                                      <>
                                        {props?.stateValue?.StatusId ===
                                          StatusId.PendingwithLMcreateDisqualificationQuestion && (
                                          <Box sx={{ marginTop: "-25px" }}>
                                            <div className="ms-Grid-row">
                                              <div className="ms-Grid-col ms-lg5">
                                                <CustomAutoComplete
                                                  label="Type of Question"
                                                  options={
                                                    getMasterData.QueType
                                                  }
                                                  value={q.questionType}
                                                  onChange={(val) =>
                                                    handleQuestionFieldChange(
                                                      Totalindex - 1,
                                                      "questionType",
                                                      val,
                                                    )
                                                  }
                                                  disabled={false}
                                                  mandatory={true}
                                                />
                                              </div>
                                            </div>
                                          </Box>
                                        )}

                                        {/* Bilingual Question Section - Side by Side with Visual Enhancements */}
                                        <Box
                                          sx={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: 2,
                                            mb: 2,
                                            width: "100%",
                                          }}
                                        >
                                          {/* English Question Section */}
                                          <Box
                                            sx={{
                                              // p: 2,
                                              // border: "1px solid #e0e0e0",
                                              borderRadius: "4px",
                                              // backgroundColor: "#f9f9f9",
                                              width: "100%",
                                              overflow: "hidden",
                                            }}
                                          >
                                            <Box sx={{ mt: 1, width: "100%" }}>
                                              <RichTextEditor
                                                label="Question (English)"
                                                value={q.question || ""}
                                                onChange={(val) =>
                                                  handleQuestionFieldChange(
                                                    index,
                                                    "question",
                                                    val,
                                                  )
                                                }
                                                mandatory={true}
                                              />
                                            </Box>
                                          </Box>

                                          {/* French Question Section */}
                                          <Box
                                            sx={{
                                              // p: 2,
                                              // border: "1px solid #e0e0e0",
                                              borderRadius: "4px",
                                              // backgroundColor: "#f9f9f9",
                                              width: "100%",
                                              overflow: "hidden",
                                            }}
                                          >
                                            <Box sx={{ mt: 1, width: "100%" }}>
                                              <RichTextEditor
                                                label="Question (French)"
                                                value={q.questionFr || ""}
                                                onChange={(val) =>
                                                  handleQuestionFieldChange(
                                                    index,
                                                    "questionFr",
                                                    val,
                                                  )
                                                }
                                                mandatory={true}
                                              />
                                            </Box>
                                          </Box>
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
                                                        marginTop: "3%",
                                                        width: "80px",
                                                        fontSize: "14px",
                                                        fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                                                      }}
                                                    >
                                                      Option {optIndex + 1} *
                                                    </Typography>

                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        gap: 8,
                                                        width: "77%",
                                                      }}
                                                    >
                                                      <div style={{ flex: 1 }}>
                                                        <CustomInput
                                                          label="Option (EN)"
                                                          value={option.text}
                                                          onChange={(val) =>
                                                            handleQuestionOptionChange(
                                                              Totalindex - 1,
                                                              optIndex,
                                                              val,
                                                              "en",
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                      <div style={{ flex: 1 }}>
                                                        <CustomInput
                                                          label="Option (FR)"
                                                          value={
                                                            option.textFr || ""
                                                          }
                                                          onChange={(val) =>
                                                            handleQuestionOptionChange(
                                                              Totalindex - 1,
                                                              optIndex,
                                                              val,
                                                              "fr",
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    </div>
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
                                                        marginTop: "3%",
                                                        justifyContent:
                                                          "center",
                                                        cursor: "pointer",
                                                        boxShadow: isSelected
                                                          ? "0px 0px 5px rgba(0, 128, 0, 0.5)"
                                                          : "0px 0px 5px rgba(0, 0, 0, 0.2)",
                                                        transition:
                                                          "all 0.3s ease-in-out",
                                                      }}
                                                      onClick={() =>
                                                        handleAnswerSelection(
                                                          Totalindex - 1,
                                                          optIndex,
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
                                                        marginTop: "3%",
                                                      }}
                                                    >
                                                      {q.options!.length >
                                                        1 && (
                                                        <Button
                                                          variant="contained"
                                                          sx={{
                                                            backgroundColor:
                                                              ColorCode
                                                                .ButtonColorCode
                                                                .ButtonColor,
                                                            color: "white",
                                                            minWidth: 40,
                                                            "&:hover": {
                                                              backgroundColor:
                                                                ColorCode
                                                                  .ButtonColorCode
                                                                  .ButtonColor,
                                                            },
                                                          }}
                                                          onClick={() =>
                                                            handleQuestionDeleteRow(
                                                              Totalindex - 1,
                                                              optIndex,
                                                            )
                                                          }
                                                        >
                                                          <DeleteOutlineIcon
                                                            sx={{
                                                              fontSize: 20,
                                                            }}
                                                          />
                                                        </Button>
                                                      )}
                                                      {optIndex ===
                                                        q.options!.length -
                                                          1 && (
                                                        <Button
                                                          variant="contained"
                                                          sx={{
                                                            backgroundColor:
                                                              ColorCode
                                                                .ButtonColorCode
                                                                .ButtonColor,
                                                            color: "white",
                                                            minWidth: 40,
                                                            "&:hover": {
                                                              backgroundColor:
                                                                ColorCode
                                                                  .ButtonColorCode
                                                                  .ButtonColor,
                                                            },
                                                          }}
                                                          onClick={() =>
                                                            handleQuestionAddRow(
                                                              Totalindex - 1,
                                                            )
                                                          }
                                                        >
                                                          <AddIcon />
                                                        </Button>
                                                      )}
                                                    </Box>
                                                  </Box>
                                                );
                                              },
                                            )}
                                          </Box>
                                        ) : props?.stateValue?.StatusId ===
                                          StatusId.PendingwithHRandLMtocreateinterviewQuestion ? (
                                          <>
                                            <Box
                                              sx={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: 2,
                                                mb: 2,
                                                width: "100%",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  width: "100%",
                                                  overflow: "hidden",
                                                }}
                                              >
                                                <RichTextEditor
                                                  label="Expected Answer (English)"
                                                  value={q.expectedAnswer || ""}
                                                  onChange={(val) =>
                                                    handleQuestionFieldChange(
                                                      index,
                                                      "expectedAnswer",
                                                      val,
                                                    )
                                                  }
                                                  mandatory={true}
                                                />
                                              </Box>
                                              <Box
                                                sx={{
                                                  width: "100%",
                                                  overflow: "hidden",
                                                }}
                                              >
                                                <RichTextEditor
                                                  label="Expected Answer (French)"
                                                  value={
                                                    q.expectedAnswerFr || ""
                                                  }
                                                  onChange={(val) =>
                                                    handleQuestionFieldChange(
                                                      index,
                                                      "expectedAnswerFr",
                                                      val,
                                                    )
                                                  }
                                                  mandatory={true}
                                                />
                                              </Box>
                                            </Box>
                                          </>
                                        ) : null}

                                        {props?.stateValue?.StatusId ===
                                          StatusId.PendingwithLMcreateDisqualificationQuestion && (
                                          <Box sx={{ mb: 2, width: "50%" }}>
                                            <CustomRadioGroup
                                              label="Disqualification Question?"
                                              value={q.Disqualification ?? "NO"}
                                              onChange={(val) =>
                                                handleCommonRadioChange(
                                                  Totalindex - 1,
                                                  "Disqualification",
                                                  val,
                                                )
                                              }
                                              mandatory={true}
                                              options={isDisqualificationOption}
                                            />
                                          </Box>
                                        )}

                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                          }}
                                        >
                                          <Button
                                            variant="contained"
                                            sx={{
                                              backgroundColor:
                                                ColorCode.ButtonColorCode
                                                  .ButtonColor,
                                              color: "white",
                                              "&:hover": {
                                                backgroundColor:
                                                  ColorCode.ButtonColorCode
                                                    .ButtonColor,
                                              },
                                              textTransform: "none",
                                              borderRadius: "4px",
                                              px: 3,
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveQuestionnaire(
                                                index,
                                                DataType.New,
                                              );
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
                  </>
                )}
                {/*Create the Ques   */}
                {showCreateQuestionBox && (
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
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        sx={{
                          color: " rgb(50, 49, 48)",
                          fontSize: "16px",
                          fontFamily: `"Segoe UI", "Segoe UI Web (West European)", 
                         "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Create Question
                      </Typography>

                      {props?.stateValue?.StatusId ===
                        StatusId.PendingwithLMcreateDisqualificationQuestion && (
                        <Box sx={{ minWidth: 280 }}>
                          <CustomAutoComplete
                            label="Type of Question"
                            options={getMasterData.QueType}
                            value={InterviewQuesData.QuestionType}
                            onChange={(val) => {
                              void handleAutoComplete("QuestionType", val);
                              setExpandedQuestionIndex(null);
                            }}
                            disabled={false}
                            mandatory={true}
                            error={ValidationError.QuestionType}
                          />
                        </Box>
                      )}
                    </Box>

                    <>
                      {/* {props?.stateValue?.StatusId ===
                        StatusId.PendingwithLMcreateDisqualificationQuestion && (
                        <Box sx={{ mb: 2 }}>
                          <div className="ms-Grid-row">
                            <div className="ms-Grid-col ms-lg5">
                              <CustomAutoComplete
                                label="Type of Question"
                                options={getMasterData.QueType}
                                value={InterviewQuesData.QuestionType}
                                onChange={(val) => {
                                  void handleAutoComplete("QuestionType", val);
                                  setExpandedQuestionIndex(null);
                                }}
                                disabled={false}
                                mandatory={true}
                                error={ValidationError.QuestionType}
                              />
                            </div>
                          </div>
                        </Box>
                      )} */}

                      {/* Bilingual Question Section - Side by Side with Fixed Width */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 2,
                          mb: 2,
                          width: "100%",
                        }}
                      >
                        {/* English Question Section */}
                        <Box
                          sx={{
                            // p: 2,
                            // border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            // backgroundColor: "#f9f9f9",
                            width: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <Box sx={{ mt: 1, width: "100%" }}>
                            <RichTextEditor
                              label={`Question (English) ${resuequestionnaire.length + 1}`}
                              value={EnglishQuestion}
                              onChange={handleEnglishQuestion}
                              mandatory={true}
                              error={ValidationError.Question}
                            />
                          </Box>
                        </Box>

                        {/* French Question Section */}
                        <Box
                          sx={{
                            // p: 2,
                            // border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            // backgroundColor: "#f9f9f9",
                            width: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <Box sx={{ mt: 1, width: "100%" }}>
                            <RichTextEditor
                              label={`Question (French) ${resuequestionnaire.length + 1}`}
                              value={FrenchQuestion}
                              onChange={handleFrenchQuestion}
                              mandatory={true}
                              error={ValidationError.Question}
                            />
                          </Box>
                        </Box>
                      </Box>

                      {/* {[
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

                                  <div style={{ display: "flex", gap: 8, width: "60%" }}>
                                    <div style={{ flex: 1 }}>
                                      <CustomInput
                                        label="Option (EN)"
                                        value={option.text}
                                        onChange={(val) =>
                                          handleOptionChange(index, val, "en")
                                        }
                                        placeHolder="Option in English"
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <CustomInput
                                        label="Option (FR)"
                                        value={option.textFr || ""}
                                        onChange={(val) =>
                                          handleOptionChange(index, val, "fr")
                                        }
                                        placeHolder="Option en Français"
                                      />
                                    </div>
                                  </div>

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
                                    onClick={() =>
                                      handleAnswerSelections(index)
                                    }
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
                                          backgroundColor:
                                            ColorCode.ButtonColorCode
                                              .ButtonColor,
                                          color:
                                            ColorCode.ButtonColorCode.color,
                                          minWidth: 40,
                                          "&:hover": {
                                            backgroundColor:
                                              ColorCode.ButtonColorCode
                                                .ButtonColor,
                                          },
                                        }}
                                        onClick={() => handleDeleteRow(index)}
                                      >
                                        <DeleteOutlineIcon
                                          sx={{ fontSize: 20 }}
                                        />
                                      </Button>
                                    )}

                                    {index === OptionsType.length - 1 && (
                                      <Button
                                        variant="contained"
                                        sx={{
                                          backgroundColor:
                                            ColorCode.ButtonColorCode
                                              .ButtonColor,
                                          color:
                                            ColorCode.ButtonColorCode.color,
                                          minWidth: 40,
                                          "&:hover": {
                                            backgroundColor:
                                              ColorCode.ButtonColorCode
                                                .ButtonColor,
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
                      ) : props?.stateValue?.StatusId ===
                        StatusId.PendingwithHRandLMtocreateinterviewQuestion ? (
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
                      ) : null} */}

                      {[
                        displayTextOptionCode.MultiAnswer,
                        displayTextOptionCode.SingleAnswer,
                      ].includes(
                        InterviewQuesData.QuestionType?.text?.trim() || "",
                      ) ? (
                        <Box sx={{ mb: 3 }}>
                          {OptionsType && OptionsType.length > 0 ? (
                            OptionsType.map((option, index) => {
                              const isSelected = option.isCorrect;
                              return (
                                <>
                                  <Box
                                    key={index}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                      mb: 2,
                                      gap: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        minWidth: 80,
                                        marginTop: 0,
                                        textAlign: "right",
                                        pr: 1,
                                      }}
                                    >
                                      Option {index + 1} *
                                    </Typography>

                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        width: "77%",
                                      }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <CustomInput
                                          label="Option (EN)"
                                          placeHolder="Enter your text (maximum 155 characters)"
                                          value={option.text}
                                          onChange={(val) =>
                                            handleOptionChange(index, val, "en")
                                          }
                                        />
                                        {option.textvalidation && (
                                          <p
                                            style={{
                                              marginTop: 5,
                                              color: "red",
                                              fontSize: 12,
                                              marginLeft: 0,
                                            }}
                                          >
                                            English input is too long. Please
                                            reduce to 155 characters or fewer.
                                          </p>
                                        )}
                                        {option.fieldValidation && (
                                          <p
                                            style={{
                                              marginTop: 5,
                                              color: "red",
                                              fontSize: 12,
                                              marginLeft: 0,
                                            }}
                                          >
                                            English field is required
                                          </p>
                                        )}
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <CustomInput
                                          label="Option (FR)"
                                          placeHolder="Entrez le texte (maximum 155 caractères)"
                                          value={option.textFr || ""}
                                          onChange={(val) =>
                                            handleOptionChange(index, val, "fr")
                                          }
                                        />
                                        {option.textvalidationFr && (
                                          <p
                                            style={{
                                              marginTop: 5,
                                              color: "red",
                                              fontSize: 12,
                                              marginLeft: 0,
                                            }}
                                          >
                                            French input is too long. Please
                                            reduce to 155 characters or fewer.
                                          </p>
                                        )}
                                        {option.fieldValidationFr && (
                                          <p
                                            style={{
                                              marginTop: 5,
                                              color: "red",
                                              fontSize: 12,
                                              marginLeft: 0,
                                            }}
                                          >
                                            French field is required
                                          </p>
                                        )}
                                      </div>
                                    </div>

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
                                        marginTop:
                                          option.textvalidation ||
                                          option.textvalidationFr
                                            ? 0
                                            : "3%",
                                      }}
                                      onClick={() =>
                                        handleAnswerSelections(index)
                                      }
                                    >
                                      <Tooltip title="select the correct answer">
                                        <CheckCircleOutlineIcon
                                          sx={{
                                            color: isSelected
                                              ? "white"
                                              : "black",
                                            fontSize: 24,
                                            cursor: "pointer", // Optional: make it look clickable
                                          }}
                                        />
                                      </Tooltip>
                                      {/* <CheckCircleOutlineIcon
                                      sx={{
                                        color: isSelected ? "white" : "black",
                                        fontSize: 24,
                                      }}
                                    /> */}
                                    </Box>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                        marginTop:
                                          option.textvalidation ||
                                          option.textvalidationFr
                                            ? 0
                                            : "3%",
                                      }}
                                    >
                                      {OptionsType.length > 1 && (
                                        <Button
                                          variant="contained"
                                          sx={{
                                            backgroundColor:
                                              ColorCode.ButtonColorCode
                                                .ButtonColor,
                                            color:
                                              ColorCode.ButtonColorCode.color,
                                            minWidth: 40,
                                            "&:hover": {
                                              backgroundColor:
                                                ColorCode.ButtonColorCode
                                                  .ButtonColor,
                                            },
                                          }}
                                          onClick={() => handleDeleteRow(index)}
                                        >
                                          <DeleteOutlineIcon
                                            sx={{ fontSize: 20 }}
                                          />
                                        </Button>
                                      )}

                                      {index === OptionsType.length - 1 && (
                                        <Button
                                          variant="contained"
                                          sx={{
                                            backgroundColor:
                                              ColorCode.ButtonColorCode
                                                .ButtonColor,
                                            color:
                                              ColorCode.ButtonColorCode.color,
                                            minWidth: 40,
                                            "&:hover": {
                                              backgroundColor:
                                                ColorCode.ButtonColorCode
                                                  .ButtonColor,
                                            },
                                          }}
                                          onClick={handleAddRow}
                                        >
                                          <AddIcon />
                                        </Button>
                                      )}
                                    </Box>
                                  </Box>
                                </>
                              );
                            })
                          ) : (
                            <Typography color="error">
                              No options available.
                            </Typography>
                          )}

                          {/* Display validation error messages */}
                          {ValidationError.OptionsType && (
                            <Typography color="error">
                              {ValidationError.OptionsType}
                            </Typography>
                          )}
                        </Box>
                      ) : props?.stateValue?.StatusId ===
                        StatusId.PendingwithHRandLMtocreateinterviewQuestion ? (
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            mb: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ width: "100%", overflow: "hidden" }}>
                            <RichTextEditor
                              label="Expected Answer (English)"
                              value={InterviewQuesData.ExpectedAnswer}
                              onChange={(val) =>
                                handleRichTextEditor(val, "ExpectedAnswer")
                              }
                              mandatory={true}
                              error={ValidationError.ExpectedAnswer}
                            />
                          </Box>
                          <Box sx={{ width: "100%", overflow: "hidden" }}>
                            <RichTextEditor
                              label="Expected Answer (French)"
                              value={InterviewQuesData.ExpectedAnswerFr || ""}
                              onChange={(val) =>
                                handleRichTextEditor(val, "ExpectedAnswerFr")
                              }
                              mandatory={true}
                              error={ValidationError.ExpectedAnswerFr}
                            />
                          </Box>
                        </Box>
                      ) : null}

                      {props?.stateValue?.StatusId ===
                        StatusId.PendingwithLMcreateDisqualificationQuestion && (
                        <Box sx={{ mb: 2, width: "50%" }}>
                          <CustomRadioGroup
                            label="Is this a disqualification question?"
                            value={InterviewQuesData?.Disqualification ?? ""}
                            options={isDisqualificationOption}
                            error={ValidationError.Disqualification}
                            mandatory={true}
                            onChange={(value) =>
                              handleIsDisqualificationChange(
                                "Disqualification",
                                value,
                              )
                            }
                          />
                        </Box>
                      )}
                    </>

                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <Button
                        variant="contained"
                        // startIcon={<AddIcon />}
                        onClick={() =>
                          handleSaveQuestion(
                            resuequestionnaire.length + 1,
                            OptionsType.length,
                          )
                        }
                        sx={{
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
                          color: "white",
                          "&:hover": {
                            backgroundColor:
                              ColorCode.ButtonColorCode.ButtonColor,
                          },
                          textTransform: "none",
                          borderRadius: "4px",
                          px: 3,
                        }}
                      >
                        {editingQuestionIndex !== null
                          ? ButtonAction.Update
                          : ButtonAction.Save}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleCloseCreateQuestion}
                        sx={{
                          backgroundColor:
                            ColorCode.ButtonColorCode.ButtonColor,
                          color: "white",
                          "&:hover": {
                            backgroundColor:
                              ColorCode.ButtonColorCode.ButtonColor,
                          },
                          textTransform: "none",
                          borderRadius: "4px",
                          px: 3,
                          marginLeft: "2%",
                        }}
                      >
                        {ButtonAction.close}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ),
    },
  ];
  useEffect(() => {
    if (activeTab === "tab1") {
      setTabNameData(() => {
        return [
          { tabName: props.stateValue?.TabNames },
          // { tabName: props.stateValue?.ButtonAction },
          {
            tabName:
              InterviewQuesData.Catogry ===
              CatogryOptionCode.CareerPortalCandidate
                ? TabName.CareerPortal
                : TabName.InterviewPanel,
          },
        ];
      });
    }
  }, [
    props.stateValue?.ID,
    activeTab,
    props.stateValue?.TabNames,
    props.stateValue?.ButtonAction,
  ]);

  // async function Submit_fn() {
  //   setIsLoading(true);
  //   const lastResueId =
  //     resuequestionnaire.length > 0
  //       ? Math.max(...resuequestionnaire.map((item) => item.id))
  //       : 0;

  //   const adjustedQuestions = questions.map((item, idx) => ({
  //     ...item,
  //     id: lastResueId + idx + 1,
  //     questionNumber: {
  //       key: lastResueId + idx + 1,
  //       text: `Question ${lastResueId + idx + 1}`,
  //     },
  //   }));

  //   const QuestionairesData = [...resuequestionnaire, ...adjustedQuestions];
  //   let QuestionValue: UpsertQuestions[] = QuestionairesData.map((item) => {
  //     const category = getMasterData.category.find(
  //       (cat) => cat.text === InterviewQuesData.Catogry
  //     );

  //     // Initialize variables
  //     let OptionsValue: optionsValue[] = [];
  //     let answerValue: answersValue[] = [];

  //     if (category?.text === CatogryOptionCode.CareerPortalCandidate) {
  //       OptionsValue =
  //         item.options?.map((opt, index) => ({
  //           optionEn: opt.text,
  //           optionFr: opt.text,
  //           sequence: index + 1,
  //         })) || [];

  //       answerValue =
  //         item.CareerportalAnswer?.map((ans) => ({
  //           optionEn: ans.text,
  //           optionFr: ans.text,
  //         })) || [];
  //     } else {
  //       OptionsValue =
  //         item.options?.map((opt, index) => ({
  //           optionEn: opt.text,
  //           optionFr: opt.text,
  //           sequence: index + 1,
  //         })) || [];

  //       OptionsValue = [
  //         {
  //           optionEn: item.expectedAnswer,
  //           optionFr: item.expectedAnswer,
  //           sequence: 1,
  //         },
  //       ];

  //       answerValue = [
  //         {
  //           optionEn: item.expectedAnswer,
  //           optionFr: item.expectedAnswer,
  //         },
  //       ];
  //     }
  //     const scopeId =
  //       item?.Type === DataType.Existing
  //         ? String(item.discipline)
  //         : String(item.discipline.key);
  //     const questionTypeId =
  //       item?.Type === DataType.Existing
  //         ? String(item.questionType)
  //         : String(item.questionType.key);

  //     return {
  //       questionEn: item.question,
  //       questionFr: item.question,
  //       scopeId: scopeId,
  //       categoryId: String(category?.key),
  //       // questionTypeId: String(item.questionType.key),
  //       questionTypeId: questionTypeId,
  //       isQualifier:
  //         InterviewQuesData.Catogry === CatogryOptionCode.CareerPortalCandidate
  //           ? 1
  //           : 0,
  //       isAnswerValidate: item.Disqualification === "No" ? 0 : 1,
  //       sequence: item.id,
  //       jobCode: props.stateValue.JobCode,
  //       options: OptionsValue,
  //       answers: answerValue,
  //     };
  //   });

  //   const response = await GetPortalJobsService.UpsertQuestions(QuestionValue);

  //   if (response.status === ResponeStatus.SUCCESS) {
  //     const obj: any = {
  //       ActionId: WorkflowAction.Approved,
  //       ItemCreated: "Yes",
  //     };
  //     await SPServices.SPUpdateItem({
  //       Listname: ListNames.HRMSRecruitmentDptDetails,
  //       RequestJSON: obj,
  //       ID: props.stateValue?.ID,
  //     });
  //     const SuccessAlert = {
  //       Message:
  //         InterviewQuesData.Catogry === CatogryOptionCode.CareerPortalCandidate
  //           ? RecuritmentHRMsg.CareerportalSuccessMsg
  //           : RecuritmentHRMsg.InterviewQuestionSuccessMsg,
  //       Type: HRMSAlertOptions.Success,
  //       visible: true,
  //       ButtonAction: async (userClickedOK: boolean) => {
  //         if (userClickedOK) {
  //           props.navigation("/ReviewProfileList", {
  //             state: { activeTab: "tab2" },
  //           });
  //           setAlertPopupOpen(false);
  //         } else {
  //           setAlertPopupOpen(false);
  //         }
  //       },
  //     };

  //     setAlertPopupOpen(true);
  //     setalertProps(SuccessAlert);
  //     setIsLoading(false);
  //     setInterviewQuesData((prev) => ({
  //       ...prev,
  //       Catogry: "",
  //     }));
  //   } else {
  //     const APIError = {
  //       Message: RecuritmentHRMsg.APIErrorMsg,
  //       Type: HRMSAlertOptions.Error,
  //       visible: true,
  //       ButtonAction: async (userClickedOK: boolean) => {
  //         if (userClickedOK) {
  //           setAlertPopupOpen(false);
  //         } else {
  //           setAlertPopupOpen(false);
  //         }
  //       },
  //     };

  //     setAlertPopupOpen(true);
  //     setalertProps(APIError);
  //     setIsLoading(false);
  //   }
  //   setIsLoading(false);
  // }

  async function Submit_fn() {
    setIsLoading(true);
    const lastResueId =
      resuequestionnaire.length > 0
        ? Math.max(...resuequestionnaire.map((item) => item.id))
        : 0;

    const adjustedQuestions = questions.map((item, idx) => ({
      ...item,
      id: lastResueId + idx + 1,
      questionNumber: {
        key: lastResueId + idx + 1,
        text: `Question ${lastResueId + idx + 1}`,
      },
    }));

    const QuestionairesData = [...resuequestionnaire, ...adjustedQuestions];

    // Validate new questions before submitting. If any new question is incomplete,
    // show an alert popup naming the question and stop submission.
    const stripHtml = (html: string | undefined) => {
      if (!html) return "";
      try {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || "";
        // normalize non-breaking spaces and trim
        text = text.replace(/\u00A0|&nbsp;/g, " ").trim();
        return text;
      } catch (e) {
        return (html || "")
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim();
      }
    };

    const newQuestionsToValidate = resuequestionnaire.filter(
      (q) => q.Type === DataType.New,
    );

    for (const nq of newQuestionsToValidate) {
      const label = nq.HeaderLabel || `Question ${nq.id}`;

      // Validate Question (English)
      if (!stripHtml(nq.question)) {
        setIsLoading(false);
        setAlertPopupOpen(true);
        setalertProps({
          Message: `${label}\n\nThe English question text is missing. Please enter the question in English.`,
          Type: HRMSAlertOptions.Error,
          visible: true,
          ButtonAction: async () => {
            setAlertPopupOpen(false);
          },
        });
        return;
      }

      // Validate Question (French)
      if (!stripHtml(nq.questionFr)) {
        setIsLoading(false);
        setAlertPopupOpen(true);
        setalertProps({
          Message: `${label}\n\nThe French question text is missing. Please enter a question in French before submitting.`,
          Type: HRMSAlertOptions.Error,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            setAlertPopupOpen(false);
          },
        });
        return;
      }

      if (
        props?.stateValue?.StatusId ===
        StatusId.PendingwithHRandLMtocreateinterviewQuestion
      ) {
        // Validate Expected Answer (English)
        if (!nq.expectedAnswer || nq.expectedAnswer.trim() === "") {
          setIsLoading(false);
          setAlertPopupOpen(true);
          setalertProps({
            Message: `${label}\n\nThe Expected Answer (English) field cannot be empty. Please enter a value before submitting.`,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async () => {
              setAlertPopupOpen(false);
            },
          });
          return;
        }

        // Validate Expected Answer (French)
        if (!nq.expectedAnswerFr || nq.expectedAnswerFr.trim() === "") {
          setIsLoading(false);
          setAlertPopupOpen(true);
          setalertProps({
            Message: `${label}\n\nThe Expected Answer (French) field cannot be empty. Please enter a value before submitting.`,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async () => {
              setAlertPopupOpen(false);
            },
          });
          return;
        }
      }

      const qTypeText = nq?.questionType?.text || "";
      if (
        qTypeText === displayTextOptionCode.MultiAnswer ||
        qTypeText === displayTextOptionCode.SingleAnswer
      ) {
        if (!nq.options || nq.options.length === 0) {
          setIsLoading(false);
          setAlertPopupOpen(true);
          setalertProps({
            Message: `${label}\n\nNo answer options have been added. Please add at least one option before submitting.`,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              setAlertPopupOpen(false);
            },
          });
          return;
        }

        // Check if all options have EN filled
        // if (
        //   nq.options.some((opt: any) => !opt.text || opt.text.trim() === "")
        // ) {
        //   setIsLoading(false);
        //   setAlertPopupOpen(true);
        //   setalertProps({
        //     Message: `${label}\n\nSome answer options are missing English text. Please ensure all options have English text filled in.`,
        //     Type: HRMSAlertOptions.Error,
        //     visible: true,
        //     ButtonAction: async (userClickedOK: boolean) => {
        //       setAlertPopupOpen(false);
        //     },
        //   });
        //   return;
        // }

        // // Check if all options have FR filled
        // if (
        //   nq.options.some((opt: any) => !opt.textFr || opt.textFr.trim() === "")
        // ) {
        //   setIsLoading(false);
        //   setAlertPopupOpen(true);
        //   setalertProps({
        //     Message: `${label}\n\nSome answer options are missing French text. Please ensure all options have French text filled in.`,
        //     Type: HRMSAlertOptions.Error,
        //     visible: true,
        //     ButtonAction: async (userClickedOK: boolean) => {
        //       setAlertPopupOpen(false);
        //     },
        //   });
        //   return;
        // }

        // Check if at least one correct answer is selected
        if (!nq.options.some((opt: any) => opt.isCorrect)) {
          setIsLoading(false);
          setAlertPopupOpen(true);
          setalertProps({
            Message: `${label}\n\nNo correct answer has been marked. Please select at least one correct answer before submitting.`,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              setAlertPopupOpen(false);
            },
          });
          return;
        }
      } else {
        if (
          !nq.expectedAnswer ||
          (typeof nq.expectedAnswer === "string" &&
            nq.expectedAnswer.trim() === "")
        ) {
          setIsLoading(false);
          setAlertPopupOpen(true);
          setalertProps({
            Message: `${label}\n\nThe expected answer is missing. Please provide the answer before submitting.`,
            Type: HRMSAlertOptions.Error,
            visible: true,
            ButtonAction: async (userClickedOK: boolean) => {
              setAlertPopupOpen(false);
            },
          });
          return;
        }
      }
    }

    console.log("Submitting questions payload:", {
      InterviewQuesData,
      EnglishQuestion,
      FrenchQuestion,
      QuestionairesData,
    });
    let IsVaild =
      InterviewQuesData.Catogry === CatogryOptionCode.CareerPortalCandidate
        ? QuestionairesData.length >= 5
        : true;
    if (IsVaild) {
      let JobCodeFilter = [
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: props.stateValue?.JobCodeID,
        },
        { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
      ];
      let JobUniqueValue = await getVRRDetails.GetJobUniqueDataValue(
        JobCodeFilter,
        "and",
      );
      let QuestionValue: UpsertQuestions[] = QuestionairesData.map((item) => {
        const category = getMasterData.category.find(
          (cat) => cat.text === InterviewQuesData.Catogry,
        );

        // Initialize variables
        let OptionsValue: optionsValue[] = [];
        let answerValue: answersValue[] = [];

        const decodeBase64 = (str: string): string => {
          const utf8Bytes: any = new TextEncoder().encode(str);
          const binary = String.fromCharCode(...utf8Bytes);
          return btoa(binary);
        };
        //  const stripHtml = (html: string) => {
        //         if (!html) return "";
        //         const tmp = document.createElement("DIV");
        //         tmp.innerHTML = html;
        //         return tmp.textContent || tmp.innerText || "";
        //       };

        if (category?.text === CatogryOptionCode.CareerPortalCandidate) {
          OptionsValue =
            item.options?.map((opt, index) => ({
              optionEn: decodeBase64(opt.text),
              optionFr: decodeBase64(opt.textFr ?? opt.text),
              sequence: index + 1,
            })) || [];

          answerValue =
            item.CareerportalAnswer?.map((ans) => ({
              optionEn: decodeBase64(ans.text),
              optionFr: decodeBase64(ans.textFr ?? ans.text),
            })) || [];
        } else {
          OptionsValue = [
            {
              optionEn:
                item?.Type === DataType.Existing
                  ? decodeBase64(item.expectedAnswer[0])
                  : decodeBase64(item.expectedAnswer),
              optionFr:
                item?.Type === DataType.Existing
                  ? decodeBase64(
                      item.expectedAnswer?.[0] || item.expectedAnswer[0],
                    )
                  : decodeBase64(item.expectedAnswer || item.expectedAnswer),
              sequence: 1,
            },
          ];

          answerValue = [
            {
              optionEn:
                item?.Type === DataType.Existing
                  ? decodeBase64(item.expectedAnswer[0])
                  : decodeBase64(item.expectedAnswer),
              optionFr:
                item?.Type === DataType.Existing
                  ? decodeBase64(
                      item.expectedAnswerFr?.[0] || item.expectedAnswerFr[0],
                    )
                  : decodeBase64(item.expectedAnswerFr || item.expectedAnswer),
            },
          ];
        }
        const scopeId =
          item?.Type === DataType.Existing
            ? String(item.discipline)
            : String(item.discipline.key);
        const questionTypeId =
          item?.Type === DataType.Existing
            ? String(item.questionType)
            : String(item.questionType.key);

        return {
          questionEn: decodeBase64(item.question),
          questionFr: decodeBase64(item.questionFr || item.question),
          scopeId: scopeId,
          categoryId: String(category?.key),
          // questionTypeId: String(item.questionType.key),
          questionTypeId: questionTypeId,
          isQualifier:
            InterviewQuesData.Catogry ===
            CatogryOptionCode.CareerPortalCandidate
              ? 1
              : 0,
          isAnswerValidate: item.Disqualification === "No" ? 0 : 1,
          sequence: item.id,
          jobCode: JobUniqueValue.data[0]?.JobUniqueKey,
          options: OptionsValue,
          answers: answerValue,
          createdBy: props.CurrentRoleID.includes(RoleID.LineManager)
            ? QuestionCreatedBy.LM
            : QuestionCreatedBy.HR,
        };
      });

      console.log("Mapped QuestionValue to send to API:", QuestionValue);

      const response =
        await GetPortalJobsService.UpsertQuestions(QuestionValue);

      if (response.status === ResponeStatus.SUCCESS) {
        if (
          InterviewQuesData.Catogry === CatogryOptionCode.CareerPortalCandidate
        ) {
          const obj: any = {
            ActionId: WorkflowAction.Approved,
            ItemCreated: "Yes",
          };
          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSRecruitmentDptDetails,
            RequestJSON: obj,
            ID: props.stateValue?.ID,
          });
        } else {
          let obj: any = {};
          if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
            obj = {
              QuestionByHR: "Yes",
            };
          } else {
            obj = {
              QuestionByLM: "Yes",
            };
          }

          await SPServices.SPUpdateItem({
            Listname: ListNames.HRMSRecruitmentDptDetails,
            RequestJSON: obj,
            ID: props.stateValue?.ID,
          });
        }

        const SuccessAlert = {
          Message:
            InterviewQuesData.Catogry ===
            CatogryOptionCode.CareerPortalCandidate
              ? RecuritmentHRMsg.CareerportalSuccessMsg
              : RecuritmentHRMsg.InterviewQuestionSuccessMsg,
          Type: HRMSAlertOptions.Success,
          visible: true,
          ButtonAction: async (userClickedOK: boolean) => {
            if (userClickedOK) {
              if (
                props.CurrentRoleID &&
                props.CurrentRoleID.includes &&
                props.CurrentRoleID.includes(RoleID.RecruitmentHR)
              ) {
                props.navigation("/ReviewProfileList", {
                  state: {
                    TabName: props.stateValue?.TabNames,
                    tab: props.stateValue?.tab,
                  },
                });
              } else if (
                props.CurrentRoleID &&
                props.CurrentRoleID.includes &&
                props.CurrentRoleID.includes(RoleID.LineManager)
              ) {
                props.navigation("/RecurimentProcess", {
                  state: {
                    TabName: props.stateValue?.TabNames,
                    tab: props.stateValue?.tab,
                  },
                });
              }
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
    } else {
      const QuestionValiError = {
        Message: RecuritmentHRMsg.QuestionValiErrorMsg,
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
      setalertProps(QuestionValiError);
      setIsLoading(false);
    }

    setIsLoading(false);
  }

  const handleCheckbox = (id: number, value: boolean) => {
    setQuestionnaire((prevState) =>
      questionnaire.map((q) => (q.id === id ? { ...q, Checked: value } : q)),
    );
  };

  function Reusequestion_fn() {
    setViewQA(false);
    const SelectedQuestions = questionnaire.filter((item) => item.Checked);
    const ExistingQuestion = SelectedQuestions.map((item) => ({
      ...item,
      Type: DataType.Existing,
      // Preserve both English and French data
      question: item.question,
      questionFr: item.questionFr,
      expectedAnswer: item.expectedAnswer,
      expectedAnswerFr: item.expectedAnswerFr,
    }));
    const lastResueId =
      resuequestionnaire.length > 0
        ? Math.max(...resuequestionnaire.map((item) => item.id))
        : 0;

    const adjustedQuestions = ExistingQuestion.map((item, idx) => ({
      ...item,
      id: lastResueId + idx + 1,
      questionNumber: {
        key: lastResueId + idx + 1,
        text: `Question ${lastResueId + idx + 1}`,
      },
    }));
    const filteredResueQuestionnaire = resuequestionnaire.filter(
      (item) => item.Type !== DataType.Existing,
    );

    const QuestionairesData = [
      ...filteredResueQuestionnaire,
      ...adjustedQuestions,
    ];
    const sortedQuestionList = QuestionairesData.sort((a, b) => {
      if (a.Type === DataType.Existing && b.Type !== DataType.Existing)
        return -1;
      if (a.Type !== DataType.Existing && b.Type === DataType.Existing)
        return 1;
      return 0;
    });
    const questionList: ViewQuestion[] = sortedQuestionList.map(
      (item, index) => {
        const incrementedIndex = index + 1;
        return {
          ...item,
          id: index,
          Checked: item.Checked,
          header: "Q" + incrementedIndex,
          HeaderLabel: `Question ${incrementedIndex}`,
          Type: item.Type,
          // Ensure both English and French data are preserved
          question: item.question,
          questionFr: item.questionFr,
          expectedAnswer: item.expectedAnswer,
          expectedAnswerFr: item.expectedAnswerFr,
        };
      },
    );

    setresuequestionnaire(questionList);
  }

  return (
    <>
      {viewQA ? (
        <ViewQuestionCheckbox
          questionnaire={questionnaire}
          handleCheckbox={(id, value) => handleCheckbox(id, value)}
          Disciplines={InterviewQuesData?.Disciplines.text}
          Reusequestion_fn={() => Reusequestion_fn()}
          onClose={() => setViewQA(false)}
        />
      ) : (
        <>
          <CustomLoader isLoading={isLoading}>
            {/* <div
              style={{
                backgroundColor: "#EEEEEE",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0px 2px 4px 3px lightgray",
                margin: "10px",
                height: " calc(-158px + 97vh)",
                width: "93%",
              }}
            > */}
            <div className="menu-card">
              <React.Fragment>
                <BreadcrumbsComponent
                  items={tabs}
                  initialItem={activeTab}
                  TabName={TabNameData}
                  onBreadcrumbChange={handleBreadcrumbChange}
                  handleCancel={handleCancel}
                  JobValue={{
                    JobTitle: props?.stateValue?.JobTitleInEnglish ?? "",
                    JobCode: props?.stateValue?.JobCode,
                    Status: props.stateValue?.Status,
                  }}
                  additionalButtons={[
                    ...(resuequestionnaire.length > 0
                      ? [
                          {
                            label: ButtonAction.Submit,
                            onClick: async () => {
                              await Submit_fn();
                            },
                          },
                        ]
                      : []),
                  ]}
                />
              </React.Fragment>
            </div>
          </CustomLoader>
        </>
      )}

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
