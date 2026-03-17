import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  HelpCircle,
  X
} from "lucide-react";
import "./SuccessToast.scss";

export type ToastType = "success" | "warning" | "error" | "info" | "confirmation";

export interface IToast {
  type?: ToastType;
  title: string;
  message: string;
  autoDismiss?: boolean;
  autoDismissDuration?: number;
}

export interface ToastProps {
  show: boolean;
  type?: ToastType;
  title: string;
  message: string;
  onClose: () => void;
  autoDismiss?: boolean;
  autoDismissDuration?: number;
}

export const SuccessToast: React.FC<ToastProps> = ({
  show,
  type = "success",
  title,
  message,
  onClose,
  autoDismiss = true,
  autoDismissDuration = 4000,
}) => {

  useEffect(() => {
    if (!show || !autoDismiss) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, autoDismissDuration);

    return () => window.clearTimeout(timer);
  }, [show, autoDismiss, autoDismissDuration, onClose]);

  // 🔥 Type-based config
  const config = {
    success: {
      icon: <CheckCircle2 size={22} />,
      className: "toast--success"
    },
    warning: {
      icon: <AlertTriangle size={22} />,
      className: "toast--warning"
    },
    error: {
      icon: <XCircle size={22} />,
      className: "toast--error"
    },
    info: {
      icon: <Info size={22} />,
      className: "toast--info"
    },
    confirmation: {
      icon: <HelpCircle size={22} />,
      className: "toast--confirmation"
    }
  };

  const current = config[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`toast ${current.className}`}
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
        >
          <div className="toast__accent" />

          <div className="toast__content">
            <div className="toast__icon">
              {current.icon}
            </div>

            <div className="toast__text">
              <div className="toast__title">{title}</div>
              <div className="toast__message">{message}</div>
            </div>

            <button
              className="toast__close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {autoDismiss && (
            <div
              className="toast__progress"
              style={{ animationDuration: `${autoDismissDuration}ms` }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};