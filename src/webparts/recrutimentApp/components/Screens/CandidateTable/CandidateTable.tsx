import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users,
  X,
  Eye,
  PauseCircle,
  Calendar,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CandidateDashboardItem,
  useFetchCandidateDashboardDetails,
} from "./Hooks/fetchCandidateDashboardDetails";
import {
  panelvalues,
  ShowCandidateDetailsPopup,
} from "./Components/ShowCandidateDetailsPopup";
import { DataTable, DataTableColumn } from "../../Comman/DataTable/DataTable";
import "./CandidateTable.scss";
import { usePositionDetails } from "../RecruitmentTable/AdvertReviewDrawer/Hooks/getPositionDetails";
import {
  JobAdvertAlertMsg,
  PendingCandidateAlertMsg,
  StatusId,
  workflowStatusApi,
} from "../../../utilities/Config";
import { ActionID } from "../../../utilities/ConditionConfig";
import { useModalPopup } from "../../Comman/ModalPopup/useModalPopup";
import moment from "moment";
import { ModalPopup } from "../../Comman/ModalPopup/ModalPopup";
import Loading from "../../Comman/Loading/loading";

export const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: { x: "100%" },
};

// interface CandidateTableProps {
//   jobId: number;
// }

export const CandidateTable: React.FC = (props: any) => {
  const navigate = useNavigate();
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(
    null,
  );
  const [paneldata, setPanelData] = useState<panelvalues | null>(null);
  const { data: positionDetails, loading: positionLoading } =
    usePositionDetails(props.ID, "");

  const positionDetailsRef = useRef(positionDetails);
  useEffect(() => {
    positionDetailsRef.current = positionDetails;
  }, [positionDetails]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const jobId = positionDetails?.JobCodeId ?? 0;
  const { data, loading, error, pagination, fetchPage, setPageSize, refresh } =
    useFetchCandidateDashboardDetails({
      jobId,
      recruitmentId: props.ID,
      initialPageSize: 10,
      enable: !positionLoading,
    });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 600);
  }, [refresh]);

  const onHoldRef = useRef(data);

  useEffect(() => {
    onHoldRef.current = data;
  }, [data]);

  const headerMeta = useMemo(() => {
    if (!positionDetails) return { code: "—", title: "—" };
    return {
      code: positionDetails.JobCode,
      title: positionDetails.JobTitleEnglish,
    };
  }, [positionDetails]);

  const { modalState, showModal, closeModal } = useModalPopup();

  const handleClose = useCallback(() => navigate("/MyTracker"), [navigate]);

  const handlePageChange = useCallback(
    (page: number) => fetchPage(page),
    [fetchPage],
  );

  const handlePageSizeChange = useCallback(
    (size: number) => setPageSize(size),
    [setPageSize],
  );

  const handleAction = useCallback(
    (item: any) => {
      if (!positionDetailsRef.current) return;

      const BUCodeID = positionDetailsRef.current?.BusinessUnitCodeId;
      const AssignHR = positionDetailsRef.current?.AssignEMail;

      const {
        JobPostingEndDate,
        JobPostingFirstExtensionEndDate,
        JobPostingSecondExtensionEndDate,
      } = positionDetailsRef.current;

      const getLatestDate = () => {
        return (
          JobPostingSecondExtensionEndDate ||
          JobPostingFirstExtensionEndDate ||
          JobPostingEndDate
        );
      };

      const latestDate = getLatestDate();

      let isJobExpired = false;

      if (latestDate) {
        const today = new Date();
        today.setDate(today.getDate() + 1);

        const compareDate = new Date(latestDate);
        compareDate.setHours(0, 0, 0, 0);

        isJobExpired = today <= compareDate;
      }
      const pendingCount = onHoldRef.current.filter(
        (d: any) =>
          d.workflowStatusId === workflowStatusApi.LineManagerLevel1OnHold ||
          d.workflowStatusId === workflowStatusApi.LineManagerLevel2OnHold,
      ).length;
      if (item.workflowStatusId === workflowStatusApi.LineManagerL2Pending) {
        if (pendingCount > 0) {
          showModal({
            type: "error",
            title: "Pending Candidate Alert",
            message: PendingCandidateAlertMsg(pendingCount),
            confirmLabel: "OK",
            onConfirm: closeModal,
          });

          return;
        }

        const formattedDate = moment(latestDate).format("DD/MM/YYYY");

        if (isJobExpired) {
          showModal({
            type: "error",
            title: "Job Expired",
            message: JobAdvertAlertMsg(formattedDate),
            confirmLabel: "OK",
            onConfirm: closeModal,
          });

          return;
        }
      }

      setActiveCandidateId(item.CandidateID);

      const getAction = (status: number) => {
        const reviewStatuses = [
          workflowStatusApi.HRPending,
          workflowStatusApi.LineManagerL1Pending,
          workflowStatusApi.LineManagerL2Pending,
        ];

        const holdStatuses = [
          workflowStatusApi.LineManagerLevel1OnHold,
          workflowStatusApi.LineManagerLevel2OnHold,
        ];

        const scheduleStatuses = [
          workflowStatusApi.PendingRecruitmentHRscheduleInterview,
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
        ];

        if (reviewStatuses.includes(item.workflowStatusId))
          return ActionID.Review;
        if (holdStatuses.includes(item.workflowStatusId))
          return ActionID.onHold;
        if (scheduleStatuses.includes(Number(item.workflowStatusId)))
          return ActionID.schedule;

        return ActionID.View;
      };

      const actionID = getAction(item.workflowStatusId);

      setPanelData({
        bucodeId: BUCodeID ?? 0,
        candidateId: item.CandidateID,
        assignHR: AssignHR ?? "",
        statusId: item.workflowStatusId ?? item.statusID,
        actionID,
        RecruitmentID: item.CandidateID,
      });
    },
    [data],
  );

  const getActionConfig = (item: CandidateDashboardItem) => {
    if (
      item.workflowStatusId === workflowStatusApi.HRPending ||
      item.workflowStatusId === workflowStatusApi.LineManagerL1Pending ||
      item.workflowStatusId === workflowStatusApi.LineManagerL2Pending
    ) {
      return {
        label: "Review",
        icon: <Eye size={14} />,
      };
    }

    if (
      item.workflowStatusId === workflowStatusApi.LineManagerLevel1OnHold ||
      item.workflowStatusId === workflowStatusApi.LineManagerLevel2OnHold
    ) {
      return {
        label: "On Hold",
        icon: <PauseCircle size={14} />,
      };
    }

    if (
      item.workflowStatusId ===
        workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
      Number(item.workflowStatusId) ===
        StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
    ) {
      return {
        label: "Schedule",
        icon: <Calendar size={14} />,
      };
    }

    return {
      label: "View",
      icon: <CheckCircle size={14} />,
    };
  };

  const columns: DataTableColumn<CandidateDashboardItem>[] = useMemo(
    () => [
      {
        id: "ApplicantName",
        header: "Applicant Name",
        render: (item) => (
          <span className="candidate-table__code">{item.ApplicantName}</span>
        ),
      },
      {
        id: "PositionTitle",
        header: "Position Title",
        render: (item) => (
          <div>
            <div className="candidate-table__name">{item.PositionTitle}</div>
            <div className="candidate-table__subtext">{item.JobCode}</div>
          </div>
        ),
      },
      {
        id: "createdBy",
        header: "Profile From",
        accessor: "createdBy" as keyof CandidateDashboardItem,
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "createdOn",
        header: "Profile Received Date",
        accessor: "createdOn" as keyof CandidateDashboardItem,
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "Status",
        header: "Status",
        render: (item) => (
          <span
            className={`candidate-table__status candidate-table__status--${resolveStatusTone(
              item.Status,
            )}`}
          >
            {item.Status}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Action",
        align: "right",
        render: (item) => {
          const { label, icon } = getActionConfig(item);

          return (
            <motion.button
              type="button"
              className="candidate-table__review"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction(item)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* {icon} */}
                {label}
              </span>
            </motion.button>
          );
        },
      },
    ],
    [],
  );

  return (
    <AnimatePresence>
      <div className="candidate-table">
        {loading || positionLoading ? <Loading /> : <></>}
        <motion.div
          className="candidate-table__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />
        <motion.div
          className="candidate-table__panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="candidate-table__header">
            <div className="candidate-table__header-left">
              <div className="candidate-table__header-icon">
                <Users size={20} />
              </div>
              <div>
                <h2 className="candidate-table__title">
                  Review Candidate Profiles
                </h2>
                <div className="candidate-table__meta">
                  <span className="candidate-table__badge">
                    {headerMeta.code}
                  </span>
                  <span className="candidate-table__dot" />
                  <span className="candidate-table__meta-text">
                    {headerMeta.title}
                  </span>
                </div>
              </div>
            </div>

            <div className="candidate-table__header-right">
              <button
                type="button"
                className="candidate-table__refresh"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={14} className={isRefreshing ? "spin" : ""} />
                Refresh
              </button>

              <button
                type="button"
                className="candidate-table__close"
                onClick={handleClose}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="candidate-table__content">
            <div className="candidate-table__card">
              <DataTable<CandidateDashboardItem>
                columns={columns}
                data={data}
                loading={loading || positionLoading}
                // error={error ?? undefined}
                pageSize={pagination.pageSize}
                currentPage={pagination.currentPage}
                totalCount={pagination.totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 20, 50]}
                emptyMessage="No candidates found for this job."
              />
            </div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {activeCandidateId && (
          <ShowCandidateDetailsPopup
            isOpen
            candidateId={activeCandidateId}
            onClose={() => setActiveCandidateId(null)}
            panelParams={paneldata ?? null}
            positionDetails={positionDetails ?? null}
            handleRefresh={handleRefresh}
          />
        )}
      </AnimatePresence>

      <ModalPopup {...modalState} onClose={closeModal} />
    </AnimatePresence>
  );
};

function resolveStatusTone(status: string): "warning" | "success" | "danger" {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("pending")) return "warning";
  if (s.includes("reviewed") || s.includes("ready") || s.includes("approved"))
    return "success";
  return "danger";
}
