"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var QuestionnaireTab_1 = tslib_1.__importDefault(require("./QuestionnaireTab"));
var ScoreTable_1 = tslib_1.__importDefault(require("./ScoreTable"));
var HODDecisionPanel_1 = tslib_1.__importDefault(require("./HODDecisionPanel"));
var Commentsmodal_1 = tslib_1.__importDefault(require("./Commentsmodal"));
var useReviewScorecard_1 = require("../Hooks/useReviewScorecard");
var reuseUI_1 = require("../../CandidateTable/Components/reuseUI");
// ─── Constants ───────────────────────────────────────────────────────────────
var SCORE_CRITERIA = [
    { field: "RelevantQualification", label: "Qualification (Relevant)" },
    { field: "ReleventExperience", label: "Experience (Relevant)" },
    { field: "Knowledge", label: "Knowledge" },
    { field: "EnergyLevel", label: "Energy Level" },
    { field: "MeetJobRequirement", label: "Meets All Job Requirements" },
    {
        field: "ContributeTowardsCultureRequried",
        label: "Will Contribute to Culture Required",
    },
    { field: "Experience", label: "Experience" },
    { field: "OtherCriteriaScore", label: "Other Criteria Recognized by Panel" },
];
var MAX_OVERALL_PER_PANEL = 40;
// ─── Sub-component ────────────────────────────────────────────────────────────
var MField = function (_a) {
    var label = _a.label, value = _a.value;
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mfField },
        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mfLabel }, label),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mfValue }, value || "—")));
};
// ─── Main Component ───────────────────────────────────────────────────────────
var CandidateReviewModal = function (_a) {
    var _b, _c;
    var candidate = _a.candidate, reviewData = _a.reviewData, reviewLoading = _a.reviewLoading, job = _a.job, scoreData = _a.scoreData, scoreLoading = _a.scoreLoading, showComments = _a.showComments, level1Comments = _a.level1Comments, level2Comments = _a.level2Comments, commentsLoading = _a.commentsLoading, onViewComments = _a.onViewComments, onCloseComments = _a.onCloseComments, hodDecision = _a.hodDecision, decisionComment = _a.decisionComment, confirmed = _a.confirmed, selectedPositionId = _a.selectedPositionId, selectedPositionText = _a.selectedPositionText, positionOptions = _a.positionOptions, submitting = _a.submitting, submitError = _a.submitError, successMessage = _a.successMessage, errors = _a.errors, shouldShowPositionId = _a.shouldShowPositionId, onDecisionChange = _a.onDecisionChange, onCommentChange = _a.onCommentChange, onConfirmChange = _a.onConfirmChange, onPositionChange = _a.onPositionChange, onClose = _a.onClose, currentRoleId = _a.currentRoleId, isLevel2Status = _a.isLevel2Status, submitDeps = _a.submitDeps;
    // ── Local state ────────────────────────────────────────────────────────────
    var _d = React.useState(0), activePanelTab = _d[0], setActivePanelTab = _d[1];
    var _e = React.useState("questions"), activeScorecardTab = _e[0], setActiveScorecardTab = _e[1];
    // ── Derived data ───────────────────────────────────────────────────────────
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
                : (function () {
                    try {
                        return JSON.parse(s.QuestionJson || "[]");
                    }
                    catch (_a) {
                        return [];
                    }
                })();
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
        var totalRow = { criteria: "Total", total: 0 };
        (scoreData || []).forEach(function (_, i) {
            var sum = rows.reduce(function (acc, r) {
                var v = r["panel_".concat(i)];
                return typeof v === "number" ? acc + v : acc;
            }, 0);
            totalRow["panel_".concat(i)] = "".concat(sum, " / ").concat(MAX_OVERALL_PER_PANEL);
        });
        totalRow.total = rows.reduce(function (acc, r) { return acc + (typeof r.total === "number" ? r.total : 0); }, 0);
        rows.push(totalRow);
        return rows;
    }, [scoreData]);
    // ── Helpers ────────────────────────────────────────────────────────────────
    var raw = (reviewData === null || reviewData === void 0 ? void 0 : reviewData.candidateData) || {};
    var formattedDate = (raw.InterviewDate ||
        raw.InterviewDateLevel2 ||
        candidate.interviewDate ||
        "").split("T")[0] || "";
    var nationLabel = (function () {
        var n = (candidate.nationality || "").toLowerCase();
        if (n.includes("expat"))
            return "EXPAT";
        if (n.includes("national") ||
            n.includes("congolese") ||
            n.includes("local"))
            return "LOCAL";
        return (candidate.nationality || "").toUpperCase() || "";
    })();
    var userInitial = ((reviewData === null || reviewData === void 0 ? void 0 : reviewData.reviewerName) || "").charAt(0).toUpperCase();
    var safeLevel1 = Array.isArray(level1Comments) ? level1Comments : [];
    var safeLevel2 = Array.isArray(level2Comments) ? level2Comments : [];
    // ── Render ─────────────────────────────────────────────────────────────────
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" }, onClick: function (e) { return e.stopPropagation(); } },
        React.createElement("header", { className: ReviewScorecard_module_scss_1.default.header },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.headerLeft },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.headerIcon },
                    React.createElement(lucide_react_1.User, { size: 24 })),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.headerMeta },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.breadcrumb },
                        React.createElement("span", null, "Candidate selection"),
                        React.createElement(lucide_react_1.ChevronRight, { size: 12, className: ReviewScorecard_module_scss_1.default.breadcrumbChevron }),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.breadcrumbActive }, "Review Scorecard")),
                    React.createElement("h2", { className: ReviewScorecard_module_scss_1.default.headerTitle }, "Candidate Scorecard Review"),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.headerSubtitle },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.jobCodeBadge }, candidate.jobCode || "---"),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.headerDot }),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.headerJobTitle }, candidate.positionTitle || "---")))),
            React.createElement("div", null,
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeaderRight },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mGpa },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaLabel }, "OVERALL GPA"),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaValue }, candidate.gpa || "—")),
                    React.createElement("button", { className: ReviewScorecard_module_scss_1.default.closeBtn, type: "button", onClick: onClose, "aria-label": "Close" },
                        React.createElement(lucide_react_1.X, { size: 20, strokeWidth: 2.5 }))))),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mBody },
            React.createElement("aside", { className: ReviewScorecard_module_scss_1.default.sidebar },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.avatarSection },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.avatar }, ((_b = candidate.fullName) !== null && _b !== void 0 ? _b : "A").charAt(0)),
                    React.createElement("h3", { className: ReviewScorecard_module_scss_1.default.avatarName }, (_c = candidate.fullName) !== null && _c !== void 0 ? _c : "--"),
                    React.createElement("span", { className: ReviewScorecard_module_scss_1.default.avatarNationality }, nationLabel !== null && nationLabel !== void 0 ? nationLabel : "--")),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoGrid },
                    React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.Globe, { size: 14 }), label: "Nationality", value: raw.Nationality || candidate.nationality || "" }),
                    React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.Users, { size: 14 }), label: "Gender", value: raw.Gender || candidate.gender || "" }),
                    React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.FileText, { size: 14 }), label: "Qualification", value: raw.Qualification || "" }),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRow },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRowItem },
                            React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.Zap, { size: 14 }), label: "Mining exp.", value: raw.TotalYearOfExperiance || "" })),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRowItem },
                            React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.Zap, { size: 14 }), label: "Related exp.", value: raw.ReleventExperience || "" }))),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRow },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRowItem },
                            React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.AlertTriangle, { size: 14 }), label: "Conflicts", value: raw.ConflictsOfInterest || "" })),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRowItem },
                            React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.Accessibility, { size: 14 }), label: "Disability", value: raw.Disability || raw.disability || "" }))),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRow },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRowItem },
                            React.createElement(reuseUI_1.InfoItem, { label: "Levels", value: candidate.interviewLevel || "" })),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRowItem },
                            React.createElement(reuseUI_1.InfoItem, { label: "Interview Date", value: formattedDate }))),
                    React.createElement(reuseUI_1.InfoItem, { label: "GRADE", value: candidate.grade || "" })),
                panelMembers.length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelSection },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelHeader },
                        React.createElement(lucide_react_1.Users, { size: 12, color: "#2563eb" }),
                        React.createElement("span", null, "INTERVIEW PANEL")),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelList }, panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: ReviewScorecard_module_scss_1.default.mPanelRow },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelBadge }, i + 1),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelName }, name))); }))))),
            React.createElement("main", { className: ReviewScorecard_module_scss_1.default.mRight },
                !scoreLoading && (scoreData || []).length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.panelTabBar }, (scoreData || []).map(function (s, i) { return (React.createElement("button", { key: i, type: "button", className: "".concat(ReviewScorecard_module_scss_1.default.panelTab, " ").concat(activePanelTab === i ? ReviewScorecard_module_scss_1.default.panelTabActive : ""), onClick: function () { return setActivePanelTab(i); } },
                    React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabNum }, i + 1),
                    React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabName }, panelMembers[i] ||
                        s.InterviewPersonName ||
                        "Interviewer ".concat(i + 1)))); }))),
                activeScorecardTab === "questions" && (React.createElement(QuestionnaireTab_1.default, { questions: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.questions) || [], activeScore: activeScore, activeQJson: activeQJson, panelMemberName: panelMembers[activePanelTab] || "", fetchingQuestions: reviewLoading })),
                activeScorecardTab === "qEval" && (React.createElement(ScoreTable_1.default, { title: "QUESTION EVALUATION SCORECARD", subtitle: "Panel-wise Question Scores \u2014 All Interviewers", accentColor: "#6366f1", rows: questionTableRows, panelMembers: panelMembers, showTotal: false, emptyText: "No question data available." })),
                activeScorecardTab === "overall" && (React.createElement(ScoreTable_1.default, { title: "OVERALL EVALUATION SCORECARD", subtitle: "Core Criteria Scores \u2014 All Interviewers (Max 5 per criterion)", accentColor: "#22c55e", rows: overallTableRows, panelMembers: panelMembers, showTotal: true, emptyText: "No scorecard data available." })),
                React.createElement(HODDecisionPanel_1.default, { canEdit: (0, useReviewScorecard_1.canEdit)(candidate.statusId), isLevel2Status: isLevel2Status, statusId: candidate.statusId, hodDecision: hodDecision, decisionComment: decisionComment, confirmed: confirmed, selectedPositionId: selectedPositionId, selectedPositionText: selectedPositionText, positionOptions: positionOptions || [], submitting: submitting, submitError: submitError, successMessage: successMessage, reviewerName: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.reviewerName) || "", jobTitleEn: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.jobTitleEn) || "", jobTitleFr: (reviewData === null || reviewData === void 0 ? void 0 : reviewData.jobTitleFr) || "", userInitial: userInitial, errors: errors, shouldShowPositionId: shouldShowPositionId, onDecisionChange: onDecisionChange, onCommentChange: onCommentChange, onConfirmChange: onConfirmChange, onPositionChange: onPositionChange, onViewComments: onViewComments, onClose: onClose, submitDeps: submitDeps, roleId: currentRoleId }))),
        React.createElement(Commentsmodal_1.default, { open: showComments, loading: commentsLoading, level1: safeLevel1, level2: safeLevel2, onClose: onCloseComments })));
};
exports.default = CandidateReviewModal;
//# sourceMappingURL=CandidateReviewModal.js.map