"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScorecardDetails;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ScorecardDetails_module_scss_1 = tslib_1.__importDefault(require("./ScorecardDetails.module.scss"));
var SCORECARD_FIELDS = [
    { key: 'Qualifications', label: 'QUALIFICATIONS', icon: '📄' },
    { key: 'Experience', label: 'EXPERIENCE', icon: '📈' },
    { key: 'Knowledge', label: 'KNOWLEDGE', icon: '🧩' },
    { key: 'EnergyLevel', label: 'ENERGY LEVEL', icon: '⚡' },
    { key: 'JobRequirements', label: 'JOB REQUIREMENTS', icon: '⏱' },
    { key: 'CultureFit', label: 'CULTURE FIT', icon: '👥' },
    { key: 'ExpatLocal', label: 'EXPAT/LOCAL', icon: '🌐' },
    { key: 'OtherCriteria', label: 'OTHER CRITERIA', icon: '📄' },
];
function ScorecardDetails(_a) {
    var scorecard = _a.scorecard, scorecardErrors = _a.scorecardErrors, onScorecardChange = _a.onScorecardChange, recommendation = _a.recommendation, recError = _a.recError, onRecommendationChange = _a.onRecommendationChange, overallFeedback = _a.overallFeedback, feedbackError = _a.feedbackError, onFeedbackChange = _a.onFeedbackChange, acknowledged = _a.acknowledged, ackError = _a.ackError, onAcknowledgedChange = _a.onAcknowledgedChange, candidate = _a.candidate;
    var reviewerName = (candidate === null || candidate === void 0 ? void 0 : candidate.reviewerName) || '';
    var jobTitleEn = (candidate === null || candidate === void 0 ? void 0 : candidate.jobTitleEn) || '';
    var jobTitleFr = (candidate === null || candidate === void 0 ? void 0 : candidate.jobTitleFr) || '';
    var userInitial = (reviewerName || 'J').charAt(0).toUpperCase();
    return (React.createElement("section", null,
        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.sectionTitle },
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.sectionAccentGreen }),
            React.createElement("div", null,
                React.createElement("h2", { className: ScorecardDetails_module_scss_1.default.sectionH2 }, "SCORECARD DETAILS"),
                React.createElement("p", { className: ScorecardDetails_module_scss_1.default.sectionSub }, "Core Competency Assessment (1\u20135 Scale)"))),
        React.createElement("div", { className: ScorecardDetails_module_scss_1.default.scorecardCard },
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.scorecardGrid }, SCORECARD_FIELDS.map(function (field) { return (React.createElement("div", { key: field.key, className: ScorecardDetails_module_scss_1.default.scorecardField },
                React.createElement("p", { className: [
                        ScorecardDetails_module_scss_1.default.scorecardFieldLabel,
                        scorecardErrors[field.key] ? ScorecardDetails_module_scss_1.default.errLabel : '',
                    ].filter(Boolean).join(' ') },
                    field.icon,
                    " ",
                    field.label,
                    " ",
                    React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                    scorecardErrors[field.key] && (React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErr }, " \u2014 Required"))),
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.fiveRow }, [1, 2, 3, 4, 5].map(function (n) { return (React.createElement("button", { key: n, className: [
                        ScorecardDetails_module_scss_1.default.fiveBtn,
                        scorecard[field.key] === n ? ScorecardDetails_module_scss_1.default.fiveBtnActive : '',
                    ].filter(Boolean).join(' '), onClick: function () { return onScorecardChange(field.key, n); } }, n)); })))); })),
            React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recRow },
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recLeft },
                    React.createElement("p", { className: [
                            ScorecardDetails_module_scss_1.default.scorecardFieldLabel,
                            recError ? ScorecardDetails_module_scss_1.default.errLabel : '',
                        ].filter(Boolean).join(' ') },
                        "RECOMMENDATION ",
                        React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                        recError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErr }, " \u2014 Required")),
                    React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recBtnRow },
                        React.createElement("button", { className: [
                                ScorecardDetails_module_scss_1.default.recBtn,
                                recommendation === 'consider' ? ScorecardDetails_module_scss_1.default.recBtnActive : '',
                            ].filter(Boolean).join(' '), onClick: function () { return onRecommendationChange('consider'); } },
                            recommendation === 'consider' && React.createElement("span", { style: { fontSize: 14 } }, "\u2705"),
                            "Consider for Employment"),
                        React.createElement("button", { className: [
                                ScorecardDetails_module_scss_1.default.recBtn,
                                recommendation === 'doNotConsider' ? ScorecardDetails_module_scss_1.default.recBtnDeny : '',
                            ].filter(Boolean).join(' '), onClick: function () { return onRecommendationChange('doNotConsider'); } }, "\u2715 Do Not Consider"))),
                React.createElement("div", { className: ScorecardDetails_module_scss_1.default.recRight },
                    React.createElement("p", { className: [
                            ScorecardDetails_module_scss_1.default.scorecardFieldLabel,
                            feedbackError ? ScorecardDetails_module_scss_1.default.errLabel : '',
                        ].filter(Boolean).join(' ') },
                        "OVERALL EVALUATION FEEDBACK ",
                        React.createElement("span", { className: ScorecardDetails_module_scss_1.default.req }, "*"),
                        feedbackError && React.createElement("span", { className: ScorecardDetails_module_scss_1.default.fieldErr }, " \u2014 Required")),
                    React.createElement("textarea", { className: [
                            ScorecardDetails_module_scss_1.default.feedbackArea,
                            feedbackError ? ScorecardDetails_module_scss_1.default.inputErr : '',
                        ].filter(Boolean).join(' '), rows: 4, value: overallFeedback, onChange: function (e) { return onFeedbackChange(e.target.value); }, placeholder: "Enter your overall evaluation feedback here\u2026" }))),
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