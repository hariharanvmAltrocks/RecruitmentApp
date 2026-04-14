import { useCallback, useRef, useState } from "react";
import { CandidateProfile } from "../../../../models/Icareerportal";
import {
  CandidateTable,
  MeetingSchedules,
} from "../../../../services/ServiceExport";
import {
  ListNames,
  RoleID,
  StatusId,
  WorkflowAction,
  workflowStatusApi,
} from "../../../../utilities/Config";
import {
  DocumentFolderName,
  EmailTemplateCodes,
  InterviewLevels,
  MatricID,
  RecuritmentHRMsg,
  RoleName,
} from "../../../../utilities/ConditionConfig";
import { ConvertUtc } from "../../../Hooks/dateConfigfn";
import { Choices, ResponeStatus } from "../../../../utilities/ApiConfig";
import { useUIState } from "../../../RecrutimentApp/UIStateContext";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import { IDocFiles } from "../../../../services/SPService/Ispservice";
import { DataSyncToRecruitmentResponse } from "../../../../services/RecruitmentTable/IRecruitmentService";
import { useToast } from "../../../Hooks/useToast";
import { useModalPopup } from "../../../Comman/ModalPopup/useModalPopup";
import SPServices from "../../../../services/SPService/spservice";
import { InterviewscheduleL2 } from "../../../../services/CandidateTable/ICandidateService";

export type DecisionType = "YES" | "NO" | "HOLD";

export interface ConflictOfInterestForm {
  consultedWith: string;
  attachment: IDocFiles[];
  comments: string;
}

export interface InterviewScheduleForm {
  panelMembers: string[];
  startDate: string | undefined;
  endDate: string | undefined;
}

interface panelmembers {
  key: number;
  text: string;
}

export interface SubmitPayload {
  candidateId: string;
  CandidateDetails: CandidateProfile | null;
  decision: DecisionType;
  decisionComments: string;
  interviewLevel1: InterviewScheduleForm;
  interviewLevel2: InterviewScheduleForm;
  recrutimentData: DataSyncToRecruitmentResponse | null;
  interviewPanelL1: panelmembers[];
  interviewPanelL2: panelmembers[];
  HRReviewComents: string;
  COIFlag: boolean;
  COIDetails: ConflictOfInterestForm;
  StatusId: string;
}

interface UseSubmitCandidateReviewReturn {
  submitting: boolean;
  submit: (
    payload: SubmitPayload,
    COIButtonAction: DecisionType,
  ) => Promise<void>;
  modalState: any;
  closeModal: () => void;
  pageLoading: boolean;
}

