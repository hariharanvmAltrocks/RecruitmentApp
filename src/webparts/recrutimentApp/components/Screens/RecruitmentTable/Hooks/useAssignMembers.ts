import { useCallback, useEffect, useMemo, useState } from "react";
import { HrMember } from "../RecruitmentTable.types";
import { CommonServices } from "../../../../services/ServiceExport";
import { ExternalUserType, ListNames, RoleID } from "../../../../utilities/Config";
import { userInfo } from "../../../../utilities/hooks/RoleContext";

interface UseAssignMembersResult {
  members: HrMember[];
  loading: boolean;
  error?: string;
}

export const useAssignMembers = (
  Nationality: string | null
): UseAssignMembersResult => {
  const [members, setMembers] = useState<HrMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  const { roleIDs } = userInfo();

  const isRecruitmentHR = roleIDs.includes(RoleID.RecruitmentHR);

  const fetchAgencyOptions = useCallback(async (nationality: string | null) => {
    if (!nationality) {
      setMembers([]);
      return;
    }

    try {
      const Filter = [
        { FilterKey: "Nationality", Operator: "eq", FilterValue: nationality },
        {
          FilterKey: "UserType",
          Operator: "eq",
          FilterValue: ExternalUserType.Agent,
        },
      ];

      const { data: filteredAgents } = await CommonServices.GetMasterData(
        ListNames.HRMSExternalAgents,
        Filter
      );

      const mappedMembers: HrMember[] =
        filteredAgents?.map((item: any) => ({
          id: item.Id,
          name: item.AgentName,
          role: "Agency",
          initials: item.AgentName
            ?.split(" ")[0]
            ?.slice(0, 2)
            ?.toUpperCase() || "",
        })) ?? [];

      setMembers(mappedMembers);
    } catch (e: any) {
      console.error("Failed to fetch agency options:", e);
      setError("Failed to load agency members");
    }
  }, []);

  useEffect(() => {
    if (isRecruitmentHR) return;

    let isMounted = true;

    const loadHRMembers = async () => {
      setLoading(true);
      setError(undefined);

      try {
        const { data: userRoles } = await CommonServices.GetMasterData(
          ListNames.HRMSRecruitmentUserRole
        );

        const recruitmentHRRole = userRoles?.find(
          (item: any) => item.ID === RoleID.RecruitmentHR
        );

        if (recruitmentHRRole?.ADGroupID) {
          const { status, data } =
            await CommonServices.GetADgruopsEmailIDs(
              recruitmentHRRole.ADGroupID
            );

          if (status === 200 && data && isMounted) {
            const mappedMembers: HrMember[] = data.map((item: any) => ({
              id: item.key,
              name: item.text,
              role: "Recruitment HR",
              initials: item.text
                ?.split(" ")[0]
                ?.slice(0, 2)
                ?.toUpperCase() || "",
            }));

            setMembers(mappedMembers);
          }
        } else {
          throw new Error("Failed to fetch HR group emails.");
        }
      } catch (e: any) {
        console.error(e);
        if (isMounted) setError(e.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHRMembers();

    return () => {
      isMounted = false;
    };
  }, [isRecruitmentHR]);

  useEffect(() => {
    if (!isRecruitmentHR) return;

    let isMounted = true;
    setLoading(true);
    setError(undefined);

    const timer = setTimeout(async () => {
      if (!isMounted) return;

      await fetchAgencyOptions(Nationality);

      if (isMounted) setLoading(false);
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [Nationality, isRecruitmentHR, fetchAgencyOptions]);

  const memoizedMembers = useMemo(() => members, [members]);

  return {
    members: memoizedMembers,
    loading,
    error,
  };
};

export type { UseAssignMembersResult };