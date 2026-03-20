import { useState } from "react";
import { IToast } from "../Comman/Toast/SuccessToast";

export const useToast = () => {
  const [toast, setToast] = useState<IToast>({
    open: false,
    type: "success",
    title: "",
    message: "",
    autoDismiss: true,
    autoDismissDuration: 3000,
    // buttonAction: undefined,
  });

  const showToast = (config: Partial<IToast>) => {
    setToast({
      open: true,
      type: "success",
      title: "",
      message: "",
      autoDismiss: true,
      autoDismissDuration: 3000,
      ...config,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // ✅ Helper methods
  const showSuccess = (message: string, title = "Success") => {
    showToast({ type: "success", title, message });
  };

  const showError = (message: string, title = "Error") => {
    showToast({
      type: "error",
      title,
      message,
      autoDismiss: false,
    });
  };

  const showWarning = (message: string, title = "Warning") => {
    showToast({ type: "warning", title, message });
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    title = "Confirm"
  ) => {
    showToast({
      type: "confirmation",
      title,
      message,
      autoDismiss: false,
    //   buttonAction: onConfirm,
    });
  };

  return {
    toast,
    showToast,
    closeToast,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  };
};