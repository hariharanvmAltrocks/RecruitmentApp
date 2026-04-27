"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drawer = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var drawer_module_scss_1 = tslib_1.__importDefault(require("./drawer.module.scss"));
var Saveadminpanel_1 = require("../hooks/Saveadminpanel/Saveadminpanel");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var Config_1 = require("../../../../utilities/Config");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ModalPopup_1 = tslib_1.__importDefault(require("../../../Comman/ModalPopup/ModalPopup"));
var useModalPopup_1 = require("../../../Comman/ModalPopup/useModalPopup");
var dateConfigfn_1 = require("../../../Hooks/dateConfigfn");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Field = function (_a) {
    var label = _a.label, error = _a.error, _b = _a.className, className = _b === void 0 ? "" : _b, children = _a.children;
    return (react_1.default.createElement("div", { className: "".concat(drawer_module_scss_1.default.field, " ").concat(className) },
        react_1.default.createElement("span", { className: drawer_module_scss_1.default.label }, label),
        children,
        error && react_1.default.createElement("span", { className: drawer_module_scss_1.default.errorText }, error)));
};
var Group = function (_a) {
    var badge = _a.badge, children = _a.children;
    return (react_1.default.createElement("div", { className: drawer_module_scss_1.default.group },
        react_1.default.createElement("span", { className: drawer_module_scss_1.default.groupBadge }, badge),
        react_1.default.createElement("div", { className: drawer_module_scss_1.default.groupInner }, children)));
};
// ─── Drawer ───────────────────────────────────────────────────────────────────
var Drawer = function (_a) {
    var _b;
    var isOpen = _a.isOpen, onClose = _a.onClose, type = _a.type, _c = _a.isNew, isNew = _c === void 0 ? false : _c, _d = _a.isEdit, isEdit = _d === void 0 ? false : _d, _e = _a.isView, isView = _e === void 0 ? false : _e, _f = _a.selectedItem, selectedItem = _f === void 0 ? null : _f, onSuccess = _a.onSuccess;
    var _g = (0, Saveadminpanel_1.useSaveAdminPanel)(type), payload = _g.payload, setField = _g.setField, toggleActive = _g.toggleActive, isSaving = _g.isSaving, errors = _g.errors, save = _g.save, reset = _g.reset, modalState = _g.modalState, closeModal = _g.closeModal;
    var _h = (0, useModalPopup_1.useModalPopup)(), modelstate = _h.modalState, showModal = _h.showModal, closemodel = _h.closeModal;
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var emailId = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0];
    // Derive a human-readable mode label and the read-only flag
    var modeLabel = isView ? "View" : isEdit ? "Edit" : "New";
    var typeLabel = type === "labour-hire" ? "Labour Hire" : "Agency";
    var readOnly = isView; // all inputs disabled in view mode
    (0, react_1.useEffect)(function () {
        if (!isOpen)
            return;
        var loadData = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var res, prefix, externalUsers, lastCode, numPart, newNum, newCode, Filter, response;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (!(isNew || !selectedItem)) return [3 /*break*/, 3];
                        reset(type);
                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSExternalAgents)];
                    case 1:
                        res = _j.sent();
                        prefix = type === "agency" ? "ANT" : "LHC";
                        externalUsers = res.data.filter(function (item) {
                            return item.UserType ===
                                (type === "agency"
                                    ? ConditionConfig_1.ExternalUserType.Agent
                                    : ConditionConfig_1.ExternalUserType.LabourHire);
                        });
                        lastCode = externalUsers.length
                            ? externalUsers[externalUsers.length - 1].AgentCode
                            : prefix + "001";
                        numPart = parseInt(lastCode.replace(prefix, ""));
                        newNum = numPart + 1;
                        newCode = prefix +
                            newNum.toString().padStart(lastCode.length - prefix.length, "0");
                        Filter = [
                            { FilterKey: "EmailId", Operator: "eq", FilterValue: emailId },
                        ];
                        return [4 /*yield*/, ServiceExport_1.masterService.GetUserDetails(Filter, "and")];
                    case 2:
                        response = _j.sent();
                        setField("userCode", newCode !== null && newCode !== void 0 ? newCode : "");
                        setField("hrUserId", response === null || response === void 0 ? void 0 : response.data.ID);
                        return [3 /*break*/, 4];
                    case 3:
                        reset(type);
                        setField("ID", (_a = selectedItem.ID) !== null && _a !== void 0 ? _a : 0);
                        setField("hrUserId", Number(selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.hrUserId));
                        setField("userCode", (_b = selectedItem.exUserCode) !== null && _b !== void 0 ? _b : "");
                        setField("firstName", (_c = selectedItem.firstName) !== null && _c !== void 0 ? _c : "");
                        setField("lastName", (_d = selectedItem.lastName) !== null && _d !== void 0 ? _d : "");
                        setField("email", (_e = selectedItem.email) !== null && _e !== void 0 ? _e : "");
                        setField("companyName", (_f = selectedItem.designation) !== null && _f !== void 0 ? _f : "");
                        setField("designation", (_g = selectedItem.designation) !== null && _g !== void 0 ? _g : "");
                        setField("nationality", selectedItem.isExpat ? ConditionConfig_1.Nationality.Expatriate : ConditionConfig_1.Nationality.Nationals);
                        setField("contractStart", (0, dateConfigfn_1.formatDate)(selectedItem.contractStartDate));
                        setField("contractEnd", (0, dateConfigfn_1.formatDate)(selectedItem.contractStartDate));
                        setField("numberOfUsers", selectedItem.noOfUsers);
                        setField("isActive", (_h = selectedItem.isActive) !== null && _h !== void 0 ? _h : true);
                        _j.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadData();
    }, [isOpen, type]); // eslint-disable-line
    (0, react_1.useEffect)(function () {
        var handler = function (e) {
            if (e.key === "Escape" && isOpen)
                onClose();
        };
        document.addEventListener("keydown", handler);
        return function () { return document.removeEventListener("keydown", handler); };
    }, [isOpen, onClose]);
    var handleSubmit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ok;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isView)
                        return [2 /*return*/];
                    return [4 /*yield*/, save()];
                case 1:
                    ok = _a.sent();
                    if (ok) {
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var HeaderIcon = isView ? lucide_react_1.Eye : isEdit ? lucide_react_1.Pencil : lucide_react_1.UserPlus;
    var handleCancel = (0, react_1.useCallback)(function () {
        showModal({
            type: "confirmation",
            title: "Cancel Assignment",
            message: "Are you sure you want to cancel the assignment?",
            confirmLabel: "Yes",
            cancelLabel: "No",
            onConfirm: function () {
                onClose();
                closemodel();
            },
            onCancel: closemodel,
        });
    }, []);
    return (react_1.default.createElement(framer_motion_1.AnimatePresence, null, isOpen && (react_1.default.createElement("div", { style: {
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "flex-end",
            overflow: "hidden",
        } },
        react_1.default.createElement(framer_motion_1.motion.div, { className: drawer_module_scss_1.default.backdrop, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }),
        react_1.default.createElement(framer_motion_1.motion.div, { className: drawer_module_scss_1.default.drawer, initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 26, stiffness: 220 } },
            react_1.default.createElement("header", { className: drawer_module_scss_1.default.header },
                react_1.default.createElement("div", { className: drawer_module_scss_1.default.headerLeft },
                    react_1.default.createElement("div", { className: drawer_module_scss_1.default.headerIcon },
                        react_1.default.createElement(HeaderIcon, { size: 22 })),
                    react_1.default.createElement("div", { className: drawer_module_scss_1.default.headerText },
                        react_1.default.createElement("h3", null,
                            modeLabel,
                            " ",
                            typeLabel,
                            " User"),
                        react_1.default.createElement("p", null, isView
                            ? "Viewing user details — read only"
                            : isEdit
                                ? "Update user access and contract details"
                                : "Configure user access and contract details"))),
                react_1.default.createElement("div", { className: drawer_module_scss_1.default.headerRight },
                    !isView && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", { className: drawer_module_scss_1.default.toggleGroup },
                            react_1.default.createElement("span", { className: drawer_module_scss_1.default.toggleGroupLabel }, "Account Status"),
                            react_1.default.createElement("button", { type: "button", className: drawer_module_scss_1.default.toggleBtn, onClick: toggleActive },
                                react_1.default.createElement("span", { className: "".concat(drawer_module_scss_1.default.toggleLabel, " ").concat(payload.isActive ? drawer_module_scss_1.default["toggleLabel--active"] : drawer_module_scss_1.default["toggleLabel--inactive"]) }, payload.isActive ? "Active" : "Inactive"),
                                react_1.default.createElement("div", { className: "".concat(drawer_module_scss_1.default.toggleTrack, " ").concat(payload.isActive ? drawer_module_scss_1.default["toggleTrack--on"] : drawer_module_scss_1.default["toggleTrack--off"]) },
                                    react_1.default.createElement("div", { className: "".concat(drawer_module_scss_1.default.toggleThumb, " ").concat(payload.isActive ? drawer_module_scss_1.default["toggleThumb--on"] : drawer_module_scss_1.default["toggleThumb--off"]) })))),
                        react_1.default.createElement("div", { className: drawer_module_scss_1.default.headerDivider }))),
                    react_1.default.createElement("button", { type: "button", className: drawer_module_scss_1.default.closeBtn, onClick: onClose },
                        react_1.default.createElement(lucide_react_1.X, { size: 18 })))),
            react_1.default.createElement("div", { className: drawer_module_scss_1.default.body },
                react_1.default.createElement(Group, { badge: "Identity & Profile" },
                    react_1.default.createElement(Field, { label: "User Code" },
                        react_1.default.createElement("input", { readOnly: true, value: payload.userCode, className: drawer_module_scss_1.default.inputReadonly })),
                    react_1.default.createElement(Field, { label: "Nationality" },
                        react_1.default.createElement("select", { className: "".concat(isView ? drawer_module_scss_1.default.disabledWhite : drawer_module_scss_1.default.select), value: payload.nationality, disabled: isView, onChange: function (e) { return setField("nationality", e.target.value); } },
                            react_1.default.createElement("option", null, ConditionConfig_1.Nationality.Expatriate),
                            react_1.default.createElement("option", null, ConditionConfig_1.Nationality.Nationals))),
                    react_1.default.createElement(Field, { label: "First Name", error: errors.firstName },
                        react_1.default.createElement("input", { className: "".concat(drawer_module_scss_1.default.input, " ").concat(errors.firstName ? drawer_module_scss_1.default.hasError : ""), placeholder: "Enter first name", value: payload.firstName, readOnly: readOnly, onChange: function (e) { return setField("firstName", e.target.value); } })),
                    react_1.default.createElement(Field, { label: "Last Name", error: errors.lastName },
                        react_1.default.createElement("input", { className: "".concat(drawer_module_scss_1.default.input, " ").concat(errors.lastName ? drawer_module_scss_1.default.hasError : ""), placeholder: "Enter last name", value: payload.lastName, readOnly: readOnly, onChange: function (e) { return setField("lastName", e.target.value); } })),
                    react_1.default.createElement(Field, { label: "Company Name", error: errors.companyName },
                        react_1.default.createElement("input", { className: "".concat(drawer_module_scss_1.default.input, " ").concat(errors.companyName ? drawer_module_scss_1.default.hasError : ""), placeholder: "Enter legal company name", value: payload.companyName, readOnly: readOnly, onChange: function (e) { return setField("companyName", e.target.value); } })),
                    react_1.default.createElement(Field, { label: "Designation" },
                        react_1.default.createElement("input", { className: drawer_module_scss_1.default.input, placeholder: "Enter role / title", value: payload.designation, readOnly: readOnly, onChange: function (e) { return setField("designation", e.target.value); } }))),
                react_1.default.createElement(Group, { badge: "Contract Details" },
                    react_1.default.createElement(Field, { label: "No. of Users" },
                        react_1.default.createElement("input", { type: "number", className: drawer_module_scss_1.default.input, placeholder: "Total allocated seats", value: payload.numberOfUsers, readOnly: readOnly, onChange: function (e) { return setField("numberOfUsers", e.target.value); } })),
                    react_1.default.createElement("div", null),
                    " ",
                    react_1.default.createElement(Field, { label: "Start Date of Contract", error: errors.contractStart },
                        react_1.default.createElement("input", { type: "date", className: "".concat(drawer_module_scss_1.default.input, " ").concat(errors.contractStart ? drawer_module_scss_1.default.hasError : ""), value: payload.contractStart, readOnly: readOnly, onChange: function (e) { return setField("contractStart", e.target.value); } })),
                    react_1.default.createElement(Field, { label: "End Date of Contract", error: errors.contractEnd },
                        react_1.default.createElement("input", { type: "date", className: "".concat(drawer_module_scss_1.default.input, " ").concat(errors.contractEnd ? drawer_module_scss_1.default.hasError : ""), value: payload.contractEnd, min: payload.contractStart || undefined, readOnly: readOnly, onChange: function (e) { return setField("contractEnd", e.target.value); } }))),
                react_1.default.createElement(Group, { badge: "Access & Security" },
                    react_1.default.createElement(Field, { label: "Email ID", error: errors.email, className: drawer_module_scss_1.default.colSpan2 },
                        react_1.default.createElement("input", { type: "email", className: "".concat(drawer_module_scss_1.default.input, " ").concat(errors.email ? drawer_module_scss_1.default.hasError : ""), placeholder: "official.email@domain.com", value: payload.email, readOnly: readOnly, onChange: function (e) { return setField("email", e.target.value); } })),
                    !isView && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Field, { label: isEdit ? "New Password (optional)" : "Password", error: errors.password },
                            react_1.default.createElement("input", { type: "password", className: "".concat(drawer_module_scss_1.default.input, " ").concat(errors.password ? drawer_module_scss_1.default.hasError : ""), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: payload.password, onChange: function (e) { return setField("password", e.target.value); } })),
                        react_1.default.createElement(Field, { label: "Confirm Password", error: errors.confirmPassword },
                            react_1.default.createElement("input", { type: "password", className: "".concat(drawer_module_scss_1.default.input, " ").concat(errors.confirmPassword ? drawer_module_scss_1.default.hasError : ""), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: payload.confirmPassword, onChange: function (e) {
                                    return setField("confirmPassword", e.target.value);
                                } })))))),
            react_1.default.createElement("footer", { className: drawer_module_scss_1.default.footer },
                react_1.default.createElement("button", { type: "button", className: drawer_module_scss_1.default.cancelBtn, onClick: isView ? onClose : handleCancel }, isView ? "Close" : "Cancel"),
                !isView && (react_1.default.createElement("button", { type: "button", className: drawer_module_scss_1.default.submitBtn, onClick: handleSubmit, disabled: isSaving },
                    isSaving ? (react_1.default.createElement("span", { className: drawer_module_scss_1.default.spinner })) : (react_1.default.createElement(lucide_react_1.ShieldCheck, { size: 15 })),
                    isSaving
                        ? "Saving…"
                        : isEdit
                            ? "Update User"
                            : "Create Enterprise User")))),
        react_1.default.createElement(ModalPopup_1.default, tslib_1.__assign({}, modalState, { onClose: closeModal })),
        react_1.default.createElement(ModalPopup_1.default, tslib_1.__assign({}, modelstate, { onClose: closemodel }))))));
};
exports.Drawer = Drawer;
//# sourceMappingURL=Drawer.js.map