import { useCallback, useEffect, useMemo, useState } from "react";
import { HrMember } from "../RecruitmentTable.types";
import { CommonServices } from "../../../../services/ServiceExport";
import { ExternalUserType, ListNames, RoleID } from "../../../../utilities/Config";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { AutoCompleteItem } from "../../../../models/fieldmodels";

interface UseAssignMembersResult {
  members: HrMember[];
  loading: boolean;
  error?: string;
}

// const mockMembers: HrMember[] = [
//   {
//     id: "hr-1",
//     name: "Alex Mwamba",
//     role: "Senior HR Partner",
//     initials: "AM",
//   },
//   {
//     id: "hr-2",
//     name: "Sara Mensah",
//     role: "Recruitment Specialist",
//     initials: "SM",
//   },
//   {
//     id: "hr-3",
//     name: "Rahul Perera",
//     role: "Talent Acquisition",
//     initials: "RP",
//   },
//   {
//     id: "hr-4",
//     name: "Maria Okoro",
//     role: "HR Business Partner",
//     initials: "MO",
//   },
// ];

export const useAssignMembers = (Nationality: string | null): UseAssignMembersResult => {
  const [members, setMembers] = useState<HrMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {roleIDs} = userInfo();

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
        Filter,
      );

      // const options: AutoCompleteItem[] =
      //   filteredAgents?.map((item: any) => ({
      //     key: item.Id,
      //     text: item.AgentName,
      //   })) ?? [];

        const mappedMembers: HrMember[] = filteredAgents.map((item: any) => ({
              id: item.Id,
              name: item.AgentName,
              role: "Agency",
              initials: item.AgentName.split(" ")[0].slice(0, 2).toUpperCase(), 
            }));
            setMembers(mappedMembers);

    } catch (e: any) {
      console.error(`Failed to fetch agency options for ${nationality}:`, e);
    } 
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      if (!isMounted) {
        return;
      }
      if(!roleIDs.includes(RoleID.RecruitmentHR)) {
        const { data: userRoles } = await CommonServices.GetMasterData(
          ListNames.HRMSRecruitmentUserRole,
        );

        const recruitmentHRRole = userRoles?.find(
          (item: any) => item.ID === RoleID.RecruitmentHR,
        );

        if (recruitmentHRRole?.ADGroupID) {
        const { status, data, message } =
            await CommonServices.GetADgruopsEmailIDs(
              recruitmentHRRole.ADGroupID,
            );
          if (status === 200 && data) {
            console.log(data,"datatata");
            
            const mappedMembers: HrMember[] = data.map((item: any) => ({
              id: item.key,
              name: item.text,
              role: "Recruitment HR",
              initials: item.text.split(" ")[0].slice(0, 2).toUpperCase(), 
            }));
            setMembers(mappedMembers);
          }
          } else {
            throw new Error( "Failed to fetch HR group emails.");
          }
      }else {
        void fetchAgencyOptions(Nationality);
      }
       
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
