import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, RefreshCw, RotateCcw, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import styles from "./MyTracker.module.scss";

import Loading from "../../../Comman/Loading/loading";
import MetricDashboard from "../../../Comman/MatricBox/matric";
import { DataTable } from "../../../Comman/DataTable/DataTable";
import { ModalPopup } from "../../../Comman/ModalPopup/ModalPopup";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import { useTrackerData } from "../Hooks/usetrackerdata";
import { useDashboardMetrics } from "../Hooks/useDashboardMetrics";
import { useRecruitmentColumns } from "../../RecruitmentTable/config";
import { useAssignMembers } from "../../RecruitmentTable/Hooks/useAssignMembers";
import { useConfirmAssignment } from "../../RecruitmentTable/Hooks/Useconfirmassignment";
import { useAdvertExtends } from "../../RecruitmentTable/AdvertReviewDrawer/Hooks/SaveHooks/useadvertextend";
import { useStateFromManage } from "../../RecruitmentTable/AdvertReviewDrawer/StateManage/useStateFromManage";
import { AdvertReviewDrawer } from "../../RecruitmentTable/AdvertReviewDrawer/AdvertReviewDrawer";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import {
  InterviewLevel,
  MatricID,
  menuID,
} from "../../../../utilities/ConditionConfig";
import { StatusId } from "../../../../utilities/Config";
import { checkIsAlreadySubmitted } from "../../Evalution/Evaluationservice/Evaluationformservice";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { useRecruitmentDetails } from "../../RecruitmentTable/Hooks/useRecruitmentDetails";
import { ISelectedCandidate } from "../../RecruitmentTable/RecruitmentTable.types";
import { ReviewDocument } from "../../OfferRelease/ReviewDocument/ReviewDocument";
import { PortalItem, useUpdateListPortal } from "../../OfferRelease/ReviewDocument/Hooks/Useupdatelistportal";

const AssignHRPopup = React.lazy(() =>
  import("../../RecruitmentTable/Components/AssignHRPopup/AssignHRPopup").then(
    (module) => ({
      default: module.AssignHRPopup,
    }),
  ),
);

const AdvertExtension = React.lazy(() =>
  import("../../RecruitmentTable/Components/AdvertExtension/advertextension").then(
    (module) => ({
      default: module.AdvertExtension,
    }),
  ),
);

interface DashboardProps {
  props: any;
}

