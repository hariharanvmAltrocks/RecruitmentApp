import { UserCheck, Activity, ClipboardList, Calendar, FileText, CheckCircle2, XCircle, UserPlus } from 'lucide-react';
import { ListNames, RoleID, StatusId, workflowStatusApi } from '../../../utilities/Config';
import { Choices } from '../../../utilities/ApiConfig';
import { Metric, MetricConfig } from '../../../models/IDashboard';
import { PriorityData } from '../../Comman/PriorityWidget/PriorityWidget';
import { MatricID } from '../../../utilities/ConditionConfig';


const BASE_METRICS: Record<string, Omit<MetricConfig, 'id' | 'showArrow'>> = {

    [MatricID.AssignHr]: {
        label: 'Pending Advert Review',
        status: 'ACTIVE',
        icon: UserCheck,
        color: '#f97316',
        bgColor: '#fff7ed'
    },

    [MatricID.JobAdvert]: {
        label: 'Pending Advert Upload',
        status: 'ACTIVE',
        icon: UserCheck,
        color: '#ea580c',
        bgColor: '#ffedd5'
    },

    [MatricID.AdvertReviewLM]: {
        label: 'Pending Advert Review',
        status: 'ACTIVE',
        icon: UserCheck,
        color: '#fb923c',
        bgColor: '#fff7ed'
    },

    [MatricID.AdvertReviewHOD]: {
        label: 'Pending Advert Review',
        status: 'ACTIVE',
        icon: UserCheck,
        color: '#fdba74',
        bgColor: '#fff7ed'
    },

    [MatricID.UploadONEM]: {
        label: 'Pending Upload ONEM',
        status: 'PENDING',
        icon: Activity,
        color: '#f59e0b',
        bgColor: '#fffbeb'
    },

    [MatricID.Evalution]: {
        label: 'Pending Evaluation',
        status: 'PENDING',
        icon: Activity,
        color: '#d97706',
        bgColor: '#fef3c7'
    },

    [MatricID.ReviewScoreCard]: {
        label: 'Pending Position ID',
        status: 'CRITICAL',
        icon: ClipboardList,
        color: '#ef4444',
        bgColor: '#fef2f2'
    },

    [MatricID.interviewSchedule]: {
        label: 'Interviews Scheduled',
        status: 'SCHEDULED',
        icon: Calendar,
        color: '#3b82f6',
        bgColor: '#eff6ff'
    },

    [MatricID.interviewTracker]: {
        label: 'Interview Tracking',
        status: 'ON-GOING',
        icon: Activity,
        color: '#10b981',
        bgColor: '#ecfdf5'
    },

    [MatricID.OfferRelease]: {
        label: 'Offer Letters Released',
        status: 'OUTBOUND',
        icon: FileText,
        color: '#6366f1',
        bgColor: '#eef2ff'
    },

    [MatricID.OfferAccepted]: {
        label: 'Offers Accepted',
        status: 'SUCCESS',
        icon: CheckCircle2,
        color: '#22c55e',
        bgColor: '#f0fdf4'
    },

    [MatricID.OfferRejected]: {
        label: 'Offers Rejected',
        status: 'LOST',
        icon: XCircle,
        color: '#f43f5e',
        bgColor: '#fff1f2'
    },

    [MatricID.Onbording]: {
        label: 'Candidates Onboarded',
        status: 'WELCOME',
        icon: UserPlus,
        color: '#2563eb',
        bgColor: '#eff6ff'
    },

    [MatricID.ReviewProfile]: {
        label: 'Review Profile',
        status: 'PENDING',
        icon: Activity,
        color: '#f59e0b',
        bgColor: '#fffbeb'
    },

    [MatricID.AssignInterviewPanel]: {
        label: 'Assign Interview Panel',
        status: 'PENDING',
        icon: Activity,
        color: '#fbbf24',
        bgColor: '#fefce8'
    }
};

const buildCol = (id: number, overrides: Partial<MetricConfig> = {}): MetricConfig => ({
    id,
    ...BASE_METRICS[id],
    ...overrides,
} as MetricConfig);


