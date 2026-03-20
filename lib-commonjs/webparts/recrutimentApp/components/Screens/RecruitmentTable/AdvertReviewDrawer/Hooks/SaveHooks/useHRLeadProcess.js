"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHRLeadProcess = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var useUpdateMainRecord_1 = require("./useUpdateMainRecord");
var ConditionConfig_1 = require("../../../../../../utilities/ConditionConfig");
var ServiceExport_1 = require("../../../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../../../utilities/ApiConfig");
var dateConfigfn_1 = require("../../../../../Hooks/dateConfigfn");
var serialize = function (arr, mapFn) {
    return arr && arr.length > 0 ? JSON.stringify(arr.map(mapFn)) : "[]";
};
var useHRLeadProcess = function (form, currentRoleID, onemDocs, BgvData) {
    var updateMainRecord = (0, useUpdateMainRecord_1.useUpdateMainRecord)(form, currentRoleID).updateMainRecord;
    var handleHRLeadProcess = (0, react_1.useCallback)(function (finalize) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var filterConditions, Conditions, IsActive, IsExtened, JobBasedBGVVerification, portalRes, bgvData, bgvRes, todaydate, vaildFrom, VaildTo;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filterConditions = [
                        {
                            FilterKey: "JobCode",
                            Operator: "eq",
                            FilterValue: form.JobCodeId,
                        },
                    ];
                    Conditions = "";
                    IsActive = 1;
                    IsExtened = 0;
                    JobBasedBGVVerification = serialize(BgvData, function (i) { return ({ verificationType: i.key, isActive: i.checked }); });
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.UploadAdvertisementInPortal(filterConditions, Conditions, form, IsActive, IsExtened, JobBasedBGVVerification)];
                case 1:
                    portalRes = _a.sent();
                    if ((portalRes === null || portalRes === void 0 ? void 0 : portalRes.status) !== 200)
                        throw new Error("Portal Error");
                    bgvData = BgvData
                        .filter(function (i) { return i.checked; })
                        .map(function (i) { return ({
                        jobCode: form.JobCode,
                        verificationType: i.key,
                        department: (form === null || form === void 0 ? void 0 : form.Dptcode) || "",
                        nationality: ConditionConfig_1.NationalityCode.SouthAfrica,
                        isActive: i.checked,
                    }); });
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.UpsertBGVJobMaster(bgvData)];
                case 2:
                    bgvRes = _a.sent();
                    if (bgvRes.status !== ApiConfig_1.ResponeStatus.SUCCESS)
                        throw new Error("BGV Error");
                    todaydate = new Date();
                    vaildFrom = todaydate;
                    VaildTo = (0, dateConfigfn_1.AddCalculateDate)(todaydate, 13);
                    return [4 /*yield*/, Promise.all([
                            updateMainRecord({
                                JobPostingStartDate: (0, dateConfigfn_1.SpiltDateOnly)(vaildFrom),
                                JobPostingEndDate: (0, dateConfigfn_1.SpiltDateOnly)(VaildTo),
                            }),
                            ServiceExport_1.CommonServices.uploadAttachmentToLibrary(form.JobCode, onemDocs || [], "ONAMSignedStampDocuments"),
                        ])];
                case 3:
                    _a.sent();
                    //   finalize(RecuritmentHRMsg.ONEMDocumentMsg);
                    finalize("Submitted ONEM Document");
                    return [2 /*return*/];
            }
        });
    }); }, [form, updateMainRecord]);
    return { handleHRLeadProcess: handleHRLeadProcess };
};
exports.useHRLeadProcess = useHRLeadProcess;
//# sourceMappingURL=useHRLeadProcess.js.map