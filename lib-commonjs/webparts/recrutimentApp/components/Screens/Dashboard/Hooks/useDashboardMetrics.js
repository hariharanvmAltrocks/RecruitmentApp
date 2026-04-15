"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardMetrics = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var metricColumns_config_1 = require("../metricColumns.config");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var useDashboardMetrics = function (refreshKey) {
    var _a = (0, RoleContext_1.useRoleContext)(), roleIDs = _a.roleIDs, ADGroupData = _a.ADGroupData;
    var _b = (0, react_1.useState)([]), metrics = _b[0], setMetrics = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    console.log(ADGroupData.EmailId, "EmailId");
    var queries = (0, react_1.useMemo)(function () {
        return (0, metricColumns_config_1.getRoleBasedFilters)(roleIDs, ADGroupData.EmailId[0]);
    }, [roleIDs]);
    var fetchMetrics = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, ServiceExport_1.DashboardServices.GetDashboardCount(queries, roleIDs, ADGroupData.EmailId[0])];
                case 1:
                    data = _a.sent();
                    if (data.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        setMetrics(data.data);
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
    }); }, [queries]);
    (0, react_1.useEffect)(function () {
        if (!queries.length)
            return;
        void fetchMetrics();
    }, [fetchMetrics, queries, refreshKey]);
    var memoizedMetrics = (0, react_1.useMemo)(function () { return metrics; }, [metrics]);
    return {
        metrics: memoizedMetrics,
        loading: loading,
        refresh: fetchMetrics,
    };
};
exports.useDashboardMetrics = useDashboardMetrics;
//# sourceMappingURL=useDashboardMetrics.js.map