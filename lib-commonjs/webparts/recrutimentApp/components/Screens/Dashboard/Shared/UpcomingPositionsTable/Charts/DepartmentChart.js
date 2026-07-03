"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var DepartmentChart_module_scss_1 = tslib_1.__importDefault(require("./DepartmentChart.module.scss"));
var Card_1 = tslib_1.__importDefault(require("../../../Common/Card"));
var ProgressBar_1 = tslib_1.__importDefault(require("../../../Common/ProgressBar"));
var DepartmentChart = function (_a) {
    var data = _a.data, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(1), currentPage = _c[0], setCurrentPage = _c[1];
    var itemsPerPage = 4;
    if (loading || !data) {
        return (react_1.default.createElement(Card_1.default, { className: DepartmentChart_module_scss_1.default.container },
            react_1.default.createElement("div", { className: DepartmentChart_module_scss_1.default.header },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "180px", height: "14px" } })),
            react_1.default.createElement("div", { className: DepartmentChart_module_scss_1.default.tablePlaceholder }, Array.from({ length: 4 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: idx, className: DepartmentChart_module_scss_1.default.loadingRow, style: { padding: "16px 0", borderBottom: "1px solid #f1f5f9" } },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "120px", height: "12px", marginBottom: "8px" } }),
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "100%", height: "8px", borderRadius: "4px" } }))); }))));
    }
    var totalPages = Math.ceil(data.length / itemsPerPage);
    var safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    var displayedData = data.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);
    var pages = Array.from({ length: totalPages }, function (_, idx) { return idx + 1; });
    return (react_1.default.createElement(Card_1.default, { className: DepartmentChart_module_scss_1.default.container },
        react_1.default.createElement("div", { className: DepartmentChart_module_scss_1.default.header },
            react_1.default.createElement("h3", { className: DepartmentChart_module_scss_1.default.title }, "Positions by Department")),
        react_1.default.createElement("div", { className: DepartmentChart_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: DepartmentChart_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { className: DepartmentChart_module_scss_1.default.thLeft }, "Department"),
                        react_1.default.createElement("th", null, "Total"),
                        react_1.default.createElement("th", null, "Filled"),
                        react_1.default.createElement("th", null, "Open"),
                        react_1.default.createElement("th", { className: DepartmentChart_module_scss_1.default.thPercent }, "% Filled"))),
                react_1.default.createElement("tbody", null, displayedData.map(function (dept, index) { return (react_1.default.createElement("tr", { key: index },
                    react_1.default.createElement("td", { className: DepartmentChart_module_scss_1.default.tdDeptName }, dept.department),
                    react_1.default.createElement("td", { className: DepartmentChart_module_scss_1.default.tdCount }, dept.total),
                    react_1.default.createElement("td", { className: DepartmentChart_module_scss_1.default.tdCount }, dept.filled),
                    react_1.default.createElement("td", { className: DepartmentChart_module_scss_1.default.tdCountOpen }, dept.open),
                    react_1.default.createElement("td", { className: DepartmentChart_module_scss_1.default.tdProgress },
                        react_1.default.createElement("div", { className: DepartmentChart_module_scss_1.default.progressWrap },
                            react_1.default.createElement(ProgressBar_1.default, { value: dept.filledPercentage, color: "#10b981" }),
                            react_1.default.createElement("span", { className: DepartmentChart_module_scss_1.default.progressText },
                                dept.filledPercentage,
                                "%"))))); })))),
        totalPages > 1 && (react_1.default.createElement("div", { className: DepartmentChart_module_scss_1.default.pagination },
            react_1.default.createElement("button", { type: "button", className: DepartmentChart_module_scss_1.default.pageArrow, onClick: function () { return setCurrentPage(function (prev) { return Math.max(1, prev - 1); }); }, disabled: safeCurrentPage === 1, "aria-label": "Previous Page" }, "\u2039"),
            pages.map(function (p) { return (react_1.default.createElement("button", { key: p, type: "button", className: "".concat(DepartmentChart_module_scss_1.default.pageNumber, " ").concat(p === safeCurrentPage ? DepartmentChart_module_scss_1.default.active : ""), onClick: function () { return setCurrentPage(p); } }, p)); }),
            react_1.default.createElement("button", { type: "button", className: DepartmentChart_module_scss_1.default.pageArrow, onClick: function () { return setCurrentPage(function (prev) { return Math.min(totalPages, prev + 1); }); }, disabled: safeCurrentPage === totalPages, "aria-label": "Next Page" }, "\u203A")))));
};
exports.DepartmentChart = DepartmentChart;
exports.default = exports.DepartmentChart;
//# sourceMappingURL=DepartmentChart.js.map