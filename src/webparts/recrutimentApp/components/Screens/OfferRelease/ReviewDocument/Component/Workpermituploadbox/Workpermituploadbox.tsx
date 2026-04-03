// Component/WorkPermitUploadBox.tsx
import React from "react";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";

export interface WorkPermitUploadBoxProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedFile: File | null;
  isReading: boolean;
  hasFileError: boolean;
  disabled?: boolean;
  onUploadClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

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
            Work Permit Acknowledgement
          </p>
          <p className="upload-workpermit-card__subtitle">
            Upload the signed acknowledgement document
          </p>
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
          Please upload the Work Permit Acknowledgement document.
        </span>
      )}
    </div>
  );
};


// ─── Sub-components ───────────────────────────────────────────────────────────

interface FilePreviewProps {
  file: File;
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
      <span className="upload-box__filesize">
        {(file.size / 1024).toFixed(1)} KB
      </span>
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
        Click to upload Work Permit Acknowledgement
      </span>
      <span className="upload-box__secondary">
        PDF or Word document · max 5 MB
      </span>
    </div>
  </div>
);