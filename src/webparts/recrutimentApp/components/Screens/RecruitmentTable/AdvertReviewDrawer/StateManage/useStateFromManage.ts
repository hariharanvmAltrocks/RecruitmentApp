import { useCallback, useState } from "react";

export type AdvertLanguage = "EN" | "FR";

export interface DrawerStateManager {
  drawerOpen: boolean;
  selectedJobId: string | null;
  advertLanguage: AdvertLanguage;
  reviewerComments: string;
  acknowledgementCheckbox: boolean;
  loadingState: boolean;
  openDrawer: (jobId: string) => void;
  closeDrawer: () => void;
  setAdvertLanguage: (language: AdvertLanguage) => void;
  setComments: (value: string) => void;
  toggleAcknowledgement: () => void;
  setLoadingState: (value: boolean) => void;
}

export const useStateFromManage = (): DrawerStateManager => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [advertLanguage, setAdvertLanguageState] = useState<AdvertLanguage>("EN");
  const [reviewerComments, setReviewerComments] = useState<string>("");
  const [acknowledgementCheckbox, setAcknowledgementCheckbox] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const openDrawer = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedJobId(null);
    setAdvertLanguageState("EN");
    setReviewerComments("");
    setAcknowledgementCheckbox(false);
    setLoadingState(false);
  }, []);

  const setAdvertLanguage = useCallback((language: AdvertLanguage) => {
    setAdvertLanguageState(language);
  }, []);

  const setComments = useCallback((value: string) => {
    setReviewerComments(value);
  }, []);

  const toggleAcknowledgement = useCallback(() => {
    setAcknowledgementCheckbox((prev) => !prev);
  }, []);

  return {
    drawerOpen,
    selectedJobId,
    advertLanguage,
    reviewerComments,
    acknowledgementCheckbox,
    loadingState,
    openDrawer,
    closeDrawer,
    setAdvertLanguage,
    setComments,
    toggleAcknowledgement,
    setLoadingState,
  };
};
