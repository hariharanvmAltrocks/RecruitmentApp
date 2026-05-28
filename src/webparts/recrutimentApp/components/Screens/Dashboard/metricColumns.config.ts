import {
  UserCheck,
  Activity,
  ClipboardList,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  UserPlus,
  Upload,
  Megaphone,
  Eye,
  Users,
  MessageSquare,
  BarChart2,
  ShieldCheck,
  Send,
  ClipboardCheck,
  RefreshCw,
  Building2,
} from "lucide-react";
import {
  ListNames,
  RoleID,
  StatusId,
  workflowStatusApi,
} from "../../../utilities/Config";
import { Choices } from "../../../utilities/ApiConfig";
import { Metric, MetricConfig } from "../../../models/IDashboard";
import { PriorityData } from "../../Comman/PriorityWidget/PriorityWidget";
import { MatricID, menuID, TabNames } from "../../../utilities/ConditionConfig";
import { userInfo } from "../../../utilities/hooks/RoleContext";
import { IFilter } from "../../../services/SPService/Ispservice";
import * as strings from 'RecrutimentAppWebPartStrings';

const resolvedGradientStart = "var(--app-primary-color)";
const resolvedGradientEnd = "var(--app-secondary-color)";

const BASE_METRICS: Record<number, Omit<MetricConfig, "id" | "showArrow">> = {
  [MatricID.AssignHr]: {
    label: strings.HrAssignment,
    status: "ACTIVE",
    icon: UserCheck,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    iconType: "hr",
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.AssignRecuritmentHR,
  },

  [MatricID.UploadONEM]: {
    label: strings.UploadOnem,
    status: "PENDING",
    icon: Upload,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.UploadONEMDoc,
  },

  [MatricID.JobAdvert]: {
    label: strings.AdvertUpload,
    status: "ACTIVE",
    icon: Megaphone,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    iconType: "onem",
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.UploadAdvertisement,
  },

  [MatricID.ReviewProfileHR]: {
    label: strings.ReviewProfile,
    status: "PENDING",
    icon: Eye,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.ReviewProfile,
  },
  [MatricID.ReviewProfileLM]: {
    label: "Review Profile",
    status: "PENDING",
    icon: Eye,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab3",
    TabName: TabNames.ReviewProfile,
  },

  [MatricID.AssignInterviewPanel]: {
    label: strings.AssignInterviewPanel,
    status: "PENDING",
    icon: Users,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.AssignInterviewPanel,
  },

  [MatricID.InterviewQuestionHR]: {
    label: strings.InterviewQuestion,
    status: "CRITICAL",
    icon: MessageSquare,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab3",
    TabName: TabNames.InterviewQuestion,
  },

  [MatricID.EvalutionHR]: {
    label: "Evaluation",
    status: "PENDING",
    icon: BarChart2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab4",
    TabName: TabNames.Evaluation,
  },
  [MatricID.BackgroundCheck]: {
    label: "Background  Verification",
    status: "PENDING",
    icon: ShieldCheck,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
     menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.BackgroundVerification,
  },
  [MatricID.LabourHire]: {
    label: strings.OfferReleaseLabourHire,
    status: "PENDING",
    icon: Send,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
     menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.LabourHire,
  },
  [MatricID.Kcsa]: {
    label: strings.OfferReleaseKcsa,
    status: "PENDING",
    icon: Send,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab3",
    TabName: TabNames.OfferLetterKSCA,
  },

  [MatricID.AdvertReviewLM]: {
    label: strings.AdvertReview,
    status: "ACTIVE",
    icon: UserCheck,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.Evaluation,
  },

  [MatricID.DisqualifiQuesLM]: {
    label: strings.CreateMinimumCriteriaQuestion,
    status: "PENDING",
    icon: ClipboardList,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
   menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.InterviewQuestion,
  },

  [MatricID.InterviewQuestionLM]: {
    label: "Interview Question",
    status: "PENDING",
    icon: MessageSquare,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.InterviewQuestion,
  },

  [MatricID.EvalutionLM]: {
    label: " Evaluation",
    status: "PENDING",
    icon: BarChart2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab4",
    TabName: TabNames.Evaluation,
  },

  [MatricID.AdvertReviewHOD]: {
    label: " Advert Review",
    status: "ACTIVE",
    icon: UserCheck,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.ReviewJobAdvertisement,
  },

  [MatricID.ReviewScoreCard]: {
    label: " Position ID",
    status: "CRITICAL",
    icon: ClipboardCheck,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
     menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.ReviewScorecard,
  },
  [MatricID.EvalutionHOD]: {
    label: " Evaluation",
    status: "PENDING",
    icon: BarChart2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab3",
    TabName: TabNames.Evaluation,
  },

  [MatricID.interviewSchedule]: {
    label: strings.InterviewsScheduled,
    status: "SCHEDULED",
    icon: Calendar,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.InterviewQuestion,
  },

  [MatricID.EvalutionEXCO]: {
    label: " Evaluation",
    status: "PENDING",
    icon: BarChart2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.Evaluation,
  },

  [MatricID.interviewTracker]: {
    label: strings.InterviewTracking,
    status: "ON-GOING",
    icon: Activity,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.Evaluation,
  },

  [MatricID.OfferRelease]: {
    label: strings.OfferLettersReleased,
    status: "OUTBOUND",
    icon: FileText,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.LabourHire,
  },

  [MatricID.OfferAccepted]: {
    label: strings.OffersAccepted,
    status: "SUCCESS",
    icon: CheckCircle2,
    color:  resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
     menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.LabourHire,
  },

  [MatricID.OfferRejected]: {
    label: strings.OffersRejected,
    status: "LOST",
    icon: XCircle,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
   menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.LabourHire,
  },

  [MatricID.Onbording]: {
    label: strings.CandidatesOnboarded,
    status: "WELCOME",
    icon: UserPlus,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab1",
    TabName: TabNames.LabourHire,
  },

  [MatricID.advertExtension]: {
    label: strings.AdvertExtension,
    status: "ON-GOING",
    icon: RefreshCw,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
    menuId: menuID.Mytracker,
    TabValue: "tab4",
    TabName: TabNames.AdvertExtension,
  },

  [MatricID.AssignAgencies]: {
    label: strings.AssignAgencies,
    status: "ON-GOING",
    icon: Building2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
     menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.AssignAgencies,
  },

  [MatricID.MySubmission]: {
    label: strings.MySubmission,
    status: "ON-GOING",
    icon: Building2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
   menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.MySubmission,
  },

  [MatricID.MySubmissionHR]: {
    label: "My Submission",
    status: "ON-GOING",
    icon: Building2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
     menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.MySubmission,
  },

  [MatricID.MySubmissionBGV]: {
    label: strings.MySubmissionBgv,
    status: "ON-GOING",
    icon: Building2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
     menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.MySubmission,
  },

  [MatricID.MySubmissionHOD]: {
    label: "My Submission",
    status: "ON-GOING",
    icon: Building2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
  menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.MySubmission,
  },

  [MatricID.MySubmissionLM]: {
    label: "My Submission",
    status: "ON-GOING",
    icon: Building2,
    color: resolvedGradientEnd,
    bgColor: resolvedGradientStart,
    statusColor: resolvedGradientStart,
    statusBg: resolvedGradientEnd,
    path: "/MyTracker",
     menuId: menuID.Mytracker,
    TabValue: "tab2",
    TabName: TabNames.MySubmission,
  },
};

