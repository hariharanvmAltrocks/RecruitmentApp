"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var JobListTable = function (_a) {
    var jobRows = _a.jobRows, totalItems = _a.totalItems, currentPage = _a.currentPage, totalPages = _a.totalPages, pageSize = _a.pageSize, onPageChange = _a.onPageChange, onPageSizeChange = _a.onPageSizeChange, searchTerm = _a.searchTerm, onSearch = _a.onSearch, onSelectJob = _a.onSelectJob, loading = _a.loading;
    var pageNumbers = Array.from({ length: totalPages }, function (_, i) { return i + 1; });
    return (React.createElement("div", { className: ReviewScorecard_module_scss_1.default.card },
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.cardHeader },
            React.createElement("h2", null, "Review Scorecards"),
            React.createElement("button", { onClick: function () { return window.history.back(); }, className: ReviewScorecard_module_scss_1.default.backButton },
                React.createElement(lucide_react_1.RotateCcw, { size: 14 }),
                " BACK TO DASHBOARD")),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.filterBar },
            React.createElement("input", { className: ReviewScorecard_module_scss_1.default.searchInput, placeholder: "Search jobs...", value: searchTerm, onChange: function (e) { onSearch(e.target.value); onPageChange(1); } })),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.tableContainer },
            React.createElement("table", { className: ReviewScorecard_module_scss_1.default.styledTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        ["Job Code", "Job Title", "Business Unit", "Position Request", "Nationality", "Status"].map(function (h) { return (React.createElement("th", { key: h },
                            h,
                            " ",
                            React.createElement(lucide_react_1.ArrowUpDown, { size: 10 }))); }),
                        React.createElement("th", { className: ReviewScorecard_module_scss_1.default.center }, "Action"))),
                React.createElement("tbody", null, loading ? (React.createElement("tr", null,
                    React.createElement("td", { colSpan: 7, className: ReviewScorecard_module_scss_1.default.noData }, "Loading..."))) : jobRows.length === 0 ? (React.createElement("tr", null,
                    React.createElement("td", { colSpan: 7, className: ReviewScorecard_module_scss_1.default.noData }, "No jobs found."))) : jobRows.map(function (job) { return (React.createElement("tr", { key: job.id, onClick: function () { return onSelectJob(job); } },
                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.jobCode }, job.jobCode),
                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.jobTitle }, job.jobTitle),
                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, job.businessUnitCode || ""),
                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, job.positionRequest || ""),
                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.textMuted }, job.nationality || ""),
                    React.createElement("td", null,
                        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.statusBadge },
                            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.dot }),
                            job.status || "Recruitment In Progress")),
                    React.createElement("td", { className: ReviewScorecard_module_scss_1.default.center },
                        React.createElement("button", { onClick: function (e) { e.stopPropagation(); onSelectJob(job); }, className: ReviewScorecard_module_scss_1.default.actionButton }, "REVIEW")))); })))),
        React.createElement("div", { className: ReviewScorecard_module_scss_1.default.paginationBar },
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.paginationInfo },
                "Showing",
                " ",
                React.createElement("strong", null, totalItems === 0 ? 0 : Math.min((currentPage - 1) * pageSize + 1, totalItems)),
                " ",
                "to",
                " ",
                React.createElement("strong", null, Math.min(currentPage * pageSize, totalItems)),
                " ",
                "of ",
                React.createElement("strong", null, totalItems),
                " results\u00A0",
                React.createElement("span", { className: ReviewScorecard_module_scss_1.default.showEntries },
                    "SHOW",
                    " ",
                    React.createElement("select", { value: pageSize, onChange: function (e) { onPageSizeChange(Number(e.target.value)); onPageChange(1); } }, [5, 10, 20, 50].map(function (s) { return React.createElement("option", { key: s, value: s }, s); })),
                    " ",
                    "ENTRIES")),
            React.createElement("div", { className: ReviewScorecard_module_scss_1.default.paginationControls },
                React.createElement("button", { className: "".concat(ReviewScorecard_module_scss_1.default.pageBtn, " ").concat(currentPage <= 1 ? ReviewScorecard_module_scss_1.default.disabled : ""), disabled: currentPage <= 1, onClick: function () { return onPageChange(currentPage - 1); } }, "\u2039"),
                pageNumbers.map(function (page) { return (React.createElement("button", { key: page, className: "".concat(ReviewScorecard_module_scss_1.default.pageBtn, " ").concat(page === currentPage ? ReviewScorecard_module_scss_1.default.activePage : ""), onClick: function () { return onPageChange(page); } }, page)); }),
                React.createElement("button", { className: "".concat(ReviewScorecard_module_scss_1.default.pageBtn, " ").concat(currentPage >= totalPages ? ReviewScorecard_module_scss_1.default.disabled : ""), disabled: currentPage >= totalPages, onClick: function () { return onPageChange(currentPage + 1); } }, "\u203A")))));
};
exports.default = JobListTable;
//# sourceMappingURL=JobListTable.js.map