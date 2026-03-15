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
var InfoField = function (_a) {
    var label = _a.label, value = _a.value, Icon = _a.icon;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__info-field" },
        react_1.default.createElement("div", { className: "advert-review-drawer__info-label" },
            Icon && react_1.default.createElement(Icon, { size: 12 }),
            react_1.default.createElement("span", null, label)),
        react_1.default.createElement("div", { className: "advert-review-drawer__info-value" }, value !== null && value !== void 0 ? value : "-")));
};
var SkeletonBlock = function (_a) {
    var _b = _a.width, width = _b === void 0 ? "100%" : _b, _c = _a.height, height = _c === void 0 ? "14px" : _c;
    return (react_1.default.createElement("div", { className: "advert-review-drawer__skeleton", style: { width: width, height: height } }));
};
var AdvertReviewDrawer = function (_a) {
    var _b;
    var drawerOpen = _a.drawerOpen, selectedJobId = _a.selectedJobId, advertLanguage = _a.advertLanguage, reviewerComments = _a.reviewerComments, acknowledgementCheckbox = _a.acknowledgementCheckbox, loadingState = _a.loadingState, onClose = _a.onClose, onLanguageChange = _a.onLanguageChange, onCommentsChange = _a.onCommentsChange, onToggleAcknowledgement = _a.onToggleAcknowledgement, setLoadingState = _a.setLoadingState;
    var _c = (0, getPositionDetails_1.usePositionDetails)(selectedJobId), positionDetails = _c.data, positionLoading = _c.loading;
    var _d = (0, getAdvertismentDetails_1.useAdvertismentDetails)(selectedJobId), advertDetails = _d.data, advertLoading = _d.loading;
    var _e = (0, getAttachmentDetails_1.useAttachmentDetails)(selectedJobId), attachments = _e.data, attachmentLoading = _e.loading;
    var _f = (0, getSignatureDetails_1.useSignatureDetails)(selectedJobId), signatureDetails = _f.data, signatureLoading = _f.loading;
    var isLoading = positionLoading || advertLoading || attachmentLoading || signatureLoading;
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
    var attachmentCards = (0, react_1.useMemo)(function () { return (attachments.map(function (doc, index) { return (react_1.default.createElement("div", { key: "".concat(doc.title, "-").concat(index), className: "advert-review-drawer__attachment-card" },
        react_1.default.createElement("div", { className: "advert-review-drawer__attachment-header" },
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-type advert-review-drawer__attachment-type--".concat(doc.type.toLowerCase()) },
                react_1.default.createElement(lucide_react_1.FileText, { size: 14 }),
                react_1.default.createElement("span", null, doc.type)),
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-meta" },
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-title", title: doc.title }, doc.title),
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-tag" }, "Recruitment"))),
        react_1.default.createElement("div", { className: "advert-review-drawer__attachment-body" }, doc.versions.map(function (version, idx) { return (react_1.default.createElement("div", { key: "".concat(version.lang, "-").concat(idx), className: "advert-review-drawer__attachment-version" },
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-lang advert-review-drawer__attachment-lang--".concat(version.lang.toLowerCase()) }, version.lang),
            react_1.default.createElement("div", { className: "advert-review-drawer__attachment-info" },
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-label" }, version.label),
                react_1.default.createElement("div", { className: "advert-review-drawer__attachment-size" }, version.size)),
            react_1.default.createElement(lucide_react_1.Download, { size: 12 }))); })))); })); }, [attachments]);
    var responsibilitiesList = (0, react_1.useMemo)(function () { return (advertContent === null || advertContent === void 0 ? void 0 : advertContent.responsibilities.map(function (item, index) { return (react_1.default.createElement("li", { key: "".concat(item, "-").concat(index), className: "advert-review-drawer__list-item" },
        react_1.default.createElement("span", { className: "advert-review-drawer__list-dot" }),
        item)); })); }, [advertContent]);
    var qualificationsList = (0, react_1.useMemo)(function () { return (advertContent === null || advertContent === void 0 ? void 0 : advertContent.qualifications.map(function (item, index) { return (react_1.default.createElement("li", { key: "".concat(item, "-").concat(index), className: "advert-review-drawer__list-item advert-review-drawer__list-item--muted" },
        react_1.default.createElement("span", { className: "advert-review-drawer__list-dot advert-review-drawer__list-dot--muted" }),
        item)); })); }, [advertContent]);
    var experienceList = (0, react_1.useMemo)(function () { return (advertContent === null || advertContent === void 0 ? void 0 : advertContent.experience.map(function (item, index) { return (react_1.default.createElement("li", { key: "".concat(item, "-").concat(index), className: "advert-review-drawer__list-item advert-review-drawer__list-item--muted" },
        react_1.default.createElement("span", { className: "advert-review-drawer__list-dot advert-review-drawer__list-dot--muted" }),
        item)); })); }, [advertContent]);
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
                react_1.default.createElement("section", { className: "advert-review-drawer__section advert-review-drawer__section--frame" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__section-header" },
                        react_1.default.createElement("h3", null,
                            react_1.default.createElement("span", { className: "advert-review-drawer__section-indicator" }),
                            "Position Framework"),
                        react_1.default.createElement("span", { className: "advert-review-drawer__ref" },
                            "REF: ",
                            headerMeta.code || "-")),
                    isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__grid" }, Array.from({ length: 8 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "skeleton-".concat(idx), className: "advert-review-drawer__info-field" },
                        react_1.default.createElement(SkeletonBlock, { width: "120px" }),
                        react_1.default.createElement(SkeletonBlock, { width: "180px" }))); }))) : (react_1.default.createElement("div", { className: "advert-review-drawer__group" },
                        react_1.default.createElement("h4", { className: "advert-review-drawer__group-title" },
                            react_1.default.createElement(lucide_react_1.Users, { size: 12 }),
                            "Organizational Alignment"),
                        react_1.default.createElement("div", { className: "advert-review-drawer__grid" },
                            react_1.default.createElement(InfoField, { label: "BU Code", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.buCode, icon: lucide_react_1.FileText }),
                            react_1.default.createElement(InfoField, { label: "BU Name", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.buName, icon: lucide_react_1.LayoutDashboard }),
                            react_1.default.createElement(InfoField, { label: "Department", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.department, icon: lucide_react_1.Users }),
                            react_1.default.createElement(InfoField, { label: "Sub Department", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.subDepartment, icon: lucide_react_1.ChevronRight }),
                            react_1.default.createElement(InfoField, { label: "Section", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.section, icon: lucide_react_1.ChevronRight }),
                            react_1.default.createElement(InfoField, { label: "Dept Code", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.deptCode, icon: lucide_react_1.FileText }),
                            react_1.default.createElement(InfoField, { label: "Reports To", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.reportsTo, icon: lucide_react_1.UserCheck }),
                            react_1.default.createElement(InfoField, { label: "Area of Work", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.areaOfWork, icon: lucide_react_1.Globe })),
                        react_1.default.createElement("div", { className: "advert-review-drawer__divider" }),
                        react_1.default.createElement("h4", { className: "advert-review-drawer__group-title" },
                            react_1.default.createElement(lucide_react_1.ClipboardList, { size: 12 }),
                            "Position Classification"),
                        react_1.default.createElement("div", { className: "advert-review-drawer__grid" },
                            react_1.default.createElement(InfoField, { label: "Nationality", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.nationality, icon: lucide_react_1.Globe }),
                            react_1.default.createElement(InfoField, { label: "Paterson Grade", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.patersonGrade, icon: lucide_react_1.Activity }),
                            react_1.default.createElement(InfoField, { label: "DRC Grade", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.drcGrade, icon: lucide_react_1.Activity }),
                            react_1.default.createElement(InfoField, { label: "Employment Category", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.employmentCategory, icon: lucide_react_1.UserCheck }),
                            react_1.default.createElement(InfoField, { label: "Type of Contract", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.contractType, icon: lucide_react_1.FileCheck }),
                            react_1.default.createElement(InfoField, { label: "No of Person(s)", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.numberOfPersons, icon: lucide_react_1.Users }),
                            react_1.default.createElement(InfoField, { label: "Date Required", value: positionDetails === null || positionDetails === void 0 ? void 0 : positionDetails.dateRequired, icon: lucide_react_1.Calendar }))))),
                react_1.default.createElement("div", { className: "advert-review-drawer__section advert-review-drawer__section--toggle" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__toggle-label" },
                        react_1.default.createElement(lucide_react_1.Globe, { size: 14 }),
                        "Advert Language"),
                    react_1.default.createElement("div", { className: "advert-review-drawer__toggle" },
                        react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__toggle-button ".concat(advertLanguage === "EN" ? "is-active" : "").trim(), onClick: function () { return onLanguageChange("EN"); } }, "English"),
                        react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__toggle-button ".concat(advertLanguage === "FR" ? "is-active" : "").trim(), onClick: function () { return onLanguageChange("FR"); } }, "French"))),
                react_1.default.createElement("section", { className: "advert-review-drawer__section" },
                    react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                        react_1.default.createElement(lucide_react_1.FileText, { size: 12 }),
                        "Job Description (",
                        advertLanguage,
                        ")"),
                    isLoading ? (react_1.default.createElement(SkeletonBlock, { height: "72px" })) : (react_1.default.createElement("p", { className: "advert-review-drawer__description" }, advertContent === null || advertContent === void 0 ? void 0 : advertContent.description))),
                react_1.default.createElement("section", { className: "advert-review-drawer__section" },
                    react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                        react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 12 }),
                        "Key Responsibilities (",
                        advertLanguage,
                        ")"),
                    isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__list" },
                        react_1.default.createElement(SkeletonBlock, { width: "80%" }),
                        react_1.default.createElement(SkeletonBlock, { width: "60%" }),
                        react_1.default.createElement(SkeletonBlock, { width: "70%" }))) : (react_1.default.createElement("ul", { className: "advert-review-drawer__list" }, responsibilitiesList))),
                react_1.default.createElement("div", { className: "advert-review-drawer__grid advert-review-drawer__grid--split" },
                    react_1.default.createElement("section", { className: "advert-review-drawer__section" },
                        react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                            react_1.default.createElement(lucide_react_1.UserCheck, { size: 12 }),
                            "Qualifications (",
                            advertLanguage,
                            ")"),
                        isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__list" },
                            react_1.default.createElement(SkeletonBlock, { width: "70%" }),
                            react_1.default.createElement(SkeletonBlock, { width: "55%" }))) : (react_1.default.createElement("ul", { className: "advert-review-drawer__list" }, qualificationsList))),
                    react_1.default.createElement("section", { className: "advert-review-drawer__section" },
                        react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                            react_1.default.createElement(lucide_react_1.Activity, { size: 12 }),
                            "Experience (",
                            advertLanguage,
                            ")"),
                        isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__list" },
                            react_1.default.createElement(SkeletonBlock, { width: "65%" }),
                            react_1.default.createElement(SkeletonBlock, { width: "50%" }))) : (react_1.default.createElement("ul", { className: "advert-review-drawer__list" }, experienceList)))),
                react_1.default.createElement("section", { className: "advert-review-drawer__section" },
                    react_1.default.createElement("div", { className: "advert-review-drawer__section-header advert-review-drawer__section-header--plain" },
                        react_1.default.createElement("h3", null,
                            react_1.default.createElement(lucide_react_1.Paperclip, { size: 12 }),
                            "Required Attachments")),
                    isLoading ? (react_1.default.createElement("div", { className: "advert-review-drawer__attachments" }, Array.from({ length: 3 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "attachment-skeleton-".concat(idx), className: "advert-review-drawer__attachment-card" },
                        react_1.default.createElement("div", { className: "advert-review-drawer__attachment-header" },
                            react_1.default.createElement(SkeletonBlock, { width: "60%" })),
                        react_1.default.createElement("div", { className: "advert-review-drawer__attachment-body" },
                            react_1.default.createElement(SkeletonBlock, { width: "80%" }),
                            react_1.default.createElement(SkeletonBlock, { width: "65%" })))); }))) : (react_1.default.createElement("div", { className: "advert-review-drawer__attachments" }, attachmentCards))),
                react_1.default.createElement("section", { className: "advert-review-drawer__section advert-review-drawer__section--comments" },
                    react_1.default.createElement("h3", { className: "advert-review-drawer__section-title" },
                        react_1.default.createElement(lucide_react_1.MessageSquare, { size: 12 }),
                        "Reviewer Comments"),
                    react_1.default.createElement("textarea", { className: "advert-review-drawer__textarea", placeholder: "Add your feedback or notes here...", value: reviewerComments, onChange: function (event) { return onCommentsChange(event.target.value); } }),
                    react_1.default.createElement("div", { className: "advert-review-drawer__signature" },
                        react_1.default.createElement("label", { className: "advert-review-drawer__acknowledge" },
                            react_1.default.createElement("span", { className: "advert-review-drawer__checkbox ".concat(acknowledgementCheckbox ? "is-checked" : "").trim() },
                                react_1.default.createElement("input", { type: "checkbox", checked: acknowledgementCheckbox, onChange: onToggleAcknowledgement }),
                                react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 12 })),
                            react_1.default.createElement("span", null, "I hereby acknowledge that I have reviewed the job advertisement details and attachments, and I confirm that the information is accurate and ready for publication.")),
                        react_1.default.createElement("div", { className: "advert-review-drawer__signature-details" },
                            react_1.default.createElement("div", { className: "advert-review-drawer__avatar" }, isLoading ? "" : ((_b = signatureDetails === null || signatureDetails === void 0 ? void 0 : signatureDetails.reviewerInitial) !== null && _b !== void 0 ? _b : "JD")),
                            react_1.default.createElement("div", { className: "advert-review-drawer__signature-meta" },
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement("div", { className: "advert-review-drawer__signature-label" }, "Reviewer Name"),
                                    react_1.default.createElement("div", { className: "advert-review-drawer__signature-value" }, isLoading ? react_1.default.createElement(SkeletonBlock, { width: "120px" }) : signatureDetails === null || signatureDetails === void 0 ? void 0 : signatureDetails.reviewerName)),
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement("div", { className: "advert-review-drawer__signature-label" }, "Job Title (EN)"),
                                    react_1.default.createElement("div", { className: "advert-review-drawer__signature-value" }, isLoading ? react_1.default.createElement(SkeletonBlock, { width: "140px" }) : signatureDetails === null || signatureDetails === void 0 ? void 0 : signatureDetails.jobTitleEN)),
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement("div", { className: "advert-review-drawer__signature-label" }, "Job Title (FR)"),
                                    react_1.default.createElement("div", { className: "advert-review-drawer__signature-value" }, isLoading ? react_1.default.createElement(SkeletonBlock, { width: "160px" }) : signatureDetails === null || signatureDetails === void 0 ? void 0 : signatureDetails.jobTitleFR))))))),
            react_1.default.createElement("div", { className: "advert-review-drawer__footer" },
                react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__history", title: "View History" },
                    react_1.default.createElement(lucide_react_1.History, { size: 18 })),
                react_1.default.createElement("div", { className: "advert-review-drawer__footer-actions" },
                    react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__button", onClick: handleClose }, "Cancel"),
                    react_1.default.createElement("button", { type: "button", className: "advert-review-drawer__button advert-review-drawer__button--primary ".concat(acknowledgementCheckbox ? "" : "is-disabled").trim(), disabled: !acknowledgementCheckbox },
                        react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 16 }),
                        "Approve Advert"))))))));
};
exports.AdvertReviewDrawer = AdvertReviewDrawer;
//# sourceMappingURL=AdvertReviewDrawer.js.map