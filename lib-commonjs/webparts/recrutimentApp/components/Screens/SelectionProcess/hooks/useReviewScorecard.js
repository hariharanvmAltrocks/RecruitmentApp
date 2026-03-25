"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReviewScorecard = useReviewScorecard;
var tslib_1 = require("tslib");
var react_1 = require("react");
var EvaluationApiService_1 = require("../services/EvaluationApiService");
function useReviewScorecard(roleIDs, employeeList, hodEmail, onFormOpen) {
    var _this = this;
    var _a = (0, react_1.useState)([]), jobs = _a[0], setJobs = _a[1];
    var _b = (0, react_1.useState)(true), jobsLoading = _b[0], setJobsLoading = _b[1];
    var _c = (0, react_1.useState)(false), drawerOpen = _c[0], setDrawerOpen = _c[1];
    var _d = (0, react_1.useState)(null), selectedJob = _d[0], setSelectedJob = _d[1];
    var _e = (0, react_1.useState)([]), candidates = _e[0], setCandidates = _e[1];
    var _f = (0, react_1.useState)(false), candidatesLoading = _f[0], setCandidatesLoading = _f[1];
    var _g = (0, react_1.useState)(null), selectedCandidate = _g[0], setSelectedCandidate = _g[1];
    var _h = (0, react_1.useState)(false), modalOpen = _h[0], setModalOpen = _h[1];
    var _j = (0, react_1.useState)(""), alertMsg = _j[0], setAlertMsg = _j[1];
    var _k = (0, react_1.useState)(""), alertType = _k[0], setAlertType = _k[1];
    (0, react_1.useEffect)(function () {
        if (!hodEmail || !roleIDs.length) {
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
                        return [4 /*yield*/, EvaluationApiService_1.hodReviewService.fetchReviewScorecardJobs(hodEmail)];
                    case 1:
                        result = _a.sent();
                        if (!cancelled) {
                            setJobs(result);
                            setJobsLoading(false);
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            cancelled = true;
        };
    }, [hodEmail, roleIDs]);
    var openDrawer = (0, react_1.useCallback)(function (job) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedJob(job);
                    setDrawerOpen(true);
                    setCandidatesLoading(true);
                    return [4 /*yield*/, EvaluationApiService_1.hodReviewService.fetchCandidatesForJob(job.recruitmentID, job.jobCodeID, employeeList)];
                case 1:
                    result = _a.sent();
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
    var openCandidateModal = (0, react_1.useCallback)(function (candidate) {
        setSelectedCandidate(candidate);
        setModalOpen(true);
        onFormOpen === null || onFormOpen === void 0 ? void 0 : onFormOpen(true);
    }, [onFormOpen]);
    var closeCandidateModal = (0, react_1.useCallback)(function () {
        setModalOpen(false);
        setSelectedCandidate(null);
        onFormOpen === null || onFormOpen === void 0 ? void 0 : onFormOpen(false);
    }, [onFormOpen]);
    var setAlert = (0, react_1.useCallback)(function (message, type) {
        setAlertMsg(message);
        setAlertType(type);
    }, []);
    var submitHodDecision = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, EvaluationApiService_1.hodReviewService.submitHodDecision(payload)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, []);
    return {
        jobs: jobs,
        jobsLoading: jobsLoading,
        drawerOpen: drawerOpen,
        selectedJob: selectedJob,
        candidates: candidates,
        candidatesLoading: candidatesLoading,
        selectedCandidate: selectedCandidate,
        modalOpen: modalOpen,
        alertMsg: alertMsg,
        alertType: alertType,
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
        openCandidateModal: openCandidateModal,
        closeCandidateModal: closeCandidateModal,
        setAlert: setAlert,
        submitHodDecision: submitHodDecision,
    };
}
//# sourceMappingURL=useReviewScorecard.js.map