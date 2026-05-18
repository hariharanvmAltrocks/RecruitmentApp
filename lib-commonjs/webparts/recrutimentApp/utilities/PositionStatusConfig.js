"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStageIndex = exports.stages = void 0;
var lucide_react_1 = require("lucide-react");
var Config_1 = require("./Config");
exports.stages = [
    { label: "Assign HR", icon: lucide_react_1.FileSearch },
    { label: "Upload Advert", icon: lucide_react_1.ClipboardCheck },
    { label: "Review Advert LM", icon: lucide_react_1.Send },
    { label: "Create Disqualification Questions", icon: lucide_react_1.Play },
    { label: "Review Advert HOD", icon: lucide_react_1.Filter },
    { label: "Upload ONEM Signed and Stamped", icon: lucide_react_1.ShieldCheck },
    { label: "Recruitment In Process", icon: lucide_react_1.Network },
    { label: "Onboarded", icon: lucide_react_1.CheckCircle2 },
];
var getStageIndex = function (statusId) {
    if (!statusId)
        return 0;
    if (statusId == Config_1.StatusId.PendingAssignHR)
        return 0;
    if (statusId == Config_1.StatusId.PendingUploadAdvert)
        return 1;
    if (statusId == Config_1.StatusId.PendingwithLineManagereviewAdv)
        return 2;
    if (statusId == Config_1.StatusId.CareerPortalQuestions)
        return 3;
    if (statusId == Config_1.StatusId.PendingReviewAdvertHOD)
        return 4;
    if (statusId == Config_1.StatusId.PendingUploadONEM)
        return 5;
    if (statusId == Config_1.StatusId.RecruitmentInProgress)
        return 6;
    if (statusId == Config_1.StatusId.RESProcessInitiated)
        return 7;
    if (statusId == Config_1.StatusId.Onboarded)
        return 8;
    return 0;
};
exports.getStageIndex = getStageIndex;
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
//# sourceMappingURL=PositionStatusConfig.js.map