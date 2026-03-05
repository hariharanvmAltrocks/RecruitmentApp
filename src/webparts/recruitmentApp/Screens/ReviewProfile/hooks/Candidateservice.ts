import { GetWorkflowStatusByID } from "../../../components/TabMerge";
import { COIType, WorkflowJson, sendEmail } from "../../../Models/ApIInterface";
import { ICreateMeeting } from "../../../Services/AxiosService/axiosConfig";
import { fetchRooms } from "../../../Services/AxiosService/TeamsMeetingApi/fetchRooms";
import { createMeeting } from "../../../Services/AxiosService/TeamsMeetingApi/scheduleMeeting";
import { COIAttach, CandidateDetails } from "../../../Services/CareerPortalApi/IGetPortalJobs";
import { CommonServices, GetPortalJobsService, getVRRDetails, InterviewServices } from "../../../Services/ServiceExport";
import { DocumentFolderName, DocumentLibraray, RoleProfileMaster, InterviewLevels, workflowStatusApi, RoleName, ListNames, RoleID, WorkflowAction } from "../../../utilities/Config";
import { ButtonAction, IsCandidateFit, EmailTemplateCodes } from "../../../utilities/LabelName";
import { IDocFile, AutoCompleteItem, CandidateProfileState, DateScheduleState, InterviewedLevelState } from "./Candidatetypes";
import { splitDateOnly, convertUtc } from "./Candidateutils";

export async function fetchCandidateProfile(
  id: string,
  employeeList: any[],
  recruitmentData: any,
): Promise<any[]> {
  const res = await GetPortalJobsService.getCandidateProfile(id, employeeList, recruitmentData);
  return res.data ?? [];
}

export async function fetchCOIAttachment(profileID: number): Promise<IDocFile[]> {
  const obj: COIAttach = {
    RequestID: String(profileID),
    DocumentName: DocumentFolderName.COIAttach,
  };
  const res = await GetPortalJobsService.fetchCOIAttachment(obj);
  return res.data ?? [];
}

export async function fetchRecruitmentRecord(recruitmentID: number) {
  const filter = [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }];
  const res = await getVRRDetails.GetRecruitmentDetails(filter, "");
  return res.data ?? [];
}

export async function fetchLibraryDocuments(jobCode: string) {
  const [advertisementRes, roleProfileRes] = await Promise.all([
    CommonServices.GetAttachmentToLibrary(
      DocumentLibraray.RecruitmentAdvertisementDocument,
      jobCode,
    ),
    CommonServices.GetAttachmentToLibrary(
      DocumentLibraray.RoleProfileMaster,
      jobCode,
      RoleProfileMaster.RoleProfile,
    ),
  ]);

  const advertisement =
    advertisementRes.status === 200
      ? (advertisementRes.data ?? []).map((doc: any) => ({ name: doc.name, content: doc.content }))
      : [];

  const roleProfile =
    roleProfileRes.status === 200
      ? (roleProfileRes.data ?? []).map((doc: any) => ({ name: doc.name, content: doc.content }))
      : [];

  return { advertisement, roleProfile };
}

export async function fetchInterviewCandidateData(
  id: number,
  employeeList: any[],
) {
  const filter = [{ FilterKey: "ID", Operator: "eq", FilterValue: id }];
  return InterviewServices.GetCombinedCandidatePositionDetails(filter, "", employeeList);
}

export async function fetchInterviewPanelDetails(params: {
  recruitmentID: number;
  statusId: number;
}) {
  const { recruitmentID, statusId } = params;
  const filter = [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }];
  const recruitmentRes = await getVRRDetails.GetRecruitmentDetails(filter, "");
  const record = recruitmentRes.data[0];

  const [gradelevel, assignHRID] = await Promise.all([
    CommonServices.GetGradeLevel(record?.PatersonGrade),
    CommonServices.getUserGuidByEmail(record?.AssignEMail),
  ]);

  const AssignHR = {
    key: Number(assignHRID.data?.key),
    text: record?.AssignEMail,
  } as const;

  const levels =
    gradelevel.data[0]?.Level === InterviewLevels.Level1
      ? [InterviewLevels.Level1]
      : [InterviewLevels.Level1, InterviewLevels.Level2];

  const jdeFilter = [{ FilterKey: "BUCId", Operator: "eq", FilterValue: record?.BusinessUnitCodeId }];
  const panelRes = await getVRRDetails.GetInterviewPanelDetails(
    jdeFilter,
    "",
    AssignHR,
    params.recruitmentID,
    levels,
    statusId,
  );

  return {
    grade: record?.PatersonGrade,
    level: gradelevel.data[0]?.Level,
    interviewPanel: panelRes.data?.InterviewPanel ?? [],
    level1Panel: panelRes.data?.Level1Panel ?? [],
    level2Panel: panelRes.data?.Level2Panel ?? [],
  };
}

