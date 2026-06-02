import { useEffect, useState } from "react";
import {
  EvalutionItem,
  ISelectedCandidate,
  RecruitmentItem,
  RecruitmentTabKey,
} from "../RecruitmentTable.types";
import { DashboardServices } from "../../../../services/ServiceExport";
import { ListNames } from "../../../../utilities/Config";
import { MetricQueryConfig } from "../../Dashboard/metricColumns.config";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { MatricID } from "../../../../utilities/ConditionConfig";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { fetchByMetricId } from "../../../Hooks/reusehooks";

interface UseRecruitmentDetailsResult {
  items: any[];
  loading: boolean;
  error?: string;
}

const mapEvaluationItem = (item: any): EvalutionItem => ({
  id: item.RecordID,
  RecID: item.RecID,
  department: item.DeptDetails?.[0]?.Department,
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
    id: dept?.ID,
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

const mapSelectedCandidate = (item: any): ISelectedCandidate => {
  const dept = item.DeptDetails;
  const candi = item?.candiDetails;
  return {
    id: item?.RecordID,
    ItemID: item?.ItemID,
    applicantName: candi?.ApplicantName,
    title: item?.PositionTitle ?? "",
    nationality: item?.Nationality,
    status: item?.Status,
    statusId: item?.StatusId,
    positionId: item?.PositionID,

    jobCode: dept?.JobCode,
    department: dept?.Department,

    jobCodeID: dept?.JobCodeId,
    buCode: dept?.BusinessUnitCode,

    CandidateID: candi?.ID,
    jobrequestID: candi?.jobrequestID,

    RecID: dept?.ID,
    EmploymentCategory: dept?.EmploymentCategory,
    IsExpat: candi?.isExpat,
  };
};

const mapRecruitmentItem = (
  item: any,
  shouldShowProfile: boolean,
): RecruitmentItem => ({
  id: item?.RecordID,
  ItemID: item?.ID,
  jobCode: item?.JobCode,
  title: item?.JobTitleEnglish ?? "",
  department: item?.Department,
  ...(shouldShowProfile && {
    ProfileCount: item.CandidateCount,
  }),
  count: item?.NumberOfPersonNeeded,
  requestType: item?.Type,
  nationality: item?.Nationality,
  status: item?.Status,
  statusId: item?.StatusId,
  jobCodeID: item?.JobCodeId,
  StatusTooltip: item?.StatusTooltip,
});

export const useRecruitmentDetails = (
  // matricID: number,
  refreshKey: number = 0,
): UseRecruitmentDetailsResult => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { ADGroupData, roleIDs } = userInfo();
  const { MatricID: matricID } = useUIState();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await fetchByMetricId(
          matricID,
          ADGroupData.EmailId[0],
          "",
          roleIDs,
        );

        if (cancelled) return;

        const isEvaluation =
          matricID === MatricID.EvalutionHR ||
          matricID === MatricID.EvalutionHOD ||
          matricID === MatricID.EvalutionLM ||
          matricID === MatricID.EvalutionEXCO;

         const shouldShowProfile =
           matricID === MatricID.ReviewProfileHR ||
           matricID === MatricID.ReviewProfileLM ||
           matricID === MatricID.AssignInterviewPanel || 
           matricID === MatricID.ReviewScoreCard;

        const mappedItems: any[] = data.map((item: any) => {
          if (isEvaluation) return mapEvaluationItem(item);

          if (
            item.__listName ===
            ListNames.HRMSRecruitmentCandidatePersonalDetails
          ) {
            return mapCandidateItem(item);
          }

          if (item.__listName === ListNames.HRMSSelectedCandidateDetailsByHOD) {
            return mapSelectedCandidate(item);
          }

          return mapRecruitmentItem(item, shouldShowProfile);
        });

        setItems(mappedItems);
      } catch (error) {
        console.error(error);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 1100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [matricID, refreshKey]);

  return { items, loading };
};

export type { UseRecruitmentDetailsResult };
