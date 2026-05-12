"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEPARTMENT_DATA = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
exports.DEPARTMENT_DATA = [
    { name: "Construction", value: 85 },
    { name: "Mining", value: 78 },
    { name: "Management Accounting", value: 72 },
    { name: "Human Resource", value: 68 },
    { name: "Technology", value: 65 },
    { name: "Camp and Facilities", value: 62 },
    { name: "HSE", value: 58 },
    { name: "Risk Control", value: 54 },
    { name: "Engineering", value: 48 },
    { name: "Processing", value: 42 },
    { name: "Procurement", value: 38 },
    { name: "Supply Chain", value: 35 },
    { name: "Sales and Logistics", value: 31 },
    { name: "Security", value: 28 },
    { name: "Asset Management", value: 25 },
    { name: "Concentrator", value: 22 },
    { name: "Smelter", value: 20 },
    { name: "Finance", value: 18 },
    { name: "Compliance", value: 16 },
    { name: "Community Relations", value: 14 },
    { name: "Environment", value: 12 },
    { name: "Sustainability", value: 11 },
    { name: "Quality Control", value: 10 },
    { name: "Internal Audit", value: 8 },
    { name: "Corporate Affairs", value: 6 },
    { name: "Legal", value: 5 },
    { name: "Strategy", value: 4 },
    { name: "Training", value: 3 },
];
var useDepartmentChart = function (_a) {
    var data = _a.data, _b = _a.itemsPerPage, itemsPerPage = _b === void 0 ? 7 : _b;
    var _c = (0, react_1.useState)(0), startIndex = _c[0], setStartIndex = _c[1];
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