"use strict";
// ─── ScorecardApiService.ts ───────────────────────────────────────────────────
// All SP / Axios API calls needed ONLY for Review Scorecard.
// Each function is lifted directly from the old service files:
//   InterviewProcessService.ts   → SP reads / writes
//   RecruitmentProcessService.ts → SP reads
//   GetPortalJobs.ts             → Axios (portal API)
//   CommonService.ts             → SP reads
// No dependency on InterviewServices / getVRRDetails / GetPortalJobsService
// wrapper singletons. Calls SPServices / AxiosInstance directly.
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchReviewScorecardJobs = fetchReviewScorecardJobs;
exports.getInterviewPanelDetailsForScorecard = getInterviewPanelDetailsForScorecard;
exports.getPanelLevelTitles = getPanelLevelTitles;
exports.getCombinedCandidatePositionDetails = getCombinedCandidatePositionDetails;
exports.fetchCandidateList = fetchCandidateList;
exports.fetchCandidateDetail = fetchCandidateDetail;
exports.fetchGradeLevel = fetchGradeLevel;
exports.fetchScoreData = fetchScoreData;
exports.buildOverallScoreRows = buildOverallScoreRows;
exports.fetchComments = fetchComments;
exports.fetchQuestionnaire = fetchQuestionnaire;
exports.fetchPositionOptions = fetchPositionOptions;
exports.fetchSelectedCandidateDetails = fetchSelectedCandidateDetails;
exports.assignPosition = assignPosition;
exports.upsertLevel1Comment = upsertLevel1Comment;
exports.upsertLevel2Comment = upsertLevel2Comment;
exports.submitLevel2ScoreSheet = submitLevel2ScoreSheet;
exports.candidateSelectionApi = candidateSelectionApi;
exports.updateCandidateWorkflowStatus = updateCandidateWorkflowStatus;
exports.getCandidateInterviewedCount = getCandidateInterviewedCount;
exports.updatePositionStatus = updatePositionStatus;
exports.fetchScorecardCandidates = fetchScorecardCandidates;
var tslib_1 = require("tslib");
var Config_1 = require("../../../../utilities/Config");
var spservice_1 = tslib_1.__importStar(require("../../../../services/SPService/spservice"));
var ScorecardConfig_1 = require("../config/ScorecardConfig");
var QuestionnaireApi_1 = tslib_1.__importDefault(require("../../SelectionProcess/services/QuestionnaireApi/QuestionnaireApi"));
var CareerPortalAPI_1 = require("../../../../services/AxiosService/CareerPortalAPI");
var questionnaireService = new QuestionnaireApi_1.default();
var TOP = 5000;
// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE: getCandidateScoreCard
// Source: InterviewProcessService.getCandidateScoreCard
// List:   HRMSCandidateScoreCard
// ─────────────────────────────────────────────────────────────────────────────
function _getCandidateScoreCard(candidateID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                            Select: "InterviewPanelID/ID,RelevantQualification,ReleventExperience,Knowledge,EnergyLevel,MeetJobRequirement,ContributeTowardsCultureRequried,Experience,OtherCriteriaScore,ConsiderForEmployment,Feedback,RecruitmentID/ID,Role/RoleTitle,InterviewPersonName/Title,OverAllEvaluationFeedback,Created,QuestionJson,Author/Title,Author/EMail",
                            Expand: "InterviewPanelID,RecruitmentID,Role,InterviewPersonName,Author",
                            Orderby: "ID",
                            Orderbydecorasc: false,
                            Filter: [
                                {
                                    FilterKey: "InterviewPanelID/CandidateID/ID",
                                    Operator: "eq",
                                    FilterValue: candidateID,
                                },
                            ],
                        })];
                case 1:
                    items = _a.sent();
                    return [2 /*return*/, items.map(function (score) {
                            var _a, _b, _c, _d, _e, _f;
                            return ({
                                InterviewPanelID: ((_a = score.InterviewPanelID) === null || _a === void 0 ? void 0 : _a.ID) || 0,
                                RelevantQualification: score.RelevantQualification || "",
                                ReleventExperience: score.ReleventExperience || "",
                                Knowledge: score.Knowledge || "",
                                EnergyLevel: score.EnergyLevel || "",
                                MeetJobRequirement: score.MeetJobRequirement || "",
                                ContributeTowardsCultureRequried: score.ContributeTowardsCultureRequried || "",
                                Experience: score.Experience || "",
                                OtherCriteriaScore: score.OtherCriteriaScore || "",
                                ConsiderForEmployment: score.ConsiderForEmployment || "",
                                Feedback: score.Feedback || "",
                                RecruitmentID: ((_b = score.RecruitmentID) === null || _b === void 0 ? void 0 : _b.ID) || 0,
                                Role: ((_c = score.Role) === null || _c === void 0 ? void 0 : _c.RoleTitle) || "",
                                InterviewPersonName: ((_d = score.InterviewPersonName) === null || _d === void 0 ? void 0 : _d.Title) || "",
                                OverAllEvaluationFeedback: score.OverAllEvaluationFeedback || "",
                                CreatedDate: score.Created
                                    ? new Date(score.Created).toLocaleString()
                                    : "",
                                QuestionJson: score.QuestionJson ? JSON.parse(score.QuestionJson) : [],
                                Author: {
                                    EMail: ((_e = score.Author) === null || _e === void 0 ? void 0 : _e.EMail) || "",
                                    Title: ((_f = score.Author) === null || _f === void 0 ? void 0 : _f.Title) || "",
                                },
                            });
                        })];
                case 2:
                    err_1 = _a.sent();
                    console.error("_getCandidateScoreCard error:", err_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─── NEW: fetchReviewScorecardJobs ─────────────────────────────
function fetchReviewScorecardJobs(currentUserEmail) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var filterArray, items, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    filterArray = [];
                    if (currentUserEmail) {
                        filterArray.push({
                            FilterKey: "HOD",
                            Operator: "eq",
                            FilterValue: currentUserEmail,
                        });
                    }
                    // Add any shared filter if needed, e.g. ItemCreated=No
                    filterArray.push({
                        FilterKey: "ItemCreated",
                        Operator: "eq",
                        FilterValue: "No",
                    });
                    filterArray.push({
                        FilterKey: "StatusId",
                        Operator: "eq",
                        FilterValue: Config_1.StatusId.RecruitmentInProgress,
                    });
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                            Select: "*,JobCode/JobCode,JobCode/ID,Status/StatusDescription,BusinessUnitCode/BusineesUnitCode",
                            Expand: "JobCode,Status,BusinessUnitCode",
                            Topcount: 5000,
                            Orderby: "Created",
                            Orderbydecorasc: false,
                            FilterCondition: filterArray.length > 0 ? "and" : undefined,
                            Filter: filterArray,
                        })];
                case 1:
                    items = _a.sent();
                    return [2 /*return*/, items.map(function (item) {
                            var _a, _b, _c;
                            return ({
                                id: String(item.ID),
                                recruitmentID: item.ID,
                                jobCode: ((_a = item === null || item === void 0 ? void 0 : item.JobCode) === null || _a === void 0 ? void 0 : _a.JobCode) || "",
                                title: (item === null || item === void 0 ? void 0 : item.JobTitle) || "",
                                buCode: ((_b = item === null || item === void 0 ? void 0 : item.BusinessUnitCode) === null || _b === void 0 ? void 0 : _b.BusineesUnitCode) || "",
                                posRequest: (item === null || item === void 0 ? void 0 : item.NoOfPosition) || "",
                                nationality: (item === null || item === void 0 ? void 0 : item.Nationality) || "",
                                status: ((_c = item === null || item === void 0 ? void 0 : item.Status) === null || _c === void 0 ? void 0 : _c.StatusDescription) || "",
                            });
                        })];
                case 2:
                    err_2 = _a.sent();
                    console.error("fetchReviewScorecardJobs error:", err_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 1. getInterviewPanelDetailsForScorecard
//    Source: InterviewProcessService.getInterviewPanelDetails
//    Lists:  HRMSInterviewPanelDetails + HRMSCandidateScoreCard
// ─────────────────────────────────────────────────────────────────────────────
function getInterviewPanelDetailsForScorecard(candidateID, employeeList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var interviewPanelItems_1, rawScores, scoreCardMap_1, sumOverallScores_1, sumQuestionScores_1, maxQuestionScore_1, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            Select: "*,ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Title,InterviewPanel/ID,CandidateID/ID,InterviewPanel/EMail",
                            Expand: "RecruitmentID,InterviewPanel,CandidateID",
                            Orderby: "ID",
                            Orderbydecorasc: false,
                            Filter: [
                                {
                                    FilterKey: "CandidateID/Id",
                                    Operator: "eq",
                                    FilterValue: candidateID,
                                },
                            ],
                        })];
                case 1:
                    interviewPanelItems_1 = _a.sent();
                    return [4 /*yield*/, _getCandidateScoreCard(candidateID)];
                case 2:
                    rawScores = _a.sent();
                    scoreCardMap_1 = new Map();
                    rawScores.forEach(function (score) { return scoreCardMap_1.set(score.InterviewPanelID, score); });
                    sumOverallScores_1 = 0;
                    sumQuestionScores_1 = 0;
                    maxQuestionScore_1 = 0;
                    return [2 /*return*/, interviewPanelItems_1.map(function (interview) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            var scoreCard = scoreCardMap_1.get(interview.ID) || null;
                            var totalScore = (Number(scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.RelevantQualification) || 0) +
                                (Number(scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.ReleventExperience) || 0) +
                                (Number(scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Knowledge) || 0) +
                                (Number(scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.EnergyLevel) || 0) +
                                (Number(scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.MeetJobRequirement) || 0) +
                                (Number(scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.ContributeTowardsCultureRequried) || 0) +
                                (Number(scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Experience) || 0) +
                                (Number(scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.OtherCriteriaScore) || 0);
                            var questionData = (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.QuestionJson) || [];
                            var questionScore = questionData.reduce(function (sum, q) {
                                return sum + (Number(Object.values(q)[0]) || 0);
                            }, 0);
                            var maxQuestionScoreForPanel = questionData.length * 3;
                            var level1Count = interviewPanelItems_1.filter(function (p) { var _a; return p.InterviewLevel === "Level 1" && ((_a = p.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) === candidateID; }).length;
                            var maxOverallScore = level1Count * 40;
                            sumOverallScores_1 += totalScore;
                            sumQuestionScores_1 += questionScore;
                            maxQuestionScore_1 += maxQuestionScoreForPanel;
                            var maxPossibleScore = maxQuestionScore_1 + maxOverallScore;
                            var combinedScore = sumOverallScores_1 + sumQuestionScores_1;
                            var rawGpa = maxPossibleScore > 0 ? (combinedScore / maxPossibleScore) * 5 : 0;
                            var gpa = Math.floor(rawGpa * 100) / 100;
                            var email = ((_b = (_a = scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Author) === null || _a === void 0 ? void 0 : _a.EMail) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
                            var employee = employeeList.find(function (emp) { var _a; return ((_a = emp.Email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === email; });
                            var fullName = employee
                                ? "".concat((_c = employee.FirstName) !== null && _c !== void 0 ? _c : "", " ").concat((_d = employee.MiddleName) !== null && _d !== void 0 ? _d : "", " ").concat((_e = employee.LastName) !== null && _e !== void 0 ? _e : "").trim()
                                : ((_f = scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Author) === null || _f === void 0 ? void 0 : _f.Title) || "";
                            return {
                                ID: interview.ID,
                                RecruitmentID: ((_g = interview === null || interview === void 0 ? void 0 : interview.RecruitmentID) === null || _g === void 0 ? void 0 : _g.ID) || 0,
                                InterviewLevel: interview.InterviewLevel || "",
                                InterviewPanelTitle: [((_h = interview.InterviewPanel) === null || _h === void 0 ? void 0 : _h.Title) || ""],
                                CandidateID: ((_j = interview.CandidateID) === null || _j === void 0 ? void 0 : _j.ID) || 0,
                                ScoreCard: scoreCard,
                                GPA: gpa,
                                TotalScore: totalScore,
                                QuestionScore: questionScore,
                                MaxOverallScore: maxOverallScore,
                                MaxQuestionScore: maxQuestionScoreForPanel,
                                SumOverallScores: totalScore,
                                SumQuestionScores: questionScore,
                                RelevantQualification: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.RelevantQualification) || "",
                                ReleventExperience: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.ReleventExperience) || "",
                                Knowledge: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Knowledge) || "",
                                EnergyLevel: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.EnergyLevel) || "",
                                MeetJobRequirement: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.MeetJobRequirement) || "",
                                ContributeTowardsCultureRequried: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.ContributeTowardsCultureRequried) || "",
                                Experience: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Experience) || "",
                                OtherCriteriaScore: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.OtherCriteriaScore) || "",
                                Id: interview.ID,
                                comments: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Feedback) || "",
                                OverAllEvaluationFeedback: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.OverAllEvaluationFeedback) || "",
                                Date: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.CreatedDate) ? new Date(scoreCard.CreatedDate) : null,
                                Name: fullName,
                                JobTitleInEnglish: (employee === null || employee === void 0 ? void 0 : employee.JobTitle) || "",
                                JobTitleInFrench: (employee === null || employee === void 0 ? void 0 : employee.JobTitleInFrench) || "",
                                Department: (employee === null || employee === void 0 ? void 0 : employee.Department) || "",
                                RoleName: (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Role) || "",
                                JobTitle: (employee === null || employee === void 0 ? void 0 : employee.JobTitle) || (scoreCard === null || scoreCard === void 0 ? void 0 : scoreCard.Role) || "",
                                IsScoreSheetUploaded: interview.IsScoreSheetUploaded || "",
                                InterviewPanel: ((_k = interview.InterviewPanel) === null || _k === void 0 ? void 0 : _k.Id) || 0,
                            };
                        })];
                case 3:
                    err_3 = _a.sent();
                    console.error("getInterviewPanelDetailsForScorecard error:", err_3);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 2. getPanelLevelTitles
