// hooks/useRequiredDocuments.ts
import { useState, useEffect, useCallback } from "react";
import {
  GetBGVDocument,
  GetCandidateDocument,
} from "../../../../../services/OfferRelease/IOfferService";
import {
  CategoryID,
  DisplayFolderName,
  DocumentFolderName,
} from "../../../../../utilities/ConditionConfig";
import { DocumentLibraray } from "../../../../../utilities/Config";
import {
  masterService,
  OfferServices,
} from "../../../../../services/ServiceExport";

export type DocumentIcon =
  | "fingerprint"
  | "offer-letter"
  | "work-permit"
  | "contract"
  | "vaccination"
  | "police"
  | "payment"
  | "generic";

export interface CandidateDocument {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeMB: string;
  uploadedDate: string;
  downloadUrl: string;
  timeModified: string;
}

export interface DocumentCategory {
  categoryId: string;
  categoryName: string;
  icon: DocumentIcon;
  accentColor: string;
  documents: CandidateDocument[];
}

export interface CandidateDocumentsData {
  candidateId: string;
  totalFiles: number;
  categories: DocumentCategory[];
}

interface CategoryConfig {
  categoryId: string;
  categoryName: string;
  icon: DocumentIcon;
  accentColor: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  [DisplayFolderName.BackgroundVerification]: {
    categoryId: "background-verification",
    categoryName: "Background Verification",
    icon: "fingerprint",
    accentColor: "#3B82F6",
  },
  [DisplayFolderName.Offerletter]: {
    categoryId: "offer-letter-signed",
    categoryName: "Offer Letters (Signed)",
    icon: "offer-letter",
    accentColor: "#10B981",
  },
  [DisplayFolderName.LabourHireOffer]: {
    categoryId: "offer-letter-unsigned",
    categoryName: "Offer Letters (Unsigned)",
    icon: "offer-letter",
    accentColor: "#34D399",
  },
  [DisplayFolderName.PoliceClearanceCertificate]: {
    categoryId: "police-clearance",
    categoryName: "Police Clearance Certificate",
    icon: "police",
    accentColor: "#6366F1",
  },
  [DisplayFolderName.CovidVaccinationCertificate]: {
    categoryId: "covid-vaccination",
    categoryName: "Covid Vaccination Certificate",
    icon: "vaccination",
    accentColor: "#14B8A6",
  },
  [DisplayFolderName.YellowFeverVaccinationCertificate]: {
    categoryId: "yellow-fever-vaccination",
    categoryName: "Yellow Fever Vaccination Certificate",
    icon: "vaccination",
    accentColor: "#EAB308",
  },
  [DisplayFolderName.LabourHireEC]: {
    categoryId: "employment-contract-unsigned",
    categoryName: "Employment Contract (Unsigned)",
    icon: "contract",
    accentColor: "#A78BFA",
  },
  EmploymentContractSigned: {
    categoryId: "employment-contract-signed",
    categoryName: "Employment Contract (Signed)",
    icon: "contract",
    accentColor: "#8B5CF6",
  },
  [DisplayFolderName.WorkPermitDocument]: {
    categoryId: "work-permit",
    categoryName: "Work Permit Documents",
    icon: "work-permit",
    accentColor: "#F97316",
  },
  [DisplayFolderName.PaymentBill]: {
    categoryId: "payment-bill",
    categoryName: "Payment Bill",
    icon: "payment",
    accentColor: "#EC4899",
  },
   [DisplayFolderName.BankStatement]: {
    categoryId: "bank-statement",
    categoryName: "Bank Statement",
    icon: "contract",
    accentColor: "#EC4899",
  },
   [DisplayFolderName.Payroll]: {
    categoryId: "payment-bill",
    categoryName: "Payment Bill",
    icon: "vaccination",
    accentColor: "#EC4899",
  },
};

function mapSPFile(file: any, index: number): CandidateDocument {
  const bytes: number =
    file?.Length ?? file?.length ?? file?.FileSizeBytes ?? 0;
  const mb = bytes > 0 ? (bytes / (1024 * 1024)).toFixed(1) : "—";
  const modified: string =
    file?.TimeLastModified ?? file?.Modified ?? file?.Created ?? "";
  const dateStr = modified ? modified.split("T")[0] : "—";

  return {
    id: file.id,
    fileName: file.name ?? `document-${index + 1}`,
    fileSizeBytes: file.fileSizeBytes,
    fileSizeMB: file.fileSizeMB,
    uploadedDate: file.uploadedDate,
    downloadUrl: file.downloadUrl,
    timeModified: file.timeModified,
  };
}

