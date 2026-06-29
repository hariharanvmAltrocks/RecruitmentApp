// ─── Shared Option ────────────────────────────────────────────────────────────
export interface QuestionOption {
  id: string;
  textEn: string;
  textFr: string;
  isCorrect: boolean;
}

// ─── Core Question ────────────────────────────────────────────────────────────
export interface Question {
  id: string | number;
  type: "single" | "multiple" | "interview";
  questionEn: string;
  questionFr: string;
  options: QuestionOption[];
  fromBank: boolean;
  answerEn?: string;
  answerFr?: string;
  interviewQu?: string;
  interviewFr?: string;
}

// ─── Job info ─────────────────────────────────────────────────────────────────
export interface Job {
  jobCode?: string;
  jobTitle?: string;
  buCode?: string;
  nationality?: string;
}

// ─── Mode discriminator ───────────────────────────────────────────────────────
export type QuestionMode = "careerPortal" | "interview";

// ─── Save hook payload ────────────────────────────────────────────────────────
export interface SaveQuestionsPayload {
  positionId: string | number;
  mode: QuestionMode;
  JobCodeId: number | undefined;
  DptCode: string | undefined;
  questions: Question[];
}