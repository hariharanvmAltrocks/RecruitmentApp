"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvaluationFormData = getEvaluationFormData;
exports.submitScorecard = submitScorecard;
exports.checkIsAlreadySubmitted = checkIsAlreadySubmitted;
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
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, candidateRows, currentUserGuid_1, raw, recruitmentId_1, jobCodeId, jobCodeStr, fullName, interviewDateRaw, interviewDate, jobRequestId, _b, panelRows, reviewerRes, currentUserPanel, matchingByRecruit, uniqueEmails, emailToName_1, panelMembers, reviewer, reviewerName, jobTitleEn, jobTitleFr, grade, interviewLevel, questions, _c, gradeRes, questionsResult, result, error_1;
        var _this = this;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
        return tslib_1.__generator(this, function (_11) {
            switch (_11.label) {
                case 0:
                    console.log("[getEvaluationFormData] START — candidateId:", candidateId, "email:", currentUserEmail);
                    _11.label = 1;
                case 1:
                    _11.trys.push([1, 6, , 7]);
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
                case 2:
                    _a = _11.sent(), candidateRows = _a[0], currentUserGuid_1 = _a[1];
                    raw = (_d = candidateRows === null || candidateRows === void 0 ? void 0 : candidateRows[0]) !== null && _d !== void 0 ? _d : {};
                    recruitmentId_1 = (_g = (_f = (_e = raw.RecruitmentID) === null || _e === void 0 ? void 0 : _e.ID) !== null && _f !== void 0 ? _f : raw.RecruitmentIDId) !== null && _g !== void 0 ? _g : 0;
                    jobCodeId = (_k = (_h = raw.JobCodeId) !== null && _h !== void 0 ? _h : (_j = raw.JobCode) === null || _j === void 0 ? void 0 : _j.ID) !== null && _k !== void 0 ? _k : 0;
                    jobCodeStr = (_m = (_l = raw.JobCode) === null || _l === void 0 ? void 0 : _l.JobCode) !== null && _m !== void 0 ? _m : "";
                    fullName = [raw.FristName, raw.MiddleName, raw.LastName]
                        .filter(Boolean)
                        .join(" ")
                        .trim();
                    interviewDateRaw = raw.InterviewDateLevel2 || raw.InterviewDate || "";
                    interviewDate = interviewDateRaw
                        ? interviewDateRaw.split("T")[0]
                        : "";
                    jobRequestId = (_o = raw.JobRequestID) !== null && _o !== void 0 ? _o : "";
                    console.log("[getEvaluationFormData] candidateRaw:", {
                        ID: raw.ID,
                        fullName: fullName,
                        recruitmentId: recruitmentId_1,
                        jobCodeId: jobCodeId,
                        jobCodeStr: jobCodeStr,
                        jobRequestId: jobRequestId,
                        NationalityCode: raw.NationalityCode,
                    });
                    console.log("[getEvaluationFormData] currentUserGuid (SP user Id):", currentUserGuid_1);
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
                case 3:
                    _b = _11.sent(), panelRows = _b[0], reviewerRes = _b[1];
                    console.log("[getEvaluationFormData] panelRows count:", panelRows.length);
                    console.log("[getEvaluationFormData] panelRows detail:", JSON.stringify(panelRows.map(function (p) {
                        var _a, _b, _c, _d;
                        return ({
                            ID: p.ID,
                            InterviewPanelId: (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id,
                            Email: (_b = p.InterviewPanel) === null || _b === void 0 ? void 0 : _b.EMail,
                            Level: p.InterviewLevel,
                            Uploaded: p.IsScoreSheetUploaded,
                            CandidateID: (_c = p.CandidateID) === null || _c === void 0 ? void 0 : _c.ID,
                            RecruitmentID: (_d = p.RecruitmentID) === null || _d === void 0 ? void 0 : _d.ID,
                        });
                    })));
                    currentUserPanel = null;
                    if (currentUserGuid_1) {
                        currentUserPanel = panelRows.find(function (p) { var _a; return Number((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === Number(currentUserGuid_1); });
                        console.log("[getEvaluationFormData] Panel match by Id:", (_p = currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) !== null && _p !== void 0 ? _p : "NOT FOUND", "| comparing panelIds:", panelRows.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id; }), "vs currentUserGuid:", currentUserGuid_1);
                    }
                    if (!currentUserPanel && currentUserEmail) {
                        currentUserPanel = panelRows.find(function (p) {
                            var _a;
                            return (((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) || "").toLowerCase() ===
                                currentUserEmail.toLowerCase();
                        });
                        console.log("[getEvaluationFormData] Panel match by Email fallback:", (_q = currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) !== null && _q !== void 0 ? _q : "NOT FOUND");
                    }
                    if (!currentUserPanel && currentUserGuid_1 && recruitmentId_1) {
                        matchingByRecruit = panelRows.filter(function (p) { var _a; return ((_a = p.RecruitmentID) === null || _a === void 0 ? void 0 : _a.ID) === recruitmentId_1; });
                        currentUserPanel = matchingByRecruit.find(function (p) { var _a; return Number((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === Number(currentUserGuid_1); });
                        console.log("[getEvaluationFormData] Panel match with RecruitmentID filter:", (_r = currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) !== null && _r !== void 0 ? _r : "NOT FOUND");
                    }
                    console.log("[getEvaluationFormData] FINAL currentUserPanel:", currentUserPanel
                        ? {
                            ID: currentUserPanel.ID,
                            Level: currentUserPanel.InterviewLevel,
                            Email: (_s = currentUserPanel.InterviewPanel) === null || _s === void 0 ? void 0 : _s.EMail,
                        }
                        : "NULL — current user is NOT in HRMSInterviewPanelDetails for candidateId=" +
                            candidateId);
                    if (!currentUserPanel) {
                        console.warn("[getEvaluationFormData] Panel emails list:", panelRows.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; }));
                        console.warn("[getEvaluationFormData] Panel Ids list:", panelRows.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id; }));
                        console.warn("[getEvaluationFormData] Expected currentUserGuid:", currentUserGuid_1, "(type:", typeof currentUserGuid_1, ")");
                    }
                    uniqueEmails = Array.from(new Set(panelRows
                        .map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; })
                        .filter(Boolean)));
                    console.log("[getEvaluationFormData] Panel emails to resolve names:", uniqueEmails);
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
                case 4:
                    _11.sent();
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
                    jobTitleEn = (_t = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleEnglish) !== null && _t !== void 0 ? _t : "";
                    jobTitleFr = (_u = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleFrench) !== null && _u !== void 0 ? _u : "";
                    console.log("[getEvaluationFormData] reviewerName:", reviewerName);
                    console.log("[getEvaluationFormData] panelMembers:", panelMembers);
                    grade = (_v = raw.JobGrade) !== null && _v !== void 0 ? _v : "";
                    interviewLevel = (_w = raw.InterviewLevel) !== null && _w !== void 0 ? _w : "";
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
                                    var _a, _b, _c, _d, _e;
                                    return tslib_1.__generator(this, function (_f) {
                                        switch (_f.label) {
                                            case 0:
                                                key = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.JobCode) !== null && _b !== void 0 ? _b : "";
                                                console.log("[getEvaluationFormData] JobUniqueKey:", key);
                                                if (!key)
                                                    return [2 /*return*/, []];
                                                return [4 /*yield*/, _questApi.getQuestionnaire(key)];
                                            case 1:
                                                qRes = _f.sent();
                                                console.log("[getEvaluationFormData] questions count:", (_d = (_c = qRes === null || qRes === void 0 ? void 0 : qRes.data) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0);
                                                return [2 /*return*/, ((_e = qRes === null || qRes === void 0 ? void 0 : qRes.data) !== null && _e !== void 0 ? _e : []).map(function (q) {
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
                case 5:
                    _c = _11.sent(), gradeRes = _c[0], questionsResult = _c[1];
                    if (!grade && (gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data))
                        grade = (_y = (_x = gradeRes.data) === null || _x === void 0 ? void 0 : _x.GradeLevel) !== null && _y !== void 0 ? _y : "";
                    if (!interviewLevel) {
                        interviewLevel =
                            raw.InterviewLevel ||
                                ((_z = String(raw.JobGrade || "").match(/Level\s*\d+/i)) === null || _z === void 0 ? void 0 : _z[0]) ||
                                "";
                    }
                    questions = questionsResult;
                    result = {
                        success: true,
                        candidateId: candidateId,
                        applicantName: fullName,
                        nationality: (_0 = raw.Nationality) !== null && _0 !== void 0 ? _0 : "",
                        nationalityCode: (_1 = raw.NationalityCode) !== null && _1 !== void 0 ? _1 : "",
                        gender: (_2 = raw.Gender) !== null && _2 !== void 0 ? _2 : "",
                        qualification: (_3 = raw.Qualification) !== null && _3 !== void 0 ? _3 : "",
                        miningExp: (_4 = raw.TotalYearOfExperiance) !== null && _4 !== void 0 ? _4 : "",
                        relevantExp: (_5 = raw.ReleventExperience) !== null && _5 !== void 0 ? _5 : "",
                        interviewDate: interviewDate,
                        interviewLevel: interviewLevel,
                        disability: (_7 = (_6 = raw.Disability) !== null && _6 !== void 0 ? _6 : raw.disability) !== null && _7 !== void 0 ? _7 : "",
                        conflictsOfInterest: (_8 = raw.ConflictsOfInterest) !== null && _8 !== void 0 ? _8 : "",
                        positionTitle: (_9 = raw.PositionTitle) !== null && _9 !== void 0 ? _9 : "",
                        grade: grade,
                        recruitmentId: recruitmentId_1,
                        jobCodeId: jobCodeId,
                        panelMembers: panelMembers,
                        currentUserPanelId: (_10 = currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) !== null && _10 !== void 0 ? _10 : null,
                        currentUserGuid: currentUserGuid_1,
                        reviewerName: reviewerName,
                        jobTitleEn: jobTitleEn,
                        jobTitleFr: jobTitleFr,
                        questions: questions,
                        isAlreadySubmitted: (currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.IsScoreSheetUploaded) === "Yes",
                    };
                    console.log("[getEvaluationFormData] RESULT:", {
                        success: result.success,
                        candidateId: result.candidateId,
                        currentUserGuid: result.currentUserGuid,
                        currentUserPanelId: result.currentUserPanelId,
                        panelMembersCount: result.panelMembers.length,
                        questionsCount: result.questions.length,
                        recruitmentId: result.recruitmentId,
                        jobRequestId: jobRequestId,
                    });
                    result._jobRequestId = jobRequestId;
                    return [2 /*return*/, result];
                case 6:
                    error_1 = _11.sent();
                    console.error("[getEvaluationFormData] FATAL error:", error_1);
                    return [2 /*return*/, EMPTY(candidateId)];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function submitScorecard(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var scorecardObj, insertResponse, newId, updatedPanelRows, level1Panels, uploadedCount, portalPayload, apiErr_1, error_2;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return tslib_1.__generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    console.log("[submitScorecard] START —", {
                        candidateId: params.candidateId,
                        panelId: params.panelId,
                        recruitmentId: params.recruitmentId,
                        roleId: params.roleId,
                        interviewPersonNameId: params.interviewPersonNameId,
                        recommendation: params.recommendation,
                        jobRequestId: params.jobRequestId,
                        qualifications: params.qualifications,
                        experience: params.experience,
                        knowledge: params.knowledge,
                        energyLevel: params.energyLevel,
                        jobRequirements: params.jobRequirements,
                        cultureFit: params.cultureFit,
                        expatLocal: params.expatLocal,
                        otherCriteria: params.otherCriteria,
                        questionScoresCount: params.questionScores.length,
                        questionScores: params.questionScores,
                        hasEvalFeedback: !!params.evaluationFeedback,
                        overallFeedbackLen: params.overallFeedback.length,
                    });
                    _p.label = 1;
                case 1:
                    _p.trys.push([1, 14, , 15]);
                    scorecardObj = tslib_1.__assign(tslib_1.__assign({ RelevantQualification: String((_a = params.qualifications) !== null && _a !== void 0 ? _a : ""), ReleventExperience: String((_b = params.experience) !== null && _b !== void 0 ? _b : ""), Knowledge: String((_c = params.knowledge) !== null && _c !== void 0 ? _c : ""), EnergyLevel: String((_d = params.energyLevel) !== null && _d !== void 0 ? _d : ""), MeetJobRequirement: String((_e = params.jobRequirements) !== null && _e !== void 0 ? _e : ""), ContributeTowardsCultureRequried: String((_f = params.cultureFit) !== null && _f !== void 0 ? _f : ""), Experience: String((_g = params.expatLocal) !== null && _g !== void 0 ? _g : ""), OtherCriteriaScore: String((_h = params.otherCriteria) !== null && _h !== void 0 ? _h : ""), ConsiderForEmployment: params.recommendation === "consider" ? "Yes" : "No", OverAllEvaluationFeedback: params.overallFeedback }, (params.evaluationFeedback
                        ? { Feedback: params.evaluationFeedback }
                        : {})), { RecruitmentIDId: params.recruitmentId, InterviewPanelIDId: params.panelId, RoleId: params.roleId ? Number(params.roleId) : null, InterviewPersonNameId: params.interviewPersonNameId
                            ? Number(params.interviewPersonNameId)
                            : null, QuestionJson: JSON.stringify(params.questionScores) });
                    console.log("[submitScorecard] Inserting into HRMSCandidateScoreCard:", scorecardObj);
                    return [4 /*yield*/, spservice_1.default.SPAddItem({
                            Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                            RequestJSON: scorecardObj,
                        })];
                case 2:
                    insertResponse = _p.sent();
                    newId = (_m = (_k = (_j = insertResponse === null || insertResponse === void 0 ? void 0 : insertResponse.ID) !== null && _j !== void 0 ? _j : insertResponse === null || insertResponse === void 0 ? void 0 : insertResponse.Id) !== null && _k !== void 0 ? _k : (_l = insertResponse === null || insertResponse === void 0 ? void 0 : insertResponse.data) === null || _l === void 0 ? void 0 : _l.ID) !== null && _m !== void 0 ? _m : (_o = insertResponse === null || insertResponse === void 0 ? void 0 : insertResponse.data) === null || _o === void 0 ? void 0 : _o.Id;
                    console.log("[submitScorecard] HRMSCandidateScoreCard insert — newId:", newId);
                    if (!newId) {
                        console.error("[submitScorecard] Insert returned no ID — insert failed");
                        return [2 /*return*/, { success: false, message: "Failed to submit scorecard." }];
                    }
                    console.log("[submitScorecard] Updating HRMSInterviewPanelDetails ID:", params.panelId, "→ IsScoreSheetUploaded: Yes");
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            RequestJSON: { IsScoreSheetUploaded: "Yes" },
                            ID: params.panelId,
                        })];
                case 3:
                    _p.sent();
                    console.log("[submitScorecard] Re-fetching panels for candidateId:", params.candidateId);
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
                case 4:
                    updatedPanelRows = _p.sent();
                    level1Panels = updatedPanelRows.filter(function (p) { return p.InterviewLevel === ConditionConfig_1.InterviewLevels.Level1; });
                    uploadedCount = level1Panels.filter(function (p) { return p.IsScoreSheetUploaded === "Yes"; }).length;
                    console.log("[submitScorecard] Level1 panels total:", level1Panels.length, "| uploaded:", uploadedCount);
                    if (!(level1Panels.length > 0 && uploadedCount === level1Panels.length)) return [3 /*break*/, 12];
                    console.log("[submitScorecard] ALL Level1 submitted → triggering HOD workflow");
                    if (!params.jobRequestId) return [3 /*break*/, 9];
                    _p.label = 5;
                case 5:
                    _p.trys.push([5, 7, , 8]);
                    portalPayload = {
                        workflowStatus: Config_1.workflowStatusApi.pendingHODSelection,
                        jobRequestId: Number(params.jobRequestId),
                        comments: "",
                        actionBy: ConditionConfig_1.RoleName.HOD,
                    };
                    console.log("[submitScorecard] Portal UpdateCandidateStatus payload:", portalPayload);
                    return [4 /*yield*/, _questApi.UpdateCandidateStatus(portalPayload)];
                case 6:
                    _p.sent();
                    console.log("[submitScorecard] Portal UpdateCandidateStatus SUCCESS");
                    return [3 /*break*/, 8];
                case 7:
                    apiErr_1 = _p.sent();
                    console.warn("[submitScorecard] Portal UpdateCandidateStatus failed (non-fatal):", apiErr_1);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    console.warn("[submitScorecard] No jobRequestId — skipping portal API call");
                    _p.label = 10;
                case 10:
                    console.log("[submitScorecard] Updating HRMSRecruitmentCandidatePersonalDetails ID:", params.candidateId);
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
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
                case 11:
                    _p.sent();
                    console.log("[submitScorecard] Candidate SP record updated — HOD workflow complete");
                    return [3 /*break*/, 13];
                case 12:
                    console.log("[submitScorecard] Not all Level1 panels submitted yet — HOD workflow NOT triggered");
                    _p.label = 13;
                case 13:
                    console.log("[submitScorecard] SUCCESS");
                    return [2 /*return*/, {
                            success: true,
                            message: "The Candidate has been Interviewed and Scorecard Submitted successfully.",
                        }];
                case 14:
                    error_2 = _p.sent();
                    console.error("[submitScorecard] FATAL error:", error_2);
                    return [2 /*return*/, {
                            success: false,
                            message: "An error occurred while submitting. Please try again.",
                        }];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function checkIsAlreadySubmitted(candidateId, currentUserEmail, Level) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, currentUserGuid_2, panelRows, rows, userPanel, alreadySubmitted, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("[checkIsAlreadySubmitted] candidateId:", candidateId, "email:", currentUserEmail);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
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
                case 2:
                    _a = _b.sent(), currentUserGuid_2 = _a[0], panelRows = _a[1];
                    rows = panelRows;
                    console.log("[checkIsAlreadySubmitted] panelRows count:", rows.length, "| currentUserGuid:", currentUserGuid_2);
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
                    console.log("[checkIsAlreadySubmitted] panelID:", userPanel.ID, "| IsScoreSheetUploaded:", userPanel.IsScoreSheetUploaded, "| result:", alreadySubmitted);
                    return [2 /*return*/, alreadySubmitted];
                case 3:
                    err_1 = _b.sent();
                    console.error("[checkIsAlreadySubmitted] error:", err_1);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function _getUserGuid(email) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, e_1;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("[_getUserGuid] email:", email);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    if (!email)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, _common.getUserGuidByEmail(email)];
                case 2:
                    res = _d.sent();
                    console.log("[_getUserGuid] result key:", (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.key, "| text:", (_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.text);
                    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && ((_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.key))
                        return [2 /*return*/, String(res.data.key)];
                    return [2 /*return*/, null];
                case 3:
                    e_1 = _d.sent();
                    console.error("[_getUserGuid] error:", e_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=Evaluationformservice.js.map