export const useSubmitCandidateReview = (
  onClose: () => void,
  handleRefresh: () => void,
): UseSubmitCandidateReviewReturn => {
  const { MatricID: matricID } = useUIState();
  const { roleIDs } = userInfo();
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { modalState, showModal, closeModal } = useModalPopup();

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const splitDateOnly = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day)),
    ).toISOString();
  };

  // ─── Upload Candidate Details ────────────────────────────────────────────────

  const uploadCandidateDetails = useCallback(
    async (payload: SubmitPayload) => {
      const {
        CandidateDetails: cp,
        recrutimentData,
        interviewLevel1,
        COIDetails,
        interviewPanelL1,
      } = payload;

      if (!cp) throw new Error("CandidateDetails is null");

      const dobValue = cp.DOB ? new Date(cp.DOB) : new Date();
      const dobData = splitDateOnly(dobValue);
      const startDate = interviewLevel1?.startDate;
      const endDate = interviewLevel1?.endDate;

      const candidateDetails: any = {
        RecruitmentIDId: recrutimentData?.ID,
        JobCodeId: recrutimentData?.JobCodeId,
        FristName: cp.FristName,
        MiddleName: cp.MiddleName,
        LastName: cp.ApplicantSurName,
        ResidentialAddress: cp.ResidentialAddress,
        DOB: dobData,
        ContactNumber: cp.ContactNumber,
        Email: cp.Email,
        Nationality: cp.Nationality,
        Gender: cp.Gender,
        TotalYearOfExperiance: String(cp.ExperienceMining),
        ReleventExperience: String(cp.ExperRelatedfield),
        Qualification: cp.HighestQualification,
        JobRequestID: String(cp.CandidateID),
        ProfileID: String(cp.profileID),
        PositionTitle: recrutimentData?.JobTitleEnglish,
        JobGrade: recrutimentData?.DRCGrade,
        ExternalAgentDetails: cp.Agencies,
        InterviewDate: startDate,
        InterviewTime: endDate,
        CandidateResumeLink: cp.CandidateResumeLink ?? "",
        ActionId: WorkflowAction.Approved,
        ConflictsOfInterest: cp.ConflictsOfInterest,
        Disability: cp.disability,
        DisabilityDetails: cp.disabilityReason,
        IdentityNumber: cp.identityValue,
        ProofOfIdentity: cp.identityType,
        LastOrCurrentPosition: cp.CurrentPosition,
        LastOrCurrentEmployer: cp.CurrentEmployer,
        PreviouslyWorkedInIvanhoeMines: cp.previouslyworkedMine ?? "",
        NumberOfTaxDependents: Number(cp.NumberOftax),
        Age: Number(cp.Age),
        AnyFamilyorOtherLinks: cp.familylinks,
        AnyBusinessLinksToDeclare: cp.businesslinks,
        WillingToRelocate: cp.WillingToRelocate,
        CountryofOrgin: cp.CountryofOrgin,
        Citizenship: cp.Citizenship,
        FamilyLink: cp.FamilyLink,
        BusinessLink: cp.BusinessLink,
        GPA: cp.GPA,
        OthersInterviewed: "",
        COIEmail: String(COIDetails.consultedWith),
        COIComments: COIDetails.comments,
        COIReason: cp.COIReason,
        countryOfResidency: cp.countryOfResidency,
        ResidencyStatus: cp.residentStatus,
        MaritalStatus: cp.maritalStatus,
        ChildrenDetails: JSON.stringify(cp.childrenDetails),
        ReferenceEmployeeDetails: JSON.stringify([
          cp?.employeeReferenceDetails || {},
        ]),
        hasIvanhoeZijinExperience: cp?.hasIvanhoeZijinExperience,
        OperationRoleRegion: JSON.stringify([cp?.companyDetails || {}]),
        NationalityCode: cp?.NatioCode || "",
        LanguageKnown: JSON.stringify(cp?.LanguageKnown),
        InterviewLink: "",
      };

      const selectedPanel: any[] = interviewPanelL1.map((item: any) => ({
        RecruitmentIDId: recrutimentData?.ID,
        InterviewLevel: InterviewLevels.Level1,
        InterviewPanel: item.key,
        CandidateID: 0,
      }));

      return CandidateTable.InsertCandidateDetailsInList(
        candidateDetails,
        selectedPanel,
      );
    },
    [CandidateTable],
  );

  // ─── Schedule Meeting ────────────────────────────────────────────────────────

  const scheduleMeeting = useCallback(
    async (payload: SubmitPayload) => {
      const {
        CandidateDetails: cp,
        recrutimentData,
        interviewLevel1,
        interviewLevel2,
        StatusId,
        interviewPanelL1,
      } = payload;

      if (!cp) throw new Error("CandidateDetails is null");

      const organizer = interviewPanelL1.find(
        (i: any) => i.Role === RoleName.RecruitmentHR,
      );
      const requiredAttendees = interviewPanelL1.map(
        (i: any) => i.Email,
      ) as string[];

      const startdate =
        StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview
          ? interviewLevel1.startDate
          : interviewLevel2.startDate;

      const enddate =
        StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview
          ? interviewLevel1.endDate
          : interviewLevel2.endDate;

      const optionalAttendeeL1 = payload.interviewPanelL1.map(
        (i: any) => i.text,
      );
      const optionalAttendeeL2 = payload.interviewPanelL2.map(
        (i: any) => i.text,
      );

      const meetingObj = {
        organizerEmail: organizer?.text ?? "",
        subject: `Interview for ${cp.FristName} ${cp.MiddleName} - ${recrutimentData?.JobTitleEnglish}`,
        startUtc: startdate ?? "",
        endUtc: enddate ?? "",
        location: "",
        requiredAttendees,
        optionalAttendees:
          StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview
            ? optionalAttendeeL1
            : optionalAttendeeL2,
        rooms: [],
        categories: ["Internal", "Planning"],
        isOnlineMeeting: true,
      };

      return MeetingSchedules.createMeeting(meetingObj);
    },
    [MeetingSchedules],
  );

  // ─── Build Workflow Data ─────────────────────────────────────────────────────

  const buildWorkflowData = useCallback(
    async (payload: SubmitPayload, COIButtonAction: string) => {
      const {
        COIDetails,
        CandidateDetails: cp,
        candidateId,
        decisionComments,
        decision,
        HRReviewComents,
        COIFlag,
        StatusId,
      } = payload;

      const currentUserRole = roleIDs.includes(RoleID.RecruitmentHR)
        ? RoleName.RecruitmentHR
        : RoleName.LineManager;

      const createFilter = (workflowStatus: string) => ({
        workflowStatus,
        jobRequestId: candidateId,
        comments: decisionComments,
        actionBy: currentUserRole,
        hrComments: HRReviewComents,
      });

      let candidateData: any = {
        workflowStatus: "",
        jobRequestId: 0,
        comments: "",
        actionBy: "",
        hrComments: "",
      };

      let emailNot: any = { jobRequestId: candidateId, templateCode: "" };
      let popupMessage = "";

      const isLineManager = roleIDs.includes(RoleID.LineManager);
      const isAssignInterview = matricID === MatricID.AssignInterviewPanel;

      if (isLineManager) {
        const isLevel2 =
          String(StatusId) === workflowStatusApi.LineManagerL2Pending ||
          String(StatusId) === workflowStatusApi.LineManagerLevel2OnHold;

        switch (COIButtonAction) {
          case "YES":
            candidateData = createFilter(
              isLevel2
                ? workflowStatusApi.PendingRecruitmentHRscheduleInterview
                : workflowStatusApi.LineManagerL2Pending,
            );
            if (isLevel2)
              emailNot.templateCode = EmailTemplateCodes.LineManagerEmail;
            popupMessage = RecuritmentHRMsg.ProfileReviewed;
            break;

          case "NO":
            candidateData = createFilter(
              isLevel2
                ? workflowStatusApi.LineManagerLevel2Rejected
                : workflowStatusApi.LineManagerLevel1Rejected,
            );
            emailNot.templateCode = EmailTemplateCodes.CandidateRejected;
            popupMessage = RecuritmentHRMsg.ProfileReviewedNo;
            break;

          case "HOLD":
            candidateData = createFilter(
              isLevel2
                ? workflowStatusApi.LineManagerLevel2OnHold
                : workflowStatusApi.LineManagerLevel1OnHold,
            );
            popupMessage = RecuritmentHRMsg.ProfileReviewedWaitingList;
            break;
        }
      } else {
        if (isAssignInterview) {
          candidateData = createFilter(workflowStatusApi.InterviewScheduled);
          emailNot.templateCode = EmailTemplateCodes.InterviewSchedule;
          popupMessage =
            String(StatusId) ===
            workflowStatusApi.PendingRecruitmentHRscheduleInterview
              ? RecuritmentHRMsg.InterviewPanalLevel1
              : RecuritmentHRMsg.InterviewPanalAssignedSuccessfully;
        } else {
          if (decision === "YES") {
            candidateData = createFilter(
              workflowStatusApi.LineManagerL1Pending,
            );
            popupMessage = RecuritmentHRMsg.HRReviewCandidate;
          }
          if (decision === "NO") {
            candidateData = createFilter(workflowStatusApi.HRRejected);
            popupMessage = RecuritmentHRMsg.ProfileReviewedNo;
          }
        }
      }

      // Handle COI upload if applicable
      if (COIFlag && String(StatusId) === workflowStatusApi.HRPending) {
        let attachmentPath = "";

        if (COIDetails.attachment && COIDetails.attachment.length > 0) {
          const docResponse = await CandidateTable.UploadCOIAttachment(
            {
              RequestID: String(cp?.profileID),
              DocumentName: DocumentFolderName.COIAttach,
            },
            COIDetails.attachment,
          );
          attachmentPath = String(docResponse.data[0]?.content ?? "");
        }

        await CandidateTable.GetUpsertCOI({
          profileId: cp?.profileID ?? 0,
          approver: COIDetails.consultedWith,
          comments: COIDetails.comments,
          attachmentPath,
        });
      }

      return { candidateData, emailNot, popupMessage };
    },
    [CandidateTable, matricID, roleIDs],
  );

  // ─── Handle Workflow Process ─────────────────────────────────────────────────
  // NOTE: No setPageLoading calls here — all managed in executeSubmit's finally block

  const handleWorkflowProcess = useCallback(
    async (payload: SubmitPayload, COIButtonAction: string) => {
      const { candidateData, emailNot, popupMessage } = await buildWorkflowData(
        payload,
        COIButtonAction,
      );

      const { StatusId, interviewLevel1 } = payload;

      if (
        StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview
      ) {
        emailNot.templateCode = EmailTemplateCodes.InterviewSchedule;
        emailNot.dynamicFields = {
          InterviewDate: interviewLevel1?.startDate,
          InterviewTime: interviewLevel1?.startDate,
          InterviewLevel: "Level1",
        };
      }

      if (
        StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview
      ) {
        const uploadRes = await uploadCandidateDetails(payload);

        if (uploadRes.status !== ResponeStatus.SUCCESS) {
          showModal({
            type: "success",
            title: "Submitted Successfully",
            message: popupMessage,
            confirmLabel: "Go to Candidate Table",
            onConfirm: () => {
              closeModal();
              onClose();
              handleRefresh();
            },
          });
          return;
        }
      }
      console.log("candidateData", candidateData);

      const res = await CandidateTable.UpdateCandidateStatus(candidateData);

      if (res.status === 200) {
        if (
          StatusId === workflowStatusApi.LineManagerL2Pending ||
          StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview
        ) {
          if (emailNot.templateCode) {
            await CandidateTable.SendEmailNotification(emailNot);
          }
        }

        showModal({
          type: "success",
          title: "Submitted Successfully",
          message: popupMessage,
          confirmLabel: "Go to Candidate Table",
          onConfirm: () => {
            closeModal();
            onClose();
            handleRefresh();
          },
        });
      } else {
        showModal({
          type: "error",
          title: "Error",
          message: RecuritmentHRMsg.APIErrorMsg,
          confirmLabel: "Go to Candidate Table",
          onConfirm: () => {
            closeModal();
            onClose();
            handleRefresh();
          },
        });
      }
    },
    [buildWorkflowData, uploadCandidateDetails, CandidateTable],
  );

  // ─── Execute Submit ──────────────────────────────────────────────────────────
  // Single source of truth for pageLoading and submitting states.
  // setPageLoading(true)  → top of this function
  // setPageLoading(false) → always in the finally block

  const executeSubmit = useCallback(
    async (payload: SubmitPayload, COIButtonAction: string) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setSubmitting(true);
      setPageLoading(true); // ✅ Start loader — single entry point

      try {
        const isLevel2Pending =
          Number(payload.StatusId) ===
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;

        const isScheduleInterview =
          payload.StatusId ===
          workflowStatusApi.PendingRecruitmentHRscheduleInterview;

        // Schedule meeting for Level 1
        if (isScheduleInterview) {
          await scheduleMeeting(payload);
        }

        // Schedule meeting + assign panel for Level 2
        if (isLevel2Pending) {
          await scheduleMeeting(payload);

          const panelL2 = payload.interviewPanelL2.map((item: any) => ({
            RecruitmentIDId: payload.recrutimentData?.ID ?? 0,
            InterviewLevel: InterviewLevels.Level2,
            InterviewPanelId: item.key ?? 0,
            CandidateIDId: Number(payload.candidateId) ?? 0,
          }));

          const interviewscheduleL2Data: InterviewscheduleL2 = {
            candidateUpdate: {
              ID: Number(payload.candidateId),
              StatusId: StatusId.InterviewScheduledforLevel2,
              InterviewDateLevel2: payload.interviewLevel2.startDate ?? "",
              InterviewTimeLevel2: payload.interviewLevel2.endDate ?? "",
            },
            interviewPanelL2: panelL2,
          };

          const response = await CandidateTable.InterviewScheduleLevel2(
            interviewscheduleL2Data,
          );

          if (response.status === 200) {
            showModal({
              type: "success",
              title: "Submitted Successfully",
              message: RecuritmentHRMsg.InterviewPanalLevel2,
              confirmLabel: "Go to Candidate Table",
              onConfirm: () => {
                closeModal();
                onClose();
                handleRefresh();
              },
            });
          } else {
            showModal({
              type: "error",
              title: "Error",
              message: RecuritmentHRMsg.APIErrorMsg,
              confirmLabel: "Go to Candidate Table",
              onConfirm: () => {
                closeModal();
                onClose();
                handleRefresh();
              },
            });
          }
        } else {
          // All other workflow actions
          await handleWorkflowProcess(payload, COIButtonAction);
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Submit failed:", err);
        showModal({
          type: "error",
          title: "Error",
          message: RecuritmentHRMsg.APIErrorMsg,
          confirmLabel: "Close",
          onConfirm: () => {
            closeModal();
          },
        });
      } finally {
        setSubmitting(false);
        setPageLoading(false); // ✅ Stop loader — always runs (success, error, or abort)
      }
    },
    [scheduleMeeting, handleWorkflowProcess, CandidateTable],
  );

  // ─── Submit (Public API) ─────────────────────────────────────────────────────

  const submit = useCallback(
    async (payload: SubmitPayload, COIButtonAction: string = "") => {
      const isRestrictedStatus =
        Number(payload.StatusId) ===
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
        payload.StatusId ===
          workflowStatusApi.PendingRecruitmentHRscheduleInterview;

      // Show COI confirmation modal before proceeding
      if (!isRestrictedStatus && payload.COIFlag) {
        showModal({
          type: "confirmation",
          title: "Conflict Of Interest",
          message:
            "This is the COI profile. Are you sure you're ready to proceed?",
          confirmLabel: "Yes",
          cancelLabel: "No",
          onConfirm: () => {
            closeModal();
            void executeSubmit(payload, COIButtonAction); // pageLoading starts inside executeSubmit
          },
          onCancel: () => {
            closeModal();
            void executeSubmit(payload, "NO"); // pageLoading starts inside executeSubmit
          },
        });
        return;
      }

      // Direct submit — no COI confirmation needed
      await executeSubmit(payload, COIButtonAction); // pageLoading starts inside executeSubmit
    },
    [executeSubmit],
  );

  return { submitting, pageLoading, submit, modalState, closeModal };
};
