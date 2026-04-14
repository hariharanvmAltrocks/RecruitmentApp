import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
  Loader2,
  Send,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import "./ModalPopup.scss";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type ModalType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "confirmation"
  | "submit"
  | "cancel"
  | "validation";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ModalProps {
  open: boolean;
  type?: ModalType;
  title?: string;
  message?: string;
  validationErrors?: ValidationError[]; // used when type="validation"
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  closeOnOutsideClick?: boolean;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-type config — icon, gradient, accent color, default labels
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG: Record<
  ModalType,
  {
    icon: React.ReactNode;
    iconGradient: string;
    accentColor: string;
    defaultTitle: string;
    defaultMessage: string;
    defaultConfirmLabel?: string;
    defaultCancelLabel: string;
    confirmBtnClass: string;
  }
> = {
  success: {
    icon: <CheckCircle2 size={28} color="#fff" />,
    iconGradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    accentColor: "#22c55e",
    defaultTitle: "Submitted Successfully!",
    defaultMessage: "Your request has been processed.",
    defaultCancelLabel: "Close",
    confirmBtnClass: "btn--success",
  },
  error: {
    icon: <XCircle size={28} color="#fff" />,
    iconGradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    accentColor: "#ef4444",
    defaultTitle: "Something Went Wrong",
    defaultMessage: "An error occurred. Please try again.",
    defaultConfirmLabel: "Retry",
    defaultCancelLabel: "Close",
    confirmBtnClass: "btn--error",
  },
  warning: {
    icon: <AlertTriangle size={28} color="#fff" />,
    iconGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    accentColor: "#f59e0b",
    defaultTitle: "Warning",
    defaultMessage: "Please review before proceeding.",
    defaultConfirmLabel: "Proceed",
    defaultCancelLabel: "Cancel",
    confirmBtnClass: "btn--warning",
  },
  info: {
    icon: <Info size={28} color="#fff" />,
    iconGradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    accentColor: "#2563eb",
    defaultTitle: "Information",
    defaultMessage: "",
    defaultConfirmLabel: "OK",
    defaultCancelLabel: "Close",
    confirmBtnClass: "btn--info",
  },
  confirmation: {
    icon: <HelpCircle size={28} color="#fff" />,
    iconGradient: "linear-gradient(135deg, #9333ea, #7e22ce)",
    accentColor: "#9333ea",
    defaultTitle: "Are you sure?",
    defaultMessage: "",
    defaultConfirmLabel: "Yes, Continue",
    defaultCancelLabel: "Cancel",
    confirmBtnClass: "btn--confirmation",
  },
  submit: {
    icon: <Send size={28} color="#fff" />,
    iconGradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    accentColor: "#2563eb",
    defaultTitle: "Confirm Submission",
    defaultMessage:
      "Are you sure you want to submit? This action cannot be undone.",
    defaultConfirmLabel: "Yes, Submit",
    defaultCancelLabel: "Cancel",
    confirmBtnClass: "btn--info",
  },
  cancel: {
    icon: <LogOut size={28} color="#fff" />,
    iconGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    accentColor: "#f59e0b",
    defaultTitle: "Are you sure you want to leave?",
    defaultMessage: "Any unsaved changes will be lost.",
    defaultConfirmLabel: "Yes, Leave",
    defaultCancelLabel: "Stay Here",
    confirmBtnClass: "btn--warning",
  },
  validation: {
    icon: <ShieldAlert size={28} color="#fff" />,
    iconGradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    accentColor: "#ef4444",
    defaultTitle: "Please Fill All Mandatory Fields",
    defaultMessage: "Complete the following fields before submitting:",
    defaultCancelLabel: "Got it",
    confirmBtnClass: "btn--error",
  },
};

export const ModalPopup: React.FC<ModalProps> = ({
  open,
  type = "info",
  title,
  message,
  validationErrors = [],
  onConfirm,
  onCancel,
  onClose,
  confirmLabel,
  cancelLabel,
  isLoading = false,
  closeOnOutsideClick = true,
  autoClose = false,
  autoCloseDuration = 3000,
}) => {
  const cfg = CONFIG[type];

  const resolvedTitle = title ?? cfg.defaultTitle;
  const resolvedMessage = message ?? cfg.defaultMessage;
  const resolvedConfirmLabel = confirmLabel ?? cfg.defaultConfirmLabel;
  const resolvedCancelLabel = cancelLabel ?? cfg.defaultCancelLabel;

  // Auto-close for success type
  useEffect(() => {
    if (open && autoClose && type === "success") {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, type, autoCloseDuration, onClose]);

  // Keyboard Escape to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    },
    [open, onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) onClose();
  };

  const showConfirmBtn =
    !!resolvedConfirmLabel &&
    !!onConfirm &&
    type !== "validation" &&
    type !== "success";

  return (
    <AnimatePresence>
      {open && (
        // ── Backdrop ──
        <motion.div
          key="backdrop"
          className="modal-popup__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
        >
          {/* ── Card ── */}
          <motion.div
            key="card"
            className="modal-popup__container"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar — color per type */}
            <div
              className="modal-popup__accent-bar"
              style={{ background: cfg.accentColor }}
            />

            {/* Close button */}
            {/* <button
              className="modal-popup__close-btn"
              onClick={onClose}
              aria-label="Close modal"
              disabled={isLoading}
            >
              <X size={14} />
            </button> */}

            {/* Circular gradient icon */}
            <div className="modal-popup__icon-wrap">
              <div
                className="modal-popup__icon-circle"
                style={{ background: cfg.iconGradient }}
              >
                {cfg.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="modal-popup__title">{resolvedTitle}</h3>

            {/* Message */}
            {resolvedMessage && (
              <p
                className="modal-popup__message"
                dangerouslySetInnerHTML={{ __html: resolvedMessage }}
              />
            )}

            {/* Validation error list */}
            {type === "validation" && validationErrors.length > 0 && (
              <div className="modal-popup__validation-list">
                {validationErrors.map((err, i) => (
                  <div key={i} className="modal-popup__validation-item">
                    <XCircle
                      size={13}
                      className="modal-popup__validation-icon"
                    />
                    <span>{err.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Success pulse dots */}
            {/* {type === "success" && (
              <div className="modal-popup__pulse-row">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="modal-popup__pulse-dot"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )} */}

            {/* Footer buttons */}
            <div className="modal-popup__actions">
              {/* Cancel / Close / Got it */}
              <button
                className="modal-popup__btn btn--secondary"
                onClick={() => {
                  if (type === "success" && onConfirm) {
                    onConfirm(); // call parent handler
                  } else {
                    (onCancel ?? onClose ?? onConfirm)?.();
                  }
                }}
                disabled={isLoading}
              >
                {resolvedCancelLabel}
              </button>

              {/* Confirm — shown for types that have a confirm action */}
              {showConfirmBtn && (
                <button
                  className={`modal-popup__btn ${cfg.confirmBtnClass}`}
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="modal-popup__spinner" size={16} />
                  ) : (
                    resolvedConfirmLabel
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalPopup;
