"use strict";
// ReviewScoreCard.tsx
// Main entry point. Route passes recruitmentId via props or router state.
// Renders:
//   1. CandidateDrawer  — always visible, shows candidates for recruitmentId
//   2. CandidateReviewModal — opens when a candidate is clicked (pencil/eye)
//
// All state lives in ReviewScoreCardProvider (via useReviewScorecard hook).
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var ReviewScoreCardProvider_1 = require("./State/ReviewScoreCardProvider");
var CandidateDrawer_1 = tslib_1.__importDefault(require("./Components/CandidateDrawer"));
var CandidateReviewModal_1 = tslib_1.__importDefault(require("./Components/CandidateReviewModal"));
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
// ── Inner content (has access to context) ─────────────────────────────────────
var ReviewScoreCardContent = function () {
    var _a;
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentRoleId = ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) === null || _a === void 0 ? void 0 : _a[0]) || 0;
    var hook = (0, ReviewScoreCardProvider_1.useReviewScoreCardContext)();
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, hook.drawerOpen && (react_1.default.createElement(CandidateDrawer_1.default, { candidates: hook.paginatedCandidates, loading: hook.candidatesLoading, onClose: function () { }, onReview: hook.openReview, recruitmentId: hook.recruitmentId }))),
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, hook.reviewingCandidate && (react_1.default.createElement(CandidateReviewModal_1.default, { candidate: hook.reviewingCandidate, reviewData: hook.reviewData, reviewLoading: hook.reviewLoading, scoreData: hook.scoreData, scoreLoading: hook.scoreLoading, showComments: hook.showComments, level1Comments: hook.level1Comments, level2Comments: hook.level2Comments, commentsLoading: hook.commentsLoading, onViewComments: hook.openComments, onCloseComments: function () { return hook.setShowComments(false); }, hodDecision: hook.hodDecision, decisionComment: hook.decisionComment, confirmed: hook.confirmed, selectedPositionId: hook.selectedPositionId, selectedPositionText: hook.selectedPositionText, positionOptions: hook.positionOptions, submitting: hook.submitting, submitError: hook.submitError, successMessage: hook.successMessage, errors: hook.errors, shouldShowPositionId: hook.shouldShowPositionId, onDecisionChange: hook.setHodDecision, onCommentChange: hook.setDecisionComment, onConfirmChange: hook.setConfirmed, onPositionChange: function (id, text) {
                hook.setSelectedPositionId(id);
                hook.setSelectedPositionText(text);
                hook.setErrors(tslib_1.__assign(tslib_1.__assign({}, hook.errors), { position: false }));
            }, onSubmit: hook.submitDecision, onClose: hook.closeReview, currentRoleId: currentRoleId, isLevel2Status: hook.isLevel2(hook.reviewingCandidate.statusId) })))));
};
// ── Public export with Provider wrapper ───────────────────────────────────────
var ReviewScoreCard = function (_a) {
    var _b, _c, _d;
    var recruitmentId = _a.recruitmentId;
    var location = (0, react_router_dom_1.useLocation)();
    var routeState = location.state;
    var effectiveRecruitmentId = Number((_c = (_b = recruitmentId !== null && recruitmentId !== void 0 ? recruitmentId : routeState === null || routeState === void 0 ? void 0 : routeState.recruitmentId) !== null && _b !== void 0 ? _b : routeState === null || routeState === void 0 ? void 0 : routeState.ID) !== null && _c !== void 0 ? _c : 0);
    console.log('[ReviewScoreCard] recruitmentId:', effectiveRecruitmentId, 'routeState:', routeState);
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentUserEmail = ((_d = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _d === void 0 ? void 0 : _d[0]) || '';
    if (!effectiveRecruitmentId) {
        return (react_1.default.createElement("div", { style: { padding: 24, textAlign: 'center', color: '#dc2626', fontSize: '0.9rem' } }, "Recruitment ID is missing. Please open Review Score Card via the recruitment row action or provide a valid ID in route state."));
    }
    return (react_1.default.createElement(ReviewScoreCardProvider_1.ReviewScoreCardProvider, { recruitmentId: effectiveRecruitmentId, currentUserEmail: currentUserEmail },
        react_1.default.createElement(ReviewScoreCardContent, null)));
};
exports.default = ReviewScoreCard;
//# sourceMappingURL=ReviewScoreCard.js.map