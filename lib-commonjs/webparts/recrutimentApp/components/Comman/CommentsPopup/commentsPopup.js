"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewCommentsModal = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var commantsPopup_module_scss_1 = tslib_1.__importDefault(require("./commantsPopup.module.scss"));
var parseRoleColor = function (role) {
    var lowerRole = role.toLowerCase();
    if (lowerRole.includes("level 1"))
        return commantsPopup_module_scss_1.default.roleLevel1;
    if (lowerRole.includes("level 2"))
        return commantsPopup_module_scss_1.default.roleLevel2;
    if (lowerRole.includes("level 3"))
        return commantsPopup_module_scss_1.default.roleLevel3;
    return commantsPopup_module_scss_1.default.roleDefault;
};
var formatDate = function (isoString) {
    try {
        var d = new Date(isoString);
        if (isNaN(d.getTime()))
            return isoString;
        return d.toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    catch (e) {
        return isoString;
    }
};
var ViewCommentsModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, comments = _a.comments, _b = _a.title, title = _b === void 0 ? "View Comments" : _b, _c = _a.isLoading, isLoading = _c === void 0 ? false : _c;
    var _d = (0, react_1.useState)(false), isClosing = _d[0], setIsClosing = _d[1];
    var modalRef = (0, react_1.useRef)(null);
    // Handle Entry / Exit states
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);
    // Handle Keyboard interactions (Escape key + Focus trap)
    (0, react_1.useEffect)(function () {
        var _a;
        if (!isOpen || isClosing)
            return;
        var handleKeyDown = function (e) {
            if (e.key === "Escape") {
                handleClose();
                return;
            }
            // Basic focus trap
            if (e.key === "Tab" && modalRef.current) {
                var focusableElements = modalRef.current.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length > 0) {
                    var firstElement = focusableElements[0];
                    var lastElement = focusableElements[focusableElements.length - 1];
                    if (e.shiftKey) {
                        /* shift + tab */
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    }
                    else {
                        /* tab */
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        // Auto focus modal wrapper for accessibility
        (_a = modalRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        return function () { return window.removeEventListener("keydown", handleKeyDown); };
    }, [isOpen, isClosing]);
    var handleClose = function () {
        setIsClosing(true);
        // Match the CSS animation duration (0.3s)
        setTimeout(function () {
            onClose();
            setIsClosing(false);
        }, 300);
    };
    var handleBackdropClick = function (e) {
        // Only close icon closes the popup. Do not close on backdrop click.
        e.stopPropagation();
    };
    if (!isOpen && !isClosing)
        return null;
    return (react_1.default.createElement("div", { className: "".concat(commantsPopup_module_scss_1.default.backdrop, " ").concat(isClosing ? commantsPopup_module_scss_1.default.closing : ""), onClick: handleBackdropClick },
        react_1.default.createElement("div", { className: "".concat(commantsPopup_module_scss_1.default.modal, " ").concat(isClosing ? commantsPopup_module_scss_1.default.closing : ""), onClick: function (e) { return e.stopPropagation(); }, role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", tabIndex: -1, ref: modalRef },
            react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.header },
                react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.headerTitle },
                    react_1.default.createElement(lucide_react_1.FileText, { size: 20 }),
                    react_1.default.createElement("span", { id: "modal-title" }, title)),
                react_1.default.createElement("button", { className: commantsPopup_module_scss_1.default.closeBtn, onClick: handleClose, "aria-label": "Close modal" },
                    react_1.default.createElement(lucide_react_1.X, { size: 20 }))),
            react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.body }, isLoading ? (react_1.default.createElement(react_1.default.Fragment, null, [1, 2, 3].map(function (n) { return (react_1.default.createElement("div", { key: n, className: commantsPopup_module_scss_1.default.skeletonCard },
                react_1.default.createElement("div", { className: "".concat(commantsPopup_module_scss_1.default.shimmer, " ").concat(commantsPopup_module_scss_1.default.skBadge) }),
                react_1.default.createElement("div", { className: "".concat(commantsPopup_module_scss_1.default.shimmer, " ").concat(commantsPopup_module_scss_1.default.skLabel) }),
                react_1.default.createElement("div", { className: "".concat(commantsPopup_module_scss_1.default.shimmer, " ").concat(commantsPopup_module_scss_1.default.skText) }),
                react_1.default.createElement("div", { className: "".concat(commantsPopup_module_scss_1.default.shimmer, " ").concat(commantsPopup_module_scss_1.default.skTextShort) }),
                react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.skMeta },
                    react_1.default.createElement("div", { className: "".concat(commantsPopup_module_scss_1.default.shimmer, " ").concat(commantsPopup_module_scss_1.default.skName) }),
                    react_1.default.createElement("div", { className: "".concat(commantsPopup_module_scss_1.default.shimmer, " ").concat(commantsPopup_module_scss_1.default.skDept) })))); }))) : comments.length === 0 ? (react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.emptyState },
                react_1.default.createElement(lucide_react_1.Inbox, { size: 48, strokeWidth: 1.5 }),
                react_1.default.createElement("p", null, "No comments available"))) : (comments.map(function (comment) { return (react_1.default.createElement("div", { key: comment.id, className: "".concat(commantsPopup_module_scss_1.default.commentCard, " ").concat(parseRoleColor(comment.BGVCode)) },
                react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.content },
                    react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.label }, comment.BGVType),
                    react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.text }, comment.Remarks)))); }))),
            react_1.default.createElement("div", { className: commantsPopup_module_scss_1.default.footer },
                react_1.default.createElement("button", { className: commantsPopup_module_scss_1.default.closeOutlinedBtn, onClick: handleClose }, "Close")))));
};
exports.ViewCommentsModal = ViewCommentsModal;
//# sourceMappingURL=commentsPopup.js.map