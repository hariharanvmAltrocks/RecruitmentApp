"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var EvaluationForm_module_scss_1 = tslib_1.__importDefault(require("./EvaluationForm.module.scss"));
var RoleContext_1 = require("../../../../../../utilities/hooks/RoleContext");
var EvaluationApiService_1 = require("../../../services/EvaluationApiService");
var ScoreRating = [
    { key: 1, text: "Not Acceptable" },
    { key: 2, text: "Acceptable" },
    { key: 3, text: "Excellent" },
];
var SCORECARD_FIELDS = [
    { key: "Qualifications", label: "QUALIFICATIONS", icon: "📄" },
    { key: "Experience", label: "EXPERIENCE", icon: "📈" },
    { key: "Knowledge", label: "KNOWLEDGE", icon: "🧩" },
    { key: "EnergyLevel", label: "ENERGY LEVEL", icon: "⚡" },
    { key: "JobRequirements", label: "JOB REQUIREMENTS", icon: "⏱" },
    { key: "CultureFit", label: "CULTURE FIT", icon: "👥" },
    { key: "ExpatLocal", label: "EXPAT/LOCAL", icon: "🌐" },
    { key: "OtherCriteria", label: "OTHER CRITERIA", icon: "📄" },
];
var EvaluationForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var candidateId = _a.candidateId, recruitmentId = _a.recruitmentId, interviewLevel = _a.interviewLevel, grade = _a.grade, onBack = _a.onBack, currentRoleIDs = _a.currentRoleIDs;
    var _p = (0, RoleContext_1.useRoleContext)(), ADGroupData = _p.ADGroupData, userName = _p.userName;
    var currentUserEmail = (_c = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "";
    var _q = React.useState(true), loading = _q[0], setLoading = _q[1];
    var _r = React.useState(false), submitting = _r[0], setSubmitting = _r[1];
    var _s = React.useState(""), alertMsg = _s[0], setAlertMsg = _s[1];
    var _t = React.useState(""), alertType = _t[0], setAlertType = _t[1];
    var _u = React.useState(null), candidateData = _u[0], setCandidateData = _u[1];
    var _v = React.useState([]), panelMembers = _v[0], setPanelMembers = _v[1];
    var _w = React.useState(null), currentUserPanelId = _w[0], setCurrentUserPanelId = _w[1];
    var _x = React.useState(""), reviewerName = _x[0], setReviewerName = _x[1];
    var _y = React.useState(null), currentUserGuid = _y[0], setCurrentUserGuid = _y[1];
    var _z = React.useState("—"), jobTitleEn = _z[0], setJobTitleEn = _z[1];
    var _0 = React.useState("—"), jobTitleFr = _0[0], setJobTitleFr = _0[1];
    var _1 = React.useState([]), questionnaire = _1[0], setQuestionnaire = _1[1];
    var _2 = React.useState({}), ratingErrors = _2[0], setRatingErrors = _2[1];
    var _3 = React.useState(Object.fromEntries(SCORECARD_FIELDS.map(function (f) { return [f.key, null]; }))), scorecard = _3[0], setScorecard = _3[1];
    var _4 = React.useState({}), scorecardErrors = _4[0], setScorecardErrors = _4[1];
    var _5 = React.useState(null), recommendation = _5[0], setRecommendation = _5[1];
    var _6 = React.useState(false), recError = _6[0], setRecError = _6[1];
    var _7 = React.useState(""), overallFeedback = _7[0], setOverallFeedback = _7[1];
    var _8 = React.useState(false), feedbackError = _8[0], setFeedbackError = _8[1];
    var _9 = React.useState(false), acknowledged = _9[0], setAcknowledged = _9[1];
    var _10 = React.useState(false), ackError = _10[0], setAckError = _10[1];
    React.useEffect(function () {
        (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var result;
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        setLoading(true);
                        return [4 /*yield*/, EvaluationApiService_1.evaluationService.getEvaluationFormData(candidateId, recruitmentId, currentUserEmail)];
                    case 1:
                        result = _d.sent();
                        if (result.success) {
                            setCandidateData(result.candidateData);
                            setPanelMembers((_a = result.panelMembers) !== null && _a !== void 0 ? _a : []);
                            setCurrentUserPanelId(result.currentUserPanelId);
                            setReviewerName(result.reviewerName || userName || "—");
                            setJobTitleEn(result.jobTitleEn || "—");
                            setJobTitleFr(result.jobTitleFr || "—");
                            setCurrentUserGuid((_b = result.currentUserGuid) !== null && _b !== void 0 ? _b : null);
                            setQuestionnaire(((_c = result.questions) !== null && _c !== void 0 ? _c : []).map(function (q, idx) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                return ({
                                    id: (_b = (_a = q.ID) !== null && _a !== void 0 ? _a : q.id) !== null && _b !== void 0 ? _b : idx,
                                    question: (_f = (_e = (_d = (_c = q.Question) !== null && _c !== void 0 ? _c : q.question) !== null && _d !== void 0 ? _d : q.header) !== null && _e !== void 0 ? _e : q.Title) !== null && _f !== void 0 ? _f : "",
                                    answer: (_k = (_j = (_h = (_g = q.ExpectedResponse) !== null && _g !== void 0 ? _g : q.expectedResponse) !== null && _h !== void 0 ? _h : q.Answer) !== null && _j !== void 0 ? _j : q.answer) !== null && _k !== void 0 ? _k : "",
                                    rating: null,
                                });
                            }));
                        }
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); })();
    }, []);
    var cleanHTML = function (text) {
        if (text === void 0) { text = ""; }
        return text.replace(/<p>/gi, "").replace(/<\/p>/gi, "").replace(/<br\s*\/?>/gi, "").trim();
    };
    var handleRatingChange = function (id, value) {
        setQuestionnaire(function (prev) {
            return prev.map(function (q) { var _a; return q.id === id ? tslib_1.__assign(tslib_1.__assign({}, q), { rating: (_a = value === null || value === void 0 ? void 0 : value.key) !== null && _a !== void 0 ? _a : null }) : q; });
        });
        if (value)
            setRatingErrors(function (prev) {
                var _a;
                return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[id] = false, _a)));
            });
    };
    var handleScorecardChange = function (key, value) {
        setScorecard(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
        setScorecardErrors(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[key] = false, _a)));
        });
    };
    var showAlert = function (msg, type) {
        setAlertMsg(msg);
        setAlertType(type);
    };
    var hideAlert = function () {
        setAlertMsg("");
        setAlertType("");
    };
    var handleSubmit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var valid, newRatingErrors, newScorecardErrors, payload, roleIdToSave, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    valid = true;
                    newRatingErrors = {};
                    questionnaire.forEach(function (q) {
                        if (q.rating === null) {
                            newRatingErrors[q.id] = true;
                            valid = false;
                        }
                    });
                    setRatingErrors(newRatingErrors);
                    newScorecardErrors = {};
                    SCORECARD_FIELDS.forEach(function (f) {
                        if (scorecard[f.key] === null) {
                            newScorecardErrors[f.key] = true;
                            valid = false;
                        }
                    });
                    setScorecardErrors(newScorecardErrors);
                    if (!recommendation) {
                        setRecError(true);
                        valid = false;
                    }
                    else {
                        setRecError(false);
                    }
                    if (!overallFeedback.trim()) {
                        setFeedbackError(true);
                        valid = false;
                    }
                    else {
                        setFeedbackError(false);
                    }
                    if (!acknowledged) {
                        setAckError(true);
                        valid = false;
                    }
                    else {
                        setAckError(false);
                    }
                    if (!valid) {
                        showAlert("Please complete all required fields before submitting.", "error");
                        return [2 /*return*/];
                    }
                    if (!currentUserPanelId) {
                        showAlert("Could not identify your panel entry. Please contact HR.", "error");
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    payload = {
                        RecruitmentIDId: recruitmentId,
                        Qualifications: scorecard.Qualifications,
                        Experience: scorecard.Experience,
                        Knowledge: scorecard.Knowledge,
                        EnergyLevel: scorecard.EnergyLevel,
                        JobRequirements: scorecard.JobRequirements,
                        CultureFit: scorecard.CultureFit,
                        ExpatLocal: scorecard.ExpatLocal,
                        OtherCriteria: scorecard.OtherCriteria,
                        Recommendation: recommendation === "consider" ? "Consider for Employment" : "Do Not Consider",
                        OverallFeedback: overallFeedback,
                        QuestionScores: JSON.stringify(questionnaire.map(function (q) { return ({ id: q.id, rating: q.rating }); })),
                    };
                    roleIdToSave = currentRoleIDs.includes(4) ? 4 : (currentRoleIDs[0] || 0);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.submitScorecard(payload, currentUserPanelId, roleIdToSave, currentUserGuid || "")];
                case 1:
                    result = _a.sent();
                    setSubmitting(false);
                    if (result.success) {
                        showAlert(result.message, "success");
                        setTimeout(function () { return onBack(); }, 1600);
                    }
                    else {
                        showAlert(result.message, "error");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (React.createElement("div", { className: EvaluationForm_module_scss_1.default.loadingPage },
            React.createElement("div", { className: EvaluationForm_module_scss_1.default.spinner }),
            React.createElement("p", { className: EvaluationForm_module_scss_1.default.loadingText }, "Loading evaluation form\u2026")));
    }
    var candidateName = candidateData
        ? "".concat((_d = candidateData.FristName) !== null && _d !== void 0 ? _d : "").concat(candidateData.MiddleName ? " " + candidateData.MiddleName : "", " ").concat((_e = candidateData.LastName) !== null && _e !== void 0 ? _e : "").trim()
        : "—";
    var userInitial = (reviewerName || "J").charAt(0).toUpperCase();
    var interviewDateDisplay = (candidateData === null || candidateData === void 0 ? void 0 : candidateData.InterviewDateLevel2) || (candidateData === null || candidateData === void 0 ? void 0 : candidateData.InterviewDate)
        ? (candidateData.InterviewDateLevel2 || candidateData.InterviewDate).split("T")[0]
        : "—";
    var alertClass = [
        EvaluationForm_module_scss_1.default.alert,
        alertType === "error" ? EvaluationForm_module_scss_1.default.alertError : "",
        alertType === "success" ? EvaluationForm_module_scss_1.default.alertSuccess : "",
    ].filter(Boolean).join(" ");
    return (React.createElement("div", { className: EvaluationForm_module_scss_1.default.root },
        alertMsg && (React.createElement("div", { className: alertClass },
            React.createElement("span", null, alertMsg),
            React.createElement("button", { className: EvaluationForm_module_scss_1.default.alertClose, onClick: hideAlert }, "\u2715"))),
        React.createElement("div", { className: EvaluationForm_module_scss_1.default.layout },
            React.createElement("aside", { className: EvaluationForm_module_scss_1.default.leftPanel },
                React.createElement("div", { className: EvaluationForm_module_scss_1.default.leftHeader },
                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.leftAccent }),
                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.leftTitle }, "CANDIDATE INFO"),
                    React.createElement("button", { className: EvaluationForm_module_scss_1.default.refreshBtn, title: "Refresh", onClick: function () { return window.location.reload(); } },
                        React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                            React.createElement("path", { d: "M23 4v6h-6" }),
                            React.createElement("path", { d: "M1 20v-6h6" }),
                            React.createElement("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })))),
                React.createElement("div", { style: { paddingTop: 8 } },
                    React.createElement(LeftField, { icon: "\uD83D\uDC64", label: "APPLICANT NAME", value: candidateName }),
                    React.createElement(LeftField, { icon: "\uD83C\uDF10", label: "NATIONALITY", value: (_f = candidateData === null || candidateData === void 0 ? void 0 : candidateData.Nationality) !== null && _f !== void 0 ? _f : "—" }),
                    React.createElement(LeftField, { icon: "\uD83D\uDC64", label: "GENDER", value: (_g = candidateData === null || candidateData === void 0 ? void 0 : candidateData.Gender) !== null && _g !== void 0 ? _g : "—" }),
                    React.createElement(LeftField, { icon: "\uD83D\uDCC4", label: "QUALIFICATION", value: (_h = candidateData === null || candidateData === void 0 ? void 0 : candidateData.Qualification) !== null && _h !== void 0 ? _h : "—" }),
                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.twoCol },
                        React.createElement(LeftField, { icon: "\uD83D\uDCC8", label: "MINING EXP.", value: (_j = candidateData === null || candidateData === void 0 ? void 0 : candidateData.TotalYearOfExperiance) !== null && _j !== void 0 ? _j : "—" }),
                        React.createElement(LeftField, { icon: "\uD83D\uDCC8", label: "RELATED EXP.", value: (_k = candidateData === null || candidateData === void 0 ? void 0 : candidateData.ReleventExperience) !== null && _k !== void 0 ? _k : "—" })),
                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.twoCol },
                        React.createElement(LeftField, { icon: "\uD83D\uDCC5", label: "INTERVIEW DATE", value: interviewDateDisplay }),
                        React.createElement(LeftField, { icon: "\uD83D\uDD32", label: "LEVELS", value: interviewLevel !== null && interviewLevel !== void 0 ? interviewLevel : "—" })),
                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.twoCol },
                        React.createElement(LeftField, { icon: "\uD83D\uDCC8", label: "GRADE", value: grade || "—" }),
                        React.createElement(LeftField, { icon: "\u26A0\uFE0F", label: "CONFLICTS", value: (_l = candidateData === null || candidateData === void 0 ? void 0 : candidateData.ConflictsOfInterest) !== null && _l !== void 0 ? _l : "—" })),
                    React.createElement(LeftField, { icon: "\u267F", label: "DISABILITY", value: (_o = (_m = candidateData === null || candidateData === void 0 ? void 0 : candidateData.disability) !== null && _m !== void 0 ? _m : candidateData === null || candidateData === void 0 ? void 0 : candidateData.Disability) !== null && _o !== void 0 ? _o : "—" }),
                    panelMembers.length > 0 && (React.createElement("div", { className: EvaluationForm_module_scss_1.default.panelSection },
                        React.createElement("div", { className: EvaluationForm_module_scss_1.default.panelHeader },
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.panelHeaderIcon }, "\uD83D\uDC65"),
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.panelHeaderLabel }, "INTERVIEW PANEL")),
                        panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: EvaluationForm_module_scss_1.default.panelRow },
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.panelBadge }, i + 1),
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.panelName }, name))); }))))),
            React.createElement("main", { className: EvaluationForm_module_scss_1.default.rightPanel },
                questionnaire.length > 0 && (React.createElement("section", null,
                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.sectionTitle },
                        React.createElement("div", { className: EvaluationForm_module_scss_1.default.sectionAccentOrange }),
                        React.createElement("div", null,
                            React.createElement("h2", { className: EvaluationForm_module_scss_1.default.sectionH2 }, "INTERVIEW QUESTIONNAIRES"),
                            React.createElement("p", { className: EvaluationForm_module_scss_1.default.sectionSub }, "Technical & Behavioral Assessment")),
                        React.createElement("div", { className: EvaluationForm_module_scss_1.default.ratingGuide },
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.ratingGuideLabel }, "RATING GUIDE:"),
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.dot, style: { background: "#22c55e" } }),
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.guideItem },
                                "3 - ",
                                React.createElement("b", null, "Excellent")),
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.dot, style: { background: "#3b82f6" } }),
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.guideItem },
                                "2 - ",
                                React.createElement("b", null, "Acceptable")),
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.dot, style: { background: "#ef4444" } }),
                            React.createElement("span", { className: EvaluationForm_module_scss_1.default.guideItem },
                                "1 - ",
                                React.createElement("b", null, "Not Acceptable")))),
                    questionnaire.map(function (q, idx) {
                        var _a;
                        var cardClass = [
                            EvaluationForm_module_scss_1.default.qCard,
                            ratingErrors[q.id] ? EvaluationForm_module_scss_1.default.qCardError : "",
                        ].filter(Boolean).join(" ");
                        return (React.createElement("div", { key: q.id, className: cardClass },
                            React.createElement("div", { className: EvaluationForm_module_scss_1.default.qTop },
                                React.createElement("span", { className: EvaluationForm_module_scss_1.default.qBadge },
                                    "Q",
                                    idx + 1),
                                React.createElement("p", { className: EvaluationForm_module_scss_1.default.qText, dangerouslySetInnerHTML: { __html: cleanHTML(q.question) } })),
                            q.answer && (React.createElement("div", { className: EvaluationForm_module_scss_1.default.guideBox },
                                React.createElement("div", { className: EvaluationForm_module_scss_1.default.guideBoxHeader },
                                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.guideCheck }, "\u2705"),
                                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.guideBoxLabel }, "EXPECTED RESPONSE GUIDE"),
                                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.guideBoxIcon }, "\uD83D\uDCCB")),
                                React.createElement("p", { className: EvaluationForm_module_scss_1.default.guideBoxText, dangerouslySetInnerHTML: { __html: cleanHTML(q.answer) } }))),
                            React.createElement("div", { className: EvaluationForm_module_scss_1.default.qBottom },
                                React.createElement("div", null,
                                    React.createElement("p", { className: EvaluationForm_module_scss_1.default.panelRatingLabel },
                                        "PANEL RATING ",
                                        React.createElement("span", { className: EvaluationForm_module_scss_1.default.req }, "*"),
                                        ratingErrors[q.id] && (React.createElement("span", { className: EvaluationForm_module_scss_1.default.fieldErr }, " \u2014 This field is required"))),
                                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.ratingBtnRow }, ScoreRating.map(function (_a) {
                                        var key = _a.key, text = _a.text;
                                        var btnClass = [
                                            EvaluationForm_module_scss_1.default.ratingBtn,
                                            q.rating === key && key === 3 ? EvaluationForm_module_scss_1.default.ratingExcellent : "",
                                            q.rating === key && key === 2 ? EvaluationForm_module_scss_1.default.ratingAcceptable : "",
                                            q.rating === key && key === 1 ? EvaluationForm_module_scss_1.default.ratingNotAcceptable : "",
                                        ].filter(Boolean).join(" ");
                                        return (React.createElement("button", { key: key, className: btnClass, onClick: function () { return handleRatingChange(q.id, { key: key, text: text }); } }, text));
                                    }))),
                                React.createElement("div", { className: EvaluationForm_module_scss_1.default.scoreDisplay },
                                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.scoreLabel }, "SCORE"),
                                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.scoreNum }, (_a = q.rating) !== null && _a !== void 0 ? _a : 0,
                                        React.createElement("span", { className: EvaluationForm_module_scss_1.default.scoreMax }, "/3"))))));
                    }))),
                React.createElement("section", { style: { marginTop: questionnaire.length > 0 ? 16 : 0 } },
                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.sectionTitle },
                        React.createElement("div", { className: EvaluationForm_module_scss_1.default.sectionAccentGreen }),
                        React.createElement("div", null,
                            React.createElement("h2", { className: EvaluationForm_module_scss_1.default.sectionH2 }, "SCORECARD DETAILS"),
                            React.createElement("p", { className: EvaluationForm_module_scss_1.default.sectionSub }, "Core Competency Assessment (1-5 Scale)"))),
                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.scorecardCard },
                        React.createElement("div", { className: EvaluationForm_module_scss_1.default.scorecardGrid }, SCORECARD_FIELDS.map(function (field) {
                            var lblClass = [
                                EvaluationForm_module_scss_1.default.scorecardFieldLabel,
                                scorecardErrors[field.key] ? EvaluationForm_module_scss_1.default.errLabel : "",
                            ].filter(Boolean).join(" ");
                            return (React.createElement("div", { key: field.key, className: EvaluationForm_module_scss_1.default.scorecardField },
                                React.createElement("p", { className: lblClass },
                                    field.icon,
                                    " ",
                                    field.label,
                                    " ",
                                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.req }, "*"),
                                    scorecardErrors[field.key] && (React.createElement("span", { className: EvaluationForm_module_scss_1.default.fieldErr }, " \u2014 Required"))),
                                React.createElement("div", { className: EvaluationForm_module_scss_1.default.fiveRow }, [1, 2, 3, 4, 5].map(function (n) {
                                    var btnClass = [
                                        EvaluationForm_module_scss_1.default.fiveBtn,
                                        scorecard[field.key] === n ? EvaluationForm_module_scss_1.default.fiveBtnActive : "",
                                    ].filter(Boolean).join(" ");
                                    return (React.createElement("button", { key: n, className: btnClass, onClick: function () { return handleScorecardChange(field.key, n); } }, n));
                                }))));
                        })),
                        React.createElement("div", { className: EvaluationForm_module_scss_1.default.recRow },
                            React.createElement("div", { className: EvaluationForm_module_scss_1.default.recLeft },
                                React.createElement("p", { className: [EvaluationForm_module_scss_1.default.scorecardFieldLabel, recError ? EvaluationForm_module_scss_1.default.errLabel : ""].filter(Boolean).join(" ") },
                                    "RECOMMENDATION ",
                                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.req }, "*"),
                                    recError && React.createElement("span", { className: EvaluationForm_module_scss_1.default.fieldErr }, " \u2014 Required")),
                                React.createElement("div", { className: EvaluationForm_module_scss_1.default.recBtnRow },
                                    React.createElement("button", { className: [EvaluationForm_module_scss_1.default.recBtn, recommendation === "consider" ? EvaluationForm_module_scss_1.default.recBtnActive : ""].filter(Boolean).join(" "), onClick: function () { setRecommendation("consider"); setRecError(false); } },
                                        recommendation === "consider" && React.createElement("span", { style: { fontSize: 14 } }, "\u2705"),
                                        "Consider for Employment"),
                                    React.createElement("button", { className: [EvaluationForm_module_scss_1.default.recBtn, recommendation === "doNotConsider" ? EvaluationForm_module_scss_1.default.recBtnDeny : ""].filter(Boolean).join(" "), onClick: function () { setRecommendation("doNotConsider"); setRecError(false); } }, "\u2715 Do Not Consider"))),
                            React.createElement("div", { className: EvaluationForm_module_scss_1.default.recRight },
                                React.createElement("p", { className: [EvaluationForm_module_scss_1.default.scorecardFieldLabel, feedbackError ? EvaluationForm_module_scss_1.default.errLabel : ""].filter(Boolean).join(" ") },
                                    "OVERALL EVALUATION FEEDBACK ",
                                    React.createElement("span", { className: EvaluationForm_module_scss_1.default.req }, "*"),
                                    feedbackError && React.createElement("span", { className: EvaluationForm_module_scss_1.default.fieldErr }, " \u2014 Required")),
                                React.createElement("textarea", { className: [EvaluationForm_module_scss_1.default.feedbackArea, feedbackError ? EvaluationForm_module_scss_1.default.inputErr : ""].filter(Boolean).join(" "), rows: 4, value: overallFeedback, onChange: function (e) {
                                        setOverallFeedback(e.target.value);
                                        if (e.target.value.trim())
                                            setFeedbackError(false);
                                    }, placeholder: "Enter your overall evaluation feedback here\u2026" }))),
                        React.createElement("div", { className: [EvaluationForm_module_scss_1.default.ackBox, ackError ? EvaluationForm_module_scss_1.default.ackBoxErr : ""].filter(Boolean).join(" ") },
                            React.createElement("label", { className: EvaluationForm_module_scss_1.default.ackRow },
                                React.createElement("input", { type: "checkbox", checked: acknowledged, onChange: function (e) { setAcknowledged(e.target.checked); if (e.target.checked)
                                        setAckError(false); }, className: EvaluationForm_module_scss_1.default.ackChk }),
                                React.createElement("span", { className: EvaluationForm_module_scss_1.default.ackText }, "I hereby acknowledge that I have completed the candidate evaluation and scorecard entry, and I confirm that the scores and feedback provided are accurate.")),
                            React.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerCard },
                                React.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerAvatar }, userInitial),
                                React.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerInfo },
                                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerCol },
                                        React.createElement("p", { className: EvaluationForm_module_scss_1.default.reviewerMeta }, "REVIEWER NAME"),
                                        React.createElement("p", { className: EvaluationForm_module_scss_1.default.reviewerVal }, reviewerName)),
                                    React.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerCol },
                                        React.createElement("p", { className: EvaluationForm_module_scss_1.default.reviewerMeta }, "JOB TITLE (EN)"),
                                        React.createElement("p", { className: EvaluationForm_module_scss_1.default.reviewerVal }, jobTitleEn),
                                        React.createElement("p", { className: EvaluationForm_module_scss_1.default.reviewerMeta, style: { marginTop: 12 } }, "JOB TITLE (FR)"),
                                        React.createElement("p", { className: EvaluationForm_module_scss_1.default.reviewerVal }, jobTitleFr))))))),
                React.createElement("div", { className: EvaluationForm_module_scss_1.default.footer },
                    React.createElement("button", { className: EvaluationForm_module_scss_1.default.cancelBtn, onClick: onBack, disabled: submitting }, "Cancel"),
                    React.createElement("button", { className: EvaluationForm_module_scss_1.default.submitBtn, onClick: handleSubmit, disabled: submitting || !acknowledged }, submitting ? "Submitting…" : "+ Submit Evaluation"))))));
};
var LeftField = function (_a) {
    var icon = _a.icon, label = _a.label, value = _a.value;
    return (React.createElement("div", { className: EvaluationForm_module_scss_1.default.leftFieldWrapper },
        React.createElement("div", { className: EvaluationForm_module_scss_1.default.leftFieldLabelRow },
            icon && React.createElement("span", { className: EvaluationForm_module_scss_1.default.leftFieldIcon }, icon),
            React.createElement("span", { className: EvaluationForm_module_scss_1.default.leftFieldLabel }, label)),
        React.createElement("div", { className: EvaluationForm_module_scss_1.default.leftFieldValueBox }, value || "—")));
};
exports.default = EvaluationForm;
//# sourceMappingURL=EvaluationForm.js.map