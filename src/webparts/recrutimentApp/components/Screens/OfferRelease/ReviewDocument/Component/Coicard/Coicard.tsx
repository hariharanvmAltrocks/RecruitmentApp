// components/COICard/COICard.tsx
import React, { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  FileText,
  Trash2,
  Upload,
} from "lucide-react";
import "./Coicard.modules.scss";
import { IDocFiles } from "../../../../../../services/SPService/Ispservice";
import * as strings from 'RecrutimentAppWebPartStrings';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface COIState {
  consultedWith: string;
  comments: string;
  attachment: IDocFiles[];
  wishesToProceed: string;
}

export interface COICardProps {
  coiReason?: string;
  consultOptions: { value: string; label: string }[];
  isReadOnly?: boolean;
  hasError?: boolean;
  onChange?: (state: COIState) => void;
}

const MAX_COMMENT_LENGTH = 256;

export const COICard: React.FC<COICardProps> = ({
  consultOptions,
  isReadOnly = false,
  hasError = false,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<COIState>({
    consultedWith: "",
    comments: "",
    attachment: [],
    wishesToProceed: "",
  });

  const update = (patch: Partial<COIState>) => {
    const next = { ...state, ...patch };
    setState(next);
    onChange?.(next);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];

    if (!file) return;

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          resolve(reader.result as string);
        };

        reader.onerror = (error) => reject(error);
      });

    try {
      const base64 = await toBase64(file);

      const docs: IDocFiles[] = [
        {
          name: file.name,
          content: base64, // ✅ FIXED
          type: "New", // ✅ FIXED
        },
      ];

      update({ attachment: docs });
    } catch (error) {
      console.error(strings.FileConversionError, error);
    }

    target.value = "";
  };

  const handleClearFile = () => update({ attachment: [] });

  const proceedError = hasError && !state.wishesToProceed;
  const consultedWithError = hasError && !state.consultedWith;
  const commentsError = hasError && !state.comments.trim();
  const attachmentError = hasError && state.attachment.length === 0;

  return (
    <div className="coi-card">
      <div className="coi-card__titleRow">
        <span className="coi-card__titleBar" />
        <h2 className="coi-card__title">{strings.BackgroundVerification}</h2>
      </div>
      <div className="coi-card__fields">
        <div
          className={`coi-card__field ${consultedWithError ? "coi-card__field--error" : ""}`}
        >
          <label className="coi-card__label">
            {strings.ConsultedWith}<span className="coi-card__required">*</span>
          </label>
          <div className="coi-card__select-wrap">
            <select
              className="coi-card__select"
              value={state.consultedWith}
              onChange={(e) => update({ consultedWith: e.target.value })}
              disabled={isReadOnly}
            >
              <option value="">{strings.Select}</option>
              {consultOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="coi-card__select-chevron" />
          </div>
          {consultedWithError && (
            <span className="coi-card__error-msg">{strings.ThisFieldIsRequired}</span>
          )}
        </div>

        <div
          className={`coi-card__field ${attachmentError ? "coi-card__field--error" : ""}`}
        >
          <label className="coi-card__label">
            {strings.ProofOfDiscussion}<span className="coi-card__required">*</span>
          </label>

          {!isReadOnly ? (
            state.attachment.length === 0 ? (
              <button
                type="button"
                className={`coi-card__upload-btn ${attachmentError ? "coi-card__upload-btn--error" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="coi-card__upload-icon">
                  <Upload size={16} />
                </span>
                <span className="coi-card__upload-text">
                  <span className="coi-card__upload-primary">
                    {strings.ClickToUpload}</span>
                  <span className="coi-card__upload-hint">
                    {strings.PdfDocDocxPngJpg}</span>
                </span>
              </button>
            ) : (
              <div className="coi-card__file-preview">
                <span className="coi-card__file-icon">
                  <FileText size={16} />
                </span>
                <div className="coi-card__file-info">
                  <span className="coi-card__file-name">
                    {state.attachment[0].name}
                  </span>
                  <span className="coi-card__file-ready">
                    <CheckCircle size={11} /> {strings.ReadyToSubmit}</span>
                </div>
                <button
                  type="button"
                  className="coi-card__file-remove"
                  onClick={handleClearFile}
                  aria-label={strings.RemoveFile}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          ) : /* Read-only file display */
          state.attachment.length > 0 ? (
            <div className="coi-card__file-preview coi-card__file-preview--readonly">
              <span className="coi-card__file-icon">
                <FileText size={16} />
              </span>
              <span className="coi-card__file-name">
                {state.attachment[0].name}
              </span>
            </div>
          ) : (
            <span className="coi-card__empty">{strings.NoFileUploaded}</span>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {attachmentError && (
            <span className="coi-card__error-msg">
              {strings.PleaseUploadProofOfDiscussion}</span>
          )}
        </div>
      </div>

      <div
        className={`coi-card__textarea-wrap ${commentsError ? "coi-card__field--error" : ""}`}
      >
        <label className="coi-card__label">
          {strings.ReasonComments}<span className="coi-card__required">*</span>
        </label>
        <div className="coi-card__textarea-relative">
          <textarea
            className={`coi-card__textarea ${commentsError ? "coi-card__textarea--error" : ""}`}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder={strings.EnterYourCommentsMax256Characters}
            value={state.comments}
            onChange={(e) => update({ comments: e.target.value })}
            readOnly={isReadOnly}
          />
          <span className="coi-card__char-count">
            {state.comments.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>
        {commentsError && (
          <span className="coi-card__error-msg">{strings.CommentsAreRequired}</span>
        )}
      </div>

      <div
        className={`coi-card__radio-group ${proceedError ? "coi-card__field--error" : ""}`}
      >
        <label className="coi-card__label">
          {strings.DoYouWishToProceedWithThisAction}{" "}
          <span className="coi-card__required">*</span>
        </label>
        <div className="coi-card__radio-options">
          <label className="coi-card__radio-label">
            <input
              type="radio"
              name="proceedAction"
              value="Yes"
              checked={state.wishesToProceed === "Yes"}
              onChange={() => update({ wishesToProceed: "Yes" })}
              disabled={isReadOnly}
            />
            <span className="coi-card__radio-custom"></span>
            <span className="coi-card__radio-text">{strings.Yes1}</span>
          </label>
          <label className="coi-card__radio-label">
            <input
              type="radio"
              name="proceedAction"
              value="No"
              checked={state.wishesToProceed === "No"}
              onChange={() => update({ wishesToProceed: "No" })}
              disabled={isReadOnly}
            />
            <span className="coi-card__radio-custom"></span>
            <span className="coi-card__radio-text">{strings.No1}</span>
          </label>
        </div>
        {proceedError && (
          <span className="coi-card__error-msg">This field is required.</span>
        )}
      </div>
    </div>
  );
};

export default COICard;
