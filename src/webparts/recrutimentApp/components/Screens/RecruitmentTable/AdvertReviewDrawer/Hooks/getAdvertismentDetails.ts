import { useEffect, useMemo, useState } from "react";

export interface AdvertLanguageDetails {
  description: string;
  responsibilities: string[];
  qualifications: string[];
  experience: string[];
}

export interface AdvertismentDetails {
  jobId: string;
  english: AdvertLanguageDetails;
  french: AdvertLanguageDetails;
}

const buildEnglish = (): AdvertLanguageDetails => ({
  description: "Lead the mining division to deliver safe, efficient, and sustainable operations aligned with annual production goals.",
  responsibilities: [
    "Own safety compliance and drive a zero-incident culture.",
    "Coordinate production plans with maintenance and geology teams.",
    "Manage contractor performance and cost controls.",
  ],
  qualifications: [
    "Bachelor's degree in Mining Engineering or related field.",
    "Leadership certification in operational safety.",
  ],
  experience: [
    "10+ years in mining operations leadership.",
    "Proven record of managing multidisciplinary teams.",
  ],
});

const buildFrench = (): AdvertLanguageDetails => ({
  description: "Diriger la division minière afin d'assurer des opérations sûres, efficaces et durables alignées sur les objectifs annuels.",
  responsibilities: [
    "Garantir la conformité en matière de sécurité et promouvoir une culture zéro incident.",
    "Coordonner les plans de production avec la maintenance et la géologie.",
    "Suivre la performance des sous-traitants et les coûts.",
  ],
  qualifications: [
    "Licence en ingénierie minière ou domaine connexe.",
    "Certification de leadership en sécurité opérationnelle.",
  ],
  experience: [
    "10+ ans d'expérience en direction des opérations minières.",
    "Expérience confirmée en gestion d'équipes pluridisciplinaires.",
  ],
});

export const useAdvertismentDetails = (jobId: string | null) => {
  const [data, setData] = useState<AdvertismentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mockMap = useMemo(() => ({
    "JOB-001": {
      jobId: "JOB-001",
      english: buildEnglish(),
      french: buildFrench(),
    },
    "JOB-002": {
      jobId: "JOB-002",
      english: {
        ...buildEnglish(),
        description: "Drive exploration programs and interpret geological data for strategic drilling decisions.",
      },
      french: {
        ...buildFrench(),
        description: "Piloter les programmes d'exploration et interpréter les données géologiques pour orienter les forages.",
      },
    },
  }), []);

  useEffect(() => {
    if (!jobId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setData(mockMap[jobId] ?? {
        jobId,
        english: buildEnglish(),
        french: buildFrench(),
      });
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [jobId, mockMap]);

  return { data, loading };
};
