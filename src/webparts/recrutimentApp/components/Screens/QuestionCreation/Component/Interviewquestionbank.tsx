import React, { useMemo } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Question } from "../QuestionCreation.types";
import "./Interviewmode.scss";
import "../Questioncreation.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

interface InterviewBankProps {
  questionBank: Question[];
  loading: boolean;
  preparedQuestionIds: (string | number)[];
  onAddFromBank: (q: Question) => void;
}

const SkeletonCard: React.FC = () => (
  <div className="iq-bank__skeleton">
    <div className="iq-bank__skeleton-header" />
    <div className="iq-bank__skeleton-line iq-bank__skeleton-line--long" />
    <div className="iq-bank__skeleton-line iq-bank__skeleton-line--short" />
  </div>
);

export const InterviewQuestionBank: React.FC<InterviewBankProps> = ({
  questionBank,
  loading,
  preparedQuestionIds,
  onAddFromBank,
}) => {
  return (
    <div className="iq-bank">
      <div className="iq-bank__header">
        <div className="iq-bank__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <div>
          <h3 className="iq-bank__title">{strings.QuestionBank}</h3>
          <p className="iq-bank__subtitle">{strings.ReuseStandardQuestions}</p>
        </div>
      </div>

      <div className="iq-bank__list">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : questionBank.length === 0 ? (
          <div className="iq-bank__empty">
            <p className="iq-bank__empty-text">{strings.NoTemplatesAvailable}</p>
          </div>
        ) : (
          <AnimatePresence>
            {questionBank.map((q, i) => {
              const isAdded = preparedQuestionIds.includes(q.id);
              return (
                <motion.div
                  key={q.id}
                  className={`iq-bank__card ${isAdded ? "iq-bank__card--added" : ""}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.28,
                    ease: "easeOut",
                  }}
                  // ✅ FIXED HERE
                  style={{ height: "auto", minHeight: "40%" }}
                >
                  <div className="iq-bank__card-top">
                    <span className="iq-bank__template-label">
                      {i + 1}{strings.NbspNbspStandardTemplate}</span>

                    <button
                      className={`iq-bank__add-btn ${
                        isAdded ? "iq-bank__add-btn--added" : ""
                      }`}
                      onClick={() => !isAdded && onAddFromBank(q)}
                      title={isAdded ? strings.AlreadyAdded : strings.AddToInterviewSet1}
                    >
                      {isAdded ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <Plus size={15} />
                      )}
                    </button>
                  </div>

                  <div className="iq-bank__card-body">
                    <div className="iq-bank__lang-row">
                      <span className="iq-bank__lang-pill iq-bank__lang-pill--en">
                        {strings.En}</span>
                      <p className="iq-bank__question-text">{q.questionEn}</p>
                    </div>

                    <div className="iq-bank__lang-row">
                      <span className="iq-bank__lang-pill iq-bank__lang-pill--fr">
                        {strings.Fr}</span>
                      <p className="iq-bank__question-text iq-bank__question-text--italic">
                        {q.questionFr}
                      </p>
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
