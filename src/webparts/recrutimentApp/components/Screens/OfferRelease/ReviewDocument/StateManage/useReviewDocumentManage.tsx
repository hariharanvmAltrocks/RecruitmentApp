import { useCallback, useState } from "react";
import {  ConsentFormFile, VerificationStatus } from "../Component/ResueComponent";
import { UploadedFile } from "../../../RecruitmentTable/Components/UploadDocument";
import { COIState } from "../Component/Coicard/Coicard";
import { IDocFiles } from "../../../../../services/SPService/Ispservice";

 
export interface COIFormState {
  consultedWith: string;
  comments: string;
  attachment: IDocFiles[];
}

export interface DrawerStateManager {
    consentVerification: VerificationStatus;
    consentFile: ConsentFormFile | null;
    showConsentErrors: boolean;
    reviewerComments:string;
    acknowledgementCheckbox:boolean;
    handleConsentVerification: (value: VerificationStatus) => void;
    handleConsentFile: (value: ConsentFormFile | null) => void;
    handleConsentErrors: (value: boolean) => void;
    coiState: COIFormState;
    showCoiErrors: boolean;
    handleCoiChange: (value: COIState) => void;
    handleCoiErrors: (value: boolean) => void;
    validateAll: () => boolean;
    onCommentsChange: (value: string) => void;
    onToggleAcknowledgement: (value: boolean) => void;
}

export const useStateOfferRelease = (): DrawerStateManager => {
  const [reviewerComments, setReviewerComments] = useState("");
  const [acknowledgementCheckbox, setAcknowledgementCheckbox] = useState(false);
  const [consentVerification, setConsentVerification] = useState<VerificationStatus>(null);
  const [consentFile, setConsentFile] = useState<ConsentFormFile | null>(null);
  const [showConsentErrors, setShowConsentErrors] = useState<boolean>(false);

   // ── COI form ──
  const [coiState, setCoiState] = useState<COIFormState>({
    consultedWith: "",
    comments: "",
    attachment: [],
  });
  const [showCoiErrors, setShowCoiErrors] = useState(false);
 
const validateAll = useCallback((): boolean => {
    const consentValid =
      consentVerification !== null && consentFile !== null;
    const coiValid =
      !!coiState.consultedWith &&
      !!coiState.comments.trim() &&
      coiState.attachment.length > 0;
 
    if (!consentValid) setShowConsentErrors(true);
    if (!coiValid) setShowCoiErrors(true);
 
    return consentValid && coiValid;
  }, [consentVerification, consentFile, coiState]);

  
  const handleConsentVerification = useCallback((value: VerificationStatus) => {
    setConsentVerification(value);
  }, []);

  const handleConsentFile = useCallback((value: ConsentFormFile | null) => {
    setConsentFile(value);
  }, []);

  const handleConsentErrors = useCallback((value: boolean) => {
    setShowConsentErrors(value);
  }, []);

    const handleCoiChange = useCallback((state: COIFormState) => {
    setCoiState(state);
  }, []);
 
  const handleCoiErrors = useCallback(
    (show: boolean) => setShowCoiErrors(show),
    []
  );

  const onCommentsChange = useCallback((value: string) => {
    setReviewerComments(value);
  }, []);

  const onToggleAcknowledgement = useCallback((value: boolean) => {
    setAcknowledgementCheckbox(value);
  }, []);

  return {
    consentVerification,
    consentFile,
    showConsentErrors,
    handleConsentVerification,
    handleConsentFile,
    handleConsentErrors,
    coiState,
    showCoiErrors,
    handleCoiChange,
    handleCoiErrors,
    // Aggregate
    validateAll,

    reviewerComments,
    acknowledgementCheckbox,
    onCommentsChange,
    onToggleAcknowledgement

  };
};
