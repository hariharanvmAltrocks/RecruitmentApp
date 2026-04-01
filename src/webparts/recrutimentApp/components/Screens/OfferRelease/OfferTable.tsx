import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RefreshCw, RotateCcw, Eye, Upload } from "lucide-react";
import { useRecruitmentDetails } from "../RecruitmentTable/Hooks/useRecruitmentDetails";
import { useTabDetails } from "../RecruitmentTable/Hooks/useTabDetails";
import { ReviewDocument } from "./ReviewDocument/ReviewDocument";
import {
  ISelectedCandidate,
  RecruitmentTabKey,
  TabItem,
} from "../RecruitmentTable/RecruitmentTable.types";
import "./OfferTable.scss";
import { DataTable, DataTableColumn } from "../../Comman/DataTable/DataTable";
import { useUIState } from "../../RecrutimentApp/UIStateContext";
import { useNavigate } from "react-router-dom";
import { ModalPopup } from "../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../Comman/ModalPopup/useModalPopup";
import Tabs from "../../Comman/Tabs/Tabs";
import { userInfo } from "../../../utilities/hooks/RoleContext";
import { StatusId } from "../SelectionProcess/config/EvaluationConfig";
import { useStateOfferRelease } from "./StateManage/useStateFromManage";

// ─── Types ────────────────────────────────────────────────────────────────────
type ActionMode = "Upload" | "Review" | "View" | "Edit";

// ─── Constants (stable sets → O(1) lookup vs sequential OR chain) ─────────────
const REVIEW_STATUSES = new Set([
  StatusId.PendingHRReviewBGCheck,
  StatusId.PendingHROfferReview,
  StatusId.PendingHRReviewOfferWorkPermitInit,
  StatusId.PendingHRReviewOfferanduploadEmployementContract,
  StatusId.PendingHRReviewWorkpermitDocs,
  StatusId.PendingHREmploymentContractVerification,
]);

const EDIT_STATUSES = new Set([
  StatusId.PendingHRBGVInitiation,
  StatusId.PendingHROfferInitiate,
]);

// ─── Pure helper (outside component → never re-created) ───────────────────────
function resolveActionMode(statusID: number): ActionMode {
  if (REVIEW_STATUSES.has(statusID)) return "Review";
  if (EDIT_STATUSES.has(statusID)) return "Edit";
  return "View"; // Upload and all other View cases collapse to "View"
}

// ─── Action column sub-component (prevents inline anonymous re-renders) ────────
const ActionCell: React.FC<{
  item: ISelectedCandidate;
  actionMode: ActionMode;
  onAction: (item: ISelectedCandidate) => void;
}> = React.memo(({ item, actionMode, onAction }) => {
  const isUpload = actionMode === "Upload";
  const isReview = actionMode === "Review";
  const ActionIcon = isUpload ? Upload : Eye;
  const actionLabel = isUpload ? "Upload" : isReview ? "Review" : "View";

  return (
    <button
      className="data-table__action-btn"
      onClick={() => onAction(item)}
      type="button"
      aria-label={`${actionLabel} action`}
    >
      <ActionIcon size={16} style={{ marginRight: 8 }} />
      {actionLabel}
    </button>
  );
});

