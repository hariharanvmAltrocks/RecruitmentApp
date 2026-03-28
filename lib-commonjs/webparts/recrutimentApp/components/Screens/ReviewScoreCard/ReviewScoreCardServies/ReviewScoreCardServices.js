"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewScoreCardServices = void 0;
var tslib_1 = require("tslib");
var MasterService_1 = tslib_1.__importDefault(require("../../../../services/MasterService/MasterService"));
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var Config_1 = require("../../../../utilities/Config");
var QuestionnaireApi_1 = tslib_1.__importDefault(require("../../Evalution/Evaluationservice/QuestionnaireApi/QuestionnaireApi"));
var CommonServices_1 = tslib_1.__importDefault(require("../../SelectionProcess/CommonServices/CommonServices"));
var _common = new CommonServices_1.default();
var _master = new MasterService_1.default();
var _questApi = new QuestionnaireApi_1.default;
var EMPTY = function (candidateId) { return ({
    success: false,
    candidateId: candidateId,
    applicantName: '',
    nationality: '',
    gender: '',
    qualification: '',
    miningExp: '',
    relevantExp: '',
    interviewDate: '',
    interviewLevel: '',
    disability: '',
    conflictsOfInterest: '',
    positionTitle: '',
    grade: '',
    recruitmentId: 0,
    jobCodeId: 0,
    panelMembers: [],
    currentUserPanelId: null,
    currentUserGuid: null,
    reviewerName: '',
    jobTitleEn: '',
    jobTitleFr: '',
    questions: [],
}); };
var ReviewScoreCardServices = /** @class */ (function () {
    function ReviewScoreCardServices() {
    }
    ReviewScoreCardServices.prototype.getReviewScoreCardData = function (candidateId, currentUserEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, candidateRows, currentUserGuid_1, raw, recruitmentId, jobCodeId, jobCodeStr, fullName, interviewDateRaw, interviewDate, _b, panelRows, reviewerRes, currentUserPanel, uniqueEmails, emailToDetails_1, panelMembers, reviewer, reviewerName, jobTitleEn, jobTitleFr, grade, interviewLevel, questions, _c, gradeRes, questionsResult, scorecardData, level2ScorecardData, hodDecisionData, error_1;
            var _this = this;
            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
            return tslib_1.__generator(this, function (_7) {
                switch (_7.label) {
                    case 0:
                        _7.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                    Select: [
                                        'ID', 'FristName', 'MiddleName', 'LastName',
                                        'Nationality', 'Gender', 'Qualification',
                                        'TotalYearOfExperiance', 'ReleventExperience',
                                        'InterviewDate', 'InterviewDateLevel2',
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
                        _a = _7.sent(), candidateRows = _a[0], currentUserGuid_1 = _a[1];
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
                                _master.GetUserDetails([{ FilterKey: 'EmailId', Operator: 'eq', FilterValue: currentUserEmail }], 'and'),
                            ])];
                    case 2:
                        _b = _7.sent(), panelRows = _b[0], reviewerRes = _b[1];
                        currentUserPanel = panelRows.find(function (p) { var _a; return String((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === String(currentUserGuid_1); });
                        uniqueEmails = Array.from(new Set(panelRows.map(function (p) { var _a; return (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail; }).filter(Boolean)));
                        emailToDetails_1 = {};
                        return [4 /*yield*/, Promise.all(uniqueEmails.map(function (email) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var res, name_1, jobTitle, department, _a;
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
                                                jobTitle = (_b = res.data.JopTitleEnglish) !== null && _b !== void 0 ? _b : '';
                                                department = (_c = res.data.DepartmentName) !== null && _c !== void 0 ? _c : '';
                                                if (name_1)
                                                    emailToDetails_1[email.toLowerCase()] = { name: name_1, jobTitle: jobTitle, department: department };
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
                        _7.sent();
                        panelMembers = panelRows
                            .map(function (p) {
                            var _a, _b, _c, _d;
                            var email = ((_b = (_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) !== null && _b !== void 0 ? _b : '').toLowerCase();
                            var details = emailToDetails_1[email];
                            return details ? {
                                name: details.name,
                                jobTitle: details.jobTitle,
                                department: details.department,
                                email: (_d = (_c = p.InterviewPanel) === null || _c === void 0 ? void 0 : _c.EMail) !== null && _d !== void 0 ? _d : ''
                            } : null;
                        })
                            .filter(function (member) { return member !== null; });
                        reviewer = reviewerRes === null || reviewerRes === void 0 ? void 0 : reviewerRes.data;
                        reviewerName = reviewer
                            ? [reviewer.FirstName, reviewer.MiddleName, reviewer.LastName].filter(Boolean).join(' ').trim()
                            : '';
                        jobTitleEn = (_o = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleEnglish) !== null && _o !== void 0 ? _o : '';
                        jobTitleFr = (_p = reviewer === null || reviewer === void 0 ? void 0 : reviewer.JopTitleFrench) !== null && _p !== void 0 ? _p : '';
                        grade = (_q = raw.JobGrade) !== null && _q !== void 0 ? _q : '';
                        interviewLevel = (_r = raw.InterviewLevel) !== null && _r !== void 0 ? _r : '';
                        questions = [];
                        return [4 /*yield*/, Promise.all([
                                grade ? Promise.resolve(null) : _master.GetGradeLevel(raw.JobGrade || jobCodeStr).catch(function () { return null; }),
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
                                this.getCandidateScorecard(candidateId),
                                this.getLevel2Scorecard(candidateId),
                                this.getHODDecision(candidateId),
                            ])];
                    case 4:
                        _c = _7.sent(), gradeRes = _c[0], questionsResult = _c[1], scorecardData = _c[2], level2ScorecardData = _c[3], hodDecisionData = _c[4];
                        if (!grade && (gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data)) {
                            grade = (_t = (_s = gradeRes.data) === null || _s === void 0 ? void 0 : _s.GradeLevel) !== null && _t !== void 0 ? _t : '';
                        }
                        if (!interviewLevel) {
                            interviewLevel = raw.InterviewLevel ||
                                ((_u = String(raw.JobGrade || '').match(/Level\s*\d+/i)) === null || _u === void 0 ? void 0 : _u[0]) ||
                                ((_w = String(((_v = gradeRes === null || gradeRes === void 0 ? void 0 : gradeRes.data) === null || _v === void 0 ? void 0 : _v.GradeLevel) || '').match(/Level\s*\d+/i)) === null || _w === void 0 ? void 0 : _w[0]) ||
                                '';
                        }
                        questions = questionsResult;
                        return [2 /*return*/, {
                                success: true,
                                candidateId: candidateId,
                                applicantName: fullName,
                                nationality: (_x = raw.Nationality) !== null && _x !== void 0 ? _x : '',
                                gender: (_y = raw.Gender) !== null && _y !== void 0 ? _y : '',
                                qualification: (_z = raw.Qualification) !== null && _z !== void 0 ? _z : '',
                                miningExp: (_0 = raw.TotalYearOfExperiance) !== null && _0 !== void 0 ? _0 : '',
                                relevantExp: (_1 = raw.ReleventExperience) !== null && _1 !== void 0 ? _1 : '',
                                interviewDate: interviewDate,
                                interviewLevel: interviewLevel,
                                disability: (_3 = (_2 = raw.Disability) !== null && _2 !== void 0 ? _2 : raw.disability) !== null && _3 !== void 0 ? _3 : '',
                                conflictsOfInterest: (_4 = raw.ConflictsOfInterest) !== null && _4 !== void 0 ? _4 : '',
                                positionTitle: (_5 = raw.PositionTitle) !== null && _5 !== void 0 ? _5 : '',
                                grade: grade,
                                recruitmentId: recruitmentId,
                                jobCodeId: jobCodeId,
                                panelMembers: panelMembers,
                                currentUserPanelId: (_6 = currentUserPanel === null || currentUserPanel === void 0 ? void 0 : currentUserPanel.ID) !== null && _6 !== void 0 ? _6 : null,
                                currentUserGuid: currentUserGuid_1,
                                reviewerName: reviewerName,
                                jobTitleEn: jobTitleEn,
                                jobTitleFr: jobTitleFr,
                                questions: questions,
                                scorecard: scorecardData,
                                level2Scorecard: level2ScorecardData,
                                hodDecision: hodDecisionData,
                            }];
                    case 5:
                        error_1 = _7.sent();
                        console.error('[getReviewScoreCardData] error:', error_1);
                        return [2 /*return*/, EMPTY(candidateId)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ReviewScoreCardServices.prototype.getCandidateScorecard = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_2;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                Select: '*',
                                Filter: [{ FilterKey: 'CandidateID', Operator: 'eq', FilterValue: candidateId }],
                            })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, (_a = response === null || response === void 0 ? void 0 : response[0]) !== null && _a !== void 0 ? _a : null];
                    case 2:
                        error_2 = _b.sent();
                        console.error('[getCandidateScorecard] error:', error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReviewScoreCardServices.prototype.getLevel2Scorecard = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_3;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                                Select: '*',
                                Filter: [{ FilterKey: 'CandidateID', Operator: 'eq', FilterValue: candidateId }],
                            })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, (_a = response === null || response === void 0 ? void 0 : response[0]) !== null && _a !== void 0 ? _a : null];
                    case 2:
                        error_3 = _b.sent();
                        console.error('[getLevel2Scorecard] error:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReviewScoreCardServices.prototype.getHODDecision = function (candidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_4;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                                Select: '*',
                                Filter: [{ FilterKey: 'CandidateID', Operator: 'eq', FilterValue: candidateId }],
                            })];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, (_a = response === null || response === void 0 ? void 0 : response[0]) !== null && _a !== void 0 ? _a : null];
                    case 2:
                        error_4 = _b.sent();
                        console.error('[getHODDecision] error:', error_4);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReviewScoreCardServices.prototype.submitScorecard = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var spPayload, response, newId, error_5;
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
                        error_5 = _p.sent();
                        console.error('[submitScorecard] error:', error_5);
                        return [2 /*return*/, { success: false, message: 'An error occurred while submitting.' }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ReviewScoreCardServices;
}());
exports.ReviewScoreCardServices = ReviewScoreCardServices;
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
exports.default = new ReviewScoreCardServices();
//# sourceMappingURL=ReviewScoreCardServices.js.map