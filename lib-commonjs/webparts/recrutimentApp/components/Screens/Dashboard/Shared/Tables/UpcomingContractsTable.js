"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpcomingContractsTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Tables_module_scss_1 = tslib_1.__importDefault(require("./Tables.module.scss"));
var UpcomingContractsTable = function (_a) {
    var contracts = _a.contracts;
    var _b = (0, react_1.useState)(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)("remainingDays"), sortKey = _c[0], setSortKey = _c[1];
    var _d = (0, react_1.useState)(true), sortAsc = _d[0], setSortAsc = _d[1];
    var handleSort = function (key) {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        }
        else {
            setSortKey(key);
            setSortAsc(true);
        }
    };
    var filteredAndSorted = (0, react_1.useMemo)(function () {
        var result = tslib_1.__spreadArray([], contracts, true);
        // Filter by search term
        if (searchTerm.trim() !== "") {
            var term_1 = searchTerm.toLowerCase();
            result = result.filter(function (c) {
                return c.contractName.toLowerCase().includes(term_1) ||
                    c.contractId.toLowerCase().includes(term_1) ||
                    c.supplier.toLowerCase().includes(term_1) ||
                    c.department.toLowerCase().includes(term_1) ||
                    c.assignedHR.toLowerCase().includes(term_1);
            });
        }
        // Sort
        result.sort(function (a, b) {
            var aVal = a[sortKey];
            var bVal = b[sortKey];
            if (typeof aVal === "string") {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            if (aVal < bVal)
                return sortAsc ? -1 : 1;
            if (aVal > bVal)
                return sortAsc ? 1 : -1;
            return 0;
        });
        return result;
    }, [contracts, searchTerm, sortKey, sortAsc]);
    return (react_1.default.createElement("div", { className: Tables_module_scss_1.default.tableContainer },
        react_1.default.createElement("div", { className: Tables_module_scss_1.default.toolbar },
            react_1.default.createElement("div", { className: Tables_module_scss_1.default.searchContainer },
                react_1.default.createElement("input", { type: "text", placeholder: "Search upcoming/overdue...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); } }),
                react_1.default.createElement("span", { className: Tables_module_scss_1.default.searchIcon }, "\uD83D\uDD0D"))),
        react_1.default.createElement("div", { className: Tables_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: Tables_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { onClick: function () { return handleSort("contractName"); }, style: { cursor: "pointer" } },
                            "Contract Name ",
                            sortKey === "contractName" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", null, "Department"),
                        react_1.default.createElement("th", null, "Supplier"),
                        react_1.default.createElement("th", null, "Assigned HR"),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("endDate"); }, style: { cursor: "pointer" } },
                            "End Date ",
                            sortKey === "endDate" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("remainingDays"); }, style: { cursor: "pointer" } },
                            "Days Left ",
                            sortKey === "remainingDays" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("requiredPositions"); }, style: { cursor: "pointer" } },
                            "Req. ",
                            sortKey === "requiredPositions" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("filledPositions"); }, style: { cursor: "pointer" } },
                            "Filled ",
                            sortKey === "filledPositions" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", null, "Bal."),
                        react_1.default.createElement("th", null, "Candidates"),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("slaStatus"); }, style: { cursor: "pointer" } },
                            "SLA Status ",
                            sortKey === "slaStatus" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", null, "Priority"))),
                react_1.default.createElement("tbody", null, filteredAndSorted.length === 0 ? (react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 12, className: Tables_module_scss_1.default.noData }, "No contracts found"))) : (filteredAndSorted.map(function (c) {
                    var rowClass = Tables_module_scss_1.default.rowHover;
                    if (c.slaStatus === "Overdue") {
                        rowClass = Tables_module_scss_1.default.rowOverdue;
                    }
                    else if (c.slaStatus === "At Risk") {
                        rowClass = Tables_module_scss_1.default.rowDueSoon;
                    }
                    var badgeClass = Tables_module_scss_1.default.badgeOnTrack;
                    if (c.slaStatus === "Overdue")
                        badgeClass = Tables_module_scss_1.default.badgeOverdue;
                    else if (c.slaStatus === "At Risk")
                        badgeClass = Tables_module_scss_1.default.badgeAtRisk;
                    var priorityClass = Tables_module_scss_1.default.priorityLow;
                    if (c.priority === "High")
                        priorityClass = Tables_module_scss_1.default.priorityHigh;
                    else if (c.priority === "Medium")
                        priorityClass = Tables_module_scss_1.default.priorityMedium;
                    return (react_1.default.createElement("tr", { key: c.id, className: rowClass },
                        react_1.default.createElement("td", { style: { fontWeight: 600 } },
                            react_1.default.createElement("div", null, c.contractName),
                            react_1.default.createElement("div", { style: { fontSize: "10px", color: "#64748b", marginTop: "2px" } }, c.contractId)),
                        react_1.default.createElement("td", null, c.department),
                        react_1.default.createElement("td", null, c.supplier),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px" } },
                                react_1.default.createElement("span", { style: {
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        backgroundColor: "#e2e8f0",
                                        color: "#475569",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "10px",
                                        fontWeight: 700
                                    } }, c.assignedHR.substring(0, 2).toUpperCase()),
                                c.assignedHR)),
                        react_1.default.createElement("td", null, c.endDate),
                        react_1.default.createElement("td", { style: { fontWeight: 700, color: c.remainingDays < 0 ? "#ef4444" : "#1e293b" } }, c.remainingDays < 0 ? "Overdue (".concat(Math.abs(c.remainingDays), "d)") : "".concat(c.remainingDays, " days")),
                        react_1.default.createElement("td", { style: { textAlign: "center" } }, c.requiredPositions),
                        react_1.default.createElement("td", { style: { textAlign: "center" } }, c.filledPositions),
                        react_1.default.createElement("td", { style: { textAlign: "center", fontWeight: 600 } }, c.balance),
                        react_1.default.createElement("td", { style: { textAlign: "center" } }, c.candidateCount),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: "".concat(Tables_module_scss_1.default.badge, " ").concat(badgeClass) }, c.slaStatus)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: "".concat(Tables_module_scss_1.default.priorityBadge, " ").concat(priorityClass) }, c.priority))));
                })))))));
};
exports.UpcomingContractsTable = UpcomingContractsTable;
exports.default = exports.UpcomingContractsTable;
//# sourceMappingURL=UpcomingContractsTable.js.map