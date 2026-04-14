"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalPopup = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
require("./ModalPopup.scss");
// ─────────────────────────────────────────────────────────────────────────────
// Per-type config — icon, gradient, accent color, default labels
// ─────────────────────────────────────────────────────────────────────────────
var CONFIG = {
    success: {
        icon: react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #22c55e, #16a34a)",
        accentColor: "#22c55e",
        defaultTitle: "Submitted Successfully!",
        defaultMessage: "Your request has been processed.",
        defaultCancelLabel: "Close",
        confirmBtnClass: "btn--success",
    },
    error: {
        icon: react_1.default.createElement(lucide_react_1.XCircle, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        accentColor: "#ef4444",
        defaultTitle: "Something Went Wrong",
        defaultMessage: "An error occurred. Please try again.",
        defaultConfirmLabel: "Retry",
        defaultCancelLabel: "Close",
        confirmBtnClass: "btn--error",
    },
    warning: {
        icon: react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        accentColor: "#f59e0b",
        defaultTitle: "Warning",
        defaultMessage: "Please review before proceeding.",
        defaultConfirmLabel: "Proceed",
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
        defaultConfirmLabel: "Yes, Submit",
        defaultCancelLabel: "Cancel",
        confirmBtnClass: "btn--info",
    },
    cancel: {
        icon: react_1.default.createElement(lucide_react_1.LogOut, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        accentColor: "#f59e0b",
        defaultTitle: "Are you sure you want to leave?",
        defaultMessage: "Any unsaved changes will be lost.",
        defaultConfirmLabel: "Yes, Leave",
        defaultCancelLabel: "Stay Here",
        confirmBtnClass: "btn--warning",
    },
    validation: {
        icon: react_1.default.createElement(lucide_react_1.ShieldAlert, { size: 28, color: "#fff" }),
        iconGradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        accentColor: "#ef4444",
        defaultTitle: "Please Fill All Mandatory Fields",
        defaultMessage: "Complete the following fields before submitting:",
        defaultCancelLabel: "Got it",
        confirmBtnClass: "btn--error",
    },
};
var ModalPopup = function (_a) {
    var open = _a.open, _b = _a.type, type = _b === void 0 ? "info" : _b, title = _a.title, message = _a.message, _c = _a.validationErrors, validationErrors = _c === void 0 ? [] : _c, onConfirm = _a.onConfirm, onCancel = _a.onCancel, onClose = _a.onClose, confirmLabel = _a.confirmLabel, cancelLabel = _a.cancelLabel, _d = _a.isLoading, isLoading = _d === void 0 ? false : _d, _e = _a.closeOnOutsideClick, closeOnOutsideClick = _e === void 0 ? true : _e, _f = _a.autoClose, autoClose = _f === void 0 ? false : _f, _g = _a.autoCloseDuration, autoCloseDuration = _g === void 0 ? 3000 : _g;
    var cfg = CONFIG[type];
    var resolvedTitle = title !== null && title !== void 0 ? title : cfg.defaultTitle;
    var resolvedMessage = message !== null && message !== void 0 ? message : cfg.defaultMessage;
    var resolvedConfirmLabel = confirmLabel !== null && confirmLabel !== void 0 ? confirmLabel : cfg.defaultConfirmLabel;
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
    var showConfirmBtn = !!resolvedConfirmLabel &&
        !!onConfirm &&
        type !== "validation" &&
        type !== "success";
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, open && (
    // ── Backdrop ──
    react_1.default.createElement(framer_motion_1.motion.div, { key: "backdrop", className: "modal-popup__overlay", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, onClick: handleBackdropClick, role: "dialog", "aria-modal": "true" },
        react_1.default.createElement(framer_motion_1.motion.div, { key: "card", className: "modal-popup__container", initial: { opacity: 0, scale: 0.88, y: 24 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.88, y: 24 }, transition: { type: "spring", damping: 22, stiffness: 300 }, onClick: function (e) { return e.stopPropagation(); } },
            react_1.default.createElement("div", { className: "modal-popup__accent-bar", style: { background: cfg.accentColor } }),
            react_1.default.createElement("div", { className: "modal-popup__icon-wrap" },
                react_1.default.createElement("div", { className: "modal-popup__icon-circle", style: { background: cfg.iconGradient } }, cfg.icon)),
            react_1.default.createElement("h3", { className: "modal-popup__title" }, resolvedTitle),
            resolvedMessage && (react_1.default.createElement("p", { className: "modal-popup__message", dangerouslySetInnerHTML: { __html: resolvedMessage } })),
            type === "validation" && validationErrors.length > 0 && (react_1.default.createElement("div", { className: "modal-popup__validation-list" }, validationErrors.map(function (err, i) { return (react_1.default.createElement("div", { key: i, className: "modal-popup__validation-item" },
                react_1.default.createElement(lucide_react_1.XCircle, { size: 13, className: "modal-popup__validation-icon" }),
                react_1.default.createElement("span", null, err.message))); }))),
            react_1.default.createElement("div", { className: "modal-popup__actions" },
                react_1.default.createElement("button", { className: "modal-popup__btn btn--secondary", onClick: function () {
                        var _a, _b;
                        if (type === "success" && onConfirm) {
                            onConfirm(); // call parent handler
                        }
                        else {
                            (_b = ((_a = onCancel !== null && onCancel !== void 0 ? onCancel : onClose) !== null && _a !== void 0 ? _a : onConfirm)) === null || _b === void 0 ? void 0 : _b();
                        }
                    }, disabled: isLoading }, resolvedCancelLabel),
                showConfirmBtn && (react_1.default.createElement("button", { className: "modal-popup__btn ".concat(cfg.confirmBtnClass), onClick: onConfirm, disabled: isLoading }, isLoading ? (react_1.default.createElement(lucide_react_1.Loader2, { className: "modal-popup__spinner", size: 16 })) : (resolvedConfirmLabel)))))))));
};
exports.ModalPopup = ModalPopup;
exports.default = exports.ModalPopup;
//# sourceMappingURL=ModalPopup.js.map