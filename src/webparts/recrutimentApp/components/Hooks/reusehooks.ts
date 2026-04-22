import { DashboardServices } from "../../services/ServiceExport";
import { MatricID, menuID, TabNames } from "../../utilities/ConditionConfig";
import { ListNames, RoleID, StatusId } from "../../utilities/Config";
import { MetricQueryConfig } from "../Screens/Dashboard/metricColumns.config";

export const fetchByMetricId = async (
  matricID: number,
  EmailId: string,
  condition?: any,
  roleIDs?: number[],
) => {
  let updatedMetricId = matricID;

  if (matricID === MatricID.ReviewScoreCard) {
    updatedMetricId = MatricID.ReviewScoredHOD;
  }
  const configMap = MetricQueryConfig(EmailId);
  const config = configMap[updatedMetricId];

  if (!config) return [];

  const configs = Array.isArray(config) ? config : [config];

  const serviceCall = async (listName: string, filter: any[]) => {
    if (roleIDs?.includes(RoleID.FinanceDepartment)) {
      filter = filter.filter((f: any) => f.FilterKey !== "RecruitmentHR");
    }

    switch (listName) {
      case ListNames.HRMSNewPositionRequest:
        return DashboardServices.GetNPAEPVRRDetails(filter, condition);

      case ListNames.HRMSRecruitmentDptDetails:
        return DashboardServices.GetRecruitmentDetails(filter, condition);

      case ListNames.HRMSRecruitmentCandidatePersonalDetails:
        return DashboardServices.GetCandidateDetails(
          filter,
          condition,
          matricID,
          EmailId,
        );

      case ListNames.HRMSSelectedCandidateDetailsByHOD:
        if (roleIDs?.includes(RoleID.RecruitmentHR)) {
          filter = filter.map((f: any) => {
            if (f.FilterKey === "StatusId" && Array.isArray(f.FilterValue)) {
              return {
                ...f,
                FilterValue: f.FilterValue.filter(
                  (status: number) =>
                    status !== StatusId.PendingFinancePaymentReview,
                ),
              };
            }
            return f;
          });
        }
        if (roleIDs?.includes(RoleID.FinanceDepartment)) {
          filter = filter
            .filter((f: any) => f.FilterKey !== "RecruitmentHR")
            .map((f: any) => {
              if (f.FilterKey === "StatusId" && Array.isArray(f.FilterValue)) {
                return {
                  ...f,
                  FilterValue: f.FilterValue.filter(
                    (status: number) =>
                      status !== StatusId.PendingHROfferInitiate &&
                      status !== StatusId.PendingHROfferReview &&
                      status !== StatusId.PendingHRReviewOfferWorkPermitInit &&
                      status !==
                        StatusId.PendingHRReviewOfferuploadEmploymentInit &&
                      status !== StatusId.PendingHREmploymentContractInit &&
                      status !== StatusId.PendingHREmploymentContractReview &&
                      status !==
                        StatusId.PendingHREmploymentContractVerification &&
                      status !== StatusId.PendingHRpreonboardingchecklist,
                  ),
                };
              }
              return f;
            });
        }

        return DashboardServices.GetSelectedCandidate(filter, condition);

      default:
        return null;
    }
  };

  const responses = await Promise.all(
    configs.map((cfg) => serviceCall(cfg.ListName, cfg.Filter)),
  );

  let result: any[] = [];

  responses.forEach((res, index) => {
    if (res?.data) {
      result.push(
        ...res.data.map((item: any) => ({
          ...item,
          __listName: configs[index].ListName,
        })),
      );
    }
  });

  return result;
};

