"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDocument = void 0;
var tslib_1 = require("tslib");
// ReviewDocument.tsx — conditions moved to config
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var getSignatureDetails_1 = require("../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails");
require("./ReviewDocument.scss");
var ReviewCommentSignature_1 = require("../../RecruitmentTable/Components/ReviewCommentSignature");
var UploadDocument_1 = require("../../RecruitmentTable/Components/UploadDocument");
var react_router_dom_1 = require("react-router-dom");
var ModalPopup_1 = require("../../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var PositionFrame_1 = require("./PositionFrame");
var getCandidateDetails_1 = require("./Hooks/getCandidateDetails");
var Userequireddocuments_1 = require("./Hooks/Userequireddocuments");
var CandidateDocumentsRepository_1 = tslib_1.__importDefault(require("../Component/CandidateDocumentsRepository"));
var useReviewDocumentManage_1 = require("./StateManage/useReviewDocumentManage");
var ResueComponent_1 = require("./Component/ResueComponent");
var consentform_1 = tslib_1.__importDefault(require("./Component/ConsentForm/consentform"));
var Coicard_1 = tslib_1.__importDefault(require("./Component/Coicard/Coicard"));
var Statusbadge_1 = tslib_1.__importDefault(require("../../../Comman/Statusbadge/Statusbadge"));
var useStatusDetails_1 = require("./Hooks/useStatusDetails");
var Usesubmitworkflow_1 = require("./saveHooks/Usesubmitworkflow");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var Usereviewconditions_1 = require("./Hooks/ConditionalHooks/Usereviewconditions");
var Workpermituploadbox_1 = require("./Component/Workpermituploadbox/Workpermituploadbox");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var commentsPopup_1 = require("../../../Comman/CommentsPopup/commentsPopup");
var Config_1 = require("../../../../utilities/Config");
var WorkflowConfig_1 = require("../../../Hooks/WorkflowConfig");
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return react_1.default.createElement("div", { className: "review-document__skeleton", style: { width: width, height: height } });
};
var PositionSkeleton = function () { return (react_1.default.createElement("div", { className: "review-document__skeleton-wrapper" },
    react_1.default.createElement(SkeletonBlock, { height: "24px", width: "250px" }),
    react_1.default.createElement(SkeletonBlock, { height: "14px", width: "180px" }),
    react_1.default.createElement("div", { style: { marginTop: 16 } },
        react_1.default.createElement(SkeletonBlock, { height: "100px" })),
    react_1.default.createElement("div", { style: { marginTop: 16 } },
        react_1.default.createElement(SkeletonBlock, { height: "60px" })),
    react_1.default.createElement("div", { style: { marginTop: 16 } },
        react_1.default.createElement(SkeletonBlock, { height: "40px" })))); };
