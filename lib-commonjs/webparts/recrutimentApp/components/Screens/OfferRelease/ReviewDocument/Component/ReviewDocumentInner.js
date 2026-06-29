"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDocumentInner = void 0;
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_1 = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var RecrutimentAppWebPartStrings_1 = tslib_1.__importDefault(require("RecrutimentAppWebPartStrings"));
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../../utilities/ApiConfig");
var ConditionConfig_1 = require("../../../../../utilities/ConditionConfig");
var commentsPopup_1 = require("../../../../Comman/CommentsPopup/commentsPopup");
var Statusbadge_1 = tslib_1.__importDefault(require("../../../../Comman/Statusbadge/Statusbadge"));
var WorkflowConfig_1 = require("../../../../Hooks/WorkflowConfig");
var getSignatureDetails_1 = require("../../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails");
var ReviewCommentSignature_1 = require("../../../RecruitmentTable/Components/ReviewCommentSignature");
var Usereviewconditions_1 = require("../Hooks/ConditionalHooks/Usereviewconditions");
var fetchPreChecklist_1 = require("../Hooks/fetchPreChecklist");
var Userequireddocuments_1 = require("../Hooks/Userequireddocuments");
var useStatusDetails_1 = require("../Hooks/useStatusDetails");
var PositionFrame_1 = require("../PositionFrame");
var Usesubmitworkflow_1 = require("../saveHooks/Usesubmitworkflow");
var useReviewDocumentManage_1 = require("../StateManage/useReviewDocumentManage");
var Coicard_1 = tslib_1.__importDefault(require("./Coicard/Coicard"));
var consentform_1 = tslib_1.__importDefault(require("./ConsentForm/consentform"));
var Prechecklist_1 = tslib_1.__importDefault(require("./Prechecklist/Prechecklist"));
var ResueComponent_1 = require("./ResueComponent");
var Workpermituploadbox_1 = require("./Workpermituploadbox/Workpermituploadbox");
require("../ReviewDocument.scss");
var CandidateRoadmap_1 = require("./CandidateRoadmap");
var UploadDocument_1 = require("../../../RecruitmentTable/Components/UploadDocument");
var CandidateDocumentsRepository_1 = tslib_1.__importDefault(require("../../Component/CandidateDocumentsRepository"));
var OfferrelaeseNational_1 = require("./OfferrelaeseNational/OfferrelaeseNational");
var Config_1 = require("../../../../../utilities/Config");
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
    { value: "hr-manager", label: RecrutimentAppWebPartStrings_1.default.LouisBarendVanWyk },
    { value: "legal", label: RecrutimentAppWebPartStrings_1.default.EvodieMushiyaKadima },
];
var ReviewDocumentInner = function (_a) {
    var _b, _c, _d, _e, _f;
    var selectedJobId = _a.selectedJobId, CandidateID = _a.CandidateID, selectedcandidateID = _a.selectedcandidateID, jobrequestID = _a.jobrequestID, IsExpat = _a.IsExpat, loadingState = _a.loadingState, onClose = _a.onClose, setLoadingState = _a.setLoadingState, refreshKey = _a.refreshKey, positionDetails = _a.positionDetails, pageloading = _a.pageloading, setPageLoading = _a.setPageLoading, showModal = _a.showModal, closeModal = _a.closeModal;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _g = (0, react_1.useState)(null), activeButton = _g[0], setActiveButton = _g[1];
    var isAnySubmitting = activeButton !== null;
    var _h = (0, react_1.useState)(false), showRoadmap = _h[0], setShowRoadmap = _h[1];
    var _j = (0, useReviewDocumentManage_1.useStateOfferRelease)(), consentVerification = _j.consentVerification, consentFile = _j.consentFile, showConsentErrors = _j.showConsentErrors, handleConsentVerification = _j.handleConsentVerification, handleConsentFile = _j.handleConsentFile, coiState = _j.coiState, handleCoiChange = _j.handleCoiChange, fileInputRef = _j.fileInputRef, selectedFile = _j.selectedFile, isReading = _j.isReading, handleUploadClick = _j.handleUploadClick, handleFileChange = _j.handleFileChange, clearFile = _j.clearFile, uploadDocs = _j.uploadDocs, handleDocumnetUpload = _j.handleDocumnetUpload, reviewerComments = _j.reviewerComments, acknowledgementCheckbox = _j.acknowledgementCheckbox, onCommentsChange = _j.onCommentsChange, onToggleAcknowledgement = _j.onToggleAcknowledgement, validateAll = _j.validateAll, validationError = _j.validationError, 
    // National Offer Release & PPE
    nationalOfferReleased = _j.nationalOfferReleased, 
    // nationalOfferAccepted,
    nationalNoticePeriod = _j.nationalNoticePeriod, nationalJoiningDate = _j.nationalJoiningDate, nationalPantsSize = _j.nationalPantsSize, nationalTopSize = _j.nationalTopSize, nationalShoesSize = _j.nationalShoesSize, nationalContractReleased = _j.nationalContractReleased, 
    // nationalContractAccepted,
    setNationalOfferReleased = _j.setNationalOfferReleased, 
    // setNationalOfferAccepted,
    setNationalNoticePeriod = _j.setNationalNoticePeriod, setNationalJoiningDate = _j.setNationalJoiningDate, setNationalPantsSize = _j.setNationalPantsSize, setNationalTopSize = _j.setNationalTopSize, setNationalShoesSize = _j.setNationalShoesSize, setNationalContractReleased = _j.setNationalContractReleased;
    var _k = (0, react_1.useState)(false), showComments = _k[0], setshowComments = _k[1];
    var isPendingDOTAfrica = positionDetails.StatusID === Config_1.StatusId.PendingDOTAficaVerification;
    var _l = (0, useStatusDetails_1.useBGVStatusDetails)(jobrequestID, selectedcandidateID !== null && selectedcandidateID !== void 0 ? selectedcandidateID : 0, CandidateID !== null && CandidateID !== void 0 ? CandidateID : 0, isPendingDOTAfrica), bgvStatusDetails = _l.data, bgvStatus = _l.bgvStatus, bgvStatusLoading = _l.loading, bgvComments = _l.bgvComments, allCompleted = _l.allCompleted, rejectFlag = _l.rejectFlag, revertFLag = _l.revertFLag;
    var isConsentVerified = consentVerification === "verified";
    var docData = (0, Userequireddocuments_1.useRequiredDocuments)((_b = positionDetails.ProfileID) !== null && _b !== void 0 ? _b : "", (_c = positionDetails.JobRequestID) !== null && _c !== void 0 ? _c : "").data;
    var submitDeps = {
        data: positionDetails,
        BGVerifiedStatus: (_d = docData === null || docData === void 0 ? void 0 : docData.categories) !== null && _d !== void 0 ? _d : [],
        rejectflag: rejectFlag,
        consentFile: consentFile,
        coiState: coiState,
        consentVerification: isConsentVerified,
        reviewerComments: reviewerComments,
        uploadDocs: uploadDocs,
        selectedFile: selectedFile,
        showModal: showModal,
        closeModal: closeModal,
        onClose: onClose,
        refreshKey: refreshKey,
        // National Offer Release & PPE
        nationalOfferReleased: nationalOfferReleased,
        // nationalOfferAccepted,
        nationalNoticePeriod: nationalNoticePeriod,
        nationalJoiningDate: nationalJoiningDate,
        nationalPantsSize: nationalPantsSize,
        nationalTopSize: nationalTopSize,
        nationalShoesSize: nationalShoesSize,
        nationalContractReleased: nationalContractReleased,
        // nationalContractAccepted,
    };
    var _m = (0, Usesubmitworkflow_1.useSubmitWorkflow)(submitDeps), SubmitLoading = _m.isLoading, submit = _m.submit;
    var _o = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _o.data, signatureLoading = _o.loading;
    var isExpat = positionDetails.NationalityCode !== ConditionConfig_1.NationalityCode.Nationals;
    var isPreOnboarding = positionDetails.StatusID === Config_1.StatusId.PendingHRpreonboardingchecklist;
    var _p = (0, fetchPreChecklist_1.usePreChecklist)(isExpat, (_e = positionDetails.PreChecklist) !== null && _e !== void 0 ? _e : undefined, isPreOnboarding), checklist = _p.checklist, allChecked = _p.allChecked, loading = _p.loading, updateCheckItem = _p.updateCheckItem;
    var handleChecklistToggle = (0, react_1.useCallback)(function (id, value) {
        updateCheckItem(id, value);
    }, [updateCheckItem]);
    var isLoading = signatureLoading;
    var isPageLoading = signatureLoading || bgvStatusLoading;
    (0, react_1.useEffect)(function () {
        if (loadingState !== isLoading)
            setLoadingState(isLoading);
    }, [isLoading, loadingState, setLoadingState]);
    var _q = (0, Usereviewconditions_1.useReviewConditions)({
        statusID: positionDetails.StatusID,
        empCat: positionDetails.EmploymentCategory,
        consentVerification: consentVerification,
        hasDetails: !!positionDetails,
        rejectFlag: !!rejectFlag,
        revertFlag: !!revertFLag,
        isExpat: isExpat,
    }), is = _q.is, vis = _q.vis;
    var headerMeta = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        return ({
            title: (_a = positionDetails.JobTiltle) !== null && _a !== void 0 ? _a : "",
            code: (_b = positionDetails.JobCode) !== null && _b !== void 0 ? _b : "",
            department: (_c = positionDetails.Department) !== null && _c !== void 0 ? _c : "",
        });
    }, [positionDetails]);
    var handleError = (0, react_1.useCallback)(function () {
        showModal({
            type: "error",
            title: RecrutimentAppWebPartStrings_1.default.SomethingWentWrong,
            message: RecrutimentAppWebPartStrings_1.default.AnUnexpectedErrorOccurredPleaseTryAgain,
            confirmLabel: "Close",
            onConfirm: closeModal,
        });
    }, [showModal, closeModal]);
    var ensureValid = (0, react_1.useCallback)(function () {
        if (!validateAll(vis)) {
            showModal({
                type: "warning",
                title: RecrutimentAppWebPartStrings_1.default.RequiredFieldsMissing,
                message: RecrutimentAppWebPartStrings_1.default.PleaseCompleteAllHighlightedFieldsBefore,
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
            title: RecrutimentAppWebPartStrings_1.default.SubmittedSuccessfully,
            message: msg,
            confirmLabel: "OK",
            onConfirm: function () {
                closeModal();
                onClose();
                navigate("/MyTracker");
                refreshKey();
            },
        });
    }, [showModal, closeModal, onClose, navigate, refreshKey]);
    var renderBtnContent = function (text, buttonKey, loadingText) {
        if (loadingText === void 0) { loadingText = "Sending..."; }
        var isThisButtonLoading = activeButton === buttonKey;
        return isThisButtonLoading ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(lucide_react_1.Loader2, { size: 16, className: "modal-popup__spinner" }),
            loadingText)) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(lucide_react_1.Send, { size: 16 }),
            text));
    };
    var handleReinitiate = (0, react_1.useCallback)(function () {
        showModal({
            type: "confirmation",
            title: RecrutimentAppWebPartStrings_1.default.ReinitiateBgv,
            message: ConditionConfig_1.RecuritmentHRMsg.ReinitiateBGVWarningMsg,
            confirmLabel: "Yes",
            cancelLabel: "No",
            onConfirm: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var UpdateBGV, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setActiveButton("reinitiate");
                            setPageLoading(true);
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
                            setActiveButton(null);
                            setPageLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); },
        });
    }, [jobrequestID, showSuccessModal, handleError, showModal]);
    var handleApprove = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var action, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ensureValid())
                        return [2 /*return*/];
                    if (isAnySubmitting)
                        return [2 /*return*/];
                    setActiveButton("approve");
                    setPageLoading(true);
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
                    setActiveButton(null);
                    setPageLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [ensureValid, consentVerification, submit, handleError, isAnySubmitting]);
    var handleRejectCheck = (0, react_1.useCallback)(function (btn) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var workflowStatus, isReject, config;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            if (!ensureValid())
                return [2 /*return*/];
            workflowStatus = (0, WorkflowConfig_1.WorkflowHODConfig)((_a = positionDetails.StatusID) !== null && _a !== void 0 ? _a : 0, false, isExpat, positionDetails.EmploymentCategory);
            isReject = btn === "Reject";
            config = {
                title: isReject ? RecrutimentAppWebPartStrings_1.default.RejectBgv : RecrutimentAppWebPartStrings_1.default.ApproveBgv,
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
                                setActiveButton("rejectCheck");
                                setPageLoading(true);
                                _e.label = 1;
                            case 1:
                                _e.trys.push([1, 4, 5, 6]);
                                bgvDocData = (0, Usesubmitworkflow_1.makeDocData)((_b = positionDetails.ProfileID) !== null && _b !== void 0 ? _b : "", (_c = positionDetails.JobRequestID) !== null && _c !== void 0 ? _c : "", ConditionConfig_1.DocumentFolderName.BGVProofOfDocument);
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
                                    throw new Error(RecrutimentAppWebPartStrings_1.default.UnexpectedStatus);
                                }
                                return [3 /*break*/, 6];
                            case 4:
                                _a = _e.sent();
                                handleError();
                                return [3 /*break*/, 6];
                            case 5:
                                setActiveButton(null);
                                setPageLoading(false);
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
        isExpat,
    ]);
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
                    setActiveButton("saveAsDraft");
                    setPageLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    ChecklistValue = {
                        BackgroundChecks: getCheckStatus(RecrutimentAppWebPartStrings_1.default.BackgroundChecks),
                        SignedOfferLetterVerified: getCheckStatus(RecrutimentAppWebPartStrings_1.default.SignedOfferLetter),
                        SignedEmploymentContract: getCheckStatus(RecrutimentAppWebPartStrings_1.default.EmploymentContract),
                        WorkPermitApproved: getCheckStatus(RecrutimentAppWebPartStrings_1.default.WorkPermitApproved),
                        VisaProcess: getCheckStatus(RecrutimentAppWebPartStrings_1.default.VisaProcess),
                        AccommodationBooked: getCheckStatus(RecrutimentAppWebPartStrings_1.default.AccommodationBooked),
                        TravelProcess: getCheckStatus(RecrutimentAppWebPartStrings_1.default.TravelProcess),
                        ReadyforOnboarding: getCheckStatus(RecrutimentAppWebPartStrings_1.default.ReadyForOnboarding),
                        MedicalChecks: getCheckStatus(RecrutimentAppWebPartStrings_1.default.MedicalChecks),
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
                    setActiveButton(null);
                    setPageLoading(false);
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
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "review-document__header" },
            react_1.default.createElement("div", { className: "review-document__header-left" },
                react_1.default.createElement("div", { className: "review-document__header-icon" },
                    react_1.default.createElement(lucide_react_1.FileCheck, { size: 22 })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h2", { className: "review-document__title" }, headerMeta.title),
                    react_1.default.createElement("div", { className: "review-document__meta" },
                        react_1.default.createElement("span", { className: "review-document__badge" }, headerMeta.code),
                        react_1.default.createElement("span", { className: "review-document__dot" }),
                        react_1.default.createElement("span", { className: "review-document__meta-text" }, headerMeta.department)))),
            vis.showDOTAficaBadge && (react_1.default.createElement("div", { className: "review-document__header-right" },
                react_1.default.createElement(Statusbadge_1.default, { steps: bgvStatus !== null && bgvStatus !== void 0 ? bgvStatus : [] }))),
            react_1.default.createElement("div", { className: "review-document__header-right", style: { display: "flex", alignItems: "center", gap: "12px" } },
                react_1.default.createElement("button", { onClick: function () { return setShowRoadmap(!showRoadmap); }, className: "review-document__toggle-btn ".concat(showRoadmap ? "review-document__toggle-btn--active" : "review-document__toggle-btn--inactive") },
                    react_1.default.createElement(lucide_react_1.Network, { size: 14 }),
                    RecrutimentAppWebPartStrings_1.default.CandidateStatus,
                    react_1.default.createElement(lucide_react_1.ChevronRight, { size: 14, className: "review-document__toggle-icon" })),
                react_1.default.createElement("button", { type: "button", className: "review-document__close", onClick: onClose },
                    react_1.default.createElement(lucide_react_1.X, { size: 18 })))),
        react_1.default.createElement("div", { className: "review-document__content" }, isPageLoading ? (react_1.default.createElement(PositionSkeleton, null)) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(framer_motion_1.AnimatePresence, null, showRoadmap && (react_1.default.createElement(framer_motion_1.motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.4, ease: "easeInOut" } },
                react_1.default.createElement("div", { className: "advert-roadmap-wrapper" },
                    react_1.default.createElement("div", { className: "advert-roadmap__header-top" },
                        react_1.default.createElement("h3", { className: "advert-roadmap__header-title" },
                            react_1.default.createElement("div", { className: "advert-roadmap__header-title-bar" }),
                            RecrutimentAppWebPartStrings_1.default.CandidateLifecycleRoadmap)),
                    react_1.default.createElement(CandidateRoadmap_1.CandidateRoadmap, { statusId: positionDetails.StatusID, Nationality: positionDetails.NationalityCode }))))),
            react_1.default.createElement(PositionFrame_1.PositionFrame, { positionDetails: positionDetails, isLoading: false, headerCode: headerMeta.code }),
            vis.showCandidateDocs && (react_1.default.createElement(CandidateDocumentsRepository_1.default, { data: docData !== null && docData !== void 0 ? docData : null })),
            vis.showVerificationToggle && (react_1.default.createElement(ResueComponent_1.VerificationToggle, { value: consentVerification, onChange: handleConsentVerification, hasError: validationError.verification })),
            vis.showConsentForm && (react_1.default.createElement(consentform_1.default, { onFileChange: handleConsentFile, downloadUrl: (_f = positionDetails.DotAfricaCF) === null || _f === void 0 ? void 0 : _f.downloadUrl, disabled: isAnySubmitting, hasFileError: validationError.showConsentErrors, consentform: positionDetails.DotAfricaCF })),
            vis.showCOICard && (react_1.default.createElement(Coicard_1.default, { consultOptions: CONSULT_OPTIONS, isReadOnly: isAnySubmitting, hasError: validationError.showCoiErrors, onChange: handleCoiChange })),
            vis.showWorkPermitUpload && (react_1.default.createElement(Workpermituploadbox_1.WorkPermitUploadBox, { fileInputRef: fileInputRef, selectedFile: selectedFile, isReading: isReading, hasFileError: validationError.workPermit, disabled: isAnySubmitting, onUploadClick: handleUploadClick, onFileChange: handleFileChange, onClearFile: clearFile })),
            vis.NationalOfferLetter && (react_1.default.createElement(OfferrelaeseNational_1.OfferrelaeseNational, { offerReleased: nationalOfferReleased, 
                // offerAccepted={nationalOfferAccepted}
                noticePeriod: nationalNoticePeriod, joiningDate: nationalJoiningDate, pantsSize: nationalPantsSize, topSize: nationalTopSize, shoesSize: nationalShoesSize, contractReleased: nationalContractReleased, 
                // contractAccepted={nationalContractAccepted}
                validationError: validationError, isReadOnly: isAnySubmitting, StatusID: positionDetails.StatusID, onChangeOfferReleased: setNationalOfferReleased, 
                // onChangeOfferAccepted={setNationalOfferAccepted}
                onChangeNoticePeriod: setNationalNoticePeriod, onChangeJoiningDate: setNationalJoiningDate, onChangePantsSize: setNationalPantsSize, onChangeTopSize: setNationalTopSize, onChangeShoesSize: setNationalShoesSize, onChangeContractReleased: setNationalContractReleased })),
            vis.showUploadDocument && (react_1.default.createElement(UploadDocument_1.UploadDocument, { multiple: false, acceptedFormats: ".pdf", label: vis.uploadDocLabel, required: true, onChange: handleDocumnetUpload, disabled: isAnySubmitting, hasError: validationError.uploadError })),
            positionDetails.StatusID ===
                Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement(Prechecklist_1.default, { nationalItems: checklist, expatItems: [], isExpat: isExpat, onToggle: handleChecklistToggle, allChecked: allChecked })),
            !vis.ViewFlag &&
                positionDetails.StatusID !=
                    Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement, disabled: isAnySubmitting, commentError: validationError.comments, checkboxError: validationError.acknowledgement, acknowledgementLabel: ConditionConfig_1.CheckboxContent.PostRecrutimentCheckboxContent })),
            allChecked &&
                positionDetails.StatusID ===
                    Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement, disabled: isAnySubmitting, commentError: validationError.comments, checkboxError: validationError.acknowledgement })),
            bgvComments.length > 0 &&
                positionDetails.StatusID ===
                    Config_1.StatusId.PendingDOTAficaVerification && (react_1.default.createElement("div", { className: "review-documnet__BGVCommentBtn" },
                react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", onClick: function () { return setshowComments(true); } }, RecrutimentAppWebPartStrings_1.default.ViewBgvComments))),
            react_1.default.createElement("div", { className: "review-document__footer" },
                react_1.default.createElement("div", { className: "review-document__footer-actions" },
                    react_1.default.createElement("button", { type: "button", className: "review-document__button", onClick: onClose }, vis.ViewFlag
                        ? "Back"
                        : revertFLag || rejectFlag
                            ? "Back"
                            : "Cancel"),
                    positionDetails.StatusID ===
                        Config_1.StatusId.PendingDOTAficaVerification && (react_1.default.createElement(react_1.default.Fragment, null,
                        revertFLag && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isAnySubmitting, onClick: handleReinitiate }, renderBtnContent(RecrutimentAppWebPartStrings_1.default.ReInitiate, "reinitiate", "Processing..."))),
                        rejectFlag && coiState.wishesToProceed && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isAnySubmitting, onClick: function () {
                                return handleRejectCheck(coiState.wishesToProceed === "Yes"
                                    ? "Approve"
                                    : "Reject");
                            } }, renderBtnContent(coiState.wishesToProceed === "Yes"
                            ? "Approve"
                            : "Reject", "rejectCheck", coiState.wishesToProceed === "Yes"
                            ? "Approving..."
                            : "Rejecting..."))))),
                    positionDetails.StatusID ===
                        Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isAnySubmitting, onClick: handleSaveAsDraft }, renderBtnContent(!allChecked ? RecrutimentAppWebPartStrings_1.default.SaveAsDraft : "Submit", "saveAsDraft", !allChecked ? "Saving..." : "Submitting..."))),
                    !vis.ViewFlag &&
                        positionDetails.StatusID !=
                            Config_1.StatusId.PendingHRpreonboardingchecklist && (react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary", disabled: isAnySubmitting, onClick: handleApprove }, renderBtnContent(consentVerification === "verified"
                        ? "Reviewed"
                        : consentVerification === "rejected"
                            ? "Revert"
                            : "Submit", "approve", consentVerification === "verified"
                        ? "Reviewing..."
                        : consentVerification === "rejected"
                            ? "Reverting..."
                            : "Submitting...")))))))),
        react_1.default.createElement(commentsPopup_1.ViewCommentsModal, { isOpen: showComments, onClose: function () { return setshowComments(false); }, comments: bgvComments, title: "View BGV Comments", isLoading: false })));
};
exports.ReviewDocumentInner = ReviewDocumentInner;
//# sourceMappingURL=ReviewDocumentInner.js.map