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

export type IHRLeadDashboard = {
  TotalOpenPosition: number;
  RecruitmentInProgress: number;
  Onboarding: number;
  OnemDocumentStage: number;
  Duemonth: IDueMonth;
  OverDuePosition: number;
  PositionByStatus: IPositionStatus;
  PositionSource:IPositionSource[];
  positionDetails: IPositionDetails[];
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
  JobCode: string;
  Jobtitle: string;
  department: string;
  dateRequired: string;
  headcount: string;
  vacant: string;
  assignHR: string;
  dayaLeft: string;
  Positionstatus: "Overdue" | "At Risk" | "On Track";
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
  
  tasksPending: number;
  tasksPendingTrend: string;
  tasksPendingTrendColor: "warning" | "danger" | "neutral";
  
  interviewsThisMonth: number;
  interviewsThisMonthTrend: string;
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
  id: string;
  task: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed";
}

export interface IHRDashboardData {
  summary: IHRDashboardSummary;
  monthlyTracker: IMonthlyTrackerItem[];
  departmentPositions: IDepartmentPosition[];
  candidatePipeline: ICandidatePipelineStage[];
  tasks: IHRTask[];
}