// ─── Column factory (stable reference, only changes when deps change) ──────────
function buildColumns(
  actionMode: ActionMode,
  onAction: (item: ISelectedCandidate) => void
): DataTableColumn<any>[] {
  return [
    {
      id: "PositionID",
      header: "Position ID",
      accessor: "positionId",
      render: (item: any) => (
        <div className="data-table__job-title">
          <span className="offer-table__code">{item.positionId}</span>
        </div>
      ),
    },
    {
      id: "title",
      header: "Job Title & Dept",
      render: (item: any) => (
        <div className="data-table__job-title">
          <span>{item.title}</span>
          <span className="data-table__job-dept">{item.department}</span>
        </div>
      ),
    },
    {
      id: "buCode",
      header: "Business Unit",
      render: (item: any) => String(item.buCode || "").padStart(2, "0"),
      cellClassName: "data-table__cell--muted",
      align: "center",
      hideOnMobile: true,
    },
    {
      id: "applicantName",
      header: "Applicant Name",
      accessor: "applicantName",
      cellClassName: "data-table__cell--count",
      hideOnMobile: true,
    },
    {
      id: "status",
      header: "Status",
      render: (item: any) => (
        <span className="data-table__status-badge status-badge">
          {item.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cellClassName: "data-table__cell--actions",
      render: (item: any) => (
        <ActionCell item={item} actionMode={actionMode} onAction={onAction} />
      ),
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────
export const OfferTable: React.FC = () => {
  const { tabs, loading: tabsLoading } = useTabDetails();
  const { activeTab, MatricID: matricID, setMatricID, sideNavflag, setCurrentTabName, currentTabName } = useUIState();
  const navigate = useNavigate();
  const { modalState, closeModal } = useModalPopup();

  // ── Tab state: initialise once from context ────────────────────────────────
  const [activeTabKey, setActiveTabKey] = useState<RecruitmentTabKey>(
    activeTab as RecruitmentTabKey
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const { items, loading: tableLoading } = useRecruitmentDetails(activeTabKey, refreshKey);

  const {
    drawerOpen,
    selectedJobId,
    CandidateID,
    selectedcandidateID,
    jobrequestID,
    reviewerComments,
    acknowledgementCheckbox,
    loadingState,
    openDrawer,
    closeDrawer,
    setComments,
    toggleAcknowledgement,
    setLoadingState,
    setSelectedJobId,
    setSelectedcandidateID,
    setJobrequestID,
    setCandidateID,
  } = useStateOfferRelease();

  // ── Derived values ─────────────────────────────────────────────────────────
  const actionMode = useMemo(() => resolveActionMode(matricID), [matricID]);

  const activeTabs: TabItem | undefined = useMemo(
    () => tabs.find((t) => t.key === activeTabKey),
    [activeTabKey, tabs]
  );

  const totalCount  = items.length;
  const totalPages  = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [currentPage, items, pageSize]);

  // ── Guard: active tab must exist in the list ───────────────────────────────
  useEffect(() => {
    if (!tabs.length) return;
    if (!tabs.some((t) => t.key === activeTabKey)) {
      setActiveTabKey(tabs[0].key);
    }
  }, [tabs]); // activeTabKey intentionally omitted — only react to tabs changing

  // ── Side-nav bootstrap: only runs once after tabs load ─────────────────────
  useEffect(() => {
    if (sideNavflag && tabs.length > 0 && !currentTabName) {
      setMatricID(tabs[0].matricId);
      setCurrentTabName(tabs[1]?.description ?? "");
    }
  }, [tabs.length, sideNavflag, currentTabName]); // stable primitives only

  // ── Page overflow guard ────────────────────────────────────────────────────
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]); // currentPage intentionally omitted — avoids infinite loop

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTabKey(tab.key);
      setSelectedIds([]);
      setCurrentPage(1);
      setMatricID(tab.matricId);
      setCurrentTabName(tab.description);
    },
    [setMatricID, setCurrentTabName]
  );

  const selectedItemRef = useRef<{
  jobId: number;
  candidateID: number;
  selectedcandidateID: number;
  jobrequestID: string;
} | null>(null);

const handleAction = useCallback(
  (item: ISelectedCandidate) => {
    selectedItemRef.current = {
      jobId:              item.RecID,
      candidateID:        item.CandidateID,
      selectedcandidateID: item.ItemID,
      jobrequestID:       item.jobrequestID,
    };
    openDrawer(item.ItemID);
  },
  [openDrawer]
);


  const columns = useMemo(
    () => buildColumns(actionMode, handleAction),
    [actionMode, handleAction]
  );

  return (
    <section className="offer-table">
      <div className="offer-table__tabs">
        <Tabs
          tabs={tabs}
          activeKey={activeTabKey}
          onChange={handleTabChange}
          loading={tabsLoading}
          variant="boxed"
        />
      </div>

      <div className="offer-table__table-card">
        <div className="submission-header">
          <h2 className="submission-header__title">{currentTabName}</h2>

          <div className="submission-header__actions">
            <button
              className="submission-header__refresh-btn"
              onClick={handleRefresh}
              disabled={tableLoading}
              title="Refresh table"
              aria-label="Refresh table"
            >
              <RefreshCw size={14} className={tableLoading ? "spin" : undefined} />
              Refresh
            </button>

            <button
              onClick={() => navigate("/Dashboard")}
              className="submission-header__button"
            >
              <RotateCcw size={14} />
              Back to Dashboard
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginatedItems}
          enableCheckbox={activeTabs?.tableMode === "checkbox"}
          pageSize={pageSize}
          currentPage={currentPage}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          loading={tableLoading}
        />
      </div>

      {/* Conditional render tied to drawerOpen (removed stale ref) */}
      {drawerOpen && (
        <ReviewDocument
          drawerOpen={drawerOpen}
          selectedJobId={selectedItemRef?.current?.jobId ?? 0}
    CandidateID={selectedItemRef?.current?.candidateID ?? 0}
    selectedcandidateID={selectedItemRef?.current?.selectedcandidateID ?? 0}
    jobrequestID={selectedItemRef?.current?.jobrequestID ?? ""}
          reviewerComments={reviewerComments}
          acknowledgementCheckbox={acknowledgementCheckbox}
          loadingState={loadingState}
          onClose={closeDrawer}
          onCommentsChange={setComments}
          onToggleAcknowledgement={toggleAcknowledgement}
          setLoadingState={setLoadingState}
          refreshKey={handleRefresh}
        />
      )}

      <ModalPopup {...modalState} onClose={closeModal} />
    </section>
  );
};