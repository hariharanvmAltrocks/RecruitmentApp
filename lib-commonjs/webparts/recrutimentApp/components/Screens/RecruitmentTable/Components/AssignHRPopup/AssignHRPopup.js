"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignHRPopup = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("./AssignHRPopup.scss");
var AssignHRPopup = function (_a) {
    var _b, _c, _d;
    var isOpen = _a.isOpen, selectedItems = _a.selectedItems, assignedMember = _a.assignedMember, onClose = _a.onClose, onConfirm = _a.onConfirm;
    var _e = (0, react_1.useState)(""), comments = _e[0], setComments = _e[1];
    var handleConfirm = (0, react_1.useCallback)(function () {
        onConfirm({
            vacancies: selectedItems,
            member: assignedMember,
            comments: comments,
        });
    }, [comments, onConfirm, assignedMember, selectedItems]);
    if (!isOpen) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "modal-popup", role: "dialog", "aria-modal": "true" },
        react_1.default.createElement("div", { className: "modal-popup__card" },
            react_1.default.createElement("button", { className: "modal-popup__close", type: "button", onClick: onClose, "aria-label": "Close" },
                react_1.default.createElement(lucide_react_1.X, { size: 20 })),
            react_1.default.createElement("div", { className: "modal-popup__title" },
                react_1.default.createElement("span", { className: "modal-popup__title-icon" },
                    react_1.default.createElement(lucide_react_1.BadgeCheck, { size: 20 })),
                "Finalize Assignment"),
            react_1.default.createElement("div", { className: "modal-popup__section" },
                react_1.default.createElement("div", { className: "modal-popup__section-title" }, "Selected Vacancies"),
                react_1.default.createElement("div", { className: "modal-popup__vacancies" },
                    selectedItems.length,
                    " Vacancies"),
                react_1.default.createElement("div", { className: "modal-popup__vacancies-subtext" }, selectedItems.map(function (item) { return item.title; }).join(", "))),
            react_1.default.createElement("div", { className: "modal-popup__section" },
                react_1.default.createElement("div", { className: "modal-popup__section-title" }, "Assigning To"),
                react_1.default.createElement("div", { className: "modal-popup__assignee" },
                    react_1.default.createElement("span", { className: "modal-popup__avatar" }, (_b = assignedMember === null || assignedMember === void 0 ? void 0 : assignedMember.initials) !== null && _b !== void 0 ? _b : "HR"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "modal-popup__assignee-name" }, (_c = assignedMember === null || assignedMember === void 0 ? void 0 : assignedMember.name) !== null && _c !== void 0 ? _c : "No member selected"),
                        react_1.default.createElement("div", { className: "modal-popup__assignee-role" }, (_d = assignedMember === null || assignedMember === void 0 ? void 0 : assignedMember.role) !== null && _d !== void 0 ? _d : "Select a member to proceed")))),
            react_1.default.createElement("div", { className: "modal-popup__section" },
                react_1.default.createElement("div", { className: "modal-popup__section-title" }, "Instructions / Comments for Staff"),
                react_1.default.createElement("textarea", { className: "modal-popup__input", placeholder: "Enter specific instructions for the assigned HR member...", value: comments, onChange: function (event) { return setComments(event.target.value); } })),
            react_1.default.createElement("div", { className: "modal-popup__footer" },
                react_1.default.createElement("button", { className: "modal-popup__btn modal-popup__btn--ghost", type: "button", onClick: onClose }, "Cancel"),
                react_1.default.createElement("button", { className: "modal-popup__btn modal-popup__btn--primary", type: "button", disabled: !assignedMember || selectedItems.length === 0, onClick: handleConfirm },
                    react_1.default.createElement(lucide_react_1.Send, { size: 16, style: { marginRight: 8 } }),
                    "Confirm & Send")))));
};
exports.AssignHRPopup = AssignHRPopup;
//# sourceMappingURL=AssignHRPopup.js.map