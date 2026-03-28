"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var ReviewScorecardState_1 = require("./State/ReviewScorecardState");
var CandidateDrawer_1 = tslib_1.__importDefault(require("./Components/CandidateDrawer"));
var QuestionnaireTab_1 = tslib_1.__importDefault(require("./Components/QuestionnaireTab"));
var ScorecardDetails_1 = tslib_1.__importDefault(require("./Components/ScorecardDetails"));
var HODDecisionPanel_1 = tslib_1.__importDefault(require("./Components/HODDecisionPanel"));
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("./ReviewScorecard.module.scss"));
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var ReviewScoreCardContent = function (_a) {
    var _b, _c;
    var candidateId = _a.candidateId, isOpen = _a.isOpen, onClose = _a.onClose;
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var currentUserEmail = (_c = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : '';
    console.log('ReviewScoreCard props:', { candidateId: candidateId, isOpen: isOpen });
    var _d = (0, ReviewScorecardState_1.useReviewScoreCard)(), state = _d.state, loadReviewScoreCardData = _d.loadReviewScoreCardData;
    console.log('ReviewScoreCard state:', state);
    (0, react_1.useEffect)(function () {
        if (isOpen && candidateId && currentUserEmail) {
            console.log('Loading review scorecard data for:', candidateId, currentUserEmail);
            loadReviewScoreCardData(candidateId, currentUserEmail);
        }
    }, [isOpen, candidateId, currentUserEmail, loadReviewScoreCardData]);
    if (!isOpen)
        return null;
    return (react_1.default.createElement(CandidateDrawer_1.default, { isOpen: isOpen, onClose: onClose, candidateData: state.data, loading: state.loading, error: state.error }, state.data && (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.tabsContainer },
        react_1.default.createElement(QuestionnaireTab_1.default, { questions: state.data.questions }),
        react_1.default.createElement(ScorecardDetails_1.default, { scorecard: state.data.scorecard, level2Scorecard: state.data.level2Scorecard, interviewLevel: state.data.interviewLevel }),
        react_1.default.createElement(HODDecisionPanel_1.default, { hodDecision: state.data.hodDecision })))));
};
var ReviewScoreCard = function (props) {
    console.log('ReviewScoreCard component rendered with props:', props);
    return (react_1.default.createElement(ReviewScorecardState_1.ReviewScoreCardProvider, null,
        react_1.default.createElement(ReviewScoreCardContent, tslib_1.__assign({}, props))));
};
exports.default = ReviewScoreCard;
//# sourceMappingURL=ReviewScoreCard.js.map