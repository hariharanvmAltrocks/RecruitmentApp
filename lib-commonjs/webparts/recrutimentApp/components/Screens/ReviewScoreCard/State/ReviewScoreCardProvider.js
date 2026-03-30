"use strict";
// State/ReviewScoreCardProvider.tsx
// Context provider — wraps useReviewScorecard hook,
// exposes everything to child components via context.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewScoreCardProvider = exports.useReviewScoreCardContext = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var useReviewScorecard_1 = require("../Hooks/useReviewScorecard");
var ReviewScoreCardContext = React.createContext(null);
var useReviewScoreCardContext = function () {
    var ctx = React.useContext(ReviewScoreCardContext);
    if (!ctx)
        throw new Error('useReviewScoreCardContext must be used within ReviewScoreCardProvider');
    return ctx;
};
exports.useReviewScoreCardContext = useReviewScoreCardContext;
var ReviewScoreCardProvider = function (_a) {
    var recruitmentId = _a.recruitmentId, currentUserEmail = _a.currentUserEmail, children = _a.children;
    var hook = (0, useReviewScorecard_1.useReviewScorecard)(recruitmentId, currentUserEmail);
    var value = {
        recruitmentId: recruitmentId,
        candidates: hook.candidates,
        candidatesLoading: hook.candidatesLoading,
        paginatedCandidates: hook.paginatedCandidates,
        filteredCandidates: hook.filteredCandidates,
        currentPage: hook.currentPage,
        setCurrentPage: hook.setCurrentPage,
        pageSize: hook.pageSize,
        setPageSize: hook.setPageSize,
        searchTerm: hook.searchTerm,
        setSearchTerm: hook.setSearchTerm,
        totalPages: hook.totalPages,
        loadCandidates: hook.loadCandidates,
        drawerOpen: hook.drawerOpen,
        refreshCandidates: hook.refreshCandidates,
        reviewingCandidate: hook.reviewingCandidate,
        reviewData: hook.reviewData,
        reviewLoading: hook.reviewLoading,
        scoreData: hook.scoreData,
        scoreLoading: hook.scoreLoading,
        openReview: hook.openReview,
        closeReview: hook.closeReview,
        showComments: hook.showComments,
        level1Comments: hook.level1Comments,
        level2Comments: hook.level2Comments,
        commentsLoading: hook.commentsLoading,
        openComments: hook.openComments,
        setShowComments: hook.setShowComments,
        hodDecision: hook.hodDecision,
        setHodDecision: hook.setHodDecision,
        decisionComment: hook.decisionComment,
        setDecisionComment: hook.setDecisionComment,
        confirmed: hook.confirmed,
        setConfirmed: hook.setConfirmed,
        selectedPositionId: hook.selectedPositionId,
        setSelectedPositionId: hook.setSelectedPositionId,
        selectedPositionText: hook.selectedPositionText,
        setSelectedPositionText: hook.setSelectedPositionText,
        positionOptions: hook.positionOptions,
        submitting: hook.submitting,
        submitError: hook.submitError,
        successMessage: hook.successMessage,
        errors: hook.errors,
        setErrors: hook.setErrors,
        shouldShowPositionId: hook.shouldShowPositionId,
        submitDecision: hook.submitDecision,
        isLevel2: hook.isLevel2,
    };
    return (React.createElement(ReviewScoreCardContext.Provider, { value: value }, children));
};
exports.ReviewScoreCardProvider = ReviewScoreCardProvider;
//# sourceMappingURL=ReviewScoreCardProvider.js.map