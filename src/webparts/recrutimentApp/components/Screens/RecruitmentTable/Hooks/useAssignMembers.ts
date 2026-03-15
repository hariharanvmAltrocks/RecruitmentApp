import { useEffect, useMemo, useState } from "react";
import { HrMember } from "../RecruitmentTable.types";

interface UseAssignMembersResult {
  members: HrMember[];
  loading: boolean;
  error?: string;
}

const mockMembers: HrMember[] = [
  {
    id: "hr-1",
    name: "Alex Mwamba",
    role: "Senior HR Partner",
    initials: "AM",
  },
  {
    id: "hr-2",
    name: "Sara Mensah",
    role: "Recruitment Specialist",
    initials: "SM",
  },
  {
    id: "hr-3",
    name: "Rahul Perera",
    role: "Talent Acquisition",
    initials: "RP",
  },
  {
    id: "hr-4",
    name: "Maria Okoro",
    role: "HR Business Partner",
    initials: "MO",
  },
];

export const useAssignMembers = (): UseAssignMembersResult => {
  const [members, setMembers] = useState<HrMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      if (!isMounted) {
        return;
      }

      setMembers(mockMembers);
      setLoading(false);
    }, 900);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const memoizedMembers = useMemo(() => members, [members]);

  return {
    members: memoizedMembers,
    loading,
  };
};

export type { UseAssignMembersResult };
