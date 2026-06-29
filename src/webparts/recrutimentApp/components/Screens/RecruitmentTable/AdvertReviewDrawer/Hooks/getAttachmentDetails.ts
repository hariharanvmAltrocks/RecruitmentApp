import { useEffect, useState, version } from "react";
import { CommonServices } from "../../../../../services/ServiceExport";
import { DocumentLibraray } from "../../../../../utilities/Config";
import { RoleProfileMaster } from "../../../../../models/IDocument";
import { IDocFiles } from "../../../../../services/SPService/Ispservice";

export interface AttachmentVersion {
  lang: "EN" | "FR" | "BI";
  label: string;
  content: any;
}

export interface AttachmentDetails {
  title: string;
  type: "PDF" | "DOC" | "XLS";
  versions: AttachmentVersion[];
}

export interface UseAttachmentDetailsOptions {
  enabled?: boolean;
}

export const useAttachmentDetails = (
  jobId: string,
  options?: UseAttachmentDetailsOptions,
) => {
  const [data, setData] = useState<AttachmentDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!jobId || !enabled) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const [
        RoleProfileDocment,
        GradingDocument,
        AdvertismentDocment,
        OnamSignedStampsDocment,
      ] = await Promise.all([
        CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RoleProfileMaster,
          jobId,
          RoleProfileMaster.RoleProfile,
        ),
        CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RoleProfileMaster,
          jobId,
          RoleProfileMaster.Grading,
        ),
        CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.RecruitmentAdvertisementDocument,
          jobId,
        ),
        CommonServices.GetAttachmentToLibrary(
          DocumentLibraray.ONAMSignedStampDocuments,
          jobId,
        ),
      ]);
      const mappedData: AttachmentDetails[] = [
        ...(RoleProfileDocment.data.English.length > 0 ||
        RoleProfileDocment.data.French.length > 0
          ? [
              {
                title: "Role Profile Document",
                type: "PDF" as const,
                versions: RoleProfileDocment.data.English.map(
                  (d: IDocFiles) => ({
                    lang: "EN",
                    label: d.name,
                    content: d.content,
                  }),
                ).concat(
                  RoleProfileDocment.data.French.map((d: IDocFiles) => ({
                    lang: "FR",
                    label: d.name,
                    content: d.content,
                  })),
                ),
              },
            ]
          : []),
        ...(GradingDocument.data.English.length > 0 ||
        GradingDocument.data.French.length > 0
          ? [
              {
                title: "Grading Document",
                type: "PDF" as const,
                versions: GradingDocument.data.English.map((d: IDocFiles) => ({
                  lang: "EN",
                  label: d.name,
                  content: d.content,
                })).concat(
                  GradingDocument.data.French.map((d: IDocFiles) => ({
                    lang: "FR",
                    label: d.name,
                    content: d.content,
                  })),
                ),
              },
            ]
          : []),
        ...(AdvertismentDocment.data.length > 0
          ? [
              {
                title: "Advertisement Document",
                type: "PDF" as const,
                versions: AdvertismentDocment.data.map((d: IDocFiles) => ({
                  lang: "EN",
                  label: d.name,
                  content: d.content,
                })),
              },
            ]
          : []),
        ...(OnamSignedStampsDocment.data.length > 0
          ? [
              {
                title: "ONAM Signed Stamps",
                type: "PDF" as const,
                versions: OnamSignedStampsDocment.data.map((d: IDocFiles) => ({
                  lang: "EN",
                  label: d.name,
                  content: d.content,
                })),
              },
            ]
          : []),
      ];

      setData(mappedData);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [jobId, enabled]);

  return { data, loading };
};
