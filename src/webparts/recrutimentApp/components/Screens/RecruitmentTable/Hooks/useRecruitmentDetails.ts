import { useEffect, useState } from "react";
import { EvalutionItem, RecruitmentItem, RecruitmentTabKey } from "../RecruitmentTable.types";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ListNames } from "../../../../utilities/Config";
import { MetricQueryConfig } from "../../Dashboard/metricColumns.config";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { MatricID } from "../../../../utilities/ConditionConfig";

interface UseRecruitmentDetailsResult {
  items: RecruitmentItem[];
  loading: boolean;
  error?: string;
}


const mapEvaluationItem = (item: any): EvalutionItem => ({
  id: item.RecordID,
  ItemID: item.ID,
  applicantName: item.ApplicantName,
  title: item.PositionTitle,
  nationlity: item.Nationality,
  interviewDate: item.InterviewDate,
  interviewLevels: item.interviewLevels,
  grade: item.JobGrade,
  status: item.Status,
  statusId: item.StatusId,
  jobCodeID: item.JobCodeId,
});

const mapCandidateItem = (item: any): RecruitmentItem => {
  const dept = item.DeptDetails?.[0];
  return {
    id: dept?.RecordID,
    ItemID: dept?.ID,
    jobCode: dept?.JobCode,
    title: dept?.JobTitleEnglish ?? "",
    department: dept?.Department,
    count: dept?.NumberOfPersonNeeded,
    requestType: dept?.Type,
    nationality: dept?.Nationality,
    status: dept?.Status,
    statusId: dept?.StatusId,
    jobCodeID: dept?.JobCodeId,
  };
};

const mapRecruitmentItem = (item: any): RecruitmentItem => ({
  id: item?.RecordID,
  ItemID: item?.ID,
  jobCode: item?.JobCode,
  title: item?.JobTitleEnglish ?? "",
  department: item?.Department,
  count: item?.NumberOfPersonNeeded,
  requestType: item?.Type,
  nationality: item?.Nationality,
  status: item?.Status,
  statusId: item?.StatusId,
  jobCodeID: item?.JobCodeId,
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useRecruitmentDetails = (
  activeTabKey: RecruitmentTabKey,
  refreshKey: number = 0
): UseRecruitmentDetailsResult => {
  const [items, setItems] = useState<RecruitmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { MatricID: matricID } = useUIState();


  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const Filter = MetricQueryConfig[matricID];
        const filterObj = Array.isArray(Filter) ? Filter[0] : Filter;
        const condition = "and";

        let response: any;

        if (matricID !== 0) {
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
        } else {
          response = await DashboardServices.GetRecruitmentDetails([], condition);
        }

        if (cancelled) return;

        const isEvaluation =
          matricID === MatricID.EvalutionHR ||
          matricID === MatricID.EvalutionHOD ||
          matricID === MatricID.EvalutionLM;

        const mappedItems: RecruitmentItem[] = (response?.data ?? []).map(
          isEvaluation
            ? mapEvaluationItem
            : filterObj.ListName === ListNames.HRMSRecruitmentCandidatePersonalDetails
              ? mapCandidateItem
              : mapRecruitmentItem
        );

        setItems(mappedItems);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 1100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [matricID, refreshKey]); // ← refreshKey triggers re-fetch on Refresh button click

  return { items, loading };
};

export type { UseRecruitmentDetailsResult };