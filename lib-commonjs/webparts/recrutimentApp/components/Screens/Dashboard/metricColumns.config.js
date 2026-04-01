"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.priorityValues = exports.totalPriority = exports.getRoleBasedFilters = exports.MetricQueryConfig = exports.MatricColums = void 0;
var tslib_1 = require("tslib");
var lucide_react_1 = require("lucide-react");
var Config_1 = require("../../../utilities/Config");
var ApiConfig_1 = require("../../../utilities/ApiConfig");
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var BASE_METRICS = (_a = {},
    _a[ConditionConfig_1.MatricID.AssignHr] = {
        label: "Pending HR Assignment",
        status: "ACTIVE",
        icon: lucide_react_1.UserCheck,
        color: "#f97316",
        bgColor: "#fff7ed",
        statusColor: "#3b82f6",
        statusBg: "#eff6ff",
        iconType: "hr",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.AssignRecuritmentHR,
    },
    _a[ConditionConfig_1.MatricID.UploadONEM] = {
        label: "Pending Upload ONEM",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#f59e0b",
        bgColor: "#fffbeb",
        statusColor: "#64748b",
        statusBg: "#f1f5f9",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab2",
        TabName: ConditionConfig_1.TabName.UploadONEMDoc,
    },
    _a[ConditionConfig_1.MatricID.JobAdvert] = {
        label: "Pending Advert Upload",
        status: "ACTIVE",
        icon: lucide_react_1.UserCheck,
        color: "#ea580c",
        bgColor: "#ffedd5",
        statusColor: "#64748b",
        statusBg: "#f1f5f9",
        iconType: "onem",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.PreSelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.UploadAdvertisement,
    },
    _a[ConditionConfig_1.MatricID.ReviewProfileHR] = {
        label: "Review Profile",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#f59e0b",
        bgColor: "#fffbeb",
        statusColor: "#3b82f6", // Active badge is blue
        statusBg: "#eff6ff",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.PostSelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.ReviewProfile,
    },
    _a[ConditionConfig_1.MatricID.ReviewProfileLM] = {
        label: "Review Profile",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#f59e0b",
        bgColor: "#fffbeb",
        statusColor: "#3b82f6",
        statusBg: "#eff6ff",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab3",
        TabName: ConditionConfig_1.TabName.ReviewProfile,
    },
    _a[ConditionConfig_1.MatricID.AssignInterviewPanel] = {
        label: "Assign Interview Panel",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#fbbf24",
        bgColor: "#fefce8",
        statusColor: "#64748b",
        statusBg: "#f1f5f9",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.PostSelectionProcess,
        TabValue: "tab2",
        TabName: ConditionConfig_1.TabName.AssignInterviewPanel,
    },
    _a[ConditionConfig_1.MatricID.InterviewQuestionHR] = {
        label: "Pending InterviewQuestion",
        status: "CRITICAL",
        icon: lucide_react_1.ClipboardList,
        color: "#ef4444",
        bgColor: "#fef2f2",
        statusColor: "#64748b",
        statusBg: "#f1f5f9",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.PostSelectionProcess,
        TabValue: "tab3",
        TabName: ConditionConfig_1.TabName.InterviewQuestion,
    },
    _a[ConditionConfig_1.MatricID.EvalutionHR] = {
        label: "Pending Evaluation",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#d97706",
        bgColor: "#fef3c7",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.PostSelectionProcess,
        TabValue: "tab4",
        TabName: ConditionConfig_1.TabName.Evaluation,
    },
    _a[ConditionConfig_1.MatricID.BackgroundCheck] = {
        label: "Pending Background Verification",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#d97706",
        bgColor: "#fef3c7",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/OfferTable",
        menuId: ConditionConfig_1.menuID.RecruitmentProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.BackgroundVerification,
    },
    _a[ConditionConfig_1.MatricID.LabourHire] = {
        label: "Pending Offer Letter Release - Labour Hire",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#d97706",
        bgColor: "#fef3c7",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/OfferTable",
        menuId: ConditionConfig_1.menuID.RecruitmentProcess,
        TabValue: "tab2",
        TabName: ConditionConfig_1.TabName.LabourHire,
    },
    _a[ConditionConfig_1.MatricID.Kcsa] = {
        label: "Pending Offer Letter Release - KCSA",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#d97706",
        bgColor: "#fef3c7",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/OfferTable",
        menuId: ConditionConfig_1.menuID.RecruitmentProcess,
        TabValue: "tab3",
        TabName: ConditionConfig_1.TabName.OfferLetterKSCA,
    },
    _a[ConditionConfig_1.MatricID.AdvertReviewLM] = {
        label: "Pending Advert Review",
        status: "ACTIVE",
        icon: lucide_react_1.UserCheck,
        color: "#fb923c",
        bgColor: "#fff7ed",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.Evaluation,
    },
    _a[ConditionConfig_1.MatricID.InterviewQuestionLM] = {
        label: "Pending Create Minimum Criteria Question",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#10b981",
        bgColor: "#ecfdf5",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab2",
        TabName: ConditionConfig_1.TabName.InterviewQuestion,
    },
    _a[ConditionConfig_1.MatricID.EvalutionLM] = {
        label: "Pending Evaluation",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#d97706",
        bgColor: "#fef3c7",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab4",
        TabName: ConditionConfig_1.TabName.Evaluation,
    },
    _a[ConditionConfig_1.MatricID.AdvertReviewHOD] = {
        label: "Pending Advert Review",
        status: "ACTIVE",
        icon: lucide_react_1.UserCheck,
        color: "#fdba74",
        bgColor: "#fff7ed",
        statusColor: "#64748b",
        statusBg: "#f1f5f9",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.ReviewJobAdvertisement,
    },
    _a[ConditionConfig_1.MatricID.ReviewScoreCard] = {
        label: "Pending Position ID",
        status: "CRITICAL",
        icon: lucide_react_1.ClipboardList,
        color: "#ef4444",
        bgColor: "#fef2f2",
        statusColor: "#64748b",
        statusBg: "#f1f5f9",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab2",
        TabName: ConditionConfig_1.TabName.ReviewScorecard,
    },
    _a[ConditionConfig_1.MatricID.EvalutionHOD] = {
        label: "Pending Evaluation",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#d97706",
        bgColor: "#fef3c7",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab3",
        TabName: ConditionConfig_1.TabName.Evaluation,
    },
    _a[ConditionConfig_1.MatricID.interviewSchedule] = {
        label: "Interviews Scheduled",
        status: "SCHEDULED",
        icon: lucide_react_1.Calendar,
        color: "#3b82f6",
        bgColor: "#eff6ff",
        statusColor: "#3b82f6",
        statusBg: "#eff6ff",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.InterviewQuestion,
    },
    _a[ConditionConfig_1.MatricID.EvalutionEXCO] = {
        label: "Pending Evaluation",
        status: "PENDING",
        icon: lucide_react_1.Activity,
        color: "#d97706",
        bgColor: "#fef3c7",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.Evaluation,
    },
    _a[ConditionConfig_1.MatricID.interviewTracker] = {
        label: "Interview Tracking",
        status: "ON-GOING",
        icon: lucide_react_1.Activity,
        color: "#10b981",
        bgColor: "#ecfdf5",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.Evaluation,
    },
    _a[ConditionConfig_1.MatricID.OfferRelease] = {
        label: "Offer Letters Released",
        status: "OUTBOUND",
        icon: lucide_react_1.FileText,
        color: "#6366f1",
        bgColor: "#eef2ff",
        statusColor: "#3b82f6", // Active badge is blue
        statusBg: "#eff6ff",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.LabourHire,
    },
    _a[ConditionConfig_1.MatricID.OfferAccepted] = {
        label: "Offers Accepted",
        status: "SUCCESS",
        icon: lucide_react_1.CheckCircle2,
        color: "#22c55e",
        bgColor: "#f0fdf4",
        statusColor: "#64748b",
        statusBg: "#f1f5f9",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.LabourHire,
    },
    _a[ConditionConfig_1.MatricID.OfferRejected] = {
        label: "Offers Rejected",
        status: "LOST",
        icon: lucide_react_1.XCircle,
        color: "#f43f5e",
        bgColor: "#fff1f2",
        statusColor: "#64748b",
        statusBg: "#f1f5f9",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.LabourHire,
    },
    _a[ConditionConfig_1.MatricID.Onbording] = {
        label: "Candidates Onboarded",
        status: "WELCOME",
        icon: lucide_react_1.UserPlus,
        color: "#2563eb",
        bgColor: "#eff6ff",
        statusColor: "#ef4444",
        statusBg: "#fee2e2",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1",
        TabName: ConditionConfig_1.TabName.LabourHire,
    },
    _a);
