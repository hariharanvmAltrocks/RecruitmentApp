"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDocument = void 0;
var tslib_1 = require("tslib");
// ReviewDocument.tsx — conditions moved to config
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var getCandidateDetails_1 = require("./Hooks/getCandidateDetails");
var lucide_react_1 = require("lucide-react");
var ReviewDocumentInner_1 = require("./Component/ReviewDocumentInner");
var loading_1 = tslib_1.__importDefault(require("../../../Comman/Loading/loading"));
var ModalPopup_1 = tslib_1.__importDefault(require("../../../Comman/ModalPopup/ModalPopup"));
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var useConsultOption_1 = require("./Hooks/useConsultOption");
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
var ReviewDocument = function (props) {
    var drawerOpen = props.drawerOpen, selectedJobId = props.selectedJobId, CandidateID = props.CandidateID, selectedcandidateID = props.selectedcandidateID, jobrequestID = props.jobrequestID, IsExpat = props.IsExpat, onClose = props.onClose;
    var _a = (0, getCandidateDetails_1.useCandidatDetails)(selectedJobId, CandidateID, selectedcandidateID, jobrequestID, IsExpat), positionDetails = _a.data, positionLoading = _a.loading;
    var CONSULT_OPTIONS = (0, useConsultOption_1.useConsultOption)().data;
    var _b = (0, react_1.useState)(false), pageloading = _b[0], setPageLoading = _b[1];
    var _c = (0, useModalPopup_1.useModalPopup)(), modalState = _c.modalState, showModal = _c.showModal, closeModal = _c.closeModal;
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, drawerOpen && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "review-document" },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "review-document__backdrop", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }),
            react_1.default.createElement(framer_motion_1.motion.div, { className: "review-document__panel", initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                    duration: 0.3,
                } }, positionLoading || !positionDetails ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "review-document__header" },
                    react_1.default.createElement("div", { className: "review-document__header-left" },
                        react_1.default.createElement("div", { className: "review-document__header-icon" },
                            react_1.default.createElement(lucide_react_1.FileCheck, { size: 22 })),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("h2", { className: "review-document__title" },
                                react_1.default.createElement(SkeletonBlock, { width: "220px" })),
                            react_1.default.createElement("div", { className: "review-document__meta" },
                                react_1.default.createElement(SkeletonBlock, { width: "160px" })))),
                    react_1.default.createElement("div", { className: "review-document__header-right", style: { display: "flex", alignItems: "center", gap: "12px" } },
                        react_1.default.createElement("button", { type: "button", className: "review-document__close", onClick: onClose },
                            react_1.default.createElement(lucide_react_1.X, { size: 18 })))),
                react_1.default.createElement("div", { className: "review-document__content" },
                    react_1.default.createElement(PositionSkeleton, null)))) : (react_1.default.createElement(ReviewDocumentInner_1.ReviewDocumentInner, tslib_1.__assign({}, props, { positionDetails: positionDetails, pageloading: pageloading, setPageLoading: setPageLoading, ConsultOptions: CONSULT_OPTIONS !== null && CONSULT_OPTIONS !== void 0 ? CONSULT_OPTIONS : [], showModal: showModal, closeModal: closeModal }))))),
        pageloading && react_1.default.createElement(loading_1.default, null),
        react_1.default.createElement(ModalPopup_1.default, tslib_1.__assign({}, modalState, { onClose: closeModal }))))));
};
exports.ReviewDocument = ReviewDocument;
//# sourceMappingURL=ReviewDocument.js.map