"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractAllocationTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var ProgressBar_1 = tslib_1.__importDefault(require("../Charts/ProgressBar"));
var Tables_module_scss_1 = tslib_1.__importDefault(require("./Tables.module.scss"));
var ContractAllocationTable = function (_a) {
    var contracts = _a.contracts, onViewContract = _a.onViewContract;
    var _b = (0, react_1.useState)(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)("All Departments"), selectedDept = _c[0], setSelectedDept = _c[1];
    var _d = (0, react_1.useState)("All Suppliers"), selectedSupplier = _d[0], setSelectedSupplier = _d[1];
    var _e = (0, react_1.useState)("All HR's"), selectedHR = _e[0], setSelectedHR = _e[1];
    var _f = (0, react_1.useState)("All Status"), selectedStatus = _f[0], setSelectedStatus = _f[1];
    var _g = (0, react_1.useState)("contractName"), sortKey = _g[0], setSortKey = _g[1];
    var _h = (0, react_1.useState)(true), sortAsc = _h[0], setSortAsc = _h[1];
    // Pagination states
    var _j = (0, react_1.useState)(1), currentPage = _j[0], setCurrentPage = _j[1];
    var rowsPerPage = 5;
    var handleSort = function (key) {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        }
        else {
            setSortKey(key);
            setSortAsc(true);
        }
        setCurrentPage(1);
    };
    // Get unique lists for filters
    var filterOptions = (0, react_1.useMemo)(function () {
        var depts = new Set();
        var suppliers = new Set();
        var hrs = new Set();
        var statuses = new Set();
        contracts.forEach(function (c) {
            if (c.department)
                depts.add(c.department);
            if (c.supplier)
                suppliers.add(c.supplier);
            if (c.assignedHR)
                hrs.add(c.assignedHR);
            if (c.status)
                statuses.add(c.status);
        });
        return {
            departments: tslib_1.__spreadArray(["All Departments"], Array.from(depts), true),
            suppliers: tslib_1.__spreadArray(["All Suppliers"], Array.from(suppliers), true),
            hrs: tslib_1.__spreadArray(["All HR's"], Array.from(hrs), true),
            statuses: tslib_1.__spreadArray(["All Status"], Array.from(statuses), true)
        };
    }, [contracts]);
    // Filter and sort contracts
    var filteredContracts = (0, react_1.useMemo)(function () {
        var result = tslib_1.__spreadArray([], contracts, true);
        // Search term
        if (searchTerm.trim() !== "") {
            var term_1 = searchTerm.toLowerCase();
            result = result.filter(function (c) {
                return c.contractName.toLowerCase().includes(term_1) ||
                    c.contractId.toLowerCase().includes(term_1) ||
                    c.supplier.toLowerCase().includes(term_1) ||
                    c.department.toLowerCase().includes(term_1);
            });
        }
        // Dropdown filters
        if (selectedDept !== "All Departments") {
            result = result.filter(function (c) { return c.department === selectedDept; });
        }
        if (selectedSupplier !== "All Suppliers") {
            result = result.filter(function (c) { return c.supplier === selectedSupplier; });
        }
        if (selectedHR !== "All HR's") {
            result = result.filter(function (c) { return c.assignedHR === selectedHR; });
        }
        if (selectedStatus !== "All Status") {
            result = result.filter(function (c) { return c.status === selectedStatus; });
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
    }, [contracts, searchTerm, selectedDept, selectedSupplier, selectedHR, selectedStatus, sortKey, sortAsc]);
    // Pagination calculations
    var totalPages = Math.ceil(filteredContracts.length / rowsPerPage);
    var paginatedContracts = (0, react_1.useMemo)(function () {
        var startIndex = (currentPage - 1) * rowsPerPage;
        return filteredContracts.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredContracts, currentPage]);
    var handlePageChange = function (page) {
        setCurrentPage(page);
    };
    return (react_1.default.createElement("div", { className: Tables_module_scss_1.default.tableContainer },
        react_1.default.createElement("div", { className: Tables_module_scss_1.default.toolbar },
            react_1.default.createElement("div", { className: Tables_module_scss_1.default.searchContainer },
                react_1.default.createElement("input", { type: "text", placeholder: "Search contracts, suppliers...", value: searchTerm, onChange: function (e) {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    } }),
                react_1.default.createElement("span", { className: Tables_module_scss_1.default.searchIcon }, "\uD83D\uDD0D")),
            react_1.default.createElement("div", { className: Tables_module_scss_1.default.filtersGroup },
                react_1.default.createElement("select", { className: Tables_module_scss_1.default.filterSelect, value: selectedSupplier, onChange: function (e) {
                        setSelectedSupplier(e.target.value);
                        setCurrentPage(1);
                    } }, filterOptions.suppliers.map(function (s, idx) { return (react_1.default.createElement("option", { key: idx, value: s }, s)); })),
                react_1.default.createElement("select", { className: Tables_module_scss_1.default.filterSelect, value: selectedDept, onChange: function (e) {
                        setSelectedDept(e.target.value);
                        setCurrentPage(1);
                    } }, filterOptions.departments.map(function (d, idx) { return (react_1.default.createElement("option", { key: idx, value: d }, d)); })),
                react_1.default.createElement("select", { className: Tables_module_scss_1.default.filterSelect, value: selectedHR, onChange: function (e) {
                        setSelectedHR(e.target.value);
                        setCurrentPage(1);
                    } }, filterOptions.hrs.map(function (h, idx) { return (react_1.default.createElement("option", { key: idx, value: h }, h)); })),
                react_1.default.createElement("select", { className: Tables_module_scss_1.default.filterSelect, value: selectedStatus, onChange: function (e) {
                        setSelectedStatus(e.target.value);
                        setCurrentPage(1);
                    } }, filterOptions.statuses.map(function (s, idx) { return (react_1.default.createElement("option", { key: idx, value: s }, s)); })),
                react_1.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", fontWeight: 600, color: "#1e3a8a", padding: "0 8px" } },
                    react_1.default.createElement("span", { style: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "inline-block", animation: "pulse 2s infinite" } }),
                    "LIVE STATUS"))),
        react_1.default.createElement("div", { className: Tables_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: Tables_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { onClick: function () { return handleSort("contractName"); }, style: { cursor: "pointer" } },
                            "Contract Name & ID ",
                            sortKey === "contractName" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", null, "Department"),
                        react_1.default.createElement("th", null, "Supplier"),
                        react_1.default.createElement("th", null, "Assigned HR"),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("requiredPositions"); }, style: { cursor: "pointer" } },
                            "Req. ",
                            sortKey === "requiredPositions" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("filledPositions"); }, style: { cursor: "pointer" } },
                            "Filled ",
                            sortKey === "filledPositions" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("balance"); }, style: { cursor: "pointer" } },
                            "Bal. ",
                            sortKey === "balance" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("candidateCount"); }, style: { cursor: "pointer" } },
                            "Candidates ",
                            sortKey === "candidateCount" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", null, "Progress"),
                        react_1.default.createElement("th", { onClick: function () { return handleSort("slaProgress"); }, style: { cursor: "pointer" } },
                            "SLA ",
                            sortKey === "slaProgress" && (sortAsc ? "▲" : "▼")),
                        react_1.default.createElement("th", null, "SLA Status"),
                        react_1.default.createElement("th", null, "Priority"),
                        react_1.default.createElement("th", null, "Actions"))),
                react_1.default.createElement("tbody", null, paginatedContracts.length === 0 ? (react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 13, className: Tables_module_scss_1.default.noData }, "No contracts found matching filters"))) : (paginatedContracts.map(function (c) {
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
                    var completionPct = c.requiredPositions > 0 ? Math.round((c.filledPositions / c.requiredPositions) * 100) : 0;
                    return (react_1.default.createElement("tr", { key: c.id, className: Tables_module_scss_1.default.rowHover },
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
                                        backgroundColor: "#dbeafe",
                                        color: "#1e40af",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "10px",
                                        fontWeight: 700
                                    } }, c.assignedHR.substring(0, 2).toUpperCase()),
                                c.assignedHR)),
                        react_1.default.createElement("td", { style: { textAlign: "center" } }, c.requiredPositions),
                        react_1.default.createElement("td", { style: { textAlign: "center" } }, c.filledPositions),
                        react_1.default.createElement("td", { style: { textAlign: "center", fontWeight: 600 } }, c.balance),
                        react_1.default.createElement("td", { style: { textAlign: "center" } }, c.candidateCount),
                        react_1.default.createElement("td", { style: { width: "120px" } },
                            react_1.default.createElement(ProgressBar_1.default, { value: completionPct, showLabel: false })),
                        react_1.default.createElement("td", { style: { fontWeight: 700 } },
                            c.slaProgress,
                            "%"),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: "".concat(Tables_module_scss_1.default.badge, " ").concat(badgeClass) }, c.slaStatus)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: "".concat(Tables_module_scss_1.default.priorityBadge, " ").concat(priorityClass) }, c.priority)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("button", { className: Tables_module_scss_1.default.viewButton, onClick: function () { return onViewContract && onViewContract(c); } }, "View"))));
                }))))),
        totalPages > 1 && (react_1.default.createElement("div", { className: Tables_module_scss_1.default.pagination },
            react_1.default.createElement("div", null,
                "Showing ",
                (currentPage - 1) * rowsPerPage + 1,
                " to ",
                Math.min(currentPage * rowsPerPage, filteredContracts.length),
                " of ",
                filteredContracts.length,
                " entries"),
            react_1.default.createElement("div", { className: Tables_module_scss_1.default.paginationButtons },
                react_1.default.createElement("button", { className: Tables_module_scss_1.default.pageButton, onClick: function () { return handlePageChange(currentPage - 1); }, disabled: currentPage === 1 }, "Previous"),
                Array.from({ length: totalPages }, function (_, idx) { return idx + 1; }).map(function (page) { return (react_1.default.createElement("button", { key: page, className: "".concat(Tables_module_scss_1.default.pageButton, " ").concat(currentPage === page ? Tables_module_scss_1.default.pageButtonActive : ""), onClick: function () { return handlePageChange(page); } }, page)); }),
                react_1.default.createElement("button", { className: Tables_module_scss_1.default.pageButton, onClick: function () { return handlePageChange(currentPage + 1); }, disabled: currentPage === totalPages }, "Next"))))));
};
exports.ContractAllocationTable = ContractAllocationTable;
exports.default = exports.ContractAllocationTable;
//# sourceMappingURL=ContractAllocationTable.js.map