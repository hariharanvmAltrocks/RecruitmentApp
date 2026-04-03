// StateManage/useStateOfferRelease.ts
import { useCallback, useRef, useState } from "react";
import { ConsentFormFile, VerificationStatus } from "../Component/ResueComponent";
import { UploadedFile } from "../../../RecruitmentTable/Components/UploadDocument";
import { COIState } from "../Component/Coicard/Coicard";
import { IDocFiles } from "../../../../../services/SPService/Ispservice";
import { ReviewVisibilityFlags } from "../Hooks/ConditionalHooks/Reviewdocumentconditions";


// ─── Types ────────────────────────────────────────────────────────────────────

export interface COIFormState {
  consultedWith : string;
  comments      : string;
  attachment    : IDocFiles[];
}

export interface ValidationError {
  comments         : boolean;
  acknowledgement  : boolean;
  uploadDocs       : boolean;
  workPermit       : boolean;
  selectedFile     : boolean;
  showConsentErrors: boolean;
  showCoiErrors    : boolean;
  uploadError      : boolean;
  verification     : boolean;
}

// Default reset shape — single source of truth
const DEFAULT_VALIDATION: ValidationError = {
  comments         : false,
  acknowledgement  : false,
  uploadDocs       : false,
  workPermit       : false,
  selectedFile     : false,
  showConsentErrors: false,
  showCoiErrors    : false,
  uploadError      : false,
  verification     : false
};

export interface DrawerStateManager {
  // Consent
  consentVerification      : VerificationStatus;
  consentFile              : ConsentFormFile | null;
  showConsentErrors        : boolean;
  handleConsentVerification: (value: VerificationStatus) => void;
  handleConsentFile        : (value: ConsentFormFile | null) => void;
  handleConsentErrors      : (value: boolean) => void;

  // Comments & acknowledgement
  reviewerComments        : string;
  acknowledgementCheckbox : boolean;
  onCommentsChange        : (value: string) => void;
  onToggleAcknowledgement : (value: boolean) => void;

  // COI
  coiState       : COIFormState;
  showCoiErrors  : boolean;
  handleCoiChange: (value: COIState) => void;
  handleCoiErrors: (value: boolean) => void;

  // Work permit file
  fileInputRef     : React.RefObject<HTMLInputElement>;
  selectedFile     : File | null;
  isReading        : boolean;
  hasFileError     : boolean;
  setHasFileError  : (val: boolean) => void;
  handleUploadClick: () => void;
  handleFileChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile        : () => void;

  // Upload docs
  uploadDocs          : UploadedFile[];
  handleDocumnetUpload: (value: UploadedFile[]) => void;

  // Validation
  validationError: ValidationError;
  validateAll    : (vis: ReviewVisibilityFlags) => boolean;
}


// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useStateOfferRelease = (): DrawerStateManager => {

  // ── Consent ──
  const [consentVerification, setConsentVerification] =
    useState<VerificationStatus>(null);
  const [consentFile, setConsentFile] =
    useState<ConsentFormFile | null>(null);
  const [showConsentErrors, setShowConsentErrors] = useState(false);

  // ── Comments & acknowledgement ──
  const [reviewerComments, setReviewerComments]           = useState("");
  const [acknowledgementCheckbox, setAcknowledgementCheckbox] = useState(false);

  // ── COI ──
  const [coiState, setCoiState] = useState<COIFormState>({
    consultedWith : "",
    comments      : "",
    attachment    : [],
  });
  const [showCoiErrors, setShowCoiErrors] = useState(false);

  // ── Work permit file ──
  const fileInputRef                    = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReading, setIsReading]       = useState(false);
  const [hasFileError, setHasFileError] = useState(false);

  // ── Upload docs ──
  const [uploadDocs, setUploadDocs] = useState<UploadedFile[]>([]);

  // ── Validation error state ──
  const [validationError, setValidationError] =
    useState<ValidationError>(DEFAULT_VALIDATION);


  // ─── Consent handlers ─────────────────────────────────────────────────────

  const handleConsentVerification = useCallback(
    (value: VerificationStatus) => setConsentVerification(value),
    []
  );

  const handleConsentFile = useCallback(
    (value: ConsentFormFile | null) => setConsentFile(value),
    []
  );

  const handleConsentErrors = useCallback(
    (value: boolean) => setShowConsentErrors(value),
    []
  );


  // ─── Comments & acknowledgement handlers ──────────────────────────────────

