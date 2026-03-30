"use strict";
// ReviewScoreCardServies/ReviewScoreCardServices.ts
// All API calls for the ReviewScoreCard feature.
// GPA calculation mirrors old EvaluationApiService.fetchScorecardCandidates exactly:
//   sumOverall  = 8 criteria scores (each 0-5) — Level 1 panels only
//   sumQuestion = question scores (each 0-3)
//   maxOverall  = level1Count × 40
//   maxQuestion = questionCount × 3
//   GPA         = floor((sumOverall + sumQuestion) / (maxOverall + maxQuestion) × 5 × 100) / 100
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLevel2 = exports.canView = exports.canEdit = exports.VIEW_ONLY_STATUS_IDS = exports.EDITABLE_STATUS_IDS = exports.HOD_SCORECARD_STATUS_IDS = void 0;
var tslib_1 = require("tslib");
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var MasterService_1 = tslib_1.__importDefault(require("../../../../services/MasterService/MasterService"));
var CommonServices_1 = tslib_1.__importDefault(require("../../SelectionProcess/CommonServices/CommonServices"));
var QuestionnaireApi_1 = tslib_1.__importDefault(require("../../Evalution/Evaluationservice/QuestionnaireApi/QuestionnaireApi"));
var Config_1 = require("../../../../utilities/Config");
var _common = new CommonServices_1.default();
var _master = new MasterService_1.default();
var _questApi = new QuestionnaireApi_1.default();
// ── Status constants ──────────────────────────────────────────────────────────
exports.HOD_SCORECARD_STATUS_IDS = [
    121, 122, 123, 15, 127, 130, 165, 166, 167, 168,
];
exports.EDITABLE_STATUS_IDS = [121, 123, 127, 130, 165, 166];
exports.VIEW_ONLY_STATUS_IDS = [122, 15, 167, 168];
var canEdit = function (statusId) { return exports.EDITABLE_STATUS_IDS.includes(statusId); };
exports.canEdit = canEdit;
var canView = function (statusId) { return exports.VIEW_ONLY_STATUS_IDS.includes(statusId); };
exports.canView = canView;
var isLevel2 = function (statusId) { return [130, 129, 127, 166].includes(statusId); };
exports.isLevel2 = isLevel2;
// ── Helpers ───────────────────────────────────────────────────────────────────
/** Parse QuestionJson — handles string or array */
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
/**
 * GPA calculation — exact mirror of old fetchScorecardCandidates logic:
 *   - Only Level 1 panels counted for maxOverall
 *   - sumOverall  = 8 criteria scores per Level1 panel
 *   - sumQuestion = question scores across ALL panels
 *   - maxOverall  = level1Count × 40
 *   - maxQuestion = total questions × 3
 *   - GPA = floor((combined / maxPossible) × 5 × 100) / 100
 */
