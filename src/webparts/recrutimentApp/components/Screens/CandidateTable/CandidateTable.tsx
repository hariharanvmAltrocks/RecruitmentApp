import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, X, Eye, PauseCircle, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CandidateDashboardItem,
  useFetchCandidateDashboardDetails,
} from "./Hooks/fetchCandidateDashboardDetails";
import { panelvalues, ShowCandidateDetailsPopup } from "./Components/ShowCandidateDetailsPopup";
import { DataTable, DataTableColumn } from "../../Comman/DataTable/DataTable";
import "../RecruitmentTable/AdvertReviewDrawer/AdvertReviewDrawer.scss";
import "./CandidateTable.scss";
import { usePositionDetails } from "../RecruitmentTable/AdvertReviewDrawer/Hooks/getPositionDetails";
import { StatusId, workflowStatusApi } from "../../../utilities/Config";
import { ActionID } from "../../../utilities/ConditionConfig";


const panelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
  exit:   { x: "100%" },
};

// interface CandidateTableProps {
//   jobId: number;
// }


export const CandidateTable: React.FC = (props: any) => {
  const navigate = useNavigate();
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);
  const [paneldata, setPanelData] = useState<panelvalues | null>( null)
  const { data: positionDetails, loading: positionLoading } = usePositionDetails(props.ID, "");
 const jobId = positionDetails?.JobCodeId ?? 0;
  const {
    data,
    loading,
    error,
    pagination,   
    fetchPage,
    setPageSize,
  } = useFetchCandidateDashboardDetails({ jobId, initialPageSize: 10, enable: !positionLoading});

  const headerMeta = useMemo(() => {
    if (!data.length) return { code: "—", title: "—" };
    return { code: data[0].JobCode, title: data[0].PositionTitle };
  }, [data]);

  const handleClose = useCallback(() => navigate("/RecruitmentTable"), [navigate]);

  const handlePageChange = useCallback(
    (page: number) => fetchPage(page),
    [fetchPage]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => setPageSize(size),
    [setPageSize]
  );

  console.log("positionDetails:", positionDetails);
console.log("positionLoading:", positionLoading);

 let BUCodeID =positionDetails?.BusinessUnitCodeId
 let AssignHR = positionDetails?.AssignedHR
const handleAction = useCallback((item: any) => {
  setActiveCandidateId(item.CandidateID);
  let Action;

if (
  item.workflowStatusId === workflowStatusApi.HRPending ||
  item.workflowStatusId === workflowStatusApi.LineManagerL1Pending ||
  item.workflowStatusId === workflowStatusApi.LineManagerL2Pending
) {
  Action = ActionID.Review;
} 
else if (
  item.workflowStatusId === workflowStatusApi.LineManagerLevel1OnHold ||
  item.workflowStatusId === workflowStatusApi.LineManagerLevel2OnHold
) {
  Action = ActionID.onHold;
} 
else if (
  item.workflowStatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
  Number(item.workflowStatusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
) {
  Action = ActionID.schedule;
} 
else {
  Action = ActionID.View;
}

  setPanelData({
    bucodeId: BUCodeID ?? 0,
    candidateId: item.CandidateID,
    assignHR: AssignHR ?? "",
    statusId: item.workflowStatusId ?? item.statusID,
    actionID:Action
  });
}, [positionDetails]);


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
    item.workflowStatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
    Number(item.workflowStatusId) === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
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
              item.Status
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
          {icon}
          {label}
        </span>
      </motion.button>
    );
  },
}
    ],
    []
  );

  return (
    <AnimatePresence>
      <div className="advert-review-drawer">
        <motion.div
          className="advert-review-drawer__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        <motion.div
          className="advert-review-drawer__panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="advert-review-drawer__header">
            <div className="advert-review-drawer__header-left">
              <div className="advert-review-drawer__header-icon">
                <Users size={20} />
              </div>
              <div>
                <h2 className="advert-review-drawer__title">
                  Review Candidate Profiles
                </h2>
                <div className="advert-review-drawer__meta">
                  <span className="advert-review-drawer__badge">
                    {headerMeta.code}
                  </span>
                  <span className="advert-review-drawer__dot" />
                  <span className="advert-review-drawer__meta-text">
                    {headerMeta.title}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="advert-review-drawer__close"
              onClick={handleClose}
            >
              <X size={18} />
            </button>
          </div>

          <div className="advert-review-drawer__content">
            <div className="candidate-table">
              <div className="candidate-table__card">
                <DataTable<CandidateDashboardItem>
                  columns={columns}
                  data={data}
                  loading={loading ?? positionLoading}
                  // error={error ?? undefined}
                  pageSize={pagination.pageSize}
                  currentPage={pagination.currentPage}
                  totalCount={pagination.totalItems}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[5, 10, 20, 50]}
                  emptyMessage="No candidates found for this job."
                />

                <div className="candidate-table__footer">
                  <button
                    type="button"
                    className="candidate-table__footer-btn candidate-table__footer-btn--ghost"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="candidate-table__footer-btn candidate-table__footer-btn--primary"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
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
            positionDetails= {positionDetails ?? null}
                />
                )}
              </AnimatePresence>
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