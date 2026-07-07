"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var TaskTable_module_scss_1 = tslib_1.__importDefault(require("./TaskTable.module.scss"));
var Card_1 = tslib_1.__importDefault(require("../../Common/Card"));
var DataTable_1 = require("../../../../Comman/DataTable/DataTable");
var TaskTable = function (_a) {
    var data = _a.data, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(1), currentPage = _c[0], setCurrentPage = _c[1];
    var _d = (0, react_1.useState)(5), pageSize = _d[0], setPageSize = _d[1];
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
            cellClassName: TaskTable_module_scss_1.default.weight600
        },
        {
            id: "daysLeft",
            header: "Days Left",
            render: function (row) { return react_1.default.createElement("span", null,
                row.dayaLeft,
                " days"); },
            sortable: true,
            cellClassName: TaskTable_module_scss_1.default.weight600
        },
        {
            id: "status",
            header: "Status",
            render: function (row) {
                var statusClass = TaskTable_module_scss_1.default.statusOnTrack;
                if (row.Positionstatus === "Overdue")
                    statusClass = TaskTable_module_scss_1.default.statusOverdue;
                else if (row.Positionstatus === "At Risk")
                    statusClass = TaskTable_module_scss_1.default.statusAtRisk;
                return (react_1.default.createElement("span", { className: "".concat(TaskTable_module_scss_1.default.statusBadge, " ").concat(statusClass) }, row.Positionstatus));
            },
            sortable: true
        },
    ]; }, []);
    var getRowId = function (row) { return String(row.id); };
    var tasksList = data || [];
    return (react_1.default.createElement(Card_1.default, { className: TaskTable_module_scss_1.default.container },
        react_1.default.createElement("div", { className: TaskTable_module_scss_1.default.header },
            react_1.default.createElement(Lucide.CheckSquare, { size: 16, className: TaskTable_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: TaskTable_module_scss_1.default.title }, "My Tasks Tracker")),
        react_1.default.createElement("div", { className: TaskTable_module_scss_1.default.tableWrapper },
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: tasksList, getRowId: getRowId, pageSize: pageSize, currentPage: currentPage, totalCount: tasksList.length, onPageChange: setCurrentPage, onPageSizeChange: setPageSize, loading: loading })),
        react_1.default.createElement("div", { className: TaskTable_module_scss_1.default.footer },
            react_1.default.createElement("a", { href: "#/Tasks", className: TaskTable_module_scss_1.default.viewLink }, "View all tasks"))));
};
exports.TaskTable = TaskTable;
exports.default = exports.TaskTable;
//# sourceMappingURL=TaskTable.js.map