import React from "react";
import { Plus, Check, CheckCircle2, MessageSquare } from "lucide-react";
import { Question } from "../QuestionCreation.types";
import "../Questioncreation.scss"
import { AnimatePresence, motion } from "framer-motion";
import "./Interviewmode.scss";
import "../Questioncreation.scss";

interface InterviewQuestionDraft {
  questionEn: string;
  questionFr: string;
  answerEn: string;
  answerFr: string;
}

const QuestionTypeBadge: React.FC<{ type: Question["type"] }> = ({ type }) => (
  <span className={`qc-badge qc-badge--${type}`}>
    {type === "single" ? "Single Choice" : "Multiple Choice"}
  </span>
);

const SkeletonCard: React.FC = () => (
  <div className="qc-bank__skeleton">
    <div className="qc-bank__skeleton-header" />
    <div className="qc-bank__skeleton-line qc-bank__skeleton-line--long" />
    <div className="qc-bank__skeleton-line qc-bank__skeleton-line--short" />
    <div className="qc-bank__skeleton-line qc-bank__skeleton-line--medium" />
  </div>
);

interface QuestionBankCareerPortalProps {
  questionBank: Question[];
  loading: boolean;
  preparedQuestionIds: (string | number)[];
  searchQuery: string;
  onAddFromBank: (question: Question) => void;
}

interface QuestionBankInterviewProps {
  newQuestion: InterviewQuestionDraft;
  setNewQuestion: React.Dispatch<React.SetStateAction<InterviewQuestionDraft>>;
  handleAddNew: () => void;
}

const QuestionBankCareerPortal: React.FC<QuestionBankCareerPortalProps> = ({
  questionBank,
  loading,
  preparedQuestionIds,
  searchQuery,
  onAddFromBank,
}) => {
  const filtered = questionBank.filter(
    (q) =>
      q.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionFr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="qc-bank">
      {/* Header */}
      <div className="qc-bank__header">
        <div className="qc-bank__title-row">
          <h3 className="qc-bank__title">
            <span className="qc-bank__title-bar" />
            Question Bank
          </h3>
          <span className="qc-bank__count">{questionBank.length} Templates</span>
        </div>

        {/* Search */}
        {/* <div className="qc-bank__search-wrap">
          <svg className="qc-bank__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="qc-bank__search"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div> */}
      </div>

      {/* Cards */}
      <div className="qc-bank__list">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length === 0 ? (
          <div className="qc-bank__empty">
            <p className="qc-bank__empty-text">No questions found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((q, i) => {
              const isAdded = preparedQuestionIds.includes(q.id);
              return (
                <motion.div
                  key={q.id}
                  className={`qc-bank__card ${isAdded ? "qc-bank__card--added" : ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: "easeOut" }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                >
                  <div className="qc-bank__card-header">
                    <QuestionTypeBadge type={q.type} />
                    <button
                      className={`qc-bank__add-btn ${isAdded ? "qc-bank__add-btn--added" : ""}`}
                      onClick={() => onAddFromBank(q)}
                      title={isAdded ? "Already added" : "Add to criteria"}
                    >
                      {isAdded ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                    </button>
                  </div>

                  <div className="qc-bank__card-body">
                    <div className="qc-bank__lang-block">
                      <span className="qc-bank__lang-label qc-bank__lang-label--en">English</span>
                      <p className="qc-bank__question-text">{q.questionEn}</p>
                    </div>
                    <div className="qc-bank__divider" />
                    <div className="qc-bank__lang-block">
                      <span className="qc-bank__lang-label qc-bank__lang-label--fr">Français</span>
                      <p className="qc-bank__question-text qc-bank__question-text--italic">{q.questionFr}</p>
                    </div>

                    {/* Options preview */}
                    <div className="qc-bank__options">
                      {q.options.map((opt) => (
                        <span
                          key={opt.id}
                          className={`qc-bank__option ${opt.isCorrect ? "qc-bank__option--correct" : ""}`}
                        >
                          {opt.isCorrect && <Check size={9} />}
                          {opt.textEn}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const QuestionBankInterview: React.FC<QuestionBankInterviewProps> = ({
  newQuestion,
  setNewQuestion,
  handleAddNew,
}) => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-blue-900/5 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-blue-50/30">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <Plus size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Create New Question</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Draft custom bilingual content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNewQuestion({ questionEn: '', questionFr: '', answerEn: '', answerFr: '' })}
            className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all hover:bg-slate-50 rounded-xl"
          >
            Clear All
          </button>
          <button 
            onClick={handleAddNew}
            disabled={!newQuestion.questionEn && !newQuestion.questionFr}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-3 disabled:opacity-50 disabled:grayscale active:scale-95"
          >
            <Plus size={16} />
            Add to Interview Set
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-100">
        {/* English Draft */}
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-[11px] shadow-lg shadow-blue-100">EN</div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">English Version</span>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} className="text-blue-500" />
              Question Prompt
            </label>
            <textarea 
              value={newQuestion.questionEn}
              onChange={(e) => setNewQuestion({...newQuestion, questionEn: e.target.value})}
              placeholder="Enter the question in English..."
              className="w-full p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-medium min-h-[120px] outline-none resize-none shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={12} className="text-blue-500" />
              Expected Answer
            </label>
            <textarea 
              value={newQuestion.answerEn}
              onChange={(e) => setNewQuestion({...newQuestion, answerEn: e.target.value})}
              placeholder="What are the key points for a good answer?"
              className="w-full p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-medium min-h-[120px] outline-none resize-none shadow-inner"
            />
          </div>
        </div>

        {/* French Draft */}
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center font-black text-[11px] shadow-lg shadow-red-100">FR</div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Version Française</span>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} className="text-red-500" />
              Prompt de la Question
            </label>
            <textarea 
              value={newQuestion.questionFr}
              onChange={(e) => setNewQuestion({...newQuestion, questionFr: e.target.value})}
              placeholder="Saisissez la question en français..."
              className="w-full p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-red-500 focus:ring-8 focus:ring-red-500/5 transition-all text-sm font-medium min-h-[120px] outline-none resize-none shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={12} className="text-red-500" />
              Réponse Attendue
            </label>
            <textarea 
              value={newQuestion.answerFr}
              onChange={(e) => setNewQuestion({...newQuestion, answerFr: e.target.value})}
              placeholder="Quels sont les points clés d'une bonne réponse ?"
              className="w-full p-5 rounded-[24px] border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-red-500 focus:ring-8 focus:ring-red-500/5 transition-all text-sm font-medium min-h-[120px] outline-none resize-none shadow-inner"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type QuestionBankProps =
  | ({ isCareerPortal: true } & QuestionBankCareerPortalProps)
  | ({ isCareerPortal: false } & QuestionBankInterviewProps);

export const QuestionBank: React.FC<QuestionBankProps> = (props) => {
  if (props.isCareerPortal) {
    const { isCareerPortal, ...careerProps } = props;
    return <QuestionBankCareerPortal {...careerProps} />;
  }

  const { isCareerPortal, ...interviewProps } = props;
  return <QuestionBankInterview {...interviewProps} />;
};
