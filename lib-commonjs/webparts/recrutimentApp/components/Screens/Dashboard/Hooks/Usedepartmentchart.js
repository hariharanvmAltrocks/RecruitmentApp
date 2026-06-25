"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var useDepartmentChart = function (_a) {
    var itemsPerPage = _a.itemsPerPage, refreshKey = _a.refreshKey;
    var _b = (0, react_1.useState)(0), startIndex = _b[0], setStartIndex = _b[1];
    var _c = (0, react_1.useState)([]), data = _c[0], setData = _c[1];
    var DepartmentData = (0, RoleContext_1.useRoleContext)().DepartmentData;
    var fetchDepartmentPosition = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            try {
                // const res = await DashboardServices.GetDepartmentDetails();
                setData(DepartmentData);
            }
            catch (error) {
                console.error("Dashboard urgent tasks error", error);
            }
            finally {
            }
            return [2 /*return*/];
        });
    }); }, [refreshKey]);
    (0, react_1.useEffect)(function () {
        void fetchDepartmentPosition();
    }, [fetchDepartmentPosition, refreshKey]);
    var sortedData = (0, react_1.useMemo)(function () { return tslib_1.__spreadArray([], data, true).sort(function (a, b) { return b.value - a.value; }); }, [data]);
    var totalPositions = (0, react_1.useMemo)(function () { return data.reduce(function (acc, curr) { return acc + curr.value; }, 0); }, [data]);
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
        totalPositions: totalPositions,
    };
};
exports.default = useDepartmentChart;
//# sourceMappingURL=Usedepartmentchart.js.map