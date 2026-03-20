import { useEffect, useMemo, useState } from "react";
import { DashboardServices, RecruitmentServices } from "../../../../../services/ServiceExport";
import { ResponeStatus } from "../../../../../utilities/ApiConfig";
import { useUIState } from "../../../../RecrutimentApp/UIStateContext";
import { MetricQueryConfig } from "../../../Dashboard/metricColumns.config";
import { ListNames } from "../../../../../utilities/Config";
import { DataSyncToRecruitmentResponse } from "../../../../../services/RecruitmentTable/IRecruitmentService";

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

export const usePositionDetails = (jobId: number | null,type: string) => {
  const [data, setData] = useState<DataSyncToRecruitmentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {MatricID} = useUIState();

  useEffect(() => {
    if (!jobId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {

         const Filter = MetricQueryConfig[MatricID];
              const condition = "and";
                        let response: any;
                       const IDFilter = [
       { FilterKey: "ID", Operator: "in", FilterValue: jobId },
       ] 
              if(MatricID != 0){
                           
      
       const filterObj = Array.isArray(Filter) ? Filter[0] : Filter;
      
                        switch (filterObj.ListName) {
                            case ListNames.HRMSNewPositionRequest:
                                response = await RecruitmentServices.GetNPAEPVRRDetails(IDFilter, condition,type);
                                break;
                            case ListNames.HRMSRecruitmentDptDetails:
                                response = await RecruitmentServices.GetRecruitmentDetails(IDFilter, condition);
                                break;
                        }
              }else {
                response = await RecruitmentServices.GetRecruitmentDetails(IDFilter, condition);
              }
      if(response.status === ResponeStatus.SUCCESS){
        const data = response.data[0];
        setData(data);
        setLoading(false);
        return;
      }
    }, 650);

    return () => clearTimeout(timer);
  }, [jobId, MatricID, type]);

  return { data, loading };
};
