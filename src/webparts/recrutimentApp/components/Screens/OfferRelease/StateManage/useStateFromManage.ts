import { useCallback, useState } from "react";
import { IselectedPosition } from "../ReviewDocument/PositionFrame";

export type AdvertLanguage = "EN" | "FR";

export interface DrawerStateManager {
  drawerOpen: boolean;
  reviewerComments: string;
  selectedJobId: number | null;
  CandidateID: number | null;
  selectedcandidateID: number | null;
  jobrequestID: string | null;
  acknowledgementCheckbox: boolean;
  loadingState: boolean;
  selectedValue: IselectedPosition | undefined;
  openDrawer: (jobId: number) => void;
  closeDrawer: () => void;
  setComments: (value: string) => void;
  toggleAcknowledgement: () => void;
  setLoadingState: (value: boolean) => void;
  setSelectedValue: (value: IselectedPosition | undefined) => void;
  setSelectedJobId: (value: number | null) => void;
  setCandidateID: (value: number | null) => void;
  setSelectedcandidateID: (value: number | null) => void;
  setJobrequestID: (value: string | null) => void;
}

export const useStateOfferRelease = (): DrawerStateManager => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [CandidateID, setCandidateID] = useState<number | null>(null);
  const [selectedcandidateID, setSelectedcandidateID] = useState<number | null>(
    null,
  );
  const [jobrequestID, setJobrequestID] = useState<string | null>(null);
  const [reviewerComments, setReviewerComments] = useState<string>("");
  const [acknowledgementCheckbox, setAcknowledgementCheckbox] =
    useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<
    IselectedPosition | undefined
  >(undefined);

  const openDrawer = useCallback((jobId: number) => {
    setSelectedJobId(jobId);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedJobId(null);
    setReviewerComments("");
    setAcknowledgementCheckbox(false);
    setLoadingState(false);
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
    CandidateID,
    selectedcandidateID,
    jobrequestID,
    reviewerComments,
    acknowledgementCheckbox,
    loadingState,
    selectedValue,
    openDrawer,
    closeDrawer,
    setComments,
    toggleAcknowledgement,
    setLoadingState,
    setSelectedValue,
    setCandidateID,
    setSelectedcandidateID,
    setJobrequestID,
    setSelectedJobId,
  };
};
