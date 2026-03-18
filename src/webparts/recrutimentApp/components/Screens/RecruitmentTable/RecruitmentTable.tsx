import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, Eye, Filter, Upload, Users } from "lucide-react";
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
import { CommonServices, RecruitmentServices } from "../../../services/ServiceExport";
import { PostRecuritmentData } from "../../../services/RecruitmentTable/IRecruitmentService";
import { userInfo } from "../../../utilities/hooks/RoleContext";
import { ResponeStatus } from "../../../utilities/ApiConfig";
import { IToast, SuccessToast } from "../../Comman/Toast/SuccessToast";
import Tabs from "../../Comman/Tabs/Tabs";
import { MatricID } from "../../../utilities/ConditionConfig";
import { useNavigate } from "react-router-dom";

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
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isopenDrawer, setIsopenDrawer] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedNationality, setSelectedNationality] = useState<string>("");
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastprops, setToastProps] = useState<IToast>({
    title: "",
    message: "",
  });
  const [isQuestiontab, setIsQuestionTab] =useState<boolean>(false);


  const selectedItems: RecruitmentItem[] = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id)),
    [items, selectedIds]
  );

  const selectedJobCode = useMemo(
    () => selectedItems.length === 1 ? selectedItems[0]?.jobCode : ""
    , [selectedItems]);


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

  const handleAction = useCallback((item: RecruitmentItem) => {
    const actionLabel = activeTabs?.actionMode === "Upload" ? "Upload" : "View";
    const message = `${actionLabel} action clicked for ${item.jobCode}`;
    if(matricID == MatricID.InterviewQuestionHR || matricID == MatricID.InterviewQuestionLM){
       setIsQuestionTab(true);
       navigate("/QuestionCreation")
    }else if (matricID == MatricID.ReviewProfile || matricID == MatricID.AssignInterviewPanel || matricID == MatricID.ReviewScoreCard){
      navigate("/QuestionCreation")
    }
    openDrawer(item.ItemID);
    setIsopenDrawer(true);
    setSelectedType(item.requestType);
    setSelectedNationality(item.nationality);
    setIsToastOpen(true);
    setToastProps({
      type: "warning",
      title: "Warning",
      message: "Are you sure you want cancel",
      autoDismissDuration: 45
    });



  }, [activeTabs?.actionMode, openDrawer]);

  const handleOpenPopup = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsToastOpen(true);
    setToastProps({
      type: "warning",
      title: "Warning",
      message: "Are you sure you want cancel",
      autoDismissDuration: 45
    });
    setIsPopupOpen(false);
  }, []);

  //  const constructAgentDetails = async (
  //   selectedJob: any,
  //   agencies: AutoCompleteItem[],
  // ) => {
  //   const { data: allAgents } = await CommonServices.GetMasterData(
  //     ListNames.HRMSExternalAgents,
  //   );

  //   const matchedAgents = allAgents.filter((agent: { Id: number }) =>
  //     agencies.some((item) => item.key === agent.Id),
  //   );

  //   const agentDetails: jobsXAgents[] = matchedAgents.map((item: any) => ({
  //     agentId: item.AgentCode,
  //   }));

  //   const jobUniqueValue = await RecruitmentServices.GetJobUniqueDataValue(
  //     [
  //       {
  //         FilterKey: "JobCodeId",
  //         Operator: "eq",
  //         FilterValue: selectedJob?.JobCodeId,
  //       },
  //       { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
  //     ],
  //     "and",
  //   );

  //   const jobUniqueData = jobUniqueValue.data[0]?.JobUniqueKey || "";

  //   return {
  //     jobCode: jobUniqueData,
  //     jobsXAgents: agentDetails,
  //   };
  // };

  const handleConfirmAssignment = useCallback(async (payload: AssignmentPayload) => {

    try {
      const isHRLead = roleIDs.includes(RoleID.RecruitmentHRLead);

      const userIDResult = isHRLead
        ? await CommonServices.getUserIDByEmail(Number(payload.member?.id) ?? 0)
        : null;

      // if (isHRLead && !userIDResult?.data) {
      //   showAlert("Failed to resolve HR user ID.", HRMSAlertOptions.Error);
      //   return;
      // }

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

      if (isHRLead) {
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

        if (batchResponse.status !== ResponeStatus.SUCCESS) {
          // showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error, closeAlert);
          return;
        }

      } else {
        // if (!formData.assignRecruitmentAgencies.length) {
        // showAlert("No agencies selected.", HRMSAlertOptions.Error);
        // return;
        // }

        // const agencyResults = await Promise.all(
        //   vacancyDetailResults.map(async ({ vacancy, jobDetail }) => {
        //     const recruitmentID = jobDetail!.ID as number;

        //     const agentDetailsPayload = await constructAgentDetails(
        //       vacancy,
        //       payload.member?.id,
        //     );

        //     const [upsertRes, agencyRes] = await Promise.all([
        //       GetPortalJobsService.UpsertAgenciesJobs(agentDetailsPayload),
        //       getVRRDetails.InsertExternalAgencyDetails(
        //         formData.assignRecruitmentAgencies.map((agency) => ({
        //           key:           agency.key,
        //           text:          agency.text,
        //           RecruitmentID: recruitmentID,
        //         })),
        //         recruitmentID
        //       ),
        //     ]);

        //     if (
        //       upsertRes.status  !== ResponeStatus.SUCCESS ||
        //       agencyRes.status  !== ResponeStatus.SUCCESS
        //     ) {
        //       return false;
        //     }

        //     const commentsRes = await getVRRDetails.InsertCommentsList({
        //       RoleId:          RoleID.RecruitmentHR,
        //       RecruitmentIDId: recruitmentID,
        //       Comments:        formData.comments,
        //     });

        //     return commentsRes.status === ResponeStatus.SUCCESS;
        //   })
        // );

        // if (agencyResults.some((r) => r === false)) {
        //   showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error, closeAlert);
        //   return;
        // }
      }

      // ── 6. Success ─────────────────────────────────────────────────────────
      // showAlert(
      //   payload.vacancies.length === 1
      //     ? RecuritmentHRMsg.SingleHRSuccessMsg
      //     : RecuritmentHRMsg.HRSuccess,
      //   HRMSAlertOptions.Success,
      //   () => {
      //     setAssignDialogOpen(false);
      //     clearSelection();
      //     refreshData();
      //     closeAlert();
      //   }
      // );

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
  const columns: DataTableColumn<RecruitmentItem>[] = useMemo(
    () => [
      {
        id: "jobCode",
        header: "Job Code",
        accessor: "jobCode",
        cellClassName: "data-table__cell--muted",
      },
      {
        id: "title",
        header: "Job Title & Dept",
        render: (item) => (
          <div className="data-table__job-title">
            <span>{item.title}</span>
            <span className="data-table__job-dept">{item.department}</span>
          </div>
        ),
      },
      {
        id: "count",
        header: "Count",
        render: (item) => String(item.count).padStart(2, "0"),
        cellClassName: "data-table__cell--count",
        align: "center",
        hideOnMobile: true,
      },
      {
        id: "requestType",
        header: "Request Type",
        accessor: "requestType",
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "nationality",
        header: "Nationality",
        accessor: "nationality",
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "status",
        header: "Status",
        render: (item) => <span className="data-table__status-badge status-badge">{item.status}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cellClassName: "data-table__cell--actions",
        render: (item) => (
          <button
            className="data-table__action-btn"
            onClick={() => handleAction(item)}
            type="button"
            aria-label={actionMode === "Upload" ? "Upload document" : "View vacancy"}
          >
            {actionMode === "Upload" ? <Upload size={16} /> : <Eye size={16} />}
            {actionMode === "Upload" ? "Upload" : "View"}
          </button>
        ),
      },
    ],
    [actionMode, handleAction]
  );

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

      {isToastOpen && (
        <SuccessToast
          show={isToastOpen}
          type={toastprops.type}
          title={toastprops.title}
          message={toastprops.message}
          autoDismiss={toastprops.autoDismiss}
          autoDismissDuration={toastprops.autoDismissDuration}
          onClose={() => setIsToastOpen(false)}
        />
      )}
    </section>
  );
};
