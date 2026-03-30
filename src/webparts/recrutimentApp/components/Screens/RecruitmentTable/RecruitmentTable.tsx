import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronRight, RefreshCw, RotateCcw, Users } from "lucide-react";
import { useAssignMembers } from "./Hooks/useAssignMembers";
import { useRecruitmentDetails } from "./Hooks/useRecruitmentDetails";
import { useTabDetails } from "./Hooks/useTabDetails";
import { AdvertReviewDrawer } from "./AdvertReviewDrawer/AdvertReviewDrawer";
import { useStateFromManage } from "./AdvertReviewDrawer/StateManage/useStateFromManage";
import {
  HrMember,
  RecruitmentItem,
  RecruitmentTabKey,
  TabItem,
} from "./RecruitmentTable.types";
import "./RecruitmentTable.scss";
import { DataTable } from "../../Comman/DataTable/DataTable";
import { useUIState } from "../../RecrutimentApp/UIStateContext";
import { MatricID } from "../../../utilities/ConditionConfig";
import { useNavigate } from "react-router-dom";
import { useRecruitmentColumns } from "./config";
import { ModalPopup } from "../../Comman/ModalPopup/ModalPopup";
import { useConfirmAssignment } from "./Hooks/Useconfirmassignment";
import { useModalPopup } from "../../Comman/ModalPopup/useModalPopup";
import Tabs from "../../Comman/Tabs/Tabs";

const AssignHRPopup = React.lazy(() =>
  import("./Components/AssignHRPopup/AssignHRPopup").then((module) => ({
    default: module.AssignHRPopup,
  }))
);

