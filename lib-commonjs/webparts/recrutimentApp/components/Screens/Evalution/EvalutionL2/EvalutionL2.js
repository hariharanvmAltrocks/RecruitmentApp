"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../../ReviewScoreCard/ReviewScorecard.module.scss"));
var QuestionnaireTab_1 = tslib_1.__importDefault(require("../../ReviewScoreCard/Components/QuestionnaireTab"));
var ScoreTable_1 = tslib_1.__importDefault(require("../../ReviewScoreCard/Components/ScoreTable"));
var Commentsmodal_1 = tslib_1.__importDefault(require("../../ReviewScoreCard/Components/Commentsmodal"));
var useReviewScorecard_1 = require("../../ReviewScoreCard/Hooks/useReviewScorecard");
var react_router_dom_1 = require("react-router-dom");
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
var MField = function (_a) {
    var label = _a.label, value = _a.value;
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mfField },
        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mfLabel }, label),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mfValue }, value || "—")));
};
var EvalutionL2 = function (props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var ID = props.ID;
    var EmailId = props.EmailID;
    var hook = (0, useReviewScorecard_1.useReviewScorecard)(ID, EmailId, "", true);
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _o = React.useState(0), activePanelTab = _o[0], setActivePanelTab = _o[1];
    var _p = React.useState("questions"), activeScorecardTab = _p[0], setActiveScorecardTab = _p[1];
    var onClose = function () {
        navigate("/RecruitmentTable");
    };
    var panelMembers = React.useMemo(function () {
        var _a;
        var fromReview = ((_a = hook.reviewData) === null || _a === void 0 ? void 0 : _a.panelMembers) || [];
        if (fromReview.length > 0)
            return fromReview;
        return (hook.scoreData || []).map(function (s, i) { return s.InterviewPersonName || "Interviewer ".concat(i + 1); });
    }, [hook.reviewData, hook.scoreData]);
    var activeScore = (hook.scoreData || [])[activePanelTab] || null;
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
        (hook.scoreData || []).forEach(function (s, i) {
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
    }, [hook.scoreData]);
    var overallTableRows = React.useMemo(function () {
        var rows = SCORE_CRITERIA.map(function (_a) {
            var field = _a.field, label = _a.label;
            var row = { criteria: label, total: 0 };
            (hook.scoreData || []).forEach(function (s, i) {
                var val = Number(s[field]) || 0;
                row["panel_".concat(i)] = val;
                row.total += val;
            });
            return row;
        });
        var totalRow = { criteria: "Total", total: 0 };
        (hook.scoreData || []).forEach(function (_, i) {
            var sum = rows.reduce(function (acc, r) {
                var v = r["panel_".concat(i)];
                return typeof v === "number" ? acc + v : acc;
            }, 0);
            totalRow["panel_".concat(i)] = "".concat(sum, " / ").concat(MAX_OVERALL_PER_PANEL);
        });
        totalRow.total = rows.reduce(function (acc, r) { return acc + (typeof r.total === "number" ? r.total : 0); }, 0);
        rows.push(totalRow);
        return rows;
    }, [hook.scoreData]);
    var raw = ((_a = hook.reviewData) === null || _a === void 0 ? void 0 : _a.candidateData) || {};
    var formattedDate = (raw.InterviewDate ||
        raw.InterviewDateLevel2 ||
        ((_b = hook.reviewingCandidate) === null || _b === void 0 ? void 0 : _b.interviewDate) ||
        "").split("T")[0] || "";
    var nationLabel = (function () {
        var _a, _b;
        var n = (((_a = hook.reviewingCandidate) === null || _a === void 0 ? void 0 : _a.nationality) || "").toLowerCase();
        if (n.includes("expat"))
            return "EXPAT";
        if (n.includes("national") ||
            n.includes("congolese") ||
            n.includes("local"))
            return "LOCAL";
        return (((_b = hook.reviewingCandidate) === null || _b === void 0 ? void 0 : _b.nationality) || "").toUpperCase() || "";
    })();
    var userInitial = (((_c = hook.reviewData) === null || _c === void 0 ? void 0 : _c.reviewerName) || "")
        .charAt(0)
        .toUpperCase();
    var safeLevel1 = Array.isArray(hook.level1Comments)
        ? hook.level1Comments
        : [];
    var safeLevel2 = Array.isArray(hook.level2Comments)
        ? hook.level2Comments
        : [];
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.modalOverlay },
        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, transition: { duration: 0.2 }, className: ReviewScorecard_module_scss_1.default.modalWindow },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeader },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeaderLeft },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mBreadcrumb },
                        React.createElement("span", null, "CANDIDATE SELECTION"),
                        React.createElement(lucide_react_1.ChevronRight, { size: 11 }),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mBreadcrumbActive },
                            "Review score card",
                            " ")),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTitleRow },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mIconBox },
                            React.createElement(lucide_react_1.Users, { size: 20 })),
                        React.createElement("div", null,
                            React.createElement("h2", { className: ReviewScorecard_module_scss_1.default.mTitle }, "Candidate Details"),
                            React.createElement("p", { className: ReviewScorecard_module_scss_1.default.mSubtitle },
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mJobCode }, ((_d = hook.reviewingCandidate) === null || _d === void 0 ? void 0 : _d.jobCode) || ""),
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mDot }, "\u203A"),
                                React.createElement("span", null, (raw === null || raw === void 0 ? void 0 : raw.PositionTitle) ||
                                    ((_e = hook.reviewingCandidate) === null || _e === void 0 ? void 0 : _e.positionTitle) ||
                                    ""))))),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeaderRight },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mGpa },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaLabel }, "OVERALL GPA"),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaValue }, ((_f = hook.reviewingCandidate) === null || _f === void 0 ? void 0 : _f.gpa) || "—")),
                    React.createElement("button", { onClick: onClose, className: ReviewScorecard_module_scss_1.default.mCloseBtn },
                        React.createElement(lucide_react_1.X, { size: 20 })))),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mBody },
                React.createElement("aside", { className: ReviewScorecard_module_scss_1.default.mLeft },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mLeftCard },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mCandidateName }, (_g = hook.reviewingCandidate) === null || _g === void 0 ? void 0 : _g.fullName),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mCandidateType }, nationLabel),
                        hook.reviewLoading ? (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mNoData }, "Loading info...")) : (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFieldList },
                            React.createElement(MField, { label: "NATIONALITY", value: raw.Nationality ||
                                    ((_h = hook.reviewingCandidate) === null || _h === void 0 ? void 0 : _h.nationality) ||
                                    "" }),
                            React.createElement(MField, { label: "GENDER", value: raw.Gender || ((_j = hook.reviewingCandidate) === null || _j === void 0 ? void 0 : _j.gender) || "" }),
                            React.createElement(MField, { label: "QUALIFICATION", value: raw.Qualification || "" }),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "MINING EXP.", value: raw.TotalYearOfExperiance || "" }),
                                React.createElement(MField, { label: "RELATED EXP.", value: raw.ReleventExperience || "" })),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "INTERVIEW DATE", value: formattedDate }),
                                React.createElement(MField, { label: "LEVELS", value: ((_k = hook.reviewingCandidate) === null || _k === void 0 ? void 0 : _k.interviewLevel) || "" })),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "GRADE", value: ((_l = hook.reviewingCandidate) === null || _l === void 0 ? void 0 : _l.grade) || "" }),
                                React.createElement(MField, { label: "CONFLICTS", value: raw.ConflictsOfInterest || "" })),
                            React.createElement(MField, { label: "DISABILITY", value: raw.Disability || raw.disability || "" }))),
                        panelMembers.length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelSection },
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelHeader },
                                React.createElement(lucide_react_1.Users, { size: 12, color: "#2563eb" }),
                                React.createElement("span", null, "INTERVIEW PANEL")),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelList }, panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: ReviewScorecard_module_scss_1.default.mPanelRow },
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelBadge }, i + 1),
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelName }, name))); })))))),
                React.createElement("main", { className: ReviewScorecard_module_scss_1.default.mRight },
                    !hook.scoreLoading && (hook.scoreData || []).length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.panelTabBar }, (hook.scoreData || []).map(function (s, i) { return (React.createElement("button", { key: i, className: "".concat(ReviewScorecard_module_scss_1.default.panelTab, " ").concat(activePanelTab === i ? ReviewScorecard_module_scss_1.default.panelTabActive : ""), onClick: function () { return setActivePanelTab(i); }, type: "button" },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabNum }, i + 1),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabName }, panelMembers[i] ||
                            s.InterviewPersonName ||
                            "Interviewer ".concat(i + 1)))); }))),
                    activeScorecardTab === "questions" && (React.createElement(QuestionnaireTab_1.default, { questions: ((_m = hook.reviewData) === null || _m === void 0 ? void 0 : _m.questions) || [], activeScore: activeScore, activeQJson: activeQJson, panelMemberName: panelMembers[activePanelTab] || "", fetchingQuestions: hook.reviewLoading })),
                    activeScorecardTab === "qEval" && (React.createElement(ScoreTable_1.default, { title: "QUESTION EVALUATION SCORECARD", subtitle: "Panel-wise Question Scores \u2014 All Interviewers", accentColor: "#6366f1", rows: questionTableRows, panelMembers: panelMembers, showTotal: false, emptyText: "No question data available." })),
                    activeScorecardTab === "overall" && (React.createElement(ScoreTable_1.default, { title: "OVERALL EVALUATION SCORECARD", subtitle: "Core Criteria Scores \u2014 All Interviewers (Max 5 per criterion)", accentColor: "#22c55e", rows: overallTableRows, panelMembers: panelMembers, showTotal: true, emptyText: "No scorecard data available." }))))),
        React.createElement(Commentsmodal_1.default, { open: hook === null || hook === void 0 ? void 0 : hook.showComments, loading: hook.commentsLoading, level1: safeLevel1, level2: safeLevel2, onClose: hook.closeReview })));
};
exports.default = EvalutionL2;
//# sourceMappingURL=EvalutionL2.js.map