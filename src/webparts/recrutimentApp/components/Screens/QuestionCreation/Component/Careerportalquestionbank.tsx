import React, { useMemo } from "react";
import { Plus, Check, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Question } from "../QuestionCreation.types";
import "./Interviewmode.scss";
import "../Questioncreation.scss";

interface CareerPortalBankProps {
  questionBank: Question[];
  loading: boolean;
  preparedQuestionIds: (string | number)[];
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onAddFromBank: (q: Question) => void;
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

export const CareerPortalQuestionBank: React.FC<CareerPortalBankProps> = ({
  questionBank,
  loading,
  preparedQuestionIds,
  searchQuery,
  onSearchChange,
  onAddFromBank,
}) => {
  const filtered = useMemo(
    () =>
      questionBank.filter(
        (q) =>
          q.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.questionFr.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [questionBank, searchQuery]
  );

  return (
    <div className="qc-bank">
      <div className="qc-bank__header">
        <div className="qc-bank__title-row">
          <h3 className="qc-bank__title">
            <span className="qc-bank__title-bar" />
            Question Bank
          </h3>
          <span className="qc-bank__count">{questionBank.length} Templates</span>
        </div>
      </div>

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
                      onClick={() => !isAdded && onAddFromBank(q)}
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