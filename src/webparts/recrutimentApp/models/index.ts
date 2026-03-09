import { LucideIcon } from 'lucide-react';

export interface Metric {
  id: string;
  label: string;
  value: number;
  status: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface TrackerRow {
  id: string;
  jobCode: string;
  title: string;
  vacancies: number;
  date: string;
  status: string;
  buCode: string;
  posRequest: string;
  nationality: string;
}

export interface AttachmentVersion {
  lang: string;
  size: string;
  label: string;
}

export interface Attachment {
  title: string;
  type: string;
  versions: AttachmentVersion[];
}

export interface JobAdvertDetail {
  jobCode: string;
  jobTitle: string;
  buCode: string;
  buName: string;
  buDescription: string;
  department: string;
  subDepartment: string;
  section: string;
  deptCode: string;
  nationality: string;
  patersonGrade: string;
  drcGrade: string;
  employmentCategory: string;
  contractType: string;
  areaOfWork: string;
  noOfPersons: string;
  dateRequired: string;
  posRequest: string;
  status: string;
  grade: string;
  reportsTo: string;
  description: string;
  descriptionFr: string;
  responsibilities: string[];
  responsibilitiesFr: string[];
  qualifications: string[];
  qualificationsFr: string[];
  experience: string[];
  experienceFr: string[];
  attachments: Attachment[];
}

export interface EvaluationRow {
  id: number;
  applicantName: string;
  positionTitle: string;
  interviewDate: string;
  interviewLevels: string;
  grade: string;
  status: string;
}

export interface Questionnaire {
  id: string;
  q: string;
  rating: string;
  score: number;
  guide: string;
}

export interface CandidateScore {
  qualifications: string;
  experience: string;
  knowledge: string;
  energy: string;
  requirements: string;
  culture: string;
  expat: string;
  other: string;
}

export interface Candidate {
  id: number;
  applicantName: string;
  positionTitle: string;
  interviewLevels: string;
  grade: string;
  gpa: number;
  status: string;
  avatar: string;
  nationality: string;
  classification: string;
  gender: string;
  qualification: string;
  miningExp: string;
  relatedExp: string;
  interviewDate: string;
  conflicts: string;
  disability: string;
  panel: string[];
  questionnaires: Questionnaire[];
  scores: CandidateScore;
  recommendation: string;
  panelFeedback: string;
}

export interface UrgentTask {
  title: string;
  subtitle: string;
  overdue: string;
  type: 'error' | 'warning';
}

export interface PriorityData {
  name: string;
  value: number;
  color: string;
}

export type ViewType = 'dashboard' | 'advert-review' | 'evaluation-form';
export type TabType = 'My Submission' | 'Review Advert' | 'Evaluation' | 'Review Scorecard';
export type AdvertLang = 'EN' | 'FR';
export type SelectionDecision = 'YES' | 'NO' | 'HOLD' | null;