const onCommentsChange = useCallback((value: string) => {
  setReviewerComments(value);
  setValidationError((prev: ValidationError) => ({ ...prev, comments: false }));
}, []);

const onToggleAcknowledgement = useCallback((value: boolean) => {
  setAcknowledgementCheckbox(value);
  setValidationError((prev: ValidationError) => ({ ...prev, acknowledgement: false }));
}, []);


  // ─── COI handlers ─────────────────────────────────────────────────────────

  const handleCoiChange = useCallback(
    (state: COIState) => setCoiState(state as COIFormState),
    []
  );

  const handleCoiErrors = useCallback(
    (show: boolean) => setShowCoiErrors(show),
    []
  );


  // ─── Work permit file handlers ────────────────────────────────────────────

  const handleUploadClick = useCallback(
    () => fileInputRef.current?.click(),
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsReading(true);
      setHasFileError(false);

      setTimeout(() => {
        setSelectedFile(file);
        setIsReading(false);
      }, 500);
    },
    []
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setHasFileError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);


  // ─── Upload docs handler ──────────────────────────────────────────────────

  const handleDocumnetUpload = useCallback(
    (value: UploadedFile[]) => setUploadDocs(value),
    []
  );


  // ─── validateAll ─────────────────────────────────────────────────────────
  //
  // Accepts `vis` (ReviewVisibilityFlags) so it only validates what is
  // actually visible on screen for the current workflow status.
  // Returns true when every visible section is valid.

  const validateAll = useCallback(
    (vis: ReviewVisibilityFlags): boolean => {

      const errors: ValidationError = { ...DEFAULT_VALIDATION };
      let isValid = true;

      if (vis.showVerificationToggle && consentVerification === null) {
        errors.verification = true;
        isValid = false;
      }
      if (vis.showConsentForm && !consentFile) {
        errors.showConsentErrors = true;
        isValid = false;
      }

      if (vis.showCOICard) {
        const coiInvalid =
          !coiState.consultedWith.trim() || !coiState.comments.trim();
        if (coiInvalid) {
          errors.showCoiErrors = true;
          isValid = false;
        }
      }

      if (vis.showWorkPermitUpload && !selectedFile) {
        errors.workPermit = true;
        errors.selectedFile = true;
        isValid = false;
      }

      if (vis.showUploadDocument && uploadDocs.length === 0) {
        errors.uploadDocs   = true;
        errors.uploadError  = true;
        isValid = false;
      }

      if (!vis.showUploadDocument && !reviewerComments.trim()) {
        errors.comments = true;
        isValid = false;
      }
      if (!vis.showUploadDocument && !acknowledgementCheckbox) {
        errors.acknowledgement = true;
        isValid = false;
      }

      setValidationError(errors);
      
      return isValid;
    },
    [
      consentVerification,
      consentFile,
      coiState,
      selectedFile,
      uploadDocs,
      reviewerComments,
      acknowledgementCheckbox,
    ]
  );



  return {
    // Consent
    consentVerification,
    consentFile,
    showConsentErrors,
    handleConsentVerification,
    handleConsentFile,
    handleConsentErrors,

    // Comments & acknowledgement
    reviewerComments,
    acknowledgementCheckbox,
    onCommentsChange,
    onToggleAcknowledgement,

    // COI
    coiState,
    showCoiErrors,
    handleCoiChange,
    handleCoiErrors,

    // Work permit file
    fileInputRef,
    selectedFile,
    isReading,
    hasFileError,
    setHasFileError,
    handleUploadClick,
    handleFileChange,
    clearFile,

    // Upload docs
    uploadDocs,
    handleDocumnetUpload,

    // Validation
    validationError,
    validateAll,

  
  };
};