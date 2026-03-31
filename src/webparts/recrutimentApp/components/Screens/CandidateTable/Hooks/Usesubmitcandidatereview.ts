import { useCallback, useRef, useState } from "react";
import { CandidateProfile } from "../../../../models/Icareerportal";
import {
  CandidateTable,
  MeetingSchedules,
} from "../../../../services/ServiceExport";
import {
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

export type DecisionType = "YES" | "NO" | "HOLD";

export interface ConflictOfInterestForm {
  consultedWith: string;
  attachment: IDocFiles[];
  comments: string;
}

export interface InterviewScheduleForm {
  panelMembers: string[];
  startDate: string;
  endDate: string;
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
  submit: (payload: SubmitPayload, COIButtonAction?: string) => Promise<void>;
  modalState: any;
  closeModal: () => void;
}

export const useSubmitCandidateReview = (
  onClose: () => void,
  handleRefresh: () => void,
): UseSubmitCandidateReviewReturn => {
  const { MatricID: matricID } = useUIState();
  const { roleIDs } = userInfo();
  const [submitting, setSubmitting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { modalState, showModal, closeModal } = useModalPopup();

  const splitDateOnly = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day)),
    ).toISOString();
  };

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
      const startDate = interviewLevel1?.startDate; //? interviewLevel1?.startDate.toISOString() : "";
      const endDate = interviewLevel1?.endDate; //? interviewLevel1?.startDate.toISOString() : "";

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
        // StatusId: StatusId.InterviewScheduled,
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

      // const startdate = StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview ?  ConvertUtc(interviewLevel1.startDate ?? new Date()) : ConvertUtc(interviewLevel2.startDate ?? new Date());
      // const enddate = StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview ?  ConvertUtc(interviewLevel1.endDate ?? new Date()) :  ConvertUtc(interviewLevel2.endDate ?? new Date());

      const meetingObj = {
        organizerEmail: organizer?.text ?? "",
        subject: `Interview for ${cp.FristName} ${cp.MiddleName} - ${recrutimentData?.JobTitleEnglish}`,
        startUtc: "", // startdate,
        endUtc: "", //enddate,
        location: "",
        requiredAttendees,
        optionalAttendees: [],
        rooms: [],
        categories: ["Internal", "Planning"],
        isOnlineMeeting: true,
      };

      return MeetingSchedules.createMeeting(meetingObj);
    },
    [MeetingSchedules],
  );

  // const buildInterviewObject = useCallback(
  //   (payload: SubmitPayload) => {
  //     const { stateValue, dateState, CandidateDetails: cp } = payload;

  //     const isLevel2Pending =
  //       stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
  //     const isScheduledL1 = stateValue?.StatusId === StatusId.InterviewScheduled;

  //     const startDateRaw = isLevel2Pending || !isScheduledL1 ? dateState?.startDateL2 : dateState?.startDateL1;
  //     const endDateRaw = isLevel2Pending || !isScheduledL1 ? dateState?.endDateL2 : dateState?.endDateL1;
  //     const roomKey = isLevel2Pending || !isScheduledL1 ? dateState.RoomDateL2?.key : dateState.RoomData?.key;

  //     const obj: any = {
  //       ID: Number(cp?.CandidateID),
  //       InterviewDate: splitDateOnly(startDateRaw ?? new Date()),
  //       InterviewTime: splitDateOnly(endDateRaw ?? new Date()),
  //       InterviewLink: String(roomKey ?? ""),
  //     };

  //     if (isLevel2Pending || !isScheduledL1) {
  //       obj.InterviewDateLevel2 = obj.InterviewDate;
  //       obj.InterviewTimeLevel2 = obj.InterviewTime;
  //       obj.InterviewLinkLevel2 = obj.InterviewLink;
  //     }

  //     if (isLevel2Pending &&  === config.TabName.AssignInterviewPanel) {
  //       obj.ActionId = WorkflowAction.Approved;
  //       obj.ItemCreated = Choices.Yes;
  //     }

  //     return obj;
  //   },
  //   [config]
  // );

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

        switch (decision) {
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
          candidateData = createFilter(workflowStatusApi.LineManagerL1Pending);
          popupMessage = RecuritmentHRMsg.HRReviewCandidate;
        }
      }

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
    [CandidateTable],
  );

  // const handleInterviewReschedule = useCallback(
  //   async (payload: SubmitPayload) => {
  //     const { interviewedLevel, CandidateDetails: cp } = payload;
  //     const { StatusId, InterviewLevels, RecuritmentHRMsg, HRMSAlertOptions, ListNames } = config;

  //     const interviewObj = buildInterviewObject(payload);
  //     const res = await CandidateTable.RescheduledInterview(interviewObj, ListNames.HRMSRecruitmentCandidatePersonalDetails);

  //     if (res.status !== 200) {
  //       callbacks.showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
  //       return;
  //     }

  //     if (stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
  //       const selectedPanel = interviewedLevel.AssignInterviewedLevel2.map((item: any) => ({
  //         RecruitmentIDId: stateValue?.RecruitmentID,
  //         InterviewLevel: InterviewLevels.Level2,
  //         InterviewPanel: item.key,
  //         CandidateID: Number(cp?.CandidateID),
  //       }));

  //       await CandidateTable.InsertInterviewPanel(selectedPanel, Number(cp?.CandidateID));
  //     }

  //     const msg =
  //       stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
  //         ? RecuritmentHRMsg.InterviewPanalLevel2
  //         : RecuritmentHRMsg.RescheduleSuccessMsg;

  //     callbacks.showAlert(msg, HRMSAlertOptions.Success);
  //   },
  //   [buildInterviewObject, config, CandidateTable, callbacks]
  // );

  const handleWorkflowProcess = useCallback(
    async (payload: SubmitPayload, COIButtonAction: string) => {
      const { candidateData, emailNot, popupMessage } = await buildWorkflowData(
        payload,
        COIButtonAction,
      );

      const { StatusId, interviewLevel1, interviewLevel2 } = payload;

      if (
        StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview
      ) {
        emailNot.templateCode = EmailTemplateCodes.InterviewSchedule;
        emailNot.dynamicFields = {
          InterviewDate: interviewLevel1?.startDate,
          InterviewTime: interviewLevel1?.startDate,
          // MeetingLink: String(dateState.RoomData?.key) ?? "",
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

      const res = await CandidateTable.UpdateCandidateStatus(candidateData);
      // const res = { status: 400 };
      if (res.status === 200) {
        if (
          StatusId === workflowStatusApi.LineManagerL2Pending ||
          StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview
        ) {
          if (emailNot.templateCode)
            await CandidateTable.SendEmailNotification(emailNot);
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

  const executeSubmit = useCallback(
    async (payload: SubmitPayload, COIButtonAction: string) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setSubmitting(true);
      try {
        const scheduleResponse =
          payload.StatusId ===
          workflowStatusApi.PendingRecruitmentHRscheduleInterview
            ? { status: 201 }
            : { status: 201 };
        await scheduleMeeting(payload);
        if (scheduleResponse?.status !== 201) return;

        // const isReschedulePath =
        //   (payload.stateValue.tab === "tab2" || payload.stateValue.tab === "tab3") &&
        //   payload.stateValue?.initialTab === TabName.AssignInterviewPanel;

        // if (isReschedulePath) {
        //   await handleInterviewReschedule(payload);
        //   return;
        // }

        await handleWorkflowProcess(payload, COIButtonAction);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Submit failed:", err);
        // callbacks.showAlert("Server is tempory unavailable", HRMSAlertOptions.Error);
      } finally {
        setSubmitting(false);
        // callbacks.setIsLoading(false);
      }
    },
    [scheduleMeeting, handleWorkflowProcess],
  );

  const submit = useCallback(
    async (payload: SubmitPayload, COIButtonAction: string = "") => {
      if (payload.COIFlag) {
        showModal({
          type: "confirmation",
          title: "Conflict Of Interest",
          message:
            "This is the COI profile. Are you sure you're ready to proceed?",
          confirmLabel: "Yes",
          cancelLabel: "No",
          onConfirm: () => {
            closeModal();
            void executeSubmit(payload, COIButtonAction);
          },
          onCancel: () => {
            closeModal();
            void executeSubmit(payload, "NO");
          },
        });
        return;
      }

      await executeSubmit(payload, COIButtonAction);
    },
    [scheduleMeeting, handleWorkflowProcess],
  );

  return { submitting, submit, modalState, closeModal };
};