export const MatricColums = (roles: number[]): MetricConfig[] => {

    const columns: MetricConfig[] = [];

    roles.forEach(role => {

        let roleColumns: MetricConfig[] = [];

        switch (role) {

            case RoleID.RecruitmentHRLead:
                roleColumns = [
                    buildCol(MatricID.AssignHr, { showArrow: true }),
                    buildCol(MatricID.UploadONEM, { showArrow: true }),
                    buildCol(MatricID.Evalution, { showArrow: false }),
                    buildCol(MatricID.ReviewScoreCard, { showArrow: false }),
                    buildCol(MatricID.interviewSchedule, { showArrow: false }),
                    buildCol(MatricID.interviewTracker, { showArrow: false }),
                    buildCol(MatricID.OfferRelease, { showArrow: false }),
                    buildCol(MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(MatricID.OfferRejected, { showArrow: false }),
                    buildCol(MatricID.Onbording, { showArrow: false }),
                ];
                break;

            case RoleID.RecruitmentHR:
                roleColumns = [
                    buildCol(MatricID.JobAdvert, { showArrow: true }),
                    buildCol(MatricID.ReviewProfile, {
                        showArrow: false,
                        externalApi: { workflowStatuses: [workflowStatusApi.HRPending] },
                    }),
                    buildCol(MatricID.AssignInterviewPanel, {
                        showArrow: false,
                        externalApi: { workflowStatuses: [workflowStatusApi.PendingRecruitmentHRscheduleInterview] },
                    }),
                    buildCol(MatricID.Evalution, { showArrow: true }),
                    buildCol(MatricID.ReviewScoreCard, { showArrow: true }),
                    buildCol(MatricID.interviewSchedule, { showArrow: true }),
                    buildCol(MatricID.interviewTracker, { showArrow: true }),
                    buildCol(MatricID.OfferRelease, { showArrow: true }),
                    buildCol(MatricID.OfferAccepted, { showArrow: true }),
                    buildCol(MatricID.OfferRejected, { showArrow: true }),
                    buildCol(MatricID.Onbording, { showArrow: true }),
                ];
                break;

            case RoleID.LineManager:
                roleColumns = [
                    buildCol(MatricID.AdvertReviewLM, { showArrow: true }),
                    buildCol(MatricID.ReviewProfile, {
                        showArrow: false,
                        externalApi: {
                            workflowStatuses: [
                                workflowStatusApi.LineManagerL1Pending,
                                workflowStatusApi.LineManagerL2Pending,
                                workflowStatusApi.LineManagerLevel1OnHold,
                                workflowStatusApi.LineManagerLevel2OnHold,
                            ],
                        },
                    }),
                    buildCol(MatricID.Evalution, { showArrow: true }),
                    buildCol(MatricID.ReviewScoreCard, { showArrow: true }),
                    buildCol(MatricID.interviewSchedule, { showArrow: true }),
                    buildCol(MatricID.interviewTracker, { showArrow: true }),
                    buildCol(MatricID.OfferRelease, { showArrow: false }),
                    buildCol(MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(MatricID.OfferRejected, { showArrow: false }),
                    buildCol(MatricID.Onbording, { showArrow: false }),
                ];
                break;

            case RoleID.HOD:
                roleColumns = [
                    buildCol(MatricID.AdvertReviewHOD, { showArrow: true }),
                    buildCol(MatricID.Evalution, { showArrow: true }),
                    buildCol(MatricID.ReviewScoreCard, { showArrow: true }),
                    buildCol(MatricID.interviewSchedule, { showArrow: false }),
                    buildCol(MatricID.interviewTracker, { showArrow: false }),
                    buildCol(MatricID.OfferRelease, { showArrow: false }),
                    buildCol(MatricID.OfferAccepted, { showArrow: false }),
                    buildCol(MatricID.OfferRejected, { showArrow: false }),
                    buildCol(MatricID.Onbording, { showArrow: false }),
                ];
                break;

            default:
                roleColumns = [];
        }

        columns.push(...roleColumns);
    });

    // remove duplicates
    const unique = new Map<number, MetricConfig>();

    columns.forEach(col => {
        if (!unique.has(col.id)) {
            unique.set(col.id, col);
        }
    });

    return Array.from(unique.values());
};


interface FilterQuery {
    StateValue: number;
    ListName: string;
    Filter: any[];
    select: string[];
}

const DEFAULT_SELECT = ["Id", "JobCodeId"];

const StatusFilter = (status: number | number[]) => [
    {
        FilterKey: "StatusId",
        Operator: Array.isArray(status) ? "in" : "eq",
        FilterValue: status
    },
    {
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: Choices.No
    }
];

const DataSyncFilter = [
    {
        FilterKey: "IsDataSyncToRecruitment",
        Operator: "eq",
        FilterValue: Choices.Yes
    },
    {
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: Choices.No
    }
];

export const MetricQueryConfig: Record<number, Omit<FilterQuery, "StateValue">> = {

    [MatricID.AssignHr]: {
        ListName: ListNames.HRMSNewPositionRequest,
        Filter: [
            StatusFilter(StatusId.ReadyforRecruitmentProcess),
            ...DataSyncFilter
        ],
        select: DEFAULT_SELECT
    },

    [MatricID.UploadONEM]: {
        ListName: ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(StatusId.PendingUploadONEM)],
        select: DEFAULT_SELECT
    },

    [MatricID.JobAdvert]: {
        ListName: ListNames.HRMSRecruitmentDptDetails,
        Filter: [
            StatusFilter(StatusId.PendingUploadAdvert),
            ...DataSyncFilter
        ],
        select: DEFAULT_SELECT
    },

    [MatricID.AssignInterviewPanel]: {
        ListName: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Filter: [
            StatusFilter(StatusId.PendingwithHODtoselectthecandidateLevel2)
        ],
        select: DEFAULT_SELECT
    },

    [MatricID.Evalution]: {
        ListName: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Filter: [
            StatusFilter([
                StatusId.InterviewScheduled,
                StatusId.InterviewScheduledforLevel2
            ])
        ],
        select: DEFAULT_SELECT
    },

    [MatricID.OfferRelease]: {
        ListName: ListNames.HRMSSelectedCandidateDetailsByHOD,
        Filter: [StatusFilter(StatusId.PendingCandidateOfferLetterUpload)],
        select: DEFAULT_SELECT
    },

    [MatricID.OfferAccepted]: {
        ListName: ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(StatusId.PendingHROfferReview)],
        select: DEFAULT_SELECT
    },

    [MatricID.OfferRejected]: {
        ListName: ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(StatusId.offerdecline)],
        select: DEFAULT_SELECT
    },

    [MatricID.Onbording]: {
        ListName: ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(StatusId.onboardingInProcess)],
        select: DEFAULT_SELECT
    },

    [MatricID.AdvertReviewHOD]: {
        ListName: ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(StatusId.PendingReviewAdvertHOD)],
        select: DEFAULT_SELECT
    },

    [MatricID.AdvertReviewLM]: {
        ListName: ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(StatusId.PendingwithLineManagereviewAdv)],
        select: DEFAULT_SELECT
    },

    [MatricID.ReviewScoreCard]: {
        ListName: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Filter: [StatusFilter(StatusId.PendingwithHODtoAssignPositionID)],
        select: DEFAULT_SELECT
    },

    [MatricID.ReviewProfile]: {
        ListName: ListNames.HRMSRecruitmentDptDetails,
        Filter: [StatusFilter(StatusId.RecruitmentInProgress)],
        select: DEFAULT_SELECT
    },

    [MatricID.ReviewScoreCard]: {
        ListName: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Filter: [StatusFilter(StatusId.PendingwithHODtoAssignPositionID)],
        select: DEFAULT_SELECT
    },

};

