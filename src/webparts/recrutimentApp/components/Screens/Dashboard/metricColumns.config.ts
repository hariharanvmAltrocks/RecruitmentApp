import {
  UserCheck,
  Activity,
  ClipboardList,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  UserPlus,
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
import { MatricID, menuID, TabName } from "../../../utilities/ConditionConfig";
import { userInfo } from "../../../utilities/hooks/RoleContext";

const BASE_METRICS: Record<number, Omit<MetricConfig, "id" | "showArrow">> = {
  [MatricID.AssignHr]: {
    label: "Pending HR Assignment",
    status: "ACTIVE",
    icon: UserCheck,
    color: "#f97316",
    bgColor: "#fff7ed",
    statusColor: "#3b82f6",
    statusBg: "#eff6ff",
    iconType: "hr",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.AssignRecuritmentHR,
  },

  [MatricID.UploadONEM]: {
    label: "Pending Upload ONEM",
    status: "PENDING",
    icon: Activity,
    color: "#f59e0b",
    bgColor: "#fffbeb",
    statusColor: "#64748b",
    statusBg: "#f1f5f9",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab2",
    TabName: TabName.UploadONEMDoc,
  },

  [MatricID.JobAdvert]: {
    label: "Pending Advert Upload",
    status: "ACTIVE",
    icon: UserCheck,
    color: "#ea580c",
    bgColor: "#ffedd5",
    statusColor: "#64748b",
    statusBg: "#f1f5f9",
    iconType: "onem",
    path: "/RecruitmentTable",
    menuId: menuID.PreSelectionProcess,
    TabValue: "tab1",
    TabName: TabName.UploadAdvertisement,
  },

  [MatricID.ReviewProfileHR]: {
    label: "Review Profile",
    status: "PENDING",
    icon: Activity,
    color: "#f59e0b",
    bgColor: "#fffbeb",
    statusColor: "#3b82f6", // Active badge is blue
    statusBg: "#eff6ff",
    path: "/RecruitmentTable",
    menuId: menuID.PostSelectionProcess,
    TabValue: "tab1",
    TabName: TabName.ReviewProfile,
  },
  [MatricID.ReviewProfileLM]: {
    label: "Review Profile",
    status: "PENDING",
    icon: Activity,
    color: "#f59e0b",
    bgColor: "#fffbeb",
    statusColor: "#3b82f6",
    statusBg: "#eff6ff",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab3",
    TabName: TabName.ReviewProfile,
  },

  [MatricID.AssignInterviewPanel]: {
    label: "Assign Interview Panel",
    status: "PENDING",
    icon: Activity,
    color: "#fbbf24",
    bgColor: "#fefce8",
    statusColor: "#64748b",
    statusBg: "#f1f5f9",
    path: "/RecruitmentTable",
    menuId: menuID.PostSelectionProcess,
    TabValue: "tab2",
    TabName: TabName.AssignInterviewPanel,
  },

  [MatricID.InterviewQuestionHR]: {
    label: "Pending InterviewQuestion",
    status: "CRITICAL",
    icon: ClipboardList,
    color: "#ef4444",
    bgColor: "#fef2f2",
    statusColor: "#64748b",
    statusBg: "#f1f5f9",
    path: "/RecruitmentTable",
    menuId: menuID.PostSelectionProcess,
    TabValue: "tab3",
    TabName: TabName.InterviewQuestion,
  },

  [MatricID.EvalutionHR]: {
    label: "Pending Evaluation",
    status: "PENDING",
    icon: Activity,
    color: "#d97706",
    bgColor: "#fef3c7",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.PostSelectionProcess,
    TabValue: "tab4",
    TabName: TabName.Evaluation,
  },
  [MatricID.BackgroundCheck]: {
    label: "Pending Background Verification",
    status: "PENDING",
    icon: Activity,
    color: "#d97706",
    bgColor: "#fef3c7",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.RecruitmentProcess,
    TabValue: "tab1",
    TabName: TabName.BackgroundVerification,
  },
  [MatricID.LabourHire]: {
    label: "Pending LabourHire",
    status: "PENDING",
    icon: Activity,
    color: "#d97706",
    bgColor: "#fef3c7",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.RecruitmentProcess,
    TabValue: "tab2",
    TabName: TabName.LabourHire,
  },
  [MatricID.Kcsa]: {
    label: "Pending Evaluation",
    status: "PENDING",
    icon: Activity,
    color: "#d97706",
    bgColor: "#fef3c7",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.RecruitmentProcess,
    TabValue: "tab3",
    TabName: TabName.OfferLetterKSCA,
  },

  [MatricID.AdvertReviewLM]: {
    label: "Pending Advert Review",
    status: "ACTIVE",
    icon: UserCheck,
    color: "#fb923c",
    bgColor: "#fff7ed",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.Evaluation,
  },

  [MatricID.InterviewQuestionLM]: {
    label: "Pending Create Minimum Criteria Question",
    status: "PENDING",
    icon: Activity,
    color: "#10b981",
    bgColor: "#ecfdf5",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab2",
    TabName: TabName.InterviewQuestion,
  },
  [MatricID.EvalutionLM]: {
    label: "Pending Evaluation",
    status: "PENDING",
    icon: Activity,
    color: "#d97706",
    bgColor: "#fef3c7",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab4",
    TabName: TabName.Evaluation,
  },

  [MatricID.AdvertReviewHOD]: {
    label: "Pending Advert Review",
    status: "ACTIVE",
    icon: UserCheck,
    color: "#fdba74",
    bgColor: "#fff7ed",
    statusColor: "#64748b",
    statusBg: "#f1f5f9",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.ReviewJobAdvertisement,
  },

  [MatricID.ReviewScoreCard]: {
    label: "Pending Position ID",
    status: "CRITICAL",
    icon: ClipboardList,
    color: "#ef4444",
    bgColor: "#fef2f2",
    statusColor: "#64748b",
    statusBg: "#f1f5f9",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab2",
    TabName: TabName.ReviewScorecard,
  },
  [MatricID.EvalutionHOD]: {
    label: "Pending Evaluation",
    status: "PENDING",
    icon: Activity,
    color: "#d97706",
    bgColor: "#fef3c7",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab3",
    TabName: TabName.Evaluation,
  },

  [MatricID.interviewSchedule]: {
    label: "Interviews Scheduled",
    status: "SCHEDULED",
    icon: Calendar,
    color: "#3b82f6",
    bgColor: "#eff6ff",
    statusColor: "#3b82f6",
    statusBg: "#eff6ff",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.InterviewQuestion,
  },

  [MatricID.EvalutionEXCO]: {
    label: "Pending Evaluation",
    status: "PENDING",
    icon: Activity,
    color: "#d97706",
    bgColor: "#fef3c7",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.Evaluation,
  },

  [MatricID.interviewTracker]: {
    label: "Interview Tracking",
    status: "ON-GOING",
    icon: Activity,
    color: "#10b981",
    bgColor: "#ecfdf5",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.Evaluation,
  },

  [MatricID.OfferRelease]: {
    label: "Offer Letters Released",
    status: "OUTBOUND",
    icon: FileText,
    color: "#6366f1",
    bgColor: "#eef2ff",
    statusColor: "#3b82f6", // Active badge is blue
    statusBg: "#eff6ff",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.LabourHire,
  },

  [MatricID.OfferAccepted]: {
    label: "Offers Accepted",
    status: "SUCCESS",
    icon: CheckCircle2,
    color: "#22c55e",
    bgColor: "#f0fdf4",
    statusColor: "#64748b",
    statusBg: "#f1f5f9",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.LabourHire,
  },

  [MatricID.OfferRejected]: {
    label: "Offers Rejected",
    status: "LOST",
    icon: XCircle,
    color: "#f43f5e",
    bgColor: "#fff1f2",
    statusColor: "#64748b",
    statusBg: "#f1f5f9",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.LabourHire,
  },

  [MatricID.Onbording]: {
    label: "Candidates Onboarded",
    status: "WELCOME",
    icon: UserPlus,
    color: "#2563eb",
    bgColor: "#eff6ff",
    statusColor: "#ef4444",
    statusBg: "#fee2e2",
    path: "/RecruitmentTable",
    menuId: menuID.SelectionProcess,
    TabValue: "tab1",
    TabName: TabName.LabourHire,
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

  roles.forEach((role) => {
    let roleColumns: MetricConfig[] = [];

    switch (role) {
      case RoleID.RecruitmentHRLead:
        roleColumns = [
          buildCol(MatricID.AssignHr, { showArrow: true }),
          buildCol(MatricID.UploadONEM, { showArrow: true }),
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
          buildCol(MatricID.ReviewProfileHR, {
            showArrow: false,
            externalApi: { workflowStatuses: [workflowStatusApi.HRPending] },
          }),
          buildCol(MatricID.AssignInterviewPanel, {
            showArrow: false,
            externalApi: {
              workflowStatuses: [
                workflowStatusApi.PendingRecruitmentHRscheduleInterview,
              ],
            },
          }),
          buildCol(MatricID.EvalutionHR, { showArrow: true }),
          buildCol(MatricID.InterviewQuestionHR, { showArrow: true }),
          buildCol(MatricID.BackgroundCheck, { showArrow: true }),
          buildCol(MatricID.LabourHire, { showArrow: true }),
          buildCol(MatricID.Kcsa, { showArrow: true }),

          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          buildCol(MatricID.interviewTracker, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
        ];
        break;

      case RoleID.LineManager:
        roleColumns = [
          buildCol(MatricID.AdvertReviewLM, { showArrow: true }),
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
          buildCol(MatricID.ReviewScoreCard, { showArrow: false }),
          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          buildCol(MatricID.interviewTracker, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
        ];
        break;

      case RoleID.HOD:
        roleColumns = [
          buildCol(MatricID.AdvertReviewHOD, { showArrow: true }),
          buildCol(MatricID.EvalutionHOD, { showArrow: true }),
          buildCol(MatricID.ReviewScoreCard, { showArrow: true }),
          buildCol(MatricID.interviewSchedule, { showArrow: false }),
          buildCol(MatricID.interviewTracker, { showArrow: false }),
          buildCol(MatricID.OfferRelease, { showArrow: false }),
          buildCol(MatricID.OfferAccepted, { showArrow: false }),
          buildCol(MatricID.OfferRejected, { showArrow: false }),
          buildCol(MatricID.Onbording, { showArrow: false }),
        ];
        break;

      case RoleID.RecruitmentAppExternalAgency:
        roleColumns = [
          buildCol(MatricID.EvalutionEXCO, { showArrow: true }),
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
    if (roles.includes(RoleID.LineManager) && roles.includes(RoleID.HOD)) {
      roleColumns = roleColumns.filter(
        (col) => col.id !== MatricID.AdvertReviewHOD,
      );
    }
    columns.push(...roleColumns);
  });

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

const StatusFilter = (
  status: number | number[],
  columnName?: string,
  emailId?: string,
) => {
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
): Record<number, SingleQuery | SingleQuery[]> => ({
  // ✅ Assign HR
  [MatricID.AssignHr]: [
    createQuery(
      ListNames.HRMSNewPositionRequest,
      [...StatusFilter(StatusId.ReadyforRecruitmentProcess), ...DataSyncFilter],
      ["Id"],
    ),
    createQuery(
      ListNames.HRMSVacancyReplacementRequest,
      [...StatusFilter(StatusId.ReadyforRecruitmentProcess), ...DataSyncFilter],
      ["Id"],
    ),
  ],

  // ✅ Upload ONEM
  [MatricID.UploadONEM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.PendingUploadONEM),
  ),

  // ✅ Job Advert
  [MatricID.JobAdvert]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.PendingUploadAdvert, "AssignedHR", EmailId),
  ),

  // ✅ Advert Review HOD
  [MatricID.AdvertReviewHOD]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.PendingReviewAdvertHOD, "HOD", EmailId),
  ),

  // ✅ Advert Review LM
  [MatricID.AdvertReviewLM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(
      StatusId.PendingwithLineManagereviewAdv,
      "LineManager",
      EmailId,
    ),
  ),

  // ✅ Review Score Card (FIXED - only one)
  [MatricID.ReviewScoreCard]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter(StatusId.PendingwithHODtoAssignPositionID),
  ),

  // ✅ Review Profile HR
  [MatricID.ReviewProfileHR]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.RecruitmentInProgress, "AssignedHR", EmailId),
  ),

  // ✅ Review Profile LM
  [MatricID.ReviewProfileLM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.RecruitmentInProgress, "LineManager", EmailId),
  ),

  // ✅ Assign Interview Panel
  [MatricID.AssignInterviewPanel]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.RecruitmentInProgress, "AssignedHR", EmailId),
  ),

  // ✅ Interview Question HR
  [MatricID.InterviewQuestionHR]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.PendingInterviewquestion, "AssignedHR", EmailId),
  ),

  // ✅ Interview Question LM (FIXED)
  [MatricID.InterviewQuestionLM]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(
      [StatusId.PendingInterviewquestion, StatusId.CareerPortalQuestions],
      "LineManager",
      EmailId,
    ),
  ),

  // ✅ Interview Schedule
  [MatricID.interviewSchedule]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter([
      StatusId.InterviewScheduled,
      StatusId.InterviewScheduledforLevel2,
    ]),
  ),

  // ✅ Interview Tracker
  [MatricID.interviewTracker]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter([
      StatusId.InterviewScheduled,
      StatusId.InterviewScheduledforLevel2,
    ]),
  ),

  // ✅ Evaluation HR
  [MatricID.EvalutionHR]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter([
      StatusId.InterviewScheduled,
      StatusId.InterviewScheduledforLevel2,
    ]),
  ),

  // ✅ Evaluation LM
  [MatricID.EvalutionLM]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter(StatusId.InterviewScheduled),
  ),

  // ✅ Evaluation HOD
  [MatricID.EvalutionHOD]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter([
      StatusId.InterviewScheduled,
      StatusId.InterviewScheduledforLevel2,
    ]),
  ),

  // ✅ Evaluation EXCO
  [MatricID.EvalutionEXCO]: createQuery(
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
    StatusFilter(StatusId.InterviewScheduledforLevel2),
  ),

  // ✅ Offer Release
  [MatricID.OfferRelease]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter(StatusId.PendingCandidateOfferLetterUpload),
  ),

  // ✅ Offer Accepted
  [MatricID.OfferAccepted]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter(StatusId.PendingHROfferReview),
  ),

  // ✅ Offer Rejected
  [MatricID.OfferRejected]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter(StatusId.offerdecline),
  ),

  // ✅ Onboarding
  [MatricID.Onbording]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter(StatusId.Onboarded),
  ),

  //MySubmission
  [MatricID.MySubmission]: createQuery(ListNames.HRMSRecruitmentDptDetails),

  //Assign Agencies
  [MatricID.AssignAgencies]: createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.RecruitmentInProgress),
  ),

  //Background Check
  [MatricID.BackgroundCheck]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter([
      StatusId.PendingHRBGVInitiation,
      StatusId.PendingHRReviewBGCheck,
      StatusId.PendingDOTAficaVerification,
    ]),
  ),

  //LabourHire
  [MatricID.LabourHire]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter([
      StatusId.PendingLabourHireOfferRelease,
      StatusId.PendingHROfferReview,
      StatusId.PendingLabourhireWPPayment,
      StatusId.PendingFinancePaymentReview,
      StatusId.PendingLHWorkPermitProcess,
      StatusId.PendingHRReviewOfferuploadEmploymentInit,
      StatusId.PendingHREmploymentContractInit,
      StatusId.PendingLHECRelease,
      StatusId.PendingHREmploymentContractReview
    ], "AssignedHR"),
  ),

  //KCSA
  [MatricID.Kcsa]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter([
      StatusId.PendingHRReviewOfferWorkPermitInit,
      StatusId.PendingHRReviewWorkpermitDocs,
      StatusId.WorkPermitAcknowledgedContractUploaded,
      StatusId.PendingHREmploymentContractVerification,
      StatusId.PendingHRReviewOfferanduploadEmployementContract,
      StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract,
    ], "AssignedHR"),
  ),

  [MatricID.Kcsa]: createQuery(
    ListNames.HRMSSelectedCandidateDetailsByHOD,
    StatusFilter([
      StatusId.PendingHRReviewOfferWorkPermitInit,
      StatusId.PendingHRReviewWorkpermitDocs,
      StatusId.WorkPermitAcknowledgedContractUploaded,
      StatusId.PendingHREmploymentContractVerification,
      StatusId.PendingHRReviewOfferanduploadEmployementContract,
      StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract,
    ], "AssignedHR"),
  ),

  //Reviewscordcard HOD
  [MatricID.ReviewScoredHOD]:  createQuery(
    ListNames.HRMSRecruitmentDptDetails,
    StatusFilter(StatusId.RecruitmentInProgress, "HOD", EmailId),
  ),

});

