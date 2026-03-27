import { useState, useEffect } from "react";
import { Question } from "../QuestionCreation.types";
import { getQuestionById } from "../../../../models/Icareerportal";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { RoleID, StatusId } from "../../../../utilities/Config";
import { QuestionCreatedBy } from "../../../../utilities/ConditionConfig";
import { QuestionService } from "../../../../services/ServiceExport";

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
    fromBank: false
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
    fromBank: false
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
    fromBank: false
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
    fromBank: false
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
    fromBank: false
  },
];

export interface UseFetchQuestionBankResult {
  questionBank: Question[];
  loading: boolean;
  error: string | null;
}

export const useFetchQuestionBank = (discipline: string, statusId: number, enable: boolean = true): UseFetchQuestionBankResult => {
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {roleIDs} = userInfo();

  useEffect(() => {
  const timer = setTimeout(async () => {
    if (!enable || !discipline || !statusId) return;

    const categoryId = statusId === StatusId.CareerPortalQuestions ? "C1" : "C2";
    const obj: getQuestionById = {
      discipline: String(discipline),
      category: String(categoryId),
      createdBy: roleIDs.includes(RoleID.LineManager)
        ? QuestionCreatedBy.LM
        : QuestionCreatedBy.HR,
    };

    try {
      const res = await QuestionService.GetQuestionaireByScope(obj);

      const questionbank: Question[] = (res.data ?? []).map((item) => {
        const options = (item.options ?? []).map((opt) => ({
          id: String(opt.key),
          textEn: opt.text,
          textFr: opt.textFr ?? "" ,
          isCorrect: opt.isCorrect ?? false,
        }));
        console.log(item.Type,"Typeee");
        
        return {
          id: item.id,
          type: "single" ,
          questionEn: item.question,
          questionFr: item.questionFr ?? "",
          options,
          answers: options.filter((opt) => opt.isCorrect),
          scopeId: item.scope ?? "",
          questionTypeId: item.questionType ?? "",
          isQualifier: item.Disqualification ?? false,
          createdBy: item.createdBy ?? "",
          fromBank: true,
        };
      });

      setQuestionBank(questionbank);
    } catch {
      setError("Failed to load question bank.");
    } finally {
      setLoading(false);
    }
  }, 800);

  return () => clearTimeout(timer);
}, [enable]);

  return { questionBank, loading, error ,};
};