import { useState, useCallback, useEffect } from "react";
import { getRecruitmentFiltersByTab, getBaseFilters } from "../CommanFilter";
import * as moment from "moment";
import { ResponeStatus, RoleID, TabName } from "../../../utilities/Config";
import { getVRRDetails } from "../../../Services/ServiceExport";

export const useRecruitmentData = (props: any) => {
  const { CurrentUserEmailId, EmployeeList, CurrentRoleID, TabDetails } = props;
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobCodeTitles, setJobCodeTitles] = useState<any[]>([]);
  const currentTab = TabDetails?.TabName;

  const fetchData = useCallback(
    async (tab: string) => {
      if (!tab) return;
      setIsLoading(true);
      try {
        let response;
        if (tab === TabName.Evaluation) {
          response = await getVRRDetails.GetcountInEvalution(
            CurrentUserEmailId,
            EmployeeList,
          );
          if (response.status === ResponeStatus.SUCCESS) {
            setData(response.data);
          }
        } else if (
          CurrentRoleID.includes(RoleID.RecruitmentHRLead) &&
          tab === TabName.AssignRecuritmentHR
        ) {
          response = await getVRRDetails.GetJobTitleInNPEP(
            getBaseFilters(),
            "and",
            props,
          );
          if (response.status === ResponeStatus.SUCCESS) {
            setData(response.data);
          }
        } else {
          const { filters, jobAppliedFilter } = getRecruitmentFiltersByTab(
            props,
            tab,
          );
          response = await getVRRDetails.GetRecruitmentDetails(
            filters,
            "and",
            jobAppliedFilter,
          );

          if (response.status === ResponeStatus.SUCCESS) {
            let filteredData = response.data;
            if (tab === TabName.UploadCV) {
              const today = moment().format("YYYY-MM-DD");
              filteredData = filteredData.filter((item: any) => {
                const endDate =
                  item.JobPostingSecondExtensionEndDate ||
                  item.JobPostingFirstExtensionEndDate ||
                  item.JobPostingEndDate;
                return endDate && moment(endDate).format("YYYY-MM-DD") >= today;
              });
            }
            setData(filteredData);
            const jobCodes = Array.from(
              new Map(
                filteredData.map((i: any) => [
                  i.ID,
                  {
                    ID: i.ID,
                    JobCode: i.JobCode,
                    JobTitle: i.JobTitleEnglish,
                    Nationality: i.Nationality,
                    JobCodeId: i.JobCodeId,
                  },
                ]),
              ).values(),
            );
            setJobCodeTitles(Array.from(jobCodes));
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [CurrentUserEmailId, EmployeeList, CurrentRoleID, props],
  );

  useEffect(() => {
    void fetchData(currentTab);
  }, [currentTab, fetchData]);

  const refreshData = () => {
    void fetchData(currentTab);
  };

  return { data, isLoading, jobCodeTitles, refreshData, setData };
};
