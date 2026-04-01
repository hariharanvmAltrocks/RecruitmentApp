"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("./DataTable.scss");
var getRowIdFallback = function (row, index) {
    var possibleId = row.id;
    return possibleId !== null && possibleId !== void 0 ? possibleId : String(index);
};
var buildCellValue = function (row, column) {
    if (column.render) {
        return column.render(row);
    }
    if (column.accessor) {
        var value = row[column.accessor];
        return value === null || value === undefined ? "-" : String(value);
    }
    return "-";
};
var DataTable = function (_a) {
    var columns = _a.columns, data = _a.data, _b = _a.enableCheckbox, enableCheckbox = _b === void 0 ? false : _b, _c = _a.selectedRowIds, selectedRowIds = _c === void 0 ? [] : _c, _d = _a.getRowId, getRowId = _d === void 0 ? getRowIdFallback : _d, onToggleRow = _a.onToggleRow, onToggleAll = _a.onToggleAll, pageSize = _a.pageSize, currentPage = _a.currentPage, totalCount = _a.totalCount, onPageChange = _a.onPageChange, _e = _a.pageSizeOptions, pageSizeOptions = _e === void 0 ? [5, 10, 20, 50] : _e, onPageSizeChange = _a.onPageSizeChange, _f = _a.loading, loading = _f === void 0 ? false : _f, _g = _a.emptyMessage, emptyMessage = _g === void 0 ? "No records found." : _g, onRowClick = _a.onRowClick;
    var rowIds = (0, react_1.useMemo)(function () { return data.map(function (row, index) { return getRowId(row, index); }); }, [data, getRowId]);
    var allSelected = enableCheckbox && rowIds.length > 0 && rowIds.every(function (id) { return selectedRowIds.includes(id); });
    var someSelected = enableCheckbox && rowIds.some(function (id) { return selectedRowIds.includes(id); }) && !allSelected;
    var totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    var safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
    var rangeStart = totalCount === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    var rangeEnd = Math.min(safeCurrentPage * pageSize, totalCount);
    var pages = Array.from({ length: totalPages }, function (_, i) { return i + 1; });
    var handlePrev = function () {
        if (safeCurrentPage > 1) {
            onPageChange(safeCurrentPage - 1);
        }
    };
    var handleNext = function () {
        if (safeCurrentPage < totalPages) {
            onPageChange(safeCurrentPage + 1);
        }
    };
    var skeletonRows = (0, react_1.useMemo)(function () { return Array.from({ length: 6 }, function (_, index) { return index; }); }, []);
    var totalColumns = columns.length + (enableCheckbox ? 1 : 0);
    return (react_1.default.createElement("div", { className: "data-table__wrapper" },
        react_1.default.createElement("table", { className: "data-table" },
            react_1.default.createElement("thead", { className: "data-table__head" },
                react_1.default.createElement("tr", { className: "data-table__head-row" },
                    enableCheckbox && (react_1.default.createElement("th", { className: "data-table__checkbox-cell" },
                        react_1.default.createElement("button", { className: "data-table__checkbox ".concat(allSelected || someSelected ? "data-table__checkbox--checked" : "").trim(), type: "button", "aria-pressed": allSelected, "aria-label": "Select all rows", onClick: onToggleAll, disabled: !onToggleAll },
                            allSelected ? react_1.default.createElement(lucide_react_1.Check, { size: 12 }) : null,
                            someSelected && !allSelected ? react_1.default.createElement(lucide_react_1.Minus, { size: 12 }) : null))),
                    columns.map(function (column) {
                        var _a;
                        return (react_1.default.createElement("th", { key: column.id, className: [
                                "data-table__head-cell",
                                column.align ? "data-table__head-cell--".concat(column.align) : "",
                                column.hideOnMobile ? "data-table__cell--mobile-hidden" : "",
                                (_a = column.headerClassName) !== null && _a !== void 0 ? _a : "",
                            ].join(" ").trim(), style: column.width ? { width: column.width } : undefined }, column.header));
                    }))),
            react_1.default.createElement("tbody", null,
                loading && (react_1.default.createElement(react_1.default.Fragment, null, skeletonRows.map(function (row) { return (react_1.default.createElement("tr", { className: "data-table__row", key: "skeleton-".concat(row) },
                    enableCheckbox && (react_1.default.createElement("td", { className: "data-table__cell data-table__checkbox-cell" },
                        react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short" }))),
                    columns.map(function (column) {
                        var _a;
                        return (react_1.default.createElement("td", { key: "".concat(column.id, "-skeleton-").concat(row), className: [
                                "data-table__cell",
                                column.hideOnMobile ? "data-table__cell--mobile-hidden" : "",
                                (_a = column.cellClassName) !== null && _a !== void 0 ? _a : "",
                            ].join(" ").trim() },
                            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short" })));
                    }))); }))),
                !loading && data.length === 0 && (react_1.default.createElement("tr", { className: "data-table__row" },
                    react_1.default.createElement("td", { className: "data-table__cell data-table__empty", colSpan: totalColumns }, emptyMessage))),
                !loading &&
                    data.map(function (row, index) {
                        var rowId = getRowId(row, index);
                        var isSelected = selectedRowIds.includes(rowId);
                        return (react_1.default.createElement("tr", { key: rowId, onClick: onRowClick ? function () { return onRowClick(row); } : undefined, style: onRowClick ? { cursor: "pointer" } : undefined, className: "data-table__row ".concat(isSelected ? "data-table__row--selected" : "").trim() },
                            enableCheckbox && (react_1.default.createElement("td", { className: "data-table__cell data-table__checkbox-cell" },
                                react_1.default.createElement("button", { className: "data-table__checkbox ".concat(isSelected ? "data-table__checkbox--checked" : "").trim(), type: "button", "aria-pressed": isSelected, "aria-label": "Select row", onClick: function () { return onToggleRow === null || onToggleRow === void 0 ? void 0 : onToggleRow(rowId); }, disabled: !onToggleRow }, isSelected ? react_1.default.createElement(lucide_react_1.Check, { size: 12 }) : null))),
                            columns.map(function (column) {
                                var _a;
                                return (react_1.default.createElement("td", { key: "".concat(column.id, "-").concat(rowId), className: [
                                        "data-table__cell",
                                        column.align ? "data-table__cell--".concat(column.align) : "",
                                        column.hideOnMobile ? "data-table__cell--mobile-hidden" : "",
                                        (_a = column.cellClassName) !== null && _a !== void 0 ? _a : "",
                                    ].join(" ").trim() }, buildCellValue(row, column)));
                            })));
                    }))),
        react_1.default.createElement("div", { className: "data-table__pagination" },
            react_1.default.createElement("div", { className: "data-table__pagination-summary" }, totalCount === 0 ? ("No records") : (react_1.default.createElement(react_1.default.Fragment, null,
                "Showing ",
                react_1.default.createElement("strong", null, rangeStart),
                " to ",
                react_1.default.createElement("strong", null, rangeEnd),
                " of",
                " ",
                react_1.default.createElement("strong", null, totalCount),
                " results"))),
            onPageSizeChange && (react_1.default.createElement("div", { className: "data-table__page-size" },
                react_1.default.createElement("span", { className: "data-table__page-size-label" }, "Rows per page"),
                react_1.default.createElement("div", { className: "data-table__page-size-group" }, pageSizeOptions.map(function (size) { return (react_1.default.createElement("button", { key: size, type: "button", className: "data-table__page-size-btn ".concat(size === pageSize ? "data-table__page-size-btn--active" : ""), onClick: function () {
                        onPageSizeChange(size);
                        onPageChange(1);
                    } }, size)); })))),
            react_1.default.createElement("div", { className: "data-table__pagination-controls" },
                react_1.default.createElement("button", { className: "data-table__page-arrow", type: "button", onClick: handlePrev, disabled: safeCurrentPage <= 1, "aria-label": "Previous page" }, "\u2039"),
                pages.map(function (page) { return (react_1.default.createElement("button", { key: page, type: "button", className: "data-table__page-number ".concat(page === safeCurrentPage ? "data-table__page-number--active" : ""), onClick: function () { return onPageChange(page); } }, page)); }),
                react_1.default.createElement("button", { className: "data-table__page-arrow", type: "button", onClick: handleNext, disabled: safeCurrentPage >= totalPages, "aria-label": "Next page" }, "\u203A")))));
};
exports.DataTable = DataTable;
//# sourceMappingURL=DataTable.js.map