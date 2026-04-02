"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDocument = void 0;
var tslib_1 = require("tslib");
// ReviewDocument.tsx — fixed, optimized, COI card integrated
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var getSignatureDetails_1 = require("../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails");
require("./ReviewDocument.scss");
var ReviewCommentSignature_1 = require("../../RecruitmentTable/Components/ReviewCommentSignature");
var UploadDocument_1 = require("../../RecruitmentTable/Components/UploadDocument");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var react_router_dom_1 = require("react-router-dom");
var ModalPopup_1 = require("../../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var PositionFrame_1 = require("./PositionFrame");
var getCandidateDetails_1 = require("./Hooks/getCandidateDetails");
var Userequireddocuments_1 = require("./Hooks/Userequireddocuments");
var Config_1 = require("../../../../utilities/Config");
var CandidateDocumentsRepository_1 = tslib_1.__importDefault(require("../Component/CandidateDocumentsRepository"));
var useReviewDocumentManage_1 = require("./StateManage/useReviewDocumentManage");
var ResueComponent_1 = require("./Component/ResueComponent");
var consentform_1 = tslib_1.__importDefault(require("./Component/ConsentForm/consentform"));
var Coicard_1 = tslib_1.__importDefault(require("./Component/Coicard/Coicard"));
var Statusbadge_1 = tslib_1.__importDefault(require("../../../Comman/Statusbadge/Statusbadge"));
var useStatusDetails_1 = require("./Hooks/useStatusDetails");
var Usesubmitworkflow_1 = require("./saveHooks/Usesubmitworkflow");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "review-document__skeleton", style: { width: width, height: height } }));
};
var CONSULT_OPTIONS = [
    { value: "hr-manager", label: "HR Manager" },
    { value: "legal", label: "Legal Department" },
    { value: "line-manager", label: "Line Manager" },
    { value: "ceo", label: "CEO / Executive" },
];
var ReviewDocument = function (_a) {
    var _b, _c, _d;
    var drawerOpen = _a.drawerOpen, selectedJobId = _a.selectedJobId, CandidateID = _a.CandidateID, selectedcandidateID = _a.selectedcandidateID, jobrequestID = _a.jobrequestID, reviewerComments = _a.reviewerComments, acknowledgementCheckbox = _a.acknowledgementCheckbox, loadingState = _a.loadingState, onClose = _a.onClose, onCommentsChange = _a.onCommentsChange, onToggleAcknowledgement = _a.onToggleAcknowledgement, setLoadingState = _a.setLoadingState, refreshKey = _a.refreshKey;
    var metricId = (0, UIStateContext_1.useUIState)().MatricID;
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _e = (0, useModalPopup_1.useModalPopup)(), modalState = _e.modalState, showModal = _e.showModal, closeModal = _e.closeModal;
    var _f = (0, react_1.useState)([]), uploadDocs = _f[0], setUploadDocs = _f[1];
    var _g = (0, useReviewDocumentManage_1.useStateOfferRelease)(), consentVerification = _g.consentVerification, consentFile = _g.consentFile, showConsentErrors = _g.showConsentErrors, handleConsentVerification = _g.handleConsentVerification, handleConsentFile = _g.handleConsentFile, coiState = _g.coiState, showCoiErrors = _g.showCoiErrors, handleCoiChange = _g.handleCoiChange, validateAll = _g.validateAll;
    var _h = (0, getCandidateDetails_1.useCandidatDetails)(selectedJobId, CandidateID, selectedcandidateID, jobrequestID), positionDetails = _h.data, positionLoading = _h.loading;
    var _j = (0, useStatusDetails_1.useBGVStatusDetails)(jobrequestID), bgvStatusDetails = _j.data, bgvStatusLoading = _j.loading, allCompleted = _j.allCompleted, rejectFlag = _j.rejectFlag;
    var data = {
        data: positionDetails,
        uploadDocs: uploadDocs,
        BGVerifiedStatus: bgvStatusDetails,
        rejectflag: rejectFlag,
    };
    var _k = (0, Usesubmitworkflow_1.useSubmitWorkflow)(data), SubmitLoading = _k.isLoading, SubmitModalState = _k.modalState, SubmitCloseModal = _k.closeModal, submit = _k.submit;
    var docData = (0, Userequireddocuments_1.useRequiredDocuments)((_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ProfileID) !== null && _b !== void 0 ? _b : "", (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobRequestID) !== null && _c !== void 0 ? _c : "").data;
    var _l = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _l.data, signatureLoading = _l.loading;
    var isLoading = signatureLoading;
    var isSubmittingRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (loadingState !== isLoading)
            setLoadingState(isLoading);
    }, [isLoading, loadingState, setLoadingState]);
    var headerMeta = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        return ({
            title: (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTiltle) !== null && _a !== void 0 ? _a : "",
            code: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _b !== void 0 ? _b : "",
            department: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Department) !== null && _c !== void 0 ? _c : "",
        });
    }, [positionDetails]);
    var showUploadONEM = ((positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) === Config_1.StatusId.PendingHROfferInitiate &&
        (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.EmploymentCategory) === "KCSA") ||
        (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) === Config_1.StatusId.WorkPermitAcknowledgedContractUploaded ||
        (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) === Config_1.StatusId.PendingFinancePaymentReview ||
        (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) === Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract;
    var showSuccessModal = (0, react_1.useCallback)(function (msg) {
        showModal({
            type: "success",
            title: "Submitted Successfully",
            message: msg,
            confirmLabel: "Go to Dashboard",
            onConfirm: function () {
                closeModal();
                onClose();
                navigate("/RecruitmentTable");
                refreshKey();
            },
        });
    }, [showModal, closeModal, onClose, navigate, refreshKey]);
    var handleApprove = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isValid;
        return tslib_1.__generator(this, function (_a) {
            isValid = validateAll();
            if (!isValid) {
                showModal({
                    type: "warning",
                    title: "Required Fields Missing",
                    message: "Please complete all highlighted fields before submitting.",
                    confirmLabel: "OK",
                    onConfirm: closeModal,
                });
                return [2 /*return*/];
            }
            if (isSubmittingRef.current)
                return [2 /*return*/];
            isSubmittingRef.current = true;
            try {
                submit(ConditionConfig_1.ButtonAction.Initiated);
                showSuccessModal("Your review has been submitted successfully.");
            }
            catch (error) {
                console.error(error);
                showModal({
                    type: "error",
                    title: "Something Went Wrong",
                    message: "An unexpected error occurred. Please try again.",
                    confirmLabel: "Close",
                    onConfirm: closeModal,
                });
            }
            finally {
                isSubmittingRef.current = false;
            }
            return [2 /*return*/];
        });
    }); }, [validateAll, showModal, closeModal, showSuccessModal]);
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, drawerOpen && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "review-document" },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "review-document__backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }),
            react_1.default.createElement(framer_motion_1.motion.div, { className: "review-document__panel", initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 25, stiffness: 200 } },
                react_1.default.createElement("div", { className: "review-document__header" },
                    react_1.default.createElement("div", { className: "review-document__header-left" },
                        react_1.default.createElement("div", { className: "review-document__header-icon" },
                            react_1.default.createElement(lucide_react_1.FileCheck, { size: 22 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h2", { className: "review-document__title" }, isLoading
                                ? react_1.default.createElement(SkeletonBlock, { width: "220px" })
                                : headerMeta.title),
                            react_1.default.createElement("div", { className: "review-document__meta" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "160px" })) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("span", { className: "review-document__badge" }, headerMeta.code),
                                react_1.default.createElement("span", { className: "review-document__dot" }),
                                react_1.default.createElement("span", { className: "review-document__meta-text" }, headerMeta.department)))))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(Statusbadge_1.default, { steps: bgvStatusDetails !== null && bgvStatusDetails !== void 0 ? bgvStatusDetails : [] })),
                    react_1.default.createElement("button", { type: "button", className: "review-document__close", onClick: onClose },
                        react_1.default.createElement(lucide_react_1.X, { size: 18 }))),
                react_1.default.createElement("div", { className: "review-document__content" },
                    react_1.default.createElement(PositionFrame_1.PositionFrame, { positionDetails: positionDetails, isLoading: positionLoading, headerCode: headerMeta.code }),
                    positionDetails && (react_1.default.createElement(CandidateDocumentsRepository_1.default, { data: docData !== null && docData !== void 0 ? docData : null })),
                    react_1.default.createElement(ResueComponent_1.VerificationToggle, { value: consentVerification, onChange: handleConsentVerification, hasError: showConsentErrors && consentVerification === null }),
                    react_1.default.createElement(consentform_1.default, { onFileChange: handleConsentFile, downloadUrl: (_d = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DotAfricaCF) === null || _d === void 0 ? void 0 : _d.downloadUrl, disabled: isSubmittingRef.current, hasFileError: showConsentErrors && consentFile === null, consentform: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DotAfricaCF }),
                    react_1.default.createElement(Coicard_1.default, { consultOptions: CONSULT_OPTIONS, isReadOnly: isSubmittingRef.current, hasError: showCoiErrors, onChange: handleCoiChange }),
                    react_1.default.createElement(UploadDocument_1.UploadDocument, { multiple: false, acceptedFormats: ".pdf", label: "Draft ONEM AdvertDoc French (Only PDF)", required: true, onChange: function (files) {
                            setUploadDocs(files);
                        }, disabled: isSubmittingRef.current }),
                    react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement, disabled: isSubmittingRef.current }),
                    react_1.default.createElement("div", { className: "review-document__footer" },
                        react_1.default.createElement("div", { className: "review-document__footer-actions" },
                            react_1.default.createElement("button", { type: "button", className: "review-document__button", onClick: onClose }, "Cancel"),
                            react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isSubmittingRef.current, onClick: handleApprove }, isSubmittingRef.current ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.Loader2, { size: 16, className: "modal-popup__spinner" }),
                                "Sending...")) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.Send, { size: 16, style: { marginRight: 8 } }),
                                "Submit")))))))),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal })),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, SubmitModalState, { onClose: SubmitCloseModal }))))));
};
exports.ReviewDocument = ReviewDocument;
//# sourceMappingURL=ReviewDocument.js.map