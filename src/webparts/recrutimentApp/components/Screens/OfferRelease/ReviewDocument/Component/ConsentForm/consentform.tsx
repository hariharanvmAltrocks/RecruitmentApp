import React, { useRef, useState } from "react";
import { Download, Upload, FileText, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConsentFormFile } from "../ResueComponent";
import "./consentform.scss";
import { IDocFiles } from "../../../../../../services/SPService/Ispservice";
import * as strings from 'RecrutimentAppWebPartStrings';

interface ConsentFormSectionProps {
  onFileChange: (file: ConsentFormFile | null) => void;
  downloadUrl?: string;
  disabled?: boolean;
  hasFileError?: boolean;
  consentform?: IDocFiles | null;
}

const ConsentFormSection: React.FC<ConsentFormSectionProps> = ({
  consentform,
  onFileChange,
  downloadUrl = "#",
  disabled = false,
  hasFileError = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReading, setIsReading] = useState(false);

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsReading(true);

    try {
      const buffer = await file.arrayBuffer();
      const content = new Uint8Array(buffer);

      onFileChange({
        name: file.name,
        size: file.size,
        type: file.type,
        content: content,
        lastModified: file.lastModified,
      });
    } catch (error) {
      console.error(strings.ErrorReadingFile, error);
    } finally {
      setIsReading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`consent-form-section ${hasFileError ? "has-error" : ""} ${disabled ? "disabled" : ""}`}>
      <div className="consent-form-section__header">
        <div className="consent-form-section__icon-wrapper">
          <ShieldCheck size={20} className="consent-form-section__icon" />
        </div>
        <h3 className="consent-form-section__title">{strings.CandidateConsentForm}</h3>
      </div>

      <div className="consent-form-section__content">
        {/* Download Card */}
        <div className="consent-card">
          <div className="consent-card__info">
            <span className="consent-card__label">{strings.ConsentForm}{consentform?.name}</span>
            <span className="consent-card__name">{strings.DownloadTheFormAddYourSignatureThenUploa}</span>
          </div>
          <a 
  href={consentform?.downloadUrl} 
  className="consent-card__download-btn"
  download={consentform?.name ?? true}
>
  <Download size={16} />
  <span>{strings.DownloadTemplate}</span>
</a>
        </div>

        {/* Upload Area */}
        <div 
          className={`upload-box ${selectedFile ? "upload-box--has-file" : ""} ${hasFileError ? "upload-box--error" : ""}`}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="upload-box__input"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={disabled || isReading}
          />
          
          <div className="upload-box__inner">
            {selectedFile ? (
              <div className="upload-box__file-info">
                <div className="upload-box__file-icon">
                  <FileText size={24} />
                </div>
                <div className="upload-box__file-details">
                  <span className="upload-box__filename">{selectedFile.name}</span>
                  <span className="upload-box__filesize">
                    {(selectedFile.size / 1024).toFixed(1)} {strings.Kb}</span>
                </div>
                <div className="upload-box__status">
                  {isReading ? (
                    <div className="upload-box__spinner" />
                  ) : (
                    <CheckCircle2 size={20} className="upload-box__success-icon" />
                  )}
                </div>
              </div>
            ) : (
              <div className="upload-box__placeholder">
                <div className="upload-box__icon-circle">
                  <Upload size={20} />
                </div>
                <div className="upload-box__text">
                  <span className="upload-box__primary">{strings.ClickToUploadSignedForm}</span>
                  <span className="upload-box__secondary">{strings.PdfOrWordDocumentMax5mb}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {hasFileError && (
            <motion.div 
              className="consent-form-section__error"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <AlertCircle size={14} />
              <span>{strings.PleaseUploadTheSignedConsentFormToProcee}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedFile && !disabled && (
        <button 
          type="button" 
          className="consent-form-section__remove-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
        >
          {strings.ReplaceDocument}</button>
      )}
    </div>
  );
};

export default ConsentFormSection;