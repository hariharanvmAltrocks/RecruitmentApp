"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvertExtends = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var ServiceExport_1 = require("../../../../../../services/ServiceExport");
var spservice_1 = tslib_1.__importDefault(require("../../../../../../services/SPService/spservice"));
var Config_1 = require("../../../../../../utilities/Config");
var dateConfigfn_1 = require("../../../../../Hooks/dateConfigfn");
var useModalPopup_1 = require("../../../../../Comman/ModalPopup/useModalPopup");
var ConditionConfig_1 = require("../../../../../../utilities/ConditionConfig");
var useAdvertExtends = function (handleClosePopup, handleRefresh, setAdvertPopupOpen) {
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var Submitted = (0, react_1.useRef)(false);
    var _b = (0, useModalPopup_1.useModalPopup)(), modalState = _b.modalState, showModal = _b.showModal, closeModal = _b.closeModal;
    var handleAdvertExtend = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var filterConditions, Conditions, IsActive, IsExtened, portalRes, todaydate, vaildFrom, VaildTo, labels, error_1;
        var _a;
        var _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    Submitted.current = true;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    setLoading(true);
                    filterConditions = [
                        {
                            FilterKey: "JobCodeId",
                            Operator: "eq",
                            FilterValue: payload.form.JobCodeId,
                        },
                    ];
                    Conditions = "";
                    IsActive = 1;
                    IsExtened = 1;
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.UploadAdvertisementInPortal(filterConditions, Conditions, payload.form, IsActive, IsExtened, undefined, // JobBasedBGVVerification (optional)
                        undefined, // onemDocs (optional)
                        payload.extendStartDate, payload.extendEndDate)];
                case 2:
                    portalRes = _c.sent();
                    if ((portalRes === null || portalRes === void 0 ? void 0 : portalRes.status) !== 200) {
                        Submitted.current = false;
                        showModal({
                            type: "error",
                            title: "Advert Extend Failed",
                            message: "Something went wrong. Please try again.",
                            confirmLabel: "OK",
                            onConfirm: function () {
                                closeModal();
                                handleClosePopup();
                                navigate("/MyTracker");
                                handleRefresh();
                                setAdvertPopupOpen(false);
                            },
                        });
                    }
                    todaydate = new Date();
                    vaildFrom = todaydate;
                    VaildTo = (0, dateConfigfn_1.AddCalculateDate)(todaydate, 13);
                    labels = payload.isSecondExtension
                        ? "JobPostingFirstExtensionEndDate"
                        : "JobPostingSecondExtensionEndDate";
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                            RequestJSON: (_a = {},
                                _a[labels] = (0, dateConfigfn_1.SpiltDateOnly)(VaildTo),
                                _a),
                            ID: (_b = payload.form) === null || _b === void 0 ? void 0 : _b.ID,
                        })];
                case 3:
                    _c.sent();
                    showModal({
                        type: "success",
                        title: "Assigned Successfully",
                        message: ConditionConfig_1.RecuritmentHRMsg.AdvertExtendsionSuccessMsg,
                        confirmLabel: "OK",
                        onConfirm: function () {
                            closeModal();
                            handleClosePopup();
                            navigate("/MyTracker");
                            handleRefresh();
                            setAdvertPopupOpen(false);
                        },
                    });
                    Submitted.current = true;
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _c.sent();
                    Submitted.current = false;
                    console.error("Critical error during submission:", error_1);
                    showModal({
                        type: "error",
                        title: "Advert Extend Failed",
                        message: "Something went wrong. Please try again.",
                        confirmLabel: "OK",
                        onConfirm: function () {
                            closeModal();
                            handleClosePopup();
                            navigate("/MyTracker");
                            handleRefresh();
                        },
                    });
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [navigate, showModal, closeModal]);
    return {
        handleAdvertExtend: handleAdvertExtend,
        Submitted: Submitted,
        modalState: modalState,
        closeModal: closeModal,
        loading: loading,
    };
};
exports.useAdvertExtends = useAdvertExtends;
//# sourceMappingURL=useadvertextend.js.map