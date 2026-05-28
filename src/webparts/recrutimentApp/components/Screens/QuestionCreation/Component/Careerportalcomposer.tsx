import React from "react";
import {
  Plus,
  X,
  CheckCircle2,
  Circle,
  Square,
  CheckSquare,
  Globe,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Question } from "../QuestionCreation.types";
import "./Interviewmode.scss";
import "../Questioncreation.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

interface CareerPortalComposerProps {
  newQuestion: Partial<Question>;
  onChange: (q: Partial<Question>) => void;
  onAdd: () => void;
  onClear: () => void;
}

export const CareerPortalComposer: React.FC<CareerPortalComposerProps> = ({
  newQuestion,
  onChange,
  onAdd,
  onClear,
}) => {
  const toggleOptionCorrect = (optionId: string) => {
    if (!newQuestion.options) return;
    const updated = newQuestion.options.map((opt) => {
      if (newQuestion.type === "single") {
        return { ...opt, isCorrect: opt.id === optionId };
      }
      return opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : opt;
    });
    onChange({ ...newQuestion, options: updated });
  };

  const updateOptionText = (
    optionId: string,
    field: "textEn" | "textFr",
    value: string,
  ) => {
    if (!newQuestion.options) return;
    const updated = newQuestion.options.map((opt) =>
      opt.id === optionId ? { ...opt, [field]: value } : opt,
    );
    onChange({ ...newQuestion, options: updated });
  };

  const addOption = () => {
    if (!newQuestion.options) return;
    onChange({
      ...newQuestion,
      options: [
        ...newQuestion.options,
        { id: String(Date.now()), textEn: "", textFr: "", isCorrect: false },
      ],
    });
  };

  const removeOption = (id: string) => {
    if (!newQuestion.options || newQuestion.options.length <= 2) return;
    onChange({
      ...newQuestion,
      options: newQuestion.options.filter((o) => o.id !== id),
    });
  };

  const canAdd =
    !!newQuestion.questionEn &&
    !!newQuestion.questionFr &&
    newQuestion.options?.some((o) => o.isCorrect) &&
    newQuestion.options?.every((o) => o.textEn && o.textFr) &&
    (newQuestion.type === "multiple"
      ? newQuestion.options?.filter((o) => o.isCorrect).length >= 2
      : true);

  return (
    <div className="qc-composer">
      <div className="qc-composer__header">
        <h3 className="qc-composer__title">
          <span className="qc-composer__title-bar" />
          {strings.CreateMinimumCriteria}</h3>
        <div className="qc-composer__type-toggle">
          <button
            className={`qc-composer__type-btn ${newQuestion.type === "single" ? "qc-composer__type-btn--active" : ""}`}
            onClick={() => onChange({ ...newQuestion, type: "single" })}
          >
            {strings.SingleChoice}</button>
          <button
            className={`qc-composer__type-btn ${newQuestion.type === "multiple" ? "qc-composer__type-btn--active" : ""}`}
            onClick={() => onChange({ ...newQuestion, type: "multiple" })}
          >
            {strings.MultipleChoice}</button>
        </div>
      </div>

      <div className="qc-composer__body">
        {/* Question inputs */}
        <div className="qc-composer__questions-grid">
          <div className="qc-composer__field">
            <label className="qc-composer__label qc-composer__label--en">
              <Globe size={11} /> {strings.EnglishQuestion}</label>
            <textarea
              className="qc-composer__textarea"
              placeholder={strings.EnterQuestionInEnglish}
              value={newQuestion.questionEn ?? ""}
              onChange={(e) =>
                onChange({ ...newQuestion, questionEn: e.target.value })
              }
            />
          </div>
          <div className="qc-composer__field">
            <label className="qc-composer__label qc-composer__label--fr">
              <Globe size={11} /> {strings.FrenchQuestion}</label>
            <textarea
              className="qc-composer__textarea qc-composer__textarea--italic"
              placeholder={strings.SaisirLaQuestionEnFranAis}
              value={newQuestion.questionFr ?? ""}
              onChange={(e) =>
                onChange({ ...newQuestion, questionFr: e.target.value })
              }
            />
          </div>
        </div>

        {/* Options */}
        <div className="qc-composer__options-section">
          <div className="qc-composer__options-header">
            <span className="qc-composer__options-label">{strings.AnswerOptions}</span>
            <button className="qc-composer__add-option" onClick={addOption}>
              <Plus size={11} /> {strings.AddOption}</button>
          </div>

          <AnimatePresence>
            {newQuestion.options?.map((opt) => (
              <motion.div
                key={opt.id}
                className="qc-composer__option-row"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className={`qc-composer__option-check ${opt.isCorrect ? "qc-composer__option-check--active" : ""}`}
                  onClick={() => toggleOptionCorrect(opt.id)}
                >
                  {newQuestion.type === "single" ? (
                    opt.isCorrect ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <Circle size={22} />
                    )
                  ) : opt.isCorrect ? (
                    <CheckSquare size={22} />
                  ) : (
                    <Square size={22} />
                  )}
                </button>
                <div className="qc-composer__option-inputs">
                  <input
                    type="text"
                    className="qc-composer__option-input"
                    placeholder={strings.OptionEnglish}
                    value={opt.textEn}
                    onChange={(e) =>
                      updateOptionText(opt.id, "textEn", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="qc-composer__option-input qc-composer__option-input--italic"
                    placeholder={strings.OptionFranAis}
                    value={opt.textFr}
                    onChange={(e) =>
                      updateOptionText(opt.id, "textFr", e.target.value)
                    }
                  />
                </div>
                <button
                  className="qc-composer__option-remove"
                  onClick={() => removeOption(opt.id)}
                  title={strings.RemoveOption}
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="qc-composer__footer">
          <button className="qc-composer__clear-btn" onClick={onClear}>
            {strings.ClearAll1}</button>
          <button
            className={`qc-composer__submit-btn ${!canAdd ? "qc-composer__submit-btn--disabled" : ""}`}
            onClick={onAdd}
            disabled={!canAdd}
          >
            <Plus size={13} /> {strings.AddToCriteriaSet}</button>
        </div>
      </div>
    </div>
  );
};
