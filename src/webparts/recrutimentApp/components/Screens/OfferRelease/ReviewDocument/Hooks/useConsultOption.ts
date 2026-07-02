import { useEffect, useMemo, useState } from "react";
import {
  DashboardServices,
  masterService,
  OfferServices,
  RecruitmentServices,
} from "../../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../../utilities/ApiConfig";
import { useUIState } from "../../../../RecrutimentApp/UIStateContext";
import { IselectedPosition } from "../PositionFrame";

export type IConsultOption = {
    value: string;
    label: string
}

export const useConsultOption = () => {
  const [data, setData] = useState<IConsultOption[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      let response: any;
      response = await masterService.GetConsultingOptions();
      if (response.status === ResponeStatus.SUCCESS) {
        const data = response.data;
        setData(data);
        setLoading(false);
        return;
      }
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
};
