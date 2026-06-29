// StateManage/useStateOfferRelease.ts
import { useCallback, useRef, useState } from "react";
import {
  ConsentFormFile,
  VerificationStatus,
} from "../Component/ResueComponent";
import { UploadedFile } from "../../../RecruitmentTable/Components/UploadDocument";
import { COIState } from "../Component/Coicard/Coicard";
import { IDocFiles } from "../../../../../services/SPService/Ispservice";
import { ReviewVisibilityFlags } from "../Hooks/ConditionalHooks/Reviewdocumentconditions";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface COIFormState {
  consultedWith: string;
  comments: string;
  attachment: IDocFiles[];
  wishesToProceed: string;
}

export interface ValidationError {
  comments: boolean;
  acknowledgement: boolean;
  uploadDocs: boolean;
  workPermit: boolean;
  selectedFile: boolean;
  showConsentErrors: boolean;
  showCoiErrors: boolean;
  uploadError: boolean;
  verification: boolean;
  nationalOfferReleased: boolean;
  nationalOfferAccepted: boolean;
  nationalNoticePeriod: boolean;
  nationalJoiningDate: boolean;
  nationalPantsSize: boolean;
  nationalTopSize: boolean;
  nationalShoesSize: boolean;
  nationalContractReleased: boolean;
  nationalContractAccepted: boolean;
  nationalBgvPayslip: boolean;
  nationalBgvBankStatement: boolean;
  nationalBgvVerified: boolean;
}

// Default reset shape — single source of truth
const DEFAULT_VALIDATION: ValidationError = {
  comments: false,
  acknowledgement: false,
  uploadDocs: false,
  workPermit: false,
  selectedFile: false,
  showConsentErrors: false,
  showCoiErrors: false,
  uploadError: false,
  verification: false,
  nationalOfferReleased: false,
  nationalOfferAccepted: false,
  nationalNoticePeriod: false,
  nationalJoiningDate: false,
  nationalPantsSize: false,
  nationalTopSize: false,
  nationalShoesSize: false,
  nationalContractReleased: false,
  nationalContractAccepted: false,
  nationalBgvPayslip: false,
  nationalBgvBankStatement: false,
  nationalBgvVerified: false,
};

export interface DrawerStateManager {
  // Consent
  consentVerification: VerificationStatus;
  consentFile: ConsentFormFile | null;
  showConsentErrors: boolean;
  handleConsentVerification: (value: VerificationStatus) => void;
  handleConsentFile: (value: ConsentFormFile | null) => void;
  handleConsentErrors: (value: boolean) => void;

  // Comments & acknowledgement
  reviewerComments: string;
  acknowledgementCheckbox: boolean;
  onCommentsChange: (value: string) => void;
  onToggleAcknowledgement: (value: boolean) => void;

  // COI
  coiState: COIFormState;
  showCoiErrors: boolean;
  handleCoiChange: (value: COIState) => void;
  handleCoiErrors: (value: boolean) => void;

  // Work permit file
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedFile: IDocFiles | null;
  isReading: boolean;
  hasFileError: boolean;
  setHasFileError: (val: boolean) => void;
  handleUploadClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;

  // Upload docs
  uploadDocs: UploadedFile[];
  handleDocumnetUpload: (value: UploadedFile[]) => void;

  // Validation
  validationError: ValidationError;
  validateAll: (vis: ReviewVisibilityFlags) => boolean;

