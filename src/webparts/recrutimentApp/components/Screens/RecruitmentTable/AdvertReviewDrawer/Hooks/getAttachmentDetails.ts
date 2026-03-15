import { useEffect, useMemo, useState } from "react";

export interface AttachmentVersion {
  lang: "EN" | "FR" | "BI";
  label: string;
  size: string;
}

export interface AttachmentDetails {
  title: string;
  type: "PDF" | "DOC" | "XLS";
  versions: AttachmentVersion[];
}

export const useAttachmentDetails = (jobId: string | null) => {
  const [data, setData] = useState<AttachmentDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const mockMap = useMemo(() => ({
    "JOB-001": [
      {
        title: "Job Description Document",
        type: "PDF" as const,
        versions: [
          { lang: "EN", label: "English Version", size: "2.4MB" },
          { lang: "FR", label: "French Version", size: "2.2MB" },
        ],
      },
      {
        title: "Safety Compliance Policy",
        type: "PDF" as const,
        versions: [{ lang: "EN", label: "Policy Document", size: "1.1MB" }],
      },
      {
        title: "Role Expectations",
        type: "DOC" as const,
        versions: [
          { lang: "EN", label: "Editable Version", size: "430KB" },
          { lang: "FR", label: "Version FR", size: "415KB" },
        ],
      },
    ],
    "JOB-002": [
      {
        title: "Exploration Overview",
        type: "PDF" as const,
        versions: [{ lang: "EN", label: "Exploration Brief", size: "1.7MB" }],
      },
      {
        title: "Data Collection Sheet",
        type: "XLS" as const,
        versions: [{ lang: "EN", label: "Spreadsheet", size: "920KB" }],
      },
    ],
  }), []);

  useEffect(() => {
    if (!jobId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setData(mockMap[jobId] ?? mockMap["JOB-001"]);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [jobId, mockMap]);

  return { data, loading };
};
