"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCandidateValue = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var RoleContext_1 = require("../../../../../utilities/hooks/RoleContext");
function fetchCandidateValue(CandidateId, recruitmentID) {
    var _this = this;
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var _a = React.useState([]), candidates = _a[0], setCandidates = _a[1];
    var _b = React.useState(true), candidatesLoading = _b[0], setCandidatesLoading = _b[1];
    var drawerOpen = React.useState(true)[0];
    var _c = React.useState(null), reviewingCandidate = _c[0], setReviewingCandidate = _c[1];
    var _d = React.useState(null), reviewData = _d[0], setReviewData = _d[1];
    var _e = React.useState([]), scoreData = _e[0], setScoreData = _e[1];
    var _f = React.useState(false), showComments = _f[0], setShowComments = _f[1];
    var _g = React.useState([]), level1Comments = _g[0], setLevel1Comments = _g[1];
    var _h = React.useState([]), level2Comments = _h[0], setLevel2Comments = _h[1];
    var _j = React.useState(false), commentsLoading = _j[0], setCommentsLoading = _j[1];
    var _k = React.useState(false), reviewLoading = _k[0], setReviewLoading = _k[1];
    var _l = React.useState(false), scoreLoading = _l[0], setScoreLoading = _l[1];
    function _parseQJson(raw) {
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
    function calculateGPA(scorecards) {
        if (!scorecards || scorecards.length === 0)
            return "";
        try {
            var level1Panels = scorecards.filter(function (s) { return !s.InterviewLevel || /level\s*1/i.test(s.InterviewLevel || ""); });
            var panels = level1Panels.length > 0 ? level1Panels : scorecards;
            var maxOverall = panels.length * 40;
            var sumOverall = 0, sumQuestion = 0, maxQuestion = 0;
            for (var _i = 0, panels_1 = panels; _i < panels_1.length; _i++) {
                var sc = panels_1[_i];
                sumOverall +=
                    (Number(sc.RelevantQualification) || 0) +
                        (Number(sc.ReleventExperience) || 0) +
                        (Number(sc.Knowledge) || 0) +
                        (Number(sc.EnergyLevel) || 0) +
                        (Number(sc.MeetJobRequirement) || 0) +
                        (Number(sc.ContributeTowardsCultureRequried) || 0) +
                        (Number(sc.Experience) || 0) +
                        (Number(sc.OtherCriteriaScore) || 0);
                var qJson = _parseQJson(sc.QuestionJson);
                var qScore = qJson.reduce(function (sum, q) { return sum + (Number(Object.values(q)[0]) || 0); }, 0);
                sumQuestion += qScore;
                maxQuestion += qJson.length * 3;
            }
            var combined = sumOverall + sumQuestion;
            var maxPossible = maxOverall + maxQuestion;
            if (maxPossible <= 0)
                return "";
            return String(Math.floor((combined / maxPossible) * 5 * 100) / 100);
        }
        catch (e) {
            console.warn("[calculateGPA]", e);
            return "";
        }
    }
    var loadCandidates = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var list, mapped, result, scorecardArr, calculatedGPA_1, e_1;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!CandidateId || !recruitmentID)
                        return [2 /*return*/];
                    setCandidatesLoading(true);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, ServiceExport_1.EvaluationserviceL2.getCandidatesByRecruitmentId(CandidateId, recruitmentID)];
                case 2:
                    list = _e.sent();
                    mapped = list.map(function (c) { return ({
                        id: c.id,
                        recruitmentID: c.recruitmentID,
                        jobCode: c.jobCode || "",
                        jobCodeID: c.jobCodeID || 0,
                        fullName: c.fullName || "",
                        nationality: c.nationality || "",
                        gender: c.gender || "",
                        status: c.status || "",
                        statusId: c.statusId || 0,
                        interviewDate: c.interviewDate || "",
                        interviewLevel: c.interviewLevel || "",
                        grade: c.grade || "",
                        department: c.department || "",
                        gpa: c.gpa || "",
                        positionTitle: c.positionTitle || "",
                        disability: c.disability || "",
                        jobTitle: c.jobTitle || "",
                        isExapt: c.isExapt,
                        ProfileImage: c.profilePhoto
                    }); });
                    setCandidates(mapped);
                    setReviewingCandidate(mapped[0]);
                    setReviewLoading(true);
                    setScoreLoading(true);
                    return [4 /*yield*/, ServiceExport_1.EvaluationserviceL2.getReviewScoreCardData(CandidateId, ADGroupData.EmailId[0], tslib_1.__assign(tslib_1.__assign({}, mapped[0]), { department: mapped[0].department }))];
                case 3:
                    result = _e.sent();
                    setReviewData({
                        candidateData: {
                            Nationality: result.nationality,
                            Gender: result.gender,
                            Qualification: result.qualification,
                            TotalYearOfExperiance: result.miningExp,
                            ReleventExperience: result.relevantExp,
                            InterviewDate: result.interviewDate,
                            ConflictsOfInterest: result.conflictsOfInterest,
                            Disability: result.disability,
                            PositionTitle: result.positionTitle,
                            level2ScorecardId: (_b = (_a = result.level2Scorecard) === null || _a === void 0 ? void 0 : _a.ID) !== null && _b !== void 0 ? _b : null,
                            jobRequestId: (_c = result.jobRequestId) !== null && _c !== void 0 ? _c : null,
                        },
                        panelMembers: (result.panelMembers || []).map(function (m) {
                            return typeof m === "string" ? m : m.name || "";
                        }),
                        currentUserPanelId: (_d = result.currentUserPanelId) !== null && _d !== void 0 ? _d : 0,
                        questions: result.questions || [],
                        reviewerName: result.reviewerName || "",
                        jobTitleEn: result.jobTitleEn || "",
                        jobTitleFr: result.jobTitleFr || "",
                    });
                    scorecardArr = Array.isArray(result.scorecard)
                        ? result.scorecard
                        : result.scorecard
                            ? [result.scorecard]
                            : [];
                    setScoreData(scorecardArr);
                    if (!mapped[0].gpa && scorecardArr.length > 0) {
                        calculatedGPA_1 = calculateGPA(scorecardArr);
                        if (calculatedGPA_1) {
                            setReviewingCandidate(function (prev) {
                                return prev ? tslib_1.__assign(tslib_1.__assign({}, prev), { gpa: calculatedGPA_1 }) : prev;
                            });
                        }
                    }
                    setReviewLoading(false);
                    setScoreLoading(false);
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _e.sent();
                    console.error("[useReviewScorecard] loadCandidates error:", e_1);
                    setCandidates([]);
                    return [3 /*break*/, 6];
                case 5:
                    setCandidatesLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [CandidateId]);
    React.useEffect(function () {
        void loadCandidates();
    }, [loadCandidates]);
    var refreshCandidates = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadCandidates()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [loadCandidates]);
    var closeReview = React.useCallback(function () {
        setShowComments(false);
    }, []);
    var openComments = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, level1, level2, e_2;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!reviewingCandidate)
                        return [2 /*return*/];
                    setShowComments(true);
                    setCommentsLoading(true);
                    setLevel1Comments([]);
                    setLevel2Comments([]);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, ServiceExport_1.EvaluationserviceL2.fetchComments(reviewingCandidate.id)];
                case 2:
                    _a = _b.sent(), level1 = _a.level1, level2 = _a.level2;
                    setLevel1Comments(Array.isArray(level1) ? level1 : []);
                    setLevel2Comments(Array.isArray(level2) ? level2 : []);
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _b.sent();
                    console.error("[useReviewScorecard] openComments error:", e_2);
                    return [3 /*break*/, 5];
                case 4:
                    setCommentsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [reviewingCandidate]);
    return {
        // list
        candidates: candidates,
        candidatesLoading: candidatesLoading,
        drawerOpen: drawerOpen,
        loadCandidates: loadCandidates,
        refreshCandidates: refreshCandidates,
        // review modal
        reviewingCandidate: reviewingCandidate,
        reviewData: reviewData,
        scoreData: scoreData,
        closeReview: closeReview,
        showComments: showComments,
        setShowComments: setShowComments,
        level1Comments: level1Comments,
        level2Comments: level2Comments,
        commentsLoading: commentsLoading,
        openComments: openComments,
        scoreLoading: scoreLoading,
        reviewLoading: reviewLoading,
    };
}
exports.fetchCandidateValue = fetchCandidateValue;
//# sourceMappingURL=fetchCandidateValue.js.map