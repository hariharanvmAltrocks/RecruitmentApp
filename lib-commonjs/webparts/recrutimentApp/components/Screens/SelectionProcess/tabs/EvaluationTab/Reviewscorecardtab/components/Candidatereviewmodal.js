"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// ReviewScorecard/components/CandidateReviewModal.tsx
// Thin orchestrator — all data comes from useReviewScorecard hook via props.
// Heavy UI logic is in sub-components (QuestionnaireTab, ScoreTable, HODDecisionPanel).
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var Reviewscorecardtab_module_scss_1 = tslib_1.__importDefault(require("../Reviewscorecardtab.module.scss"));
var Questionnairetab_1 = tslib_1.__importDefault(require("./Questionnairetab"));
var Scoretable_1 = tslib_1.__importDefault(require("./Scoretable"));
var Hoddecisionpanel_1 = tslib_1.__importDefault(require("./Hoddecisionpanel"));
var Commentsmodal_1 = tslib_1.__importDefault(require("./Commentsmodal"));
var UseReviewScorecard_1 = require("../hooks/UseReviewScorecard");
var SCORE_CRITERIA = [
    { field: "RelevantQualification", label: "Qualification (Relevant)" },
    { field: "ReleventExperience", label: "Experience (Relevant)" },
    { field: "Knowledge", label: "Knowledge" },
    { field: "EnergyLevel", label: "Energy Level" },
    { field: "MeetJobRequirement", label: "Meets All Job Requirements" },
    { field: "ContributeTowardsCultureRequried", label: "Will Contribute to Culture Required" },
    { field: "Experience", label: "Experience" },
    { field: "OtherCriteriaScore", label: "Other Criteria Recognized by Panel" },
];
var MField = function (_a) {
    var label = _a.label, value = _a.value;
    return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mfField },
        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mfLabel }, label),
        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mfValue }, value || "—")));
};
var CandidateReviewModal = function (_a) {
    var _b;
    var candidate = _a.candidate, reviewData = _a.reviewData, reviewLoading = _a.reviewLoading, job = _a.job, scoreData = _a.scoreData, scoreLoading = _a.scoreLoading, showComments = _a.showComments, level1Comments = _a.level1Comments, level2Comments = _a.level2Comments, commentsLoading = _a.commentsLoading, onViewComments = _a.onViewComments, onCloseComments = _a.onCloseComments, hodDecision = _a.hodDecision, decisionComment = _a.decisionComment, confirmed = _a.confirmed, selectedPositionId = _a.selectedPositionId, selectedPositionText = _a.selectedPositionText, positionOptions = _a.positionOptions, submitting = _a.submitting, submitError = _a.submitError, successMessage = _a.successMessage, errors = _a.errors, shouldShowPositionId = _a.shouldShowPositionId, onDecisionChange = _a.onDecisionChange, onCommentChange = _a.onCommentChange, onConfirmChange = _a.onConfirmChange, onPositionChange = _a.onPositionChange, onSubmit = _a.onSubmit, onClose = _a.onClose, currentRoleId = _a.currentRoleId, isLevel2Status = _a.isLevel2Status;
    var _c = React.useState(0), activePanelTab = _c[0], setActivePanelTab = _c[1];
    var _d = React.useState("questions"), activeScorecardTab = _d[0], setActiveScorecardTab = _d[1];
    // Panel members: prefer reviewData, fallback to scoreData names
    var panelMembers = React.useMemo(function () {
        var fromReview = (reviewData === null || reviewData === void 0 ? void 0 : reviewData.panelMembers) || [];
        if (fromReview.length > 0)
            return fromReview;
        return scoreData.map(function (s, i) { return s.InterviewPersonName || "Interviewer ".concat(i + 1); });
    }, [reviewData, scoreData]);
    var activeScore = scoreData[activePanelTab] || null;
    // Parse QuestionJson for active panel
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
    // Question evaluation table rows (all panels)
    var questionTableRows = React.useMemo(function () {
        var qMap = {};
        scoreData.forEach(function (s, i) {
            var qJson = Array.isArray(s.QuestionJson) ? s.QuestionJson
                : (function () { try {
                    return JSON.parse(s.QuestionJson || "[]");
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
    // Overall evaluation table rows (all panels + total)
    var overallTableRows = React.useMemo(function () {
        var rows = SCORE_CRITERIA.map(function (_a) {
            var field = _a.field, label = _a.label;
            var row = { criteria: label, total: 0 };
            scoreData.forEach(function (s, i) {
                var val = Number(s[field]) || 0;
                row["panel_".concat(i)] = val;
                row.total += val;
            });
            return row;
        });
        var totalRow = { criteria: "Total", total: 0 };
        scoreData.forEach(function (_, i) {
            var sum = rows.reduce(function (acc, r) {
                var v = r["panel_".concat(i)];
                return typeof v === "number" ? acc + v : acc;
            }, 0);
            totalRow["panel_".concat(i)] = "".concat(sum, " / 40");
        });
        totalRow.total = rows.reduce(function (acc, r) { return acc + (typeof r.total === "number" ? r.total : 0); }, 0);
        rows.push(totalRow);
        return rows;
    }, [scoreData]);
    var raw = (reviewData === null || reviewData === void 0 ? void 0 : reviewData.candidateData) || {};
    var formattedDate = (raw.InterviewDate || raw.InterviewDateLevel2 || candidate.interviewDate || "").split("T")[0] || "—";
    var nationLabel = (function () {
        var n = (candidate.nationality || "").toLowerCase();
        if (n.includes("expat"))
            return "EXPAT";
        if (n.includes("national") || n.includes("congolese") || n.includes("local"))
            return "LOCAL";
        return (candidate.nationality || "").toUpperCase() || "—";
    })();
    var userInitial = ((reviewData === null || reviewData === void 0 ? void 0 : reviewData.reviewerName) || "H").charAt(0).toUpperCase();
    var SCORECARD_TABS = [
        { key: "questions", icon: lucide_react_1.HelpCircle, label: "Interview Questionnaires" },
        { key: "qEval", icon: lucide_react_1.BarChart2, label: "Question Evaluation Scorecard" },
        { key: "overall", icon: lucide_react_1.BarChart2, label: "Overall Evaluation Scorecard" },
    ];
    return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.modalOverlay },
        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, transition: { duration: 0.2 }, className: Reviewscorecardtab_module_scss_1.default.modalWindow },
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mHeader },
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mHeaderLeft },
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mBreadcrumb },
                        React.createElement("span", null, "CANDIDATE SELECTION"),
                        React.createElement(lucide_react_1.ChevronRight, { size: 11 }),
                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mBreadcrumbActive }, "EVALUATION PREVIEW")),
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mTitleRow },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mIconBox },
                            React.createElement(lucide_react_1.Users, { size: 20 })),
                        React.createElement("div", null,
                            React.createElement("h2", { className: Reviewscorecardtab_module_scss_1.default.mTitle }, "Candidate Evaluation Review"),
                            React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.mSubtitle },
                                React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mJobCode }, (job === null || job === void 0 ? void 0 : job.jobCode) || "—"),
                                React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mDot }, "\u203A"),
                                React.createElement("span", null, ((_b = reviewData === null || reviewData === void 0 ? void 0 : reviewData.candidateData) === null || _b === void 0 ? void 0 : _b.PositionTitle) || candidate.positionTitle || "—"))))),
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mHeaderRight },
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mGpa },
                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mGpaLabel }, "OVERALL GPA"),
                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mGpaValue }, candidate.gpa || "N/A")),
                    React.createElement("button", { onClick: onClose, className: Reviewscorecardtab_module_scss_1.default.mCloseBtn },
                        React.createElement(lucide_react_1.X, { size: 20 })))),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mBody },
                React.createElement("aside", { className: Reviewscorecardtab_module_scss_1.default.mLeft },
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCandidateName }, candidate.fullName),
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCandidateType }, nationLabel),
                    reviewLoading ? (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mNoData }, "Loading info\u2026")) : (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFieldList },
                        React.createElement(MField, { label: "NATIONALITY", value: raw.Nationality || candidate.nationality || "—" }),
                        React.createElement(MField, { label: "GENDER", value: raw.Gender || candidate.gender || "—" }),
                        React.createElement(MField, { label: "QUALIFICATION", value: raw.Qualification || "—" }),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mTwoCol },
                            React.createElement(MField, { label: "MINING EXP.", value: raw.TotalYearOfExperiance || "—" }),
                            React.createElement(MField, { label: "RELATED EXP.", value: raw.ReleventExperience || "—" })),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mTwoCol },
                            React.createElement(MField, { label: "INTERVIEW DATE", value: formattedDate }),
                            React.createElement(MField, { label: "LEVELS", value: candidate.interviewLevel || "—" })),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mTwoCol },
                            React.createElement(MField, { label: "GRADE", value: candidate.grade || "—" }),
                            React.createElement(MField, { label: "CONFLICTS", value: raw.ConflictsOfInterest || "—" })),
                        React.createElement(MField, { label: "DISABILITY", value: raw.Disability || raw.disability || "—" }))),
                    panelMembers.length > 0 && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mPanelSection },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mPanelHeader },
                            React.createElement(lucide_react_1.Users, { size: 12, color: "#2563eb" }),
                            React.createElement("span", null, "INTERVIEW PANEL")),
                        panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: Reviewscorecardtab_module_scss_1.default.mPanelRow },
                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mPanelBadge }, i + 1),
                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mPanelName }, name))); })))),
                React.createElement("main", { className: Reviewscorecardtab_module_scss_1.default.mRight },
                    !scoreLoading && scoreData.length > 0 && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.panelTabBar }, scoreData.map(function (s, i) { return (React.createElement("button", { key: i, className: "".concat(Reviewscorecardtab_module_scss_1.default.panelTab, " ").concat(activePanelTab === i ? Reviewscorecardtab_module_scss_1.default.panelTabActive : ""), onClick: function () { return setActivePanelTab(i); } },
                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.panelTabNum }, i + 1),
                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.panelTabName }, panelMembers[i] || s.InterviewPersonName || "Interviewer ".concat(i + 1)))); }))),
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.scorecardTabBar }, SCORECARD_TABS.map(function (_a) {
                        var key = _a.key, Icon = _a.icon, label = _a.label;
                        return (React.createElement("button", { key: key, className: "".concat(Reviewscorecardtab_module_scss_1.default.scorecardTab, " ").concat(activeScorecardTab === key ? Reviewscorecardtab_module_scss_1.default.scorecardTabActive : ""), onClick: function () { return setActiveScorecardTab(key); } },
                            React.createElement(Icon, { size: 14 }),
                            " ",
                            label));
                    })),
                    activeScorecardTab === "questions" && (React.createElement(Questionnairetab_1.default, { questions: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.questions) || [], activeScore: activeScore, activeQJson: activeQJson, panelMemberName: panelMembers[activePanelTab] || "", fetchingQuestions: reviewLoading })),
                    activeScorecardTab === "qEval" && (React.createElement(Scoretable_1.default, { title: "QUESTION EVALUATION SCORECARD", subtitle: "Panel-wise Question Scores \u2014 All Interviewers", accentColor: "#6366f1", rows: questionTableRows, panelMembers: panelMembers, showTotal: false, emptyText: "No question data available." })),
                    activeScorecardTab === "overall" && (React.createElement(Scoretable_1.default, { title: "OVERALL EVALUATION SCORECARD", subtitle: "Core Criteria Scores \u2014 All Interviewers", accentColor: "#22c55e", rows: overallTableRows, panelMembers: panelMembers, showTotal: true, emptyText: "No scorecard data available." })),
                    React.createElement(Hoddecisionpanel_1.default, { canEdit: (0, UseReviewScorecard_1.canEdit)(candidate.statusId), isLevel2Status: isLevel2Status, statusId: candidate.statusId, hodDecision: hodDecision, decisionComment: decisionComment, confirmed: confirmed, selectedPositionId: selectedPositionId, selectedPositionText: selectedPositionText, positionOptions: positionOptions, submitting: submitting, submitError: submitError, successMessage: successMessage, reviewerName: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.reviewerName) || "", jobTitleEn: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.jobTitleEn) || "—", jobTitleFr: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.jobTitleFr) || "—", userInitial: userInitial, errors: errors, shouldShowPositionId: shouldShowPositionId, onDecisionChange: onDecisionChange, onCommentChange: onCommentChange, onConfirmChange: onConfirmChange, onPositionChange: onPositionChange, onViewComments: onViewComments, onSubmit: function () { return onSubmit(currentRoleId); }, onClose: onClose })))),
        React.createElement(Commentsmodal_1.default, { open: showComments, loading: commentsLoading, level1: level1Comments, level2: level2Comments, onClose: onCloseComments })));
};
exports.default = CandidateReviewModal;
//# sourceMappingURL=Candidatereviewmodal.js.map