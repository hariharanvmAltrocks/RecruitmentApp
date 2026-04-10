"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var ReviewScoreCardProvider_1 = require("./State/ReviewScoreCardProvider");
var CandidateDrawer_1 = tslib_1.__importDefault(require("./Components/CandidateDrawer"));
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var ReviewScoreCardContent = function () {
    var _a;
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentRoleId = ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) === null || _a === void 0 ? void 0 : _a[0]) || 0;
    var hook = (0, ReviewScoreCardProvider_1.useReviewScoreCardContext)();
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, hook.drawerOpen && (react_1.default.createElement(CandidateDrawer_1.default, { candidates: hook.paginatedCandidates, loading: hook.candidatesLoading, onClose: function () { }, onReview: hook.openReview, recruitmentId: hook.recruitmentId, hook: hook, currentRoleId: currentRoleId })))));
};
var ReviewScoreCard = function (_a) {
    var _b, _c, _d;
    var recruitmentId = _a.recruitmentId;
    var location = (0, react_router_dom_1.useLocation)();
    var routeState = location.state;
    var effectiveRecruitmentId = Number((_c = (_b = recruitmentId !== null && recruitmentId !== void 0 ? recruitmentId : routeState === null || routeState === void 0 ? void 0 : routeState.recruitmentId) !== null && _b !== void 0 ? _b : routeState === null || routeState === void 0 ? void 0 : routeState.ID) !== null && _c !== void 0 ? _c : 0);
    var departmentFromRoute = (routeState === null || routeState === void 0 ? void 0 : routeState.department) || "";
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentUserEmail = ((_d = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _d === void 0 ? void 0 : _d[0]) || "";
    return (react_1.default.createElement(ReviewScoreCardProvider_1.ReviewScoreCardProvider, { recruitmentId: effectiveRecruitmentId, currentUserEmail: currentUserEmail, department: departmentFromRoute },
        react_1.default.createElement(ReviewScoreCardContent, null)));
};
exports.default = ReviewScoreCard;
//# sourceMappingURL=ReviewScoreCard.js.map