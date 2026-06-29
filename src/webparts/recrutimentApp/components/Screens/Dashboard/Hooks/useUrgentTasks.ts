import { useState, useEffect, useCallback } from "react";
import { DashboardServices } from "../../../../services/ServiceExport";
import { useRoleContext } from "../../../../utilities/hooks/RoleContext";
import { RoleID } from "../../../../utilities/Config";
import { ListEmailName } from "../../../../utilities/ConditionConfig";
import { ResponeStatus } from "../../../../utilities/ApiConfig";

export interface UrgentTask {
  title: string;
  subtitle: string;
  overdue: string;
  type: "error" | "warning";
}

export const useUrgentTasks = (refreshKey: number) => {
  const { roleIDs, ADGroupData } = useRoleContext();
  const [urgentTasks, setUrgentTasks] = useState<UrgentTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUrgentTasks = useCallback(async () => {
    try {
      setLoading(true);
      const roleName = roleIDs.includes(RoleID.HOD, RoleID.LineManager)
        ? ListEmailName.LM
        : roleIDs.includes(RoleID.HOD)
          ? ListEmailName.HOD
          : roleIDs.includes(RoleID.RecruitmentHR)
            ? ListEmailName.HR
            : ListEmailName.HRLead;
      const Filter = [
        {
          FilterKey: roleName,
          Operator: "eq",
          FilterValue: ADGroupData.EmailId[0],
        },
      ];

      const res = await DashboardServices.GetRecruitmentDetails(Filter, "and");
      const data = res.data || [];

      const UrgentTask = data
        .map((item) => {
          const modified = item.ModifiedDate
            ? new Date(item.ModifiedDate)
            : new Date();
          const today = new Date();

          const diffDays = Math.floor(
            (today.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24),
          );

          return { item, diffDays };
        })
        .filter(({ diffDays }) => diffDays >= 3)
        .map(({ item, diffDays }) => ({
          title: item.JobTitleEnglish,
          subtitle: item.Status,
          overdue: `OVERDUE ${diffDays}D`,
          type: "error" as const,
        }));
      if (res.status === ResponeStatus.SUCCESS) {
        setUrgentTasks(UrgentTask);
      }
    } catch (error) {
      console.error("Dashboard urgent tasks error", error);
    } finally {
      setLoading(false);
    }
  }, [refreshKey]);

  useEffect(() => {
    void fetchUrgentTasks();
  }, [fetchUrgentTasks]);

  return {
    urgentTasks,
    loading,
    refresh: fetchUrgentTasks,
  };
};
