import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  AlertCircle,
  Pencil,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  PauseCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "../ReviewScorecard.module.scss";
import { ScorecardCandidateRow } from "../State/types";
import {
  EDITABLE_STATUS_IDS,
  VIEW_ONLY_STATUS_IDS,
} from "../Hooks/useReviewScorecard";
import { panelVariants } from "../../CandidateTable/CandidateTable";
import { useMemo } from "react";
import {
  DataTable,
  DataTableColumn,
} from "../../../Comman/DataTable/DataTable";
import "../../CandidateTable/CandidateTable.scss";
import CandidateReviewModal from "./CandidateReviewModal";
import ReactDOM from "react-dom";
import style from "../../CandidateTable/Components/ShowCandidateDetailsPopup.module.scss";
import * as strings from 'RecrutimentAppWebPartStrings';
import { StatusId } from "../../../../utilities/Config";

interface Props {
  candidates: ScorecardCandidateRow[];
  loading: boolean;
  onClose: () => void;
  onReview: (c: ScorecardCandidateRow) => void;
  recruitmentId: number;
  hook: any;
  currentRoleId: number;
}

interface CandidateList {
  ID: number;
  ItemID: number;
  ApplicantName: string;
  PositionTitle: string;
  InterviewLevel: string;
  Grade: string;
  Status: string;
}

const getStatusClass = (statusId: number) => {
  if (statusId === 122) return styles.statusSelected;
  if (VIEW_ONLY_STATUS_IDS.includes(statusId)) return styles.statusRejected;
  return styles.statusPending;
};

const getInterviewLevelLabel = (interviewLevel?: string): string => {
  const lvl = (interviewLevel || "").trim();
  if (/level\s*2/i.test(lvl)) return strings.Level1Of1Level2Of2;
  if (/level\s*1/i.test(lvl)) return strings.Level1Of1;
  return lvl || " ";
};

function resolveStatusTone(status: string): "warning" | "success" | "danger" {
  const s = status?.toLowerCase() ?? "";
  if (s.includes("pending")) return "warning";
  if (s.includes("reviewed") || s.includes("ready") || s.includes("approved"))
    return "success";
  return "danger";
}

const CandidateDrawer: React.FC<Props> = ({
  candidates,
  loading,
  onClose,
  onReview,
  recruitmentId,
  hook,
  currentRoleId,
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/MyTracker");
  };

  const headerMeta = useMemo(() => {
    if (!candidates) return { code: "—", title: "—" };
    return { code: candidates[0]?.jobCode, title: candidates[0]?.jobTitle };
  }, [candidates]);

  // ✅ Local refresh state
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // ✅ Local pagination state
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: candidates.length,
  });

  // Sync totalItems when candidates change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, totalItems: candidates.length }));
  }, [candidates]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // If you need to trigger a parent refetch, add an `onRefresh` prop
    // or do local logic here
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate
    setIsRefreshing(false);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 1 }));
  };

  const getActionConfig = (item: ScorecardCandidateRow) => {
    if (
      item.statusId === StatusId.OnHoldbyHOD ||
      item.statusId === StatusId.CandidateOnHoldbyHODLevel1 ||
      item.statusId === StatusId.CandidateOnHoldbyHODLevel2
    ) {
      return {
        label: strings.OnHold,
        icon: <PauseCircle size={14} />,
      };
    }

    if (
      item.statusId === StatusId.PendingwithpositionIDAssignmentWithHOD ||
      item.statusId === StatusId.pendingL2shorlistingwithHOD
    ) {
      return {
        label: "Review",
        icon: <Eye size={14} />,
      };
    }

    return {
      label: "View",
      icon: <CheckCircle size={14} />,
    };
  };

  const columns: DataTableColumn<ScorecardCandidateRow>[] = useMemo(
    () => [
      {
        id: "ApplicantName",
        header: strings.ApplicantName,
        render: (item) => (
          <span className="candidate-table__code">{item.fullName}</span>
        ),
      },
      {
        id: "PositionTitle",
        header: strings.PositionTitle,
        render: (item) => (
          <div>
            <div className="candidate-table__name">{item.positionTitle}</div>
            <div className="candidate-table__subtext">{item.department}</div>
          </div>
        ),
      },
      {
        id: "interviewLevel",
        header: strings.InterviewLevel,
        accessor: "interviewLevel" as keyof ScorecardCandidateRow,
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "grade",
        header: "Grade",
        accessor: "grade" as keyof ScorecardCandidateRow,
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "Status",
        header: "Status",
        render: (item) => (
          <span
            className={`candidate-table__status candidate-table__status--${resolveStatusTone(
              item.status,
            )}`}
          >
            {item.status}
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
              className={`candidate-table__review${label === "View" ? " candidate-table__review--view" : ""}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onReview(item)}
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
      <>
        <div className="candidate-table">
          <motion.div
            className="candidate-table__backdrop"
            style={{ zIndex: 200 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="candidate-table__panel"
            style={{ zIndex: 201 }}
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
                    {strings.ReviewScorecardProfiles}</h2>
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
                  {strings.Refresh}</button>

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
                <DataTable<ScorecardCandidateRow>
                  columns={columns}
                  data={candidates}
                  loading={loading}
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

        {hook.reviewingCandidate &&
          ReactDOM.createPortal(
            <AnimatePresence>
              <>
                <motion.div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.55)",
                    zIndex: 9998,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={hook.closeReview}
                />

                {/* ✅ Centered modal wrapper */}
                <motion.div
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                    pointerEvents: "none", // let backdrop handle clicks
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    style={{
                      width: "1080px",
                      height: "90vh",
                      background: "#fff",
                      borderRadius: "16px",
                      overflowY: "auto",
                      boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
                      pointerEvents: "all",
                    }}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 28, stiffness: 320 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CandidateReviewModal
                      candidate={hook.reviewingCandidate}
                      reviewData={hook.reviewData}
                      reviewLoading={hook.reviewLoading}
                      scoreData={hook.scoreData}
                      scoreLoading={hook.scoreLoading}
                      showComments={hook.showComments}
                      level1Comments={hook.level1Comments}
                      level2Comments={hook.level2Comments}
                      commentsLoading={hook.commentsLoading}
                      onViewComments={hook.openComments}
                      onCloseComments={() => hook.setShowComments(false)}
                      hodDecision={hook.hodDecision}
                      decisionComment={hook.decisionComment}
                      confirmed={hook.confirmed}
                      selectedPositionId={hook.selectedPositionId}
                      selectedPositionText={hook.selectedPositionText}
                      positionOptions={hook.positionOptions}
                      submitting={hook.submitting}
                      submitError={hook.submitError}
                      successMessage={hook.successMessage}
                      errors={hook.errors}
                      shouldShowPositionId={hook.shouldShowPositionId}
                      onDecisionChange={hook.setHodDecision}
                      onCommentChange={hook.setDecisionComment}
                      onConfirmChange={hook.setConfirmed}
                      onPositionChange={(id, text) => {
                        hook.setSelectedPositionId(id);
                        hook.setSelectedPositionText(text);
                        hook.setErrors({ ...hook.errors, position: false });
                      }}
                      onClose={hook.closeReview}
                      currentRoleId={currentRoleId}
                      isLevel2Status={hook.isLevel2(
                        hook.reviewingCandidate.statusId,
                      )}
                      submitDeps={hook.submitDeps}
                    />
                  </motion.div>
                </motion.div>
              </>
            </AnimatePresence>,
            document.body,
          )}
      </>
    </AnimatePresence>
  );
};

export default CandidateDrawer;
