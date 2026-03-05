import { useMemo, useState, useCallback, useEffect } from "react";
import { StatusId, CatogryOptionCode, DataType, RoleID, RecuritmentHRMsg, HRMSAlertOptions, displayTextOptionCode, validationMsg, WorkflowAction } from "../../../utilities/Config";
import { QuestionCreatedBy } from "../../../utilities/LabelName";
import { fetchMasterData, fetchQuestionnaire, fetchJobUniqueKey, buildQuestionsPayload, submitQuestions, updateWorkflowItem } from "./Interviewquestionservice";
import { AlertPropsData, AutoCompleteItem, InterviewQuesState, InterviewQuesValidationError, MasterOption, OptionRow, ViewQuestion } from "./Interviewtypes";
import { createEmptyOption, normalizeQuestion, reindexQuestions, stripHtml } from "./Questionutils";

interface UseInterviewQuestionsProps {
  stateValue: any;
  CurrentRoleID: number[];
  Department: any[];
  navigation: (path: string, options?: any) => void;
}

const DEFAULT_VALIDATION: InterviewQuesValidationError = {
  QuestionType: false,
  QuestionNumber: false,
  Disciplines: false,
  Question: false,
  ExpectedAnswer: false,
  OptionsType: false,
  Catogry: false,
  Disqualification: false,
  ExpectedAnswerFr: false,
};

