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
