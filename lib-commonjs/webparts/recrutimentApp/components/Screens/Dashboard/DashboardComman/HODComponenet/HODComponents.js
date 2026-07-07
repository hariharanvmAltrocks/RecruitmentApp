"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyApprovals = exports.TeamStatus = exports.TeamSummary = exports.PositionsJobRole = exports.DepartmentPositionsTrend = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var recharts_1 = require("recharts");
var HODComponents_module_scss_1 = tslib_1.__importDefault(require("./HODComponents.module.scss"));
var DepartmentPositionsTrend = function (_a) {
    var data = _a.data, loading = _a.loading;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "Department Positions Trend (Monthly)")),
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.skeletonChart })));
    }
    return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "Department Positions Trend (Monthly)")),
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.chartWrapper },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 220 },
                react_1.default.createElement(recharts_1.ComposedChart, { data: data, margin: { top: 10, right: 10, left: -25, bottom: 0 } },
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
                    react_1.default.createElement(recharts_1.XAxis, { dataKey: "month", tick: { fontSize: 10 } }),
                    react_1.default.createElement(recharts_1.YAxis, { tick: { fontSize: 10 } }),
                    react_1.default.createElement(recharts_1.Tooltip, null),
                    react_1.default.createElement(recharts_1.Legend, { verticalAlign: "top", height: 36, iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: 10 } }),
                    react_1.default.createElement(recharts_1.Line, { type: "monotone", dataKey: "total", stroke: "#2563eb", strokeWidth: 2, dot: { r: 3 } }),
                    react_1.default.createElement(recharts_1.Line, { type: "monotone", dataKey: "filled", stroke: "#10b981", strokeWidth: 2, dot: { r: 3 } }),
                    react_1.default.createElement(recharts_1.Line, { type: "monotone", dataKey: "open", stroke: "#ef4444", strokeWidth: 2, dot: { r: 3 } }))))));
};
exports.DepartmentPositionsTrend = DepartmentPositionsTrend;
var PositionsJobRole = function (_a) {
    var data = _a.data, loading = _a.loading;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.Briefcase, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "Positions by Job Role")),
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 5 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "14px", marginBottom: "12px" } })); }))));
    }
    return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.Briefcase, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "Positions by Job Role")),
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: HODComponents_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "Job Role"),
                        react_1.default.createElement("th", null, "Total"),
                        react_1.default.createElement("th", null, "Filled"),
                        react_1.default.createElement("th", null, "Open"),
                        react_1.default.createElement("th", null, "% Filled"))),
                react_1.default.createElement("tbody", null, data.map(function (item, idx) { return (react_1.default.createElement("tr", { key: idx },
                    react_1.default.createElement("td", { style: { textAlign: "left", fontWeight: 600 } }, item.jobRole),
                    react_1.default.createElement("td", null, item.total),
                    react_1.default.createElement("td", null, item.filled),
                    react_1.default.createElement("td", null, item.open),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.progressContainer },
                            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.progressBar, style: { width: "".concat(item.percentage, "%") } }),
                            react_1.default.createElement("span", { className: HODComponents_module_scss_1.default.progressText },
                                item.percentage,
                                "%"))))); }))))));
};
exports.PositionsJobRole = PositionsJobRole;
var TeamSummary = function (_a) {
    var data = _a.data, loading = _a.loading;
    var _b = (0, react_1.useState)(1), currentPage = _b[0], setCurrentPage = _b[1];
    var itemsPerPage = 5;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.Users, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "Team Summary")),
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 4 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "14px", marginBottom: "12px" } })); }))));
    }
    var list = data || [];
    var totalPages = Math.ceil(list.length / itemsPerPage);
    var safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    var indexOfLastItem = safeCurrentPage * itemsPerPage;
    var indexOfFirstItem = indexOfLastItem - itemsPerPage;
    var currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
    return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.Users, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "HR Summary")),
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: HODComponents_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "Job Title"),
                        react_1.default.createElement("th", null, "HR Name"),
                        react_1.default.createElement("th", null, "Open"),
                        react_1.default.createElement("th", null, "Filled"))),
                react_1.default.createElement("tbody", null, currentItems.map(function (item, idx) { return (react_1.default.createElement("tr", { key: idx },
                    react_1.default.createElement("td", { style: { textAlign: "left", fontWeight: 600 } }, item.JobTitle),
                    react_1.default.createElement("td", null, item.HRName),
                    react_1.default.createElement("td", null, item.openPositions),
                    react_1.default.createElement("td", null, item.filledPositions))); })))),
        list.length > itemsPerPage && (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.pagination, role: "navigation", "aria-label": "Pagination" },
            react_1.default.createElement("button", { className: HODComponents_module_scss_1.default.pageArrow, type: "button", onClick: function () { return setCurrentPage(function (prev) { return Math.max(1, prev - 1); }); }, disabled: safeCurrentPage === 1, "aria-label": "Previous page" }, "\u2039"),
            Array.from({ length: totalPages }).map(function (_, idx) {
                var pageNum = idx + 1;
                return (react_1.default.createElement("button", { key: pageNum, type: "button", className: "".concat(HODComponents_module_scss_1.default.pageNumber, " ").concat(safeCurrentPage === pageNum ? HODComponents_module_scss_1.default.active : ""), onClick: function () { return setCurrentPage(pageNum); } }, pageNum));
            }),
            react_1.default.createElement("button", { className: HODComponents_module_scss_1.default.pageArrow, type: "button", onClick: function () { return setCurrentPage(function (prev) { return Math.min(totalPages, prev + 1); }); }, disabled: safeCurrentPage === totalPages, "aria-label": "Next page" }, "\u203A")))));
};
exports.TeamSummary = TeamSummary;
var TeamStatus = function (_a) {
    var data = _a.data, loading = _a.loading;
    var total = react_1.default.useMemo(function () {
        return data ? data.reduce(function (sum, item) { return sum + item.count; }, 0) : 0;
    }, [data]);
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.PieChart, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "Team Status")),
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.skeletonDonut })));
    }
    return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.PieChart, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "Team Status")),
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.donutBody },
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.donutVisual },
                react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                    react_1.default.createElement(recharts_1.PieChart, { margin: { top: 0, right: 0, left: 0, bottom: 0 } },
                        react_1.default.createElement(recharts_1.Pie, { data: data, innerRadius: 36, outerRadius: 50, paddingAngle: 4, dataKey: "count" }, data.map(function (entry, index) { return (react_1.default.createElement(recharts_1.Cell, { key: "cell-".concat(index), fill: entry.color })); })))),
                react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.donutCenter },
                    react_1.default.createElement("span", { className: HODComponents_module_scss_1.default.donutCenterVal }, total),
                    react_1.default.createElement("span", { className: HODComponents_module_scss_1.default.donutCenterLabel }, "TOTAL"))),
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.donutLegend }, data.map(function (item, index) { return (react_1.default.createElement("div", { key: index, className: HODComponents_module_scss_1.default.legendRow },
                react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.legendLeft },
                    react_1.default.createElement("span", { className: HODComponents_module_scss_1.default.dot, style: { backgroundColor: item.color } }),
                    react_1.default.createElement("span", { className: HODComponents_module_scss_1.default.legendName }, item.name)),
                react_1.default.createElement("span", { className: HODComponents_module_scss_1.default.legendCount },
                    item.count,
                    " (",
                    item.percentage,
                    "%)"))); }))),
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.cardFooter },
            react_1.default.createElement("a", { href: "#/team-details", className: HODComponents_module_scss_1.default.link }, "View team details"))));
};
exports.TeamStatus = TeamStatus;
var MyApprovals = function (_a) {
    var data = _a.data, loading = _a.loading;
    var _b = (0, react_1.useState)(1), currentPage = _b[0], setCurrentPage = _b[1];
    var itemsPerPage = 5;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.FileCheck, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "My Approvals")),
            react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 3 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "14px", marginBottom: "12px" } })); }))));
    }
    var list = data || [];
    var totalPages = Math.ceil(list.length / itemsPerPage);
    var safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    var indexOfLastItem = safeCurrentPage * itemsPerPage;
    var indexOfFirstItem = indexOfLastItem - itemsPerPage;
    var currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
    return (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.FileCheck, { size: 16, className: HODComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: HODComponents_module_scss_1.default.title }, "My Approvals")),
        react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: HODComponents_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "Request Type"),
                        react_1.default.createElement("th", null, "Count"))),
                react_1.default.createElement("tbody", null, currentItems.map(function (item) { return (react_1.default.createElement("tr", { key: item.id },
                    react_1.default.createElement("td", { style: { textAlign: "left", fontWeight: 600 } }, item.requestType),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("span", { className: HODComponents_module_scss_1.default.approvalCount }, item.count)))); })))),
        list.length > itemsPerPage && (react_1.default.createElement("div", { className: HODComponents_module_scss_1.default.pagination, role: "navigation", "aria-label": "Pagination" },
            react_1.default.createElement("button", { className: HODComponents_module_scss_1.default.pageArrow, type: "button", onClick: function () { return setCurrentPage(function (prev) { return Math.max(1, prev - 1); }); }, disabled: safeCurrentPage === 1, "aria-label": "Previous page" }, "\u2039"),
            Array.from({ length: totalPages }).map(function (_, idx) {
                var pageNum = idx + 1;
                return (react_1.default.createElement("button", { key: pageNum, type: "button", className: "".concat(HODComponents_module_scss_1.default.pageNumber, " ").concat(safeCurrentPage === pageNum ? HODComponents_module_scss_1.default.active : ""), onClick: function () { return setCurrentPage(pageNum); } }, pageNum));
            }),
            react_1.default.createElement("button", { className: HODComponents_module_scss_1.default.pageArrow, type: "button", onClick: function () { return setCurrentPage(function (prev) { return Math.min(totalPages, prev + 1); }); }, disabled: safeCurrentPage === totalPages, "aria-label": "Next page" }, "\u203A")))));
};
exports.MyApprovals = MyApprovals;
//# sourceMappingURL=HODComponents.js.map