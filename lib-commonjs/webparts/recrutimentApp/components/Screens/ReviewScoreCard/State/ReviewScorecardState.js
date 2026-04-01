"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var ReviewScoreCardProvider_1 = require("./ReviewScoreCardProvider");
var CandidateDrawer_1 = tslib_1.__importDefault(require("../Components/CandidateDrawer"));
var CandidateReviewModal_1 = tslib_1.__importDefault(require("../Components/CandidateReviewModal"));
var ReviewScoreCardContent = function () {
    var _a;
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentRoleId = ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) === null || _a === void 0 ? void 0 : _a[0]) || 0;
    var hook = (0, ReviewScoreCardProvider_1.useReviewScoreCardContext)();
    return (React.createElement("div", null,
        React.createElement(CandidateDrawer_1.default, { candidates: hook.paginatedCandidates, loading: hook.candidatesLoading, onClose: function () { }, onReview: hook.openReview, recruitmentId: hook.recruitmentId }),
        React.createElement(framer_motion_1.AnimatePresence, null, hook.reviewingCandidate && (React.createElement(CandidateReviewModal_1.default, { candidate: hook.reviewingCandidate, reviewData: hook.reviewData, reviewLoading: hook.reviewLoading, job: null, scoreData: hook.scoreData, scoreLoading: hook.scoreLoading, showComments: hook.showComments, level1Comments: hook.level1Comments, level2Comments: hook.level2Comments, commentsLoading: hook.commentsLoading, onViewComments: hook.openComments, onCloseComments: function () { return hook.setShowComments(false); }, hodDecision: hook.hodDecision, decisionComment: hook.decisionComment, confirmed: hook.confirmed, selectedPositionId: hook.selectedPositionId, selectedPositionText: hook.selectedPositionText, positionOptions: hook.positionOptions, submitting: hook.submitting, submitError: hook.submitError, successMessage: hook.successMessage, errors: hook.errors, shouldShowPositionId: hook.shouldShowPositionId, onDecisionChange: hook.setHodDecision, onCommentChange: hook.setDecisionComment, onConfirmChange: hook.setConfirmed, onPositionChange: function (id, text) {
                hook.setSelectedPositionId(id);
                hook.setSelectedPositionText(text);
                hook.setErrors(tslib_1.__assign(tslib_1.__assign({}, hook.errors), { position: false }));
            }, onSubmit: hook.submitDecision, onClose: hook.closeReview, currentRoleId: currentRoleId, isLevel2Status: hook.isLevel2(hook.reviewingCandidate.statusId) })))));
};
var ReviewScoreCard = function (props) {
    var _a;
    var location = (0, react_router_dom_1.useLocation)();
    // ID comes from location.state (navigated via navigate('/ReviewScoreCard', { state: { ID: 636 } }))
    // OR from props directly
    var locState = location.state;
    var recruitmentId = Number((locState === null || locState === void 0 ? void 0 : locState.ID) ||
        (locState === null || locState === void 0 ? void 0 : locState.recruitmentId) ||
        (locState === null || locState === void 0 ? void 0 : locState.RecruitmentID) ||
        (props === null || props === void 0 ? void 0 : props.ID) ||
        (props === null || props === void 0 ? void 0 : props.recruitmentId) ||
        (props === null || props === void 0 ? void 0 : props.RecruitmentID) ||
        0);
    console.log('[ReviewScoreCard] recruitmentId resolved:', recruitmentId, 'from state:', locState, 'props:', props);
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentUserEmail = ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _a === void 0 ? void 0 : _a[0]) || '';
    return (React.createElement(ReviewScoreCardProvider_1.ReviewScoreCardProvider, { recruitmentId: recruitmentId, currentUserEmail: currentUserEmail },
        React.createElement(ReviewScoreCardContent, null)));
};
exports.default = ReviewScoreCard;
//# sourceMappingURL=ReviewScorecardState.js.map