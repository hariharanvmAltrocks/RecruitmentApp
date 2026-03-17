"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalDataTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
require("../../Screens/RecruitmentTable/Components/DataTable/DataTable.scss");
var NormalDataRow = (0, react_1.memo)(function (_a) {
    var item = _a.item, actionMode = _a.actionMode, onAction = _a.onAction;
    return (react_1.default.createElement("tr", { className: "data-table__row" },
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
                actionMode === "Upload" ? react_1.default.createElement(lucide_react_1.Upload, { size: 16 }) : react_1.default.createElement(lucide_react_1.Eye, { size: 16 }),
                actionMode === "Upload" ? "Upload" : "View"))));
});
NormalDataRow.displayName = "NormalDataRow";
var NormalDataTableSkeleton = function () {
    var rows = Array.from({ length: 6 }, function (_, index) { return index; });
    return (react_1.default.createElement(react_1.default.Fragment, null, rows.map(function (row) { return (react_1.default.createElement("tr", { className: "data-table__row", key: "skeleton-".concat(row) },
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
var NormalDataTable = function (_a) {
    var items = _a.items, loading = _a.loading, actionMode = _a.actionMode, onAction = _a.onAction;
    var rows = (0, react_1.useMemo)(function () { return items.map(function (item) { return (react_1.default.createElement(NormalDataRow, { key: item.id, item: item, actionMode: actionMode, onAction: onAction })); }); }, [actionMode, items, onAction]);
    return (react_1.default.createElement("table", { className: "data-table" },
        react_1.default.createElement("thead", { className: "data-table__head" },
            react_1.default.createElement("tr", { className: "data-table__head-row" },
                react_1.default.createElement("th", null, "Job Code"),
                react_1.default.createElement("th", null, "Job Title & Dept"),
                react_1.default.createElement("th", null, "Count"),
                react_1.default.createElement("th", null, "Request Type"),
                react_1.default.createElement("th", null, "Nationality"),
                react_1.default.createElement("th", null, "Status"),
                react_1.default.createElement("th", null, "Actions"))),
        react_1.default.createElement("tbody", null, loading ? react_1.default.createElement(NormalDataTableSkeleton, null) : rows)));
};
exports.NormalDataTable = NormalDataTable;
//# sourceMappingURL=NormalDataTable.js.map