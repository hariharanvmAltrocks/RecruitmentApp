"use strict";
// services/EvaluationApiService.ts
// ─────────────────────────────────────────────────────────────
// UPDATED: Two new methods added at the bottom of evaluationService:
//   1. fetchExistingHODDecision  — prepopulates View / Edit modal
//   2. updateCandidateStatusFull — full Level1 + Level2 submit logic
//      mirrors old HodViewScorecard:
//        Level 1 → insertOrUpdateCandidateCommentLevel1 + WorkflowApi
//        Level 2 → insertOrUpdateLevel2ScorecardComment + panel updates + WorkflowApi
// All original methods are UNCHANGED.
// ─────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationServiceHelper = exports.evaluationService = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var EvaluationConfig_1 = require("../config/EvaluationConfig");
var Config_1 = require("../../../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var CommonServices_1 = tslib_1.__importDefault(require("../CommonServices/CommonServices"));
var QuestionnaireApi_1 = tslib_1.__importDefault(require("./QuestionnaireApi/QuestionnaireApi"));
var CareerPortalAPI_1 = require("../../../../services/AxiosService/CareerPortalAPI");
var commonServiceInstance = new CommonServices_1.default();
var questionnaireService = new QuestionnaireApi_1.default();
exports.evaluationService = {
    // ── ORIGINAL METHODS (unchanged) ─────────────────────────────
    getCurrentUserGuid: function (email) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, e_1;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!email)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, commonServiceInstance.getUserGuidByEmail(email)];
                    case 1:
                        response = _b.sent();
                        if ((response === null || response === void 0 ? void 0 : response.status) === 200 && ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.key)) {
                            return [2 /*return*/, String(response.data.key)];
                        }
                        return [2 /*return*/, null];
                    case 2:
                        e_1 = _b.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getInterviewPanelsByUser: function (userGuid) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listItems, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: EvaluationConfig_1.EvalQueryConfig.InterviewPanel.Select,
                                Expand: EvaluationConfig_1.EvalQueryConfig.InterviewPanel.Expand,
                                Filter: [{ FilterKey: "InterviewPanelId", Operator: "eq", FilterValue: userGuid }],
                            })];
                    case 1:
                        listItems = _a.sent();
                        return [2 /*return*/, listItems || []];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getCombinedCandidates: function (candidateIDs, employeeList) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listItems, e_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!candidateIDs || candidateIDs.length === 0)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: EvaluationConfig_1.EvalQueryConfig.CandidateDetails.Select,
                                Expand: EvaluationConfig_1.EvalQueryConfig.CandidateDetails.Expand,
                                FilterCondition: "and",
                                Filter: [
                                    { FilterKey: "StatusId", Operator: "in", FilterValue: [Config_1.StatusId.InterviewScheduled, Config_1.StatusId.InterviewScheduledforLevel2] },
                                    { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
                                    { FilterKey: "ID", Operator: "in", FilterValue: candidateIDs },
                                ],
                                Topcount: 5000,
                            })];
                    case 1:
                        listItems = _a.sent();
                        return [2 /*return*/, listItems || []];
                    case 2:
                        e_3 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getGradeAndLevel: function (recruitmentID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var grade, level, jobCodeID, dptRes, posRes, e_4;
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        grade = "";
                        level = "";
                        jobCodeID = 0;
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "*,JobCodeId,JobCode/ID",
                                Expand: "JobCode",
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }],
                            })];
                    case 2:
                        dptRes = _g.sent();
                        jobCodeID = ((_a = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _a === void 0 ? void 0 : _a.JobCodeId) || ((_c = (_b = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _b === void 0 ? void 0 : _b.JobCode) === null || _c === void 0 ? void 0 : _c.ID) || 0;
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentPositionDetails,
                                Select: "*,PatersonGrade/PatersonGrade",
                                Expand: "PatersonGrade",
                                Filter: [{ FilterKey: "RecruitmentID", Operator: "eq", FilterValue: recruitmentID }],
                            })];
                    case 3:
                        posRes = _g.sent();
                        grade = ((_e = (_d = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _d === void 0 ? void 0 : _d.PatersonGrade) === null || _e === void 0 ? void 0 : _e.PatersonGrade) || ((_f = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _f === void 0 ? void 0 : _f.PatersonGrade) || "";
                        if (!grade) return [3 /*break*/, 5];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSGradeMaster,
                                Select: "*",
                                Filter: [{ FilterKey: "PatersonGrade", Operator: "eq", FilterValue: grade }],
                            }).then(function (data) {
                                var _a;
                                if (data && data.length > 0)
                                    level = ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.Levels) || "";
                            })];
                    case 4:
                        _g.sent();
                        _g.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_4 = _g.sent();
                        console.error("[getGradeAndLevel] Error fetching grade/level:", e_4);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, { grade: grade, level: level, jobCodeID: jobCodeID }];
                }
            });
        });
    },
    getTooltipData: function (candidateID, interviewLevel) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listItems, e_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "InterviewPanel/Title,IsScoreSheetUploaded",
                                Expand: "InterviewPanel",
                                FilterCondition: "and",
                                Filter: [
                                    { FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID },
                                    { FilterKey: "InterviewLevel", Operator: "eq", FilterValue: interviewLevel },
                                ],
                            })];
                    case 1:
                        listItems = _a.sent();
                        return [2 /*return*/, listItems.map(function (item) {
                                var _a;
                                return ({
                                    Key: ((_a = item.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Title) || "Unknown",
                                    Value: item.IsScoreSheetUploaded === "Yes" ? "Completed" : "Pending",
                                });
                            })];
                    case 2:
                        e_5 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    checkScoreSheet: function (candidateID, statusId, userEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentUserKey_1, candidatePanels, userPanels, already, already, e_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getCurrentUserGuid(userEmail)];
                    case 1:
                        currentUserKey_1 = _a.sent();
                        if (!currentUserKey_1)
                            return [2 /*return*/, { canProceed: true }];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "InterviewPanel/Id,InterviewLevel,IsScoreSheetUploaded",
                                Expand: "InterviewPanel",
                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }],
                            })];
                    case 2:
                        candidatePanels = _a.sent();
                        userPanels = candidatePanels.filter(function (p) { var _a, _b; return ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === null || _b === void 0 ? void 0 : _b.toString()) === currentUserKey_1; });
                        if (!userPanels.length)
                            return [2 /*return*/, { canProceed: true }];
                        if (statusId === Config_1.StatusId.InterviewScheduled) {
                            already = userPanels
                                .filter(function (p) { return p.InterviewLevel === EvaluationConfig_1.InterviewLevels.Level1; })
                                .some(function (p) { return p.IsScoreSheetUploaded === "Yes"; });
                            return [2 /*return*/, already ? { canProceed: false, level: EvaluationConfig_1.InterviewLevels.Level1 } : { canProceed: true }];
                        }
                        if (statusId === Config_1.StatusId.InterviewScheduledforLevel2) {
                            already = userPanels
                                .filter(function (p) { return p.InterviewLevel === EvaluationConfig_1.InterviewLevels.Level2; })
                                .some(function (p) { return p.IsScoreSheetUploaded === "Yes"; });
                            return [2 /*return*/, already ? { canProceed: false, level: EvaluationConfig_1.InterviewLevels.Level2 } : { canProceed: true }];
                        }
                        return [2 /*return*/, { canProceed: true }];
                    case 3:
                        e_6 = _a.sent();
                        return [2 /*return*/, { canProceed: true }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    getEvaluationFormData: function (candidateId, recruitmentId, currentUserEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var candidateRes, candidate, panelRes, currentUserGuid_1, currentUserPanel, panelEmails, uniqueEmails, emailToNameMap_1, err_1, formattedPanelMembers, reviewerName, jobTitleEn, jobTitleFr, sageRes, sageUser, err_2, dptRes, jobCodeId, jobUniqueKey, integrationRes, err_3, questions, qResponse, err_4, error_1;
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 21, , 22]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: "*",
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: candidateId }],
                            })];
                    case 1:
                        candidateRes = _j.sent();
                        candidate = candidateRes[0] || {};
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded",
                                Expand: "InterviewPanel",
                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
                            })];
                    case 2:
                        panelRes = _j.sent();
                        return [4 /*yield*/, this.getCurrentUserGuid(currentUserEmail)];
                    case 3:
                        currentUserGuid_1 = _j.sent();
                        currentUserPanel = panelRes.find(function (p) { var _a; return String((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === String(currentUserGuid_1); });
                        panelEmails = panelRes.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; }).filter(Boolean);
                        uniqueEmails = panelEmails.filter(function (value, index, self) { return self.indexOf(value) === index; });
                        emailToNameMap_1 = {};
                        if (!(uniqueEmails.length > 0)) return [3 /*break*/, 7];
                        _j.label = 4;
                    case 4:
                        _j.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, Promise.all(uniqueEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var sageRes, item, fullName;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                Listname: Config_1.ListNames.HRMSSageList,
                                                Select: "EmailId, FirstName, LastName, MiddleName",
                                                Filter: [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
                                            })];
                                        case 1:
                                            sageRes = _a.sent();
                                            if (sageRes && sageRes.length > 0) {
                                                item = sageRes[0];
                                                fullName = ((item.FirstName || "") + " " +
                                                    (item.MiddleName || "") + " " +
                                                    (item.LastName || "")).trim();
                                                if (fullName)
                                                    emailToNameMap_1[email.toLowerCase()] = fullName;
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 5:
                        _j.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _j.sent();
                        console.warn("Could not fetch panel details from Sage List", err_1);
                        return [3 /*break*/, 7];
                    case 7:
                        formattedPanelMembers = panelRes
                            .map(function (p) {
                            var _a, _b, _c;
                            var email = ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
                            return emailToNameMap_1[email] || ((_c = p.InterviewPanel) === null || _c === void 0 ? void 0 : _c.Title) || "Unknown";
                        })
                            .filter(Boolean);
                        reviewerName = "";
                        jobTitleEn = "—";
                        jobTitleFr = "—";
                        _j.label = 8;
                    case 8:
                        _j.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSSageList,
                                Select: "*,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench",
                                Expand: "JobTitleInEnglish,JobTitleInFrench",
                            })];
                    case 9:
                        sageRes = _j.sent();
                        if (sageRes && sageRes.length > 0) {
                            sageUser = sageRes[0];
                            reviewerName = ((sageUser.FirstName || "") + " " +
                                (sageUser.MiddleName || "") + " " +
                                (sageUser.LastName || "")).trim();
                            jobTitleEn = ((_a = sageUser.JobTitleInEnglish) === null || _a === void 0 ? void 0 : _a.JobTitleInEnglish) || "—";
                            jobTitleFr = ((_b = sageUser.JobTitleInFrench) === null || _b === void 0 ? void 0 : _b.JobTitleInFrench) || "—";
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        err_2 = _j.sent();
                        console.warn("Could not fetch reviewer details from Sage List", err_2);
                        return [3 /*break*/, 11];
                    case 11: return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                            Select: "*,JobCode/JobCode,JobCode/ID",
                            Expand: "JobCode",
                            Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentId }],
                        })];
                    case 12:
                        dptRes = _j.sent();
                        jobCodeId = (_g = (_d = (_c = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _c === void 0 ? void 0 : _c.JobCodeId) !== null && _d !== void 0 ? _d : (_f = (_e = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _e === void 0 ? void 0 : _e.JobCode) === null || _f === void 0 ? void 0 : _f.ID) !== null && _g !== void 0 ? _g : 0;
                        jobUniqueKey = "";
                        if (!jobCodeId) return [3 /*break*/, 16];
                        _j.label = 13;
                    case 13:
                        _j.trys.push([13, 15, , 16]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                                Select: "*",
                                FilterCondition: "and",
                                Filter: [
                                    { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeId },
                                    { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
                                ],
                            })];
                    case 14:
                        integrationRes = _j.sent();
                        jobUniqueKey = ((_h = integrationRes === null || integrationRes === void 0 ? void 0 : integrationRes[0]) === null || _h === void 0 ? void 0 : _h.JobUniqueKey) || "";
                        return [3 /*break*/, 16];
                    case 15:
                        err_3 = _j.sent();
                        return [3 /*break*/, 16];
                    case 16:
                        questions = [];
                        if (!jobUniqueKey) return [3 /*break*/, 20];
                        _j.label = 17;
                    case 17:
                        _j.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, questionnaireService.getQuestionnaire(jobUniqueKey)];
                    case 18:
                        qResponse = _j.sent();
                        if (qResponse === null || qResponse === void 0 ? void 0 : qResponse.data)
                            questions = qResponse.data;
                        return [3 /*break*/, 20];
                    case 19:
                        err_4 = _j.sent();
                        return [3 /*break*/, 20];
                    case 20: return [2 /*return*/, {
                            success: true,
                            candidateData: candidate,
                            panelMembers: formattedPanelMembers,
                            currentUserPanelId: (currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) || null,
                            questions: questions,
                            currentUserGuid: currentUserGuid_1,
                            reviewerName: reviewerName,
                            jobTitleEn: jobTitleEn,
                            jobTitleFr: jobTitleFr,
                        }];
                    case 21:
                        error_1 = _j.sent();
                        return [2 /*return*/, {
                                success: false, candidateData: null, panelMembers: [],
                                currentUserPanelId: null, questions: [],
                            }];
                    case 22: return [2 /*return*/];
                }
            });
        });
    },
    submitScorecard: function (payload, panelId, roleId, interviewPersonNameId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var spPayload, scoreCardResponse, newItemId, error_2;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        spPayload = {
                            RelevantQualification: String(payload.Qualifications || ""),
                            ReleventExperience: String(payload.Experience || ""),
                            Knowledge: String(payload.Knowledge || ""),
                            EnergyLevel: String(payload.EnergyLevel || ""),
                            MeetJobRequirement: String(payload.JobRequirements || ""),
                            ContributeTowardsCultureRequried: String(payload.CultureFit || ""),
                            Experience: String(payload.ExpatLocal || ""),
                            OtherCriteriaScore: String(payload.OtherCriteria || ""),
                            ConsiderForEmployment: payload.Recommendation === "Consider for Employment" ? "Yes" : "No",
                            OverAllEvaluationFeedback: payload.OverallFeedback || "",
                            RecruitmentIDId: payload.RecruitmentIDId,
                            InterviewPanelIDId: panelId,
                            QuestionJson: payload.QuestionScores || "[]",
                            RoleId: roleId ? Number(roleId) : null,
                            InterviewPersonNameId: interviewPersonNameId ? Number(interviewPersonNameId) : null,
                        };
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                RequestJSON: spPayload,
                            })];
                    case 1:
                        scoreCardResponse = _c.sent();
                        newItemId = (scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.ID) ||
                            (scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.Id) ||
                            ((_a = scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.data) === null || _a === void 0 ? void 0 : _a.ID) ||
                            ((_b = scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.data) === null || _b === void 0 ? void 0 : _b.Id);
                        if (!newItemId) return [3 /*break*/, 3];
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                RequestJSON: { IsScoreSheetUploaded: "Yes" },
                                ID: panelId,
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, { success: true, message: "Scorecard submitted successfully!" }];
                    case 3: return [2 /*return*/, { success: false, message: "Failed to submit scorecard." }];
                    case 4:
                        error_2 = _c.sent();
                        console.error("submitScorecard error:", error_2);
                        return [2 /*return*/, { success: false, message: "An error occurred while submitting." }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // ── ORIGINAL updateCandidateStatus (kept for backward compat) ────────────
    updateCandidateStatus: function (candidateId_1, statusId_1, positionId_1, hodDecision_1, comments_1, updatedByEmail_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (candidateId, statusId, positionId, hodDecision, comments, updatedByEmail, gpa) {
            var actionId, payload, updateResponse, error_3;
            if (gpa === void 0) { gpa = ""; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (candidateId == null || statusId == null || !(hodDecision === null || hodDecision === void 0 ? void 0 : hodDecision.trim()) || !(comments === null || comments === void 0 ? void 0 : comments.trim())) {
                            return [2 /*return*/, { success: false, message: "Required fields: candidateId, statusId, hodDecision, comments" }];
                        }
                        actionId = 0;
                        switch (hodDecision.trim().toLowerCase()) {
                            case "yes":
                                actionId = 1;
                                break;
                            case "no":
                                actionId = 2;
                                break;
                            case "on hold":
                                actionId = 10;
                                break;
                            default: throw new Error("Invalid HOD decision: ".concat(hodDecision));
                        }
                        payload = {
                            StatusId: statusId,
                            ActionId: actionId,
                            ItemCreated: "Yes",
                            Comments: String(comments || "").trim(),
                            GPA: String(gpa || ""),
                            OthersInterviewed: "No",
                        };
                        if (updatedByEmail)
                            payload.HOD = updatedByEmail;
                        if (positionId)
                            payload.PositionIDId = positionId;
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                ID: candidateId,
                                RequestJSON: payload,
                            })];
                    case 1:
                        updateResponse = _a.sent();
                        if (!updateResponse)
                            throw new Error("SPUpdateItem returned empty response");
                        return [2 /*return*/, { success: true, message: "Candidate status updated successfully.", data: { candidateId: candidateId, statusId: statusId } }];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, { success: false, message: "Error updating candidate status: ".concat(error_3 === null || error_3 === void 0 ? void 0 : error_3.message) }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // ─────────────────────────────────────────────────────────────
    // NEW: fetchExistingHODDecision
    // Reads HRMSRecruitmentCandidateComments (Level 1) or
    // HRMSCandidateLevel2ScoreCard (Level 2) to prepopulate the form.
    // Also fetches the assigned PositionID from HRMSSelectedCandidateDetailsByHOD.
    // Mirrors old fetchSelectedCandidateDetails() in HodViewScorecard.
    // ─────────────────────────────────────────────────────────────
    fetchExistingHODDecision: function (candidateId, roleId, isLevel2) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var listName, filter, items, match, comments, positionId, positionText, posList, posItem, _1, e_7;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        listName = isLevel2
                            ? Config_1.ListNames.HRMSCandidateLevel2ScoreCard
                            : Config_1.ListNames.HRMSRecruitmentCandidateComments;
                        filter = [
                            { FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateId },
                        ];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: listName,
                                Select: "*",
                                Filter: filter,
                            })];
                    case 1:
                        items = _c.sent();
                        match = items.find(function (item) { return item.RoleId === roleId; }) || items[0];
                        comments = (match === null || match === void 0 ? void 0 : match.Comments) || "";
                        positionId = null;
                        positionText = "";
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                                Select: "*,PositionID/PositionID,PositionID/ID",
                                Expand: "PositionID",
                                Filter: [{ FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateId }],
                            })];
                    case 3:
                        posList = _c.sent();
                        if (posList && posList.length > 0) {
                            posItem = posList[0];
                            positionId = posItem.PositionIDId || ((_a = posItem.PositionID) === null || _a === void 0 ? void 0 : _a.ID) || null;
                            positionText = ((_b = posItem.PositionID) === null || _b === void 0 ? void 0 : _b.PositionID) || posItem.PositionIDText || "";
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        _1 = _c.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, { comments: comments, positionId: positionId, positionText: positionText }];
                    case 6:
                        e_7 = _c.sent();
                        console.warn("[fetchExistingHODDecision] error:", e_7);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    // ─────────────────────────────────────────────────────────────
    // NEW: updateCandidateStatusFull
    // Full HOD submit logic — mirrors old HodViewScorecard Submit_fn exactly:
    //
    // Level 2 path (statusId === InterviewScheduledforLevel2):
    //   1. insertOrUpdateLevel2ScorecardComment (HRMSCandidateLevel2ScoreCard)
    //   2. Mark current user's InterviewPanel row IsScoreSheetUploaded=Yes
    //   3. If ALL level2 panels uploaded → mark candidate ItemCreated=Yes, ActionId=Approved
    //
    // Level 1 / HOD path (all other editable statusIds):
    //   1. insertOrUpdateCandidateCommentLevel1 (HRMSRecruitmentCandidateComments)
    //   2. handleAssignPosition if positionId provided
    //   3. WorkflowApi → UpdateCandidateStatus
    //   4. CandidateSeletionApi (SPUpdate ActionId/ItemCreated on candidate row)
    // ─────────────────────────────────────────────────────────────
    updateCandidateStatusFull: function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var candidateId, hodDecision, comments, currentUserEmail, currentRoleId, gpa, positionId, isLevel2, jobCodeID, recruitmentID, statusId, currentUserGuid_2, interviewLevel2, level, _2, matchingPanels, userPanels, _i, userPanels_1, panel, allPanels, level2Panels, uploadedCount, interviewLevel, level, _3, workflowStatus, wfErr_1, actionId, newStatusId, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        candidateId = params.candidateId, hodDecision = params.hodDecision, comments = params.comments, currentUserEmail = params.currentUserEmail, currentRoleId = params.currentRoleId, gpa = params.gpa, positionId = params.positionId, isLevel2 = params.isLevel2, jobCodeID = params.jobCodeID, recruitmentID = params.recruitmentID, statusId = params.statusId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 29, , 30]);
                        return [4 /*yield*/, this.getCurrentUserGuid(currentUserEmail)];
                    case 2:
                        currentUserGuid_2 = _a.sent();
                        if (!(statusId === Config_1.StatusId.InterviewScheduledforLevel2)) return [3 /*break*/, 16];
                        interviewLevel2 = "";
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, exports.evaluationService.getGradeAndLevel(recruitmentID)];
                    case 4:
                        level = (_a.sent()).level;
                        interviewLevel2 = level || "";
                        return [3 /*break*/, 6];
                    case 5:
                        _2 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [4 /*yield*/, _insertOrUpdateLevel2Comment(candidateId, currentRoleId, comments, interviewLevel2)];
                    case 7:
                        _a.sent();
                        if (!currentUserGuid_2) return [3 /*break*/, 12];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID,InterviewPanel/Id,InterviewLevel,CandidateID/ID",
                                Expand: "InterviewPanel,CandidateID",
                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
                            })];
                    case 8:
                        matchingPanels = _a.sent();
                        userPanels = matchingPanels.filter(function (p) {
                            var _a, _b, _c, _d, _e, _f;
                            return ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === null || _b === void 0 ? void 0 : _b.toString()) === currentUserGuid_2 &&
                                // CandidateID is expanded — compare using the ID sub-field
                                ((_f = (_d = (_c = p.CandidateID) === null || _c === void 0 ? void 0 : _c.ID) !== null && _d !== void 0 ? _d : (_e = p.CandidateID) === null || _e === void 0 ? void 0 : _e.Id) !== null && _f !== void 0 ? _f : p.CandidateIDId) === candidateId;
                        });
                        _i = 0, userPanels_1 = userPanels;
                        _a.label = 9;
                    case 9:
                        if (!(_i < userPanels_1.length)) return [3 /*break*/, 12];
                        panel = userPanels_1[_i];
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                RequestJSON: { IsScoreSheetUploaded: "Yes" },
                                ID: panel.ID,
                            })];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 9];
                    case 12: return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            Select: "ID,InterviewLevel,IsScoreSheetUploaded,CandidateID/Id",
                            Expand: "CandidateID",
                            Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
                        })];
                    case 13:
                        allPanels = _a.sent();
                        level2Panels = allPanels.filter(function (p) { return p.InterviewLevel === EvaluationConfig_1.InterviewLevels.Level2; });
                        uploadedCount = level2Panels.filter(function (p) { return p.IsScoreSheetUploaded === "Yes"; }).length;
                        if (!(uploadedCount === level2Panels.length && level2Panels.length > 0)) return [3 /*break*/, 15];
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                RequestJSON: {
                                    ScoreCardLevelItemCreated: "Yes",
                                    ActionId: EvaluationConfig_1.WorkflowAction.Approved,
                                    ItemCreated: "Yes",
                                },
                                ID: candidateId,
                            })];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [2 /*return*/, { success: true, message: "Level 2 scorecard comment submitted successfully." }];
                    case 16:
                        interviewLevel = "";
                        _a.label = 17;
                    case 17:
                        _a.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, exports.evaluationService.getGradeAndLevel(recruitmentID)];
                    case 18:
                        level = (_a.sent()).level;
                        interviewLevel = level || "";
                        return [3 /*break*/, 20];
                    case 19:
                        _3 = _a.sent();
                        return [3 /*break*/, 20];
                    case 20: return [4 /*yield*/, _insertOrUpdateLevel1Comment(candidateId, currentRoleId, comments, interviewLevel)];
                    case 21:
                        _a.sent();
                        if (!positionId) return [3 /*break*/, 23];
                        return [4 /*yield*/, _assignPositionID({
                                positionId: positionId,
                                candidateId: candidateId,
                                recruitmentID: recruitmentID,
                            })];
                    case 22:
                        _a.sent();
                        _a.label = 23;
                    case 23:
                        workflowStatus = "";
                        switch (hodDecision) {
                            case "Yes":
                                workflowStatus = "Selected";
                                break;
                            case "No":
                                workflowStatus = "Rejected";
                                break;
                            case "On Hold":
                                workflowStatus = "OnHold";
                                break;
                        }
                        _a.label = 24;
                    case 24:
                        _a.trys.push([24, 26, , 27]);
                        // Mirrors old code: getProfileData.UpdateCandidateStatus
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData.UpdateCandidateStatus({
                                workflowStatus: workflowStatus,
                                jobRequestId: recruitmentID,
                                comments: comments,
                                actionBy: "HOD",
                            })];
                    case 25:
                        // Mirrors old code: getProfileData.UpdateCandidateStatus
                        _a.sent();
                        return [3 /*break*/, 27];
                    case 26:
                        wfErr_1 = _a.sent();
                        console.warn("[updateCandidateStatusFull] WorkflowApi call failed (non-fatal):", wfErr_1);
                        return [3 /*break*/, 27];
                    case 27:
                        actionId = 0;
                        newStatusId = statusId;
                        switch (hodDecision) {
                            case "Yes":
                                actionId = EvaluationConfig_1.WorkflowAction.Approved; // 1
                                // Status mapping mirrors old Submit_fn
                                if (statusId === Config_1.StatusId.PendingwithHODtoselectthecandidate ||
                                    statusId === Config_1.StatusId.CandidateOnHoldbyHODLevel1) {
                                    newStatusId = Config_1.StatusId.PendingwithHODtoAssignPositionID; // 130
                                }
                                else {
                                    newStatusId = Config_1.StatusId.Selected; // 122
                                }
                                break;
                            case "No":
                                actionId = EvaluationConfig_1.WorkflowAction.Reject; // 2
                                if (statusId === Config_1.StatusId.PendingwithHODtoselectthecandidate) {
                                    newStatusId = Config_1.StatusId.CandidateRejectedbyHODLevel1; // 167
                                }
                                else if (statusId === Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2) {
                                    newStatusId = Config_1.StatusId.CandidateRejectedbyHODLevel2; // 168
                                }
                                else {
                                    newStatusId = Config_1.StatusId.RejectedbyHOD; // 15
                                }
                                break;
                            case "On Hold":
                                actionId = EvaluationConfig_1.WorkflowAction.OnHold; // 10
                                if (statusId === Config_1.StatusId.PendingwithHODtoselectthecandidate) {
                                    newStatusId = Config_1.StatusId.CandidateOnHoldbyHODLevel1; // 165
                                }
                                else if (statusId === Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2) {
                                    newStatusId = Config_1.StatusId.CandidateOnHoldbyHODLevel2; // 166
                                }
                                else {
                                    newStatusId = Config_1.StatusId.OnHoldbyHOD; // 123
                                }
                                break;
                        }
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                ID: candidateId,
                                RequestJSON: {
                                    ActionId: actionId,
                                    ItemCreated: "Yes",
                                    GPA: String(gpa || ""),
                                    OthersInterviewed: "No",
                                },
                            })];
                    case 28:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "Candidate status updated successfully." }];
                    case 29:
                        error_4 = _a.sent();
                        console.error("[updateCandidateStatusFull] error:", error_4);
                        return [2 /*return*/, { success: false, message: (error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || "An error occurred." }];
                    case 30: return [2 /*return*/];
                }
            });
        });
    },
    // ── HOD Scorecard data methods (from previous version, unchanged) ─────────
    fetchScorecardJobList: function () {
        return tslib_1.__awaiter(this, arguments, void 0, function (currentUserEmail) {
            var filterOpts, res, e_8;
            if (currentUserEmail === void 0) { currentUserEmail = ""; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filterOpts = [
                            { FilterKey: "StatusId", Operator: "eq", FilterValue: 28 },
                            { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
                        ];
                        if (currentUserEmail) {
                            filterOpts.push({ FilterKey: "HOD", Operator: "eq", FilterValue: currentUserEmail });
                        }
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "*,Department/DepartmentName,Department/ID,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title",
                                Expand: "Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode",
                                FilterCondition: "and",
                                Filter: filterOpts,
                                Topcount: 1000,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res || res.length === 0)
                            return [2 /*return*/, []];
                        return [2 /*return*/, res.map(function (item) {
                                var _a, _b, _c, _d, _e, _f;
                                return ({
                                    id: String(item.ID),
                                    recruitmentID: item.ID,
                                    jobCode: ((_a = item.JobCode) === null || _a === void 0 ? void 0 : _a.JobCode) || "",
                                    jobCodeID: ((_b = item.JobCode) === null || _b === void 0 ? void 0 : _b.ID) || item.JobCodeId || 0,
                                    jobTitle: item.JobTitleEnglish || item.JobTitle || item.PositionTitle || item.Title || "N/A",
                                    department: ((_c = item.Department) === null || _c === void 0 ? void 0 : _c.DepartmentName) || "",
                                    nationality: item.Nationality || "",
                                    statusId: item.StatusId || 0,
                                    status: ((_d = item.Status) === null || _d === void 0 ? void 0 : _d.StatusDescription) || "",
                                    grade: "",
                                    noOfPositions: item.NumberOfPersonNeeded || 1,
                                    businessUnitCode: ((_e = item.BusinessUnitCode) === null || _e === void 0 ? void 0 : _e.BusineesUnitCode) || ((_f = item.BusinessUnitCode) === null || _f === void 0 ? void 0 : _f.Title) || item.BusinessUnitCode || "",
                                    positionRequest: item.Type || item.PositionRequest || "New Position Request",
                                });
                            })];
                    case 2:
                        e_8 = _a.sent();
                        console.error("fetchScorecardJobList error:", e_8);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    fetchScorecardCandidates: function (recruitmentID_1, jobCodeID_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function (recruitmentID, jobCodeID, currentUserEmail, candidateFilter) {
            var filter, res, enrichedWithGPA, e_9;
            var _this = this;
            if (currentUserEmail === void 0) { currentUserEmail = ""; }
            if (candidateFilter === void 0) { candidateFilter = []; }
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        filter = candidateFilter && candidateFilter.length
                            ? tslib_1.__spreadArray([], candidateFilter, true) : [
                            { FilterKey: "RecruitmentIDId", Operator: "eq", FilterValue: recruitmentID },
                            { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
                            { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeID },
                            {
                                FilterKey: "StatusId",
                                Operator: "in",
                                FilterValue: [121, 122, 123, 15, 130, 127, 165, 166, 167, 168],
                            },
                        ];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
                                Expand: "JobCode,AssignByInterviewPanel,RecruitmentID,Status",
                                FilterCondition: "and",
                                Filter: filter,
                                Topcount: 1000,
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, Promise.all((res || []).map(function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var gpa, panels, level1Count, maxOverallScore, sumOverall, sumQuestion, maxQuestion, _i, panels_1, panel, scorecards, sc, questionData, questionScore, combined, maxPossible, e_10;
                                var _a, _b, _c, _d;
                                return tslib_1.__generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            gpa = null;
                                            _e.label = 1;
                                        case 1:
                                            _e.trys.push([1, 7, , 8]);
                                            return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                    Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                                    Select: "ID,InterviewLevel,CandidateID/ID",
                                                    Expand: "CandidateID",
                                                    Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: item.ID }],
                                                })];
                                        case 2:
                                            panels = _e.sent();
                                            level1Count = panels.filter(function (p) { return p.InterviewLevel === "Level 1"; }).length;
                                            maxOverallScore = level1Count * 40;
                                            sumOverall = 0;
                                            sumQuestion = 0;
                                            maxQuestion = 0;
                                            _i = 0, panels_1 = panels;
                                            _e.label = 3;
                                        case 3:
                                            if (!(_i < panels_1.length)) return [3 /*break*/, 6];
                                            panel = panels_1[_i];
                                            return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                    Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                                    Select: "*",
                                                    Filter: [{ FilterKey: "InterviewPanelIDId", Operator: "eq", FilterValue: panel.ID }],
                                                })];
                                        case 4:
                                            scorecards = _e.sent();
                                            if (scorecards.length > 0) {
                                                sc = scorecards[0];
                                                sumOverall +=
                                                    (Number(sc.RelevantQualification) || 0) +
                                                        (Number(sc.ReleventExperience) || 0) +
                                                        (Number(sc.Knowledge) || 0) +
                                                        (Number(sc.EnergyLevel) || 0) +
                                                        (Number(sc.MeetJobRequirement) || 0) +
                                                        (Number(sc.ContributeTowardsCultureRequried) || 0) +
                                                        (Number(sc.Experience) || 0) +
                                                        (Number(sc.OtherCriteriaScore) || 0);
                                                questionData = _parseJson(sc.QuestionJson);
                                                questionScore = questionData.reduce(function (sum, q) { return sum + (Number(Object.values(q)[0]) || 0); }, 0);
                                                sumQuestion += questionScore;
                                                maxQuestion += questionData.length * 3;
                                            }
                                            _e.label = 5;
                                        case 5:
                                            _i++;
                                            return [3 /*break*/, 3];
                                        case 6:
                                            combined = sumOverall + sumQuestion;
                                            maxPossible = maxOverallScore + maxQuestion;
                                            if (maxPossible > 0)
                                                gpa = Math.floor((combined / maxPossible) * 5 * 100) / 100;
                                            return [3 /*break*/, 8];
                                        case 7:
                                            e_10 = _e.sent();
                                            console.warn("GPA calc error for candidate", item.ID, e_10);
                                            return [3 /*break*/, 8];
                                        case 8: return [2 /*return*/, {
                                                id: item.ID,
                                                recruitmentID: ((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.ID) || recruitmentID,
                                                jobCode: ((_b = item.JobCode) === null || _b === void 0 ? void 0 : _b.JobCode) || "",
                                                jobCodeID: item.JobCodeId || jobCodeID,
                                                fullName: [item.FristName, item.MiddleName, item.LastName].filter(Boolean).join(" ").trim(),
                                                nationality: item.Nationality || "",
                                                gender: item.Gender || "",
                                                status: ((_c = item.Status) === null || _c === void 0 ? void 0 : _c.StatusDescription) || item.Status || "",
                                                statusId: item.StatusId || ((_d = item.Status) === null || _d === void 0 ? void 0 : _d.ID) || 0,
                                                interviewDate: item.InterviewDate || "",
                                                interviewLevel: item.InterviewLevel || "",
                                                grade: item.JobGrade || "",
                                                department: item.Department || "",
                                                gpa: gpa !== null ? String(gpa) : "",
                                                positionTitle: item.PositionTitle || "",
                                                disability: item.Disability || "",
                                                jobTitle: item.JobTitle || "",
                                            }];
                                    }
                                });
                            }); }))];
                    case 2:
                        enrichedWithGPA = _a.sent();
                        return [2 /*return*/, enrichedWithGPA];
                    case 3:
                        e_9 = _a.sent();
                        console.error("fetchScorecardCandidates error", e_9);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    fetchScoreData: function (candidateID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var panels, results, _i, _a, p, sc, s, e_11;
            var _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewLevel",
                                Expand: "InterviewPanel",
                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }],
                            })];
                    case 1:
                        panels = _d.sent();
                        results = [];
                        _i = 0, _a = (panels || []);
                        _d.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        p = _a[_i];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                Select: "*",
                                Filter: [{ FilterKey: "InterviewPanelIDId", Operator: "eq", FilterValue: p.ID }],
                            })];
                    case 3:
                        sc = _d.sent();
                        if (sc === null || sc === void 0 ? void 0 : sc.length) {
                            s = sc[0];
                            // DEBUG: verify panel score values coming from API for this panel member
                            console.log("[fetchScoreData] candidateID:", candidateID, "panelID:", p.ID, "panelName:", (_b = p.InterviewPanel) === null || _b === void 0 ? void 0 : _b.Title);
                            console.log("[fetchScoreData] raw scorecard response:", s);
                            console.log("[fetchScoreData] mapped score values:", {
                                RelevantQualification: s.RelevantQualification || "0",
                                ReleventExperience: s.ReleventExperience || "0",
                                Knowledge: s.Knowledge || "0",
                                EnergyLevel: s.EnergyLevel || "0",
                                MeetJobRequirement: s.MeetJobRequirement || "0",
                                ContributeTowardsCultureRequried: s.ContributeTowardsCultureRequried || "0",
                                Experience: s.Experience || "0",
                                OtherCriteriaScore: s.OtherCriteriaScore || "0",
                            });
                            results.push({
                                InterviewPanelID: p.ID,
                                RelevantQualification: s.RelevantQualification || "0",
                                ReleventExperience: s.ReleventExperience || "0",
                                Knowledge: s.Knowledge || "0",
                                EnergyLevel: s.EnergyLevel || "0",
                                MeetJobRequirement: s.MeetJobRequirement || "0",
                                ContributeTowardsCultureRequried: s.ContributeTowardsCultureRequried || "0",
                                Experience: s.Experience || "0",
                                OtherCriteriaScore: s.OtherCriteriaScore || "0",
                                ConsiderForEmployment: s.ConsiderForEmployment || "",
                                OverAllEvaluationFeedback: s.OverAllEvaluationFeedback || "",
                                QuestionJson: _parseJson(s.QuestionJson),
                                InterviewPersonName: ((_c = p.InterviewPanel) === null || _c === void 0 ? void 0 : _c.Title) || "",
                                CreatedDate: s.Created || "",
                            });
                        }
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, results];
                    case 6:
                        e_11 = _d.sent();
                        console.error("[fetchScoreData] error", e_11);
                        return [2 /*return*/, []];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    fetchPanelByLevel: function (candidateID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var panels, uniqueEmails, emailToName_1, grouped, _i, _a, p, lvl, name_1, e_12;
            var _this = this;
            var _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "InterviewLevel,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail",
                                Expand: "InterviewPanel",
                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }],
                            })];
                    case 1:
                        panels = _e.sent();
                        uniqueEmails = Array.from(new Set((panels || []).map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; }).filter(Boolean)));
                        emailToName_1 = {};
                        return [4 /*yield*/, Promise.all(uniqueEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var sage, u, name_2, _a;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                    Listname: Config_1.ListNames.HRMSSageList,
                                                    Select: "EmailId,FirstName,LastName,MiddleName",
                                                    Filter: [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
                                                })];
                                        case 1:
                                            sage = _b.sent();
                                            if (sage === null || sage === void 0 ? void 0 : sage.length) {
                                                u = sage[0];
                                                name_2 = [u.FirstName, u.MiddleName, u.LastName].filter(Boolean).join(" ").trim();
                                                if (name_2)
                                                    emailToName_1[email.toLowerCase()] = name_2;
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = _b.sent();
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _e.sent();
                        grouped = {};
                        for (_i = 0, _a = (panels || []); _i < _a.length; _i++) {
                            p = _a[_i];
                            lvl = p.InterviewLevel || "Level 1";
                            name_1 = emailToName_1[((_c = (_b = p.InterviewPanel) === null || _b === void 0 ? void 0 : _b.EMail) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || ""] || ((_d = p.InterviewPanel) === null || _d === void 0 ? void 0 : _d.Title) || "";
                            if (!grouped[lvl])
                                grouped[lvl] = [];
                            if (name_1 && !grouped[lvl].includes(name_1))
                                grouped[lvl].push(name_1);
                        }
                        return [2 /*return*/, grouped];
                    case 3:
                        e_12 = _e.sent();
                        return [2 /*return*/, {}];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // ─────────────────────────────────────────────────────────────────────────
    // fetchComments
    //
    // MIRRORS old HodViewScorecard OpenComments() exactly:
    //
    // Level 1 source: HRMSCandidateScoreCard (joined through InterviewPanel)
    //   Old code: InterviewServices.getInterviewPanelDetails(filterConditions, "", candidateID, EmployeeList)
    //   → internally calls getCandidateScoreCard which filters by:
    //       InterviewPanelID/CandidateID/ID eq candidateID
    //   → maps: Feedback → comments, OverAllEvaluationFeedback, Role.RoleTitle → RoleName
    //           Author → Name, JobTitleInEnglish, JobTitleInFrench, Department (from EmployeeList)
    //
    // Level 2 source: HRMSCandidateLevel2ScoreCard
    //   Old code: InterviewServices.getCandidateLevel2ScoreCardData(...)
    //   → filters by CandidateIDId eq candidateID
    //   → maps: Comments → comments, Role.RoleTitle → RoleName, Author → Name
    //
    // Image 3 shows: "Submitted by Recruitment HR" → "Overall Feedback Level 1" → value
    // This "Overall Feedback Level 1" = HRMSCandidateScoreCard.OverAllEvaluationFeedback
    // "Feedback Level 1" = HRMSCandidateScoreCard.Feedback
    // ─────────────────────────────────────────────────────────────────────────
    fetchComments: function (candidateID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var panelItems, scoreItems, scorecardMap_1, authorEmails, emailToEmployee_1, _4, level1, seen, _i, _a, panel, panelID, scoreCard, authorEmail, employee, firstName, middleName, lastName, fullName, jobTitleEn, jobTitleFr, department, l2Items, l2AuthorEmails, l2EmailToEmployee_1, _5, level2, e_13;
            var _this = this;
            var _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID, CandidateID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail",
                                Expand: "InterviewPanel, CandidateID",
                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }],
                            }).catch(function () { return []; })];
                    case 1:
                        panelItems = _e.sent();
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                Select: "InterviewPanelID/ID, Feedback, OverAllEvaluationFeedback, Role/RoleTitle, InterviewPersonName/Title, Author/Title, Author/EMail, Created, QuestionJson, RecruitmentID/ID",
                                Expand: "InterviewPanelID, Role, InterviewPersonName, Author, RecruitmentID",
                                FilterCondition: "and",
                                Filter: [
                                    {
                                        FilterKey: "InterviewPanelID/CandidateID/ID",
                                        Operator: "eq",
                                        FilterValue: candidateID,
                                    },
                                ],
                            }).catch(function () { return []; })];
                    case 2:
                        scoreItems = _e.sent();
                        scorecardMap_1 = new Map();
                        (scoreItems || []).forEach(function (sc) {
                            var _a;
                            var pid = ((_a = sc.InterviewPanelID) === null || _a === void 0 ? void 0 : _a.ID) || 0;
                            if (pid)
                                scorecardMap_1.set(pid, sc);
                        });
                        authorEmails = Array.from(new Set((scoreItems || [])
                            .map(function (sc) { var _a; return (_a = sc.Author) === null || _a === void 0 ? void 0 : _a.EMail; })
                            .filter(Boolean)));
                        emailToEmployee_1 = {};
                        if (!(authorEmails.length > 0)) return [3 /*break*/, 6];
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, Promise.all(authorEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var sage;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                Listname: Config_1.ListNames.HRMSSageList,
                                                Select: "EmailId, FirstName, MiddleName, LastName, JobTitle, JobTitleInEnglish, JobTitleInFrench, Department, DepartmentName",
                                                Filter: [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
                                            })];
                                        case 1:
                                            sage = _a.sent();
                                            if (sage === null || sage === void 0 ? void 0 : sage.length)
                                                emailToEmployee_1[email.toLowerCase()] = sage[0];
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 4:
                        _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _4 = _e.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        level1 = [];
                        seen = new Set();
                        for (_i = 0, _a = (panelItems || []); _i < _a.length; _i++) {
                            panel = _a[_i];
                            panelID = panel.ID;
                            scoreCard = scorecardMap_1.get(panelID);
                            if (!scoreCard)
                                continue;
                            if (seen.has(panelID))
                                continue;
                            seen.add(panelID);
                            authorEmail = (((_b = scoreCard.Author) === null || _b === void 0 ? void 0 : _b.EMail) || "").toLowerCase();
                            employee = emailToEmployee_1[authorEmail];
                            firstName = (employee === null || employee === void 0 ? void 0 : employee.FirstName) || "";
                            middleName = (employee === null || employee === void 0 ? void 0 : employee.MiddleName) || "";
                            lastName = (employee === null || employee === void 0 ? void 0 : employee.LastName) || "";
                            fullName = [firstName, middleName, lastName].filter(Boolean).join(" ").trim()
                                || ((_c = scoreCard.Author) === null || _c === void 0 ? void 0 : _c.Title) || "";
                            jobTitleEn = (employee === null || employee === void 0 ? void 0 : employee.JobTitleInEnglish) || (employee === null || employee === void 0 ? void 0 : employee.JobTitle) || "";
                            jobTitleFr = (employee === null || employee === void 0 ? void 0 : employee.JobTitleInFrench) || "";
                            department = (employee === null || employee === void 0 ? void 0 : employee.DepartmentName) || (employee === null || employee === void 0 ? void 0 : employee.Department) || "";
                            level1.push({
                                Id: panelID,
                                Name: fullName,
                                JobTitleInEnglish: jobTitleEn,
                                JobTitleInFrench: jobTitleFr,
                                Department: department,
                                Date: scoreCard.Created || null,
                                // RoleName: old code uses Role?.RoleTitle from scorecard
                                RoleName: ((_d = scoreCard.Role) === null || _d === void 0 ? void 0 : _d.RoleTitle) || "",
                                // comments = Feedback field (NOT Comments field) from HRMSCandidateScoreCard
                                comments: scoreCard.Feedback || "",
                                OverAllEvaluationFeedback: scoreCard.OverAllEvaluationFeedback || "",
                                Level: "Level 1",
                            });
                        }
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                                Select: "ID, CandidateID/ID, CandidateID/Title, Comments, Role/ID, Role/RoleTitle, Level, Author/Title, Author/EMail, Created",
                                Expand: "CandidateID, Role, Author",
                                Filter: [{ FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateID }],
                            }).catch(function () { return []; })];
                    case 7:
                        l2Items = _e.sent();
                        l2AuthorEmails = Array.from(new Set((l2Items || []).map(function (i) { var _a; return (_a = i.Author) === null || _a === void 0 ? void 0 : _a.EMail; }).filter(Boolean)));
                        l2EmailToEmployee_1 = tslib_1.__assign({}, emailToEmployee_1);
                        if (!(l2AuthorEmails.length > 0)) return [3 /*break*/, 11];
                        _e.label = 8;
                    case 8:
                        _e.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, Promise.all(l2AuthorEmails
                                .filter(function (e) { return !l2EmailToEmployee_1[e.toLowerCase()]; })
                                .map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var sage;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                Listname: Config_1.ListNames.HRMSSageList,
                                                Select: "EmailId, FirstName, MiddleName, LastName, JobTitle, JobTitleInEnglish, JobTitleInFrench, Department, DepartmentName",
                                                Filter: [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }],
                                            })];
                                        case 1:
                                            sage = _a.sent();
                                            if (sage === null || sage === void 0 ? void 0 : sage.length)
                                                l2EmailToEmployee_1[email.toLowerCase()] = sage[0];
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 9:
                        _e.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        _5 = _e.sent();
                        return [3 /*break*/, 11];
                    case 11:
                        level2 = (l2Items || []).map(function (item) {
                            var _a, _b, _c;
                            var authorEmail = (((_a = item.Author) === null || _a === void 0 ? void 0 : _a.EMail) || "").toLowerCase();
                            var employee = l2EmailToEmployee_1[authorEmail];
                            var firstName = (employee === null || employee === void 0 ? void 0 : employee.FirstName) || "";
                            var middleName = (employee === null || employee === void 0 ? void 0 : employee.MiddleName) || "";
                            var lastName = (employee === null || employee === void 0 ? void 0 : employee.LastName) || "";
                            var fullName = [firstName, middleName, lastName].filter(Boolean).join(" ").trim()
                                || ((_b = item.Author) === null || _b === void 0 ? void 0 : _b.Title) || "";
                            return {
                                Id: item.ID,
                                Name: fullName,
                                JobTitleInEnglish: (employee === null || employee === void 0 ? void 0 : employee.JobTitleInEnglish) || (employee === null || employee === void 0 ? void 0 : employee.JobTitle) || "",
                                JobTitleInFrench: (employee === null || employee === void 0 ? void 0 : employee.JobTitleInFrench) || "",
                                Department: (employee === null || employee === void 0 ? void 0 : employee.DepartmentName) || (employee === null || employee === void 0 ? void 0 : employee.Department) || "",
                                Date: item.Created || null,
                                RoleName: ((_c = item.Role) === null || _c === void 0 ? void 0 : _c.RoleTitle) || "",
                                comments: item.Comments || "",
                                OverAllEvaluationFeedback: "",
                                Level: "Level 2",
                            };
                        });
                        console.log("[fetchComments] candidateID:", candidateID, "level1 count:", level1.length, "level2 count:", level2.length, "level1:", level1, "level2:", level2);
                        return [2 /*return*/, { level1: level1, level2: level2 }];
                    case 12:
                        e_13 = _e.sent();
                        console.error("[fetchComments] error:", e_13);
                        return [2 /*return*/, { level1: [], level2: [] }];
                    case 13: return [2 /*return*/];
                }
            });
        });
    },
    fetchPositionOptions: function (jobCodeID, department) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var filterConditions, res, fallback, e_14;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        filterConditions = [
                            { FilterKey: "JobCode", Operator: "eq", FilterValue: jobCodeID },
                            { FilterKey: "Department", Operator: "eq", FilterValue: department },
                            { FilterKey: "PositionIDStatus", Operator: "eq", FilterValue: "Recruitment Initiator" },
                        ];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSPositionIDMaster,
                                Select: "*,JobCode/JobCode",
                                Expand: "JobCode",
                                FilterCondition: "and",
                                Filter: filterConditions,
                                Topcount: 100,
                            })];
                    case 1:
                        res = _a.sent();
                        if (res && res.length > 0) {
                            return [2 /*return*/, res.map(function (item) { return ({
                                    key: item.ID,
                                    text: item.PositionID || item.Title || "#".concat(item.ID),
                                }); })];
                        }
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSPositionIDMaster,
                                Select: "*",
                                Filter: [
                                    { FilterKey: "Department", Operator: "eq", FilterValue: department },
                                    { FilterKey: "PositionIDStatus", Operator: "eq", FilterValue: "Recruitment Initiator" },
                                ],
                                Topcount: 100,
                            })];
                    case 2:
                        fallback = _a.sent();
                        return [2 /*return*/, (fallback || []).map(function (item) { return ({
                                key: item.ID,
                                text: item.PositionID || item.Title || "#".concat(item.ID),
                            }); })];
                    case 3:
                        e_14 = _a.sent();
                        console.error("[fetchPositionOptions] error:", e_14);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
};
// ─────────────────────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────────────────────
function _parseJson(raw) {
    if (!raw)
        return [];
    if (Array.isArray(raw))
        return raw;
    try {
        return JSON.parse(raw);
    }
    catch (_a) {
        return [];
    }
}
// Mirrors old insertOrUpdateCandidateCommentLevel1()
function _insertOrUpdateLevel1Comment(candidateId_1, roleId_1, comments_1) {
    return tslib_1.__awaiter(this, arguments, void 0, function (candidateId, roleId, comments, level) {
        var existing, match, e_15;
        if (level === void 0) { level = ""; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                            Select: "*",
                            Filter: [{ FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateId }],
                        })];
                case 1:
                    existing = _a.sent();
                    match = existing.find(function (item) {
                        var _a;
                        return (item.CandidateIDId === candidateId ||
                            ((_a = item.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) === candidateId ||
                            item.CandidateID === candidateId) &&
                            item.RoleId === roleId;
                    });
                    if (!match) return [3 /*break*/, 3];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                            RequestJSON: { Comments: comments, Level: level },
                            ID: match.ID,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, spservice_1.default.SPAddItem({
                        Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                        RequestJSON: {
                            CandidateIDId: candidateId,
                            Comments: comments,
                            RoleId: roleId,
                            Level: level,
                        },
                    })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_15 = _a.sent();
                    console.error("[_insertOrUpdateLevel1Comment] error:", e_15);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Mirrors old insertOrUpdateLevel2ScorecardComment()
function _insertOrUpdateLevel2Comment(candidateId_1, roleId_1, comments_1) {
    return tslib_1.__awaiter(this, arguments, void 0, function (candidateId, roleId, comments, level) {
        var existing, match, e_16;
        if (level === void 0) { level = ""; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                            Select: "*",
                            Filter: [{ FilterKey: "CandidateIDId", Operator: "eq", FilterValue: candidateId }],
                        })];
                case 1:
                    existing = _a.sent();
                    match = existing.find(function (item) { var _a; return ((_a = item.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) === candidateId && item.RoleId === roleId; });
                    if (!match) return [3 /*break*/, 3];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                            RequestJSON: { Comments: comments, Level: level },
                            ID: match.ID,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, spservice_1.default.SPAddItem({
                        Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                        RequestJSON: {
                            CandidateIDId: candidateId,
                            Comments: comments,
                            RoleId: roleId,
                            Level: level,
                        },
                    })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_16 = _a.sent();
                    console.error("[_insertOrUpdateLevel2Comment] error:", e_16);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Mirrors old handleAssignPosition()
function _assignPositionID(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var positionId, candidateId, recruitmentID, posRes, selectedPos, e_17;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    positionId = params.positionId, candidateId = params.candidateId, recruitmentID = params.recruitmentID;
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSPositionIDMaster,
                            Select: "*",
                            Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: positionId }],
                        })];
                case 1:
                    posRes = _a.sent();
                    if (!posRes || posRes.length === 0)
                        return [2 /*return*/];
                    selectedPos = posRes[0];
                    // Insert into HRMSSelectedCandidateDetailsByHOD (mirrors old AssignPositionID)
                    return [4 /*yield*/, spservice_1.default.SPAddItem({
                            Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                            RequestJSON: {
                                PositionIDId: selectedPos.ID,
                                CandidateIDId: candidateId,
                                RecruitmentIDId: recruitmentID,
                                ItemCreated: "Yes",
                                ActionId: EvaluationConfig_1.WorkflowAction.Submitted,
                                StatusId: Config_1.StatusId.Pending,
                            },
                        })];
                case 2:
                    // Insert into HRMSSelectedCandidateDetailsByHOD (mirrors old AssignPositionID)
                    _a.sent();
                    // Update PositionID status to RecruitmentInProgress
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSPositionIDMaster,
                            RequestJSON: { PositionIDStatus: "Recruitment In Progress" },
                            ID: selectedPos.ID,
                        })];
                case 3:
                    // Update PositionID status to RecruitmentInProgress
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_17 = _a.sent();
                    console.error("[_assignPositionID] error:", e_17);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────
