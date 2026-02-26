import { useState, useEffect, useCallback } from "react";
import { AutoCompleteItem } from "../../../Models/Screens";
import { CommonServices } from "../../../Services/ServiceExport";
import { ListNames, RoleID } from "../../../utilities/Config";
import { ExternalUserType } from "../../../utilities/LabelName";

export const useAssignOptions = () => {
  const [hrOptions, setHrOptions] = useState<AutoCompleteItem[]>([]);
  const [agencyOptions, setAgencyOptions] = useState<AutoCompleteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgencyOptions = useCallback(async (nationality: string | null) => {
    if (!nationality) {
      setAgencyOptions([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      //   const Filter = `Nationality eq '${}' and UserType eq '${ExternalUserType.Agent}'`;
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

      const options: AutoCompleteItem[] =
        filteredAgents?.map((item: any) => ({
          key: item.Id,
          text: item.AgentName,
        })) ?? [];

      setAgencyOptions(options);
    } catch (e: any) {
      console.error(`Failed to fetch agency options for ${nationality}:`, e);
      setError("Could not load agency list.");
      setAgencyOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchStaticHrOptions = async () => {
      try {
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
            setHrOptions(data);
          } else {
            throw new Error(message ?? "Failed to fetch HR group emails.");
          }
        }
      } catch (e: any) {
        console.error("Failed to initialize HR options:", e);
        setError("Could not load HR user list.");
      }
    };

    void fetchStaticHrOptions();
  }, []);

  return { hrOptions, agencyOptions, fetchAgencyOptions, isLoading, error };
};
