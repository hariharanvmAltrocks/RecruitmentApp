"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScorecardDetails;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ScorecardDetails_module_scss_1 = tslib_1.__importDefault(require("./ScorecardDetails.module.scss"));
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var BASE_SCORECARD_FIELDS = [
    { key: 'Qualifications', label: 'QUALIFICATIONS RELEVANT', icon: '📄' },
    { key: 'Experience', label: 'EXPERIENCE RELEVANT', icon: '📈' },
    { key: 'Knowledge', label: 'KNOWLEDGE', icon: '🧩' },
    { key: 'EnergyLevel', label: 'ENERGY LEVEL', icon: '⚡' },
    { key: 'JobRequirements', label: 'MEETS JOB REQUIREMENTS', icon: '⏱' },
    { key: 'CultureFit', label: 'WILL CONTRIBUTE CULTURE REQUIRED', icon: '👥' },
    { key: 'ExpatLocal', label: 'EXPAT EXPERIENCE', isDynamic: true, icon: '🌐' },
    { key: 'OtherCriteria', label: 'OTHER CRITERIA RECOGNISED BY PANEL', icon: '📄' },
];
var SCORE_OPTIONS = [1, 2, 3, 4, 5];
var SCORE_LABELS = {
    1: 'Poor', 2: 'Below Avg', 3: 'Average', 4: 'Good', 5: 'Excellent',
};
function ScorecardDetails(_a) {
    var scorecard = _a.scorecard, scorecardErrors = _a.scorecardErrors, onScorecardChange = _a.onScorecardChange, recommendation = _a.recommendation, recError = _a.recError, onRecommendationChange = _a.onRecommendationChange, overallFeedback = _a.overallFeedback, feedbackError = _a.feedbackError, onFeedbackChange = _a.onFeedbackChange, evaluationFeedback = _a.evaluationFeedback, evalFeedbackError = _a.evalFeedbackError, onEvalFeedbackChange = _a.onEvalFeedbackChange, acknowledged = _a.acknowledged, ackError = _a.ackError, onAcknowledgedChange = _a.onAcknowledgedChange, candidate = _a.candidate;
    var reviewerName = (candidate === null || candidate === void 0 ? void 0 : candidate.reviewerName) || '';
    var jobTitleEn = (candidate === null || candidate === void 0 ? void 0 : candidate.jobTitleEn) || '';
    var jobTitleFr = (candidate === null || candidate === void 0 ? void 0 : candidate.jobTitleFr) || '';
    var userInitial = (reviewerName || 'J').charAt(0).toUpperCase();
    var expatLocalLabel = (candidate === null || candidate === void 0 ? void 0 : candidate.nationalityCode) === ConditionConfig_1.NationalityCode.Nationals
        ? 'CONGOLESE EXPERIENCE'
        : 'EXPAT EXPERIENCE';
    var shouldShowEvalFeedback = Object.values(scorecard).some(function (v) { return v !== null && Number(v) <= 2; });
    return (React.createElement("section", null,
        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.sectionTitle },
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.sectionAccentGreen }),
            React.createElement("div", null,
                React.createElement("h2", { className: ScorecardDetails_module_scss_1.default.sectionH2 }, "SCORECARD DETAILS"),
                React.createElement("p", { className: ScorecardDetails_module_scss_1.default.sectionSub }, "Core Competency Assessment (1\u20135 Scale)")),
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
                        hasError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErrMsg }, " \u2014 Required")),
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.btnRow }, SCORE_OPTIONS.map(function (n) { return (React.createElement("button", { key: n, title: SCORE_LABELS[n], className: [
                            ScorecardDetails_module_scss_1.default.scoreBtn,
                            scorecard[field.key] === n ? ScorecardDetails_module_scss_1.default.scoreBtnActive : '',
                        ].filter(Boolean).join(' '), onClick: function () { return onScorecardChange(field.key, n); } }, n)); }))));
            })),
            shouldShowEvalFeedback && (React.createElement("div", { className: ScorecardDetails_module_scss_1.default.evalFeedbackBox },
                React.createElement("p", { className: [ScorecardDetails_module_scss_1.default.fieldLabel, evalFeedbackError ? ScorecardDetails_module_scss_1.default.errLabel : ''].filter(Boolean).join(' ') },
                    "\uD83D\uDCDD FEEDBACK REQUIRED \u2014 RATINGS BELOW 3",
                    ' ',
                    React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                    evalFeedbackError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErrMsg }, " \u2014 Required")),
                React.createElement("textarea", { className: [ScorecardDetails_module_scss_1.default.textArea, evalFeedbackError ? ScorecardDetails_module_scss_1.default.inputErr : ''].filter(Boolean).join(' '), rows: 3, value: evaluationFeedback, onChange: function (e) { return onEvalFeedbackChange(e.target.value); }, placeholder: "Please provide feedback explaining ratings below 3\u2026" }))),
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recRow },
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recLeft },
                    React.createElement("p", { className: [ScorecardDetails_module_scss_1.default.fieldLabel, recError ? ScorecardDetails_module_scss_1.default.errLabel : ''].filter(Boolean).join(' ') },
                        "CONSIDER FOR EMPLOYMENT ",
                        React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                        recError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErrMsg }, " \u2014 Required")),
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recBtnRow },
                        React.createElement("button", { className: [ScorecardDetails_module_scss_1.default.recBtn, recommendation === 'consider' ? ScorecardDetails_module_scss_1.default.recBtnYes : ''].filter(Boolean).join(' '), onClick: function () { return onRecommendationChange('consider'); } }, recommendation === 'consider' ? '✅ Yes' : 'Yes'),
                        React.createElement("button", { className: [ScorecardDetails_module_scss_1.default.recBtn, recommendation === 'doNotConsider' ? ScorecardDetails_module_scss_1.default.recBtnNo : ''].filter(Boolean).join(' '), onClick: function () { return onRecommendationChange('doNotConsider'); } }, recommendation === 'doNotConsider' ? '✕ No' : 'No'))),
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recRight },
                    React.createElement("p", { className: [ScorecardDetails_module_scss_1.default.fieldLabel, feedbackError ? ScorecardDetails_module_scss_1.default.errLabel : ''].filter(Boolean).join(' ') },
                        "OVERALL EVALUATION FEEDBACK ",
                        React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                        feedbackError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErrMsg }, " \u2014 Required")),
                    React.createElement("textarea", { className: [ScorecardDetails_module_scss_1.default.textArea, feedbackError ? ScorecardDetails_module_scss_1.default.inputErr : ''].filter(Boolean).join(' '), rows: 4, value: overallFeedback, onChange: function (e) { return onFeedbackChange(e.target.value); }, placeholder: "Enter your overall evaluation feedback here\u2026" }))),
            React.createElement("div", { className: [ScorecardDetails_module_scss_1.default.ackBox, ackError ? ScorecardDetails_module_scss_1.default.ackBoxErr : ''].filter(Boolean).join(' ') },
                React.createElement("label", { className: ScorecardDetails_module_scss_1.default.ackRow },
                    React.createElement("input", { type: "checkbox", checked: acknowledged, onChange: function (e) { return onAcknowledgedChange(e.target.checked); }, className: ScorecardDetails_module_scss_1.default.ackChk }),
                    React.createElement("span", { className: ScorecardDetails_module_scss_1.default.ackText }, "I hereby acknowledge that I have completed the candidate evaluation and scorecard entry, and I confirm that the scores and feedback provided are accurate.")),
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerCard },
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerAvatar }, userInitial),
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerInfo },
                        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerCol },
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerMeta }, "REVIEWER NAME"),
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerVal }, reviewerName)),
                        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.reviewerCol },
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerMeta }, "JOB TITLE (EN)"),
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerVal }, jobTitleEn),
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerMeta, style: { marginTop: 12 } }, "JOB TITLE (FR)"),
                            React.createElement("p", { className: ScorecardDetails_module_scss_1.default.reviewerVal }, jobTitleFr))))))));
}
//# sourceMappingURL=ScorecardDetails.js.map