// EvaluationServiceHelper — ORIGINAL (unchanged)
// ─────────────────────────────────────────────────────────────
exports.EvaluationServiceHelper = {
    buildRow: function (candidate, grade, level, jobCodeID) {
        var _a, _b, _c, _d, _e;
        var rawDate = (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewDateLevel2) || (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewDate) || "";
        var formattedLevel = level === EvaluationConfig_1.InterviewLevels.Level2 ? EvaluationConfig_1.InterviewLevels.Levels2 : level;
        var interviewDateTime = rawDate ? (0, moment_1.default)(rawDate).format("DD/MM/YYYY") : "";
        var fName = candidate.FristName || "";
        var lName = candidate.LastName || "";
        return {
            id: candidate.ID,
            applicantName: (fName + " " + lName).trim(),
            positionTitle: candidate.PositionTitle || "",
            interviewDate: interviewDateTime,
            interviewDateTime: rawDate,
            interviewLevel: formattedLevel,
            grade: grade,
            gradeLabel: "",
            attachments: ((_a = candidate.CandidateCVDoc) === null || _a === void 0 ? void 0 : _a.length) || 0,
            status: ((_b = candidate.Status) === null || _b === void 0 ? void 0 : _b.StatusDescription) || candidate.Status || "",
            statusId: candidate.StatusId || ((_c = candidate.Status) === null || _c === void 0 ? void 0 : _c.ID) || ((_d = candidate.Status) === null || _d === void 0 ? void 0 : _d.Id) || "",
            recruitmentID: ((_e = candidate.RecruitmentID) === null || _e === void 0 ? void 0 : _e.ID) || candidate.RecruitmentID || "",
            jobCodeID: jobCodeID,
        };
    },
};
//# sourceMappingURL=EvaluationApiService.js.map