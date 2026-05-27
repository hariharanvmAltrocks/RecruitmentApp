"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsAlreadySubmitted = exports.submitScorecard = exports.getEvaluationFormData = void 0;
var tslib_1 = require("tslib");
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var MasterService_1 = tslib_1.__importDefault(require("../../../../services/MasterService/MasterService"));
var Config_1 = require("../../../../utilities/Config");
var CommonServices_1 = tslib_1.__importDefault(require("../../SelectionProcess/CommonServices/CommonServices"));
var QuestionnaireApi_1 = tslib_1.__importDefault(require("./QuestionnaireApi/QuestionnaireApi"));
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var _common = new CommonServices_1.default();
var _master = new MasterService_1.default();
var _questApi = new QuestionnaireApi_1.default();
var EMPTY = function (candidateId) { return ({
    success: false,
    candidateId: candidateId,
    applicantName: "",
    nationality: "",
    nationalityCode: "",
    gender: "",
    qualification: "",
    miningExp: "",
    relevantExp: "",
    interviewDate: "",
    interviewLevel: "",
    disability: "",
    conflictsOfInterest: "",
    positionTitle: "",
    grade: "",
    recruitmentId: 0,
    jobCodeId: 0,
    panelMembers: [],
    currentUserPanelId: null,
    currentUserGuid: null,
    reviewerName: "",
    jobTitleEn: "",
    jobTitleFr: "",
    questions: [],
    isAlreadySubmitted: false,
}); };
function getEvaluationFormData(candidateId, currentUserEmail) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _4, candidateRows, currentUserGuid_1, raw, recruitmentId_1, jobCodeId, jobCodeStr, fullName, interviewDateRaw, interviewDate, jobRequestId, _5, panelRows, reviewerRes, currentUserPanel, matchingByRecruit, uniqueEmails, emailToName_1, panelMembers, reviewer, reviewerName, jobTitleEn, jobTitleFr, grade, interviewLevel, questions, _6, gradeRes, questionsResult, result, error_1;
        var _this = this;
        return tslib_1.__generator(this, function (_7) {
            switch (_7.label) {
                case 0:
                    _7.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, Promise.all([
                            spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: [
                                    "ID",
                                    "FristName",
                                    "MiddleName",
                                    "LastName",
                                    "Nationality",
                                    "NationalityCode",
                                    "Gender",
                                    "Qualification",
                                    "TotalYearOfExperiance",
                                    "ReleventExperience",
                                    "InterviewDate",
                                    "InterviewDateLevel2",
                                    "Disability",
                                    "ConflictsOfInterest",
                                    "PositionTitle",
                                    "JobGrade",
                                    "JobCodeId",
                                    "JobRequestID",
                                    "RecruitmentID/ID",
                                    "JobCode/JobCode",
                                    "JobCode/ID",
                                ].join(","),
                                Expand: "RecruitmentID,JobCode",
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: candidateId }],
                            }),
                            _getUserGuid(currentUserEmail),
                        ])];
                case 1:
                    _4 = _7.sent(), candidateRows = _4[0], currentUserGuid_1 = _4[1];
                    raw = (_a = candidateRows === null || candidateRows === void 0 ? void 0 : candidateRows[0]) !== null && _a !== void 0 ? _a : {};
                    recruitmentId_1 = (_d = (_c = (_b = raw.RecruitmentID) === null || _b === void 0 ? void 0 : _b.ID) !== null && _c !== void 0 ? _c : raw.RecruitmentIDId) !== null && _d !== void 0 ? _d : 0;
                    jobCodeId = (_g = (_e = raw.JobCodeId) !== null && _e !== void 0 ? _e : (_f = raw.JobCode) === null || _f === void 0 ? void 0 : _f.ID) !== null && _g !== void 0 ? _g : 0;
                    jobCodeStr = (_j = (_h = raw.JobCode) === null || _h === void 0 ? void 0 : _h.JobCode) !== null && _j !== void 0 ? _j : "";
                    fullName = [raw.FristName, raw.MiddleName, raw.LastName]
                        .filter(Boolean)
                        .join(" ")
                        .trim();
                    interviewDateRaw = raw.InterviewDateLevel2 || raw.InterviewDate || "";
                    interviewDate = interviewDateRaw
                        ? interviewDateRaw.split("T")[0]
                        : "";
                    jobRequestId = (_k = raw.JobRequestID) !== null && _k !== void 0 ? _k : "";
                    return [4 /*yield*/, Promise.all([
                            spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID,CandidateID/ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,IsScoreSheetUploaded",
                                Expand: "InterviewPanel,RecruitmentID,CandidateID",
                                Filter: [
                                    {
                                        FilterKey: "CandidateIDId",
                                        Operator: "eq",
                                        FilterValue: candidateId,
                                    },
                                ],
                            }),
                            _master.GetUserDetails([
                                {
                                    FilterKey: "EmailId",
                                    Operator: "eq",
                                    FilterValue: currentUserEmail,
                                },
                            ], "and"),
                        ])];
                case 2:
                    _5 = _7.sent(), panelRows = _5[0], reviewerRes = _5[1];
                    currentUserPanel = null;
                    if (currentUserGuid_1) {
                        currentUserPanel = panelRows.find(function (p) { var _a; return Number((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === Number(currentUserGuid_1); });
                    }
                    if (!currentUserPanel && currentUserEmail) {
                        currentUserPanel = panelRows.find(function (p) {
                            var _a;
                            return (((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) || "").toLowerCase() ===
                                currentUserEmail.toLowerCase();
                        });
                    }
                    if (!currentUserPanel && currentUserGuid_1 && recruitmentId_1) {
                        matchingByRecruit = panelRows.filter(function (p) { var _a; return ((_a = p.RecruitmentID) === null || _a === void 0 ? void 0 : _a.ID) === recruitmentId_1; });
                        currentUserPanel = matchingByRecruit.find(function (p) { var _a; return Number((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === Number(currentUserGuid_1); });
                    }
                    if (!currentUserPanel) {
                        console.warn("[getEvaluationFormData] Panel emails list:", panelRows.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; }));
                        console.warn("[getEvaluationFormData] Panel Ids list:", panelRows.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id; }));
                        console.warn("[getEvaluationFormData] Expected currentUserGuid:", currentUserGuid_1, "(type:", typeof currentUserGuid_1, ")");
                    }
                    uniqueEmails = Array.from(new Set(panelRows
                        .map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; })
                        .filter(Boolean)));
                    emailToName_1 = {};
                    return [4 /*yield*/, Promise.all(uniqueEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var res, name_1, _a;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, _master.GetUserDetails([{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }], "and")];
                                    case 1:
                                        res = _b.sent();
                                        if (res === null || res === void 0 ? void 0 : res.data) {
                                            name_1 = [
                                                res.data.FirstName,
                                                res.data.MiddleName,
                                                res.data.LastName,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")
                                                .trim();
                                            if (name_1)
                                                emailToName_1[email.toLowerCase()] = name_1;
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _7.sent();
                    panelMembers = panelRows
                        .map(function (p) {
                        var _a, _b, _c;
                        var email = ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : "").toLowerCase();
                        return emailToName_1[email] || ((_c = p.InterviewPanel) === null || _c === void 0 ? void 0 : _c.Title) || "";
                    })
                        .filter(Boolean);
                    reviewer = reviewerRes === null || reviewerRes === void 0 ? void 0 : reviewerRes.data;
                    reviewerName = reviewer
                        ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName]
                            .filter(Boolean)
                            .join(" ")
                            .trim()
                        : "";
                    jobTitleEn = (_l = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleEnglish) !== null && _l !== void 0 ? _l : "";
                    jobTitleFr = (_m = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleFrench) !== null && _m !== void 0 ? _m : "";
                    grade = (_o = raw.JobGrade) !== null && _o !== void 0 ? _o : "";
                    interviewLevel = (_p = raw.InterviewLevel) !== null && _p !== void 0 ? _p : "";
                    questions = [];
                    return [4 /*yield*/, Promise.all([
                            grade
                                ? Promise.resolve(null)
                                : _master.GetGradeLevel(raw.JobGrade || jobCodeStr).catch(function () { return null; }),
                            jobCodeId
                                ? _master
                                    .GetJobUniqueDataValue(jobCodeId)
                                    .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var key, qRes;
                                    var _a, _b, _c;
                                    return tslib_1.__generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                key = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.JobCode) !== null && _b !== void 0 ? _b : "";
                                                if (!key)
                                                    return [2 /*return*/, []];
                                                return [4 /*yield*/, _questApi.getQuestionnaire(key)];
                                            case 1:
                                                qRes = _d.sent();
                                                return [2 /*return*/, ((_c = qRes === null || qRes === void 0 ? void 0 : qRes.data) !== null && _c !== void 0 ? _c : []).map(function (q) {
                                                        var _a;
                                                        return ({
                                                            id: q.id,
                                                            question: q.question,
                                                            answer: (_a = q.answer) !== null && _a !== void 0 ? _a : "",
                                                        });
                                                    })];
                                        }
                                    });
                                }); })
                                    .catch(function (e) {
                                    console.warn("[getEvaluationFormData] questions fetch failed:", e);
                                    return [];
                                })
                                : Promise.resolve([]),
                        ])];
                case 4:
                    _6 = _7.sent(), gradeRes = _6[0], questionsResult = _6[1];
                    if (!grade && (gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data))
                        grade = (_r = (_q = gradeRes.data) === null || _q === void 0 ? void 0 : _q.GradeLevel) !== null && _r !== void 0 ? _r : "";
                    if (!interviewLevel) {
                        interviewLevel =
                            raw.InterviewLevel ||
                                ((_s = String(raw.JobGrade || "").match(/Level\s*\d+/i)) === null || _s === void 0 ? void 0 : _s[0]) ||
                                "";
                    }
                    questions = questionsResult;
                    result = {
                        success: true,
                        candidateId: candidateId,
                        applicantName: fullName,
                        nationality: (_t = raw.Nationality) !== null && _t !== void 0 ? _t : "",
                        nationalityCode: (_u = raw.NationalityCode) !== null && _u !== void 0 ? _u : "",
                        gender: (_v = raw.Gender) !== null && _v !== void 0 ? _v : "",
                        qualification: (_w = raw.Qualification) !== null && _w !== void 0 ? _w : "",
                        miningExp: (_x = raw.TotalYearOfExperiance) !== null && _x !== void 0 ? _x : "",
                        relevantExp: (_y = raw.ReleventExperience) !== null && _y !== void 0 ? _y : "",
                        interviewDate: interviewDate,
                        interviewLevel: interviewLevel,
                        disability: (_0 = (_z = raw.Disability) !== null && _z !== void 0 ? _z : raw.disability) !== null && _0 !== void 0 ? _0 : "",
                        conflictsOfInterest: (_1 = raw.ConflictsOfInterest) !== null && _1 !== void 0 ? _1 : "",
                        positionTitle: (_2 = raw.PositionTitle) !== null && _2 !== void 0 ? _2 : "",
                        grade: grade,
                        recruitmentId: recruitmentId_1,
                        jobCodeId: jobCodeId,
                        panelMembers: panelMembers,
                        currentUserPanelId: (_3 = currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) !== null && _3 !== void 0 ? _3 : null,
                        currentUserGuid: currentUserGuid_1,
                        reviewerName: reviewerName,
                        jobTitleEn: jobTitleEn,
                        jobTitleFr: jobTitleFr,
                        questions: questions,
                        isAlreadySubmitted: (currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.IsScoreSheetUploaded) === "Yes",
                    };
                    result._jobRequestId = jobRequestId;
                    return [2 /*return*/, result];
                case 5:
                    error_1 = _7.sent();
                    console.error("[getEvaluationFormData] FATAL error:", error_1);
                    return [2 /*return*/, EMPTY(candidateId)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getEvaluationFormData = getEvaluationFormData;
function submitScorecard(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var scorecardObj, insertResponse, newId, updatedPanelRows, level1Panels, uploadedCount, portalPayload, apiErr_1, error_2;
        return tslib_1.__generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    _p.trys.push([0, 13, , 14]);
                    scorecardObj = tslib_1.__assign(tslib_1.__assign({ RelevantQualification: String((_a = params.qualifications) !== null && _a !== void 0 ? _a : ""), ReleventExperience: String((_b = params.experience) !== null && _b !== void 0 ? _b : ""), Knowledge: String((_c = params.knowledge) !== null && _c !== void 0 ? _c : ""), EnergyLevel: String((_d = params.energyLevel) !== null && _d !== void 0 ? _d : ""), MeetJobRequirement: String((_e = params.jobRequirements) !== null && _e !== void 0 ? _e : ""), ContributeTowardsCultureRequried: String((_f = params.cultureFit) !== null && _f !== void 0 ? _f : ""), Experience: String((_g = params.expatLocal) !== null && _g !== void 0 ? _g : ""), OtherCriteriaScore: String((_h = params.otherCriteria) !== null && _h !== void 0 ? _h : ""), ConsiderForEmployment: params.recommendation === "consider" ? "Yes" : "No", OverAllEvaluationFeedback: params.overallFeedback }, (params.evaluationFeedback
                        ? { Feedback: params.evaluationFeedback }
                        : {})), { RecruitmentIDId: params.recruitmentId, InterviewPanelIDId: params.panelId, RoleId: params.roleId ? Number(params.roleId) : null, InterviewPersonNameId: params.interviewPersonNameId
                            ? Number(params.interviewPersonNameId)
                            : null, QuestionJson: JSON.stringify(params.questionScores) });
                    return [4 /*yield*/, spservice_1.default.SPAddItem({
                            Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                            RequestJSON: scorecardObj,
                        })];
                case 1:
                    insertResponse = _p.sent();
                    newId = (_m = (_k = (_j = insertResponse === null || insertResponse === void 0 ? void 0 : insertResponse.ID) !== null && _j !== void 0 ? _j : insertResponse === null || insertResponse === void 0 ? void 0 : insertResponse.Id) !== null && _k !== void 0 ? _k : (_l = insertResponse === null || insertResponse === void 0 ? void 0 : insertResponse.data) === null || _l === void 0 ? void 0 : _l.ID) !== null && _m !== void 0 ? _m : (_o = insertResponse === null || insertResponse === void 0 ? void 0 : insertResponse.data) === null || _o === void 0 ? void 0 : _o.Id;
                    if (!newId) {
                        console.error("[submitScorecard] Insert returned no ID — insert failed");
                        return [2 /*return*/, { success: false, message: "Failed to submit scorecard." }];
                    }
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            RequestJSON: { IsScoreSheetUploaded: "Yes" },
                            ID: params.panelId,
                        })];
                case 2:
                    _p.sent();
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            Select: "ID,InterviewLevel,IsScoreSheetUploaded",
                            Filter: [
                                {
                                    FilterKey: "CandidateIDId",
                                    Operator: "eq",
                                    FilterValue: params.candidateId,
                                },
                            ],
                        })];
                case 3:
                    updatedPanelRows = _p.sent();
                    level1Panels = updatedPanelRows.filter(function (p) { return p.InterviewLevel === ConditionConfig_1.InterviewLevels.Level1; });
                    uploadedCount = level1Panels.filter(function (p) { return p.IsScoreSheetUploaded === "Yes"; }).length;
                    if (!(level1Panels.length > 0 && uploadedCount === level1Panels.length)) return [3 /*break*/, 11];
                    if (!params.jobRequestId) return [3 /*break*/, 8];
                    _p.label = 4;
                case 4:
                    _p.trys.push([4, 6, , 7]);
                    portalPayload = {
                        workflowStatus: Config_1.workflowStatusApi.pendingHODSelection,
                        jobRequestId: Number(params.jobRequestId),
                        comments: "",
                        actionBy: ConditionConfig_1.RoleName.HOD,
                    };
                    return [4 /*yield*/, _questApi.UpdateCandidateStatus(portalPayload)];
                case 5:
                    _p.sent();
                    console.log("[submitScorecard] Portal UpdateCandidateStatus SUCCESS");
                    return [3 /*break*/, 7];
                case 6:
                    apiErr_1 = _p.sent();
                    console.warn("[submitScorecard] Portal UpdateCandidateStatus failed (non-fatal):", apiErr_1);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.warn("[submitScorecard] No jobRequestId — skipping portal API call");
                    _p.label = 9;
                case 9: return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                        Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                        RequestJSON: {
                            IsScoreSheetUploaded: "Yes",
                            // ActionId:    WorkflowAction.Approved,
                            // ItemCreated: 'Yes',
                            StatusId: params.level === ConditionConfig_1.InterviewLevels.Level1
                                ? Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD
                                : Config_1.StatusId.pendingL2shorlistingwithHOD,
                        },
                        ID: params.candidateId,
                    })];
                case 10:
                    _p.sent();
                    console.log("[submitScorecard] Candidate SP record updated — HOD workflow complete");
                    return [3 /*break*/, 12];
                case 11:
                    console.log("[submitScorecard] Not all Level1 panels submitted yet — HOD workflow NOT triggered");
                    _p.label = 12;
                case 12: return [2 /*return*/, {
                        success: true,
                        message: "The Candidate has been Interviewed and Scorecard Submitted successfully.",
                    }];
                case 13:
                    error_2 = _p.sent();
                    console.error("[submitScorecard] FATAL error:", error_2);
                    return [2 /*return*/, {
                            success: false,
                            message: "An error occurred while submitting. Please try again.",
                        }];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.submitScorecard = submitScorecard;
