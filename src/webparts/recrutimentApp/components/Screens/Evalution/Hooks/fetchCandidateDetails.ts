import * as React from 'react';
import type { Candidate } from '../State/CommonStateManagement';

export interface ICandidateService {
  getCandidateDetails: (candidateId?: string) => Promise<Candidate>;
}

const mockCandidate: Candidate = {
  id: 'cand-001',
  applicantName: 'Aissatou Diallo',
  jobTitle: 'Senior Financial Analyst',
  grade: 'G7',
  nationality: 'Malian',
  interviewDate: '2026-03-20'
};

const defaultService: ICandidateService = {
  getCandidateDetails: async () => {
    await wait(300);
    return mockCandidate;
  }
};

export function useCandidateDetails(candidateId?: string, service: ICandidateService = defaultService) {
  const [data, setData] = React.useState<Candidate | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState<number>(0);

  React.useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getCandidateDetails(candidateId);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load candidate details.');
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