var CONSULT_OPTIONS = [
    { value: "hr-manager", label: "Louis Barend Van Wyk" },
    { value: "legal", label: "Evodie Mushiya Kadima" },
];
var ReviewDocument = function (_a) {
    var _b, _c, _d;
    var drawerOpen = _a.drawerOpen, selectedJobId = _a.selectedJobId, CandidateID = _a.CandidateID, selectedcandidateID = _a.selectedcandidateID, jobrequestID = _a.jobrequestID, loadingState = _a.loadingState, onClose = _a.onClose, setLoadingState = _a.setLoadingState, refreshKey = _a.refreshKey;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _e = (0, useModalPopup_1.useModalPopup)(), modalState = _e.modalState, showModal = _e.showModal, closeModal = _e.closeModal;
    var _f = (0, useReviewDocumentManage_1.useStateOfferRelease)(), consentVerification = _f.consentVerification, consentFile = _f.consentFile, showConsentErrors = _f.showConsentErrors, handleConsentVerification = _f.handleConsentVerification, handleConsentFile = _f.handleConsentFile, coiState = _f.coiState, handleCoiChange = _f.handleCoiChange, fileInputRef = _f.fileInputRef, selectedFile = _f.selectedFile, isReading = _f.isReading, handleUploadClick = _f.handleUploadClick, handleFileChange = _f.handleFileChange, clearFile = _f.clearFile, uploadDocs = _f.uploadDocs, handleDocumnetUpload = _f.handleDocumnetUpload, reviewerComments = _f.reviewerComments, acknowledgementCheckbox = _f.acknowledgementCheckbox, onCommentsChange = _f.onCommentsChange, onToggleAcknowledgement = _f.onToggleAcknowledgement, validateAll = _f.validateAll, validationError = _f.validationError;
    var _g = (0, react_1.useState)(false), showComments = _g[0], setshowComments = _g[1];
    var _h = (0, getCandidateDetails_1.useCandidatDetails)(selectedJobId, CandidateID, selectedcandidateID, jobrequestID), positionDetails = _h.data, positionLoading = _h.loading;
    var _j = (0, useStatusDetails_1.useBGVStatusDetails)(jobrequestID), bgvStatusDetails = _j.data, bgvStatus = _j.bgvStatus, bgvStatusLoading = _j.loading, bgvComments = _j.bgvComments, allCompleted = _j.allCompleted, rejectFlag = _j.rejectFlag, revertFLag = _j.revertFLag;
    var isConsentVerified = consentVerification === "verified";
    var submitDeps = {
        data: positionDetails,
        uploadDocs: uploadDocs,
        BGVerifiedStatus: bgvStatusDetails,
        rejectflag: rejectFlag,
        consentFile: consentFile,
        coiState: coiState,
        consentVerification: isConsentVerified,
        reviewerComments: reviewerComments,
    };
    var _k = (0, Usesubmitworkflow_1.useSubmitWorkflow)(submitDeps), SubmitLoading = _k.isLoading, SubmitModalState = _k.modalState, SubmitCloseModal = _k.closeModal, submit = _k.submit;
    var docData = (0, Userequireddocuments_1.useRequiredDocuments)((_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ProfileID) !== null && _b !== void 0 ? _b : "", (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobRequestID) !== null && _c !== void 0 ? _c : "").data;
    var _l = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _l.data, signatureLoading = _l.loading;
    var isLoading = signatureLoading;
    var isSubmittingRef = (0, react_1.useRef)(false);
    var isPageLoading = positionLoading || signatureLoading || bgvStatusLoading;
    var ConsultOptions = [];
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        var fetchEmails = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (loadingState !== isLoading)
                    setLoadingState(isLoading);
                return [2 /*return*/];
            });
        }); };
        fetchEmails();
        return function () {
            isMounted = false;
        };
    }, [isLoading, positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.BusinessUnitCodeId]);
    var _m = (0, Usereviewconditions_1.useReviewConditions)({
        statusID: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID,
        empCat: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.EmploymentCategory,
        consentVerification: consentVerification,
        hasDetails: !!positionDetails,
        rejectFlag: !!rejectFlag,
        revertFlag: !!revertFLag,
    }), is = _m.is, vis = _m.vis;
    var headerMeta = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        return ({
            title: (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTiltle) !== null && _a !== void 0 ? _a : "",
            code: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _b !== void 0 ? _b : "",
            department: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Department) !== null && _c !== void 0 ? _c : "",
        });
    }, [positionDetails]);
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
    var handleReinitiate = (0, react_1.useCallback)(function () {
        showModal({
            type: "confirmation",
            title: "Reinitiate BGV",
            message: ConditionConfig_1.RecuritmentHRMsg.ReinitiateBGVWarningMsg,
            confirmLabel: "Yes",
            cancelLabel: "No",
            onConfirm: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var UpdateBGV;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ServiceExport_1.OfferServices.PerformCriminalRecordCheck(Number(jobrequestID))];
                        case 1:
                            UpdateBGV = _a.sent();
                            if (UpdateBGV.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                                showSuccessModal(ConditionConfig_1.RecuritmentHRMsg.ReinitiateBGVProcess);
                                closeModal();
                                onClose();
                                navigate("/RecruitmentTable");
                                refreshKey();
                            }
                            else {
                                showModal({
                                    type: "error",
                                    title: "Something Went Wrong",
                                    message: "An unexpected error occurred. Please try again.",
                                    confirmLabel: "Close",
                                    onConfirm: closeModal,
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            }); },
        });
    }, []);
    var handleApprove = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isValid, action;
        return tslib_1.__generator(this, function (_a) {
            isValid = validateAll(vis);
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
                action = consentVerification === "verified"
                    ? ConditionConfig_1.ButtonAction.Review
                    : consentVerification === "rejected"
                        ? ConditionConfig_1.ButtonAction.Revert
                        : ConditionConfig_1.ButtonAction.Initiated;
                void submit(action);
                // showSuccessModal("Your review has been submitted successfully.");
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
    }); }, [validateAll, showModal, closeModal, showSuccessModal, submit]);
    var handleRejectCheck = (0, react_1.useCallback)(function (btn) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isValid, isExpat, workflowStatus, isReject, config;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            isValid = validateAll(vis);
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
            isExpat = (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NationalityCode) !== ConditionConfig_1.NationalityCode.Nationals;
            workflowStatus = (0, WorkflowConfig_1.WorkflowHODConfig)((_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) !== null && _a !== void 0 ? _a : 0, false, isExpat, positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.EmploymentCategory);
            isReject = btn === "Reject";
            config = {
                title: isReject ? "Reject BGV" : "Approve BGV",
                message: isReject
                    ? ConditionConfig_1.RecuritmentHRMsg.RejectBGVCheckMsg
                    : ConditionConfig_1.RecuritmentHRMsg.ApprvedBGVCheckMsg,
                statusId: isReject
                    ? Config_1.StatusId.BackgroundCheckVerificationFailed
                    : workflowStatus,
            };
            showModal({
                type: "confirmation",
                title: config.title,
                message: config.message,
                confirmLabel: "Yes",
                cancelLabel: "No",
                onCancel: closeModal,
                onConfirm: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var bgvDocData, response, _a;
                    var _b, _c, _d;
                    return tslib_1.__generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _e.trys.push([0, 3, , 4]);
                                bgvDocData = (0, Usesubmitworkflow_1.makeDocData)((_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ProfileID) !== null && _b !== void 0 ? _b : "", (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobRequestID) !== null && _c !== void 0 ? _c : "", ConditionConfig_1.DocumentFolderName.BGVProofOfDocument);
                                return [4 /*yield*/, Promise.all([
                                        ServiceExport_1.OfferServices.UploadCandidateDocument(bgvDocData, coiState.attachment),
                                        ServiceExport_1.OfferServices.InsertRecruitmentCandidateDetails({
                                            ID: CandidateID,
                                            BackgroundChecksResults: (_d = JSON.stringify(bgvStatusDetails)) !== null && _d !== void 0 ? _d : [],
                                            BGVConsultedWith: coiState.consultedWith,
                                            BGVComments: coiState.comments,
                                        }),
                                    ])];
                            case 1:
                                _e.sent();
                                return [4 /*yield*/, ServiceExport_1.OfferServices.UpdateStatusSelectedHOD([
                                        { ID: selectedcandidateID, StatusId: config.statusId },
                                    ])];
                            case 2:
                                response = _e.sent();
                                if (response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                                    closeModal();
                                    showSuccessModal(ConditionConfig_1.RecuritmentHRMsg.ReinitiateBGVProcess);
                                    onClose();
                                    // navigate("/RecruitmentTable");
                                    refreshKey();
                                }
                                else {
                                    throw new Error("Unexpected status");
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                _a = _e.sent();
                                showModal({
                                    type: "error",
                                    title: "Something Went Wrong",
                                    message: "An unexpected error occurred. Please try again.",
                                    confirmLabel: "Close",
                                    onConfirm: closeModal,
                                });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); },
            });
            return [2 /*return*/];
        });
    }); }, [
        positionDetails,
        coiState,
        bgvStatusDetails,
        CandidateID,
        selectedcandidateID,
        showModal,
        closeModal,
        onClose,
        navigate,
        refreshKey,
        showSuccessModal,
    ]);
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, drawerOpen && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "review-document" },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "review-document__backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }),
            react_1.default.createElement(framer_motion_1.motion.div, { className: "review-document__panel", initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                    duration: 0.3,
                } },
                react_1.default.createElement("div", { className: "review-document__header" },
                    react_1.default.createElement("div", { className: "review-document__header-left" },
                        react_1.default.createElement("div", { className: "review-document__header-icon" },
                            react_1.default.createElement(lucide_react_1.FileCheck, { size: 22 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h2", { className: "review-document__title" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "220px" })) : (headerMeta.title)),
                            react_1.default.createElement("div", { className: "review-document__meta" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "160px" })) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("span", { className: "review-document__badge" }, headerMeta.code),
                                react_1.default.createElement("span", { className: "review-document__dot" }),
                                react_1.default.createElement("span", { className: "review-document__meta-text" }, headerMeta.department)))))),
                    vis.showDOTAficaBadge && (react_1.default.createElement("div", { className: "review-document__header-right" },
                        react_1.default.createElement(Statusbadge_1.default, { steps: bgvStatus !== null && bgvStatus !== void 0 ? bgvStatus : [] }))),
                    react_1.default.createElement("button", { type: "button", className: "review-document__close", onClick: onClose },
                        react_1.default.createElement(lucide_react_1.X, { size: 18 }))),
                react_1.default.createElement("div", { className: "review-document__content" }, isPageLoading ? (react_1.default.createElement(PositionSkeleton, null)) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(PositionFrame_1.PositionFrame, { positionDetails: positionDetails, isLoading: positionLoading, headerCode: headerMeta.code }),
                    vis.showCandidateDocs && (react_1.default.createElement(CandidateDocumentsRepository_1.default, { data: docData !== null && docData !== void 0 ? docData : null })),
                    vis.showVerificationToggle && (react_1.default.createElement(ResueComponent_1.VerificationToggle, { value: consentVerification, onChange: handleConsentVerification, hasError: validationError.verification })),
                    vis.showConsentForm && (react_1.default.createElement(consentform_1.default, { onFileChange: handleConsentFile, downloadUrl: (_d = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DotAfricaCF) === null || _d === void 0 ? void 0 : _d.downloadUrl, disabled: isSubmittingRef.current, hasFileError: validationError.showConsentErrors, consentform: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DotAfricaCF })),
                    vis.showCOICard && (react_1.default.createElement(Coicard_1.default, { consultOptions: CONSULT_OPTIONS, isReadOnly: isSubmittingRef.current, hasError: validationError.showCoiErrors, onChange: handleCoiChange })),
                    vis.showWorkPermitUpload && (react_1.default.createElement(Workpermituploadbox_1.WorkPermitUploadBox, { fileInputRef: fileInputRef, selectedFile: selectedFile, isReading: isReading, hasFileError: validationError.workPermit, disabled: isSubmittingRef.current, onUploadClick: handleUploadClick, onFileChange: handleFileChange, onClearFile: clearFile })),
                    vis.showUploadDocument && (react_1.default.createElement(UploadDocument_1.UploadDocument, { multiple: false, acceptedFormats: ".pdf", label: vis.uploadDocLabel, required: true, onChange: handleDocumnetUpload, disabled: isSubmittingRef.current, hasError: validationError.uploadError })),
                    !vis.ViewFlag && (react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement, disabled: isSubmittingRef.current, commentError: validationError.comments, checkboxError: validationError.acknowledgement })),
                    bgvComments.length > 0 &&
                        (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) ===
                            Config_1.StatusId.PendingDOTAficaVerification && (react_1.default.createElement("div", { className: "review-documnet__BGVCommentBtn" },
                        react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", onClick: function () { return setshowComments(true); } }, "View BGV Comments"))),
                    react_1.default.createElement("div", { className: "review-document__footer" },
                        react_1.default.createElement("div", { className: "review-document__footer-actions" },
                            react_1.default.createElement("button", { type: "button", className: "review-document__button", onClick: onClose }, vis.ViewFlag
                                ? "Back"
                                : revertFLag || rejectFlag
                                    ? "Back"
                                    : "Cancel"),
                            revertFLag && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isSubmittingRef.current, onClick: handleReinitiate }, "Re Initiate")),
                            rejectFlag &&
                                coiState.wishesToProceed &&
                                (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) ===
                                    Config_1.StatusId.PendingDOTAficaVerification && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isSubmittingRef.current, onClick: function () {
                                    return handleRejectCheck(coiState.wishesToProceed === "Yes"
                                        ? "Approve"
                                        : "Reject");
                                } }, coiState.wishesToProceed === "Yes"
                                ? "Approve"
                                : "Reject")),
                            !vis.ViewFlag && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isSubmittingRef.current, onClick: handleApprove }, isSubmittingRef.current ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.Loader2, { size: 16, className: "modal-popup__spinner" }),
                                "Sending...")) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.Send, { size: 16 }),
                                consentVerification === "verified"
                                    ? "Reviewed"
                                    : consentVerification === "rejected"
                                        ? "Revert"
                                        : "Submit"))))))))))),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal })),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, SubmitModalState, { onClose: SubmitCloseModal })),
        react_1.default.createElement(commentsPopup_1.ViewCommentsModal, { isOpen: showComments, onClose: function () { return setshowComments(false); }, comments: bgvComments, title: "View BGV Comments", isLoading: false })))));
};
exports.ReviewDocument = ReviewDocument;
//# sourceMappingURL=ReviewDocument.js.map