// Hooks/useReviewConditions.ts

import { useMemo } from "react";
import {
  buildStatusFlags,
  buildVisibilityFlags,
  ReviewStatusFlags,
  ReviewVisibilityFlags,
} from "./Reviewdocumentconditions";

interface UseReviewConditionsParams {
  statusID: number | undefined;
  empCat: string | undefined;
  consentVerification: string | null;
  hasDetails: boolean;
  rejectFlag: boolean;
}

interface UseReviewConditionsReturn {
  is: ReviewStatusFlags;
  vis: ReviewVisibilityFlags;
}

export const useReviewConditions = ({
  statusID,
  empCat,
  consentVerification,
  hasDetails,
  rejectFlag,
}: UseReviewConditionsParams): UseReviewConditionsReturn => {
  const is = useMemo(
    () => buildStatusFlags(statusID, empCat, consentVerification),
    [statusID, empCat, consentVerification],
  );

  const vis = useMemo(
    () => buildVisibilityFlags(is, hasDetails, rejectFlag),
    [is, hasDetails, rejectFlag],
  );

  return { is, vis };
};
