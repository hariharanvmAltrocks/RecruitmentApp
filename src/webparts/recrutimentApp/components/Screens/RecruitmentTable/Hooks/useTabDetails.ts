import { useEffect, useState } from "react";
import { RecruitmentTabKey, TabItem } from "../RecruitmentTable.types";
import { TableMode } from "../RecruitmentTable.types";
import { useMenuData } from "../../../../utilities/hooks/MenuDataContext";
import { TabDetails } from "../../../../models/master";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";
import { RoleID, StatusId } from "../../../../utilities/Config";
import { MatricID, TabNames } from "../../../../utilities/ConditionConfig";
import { findMatricID } from "../../../Hooks/reusehooks";

export interface UseTabDetailsResult {
  tabs: TabItem[];
  loading: boolean;
  error?: string;
}

const getTabDetails = (
  items: any[] | undefined,
  roleIDs: number[],
): TabDetails[] =>
  items?.map((item: any, index: number) => ({
    ...item,
    Value: `tab${index + 1}`,
    MatricID: findMatricID(
      roleIDs,
      Number(item.StatusDetails?.[0]?.StatusId),
      item.TabName,
    ),
  })) ?? [];

export const useTabDetails = (): UseTabDetailsResult => {
  const { menuData } = useMenuData();
  const { activeMenuID } = useUIState();
  const { roleIDs } = useRoleContext();
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      if (!isMounted) return;

      const selectedTabDetails =
        menuData?.reduce((acc: TabDetails[], menu: any) => {
          const match = menu.SubMenu
            ? menu.Children?.find((child: any) => child?.Id === activeMenuID)
            : menu.TabDetails?.find((tab: any) => tab?.Id === activeMenuID);

          if (match) acc.push(...getTabDetails(match.TabDetails, roleIDs));
          return acc;
        }, []) ?? [];

      const normalize = (value: string) =>
        value.replace(/\s+/g, "").toLowerCase();
      const orderedTabDetails = [...selectedTabDetails];
      const mySubmissionIndex = orderedTabDetails.findIndex(
        (tab) => normalize(tab.TabName ?? "") === "mysubmission",
      );
      if (mySubmissionIndex > 0) {
        const [mySubmission] = orderedTabDetails.splice(mySubmissionIndex, 1);
        orderedTabDetails.unshift(mySubmission);
      }

      let HRLead = roleIDs?.includes(RoleID.RecruitmentHRLead);
      let HR = roleIDs?.includes(RoleID.RecruitmentHR);
      const mappedTabs = orderedTabDetails.map((tab) => ({
        key: tab.Value as RecruitmentTabKey,
        label: tab.TabName,
        description: tab.TabName,
        tableMode:
          (HRLead && tab.Value === "tab1") ||
          (tab.TabName != TabNames.AssignInterviewPanel &&
            HR &&
            tab.Value === "tab2")
            ? ("checkbox" as TableMode)
            : ("normal" as TableMode),
        actionMode: (Array.isArray(tab.StatusDetails[0]?.Action)
          ? tab.StatusDetails[0]?.Action[0]
          : tab.StatusDetails[0]
              ?.Action) as import("../RecruitmentTable.types").TableActionMode,
        matricId: tab.MatricID,
      }));

      setTabs(mappedTabs);
      setLoading(false);
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [activeMenuID, menuData]);

  return { tabs, loading };
};

export type { RecruitmentTabKey };