//    Source: InterviewProcessService.GetPanelLeveldata
//    List:   HRMSInterviewPanelDetails
// ─────────────────────────────────────────────────────────────────────────────
function getPanelLevelTitles(candidateID, employeeList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var listItems, groupedByLevel_1, err_4;
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            Select: "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail, IsScoreSheetUploaded",
                            Expand: "InterviewPanel,RecruitmentID,CandidateID",
                            Filter: [
                                {
                                    FilterKey: "CandidateID/Id",
                                    Operator: "eq",
                                    FilterValue: candidateID,
                                },
                            ],
                        })];
                case 1:
                    listItems = _c.sent();
                    groupedByLevel_1 = {};
                    listItems.forEach(function (item) {
                        var _a, _b, _c, _d, _e, _f;
                        var level = item.InterviewLevel || "Unknown";
                        var email = ((_b = (_a = item.InterviewPanel) === null || _a === void 0 ? void 0 : _a.EMail) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
                        var matched = employeeList.find(function (emp) { var _a; return ((_a = emp.Email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === email; });
                        var fullName = matched
                            ? "".concat((_c = matched.FirstName) !== null && _c !== void 0 ? _c : "", " ").concat((_d = matched.MiddleName) !== null && _d !== void 0 ? _d : "", " ").concat((_e = matched.LastName) !== null && _e !== void 0 ? _e : "").trim()
                            : ((_f = item.InterviewPanel) === null || _f === void 0 ? void 0 : _f.Title) || "Unknown";
                        if (!groupedByLevel_1[level])
                            groupedByLevel_1[level] = new Set();
                        groupedByLevel_1[level].add(fullName);
                    });
                    return [2 /*return*/, {
                            level1: Array.from((_a = groupedByLevel_1["Level 1"]) !== null && _a !== void 0 ? _a : []),
                            level2: Array.from((_b = groupedByLevel_1["Level 2"]) !== null && _b !== void 0 ? _b : []),
                        }];
                case 2:
                    err_4 = _c.sent();
                    console.error("getPanelLevelTitles error:", err_4);
                    return [2 /*return*/, { level1: [], level2: [] }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 3. getCombinedCandidatePositionDetails
//    Source: InterviewProcessService.GetCombinedCandidatePositionDetails
//    Lists:  HRMSRecruitmentCandidatePersonalDetails + CV doc lib
// ─────────────────────────────────────────────────────────────────────────────
function getCombinedCandidatePositionDetails(filterParam, filterConditions, employeeList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var candidateItems, formattedItems, err_5;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                            Select: "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
                            Expand: "JobCode,AssignByInterviewPanel,RecruitmentID,Status",
                            Filter: filterParam,
                            FilterCondition: filterConditions,
                            Topcount: TOP,
                        })];
                case 1:
                    candidateItems = _a.sent();
                    return [4 /*yield*/, Promise.all(candidateItems.map(function (item, index) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var candidateCV, resumeLink, extractedPath, folderPath, fileName_1, files, e_1, panelResult, lastGPA, fullName;
                            var _a, _b, _c, _d, _e, _f, _g;
                            return tslib_1.__generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        candidateCV = [];
                                        resumeLink = (item === null || item === void 0 ? void 0 : item.CandidateResumeLink) || "";
                                        if (!resumeLink) return [3 /*break*/, 5];
                                        _h.label = 1;
                                    case 1:
                                        _h.trys.push([1, 4, , 5]);
                                        extractedPath = ((_a = resumeLink.split("/root:/")[1]) === null || _a === void 0 ? void 0 : _a.split(":/content")[0]) || "";
                                        if (!extractedPath) return [3 /*break*/, 3];
                                        folderPath = extractedPath.substring(0, extractedPath.lastIndexOf("/"));
                                        fileName_1 = extractedPath.split("/").pop();
                                        if (!(folderPath && fileName_1)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                                FilePath: "".concat(Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV, "/").concat(folderPath),
                                            })];
                                    case 2:
                                        files = (_h.sent());
                                        candidateCV = files.filter(function (f) { return f.name === fileName_1; });
                                        _h.label = 3;
                                    case 3: return [3 /*break*/, 5];
                                    case 4:
                                        e_1 = _h.sent();
                                        console.error("CV extract error:", e_1);
                                        return [3 /*break*/, 5];
                                    case 5: return [4 /*yield*/, getInterviewPanelDetailsForScorecard(item.ID, employeeList)];
                                    case 6:
                                        panelResult = _h.sent();
                                        lastGPA = panelResult.length
                                            ? panelResult[panelResult.length - 1].GPA
                                            : null;
                                        fullName = "".concat((_b = item === null || item === void 0 ? void 0 : item.FristName) !== null && _b !== void 0 ? _b : "", " ").concat((_c = item === null || item === void 0 ? void 0 : item.MiddleName) !== null && _c !== void 0 ? _c : "", " ").concat((_d = item === null || item === void 0 ? void 0 : item.LastName) !== null && _d !== void 0 ? _d : "").trim();
                                        return [2 /*return*/, {
                                                SNO: index + 1,
                                                ID: item.ID,
                                                RecruitmentID: (_e = item === null || item === void 0 ? void 0 : item.RecruitmentID) === null || _e === void 0 ? void 0 : _e.ID,
                                                JobCode: (_f = item === null || item === void 0 ? void 0 : item.JobCode) === null || _f === void 0 ? void 0 : _f.JobCode,
                                                JobCodeId: item === null || item === void 0 ? void 0 : item.JobCodeId,
                                                PassportID: item === null || item === void 0 ? void 0 : item.PassportID,
                                                FristName: item === null || item === void 0 ? void 0 : item.FristName,
                                                MiddleName: item === null || item === void 0 ? void 0 : item.MiddleName,
                                                LastName: item === null || item === void 0 ? void 0 : item.LastName,
                                                FullName: fullName,
                                                ResidentialAddress: item === null || item === void 0 ? void 0 : item.ResidentialAddress,
                                                DOB: item === null || item === void 0 ? void 0 : item.DOB,
                                                ContactNumber: item === null || item === void 0 ? void 0 : item.ContactNumber,
                                                Email: item === null || item === void 0 ? void 0 : item.Email,
                                                Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                                Gender: item === null || item === void 0 ? void 0 : item.Gender,
                                                TotalYearOfExperiance: item === null || item === void 0 ? void 0 : item.TotalYearOfExperiance,
                                                Skills: item === null || item === void 0 ? void 0 : item.Skills,
                                                LanguageKnown: item === null || item === void 0 ? void 0 : item.LanguageKnown,
                                                ReleventExperience: item === null || item === void 0 ? void 0 : item.ReleventExperience,
                                                Qualification: item === null || item === void 0 ? void 0 : item.Qualification,
                                                CandidateCVDoc: candidateCV,
                                                Status: ((_g = item === null || item === void 0 ? void 0 : item.Status) === null || _g === void 0 ? void 0 : _g.StatusDescription) || "",
                                                StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                                PositionTitle: item.PositionTitle,
                                                JobGrade: item.JobGrade,
                                                ExternalAgentDetails: { AgentName: item === null || item === void 0 ? void 0 : item.ExternalAgentDetails },
                                                HRMSCandidateScoreCard: panelResult,
                                                GPA: lastGPA,
                                                JobRequestID: item === null || item === void 0 ? void 0 : item.JobRequestID,
                                                InterviewDate: item === null || item === void 0 ? void 0 : item.InterviewDate,
                                                ConflictsOfInterest: item === null || item === void 0 ? void 0 : item.ConflictsOfInterest,
                                                disability: item === null || item === void 0 ? void 0 : item.Disability,
                                                disabilityReason: item === null || item === void 0 ? void 0 : item.DisabilityDetails,
                                                NationalityCode: item === null || item === void 0 ? void 0 : item.NationalityCode,
                                            }];
                                }
                            });
                        }); }))];
                case 2:
                    formattedItems = _a.sent();
                    return [2 /*return*/, formattedItems];
                case 3:
                    err_5 = _a.sent();
                    console.error("getCombinedCandidatePositionDetails error:", err_5);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 4. fetchCandidateList  (used by ReviewScorecardCandidateList)
