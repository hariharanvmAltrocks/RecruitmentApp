import React, { useState } from "react";
import { ChevronLeft, Globe, Users, Save } from "lucide-react";
import "./Questioncreation.scss";
import { Question, QuestionMode } from "./QuestionCreation.types";
import { useFetchQuestionBank } from "./Hooks/fetchQuestionbank";
import { motion } from "framer-motion";
import { SuccessToast } from "../../Comman/Toast/SuccessToast";
import { useToast } from "../../Hooks/useToast";
import { useNavigate } from "react-router-dom";
import { usePositionDetails } from "../RecruitmentTable/AdvertReviewDrawer/Hooks/getPositionDetails";
import { StatusId } from "../../../utilities/Config";
import { useSaveQuestions } from "./Hooks/useSaveQuestions";
import { CareerPortalQuestionBank } from "./Component/Careerportalquestionbank";
import { CareerPortalComposer } from "./Component/Careerportalcomposer";
import { CareerPortalPreparedSet } from "./Component/Careerportalpreparedset";
import { InterviewComposer } from "./Component/Interviewcomposer";
import { InterviewPreparedSet } from "./Component/Interviewpreparedset";
import { InterviewQuestionBank } from "./Component/Interviewquestionbank";
import { ModalPopup } from "../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../Comman/ModalPopup/useModalPopup";
import { RecuritmentHRMsg } from "../../../utilities/ConditionConfig";
import Loading from "../../Comman/Loading/loading";

const DEFAULT_NEW_QUESTION = (): Partial<Question> => ({
  type: "single",
  questionEn: "",
  questionFr: "",
  answerEn: "",
  answerFr: "",
  options: [
    { id: "1", textEn: "", textFr: "", isCorrect: false },
    { id: "2", textEn: "", textFr: "", isCorrect: false },
  ],
});

