"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var QuestionnaireApi_1 = tslib_1.__importDefault(require("../../components/Screens/Evalution/Evaluationservice/QuestionnaireApi/QuestionnaireApi"));
var ReviewScoreCardServices_1 = require("../../components/Screens/ReviewScoreCard/ReviewScoreCardServies/ReviewScoreCardServices");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var Config_1 = require("../../utilities/Config");
var ServiceExport_1 = require("../ServiceExport");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var EvalutionL2Service = /** @class */ (function () {
    function EvalutionL2Service() {
    }
    EvalutionL2Service.prototype.getCandidatesByRecruitmentId = function (candidateID, recruitmentID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, defaultGrade_1, defaultLevel_1, posRes, gr, _1, enriched, e_1;
            var _this = this;
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: "*,JobCode/JobCode,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
                                Expand: "JobCode,RecruitmentID,Status",
                                FilterCondition: "and",
                                Filter: [
                                    {
                                        FilterKey: "ID",
                                        Operator: "eq",
                                        FilterValue: candidateID,
                                    },
                                    { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
                                    {
                                        FilterKey: "StatusId",
                                        Operator: "in",
                                        FilterValue: Config_1.StatusId.InterviewLevel2InProgress,
                                    },
                                ],
                                Topcount: 1000,
                            })];
                    case 1:
                        res = _e.sent();
                        defaultGrade_1 = "", defaultLevel_1 = "";
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentPositionDetails,
                                Select: "*,PatersonGrade/PatersonGrade",
                                Expand: "PatersonGrade",
                                Filter: [
                                    {
                                        FilterKey: "RecruitmentID",
                                        Operator: "eq",
                                        FilterValue: recruitmentID,
                                    },
                                ],
                            })];
                    case 3:
                        posRes = _e.sent();
                        defaultGrade_1 =
                            ((_b = (_a = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _a === void 0 ? void 0 : _a.PatersonGrade) === null || _b === void 0 ? void 0 : _b.PatersonGrade) ||
                                ((_c = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _c === void 0 ? void 0 : _c.PatersonGrade) ||
                                "";
                        if (!defaultGrade_1) return [3 /*break*/, 5];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSGradeMaster,
                                Select: "*",
                                Filter: [
                                    {
                                        FilterKey: "PatersonGrade",
                                        Operator: "eq",
                                        FilterValue: defaultGrade_1,
                                    },
                                ],
                            })];
                    case 4:
                        gr = _e.sent();
                        defaultLevel_1 = ((_d = gr === null || gr === void 0 ? void 0 : gr[0]) === null || _d === void 0 ? void 0 : _d.Levels) || "";
                        _e.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _1 = _e.sent();
                        return [3 /*break*/, 7];
                    case 7: return [4 /*yield*/, Promise.all((res || []).map(function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var candidateId, gpa;
                            var _a, _b, _c, _d;
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        candidateId = item.ID;
                                        return [4 /*yield*/, (0, ReviewScoreCardServices_1._calculateGPA)(candidateId)];
                                    case 1:
                                        gpa = _e.sent();
                                        return [2 /*return*/, {
                                                id: candidateId,
                                                recruitmentID: ((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.ID) || recruitmentID,
                                                fullName: [item.FristName, item.MiddleName, item.LastName]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                    .trim(),
                                                positionTitle: item.PositionTitle || "",
                                                interviewLevel: item.InterviewLevel || defaultLevel_1,
                                                grade: item.JobGrade || item.PatersonGrade || defaultGrade_1 || "",
                                                gpa: gpa,
                                                status: ((_b = item.Status) === null || _b === void 0 ? void 0 : _b.StatusDescription) || item.Status || "",
                                                statusId: item.StatusId || ((_c = item.Status) === null || _c === void 0 ? void 0 : _c.ID) || 0,
                                                nationality: item.Nationality || "",
                                                gender: item.Gender || "",
                                                jobCodeID: item.JobCodeId || 0,
                                                jobCode: ((_d = item.JobCode) === null || _d === void 0 ? void 0 : _d.JobCode) || "",
                                                department: item.Department || "",
                                                interviewDate: (item.InterviewDateLevel2 ||
                                                    item.InterviewDate ||
                                                    "").split("T")[0],
                                                disability: item.Disability || "",
                                                jobTitle: item.PositionTitle || "",
                                            }];
                                }
                            });
                        }); }))];
                    case 8:
                        enriched = _e.sent();
                        return [2 /*return*/, enriched];
                    case 9:
                        e_1 = _e.sent();
                        console.error("[getCandidatesByRecruitmentId]", e_1);
                        return [2 /*return*/, []];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    EvalutionL2Service.prototype.getReviewScoreCardData = function (candidateId, currentUserEmail, candidate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _questApi_1, _a, candidateRows, currentUserGuid_1, raw, recruitmentId, jobCodeId, jobCodeStr, department, statusId, fullName, interviewDate, existingComment, jobRequestId, _b, panelRows, reviewerRes, currentUserPanel, uniqueEmails, emailToDetails_1, panelMembers, reviewer, reviewerName, jobTitleEn, jobTitleFr, grade, interviewLevel, _c, gradeRes, questionsResult, scorecardData, level2ScorecardData, commentsData, error_1;
            var _this = this;
            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
            return tslib_1.__generator(this, function (_16) {
                switch (_16.label) {
                    case 0:
                        _16.trys.push([0, 5, , 6]);
                        _questApi_1 = new QuestionnaireApi_1.default();
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                    Select: [
                                        "ID",
                                        "FristName",
                                        "MiddleName",
                                        "LastName",
                                        "Nationality",
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
                                        "StatusId",
                                        "Comments",
                                        "JobRequestID",
                                        "RecruitmentID/ID",
                                        "JobCode/JobCode",
                                        "JobCode/ID",
                                    ].join(","),
                                    Expand: "RecruitmentID,JobCode",
                                    Filter: [
                                        { FilterKey: "ID", Operator: "eq", FilterValue: candidateId },
                                    ],
                                }),
                                (0, ReviewScoreCardServices_1._getUserGuid)(currentUserEmail),
                            ])];
                    case 1:
                        _a = _16.sent(), candidateRows = _a[0], currentUserGuid_1 = _a[1];
                        raw = (_d = candidateRows === null || candidateRows === void 0 ? void 0 : candidateRows[0]) !== null && _d !== void 0 ? _d : {};
                        recruitmentId = (_g = (_f = (_e = raw.RecruitmentID) === null || _e === void 0 ? void 0 : _e.ID) !== null && _f !== void 0 ? _f : raw.RecruitmentIDId) !== null && _g !== void 0 ? _g : 0;
                        jobCodeId = (_l = (_k = (_h = raw.JobCodeId) !== null && _h !== void 0 ? _h : (_j = raw.JobCode) === null || _j === void 0 ? void 0 : _j.ID) !== null && _k !== void 0 ? _k : candidate === null || candidate === void 0 ? void 0 : candidate.jobCodeID) !== null && _l !== void 0 ? _l : 0;
                        jobCodeStr = (_p = (_o = (_m = raw.JobCode) === null || _m === void 0 ? void 0 : _m.JobCode) !== null && _o !== void 0 ? _o : candidate === null || candidate === void 0 ? void 0 : candidate.jobCode) !== null && _p !== void 0 ? _p : "";
                        department = (_r = (_q = raw.Department) !== null && _q !== void 0 ? _q : candidate === null || candidate === void 0 ? void 0 : candidate.department) !== null && _r !== void 0 ? _r : "";
                        statusId = (_t = (_s = raw.StatusId) !== null && _s !== void 0 ? _s : candidate === null || candidate === void 0 ? void 0 : candidate.statusId) !== null && _t !== void 0 ? _t : 0;
                        fullName = [raw.FristName, raw.MiddleName, raw.LastName]
                            .filter(Boolean)
                            .join(" ")
                            .trim();
                        interviewDate = (raw.InterviewDateLevel2 ||
                            raw.InterviewDate ||
                            "").split("T")[0];
                        existingComment = raw.Comments || "";
                        jobRequestId = (_v = (_u = raw.JobRequestID) !== null && _u !== void 0 ? _u : raw.JobRequestId) !== null && _v !== void 0 ? _v : null;
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                    Select: "ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded",
                                    Expand: "InterviewPanel",
                                    Filter: [
                                        {
                                            FilterKey: "CandidateID/Id",
                                            Operator: "eq",
                                            FilterValue: candidateId,
                                        },
                                        {
                                            FilterKey: "InterviewLevel",
                                            Operator: "eq",
                                            FilterValue: ConditionConfig_1.InterviewLevels.Level2,
                                        },
                                    ],
                                }),
                                ServiceExport_1.masterService.GetUserDetails([
                                    {
                                        FilterKey: "EmailId",
                                        Operator: "eq",
                                        FilterValue: currentUserEmail,
                                    },
                                ], "and"),
                            ])];
                    case 2:
                        _b = _16.sent(), panelRows = _b[0], reviewerRes = _b[1];
                        currentUserPanel = panelRows.find(function (p) { var _a; return String((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === String(currentUserGuid_1); });
                        uniqueEmails = Array.from(new Set(panelRows
                            .map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; })
                            .filter(Boolean)));
                        emailToDetails_1 = {};
                        return [4 /*yield*/, Promise.all(uniqueEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var r, name_1, _a;
                                var _b, _c;
                                return tslib_1.__generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _d.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetUserDetails([{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }], "and")];
                                        case 1:
                                            r = _d.sent();
                                            if (r === null || r === void 0 ? void 0 : r.data) {
                                                name_1 = [
                                                    r.data.FirstName,
                                                    r.data.MiddleName,
                                                    r.data.LastName,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                    .trim();
                                                if (name_1)
                                                    emailToDetails_1[email.toLowerCase()] = {
                                                        name: name_1,
                                                        jobTitle: (_b = r.data.JopTitleEnglish) !== null && _b !== void 0 ? _b : "",
                                                        department: (_c = r.data.DepartmentName) !== null && _c !== void 0 ? _c : "",
                                                    };
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = _d.sent();
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        _16.sent();
                        panelMembers = panelRows
                            .map(function (p) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            var email = ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : "").toLowerCase();
                            var d = emailToDetails_1[email];
                            return d
                                ? {
                                    name: d.name,
                                    jobTitle: d.jobTitle,
                                    department: d.department,
                                    email: (_d = (_c = p.InterviewPanel) === null || _c === void 0 ? void 0 : _c.EMail) !== null && _d !== void 0 ? _d : "",
                                }
                                : {
                                    name: ((_e = p.InterviewPanel) === null || _e === void 0 ? void 0 : _e.Title) || "",
                                    jobTitle: "",
                                    department: "",
                                    email: (_g = (_f = p.InterviewPanel) === null || _f === void 0 ? void 0 : _f.EMail) !== null && _g !== void 0 ? _g : "",
                                };
                        })
                            .filter(function (m) { return !!m.name; });
                        reviewer = reviewerRes === null || reviewerRes === void 0 ? void 0 : reviewerRes.data;
                        reviewerName = reviewer
                            ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName]
                                .filter(Boolean)
                                .join(" ")
                                .trim()
                            : "";
                        jobTitleEn = (_w = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleEnglish) !== null && _w !== void 0 ? _w : "";
                        jobTitleFr = (_x = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleFrench) !== null && _x !== void 0 ? _x : "";
                        grade = (_z = (_y = raw.JobGrade) !== null && _y !== void 0 ? _y : candidate === null || candidate === void 0 ? void 0 : candidate.grade) !== null && _z !== void 0 ? _z : "";
                        interviewLevel = (_2 = (_0 = raw.InterviewLevel) !== null && _0 !== void 0 ? _0 : candidate === null || candidate === void 0 ? void 0 : candidate.interviewLevel) !== null && _2 !== void 0 ? _2 : "";
                        return [4 /*yield*/, Promise.all([
                                grade
                                    ? Promise.resolve(null)
                                    : ServiceExport_1.masterService
                                        .GetGradeLevel(raw.JobGrade || jobCodeStr)
                                        .catch(function () { return null; }),
                                jobCodeId
                                    ? ServiceExport_1.masterService
                                        .GetJobUniqueDataValue(jobCodeId)
                                        .then(function (r) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var key, qRes;
                                        var _a, _b, _c;
                                        return tslib_1.__generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    key = (_b = (_a = r === null || r === void 0 ? void 0 : r.data) === null || _a === void 0 ? void 0 : _a.JobCode) !== null && _b !== void 0 ? _b : "";
                                                    if (!key)
                                                        return [2 /*return*/, []];
                                                    return [4 /*yield*/, _questApi_1.getQuestionnaire(key)];
                                                case 1:
                                                    qRes = _d.sent();
                                                    return [2 /*return*/, ((_c = qRes === null || qRes === void 0 ? void 0 : qRes.data) !== null && _c !== void 0 ? _c : []).map(function (q) {
                                                            var _a;
                                                            return ({
                                                                id: q.id,
                                                                question: q.question,
                                                                answer: (_a = q.answer) !== null && _a !== void 0 ? _a : "",
                                                                rating: null,
                                                            });
                                                        })];
                                            }
                                        });
                                    }); })
                                        .catch(function () { return []; })
                                    : Promise.resolve([]),
                                this._getCandidateScorecard(candidateId),
                                this._getLevel2Scorecard(candidateId),
                                this.fetchComments(candidateId),
                            ])];
                    case 4:
                        _c = _16.sent(), gradeRes = _c[0], questionsResult = _c[1], scorecardData = _c[2], level2ScorecardData = _c[3], commentsData = _c[4];
                        if (!grade && (gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data))
                            grade = (_4 = (_3 = gradeRes.data) === null || _3 === void 0 ? void 0 : _3.GradeLevel) !== null && _4 !== void 0 ? _4 : "";
                        if (!interviewLevel)
                            interviewLevel =
                                raw.InterviewLevel ||
                                    ((_5 = String(raw.JobGrade || "").match(/Level\s*\d+/i)) === null || _5 === void 0 ? void 0 : _5[0]) ||
                                    "";
                        return [2 /*return*/, {
                                success: true,
                                candidateId: candidateId,
                                applicantName: fullName,
                                nationality: (_6 = raw.Nationality) !== null && _6 !== void 0 ? _6 : "",
                                gender: (_7 = raw.Gender) !== null && _7 !== void 0 ? _7 : "",
                                qualification: (_8 = raw.Qualification) !== null && _8 !== void 0 ? _8 : "",
                                miningExp: (_9 = raw.TotalYearOfExperiance) !== null && _9 !== void 0 ? _9 : "",
                                relevantExp: (_10 = raw.ReleventExperience) !== null && _10 !== void 0 ? _10 : "",
                                interviewDate: interviewDate,
                                interviewLevel: interviewLevel,
                                disability: (_12 = (_11 = raw.Disability) !== null && _11 !== void 0 ? _11 : raw.disability) !== null && _12 !== void 0 ? _12 : "",
                                conflictsOfInterest: (_13 = raw.ConflictsOfInterest) !== null && _13 !== void 0 ? _13 : "",
                                positionTitle: (_14 = raw.PositionTitle) !== null && _14 !== void 0 ? _14 : "",
                                grade: grade,
                                recruitmentId: recruitmentId,
                                jobCodeId: jobCodeId,
                                jobCode: jobCodeStr,
                                department: department,
                                panelMembers: panelMembers,
                                currentUserPanelId: (_15 = currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) !== null && _15 !== void 0 ? _15 : null,
                                currentUserGuid: currentUserGuid_1,
                                reviewerName: reviewerName,
                                jobTitleEn: jobTitleEn,
                                jobTitleFr: jobTitleFr,
                                questions: questionsResult,
                                scorecard: scorecardData,
                                level2Scorecard: level2ScorecardData,
                                level1Comments: commentsData.level1,
                                level2Comments: commentsData.level2,
                                statusId: statusId,
                                jobRequestId: jobRequestId,
                                hodDecision: null,
                                positionOptions: [],
                            }];
                    case 5:
                        error_1 = _16.sent();
                        console.error("[getReviewScoreCardData]", error_1);
                        return [2 /*return*/, (0, ReviewScoreCardServices_1.EMPTY)(candidateId)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    EvalutionL2Service.prototype._getCandidateScorecard = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var panels, allScores, _i, panels_1, p, sc, e_2;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID,InterviewPanel/Title,InterviewLevel",
                                Expand: "InterviewPanel",
                                Filter: [
                                    {
                                        FilterKey: "CandidateID/Id",
                                        Operator: "eq",
                                        FilterValue: candidateId,
                                    },
                                ],
                            })];
                    case 1:
                        panels = _b.sent();
                        allScores = [];
                        _i = 0, panels_1 = panels;
                        _b.label = 2;
                    case 2:
                        if (!(_i < panels_1.length)) return [3 /*break*/, 5];
                        p = panels_1[_i];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                Select: "*",
                                Filter: [
                                    {
                                        FilterKey: "InterviewPanelIDId",
                                        Operator: "eq",
                                        FilterValue: p.ID,
                                    },
                                ],
                            })];
                    case 3:
                        sc = _b.sent();
                        if (sc === null || sc === void 0 ? void 0 : sc.length)
                            allScores.push(tslib_1.__assign(tslib_1.__assign({}, sc[0]), { InterviewPersonName: ((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Title) || "", InterviewLevel: p.InterviewLevel || "" }));
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, allScores.length > 0 ? allScores : null];
                    case 6:
                        e_2 = _b.sent();
                        console.error("[_getCandidateScorecard]", e_2);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    EvalutionL2Service.prototype._getLevel2Scorecard = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, _a;
            var _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                                Select: "*",
                                Filter: [
                                    {
                                        FilterKey: "CandidateIDId",
                                        Operator: "eq",
                                        FilterValue: candidateId,
                                    },
                                ],
                            })];
                    case 1:
                        res = _c.sent();
                        return [2 /*return*/, (_b = res === null || res === void 0 ? void 0 : res[0]) !== null && _b !== void 0 ? _b : null];
                    case 2:
                        _a = _c.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EvalutionL2Service.prototype.fetchComments = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, panelItems, level2Items, panelEmails, empMap_1, level1, _i, _b, panel, panelEmail, emp, scorecard, scRows, _c, feedbackComment, overallFeedback, l2Emails, l2EmpMap_1, level2, e_3;
            var _this = this;
            var _d, _e, _f, _g, _h, _j, _k;
            return tslib_1.__generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _l.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                    Select: "ID,CandidateID/ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,IsScoreSheetUploaded",
                                    Expand: "InterviewPanel,RecruitmentID,CandidateID",
                                    Filter: [
                                        {
                                            FilterKey: "CandidateID/Id",
                                            Operator: "eq",
                                            FilterValue: candidateId,
                                        },
                                    ],
                                }).catch(function () { return []; }),
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                                    Select: "*,ID,CandidateID/ID,CandidateID/Title,Comments,Role/ID,Role/RoleTitle,Level,Author/EMail,Author/Title",
                                    Expand: "CandidateID,Role,Author",
                                    Filter: [
                                        {
                                            FilterKey: "CandidateIDId",
                                            Operator: "eq",
                                            FilterValue: candidateId,
                                        },
                                    ],
                                }).catch(function () { return []; }),
                            ])];
                    case 1:
                        _a = _l.sent(), panelItems = _a[0], level2Items = _a[1];
                        panelEmails = Array.from(new Set(panelItems
                            .map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; })
                            .filter(Boolean)));
                        empMap_1 = {};
                        return [4 /*yield*/, Promise.all(panelEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var r, d, name_2, _a;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetUserDetails([{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }], "and")];
                                        case 1:
                                            r = _b.sent();
                                            if (r === null || r === void 0 ? void 0 : r.data) {
                                                d = r.data;
                                                name_2 = [d.FirstName, d.MiddleName, d.LastName]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                    .trim();
                                                empMap_1[email.toLowerCase()] = {
                                                    name: name_2,
                                                    jobTitle: d.JopTitleEnglish || "",
                                                    jobTitleFr: d.JopTitleFrench || "",
                                                    department: d.DepartmentName || "",
                                                };
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
                        _l.sent();
                        level1 = [];
                        _i = 0, _b = panelItems;
                        _l.label = 3;
                    case 3:
                        if (!(_i < _b.length)) return [3 /*break*/, 9];
                        panel = _b[_i];
                        if (((_d = panel.CandidateID) === null || _d === void 0 ? void 0 : _d.ID) !== candidateId)
                            return [3 /*break*/, 8];
                        panelEmail = ((_f = (_e = panel.InterviewPanel) === null || _e === void 0 ? void 0 : _e.EMail) !== null && _f !== void 0 ? _f : "").toLowerCase();
                        emp = empMap_1[panelEmail];
                        scorecard = null;
                        _l.label = 4;
                    case 4:
                        _l.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                Select: "ID,Feedback,OverAllEvaluationFeedback,Created,Role/RoleTitle,Author/EMail,Author/Title",
                                Expand: "Role,Author",
                                Filter: [
                                    {
                                        FilterKey: "InterviewPanelIDId",
                                        Operator: "eq",
                                        FilterValue: panel.ID,
                                    },
                                ],
                            })];
                    case 5:
                        scRows = _l.sent();
                        scorecard = (_g = scRows === null || scRows === void 0 ? void 0 : scRows[0]) !== null && _g !== void 0 ? _g : null;
                        return [3 /*break*/, 7];
                    case 6:
                        _c = _l.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        feedbackComment = (scorecard === null || scorecard === void 0 ? void 0 : scorecard.Feedback) || "";
                        overallFeedback = (scorecard === null || scorecard === void 0 ? void 0 : scorecard.OverAllEvaluationFeedback) || "";
                        if (!feedbackComment && !overallFeedback)
                            return [3 /*break*/, 8];
                        level1.push({
                            Id: panel.ID,
                            Name: (emp === null || emp === void 0 ? void 0 : emp.name) ||
                                ((_h = scorecard === null || scorecard === void 0 ? void 0 : scorecard.Author) === null || _h === void 0 ? void 0 : _h.Title) ||
                                ((_j = panel.InterviewPanel) === null || _j === void 0 ? void 0 : _j.Title) ||
                                "",
                            JobTitleInEnglish: (emp === null || emp === void 0 ? void 0 : emp.jobTitle) || "",
                            JobTitleInFrench: (emp === null || emp === void 0 ? void 0 : emp.jobTitleFr) || "",
                            Department: (emp === null || emp === void 0 ? void 0 : emp.department) || "",
                            Date: (scorecard === null || scorecard === void 0 ? void 0 : scorecard.Created) ? new Date(scorecard.Created) : null,
                            RoleName: ((_k = scorecard === null || scorecard === void 0 ? void 0 : scorecard.Role) === null || _k === void 0 ? void 0 : _k.RoleTitle) || "",
                            comments: feedbackComment,
                            OverAllEvaluationFeedback: overallFeedback,
                            Level: "Level 1",
                        });
                        _l.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9:
                        l2Emails = Array.from(new Set(level2Items
                            .map(function (i) { var _a; return (_a = i.Author) === null || _a === void 0 ? void 0 : _a.EMail; })
                            .filter(Boolean)));
                        l2EmpMap_1 = {};
                        return [4 /*yield*/, Promise.all(l2Emails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var r, d, name_3, _a;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetUserDetails([{ FilterKey: "EmailId", Operator: "eq", FilterValue: email }], "and")];
                                        case 1:
                                            r = _b.sent();
                                            if (r === null || r === void 0 ? void 0 : r.data) {
                                                d = r.data;
                                                name_3 = [d.FirstName, d.MiddleName, d.LastName]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                    .trim();
                                                l2EmpMap_1[email.toLowerCase()] = {
                                                    name: name_3,
                                                    jobTitle: d.JopTitleEnglish || "",
                                                    jobTitleFr: d.JopTitleFrench || "",
                                                    department: d.DepartmentName || "",
                                                };
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = _b.sent();
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 10:
                        _l.sent();
                        level2 = level2Items
                            .filter(function (i) {
                            var _a;
                            return ((_a = i.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) === candidateId ||
                                i.CandidateIDId === candidateId;
                        })
                            .map(function (i) {
                            var _a, _b, _c, _d, _e;
                            var email = ((_b = (_a = i.Author) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : "").toLowerCase();
                            var emp = l2EmpMap_1[email];
                            return {
                                Id: (_c = i.ID) !== null && _c !== void 0 ? _c : null,
                                Name: (emp === null || emp === void 0 ? void 0 : emp.name) || ((_d = i.Author) === null || _d === void 0 ? void 0 : _d.Title) || "",
                                JobTitleInEnglish: (emp === null || emp === void 0 ? void 0 : emp.jobTitle) || i.JobTitleInEnglish || "",
                                JobTitleInFrench: (emp === null || emp === void 0 ? void 0 : emp.jobTitleFr) || i.JobTitleInFrench || "",
                                Department: (emp === null || emp === void 0 ? void 0 : emp.department) || i.Department || "",
                                Date: i.Created ? new Date(i.Created) : null,
                                RoleName: ((_e = i.Role) === null || _e === void 0 ? void 0 : _e.RoleTitle) || i.RoleName || "",
                                comments: i.Comments || i.comments || "",
                                OverAllEvaluationFeedback: i.OverAllEvaluationFeedback || "",
                                Level: "Level 2",
                            };
                        });
                        return [2 /*return*/, { level1: level1, level2: level2 }];
                    case 11:
                        e_3 = _l.sent();
                        console.error("[fetchComments]", e_3);
                        return [2 /*return*/, { level1: [], level2: [] }];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    EvalutionL2Service.prototype.submitEvaluationL2 = function (payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var candidateId, panelId, comments, updatedPanelRows, level2Panels, submittedCount, hodWorkflowTriggered;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        candidateId = payload.candidateId, panelId = payload.panelId, comments = payload.comments;
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                RequestJSON: {
                                    IsScoreSheetUploaded: "Yes",
                                },
                                ID: panelId,
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                                RequestJSON: {
                                    Comments: comments.Comments,
                                    CandidateIDId: comments.CandidateIDId,
                                    RoleId: comments.RoleId,
                                    Level: comments.level,
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "ID,InterviewLevel,IsScoreSheetUploaded",
                                Filter: [
                                    {
                                        FilterKey: "CandidateIDId",
                                        Operator: "eq",
                                        FilterValue: candidateId,
                                    },
                                ],
                            })];
                    case 3:
                        updatedPanelRows = _a.sent();
                        level2Panels = updatedPanelRows.filter(function (p) { return p.InterviewLevel === ConditionConfig_1.InterviewLevels.Level2; });
                        submittedCount = level2Panels.filter(function (p) { return p.IsScoreSheetUploaded === "Yes"; }).length;
                        console.log("[submitEvaluationL2] Level-2 panels \u2014 total: ".concat(level2Panels.length, " | submitted: ").concat(submittedCount));
                        hodWorkflowTriggered = false;
                        if (!(level2Panels.length > 0 && submittedCount === level2Panels.length)) return [3 /*break*/, 5];
                        console.log("[submitEvaluationL2] ALL Level-2 panels submitted → triggering HOD workflow");
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                RequestJSON: {
                                    IsScoreSheetUploaded: "Yes",
                                    StatusId: Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD,
                                },
                                ID: candidateId,
                            })];
                    case 4:
                        _a.sent();
                        hodWorkflowTriggered = true;
                        console.log("[submitEvaluationL2] Candidate SP record updated — HOD workflow triggered ✅");
                        return [3 /*break*/, 6];
                    case 5:
                        console.log("[submitEvaluationL2] HOD workflow NOT triggered \u2014 ".concat(level2Panels.length - submittedCount, " panel(s) still pending"));
                        _a.label = 6;
                    case 6: return [2 /*return*/, { success: true, hodWorkflowTriggered: hodWorkflowTriggered }];
                }
            });
        });
    };
    return EvalutionL2Service;
}());
exports.default = EvalutionL2Service;
//# sourceMappingURL=EvalutionL2.js.map