import { useEffect, useMemo, useState } from "react";
import { RecruitmentItem, RecruitmentTabKey } from "../RecruitmentTable.types";

interface UseRecruitmentDetailsResult {
  items: RecruitmentItem[];
  loading: boolean;
  error?: string;
}

const mockRecruitmentItems: RecruitmentItem[] = [
  {
    id: "vac-1",
    jobCode: "MIN-100",
    title: "Senior Mining Engineer - Mining",
    department: "Mining",
    count: 1,
    requestType: "New Position",
    nationality: "Local",
    status: "READY FOR RECRUITMENT",
  },
  {
    id: "vac-2",
    jobCode: "ENG-101",
    title: "Underground Shift Supervisor - Engineering",
    department: "Engineering",
    count: 2,
    requestType: "New Position",
    nationality: "Local",
    status: "READY FOR RECRUITMENT",
  },
  {
    id: "vac-3",
    jobCode: "SHE-102",
    title: "Geotechnical Technician - SHEQ",
    department: "SHEQ",
    count: 3,
    requestType: "New Position",
    nationality: "Local",
    status: "READY FOR RECRUITMENT",
  },
  {
    id: "vac-4",
    jobCode: "PRO-103",
    title: "Mechanical Foreman - Processing",
    department: "Processing",
    count: 4,
    requestType: "New Position",
    nationality: "Local",
    status: "READY FOR RECRUITMENT",
  },
  {
    id: "vac-5",
    jobCode: "HUM-104",
    title: "Safety Officer - Human Resources",
    department: "Human Resources",
    count: 5,
    requestType: "New Position",
    nationality: "Local",
    status: "READY FOR RECRUITMENT",
  },
  {
    id: "vac-6",
    jobCode: "SUP-105",
    title: "Plant Electrician - Supply Chain",
    department: "Supply Chain",
    count: 1,
    requestType: "New Position",
    nationality: "Local",
    status: "READY FOR RECRUITMENT",
  },
  {
    id: "vac-7",
    jobCode: "ICT-106",
    title: "HR Coordinator - ICT",
    department: "ICT",
    count: 2,
    requestType: "New Position",
    nationality: "Local",
    status: "READY FOR RECRUITMENT",
  },
];

export const useRecruitmentDetails = (tabKey: RecruitmentTabKey): UseRecruitmentDetailsResult => {
  const [items, setItems] = useState<RecruitmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      if (!isMounted) {
        return;
      }

      setItems(mockRecruitmentItems);
      setLoading(false);
    }, 1100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [tabKey]);

  const memoizedItems = useMemo(() => items, [items]);

  return {
    items: memoizedItems,
    loading,
  };
};

export type { UseRecruitmentDetailsResult };