  // National Offer Release & PPE
  nationalOfferReleased: string;
  // nationalOfferAccepted: string;
  nationalNoticePeriod: string;
  nationalJoiningDate: string;
  nationalPantsSize: string;
  nationalTopSize: string;
  nationalShoesSize: string;
  nationalContractReleased: string;
  // nationalContractAccepted: string;
  setNationalOfferReleased: (val: string) => void;
  // setNationalOfferAccepted: (val: string) => void;
  setNationalNoticePeriod: (val: string) => void;
  setNationalJoiningDate: (val: string) => void;
  setNationalPantsSize: (val: string) => void;
  setNationalTopSize: (val: string) => void;
  setNationalShoesSize: (val: string) => void;
  setNationalContractReleased: (val: string) => void;
  // setNationalContractAccepted: (val: string) => void;
  nationalBgvPayslipChecked: string;
  nationalBgvBankStatementChecked: string;
  nationalBgvVerifiedByHR: boolean;
  setNationalBgvPayslipChecked: (val: string) => void;
  setNationalBgvBankStatementChecked: (val: string) => void;
  setNationalBgvVerifiedByHR: (val: boolean) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useStateOfferRelease = (): DrawerStateManager => {
  // ── Consent ──
  const [consentVerification, setConsentVerification] =
    useState<VerificationStatus>(null);
  const [consentFile, setConsentFile] = useState<ConsentFormFile | null>(null);
  const [showConsentErrors, setShowConsentErrors] = useState(false);

  // ── Comments & acknowledgement ──
  const [reviewerComments, setReviewerComments] = useState("");
  const [acknowledgementCheckbox, setAcknowledgementCheckbox] = useState(false);

  // ── COI ──
  const [coiState, setCoiState] = useState<COIFormState>({
    consultedWith: "",
    comments: "",
    attachment: [],
    wishesToProceed: "",
  });
  const [showCoiErrors, setShowCoiErrors] = useState(false);

  // ── Work permit file ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<IDocFiles | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [hasFileError, setHasFileError] = useState(false);

  // ── Upload docs ──
  const [uploadDocs, setUploadDocs] = useState<UploadedFile[]>([]);

  // ── National Offer Release & PPE ──
  const [nationalOfferReleased, setNationalOfferReleased] = useState<string>("");
  // const [nationalOfferAccepted, setNationalOfferAccepted] = useState<string>("");
  const [nationalNoticePeriod, setNationalNoticePeriod] = useState<string>("");
  const [nationalJoiningDate, setNationalJoiningDate] = useState<string>("");
  const [nationalPantsSize, setNationalPantsSize] = useState<string>("");
  const [nationalTopSize, setNationalTopSize] = useState<string>("");
  const [nationalShoesSize, setNationalShoesSize] = useState<string>("");
  const [nationalContractReleased, setNationalContractReleased] = useState<string>("");
  // const [nationalContractAccepted, setNationalContractAccepted] = useState<string>("");
  const [nationalBgvPayslipChecked, setNationalBgvPayslipChecked] = useState<string>("");
  const [nationalBgvBankStatementChecked, setNationalBgvBankStatementChecked] = useState<string>("");
  const [nationalBgvVerifiedByHR, setNationalBgvVerifiedByHR] = useState<boolean>(false);

  // ── Validation error state ──
  const [validationError, setValidationError] =
    useState<ValidationError>(DEFAULT_VALIDATION);

  // ─── Consent handlers ─────────────────────────────────────────────────────

  const handleConsentVerification = useCallback(
    (value: VerificationStatus) => setConsentVerification(value),
    [],
  );

  const handleConsentFile = useCallback((value: ConsentFormFile | null) => {
    setConsentFile(value);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      showConsentErrors: false,
    }));
  }, []);

  const handleConsentErrors = useCallback(
    (value: boolean) => setShowConsentErrors(value),
    [],
  );

  // ─── Comments & acknowledgement handlers ──────────────────────────────────

  const onCommentsChange = useCallback((value: string) => {
    setReviewerComments(value);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      comments: false,
    }));
  }, []);

  const onToggleAcknowledgement = useCallback((value: boolean) => {
    setAcknowledgementCheckbox(value);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      acknowledgement: false,
    }));
  }, []);

  // ─── COI handlers ─────────────────────────────────────────────────────────

  const handleCoiChange = useCallback(
    (state: COIState) => setCoiState(state as COIFormState),
    [],
  );

  const handleCoiErrors = useCallback(
    (show: boolean) => setShowCoiErrors(show),
    [],
  );

  // ─── National Offer Release & PPE handlers ───────────────────────────────

  const handleOfferReleasedChange = useCallback((val: string) => {
    setNationalOfferReleased(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalOfferReleased: false,
    }));
  }, []);

  // const handleOfferAcceptedChange = useCallback((val: string) => {
  //   setNationalOfferAccepted(val);
  //   setValidationError((prev: ValidationError) => ({
  //     ...prev,
  //     nationalOfferAccepted: false,
  //   }));
  // }, []);

  const handleNoticePeriodChange = useCallback((val: string) => {
    setNationalNoticePeriod(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalNoticePeriod: false,
    }));
    setNationalJoiningDate((current) => {
      if (!current) return "";
      const today = new Date();
      const days = parseInt(val, 10);
      if (!isNaN(days) && days > 0) {
        today.setDate(today.getDate() + days);
      }
      const selected = new Date(current);
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        return "";
      }
      return current;
    });
  }, []);

  const handleJoiningDateChange = useCallback((val: string) => {
    setNationalJoiningDate(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalJoiningDate: false,
    }));
  }, []);

  const handlePantsSizeChange = useCallback((val: string) => {
    setNationalPantsSize(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalPantsSize: false,
    }));
  }, []);

  const handleTopSizeChange = useCallback((val: string) => {
    setNationalTopSize(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalTopSize: false,
    }));
  }, []);

  const handleShoesSizeChange = useCallback((val: string) => {
    setNationalShoesSize(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalShoesSize: false,
    }));
  }, []);

  const handleContractReleasedChange = useCallback((val: string) => {
    setNationalContractReleased(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalContractReleased: false,
    }));
  }, []);

  // const handleContractAcceptedChange = useCallback((val: string) => {
  //   setNationalContractAccepted(val);
  //   setValidationError((prev: ValidationError) => ({
  //     ...prev,
  //     nationalContractAccepted: false,
  //   }));
  // }, []);

  // ─── National BGV Checklist Handlers ─────────────────────────────────────
  const handleBgvPayslipChange = useCallback((val: string) => {
    setNationalBgvPayslipChecked(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalBgvPayslip: false,
    }));
  }, []);

  const handleBgvBankStatementChange = useCallback((val: string) => {
    setNationalBgvBankStatementChecked(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalBgvBankStatement: false,
    }));
  }, []);

  const handleBgvVerifiedChange = useCallback((val: boolean) => {
    setNationalBgvVerifiedByHR(val);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      nationalBgvVerified: false,
    }));
  }, []);

  // ─── Work permit file handlers ────────────────────────────────────────────

  const handleUploadClick = useCallback(
    () => fileInputRef.current?.click(),
    [],
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const file = target.files?.[0];

      if (!file) return;

      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.readAsDataURL(file);

          reader.onload = () => {
            resolve(reader.result as string);
          };

          reader.onerror = (error) => reject(error);
        });

      try {
        const base64 = await toBase64(file);

        const docs: IDocFiles[] = [
          {
            name: file.name,
            content: base64, // ✅ FIXED
            type: "New", // ✅ FIXED
          },
        ];

        if (!file) return;

        setIsReading(true);
        setHasFileError(false);

        setTimeout(() => {
          setSelectedFile(docs[0]);
          setIsReading(false);
        }, 500);
      } catch (error) {
        console.error("File conversion error:", error);
      }

      target.value = "";
    },
    [],
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setHasFileError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ─── Upload docs handler ──────────────────────────────────────────────────

  const handleDocumnetUpload = useCallback((value: UploadedFile[]) => {
    setUploadDocs(value);
    setValidationError((prev: ValidationError) => ({
      ...prev,
      uploadDocs: false,
    }));
  }, []);

  // ─── validateAll ─────────────────────────────────────────────────────────
  //
  // Accepts `vis` (ReviewVisibilityFlags) so it only validates what is
  // actually visible on screen for the current workflow status.
  // Returns true when every visible section is valid.

  const validateAll = useCallback(
    (vis: ReviewVisibilityFlags): boolean => {
      const errors: ValidationError = { ...DEFAULT_VALIDATION };
      let isValid = true;

      // ── National Candidate Offer Release Sizing ──
      if (vis.NationalOffer) {
        if (!nationalOfferReleased) {
          errors.nationalOfferReleased = true;
          isValid = false;
        }
        if (nationalOfferReleased === "Yes") {
          // if (!nationalOfferAccepted) {
          //   errors.nationalOfferAccepted = true;
          //   isValid = false;
          // }
           if (!nationalNoticePeriod.trim()) {
              errors.nationalNoticePeriod = true;
              isValid = false;
            }
            if (!nationalJoiningDate) {
              errors.nationalJoiningDate = true;
              isValid = false;
            } else {
              const today = new Date();
              const days = parseInt(nationalNoticePeriod, 10);
              if (!isNaN(days) && days > 0) {
                today.setDate(today.getDate() + days);
              }
              const selected = new Date(nationalJoiningDate);
              today.setHours(0, 0, 0, 0);
              selected.setHours(0, 0, 0, 0);
              if (selected < today) {
                errors.nationalJoiningDate = true;
                isValid = false;
              }
            }
            if (!nationalPantsSize) {
              errors.nationalPantsSize = true;
              isValid = false;
            }
            if (!nationalTopSize) {
              errors.nationalTopSize = true;
              isValid = false;
            }
            if (!nationalShoesSize) {
              errors.nationalShoesSize = true;
              isValid = false;
            }
          // if (nationalOfferAccepted === "Yes") {
           
          // }
        }
      }

      if(vis.NationalEmploymentContract) {
  if (!nationalContractReleased) {
          errors.nationalContractReleased = true;
          isValid = false;
        }
        // if (nationalContractReleased === "Yes") {
        //   if (!nationalContractAccepted) {
        //     errors.nationalContractAccepted = true;
        //     isValid = false;
        //   }
        // }
      }

      // ── National BGV Process Card Validation ──
      if (vis.NaionalBGVProcess) {
        if (!nationalBgvPayslipChecked) {
          errors.nationalBgvPayslip = true;
          isValid = false;
        }
        if (!nationalBgvBankStatementChecked) {
          errors.nationalBgvBankStatement = true;
          isValid = false;
        }
        // if (!nationalBgvVerifiedByHR) {
        //   errors.nationalBgvVerified = true;
        //   isValid = false;
        // }
      }

      if (vis.showVerificationToggle && consentVerification === null) {
        errors.verification = true;
        isValid = false;
      }
      if (vis.showConsentForm && !consentFile) {
        errors.showConsentErrors = true;
        isValid = false;
      }

      const hasCoiDiscrepancy = vis.NaionalBGVProcess && (nationalBgvPayslipChecked === "No" || nationalBgvBankStatementChecked === "No");

      if (vis.showCOICard || hasCoiDiscrepancy) {
        const coiInvalid =
          !coiState.consultedWith.trim() ||
          !coiState.comments.trim() ||
          !coiState.wishesToProceed;
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
        errors.uploadDocs = true;
        errors.uploadError = true;
        isValid = false;
      }

      if (!vis.ViewFlag && !reviewerComments.trim()) {
        errors.comments = true;
        isValid = false;
      }
      if (!vis.ViewFlag && !acknowledgementCheckbox) {
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
      nationalOfferReleased,
      // nationalOfferAccepted,
      nationalNoticePeriod,
      nationalJoiningDate,
      nationalPantsSize,
      nationalTopSize,
      nationalShoesSize,
      nationalContractReleased,
      // nationalContractAccepted,
      nationalBgvPayslipChecked,
      nationalBgvBankStatementChecked,
      nationalBgvVerifiedByHR,
    ],
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

    // National Offer Release & PPE
    nationalOfferReleased,
    // nationalOfferAccepted,
    nationalNoticePeriod,
    nationalJoiningDate,
    nationalPantsSize,
    nationalTopSize,
    nationalShoesSize,
    nationalContractReleased,
    // nationalContractAccepted,
    setNationalOfferReleased: handleOfferReleasedChange,
    // setNationalOfferAccepted: handleOfferAcceptedChange,
    setNationalNoticePeriod: handleNoticePeriodChange,
    setNationalJoiningDate: handleJoiningDateChange,
    setNationalPantsSize: handlePantsSizeChange,
    setNationalTopSize: handleTopSizeChange,
    setNationalShoesSize: handleShoesSizeChange,
    setNationalContractReleased: handleContractReleasedChange,
    // setNationalContractAccepted: handleContractAcceptedChange,
    nationalBgvPayslipChecked,
    nationalBgvBankStatementChecked,
    nationalBgvVerifiedByHR,
    setNationalBgvPayslipChecked: handleBgvPayslipChange,
    setNationalBgvBankStatementChecked: handleBgvBankStatementChange,
    setNationalBgvVerifiedByHR: handleBgvVerifiedChange,
  };
};
