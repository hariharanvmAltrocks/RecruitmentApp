"use strict";
// State/ReviewScoreCardProvider.tsx
// submitDeps object context-இல் expose பண்ணப்படுகிறது.
// CandidateReviewModal → HODDecisionPanel → SubmitReviewScoreCard இந்த chain-க்கு தேவை.
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
    var recruitmentId = _a.recruitmentId, currentUserEmail = _a.currentUserEmail, department = _a.department, children = _a.children;
    var hook = (0, useReviewScorecard_1.useReviewScorecard)(recruitmentId, currentUserEmail, department);
    var submitDeps = {
        reviewingCandidate: hook.reviewingCandidate,
        reviewData: hook.reviewData,
        hodDecision: hook.hodDecision,
        decisionComment: hook.decisionComment,
        confirmed: hook.confirmed,
        selectedPositionId: hook.selectedPositionId,
        currentUserEmail: currentUserEmail,
        shouldShowPositionId: hook.shouldShowPositionId,
        onSuccess: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hook.closeReview();
                        return [4 /*yield*/, hook.refreshCandidates()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    };
    var value = {
        recruitmentId: recruitmentId,
        currentUserEmail: currentUserEmail,
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
        submitDeps: submitDeps,
    };
    return (React.createElement(ReviewScoreCardContext.Provider, { value: value }, children));
};
exports.ReviewScoreCardProvider = ReviewScoreCardProvider;
//# sourceMappingURL=ReviewScoreCardProvider.js.map