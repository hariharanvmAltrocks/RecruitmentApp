"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModalPopup = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var useModalPopup = function () {
    var _a = (0, react_1.useState)({
        open: false,
        title: "",
        message: "",
        type: "info",
        isLoading: false,
    }), modalState = _a[0], setModalState = _a[1];
    var showModal = (0, react_1.useCallback)(function (options) {
        setModalState(tslib_1.__assign(tslib_1.__assign({}, options), { open: true, isLoading: false }));
    }, []);
    var closeModal = (0, react_1.useCallback)(function () {
        setModalState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { open: false, isLoading: false })); });
    }, []);
    var setModalLoading = (0, react_1.useCallback)(function (isLoading) {
        setModalState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { isLoading: isLoading })); });
    }, []);
    return {
        modalState: modalState,
        showModal: showModal,
        closeModal: closeModal,
        setModalLoading: setModalLoading,
    };
};
exports.useModalPopup = useModalPopup;
//# sourceMappingURL=useModalPopup.js.map