//    Source: CandidateList.fetchAllData
//    Lists:  HRMSRecruitmentDptDetails, HRMSGradeMaster,
//            HRMSRecruitmentCandidatePersonalDetails
// ─────────────────────────────────────────────────────────────────────────────
function fetchCandidateList(recruitmentID, jobCodeID, employeeList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var recruitRes, grade, gradeLevelItems, rawLevel, level, candidateFilter, rows;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                        Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                        Select: "*,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title",
                        Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }],
                        Expand: "Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode",
                        Topcount: TOP,
                    })];
                case 1:
                    recruitRes = _e.sent();
                    grade = (_b = (_a = recruitRes[0]) === null || _a === void 0 ? void 0 : _a.PatersonGrade) !== null && _b !== void 0 ? _b : "";
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSGradeMaster,
                            Select: "*",
                            Filter: [
                                { FilterKey: "PatersonGrade", Operator: "eq", FilterValue: grade },
                            ],
                        })];
                case 2:
                    gradeLevelItems = _e.sent();
                    rawLevel = (_d = (_c = gradeLevelItems[0]) === null || _c === void 0 ? void 0 : _c.Levels) !== null && _d !== void 0 ? _d : "";
                    level = rawLevel === "2" ? "Level 1 & 2" : rawLevel;
                    candidateFilter = [
                        {
                            FilterKey: "RecruitmentIDId",
                            Operator: "eq",
                            FilterValue: recruitmentID,
                        },
                        { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeID },
                        {
                            FilterKey: "StatusId",
                            Operator: "in",
                            FilterValue: [
                                Config_1.StatusId.PendingwithHODtoselectthecandidate,
                                Config_1.StatusId.Selected,
                                Config_1.StatusId.OnHoldbyHOD,
                                Config_1.StatusId.RejectedbyHOD,
                                Config_1.StatusId.PendingwithHODtoAssignPositionID,
                                Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2,
                                Config_1.StatusId.CandidateOnHoldbyHODLevel1,
                                Config_1.StatusId.CandidateOnHoldbyHODLevel2,
                                Config_1.StatusId.CandidateRejectedbyHODLevel1,
                                Config_1.StatusId.CandidateRejectedbyHODLevel2,
                            ],
                        },
                        { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
                    ];
                    return [4 /*yield*/, getCombinedCandidatePositionDetails(candidateFilter, "and", employeeList)];
                case 3:
                    rows = _e.sent();
                    return [2 /*return*/, rows.map(function (item) { return (tslib_1.__assign(tslib_1.__assign({}, item), { Grade: grade, InterviewLevel: level })); })];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 5. fetchCandidateDetail  (single candidate – for HOD detail view)
// ─────────────────────────────────────────────────────────────────────────────
function fetchCandidateDetail(candidateID, employeeList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var rows, op, interviewLevels;
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getCombinedCandidatePositionDetails([{ FilterKey: "ID", Operator: "eq", FilterValue: candidateID }], "", employeeList)];
                case 1:
                    rows = _c.sent();
                    if (!rows.length)
                        return [2 /*return*/, {}];
                    op = rows[0];
                    interviewLevels = Array.from(new Set((_b = (_a = op === null || op === void 0 ? void 0 : op.HRMSCandidateScoreCard) === null || _a === void 0 ? void 0 : _a.map(function (i) { return i.InterviewLevel; })) !== null && _b !== void 0 ? _b : []));
                    return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, op), { InterviewLevels: interviewLevels })];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 6. fetchGradeLevel
