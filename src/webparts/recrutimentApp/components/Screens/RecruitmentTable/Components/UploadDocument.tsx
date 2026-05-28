import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FileText, FileUpIcon, X } from "lucide-react";
import "./UploadDocument.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

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
  hasError?: boolean;
  disabled?: boolean;
}

const DEFAULT_ACCEPTED = ".pdf,.doc,.docx,.xls,.xlsx";
const DEFAULT_MAX_MB = 15;

const parseAcceptedFormats = (acceptedFormats: string) =>
  acceptedFormats
    .split(",")
    .map((f) => f.trim().toLowerCase())
    .filter(Boolean);

const getExtension = (name: string) => {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
};

const isAcceptedFile = (file: File, accepted: string[]) => {
  if (accepted.length === 0) return true;
  const ext = getExtension(file.name);
  const mime = file.type.toLowerCase();
  return accepted.some((rule) => {
    if (rule.endsWith("/*")) return mime.startsWith(rule.replace("/*", "/"));
    if (rule.includes("/")) return mime === rule;
    return ext === rule;
  });
};

export const UploadDocument: React.FC<UploadDocumentProps> = ({
  multiple = false,
  acceptedFormats = DEFAULT_ACCEPTED,
  maxFileSizeMB = DEFAULT_MAX_MB,
  label = strings.UploadDocuments,
  required = false,
  onChange,
  hasError = false,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [touched, setTouched] = useState(false);

  const acceptedList = useMemo(
    () => parseAcceptedFormats(acceptedFormats),
    [acceptedFormats],
  );
  const maxBytes = useMemo(() => maxFileSizeMB * 1024 * 1024, [maxFileSizeMB]);

  useEffect(
    () => () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    },
    [files],
  );

  const updateFiles = useCallback(
    (nextFiles: UploadedFile[]) => {
      setFiles(nextFiles);
      onChange?.(nextFiles);
    },
    [onChange],
  );

  const buildUploadedFile = useCallback(
    async (file: File): Promise<UploadedFile> => {
      const fileContent = await file.arrayBuffer();
      const previewUrl = URL.createObjectURL(file);
      return { name: file.name, file, fileContent, previewUrl };
    },
    [],
  );

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const selected = Array.from(fileList);
      const nextErrors: string[] = [];
      const validFiles: File[] = [];

      if (!multiple && selected.length > 1) {
        nextErrors.push(strings.OnlyOneFileIsAllowed);
      }

      selected.slice(0, multiple ? selected.length : 1).forEach((file) => {
        if (!isAcceptedFile(file, acceptedList)) {
          nextErrors.push(`${file.name}: Invalid file format.`);
          return;
        }
        if (file.size > maxBytes) {
          nextErrors.push(
            `${file.name}: File size exceeds ${maxFileSizeMB} MB.`,
          );
          return;
        }
        validFiles.push(file);
      });

      const mapped = await Promise.all(validFiles.map(buildUploadedFile));
      const nextFiles = multiple ? [...files, ...mapped] : mapped;
      setErrors(nextErrors);
      updateFiles(nextFiles);
    },
    [
      acceptedList,
      buildUploadedFile,
      files,
      maxBytes,
      maxFileSizeMB,
      multiple,
      updateFiles,
    ],
  );

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setTouched(true);
      if (!e.target.files || e.target.files.length === 0) return;
      await processFiles(e.target.files);
      if (inputRef.current) inputRef.current.value = "";
    },
    [processFiles],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const next = [...files];
      const removed = next.splice(index, 1)[0];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      updateFiles(next);
      setTouched(true);
    },
    [files, updateFiles],
  );

  const handleClearAll = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    updateFiles([]);
    setTouched(true);
  }, [files, updateFiles]);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      setTouched(true);
      if (e.dataTransfer.files?.length > 0) {
        await processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  const requiredError = useMemo(
    () =>
      required && touched && files.length === 0
        ? strings.ThisFieldIsRequired
        : null,
    [required, touched, files.length],
  );

  return (
    <div className="upload-document">
      {/* ── Header ── */}
      <div className="upload-document__header">
        <div>
          <div className="upload-document__label">
            {label}
            {required && <span className="upload-document__required">*</span>}
          </div>
          <div className="upload-document__hint">
            {multiple ? strings.UploadOneOrMoreFiles : strings.UploadASingleFile} {strings.Max}{maxFileSizeMB} {strings.Mb}</div>
        </div>
        {files.length > 1 && (
          <button
            type="button"
            className="upload-document__clear"
            onClick={handleClearAll}
          >
            {strings.ClearAll}</button>
        )}
      </div>

      {/* ── Dropzone — red border + bg when hasError=true ── */}
      <div
        className={[
          "upload-document__dropzone",
          isDragging ? "is-dragging" : "",
          hasError ? "upload-document__dropzone--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <div className="upload-document__icon">
          <FileUpIcon size={22} />
        </div>
        <div className="upload-document__title">
          {strings.DropFilesHereOrClickToBrowse}</div>
        <div className="upload-document__formats">
          {strings.Accepted}{acceptedFormats}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="upload-document__input"
        accept={acceptedFormats}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
      />

      {/* ── Format / size errors ── */}
      {(errors.length > 0 || requiredError) && (
        <div className="upload-document__errors">
          {requiredError && (
            <div className="upload-document__error">{requiredError}</div>
          )}
          {errors.map((err, idx) => (
            <div key={`${err}-${idx}`} className="upload-document__error">
              {err}
            </div>
          ))}
        </div>
      )}

      {/* ── Parent-driven submit error ── */}
      {hasError && (
        <span className="upload-document__error-text">
          {strings.UploadDocumentIsRequired}</span>
      )}

      {/* ── File list ── */}
      <div className="upload-document__list">
        {files.length === 0 ? (
          <div className="upload-document__empty">{strings.NoFilesSelectedYet}</div>
        ) : (
          files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="upload-document__item"
            >
              <div className="upload-document__file">
                <FileText size={16} />
                <span>{file.name}</span>
              </div>
              <button
                type="button"
                className="upload-document__remove"
                onClick={() => handleRemove(index)}
              >
                <X size={14} />
                {strings.Remove}</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
