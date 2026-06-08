import { useEffect, useState } from "react";
import {
  RecruitmentServices,
} from "../../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../../utilities/ApiConfig";
import { CommentsData } from "../../../../../services/RecruitmentTable/IRecruitmentService";


export const useCommentsDetails = (RecId: number | null) => {
  const [data, setData] = useState<CommentsData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!RecId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const condition = "and";
      let response: any;
      const IDFilter = [
        { 
             FilterKey: "RecruitmentID",
      Operator: "eq",
      FilterValue: RecId,
        },
      ];
      response = await RecruitmentServices.GetCommentsData(
          IDFilter,
        );

      if (response.status === ResponeStatus.SUCCESS) {
        const data = response.data;
        setData(data);
        setLoading(false);
        return;
      }
    }, 650);

    return () => clearTimeout(timer);
  }, [RecId]);

  return { data, loading };
};
