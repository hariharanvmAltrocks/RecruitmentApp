import * as React from 'react';
import type { Answer, ScoreSummary } from '../State/CommonStateManagement';

export interface ScoreCardData {
  answers: Record<string, Answer>;
  summary?: ScoreSummary;
}

export interface IScoreCardService {
  getScoreCard: (candidateId?: string) => Promise<ScoreCardData>;
}

const mockScoreCard: ScoreCardData = {
  answers: {
    'q-1': { questionId: 'q-1', rating: 4, remarks: 'Clear understanding of statements.' },
    'q-2': { questionId: 'q-2', rating: 3, remarks: 'Covered liquidity and leverage.' }
  }
};

const defaultService: IScoreCardService = {
  getScoreCard: async () => {
    await wait(300);
    return mockScoreCard;
  }
};

export function useScoreCard(candidateId?: string, service: IScoreCardService = defaultService) {
  const [data, setData] = React.useState<ScoreCardData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState<number>(0);

  React.useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getScoreCard(candidateId);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load scorecard.');
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
  }, [candidateId, service, refreshKey]);

  const reload = React.useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return { data, loading, error, reload };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
