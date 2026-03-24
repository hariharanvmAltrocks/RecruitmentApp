import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Eye, Filter, RotateCcw, Upload, Users } from "lucide-react";
import { useAssignMembers } from "./Hooks/useAssignMembers";
import { useRecruitmentDetails } from "./Hooks/useRecruitmentDetails";
import { useTabDetails } from "./Hooks/useTabDetails";
import { AdvertReviewDrawer } from "./AdvertReviewDrawer/AdvertReviewDrawer";
import { useStateFromManage } from "./AdvertReviewDrawer/StateManage/useStateFromManage";
import {
  AssignmentPayload,
  HrMember,
  RecruitmentItem,
  RecruitmentTabKey,
  TabItem,
} from "./RecruitmentTable.types";
import "./RecruitmentTable.scss";
import { DataTable, DataTableColumn } from "../../Comman/DataTable/DataTable";
import { useUIState } from "../../RecrutimentApp/UIStateContext";
import { DataFrom, ListNames, RoleID, StatusId, WorkflowAction } from "../../../utilities/Config";
import { CommonServices, DashboardServices, RecruitmentServices } from "../../../services/ServiceExport";
import { PostRecuritmentData } from "../../../services/RecruitmentTable/IRecruitmentService";
import { userInfo } from "../../../utilities/hooks/RoleContext";
import { ResponeStatus } from "../../../utilities/ApiConfig";
import { IToast, SuccessToast } from "../../Comman/Toast/SuccessToast";
import Tabs from "../../Comman/Tabs/Tabs";
import { MatricID } from "../../../utilities/ConditionConfig";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../Hooks/useToast";
import { useRecruitmentColumns } from "./config";
import { IEvaluValidate } from "../../../services/Dashboard/IDashboard";

const AssignHRPopup = React.lazy(() => import("./Components/AssignHRPopup/AssignHRPopup").then((module) => ({
  default: module.AssignHRPopup,
})));

