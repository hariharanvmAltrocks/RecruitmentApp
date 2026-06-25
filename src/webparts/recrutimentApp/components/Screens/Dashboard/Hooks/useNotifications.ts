import { useState, useEffect, useCallback } from "react";
import { NotificationItem } from "../Types";
import { DashboardService } from "../Services/dashboard.service";

export const useNotifications = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<NotificationItem[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await DashboardService.getNotifications();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { loading, data, error, refresh };
};
export default useNotifications;
