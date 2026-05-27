"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppState = void 0;
var react_1 = require("react");
function useAppState() {
    var _a = (0, react_1.useState)('hod-review'), activeMetric = _a[0], setActiveMetric = _a[1];
    var _b = (0, react_1.useState)('dashboard'), view = _b[0], setView = _b[1];
    var _c = (0, react_1.useState)(null), selectedJob = _c[0], setSelectedJob = _c[1];
    var _d = (0, react_1.useState)(null), selectedApplicant = _d[0], setSelectedApplicant = _d[1];
    var _e = (0, react_1.useState)('Review Advert'), activeTab = _e[0], setActiveTab = _e[1];
    var _f = (0, react_1.useState)(false), isDrawerOpen = _f[0], setIsDrawerOpen = _f[1];
    var _g = (0, react_1.useState)('EN'), advertLang = _g[0], setAdvertLang = _g[1];
    var _h = (0, react_1.useState)(false), isAcknowledged = _h[0], setIsAcknowledged = _h[1];
    var _j = (0, react_1.useState)(false), showEvaluationAlert = _j[0], setShowEvaluationAlert = _j[1];
    var _k = (0, react_1.useState)(''), alertInterviewDate = _k[0], setAlertInterviewDate = _k[1];
    var _l = (0, react_1.useState)(false), isSelectionDrawerOpen = _l[0], setIsSelectionDrawerOpen = _l[1];
    var _m = (0, react_1.useState)(null), selectedJobForSelection = _m[0], setSelectedJobForSelection = _m[1];
    var _o = (0, react_1.useState)(null), selectedCandidateId = _o[0], setSelectedCandidateId = _o[1];
    var _p = (0, react_1.useState)(null), reviewingCandidate = _p[0], setReviewingCandidate = _p[1];
    var _q = (0, react_1.useState)(null), selectionDecision = _q[0], setSelectionDecision = _q[1];
    var _r = (0, react_1.useState)(''), selectionComments = _r[0], setSelectionComments = _r[1];
    var openReviewDrawer = function (job) {
        setSelectedJob(job);
        setIsDrawerOpen(true);
        setIsAcknowledged(false);
    };
    var closeReviewDrawer = function () { return setIsDrawerOpen(false); };
    var openSelectionDrawer = function (job) {
        setSelectedJobForSelection(job);
        setIsSelectionDrawerOpen(true);
        setSelectedCandidateId(null);
        setReviewingCandidate(null);
        setSelectionDecision(null);
        setSelectionComments('');
    };
    var closeSelectionDrawer = function () { return setIsSelectionDrawerOpen(false); };
    return {
        activeMetric: activeMetric,
        setActiveMetric: setActiveMetric,
        view: view,
        setView: setView,
        selectedJob: selectedJob,
        setSelectedJob: setSelectedJob,
        selectedApplicant: selectedApplicant,
        setSelectedApplicant: setSelectedApplicant,
        activeTab: activeTab,
        setActiveTab: setActiveTab,
        isDrawerOpen: isDrawerOpen,
        openReviewDrawer: openReviewDrawer,
        closeReviewDrawer: closeReviewDrawer,
        advertLang: advertLang,
        setAdvertLang: setAdvertLang,
        isAcknowledged: isAcknowledged,
        setIsAcknowledged: setIsAcknowledged,
        showEvaluationAlert: showEvaluationAlert,
        setShowEvaluationAlert: setShowEvaluationAlert,
        alertInterviewDate: alertInterviewDate,
        setAlertInterviewDate: setAlertInterviewDate,
        isSelectionDrawerOpen: isSelectionDrawerOpen,
        openSelectionDrawer: openSelectionDrawer,
        closeSelectionDrawer: closeSelectionDrawer,
        selectedJobForSelection: selectedJobForSelection,
        selectedCandidateId: selectedCandidateId,
        setSelectedCandidateId: setSelectedCandidateId,
        reviewingCandidate: reviewingCandidate,
        setReviewingCandidate: setReviewingCandidate,
        selectionDecision: selectionDecision,
        setSelectionDecision: setSelectionDecision,
        selectionComments: selectionComments,
        setSelectionComments: setSelectionComments,
    };
}
exports.useAppState = useAppState;
//# sourceMappingURL=useAppState.js.map