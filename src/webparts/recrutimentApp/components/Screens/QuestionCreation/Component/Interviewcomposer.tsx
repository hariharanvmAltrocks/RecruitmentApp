import React from "react";
import { Plus, Globe, CheckCircle2, MessageSquare } from "lucide-react";
import { Question } from "../QuestionCreation.types";
import "./Interviewmode.scss";
import "../Questioncreation.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

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
            <h3 className="iq-composer__title">{strings.CreateNewQuestion}</h3>
            <p className="iq-composer__subtitle">
              {strings.DraftCustomBilingualContent}</p>
          </div>
        </div>
        <div className="iq-composer__header-actions">
          <button className="iq-composer__clear-btn" onClick={onClear}>
            {strings.ClearAll1}</button>
          <button
            className={`iq-composer__add-btn ${!canAdd ? "iq-composer__add-btn--disabled" : ""}`}
            onClick={onAdd}
            disabled={!canAdd}
          >
            <Plus size={15} />
            {strings.AddToInterviewSet}</button>
        </div>
      </div>

      {/* Body - two columns EN / FR */}
      <div className="iq-composer__body">
        {/* English */}
        <div className="iq-composer__col">
          <div className="iq-composer__lang-header">
            <span className="iq-composer__lang-badge iq-composer__lang-badge--en">
              {strings.En}</span>
            <span className="iq-composer__lang-title">{strings.EnglishVersion}</span>
          </div>

          <div className="iq-composer__field">
            <label className="iq-composer__label iq-composer__label--en">
              <MessageSquare size={11} /> {strings.QuestionPrompt}</label>
            <textarea
              className="iq-composer__textarea"
              placeholder={strings.EnterTheQuestionInEnglish}
              value={newQuestion.questionEn ?? ""}
              onChange={(e) =>
                onChange({ ...newQuestion, questionEn: e.target.value })
              }
            />
          </div>

          <div className="iq-composer__field">
            <label className="iq-composer__label iq-composer__label--en">
              <CheckCircle2 size={11} /> {strings.ExpectedAnswer}</label>
            <textarea
              className="iq-composer__textarea"
              placeholder={strings.WhatAreTheKeyPointsForAGoodAnswer}
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
              {strings.Fr}</span>
            <span className="iq-composer__lang-title">{strings.VersionFranAise}</span>
          </div>

          <div className="iq-composer__field">
            <label className="iq-composer__label iq-composer__label--fr">
              <MessageSquare size={11} /> {strings.PromptDeLaQuestion}</label>
            <textarea
              className="iq-composer__textarea iq-composer__textarea--italic"
              placeholder={strings.SaisissezLaQuestionEnFranAis}
              value={newQuestion.questionFr ?? ""}
              onChange={(e) =>
                onChange({ ...newQuestion, questionFr: e.target.value })
              }
            />
          </div>

          <div className="iq-composer__field">
            <label className="iq-composer__label iq-composer__label--fr">
              <CheckCircle2 size={11} /> {strings.RPonseAttendue}</label>
            <textarea
              className="iq-composer__textarea iq-composer__textarea--italic"
              placeholder={strings.QuelsSontLesPointsClSDUneBonneRPonse}
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