const Mytracker: React.FC<DashboardProps> = () => {
  const navigate = useNavigate();

  const { ADGroupData } = userInfo();

  const {
    MatricID: activeMetric,
    setNavigationPath,
    setActiveMenuID,
    setActiveTab,
    setMatricID,
    setCurrentTabName,
    currentTabName,
    navigationPath,
  } = useUIState();

  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isadvertPopupOpen, setAdvertPopupOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number>(0);
  const [selectedmatricId, setselectedmatricId] = useState<string>(currentTabName);
  const [drawerOfferOpen, setDrawerOfferOpen] = useState<boolean>(false);

  const processingRef = useRef(false);
  const selectedAdvertID = useRef<number>(0);
  const ref = useRef(0);

  const drawerMeta = useRef<{
    isOpen: boolean;
    selectedType: string;
  }>({
    isOpen: false,
    selectedType: "",
  });

  const { items: trackerData, loading: trackerLoading } =
    useRecruitmentDetails(refreshKey);

  const martics = useDashboardMetrics(refreshKey);

  const items = trackerData || [];

    const updateList: PortalItem[] = useMemo(() => {
      return items.map((item) => ({
        StatusID: item.statusId,
        ID: item.ItemID,
        JobRequestID: item.jobrequestID,
        EmploymentCategory: item.EmploymentCategory,
        IsExpat: item.IsExpat,
      }));
    }, [items]);
  
    const { updateListPortal } = useUpdateListPortal({
      items: updateList,
      refreshKey,
    });

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

  const { modalState, showModal, closeModal } = useModalPopup();
  

    useEffect(() => {
      if (activeMetric === MatricID.BackgroundCheck || activeMetric === MatricID.LabourHire || activeMetric === MatricID.Kcsa) {
        void updateListPortal();
      }
    }, [activeMetric, refreshKey]);

  const onMetricChange = useCallback(
    (data: any) => {
      setNavigationPath(data.path);
      ref.current = data.menuId;
      setActiveTab(data.TabValue);
      setCurrentTabName(data.TabName);
      setMatricID(data.id);
      setCurrentPage(1);
      setSelectedIds([]);
      setSelectedMemberId(0);
      setselectedmatricId(data?.label);
    },
    [setNavigationPath, setActiveTab, setCurrentTabName, setMatricID],
  );

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const totalCount = items.length;

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds],
  );

  const selectedJobCode = useMemo(
    () => (selectedItems.length === 1 ? selectedItems[0]?.jobCode : ""),
    [selectedItems],
  );

  const selectedNationality = useMemo(
    () => (selectedItems.length > 0 ? selectedItems[0]?.nationality : null),
    [selectedItems],
  );

  const { members, loading: membersLoading } =
    useAssignMembers(selectedNationality);

  const selectedMember = useMemo(
    () => members.find((m) => m.id === selectedMemberId) ?? null,
    [members, selectedMemberId],
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
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id],
      );
    },
    [selectedNationality, items, showModal, closeModal],
  );

  const handleToggleAll = useCallback(() => {
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...prev, ...pageIds])),
    );
    // const allSameNationality = (items: typeof selectedItems): boolean => {
    //   if (items.length === 0) return false;
    //   return items.every((item) => item.nationality === items[0].nationality);
    // };
    // if (!allSameNationality(selectedItems)) {
    //   showModal({
    //     type: "warning",
    //     title: "Nationality Mismatch",
    //     message: "You cannot assign HR for different nationality.",
    //     confirmLabel: "OK",
    //     onConfirm: closeModal,
    //   });
    //   return;
    // }
    const pageIds = paginatedItems.map((item) => item.id);
    const allSelected =
      pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  }, [paginatedItems, selectedIds]);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const {
    handleConfirmAssignment,
    modalState: assignmentModalState,
    closeModal: assignmentCloseModal,
    loading: assignmentLoading,
  } = useConfirmAssignment(handleClosePopup, handleRefresh);

  const {
    handleAdvertExtend,
    modalState: advertModalState,
    closeModal: advertCloseModal,
    loading: advertLoading,
  } = useAdvertExtends(handleClosePopup, handleRefresh, setAdvertPopupOpen);

  const selectedItemRef = useRef<{
    jobId: number;
    candidateID: number;
    selectedcandidateID: number;
    jobrequestID: string;
    IsExpat: boolean;
  } | null>(null);

  const handleActionOffer = useCallback(
    (item: ISelectedCandidate) => {
      selectedItemRef.current = {
        jobId: item.RecID,
        candidateID: item.CandidateID,
        selectedcandidateID: item.ItemID,
        jobrequestID: item.jobrequestID,
        IsExpat: item.IsExpat,
      };
      setDrawerOfferOpen(true);
    },
    [drawerOfferOpen],
  );

  const handleAction = useCallback(
    async (item: any) => {
      if (processingRef.current) return;
      processingRef.current = true;
      try {
        const { ItemID } = item;

        const isEvaluationFlow =
          activeMetric === MatricID.EvalutionHR ||
          activeMetric === MatricID.EvalutionLM ||
          activeMetric === MatricID.EvalutionHOD ||
          activeMetric === MatricID.EvalutionEXCO;

        if (activeMetric === MatricID.advertExtension) {
          setAdvertPopupOpen(true);
          selectedAdvertID.current = item.ItemID;
          return;
        }

        if (isEvaluationFlow) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const interviewDate = new Date(item.interviewDate);
          interviewDate.setHours(0, 0, 0, 0);
          const Validation = interviewDate <= today;
          const interviewLevel =
            item.statusId === StatusId.InterviewLevel2InProgress
              ? InterviewLevel.Level2
              : InterviewLevel.Level1;

          const alreadySubmitted = await checkIsAlreadySubmitted(
            ItemID,
            ADGroupData.EmailId[0],
            interviewLevel,
          );

          if (!Validation) {
            showModal({
              type: "warning",
              title: "Interview Date Not Reached",
              message: `You can only fill the scorecard after the interview date. ${moment(
                item.interviewDate,
              ).format("YYYY-MM-DD")}`,
              confirmLabel: "OK",
              onConfirm: closeModal,
            });
            return;
          }

          if (alreadySubmitted) {
            showModal({
              type: "warning",
              title: "Already Submitted",
              message:
                "The scorecard for this candidate has already been submitted.",
              confirmLabel: "OK",
              onConfirm: closeModal,
            });
            return;
          }
        }

        const evalutionIDs = [
          MatricID.EvalutionHR,
          MatricID.EvalutionLM,
          MatricID.EvalutionHOD,
          MatricID.EvalutionEXCO,
        ];

        const routeMap: Record<number, string> = {
          [MatricID.InterviewQuestionHR]: "/QuestionCreation",
          [MatricID.DisqualifiQuesLM]: "/QuestionCreation",
          [MatricID.InterviewQuestionLM]: "/QuestionCreation",
          [MatricID.ReviewProfileHR]: "/CandidateTable",
          [MatricID.ReviewProfileLM]: "/CandidateTable",
          [MatricID.AssignInterviewPanel]: "/CandidateTable",
          [MatricID.ReviewScoreCard]: "/ReviewScoreCard",
          ...Object.fromEntries(
            evalutionIDs.map((id) => [
              id,
              item.statusId === StatusId.InterviewLevel2InProgress
                ? "/EvalutionL2"
                : "/Evalution",
            ]),
          ),
        };

        const route = routeMap[activeMetric];

        if (route) {
          navigate(route, {
            state: {
              ID: ItemID,
              RecruitmentID: item.RecID,
              department: item.department,
              StatusID: item.statusId,
              EmailID: ADGroupData.EmailId[0],
              InterviewLevels: item?.interviewLevels,
            },
          });
          return;
        }

        drawerMeta.current = {
          isOpen: true,
          selectedType: item.requestType,
        };

        openDrawer(ItemID);
      } finally {
        processingRef.current = false;
      }
    },
    [
      activeMetric,
      navigate,
      openDrawer,
      showModal,
      closeModal,
      ADGroupData.EmailId,
    ],
  );

  const columns = useRecruitmentColumns({
    role:
      activeMetric === MatricID.EvalutionHR ||
      activeMetric === MatricID.EvalutionLM ||
      activeMetric === MatricID.EvalutionHOD ||
      activeMetric === MatricID.EvalutionEXCO
        ? "evaluation"
        : activeMetric === MatricID.LabourHire ||
            activeMetric === MatricID.Kcsa ||
            activeMetric === MatricID.BackgroundCheck ||
            activeMetric === MatricID.MySubmissionBGV
          ? "OfferRelease"
          : "default",
    actionMode: "View",
    onAction:
      activeMetric === MatricID.LabourHire ||
      activeMetric === MatricID.Kcsa ||
      activeMetric === MatricID.BackgroundCheck ||
      activeMetric === MatricID.MySubmissionBGV
        ? handleActionOffer
        : handleAction,
  });

  const loading =
    martics.loading || trackerLoading || martics.metrics.length === 0 || assignmentLoading || advertLoading;
  const hasMetrics = martics.metrics.length > 0;
  const showAssignmentBar =
    (activeMetric === MatricID.AssignHr || activeMetric === MatricID.AssignAgencies) && selectedIds.length > 0 && members.length > 0;

  const metricsContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={styles.dashboard}
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {loading ? (
          <Loading />
        ) : (
          <motion.div
            key="dashboard-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {!hasMetrics ? (
              <div className={styles["dashboard-empty"]}>
                <div className={styles["dashboard-empty__title"]}>
                  No dashboard metrics available
                </div>
                <div className={styles["dashboard-empty__subtitle"]}>
                  Please check your permissions or try again later.
                </div>
              </div>
            ) : (
              <>
                {/* ── Metrics Row ── */}
                <motion.div
                  className={styles["metrics-grid"]}
                  variants={metricsContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <MetricDashboard
                    metrics={martics.metrics}
                    onCardClick={onMetricChange}
                    loading={loading}
                    handleRefresh={handleRefresh}
                    active={activeMetric}
                  />
                </motion.div>

                {/* ── Tracker Card ── */}
                <div className={styles["tracker-panel"]}>
                  <motion.div
                    className={styles.tracker}
                    key="tracker"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Card Header */}
                    <div className={styles["tracker__header"]}>
                      <div className={styles["tracker__header-left"]}>
                        <h2 className={styles["tracker__title"]}>
                          Recruitment Backlog
                        </h2>
                        <p className={styles["tracker__subtitle"]}>
                          Showing <strong>{trackerData?.length ?? 0}</strong>{" "}
                          results for{" "}
                          <span className={styles["tracker__highlight"]}>
                            {selectedmatricId ?? "—"}
                          </span>
                        </p>
                      </div>

                      <div className={styles["tracker__header-actions"]}>
                        <button
                          className={styles["tracker__action-btn"]}
                          onClick={handleRefresh}
                          disabled={trackerLoading}
                          title="Refresh table"
                          aria-label="Refresh table"
                        >
                          <RefreshCw
                            size={13}
                            className={trackerLoading ? styles.spin : undefined}
                          />
                          Refresh
                        </button>

                        <div className={styles["tracker__divider"]} />

                        <button
                          className={styles["tracker__action-btn"]}
                          onClick={() => {
                            navigate("/Dashboard");
                            setActiveMenuID(menuID.Dashboard);
                          }}
                        >
                          <RotateCcw size={13} />
                          Back to Dashboard
                        </button>
                      </div>
                    </div>

                    {/* Card Body – Table */}
                    <div className={styles["tracker__table-wrapper"]}>
                      <DataTable
                        columns={columns}
                        data={paginatedItems}
                        enableCheckbox={activeMetric === MatricID.AssignHr || activeMetric === MatricID.AssignAgencies}
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
                        loading={trackerLoading}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* ── Assignment Bar ── */}
                {showAssignmentBar && (
                  <div className={styles.assignment}>
                    <div className={styles["assignment-bar"]}>
                      <div className={styles["assignment-bar__left"]}>
                        <div className={styles["assignment-bar__icon"]}>
                          <Users size={18} />
                        </div>
                        <div className={styles["assignment-bar__count"]}>
                          <strong>{selectedIds.length}</strong>
                          <span>Vacancies Selected</span>
                        </div>
                      </div>

                      <div className={styles["assignment-bar__controls"]}>
                        <select
                          className={styles["assignment-bar__select"]}
                          value={selectedMemberId}
                          onChange={(e) =>
                            setSelectedMemberId(Number(e.target.value))
                          }
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
                          className={styles["assignment-bar__button"]}
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

                {/* ── Lazy Popups ── */}
                {isPopupOpen && (
                  <Suspense fallback={null}>
                    <AssignHRPopup
                      isOpen={isPopupOpen}
                      selectedItems={selectedItems}
                      assignedMember={selectedMember}
                      onClose={handleClosePopup}
                      oncancel={handleClosePopup}
                      onConfirm={handleConfirmAssignment}
                    />
                  </Suspense>
                )}

                {isadvertPopupOpen && (
                  <Suspense fallback={null}>
                    <AdvertExtension
                      RecruitmentID={selectedAdvertID.current}
                      onClose={() => setAdvertPopupOpen(false)}
                      useDataExtension={(payload) => ({
                        triggerExtension: () => {
                          void handleAdvertExtend(payload);
                        },
                      })}
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

                {drawerOfferOpen && (
                  <ReviewDocument
                    drawerOpen={drawerOfferOpen}
                    selectedJobId={selectedItemRef?.current?.jobId ?? 0}
                    CandidateID={selectedItemRef?.current?.candidateID ?? 0}
                    selectedcandidateID={
                      selectedItemRef?.current?.selectedcandidateID ?? 0
                    }
                    IsExpat={selectedItemRef?.current?.IsExpat ?? false}
                    jobrequestID={selectedItemRef?.current?.jobrequestID ?? ""}
                    reviewerComments={reviewerComments}
                    acknowledgementCheckbox={acknowledgementCheckbox}
                    loadingState={loadingState}
                    onClose={() => setDrawerOfferOpen(false)}
                    onCommentsChange={setComments}
                    onToggleAcknowledgement={toggleAcknowledgement}
                    setLoadingState={setLoadingState}
                    refreshKey={handleRefresh}
                  />
                )}

                {/* ── Modals ── */}
                <ModalPopup
                  {...assignmentModalState}
                  onClose={assignmentCloseModal}
                />
                <ModalPopup {...modalState} onClose={closeModal} />
                <ModalPopup {...advertModalState} onClose={advertCloseModal} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Mytracker;
