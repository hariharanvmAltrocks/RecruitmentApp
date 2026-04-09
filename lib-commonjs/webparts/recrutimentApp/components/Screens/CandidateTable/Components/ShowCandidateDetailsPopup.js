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
var reusehooks_1 = require("../../../Hooks/reusehooks");
var ShowCandidateDetailsPopup = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var isOpen = _a.isOpen, onClose = _a.onClose, candidateId = _a.candidateId, panelParams = _a.panelParams, positionDetails = _a.positionDetails, handleRefresh = _a.handleRefresh;
    var ReviewHRFlag = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.HRPending;
    var ReviewLML1 = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.LineManagerL1Pending ||
        (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.LineManagerLevel1OnHold;
    var ReviewLML2 = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.LineManagerL2Pending ||
        (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.LineManagerLevel2OnHold;
    var PanelMember = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) ===
        Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
        Number(panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) ===
            Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel;
    var panelOptionFlag = (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) ===
        Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview ||
        Number(panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) ===
            Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel ||
        (panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) === Config_1.workflowStatusApi.HRPending;
    var isEnabled = !!panelOptionFlag;
    var isReadOnly = !ReviewHRFlag;
    var _r = (0, fetchPanelMembers_1.useFetchPanelMembers)((_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCodeId) !== null && _b !== void 0 ? _b : 0, (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.AssignEMail) !== null && _c !== void 0 ? _c : "", (_d = panelParams === null || panelParams === void 0 ? void 0 : panelParams.candidateId) !== null && _d !== void 0 ? _d : 0, (_e = panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) !== null && _e !== void 0 ? _e : "", isEnabled), paneloptions = _r.data, panelloading = _r.loading, error = _r.error;
    var _s = (0, fetchCandidateDetails_1.useFetchCandidateDetails)(candidateId, (_f = panelParams === null || panelParams === void 0 ? void 0 : panelParams.RecruitmentID) !== null && _f !== void 0 ? _f : 0), data = _s.data, loading = _s.loading;
    // const { submitting, submit, modalState, closeModal } = useSubmitCandidateReview(onClose, handleRefresh);
    var _t = (0, Usesubmitcandidatereview_1.useSubmitCandidateReview)(onClose, handleRefresh), submitting = _t.submitting, submit = _t.submit, submitModalState = _t.modalState, submitCloseModal = _t.closeModal;
    var _u = (0, useModalPopup_1.useModalPopup)(), modalState = _u.modalState, showModal = _u.showModal, closeModal = _u.closeModal;
    var fileInputRef = (0, react_1.useRef)(null);
    var _v = (0, react_1.useState)(null), decision = _v[0], setDecision = _v[1];
    var _w = (0, react_1.useState)(""), decisionComments = _w[0], setDecisionComments = _w[1];
    var _x = (0, react_1.useState)([]), consultoptions = _x[0], setConsultOptions = _x[1];
    var _y = (0, react_1.useState)(null), previewFile = _y[0], setPreviewFile = _y[1];
    var feedbackOptions = [
        "Excellent",
        "Good",
        "Average",
        "Below Average",
        "Poor",
    ];
    var _z = (0, react_1.useState)(""), HRReview = _z[0], setHRReview = _z[1];
    var _0 = (0, react_1.useState)(false), open = _0[0], setOpen = _0[1];
    var _1 = (0, react_1.useState)({
        consultedWith: "",
        attachment: [],
        comments: "",
    }), coi = _1[0], setCoi = _1[1];
    var _2 = (0, react_1.useState)({
        panelMembers: [],
        startDate: "",
        endDate: "",
    }), level1 = _2[0], setLevel1 = _2[1];
    var _3 = (0, react_1.useState)({
        panelMembers: [],
        startDate: "",
        endDate: "",
    }), level2 = _3[0], setLevel2 = _3[1];
    var handlePreview = (0, react_1.useCallback)(function (file) {
        var rawUrl = file.content;
        // const resolveUrl = (url: string): string => {
        //   if (isSharePointUrl(url)) return buildWopiUrl(url);
        //   if (isPdfUrl(url)) return url;
        //   return buildOfficeViewerUrl(url);
        // };
        // const previewUrl = resolveUrl(rawUrl);
        setPreviewFile({ url: rawUrl, name: file.name });
    }, []);
    var getViewerUrl = function (url) {
        if ((0, reusehooks_1.isSharePointUrl)(url)) {
            return (0, reusehooks_1.buildWopiUrl)(url);
        }
        if ((0, reusehooks_1.isPdfUrl)(url)) {
            return url;
        }
        return (0, reusehooks_1.buildOfficeViewerUrl)(url);
    };
    var panelValue = (0, react_1.useMemo)(function () {
        if (!paneloptions)
            return null;
        var _a = paneloptions.Level1, Level1 = _a === void 0 ? [] : _a, _b = paneloptions.Level2, Level2 = _b === void 0 ? [] : _b;
        var level1Members = [];
        var consultOption = [];
        Level1.forEach(function (item) {
            if (item.Role !== ConditionConfig_1.RoleName.InterviewPanel) {
                level1Members.push(String(item.value));
            }
            if (item.Role === ConditionConfig_1.RoleName.LineManager ||
                item.Role === ConditionConfig_1.RoleName.HOD ||
                item.Role === ConditionConfig_1.RoleName.RecruitmentHR) {
                consultOption.push({ value: String(item.label), label: item.label });
            }
        });
        var level2Members = (Level2 === null || Level2 === void 0 ? void 0 : Level2.length) > 0
            ? Level2.filter(function (item) { return item.Role !== ConditionConfig_1.RoleName.InterviewPanel; }).map(function (item) { return String(item.value); })
            : [];
        return { level1Members: level1Members, level2Members: level2Members, consultOption: consultOption };
    }, [paneloptions]);
    (0, react_1.useEffect)(function () {
        if (!isOpen)
            return;
        if (panelValue && (PanelMember || ReviewHRFlag)) {
            setConsultOptions(panelValue.consultOption);
            setLevel1({
                panelMembers: panelValue.level1Members,
                startDate: data === null || data === void 0 ? void 0 : data.InterviewStartDate,
                endDate: data === null || data === void 0 ? void 0 : data.InterviewEndDate,
            });
            setLevel2({
                panelMembers: panelValue.level2Members,
                startDate: "",
                endDate: "",
            });
        }
        if (!data)
            return;
        var loadCOI = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var COIAttchObj, COIAttachRes, COIOptions;
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        COIAttchObj = {
                            RequestID: String(data.profileID),
                            DocumentName: ConditionConfig_1.DocumentFolderName.COIAttach,
                        };
                        return [4 /*yield*/, ServiceExport_1.CandidateTable.fetchCOIAttachment(COIAttchObj)];
                    case 1:
                        COIAttachRes = _d.sent();
                        COIOptions = [
                            { value: String(data.COIAppreve), label: data.COIAppreve },
                        ];
                        setConsultOptions(COIOptions);
                        if ((panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) != Config_1.workflowStatusApi.HRPending) {
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
    var showCOI = (data === null || data === void 0 ? void 0 : data.ConflictsOfInterest) === "Yes";
    var showDisability = (data === null || data === void 0 ? void 0 : data.disability) === "Yes";
    var canSubmit = (0, react_1.useMemo)(function () {
        var _a, _b;
        // decisionComments is always required for any status across the forms
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
        if (ReviewLML1 || ReviewLML2) {
            if (!decision)
                return false;
        }
        if (PanelMember) {
            if ((panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) ===
                Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview) {
                if (level1.panelMembers.length < 3 ||
                    !level1.startDate ||
                    !level1.endDate)
                    return false;
            }
            if (Number(panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) ===
                Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
                if (level2.panelMembers.length < 3 ||
                    !level2.startDate ||
                    !level2.endDate)
                    return false;
            }
        }
        return true;
    }, [
        ReviewHRFlag,
        ReviewLML1,
        ReviewLML2,
        PanelMember,
        decision,
        decisionComments,
        HRReview,
        showCOI,
        coi,
        level1,
        level2,
        panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId,
    ]);
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
        console.log(val, "valll");
    }, []);
    var handleSubmit = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var L1Panel, L2Panel;
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
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
                    L1Panel = (_b = (_a = level1 === null || level1 === void 0 ? void 0 : level1.panelMembers) === null || _a === void 0 ? void 0 : _a.map(function (item) { return ({
                        key: Number(item),
                        text: item,
                    }); })) !== null && _b !== void 0 ? _b : [];
                    L2Panel = (_d = (_c = level2 === null || level2 === void 0 ? void 0 : level2.panelMembers) === null || _c === void 0 ? void 0 : _c.map(function (item) { return ({
                        key: Number(item),
                        text: item,
                    }); })) !== null && _d !== void 0 ? _d : [];
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
                            StatusId: (_e = panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) !== null && _e !== void 0 ? _e : "",
                        })];
                case 1:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [
        data,
        candidateId,
        decision,
        decisionComments,
        coi,
        level1,
        level2,
        submit,
        canSubmit,
    ]);
    if (!isOpen)
        return null;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(framer_motion_1.AnimatePresence, null,
            react_1.default.createElement(framer_motion_1.AnimatePresence, null,
                react_1.default.createElement(framer_motion_1.motion.div, { className: ShowCandidateDetailsPopup_module_scss_1.default.backdrop, 
                    // style={{ zIndex: 2147483647 }}
                    variants: reuseUI_1.backdropVariants, initial: "hidden", animate: "visible", exit: "exit", onClick: onClose },
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
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("button", { className: ShowCandidateDetailsPopup_module_scss_1.default.closeBtn, type: "button", onClick: onClose, "aria-label": "Close" },
                                    react_1.default.createElement(lucide_react_1.X, { size: 20, strokeWidth: 2.5 })))),
                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.body },
                            react_1.default.createElement("aside", { className: ShowCandidateDetailsPopup_module_scss_1.default.sidebar },
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.avatarSection },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.avatar }, ((_g = data === null || data === void 0 ? void 0 : data.ApplicantName) !== null && _g !== void 0 ? _g : "A").charAt(0)),
                                    react_1.default.createElement("h3", { className: ShowCandidateDetailsPopup_module_scss_1.default.avatarName }, (_h = data === null || data === void 0 ? void 0 : data.ApplicantName) !== null && _h !== void 0 ? _h : "--"),
                                    react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.avatarNationality }, (_j = data === null || data === void 0 ? void 0 : data.Nationality) !== null && _j !== void 0 ? _j : "--")),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoGrid },
                                    react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Globe, { size: 14 }), label: "Nationality", value: data === null || data === void 0 ? void 0 : data.Nationality }),
                                    react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Users, { size: 14 }), label: "Gender", value: data === null || data === void 0 ? void 0 : data.Gender }),
                                    react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.FileText, { size: 14 }), label: "Qualification", value: data === null || data === void 0 ? void 0 : data.HighestQualification }),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRow },
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                            react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Zap, { size: 14 }), label: "Mining exp.", value: data === null || data === void 0 ? void 0 : data.ExperienceMining })),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                            react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Zap, { size: 14 }), label: "Related exp.", value: String(data === null || data === void 0 ? void 0 : data.ExperRelatedfield) }))),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRow },
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                            react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 14 }), label: "Conflicts", value: (_k = data === null || data === void 0 ? void 0 : data.ConflictsOfInterest) !== null && _k !== void 0 ? _k : "No" })),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                            react_1.default.createElement(reuseUI_1.InfoItem, { icon: react_1.default.createElement(lucide_react_1.Accessibility, { size: 14 }), label: "Disability", value: (_l = data === null || data === void 0 ? void 0 : data.disability) !== null && _l !== void 0 ? _l : "No" }))),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRow },
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                            react_1.default.createElement(reuseUI_1.InfoItem, { label: "Tax dependents", value: String(data === null || data === void 0 ? void 0 : data.NumberOftax) })),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.infoRowItem },
                                            react_1.default.createElement(reuseUI_1.InfoItem, { label: "Current position", value: data === null || data === void 0 ? void 0 : data.CurrentPosition }))),
                                    (data === null || data === void 0 ? void 0 : data.hasIvanhoeZijinExperience) && (react_1.default.createElement(reuseUI_1.InfoItem, { label: "Group / partner companies", value: data === null || data === void 0 ? void 0 : data.hasIvanhoeZijinExperience }))),
                                react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.attachmentsSection },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.attachmentsLabel },
                                        react_1.default.createElement(lucide_react_1.FileText, { size: 14, className: ShowCandidateDetailsPopup_module_scss_1.default.attachmentsLabelIcon }),
                                        " ",
                                        "Attachments"),
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.attachmentsBox },
                                        react_1.default.createElement(RequiredAttachments_1.RequiredAttachments, { attachments: (_m = data === null || data === void 0 ? void 0 : data.OverallAtttachment) !== null && _m !== void 0 ? _m : [], isLoading: loading })))),
                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.mainContent },
                                !PanelMember && (react_1.default.createElement(react_1.default.Fragment, null,
                                    react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 0, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                        react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Screening Questions", subtitle: "Candidate responses", accent: "orange" }),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.questionsCard },
                                            react_1.default.createElement(reuseUI_1.QuestionCard, { index: 1, question: "Willing to relocate if not currently living close to the relevant project site/office?", answer: data === null || data === void 0 ? void 0 : data.WillingToRelocate }),
                                            (data === null || data === void 0 ? void 0 : data.previouslyworkedMine) && (react_1.default.createElement(reuseUI_1.QuestionCard, { index: 2, question: "Has the person previously worked within the Ivanhoe Mines Group?", answer: data === null || data === void 0 ? void 0 : data.previouslyworkedMine })),
                                            react_1.default.createElement(reuseUI_1.QuestionCard, { index: 3, question: "Any family or other links with existing employees to declare? (If so, who? Attach detail)", answer: data === null || data === void 0 ? void 0 : data.familylinks }),
                                            react_1.default.createElement(reuseUI_1.QuestionCard, { index: 4, question: "Any business links to declare? (If so, who? Attach detail)", answer: data === null || data === void 0 ? void 0 : data.businesslinks }))))),
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
                                                !isReadOnly ? (coi.attachment.length === 0 ? (react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.uploadBtn, onClick: function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); } },
                                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.uploadIconWrap },
                                                        react_1.default.createElement(lucide_react_1.Upload, { size: 18 })),
                                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.uploadText },
                                                        react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.uploadTitle }, "Click to upload"),
                                                        react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.uploadSub }, "PDF, DOC, DOCX, PNG, JPG")))) : (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.filePreview },
                                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.filePreviewLeft },
                                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileIconWrap },
                                                            react_1.default.createElement(lucide_react_1.FileText, { size: 18 })),
                                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileInfo },
                                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileName }, coi.attachment[0].name),
                                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileReady },
                                                                react_1.default.createElement(lucide_react_1.CheckCircle, { size: 12 }),
                                                                " Ready to submit"))),
                                                    react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.clearFileBtn, onClick: handleClearFile, "aria-label": "Remove file" },
                                                        react_1.default.createElement(lucide_react_1.Trash2, { size: 16 }))))) : coi.attachment.length > 0 ? (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.filePreview },
                                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.filePreviewLeft, onClick: function () {
                                                            return handlePreview(coi.attachment[0]);
                                                        }, style: { cursor: "pointer" } },
                                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileIconWrap },
                                                            react_1.default.createElement(lucide_react_1.FileText, { size: 18 })),
                                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileInfo },
                                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileName }, coi.attachment[0].name),
                                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fileReady },
                                                                react_1.default.createElement(lucide_react_1.CheckCircle, { size: 12 }),
                                                                isReadOnly
                                                                    ? "Click to preview"
                                                                    : "Ready to submit"))),
                                                    !isReadOnly && (react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.clearFileBtn, onClick: handleClearFile, "aria-label": "Remove file" },
                                                        react_1.default.createElement(lucide_react_1.Trash2, { size: 16 }))))) : (react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.fieldLabel }, "No attachment")),
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
                                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.disabilityFieldValue }, (_o = data === null || data === void 0 ? void 0 : data.disability) !== null && _o !== void 0 ? _o : "--")),
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
                                                react_1.default.createElement("div", { className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.customDropdownTrigger).concat(open ? " ".concat(ShowCandidateDetailsPopup_module_scss_1.default.dropdownOpen) : "", "\n              ").concat(isReadOnly ? ShowCandidateDetailsPopup_module_scss_1.default.dropdownDisabled : ""), onClick: function () { return !isReadOnly && setOpen(!open); } },
                                                    react_1.default.createElement("span", { className: HRReview
                                                            ? ShowCandidateDetailsPopup_module_scss_1.default.dropdownSelected
                                                            : ShowCandidateDetailsPopup_module_scss_1.default.dropdownPlaceholder }, HRReview || "Select feedback"),
                                                    react_1.default.createElement(lucide_react_1.ChevronDown, { size: 18, className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.dropdownChevron).concat(open ? " ".concat(ShowCandidateDetailsPopup_module_scss_1.default.open) : "") })),
                                                react_1.default.createElement(framer_motion_1.AnimatePresence, null, open && (react_1.default.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: ShowCandidateDetailsPopup_module_scss_1.default.dropdownMenu }, feedbackOptions.map(function (option, index) { return (react_1.default.createElement("div", { key: index, onClick: function () {
                                                        setHRReview(option);
                                                        setOpen(false);
                                                    }, className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.dropdownOption).concat(HRReview === option ? " ".concat(ShowCandidateDetailsPopup_module_scss_1.default.dropdownOptionActive) : "") }, option)); })))))))),
                                PanelMember && (react_1.default.createElement(react_1.default.Fragment, null,
                                    react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 3, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                        react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Interview schedule - Level 1", accent: "blue" }),
                                        react_1.default.createElement(reuseUI_1.InterviewScheduleInput, { form: level1, onChange: setLevel1, panelOptions: ((_p = paneloptions === null || paneloptions === void 0 ? void 0 : paneloptions.Level1) !== null && _p !== void 0 ? _p : []).map(function (item) { return ({
                                                value: String(item.value),
                                                label: item.label,
                                            }); }), onToggleMember: function (val) {
                                                return handlePanelToggle(setLevel1, val);
                                            }, minPanelCount: 3, Disable: Number(panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) ===
                                                Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel })))),
                                Number(panelParams === null || panelParams === void 0 ? void 0 : panelParams.statusId) ===
                                    Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel && (react_1.default.createElement(react_1.default.Fragment, null,
                                    react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 4, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                        react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Interview schedule - Level 2", accent: "green" }),
                                        react_1.default.createElement(reuseUI_1.InterviewScheduleInput, { form: level2, onChange: setLevel2, panelOptions: ((_q = paneloptions === null || paneloptions === void 0 ? void 0 : paneloptions.Level2) !== null && _q !== void 0 ? _q : []).map(function (item) { return ({
                                                value: String(item.value),
                                                label: item.label,
                                            }); }), onToggleMember: function (val) {
                                                return handlePanelToggle(setLevel2, val);
                                            }, minPanelCount: 3, Disable: false })))),
                                !ReviewHRFlag && !PanelMember ? (react_1.default.createElement(framer_motion_1.motion.section, { className: ShowCandidateDetailsPopup_module_scss_1.default.section, custom: 5, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionCard },
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionHeader },
                                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionZap },
                                                react_1.default.createElement(lucide_react_1.Zap, { size: 28, fill: "currentColor" })),
                                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionTitleWrap },
                                                react_1.default.createElement("h3", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionTitle }, "Do you wish to select this candidate?"),
                                                react_1.default.createElement("p", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmDecisionSubtitle }, "Please review the candidate and provide your final decision."))),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnsRow },
                                            react_1.default.createElement("button", { type: "button", className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.decisionBtn, " ").concat(decision === "YES"
                                                    ? ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnYesActive
                                                    : ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnYesInactive), onClick: function () { return setDecision("YES"); } },
                                                react_1.default.createElement(lucide_react_1.CheckCircle, { size: 36, strokeWidth: 2, className: decision === "YES"
                                                        ? ShowCandidateDetailsPopup_module_scss_1.default.iconWhite
                                                        : ShowCandidateDetailsPopup_module_scss_1.default.iconGreen }),
                                                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnLabel }, "YES, SELECT")),
                                            react_1.default.createElement("button", { type: "button", className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.decisionBtn, " ").concat(decision === "NO"
                                                    ? ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnNoActive
                                                    : ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnNoInactive), onClick: function () { return setDecision("NO"); } },
                                                react_1.default.createElement(lucide_react_1.XCircle, { size: 36, strokeWidth: 2, className: decision === "NO"
                                                        ? ShowCandidateDetailsPopup_module_scss_1.default.iconWhite
                                                        : ShowCandidateDetailsPopup_module_scss_1.default.iconRed }),
                                                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnLabel }, "NO, REJECT")),
                                            react_1.default.createElement("button", { type: "button", className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.decisionBtn, " ").concat(decision === "HOLD"
                                                    ? ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnHoldActive
                                                    : ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnHoldInactive), onClick: function () { return setDecision("HOLD"); } },
                                                react_1.default.createElement(lucide_react_1.Activity, { size: 36, strokeWidth: 2, className: decision === "HOLD"
                                                        ? ShowCandidateDetailsPopup_module_scss_1.default.iconWhite
                                                        : ShowCandidateDetailsPopup_module_scss_1.default.iconAmber }),
                                                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.decisionBtnLabel }, "ON HOLD")))))) : (react_1.default.createElement(react_1.default.Fragment, null)),
                                react_1.default.createElement("hr", { className: ShowCandidateDetailsPopup_module_scss_1.default.sectionDivider }),
                                react_1.default.createElement(framer_motion_1.motion.section, { custom: 6, variants: reuseUI_1.sectionVariants, initial: "hidden", animate: "visible" },
                                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsCard },
                                        react_1.default.createElement(reuseUI_1.SectionHeader, { title: "Comments", accent: "blue" }),
                                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsFieldWrap },
                                            react_1.default.createElement("label", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsLabel },
                                                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsLabelText },
                                                    " ",
                                                    "decision justification / comments"),
                                                " ",
                                                react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsRequired }, "*")),
                                            react_1.default.createElement("textarea", { className: ShowCandidateDetailsPopup_module_scss_1.default.lmCommentsTextarea, placeholder: "Provide your final decision rationale...", value: decisionComments, onChange: function (e) { return setDecisionComments(e.target.value); }, disabled: submitting })))))),
                        react_1.default.createElement("footer", { className: ShowCandidateDetailsPopup_module_scss_1.default.footer },
                            react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.cancelBtn, onClick: onClose }, "Cancel"),
                            react_1.default.createElement("button", { type: "button", className: "".concat(ShowCandidateDetailsPopup_module_scss_1.default.submitBtn, " ").concat(canSubmit && !submitting
                                    ? ShowCandidateDetailsPopup_module_scss_1.default.submitBtnActive
                                    : ShowCandidateDetailsPopup_module_scss_1.default.submitBtnDisabled), disabled: !canSubmit || submitting, onClick: handleSubmit }, submitting ? ("Submitting...") : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.CheckCircle, { size: 16 }),
                                PanelMember ? "Interview Schedule" : "Submit action")))),
                        loading && (react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.loadingOverlay },
                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.spinner }),
                            react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.loadingText }, "Loading details..."))),
                        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal })),
                        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, submitModalState, { onClose: submitCloseModal }))))),
            previewFile && (react_1.default.createElement(framer_motion_1.motion.div, { className: ShowCandidateDetailsPopup_module_scss_1.default.previewBackdrop, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: function () { return setPreviewFile(null); } },
                react_1.default.createElement(framer_motion_1.motion.div, { className: ShowCandidateDetailsPopup_module_scss_1.default.previewModal, initial: { scale: 0.92, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.92, opacity: 0 }, onClick: function (e) { return e.stopPropagation(); } },
                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.previewHeader },
                        react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.previewHeaderLeft },
                            react_1.default.createElement(lucide_react_1.FileText, { size: 18 }),
                            react_1.default.createElement("span", { className: ShowCandidateDetailsPopup_module_scss_1.default.previewFileName }, previewFile.name)),
                        react_1.default.createElement("button", { type: "button", className: ShowCandidateDetailsPopup_module_scss_1.default.previewClose, onClick: function () { return setPreviewFile(null); } },
                            react_1.default.createElement(lucide_react_1.X, { size: 18 }))),
                    react_1.default.createElement("div", { className: ShowCandidateDetailsPopup_module_scss_1.default.previewBody },
                        react_1.default.createElement("iframe", { src: previewFile.url, title: previewFile.name, className: ShowCandidateDetailsPopup_module_scss_1.default.previewIframe }))))))));
};
exports.ShowCandidateDetailsPopup = ShowCandidateDetailsPopup;
//# sourceMappingURL=ShowCandidateDetailsPopup.js.map