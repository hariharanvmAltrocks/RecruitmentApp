"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSaveAdminPanel = exports.EMPTY_PAYLOAD = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ConditionConfig_1 = require("../../../../../utilities/ConditionConfig");
var Config_1 = require("../../../../../utilities/Config");
var dateConfigfn_1 = require("../../../../Hooks/dateConfigfn");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../../utilities/ApiConfig");
var useModalPopup_1 = require("../../../../Comman/ModalPopup/useModalPopup");
var react_router_dom_1 = require("react-router-dom");
var reuse_1 = require("../../Drawer/reuse");
var EMPTY_PAYLOAD = function (type) { return ({
    ID: 0,
    type: type,
    userCode: type === "labour-hire"
        ? "LH-".concat(Date.now().toString().slice(-4))
        : "AG-".concat(Date.now().toString().slice(-4)),
    nationality: "Local",
    firstName: "",
    lastName: "",
    companyName: "",
    designation: "",
    numberOfUsers: "",
    contractStart: "",
    contractEnd: "",
    email: "",
    password: "",
    confirmPassword: "",
    isActive: true,
    isEdit: false,
    hrUserId: 0,
}); };
exports.EMPTY_PAYLOAD = EMPTY_PAYLOAD;
// ─── Validation ───────────────────────────────────────────────────────────────
function validate(payload, isEdit) {
    if (isEdit === void 0) { isEdit = false; }
    var e = {};
    if (!payload.firstName.trim())
        e.firstName = "First name is required";
    if (!payload.lastName.trim())
        e.lastName = "Last name is required";
    if (!payload.companyName.trim())
        e.companyName = "Company name is required";
    if (!payload.email.trim()) {
        e.email = "Email is required";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        e.email = "Invalid email address";
    }
    // In edit mode password is optional — only validate if the user typed something
    var pwEntered = payload.password.length > 0;
    if (!isEdit || pwEntered) {
        if (!payload.password) {
            e.password = "Password is required";
        }
        else {
            var failedRule = reuse_1.PASSWORD_RULES.find(function (r) { return !r.test(payload.password); });
            if (failedRule) {
                e.password =
                    "Password must be at least 10 characters and include an uppercase letter, a lowercase letter, a number, and a special character.";
            }
        }
        if (payload.password && payload.password !== payload.confirmPassword) {
            e.confirmPassword = "Passwords do not match";
        }
    }
    if (!payload.contractStart)
        e.contractStart = "Start date is required";
    if (!payload.contractEnd)
        e.contractEnd = "End date is required";
    if (payload.contractStart &&
        payload.contractEnd &&
        payload.contractEnd <= payload.contractStart) {
        e.contractEnd = "End date must be after start date";
    }
    return e;
}
// ─── Hook ─────────────────────────────────────────────────────────────────────
var useSaveAdminPanel = function (initialType) {
    var _a = (0, react_1.useState)((0, exports.EMPTY_PAYLOAD)(initialType)), payload = _a[0], setPayload = _a[1];
    var _b = (0, react_1.useState)(false), isSaving = _b[0], setIsSaving = _b[1];
    var _c = (0, react_1.useState)({}), errors = _c[0], setErrors = _c[1];
    var _d = (0, useModalPopup_1.useModalPopup)(), modalState = _d.modalState, showModal = _d.showModal, closeModal = _d.closeModal;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var setField = function (key, value) {
        setPayload(function (prev) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, prev), (_a = {}, _a[key] = value, _a)));
        });
        // Clear that field's error on change
        setErrors(function (prev) {
            var next = tslib_1.__assign({}, prev);
            delete next[key];
            return next;
        });
    };
    var toggleActive = function () {
        return setPayload(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { isActive: !prev.isActive })); });
    };
    var reset = function (type) {
        setPayload((0, exports.EMPTY_PAYLOAD)(type));
        setErrors({});
    };
    var save = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var validationErrors, SubmitData, Admindata_1, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validationErrors = validate(payload);
                    if (Object.keys(validationErrors).length > 0) {
                        setErrors(validationErrors);
                        return [2 /*return*/, false];
                    }
                    setIsSaving(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    SubmitData = {
                        firstname: payload.firstName,
                        lastname: payload.lastName,
                        contactNumber: "99999999",
                        email: payload.email,
                        password: payload.password,
                        isActive: payload.isActive ? 1 : 0,
                        isEdit: payload.isEdit, // props.stateValue.ButtonAction === ButtonAction.New ? false : true,
                        type: payload.type === "agency"
                            ? Config_1.ExternalUserType.Agent
                            : Config_1.ExternalUserType.LabourHire,
                        exUserCode: payload.userCode,
                        userId: payload.userCode,
                        name: payload === null || payload === void 0 ? void 0 : payload.companyName,
                        isExpat: payload.nationality === ConditionConfig_1.Nationality.Expatriate ? 1 : 0,
                        noOfUsers: payload.numberOfUsers ? Number(payload.numberOfUsers) : 0,
                        hrUserId: payload.hrUserId.toString(),
                        contractStartDate: (0, dateConfigfn_1.toUTC)(payload === null || payload === void 0 ? void 0 : payload.contractStart),
                        contractEndDate: (0, dateConfigfn_1.toUTC)(payload === null || payload === void 0 ? void 0 : payload.contractEnd),
                        designation: payload.designation,
                        externalUserAccounts: [],
                    };
                    Admindata_1 = {
                        ExternalID: payload.ID,
                        FirstName: payload.firstName,
                        LastName: payload.lastName,
                        CompanyName: payload.companyName,
                        Designation: payload.designation,
                        EmailID: payload.email,
                        UserType: payload.type === "agency"
                            ? Config_1.ExternalUserType.Agent
                            : Config_1.ExternalUserType.LabourHire,
                        Password: payload.password,
                        ConfirmPassword: payload.confirmPassword,
                        IsActive: payload.isActive,
                        NoOfUsers: payload.numberOfUsers,
                        StartDateOfContract: new Date(payload.contractStart),
                        EndDateOfContract: new Date(payload.contractEnd),
                        Nationality: { key: 0, text: payload.nationality },
                        AgentCode: payload.userCode,
                        AddUser: [],
                    };
                    return [4 /*yield*/, ServiceExport_1.AdminPanelServices.UpsertExternalUser(SubmitData).then(function (res) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            var IsEdit, InsertList;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(res.status === ApiConfig_1.ResponeStatus.SUCCESS)) return [3 /*break*/, 2];
                                        IsEdit = payload.isEdit ? true : false;
                                        return [4 /*yield*/, ServiceExport_1.AdminPanelServices.InsertExternalUser(Admindata_1, IsEdit)];
                                    case 1:
                                        InsertList = _a.sent();
                                        if (InsertList.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                                            showModal({
                                                type: "success",
                                                title: "Submitted Successfully",
                                                message: IsEdit
                                                    ? payload.type === "agency"
                                                        ? ConditionConfig_1.RecuritmentHRMsg.UpdateagentMsg
                                                        : ConditionConfig_1.RecuritmentHRMsg.UpdateLabourHireMsg
                                                    : payload.type === "agency"
                                                        ? ConditionConfig_1.RecuritmentHRMsg.AddAgentSuccessMsg
                                                        : ConditionConfig_1.RecuritmentHRMsg.AddLabourHireSuccessMsg,
                                                confirmLabel: "Ok",
                                                onConfirm: function () {
                                                    closeModal();
                                                    navigate("/AdminPanelDashboard");
                                                },
                                            });
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 800); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    err_1 = _a.sent();
                    console.error("Save admin user failed:", err_1);
                    return [2 /*return*/, false];
                case 5:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return {
        payload: payload,
        setField: setField,
        toggleActive: toggleActive,
        isSaving: isSaving,
        errors: errors,
        save: save,
        reset: reset,
        modalState: modalState,
        closeModal: closeModal,
    };
};
exports.useSaveAdminPanel = useSaveAdminPanel;
//# sourceMappingURL=Saveadminpanel.js.map