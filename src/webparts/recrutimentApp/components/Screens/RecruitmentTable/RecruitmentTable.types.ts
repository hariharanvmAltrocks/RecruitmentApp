import { tooltipInterviewPanel } from "../../../services/Dashboard/IDashboard";

export type RecruitmentTabKey =
  | "tab1"
  | "tab2"
  | "tab3"
  | "tab4"
  | "tab5"
  | "tab6";

export type TableMode = "normal" | "checkbox";

export type TableActionMode = "View" | "Upload";

export interface TableAction {
  View: "View";
  Upload: "Upload";
}

export interface TabItem {
  key: RecruitmentTabKey;
  label: string;
  description: string;
  tableMode: TableMode;
  actionMode: TableActionMode;
  matricId: number;
}

export interface RecruitmentItem {
  id: string;
  ItemID: number;
  jobCode: string;
  title: string;
  department: string;
  ProfileCount?: number;
  count: number;
  requestType: string;
  nationality: string;
  status: string;
  statusId: number;
  jobCodeID: number;
  StatusTooltip?: tooltipInterviewPanel;
}

export interface ISelectedCandidate {
  id: string;
  ItemID: number;
  CandidateID: number;
  jobrequestID: string;
  positionId: string;
  applicantName: string;
  buCode: string;
  jobCode: string;
  title: string;
  department: string;
  nationality: string;
  status: string;
  statusId: number;
  jobCodeID: number;
  RecID: number;

  EmploymentCategory: string;
  IsExpat: boolean;
}

export interface EvalutionItem {
  id: string;
  ItemID: number;
  RecID: number;
  department: string;
  applicantName: string;
  title: string;
  nationlity: string;
  interviewDate: string;
  interviewLevels: number;
  grade: string;
  status: string;
  statusId: number;
  jobCodeID?: number;
}

export interface HrMember {
  id: number;
  name: string;
  role: string;
  initials: string;
}

export interface AssignmentPayload {
  vacancies: RecruitmentItem[];
  member: HrMember | null;
  comments: string;
}
