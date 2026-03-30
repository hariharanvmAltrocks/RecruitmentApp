import * as React from 'react';
import type { Answer } from '../State/CommonStateManagement';

export interface ScoreCardData {
  answers: Record<number, Answer>;
}

export interface IScoreCardService {
  getScoreCard: (candidateId: number) => Promise<ScoreCardData>;
}

// Default service — scorecard is a fresh submission each time (no pre-fill from API).
// If you need to pre-populate from a saved draft, replace this implementation.
const defaultService: IScoreCardService = {
  getScoreCard: async (_candidateId: number): Promise<ScoreCardData> => {
    return { answers: {} };
  },
};

export function useScoreCard(
  candidateId: number,
  service: IScoreCardService = defaultService
) {
  const [data,       setData]       = React.useState<ScoreCardData | null>(null);
  const [loading,    setLoading]    = React.useState<boolean>(true);
  const [error,      setError]      = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    if (!candidateId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getScoreCard(candidateId);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted)
          setError(err instanceof Error ? err.message : 'Unable to load scorecard.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [candidateId, service, refreshKey]);

  const reload = React.useCallback(() => setRefreshKey((k) => k + 1), []);

  return { data, loading, error, reload };
}