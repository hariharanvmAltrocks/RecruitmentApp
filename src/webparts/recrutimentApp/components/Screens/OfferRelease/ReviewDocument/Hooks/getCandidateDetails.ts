import { useEffect, useMemo, useState } from "react";
import {
  DashboardServices,
  OfferServices,
  RecruitmentServices,
} from "../../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../../utilities/ApiConfig";
import { useUIState } from "../../../../RecrutimentApp/UIStateContext";
import { MetricQueryConfig } from "../../../Dashboard/metricColumns.config";
import { ListNames } from "../../../../../utilities/Config";
import { DataSyncToRecruitmentResponse } from "../../../../../services/RecruitmentTable/IRecruitmentService";
import { IselectedPosition } from "../PositionFrame";

export const useCandidatDetails = (
  jobId: number | null,
  candidateID: number,
  selectedCandidateID: number,
  JobRequestID: string,
  IsExpat: boolean,
) => {
  const [data, setData] = useState<IselectedPosition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { MatricID } = useUIState();

  useEffect(() => {
    if (!jobId || !candidateID || !selectedCandidateID || !JobRequestID) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const condition = "and";
      let response: any;
      response = await OfferServices.GetSelectedCandidate(
        jobId,
        candidateID,
        selectedCandidateID,
        JobRequestID,
        IsExpat,
      );
      if (response.status === ResponeStatus.SUCCESS) {
        const data = response.data;
        setData(data);
        setLoading(false);
        return;
      }
    }, 650);

    return () => clearTimeout(timer);
  }, [jobId, MatricID]);

  return { data, loading };
};
