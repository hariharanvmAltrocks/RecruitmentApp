"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.priorityValues = exports.totalPriority = exports.getRoleBasedFilters = exports.MetricQueryConfig = exports.MatricColums = void 0;
var tslib_1 = require("tslib");
var lucide_react_1 = require("lucide-react");
var Config_1 = require("../../../utilities/Config");
var ApiConfig_1 = require("../../../utilities/ApiConfig");
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var BASE_METRICS = (_a = {},
    _a[ConditionConfig_1.MatricID.AssignHr] = {
        label: 'Pending HR Assignment',
        status: 'ACTIVE',
        icon: lucide_react_1.UserCheck,
        color: '#f97316',
        bgColor: '#fff7ed',
        statusColor: '#3b82f6',
        statusBg: '#eff6ff',
        iconType: "hr",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.JobAdvert] = {
        label: 'Pending Advert Upload',
        status: 'ACTIVE',
        icon: lucide_react_1.UserCheck,
        color: '#ea580c',
        bgColor: '#ffedd5',
        statusColor: '#64748b',
        statusBg: '#f1f5f9',
        iconType: "onem",
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.PreSelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.AdvertReviewLM] = {
        label: 'Pending Advert Review',
        status: 'ACTIVE',
        icon: lucide_react_1.UserCheck,
        color: '#fb923c',
        bgColor: '#fff7ed',
        statusColor: '#ef4444',
        statusBg: '#fee2e2',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.AdvertReviewHOD] = {
        label: 'Pending Advert Review',
        status: 'ACTIVE',
        icon: lucide_react_1.UserCheck,
        color: '#fdba74',
        bgColor: '#fff7ed',
        statusColor: '#64748b',
        statusBg: '#f1f5f9',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.UploadONEM] = {
        label: 'Pending Upload ONEM',
        status: 'PENDING',
        icon: lucide_react_1.Activity,
        color: '#f59e0b',
        bgColor: '#fffbeb',
        statusColor: '#64748b',
        statusBg: '#f1f5f9',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab2"
    },
    _a[ConditionConfig_1.MatricID.Evalution] = {
        label: 'Pending Evaluation',
        status: 'PENDING',
        icon: lucide_react_1.Activity,
        color: '#d97706',
        bgColor: '#fef3c7',
        statusColor: '#ef4444',
        statusBg: '#fee2e2',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.ReviewScoreCard] = {
        label: 'Pending Position ID',
        status: 'CRITICAL',
        icon: lucide_react_1.ClipboardList,
        color: '#ef4444',
        bgColor: '#fef2f2',
        statusColor: '#64748b',
        statusBg: '#f1f5f9',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.interviewSchedule] = {
        label: 'Interviews Scheduled',
        status: 'SCHEDULED',
        icon: lucide_react_1.Calendar,
        color: '#3b82f6',
        bgColor: '#eff6ff',
        statusColor: '#3b82f6',
        statusBg: '#eff6ff',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.interviewTracker] = {
        label: 'Interview Tracking',
        status: 'ON-GOING',
        icon: lucide_react_1.Activity,
        color: '#10b981',
        bgColor: '#ecfdf5',
        statusColor: '#ef4444',
        statusBg: '#fee2e2',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.OfferRelease] = {
        label: 'Offer Letters Released',
        status: 'OUTBOUND',
        icon: lucide_react_1.FileText,
        color: '#6366f1',
        bgColor: '#eef2ff',
        statusColor: '#3b82f6', // Active badge is blue
        statusBg: '#eff6ff',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.OfferAccepted] = {
        label: 'Offers Accepted',
        status: 'SUCCESS',
        icon: lucide_react_1.CheckCircle2,
        color: '#22c55e',
        bgColor: '#f0fdf4',
        statusColor: '#64748b',
        statusBg: '#f1f5f9',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.OfferRejected] = {
        label: 'Offers Rejected',
        status: 'LOST',
        icon: lucide_react_1.XCircle,
        color: '#f43f5e',
        bgColor: '#fff1f2',
        statusColor: '#64748b',
        statusBg: '#f1f5f9',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.Onbording] = {
        label: 'Candidates Onboarded',
        status: 'WELCOME',
        icon: lucide_react_1.UserPlus,
        color: '#2563eb',
        bgColor: '#eff6ff',
        statusColor: '#ef4444',
        statusBg: '#fee2e2',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.ReviewProfile] = {
        label: 'Review Profile',
        status: 'PENDING',
        icon: lucide_react_1.Activity,
        color: '#f59e0b',
        bgColor: '#fffbeb',
        statusColor: '#3b82f6', // Active badge is blue
        statusBg: '#eff6ff',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
    },
    _a[ConditionConfig_1.MatricID.AssignInterviewPanel] = {
        label: 'Assign Interview Panel',
        status: 'PENDING',
        icon: lucide_react_1.Activity,
        color: '#fbbf24',
        bgColor: '#fefce8',
        statusColor: '#64748b',
        statusBg: '#f1f5f9',
        path: "/RecruitmentTable",
        menuId: ConditionConfig_1.menuID.SelectionProcess,
        TabValue: "tab1"
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
                    buildCol(ConditionConfig_1.MatricID.Evalution, { showArrow: false }),
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
                    buildCol(ConditionConfig_1.MatricID.ReviewProfile, {
                        showArrow: false,
                        externalApi: { workflowStatuses: [Config_1.workflowStatusApi.HRPending] },
                    }),
                    buildCol(ConditionConfig_1.MatricID.AssignInterviewPanel, {
                        showArrow: false,
                        externalApi: { workflowStatuses: [Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview] },
                    }),
                    buildCol(ConditionConfig_1.MatricID.Evalution, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewScoreCard, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.interviewSchedule, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.interviewTracker, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.OfferRelease, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.OfferAccepted, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.OfferRejected, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.Onbording, { showArrow: true }),
                ];
                break;
            case Config_1.RoleID.LineManager:
                roleColumns = [
                    buildCol(ConditionConfig_1.MatricID.AdvertReviewLM, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewProfile, {
                        showArrow: false,
                        externalApi: {
                            workflowStatuses: [
                                Config_1.workflowStatusApi.LineManagerL1Pending,
                                Config_1.workflowStatusApi.LineManagerL2Pending,
                                Config_1.workflowStatusApi.LineManagerLevel1OnHold,
                                Config_1.workflowStatusApi.LineManagerLevel2OnHold,
                            ],
                        },
                    }),
                    buildCol(ConditionConfig_1.MatricID.Evalution, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewScoreCard, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.interviewSchedule, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.interviewTracker, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.OfferRelease, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.OfferRejected, { showArrow: false }),
                    buildCol(ConditionConfig_1.MatricID.Onbording, { showArrow: false }),
                ];
                break;
            case Config_1.RoleID.HOD:
                roleColumns = [
                    buildCol(ConditionConfig_1.MatricID.AdvertReviewHOD, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.Evalution, { showArrow: true }),
                    buildCol(ConditionConfig_1.MatricID.ReviewScoreCard, { showArrow: true }),
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
        if (roles.includes(Config_1.RoleID.LineManager) &&
            roles.includes(Config_1.RoleID.HOD)) {
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
var StatusFilter = function (status) { return [
    {
        FilterKey: "StatusId",
        Operator: Array.isArray(status) ? "in" : "eq",
        FilterValue: status
    },
    {
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: ApiConfig_1.Choices.No
    }
]; };
var DataSyncFilter = [
    {
        FilterKey: "IsDataSyncToRecruitment",
        Operator: "eq",
        FilterValue: ApiConfig_1.Choices.Yes
    }
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
exports.MetricQueryConfig = (_b = {},
    _b[ConditionConfig_1.MatricID.AssignHr] = [
        {
            ListName: Config_1.ListNames.HRMSNewPositionRequest,
            Filter: tslib_1.__spreadArray([
                StatusFilter(Config_1.StatusId.ReadyforRecruitmentProcess)
            ], DataSyncFilter, true),
            select: ["Id"]
        },
        // {
        //     ListName: ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails,
        //     Filter: [
        //         StatusFilter(StatusId.ReadyforRecruitmentProcess),
        //         ...DataSyncFilter
        //     ],
        //     select: ["Id"]
        // },
        {
            ListName: Config_1.ListNames.HRMSVacancyReplacementRequest,
            Filter: tslib_1.__spreadArray([
                StatusFilter(Config_1.StatusId.ReadyforRecruitmentProcess)
            ], DataSyncFilter, true),
            select: ["Id"]
        }
    ],
    _b[ConditionConfig_1.MatricID.UploadONEM] = {
        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(Config_1.StatusId.PendingUploadONEM)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.JobAdvert] = {
        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
        Filter: tslib_1.__spreadArray([
            StatusFilter(Config_1.StatusId.PendingUploadAdvert)
        ], DataSyncFilter, true),
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.AssignInterviewPanel] = {
        ListName: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Filter: [
            StatusFilter(Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2)
        ],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.Evalution] = {
        ListName: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Filter: [
            StatusFilter([
                Config_1.StatusId.InterviewScheduled,
                Config_1.StatusId.InterviewScheduledforLevel2
            ])
        ],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.OfferRelease] = {
        ListName: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
        Filter: [StatusFilter(Config_1.StatusId.PendingCandidateOfferLetterUpload)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.OfferAccepted] = {
        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(Config_1.StatusId.PendingHROfferReview)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.OfferRejected] = {
        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(Config_1.StatusId.offerdecline)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.Onbording] = {
        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(Config_1.StatusId.onboardingInProcess)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.AdvertReviewHOD] = {
        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(Config_1.StatusId.PendingReviewAdvertHOD)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.AdvertReviewLM] = {
        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(Config_1.StatusId.PendingwithLineManagereviewAdv)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.ReviewScoreCard] = {
        ListName: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Filter: [StatusFilter(Config_1.StatusId.PendingwithHODtoAssignPositionID)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.ReviewProfile] = {
        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(Config_1.StatusId.RecruitmentInProgress)],
        select: DEFAULT_SELECT
    },
    _b[ConditionConfig_1.MatricID.ReviewScoreCard] = {
        ListName: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Filter: [StatusFilter(Config_1.StatusId.PendingwithHODtoAssignPositionID)],
        select: DEFAULT_SELECT
    },
    _b);
var RoleMetricFilters = (_c = {},
    _c[Config_1.RoleID.RecruitmentHRLead] = [
        ConditionConfig_1.MatricID.AssignHr,
        ConditionConfig_1.MatricID.UploadONEM,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording
    ],
    _c[Config_1.RoleID.RecruitmentHR] = [
        ConditionConfig_1.MatricID.JobAdvert,
        ConditionConfig_1.MatricID.ReviewProfile,
        ConditionConfig_1.MatricID.AssignInterviewPanel,
        ConditionConfig_1.MatricID.Evalution,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording
    ],
    _c[Config_1.RoleID.LineManager] = [
        ConditionConfig_1.MatricID.AdvertReviewLM,
        ConditionConfig_1.MatricID.Evalution,
        ConditionConfig_1.MatricID.ReviewProfile,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording
    ],
    _c[Config_1.RoleID.HOD] = [
        ConditionConfig_1.MatricID.AdvertReviewHOD,
        ConditionConfig_1.MatricID.ReviewScoreCard,
        ConditionConfig_1.MatricID.Evalution,
        ConditionConfig_1.MatricID.ReviewProfile,
        ConditionConfig_1.MatricID.OfferRelease,
        ConditionConfig_1.MatricID.OfferAccepted,
        ConditionConfig_1.MatricID.OfferRejected,
        ConditionConfig_1.MatricID.Onbording
    ],
    _c);
var getRoleBasedFilters = function (roles) {
    var metricSet = new Set();
    roles.forEach(function (role) {
        var metrics = RoleMetricFilters[role] || [];
        metrics.forEach(function (metric) { return metricSet.add(metric); });
    });
    var result = [];
    Array.from(metricSet).forEach(function (metricId) {
        var config = exports.MetricQueryConfig[metricId];
        if (Array.isArray(config)) {
            config.forEach(function (cfg) {
                result.push(tslib_1.__assign({ StateValue: metricId }, cfg));
            });
        }
        else {
            result.push(tslib_1.__assign({ StateValue: metricId }, config));
        }
    });
    var hasBothRoles = roles.includes(Config_1.RoleID.LineManager) &&
        roles.includes(Config_1.RoleID.HOD);
    if (hasBothRoles) {
        result = result.filter(function (item) { return item.StateValue !== ConditionConfig_1.MatricID.AdvertReviewHOD; });
    }
    console.log(result, "Result");
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
        iconType: 'hr'
    }); });
};
exports.priorityValues = priorityValues;
//# sourceMappingURL=metricColumns.config.js.map