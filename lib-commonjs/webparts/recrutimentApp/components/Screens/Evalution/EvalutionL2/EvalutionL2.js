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
var react_router_dom_1 = require("react-router-dom");
var fetchCandidateValue_1 = require("./Hooks/fetchCandidateValue");
var ReviewCommentSignature_1 = require("../../RecruitmentTable/Components/ReviewCommentSignature");
var getSignatureDetails_1 = require("../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails");
var Usesubmitevaluationl2_1 = require("./Hooks/Usesubmitevaluationl2");
var ModalPopup_1 = require("../../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
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
var PageLoader = function () { return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.modalOverlay },
    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.modalWindow, style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 320,
        } },
        React.createElement("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
            } },
            React.createElement(lucide_react_1.Loader2, { size: 36, style: { animation: "spin 1s linear infinite", color: "#2563eb" } }),
            React.createElement("span", { style: { fontSize: 14, color: "#64748b", fontWeight: 500 } }, "Loading candidate data\u2026"))),
    React.createElement("style", null, "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"))); };
var EvalutionL2 = function (props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var ID = props.ID;
    var RecrutimentID = props.RecruitmentID;
    var hook = (0, fetchCandidateValue_1.fetchCandidateValue)(ID, RecrutimentID);
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _p = (0, useModalPopup_1.useModalPopup)(), modalState = _p.modalState, showModal = _p.showModal, closeModal = _p.closeModal;
    // ── tab state ────────────────────────────────────────────────────────────────
    var _q = React.useState(0), activePanelTab = _q[0], setActivePanelTab = _q[1];
    var _r = React.useState("questions"), activeScorecardTab = _r[0], setActiveScorecardTab = _r[1];
    // ── signature ────────────────────────────────────────────────────────────────
    var _s = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _s.data, signatureLoading = _s.loading;
    // ── navigation callback ──────────────────────────────────────────────────────
    var onClose = React.useCallback(function () { return navigate("/Recruitment"); }, [navigate]);
    var successModel = function () {
        showModal({
            type: "success",
            title: "Success",
            message: ConditionConfig_1.RecuritmentHRMsg.ScoreCardMsgLevel2,
            confirmLabel: "Go to Dashboard",
            onConfirm: function () {
                closeModal();
                onClose();
            },
        });
    };
    var submitHook = (0, Usesubmitevaluationl2_1.useSubmitEvaluationL2)({
        candidateId: ID,
        panelId: (_b = (_a = hook.reviewData) === null || _a === void 0 ? void 0 : _a.currentUserPanelId) !== null && _b !== void 0 ? _b : 0,
        onSuccess: successModel,
    });
    var panelMembers = React.useMemo(function () {
        var _a;
        var fromReview = ((_a = hook.reviewData) === null || _a === void 0 ? void 0 : _a.panelMembers) || [];
        console.log();
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
    var raw = ((_c = hook.reviewData) === null || _c === void 0 ? void 0 : _c.candidateData) || {};
    var formattedDate = (raw.InterviewDate ||
        raw.InterviewDateLevel2 ||
        ((_d = hook.reviewingCandidate) === null || _d === void 0 ? void 0 : _d.interviewDate) ||
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
    var safeLevel1 = Array.isArray(hook.level1Comments)
        ? hook.level1Comments
        : [];
    var safeLevel2 = Array.isArray(hook.level2Comments)
        ? hook.level2Comments
        : [];
    // ── Global page loading guard ─────────────────────────────────────────────────
    // Show loader until ALL three data sources have resolved
    if (hook.candidatesLoading || hook.scoreLoading || hook.reviewLoading) {
        return React.createElement(PageLoader, null);
    }
    // ── Render ────────────────────────────────────────────────────────────────────
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.modalOverlay },
        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, transition: { duration: 0.2 }, className: ReviewScorecard_module_scss_1.default.modalWindow },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeader },
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeaderLeft },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mBreadcrumb },
                        React.createElement("span", null, "CANDIDATE SELECTION"),
                        React.createElement(lucide_react_1.ChevronRight, { size: 11 }),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mBreadcrumbActive }, "Evaluation Level 2")),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTitleRow },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mIconBox },
                            React.createElement(lucide_react_1.Users, { size: 20 })),
                        React.createElement("div", null,
                            React.createElement("h2", { className: ReviewScorecard_module_scss_1.default.mTitle }, "Candidate Details"),
                            React.createElement("p", { className: ReviewScorecard_module_scss_1.default.mSubtitle },
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mJobCode }, ((_e = hook.reviewingCandidate) === null || _e === void 0 ? void 0 : _e.jobCode) || ""),
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mDot }, "\u203A"),
                                React.createElement("span", null, (raw === null || raw === void 0 ? void 0 : raw.PositionTitle) ||
                                    ((_f = hook.reviewingCandidate) === null || _f === void 0 ? void 0 : _f.positionTitle) ||
                                    ""))))),
                React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeaderRight },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mGpa },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaLabel }, "OVERALL GPA"),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaValue }, ((_g = hook.reviewingCandidate) === null || _g === void 0 ? void 0 : _g.gpa) || "—")),
                    React.createElement("button", { onClick: onClose, className: ReviewScorecard_module_scss_1.default.mCloseBtn, disabled: submitHook.submitting },
                        React.createElement(lucide_react_1.X, { size: 20 })))),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mBody },
                React.createElement("aside", { className: ReviewScorecard_module_scss_1.default.mLeft },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mLeftCard },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mCandidateName }, (_h = hook.reviewingCandidate) === null || _h === void 0 ? void 0 : _h.fullName),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mCandidateType }, nationLabel),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFieldList },
                            React.createElement(MField, { label: "NATIONALITY", value: raw.Nationality ||
                                    ((_j = hook.reviewingCandidate) === null || _j === void 0 ? void 0 : _j.nationality) ||
                                    "" }),
                            React.createElement(MField, { label: "GENDER", value: raw.Gender || ((_k = hook.reviewingCandidate) === null || _k === void 0 ? void 0 : _k.gender) || "" }),
                            React.createElement(MField, { label: "QUALIFICATION", value: raw.Qualification || "" }),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "MINING EXP.", value: raw.TotalYearOfExperiance || "" }),
                                React.createElement(MField, { label: "RELATED EXP.", value: raw.ReleventExperience || "" })),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "INTERVIEW DATE", value: formattedDate }),
                                React.createElement(MField, { label: "LEVELS", value: ((_l = hook.reviewingCandidate) === null || _l === void 0 ? void 0 : _l.interviewLevel) || "" })),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mTwoCol },
                                React.createElement(MField, { label: "GRADE", value: ((_m = hook.reviewingCandidate) === null || _m === void 0 ? void 0 : _m.grade) || "" }),
                                React.createElement(MField, { label: "CONFLICTS", value: raw.ConflictsOfInterest || "" })),
                            React.createElement(MField, { label: "DISABILITY", value: raw.Disability || raw.disability || "" })),
                        panelMembers.length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelSection },
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelHeader },
                                React.createElement(lucide_react_1.Users, { size: 12, color: "#2563eb" }),
                                React.createElement("span", null, "INTERVIEW PANEL")),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelList }, panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: ReviewScorecard_module_scss_1.default.mPanelRow },
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelBadge }, i + 1),
                                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelName }, name))); })))))),
                React.createElement("main", { className: ReviewScorecard_module_scss_1.default.mRight },
                    (hook.scoreData || []).length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.panelTabBar }, (hook.scoreData || []).map(function (s, i) { return (React.createElement("button", { key: i, className: "".concat(ReviewScorecard_module_scss_1.default.panelTab, " ").concat(activePanelTab === i ? ReviewScorecard_module_scss_1.default.panelTabActive : ""), onClick: function () { return setActivePanelTab(i); }, type: "button" },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabNum }, i + 1),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabName }, panelMembers[i] ||
                            s.InterviewPersonName ||
                            "Interviewer ".concat(i + 1)))); }))),
                    activeScorecardTab === "questions" && (React.createElement(QuestionnaireTab_1.default, { questions: ((_o = hook.reviewData) === null || _o === void 0 ? void 0 : _o.questions) || [], activeScore: activeScore, activeQJson: activeQJson, panelMemberName: panelMembers[activePanelTab] || "", fetchingQuestions: hook.reviewLoading })),
                    activeScorecardTab === "qEval" && (React.createElement(ScoreTable_1.default, { title: "QUESTION EVALUATION SCORECARD", subtitle: "Panel-wise Question Scores \u2014 All Interviewers", accentColor: "#6366f1", rows: questionTableRows, panelMembers: panelMembers, showTotal: false, emptyText: "No question data available." })),
                    activeScorecardTab === "overall" && (React.createElement(ScoreTable_1.default, { title: "OVERALL EVALUATION SCORECARD", subtitle: "Core Criteria Scores \u2014 All Interviewers (Max 5 per criterion)", accentColor: "#22c55e", rows: overallTableRows, panelMembers: panelMembers, showTotal: true, emptyText: "No scorecard data available." })),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mFormGroup },
                        React.createElement("button", { onClick: hook.openComments, className: ReviewScorecard_module_scss_1.default.mSubmitBtn, type: "button" },
                            React.createElement(lucide_react_1.FileText, { size: 16 }),
                            "VIEW COMMENTS")),
                    React.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: submitHook.comments, acknowledgementCheckbox: submitHook.acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: signatureLoading, onCommentsChange: submitHook.onCommentsChange, onToggleAcknowledgement: submitHook.onToggleAcknowledgement, commentError: submitHook.commentError, checkboxError: submitHook.checkboxError, disabled: submitHook.isSubmittingRef.current }),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mActionBtn, style: { background: "white", justifyContent: "flex-end" } },
                        React.createElement("button", { className: ReviewScorecard_module_scss_1.default.mCancelBtn, onClick: onClose, disabled: submitHook.submitting, type: "button" }, "CANCEL"),
                        React.createElement("button", { className: ReviewScorecard_module_scss_1.default.mSubmitBtn, onClick: submitHook.handleSubmitClick, disabled: submitHook.submitting, type: "button" }, submitHook.submitting ? (React.createElement(React.Fragment, null,
                            React.createElement(lucide_react_1.Loader2, { size: 15, style: {
                                    marginRight: 6,
                                    animation: "spin 1s linear infinite",
                                } }),
                            "Submitting\u2026")) : (React.createElement(React.Fragment, null,
                            React.createElement(lucide_react_1.CheckCircle2, { size: 15, style: { marginRight: 6 } }),
                            "SUBMIT ACTION"))))))),
        React.createElement("style", null, "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"),
        React.createElement(Commentsmodal_1.default, { open: hook === null || hook === void 0 ? void 0 : hook.showComments, loading: hook.commentsLoading, level1: safeLevel1, level2: safeLevel2, onClose: hook.closeReview }),
        React.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))));
};
exports.default = EvalutionL2;
//# sourceMappingURL=EvalutionL2.js.map