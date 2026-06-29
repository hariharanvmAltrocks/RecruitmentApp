"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var ReviewScoreCardProvider_1 = require("./ReviewScoreCardProvider");
var CandidateDrawer_1 = tslib_1.__importDefault(require("../Components/CandidateDrawer"));
var ReviewScoreCardContent = function () {
    var _a;
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentRoleId = ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) === null || _a === void 0 ? void 0 : _a[0]) || 0;
    var hook = (0, ReviewScoreCardProvider_1.useReviewScoreCardContext)();
    return (React.createElement("div", null,
        React.createElement(CandidateDrawer_1.default, { candidates: hook.paginatedCandidates, loading: hook.candidatesLoading, onClose: function () { }, onReview: hook.openReview, recruitmentId: hook.recruitmentId, hook: hook, currentRoleId: currentRoleId })));
};
var ReviewScoreCard = function (props) {
    var _a;
    var location = (0, react_router_dom_1.useLocation)();
    var locState = location.state;
    var recruitmentId = Number((locState === null || locState === void 0 ? void 0 : locState.ID) ||
        (locState === null || locState === void 0 ? void 0 : locState.recruitmentId) ||
        (locState === null || locState === void 0 ? void 0 : locState.RecruitmentID) ||
        (props === null || props === void 0 ? void 0 : props.ID) ||
        (props === null || props === void 0 ? void 0 : props.recruitmentId) ||
        (props === null || props === void 0 ? void 0 : props.RecruitmentID) ||
        0);
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentUserEmail = ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _a === void 0 ? void 0 : _a[0]) || "";
    return (React.createElement(ReviewScoreCardProvider_1.ReviewScoreCardProvider, { recruitmentId: recruitmentId, currentUserEmail: currentUserEmail },
        React.createElement(ReviewScoreCardContent, null)));
};
exports.default = ReviewScoreCard;
//# sourceMappingURL=ReviewScorecardState.js.map