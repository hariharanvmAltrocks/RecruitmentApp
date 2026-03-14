"use strict";
// ═══════════════════════════════════════════════════════════════════════════
//  EvaluationService.ts
//  Evaluation tab-க்கு தேவையான எல்லா SP API calls இங்கே மட்டும்
//  Import: EvaluationConfig மட்டும் — main Config.ts இல்லை
// ═══════════════════════════════════════════════════════════════════════════
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluationService = exports.EvaluationService = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var ServiceExport_1 = require("../../Services/ServiceExport");
var EvaluationConfig_1 = require("../config/EvaluationConfig");
// ─────────────────────────────────────────────────────────────────────────────
var EvaluationService = /** @class */ (function () {
    function EvaluationService() {
    }
    // ── 1. SP user numeric ID ─────────────────────────────────────────────────
    //  CommonServices.getUserGuidByEmail → sp.web.siteUsers.getByEmail(email)
    //  Returns: { key: user.Id, text: user.Title }
    EvaluationService.prototype.getCurrentUserGuid = function (email) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, e_1;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ServiceExport_1.CommonServices.getUserGuidByEmail(email)];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.status === 200 && ((_a = res.data) === null || _a === void 0 ? void 0 : _a.key)
                                ? String(res.data.key)
                                : null];
                    case 2:
                        e_1 = _b.sent();
                        console.error("EvaluationService.getCurrentUserGuid:", e_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── 2. Interview panels assigned to this user ─────────────────────────────
    //  List : EvalListNames.HRMSInterviewPanelDetails
    //  Filter: InterviewPanelId eq userGuid
    EvaluationService.prototype.getInterviewPanelsByUser = function (userGuid) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, e_2;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ServiceExport_1.InterviewServices.GetInterviewPanelDetails([
                                { FilterKey: "InterviewPanelId", Operator: "eq", FilterValue: userGuid },
                            ])];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, (_a = res.data) !== null && _a !== void 0 ? _a : []];
                    case 2:
                        e_2 = _b.sent();
                        console.error("EvaluationService.getInterviewPanelsByUser:", e_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── 3. Combined candidate + position details ──────────────────────────────
    //  List  : EvalListNames.HRMSCandidatePersonalDetails
    //  Filter: StatusId in [16, 20]
    //          ItemCreated eq "No"
    //          ID in candidateIDs
    EvaluationService.prototype.getCombinedCandidates = function (candidateIDs, employeeList) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, e_3;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ServiceExport_1.InterviewServices.GetCombinedCandidatePositionDetails([
                                {
                                    FilterKey: "StatusId",
                                    Operator: "in",
                                    FilterValue: [
                                        EvaluationConfig_1.EvalStatusId.InterviewScheduled,
                                        EvaluationConfig_1.EvalStatusId.InterviewScheduledforLevel2,
                                    ],
                                },
                                {
                                    FilterKey: "ItemCreated",
                                    Operator: "eq",
                                    FilterValue: EvaluationConfig_1.EvalUIConfig.ItemCreatedNo,
                                },
                                {
                                    FilterKey: "ID",
                                    Operator: "in",
                                    FilterValue: candidateIDs,
                                },
                            ], "and", employeeList)];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, (_a = res.data) !== null && _a !== void 0 ? _a : []];
                    case 2:
                        e_3 = _b.sent();
                        console.error("EvaluationService.getCombinedCandidates:", e_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── 4. PatersonGrade + Level for one recruitment record ───────────────────
    //  List 1: EvalListNames.HRMSRecruitmentDptDetails → PatersonGrade, JobCodeId
    //  List 2: EvalListNames.HRMSGradeMaster           → Level
    EvaluationService.prototype.getGradeAndLevel = function (recruitmentID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var grade, level, jobCodeID, vrrRes, gradeRes, e_4;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return tslib_1.__generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        grade = "";
                        level = "";
                        jobCodeID = 0;
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, ServiceExport_1.getVRRDetails.GetRecruitmentDetails([{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }], "")];
                    case 2:
                        vrrRes = _k.sent();
                        jobCodeID = (_c = (_b = (_a = vrrRes === null || vrrRes === void 0 ? void 0 : vrrRes.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.JobCodeId) !== null && _c !== void 0 ? _c : 0;
                        grade = (_f = (_e = (_d = vrrRes === null || vrrRes === void 0 ? void 0 : vrrRes.data) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.PatersonGrade) !== null && _f !== void 0 ? _f : "";
                        if (!grade) return [3 /*break*/, 4];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetGradeLevel(grade)];
                    case 3:
                        gradeRes = _k.sent();
                        level = (_j = (_h = (_g = gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.Level) !== null && _j !== void 0 ? _j : "";
                        _k.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_4 = _k.sent();
                        console.warn("EvaluationService.getGradeAndLevel recruitmentID:", recruitmentID, e_4);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, { grade: grade, level: level, jobCodeID: jobCodeID }];
                }
            });
        });
    };
    // ── 5. ON-DEMAND — Hover tooltip ──────────────────────────────────────────
    //  List  : EvalListNames.HRMSInterviewPanelDetails
    //  Filter: CandidateID/Id eq candidateID, InterviewLevel eq level
    //  Returns: [{ Key: panelMemberName, Value: "Completed" | "Pending" }]
    //  Called ONLY when user hovers status dot — never on mount
    EvaluationService.prototype.getTooltipData = function (candidateID, interviewLevel) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, e_5;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ServiceExport_1.getVRRDetails.GetEvalutionActionData([
                                { FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: candidateID },
                                { FilterKey: "InterviewLevel", Operator: "eq", FilterValue: interviewLevel },
                            ])];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, (_a = res.data) !== null && _a !== void 0 ? _a : []];
                    case 2:
                        e_5 = _b.sent();
                        console.error("EvaluationService.getTooltipData:", e_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── 6. ON-DEMAND — Score sheet already uploaded check ─────────────────────
    //  List  : EvalListNames.HRMSInterviewPanelDetails (via GetMasterData)
    //  Logic : InterviewPanelList.tsx → checkIsScoreSheetUploaded (line 272–358)
    //  Called ONLY when user clicks the Evaluate (view) icon — never on mount
    EvaluationService.prototype.checkScoreSheet = function (candidateID, statusId, userEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, panelRes, userRes, currentUserKey_1, allPanels, candidatePanels, userPanels, levelFiltered, alreadyUploaded, levelFiltered, alreadyUploaded, e_6;
            var _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                ServiceExport_1.CommonServices.GetMasterData(EvaluationConfig_1.EvalListNames.HRMSInterviewPanelDetails),
                                ServiceExport_1.CommonServices.getUserGuidByEmail(userEmail),
                            ])];
                    case 1:
                        _a = _e.sent(), panelRes = _a[0], userRes = _a[1];
                        currentUserKey_1 = (_c = (_b = userRes.data) === null || _b === void 0 ? void 0 : _b.key) === null || _c === void 0 ? void 0 : _c.toString();
                        if (!currentUserKey_1)
                            return [2 /*return*/, { canProceed: true }];
                        allPanels = (_d = panelRes === null || panelRes === void 0 ? void 0 : panelRes.data) !== null && _d !== void 0 ? _d : [];
                        candidatePanels = allPanels.filter(function (panel) { var _a; return ((_a = panel.CandidateIDId) === null || _a === void 0 ? void 0 : _a.toString()) === candidateID.toString(); });
                        if (!candidatePanels.length)
                            return [2 /*return*/, { canProceed: true }];
                        userPanels = candidatePanels.filter(function (panel) { var _a; return (_a = panel.InterviewPanelStringId) === null || _a === void 0 ? void 0 : _a.includes(currentUserKey_1); });
                        if (!userPanels.length)
                            return [2 /*return*/, { canProceed: true }];
                        // 3. Determine target level (same as InterviewPanelList line 309/332)
                        if (statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduled) {
                            levelFiltered = userPanels.filter(function (p) { return p.InterviewLevel === EvaluationConfig_1.EvalInterviewLevels.Level1; });
                            alreadyUploaded = levelFiltered.some(function (p) { return p.IsScoreSheetUploaded === EvaluationConfig_1.EvalUIConfig.ScoreSheetUploadedValue; });
                            return [2 /*return*/, alreadyUploaded
                                    ? { canProceed: false, level: EvaluationConfig_1.EvalInterviewLevels.Level1 }
                                    : { canProceed: true }];
                        }
                        if (statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduledforLevel2) {
                            levelFiltered = userPanels.filter(function (p) { return p.InterviewLevel === EvaluationConfig_1.EvalInterviewLevels.Level2; });
                            alreadyUploaded = levelFiltered.some(function (p) { return p.IsScoreSheetUploaded === EvaluationConfig_1.EvalUIConfig.ScoreSheetUploadedValue; });
                            return [2 /*return*/, alreadyUploaded
                                    ? { canProceed: false, level: EvaluationConfig_1.EvalInterviewLevels.Level2 }
                                    : { canProceed: true }];
                        }
                        return [2 /*return*/, { canProceed: true }];
                    case 2:
                        e_6 = _e.sent();
                        console.error("EvaluationService.checkScoreSheet:", e_6);
                        return [2 /*return*/, { canProceed: true }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ── Static helper: build typed EvaluationCandidate from raw data ──────────
    //  Logic: InterviewPanelList.tsx enrichedCandidates map (line 463–529)
    EvaluationService.buildRow = function (candidate, grade, level, jobCodeID) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var rawDate = (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewDateLevel2) || (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewDate) || "";
        var rawTime = (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewTimeLevel2) || (candidate === null || candidate === void 0 ? void 0 : candidate.InterviewTime) || "";
        var interviewDateTime = (0, moment_1.default)("".concat(rawDate, " ").concat(rawTime), EvaluationConfig_1.EvalUIConfig.InterviewDateParseFormat).format(EvaluationConfig_1.EvalUIConfig.InterviewDateDisplayFormat);
        return {
            id: candidate.ID,
            applicantName: "".concat((_a = candidate.FristName) !== null && _a !== void 0 ? _a : "", " ").concat((_b = candidate.LastName) !== null && _b !== void 0 ? _b : "").trim(),
            positionTitle: (_c = candidate.PositionTitle) !== null && _c !== void 0 ? _c : "",
            interviewDate: rawDate,
            interviewDateTime: interviewDateTime,
            interviewLevel: level === EvaluationConfig_1.EvalInterviewLevels.Level2
                ? EvaluationConfig_1.EvalInterviewLevels.Levels2
                : level,
            grade: grade,
            gradeLabel: "",
            attachments: (_e = (_d = candidate.CandidateCVDoc) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0,
            status: (_f = candidate.Status) !== null && _f !== void 0 ? _f : "",
            statusId: (_g = candidate.StatusId) !== null && _g !== void 0 ? _g : "",
            recruitmentID: (_h = candidate.RecruitmentID) !== null && _h !== void 0 ? _h : "",
            jobCodeID: jobCodeID,
        };
    };
    return EvaluationService;
}());
exports.EvaluationService = EvaluationService;
// Singleton — import this one instance everywhere
exports.evaluationService = new EvaluationService();
//# sourceMappingURL=EvaluationService.js.map