function checkIsAlreadySubmitted(candidateId, currentUserEmail, Level) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, currentUserGuid_2, panelRows, rows, userPanel, alreadySubmitted, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all([
                            _getUserGuid(currentUserEmail),
                            spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID,InterviewPanel/Id,InterviewPanel/EMail,IsScoreSheetUploaded",
                                Expand: "InterviewPanel",
                                Filter: [
                                    {
                                        FilterKey: "CandidateIDId",
                                        Operator: "eq",
                                        FilterValue: candidateId,
                                    },
                                    {
                                        FilterKey: "InterviewLevel",
                                        Operator: "eq",
                                        FilterValue: Level,
                                    },
                                ],
                            }),
                        ])];
                case 1:
                    _a = _b.sent(), currentUserGuid_2 = _a[0], panelRows = _a[1];
                    rows = panelRows;
                    userPanel = null;
                    if (currentUserGuid_2) {
                        userPanel = rows.find(function (p) { var _a; return Number((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === Number(currentUserGuid_2); });
                    }
                    if (!userPanel && currentUserEmail) {
                        userPanel = rows.find(function (p) {
                            var _a;
                            return (((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) || "").toLowerCase() ===
                                currentUserEmail.toLowerCase();
                        });
                    }
                    if (!userPanel) {
                        console.warn("[checkIsAlreadySubmitted] Current user not found in panel rows — treating as not submitted");
                        return [2 /*return*/, false];
                    }
                    alreadySubmitted = userPanel.IsScoreSheetUploaded === "Yes";
                    return [2 /*return*/, alreadySubmitted];
                case 2:
                    err_1 = _b.sent();
                    console.error("[checkIsAlreadySubmitted] error:", err_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.checkIsAlreadySubmitted = checkIsAlreadySubmitted;
function _getUserGuid(email) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, e_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!email)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, _common.getUserGuidByEmail(email)];
                case 1:
                    res = _b.sent();
                    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.key))
                        return [2 /*return*/, String(res.data.key)];
                    return [2 /*return*/, null];
                case 2:
                    e_1 = _b.sent();
                    console.error("[_getUserGuid] error:", e_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=Evaluationformservice.js.map