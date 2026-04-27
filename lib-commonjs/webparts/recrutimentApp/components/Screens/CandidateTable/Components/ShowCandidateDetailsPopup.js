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
var ShowCandidateDetailsPopup_module_scss_1 = tslib_1.__importDefault(require("./ShowCandidateDetailsPopup.module.scss"));
var ModalPopup_1 = require("../../../Comman/ModalPopup/ModalPopup");
var reuseUI_1 = require("./reuseUI");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var loading_1 = tslib_1.__importDefault(require("../../../Comman/Loading/loading"));
var InterviewScheduleInput_1 = require("./InterviewSchedule/InterviewScheduleInput");
// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
var FEEDBACK_OPTIONS = [
    "Excellent",
    "Good",
    "Average",
    "Below Average",
    "Poor",
];
var EMPTY_COI = {
    consultedWith: "",
    attachment: [],
    comments: "",
};
var EMPTY_SCHEDULE = {
    panelMembers: [],
    startDate: "",
    startTime: "",
    endTime: "",
};
var FilePreviewModal = function (_a) {
    var file = _a.file, onClose = _a.onClose;
    var resolved = (0, react_1.useMemo)(function () { return (file ? (0, reuseUI_1.getViewerUrl)(file.url) : null); }, [file]);
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, file && resolved && (react_1.default.createElement(framer_motion_1.motion.div, { className: ShowCandidateDetailsPopup_module_scss_1.default.previewBackdrop, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose },
        react_1.default.createElement(framer_motion_1.motion.div, { className: ShowCandidateDetailsPopup_module_scss_1.default.previewModal, initial: { scale: 0.92, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.92, opacity: 0 }, transition: { type: "spring", stiffness: 300, damping: 30 }, onClick: function (e) { return e.stopPropagation(); } },
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.previewHeader },
                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.previewHeaderLeft },
                    react_1.default.createElement(lucide_react_1.FileText, { size: 18 }),
                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.previewFileName }, file.name)),
                react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.previewClose, onClick: onClose, "aria-label": "Close preview" },
                    react_1.default.createElement(lucide_react_1.X, { size: 18 }))),
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.previewBody }, resolved.type === "blob" || resolved.type === "direct" ? (
            // Native PDF / image rendering via <object> gives better UX than iframe
            react_1.default.createElement("object", { data: resolved.url, type: "application/pdf", className: ShowCandidateDetailsPopup_module_scss_1.default.previewIframe, "aria-label": file.name },
                react_1.default.createElement("iframe", { src: resolved.url, title: file.name, className: ShowCandidateDetailsPopup_module_scss_1.default.previewIframe }))) : (react_1.default.createElement("iframe", { src: resolved.url, title: file.name, className: ShowCandidateDetailsPopup_module_scss_1.default.previewIframe, allow: "fullscreen", sandbox: "allow-scripts allow-same-origin allow-forms allow-popups" }))))))));
};
// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
var ShowCandidateDetailsPopup = function (_a) {
    // ── Derived flags ──────────────────────────────────────────────────────────
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var isOpen = _a.isOpen, onClose = _a.onClose, candidateId = _a.candidateId, panelParams = _a.panelParams, positionDetails = _a.positionDetails, handleRefresh = _a.handleRefresh;
    var statusId = (_b = panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) !== null && _b !== void 0 ? _b : "";
    var ReviewHRFlag = statusId === Config_1.workflowStatusApi.HRPending;
    var ReviewLML1 = statusId === Config_1.workflowStatusApi.LineManagerL1Pending ||
        statusId === Config_1.workflowStatusApi.LineManagerLevel1OnHold;
    var ReviewLML2 = statusId === Config_1.workflowStatusApi.LineManagerL2Pending ||
        statusId === Config_1.workflowStatusApi.LineManagerLevel2OnHold;
    var PanelMember = statusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
        Number(statusId) ===
            Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
    var isLevel2Panel = Number(statusId) ===
        Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
    var panelOptionFlag = statusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
        isLevel2Panel ||
        statusId === Config_1.workflowStatusApi.HRPending;
    var isEnabled = !!panelOptionFlag;
    var isReadOnly = !ReviewHRFlag;
    var rejectedFlag = statusId === Config_1.workflowStatusApi.HRRejected ||
        statusId === Config_1.workflowStatusApi.LineManagerLevel1Rejected ||
        statusId === Config_1.workflowStatusApi.LineManagerLevel2Rejected;
    // ── Data hooks ─────────────────────────────────────────────────────────────
    var paneloptions = (0, fetchPanelMembers_1.useFetchPanelMembers)((_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCodeId) !== null && _c !== void 0 ? _c : 0, (_d = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.AssignEMail) !== null && _d !== void 0 ? _d : "", (_e = panelParams === null || panelParams === void 0 ? void 0 : panelParams.candidateId) !== null && _e !== void 0 ? _e : 0, statusId, isEnabled).data;
    var _s = (0, fetchCandidateDetails_1.useFetchCandidateDetails)(candidateId, statusId), data = _s.data, loading = _s.loading;
    var _t = (0, Usesubmitcandidatereview_1.useSubmitCandidateReview)(onClose, handleRefresh), submitting = _t.submitting, submit = _t.submit, pageLoading = _t.pageLoading, submitModalState = _t.modalState, submitCloseModal = _t.closeModal;
    var _u = (0, useModalPopup_1.useModalPopup)(), modalState = _u.modalState, showModal = _u.showModal, closeModal = _u.closeModal;
    // ── Local state ────────────────────────────────────────────────────────────
    var fileInputRef = (0, react_1.useRef)(null);
    var _v = (0, react_1.useState)(null), decision = _v[0], setDecision = _v[1];
    var _w = (0, react_1.useState)(""), decisionComments = _w[0], setDecisionComments = _w[1];
    var _x = (0, react_1.useState)([]), consultoptions = _x[0], setConsultOptions = _x[1];
    var _y = (0, react_1.useState)(null), previewFile = _y[0], setPreviewFile = _y[1];
    var _z = (0, react_1.useState)(""), HRReview = _z[0], setHRReview = _z[1];
    var _0 = (0, react_1.useState)(false), dropdownOpen = _0[0], setDropdownOpen = _0[1];
    var _1 = (0, react_1.useState)(EMPTY_COI), coi = _1[0], setCoi = _1[1];
    var _2 = (0, react_1.useState)(EMPTY_SCHEDULE), level1 = _2[0], setLevel1 = _2[1];
    var _3 = (0, react_1.useState)(EMPTY_SCHEDULE), level2 = _3[0], setLevel2 = _3[1];
    // ── Memoised panel values ──────────────────────────────────────────────────
    var panelValue = (0, react_1.useMemo)(function () {
        if (!paneloptions)
            return null;
        var _a = paneloptions.Level1, Level1 = _a === void 0 ? [] : _a, _b = paneloptions.Level2, Level2 = _b === void 0 ? [] : _b;
        var level1Members = [];
        var consultOption = [];
        Level1.forEach(function (item) {
            if (item.Role !== ConditionConfig_1.RoleName.InterviewPanel)
                level1Members.push(String(item.value));
            if (item.Role === ConditionConfig_1.RoleName.LineManager ||
                item.Role === ConditionConfig_1.RoleName.HOD ||
                item.Role === ConditionConfig_1.RoleName.RecruitmentHR)
                consultOption.push({ value: String(item.label), label: item.label });
        });
        var level2Members = Level2.filter(function (item) { return item.Role !== ConditionConfig_1.RoleName.InterviewPanel; }).map(function (item) { return String(item.value); });
        return { level1Members: level1Members, level2Members: level2Members, consultOption: consultOption };
    }, [paneloptions]);
    // ── Effects ────────────────────────────────────────────────────────────────
    // Reset all state when popup closes
    (0, react_1.useEffect)(function () {
        if (!isOpen) {
            setDecision(null);
            setDecisionComments("");
            setHRReview("");
            setCoi(EMPTY_COI);
            setLevel1(EMPTY_SCHEDULE);
            setLevel2(EMPTY_SCHEDULE);
            setPreviewFile(null);
            setDropdownOpen(false);
        }
    }, [isOpen]);
    // Load panel members + COI data when popup opens
    (0, react_1.useEffect)(function () {
        if (!isOpen)
            return;
        if (panelValue && (PanelMember || ReviewHRFlag)) {
            setConsultOptions(panelValue.consultOption);
            var start = (data === null || data === void 0 ? void 0 : data.InterviewStartDate)
                ? new Date(data.InterviewStartDate)
                : null;
            var end = (data === null || data === void 0 ? void 0 : data.InterviewEndDate)
                ? new Date(data.InterviewEndDate)
                : null;
            setLevel1({
                panelMembers: panelValue.level1Members,
                startDate: start ? start.toISOString().split("T")[0] : "",
                startTime: start ? start.toTimeString().slice(0, 5) : "",
                endTime: end ? end.toTimeString().slice(0, 5) : "",
            });
            setLevel2({
                panelMembers: panelValue.level2Members,
                startDate: "",
                startTime: "",
                endTime: "",
            });
        }
        if (!data)
            return;
        var loadCOI = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var COIAttachRes;
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, ServiceExport_1.CandidateTable.fetchCOIAttachment({
                            RequestID: String(data.profileID),
                            DocumentName: ConditionConfig_1.DocumentFolderName.COIAttach,
                        })];
                    case 1:
                        COIAttachRes = _d.sent();
                        setConsultOptions([
                            { value: String(data.COIAppreve), label: data.COIAppreve },
                        ]);
                        if (statusId !== Config_1.workflowStatusApi.HRPending) {
                            setCoi({
                                consultedWith: (_a = data.COIAppreve) !== null && _a !== void 0 ? _a : "",
                                attachment: COIAttachRes.data,
                                comments: (_b = data.COIComments) !== null && _b !== void 0 ? _b : "",
                            });
                        }
                        setHRReview((_c = data.hrComments) !== null && _c !== void 0 ? _c : "");
                        return [2 /*return*/];
                }
            });
        }); };
        void loadCOI();
    }, [isOpen, panelValue, data]);
    // ── Derived visibility ─────────────────────────────────────────────────────
    var showCOI = (data === null || data === void 0 ? void 0 : data.ConflictsOfInterest) === "Yes";
    var showDisability = (data === null || data === void 0 ? void 0 : data.disability) === "Yes";
    // ── Validation ─────────────────────────────────────────────────────────────
    var canSubmit = (0, react_1.useMemo)(function () {
        var _a, _b;
        if (!(decisionComments === null || decisionComments === void 0 ? void 0 : decisionComments.trim()))
            return false;
        if (ReviewHRFlag) {
            if (!(HRReview === null || HRReview === void 0 ? void 0 : HRReview.trim()))
                return false;
            if (showCOI) {
                if (!((_a = coi.consultedWith) === null || _a === void 0 ? void 0 : _a.trim()) ||
                    !((_b = coi.comments) === null || _b === void 0 ? void 0 : _b.trim()) ||
                    coi.attachment.length === 0)
                    return false;
            }
        }
        if ((ReviewLML1 || ReviewLML2) && !decision)
            return false;
        if (PanelMember) {
            if (statusId === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview &&
                (level1.panelMembers.length < 3 ||
                    !level1.startDate ||
                    !level1.startTime ||
                    !level1.endTime))
                return false;
            if (isLevel2Panel &&
                (level2.panelMembers.length < 3 ||
                    !level2.startDate ||
                    !level2.startTime ||
                    !level2.endTime))
                return false;
        }
        return true;
    }, [
        ReviewHRFlag,
        ReviewLML1,
        ReviewLML2,
        PanelMember,
        isLevel2Panel,
        decision,
        decisionComments,
        HRReview,
        showCOI,
        coi,
        level1,
        level2,
        statusId,
    ]);
    // ── Handlers ───────────────────────────────────────────────────────────────
    var handlePreview = (0, react_1.useCallback)(function (file) {
        setPreviewFile({ url: file.content, name: file.name });
    }, []);
    var handleFileChange = (0, react_1.useCallback)(function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function () {
            var newFile = {
                name: file.name,
                content: reader.result,
                type: "New",
            };
            setCoi(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { attachment: [newFile] })); });
        };
        reader.readAsDataURL(file);
    }, []);
    var handleClearFile = (0, react_1.useCallback)(function () {
        setCoi(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { attachment: [] })); });
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    }, []);
    var handlePanelToggle = function (setter, val) {
        setter(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { panelMembers: p.panelMembers.includes(val)
                ? p.panelMembers.filter(function (v) { return v !== val; })
                : tslib_1.__spreadArray(tslib_1.__spreadArray([], p.panelMembers, true), [val], false) })); });
    };
    var handleSubmit = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var toPanel;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!canSubmit) {
                        showModal({
                            type: "warning",
                            title: "Required Fields Missing",
                            message: "One or more fields are required. Please complete all highlighted fields before submitting.",
                            confirmLabel: "OK",
                            onConfirm: closeModal,
                        });
                        return [2 /*return*/];
                    }
                    toPanel = function (members) {
                        return members.map(function (item) { return ({ key: Number(item), text: item }); });
                    };
                    return [4 /*yield*/, submit({
                            candidateId: candidateId,
                            CandidateDetails: data,
                            decision: decision !== null && decision !== void 0 ? decision : "YES",
                            decisionComments: decisionComments,
                            interviewLevel1: level1,
                            interviewLevel2: level2,
                            recrutimentData: positionDetails,
                            interviewPanelL1: toPanel(level1.panelMembers),
                            interviewPanelL2: toPanel(level2.panelMembers),
                            HRReviewComents: HRReview,
                            COIFlag: showCOI,
                            COIDetails: coi,
                            StatusId: statusId,
                        }, decision !== null && decision !== void 0 ? decision : "YES")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [
        canSubmit,
        candidateId,
        data,
        decision,
        decisionComments,
        coi,
        level1,
        level2,
        HRReview,
        showCOI,
        statusId,
        positionDetails,
        submit,
        showModal,
        closeModal,
    ]);
    // ── Early exit ─────────────────────────────────────────────────────────────
    if (!isOpen)
        return null;
    // ── Render ─────────────────────────────────────────────────────────────────
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(framer_motion_1.AnimatePresence, null,
            react_1.default.createElement(framer_motion_1.motion.div, { className: ShowCandidateDetailsPopup_module_scss_1.default.backdrop, variants: reuseUI_1.backdropVariants, initial: "hidden", animate: "visible", exit: "exit", onClick: onClose },
                react_1.default.createElement(framer_motion_1.motion.div, { className: ShowCandidateDetailsPopup_module_scss_1.default.modalCard, variants: reuseUI_1.cardVariants, onClick: function (e) { return e.stopPropagation(); } },
                    react_1.default.createElement("header", { className: ShowCandidateDetailsPopup_module_scss_1.default.header },
                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.headerLeft },
                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.headerIcon },
                                react_1.default.createElement(lucide_react_1.User, { size: 24 })),
                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.headerMeta },
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.breadcrumb },
                                    react_1.default.createElement("span", null, "Candidate selection"),
                                    react_1.default.createElement(lucide_react_1.ChevronRight, { size: 12, className: ShowCandidateDetailsPopup_module_scss_1.default.breadcrumbChevron }),
                                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.breadcrumbActive }, "Review Profile")),
                                react_1.default.createElement("h2", { className: ShowCandidateDetailsPopup_module_scss_1.default.headerTitle }, "Candidate Profile Review"),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.headerSubtitle },
                                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.jobCodeBadge }, (data === null || data === void 0 ? void 0 : data.JobCode) || "---"),
                                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.headerDot }),
                                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.headerJobTitle }, (data === null || data === void 0 ? void 0 : data.JobTitle) || "---")))),
                        react_1.default.createElement("button", { className: ShowCandidateDetailsPopup_module_scss_1.default.closeBtn, type: "button", onClick: onClose, "aria-label": "Close" },
                            react_1.default.createElement(lucide_react_1.X, { size: 20, strokeWidth: 2.5 }))),
                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.body },
                        react_1.default.createElement("aside", { className: ShowCandidateDetailsPopup_module_scss_1.default.sidebar },
                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.avatarSection },
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.avatar }, ((_f = data === null || data === void 0 ? void 0 : data.ApplicantName) !== null && _f !== void 0 ? _f : "A").charAt(0)),
                                react_1.default.createElement("h3", { className: ShowCandidateDetailsPopup_module_scss_1.default.avatarName }, (_g = data === null || data === void 0 ? void 0 : data.ApplicantName) !== null && _g !== void 0 ? _g : "--"),
                                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.avatarNationality }, (_h = data === null || data === void 0 ? void 0 : data.NationalityShort) !== null && _h !== void 0 ? _h : "--")),
                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoGrid },
                                react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Globe, { size: 14 }), label: "Nationality", value: data === null || data === void 0 ? void 0 : data.Nationality }),
                                react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Users, { size: 14 }), label: "Gender", value: data === null || data === void 0 ? void 0 : data.Gender }),
                                react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.FileText, { size: 14 }), label: "Qualification", value: data === null || data === void 0 ? void 0 : data.HighestQualification }),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRow },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                        react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Zap, { size: 14 }), label: "Mining exp.", value: data === null || data === void 0 ? void 0 : data.ExperienceMining })),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                        react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Zap, { size: 14 }), label: "Related exp.", value: String((_j = data === null || data === void 0 ? void 0 : data.ExperRelatedfield) !== null && _j !== void 0 ? _j : "") }))),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRow },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                        react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 14 }), label: "Conflicts", value: (_k = data === null || data === void 0 ? void 0 : data.ConflictsOfInterest) !== null && _k !== void 0 ? _k : "No" })),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                        react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Accessibility, { size: 14 }), label: "Disability", value: (_l = data === null || data === void 0 ? void 0 : data.disability) !== null && _l !== void 0 ? _l : "No" }))),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRow },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                        react_1.default.createElement(reuseUI_1.InfoItem, { label: "Tax dependents", value: String((_m = data === null || data === void 0 ? void 0 : data.NumberOftax) !== null && _m !== void 0 ? _m : "") })),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                        react_1.default.createElement(reuseUI_1.InfoItem, { label: "Current position", value: data === null || data === void 0 ? void 0 : data.CurrentPosition }))),
                                (data === null || data === void 0 ? void 0 : data.hasIvanhoeZijinExperience) && (react_1.default.createElement(reuseUI_1.InfoItem, { label: "Group / partner companies", value: data.hasIvanhoeZijinExperience }))),
                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.attachmentsSection },
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.attachmentsLabel },
                                    react_1.default.createElement(lucide_react_1.FileText, { size: 14, className: ShowCandidateDetailsPopup_module_scss_1.default.attachmentsLabelIcon }),
                                    " ",
                                    "Attachments"),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.attachmentsBox },
                                    react_1.default.createElement(RequiredAttachments_1.RequiredAttachments, { attachments: (_o = data === null || data === void 0 ? void 0 : data.OverallAtttachment) !== null && _o !== void 0 ? _o : [], isLoading: loading })))),
                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.mainContent },
                            !PanelMember && (react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 0, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Screening Questions", subtitle: "Candidate responses", accent: "orange" }),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionsCard },
                                    react_1.default.createElement(reuseUI_1.QuestionCard, { index: 1, question: "Willing to relocate if not currently living close to the relevant project site/office?", answer: data === null || data === void 0 ? void 0 : data.WillingToRelocate }),
                                    (data === null || data === void 0 ? void 0 : data.previouslyworkedMine) && (react_1.default.createElement(reuseUI_1.QuestionCard, { index: 2, question: "Has the person previously worked within the Ivanhoe Mines Group?", answer: data.previouslyworkedMine })),
                                    react_1.default.createElement(reuseUI_1.QuestionCard, { index: 3, question: "Any family or other links with existing employees to declare? (If so, who? Attach detail)", answer: data === null || data === void 0 ? void 0 : data.familylinks }),
                                    react_1.default.createElement(reuseUI_1.QuestionCard, { index: 4, question: "Any business links to declare? (If so, who? Attach detail)", answer: data === null || data === void 0 ? void 0 : data.businesslinks })))),
                            showCOI && (react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 1, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Conflict of interest", accent: "red" }),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiCard },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiAlert },
                                        react_1.default.createElement(lucide_react_1.AlertTriangle, { className: ShowCandidateDetailsPopup_module_scss_1.default.coiAlertIcon, size: 20 }),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiAlertContent },
                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiAlertTitle }, "Conflict of Interest Declared"),
                                            (data === null || data === void 0 ? void 0 : data.COIReason) && (react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiAlertReason }, data.COIReason)))),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiFields },
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiField },
                                            react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                                                "Consulted with",
                                                " ",
                                                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
                                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.selectWrapper },
                                                react_1.default.createElement("select", { className: ShowCandidateDetailsPopup_module_scss_1.default.selectInput, value: coi.consultedWith, onChange: function (e) {
                                                        return setCoi(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { consultedWith: e.target.value })); });
                                                    }, disabled: isReadOnly },
                                                    react_1.default.createElement("option", { value: "" }, "Select..."),
                                                    consultoptions.map(function (opt) { return (react_1.default.createElement("option", { key: opt.value, value: opt.value }, opt.label)); })),
                                                react_1.default.createElement(lucide_react_1.ChevronDown, { size: 18, className: ShowCandidateDetailsPopup_module_scss_1.default.selectChevron }))),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiField },
                                            react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                                                "Proof of discussion",
                                                " ",
                                                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
                                            !isReadOnly ? (
                                            // ── Editable mode ──
                                            coi.attachment.length === 0 ? (react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.uploadBtn, onClick: function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); } },
                                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.uploadIconWrap },
                                                    react_1.default.createElement(lucide_react_1.Upload, { size: 18 })),
                                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.uploadText },
                                                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.uploadTitle }, "Click to upload"),
                                                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.uploadSub }, "PDF, DOC, DOCX, PNG, JPG")))) : (react_1.default.createElement(AttachmentRow, { file: coi.attachment[0], isReadOnly: false, onPreview: handlePreview, onClear: handleClearFile }))) : coi.attachment.length > 0 ? (
                                            // ── Read-only mode with file ──
                                            react_1.default.createElement(AttachmentRow, { file: coi.attachment[0], isReadOnly: true, onPreview: handlePreview })) : (react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel }, "No attachment")),
                                            react_1.default.createElement("input", { ref: fileInputRef, type: "file", accept: ".pdf,.doc,.docx,.png,.jpg", style: { display: "none" }, onChange: handleFileChange }))),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiTextareaWrap },
                                        react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                                            "Reason / Comments",
                                            " ",
                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiTextareaRelative },
                                            react_1.default.createElement("textarea", { className: ShowCandidateDetailsPopup_module_scss_1.default.coiTextarea, maxLength: 256, placeholder: "Enter your comments (max 256 characters)...", value: coi.comments, onChange: function (e) {
                                                    return setCoi(function (p) { return (tslib_1.__assign(tslib_1.__assign({}, p), { comments: e.target.value })); });
                                                }, readOnly: isReadOnly }),
                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.charCount },
                                                coi.comments.length,
                                                "/256")))))),
                            showDisability && (react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 2, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Disability", accent: "blue" }),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.disabilityCard },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.disabilityField },
                                        react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.disabilityFieldLabel }, "Disability status"),
                                        react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.disabilityFieldValue }, (_p = data === null || data === void 0 ? void 0 : data.disability) !== null && _p !== void 0 ? _p : "--")),
                                    (data === null || data === void 0 ? void 0 : data.disability) && (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.disabilityDivider },
                                        react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.disabilityFieldLabel }, "Comments"),
                                        react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.disabilityReason }, data.disabilityReason)))))),
                            react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 4, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.hrFeedbackCard },
                                    react_1.default.createElement(reuseUI_1.SectionHeader, { title: "HR Review Feedback", accent: "green" }),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.hrFeedbackFieldWrap },
                                        react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel },
                                            "Review Profile Feedback - HR",
                                            " ",
                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldRequired }, "*")),
                                        react_1.default.createElement("div", { className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.dropdownWrapper, " dropdown") },
                                            react_1.default.createElement("div", { className: [
                                                    ShowCandidateDetailsPopup_module_scss_1.default.customDropdownTrigger,
                                                    dropdownOpen ? ShowCandidateDetailsPopup_module_scss_1.default.dropdownOpen : "",
                                                    isReadOnly ? ShowCandidateDetailsPopup_module_scss_1.default.dropdownDisabled : "",
                                                ]
                                                    .filter(Boolean)
                                                    .join(" "), onClick: function () {
                                                    return !isReadOnly && setDropdownOpen(function (v) { return !v; });
                                                } },
                                                react_1.default.createElement("span", { className: HRReview
                                                        ? ShowCandidateDetailsPopup_module_scss_1.default.dropdownSelected
                                                        : ShowCandidateDetailsPopup_module_scss_1.default.dropdownPlaceholder }, HRReview || "Select feedback"),
                                                react_1.default.createElement(lucide_react_1.ChevronDown, { size: 18, className: [
                                                        ShowCandidateDetailsPopup_module_scss_1.default.dropdownChevron,
                                                        dropdownOpen ? ShowCandidateDetailsPopup_module_scss_1.default.open : "",
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ") })),
                                            react_1.default.createElement(framer_motion_1.AnimatePresence, null, dropdownOpen && (react_1.default.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: ShowCandidateDetailsPopup_module_scss_1.default.dropdownMenu }, FEEDBACK_OPTIONS.map(function (option) { return (react_1.default.createElement("div", { key: option, onClick: function () {
                                                    setHRReview(option);
                                                    setDropdownOpen(false);
                                                }, className: [
                                                    ShowCandidateDetailsPopup_module_scss_1.default.dropdownOption,
                                                    HRReview === option
                                                        ? ShowCandidateDetailsPopup_module_scss_1.default.dropdownOptionActive
                                                        : "",
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ") }, option)); })))))))),
                            PanelMember && (react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 3, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Interview schedule - Level 1", accent: "blue" }),
                                react_1.default.createElement(InterviewScheduleInput_1.InterviewScheduleInput, { form: level1, onChange: setLevel1, panelOptions: ((_q = paneloptions === null || paneloptions === void 0 ? void 0 : paneloptions.Level1) !== null && _q !== void 0 ? _q : []).map(function (item) { return ({
                                        value: String(item.value),
                                        label: item.label,
                                    }); }), onToggleMember: function (val) {
                                        return handlePanelToggle(setLevel1, val);
                                    }, minPanelCount: 3, Disable: isLevel2Panel }))),
                            isLevel2Panel && (react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 4, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Interview schedule - Level 2", accent: "green" }),
                                react_1.default.createElement(InterviewScheduleInput_1.InterviewScheduleInput, { form: level2, onChange: setLevel2, panelOptions: ((_r = paneloptions === null || paneloptions === void 0 ? void 0 : paneloptions.Level2) !== null && _r !== void 0 ? _r : []).map(function (item) { return ({
                                        value: String(item.value),
                                        label: item.label,
                                    }); }), onToggleMember: function (val) {
                                        return handlePanelToggle(setLevel2, val);
                                    }, minPanelCount: 3, Disable: false }))),
                            !ReviewHRFlag && !PanelMember && !rejectedFlag && (react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 5, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionCard },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionHeader },
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionZap },
                                            react_1.default.createElement(lucide_react_1.Zap, { size: 28, fill: "currentColor" })),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionTitleWrap },
                                            react_1.default.createElement("h3", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionTitle }, "Do you wish to select this candidate?"),
                                            react_1.default.createElement("p", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionSubtitle }, "Please review the candidate and provide your final decision."))),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnsRow }, [
                                        {
                                            value: "YES",
                                            label: "YES, SELECT",
                                            Icon: lucide_react_1.CheckCircle,
                                            activeStyle: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnYesActive,
                                            inactiveStyle: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnYesInactive,
                                            activeIcon: ShowCandidateDetailsPopup_module_scss_1.default.iconWhite,
                                            inactiveIcon: ShowCandidateDetailsPopup_module_scss_1.default.iconGreen,
                                        },
                                        {
                                            value: "NO",
                                            label: "NO, REJECT",
                                            Icon: lucide_react_1.XCircle,
                                            activeStyle: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnNoActive,
                                            inactiveStyle: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnNoInactive,
                                            activeIcon: ShowCandidateDetailsPopup_module_scss_1.default.iconWhite,
                                            inactiveIcon: ShowCandidateDetailsPopup_module_scss_1.default.iconRed,
                                        },
                                        {
                                            value: "HOLD",
                                            label: "ON HOLD",
                                            Icon: lucide_react_1.Activity,
                                            activeStyle: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnHoldActive,
                                            inactiveStyle: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnHoldInactive,
                                            activeIcon: ShowCandidateDetailsPopup_module_scss_1.default.iconWhite,
                                            inactiveIcon: ShowCandidateDetailsPopup_module_scss_1.default.iconAmber,
                                        },
                                    ].map(function (_a) {
                                        var value = _a.value, label = _a.label, Icon = _a.Icon, activeStyle = _a.activeStyle, inactiveStyle = _a.inactiveStyle, activeIcon = _a.activeIcon, inactiveIcon = _a.inactiveIcon;
                                        return (react_1.default.createElement("button", { key: value, type: "button", className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.decisionBtn, " ").concat(decision === value ? activeStyle : inactiveStyle), onClick: function () { return setDecision(value); } },
                                            react_1.default.createElement(Icon, { size: 36, strokeWidth: 2, className: decision === value ? activeIcon : inactiveIcon }),
                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnLabel }, label)));
                                    }))))),
                            !rejectedFlag && (react_1.default.createElement(framer_motion_1.motion.section, { custom: 6, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsCard },
                                    react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Comments", accent: "blue" }),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsFieldWrap },
                                        react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsLabel },
                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsLabelText }, "Decision justification / comments"),
                                            " ",
                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsRequired }, "*")),
                                        react_1.default.createElement("textarea", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsTextarea, placeholder: "Provide your final decision rationale...", value: decisionComments, onChange: function (e) { return setDecisionComments(e.target.value); }, disabled: submitting }))))))),
                    !rejectedFlag && (react_1.default.createElement("footer", { className: ShowCandidateDetailsPopup_module_scss_1.default.footer },
                        react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.cancelBtn, onClick: onClose }, "Cancel"),
                        react_1.default.createElement("button", { type: "button", className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.submitBtn, " ").concat(canSubmit && !submitting
                                ? ShowCandidateDetailsPopup_module_scss_1.default.submitBtnActive
                                : ShowCandidateDetailsPopup_module_scss_1.default.submitBtnDisabled), disabled: !canSubmit || submitting, onClick: handleSubmit }, submitting ? ("Submitting...") : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(lucide_react_1.CheckCircle, { size: 16 }),
                            PanelMember ? "Schedule Interview" : "Submit action"))))),
                    loading && (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.loadingOverlay },
                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.spinner }),
                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.loadingText }, "Loading details..."))),
                    pageLoading && react_1.default.createElement(loading_1.default, null),
                    react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal })),
                    react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, submitModalState, { onClose: submitCloseModal }))))),
        react_1.default.createElement(FilePreviewModal, { file: previewFile, onClose: function () { return setPreviewFile(null); } })));
};
exports.ShowCandidateDetailsPopup = ShowCandidateDetailsPopup;
var AttachmentRow = react_1.default.memo(function (_a) {
    var file = _a.file, isReadOnly = _a.isReadOnly, onPreview = _a.onPreview, onClear = _a.onClear;
    return (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.filePreview },
        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.filePreviewLeft, onClick: function () { return onPreview(file); }, style: { cursor: "pointer" }, role: "button", tabIndex: 0, onKeyDown: function (e) { return e.key === "Enter" && onPreview(file); }, "aria-label": "Preview ".concat(file.name) },
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileIconWrap },
                react_1.default.createElement(lucide_react_1.FileText, { size: 18 })),
            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileInfo },
                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileName }, file.name),
                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileReady },
                    react_1.default.createElement(lucide_react_1.CheckCircle, { size: 12 }),
                    isReadOnly ? "Click to preview" : "Ready to submit"))),
        !isReadOnly && onClear && (react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.clearFileBtn, onClick: onClear, "aria-label": "Remove file" },
            react_1.default.createElement(lucide_react_1.Trash2, { size: 16 })))));
});
AttachmentRow.displayName = "AttachmentRow";
//# sourceMappingURL=ShowCandidateDetailsPopup.js.map