//    Source: RecruitmentProcessService.GetRecruitmentDetails + CommonService.GetGradeLevel
//    Lists:  HRMSRecruitmentDptDetails, HRMSGradeMaster
// ─────────────────────────────────────────────────────────────────────────────
function fetchGradeLevel(recruitmentID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, grade, gradeLevelItems;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                        Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                        Select: "*,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title",
                        Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: recruitmentID }],
                        Expand: "Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode",
                        Topcount: TOP,
                    })];
                case 1:
                    res = _e.sent();
                    grade = (_b = (_a = res[0]) === null || _a === void 0 ? void 0 : _a.PatersonGrade) !== null && _b !== void 0 ? _b : "";
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSGradeMaster,
                            Select: "*",
                            Filter: [
                                { FilterKey: "PatersonGrade", Operator: "eq", FilterValue: grade },
                            ],
                        })];
                case 2:
                    gradeLevelItems = _e.sent();
                    return [2 /*return*/, {
                            Grade: grade,
                            Levels: (_d = (_c = gradeLevelItems[0]) === null || _c === void 0 ? void 0 : _c.Levels) !== null && _d !== void 0 ? _d : "",
                        }];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 7. fetchScoreData  — raw scores → DataTable 1 (question rows) + DataTable 2
// ─────────────────────────────────────────────────────────────────────────────
function fetchScoreData(candidateID, employeeList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var panelItems, candidatePanels, rawScores, questionMap;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getInterviewPanelDetailsForScorecard(candidateID, employeeList)];
                case 1:
                    panelItems = _a.sent();
                    candidatePanels = panelItems.filter(function (p) { return p.CandidateID === candidateID; });
                    rawScores = candidatePanels.flatMap(function (c) {
                        var score = c.ScoreCard;
                        return score && c.ID === score.InterviewPanelID ? [score] : [];
                    });
                    questionMap = {};
                    rawScores.forEach(function (score, idx) {
                        if (score.QuestionJson) {
                            score.QuestionJson.forEach(function (q) {
                                var key = Object.keys(q)[0];
                                if (!questionMap[key])
                                    questionMap[key] = { criteria: key };
                                questionMap[key]["interviewer_".concat(idx + 1)] = q[key];
                            });
                        }
                    });
                    return [2 /*return*/, { rawScores: rawScores, questionRows: Object.values(questionMap) }];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 8. buildOverallScoreRows  — pure transform (no SP call)
