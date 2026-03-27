import { useEffect, useMemo, useState } from "react";
import { CandidateTable } from "../../../../services/ServiceExport";
import { CandidateProfile } from "../../../../models/Icareerportal";
import { FetchInterviewPanelOptions, panelMember } from "../../../../services/CandidateTable/ICandidateService";

export interface PanelMember {
     value: string;
     label: string;
     Email: string;
}


interface PanelMemberState {
  data: panelMember | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, any>();

export const useFetchPanelMembers = (bucodeId: number,assignHREmail: string,candidateID: number,statusID: string, enabled = true): PanelMemberState => {
  const [state, setState] = useState<PanelMemberState>({
    data: null,
    loading: false,
    error: null
  });


  useEffect(() => {
  if (!bucodeId || !candidateID || !enabled) return;

    let isMounted = true;
    setState({ data: null, loading: true, error: null });

    const timer = setTimeout(async () => {
      if (!isMounted) {
        return;
      }
      let obj :FetchInterviewPanelOptions = {
         BUCodeID: bucodeId,
  assignHREmail: assignHREmail,
  candidateID: candidateID,
  statusID: statusID
      }
      let response = await CandidateTable.fetchInterviewPanelDetails(obj)

      const value = response.data ?? null

      setState({ data: value, loading: false, error: null });
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [bucodeId,candidateID, enabled]);

  return state;
};
