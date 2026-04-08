import { useEffect, useMemo, useState } from "react";
import { CandidateTable } from "../../../../services/ServiceExport";
import { CandidateProfile } from "../../../../models/Icareerportal";
import { MatricID } from "../../../../utilities/ConditionConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";

interface CandidateDetailsState {
  data: CandidateProfile | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, any>();

export const useFetchCandidateDetails = (
  candidateId: string,
  recruitmentID: number,
  enabled = true,
): CandidateDetailsState => {
  const [state, setState] = useState<CandidateDetailsState>({
    data: null,
    loading: false,
    error: null,
  });

  const { MatricID: matricId } = useUIState();

  useEffect(() => {
    if (!candidateId || !enabled) return;

    let isMounted = true;
    setState({ data: null, loading: true, error: null });

    const timer = setTimeout(async () => {
      if (!isMounted) {
        return;
      }

      let response;
      if (matricId === MatricID.AssignInterviewPanel) {
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
  }, [candidateId, enabled]);

  return state;
};
