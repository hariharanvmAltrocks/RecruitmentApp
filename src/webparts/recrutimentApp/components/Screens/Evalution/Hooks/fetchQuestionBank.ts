import * as React from "react";
import type { InterviewQuestion } from "../State/CommonStateManagement";
import QuestionnaireApi from "../../SelectionProcess/services/QuestionnaireApi/QuestionnaireApi";

export interface IQuestionBankService {
  getQuestions: (jobCode: string) => Promise<InterviewQuestion[]>;
}

const questionnaireApi = new QuestionnaireApi();

const defaultService: IQuestionBankService = {
  getQuestions: async (jobCode: string) => {
    console.log("[fetchQuestionBank] getQuestions start", jobCode);
    const response = await questionnaireApi.getQuestionnaire(jobCode);

    if (!response.data || response.data.length === 0) {
      console.log("[fetchQuestionBank] getQuestions empty");
      return [];
    }

    return response.data.map((item) => ({
      id: item.id,
      text: item.question,
      expectedResponse: item.answer || "",
    }));
  },
};

export function useQuestionBank(
  jobCode: string,
  service: IQuestionBankService = defaultService,
) {
  console.log("[useQuestionBank] jobCode", jobCode);
  const [data, setData] = React.useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    if (!jobCode) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getQuestions(jobCode);
        if (isMounted) setData(result);
      } catch (err) {
        console.error("[useQuestionBank] getQuestions error", err);
        if (isMounted)
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load interview questions.",
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [jobCode, service, refreshKey]);

  const reload = React.useCallback(() => setRefreshKey((k) => k + 1), []);

  return { data, loading, error, reload };
}