export const RecruitmentTable: React.FC = () => {
  const { tabs, loading: tabsLoading } = useTabDetails();
  const { activeTab } = useUIState();
  const navigate = useNavigate();

  const [activeTabKey, setActiveTabKey] = useState<RecruitmentTabKey>(
    activeTab as RecruitmentTabKey
  );

  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const { items, loading: tableLoading } = useRecruitmentDetails(
    activeTabKey,
    refreshKey
  );

  const {
    MatricID: matricID,
    setMatricID,
    sideNavflag,
    setCurrentTabName,
    currentTabName,
  } = useUIState();

  const {
    drawerOpen,
    selectedJobId,
    advertLanguage,
    reviewerComments,
    acknowledgementCheckbox,
    loadingState,
    openDrawer,
    closeDrawer,
    setAdvertLanguage,
    setComments,
    toggleAcknowledgement,
    setLoadingState,
  } = useStateFromManage();

  const drawerMeta = useRef<{ isOpen: boolean; selectedType: string }>({
    isOpen: false,
    selectedType: "",
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleClosePopup = useCallback(() => setIsPopupOpen(false), []);

  const {
    handleConfirmAssignment,
    modalState: assignmentModalState,
    closeModal: assignmentCloseModal,
  } = useConfirmAssignment(handleClosePopup, handleRefresh);

  const { modalState, showModal, closeModal } = useModalPopup();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number>(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds]
  );

  const selectedJobCode = useMemo(
    () => (selectedItems.length === 1 ? selectedItems[0]?.jobCode : ""),
    [selectedItems]
  );

  const selectedNationality = useMemo(
    () => (selectedItems.length === 1 ? selectedItems[0]?.nationality : ""),
    [selectedItems]
  );

  const { members, loading: membersLoading } =
    useAssignMembers(selectedNationality);

  const selectedMember: HrMember | null = useMemo(
    () => members.find((m) => m.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  const activeTabs: TabItem | undefined = useMemo(
    () => tabs.find((tab) => tab.key === activeTabKey),
    [activeTabKey, tabs]
  );

  useEffect(() => {
    if (sideNavflag && tabs.length > 0 && !currentTabName) {
      setMatricID(tabs[0].matricId);
      setCurrentTabName(tabs[1]?.description ?? "");
    }
  }, [tabs]);

  useEffect(() => {
    if (!tabs.length) return;
    const exists = tabs.some((tab) => tab.key === activeTabKey);
    if (!exists) setActiveTabKey(tabs[0].key);
  }, [activeTabKey, tabs]);

  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [currentPage, items, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTabKey(tab.key);
      setSelectedIds([]);
      setSelectedMemberId(0);
      setCurrentPage(1);
      setMatricID(tab.matricId);
      setCurrentTabName(tab.description);
    },
    [setMatricID, setCurrentTabName]
  );

  const handleToggleRow = useCallback(
    (id: string) => {
      if (selectedNationality) {
        const item = items.find((i) => i.id === id);
        if (item?.nationality !== selectedNationality) {
          showModal({
            type: "warning",
            title: "Nationality Mismatch",
            message: "You cannot assign HR for different nationality.",
            confirmLabel: "OK",
            onConfirm: closeModal,
          });
          return;
        }
      }
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
      );
    },
    [selectedNationality, items, showModal, closeModal]
  );

  const handleToggleAll = useCallback(() => {
    const pageIds = paginatedItems.map((item) => item.id);
    const allSelected =
      pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...prev, ...pageIds]))
    );
  }, [paginatedItems, selectedIds]);

  const handleAction = useCallback(
    async (item: RecruitmentItem) => {
      const { ItemID, requestType } = item;

      if (matricID === MatricID.EvalutionHR) {
        navigate("/Evalution");
        return;
      }

      const routeMap: Record<number, string> = {
        [MatricID.InterviewQuestionHR]: "/QuestionCreation",
        [MatricID.InterviewQuestionLM]: "/QuestionCreation",
        [MatricID.ReviewProfileHR]: "/CandidateTable",
        [MatricID.ReviewProfileLM]: "/CandidateTable",
        [MatricID.AssignInterviewPanel]: "/CandidateTable",
        [MatricID.ReviewScoreCard]: "/CandidateTable",
        [MatricID.EvalutionHR]: "/Evalution",
        [MatricID.EvalutionLM]: "/Evalution",
        [MatricID.ReviewScoreCard]: "/ReviewScoreCard",
      };

      const route = routeMap[matricID];
      if (route) {
        navigate(route, { state: { ID: ItemID } });
        return;
      }

      drawerMeta.current = { isOpen: true, selectedType: requestType };
      openDrawer(ItemID);
    },
    [matricID, navigate, openDrawer]
  );

  const showAssignmentBar =
    activeTabs?.tableMode === "checkbox" && selectedIds.length > 0;

  const columns = useRecruitmentColumns({
    role: matricID === MatricID.EvalutionHR ? "evaluation" : "default",
    actionMode: activeTabs?.actionMode ?? "View",
    onAction: handleAction,
  });

  return (
    <section className="recruitment-table">
      <div className="recruitment-table__tabs">
        <Tabs
          tabs={tabs}
          activeKey={activeTabKey}
          onChange={handleTabChange}
          loading={tabsLoading}
          variant="boxed"
        />
      </div>

      <div className="recruitment-table__table-card">
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
              <RefreshCw
                size={14}
                className={tableLoading ? "spin" : undefined}
              />
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
          selectedRowIds={selectedIds}
          getRowId={(item) => item.id}
          onToggleRow={handleToggleRow}
          onToggleAll={handleToggleAll}
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

      {showAssignmentBar && (
        <div className="assignment">
          <div className="assignment-bar">
            <div className="assignment-bar__left">
              <div className="assignment-bar__icon">
                <Users size={18} />
              </div>
              <div className="assignment-bar__count">
                <strong>{selectedIds.length}</strong>
                <span>Vacancies Selected</span>
              </div>
            </div>

            <div className="assignment-bar__controls">
              <select
                className="assignment-bar__select"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(Number(e.target.value))}
                disabled={membersLoading}
              >
                <option value="">Choose HR member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>

              <button
                className="assignment-bar__button"
                type="button"
                onClick={() => setIsPopupOpen(true)}
                disabled={!selectedMemberId}
              >
                Execute Assignment
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <Suspense fallback={null}>
          <AssignHRPopup
            isOpen={isPopupOpen}
            selectedItems={selectedItems}
            assignedMember={selectedMember}
            onClose={handleClosePopup}
            onConfirm={handleConfirmAssignment}
          />
        </Suspense>
      )}

      {drawerMeta.current.isOpen && (
        <AdvertReviewDrawer
          drawerOpen={drawerOpen}
          selectedJobId={selectedJobId}
          selectedJobCode={selectedJobCode}
          selectedType={drawerMeta.current.selectedType}
          advertLanguage={advertLanguage}
          reviewerComments={reviewerComments}
          acknowledgementCheckbox={acknowledgementCheckbox}
          loadingState={loadingState}
          onClose={closeDrawer}
          onLanguageChange={setAdvertLanguage}
          onCommentsChange={setComments}
          onToggleAcknowledgement={toggleAcknowledgement}
          setLoadingState={setLoadingState}
          refreshKey={handleRefresh}
        />
      )}

      <ModalPopup {...assignmentModalState} onClose={assignmentCloseModal} />
      <ModalPopup {...modalState} onClose={closeModal} />
    </section>
  );
};