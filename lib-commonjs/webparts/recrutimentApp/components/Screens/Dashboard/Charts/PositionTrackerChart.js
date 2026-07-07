"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionTrackerChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var recharts_1 = require("recharts");
var PositionTrackerChart_module_scss_1 = tslib_1.__importDefault(require("./PositionTrackerChart.module.scss"));
var Card_1 = tslib_1.__importDefault(require("../Common/Card"));
var PositionTrackerChart = function (_a) {
    var data = _a.data, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(1), currentPage = _c[0], setCurrentPage = _c[1];
    var itemsPerPage = 4;
    var trackerList = data || [];
    var totalPages = Math.ceil(trackerList.length / itemsPerPage);
    var safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    var indexOfLastItem = safeCurrentPage * itemsPerPage;
    var indexOfFirstItem = indexOfLastItem - itemsPerPage;
    var chartData = (0, react_1.useMemo)(function () { return trackerList.slice(indexOfFirstItem, indexOfLastItem); }, [trackerList, indexOfFirstItem, indexOfLastItem]);
    var memoizedOptions = (0, react_1.useMemo)(function () {
        return {
            tooltipCursor: { fill: "rgba(0, 0, 0, 0.02)" },
            barRadius: [4, 4, 0, 0],
        };
    }, []);
    if (loading || !data) {
        return (react_1.default.createElement(Card_1.default, { className: PositionTrackerChart_module_scss_1.default.chartCard },
            react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.header },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "180px", height: "14px" } })),
            react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.chartPlaceholder, style: { padding: "20px 0" } },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "100%", height: "200px", borderRadius: "8px" } }))));
    }
    return (react_1.default.createElement(Card_1.default, { className: PositionTrackerChart_module_scss_1.default.chartCard },
        react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.header },
            react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: PositionTrackerChart_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: PositionTrackerChart_module_scss_1.default.title }, "My Positions Tracker (Monthly)")),
        react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.chartContainer },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 220 },
                react_1.default.createElement(recharts_1.ComposedChart, { data: chartData, margin: { top: 10, right: 10, left: 15, bottom: 0 } },
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
                    react_1.default.createElement(recharts_1.XAxis, { dataKey: "month", tickLine: false, axisLine: false, tick: { fill: "#94a3b8", fontSize: 10, fontWeight: 600 } }),
                    react_1.default.createElement(recharts_1.YAxis, { tickLine: false, axisLine: false, tick: { fill: "#94a3b8", fontSize: 10, fontWeight: 600 } }),
                    react_1.default.createElement(recharts_1.Tooltip, { cursor: memoizedOptions.tooltipCursor }),
                    react_1.default.createElement(recharts_1.Legend, { verticalAlign: "top", align: "left", iconType: "circle", iconSize: 8, wrapperStyle: { paddingBottom: 15, fontSize: 11, fontWeight: 700, color: "#64748b" } }),
                    react_1.default.createElement(recharts_1.Bar, { name: "Total Positions", dataKey: "totalPositions", fill: "#3b82f6", radius: memoizedOptions.barRadius, barSize: 12 }),
                    react_1.default.createElement(recharts_1.Bar, { name: "Positions Filled", dataKey: "positionsFilled", fill: "#10b981", radius: memoizedOptions.barRadius, barSize: 12 }),
                    react_1.default.createElement(recharts_1.Line, { name: "Open Positions", type: "monotone", dataKey: "openPositions", stroke: "#f59e0b", strokeWidth: 2, dot: { r: 4, strokeWidth: 1, fill: "#fff" }, activeDot: { r: 6 } })))),
        trackerList.length > itemsPerPage && (react_1.default.createElement("div", { className: PositionTrackerChart_module_scss_1.default.pagination, role: "navigation", "aria-label": "Pagination" },
            react_1.default.createElement("button", { className: PositionTrackerChart_module_scss_1.default.pageArrow, type: "button", onClick: function () { return setCurrentPage(function (prev) { return Math.max(1, prev - 1); }); }, disabled: safeCurrentPage === 1, "aria-label": "Previous page" }, "\u2039"),
            Array.from({ length: totalPages }).map(function (_, idx) {
                var pageNum = idx + 1;
                return (react_1.default.createElement("button", { key: pageNum, type: "button", className: "".concat(PositionTrackerChart_module_scss_1.default.pageNumber, " ").concat(safeCurrentPage === pageNum ? PositionTrackerChart_module_scss_1.default.active : ""), onClick: function () { return setCurrentPage(pageNum); } }, pageNum));
            }),
            react_1.default.createElement("button", { className: PositionTrackerChart_module_scss_1.default.pageArrow, type: "button", onClick: function () { return setCurrentPage(function (prev) { return Math.min(totalPages, prev + 1); }); }, disabled: safeCurrentPage === totalPages, "aria-label": "Next page" }, "\u203A")))));
};
exports.PositionTrackerChart = PositionTrackerChart;
exports.default = exports.PositionTrackerChart;
//# sourceMappingURL=PositionTrackerChart.js.map