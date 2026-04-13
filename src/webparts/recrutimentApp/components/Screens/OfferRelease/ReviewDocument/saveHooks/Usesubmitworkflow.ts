import { useCallback, useState } from "react";
import type {
  DocumentName,
  InitiateLaborHire,
} from "../../../../../services/OfferRelease/IOfferService";
import {
  StatusId,
  WorkflowAction,
} from "../../../SelectionProcess/config/EvaluationConfig";
import { ResponeStatus } from "../../../../../utilities/ApiConfig";
import { workflowStatusApi } from "../../../../../utilities/Config";
import {
  ButtonAction,
  DisplayFolderName,
  DocumentFolderName,
  EmployeementCategory,
  NationalityCode,
  RecuritmentHRMsg,
  RoleName,
} from "../../../../../utilities/ConditionConfig";
import {
  CandidateTable,
  OfferServices,
} from "../../../../../services/ServiceExport";
import { IselectedPosition } from "../PositionFrame";
import { VerificationStep } from "../../../../Comman/Statusbadge/Statusbadge";
import { IDocFiles } from "../../../../../services/SPService/Ispservice";
import { UploadedFile } from "../../../RecruitmentTable/Components/UploadDocument";
import {
  ModalState,
  useModalPopup,
} from "../../../../Comman/ModalPopup/useModalPopup";
import { ModalType } from "../../../../Comman/ModalPopup/ModalPopup";
import { useNavigate } from "react-router-dom";
import {
  COIFormState,
  useStateOfferRelease,
} from "../StateManage/useReviewDocumentManage";
import { userInfo } from "../../../../../utilities/hooks/RoleContext";
import { SpiltDateOnly } from "../../../../Hooks/dateConfigfn";
import { WorkflowJson } from "../../../../../models/Icareerportal";
import { DocumentCategory } from "../Hooks/Userequireddocuments";
import { ConsentFormFile } from "../Component/ResueComponent";
import { WorkflowHODConfig } from "../../../../Hooks/WorkflowConfig";

export interface AlertProps {
  Message: string;
  Type: string;
  visible: boolean;
  ButtonAction: (clicked: boolean) => Promise<void>;
}

export interface SubmitWorkflowDeps {
  data: IselectedPosition;
  BGVerifiedStatus: DocumentCategory[];
  rejectflag: boolean;
  consentFile: ConsentFormFile | null;
  coiState: COIFormState;
  consentVerification: boolean;
  reviewerComments: string;
  uploadDocs: UploadedFile[];
}

interface SubmitWorkflowResult {
  isLoading: boolean;
  closeModal: () => void;
  modalState: ModalState;
  submit: (btnAction: number) => Promise<void>;
}

export function makeDocData(
  profileID: string,
  requestID: string,
  documentName: string,
  unsignedDoc = "",
): DocumentName {
  return {
    ProfileID: profileID,
    RequestID: requestID,
    DocumentName: documentName,
    UnsignedDoc: unsignedDoc,
  };
}

type ResolveResult = {
  workflowStatusValue: string;
  successMsg: string;
  StatusId: number;
  documentResponse: any;
  workPermitDocs?: any;
};