//    Mirrors: HodViewScorecard.transformScoreData
// ─────────────────────────────────────────────────────────────────────────────
function buildOverallScoreRows(rawScores) {
    var criteria = [
        { field: "RelevantQualification", label: "Qualification (Relevant)" },
        { field: "ReleventExperience", label: "Experience (Relevant)" },
        { field: "Knowledge", label: "Knowledge" },
        { field: "EnergyLevel", label: "Energy Level" },
        { field: "MeetJobRequirement", label: "Meets All Job Requirements" },
        {
            field: "ContributeTowardsCultureRequried",
            label: "Will Contribute to the Culture Required",
        },
        { field: "Experience", label: "Experience" },
        { field: "OtherCriteriaScore", label: "Other Criteria Recognized by Panel" },
        { field: "ConsiderForEmployment", label: "To Consider for Employment (Yes/No)" },
    ];
    var rows = criteria.map(function (c) {
        var row = { criteria: c.label, total: 0 };
        rawScores.forEach(function (score, idx) {
            var _a;
            if (c.field === "ConsiderForEmployment") {
                row["interviewer_".concat(idx + 1)] = (_a = score.ConsiderForEmployment) !== null && _a !== void 0 ? _a : "";
            }
            else {
                var val = Number(score[c.field]) || 0;
                row.total += val;
                row["interviewer_".concat(idx + 1)] = val;
            }
        });
        return row;
    });
    var totalRow = { criteria: "Total", total: 0 };
    rawScores.forEach(function (_, idx) {
        var sum = rows.reduce(function (acc, r) {
            var v = r["interviewer_".concat(idx + 1)];
            return typeof v === "number" ? acc + v : acc;
        }, 0);
        totalRow["interviewer_".concat(idx + 1)] = "".concat(sum, " / 40");
        totalRow.total += sum;
    });
    rows.push(totalRow);
    return rows;
}
// ─────────────────────────────────────────────────────────────────────────────
// 9. fetchComments
//    Source: InterviewProcessService.getInterviewPanelDetails (level1)
//            InterviewProcessService.getCandidateLevel2ScoreCardData (level2)
//    Lists:  HRMSInterviewPanelDetails, HRMSCandidateLevel2ScoreCard
// ─────────────────────────────────────────────────────────────────────────────
function fetchComments(candidateID, employeeList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, l1Raw, l2Raw;
        var _this = this;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getInterviewPanelDetailsForScorecard(candidateID, employeeList),
                        (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var items;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                                            Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                                            Select: "*,ID,CandidateID/ID,CandidateID/Title,Comments,Role/ID,Role/RoleTitle,Level,Author/EMail,Author/Title",
                                            Expand: "CandidateID,Role,Author",
                                            Filter: [
                                                {
                                                    FilterKey: "CandidateID/Id",
                                                    Operator: "eq",
                                                    FilterValue: candidateID,
                                                },
                                            ],
                                        })];
                                    case 1:
                                        items = _a.sent();
                                        return [2 /*return*/, items.map(function (objresult) {
                                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                                                var email = (_c = (_b = (_a = objresult.Author) === null || _a === void 0 ? void 0 : _a.EMail) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : "";
                                                var employee = employeeList.find(function (emp) { var _a; return ((_a = emp.Email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === email; });
                                                return {
                                                    Id: (_d = objresult.ID) !== null && _d !== void 0 ? _d : 0,
                                                    CandidateID: (_f = (_e = objresult.CandidateID) === null || _e === void 0 ? void 0 : _e.ID) !== null && _f !== void 0 ? _f : 0,
                                                    RoleId: (_h = (_g = objresult.Role) === null || _g === void 0 ? void 0 : _g.ID) !== null && _h !== void 0 ? _h : 0,
                                                    RoleTitle: (_k = (_j = objresult.Role) === null || _j === void 0 ? void 0 : _j.RoleTitle) !== null && _k !== void 0 ? _k : "",
                                                    comments: (_l = objresult.Comments) !== null && _l !== void 0 ? _l : "",
                                                    Level: (_m = objresult.Level) !== null && _m !== void 0 ? _m : "",
                                                    JobTitleInEnglish: (_o = employee === null || employee === void 0 ? void 0 : employee.JobTitle) !== null && _o !== void 0 ? _o : "",
                                                    JobTitleInFrench: (_p = employee === null || employee === void 0 ? void 0 : employee.JobTitleInFrench) !== null && _p !== void 0 ? _p : "",
                                                    Department: "",
                                                    Date: objresult.Created ? new Date(objresult.Created) : null,
                                                    JobTitle: "",
                                                    RoleName: (_r = (_q = objresult.Role) === null || _q === void 0 ? void 0 : _q.RoleTitle) !== null && _r !== void 0 ? _r : "",
                                                    Name: employee
                                                        ? "".concat((_s = employee.FirstName) !== null && _s !== void 0 ? _s : "", " ").concat((_t = employee.MiddleName) !== null && _t !== void 0 ? _t : "", " ").concat((_u = employee.LastName) !== null && _u !== void 0 ? _u : "").trim()
                                                        : ((_v = objresult.Author) === null || _v === void 0 ? void 0 : _v.Title) || "",
                                                };
                                            })];
                                }
                            });
                        }); })(),
                    ])];
                case 1:
                    _a = _b.sent(), l1Raw = _a[0], l2Raw = _a[1];
                    return [2 /*return*/, {
                            level1: l1Raw.filter(function (i) { return i.CandidateID === candidateID; }),
                            level2: l2Raw.filter(function (i) { return i.CandidateID === candidateID; }),
                        }];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 10. fetchQuestionnaire
