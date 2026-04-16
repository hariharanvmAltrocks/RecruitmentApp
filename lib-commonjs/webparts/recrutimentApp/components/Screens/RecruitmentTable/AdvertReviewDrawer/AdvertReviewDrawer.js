"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertReviewDrawer = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var getPositionDetails_1 = require("./Hooks/getPositionDetails");
var getAdvertismentDetails_1 = require("./Hooks/getAdvertismentDetails");
var getAttachmentDetails_1 = require("./Hooks/getAttachmentDetails");
var getSignatureDetails_1 = require("./Hooks/getSignatureDetails");
require("./AdvertReviewDrawer.scss");
var PositionFramework_1 = require("../Components/PositionFramework");
var AdvertLanguageToggle_1 = require("../Components/AdvertLanguageToggle");
var RequiredAttachments_1 = require("../Components/RequiredAttachments");
var ReviewCommentSignature_1 = require("../Components/ReviewCommentSignature");
var UploadDocument_1 = require("../Components/UploadDocument");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var BGVerification_1 = tslib_1.__importDefault(require("../Components/BGVerification/BGVerification"));
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
var useUpdateMainRecord_1 = require("./Hooks/SaveHooks/useUpdateMainRecord");
var useHRLeadProcess_1 = require("./Hooks/SaveHooks/useHRLeadProcess");
var useHRProcess_1 = require("./Hooks/SaveHooks/useHRProcess");
var react_router_dom_1 = require("react-router-dom");
var ModalPopup_1 = require("../../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var loading_1 = tslib_1.__importDefault(require("../../../Comman/Loading/loading"));
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var toDocFiles = function (files) {
    return files.map(function (item) { return ({
        name: item.name,
        content: item.fileContent,
        type: "New",
    }); });
};
var toPositionDetails = function (p) { return ({
    jobId: p.RecordID,
    jobTitle: p.JobTitleEnglish,
    jobCode: p.JobCode,
    department: p.Department,
    buCode: p.BusinessUnitCode,
    buName: "", // TODO: wire real value
    subDepartment: p.SubDepartment,
    section: p.Section,
    deptCode: p.DepartmentCode,
    areaOfWork: p.AreaofWork,
    nationality: p.Nationality,
    patersonGrade: p.PatersonGrade,
    drcGrade: p.DRCGrade,
    employmentCategory: p.EmploymentCategory,
    contractType: p.TypeOfContract,
    numberOfPersons: Number(p.NumberOfPersonNeeded),
    dateRequired: String(p.DateRequried),
    JobCodeID: p.JobCodeId,
}); };
var AdvertReviewDrawer = function (_a) {
    var _b, _c, _d;
    var drawerOpen = _a.drawerOpen, selectedJobId = _a.selectedJobId, selectedJobCode = _a.selectedJobCode, selectedType = _a.selectedType, advertLanguage = _a.advertLanguage, reviewerComments = _a.reviewerComments, acknowledgementCheckbox = _a.acknowledgementCheckbox, loadingState = _a.loadingState, onClose = _a.onClose, onLanguageChange = _a.onLanguageChange, onCommentsChange = _a.onCommentsChange, onToggleAcknowledgement = _a.onToggleAcknowledgement, setLoadingState = _a.setLoadingState, refreshKey = _a.refreshKey;
    var metricId = (0, UIStateContext_1.useUIState)().MatricID;
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _e = (0, useModalPopup_1.useModalPopup)(), modalState = _e.modalState, showModal = _e.showModal, closeModal = _e.closeModal;
    var _f = (0, react_1.useState)(false), loading = _f[0], setLoading = _f[1];
    var _g = (0, getPositionDetails_1.usePositionDetails)(selectedJobId, selectedType), positionDetails = _g.data, positionLoading = _g.loading;
    var _h = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _h.data, signatureLoading = _h.loading;
    var jobCodeId = (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId) !== null && _b !== void 0 ? _b : 0;
    var jobCode = (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _c !== void 0 ? _c : selectedJobCode;
    var _j = (0, getAdvertismentDetails_1.useAdvertismentDetails)(jobCodeId, { enabled: !!jobCodeId }), advertDetails = _j.data, BGVData = _j.BGVValue, handleBvgToggle = _j.handleBvgToggle, advertLoading = _j.loading;
    var _k = (0, getAttachmentDetails_1.useAttachmentDetails)(jobCode, { enabled: !!jobCode }), attachments = _k.data, attachmentLoading = _k.loading;
    var isLoading = positionLoading || advertLoading || attachmentLoading || signatureLoading;
    var _l = (0, react_1.useState)([]), uploadDocument = _l[0], setUploadDocument = _l[1];
    var showValidationRef = (0, react_1.useRef)(false);
    var isSubmittingRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (loadingState !== isLoading) {
            setLoadingState(isLoading);
        }
    }, [isLoading, loadingState, setLoadingState]);
    var roleID = (0, react_1.useMemo)(function () {
        return roleIDs.includes(Config_1.RoleID.LineManager) || roleIDs.includes(Config_1.RoleID.HOD)
            ? Config_1.RoleID.LineManager
            : roleIDs[0];
    }, [roleIDs]);
    var formData = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return ({
            ID: (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ID) !== null && _a !== void 0 ? _a : 0,
            JobCodeId: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId) !== null && _b !== void 0 ? _b : 0,
            JobCode: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _c !== void 0 ? _c : "",
            JobTitleEnglish: (_d = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleEnglish) !== null && _d !== void 0 ? _d : "",
            JobTitleFrench: (_e = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleFrench) !== null && _e !== void 0 ? _e : "",
            DepartmentID: (_f = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DepartmentId) !== null && _f !== void 0 ? _f : 0,
            Nationality: (_g = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality) !== null && _g !== void 0 ? _g : "",
            NumberOfPersonNeeded: (_h = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NumberOfPersonNeeded) !== null && _h !== void 0 ? _h : "",
            Dptcode: (_j = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DeptCode) !== null && _j !== void 0 ? _j : "",
            reviewerComments: reviewerComments,
            StatusId: (_k = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusId) !== null && _k !== void 0 ? _k : 0,
        });
    }, [positionDetails, reviewerComments]);
    var docFiles = (0, react_1.useMemo)(function () { return toDocFiles(uploadDocument); }, [uploadDocument]);
    var mappedData = (0, react_1.useMemo)(function () { return (positionDetails ? toPositionDetails(positionDetails) : null); }, [positionDetails]);
    var advertContent = (0, react_1.useMemo)(function () {
        return advertDetails
            ? advertLanguage === "EN"
                ? advertDetails.english
                : advertDetails.french
            : null;
    }, [advertDetails, advertLanguage]);
    var headerMeta = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        return ({
            title: (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleEnglish) !== null && _a !== void 0 ? _a : "",
            code: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _b !== void 0 ? _b : "",
            department: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Department) !== null && _c !== void 0 ? _c : "",
        });
    }, [positionDetails]);
    var commentValid = reviewerComments.trim().length > 0;
    var uploadValid = uploadDocument.length > 0;
    var checkboxValid = acknowledgementCheckbox;
    var optionValid = Array.isArray(BGVData === null || BGVData === void 0 ? void 0 : BGVData.checkboxBGVOption) &&
        BGVData.checkboxBGVOption.some(function (o) { return o.checked; });
    var bgvValid = optionValid;
    var canApprove = (0, react_1.useMemo)(function () {
        var rules = [
            {
                roles: [Config_1.RoleID.RecruitmentHR],
                validate: function () { return commentValid && uploadValid && checkboxValid; },
            },
            {
                roles: [Config_1.RoleID.HOD, Config_1.RoleID.LineManager],
                validate: function () { return commentValid && checkboxValid; },
            },
            {
                roles: [Config_1.RoleID.RecruitmentHRLead],
                validate: function () {
                    return commentValid &&
                        uploadValid &&
                        checkboxValid &&
                        ((positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality) === ConditionConfig_1.Nationality.Expatriate
                            ? bgvValid
                            : true);
                },
            },
        ];
        return rules.some(function (rule) {
            return rule.roles.some(function (role) { return roleIDs.includes(role); }) && rule.validate();
        });
    }, [
        commentValid,
        uploadValid,
        checkboxValid,
        bgvValid,
        positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality,
        roleIDs,
    ]);
    var updateMainRecord = (0, useUpdateMainRecord_1.useUpdateMainRecord)(formData, roleID).updateMainRecord;
    var handleHRLeadProcess = (0, useHRLeadProcess_1.useHRLeadProcess)(formData, Config_1.RoleID.RecruitmentHRLead, docFiles, (_d = BGVData === null || BGVData === void 0 ? void 0 : BGVData.checkboxBGVOption) !== null && _d !== void 0 ? _d : []).handleHRLeadProcess;
    var handleHRProcess = (0, useHRProcess_1.useHRProcess)(formData, Config_1.RoleID.RecruitmentHR, docFiles).handleHRProcess;
    var showSuccessModal = (0, react_1.useCallback)(function (msg) {
        showModal({
            type: "success",
            title: "Submitted Successfully",
            message: msg,
            confirmLabel: "OK",
            onConfirm: function () {
                closeModal();
                onClose();
                navigate("/RecruitmentTable");
                refreshKey();
            },
        });
    }, [showModal, closeModal, onClose, navigate, refreshKey]);
    var handleApprove = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isHRLead, isHR, isHODorLM, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    showValidationRef.current = true;
                    if (!canApprove) {
                        showModal({
                            type: "warning",
                            title: "Required Fields Missing",
                            message: "One or more fields are required. Please complete all highlighted fields before submitting.",
                            confirmLabel: "OK",
                            onConfirm: closeModal,
                        });
                        return [2 /*return*/];
                    }
                    if (isSubmittingRef.current)
                        return [2 /*return*/];
                    isSubmittingRef.current = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, 10, 11]);
                    setLoading(true);
                    isHRLead = roleIDs.includes(Config_1.RoleID.RecruitmentHRLead);
                    isHR = roleIDs.includes(Config_1.RoleID.RecruitmentHR);
                    isHODorLM = [Config_1.RoleID.HOD, Config_1.RoleID.LineManager].some(function (role) {
                        return roleIDs.includes(role);
                    });
                    if (!(isHRLead && metricId === ConditionConfig_1.MatricID.UploadONEM)) return [3 /*break*/, 3];
                    return [4 /*yield*/, handleHRLeadProcess(showSuccessModal)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 3:
                    if (!isHR) return [3 /*break*/, 5];
                    return [4 /*yield*/, handleHRProcess(showSuccessModal)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 5:
                    if (!isHODorLM) return [3 /*break*/, 7];
                    return [4 /*yield*/, updateMainRecord()];
                case 6:
                    _a.sent();
                    showSuccessModal(ConditionConfig_1.RecuritmentHRMsg.AdvertisementReveiwMsg);
                    return [3 /*break*/, 8];
                case 7:
                    console.warn("No matching role found", roleIDs);
                    _a.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    error_1 = _a.sent();
                    console.error(error_1);
                    showModal({
                        type: "error",
                        title: "Something Went Wrong",
                        message: "An unexpected error occurred. Please try again.",
                        confirmLabel: "Close",
                        onConfirm: closeModal,
                    });
                    return [3 /*break*/, 11];
                case 10:
                    if (isSubmittingRef.current) {
                        isSubmittingRef.current = false;
                    }
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); }, [
        canApprove,
        roleIDs,
        metricId,
        handleHRLeadProcess,
        handleHRProcess,
        updateMainRecord,
        showSuccessModal,
        showModal,
        closeModal,
    ]);
    var sv = showValidationRef.current;
    var uploadError = sv && !uploadValid;
    var commentError = sv && !commentValid;
    var checkboxError = sv && !checkboxValid;
    var bgvError = sv && !optionValid;
    var showUploadONEMSection = [
        ConditionConfig_1.MatricID.UploadONEM,
        ConditionConfig_1.MatricID.JobAdvert,
    ].includes(metricId);
    var showBGVSection = metricId === ConditionConfig_1.MatricID.UploadONEM &&
        (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality) === ConditionConfig_1.Nationality.Expatriate;
    var showReviewFooter = metricId !== 0 &&
        [
            ConditionConfig_1.MatricID.UploadONEM,
            ConditionConfig_1.MatricID.JobAdvert,
            ConditionConfig_1.MatricID.AdvertReviewHOD,
            ConditionConfig_1.MatricID.AdvertReviewLM,
        ].includes(metricId);
    var handleCancel = function () {
        showModal({
            type: "confirmation",
            title: "Cancel",
            message: "Are you sure you want to cancel?",
            confirmLabel: "Yes",
            cancelLabel: "No",
            onConfirm: function () {
                onClose();
                closeModal();
                navigate("/RecruitmentTable");
            },
            onCancel: closeModal,
        });
    };
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, drawerOpen && (react_1.default.createElement(react_1.default.Fragment, null,
        loading && react_1.default.createElement(loading_1.default, null),
        react_1.default.createElement("div", { className: "advert-review-drawer" },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "advert-review-drawer__backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }),
            react_1.default.createElement(framer_motion_1.motion.div, { className: "advert-review-drawer__panel", initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 25, stiffness: 200 } },
                react_1.default.createElement("div", { className: "advert-review-drawer__header" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__header-left" },
                        react_1.default.createElement("div", { className: "advert-review-drawer__header-icon" },
                            react_1.default.createElement(lucide_react_1.FileCheck, { size: 22 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h2", { className: "advert-review-drawer__title" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "220px" })) : (headerMeta.title)),
                            react_1.default.createElement("div", { className: "advert-review-drawer__meta" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "160px" })) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("span", { className: "advert-review-drawer__badge" }, headerMeta.code),
                                react_1.default.createElement("span", { className: "advert-review-drawer__dot" }),
                                react_1.default.createElement("span", { className: "advert-review-drawer__meta-text" }, headerMeta.department)))))),
                    react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__close", onClick: onClose },
                        react_1.default.createElement(lucide_react_1.X, { size: 18 }))),
                react_1.default.createElement("div", { className: "advert-review-drawer__content" },
                    react_1.default.createElement(PositionFramework_1.PositionFramework, { positionDetails: mappedData, isLoading: isLoading, headerCode: headerMeta.code }),
                    react_1.default.createElement(AdvertLanguageToggle_1.AdvertLanguageToggle, { advertLanguage: advertLanguage, advertContent: advertContent, isLoading: isLoading, onLanguageChange: onLanguageChange }),
                    react_1.default.createElement(RequiredAttachments_1.RequiredAttachments, { attachments: attachments, isLoading: isLoading }),
                    showUploadONEMSection && (react_1.default.createElement(UploadDocument_1.UploadDocument, { multiple: false, acceptedFormats: ".pdf", label: metricId === ConditionConfig_1.MatricID.UploadONEM
                            ? "ONEM Signed and Stamped Document (Only PDF)"
                            : "Draft ONEM AdvertDoc French (Only PDF)", required: true, onChange: setUploadDocument, hasError: uploadError, disabled: isSubmittingRef.current })),
                    showBGVSection && (react_1.default.createElement("div", { style: { marginTop: "20px" } },
                        react_1.default.createElement(BGVerification_1.default, { mandatoryChecks: BGVData.mantoryChecks, VerificationChecks: BGVData.checkboxBGVOption, onToggleOption: handleBvgToggle, hasError: bgvError, disabled: isSubmittingRef.current }))),
                    showReviewFooter && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement, commentError: commentError, checkboxError: checkboxError, disabled: isSubmittingRef.current, acknowledgementLabel: metricId === ConditionConfig_1.MatricID.UploadONEM
                                ? ConditionConfig_1.CheckboxContent.UploadOnemDocument
                                : ConditionConfig_1.CheckboxContent.ApprovalCheckbox }),
                        react_1.default.createElement("div", { className: "advert-review-drawer__footer" },
                            react_1.default.createElement("div", { className: "advert-review-drawer__footer-actions" },
                                react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__button", onClick: handleCancel }, "Cancel"),
                                react_1.default.createElement("button", { type: "button", className: !canApprove
                                        ? "advert-review-drawer__button advert-review-drawer__button--primary__is-disabled"
                                        : "advert-review-drawer__button advert-review-drawer__button--primary", disabled: !canApprove || isSubmittingRef.current, onClick: handleApprove }, isSubmittingRef.current ? (react_1.default.createElement(react_1.default.Fragment, null,
                                    react_1.default.createElement(lucide_react_1.Loader2, { size: 16, className: "modal-popup__spinner" }),
                                    "Sending...")) : (react_1.default.createElement(react_1.default.Fragment, null,
                                    react_1.default.createElement(lucide_react_1.Send, { size: 16, style: { marginRight: 8 } }),
                                    "Submit")))))))))),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))))));
};
exports.AdvertReviewDrawer = AdvertReviewDrawer;
//# sourceMappingURL=AdvertReviewDrawer.js.map