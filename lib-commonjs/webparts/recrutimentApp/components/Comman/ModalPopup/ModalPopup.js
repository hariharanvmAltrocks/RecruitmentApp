"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalPopup = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
require("./ModalPopup.scss");
var iconMap = {
    success: { Icon: lucide_react_1.CheckCircle, className: "success-icon" },
    error: { Icon: lucide_react_1.XCircle, className: "error-icon" },
    warning: { Icon: lucide_react_1.AlertTriangle, className: "warning-icon" },
    info: { Icon: lucide_react_1.Info, className: "info-icon" },
    confirmation: { Icon: lucide_react_1.HelpCircle, className: "confirmation-icon" },
};
var ModalPopup = function (_a) {
    var open = _a.open, _b = _a.type, type = _b === void 0 ? "info" : _b, title = _a.title, message = _a.message, onConfirm = _a.onConfirm, onClose = _a.onClose, _c = _a.confirmLabel, confirmLabel = _c === void 0 ? "OK" : _c, _d = _a.cancelLabel, cancelLabel = _d === void 0 ? "Cancel" : _d, _e = _a.isLoading, isLoading = _e === void 0 ? false : _e, _f = _a.closeOnOutsideClick, closeOnOutsideClick = _f === void 0 ? true : _f, _g = _a.autoClose, autoClose = _g === void 0 ? false : _g, _h = _a.autoCloseDuration, autoCloseDuration = _h === void 0 ? 11113000 : _h;
    var _j = iconMap[type], Icon = _j.Icon, className = _j.className;
    (0, react_1.useEffect)(function () {
        if (open && autoClose && type === "success") {
            var timer_1 = setTimeout(function () {
                onClose();
            }, autoCloseDuration);
            return function () { return clearTimeout(timer_1); };
        }
    }, [open, autoClose, type, autoCloseDuration, onClose]);
    var handleKeyDown = (0, react_1.useCallback)(function (e) {
        if (e.key === "Escape" && open) {
            onClose();
        }
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
    var handleOutsideClick = function (e) {
        if (closeOnOutsideClick && e.target === e.currentTarget) {
            onClose();
        }
    };
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, open && (react_1.default.createElement(framer_motion_1.motion.div, { className: "modal-popup__overlay", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, onClick: handleOutsideClick, role: "dialog", "aria-modal": "true" },
        react_1.default.createElement(framer_motion_1.motion.div, { className: "modal-popup__container", initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 }, transition: { type: "spring", stiffness: 300, damping: 25 }, onClick: function (e) { return e.stopPropagation(); } },
            react_1.default.createElement("button", { className: "modal-popup__close-btn", onClick: onClose, "aria-label": "Close modal", disabled: isLoading },
                react_1.default.createElement(lucide_react_1.X, { size: 20 })),
            react_1.default.createElement("div", { className: "modal-popup__icon-container ".concat(className) },
                react_1.default.createElement(Icon, { size: 48, strokeWidth: 1.5 })),
            react_1.default.createElement("div", { className: "modal-popup__content" },
                react_1.default.createElement("h2", { className: "modal-popup__title" }, title),
                react_1.default.createElement("p", { className: "modal-popup__message", dangerouslySetInnerHTML: { __html: message } })),
            react_1.default.createElement("div", { className: "modal-popup__actions" },
                cancelLabel && type === "confirmation" && (react_1.default.createElement("button", { className: "modal-popup__btn modal-popup__btn--secondary", onClick: onClose, disabled: isLoading }, cancelLabel)),
                react_1.default.createElement("button", { className: "modal-popup__btn modal-popup__btn--".concat(type), onClick: onConfirm !== null && onConfirm !== void 0 ? onConfirm : onClose, disabled: isLoading }, isLoading ? (react_1.default.createElement(lucide_react_1.Loader2, { className: "modal-popup__spinner", size: 18 })) : (confirmLabel))))))));
};
exports.ModalPopup = ModalPopup;
//# sourceMappingURL=ModalPopup.js.map