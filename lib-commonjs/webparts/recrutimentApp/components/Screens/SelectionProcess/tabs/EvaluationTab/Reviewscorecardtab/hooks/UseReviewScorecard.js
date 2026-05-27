"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReviewScorecard = exports.isLevel2 = exports.canView = exports.canEdit = exports.VIEW_ONLY_STATUS_IDS = exports.EDITABLE_STATUS_IDS = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var EvaluationApiService_1 = require("../../../../services/EvaluationApiService");
exports.EDITABLE_STATUS_IDS = [
    121,
    123,
    127,
    130,
    165,
    166,
];
exports.VIEW_ONLY_STATUS_IDS = [
    122,
    15,
    167,
    168,
];
var canEdit = function (statusId) { return exports.EDITABLE_STATUS_IDS.includes(statusId); };
exports.canEdit = canEdit;
var canView = function (statusId) { return exports.VIEW_ONLY_STATUS_IDS.includes(statusId); };
exports.canView = canView;
var isLevel2 = function (statusId) {
    return [130, 129, 127, 166].includes(statusId);
};
exports.isLevel2 = isLevel2;
function useReviewScorecard(currentUserEmail) {
    var _this = this;
    var _a = React.useState([]), jobRows = _a[0], setJobRows = _a[1];
    var _b = React.useState(true), jobsLoading = _b[0], setJobsLoading = _b[1];
    var _c = React.useState(1), currentPage = _c[0], setCurrentPage = _c[1];
    var _d = React.useState(5), pageSize = _d[0], setPageSize = _d[1];
    var _e = React.useState(""), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = React.useState(null), selectedJob = _f[0], setSelectedJob = _f[1];
    var _g = React.useState([]), candidates = _g[0], setCandidates = _g[1];
    var _h = React.useState(false), candidatesLoading = _h[0], setCandidatesLoading = _h[1];
    var _j = React.useState(false), drawerOpen = _j[0], setDrawerOpen = _j[1];
    var _k = React.useState(null), reviewingCandidate = _k[0], setReviewingCandidate = _k[1];
    var _l = React.useState(null), reviewData = _l[0], setReviewData = _l[1];
    var _m = React.useState(false), reviewLoading = _m[0], setReviewLoading = _m[1];
    var _o = React.useState([]), scoreData = _o[0], setScoreData = _o[1];
    var _p = React.useState(false), scoreLoading = _p[0], setScoreLoading = _p[1];
    var _q = React.useState([]), positionOptions = _q[0], setPositionOptions = _q[1];
    var _r = React.useState(false), showComments = _r[0], setShowComments = _r[1];
    var _s = React.useState([]), level1Comments = _s[0], setLevel1Comments = _s[1];
    var _t = React.useState([]), level2Comments = _t[0], setLevel2Comments = _t[1];
    var _u = React.useState(false), commentsLoading = _u[0], setCommentsLoading = _u[1];
    var _v = React.useState(""), hodDecision = _v[0], setHodDecision = _v[1];
    var _w = React.useState(""), decisionComment = _w[0], setDecisionComment = _w[1];
    var _x = React.useState(false), confirmed = _x[0], setConfirmed = _x[1];
    var _y = React.useState(null), selectedPositionId = _y[0], setSelectedPositionId = _y[1];
    var _z = React.useState(""), selectedPositionText = _z[0], setSelectedPositionText = _z[1];
    var _0 = React.useState(false), submitting = _0[0], setSubmitting = _0[1];
    var _1 = React.useState(""), submitError = _1[0], setSubmitError = _1[1];
    var _2 = React.useState(""), successMessage = _2[0], setSuccessMessage = _2[1];
    var _3 = React.useState({
        decision: false,
        comment: false,
        checkbox: false,
        position: false,
    }), errors = _3[0], setErrors = _3[1];
    var loadJobs = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setJobsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchScorecardJobList(currentUserEmail)];
                case 2:
                    data = _a.sent();
                    setJobRows(data);
                    return [3 /*break*/, 4];
                case 3:
                    setJobsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [currentUserEmail]);
    React.useEffect(function () { void loadJobs(); }, [loadJobs]);
    var filteredJobs = React.useMemo(function () {
        return jobRows.filter(function (job) {
            return searchTerm === "" ||
                Object.values(job).some(function (v) { return String(v).toLowerCase().includes(searchTerm.toLowerCase()); });
        });
    }, [jobRows, searchTerm]);
    var totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
    var paginatedJobs = React.useMemo(function () {
        var start = (currentPage - 1) * pageSize;
        return filteredJobs.slice(start, start + pageSize);
    }, [filteredJobs, currentPage, pageSize]);
    React.useEffect(function () {
        if (currentPage > totalPages)
            setCurrentPage(1);
    }, [totalPages, currentPage]);
    var openJob = React.useCallback(function (job) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var raw, _a, grade_1, level_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setSelectedJob(job);
                    setDrawerOpen(true);
                    setCandidatesLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchScorecardCandidates(job.recruitmentID, job.jobCodeID)];
                case 2:
                    raw = _b.sent();
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getGradeAndLevel(job.recruitmentID)];
                case 3:
                    _a = _b.sent(), grade_1 = _a.grade, level_1 = _a.level;
                    setCandidates(raw.map(function (c) { return (tslib_1.__assign(tslib_1.__assign({}, c), { grade: c.grade || grade_1, interviewLevel: c.interviewLevel || level_1 })); }));
                    return [3 /*break*/, 5];
                case 4:
                    setCandidatesLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    var closeJob = React.useCallback(function () {
        setDrawerOpen(false);
        setSelectedJob(null);
        setCandidates([]);
    }, []);
    var refreshCandidates = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var raw, _a, grade_2, level_2;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!selectedJob)
                        return [2 /*return*/];
                    setCandidatesLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchScorecardCandidates(selectedJob.recruitmentID, selectedJob.jobCodeID)];
                case 2:
                    raw = _b.sent();
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getGradeAndLevel(selectedJob.recruitmentID)];
                case 3:
                    _a = _b.sent(), grade_2 = _a.grade, level_2 = _a.level;
                    setCandidates(raw.map(function (c) { return (tslib_1.__assign(tslib_1.__assign({}, c), { grade: c.grade || grade_2, interviewLevel: c.interviewLevel || level_2 })); }));
                    return [3 /*break*/, 5];
                case 4:
                    setCandidatesLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [selectedJob]);
    var openReview = React.useCallback(function (candidate) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, evalResult, scoreResult, existing, sid, _1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setReviewingCandidate(candidate);
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
                    setReviewLoading(true);
                    setScoreLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 7, 8]);
                    return [4 /*yield*/, Promise.all([
                            EvaluationApiService_1.evaluationService.getEvaluationFormData(candidate.id, candidate.recruitmentID, currentUserEmail),
                            EvaluationApiService_1.evaluationService.fetchScoreData(candidate.id),
                        ])];
                case 2:
                    _a = _b.sent(), evalResult = _a[0], scoreResult = _a[1];
                    setReviewData({
                        candidateData: evalResult.candidateData || {},
                        panelMembers: evalResult.panelMembers || [],
                        questions: evalResult.questions || [],
                        reviewerName: evalResult.reviewerName || "",
                        jobTitleEn: evalResult.jobTitleEn || "",
                        jobTitleFr: evalResult.jobTitleFr || "",
                    });
                    setScoreData(scoreResult || []);
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchExistingHODDecision(candidate.id, 0, (0, exports.isLevel2)(candidate.statusId))];
                case 4:
                    existing = _b.sent();
                    if (existing === null || existing === void 0 ? void 0 : existing.comments)
                        setDecisionComment(existing.comments);
                    if (existing === null || existing === void 0 ? void 0 : existing.positionId) {
                        setSelectedPositionId(existing.positionId);
                        setSelectedPositionText(existing.positionText || "");
                    }
                    sid = candidate.statusId;
                    if ([122, 130, 165].includes(sid))
                        setHodDecision("Yes");
                    else if ([123, 166].includes(sid))
                        setHodDecision("On Hold");
                    else if ([15, 167, 168].includes(sid))
                        setHodDecision("No");
                    return [3 /*break*/, 6];
                case 5:
                    _1 = _b.sent();
                    return [3 /*break*/, 6];
                case 6:
                    if ((selectedJob === null || selectedJob === void 0 ? void 0 : selectedJob.jobCodeID) && (selectedJob === null || selectedJob === void 0 ? void 0 : selectedJob.department)) {
                        EvaluationApiService_1.evaluationService.fetchPositionOptions(selectedJob.jobCodeID, selectedJob.department)
                            .then(setPositionOptions).catch(function () { return setPositionOptions([]); });
                    }
                    return [3 /*break*/, 8];
                case 7:
                    setReviewLoading(false);
                    setScoreLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [currentUserEmail, selectedJob]);
    var closeReview = React.useCallback(function () {
        setReviewingCandidate(null);
        setReviewData(null);
        setScoreData([]);
        setShowComments(false);
    }, []);
    var openComments = React.useCallback(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, level1, level2;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!reviewingCandidate)
                        return [2 /*return*/];
                    setShowComments(true);
                    setCommentsLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchComments(reviewingCandidate.id)];
                case 2:
                    _a = _b.sent(), level1 = _a.level1, level2 = _a.level2;
                    setLevel1Comments(level1);
                    setLevel2Comments(level2);
                    return [3 /*break*/, 4];
                case 3:
                    setCommentsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [reviewingCandidate]);
    var shouldShowPositionId = React.useCallback(function (statusId, decision) {
        if (statusId === 130)
            return true;
        if (statusId === 122)
            return true;
        if (decision === "Yes" && statusId !== 127 && statusId !== 165)
            return true;
        return false;
    }, []);
    var validate = React.useCallback(function (statusId, decision) {
        var newErrors = {
            decision: !decision,
            comment: !decisionComment.trim(),
            checkbox: !confirmed,
            position: decision === "Yes" && shouldShowPositionId(statusId, decision) && !selectedPositionId,
        };
        setErrors(newErrors);
        if (newErrors.decision)
            setSubmitError("Please select a decision.");
        else if (Object.values(newErrors).some(Boolean))
            setSubmitError("Please fill in all required fields.");
        return Object.values(newErrors).every(function (v) { return !v; });
    }, [decisionComment, confirmed, selectedPositionId, shouldShowPositionId]);
    var submitDecision = React.useCallback(function (roleId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, msg;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!reviewingCandidate)
                        return [2 /*return*/];
                    setSubmitError("");
                    if (!validate(reviewingCandidate.statusId, hodDecision))
                        return [2 /*return*/];
                    setSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.updateCandidateStatusFull({
                            candidateId: reviewingCandidate.id,
                            hodDecision: hodDecision,
                            comments: decisionComment,
                            currentUserEmail: currentUserEmail,
                            currentRoleId: roleId,
                            gpa: reviewingCandidate.gpa || "",
                            positionId: selectedPositionId,
                            isLevel2: false,
                            jobCodeID: reviewingCandidate.jobCodeID || (selectedJob === null || selectedJob === void 0 ? void 0 : selectedJob.jobCodeID) || 0,
                            recruitmentID: reviewingCandidate.recruitmentID,
                            statusId: reviewingCandidate.statusId,
                        })];
                case 2:
                    result = _a.sent();
                    if (!result.success) {
                        setSubmitError(result.message || "Submission failed.");
                        setSubmitting(false);
                        return [2 /*return*/];
                    }
                    msg = hodDecision === "Yes" ? "✓ Candidate SELECTED successfully" :
                        hodDecision === "No" ? "✓ Candidate REJECTED successfully" :
                            "✓ Candidate put ON HOLD successfully";
                    setSuccessMessage(msg);
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
    }); }, [reviewingCandidate, hodDecision, decisionComment, currentUserEmail,
        selectedPositionId, selectedJob, validate, closeReview, refreshCandidates]);
    return {
        jobRows: jobRows,
        jobsLoading: jobsLoading,
        paginatedJobs: paginatedJobs,
        filteredJobs: filteredJobs,
        currentPage: currentPage,
        setCurrentPage: setCurrentPage,
        pageSize: pageSize,
        setPageSize: setPageSize,
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        totalPages: totalPages,
        loadJobs: loadJobs,
        selectedJob: selectedJob,
        candidates: candidates,
        candidatesLoading: candidatesLoading,
        drawerOpen: drawerOpen,
        openJob: openJob,
        closeJob: closeJob,
        refreshCandidates: refreshCandidates,
        reviewingCandidate: reviewingCandidate,
        reviewData: reviewData,
        reviewLoading: reviewLoading,
        scoreData: scoreData,
        scoreLoading: scoreLoading,
        openReview: openReview,
        closeReview: closeReview,
        showComments: showComments,
        level1Comments: level1Comments,
        level2Comments: level2Comments,
        commentsLoading: commentsLoading,
        openComments: openComments,
        setShowComments: setShowComments,
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
exports.useReviewScorecard = useReviewScorecard;
//# sourceMappingURL=UseReviewScorecard.js.map