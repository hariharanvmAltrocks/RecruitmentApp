import React from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ResueComponent.module.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

export type VerificationStatus = "verified" | "rejected" | null;

export interface ConsentFormFile {
  name: string;
  size: number;
  type: string;
  content: string | Uint8Array | ArrayBuffer;
  lastModified: number;
}

interface VerificationToggleProps {
  value: VerificationStatus;
  onChange: (value: VerificationStatus) => void;
  disabled?: boolean;
  hasError?: boolean;
  label?: string;
}

export const VerificationToggle: React.FC<VerificationToggleProps> = ({
  value,
  onChange,
  disabled = false,
  hasError = false,
  label = strings.DocumentVerificationStatus,
}) => {
  return (
    <div className={`${styles.verificationToggle} ${hasError ? styles.error : ""}`}>
      <label className={styles.label}>{label}</label>
      
      <div className={styles.options}>
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className={`${styles.option} ${value === "verified" ? styles.optionVerified : ""}`}
          onClick={() => !disabled && onChange("verified")}
          type="button"
          disabled={disabled}
        >
          <Check size={16} strokeWidth={3} />
          {strings.Verified}</motion.button>

        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className={`${styles.option} ${value === "rejected" ? styles.optionRejected : ""}`}
          onClick={() => !disabled && onChange("rejected")}
          type="button"
          disabled={disabled}
        >
          <X size={16} strokeWidth={3} />
          {strings.Rejected}</motion.button>
      </div>

      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.errorText}
          >
            <AlertCircle size={14} />
            {strings.PleaseVerifyTheDocumentStatusBeforeProce}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