//     Source: GetPortalJobs.getQuestionnaire
//     Step A: GetJobUniqueDataValue – LIST: RecruitAppCareerPortalIntegration
//     Step B: QuestionnaireApi.GetQuestionnaire (Axios portal API)
// ─────────────────────────────────────────────────────────────────────────────
function fetchQuestionnaire(jobCodeID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var jobUniqueItems, jobUniqueKey, response, questions, err_6;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                            Select: "*,JobCode/JobCode",
                            Filter: [
                                { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeID },
                                { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
                            ],
                            FilterCondition: "and",
                            Expand: "JobCode",
                            Topcount: TOP,
                            Orderby: "ID",
                            Orderbydecorasc: true,
                        })];
                case 1:
                    jobUniqueItems = _d.sent();
                    jobUniqueKey = (_b = (_a = jobUniqueItems[0]) === null || _a === void 0 ? void 0 : _a.JobUniqueKey) !== null && _b !== void 0 ? _b : "";
                    if (!jobUniqueKey)
                        return [2 /*return*/, { status: 404, data: [] }];
                    return [4 /*yield*/, questionnaireService.getQuestionnaire(jobUniqueKey)];
                case 2:
                    response = _d.sent();
                    questions = ((_c = response.data) !== null && _c !== void 0 ? _c : []).map(function (item, index) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                        return ({
                            id: index + 1,
                            question: (_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.question) === null || _a === void 0 ? void 0 : _a.quesContent) === null || _b === void 0 ? void 0 : _b.contentEn) !== null && _c !== void 0 ? _c : "",
                            questionFr: (_f = (_e = (_d = item === null || item === void 0 ? void 0 : item.question) === null || _d === void 0 ? void 0 : _d.quesContent) === null || _e === void 0 ? void 0 : _e.contentFr) !== null && _f !== void 0 ? _f : "",
                            answer: (_l = (_k = (_j = (_h = (_g = item === null || item === void 0 ? void 0 : item.question) === null || _g === void 0 ? void 0 : _g.questionXAnswers) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.optContent) === null || _k === void 0 ? void 0 : _k.contentEn) !== null && _l !== void 0 ? _l : "",
                            answerFr: (_r = (_q = (_p = (_o = (_m = item === null || item === void 0 ? void 0 : item.question) === null || _m === void 0 ? void 0 : _m.questionXAnswers) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.optContent) === null || _q === void 0 ? void 0 : _q.contentFr) !== null && _r !== void 0 ? _r : "",
                            rating: 0,
                            header: "Q" + (index + 1),
                        });
                    });
                    return [2 /*return*/, { status: 200, data: questions }];
                case 3:
                    err_6 = _d.sent();
                    console.error("fetchQuestionnaire error:", err_6);
                    return [2 /*return*/, { status: 500, data: [] }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 11. fetchPositionOptions
//     Source: InterviewProcessService.GetHRMSPositionDetails
//     List:   HRMSPositionIDMaster
// ─────────────────────────────────────────────────────────────────────────────
function fetchPositionOptions(jobCodeID, department) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var positionItems, err_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSPositionIDMaster,
                            Select: "*,JobCode/JobCode,Department/DepartmentName",
                            Expand: "JobCode,Department",
                            Filter: [
                                { FilterKey: "JobCode", Operator: "eq", FilterValue: jobCodeID },
                                { FilterKey: "Department", Operator: "eq", FilterValue: department },
                                {
                                    FilterKey: "PositionIDStatus",
                                    Operator: "eq",
                                    FilterValue: ScorecardConfig_1.PositionStatus.RecruitmentInitiator,
                                },
                            ],
                            FilterCondition: "and",
                            Topcount: 100,
                        })];
                case 1:
                    positionItems = _a.sent();
                    return [2 /*return*/, positionItems.map(function (item) { return ({
                            key: item.ID,
                            text: item.PositionID || "",
                        }); })];
                case 2:
                    err_7 = _a.sent();
                    console.error("fetchPositionOptions error:", err_7);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 12. fetchSelectedCandidateDetails
//     Source: InterviewProcessService.GetSelectedCandidateDetailsByHOD
//     List:   HRMSSelectedCandidateDetailsByHOD
// ─────────────────────────────────────────────────────────────────────────────
function fetchSelectedCandidateDetails(candidateID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, err_8;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                            Select: "*,PositionID/ID,PositionID/PositionID,CandidateID/ID",
                            Expand: "PositionID,CandidateID",
                            Filter: [
                                {
                                    FilterKey: "CandidateID/Id",
                                    Operator: "eq",
                                    FilterValue: candidateID,
                                },
                            ],
                            Topcount: TOP,
                        })];
                case 1:
                    items = _e.sent();
                    if (!items.length)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            positionId: ((_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.PositionID) === null || _b === void 0 ? void 0 : _b.PositionID) || "",
                            positionValue: ((_d = (_c = items[0]) === null || _c === void 0 ? void 0 : _c.PositionID) === null || _d === void 0 ? void 0 : _d.ID) || 0,
                        }];
                case 2:
                    err_8 = _e.sent();
                    console.error("fetchSelectedCandidateDetails error:", err_8);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 13. assignPosition
