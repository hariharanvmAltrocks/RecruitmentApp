"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeniorHRTaskTable = exports.ConflictOfInterestAlerts = exports.HRLeadsPerformance = exports.DepartmentDemandOverview = exports.PositionsOverviewChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var recharts_1 = require("recharts");
var SeniorHRComponents_module_scss_1 = tslib_1.__importDefault(require("./SeniorHRComponents.module.scss"));
var DataTable_1 = require("../../../../Comman/DataTable/DataTable");
var Card_1 = tslib_1.__importDefault(require("../../Common/Card"));
var PositionsOverviewChart = function (_a) {
    var data = _a.data, loading = _a.loading;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "Positions Overview (Monthly)")),
            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.skeletonChart })));
    }
    var TotalColor = "var(--app-primary-color, #7c3aed)";
    var filledColor = "var(--app-text-color, #0f172a)";
    var OpenColor = "var(--app-sidenav-color, #ffffff)";
    return (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "Positions Overview (Monthly)")),
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.chartWrapper },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 220 },
                react_1.default.createElement(recharts_1.ComposedChart, { data: data, margin: { top: 10, right: 10, left: -20, bottom: 0 } },
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
                    react_1.default.createElement(recharts_1.XAxis, { dataKey: "month", tick: { fontSize: 10 } }),
                    react_1.default.createElement(recharts_1.YAxis, { tick: { fontSize: 10 } }),
                    react_1.default.createElement(recharts_1.Tooltip, null),
                    react_1.default.createElement(recharts_1.Legend, { verticalAlign: "top", height: 36, iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: 10 } }),
                    react_1.default.createElement(recharts_1.Bar, { dataKey: "total", fill: TotalColor, radius: [4, 4, 0, 0], barSize: 16 }),
                    react_1.default.createElement(recharts_1.Bar, { dataKey: "filled", fill: filledColor, radius: [4, 4, 0, 0], barSize: 16 }),
                    react_1.default.createElement(recharts_1.Line, { type: "monotone", dataKey: "open", stroke: OpenColor, strokeWidth: 2, dot: { r: 3 } }))))));
};
exports.PositionsOverviewChart = PositionsOverviewChart;
var DepartmentDemandOverview = function (_a) {
    var data = _a.data, loading = _a.loading;
    var _b = (0, react_1.useState)(1), currentPage = _b[0], setCurrentPage = _b[1];
    var itemsPerPage = 5;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.Building2, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "Department Demand Overview")),
            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 5 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "14px", marginBottom: "12px" } })); }))));
    }
    var list = data || [];
    var totalPages = Math.ceil(list.length / itemsPerPage);
    var safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    var startIndex = (safeCurrentPage - 1) * itemsPerPage;
    var currentItems = list.slice(startIndex, startIndex + itemsPerPage);
    var handlePageChange = function (page) {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.Building2, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "Department Demand Overview")),
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: SeniorHRComponents_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "Department"),
                        react_1.default.createElement("th", null, "Total Demand"),
                        react_1.default.createElement("th", null, "Filled"),
                        react_1.default.createElement("th", null, "Open"),
                        react_1.default.createElement("th", null, "% Filled"))),
                react_1.default.createElement("tbody", null, currentItems.map(function (item, idx) { return (react_1.default.createElement("tr", { key: idx },
                    react_1.default.createElement("td", { style: { textAlign: "left", fontWeight: 600 } }, item.department),
                    react_1.default.createElement("td", null, item.total),
                    react_1.default.createElement("td", null, item.filled),
                    react_1.default.createElement("td", null, item.open),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.progressContainer },
                            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.progressBar, style: { width: "".concat(item.percentage, "%") } }),
                            react_1.default.createElement("span", { className: SeniorHRComponents_module_scss_1.default.progressText },
                                item.percentage,
                                "%"))))); })))),
        totalPages > 1 && (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.paginationWrapper },
            react_1.default.createElement("button", { type: "button", className: SeniorHRComponents_module_scss_1.default.paginationBtn, onClick: function () { return handlePageChange(safeCurrentPage - 1); }, disabled: safeCurrentPage === 1, "aria-label": "Previous Page" },
                react_1.default.createElement(Lucide.ChevronLeft, { size: 16 })),
            react_1.default.createElement("span", { className: SeniorHRComponents_module_scss_1.default.paginationText },
                "Page ",
                safeCurrentPage,
                " of ",
                totalPages),
            react_1.default.createElement("button", { type: "button", className: SeniorHRComponents_module_scss_1.default.paginationBtn, onClick: function () { return handlePageChange(safeCurrentPage + 1); }, disabled: safeCurrentPage === totalPages, "aria-label": "Next Page" },
                react_1.default.createElement(Lucide.ChevronRight, { size: 16 }))))));
};
exports.DepartmentDemandOverview = DepartmentDemandOverview;
var HRLeadsPerformance = function (_a) {
    var data = _a.data, loading = _a.loading;
    var _b = (0, react_1.useState)(1), currentPage = _b[0], setCurrentPage = _b[1];
    var itemsPerPage = 5;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.UserCheck, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "HR Leads Performance")),
            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 4 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "14px", marginBottom: "12px" } })); }))));
    }
    var list = data || [];
    var totalPages = Math.ceil(list.length / itemsPerPage);
    var safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    var startIndex = (safeCurrentPage - 1) * itemsPerPage;
    var currentItems = list.slice(startIndex, startIndex + itemsPerPage);
    var handlePageChange = function (page) {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    var avatarThemes = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"];
    return (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.UserCheck, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "HR Leads Performance")),
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: SeniorHRComponents_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "HR Lead"),
                        react_1.default.createElement("th", null, "HRs Managed"),
                        react_1.default.createElement("th", null, "Positions Filled"),
                        react_1.default.createElement("th", null, "Open Positions"))),
                react_1.default.createElement("tbody", null, currentItems.map(function (item, idx) {
                    var letter = item.hrLeadName.charAt(0).toUpperCase();
                    var globalIdx = startIndex + idx;
                    var color = avatarThemes[globalIdx % avatarThemes.length];
                    return (react_1.default.createElement("tr", { key: idx },
                        react_1.default.createElement("td", { style: { textAlign: "left" } },
                            react_1.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
                                react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.avatar, style: { backgroundColor: color } }, letter),
                                react_1.default.createElement("span", { style: { fontWeight: 600 } }, item.hrLeadName))),
                        react_1.default.createElement("td", null, item.hrsManaged),
                        react_1.default.createElement("td", null, item.filled),
                        react_1.default.createElement("td", null, item.open)));
                })))),
        totalPages > 1 && (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.paginationWrapper },
            react_1.default.createElement("button", { type: "button", className: SeniorHRComponents_module_scss_1.default.paginationBtn, onClick: function () { return handlePageChange(safeCurrentPage - 1); }, disabled: safeCurrentPage === 1, "aria-label": "Previous Page" },
                react_1.default.createElement(Lucide.ChevronLeft, { size: 16 })),
            react_1.default.createElement("span", { className: SeniorHRComponents_module_scss_1.default.paginationText },
                "Page ",
                safeCurrentPage,
                " of ",
                totalPages),
            react_1.default.createElement("button", { type: "button", className: SeniorHRComponents_module_scss_1.default.paginationBtn, onClick: function () { return handlePageChange(safeCurrentPage + 1); }, disabled: safeCurrentPage === totalPages, "aria-label": "Next Page" },
                react_1.default.createElement(Lucide.ChevronRight, { size: 16 }))))));
};
exports.HRLeadsPerformance = HRLeadsPerformance;
var ConflictOfInterestAlerts = function (_a) {
    var data = _a.data, loading = _a.loading;
    var _b = react_1.default.useState(1), currentPage = _b[0], setCurrentPage = _b[1];
    var itemsPerPage = 5;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.ShieldAlert, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "Conflict of Interest Alerts")),
            react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 5 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "14px", marginBottom: "12px" } })); }))));
    }
    var totalItems = data.length;
    var totalPages = Math.ceil(totalItems / itemsPerPage);
    var startIndex = (currentPage - 1) * itemsPerPage;
    var currentItems = data.slice(startIndex, startIndex + itemsPerPage);
    var handlePageChange = function (page) {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.ShieldAlert, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "Conflict of Interest Alerts")),
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: SeniorHRComponents_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "Candidate Name"),
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "Job Title"),
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "COI Reason"),
                        react_1.default.createElement("th", null, "Status"))),
                react_1.default.createElement("tbody", null, currentItems.length === 0 ? (react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 4, style: { textAlign: "center", color: "#64748b", padding: "20px" } }, "No Conflict of Interest candidates found."))) : (currentItems.map(function (item, idx) { return (react_1.default.createElement("tr", { key: idx },
                    react_1.default.createElement("td", { style: { textAlign: "left", fontWeight: 600 } }, item.name),
                    react_1.default.createElement("td", { style: { textAlign: "left" } }, item.JobTitle),
                    react_1.default.createElement("td", { style: { textAlign: "left" } }, item.coiReason),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("span", { className: "".concat(SeniorHRComponents_module_scss_1.default.badge, " ").concat(SeniorHRComponents_module_scss_1.default.badgeWarning) }, item.currentstatus)))); }))))),
        totalPages > 1 && (react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.paginationWrapper },
            react_1.default.createElement("button", { type: "button", className: SeniorHRComponents_module_scss_1.default.paginationBtn, onClick: function () { return handlePageChange(currentPage - 1); }, disabled: currentPage === 1, "aria-label": "Previous Page" },
                react_1.default.createElement(Lucide.ChevronLeft, { size: 16 })),
            react_1.default.createElement("span", { className: SeniorHRComponents_module_scss_1.default.paginationText },
                "Page ",
                currentPage,
                " of ",
                totalPages),
            react_1.default.createElement("button", { type: "button", className: SeniorHRComponents_module_scss_1.default.paginationBtn, onClick: function () { return handlePageChange(currentPage + 1); }, disabled: currentPage === totalPages, "aria-label": "Next Page" },
                react_1.default.createElement(Lucide.ChevronRight, { size: 16 }))))));
};
exports.ConflictOfInterestAlerts = ConflictOfInterestAlerts;
var SeniorHRTaskTable = function (_a) {
    var data = _a.data, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(1), currentPage = _c[0], setCurrentPage = _c[1];
    var _d = (0, react_1.useState)(10), pageSize = _d[0], setPageSize = _d[1];
    var columns = (0, react_1.useMemo)(function () { return [
        {
            id: "jobTitle",
            header: "Job Title",
            render: function (row) { return (react_1.default.createElement("div", { className: "data-table__job-title" },
                react_1.default.createElement("span", null, row.Jobtitle),
                react_1.default.createElement("span", { className: "data-table__job-dept" }, row.JobCode))); },
            sortable: true
        },
        {
            id: "department",
            header: "Department",
            render: function (item) { return (react_1.default.createElement("div", { className: "data-table__job-title" },
                react_1.default.createElement("span", null, item.department))); },
            sortable: true
        },
        {
            id: "dateRequired",
            header: "Date Required",
            accessor: "dateRequired",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
            sortable: true
        },
        {
            id: "RecruitmentHRlead",
            header: "RecruitmentHR Lead",
            accessor: "RecruitmentHRlead",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
            sortable: true
        },
        {
            id: "RecruitmentHR",
            header: "Recruitment HR",
            accessor: "RecruitmentHR",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
            sortable: true
        },
        {
            id: "headcount",
            header: "Headcount (Req)",
            accessor: "headcount",
            sortable: true,
            align: "center"
        },
        {
            id: "filledcount",
            header: "Filled",
            accessor: "filledcount",
            sortable: true,
            align: "center"
        },
        {
            id: "vacant",
            header: "Vacant (Bal)",
            accessor: "vacant",
            sortable: true,
            align: "center",
            cellClassName: SeniorHRComponents_module_scss_1.default.weight600
        },
        {
            id: "daysLeft",
            header: "Days Left",
            render: function (row) { return react_1.default.createElement("span", null,
                row.dayaLeft,
                " days"); },
            sortable: true,
            cellClassName: SeniorHRComponents_module_scss_1.default.weight600
        },
        {
            id: "status",
            header: "Status",
            render: function (row) {
                var statusClass = SeniorHRComponents_module_scss_1.default.statusOnTrack;
                if (row.Positionstatus === "Overdue")
                    statusClass = SeniorHRComponents_module_scss_1.default.statusOverdue;
                else if (row.Positionstatus === "At Risk")
                    statusClass = SeniorHRComponents_module_scss_1.default.statusAtRisk;
                return (react_1.default.createElement("span", { className: "".concat(SeniorHRComponents_module_scss_1.default.statusBadge, " ").concat(statusClass) }, row.Positionstatus));
            },
            sortable: true
        },
    ]; }, []);
    var getRowId = function (row) { return String(row.id); };
    var tasksList = data || [];
    return (react_1.default.createElement(Card_1.default, { className: SeniorHRComponents_module_scss_1.default.container },
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.CheckSquare, { size: 16, className: SeniorHRComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: SeniorHRComponents_module_scss_1.default.title }, "Position Details")),
        react_1.default.createElement("div", { className: SeniorHRComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: tasksList, getRowId: getRowId, pageSize: pageSize, currentPage: currentPage, totalCount: tasksList.length, onPageChange: setCurrentPage, onPageSizeChange: setPageSize, loading: loading }))));
};
exports.SeniorHRTaskTable = SeniorHRTaskTable;
//# sourceMappingURL=SeniorHRComponents.js.map