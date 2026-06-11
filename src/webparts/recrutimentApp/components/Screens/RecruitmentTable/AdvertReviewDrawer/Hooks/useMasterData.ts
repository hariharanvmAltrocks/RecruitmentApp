import * as React from "react";
import { useEffect, useState } from "react";
import { masterService, CommonServices } from "../../../../../services/ServiceExport";
import { CategoryID } from "../../../../../utilities/ConditionConfig";
import { ListNames } from "../../../../../utilities/Config";

export interface MasterItem {
  id: number | string;
  value: string;
  displayText: string;
}

export interface UseMasterDataResult {
  totalExperience: MasterItem[];
  // miningExperience: MasterItem[];
  qualifications: MasterItem[];
  technicalSkills: MasterItem[];
  roleSpecificKnowledge: MasterItem[];
  Level: MasterItem[];
  managers: MasterItem[];
  functionalType: MasterItem[];
  jobTitles: MasterItem[];
  loading: boolean;
  error: string | null;
}

interface RawMasterData {
  id?: number | string;
  ID?: number | string;
  value?: string;
  displayText?: string;
  text?: string;
}

interface RawManagerData {
  ID?: number | string;
  EmailId?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  JobTitleInEnglish?: {
    ID: number;
    JobTitleInEnglish: string;
  };
  JopTitleFrench?: string;
  CurrentPosition?: string;
}


export const useMasterData = (): UseMasterDataResult => {
  const [totalExperience, setTotalExperience] = useState<MasterItem[]>([]);
  // const [miningExperience, setMiningExperience] = useState<MasterItem[]>([]);
  const [qualifications, setQualifications] = useState<MasterItem[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<MasterItem[]>([]);
  const [roleSpecificKnowledge, setRoleSpecificKnowledge] = useState<MasterItem[]>([]);
  const [managers, setManagers] = useState<MasterItem[]>([]);
  const [Level ,setLevel] = useState<MasterItem[]>([]);
  const [functionalType, setFunctionalType] = useState<MasterItem[]>([]);
  const [jobTitles, setJobTitles] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Safe promise resolver to prevent unhandled rejection crashes
        const safeFetch = async <T>(promise: Promise<T>): Promise<T | null> => {
          try {
            return await promise;
          } catch (e) {
            console.error("Master data fetch error:", e);
            return null;
          }
        };

        const [
          totalExpRes,
          // miningExpRes,
          qualRes,
          techSkillsRes,
          roleKnowledgeRes,
          managersRes,
          levelres,
          functionalType,
          jobTitleres,
        ] = await Promise.all([
          // safeFetch(masterService.GetAllMaster(CategoryID.Experience)),
          safeFetch(CommonServices.GetMasterData(ListNames.HRMSExperienceMaster)),
          // safeFetch(masterService.GetAllMaster(CategoryID.Experience)),
          safeFetch(masterService.GetAllMaster(CategoryID.Qualification)),
          safeFetch(masterService.GetAllMaster(CategoryID.TechnicalSkills)),
          safeFetch(masterService.GetAllMaster(CategoryID.RoleSpecificKnowledge)),
          safeFetch(CommonServices.GetSageMasterData(ListNames.HRMSSageList)),
          safeFetch(masterService.GetAllMaster(CategoryID.Level)),
          safeFetch(CommonServices.GetMasterData(ListNames.HRMSJobTitleFunctionType)),
          // safeFetch(masterService.GetAllMaster(CategoryID.Function))
          safeFetch(CommonServices.GetMasterData(ListNames.HRMSJobTitleMaster)),
        ]);

        const processResult = (
          res: { status: number; data: RawMasterData[] | null } | null,
          setter: React.Dispatch<React.SetStateAction<MasterItem[]>>
        ) => {
          if (res && res.status === 200 && res.data) {
            const data = res.data;
            if (Array.isArray(data) && data.length > 0) {
              const mapped = data.map((item: RawMasterData) => ({
                id: item.value ?? item.ID ?? item.value ?? "unknown",
                value: item.value ?? item.text ?? "",
                displayText: item.displayText ?? item.text ?? item.value ?? "",
              }));

              const merged = [...mapped];
              // defaultItems.forEach((def) => {
              //   if (!merged.some((m) => m.value.toLowerCase() === def.value.toLowerCase())) {
              //     merged.push(def);
              //   }
              // });
              setter(merged);
              return;
            }
          }
          // setter(merged);
        };

        // processResult(totalExpRes, setTotalExperience);
        // processResult(miningExpRes, setMiningExperience);
        processResult(qualRes, setQualifications);
        processResult(techSkillsRes, setTechnicalSkills);
        processResult(roleKnowledgeRes, setRoleSpecificKnowledge);
        processResult(levelres, setLevel);
        // processResult(functionalType, setFunctionalType);

          if (totalExpRes && totalExpRes.status === 200 && totalExpRes.data) {
          const list = totalExpRes.data;
          if (Array.isArray(list) && list.length > 0) {
            const mappedMgrs: MasterItem[] = list.map((item) => {
              return {
                id: item.ID ?? 0,
                value: String(item.ID),
                displayText: item.ExperienceInYearRange,
              };
            });

            const mergedMgrs = [...mappedMgrs];
            setTotalExperience(mergedMgrs);
          } 
        } 

          if (functionalType && functionalType.status === 200 && functionalType.data) {
          const list = functionalType.data;
          if (Array.isArray(list) && list.length > 0) {
            const mappedMgrs: MasterItem[] = list.map((item) => {
              return {
                id: item.ID ?? 0,
                value: String(item.ID),
                displayText: item.FunctionType,
              };
            });

            const mergedMgrs = [...mappedMgrs];
            setFunctionalType(mergedMgrs);
          } 
        } 

           if (jobTitleres && jobTitleres.status === 200 && jobTitleres.data) {
          const list = jobTitleres.data;
          if (Array.isArray(list) && list.length > 0) {
            const mappedMgrs: MasterItem[] = list.map((item) => {
              return {
                id: item.ID ?? 0,
                value: String(item.ID),
                displayText: item.JobTitleInEnglish,
              };
            });

            const mergedMgrs = [...mappedMgrs];
            setJobTitles(mergedMgrs);
          } 
        } 

        if (managersRes && managersRes.status === 200 && managersRes.data) {
          const list = managersRes.data;
          if (Array.isArray(list) && list.length > 0) {
            const mappedMgrs: MasterItem[] = list.map((item) => {
              const fullName = [item.FirstName, item.MiddleName, item.LastName]
                .filter(Boolean)
                .join(" ");
              return {
                id: item.JobTitleInEnglishId,
                value: String(item.JobTitleInEnglishId),
                displayText: fullName,
              };
            });
            const mergedMgrs = [...mappedMgrs];
            setManagers(mergedMgrs);
          } 
        } 

      } catch (err) {
        console.error("Error fetching master data, using default fallbacks:", err);
        setError("Failed to fetch some master data from the database. Default options loaded.");
      } finally {
        setLoading(false);
      }
    };

    void fetchAllData();
  }, []);

  return {
    totalExperience,
    // miningExperience,
    qualifications,
    technicalSkills,
    roleSpecificKnowledge,
    Level,
    functionalType,
    managers,
    jobTitles,
    loading,
    error,
  };
};
