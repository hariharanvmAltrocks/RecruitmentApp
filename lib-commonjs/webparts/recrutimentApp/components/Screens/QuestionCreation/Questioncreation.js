"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("./Questioncreation.scss");
var fetchQuestionbank_1 = require("./Hooks/fetchQuestionbank");
var framer_motion_1 = require("framer-motion");
var react_router_dom_1 = require("react-router-dom");
var getPositionDetails_1 = require("../RecruitmentTable/AdvertReviewDrawer/Hooks/getPositionDetails");
var Config_1 = require("../../../utilities/Config");
var useSaveQuestions_1 = require("./Hooks/useSaveQuestions");
var Careerportalquestionbank_1 = require("./Component/Careerportalquestionbank");
var Careerportalcomposer_1 = require("./Component/Careerportalcomposer");
var Careerportalpreparedset_1 = require("./Component/Careerportalpreparedset");
var Interviewcomposer_1 = require("./Component/Interviewcomposer");
var Interviewpreparedset_1 = require("./Component/Interviewpreparedset");
var Interviewquestionbank_1 = require("./Component/Interviewquestionbank");
var ModalPopup_1 = require("../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../Comman/ModalPopup/useModalPopup");
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var DEFAULT_NEW_QUESTION = function () { return ({
    type: "single",
    questionEn: "",
    questionFr: "",
    answerEn: "",
    answerFr: "",
    options: [
        { id: "1", textEn: "", textFr: "", isCorrect: false },
        { id: "2", textEn: "", textFr: "", isCorrect: false },
    ],
}); };
var QuestionCreation = function (props) {
    var _a, _b;
    var _c = (0, getPositionDetails_1.usePositionDetails)(props.ID, ""), positionDetails = _c.data, positionLoading = _c.loading;
    var deptCode = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DeptCode;
    var statusId = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusId;
    var shouldFetch = !!deptCode && !!statusId;
    var mode = statusId === Config_1.StatusId.CareerPortalQuestions ? "careerPortal" : "interview";
    var _d = (0, fetchQuestionbank_1.useFetchQuestionBank)(shouldFetch ? deptCode : "", shouldFetch ? statusId : 0, !positionLoading), questionBank = _d.questionBank, loading = _d.loading;
    var _e = (0, useModalPopup_1.useModalPopup)(), modalState = _e.modalState, showModal = _e.showModal, closeModal = _e.closeModal;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _f = (0, useSaveQuestions_1.useSaveQuestions)(), saving = _f.saving, save = _f.save;
    var _g = (0, react_1.useState)([]), preparedQuestions = _g[0], setPreparedQuestions = _g[1];
    var _h = (0, react_1.useState)(DEFAULT_NEW_QUESTION()), newQuestion = _h[0], setNewQuestion = _h[1];
    var _j = (0, react_1.useState)(""), searchQuery = _j[0], setSearchQuery = _j[1];
    var handleAddFromBank = function (q) {
        var alreadyAdded = preparedQuestions.some(function (pq) { return pq.id === q.id && pq.fromBank; });
        if (!alreadyAdded) {
            setPreparedQuestions(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [tslib_1.__assign(tslib_1.__assign({}, q), { fromBank: true })], false); });
        }
    };
    var handleAddNew = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var hasQuestion = newQuestion.questionEn || newQuestion.questionFr;
        if (mode === "careerPortal") {
            var hasCorrect = (_a = newQuestion.options) === null || _a === void 0 ? void 0 : _a.some(function (o) { return o.isCorrect; });
            if (!hasQuestion || !hasCorrect)
                return;
        }
        else {
            if (!hasQuestion)
                return;
        }
        var question = {
            id: Date.now(),
            type: mode === "interview" ? "interview" : (_b = newQuestion.type) !== null && _b !== void 0 ? _b : "single",
            questionEn: (_c = newQuestion.questionEn) !== null && _c !== void 0 ? _c : "",
            questionFr: (_d = newQuestion.questionFr) !== null && _d !== void 0 ? _d : "",
            answerEn: (_e = newQuestion.answerEn) !== null && _e !== void 0 ? _e : "",
            answerFr: (_f = newQuestion.answerFr) !== null && _f !== void 0 ? _f : "",
            options: (_g = newQuestion.options) !== null && _g !== void 0 ? _g : [],
            fromBank: false,
        };
        setPreparedQuestions(function (prev) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [question], false); });
        setNewQuestion(DEFAULT_NEW_QUESTION());
    };
    var handleRemovePrepared = function (id) {
        setPreparedQuestions(function (prev) { return prev.filter(function (q) { return q.id !== id; }); });
    };
    var handleSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var minQuestions, remaining, success;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    minQuestions = 5;
                    remaining = minQuestions - preparedQuestions.length;
                    if (mode === "careerPortal" && preparedQuestions.length < minQuestions) {
                        showModal({
                            type: "error",
                            title: "Minimum Requirement",
                            message: "Please add at least ".concat(minQuestions, " questions. You need ").concat(remaining, " more."),
                            confirmLabel: "Ok",
                            onConfirm: closeModal,
                        });
                        return [2 /*return*/];
                    }
                    else if (mode === "interview" && preparedQuestions.length < 1) {
                        showModal({
                            type: "error",
                            title: "Minimum Requirement",
                            message: "Please add at least ".concat(1, " questions."),
                            confirmLabel: "Ok",
                            onConfirm: closeModal,
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, save({
                            positionId: props.ID,
                            mode: mode,
                            questions: preparedQuestions,
                            JobCodeId: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId,
                            DptCode: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DeptCode
                        })];
                case 1:
                    success = _a.sent();
                    if (success) {
                        showModal({
                            type: "success",
                            title: "Submitted Successfully",
                            message: mode === "careerPortal" ? ConditionConfig_1.RecuritmentHRMsg.CareerportalSuccessMsg : ConditionConfig_1.RecuritmentHRMsg.InterviewQuestionSuccessMsg,
                            confirmLabel: "Go to Dashboard",
                            onConfirm: function () {
                                closeModal();
                                navigate("/RecruitmentTable");
                            },
                        });
                    }
                    else {
                        showModal({
                            type: "error",
                            title: "Error",
                            message: "Failed to save questions. Please try again.",
                            confirmLabel: "Ok",
                            onConfirm: function () {
                                closeModal();
                            },
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onBack = function () { return navigate("/RecruitmentTable"); };
    var preparedIds = preparedQuestions.filter(function (q) { return q.fromBank; }).map(function (q) { return q.id; });
    var job = {
        jobCode: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode,
        jobTitle: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleEnglish,
        buCode: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCode,
        nationality: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality,
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(framer_motion_1.motion.div, { className: "qc", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: "easeOut" } },
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
                        react_1.default.createElement("span", { className: "qc__criteria-label" }, mode === "careerPortal" ? "Prepared Criteria" : "Interview Set"),
                        react_1.default.createElement("span", { className: "qc__criteria-value" },
                            preparedQuestions.length,
                            react_1.default.createElement("span", { className: "qc__criteria-unit" }, " Questions"))),
                    react_1.default.createElement("button", { className: "qc__save-btn", onClick: handleSave, disabled: saving },
                        react_1.default.createElement(lucide_react_1.Save, { size: 15 }),
                        saving ? "Saving..." : "Finalize & Save"))),
            react_1.default.createElement("div", { className: "qc__grid" }, mode === "careerPortal" ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "qc__col qc__col--left" },
                    react_1.default.createElement(Careerportalquestionbank_1.CareerPortalQuestionBank, { questionBank: questionBank, loading: loading, preparedQuestionIds: preparedIds, searchQuery: searchQuery, onSearchChange: setSearchQuery, onAddFromBank: handleAddFromBank })),
                react_1.default.createElement("div", { className: "qc__col qc__col--right" },
                    react_1.default.createElement(Careerportalcomposer_1.CareerPortalComposer, { newQuestion: newQuestion, onChange: setNewQuestion, onAdd: handleAddNew, onClear: function () { return setNewQuestion(DEFAULT_NEW_QUESTION()); } }),
                    react_1.default.createElement(Careerportalpreparedset_1.CareerPortalPreparedSet, { questions: preparedQuestions, onRemove: handleRemovePrepared })))) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "qc__col qc__col--left" },
                    react_1.default.createElement(Interviewquestionbank_1.InterviewQuestionBank, { questionBank: questionBank, loading: loading, preparedQuestionIds: preparedIds, onAddFromBank: handleAddFromBank })),
                react_1.default.createElement("div", { className: "qc__col qc__col--right" },
                    react_1.default.createElement(Interviewcomposer_1.InterviewComposer, { newQuestion: newQuestion, onChange: setNewQuestion, onAdd: handleAddNew, onClear: function () { return setNewQuestion(DEFAULT_NEW_QUESTION()); } }),
                    react_1.default.createElement(Interviewpreparedset_1.InterviewPreparedSet, { questions: preparedQuestions, onRemove: handleRemovePrepared })))))),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))));
};
exports.default = QuestionCreation;
//# sourceMappingURL=Questioncreation.js.map