function _calculateGPA(candidateId) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var panels, level1Count, maxOverallScore, sumOverall, sumQuestion, maxQuestion, _i, panels_1, panel, scorecards, sc, questionData, questionScore, combined, maxPossible, gpa, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[ReviewScoreCardServices] _calculateGPA called with candidateId:', candidateId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            Select: 'ID,InterviewLevel,CandidateID/ID',
                            Expand: 'CandidateID',
                            Filter: [{ FilterKey: 'CandidateID/Id', Operator: 'eq', FilterValue: candidateId }],
                        })];
                case 2:
                    panels = _a.sent();
                    if (!panels || panels.length === 0)
                        return [2 /*return*/, ''];
                    level1Count = panels.filter(function (p) { return p.InterviewLevel === 'Level 1'; }).length;
                    maxOverallScore = level1Count * 40;
                    sumOverall = 0;
                    sumQuestion = 0;
                    maxQuestion = 0;
                    _i = 0, panels_1 = panels;
                    _a.label = 3;
                case 3:
                    if (!(_i < panels_1.length)) return [3 /*break*/, 6];
                    panel = panels_1[_i];
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                            Select: '*',
                            Filter: [{ FilterKey: 'InterviewPanelIDId', Operator: 'eq', FilterValue: panel.ID }],
                        })];
                case 4:
                    scorecards = _a.sent();
                    if (scorecards.length > 0) {
                        sc = scorecards[0];
                        // Sum 8 criteria scores (each 0-5) — old code exact
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
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    combined = sumOverall + sumQuestion;
                    maxPossible = maxOverallScore + maxQuestion;
                    if (maxPossible <= 0)
                        return [2 /*return*/, ''];
                    gpa = Math.floor((combined / maxPossible) * 5 * 100) / 100;
                    console.log('[ReviewScoreCardServices] _calculateGPA returning GPA:', gpa, 'for candidateId:', candidateId);
                    return [2 /*return*/, String(gpa)];
                case 7:
                    e_1 = _a.sent();
                    console.warn('[_calculateGPA] error for candidate', candidateId, e_1);
                    return [2 /*return*/, ''];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var EMPTY = function (id) { return ({
    success: false, candidateId: id, applicantName: '', nationality: '', gender: '',
    qualification: '', miningExp: '', relevantExp: '', interviewDate: '',
    interviewLevel: '', disability: '', conflictsOfInterest: '', positionTitle: '',
    grade: '', recruitmentId: 0, jobCodeId: 0, jobCode: '', department: '',
    panelMembers: [], currentUserPanelId: null, currentUserGuid: null,
    reviewerName: '', jobTitleEn: '', jobTitleFr: '', questions: [],
    scorecard: null, level2Scorecard: null, hodDecision: null,
    positionOptions: [], level1Comments: [], level2Comments: [], statusId: 0,
}); };
// ── Service ───────────────────────────────────────────────────────────────────
var ReviewScoreCardServices = /** @class */ (function () {
    function ReviewScoreCardServices() {
    }
    /**
     * STEP 1 — Candidate list for the drawer by RecruitmentID
     * GPA calculated per candidate using old fetchScorecardCandidates logic
     */
    ReviewScoreCardServices.prototype.getCandidatesByRecruitmentId = function (recruitmentID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, defaultGrade_1, defaultLevel_1, posRes, gradeRes, _1, enrichedWithGPA, e_2;
            var _this = this;
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log('[ReviewScoreCardServices] getCandidatesByRecruitmentId called with recruitmentID:', recruitmentID);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: '*,JobCode/JobCode,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID',
                                Expand: 'JobCode,RecruitmentID,Status',
                                FilterCondition: 'and',
                                Filter: [
                                    { FilterKey: 'RecruitmentIDId', Operator: 'eq', FilterValue: recruitmentID },
                                    { FilterKey: 'ItemCreated', Operator: 'eq', FilterValue: 'No' },
                                    { FilterKey: 'StatusId', Operator: 'in', FilterValue: exports.HOD_SCORECARD_STATUS_IDS },
                                ],
                                Topcount: 1000,
                            })];
                    case 2:
                        res = _e.sent();
                        defaultGrade_1 = '';
                        defaultLevel_1 = '';
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 7, , 8]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentPositionDetails,
                                Select: '*,PatersonGrade/PatersonGrade',
                                Expand: 'PatersonGrade',
                                Filter: [{ FilterKey: 'RecruitmentID', Operator: 'eq', FilterValue: recruitmentID }],
                            })];
                    case 4:
                        posRes = _e.sent();
                        defaultGrade_1 = ((_b = (_a = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _a === void 0 ? void 0 : _a.PatersonGrade) === null || _b === void 0 ? void 0 : _b.PatersonGrade) || ((_c = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _c === void 0 ? void 0 : _c.PatersonGrade) || '';
                        if (!defaultGrade_1) return [3 /*break*/, 6];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSGradeMaster,
                                Select: '*',
                                Filter: [{ FilterKey: 'PatersonGrade', Operator: 'eq', FilterValue: defaultGrade_1 }],
                            })];
                    case 5:
                        gradeRes = _e.sent();
                        defaultLevel_1 = ((_d = gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes[0]) === null || _d === void 0 ? void 0 : _d.Levels) || '';
                        _e.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        _1 = _e.sent();
                        return [3 /*break*/, 8];
                    case 8: return [4 /*yield*/, Promise.all((res || []).map(function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var candidateId, candidateGrade, gpa;
                            var _a, _b, _c, _d;
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        candidateId = item.ID;
                                        candidateGrade = item.JobGrade || item.PatersonGrade || defaultGrade_1 || '';
                                        console.log('[getCandidatesByRecruitmentId] candidate', candidateId, 'grade resolve:', {
                                            jobGrade: item.JobGrade,
                                            patersonGrade: item.PatersonGrade,
                                            defaultGrade: defaultGrade_1,
                                            resolvedGrade: candidateGrade,
                                        });
                                        return [4 /*yield*/, _calculateGPA(candidateId)];
                                    case 1:
                                        gpa = _e.sent();
                                        return [2 /*return*/, {
                                                id: candidateId,
                                                recruitmentID: ((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.ID) || recruitmentID,
                                                fullName: [item.FristName, item.MiddleName, item.LastName]
                                                    .filter(Boolean).join(' ').trim(),
                                                positionTitle: item.PositionTitle || '',
                                                interviewLevel: item.InterviewLevel || defaultLevel_1,
                                                grade: candidateGrade,
                                                gpa: gpa, // ← calculated GPA (not from SP field)
                                                status: ((_b = item.Status) === null || _b === void 0 ? void 0 : _b.StatusDescription) || item.Status || '',
                                                statusId: item.StatusId || ((_c = item.Status) === null || _c === void 0 ? void 0 : _c.ID) || 0,
                                                nationality: item.Nationality || '',
                                                gender: item.Gender || '',
                                                jobCodeID: item.JobCodeId || 0,
                                                jobCode: ((_d = item.JobCode) === null || _d === void 0 ? void 0 : _d.JobCode) || '',
                                                department: item.Department || '',
                                                interviewDate: (item.InterviewDateLevel2 || item.InterviewDate || '').split('T')[0],
                                                disability: item.Disability || '',
                                                jobTitle: item.PositionTitle || '',
                                            }];
                                }
                            });
                        }); }))];
                    case 9:
                        enrichedWithGPA = _e.sent();
                        console.log('[ReviewScoreCardServices] getCandidatesByRecruitmentId returning:', enrichedWithGPA.length, 'candidates');
                        return [2 /*return*/, enrichedWithGPA];
                    case 10:
                        e_2 = _e.sent();
                        console.error('[getCandidatesByRecruitmentId] error:', e_2);
                        return [2 /*return*/, []];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /** STEP 2 — Full detail: panel members, questions, scorecard[], HOD decision, comments, positions */
    ReviewScoreCardServices.prototype.getReviewScoreCardData = function (candidateId, currentUserEmail, candidate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, candidateRows, currentUserGuid_1, raw, recruitmentId, jobCodeId, jobCodeStr, department, statusId, fullName, interviewDate, _b, panelRows, reviewerRes, currentUserPanel, uniqueEmails, emailToDetails_1, panelMembers, reviewer, reviewerName, jobTitleEn, jobTitleFr, grade, interviewLevel, _c, gradeRes, questionsResult, scorecardData, level2ScorecardData, hodDecisionData, positionOptionsData, commentsData, error_1;
            var _this = this;
            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
            return tslib_1.__generator(this, function (_16) {
                switch (_16.label) {
                    case 0:
                        console.log('[ReviewScoreCardServices] getReviewScoreCardData called with candidateId:', candidateId, 'currentUserEmail:', currentUserEmail, 'candidate:', candidate);
                        _16.label = 1;
                    case 1:
                        _16.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                    Select: [
                                        'ID', 'FristName', 'MiddleName', 'LastName',
                                        'Nationality', 'Gender', 'Qualification',
                                        'TotalYearOfExperiance', 'ReleventExperience',
                                        'InterviewDate', 'InterviewDateLevel2',
                                        'Disability', 'ConflictsOfInterest', 'PositionTitle',
                                        'JobGrade', 'JobCodeId', 'StatusId',
                                        'RecruitmentID/ID', 'JobCode/JobCode', 'JobCode/ID',
                                    ].join(','),
                                    Expand: 'RecruitmentID,JobCode',
                                    Filter: [{ FilterKey: 'ID', Operator: 'eq', FilterValue: candidateId }],
                                }),
                                _getUserGuid(currentUserEmail),
                            ])];
                    case 2:
                        _a = _16.sent(), candidateRows = _a[0], currentUserGuid_1 = _a[1];
                        raw = (_d = candidateRows === null || candidateRows === void 0 ? void 0 : candidateRows[0]) !== null && _d !== void 0 ? _d : {};
                        recruitmentId = (_g = (_f = (_e = raw.RecruitmentID) === null || _e === void 0 ? void 0 : _e.ID) !== null && _f !== void 0 ? _f : raw.RecruitmentIDId) !== null && _g !== void 0 ? _g : 0;
                        jobCodeId = (_l = (_k = (_h = raw.JobCodeId) !== null && _h !== void 0 ? _h : (_j = raw.JobCode) === null || _j === void 0 ? void 0 : _j.ID) !== null && _k !== void 0 ? _k : candidate === null || candidate === void 0 ? void 0 : candidate.jobCodeID) !== null && _l !== void 0 ? _l : 0;
                        jobCodeStr = (_p = (_o = (_m = raw.JobCode) === null || _m === void 0 ? void 0 : _m.JobCode) !== null && _o !== void 0 ? _o : candidate === null || candidate === void 0 ? void 0 : candidate.jobCode) !== null && _p !== void 0 ? _p : '';
                        department = (_r = (_q = raw.Department) !== null && _q !== void 0 ? _q : candidate === null || candidate === void 0 ? void 0 : candidate.department) !== null && _r !== void 0 ? _r : '';
                        statusId = (_t = (_s = raw.StatusId) !== null && _s !== void 0 ? _s : candidate === null || candidate === void 0 ? void 0 : candidate.statusId) !== null && _t !== void 0 ? _t : 0;
                        fullName = [raw.FristName, raw.MiddleName, raw.LastName]
                            .filter(Boolean).join(' ').trim();
                        interviewDate = (raw.InterviewDateLevel2 || raw.InterviewDate || '').split('T')[0];
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                    Select: 'ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded',
                                    Expand: 'InterviewPanel',
                                    Filter: [{ FilterKey: 'CandidateID/Id', Operator: 'eq', FilterValue: candidateId }],
                                }),
                                _master.GetUserDetails([{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: currentUserEmail }], 'and'),
                            ])];
                    case 3:
                        _b = _16.sent(), panelRows = _b[0], reviewerRes = _b[1];
                        currentUserPanel = panelRows.find(function (p) { var _a; return String((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === String(currentUserGuid_1); });
                        uniqueEmails = Array.from(new Set(panelRows.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; }).filter(Boolean)));
                        emailToDetails_1 = {};
                        return [4 /*yield*/, Promise.all(uniqueEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var res, name_1, _a;
                                var _b, _c;
                                return tslib_1.__generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _d.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, _master.GetUserDetails([{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: email }], 'and')];
                                        case 1:
                                            res = _d.sent();
                                            if (res === null || res === void 0 ? void 0 : res.data) {
                                                name_1 = [res.data.FirstName, res.data.MiddleName, res.data.LastName]
                                                    .filter(Boolean).join(' ').trim();
                                                if (name_1) {
                                                    emailToDetails_1[email.toLowerCase()] = {
                                                        name: name_1,
                                                        jobTitle: (_b = res.data.JopTitleEnglish) !== null && _b !== void 0 ? _b : '',
                                                        department: (_c = res.data.DepartmentName) !== null && _c !== void 0 ? _c : '',
                                                    };
                                                }
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = _d.sent();
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 4:
                        _16.sent();
                        panelMembers = panelRows
                            .map(function (p) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            var email = ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : '').toLowerCase();
                            var d = emailToDetails_1[email];
                            return d
                                ? { name: d.name, jobTitle: d.jobTitle, department: d.department, email: (_d = (_c = p.InterviewPanel) === null || _c === void 0 ? void 0 : _c.EMail) !== null && _d !== void 0 ? _d : '' }
                                : { name: ((_e = p.InterviewPanel) === null || _e === void 0 ? void 0 : _e.Title) || '', jobTitle: '', department: '', email: (_g = (_f = p.InterviewPanel) === null || _f === void 0 ? void 0 : _f.EMail) !== null && _g !== void 0 ? _g : '' };
                        })
                            .filter(function (m) { return !!m.name; });
                        reviewer = reviewerRes === null || reviewerRes === void 0 ? void 0 : reviewerRes.data;
                        reviewerName = reviewer
                            ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName]
                                .filter(Boolean).join(' ').trim()
                            : '';
                        jobTitleEn = (_u = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleEnglish) !== null && _u !== void 0 ? _u : '';
                        jobTitleFr = (_v = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleFrench) !== null && _v !== void 0 ? _v : '';
                        grade = (_x = (_w = raw.JobGrade) !== null && _w !== void 0 ? _w : candidate === null || candidate === void 0 ? void 0 : candidate.grade) !== null && _x !== void 0 ? _x : '';
                        interviewLevel = (_z = (_y = raw.InterviewLevel) !== null && _y !== void 0 ? _y : candidate === null || candidate === void 0 ? void 0 : candidate.interviewLevel) !== null && _z !== void 0 ? _z : '';
                        return [4 /*yield*/, Promise.all([
                                grade
                                    ? Promise.resolve(null)
                                    : _master.GetGradeLevel(raw.JobGrade || jobCodeStr).catch(function () { return null; }),
                                jobCodeId
                                    ? _master.GetJobUniqueDataValue(jobCodeId)
                                        .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var key, qRes;
                                        var _a, _b, _c;
                                        return tslib_1.__generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    key = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.JobCode) !== null && _b !== void 0 ? _b : '';
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
                                                                answer: (_a = q.answer) !== null && _a !== void 0 ? _a : '',
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
                                this._getHODDecision(candidateId),
                                this.fetchPositionOptions(jobCodeId, department),
                                this.fetchComments(candidateId),
                            ])];
                    case 5:
                        _c = _16.sent(), gradeRes = _c[0], questionsResult = _c[1], scorecardData = _c[2], level2ScorecardData = _c[3], hodDecisionData = _c[4], positionOptionsData = _c[5], commentsData = _c[6];
                        if (!grade && (gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data))
                            grade = (_2 = (_0 = gradeRes.data) === null || _0 === void 0 ? void 0 : _0.GradeLevel) !== null && _2 !== void 0 ? _2 : '';
                        if (!interviewLevel) {
                            interviewLevel =
                                raw.InterviewLevel ||
                                    ((_3 = String(raw.JobGrade || '').match(/Level\s*\d+/i)) === null || _3 === void 0 ? void 0 : _3[0]) ||
                                    ((_5 = String(((_4 = gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data) === null || _4 === void 0 ? void 0 : _4.GradeLevel) || '').match(/Level\s*\d+/i)) === null || _5 === void 0 ? void 0 : _5[0]) ||
                                    '';
                        }
                        console.log('[ReviewScoreCardServices] getReviewScoreCardData returning success:', true, 'for candidateId:', candidateId);
                        return [2 /*return*/, {
                                success: true,
                                candidateId: candidateId,
                                applicantName: fullName,
                                nationality: (_6 = raw.Nationality) !== null && _6 !== void 0 ? _6 : '',
                                gender: (_7 = raw.Gender) !== null && _7 !== void 0 ? _7 : '',
                                qualification: (_8 = raw.Qualification) !== null && _8 !== void 0 ? _8 : '',
                                miningExp: (_9 = raw.TotalYearOfExperiance) !== null && _9 !== void 0 ? _9 : '',
                                relevantExp: (_10 = raw.ReleventExperience) !== null && _10 !== void 0 ? _10 : '',
                                interviewDate: interviewDate,
                                interviewLevel: interviewLevel,
                                disability: (_12 = (_11 = raw.Disability) !== null && _11 !== void 0 ? _11 : raw.disability) !== null && _12 !== void 0 ? _12 : '',
                                conflictsOfInterest: (_13 = raw.ConflictsOfInterest) !== null && _13 !== void 0 ? _13 : '',
                                positionTitle: (_14 = raw.PositionTitle) !== null && _14 !== void 0 ? _14 : '',
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
                                hodDecision: hodDecisionData,
                                positionOptions: positionOptionsData,
                                level1Comments: commentsData.level1,
                                level2Comments: commentsData.level2,
                                statusId: statusId,
                            }];
                    case 6:
                        error_1 = _16.sent();
                        console.error('[getReviewScoreCardData] error:', error_1);
                        return [2 /*return*/, EMPTY(candidateId)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /** All panel scorecards for a candidate (one per panel member) */
    ReviewScoreCardServices.prototype._getCandidateScorecard = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var panels, allScores, _i, panels_2, p, sc, e_3;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('[ReviewScoreCardServices] _getCandidateScorecard called with candidateId:', candidateId);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: 'ID,InterviewPanel/Title,InterviewLevel',
                                Expand: 'InterviewPanel',
                                Filter: [{ FilterKey: 'CandidateID/Id', Operator: 'eq', FilterValue: candidateId }],
                            })];
                    case 2:
                        panels = _b.sent();
                        allScores = [];
                        _i = 0, panels_2 = panels;
                        _b.label = 3;
                    case 3:
                        if (!(_i < panels_2.length)) return [3 /*break*/, 6];
                        p = panels_2[_i];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                Select: '*',
                                Filter: [{ FilterKey: 'InterviewPanelIDId', Operator: 'eq', FilterValue: p.ID }],
                            })];
                    case 4:
                        sc = _b.sent();
                        if (sc === null || sc === void 0 ? void 0 : sc.length) {
                            allScores.push(tslib_1.__assign(tslib_1.__assign({}, sc[0]), { InterviewPersonName: ((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Title) || '', InterviewLevel: p.InterviewLevel || '' }));
                        }
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        console.log('[ReviewScoreCardServices] _getCandidateScorecard returning:', allScores.length, 'scorecards');
                        return [2 /*return*/, allScores.length > 0 ? allScores : null];
                    case 7:
                        e_3 = _b.sent();
                        console.error('[_getCandidateScorecard]', e_3);
                        return [2 /*return*/, null];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ReviewScoreCardServices.prototype._getLevel2Scorecard = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, e_4;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('[ReviewScoreCardServices] _getLevel2Scorecard called with candidateId:', candidateId);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                                Select: '*',
                                Filter: [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
                            })];
                    case 2:
                        res = _b.sent();
                        console.log('[ReviewScoreCardServices] _getLevel2Scorecard returning:', (res === null || res === void 0 ? void 0 : res[0]) ? 'found' : 'null');
                        return [2 /*return*/, (_a = res === null || res === void 0 ? void 0 : res[0]) !== null && _a !== void 0 ? _a : null];
                    case 3:
                        e_4 = _b.sent();
                        console.error('[_getLevel2Scorecard]', e_4);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ReviewScoreCardServices.prototype._getHODDecision = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, e_5;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('[ReviewScoreCardServices] _getHODDecision called with candidateId:', candidateId);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                                Select: '*,PositionID/PositionID,PositionID/ID',
                                Expand: 'PositionID',
                                Filter: [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
                            })];
                    case 2:
                        res = _b.sent();
                        console.log('[ReviewScoreCardServices] _getHODDecision returning:', (res === null || res === void 0 ? void 0 : res[0]) ? 'found' : 'null');
                        return [2 /*return*/, (_a = res === null || res === void 0 ? void 0 : res[0]) !== null && _a !== void 0 ? _a : null];
                    case 3:
                        e_5 = _b.sent();
                        console.error('[_getHODDecision]', e_5);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /** Fetch level1 + level2 comments */
    ReviewScoreCardServices.prototype.fetchComments = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, l1, l2, mapL1, mapL2, level1, level2, e_6;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('[ReviewScoreCardServices] fetchComments called with candidateId:', candidateId);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                                    Select: '*,CandidateID/ID,AddedBy/Title,AddedBy/JobTitle,AddedBy/Department',
                                    Expand: 'CandidateID,AddedBy',
                                    Filter: [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
                                }).catch(function () { return []; }),
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                                    Select: '*',
                                    Filter: [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
                                }).catch(function () { return []; }),
                            ])];
                    case 2:
                        _a = _b.sent(), l1 = _a[0], l2 = _a[1];
                        mapL1 = function (i) {
                            var _a, _b, _c, _d;
                            return ({
                                Id: (_a = i.ID) !== null && _a !== void 0 ? _a : null,
                                Name: ((_b = i.AddedBy) === null || _b === void 0 ? void 0 : _b.Title) || i.Name || '',
                                JobTitleInEnglish: i.JobTitleInEnglish || ((_c = i.AddedBy) === null || _c === void 0 ? void 0 : _c.JobTitle) || '',
                                JobTitleInFrench: i.JobTitleInFrench || '',
                                Department: i.Department || ((_d = i.AddedBy) === null || _d === void 0 ? void 0 : _d.Department) || '',
                                Date: i.Modified || i.Created || null,
                                RoleName: i.RoleName || '',
                                comments: i.Comments || i.comments || '',
                                OverAllEvaluationFeedback: i.OverAllEvaluationFeedback || '',
                                Level: 'Level 1',
                            });
                        };
                        mapL2 = function (i) {
                            var _a;
                            return ({
                                Id: (_a = i.ID) !== null && _a !== void 0 ? _a : null,
                                Name: i.Name || '',
                                JobTitleInEnglish: i.JobTitleInEnglish || '',
                                JobTitleInFrench: i.JobTitleInFrench || '',
                                Department: i.Department || '',
                                Date: i.Modified || i.Created || null,
                                RoleName: i.RoleName || '',
                                comments: i.Comments || i.comments || '',
                                OverAllEvaluationFeedback: i.OverAllEvaluationFeedback || '',
                                Level: 'Level 2',
                            });
                        };
                        level1 = l1.map(mapL1);
                        level2 = l2.map(mapL2);
                        console.log('[ReviewScoreCardServices] fetchComments returning level1:', level1.length, 'level2:', level2.length);
                        return [2 /*return*/, { level1: level1, level2: level2 }];
                    case 3:
                        e_6 = _b.sent();
                        console.error('[fetchComments]', e_6);
                        return [2 /*return*/, { level1: [], level2: [] }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /** Position dropdown options for HOD panel */
    ReviewScoreCardServices.prototype.fetchPositionOptions = function (jobCodeID, department) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, fb, e_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('[ReviewScoreCardServices] fetchPositionOptions called with jobCodeID:', jobCodeID, 'department:', department);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSPositionIDMaster,
                                Select: '*,JobCode/JobCode',
                                Expand: 'JobCode',
                                FilterCondition: 'and',
                                Filter: [
                                    { FilterKey: 'JobCode', Operator: 'eq', FilterValue: jobCodeID },
                                    { FilterKey: 'Department', Operator: 'eq', FilterValue: department },
                                    { FilterKey: 'PositionIDStatus', Operator: 'eq', FilterValue: 'Recruitment Initiator' },
                                ],
                                Topcount: 100,
                            })];
                    case 2:
                        res = _a.sent();
                        if (res === null || res === void 0 ? void 0 : res.length) {
                            return [2 /*return*/, res.map(function (i) { return ({
                                    key: i.ID,
                                    text: i.PositionID || i.Title || "#".concat(i.ID),
                                }); })];
                        }
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSPositionIDMaster,
                                Select: '*',
                                Filter: [
                                    { FilterKey: 'Department', Operator: 'eq', FilterValue: department },
                                    { FilterKey: 'PositionIDStatus', Operator: 'eq', FilterValue: 'Recruitment Initiator' },
                                ],
                                Topcount: 100,
                            })];
                    case 3:
                        fb = _a.sent();
                        console.log('[ReviewScoreCardServices] fetchPositionOptions returning:', (fb || []).length, 'options');
                        return [2 /*return*/, (fb || []).map(function (i) { return ({
                                key: i.ID,
                                text: i.PositionID || i.Title || "#".concat(i.ID),
                            }); })];
                    case 4:
                        e_7 = _a.sent();
                        console.error('[fetchPositionOptions]', e_7);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * HOD submit — select / reject / on-hold
     * Mirrors old updateCandidateStatusFull:
     *   1. Update candidate StatusId
     *   2. Insert/update Level1 or Level2 comment
     *   3. Assign PositionID if Yes
     */
    ReviewScoreCardServices.prototype.submitHODDecision = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var candidateId, hodDecision, comments, currentRoleId, positionId, lv2, recruitmentID, nextStatusId, msg, e_8;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('[ReviewScoreCardServices] submitHODDecision called with params:', params);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        candidateId = params.candidateId, hodDecision = params.hodDecision, comments = params.comments, currentRoleId = params.currentRoleId, positionId = params.positionId, lv2 = params.isLevel2, recruitmentID = params.recruitmentID;
                        nextStatusId = void 0;
                        if (lv2) {
                            nextStatusId = hodDecision === 'Yes' ? 130
                                : hodDecision === 'No' ? 168
                                    : 166;
                        }
                        else {
                            nextStatusId = hodDecision === 'Yes' ? 122
                                : hodDecision === 'No' ? 167
                                    : 165;
                        }
                        // 1. Update candidate status
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                RequestJSON: { StatusId: nextStatusId },
                                ID: candidateId,
                            })];
                    case 2:
                        // 1. Update candidate status
                        _a.sent();
                        if (!lv2) return [3 /*break*/, 4];
                        return [4 /*yield*/, _insertOrUpdateLevel2Comment(candidateId, currentRoleId, comments)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, _insertOrUpdateLevel1Comment(candidateId, currentRoleId, comments)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(hodDecision === 'Yes' && positionId)) return [3 /*break*/, 8];
                        return [4 /*yield*/, _assignPositionID({ positionId: positionId, candidateId: candidateId, recruitmentID: recruitmentID })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        msg = hodDecision === 'Yes' ? 'Candidate SELECTED successfully.'
                            : hodDecision === 'No' ? 'Candidate REJECTED successfully.'
                                : 'Candidate put ON HOLD successfully.';
                        console.log('[ReviewScoreCardServices] submitHODDecision returning success:', true, 'message:', msg);
                        return [2 /*return*/, { success: true, message: "\u2713 ".concat(msg) }];
                    case 9:
                        e_8 = _a.sent();
                        console.error('[submitHODDecision]', e_8);
                        return [2 /*return*/, { success: false, message: 'Submission failed. Please try again.' }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return ReviewScoreCardServices;
}());
// ── Private helpers ───────────────────────────────────────────────────────────
function _getUserGuid(email) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, _a;
        var _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('[ReviewScoreCardServices] _getUserGuid called with email:', email);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    if (!email)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, _common.getUserGuidByEmail(email)];
                case 2:
                    res = _d.sent();
                    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.key))
                        return [2 /*return*/, String(res.data.key)];
                    console.log('[ReviewScoreCardServices] _getUserGuid returning:', ((_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.key) ? 'guid found' : 'null');
                    return [2 /*return*/, null];
                case 3:
                    _a = _d.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function _insertOrUpdateLevel1Comment(candidateId, roleId, comments) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var existing, match, e_9;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[ReviewScoreCardServices] _insertOrUpdateLevel1Comment called with candidateId:', candidateId, 'roleId:', roleId, 'comments length:', comments.length);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                            Select: '*',
                            Filter: [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
                        })];
                case 2:
                    existing = _a.sent();
                    match = existing.find(function (i) { return i.RoleId === roleId; });
                    if (!match) return [3 /*break*/, 4];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                            RequestJSON: { Comments: comments },
                            ID: match.ID,
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, spservice_1.default.SPAddItem({
                        Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                        RequestJSON: { CandidateIDId: candidateId, Comments: comments, RoleId: roleId },
                    })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    console.log('[ReviewScoreCardServices] _insertOrUpdateLevel1Comment completed for candidateId:', candidateId);
                    return [3 /*break*/, 8];
                case 7:
                    e_9 = _a.sent();
                    console.error('[_insertOrUpdateLevel1Comment]', e_9);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function _insertOrUpdateLevel2Comment(candidateId, roleId, comments) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var existing, match, e_10;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[ReviewScoreCardServices] _insertOrUpdateLevel2Comment called with candidateId:', candidateId, 'roleId:', roleId, 'comments length:', comments.length);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                            Select: '*',
                            Filter: [{ FilterKey: 'CandidateIDId', Operator: 'eq', FilterValue: candidateId }],
                        })];
                case 2:
                    existing = _a.sent();
                    match = existing.find(function (i) { return i.RoleId === roleId; });
                    if (!match) return [3 /*break*/, 4];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                            RequestJSON: { Comments: comments },
                            ID: match.ID,
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, spservice_1.default.SPAddItem({
                        Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                        RequestJSON: { CandidateIDId: candidateId, Comments: comments, RoleId: roleId },
                    })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    console.log('[ReviewScoreCardServices] _insertOrUpdateLevel2Comment completed for candidateId:', candidateId);
                    return [3 /*break*/, 8];
                case 7:
                    e_10 = _a.sent();
                    console.error('[_insertOrUpdateLevel2Comment]', e_10);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function _assignPositionID(p) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var posRes, pos, e_11;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[ReviewScoreCardServices] _assignPositionID called with positionId:', p.positionId, 'candidateId:', p.candidateId, 'recruitmentID:', p.recruitmentID);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSPositionIDMaster,
                            Select: '*',
                            Filter: [{ FilterKey: 'ID', Operator: 'eq', FilterValue: p.positionId }],
                        })];
                case 2:
                    posRes = _a.sent();
                    if (!(posRes === null || posRes === void 0 ? void 0 : posRes.length))
                        return [2 /*return*/];
                    pos = posRes[0];
                    return [4 /*yield*/, spservice_1.default.SPAddItem({
                            Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                            RequestJSON: {
                                PositionIDId: pos.ID,
                                CandidateIDId: p.candidateId,
                                RecruitmentIDId: p.recruitmentID,
                                ItemCreated: 'Yes',
                                ActionId: Config_1.WorkflowAction.Submitted,
                                StatusId: Config_1.StatusId.Pending,
                            },
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSPositionIDMaster,
                            RequestJSON: { PositionIDStatus: 'Recruitment In Progress' },
                            ID: pos.ID,
                        })];
                case 4:
                    _a.sent();
                    console.log('[ReviewScoreCardServices] _assignPositionID completed for positionId:', p.positionId);
                    return [3 /*break*/, 6];
                case 5:
                    e_11 = _a.sent();
                    console.error('[_assignPositionID]', e_11);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.default = new ReviewScoreCardServices();
//# sourceMappingURL=ReviewScoreCardServices.js.map