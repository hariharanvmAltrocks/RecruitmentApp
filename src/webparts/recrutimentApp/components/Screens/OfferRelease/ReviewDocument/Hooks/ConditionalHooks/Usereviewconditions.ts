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
  revertFlag: boolean;
  isExpat: boolean;
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
  revertFlag,
  isExpat,
}: UseReviewConditionsParams): UseReviewConditionsReturn => {
  const is = useMemo(
    () => buildStatusFlags(statusID, empCat, consentVerification, isExpat),
    [statusID, empCat, consentVerification, isExpat],
  );

  const vis = useMemo(
    () => buildVisibilityFlags(is, hasDetails, rejectFlag, revertFlag),
    [is, hasDetails, rejectFlag, revertFlag],
  );

  return { is, vis };
};
