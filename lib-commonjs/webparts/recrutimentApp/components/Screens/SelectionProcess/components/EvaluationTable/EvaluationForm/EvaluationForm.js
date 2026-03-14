"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var EvaluationForm_module_scss_1 = tslib_1.__importDefault(require("./EvaluationForm.module.scss"));
var EvaluationApiService_1 = require("../../../services/EvaluationApiService");
var RoleContext_1 = require("../../../../../../utilities/hooks/RoleContext");
var COMPETENCY_FIELDS = [
    { key: "qualifications", label: "Qualifications" },
    { key: "experience", label: "Experience" },
    { key: "knowledge", label: "Knowledge" },
    { key: "energyLevel", label: "Energy Level" },
    { key: "jobRequirements", label: "Job Requirements" },
    { key: "cultureFit", label: "Culture Fit" },
    { key: "expatLocal", label: "Expat/Local" },
    { key: "otherCriteria", label: "Other Criteria" },
];
var EvaluationForm = function () {
    var _a;
    var location = (0, react_router_dom_1.useLocation)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var currentUserEmail = ((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _a === void 0 ? void 0 : _a[0]) || "";
    var currentUserName = "Current User";
    var jobTitleEn = "HOD - Mining";
    var jobTitleFr = "Chef de département - Mines";
    // Data passed from EvaluationTable row click
    var _b = location.state || {}, candidateId = _b.ID, RecruitmentID = _b.RecruitmentID, InterviewLevel = _b.InterviewLevel, passedGrade = _b.grade;
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)({}), candidateInfo = _d[0], setCandidateInfo = _d[1];
    var _e = (0, react_1.useState)([]), panelMembers = _e[0], setPanelMembers = _e[1];
    var _f = (0, react_1.useState)([]), questions = _f[0], setQuestions = _f[1];
    var _g = (0, react_1.useState)(null), currentUserPanelId = _g[0], setCurrentUserPanelId = _g[1];
    var _h = (0, react_1.useState)({}), questionScores = _h[0], setQuestionScores = _h[1];
    var _j = (0, react_1.useState)({
        qualifications: 0, experience: 0, knowledge: 0, energyLevel: 0,
        jobRequirements: 0, cultureFit: 0, expatLocal: 0, otherCriteria: 0
    }), competencies = _j[0], setCompetencies = _j[1];
    var _k = (0, react_1.useState)(null), recommendation = _k[0], setRecommendation = _k[1];
    var _l = (0, react_1.useState)(""), feedback = _l[0], setFeedback = _l[1];
    var _m = (0, react_1.useState)(false), acknowledged = _m[0], setAcknowledged = _m[1];
    (0, react_1.useEffect)(function () {
        if (!candidateId) {
            navigate("/Dashboard");
            return;
        }
        fetchFormData();
    }, [candidateId]);
    var fetchFormData = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getEvaluationFormData(candidateId, RecruitmentID, currentUserEmail)];
                case 1:
                    res = _a.sent();
                    if (res.success) {
                        setCandidateInfo(res.candidateData);
                        setPanelMembers(res.panelMembers);
                        setQuestions(res.questions);
                        setCurrentUserPanelId(res.currentUserPanelId);
                    }
                    else {
                        alert("Error loading candidate data.");
                    }
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleCompetencyChange = function (key, value) {
        setCompetencies(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
    };
    var handleQuestionScore = function (index, score) {
        setQuestionScores(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[index] = score, _a)));
        });
    };
    var isFormValid = function () {
        var allCompetenciesScored = Object.values(competencies).every(function (val) { return val > 0; });
        var allQuestionsScored = questions.length === 0 || Object.keys(questionScores).length === questions.length;
        return allCompetenciesScored && allQuestionsScored && recommendation !== null && feedback.trim() !== "" && acknowledged;
    };
    var handleSubmit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var payload, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isFormValid()) {
                        alert("Please fill all mandatory fields, scores, and check the acknowledgment.");
                        return [2 /*return*/];
                    }
                    if (!currentUserPanelId) {
                        alert("You are not assigned as a panel member for this candidate.");
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    payload = {
                        InterviewPanelIDId: currentUserPanelId,
                        RecruitmentIDId: RecruitmentID,
                        RelevantQualification: String(competencies.qualifications),
                        ReleventExperience: String(competencies.experience),
                        Knowledge: String(competencies.knowledge),
                        EnergyLevel: String(competencies.energyLevel),
                        MeetJobRequirement: String(competencies.jobRequirements),
                        ContributeTowardsCultureRequried: String(competencies.cultureFit),
                        Experience: String(competencies.expatLocal),
                        OtherCriteriaScore: String(competencies.otherCriteria),
                        ConsiderForEmployment: recommendation === "Consider" ? "Yes" : "No",
                        OverAllEvaluationFeedback: feedback,
                    };
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.submitScorecard(payload, currentUserPanelId)];
                case 1:
                    result = _a.sent();
                    setLoading(false);
                    if (result.success) {
                        alert(result.message);
                        navigate("/Dashboard");
                    }
                    else {
                        alert(result.message);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return react_1.default.createElement("div", { style: { padding: 40, textAlign: 'center', color: '#64748b' } }, "Loading Evaluation Form...");
    return (react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.page },
        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.breadcrumb },
            react_1.default.createElement("span", null, "HOME"),
            " ",
            react_1.default.createElement("span", { className: EvaluationForm_module_scss_1.default.sep }, ">"),
            react_1.default.createElement("span", { onClick: function () { return navigate("/Dashboard"); }, style: { cursor: "pointer" } }, "DASHBOARD"),
            " ",
            react_1.default.createElement("span", { className: EvaluationForm_module_scss_1.default.sep }, ">"),
            react_1.default.createElement("span", null, "CANDIDATE EVALUATIONS"),
            " ",
            react_1.default.createElement("span", { className: EvaluationForm_module_scss_1.default.sep }, ">"),
            react_1.default.createElement("span", { className: EvaluationForm_module_scss_1.default.active }, "EVALUATION FORM")),
        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.container },
            react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.sidebar },
                react_1.default.createElement("h3", null, "CANDIDATE INFO"),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                    react_1.default.createElement("label", null, "Applicant Name"),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, candidateInfo === null || candidateInfo === void 0 ? void 0 :
                        candidateInfo.FristName,
                        " ", candidateInfo === null || candidateInfo === void 0 ? void 0 :
                        candidateInfo.LastName)),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                    react_1.default.createElement("label", null, "Nationality"),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, (candidateInfo === null || candidateInfo === void 0 ? void 0 : candidateInfo.Nationality) || "N/A")),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                    react_1.default.createElement("label", null, "Gender"),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, (candidateInfo === null || candidateInfo === void 0 ? void 0 : candidateInfo.Gender) || "N/A")),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                    react_1.default.createElement("label", null, "Qualification"),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, (candidateInfo === null || candidateInfo === void 0 ? void 0 : candidateInfo.Qualification) || "N/A")),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.rowGrid },
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                        react_1.default.createElement("label", null, "Mining Exp."),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, (candidateInfo === null || candidateInfo === void 0 ? void 0 : candidateInfo.TotalYearOfExperiance) || "0")),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                        react_1.default.createElement("label", null, "Related Exp."),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, (candidateInfo === null || candidateInfo === void 0 ? void 0 : candidateInfo.ReleventExperience) || "0"))),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.rowGrid },
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                        react_1.default.createElement("label", null, "Interview Date"),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, (candidateInfo === null || candidateInfo === void 0 ? void 0 : candidateInfo.InterviewDate) ? new Date(candidateInfo.InterviewDate).toISOString().split('T')[0] : "N/A")),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                        react_1.default.createElement("label", null, "Levels"),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, InterviewLevel || "Level 1"))),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.rowGrid },
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                        react_1.default.createElement("label", null, "Grade"),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, passedGrade || "N/A")),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                        react_1.default.createElement("label", null, "Conflicts"),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, (candidateInfo === null || candidateInfo === void 0 ? void 0 : candidateInfo.ConflictsOfInterest) ? "Yes" : "No"))),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                    react_1.default.createElement("label", null, "Disability"),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.valueBox }, (candidateInfo === null || candidateInfo === void 0 ? void 0 : candidateInfo.Disability) || "No")),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.infoGroup },
                    react_1.default.createElement("label", null, "Interview Panel"),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.panelList }, panelMembers.map(function (name, idx) { return (react_1.default.createElement("div", { key: idx, className: EvaluationForm_module_scss_1.default.panelItem },
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.avatar }, idx + 1),
                        name)); })))),
            react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.mainContent },
                questions.length > 0 && (react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.section },
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.sectionHeader },
                        react_1.default.createElement("h2", null, "INTERVIEW QUESTIONNAIRES"),
                        react_1.default.createElement("div", { style: { fontSize: 11, color: '#64748b', fontWeight: 600 } },
                            "RATING GUIDE: ",
                            react_1.default.createElement("span", { style: { color: '#10b981' } }, "\u25CF 3 - Excellent"),
                            " \u00A0 ",
                            react_1.default.createElement("span", { style: { color: '#3b82f6' } }, "\u25CF 2 - Acceptable"),
                            " \u00A0 ",
                            react_1.default.createElement("span", { style: { color: '#ef4444' } }, "\u25CF 1 - Not Acceptable"))),
                    questions.map(function (q, index) { return (react_1.default.createElement("div", { key: index, className: EvaluationForm_module_scss_1.default.questionCard },
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.qHeader },
                            react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.qNum },
                                "Q",
                                index + 1),
                            react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.qText }, q.question || "Question text not provided.")),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.expectedResponse },
                            react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.erTitle }, "\u2713 EXPECTED RESPONSE GUIDE"),
                            react_1.default.createElement("div", null, q.answer || "Look for key indicators relevant to the question.")),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.ratingArea },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("span", { className: EvaluationForm_module_scss_1.default.ratingLabel },
                                    "PANEL RATING ",
                                    react_1.default.createElement("span", null, "*")),
                                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.ratingButtons },
                                    react_1.default.createElement("button", { type: "button", className: questionScores[index] === 1 ? EvaluationForm_module_scss_1.default.activeNotAcceptable : "", onClick: function () { return handleQuestionScore(index, 1); } }, "Not Acceptable"),
                                    react_1.default.createElement("button", { type: "button", className: questionScores[index] === 2 ? EvaluationForm_module_scss_1.default.activeAcceptable : "", onClick: function () { return handleQuestionScore(index, 2); } }, "Acceptable"),
                                    react_1.default.createElement("button", { type: "button", className: questionScores[index] === 3 ? EvaluationForm_module_scss_1.default.activeExcellent : "", onClick: function () { return handleQuestionScore(index, 3); } }, "Excellent"))),
                            react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.scoreDisplay },
                                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.scoreLabel }, "SCORE"),
                                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.scoreValue },
                                    questionScores[index] || 0,
                                    react_1.default.createElement("span", null, "/3")))))); }))),
                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.section },
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.sectionHeader },
                        react_1.default.createElement("h2", null, "SCORECARD DETAILS")),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.competencyGrid }, COMPETENCY_FIELDS.map(function (comp) { return (react_1.default.createElement("div", { key: comp.key, className: EvaluationForm_module_scss_1.default.compItem },
                        react_1.default.createElement("label", null,
                            comp.label,
                            " ",
                            react_1.default.createElement("span", null, "*")),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.scaleOptions }, [1, 2, 3, 4, 5].map(function (num) { return (react_1.default.createElement("button", { key: num, type: "button", className: "".concat(EvaluationForm_module_scss_1.default.scaleBtn, " ").concat(competencies[comp.key] === num ? EvaluationForm_module_scss_1.default.selected : ""), onClick: function () { return handleCompetencyChange(comp.key, num); } }, num)); })))); })),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.feedbackGrid },
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.recGroup },
                            react_1.default.createElement("label", null,
                                "RECOMMENDATION ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.recBtns },
                                react_1.default.createElement("button", { type: "button", className: recommendation === "Consider" ? EvaluationForm_module_scss_1.default.activeConsider : "", onClick: function () { return setRecommendation("Consider"); } }, "\u2713 Consider for Employment"),
                                react_1.default.createElement("button", { type: "button", className: recommendation === "DoNotConsider" ? EvaluationForm_module_scss_1.default.activeDoNot : "", onClick: function () { return setRecommendation("DoNotConsider"); } }, "\u2715 Do Not Consider"))),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.feedGroup },
                            react_1.default.createElement("label", null,
                                "OVERALL EVALUATION FEEDBACK ",
                                react_1.default.createElement("span", null, "*")),
                            react_1.default.createElement("textarea", { value: feedback, onChange: function (e) { return setFeedback(e.target.value); }, placeholder: "Enter overall feedback..." }))),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.ackBox },
                        react_1.default.createElement("input", { type: "checkbox", checked: acknowledged, onChange: function (e) { return setAcknowledged(e.target.checked); } }),
                        react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.ackContent },
                            react_1.default.createElement("p", null, "I hereby acknowledge that I have completed the candidate evaluation and scorecard entry, and I confirm that the scores and feedback provided are accurate."),
                            react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerBlock },
                                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerAvatar }, currentUserName.charAt(0).toUpperCase()),
                                react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerDetails },
                                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerNameGroup },
                                        react_1.default.createElement("span", null, "REVIEWER NAME"),
                                        react_1.default.createElement("h4", null, currentUserName)),
                                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.reviewerJobGroup },
                                        react_1.default.createElement("span", null, "JOB TITLE (EN)"),
                                        react_1.default.createElement("h4", null, jobTitleEn),
                                        react_1.default.createElement("span", { className: EvaluationForm_module_scss_1.default.frTitle }, "JOB TITLE (FR)"),
                                        react_1.default.createElement("h4", null, jobTitleFr)))))),
                    react_1.default.createElement("div", { className: EvaluationForm_module_scss_1.default.footerActions },
                        react_1.default.createElement("button", { type: "button", className: EvaluationForm_module_scss_1.default.cancelBtn, onClick: function () { return navigate("/Dashboard"); } }, "Cancel"),
                        react_1.default.createElement("button", { type: "button", className: EvaluationForm_module_scss_1.default.submitBtn, onClick: handleSubmit, disabled: !isFormValid() || loading }, loading ? "Submitting..." : "Submit Evaluation")))))));
};
exports.default = EvaluationForm;
//# sourceMappingURL=EvaluationForm.js.map