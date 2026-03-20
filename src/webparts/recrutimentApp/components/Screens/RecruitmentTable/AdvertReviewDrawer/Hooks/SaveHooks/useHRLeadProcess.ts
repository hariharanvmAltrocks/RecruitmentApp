import { useCallback } from "react";
import { useUpdateMainRecord } from "./useUpdateMainRecord";
import { NationalityCode } from "../../../../../../utilities/ConditionConfig";
import { CommonServices, RecruitmentServices } from "../../../../../../services/ServiceExport";
import SPServices from "../../../../../../services/SPService/spservice";
import { ListNames } from "../../../../../../utilities/Config";
import { ResponeStatus } from "../../../../../../utilities/ApiConfig";
import { AddCalculateDate, SpiltDateOnly } from "../../../../../Hooks/dateConfigfn";
import { IDptData } from "../../../../../../services/RecruitmentTable/IRecruitmentService";
import { IDocFiles } from "../../../../../../services/SPService/Ispservice";
import { CheckboxGroupOption } from "../../../Components/BGVerification/BGVerification";

const serialize = (arr: any[], mapFn: (item: any) => object) =>
  arr && arr.length > 0 ? JSON.stringify(arr.map(mapFn)) : "[]";

export const useHRLeadProcess = (form: IDptData, currentRoleID: number, onemDocs: IDocFiles[], BgvData: CheckboxGroupOption[]) => {
        
  const { updateMainRecord } = useUpdateMainRecord(form, currentRoleID);

  const handleHRLeadProcess = useCallback(
    async (finalize: (msg: string, type?: string) => void) => {

      const filterConditions = [
        {
          FilterKey: "JobCode",
          Operator: "eq",
          FilterValue: form.JobCodeId,
        },
      ];
      const Conditions = "";

       const IsActive = 1
      const IsExtened = 0

      const JobBasedBGVVerification = serialize(
              BgvData,
              (i) => ({ verificationType: i.key, isActive: i.checked })
            )

      const portalRes = await RecruitmentServices.UploadAdvertisementInPortal(
        filterConditions,
        Conditions,
        form,
        IsActive,
        IsExtened,
        JobBasedBGVVerification
      );
      if (portalRes?.status !== 200) throw new Error("Portal Error");

      

      const bgvData = BgvData
        .filter((i: any) => i.checked)
        .map((i: any) => ({
          jobCode: form.JobCode,
          verificationType: i.key,
          department: form?.Dptcode || "",
          nationality: NationalityCode.SouthAfrica,
          isActive: i.checked,
        }));

      const bgvRes = await RecruitmentServices.UpsertBGVJobMaster(bgvData);
      if (bgvRes.status !== ResponeStatus.SUCCESS) throw new Error("BGV Error");
      const todaydate = new Date();
 const vaildFrom = todaydate
        const VaildTo = AddCalculateDate(todaydate, 13)
      await Promise.all([
        updateMainRecord({
          JobPostingStartDate: SpiltDateOnly(vaildFrom),
          JobPostingEndDate: SpiltDateOnly(VaildTo),
        }),
        CommonServices.uploadAttachmentToLibrary(
          form.JobCode,
         onemDocs || [],
          "ONAMSignedStampDocuments"
        ),
      ]);

    //   finalize(RecuritmentHRMsg.ONEMDocumentMsg);
    finalize("Submitted ONEM Document");
    },
    [form, updateMainRecord]
  );

  return { handleHRLeadProcess };
};