import { useCallback, useEffect, useState } from "react";
import { RecruitmentServices } from "../../../../../services/ServiceExport";
import {
  CheckboxGroupOption,
  MandatoryCheck,
} from "../../Components/BGVerification/BGVerification";

export interface AdvertLanguageDetails {
  description: string;
  responsibilities: string[];
  qualifications: string[];
  PrefeQualification: string[];
  experience: string[];
  RoleSpecificKnowledge: string[];
  RequiredLevel: string[];
  TechnicalSkills: string[];
  LevelProficiency: string[];
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

export interface IBGVData {
  checkboxBGVOption: CheckboxGroupOption[];
  checkboxBGV: any[];
  mantoryChecks: MandatoryCheck[];
}

export const useAdvertismentDetails = (
  selectedJobCode: number | null,
  options?: UseAdvertismentDetailsOptions,
) => {
  const [data, setData] = useState<AdvertismentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const enabled = options?.enabled ?? true;

  const [BGVValue, setBGVValue] = useState<IBGVData>({
    checkboxBGVOption: [],
    checkboxBGV: [],
    mantoryChecks: [],
  });

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

  const fetchBVData = async (response: any) => {
    try {
      const res = await RecruitmentServices.GetBGVerificationType();
      let BGVOPtions: CheckboxGroupOption[] = res.data
        .filter((check: any) => !check.isDefault)
        .map((item: any, index: number) => ({
          id: index + 1,
          key: item?.reference,
          description: item?.displayText,
          checked: item?.isDefault,
        }));
      let RoleProfileRes = response.data ?? [];
      const rawVerification = RoleProfileRes?.JobBasedBGVVerification;
      const verificationList = Array.isArray(rawVerification)
        ? rawVerification
        : [];

      const resData = res?.data ?? [];

      const RoleBGV = verificationList.flatMap((item: any, index: number) =>
        resData
          .filter((data: any) => data.reference === item.verificationType)
          .map((data: any) => ({
            id: index + 1,
            key: data.reference,
            description: data.displayText,
            checked: !!item?.isDefault,
          })),
      );

      let mandatoryChecks: MandatoryCheck[] = res.data
        .filter((check: any) => check.isDefault)
        .map((check: any, index: number) => ({
          id: String(index + 1),
          label: check.displayText || "Unnamed Check",
          key: check.reference,
        }));

      setBGVValue((prev) => ({
        ...prev,
        checkboxBGVOption: BGVOPtions,
        checkboxBGV: RoleBGV,
        mantoryChecks: mandatoryChecks,
      }));
      // console.log(res, "res");
    } catch (error) {
      console.error("Error in OpenComments:", error);
    }
  };

  useEffect(() => {
    if (!selectedJobCode || !enabled) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const filterConditions = [
          {
            FilterKey: "JobCode/ID",
            Operator: "eq",
            FilterValue: selectedJobCode,
          },
        ];
        const response =
          await RecruitmentServices.GetHRMSRecruitmentRoleProfileDetails(
            filterConditions,
            "",
          );

        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          const items = response.data[0];
          debugger;

          const mappedData: AdvertismentDetails = {
            jobId: selectedJobCode.toString(),
            english: {
              description: items?.JobDescription || "",
              responsibilities: [items?.RolePurpose],
              qualifications:
                items?.qualificationValue?.MinQualification.map(
                  (q: any) => q.text,
                ) || [],
              PrefeQualification:
                items?.qualificationValue?.PrefeQualification.map(
                  (q: any) => q.text,
                ) || [],
              experience: [
                items?.TotalExperience
                  ? `Total Experience: ${items.TotalExperience.text}`
                  : "",
                items?.ExperienceinMiningIndustry
                  ? `Preferred Experience: ${items.ExperienceinMiningIndustry.text} `
                  : "",
              ].filter(Boolean),
              RoleSpecificKnowledge:
                items?.RoleSpeKnowledgeValue?.map(
                  (k: any) => k.RoleSpeKnowledge.text,
                ) || [],
              RequiredLevel:
                items?.RoleSpeKnowledgeValue?.map(
                  (k: any) => k.RequiredLevel.text,
                ) || [],
              TechnicalSkills:
                items?.TechnicalSkillValue?.map(
                  (t: any) => t.TechnicalSkills.text,
                ) || [],
              LevelProficiency:
                items?.TechnicalSkillValue?.map(
                  (t: any) => t.LevelProficiency.text,
                ) || [],
              JobFunctionalType: items?.JobFunctionalType?.text
                ? [items.JobFunctionalType.text]
                : [],
              JobBasedBGVVerification:
                items?.JobBasedBGVVerification?.map((v: any) => v.text) || [],
            },
            french: {
              description: items?.JobDescription_fr || "",
              responsibilities: [items?.RolePurpose_fr],
              qualifications:
                items?.qualificationValue?.MinQualification_fr.map(
                  (q: any) => q.text,
                ) || [],
              PrefeQualification:
                items?.qualificationValue?.PrefeQualification_fr.map(
                  (q: any) => q.text,
                ) || [],
              experience: [
                items?.TotalExperience
                  ? `expérience totale: ${items?.TotalExperience.text}`
                  : "",
                items?.ExperienceinMiningIndustry
                  ? `expérience Préféré: ${items.ExperienceinMiningIndustry.text}`
                  : "",
              ].filter(Boolean),
              RoleSpecificKnowledge:
                items?.RoleSpeKnowledgeValue?.map(
                  (k: any) => k.RoleSpeKnowledge_fr.text,
                ) || [],
              RequiredLevel:
                items?.RoleSpeKnowledgeValue?.map(
                  (k: any) => k.RequiredLevel_fr.text,
                ) || [],
              TechnicalSkills:
                items?.TechnicalSkillValue?.map(
                  (t: any) => t.TechnicalSkills_fr.text,
                ) || [],
              LevelProficiency:
                items?.TechnicalSkillValue?.map(
                  (t: any) => t.LevelProficiency_fr.text,
                ) || [],
              JobFunctionalType: items?.JobFunctionalType_fr?.text
                ? [items.JobFunctionalType_fr.text]
                : [],
              JobBasedBGVVerification:
                items?.JobBasedBGVVerification?.map((v: any) => v.text) || [],
            },
          };

          setData(mappedData);

          void fetchBVData(response.data);
        }
        void fetchBVData(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }

      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [selectedJobCode, enabled]);

  const handleBvgToggle = useCallback(
    (id: string) => {
      setBGVValue((prev) => ({
        ...prev,
        checkboxBGVOption: prev.checkboxBGVOption.map((check) =>
          String(check.id) === String(id)
            ? { ...check, checked: !check.checked }
            : check,
        ),
      }));
    },
    [BGVValue],
  );

  return { data, BGVValue, loading, handleBvgToggle };
};
