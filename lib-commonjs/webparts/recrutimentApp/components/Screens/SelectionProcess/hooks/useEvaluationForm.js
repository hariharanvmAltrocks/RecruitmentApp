"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCORE_RATING = exports.SCORECARD_FIELDS = void 0;
exports.useEvaluationForm = useEvaluationForm;
var tslib_1 = require("tslib");
// useEvaluationForm.ts — all EvaluationForm logic
var react_1 = require("react");
var EvaluationApiService_1 = require("../services/EvaluationApiService");
exports.SCORECARD_FIELDS = [
    { key: "Qualifications", label: "QUALIFICATIONS", icon: "📄" },
    { key: "Experience", label: "EXPERIENCE", icon: "📈" },
    { key: "Knowledge", label: "KNOWLEDGE", icon: "🧩" },
    { key: "EnergyLevel", label: "ENERGY LEVEL", icon: "⚡" },
    { key: "JobRequirements", label: "JOB REQUIREMENTS", icon: "⏱" },
    { key: "CultureFit", label: "CULTURE FIT", icon: "👥" },
    { key: "ExpatLocal", label: "EXPAT/LOCAL", icon: "🌐" },
    { key: "OtherCriteria", label: "OTHER CRITERIA", icon: "📋" },
];
exports.SCORE_RATING = [{ key: 1, text: "Not Acceptable" }, { key: 2, text: "Acceptable" }, { key: 3, text: "Excellent" }];
var blank = function () {
    return Object.fromEntries(exports.SCORECARD_FIELDS.map(function (f) { return [f.key, null]; }));
};
function useEvaluationForm(candidateId, recruitmentId, email, roleIDs, onSuccess) {
    var _this = this;
    var _a = (0, react_1.useState)(true), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(false), submitting = _b[0], setSubmitting = _b[1];
    var _c = (0, react_1.useState)(null), formData = _c[0], setFormData = _c[1];
    var _d = (0, react_1.useState)(""), alertMsg = _d[0], setAlertMsg = _d[1];
    var _e = (0, react_1.useState)(""), alertType = _e[0], setAlertType = _e[1];
    var _f = (0, react_1.useState)([]), questionnaire = _f[0], setQuestionnaire = _f[1];
    var _g = (0, react_1.useState)({}), ratingErrors = _g[0], setRatingErrors = _g[1];
    var _h = (0, react_1.useState)(blank()), scorecard = _h[0], setScorecard = _h[1];
    var _j = (0, react_1.useState)({}), scorecardErrors = _j[0], setScorecardErrors = _j[1];
    var _k = (0, react_1.useState)(null), recommendation = _k[0], setRecommendation = _k[1];
    var _l = (0, react_1.useState)(false), recError = _l[0], setRecError = _l[1];
    var _m = (0, react_1.useState)(""), overallFeedback = _m[0], setOverallFeedback = _m[1];
    var _o = (0, react_1.useState)(false), feedbackError = _o[0], setFeedbackError = _o[1];
    var _p = (0, react_1.useState)(false), acknowledged = _p[0], setAcknowledged = _p[1];
    var _q = (0, react_1.useState)(false), ackError = _q[0], setAckError = _q[1];
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoading(true);
                        return [4 /*yield*/, EvaluationApiService_1.evaluationService.getEvaluationFormData(candidateId, recruitmentId, email)];
                    case 1:
                        result = _b.sent();
                        if (cancelled)
                            return [2 /*return*/];
                        if (result.success) {
                            setFormData(result);
                            setQuestionnaire(((_a = result.questions) !== null && _a !== void 0 ? _a : []).map(function (q, i) { var _a, _b, _c, _d, _e; return ({ id: (_a = q.id) !== null && _a !== void 0 ? _a : i, question: (_c = (_b = q.question) !== null && _b !== void 0 ? _b : q.Question) !== null && _c !== void 0 ? _c : "", answer: (_e = (_d = q.answer) !== null && _d !== void 0 ? _d : q.Answer) !== null && _e !== void 0 ? _e : "", rating: null }); }));
                        }
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); })();
        return function () { cancelled = true; };
    }, [candidateId, recruitmentId, email]);
    var handleRatingChange = (0, react_1.useCallback)(function (id, value) {
        setQuestionnaire(function (prev) { return prev.map(function (q) { var _a; return q.id === id ? tslib_1.__assign(tslib_1.__assign({}, q), { rating: (_a = value === null || value === void 0 ? void 0 : value.key) !== null && _a !== void 0 ? _a : null }) : q; }); });
        if (value)
            setRatingErrors(function (prev) {
                var _a;
                return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[id] = false, _a)));
            });
    }, []);
    var handleScorecardChange = (0, react_1.useCallback)(function (key, value) {
        setScorecard(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
        setScorecardErrors(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[key] = false, _a)));
        });
    }, []);
    var handleRecommendation = (0, react_1.useCallback)(function (val) { setRecommendation(val); setRecError(false); }, []);
    var handleFeedback = (0, react_1.useCallback)(function (val) { setOverallFeedback(val); if (val.trim())
        setFeedbackError(false); }, []);
    var handleAcknowledge = (0, react_1.useCallback)(function (v) { setAcknowledged(v); if (v)
        setAckError(false); }, []);
    var hideAlert = (0, react_1.useCallback)(function () { setAlertMsg(""); setAlertType(""); }, []);
    var handleSubmit = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var valid, nRE, nSE, payload, roleIdToSave, result;
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    valid = true;
                    nRE = {};
                    questionnaire.forEach(function (q) { if (q.rating === null) {
                        nRE[q.id] = true;
                        valid = false;
                    } });
                    setRatingErrors(nRE);
                    nSE = {};
                    exports.SCORECARD_FIELDS.forEach(function (f) { if (scorecard[f.key] === null) {
                        nSE[f.key] = true;
                        valid = false;
                    } });
                    setScorecardErrors(nSE);
                    if (!recommendation) {
                        setRecError(true);
                        valid = false;
                    }
                    if (!overallFeedback.trim()) {
                        setFeedbackError(true);
                        valid = false;
                    }
                    if (!acknowledged) {
                        setAckError(true);
                        valid = false;
                    }
                    if (!valid) {
                        setAlertMsg("Please complete all required fields.");
                        setAlertType("error");
                        return [2 /*return*/];
                    }
                    if (!(formData === null || formData === void 0 ? void 0 : formData.currentUserPanelId)) {
                        setAlertMsg("Could not identify your panel entry.");
                        setAlertType("error");
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    payload = { RecruitmentIDId: recruitmentId, Qualifications: scorecard.Qualifications, Experience: scorecard.Experience, Knowledge: scorecard.Knowledge, EnergyLevel: scorecard.EnergyLevel, JobRequirements: scorecard.JobRequirements, CultureFit: scorecard.CultureFit, ExpatLocal: scorecard.ExpatLocal, OtherCriteria: scorecard.OtherCriteria, Recommendation: recommendation === "consider" ? "Consider for Employment" : "Do Not Consider", OverallFeedback: overallFeedback, QuestionScores: JSON.stringify(questionnaire.map(function (q) { return ({ id: q.id, rating: q.rating }); })) };
                    roleIdToSave = roleIDs.includes(4) ? 4 : ((_a = roleIDs[0]) !== null && _a !== void 0 ? _a : 0);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.submitScorecard(payload, formData.currentUserPanelId, roleIdToSave, (_b = formData.currentUserGuid) !== null && _b !== void 0 ? _b : "")];
                case 1:
                    result = _c.sent();
                    setSubmitting(false);
                    if (result.success) {
                        setAlertMsg(result.message);
                        setAlertType("success");
                        setTimeout(onSuccess, 1600);
                    }
                    else {
                        setAlertMsg(result.message);
                        setAlertType("error");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return { loading: loading, submitting: submitting, formData: formData, questionnaire: questionnaire, ratingErrors: ratingErrors, handleRatingChange: handleRatingChange, scorecard: scorecard, scorecardErrors: scorecardErrors, handleScorecardChange: handleScorecardChange, recommendation: recommendation, recError: recError, handleRecommendation: handleRecommendation, overallFeedback: overallFeedback, feedbackError: feedbackError, handleFeedback: handleFeedback, acknowledged: acknowledged, ackError: ackError, handleAcknowledge: handleAcknowledge, alertMsg: alertMsg, alertType: alertType, hideAlert: hideAlert, handleSubmit: handleSubmit, SCORECARD_FIELDS: exports.SCORECARD_FIELDS, SCORE_RATING: exports.SCORE_RATING };
}
//# sourceMappingURL=useEvaluationForm.js.map