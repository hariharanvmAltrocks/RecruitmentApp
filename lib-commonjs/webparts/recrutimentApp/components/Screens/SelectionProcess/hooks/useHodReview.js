"use strict";
// useHodReview.ts  — DEBUG VERSION
// Full console logging at every step to trace "No jobs found" issue.
// ✅ Remove all console.group / console.log lines once data is confirmed working.
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReviewScorecard = useReviewScorecard;
exports.useHodReview = useHodReview;
var tslib_1 = require("tslib");
var react_1 = require("react");
var EvaluationApiService_1 = require("../services/EvaluationApiService");
var EvaluationConfig_1 = require("../config/EvaluationConfig");
var Config_1 = require("../../../../utilities/Config");
var HOD_ACTION = {
    select: EvaluationConfig_1.WorkflowAction.Approved, // 1
    reject: EvaluationConfig_1.WorkflowAction.Reject, // 2
    hold: EvaluationConfig_1.WorkflowAction.OnHold, // 10
};
var HOD_WORKFLOW = {
    select: EvaluationConfig_1.workflowStatusApi.CandidateSelectedIPanel, // "WS06"
    reject: EvaluationConfig_1.workflowStatusApi.CandidateRejectedIPanel, // "WS08"
    hold: EvaluationConfig_1.workflowStatusApi.CandidateOnHoldIPanel, // "WS07"
};
var HOD_MSG = {
    select: EvaluationConfig_1.HodMessages.CandidateSelected,
    reject: EvaluationConfig_1.HodMessages.CandidateRejected,
    hold: EvaluationConfig_1.HodMessages.CandidateOnHold,
};
var ON_HOLD_IDS = [
    Config_1.StatusId.OnHoldbyHOD, // 123
    Config_1.StatusId.CandidateOnHoldbyHODLevel1, // 165
    Config_1.StatusId.CandidateOnHoldbyHODLevel2, // 166
];
var REJECTED_IDS = [
    Config_1.StatusId.RejectedbyHOD, // 15
    Config_1.StatusId.CandidateRejectedbyHODLevel1, // 167
    Config_1.StatusId.CandidateRejectedbyHODLevel2, // 168
];
var LEVEL2_IDS = [
    Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2, // 127
    Config_1.StatusId.CandidateOnHoldbyHODLevel2, // 166
];
function resolveDecision(statusId) {
    if (statusId === Config_1.StatusId.Selected)
        return "select"; // 122
    if (ON_HOLD_IDS.includes(statusId))
        return "hold";
    if (REJECTED_IDS.includes(statusId))
        return "reject";
    return null;
}
// =============================================================================
//  useReviewScorecard — with full debug logging
// =============================================================================
function useReviewScorecard(roleIDs, employeeList, hodEmail, onFormOpen) {
    var _this = this;
    var _a = (0, react_1.useState)([]), jobs = _a[0], setJobs = _a[1];
    var _b = (0, react_1.useState)(true), jobsLoading = _b[0], setJobsLoading = _b[1];
    var _c = (0, react_1.useState)(false), drawerOpen = _c[0], setDrawerOpen = _c[1];
    var _d = (0, react_1.useState)(null), selectedJob = _d[0], setSelectedJob = _d[1];
    var _e = (0, react_1.useState)([]), candidates = _e[0], setCandidates = _e[1];
    var _f = (0, react_1.useState)(false), candidatesLoading = _f[0], setCandidatesLoading = _f[1];
    var _g = (0, react_1.useState)(false), modalOpen = _g[0], setModalOpen = _g[1];
    var _h = (0, react_1.useState)(null), selectedCandidate = _h[0], setSelectedCandidate = _h[1];
    var _j = (0, react_1.useState)(null), decision = _j[0], setDecisionState = _j[1];
    var _k = (0, react_1.useState)(""), comments = _k[0], setCommentsState = _k[1];
    var _l = (0, react_1.useState)(false), commentsError = _l[0], setCommentsError = _l[1];
    var _m = (0, react_1.useState)(false), decisionError = _m[0], setDecisionError = _m[1];
    var _o = (0, react_1.useState)(false), submitting = _o[0], setSubmitting = _o[1];
    var _p = (0, react_1.useState)(""), alertMsg = _p[0], setAlertMsg = _p[1];
    var _q = (0, react_1.useState)(""), alertType = _q[0], setAlertType = _q[1];
    // ── Load jobs ────────────────────────────────────────────────────────────────
    (0, react_1.useEffect)(function () {
        var _a, _b;
        // ─────────────────────────────────────────────────────────────────────────
        // DEBUG BLOCK 1 — Check hodEmail received from ADGroupData
        // Open Browser DevTools → Console to see these logs
        // ─────────────────────────────────────────────────────────────────────────
        console.group("🔍 [ReviewScorecard] useEffect - hodEmail check");
        console.log("hodEmail value   :", hodEmail);
        console.log("hodEmail type    :", typeof hodEmail);
        console.log("hodEmail length  :", (_a = hodEmail === null || hodEmail === void 0 ? void 0 : hodEmail.length) !== null && _a !== void 0 ? _a : 0);
        console.log("hodEmail empty?  :", !hodEmail);
        console.log("roleIDs          :", roleIDs);
        console.log("employeeList len :", (_b = employeeList === null || employeeList === void 0 ? void 0 : employeeList.length) !== null && _b !== void 0 ? _b : 0);
        console.groupEnd();
        // ─────────────────────────────────────────────────────────────────────────
        if (!hodEmail) {
            console.warn("⚠️ [ReviewScorecard] hodEmail is EMPTY — fetch skipped.\n" +
                "   Fix: Check ADGroupData?.EmailId?.[0] in ReviewScorecardTab.tsx\n" +
                "   The RoleContext must return an EmailId array with the HOD email.");
            setJobs([]);
            setJobsLoading(false);
            return;
        }
        var cancelled = false;
        (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setJobsLoading(true);
                        // ───────────────────────────────────────────────────────────────────────
                        // DEBUG BLOCK 2 — SP query being sent
                        // ───────────────────────────────────────────────────────────────────────
                        console.group("📡 [ReviewScorecard] Calling fetchReviewScorecardJobs");
                        console.log("List    : HRMSRecruitmentDptDetails");
                        console.log("Filter  : StatusId = 28 (RecruitmentInProgress)");
                        console.log("Filter  : HOD =", hodEmail);
                        console.log("⚠️  Make sure the HOD column in HRMSRecruitmentDptDetails stores EMAIL, not a name/ID");
                        console.groupEnd();
                        return [4 /*yield*/, EvaluationApiService_1.hodReviewService.fetchReviewScorecardJobs(hodEmail)];
                    case 1:
                        result = _a.sent();
                        // ───────────────────────────────────────────────────────────────────────
                        // DEBUG BLOCK 3 — SP response
                        // ───────────────────────────────────────────────────────────────────────
                        console.group("📦 [ReviewScorecard] fetchReviewScorecardJobs result");
                        console.log("Jobs count :", result.length);
                        if (result.length === 0) {
                            console.warn("❌ ZERO jobs returned. Check these:");
                            console.warn("   REASON 1 → HOD column value in SP does NOT match email:", hodEmail);
                            console.warn("              Open HRMSRecruitmentDptDetails in SP and check the HOD column value for a known record");
                            console.warn("   REASON 2 → No records have StatusId = 28 for this HOD");
                            console.warn("              Try removing the StatusId filter temporarily to confirm records exist");
                            console.warn("   REASON 3 → ADGroupData.EmailId[0] is undefined/null");
                            console.warn("              Log ADGroupData from useRoleContext() in the component");
                        }
                        else {
                            console.log("✅ Jobs returned:");
                            console.table(result.map(function (j) { return ({
                                id: j.id,
                                jobCode: j.jobCode,
                                jobTitle: j.jobTitle,
                                statusId: j.statusId,
                                status: j.status,
                                nationality: j.nationality,
                                businessUnitCode: j.businessUnitCode,
                            }); }));
                        }
                        console.groupEnd();
                        // ───────────────────────────────────────────────────────────────────────
                        if (!cancelled) {
                            setJobs(result);
                            setJobsLoading(false);
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
        return function () { cancelled = true; };
    }, [hodEmail]);
    // ── Open candidate drawer ────────────────────────────────────────────────────
    var openDrawer = (0, react_1.useCallback)(function (job) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setSelectedJob(job);
                    setDrawerOpen(true);
                    setCandidatesLoading(true);
                    // ─────────────────────────────────────────────────────────────────────────
                    // DEBUG BLOCK 4 — Candidate fetch params
                    // ─────────────────────────────────────────────────────────────────────────
                    console.group("📡 [ReviewScorecard] Calling fetchCandidatesForJob");
                    console.log("recruitmentID (job.id) :", job.id);
                    console.log("jobCodeId              :", (_a = job.jobCodeId) !== null && _a !== void 0 ? _a : 0);
                    console.log("employeeList length    :", (_b = employeeList === null || employeeList === void 0 ? void 0 : employeeList.length) !== null && _b !== void 0 ? _b : 0);
                    console.log("Filter StatusId IN     : [121,122,123,15,130,127,165,166,167,168]");
                    console.log("Filter ItemCreated     : No");
                    console.groupEnd();
                    return [4 /*yield*/, EvaluationApiService_1.hodReviewService.fetchCandidatesForJob(job.id, (_c = job.jobCodeId) !== null && _c !== void 0 ? _c : 0, employeeList)];
                case 1:
                    result = _d.sent();
                    // ─────────────────────────────────────────────────────────────────────────
                    // DEBUG BLOCK 5 — Candidates result
                    // ─────────────────────────────────────────────────────────────────────────
                    console.group("📦 [ReviewScorecard] fetchCandidatesForJob result");
                    console.log("Candidates count :", result.length);
                    if (result.length === 0) {
                        console.warn("❌ ZERO candidates returned. Check these:");
                        console.warn("   REASON 1 → All candidates for this job have ItemCreated = 'Yes' (already processed)");
                        console.warn("   REASON 2 → No candidates have HOD-relevant StatusId");
                        console.warn("   REASON 3 → jobCodeId mismatch — job.jobCodeId was:", job.jobCodeId);
                    }
                    else {
                        console.table(result.map(function (c) { return ({
                            id: c.id,
                            name: c.applicantName,
                            statusId: c.statusId,
                            status: c.status,
                            recruitmentID: c.recruitmentID,
                            gpa: c.gpa,
                            grade: c.grade,
                        }); }));
                    }
                    console.groupEnd();
                    // ─────────────────────────────────────────────────────────────────────────
                    setCandidates(result);
                    setCandidatesLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [employeeList]);
    var closeDrawer = (0, react_1.useCallback)(function () {
        setDrawerOpen(false);
        setSelectedJob(null);
        setCandidates([]);
    }, []);
    var openModal = (0, react_1.useCallback)(function (candidate) {
        setSelectedCandidate(candidate);
        setDecisionState(resolveDecision(candidate.statusId));
        setCommentsState("");
        setCommentsError(false);
        setDecisionError(false);
        setAlertMsg("");
        setAlertType("");
        setModalOpen(true);
        onFormOpen === null || onFormOpen === void 0 ? void 0 : onFormOpen(true);
    }, [onFormOpen]);
    var closeModal = (0, react_1.useCallback)(function () {
        setModalOpen(false);
        setSelectedCandidate(null);
        onFormOpen === null || onFormOpen === void 0 ? void 0 : onFormOpen(false);
    }, [onFormOpen]);
    var handleSetDecision = (0, react_1.useCallback)(function (d) {
        setDecisionState(d);
        setDecisionError(false);
    }, []);
    var handleSetComments = (0, react_1.useCallback)(function (v) {
        setCommentsState(v);
        if (v.trim())
            setCommentsError(false);
    }, []);
    var handleHodSubmit = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var isLevel2, gpa, jobRequestID, result;
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!decision) {
                        setDecisionError(true);
                        return [2 /*return*/];
                    }
                    if (!comments.trim()) {
                        setCommentsError(true);
                        return [2 /*return*/];
                    }
                    if (!selectedCandidate)
                        return [2 /*return*/];
                    setSubmitting(true);
                    isLevel2 = LEVEL2_IDS.includes(selectedCandidate.statusId);
                    gpa = (_a = selectedCandidate.gpaRaw) !== null && _a !== void 0 ? _a : selectedCandidate.gpa;
                    jobRequestID = (_b = selectedCandidate.jobRequestID) !== null && _b !== void 0 ? _b : "";
                    // ─────────────────────────────────────────────────────────────────────────
                    // DEBUG BLOCK 6 — Submit payload
                    // ─────────────────────────────────────────────────────────────────────────
                    console.group("📤 [ReviewScorecard] submitHodDecision payload");
                    console.log("candidateId    :", selectedCandidate.id);
                    console.log("decision       :", decision);
                    console.log("actionId       :", HOD_ACTION[decision]);
                    console.log("workflowStatus :", HOD_WORKFLOW[decision]);
                    console.log("isLevel2       :", isLevel2);
                    console.log("gpa            :", gpa);
                    console.log("jobRequestID   :", jobRequestID);
                    console.groupEnd();
                    return [4 /*yield*/, EvaluationApiService_1.hodReviewService.submitHodDecision({
                            candidateId: selectedCandidate.id,
                            actionId: HOD_ACTION[decision],
                            comments: comments,
                            isLevel2: isLevel2,
                            jobRequestID: jobRequestID,
                            gpa: gpa,
                            workflowStatus: HOD_WORKFLOW[decision],
                            othersInterviewed: "No",
                        })];
                case 1:
                    result = _c.sent();
                    console.log("📬 [ReviewScorecard] submitHodDecision result:", result);
                    setSubmitting(false);
                    if (result.success) {
                        setAlertMsg(HOD_MSG[decision]);
                        setAlertType("success");
                        setTimeout(function () {
                            closeModal();
                            if (selectedJob)
                                openDrawer(selectedJob);
                        }, 1600);
                    }
                    else {
                        setAlertMsg(result.message);
                        setAlertType("error");
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [decision, comments, selectedCandidate, selectedJob, closeModal, openDrawer]);
    return {
        jobs: jobs,
        jobsLoading: jobsLoading,
        drawerOpen: drawerOpen,
        selectedJob: selectedJob,
        candidates: candidates,
        candidatesLoading: candidatesLoading,
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
        modalOpen: modalOpen,
        selectedCandidate: selectedCandidate,
        openModal: openModal,
        closeModal: closeModal,
        decision: decision,
        handleSetDecision: handleSetDecision,
        comments: comments,
        handleSetComments: handleSetComments,
        commentsError: commentsError,
        decisionError: decisionError,
        submitting: submitting,
        alertMsg: alertMsg,
        alertType: alertType,
        hideAlert: function () { setAlertMsg(""); setAlertType(""); },
        handleHodSubmit: handleHodSubmit,
    };
}
// =============================================================================
//  useHodReview — standalone candidate view
// =============================================================================
function useHodReview(candidateId, employeeList, onBack) {
    var _this = this;
    var _a = (0, react_1.useState)(null), decision = _a[0], setDecisionState = _a[1];
    var _b = (0, react_1.useState)(""), comments = _b[0], setCommentsState = _b[1];
    var _c = (0, react_1.useState)(false), commentsError = _c[0], setCommentsError = _c[1];
    var _d = (0, react_1.useState)(false), decisionError = _d[0], setDecisionError = _d[1];
    var _e = (0, react_1.useState)(false), submitting = _e[0], setSubmitting = _e[1];
    var _f = (0, react_1.useState)(""), alertMsg = _f[0], setAlertMsg = _f[1];
    var _g = (0, react_1.useState)(""), alertType = _g[0], setAlertType = _g[1];
    var _h = (0, react_1.useState)(0), statusId = _h[0], setStatusId = _h[1];
    var _j = (0, react_1.useState)(""), jobRequestID = _j[0], setJobRequestID = _j[1];
    var _k = (0, react_1.useState)(""), gpa = _k[0], setGpa = _k[1];
    var loadFromCandidate = (0, react_1.useCallback)(function (candidate) {
        var _a, _b;
        console.group("🔍 [useHodReview] loadFromCandidate");
        console.log("candidateId  :", candidate.id);
        console.log("statusId     :", candidate.statusId);
        console.log("gpa          :", candidate.gpa);
        console.log("jobRequestID :", candidate.jobRequestID);
        console.groupEnd();
        var st = candidate.statusId;
        setStatusId(st);
        setJobRequestID((_a = candidate.jobRequestID) !== null && _a !== void 0 ? _a : "");
        setGpa((_b = candidate.gpaRaw) !== null && _b !== void 0 ? _b : candidate.gpa);
        setDecisionState(resolveDecision(st));
        setCommentsState("");
        setCommentsError(false);
        setDecisionError(false);
        setAlertMsg("");
        setAlertType("");
    }, []);
    var handleSetDecision = (0, react_1.useCallback)(function (d) {
        setDecisionState(d);
        setDecisionError(false);
    }, []);
    var handleSetComments = (0, react_1.useCallback)(function (v) {
        setCommentsState(v);
        if (v.trim())
            setCommentsError(false);
    }, []);
    var handleSubmit = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!decision) {
                        setDecisionError(true);
                        return [2 /*return*/];
                    }
                    if (!comments.trim()) {
                        setCommentsError(true);
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    return [4 /*yield*/, EvaluationApiService_1.hodReviewService.submitHodDecision({
                            candidateId: candidateId,
                            actionId: HOD_ACTION[decision],
                            comments: comments,
                            isLevel2: LEVEL2_IDS.includes(statusId),
                            jobRequestID: jobRequestID,
                            gpa: gpa,
                            workflowStatus: HOD_WORKFLOW[decision],
                            othersInterviewed: "No",
                        })];
                case 1:
                    result = _a.sent();
                    setSubmitting(false);
                    if (result.success) {
                        setAlertMsg(HOD_MSG[decision]);
                        setAlertType("success");
                        setTimeout(onBack, 1600);
                    }
                    else {
                        setAlertMsg(result.message);
                        setAlertType("error");
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [decision, comments, statusId, candidateId, jobRequestID, gpa, onBack]);
    return {
        decision: decision,
        handleSetDecision: handleSetDecision,
        comments: comments,
        handleSetComments: handleSetComments,
        commentsError: commentsError,
        decisionError: decisionError,
        submitting: submitting,
        alertMsg: alertMsg,
        alertType: alertType,
        loadFromCandidate: loadFromCandidate,
        handleSubmit: handleSubmit,
        hideAlert: function () { setAlertMsg(""); setAlertType(""); },
    };
}
//# sourceMappingURL=useHodReview.js.map