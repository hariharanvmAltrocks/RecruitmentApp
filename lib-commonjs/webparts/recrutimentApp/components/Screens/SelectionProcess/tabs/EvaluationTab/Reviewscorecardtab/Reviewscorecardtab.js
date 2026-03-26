"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// ReviewScorecard/Reviewscorecardtab.tsx
// ── Thin orchestrator ──────────────────────────────────────────────────────────
// All state lives in useReviewScorecard hook.
// This file only wires props — no business logic here.
// ──────────────────────────────────────────────────────────────────────────────
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var Reviewscorecardtab_module_scss_1 = tslib_1.__importDefault(require("./Reviewscorecardtab.module.scss"));
var Joblisttable_1 = tslib_1.__importDefault(require("./components/Joblisttable"));
var UseReviewScorecard_1 = require("./hooks/UseReviewScorecard");
var RoleContext_1 = require("../../../../../../utilities/hooks/RoleContext");
var Candidatedrawer_1 = tslib_1.__importDefault(require("./components/Candidatedrawer"));
var Candidatereviewmodal_1 = tslib_1.__importDefault(require("./components/Candidatereviewmodal"));
var ReviewScorecardTab = function (_a) {
    var _b, _c;
    var CurrentUserEmailId = _a.CurrentUserEmailId, onFormStateChange = _a.onFormStateChange;
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var effectiveEmail = CurrentUserEmailId || ((_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0]) || "";
    var currentRoleId = ((_c = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) === null || _c === void 0 ? void 0 : _c[0]) || 0;
    var hook = (0, UseReviewScorecard_1.useReviewScorecard)(effectiveEmail);
    // Notify parent when modal opens/closes (hides sidebar)
    React.useEffect(function () {
        onFormStateChange === null || onFormStateChange === void 0 ? void 0 : onFormStateChange(!!hook.reviewingCandidate);
    }, [hook.reviewingCandidate, onFormStateChange]);
    return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.container },
        React.createElement(Joblisttable_1.default, { jobRows: hook.paginatedJobs, totalItems: hook.filteredJobs.length, currentPage: hook.currentPage, totalPages: hook.totalPages, pageSize: hook.pageSize, onPageChange: hook.setCurrentPage, onPageSizeChange: function (s) { hook.setPageSize(s); hook.setCurrentPage(1); }, searchTerm: hook.searchTerm, onSearch: function (v) { hook.setSearchTerm(v); hook.setCurrentPage(1); }, onSelectJob: hook.openJob, loading: hook.jobsLoading }),
        React.createElement(framer_motion_1.AnimatePresence, null, hook.drawerOpen && hook.selectedJob && (React.createElement(Candidatedrawer_1.default, { job: hook.selectedJob, candidates: hook.candidates, loading: hook.candidatesLoading, onClose: hook.closeJob, onReview: hook.openReview }))),
        React.createElement(framer_motion_1.AnimatePresence, null, hook.reviewingCandidate && (React.createElement(Candidatereviewmodal_1.default, { candidate: hook.reviewingCandidate, reviewData: hook.reviewData, reviewLoading: hook.reviewLoading, job: hook.selectedJob, scoreData: hook.scoreData, scoreLoading: hook.scoreLoading, showComments: hook.showComments, level1Comments: hook.level1Comments, level2Comments: hook.level2Comments, commentsLoading: hook.commentsLoading, onViewComments: hook.openComments, onCloseComments: function () { return hook.setShowComments(false); }, hodDecision: hook.hodDecision, decisionComment: hook.decisionComment, confirmed: hook.confirmed, selectedPositionId: hook.selectedPositionId, selectedPositionText: hook.selectedPositionText, positionOptions: hook.positionOptions, submitting: hook.submitting, submitError: hook.submitError, successMessage: hook.successMessage, errors: hook.errors, shouldShowPositionId: hook.shouldShowPositionId, onDecisionChange: hook.setHodDecision, onCommentChange: hook.setDecisionComment, onConfirmChange: hook.setConfirmed, onPositionChange: function (id, text) {
                hook.setSelectedPositionId(id);
                hook.setSelectedPositionText(text);
                hook.setErrors(tslib_1.__assign(tslib_1.__assign({}, hook.errors), { position: false }));
            }, onSubmit: hook.submitDecision, onClose: hook.closeReview, currentRoleId: currentRoleId, isLevel2Status: (0, UseReviewScorecard_1.isLevel2)(hook.reviewingCandidate.statusId) })))));
};
exports.default = ReviewScorecardTab;
//# sourceMappingURL=Reviewscorecardtab.js.map