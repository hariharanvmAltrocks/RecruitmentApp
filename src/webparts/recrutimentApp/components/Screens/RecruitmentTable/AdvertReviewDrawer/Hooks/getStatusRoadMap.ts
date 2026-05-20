import { useEffect, useMemo, useState } from "react";
import {
  DashboardServices,
  RecruitmentServices,
} from "../../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../../utilities/ApiConfig";
import { useUIState } from "../../../../RecrutimentApp/UIStateContext";
import { MetricQueryConfig } from "../../../Dashboard/metricColumns.config";
import { ListNames } from "../../../../../utilities/Config";
import {
  DataSyncToRecruitmentResponse,
  RoadMapStatus,
} from "../../../../../services/RecruitmentTable/IRecruitmentService";

export interface PositionDetails {
  jobId: number;
  jobTitle: string;
  jobCode: string;
  department: string;
  buCode: string;
  buName: string;
  subDepartment: string;
  section: string;
  deptCode: string;
  reportsTo?: string;
  areaOfWork: string;
  nationality: string;
  patersonGrade: string;
  drcGrade: string;
  employmentCategory: string;
  contractType: string;
  numberOfPersons: number;
  dateRequired: string;
  JobCodeID: number;
}

export const getStatusRoadMap = (RecID: number) => {
  const [data, setData] = useState<RoadMapStatus[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!RecID) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const condition = "and";
      let response: any;
      const IDFilter = [
        { FilterKey: "RecruitmentIDId", Operator: "in", FilterValue: RecID },
      ];
      response = await RecruitmentServices.GetRoadMapStatusDetails(
        IDFilter,
        condition,
      );

      if (response.status === ResponeStatus.SUCCESS) {
        const data = response.data;
        setData(data);
        setLoading(false);
        return;
      }
    }, 650);

    return () => clearTimeout(timer);
  }, [RecID]);

  return { data, loading };
};
