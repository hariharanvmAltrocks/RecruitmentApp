"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var TaskTable_module_scss_1 = tslib_1.__importDefault(require("./TaskTable.module.scss"));
var Card_1 = tslib_1.__importDefault(require("../Common/Card"));
var Badge_1 = tslib_1.__importDefault(require("../Common/Badge"));
var DataTable_1 = require("../../../Comman/DataTable/DataTable");
var TaskTable = function (_a) {
    var data = _a.data, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(1), currentPage = _c[0], setCurrentPage = _c[1];
    var _d = (0, react_1.useState)(5), pageSize = _d[0], setPageSize = _d[1];
    var columns = (0, react_1.useMemo)(function () { return [
        {
            id: "task",
            header: "Task",
            render: function (row) { return react_1.default.createElement("span", { className: TaskTable_module_scss_1.default.taskText }, row.task); },
            sortable: true,
        },
        {
            id: "priority",
            header: "Priority",
            render: function (row) {
                var badgeVar = "neutral";
                if (row.priority === "High")
                    badgeVar = "danger";
                else if (row.priority === "Medium")
                    badgeVar = "warning";
                else if (row.priority === "Low")
                    badgeVar = "success";
                return react_1.default.createElement(Badge_1.default, { variant: badgeVar }, row.priority);
            },
            sortable: true,
        },
        {
            id: "dueDate",
            header: "Due Date",
            accessor: "dueDate",
            cellClassName: TaskTable_module_scss_1.default.dueDateCell,
            sortable: true,
        },
        {
            id: "status",
            header: "Status",
            render: function (row) {
                var badgeVar = "neutral";
                if (row.status === "Completed")
                    badgeVar = "success";
                else if (row.status === "In Progress")
                    badgeVar = "primary";
                else if (row.status === "Pending")
                    badgeVar = "warning";
                return react_1.default.createElement(Badge_1.default, { variant: badgeVar }, row.status);
            },
            sortable: true,
        },
    ]; }, []);
    var getRowId = function (row) { return row.id; };
    var tasksList = data || [];
    return (react_1.default.createElement(Card_1.default, { className: TaskTable_module_scss_1.default.container },
        react_1.default.createElement("div", { className: TaskTable_module_scss_1.default.header },
            react_1.default.createElement("h3", { className: TaskTable_module_scss_1.default.title }, "My Tasks")),
        react_1.default.createElement("div", { className: TaskTable_module_scss_1.default.tableWrapper },
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: tasksList, getRowId: getRowId, pageSize: pageSize, currentPage: currentPage, totalCount: tasksList.length, onPageChange: setCurrentPage, onPageSizeChange: setPageSize, loading: loading })),
        react_1.default.createElement("div", { className: TaskTable_module_scss_1.default.footer },
            react_1.default.createElement("a", { href: "#/Tasks", className: TaskTable_module_scss_1.default.viewLink }, "View all tasks"))));
};
exports.TaskTable = TaskTable;
exports.default = exports.TaskTable;
//# sourceMappingURL=TaskTable.js.map