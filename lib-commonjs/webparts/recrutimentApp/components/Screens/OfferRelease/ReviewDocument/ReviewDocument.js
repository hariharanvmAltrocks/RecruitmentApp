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
var fetchPreChecklist_1 = require("./Hooks/fetchPreChecklist");
var Prechecklist_1 = tslib_1.__importDefault(require("./Component/Prechecklist/Prechecklist"));
var loading_1 = tslib_1.__importDefault(require("../../../Comman/Loading/loading"));
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
    var _b, _c, _d, _e;
    var drawerOpen = _a.drawerOpen, selectedJobId = _a.selectedJobId, CandidateID = _a.CandidateID, selectedcandidateID = _a.selectedcandidateID, jobrequestID = _a.jobrequestID, IsExpat = _a.IsExpat, loadingState = _a.loadingState, onClose = _a.onClose, setLoadingState = _a.setLoadingState, refreshKey = _a.refreshKey;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _f = (0, useModalPopup_1.useModalPopup)(), modalState = _f.modalState, showModal = _f.showModal, closeModal = _f.closeModal;
    // ── Full-page loader (blocks entire panel during API call) ──────────────────
    var _g = (0, react_1.useState)(false), pageloading = _g[0], setPageLoading = _g[1];
    // ── Which button is currently active (drives per-button spinner icon) ───────
    // Unlike isSubmittingRef, this IS a state so React re-renders and shows spinner
    var _h = (0, react_1.useState)(null), activeButton = _h[0], setActiveButton = _h[1];
    // True when ANY button is submitting — used to disable all buttons at once
    var isAnySubmitting = activeButton !== null;
    var _j = (0, useReviewDocumentManage_1.useStateOfferRelease)(), consentVerification = _j.consentVerification, consentFile = _j.consentFile, showConsentErrors = _j.showConsentErrors, handleConsentVerification = _j.handleConsentVerification, handleConsentFile = _j.handleConsentFile, coiState = _j.coiState, handleCoiChange = _j.handleCoiChange, fileInputRef = _j.fileInputRef, selectedFile = _j.selectedFile, isReading = _j.isReading, handleUploadClick = _j.handleUploadClick, handleFileChange = _j.handleFileChange, clearFile = _j.clearFile, uploadDocs = _j.uploadDocs, handleDocumnetUpload = _j.handleDocumnetUpload, reviewerComments = _j.reviewerComments, acknowledgementCheckbox = _j.acknowledgementCheckbox, onCommentsChange = _j.onCommentsChange, onToggleAcknowledgement = _j.onToggleAcknowledgement, validateAll = _j.validateAll, validationError = _j.validationError;
    var _k = (0, react_1.useState)(false), showComments = _k[0], setshowComments = _k[1];
    var _l = (0, getCandidateDetails_1.useCandidatDetails)(selectedJobId, CandidateID, selectedcandidateID, jobrequestID, IsExpat), positionDetails = _l.data, positionLoading = _l.loading;
    var isPendingDOTAfrica = (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) === Config_1.StatusId.PendingDOTAficaVerification;
    var _m = (0, useStatusDetails_1.useBGVStatusDetails)(jobrequestID, isPendingDOTAfrica), bgvStatusDetails = _m.data, bgvStatus = _m.bgvStatus, bgvStatusLoading = _m.loading, bgvComments = _m.bgvComments, allCompleted = _m.allCompleted, rejectFlag = _m.rejectFlag, revertFLag = _m.revertFLag;
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
    var _o = (0, Usesubmitworkflow_1.useSubmitWorkflow)(submitDeps), SubmitLoading = _o.isLoading, SubmitModalState = _o.modalState, SubmitCloseModal = _o.closeModal, submit = _o.submit;
    var docData = (0, Userequireddocuments_1.useRequiredDocuments)((_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.ProfileID) !== null && _b !== void 0 ? _b : "", (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobRequestID) !== null && _c !== void 0 ? _c : "").data;
    var _p = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _p.data, signatureLoading = _p.loading;
    var isExpat = (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.NationalityCode) !== ConditionConfig_1.NationalityCode.Nationals;
    var isPreOnboarding = (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) === Config_1.StatusId.PendingHRpreonboardingchecklist;
    var _q = (0, fetchPreChecklist_1.usePreChecklist)(isExpat, (_d = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.PreChecklist) !== null && _d !== void 0 ? _d : undefined, isPreOnboarding), checklist = _q.checklist, allChecked = _q.allChecked, loading = _q.loading, updateCheckItem = _q.updateCheckItem;
    var isLoading = signatureLoading;
    var isPageLoading = positionLoading || signatureLoading || bgvStatusLoading;
    (0, react_1.useEffect)(function () {
        if (loadingState !== isLoading)
            setLoadingState(isLoading);
    }, [isLoading, loadingState, setLoadingState]);
    var _r = (0, Usereviewconditions_1.useReviewConditions)({
        statusID: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID,
        empCat: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.EmploymentCategory,
        consentVerification: consentVerification,
        hasDetails: !!positionDetails,
        rejectFlag: !!rejectFlag,
        revertFlag: !!revertFLag,
    }), is = _r.is, vis = _r.vis;
    var headerMeta = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        return ({
            title: (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTiltle) !== null && _a !== void 0 ? _a : "",
            code: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _b !== void 0 ? _b : "",
            department: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Department) !== null && _c !== void 0 ? _c : "",
        });
    }, [positionDetails]);
    // ─── Helpers ─────────────────────────────────────────────────────────────────
    var handleError = (0, react_1.useCallback)(function () {
        showModal({
            type: "error",
            title: "Something Went Wrong",
            message: "An unexpected error occurred. Please try again.",
            confirmLabel: "Close",
            onConfirm: closeModal,
        });
    }, [showModal, closeModal]);
    var ensureValid = (0, react_1.useCallback)(function () {
        if (!validateAll(vis)) {
            showModal({
                type: "warning",
                title: "Required Fields Missing",
                message: "Please complete all highlighted fields before submitting.",
                confirmLabel: "OK",
                onConfirm: closeModal,
            });
            return false;
        }
        return true;
    }, [validateAll, vis, showModal, closeModal]);
    var getCheckStatus = function (title) {
        var _a;
        return ((_a = checklist.find(function (item) { return item.Title === title; })) === null || _a === void 0 ? void 0 : _a.value)
            ? ConditionConfig_1.ActionName.Completed
            : ConditionConfig_1.ActionName.Pending;
    };
    var showSuccessModal = (0, react_1.useCallback)(function (msg) {
        showModal({
            type: "success",
            title: "Submitted Successfully",
            message: msg,
            confirmLabel: "Go to Dashboard",
            onConfirm: function () {
                closeModal();
                onClose();
                navigate("/Dashboard");
                refreshKey();
            },
        });
    }, [showModal, closeModal, onClose, navigate, refreshKey]);
    // ─── Render button content ────────────────────────────────────────────────────
    // Shows spinner icon when THIS specific button is active, normal icon otherwise
    var renderBtnContent = function (text, buttonKey, loadingText) {
        if (loadingText === void 0) { loadingText = "Sending..."; }
        var isThisButtonLoading = activeButton === buttonKey;
        return isThisButtonLoading ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(lucide_react_1.Loader2, { size: 16, className: "modal-popup__spinner" }),
            loadingText)) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(lucide_react_1.Send, { size: 16 }),
            text));
    };
    // ─── handleReinitiate ─────────────────────────────────────────────────────────
    // Loader: pageloading=true → API → pageloading=false
    // Button: activeButton="reinitiate" shows spinner on Re Initiate button only
    var handleReinitiate = (0, react_1.useCallback)(function () {
        showModal({
            type: "confirmation",
            title: "Reinitiate BGV",
            message: ConditionConfig_1.RecuritmentHRMsg.ReinitiateBGVWarningMsg,
            confirmLabel: "Yes",
            cancelLabel: "No",
            onConfirm: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var UpdateBGV, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setActiveButton("reinitiate"); // ✅ Show spinner on Re Initiate button
                            setPageLoading(true); // ✅ Show full-page loader
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, ServiceExport_1.OfferServices.PerformCriminalRecordCheck(Number(jobrequestID))];
                        case 2:
                            UpdateBGV = _b.sent();
                            if (UpdateBGV.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                                showSuccessModal(ConditionConfig_1.RecuritmentHRMsg.ReinitiateBGVProcess);
                            }
                            else {
                                handleError();
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            _a = _b.sent();
                            handleError();
                            return [3 /*break*/, 5];
                        case 4:
                            setActiveButton(null); // ✅ Remove button spinner
                            setPageLoading(false); // ✅ Hide full-page loader
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
        });
    }, [jobrequestID, showSuccessModal, handleError, showModal]);
    // ─── handleApprove ────────────────────────────────────────────────────────────
    // Loader: pageloading=true → API → pageloading=false
    // Button: activeButton="approve" shows spinner on Submit/Reviewed/Revert button
    var handleApprove = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var action, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ensureValid())
                        return [2 /*return*/];
                    if (isAnySubmitting)
                        return [2 /*return*/]; // Guard: prevent double-click
                    setActiveButton("approve"); // ✅ Show spinner on approve button
                    setPageLoading(true); // ✅ Show full-page loader
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    action = consentVerification === "verified"
                        ? ConditionConfig_1.ButtonAction.Review
                        : consentVerification === "rejected"
                            ? ConditionConfig_1.ButtonAction.Revert
                            : ConditionConfig_1.ButtonAction.Initiated;
                    return [4 /*yield*/, submit(action)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    handleError();
                    return [3 /*break*/, 5];
                case 4:
                    setActiveButton(null); // ✅ Remove button spinner
                    setPageLoading(false); // ✅ Hide full-page loader
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [ensureValid, consentVerification, submit, handleError, isAnySubmitting]);
    // ─── handleRejectCheck ────────────────────────────────────────────────────────
    // Loader: pageloading=true → API inside modal confirm → pageloading=false
    // Button: activeButton="rejectCheck" shows spinner on Approve/Reject button
    var handleRejectCheck = (0, react_1.useCallback)(function (btn) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isExpat, workflowStatus, isReject, config;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            if (!ensureValid())
                return [2 /*return*/];
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
                                setActiveButton("rejectCheck"); // ✅ Show spinner on Approve/Reject button
                                setPageLoading(true); // ✅ Show full-page loader
                                _e.label = 1;
                            case 1:
                                _e.trys.push([1, 4, 5, 6]);
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
                            case 2:
                                _e.sent();
                                return [4 /*yield*/, ServiceExport_1.OfferServices.UpdateStatusSelectedHOD([
                                        { ID: selectedcandidateID, StatusId: config.statusId },
                                    ])];
                            case 3:
                                response = _e.sent();
                                if (response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                                    closeModal();
                                    showSuccessModal(ConditionConfig_1.RecuritmentHRMsg.ReinitiateBGVProcess);
                                    onClose();
                                    refreshKey();
                                }
                                else {
                                    throw new Error("Unexpected status");
                                }
                                return [3 /*break*/, 6];
                            case 4:
                                _a = _e.sent();
                                handleError();
                                return [3 /*break*/, 6];
                            case 5:
                                setActiveButton(null); // ✅ Remove button spinner
                                setPageLoading(false); // ✅ Hide full-page loader
                                return [7 /*endfinally*/];
                            case 6: return [2 /*return*/];
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
        refreshKey,
        showSuccessModal,
        ensureValid,
        handleError,
    ]);
    // ─── handleSaveAsDraft ────────────────────────────────────────────────────────
    // Loader: pageloading=true → API → pageloading=false
    // Button: activeButton="saveAsDraft" shows spinner on Save As Draft / Submit button
    var handleSaveAsDraft = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var BtnAction, ChecklistValue, UpdateStatusCandidateList, Obj, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    BtnAction = !allChecked
                        ? ConditionConfig_1.ButtonAction.SaveAsDraft
                        : ConditionConfig_1.ButtonAction.Submit;
                    if (BtnAction === ConditionConfig_1.ButtonAction.Submit) {
                        if (!ensureValid())
                            return [2 /*return*/];
                    }
                    setActiveButton("saveAsDraft"); // ✅ Show spinner on Save As Draft / Submit button
                    setPageLoading(true); // ✅ Show full-page loader
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    ChecklistValue = {
                        BackgroundChecks: getCheckStatus("Background Checks"),
                        SignedOfferLetterVerified: getCheckStatus("Signed Offer Letter"),
                        SignedEmploymentContract: getCheckStatus("Employment Contract"),
                        WorkPermitApproved: getCheckStatus("Work Permit Approved"),
                        VisaProcess: getCheckStatus("Visa Process"),
                        AccommodationBooked: getCheckStatus("Accommodation Booked"),
                        TravelProcess: getCheckStatus("Travel Process"),
                        ReadyforOnboarding: getCheckStatus("Ready for Onboarding"),
                        MedicalChecks: getCheckStatus("Medical Checks"),
                        ID: CandidateID,
                    };
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UpdateStatusCandidatelist(ChecklistValue)];
                case 2:
                    UpdateStatusCandidateList = _b.sent();
                    if (!(UpdateStatusCandidateList.status === ApiConfig_1.ResponeStatus.SUCCESS)) return [3 /*break*/, 5];
                    if (!(BtnAction === ConditionConfig_1.ButtonAction.Submit)) return [3 /*break*/, 4];
                    Obj = [
                        {
                            ID: selectedcandidateID,
                            StatusId: isExpat
                                ? Config_1.StatusId.OnboardingProcessinitiatedforExpat
                                : Config_1.StatusId.OnboardingProcessinitiatedforDRC,
                        },
                    ];
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UpdateStatusSelectedHOD(Obj)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    showSuccessModal(BtnAction === ConditionConfig_1.ButtonAction.SaveAsDraft
                        ? ConditionConfig_1.RecuritmentHRMsg.ChecklistSaveAsDraftMsg
                        : ConditionConfig_1.RecuritmentHRMsg.OnboardingMsg);
                    return [3 /*break*/, 6];
                case 5:
                    handleError();
                    _b.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    _a = _b.sent();
                    handleError();
                    return [3 /*break*/, 9];
                case 8:
                    setActiveButton(null); // ✅ Remove button spinner
                    setPageLoading(false); // ✅ Hide full-page loader
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); }, [
        allChecked,
        ensureValid,
        CandidateID,
        selectedcandidateID,
        isExpat,
        showSuccessModal,
        handleError,
        checklist,
    ]);
    // ─── JSX ─────────────────────────────────────────────────────────────────────
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
                    vis.showConsentForm && (react_1.default.createElement(consentform_1.default, { onFileChange: handleConsentFile, downloadUrl: (_e = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DotAfricaCF) === null || _e === void 0 ? void 0 : _e.downloadUrl, disabled: isAnySubmitting, hasFileError: validationError.showConsentErrors, consentform: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.DotAfricaCF })),
                    vis.showCOICard && (react_1.default.createElement(Coicard_1.default, { consultOptions: CONSULT_OPTIONS, isReadOnly: isAnySubmitting, hasError: validationError.showCoiErrors, onChange: handleCoiChange })),
                    vis.showWorkPermitUpload && (react_1.default.createElement(Workpermituploadbox_1.WorkPermitUploadBox, { fileInputRef: fileInputRef, selectedFile: selectedFile, isReading: isReading, hasFileError: validationError.workPermit, disabled: isAnySubmitting, onUploadClick: handleUploadClick, onFileChange: handleFileChange, onClearFile: clearFile })),
                    vis.showUploadDocument && (react_1.default.createElement(UploadDocument_1.UploadDocument, { multiple: false, acceptedFormats: ".pdf", label: vis.uploadDocLabel, required: true, onChange: handleDocumnetUpload, disabled: isAnySubmitting, hasError: validationError.uploadError })),
                    (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) ===
                        Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement(Prechecklist_1.default, { nationalItems: checklist, expatItems: [], isExpat: isExpat, onToggle: function (id, value) {
                            return updateCheckItem(id, value);
                        }, allChecked: allChecked })),
                    !vis.ViewFlag && (react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement, disabled: isAnySubmitting, commentError: validationError.comments, checkboxError: validationError.acknowledgement, acknowledgementLabel: ConditionConfig_1.CheckboxContent.PostRecrutimentCheckboxContent })),
                    allChecked &&
                        (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) ===
                            Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement, disabled: isAnySubmitting, commentError: validationError.comments, checkboxError: validationError.acknowledgement })),
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
                            (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) ===
                                Config_1.StatusId.PendingDOTAficaVerification && (react_1.default.createElement(react_1.default.Fragment, null,
                                revertFLag && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isAnySubmitting, onClick: handleReinitiate }, renderBtnContent("Re Initiate", "reinitiate", "Processing..."))),
                                rejectFlag && coiState.wishesToProceed && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isAnySubmitting, onClick: function () {
                                        return handleRejectCheck(coiState.wishesToProceed === "Yes"
                                            ? "Approve"
                                            : "Reject");
                                    } }, renderBtnContent(coiState.wishesToProceed === "Yes"
                                    ? "Approve"
                                    : "Reject", "rejectCheck", coiState.wishesToProceed === "Yes"
                                    ? "Approving..."
                                    : "Rejecting..."))))),
                            (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) ===
                                Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isAnySubmitting, onClick: handleSaveAsDraft }, renderBtnContent(!allChecked ? "Save As Draft" : "Submit", "saveAsDraft", !allChecked ? "Saving..." : "Submitting..."))),
                            !vis.ViewFlag &&
                                (positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.StatusID) !=
                                    Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isAnySubmitting, onClick: handleApprove }, renderBtnContent(consentVerification === "verified"
                                ? "Reviewed"
                                : consentVerification === "rejected"
                                    ? "Revert"
                                    : "Submit", "approve", consentVerification === "verified"
                                ? "Reviewing..."
                                : consentVerification === "rejected"
                                    ? "Reverting..."
                                    : "Submitting...")))))))))),
        pageloading && react_1.default.createElement(loading_1.default, null),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal })),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, SubmitModalState, { onClose: SubmitCloseModal })),
        react_1.default.createElement(commentsPopup_1.ViewCommentsModal, { isOpen: showComments, onClose: function () { return setshowComments(false); }, comments: bgvComments, title: "View BGV Comments", isLoading: false })))));
};
exports.ReviewDocument = ReviewDocument;
//# sourceMappingURL=ReviewDocument.js.map