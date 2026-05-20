import {
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Filter,
  Network,
  Play,
  Send,
  ShieldCheck,
} from "lucide-react";
import { StatusId } from "./Config";

export const stages = [
  { label: "Assign HR", icon: FileSearch },
  { label: "Upload Advert", icon: ClipboardCheck },
  { label: "Review Advert LM", icon: Send },
  { label: "Create Disqualification Questions", icon: Play },
  { label: "Review Advert HOD", icon: Filter },
  { label: "Upload ONEM Signed and Stamped", icon: ShieldCheck },
  { label: "Recruitment In Process", icon: Network },
  { label: "Onboarded", icon: CheckCircle2 },
];

export const getStageIndex = (statusId: number) => {
  if (!statusId) return 0;
  if (statusId == StatusId.PendingAssignHR) return 0;
  if (statusId == StatusId.PendingUploadAdvert) return 1;
  if (statusId == StatusId.PendingwithLineManagereviewAdv) return 2;
  if (statusId == StatusId.CareerPortalQuestions) return 3;
  if (statusId == StatusId.PendingReviewAdvertHOD) return 4;
  if (statusId == StatusId.PendingUploadONEM) return 5;
  if (statusId == StatusId.RecruitmentInProgress) return 6;
  if (statusId == StatusId.RESProcessInitiated) return 7;
  if (statusId == StatusId.Onboarded) return 8;
  return 0;
};

export const PROGRESS_STEPS = [
  "Interview Schedules",
  "Assign Position ID",
  "Background Check",
  "Resi Process",
  "Offer Release",
  "Workpermit Process",
  "Employment Contract",
  "Onboarding",
];

export const getStageCandidateindex = (statusId: number) => {
  if (!statusId) return 0;
  if (
    statusId == StatusId.InterviewScheduled ||
    statusId == StatusId.InterviewLevel1InProgress ||
    statusId == StatusId.InterviewLevel2InProgress ||
    statusId == StatusId.InterviewScheduledforLevel2
  )
    return 0;
  if (
    statusId == StatusId.PendingwithpositionIDAssignmentWithHOD ||
    statusId == StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
    statusId == StatusId.OnHoldbyHOD ||
    statusId == StatusId.RejectedbyHOD ||
    statusId == StatusId.CandidateOnHoldbyHODLevel1 ||
    statusId == StatusId.CandidateOnHoldbyHODLevel2 ||
    statusId == StatusId.CandidateRejectedbyHODLevel1 ||
    statusId == StatusId.CandidateRejectedbyHODLevel2
  )
    return 1;
  if (
    statusId == StatusId.PendingHRBGVInitiation ||
    statusId == StatusId.PendingBGdocuploadedbycandidate ||
    statusId == StatusId.PendingHRReviewBGCheck ||
    statusId == StatusId.PendingDOTAficaVerification
  )
    return 2;
  if (
    statusId == StatusId.RESIProcessInitiatedforDRC ||
    statusId == StatusId.RESIProcessInitiatedforExpatriate ||
    statusId == StatusId.RESProcessInitiated
  )
    return 3;
  if (
    statusId == StatusId.PendingHROfferInitiate ||
    statusId == StatusId.PendingCandidateOfferLetterUpload ||
    statusId == StatusId.PendingHRReviewOfferWorkPermitInit ||
    statusId == StatusId.PendingLabourHireOfferRelease ||
    statusId == StatusId.PendingHROfferReview
  )
    return 4;
  if (
    statusId == StatusId.PendingCandidateWorkPermitreleatedDoc ||
    statusId == StatusId.PendingHRReviewWorkpermitDocs ||
    statusId == StatusId.WorkPermitAcknowledgedContractUploaded ||
    statusId == StatusId.PendingLabourhireWPPayment ||
    statusId == StatusId.PendingFinancePaymentReview ||
    statusId == StatusId.PendingLHWorkPermitProcess ||
    statusId ==
      StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract
  )
    return 5;
  if (
    statusId == StatusId.OnboardingProcessinitiatedforDRC ||
    statusId == StatusId.OnboardingProcessinitiatedforExpat ||
    statusId == StatusId.onboardingInProcess
  )
    return 6;
  return 0;
};

// export const getCandidateStatus = (statusId: number) => {
//   if (!statusId) return "Unknown";
//   if (statusId == StatusId.) return "Candidate Shortlisted";
//   if (statusId == StatusId.FirstInterviewScheduled) return "First Interview Scheduled";
//   if (statusId == StatusId.FinalInterviewScheduled) return "Final Interview Scheduled";
//   if (statusId == StatusId.OfferPending) return "Offer Pending";
//   if (statusId == StatusId.OfferReleased) return "Offer Released";
//   if (statusId == StatusId.Joined) return "Joined";
//   if (statusId == StatusId.Rejected) return "Rejected";
//   return "Unknown";
// }
