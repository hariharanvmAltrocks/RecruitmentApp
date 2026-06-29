"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLevel2 = exports.canView = exports.canEdit = exports.VIEW_ONLY_STATUS_IDS = exports.EDITABLE_STATUS_IDS = void 0;
exports.useReviewScorecard = useReviewScorecard;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReviewScoreCardServices_1 = tslib_1.__importDefault(require("../ReviewScoreCardServies/ReviewScoreCardServices"));
var Config_1 = require("../../../../utilities/Config");
var useSubmitReviewScoreCard_1 = require("../Components/useSubmitReviewScoreCard");
exports.EDITABLE_STATUS_IDS = [121, 123, 127, 130, 165, 166];
exports.VIEW_ONLY_STATUS_IDS = [122, 15, 167, 168];
var canEdit = function (statusId) {
    return exports.EDITABLE_STATUS_IDS.includes(statusId);
};
exports.canEdit = canEdit;
var canView = function (statusId) {
    return exports.VIEW_ONLY_STATUS_IDS.includes(statusId);
};
exports.canView = canView;
var isLevel2 = function (statusId) { return statusId === 129; };
exports.isLevel2 = isLevel2;
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
// ── Main hook ─────────────────────────────────────────────────────────────────
function useReviewScorecard(recruitmentId, currentUserEmail, departmentFromRoute, isEvalution) {
    var _this = this;
    // ── Candidate list ────────────────────────────────────────────────────────
    var _a = React.useState([]), candidates = _a[0], setCandidates = _a[1];
    var _b = React.useState(true), candidatesLoading = _b[0], setCandidatesLoading = _b[1];
    var drawerOpen = React.useState(true)[0];
    var _c = React.useState(1), currentPage = _c[0], setCurrentPage = _c[1];
    var _d = React.useState(10), pageSize = _d[0], setPageSize = _d[1];
    var _e = React.useState(""), searchTerm = _e[0], setSearchTerm = _e[1];
    // ── Review modal ──────────────────────────────────────────────────────────
    var _f = React.useState(null), reviewingCandidate = _f[0], setReviewingCandidate = _f[1];
    var _g = React.useState(null), reviewData = _g[0], setReviewData = _g[1];
    var _h = React.useState(false), reviewLoading = _h[0], setReviewLoading = _h[1];
    var _j = React.useState([]), scoreData = _j[0], setScoreData = _j[1];
    var _k = React.useState(false), scoreLoading = _k[0], setScoreLoading = _k[1];
    var _l = React.useState([]), positionOptions = _l[0], setPositionOptions = _l[1];
    // ── Comments ──────────────────────────────────────────────────────────────
    var _m = React.useState(false), showComments = _m[0], setShowComments = _m[1];
    var _o = React.useState([]), level1Comments = _o[0], setLevel1Comments = _o[1];
    var _p = React.useState([]), level2Comments = _p[0], setLevel2Comments = _p[1];
    var _q = React.useState(false), commentsLoading = _q[0], setCommentsLoading = _q[1];
    // ── HOD decision form ─────────────────────────────────────────────────────
    var _r = React.useState(""), hodDecision = _r[0], setHodDecision = _r[1];
    var _s = React.useState(""), decisionComment = _s[0], setDecisionComment = _s[1];
    var _t = React.useState(false), confirmed = _t[0], setConfirmed = _t[1];
    var _u = React.useState(null), selectedPositionId = _u[0], setSelectedPositionId = _u[1];
    var _v = React.useState(""), selectedPositionText = _v[0], setSelectedPositionText = _v[1];
    // ── shouldShowPositionId helper ───────────────────────────────────────────
    var shouldShowPositionId = React.useCallback(function (statusId, decision) {
        if (statusId === Config_1.StatusId.Selected)
            return true;
        if (decision === "Yes" &&
            statusId !== Config_1.StatusId.pendingL2shorlistingwithHOD &&
            statusId !== Config_1.StatusId.CandidateOnHoldbyHODLevel1 &&
            statusId !== Config_1.StatusId.Selected)
            return true;
        return false;
    }, []);
    // ── Load / refresh candidates ─────────────────────────────────────────────
    var loadCandidates = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var list, mapped, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!recruitmentId)
                        return [2 /*return*/];
                    setCandidatesLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.getCandidatesByRecruitmentId(recruitmentId)];
                case 2:
                    list = _a.sent();
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
                    }); });
                    setCandidates(mapped);
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    console.error("[useReviewScorecard] loadCandidates error:", e_1);
                    setCandidates([]);
                    return [3 /*break*/, 5];
                case 4:
                    setCandidatesLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [recruitmentId]);
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
    // ── Filter + paginate ─────────────────────────────────────────────────────
    var filteredCandidates = React.useMemo(function () {
        return candidates.filter(function (c) {
            return searchTerm === "" ||
                Object.values(c).some(function (v) {
                    return String(v).toLowerCase().includes(searchTerm.toLowerCase());
                });
        });
    }, [candidates, searchTerm]);
    var totalPages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));
    var paginatedCandidates = React.useMemo(function () {
        var start = (currentPage - 1) * pageSize;
        return filteredCandidates.slice(start, start + pageSize);
    }, [filteredCandidates, currentPage, pageSize]);
    React.useEffect(function () {
        if (currentPage > totalPages)
            setCurrentPage(1);
    }, [totalPages, currentPage]);
    // ── closeReview ───────────────────────────────────────────────────────────
    var closeReview = React.useCallback(function () {
        setReviewingCandidate(null);
        setReviewData(null);
        setScoreData([]);
        setShowComments(false);
        setLevel1Comments([]);
        setLevel2Comments([]);
    }, []);
    // ── onSuccess callback → passed into submit hook ──────────────────────────
    var handleSubmitSuccess = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    closeReview();
                    return [4 /*yield*/, refreshCandidates()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [closeReview, refreshCandidates]);
    // ── 🔑 Delegate submit logic to standalone hook ───────────────────────────
    var submitHook = (0, useSubmitReviewScoreCard_1.useSubmitReviewScoreCard)({
        reviewingCandidate: reviewingCandidate,
        reviewData: reviewData,
        hodDecision: hodDecision,
        decisionComment: decisionComment,
        confirmed: confirmed,
        selectedPositionId: selectedPositionId,
        currentUserEmail: currentUserEmail,
        shouldShowPositionId: shouldShowPositionId,
        onSuccess: handleSubmitSuccess,
    });
    // ── openReview ────────────────────────────────────────────────────────────
    var openReview = React.useCallback(function (candidate) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var department, result, scorecardArr, calculatedGPA_1, hod, posId, sid, _shouldFetchPosition, e_2;
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    department = departmentFromRoute || candidate.department || "";
                    setReviewingCandidate(tslib_1.__assign(tslib_1.__assign({}, candidate), { department: department }));
                    setReviewData(null);
                    setScoreData([]);
                    setHodDecision("");
                    setDecisionComment("");
                    setConfirmed(false);
                    setSelectedPositionId(null);
                    setSelectedPositionText("");
                    setShowComments(false);
                    setLevel1Comments([]);
                    setLevel2Comments([]);
                    // ← Reset submit state whenever a fresh candidate opens
                    submitHook.resetSubmit();
                    setReviewLoading(true);
                    setScoreLoading(true);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.getReviewScoreCardData(candidate.id, currentUserEmail, tslib_1.__assign(tslib_1.__assign({}, candidate), { department: department }))];
                case 2:
                    result = _f.sent();
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
                    if (!candidate.gpa && scorecardArr.length > 0) {
                        calculatedGPA_1 = calculateGPA(scorecardArr);
                        if (calculatedGPA_1) {
                            setReviewingCandidate(function (prev) {
                                return prev ? tslib_1.__assign(tslib_1.__assign({}, prev), { gpa: calculatedGPA_1 }) : prev;
                            });
                        }
                    }
                    if (result.hodDecision) {
                        hod = result.hodDecision;
                        if (hod.Comments)
                            setDecisionComment(hod.Comments);
                        posId = ((_d = hod.PositionID) === null || _d === void 0 ? void 0 : _d.ID) || hod.PositionIDId || null;
                        if (posId) {
                            setSelectedPositionId(posId);
                            setSelectedPositionText(((_e = hod.PositionID) === null || _e === void 0 ? void 0 : _e.PositionID) || hod.PositionText || "");
                        }
                    }
                    sid = candidate.statusId;
                    if (sid === Config_1.StatusId.Selected) {
                        setHodDecision("Yes");
                    }
                    else if ([
                        Config_1.StatusId.OnHoldbyHOD,
                        Config_1.StatusId.CandidateOnHoldbyHODLevel1,
                        Config_1.StatusId.CandidateOnHoldbyHODLevel2,
                    ].includes(sid)) {
                        setHodDecision("On Hold");
                    }
                    else if ([
                        Config_1.StatusId.RejectedbyHOD,
                        Config_1.StatusId.CandidateRejectedbyHODLevel1,
                        Config_1.StatusId.CandidateRejectedbyHODLevel2,
                    ].includes(sid)) {
                        setHodDecision("No");
                    }
                    _shouldFetchPosition = function (s, dept) {
                        if (!dept)
                            return false;
                        var n = Number(s);
                        return (n === Number(Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD) ||
                            n === Number(Config_1.StatusId.PendingwithHODtoselectthecandidate) ||
                            n === Number(Config_1.StatusId.Selected) ||
                            n === Number(Config_1.StatusId.OnHoldbyHOD) ||
                            n === Number(Config_1.StatusId.CandidateOnHoldbyHODLevel2));
                    };
                    if (result.positionOptions && result.positionOptions.length > 0) {
                        setPositionOptions(result.positionOptions);
                    }
                    else if (_shouldFetchPosition(candidate.statusId, department) &&
                        candidate.jobCodeID &&
                        department) {
                        ReviewScoreCardServices_1.default.fetchPositionOptions(candidate.jobCodeID, department)
                            .then(function (opts) { return setPositionOptions(opts); })
                            .catch(function () { return setPositionOptions([]); });
                    }
                    else {
                        setPositionOptions([]);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _f.sent();
                    console.error("[useReviewScorecard] openReview error:", e_2);
                    return [3 /*break*/, 5];
                case 4:
                    setReviewLoading(false);
                    setScoreLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [currentUserEmail, departmentFromRoute, submitHook.resetSubmit]);
    // ── openComments ──────────────────────────────────────────────────────────
    var openComments = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, level1, level2, e_3;
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
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.fetchComments(reviewingCandidate.id)];
                case 2:
                    _a = _b.sent(), level1 = _a.level1, level2 = _a.level2;
                    setLevel1Comments(Array.isArray(level1) ? level1 : []);
                    setLevel2Comments(Array.isArray(level2) ? level2 : []);
                    return [3 /*break*/, 5];
                case 3:
                    e_3 = _b.sent();
                    console.error("[useReviewScorecard] openComments error:", e_3);
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
        filteredCandidates: filteredCandidates,
        paginatedCandidates: paginatedCandidates,
        currentPage: currentPage,
        setCurrentPage: setCurrentPage,
        pageSize: pageSize,
        setPageSize: setPageSize,
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        totalPages: totalPages,
        drawerOpen: drawerOpen,
        loadCandidates: loadCandidates,
        refreshCandidates: refreshCandidates,
        // review modal
        reviewingCandidate: reviewingCandidate,
        reviewData: reviewData,
        reviewLoading: reviewLoading,
        scoreData: scoreData,
        scoreLoading: scoreLoading,
        openReview: openReview,
        closeReview: closeReview,
        // comments
        showComments: showComments,
        setShowComments: setShowComments,
        level1Comments: level1Comments,
        level2Comments: level2Comments,
        commentsLoading: commentsLoading,
        openComments: openComments,
        // HOD form fields (controlled from this hook)
        hodDecision: hodDecision,
        setHodDecision: setHodDecision,
        decisionComment: decisionComment,
        setDecisionComment: setDecisionComment,
        confirmed: confirmed,
        setConfirmed: setConfirmed,
        selectedPositionId: selectedPositionId,
        setSelectedPositionId: setSelectedPositionId,
        selectedPositionText: selectedPositionText,
        setSelectedPositionText: setSelectedPositionText,
        positionOptions: positionOptions,
        submitting: submitHook.submitting,
        submitError: submitHook.submitError,
        successMessage: submitHook.successMessage,
        errors: submitHook.errors,
        setErrors: submitHook.setErrors,
        submitDecision: submitHook.submitDecision,
        shouldShowPositionId: shouldShowPositionId,
        isLevel2: exports.isLevel2,
    };
}
//# sourceMappingURL=useReviewScorecard.js.map