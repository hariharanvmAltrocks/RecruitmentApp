"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationServiceHelper = exports.evaluationService = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var EvaluationConfig_1 = require("../config/EvaluationConfig");
var Config_1 = require("../../../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var CommonServices_1 = tslib_1.__importDefault(require("../CommonServices/CommonServices"));
// Import the GetPortalJobs class from your QuestionnaireApi file
var QuestionnaireApi_1 = tslib_1.__importDefault(require("./QuestionnaireApi/QuestionnaireApi"));
var commonServiceInstance = new CommonServices_1.default();
// Instantiate the class so you can use its methods!
var questionnaireService = new QuestionnaireApi_1.default();
exports.evaluationService = {
    // ==========================================
    // DASHBOARD METHODS
    // ==========================================
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
                        return [2 /*return*/, listItems !== null && listItems !== void 0 ? listItems : []];
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
                        return [2 /*return*/, listItems !== null && listItems !== void 0 ? listItems : []];
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return tslib_1.__generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        grade = "";
                        level = "";
                        jobCodeID = 0;
                        _l.label = 1;
                    case 1:
                        _l.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "*,JobCodeId,JobCode/ID",
                                Expand: "JobCode",
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }]
                            })];
                    case 2:
                        dptRes = _l.sent();
                        jobCodeID = (_e = (_b = (_a = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _a === void 0 ? void 0 : _a.JobCodeId) !== null && _b !== void 0 ? _b : (_d = (_c = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _c === void 0 ? void 0 : _c.JobCode) === null || _d === void 0 ? void 0 : _d.ID) !== null && _e !== void 0 ? _e : 0;
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentPositionDetails,
                                Select: "*,PatersonGrade/PatersonGrade",
                                Expand: "PatersonGrade",
                                Filter: [{ FilterKey: "RecruitmentID", Operator: "eq", FilterValue: recruitmentID }]
                            })];
                    case 3:
                        posRes = _l.sent();
                        grade = (_k = (_h = (_g = (_f = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _f === void 0 ? void 0 : _f.PatersonGrade) === null || _g === void 0 ? void 0 : _g.PatersonGrade) !== null && _h !== void 0 ? _h : (_j = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _j === void 0 ? void 0 : _j.PatersonGrade) !== null && _k !== void 0 ? _k : "";
                        if (!grade) return [3 /*break*/, 5];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSGradeMaster,
                                Select: "*",
                                Filter: [{ FilterKey: "PatersonGrade", Operator: "eq", FilterValue: grade }],
                            }).then(function (data) {
                                var _a, _b;
                                if (data && data.length > 0) {
                                    level = (_b = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.Levels) !== null && _b !== void 0 ? _b : "";
                                }
                            })];
                    case 4:
                        _l.sent();
                        _l.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_4 = _l.sent();
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
    // ==========================================
    // EVALUATION FORM METHODS (Scorecard View)
    // ==========================================
    getEvaluationFormData: function (candidateId, recruitmentId, currentUserEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var candidateRes, candidate, panelRes, currentUserGuid_1, currentUserPanel, dptRes, jobCodeString, questions, qResponse, err_1, error_1;
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: "*",
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: candidateId }],
                            })];
                    case 1:
                        candidateRes = _d.sent();
                        candidate = candidateRes[0] || {};
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewLevel,IsScoreSheetUploaded",
                                Expand: "InterviewPanel",
                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateId }],
                            })];
                    case 2:
                        panelRes = _d.sent();
                        return [4 /*yield*/, this.getCurrentUserGuid(currentUserEmail)];
                    case 3:
                        currentUserGuid_1 = _d.sent();
                        currentUserPanel = panelRes.find(function (p) { var _a; return String((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === String(currentUserGuid_1); });
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "*,JobCode/JobCode",
                                Expand: "JobCode",
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentId }]
                            })];
                    case 4:
                        dptRes = _d.sent();
                        jobCodeString = (_c = (_b = (_a = dptRes === null || dptRes === void 0 ? void 0 : dptRes[0]) === null || _a === void 0 ? void 0 : _a.JobCode) === null || _b === void 0 ? void 0 : _b.JobCode) !== null && _c !== void 0 ? _c : "";
                        questions = [];
                        if (!jobCodeString) return [3 /*break*/, 8];
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, questionnaireService.getQuestionnaire(jobCodeString)];
                    case 6:
                        qResponse = _d.sent();
                        if (qResponse === null || qResponse === void 0 ? void 0 : qResponse.data) {
                            questions = qResponse.data;
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _d.sent();
                        console.error("Error fetching questionnaires from API:", err_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, {
                            success: true,
                            candidateData: candidate,
                            panelMembers: panelRes.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Title; }).filter(Boolean),
                            currentUserPanelId: (currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) || null,
                            questions: questions,
                        }];
                    case 9:
                        error_1 = _d.sent();
                        console.error("Error fetching evaluation form data:", error_1);
                        return [2 /*return*/, { success: false, candidateData: null, panelMembers: [], currentUserPanelId: null, questions: [] }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    },
    submitScorecard: function (payload, panelId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var scoreCardResponse, error_2;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                RequestJSON: payload,
                            })];
                    case 1:
                        scoreCardResponse = _b.sent();
                        if (!((_a = scoreCardResponse === null || scoreCardResponse === void 0 ? void 0 : scoreCardResponse.data) === null || _a === void 0 ? void 0 : _a.ID)) return [3 /*break*/, 3];
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                RequestJSON: { IsScoreSheetUploaded: "Yes" },
                                ID: panelId,
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, { success: true, message: "Scorecard submitted successfully!" }];
                    case 3: return [2 /*return*/, { success: false, message: "Failed to submit scorecard." }];
                    case 4:
                        error_2 = _b.sent();
                        console.error("Error submitting scorecard:", error_2);
                        return [2 /*return*/, { success: false, message: "An error occurred while submitting." }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
};
exports.EvaluationServiceHelper = {
    buildRow: function (candidate, grade, level, jobCodeID) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var rawDate = (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewDateLevel2) || (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewDate) || "";
        var formattedLevel = level === EvaluationConfig_1.InterviewLevels.Level2 ? EvaluationConfig_1.InterviewLevels.Levels2 : level;
        // Formatting the date to DD/MM/YYYY for the UI
        var interviewDateTime = rawDate ? (0, moment_1.default)(rawDate).format("DD/MM/YYYY") : "";
        return {
            id: candidate.ID,
            applicantName: "".concat((_a = candidate.FristName) !== null && _a !== void 0 ? _a : "", " ").concat((_b = candidate.LastName) !== null && _b !== void 0 ? _b : "").trim(),
            positionTitle: (_c = candidate.PositionTitle) !== null && _c !== void 0 ? _c : "",
            // Display format
            interviewDate: interviewDateTime,
            // Raw string format for Logic sorting/comparing
            interviewDateTime: rawDate,
            interviewLevel: formattedLevel,
            grade: grade,
            gradeLabel: "",
            attachments: (_e = (_d = candidate.CandidateCVDoc) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0,
            status: (_h = (_g = (_f = candidate.Status) === null || _f === void 0 ? void 0 : _f.StatusDescription) !== null && _g !== void 0 ? _g : candidate.Status) !== null && _h !== void 0 ? _h : "",
            statusId: (_o = (_l = (_j = candidate.StatusId) !== null && _j !== void 0 ? _j : (_k = candidate.Status) === null || _k === void 0 ? void 0 : _k.ID) !== null && _l !== void 0 ? _l : (_m = candidate.Status) === null || _m === void 0 ? void 0 : _m.Id) !== null && _o !== void 0 ? _o : "",
            recruitmentID: (_r = (_q = (_p = candidate.RecruitmentID) === null || _p === void 0 ? void 0 : _p.ID) !== null && _q !== void 0 ? _q : candidate.RecruitmentID) !== null && _r !== void 0 ? _r : "",
            jobCodeID: jobCodeID,
        };
    }
};
//# sourceMappingURL=EvaluationApiService.js.map