/** Fetch available meeting rooms */
export async function fetchAvailableRooms(): Promise<AutoCompleteItem[]> {
  const res = await fetchRooms();
  return (res.data ?? []).map((item: any) => ({
    key: Number(item.RoomEmailId),
    text: item.RoomName,
  }));
}

/** Fetch COI profile options */
export async function fetchCOIProfileOptions(recruitmentData: any): Promise<AutoCompleteItem[]> {
  const res = await GetPortalJobsService.GetCOIProfileOption(recruitmentData);
  return res.data ?? [];
}

/** Upload candidate details and selected interview panel */
export async function uploadCandidateDetails(params: {
  candidateProfile: CandidateProfileState;
  recruitmentData: any;
  dateState: DateScheduleState;
  interviewLevel: InterviewedLevelState;
}) {
  const { candidateProfile, recruitmentData, dateState, interviewLevel } = params;

  const DOBValue = candidateProfile.DOB ? new Date(candidateProfile.DOB) : new Date();
  const DOBData = splitDateOnly(DOBValue);
  const StartDate = dateState.startDateL1?.toISOString() ?? "";
  const EndDate = dateState.endDateL1?.toISOString() ?? "";

  const candidateDetails: CandidateDetails = {
    RecruitmentIDId: recruitmentData?.ID,
    JobCodeId: recruitmentData?.JobCodeId,
    FristName: candidateProfile.FristName,
    MiddleName: candidateProfile.MiddleName,
    LastName: candidateProfile.ApplicantSurName,
    ResidentialAddress: candidateProfile.ResidentialAddress,
    DOB: DOBData,
    ContactNumber: candidateProfile.ContactNumber,
    Email: candidateProfile.Email,
    Nationality: candidateProfile.Nationality,
    Gender: candidateProfile.Gender,
    TotalYearOfExperiance: String(candidateProfile.ExperienceMining),
    ReleventExperience: String(candidateProfile.ExperRelatedfield),
    Qualification: candidateProfile.HighestQualification,
    JobRequestID: String(candidateProfile.CandidateID),
    ProfileID: String(candidateProfile.profileID),
    PositionTitle: recruitmentData?.JobTitleEnglish,
    JobGrade: recruitmentData?.DRCGrade,
    ExternalAgentDetails: candidateProfile.Agencies,
    InterviewDate: StartDate,
    InterviewTime: EndDate,
    CandidateResumeLink: candidateProfile.CandidateResumeLink ?? "",
    ActionId: WorkflowAction.Approved,
    ConflictsOfInterest: candidateProfile.ConflictsOfInterest,
    Disability: candidateProfile.disability,
    DisabilityDetails: candidateProfile.disabilityReason,
    IdentityNumber: candidateProfile.identityValue,
    ProofOfIdentity: candidateProfile.identityType,
    LastOrCurrentPosition: candidateProfile.CurrentPosition,
    LastOrCurrentEmployer: candidateProfile.CurrentEmployer,
    PreviouslyWorkedInIvanhoeMines: candidateProfile.previouslyworkedMine ?? "",
    NumberOfTaxDependents: Number(candidateProfile.NumberOftax),
    Age: Number(candidateProfile.Age),
    AnyFamilyorOtherLinks: candidateProfile.familylinks,
    AnyBusinessLinksToDeclare: candidateProfile.businesslinks,
    WillingToRelocate: candidateProfile.WillingToRelocate,
    CountryofOrgin: candidateProfile.CountryofOrgin,
    Citizenship: candidateProfile.Citizenship,
    FamilyLink: candidateProfile.FamilyLink,
    BusinessLink: candidateProfile.BusinessLink,
    GPA: candidateProfile.GPA,
    OthersInterviewed: "",
    COIEmail: String(interviewLevel.COIProfileLabel.text),
    COIComments: interviewLevel.COIComments,
    COIReason: interviewLevel.COIReason,
    countryOfResidency: candidateProfile.countryOfResidency,
    ResidencyStatus: candidateProfile.residentStatus,
    MaritalStatus: candidateProfile.maritalStatus,
    ChildrenDetails: JSON.stringify(candidateProfile.childrenDetails),
    ReferenceEmployeeDetails: JSON.stringify([candidateProfile.employeeReferenceDetails || {}]),
    hasIvanhoeZijinExperience: candidateProfile.hasIvanhoeZijinExperience,
    OperationRoleRegion: JSON.stringify([candidateProfile.companyDetails || {}]),
    NationalityCode: candidateProfile.NatioCode ?? "",
    LanguageKnown: JSON.stringify(candidateProfile.LanguageKnown),
    InterviewLink: "",
  };

  const selectedPanel = interviewLevel.AssignInterviewLevel1.map((item) => ({
    RecruitmentIDId: recruitmentData?.ID,
    InterviewLevel: InterviewLevels.Level1,
    InterviewPanel: item.key,
    CandidateID: 0,
  }));

  return GetPortalJobsService.InsertCandidateDetailsInList(candidateDetails, selectedPanel);
}

