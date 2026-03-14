"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationServiceHelper = exports.evaluationService = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var EvaluationConfig_1 = require("../config/EvaluationConfig");
var Config_1 = require("../../../../utilities/Config");
var CommonServices_1 = tslib_1.__importDefault(require("../CommonServices/CommonServices"));
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var commonServiceInstance = new CommonServices_1.default();
exports.evaluationService = {
    getCurrentUserGuid: function (email) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, e_1;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!email) {
                            console.warn("⚠️ [Service] Email is empty! Cannot fetch User ID.");
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, commonServiceInstance.getUserGuidByEmail(email)];
                    case 1:
                        response = _b.sent();
                        if ((response === null || response === void 0 ? void 0 : response.status) === 200 && ((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.key)) {
                            return [2 /*return*/, String(response.data.key)];
                        }
                        return [2 /*return*/, null];
                    case 2:
                        e_1 = _b.sent();
                        console.error("❌ [Service] getCurrentUserGuid error:", e_1);
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
                                    // 🟢 ஹார்ட்கோட் எண்களுக்குப் பதிலாக ஒரிஜினல் StatusId-ஐப் பயன்படுத்துகிறோம்
                                    { FilterKey: "StatusId", Operator: "in", FilterValue: [Config_1.StatusId.InterviewScheduled, Config_1.StatusId.InterviewScheduledforLevel2] },
                                    { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
                                    { FilterKey: "ID", Operator: "in", FilterValue: candidateIDs },
                                ],
                                Topcount: 5000 // இது கட்டாயம் தேவை
                            })];
                    case 1:
                        listItems = _a.sent();
                        console.log("🟢 LOG [Service] getCombinedCandidates Response:", listItems);
                        return [2 /*return*/, listItems !== null && listItems !== void 0 ? listItems : []];
                    case 2:
                        e_3 = _a.sent();
                        console.error("❌ [Service] getCombinedCandidates error:", e_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getGradeAndLevel: function (recruitmentID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var grade, level, jobCodeID, vrrRes, gradeRes, e_4;
            var _a, _b, _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        grade = "";
                        level = "";
                        jobCodeID = 0;
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }]
                            })];
                    case 2:
                        vrrRes = _g.sent();
                        jobCodeID = (_b = (_a = vrrRes === null || vrrRes === void 0 ? void 0 : vrrRes[0]) === null || _a === void 0 ? void 0 : _a.JobCodeId) !== null && _b !== void 0 ? _b : 0;
                        grade = (_d = (_c = vrrRes === null || vrrRes === void 0 ? void 0 : vrrRes[0]) === null || _c === void 0 ? void 0 : _c.PatersonGrade) !== null && _d !== void 0 ? _d : "";
                        if (!grade) return [3 /*break*/, 4];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSGradeMaster,
                                Filter: [{ FilterKey: "PatersonGrade", Operator: "eq", FilterValue: grade }]
                            })];
                    case 3:
                        gradeRes = _g.sent();
                        level = (_f = (_e = gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes[0]) === null || _e === void 0 ? void 0 : _e.Levels) !== null && _f !== void 0 ? _f : "";
                        _g.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_4 = _g.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, { grade: grade, level: level, jobCodeID: jobCodeID }];
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
    }
};
exports.EvaluationServiceHelper = {
    buildRow: function (candidate, grade, level, jobCodeID) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var rawDate = (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewDateLevel2) || (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewDate) || "";
        var rawTime = (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewTimeLevel2) || (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewTime) || "";
        var interviewDateTime = rawDate && rawTime ? (0, moment_1.default)("".concat(rawDate, " ").concat(rawTime), EvaluationConfig_1.EvalUIConfig.InterviewDateParseFormat).format(EvaluationConfig_1.EvalUIConfig.InterviewDateDisplayFormat) : "";
        return {
            id: candidate.ID,
            applicantName: "".concat((_a = candidate.FristName) !== null && _a !== void 0 ? _a : "", " ").concat((_b = candidate.LastName) !== null && _b !== void 0 ? _b : "").trim(),
            positionTitle: (_c = candidate.PositionTitle) !== null && _c !== void 0 ? _c : "",
            interviewDate: rawDate,
            interviewDateTime: interviewDateTime,
            interviewLevel: level === EvaluationConfig_1.InterviewLevels.Level2 ? "Level 2" : level,
            grade: grade,
            gradeLabel: "",
            attachments: (_e = (_d = candidate.CandidateCVDoc) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0,
            status: (_h = (_g = (_f = candidate.Status) === null || _f === void 0 ? void 0 : _f.StatusDescription) !== null && _g !== void 0 ? _g : candidate.Status) !== null && _h !== void 0 ? _h : "",
            statusId: (_j = candidate.StatusId) !== null && _j !== void 0 ? _j : "",
            recruitmentID: (_m = (_l = (_k = candidate.RecruitmentID) === null || _k === void 0 ? void 0 : _k.ID) !== null && _l !== void 0 ? _l : candidate.RecruitmentID) !== null && _m !== void 0 ? _m : "",
            jobCodeID: jobCodeID,
        };
    }
};
//# sourceMappingURL=EvaluationService.js.map