var buildCol = function (id, overrides) {
    if (overrides === void 0) { overrides = {}; }
    return (tslib_1.__assign(tslib_1.__assign({ id: id }, BASE_METRICS[id]), overrides));
};
var MatricColums = function (roles) {
    var columns = [];
    roles.forEach(function (role) {
        var roleColumns = [];
        switch (role) {
            case Config_1.RoleID.RecruitmentHRLead:
                roleColumns = [
                    buildCol(ConditionConfig_1.MatricID.AssignHr, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.UploadONEM, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewScoreCard, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.interviewSchedule, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.interviewTracker, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRelease, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRejected, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.Onbording, { showArrow: false }),
                ];
                break;
            case Config_1.RoleID.RecruitmentHR:
                roleColumns = [
                    buildCol(ConditionConfig_1.MatricID.JobAdvert, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewProfileHR, {
                        showArrow: false,
                        externalApi: { workflowStatuses: [Config_1.workflowStatusApi.HRPending] },
                    }),
                    buildCol(ConditionConfig_1.MatricID.AssignInterviewPanel, {
                        showArrow: false,
                        externalApi: {
                            workflowStatuses: [
                                Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview,
                            ],
                        },
                    }),
                    buildCol(ConditionConfig_1.MatricID.EvalutionHR, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.InterviewQuestionHR, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.BackgroundCheck, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.LabourHire, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.Kcsa, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.interviewSchedule, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.interviewTracker, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRelease, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRejected, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.Onbording, { showArrow: false }),
                ];
                break;
            case Config_1.RoleID.LineManager:
                roleColumns = [
                    buildCol(ConditionConfig_1.MatricID.AdvertReviewLM, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewProfileLM, {
                        showArrow: true,
                        externalApi: {
                            workflowStatuses: [
                                Config_1.workflowStatusApi.LineManagerL1Pending,
                                Config_1.workflowStatusApi.LineManagerL2Pending,
                                Config_1.workflowStatusApi.LineManagerLevel1OnHold,
                                Config_1.workflowStatusApi.LineManagerLevel2OnHold,
                            ],
                        },
                    }),
                    buildCol(ConditionConfig_1.MatricID.InterviewQuestionLM, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.EvalutionLM, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewScoreCard, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.interviewSchedule, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.interviewTracker, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRelease, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRejected, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.Onbording, { showArrow: false }),
                ];
                break;
            case Config_1.RoleID.HOD:
                roleColumns = [
                    buildCol(ConditionConfig_1.MatricID.AdvertReviewHOD, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.EvalutionHOD, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewScoreCard, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.interviewSchedule, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.interviewTracker, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRelease, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRejected, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.Onbording, { showArrow: false }),
                ];
                break;
            case Config_1.RoleID.RecruitmentAppExternalAgency:
                roleColumns = [
                    buildCol(ConditionConfig_1.MatricID.EvalutionEXCO, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.interviewSchedule, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.interviewTracker, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRelease, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRejected, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.Onbording, { showArrow: false }),
                ];
                break;
            default:
                roleColumns = [];
        }
        if (roles.includes(Config_1.RoleID.LineManager) && roles.includes(Config_1.RoleID.HOD)) {
            roleColumns = roleColumns.filter(function (col) { return col.id !== ConditionConfig_1.MatricID.AdvertReviewHOD; });
        }
        columns.push.apply(columns, roleColumns);
    });
    // remove duplicates
    var unique = new Map();
    columns.forEach(function (col) {
        if (!unique.has(col.id)) {
            unique.set(col.id, col);
        }
    });
    return Array.from(unique.values());
};
exports.MatricColums = MatricColums;
var DEFAULT_SELECT = ["Id", "JobCodeId"];
var DataSyncFilter = [
    {
        FilterKey: "IsDataSyncToRecruitment",
        Operator: "eq",
        FilterValue: ApiConfig_1.Choices.Yes,
    },
    // {
    //     FilterKey: "ItemCreated",
    //     Operator: "eq",
    //     FilterValue: Choices.No
    // }
    //  {
    //     FilterKey: "StatusId",
    //     Operator: "eq",
    //     FilterValue: StatusId.ReadyforRecruitmentProcess
    // }
];
var StatusFilter = function (status, columnName, emailId) {
    var filters = [
        {
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: ApiConfig_1.Choices.No,
        },
    ];
    if (status) {
        filters.push({
            FilterKey: "StatusId",
            Operator: Array.isArray(status) ? "in" : "eq",
            FilterValue: status,
        });
    }
    if (columnName && emailId) {
        filters.push({
            FilterKey: columnName,
            Operator: "eq",
            FilterValue: emailId,
        });
    }
    return filters;
};
var createQuery = function (ListName, Filter, select) { return ({
    ListName: ListName,
    Filter: Filter !== null && Filter !== void 0 ? Filter : [],
    select: select !== null && select !== void 0 ? select : DEFAULT_SELECT,
}); };
var MetricQueryConfig = function (EmailId) {
    var _a;
    return (_a = {},
        // ✅ Assign HR
        _a[ConditionConfig_1.MatricID.AssignHr] = [
            createQuery(Config_1.ListNames.HRMSNewPositionRequest, tslib_1.__spreadArray(tslib_1.__spreadArray([], StatusFilter(Config_1.StatusId.ReadyforRecruitmentProcess), true), DataSyncFilter, true), ["Id"]),
            createQuery(Config_1.ListNames.HRMSVacancyReplacementRequest, tslib_1.__spreadArray(tslib_1.__spreadArray([], StatusFilter(Config_1.StatusId.ReadyforRecruitmentProcess), true), DataSyncFilter, true), ["Id"]),
        ],
        // ✅ Upload ONEM
        _a[ConditionConfig_1.MatricID.UploadONEM] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.PendingUploadONEM)),
        // ✅ Job Advert
        _a[ConditionConfig_1.MatricID.JobAdvert] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.PendingUploadAdvert, "AssignedHR", EmailId)),
        // ✅ Advert Review HOD
        _a[ConditionConfig_1.MatricID.AdvertReviewHOD] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.PendingReviewAdvertHOD, "HOD", EmailId)),
        // ✅ Advert Review LM
        _a[ConditionConfig_1.MatricID.AdvertReviewLM] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.PendingwithLineManagereviewAdv, "LineManager", EmailId)),
        // ✅ Review Score Card (FIXED - only one)
        _a[ConditionConfig_1.MatricID.ReviewScoreCard] = createQuery(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails, StatusFilter(Config_1.StatusId.PendingwithHODtoAssignPositionID)),
        // ✅ Review Profile HR
        _a[ConditionConfig_1.MatricID.ReviewProfileHR] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.RecruitmentInProgress, "AssignedHR", EmailId)),
        // ✅ Review Profile LM
        _a[ConditionConfig_1.MatricID.ReviewProfileLM] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.RecruitmentInProgress, "LineManager", EmailId)),
        // ✅ Assign Interview Panel
        _a[ConditionConfig_1.MatricID.AssignInterviewPanel] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.RecruitmentInProgress, "AssignedHR", EmailId)),
        // ✅ Interview Question HR
        _a[ConditionConfig_1.MatricID.InterviewQuestionHR] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.PendingInterviewquestion, "AssignedHR", EmailId)),
        // ✅ Interview Question LM (FIXED)
        _a[ConditionConfig_1.MatricID.InterviewQuestionLM] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter([Config_1.StatusId.PendingInterviewquestion, Config_1.StatusId.CareerPortalQuestions], "LineManager", EmailId)),
        // ✅ Interview Schedule
        _a[ConditionConfig_1.MatricID.interviewSchedule] = createQuery(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails, StatusFilter([
            Config_1.StatusId.InterviewScheduled,
            Config_1.StatusId.InterviewScheduledforLevel2,
        ])),
        // ✅ Interview Tracker
        _a[ConditionConfig_1.MatricID.interviewTracker] = createQuery(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails, StatusFilter([
            Config_1.StatusId.InterviewScheduled,
            Config_1.StatusId.InterviewScheduledforLevel2,
        ])),
        // ✅ Evaluation HR
        _a[ConditionConfig_1.MatricID.EvalutionHR] = createQuery(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails, StatusFilter([
            Config_1.StatusId.InterviewScheduled,
            Config_1.StatusId.InterviewScheduledforLevel2,
        ])),
        // ✅ Evaluation LM
        _a[ConditionConfig_1.MatricID.EvalutionLM] = createQuery(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails, StatusFilter(Config_1.StatusId.InterviewScheduled)),
        // ✅ Evaluation HOD
        _a[ConditionConfig_1.MatricID.EvalutionHOD] = createQuery(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails, StatusFilter([
            Config_1.StatusId.InterviewScheduled,
            Config_1.StatusId.InterviewScheduledforLevel2,
        ])),
        // ✅ Evaluation EXCO
        _a[ConditionConfig_1.MatricID.EvalutionEXCO] = createQuery(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails, StatusFilter(Config_1.StatusId.InterviewScheduledforLevel2)),
        // ✅ Offer Release
        _a[ConditionConfig_1.MatricID.OfferRelease] = createQuery(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, StatusFilter(Config_1.StatusId.PendingCandidateOfferLetterUpload)),
        // ✅ Offer Accepted
        _a[ConditionConfig_1.MatricID.OfferAccepted] = createQuery(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, StatusFilter(Config_1.StatusId.PendingHROfferReview)),
        // ✅ Offer Rejected
        _a[ConditionConfig_1.MatricID.OfferRejected] = createQuery(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, StatusFilter(Config_1.StatusId.offerdecline)),
        // ✅ Onboarding
        _a[ConditionConfig_1.MatricID.Onbording] = createQuery(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, StatusFilter(Config_1.StatusId.Onboarded)),
        //MySubmission
        _a[ConditionConfig_1.MatricID.MySubmission] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails),
        //Assign Agencies
        _a[ConditionConfig_1.MatricID.AssignAgencies] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.RecruitmentInProgress)),
        //Background Check
        _a[ConditionConfig_1.MatricID.BackgroundCheck] = createQuery(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, StatusFilter([
            Config_1.StatusId.PendingHRBGVInitiation,
            Config_1.StatusId.PendingHRReviewBGCheck,
            Config_1.StatusId.PendingDOTAficaVerification,
        ])),
        //LabourHire
        _a[ConditionConfig_1.MatricID.LabourHire] = createQuery(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, StatusFilter([
            Config_1.StatusId.PendingLabourHireOfferRelease,
            Config_1.StatusId.PendingHROfferReview,
            Config_1.StatusId.PendingLabourhireWPPayment,
            Config_1.StatusId.PendingFinancePaymentReview,
            Config_1.StatusId.PendingLHWorkPermitProcess,
            Config_1.StatusId.PendingHRReviewOfferuploadEmploymentInit,
            Config_1.StatusId.PendingHREmploymentContractInit,
            Config_1.StatusId.PendingLHECRelease,
            Config_1.StatusId.PendingHREmploymentContractReview
        ], "AssignedHR")),
        //KCSA
        _a[ConditionConfig_1.MatricID.Kcsa] = createQuery(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, StatusFilter([
            Config_1.StatusId.PendingHRReviewOfferWorkPermitInit,
            Config_1.StatusId.PendingHRReviewWorkpermitDocs,
            Config_1.StatusId.WorkPermitAcknowledgedContractUploaded,
            Config_1.StatusId.PendingHREmploymentContractVerification,
            Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract,
            Config_1.StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract,
        ], "AssignedHR")),
        _a[ConditionConfig_1.MatricID.Kcsa] = createQuery(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, StatusFilter([
            Config_1.StatusId.PendingHRReviewOfferWorkPermitInit,
            Config_1.StatusId.PendingHRReviewWorkpermitDocs,
            Config_1.StatusId.WorkPermitAcknowledgedContractUploaded,
            Config_1.StatusId.PendingHREmploymentContractVerification,
            Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract,
            Config_1.StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract,
        ], "AssignedHR")),
        //Reviewscordcard HOD
        _a[ConditionConfig_1.MatricID.ReviewScoredHOD] = createQuery(Config_1.ListNames.HRMSRecruitmentDptDetails, StatusFilter(Config_1.StatusId.RecruitmentInProgress, "HOD", EmailId)),
        _a);
};
exports.MetricQueryConfig = MetricQueryConfig;
var RoleMetricFilters = (_b = {},
    _b[Config_1.RoleID.RecruitmentHRLead] = [
        ConditionConfig_1.MatricID.AssignHr,
        ConditionConfig_1.MatricID.UploadONEM,
        ConditionConfig_1.MatricID.ReviewScoreCard,
        ConditionConfig_1.MatricID.interviewSchedule,
        ConditionConfig_1.MatricID.interviewTracker,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording,
    ],
    _b[Config_1.RoleID.RecruitmentHR] = [
        ConditionConfig_1.MatricID.JobAdvert,
        ConditionConfig_1.MatricID.ReviewProfileHR,
        ConditionConfig_1.MatricID.AssignInterviewPanel,
        ConditionConfig_1.MatricID.InterviewQuestionHR,
        ConditionConfig_1.MatricID.EvalutionHR,
        ConditionConfig_1.MatricID.BackgroundCheck,
        ConditionConfig_1.MatricID.LabourHire,
        ConditionConfig_1.MatricID.Kcsa,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording,
    ],
    _b[Config_1.RoleID.LineManager] = [
        ConditionConfig_1.MatricID.AdvertReviewLM,
        ConditionConfig_1.MatricID.EvalutionLM,
        ConditionConfig_1.MatricID.ReviewProfileLM,
        ConditionConfig_1.MatricID.InterviewQuestionLM,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording,
    ],
    _b[Config_1.RoleID.HOD] = [
        ConditionConfig_1.MatricID.AdvertReviewHOD,
        ConditionConfig_1.MatricID.ReviewScoreCard,
        ConditionConfig_1.MatricID.EvalutionHOD,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording,
    ],
    _b[Config_1.RoleID.RecruitmentAppExternalAgency] = [
        ConditionConfig_1.MatricID.EvalutionEXCO,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording,
    ],
    _b);
