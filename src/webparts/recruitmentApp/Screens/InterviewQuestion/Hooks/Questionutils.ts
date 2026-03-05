import { OptionRow, ViewQuestion } from "./Interviewtypes";



export const stripHtml = (html: string | undefined): string => {
  if (!html) return "";
  try {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "")
      .replace(/\u00A0|&nbsp;/g, " ")
      .trim();
  } catch {
    return (html || "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }
};

export const encodeBase64 = (str: string): string => {
  const utf8Bytes: any = new TextEncoder().encode(str);
  const binary = String.fromCharCode(...utf8Bytes);
  return btoa(binary);
};

export const normalizeQuestion = (html: string): string =>
  stripHtml(html).toLowerCase().replace(/\s+/g, " ").trim();

export const createEmptyOption = (key: number): OptionRow => ({
  key,
  text: "",
  textFr: "",
  isCorrect: false,
  textvalidation: false,
  textvalidationFr: false,
  fieldValidation: false,
  fieldValidationFr: false,
});

export const reindexQuestions = (questions: ViewQuestion[]): ViewQuestion[] =>
  questions.map((item, idx) => ({
    ...item,
    id: idx,
    header: `Q${idx + 1}`,
    HeaderLabel: `Question ${idx + 1}`,
  }));