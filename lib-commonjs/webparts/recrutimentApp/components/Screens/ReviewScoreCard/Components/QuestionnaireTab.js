"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var SCORECARD_BAR_LABELS = [
    { key: "RelevantQualification", label: "QUALIFICATIONS" },
    { key: "ReleventExperience", label: "EXPERIENCE" },
    { key: "Knowledge", label: "KNOWLEDGE" },
    { key: "EnergyLevel", label: "ENERGY" },
    { key: "MeetJobRequirement", label: "REQUIREMENTS" },
    { key: "ContributeTowardsCultureRequried", label: "CULTURE" },
    { key: "Experience", label: strings.ExpatExp },
    { key: "OtherCriteriaScore", label: "OTHER" },
];
var ratingLabel = function (score) {
    if (score >= 3)
        return { text: "".concat(score, " \u2014 EXCELLENT"), color: "#16a34a", bg: "#f0fdf4" };
    if (score === 2)
        return { text: "".concat(score, " \u2014 ACCEPTABLE"), color: "#2563eb", bg: "#eff6ff" };
    return { text: "".concat(score, " \u2014 NOT ACCEPTABLE"), color: "#ef4444", bg: "#fef2f2" };
};
var QuestionnaireTab = function (_a) {
    var questions = _a.questions, activeScore = _a.activeScore, activeQJson = _a.activeQJson, panelMemberName = _a.panelMemberName, fetchingQuestions = _a.fetchingQuestions;
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSection },
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSectionHeader },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSectionBar, style: { background: "#f97316" } }),
            React.createElement("div", null,
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSectionTitle }, strings.InterviewQuestionnaires),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSectionSub },
                    strings.PanelAssessmentResults,
                    panelMemberName ? " \u2014 ".concat(panelMemberName) : ""))),
        React.createElement("div", null,
            " ",
            fetchingQuestions ? (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mNoData }, strings.LoadingQuestions)) : questions.length === 0 ? (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mNoData }, strings.NoQuestionsFoundForThisJob)) : (questions.map(function (q, idx) {
                var qScore = activeQJson[idx]
                    ? Number(Object.values(activeQJson[idx])[0] || 0)
                    : 0;
                var rl = ratingLabel(qScore);
                var answerText = (q.answer || q.response || "")
                    .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                    .trim();
                return (React.createElement("div", { key: idx, className: ReviewScorecard_module_scss_1.default.mQCard },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mQTop },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mQBadge },
                            "Q",
                            idx + 1),
                        React.createElement("div", { style: { flex: 1 } },
                            React.createElement("p", { className: ReviewScorecard_module_scss_1.default.mQText, dangerouslySetInnerHTML: {
                                    __html: (q.question || "")
                                        .replace(/<p>|<\/p>|<br\s*\/?>/gi, "")
                                        .trim(),
                                } }),
                            answerText && (React.createElement("p", { className: ReviewScorecard_module_scss_1.default.mQAnswer },
                                React.createElement("strong", null, strings.ExpectedAnswer1),
                                " ",
                                answerText)))),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mQBottom },
                        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mRatingLabel }, strings.Rating),
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mRatingBadge, style: {
                                    color: rl.color,
                                    background: rl.bg,
                                    border: "1px solid ".concat(rl.color, "33"),
                                } }, rl.text)),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mScoreDisplay },
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mScoreLabel }, strings.Score),
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mScoreNum },
                                qScore,
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mScoreMax }, "/3"))))));
            })),
            activeScore && (React.createElement("div", { style: { marginTop: "1.5rem" } },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSectionHeader },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSectionBar, style: { background: "#22c55e" } }),
                    React.createElement("div", null,
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSectionTitle }, strings.ScorecardDetails),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mSectionSub }, strings.CoreCompetencyAssessment15Scale))),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mScoreCard },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mScoreGrid }, SCORECARD_BAR_LABELS.map(function (_a) {
                        var key = _a.key, label = _a.label;
                        var val = Number(activeScore[key] || 0);
                        return (React.createElement("div", { key: key, className: ReviewScorecard_module_scss_1.default.mScoreItem },
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mScoreRow },
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mScoreFieldLabel }, label),
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mScoreFieldVal },
                                    val,
                                    "/5")),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mProgressBar },
                                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mProgressFill, style: { width: "".concat((val / 5) * 100, "%") } }))));
                    })),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mRecFeedbackRow },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mRecCol },
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mRecLabel }, strings.PanelRecommendation),
                            activeScore.ConsiderForEmployment === "Yes" ? (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mRecBadgeYes }, strings.ConsiderForEmployment1)) : (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mRecBadgeNo }, strings.DoNotConsider))),
                        activeScore.OverAllEvaluationFeedback && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFeedbackCol },
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mRecLabel }, strings.OverallEvaluationFeedback),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFeedbackText },
                                "\"",
                                activeScore.OverAllEvaluationFeedback,
                                "\""))))))))));
};
exports.default = QuestionnaireTab;
//# sourceMappingURL=QuestionnaireTab.js.map