import React from "react";
import { X, Check, CheckCircle2, ClipboardList, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Question } from "../QuestionCreation.types";
import "./Interviewmode.scss";
import "../Questioncreation.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

interface CareerPortalPreparedProps {
  questions: Question[];
  onRemove: (id: string | number) => void;
  onEdit: (id: string | number) => void;
}

export const CareerPortalPreparedSet: React.FC<CareerPortalPreparedProps> = ({
  questions,
  onRemove,
  onEdit,
}) => (
  <div className="qc-prepared">
    <div className="qc-prepared__header">
      <h3 className="qc-prepared__title">
        <span className="qc-prepared__title-bar" />
        {strings.PreparedMinimumCriteria}</h3>
      <span className="qc-prepared__count">{questions.length} {strings.Items}</span>
    </div>

    <div className="qc-prepared__body">
      {questions.length === 0 ? (
        <div className="qc-prepared__empty">
          <div className="qc-prepared__empty-icon">
            <ClipboardList size={30} />
          </div>
          <p className="qc-prepared__empty-title">{strings.NoCriteriaAddedYet}</p>
          <p className="qc-prepared__empty-sub">
            {strings.SelectFromBankOrCreateNew}</p>
        </div>
      ) : (
        <AnimatePresence>
          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              className="qc-prepared__card"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="qc-prepared__meta">
                <span className="qc-prepared__num">{idx + 1}</span>
                {q.fromBank && (
                  <span className="qc-prepared__from-bank" title={strings.FromBank}>
                    <CheckCircle2 size={11} />
                  </span>
                )}
              </div>

              <div className="qc-prepared__content">
                <div className="qc-prepared__lang-header">
                  <span className="qc-prepared__lang-tag qc-prepared__lang-tag--en">
                    {strings.English}</span>
                  <span
                    className={`qc-prepared__type-tag qc-prepared__type-tag--${q.type}`}
                  >
                    {q.type === "single" ? "Single" : "Multiple"}
                  </span>
                </div>
                <p className="qc-prepared__question">{q.questionEn}</p>

                <div className="qc-prepared__sep" />

                <span className="qc-prepared__lang-tag qc-prepared__lang-tag--fr">
                  {strings.FranAis}</span>
                <p className="qc-prepared__question qc-prepared__question--italic">
                  {q.questionFr}
                </p>

                <div className="qc-prepared__options">
                  {q.options.map((opt) => (
                    <span
                      key={opt.id}
                      className={`qc-prepared__option ${opt.isCorrect ? "qc-prepared__option--correct" : ""}`}
                    >
                      {opt.isCorrect && <Check size={9} />}
                      {opt.textEn} / {opt.textFr}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="qc-prepared__remove"
                onClick={() => onEdit(q.id)}
                title={strings.Edit}
              >
                <Pencil size={16} />
              </button>

              <button
                className="qc-prepared__remove"
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
