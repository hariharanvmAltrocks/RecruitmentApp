// Hooks/useWorkPermitUpload.ts
import { useRef, useState } from "react";

export interface UseWorkPermitUploadReturn {
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedFile: File | null;
  isReading: boolean;
  hasFileError: boolean;
  setHasFileError: (val: boolean) => void;
  handleUploadClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
}

export const useWorkPermitUpload = (): UseWorkPermitUploadReturn => {
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReading, setIsReading]       = useState(false);
  const [hasFileError, setHasFileError] = useState(false);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReading(true);
    setHasFileError(false);

    // Simulate brief read delay — replace with real async read if needed
    setTimeout(() => {
      setSelectedFile(file);
      setIsReading(false);
    }, 500);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setHasFileError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    fileInputRef,
    selectedFile,
    isReading,
    hasFileError,
    setHasFileError,
    handleUploadClick,
    handleFileChange,
    clearFile,
  };
};