/** Create a Teams/calendar meeting for the interview */
export async function scheduleCandidateMeeting(params: {
  interviewPanel: any[];
  candidateProfile: CandidateProfileState;
  recruitmentData: any;
  dateState: DateScheduleState;
}): Promise<any> {
  const { interviewPanel, candidateProfile, recruitmentData, dateState } = params;

  const organizer = interviewPanel.find((item: any) => item.Role === RoleName.RecruitmentHR);
  const requiredAttendees = interviewPanel.map((item: any) => item.Email) as string[];

  const obj: ICreateMeeting = {
    organizerEmail: organizer?.Email ?? "",
    subject: `Interview for ${candidateProfile.FristName} ${candidateProfile.MiddleName} - ${recruitmentData?.[0]?.JobTitleEnglish}`,
    startUtc: convertUtc(dateState.startDateL1 ?? new Date()),
    endUtc: convertUtc(dateState.endDateL1 ?? new Date()),
    location: dateState.RoomData?.text ?? "",
    requiredAttendees,
    optionalAttendees: [],
    rooms: [String(dateState.RoomData?.key)],
    categories: ["Internal", "Planning"],
    isOnlineMeeting: true,
  };

  return createMeeting(obj);
}

/** Upload COI attachment and upsert COI record */
export async function submitCOIData(params: {
  profileID: number;
  COIProfileLabel: AutoCompleteItem;
  COIComments: string;
  COIAttachment: IDocFile[];
}): Promise<void> {
  const { profileID, COIProfileLabel, COIComments, COIAttachment } = params;

  let attachmentPath = "";
  if (COIAttachment.length > 0) {
    const validAttachments = COIAttachment.filter((file): file is IDocFile & { type: string } => file.type !== undefined);
    if (validAttachments.length > 0) {
      const uploadRes = await GetPortalJobsService.UploadCOIAttachment(
        { RequestID: String(profileID), DocumentName: DocumentFolderName.COIAttach },
        validAttachments,
      );
      attachmentPath = String(uploadRes.data[0]?.content ?? "");
    }
  }

  const coiObj: COIType = {
    profileId: profileID,
    approver: COIProfileLabel.text,
    comments: COIComments,
    attachmentPath,
  };

  await GetPortalJobsService.GetUpsertCOI(coiObj);
}

/** Build and execute the workflow update + optional email notification */
export async function processWorkflow(params: {
  candidateData: WorkflowJson;
  emailNot: sendEmail;
  statusId: number;
}): Promise<boolean> {
  const { candidateData, emailNot, statusId } = params;

  const res = await GetPortalJobsService.UpdateCandidateStatus(candidateData);
  if (res.status !== 200) return false;

  const shouldSendEmail =
    String(statusId) === workflowStatusApi.LineManagerL2Pending ||
    String(statusId) === workflowStatusApi.PendingRecruitmentHRscheduleInterview;

  if (shouldSendEmail && emailNot.templateCode) {
    await GetPortalJobsService.SendEmailNotification(emailNot);
  }

  return true;
}

