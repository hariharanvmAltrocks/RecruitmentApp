import React, { useState } from "react";
import { ChevronLeft, Globe, Users, Save } from "lucide-react";
import "./Questioncreation.scss";
import { Job, Question } from "./QuestionCreation.types";
import { useFetchQuestionBank } from "./Hooks/fetchQuestionbank";
import { motion } from "framer-motion";
import { InterviewQuestion } from "./Component/InterviewQuestion";
import { CreateMinimumCriteriaQuestion, PreparedCriteriaSet } from "./Component/skeleton/CreateMinimumCriteriaQuestion";
import { SuccessToast } from "../../Comman/Toast/SuccessToast";
import { useToast } from "../../Hooks/useToast";
import { useNavigate } from "react-router-dom";

interface QuestionCreationProps {
  job: Job;
  onBack: () => void;
  onSave?: (questions: Question[]) => void;
}

const DEFAULT_NEW_QUESTION = (): Partial<Question> => ({
  type: "single",
  questionEn: "",
  questionFr: "",
  options: [
    { id: "1", textEn: "", textFr: "", isCorrect: false },
    { id: "2", textEn: "", textFr: "", isCorrect: false },
  ],
});

const QuestionCreation: React.FC = () => {
  const { questionBank, loading } = useFetchQuestionBank();
   const { toast, closeToast, showSuccess,showError,showWarning, showConfirm} = useToast();
     const navigate = useNavigate();

  const [preparedQuestions, setPreparedQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>(DEFAULT_NEW_QUESTION());
  const [searchQuery, setSearchQuery] = useState("");


  const handleAddFromBank = (q: Question) => {
    const alreadyAdded = preparedQuestions.some(
      (pq) => pq.id === q.id && pq.fromBank
    );
    if (!alreadyAdded) {
      setPreparedQuestions((prev) => [...prev, { ...q, fromBank: true }]);
    }
  };

  const handleAddNew = () => {
    const hasQuestion = newQuestion.questionEn || newQuestion.questionFr;
    const hasCorrect = newQuestion.options?.some((o) => o.isCorrect);
    if (!hasQuestion || !hasCorrect) return;

    const question: Question = {
      id: Date.now(),
      type: newQuestion.type ?? "single",
      questionEn: newQuestion.questionEn ?? "",
      questionFr: newQuestion.questionFr ?? "",
      options: newQuestion.options ?? [],
      fromBank: false,
    };
    setPreparedQuestions((prev) => [...prev, question]);
    setNewQuestion(DEFAULT_NEW_QUESTION());
  };

  const handleRemovePrepared = (id: string | number) => {
    setPreparedQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const onBack = () => {
 navigate("/RecruitmentTable");
  }

  const handleSave = () => {
    // (preparedQuestions)
    showSuccess("Question Creation Successfully")
    navigate("/RecruitmentTable");
  };

  const preparedIds = preparedQuestions.filter((q) => q.fromBank).map((q) => q.id);

  const job = {
    jobCode: "SOQ001",
    jobTitle: "Senior Executive",
    buCode: "110011010101",
    nationality: "Expatriate"
  }

  return (
    <motion.div
      className="qc"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
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
            <span className="qc__criteria-label">Prepared Criteria</span>
            <span className="qc__criteria-value">
              {preparedQuestions.length}
              <span className="qc__criteria-unit"> Questions</span>
            </span>
          </div>
          <button className="qc__save-btn" onClick={handleSave}>
            <Save size={15} />
            Finalize &amp; Save
          </button>
        </div>
      </div>

      <div className="qc__grid">
        <div className="qc__col qc__col--left">
          <InterviewQuestion
            questionBank={questionBank}
            loading={loading}
            preparedQuestionIds={preparedIds}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddFromBank={handleAddFromBank}
          />
        </div>

        <div className="qc__col qc__col--right">
          <CreateMinimumCriteriaQuestion
            newQuestion={newQuestion}
            onChange={setNewQuestion}
            onAdd={handleAddNew}
            onClear={() => setNewQuestion(DEFAULT_NEW_QUESTION())}
          />

          <PreparedCriteriaSet
            questions={preparedQuestions}
            onRemove={handleRemovePrepared}
          />
        </div>
      </div>
      {toast.open && (
        <SuccessToast
          show={toast.open}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          autoDismiss={toast.autoDismiss}
          autoDismissDuration={toast.autoDismissDuration}
          onClose={closeToast}
          // onAction={toast.buttonAction}
        />
      )}
    </motion.div>
    
  );
};

export default QuestionCreation;