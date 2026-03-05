import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import IsValid from "../../../components/Validation";
import { ReviewProfileScore, TabName, RoleID, StatusId, workflowStatusApi, labelName, RecuritmentHRMsg, HRMSAlertOptions, InterviewLevels, WorkflowAction, Choices, COIWarningMsg, ResponeStatus } from "../../../utilities/Config";
import { ButtonAction, IsCandidateFit, ValidationAction, EmailTemplateCodes } from "../../../utilities/LabelName";
import { fetchInterviewPanelDetails, fetchRecruitmentRecord, fetchInterviewCandidateData, fetchLibraryDocuments, fetchCandidateProfile, fetchCOIAttachment, fetchAvailableRooms, fetchCOIProfileOptions, rescheduleInterview, submitCOIData, buildWorkflowData, uploadCandidateDetails, processWorkflow, scheduleCandidateMeeting } from "./Candidateservice";
import { ViewCandidateDetailsProps, CandidateProfileState, INITIAL_CANDIDATE_PROFILE, InterviewedLevelState, DateScheduleState, ActionValueState, ValidationErrorState, INITIAL_VALIDATION_ERRORS, AlertPropsData, AutoCompleteItem, IDocFile } from "./Candidatetypes";
import { addWeekdays, buildInterviewRescheduleObj, splitDateOnly } from "./Candidateutils";


