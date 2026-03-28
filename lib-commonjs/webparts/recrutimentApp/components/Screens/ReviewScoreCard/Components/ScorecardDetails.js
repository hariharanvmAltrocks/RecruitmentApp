"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var ScorecardDetails = function (_a) {
    var scorecard = _a.scorecard, level2Scorecard = _a.level2Scorecard, interviewLevel = _a.interviewLevel;
    var isLevel2 = (interviewLevel === null || interviewLevel === void 0 ? void 0 : interviewLevel.toLowerCase().includes('level 2')) || interviewLevel === '2';
    var currentScorecard = isLevel2 ? level2Scorecard : scorecard;
    if (!currentScorecard) {
        return (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scorecardSection },
            react_1.default.createElement("h3", null, isLevel2 ? 'Level 2 Scorecard' : 'Level 1 Scorecard'),
            react_1.default.createElement("p", null, "No scorecard data available.")));
    }
    return (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scorecardSection },
        react_1.default.createElement("h3", null, isLevel2 ? 'Level 2 Scorecard' : 'Level 1 Scorecard'),
        react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scorecardGrid },
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Qualifications:"),
                react_1.default.createElement("span", null, currentScorecard.RelevantQualification || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Experience:"),
                react_1.default.createElement("span", null, currentScorecard.ReleventExperience || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Knowledge:"),
                react_1.default.createElement("span", null, currentScorecard.Knowledge || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Energy Level:"),
                react_1.default.createElement("span", null, currentScorecard.EnergyLevel || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Job Requirements:"),
                react_1.default.createElement("span", null, currentScorecard.MeetJobRequirement || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Culture Fit:"),
                react_1.default.createElement("span", null, currentScorecard.ContributeTowardsCultureRequried || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Expat/Local:"),
                react_1.default.createElement("span", null, currentScorecard.Experience || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Other Criteria:"),
                react_1.default.createElement("span", null, currentScorecard.OtherCriteriaScore || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.scoreItem },
                react_1.default.createElement("label", null, "Recommendation:"),
                react_1.default.createElement("span", null, currentScorecard.ConsiderForEmployment || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.feedbackItem },
                react_1.default.createElement("label", null, "Overall Feedback:"),
                react_1.default.createElement("p", null, currentScorecard.OverAllEvaluationFeedback || 'No feedback provided'))),
        currentScorecard.QuestionJson && (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.questionnaireSection },
            react_1.default.createElement("h4", null, "Question Ratings"),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.questionsList }, JSON.parse(currentScorecard.QuestionJson || '[]').map(function (q, index) { return (react_1.default.createElement("div", { key: index, className: ReviewScorecard_module_scss_1.default.questionItem },
                react_1.default.createElement("span", null,
                    "Question ",
                    q.id,
                    ":"),
                react_1.default.createElement("span", null,
                    "Rating ",
                    q.rating || 'N/A'))); }))))));
};
exports.default = ScorecardDetails;
//# sourceMappingURL=ScorecardDetails.js.map