//     Source: HodViewScorecard.handleAssignPosition
//             + InterviewProcessService.AssignPositionID
//     Lists:  HRMSPositionIDMaster (read), HRMSSelectedCandidateDetailsByHOD (add),
//             HRMSPositionIDMaster (update)
// ─────────────────────────────────────────────────────────────────────────────
function assignPosition(payload, positionText, _positionKey) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var positionItems, selectedPos, err_9;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSPositionIDMaster,
                            Select: "*,JobCode/JobCode",
                            Filter: [
                                { FilterKey: "PositionID", Operator: "eq", FilterValue: positionText },
                            ],
                            Expand: "JobCode",
                        })];
                case 1:
                    positionItems = _a.sent();
                    if (!positionItems.length)
                        return [2 /*return*/];
                    selectedPos = positionItems[0];
                    return [4 /*yield*/, spservice_1.default.SPAddItem({
                            Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                            RequestJSON: tslib_1.__assign(tslib_1.__assign({}, payload), { PositionIDId: selectedPos.ID }),
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSPositionIDMaster,
                            RequestJSON: { PositionIDStatus: ScorecardConfig_1.PositionStatus.RecruitmentInProgress },
                            ID: selectedPos.ID,
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_9 = _a.sent();
                    console.error("assignPosition error:", err_9);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 14. upsertLevel1Comment
//     Source: HodViewScorecard.insertOrUpdateCandidateCommentLevel1
//     List:   HRMSRecruitmentCandidateComments
// ─────────────────────────────────────────────────────────────────────────────
function upsertLevel1Comment(candidateID, comments, roleID, level) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, matching, err_10;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                            Select: "ID,CandidateID/ID,CandidateID/Title,Comments,Role/ID,Role/RoleTitle,Level",
                            Expand: "CandidateID,Role",
                            Filter: [
                                {
                                    FilterKey: "CandidateIDId",
                                    Operator: "eq",
                                    FilterValue: candidateID,
                                },
                            ],
                            Topcount: TOP,
                        })];
                case 1:
                    items = _a.sent();
                    matching = items.find(function (c) { var _a, _b; return ((_a = c.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) === candidateID && ((_b = c.Role) === null || _b === void 0 ? void 0 : _b.ID) === roleID; });
                    if (!matching) return [3 /*break*/, 3];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                            RequestJSON: { Comments: comments, Level: level },
                            ID: matching.ID,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, spservice_1.default.SPAddItem({
                        Listname: Config_1.ListNames.HRMSRecruitmentCandidateComments,
                        RequestJSON: {
                            CandidateIDId: candidateID,
                            Comments: comments,
                            RoleId: roleID,
                            Level: level,
                        },
                    })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_10 = _a.sent();
                    console.error("upsertLevel1Comment error:", err_10);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 15. upsertLevel2Comment
//     Source: HodViewScorecard.insertOrUpdateLevel2ScorecardComment
//     List:   HRMSCandidateLevel2ScoreCard
// ─────────────────────────────────────────────────────────────────────────────
function upsertLevel2Comment(candidateID, comments, roleID, level) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, matching, err_11;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                            Select: "ID,CandidateID/ID,CandidateID/Title,Comments,Role/ID,Role/RoleTitle,Level",
                            Expand: "CandidateID,Role",
                            Filter: [
                                {
                                    FilterKey: "CandidateIDId",
                                    Operator: "eq",
                                    FilterValue: candidateID,
                                },
                            ],
                            Topcount: TOP,
                        })];
                case 1:
                    items = _a.sent();
                    matching = items.find(function (c) { var _a, _b; return ((_a = c.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) === candidateID && ((_b = c.Role) === null || _b === void 0 ? void 0 : _b.ID) === roleID; });
                    if (!matching) return [3 /*break*/, 3];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                            RequestJSON: { Comments: comments, Level: level },
                            ID: matching.ID,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, spservice_1.default.SPAddItem({
                        Listname: Config_1.ListNames.HRMSCandidateLevel2ScoreCard,
                        RequestJSON: {
                            CandidateIDId: candidateID,
                            Comments: comments,
                            RoleId: roleID,
                            Level: level,
                        },
                    })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_11 = _a.sent();
                    console.error("upsertLevel2Comment error:", err_11);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 16. submitLevel2ScoreSheet
//     Source: HodViewScorecard.Submit_fn (Level2 path)
//     Lists:  HRMSInterviewPanelDetails (read + update)
//             HRMSRecruitmentCandidatePersonalDetails (update – done in caller)
// ─────────────────────────────────────────────────────────────────────────────
function submitLevel2ScoreSheet(candidateID, currentUserEmailId, stateValueID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var user, currentUserKey_1, allPanels, matchingPanels, userPanels, _i, userPanels_1, panel, updatedPanels, level2Panels, uploadedCount, err_12;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, spservice_1.getSP)().web.siteUsers.getByEmail(currentUserEmailId)()];
                case 1:
                    user = _a.sent();
                    currentUserKey_1 = user === null || user === void 0 ? void 0 : user.Id;
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            Select: "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail, IsScoreSheetUploaded",
                            Expand: "InterviewPanel,RecruitmentID,CandidateID",
                            Filter: [
                                {
                                    FilterKey: "CandidateIDId",
                                    Operator: "eq",
                                    FilterValue: stateValueID,
                                },
                            ],
                        })];
                case 2:
                    allPanels = _a.sent();
                    matchingPanels = allPanels.filter(function (p) { var _a; return stateValueID === ((_a = p.CandidateID) === null || _a === void 0 ? void 0 : _a.ID); });
                    userPanels = matchingPanels.filter(function (p) { var _a; return ((_a = p.InterviewPanel) === null || _a === void 0 ? void 0 : _a.Id) === Number(currentUserKey_1); });
                    _i = 0, userPanels_1 = userPanels;
                    _a.label = 3;
                case 3:
                    if (!(_i < userPanels_1.length)) return [3 /*break*/, 6];
                    panel = userPanels_1[_i];
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                            RequestJSON: { IsScoreSheetUploaded: "Yes" },
                            ID: panel.ID,
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, spservice_1.default.SPReadItems({
                        Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                        Select: "ID, CandidateID/ID, InterviewLevel, IsScoreSheetUploaded",
                        Expand: "CandidateID",
                        Filter: [
                            {
                                FilterKey: "CandidateID/Id",
                                Operator: "eq",
                                FilterValue: candidateID,
                            },
                        ],
                    })];
                case 7:
                    updatedPanels = _a.sent();
                    level2Panels = updatedPanels.filter(function (p) { var _a; return ((_a = p.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) === candidateID && p.InterviewLevel === "Level 2"; });
                    uploadedCount = level2Panels.filter(function (p) { return p.IsScoreSheetUploaded === "Yes"; }).length;
                    return [2 /*return*/, uploadedCount === level2Panels.length];
                case 8:
                    err_12 = _a.sent();
                    console.error("submitLevel2ScoreSheet error:", err_12);
                    return [2 /*return*/, false];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 17. candidateSelectionApi
//     Source: InterviewProcessService.CandidateSeletionApi
//     List:   HRMSRecruitmentCandidatePersonalDetails (update)
// ─────────────────────────────────────────────────────────────────────────────
function candidateSelectionApi(obj, listName) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_13;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: listName,
                            RequestJSON: {
                                ActionId: obj.ActionId,
                                ItemCreated: obj.ItemCreated,
                                Comments: obj.Comments,
                                GPA: obj.GPA,
                                OthersInterviewed: obj.OthersInterviewed,
                            },
                            ID: obj.Id,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { status: 200 }];
                case 2:
                    err_13 = _a.sent();
                    console.error("candidateSelectionApi error:", err_13);
                    return [2 /*return*/, { status: 400 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 18. updateCandidateWorkflowStatus
//     Source: GetPortalJobs.UpdateCandidateStatus  →  getProfileData.UpdateCandidateStatus
//     API:    POST /hrms/UpdateWorkflowStatus  (Axios)
// ─────────────────────────────────────────────────────────────────────────────
function updateCandidateWorkflowStatus(data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_14;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, CareerPortalAPI_1.getProfileData.UpdateCandidateStatus(data)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_14 = _a.sent();
                    console.error("updateCandidateWorkflowStatus error:", err_14);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 19. getCandidateInterviewedCount
//     Source: InterviewProcessService.GetCandidateDetailsInterviewPanalDashboard
//     List:   HRMSRecruitmentCandidatePersonalDetails
// ─────────────────────────────────────────────────────────────────────────────
function getCandidateInterviewedCount(jobCodeID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var items, err_15;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                            Select: "*,Status/ID,Status/StatusDescription,RecruitmentID/ID,JobCode/JobCode",
                            Expand: "Status,RecruitmentID,JobCode",
                            Filter: [
                                { FilterKey: "JobCode", Operator: "eq", FilterValue: jobCodeID },
                            ],
                            Topcount: TOP,
                        })];
                case 1:
                    items = _a.sent();
                    return [2 /*return*/, items.length];
                case 2:
                    err_15 = _a.sent();
                    console.error("getCandidateInterviewedCount error:", err_15);
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// 20. updatePositionStatus  — revert to Initiator on Reject / OnHold
//     List: HRMSPositionIDMaster (update)
// ─────────────────────────────────────────────────────────────────────────────
function updatePositionStatus(positionKey, status) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_16;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSPositionIDMaster,
                            RequestJSON: { PositionIDStatus: status },
                            ID: positionKey,
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_16 = _a.sent();
                    console.error("updatePositionStatus error:", err_16);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ─────────────────────────────────────────────────────────────
// Private helper
// ─────────────────────────────────────────────────────────────
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
// ─────────────────────────────────────────────────────────────
// fetchScorecardCandidates
// ─────────────────────────────────────────────────────────────
function fetchScorecardCandidates(recruitmentID_1, jobCodeID_1) {
    return tslib_1.__awaiter(this, arguments, void 0, function (recruitmentID, jobCodeID, currentUserEmail, candidateFilter) {
        var filter, res, enrichedWithGPA, e_2;
        var _this = this;
        if (currentUserEmail === void 0) { currentUserEmail = ""; }
        if (candidateFilter === void 0) { candidateFilter = []; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    filter = candidateFilter && candidateFilter.length
                        ? tslib_1.__spreadArray([], candidateFilter, true) : [
                        { FilterKey: "RecruitmentIDId", Operator: "eq", FilterValue: recruitmentID },
                        { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeID },
                        {
                            FilterKey: "StatusId",
                            Operator: "in",
                            // Exact StatusId array from old CandidateList.tsx (includes ALL HOD statuses)
                            FilterValue: [
                                121, // PendingwithHODtoselectthecandidate
                                122, // Selected
                                123, // OnHoldbyHOD
                                15, // RejectedbyHOD
                                130, // PendingwithHODtoAssignPositionID
                                127, // PendingwithHODtoselectthecandidateLevel2
                                165, // CandidateOnHoldbyHODLevel1
                                166, // CandidateOnHoldbyHODLevel2
                                167, // CandidateRejectedbyHODLevel1
                                168, // CandidateRejectedbyHODLevel2
                            ],
                        },
                        // NOTE: Old CandidateList.tsx includes ItemCreated:"No" but some SP records
                        // have null/empty ItemCreated — we keep this filter off to return all HOD-status
                        // candidates regardless of ItemCreated value, matching actual SP data behaviour.
                    ];
                    console.log("--> fetchScorecardCandidates: recruitmentID=", recruitmentID, "jobCodeID=", jobCodeID, "filter=", JSON.stringify(filter));
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                            // Mirror old GetCombinedCandidatePositionDetails Select/Expand exactly
                            Select: "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
                            Expand: "JobCode,AssignByInterviewPanel,RecruitmentID,Status",
                            FilterCondition: "and",
                            Filter: filter,
                            Topcount: 1000, // matches old count.Topcount from Config.ts
                        })];
                case 1:
                    res = _a.sent();
                    console.log("--> fetchScorecardCandidates: records fetched =", res === null || res === void 0 ? void 0 : res.length);
                    return [4 /*yield*/, Promise.all((res || []).map(function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var gpa, panels, level1Count, maxOverallScore, sumOverall, sumQuestion, maxQuestion, _i, panels_1, panel, scorecards, sc, totalScore, questionData, questionScore, combined, maxPossible, e_3;
                            var _a, _b, _c, _d;
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        gpa = null;
                                        _e.label = 1;
                                    case 1:
                                        _e.trys.push([1, 7, , 8]);
                                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                                Select: "ID,InterviewLevel,CandidateID/ID",
                                                Expand: "CandidateID",
                                                Filter: [{ FilterKey: "CandidateID/Id", Operator: "eq", FilterValue: item.ID }],
                                            })];
                                    case 2:
                                        panels = _e.sent();
                                        level1Count = panels.filter(function (p) { return p.InterviewLevel === "Level 1"; }).length;
                                        maxOverallScore = level1Count * 40;
                                        sumOverall = 0;
                                        sumQuestion = 0;
                                        maxQuestion = 0;
                                        _i = 0, panels_1 = panels;
                                        _e.label = 3;
                                    case 3:
                                        if (!(_i < panels_1.length)) return [3 /*break*/, 6];
                                        panel = panels_1[_i];
                                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                                Listname: Config_1.ListNames.HRMSCandidateScoreCard,
                                                Select: "*",
                                                Filter: [{ FilterKey: "InterviewPanelIDId", Operator: "eq", FilterValue: panel.ID }],
                                            })];
                                    case 4:
                                        scorecards = _e.sent();
                                        if (scorecards.length > 0) {
                                            sc = scorecards[0];
                                            totalScore = (Number(sc.RelevantQualification) || 0) +
                                                (Number(sc.ReleventExperience) || 0) +
                                                (Number(sc.Knowledge) || 0) +
                                                (Number(sc.EnergyLevel) || 0) +
                                                (Number(sc.MeetJobRequirement) || 0) +
                                                (Number(sc.ContributeTowardsCultureRequried) || 0) +
                                                (Number(sc.Experience) || 0) +
                                                (Number(sc.OtherCriteriaScore) || 0);
                                            questionData = _parseJson(sc.QuestionJson);
                                            questionScore = questionData.reduce(function (sum, q) {
                                                return sum + (Number(Object.values(q)[0]) || 0);
                                            }, 0);
                                            sumOverall += totalScore;
                                            sumQuestion += questionScore;
                                            maxQuestion += questionData.length * 3;
                                        }
                                        _e.label = 5;
                                    case 5:
                                        _i++;
                                        return [3 /*break*/, 3];
                                    case 6:
                                        combined = sumOverall + sumQuestion;
                                        maxPossible = maxOverallScore + maxQuestion;
                                        if (maxPossible > 0) {
                                            gpa = Math.floor((combined / maxPossible) * 5 * 100) / 100;
                                        }
                                        return [3 /*break*/, 8];
                                    case 7:
                                        e_3 = _e.sent();
                                        console.warn("GPA calc error for candidate", item.ID, e_3);
                                        return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/, {
                                            id: item.ID,
                                            recruitmentID: ((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.ID) || recruitmentID,
                                            jobCode: ((_b = item.JobCode) === null || _b === void 0 ? void 0 : _b.JobCode) || "",
                                            jobCodeID: item.JobCodeId || jobCodeID,
                                            fullName: [item.FristName, item.MiddleName, item.LastName]
                                                .filter(Boolean).join(" ").trim(),
                                            nationality: item.Nationality || "",
                                            gender: item.Gender || "",
                                            status: ((_c = item.Status) === null || _c === void 0 ? void 0 : _c.StatusDescription) || item.Status || "",
                                            statusId: item.StatusId || ((_d = item.Status) === null || _d === void 0 ? void 0 : _d.ID) || 0,
                                            interviewDate: item.InterviewDate || "",
                                            interviewLevel: item.InterviewLevel || "",
                                            grade: item.JobGrade || "",
                                            department: item.Department || "",
                                            gpa: gpa !== null ? String(gpa) : "",
                                            positionTitle: item.PositionTitle || "",
                                            disability: item.Disability || "",
                                            jobTitle: item.JobTitle || "",
                                        }];
                                }
                            });
                        }); }))];
                case 2:
                    enrichedWithGPA = _a.sent();
                    return [2 /*return*/, enrichedWithGPA];
                case 3:
                    e_2 = _a.sent();
                    console.error("fetchScorecardCandidates error", e_2);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=ScorecardApiService.js.map