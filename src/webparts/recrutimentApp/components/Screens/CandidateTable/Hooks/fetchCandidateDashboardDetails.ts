import { useCallback, useEffect, useRef, useState } from "react";
import {
  FilterItem,
  GetProfileByFilter,
} from "../../../../models/Icareerportal";
import {
  CandidateTable,
  masterService,
} from "../../../../services/ServiceExport";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { MatricID } from "../../../../utilities/ConditionConfig";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import {
  ApplicationStatusId,
  RoleID,
  workflowStatusApi,
} from "../../../../utilities/Config";

export type CandidateDashboardItem = {
  SNO?: number | string;
  CandidateID: string;
  ApplicantName: string;
  PositionTitle: string;
  JobCode: string;
  Status: string;
  workflowStatusId: string;
  createdOn: Date | undefined;
  applicationStatusId: string;
  applicationStatus: string;
  TotalItems?: number;
  createdBy?: string;
  tblProfilesKcsas?: any[];
};

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

interface CandidateDashboardState {
  data: CandidateDashboardItem[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

interface UseCandidateDashboardOptions {
  jobId: number;
  initialPageSize: number;
  enable: boolean;
}

interface UseCandidateDashboardReturn extends CandidateDashboardState {
  fetchPage: (page: number, pageSize?: number) => void;
  setPageSize: (size: number) => void;
  refresh: () => void;
}

function resolveWorkflowStatusIds(
  roleIDs: number[],
  matricId: number,
): string[] {
  if (roleIDs.includes(RoleID.RecruitmentHR)) {
    if (matricId === MatricID.ReviewProfileHR) {
      return [workflowStatusApi.HRPending];
    }
    if (matricId === MatricID.AssignInterviewPanel) {
      return [workflowStatusApi.PendingRecruitmentHRscheduleInterview];
    }
  }

  if (roleIDs.includes(RoleID.LineManager)) {
    if (matricId === MatricID.ReviewProfileLM) {
      return [
        workflowStatusApi.LineManagerL1Pending,
        workflowStatusApi.LineManagerL2Pending,
        workflowStatusApi.LineManagerLevel1OnHold,
        workflowStatusApi.LineManagerLevel2OnHold,
        workflowStatusApi.LineManagerLevel1Rejected,
        workflowStatusApi.LineManagerLevel2Rejected,
        workflowStatusApi.CandidateRejectedIPanel,
        ApplicationStatusId.ApplicationSuspended,
      ];
    }
  }

  return [workflowStatusApi.HRPending];
}

export const useFetchCandidateDashboardDetails = ({
  jobId,
  initialPageSize,
  enable = true,
}: UseCandidateDashboardOptions): UseCandidateDashboardReturn => {
  const { MatricID: matricId } = useUIState();
  const { roleIDs } = userInfo();

  const [state, setState] = useState<CandidateDashboardState>({
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
      if (!jobId) return;

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
          const jobCodeRes = await masterService.GetJobUniqueDataValue(jobId);
          const jobCode: string = jobCodeRes?.data?.JobCode ?? "";

          const workflowStausId = resolveWorkflowStatusIds(roleIDs, matricId);

          const pagination: GetProfileByFilter = {
            filterValue: "",
            sortBy: "",
            sortOrder: 0,
            pageSize: resolvedPageSize,
            currentPage: page - 1,
            totalItems: 0,
          };

          const filter: FilterItem = {
            jobCode,
            workflowStausId,
            pagination,
          };

          const res = await CandidateTable.getCandidateDetailsInJobCode(filter);

          const items: CandidateDashboardItem[] = res?.data ?? [];
          const totalItems: number =
            res?.data && res?.data.length > 0
              ? (res?.data[0]?.TotalItems ?? items.length)
              : 0;

          setState({
            data: items,
            loading: false,
            error: null,
            pagination: {
              currentPage: page,
              pageSize: resolvedPageSize,
              totalItems,
            },
          });
        } catch (err: any) {
          if (err?.name === "AbortError") return;

          console.error("CandidateDashboard: fetch failed", err);
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to load candidates. Please try again.",
          }));
        }
      }, 300);
    },
    [jobId, matricId, roleIDs, enable],
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
  }, [jobId]);

  return { ...state, fetchPage, setPageSize, refresh };
};
