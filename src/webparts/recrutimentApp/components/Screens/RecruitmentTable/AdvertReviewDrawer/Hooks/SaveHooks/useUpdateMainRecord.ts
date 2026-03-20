import { useCallback } from "react";
import { ListNames, WorkflowAction } from "../../../../../../utilities/Config";
import SPServices from "../../../../../../services/SPService/spservice";
import { RecruitmentServices } from "../../../../../../services/ServiceExport";

export const useUpdateMainRecord = (form: any, currentRoleID: number) => {
  const updateMainRecord = useCallback(
    async (extraData: Record<string, any> = {}) => {
      const { formState } = form;

      const payload = {
        ActionId: WorkflowAction.Approved,
        ItemCreated: "Yes",
        ...extraData,
      };

      const tasks: Promise<any>[] = [
        SPServices.SPUpdateItem({
          Listname: ListNames.HRMSRecruitmentDptDetails,
          RequestJSON: payload,
          ID: formState.ID,
        }),
      ];

      if (formState.Comments) {
        tasks.push(
          RecruitmentServices.PostCommentsData({
            RoleId: currentRoleID,
            RecruitmentIDId: formState.ID,
            Comments: formState.Comments,
          })
        );
      }

      return Promise.all(tasks);
    },
    [form,  currentRoleID]
  );

  return { updateMainRecord };
};