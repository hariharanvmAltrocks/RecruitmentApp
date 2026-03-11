"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardMetrics = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var useFilterMatricCard_1 = require("./useFilterMatricCard");
var data_1 = require("../../../MockData/data");
var Config_1 = require("../../../../utilities/Config");
var useDashboardMetrics = function () {
    var _a = (0, react_1.useState)([]), metrics = _a[0], setMetrics = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    // ✅ Build queries once
    var queries = (0, react_1.useMemo)(function () {
        return (0, useFilterMatricCard_1.getRoleBasedFilters)(Config_1.RoleID.LineManager);
    }, []);
    var mergeMetrics = (0, react_1.useCallback)(function (dbData) {
        if (dbData === void 0) { dbData = {}; }
        return data_1.METRICS.map(function (metric) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, metric), { value: Number((_a = dbData === null || dbData === void 0 ? void 0 : dbData[metric.id]) !== null && _a !== void 0 ? _a : 0) }));
        });
    }, []);
    var fetchMetrics = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, mergedMetrics, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, spservice_1.default.batchGet(queries)];
                case 1:
                    data = _a.sent();
                    console.log("DB Data:", data);
                    mergedMetrics = mergeMetrics(data);
                    setMetrics(mergedMetrics);
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
    }); }, [queries, mergeMetrics]);
    (0, react_1.useEffect)(function () {
        if (!queries.length)
            return;
        fetchMetrics();
    }, [fetchMetrics, queries]);
    var memoizedMetrics = (0, react_1.useMemo)(function () { return metrics; }, [metrics]);
    return {
        metrics: memoizedMetrics,
        loading: loading,
        refresh: fetchMetrics
    };
};
exports.useDashboardMetrics = useDashboardMetrics;
//# sourceMappingURL=useDashboardMetrics.js.map