export const RecruitmentTable: React.FC = () => {
  const { tabs, loading: tabsLoading } = useTabDetails();
  const { activeTab } = useUIState();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = useState<RecruitmentTabKey>(activeTab as RecruitmentTabKey);
  const { items, loading: tableLoading } = useRecruitmentDetails(activeTabKey);
  const { MatricID: matricID, setMatricID } = useUIState();
  const { roleIDs, ADGroupData } = userInfo();
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

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number>(0);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isopenDrawer, setIsopenDrawer] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedNationality, setSelectedNationality] = useState<string>("");

  const ActiveTabName = useRef<string>(tabs[0]?.label)

  const Submitted = useRef<boolean>(false);
  const { toast, closeToast, showSuccess,showError} = useToast();

  const selectedItems: RecruitmentItem[] = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds]
  );

  const selectedJobCode = useMemo(
    () => selectedItems.length === 1 ? selectedItems[0]?.jobCode : ""
    , [selectedItems]);

    useEffect(() => {
  if (tabs.length > 0 && !ActiveTabName.current) {
    ActiveTabName.current = tabs[0]?.label ?? "";
      setMatricID(tabs[0].matricId);
  }
}, [tabs]);

  const { members, loading: membersLoading } = useAssignMembers(selectedNationality);

  useEffect(() => {
    if (!tabs.length) {
      return;
    }

    const exists = tabs.some((tab) => tab.key === activeTabKey);
    if (!exists) {
      setActiveTabKey(tabs[0].key);
    }
  }, [activeTabKey, tabs]);

  const activeTabs: TabItem | undefined = useMemo(
    () => tabs.find((tab) => tab.key === activeTabKey),
    [activeTabKey, tabs]
  );



  const selectedMember: HrMember | null = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );


  const handleTabChange = useCallback((tab) => {
    setActiveTabKey(tab.key);
    setSelectedIds([]);
    setSelectedMemberId(0);
    setCurrentPage(1);
    setMatricID(tab.matricId);
    ActiveTabName.current = tab.description
  }, []);

  const handleToggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  }, []);

  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [currentPage, items, pageSize]);

  console.log(tabs,"TABSS");
  
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleToggleAll = useCallback(() => {
    const currentPageIds = paginatedItems.map((item) => item.id);
    const allSelectedOnPage = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) => {
      if (allSelectedOnPage) {
        return prev.filter((id) => !currentPageIds.includes(id));
      }

      const merged = new Set([...prev, ...currentPageIds]);
      return Array.from(merged);
    });
  }, [paginatedItems, selectedIds]);

 const handleAction = useCallback(
  async (item: RecruitmentItem) => {
    const { ItemID, jobCode, statusId, requestType, nationality } = item;
    if (matricID === MatricID.EvalutionHR) {
      // const data: IEvaluValidate = {
      //   ID: ItemID,
      //   currentEmailID: ADGroupData.EmailId[0],
      //   statusId,
      // };

      // const res = await DashboardServices.EvalutionValidation(data);

      // if (!res.data) {
      //   showError("Already Submitted");
      //   return;
      // }

      navigate("/Evalution");
      return;
    }

    const routeMap: Record<number, string> = {
      [MatricID.InterviewQuestionHR]: "/QuestionCreation",
      [MatricID.InterviewQuestionLM]: "/QuestionCreation",
      [MatricID.ReviewProfile]: "/CandidateTable",
      [MatricID.AssignInterviewPanel]: "/CandidateTable",
      [MatricID.ReviewScoreCard]: "/CandidateTable",
    };

    const route = routeMap[matricID];

    if (route) {
      navigate(route,{
        state: {
          ID: item.ItemID,
        }
      });
    }
    openDrawer(ItemID);
    setIsopenDrawer(true);
    setSelectedType(requestType);
    setSelectedNationality(nationality);
  },
  [matricID, activeTabs?.actionMode, openDrawer, navigate]
);

  const handleOpenPopup = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

    const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleConfirmAssignment = useCallback(async (payload: AssignmentPayload) => {
        Submitted.current = true
    try {
      const isHRLead = roleIDs.includes(RoleID.RecruitmentHRLead);

      const userIDResult = isHRLead
        ? await CommonServices.getUserIDByEmail(Number(payload.member?.id) ?? 0)
        : null;

      if (isHRLead) {
           const vacancyDetailResults = await Promise.all(
        payload.vacancies.map((vacancy) => {
          const filter = [{
            FilterName: "ID",
            FilterOperator: "eq",
            FilterValue: vacancy.ItemID,
          }];
          return RecruitmentServices.GetNPAEPVRRDetails(filter, "and", vacancy.requestType)
            .then((res) => ({
              vacancy,
              jobDetail: res.data?.[0] ?? null,
            }));
        })
      );

      const unresolved = vacancyDetailResults.filter((r) => !r.jobDetail);
      if (unresolved.length) {
        console.warn("Unresolved job details:", unresolved);
        // showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
        return;
      }
        const batchPayloads: PostRecuritmentData[] = vacancyDetailResults.map(
          ({ vacancy, jobDetail }) => ({
            Data: {
              BusinessUnitCodeId: jobDetail!.BusinessUnitCodeId,
              Nationality: jobDetail!.Nationality,
              EmploymentCategory: jobDetail!.EmploymentCategory,
              DepartmentId: jobDetail!.DepartmentId,
              SubDepartmentId: jobDetail!.SubDepartmentId,
              SectionId: jobDetail!.SectionId,
              DepartmentCodeId: jobDetail!.DepartmentCodeId,
              NumberOfPersonNeeded: Number(jobDetail!.NumberOfPersonNeeded),
              EnterNumberOfMonths: jobDetail!.EnterNumberOfMonths ?? "0",
              TypeOfContract: jobDetail!.TypeOfContract,
              DateRequried: jobDetail!.DateRequried ?? null,
              StatusId: StatusId.HRLeadtoAssignRecruitmentHR,
              ActionId: WorkflowAction.Approved,
              JobCodeId: jobDetail!.JobCodeId,
              AreaofWork: jobDetail!.AreaofWork,
              AssignedHR: userIDResult!.data,
              RecruitmentHRLead: Array.isArray(ADGroupData.EmailId) ? (ADGroupData.EmailId[0] ?? "") : (ADGroupData.EmailId ?? ""),
              DataFrom: jobDetail!.Type ?? "",
              Location: jobDetail!.Location ?? "",
            },
            PositionData: {
              PatersonGradeId: jobDetail!.PatersonGradeId ?? 0,
              DRCGradeId: jobDetail!.DRCGradeId ?? 0,
              JobTitleEnglishId: jobDetail!.JobTitleEnglishId ?? 0,
              JobTitleFrenchId: jobDetail!.JobTitleFrenchId ?? 0,
            },
            CommentsList: {
              RoleId: roleIDs[0],
              RecruitmentIDId: 0,
              Comments: payload.comments ?? "",
            },
            updatePreList: {
              ID: vacancy.ItemID ?? 0,
              ActionId: WorkflowAction.Approved,
              ItemCreated: "Yes",
              IsDataSyncToRecruitment: "No",
            },
          })
        );

        const batchResponse = await RecruitmentServices.InsertRecruitmentDptBatch(batchPayloads);

      if (batchResponse.status === ResponeStatus.SUCCESS) {
  setIsPopupOpen(false);      
  setSelectedIds([]);
  setSelectedMemberId(0);
  showSuccess("Assign HR Successfully");  
   navigate("/RecruitmentTable");
} else {
  showError("Something went wrong. Please try again.");
}}
      setIsPopupOpen(false);
      setSelectedIds([]);
      setSelectedMemberId(0);

    } catch (error) {
      console.error("Critical error during submission:", error);
      // showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
    } finally {
      // setLoadingState(false);
    }
  }, [roleIDs, ADGroupData, setLoadingState]);


  const showAssignmentBar = activeTabs?.tableMode === "checkbox" && selectedIds.length > 0;
  const actionMode = activeTabs?.actionMode ?? "View";


  const columns = useRecruitmentColumns({
  role: matricID === MatricID.EvalutionHR ? "evaluation" : "default",
  actionMode: activeTabs?.actionMode ?? "View",
  onAction: handleAction,
});

  return (
    <section className="recruitment-table">
      {/* <header className="recruitment-table__header">
        <div className="recruitment-table__header-text">
          <h2>Recruitment Menu</h2>
          <p>Manage and review all recruitment requests and documentation.</p>
        </div>
      </header> */}

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
  <h2 className="submission-header__title">{ActiveTabName.current }</h2>

  <button 
    onClick={() => navigate("/Dashboard")}
    className="submission-header__button"
  >
    <RotateCcw size={14} />
    Back to Dashboard
  </button>
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
                onChange={(event) => setSelectedMemberId(Number(event.target.value))}
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
                onClick={handleOpenPopup}
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
      {isopenDrawer && (

        <AdvertReviewDrawer
          drawerOpen={drawerOpen}
          selectedJobId={selectedJobId}
          selectedJobCode={selectedJobCode}
          selectedType={selectedType}
          advertLanguage={advertLanguage}
          reviewerComments={reviewerComments}
          acknowledgementCheckbox={acknowledgementCheckbox}
          loadingState={loadingState}
          onClose={closeDrawer}
          onLanguageChange={setAdvertLanguage}
          onCommentsChange={setComments}
          onToggleAcknowledgement={toggleAcknowledgement}
          setLoadingState={setLoadingState} />
      )}

     {toast.open && (
  <SuccessToast
    show={toast.open}
    type={toast.type}
    title={toast.title}
    message={toast.message}
    autoDismiss={toast.autoDismiss}
    autoDismissDuration={toast.autoDismissDuration}
    onClose={closeToast}
    // onAction={toast.buttonAction}
  />
)}
    </section>
  );
};
