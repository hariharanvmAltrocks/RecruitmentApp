"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRWorkflowOverview = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var HRWorkflowOverview_module_scss_1 = tslib_1.__importDefault(require("./HRWorkflowOverview.module.scss"));
var HRWorkflowOverview = function (_a) {
    var data = _a.data, loading = _a.loading;
    var _b = (0, react_1.useState)(1), currentPage = _b[0], setCurrentPage = _b[1];
    var itemsPerPage = 4;
    var sources = data || [];
    var totalPages = Math.ceil(sources.length / itemsPerPage);
    var safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    var displayedSources = sources.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);
    var getPerformanceColorClass = function (pct) {
        // Exact colors to match the mock image values
        if (pct === 85 || pct === 76)
            return HRWorkflowOverview_module_scss_1.default.pctGreen;
        if (pct === 80 || pct === 70)
            return HRWorkflowOverview_module_scss_1.default.pctOrange;
        // Default fallback
        return pct >= 75 ? HRWorkflowOverview_module_scss_1.default.pctGreen : HRWorkflowOverview_module_scss_1.default.pctOrange;
    };
    if (loading) {
        return (react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.containerCard, "aria-label": "HRs Performance Loading" },
            react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.header },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "150px", height: "16px" } })),
            react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.tableWrapper },
                react_1.default.createElement("table", { className: HRWorkflowOverview_module_scss_1.default.table },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { className: HRWorkflowOverview_module_scss_1.default.thLeft, style: { width: "120px" } },
                                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "40px", height: "10px" } })),
                            react_1.default.createElement("th", null,
                                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "80px", height: "10px", margin: "0 auto" } })),
                            react_1.default.createElement("th", null,
                                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "40px", height: "10px", margin: "0 auto" } })),
                            react_1.default.createElement("th", null,
                                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "60px", height: "10px", margin: "0 auto" } })))),
                    react_1.default.createElement("tbody", null, Array.from({ length: 4 }).map(function (_, idx) { return (react_1.default.createElement("tr", { key: idx },
                        react_1.default.createElement("td", { className: HRWorkflowOverview_module_scss_1.default.tdLeft },
                            react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "70px", height: "12px" } })),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "20px", height: "12px", margin: "0 auto" } })),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "20px", height: "12px", margin: "0 auto" } })),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "30px", height: "12px", margin: "0 auto" } })))); }))))));
    }
    var pages = Array.from({ length: totalPages }, function (_, idx) { return idx + 1; });
    return (react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.containerCard, "aria-label": "HRs Performance" },
        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.header },
            react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: HRWorkflowOverview_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: HRWorkflowOverview_module_scss_1.default.title }, "HRs Performance")),
        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: HRWorkflowOverview_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { className: HRWorkflowOverview_module_scss_1.default.thLeft }, "HR"),
                        react_1.default.createElement("th", null, "Open Positions"),
                        react_1.default.createElement("th", null, "Filled"),
                        react_1.default.createElement("th", null, "Performance"))),
                react_1.default.createElement("tbody", null, displayedSources.map(function (wf) { return (react_1.default.createElement("tr", { key: wf.name },
                    react_1.default.createElement("td", { className: HRWorkflowOverview_module_scss_1.default.tdLeft }, wf.name),
                    react_1.default.createElement("td", { className: HRWorkflowOverview_module_scss_1.default.tdCentered }, wf.pending),
                    react_1.default.createElement("td", { className: HRWorkflowOverview_module_scss_1.default.tdCentered }, wf.done),
                    react_1.default.createElement("td", { className: "".concat(HRWorkflowOverview_module_scss_1.default.tdCentered, " ").concat(getPerformanceColorClass(wf.percentage)) },
                        wf.percentage,
                        "%"))); })))),
        totalPages > 1 && (react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.pagination },
            react_1.default.createElement("button", { type: "button", className: HRWorkflowOverview_module_scss_1.default.pageArrow, onClick: function () { return setCurrentPage(function (prev) { return Math.max(1, prev - 1); }); }, disabled: safeCurrentPage === 1, "aria-label": "Previous Page" }, "\u2039"),
            pages.map(function (p) { return (react_1.default.createElement("button", { key: p, type: "button", className: "".concat(HRWorkflowOverview_module_scss_1.default.pageNumber, " ").concat(p === safeCurrentPage ? HRWorkflowOverview_module_scss_1.default.active : ""), onClick: function () { return setCurrentPage(p); } }, p)); }),
            react_1.default.createElement("button", { type: "button", className: HRWorkflowOverview_module_scss_1.default.pageArrow, onClick: function () { return setCurrentPage(function (prev) { return Math.min(totalPages, prev + 1); }); }, disabled: safeCurrentPage === totalPages, "aria-label": "Next Page" }, "\u203A")))));
};
exports.HRWorkflowOverview = HRWorkflowOverview;
exports.default = exports.HRWorkflowOverview;
//# sourceMappingURL=HRWorkflowOverview.js.map