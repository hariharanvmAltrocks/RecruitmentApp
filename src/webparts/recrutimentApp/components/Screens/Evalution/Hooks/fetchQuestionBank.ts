import * as React from 'react';
import type { InterviewQuestion } from '../State/CommonStateManagement';

export interface IQuestionBankService {
  getQuestions: () => Promise<InterviewQuestion[]>;
}

const mockQuestions: InterviewQuestion[] = [
  {
    id: 'q-1',
    text: 'What are the three main financial statements, and how are they connected?'
  },
  {
    id: 'q-2',
    text: "How would you evaluate a company's financial health using financial ratios?"
  },
  {
    id: 'q-3',
    text: 'Tell us about a time you had to communicate complex data to a non-technical team.'
  }
];

const defaultService: IQuestionBankService = {
  getQuestions: async () => {
    await wait(300);
    return mockQuestions;
  }
};

export function useQuestionBank(service: IQuestionBankService = defaultService) {
  const [data, setData] = React.useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState<number>(0);

  React.useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getQuestions();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load interview questions.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [service, refreshKey]);

  const reload = React.useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return { data, loading, error, reload };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
