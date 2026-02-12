import { Choices, RoleID, StatusId, TabName, workflowStatusApi } from "../../utilities/Config";

export const getBaseFilters = () => ([
  { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.ReadyforRecruitmentProcess },
  { FilterKey: "IsDataSyncToRecruitment", Operator: "eq", FilterValue: Choices.Yes },
  { FilterKey: "ItemCreated", Operator: "eq", FilterValue: Choices.No },
]);

export const getRecruitmentFiltersByTab = (props: any, tab: string) => {
  const filters: any[] = [];
  let jobAppliedFilter: string[] = [];

  const userEmail = props.userDetails[0]?.EmailId;

  switch (tab) {
    case TabName.UploadONEMDoc:
      filters.push({ FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithHRLeadtouploadONEMsigneddoc });
      break;

    case TabName.UploadAdvertisement:
      filters.push(
        { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithRecruitmentHRtouploadAdv },
        { FilterKey: "AssignedHR", Operator: "eq", FilterValue: userEmail }
      );
      break;

    case TabName.AssignAgencies:
      filters.push(
        { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.RecruitmentInProgress },
        { FilterKey: "AssignedHR", Operator: "eq", FilterValue: userEmail }
      );
      break;

    case TabName.ReviewProfile:
      filters.push(
        { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.RecruitmentInProgress },
        { FilterKey: "LineManager", Operator: "eq", FilterValue: userEmail }
      );
      jobAppliedFilter = [
        workflowStatusApi.LineManagerL1Pending,
        workflowStatusApi.LineManagerL2Pending,
        workflowStatusApi.LineManagerLevel1OnHold,
        workflowStatusApi.LineManagerLevel2OnHold,
      ];
      break;

    case TabName.ReviewJobAdvertisement:
      if (props.CurrentRoleID.includes(RoleID.LineManager)) {
        filters.push(
          { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithLineManagereviewAdv },
          { FilterKey: "LineManager", Operator: "eq", FilterValue: userEmail }
        );
      } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
        filters.push(
          { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithHODtoreviewAdv },
          { FilterKey: "HOD", Operator: "eq", FilterValue: userEmail }
        );
      }
      break;
  }

  filters.push({ FilterKey: "ItemCreated", Operator: "eq", FilterValue: Choices.No });

  return { filters, jobAppliedFilter };
};
