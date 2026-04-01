import { useState, useEffect } from "react";
import { Question } from "../QuestionCreation.types";
import { getQuestionById } from "../../../../models/Icareerportal";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { RoleID, StatusId } from "../../../../utilities/Config";
import { QuestionCreatedBy } from "../../../../utilities/ConditionConfig";
import { QuestionService } from "../../../../services/ServiceExport";

export interface UseFetchQuestionBankResult {
  questionBank: Question[];
  loading: boolean;
  error: string | null;
}

export const useFetchQuestionBank = (discipline: string, statusId: number, enable: boolean = true): UseFetchQuestionBankResult => {
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { roleIDs } = userInfo();

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
            textFr: opt.textFr ?? "",
            isCorrect: opt.isCorrect ?? false,
          }));
          console.log(item.Type, "Typeee");

          return {
            id: item.id,
            type: "single",
            questionEn: item.question,
            questionFr: item.questionFr ?? "",
            answerEn: item.expectedAnswer ?? "",
            answerFr: item.expectedAnswerFr ?? "",
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

  return { questionBank, loading, error, };
};