const QuestionCreation: React.FC = (props: any) => {
  const { data: positionDetails, loading: positionLoading } =
    usePositionDetails(props.ID, "");

  const deptCode = positionDetails?.DeptCode;
  const statusId = positionDetails?.StatusId;
  const shouldFetch = !!deptCode && !!statusId;

  const mode: QuestionMode =
    statusId === StatusId.CareerPortalQuestions ? "careerPortal" : "interview";

  const { questionBank, loading: questionloading } = useFetchQuestionBank(
    shouldFetch ? deptCode : "",
    shouldFetch ? statusId : 0,
    !positionLoading,
  );

  const { modalState, showModal, closeModal } = useModalPopup();
  const navigate = useNavigate();
  const { saving, save } = useSaveQuestions();

  const [preparedQuestions, setPreparedQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>(
    DEFAULT_NEW_QUESTION(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddFromBank = (q: Question) => {
    const alreadyAdded = preparedQuestions.some(
      (pq) => pq.id === q.id && pq.fromBank,
    );
    if (!alreadyAdded) {
      setPreparedQuestions((prev) => [...prev, { ...q, fromBank: true }]);
    }
  };

  const handleAddNew = () => {
    const hasQuestion = newQuestion.questionEn || newQuestion.questionFr;

    if (mode === "careerPortal") {
      const hasCorrect = newQuestion.options?.some((o) => o.isCorrect);
      if (!hasQuestion || !hasCorrect) return;
    } else {
      if (!hasQuestion) return;
    }

    const question: Question = {
      id: Date.now(),
      type: mode === "interview" ? "interview" : (newQuestion.type ?? "single"),
      questionEn: newQuestion.questionEn ?? "",
      questionFr: newQuestion.questionFr ?? "",
      answerEn: newQuestion.answerEn ?? "",
      answerFr: newQuestion.answerFr ?? "",
      options: newQuestion.options ?? [],
      fromBank: false,
    };

    setPreparedQuestions((prev) => [...prev, question]);
    setNewQuestion(DEFAULT_NEW_QUESTION());
  };

  const handleRemovePrepared = (id: string | number) => {
    setPreparedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEditPrepared = (id: string | number) => {
    setNewQuestion(
      preparedQuestions.find((q) => q.id === id) || DEFAULT_NEW_QUESTION(),
    );
    setPreparedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSave = async () => {
    const minQuestions = 5;
    const remaining = minQuestions - preparedQuestions.length;

    if (mode === "careerPortal" && preparedQuestions.length < minQuestions) {
      showModal({
        type: "error",
        title: "Minimum Requirement",
        message: `Please add at least ${minQuestions} questions. You need ${remaining} more.`,
        confirmLabel: "Ok",
        onConfirm: closeModal,
      });
      return;
    } else if (mode === "interview" && preparedQuestions.length < 1) {
      showModal({
        type: "error",
        title: "Minimum Requirement",
        message: `Please add at least ${1} questions.`,
        confirmLabel: "Ok",
        onConfirm: closeModal,
      });
      return;
    }
    setLoading(true);
    const success = await save({
      positionId: props.ID,
      mode,
      questions: preparedQuestions,
      JobCodeId: positionDetails?.JobCodeId,
      DptCode: positionDetails?.DeptCode,
    });

    if (success) {
      setLoading(false);
      showModal({
        type: "success",
        title: "Submitted Successfully",
        message:
          mode === "careerPortal"
            ? RecuritmentHRMsg.CareerportalSuccessMsg
            : RecuritmentHRMsg.InterviewQuestionSuccessMsg,
        confirmLabel: "OK",
        onConfirm: () => {
          closeModal();
          navigate("/RecruitmentTable");
        },
      });
    } else {
      showModal({
        type: "error",
        title: "Error",
        message: "Failed to save questions. Please try again.",
        confirmLabel: "Ok",
        onConfirm: () => {
          closeModal();
        },
      });
    }
  };

  const onBack = () => navigate("/RecruitmentTable");

  const preparedIds = preparedQuestions
    .filter((q) => q.fromBank)
    .map((q) => q.id);

  const job = {
    jobCode: positionDetails?.JobCode,
    jobTitle: positionDetails?.JobTitleEnglish,
    buCode: positionDetails?.BusinessUnitCode,
    nationality: positionDetails?.Nationality,
  };

  return (
    <>
      {loading && <Loading />}
      <motion.div
        className="qc"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* ── Header ── */}
        <div className="qc__header">
          <div className="qc__header-left">
            <button className="qc__back-btn" onClick={onBack} title="Go back">
              <ChevronLeft size={20} />
            </button>
            <div className="qc__job-info">
              <div className="qc__job-top">
                <span className="qc__job-code">{job.jobCode}</span>
                <h2 className="qc__job-title">{job.jobTitle}</h2>
              </div>
              <div className="qc__job-meta">
                <span className="qc__job-meta-item">
                  <Globe size={10} /> {job.buCode ?? "N/A"}
                </span>
                <span className="qc__job-meta-dot" />
                <span className="qc__job-meta-item">
                  <Users size={10} /> {job.nationality ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="qc__header-right">
            <div className="qc__criteria-count">
              <span className="qc__criteria-label">
                {mode === "careerPortal"
                  ? "Prepared Criteria"
                  : "Interview Set"}
              </span>
              <span className="qc__criteria-value">
                {preparedQuestions.length}
                <span className="qc__criteria-unit"> Questions</span>
              </span>
            </div>
            <button
              className="qc__save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={15} />
              {saving ? "Saving..." : "Finalize & Save"}
            </button>
          </div>
        </div>

        <div className="qc__grid">
          {mode === "careerPortal" ? (
            <>
              <div className="qc__col qc__col--left">
                <CareerPortalQuestionBank
                  questionBank={questionBank}
                  loading={questionloading}
                  preparedQuestionIds={preparedIds}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onAddFromBank={handleAddFromBank}
                />
              </div>

              <div className="qc__col qc__col--right">
                <CareerPortalComposer
                  newQuestion={newQuestion}
                  onChange={setNewQuestion}
                  onAdd={handleAddNew}
                  onClear={() => setNewQuestion(DEFAULT_NEW_QUESTION())}
                />
                <CareerPortalPreparedSet
                  questions={preparedQuestions}
                  onRemove={handleRemovePrepared}
                  onEdit={handleEditPrepared}
                />
              </div>
            </>
          ) : (
            <>
              <div className="qc__col qc__col--left">
                <InterviewQuestionBank
                  questionBank={questionBank}
                  loading={questionloading}
                  preparedQuestionIds={preparedIds}
                  onAddFromBank={handleAddFromBank}
                />
              </div>

              <div className="qc__col qc__col--right">
                <InterviewComposer
                  newQuestion={newQuestion}
                  onChange={setNewQuestion}
                  onAdd={handleAddNew}
                  onClear={() => setNewQuestion(DEFAULT_NEW_QUESTION())}
                />
                <InterviewPreparedSet
                  questions={preparedQuestions}
                  onRemove={handleRemovePrepared}
                  onEdit={handleEditPrepared}
                />
              </div>
            </>
          )}
        </div>
      </motion.div>
      <ModalPopup {...modalState} onClose={closeModal} />
    </>
  );
};

export default QuestionCreation;
