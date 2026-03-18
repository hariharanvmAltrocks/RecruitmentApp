import { useState, useEffect } from "react";
import { Question } from "../QuestionCreation.types";

const MOCK_QUESTION_BANK: Question[] = [
  {
    id: "b1",
    type: "single",
    questionEn: "Do you have a valid blasting certificate?",
    questionFr: "Avez-vous un certificat de minage valide ?",
    options: [
      { id: "o1", textEn: "Yes", textFr: "Oui", isCorrect: true },
      { id: "o2", textEn: "No", textFr: "Non", isCorrect: false },
    ],
  },
  {
    id: "b2",
    type: "multiple",
    questionEn: "Which of the following mining software are you proficient in?",
    questionFr: "Parmi les logiciels miniers suivants, lesquels maîtrisez-vous ?",
    options: [
      { id: "o3", textEn: "Deswik", textFr: "Deswik", isCorrect: true },
      { id: "o4", textEn: "Surpac", textFr: "Surpac", isCorrect: true },
      { id: "o5", textEn: "AutoCAD", textFr: "AutoCAD", isCorrect: false },
      { id: "o6", textEn: "Vulcan", textFr: "Vulcan", isCorrect: true },
    ],
  },
  {
    id: "b3",
    type: "single",
    questionEn: "Are you willing to work on a rotational shift basis?",
    questionFr: "Êtes-vous prêt à travailler par roulement ?",
    options: [
      { id: "o7", textEn: "Yes", textFr: "Oui", isCorrect: true },
      { id: "o8", textEn: "No", textFr: "Non", isCorrect: false },
    ],
  },
  {
    id: "b4",
    type: "single",
    questionEn: "Do you hold a valid driver's license for heavy equipment?",
    questionFr: "Possédez-vous un permis de conduire valide pour engins lourds ?",
    options: [
      { id: "o9", textEn: "Yes", textFr: "Oui", isCorrect: true },
      { id: "o10", textEn: "No", textFr: "Non", isCorrect: false },
    ],
  },
  {
    id: "b5",
    type: "multiple",
    questionEn: "Which safety certifications do you currently hold?",
    questionFr: "Quelles certifications de sécurité possédez-vous actuellement ?",
    options: [
      { id: "o11", textEn: "IOSH", textFr: "IOSH", isCorrect: true },
      { id: "o12", textEn: "NEBOSH", textFr: "NEBOSH", isCorrect: true },
      { id: "o13", textEn: "First Aid", textFr: "Premiers secours", isCorrect: false },
      { id: "o14", textEn: "Fire Safety", textFr: "Sécurité incendie", isCorrect: false },
    ],
  },
];

export interface UseFetchQuestionBankResult {
  questionBank: Question[];
  loading: boolean;
  error: string | null;
}

export const useFetchQuestionBank = (): UseFetchQuestionBankResult => {
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        setQuestionBank(MOCK_QUESTION_BANK);
        setLoading(false);
      } catch {
        setError("Failed to load question bank.");
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { questionBank, loading, error };
};