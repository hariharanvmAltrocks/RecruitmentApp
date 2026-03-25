"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// ReviewScorecardTable.tsx — Image 7 exact UI
var react_1 = tslib_1.__importStar(require("react"));
var ReviewScorecardTable_module_scss_1 = tslib_1.__importDefault(require("./ReviewScorecardTable.module.scss"));
var SortArrow = function (_a) {
    var col = _a.col, sk = _a.sk, sd = _a.sd;
    return (react_1.default.createElement("span", { className: ReviewScorecardTable_module_scss_1.default.sortIcon }, sk === col ? (sd === "asc" ? "↑" : "↓") : "↑↓"));
};
var ReviewScorecardTable = function (_a) {
    var jobs = _a.jobs, loading = _a.loading, onReview = _a.onReview, onNavigate = _a.onNavigate;
    var _b = (0, react_1.useState)("jobCode"), sk = _b[0], setSk = _b[1];
    var _c = (0, react_1.useState)("asc"), sd = _c[0], setSd = _c[1];
    var _d = (0, react_1.useState)(1), page = _d[0], setPage = _d[1];
    var _e = (0, react_1.useState)(5), perPage = _e[0], setPerPage = _e[1];
    var handleSort = function (col) {
        setSd(function (d) { return sk === col ? (d === "asc" ? "desc" : "asc") : "asc"; });
        setSk(col);
        setPage(1);
    };
    var sorted = tslib_1.__spreadArray([], jobs, true).sort(function (a, b) {
        var _a, _b;
        var va = String((_a = a[sk]) !== null && _a !== void 0 ? _a : "");
        var vb = String((_b = b[sk]) !== null && _b !== void 0 ? _b : "");
        return sd === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    var total = Math.ceil(sorted.length / perPage) || 1;
    var safe = Math.min(page, total);
    var start = (safe - 1) * perPage;
    var paged = sorted.slice(start, start + perPage);
    var TH = function (_a) {
        var col = _a.col, label = _a.label;
        return (react_1.default.createElement("th", { className: ReviewScorecardTable_module_scss_1.default.th, onClick: function () { return handleSort(col); } },
            label,
            " ",
            react_1.default.createElement(SortArrow, { col: col, sk: sk, sd: sd })));
    };
    if (loading)
        return (react_1.default.createElement("div", { className: ReviewScorecardTable_module_scss_1.default.wrapper }, Array.from({ length: 5 }, function (_, i) { return (react_1.default.createElement("div", { key: i, className: ReviewScorecardTable_module_scss_1.default.skRow }, [80, 280, 120, 160, 100, 180, 80].map(function (w, j) { return (react_1.default.createElement("span", { key: j, className: ReviewScorecardTable_module_scss_1.default.shimmer, style: { width: w } })); }))); })));
    return (react_1.default.createElement("div", { className: ReviewScorecardTable_module_scss_1.default.wrapper },
        react_1.default.createElement("table", { className: ReviewScorecardTable_module_scss_1.default.table },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement(TH, { col: "jobCode", label: "JOB CODE" }),
                    react_1.default.createElement(TH, { col: "jobTitle", label: "JOB TITLE" }),
                    react_1.default.createElement(TH, { col: "businessUnitCode", label: "BUSINESSUNIT CODE" }),
                    react_1.default.createElement(TH, { col: "positionRequest", label: "POSITION REQUEST" }),
                    react_1.default.createElement(TH, { col: "nationality", label: "NATIONALITY" }),
                    react_1.default.createElement("th", { className: ReviewScorecardTable_module_scss_1.default.th }, "STATUS"),
                    react_1.default.createElement("th", { className: ReviewScorecardTable_module_scss_1.default.th }, "ACTION"))),
            react_1.default.createElement("tbody", null,
                paged.map(function (job) { return (react_1.default.createElement("tr", { key: job.id, className: ReviewScorecardTable_module_scss_1.default.row },
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("span", { className: ReviewScorecardTable_module_scss_1.default.jobCode }, job.jobCode)),
                    react_1.default.createElement("td", { className: ReviewScorecardTable_module_scss_1.default.jobTitle }, job.jobTitle),
                    react_1.default.createElement("td", { className: ReviewScorecardTable_module_scss_1.default.cell }, job.businessUnitCode),
                    react_1.default.createElement("td", { className: ReviewScorecardTable_module_scss_1.default.cell }, job.positionRequest),
                    react_1.default.createElement("td", { className: ReviewScorecardTable_module_scss_1.default.cell }, job.nationality),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: ReviewScorecardTable_module_scss_1.default.statusWrap },
                            react_1.default.createElement("span", { className: ReviewScorecardTable_module_scss_1.default.statusDot }),
                            react_1.default.createElement("span", { className: ReviewScorecardTable_module_scss_1.default.cell }, job.status))),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("button", { className: ReviewScorecardTable_module_scss_1.default.reviewBtn, onClick: function () { return onReview(job); } }, "REVIEW")))); }),
                paged.length === 0 && react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 7, className: ReviewScorecardTable_module_scss_1.default.empty }, "No jobs found.")))),
        sorted.length > 0 && (react_1.default.createElement("div", { className: ReviewScorecardTable_module_scss_1.default.footer },
            react_1.default.createElement("span", { className: ReviewScorecardTable_module_scss_1.default.showLabel },
                "Showing ",
                react_1.default.createElement("b", null, start + 1),
                " to ",
                react_1.default.createElement("b", null, Math.min(start + perPage, sorted.length)),
                " of ",
                react_1.default.createElement("b", null, sorted.length),
                " results"),
            react_1.default.createElement("div", { className: ReviewScorecardTable_module_scss_1.default.showEntries },
                react_1.default.createElement("span", null, "SHOW"),
                react_1.default.createElement("select", { className: ReviewScorecardTable_module_scss_1.default.perPageSel, value: perPage, onChange: function (e) { setPerPage(Number(e.target.value)); setPage(1); } }, [5, 10, 25, 50].map(function (n) { return react_1.default.createElement("option", { key: n, value: n }, n); })),
                react_1.default.createElement("span", null, "ENTRIES")),
            react_1.default.createElement("div", { className: ReviewScorecardTable_module_scss_1.default.pageBtns },
                react_1.default.createElement("button", { className: ReviewScorecardTable_module_scss_1.default.pageBtn, onClick: function () { return setPage(function (p) { return Math.max(p - 1, 1); }); }, disabled: safe === 1 }, "\u2039"),
                Array.from({ length: total }, function (_, i) { return (react_1.default.createElement("button", { key: i, className: "".concat(ReviewScorecardTable_module_scss_1.default.pageBtn, " ").concat(safe === i + 1 ? ReviewScorecardTable_module_scss_1.default.pageBtnActive : ""), onClick: function () { return setPage(i + 1); } }, i + 1)); }),
                react_1.default.createElement("button", { className: ReviewScorecardTable_module_scss_1.default.pageBtn, onClick: function () { return setPage(function (p) { return Math.min(p + 1, total); }); }, disabled: safe === total }, "\u203A"))))));
};
exports.default = ReviewScorecardTable;
//# sourceMappingURL=ReviewScorecardTable.js.map