export function useViewCandidateDetails(props: ViewCandidateDetailsProps) {
  const { stateValue, CurrentRoleID, EmployeeList, navigation } = props;

  // ─── Core state ──────────────────────────────────────────────────────────────
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfileState>(INITIAL_CANDIDATE_PROFILE);
  const [recruitmentData, setRecruitmentData] = useState<any[]>([]);
  const [interviewedLevel, setInterviewedLevel] = useState<InterviewedLevelState>({
    Levels: "",
    Grade: "",
    AssignInterviewedLevel1Option: [],
    AssignInterviewLevel1: [],
    AssignInterviewedLevel2: [],
    CandidateScoreValue: { key: 0, text: "" },
    CandidateScoreOption: ReviewProfileScore,
    COIProfileLabel: { key: 0, text: "" },
    COIProfileLabelOption: [],
    COIAttachment: [],
    COIComments: "",
    COIReason: "",
  });
  const [dateState, setDateState] = useState<DateScheduleState>({
    startDateL1: undefined,
    endDateL1: undefined,
    startDateL2: undefined,
    endDateL2: undefined,
    RoomData: { key: 0, text: "" },
    RoomDateL2: { key: 0, text: "" },
    RoomDataOption: [],
  });
  const [actionValue, setActionValue] = useState<ActionValueState>({ CandidateStatus: "", Comments: "" });
  const [validationErrors, setValidationErrors] = useState<ValidationErrorState>(INITIAL_VALIDATION_ERRORS);
  const [interviewPanel, setInterviewPanel] = useState<any[]>([]);

  // ─── UI state ────────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [signDate, setSignDate] = useState<Date>(new Date());
  const [submitBtn, setSubmitBtn] = useState("");
  const [level2Date, setLevel2Date] = useState(false);
  const [rescheduleValidation, setRescheduleValidation] = useState(false);
  const [mainComponent, setMainComponent] = useState(true);
  const [activeTab, setActiveTab] = useState("tab1");
  const [tabNameData, setTabNameData] = useState<{ tabName: string }[]>([]);
  const [alertPopupOpen, setAlertPopupOpen] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });

  // ─── Refs ────────────────────────────────────────────────────────────────────
  const storedNoOfInterviewPanel = useRef(false);

  // ─── Derived values ──────────────────────────────────────────────────────────
  const today = useMemo(() => new Date(), []);
  const minDateInterview = useMemo(() => addWeekdays(today, 5), [today]);
  const maxDateInterview = useMemo(() => addWeekdays(today, 130), [today]);

  const isAssignInterviewTab = useMemo(
    () => stateValue?.initialTab === TabName.AssignInterviewPanel,
    [stateValue?.initialTab],
  );

  const isReviewProfileTab = useMemo(
    () => stateValue?.initialTab === TabName.ReviewProfile,
    [stateValue?.initialTab],
  );

  const isViewMode = useMemo(
    () => stateValue?.ButtonAction === ButtonAction.View,
    [stateValue?.ButtonAction],
  );

  const isHR = useMemo(() => CurrentRoleID.includes(RoleID.RecruitmentHR), [CurrentRoleID]);
  const isLM = useMemo(() => CurrentRoleID.includes(RoleID.LineManager), [CurrentRoleID]);

  // ─── Alert helper ─────────────────────────────────────────────────────────────
  const showAlert = useCallback(
    (message: string, type: string, onOk?: () => void) => {
      setAlertProps({
        Message: message,
        Type: type,
        visible: true,
        ButtonAction: async (ok) => {
          if (ok && onOk) onOk();
          setAlertPopupOpen(false);
        },
      });
      setAlertPopupOpen(true);
    },
    [],
  );

  const navigateBack = useCallback(() => {
    const path = isHR
      ? "/ReviewProfileList/ReviewCandidateList"
      : "/RecurimentProcess/ReviewCandidateList";
    navigation(path, {
      state: {
        ID: stateValue?.RecruitmentID,
        TabNames: stateValue?.initialTab,
        ButtonAction: ButtonAction.View,
        JobCode: stateValue?.JobCode,
        tab: stateValue?.tabs,
        tabs: stateValue?.tab,
        JobCodeID: stateValue?.JobCodeID,
        CandidateTabName: stateValue?.TabNamed,
      },
    });
  }, [isHR, navigation, stateValue]);

  // ─── Load interview panel ─────────────────────────────────────────────────────
  const loadInterviewPanel = useCallback(async () => {
    const result = await fetchInterviewPanelDetails({
      recruitmentID: stateValue?.RecruitmentID,
      statusId: stateValue?.StatusId,
    });

    const isLevel2Status =
      stateValue?.StatusId ===
      StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;

    const panel = isLevel2Status ? result.level2Panel : result.level1Panel;
    const panelThreshold = panel.length < 3;
    storedNoOfInterviewPanel.current = !panelThreshold;
    setInterviewPanel(panel);

    setInterviewedLevel((prev) => ({
      ...prev,
      Grade: result.grade,
      Levels: result.level,
      AssignInterviewedLevel1Option: result.interviewPanel,
      AssignInterviewLevel1: result.level1Panel,
      AssignInterviewedLevel2: result.level2Panel,
    }));
  }, [stateValue?.RecruitmentID, stateValue?.StatusId]);

  // ─── Initial data fetch ───────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const recData = await fetchRecruitmentRecord(stateValue?.RecruitmentID);
        setRecruitmentData(recData);

        const isInterviewTab =
          (stateValue.tab === "tab2" || stateValue.tab === "tab3") &&
          isAssignInterviewTab;

        if (isInterviewTab) {
          // Fetch via interview services
          const interviewRes = await fetchInterviewCandidateData(stateValue?.ID, EmployeeList);
          if (interviewRes.status === 200 && interviewRes.data) {
            const op = interviewRes.data[0];
            const { advertisement, roleProfile } = await fetchLibraryDocuments(op?.JobCode);

            setCandidateProfile((prev) => ({
              ...prev,
              CandidateID: op?.ID,
              profileID: op?.ProfileID,
              JobCode: op?.JobCode,
              JobTitle: op?.PositionTitle,
              ApplicantName: op?.FullName,
              ApplicantSurName: op?.LastName,
              Nationality: op?.Nationality,
              FristName: op?.FristName,
              MiddleName: op?.MiddleName,
              ResidentialAddress: op?.ResidentialAddress,
              DOB: op?.DOB,
              ContactNumber: op?.ContactNumber,
              Email: op?.Email,
              Gender: op?.Gender,
              HighestQualification: op?.Qualification,
              ExperienceMining: op?.TotalYearOfExperiance,
              ExperRelatedfield: op?.ReleventExperience,
              CandidateResume: op?.CandidateCVDoc,
              RoleProfile: roleProfile,
              Advertisement: advertisement,
              Status: op?.Status,
              Agencies: op?.ExternalAgentDetails?.AgentName,
              ConflictsOfInterest: op?.ConflictsOfInterest,
              disability: op?.disability,
              disabilityReason: op?.disabilityReason,
              FamilyLink: op?.FamilyLink,
              BusinessLink: op?.BusinessLink,
              GPA: op?.GPA,
            }));

            setInterviewedLevel((prev) => ({
              ...prev,
              COIComments: op?.COIComments,
              COIProfileLabel: { key: 1, text: op?.COIAppreve },
            }));

            setDateState((prev) => ({
              ...prev,
              startDateL1: new Date(op?.InterviewDate),
              endDateL1: new Date(op?.InterviewTime),
            }));

            if (
              stateValue?.initialTab === TabName.AssignInterviewPanel &&
              stateValue?.StatusId === StatusId.InterviewScheduledforLevel2
            ) {
              setDateState((prev) => ({
                ...prev,
                startDateL2: new Date(op?.InterviewDateLevel2),
                RoomDateL2: { key: 0, text: op?.InterviewLinkLevel2 },
              }));
            }
          }
        } else {
          // Fetch via portal service
          const profileData = await fetchCandidateProfile(stateValue?.ID, EmployeeList, recData[0]);
          if (profileData.length > 0) {
            const response = profileData[0];

            if (stateValue?.StatusId !== workflowStatusApi.HRPending) {
              const coiFiles = await fetchCOIAttachment(response.profileID);
              setInterviewedLevel((prev) => ({ ...prev, COIAttachment: coiFiles }));
            }

            setCandidateProfile((prev) => ({
              ...prev,
              ...response,
              Agencies: response.Agencies || labelName.Candidate,
            }));

            setInterviewedLevel((prev) => ({
              ...prev,
              COIReason: response.COIReason || "",
              ...(stateValue?.StatusId !== workflowStatusApi.HRPending
                ? {
                    COIComments: response.COIComments || "",
                    COIProfileLabel: { key: 1, text: response.COIAppreve || "" },
                  }
                : {}),
            }));

            // Set initial on-hold or rejected status
            const { workflowStatusId } = response;
            if (
              workflowStatusId === workflowStatusApi.HROnHold ||
              workflowStatusId === workflowStatusApi.LineManagerLevel1OnHold ||
              workflowStatusId === workflowStatusApi.LineManagerLevel2OnHold
            ) {
              setActionValue((prev) => ({ ...prev, CandidateStatus: IsCandidateFit.OnHold }));
            }
            if (
              (isViewMode && workflowStatusId === workflowStatusApi.HRRejected) ||
              workflowStatusId === workflowStatusApi.LineManagerLevel1Rejected ||
              workflowStatusId === workflowStatusApi.LineManagerLevel2Rejected
            ) {
              setActionValue((prev) => ({ ...prev, CandidateStatus: IsCandidateFit.No }));
            }

            const candidateScore = ReviewProfileScore.find((item) => item.text === response.hrComments);
            if (candidateScore) {
              setInterviewedLevel((prev) => ({ ...prev, CandidateScoreValue: candidateScore }));
            }
          } else {
            showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error, navigateBack);
          }
        }

        if (isAssignInterviewTab) {
          await loadInterviewPanel();
          const rooms = await fetchAvailableRooms();
          setDateState((prev) => ({ ...prev, RoomDataOption: rooms }));
        } else {
          const coiOptions = await fetchCOIProfileOptions(recData[0]);
          setInterviewedLevel((prev) => ({ ...prev, COIProfileLabelOption: coiOptions }));
        }
      } catch (error) {
        console.error("Failed to fetch candidate data:", error);
        showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error, navigateBack);
      } finally {
        setIsLoading(false);
      }
    }

    const now = new Date();
    setSignDate(new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()));
    setTabNameData([
      { tabName: stateValue?.initialTab },
      { tabName: TabName.ViewCandidateList },
      { tabName: TabName.ViewCandidateDetails },
    ]);
    setLevel2Date(
      isAssignInterviewTab &&
        (stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
          stateValue?.StatusId === StatusId.InterviewScheduledforLevel2),
    );
    setSubmitBtn(
      isAssignInterviewTab
        ? stateValue?.StatusId === StatusId.InterviewScheduledforLevel2 ||
          stateValue?.StatusId === StatusId.InterviewScheduled
          ? ButtonAction.Reschedule
          : ButtonAction.ScheduleforInterview
        : ButtonAction.Submit,
    );

    void init();
  }, []);

  // ─── Form handlers ────────────────────────────────────────────────────────────

  const handleRadioChange = useCallback((item: string) => {
    setActionValue((prev) => ({ ...prev, CandidateStatus: item }));
    setValidationErrors((prev) => ({ ...prev, CandidateStatus: false }));
    setSubmitBtn(item === IsCandidateFit.No ? ButtonAction.Reject : ButtonAction.Submit);
  }, []);

  const handleCommentsChange = useCallback((value: string) => {
    setActionValue((prev) => ({ ...prev, Comments: value }));
    setValidationErrors((prev) => ({ ...prev, Comments: false }));
  }, []);

  const handleDateChange = useCallback((start: Date, end: Date, level: string) => {
    if (!start || !end) return;
    if (level === InterviewLevels.Level1) {
      setDateState((prev) => ({ ...prev, startDateL1: start, endDateL1: end }));
      setValidationErrors((prev) => ({ ...prev, startDateL1: false, endDateL1: false }));
    } else {
      setDateState((prev) => ({ ...prev, startDateL2: start, endDateL2: end }));
      setValidationErrors((prev) => ({ ...prev, startDateL2: false, endDateL2: false }));
    }
  }, []);

  const handleMultiSelect = useCallback((value: AutoCompleteItem[]) => {
    setInterviewedLevel((prev) => ({ ...prev, AssignInterviewLevel1: value }));
    setValidationErrors((prev) => ({ ...prev, AssignInterviewLevel1: false }));
  }, []);

  const handleAutoComplete = useCallback((value: AutoCompleteItem | null, field: string) => {
    setInterviewedLevel((prev) => ({ ...prev, [field]: value ?? { key: 0, text: "" } }));
    setValidationErrors((prev) => ({ ...prev, [field]: false }));
  }, []);

  const handleDocument = useCallback((stateKey: string, value: IDocFile[]) => {
    setInterviewedLevel((prev) => ({ ...prev, [stateKey]: value }));
    setValidationErrors((prev) => ({ ...prev, [stateKey]: false }));
  }, []);

  const handleDelete = useCallback((index: number, attachmentType: string) => {
    setInterviewedLevel((prev) => {
      const current = prev[attachmentType as keyof InterviewedLevelState];
      const updated = Array.isArray(current) ? [...current] : [];
      updated.splice(index, 1);
      return { ...prev, [attachmentType]: updated };
    });
  }, []);

  const handleCOICommentsChange = useCallback((value: string) => {
    setInterviewedLevel((prev) => ({ ...prev, COIComments: value }));
    setValidationErrors((prev) => ({ ...prev, COIComments: false }));
  }, []);

  const handleCheckboxChange = useCallback((value: boolean) => {
    setCheckbox(value);
    setValidationErrors((prev) => ({ ...prev, Checkboxalidation: false }));
  }, []);

  // ─── Validation ───────────────────────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const errors: Partial<ValidationErrorState> = {};

    if (isHR) {
      if (isAssignInterviewTab) {
        errors.Comments = !IsValid(actionValue.Comments);
        errors.Checkboxalidation = !IsValid(checkbox);
        errors.startDateL1 = !IsValid(dateState.startDateL1);
        errors.endDateL1 = !IsValid(dateState.endDateL1);
        errors.AssignInterviewLevel1 = !IsValid(interviewedLevel.AssignInterviewLevel1?.[2]?.text ?? "");
        if (stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
          errors.startDateL2 = !IsValid(dateState.startDateL2);
          errors.endDateL2 = !IsValid(dateState.endDateL2);
        }
      } else {
        errors.Comments = !IsValid(actionValue.Comments);
        errors.Checkboxalidation = !IsValid(checkbox);
        errors.CandidateScoreValue = !IsValid(interviewedLevel.CandidateScoreValue?.text);
      }
    } else if (isLM) {
      errors.Comments = !IsValid(actionValue.Comments);
      errors.Checkboxalidation = !IsValid(checkbox);
      errors.CandidateStatus = !IsValid(actionValue.CandidateStatus);
    }

    if (stateValue?.StatusId === StatusId.InterviewScheduledforLevel2) {
      const d = dateState.startDateL2 ? new Date(dateState.startDateL2) : null;
      setRescheduleValidation(!!d && d <= today);
    }
    if (stateValue?.StatusId === StatusId.InterviewScheduled) {
      const d = dateState.startDateL1 ? new Date(dateState.startDateL1) : null;
      setRescheduleValidation(!!d && d <= today);
    }

    if (
      candidateProfile.ConflictsOfInterest === ValidationAction.Yes &&
      stateValue?.StatusId === workflowStatusApi.HRPending
    ) {
      errors.COIComments = !IsValid(interviewedLevel.COIComments);
      errors.COIProfileLabel = !IsValid(interviewedLevel.COIProfileLabel.text);
      errors.COIAttachment = !IsValid(interviewedLevel.COIAttachment);
    }

    setValidationErrors((prev) => ({ ...prev, ...errors }));
    return Object.values(errors).some(Boolean);
  }, [
    isHR, isLM, isAssignInterviewTab,
    actionValue, checkbox, dateState, interviewedLevel,
    stateValue?.StatusId, candidateProfile.ConflictsOfInterest, today,
  ]);

  // ─── Submit logic ─────────────────────────────────────────────────────────────

  const handleInterviewReschedule = useCallback(async () => {
    const isLevel2Pending =
      stateValue?.StatusId === StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
    const isScheduledL1 = stateValue?.StatusId === StatusId.InterviewScheduled;

    const obj = buildInterviewRescheduleObj({
      isLevel2Pending,
      isScheduledL1,
      candidateID: candidateProfile.CandidateID,
      startDateL1: dateState.startDateL1,
      endDateL1: dateState.endDateL1,
      startDateL2: dateState.startDateL2,
      endDateL2: dateState.endDateL2,
      roomDataKey: dateState.RoomData?.key,
      roomDateL2Key: dateState.RoomDateL2?.key,
      workflowApproved: WorkflowAction.Approved,
      isAssignInterview: isAssignInterviewTab,
      initialTab: stateValue?.initialTab,
      assignInterviewTab: TabName.AssignInterviewPanel,
      choicesYes: Choices.Yes,
    });

    const success = await rescheduleInterview(
      obj,
      interviewedLevel.AssignInterviewedLevel2,
      candidateProfile.CandidateID,
      stateValue?.RecruitmentID,
      isLevel2Pending,
    );

    if (!success) {
      showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
      return;
    }

    const msg = isLevel2Pending
      ? RecuritmentHRMsg.InterviewPanalLevel2
      : RecuritmentHRMsg.RescheduleSuccessMsg;

    showAlert(msg, HRMSAlertOptions.Success, navigateBack);
  }, [
    stateValue, candidateProfile, dateState, interviewedLevel,
    isAssignInterviewTab, showAlert, navigateBack,
  ]);

  const handleWorkflowProcess = useCallback(
    async (coiButtonAction: string) => {
      // Handle COI upload if needed
      if (
        candidateProfile.ConflictsOfInterest === ValidationAction.Yes &&
        stateValue?.StatusId === workflowStatusApi.HRPending
      ) {
        await submitCOIData({
          profileID: candidateProfile.profileID,
          COIProfileLabel: interviewedLevel.COIProfileLabel,
          COIComments: interviewedLevel.COIComments,
          COIAttachment: interviewedLevel.COIAttachment,
        });
      }

      const { candidateData, emailNot, popupMessage } = buildWorkflowData({
        statusId: stateValue?.StatusId,
        currentRoleID: CurrentRoleID,
        candidateStatus: actionValue.CandidateStatus,
        comments: actionValue.Comments,
        jobRequestId: stateValue?.ID,
        hrComments: candidateProfile.hrComments,
        candidateScoreText: interviewedLevel.CandidateScoreValue.text,
        isAssignInterview: isAssignInterviewTab,
        workflowStatusId: candidateProfile.workflowStatusId,
        interviewLevel: interviewedLevel.Levels,
        coiButtonAction,
      });

      // Inject dynamic email fields for interview scheduling
      if (stateValue?.StatusId === workflowStatusApi.PendingRecruitmentHRscheduleInterview) {
        emailNot.templateCode = EmailTemplateCodes.InterviewSchedule;
        emailNot.dynamicFields = {
          InterviewDate: splitDateOnly(dateState.startDateL1 ?? new Date()),
          InterviewTime: splitDateOnly(dateState.endDateL1 ?? new Date()),
          MeetingLink: String(dateState.RoomData?.key) ?? "",
          InterviewLevel: interviewedLevel.Levels,
        };
      }

      // Upload candidate details if assigning interview panel
      if (isAssignInterviewTab) {
        const uploadRes = await uploadCandidateDetails({
          candidateProfile,
          recruitmentData: recruitmentData[0],
          dateState,
          interviewLevel: interviewedLevel,
        });
        if (uploadRes.status !== ResponeStatus.SUCCESS) {
          showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
          return;
        }
      }

      const success = await processWorkflow({
        candidateData,
        emailNot,
        statusId: stateValue?.StatusId,
      });

      if (success) {
        showAlert(popupMessage, HRMSAlertOptions.Success, navigateBack);
      } else {
        showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
      }
    },
    [
      candidateProfile, interviewedLevel, actionValue,
      stateValue, CurrentRoleID, dateState,
      isAssignInterviewTab, recruitmentData, showAlert, navigateBack,
    ],
  );

  const submit = useCallback(
    async (coiButtonAction: string) => {
      setIsLoading(true);
      try {
        if (validate()) {
          showAlert(RecuritmentHRMsg.FormValidationMsg, HRMSAlertOptions.Error);
          return;
        }

        // Attempt meeting scheduling (non-blocking for now)
        await scheduleCandidateMeeting({
          interviewPanel,
          candidateProfile,
          recruitmentData,
          dateState,
        }).catch(console.warn);

        const isReschedule =
          (stateValue.tab === "tab2" || stateValue.tab === "tab3") && isAssignInterviewTab;

        if (isReschedule) {
          await handleInterviewReschedule();
        } else {
          await handleWorkflowProcess(coiButtonAction);
        }
      } catch (error) {
        console.error("Error submitting:", error);
        showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      validate, interviewPanel, candidateProfile, recruitmentData, dateState,
      stateValue, isAssignInterviewTab, handleInterviewReschedule,
      handleWorkflowProcess, showAlert,
    ],
  );

  const coiValidation = useCallback(async () => {
    if (validate()) {
      showAlert(RecuritmentHRMsg.FormValidationMsg, HRMSAlertOptions.Error);
      return;
    }

    if (
      candidateProfile.ConflictsOfInterest === ValidationAction.Yes &&
      isReviewProfileTab
    ) {
      setAlertProps({
        Message: COIWarningMsg,
        Type: HRMSAlertOptions.Confirmation,
        visible: true,
        ButtonLebel: ValidationAction.Yes,
        IsCloseIcon: true,
        ButtonAction: async (ok) => {
          setAlertPopupOpen(false);
          if (ok) {
            await submit(ButtonAction.Approve);
          } else {
            setActionValue((prev) => ({ ...prev, CandidateStatus: IsCandidateFit.No }));
            await submit(ButtonAction.Reject);
          }
        },
      });
      setAlertPopupOpen(true);
    } else {
      await submit(ButtonAction.Remove);
    }
  }, [validate, candidateProfile.ConflictsOfInterest, isReviewProfileTab, submit, showAlert]);

  const handleCancel = useCallback(() => {
    setAlertProps({
      Message: RecuritmentHRMsg.RecuritmentHRMsgCancel,
      Type: HRMSAlertOptions.Confirmation,
      visible: true,
      ButtonAction: async (ok) => {
        if (ok) navigateBack();
        setAlertPopupOpen(false);
      },
    });
    setAlertPopupOpen(true);
  }, [navigateBack]);

  // ─── Additional buttons builder ────────────────────────────────────────────────
  const getAdditionalButtons = useCallback(() => {
    if (isViewMode) {
      return [{ label: ButtonAction.Back, onClick: async () => navigateBack() }];
    }
    if (actionValue.CandidateStatus === IsCandidateFit.No) {
      return [{ label: ButtonAction.Reject, onClick: async () => submit(ButtonAction.Remove) }];
    }
    if (actionValue.CandidateStatus === IsCandidateFit.OnHold) {
      return [{ label: ButtonAction.OnHold, onClick: async () => submit(ButtonAction.OnHold) }];
    }
    return [{ label: submitBtn, onClick: async () => coiValidation() }];
  }, [isViewMode, actionValue.CandidateStatus, submitBtn, navigateBack, submit, coiValidation]);

  return {
    // State
    candidateProfile,
    recruitmentData,
    interviewedLevel,
    dateState,
    actionValue,
    validationErrors,
    interviewPanel,
    isLoading,
    checkbox,
    signDate,
    submitBtn,
    level2Date,
    rescheduleValidation,
    mainComponent,
    activeTab,
    tabNameData,
    alertPopupOpen,
    alertProps,
    storedNoOfInterviewPanel,

    // Derived
    minDateInterview,
    maxDateInterview,
    isAssignInterviewTab,
    isReviewProfileTab,
    isViewMode,
    isHR,
    isLM,

    // Setters
    setMainComponent,
    setActiveTab,
    setAlertPopupOpen,

    // Handlers
    handleRadioChange,
    handleCommentsChange,
    handleDateChange,
    handleMultiSelect,
    handleAutoComplete,
    handleDocument,
    handleDelete,
    handleCOICommentsChange,
    handleCheckboxChange,
    getAdditionalButtons,
    handleCancel,
    navigateBack,
  };
}