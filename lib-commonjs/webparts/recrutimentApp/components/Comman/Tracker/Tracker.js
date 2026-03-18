"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
require("./tracker.scss");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var Tracker = function (_a) {
    var _b, _c;
    var rows = _a.rows, selectedMetric = _a.selectedMetric, activeMetric = _a.activeMetric, onRowClick = _a.onRowClick;
    // 🔹 Exclude unwanted columns (optional)
    var excludeColumns = ["ID"];
    // 🔹 Generate dynamic columns
    var columns = (0, react_1.useMemo)(function () {
        if (!rows || rows.length === 0)
            return [];
        return Object.keys(rows[0]).filter(function (key) { return !excludeColumns.includes(key); });
    }, [rows]);
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
        return value;
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "tracker", key: "tracker", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 } },
        react_1.default.createElement("div", { className: "tracker__header" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("h2", null, "My Tracker"),
                react_1.default.createElement("p", null,
                    "Showing ",
                    react_1.default.createElement("b", null, (_b = selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.value) !== null && _b !== void 0 ? _b : 0),
                    " results for",
                    " ",
                    react_1.default.createElement("span", { className: "highlight" }, (_c = selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.label) !== null && _c !== void 0 ? _c : "-"))),
            react_1.default.createElement("button", { className: "view-btn" }, "View All Tasks")),
        react_1.default.createElement("div", { className: "tracker__table-wrapper" },
            react_1.default.createElement("table", { className: "tracker__table" },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        columns.map(function (col) { return (react_1.default.createElement("th", { key: col }, formatHeader(col))); }),
                        (selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.showArrow) && react_1.default.createElement("th", null))),
                react_1.default.createElement("tbody", null, rows.length === 0 ? (react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: columns.length + 1, className: "no-data" }, "No data available"))) : (rows.map(function (row, index) { return (react_1.default.createElement("tr", { key: index, onClick: function () { return onRowClick === null || onRowClick === void 0 ? void 0 : onRowClick(row); }, style: { cursor: onRowClick ? "pointer" : "default" } },
                    columns.map(function (col) { return (react_1.default.createElement("td", { key: col },
                        react_1.default.createElement("span", { className: col === "Status" ? "status-badge" : "" }, renderCell(row[col])))); }),
                    (selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.showArrow) && (react_1.default.createElement("td", { className: "arrow" },
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 }))))); })))))));
};
exports.default = Tracker;
//# sourceMappingURL=Tracker.js.map