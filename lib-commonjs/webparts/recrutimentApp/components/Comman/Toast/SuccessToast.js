"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessToast = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
require("./SuccessToast.scss");
var SuccessToast = function (_a) {
    var show = _a.show, _b = _a.type, type = _b === void 0 ? "success" : _b, title = _a.title, message = _a.message, onClose = _a.onClose, _c = _a.autoDismiss, autoDismiss = _c === void 0 ? true : _c, _d = _a.autoDismissDuration, autoDismissDuration = _d === void 0 ? 4000 : _d;
    (0, react_1.useEffect)(function () {
        if (!show || !autoDismiss)
            return;
        var timer = window.setTimeout(function () {
            onClose();
        }, autoDismissDuration);
        return function () { return window.clearTimeout(timer); };
    }, [show, autoDismiss, autoDismissDuration, onClose]);
    // 🔥 Type-based config
    var config = {
        success: {
            icon: react_1.default.createElement(lucide_react_1.CheckCircle2, { size: 22 }),
            className: "toast--success"
        },
        warning: {
            icon: react_1.default.createElement(lucide_react_1.AlertTriangle, { size: 22 }),
            className: "toast--warning"
        },
        error: {
            icon: react_1.default.createElement(lucide_react_1.XCircle, { size: 22 }),
            className: "toast--error"
        },
        info: {
            icon: react_1.default.createElement(lucide_react_1.Info, { size: 22 }),
            className: "toast--info"
        },
        confirmation: {
            icon: react_1.default.createElement(lucide_react_1.HelpCircle, { size: 22 }),
            className: "toast--confirmation"
        }
    };
    var current = config[type];
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, show && (react_1.default.createElement(framer_motion_1.motion.div, { className: "toast ".concat(current.className), initial: { opacity: 0, y: -30, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.95 }, transition: { type: "spring", damping: 20, stiffness: 260 } },
        react_1.default.createElement("div", { className: "toast__accent" }),
        react_1.default.createElement("div", { className: "toast__content" },
            react_1.default.createElement("div", { className: "toast__icon" }, current.icon),
            react_1.default.createElement("div", { className: "toast__text" },
                react_1.default.createElement("div", { className: "toast__title" }, title),
                react_1.default.createElement("div", { className: "toast__message" }, message)),
            react_1.default.createElement("button", { className: "toast__close", onClick: onClose, "aria-label": "Close" },
                react_1.default.createElement(lucide_react_1.X, { size: 14 }))),
        autoDismiss && (react_1.default.createElement("div", { className: "toast__progress", style: { animationDuration: "".concat(autoDismissDuration, "ms") } }))))));
};
exports.SuccessToast = SuccessToast;
//# sourceMappingURL=SuccessToast.js.map