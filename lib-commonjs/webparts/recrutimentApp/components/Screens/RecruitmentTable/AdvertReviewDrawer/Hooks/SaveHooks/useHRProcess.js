"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHRProcess = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var useUpdateMainRecord_1 = require("./useUpdateMainRecord");
var ServiceExport_1 = require("../../../../../../services/ServiceExport");
var Config_1 = require("../../../../../../utilities/Config");
var ApiConfig_1 = require("../../../../../../utilities/ApiConfig");
var ConditionConfig_1 = require("../../../../../../utilities/ConditionConfig");
var serialize = function (arr, mapFn) {
    return arr && arr.length > 0 ? JSON.stringify(arr.map(mapFn)) : "[]";
};
var useHRProcess = function (form, currentRoleID, docs) {
    var updateMainRecord = (0, useUpdateMainRecord_1.useUpdateMainRecord)(form, currentRoleID).updateMainRecord;
    var handleHRProcess = (0, react_1.useCallback)(function (finalize) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var filterConditions, Conditions, IsActive, IsExtened, portalRes;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filterConditions = [
                        {
                            FilterKey: "JobCodeId",
                            Operator: "eq",
                            FilterValue: form.JobCodeId,
                        },
                    ];
                    Conditions = "";
                    IsActive = 0;
                    IsExtened = 0;
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.UploadAdvertisementInPortal(filterConditions, Conditions, form, IsActive, IsExtened)];
                case 1:
                    portalRes = _a.sent();
                    if (portalRes.status !== ApiConfig_1.ResponeStatus.SUCCESS)
                        throw new Error("Portal Error");
                    return [4 /*yield*/, Promise.all([
                            updateMainRecord(),
                            ServiceExport_1.CommonServices.uploadAttachmentToLibrary(form.JobCode, docs || [], Config_1.DocumentLibraray.RecruitmentAdvertisementDocument),
                        ])];
                case 2:
                    _a.sent();
                    //   finalize(
                    //     formState?.AdvertisementDocument?.length === 0
                    //       ? RecuritmentHRMsg.AdvertisementSubmitMsg
                    //       : RecuritmentHRMsg.AdvertisementReveiwMsg
                    //   );
                    finalize(ConditionConfig_1.RecuritmentHRMsg.AdvertisementSubmitMsg);
                    return [2 /*return*/];
            }
        });
    }); }, [form, updateMainRecord]);
    return { handleHRProcess: handleHRProcess };
};
exports.useHRProcess = useHRProcess;
//# sourceMappingURL=useHRProcess.js.map