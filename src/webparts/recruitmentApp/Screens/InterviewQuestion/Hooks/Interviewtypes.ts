// ─────────────────────────────────────────────
// types/interviewTypes.ts
// ─────────────────────────────────────────────

export interface AutoCompleteItem {
  key: number;
  text: string;
}

export interface OptionRow {
  key: number;
  text: string;
  textFr?: string;
  isCorrect?: boolean;
  textvalidation?: boolean;
  textvalidationFr?: boolean;
  fieldValidation?: boolean;
  fieldValidationFr?: boolean;
}

export interface ViewQuestion {
  id: number;
  discipline: AutoCompleteItem | string;
  questionType: AutoCompleteItem | string;
  question: string;
  questionFr?: string;
  expectedAnswer: string;
  expectedAnswerFr?: string;
  CareerportalAnswer: OptionRow[];
  options?: OptionRow[];
  Disqualification: string;
  Type?: string;
  Checked?: boolean;
  HeaderLabel?: string;
  header?: string;
  scope?: string;
  questionNumber?: { key: number; text: string };
}

export interface InterviewQuesState {
  Disciplines: AutoCompleteItem;
  QuestionNumber: AutoCompleteItem;
  QuestionType: AutoCompleteItem;
  Question: string;
  ExpectedAnswer: string;
  Catogry: string;
  Disqualification: string;
  CareerportalAnswer: OptionRow[];
  ExpectedAnswerFr?: string;
}

export interface InterviewQuesValidationError {
  QuestionType: boolean;
  QuestionNumber: boolean;
  Disciplines: boolean;
  Question: boolean;
  ExpectedAnswer: boolean;
  OptionsType: string | boolean;
  Catogry: boolean;
  Disqualification: boolean;
  ExpectedAnswerFr: boolean;
}

export interface MasterOption {
  category: AutoCompleteItem[];
  categoryOption: string[];
  ScopeOption: AutoCompleteItem[];
  QueType: AutoCompleteItem[];
}

export interface AlertPropsData {
  Message: string;
  Type: string;
  ButtonAction: ((clicked: boolean) => Promise<void>) | null;
  visible: boolean;
  ButtonLebel?: string;
}

export interface UpsertQuestionsPayload {
  questionEn: string;
  questionFr: string;
  scopeId: string;
  categoryId: string;
  questionTypeId: string;
  isQualifier: number;
  isAnswerValidate: number;
  sequence: number;
  jobCode: string;
  options: { optionEn: string; optionFr: string; sequence: number }[];
  answers: { optionEn: string; optionFr: string }[];
  createdBy: string;
}

export interface GetQuestionByIdPayload {
  discipline: string;
  category: string;
  createdBy: string;
}