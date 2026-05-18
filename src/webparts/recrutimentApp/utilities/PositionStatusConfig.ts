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
