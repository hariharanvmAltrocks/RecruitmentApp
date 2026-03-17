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
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var AdvertReviewDrawer = function (_a) {
    var _b, _c;
    var drawerOpen = _a.drawerOpen, selectedJobId = _a.selectedJobId, selectedJobCode = _a.selectedJobCode, selectedType = _a.selectedType, advertLanguage = _a.advertLanguage, reviewerComments = _a.reviewerComments, acknowledgementCheckbox = _a.acknowledgementCheckbox, loadingState = _a.loadingState, onClose = _a.onClose, onLanguageChange = _a.onLanguageChange, onCommentsChange = _a.onCommentsChange, onToggleAcknowledgement = _a.onToggleAcknowledgement, setLoadingState = _a.setLoadingState;
    var MatricID = (0, UIStateContext_1.useUIState)().MatricID;
    var _d = (0, getPositionDetails_1.usePositionDetails)(selectedJobId, selectedType), positionDetails = _d.data, positionLoading = _d.loading;
    var _e = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _e.data, signatureLoading = _e.loading;
    var jobCodeId = (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCodeID) !== null && _b !== void 0 ? _b : 0;
    var jobCode = (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.jobCode) !== null && _c !== void 0 ? _c : selectedJobCode;
    var _f = (0, getAdvertismentDetails_1.useAdvertismentDetails)(jobCodeId, { enabled: !!jobCodeId }), advertDetails = _f.data, BGVData = _f.BGVValue, handleBvgToggle = _f.handleBvgToggle, advertLoading = _f.loading;
    var _g = (0, getAttachmentDetails_1.useAttachmentDetails)(jobCode, { enabled: !!jobCode }), attachments = _g.data, attachmentLoading = _g.loading;
    var isLoading = positionLoading || advertLoading || attachmentLoading || signatureLoading;
    var _h = (0, react_1.useState)([]), uploadDocument = _h[0], setUploadDocument = _h[1];
    var _j = (0, react_1.useState)(false), showValidation = _j[0], setShowValidation = _j[1];
    var commentValid = reviewerComments.trim().length > 0;
    var uploadValid = uploadDocument.length > 0;
    var checkboxValid = acknowledgementCheckbox;
    var canApprove = commentValid && uploadValid && checkboxValid;
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
            title: (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.jobTitle) !== null && _a !== void 0 ? _a : "",
            code: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.jobCode) !== null && _b !== void 0 ? _b : "",
            department: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.department) !== null && _c !== void 0 ? _c : "",
        });
    }, [positionDetails]);
    var handleClose = (0, react_1.useCallback)(function () {
        onClose();
    }, [onClose]);
    var handleApprove = (0, react_1.useCallback)(function () {
        setShowValidation(true);
        if (!canApprove && !bgvValid) {
            return;
        }
        // TODO: Add approve action here
    }, [canApprove]);
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
                react_1.default.createElement(PositionFramework_1.PositionFramework, { positionDetails: positionDetails, isLoading: isLoading, headerCode: headerMeta.code }),
                react_1.default.createElement(AdvertLanguageToggle_1.AdvertLanguageToggle, { advertLanguage: advertLanguage, advertContent: advertContent, isLoading: isLoading, onLanguageChange: onLanguageChange }),
                react_1.default.createElement(RequiredAttachments_1.RequiredAttachments, { attachments: attachments, isLoading: isLoading }),
                react_1.default.createElement(UploadDocument_1.UploadDocument, { multiple: false, acceptedFormats: ".pdf", label: "Upload JobAdvert", required: true, onChange: function (file) { return setUploadDocument(file); } }),
                MatricID == 2 && (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.nationality) === ConditionConfig_1.Nationality.Expatriate && (react_1.default.createElement("div", { style: { marginTop: "20px" } },
                    react_1.default.createElement(BGVerification_1.default, { mandatoryChecks: BGVData.mantoryChecks, VerificationChecks: BGVData.checkboxBGVOption, onToggleOption: handleBvgToggle }))),
                react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement })),
            react_1.default.createElement(ValidationSummary_1.ValidationSummary, { show: showValidation && !canApprove, messages: [
                    { key: "upload", text: "Upload document is required.", valid: uploadValid },
                    { key: "comment", text: "Reviewer comment is required.", valid: commentValid },
                    { key: "checkbox", text: "Please acknowledge before approving.", valid: checkboxValid },
                    { key: "BGVVerification", text: "Please Choose the BGV Verification", valid: optionValid }
                ] }),
            react_1.default.createElement("div", { className: "advert-review-drawer__footer" },
                react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__history", title: "View History" },
                    react_1.default.createElement(lucide_react_1.History, { size: 18 })),
                react_1.default.createElement("div", { className: "advert-review-drawer__footer-actions" },
                    react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__button", onClick: handleClose }, "Cancel"),
                    react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__button advert-review-drawer__button--primary ".concat(canApprove ? "" : "is-disabled").trim(), disabled: isLoading, onClick: handleApprove },
                        react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 16 }),
                        "Approve Advert"))))))));
};
exports.AdvertReviewDrawer = AdvertReviewDrawer;
//# sourceMappingURL=AdvertReviewDrawer.js.map