import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import { Typography, Button, Box } from "@mui/material";
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
  ButtonAction,
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
import LabelHeaderComponents from "../../components/TitleHeader";
import {
  answersValue,
  getQuestionById,
  optionsValue,
  UpsertQuestions,
} from "../../Models/ApIInterface";
import { GetPortalJobsService } from "../../Services/ServiceExport";
import SPServices from "../../Services/SPService/SPServices";
import ViewQuestionCheckbox, {
  ViewQuestion,
} from "../ScreenComponent/ViewQuestionCheckbox";
import CustomLabel from "../../components/CustomLabel";
import { Label } from "@fluentui/react";

type InterviewQuesValidationError = {
  QuestionType: boolean;
  QuestionNumber: boolean;
  Disciplines: boolean;
  Question: boolean;
  ExpectedAnswer: boolean;
  OptionsType: string | boolean;
  Catogry: boolean;
  Disqualification: boolean;
};

export type OptionRow = {
  key: number;
  text: string;
  isCorrect?: boolean;
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
  expectedAnswer: string;
  CareerportalAnswer: OptionRow[];
  options?: OptionRow[];
  Disqualification: string;
  Type?: string;
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
      StatusId?.PendingwithHRandLMtocreateinterviewQuestion
        ? CatogryOptionCode.InterviewPanel
        : CatogryOptionCode.CareerPortalCandidate,
    Disqualification: "",
    CareerportalAnswer: [],
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

  const handleOptionChange = (index: number, newVal: string) => {
    setOptionsType((prev) => {
      const updated = [...prev];
      updated[index].text = newVal;
      return updated;
    });
  };

  const updateExpectedAnswer = (options: OptionRow[]) => {
    const selectedAnswers: OptionRow[] = options
      .map((opt, index) => ({
        key: index,
        text: opt.text,
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
        (opt) => opt.isCorrect
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
        const category = getMasterData?.category.find(
          (cat) => cat.text === InterviewQuesData.Catogry
        );
        const obj: getQuestionById = {
          discipline: String(value?.key || ""),
          category: String(category?.key),
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

    setOptionsType([{ key: 0, text: "", isCorrect: false }]); // reset options
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
    if (!Question) errors.Question = true;
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
        { key: prev.length, text: "", isCorrect: false },
      ];
      // Validation();
      return newOptions;
    });
  };

  const handleSaveQuestion = (index: number) => {
    const shouldValidateQuestionType =
      props?.stateValue?.StatusId ===
      StatusId.PendingwithLMcreateDisqualificationQuestion;

    const customAnswerType = getMasterData.QueType.find(
      (q) => q.text === displayTextOptionCode.CustomAnswer
    );
    const questionType: AutoCompleteItem = shouldValidateQuestionType
      ? InterviewQuesData.QuestionType
      : customAnswerType || { key: 0, text: "" };
    if (!Validation()) {
      console.warn("Validation failed. Exiting save function.");
      return;
    }

    const correctAnswers = OptionsType.filter((opt) => opt.isCorrect).map(
      (opt, i) => ({ key: i, text: opt.text })
    );
    const questionData: ViewQuestion = {
      id:
        editingQuestionIndex !== null
          ? questions[editingQuestionIndex].id
          : index,
      discipline: InterviewQuesData.Disciplines,
      questionType: questionType,
      question: InterviewQuesData.Question,
      expectedAnswer: InterviewQuesData.ExpectedAnswer,
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
      Disqualification: "",
      Catogry: prev.Catogry,
      CareerportalAnswer: [],
    }));
    setOptionsType([{ key: 0, text: "", isCorrect: false }]);
    setValidationError({} as InterviewQuesValidationError);
  };

  const handleQuestionFieldChange = (
    qIndex: number,
    field: string,
    value: any
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
    setresuequestionnaire((prev) => {
      const updated = [...prev];
      const question = { ...updated[qIndex] };
      if (!question.options) question.options = [];
      let updatedOptions = [...question.options];
      updatedOptions[optIndex] = {
        ...updatedOptions[optIndex],
        text: newVal,
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
        isCorrect: false,
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
    setresuequestionnaire((prevQuestions) => {
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
          StatusId?.PendingwithHRandLMtocreateinterviewQuestion
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
      setIsLoading(true);
      const CategoryData = await GetPortalJobsService.GetAllMaster(
        CategoryID.QuestionCategory
      );
      const ScopeData = await GetPortalJobsService.GetAllMaster(
        CategoryID.QuestionScopes
      );
      const QuestionType = await GetPortalJobsService.GetAllMaster(
        CategoryID.QuestionType
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
          (item) => item.text
        );

        const ScopeOption: AutoCompleteItem[] = (ScopeData.data ?? []).map(
          (opt: any) => ({
            key: opt.value,
            text: opt.displayText,
          })
        );

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
              props.navigation("/ReviewProfileList", {
                state: { activeTab: "tab2" },
              });
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
      (q) => q.Type === DataType.Existing
    ); // Example property
    const newQuestions = resuequestionnaire.filter(
      (q) => q.Type === DataType.New
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
      ButtonAction: async (userClickedOK: boolean) => {
        if (userClickedOK) {
          let updatedQuestionnaire: ViewQuestion[] = [];
          if (Type === DataType.Existing) {
            updatedQuestionnaire = resuequestionnaire.filter(
              (item) => item.id !== id
            );
          } else if (Type === DataType.New) {
            const existingCount = resuequestionnaire.filter(
              (item) => item.Type === DataType.Existing
            ).length;

            const nextQuestionId = existingCount + id;
            updatedQuestionnaire = resuequestionnaire.filter(
              (item) => item.id !== nextQuestionId
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
            }
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
              <div className="ms-Grid-col ms-lg7">
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
              </div>
              {/* {props.stateValue?.Status ===
              "Pending with Line Manager to create a Disqualification Question" ? (
                <div
                  className="ms-Grid-col ms-lg6"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "relative",
                    left: "12%",
                  }}
                >
                  <LabelHeaderComponents
                    value={`Status - ${props.stateValue?.Status}`}
                  />
                </div>
              ) : (
                
              )} */}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start" }}>
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
            </div>
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
                                      fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
                                      fontSize: "14px",
                                      flexGrow: 1,
                                    }}
                                  >
                                    {q.HeaderLabel}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails
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
                                            __html: q.expectedAnswer,
                                          }}
                                        />
                                      </p>
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
                                                      val
                                                    )
                                                  }
                                                  disabled={false}
                                                  mandatory={true}
                                                />
                                              </div>
                                            </div>
                                          </Box>
                                        )}

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
                                                          Totalindex - 1,
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
                                                              optIndex
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
                                                              Totalindex - 1
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
                                        ) : props?.stateValue?.StatusId ===
                                          StatusId.PendingwithHRandLMtocreateinterviewQuestion ? (
                                          <Box sx={{ mb: 2 }}>
                                            <RichTextEditor
                                              label="Expected Answer"
                                              value={q.expectedAnswer || ""}
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
                                                  val
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
                                                DataType.New
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
                        Create Question
                      </Typography>
                    </Box>

                    <>
                      {props?.stateValue?.StatusId ===
                        StatusId.PendingwithLMcreateDisqualificationQuestion && (
                        <Box>
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
                      )}
                      <Box sx={{ mb: 2 }}>
                        <RichTextEditor
                          label={`Question ${resuequestionnaire.length + 1}`}
                          value={InterviewQuesData.Question}
                          onChange={(val) =>
                            handleRichTextEditor(val, "Question")
                          }
                          mandatory={true}
                          error={ValidationError.Question}
                        />
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

                          {/* Display validation error messages */}
                          {ValidationError.OptionsType && (
                            <Typography color="error">
                              {ValidationError.OptionsType}
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
                      ) : null}

                      {props?.stateValue?.StatusId ===
                        StatusId.PendingwithLMcreateDisqualificationQuestion && (
                        <Box sx={{ mb: 2, width: "50%" }}>
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
                      )}
                    </>

                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <Button
                        variant="contained"
                        // startIcon={<AddIcon />}
                        onClick={() =>
                          handleSaveQuestion(resuequestionnaire.length + 1)
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
          { tabName: props.stateValue?.TabName },
          { tabName: props.stateValue?.ButtonAction },
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
    props.stateValue?.TabName,
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
    let QuestionValue: UpsertQuestions[] = QuestionairesData.map((item) => {
      const category = getMasterData.category.find(
        (cat) => cat.text === InterviewQuesData.Catogry
      );

      // Initialize variables
      let OptionsValue: optionsValue[] = [];
      let answerValue: answersValue[] = [];

      if (category?.text === CatogryOptionCode.CareerPortalCandidate) {
        OptionsValue =
          item.options?.map((opt, index) => ({
            optionEn: opt.text,
            optionFr: opt.text,
            sequence: index + 1,
          })) || [];

        answerValue =
          item.CareerportalAnswer?.map((ans) => ({
            optionEn: ans.text,
            optionFr: ans.text,
          })) || [];
      } else {
        OptionsValue = [
          {
            optionEn:
              item?.Type === DataType.Existing
                ? item.expectedAnswer[0]
                : item.expectedAnswer,
            optionFr:
              item?.Type === DataType.Existing
                ? item.expectedAnswer[0]
                : item.expectedAnswer,
            sequence: 1,
          },
        ];

        answerValue = [
          {
            optionEn:
              item?.Type === DataType.Existing
                ? item.expectedAnswer[0]
                : item.expectedAnswer,
            optionFr:
              item?.Type === DataType.Existing
                ? item.expectedAnswer[0]
                : item.expectedAnswer,
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
        questionEn: item.question,
        questionFr: item.question,
        scopeId: scopeId,
        categoryId: String(category?.key),
        // questionTypeId: String(item.questionType.key),
        questionTypeId: questionTypeId,
        isQualifier:
          InterviewQuesData.Catogry === CatogryOptionCode.CareerPortalCandidate
            ? 1
            : 0,
        isAnswerValidate: item.Disqualification === "No" ? 0 : 1,
        sequence: item.id,
        jobCode: props.stateValue.JobCode,
        options: OptionsValue,
        answers: answerValue,
      };
    });

    const response = await GetPortalJobsService.UpsertQuestions(QuestionValue);

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
      }

      const SuccessAlert = {
        Message:
          InterviewQuesData.Catogry === CatogryOptionCode.CareerPortalCandidate
            ? RecuritmentHRMsg.CareerportalSuccessMsg
            : RecuritmentHRMsg.InterviewQuestionSuccessMsg,
        Type: HRMSAlertOptions.Success,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            props.navigation("/ReviewProfileList", {
              state: { activeTab: "tab2" },
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
    setIsLoading(false);
  }

  const handleCheckbox = (id: number, value: boolean) => {
    setQuestionnaire((prevState) =>
      questionnaire.map((q) => (q.id === id ? { ...q, Checked: value } : q))
    );
  };

  function Reusequestion_fn() {
    setViewQA(false);
    const SelectedQuestions = questionnaire.filter((item) => item.Checked);
    const ExistingQuestion = SelectedQuestions.map((item) => ({
      ...item,
      Type: DataType.Existing,
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
      (item) => item.Type !== DataType.Existing
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
        };
      }
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
            <div
              style={{
                backgroundColor: "#EEEEEE",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0px 2px 4px 3px lightgray",

                margin: "10px",
              }}
            >
              <React.Fragment>
                <BreadcrumbsComponent
                  items={tabs}
                  initialItem={activeTab}
                  TabName={TabNameData}
                  onBreadcrumbChange={handleBreadcrumbChange}
                  handleCancel={handleCancel}
                  additionalButtons={[
                    // {
                    //   label: "Close",
                    //   onClick: async () => {
                    //     props.navigation("/ReviewProfileList", {
                    //       state: { activeTab: "tab2" },
                    //     });
                    //   },
                    // },
                    ...(resuequestionnaire.length > 0
                      ? [
                          {
                            label: "Submit",
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
