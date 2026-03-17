import { useEffect, useMemo, useState } from "react";
import { RecruitmentItem, RecruitmentTabKey } from "../RecruitmentTable.types";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ListNames } from "../../../../utilities/Config";
import { MetricQueryConfig } from "../../Dashboard/metricColumns.config";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";

interface UseRecruitmentDetailsResult {
  items: RecruitmentItem[];
  loading: boolean;
  error?: string;
}

// const mockRecruitmentItems: RecruitmentItem[] = [
//   {
//     id: "vac-1",
//     jobCode: "MIN-100",
//     title: "Senior Mining Engineer - Mining",
//     department: "Mining",
//     count: 1,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-2",
//     jobCode: "ENG-101",
//     title: "Underground Shift Supervisor - Engineering",
//     department: "Engineering",
//     count: 2,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-3",
//     jobCode: "SHE-102",
//     title: "Geotechnical Technician - SHEQ",
//     department: "SHEQ",
//     count: 3,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-4",
//     jobCode: "PRO-103",
//     title: "Mechanical Foreman - Processing",
//     department: "Processing",
//     count: 4,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-5",
//     jobCode: "HUM-104",
//     title: "Safety Officer - Human Resources",
//     department: "Human Resources",
//     count: 5,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-6",
//     jobCode: "SUP-105",
//     title: "Plant Electrician - Supply Chain",
//     department: "Supply Chain",
//     count: 1,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-7",
//     jobCode: "ICT-106",
//     title: "HR Coordinator - ICT",
//     department: "ICT",
//     count: 2,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
// ];

export const useRecruitmentDetails = (activeTabKey: RecruitmentTabKey): UseRecruitmentDetailsResult => {
  const [items, setItems] = useState<RecruitmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { MatricID } = useUIState();

  
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      if (!isMounted) {
        return;
      }
        const Filter = MetricQueryConfig[MatricID];
        const condition = "and";
                  let response: any;
                 
        if(MatricID != 0){
const filterObj = Array.isArray(Filter) ? Filter[0] : Filter;

                  switch (filterObj.ListName) {
                      case ListNames.HRMSNewPositionRequest:
                          response = await DashboardServices.GetNPAEPVRRDetails(filterObj.Filter, condition);
                          break;
                      case ListNames.HRMSRecruitmentDptDetails:
                          response = await DashboardServices.GetRecruitmentDetails(filterObj.Filter[0], condition);
                          break;
                      case ListNames.HRMSRecruitmentCandidatePersonalDetails:
                          response = await DashboardServices.GetCandidateDetails(filterObj.Filter[0], condition);
                          break;
                      case ListNames.HRMSSelectedCandidateDetailsByHOD:
                          response = await DashboardServices.GetSelectedCandidate(filterObj.Filter[0], condition);
                          break;
                  }
        }else {
          response = await DashboardServices.GetRecruitmentDetails([], condition);
        }
                  const mappedItems: RecruitmentItem[] = response?.data?.map((item: any) => ({
                    id: item.RecordID,
                    ItemID: item.ID,
                    jobCode: item.JobCode,
                    title: item.JobTitleEnglish ?? "",
                    department: item.Department,
                    count: item.NumberOfPersonNeeded,
                    requestType: item.Type,
                    nationality: item.Nationality,
                    status: item.Status,
                  })) ?? [];

      setItems(mappedItems);
      setLoading(false);
    }, 1100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [MatricID]);

  const memoizedItems = useMemo(() => items, [items]);

  return {
    items: memoizedItems,
    loading,
  };
};

export type { UseRecruitmentDetailsResult };
