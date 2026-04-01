import { MatricID } from "../../utilities/ConditionConfig";
import { StatusId } from "../../utilities/Config";

export const WorkflowConfig = (matricId: number) => {
    switch (matricId) {
        case MatricID.AssignHr:
            return StatusId.PendingUploadAdvert;

        case MatricID.JobAdvert:
            return StatusId.PendingwithLineManagereviewAdv;

        case MatricID.AdvertReviewLM:
            return StatusId.CareerPortalQuestions;

        case MatricID.InterviewQuestionLM:
            return StatusId.PendingReviewAdvertHOD;

        case MatricID.AdvertReviewHOD:
            return StatusId.PendingUploadONEM;

        case MatricID.UploadONEM:
            return StatusId.RecruitmentInProgress;

        case MatricID.AssignInterviewPanel:
            return StatusId.InterviewScheduled;

        case MatricID.EvalutionHR:
            return StatusId.InterviewInProcess;

        default:
            return 0;
    }
}
