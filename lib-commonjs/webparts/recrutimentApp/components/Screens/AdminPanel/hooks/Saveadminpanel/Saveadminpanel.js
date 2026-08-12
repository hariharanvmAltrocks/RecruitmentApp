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
    userCode: type === "agency" ? "ANT001" : "LCH001",
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
    if (isEdit || pwEntered) {
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
var useSaveAdminPanel = function (initialType, onSuccess) {
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
    var resetPassword = function () {
        ServiceExport_1.AdminPanelServices.ResetPassword(payload.email)
            .then(function (res) {
            if (res.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                showModal({
                    type: "success",
                    title: "Submitted Successfully",
                    message: ConditionConfig_1.RecuritmentHRMsg.ResetPasswordMsg,
                    confirmLabel: "Ok",
                    onConfirm: function () {
                        closeModal();
                        navigate("/AdminPanelDashboard");
                        onSuccess();
                    },
                });
            }
        })
            .catch(function (error) {
            console.error("Error while Resetting Password:", error);
        });
    };
    var save = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var validationErrors, SubmitData, responseAgent, Filter, responseAgent_1, Admindata_1, err_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    validationErrors = validate(payload);
                    if (Object.keys(validationErrors).length > 0) {
                        setErrors(validationErrors);
                        return [2 /*return*/, false];
                    }
                    setIsSaving(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    SubmitData = {
                        firstname: payload.firstName,
                        lastname: payload.lastName,
                        contactNumber: "99999999",
                        email: payload.email,
                        password: payload.password === "" ? "1234567890" : payload.password,
                        isActive: payload.isActive ? 1 : 0,
                        isEdit: payload.isEdit,
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
                    responseAgent = void 0;
                    if (!payload.isEdit) return [3 /*break*/, 3];
                    Filter = [
                        {
                            FilterKey: "AgentCode",
                            Operator: "eq",
                            FilterValue: payload.userCode,
                        },
                    ];
                    return [4 /*yield*/, ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSExternalAgents, Filter)];
                case 2:
                    responseAgent_1 = _b.sent();
                    _b.label = 3;
                case 3:
                    Admindata_1 = {
                        ExternalID: responseAgent && responseAgent.data.length > 0
                            ? (_a = responseAgent.data[0]) === null || _a === void 0 ? void 0 : _a.ID
                            : 0,
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
                            var responseData, responseCode, responseMessage, isDuplicateEmail, isServerError, IsEdit, InsertList;
                            var _a, _b, _c, _d, _e, _f;
                            return tslib_1.__generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0:
                                        responseData = ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data) || (res === null || res === void 0 ? void 0 : res.data);
                                        responseCode = (_c = (_b = responseData === null || responseData === void 0 ? void 0 : responseData.code) !== null && _b !== void 0 ? _b : responseData === null || responseData === void 0 ? void 0 : responseData.status) !== null && _c !== void 0 ? _c : res === null || res === void 0 ? void 0 : res.status;
                                        responseMessage = (_f = (_e = (_d = responseData === null || responseData === void 0 ? void 0 : responseData.message) !== null && _d !== void 0 ? _d : responseData === null || responseData === void 0 ? void 0 : responseData.msg) !== null && _e !== void 0 ? _e : res === null || res === void 0 ? void 0 : res.message) !== null && _f !== void 0 ? _f : "";
                                        isDuplicateEmail = responseCode === 400 ||
                                            responseMessage === "ER102" ||
                                            (typeof responseMessage === "string" && responseMessage.includes("ER102")) ||
                                            (responseData === null || responseData === void 0 ? void 0 : responseData.code) === "ER102";
                                        isServerError = responseCode === 500 || (res === null || res === void 0 ? void 0 : res.status) === 500;
                                        if (!isDuplicateEmail) return [3 /*break*/, 1];
                                        showModal({
                                            type: "warning",
                                            title: "Validation Error",
                                            message: "This email is already created, try another email to create",
                                            confirmLabel: "Ok",
                                            onConfirm: function () {
                                                closeModal();
                                            },
                                        });
                                        return [3 /*break*/, 5];
                                    case 1:
                                        if (!isServerError) return [3 /*break*/, 2];
                                        showModal({
                                            type: "error",
                                            title: "Server Error",
                                            message: "Server is temporarily unavailable",
                                            confirmLabel: "Ok",
                                            onConfirm: function () {
                                                closeModal();
                                            },
                                        });
                                        return [3 /*break*/, 5];
                                    case 2:
                                        if (!(res.status === ApiConfig_1.ResponeStatus.SUCCESS &&
                                            (responseCode === 200 || !responseCode || responseCode === 201))) return [3 /*break*/, 4];
                                        IsEdit = payload.isEdit ? true : false;
                                        return [4 /*yield*/, ServiceExport_1.AdminPanelServices.InsertExternalUser(Admindata_1, IsEdit)];
                                    case 3:
                                        InsertList = _g.sent();
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
                                                    onSuccess();
                                                },
                                            });
                                        }
                                        else {
                                            showModal({
                                                type: "error",
                                                title: "Server Error",
                                                message: "Server is temporarily unavailable",
                                                confirmLabel: "Ok",
                                                onConfirm: function () {
                                                    closeModal();
                                                },
                                            });
                                        }
                                        return [3 /*break*/, 5];
                                    case 4:
                                        showModal({
                                            type: "error",
                                            title: "Server Error",
                                            message: "Server is temporarily unavailable",
                                            confirmLabel: "Ok",
                                            onConfirm: function () {
                                                closeModal();
                                            },
                                        });
                                        _g.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/, true];
                case 5:
                    err_1 = _b.sent();
                    console.error("Save admin user failed:", err_1);
                    return [2 /*return*/, false];
                case 6:
                    setIsSaving(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
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
        resetPassword: resetPassword,
        reset: reset,
        modalState: modalState,
        closeModal: closeModal,
    };
};
exports.useSaveAdminPanel = useSaveAdminPanel;
//# sourceMappingURL=Saveadminpanel.js.map