export function useInterviewQuestions({
  stateValue,
  CurrentRoleID,
  Department,
  navigation,
}: UseInterviewQuestionsProps) {
  const initialCatogry = useMemo(
    () =>
      stateValue?.StatusId ===
      StatusId?.PendingwithHRandLMtocreateinterviewQuestion
        ? CatogryOptionCode.InterviewPanel
        : CatogryOptionCode.CareerPortalCandidate,
    [stateValue?.StatusId],
  );

  const [formData, setFormData] = useState<InterviewQuesState>({
    Disciplines: { key: 0, text: "" },
    QuestionNumber: { key: 0, text: "" },
    QuestionType: { key: 0, text: "" },
    Question: "",
    ExpectedAnswer: "",
    Catogry: initialCatogry,
    Disqualification: "",
    CareerportalAnswer: [],
    ExpectedAnswerFr: "",
  });

  const [englishQuestion, setEnglishQuestion] = useState("");
  const [frenchQuestion, setFrenchQuestion] = useState("");
  const [optionRows, setOptionRows] = useState<OptionRow[]>([createEmptyOption(0)]);
  const [validationError, setValidationError] = useState<InterviewQuesValidationError>(DEFAULT_VALIDATION);

  const [questionnaire, setQuestionnaire] = useState<ViewQuestion[]>([]);
  const [resuequestionnaire, setResuequestionnaire] = useState<ViewQuestion[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showCreateQuestionBox, setShowCreateQuestionBox] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);
  const [expandedExistingQuestion, setExpandedExistingQuestion] = useState<number | null>(null);
  const [viewQA, setViewQA] = useState(false);
  const [alertPopupOpen, setAlertPopupOpen] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [masterData, setMasterData] = useState<MasterOption>({
    category: [],
    categoryOption: [],
    ScopeOption: [],
    QueType: [],
  });

  const newQuestionnaire = useMemo(
    () => resuequestionnaire.filter((q) => q.Type === DataType.New),
    [resuequestionnaire],
  );

  const existingQuestionnaire = useMemo(
    () => resuequestionnaire.filter((q) => q.Type === DataType.Existing),
    [resuequestionnaire],
  );

  const isDisqualificationStatus = useMemo(
    () =>
      stateValue?.StatusId ===
      StatusId.PendingwithLMcreateDisqualificationQuestion,
    [stateValue?.StatusId],
  );

  const isInterviewPanelStatus = useMemo(
    () =>
      stateValue?.StatusId ===
      StatusId.PendingwithHRandLMtocreateinterviewQuestion,
    [stateValue?.StatusId],
  );

  const showAlert = useCallback(
    (message: string, type: string, onOk?: () => void) => {
      setAlertProps({
        Message: message,
        Type: type,
        visible: true,
        ButtonAction: async (clicked) => {
          if (clicked && onOk) onOk();
          setAlertPopupOpen(false);
        },
      });
      setAlertPopupOpen(true);
    },
    [],
  );

  const navigateAfterAction = useCallback(() => {
    if (CurrentRoleID?.includes(RoleID.RecruitmentHR)) {
      navigation("/ReviewProfileList", {
        state: { TabName: stateValue?.TabNames, tab: stateValue?.tab },
      });
    } else if (CurrentRoleID?.includes(RoleID.LineManager)) {
      navigation("/RecurimentProcess", {
        state: { TabName: stateValue?.TabNames, tab: stateValue?.tab },
      });
    }
  }, [CurrentRoleID, navigation, stateValue]);

  // ─── Load master data ────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadMaster() {
      setIsLoading(true);
      try {
        const master = await fetchMasterData(formData.Catogry, Department);

        const departments = master.ScopeOption.filter(
          (item) => item.text === stateValue?.Department,
        );
        const departmentCode = Department.find(
          (item: any) => item.text === stateValue?.Department,
        );
        const category = master.category.find(
          (cat) => cat.text === formData.Catogry,
        );

        const questionnaireData = await fetchQuestionnaire({
          discipline: String(departmentCode?.code || ""),
          category: String(category?.key),
          createdBy: CurrentRoleID.includes(RoleID.LineManager)
            ? QuestionCreatedBy.LM
            : QuestionCreatedBy.HR,
        });

        setQuestionnaire(questionnaireData);
        setMasterData(master);
        setFormData((prev) => ({ ...prev, Disciplines: departments[0] }));
      } catch {
        showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error, navigateAfterAction);
      } finally {
        setIsLoading(false);
      }
    }
    void loadMaster();
  }, [formData.Catogry]);

  // ─── Sync catogry from status ────────────────────────────────────────────────
  useEffect(() => {
    setFormData((prev) => ({ ...prev, Catogry: initialCatogry }));
  }, [initialCatogry]);

  // ─── Reset options when question type changes ────────────────────────────────
  useEffect(() => {
    const isMCQ = [
      displayTextOptionCode.MultiAnswer,
      displayTextOptionCode.SingleAnswer,
    ].includes(formData.QuestionType?.text?.trim() ?? "");
    setOptionRows(isMCQ ? [createEmptyOption(0)] : []);
  }, [formData.QuestionType]);

  // ─── Option handlers ─────────────────────────────────────────────────────────
  const handleOptionChange = useCallback(
    (index: number, newVal: string, lang: "en" | "fr" = "en") => {
      if (newVal.length > 155) {
        setOptionRows((prev) => {
          const updated = [...prev];
          if (lang === "en") updated[index].textvalidation = true;
          else updated[index].textvalidationFr = true;
          return updated;
        });
        return;
      }
      setOptionRows((prev) => {
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
    },
    [],
  );

  const handleAnswerSelections = useCallback(
    (index: number) => {
      const isMulti =
        formData.QuestionType.text === displayTextOptionCode.MultiAnswer;
      setOptionRows((prev) => {
        const updated = isMulti
          ? prev.map((opt, i) =>
              i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt,
            )
          : prev.map((opt, i) => ({ ...opt, isCorrect: i === index }));
        const selectedAnswers = updated
          .filter((opt) => opt.isCorrect && opt.text.trim())
          .map((opt, i) => ({ key: i, text: opt.text, textFr: opt.textFr }));
        setFormData((prev) => ({ ...prev, CareerportalAnswer: selectedAnswers }));
        return updated;
      });
    },
    [formData.QuestionType.text],
  );

  const handleAddRow = useCallback(() => {
    setOptionRows((prev) => [...prev, createEmptyOption(prev.length)]);
  }, []);

  const handleDeleteRow = useCallback((index: number) => {
    setOptionRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ─── Form field handlers ─────────────────────────────────────────────────────
  const handleAutoComplete = useCallback(
    async (field: string, value: AutoCompleteItem | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (value) {
        setValidationError((prev) => ({ ...prev, [field]: false }));
      }
      if (field === "Disciplines" && formData.Disciplines?.text && formData.Disciplines.text !== value?.text) {
        setAlertProps({
          Message: RecuritmentHRMsg.WarningMsg,
          Type: HRMSAlertOptions.Confirmation,
          visible: true,
          ButtonAction: async (ok) => {
            if (ok) { setResuequestionnaire([]); }
            else { setFormData((prev) => ({ ...prev, Disciplines: formData.Disciplines })); }
            setAlertPopupOpen(false);
          },
        });
        setAlertPopupOpen(true);
      }
    },
    [formData.Disciplines],
  );

  const handleRichTextEditor = useCallback((value: string, stateKey: string) => {
    setFormData((prev) => ({ ...prev, [stateKey]: value }));
    setValidationError((prev) => ({ ...prev, [stateKey]: false }));
  }, []);

  const handleDisqualificationChange = useCallback(
    (key: keyof InterviewQuesState, value: string) => {
      if (value) {
        setFormData((prev) => ({ ...prev, [key]: value }));
        setValidationError((prev) => ({ ...prev, [key]: false }));
      }
    },
    [],
  );

  // ─── Validation ───────────────────────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const errors: Partial<InterviewQuesValidationError> = {};
    const { QuestionType, Disciplines, ExpectedAnswer, Catogry, Disqualification } = formData;
    const activeQuestion = englishQuestion || formData.Question;

    if (!Disciplines?.text) errors.Disciplines = true;
    if (isDisqualificationStatus && !QuestionType?.text) errors.QuestionType = true;
    if (!activeQuestion) errors.Question = true;
    if (!Catogry) errors.Catogry = true;

    const isMCQ =
      QuestionType?.text === displayTextOptionCode.MultiAnswer ||
      QuestionType?.text === displayTextOptionCode.SingleAnswer;

    if (isMCQ) {
      const filled = optionRows.filter((opt) => opt.text.trim());
      const selected = filled.filter((opt) => opt.isCorrect);
      if (filled.length < 2) errors.OptionsType = validationMsg.MaxOptions;
      else if (
        (QuestionType.text === displayTextOptionCode.MultiAnswer && selected.length === 0) ||
        (QuestionType.text === displayTextOptionCode.SingleAnswer && selected.length !== 1)
      ) {
        errors.OptionsType = validationMsg.CorrectAns;
      }
    } else {
      if (!ExpectedAnswer) errors.ExpectedAnswer = true;
      if (!formData.ExpectedAnswerFr) errors.ExpectedAnswerFr = true;
    }

    if (isDisqualificationStatus && !Disqualification) errors.Disqualification = true;

    setValidationError((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  }, [formData, englishQuestion, optionRows, isDisqualificationStatus]);

  // ─── Save question ────────────────────────────────────────────────────────────
  const handleSaveQuestion = useCallback(() => {
    const currentQuestion = normalizeQuestion(formData.Question);
    const duplicated =
      resuequestionnaire.some((q) => normalizeQuestion(q.question) === currentQuestion) &&
      newQuestionnaire.some((q) => normalizeQuestion(q.question) === currentQuestion);

    if (currentQuestion && duplicated) {
      showAlert(RecuritmentHRMsg.duplicatedquestionMsg, HRMSAlertOptions.Error);
      return;
    }
    if (!validate()) return;

    const shouldUseCustom = !isDisqualificationStatus;
    const customAnswerType = masterData.QueType.find(
      (q) => q.text === displayTextOptionCode.CustomAnswer,
    );
    const questionType: AutoCompleteItem = shouldUseCustom
      ? customAnswerType ?? { key: 0, text: "" }
      : formData.QuestionType;

    const correctAnswers = optionRows
      .filter((opt) => opt.isCorrect)
      .map((opt, i) => ({ key: i, text: opt.text, textFr: opt.textFr ?? "" }));

    const idx = resuequestionnaire.length + 1;
    const questionData: ViewQuestion = {
      id: editingQuestionIndex !== null ? resuequestionnaire[editingQuestionIndex].id : idx,
      discipline: formData.Disciplines,
      questionType,
      question: englishQuestion || formData.Question,
      questionFr: frenchQuestion || formData.Question,
      expectedAnswer: formData.ExpectedAnswer,
      expectedAnswerFr: formData.ExpectedAnswerFr,
      CareerportalAnswer: correctAnswers,
      options: [displayTextOptionCode.MultiAnswer, displayTextOptionCode.SingleAnswer].includes(
        questionType.text,
      )
        ? [...optionRows]
        : undefined,
      Disqualification: formData.Disqualification ?? "",
      Type: DataType.New,
      Checked: false,
      HeaderLabel:
        editingQuestionIndex !== null
          ? `Question ${editingQuestionIndex + 1}`
          : `Question ${idx}`,
    };

    setResuequestionnaire((prev) => {
      if (editingQuestionIndex !== null) {
        const updated = [...prev];
        updated[editingQuestionIndex] = questionData;
        return updated;
      }
      return [...prev, questionData];
    });

    // Reset form
    setFormData((prev) => ({
      ...prev,
      QuestionNumber: { key: 0, text: "" },
      QuestionType: { key: 0, text: "" },
      Question: "",
      ExpectedAnswer: "",
      ExpectedAnswerFr: "",
      Disqualification: "",
      CareerportalAnswer: [],
    }));
    setEnglishQuestion("");
    setFrenchQuestion("");
    setOptionRows([createEmptyOption(0)]);
    setValidationError(DEFAULT_VALIDATION);
    setEditingQuestionIndex(null);
  }, [
    formData, englishQuestion, frenchQuestion, optionRows,
    resuequestionnaire, newQuestionnaire, editingQuestionIndex,
    masterData, isDisqualificationStatus, validate, showAlert,
  ]);

  // ─── Remove question ──────────────────────────────────────────────────────────
  const handleRemoveQuestionnaire = useCallback(
    (index: number, type: string) => {
      setAlertProps({
        Message: RecuritmentHRMsg.deleteMsg,
        Type: HRMSAlertOptions.Confirmation,
        visible: true,
        ButtonLebel: "Yes",
        ButtonAction: async (ok) => {
          if (ok) {
            setResuequestionnaire((prev) => {
              let filtered: ViewQuestion[];
              if (type === DataType.Existing) {
                const target = existingQuestionnaire[index];
                filtered = prev.filter((item) => item.id !== target?.id);
              } else {
                const target = newQuestionnaire[index];
                filtered = prev.filter((item) => item.id !== target?.id);
              }
              return reindexQuestions(filtered);
            });
          }
          setAlertPopupOpen(false);
        },
      });
      setAlertPopupOpen(true);
    },
    [existingQuestionnaire, newQuestionnaire],
  );

  // ─── Inline editing handlers ──────────────────────────────────────────────────
  const handleQuestionFieldChange = useCallback(
    (qIndex: number, field: string, value: any) => {
      setResuequestionnaire((prev) =>
        prev.map((q, i) =>
          i === qIndex
            ? {
                ...q,
                [field]: value,
                options:
                  field === "questionType" &&
                  [displayTextOptionCode.MultiAnswer, displayTextOptionCode.SingleAnswer].includes(
                    value?.text,
                  )
                    ? [createEmptyOption(0)]
                    : field === "questionType"
                      ? []
                      : q.options,
              }
            : q,
        ),
      );
    },
    [],
  );

  const handleQuestionOptionChange = useCallback(
    (qIndex: number, optIndex: number, newVal: string, lang: "en" | "fr" = "en") => {
      setResuequestionnaire((prev) => {
        const updated = [...prev];
        const question = { ...updated[qIndex] };
        const updatedOptions = [...(question.options ?? [])];
        updatedOptions[optIndex] = {
          ...updatedOptions[optIndex],
          ...(lang === "en" ? { text: newVal } : { textFr: newVal }),
        };
        question.options = updatedOptions;
        updated[qIndex] = question;
        return updated;
      });
    },
    [],
  );

  const handleQuestionAddRow = useCallback((qIndex: number) => {
    setResuequestionnaire((prev) => {
      const updated = [...prev];
      const q = { ...updated[qIndex] };
      q.options = [...(q.options ?? []), createEmptyOption((q.options ?? []).length)];
      updated[qIndex] = q;
      return updated;
    });
  }, []);

  const handleQuestionDeleteRow = useCallback((qIndex: number, optIndex: number) => {
    setResuequestionnaire((prev) => {
      const updated = [...prev];
      const q = { ...updated[qIndex] };
      const opts = (q.options ?? []).filter((_, i) => i !== optIndex).map((o, i) => ({ ...o, key: i }));
      q.options = opts;
      updated[qIndex] = q;
      return updated;
    });
  }, []);

  const handleAnswerSelection = useCallback((qIndex: number, optIndex: number) => {
    setResuequestionnaire((prev) => {
      const updated = [...prev];
      const q = { ...updated[qIndex] };
      const isSingle = (q.questionType as AutoCompleteItem)?.text === displayTextOptionCode.SingleAnswer;
      q.options = (q.options ?? []).map((opt, i) => ({
        ...opt,
        isCorrect: isSingle ? i === optIndex : i === optIndex ? !opt.isCorrect : opt.isCorrect,
      }));
      q.CareerportalAnswer = q.options.filter((opt) => opt.isCorrect);
      updated[qIndex] = q;
      return updated;
    });
  }, []);

  const handleCommonRadioChange = useCallback(
    (index: number, field: string, value: string) => {
      setResuequestionnaire((prev) =>
        prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
      );
    },
    [],
  );

  // ─── View questions ───────────────────────────────────────────────────────────
  const handleCheckbox = useCallback((id: number, value: boolean) => {
    setQuestionnaire((prev) => prev.map((q) => (q.id === id ? { ...q, Checked: value } : q)));
  }, []);

  const getFetchQuestion = useCallback(() => {
    if (formData.Disciplines?.text) setViewQA(true);
    else showAlert(RecuritmentHRMsg.SelectedErrorMsg, HRMSAlertOptions.Error);
  }, [formData.Disciplines, showAlert]);

  const handleNewQuestion = useCallback(() => {
    if (!formData.Disciplines?.text) {
      showAlert(RecuritmentHRMsg.SelectedErrorMsg, HRMSAlertOptions.Error);
      return;
    }
    setShowCreateQuestionBox((prev) => !prev);
  }, [formData.Disciplines, showAlert]);

  const handleCloseCreateQuestion = useCallback(() => {
    setShowCreateQuestionBox(false);
    setValidationError(DEFAULT_VALIDATION);
    setEditingQuestionIndex(null);
    setFormData((prev) => ({
      ...prev,
      QuestionNumber: { key: 0, text: "" },
      QuestionType: { key: 0, text: "" },
      Question: "",
      ExpectedAnswer: "",
      Disqualification: "",
      CareerportalAnswer: [],
    }));
    setOptionRows([createEmptyOption(0)]);
  }, []);

  const reuseQuestion = useCallback(() => {
    setViewQA(false);
    const selected = questionnaire.filter((item) => item.Checked);
    const lastId = resuequestionnaire.length > 0
      ? Math.max(...resuequestionnaire.map((i) => i.id))
      : 0;

    const adjusted = selected.map((item, idx) => ({
      ...item,
      Type: DataType.Existing,
      id: lastId + idx + 1,
    }));

    const withoutExisting = resuequestionnaire.filter(
      (item) => item.Type !== DataType.Existing,
    );

    const sorted = [...adjusted, ...withoutExisting].sort((a, b) => {
      if (a.Type === DataType.Existing && b.Type !== DataType.Existing) return -1;
      if (a.Type !== DataType.Existing && b.Type === DataType.Existing) return 1;
      return 0;
    });

    setResuequestionnaire(reindexQuestions(sorted));
  }, [questionnaire, resuequestionnaire]);

  // ─── Cancel ───────────────────────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    setAlertProps({
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (ok) => {
        if (ok) navigateAfterAction();
        setAlertPopupOpen(false);
      },
    });
    setAlertPopupOpen(true);
  }, [navigateAfterAction]);

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      // Validate all new questions
      for (const nq of newQuestionnaire) {
        const label = nq.HeaderLabel ?? `Question ${nq.id}`;
        if (!stripHtml(nq.question)) {
          showAlert(`${label}\n\nEnglish question text is missing.`, HRMSAlertOptions.Error);
          return;
        }
        if (!stripHtml(nq.questionFr)) {
          showAlert(`${label}\n\nFrench question text is missing.`, HRMSAlertOptions.Error);
          return;
        }
        if (isInterviewPanelStatus) {
          if (!nq.expectedAnswer?.trim()) {
            showAlert(`${label}\n\nExpected Answer (English) is required.`, HRMSAlertOptions.Error);
            return;
          }
          if (!nq.expectedAnswerFr?.trim()) {
            showAlert(`${label}\n\nExpected Answer (French) is required.`, HRMSAlertOptions.Error);
            return;
          }
        }
      }

      const isCareerPortal = formData.Catogry === CatogryOptionCode.CareerPortalCandidate;
      if (isCareerPortal && resuequestionnaire.length < 5) {
        showAlert(RecuritmentHRMsg.QuestionValiErrorMsg, HRMSAlertOptions.Error);
        return;
      }

      const jobCode = await fetchJobUniqueKey(stateValue?.JobCodeID);
      const category = masterData.category.find((cat) => cat.text === formData.Catogry);
      const payload = buildQuestionsPayload(
        resuequestionnaire,
        category,
        formData.Catogry,
        jobCode,
        CurrentRoleID,
      );

      await submitQuestions(payload);

      // Update SharePoint list
      if (isCareerPortal) {
        await updateWorkflowItem(stateValue?.ID, {
          ActionId: WorkflowAction.Approved,
          ItemCreated: "Yes",
        });
      } else {
        const isHR = CurrentRoleID.includes(RoleID.RecruitmentHR);
        await updateWorkflowItem(stateValue?.ID, {
          [isHR ? "QuestionByHR" : "QuestionByLM"]: "Yes",
        });
      }

      const successMsg = isCareerPortal
        ? RecuritmentHRMsg.CareerportalSuccessMsg
        : RecuritmentHRMsg.InterviewQuestionSuccessMsg;

      showAlert(successMsg, HRMSAlertOptions.Success, navigateAfterAction);
      setFormData((prev) => ({ ...prev, Catogry: "" }));
    } catch {
      showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
    } finally {
      setIsLoading(false);
    }
  }, [
    newQuestionnaire, resuequestionnaire, formData, masterData,
    stateValue, CurrentRoleID, isInterviewPanelStatus,
    navigateAfterAction, showAlert,
  ]);

  return {
    // State
    formData,
    englishQuestion,
    frenchQuestion,
    optionRows,
    validationError,
    questionnaire,
    resuequestionnaire,
    newQuestionnaire,
    existingQuestionnaire,
    isLoading,
    showCreateQuestionBox,
    editingQuestionIndex,
    expandedQuestionIndex,
    expandedExistingQuestion,
    viewQA,
    alertPopupOpen,
    alertProps,
    masterData,
    isDisqualificationStatus,
    isInterviewPanelStatus,

    // Setters
    setEnglishQuestion,
    setFrenchQuestion,
    setExpandedQuestionIndex,
    setExpandedExistingQuestion,
    setAlertPopupOpen,
    setViewQA,

    // Handlers
    handleOptionChange,
    handleAnswerSelections,
    handleAddRow,
    handleDeleteRow,
    handleAutoComplete,
    handleRichTextEditor,
    handleDisqualificationChange,
    handleSaveQuestion,
    handleRemoveQuestionnaire,
    handleQuestionFieldChange,
    handleQuestionOptionChange,
    handleQuestionAddRow,
    handleQuestionDeleteRow,
    handleAnswerSelection,
    handleCommonRadioChange,
    handleCheckbox,
    getFetchQuestion,
    handleNewQuestion,
    handleCloseCreateQuestion,
    reuseQuestion,
    handleCancel,
    handleSubmit,
  };
}