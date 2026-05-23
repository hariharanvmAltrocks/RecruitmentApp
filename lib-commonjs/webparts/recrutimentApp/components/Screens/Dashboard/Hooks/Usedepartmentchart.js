"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var useDepartmentChart = function (_a) {
    var itemsPerPage = _a.itemsPerPage, refreshKey = _a.refreshKey;
    var _b = (0, react_1.useState)(0), startIndex = _b[0], setStartIndex = _b[1];
    var _c = (0, react_1.useState)([]), data = _c[0], setData = _c[1];
    var fetchDepartmentPosition = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var res, data_1, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, ServiceExport_1.DashboardServices.GetDepartmentDetails()];
                case 1:
                    res = _a.sent();
                    data_1 = res.data || [];
                    if (res.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        setData(data_1);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error("Dashboard urgent tasks error", error_1);
                    return [3 /*break*/, 4];
                case 3: return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [refreshKey]);
    (0, react_1.useEffect)(function () {
        void fetchDepartmentPosition();
    }, [fetchDepartmentPosition, refreshKey]);
    var sortedData = (0, react_1.useMemo)(function () { return tslib_1.__spreadArray([], data, true).sort(function (a, b) { return b.value - a.value; }); }, [data]);
    var totalPages = Math.ceil(sortedData.length / itemsPerPage);
    var currentPage = Math.floor(startIndex / itemsPerPage) + 1;
    var hasNext = startIndex + itemsPerPage < sortedData.length;
    var hasPrev = startIndex > 0;
    var visibleData = (0, react_1.useMemo)(function () { return sortedData.slice(startIndex, startIndex + itemsPerPage); }, [sortedData, startIndex, itemsPerPage]);
    var handleNext = (0, react_1.useCallback)(function () {
        if (hasNext)
            setStartIndex(function (prev) { return prev + itemsPerPage; });
    }, [hasNext, itemsPerPage]);
    var handlePrev = (0, react_1.useCallback)(function () {
        if (hasPrev)
            setStartIndex(function (prev) { return Math.max(0, prev - itemsPerPage); });
    }, [hasPrev, itemsPerPage]);
    var goToPage = (0, react_1.useCallback)(function (page) {
        var clamped = Math.max(1, Math.min(page, totalPages));
        setStartIndex((clamped - 1) * itemsPerPage);
    }, [totalPages, itemsPerPage]);
    return {
        visibleData: visibleData,
        currentPage: currentPage,
        totalPages: totalPages,
        hasPrev: hasPrev,
        hasNext: hasNext,
        handleNext: handleNext,
        handlePrev: handlePrev,
        goToPage: goToPage,
        startIndex: startIndex,
        totalItems: sortedData.length,
    };
};
exports.default = useDepartmentChart;
//# sourceMappingURL=Usedepartmentchart.js.map