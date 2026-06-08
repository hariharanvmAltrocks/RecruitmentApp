"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalPopup = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
require("./ModalPopup.scss");
// ─────────────────────────────────────────────────────────────────────────────
// Per-type config
// ─────────────────────────────────────────────────────────────────────────────
var CONFIG = {
    success: {
        icon: react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #22c55e, #16a34a)",
        accentColor: "#22c55e",
        defaultTitle: "Submitted Successfully!",
        defaultMessage: "Your request has been processed.",
        defaultConfirmLabel: "OK",
        defaultCancelLabel: "Close",
        confirmBtnClass: "btn--success",
    },
    error: {
        icon: react_1.default.createElement(lucide_react_1.XCircle, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        accentColor: "#ef4444",
        defaultTitle: "Something Went Wrong",
        defaultMessage: "An error occurred. Please try again.",
        defaultConfirmLabel: "OK",
        defaultCancelLabel: "Close",
        confirmBtnClass: "btn--error",
    },
    warning: {
        icon: react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        accentColor: "#f59e0b",
        defaultTitle: "Warning",
        defaultMessage: "Please review before proceeding.",
        defaultConfirmLabel: "OK",
        defaultCancelLabel: "Cancel",
        confirmBtnClass: "btn--warning",
    },
    info: {
        icon: react_1.default.createElement(lucide_react_1.Info, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        accentColor: "#2563eb",
        defaultTitle: "Information",
        defaultMessage: "",
        defaultConfirmLabel: "OK",
        defaultCancelLabel: "Close",
        confirmBtnClass: "btn--info",
    },
    confirmation: {
        icon: react_1.default.createElement(lucide_react_1.HelpCircle, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #9333ea, #7e22ce)",
        accentColor: "#9333ea",
        defaultTitle: "Are you sure?",
        defaultMessage: "",
        defaultConfirmLabel: "Yes, Continue",
        defaultCancelLabel: "Cancel",
        confirmBtnClass: "btn--confirmation",
    },
    submit: {
        icon: react_1.default.createElement(lucide_react_1.Send, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        accentColor: "#2563eb",
        defaultTitle: "Confirm Submission",
        defaultMessage: "Are you sure you want to submit? This action cannot be undone.",
        defaultConfirmLabel: "OK",
        defaultCancelLabel: "Cancel",
        confirmBtnClass: "btn--info",
    },
    cancel: {
        icon: react_1.default.createElement(lucide_react_1.LogOut, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        accentColor: "#f59e0b",
        defaultTitle: "Are you sure you want to leave?",
        defaultMessage: "Any unsaved changes will be lost.",
        defaultConfirmLabel: "OK",
        defaultCancelLabel: "Stay Here",
        confirmBtnClass: "btn--warning",
    },
    validation: {
        icon: react_1.default.createElement(lucide_react_1.ShieldAlert, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        accentColor: "#ef4444",
        defaultTitle: "Please Fill All Mandatory Fields",
        defaultMessage: "Complete the following fields before submitting:",
        defaultConfirmLabel: "OK",
        defaultCancelLabel: "Got it",
        confirmBtnClass: "btn--error",
    },
};
var ModalPopup = function (_a) {
    var _b;
    var open = _a.open, _c = _a.type, type = _c === void 0 ? "info" : _c, title = _a.title, message = _a.message, _d = _a.validationErrors, validationErrors = _d === void 0 ? [] : _d, onConfirm = _a.onConfirm, onCancel = _a.onCancel, onClose = _a.onClose, confirmLabel = _a.confirmLabel, cancelLabel = _a.cancelLabel, _e = _a.isLoading, isLoading = _e === void 0 ? false : _e, _f = _a.closeOnOutsideClick, closeOnOutsideClick = _f === void 0 ? true : _f, _g = _a.autoClose, autoClose = _g === void 0 ? false : _g, _h = _a.autoCloseDuration, autoCloseDuration = _h === void 0 ? 3000 : _h, isCOIFlag = _a.isCOIFlag;
    var cfg = CONFIG[type];
    var resolvedTitle = title !== null && title !== void 0 ? title : cfg.defaultTitle;
    var resolvedMessage = message !== null && message !== void 0 ? message : cfg.defaultMessage;
    var resolvedConfirmLabel = (_b = confirmLabel !== null && confirmLabel !== void 0 ? confirmLabel : cfg.defaultConfirmLabel) !== null && _b !== void 0 ? _b : "OK";
    var resolvedCancelLabel = cancelLabel !== null && cancelLabel !== void 0 ? cancelLabel : cfg.defaultCancelLabel;
    // Auto-close for success type
    (0, react_1.useEffect)(function () {
        if (open && autoClose && type === "success") {
            var timer_1 = setTimeout(onClose, autoCloseDuration);
            return function () { return clearTimeout(timer_1); };
        }
    }, [open, autoClose, type, autoCloseDuration, onClose]);
    // Keyboard Escape to close
    var handleKeyDown = (0, react_1.useCallback)(function (e) {
        if (e.key === "Escape" && open)
            onClose();
    }, [open, onClose]);
    (0, react_1.useEffect)(function () {
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        else {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        }
        return function () {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [open, handleKeyDown]);
    var handleBackdropClick = function (e) {
        if (closeOnOutsideClick && e.target === e.currentTarget)
            onClose();
    };
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, open && (react_1.default.createElement(framer_motion_1.motion.div, { key: "backdrop", className: "modal-popup__overlay", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, onClick: handleBackdropClick, role: "dialog", "aria-modal": "true" },
        react_1.default.createElement(framer_motion_1.motion.div, { key: "card", className: "modal-popup__container", initial: { opacity: 0, scale: 0.88, y: 24 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.88, y: 24 }, transition: { type: "spring", damping: 22, stiffness: 300 }, onClick: function (e) { return e.stopPropagation(); } },
            react_1.default.createElement("div", { className: "modal-popup__accent-bar", style: { background: cfg.accentColor } }),
            isCOIFlag && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "popupHeader" },
                    react_1.default.createElement("button", { onClick: onClose, "aria-label": "Close comments modal" },
                        react_1.default.createElement(lucide_react_1.X, { size: 20 }))))),
            react_1.default.createElement("div", { className: "modal-popup__icon-wrap" },
                react_1.default.createElement("div", { className: "modal-popup__icon-circle", style: { background: cfg.iconGradient } }, cfg.icon)),
            react_1.default.createElement("h3", { className: "modal-popup__title" }, resolvedTitle),
            resolvedMessage && (react_1.default.createElement("p", { className: "modal-popup__message", dangerouslySetInnerHTML: { __html: resolvedMessage } })),
            type === "validation" && validationErrors.length > 0 && (react_1.default.createElement("div", { className: "modal-popup__validation-list" }, validationErrors.map(function (err, i) { return (react_1.default.createElement("div", { key: i, className: "modal-popup__validation-item" },
                react_1.default.createElement(lucide_react_1.XCircle, { size: 13, className: "modal-popup__validation-icon" }),
                react_1.default.createElement("span", null, err.message))); }))),
            react_1.default.createElement("div", { className: "modal-popup__actions" },
                type === "confirmation" && (react_1.default.createElement("button", { className: "modal-popup__btn btn--secondary", onClick: function () { var _a; return (_a = (onCancel !== null && onCancel !== void 0 ? onCancel : onClose)) === null || _a === void 0 ? void 0 : _a(); }, disabled: isLoading }, resolvedCancelLabel)),
                react_1.default.createElement("button", { className: "modal-popup__btn ".concat(cfg.confirmBtnClass), onClick: function () { var _a; return (_a = (onConfirm !== null && onConfirm !== void 0 ? onConfirm : onClose)) === null || _a === void 0 ? void 0 : _a(); }, disabled: isLoading }, isLoading ? (react_1.default.createElement(lucide_react_1.Loader2, { className: "modal-popup__spinner", size: 16 })) : (resolvedConfirmLabel))))))));
};
exports.ModalPopup = ModalPopup;
exports.default = exports.ModalPopup;
//# sourceMappingURL=ModalPopup.js.map