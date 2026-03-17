import { useEffect, useState } from "react";
import { RecruitmentServices } from "../../../../../services/ServiceExport";

export interface AdvertLanguageDetails {
  description: string;
  responsibilities: string[];
  qualifications: string[];
  PrefeQualification: string[];
  experience: string[];
  RoleSpecificKnowledge: string[];
  TechnicalSkills: string[];
  JobFunctionalType: string[];
  JobBasedBGVVerification: string[];
}

export interface AdvertismentDetails {
  jobId: string;
  english: AdvertLanguageDetails;
  french: AdvertLanguageDetails;
}

export interface UseAdvertismentDetailsOptions {
  enabled?: boolean;
}

export const useAdvertismentDetails = (selectedJobCode: number | null, options?: UseAdvertismentDetailsOptions) => {
  const [data, setData] = useState<AdvertismentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const enabled = options?.enabled ?? true;

  // const mockMap = useMemo(
  //   () => ({
  //     "JOB-001": {
  //       jobId: "JOB-001",
  //       english: buildEnglish(),
  //       french: buildFrench(),
  //     },
  //     "JOB-002": {
  //       jobId: "JOB-002",
  //       english: {
  //         ...buildEnglish(),
  //         description: "Drive exploration programs and interpret geological data for strategic drilling decisions.",
  //       },
  //       french: {
  //         ...buildFrench(),
  //         description: "Piloter les programmes d'exploration et interprter les donnes gologiques pour orienter les forages.",
  //       },
  //     },
  //   }) as Record<string, AdvertismentDetails>,
  //   []
  // );

  useEffect(() => {
    if (!selectedJobCode || !enabled) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const filterConditions = [{ FilterKey: "JobCode", Operator: "eq", FilterValue: selectedJobCode }];
        const response = await RecruitmentServices.GetHRMSRecruitmentRoleProfileDetails(filterConditions, "");

        if (response.status === 200 && response.data && response.data.length > 0) {
          const items = response.data[0];

          const mappedData: AdvertismentDetails = {
            jobId: selectedJobCode.toString(),
            english: {
              description: items?.JobDescription || "",
              responsibilities: JSON.parse(items?.RoleProfile || "[]") || [],
              qualifications: items?.qualificationValue?.MinQualification.map((q: any) => q.text) || [],
              PrefeQualification: items?.qualificationValue?.PrefeQualification.map((q: any) => q.text) || [],
              experience: [
                items?.YearofExperience ? `${items.YearofExperience} years of experience` : "",
                items?.PreferredExperience ? `Preferred: ${items.PreferredExperience.ExperienceInYearRange} years` : "",
              ].filter(Boolean),
              RoleSpecificKnowledge: items?.RoleSpeKnowledgeValue?.map((k: any) => k.text) || [],
              TechnicalSkills: items?.TechnicalSkillValue?.map((t: any) => t.text) || [],
              JobFunctionalType: items?.JobFunctionalType?.text || "",
              JobBasedBGVVerification: items?.JobBasedBGVVerification?.map((v: any) => v.text) || [],
            },
            french: {
              description: items?.JobDescription_fr || "",
              responsibilities: JSON.parse(items?.RoleProfile || "[]") || [],
              qualifications: items?.qualificationValue?.MinQualification_fr.map((q: any) => q.text) || [],
              PrefeQualification: items?.qualificationValue?.PrefeQualification.map((q: any) => q.text) || [],
              experience: [
                items?.YearofExperience ? `${items.YearofExperience} ans d'expérience` : "",
                items?.PreferredExperience ? `Préféré: ${items.PreferredExperience.ExperienceInYearRange} ans` : "",
              ].filter(Boolean),
              RoleSpecificKnowledge: items?.RoleSpeKnowledgeValue?.map((k: any) => k.text) || [],
              TechnicalSkills: items?.TechnicalSkillValue?.map((t: any) => t.text) || [],
              JobFunctionalType: items?.JobFunctionalType?.text || "",
              JobBasedBGVVerification: items?.JobBasedBGVVerification?.map((v: any) => v.text) || [],
            },
          };

          setData(mappedData);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }

      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [selectedJobCode, enabled]);

  return { data, loading };
};
