import { useCallback } from "react";
import { useUpdateMainRecord } from "./useUpdateMainRecord";
import { CommonServices, RecruitmentServices } from "../../../../../../services/ServiceExport";
import { DocumentLibraray, ListNames } from "../../../../../../utilities/Config";
import { ResponeStatus } from "../../../../../../utilities/ApiConfig";
import { IDptData } from "../../../../../../services/RecruitmentTable/IRecruitmentService";
import { IDocFiles } from "../../../../../../services/SPService/Ispservice";
import { RecuritmentHRMsg } from "../../../../../../utilities/ConditionConfig";
import { SubmitAdvert } from "../../Components/CreateAdvert/CreateAdvert";

const serialize = (arr: any[], mapFn: (item: any) => object) =>
  arr && arr.length > 0 ? JSON.stringify(arr.map(mapFn)) : "[]";

export const useHRProcess = (form: IDptData, currentRoleID: number, docs: IDocFiles[],createAdvert: SubmitAdvert | null) => {
  const { updateMainRecord } = useUpdateMainRecord(form, currentRoleID);

  const handleHRProcess = useCallback(
    async (finalize: (msg: string, type?: string) => void) => {

      const filterConditions = [
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: form.JobCodeId,
        },
      ];
      const Conditions = "";
      const IsActive = 0
      const IsExtened = 0
      
      if(createAdvert){
    const advData = {
        Qualification: createAdvert.Qualification,
        PreferredQualification: createAdvert.PreferredQualification,
        RoleSpecificKnowledgeJson: createAdvert.RoleSpecificKnowledgeJson,
        TechnicalSkillsKnowledgeJson:createAdvert.TechnicalSkillsKnowledgeJson,
        JobDescription: createAdvert.JobDescription,
        RoleProfile: createAdvert.RoleProfile,
        JobCodeId: form.JobCodeId,
        TotalPreferredExperienceId: createAdvert.TotalPreferredExperienceId,
        PreferredExperienceId: Number(createAdvert.PreferredExperienceId),
        FunctionTypeId: createAdvert.FunctionTypeId,
        JobTitleofFunctionalManagerId: createAdvert.JobTitleofFunctionalManagerId,
        JobTitleofLMorSupervisorId: createAdvert.JobTitleofLMorSupervisorId,
        FunctionalManagerName: createAdvert.FunctionalManagerName || "",
        LineManagerorSupervisorName: createAdvert.LineManagerorSupervisorName,
        JobDescriptionFrench: createAdvert.JobDescriptionFrench,
        RoleProfileFrench: createAdvert.RoleProfileFrench,
      };
        await RecruitmentServices.PostAdvertisementData(advData);
      }
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
      finalize(RecuritmentHRMsg.AdvertisementSubmitMsg)
    },
    [form, updateMainRecord]
  );

  return { handleHRProcess };
};