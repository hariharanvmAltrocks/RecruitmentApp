import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { PaginationState } from "../../CandidateTable/Hooks/fetchCandidateDashboardDetails";
import { AdminPItem } from "../../../../models/Icareerportal";
import { ExternalUserType } from "../../../../utilities/Config";
import {
  AdminPanelServices,
  masterService,
} from "../../../../services/ServiceExport";
import { AdminDashboard } from "../../../../services/AdminPanel/IAdminpanelService";

export type AdminPanelType = "labour-hire" | "agency";

export interface UseAdminPanelTableOptions {
  type: AdminPanelType;
  initialPageSize: number;
}

export interface UseAdminPanelTableReturn extends AdminpanelDashboardState {
  fetchPage: (page: number, pageSize?: number) => void;
  setPageSize: (size: number) => void;
  refresh: () => void;
}

interface AdminpanelDashboardState {
  data: AdminDashboard[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAdminPanelTable = ({
  type,
  initialPageSize,
}: UseAdminPanelTableOptions): UseAdminPanelTableReturn => {
  const { MatricID: matricId } = useUIState();
  const { roleIDs, ADGroupData } = userInfo();
  const emailId = ADGroupData?.EmailId?.[0];

  const [state, setState] = useState<AdminpanelDashboardState>({
    data: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      pageSize: initialPageSize,
      totalItems: 0,
    },
  });

  const pageSizeRef = useRef<number>(initialPageSize);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(
    async (page: number, pageSize?: number) => {
      if (!type) return;

      const resolvedPageSize = pageSize ?? pageSizeRef.current;
      pageSizeRef.current = resolvedPageSize;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      if (timerRef.current) clearTimeout(timerRef.current);

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      timerRef.current = setTimeout(async () => {
        try {
          const Filter = [
            { FilterKey: "EmailId", Operator: "eq", FilterValue: emailId },
          ];
          const response = await masterService.GetUserDetails(Filter, "and");
          if (response.status === 200 && response.data) {
            let FilterType =
              type === "labour-hire"
                ? ExternalUserType.LabourHire
                : ExternalUserType.Agent;
            let FilterValue: AdminPItem = {
              hrUserId: String(response.data.ID),
              type: FilterType,
              pagination: {
                filterValue: "",
                sortBy: "",
                sortOrder: 0,
                pageSize: resolvedPageSize,
                currentPage: page - 1,
                totalItems: 0,
              },
            };
            const res =
              await AdminPanelServices.getAdminPanelDashboard(FilterValue);

            setState({
              data: res.data ?? [],
              loading: false,
              error: null,
              pagination: {
                currentPage: page,
                pageSize: resolvedPageSize,
                totalItems: 0,
              },
            });
          }
        } catch (err: any) {
          if (err?.name === "AbortError") return;

          console.error("Adminpanel Dashboard: fetch failed", err);
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to load Adminpanel. Please try again.",
          }));
        }
      }, 300);
    },
    [type, matricId, roleIDs],
  );

  const setPageSize = useCallback(
    (size: number) => {
      void fetchPage(1, size);
    },
    [fetchPage],
  );

  const refresh = useCallback(() => {
    void fetchPage(state.pagination.currentPage, pageSizeRef.current);
  }, [fetchPage, state.pagination.currentPage]);

  useEffect(() => {
    void fetchPage(1, initialPageSize);

    return () => {
      abortRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [type]);

  return { ...state, fetchPage, setPageSize, refresh };
};
