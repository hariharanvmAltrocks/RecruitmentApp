export type RecruitmentTabKey = "mySubmission" | "assignRecruitmentHR" | "uploadOnemDoc";

export type TableMode = "normal" | "checkbox";

export type TableActionMode = "view" | "upload";

export interface TabItem {
  key: RecruitmentTabKey;
  label: string;
  description: string;
  tableMode: TableMode;
  actionMode: TableActionMode;
}

export interface RecruitmentItem {
  id: string;
  jobCode: string;
  title: string;
  department: string;
  count: number;
  requestType: string;
  nationality: string;
  status: string;
}

export interface HrMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface AssignmentPayload {
  vacancies: RecruitmentItem[];
  member: HrMember | null;
  comments: string;
}
