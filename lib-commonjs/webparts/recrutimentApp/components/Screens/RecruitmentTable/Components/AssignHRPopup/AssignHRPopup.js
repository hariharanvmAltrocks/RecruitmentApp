"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignHRPopup = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("./AssignHRPopup.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var AssignHRPopup = function (_a) {
    var _b, _c, _d, _e;
    var isOpen = _a.isOpen, selectedItems = _a.selectedItems, assignedMember = _a.assignedMember, onClose = _a.onClose, oncancel = _a.oncancel, onConfirm = _a.onConfirm, _f = _a.changeHR, changeHR = _f === void 0 ? false : _f, _g = _a.members, members = _g === void 0 ? [] : _g;
    var _h = (0, react_1.useState)(false), isSubmitting = _h[0], setIsSubmitting = _h[1];
    var _j = (0, react_1.useState)(""), comments = _j[0], setComments = _j[1];
    var _k = (0, react_1.useState)(false), commentsTouched = _k[0], setCommentsTouched = _k[1];
    // Local state to track the selected assignee inside the popup
    var _l = (0, react_1.useState)(assignedMember), localMember = _l[0], setLocalMember = _l[1];
    // Sync state if assignedMember changes
    react_1.default.useEffect(function () {
        setLocalMember(assignedMember);
    }, [assignedMember]);
    var isCommentsValid = (0, react_1.useMemo)(function () { return comments.trim().length > 0; }, [comments]);
    var showCommentsError = commentsTouched && !isCommentsValid;
    var handleConfirm = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isSubmitting) {
                        return [2 /*return*/];
                    }
                    if (!isCommentsValid) {
                        setCommentsTouched(true);
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, onConfirm({
                            vacancies: selectedItems,
                            member: localMember,
                            comments: comments,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [
        comments,
        onConfirm,
        localMember,
        selectedItems,
        isSubmitting,
        isCommentsValid,
    ]);
    if (!isOpen) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "modal-popup", role: "dialog", "aria-modal": "true" },
        react_1.default.createElement("div", { className: "modal-popup__card" },
            react_1.default.createElement("button", { className: "modal-popup__close", type: "button", onClick: onClose, "aria-label": strings.Close },
                react_1.default.createElement(lucide_react_1.X, { size: 20 })),
            react_1.default.createElement("div", { className: "modal-popup__title" },
                react_1.default.createElement("span", { className: "modal-popup__title-icon" },
                    react_1.default.createElement(lucide_react_1.BadgeCheck, { size: 20 })),
                strings.FinalizeAssignment),
            react_1.default.createElement("div", { className: "modal-popup__section" },
                react_1.default.createElement("div", { className: "modal-popup__section-title" }, strings.SelectedVacancies),
                react_1.default.createElement("div", { className: "modal-popup__vacancies" },
                    selectedItems.length,
                    " ",
                    strings.Vacancies),
                react_1.default.createElement("div", { className: "modal-popup__vacancies-subtext" }, selectedItems.map(function (item) { return item.title; }).join(", "))),
            react_1.default.createElement("div", { className: "modal-popup__section" },
                react_1.default.createElement("div", { className: "modal-popup__section-title" }, strings.AssigningTo),
                changeHR ? (react_1.default.createElement("div", { className: "modal-popup__change-hr" },
                    react_1.default.createElement("select", { value: (_b = localMember === null || localMember === void 0 ? void 0 : localMember.id) !== null && _b !== void 0 ? _b : "", onChange: function (e) {
                            var id = Number(e.target.value);
                            var found = members.find(function (m) { return m.id === id; });
                            setLocalMember(found !== null && found !== void 0 ? found : null);
                        }, className: "modal-popup__select", disabled: isSubmitting },
                        react_1.default.createElement("option", { value: "" }, strings.ChooseHrMember),
                        members.map(function (member) { return (react_1.default.createElement("option", { key: member.id, value: member.id },
                            member.name,
                            " - ",
                            member.role)); })))) : (react_1.default.createElement("div", { className: "modal-popup__assignee" },
                    react_1.default.createElement("span", { className: "modal-popup__avatar" }, (_c = localMember === null || localMember === void 0 ? void 0 : localMember.initials) !== null && _c !== void 0 ? _c : "HR"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "modal-popup__assignee-name" }, (_d = localMember === null || localMember === void 0 ? void 0 : localMember.name) !== null && _d !== void 0 ? _d : strings.NoMemberSelected),
                        react_1.default.createElement("div", { className: "modal-popup__assignee-role" }, (_e = localMember === null || localMember === void 0 ? void 0 : localMember.role) !== null && _e !== void 0 ? _e : strings.SelectAMemberToProceed))))),
            react_1.default.createElement("div", { className: "modal-popup__section" },
                react_1.default.createElement("div", { className: "modal-popup__section-title" }, strings.InstructionsCommentsForStaff),
                react_1.default.createElement("textarea", { className: "modal-popup__input", placeholder: strings.EnterSpecificInstructionsForTheAssignedH, value: comments, onChange: function (event) { return setComments(event.target.value); }, onBlur: function () { return setCommentsTouched(true); }, disabled: isSubmitting })),
            react_1.default.createElement("div", { className: "modal-popup__footer" },
                react_1.default.createElement("button", { className: "modal-popup__btn modal-popup__btn--ghost", type: "button", onClick: oncancel, disabled: isSubmitting }, strings.Cancel),
                react_1.default.createElement("button", { className: "modal-popup__btn modal-popup__btn--primary", type: "button", disabled: isSubmitting || !isCommentsValid || (changeHR && !localMember), onClick: handleConfirm }, isSubmitting ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(lucide_react_1.Loader2, { size: 16, className: "modal-popup__spinner" }),
                    strings.Sending)) : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(lucide_react_1.Send, { size: 16, style: { marginRight: 8 } }),
                    "Confirm & Send")))))));
};
exports.AssignHRPopup = AssignHRPopup;
//# sourceMappingURL=AssignHRPopup.js.map