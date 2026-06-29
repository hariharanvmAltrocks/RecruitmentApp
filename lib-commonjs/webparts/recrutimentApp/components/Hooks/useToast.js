"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var useToast = function () {
    var _a = (0, react_1.useState)({
        open: false,
        type: "success",
        title: "",
        message: "",
        autoDismiss: true,
        autoDismissDuration: 3000,
        // buttonAction: undefined,
    }), toast = _a[0], setToast = _a[1];
    var showToast = function (config) {
        setToast(tslib_1.__assign({ open: true, type: "success", title: "", message: "", autoDismiss: true, autoDismissDuration: 3000 }, config));
    };
    var closeToast = function () {
        setToast(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { open: false })); });
    };
    // ✅ Helper methods
    var showSuccess = function (message, title) {
        if (title === void 0) { title = "Success"; }
        showToast({ type: "success", title: title, message: message });
    };
    var showError = function (message, title) {
        if (title === void 0) { title = "Error"; }
        showToast({
            type: "error",
            title: title,
            message: message,
            autoDismiss: false,
        });
    };
    var showWarning = function (message, title) {
        if (title === void 0) { title = "Warning"; }
        showToast({ type: "warning", title: title, message: message });
    };
    var showConfirm = function (message, onConfirm, title) {
        if (title === void 0) { title = "Confirm"; }
        showToast({
            type: "confirmation",
            title: title,
            message: message,
            autoDismiss: false,
            //   buttonAction: onConfirm,
        });
    };
    return {
        toast: toast,
        showToast: showToast,
        closeToast: closeToast,
        showSuccess: showSuccess,
        showError: showError,
        showWarning: showWarning,
        showConfirm: showConfirm,
    };
};
exports.useToast = useToast;
//# sourceMappingURL=useToast.js.map