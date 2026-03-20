"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("./Questioncreation.scss");
var fetchQuestionbank_1 = require("./Hooks/fetchQuestionbank");
var framer_motion_1 = require("framer-motion");
var InterviewQuestion_1 = require("./Component/InterviewQuestion");
var CreateMinimumCriteriaQuestion_1 = require("./Component/skeleton/CreateMinimumCriteriaQuestion");
var SuccessToast_1 = require("../../Comman/Toast/SuccessToast");
var useToast_1 = require("../../Hooks/useToast");
var react_router_dom_1 = require("react-router-dom");
var DEFAULT_NEW_QUESTION = function () { return ({
    type: "single",
    questionEn: "",
    questionFr: "",
    options: [
        { id: "1", textEn: "", textFr: "", isCorrect: false },
        { id: "2", textEn: "", textFr: "", isCorrect: false },
    ],
}); };
var QuestionCreation = function () {
    var _a, _b;
    var _c = (0, fetchQuestionbank_1.useFetchQuestionBank)(), questionBank = _c.questionBank, loading = _c.loading;
    var _d = (0, useToast_1.useToast)(), toast = _d.toast, closeToast = _d.closeToast, showSuccess = _d.showSuccess, showError = _d.showError, showWarning = _d.showWarning, showConfirm = _d.showConfirm;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _e = (0, react_1.useState)([]), preparedQuestions = _e[0], setPreparedQuestions = _e[1];
    var _f = (0, react_1.useState)(DEFAULT_NEW_QUESTION()), newQuestion = _f[0], setNewQuestion = _f[1];
    var _g = (0, react_1.useState)(""), searchQuery = _g[0], setSearchQuery = _g[1];
    var handleAddFromBank = function (q) {
        var alreadyAdded = preparedQuestions.some(function (pq) { return pq.id === q.id && pq.fromBank; });
        if (!alreadyAdded) {
            setPreparedQuestions(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [tslib_1.__assign(tslib_1.__assign({}, q), { fromBank: true })], false); });
        }
    };
    var handleAddNew = function () {
        var _a, _b, _c, _d, _e;
        var hasQuestion = newQuestion.questionEn || newQuestion.questionFr;
        var hasCorrect = (_a = newQuestion.options) === null || _a === void 0 ? void 0 : _a.some(function (o) { return o.isCorrect; });
        if (!hasQuestion || !hasCorrect)
            return;
        var question = {
            id: Date.now(),
            type: (_b = newQuestion.type) !== null && _b !== void 0 ? _b : "single",
            questionEn: (_c = newQuestion.questionEn) !== null && _c !== void 0 ? _c : "",
            questionFr: (_d = newQuestion.questionFr) !== null && _d !== void 0 ? _d : "",
            options: (_e = newQuestion.options) !== null && _e !== void 0 ? _e : [],
            fromBank: false,
        };
        setPreparedQuestions(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [question], false); });
        setNewQuestion(DEFAULT_NEW_QUESTION());
    };
    var handleRemovePrepared = function (id) {
        setPreparedQuestions(function (prev) { return prev.filter(function (q) { return q.id !== id; }); });
    };
    var onBack = function () {
        navigate("/RecruitmentTable");
    };
    var handleSave = function () {
        // (preparedQuestions)
        showSuccess("Question Creation Successfully");
        navigate("/RecruitmentTable");
    };
    var preparedIds = preparedQuestions.filter(function (q) { return q.fromBank; }).map(function (q) { return q.id; });
    var job = {
        jobCode: "SOQ001",
        jobTitle: "Senior Executive",
        buCode: "110011010101",
        nationality: "Expatriate"
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "qc", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: "easeOut" } },
        react_1.default.createElement("div", { className: "qc__header" },
            react_1.default.createElement("div", { className: "qc__header-left" },
                react_1.default.createElement("button", { className: "qc__back-btn", onClick: onBack, title: "Go back" },
                    react_1.default.createElement(lucide_react_1.ChevronLeft, { size: 20 })),
                react_1.default.createElement("div", { className: "qc__job-info" },
                    react_1.default.createElement("div", { className: "qc__job-top" },
                        react_1.default.createElement("span", { className: "qc__job-code" }, job.jobCode),
                        react_1.default.createElement("h2", { className: "qc__job-title" }, job.jobTitle)),
                    react_1.default.createElement("div", { className: "qc__job-meta" },
                        react_1.default.createElement("span", { className: "qc__job-meta-item" },
                            react_1.default.createElement(lucide_react_1.Globe, { size: 10 }),
                            " ", (_a = job.buCode) !== null && _a !== void 0 ? _a : "N/A"),
                        react_1.default.createElement("span", { className: "qc__job-meta-dot" }),
                        react_1.default.createElement("span", { className: "qc__job-meta-item" },
                            react_1.default.createElement(lucide_react_1.Users, { size: 10 }),
                            " ", (_b = job.nationality) !== null && _b !== void 0 ? _b : "N/A")))),
            react_1.default.createElement("div", { className: "qc__header-right" },
                react_1.default.createElement("div", { className: "qc__criteria-count" },
                    react_1.default.createElement("span", { className: "qc__criteria-label" }, "Prepared Criteria"),
                    react_1.default.createElement("span", { className: "qc__criteria-value" },
                        preparedQuestions.length,
                        react_1.default.createElement("span", { className: "qc__criteria-unit" }, " Questions"))),
                react_1.default.createElement("button", { className: "qc__save-btn", onClick: handleSave },
                    react_1.default.createElement(lucide_react_1.Save, { size: 15 }),
                    "Finalize & Save"))),
        react_1.default.createElement("div", { className: "qc__grid" },
            react_1.default.createElement("div", { className: "qc__col qc__col--left" },
                react_1.default.createElement(InterviewQuestion_1.InterviewQuestion, { questionBank: questionBank, loading: loading, preparedQuestionIds: preparedIds, searchQuery: searchQuery, onSearchChange: setSearchQuery, onAddFromBank: handleAddFromBank })),
            react_1.default.createElement("div", { className: "qc__col qc__col--right" },
                react_1.default.createElement(CreateMinimumCriteriaQuestion_1.CreateMinimumCriteriaQuestion, { newQuestion: newQuestion, onChange: setNewQuestion, onAdd: handleAddNew, onClear: function () { return setNewQuestion(DEFAULT_NEW_QUESTION()); } }),
                react_1.default.createElement(CreateMinimumCriteriaQuestion_1.PreparedCriteriaSet, { questions: preparedQuestions, onRemove: handleRemovePrepared }))),
        toast.open && (react_1.default.createElement(SuccessToast_1.SuccessToast, { show: toast.open, type: toast.type, title: toast.title, message: toast.message, autoDismiss: toast.autoDismiss, autoDismissDuration: toast.autoDismissDuration, onClose: closeToast }))));
};
exports.default = QuestionCreation;
//# sourceMappingURL=Questioncreation.js.map