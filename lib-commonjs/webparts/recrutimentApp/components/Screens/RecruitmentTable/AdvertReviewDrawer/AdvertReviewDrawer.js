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
var ValidationSummary_1 = require("../Components/ValidationSummary");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var BGVerification_1 = tslib_1.__importDefault(require("../Components/BGVerification/BGVerification"));
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
var useUpdateMainRecord_1 = require("./Hooks/SaveHooks/useUpdateMainRecord");
var useHRLeadProcess_1 = require("./Hooks/SaveHooks/useHRLeadProcess");
var useHRProcess_1 = require("./Hooks/SaveHooks/useHRProcess");
var useToast_1 = require("../../../Hooks/useToast");
var react_router_dom_1 = require("react-router-dom");
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var AdvertReviewDrawer = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var drawerOpen = _a.drawerOpen, selectedJobId = _a.selectedJobId, selectedJobCode = _a.selectedJobCode, selectedType = _a.selectedType, advertLanguage = _a.advertLanguage, reviewerComments = _a.reviewerComments, acknowledgementCheckbox = _a.acknowledgementCheckbox, loadingState = _a.loadingState, onClose = _a.onClose, onLanguageChange = _a.onLanguageChange, onCommentsChange = _a.onCommentsChange, onToggleAcknowledgement = _a.onToggleAcknowledgement, setLoadingState = _a.setLoadingState;
    var _o = (0, useToast_1.useToast)(), toast = _o.toast, closeToast = _o.closeToast, showSuccess = _o.showSuccess, showError = _o.showError, showWarning = _o.showWarning, showConfirm = _o.showConfirm;
    var metricId = (0, UIStateContext_1.useUIState)().MatricID;
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _p = (0, getPositionDetails_1.usePositionDetails)(selectedJobId, selectedType), positionDetails = _p.data, positionLoading = _p.loading;
    var _q = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _q.data, signatureLoading = _q.loading;
    var jobCodeId = (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId) !== null && _b !== void 0 ? _b : 0;
    var jobCode = (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _c !== void 0 ? _c : selectedJobCode;
    var _r = (0, getAdvertismentDetails_1.useAdvertismentDetails)(jobCodeId, { enabled: !!jobCodeId }), advertDetails = _r.data, BGVData = _r.BGVValue, handleBvgToggle = _r.handleBvgToggle, advertLoading = _r.loading;
    var _s = (0, getAttachmentDetails_1.useAttachmentDetails)(jobCode, { enabled: !!jobCode }), attachments = _s.data, attachmentLoading = _s.loading;
    var isLoading = positionLoading || advertLoading || attachmentLoading || signatureLoading;
    var _t = (0, react_1.useState)([]), uploadDocument = _t[0], setUploadDocument = _t[1];
    var _u = (0, react_1.useState)(false), showValidation = _u[0], setShowValidation = _u[1];
    var _v = (0, react_1.useState)(false), isSubmitting = _v[0], setIsSubmitting = _v[1];
    var commentValid = reviewerComments.trim().length > 0;
    var uploadValid = uploadDocument.length > 0;
    var checkboxValid = acknowledgementCheckbox;
    var canApprove = commentValid && uploadValid && checkboxValid;
    var roleID = roleIDs.includes(Config_1.RoleID.LineManager, Config_1.RoleID.HOD) ? Config_1.RoleID.LineManager : roleIDs[0];
    var document = uploadDocument.map(function (item) {
        return {
            name: item.name,
            content: item.fileContent,
            type: "New"
        };
    });
    var formData = {
        ID: (_d = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ID) !== null && _d !== void 0 ? _d : 0,
        JobCodeId: (_e = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeId) !== null && _e !== void 0 ? _e : 0,
        JobCode: (_f = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _f !== void 0 ? _f : "",
        JobTitleEnglish: (_g = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleEnglish) !== null && _g !== void 0 ? _g : "",
        JobTitleFrench: (_h = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleFrench) !== null && _h !== void 0 ? _h : "",
        DepartmentID: (_j = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DepartmentId) !== null && _j !== void 0 ? _j : 0,
        Nationality: (_k = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality) !== null && _k !== void 0 ? _k : "",
        NumberOfPersonNeeded: (_l = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NumberOfPersonNeeded) !== null && _l !== void 0 ? _l : "",
        Dptcode: (_m = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DeptCode) !== null && _m !== void 0 ? _m : "",
        reviewerComments: reviewerComments
    };
    var updateMainRecord = (0, useUpdateMainRecord_1.useUpdateMainRecord)(formData, roleID).updateMainRecord;
    var handleHRLeadProcess = (0, useHRLeadProcess_1.useHRLeadProcess)(formData, Config_1.RoleID.RecruitmentHRLead, document, BGVData.checkboxBGVOption).handleHRLeadProcess;
    var handleHRProcess = (0, useHRProcess_1.useHRProcess)(formData, Config_1.RoleID.RecruitmentHR, document).handleHRProcess;
    var mandatoryValid = Array.isArray(BGVData.mantoryChecks) &&
        BGVData.mantoryChecks.length > 0 &&
        BGVData.mantoryChecks.every(function (c) { return c.checked; });
    var optionValid = Array.isArray(BGVData.checkboxBGVOption) &&
        BGVData.checkboxBGVOption.some(function (o) { return o.checked; });
    var bgvValid = mandatoryValid && optionValid;
    (0, react_1.useEffect)(function () {
        if (loadingState !== isLoading) {
            setLoadingState(isLoading);
        }
    }, [isLoading, loadingState, setLoadingState]);
    var advertContent = (0, react_1.useMemo)(function () {
        if (!advertDetails) {
            return null;
        }
        return advertLanguage === "EN" ? advertDetails.english : advertDetails.french;
    }, [advertDetails, advertLanguage]);
    var headerMeta = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        return ({
            title: (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTitleEnglish) !== null && _a !== void 0 ? _a : "",
            code: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _b !== void 0 ? _b : "",
            department: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Department) !== null && _c !== void 0 ? _c : "",
        });
    }, [positionDetails]);
    var handleClose = (0, react_1.useCallback)(function () {
        onClose();
    }, [onClose]);
    var handleApprove = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var finalize;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setShowValidation(true);
                    if (isSubmitting) {
                        return [2 /*return*/];
                    }
                    if (!canApprove && !bgvValid) {
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    finalize = function (msg) {
                        showSuccess(msg);
                        navigate("/RecruitmentTable");
                    };
                    if (!roleIDs.includes(Config_1.RoleID.RecruitmentHRLead)) return [3 /*break*/, 3];
                    if (!(metricId === ConditionConfig_1.MatricID.UploadONEM)) return [3 /*break*/, 2];
                    return [4 /*yield*/, handleHRLeadProcess(finalize)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [3 /*break*/, 7];
                case 3:
                    if (!roleIDs.includes(Config_1.RoleID.RecruitmentHR)) return [3 /*break*/, 5];
                    return [4 /*yield*/, handleHRProcess(finalize)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    if (!roleIDs.includes(Config_1.RoleID.HOD, Config_1.RoleID.LineManager)) return [3 /*break*/, 7];
                    return [4 /*yield*/, updateMainRecord()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    showSuccess("Record Updated Successfully");
                    navigate("/RecruitmentTable");
                    setIsSubmitting(false);
                    return [2 /*return*/];
            }
        });
    }); }, [canApprove, bgvValid]);
    var mappedData = null;
    if (positionDetails) {
        mappedData = {
            jobId: positionDetails.RecordID,
            jobTitle: positionDetails.JobTitleEnglish,
            jobCode: positionDetails.JobCode,
            department: positionDetails.Department,
            buCode: positionDetails.BusinessUnitCode,
            buName: "sadasdasdasd", //data.BusinessUnitName,
            subDepartment: positionDetails.SubDepartment,
            section: positionDetails.Section,
            deptCode: positionDetails.DepartmentCode,
            // reportsTo: data.ReportsTo,
            areaOfWork: positionDetails.AreaofWork,
            nationality: positionDetails.Nationality,
            patersonGrade: positionDetails.PatersonGrade,
            drcGrade: positionDetails.DRCGrade,
            employmentCategory: positionDetails.EmploymentCategory,
            contractType: positionDetails.TypeOfContract,
            numberOfPersons: Number(positionDetails.NumberOfPersonNeeded),
            dateRequired: String(positionDetails.DateRequried),
            JobCodeID: positionDetails.JobCodeId,
        };
    }
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, drawerOpen && (react_1.default.createElement("div", { className: "advert-review-drawer" },
        react_1.default.createElement(framer_motion_1.motion.div, { className: "advert-review-drawer__backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleClose }),
        react_1.default.createElement(framer_motion_1.motion.div, { className: "advert-review-drawer__panel", initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 25, stiffness: 200 } },
            react_1.default.createElement("div", { className: "advert-review-drawer__header" },
                react_1.default.createElement("div", { className: "advert-review-drawer__header-left" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__header-icon" },
                        react_1.default.createElement(lucide_react_1.FileCheck, { size: 22 })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h2", { className: "advert-review-drawer__title" }, isLoading ? react_1.default.createElement(SkeletonBlock, { width: "220px" }) : headerMeta.title),
                        react_1.default.createElement("div", { className: "advert-review-drawer__meta" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "160px" })) : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("span", { className: "advert-review-drawer__badge" }, headerMeta.code),
                            react_1.default.createElement("span", { className: "advert-review-drawer__dot" }),
                            react_1.default.createElement("span", { className: "advert-review-drawer__meta-text" }, headerMeta.department)))))),
                react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__close", onClick: handleClose },
                    react_1.default.createElement(lucide_react_1.X, { size: 18 }))),
            react_1.default.createElement("div", { className: "advert-review-drawer__content" },
                react_1.default.createElement(PositionFramework_1.PositionFramework, { positionDetails: mappedData, isLoading: isLoading, headerCode: headerMeta.code }),
                react_1.default.createElement(AdvertLanguageToggle_1.AdvertLanguageToggle, { advertLanguage: advertLanguage, advertContent: advertContent, isLoading: isLoading, onLanguageChange: onLanguageChange }),
                react_1.default.createElement(RequiredAttachments_1.RequiredAttachments, { attachments: attachments, isLoading: isLoading }),
                [
                    ConditionConfig_1.MatricID.UploadONEM,
                    ConditionConfig_1.MatricID.JobAdvert,
                ].includes(metricId)
                    && (react_1.default.createElement(UploadDocument_1.UploadDocument, { multiple: false, acceptedFormats: ".pdf", label: metricId == ConditionConfig_1.MatricID.UploadONEM ? "Upload JobAdvert" : "Upload Advert", required: true, onChange: function (file) { return setUploadDocument(file); } })),
                metricId == ConditionConfig_1.MatricID.UploadONEM && (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Nationality) === ConditionConfig_1.Nationality.Expatriate && (react_1.default.createElement("div", { style: { marginTop: "20px" } },
                    react_1.default.createElement(BGVerification_1.default, { mandatoryChecks: BGVData.mantoryChecks, VerificationChecks: BGVData.checkboxBGVOption, onToggleOption: handleBvgToggle }))),
                metricId !== 0 &&
                    [
                        ConditionConfig_1.MatricID.UploadONEM,
                        ConditionConfig_1.MatricID.JobAdvert,
                        ConditionConfig_1.MatricID.AdvertReviewHOD,
                        ConditionConfig_1.MatricID.AdvertReviewLM,
                    ].includes(metricId) && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement }),
                    react_1.default.createElement(ValidationSummary_1.ValidationSummary, { show: showValidation && !canApprove, messages: [
                            { key: "upload", text: "Upload document is required.", valid: uploadValid },
                            { key: "comment", text: "Reviewer comment is required.", valid: commentValid },
                            { key: "checkbox", text: "Please acknowledge before approving.", valid: checkboxValid },
                            { key: "BGVVerification", text: "Please Choose the BGV Verification", valid: optionValid }
                        ] }),
                    react_1.default.createElement("div", { className: "advert-review-drawer__footer" },
                        react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__history", title: "View History" }),
                        react_1.default.createElement("div", { className: "advert-review-drawer__footer-actions" },
                            react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__button", onClick: handleClose }, "Cancel"),
                            react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__button advert-review-drawer__button--primary ".concat(canApprove ? "" : "is-disabled").trim(), disabled: isLoading, onClick: handleApprove }, isSubmitting ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.Loader2, { size: 16, className: "modal-popup__spinner" }),
                                "Sending...")) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.Send, { size: 16, style: { marginRight: 8 } }),
                                "Submit")))))))))))));
};
exports.AdvertReviewDrawer = AdvertReviewDrawer;
//# sourceMappingURL=AdvertReviewDrawer.js.map