import { ISummaryCardItem } from "../DashboardComman/CommonSummaryCards";

export interface Contract {
  id: string;
  contractName: string;
  contractId: string;
  department: string;
  supplier: string;
  assignedHR: string;
  requiredPositions: number;
  filledPositions: number;
  balance: number; // calculated: required - filled
  candidateCount: number;
  interviewCount: number;
  offerCount: number;
  joiningCount: number;
  endDate: string;
  remainingDays: number; // calculated: endDate - today
  slaProgress: number; // percentage
  slaStatus: "On Track" | "At Risk" | "Overdue";
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Completed" | "Pending" | "Suspended";
  submissionDate: string;
}

export interface HRWorkflow {
  hrName: string;
  hrAvatar: string;
  assignedContracts: number;
  requiredPositions: number;
  filledPositions: number;
  balance: number;
  candidates: number;
  completionPercentage: number;
  status: "Active" | "Completed" | "Pending";
  slaPercentage: number;
}

export interface SLAStats {
  overallSla: number; // 0 - 100
  onTrack: number;
  dueSoon: number;
  overdue: number;
  avgCompletionTime: number; // days
  avgDaysRemaining: number;
}

export interface KPIMetrics {
  assignedContracts: number;
  candidates: number;
  openPositions: number;
  filledPositions: number;
  balance: number;
  todayInterviews: number;
  upcomingSLA: number;
  overdueContracts: number;
  avgHiringTime: number; // days
  monthlyHiring: number;
}

export interface NotificationItem {
  id: string;
  type: "info" | "success" | "warning" | "error";
  text: string;
  timestamp: string;
}

export interface TimelineStep {
  title: string;
  status: "completed" | "active" | "pending" | "rejected" | "onhold";
  date?: string;
  description?: string;
}

export interface CandidateDashboardData {
  appliedPositions: string;
  applicationStatus: string;
  interviewSchedule: string;
  offerStatus: string;
  profileCompletion: number; // 0-100
  recruiterName: string;
  recruiterEmail: string;
  messages: Array<{ sender: string; text: string; time: string }>;
  timeline: TimelineStep[];
  uploadedDocuments: Array<{ name: string; status: string; date: string }>;
}

export interface IHRLeadSummary {
  TotalOpenPosition: number;
  RecruitmentInProgress: number;
  Onboarding: number;
  OnemDocumentStage: number;
  Duemonth: IDueMonth;
  OverDuePosition: number;
}



export type IPositionSource = {
  name: string;
  avatarText: string;
  avatarTheme: string;
  positionsCount: number;
  percentage: number;
  pending: number;
  done: number;
  total: number;
}


export type IPositionDetails = {
  id: number;
  ItemID: number;
  JobCode: string;
  Jobtitle: string;
  department: string;
  dateRequired: string;
  headcount: string;
  vacant: string;
  assignHR: string;
  dayaLeft: string;
  Positionstatus: "Overdue" | "At Risk" | "On Track";
  nationality: string;
  status: string;
  statusId: number;
}

export type IPositionStatus = {
  OnTrack: number;
  atRisk: number;
  overduecount: number;
  dueLast7days: number;
  total: number;
}

export type IDueMonth = {
  Jan: string;
  Feb: string;
  Mar: string;
  Apr: string;
  May: string;
  June: string;
  July: string;
  Aug: string;
  Sep: string;
  Oct: string;
  Nov: string;
  Dec: string;
}

export interface IHRDashboardSummary {
  myOpenPositions: number;
  myOpenPositionsTrend: string;
  myOpenPositionsTrendColor: "success" | "danger" | "neutral";

  myFilledPositions: number;
  myFilledPositionsTrend: string;
  myFilledPositionsTrendColor: "success" | "danger" | "neutral";

  myTotalPositions: number;
  myTotalPositionsTrend: string;

  activeCandidates: number;
  activeCandidatesTrend: string;

  tasksPending?: number;
  tasksPendingTrend?: string;
  tasksPendingTrendColor?: "warning" | "danger" | "neutral";

  interviewsThisMonth?: number;
  interviewsThisMonthTrend?: string;
}

export interface IMonthlyTrackerItem {
  month: string;
  totalPositions: number;
  positionsFilled: number;
  openPositions: number;
}

export interface IDepartmentPosition {
  department: string;
  total: number;
  filled: number;
  open: number;
  filledPercentage: number;
}

export interface ICandidatePipelineStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface IHRTask {
  id: number;
  JobCode: string;
  Jobtitle: string;
  department: string;
  dateRequired: string;
  headcount: string;
  filledcount: string;
  vacant: string;
  dayaLeft: string;
  Positionstatus: "Overdue" | "At Risk" | "On Track";
}



export interface IHODSummary {
  id: string;
  title: string;
  value: number;
  trendText: string;
  trendType: "success" | "danger" | "neutral";
  iconName: string;
}

export interface IPositionsJobRole {
  jobRole: string;
  total: number;
  filled: number;
  open: number;
  percentage: number;
}

export interface IHRSummary {
  JobTitle: string;
  HRName: string;
  openPositions: number;
  filledPositions: number;
}

export interface IMyApprovals {
  id: number;
  requestType: string;
  count: number;
}



export interface IHRLeadPerformance {
  hrLeadName: string;
  hrsManaged: number;
  filled: number;
  open: number
}

export interface IConflictOfInterestAlert {
  name: string;
  JobTitle: string;
  coiReason: string;
  currentstatus: string;
}


export interface ISeniorHRMonthlyTracker {
  month: string;
  total: number;
  filled: number;
  open: number;
}

export interface ISeniorHRTask {
  id: number;
  JobCode: string;
  Jobtitle: string;
  department: string;
  dateRequired: string;
  RecruitmentHRlead: string;
  RecruitmentHR: string;
  headcount: string;
  filledcount: string;
  vacant: string;
  dayaLeft: string;
  Positionstatus: "Overdue" | "At Risk" | "On Track";
}

export type IHRLeadDashboard = {
  HRLeadSummary: IHRLeadSummary;
  PositionByStatus: IPositionStatus;
  PositionSource: IPositionSource[];
  positionDetails: IPositionDetails[];
  departmentPositions?: IDepartmentPosition[];
}

export interface IHRDashboardData {
  summary: ISummaryCardItem[];                      //IHRDashboardSummary;
  monthlyTracker: IMonthlyTrackerItem[];
  departmentPositions: IDepartmentPosition[];
  candidatePipeline: ICandidatePipelineStage[];
  tasks: IHRTask[];
}

export interface IHODDashbaord {
  summary: ISummaryCardItem[];
  monthlyTracker: IMonthlyTrackerItem[];
  positionsJobRole: IPositionsJobRole[];
  HRSummary: IHRSummary[];
  PositionStatus: IPositionStatus | null;
  MyApprovals: IMyApprovals[];
  tasks: IHRTask[];
}

export interface ISeniorHRSummary {
  summary: ISummaryCardItem[];
  monthlyTracker: ISeniorHRMonthlyTracker[];
  departmentPositions: IDepartmentPosition[];
  HrLeadPerformance: IHRLeadPerformance[];
  conflictOfInterestAlerts: IConflictOfInterestAlert[];
  tasks: ISeniorHRTask[];
}
