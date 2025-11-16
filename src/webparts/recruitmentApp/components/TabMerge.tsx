import * as React from "react";
import { TabDetails } from "../Models/Master";
import { MenuResponse } from "../Models/Menu";
import {
  ActionIcon,
  RoleID,
  RoleName,
  StatusId,
  workflowStatusApi,
} from "../utilities/Config";
import { getVRRDetails } from "../Services/ServiceExport";
import { checklist } from "../Models/Screens";

export function GetAddAction(data: any[]): boolean {
  return data.some((item) => item.ActionId?.includes(ActionIcon.Add));
}

// export function GetStatusIds(array: any[]): string[] {
//   return array.map(item => String(item.StatusId));
// }

export function GetStatusIds(array: any[]): string[] {
  return array
    .filter((item) => item.StatusId !== undefined && item.StatusId !== "")
    .map((item) => String(item.StatusId));
}
export async function GetTabDetailsById(menuID: number, items: MenuResponse[]) {
  const search = (items: any[]) => {
    return (
      items?.reduce((acc: TabDetails[], menu: any) => {
        if (!menu.SubMenu) {
          const match = menu.TabDetails?.find(
            (tab: { Id: number }) => tab?.Id === menuID
          );
          let TabDetails = match?.TabDetails.map((item: any, index: number) => {
            return {
              ...item,
              Value: "tab" + (index + 1),
            };
          });
          if (match) acc.push(TabDetails);
        } else {
          const childMatches = menu.Children?.find(
            (child: any) => child?.Id === menuID
          );
          let TabDetails = childMatches?.TabDetails.map(
            (item: any, index: number) => {
              return {
                ...item,
                Value: "tab" + (index + 1),
              };
            }
          );
          if (childMatches) acc.push(TabDetails);
        }
        return acc;
      }, []) ?? []
    );
  };
  await search(items);
}

export function GetRoleKeysArray(array: any[]): number[] {
  return array.map((role) => Number(role.key));
}

export function GetStatusIdRoles(StatusIds: number) {
  switch (StatusIds) {
    case StatusId.ReadyforRecruitmentProcess:
    case StatusId.PendingwithHRLeadtoAssignRecruitmentHR:
    case StatusId.PendingwithHRLeadtouploadONEMsigneddoc:
      return RoleID.RecruitmentHRLead;
    case StatusId.PendingwithRecruitmentHRtouploadAdv:
      return RoleID.RecruitmentHR;
    case StatusId.PendingwithHODtoreviewAdv:
      return RoleID.HOD;
    case StatusId.PendingwithLineManagereviewAdv:
    case StatusId.PendingwithLMcreateDisqualificationQuestion:
    case StatusId.PendingwithHRandLMtocreateinterviewQuestion:
      return RoleID.LineManager;

    default:
      return null;
  }
}

export function GetWorkflowStatusByID(StatusIds: string) {
  switch (StatusIds) {
    case workflowStatusApi.HRPending:
    case workflowStatusApi.PendingRecruitmentHRscheduleInterview:
      return RoleName.RecruitmentHR;
    case workflowStatusApi.LineManagerL1Pending:
    case workflowStatusApi.LineManagerL2Pending:
    case workflowStatusApi.LineManagerLevel1OnHold:
    case workflowStatusApi.LineManagerLevel2OnHold:
      return RoleName.LineManager;

    default:
      return "";
  }
}

export const tabStyle = (TabName: string, Count: number) => {
  return Count > 0 ? (
    <>
      <span>
        {TabName}{" "}
        <span
          style={{
            color: "red",
            fontWeight: "bold",
            fontFamily: "Segoe UI, Arial, sans-serif",
          }}
        >
          ({Count})
        </span>
      </span>
    </>
  ) : (
    `${TabName} (${0})`
  );
};

export function addWeekdays(date: any, daysToAdd: number) {
  const result = new Date(date);
  let addedDays = 0;

  while (addedDays < daysToAdd) {
    result.setDate(result.getDate() + 1);

    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      addedDays++;
    }
  }

  return result;
}

export async function fetchApiUrl() {
  const siteUrl = await getVRRDetails.GetCareerPortalIntergLink([], "and");
  const ApiUrl = siteUrl?.data;
  return ApiUrl;
}

export const ApiUrl = () => {
  let apiUrl = fetchApiUrl();
  return apiUrl;
};

export const convertToList = (obj: any): checklist[] => {
  return Object.values(obj);
};
