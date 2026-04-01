"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowConfig = void 0;
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var Config_1 = require("../../utilities/Config");
var WorkflowConfig = function (matricId) {
    switch (matricId) {
        case ConditionConfig_1.MatricID.AssignHr:
            return Config_1.StatusId.PendingUploadAdvert;
        case ConditionConfig_1.MatricID.JobAdvert:
            return Config_1.StatusId.PendingwithLineManagereviewAdv;
        case ConditionConfig_1.MatricID.AdvertReviewLM:
            return Config_1.StatusId.CareerPortalQuestions;
        case ConditionConfig_1.MatricID.InterviewQuestionLM:
            return Config_1.StatusId.PendingReviewAdvertHOD;
        case ConditionConfig_1.MatricID.AdvertReviewHOD:
            return Config_1.StatusId.PendingUploadONEM;
        case ConditionConfig_1.MatricID.UploadONEM:
            return Config_1.StatusId.RecruitmentInProgress;
        case ConditionConfig_1.MatricID.AssignInterviewPanel:
            return Config_1.StatusId.InterviewScheduled;
        case ConditionConfig_1.MatricID.EvalutionHR:
            return Config_1.StatusId.InterviewInProcess;
        default:
            return 0;
    }
};
exports.WorkflowConfig = WorkflowConfig;
//# sourceMappingURL=WorkflowConfig.js.map