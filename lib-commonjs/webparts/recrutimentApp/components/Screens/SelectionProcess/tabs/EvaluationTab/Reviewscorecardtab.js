"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var Reviewscorecardtab_module_scss_1 = tslib_1.__importDefault(require("./Reviewscorecardtab.module.scss"));
var RoleContext_1 = require("../../../../../utilities/hooks/RoleContext");
var useReviewScorecard_1 = require("../../hooks/useReviewScorecard");
var EvaluationApiService_1 = require("../../services/EvaluationApiService");
var css = Reviewscorecardtab_module_scss_1.default;
var ReviewScorecardTab = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var employeeList = _a.employeeList, onFormStateChange = _a.onFormStateChange;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var hodEmail = (_c = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "";
    var roleIDs = (_d = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) !== null && _d !== void 0 ? _d : [];
    var rs = (0, useReviewScorecard_1.useReviewScorecard)(roleIDs, employeeList, hodEmail, function (open) { return onFormStateChange === null || onFormStateChange === void 0 ? void 0 : onFormStateChange(open, "HOD REVIEW"); });
    // Local state for HOD decision form
    var _h = (0, react_1.useState)(null), decision = _h[0], setDecision = _h[1];
    var _j = (0, react_1.useState)(""), comments = _j[0], setComments = _j[1];
    var _k = (0, react_1.useState)(false), decisionError = _k[0], setDecisionError = _k[1];
    var _l = (0, react_1.useState)(false), commentsError = _l[0], setCommentsError = _l[1];
    var _m = (0, react_1.useState)(false), submitting = _m[0], setSubmitting = _m[1];
    var _o = (0, react_1.useState)([]), questions = _o[0], setQuestions = _o[1];
    var _p = (0, react_1.useState)(false), questionsLoading = _p[0], setQuestionsLoading = _p[1];
    var _q = (0, react_1.useState)(""), positionId = _q[0], setPositionId = _q[1];
    var _r = (0, react_1.useState)(""), feedback = _r[0], setFeedback = _r[1];
    var _s = (0, react_1.useState)(false), acknowledged = _s[0], setAcknowledged = _s[1];
    var _t = (0, react_1.useState)(null), scoreData = _t[0], setScoreData = _t[1];
    var hasResults = (0, react_1.useMemo)(function () { return rs.jobs.length > 0; }, [rs.jobs]);
    var handleDecisionChange = function (d) {
        setDecision(d);
        setDecisionError(false);
    };
    var handleCommentsChange = function (text) {
        setComments(text);
        if (text.trim())
            setCommentsError(false);
    };
    var validateForm = function () {
        var isValid = true;
        if (!decision) {
            setDecisionError(true);
            isValid = false;
        }
        if (!comments.trim()) {
            setCommentsError(true);
            isValid = false;
        }
        return isValid;
    };
    var handleSubmit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var statusMap, payload, result, error_1;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!validateForm()) {
                        rs.setAlert("Please complete all required fields", "error");
                        return [2 /*return*/];
                    }
                    if (!rs.selectedCandidate || !decision)
                        return [2 /*return*/];
                    setSubmitting(true);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    statusMap = {
                        select: 133, // Selected
                        reject: 134, // RejectedbyHOD
                        hold: 132, // OnHoldbyHOD
                    };
                    payload = {
                        candidateId: rs.selectedCandidate.id,
                        decision: decision,
                        comments: comments,
                        statusId: statusMap[decision],
                        gpa: rs.selectedCandidate.gpa,
                        jobRequestID: (_a = rs.selectedJob) === null || _a === void 0 ? void 0 : _a.id,
                        recruitment: (_b = rs.selectedJob) === null || _b === void 0 ? void 0 : _b.recruitmentID,
                        positionId: positionId,
                        feedback: feedback,
                        acknowledged: acknowledged,
                    };
                    return [4 /*yield*/, ((_c = rs.submitHodDecision) === null || _c === void 0 ? void 0 : _c.call(rs, payload))];
                case 2:
                    result = (_d = _e.sent()) !== null && _d !== void 0 ? _d : { success: false };
                    setSubmitting(false);
                    if (result.success) {
                        rs.setAlert("✓ Decision submitted successfully!", "success");
                        setTimeout(function () {
                            rs.closeCandidateModal();
                            if (rs.selectedJob)
                                rs.openDrawer(rs.selectedJob);
                            // Reset form
                            setDecision(null);
                            setComments("");
                        }, 1600);
                    }
                    else {
                        rs.setAlert(result.message || "Failed to submit decision", "error");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _e.sent();
                    setSubmitting(false);
                    rs.setAlert("Error submitting decision: " + error_1.message, "error");
                    console.error("Submit error:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var openCandidateModalWithData = function (candidate) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var jobCodeString, qData, error_2;
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    rs.openCandidateModal(candidate);
                    setDecision(null);
                    setComments("");
                    setFeedback("");
                    setPositionId("");
                    setAcknowledged(false);
                    setDecisionError(false);
                    setCommentsError(false);
                    onFormStateChange === null || onFormStateChange === void 0 ? void 0 : onFormStateChange(true, "HOD REVIEW");
                    if (!rs.selectedJob) return [3 /*break*/, 6];
                    setQuestionsLoading(true);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 4, 5, 6]);
                    jobCodeString = (_b = (_a = rs.selectedJob) === null || _a === void 0 ? void 0 : _a.jobCode) !== null && _b !== void 0 ? _b : "";
                    if (!jobCodeString) return [3 /*break*/, 3];
                    return [4 /*yield*/, ((_d = (_c = EvaluationApiService_1.evaluationService).getEvaluationFormData) === null || _d === void 0 ? void 0 : _d.call(_c, candidate.id, (_e = rs.selectedJob) === null || _e === void 0 ? void 0 : _e.recruitmentID, hodEmail))];
                case 2:
                    qData = _f.sent();
                    if (qData === null || qData === void 0 ? void 0 : qData.questions) {
                        setQuestions(qData.questions);
                    }
                    // Try to fetch scorecard data
                    if (qData === null || qData === void 0 ? void 0 : qData.scoreData) {
                        setScoreData(qData.scoreData);
                    }
                    _f.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    error_2 = _f.sent();
                    console.error("Error loading questions:", error_2);
                    return [3 /*break*/, 6];
                case 5:
                    setQuestionsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement("div", { className: css.card },
        react_1.default.createElement("div", { className: css.header },
            react_1.default.createElement("h2", { className: css.title }, "HOD Review Scorecard"),
            react_1.default.createElement("button", { className: css.backBtn, onClick: function () { return navigate("/Dashboard"); } }, "\u2190 Back To Dashboard")),
        rs.alertMsg && (react_1.default.createElement("div", { className: "".concat(css.alert, " ").concat(rs.alertType === "success" ? css.alertSuccess : css.alertError) },
            rs.alertMsg,
            react_1.default.createElement("button", { onClick: function () { return rs.setAlert("", "success"); }, className: css.alertClose }, "\u2715"))),
        rs.jobsLoading ? (react_1.default.createElement("div", { className: css.spinner },
            react_1.default.createElement("div", { className: css.spinnerInner }),
            react_1.default.createElement("p", null, "Loading jobs..."))) : (react_1.default.createElement(react_1.default.Fragment, null, !hasResults ? (react_1.default.createElement("div", { className: css.empty },
            react_1.default.createElement("p", null, "\uD83D\uDCCB No jobs found"),
            react_1.default.createElement("small", null,
                "HOD Email: ",
                hodEmail || "(no HOD email)"))) : (react_1.default.createElement("table", { className: css.table },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, "Job Code"),
                    react_1.default.createElement("th", null, "Job Title"),
                    react_1.default.createElement("th", null, "Department"),
                    react_1.default.createElement("th", null, "Status"),
                    react_1.default.createElement("th", null, "Action"))),
            react_1.default.createElement("tbody", null, rs.jobs.map(function (job) { return (react_1.default.createElement("tr", { key: job.id },
                react_1.default.createElement("td", { className: css.codeCell }, job.jobCode),
                react_1.default.createElement("td", { className: css.titleCell }, job.jobTitle),
                react_1.default.createElement("td", { className: css.deptCell }, job.department),
                react_1.default.createElement("td", null,
                    react_1.default.createElement("span", { className: css.statusTag }, job.status)),
                react_1.default.createElement("td", null,
                    react_1.default.createElement("button", { onClick: function () { return rs.openDrawer(job); }, className: css.actionBtn }, "\uD83D\uDC65 View Candidates")))); })))))),
        rs.drawerOpen && (react_1.default.createElement("div", { className: css.drawerOverlay },
            react_1.default.createElement("div", { className: css.drawer },
                react_1.default.createElement("div", { className: css.drawerHeader },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h3", null,
                            "Candidates for ", (_e = rs.selectedJob) === null || _e === void 0 ? void 0 :
                            _e.jobTitle),
                        react_1.default.createElement("p", { className: css.drawerSubtitle }, (_f = rs.selectedJob) === null || _f === void 0 ? void 0 : _f.jobCode)),
                    react_1.default.createElement("button", { onClick: rs.closeDrawer, className: css.closeBtn, title: "Close" }, "\u2715")),
                react_1.default.createElement("div", { className: css.drawerBody }, rs.candidatesLoading ? (react_1.default.createElement("div", { className: css.spinner },
                    react_1.default.createElement("div", { className: css.spinnerInner }),
                    react_1.default.createElement("p", null, "Loading candidates..."))) : rs.candidates.length === 0 ? (react_1.default.createElement("div", { className: css.empty }, "No candidates available")) : (react_1.default.createElement("table", { className: css.candidateTable },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "Name"),
                            react_1.default.createElement("th", null, "Nationality"),
                            react_1.default.createElement("th", null, "Status"),
                            react_1.default.createElement("th", null, "GPA"),
                            react_1.default.createElement("th", null, "Action"))),
                    react_1.default.createElement("tbody", null, rs.candidates.map(function (candidate) { return (react_1.default.createElement("tr", { key: candidate.id },
                        react_1.default.createElement("td", null, candidate.fullName),
                        react_1.default.createElement("td", null, candidate.nationality),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: css.statusBadge }, candidate.status)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("strong", null, candidate.gpa)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("button", { onClick: function () { return openCandidateModalWithData(candidate); }, className: css.reviewBtn }, "\uD83D\uDCCB Review")))); })))))))),
        rs.modalOpen && rs.selectedCandidate && (react_1.default.createElement("div", { className: css.modalOverlay },
            react_1.default.createElement("div", { className: css.hodModal },
                react_1.default.createElement("div", { className: css.modalHeader },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h3", null, "HOD - Candidate Evaluation Review"),
                        react_1.default.createElement("p", { className: css.modalSubtitle },
                            rs.selectedCandidate.fullName,
                            " \u2022 ", (_g = rs.selectedJob) === null || _g === void 0 ? void 0 :
                            _g.jobTitle)),
                    react_1.default.createElement("button", { onClick: rs.closeCandidateModal, className: css.closeBtn, title: "Close" }, "\u2715")),
                react_1.default.createElement("div", { className: css.modalScroll },
                    rs.alertMsg && (react_1.default.createElement("div", { className: "".concat(css.modalAlert, " ").concat(rs.alertType === "error" ? css.alertErr : css.alertOk) },
                        react_1.default.createElement("span", null, rs.alertMsg),
                        react_1.default.createElement("button", { onClick: function () { return rs.setAlert("", "success"); } }, "\u2715"))),
                    react_1.default.createElement("section", { className: css.infoSection },
                        react_1.default.createElement("h4", { className: css.sectionTitle }, "\uD83D\uDCCB Candidate Details"),
                        react_1.default.createElement("div", { className: css.infoPair },
                            react_1.default.createElement("span", { className: css.label }, "Full Name:"),
                            react_1.default.createElement("span", { className: css.value }, rs.selectedCandidate.fullName)),
                        react_1.default.createElement("div", { className: css.infoPair },
                            react_1.default.createElement("span", { className: css.label }, "Nationality:"),
                            react_1.default.createElement("span", { className: css.value }, rs.selectedCandidate.nationality)),
                        react_1.default.createElement("div", { className: css.infoPair },
                            react_1.default.createElement("span", { className: css.label }, "Gender:"),
                            react_1.default.createElement("span", { className: css.value }, rs.selectedCandidate.gender)),
                        react_1.default.createElement("div", { className: css.infoPair },
                            react_1.default.createElement("span", { className: css.label }, "Department:"),
                            react_1.default.createElement("span", { className: css.value }, rs.selectedCandidate.department)),
                        react_1.default.createElement("div", { className: css.infoPair },
                            react_1.default.createElement("span", { className: css.label }, "Interview Level:"),
                            react_1.default.createElement("span", { className: css.value }, rs.selectedCandidate.interviewLevel)),
                        react_1.default.createElement("div", { className: css.infoPair },
                            react_1.default.createElement("span", { className: css.label }, "Interview Date:"),
                            react_1.default.createElement("span", { className: css.value }, rs.selectedCandidate.interviewDate)),
                        react_1.default.createElement("div", { className: css.infoPair },
                            react_1.default.createElement("span", { className: css.label }, "GPA / Grade:"),
                            react_1.default.createElement("span", { className: "".concat(css.value, " ").concat(css.gpaBadge) },
                                rs.selectedCandidate.gpa,
                                " / ",
                                rs.selectedCandidate.grade)),
                        react_1.default.createElement("div", { className: css.infoPair },
                            react_1.default.createElement("span", { className: css.label }, "Status:"),
                            react_1.default.createElement("span", { className: css.value }, rs.selectedCandidate.status))),
                    questionsLoading || questions.length > 0 ? (react_1.default.createElement("section", { className: css.questionsSection },
                        react_1.default.createElement("h4", { className: css.sectionTitle }, "\u2753 Interview Questions & Responses"),
                        questionsLoading ? (react_1.default.createElement("p", { className: css.loadingText }, "Loading questions...")) : (react_1.default.createElement("div", { className: css.questionsList }, questions.map(function (q, idx) { return (react_1.default.createElement("div", { key: idx, className: css.questionItem },
                            react_1.default.createElement("div", { className: css.qNumber }, idx + 1),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("p", { className: css.qText }, q.question || q.QuestionText),
                                q.answer || q.response ? (react_1.default.createElement("p", { className: css.aText },
                                    react_1.default.createElement("strong", null, "Answer:"),
                                    " ",
                                    q.answer || q.response)) : (react_1.default.createElement("p", { className: css.aTextEmpty }, "No response recorded"))))); }))))) : null,
                    react_1.default.createElement("section", { className: css.decisionSection },
                        react_1.default.createElement("h4", { className: css.sectionTitle }, "\u2705 HOD Decision"),
                        react_1.default.createElement("p", { className: css.decLabel }, "Do you wish to select this candidate for on-boarding?"),
                        react_1.default.createElement("div", { className: "".concat(css.decGrid, " ").concat(decisionError ? css.hasError : "") },
                            react_1.default.createElement("button", { className: "".concat(css.decCard, " ").concat(decision === "select" ? css.decCardActive : "", " ").concat(css.decCardSelect), onClick: function () { return handleDecisionChange("select"); }, type: "button" },
                                react_1.default.createElement("span", { className: css.decIcon }, "\u2713"),
                                react_1.default.createElement("span", { className: css.decText }, "YES, SELECT")),
                            react_1.default.createElement("button", { className: "".concat(css.decCard, " ").concat(decision === "reject" ? css.decCardActive : "", " ").concat(css.decCardReject), onClick: function () { return handleDecisionChange("reject"); }, type: "button" },
                                react_1.default.createElement("span", { className: css.decIcon }, "\u2715"),
                                react_1.default.createElement("span", { className: css.decText }, "NO, REJECT")),
                            react_1.default.createElement("button", { className: "".concat(css.decCard, " ").concat(decision === "hold" ? css.decCardActive : "", " ").concat(css.decCardHold), onClick: function () { return handleDecisionChange("hold"); }, type: "button" },
                                react_1.default.createElement("span", { className: css.decIcon }, "\u23F8"),
                                react_1.default.createElement("span", { className: css.decText }, "ON HOLD"))),
                        decisionError && (react_1.default.createElement("p", { className: css.errorMsg }, "\u26A0\uFE0F Please select a decision"))),
                    react_1.default.createElement("section", { className: css.commentsSection },
                        react_1.default.createElement("label", { className: "".concat(css.commentsLabel, " ").concat(commentsError ? css.hasError : "") },
                            "\uD83D\uDCAC HOD Justification / Comments",
                            react_1.default.createElement("span", { className: css.required }, "*")),
                        commentsError && (react_1.default.createElement("p", { className: css.errInline }, "\u26A0\uFE0F Comments are required")),
                        react_1.default.createElement("textarea", { className: "".concat(css.commentsArea, " ").concat(commentsError ? css.hasError : ""), rows: 6, placeholder: "Provide your decision justification, reasons, and any additional comments...", value: comments, onChange: function (e) { return handleCommentsChange(e.target.value); } }),
                        react_1.default.createElement("p", { className: css.charCount },
                            comments.length,
                            " / 1000 characters")),
                    react_1.default.createElement("section", { className: css.formSection },
                        react_1.default.createElement("label", { className: css.formLabel },
                            "Assign Position ID",
                            react_1.default.createElement("span", { className: css.required }, "*")),
                        react_1.default.createElement("select", { className: css.formSelect, value: positionId, onChange: function (e) { return setPositionId(e.target.value); }, title: "Select a position ID", "aria-label": "Assign Position ID" },
                            react_1.default.createElement("option", { value: "" }, "-- Select a position --"),
                            react_1.default.createElement("option", { value: "POS001" }, "Manager - Position 001"),
                            react_1.default.createElement("option", { value: "POS002" }, "Senior Position 002"),
                            react_1.default.createElement("option", { value: "POS003" }, "Specialist Position 003"))),
                    react_1.default.createElement("section", { className: css.formSection },
                        react_1.default.createElement("label", { className: css.formLabel }, "Feedback - Level 1"),
                        react_1.default.createElement("textarea", { className: css.feedbackArea, rows: 4, placeholder: "Enter feedback for Level 1 interview (optional)...", value: feedback, onChange: function (e) { return setFeedback(e.target.value); }, maxLength: 500 }),
                        react_1.default.createElement("p", { className: css.charCount },
                            feedback.length,
                            " / 500 characters")),
                    react_1.default.createElement("section", { className: css.checkboxSection },
                        react_1.default.createElement("label", { className: css.checkboxLabel },
                            react_1.default.createElement("input", { type: "checkbox", checked: acknowledged, onChange: function (e) { return setAcknowledged(e.target.checked); }, className: css.checkbox }),
                            react_1.default.createElement("span", null, "I hereby acknowledge that I have reviewed the candidate scorecard details.")))),
                react_1.default.createElement("div", { className: css.hodFooter },
                    react_1.default.createElement("button", { className: css.cancelBtn, onClick: rs.closeCandidateModal, disabled: submitting, type: "button" }, "CANCEL"),
                    react_1.default.createElement("button", { className: "".concat(css.submitBtn, " ").concat(!decision || !comments.trim() || !positionId || !acknowledged ? css.submitDisabled : ""), onClick: handleSubmit, disabled: submitting || !decision || !comments.trim() || !positionId || !acknowledged, type: "button" }, submitting ? "⏳ SUBMITTING..." : "✓ SUBMIT ACTION")))))));
};
exports.default = ReviewScorecardTab;
//# sourceMappingURL=Reviewscorecardtab.js.map