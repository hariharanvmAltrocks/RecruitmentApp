import React from "react";
import { Plus, Globe, CheckCircle2, MessageSquare } from "lucide-react";
import { Question } from "../QuestionCreation.types";
import "./Interviewmode.scss";
import "../Questioncreation.scss";

interface InterviewComposerProps {
  newQuestion: Partial<Question>;
  onChange: (q: Partial<Question>) => void;
  onAdd: () => void;
  onClear: () => void;
}

export const InterviewComposer: React.FC<InterviewComposerProps> = ({
  newQuestion,
  onChange,
  onAdd,
  onClear,
}) => {
  const canAdd =
    !!(newQuestion.questionEn && newQuestion.questionFr) &&
    newQuestion.answerEn &&
    newQuestion.answerFr;

  return (
    <div className="iq-composer">
      {/* Header */}
      <div className="iq-composer__header">
        <div className="iq-composer__header-left">
          <div className="iq-composer__icon">
            <Plus size={22} />
          </div>
          <div>
            <h3 className="iq-composer__title">Create New Question</h3>
            <p className="iq-composer__subtitle">
              Draft custom bilingual content
            </p>
          </div>
        </div>
        <div className="iq-composer__header-actions">
          <button className="iq-composer__clear-btn" onClick={onClear}>
            Clear All
          </button>
          <button
            className={`iq-composer__add-btn ${!canAdd ? "iq-composer__add-btn--disabled" : ""}`}
            onClick={onAdd}
            disabled={!canAdd}
          >
            <Plus size={15} />
            Add to Interview Set
          </button>
        </div>
      </div>

      {/* Body - two columns EN / FR */}
      <div className="iq-composer__body">
        {/* English */}
        <div className="iq-composer__col">
          <div className="iq-composer__lang-header">
            <span className="iq-composer__lang-badge iq-composer__lang-badge--en">
              EN
            </span>
            <span className="iq-composer__lang-title">English Version</span>
          </div>

          <div className="iq-composer__field">
            <label className="iq-composer__label iq-composer__label--en">
              <MessageSquare size={11} /> Question Prompt
            </label>
            <textarea
              className="iq-composer__textarea"
              placeholder="Enter the question in English..."
              value={newQuestion.questionEn ?? ""}
              onChange={(e) =>
                onChange({ ...newQuestion, questionEn: e.target.value })
              }
            />
          </div>

          <div className="iq-composer__field">
            <label className="iq-composer__label iq-composer__label--en">
              <CheckCircle2 size={11} /> Expected Answer
            </label>
            <textarea
              className="iq-composer__textarea"
              placeholder="What are the key points for a good answer?"
              value={newQuestion.answerEn ?? ""}
              onChange={(e) =>
                onChange({ ...newQuestion, answerEn: e.target.value })
              }
            />
          </div>
        </div>

        {/* French */}
        <div className="iq-composer__col iq-composer__col--fr">
          <div className="iq-composer__lang-header">
            <span className="iq-composer__lang-badge iq-composer__lang-badge--fr">
              FR
            </span>
            <span className="iq-composer__lang-title">Version Française</span>
          </div>

          <div className="iq-composer__field">
            <label className="iq-composer__label iq-composer__label--fr">
              <MessageSquare size={11} /> Prompt de la Question
            </label>
            <textarea
              className="iq-composer__textarea iq-composer__textarea--italic"
              placeholder="Saisissez la question en français..."
              value={newQuestion.questionFr ?? ""}
              onChange={(e) =>
                onChange({ ...newQuestion, questionFr: e.target.value })
              }
            />
          </div>

          <div className="iq-composer__field">
            <label className="iq-composer__label iq-composer__label--fr">
              <CheckCircle2 size={11} /> Réponse Attendue
            </label>
            <textarea
              className="iq-composer__textarea iq-composer__textarea--italic"
              placeholder="Quels sont les points clés d'une bonne réponse ?"
              value={newQuestion.answerFr ?? ""}
              onChange={(e) =>
                onChange({ ...newQuestion, answerFr: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
