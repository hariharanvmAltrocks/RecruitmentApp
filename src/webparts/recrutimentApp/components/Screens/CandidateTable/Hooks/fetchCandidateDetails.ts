import { useEffect, useMemo, useState } from "react";
import { CandidateTable } from "../../../../services/ServiceExport";
import { CandidateProfile } from "../../../../models/Icareerportal";
import { MatricID } from "../../../../utilities/ConditionConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { StatusId } from "../../../../utilities/Config";

interface CandidateDetailsState {
  data: CandidateProfile | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, any>();

export const useFetchCandidateDetails = (
  candidateId: string,
  StatusID: string,
): CandidateDetailsState => {
  const [state, setState] = useState<CandidateDetailsState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!candidateId) return;

    let isMounted = true;
    setState({ data: null, loading: true, error: null });

    const timer = setTimeout(async () => {
      if (!isMounted) {
        return;
      }

      let response;
      if (
        Number(StatusID) ===
        StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
      ) {
        response = await CandidateTable.getCandidateDetailsL2(
          Number(candidateId),
        );
        const value =
          response.data && response.data?.length > 0 ? response.data[0] : null;
        setState({ data: value, loading: false, error: null });
      } else {
        response = await CandidateTable.fetchCandidateDetails(candidateId);
        const value =
          response.data && response.data?.length > 0 ? response.data[0] : null;

        setState({ data: value, loading: false, error: null });
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [candidateId]);

  return state;
};
