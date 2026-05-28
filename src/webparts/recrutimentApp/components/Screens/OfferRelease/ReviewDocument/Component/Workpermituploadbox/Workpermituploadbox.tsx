// Component/WorkPermitUploadBox.tsx
import React from "react";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";
import { IDocFiles } from "../../../../../../services/SPService/Ispservice";
import * as strings from 'RecrutimentAppWebPartStrings';

export interface WorkPermitUploadBoxProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedFile: IDocFiles | null;
  isReading: boolean;
  hasFileError: boolean;
  disabled?: boolean;
  onUploadClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FilePreviewProps {
  file: IDocFiles;
  isReading: boolean;
  disabled: boolean;
  onClear: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  isReading,
  disabled,
  onClear,
}) => (
  <div className="upload-box__file-info">
    <div className="upload-box__file-icon">
      <FileText size={24} />
    </div>

    <div className="upload-box__file-details">
      <span className="upload-box__filename">{file.name}</span>
      <span className="upload-box__filesize">{file.fileSizeMB} {strings.Mb}</span>
    </div>

    <div className="upload-box__status">
      {isReading ? (
        <div className="upload-box__spinner" />
      ) : (
        <CheckCircle2 size={20} className="upload-box__success-icon" />
      )}
    </div>

    <button
      type="button"
      className="upload-box__clear"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    >
      <X size={14} />
    </button>
  </div>
);

const UploadPlaceholder: React.FC = () => (
  <div className="upload-box__placeholder">
    <div className="upload-box__icon-circle">
      <Upload size={20} />
    </div>
    <div className="upload-box__text">
      <span className="upload-box__primary">
        {strings.ClickToUploadWorkPermitAcknowledgement}</span>
      <span className="upload-box__secondary">
        {strings.PdfOrWordDocumentMax5Mb}</span>
    </div>
  </div>
);

export const WorkPermitUploadBox: React.FC<WorkPermitUploadBoxProps> = ({
  fileInputRef,
  selectedFile,
  isReading,
  hasFileError,
  disabled = false,
  onUploadClick,
  onFileChange,
  onClearFile,
}) => {
  const dropzoneClass = [
    "upload-box",
    selectedFile && "upload-box--has-file",
    hasFileError && "upload-box--error",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="upload-workpermit-card">
      {/* Card heading */}
      <div className="upload-workpermit-card__header">
        <div className="upload-workpermit-card__header-icon">
          <FileText size={18} />
        </div>
        <div className="upload-workpermit-card__header-text">
          <p className="upload-workpermit-card__title">
            {strings.WorkPermitAcknowledgement}</p>
          <p className="upload-workpermit-card__subtitle">
            {strings.UploadTheSignedAcknowledgementDocument}</p>
        </div>
      </div>

      {/* Drop zone */}
      <div className={dropzoneClass} onClick={onUploadClick}>
        <input
          ref={fileInputRef}
          type="file"
          className="upload-box__input"
          accept=".pdf,.doc,.docx"
          onChange={onFileChange}
          disabled={disabled || isReading}
        />

        <div className="upload-box__inner">
          {selectedFile ? (
            <FilePreview
              file={selectedFile}
              isReading={isReading}
              disabled={disabled}
              onClear={onClearFile}
            />
          ) : (
            <UploadPlaceholder />
          )}
        </div>
      </div>

      {hasFileError && (
        <span className="upload-box__error-text">
          {strings.PleaseUploadTheWorkPermitAcknowledgement}</span>
      )}
    </div>
  );
};
