import * as React from "react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import {
  GetPortalJobsService,
  getVRRDetails,
  InterviewServices,
} from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  ApplicationStatusId,
  HRMSAlertOptions,
  ResponeStatus,
  RoleID,
  RoleName,
  StatusId,
  TabName,
  tabType,
  workflowStatusApi,
} from "../../utilities/Config";
import CommentsPopup from "../../components/CommentsPopup";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import {
  FilterItem,
  GetProfileByFilter,
  GetProfileByJobCode,
} from "../../Models/ApIInterface";
import TabsComponent from "../../components/TabsComponent ";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { alertPropsData } from "../../Models/Screens";
import * as moment from "moment";
import { tabStyle } from "../../components/TabMerge";
import ToolTipButton from "../../components/Tooltip";
import {
  ButtonAction,
  JobAdvertAlertMsg,
  PendingCandidateAlertMsg,
} from "../../utilities/LabelName";

type tabCount = {
  ReviewProfileCount: number;
  Level1Count: number;
  Level2Count: number;
  ONHoldRejectedCount: number;
  InterviewPanelCount: number;
  InterviewPanel2Count: number;
  RescheduleCount: number;
};

const ReviewCandidateList = (props: any) => {
  // State
  const [CandidateData, setCandidateData] = useState<GetProfileByJobCode[] | null>([]);
  const [rows, setRows] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [RecruitmentDetails, setRecruitmentDetails] = useState<any[]>([]);
  const [CommentsPopups, setCommentsPopup] = useState<boolean>(false);
  const [activeTab, setactiveTab] = useState<string>("tab1");
  const [breadcrumbTab, setBreadcrumbTab] = useState<string>(props.stateValue?.tabs || "tab1");
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  // const [prevActiveTab, setPrevActiveTab] = useState<string | null>(null);
  const [AlertPopupOpen, setAlertPopupOpen] = useState<boolean>(false);
  const [alertProps, setalertProps] = useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [JobUniqueValue, setJobUniqueValue] = useState<string>("");
  const [pagination, setPagination] = useState({
    first: 0,
    rows: 5,
    totalPages: 1,
  });
  const [pendingcount, setPendingCount] = useState<tabCount>({
    ReviewProfileCount: 0,
    Level1Count: 0,
    Level2Count: 0,
    ONHoldRejectedCount: 0,
    InterviewPanelCount: 0,
    InterviewPanel2Count: 0,
    RescheduleCount: 0,
  });
  const [pendingInfo, setPendingInfo] = useState<any>(null);

  // Constants
  const isLineManager = useMemo(() => props.CurrentRoleID.includes(RoleID.LineManager), [props.CurrentRoleID]);
  const isRecruitmentHR = useMemo(() => props.CurrentRoleID.includes(RoleID.RecruitmentHR), [props.CurrentRoleID]);

  // --- API CALLS (useCallback) ---

  const fetchRecuritmentData = useCallback(async () => {
    const filterConditions = [{ FilterKey: "ID", Operator: "eq", FilterValue: props.stateValue.ID }];
    const res = await getVRRDetails.GetRecruitmentDetails(filterConditions, "");
    if (res.status === 200 && res.data !== null) {
      setRecruitmentDetails(res.data);
    }
  }, [props.stateValue.ID]);

  const pendingcountTabs = useCallback(async (jobUniqueKey: string) => {
    setIsLoading(true);
    try {
      let FilterValueData: GetProfileByFilter = { filterValue: "", sortBy: "", sortOrder: 0, pageSize: 10000, currentPage: 0, totalItems: 0 };
      let FilterValue: FilterItem = {
        jobCode: jobUniqueKey,
        workflowStausId: [
          workflowStatusApi.LineManagerL1Pending, workflowStatusApi.LineManagerL2Pending,
          workflowStatusApi.LineManagerLevel1OnHold, workflowStatusApi.LineManagerLevel2OnHold,
          workflowStatusApi.LineManagerLevel1Rejected, workflowStatusApi.LineManagerLevel2Rejected,
          workflowStatusApi.pendingHODSelection, workflowStatusApi.CandidateSelectedIPanel,
          workflowStatusApi.CandidateRejectedIPanel, workflowStatusApi.PendingRecruitmentHRscheduleInterview,
          workflowStatusApi.HRPending,
        ],
        pagination: FilterValueData,
      };

      const res = await GetPortalJobsService.getCandidateDetailsInJobCode(FilterValue);
      const data = res.data || [];
      
      const counts = {
        ReviewProfileCount: data.filter(i => i.workflowStatusId === workflowStatusApi.HRPending).length,
        Level1Count: data.filter(i => i.workflowStatusId === workflowStatusApi.LineManagerL1Pending).length,
        Level2Count: data.filter(i => i.workflowStatusId === workflowStatusApi.LineManagerL2Pending).length,
        ONHoldRejectedCount: data.filter(i => [workflowStatusApi.LineManagerLevel1OnHold, workflowStatusApi.LineManagerLevel2OnHold].includes(i.workflowStatusId)).length,
        InterviewPanelCount: data.filter(i => i.workflowStatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview).length,
      };

      const interviewRes = await InterviewServices.GetCandidateDetailsInterviewPanalDashboard(
        [{ FilterKey: "JobCode", Operator: "eq", FilterValue: props?.stateValue?.JobCodeID }, { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" }], ""
      );

      const interviewData = interviewRes.data || [];
      setPendingCount(prev => ({
        ...prev,
        ...counts,
        InterviewPanel2Count: interviewData.filter((i: any) => i.StatusId === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel && i.ItemCreated === "No").length,
        RescheduleCount: interviewData.filter((i: any) => [StatusId.InterviewScheduled, StatusId.InterviewScheduledforLevel2, StatusId.Rescheduled].includes(i.StatusId)).length,
      }));
    } catch (error) {
      console.error("Error in pendingcountTabs", error);
    } finally {
      setIsLoading(false);
    }
  }, [props.stateValue?.JobCodeID]);

  const fetchCandidateData = useCallback(async (tabs: string, row: number, jobUniqueKey: string) => {
    setIsLoading(true);
    try {
      if ((tabs === "tab2" || tabs === "tab3") && props.stateValue?.TabNames === TabName.AssignInterviewPanel) {
        let filter = [];
        if (tabs === "tab3") {
          filter.push({ FilterKey: "StatusId", Operator: "in", FilterValue: [StatusId.InterviewScheduledforLevel2, StatusId.InterviewScheduled, StatusId.Rescheduled] });
        } else {
          filter.push({ FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel });
        }
        filter.push({ FilterKey: "JobCode", Operator: "eq", FilterValue: props?.stateValue?.JobCodeID }, { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" });
        
        const res = await InterviewServices.GetCandidateDetailsInterviewPanalDashboard(filter, tabs === "tab3" ? "and" : "");
        if (res.status === 200 && res.data) {
          setCandidateData(res.data.map((item: any) => ({
            SNO: item.SNO,
            CandidateID: item?.ID,
            ApplicantName: `${item?.FristName || ""} ${item?.LastName || ""}`,
            PositionTitle: item?.PositionTitle,
            JobCode: item?.JobCode,
            Status: item?.Status,
            workflowStatusId: item?.StatusId,
            TotalItems: res.data.length,
          })));
        }
      } else {
        let statusIds: string[] = [];
        if (tabs === "tab1") {
          statusIds = props.stateValue?.TabNames === TabName.AssignInterviewPanel ? [workflowStatusApi.PendingRecruitmentHRscheduleInterview] : 
                      isLineManager ? [workflowStatusApi.LineManagerL1Pending] : [workflowStatusApi.HRPending];
        } else if (tabs === "tab2") {
          statusIds = isLineManager ? [workflowStatusApi.PendingRecruitmentHRscheduleInterview] : 
                      [workflowStatusApi.HRRejected, workflowStatusApi.LineManagerL1Pending, workflowStatusApi.LineManagerL2Pending, workflowStatusApi.LineManagerLevel1OnHold, workflowStatusApi.LineManagerLevel2OnHold, workflowStatusApi.LineManagerLevel1Rejected, workflowStatusApi.LineManagerLevel2Rejected, workflowStatusApi.CandidateRejectedIPanel, workflowStatusApi.PendingRecruitmentHRscheduleInterview, ApplicationStatusId.ApplicationSuspended];
        } else if (tabs === "tab2 - Level 2" && isLineManager) {
          statusIds = [workflowStatusApi.LineManagerL2Pending];
        } else if (tabs === "tab3") {
          statusIds = isLineManager ? [workflowStatusApi.LineManagerLevel1OnHold, workflowStatusApi.LineManagerLevel2OnHold, workflowStatusApi.LineManagerLevel1Rejected, workflowStatusApi.LineManagerLevel2Rejected] : [workflowStatusApi.HROnHold, workflowStatusApi.HRRejected];
        }

        const filter: FilterItem = {
          jobCode: jobUniqueKey,
          workflowStausId: statusIds,
          pagination: { filterValue: "", sortBy: "", sortOrder: 0, pageSize: row || rows, currentPage: 0, totalItems: 0 }
        };
        const res = await GetPortalJobsService.getCandidateDetailsInJobCode(filter);
        setCandidateData(res.data);
      }
    } catch (error) {
      console.error("Candidate Api failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [props.stateValue?.TabNames, props.stateValue?.JobCodeID, isLineManager, rows]);

  const handleRedirectView = useCallback((rowData: any, tab: string, TabNamed: string, ButtonActionType: string, PreActionBtn: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const { JobPostingEndDate, JobPostingFirstExtensionEndDate, JobPostingSecondExtensionEndDate, ID: RecruitmentID } = RecruitmentDetails[0] || {};

    let comparisonDate = JobPostingSecondExtensionEndDate ? new Date(JobPostingSecondExtensionEndDate) : 
                       JobPostingFirstExtensionEndDate ? new Date(JobPostingFirstExtensionEndDate) : 
                       JobPostingEndDate ? new Date(JobPostingEndDate) : null;

    let JobValidation = comparisonDate ? (comparisonDate.setHours(0,0,0,0), today >= comparisonDate) : false;
    let ScreenNavigation = isLineManager ? "/RecurimentProcess/ReviewCandidateList/ViewCandidateDetails" : "/ReviewProfileList/ReviewCandidateList/ViewCandidateDetails";

    if (tab === "tab2 - Level 2") {
      if (JobValidation && pendingcount.ONHoldRejectedCount === 0) {
        props.navigation(ScreenNavigation, { state: { ID: rowData?.CandidateID, StatusId: rowData?.workflowStatusId, RecruitmentID, tab, tabs: props.stateValue?.tab, ButtonAction: ButtonActionType, TabNamed, JobCodeID: props.stateValue?.JobCodeID, JobCode: props.stateValue?.JobCode, initialTab: props.stateValue?.TabNames, PreActionBtn } });
      } else if (pendingcount.ONHoldRejectedCount > 0) {
        setalertProps({ Message: PendingCandidateAlertMsg(pendingcount.ONHoldRejectedCount), Type: HRMSAlertOptions.Error, visible: true, ButtonAction: async () => setAlertPopupOpen(false) });
        setAlertPopupOpen(true);
      } else {
        const dateStr = moment(comparisonDate).format("DD/MM/YYYY");
        setalertProps({ Message: JobAdvertAlertMsg(dateStr), Type: HRMSAlertOptions.Error, visible: true, ButtonAction: async () => setAlertPopupOpen(false) });
        setAlertPopupOpen(true);
      }
    } else {
      props.navigation(ScreenNavigation, { state: { ID: rowData?.CandidateID, StatusId: rowData?.workflowStatusId, RecruitmentID, tab, tabs: props.stateValue?.tab, JobCodeID: props.stateValue?.JobCodeID, JobCode: props.stateValue?.JobCode, ButtonAction: ButtonActionType, TabNamed, initialTab: props.stateValue?.TabNames, PreActionBtn } });
    }
  }, [RecruitmentDetails, pendingcount.ONHoldRejectedCount, isLineManager, props]);

  const handleHover = useCallback(async (workflowStatusId: string) => {
    const { AssignEMail: RecrutimentHR, AssignLineManager: LineManager, AssignHOD: HOD } = RecruitmentDetails[0] || {};
    let pendingName: any[] = [];
    
    const fetchUser = async (email: string, role: string) => (await getVRRDetails.GetADGroupUsers(email, role)).data;

    switch (workflowStatusId) {
      case workflowStatusApi.HRPending:
      case workflowStatusApi.PendingRecruitmentHRscheduleInterview:
        pendingName = [await fetchUser(RecrutimentHR, RoleName.RecruitmentHR)];
        break;
      case workflowStatusApi.LineManagerL1Pending:
      case workflowStatusApi.LineManagerL2Pending:
      case workflowStatusApi.LineManagerLevel1OnHold:
      case workflowStatusApi.LineManagerLevel2OnHold:
        pendingName = [await fetchUser(LineManager, RoleName.LineManager)];
        break;
      case workflowStatusApi.pendingHODSelection:
      case workflowStatusApi.CandidateOnHoldIPanel:
        pendingName = [await fetchUser(HOD, RoleName.HOD)];
        break;
      default:
        pendingName = [{ Key: "N/A", Value: "No matching group" }];
    }
    setPendingInfo(pendingName);
  }, [RecruitmentDetails]);

  
// --- MEMOIZED COLUMNS ---
  
const columns = useMemo(() => {
  const columnDefs: any[] = [
    { field: "SNO", header: "S.No", sortable: true },
    { field: "ApplicantName", header: "Applicant Name", sortable: true },
    { field: "PositionTitle", header: "Position Title", sortable: true },
    { field: "JobCode", header: "Job Code", sortable: true },
  ];

  if (breadcrumbTab === "tab1") {
    columnDefs.push({ field: "createdOn", header: "Profile Received Date", sortable: true });
  }

  columnDefs.push({
    field: "Status", // Required by your interface
    header: "Status",
    sortable: true,
    body: (rowData: any) => {
      const isTooltipEligible = 
        ![workflowStatusApi.CandidateRejectedIPanel, workflowStatusApi.LineManagerLevel1Rejected, workflowStatusApi.LineManagerLevel2Rejected, workflowStatusApi.HRRejected].includes(rowData.workflowStatusId) && 
        rowData.applicationStatusId !== ApplicationStatusId.ApplicationSuspended && 
        breadcrumbTab === "tab2" && props.stateValue?.TabNames === TabName.ReviewProfile && isRecruitmentHR;

      if (isTooltipEligible) {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "24px", marginLeft: "-14%" }}>
              <ToolTipButton 
                Title="" 
                CurrentMenuId={props.ModalDropDown?.CurrentMenuId} 
                Rowdata={rowData} 
                ApproverData={pendingInfo} 
                onHover={() => handleHover(rowData.workflowStatusId)} 
              />
            </div>
            <div style={{ flex: 1 }}>{rowData.Status}</div>
          </div>
        );
      }
      
      const isRed = rowData.applicationStatusId === ApplicationStatusId.ApplicationSuspended || rowData.workflowStatusId === StatusId.Rescheduled;
      return <span style={{ color: isRed ? "red" : "inherit" }}>{isRed ? (rowData.applicationStatus || rowData.Status) : rowData.Status}</span>;
    }
  });

  columnDefs.push({
    field: "Action", // ADDED THIS: It was missing and causing the TS error
    header: "Action",
    sortable: false, // Added for consistency
    style: { width: "7%" },
    body: (rowData: any) => {
      const isViewOnly = (isRecruitmentHR && breadcrumbTab === "tab2" && rowData.workflowStatusId !== StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) ||
                         (isLineManager && [workflowStatusApi.LineManagerLevel1Rejected, workflowStatusApi.LineManagerLevel2Rejected, workflowStatusApi.PendingRecruitmentHRscheduleInterview].includes(rowData.workflowStatusId)) ||
                         rowData.applicationStatusId === ApplicationStatusId.ApplicationSuspended;

      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={require(`../../assets/${isViewOnly ? "Viewicon.svg" : "Editbutton.svg"}`)}
            alt="Action"
            onClick={() => handleRedirectView(rowData, breadcrumbTab, TabName.ReviewProfile, isViewOnly ? ButtonAction.View : ButtonAction.Edit, isViewOnly ? ButtonAction.View : ButtonAction.Edit)}
            style={{ width: "24px", cursor: "pointer" }}
          />
        </div>
      );
    }
  });

  return columnDefs;
}, [breadcrumbTab, isRecruitmentHR, isLineManager, props.stateValue?.TabNames, pendingInfo, handleHover, handleRedirectView, props.ModalDropDown?.CurrentMenuId]);


  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const res = await getVRRDetails.GetJobUniqueDataValue([{ FilterKey: "JobCodeId", Operator: "eq", FilterValue: props.stateValue?.JobCodeID }, { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 }], "and");
      if (res.status === ResponeStatus.SUCCESS && res.data.length > 0) {
        const key = res.data[0]?.JobUniqueKey;
        setJobUniqueValue(key);
        await fetchRecuritmentData();
        await fetchCandidateData(breadcrumbTab, 5, key);
        await pendingcountTabs(key);
      }
      setIsLoading(false);
    };
    void init();
  }, [props.stateValue?.JobCodeID, fetchRecuritmentData, fetchCandidateData, pendingcountTabs, breadcrumbTab]);

  useEffect(() => {
    const label = activeTab === "tab1" ? props.stateValue?.TabNames : "Details"; // Simplified logic
    setTabNameData([{ tabName: props.stateValue?.TabNames }, { tabName: label }]);
  }, [activeTab, props.stateValue?.TabNames]);


  const onPageChange = useCallback((event: any) => {
    setPagination({ first: event.first, rows: event.rows, totalPages: event.totalPages });
    setRows(event.rows);
    void fetchCandidateData(breadcrumbTab, event.rows * event.totalPages, JobUniqueValue);
  }, [breadcrumbTab, JobUniqueValue, fetchCandidateData]);

  const handleRefresh = useCallback(() => {
    void fetchCandidateData(breadcrumbTab, rows, JobUniqueValue);
    void fetchRecuritmentData();
    void pendingcountTabs(JobUniqueValue);
  }, [breadcrumbTab, rows, JobUniqueValue, fetchCandidateData, fetchRecuritmentData, pendingcountTabs]);

  const handleTabChange = useCallback((newTab: string) => {
    setBreadcrumbTab(newTab);
  }, []);

  const back_fn = useCallback(() => {
    const path = isLineManager ? "/RecurimentProcess" : "/ReviewProfileList";
    props.navigation(path, { state: { TabName: props.stateValue?.TabNames, tab: props.stateValue?.tab } });
  }, [isLineManager, props]);


  const commonDatatable = useMemo(() => (
    <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}>
      <CardContent>
        <ReviewProfileDatatable
          data={CandidateData ?? []}
          columns={columns}
          rows={rows}
          onPageChange={onPageChange}
          handleRefresh={handleRefresh}
          pagination={pagination}
        />
      </CardContent>
    </Card>
  ), [CandidateData, columns, rows, onPageChange, handleRefresh, pagination]);

  const tabContent = useMemo(() => [{ label: TabName.ViewCandidateList, value: "tab1", content: commonDatatable }], [commonDatatable]);

  const breadcrumbs = useMemo(() => {
    const items = isLineManager ? [
      { label: tabStyle(TabName.ReviewLevel1, pendingcount.Level1Count), value: "tab1" },
      { label: tabStyle(TabName.ReviewLevel2, pendingcount.Level2Count), value: "tab2 - Level 2" },
      { label: TabName.Shortlisted, value: "tab2" },
      { label: tabStyle(TabName.OnHoldRejected, pendingcount.ONHoldRejectedCount), value: "tab3" }
    ] : [
      { label: tabStyle(TabName.ReviewProfile, pendingcount.ReviewProfileCount), value: "tab1" },
      { label: TabName.MySubmission, value: "tab2" }
    ];

    return items.map(item => ({
      ...item,
      content: (
        <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}>
          <CardContent>
            <BreadcrumbsComponent items={tabContent} initialItem={activeTab} TabName={TabNameData} onBreadcrumbChange={setactiveTab} MainTable={true} additionalButtons={[{ label: ButtonAction.Back, onClick: back_fn }]} />
          </CardContent>
        </Card>
      )
    }));
  }, [isLineManager, pendingcount, activeTab, TabNameData, tabContent, back_fn]);

  const interviewTabs = useMemo(() => [
    { label: tabStyle(TabName.InterviewpanelL1, pendingcount.InterviewPanelCount), value: "tab1" },
    { label: tabStyle(TabName.InterviewpanelL2, pendingcount.InterviewPanel2Count), value: "tab2" },
    { label: tabStyle(TabName.ReschedulInterview, pendingcount.RescheduleCount), value: "tab3" }
  ].map(item => ({
    ...item,
    content: (
      <Card variant="outlined" sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}>
        <CardContent>
          <BreadcrumbsComponent items={tabContent} initialItem={activeTab} TabName={TabNameData} onBreadcrumbChange={setactiveTab} MainTable={true} additionalButtons={[{ label: ButtonAction.Back, onClick: back_fn }]} />
        </CardContent>
      </Card>
    )
  })), [pendingcount, activeTab, TabNameData, tabContent, back_fn]);

  return (
    <CustomLoader isLoading={isLoading}>
      <div className="menu-card">
        <TabsComponent
          tabs={props.stateValue?.TabNames === TabName.AssignInterviewPanel ? interviewTabs : breadcrumbs}
          initialTab={breadcrumbTab}
          tabtype={tabType.Dashboard}
          onTabChange={handleTabChange}
          IsNotscroll={true}
        />
      </div>
      {AlertPopupOpen && <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />}
      {CommentsPopups && <CommentsPopup onClose={() => setCommentsPopup(false)} visible={CommentsPopups} />}
    </CustomLoader>
  );
};

export default React.memo(ReviewCandidateList);