const RoleMetricFilters: Record<number, number[]> = {
  [RoleID.RecruitmentHRLead]: [
    MatricID.AssignHr,
    MatricID.UploadONEM,
    MatricID.ReviewScoreCard,
    MatricID.interviewSchedule,
    MatricID.interviewTracker,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
  ],

  [RoleID.RecruitmentHR]: [
    MatricID.JobAdvert,
    MatricID.ReviewProfileHR,
    MatricID.AssignInterviewPanel,
    MatricID.InterviewQuestionHR,
    MatricID.EvalutionHR,
    MatricID.BackgroundCheck,
    MatricID.LabourHire,
    MatricID.Kcsa,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
  ],

  [RoleID.LineManager]: [
    MatricID.AdvertReviewLM,
    MatricID.EvalutionLM,
    MatricID.ReviewProfileLM,
    MatricID.InterviewQuestionLM,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
  ],

  [RoleID.HOD]: [
    MatricID.AdvertReviewHOD,
    MatricID.ReviewScoreCard,
    MatricID.EvalutionHOD,
    MatricID.OfferRelease,
    MatricID.OfferAccepted,
    MatricID.OfferRejected,
    MatricID.Onbording,
  ],

  [RoleID.RecruitmentAppExternalAgency]: [
    MatricID.EvalutionEXCO,
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

  const configMap = MetricQueryConfig(EmailId);

  let result: FilterQuery[] = [];

  metricSet.forEach((metricId) => {
    const config = configMap[metricId];

    if (!config) return;

    if (Array.isArray(config)) {
      config.forEach((cfg) => {
        result.push({ StateValue: metricId, ...cfg });
      });
    } else {
      result.push({ StateValue: metricId, ...config });
    }
  });

  if (roles.includes(RoleID.LineManager) && roles.includes(RoleID.HOD)) {
    result = result.filter(
      (item) => item.StateValue !== MatricID.AdvertReviewHOD,
    );
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
    .map((m) => ({
      name: m.label,
      value: m.value,
      percent: total > 0 ? Math.round((m.value / total) * 100) : 0,
      color: m.color,
      iconType: "hr",
    }));
};
