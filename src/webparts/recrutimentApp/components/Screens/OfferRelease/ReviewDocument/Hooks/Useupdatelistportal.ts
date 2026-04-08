import { useCallback, useState } from "react";
import { StatusId } from "../../../SelectionProcess/config/EvaluationConfig";
import { RoleID, workflowStatusApi } from "../../../../../utilities/Config";
import { Choices } from "../../../../../utilities/ApiConfig";
import { EmployeementCategory } from "../../../../../utilities/ConditionConfig";
import { userInfo } from "../../../../../utilities/hooks/RoleContext";
import { OfferServices } from "../../../../../services/ServiceExport";
import { WorkflowHODConfig } from "../../../../Hooks/WorkflowConfig";

interface Filter {
  FilterKey: string;
  Operator: string;
  FilterValue: string;
}

export interface PortalItem {
  StatusID: number;
  ID: number;
  JobRequestID: string;
  EmploymentCategory: string;
  IsExpat: boolean;
}

interface WorkflowStatusItem {
  jobRequestId: string | number;
  workflowStatusId: string | number;
}

interface UpdatedStatusItem extends WorkflowStatusItem {
  ID: number;
  StatusId: number;
}

interface UseUpdateListPortalProps {
  items: PortalItem[];
  refreshKey: number;
}

interface UseUpdateListPortalReturn {
  updateListPortal: () => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  reset: () => void;
}

const PORTAL_STATUS_IDS = [
  StatusId.PendingBGdocuploadedbycandidate,
  StatusId.PendingCandidateOfferLetterUpload,
  StatusId.PendingCandidateWorkPermitreleatedDoc,
  StatusId.PendingCandidateEmploymentContractUpload,
  StatusId.PendingLabourHireOfferRelease,
  StatusId.PendingLabourhireWPPayment,
  StatusId.PendingLHWorkPermitProcess,
  StatusId.PendingLHECRelease,
] as const;

const APPROVED_WORKFLOW_IDS = [
  workflowStatusApi.UploadedtheCandidateBGVDocs,
  workflowStatusApi.CandidateuploadedtheSignedOfferLetter,
  workflowStatusApi.UploadedthesignedEmployementcontractform,
  workflowStatusApi.PendingLabourHireOfferRelease,
  workflowStatusApi.PendingLabourhireWPPayment,
  workflowStatusApi.PendingLHWorkPermitProcess,
  workflowStatusApi.PendingLHECRelease,
] as const;

const DECLINE_WORKFLOW_IDS = [
  workflowStatusApi.Offerdecline,
  workflowStatusApi.SysytmeDecline,
] as const;

const buildFilters = (
  currentRoleID: number[],
  userDetails: { EmailId: string }[],
): Filter[] => {
  const filters: Filter[] = [
    {
      FilterKey: "ItemCreated",
      Operator: "eq",
      FilterValue: Choices.No,
    },
  ];

  if (currentRoleID.includes(RoleID.RecruitmentHR)) {
    filters.push({
      FilterKey: "RecruitmentHR",
      Operator: "eq",
      FilterValue: userDetails[0]?.EmailId ?? "",
    });
  }

  return filters;
};

const filterPortalItems = (items: PortalItem[]): PortalItem[] =>
  items.filter((item) => PORTAL_STATUS_IDS.includes(item.StatusID as any));

const getApprovedIds = (empCategory: string): (string | number)[] => [
  ...APPROVED_WORKFLOW_IDS,
  empCategory === EmployeementCategory.KCSAEmployee
    ? workflowStatusApi.CandidateUploadedcandidatepersonalDocs
    : "",
];

const resolveStatusUpdate = (
  item: WorkflowStatusItem,
  portalItems: PortalItem[],
): UpdatedStatusItem | null => {
  const jobRequestId = String(item.jobRequestId);

  const declined = portalItems.find(
    (res) =>
      res.JobRequestID === jobRequestId &&
      (DECLINE_WORKFLOW_IDS as readonly (string | number)[]).includes(
        item.workflowStatusId,
      ),
  );

  const StatusID = WorkflowHODConfig(
    declined?.StatusID ?? 0,
    false,
    declined?.IsExpat,
    declined?.EmploymentCategory,
  );

  if (declined) {
    return { ...item, ID: declined.ID, StatusId: StatusID };
  }

  // Check approved match
  const approved = portalItems.find((res) => {
    const approvedIds = getApprovedIds(res.EmploymentCategory);
    return (
      res.JobRequestID === jobRequestId &&
      approvedIds.includes(item.workflowStatusId)
    );
  });

  const ApprovedStatus = WorkflowHODConfig(
    approved?.StatusID ?? 0,
    false,
    approved?.IsExpat,
    approved?.EmploymentCategory,
  );

  if (approved) {
    return { ...item, ID: approved.ID, StatusId: ApprovedStatus };
  }

  return null;
};

export const useUpdateListPortal = ({
  items,
  refreshKey = 0,
}: UseUpdateListPortalProps): UseUpdateListPortalReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { roleIDs, ADGroupData } = userInfo();

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
  }, []);

  const updateListPortal = useCallback(async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      if (!items) {
        setIsLoading(false);
        return;
      }
      //   const filters = buildFilters(roleIDs, userDetails);
      //   const items   = await OfferLetterServices.fetchResiCandidateDetails(filters, "and");

      const portalItems = filterPortalItems(items);
      if (portalItems.length === 0) {
        setIsSuccess(true);
        return;
      }
      const jobRequestIDs = portalItems.map((item) => item.JobRequestID);

      const updatedStatus =
        await OfferServices.GetJobRequestData(jobRequestIDs);
      const statusList: WorkflowStatusItem[] = updatedStatus?.data?.data ?? [];

      const resolvedItems = statusList
        .map((item) => resolveStatusUpdate(item, portalItems))
        .filter((item): item is UpdatedStatusItem => item !== null);

      if (resolvedItems.length > 0) {
        await OfferServices.UpdateStatusSelectedHOD(resolvedItems);
      }

      setIsSuccess(true);
    } catch (err: any) {
      const message = err?.message ?? "An unexpected error occurred.";
      setError(message);
      console.error("[useUpdateListPortal]", err);
    } finally {
      setIsLoading(false);
    }
  }, [roleIDs, ADGroupData, refreshKey]);

  return { updateListPortal, isLoading, isSuccess, error, reset };
};
