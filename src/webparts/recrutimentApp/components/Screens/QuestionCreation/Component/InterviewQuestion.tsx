import React from "react";
import { Plus, Check, CheckCircle2 } from "lucide-react";
import { Question } from "../QuestionCreation.types";
import "../Questioncreation.scss"
import { AnimatePresence, motion } from "framer-motion";

interface InterviewQuestionProps {
  questionBank: Question[];
  loading: boolean;
  preparedQuestionIds: (string | number)[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddFromBank: (question: Question) => void;
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

export const InterviewQuestion: React.FC<InterviewQuestionProps> = ({
  questionBank,
  loading,
  preparedQuestionIds,
  searchQuery,
  onSearchChange,
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
        <div className="qc-bank__search-wrap">
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
        </div>
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