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
var reuseUI_1 = require("../../CandidateTable/Components/reuseUI");
var loading_1 = tslib_1.__importDefault(require("../../../Comman/Loading/loading"));
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
var PageLoader = function () { return React.createElement(loading_1.default, { text: "Loading data" }); };
var EvalutionL2 = function (props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var ID = props.ID;
    var RecrutimentID = props.RecruitmentID;
    var hook = (0, fetchCandidateValue_1.fetchCandidateValue)(ID, RecrutimentID);
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _s = (0, useModalPopup_1.useModalPopup)(), modalState = _s.modalState, showModal = _s.showModal, closeModal = _s.closeModal;
    // ── tab state ────────────────────────────────────────────────────────────────
    var _t = React.useState(0), activePanelTab = _t[0], setActivePanelTab = _t[1];
    var _u = React.useState("questions"), activeScorecardTab = _u[0], setActiveScorecardTab = _u[1];
    // ── signature ────────────────────────────────────────────────────────────────
    var _v = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _v.data, signatureLoading = _v.loading;
    // ── navigation callback ──────────────────────────────────────────────────────
    var onClose = React.useCallback(function () { return navigate("/MyTracker"); }, [navigate]);
    var successModel = function () {
        showModal({
            type: "success",
            title: "Success",
            message: ConditionConfig_1.RecuritmentHRMsg.ScoreCardMsgLevel2,
            confirmLabel: "Go to Dashboard",
            onConfirm: function () {
                closeModal();
                navigate("/Dashboard");
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
    if (hook.candidatesLoading || hook.scoreLoading || hook.reviewLoading) {
        return React.createElement(PageLoader, null);
    }
    var loading = !hook.candidates ||
        hook.reviewLoading || // covers reviewData?.questions + candidateData
        hook.scoreLoading || // covers scoreData
        !hook.scoreData;
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.modalOverlay },
        submitHook.submitting && React.createElement(loading_1.default, null),
        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, transition: { duration: 0.2 }, className: ReviewScorecard_module_scss_1.default.modalWindow },
            loading && React.createElement(loading_1.default, { text: "Loading details..." }),
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
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.jobCodeBadge }, ((_e = hook.reviewingCandidate) === null || _e === void 0 ? void 0 : _e.jobCode) || "---"),
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.headerDot }),
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.headerJobTitle }, ((_f = hook.reviewingCandidate) === null || _f === void 0 ? void 0 : _f.positionTitle) || "---")))),
                React.createElement("div", null,
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mHeaderRight },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mGpa },
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaLabel }, "OVERALL GPA"),
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mGpaValue }, ((_g = hook.reviewingCandidate) === null || _g === void 0 ? void 0 : _g.gpa) || "—")),
                        React.createElement("button", { className: ReviewScorecard_module_scss_1.default.closeBtn, type: "button", onClick: onClose, "aria-label": "Close" },
                            React.createElement(lucide_react_1.X, { size: 20, strokeWidth: 2.5 }))))),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mBody },
                React.createElement("aside", { className: ReviewScorecard_module_scss_1.default.sidebar },
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.avatarSection },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.avatar }, ((_j = (_h = hook.reviewingCandidate) === null || _h === void 0 ? void 0 : _h.fullName) !== null && _j !== void 0 ? _j : "A").charAt(0)),
                        React.createElement("h3", { className: ReviewScorecard_module_scss_1.default.avatarName }, (_l = (_k = hook.reviewingCandidate) === null || _k === void 0 ? void 0 : _k.fullName) !== null && _l !== void 0 ? _l : "--"),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.avatarNationality }, nationLabel !== null && nationLabel !== void 0 ? nationLabel : "--")),
                    React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoGrid },
                        React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.Globe, { size: 14 }), label: "Nationality", value: raw.Nationality || ((_m = hook.reviewingCandidate) === null || _m === void 0 ? void 0 : _m.nationality) || "" }),
                        React.createElement(reuseUI_1.InfoItem, { icon: React.createElement(lucide_react_1.Users, { size: 14 }), label: "Gender", value: raw.Gender || ((_o = hook.reviewingCandidate) === null || _o === void 0 ? void 0 : _o.gender) || "" }),
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
                                React.createElement(reuseUI_1.InfoItem, { label: "Levels", value: ((_p = hook.reviewingCandidate) === null || _p === void 0 ? void 0 : _p.interviewLevel) || "" })),
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoRowItem },
                                React.createElement(reuseUI_1.InfoItem, { label: "Interview Date", value: formattedDate }))),
                        React.createElement(reuseUI_1.InfoItem, { label: "GRADE", value: ((_q = hook.reviewingCandidate) === null || _q === void 0 ? void 0 : _q.grade) || "" })),
                    panelMembers.length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelSection },
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelHeader },
                            React.createElement(lucide_react_1.Users, { size: 12, color: "#2563eb" }),
                            React.createElement("span", null, "INTERVIEW PANEL")),
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.mPanelList }, panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: ReviewScorecard_module_scss_1.default.mPanelRow },
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelBadge }, i + 1),
                            React.createElement("span", { className: ReviewScorecard_module_scss_1.default.mPanelName }, name))); }))))),
                React.createElement("main", { className: ReviewScorecard_module_scss_1.default.mRight },
                    (hook.scoreData || []).length > 0 && (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.panelTabBar }, (hook.scoreData || []).map(function (s, i) { return (React.createElement("button", { key: i, className: "".concat(ReviewScorecard_module_scss_1.default.panelTab, " ").concat(activePanelTab === i ? ReviewScorecard_module_scss_1.default.panelTabActive : ""), onClick: function () { return setActivePanelTab(i); }, type: "button" },
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabNum }, i + 1),
                        React.createElement("span", { className: ReviewScorecard_module_scss_1.default.panelTabName }, panelMembers[i] ||
                            s.InterviewPersonName ||
                            "Interviewer ".concat(i + 1)))); }))),
                    activeScorecardTab === "questions" && (React.createElement(QuestionnaireTab_1.default, { questions: ((_r = hook.reviewData) === null || _r === void 0 ? void 0 : _r.questions) || [], activeScore: activeScore, activeQJson: activeQJson, panelMemberName: panelMembers[activePanelTab] || "", fetchingQuestions: hook.reviewLoading })),
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