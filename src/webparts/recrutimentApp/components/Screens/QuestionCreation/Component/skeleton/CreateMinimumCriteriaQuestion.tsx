import React from "react";
import {
  Plus, X, Check, CheckCircle2,
  Circle, Square, CheckSquare, ClipboardList, Globe,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Question } from "../../QuestionCreation.types";
import "../../Questioncreation.scss"


interface CreatePanelProps {
  newQuestion: Partial<Question>;
  onChange: (q: Partial<Question>) => void;
  onAdd: () => void;
  onClear: () => void;
  isCareerPortal: boolean;
}

export const CreateMinimumCriteriaQuestion: React.FC<CreatePanelProps> = ({
  newQuestion,
  onChange,
  onAdd,
  onClear,
  isCareerPortal
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
    value: string
  ) => {
    if (!newQuestion.options) return;
    const updated = newQuestion.options.map((opt) =>
      opt.id === optionId ? { ...opt, [field]: value } : opt
    );
    onChange({ ...newQuestion, options: updated });
  };

  const addOption = () => {
    if (!newQuestion.options) return;
    const newId = String(Date.now());
    onChange({
      ...newQuestion,
      options: [
        ...newQuestion.options,
        { id: newId, textEn: "", textFr: "", isCorrect: false },
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
    (!!newQuestion.questionEn || !!newQuestion.questionFr) &&
    newQuestion.options?.some((o) => o.isCorrect);

  return (
    <div className="qc-composer">
      <div className="qc-composer__header">
        <h3 className="qc-composer__title">
          <span className="qc-composer__title-bar" />
          {isCareerPortal ? "Create Minimum Criteria" : "Create Interview Question"}
        </h3>
        {isCareerPortal && (
          <>
           <div className="qc-composer__type-toggle">
          <button
            className={`qc-composer__type-btn ${newQuestion.type === "single" ? "qc-composer__type-btn--active" : ""}`}
            onClick={() => onChange({ ...newQuestion, type: "single" })}
          >
            Single Choice
          </button>
          <button
            className={`qc-composer__type-btn ${newQuestion.type === "multiple" ? "qc-composer__type-btn--active" : ""}`}
            onClick={() => onChange({ ...newQuestion, type: "multiple" })}
          >
            Multiple Choice
          </button>
        </div>
          </>
        )}
       
      </div>

      <div className="qc-composer__body">
        <div className="qc-composer__questions-grid">
          <div className="qc-composer__field">
            <label className="qc-composer__label qc-composer__label--en">
              <Globe size={11} /> English Question
            </label>
            <textarea
              className="qc-composer__textarea"
              placeholder="Enter question in English..."
              value={newQuestion.questionEn ?? ""}
              onChange={(e) => onChange({ ...newQuestion, questionEn: e.target.value })}
            />
          </div>
          <div className="qc-composer__field">
            <label className="qc-composer__label qc-composer__label--fr">
              <Globe size={11} /> French Question
            </label>
            <textarea
              className="qc-composer__textarea qc-composer__textarea--italic"
              placeholder="Saisir la question en français..."
              value={newQuestion.questionFr ?? ""}
              onChange={(e) => onChange({ ...newQuestion, questionFr: e.target.value })}
            />
          </div>
        </div>

{isCareerPortal ? (
  <>
   <div className="qc-composer__options-section">
          <div className="qc-composer__options-header">
            <span className="qc-composer__options-label">Answer Options</span>
            <button className="qc-composer__add-option" onClick={addOption}>
              <Plus size={11} /> Add Option
            </button>
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
                    opt.isCorrect ? <CheckCircle2 size={22} /> : <Circle size={22} />
                  ) : (
                    opt.isCorrect ? <CheckSquare size={22} /> : <Square size={22} />
                  )}
                </button>

                <div className="qc-composer__option-inputs">
                  <input
                    type="text"
                    className="qc-composer__option-input"
                    placeholder="Option (English)"
                    value={opt.textEn}
                    onChange={(e) => updateOptionText(opt.id, "textEn", e.target.value)}
                  />
                  <input
                    type="text"
                    className="qc-composer__option-input qc-composer__option-input--italic"
                    placeholder="Option (Français)"
                    value={opt.textFr}
                    onChange={(e) => updateOptionText(opt.id, "textFr", e.target.value)}
                  />
                </div>

                <button
                  className="qc-composer__option-remove"
                  onClick={() => removeOption(opt.id)}
                  title="Remove option"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="qc-composer__footer">
          <button className="qc-composer__clear-btn" onClick={onClear}>
            Clear All
          </button>
          <button
            className={`qc-composer__submit-btn ${!canAdd ? "qc-composer__submit-btn--disabled" : ""}`}
            onClick={onAdd}
            disabled={!canAdd}
          >
            <Plus size={13} /> Add to Criteria Set
          </button>
        </div>
  </>
): (
  <>
   <div className="qc-composer__questions-grid">
          <div className="qc-composer__field">
            <label className="qc-composer__label qc-composer__label--en">
              <Globe size={11} /> English Answer
            </label>
            <textarea
              className="qc-composer__textarea"
              placeholder="Enter question in English..."
              value={newQuestion.interviewQu ?? ""}
              onChange={(e) => onChange({ ...newQuestion, interviewQu: e.target.value })}
            />
          </div>
          <div className="qc-composer__field">
            <label className="qc-composer__label qc-composer__label--fr">
              <Globe size={11} /> French Answer
            </label>
            <textarea
              className="qc-composer__textarea qc-composer__textarea--italic"
              placeholder="Saisir la question en français..."
              value={newQuestion.interviewFr ?? ""}
              onChange={(e) => onChange({ ...newQuestion, interviewFr: e.target.value })}
            />
          </div>
        </div>
  </>
)}
       
      </div>
    </div>
  );
};

// ─── Prepared set panel ───────────────────────────────────────────────────────

interface PreparedSetProps {
  questions: Question[];
  onRemove: (id: string | number) => void;
}

export const PreparedCriteriaSet: React.FC<PreparedSetProps> = ({
  questions,
  onRemove,
}) => (
  <div className="qc-prepared">
    <div className="qc-prepared__header">
      <h3 className="qc-prepared__title">
        <span className="qc-prepared__title-bar" />
        Prepared Minimum Criteria
      </h3>
      <span className="qc-prepared__count">{questions.length} Items</span>
    </div>

    <div className="qc-prepared__body">
      {questions.length === 0 ? (
        <div className="qc-prepared__empty">
          <div className="qc-prepared__empty-icon">
            <ClipboardList size={30} />
          </div>
          <p className="qc-prepared__empty-title">No criteria added yet</p>
          <p className="qc-prepared__empty-sub">Select from bank or create new</p>
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
              {/* Number + source badge */}
              <div className="qc-prepared__meta">
                <span className="qc-prepared__num">{idx + 1}</span>
                {q.fromBank && (
                  <span className="qc-prepared__from-bank" title="From Bank">
                    <CheckCircle2 size={11} />
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="qc-prepared__content">
                <div className="qc-prepared__lang-header">
                  <span className="qc-prepared__lang-tag qc-prepared__lang-tag--en">English</span>
                  <span className={`qc-prepared__type-tag qc-prepared__type-tag--${q.type}`}>
                    {q.type === "single" ? "Single" : "Multiple"}
                  </span>
                </div>
                <p className="qc-prepared__question">{q.questionEn}</p>

                <div className="qc-prepared__sep" />

                <span className="qc-prepared__lang-tag qc-prepared__lang-tag--fr">Français</span>
                <p className="qc-prepared__question qc-prepared__question--italic">{q.questionFr}</p>

                {/* Options */}
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

              {/* Remove */}
              <button
                className="qc-prepared__remove"
                onClick={() => onRemove(q.id)}
                title="Remove"
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
