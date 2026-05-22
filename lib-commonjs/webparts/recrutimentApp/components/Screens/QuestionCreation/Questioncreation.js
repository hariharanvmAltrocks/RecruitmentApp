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
var loading_1 = tslib_1.__importDefault(require("../../Comman/Loading/loading"));
var cn_1 = require("../../../utilities/cn");
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
    var _d = (0, fetchQuestionbank_1.useFetchQuestionBank)(shouldFetch ? deptCode : "", shouldFetch ? statusId : 0, !positionLoading), questionBank = _d.questionBank, questionloading = _d.loading;
    var _e = (0, useModalPopup_1.useModalPopup)(), modalState = _e.modalState, showModal = _e.showModal, closeModal = _e.closeModal;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _f = (0, useSaveQuestions_1.useSaveQuestions)(), saving = _f.saving, save = _f.save;
    var _g = (0, react_1.useState)(null), sourceSelection = _g[0], setSourceSelection = _g[1];
    var _h = (0, react_1.useState)([]), preparedQuestions = _h[0], setPreparedQuestions = _h[1];
    var _j = (0, react_1.useState)(DEFAULT_NEW_QUESTION()), newQuestion = _j[0], setNewQuestion = _j[1];
    var _k = (0, react_1.useState)(""), searchQuery = _k[0], setSearchQuery = _k[1];
    var _l = (0, react_1.useState)(false), loading = _l[0], setLoading = _l[1];
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
            type: mode === "interview" ? "interview" : ((_b = newQuestion.type) !== null && _b !== void 0 ? _b : "single"),
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
    var handleEditPrepared = function (id) {
        setNewQuestion(preparedQuestions.find(function (q) { return q.id === id; }) || DEFAULT_NEW_QUESTION());
        setPreparedQuestions(function (prev) { return prev.filter(function (q) { return q.id !== id; }); });
    };
    var handleSave = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var minQuestions, remaining, StatusIDs, success;
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
                    setLoading(true);
                    debugger;
                    StatusIDs = (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.AssignHOD.toLowerCase()) === (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.AssignLineManager.toLowerCase()) ? Config_1.StatusId.PendingReviewAdvertHOD : Config_1.StatusId.CareerPortalQuestions;
                    return [4 /*yield*/, save({
                            positionId: props.ID,
                            mode: mode,
                            questions: preparedQuestions,
                            JobCodeId: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId,
                            DptCode: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DeptCode,
                            StatusId: StatusIDs,
                        })];
                case 1:
                    success = _a.sent();
                    if (success) {
                        setLoading(false);
                        showModal({
                            type: "success",
                            title: "Submitted Successfully",
                            message: mode === "careerPortal"
                                ? ConditionConfig_1.RecuritmentHRMsg.CareerportalSuccessMsg
                                : ConditionConfig_1.RecuritmentHRMsg.InterviewQuestionSuccessMsg,
                            confirmLabel: "OK",
                            onConfirm: function () {
                                closeModal();
                                navigate("/MyTracker");
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
    var onBack = function () { return navigate("/MyTracker"); };
    var handleBack = function () {
        if (sourceSelection) {
            setSourceSelection(null);
        }
        else {
            onBack();
        }
    };
    var preparedIds = preparedQuestions
        .filter(function (q) { return q.fromBank; })
        .map(function (q) { return q.id; });
    var job = {
        jobCode: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode,
        jobTitle: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleEnglish,
        buCode: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCode,
        nationality: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality,
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        loading && react_1.default.createElement(loading_1.default, null),
        react_1.default.createElement(framer_motion_1.motion.div, { className: "qc", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: "easeOut" } },
            sourceSelection && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "qc__header" },
                    react_1.default.createElement("div", { className: "qc__header-left" },
                        react_1.default.createElement("button", { className: "qc__back-btn", onClick: handleBack, title: "Go back" },
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
                            react_1.default.createElement("span", { className: "qc__criteria-label" }, mode === "careerPortal"
                                ? "Prepared Criteria"
                                : "Interview Set"),
                            react_1.default.createElement("span", { className: "qc__criteria-value" },
                                preparedQuestions.length,
                                react_1.default.createElement("span", { className: "qc__criteria-unit" }, " Questions"))),
                        react_1.default.createElement("button", { className: "qc__save-btn", onClick: handleSave, disabled: saving },
                            react_1.default.createElement(lucide_react_1.Save, { size: 15 }),
                            saving ? "Saving..." : "Finalize & Save"))))),
            react_1.default.createElement(framer_motion_1.AnimatePresence, { exitBeforeEnter: true }, !sourceSelection ? (react_1.default.createElement(framer_motion_1.motion.div, { key: "selection-screen", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.25 }, className: "qc-selection" },
                react_1.default.createElement("div", { className: "qc-selection__header" },
                    react_1.default.createElement("div", { className: "qc-selection__icon-box" },
                        react_1.default.createElement(lucide_react_1.ClipboardList, { size: 32 })),
                    react_1.default.createElement("h3", { className: "qc-selection__title" }, "Question Setup Configuration"),
                    react_1.default.createElement("p", { className: "qc-selection__subtitle" }, "Which type of question you are planning to set for this job title?")),
                react_1.default.createElement("div", { className: "qc-selection__options" }, [
                    {
                        id: "bank",
                        label: "From Question bank",
                        desc: "Select pre-verified questions from our official library",
                    },
                    {
                        id: "new",
                        label: "Create New set of question",
                        desc: "Author custom questions specifically for this role",
                    },
                    {
                        id: "both",
                        label: "Both",
                        desc: "Combine library templates with custom authored questions",
                    },
                ].map(function (option) {
                    var isSelected = sourceSelection === option.id;
                    return (react_1.default.createElement("div", { key: option.id, className: (0, cn_1.cn)("qc-selection__option", isSelected && "qc-selection__option--selected"), onClick: function () { return setSourceSelection(option.id); } },
                        react_1.default.createElement("div", { className: (0, cn_1.cn)("qc-selection__radio", isSelected && "qc-selection__radio--selected") }, isSelected && (react_1.default.createElement("div", { className: "qc-selection__radio-inner" }))),
                        react_1.default.createElement("div", { className: "qc-selection__option-content" },
                            react_1.default.createElement("div", { className: "qc-selection__option-label" }, option.label),
                            react_1.default.createElement("div", { className: "qc-selection__option-desc" }, option.desc))));
                })),
                react_1.default.createElement("div", { className: "qc-selection__footer" },
                    react_1.default.createElement("button", { onClick: onBack, className: "qc-selection__cancel-btn" }, "Cancel Process")))) : (react_1.default.createElement(framer_motion_1.motion.div, { key: "main-ui", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 }, className: "qc__grid" },
                react_1.default.createElement("div", { className: "qc__col qc__col--left" },
                    sourceSelection === "bank" && (mode === "careerPortal" ? (react_1.default.createElement(Careerportalquestionbank_1.CareerPortalQuestionBank, { questionBank: questionBank, loading: questionloading, preparedQuestionIds: preparedIds, searchQuery: searchQuery, onSearchChange: setSearchQuery, onAddFromBank: handleAddFromBank })) : (react_1.default.createElement(Interviewquestionbank_1.InterviewQuestionBank, { questionBank: questionBank, loading: questionloading, preparedQuestionIds: preparedIds, onAddFromBank: handleAddFromBank }))),
                    sourceSelection === "new" && (mode === "careerPortal" ? (react_1.default.createElement(Careerportalcomposer_1.CareerPortalComposer, { newQuestion: newQuestion, onChange: setNewQuestion, onAdd: handleAddNew, onClear: function () { return setNewQuestion(DEFAULT_NEW_QUESTION()); } })) : (react_1.default.createElement(Interviewcomposer_1.InterviewComposer, { newQuestion: newQuestion, onChange: setNewQuestion, onAdd: handleAddNew, onClear: function () { return setNewQuestion(DEFAULT_NEW_QUESTION()); } }))),
                    sourceSelection === "both" && (mode === "careerPortal" ? (react_1.default.createElement(Careerportalquestionbank_1.CareerPortalQuestionBank, { questionBank: questionBank, loading: questionloading, preparedQuestionIds: preparedIds, searchQuery: searchQuery, onSearchChange: setSearchQuery, onAddFromBank: handleAddFromBank })) : (react_1.default.createElement(Interviewquestionbank_1.InterviewQuestionBank, { questionBank: questionBank, loading: questionloading, preparedQuestionIds: preparedIds, onAddFromBank: handleAddFromBank })))),
                react_1.default.createElement("div", { className: "qc__col qc__col--right" },
                    sourceSelection === "bank" && (mode === "careerPortal" ? (react_1.default.createElement(Careerportalpreparedset_1.CareerPortalPreparedSet, { questions: preparedQuestions, onRemove: handleRemovePrepared, onEdit: handleEditPrepared })) : (react_1.default.createElement(Interviewpreparedset_1.InterviewPreparedSet, { questions: preparedQuestions, onRemove: handleRemovePrepared, onEdit: handleEditPrepared }))),
                    sourceSelection === "new" && (mode === "careerPortal" ? (react_1.default.createElement(Careerportalpreparedset_1.CareerPortalPreparedSet, { questions: preparedQuestions, onRemove: handleRemovePrepared, onEdit: handleEditPrepared })) : (react_1.default.createElement(Interviewpreparedset_1.InterviewPreparedSet, { questions: preparedQuestions, onRemove: handleRemovePrepared, onEdit: handleEditPrepared }))),
                    sourceSelection === "both" && (react_1.default.createElement(react_1.default.Fragment, null, mode === "careerPortal" ? (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Careerportalcomposer_1.CareerPortalComposer, { newQuestion: newQuestion, onChange: setNewQuestion, onAdd: handleAddNew, onClear: function () { return setNewQuestion(DEFAULT_NEW_QUESTION()); } }),
                        react_1.default.createElement(Careerportalpreparedset_1.CareerPortalPreparedSet, { questions: preparedQuestions, onRemove: handleRemovePrepared, onEdit: handleEditPrepared }))) : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Interviewcomposer_1.InterviewComposer, { newQuestion: newQuestion, onChange: setNewQuestion, onAdd: handleAddNew, onClear: function () { return setNewQuestion(DEFAULT_NEW_QUESTION()); } }),
                        react_1.default.createElement(Interviewpreparedset_1.InterviewPreparedSet, { questions: preparedQuestions, onRemove: handleRemovePrepared, onEdit: handleEditPrepared })))))))))),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))));
};
exports.default = QuestionCreation;
//# sourceMappingURL=Questioncreation.js.map