const buildCol = (
  id: number,
  overrides: Partial<MetricConfig> = {},
): MetricConfig =>
  ({
    id,
    ...BASE_METRICS[id],
    ...overrides,
  }) as MetricConfig;

export const MatricColums = (roles: number[]): MetricConfig[] => {
  const columns: MetricConfig[] = [];
    let roleColumns: MetricConfig[] = [];

 if (roles.includes(RoleID.LineManager) && roles.includes(RoleID.HOD)) {

   roleColumns = [
          buildCol(MatricID.AdvertReviewLM, { showArrow: true }),
          buildCol(MatricID.DisqualifiQuesLM, { showArrow: true }),
          buildCol(MatricID.InterviewQuestionLM, { showArrow: true }),
          buildCol(MatricID.ReviewProfileLM, {
            showArrow: true,
            externalApi: {
              workflowStatuses: [
                workflowStatusApi.LineManagerL1Pending,
                workflowStatusApi.LineManagerL2Pending,
                workflowStatusApi.LineManagerLevel1OnHold,
                workflowStatusApi.LineManagerLevel2OnHold,
              ],
            },
          }),
          buildCol(MatricID.EvalutionLM, { showArrow: true }),
            buildCol(MatricID.ReviewScoreCard, { showArrow: true }),
          buildCol(MatricID.advertExtension, { showArrow: true }),
          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
          buildCol(MatricID.MySubmissionLM, { showArrow: false }),
        ];
         columns.push(...roleColumns);
 } else{
 roles.forEach((role) => {

    switch (role) {
      case RoleID.RecruitmentHRLead:
        roleColumns = [
          buildCol(MatricID.AssignHr, { showArrow: true }),
          buildCol(MatricID.UploadONEM, { showArrow: true }),
          // buildCol(MatricID.ReviewScoreCard, { showArrow: false }),
          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          // buildCol(MatricID.interviewTracker, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
          buildCol(MatricID.MySubmission, { showArrow: false }),
        ];
        break;

      case RoleID.RecruitmentHR:
        roleColumns = [
          buildCol(MatricID.JobAdvert, { showArrow: true }),
          buildCol(MatricID.AssignAgencies, { showArrow: true }),
          buildCol(MatricID.ReviewProfileHR, {
            showArrow: true,
            externalApi: { workflowStatuses: [workflowStatusApi.HRPending] },
          }),
          buildCol(MatricID.AssignInterviewPanel, {
            showArrow: true,
            externalApi: {
              workflowStatuses: [
                workflowStatusApi.PendingRecruitmentHRscheduleInterview,
              ],
            },
          }),
          buildCol(MatricID.InterviewQuestionHR, { showArrow: true }),
          buildCol(MatricID.EvalutionHR, { showArrow: true }),
          buildCol(MatricID.BackgroundCheck, { showArrow: true }),
          buildCol(MatricID.LabourHire, { showArrow: true }),
          buildCol(MatricID.Kcsa, { showArrow: true }),

          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          // buildCol(MatricID.interviewTracker, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
          buildCol(MatricID.MySubmissionHR, { showArrow: false }),
          buildCol(MatricID.MySubmissionBGV, { showArrow: false })
        ];
        break;

      case RoleID.LineManager:
        roleColumns = [
          buildCol(MatricID.AdvertReviewLM, { showArrow: true }),
          buildCol(MatricID.DisqualifiQuesLM, { showArrow: true }),
          buildCol(MatricID.ReviewProfileLM, {
            showArrow: true,
            externalApi: {
              workflowStatuses: [
                workflowStatusApi.LineManagerL1Pending,
                workflowStatusApi.LineManagerL2Pending,
                workflowStatusApi.LineManagerLevel1OnHold,
                workflowStatusApi.LineManagerLevel2OnHold,
              ],
            },
          }),
          buildCol(MatricID.InterviewQuestionLM, { showArrow: true }),
          buildCol(MatricID.EvalutionLM, { showArrow: true }),
          // buildCol(MatricID.ReviewScoreCard, { showArrow: false }),
          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          // buildCol(MatricID.interviewTracker, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
          buildCol(MatricID.MySubmissionLM, { showArrow: false }),
        ];
        break;

      case RoleID.HOD:
        roleColumns = [
          buildCol(MatricID.AdvertReviewHOD, { showArrow: true }),
          buildCol(MatricID.EvalutionHOD, { showArrow: true }),
          buildCol(MatricID.ReviewScoreCard, { showArrow: true }),
          buildCol(MatricID.advertExtension, { showArrow: true }),
          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
          buildCol(MatricID.MySubmissionHOD, { showArrow: false }),
        ];
        break;

      case RoleID.RecruitmentAppExternalAgency:
        roleColumns = [
          buildCol(MatricID.EvalutionEXCO, { showArrow: true }),
          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          // buildCol(MatricID.interviewTracker, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
          // buildCol(MatricID.MySubmissionAgency, { showArrow: false }),
        ];
        break;

      case RoleID.FinanceDepartment:
        roleColumns = [
          buildCol(MatricID.LabourHire, { showArrow: true }),
          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          // buildCol(MatricID.interviewTracker, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
        ];
        break;

      default:
        roleColumns = [];
    }
    if (roles.includes(RoleID.LineManager) && roles.includes(RoleID.HOD)) {
      roleColumns = roleColumns.filter(
        (col) =>
          col.id !== MatricID.AdvertReviewHOD &&
          col.id !== MatricID.EvalutionHOD,
      );
      roleColumns = roleColumns.map((item) =>
        item.id === MatricID.ReviewScoreCard
          ? buildCol(MatricID.ReviewScoreCard, {
              showArrow: true,
              TabValue: "tab5",
            })
          : item,
      );
    }
    columns.push(...roleColumns);
  });
 }
 

  // remove duplicates
  const unique = new Map<number, MetricConfig>();

  columns.forEach((col) => {
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

const DataSyncFilter = [
  {
    FilterKey: "IsDataSyncToRecruitment",
    Operator: "eq",
    FilterValue: Choices.Yes,
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

type SingleQuery = Omit<FilterQuery, "StateValue">;

type IOrFilter = {
  Operator: "or";
  OrFilters: IFilter[][];
};

interface StatusFilterOptions {
  status?: number | number[];
  columnName?: string;
  emailId?: string;
  labourHire?: string;
  questionBy?: string;
  orFilters?: IOrFilter[];
}

const StatusFilter = ({
  status,
  columnName,
  emailId,
  labourHire,
  questionBy,
  orFilters,
}: StatusFilterOptions) => {
  const filters: any[] = [
    {
      FilterKey: "ItemCreated",
      Operator: "eq",
      FilterValue: Choices.No,
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

  if (labourHire) {
    filters.push({
      FilterKey: "IsLabourHire",
      Operator: "eq",
      FilterValue: labourHire === Choices.Yes ? Choices.Yes : Choices.No,
    });
  }

  if (questionBy) {
    filters.push({
      FilterKey: questionBy,
      Operator: "eq",
      FilterValue: Choices.No,
    });
  }

  // ✅ Wrap in OR group if orFilters provided
  if (orFilters && orFilters.length > 0) {
    if (orFilters && orFilters.length > 0) {
      filters.push(...orFilters);
    }
  }

  return filters;
};

const createQuery = (
  ListName: string,
  Filter?: any[],
  select?: string[],
): SingleQuery => ({
  ListName,
  Filter: Filter ?? [],
  select: select ?? DEFAULT_SELECT,
});

export const MetricQueryConfig = (
  EmailId: string,
  roles: number[] = [],
): Record<number, SingleQuery | SingleQuery[]> => ({
  // ✅ Assign HR
  [MatricID.AssignHr]: [
    createQuery(
      ListNames.HRMSNewPositionRequest,
      [
        ...StatusFilter({ status: StatusId.ReadyforRecruitmentProcess }),
        ...DataSyncFilter,
      ],
      ["Id"],
    ),
    createQuery(
      ListNames.HRMSAdditionalHeadCountForExisitingPosition,
      [
        ...StatusFilter({ status: StatusId.ReadyforRecruitmentProcess }),
        ...DataSyncFilter,
      ],
      ["Id"],
    ),
    createQuery(
      ListNames.HRMSVacancyReplacementRequest,
      [
        ...StatusFilter({ status: StatusId.ReadyforRecruitmentProcess }),
        ...DataSyncFilter,
      ],
      ["Id"],
    ),
  ],

  // ✅ Upload ONEM
  [MatricID.UploadONEM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({ status: StatusId.PendingUploadONEM }),
  ),

  // ✅ Job Advert
  [MatricID.JobAdvert]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.PendingUploadAdvert,
      columnName: "AssignedHR",
      emailId: EmailId,
    }),
  ),

  // ✅ Advert Review HOD
  [MatricID.AdvertReviewHOD]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.PendingReviewAdvertHOD,
      columnName: "HOD",
      emailId: EmailId,
    }),
  ),

  // ✅ Advert Review LM
  // ✅ Advert Review HOD + LM Combined (when same person)
  [MatricID.AdvertReviewLM]: (() => {
    const isHODandLM =
      roles.includes(RoleID.HOD) && roles.includes(RoleID.LineManager);

    if (isHODandLM) {
      return createQuery(
        ListNames.HRMSRecruitmentDptDetails,
        StatusFilter({
          orFilters: [
            {
              Operator: "or",
              OrFilters: [
                [
                  {
                    FilterKey: "StatusId",
                    Operator: "eq",
                    FilterValue: 26,
                  },
                ],
                [
                  {
                    FilterKey: "StatusId",
                    Operator: "eq",
                    FilterValue: 125,
                  },
                ],
              ],
            },
            {
              Operator: "or",
              OrFilters: [
                [
                  {
                    FilterKey: "HOD",
                    Operator: "eq",
                    FilterValue: EmailId,
                  },
                ],
                [
                  {
                    FilterKey: "LineManager",
                    Operator: "eq",
                    FilterValue: EmailId,
                  },
                ],
              ],
            },
          ],
        }),
      );
    }

    return createQuery(
      ListNames.HRMSRecruitmentDptDetails,
      StatusFilter({
        status: StatusId.PendingwithLineManagereviewAdv,
        columnName: "LineManager",
        emailId: EmailId,
      }),
    );
  })(),

  // ✅ Review Score Card (FIXED - only one)
  [MatricID.ReviewScoreCard]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter({
      status: [
        StatusId.PendingwithpositionIDAssignmentWithHOD,
        StatusId.pendingL2shorlistingwithHOD,
        StatusId.CandidateOnHoldbyHODLevel1,
        StatusId.CandidateOnHoldbyHODLevel2,
        StatusId.OnHoldbyHOD
      ],
    }),
  ),

  // ✅ Review Profile HR
  [MatricID.ReviewProfileHR]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.RecruitmentInProgress,
      columnName: "AssignedHR",
      emailId: EmailId,
    }),
  ),

  // ✅ Review Profile LM
  [MatricID.ReviewProfileLM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.RecruitmentInProgress,
      columnName: "LineManager",
      emailId: EmailId,
    }),
  ),

  // ✅ Assign Interview Panel
  [MatricID.AssignInterviewPanel]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.RecruitmentInProgress,
      columnName: "AssignedHR",
      emailId: EmailId,
    }),
  ),

  // ✅ Interview Question HR
  [MatricID.InterviewQuestionHR]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.PendingInterviewquestion,
      columnName: "AssignedHR",
      emailId: EmailId,
      questionBy: "QuestionByHR",
    }),
  ),

  // ✅ Interview Question LM (FIXED)
  [MatricID.DisqualifiQuesLM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.CareerPortalQuestions,
      columnName: "LineManager",
      emailId: EmailId,
    }),
  ),

  [MatricID.InterviewQuestionLM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.PendingInterviewquestion,
      columnName: "LineManager",
      emailId: EmailId,
      questionBy: "QuestionByLM",
    }),
  ),

  // ✅ Interview Tracker
  [MatricID.interviewSchedule]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter({
      status: [
        StatusId.InterviewScheduled,
        StatusId.InterviewScheduledforLevel2,
      ],
    }),
  ),

  // ✅ Evaluation HR
  [MatricID.EvalutionHR]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter({
      status: [
        StatusId.InterviewLevel1InProgress,
        StatusId.InterviewLevel2InProgress,
      ],
    }),
  ),

  // ✅ Evaluation LM
  [MatricID.EvalutionLM]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter({ status: StatusId.InterviewLevel1InProgress }),
  ),

  // ✅ Evaluation HOD
  [MatricID.EvalutionHOD]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter({
      status: [
        StatusId.InterviewLevel1InProgress,
        StatusId.InterviewLevel2InProgress,
      ],
    }),
  ),

  // ✅ Evaluation EXCO
  [MatricID.EvalutionEXCO]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter({ status: StatusId.InterviewLevel2InProgress }),
  ),

  // ✅ Offer Release
  [MatricID.OfferRelease]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter({ status: StatusId.PendingCandidateOfferLetterUpload }),
  ),

  // ✅ Offer Accepted
  [MatricID.OfferAccepted]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter({ status: StatusId.PendingHROfferReview }),
  ),

  // ✅ Offer Rejected
  [MatricID.OfferRejected]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter({ status: StatusId.offerdecline }),
  ),

  // ✅ Onboarding
  [MatricID.Onbording]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter({ status: StatusId.Onboarded }),
  ),

  //Assign Agencies
  [MatricID.AssignAgencies]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({ status: StatusId.RecruitmentInProgress }),
  ),

  //Background Check
  [MatricID.BackgroundCheck]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter({
      status: [
        StatusId.PendingHRBGVInitiation,
        StatusId.PendingHRReviewBGCheck,
        StatusId.PendingDOTAficaVerification,
      ],
      columnName: "RecruitmentHR",
      emailId: EmailId,
    }),
  ),

  //LabourHire
  [MatricID.LabourHire]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter({
      status: [
        StatusId.PendingHROfferInitiate,
        StatusId.PendingHROfferReview,
        StatusId.PendingHRReviewOfferWorkPermitInit,
        StatusId.PendingFinancePaymentReview,
        StatusId.PendingHRReviewOfferuploadEmploymentInit,
        StatusId.PendingHREmploymentContractInit,
        StatusId.PendingHREmploymentContractReview,
        StatusId.PendingHREmploymentContractVerification,
        StatusId.PendingHRpreonboardingchecklist,
      ],
      columnName: "RecruitmentHR",
      emailId: EmailId,
      labourHire: Choices.Yes,
    }),
  ),

  //KCSA
  [MatricID.Kcsa]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter({
      status: [
        StatusId.PendingHROfferInitiate,
        StatusId.PendingHRReviewOfferWorkPermitInit,
        StatusId.PendingHRReviewWorkpermitDocs,
        StatusId.WorkPermitAcknowledgedContractUploaded,
        StatusId.PendingHREmploymentContractVerification,
        StatusId.PendingHRReviewOfferanduploadEmployementContract,
        StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract,
        StatusId.PendingHRpreonboardingchecklist,
      ],
      columnName: "RecruitmentHR",
      emailId: EmailId,
      labourHire: Choices.No,
    }),
  ),

  //Reviewscordcard HOD
  [MatricID.ReviewScoredHOD]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: StatusId.RecruitmentInProgress,
      columnName: "HOD",
      emailId: EmailId,
    }),
  ),

  //MySubmission
  [MatricID.MySubmission]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    // StatusFilter({ status: [], columnName: "", emailId: "" }),
  ),

  // MySubmissionHR: 28,

  [MatricID.MySubmissionHR]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: [
        StatusId.PendingwithLineManagereviewAdv,
        StatusId.PendingReviewAdvertHOD,
        StatusId.CareerPortalQuestions,
        StatusId.PendingUploadONEM,
        StatusId.RecruitmentInProgress,
      ],
      columnName: "AssignedHR",
      emailId: EmailId,
    }),
  ),

  // MySubmissionLM: 29,

  [MatricID.MySubmissionLM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: [
        StatusId.PendingReviewAdvertHOD,
        StatusId.CareerPortalQuestions,
        StatusId.PendingUploadONEM,
        StatusId.RecruitmentInProgress,
      ],
      columnName: "LineManager",
      emailId: EmailId,
    }),
  ),

  //MySubmissionHOD: 30,

  [MatricID.MySubmissionHOD]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: [StatusId.PendingUploadONEM, StatusId.RecruitmentInProgress],
      columnName: "HOD",
      emailId: EmailId,
    }),
  ),

  //MySubmissionBGV: 31,

  [MatricID.MySubmissionBGV]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter({
      status: [
        StatusId.PendingBGdocuploadedbycandidate,
        StatusId.PendingwithTAforMedicalScreening,
        StatusId.PendingwithTAforMedicalScreening,
        StatusId.PendingCandidateOfferLetterUpload,
        StatusId.PendingCandidateWorkPermitreleatedDoc,
        StatusId.PendingCandidateEmploymentContractUpload,
        StatusId.PendingLabourHireOfferRelease,
        StatusId.PendingLabourhireWPPayment,
        StatusId.PendingFinancePaymentReview,
        StatusId.PendingLHWorkPermitProcess,
        StatusId.PendingLHECRelease,
        StatusId.BackgroundCheckVerificationFailed,
        StatusId.FailedmedicalscreeningUnfit,
        StatusId.RESIProcessInitiatedforDRC,
        StatusId.RESIProcessInitiatedforExpatriate,
        StatusId.RESProcessInitiated,
        StatusId.onboardingInProcess,
        StatusId.OnboardingProcessinitiatedforDRC,
        StatusId.OnboardingProcessinitiatedforExpat,
      ],
      columnName: "RecruitmentHR",
      emailId: EmailId,
    }),
  ),

  [MatricID.AssignAgencies]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: [StatusId.RecruitmentInProgress],
      columnName: "AssignedHR",
      emailId: EmailId,
    }),
  ),

  [MatricID.advertExtension]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter({
      status: [StatusId.RecruitmentInProgress],
      columnName: "HOD",
      emailId: EmailId,
    }),
  ),
});

