import { useCallback } from "react";
import { useUpdateMainRecord } from "./useUpdateMainRecord";
import { CommonServices, RecruitmentServices } from "../../../../../../services/ServiceExport";
import { DocumentLibraray, ListNames } from "../../../../../../utilities/Config";
import { ResponeStatus } from "../../../../../../utilities/ApiConfig";
import { IDptData } from "../../../../../../services/RecruitmentTable/IRecruitmentService";
import { IDocFiles } from "../../../../../../services/SPService/Ispservice";

const serialize = (arr: any[], mapFn: (item: any) => object) =>
  arr && arr.length > 0 ? JSON.stringify(arr.map(mapFn)) : "[]";

export const useHRProcess = (form: IDptData, currentRoleID: number, docs:IDocFiles[]) => {
  const { updateMainRecord } = useUpdateMainRecord(form, currentRoleID);

  const handleHRProcess = useCallback(
    async (finalize: (msg: string, type?: string) => void) => {

      // const advData = {
      //   Qualification: serialize(
      //     qualificationValue.MinQualification,
      //     (i) => ({ MinQualification: String(i.key) })
      //   ),
      //   PreferredQualification: serialize(
      //     qualificationValue.PrefeQualification,
      //     (i) => ({ PrefeQualification: String(i.key) })
      //   ),
      //   RoleSpecificKnowledgeJson: serialize(roleSpeKnowledgeValue, (i) => ({
      //     RoleSpeKnowledge: String(i.RoleSpeKnowledge.key),
      //     RequiredLevel: String(i.RequiredLevel.key),
      //   })),
      //   TechnicalSkillsKnowledgeJson: serialize(technicalSkillValue, (i) => ({
      //     TechnicalSkills: String(i.TechnicalSkills.key),
      //     LevelProficiency: String(i.LevelProficiency.key),
      //   })),
      //   JobDescription: advDetails.JobDescription,
      //   RoleProfile: advDetails.RolePurpose,
      //   JobCodeId: formState.JobCodeId,
      //   TotalPreferredExperienceId: Number(advDetails.TotalExperience.key),
      //   PreferredExperienceId: Number(advDetails.ExperienceinMiningIndustry.key),
      //   FunctionTypeId: advDetails.JobFunctionalType.key,
      //   JobTitleofFunctionalManagerId: advDetails.JobTitleofFunctionalManager.key,
      //   JobTitleofLMorSupervisorId: advDetails.JobTitleofLineManagerSupervisor.key,
      //   FunctionalManagerName: advDetails.FunctionalManagerName?.text || "",
      //   LineManagerorSupervisorName: advDetails.LineManagerSupervisorName?.text || "",
      //   JobDescriptionFrench: advDetails.JobDescription_fr,
      //   RoleProfileFrench: advDetails.RolePurpose_fr,
      // };

      // if (!advDetails.JobcodeChecked) {
      //   const roleRes = await CommonServices.PostCommanDataInsert(
      //     advData,
      //     ListNames.HRMSRecruitmentRoleProfileDetails
      //   );
      //   if (roleRes?.status !== ResponeStatus.SUCCESS)
      //     throw new Error("Role Profile Error");
      // }

      const filterConditions = [
        {
          FilterKey: "JobCode",
          Operator: "eq",
          FilterValue: form.JobCodeId,
        },
      ];
      const Conditions = "";
      const IsActive = 0
      const IsExtened = 0
      const portalRes = await RecruitmentServices.UploadAdvertisementInPortal(
        filterConditions,
        Conditions,
        form,
        IsActive,
        IsExtened
      );
      if (portalRes.status !== ResponeStatus.SUCCESS)
        throw new Error("Portal Error");

      await Promise.all([
        updateMainRecord(),
        CommonServices.uploadAttachmentToLibrary(
          form.JobCode,
          docs || [],
          DocumentLibraray.RecruitmentAdvertisementDocument
        ),
      ]);

    //   finalize(
    //     formState?.AdvertisementDocument?.length === 0
    //       ? RecuritmentHRMsg.AdvertisementSubmitMsg
    //       : RecuritmentHRMsg.AdvertisementReveiwMsg
    //   );
       finalize("Advertisment Successfully Added")
    },
    [form, updateMainRecord]
  );

  return { handleHRProcess };
};