/** Reschedule interview */
export async function rescheduleInterview(
  obj: any,
  level2Panel: AutoCompleteItem[],
  candidateID: string,
  recruitmentID: number,
  isLevel2Pending: boolean,
): Promise<boolean> {
  const res = await GetPortalJobsService.RescheduledInterview(
    obj,
    ListNames.HRMSRecruitmentCandidatePersonalDetails,
  );

  if (res.status !== 200) return false;

  if (isLevel2Pending) {
    const selectedPanel = level2Panel.map((item: any) => ({
      RecruitmentIDId: recruitmentID,
      InterviewLevel: InterviewLevels.Level2,
      InterviewPanel: item.key,
      CandidateID: Number(candidateID),
    }));
    await GetPortalJobsService.InsertInterviewPanel(selectedPanel, Number(candidateID));
  }

  return true;
}

export function buildWorkflowData(params: {
  statusId: string;
  currentRoleID: number[];
  candidateStatus: string;
  comments: string;
  jobRequestId: number;
  hrComments: string;
  candidateScoreText: string;
  isAssignInterview: boolean;
  workflowStatusId: string | number;
  interviewLevel: string;
  coiButtonAction: string;
}): { candidateData: WorkflowJson; emailNot: sendEmail; popupMessage: string } {
  const {
    statusId, currentRoleID, candidateStatus, comments, jobRequestId,
    hrComments, candidateScoreText, isAssignInterview, workflowStatusId,
    interviewLevel, coiButtonAction,
  } = params;

  const actionBy = GetWorkflowStatusByID(statusId);
  const isLineManager = currentRoleID.includes(RoleID.LineManager);
  const isHR = currentRoleID.includes(RoleID.RecruitmentHR);

  const createFilter = (workflowStatus: string): WorkflowJson => ({
    workflowStatus,
    jobRequestId,
    comments,
    actionBy,
    hrComments: isHR ? (candidateScoreText ?? "") : hrComments,
  });

  let candidateData: WorkflowJson = { workflowStatus: "", jobRequestId: 0, comments: "", actionBy: "", hrComments: "" };
  let emailNot: sendEmail = { jobRequestId, templateCode: "" };
  let popupMessage = "";

  if (isLineManager) {
    const value = coiButtonAction === ButtonAction.Reject ? IsCandidateFit.No : candidateStatus;
    const isLevel2 =
      workflowStatusId === workflowStatusApi.LineManagerL2Pending ||
      workflowStatusId === workflowStatusApi.LineManagerLevel2OnHold;

    if (value === IsCandidateFit.Yes) {
      candidateData = createFilter(isLevel2 ? workflowStatusApi.PendingRecruitmentHRscheduleInterview : workflowStatusApi.LineManagerL2Pending);
      if (isLevel2) emailNot.templateCode = EmailTemplateCodes.LineManagerEmail;
      popupMessage = "Profile reviewed successfully.";
    } else if (value === IsCandidateFit.No) {
      candidateData = createFilter(isLevel2 ? workflowStatusApi.LineManagerLevel2Rejected : workflowStatusApi.LineManagerLevel1Rejected);
      emailNot.templateCode = EmailTemplateCodes.CandidateRejected;
      popupMessage = "Candidate rejected.";
    } else if (value === IsCandidateFit.OnHold) {
      candidateData = createFilter(isLevel2 ? workflowStatusApi.LineManagerLevel2OnHold : workflowStatusApi.LineManagerLevel1OnHold);
      popupMessage = "Candidate placed on hold.";
    }
  } else if (isHR) {
    if (isAssignInterview) {
      candidateData = createFilter(workflowStatusApi.InterviewScheduled);
      emailNot.templateCode = EmailTemplateCodes.InterviewSchedule;
      popupMessage = interviewLevel === InterviewLevels.Level2
        ? "Interview panel Level 1 assigned."
        : "Interview panel assigned successfully.";
    } else if (coiButtonAction === ButtonAction.Reject) {
      candidateData = createFilter(workflowStatusApi.HRRejected);
      emailNot.templateCode = EmailTemplateCodes.CandidateRejected;
      popupMessage = "Candidate rejected.";
    } else {
      candidateData = createFilter(workflowStatusApi.LineManagerL1Pending);
      popupMessage = "HR review completed.";
    }
  }

  return { candidateData, emailNot, popupMessage };
}