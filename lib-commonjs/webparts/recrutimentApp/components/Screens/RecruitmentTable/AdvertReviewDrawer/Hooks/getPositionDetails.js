"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePositionDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../../utilities/ApiConfig");
var UIStateContext_1 = require("../../../../RecrutimentApp/UIStateContext");
var metricColumns_config_1 = require("../../../Dashboard/metricColumns.config");
var Config_1 = require("../../../../../utilities/Config");
var usePositionDetails = function (jobId, type) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var MatricID = (0, UIStateContext_1.useUIState)().MatricID;
    (0, react_1.useEffect)(function () {
        if (!jobId) {
            setData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var Filter, condition, response, IDFilter, filterObj, _a, data_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Filter = metricColumns_config_1.MetricQueryConfig[MatricID];
                        condition = "and";
                        IDFilter = [
                            { FilterKey: "ID", Operator: "in", FilterValue: jobId },
                        ];
                        if (!(MatricID != 0)) return [3 /*break*/, 6];
                        filterObj = Array.isArray(Filter) ? Filter[0] : Filter;
                        _a = filterObj.ListName;
                        switch (_a) {
                            case Config_1.ListNames.HRMSNewPositionRequest: return [3 /*break*/, 1];
                            case Config_1.ListNames.HRMSRecruitmentDptDetails: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, ServiceExport_1.RecruitmentServices.GetNPAEPVRRDetails(IDFilter, condition, type)];
                    case 2:
                        response = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, ServiceExport_1.RecruitmentServices.GetRecruitmentDetails(IDFilter, condition)];
                    case 4:
                        response = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, ServiceExport_1.RecruitmentServices.GetRecruitmentDetails(IDFilter, condition)];
                    case 7:
                        response = _b.sent();
                        _b.label = 8;
                    case 8:
                        if (response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                            data_1 = response.data[0];
                            setData(data_1);
                            setLoading(false);
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 650);
        return function () { return clearTimeout(timer); };
    }, [jobId, MatricID, type]);
    return { data: data, loading: loading };
};
exports.usePositionDetails = usePositionDetails;
//# sourceMappingURL=getPositionDetails.js.map