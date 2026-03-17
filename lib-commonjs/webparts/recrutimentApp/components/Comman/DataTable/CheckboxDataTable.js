"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxDataTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("../../Screens/RecruitmentTable/Components/DataTable/DataTable.scss");
var CheckboxRow = (0, react_1.memo)(function (_a) {
    var item = _a.item, isSelected = _a.isSelected, onToggle = _a.onToggle, actionMode = _a.actionMode, onAction = _a.onAction;
    return (react_1.default.createElement("tr", { className: "data-table__row ".concat(isSelected ? "data-table__row--selected" : "").trim() },
        react_1.default.createElement("td", { className: "data-table__cell data-table__checkbox-cell" },
            react_1.default.createElement("button", { className: "data-table__checkbox ".concat(isSelected ? "data-table__checkbox--checked" : "").trim(), type: "button", "aria-pressed": isSelected, onClick: function () { return onToggle(item.id); } }, isSelected ? react_1.default.createElement(lucide_react_1.Check, { size: 12 }) : null)),
        react_1.default.createElement("td", { className: "data-table__cell data-table__cell--muted" }, item.jobCode),
        react_1.default.createElement("td", { className: "data-table__cell" },
            react_1.default.createElement("div", { className: "data-table__job-title" }, item.title),
            react_1.default.createElement("div", { className: "data-table__job-dept" }, item.department)),
        react_1.default.createElement("td", { className: "data-table__cell data-table__cell--count" }, String(item.count).padStart(2, "0")),
        react_1.default.createElement("td", { className: "data-table__cell data-table__cell--muted" }, item.requestType),
        react_1.default.createElement("td", { className: "data-table__cell data-table__cell--muted" }, item.nationality),
        react_1.default.createElement("td", { className: "data-table__cell" },
            react_1.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status)),
        react_1.default.createElement("td", { className: "data-table__cell data-table__cell--actions" },
            react_1.default.createElement("button", { className: "data-table__action-btn", onClick: function () { return onAction(item); }, type: "button", "aria-label": actionMode === "Upload" ? "Upload document" : "View vacancy" },
                react_1.default.createElement(lucide_react_1.Eye, { size: 16 }),
                actionMode === "View"))));
});
CheckboxRow.displayName = "CheckboxRow";
var CheckboxDataTableSkeleton = function () {
    var rows = Array.from({ length: 6 }, function (_, index) { return index; });
    return (react_1.default.createElement(react_1.default.Fragment, null, rows.map(function (row) { return (react_1.default.createElement("tr", { className: "data-table__row", key: "skeleton-".concat(row) },
        react_1.default.createElement("td", { className: "data-table__cell data-table__checkbox-cell" },
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short" })),
        react_1.default.createElement("td", { className: "data-table__cell data-table__cell--muted" },
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short" })),
        react_1.default.createElement("td", { className: "data-table__cell" },
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--title" }),
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--subtitle", style: { marginTop: 6 } })),
        react_1.default.createElement("td", { className: "data-table__cell" },
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short" })),
        react_1.default.createElement("td", { className: "data-table__cell" },
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short" })),
        react_1.default.createElement("td", { className: "data-table__cell" },
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short" })),
        react_1.default.createElement("td", { className: "data-table__cell" },
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short" })),
        react_1.default.createElement("td", { className: "data-table__cell data-table__cell--actions" },
            react_1.default.createElement("div", { className: "data-table__skeleton data-table__skeleton--short", style: { marginLeft: "auto" } })))); })));
};
var CheckboxDataTable = function (_a) {
    var items = _a.items, loading = _a.loading, selectedIds = _a.selectedIds, actionMode = _a.actionMode, onToggleRow = _a.onToggleRow, onToggleAll = _a.onToggleAll, onAction = _a.onAction;
    var allSelected = items.length > 0 && selectedIds.length === items.length;
    var someSelected = selectedIds.length > 0 && selectedIds.length < items.length;
    var rows = (0, react_1.useMemo)(function () {
        return items.map(function (item) { return (react_1.default.createElement(CheckboxRow, { key: item.id, item: item, isSelected: selectedIds.includes(item.id), onToggle: onToggleRow, actionMode: actionMode, onAction: onAction })); });
    }, [actionMode, items, onAction, onToggleRow, selectedIds]);
    return (react_1.default.createElement("table", { className: "data-table" },
        react_1.default.createElement("thead", { className: "data-table__head" },
            react_1.default.createElement("tr", { className: "data-table__head-row" },
                react_1.default.createElement("th", { className: "data-table__checkbox-cell" },
                    react_1.default.createElement("button", { className: "data-table__checkbox ".concat(allSelected || someSelected ? "data-table__checkbox--checked" : "").trim(), type: "button", "aria-pressed": allSelected, onClick: onToggleAll },
                        allSelected ? react_1.default.createElement(lucide_react_1.Check, { size: 12 }) : null,
                        someSelected && !allSelected ? react_1.default.createElement(lucide_react_1.Minus, { size: 12 }) : null)),
                react_1.default.createElement("th", null, "Job Code"),
                react_1.default.createElement("th", null, "Job Title & Dept"),
                react_1.default.createElement("th", null, "Count"),
                react_1.default.createElement("th", null, "Request Type"),
                react_1.default.createElement("th", null, "Nationality"),
                react_1.default.createElement("th", null, "Status"),
                react_1.default.createElement("th", null, "Actions"))),
        react_1.default.createElement("tbody", null, loading ? react_1.default.createElement(CheckboxDataTableSkeleton, null) : rows)));
};
exports.CheckboxDataTable = CheckboxDataTable;
//# sourceMappingURL=CheckboxDataTable.js.map