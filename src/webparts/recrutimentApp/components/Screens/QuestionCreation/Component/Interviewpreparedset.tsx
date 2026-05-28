import React from "react";
import { X, ClipboardList, Plus, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Question } from "../QuestionCreation.types";
import "./Interviewmode.scss";
import "../Questioncreation.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

interface InterviewPreparedProps {
  questions: Question[];
  onRemove: (id: string | number) => void;
  onEdit: (id: string | number) => void;
}

export const InterviewPreparedSet: React.FC<InterviewPreparedProps> = ({
  questions,
  onRemove,
  onEdit,
}) => (
  <div className="iq-prepared">
    <div className="iq-prepared__header">
      <div className="iq-prepared__header-left">
        <div className="iq-prepared__icon">
          <ClipboardList size={26} />
        </div>
        <div>
          <h3 className="iq-prepared__title">{strings.PreparedInterviewSet}</h3>
          <p className="iq-prepared__subtitle">
            {strings.ReviewAndOrganizeYourSelectedQuestions}</p>
        </div>
      </div>
      <div className="iq-prepared__count-badge">
        <span className="iq-prepared__count-dot" />
        {questions.length} {strings.QuestionsSelected}</div>
    </div>

    <div className="iq-prepared__body">
      {questions.length === 0 ? (
        <div className="iq-prepared__empty">
          <div className="iq-prepared__empty-icon">
            <Plus size={36} />
          </div>
          <p className="iq-prepared__empty-title">
            {strings.NoQuestionsAddedToTheSetYet}</p>
          <p className="iq-prepared__empty-sub">
            {strings.AddFromTheLibraryOrCreateACustomOneAbove}</p>
        </div>
      ) : (
        <AnimatePresence>
          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              layout
              className="iq-prepared__card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 50 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="iq-prepared__card-inner">
                <div className="iq-prepared__card-meta">
                  <span className="iq-prepared__num">{idx + 1}</span>
                  <span
                    className={`iq-prepared__source-badge ${q.fromBank ? "iq-prepared__source-badge--library" : "iq-prepared__source-badge--custom"}`}
                  >
                    {q.fromBank ? strings.LibraryAsset : strings.CustomDraft}
                  </span>
                </div>

                <div className="iq-prepared__card-content">
                  {/* English */}
                  <div className="iq-prepared__lang-block">
                    <div className="iq-prepared__lang-indicator">
                      <span className="iq-prepared__lang-dot iq-prepared__lang-dot--en" />
                      <span className="iq-prepared__lang-label">
                        {strings.EnglishVersion}</span>
                    </div>
                    <p className="iq-prepared__question-text">{q.questionEn}</p>
                    {q.answerEn && (
                      <div className="iq-prepared__answer-block">
                        <span className="iq-prepared__answer-label iq-prepared__answer-label--en">
                          {strings.ExpectedAnswer}</span>
                        <p className="iq-prepared__answer-text">{q.answerEn}</p>
                      </div>
                    )}
                  </div>

                  {/* French */}
                  <div className="iq-prepared__lang-block">
                    <div className="iq-prepared__lang-indicator">
                      <span className="iq-prepared__lang-dot iq-prepared__lang-dot--fr" />
                      <span className="iq-prepared__lang-label">
                        {strings.VersionFranAise}</span>
                    </div>
                    <p className="iq-prepared__question-text iq-prepared__question-text--italic">
                      {q.questionFr}
                    </p>
                    {q.answerFr && (
                      <div className="iq-prepared__answer-block">
                        <span className="iq-prepared__answer-label iq-prepared__answer-label--fr">
                          {strings.RPonseAttendue}</span>
                        <p className="iq-prepared__answer-text iq-prepared__answer-text--italic">
                          {q.answerFr}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                 className="iq-prepared__remove"
                onClick={() => onEdit(q.id)}
                title={strings.Edit}
              >
                <Pencil size={16} />
              </button>

              <button
                className="iq-prepared__remove"
                onClick={() => onRemove(q.id)}
                title={strings.Remove}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  </div>
);