async function resolveStatus(
  data: IselectedPosition,
  consentFile: ConsentFormFile | null,
  documents: UploadedFile[],
  btnAction: number,
  email: string,
  coiState: COIFormState,
  rejectflag: boolean,
): Promise<ResolveResult> {
  const pid = data?.ProfileID;
  const rid = data?.JobRequestID;
  const ok = { status: ResponeStatus.SUCCESS };

  const documentFile: IDocFiles[] = documents.map((file) => {
    return {
      name: file.name,
      content: file.fileContent,
      type: "New",
    };
  });

  let IsRevert = btnAction === ButtonAction.Revert;
  let IsExpat = data?.NationalityCode != NationalityCode.Nationals;

  let StatusID = WorkflowHODConfig(
    data?.StatusID,
    IsRevert,
    IsExpat,
    data?.EmploymentCategory,
  );

  switch (data?.StatusID) {
    case StatusId.PendingHRBGVInitiation: {
      if (btnAction !== ButtonAction.Initiated) break;
      return {
        workflowStatusValue: workflowStatusApi.PendingCandidateUploadBGVDocs,
        successMsg: RecuritmentHRMsg.BGverificationMsg,
        StatusId: StatusID,
        // actionID: WorkflowAction.Approved,
        documentResponse: ok,
      };
    }

    case StatusId.PendingHRReviewBGCheck: {
      if (btnAction === ButtonAction.Review) {
        const isNational = data?.NationalityCode === NationalityCode.Nationals;

        const successMsg = isNational
          ? RecuritmentHRMsg.BGReviewedMsg
          : RecuritmentHRMsg.BGReviewinitBGV;

        let documentResponse = ok;

        if (!isNational && consentFile) {
          const doc: IDocFiles = {
            name: consentFile.name,
            content: String(consentFile.content),
            type: "New",
          };
          documentResponse = await OfferServices.UploadCandidateDocument(
            makeDocData(pid, rid, DocumentFolderName.BGVConsentform),
            [doc],
          );
        }

        return {
          workflowStatusValue: workflowStatusApi.initiatetheBGVProcess,
          successMsg,
          StatusId: StatusID,
          documentResponse,
        };
      }

      if (btnAction === ButtonAction.Revert) {
        return {
          workflowStatusValue: workflowStatusApi.RevetedBacktoBGVDocuments,
          successMsg: RecuritmentHRMsg.RevertWGDocs,
          StatusId: StatusID,
          documentResponse: ok,
        };
      }
      break;
    }

    case StatusId.PendingHROfferInitiate: {
      const isKCSA =
        data.EmploymentCategory === EmployeementCategory.KCSAEmployee;

      if (isKCSA) {
        const documentResponse = await OfferServices.UploadCandidateDocument(
          makeDocData(
            pid,
            rid,
            DocumentFolderName.Offerletter,
            DocumentFolderName.UnsignedDoc,
          ),
          [...documentFile],
        );
        return {
          workflowStatusValue:
            workflowStatusApi.Pendingwithcandidatetosignofferletter,
          successMsg: RecuritmentHRMsg.OfferLetterMsg,
          StatusId: StatusID,
          documentResponse,
        };
      } else {
        let initiateLabour: InitiateLaborHire = {
          ID: data.ID,
          IsExpat: data.Nationality === "Expatriate" ? true : false,
          jobRequestID: Number(data.JobRequestID),
          positionId: data.positionID,
          location: data.Location,
          businessUnit: data.BusinessUnitCode,
          department: data.Department,
          section: data.Section,
          patersonGrade: data.patersonGrade,
          drcGrade: data.drcGrade,
          reportingManager: "",
          dateOfJoining: data.JoiningDate ? new Date(data.JoiningDate) : null,
          typeOfContract: data.TypeofContract,
          noOfMonths: data.NoticePeriod,
          createdOn: new Date(),
          createdBy: RoleName.RecruitmentHR,
          createrEmail: email,
        };

        const response = await OfferServices.InitiateLabouHireOfferRelease(
          initiateLabour,
          email,
        );
        return {
          workflowStatusValue: workflowStatusApi.PendingHROfferInitiate,
          successMsg: RecuritmentHRMsg.OfferLetterinit,
          StatusId: StatusID,
          documentResponse: {
            status:
              response.status === 200
                ? ResponeStatus.SUCCESS
                : ResponeStatus.FAILED,
          },
        };
      }
    }

    case StatusId.PendingHROfferReview: {
      const isReview = btnAction === ButtonAction.Review;
      return {
        workflowStatusValue: isReview
          ? workflowStatusApi.Pendingwithcandidatetosignofferletter
          : workflowStatusApi.RevertedtheLabourHireOfferRelease,
        successMsg: isReview
          ? RecuritmentHRMsg.ReviewLaborHireOffer
          : RecuritmentHRMsg.RevertLabourOffer,
        StatusId: StatusID,
        documentResponse: ok,
      };
    }

    case StatusId.PendingHRReviewOfferWorkPermitInit: {
      const isReview = btnAction === ButtonAction.Review;
      return {
        workflowStatusValue: isReview
          ? workflowStatusApi.PendingwithCandidatetouploadotherDocuments
          : workflowStatusApi.RevertedBacktoCandidateforreuploadofferLetter,
        successMsg: isReview
          ? RecuritmentHRMsg.ReviewOfferLetterMsg
          : RecuritmentHRMsg.RevertedOfferLetter,
        StatusId: StatusID,
        documentResponse: ok,
      };
    }

    case StatusId.PendingHRReviewWorkpermitDocs: {
      if (btnAction === ButtonAction.Review) {
        return {
          workflowStatusValue: "",
          successMsg: RecuritmentHRMsg.WorkPermitDocs,
          StatusId: StatusID,
          documentResponse: ok,
        };
      }
      return {
        workflowStatusValue:
          workflowStatusApi.RevertedBacktoCandidateforreuploadDocs,
        successMsg: RecuritmentHRMsg.RevertWorkPermitDocs,
        StatusId: StatusID,
        documentResponse: ok,
      };
    }

    case StatusId.PendingFinancePaymentReview: {
      if (btnAction !== ButtonAction.Review) break;
      const documentResponse = await OfferServices.UploadCandidateDocument(
        makeDocData(pid, rid, DocumentFolderName.ProofOfDocument),
        [...documentFile],
      );
      return {
        workflowStatusValue: workflowStatusApi.PendingFinancePaymentReview,
        successMsg: RecuritmentHRMsg.FinancePaymentReviewMsg,
        StatusId: StatusID,
        documentResponse,
      };
    }

    case StatusId.PendingHREmploymentContractInit: {
      return {
        workflowStatusValue: workflowStatusApi.PendingHREmploymentContractInit,
        successMsg: RecuritmentHRMsg.EmployeementInit,
        StatusId: StatusID,
        documentResponse: ok,
      };
    }

    case StatusId.WorkPermitAcknowledgedContractUploaded: {
      const documentResponse = await OfferServices.UploadCandidateDocument(
        makeDocData(
          pid,
          rid,
          DocumentFolderName.EmploymentContractForm,
          DocumentFolderName.UnsignedDoc,
        ),
        [...documentFile],
      );
      const workPermitDocs = await OfferServices.UploadCandidateDocument(
        makeDocData(pid, rid, DocumentFolderName.WorkPermit),
        [...documentFile],
      );
      return {
        workflowStatusValue:
          workflowStatusApi.PendingwithCandidatetosignEmployementContract,
        successMsg: RecuritmentHRMsg.EmploymentContractMsg,
        StatusId: StatusID,
        documentResponse,
        workPermitDocs,
      };
    }

    case StatusId.PendingHREmploymentContractReview: {
      const isReview = btnAction === ButtonAction.Review;
      return {
        workflowStatusValue: isReview
          ? workflowStatusApi.PendingwithCandidatetosignEmployementContract
          : workflowStatusApi.RevertedtheLabourHireEmployementContract,
        successMsg: isReview
          ? RecuritmentHRMsg.ReviewEmploymentContractMsg
          : RecuritmentHRMsg.RevertECCocs,
        StatusId: StatusID,
        documentResponse: ok,
      };
    }

    case StatusId.PendingHREmploymentContractVerification: {
      if (btnAction === ButtonAction.Review) {
        const documentResponse =
          await OfferServices.InsertRecruitmentCandidateDetails({
            // JoiningDate: data.JoiningDate
            //   ? SpiltDateOnly(new Date(data.JoiningDate))
            //   : "",
            NoticePeriod: String(data.NoticePeriod),
            ID: data.CandidateID,
          });
        return {
          workflowStatusValue: workflowStatusApi.OnboardingInprogress,
          successMsg: RecuritmentHRMsg.ReviewECMsg,
          StatusId: StatusID,
          documentResponse,
        };
      }
      return {
        workflowStatusValue:
          workflowStatusApi.RevertedBacktoCandidateforreuploadEmploymentContract,
        successMsg: RecuritmentHRMsg.RevertedEmploymentContractMsg,
        StatusId: StatusID,
        documentResponse: ok,
      };
    }

    // ── Offer Review + Upload Employment Contract ─────────────────────────────
    case StatusId.PendingHRReviewOfferanduploadEmployementContract: {
      if (btnAction === ButtonAction.Review) {
        const documentResponse = await OfferServices.UploadCandidateDocument(
          makeDocData(
            pid,
            rid,
            DocumentFolderName.EmploymentContractForm,
            DocumentFolderName.UnsignedDoc,
          ),
          documentFile,
        );
        return {
          workflowStatusValue:
            workflowStatusApi.PendingwithCandidatetosignEmployementContract,
          successMsg: RecuritmentHRMsg.EmploymentContractMsg,
          StatusId: StatusID,
          documentResponse,
        };
      }
      return {
        workflowStatusValue:
          workflowStatusApi.RevertedBacktoCandidateforreuploadofferLetter,
        successMsg: RecuritmentHRMsg.RevertedOfferLetter,
        StatusId: StatusID,
        documentResponse: ok,
      };
    }

    case StatusId.PendingHRReviewOfferuploadEmploymentInit: {
      const isReview = btnAction === ButtonAction.Review;
      return {
        workflowStatusValue: isReview
          ? workflowStatusApi.PendingHREmploymentContractInit
          : workflowStatusApi.RevertedBacktoCandidateforreuploadDocs,
        successMsg: isReview
          ? RecuritmentHRMsg.ReviewOfferLetterInitEC
          : RecuritmentHRMsg.RevertedOfferLetter,
        StatusId: StatusID,
        documentResponse: ok,
      };
    }

    case StatusId.PendingDOTAficaVerification: {
      if (!rejectflag) break;
      const bgvDocData = makeDocData(
        pid,
        rid,
        DocumentFolderName.BGVProofOfDocument,
      );
      const documentResponse = await OfferServices.UploadCandidateDocument(
        bgvDocData,
        coiState.attachment,
      );
      if (btnAction === ButtonAction.Revert) {
        return {
          workflowStatusValue:
            workflowStatusApi.RevertedBacktoCandidateforreuploadDocs,
          successMsg: "",
          StatusId: StatusID,
          documentResponse,
        };
      }
      return {
        workflowStatusValue: "",
        successMsg: RecuritmentHRMsg.ReviewOfferLetterInitEC,
        StatusId: StatusID,
        documentResponse,
      };
    }

    default:
      break;
  }

  return {
    workflowStatusValue: "",
    successMsg: "",
    StatusId: StatusID,
    documentResponse: { status: ResponeStatus.FAILED },
  };
}

