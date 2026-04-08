import { useCallback } from "react";
import {
  ListNames,
  StatusId,
  WorkflowAction,
} from "../../../../../../utilities/Config";
import SPServices from "../../../../../../services/SPService/spservice";
import { RecruitmentServices } from "../../../../../../services/ServiceExport";
import { useUIState } from "../../../../../RecrutimentApp/UIStateContext";
import { WorkflowConfig } from "../../../../../Hooks/WorkflowConfig";

export const useUpdateMainRecord = (form: any, currentRoleID: number) => {
  const { MatricID } = useUIState();
  const updateMainRecord = useCallback(
    async (extraData: Record<string, any> = {}) => {
      let StatusID = WorkflowConfig(form.StatusId);
      const payload = {
        StatusId: StatusID,
        //  ActionId: WorkflowAction.Approved,
        // ItemCreated: "Yes",
        ...extraData,
      };

      const tasks: Promise<any>[] = [
        SPServices.SPUpdateItem({
          Listname: ListNames.HRMSRecruitmentDptDetails,
          RequestJSON: payload,
          ID: form?.ID,
        }),
      ];

      if (form?.reviewerComments) {
        tasks.push(
          RecruitmentServices.PostCommentsData({
            RoleId: currentRoleID,
            RecruitmentIDId: form?.ID,
            Comments: form?.reviewerComments,
          }),
        );
      }

      return Promise.all(tasks);
    },
    [form, currentRoleID],
  );

  return { updateMainRecord };
};
