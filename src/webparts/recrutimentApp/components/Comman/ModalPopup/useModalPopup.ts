import { useState, useCallback } from "react";
import { ModalType } from "./ModalPopup";

export interface ModalState {
  open: boolean;
  title: string;
  message: string;
  type: ModalType;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const useModalPopup = () => {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    title: "",
    message: "",
    type: "info",
    isLoading: false,
  });

  const showModal = useCallback(
    (options: Omit<ModalState, "open" | "isLoading">) => {
      setModalState({
        ...options,
        open: true,
        isLoading: false,
      });
    },
    [],
  );

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, open: false, isLoading: false }));
  }, []);

  const setModalLoading = useCallback((isLoading: boolean) => {
    setModalState((prev) => ({ ...prev, isLoading }));
  }, []);

  return {
    modalState,
    showModal,
    closeModal,
    setModalLoading,
  };
};
