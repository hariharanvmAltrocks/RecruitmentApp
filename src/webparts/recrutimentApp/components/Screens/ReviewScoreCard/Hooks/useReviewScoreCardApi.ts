import { useCallback } from 'react';
import ReviewScoreCardServices, {
  SubmitScorecardParams,
  ReviewScoreCardResult
} from '../ReviewScoreCardServies/ReviewScoreCardServices';

export function useReviewScoreCardApi() {
  // Fetch all review scorecard data for a candidate
  const fetchReviewScoreCardData = useCallback(
    async (candidateId: number, currentUserEmail: string): Promise<ReviewScoreCardResult> => {
      return await ReviewScoreCardServices.getReviewScoreCardData(candidateId, currentUserEmail);
    },
    []
  );

  // Submit a scorecard (Level 1 or Level 2, same as evaluation)
  const submitScorecard = useCallback(
    async (params: SubmitScorecardParams) => {
      return await ReviewScoreCardServices.submitScorecard(params);
    },
    []
  );

  // Fetch Level 2 scorecard only
  const fetchLevel2Scorecard = useCallback(
    async (candidateId: number) => {
      return await ReviewScoreCardServices.getLevel2Scorecard(candidateId);
    },
    []
  );

  // Fetch HOD decision only
  const fetchHODDecision = useCallback(
    async (candidateId: number) => {
      return await ReviewScoreCardServices.getHODDecision(candidateId);
    },
    []
  );

  return {
    fetchReviewScoreCardData,
    submitScorecard,
    fetchLevel2Scorecard,
    fetchHODDecision
  };
}
