import { useEffect, useState } from "react";
import { RecruitmentTabKey, TabItem } from "../RecruitmentTable.types";
import { useMenuData } from "../../../../utilities/hooks/MenuDataContext";
import { TabDetails } from "../../../../models/master";
import { useStateHooks } from "../../../RecrutimentApp/useStateHooks";

export interface UseTabDetailsResult {
  tabs: TabItem[];
  loading: boolean;
  error?: string;
}

const mockTabs: TabItem[] = [
  {
    key: "mySubmission",
    label: "My Submission",
    description: "Requests submitted by you",
    tableMode: "normal",
    actionMode: "view",
  },
  {
    key: "assignRecruitmentHR",
    label: "Assign Recruitment HR",
    description: "Assign an HR partner to vacancies",
    tableMode: "checkbox",
    actionMode: "view",
  },
  {
    key: "uploadOnemDoc",
    label: "Upload ONEM Doc",
    description: "Attach ONEM documentation",
    tableMode: "normal",
    actionMode: "upload",
  },
];

const getTabDetails = (items: any[] | undefined): TabDetails[] =>
  items?.map((item: any, index: number) => ({
    ...item,
    Value: `tab${index + 1}`,
  })) ?? [];

export const useTabDetails = (): UseTabDetailsResult => {
  const { menuData } = useMenuData();
  const { activeMenuID } = useStateHooks();
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {         
      if (!isMounted) return;

      const selectedTabDetails = menuData?.reduce(
        (acc: TabDetails[], menu: any) => {
          const match = menu.SubMenu
            ? menu.Children?.find((child: any) => child?.Id === activeMenuID)
            : menu.TabDetails?.find((tab: any) => tab?.Id === activeMenuID);

          if (match) acc.push(...getTabDetails(match.TabDetails));
          return acc;
        },
        [],
      ) ?? [];

      console.log(selectedTabDetails);

      setTabs(mockTabs);
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