export function calculateTotalExperienceYears(experiences: any[]) {
  let totalMonths = 0;

  experiences.forEach((exp) => {
    const startDate = new Date(exp.startFrom);

    let endDate;
    if (exp.endTo === "current date" || exp.isCurrent === 1 || !exp.endTo) {
      endDate = new Date(); // today
    } else {
      endDate = new Date(exp.endTo);
    }

    let months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    // If end day is before start day, reduce one month
    if (endDate.getDate() < startDate.getDate()) {
      months--;
    }

    totalMonths += months;
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years} years and ${months} months`;
}

export function getcountryCode(Code: any[], refMobile: string) {
  if (!refMobile) return null;
  const [countryCode, mobileNumber] = refMobile.split("-");
  const country = Code.find((item) => item.code === countryCode);
  if (!country) return null;
  return `${country.id}-${mobileNumber}`;
}

export const findMatricID = (
  roleIDs: number[],
  statusID: number,
  TabName: string,
  MenuId: number,
): number => {
  if (TabName === TabNames.BackgroundVerification) {
    return MatricID.BackgroundCheck;
  } else if (TabName === TabNames.OfferLetterLabourHire) {
    return MatricID.LabourHire;
  } else if (TabName === TabNames.OfferLetterKSCA) {
    return MatricID.Kcsa;
  } else if (TabName === TabNames.MySubmission) {
    if (roleIDs.includes(RoleID.RecruitmentHR)) {
      if (MenuId === menuID.RecruitmentProcess) {
        return MatricID.MySubmissionBGV;
      } else {
        return MatricID.MySubmissionHR;
      }
    }
    if (roleIDs.includes(RoleID.LineManager)) {
      return MatricID.MySubmissionLM;
    }
    if (roleIDs.includes(RoleID.HOD)) {
      return MatricID.MySubmissionHOD;
    }
    return MatricID.MySubmission;
  } else if (TabName === TabNames.AssignAgencies) {
    return MatricID.AssignAgencies;
  } else if (TabName === TabNames.AdvertExtension) {
    return MatricID.advertExtension;
  } else {
    switch (statusID) {
      case StatusId.ReadyforRecruitmentProcess:
        return MatricID.AssignHr;

      case StatusId.PendingUploadONEM:
        return MatricID.UploadONEM;

      case StatusId.PendingUploadAdvert:
        return MatricID.JobAdvert;

      case StatusId.PendingReviewAdvertHOD:
        return MatricID.AdvertReviewHOD;

      case StatusId.PendingwithLineManagereviewAdv:
        return MatricID.AdvertReviewLM;

      case StatusId.PendingInterviewquestion:
        return MatricID.InterviewQuestionHR;

      case StatusId.CareerPortalQuestions:
        return MatricID.DisqualifiQuesLM;

      case StatusId.InterviewScheduled:
      case StatusId.InterviewScheduledforLevel2:
        return MatricID.EvalutionHR;

      case StatusId.RecruitmentInProgress:
        if (TabName === TabNames.ReviewProfile) {
          if (roleIDs.includes(RoleID.RecruitmentHR)) {
            return MatricID.ReviewProfileHR;
          }
          if (roleIDs.includes(RoleID.LineManager)) {
            return MatricID.ReviewProfileLM;
          }
          return 0;
        }

        if (TabName === TabNames.AssignInterviewPanel) {
          return MatricID.AssignInterviewPanel;
        }

        if (TabName === TabNames.ReviewScorecard) {
          return MatricID.ReviewScoreCard;
        }

        if (TabName === TabNames.AssignAgencies) {
          return MatricID.AssignAgencies;
        }

        return 0;

      default:
        return MatricID.MySubmission;
    }
  }
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return "S";
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(" ")) + ".....";
};

export const isSharePointUrl = (url: string) =>
  /\.sharepoint\.com\//i.test(url);

export const isPdfUrl = (url: string) => {
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".pdf");
};

export const buildWopiUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}/_layouts/15/WopiFrame.aspx?sourcedoc=${encodeURIComponent(url)}&action=embedview`;
  } catch {
    return url;
  }
};

export const buildOfficeViewerUrl = (url: string) =>
  `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