function buildCandidateData(
  data: any,
  workflowStatusValue: string,
  documentResponse: any,
  workPermitDocs: any,
  EmailId: string,
  bgvStatus: DocumentCategory[],
  comments: string,
): WorkflowJson {
  const isBGVStatus =
    data.StatusId === StatusId.PendingHRBGVInitiation ||
    data.StatusId === StatusId.PendingHRReviewBGCheck;

  const base: WorkflowJson = {
    workflowStatus: workflowStatusValue,
    jobRequestId: Number(data?.JobRequestID),
    comments: comments,
    actionBy: RoleName.RecruitmentHR,
    HrUserId: isBGVStatus ? "" : "",
    HrUserEmail: isBGVStatus ? EmailId : "",
  };

  if (
    data.StatusId === StatusId.PendingHROfferInitiate &&
    data.EmploymentCategory === EmployeementCategory.KCSAEmployee
  ) {
    const offerDoc = documentResponse.data?.find((d: any) =>
      d.name?.includes("OfferLetter"),
    );
    base.OfferLatterPath = offerDoc?.content;
  }

  if (data.StatusId === StatusId.WorkPermitAcknowledgedContractUploaded) {
    base.EmpContractLatterPath = documentResponse.data?.[0]?.content;
    base.signedWorkPermitPath = workPermitDocs?.data?.[0]?.content;
  }

  if (data.StatusId === StatusId.PendingHROfferReview) {
    const labourOffer = bgvStatus.find(
      (d) => d.categoryName === DisplayFolderName.LabourHireOffer,
    );
    base.OfferLatterPath = labourOffer?.documents[0]?.downloadUrl;
  }

  if (data.StatusId === StatusId.PendingHREmploymentContractReview) {
    const labourEC = bgvStatus.find(
      (d) => d.categoryName === DisplayFolderName.LabourHireEC,
    );
    base.EmpContractLatterPath = labourEC?.documents[0]?.downloadUrl;
  }

  if (data.StatusId === StatusId.PendingFinancePaymentReview) {
    base.proofOfPaymentPath = documentResponse.data?.[0]?.content;
  }

  if (data.StatusId === StatusId.PendingHREmploymentContractInit) {
    const wpDoc = bgvStatus.find(
      (d) => d.categoryName === DisplayFolderName.WorkPermitDocument,
    );
    base.signedWorkPermitPath = wpDoc?.documents[0]?.downloadUrl;
  }

  if (
    data.StatusId ===
      StatusId.PendingHRReviewOfferanduploadEmployementContract &&
    data.RadioAction === "Yes"
  ) {
    base.EmpContractLatterPath = documentResponse.data?.[0]?.content;
  }

  return base;
}

