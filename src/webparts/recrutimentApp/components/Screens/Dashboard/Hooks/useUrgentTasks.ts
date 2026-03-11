import { useState, useEffect, useCallback } from "react";
import { DashboardServices } from "../../../../services/ServiceExport";

export interface UrgentTask {
    title: string;
    subtitle: string;
    overdue: string;
    type: "error" | "warning";
}

export const useUrgentTasks = () => {
    const [urgentTasks, setUrgentTasks] = useState<UrgentTask[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUrgentTasks = useCallback(async () => {
        try {
            setLoading(true);

            const res = await DashboardServices.GetRecruitmentDetails([], "and");
            const data = res.data || [];


            // const tasks: UrgentTask[] = data.slice(0, 3).map((item) => {
            //     const idString = item.id ? String(item.id) : "0";
            //     const pseudoDays = (idString.length % 5) + 2; 
            //     return {
            //         title: item.title || "Pending Request",
            //         subtitle: item.status || "Action Required",
            //         overdue: `${pseudoDays}D OVERDUE`,
            //         type: pseudoDays > 3 ? "error" : "warning"
            //     };
            // });

            setUrgentTasks([
                { title: 'Mining Engineering', subtitle: 'Advert Review Pending', overdue: '5D OVERDUE', type: 'error' },
                { title: 'Mining Supervisor', subtitle: 'Position Mapping', overdue: '3D OVERDUE', type: 'warning' }
            ]);

        } catch (error) {
            console.error("Dashboard urgent tasks error", error);
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        fetchUrgentTasks();
    }, [fetchUrgentTasks]);

    return {
        urgentTasks,
        loading,
        refresh: fetchUrgentTasks
    };
};
