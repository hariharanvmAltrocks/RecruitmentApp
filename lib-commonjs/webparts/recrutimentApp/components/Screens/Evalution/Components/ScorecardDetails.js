"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ScorecardDetails_module_scss_1 = tslib_1.__importDefault(require("./ScorecardDetails.module.scss"));
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var BASE_SCORECARD_FIELDS = [
    { key: 'Qualifications', label: strings.QualificationsRelevant, icon: '📄' },
    { key: 'Experience', label: strings.ExperienceRelevant, icon: '📈' },
    { key: 'Knowledge', label: 'KNOWLEDGE', icon: '🧩' },
    { key: 'EnergyLevel', label: strings.EnergyLevel, icon: '⚡' },
    { key: 'JobRequirements', label: strings.MeetsJobRequirements, icon: '⏱' },
    { key: 'CultureFit', label: strings.WillContributeCultureRequired, icon: '👥' },
    { key: 'ExpatLocal', label: strings.ExpatExperience, isDynamic: true, icon: '🌐' },
    { key: 'OtherCriteria', label: strings.OtherCriteriaRecognisedByPanel, icon: '📄' },
];
var SCORE_OPTIONS = [1, 2, 3, 4, 5];
var SCORE_LABELS = {
    1: 'Poor', 2: strings.BelowAvg, 3: 'Average', 4: 'Good', 5: 'Excellent',
};
function ScorecardDetails(_a) {
    var scorecard = _a.scorecard, scorecardErrors = _a.scorecardErrors, onScorecardChange = _a.onScorecardChange, recommendation = _a.recommendation, recError = _a.recError, onRecommendationChange = _a.onRecommendationChange, overallFeedback = _a.overallFeedback, feedbackError = _a.feedbackError, onFeedbackChange = _a.onFeedbackChange, evaluationFeedback = _a.evaluationFeedback, evalFeedbackError = _a.evalFeedbackError, onEvalFeedbackChange = _a.onEvalFeedbackChange, acknowledged = _a.acknowledged, ackError = _a.ackError, onAcknowledgedChange = _a.onAcknowledgedChange, candidate = _a.candidate;
    var reviewerName = (candidate === null || candidate === void 0 ? void 0 : candidate.reviewerName) || '';
    var jobTitleEn = (candidate === null || candidate === void 0 ? void 0 : candidate.jobTitleEn) || '';
    var jobTitleFr = (candidate === null || candidate === void 0 ? void 0 : candidate.jobTitleFr) || '';
    var userInitial = (reviewerName || 'J').charAt(0).toUpperCase();
    var expatLocalLabel = (candidate === null || candidate === void 0 ? void 0 : candidate.nationalityCode) === ConditionConfig_1.NationalityCode.Nationals
        ? strings.CongoleseExperience
        : 'EXPAT EXPERIENCE';
    var shouldShowEvalFeedback = Object.values(scorecard).some(function (v) { return v !== null && Number(v) <= 2; });
    return (React.createElement("section", null,
        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.sectionTitle },
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.sectionAccentGreen }),
            React.createElement("div", null,
                React.createElement("h2", { className: ScorecardDetails_module_scss_1.default.sectionH2 }, strings.ScorecardDetails),
                React.createElement("p", { className: ScorecardDetails_module_scss_1.default.sectionSub }, strings.CoreCompetencyAssessment15Scale)),
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.scaleLegend }, SCORE_OPTIONS.map(function (n) { return (React.createElement("span", { key: n, className: ScorecardDetails_module_scss_1.default.scaleLegendItem },
                React.createElement("b", null, n),
                " ",
                SCORE_LABELS[n])); }))),
        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.scorecardCard },
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.scorecardGrid }, BASE_SCORECARD_FIELDS.map(function (field) {
                var label = field.isDynamic ? expatLocalLabel : field.label;
                var hasError = !!scorecardErrors[field.key];
                return (React.createElement("div", { key: field.key, className: ScorecardDetails_module_scss_1.default.scorecardField },
                    React.createElement("p", { className: [ScorecardDetails_module_scss_1.default.fieldLabel, hasError ? ScorecardDetails_module_scss_1.default.errLabel : ''].filter(Boolean).join(' ') },
                        field.icon,
                        " ",
                        label,
                        " ",
                        React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                        hasError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErrMsg },
                            " ",
                            strings.Required1)),
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.btnRow }, SCORE_OPTIONS.map(function (n) { return (React.createElement("button", { key: n, title: SCORE_LABELS[n], className: [
                            ScorecardDetails_module_scss_1.default.scoreBtn,
                            scorecard[field.key] === n ? ScorecardDetails_module_scss_1.default.scoreBtnActive : '',
                        ].filter(Boolean).join(' '), onClick: function () { return onScorecardChange(field.key, n); } }, n)); }))));
            })),
            shouldShowEvalFeedback && (React.createElement("div", { className: ScorecardDetails_module_scss_1.default.evalFeedbackBox },
                React.createElement("p", { className: [ScorecardDetails_module_scss_1.default.fieldLabel, evalFeedbackError ? ScorecardDetails_module_scss_1.default.errLabel : ''].filter(Boolean).join(' ') },
                    strings.FeedbackRequiredRatingsBelow3,
                    ' ',
                    React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                    evalFeedbackError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErrMsg }, " \u2014 Required")),
                React.createElement("textarea", { className: [ScorecardDetails_module_scss_1.default.textArea, evalFeedbackError ? ScorecardDetails_module_scss_1.default.inputErr : ''].filter(Boolean).join(' '), rows: 3, value: evaluationFeedback, onChange: function (e) { return onEvalFeedbackChange(e.target.value); }, placeholder: strings.PleaseProvideFeedbackExplainingRatingsBe }))),
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recRow },
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recLeft },
                    React.createElement("p", { className: [ScorecardDetails_module_scss_1.default.fieldLabel, recError ? ScorecardDetails_module_scss_1.default.errLabel : ''].filter(Boolean).join(' ') },
                        strings.ConsiderForEmployment,
                        React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                        recError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErrMsg }, " \u2014 Required")),
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recBtnRow },
                        React.createElement("button", { className: [ScorecardDetails_module_scss_1.default.recBtn, recommendation === 'consider' ? ScorecardDetails_module_scss_1.default.recBtnYes : ''].filter(Boolean).join(' '), onClick: function () { return onRecommendationChange('consider'); } }, recommendation === 'consider' ? strings.Yes : 'Yes'),
                        React.createElement("button", { className: [ScorecardDetails_module_scss_1.default.recBtn, recommendation === 'doNotConsider' ? ScorecardDetails_module_scss_1.default.recBtnNo : ''].filter(Boolean).join(' '), onClick: function () { return onRecommendationChange('doNotConsider'); } }, recommendation === 'doNotConsider' ? strings.No : 'No'))),
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recRight },
                    React.createElement("p", { className: [ScorecardDetails_module_scss_1.default.fieldLabel, feedbackError ? ScorecardDetails_module_scss_1.default.errLabel : ''].filter(Boolean).join(' ') },
                        strings.OverallEvaluationFeedback,
                        React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                        feedbackError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErrMsg }, " \u2014 Required")),
                    React.createElement("textarea", { className: [ScorecardDetails_module_scss_1.default.textArea, feedbackError ? ScorecardDetails_module_scss_1.default.inputErr : ''].filter(Boolean).join(' '), rows: 4, value: overallFeedback, onChange: function (e) { return onFeedbackChange(e.target.value); }, placeholder: strings.EnterYourOverallEvaluationFeedbackHere }))),
            React.createElement("div", { className: [ScorecardDetails_module_scss_1.default.ackBox, ackError ? ScorecardDetails_module_scss_1.default.ackBoxErr : ''].filter(Boolean).join(' ') },
                React.createElement("label", { className: ScorecardDetails_module_scss_1.default.ackRow },
                    React.createElement("input", { type: "checkbox", checked: acknowledged, onChange: function (e) { return onAcknowledgedChange(e.target.checked); }, className: ScorecardDetails_module_scss_1.default.ackChk }),
                    React.createElement("span", { className: ScorecardDetails_module_scss_1.default.ackText }, strings.IHerebyAcknowledgeThatIHaveCompletedTheC)),
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerCard },
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerAvatar }, userInitial),
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerInfo },
                        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerCol },
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerMeta }, strings.ReviewerName1),
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerVal }, reviewerName)),
                        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerCol },
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerMeta }, strings.JobTitleEn1),
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerVal }, jobTitleEn),
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerMeta, style: { marginTop: 12 } }, strings.JobTitleFr1),
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerVal }, jobTitleFr))))))));
}
exports.default = ScorecardDetails;
//# sourceMappingURL=ScorecardDetails.js.map