export function useSubmitWorkflow(
  data: SubmitWorkflowDeps,
): SubmitWorkflowResult {
  const { ADGroupData } = userInfo();

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { modalState, showModal, closeModal } = useModalPopup();

  const goToList = useCallback(() => {
    navigate("/OfferTable");
  }, []);

  const showAlert = useCallback(
    (message: string, type: ModalType, onConfirm: () => void) => {
      showModal({
        type: type,
        title: "Submitted",
        message: message,
        confirmLabel: "Go to Dashboard",
        onConfirm: () => {
          closeModal();
          onConfirm();
          navigate("/Dashboard");
        },
      });
    },
    [],
  );

  const showSuccess = useCallback(
    (msg: string) => {
      showAlert(msg, "success", goToList);
    },
    [showAlert, goToList],
  );

  const showError = useCallback(
    (navigateOnConfirm = true) => {
      showAlert(
        RecuritmentHRMsg.APIErrorMsg,
        "error",
        navigateOnConfirm ? goToList : () => {},
      );
    },
    [showAlert, goToList],
  );

  const submit = useCallback(
    async (btnAction: number) => {
      setIsLoading(true);

      try {
        const resolved = await resolveStatus(
          data.data,
          data.consentFile,
          data.uploadDocs,
          btnAction,
          ADGroupData.EmailId[0],
          data.coiState,
          data.rejectflag,
        );
        let Verified = data.consentVerification;
        if (resolved.documentResponse?.status !== ResponeStatus.SUCCESS) {
          showError(false);
          return;
        }

        const candidateData = buildCandidateData(
          data.data,
          resolved.workflowStatusValue,
          resolved.documentResponse,
          resolved.workPermitDocs,
          ADGroupData.EmailId[0],
          data.BGVerifiedStatus,
          data.reviewerComments,
        );

        const skipWorkflow =
          data.data.StatusID === StatusId.PendingHRReviewWorkpermitDocs &&
          Verified;

        const workflowStatus = skipWorkflow
          ? { status: ResponeStatus.SUCCESS }
          : await CandidateTable.UpdateCandidateStatus(candidateData);

        if (workflowStatus?.status !== ResponeStatus.SUCCESS) {
          showError();
          return;
        }

        const spfxUpdate = await OfferServices.UpdateStatusSelectedHOD([
          { ID: data.data.ID, StatusId: resolved.StatusId },
        ]);

        if (spfxUpdate?.status !== ResponeStatus.SUCCESS) {
          showError();
          return;
        }

        if (
          data.data.StatusID === StatusId.PendingDOTAficaVerification &&
          data.rejectflag
        ) {
          await OfferServices.InsertRecruitmentCandidateDetails({
            ID: data.data.CandidateID,
            BackgroundChecksResults:
              JSON.stringify(data.BGVerifiedStatus) ?? [],
            BGVConsultedWith: data.coiState.consultedWith,
            BGVComments: data.coiState.comments,
          });
        }

        showSuccess(resolved.successMsg);
      } catch (err) {
        console.error("useSubmitWorkflow error:", err);
        showError(false);
      } finally {
        setIsLoading(false);
      }
    },
    [data, showSuccess, showError],
  );

  const closeAlert = useCallback(() => closeModal(), []);

  return { isLoading, modalState, closeModal, submit };
}
