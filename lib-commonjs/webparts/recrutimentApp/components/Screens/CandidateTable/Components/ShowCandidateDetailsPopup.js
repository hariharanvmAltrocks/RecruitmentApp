"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowCandidateDetailsPopup = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var fetchCandidateDetails_1 = require("../Hooks/fetchCandidateDetails");
var RequiredAttachments_1 = require("../../RecruitmentTable/Components/RequiredAttachments");
var Usesubmitcandidatereview_1 = require("../Hooks/Usesubmitcandidatereview");
var fetchPanelMembers_1 = require("../Hooks/fetchPanelMembers");
var Config_1 = require("../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var useToast_1 = require("../../../Hooks/useToast");
var backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
};
var cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
    exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } },
};
var sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: function (i) { return ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.06, duration: 0.25, ease: "easeOut" },
    }); },
};
var SectionHeader = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, _b = _a.accent, accent = _b === void 0 ? "orange" : _b;
    var colors = {
        orange: "bg-orange-500",
        blue: "bg-blue-500",
        green: "bg-[#0CAF60]",
        red: "bg-[#FF3B5C]",
    };
    return (react_1.default.createElement("div", { className: "flex flex-col mb-5 leading-tight" },
        react_1.default.createElement("div", { className: "flex items-center gap-2.5" },
            react_1.default.createElement("div", { className: "w-[4px] h-[18px] rounded-full ".concat(colors[accent]) }),
            react_1.default.createElement("h3", { className: "text-[13px] font-bold text-[#1B264E] tracking-widest uppercase" }, title)),
        subtitle && react_1.default.createElement("p", { className: "text-[11px] font-semibold text-gray-400 mt-1 pl-[15px]" }, subtitle)));
};
var InfoItem = function (_a) {
    var label = _a.label, value = _a.value, icon = _a.icon;
    return (react_1.default.createElement("div", { className: "flex flex-col gap-1.5 w-full" },
        react_1.default.createElement("div", { className: "flex items-center gap-1.5 text-[11px] font-bold text-[#8E9BBA] uppercase tracking-widest" },
            icon && react_1.default.createElement("span", { className: "text-[#3F62ED]" }, icon),
            label),
        react_1.default.createElement("div", { className: "px-4 py-3 bg-white border border-[#E4E8F1] rounded-[14px] text-sm font-semibold text-[#1B264E] break-words shadow-[0_2px_10px_rgba(0,0,0,0.02)]" }, value !== null && value !== void 0 ? value : "--")));
};
var QuestionCard = function (_a) {
    var index = _a.index, question = _a.question, answer = _a.answer;
    var isYes = (answer === null || answer === void 0 ? void 0 : answer.toLowerCase()) === "yes";
    var isNo = (answer === null || answer === void 0 ? void 0 : answer.toLowerCase()) === "no";
    var toneClass = isYes
        ? "bg-[#e5f7ed] text-[#0CAF60] border-[#0CAF60]/20"
        : isNo
            ? "bg-[#ffebee] text-[#FF3B5C] border-[#FF3B5C]/20"
            : "bg-[#F5F7FA] text-[#8E9BBA] border-[#E4E8F1]";
    return (react_1.default.createElement("div", { className: "flex flex-col gap-4 bg-white border border-[#E4E8F1] rounded-2xl p-6 mb-4 shadow-sm w-full" },
        react_1.default.createElement("div", { className: "flex items-start gap-4" },
            react_1.default.createElement("div", { className: "w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-[14px] border border-[#E4E8F1] bg-[#F8FAFC]" },
                react_1.default.createElement("span", { className: "text-sm font-bold text-[#8E9BBA]" },
                    "Q",
                    index)),
            react_1.default.createElement("div", { className: "flex flex-col w-full" },
                react_1.default.createElement("h4", { className: "text-[15px] font-bold text-[#1B264E] leading-relaxed mb-5 pr-2" }, question),
                react_1.default.createElement("div", { className: "flex items-center gap-3" },
                    react_1.default.createElement("span", { className: "text-[11px] font-bold text-[#8E9BBA] uppercase tracking-widest" }, "Answer:"),
                    react_1.default.createElement("span", { className: "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ".concat(toneClass) }, answer !== null && answer !== void 0 ? answer : "--"))))));
};
var ShowCandidateDetailsPopup = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var isOpen = _a.isOpen, onClose = _a.onClose, candidateId = _a.candidateId, panelParams = _a.panelParams, positionDetails = _a.positionDetails;
    var ReviewHRFlag = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.HRPending;
    var ReviewLML1 = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.LineManagerL1Pending || (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.LineManagerLevel1OnHold;
    var ReviewLML2 = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.LineManagerL2Pending || (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.LineManagerLevel2OnHold;
    var PanelMember = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview || Number(panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
    var panelOptionFlag = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview || Number(panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel || (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.HRPending;
    var isEnabled = !!(panelOptionFlag);
    var _q = (0, fetchPanelMembers_1.useFetchPanelMembers)((_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCodeId) !== null && _b !== void 0 ? _b : 0, (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.AssignEMail) !== null && _c !== void 0 ? _c : "", (_d = panelParams === null || panelParams === void 0 ? void 0 : panelParams.candidateId) !== null && _d !== void 0 ? _d : 0, (_e = panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) !== null && _e !== void 0 ? _e : "", isEnabled), paneloptions = _q.data, panelloading = _q.loading, error = _q.error;
    var _r = (0, fetchCandidateDetails_1.useFetchCandidateDetails)(candidateId), data = _r.data, loading = _r.loading;
    console.log(data, "Datatatatata");
    var _s = (0, useToast_1.useToast)(), toast = _s.toast, closeToast = _s.closeToast, showSuccess = _s.showSuccess, showError = _s.showError;
    var _t = (0, Usesubmitcandidatereview_1.useSubmitCandidateReview)(showError), submitting = _t.submitting, submitError = _t.submitError, submitSuccess = _t.submitSuccess, submit = _t.submit, reset = _t.reset;
    var fileInputRef = (0, react_1.useRef)(null);
    var _u = (0, react_1.useState)(null), decision = _u[0], setDecision = _u[1];
    var _v = (0, react_1.useState)(""), decisionComments = _v[0], setDecisionComments = _v[1];
    var _w = (0, react_1.useState)([]), consultoptions = _w[0], setConsultOptions = _w[1];
    var feedbackOptions = ["Excellent", "Good", "Average", "Below Average", "Poor"];
    var _x = (0, react_1.useState)(""), HRReview = _x[0], setHRReview = _x[1];
    var _y = (0, react_1.useState)(false), open = _y[0], setOpen = _y[1];
    var _z = (0, react_1.useState)({
        consultedWith: "",
        attachment: [],
        comments: "",
    }), coi = _z[0], setCoi = _z[1];
    var _0 = (0, react_1.useState)({
        panelMembers: [],
        startDate: "",
        endDate: "",
    }), level1 = _0[0], setLevel1 = _0[1];
    var _1 = (0, react_1.useState)({
        panelMembers: [],
        startDate: "",
        endDate: "",
    }), level2 = _1[0], setLevel2 = _1[1];
    (0, react_1.useEffect)(function () {
        var _a;
        if (isOpen && paneloptions) {
            var Level1Options = paneloptions.Level1.map(function (item) { return item.label; });
            var Level2Options = (_a = paneloptions.Level2) === null || _a === void 0 ? void 0 : _a.map(function (item) { return item.label; });
            var filterHODLM = paneloptions.Level1.filter(function (item) {
                return item.Role === ConditionConfig_1.RoleName.LineManager ||
                    item.Role === ConditionConfig_1.RoleName.HOD ||
                    item.Role === ConditionConfig_1.RoleName.RecruitmentHR;
            });
            var consultOption = filterHODLM.map(function (item) { return ({
                value: String(item.value),
                label: item.label
            }); });
            setConsultOptions(consultOption);
            setLevel1({ panelMembers: Level1Options !== null && Level1Options !== void 0 ? Level1Options : [], startDate: "", endDate: "" });
            setLevel2({ panelMembers: Level2Options !== null && Level2Options !== void 0 ? Level2Options : [], startDate: "", endDate: "" });
        }
    }, [paneloptions, isOpen]);
    var canSubmit = (0, react_1.useMemo)(function () {
        if (ReviewHRFlag) {
            if (!HRReview && !decisionComments.trim())
                return false;
        }
        if (!decision || !decisionComments.trim())
            return false;
        if ((data === null || data === void 0 ? void 0 : data.ConflictsOfInterest) === "Yes") {
            if (!coi.consultedWith || !coi.comments.trim())
                return false;
        }
        if (level1.panelMembers.length < 3 || !level1.startDate || !level1.endDate)
            return false;
        return true;
    }, [decision, decisionComments, coi, level1, data]);
    var handleFileChange = (0, react_1.useCallback)(function (e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var file, reader;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (!file)
                return [2 /*return*/];
            reader = new FileReader();
            reader.onload = function () {
                var newFile = {
                    name: file.name,
                    content: reader.result,
                    type: "New",
                };
                setCoi(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { attachment: [newFile] })); });
            };
            reader.readAsDataURL(file);
            return [2 /*return*/];
        });
    }); }, []);
    var handleClearFile = function () {
        setCoi(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { attachment: [] })); });
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    var handlePanelToggle = (0, react_1.useCallback)(function (setter, val) {
        setter(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { panelMembers: prev.panelMembers.includes(val)
                ? prev.panelMembers.filter(function (v) { return v !== val; })
                : tslib_1.__spreadArray(tslib_1.__spreadArray([], prev.panelMembers, true), [val], false) })); });
    }, []);
    var showCOI = (data === null || data === void 0 ? void 0 : data.ConflictsOfInterest) === "Yes";
    var showDisability = (data === null || data === void 0 ? void 0 : data.disability) === "Yes";
    var handleSubmit = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var L1Panel, L2Panel;
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!canSubmit)
                        return [2 /*return*/];
                    L1Panel = (_b = (_a = paneloptions === null || paneloptions === void 0 ? void 0 : paneloptions.Level1) === null || _a === void 0 ? void 0 : _a.map(function (item) { return ({ key: Number(item.value), text: item.Email }); })) !== null && _b !== void 0 ? _b : [];
                    L2Panel = (_d = (_c = paneloptions === null || paneloptions === void 0 ? void 0 : paneloptions.Level2) === null || _c === void 0 ? void 0 : _c.map(function (item) { return ({ key: Number(item.value), text: item.Email }); })) !== null && _d !== void 0 ? _d : [];
                    return [4 /*yield*/, submit({
                            candidateId: candidateId,
                            CandidateDetails: data,
                            decision: decision !== null && decision !== void 0 ? decision : "YES",
                            decisionComments: decisionComments,
                            interviewLevel1: level1,
                            interviewLevel2: level2,
                            recrutimentData: positionDetails,
                            interviewPanelL1: L1Panel,
                            interviewPanelL2: L2Panel,
                            HRReviewComents: HRReview,
                            COIFlag: showCOI,
                            COIDetails: coi,
                            StatusId: (_e = panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) !== null && _e !== void 0 ? _e : ""
                        })];
                case 1:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [data, candidateId, decision, decisionComments, coi, level1, level2, submit, canSubmit]);
    if (!isOpen)
        return null;
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null,
        react_1.default.createElement(framer_motion_1.motion.div, { className: "fixed inset-0 flex items-center justify-center bg-[#0C1222]/60 backdrop-blur-sm p-4 md:p-6", style: { zIndex: 2147483647 }, variants: backdropVariants, initial: "hidden", animate: "visible", exit: "exit", onClick: onClose },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "bg-white rounded-[24px] shadow-2xl w-full max-w-[1200px] h-[95vh] max-h-[900px] flex flex-col overflow-hidden relative border border-gray-100", variants: cardVariants, onClick: function (e) { return e.stopPropagation(); } },
                react_1.default.createElement("header", { className: "flex items-start justify-between px-6 py-5 border-b border-[#E4E8F1] flex-shrink-0 bg-white z-10" },
                    react_1.default.createElement("div", { className: "flex items-center gap-4" },
                        react_1.default.createElement("div", { className: "w-12 h-12 bg-[#F0F4FF] text-[#3F62ED] rounded-2xl flex items-center justify-center" },
                            react_1.default.createElement(lucide_react_1.User, { size: 24 })),
                        react_1.default.createElement("div", { className: "flex flex-col" },
                            react_1.default.createElement("div", { className: "flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#8E9BBA] uppercase mb-1" },
                                react_1.default.createElement("span", null, "Candidate selection"),
                                react_1.default.createElement(lucide_react_1.ChevronRight, { size: 12, className: "text-[#E4E8F1]" }),
                                react_1.default.createElement("span", { className: "text-[#1B264E]" }, "Review Profile")),
                            react_1.default.createElement("h2", { className: "text-xl font-bold text-[#1B264E] leading-tight" }, "Candidate Profile Review"),
                            react_1.default.createElement("div", { className: "flex items-center gap-2 text-sm text-[#8E9BBA] mt-1" },
                                react_1.default.createElement("span", { className: "font-bold text-[#3F62ED] bg-[#F0F4FF] px-2 py-0.5 rounded-[6px] text-[11px] uppercase tracking-wider" }, (data === null || data === void 0 ? void 0 : data.JobCode) || '---'),
                                react_1.default.createElement("span", { className: "w-1 h-1 bg-[#E4E8F1] rounded-full" }),
                                react_1.default.createElement("span", { className: "text-[13px] font-medium" }, (data === null || data === void 0 ? void 0 : data.JobTitle) || '---')))),
                    react_1.default.createElement("div", { className: "flex items-center" },
                        react_1.default.createElement("button", { className: "p-2.5 text-[#3F62ED] bg-[#F0F4FF] border border-white \r\n             hover:bg-[#E0E8FF] hover:border-[#E0E8FF] \r\n             rounded-full transition-colors flex-shrink-0", type: "button", onClick: onClose, "aria-label": "Close" },
                            react_1.default.createElement(lucide_react_1.X, { size: 20, strokeWidth: 2.5 })))),
                react_1.default.createElement("div", { className: "flex flex-1 overflow-hidden relative bg-white" },
                    react_1.default.createElement("aside", { className: "w-[280px] flex-shrink-0 bg-white border-r border-[#E4E8F1] overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-thumb-gray-200" },
                        react_1.default.createElement("div", { className: "flex flex-col items-center text-center mb-8 gap-1" },
                            react_1.default.createElement("div", { className: "w-[72px] h-[72px] bg-[#F0F4FF] text-[#3F62ED] rounded-3xl flex items-center justify-center text-3xl font-bold mb-3 shadow-[0_4px_12px_rgba(63,98,237,0.1)]" }, ((_f = data === null || data === void 0 ? void 0 : data.ApplicantName) !== null && _f !== void 0 ? _f : "A").charAt(0)),
                            react_1.default.createElement("h3", { className: "text-[22px] font-extrabold text-[#1B264E] leading-tight tracking-tight" }, (_g = data === null || data === void 0 ? void 0 : data.ApplicantName) !== null && _g !== void 0 ? _g : "--"),
                            react_1.default.createElement("span", { className: "text-[11px] font-bold text-[#3F62ED] tracking-widest uppercase mt-1" }, (_h = data === null || data === void 0 ? void 0 : data.Nationality) !== null && _h !== void 0 ? _h : "--")),
                        react_1.default.createElement("div", { className: "flex flex-col gap-4" },
                            react_1.default.createElement(InfoItem, { icon: react_1.default.createElement(lucide_react_1.Globe, { size: 14 }), label: "Nationality", value: data === null || data === void 0 ? void 0 : data.Nationality }),
                            react_1.default.createElement(InfoItem, { icon: react_1.default.createElement(lucide_react_1.Users, { size: 14 }), label: "Gender", value: data === null || data === void 0 ? void 0 : data.Gender }),
                            react_1.default.createElement(InfoItem, { icon: react_1.default.createElement(lucide_react_1.FileText, { size: 14 }), label: "Qualification", value: data === null || data === void 0 ? void 0 : data.HighestQualification }),
                            react_1.default.createElement("div", { className: "flex flex-row gap-3 w-full" },
                                react_1.default.createElement("div", { className: "flex-1 min-w-0" },
                                    react_1.default.createElement(InfoItem, { icon: react_1.default.createElement(lucide_react_1.Zap, { size: 14 }), label: "Mining exp.", value: data === null || data === void 0 ? void 0 : data.ExperienceMining })),
                                react_1.default.createElement("div", { className: "flex-1 min-w-0" },
                                    react_1.default.createElement(InfoItem, { icon: react_1.default.createElement(lucide_react_1.Zap, { size: 14 }), label: "Related exp.", value: String(data === null || data === void 0 ? void 0 : data.ExperRelatedfield) }))),
                            react_1.default.createElement("div", { className: "flex flex-row gap-3 w-full" },
                                react_1.default.createElement("div", { className: "flex-1 min-w-0" },
                                    react_1.default.createElement(InfoItem, { icon: react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 14 }), label: "Conflicts", value: (_j = data === null || data === void 0 ? void 0 : data.ConflictsOfInterest) !== null && _j !== void 0 ? _j : "No" })),
                                react_1.default.createElement("div", { className: "flex-1 min-w-0" },
                                    react_1.default.createElement(InfoItem, { icon: react_1.default.createElement(lucide_react_1.Accessibility, { size: 14 }), label: "Disability", value: (_k = data === null || data === void 0 ? void 0 : data.disability) !== null && _k !== void 0 ? _k : "No" }))),
                            react_1.default.createElement("div", { className: "flex flex-row gap-3 w-full" },
                                react_1.default.createElement("div", { className: "flex-1 min-w-0" },
                                    react_1.default.createElement(InfoItem, { label: "Tax dependents", value: String(data === null || data === void 0 ? void 0 : data.NumberOftax) })),
                                react_1.default.createElement("div", { className: "flex-1 min-w-0" },
                                    react_1.default.createElement(InfoItem, { label: "Current position", value: data === null || data === void 0 ? void 0 : data.CurrentPosition }))),
                            react_1.default.createElement(InfoItem, { label: "Group / partner companies", value: data === null || data === void 0 ? void 0 : data.hasIvanhoeZijinExperience })),
                        react_1.default.createElement("div", { className: "mt-8 pt-6 border-t border-[#E4E8F1]" },
                            react_1.default.createElement("div", { className: "flex items-center gap-2 mb-4 text-[11px] font-bold text-[#8E9BBA] uppercase tracking-widest" },
                                react_1.default.createElement(lucide_react_1.FileText, { size: 14, className: "text-[#3F62ED]" }),
                                " Attachments"),
                            react_1.default.createElement("div", { className: "bg-[#F5F7FA] rounded-2xl p-4 border border-[#E4E8F1]" },
                                react_1.default.createElement(RequiredAttachments_1.RequiredAttachments, { attachments: (_l = data === null || data === void 0 ? void 0 : data.OverallAtttachment) !== null && _l !== void 0 ? _l : [], isLoading: loading })))),
                    react_1.default.createElement("div", { className: "flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-white relative scrollbar-thin scrollbar-thumb-gray-200" },
                        react_1.default.createElement(framer_motion_1.motion.section, { className: "mb-12", custom: 0, variants: sectionVariants, initial: "hidden", animate: "visible" },
                            react_1.default.createElement("div", { className: "flex flex-col gap-4 w-full min-w-0" },
                                react_1.default.createElement(QuestionCard, { index: 1, question: "Willing to relocate if not currently living close to the relevant project site/office?", answer: data === null || data === void 0 ? void 0 : data.WillingToRelocate }),
                                (data === null || data === void 0 ? void 0 : data.previouslyworkedMine) && react_1.default.createElement(QuestionCard, { index: 2, question: "Has the person previously worked within the Ivanhoe Mines Group?", answer: data === null || data === void 0 ? void 0 : data.previouslyworkedMine }),
                                react_1.default.createElement(QuestionCard, { index: 3, question: "Any family or other links with existing employees to declare? (If so, who? Attach detail)", answer: data === null || data === void 0 ? void 0 : data.familylinks }),
                                react_1.default.createElement(QuestionCard, { index: 4, question: "Any business links to declare? (If so, who? Attach detail)", answer: data === null || data === void 0 ? void 0 : data.businesslinks }))),
                        showCOI && (react_1.default.createElement(framer_motion_1.motion.section, { className: "mb-12", custom: 1, variants: sectionVariants, initial: "hidden", animate: "visible" },
                            react_1.default.createElement(SectionHeader, { title: "Conflict of interest", accent: "red" }),
                            react_1.default.createElement("div", { className: "bg-white border border-[#E4E8F1] rounded-3xl p-6 shadow-sm flex flex-col gap-6 w-full min-w-0" },
                                react_1.default.createElement("div", { className: "flex items-start gap-4 p-4 rounded-2xl bg-[#fff0f2] border border-[#fee2e6] w-[97%] min-w-0" },
                                    react_1.default.createElement(lucide_react_1.AlertTriangle, { className: "text-[#FF3B5C] mt-0.5 flex-shrink-0", size: 20 }),
                                    react_1.default.createElement("div", { className: "flex flex-col gap-1 min-w-0 w-[97%]" },
                                        react_1.default.createElement("span", { className: "text-sm font-bold text-[#FF3B5C]" }, "Conflict of Interest Declared"),
                                        (data === null || data === void 0 ? void 0 : data.COIReason) && react_1.default.createElement("span", { className: "text-[13px] font-medium text-[#FF3B5C]/80 break-all" }, data.COIReason))),
                                react_1.default.createElement("div", { className: "flex flex-col md:flex-row gap-6" },
                                    react_1.default.createElement("div", { className: "flex flex-col gap-2 flex-1 relative" },
                                        react_1.default.createElement("label", { className: "text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase" },
                                            "Consulted with ",
                                            react_1.default.createElement("span", { className: "text-[#FF3B5C]" }, "*")),
                                        react_1.default.createElement("div", { className: "relative" },
                                            react_1.default.createElement("select", { className: "w-full bg-[#F5F7FA] border border-[#E4E8F1] rounded-[16px] px-5 py-3.5 text-sm font-semibold text-[#1B264E] appearance-none focus:outline-none focus:ring-2 focus:ring-[#3F62ED] focus:bg-white cursor-pointer pr-10 transition-all shadow-sm", value: coi.consultedWith, onChange: function (e) { return setCoi(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { consultedWith: e.target.value })); }); } },
                                                react_1.default.createElement("option", { value: "" }, "Select..."),
                                                consultoptions.map(function (opt) { return (react_1.default.createElement("option", { key: opt.value, value: opt.value }, opt.label)); })),
                                            react_1.default.createElement(lucide_react_1.ChevronDown, { size: 18, className: "absolute right-4 top-1/2 -translate-y-1/2 text-[#8E9BBA] pointer-events-none" }))),
                                    react_1.default.createElement("div", { className: "flex flex-col gap-2 flex-1" },
                                        react_1.default.createElement("label", { className: "text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase" },
                                            "Proof of discussion ",
                                            react_1.default.createElement("span", { className: "text-[#FF3B5C]" }, "*")),
                                        coi.attachment.length === 0 ? (react_1.default.createElement("button", { type: "button", className: "flex items-center gap-4 border-[1.5px] border-dashed border-[#8E9BBA]/40 rounded-[16px] p-3 bg-[#F5F7FA] hover:bg-white hover:border-[#3F62ED]/50 transition-colors cursor-pointer w-full text-left", onClick: function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); } },
                                            react_1.default.createElement("div", { className: "w-10 h-10 bg-white border border-[#E4E8F1] rounded-full flex items-center justify-center text-[#3F62ED] shadow-sm flex-shrink-0" },
                                                react_1.default.createElement(lucide_react_1.Upload, { size: 18 })),
                                            react_1.default.createElement("div", { className: "flex flex-col" },
                                                react_1.default.createElement("span", { className: "text-[13px] font-bold text-[#1B264E]" }, "Click to upload"),
                                                react_1.default.createElement("span", { className: "text-[11px] font-semibold text-[#8E9BBA]" }, "PDF, DOC, DOCX, PNG, JPG")))) : (react_1.default.createElement("div", { className: "flex items-center justify-between p-3 pl-4 bg-white border-[1.5px] border-[#E4E8F1] rounded-[16px] shadow-sm" },
                                            react_1.default.createElement("div", { className: "flex items-center gap-3" },
                                                react_1.default.createElement("div", { className: "w-10 h-10 bg-[#F0F4FF] rounded-full flex items-center justify-center text-[#3F62ED]" },
                                                    react_1.default.createElement(lucide_react_1.FileText, { size: 18 })),
                                                react_1.default.createElement("div", { className: "flex flex-col w-[160px] lg:w-[220px]" },
                                                    react_1.default.createElement("span", { className: "text-[13px] font-bold text-[#1B264E] truncate" }, coi.attachment[0].name),
                                                    react_1.default.createElement("span", { className: "text-[11px] font-bold text-[#0CAF60] flex items-center gap-1 uppercase tracking-widest mt-0.5" },
                                                        react_1.default.createElement(lucide_react_1.CheckCircle, { size: 12 }),
                                                        " Ready to submit"))),
                                            react_1.default.createElement("button", { type: "button", className: "w-8 h-8 flex items-center justify-center text-[#8E9BBA] hover:text-[#FF3B5C] hover:bg-[#fff0f2] rounded-full transition-colors", onClick: handleClearFile, "aria-label": "Remove file" },
                                                react_1.default.createElement(lucide_react_1.Trash2, { size: 16 })))),
                                        react_1.default.createElement("input", { ref: fileInputRef, type: "file", accept: ".pdf,.doc,.docx,.png,.jpg", className: "hidden", onChange: handleFileChange }))),
                                react_1.default.createElement("div", { className: "flex flex-col gap-2 w-full max-w-full" },
                                    react_1.default.createElement("label", { className: "text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase" },
                                        "Reason / Comments ",
                                        react_1.default.createElement("span", { className: "text-[#FF3B5C]" }, "*")),
                                    react_1.default.createElement("div", { className: "relative w-full" },
                                        react_1.default.createElement("textarea", { className: "w-full box-border bg-[#F5F7FA] border border-[#E4E8F1] rounded-[20px] px-5 py-4 text-[14px] font-medium text-[#1B264E] focus:outline-none focus:ring-2 focus:ring-[#3F62ED] focus:bg-white resize-none min-h-[120px] transition-all", maxLength: 256, placeholder: "Enter your comments (max 256 characters)...", value: coi.comments, onChange: function (e) { return setCoi(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { comments: e.target.value })); }); } }),
                                        react_1.default.createElement("span", { className: "absolute bottom-4 right-5 text-[11px] font-bold text-[#8E9BBA]" },
                                            coi.comments.length,
                                            "/256")))))),
                        showDisability && (react_1.default.createElement(framer_motion_1.motion.section, { className: "mb-12", custom: 2, variants: sectionVariants, initial: "hidden", animate: "visible" },
                            react_1.default.createElement(SectionHeader, { title: "Disability", accent: "blue" }),
                            react_1.default.createElement("div", { className: "bg-white border border-[#E4E8F1] rounded-[24px] p-6 shadow-sm flex flex-col gap-4 w-full min-w-0" },
                                react_1.default.createElement("div", { className: "flex flex-col gap-1.5" },
                                    react_1.default.createElement("span", { className: "text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase" }, "Disability status"),
                                    react_1.default.createElement("span", { className: "text-[15px] font-bold text-[#1B264E]" }, (_m = data === null || data === void 0 ? void 0 : data.disability) !== null && _m !== void 0 ? _m : "--")),
                                (data === null || data === void 0 ? void 0 : data.disability) && (react_1.default.createElement("div", { className: "flex flex-col gap-1.5 pt-4 border-t border-[#E4E8F1] min-w-0 w-full" },
                                    react_1.default.createElement("span", { className: "text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase" }, "Comments"),
                                    react_1.default.createElement("span", { className: "text-[15px] font-medium text-[#1B264E] break-all" }, data.disabilityReason)))))),
                        ReviewHRFlag && (react_1.default.createElement(framer_motion_1.motion.section, { className: "mb-12", custom: 4, variants: sectionVariants, initial: "hidden", animate: "visible" },
                            react_1.default.createElement(SectionHeader, { title: "HR Review Feedback", accent: "green" }),
                            react_1.default.createElement("div", { className: "w-full md:w-1/2 min-w-0" },
                                react_1.default.createElement("label", { className: "block text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase mb-2" },
                                    "Review Profile Feedback - HR ",
                                    react_1.default.createElement("span", { className: "text-[#FF3B5C]" }, "*")),
                                react_1.default.createElement("div", { className: "relative dropdown block" },
                                    react_1.default.createElement("div", { className: "w-full flex items-center justify-between bg-[#F5F7FA] border ".concat(open ? 'border-[#3F62ED] ring-2 ring-[#3F62ED]/10' : 'border-[#E4E8F1]', " rounded-[16px] px-5 py-3.5 text-[14px] font-semibold cursor-pointer transition-all shadow-sm"), onClick: function () { return setOpen(!open); } },
                                        react_1.default.createElement("span", { className: HRReview ? "text-[#1B264E]" : "text-[#8E9BBA]" }, HRReview || "Select feedback"),
                                        react_1.default.createElement(lucide_react_1.ChevronDown, { size: 18, className: "text-[#8E9BBA] transition-transform ".concat(open ? "rotate-180" : "") })),
                                    react_1.default.createElement(framer_motion_1.AnimatePresence, null, open && (react_1.default.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "absolute z-20 w-full mt-2 bg-white border border-[#E4E8F1] rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden py-2" }, feedbackOptions.map(function (option, index) { return (react_1.default.createElement("div", { key: index, onClick: function () { setHRReview(option); setOpen(false); }, className: "px-5 py-3 text-[14px] font-semibold cursor-pointer transition-colors ".concat(HRReview === option ? "bg-[#F0F4FF] text-[#3F62ED]" : "text-[#1B264E] hover:bg-[#F5F7FA]") }, option)); })))))))),
                        PanelMember && (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(framer_motion_1.motion.section, { className: "mb-12", custom: 3, variants: sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement(SectionHeader, { title: "Interview schedule - Level 1", accent: "blue" }),
                                react_1.default.createElement(InterviewScheduleInput, { form: level1, onChange: setLevel1, panelOptions: ((_o = paneloptions === null || paneloptions === void 0 ? void 0 : paneloptions.Level1) !== null && _o !== void 0 ? _o : []).map(function (item) { return ({ value: String(item.value), label: item.label }); }), onToggleMember: function (val) { return handlePanelToggle(setLevel1, val); }, minPanelCount: 3 })),
                            react_1.default.createElement(framer_motion_1.motion.section, { className: "mb-12", custom: 4, variants: sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement(SectionHeader, { title: "Interview schedule - Level 2", accent: "green" }),
                                react_1.default.createElement(InterviewScheduleInput, { form: level2, onChange: setLevel2, panelOptions: ((_p = paneloptions === null || paneloptions === void 0 ? void 0 : paneloptions.Level2) !== null && _p !== void 0 ? _p : []).map(function (item) { return ({ value: String(item.value), label: item.label }); }), onToggleMember: function (val) { return handlePanelToggle(setLevel2, val); }, minPanelCount: 3 })))),
                        react_1.default.createElement(framer_motion_1.motion.section, { className: "mb-8", custom: 5, variants: sectionVariants, initial: "hidden", animate: "visible" },
                            react_1.default.createElement("div", { className: "bg-white border border-[#E4E8F1] rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col w-full min-w-0" },
                                react_1.default.createElement("div", { className: "flex items-start gap-4 mb-8" },
                                    react_1.default.createElement("div", { className: "text-[#EA7A08] mt-5" },
                                        react_1.default.createElement(lucide_react_1.Zap, { size: 28, fill: "currentColor" })),
                                    react_1.default.createElement("div", { className: "flex flex-col gap-1.5" },
                                        react_1.default.createElement("h3", { className: "text-[22px] font-extrabold text-[#1B264E] leading-tight tracking-tight" }, "Do you wish to select this candidate?"),
                                        react_1.default.createElement("p", { className: "text-[14px] font-medium text-[#8E9BBA]" }, "As LM, please review the evaluation above and provide your final decision."))),
                                react_1.default.createElement("div", { className: "flex flex-col sm:flex-row gap-4 mb-8 w-full" }, [
                                    { key: "YES", label: "YES, SELECT", icon: react_1.default.createElement(lucide_react_1.CheckCircle, { size: 36, strokeWidth: 2, className: decision === "YES" ? "text-white" : "text-[#0CAF60]" }), activeBg: "bg-[#0CAF60]", borderColor: "border-[#0CAF60]/40", hoverBg: "hover:bg-[#f2fbf4]", activeText: "text-white", inactiveText: "text-[#0CAF60]", activeShadow: "shadow-[0_8px_20px_rgba(12,175,96,0.3)]" },
                                    { key: "NO", label: "NO, REJECT", icon: react_1.default.createElement(lucide_react_1.XCircle, { size: 36, strokeWidth: 2, className: decision === "NO" ? "text-white" : "text-[#FF3B5C]" }), activeBg: "bg-[#FD3C54]", borderColor: "border-[#FF3B5C]/40", hoverBg: "hover:bg-[#fff0f2]", activeText: "text-white", inactiveText: "text-[#FF3B5C]", activeShadow: "shadow-[0_8px_20px_rgba(253,60,84,0.3)]" },
                                    { key: "HOLD", label: "ON HOLD", icon: react_1.default.createElement(lucide_react_1.Activity, { size: 36, strokeWidth: 2, className: decision === "HOLD" ? "text-white" : "text-[#EA7A08]" }), activeBg: "bg-[#EA7A08]", borderColor: "border-[#EA7A08]/40", hoverBg: "hover:bg-[#fffaf0]", activeText: "text-white", inactiveText: "text-[#EA7A08]", activeShadow: "shadow-[0_8px_20px_rgba(234,122,8,0.4)]" },
                                ].map(function (opt) { return (react_1.default.createElement("button", { key: opt.key, type: "button", className: "flex flex-col flex-1 min-w-0 items-center justify-center gap-3 py-7 px-4 rounded-[24px] border-[1.5px] transition-all duration-300 outline-none ".concat(decision === opt.key
                                        ? "".concat(opt.activeBg, " border-transparent ").concat(opt.activeShadow, " scale-[1.02]")
                                        : "bg-white ".concat(opt.borderColor, " ").concat(opt.hoverBg)), onClick: function () { return setDecision(opt.key); } },
                                    opt.icon,
                                    react_1.default.createElement("span", { className: "font-bold tracking-widest text-[12px] uppercase ".concat(decision === opt.key ? opt.activeText : opt.inactiveText) }, opt.label))); })),
                                react_1.default.createElement("div", { className: "flex flex-col gap-3 w-full" },
                                    react_1.default.createElement("label", { className: "text-[11px] font-extrabold text-[#FF3B5C] tracking-widest uppercase" },
                                        react_1.default.createElement("span", { className: "text-[#8E9BBA]" }, "LM decision justification / comments"),
                                        " *"),
                                    react_1.default.createElement("textarea", { className: "w-full box-border bg-[#FCFDFE] border-[1.5px] border-[#E4E8F1]/80 rounded-[20px] px-6 py-5 text-[14px] font-medium text-[#1B264E] focus:outline-none focus:ring-2 focus:ring-[#3F62ED]/50 resize-none min-h-[140px] placeholder:text-[#8E9BBA] transition-colors shadow-sm", placeholder: "Provide your final decision rationale...", value: decisionComments, onChange: function (e) { return setDecisionComments(e.target.value); } })),
                                submitError && react_1.default.createElement("p", { className: "mt-5 text-[13px] font-bold text-[#FF3B5C] text-center" }, submitError),
                                submitSuccess && react_1.default.createElement("p", { className: "mt-5 text-[13px] font-bold text-[#0CAF60] text-center" }, "Submitted successfully!"))))),
                react_1.default.createElement("footer", { className: "flex items-center justify-end gap-4 px-8 py-5 border-t border-[#E4E8F1] bg-white z-20 flex-shrink-0" },
                    react_1.default.createElement("button", { type: "button", className: "px-8 py-3 text-[13px] font-extrabold text-[#1B264E] tracking-widest uppercase bg-white border-[1.5px] border-transparent hover:border-[#3F62ED]/40 hover:bg-[#F0F4FF] hover:text-[#3F62ED] rounded-[16px] transition-all", onClick: onClose }, "Cancel"),
                    react_1.default.createElement("button", { type: "button", className: "flex items-center gap-2 px-8 py-3 text-[13px] font-extrabold tracking-widest uppercase rounded-[16px] border-[1.5px] transition-all ".concat(canSubmit && !submitting
                            ? "bg-[#3F62ED] border-[#3F62ED] hover:bg-white hover:text-[#3F62ED] text-white shadow-[0_8px_16px_rgba(63,98,237,0.2)] hover:shadow-none"
                            : "bg-[#F5F7FA] text-[#8E9BBA] cursor-not-allowed border border-[#E4E8F1]"), disabled: !canSubmit || submitting, onClick: handleSubmit }, submitting ? ("Submitting...") : (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(lucide_react_1.CheckCircle, { size: 16 }),
                        "Submit action")))),
                loading && (react_1.default.createElement("div", { className: "absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 rounded-[24px]", style: { zIndex: 2147483647 } },
                    react_1.default.createElement("div", { className: "w-10 h-10 border-4 border-[#E4E8F1] border-t-[#3F62ED] rounded-full animate-spin" }),
                    react_1.default.createElement("div", { className: "text-[14px] font-bold text-[#1B264E] tracking-widest uppercase" }, "Loading details...")))))));
};
exports.ShowCandidateDetailsPopup = ShowCandidateDetailsPopup;
var InterviewScheduleInput = function (_a) {
    var form = _a.form, onChange = _a.onChange, panelOptions = _a.panelOptions, onToggleMember = _a.onToggleMember, _b = _a.minPanelCount, minPanelCount = _b === void 0 ? 3 : _b;
    var needsMore = form.panelMembers.length < minPanelCount;
    return (react_1.default.createElement("div", { className: "flex flex-col gap-6 w-full min-w-0" },
        react_1.default.createElement("div", { className: "flex flex-col gap-3" },
            react_1.default.createElement("label", { className: "text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase" },
                "Interview panel members ",
                react_1.default.createElement("span", { className: "text-[#FF3B5C]" }, "*")),
            react_1.default.createElement("div", { className: "flex flex-wrap gap-2.5" }, panelOptions.map(function (opt) {
                var selected = form.panelMembers.includes(opt.value);
                return (react_1.default.createElement("button", { key: opt.value, type: "button", className: "flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all border-[1.5px] ".concat(selected
                        ? "bg-[#F0F4FF] border-[#3F62ED]/30 text-[#3F62ED] shadow-sm"
                        : "bg-white border-[#E4E8F1] text-[#1B264E] hover:border-[#8E9BBA]/40 hover:bg-[#F5F7FA]"), onClick: function () { return onToggleMember(opt.value); } },
                    selected && react_1.default.createElement(lucide_react_1.CheckCircle, { size: 16, className: "text-[#3F62ED]" }),
                    opt.label));
            })),
            needsMore && (react_1.default.createElement("span", { className: "text-[11px] font-bold text-[#FF9B00] tracking-wider mt-1" },
                "Please select at least ",
                minPanelCount,
                " panel members \u2022 ",
                form.panelMembers.length,
                " selected"))),
        react_1.default.createElement("div", { className: "flex flex-col sm:flex-row gap-5 w-full" },
            react_1.default.createElement("div", { className: "flex flex-col gap-2 flex-1 min-w-0" },
                react_1.default.createElement("label", { className: "text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase" },
                    "Start date & time ",
                    react_1.default.createElement("span", { className: "text-[#FF3B5C]" }, "*")),
                react_1.default.createElement("input", { type: "datetime-local", className: "w-full box-border bg-[#F5F7FA] border border-[#E4E8F1] rounded-[16px] px-5 py-3.5 text-[14px] font-semibold text-[#1B264E] focus:outline-none focus:ring-2 focus:ring-[#3F62ED] focus:bg-white transition-colors shadow-sm", value: form.startDate, onChange: function (e) { return onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { startDate: e.target.value })); }); } })),
            react_1.default.createElement("div", { className: "flex flex-col gap-2 flex-1 min-w-0" },
                react_1.default.createElement("label", { className: "text-[12px] font-bold text-[#8E9BBA] tracking-widest uppercase" },
                    "End date & time ",
                    react_1.default.createElement("span", { className: "text-[#FF3B5C]" }, "*")),
                react_1.default.createElement("input", { type: "datetime-local", className: "w-full box-border bg-[#F5F7FA] border border-[#E4E8F1] rounded-[16px] px-5 py-3.5 text-[14px] font-semibold text-[#1B264E] focus:outline-none focus:ring-2 focus:ring-[#3F62ED] focus:bg-white transition-colors shadow-sm", value: form.endDate, min: form.startDate, onChange: function (e) { return onChange(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { endDate: e.target.value })); }); } })))));
};
//# sourceMappingURL=ShowCandidateDetailsPopup.js.map