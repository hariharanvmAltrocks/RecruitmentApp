"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLevel2 = exports.canView = exports.canEdit = exports.VIEW_ONLY_STATUS_IDS = exports.EDITABLE_STATUS_IDS = void 0;
exports.useReviewScorecard = useReviewScorecard;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReviewScoreCardServices_1 = tslib_1.__importDefault(require("../ReviewScoreCardServies/ReviewScoreCardServices"));
var Config_1 = require("../../../../utilities/Config");
exports.EDITABLE_STATUS_IDS = [121, 123, 127, 130, 165, 166];
exports.VIEW_ONLY_STATUS_IDS = [122, 15, 167, 168];
var canEdit = function (statusId) { return exports.EDITABLE_STATUS_IDS.includes(statusId); };
exports.canEdit = canEdit;
var canView = function (statusId) { return exports.VIEW_ONLY_STATUS_IDS.includes(statusId); };
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
        var combined = sumOverall + sumQuestion, maxPossible = maxOverall + maxQuestion;
        if (maxPossible <= 0)
            return "";
        return String(Math.floor((combined / maxPossible) * 5 * 100) / 100);
    }
    catch (e) {
        console.warn("[calculateGPA]", e);
        return "";
    }
}
function useReviewScorecard(recruitmentId, currentUserEmail, departmentFromRoute) {
    var _this = this;
    var _a = React.useState([]), candidates = _a[0], setCandidates = _a[1];
    var _b = React.useState(true), candidatesLoading = _b[0], setCandidatesLoading = _b[1];
    var _c = React.useState(true), drawerOpen = _c[0], setDrawerOpen = _c[1];
    var _d = React.useState(1), currentPage = _d[0], setCurrentPage = _d[1];
    var _e = React.useState(10), pageSize = _e[0], setPageSize = _e[1];
    var _f = React.useState(""), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = React.useState(null), reviewingCandidate = _g[0], setReviewingCandidate = _g[1];
    var _h = React.useState(null), reviewData = _h[0], setReviewData = _h[1];
    var _j = React.useState(false), reviewLoading = _j[0], setReviewLoading = _j[1];
    var _k = React.useState([]), scoreData = _k[0], setScoreData = _k[1];
    var _l = React.useState(false), scoreLoading = _l[0], setScoreLoading = _l[1];
    var _m = React.useState([]), positionOptions = _m[0], setPositionOptions = _m[1];
    var _o = React.useState(false), showComments = _o[0], setShowComments = _o[1];
    var _p = React.useState([]), level1Comments = _p[0], setLevel1Comments = _p[1];
    var _q = React.useState([]), level2Comments = _q[0], setLevel2Comments = _q[1];
    var _r = React.useState(false), commentsLoading = _r[0], setCommentsLoading = _r[1];
    var _s = React.useState(""), hodDecision = _s[0], setHodDecision = _s[1];
    var _t = React.useState(""), decisionComment = _t[0], setDecisionComment = _t[1];
    var _u = React.useState(false), confirmed = _u[0], setConfirmed = _u[1];
    var _v = React.useState(null), selectedPositionId = _v[0], setSelectedPositionId = _v[1];
    var _w = React.useState(""), selectedPositionText = _w[0], setSelectedPositionText = _w[1];
    var _x = React.useState(false), submitting = _x[0], setSubmitting = _x[1];
    var _y = React.useState(""), submitError = _y[0], setSubmitError = _y[1];
    var _z = React.useState(""), successMessage = _z[0], setSuccessMessage = _z[1];
    var _0 = React.useState({
        decision: false, comment: false, checkbox: false, position: false,
    }), errors = _0[0], setErrors = _0[1];
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
    React.useEffect(function () { void loadCandidates(); }, [loadCandidates]);
    var filteredCandidates = React.useMemo(function () {
        return candidates.filter(function (c) {
            return searchTerm === "" ||
                Object.values(c).some(function (v) { return String(v).toLowerCase().includes(searchTerm.toLowerCase()); });
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
    var openReview = React.useCallback(function (candidate) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var department, result, scorecardArr, calculatedGPA_1, hod, posId, sid, _shouldFetchPosition, e_2;
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    department = departmentFromRoute || candidate.department || '';
                    setReviewingCandidate(tslib_1.__assign(tslib_1.__assign({}, candidate), { department: department }));
                    setReviewData(null);
                    setScoreData([]);
                    setHodDecision("");
                    setDecisionComment("");
                    setConfirmed(false);
                    setSelectedPositionId(null);
                    setSelectedPositionText("");
                    setSubmitError("");
                    setSuccessMessage("");
                    setErrors({ decision: false, comment: false, checkbox: false, position: false });
                    setShowComments(false);
                    setLevel1Comments([]);
                    setLevel2Comments([]);
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
                        : result.scorecard ? [result.scorecard] : [];
                    setScoreData(scorecardArr);
                    if (!candidate.gpa && scorecardArr.length > 0) {
                        calculatedGPA_1 = calculateGPA(scorecardArr);
                        if (calculatedGPA_1) {
                            setCandidates(function (prev) { return prev.map(function (c) { return c.id === candidate.id ? tslib_1.__assign(tslib_1.__assign({}, c), { gpa: calculatedGPA_1 }) : c; }); });
                            setReviewingCandidate(function (prev) { return prev ? tslib_1.__assign(tslib_1.__assign({}, prev), { gpa: calculatedGPA_1 }) : prev; });
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
                        var sid = Number(s);
                        if (!dept) {
                            return false;
                        }
                        var shouldFetch = sid === Number(Config_1.StatusId.PendingwithHODtoAssignPositionID) ||
                            sid === Number(Config_1.StatusId.PendingwithHODtoselectthecandidate) ||
                            sid === Number(Config_1.StatusId.Selected) ||
                            sid === Number(Config_1.StatusId.OnHoldbyHOD) ||
                            sid === Number(Config_1.StatusId.CandidateOnHoldbyHODLevel2);
                        return shouldFetch;
                    };
                    if (result.positionOptions && result.positionOptions.length > 0) {
                        setPositionOptions(result.positionOptions);
                    }
                    else if (_shouldFetchPosition(candidate.statusId, department) && candidate.jobCodeID && department) {
                        ReviewScoreCardServices_1.default
                            .fetchPositionOptions(candidate.jobCodeID, department)
                            .then(function (options) { return setPositionOptions(options); })
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
    }); }, [currentUserEmail]);
    var closeReview = React.useCallback(function () {
        setReviewingCandidate(null);
        setReviewData(null);
        setScoreData([]);
        setShowComments(false);
        setLevel1Comments([]);
        setLevel2Comments([]);
    }, []);
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
                    setLevel1Comments([]);
                    setLevel2Comments([]);
                    return [3 /*break*/, 5];
                case 4:
                    setCommentsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [reviewingCandidate]);
    var shouldShowPositionId = React.useCallback(function (statusId, decision) {
        if (statusId === Config_1.StatusId.Selected)
            return true;
        if (decision === "Yes" &&
            statusId !== Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2 &&
            statusId !== Config_1.StatusId.CandidateOnHoldbyHODLevel1 &&
            statusId !== Config_1.StatusId.Selected)
            return true;
        return false;
    }, []);
    var validate = React.useCallback(function (statusId, decision) {
        var lv2 = (0, exports.isLevel2)(statusId);
        var newErrors = {
            decision: lv2 ? false : !decision,
            comment: !decisionComment.trim(),
            checkbox: !confirmed,
            position: !lv2 &&
                decision === "Yes" &&
                shouldShowPositionId(statusId, decision) &&
                !selectedPositionId,
        };
        setErrors(newErrors);
        if (!lv2 && newErrors.decision) {
            setSubmitError("Please select a decision.");
        }
        else if (Object.values(newErrors).some(Boolean)) {
            setSubmitError("Please fill in all required fields.");
        }
        return Object.values(newErrors).every(function (v) { return !v; });
    }, [decisionComment, confirmed, selectedPositionId, shouldShowPositionId]);
    var submitDecision = React.useCallback(function (roleId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var jobRequestId, result;
        var _this = this;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!reviewingCandidate)
                        return [2 /*return*/];
                    setSubmitError("");
                    if (!validate(reviewingCandidate.statusId, hodDecision))
                        return [2 /*return*/];
                    setSubmitting(true);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, , 3, 4]);
                    jobRequestId = (_b = (_a = reviewData === null || reviewData === void 0 ? void 0 : reviewData.candidateData) === null || _a === void 0 ? void 0 : _a.jobRequestId) !== null && _b !== void 0 ? _b : null;
                    console.log('Submitting decision for candidateId:', reviewData);
                    console.log('Submitting HOD Decision with jobRequestId:', jobRequestId);
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.submitHODDecision({
                            candidateId: reviewingCandidate.id,
                            hodDecision: hodDecision,
                            comments: decisionComment,
                            currentUserEmail: currentUserEmail,
                            currentRoleId: roleId,
                            gpa: reviewingCandidate.gpa || "",
                            positionId: selectedPositionId,
                            isLevel2: (0, exports.isLevel2)(reviewingCandidate.statusId),
                            jobCodeID: reviewingCandidate.jobCodeID || 0,
                            recruitmentID: reviewingCandidate.recruitmentID,
                            statusId: reviewingCandidate.statusId,
                            scoreCardId: (_d = (_c = reviewData === null || reviewData === void 0 ? void 0 : reviewData.candidateData) === null || _c === void 0 ? void 0 : _c.level2ScorecardId) !== null && _d !== void 0 ? _d : null,
                            jobRequestId: jobRequestId,
                        })];
                case 2:
                    result = _e.sent();
                    if (!result.success) {
                        setSubmitError(result.message || "Submission failed.");
                        setSubmitting(false);
                        return [2 /*return*/];
                    }
                    setSuccessMessage(result.message);
                    setTimeout(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setSuccessMessage("");
                                    closeReview();
                                    return [4 /*yield*/, refreshCandidates()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 1200);
                    return [3 /*break*/, 4];
                case 3:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [
        reviewingCandidate, hodDecision, decisionComment,
        currentUserEmail, selectedPositionId, reviewData,
        validate, closeReview, refreshCandidates,
    ]);
    return {
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
        reviewingCandidate: reviewingCandidate,
        reviewData: reviewData,
        reviewLoading: reviewLoading,
        scoreData: scoreData,
        scoreLoading: scoreLoading,
        openReview: openReview,
        closeReview: closeReview,
        showComments: showComments,
        setShowComments: setShowComments,
        level1Comments: level1Comments,
        level2Comments: level2Comments,
        commentsLoading: commentsLoading,
        openComments: openComments,
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
        submitting: submitting,
        submitError: submitError,
        successMessage: successMessage,
        errors: errors,
        setErrors: setErrors,
        shouldShowPositionId: shouldShowPositionId,
        submitDecision: submitDecision,
        isLevel2: exports.isLevel2,
    };
}
//# sourceMappingURL=useReviewScorecard.js.map