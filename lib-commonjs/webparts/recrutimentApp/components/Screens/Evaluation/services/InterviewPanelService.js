"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserGuidByEmail = getUserGuidByEmail;
exports.getInterviewPanelByUser = getInterviewPanelByUser;
exports.getCandidatesByIDs = getCandidatesByIDs;
exports.getRecruitmentByID = getRecruitmentByID;
exports.getGradeLevel = getGradeLevel;
exports.getAllInterviewPanelForCandidate = getAllInterviewPanelForCandidate;
exports.getEvaluationActionData = getEvaluationActionData;
var tslib_1 = require("tslib");
var spservice_1 = require("../../../../services/SPService/spservice");
var Config_1 = require("../EvaluationConfig/Config");
// ─── Internal SP helper ───────────────────────────────────────────────────────
function spRead(opts) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var sp, q;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sp = (0, spservice_1.getSP)();
                    q = sp.web.lists
                        .getByTitle(opts.listName)
                        .items.select(opts.select || "*");
                    if (opts.expand)
                        q = q.expand(opts.expand);
                    if (opts.filter)
                        q = q.filter(opts.filter);
                    if (opts.top)
                        q = q.top(opts.top);
                    return [4 /*yield*/, q()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
// 1. getUserGuidByEmail
function getUserGuidByEmail(email) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var sp, user, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("-> getUserGuidByEmail for email:", email);
                    sp = (0, spservice_1.getSP)();
                    return [4 /*yield*/, sp.web.siteUsers.getByEmail(email)()];
                case 1:
                    user = _a.sent();
                    console.log("<- getUserGuidByEmail success:", user.Id);
                    return [2 /*return*/, {
                            data: { key: user.Id, text: user.Title },
                            status: 200,
                            message: "User fetched successfully",
                        }];
                case 2:
                    error_1 = _a.sent();
                    console.error("getUserGuidByEmail error:", error_1);
                    return [2 /*return*/, { data: null, status: 500, message: "Error fetching user" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 2. getInterviewPanelByUser
function getInterviewPanelByUser(userID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, result, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("-> getInterviewPanelByUser for userID:", userID);
                    return [4 /*yield*/, spRead({
                            listName: Config_1.ListNames.HRMSInterviewPanelDetails,
                            select: "ID,CandidateID/Id,CandidateIDId,RecruitmentID/Id,InterviewLevel," +
                                "InterviewPanel/Id,InterviewPanel/EMail,InterviewPanelStringId,IsScoreSheetUploaded",
                            expand: "InterviewPanel,RecruitmentID,CandidateID",
                            filter: "InterviewPanel/Id eq ".concat(userID),
                            top: 5000,
                        })];
                case 1:
                    items = _a.sent();
                    console.log("<- getInterviewPanelByUser items count:", items.length);
                    result = items.map(function (item) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                        return ({
                            ID: item.ID,
                            CandidateID: (_c = (_b = (_a = item.CandidateID) === null || _a === void 0 ? void 0 : _a.Id) !== null && _b !== void 0 ? _b : item.CandidateIDId) !== null && _c !== void 0 ? _c : 0,
                            CandidateIDId: (_d = item.CandidateIDId) !== null && _d !== void 0 ? _d : 0,
                            RecruitmentID: (_f = (_e = item.RecruitmentID) === null || _e === void 0 ? void 0 : _e.Id) !== null && _f !== void 0 ? _f : 0,
                            InterviewLevel: (_g = item.InterviewLevel) !== null && _g !== void 0 ? _g : "",
                            InterviewPanelId: (_j = (_h = item.InterviewPanel) === null || _h === void 0 ? void 0 : _h.Id) !== null && _j !== void 0 ? _j : 0,
                            InterviewPanelEmail: (_l = (_k = item.InterviewPanel) === null || _k === void 0 ? void 0 : _k.EMail) !== null && _l !== void 0 ? _l : "",
                            InterviewPanelStringId: (_m = item.InterviewPanelStringId) !== null && _m !== void 0 ? _m : "",
                            IsScoreSheetUploaded: (_o = item.IsScoreSheetUploaded) !== null && _o !== void 0 ? _o : "",
                        });
                    });
                    return [2 /*return*/, { data: result, status: 200, message: "Panel records fetched" }];
                case 2:
                    error_2 = _a.sent();
                    console.error("getInterviewPanelByUser error:", error_2);
                    return [2 /*return*/, { data: [], status: 500, message: "Error fetching panel records" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 3. getCandidatesByIDs
function getCandidatesByIDs(candidateIDs) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var idFilter, items, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("-> getCandidatesByIDs for IDs:", candidateIDs);
                    if (!candidateIDs.length)
                        return [2 /*return*/, { data: [], status: 200, message: "No IDs" }];
                    idFilter = candidateIDs.map(function (id) { return "ID eq ".concat(id); }).join(" or ");
                    return [4 /*yield*/, spRead({
                            listName: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                            select: "ID,FristName,LastName,PositionTitle,StatusId,ItemCreated," +
                                "InterviewDate,InterviewTime,InterviewDateLevel2,InterviewTimeLevel2," +
                                "Status/ID,Status/StatusDescription,RecruitmentID/Id,JobCode/JobCode",
                            expand: "Status,RecruitmentID,JobCode",
                            filter: "(".concat(idFilter, ") and ") +
                                "(StatusId eq ".concat(Config_1.StatusId.InterviewScheduled, " or StatusId eq ").concat(Config_1.StatusId.InterviewScheduledforLevel2, ") and ") +
                                "ItemCreated eq 'No'",
                            top: 5000,
                        })];
                case 1:
                    items = _a.sent();
                    console.log("<- getCandidatesByIDs items count:", items.length);
                    return [2 /*return*/, { data: items, status: 200, message: "Candidates fetched" }];
                case 2:
                    error_3 = _a.sent();
                    console.error("getCandidatesByIDs error:", error_3);
                    return [2 /*return*/, { data: [], status: 500, message: "Error fetching candidates" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 4. getRecruitmentByID
function getRecruitmentByID(recruitmentID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, error_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("-> getRecruitmentByID for recruitmentID:", recruitmentID);
                    return [4 /*yield*/, spRead({
                            listName: Config_1.ListNames.HRMSVacancyReplacementRequest,
                            select: "ID,PatersonGrade,JobCodeId",
                            filter: "ID eq ".concat(recruitmentID),
                        })];
                case 1:
                    items = _a.sent();
                    console.log("<- getRecruitmentByID items count:", items.length);
                    return [2 /*return*/, {
                            data: items.map(function (item) {
                                var _a, _b;
                                return ({
                                    PatersonGrade: (_a = item.PatersonGrade) !== null && _a !== void 0 ? _a : "",
                                    JobCodeId: (_b = item.JobCodeId) !== null && _b !== void 0 ? _b : 0,
                                });
                            }),
                            status: 200,
                            message: "Recruitment fetched",
                        }];
                case 2:
                    error_4 = _a.sent();
                    console.error("getRecruitmentByID error:", error_4);
                    return [2 /*return*/, { data: [], status: 500, message: "Error fetching recruitment" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 5. getGradeLevel
function getGradeLevel(patersonGrade) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("-> getGradeLevel for grade:", patersonGrade);
                    if (!patersonGrade)
                        return [2 /*return*/, { data: [], status: 200, message: "No grade" }];
                    return [4 /*yield*/, spRead({
                            listName: Config_1.ListNames.HRMSGradeMaster,
                            select: "*",
                            filter: "PatersonGrade eq '".concat(patersonGrade, "'"),
                        })];
                case 1:
                    items = _a.sent();
                    console.log("<- getGradeLevel items count:", items.length);
                    return [2 /*return*/, {
                            data: items.map(function (item) {
                                var _a;
                                return ({
                                    Level: (_a = item.Levels) !== null && _a !== void 0 ? _a : "",
                                });
                            }),
                            status: 200,
                            message: "Grade level fetched",
                        }];
                case 2:
                    error_5 = _a.sent();
                    console.error("getGradeLevel error:", error_5);
                    return [2 /*return*/, { data: [], status: 500, message: "Error fetching grade" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 6. getAllInterviewPanelForCandidate
function getAllInterviewPanelForCandidate(candidateID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, result, error_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("-> getAllInterviewPanelForCandidate:", candidateID);
                    return [4 /*yield*/, spRead({
                            listName: Config_1.ListNames.HRMSInterviewPanelDetails,
                            select: "*",
                            filter: "CandidateIDId eq ".concat(candidateID),
                            top: 5000,
                        })];
                case 1:
                    items = _a.sent();
                    console.log("<- getAllInterviewPanelForCandidate items count:", items.length);
                    result = items.map(function (item) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        return ({
                            ID: item.ID,
                            CandidateID: (_a = item.CandidateIDId) !== null && _a !== void 0 ? _a : 0,
                            CandidateIDId: (_b = item.CandidateIDId) !== null && _b !== void 0 ? _b : 0,
                            RecruitmentID: (_c = item.RecruitmentIDId) !== null && _c !== void 0 ? _c : 0,
                            InterviewLevel: (_d = item.InterviewLevel) !== null && _d !== void 0 ? _d : "",
                            InterviewPanelId: (_e = item.InterviewPanelId) !== null && _e !== void 0 ? _e : 0,
                            InterviewPanelEmail: (_f = item.InterviewPanelEmail) !== null && _f !== void 0 ? _f : "",
                            InterviewPanelStringId: (_g = item.InterviewPanelStringId) !== null && _g !== void 0 ? _g : "",
                            IsScoreSheetUploaded: (_h = item.IsScoreSheetUploaded) !== null && _h !== void 0 ? _h : "",
                        });
                    });
                    return [2 /*return*/, { data: result, status: 200, message: "Panel records fetched" }];
                case 2:
                    error_6 = _a.sent();
                    console.error("getAllInterviewPanelForCandidate error:", error_6);
                    return [2 /*return*/, { data: [], status: 500, message: "Error" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 7. getEvaluationActionData
function getEvaluationActionData(candidateID, interviewLevel) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, error_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("-> getEvaluationActionData:", candidateID, interviewLevel);
                    return [4 /*yield*/, spRead({
                            listName: Config_1.ListNames.HRMSInterviewPanelDetails,
                            select: "*",
                            filter: "CandidateID/Id eq ".concat(candidateID, " and InterviewLevel eq '").concat(interviewLevel, "'"),
                        })];
                case 1:
                    items = _a.sent();
                    console.log("<- getEvaluationActionData result:", items.length);
                    return [2 /*return*/, { data: items, status: 200, message: "Evaluation action fetched" }];
                case 2:
                    error_7 = _a.sent();
                    console.error("getEvaluationActionData error:", error_7);
                    return [2 /*return*/, { data: [], status: 500, message: "Error" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=InterviewPanelService.js.map