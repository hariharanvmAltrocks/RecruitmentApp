import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {  FileText, FileUpIcon, X } from "lucide-react";
import "./UploadDocument.scss";

export interface UploadedFile {
  name: string;
  file: File;
  fileContent: ArrayBuffer;
  previewUrl: string;
}

export interface UploadDocumentProps {
  multiple?: boolean;
  acceptedFormats?: string;
  maxFileSizeMB?: number;
  label?: string;
  required?: boolean;
  onChange?: (files: UploadedFile[]) => void;
}

const DEFAULT_ACCEPTED = ".pdf,.doc,.docx,.xls,.xlsx";
const DEFAULT_MAX_MB = 15;

const parseAcceptedFormats = (acceptedFormats: string) =>
  acceptedFormats
    .split(",")
    .map((format) => format.trim().toLowerCase())
    .filter(Boolean);

const getExtension = (name: string) => {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
};

const isAcceptedFile = (file: File, accepted: string[]) => {
  if (accepted.length === 0) {
    return true;
  }

  const ext = getExtension(file.name);
  const mime = file.type.toLowerCase();

  return accepted.some((rule) => {
    if (rule.endsWith("/*")) {
      const base = rule.replace("/*", "/");
      return mime.startsWith(base);
    }

    if (rule.includes("/")) {
      return mime === rule;
    }

    return ext === rule;
  });
};

export const UploadDocument: React.FC<UploadDocumentProps> = ({
  multiple = false,
  acceptedFormats = DEFAULT_ACCEPTED,
  maxFileSizeMB = DEFAULT_MAX_MB,
  label = "Upload documents",
  required = false,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [touched, setTouched] = useState(false);

  const acceptedList = useMemo(() => parseAcceptedFormats(acceptedFormats), [acceptedFormats]);
  const maxBytes = useMemo(() => maxFileSizeMB * 1024 * 1024, [maxFileSizeMB]);

  useEffect(() => () => {
    files.forEach((file) => URL.revokeObjectURL(file.previewUrl));
  }, [files]);

  const updateFiles = useCallback(
    (nextFiles: UploadedFile[]) => {
      setFiles(nextFiles);
      onChange?.(nextFiles);
    },
    [onChange]
  );

  const buildUploadedFile = useCallback(async (file: File) => {
    const fileContent = await file.arrayBuffer();
    const previewUrl = URL.createObjectURL(file);

    return {
      name: file.name,
      file,
      fileContent,
      previewUrl,
    } as UploadedFile;
  }, []);

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const selected = Array.from(fileList);
      const nextErrors: string[] = [];
      const validFiles: File[] = [];

      if (!multiple && selected.length > 1) {
        nextErrors.push("Only one file is allowed.");
      }

      selected.slice(0, multiple ? selected.length : 1).forEach((file) => {
        if (!isAcceptedFile(file, acceptedList)) {
          nextErrors.push(`${file.name}: Invalid file format.`);
          return;
        }

        if (file.size > maxBytes) {
          nextErrors.push(`${file.name}: File size exceeds ${maxFileSizeMB} MB.`);
          return;
        }

        validFiles.push(file);
      });

      const mapped = await Promise.all(validFiles.map(buildUploadedFile));
      const nextFiles = multiple ? [...files, ...mapped] : mapped;

      setErrors(nextErrors);
      updateFiles(nextFiles);
    },
    [acceptedList, buildUploadedFile, files, maxBytes, maxFileSizeMB, multiple, updateFiles]
  );

  const handleInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      setTouched(true);

      if (!fileList || fileList.length === 0) {
        return;
      }

      await processFiles(fileList);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [processFiles]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const nextFiles = [...files];
      const removed = nextFiles.splice(index, 1)[0];
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      updateFiles(nextFiles);
      setTouched(true);
    },
    [files, updateFiles]
  );

  const handleClearAll = useCallback(() => {
    files.forEach((file) => URL.revokeObjectURL(file.previewUrl));
    updateFiles([]);
    setTouched(true);
  }, [files, updateFiles]);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      setTouched(true);

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        await processFiles(event.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const requiredError = useMemo(
    () => (required && touched && files.length === 0 ? "This field is required." : null),
    [required, touched, files.length]
  );

  return (
    <div className="upload-document">
      <div className="upload-document__header">
        <div>
          <div className="upload-document__label">
            {label}
            {required && <span className="upload-document__required">*</span>}
          </div>
          <div className="upload-document__hint">
            {multiple ? "Upload one or more files" : "Upload a single file"} � Max {maxFileSizeMB} MB
          </div>
        </div>
        {files.length > 0 && (
          <button type="button" className="upload-document__clear" onClick={handleClearAll}>
            Clear all
          </button>
        )}
      </div>

      <div
        className={`upload-document__dropzone ${isDragging ? "is-dragging" : ""}`.trim()}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <div className="upload-document__icon">
          <FileUpIcon size={22} />
        </div>
        <div className="upload-document__title">Drop files here or click to browse</div>
        <div className="upload-document__formats">Accepted: {acceptedFormats}</div>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="upload-document__input"
        accept={acceptedFormats}
        multiple={multiple}
        onChange={handleInputChange}
      />

      {(errors.length > 0 || requiredError) && (
        <div className="upload-document__errors">
          {requiredError && <div className="upload-document__error">{requiredError}</div>}
          {errors.map((error, idx) => (
            <div key={`${error}-${idx}`} className="upload-document__error">
              {error}
            </div>
          ))}
        </div>
      )}

      <div className="upload-document__list">
        {files.length === 0 ? (
          <div className="upload-document__empty">No files selected yet.</div>
        ) : (
          files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="upload-document__item">
              <div className="upload-document__file">
                <FileText size={16} />
                <span>{file.name}</span>
              </div>
              <button type="button" className="upload-document__remove" onClick={() => handleRemove(index)}>
                <X size={14} />
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
