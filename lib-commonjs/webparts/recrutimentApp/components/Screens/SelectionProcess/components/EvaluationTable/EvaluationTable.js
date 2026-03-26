"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var EvaluationTable_module_scss_1 = tslib_1.__importDefault(require("./EvaluationTable.module.scss"));
var EvaluationConfig_1 = require("../../config/EvaluationConfig");
var useEvaluationData_1 = require("../../hooks/useEvaluationData");
var moment_1 = tslib_1.__importDefault(require("moment"));
var EvaluationTable = function (_a) {
    var rows = _a.rows, tooltipData = _a.tooltipData, currentRoleID = _a.currentRoleID, navigation = _a.navigation, tabValue = _a.tabValue, onHover = _a.onHover, onEvaluate = _a.onEvaluate, onShowAlert = _a.onShowAlert, onRefresh = _a.onRefresh, onOpenForm = _a.onOpenForm;
    var _b = (0, react_1.useState)(EvaluationConfig_1.EvalUIConfig.DefaultSortKey), sortKey = _b[0], setSortKey = _b[1];
    var _c = (0, react_1.useState)(EvaluationConfig_1.EvalUIConfig.DefaultSortDir), sortDir = _c[0], setSortDir = _c[1];
    var _d = (0, react_1.useState)(null), hoveredId = _d[0], setHoveredId = _d[1];
    var _e = (0, react_1.useState)(null), loadingId = _e[0], setLoadingId = _e[1];
    var _f = (0, react_1.useState)(1), currentPage = _f[0], setCurrentPage = _f[1];
    var _g = (0, react_1.useState)(5), pageSize = _g[0], setPageSize = _g[1];
    var ITEMS_PER_PAGE = pageSize;
    var handleSort = function (key) {
        setSortDir(function (d) { return sortKey === key ? (d === "asc" ? "desc" : "asc") : "asc"; });
        setSortKey(key);
        setCurrentPage(1);
    };
    var sortedRows = tslib_1.__spreadArray([], rows, true).sort(function (a, b) {
        var _a, _b;
        if ((0, useEvaluationData_1.isSkeleton)(a) || (0, useEvaluationData_1.isSkeleton)(b))
            return 0;
        var va = String((_a = a[sortKey]) !== null && _a !== void 0 ? _a : "");
        var vb = String((_b = b[sortKey]) !== null && _b !== void 0 ? _b : "");
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    var totalPages = Math.ceil(sortedRows.length / ITEMS_PER_PAGE) || 1;
    var safeCurrentPage = Math.min(currentPage, totalPages);
    var startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    var paginatedRows = sortedRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    var handlePrevPage = function () {
        setCurrentPage(function (prev) { return Math.max(prev - 1, 1); });
    };
    var handleNextPage = function () {
        setCurrentPage(function (prev) { return Math.min(prev + 1, totalPages); });
    };
    var getPageButtons = function () {
        var maxButtons = 5;
        if (totalPages <= maxButtons)
            return Array.from({ length: totalPages }, function (_, i) { return i + 1; });
        var pages = [];
        var current = safeCurrentPage;
        if (current <= 3) {
            pages.push(1, 2, 3, "ellipsis", totalPages);
        }
        else if (current >= totalPages - 2) {
            pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
        }
        else {
            pages.push(1, "ellipsis", current - 1, current, current + 1, "ellipsis", totalPages);
        }
        return pages;
    };
    var getNavigationPath = function (statusId) {
        if (statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduled) {
            if (currentRoleID.includes(EvaluationConfig_1.EvalRoleID.HOD) || currentRoleID.includes(EvaluationConfig_1.EvalRoleID.LineManager))
                return EvaluationConfig_1.EvalNavigationPaths.HODLevel1;
            if (currentRoleID.includes(EvaluationConfig_1.EvalRoleID.InterviewPanel))
                return EvaluationConfig_1.EvalNavigationPaths.PanelLevel1;
            return EvaluationConfig_1.EvalNavigationPaths.DefaultLevel1;
        }
        if (statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduledforLevel2) {
            if (currentRoleID.includes(EvaluationConfig_1.EvalRoleID.HOD) || currentRoleID.includes(EvaluationConfig_1.EvalRoleID.LineManager))
                return EvaluationConfig_1.EvalNavigationPaths.HODLevel2;
            if (currentRoleID.includes(EvaluationConfig_1.EvalRoleID.InterviewPanel))
                return EvaluationConfig_1.EvalNavigationPaths.PanelLevel2;
            return EvaluationConfig_1.EvalNavigationPaths.DefaultLevel2;
        }
        return "";
    };
    var handleEvaluateClick = function (row) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var today, interviewDate, displayDate, result, msg, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingId(row.id);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    today = (0, moment_1.default)().startOf('day');
                    interviewDate = (0, moment_1.default)(row.interviewDateTime).startOf('day');
                    if (today.isBefore(interviewDate)) {
                        displayDate = interviewDate.format("DD-MMM-YYYY");
                        onShowAlert("Interview is scheduled for ".concat(displayDate, ". You can evaluate on or after the interview date."), EvaluationConfig_1.EvalAlertOptions.Error);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, onEvaluate(row)];
                case 2:
                    result = _a.sent();
                    if (!result.canProceed) {
                        msg = result.level === EvaluationConfig_1.InterviewLevels.Level1
                            ? EvaluationConfig_1.EvalMessages.InterviewScoredAlready
                            : EvaluationConfig_1.EvalMessages.InterviewScoreCommentsAlready;
                        onShowAlert(msg, EvaluationConfig_1.EvalAlertOptions.Error);
                        return [2 /*return*/];
                    }
                    onOpenForm(row);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Evaluation error:", error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingId(null);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var SortIcon = function (_a) {
        var col = _a.col;
        return (react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.sortIcon }, sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↑↓"));
    };
    return (react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.wrapper },
        react_1.default.createElement("table", { className: EvaluationTable_module_scss_1.default.table },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", { onClick: function () { return handleSort("applicantName"); } },
                        "APPLICANTNAME ",
                        react_1.default.createElement(SortIcon, { col: "applicantName" })),
                    react_1.default.createElement("th", { onClick: function () { return handleSort("positionTitle"); } },
                        "POSITION TITLE ",
                        react_1.default.createElement(SortIcon, { col: "positionTitle" })),
                    react_1.default.createElement("th", { onClick: function () { return handleSort("interviewDate"); } },
                        "INTERVIEW DATE ",
                        react_1.default.createElement(SortIcon, { col: "interviewDate" })),
                    react_1.default.createElement("th", { onClick: function () { return handleSort("interviewLevel"); } },
                        "INTERVIEW LEVELS ",
                        react_1.default.createElement(SortIcon, { col: "interviewLevel" })),
                    react_1.default.createElement("th", { onClick: function () { return handleSort("grade"); } },
                        "GRADE ",
                        react_1.default.createElement(SortIcon, { col: "grade" })),
                    react_1.default.createElement("th", null, "STATUS"),
                    react_1.default.createElement("th", null, "ACTION"))),
            react_1.default.createElement("tbody", null,
                paginatedRows.map(function (row, idx) { return (0, useEvaluationData_1.isSkeleton)(row) ? (react_1.default.createElement("tr", { key: "sk-".concat(idx), className: EvaluationTable_module_scss_1.default.skRow }, [65, 80, 55, 45, 30, 60, 40].map(function (w, ci) { return (react_1.default.createElement("td", { key: ci },
                    react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.shimmer, style: { width: "".concat(w, "%") } }))); }))) : (react_1.default.createElement("tr", { key: row.id, className: EvaluationTable_module_scss_1.default.row },
                    react_1.default.createElement("td", { className: EvaluationTable_module_scss_1.default.nameCell }, row.applicantName),
                    react_1.default.createElement("td", { className: EvaluationTable_module_scss_1.default.posCell }, row.positionTitle),
                    react_1.default.createElement("td", null, row.interviewDate),
                    react_1.default.createElement("td", null, row.interviewLevel),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.grade },
                            react_1.default.createElement("span", null, row.grade),
                            row.gradeLabel && (react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.gradeLabel }, row.gradeLabel)))),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.statusWrap, onMouseEnter: function () { setHoveredId(row.id); onHover(row.statusId, row.id); }, onMouseLeave: function () { return setHoveredId(null); } },
                            react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.dot }),
                            react_1.default.createElement("span", null, row.status),
                            hoveredId === row.id && (tooltipData === null || tooltipData === void 0 ? void 0 : tooltipData.length) ? (react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.tooltip }, tooltipData.map(function (entry, i) { return (react_1.default.createElement("div", { key: i, className: EvaluationTable_module_scss_1.default.tooltipRow },
                                react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.tooltipName }, entry.Key),
                                react_1.default.createElement("span", { className: "".concat(EvaluationTable_module_scss_1.default.badge, " ").concat(entry.Value === "Completed" ? EvaluationTable_module_scss_1.default.completed : EvaluationTable_module_scss_1.default.pending) }, entry.Value))); }))) : null)),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.actionCell },
                            react_1.default.createElement("button", { className: "".concat(EvaluationTable_module_scss_1.default.evaluateBtn, " ").concat(loadingId === row.id ? EvaluationTable_module_scss_1.default.loading : ""), onClick: function () { return handleEvaluateClick(row); }, disabled: loadingId === row.id }, loadingId === row.id ? "LOADING..." : "EVALUATE"))))); }),
                paginatedRows.length === 0 && (react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 7, className: EvaluationTable_module_scss_1.default.empty }, "No candidates found."))))),
        sortedRows.length > 0 && !(0, useEvaluationData_1.isSkeleton)(sortedRows[0]) && (react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.paginationBar },
            react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.paginationInfo },
                "Showing ",
                react_1.default.createElement("strong", null, startIndex + 1),
                " to ",
                react_1.default.createElement("strong", null, Math.min(startIndex + ITEMS_PER_PAGE, sortedRows.length)),
                " of ",
                react_1.default.createElement("strong", null, sortedRows.length),
                " results",
                react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.showEntries },
                    "SHOW",
                    react_1.default.createElement("select", { value: pageSize, onChange: function (e) { setPageSize(Number(e.target.value)); setCurrentPage(1); } }, [5, 10, 20, 50].map(function (s) { return react_1.default.createElement("option", { key: s, value: s }, s); })),
                    "ENTRIES")),
            react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.paginationControls },
                react_1.default.createElement("button", { className: "".concat(EvaluationTable_module_scss_1.default.pageBtn, " ").concat(safeCurrentPage <= 1 ? EvaluationTable_module_scss_1.default.disabled : ""), disabled: safeCurrentPage <= 1, onClick: function () { return setCurrentPage(safeCurrentPage - 1); } }, "\u2039"),
                getPageButtons().map(function (page, i) { return page === "ellipsis" ? (react_1.default.createElement("span", { key: "ellipsis-".concat(i), className: EvaluationTable_module_scss_1.default.ellipsis }, "...")) : (react_1.default.createElement("button", { key: page, className: "".concat(EvaluationTable_module_scss_1.default.pageBtn, " ").concat(page === safeCurrentPage ? EvaluationTable_module_scss_1.default.activePage : ""), onClick: function () { return setCurrentPage(page); } }, page)); }),
                react_1.default.createElement("button", { className: "".concat(EvaluationTable_module_scss_1.default.pageBtn, " ").concat(safeCurrentPage >= totalPages ? EvaluationTable_module_scss_1.default.disabled : ""), disabled: safeCurrentPage >= totalPages, onClick: function () { return setCurrentPage(safeCurrentPage + 1); } }, "\u203A"))))));
};
exports.default = EvaluationTable;
//# sourceMappingURL=EvaluationTable.js.map