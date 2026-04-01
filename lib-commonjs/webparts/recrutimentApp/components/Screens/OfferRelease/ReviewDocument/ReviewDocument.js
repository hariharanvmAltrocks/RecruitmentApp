"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDocument = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var getSignatureDetails_1 = require("../../RecruitmentTable/AdvertReviewDrawer/Hooks/getSignatureDetails");
require("./ReviewDocument.scss");
var ReviewCommentSignature_1 = require("../../RecruitmentTable/Components/ReviewCommentSignature");
var UploadDocument_1 = require("../../RecruitmentTable/Components/UploadDocument");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var react_router_dom_1 = require("react-router-dom");
var ModalPopup_1 = require("../../../Comman/ModalPopup/ModalPopup");
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var PositionFrame_1 = require("./PositionFrame");
var getCandidateDetails_1 = require("./Hooks/getCandidateDetails");
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "review-document__skeleton", style: { width: width, height: height } }));
};
var toDocFiles = function (files) {
    return files.map(function (item) { return ({
        name: item.name,
        content: item.fileContent,
        type: "New",
    }); });
};
var ReviewDocument = function (_a) {
    var drawerOpen = _a.drawerOpen, selectedJobId = _a.selectedJobId, CandidateID = _a.CandidateID, selectedcandidateID = _a.selectedcandidateID, jobrequestID = _a.jobrequestID, reviewerComments = _a.reviewerComments, acknowledgementCheckbox = _a.acknowledgementCheckbox, loadingState = _a.loadingState, onClose = _a.onClose, onCommentsChange = _a.onCommentsChange, onToggleAcknowledgement = _a.onToggleAcknowledgement, setLoadingState = _a.setLoadingState, refreshKey = _a.refreshKey;
    var metricId = (0, UIStateContext_1.useUIState)().MatricID;
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, useModalPopup_1.useModalPopup)(), modalState = _b.modalState, showModal = _b.showModal, closeModal = _b.closeModal;
    var _c = (0, getCandidateDetails_1.useCandidatDetails)(selectedJobId, CandidateID, selectedcandidateID, jobrequestID), positionDetails = _c.data, positionLoading = _c.loading;
    var _d = (0, getSignatureDetails_1.useSignatureDetails)(), signatureDetails = _d.data, signatureLoading = _d.loading;
    var isLoading = signatureLoading;
    var _e = (0, react_1.useState)([]), uploadDocument = _e[0], setUploadDocument = _e[1];
    var showValidationRef = (0, react_1.useRef)(false);
    var isSubmittingRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (loadingState !== isLoading) {
            setLoadingState(isLoading);
        }
    }, [isLoading, loadingState, setLoadingState]);
    var headerMeta = (0, react_1.useMemo)(function () {
        var _a, _b, _c;
        return ({
            title: (_a = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobTiltle) !== null && _a !== void 0 ? _a : "",
            code: (_b = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.JobCode) !== null && _b !== void 0 ? _b : "",
            department: (_c = positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.Department) !== null && _c !== void 0 ? _c : "",
        });
    }, [positionDetails]);
    // const canApprove = useMemo(() => {
    //   const rules: { roles: number[]; validate: () => boolean }[] = [
    //     {
    //       roles: [RoleID.RecruitmentHR],
    //       validate: () => commentValid && uploadValid && checkboxValid,
    //     },
    //     {
    //       roles: [RoleID.HOD, RoleID.LineManager],
    //       validate: () => commentValid && checkboxValid,
    //     },
    //     {
    //       roles: [RoleID.RecruitmentHRLead],
    //       validate: () =>
    //         commentValid &&
    //         uploadValid &&
    //         checkboxValid &&
    //         (positionDetails?.Nationality === Nationality.Expatriate
    //           ? bgvValid
    //           : true),
    //     },
    //   ];
    //   return rules.some(
    //     (rule) =>
    //       rule.roles.some((role) => roleIDs.includes(role)) && rule.validate()
    //   );
    // }, [commentValid, uploadValid, checkboxValid, bgvValid, positionDetails?.Nationality, roleIDs]);
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
        return tslib_1.__generator(this, function (_a) {
            showValidationRef.current = true;
            return [2 /*return*/];
        });
    }); }, [
        roleIDs,
        metricId,
        showSuccessModal,
        showModal,
        closeModal,
    ]);
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, drawerOpen && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "review-document" },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "review-document__backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }),
            react_1.default.createElement(framer_motion_1.motion.div, { className: "review-document__panel", initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 25, stiffness: 200 } },
                react_1.default.createElement("div", { className: "review-document__header" },
                    react_1.default.createElement("div", { className: "review-document__header-left" },
                        react_1.default.createElement("div", { className: "review-document__header-icon" },
                            react_1.default.createElement(lucide_react_1.FileCheck, { size: 22 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h2", { className: "review-document__title" }, isLoading ? react_1.default.createElement(SkeletonBlock, { width: "220px" }) : headerMeta.title),
                            react_1.default.createElement("div", { className: "review-document__meta" }, isLoading ? (react_1.default.createElement(SkeletonBlock, { width: "160px" })) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement("span", { className: "review-document__badge" }, headerMeta.code),
                                react_1.default.createElement("span", { className: "review-document__dot" }),
                                react_1.default.createElement("span", { className: "review-document__meta-text" }, headerMeta.department)))))),
                    react_1.default.createElement("button", { type: "button", className: "review-document__close", onClick: onClose },
                        react_1.default.createElement(lucide_react_1.X, { size: 18 }))),
                react_1.default.createElement("div", { className: "review-document__content" },
                    react_1.default.createElement(PositionFrame_1.PositionFrame, { positionDetails: positionDetails, isLoading: isLoading, headerCode: headerMeta.code }),
                    react_1.default.createElement(UploadDocument_1.UploadDocument, { multiple: false, acceptedFormats: ".pdf", label: metricId === ConditionConfig_1.MatricID.UploadONEM
                            ? "ONEM Signed and Stamped Document (Only PDF)"
                            : "Draft ONEM AdvertDoc French (Only PDF)", required: true, onChange: setUploadDocument, 
                        // hasError={uploadError}
                        disabled: isSubmittingRef.current }),
                    react_1.default.createElement(ReviewCommentSignature_1.ReviewCommentSignature, { reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, signatureDetails: signatureDetails, isLoading: isLoading, onCommentsChange: onCommentsChange, onToggleAcknowledgement: onToggleAcknowledgement, 
                        // commentError={commentError}
                        // checkboxError={checkboxError}
                        disabled: isSubmittingRef.current }),
                    react_1.default.createElement("div", { className: "review-document__footer" },
                        react_1.default.createElement("div", { className: "review-document__footer-actions" },
                            react_1.default.createElement("button", { type: "button", className: "review-document__button", onClick: onClose }, "Cancel"),
                            react_1.default.createElement("button", { type: "button", className: "review-document__button review-document__button--primary" //{!canApprove ? "review-document__button review-document__button--primary__is-disabled" : "review-document__button review-document__button--primary"}
                                , 
                                // disabled={!canApprove || isSubmittingRef.current}
                                onClick: handleApprove }, isSubmittingRef.current ? (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.Loader2, { size: 16, className: "modal-popup__spinner" }),
                                "Sending...")) : (react_1.default.createElement(react_1.default.Fragment, null,
                                react_1.default.createElement(lucide_react_1.Send, { size: 16, style: { marginRight: 8 } }),
                                "Submit")))))))),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))))));
};
exports.ReviewDocument = ReviewDocument;
//# sourceMappingURL=ReviewDocument.js.map