function buildCategory(
  titleKey: string,
  rawData: any,
  isBGV = false,
): DocumentCategory | null {
  const config = CATEGORY_CONFIG[titleKey];
  if (!config) return null;
  const files: any[] = isBGV
    ? (rawData ?? []).flatMap(([, fileArr]: [string, any[]]) =>
        Array.isArray(fileArr) ? fileArr : [],
      )
    : Array.isArray(rawData)
      ? rawData
      : [];

  if (files.length === 0) return null;

  const documents: CandidateDocument[] = files
    .map(mapSPFile)
    .sort(
      (a, b) =>
        new Date(b.timeModified).getTime() - new Date(a.timeModified).getTime(),
    );

  return { ...config, documents };
}

async function fetchAllDocuments(
  ProfileID: string,
  jobRequestID: string,
): Promise<CandidateDocumentsData> {
  const vtRes = await masterService.GetAllMaster(CategoryID.VerificationType);
  const existingVT = vtRes.data ?? [];
  const lastId = existingVT[existingVT.length - 1]?.id ?? 0;
  const verificationTypes = [
    ...existingVT,
    {
      id: lastId + 1,
      value: "ConsentForm",
      displayText: "Consent Form",
      displayTextFr: "",
    },
  ];
  const verificationCodes: string[] = verificationTypes.map((v: any) =>
    String(v.value),
  );

  const base = {
    ListName: DocumentLibraray.HRMSCareerPortalCandidateCV,
    ProfileID,
    RequestID: jobRequestID,
  };

  const [
    bgvRes,
    offerSignedRes,
    offerUnsignedRes,
    policeRes,
    covidRes,
    yellowFeverRes,
    ecSignedRes,
    ecUnsignedRes,
    workPermitRes,
    paymentBillRes,
    BankStatement,
    Payroll
  ] = await Promise.all([
    OfferServices.FetchBGVerificationDOcs({
      ...base,
      DocumentType: DocumentFolderName.BackgroundVerification,
      DocumentName: verificationCodes,
      VerificationName: verificationTypes,
    } as GetBGVDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.Offerletter,
      UnsignedDoc: DocumentFolderName.SignedDoc,
    } as GetCandidateDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.Offerletter,
      UnsignedDoc: DocumentFolderName.UnsignedDoc,
    } as GetCandidateDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.PoliceClearanceCertificate,
    } as GetCandidateDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.CovidVaccinationCertificate,
    } as GetCandidateDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.YellowFeverVaccinationCertificate,
    } as GetCandidateDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.EmploymentContractForm,
      UnsignedDoc: DocumentFolderName.SignedDoc,
    } as GetCandidateDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.EmploymentContractForm,
      UnsignedDoc: DocumentFolderName.UnsignedDoc,
    } as GetCandidateDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.WorkPermit,
    } as GetCandidateDocument),

    OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.PaymentBill,
    } as GetCandidateDocument),

     OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.BankStatement,
    } as GetCandidateDocument),

     OfferServices.FetchCandidateDocument({
      ...base,
      DocumentType: DocumentFolderName.Payroll,
    } as GetCandidateDocument),

  ]);

  const rawGroups: [string, any, boolean][] = [
    [DisplayFolderName.BackgroundVerification, bgvRes.data, true],
    [DisplayFolderName.Offerletter, offerSignedRes.data, false],
    [DisplayFolderName.LabourHireOffer, offerUnsignedRes.data, false],
    [DisplayFolderName.PoliceClearanceCertificate, policeRes.data, false],
    [DisplayFolderName.CovidVaccinationCertificate, covidRes.data, false],
    [
      DisplayFolderName.YellowFeverVaccinationCertificate,
      yellowFeverRes.data,
      false,
    ],
    [DisplayFolderName.LabourHireEC, ecUnsignedRes.data, false],
    ["EmploymentContractSigned", ecSignedRes.data, false],
    [DisplayFolderName.WorkPermitDocument, workPermitRes.data, false],
    [DisplayFolderName.PaymentBill, paymentBillRes.data, false],
    [DisplayFolderName.BankStatement, BankStatement.data, false],
    [DisplayFolderName.Payroll, Payroll.data, false]
  ];

  const categories = rawGroups
    .map(([key, data, isBGV]) => buildCategory(key, data, isBGV))
    .filter((cat): cat is DocumentCategory => cat !== null);

  const totalFiles = categories.reduce(
    (sum, cat) => sum + cat.documents.length,
    0,
  );

  return { candidateId: ProfileID, totalFiles, categories };
}

export interface UseRequiredDocumentsResult {
  data: CandidateDocumentsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRequiredDocuments(
  ProfileID: string,
  jobRequestID: string,
): UseRequiredDocumentsResult {
  const [data, setData] = useState<CandidateDocumentsData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!ProfileID || !jobRequestID) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllDocuments(ProfileID, jobRequestID);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }, [ProfileID, jobRequestID]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
