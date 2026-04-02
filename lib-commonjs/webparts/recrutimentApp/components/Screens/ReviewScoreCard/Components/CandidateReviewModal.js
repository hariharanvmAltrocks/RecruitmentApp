"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var QuestionnaireTab_1 = tslib_1.__importDefault(require("./QuestionnaireTab"));
var ScoreTable_1 = tslib_1.__importDefault(require("./ScoreTable"));
var HODDecisionPanel_1 = tslib_1.__importDefault(require("./HODDecisionPanel"));
var Commentsmodal_1 = tslib_1.__importDefault(require("./Commentsmodal"));
var useReviewScorecard_1 = require("../Hooks/useReviewScorecard");
var SCORE_CRITERIA = [
    { field: 'RelevantQualification', label: 'Qualification (Relevant)' },
    { field: 'ReleventExperience', label: 'Experience (Relevant)' },
    { field: 'Knowledge', label: 'Knowledge' },
    { field: 'EnergyLevel', label: 'Energy Level' },
    { field: 'MeetJobRequirement', label: 'Meets All Job Requirements' },
    { field: 'ContributeTowardsCultureRequried', label: 'Will Contribute to Culture Required' },
    { field: 'Experience', label: 'Experience' },
    { field: 'OtherCriteriaScore', label: 'Other Criteria Recognized by Panel' },
];
var MAX_OVERALL_PER_PANEL = 40;
var MField = function (_a) {
    var label = _a.label, value = _a.value;
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mfField },
        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mfLabel }, label),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mfValue }, value || '—')));
};
var CandidateReviewModal = function (_a) {
    var candidate = _a.candidate, reviewData = _a.reviewData, reviewLoading = _a.reviewLoading, job = _a.job, scoreData = _a.scoreData, scoreLoading = _a.scoreLoading, showComments = _a.showComments, level1Comments = _a.level1Comments, level2Comments = _a.level2Comments, commentsLoading = _a.commentsLoading, onViewComments = _a.onViewComments, onCloseComments = _a.onCloseComments, hodDecision = _a.hodDecision, decisionComment = _a.decisionComment, confirmed = _a.confirmed, selectedPositionId = _a.selectedPositionId, selectedPositionText = _a.selectedPositionText, positionOptions = _a.positionOptions, submitting = _a.submitting, submitError = _a.submitError, successMessage = _a.successMessage, errors = _a.errors, shouldShowPositionId = _a.shouldShowPositionId, onDecisionChange = _a.onDecisionChange, onCommentChange = _a.onCommentChange, onConfirmChange = _a.onConfirmChange, onPositionChange = _a.onPositionChange, onClose = _a.onClose, currentRoleId = _a.currentRoleId, isLevel2Status = _a.isLevel2Status, submitDeps = _a.submitDeps;
    var _b = React.useState(0), activePanelTab = _b[0], setActivePanelTab = _b[1];
    var _c = React.useState('questions'), activeScorecardTab = _c[0], setActiveScorecardTab = _c[1];
    var panelMembers = React.useMemo(function () {
        var fromReview = (reviewData === null || reviewData === void 0 ? void 0 : reviewData.panelMembers) || [];
        if (fromReview.length > 0)
            return fromReview;
        return (scoreData || []).map(function (s, i) { return s.InterviewPersonName || "Interviewer ".concat(i + 1); });
    }, [reviewData, scoreData]);
    var activeScore = (scoreData || [])[activePanelTab] || null;
    var activeQJson = React.useMemo(function () {
        if (!(activeScore === null || activeScore === void 0 ? void 0 : activeScore.QuestionJson))
            return [];
        if (Array.isArray(activeScore.QuestionJson))
            return activeScore.QuestionJson;
        try {
            return JSON.parse(activeScore.QuestionJson);
        }
        catch (_a) {
            return [];
        }
    }, [activeScore]);
    var questionTableRows = React.useMemo(function () {
        var qMap = {};
        (scoreData || []).forEach(function (s, i) {
            var qJson = Array.isArray(s.QuestionJson)
                ? s.QuestionJson
                : (function () { try {
                    return JSON.parse(s.QuestionJson || '[]');
                }
                catch (_a) {
                    return [];
                } })();
            qJson.forEach(function (q) {
                var key = Object.keys(q)[0];
                if (!qMap[key])
                    qMap[key] = { criteria: key };
                qMap[key]["panel_".concat(i)] = q[key];
            });
        });
        return Object.values(qMap);
    }, [scoreData]);
    var overallTableRows = React.useMemo(function () {
        var rows = SCORE_CRITERIA.map(function (_a) {
            var field = _a.field, label = _a.label;
            var row = { criteria: label, total: 0 };
            (scoreData || []).forEach(function (s, i) {
                var val = Number(s[field]) || 0;
                row["panel_".concat(i)] = val;
                row.total += val;
            });
            return row;
        });
        var totalRow = { criteria: 'Total', total: 0 };
        (scoreData || []).forEach(function (_, i) {
            var sum = rows.reduce(function (acc, r) {
                var v = r["panel_".concat(i)];
                return typeof v === 'number' ? acc + v : acc;
            }, 0);
            totalRow["panel_".concat(i)] = "".concat(sum, " / ").concat(MAX_OVERALL_PER_PANEL);
        });
        totalRow.total = rows.reduce(function (acc, r) { return acc + (typeof r.total === 'number' ? r.total : 0); }, 0);
        rows.push(totalRow);
        return rows;
    }, [scoreData]);
    var raw = (reviewData === null || reviewData === void 0 ? void 0 : reviewData.candidateData) || {};
    var formattedDate = (raw.InterviewDate || raw.InterviewDateLevel2 || candidate.interviewDate || '').split('T')[0] || '';
    var nationLabel = (function () {
        var n = (candidate.nationality || '').toLowerCase();
        if (n.includes('expat'))
            return 'EXPAT';
        if (n.includes('national') || n.includes('congolese') || n.includes('local'))
            return 'LOCAL';
        return (candidate.nationality || '').toUpperCase() || '';
    })();
    var userInitial = ((reviewData === null || reviewData === void 0 ? void 0 : reviewData.reviewerName) || '').charAt(0).toUpperCase();
    var safeLevel1 = Array.isArray(level1Comments) ? level1Comments : [];
    var safeLevel2 = Array.isArray(level2Comments) ? level2Comments : [];
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.modalOverlay },
        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, transition: { duration: 0.2 }, className: ReviewScorecard_module_scss_1.default.modalWindow },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeader },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeaderLeft },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mBreadcrumb },
                        React.createElement("span", null, "CANDIDATE SELECTION"),
                        React.createElement(lucide_react_1.ChevronRight, { size: 11 }),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mBreadcrumbActive }, "Review score card ")),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTitleRow },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mIconBox },
                            React.createElement(lucide_react_1.Users, { size: 20 })),
                        React.createElement("div", null,
                            React.createElement("h2", { className: ReviewScorecard_module_scss_1.default.mTitle }, "Candidate  Details"),
                            React.createElement("p", { className: ReviewScorecard_module_scss_1.default.mSubtitle },
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mJobCode }, (job === null || job === void 0 ? void 0 : job.jobCode) || candidate.jobCode || ''),
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mDot }, "\u203A"),
                                React.createElement("span", null, (raw === null || raw === void 0 ? void 0 : raw.PositionTitle) || candidate.positionTitle || ''))))),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeaderRight },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mGpa },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaLabel }, "OVERALL GPA"),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaValue }, candidate.gpa || '—')),
                    React.createElement("button", { onClick: onClose, className: ReviewScorecard_module_scss_1.default.mCloseBtn },
                        React.createElement(lucide_react_1.X, { size: 20 })))),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mBody },
                React.createElement("aside", { className: ReviewScorecard_module_scss_1.default.mLeft },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mLeftCard },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mCandidateName }, candidate.fullName),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mCandidateType }, nationLabel),
                        reviewLoading ? (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mNoData }, "Loading info...")) : (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFieldList },
                            React.createElement(MField, { label: "NATIONALITY", value: raw.Nationality || candidate.nationality || '' }),
                            React.createElement(MField, { label: "GENDER", value: raw.Gender || candidate.gender || '' }),
                            React.createElement(MField, { label: "QUALIFICATION", value: raw.Qualification || '' }),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "MINING EXP.", value: raw.TotalYearOfExperiance || '' }),
                                React.createElement(MField, { label: "RELATED EXP.", value: raw.ReleventExperience || '' })),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "INTERVIEW DATE", value: formattedDate }),
                                React.createElement(MField, { label: "LEVELS", value: candidate.interviewLevel || '' })),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "GRADE", value: candidate.grade || '' }),
                                React.createElement(MField, { label: "CONFLICTS", value: raw.ConflictsOfInterest || '' })),
                            React.createElement(MField, { label: "DISABILITY", value: raw.Disability || raw.disability || '' }))),
                        panelMembers.length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelSection },
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelHeader },
                                React.createElement(lucide_react_1.Users, { size: 12, color: "#2563eb" }),
                                React.createElement("span", null, "INTERVIEW PANEL")),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelList }, panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: ReviewScorecard_module_scss_1.default.mPanelRow },
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelBadge }, i + 1),
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelName }, name))); })))))),
                React.createElement("main", { className: ReviewScorecard_module_scss_1.default.mRight },
                    !scoreLoading && (scoreData || []).length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.panelTabBar }, (scoreData || []).map(function (s, i) { return (React.createElement("button", { key: i, className: "".concat(ReviewScorecard_module_scss_1.default.panelTab, " ").concat(activePanelTab === i ? ReviewScorecard_module_scss_1.default.panelTabActive : ''), onClick: function () { return setActivePanelTab(i); }, type: "button" },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabNum }, i + 1),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabName }, panelMembers[i] || s.InterviewPersonName || "Interviewer ".concat(i + 1)))); }))),
                    activeScorecardTab === 'questions' && (React.createElement(QuestionnaireTab_1.default, { questions: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.questions) || [], activeScore: activeScore, activeQJson: activeQJson, panelMemberName: panelMembers[activePanelTab] || '', fetchingQuestions: reviewLoading })),
                    activeScorecardTab === 'qEval' && (React.createElement(ScoreTable_1.default, { title: "QUESTION EVALUATION SCORECARD", subtitle: "Panel-wise Question Scores \u2014 All Interviewers", accentColor: "#6366f1", rows: questionTableRows, panelMembers: panelMembers, showTotal: false, emptyText: "No question data available." })),
                    activeScorecardTab === 'overall' && (React.createElement(ScoreTable_1.default, { title: "OVERALL EVALUATION SCORECARD", subtitle: "Core Criteria Scores \u2014 All Interviewers (Max 5 per criterion)", accentColor: "#22c55e", rows: overallTableRows, panelMembers: panelMembers, showTotal: true, emptyText: "No scorecard data available." })),
                    React.createElement(HODDecisionPanel_1.default, { canEdit: (0, useReviewScorecard_1.canEdit)(candidate.statusId), isLevel2Status: isLevel2Status, statusId: candidate.statusId, hodDecision: hodDecision, decisionComment: decisionComment, confirmed: confirmed, selectedPositionId: selectedPositionId, selectedPositionText: selectedPositionText, positionOptions: positionOptions || [], submitting: submitting, submitError: submitError, successMessage: successMessage, reviewerName: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.reviewerName) || '', jobTitleEn: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.jobTitleEn) || '', jobTitleFr: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.jobTitleFr) || '', userInitial: userInitial, errors: errors, shouldShowPositionId: shouldShowPositionId, onDecisionChange: onDecisionChange, onCommentChange: onCommentChange, onConfirmChange: onConfirmChange, onPositionChange: onPositionChange, onViewComments: onViewComments, onClose: onClose, submitDeps: submitDeps, roleId: currentRoleId })))),
        React.createElement(Commentsmodal_1.default, { open: showComments, loading: commentsLoading, level1: safeLevel1, level2: safeLevel2, onClose: onCloseComments })));
};
exports.default = CandidateReviewModal;
//# sourceMappingURL=CandidateReviewModal.js.map