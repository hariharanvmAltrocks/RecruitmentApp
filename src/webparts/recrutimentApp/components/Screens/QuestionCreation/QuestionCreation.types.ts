// QuestionCreation.types.ts

export type QuestionType = "single" | "multiple";

export interface Option {
  id: string;
  textEn: string;
  textFr: string;
  isCorrect: boolean;
}

export interface Question {
  id: number | string;
  type: QuestionType;
  questionEn: string;
  questionFr: string;
  options: Option[];
  fromBank?: boolean;
  interviewQu?: string;
  interviewFr?: string;
}

export interface Job {
  jobCode: string;
  jobTitle: string;
  buCode?: string;
  nationality?: string;
}