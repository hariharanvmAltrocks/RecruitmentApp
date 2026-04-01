"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecruitmentColumns = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var react_2 = tslib_1.__importDefault(require("react"));
var useRecruitmentColumns = function (_a) {
    var _b;
    var role = _a.role, actionMode = _a.actionMode, onAction = _a.onAction;
    var onActionRef = (0, react_1.useRef)(onAction);
    (0, react_1.useEffect)(function () {
        onActionRef.current = onAction;
    }, [onAction]);
    var actionColumn = (0, react_1.useMemo)(function () { return ({
        id: "actions",
        header: "Actions",
        align: "right",
        cellClassName: "data-table__cell--actions",
        render: function (item) { return (react_2.default.createElement("button", { className: "data-table__action-btn", onClick: function () { return onActionRef.current(item); }, type: "button", "aria-label": actionMode === "Upload" ? "Upload document" : "View vacancy" },
            actionMode === "Upload" ? react_2.default.createElement(lucide_react_1.Upload, { size: 16 }) : react_2.default.createElement(lucide_react_1.Eye, { size: 16 }),
            actionMode === "Upload" ? "Upload" : "View")); },
    }); }, [actionMode]);
    var defaultColumns = (0, react_1.useMemo)(function () { return [
        {
            id: "jobCode",
            header: "Job Code",
            accessor: "jobCode",
            cellClassName: "data-table__cell--muted",
        },
        {
            id: "title",
            header: "Job Title & Dept",
            render: function (item) { return (react_2.default.createElement("div", { className: "data-table__job-title" },
                react_2.default.createElement("span", null, item.title),
                react_2.default.createElement("span", { className: "data-table__job-dept" }, item.department))); },
        },
        {
            id: "count",
            header: "Count",
            render: function (item) { return String(item.count).padStart(2, "0"); },
            cellClassName: "data-table__cell--count",
            align: "center",
            hideOnMobile: true,
        },
        {
            id: "requestType",
            header: "Request Type",
            accessor: "requestType",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "nationality",
            header: "Nationality",
            accessor: "nationality",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "status",
            header: "Status",
            render: function (item) { return (react_2.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status)); },
        },
        actionColumn,
    ]; }, [actionColumn]);
    var evaluationColumns = (0, react_1.useMemo)(function () { return [
        {
            id: "applicantName",
            header: "Applicant Name",
            accessor: "applicantName",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "title",
            header: "Position Title",
            render: function (item) { return (react_2.default.createElement("div", { className: "data-table__job-title" },
                react_2.default.createElement("span", null, item.title),
                react_2.default.createElement("span", { className: "data-table__job-dept" }, item.department))); },
        },
        {
            id: "interviewDate",
            header: "Interview Date",
            accessor: "interviewDate",
            align: "center",
            cellClassName: "data-table__cell--count",
            hideOnMobile: true,
        },
        {
            id: "interviewLevels",
            header: "Interview Levels",
            accessor: "interviewLevels",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "grade",
            header: "Grade",
            accessor: "grade",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "status",
            header: "Status",
            render: function (item) { return (react_2.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status)); },
        },
        actionColumn,
    ]; }, [actionColumn]);
    var columnMap = {
        default: defaultColumns,
        evaluation: evaluationColumns,
    };
    return (_b = columnMap[role]) !== null && _b !== void 0 ? _b : defaultColumns;
};
exports.useRecruitmentColumns = useRecruitmentColumns;
//# sourceMappingURL=config.js.map