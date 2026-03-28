"use strict";
// Services/EvaluationFormService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Clean, minimal service for the Evaluation Form.
// Takes only candidateId + currentUserEmail. No old evaluationService dependency.
// Reuses MasterService (GetUserDetails, GetJobUniqueDataValue, GetGradeLevel)
// so we avoid duplicate SharePoint calls that already exist in MasterService.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvaluationFormData = getEvaluationFormData;
exports.submitScorecard = submitScorecard;
var tslib_1 = require("tslib");
var MasterService_1 = tslib_1.__importDefault(require("../../../../../services/MasterService/MasterService"));
var spservice_1 = tslib_1.__importDefault(require("../../../../../services/SPService/spservice"));
var Config_1 = require("../../../../../utilities/Config");
var CommonServices_1 = tslib_1.__importDefault(require("../../../SelectionProcess/CommonServices/CommonServices"));
var QuestionnaireApi_1 = tslib_1.__importDefault(require("./QuestionnaireApi/QuestionnaireApi"));
// ── Singleton instances (module-level, not recreated per call) ────────────────
var _common = new CommonServices_1.default();
var _master = new MasterService_1.default();
var _questApi = new QuestionnaireApi_1.default();
// ── EMPTY fallback ────────────────────────────────────────────────────────────
var EMPTY = function (candidateId) { return ({
    success: false,
    candidateId: candidateId,
    applicantName: '', nationality: '', gender: '',
    qualification: '', miningExp: '', relevantExp: '', interviewDate: '',
    interviewLevel: '', disability: '', conflictsOfInterest: '', positionTitle: '',
    grade: '', recruitmentId: 0, jobCodeId: 0, panelMembers: [],
    currentUserPanelId: null, currentUserGuid: null,
    reviewerName: '', jobTitleEn: '', jobTitleFr: '', questions: [],
}); };
// ─────────────────────────────────────────────────────────────────────────────
// getEvaluationFormData
// Runs 3 parallel batches to minimize round-trips:
//   Batch 1 (parallel): candidate row  +  user GUID
//   Batch 2 (parallel): panel details  +  reviewer Sage data
//   Batch 3 (parallel): panel member names (parallel per email)  +  job unique key
// ─────────────────────────────────────────────────────────────────────────────
function getEvaluationFormData(candidateId, currentUserEmail) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, candidateRows, currentUserGuid_1, raw, recruitmentId, jobCodeId, jobCodeStr, fullName, interviewDateRaw, interviewDate, _b, panelRows, reviewerRes, currentUserPanel, uniqueEmails, emailToName_1, panelMembers, reviewer, reviewerName, jobTitleEn, jobTitleFr, grade, questions, _c, gradeRes, questionsResult, error_1;
        var _this = this;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        return tslib_1.__generator(this, function (_4) {
            switch (_4.label) {
                case 0:
                    _4.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, Promise.all([
                            spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: [
                                    'ID', 'FristName', 'MiddleName', 'LastName',
                                    'Nationality', 'Gender', 'Qualification',
                                    'TotalYearOfExperiance', 'ReleventExperience',
                                    'InterviewDate', 'InterviewDateLevel2', 'InterviewLevel',
                                    'Disability', 'ConflictsOfInterest', 'PositionTitle',
                                    'JobGrade', 'JobCodeId',
                                    'RecruitmentID/ID', 'JobCode/JobCode', 'JobCode/ID',
                                ].join(','),
                                Expand: 'RecruitmentID,JobCode',
                                Filter: [{ FilterKey: 'ID', Operator: 'eq', FilterValue: candidateId }],
                            }),
                            _getUserGuid(currentUserEmail),
                        ])];
                case 1:
                    _a = _4.sent(), candidateRows = _a[0], currentUserGuid_1 = _a[1];
                    raw = (_d = candidateRows === null || candidateRows === void 0 ? void 0 : candidateRows[0]) !== null && _d !== void 0 ? _d : {};
                    recruitmentId = (_g = (_f = (_e = raw.RecruitmentID) === null || _e === void 0 ? void 0 : _e.ID) !== null && _f !== void 0 ? _f : raw.RecruitmentIDId) !== null && _g !== void 0 ? _g : 0;
                    jobCodeId = (_k = (_h = raw.JobCodeId) !== null && _h !== void 0 ? _h : (_j = raw.JobCode) === null || _j === void 0 ? void 0 : _j.ID) !== null && _k !== void 0 ? _k : 0;
                    jobCodeStr = (_m = (_l = raw.JobCode) === null || _l === void 0 ? void 0 : _l.JobCode) !== null && _m !== void 0 ? _m : '';
                    fullName = [raw.FristName, raw.MiddleName, raw.LastName]
                        .filter(Boolean).join(' ').trim();
                    interviewDateRaw = raw.InterviewDateLevel2 || raw.InterviewDate || '';
                    interviewDate = interviewDateRaw ? interviewDateRaw.split('T')[0] : '';
                    return [4 /*yield*/, Promise.all([
                            spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: 'ID,InterviewPanel/Id,InterviewPanel/Title,InterviewPanel/EMail,InterviewLevel,IsScoreSheetUploaded',
                                Expand: 'InterviewPanel',
                                Filter: [{ FilterKey: 'CandidateID/Id', Operator: 'eq', FilterValue: candidateId }],
                            }),
                            // Reuse MasterService — avoids an extra direct SPReadItems call
                            _master.GetUserDetails([{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: currentUserEmail }], 'and'),
                        ])];
                case 2:
                    _b = _4.sent(), panelRows = _b[0], reviewerRes = _b[1];
                    currentUserPanel = panelRows.find(function (p) { var _a; return String((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === String(currentUserGuid_1); });
                    uniqueEmails = Array.from(new Set(panelRows.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; }).filter(Boolean)));
                    emailToName_1 = {};
                    return [4 /*yield*/, Promise.all(uniqueEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var res, name_1, _a;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, _master.GetUserDetails([{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: email }], 'and')];
                                    case 1:
                                        res = _b.sent();
                                        if (res === null || res === void 0 ? void 0 : res.data) {
                                            name_1 = [res.data.FirstName, res.data.MiddleName, res.data.LastName]
                                                .filter(Boolean).join(' ').trim();
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
                    _4.sent();
                    panelMembers = panelRows
                        .map(function (p) {
                        var _a, _b, _c;
                        var email = ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : '').toLowerCase();
                        return emailToName_1[email] || ((_c = p.InterviewPanel) === null || _c === void 0 ? void 0 : _c.Title) || '';
                    })
                        .filter(Boolean);
                    reviewer = reviewerRes === null || reviewerRes === void 0 ? void 0 : reviewerRes.data;
                    reviewerName = reviewer
                        ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName].filter(Boolean).join(' ').trim()
                        : '';
                    jobTitleEn = (_o = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleEnglish) !== null && _o !== void 0 ? _o : '';
                    jobTitleFr = (_p = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleFrench) !== null && _p !== void 0 ? _p : '';
                    grade = (_q = raw.JobGrade) !== null && _q !== void 0 ? _q : '';
                    questions = [];
                    return [4 /*yield*/, Promise.all([
                            // GetGradeLevel only if we don't already have it from the candidate row
                            grade ? Promise.resolve(null) : _master.GetGradeLevel(jobCodeStr).catch(function () { return null; }),
                            // GetJobUniqueDataValue → questionnaire
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
                                                        });
                                                    })];
                                        }
                                    });
                                }); })
                                    .catch(function () { return []; })
                                : Promise.resolve([]),
                        ])];
                case 4:
                    _c = _4.sent(), gradeRes = _c[0], questionsResult = _c[1];
                    if (!grade && (gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data)) {
                        grade = (_s = (_r = gradeRes.data) === null || _r === void 0 ? void 0 : _r.GradeLevel) !== null && _s !== void 0 ? _s : '';
                    }
                    questions = questionsResult;
                    return [2 /*return*/, {
                            success: true,
                            candidateId: candidateId,
                            applicantName: fullName,
                            nationality: (_t = raw.Nationality) !== null && _t !== void 0 ? _t : '',
                            gender: (_u = raw.Gender) !== null && _u !== void 0 ? _u : '',
                            qualification: (_v = raw.Qualification) !== null && _v !== void 0 ? _v : '',
                            miningExp: (_w = raw.TotalYearOfExperiance) !== null && _w !== void 0 ? _w : '',
                            relevantExp: (_x = raw.ReleventExperience) !== null && _x !== void 0 ? _x : '',
                            interviewDate: interviewDate,
                            interviewLevel: (_y = raw.InterviewLevel) !== null && _y !== void 0 ? _y : '',
                            disability: (_0 = (_z = raw.Disability) !== null && _z !== void 0 ? _z : raw.disability) !== null && _0 !== void 0 ? _0 : '',
                            conflictsOfInterest: (_1 = raw.ConflictsOfInterest) !== null && _1 !== void 0 ? _1 : '',
                            positionTitle: (_2 = raw.PositionTitle) !== null && _2 !== void 0 ? _2 : '',
                            grade: grade,
                            recruitmentId: recruitmentId,
                            jobCodeId: jobCodeId,
                            panelMembers: panelMembers,
                            currentUserPanelId: (_3 = currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) !== null && _3 !== void 0 ? _3 : null,
                            currentUserGuid: currentUserGuid_1,
                            reviewerName: reviewerName,
                            jobTitleEn: jobTitleEn,
                            jobTitleFr: jobTitleFr,
                            questions: questions,
                        }];
                case 5:
                    error_1 = _4.sent();
                    console.error('[getEvaluationFormData] error:', error_1);
                    return [2 /*return*/, EMPTY(candidateId)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// submitScorecard
// Writes to HRMSCandidateScoreCard then marks IsScoreSheetUploaded = "Yes"
// ─────────────────────────────────────────────────────────────────────────────
function submitScorecard(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var spPayload, response, newId, error_2;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return tslib_1.__generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    _p.trys.push([0, 4, , 5]);
                    spPayload = {
                        RelevantQualification: String((_a = params.qualifications) !== null && _a !== void 0 ? _a : ''),
                        ReleventExperience: String((_b = params.experience) !== null && _b !== void 0 ? _b : ''),
                        Knowledge: String((_c = params.knowledge) !== null && _c !== void 0 ? _c : ''),
                        EnergyLevel: String((_d = params.energyLevel) !== null && _d !== void 0 ? _d : ''),
                        MeetJobRequirement: String((_e = params.jobRequirements) !== null && _e !== void 0 ? _e : ''),
                        ContributeTowardsCultureRequried: String((_f = params.cultureFit) !== null && _f !== void 0 ? _f : ''),
                        Experience: String((_g = params.expatLocal) !== null && _g !== void 0 ? _g : ''),
                        OtherCriteriaScore: String((_h = params.otherCriteria) !== null && _h !== void 0 ? _h : ''),
                        ConsiderForEmployment: params.recommendation === 'consider' ? 'Yes' : 'No',
                        OverAllEvaluationFeedback: params.overallFeedback,
                        RecruitmentIDId: params.recruitmentId,
                        InterviewPanelIDId: params.panelId,
                        QuestionJson: JSON.stringify(params.questionScores),
                        RoleId: params.roleId ? Number(params.roleId) : null,
                        InterviewPersonNameId: params.interviewPersonNameId ? Number(params.interviewPersonNameId) : null,
                    };
                    return [4 /*yield*/, spservice_1.default.SPAddItem({
                            Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                            RequestJSON: spPayload,
                        })];
                case 1:
                    response = _p.sent();
                    newId = (_m = (_k = (_j = response === null || response === void 0 ? void 0 : response.ID) !== null && _j !== void 0 ? _j : response === null || response === void 0 ? void 0 : response.Id) !== null && _k !== void 0 ? _k : (_l = response === null || response === void 0 ? void 0 : response.data) === null || _l === void 0 ? void 0 : _l.ID) !== null && _m !== void 0 ? _m : (_o = response === null || response === void 0 ? void 0 : response.data) === null || _o === void 0 ? void 0 : _o.Id;
                    if (!newId) return [3 /*break*/, 3];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            RequestJSON: { IsScoreSheetUploaded: 'Yes' },
                            ID: params.panelId,
                        })];
                case 2:
                    _p.sent();
                    return [2 /*return*/, { success: true, message: 'Scorecard submitted successfully!' }];
                case 3: return [2 /*return*/, { success: false, message: 'Failed to submit scorecard.' }];
                case 4:
                    error_2 = _p.sent();
                    console.error('[submitScorecard] error:', error_2);
                    return [2 /*return*/, { success: false, message: 'An error occurred while submitting.' }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ── Private helper ────────────────────────────────────────────────────────────
function _getUserGuid(email) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, _a;
        var _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (!email)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, _common.getUserGuidByEmail(email)];
                case 1:
                    res = _c.sent();
                    if ((res === null || res === void 0 ? void 0 : res.status) === 200 && ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.key))
                        return [2 /*return*/, String(res.data.key)];
                    return [2 /*return*/, null];
                case 2:
                    _a = _c.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=Evaluationformservice.js.map