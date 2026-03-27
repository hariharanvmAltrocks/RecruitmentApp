import { MatricID, TabNames } from "../../utilities/ConditionConfig";
import { RoleID, StatusId } from "../../utilities/Config";

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

export const findMatricID = (roleIDs: number[], statusID: number, TabName: string): number => {
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
      return MatricID.InterviewQuestionLM;
    case StatusId.InterviewScheduled:
    case StatusId.InterviewScheduledforLevel2:
      return MatricID.EvalutionHR;
    case StatusId.RecruitmentInProgress:
      if (TabName === TabNames.ReviewProfile) {
        if (roleIDs.includes(RoleID.RecruitmentHR)) {
          return MatricID.ReviewProfileHR;
        } else if (roleIDs.includes(RoleID.LineManager)) {
          return MatricID.ReviewProfileLM;
        }
      } else if (TabName === TabNames.AssignInterviewPanel) {
        return MatricID.AssignInterviewPanel;
      } else if (TabName === TabNames.ReviewScorecard) {
        return MatricID.ReviewScoreCard;
      } else {
        return 0;
      }
    default:
      return 0;
  }
};