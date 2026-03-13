"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrackerData = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var metricColumns_config_1 = require("../metricColumns.config");
var Config_1 = require("../../../../utilities/Config");
var useTrackerData = function (MatricID) {
    var _a = (0, react_1.useState)([]), trackerData = _a[0], setTrackerData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var fetchtrackerData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var condition, Filter, response, _a, error_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, 11, 12]);
                    setLoading(true);
                    condition = "and";
                    Filter = metricColumns_config_1.MetricQueryConfig[MatricID];
                    console.log(Filter);
                    response = void 0;
                    _a = Filter.ListName;
                    switch (_a) {
                        case Config_1.ListNames.HRMSNewPositionRequest: return [3 /*break*/, 1];
                        case Config_1.ListNames.HRMSRecruitmentDptDetails: return [3 /*break*/, 3];
                        case Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails: return [3 /*break*/, 5];
                        case Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 1: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetNPAEPVRRDetails(Filter.Filter, condition)];
                case 2:
                    response = _b.sent();
                    return [3 /*break*/, 9];
                case 3: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails(Filter.Filter, condition)];
                case 4:
                    response = _b.sent();
                    return [3 /*break*/, 9];
                case 5: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetCandidateDetails(Filter.Filter, condition)];
                case 6:
                    response = _b.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetSelectedCandidate(Filter.Filter, condition)];
                case 8:
                    response = _b.sent();
                    return [3 /*break*/, 9];
                case 9:
                    if (response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        setTrackerData(response.data);
                    }
                    return [3 /*break*/, 12];
                case 10:
                    error_1 = _b.sent();
                    console.error("Dashboard metrics error", error_1);
                    return [3 /*break*/, 12];
                case 11:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); }, [MatricID]);
    (0, react_1.useEffect)(function () {
        if (!MatricID)
            return;
        void fetchtrackerData();
    }, [MatricID, fetchtrackerData]);
    return {
        trackerData: trackerData,
        loading: loading,
        refresh: fetchtrackerData
    };
};
exports.useTrackerData = useTrackerData;
//# sourceMappingURL=usetrackerdata.js.map