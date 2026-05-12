"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
require("./tracker.scss");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var DataTable_1 = require("../DataTable/DataTable");
var Tracker = function (_a) {
    var _b, _c;
    var rows = _a.rows, selectedMetric = _a.selectedMetric, activeMetric = _a.activeMetric, onRowClick = _a.onRowClick;
    var _d = (0, react_1.useState)(1), currentPage = _d[0], setCurrentPage = _d[1];
    var _e = (0, react_1.useState)(10), pageSize = _e[0], setPageSize = _e[1];
    // 🔹 Exclude unwanted columns (optional)
    var excludeColumns = (0, react_1.useMemo)(function () { return ["ID"]; }, []);
    // 🔹 Format header (camelCase → Proper Text)
    var formatHeader = function (key) {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .replace(/^./, function (str) { return str.toUpperCase(); });
    };
    // 🔹 Render cell safely
    var renderCell = function (value) {
        if (value === null || value === undefined)
            return "-";
        // Date formatting (basic check)
        if (typeof value === "string" && value.includes("-")) {
            return value;
        }
        if (typeof value === "object") {
            return JSON.stringify(value);
        }
        return String(value);
    };
    // 🔹 Generate dynamic columns
    var columns = (0, react_1.useMemo)(function () {
        if (!rows || rows.length === 0)
            return [];
        var dynamicKeys = Object.keys(rows[0]).filter(function (key) { return !excludeColumns.includes(key); });
        var generatedCols = dynamicKeys.map(function (key) { return ({
            id: key,
            header: formatHeader(key),
            accessor: key,
            render: function (item) {
                var value = item[key];
                var formattedValue = renderCell(value);
                if (key === "JobCode" && item.JobCode) {
                    return (react_1.default.createElement("span", { className: "candidate-table__code" }, formattedValue));
                }
                if (key === "JobTitle" && item.JobTitle) {
                    return (react_1.default.createElement("span", { className: "data-table__job-title" }, formattedValue));
                }
                if (key === "ApplicantName" && item.ApplicantName) {
                    return (react_1.default.createElement("span", { className: "candidate-table__code" }, formattedValue));
                }
                if (key === "PositionTitle" && item.PositionTitle) {
                    return (react_1.default.createElement("span", { className: "data-table__job-title" }, formattedValue));
                }
                if (key === "InterviewDate" && item.InterviewDate) {
                    return (react_1.default.createElement("span", { className: "candidate-table__code" }, formattedValue));
                }
                if (key === "PositionID" && item.PositionID) {
                    return (react_1.default.createElement("span", { className: "candidate-table__code" }, formattedValue));
                }
                if (key === "CandidateCount" && item.CandidateCount) {
                    return (react_1.default.createElement("span", { className: "candidate-table__code" }, formattedValue));
                }
                if (key === "Status" || key === "status") {
                    return react_1.default.createElement("span", { className: "status-badge" }, formattedValue);
                }
                return react_1.default.createElement(react_1.default.Fragment, null, formattedValue);
            },
        }); });
        if (selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.showArrow) {
            generatedCols.push({
                id: "actionArrow",
                header: "",
                align: "right",
                width: 50,
                render: function () { return (react_1.default.createElement("div", { style: {
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        height: "100%",
                    } },
                    react_1.default.createElement(framer_motion_1.motion.div, { whileHover: { x: 5, color: "#3F62ED" }, transition: { duration: 0.2 }, style: { display: "flex", alignItems: "center" } },
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 })))); },
            });
        }
        return generatedCols;
    }, [rows, excludeColumns, selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.showArrow]);
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "tracker", key: "tracker", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
        react_1.default.createElement("div", { className: "tracker__header" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("h2", null, "RECRUITMENT BACKLOG"),
                react_1.default.createElement("p", null,
                    "Showing ",
                    react_1.default.createElement("b", null, (_b = selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.value) !== null && _b !== void 0 ? _b : 0),
                    " results for",
                    " ",
                    react_1.default.createElement("span", { className: "highlight" }, (_c = selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.label) !== null && _c !== void 0 ? _c : "-")))),
        react_1.default.createElement("div", { className: "tracker__table-wrapper" },
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: rows, loading: false, pageSize: pageSize, currentPage: currentPage, totalCount: rows.length, emptyMessage: "No data available", onPageChange: setCurrentPage, onPageSizeChange: setPageSize, onRowClick: onRowClick }))));
};
exports.default = Tracker;
//# sourceMappingURL=Tracker.js.map