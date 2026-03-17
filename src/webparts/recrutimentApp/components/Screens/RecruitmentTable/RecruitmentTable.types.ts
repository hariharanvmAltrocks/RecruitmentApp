export type RecruitmentTabKey = "tab1" | "tab2" | "tab3" | "tab4" | "tab5" | "tab6";

export type TableMode = "normal" | "checkbox";

export type TableActionMode = "View" | "Upload";

export interface TableAction   { 
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
  count: number;
  requestType: string;
  nationality: string;
  status: string;
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