const RoleMetricFilters: Record<number, number[]> = {
  [RoleID.RecruitmentHRLead]: [
    MatricID.AssignHr,
    MatricID.UploadONEM,
    MatricID.ReviewScoreCard,
    MatricID.interviewSchedule,
    // MatricID.interviewTracker,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
    MatricID.MySubmission
  ],

  [RoleID.RecruitmentHR]: [
    MatricID.JobAdvert,
    MatricID.AssignAgencies,
    MatricID.ReviewProfileHR,
    MatricID.AssignInterviewPanel,
    MatricID.InterviewQuestionHR,
    MatricID.EvalutionHR,
    MatricID.interviewSchedule,
    MatricID.BackgroundCheck,
    MatricID.LabourHire,
    MatricID.Kcsa,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
    MatricID.MySubmissionHR,
    MatricID.MySubmissionBGV,
  ],

  [RoleID.LineManager]: [
    MatricID.AdvertReviewLM,
    MatricID.EvalutionLM,
    MatricID.ReviewProfileLM,
    MatricID.DisqualifiQuesLM,
    MatricID.InterviewQuestionLM,
    MatricID.interviewSchedule,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
    MatricID.MySubmissionLM,
  ],

  [RoleID.HOD]: [
    MatricID.AdvertReviewHOD,
    MatricID.ReviewScoreCard,
    MatricID.EvalutionHOD,
    MatricID.advertExtension,
    MatricID.interviewSchedule,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
    MatricID.MySubmissionHOD,
  ],

  [RoleID.RecruitmentAppExternalAgency]: [
    MatricID.EvalutionEXCO,
    MatricID.interviewSchedule,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
    // MatricID.MySubmissionEXCO,
  ],

  [RoleID.FinanceDepartment]: [
    MatricID.LabourHire,
    MatricID.interviewSchedule,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
  ],
};

