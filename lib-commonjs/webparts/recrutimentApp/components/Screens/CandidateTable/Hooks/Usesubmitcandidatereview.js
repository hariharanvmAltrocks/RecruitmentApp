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
var useSubmitCandidateReview = function (showError) {
    var matricID = (0, UIStateContext_1.useUIState)().MatricID;
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var _a = (0, react_1.useState)(false), submitting = _a[0], setSubmitting = _a[1];
    var _b = (0, react_1.useState)(null), submitError = _b[0], setSubmitError = _b[1];
    var _c = (0, react_1.useState)(false), submitSuccess = _c[0], setSubmitSuccess = _c[1];
    var abortRef = (0, react_1.useRef)(null);
    var splitDateOnly = function (date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var day = String(date.getDate()).padStart(2, "0");
        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).toISOString();
    };
    var uploadCandidateDetails = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var cp, recrutimentData, interviewLevel1, COIDetails, interviewPanelL1, dobValue, dobData, startDate, endDate, candidateDetails, selectedPanel;
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            cp = payload.CandidateDetails, recrutimentData = payload.recrutimentData, interviewLevel1 = payload.interviewLevel1, COIDetails = payload.COIDetails, interviewPanelL1 = payload.interviewPanelL1;
            if (!cp)
                throw new Error("CandidateDetails is null");
            dobValue = cp.DOB ? new Date(cp.DOB) : new Date();
            dobData = splitDateOnly(dobValue);
            startDate = interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startDate //? interviewLevel1?.startDate.toISOString() : "";
            ;
            endDate = interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.endDate //? interviewLevel1?.startDate.toISOString() : "";
            ;
            candidateDetails = {
                RecruitmentIDId: recrutimentData === null || recrutimentData === void 0 ? void 0 : recrutimentData.RecordID,
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
                InterviewDate: startDate,
                InterviewTime: endDate,
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
                ReferenceEmployeeDetails: JSON.stringify([(cp === null || cp === void 0 ? void 0 : cp.employeeReferenceDetails) || {}]),
                hasIvanhoeZijinExperience: cp === null || cp === void 0 ? void 0 : cp.hasIvanhoeZijinExperience,
                OperationRoleRegion: JSON.stringify([(cp === null || cp === void 0 ? void 0 : cp.companyDetails) || {}]),
                NationalityCode: (cp === null || cp === void 0 ? void 0 : cp.NatioCode) || "",
                LanguageKnown: JSON.stringify(cp === null || cp === void 0 ? void 0 : cp.LanguageKnown),
                InterviewLink: "",
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
    var scheduleMeeting = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var cp, recrutimentData, interviewLevel1, interviewLevel2, StatusId, interviewPanelL1, organizer, requiredAttendees, meetingObj;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            cp = payload.CandidateDetails, recrutimentData = payload.recrutimentData, interviewLevel1 = payload.interviewLevel1, interviewLevel2 = payload.interviewLevel2, StatusId = payload.StatusId, interviewPanelL1 = payload.interviewPanelL1;
            if (!cp)
                throw new Error("CandidateDetails is null");
            organizer = interviewPanelL1.find(function (i) { return i.Role === ConditionConfig_1.RoleName.RecruitmentHR; });
            requiredAttendees = interviewPanelL1.map(function (i) { return i.Email; });
            meetingObj = {
                organizerEmail: (_a = organizer === null || organizer === void 0 ? void 0 : organizer.text) !== null && _a !== void 0 ? _a : "",
                subject: "Interview for ".concat(cp.FristName, " ").concat(cp.MiddleName, " - ").concat(recrutimentData === null || recrutimentData === void 0 ? void 0 : recrutimentData.JobTitleEnglish),
                startUtc: "", // startdate,
                endUtc: "", //enddate,
                location: "",
                requiredAttendees: requiredAttendees,
                optionalAttendees: [],
                rooms: [],
                categories: ["Internal", "Planning"],
                isOnlineMeeting: true,
            };
            return [2 /*return*/, ServiceExport_1.MeetingSchedules.createMeeting(meetingObj)];
        });
    }); }, [ServiceExport_1.MeetingSchedules]);
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
    var buildWorkflowData = (0, react_1.useCallback)(function (payload, COIButtonAction) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var COIDetails, cp, candidateId, decisionComments, decision, HRReviewComents, COIFlag, StatusId, currentUserRole, createFilter, candidateData, emailNot, popupMessage, isLineManager, isAssignInterview, isLevel2, attachmentPath, docResponse;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    COIDetails = payload.COIDetails, cp = payload.CandidateDetails, candidateId = payload.candidateId, decisionComments = payload.decisionComments, decision = payload.decision, HRReviewComents = payload.HRReviewComents, COIFlag = payload.COIFlag, StatusId = payload.StatusId;
                    currentUserRole = roleIDs.includes(Config_1.RoleID.RecruitmentHR) ? ConditionConfig_1.RoleName.RecruitmentHR : ConditionConfig_1.RoleName.LineManager;
                    createFilter = function (workflowStatus) { return ({
                        workflowStatus: workflowStatus,
                        jobRequestId: candidateId,
                        comments: decisionComments,
                        actionBy: currentUserRole,
                        hrComments: HRReviewComents
                    }); };
                    candidateData = { workflowStatus: "", jobRequestId: 0, comments: "", actionBy: "", hrComments: "" };
                    emailNot = { jobRequestId: candidateId, templateCode: "" };
                    popupMessage = "";
                    isLineManager = roleIDs.includes(Config_1.RoleID.LineManager);
                    isAssignInterview = matricID === ConditionConfig_1.MatricID.AssignInterviewPanel;
                    if (isLineManager) {
                        isLevel2 = String(StatusId) === Config_1.workflowStatusApi.LineManagerL2Pending ||
                            String(StatusId) === Config_1.workflowStatusApi.LineManagerLevel2OnHold;
                        switch (decision) {
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
                                String(StatusId) === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview
                                    ? ConditionConfig_1.RecuritmentHRMsg.InterviewPanalLevel1
                                    : ConditionConfig_1.RecuritmentHRMsg.InterviewPanalAssignedSuccessfully;
                        }
                        else {
                            candidateData = createFilter(Config_1.workflowStatusApi.LineManagerL1Pending);
                            popupMessage = ConditionConfig_1.RecuritmentHRMsg.HRReviewCandidate;
                        }
                    }
                    if (!(COIFlag &&
                        String(StatusId) === Config_1.workflowStatusApi.HRPending)) return [3 /*break*/, 4];
                    attachmentPath = "";
                    if (!(COIDetails.attachment && COIDetails.attachment.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, ServiceExport_1.CandidateTable.UploadCOIAttachment({ RequestID: String(cp === null || cp === void 0 ? void 0 : cp.profileID), DocumentName: ConditionConfig_1.DocumentFolderName.COIAttach }, COIDetails.attachment)];
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
    }); }, [ServiceExport_1.CandidateTable]);
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
    var handleWorkflowProcess = (0, react_1.useCallback)(function (payload, COIButtonAction) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a, candidateData, emailNot, popupMessage, StatusId, interviewLevel1, interviewLevel2, uploadRes, res;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, buildWorkflowData(payload, COIButtonAction)];
                case 1:
                    _a = _b.sent(), candidateData = _a.candidateData, emailNot = _a.emailNot, popupMessage = _a.popupMessage;
                    StatusId = payload.StatusId, interviewLevel1 = payload.interviewLevel1, interviewLevel2 = payload.interviewLevel2;
                    if (StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview) {
                        emailNot.templateCode = ConditionConfig_1.EmailTemplateCodes.InterviewSchedule;
                        emailNot.dynamicFields = {
                            InterviewDate: interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startDate,
                            InterviewTime: interviewLevel1 === null || interviewLevel1 === void 0 ? void 0 : interviewLevel1.startDate,
                            // MeetingLink: String(dateState.RoomData?.key) ?? "",
                            InterviewLevel: "Level1",
                        };
                    }
                    if (!(StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview)) return [3 /*break*/, 3];
                    return [4 /*yield*/, uploadCandidateDetails(payload)];
                case 2:
                    uploadRes = _b.sent();
                    if (uploadRes.status !== ApiConfig_1.ResponeStatus.SUCCESS) {
                        showError(ConditionConfig_1.RecuritmentHRMsg.APIErrorMsg);
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
                    showError(popupMessage);
                    return [3 /*break*/, 8];
                case 7:
                    showError(ConditionConfig_1.RecuritmentHRMsg.APIErrorMsg);
                    _b.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); }, [buildWorkflowData, uploadCandidateDetails, ServiceExport_1.CandidateTable]);
    var submit = (0, react_1.useCallback)(function (payload_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return tslib_1.__awaiter(void 0, tslib_1.__spreadArray([payload_1], args_1, true), void 0, function (payload, COIButtonAction) {
            var scheduleResponse, err_1;
            var _a;
            if (COIButtonAction === void 0) { COIButtonAction = ""; }
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
                        abortRef.current = new AbortController();
                        setSubmitting(true);
                        setSubmitError(null);
                        setSubmitSuccess(false);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, scheduleMeeting(payload)];
                    case 2:
                        _b.sent();
                        scheduleResponse = payload.StatusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview
                            ? { status: 201 }
                            : { status: 201 };
                        if ((scheduleResponse === null || scheduleResponse === void 0 ? void 0 : scheduleResponse.status) !== 201)
                            return [2 /*return*/];
                        // const isReschedulePath =
                        //   (payload.stateValue.tab === "tab2" || payload.stateValue.tab === "tab3") &&
                        //   payload.stateValue?.initialTab === TabName.AssignInterviewPanel;
                        // if (isReschedulePath) {
                        //   await handleInterviewReschedule(payload);
                        //   return;
                        // }
                        return [4 /*yield*/, handleWorkflowProcess(payload, COIButtonAction)];
                    case 3:
                        // const isReschedulePath =
                        //   (payload.stateValue.tab === "tab2" || payload.stateValue.tab === "tab3") &&
                        //   payload.stateValue?.initialTab === TabName.AssignInterviewPanel;
                        // if (isReschedulePath) {
                        //   await handleInterviewReschedule(payload);
                        //   return;
                        // }
                        _b.sent();
                        setSubmitSuccess(true);
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _b.sent();
                        if ((err_1 === null || err_1 === void 0 ? void 0 : err_1.name) === "AbortError")
                            return [2 /*return*/];
                        console.error("Submit failed:", err_1);
                        setSubmitError("Failed to submit. Please try again.");
                        return [3 /*break*/, 6];
                    case 5:
                        setSubmitting(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }, [scheduleMeeting, handleWorkflowProcess]);
    var reset = (0, react_1.useCallback)(function () {
        setSubmitError(null);
        setSubmitSuccess(false);
    }, []);
    return { submitting: submitting, submitError: submitError, submitSuccess: submitSuccess, submit: submit, reset: reset };
};
exports.useSubmitCandidateReview = useSubmitCandidateReview;
//# sourceMappingURL=Usesubmitcandidatereview.js.map