const RoleMetricFilters: Record<number, number[]> = {

    [RoleID.RecruitmentHRLead]: [
        MatricID.AssignHr,
        MatricID.UploadONEM,
        MatricID.OfferRelease,
        MatricID.OfferAccepted,
        MatricID.OfferRejected,
        MatricID.Onbording
    ],

    [RoleID.RecruitmentHR]: [
        MatricID.JobAdvert,
        MatricID.ReviewProfile,
        MatricID.AssignInterviewPanel,
        MatricID.Evalution,
        MatricID.OfferRelease,
        MatricID.OfferAccepted,
        MatricID.OfferRejected,
        MatricID.Onbording
    ],

    [RoleID.LineManager]: [
        MatricID.AdvertReviewLM,
        MatricID.Evalution,
        MatricID.ReviewProfile,
        MatricID.OfferRelease,
        MatricID.OfferAccepted,
        MatricID.OfferRejected,
        MatricID.Onbording
    ],

    [RoleID.HOD]: [
        MatricID.AdvertReviewHOD,
        MatricID.ReviewScoreCard,
        MatricID.Evalution,
        MatricID.ReviewProfile,
        MatricID.OfferRelease,
        MatricID.OfferAccepted,
        MatricID.OfferRejected,
        MatricID.Onbording
    ]

};

export const getRoleBasedFilters = (roles: number[]): FilterQuery[] => {

    const metricSet = new Set<number>();

    roles.forEach(role => {
        const metrics = RoleMetricFilters[role] || [];
        metrics.forEach(metric => metricSet.add(metric));
    });

    return Array.from(metricSet).map(metricId => ({
        StateValue: metricId,
        ...MetricQueryConfig[metricId]
    }));

};

export const totalPriority = (matrixs: Metric[]) => {
    const priority = matrixs.filter(m => m.showArrow);
    const total = priority.reduce((acc, metric) => acc + metric.value, 0);
    return total;
}

export const priorityValues = (matrixs: Metric[]): PriorityData[] => {
    const total = totalPriority(matrixs);

    return matrixs
        .filter(m => m.showArrow)
        .map(m => ({
            name: m.label,
            value: m.value,
            percent: total > 0 ? Math.round((m.value / total) * 100) : 0,
            color: m.color
        }));
};


