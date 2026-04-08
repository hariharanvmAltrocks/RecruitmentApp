"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowHODConfig = exports.WorkflowCandidateListConfig = exports.WorkflowConfig = void 0;
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var Config_1 = require("../../utilities/Config");
var WorkflowConfig = function (StatusID) {
    switch (StatusID) {
        case Config_1.StatusId.HRLeadtoAssignRecruitmentHR:
            return Config_1.StatusId.PendingUploadAdvert;
        case Config_1.StatusId.PendingUploadAdvert:
            return Config_1.StatusId.PendingwithLineManagereviewAdv;
        case Config_1.StatusId.PendingwithLineManagereviewAdv:
            return Config_1.StatusId.CareerPortalQuestions;
        case Config_1.StatusId.CareerPortalQuestions:
            return Config_1.StatusId.PendingReviewAdvertHOD;
        case Config_1.StatusId.PendingReviewAdvertHOD:
            return Config_1.StatusId.PendingUploadONEM;
        case Config_1.StatusId.PendingUploadONEM:
            return Config_1.StatusId.RecruitmentInProgress;
        default:
            return 0;
    }
};
exports.WorkflowConfig = WorkflowConfig;
var WorkflowCandidateListConfig = function (StatusID, isLevel1, Action) {
    switch (StatusID) {
        case Config_1.StatusId.InterviewLevel1InProgress:
            if (isLevel1) {
                return Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD;
            }
            else {
                return Config_1.StatusId.pendingL2shorlistingwithHOD;
            }
        case Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD:
            if (Action === ConditionConfig_1.ButtonAction.Approve) {
                return Config_1.StatusId.Selected;
            }
            else if (Action === ConditionConfig_1.ButtonAction.Reject) {
                if (isLevel1) {
                    return Config_1.StatusId.CandidateRejectedbyHODLevel2;
                }
                else {
                    return Config_1.StatusId.RejectedbyHOD;
                }
            }
            else if (Action === ConditionConfig_1.ButtonAction.OnHold) {
                if (isLevel1) {
                    return Config_1.StatusId.CandidateOnHoldbyHODLevel2;
                }
                else {
                }
            }
            break;
        case Config_1.StatusId.pendingL2shorlistingwithHOD:
            if (Action === ConditionConfig_1.ButtonAction.Approve) {
                return Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
            }
            else if (Action === ConditionConfig_1.ButtonAction.Reject) {
                return Config_1.StatusId.CandidateRejectedbyHODLevel1;
            }
            else if (Action === ConditionConfig_1.ButtonAction.OnHold) {
                return Config_1.StatusId.CandidateOnHoldbyHODLevel1;
            }
            break;
        case Config_1.StatusId.CandidateOnHoldbyHODLevel1:
            if (isLevel1) {
                if (Action === ConditionConfig_1.ButtonAction.Approve) {
                    return Config_1.StatusId.Selected;
                }
                else if (Action === ConditionConfig_1.ButtonAction.Reject) {
                    return Config_1.StatusId.CandidateRejectedbyHODLevel1;
                }
            }
            else {
                if (Action === ConditionConfig_1.ButtonAction.Approve) {
                    return Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
                }
                else if (Action === ConditionConfig_1.ButtonAction.Reject) {
                    return Config_1.StatusId.CandidateRejectedbyHODLevel1;
                }
            }
            break;
        case Config_1.StatusId.CandidateOnHoldbyHODLevel2:
            if (Action === ConditionConfig_1.ButtonAction.Approve) {
                return Config_1.StatusId.Selected;
            }
            else if (Action === ConditionConfig_1.ButtonAction.Reject) {
                return Config_1.StatusId.CandidateRejectedbyHODLevel2;
            }
            break;
        case Config_1.StatusId.OnHoldbyHOD:
            if (Action === ConditionConfig_1.ButtonAction.Approve) {
                return Config_1.StatusId.Selected;
            }
            else if (Action === ConditionConfig_1.ButtonAction.Reject) {
                return Config_1.StatusId.RejectedbyHOD;
            }
            break;
        case Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel:
            return Config_1.StatusId.InterviewScheduledforLevel2;
        case Config_1.StatusId.InterviewLevel2InProgress:
            return Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD;
        default:
            return 0;
    }
};
exports.WorkflowCandidateListConfig = WorkflowCandidateListConfig;
var WorkflowHODConfig = function (StatusID, isRevet, IsExpat, EmpCat) {
    switch (StatusID) {
        case Config_1.StatusId.PendingHRBGVInitiation:
            return Config_1.StatusId.PendingBGdocuploadedbycandidate;
        case Config_1.StatusId.PendingBGdocuploadedbycandidate:
            return Config_1.StatusId.PendingHRReviewBGCheck;
        case Config_1.StatusId.PendingHRReviewBGCheck:
            if (isRevet) {
                return Config_1.StatusId.PendingBGdocuploadedbycandidate;
            }
            else {
                return Config_1.StatusId.PendingDOTAficaVerification;
            }
        case Config_1.StatusId.PendingDOTAficaVerification:
            if (IsExpat) {
                return Config_1.StatusId.RESIProcessInitiatedforExpatriate;
            }
            else {
                return Config_1.StatusId.RESIProcessInitiatedforDRC;
            }
        case Config_1.StatusId.PendingHROfferInitiate:
            if (EmpCat === ConditionConfig_1.EmployeementCategory.KCSAEmployee) {
                return Config_1.StatusId.PendingCandidateOfferLetterUpload;
            }
            else {
                return Config_1.StatusId.PendingLabourHireOfferRelease;
            }
        case Config_1.StatusId.PendingCandidateOfferLetterUpload:
            if (EmpCat === ConditionConfig_1.EmployeementCategory.KCSAEmployee) {
                if (IsExpat) {
                    return Config_1.StatusId.PendingHRReviewOfferWorkPermitInit;
                }
                else {
                    return Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract;
                }
            }
            else {
                if (IsExpat) {
                    return Config_1.StatusId.PendingHRReviewOfferWorkPermitInit;
                }
                else {
                    return Config_1.StatusId.PendingHRReviewOfferuploadEmploymentInit;
                }
            }
        //LabourHire
        case Config_1.StatusId.PendingLabourHireOfferRelease:
            return Config_1.StatusId.PendingHROfferReview;
        case Config_1.StatusId.PendingHROfferReview:
            return Config_1.StatusId.PendingCandidateOfferLetterUpload;
        case Config_1.StatusId.PendingHRReviewOfferWorkPermitInit:
            if (EmpCat === ConditionConfig_1.EmployeementCategory.KCSAEmployee) {
                return Config_1.StatusId.PendingCandidateWorkPermitreleatedDoc;
            }
            else {
                return Config_1.StatusId.PendingLabourhireWPPayment;
            }
        case Config_1.StatusId.PendingLabourhireWPPayment:
            return Config_1.StatusId.PendingFinancePaymentReview;
        case Config_1.StatusId.PendingFinancePaymentReview:
            return Config_1.StatusId.PendingLHWorkPermitProcess;
        case Config_1.StatusId.PendingLHWorkPermitProcess:
            return Config_1.StatusId.PendingHREmploymentContractInit;
        case Config_1.StatusId.PendingHREmploymentContractInit:
            return Config_1.StatusId.PendingLHECRelease;
        case Config_1.StatusId.PendingLHECRelease:
            return Config_1.StatusId.PendingHREmploymentContractReview;
        case Config_1.StatusId.PendingHREmploymentContractReview:
            return Config_1.StatusId.PendingCandidateEmploymentContractUpload;
        //KCSAEmployee
        case Config_1.StatusId.PendingCandidateWorkPermitreleatedDoc:
            return Config_1.StatusId.PendingHRReviewWorkpermitDocs;
        case Config_1.StatusId.PendingHRReviewWorkpermitDocs:
            return Config_1.StatusId.WorkPermitAcknowledgedContractUploaded;
        case Config_1.StatusId.WorkPermitAcknowledgedContractUploaded:
            return Config_1.StatusId.PendingCandidateEmploymentContractUpload;
        case Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract:
            return Config_1.StatusId.PendingCandidateEmploymentContractUpload;
        case Config_1.StatusId.PendingCandidateEmploymentContractUpload:
            return Config_1.StatusId.PendingHREmploymentContractVerification;
        case Config_1.StatusId.PendingHREmploymentContractVerification:
            return Config_1.StatusId.PendingHRpreonboardingchecklist;
        default:
            return 0;
    }
};
exports.WorkflowHODConfig = WorkflowHODConfig;
//# sourceMappingURL=WorkflowConfig.js.map