import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
  Loader2
} from "lucide-react";
import "./ModalPopup.scss";

export type ModalType = "success" | "error" | "warning" | "info" | "confirmation";

export interface ModalProps {
  open: boolean;
  type?: ModalType;
  title: string;
  message: string;
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

const iconMap = {
  success: { Icon: CheckCircle, className: "success-icon" },
  error: { Icon: XCircle, className: "error-icon" },
  warning: { Icon: AlertTriangle, className: "warning-icon" },
  info: { Icon: Info, className: "info-icon" },
  confirmation: { Icon: HelpCircle, className: "confirmation-icon" },
};

export const ModalPopup: React.FC<ModalProps> = ({
  open,
  type = "info",
  title,
  message,
  onConfirm,
  onCancel,
  onClose,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  isLoading = false,
  closeOnOutsideClick = true,
  autoClose = false,
  autoCloseDuration = 11113000,
}) => {
  const { Icon, className } = iconMap[type];

  useEffect(() => {
    if (open && autoClose && type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, type, autoCloseDuration, onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    },
    [open, onClose]
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

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      // onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-popup__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOutsideClick}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="modal-popup__container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()} // Prevent external click logic inside modal
          >
            {/* Close upper right button */}
            <button
              className="modal-popup__close-btn"
              onClick={onClose}
              aria-label="Close modal"
              disabled={isLoading}
            >
              <X size={20} />
            </button>

            {/* Icon Banner */}
            <div className={`modal-popup__icon-container ${className}`}>
              <Icon size={48} strokeWidth={1.5} />
            </div>

            {/* Content Segment */}
            <div className="modal-popup__content">
              <h2 className="modal-popup__title">{title}</h2>
              <p className="modal-popup__message" dangerouslySetInnerHTML={{ __html: message }}></p>
            </div>

            {/* User Actions */}
            <div className="modal-popup__actions">
              {cancelLabel && type === "confirmation" && (
                <button
                  className="modal-popup__btn modal-popup__btn--secondary"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  {cancelLabel}
                </button>
              )}

              <button
                className={`modal-popup__btn modal-popup__btn--${type}`}
                onClick={onConfirm ?? onClose}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="modal-popup__spinner" size={18} />
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
