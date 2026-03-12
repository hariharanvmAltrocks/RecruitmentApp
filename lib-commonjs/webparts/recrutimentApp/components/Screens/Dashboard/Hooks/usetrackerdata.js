"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrackerData = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var metricColumns_config_1 = require("../metricColumns.config");
var useTrackerData = function (MatricID) {
    var _a = (0, react_1.useState)([]), trackerData = _a[0], setTrackerData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var fetchtrackerData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var condition, Filter, res, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    condition = "and";
                    Filter = metricColumns_config_1.MetricQueryConfig[MatricID];
                    return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails(Filter.Filter[0], condition)];
                case 1:
                    res = _a.sent();
                    if (res.status == ApiConfig_1.ResponeStatus.SUCCESS) {
                        setTrackerData(res.data || []);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error("Dashboard metrics error", error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [MatricID]);
    (0, react_1.useEffect)(function () {
        if (!MatricID)
            return;
        fetchtrackerData();
    }, [MatricID, fetchtrackerData]);
    return {
        trackerData: trackerData,
        loading: loading,
        refresh: fetchtrackerData
    };
};
exports.useTrackerData = useTrackerData;
//# sourceMappingURL=usetrackerdata.js.map