export const getRoleBasedFilters = (
  roles: number[],
  EmailId: string,
): FilterQuery[] => {
  const metricSet = new Set<number>();

  roles.forEach((role) => {
    const metrics = RoleMetricFilters[role] || [];
    metrics.forEach((metric) => metricSet.add(metric));
  });

  // ✅ Pass roles into config so it knows about HOD+LM combo
  const configMap = MetricQueryConfig(EmailId, roles);

  let result: FilterQuery[] = [];

  metricSet.forEach((metricId) => {
    const config = configMap[metricId];
    if (!config) return;

    if (Array.isArray(config)) {
      config.forEach((cfg) => result.push({ StateValue: metricId, ...cfg }));
    } else {
      result.push({ StateValue: metricId, ...config });
    }
  });

  if (roles.includes(RoleID.LineManager) && roles.includes(RoleID.HOD)) {
    const removeStates = [MatricID.AdvertReviewHOD, MatricID.EvalutionHOD];
    result = result.filter((item) => !removeStates.includes(item.StateValue));
  }

  return result;
};

export const totalPriority = (matrixs: Metric[]) => {
  const priority = matrixs.filter((m) => m.showArrow);
  const total = priority.reduce((acc, metric) => acc + metric.value, 0);
  return total;
};

export const priorityValues = (matrixs: Metric[]): PriorityData[] => {
  const total = totalPriority(matrixs);

  return matrixs
    .filter((m) => m.showArrow)
    .sort((a, b) => {
      if (a.value === 0 && b.value > 0) return 1;
      if (a.value > 0 && b.value === 0) return -1;
      return b.value - a.value;
    })
    .map((m) => ({
      name: m.label,
      value: m.value,
      percent: total > 0 ? Math.round((m.value / total) * 100) : 0,
      color: m.color,
      iconType: "hr",
    }));
};