var getRoleBasedFilters = function (roles, EmailId) {
    var metricSet = new Set();
    roles.forEach(function (role) {
        var metrics = RoleMetricFilters[role] || [];
        metrics.forEach(function (metric) { return metricSet.add(metric); });
    });
    var configMap = (0, exports.MetricQueryConfig)(EmailId);
    var result = [];
    metricSet.forEach(function (metricId) {
        var config = configMap[metricId];
        if (!config)
            return;
        if (Array.isArray(config)) {
            config.forEach(function (cfg) {
                result.push(tslib_1.__assign({ StateValue: metricId }, cfg));
            });
        }
        else {
            result.push(tslib_1.__assign({ StateValue: metricId }, config));
        }
    });
    if (roles.includes(Config_1.RoleID.LineManager) && roles.includes(Config_1.RoleID.HOD)) {
        result = result.filter(function (item) { return item.StateValue !== ConditionConfig_1.MatricID.AdvertReviewHOD; });
    }
    return result;
};
exports.getRoleBasedFilters = getRoleBasedFilters;
var totalPriority = function (matrixs) {
    var priority = matrixs.filter(function (m) { return m.showArrow; });
    var total = priority.reduce(function (acc, metric) { return acc + metric.value; }, 0);
    return total;
};
exports.totalPriority = totalPriority;
var priorityValues = function (matrixs) {
    var total = (0, exports.totalPriority)(matrixs);
    return matrixs
        .filter(function (m) { return m.showArrow; })
        .map(function (m) { return ({
        name: m.label,
        value: m.value,
        percent: total > 0 ? Math.round((m.value / total) * 100) : 0,
        color: m.color,
        iconType: "hr",
    }); });
};
exports.priorityValues = priorityValues;
//# sourceMappingURL=metricColumns.config.js.map