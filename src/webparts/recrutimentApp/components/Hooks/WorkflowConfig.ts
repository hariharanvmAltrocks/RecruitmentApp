import {
  ButtonAction,
  EmployeementCategory,
  MatricID,
} from "../../utilities/ConditionConfig";
import { StatusId } from "../../utilities/Config";

export const WorkflowConfig = (StatusID: number) => {
  switch (StatusID) {
    case StatusId.HRLeadtoAssignRecruitmentHR:
      return StatusId.PendingUploadAdvert;

    case StatusId.PendingUploadAdvert:
      return StatusId.PendingwithLineManagereviewAdv;

    case StatusId.PendingwithLineManagereviewAdv:
      return StatusId.CareerPortalQuestions;

    case StatusId.CareerPortalQuestions:
      return StatusId.PendingReviewAdvertHOD;

    case StatusId.PendingReviewAdvertHOD:
      return StatusId.PendingUploadONEM;

    case StatusId.PendingUploadONEM:
      return StatusId.RecruitmentInProgress;

    default:
      return 0;
  }
};

export const WorkflowCandidateListConfig = (
  StatusID: number,
  isLevel1?: boolean,
  Action?: number,
) => {
  switch (StatusID) {
    case StatusId.InterviewLevel1InProgress:
      if (isLevel1) {
        return StatusId.PendingwithpositionIDAssignmentWithHOD;
      } else {
        return StatusId.pendingL2shorlistingwithHOD;
      }
    case StatusId.PendingwithpositionIDAssignmentWithHOD:
      if (Action === ButtonAction.Approve) {
        return StatusId.Selected;
      } else if (Action === ButtonAction.Reject) {
        if (isLevel1) {
          return StatusId.CandidateRejectedbyHODLevel2;
        } else {
          return StatusId.RejectedbyHOD;
        }
      } else if (Action === ButtonAction.OnHold) {
        if (isLevel1) {
          return StatusId.CandidateOnHoldbyHODLevel2;
        } else {
          return StatusId.OnHoldbyHOD;
        }
      }

    case StatusId.pendingL2shorlistingwithHOD:
      if (Action === ButtonAction.Approve) {
        return StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
      } else if (Action === ButtonAction.Reject) {
        return StatusId.CandidateRejectedbyHODLevel1;
      } else if (Action === ButtonAction.OnHold) {
        return StatusId.CandidateOnHoldbyHODLevel1;
      }

    case StatusId.CandidateOnHoldbyHODLevel1:
      if (Action === ButtonAction.Approve) {
        return StatusId.Selected;
      } else if (Action === ButtonAction.Reject) {
        return StatusId.CandidateRejectedbyHODLevel1;
      }

    case StatusId.CandidateOnHoldbyHODLevel2:
      if (Action === ButtonAction.Approve) {
        return StatusId.Selected;
      } else if (Action === ButtonAction.Reject) {
        return StatusId.CandidateRejectedbyHODLevel2;
      }

    case StatusId.OnHoldbyHOD:
      if (Action === ButtonAction.Approve) {
        return StatusId.Selected;
      } else if (Action === ButtonAction.Reject) {
        return StatusId.RejectedbyHOD;
      }

    case StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel:
      return StatusId.InterviewScheduledforLevel2;

    case StatusId.InterviewLevel2InProgress:
      return StatusId.PendingwithpositionIDAssignmentWithHOD;

    default:
      return 0;
  }
};

export const WorkflowHODConfig = (
  StatusID: number,
  isRevet?: boolean,
  IsExpat?: boolean,
  EmpCat?: string,
) => {
  switch (StatusID) {
    case StatusId.PendingHRBGVInitiation:
      return StatusId.PendingBGdocuploadedbycandidate;
    case StatusId.PendingBGdocuploadedbycandidate:
      return StatusId.PendingHRReviewBGCheck;
    case StatusId.PendingHRReviewBGCheck:
      if (isRevet) {
        return StatusId.PendingBGdocuploadedbycandidate;
      } else {
        return StatusId.PendingDOTAficaVerification;
      }

    case StatusId.PendingDOTAficaVerification:
      if (IsExpat) {
        return StatusId.RESIProcessInitiatedforExpatriate;
      } else {
        return StatusId.RESIProcessInitiatedforDRC;
      }

    case StatusId.PendingHROfferInitiate:
      if (EmpCat === EmployeementCategory.KCSAEmployee) {
        return StatusId.PendingCandidateOfferLetterUpload;
      } else {
        return StatusId.PendingLabourHireOfferRelease;
      }

    case StatusId.PendingCandidateOfferLetterUpload:
      if (EmpCat === EmployeementCategory.KCSAEmployee) {
        if (IsExpat) {
          return StatusId.PendingHRReviewOfferWorkPermitInit;
        } else {
          return StatusId.PendingHRReviewOfferanduploadEmployementContract;
        }
      } else {
        if (IsExpat) {
          return StatusId.PendingHRReviewOfferWorkPermitInit;
        } else {
          return StatusId.PendingHRReviewOfferuploadEmploymentInit;
        }
      }

    //LabourHire
    case StatusId.PendingLabourHireOfferRelease:
      return StatusId.PendingHROfferReview;

    case StatusId.PendingHROfferReview:
      return StatusId.PendingCandidateOfferLetterUpload;

    case StatusId.PendingHRReviewOfferWorkPermitInit:
      if (EmpCat === EmployeementCategory.KCSAEmployee) {
        return StatusId.PendingCandidateWorkPermitreleatedDoc;
      } else {
        return StatusId.PendingLabourhireWPPayment;
      }

    case StatusId.PendingLabourhireWPPayment:
      return StatusId.PendingFinancePaymentReview;

    case StatusId.PendingFinancePaymentReview:
      return StatusId.PendingLHWorkPermitProcess;

    case StatusId.PendingLHWorkPermitProcess:
      return StatusId.PendingHREmploymentContractInit;

    case StatusId.PendingHREmploymentContractInit:
      return StatusId.PendingLHECRelease;

    case StatusId.PendingLHECRelease:
      return StatusId.PendingHREmploymentContractReview;

    case StatusId.PendingHREmploymentContractReview:
      return StatusId.PendingCandidateEmploymentContractUpload;

    //KCSAEmployee

    case StatusId.PendingCandidateWorkPermitreleatedDoc:
      return StatusId.PendingHRReviewWorkpermitDocs;

    case StatusId.PendingHRReviewWorkpermitDocs:
      return StatusId.WorkPermitAcknowledgedContractUploaded;

    case StatusId.WorkPermitAcknowledgedContractUploaded:
      return StatusId.PendingCandidateEmploymentContractUpload;

    case StatusId.PendingHRReviewOfferanduploadEmployementContract:
      return StatusId.PendingCandidateEmploymentContractUpload;

    case StatusId.PendingCandidateEmploymentContractUpload:
      return StatusId.PendingHREmploymentContractVerification;

    case StatusId.PendingHREmploymentContractVerification:
      return StatusId.PendingHRpreonboardingchecklist;

    default:
      return 0;
  }
};
