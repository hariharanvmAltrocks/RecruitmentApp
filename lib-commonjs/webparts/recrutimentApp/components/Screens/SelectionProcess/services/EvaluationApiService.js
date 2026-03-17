"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationServiceHelper = exports.evaluationService = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var EvaluationConfig_1 = require("../config/EvaluationConfig");
var Config_1 = require("../../../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var CommonServices_1 = tslib_1.__importDefault(require("../CommonServices/CommonServices"));
var QuestionnaireApi_1 = tslib_1.__importDefault(require("./QuestionnaireApi/QuestionnaireApi"));
var commonServiceInstance = new CommonServices_1.default();
var questionnaireService = new QuestionnaireApi_1.default();
exports.evaluationService = {
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
                                Topcount: 5000
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
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }]
                            })];
                    case 2:
                        dptRes = _g.sent();
                        jobCodeID = ((_a = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _a === void 0 ? void 0 : _a.JobCodeId) || ((_c = (_b = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _b === void 0 ? void 0 : _b.JobCode) === null || _c === void 0 ? void 0 : _c.ID) || 0;
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentPositionDetails,
                                Select: "*,PatersonGrade/PatersonGrade",
                                Expand: "PatersonGrade",
                                Filter: [{ FilterKey: "RecruitmentID", Operator: "eq", FilterValue: recruitmentID }]
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
                                if (data && data.length > 0) {
                                    level = ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.Levels) || "";
                                }
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
                                    Value: item.IsScoreSheetUploaded === "Yes" ? "Completed" : "Pending"
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
                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID }]
                            })];
                    case 2:
                        candidatePanels = _a.sent();
                        userPanels = candidatePanels.filter(function (p) { var _a, _b; return ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === null || _b === void 0 ? void 0 : _b.toString()) === currentUserKey_1; });
                        if (!userPanels.length)
                            return [2 /*return*/, { canProceed: true }];
                        if (statusId === Config_1.StatusId.InterviewScheduled) {
                            already = userPanels.filter(function (p) { return p.InterviewLevel === EvaluationConfig_1.InterviewLevels.Level1; }).some(function (p) { return p.IsScoreSheetUploaded === "Yes"; });
                            return [2 /*return*/, already ? { canProceed: false, level: EvaluationConfig_1.InterviewLevels.Level1 } : { canProceed: true }];
                        }
                        if (statusId === Config_1.StatusId.InterviewScheduledforLevel2) {
                            already = userPanels.filter(function (p) { return p.InterviewLevel === EvaluationConfig_1.InterviewLevels.Level2; }).some(function (p) { return p.IsScoreSheetUploaded === "Yes"; });
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
            var candidateRes, candidate, panelRes, currentUserGuid_1, currentUserPanel, panelEmails, uniqueEmails, emailToNameMap_1, err_1, formattedPanelMembers, reviewerName, jobTitleEn, jobTitleFr, sageRes, sageUser, fName, mName, lName, err_2, dptRes, jobCodeId, jobUniqueKey, integrationRes, err_3, questions, qResponse, err_4, error_1;
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
                                var sageRes, item, fName, mName, lName, fullName;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                Listname: Config_1.ListNames.HRMSSageList,
                                                Select: "EmailId, FirstName, LastName, MiddleName",
                                                Filter: [{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }]
                                            })];
                                        case 1:
                                            sageRes = _a.sent();
                                            if (sageRes && sageRes.length > 0) {
                                                item = sageRes[0];
                                                fName = item.FirstName || "";
                                                mName = item.MiddleName || "";
                                                lName = item.LastName || "";
                                                fullName = (fName + " " + mName + " " + lName).trim();
                                                if (fullName) {
                                                    emailToNameMap_1[email.toLowerCase()] = fullName;
                                                }
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
                        formattedPanelMembers = panelRes.map(function (p) {
                            var _a, _b, _c;
                            var email = ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
                            return emailToNameMap_1[email] || ((_c = p.InterviewPanel) === null || _c === void 0 ? void 0 : _c.Title) || "Unknown";
                        }).filter(Boolean);
                        console.log("====== EVALUATION FORM: INTERVIEW PANEL TITLES (Fetched from Sage List) ======");
                        console.log(formattedPanelMembers);
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
                                Filter: [{ FilterKey: "EmailId", Operator: "eq", FilterValue: currentUserEmail }],
                            })];
                    case 9:
                        sageRes = _j.sent();
                        if (sageRes && sageRes.length > 0) {
                            sageUser = sageRes[0];
                            fName = sageUser.FirstName || "";
                            mName = sageUser.MiddleName || "";
                            lName = sageUser.LastName || "";
                            reviewerName = (fName + " " + mName + " " + lName).trim();
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
                            Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentId }]
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
                                Filter: [
                                    { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeId },
                                    { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
                                ],
                                FilterCondition: "and",
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
                        return [2 /*return*/, { success: false, candidateData: null, panelMembers: [], currentUserPanelId: null, questions: [] }];
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
                        _c.trys.push([0, 5, , 6]);
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
                        console.log("====== SUBMIT DEBUG: PAYLOAD SENT TO SP ======");
                        console.log("Payload mapped to SP columns:", spPayload);
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                RequestJSON: spPayload,
                            })];
                    case 1:
                        scoreCardResponse = _c.sent();
                        newItemId = (scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.ID) || (scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.Id) || ((_a = scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.data) === null || _a === void 0 ? void 0 : _a.ID) || ((_b = scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.data) === null || _b === void 0 ? void 0 : _b.Id);
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
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _c.sent();
                        console.error("====== SUBMIT DEBUG: CATCH ERROR ======", error_2);
                        return [2 /*return*/, { success: false, message: "An error occurred while submitting." }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
};
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
    }
};
//# sourceMappingURL=EvaluationApiService.js.map