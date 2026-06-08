"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubmitCandidateReview = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var Config_1 = require("../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var useSubmitCandidateReview = function (onClose, handleRefresh) {
    var matricID = (0, UIStateContext_1.useUIState)().MatricID;
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var _a = (0, react_1.useState)(false), submitting = _a[0], setSubmitting = _a[1];
    var _b = (0, react_1.useState)(false), pageLoading = _b[0], setPageLoading = _b[1];
    var abortRef = (0, react_1.useRef)(null);
    var _c = (0, useModalPopup_1.useModalPopup)(), modalState = _c.modalState, showModal = _c.showModal, closeModal = _c.closeModal;
    // ─── Helpers ────────────────────────────────────────────────────────────────
    var splitDateOnly = function (date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var day = String(date.getDate()).padStart(2, "0");
        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).toISOString();
    };
    // ─── Upload Candidate Details ────────────────────────────────────────────────
    var uploadCandidateDetails = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var cp, recrutimentData, interviewLevel1, COIDetails, interviewPanelL1, dobValue, dobData, startDateTime, candidateDetails, selectedPanel;
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            cp = payload.CandidateDetails, recrutimentData = payload.recrutimentData, interviewLevel1 = payload.interviewLevel1, COIDetails = payload.COIDetails, interviewPanelL1 = payload.interviewPanelL1;
            if (!cp)
                throw new Error("CandidateDetails is null");
            dobValue = cp.DOB ? new Date(cp.DOB) : new Date();
            dobData = splitDateOnly(dobValue);
            startDateTime = (interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startDate) && (interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startTime)
                ? new Date("".concat(interviewLevel1.startDate, "T").concat(interviewLevel1.startTime, ":00")).toISOString()
                : "";
            candidateDetails = {
                RecruitmentIDId: recrutimentData === null || recrutimentData === void 0 ? void 0 : recrutimentData.ID,
                JobCodeId: recrutimentData === null || recrutimentData === void 0 ? void 0 : recrutimentData.JobCodeId,
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
                PositionTitle: recrutimentData === null || recrutimentData === void 0 ? void 0 : recrutimentData.JobTitleEnglish,
                JobGrade: recrutimentData === null || recrutimentData === void 0 ? void 0 : recrutimentData.DRCGrade,
                ExternalAgentDetails: cp.Agencies,
                InterviewDate: startDateTime,
                InterviewTime: interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startTime,
                CandidateResumeLink: (_a = cp.CandidateResumeLink) !== null && _a !== void 0 ? _a : "",
                ActionId: Config_1.WorkflowAction.Approved,
                ConflictsOfInterest: cp.ConflictsOfInterest,
                Disability: cp.disability,
                DisabilityDetails: cp.disabilityReason,
                IdentityNumber: cp.identityValue,
                ProofOfIdentity: cp.identityType,
                LastOrCurrentPosition: cp.CurrentPosition,
                LastOrCurrentEmployer: cp.CurrentEmployer,
                PreviouslyWorkedInIvanhoeMines: (_b = cp.previouslyworkedMine) !== null && _b !== void 0 ? _b : "",
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
                    (cp === null || cp === void 0 ? void 0 : cp.employeeReferenceDetails) || {},
                ]),
                hasIvanhoeZijinExperience: cp === null || cp === void 0 ? void 0 : cp.hasIvanhoeZijinExperience,
                OperationRoleRegion: JSON.stringify([(cp === null || cp === void 0 ? void 0 : cp.companyDetails) || {}]),
                NationalityCode: (cp === null || cp === void 0 ? void 0 : cp.NatioCode) || "",
                LanguageKnown: JSON.stringify(cp === null || cp === void 0 ? void 0 : cp.LanguageKnown),
                InterviewLink: interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.endTime,
            };
            selectedPanel = interviewPanelL1.map(function (item) { return ({
                RecruitmentIDId: recrutimentData === null || recrutimentData === void 0 ? void 0 : recrutimentData.ID,
                InterviewLevel: ConditionConfig_1.InterviewLevels.Level1,
                InterviewPanel: item.key,
                CandidateID: 0,
            }); });
            return [2 /*return*/, ServiceExport_1.CandidateTable.InsertCandidateDetailsInList(candidateDetails, selectedPanel)];
        });
    }); }, [ServiceExport_1.CandidateTable]);
    // ─── Schedule Meeting ────────────────────────────────────────────────────────
    var scheduleMeeting = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var cp, recrutimentData, interviewLevel1, interviewLevel2, StatusId, interviewPanelL1, organizer, requiredAttendees, startDateL1, endDateTimeL1, startDateL2, endDateTimeL2, startdate, enddate, optionalAttendeeL1, optionalAttendeeL2, meetingObj;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            cp = payload.CandidateDetails, recrutimentData = payload.recrutimentData, interviewLevel1 = payload.interviewLevel1, interviewLevel2 = payload.interviewLevel2, StatusId = payload.StatusId, interviewPanelL1 = payload.interviewPanelL1;
            if (!cp)
                throw new Error("CandidateDetails is null");
            organizer = interviewPanelL1.find(function (i) { return i.Role === ConditionConfig_1.RoleName.RecruitmentHR; });
            requiredAttendees = interviewPanelL1.map(function (i) { return i.Email; });
            startDateL1 = (interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startDate) && (interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startTime)
                ? new Date("".concat(interviewLevel1.startDate, "T").concat(interviewLevel1.startTime, ":00")).toISOString()
                : "";
            endDateTimeL1 = (interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startDate) && (interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.endTime)
                ? new Date("".concat(interviewLevel1.startDate, "T").concat(interviewLevel1.endTime, ":00")).toISOString()
                : "";
            startDateL2 = (interviewLevel2 === null || interviewLevel2 === void 0 ? void 0 : interviewLevel2.startDate) && (interviewLevel2 === null || interviewLevel2 === void 0 ? void 0 : interviewLevel2.startTime)
                ? new Date("".concat(interviewLevel2.startDate, "T").concat(interviewLevel2.startTime, ":00")).toISOString()
                : "";
            endDateTimeL2 = (interviewLevel2 === null || interviewLevel2 === void 0 ? void 0 : interviewLevel2.startDate) && (interviewLevel2 === null || interviewLevel2 === void 0 ? void 0 : interviewLevel2.endTime)
                ? new Date("".concat(interviewLevel2.startDate, "T").concat(interviewLevel2.endTime, ":00")).toISOString()
                : "";
            startdate = StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview
                ? startDateL1
                : startDateL2;
            enddate = StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview
                ? endDateTimeL1
                : endDateTimeL2;
            optionalAttendeeL1 = payload.interviewPanelL1.map(function (i) { return i.text; });
            optionalAttendeeL2 = payload.interviewPanelL2.map(function (i) { return i.text; });
            meetingObj = {
                organizerEmail: (_a = organizer === null || organizer === void 0 ? void 0 : organizer.text) !== null && _a !== void 0 ? _a : "",
                subject: "Interview for ".concat(cp.FristName, " ").concat(cp.MiddleName, " - ").concat(recrutimentData === null || recrutimentData === void 0 ? void 0 : recrutimentData.JobTitleEnglish),
                startUtc: startdate !== null && startdate !== void 0 ? startdate : "",
                endUtc: enddate !== null && enddate !== void 0 ? enddate : "",
                location: "",
                requiredAttendees: requiredAttendees,
                optionalAttendees: StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview
                    ? optionalAttendeeL1
                    : optionalAttendeeL2,
                rooms: [],
                categories: ["Internal", "Planning"],
                isOnlineMeeting: true,
            };
            return [2 /*return*/, ServiceExport_1.MeetingSchedules.createMeeting(meetingObj)];
        });
    }); }, [ServiceExport_1.MeetingSchedules]);
    // ─── Build Workflow Data ─────────────────────────────────────────────────────
    var buildWorkflowData = (0, react_1.useCallback)(function (payload, COIButtonAction) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var COIDetails, cp, candidateId, decisionComments, decision, HRReviewComents, COIFlag, StatusId, currentUserRole, createFilter, candidateData, emailNot, popupMessage, isLineManager, isAssignInterview, isLevel2, attachmentPath, docResponse;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    COIDetails = payload.COIDetails, cp = payload.CandidateDetails, candidateId = payload.candidateId, decisionComments = payload.decisionComments, decision = payload.decision, HRReviewComents = payload.HRReviewComents, COIFlag = payload.COIFlag, StatusId = payload.StatusId;
                    currentUserRole = roleIDs.includes(Config_1.RoleID.RecruitmentHR)
                        ? ConditionConfig_1.RoleName.RecruitmentHR
                        : ConditionConfig_1.RoleName.LineManager;
                    createFilter = function (workflowStatus) { return ({
                        workflowStatus: workflowStatus,
                        jobRequestId: candidateId,
                        comments: decisionComments,
                        actionBy: currentUserRole,
                        hrComments: HRReviewComents,
                    }); };
                    candidateData = {
                        workflowStatus: "",
                        jobRequestId: 0,
                        comments: "",
                        actionBy: "",
                        hrComments: "",
                    };
                    emailNot = { jobRequestId: candidateId, templateCode: "" };
                    popupMessage = "";
                    isLineManager = roleIDs.includes(Config_1.RoleID.LineManager);
                    isAssignInterview = matricID === ConditionConfig_1.MatricID.AssignInterviewPanel;
                    if (isLineManager) {
                        isLevel2 = String(StatusId) === Config_1.workflowStatusApi.LineManagerL2Pending ||
                            String(StatusId) === Config_1.workflowStatusApi.LineManagerLevel2OnHold;
                        switch (COIButtonAction) {
                            case "YES":
                                candidateData = createFilter(isLevel2
                                    ? Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview
                                    : Config_1.workflowStatusApi.LineManagerL2Pending);
                                if (isLevel2)
                                    emailNot.templateCode = ConditionConfig_1.EmailTemplateCodes.LineManagerEmail;
                                popupMessage = ConditionConfig_1.RecuritmentHRMsg.ProfileReviewed;
                                break;
                            case "NO":
                                candidateData = createFilter(isLevel2
                                    ? Config_1.workflowStatusApi.LineManagerLevel2Rejected
                                    : Config_1.workflowStatusApi.LineManagerLevel1Rejected);
                                emailNot.templateCode = ConditionConfig_1.EmailTemplateCodes.CandidateRejected;
                                popupMessage = ConditionConfig_1.RecuritmentHRMsg.ProfileReviewedNo;
                                break;
                            case "HOLD":
                                candidateData = createFilter(isLevel2
                                    ? Config_1.workflowStatusApi.LineManagerLevel2OnHold
                                    : Config_1.workflowStatusApi.LineManagerLevel1OnHold);
                                popupMessage = ConditionConfig_1.RecuritmentHRMsg.ProfileReviewedWaitingList;
                                break;
                        }
                    }
                    else {
                        if (isAssignInterview) {
                            candidateData = createFilter(Config_1.workflowStatusApi.InterviewScheduled);
                            emailNot.templateCode = ConditionConfig_1.EmailTemplateCodes.InterviewSchedule;
                            popupMessage =
                                String(StatusId) ===
                                    Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview
                                    ? ConditionConfig_1.RecuritmentHRMsg.InterviewPanalLevel1
                                    : ConditionConfig_1.RecuritmentHRMsg.InterviewPanalAssignedSuccessfully;
                        }
                        else {
                            if (decision === "YES") {
                                candidateData = createFilter(Config_1.workflowStatusApi.LineManagerL1Pending);
                                popupMessage = ConditionConfig_1.RecuritmentHRMsg.HRReviewCandidate;
                            }
                            if (decision === "NO") {
                                candidateData = createFilter(Config_1.workflowStatusApi.HRRejected);
                                popupMessage = ConditionConfig_1.RecuritmentHRMsg.ProfileReviewedNo;
                            }
                        }
                    }
                    if (!(COIFlag && String(StatusId) === Config_1.workflowStatusApi.HRPending)) return [3 /*break*/, 4];
                    attachmentPath = "";
                    if (!(COIDetails.attachment && COIDetails.attachment.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, ServiceExport_1.CandidateTable.UploadCOIAttachment({
                            RequestID: String(cp === null || cp === void 0 ? void 0 : cp.profileID),
                            DocumentName: ConditionConfig_1.DocumentFolderName.COIAttach,
                        }, COIDetails.attachment)];
                case 1:
                    docResponse = _d.sent();
                    attachmentPath = String((_b = (_a = docResponse.data[0]) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : "");
                    _d.label = 2;
                case 2: return [4 /*yield*/, ServiceExport_1.CandidateTable.GetUpsertCOI({
                        profileId: (_c = cp === null || cp === void 0 ? void 0 : cp.profileID) !== null && _c !== void 0 ? _c : 0,
                        approver: COIDetails.consultedWith,
                        comments: COIDetails.comments,
                        attachmentPath: attachmentPath,
                    })];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4: return [2 /*return*/, { candidateData: candidateData, emailNot: emailNot, popupMessage: popupMessage }];
            }
        });
    }); }, [ServiceExport_1.CandidateTable, matricID, roleIDs]);
    // ─── Handle Workflow Process ─────────────────────────────────────────────────
    // NOTE: No setPageLoading calls here — all managed in executeSubmit's finally block
    var handleWorkflowProcess = (0, react_1.useCallback)(function (payload, COIButtonAction) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a, candidateData, emailNot, popupMessage, StatusId, interviewLevel1, uploadRes, res;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, buildWorkflowData(payload, COIButtonAction)];
                case 1:
                    _a = _b.sent(), candidateData = _a.candidateData, emailNot = _a.emailNot, popupMessage = _a.popupMessage;
                    StatusId = payload.StatusId, interviewLevel1 = payload.interviewLevel1;
                    if (StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview) {
                        emailNot.templateCode = ConditionConfig_1.EmailTemplateCodes.InterviewSchedule;
                        emailNot.dynamicFields = {
                            InterviewDate: interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startDate,
                            InterviewTime: interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startDate,
                            InterviewLevel: "Level1",
                        };
                    }
                    if (!(StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview)) return [3 /*break*/, 3];
                    return [4 /*yield*/, uploadCandidateDetails(payload)];
                case 2:
                    uploadRes = _b.sent();
                    if (uploadRes.status !== ApiConfig_1.ResponeStatus.SUCCESS) {
                        showModal({
                            type: "success",
                            title: "Submitted Successfully",
                            message: popupMessage,
                            confirmLabel: "Go to Candidate Table",
                            onConfirm: function () {
                                closeModal();
                                onClose();
                                handleRefresh();
                            },
                        });
                        return [2 /*return*/];
                    }
                    _b.label = 3;
                case 3: return [4 /*yield*/, ServiceExport_1.CandidateTable.UpdateCandidateStatus(candidateData)];
                case 4:
                    res = _b.sent();
                    if (!(res.status === 200)) return [3 /*break*/, 7];
                    if (!(StatusId === Config_1.workflowStatusApi.LineManagerL2Pending ||
                        StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview)) return [3 /*break*/, 6];
                    if (!emailNot.templateCode) return [3 /*break*/, 6];
                    return [4 /*yield*/, ServiceExport_1.CandidateTable.SendEmailNotification(emailNot)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    showModal({
                        type: "success",
                        title: "Submitted Successfully",
                        message: popupMessage,
                        confirmLabel: "Go to Candidate Table",
                        onConfirm: function () {
                            closeModal();
                            onClose();
                            handleRefresh();
                        },
                    });
                    return [3 /*break*/, 8];
                case 7:
                    showModal({
                        type: "error",
                        title: "Error",
                        message: ConditionConfig_1.RecuritmentHRMsg.APIErrorMsg,
                        confirmLabel: "Go to Candidate Table",
                        onConfirm: function () {
                            closeModal();
                            onClose();
                            handleRefresh();
                        },
                    });
                    _b.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); }, [buildWorkflowData, uploadCandidateDetails, ServiceExport_1.CandidateTable]);
    // ─── Execute Submit ──────────────────────────────────────────────────────────
    // Single source of truth for pageLoading and submitting states.
    // setPageLoading(true)  → top of this function
    // setPageLoading(false) → always in the finally block
    var executeSubmit = (0, react_1.useCallback)(function (payload, COIButtonAction) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isLevel2Pending, isScheduleInterview, panelL2, startDateTimeL2, interviewscheduleL2Data, response, err_1;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
                    abortRef.current = new AbortController();
                    setSubmitting(true);
                    setPageLoading(true); // ✅ Start loader — single entry point
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 9, 10, 11]);
                    isLevel2Pending = Number(payload.StatusId) ===
                        Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
                    isScheduleInterview = payload.StatusId ===
                        Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview;
                    if (!isScheduleInterview) return [3 /*break*/, 3];
                    return [4 /*yield*/, scheduleMeeting(payload)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    if (!isLevel2Pending) return [3 /*break*/, 6];
                    return [4 /*yield*/, scheduleMeeting(payload)];
                case 4:
                    _d.sent();
                    panelL2 = payload.interviewPanelL2.map(function (item) {
                        var _a, _b, _c, _d;
                        return ({
                            RecruitmentIDId: (_b = (_a = payload.recrutimentData) === null || _a === void 0 ? void 0 : _a.ID) !== null && _b !== void 0 ? _b : 0,
                            InterviewLevel: ConditionConfig_1.InterviewLevels.Level2,
                            InterviewPanelId: (_c = item.key) !== null && _c !== void 0 ? _c : 0,
                            CandidateIDId: (_d = Number(payload.candidateId)) !== null && _d !== void 0 ? _d : 0,
                        });
                    });
                    startDateTimeL2 = ((_b = payload.interviewLevel2) === null || _b === void 0 ? void 0 : _b.startDate) &&
                        ((_c = payload.interviewLevel2) === null || _c === void 0 ? void 0 : _c.startTime)
                        ? new Date("".concat(payload.interviewLevel2.startDate, "T").concat(payload.interviewLevel2.startTime, ":00")).toISOString()
                        : "";
                    interviewscheduleL2Data = {
                        candidateUpdate: {
                            ID: Number(payload.candidateId),
                            StatusId: Config_1.StatusId.InterviewScheduledforLevel2,
                            InterviewDateLevel2: startDateTimeL2,
                            InterviewTimeLevel2: payload.interviewLevel2.startTime,
                            InterviewLinkLevel2: payload.interviewLevel2.endTime,
                        },
                        interviewPanelL2: panelL2,
                    };
                    return [4 /*yield*/, ServiceExport_1.CandidateTable.InterviewScheduleLevel2(interviewscheduleL2Data)];
                case 5:
                    response = _d.sent();
                    if (response.status === 200) {
                        showModal({
                            type: "success",
                            title: "Submitted Successfully",
                            message: ConditionConfig_1.RecuritmentHRMsg.InterviewPanalLevel2,
                            confirmLabel: "Go to Candidate Table",
                            onConfirm: function () {
                                closeModal();
                                onClose();
                                handleRefresh();
                            },
                        });
                    }
                    else {
                        showModal({
                            type: "error",
                            title: "Error",
                            message: ConditionConfig_1.RecuritmentHRMsg.APIErrorMsg,
                            confirmLabel: "Go to Candidate Table",
                            onConfirm: function () {
                                closeModal();
                                onClose();
                                handleRefresh();
                            },
                        });
                    }
                    return [3 /*break*/, 8];
                case 6: 
                // All other workflow actions
                return [4 /*yield*/, handleWorkflowProcess(payload, COIButtonAction)];
                case 7:
                    // All other workflow actions
                    _d.sent();
                    _d.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    err_1 = _d.sent();
                    if ((err_1 === null || err_1 === void 0 ? void 0 : err_1.name) === "AbortError")
                        return [2 /*return*/];
                    console.error("Submit failed:", err_1);
                    showModal({
                        type: "error",
                        title: "Error",
                        message: ConditionConfig_1.RecuritmentHRMsg.APIErrorMsg,
                        confirmLabel: "Close",
                        onConfirm: function () {
                            closeModal();
                        },
                    });
                    return [3 /*break*/, 11];
                case 10:
                    setSubmitting(false);
                    setPageLoading(false); // ✅ Stop loader — always runs (success, error, or abort)
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); }, [scheduleMeeting, handleWorkflowProcess, ServiceExport_1.CandidateTable]);
    // ─── Submit (Public API) ─────────────────────────────────────────────────────
    var submit = (0, react_1.useCallback)(function (payload, COIButtonAction) {
        if (COIButtonAction === void 0) { COIButtonAction = ""; }
        return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var isRestrictedStatus;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isRestrictedStatus = Number(payload.StatusId) ===
                            Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
                            payload.StatusId ===
                                Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview;
                        // Show COI confirmation modal before proceeding
                        if (!isRestrictedStatus && payload.COIFlag) {
                            showModal({
                                type: "confirmation",
                                title: "Conflict Of Interest",
                                message: "This is the COI profile. Are you sure you're ready to proceed?",
                                confirmLabel: "Yes",
                                cancelLabel: "No",
                                isCOIFlag: true,
                                onConfirm: function () {
                                    closeModal();
                                    void executeSubmit(payload, COIButtonAction); // pageLoading starts inside executeSubmit
                                },
                                onCancel: function () {
                                    closeModal();
                                    void executeSubmit(payload, "NO"); // pageLoading starts inside executeSubmit
                                },
                            });
                            return [2 /*return*/];
                        }
                        // Direct submit — no COI confirmation needed
                        return [4 /*yield*/, executeSubmit(payload, COIButtonAction)];
                    case 1:
                        // Direct submit — no COI confirmation needed
                        _a.sent(); // pageLoading starts inside executeSubmit
                        return [2 /*return*/];
                }
            });
        });
    }, [executeSubmit]);
    return { submitting: submitting, pageLoading: pageLoading, submit: submit, modalState: modalState, closeModal: closeModal };
};
exports.useSubmitCandidateReview = useSubmitCandidateReview;
//# sourceMappingURL=Usesubmitcandidatereview.js.map